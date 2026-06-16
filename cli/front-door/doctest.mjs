/**
 * front-door — the doctest (example-binding) channel.
 *
 * The strongest binding is "the example uses the real API." v1 does this
 * deterministically and without executing anything: when a documented code
 * example imports from THIS package, the imported entry point must exist in
 * package.json "exports". An example that imports an unexported subpath is a
 * contradicted claim — the snippet cannot run as written.
 *
 * (Execution-based doctest — compiling/running fenced examples à la rustdoc —
 * is a later refinement; see DESIGN.md.)
 */

import { extractCodeBlocks } from './extract.mjs';
import { BUCKET, CHANNEL, finding, SEVERITY } from './model.mjs';

const IMPORT_RE = /(?:import\b[^'"]*from\s*|import\s*|require\s*\(\s*)['"]([^'"]+)['"]/g;
const CODE_LANG_RE = /(js|jsx|ts|tsx|mjs|cjs|javascript|typescript|astro)/;

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

/**
 * @param {{files: {name:string, content:string}[], pkg: object}} ctx
 * @returns {object[]} findings
 */
export function checkDoctest({ files, pkg }) {
  const findings = [];
  const pkgName = pkg?.name;
  const keys = exportKeys(pkg);
  if (!pkgName || !keys) return findings; // nothing to bind against

  for (const file of files) {
    if (!file?.content) continue;
    for (const b of extractCodeBlocks(file.content)) {
      if (b.lang && !CODE_LANG_RE.test(b.lang)) continue; // only code-ish blocks (empty lang ok)
      const lines = b.code.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        IMPORT_RE.lastIndex = 0;
        for (let m = IMPORT_RE.exec(lines[i]); m !== null; m = IMPORT_RE.exec(lines[i])) {
          const spec = m[1];
          if (spec !== pkgName && !spec.startsWith(`${pkgName}/`)) continue;
          const subpath = spec === pkgName ? '' : spec.slice(pkgName.length + 1);
          if (isExported(keys, subpath)) continue;
          findings.push(
            finding({
              severity: SEVERITY.CONTRADICTED,
              bucket: BUCKET.CONTRADICTED,
              channel: CHANNEL.DOCTEST,
              file: file.name,
              line: b.startLine + i,
              title: `Example imports an unexported entry: ${spec}`,
              detail: `${file.name} shows \`import … from '${spec}'\`, but package.json "exports" does not expose ${
                subpath ? `"./${subpath}"` : 'the root "."'
              }; the snippet cannot run as written.`,
              claim: spec,
              evidence: `exports: ${[...keys].join(', ')}`,
              hint: 'Add the subpath to package.json "exports", or fix the example to use a real entry point.',
            }),
          );
        }
      }
    }
  }
  return findings;
}
