/**
 * front-door — the AI-native front-door verifier for site-theme (CLI entry).
 *
 * The verify pipeline lives in ./verify.mjs (orchestration) and is re-exported
 * here as the programmatic API consumed by shipcheck. This module is the CLI:
 * verify · init · standard · eval. Channels and the slice plan: ./DESIGN.md.
 *
 * --- Standards compliance (memory/workflow_standards.md) ---
 * PIN_PER_STEP              2 — deterministic, dependency-free checks; same input -> same report.
 * ANDON_AUTHORITY          2 — the gate halts (exit 1) on any contradicted/unbacked/stale finding.
 * NAMED_COMPENSATORS       2 — `init` is overwrite-guarded (--force); release table in DESIGN.md.
 * DECOMPOSE_BY_SECRETS     3 — astro-free module; one file per evidence channel; verify split from CLI.
 * UNCERTAINTY_GATED_HUMANS 2 — claims it cannot check are reported UNVERIFIABLE, never asserted true.
 * EXTERNAL_VERIFIER        2 — evidence is external to the prose; the self-eval (eval.mjs) proves precision.
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runEval } from './eval.mjs';
import { generate } from './generate.mjs';
import { renderHuman, renderJson } from './report.mjs';
import { renderStandard } from './standard.mjs';
import { verify } from './verify.mjs';

export { verify } from './verify.mjs';

function die(msg) {
  process.stderr.write(`\x1b[31mError:\x1b[0m ${msg}\n`);
  process.exit(1);
}

function printHelp() {
  process.stdout.write(`
Usage: site-theme front-door <action> [options]

Actions:
  verify            Audit the repo's front door (README / AGENTS.md / llms.txt)
  init              Scaffold a minimal front door (README / AGENTS.md / llms.txt)
  standard          Print the front-door spine (README + AGENTS.md)
  eval              Run the verifier's self-eval against a labeled corpus

Options:
  --out <dir|file>  Repo root (verify/init) or receipt path (eval)
  --json            Machine-readable output (verify, eval)
  --force           Overwrite existing files (init)
  --dry-run         Preview without writing (init)
  --help, -h        Show this help

verify exits 1 when the gate fails (contradicted / unbacked / stale).
`);
}

function parseFlags(argv) {
  const flags = { out: '', json: false, force: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out' && argv[i + 1]) flags.out = argv[++i];
    else if (argv[i] === '--json') flags.json = true;
    else if (argv[i] === '--force') flags.force = true;
    else if (argv[i] === '--dry-run') flags.dryRun = true;
  }
  return flags;
}

function runVerify(flags) {
  const root = flags.out ? resolve(process.cwd(), flags.out) : process.cwd();
  const scorecard = verify({ root });
  process.stdout.write(flags.json ? `${renderJson(scorecard)}\n` : renderHuman(scorecard));
  process.exit(scorecard.gate.pass ? 0 : 1);
}

function runInit(flags) {
  const root = flags.out ? resolve(process.cwd(), flags.out) : process.cwd();
  const result = generate({ root, force: flags.force, dryRun: flags.dryRun });
  const tag = result.dryRun ? ' (dry run)' : '';
  const out = ['', `\x1b[1mfront-door — scaffold${tag}\x1b[0m`, ''];
  for (const f of result.created) out.push(`  \x1b[32m+\x1b[0m ${f}`);
  for (const f of result.skipped) out.push(`  \x1b[90m• ${f} (exists — use --force to overwrite)\x1b[0m`);
  if (!result.created.length && !result.skipped.length) out.push('  (nothing to scaffold)');
  out.push('', '\x1b[36mNext:\x1b[0m fill the placeholders, then run `site-theme front-door verify`.', '');
  process.stdout.write(`${out.join('\n')}\n`);
}

function runEvalCli(flags) {
  const report = runEval();
  if (flags.out) {
    writeFileSync(resolve(process.cwd(), flags.out), `${JSON.stringify(report, null, 2)}\n`, 'utf-8');
  }
  if (flags.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    const out = ['', '\x1b[1mfront-door — self-eval\x1b[0m', ''];
    for (const c of report.cases) {
      out.push(`  ${c.ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m'}  ${c.name}`);
    }
    out.push('', `${report.passed}/${report.total} cases correct (accuracy ${(report.accuracy * 100).toFixed(0)}%)`);
    if (flags.out) out.push(`receipt written to ${flags.out}`);
    out.push('');
    process.stdout.write(`${out.join('\n')}\n`);
  }
  process.exit(report.failed === 0 ? 0 : 1);
}

/** CLI entry — invoked from cli/init.mjs when the first arg is "front-door". */
export function main(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return;
  }
  const action = argv[0] && !argv[0].startsWith('-') ? argv[0] : '';
  const flags = parseFlags(action ? argv.slice(1) : argv);
  if (action === 'verify') {
    runVerify(flags);
  } else if (action === 'init') {
    runInit(flags);
  } else if (action === 'standard') {
    process.stdout.write(`${renderStandard()}\n`);
  } else if (action === 'eval') {
    runEvalCli(flags);
  } else if (action === '' || action === 'help') {
    printHelp();
  } else {
    die(`Unknown front-door action "${action}". Use: verify, init, standard, eval.`);
  }
}
