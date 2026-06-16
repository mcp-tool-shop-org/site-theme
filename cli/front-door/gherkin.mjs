/**
 * front-door — the gherkin (behavioral-claim) channel.
 *
 * Spec-by-example (Cucumber/Gherkin; Adzic 2011) keeps a behavioral claim true
 * by making the scenario both the spec AND the executable test. The pitfall is
 * the inverse of the doctest one: a @skip/@wip scenario documents behavior that
 * is never executed — an unbacked behavioral claim.
 *
 * Opt-in by repo: fires only when `.feature` files exist (most tools here don't
 * use Gherkin). It flags skipped scenarios; it does not invent them.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BUCKET, CHANNEL, finding, SEVERITY } from './model.mjs';

const SEARCH_DIRS = ['features', 'tests', 'test', 'e2e', 'spec', 'acceptance', '.'];
const SKIP_TAG_RE = /@(skip|wip|ignore|pending|manual|todo)\b/i;
const IGNORE = new Set(['node_modules', '.git', 'dist', '.astro', 'site', 'coverage']);

function walkFeatures(dir, found, seen, depth) {
  if (depth > 3) return;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (!IGNORE.has(e.name)) walkFeatures(join(dir, e.name), found, seen, depth + 1);
    } else if (e.name.endsWith('.feature')) {
      const p = join(dir, e.name);
      if (!seen.has(p)) {
        seen.add(p);
        found.push(p);
      }
    }
  }
}

function findFeatureFiles(repoRoot) {
  const found = [];
  const seen = new Set();
  for (const d of SEARCH_DIRS) {
    const dir = join(repoRoot, d);
    if (existsSync(dir)) walkFeatures(dir, found, seen, 0);
  }
  return found;
}

/** Count total and skipped (tagged) scenarios in one feature file. */
export function analyzeFeature(content) {
  const lines = content.split(/\r?\n/);
  let total = 0;
  let skipped = 0;
  let pendingSkip = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('@')) {
      if (SKIP_TAG_RE.test(line)) pendingSkip = true;
      continue;
    }
    if (/^Scenario(\s+Outline)?:/i.test(line)) {
      total += 1;
      if (pendingSkip) skipped += 1;
      pendingSkip = false;
    } else if (/^Feature:/i.test(line)) {
      pendingSkip = false;
    }
  }
  return { total, skipped };
}

/**
 * @param {{repoRoot: string}} ctx
 * @returns {object[]} findings
 */
export function checkGherkin({ repoRoot }) {
  const findings = [];
  for (const path of findFeatureFiles(repoRoot)) {
    let content;
    try {
      content = readFileSync(path, 'utf-8');
    } catch {
      continue;
    }
    const { total, skipped } = analyzeFeature(content);
    if (total === 0 || skipped === 0) continue;
    const rel = path.slice(repoRoot.length + 1).replace(/\\/g, '/');
    findings.push(
      finding({
        severity: SEVERITY.UNBACKED,
        bucket: BUCKET.MISSING,
        channel: CHANNEL.GHERKIN,
        file: rel,
        title: `${skipped}/${total} scenarios skipped in ${rel}`,
        detail:
          'Skipped / @wip Gherkin scenarios document behavior that is never executed — a behavioral claim with verification disabled (spec-by-example, Adzic 2011).',
        evidence: `${skipped} skipped of ${total} scenarios`,
        hint: 'Implement and enable the scenario, or remove it — a skipped acceptance test is an unbacked claim.',
      }),
    );
  }
  return findings;
}
