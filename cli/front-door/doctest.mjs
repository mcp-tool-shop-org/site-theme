/**
 * front-door — the doctest (example-binding) channel.
 *
 * Two levels of binding, weakest-but-always-on first:
 *
 *  1. STATIC (default, no execution). The strongest cheap binding is "the
 *     example uses the real API": when a documented code example imports from
 *     THIS package, the imported entry point must exist in package.json
 *     "exports". An example that imports an unexported subpath is a contradicted
 *     claim — the snippet cannot run as written.
 *
 *  2. EXECUTABLE (opt-in, gated behind `exec`). Rustdoc-style: actually
 *     COMPILE/RUN the fenced JS examples. Examples whose imports are limited to
 *     Node builtins + this package are RUN in a child process (catches syntax
 *     AND runtime errors); examples that pull in third-party/relative modules,
 *     or are tagged `no_run`, are COMPILE-checked only (`node --check`, which
 *     never resolves imports — so nothing is installed). An example tagged
 *     `+SKIP` / `ignore` is treated as UNBACKED, not passing: a skipped example
 *     backs no claim. See DESIGN.md (slice 11).
 *
 * Safety contract for the executable channel (no arbitrary network/install):
 *  - opt-in only; default `verify` never executes anything and stays read-only.
 *  - the tool never runs a package manager / never installs.
 *  - only examples importing solely Node builtins + this package are EXECUTED;
 *    anything else is syntax-checked, never run.
 *  - each example runs in its own child process with a hard timeout.
 *  - compile-checks use a temp file under the OS temp dir, deleted immediately
 *    (NAMED_COMPENSATOR: unlinkSync in finally); nothing is written to the repo.
 */

