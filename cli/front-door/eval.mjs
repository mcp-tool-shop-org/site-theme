/**
 * front-door — self-eval.
 *
 * Receipts, not decoration: this runs the verifier against a labeled corpus of
 * synthetic front doors (clean ones must pass; planted-defect ones must be
 * caught on the right channel) and reports accuracy. `front-door eval` emits it
 * as a proof receipt.
 *
 * This proves the VERIFIER behaves correctly. Proving the STANDARD helps agents
 * (docs-on/off task success) is a separate, heavier experiment — the three-arm
 * SWE-bench ablation protocol in EVAL.md, which needs an external agent harness
 * (no model grades its own output — Huang et al. arXiv:2310.01798; cross-family
 * verifier — Kambhampati arXiv:2402.01817).
 */

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verify } from './verify.mjs';

const CLEAN_AGENTS = '# AGENTS\n\nRun `npm test`. Keep changes scoped.\n';

// Each case: a synthetic front door + the expected verdict. `channels` lists
// channels that MUST appear among the findings.
const CORPUS = [
  {
    name: 'clean minimal front door passes',
    files: { 'README.md': '# tool\n\nA small CLI.\n', 'AGENTS.md': CLEAN_AGENTS },
    pkg: { name: 't', scripts: { test: 'x' } },
    expect: { pass: true, channels: [] },
  },
  {
    name: 'dead path reference is caught',
    files: { 'README.md': 'See `src/missing.ts`.\n', 'AGENTS.md': CLEAN_AGENTS },
    pkg: { name: 't', scripts: { test: 'x' } },
    expect: { pass: false, channels: ['reference'] },
  },
  {
    name: 'documented missing script is caught',
    files: { 'README.md': '```bash\nnpm run build\n```\n', 'AGENTS.md': CLEAN_AGENTS },
    pkg: { name: 't', scripts: { test: 'x' } },
    expect: { pass: false, channels: ['reference'] },
  },
  {
    name: 'status badge is flagged unbacked',
    files: {
      'README.md': '![CI](https://img.shields.io/github/actions/workflow/status/o/r/ci.yml)\n',
      'AGENTS.md': CLEAN_AGENTS,
    },
    pkg: { name: 't', scripts: { test: 'x' } },
    expect: { pass: false, channels: ['badge'] },
  },
  {
    name: 'unexported example import is caught',
    files: { 'README.md': '```js\nimport { x } from "@scope/t/nope";\n```\n', 'AGENTS.md': CLEAN_AGENTS },
    pkg: { name: '@scope/t', exports: { '.': './i.js' } },
    expect: { pass: false, channels: ['doctest'] },
  },
  {
    name: 'provenance claim without evidence is caught',
    files: { 'README.md': '# t\n\nEvery release ships with SLSA provenance.\n', 'AGENTS.md': CLEAN_AGENTS },
    pkg: { name: 't', scripts: { test: 'x' } },
    expect: { pass: false, channels: ['attestation'] },
  },
  {
    name: 'bloated AGENTS.md is a warning, gate still passes',
    files: {
      'README.md': '# t\n\nA small CLI.\n',
      'AGENTS.md': `# A\n${'You must always do this and never that for every file.\n'.repeat(6)}`,
    },
    pkg: { name: 't', scripts: { test: 'x' } },
    expect: { pass: true, channels: ['minimality'] },
  },
];

function runCase(c) {
  const dir = mkdtempSync(join(tmpdir(), 'fd-eval-'));
  try {
    writeFileSync(join(dir, 'package.json'), JSON.stringify(c.pkg));
    for (const [name, content] of Object.entries(c.files)) writeFileSync(join(dir, name), content);
    const sc = verify({ root: dir });
    const gotChannels = [...new Set(sc.findings.map((f) => f.channel))];
    const gateOk = sc.gate.pass === c.expect.pass;
    const channelsOk = c.expect.channels.every((ch) => gotChannels.includes(ch));
    return {
      name: c.name,
      ok: gateOk && channelsOk,
      expectedPass: c.expect.pass,
      gotPass: sc.gate.pass,
      expectedChannels: c.expect.channels,
      gotChannels,
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Run the whole corpus and return a receipt-shaped report. */
export function runEval() {
  const cases = CORPUS.map(runCase);
  const passed = cases.filter((c) => c.ok).length;
  return {
    tool: 'front-door',
    kind: 'verifier-self-eval',
    total: cases.length,
    passed,
    failed: cases.length - passed,
    accuracy: cases.length ? passed / cases.length : 0,
    cases,
  };
}
