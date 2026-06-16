/**
 * front-door — verification pipeline (orchestration, no CLI).
 *
 * Loads the front-door files and routes claims through the evidence channels
 * into a risk-ordered scorecard. Imported by the CLI (index.mjs) and the
 * self-eval (eval.mjs); kept CLI-free to avoid an import cycle.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkAttestation } from './attestation.mjs';
import { checkDoctest } from './doctest.mjs';
import { checkGherkin } from './gherkin.mjs';
import { checkMinimality } from './minimality.mjs';
import { BUCKET, CHANNEL, finding, SEVERITY } from './model.mjs';
import { checkReferences } from './references.mjs';
import { buildScorecard } from './scorecard.mjs';

const FRONT_DOOR_FILES = ['README.md', 'AGENTS.md', 'llms.txt', 'CLAUDE.md'];

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
 * Verify the front door of the repo rooted at `root`. Returns a scorecard.
 * This is the programmatic API consumed by shipcheck's AI-native gate.
 *
 * Pure + read-only by default. When `runDoctests` is set, the doctest channel
 * additionally compiles/runs fenced JS examples in child processes (opt-in; see
 * doctest.mjs for the safety contract). It still writes nothing to `root`.
 * @param {{root: string, runDoctests?: boolean}} opts
 */
export function verify({ root, runDoctests = false }) {
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
  findings.push(...checkMinimality({ files }));
  findings.push(...checkDoctest({ files, pkg, repoRoot: root, exec: runDoctests }));
  findings.push(...checkAttestation({ files, repoRoot: root }));
  findings.push(...checkGherkin({ repoRoot: root }));
  return buildScorecard(findings);
}