import { spawnSync } from 'node:child_process';
import { unlinkSync, writeFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { extractCodeBlocks } from './extract.mjs';
import { BUCKET, CHANNEL, finding, SEVERITY } from './model.mjs';

const IMPORT_RE = /(?:import\b[^'"]*from\s*|import\s*|require\s*\(\s*)['"]([^'"]+)['"]/g;
const CODE_LANG_RE = /(js|jsx|ts|tsx|mjs|cjs|javascript|typescript|astro)/;
// Only these langs are compiled/run — plain Node can parse + execute them. ts /
// tsx / jsx / astro would need a toolchain (which we refuse to install), so they
// stay static-only.
const RUNNABLE_LANG = /^(js|mjs|cjs|javascript)$/;

const DOCTEST_TIMEOUT_MS = 5000;
const BUILTINS = new Set([...builtinModules, ...builtinModules.map((m) => `node:${m}`)]);

let tmpSeq = 0;

/** The set of export subpath keys, or null when the package declares none. */
function exportKeys(pkg) {
  const exp = pkg?.exports;
  if (!exp) return null;
  if (typeof exp === 'string') return new Set(['.']);
  return new Set(Object.keys(exp));
}

function isExported(keys, subpath) {
  const key = subpath ? `./${subpath}` : '.';
  if (keys.has(key)) return true;
  for (const k of keys) {
    if (k.endsWith('/*') && key.startsWith(k.slice(0, -1))) return true;
  }
  return false;
}

/** Static self-import findings for one code block (the always-on v1 binding). */
function staticImportFindings(block, fileName, pkgName, keys) {
  const out = [];
  const lines = block.code.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    IMPORT_RE.lastIndex = 0;
    for (let m = IMPORT_RE.exec(lines[i]); m !== null; m = IMPORT_RE.exec(lines[i])) {
      const spec = m[1];
      if (spec !== pkgName && !spec.startsWith(`${pkgName}/`)) continue;
      const subpath = spec === pkgName ? '' : spec.slice(pkgName.length + 1);
      if (isExported(keys, subpath)) continue;
      out.push(
        finding({
          severity: SEVERITY.CONTRADICTED,
          bucket: BUCKET.CONTRADICTED,
          channel: CHANNEL.DOCTEST,
          file: fileName,
          line: block.startLine + i,
          title: `Example imports an unexported entry: ${spec}`,
          detail: `${fileName} shows \`import … from '${spec}'\`, but package.json "exports" does not expose ${
            subpath ? `"./${subpath}"` : 'the root "."'
          }; the snippet cannot run as written.`,
          claim: spec,
          evidence: `exports: ${[...keys].join(', ')}`,
          hint: 'Add the subpath to package.json "exports", or fix the example to use a real entry point.',
        }),
      );
    }
  }
  return out;
}

/** Split a fence info string ("js no_run") into its lang + trailing directives. */
function parseInfo(raw) {
  const tokens = (raw || '').split(/\s+/).filter(Boolean);
  return { lang: tokens[0] ?? '', directives: tokens.slice(1) };
}

const SKIP_COMMENT_RE = /(?:\/\/|#|\/\*)\s*(?:doctest|front-door)\s*:\s*\+?(?:skip|ignore)\b/i;
const NORUN_COMMENT_RE = /(?:\/\/|#|\/\*)\s*(?:doctest|front-door)\s*:\s*\+?(?:no[_-]?run|compile[_-]?only)\b/i;

/**
 * Decide whether an example opts out of execution. Directives can ride on the
 * fence info string (```js +SKIP) or appear as a `// doctest: +SKIP` comment.
 * Tokens are already lower-cased by extractCodeBlocks; strip a leading `+`.
 */
function classifyDirectives(directives, code) {
  const set = new Set(directives.map((d) => d.replace(/^\++/, '')));
  const skip = set.has('skip') || set.has('ignore') || SKIP_COMMENT_RE.test(code);
  const noRun =
    set.has('no_run') ||
    set.has('norun') ||
    set.has('compile_only') ||
    set.has('compileonly') ||
    NORUN_COMMENT_RE.test(code);
  return { skip, noRun };
}

/** Every import/require specifier referenced by the example. */
function importsOf(code) {
  const specs = [];
  IMPORT_RE.lastIndex = 0;
  for (let m = IMPORT_RE.exec(code); m !== null; m = IMPORT_RE.exec(code)) specs.push(m[1]);
  return specs;
}

/**
 * Safe to EXECUTE only when every import resolves without installing anything:
 * a Node builtin, or this package itself (resolved via Node self-referencing).
 * Anything else (third-party, relative path) is compile-checked, never run.
 */
function safeToRun(specs, pkgName) {
  return specs.every(
    (s) => BUILTINS.has(s) || s.startsWith('node:') || (pkgName && (s === pkgName || s.startsWith(`${pkgName}/`))),
  );
}

/** Pick the module system so the child interprets `import` vs `require` right. */
function moduleKind(code) {
  if (/(^|\s)(?:import|export)\s/.test(code) || /\bimport\s*\(/.test(code)) return 'module';
  if (/\brequire\s*\(/.test(code) || /\bmodule\.exports\b/.test(code) || /\bexports\.[A-Za-z_$]/.test(code)) {
    return 'commonjs';
  }
  return 'module';
}

/** Collapse noisy child output into a one-line excerpt for a finding's detail. */
function excerpt(text, max = 240) {
  const s = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

function timedOut(res) {
  return Boolean(res.error && (res.error.code === 'ETIMEDOUT' || res.signal === 'SIGTERM'));
}

/** Syntax-only check (`node --check`); never resolves imports → never installs. */
function compileCheck(code, kind) {
  const ext = kind === 'commonjs' ? 'cjs' : 'mjs';
  const file = join(tmpdir(), `front-door-doctest-${process.pid}-${tmpSeq++}.${ext}`);
  try {
    writeFileSync(file, code, 'utf-8');
    return spawnSync(process.execPath, ['--check', file], { timeout: DOCTEST_TIMEOUT_MS, encoding: 'utf-8' });
  } finally {
    try {
      unlinkSync(file);
    } catch {
      /* best-effort cleanup */
    }
  }
}

/**
 * Run or compile a single example and return a finding when it doesn't hold up,
 * or null when it is backed (ran clean / compiled clean).
 */
function execExample({ fileName, block, noRun, pkgName, repoRoot }) {
  const code = block.code;
  const kind = moduleKind(code);
  const runnable = !noRun && safeToRun(importsOf(code), pkgName);
  const base = { channel: CHANNEL.DOCTEST, file: fileName, line: block.startLine };

  if (runnable) {
    const res = spawnSync(process.execPath, [`--input-type=${kind}`], {
      input: code,
      cwd: repoRoot,
      timeout: DOCTEST_TIMEOUT_MS,
      encoding: 'utf-8',
      maxBuffer: 1 << 20,
    });
    if (timedOut(res)) {
      return finding({
        ...base,
        severity: SEVERITY.CONTRADICTED,
        bucket: BUCKET.CONTRADICTED,
        title: 'Doctest example timed out',
        detail: `The example did not finish within ${DOCTEST_TIMEOUT_MS}ms when executed; it cannot run as written.`,
        hint: 'Make the example terminate quickly, or tag it `no_run` if it needs external setup.',
      });
    }
    if (res.status !== 0) {
      return finding({
        ...base,
        severity: SEVERITY.CONTRADICTED,
        bucket: BUCKET.CONTRADICTED,
        title: 'Doctest example fails to run',
        detail: `The example exited with code ${res.status} when executed: ${excerpt(res.stderr)}`,
        hint: 'Fix the example so it runs as written, or tag it `no_run` if it requires external setup.',
      });
    }
    return null;
  }

  const res = compileCheck(code, kind);
  if (timedOut(res)) return null; // a compile check that hangs is not a claim defect
  if (res.status !== 0) {
    return finding({
      ...base,
      severity: SEVERITY.CONTRADICTED,
      bucket: BUCKET.CONTRADICTED,
      title: 'Doctest example fails to compile',
      detail: `\`node --check\` rejected the example: ${excerpt(res.stderr)}`,
      hint: 'Fix the syntax error in the example.',
    });
  }
  return null;
}

/**
 * @param {{files: {name:string, content:string}[], pkg: object, repoRoot?: string,
 *   exec?: boolean}} ctx
 * @returns {object[]} findings
 */
export function checkDoctest({ files, pkg, repoRoot = process.cwd(), exec = false }) {
  const findings = [];
  const pkgName = pkg?.name;
  const keys = exportKeys(pkg);
  const canStaticCheck = Boolean(pkgName && keys);

  for (const file of files) {
    if (!file?.content) continue;
    for (const block of extractCodeBlocks(file.content)) {
      const { lang, directives } = parseInfo(block.lang);
      if (lang && !CODE_LANG_RE.test(lang)) continue; // only code-ish blocks (empty lang ok)

      // (1) static self-import vs exports — always on.
      const staticFindings = canStaticCheck ? staticImportFindings(block, file.name, pkgName, keys) : [];
      if (staticFindings.length) {
        // The block already contradicts itself; don't also try to run it.
        findings.push(...staticFindings);
        continue;
      }

      // (2) executable channel — opt-in, JS-family only.
      if (!exec || !RUNNABLE_LANG.test(lang)) continue;
      const { skip, noRun } = classifyDirectives(directives, block.code);
      if (skip) {
        findings.push(
          finding({
            severity: SEVERITY.UNBACKED,
            bucket: BUCKET.MISSING,
            channel: CHANNEL.DOCTEST,
            file: file.name,
            line: block.startLine,
            title: 'Doctest example is skipped (+SKIP) — its claim is unbacked',
            detail: `${file.name} marks this example as skipped, so front-door never verified it runs; a skipped example backs no claim.`,
            hint: 'Remove the skip directive and make the example runnable under --run-doctests, or delete the example.',
          }),
        );
        continue;
      }
      const f = execExample({ fileName: file.name, block, noRun, pkgName, repoRoot });
      if (f) findings.push(f);
    }
  }
  return findings;
}
