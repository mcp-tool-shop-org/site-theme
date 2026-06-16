/**
 * front-door — the AI-native front-door verifier for site-theme.
 *
 * Pipeline: load front-door files -> route claims to evidence channels ->
 * aggregate into a risk-ordered scorecard. v1 ships the references channel
 * (dead paths/scripts/links, AGENTS.md duplication, status-badge distrust) plus
 * presence checks. doctest / attestation / gherkin / minimality channels and
 * the generator land in later slices (see ./DESIGN.md).
 *
 * --- Standards compliance (memory/workflow_standards.md) ---
 * PIN_PER_STEP              2 — deterministic, dependency-free checks; same input -> same report.
 * ANDON_AUTHORITY          2 — the gate halts (exit 1) on any contradicted/unbacked/stale finding.
 * NAMED_COMPENSATORS     n/a — `verify` is read-only; the generator slice carries the table (DESIGN.md).
 * DECOMPOSE_BY_SECRETS     3 — astro-free module; one file per evidence channel, isolated.
 * UNCERTAINTY_GATED_HUMANS 2 — claims it cannot check are reported UNVERIFIABLE, never asserted true.
 * EXTERNAL_VERIFIER        2 — evidence is external to the prose (fs/scripts); no model grades its own text.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { BUCKET, CHANNEL, finding, SEVERITY } from './model.mjs';
import { checkReferences } from './references.mjs';
import { renderHuman, renderJson } from './report.mjs';
import { buildScorecard } from './scorecard.mjs';
import { renderStandard } from './standard.mjs';

const FRONT_DOOR_FILES = ['README.md', 'AGENTS.md', 'llms.txt'];

function loadFile(root, name) {
  const path = join(root, name);
  if (!existsSync(path)) return null;
  try {
    return { name, content: readFileSync(path, 'utf-8') };
  } catch {
    return null;
  }
}

function readPkg(root) {
  const path = join(root, 'package.json');
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return {};
  }
}

/**
 * Verify the front door of the repo rooted at `root`. Pure: returns a scorecard.
 * This is the programmatic API consumed by shipcheck's AI-native gate.
 * @param {{root: string}} opts
 */
export function verify({ root }) {
  const loaded = FRONT_DOOR_FILES.map((name) => loadFile(root, name));
  const files = loaded.filter(Boolean);
  const pkg = readPkg(root);
  const findings = [];

  if (!loaded[0]) {
    findings.push(
      finding({
        severity: SEVERITY.HYGIENE,
        bucket: BUCKET.MISSING,
        channel: CHANNEL.REFERENCE,
        file: 'README.md',
        title: 'No README.md',
        detail: 'The repo has no README — humans and agents have no front door at all.',
        hint: 'Add a README. Run `site-theme front-door standard` to see the spine.',
      }),
    );
  }
  if (!loaded[1]) {
    findings.push(
      finding({
        severity: SEVERITY.HYGIENE,
        bucket: BUCKET.MISSING,
        channel: CHANNEL.REFERENCE,
        file: 'AGENTS.md',
        title: 'No AGENTS.md',
        detail:
          'No agent operating contract. AGENTS.md is an Agentic AI Foundation (Linux Foundation) standard read by 20+ coding agents.',
        hint: 'Add a minimal AGENTS.md. Run `site-theme front-door standard`.',
      }),
    );
  }

  findings.push(...checkReferences({ files, repoRoot: root, pkg }));
  return buildScorecard(findings);
}

// --- CLI ---

function die(msg) {
  process.stderr.write(`\x1b[31mError:\x1b[0m ${msg}\n`);
  process.exit(1);
}

function printHelp() {
  process.stdout.write(`
Usage: site-theme front-door <action> [options]

Actions:
  verify            Audit the repo's front door (README / AGENTS.md / llms.txt)
  standard          Print the front-door spine (README + AGENTS.md)

Options:
  --out <dir>       Repo root to check (default: current directory)
  --json            Machine-readable output (verify only)
  --help, -h        Show this help

verify exits 1 when the gate fails (contradicted / unbacked / stale).
`);
}

function parseFlags(argv) {
  const flags = { out: '', json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out' && argv[i + 1]) flags.out = argv[++i];
    else if (argv[i] === '--json') flags.json = true;
  }
  return flags;
}

function runVerify(flags) {
  const root = flags.out ? resolve(process.cwd(), flags.out) : process.cwd();
  const scorecard = verify({ root });
  process.stdout.write(flags.json ? `${renderJson(scorecard)}\n` : renderHuman(scorecard));
  process.exit(scorecard.gate.pass ? 0 : 1);
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
  } else if (action === 'standard') {
    process.stdout.write(`${renderStandard()}\n`);
  } else if (action === '' || action === 'help') {
    printHelp();
  } else {
    die(`Unknown front-door action "${action}". Use: verify, standard.`);
  }
}
