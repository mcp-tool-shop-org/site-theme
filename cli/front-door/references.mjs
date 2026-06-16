/**
 * front-door — the references evidence channel.
 *
 * Routes claims that can be checked against the filesystem: file/path
 * references, relative links, and documented package-manager scripts must
 * resolve in the repo; duplicated AGENTS.md content and status badges are
 * surfaced as overhead / untrusted claims. All checks are deterministic and
 * external to the prose (no model judges its own text — EXTERNAL_VERIFIER).
 */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  extractBadges,
  extractCodeBlocks,
  extractCommands,
  extractInlineCode,
  extractLinks,
  extractPathRefs,
  findDuplication,
} from './extract.mjs';
import { BUCKET, CHANNEL, finding, SEVERITY } from './model.mjs';

const DUP_THRESHOLD = 3;

/** True if `ref` resolves to an existing path inside the repo. Out-of-repo refs
 * are not flagged (return true) to avoid false positives on intentional `../`. */
function inRepo(repoRoot, ref) {
  const clean = ref.replace(/^\.\//, '').replace(/[#?].*$/, '');
  if (!clean) return true;
  const root = resolve(repoRoot);
  const target = resolve(root, clean);
  if (!target.startsWith(root)) return true;
  return existsSync(target);
}

function isRelativeLink(target) {
  if (!target) return false;
  return !/^(https?:|mailto:|tel:|#|data:)/i.test(target);
}

/**
 * @param {{files: {name:string, content:string}[], repoRoot: string, pkg: object}} ctx
 * @returns {object[]} findings
 */
export function checkReferences({ files, repoRoot, pkg }) {
  const findings = [];
  const scripts = pkg?.scripts || {};

  for (const file of files) {
    if (!file?.content) continue;
    const blocks = extractCodeBlocks(file.content);
    const inline = extractInlineCode(file.content);
    const links = extractLinks(file.content);

    // 1. dead file/path references in inline code
    for (const ref of extractPathRefs(inline)) {
      if (inRepo(repoRoot, ref.text)) continue;
      findings.push(
        finding({
          severity: SEVERITY.STALE,
          bucket: BUCKET.CONTRADICTED,
          channel: CHANNEL.REFERENCE,
          file: file.name,
          line: ref.line,
          title: `Dead path reference: ${ref.text}`,
          detail: `${file.name} references "${ref.text}", which does not exist in the repo.`,
          claim: ref.text,
          evidence: `not found at ${ref.text}`,
          hint: 'Fix the path or remove the reference. Stale paths are how docs start lying.',
        }),
      );
    }

    // 2. dead relative links
    for (const link of links) {
      if (link.isImage || !isRelativeLink(link.target)) continue;
      if (inRepo(repoRoot, link.target)) continue;
      findings.push(
        finding({
          severity: SEVERITY.STALE,
          bucket: BUCKET.CONTRADICTED,
          channel: CHANNEL.REFERENCE,
          file: file.name,
          line: link.line,
          title: `Dead link: ${link.target}`,
          detail: `${file.name} links to "${link.target}" ([${link.label}]), which does not resolve in the repo.`,
          claim: `[${link.label}](${link.target})`,
          evidence: `not found at ${link.target}`,
          hint: 'Update or remove the link.',
        }),
      );
    }

    // 3. documented scripts missing from package.json
    for (const cmd of extractCommands(blocks)) {
      // Skip commands that run in another cwd (`cd site && …`) — we can only
      // resolve scripts against this repo's package.json.
      if (!cmd.explicitRun || cmd.cdContext || Object.hasOwn(scripts, cmd.script)) continue;
      findings.push(
        finding({
          severity: SEVERITY.STALE,
          bucket: BUCKET.CONTRADICTED,
          channel: CHANNEL.REFERENCE,
          file: file.name,
          line: cmd.line,
          title: `Documented script not in package.json: ${cmd.tool} run ${cmd.script}`,
          detail: `${file.name} tells the reader to run "${cmd.tool} run ${cmd.script}", but package.json has no "${cmd.script}" script.`,
          claim: `${cmd.tool} run ${cmd.script}`,
          evidence: `package.json scripts: ${Object.keys(scripts).join(', ') || '(none)'}`,
          hint: `Add a "${cmd.script}" script or correct the command.`,
        }),
      );
    }

    // 4. status badges are unbacked claims
    for (const badge of extractBadges(links)) {
      if (badge.kind !== 'status') continue;
      findings.push(
        finding({
          severity: SEVERITY.UNBACKED,
          bucket: BUCKET.UNVERIFIABLE,
          channel: CHANNEL.BADGE,
          file: file.name,
          line: badge.line,
          title: `Status badge is an unbacked claim: ${badge.label || badge.target}`,
          detail:
            'Shields-style status badges are unauthenticated hotlinked images with no cryptographic binding to the run they assert; they can be stale or spoofed (Overmeyer 2018).',
          claim: badge.label || badge.target,
          evidence: badge.target,
          hint: 'Back the asserted status with a re-run or a signed attestation (SLSA/Sigstore); treat the badge as decoration, not evidence.',
        }),
      );
    }
  }

  // 5. AGENTS.md duplicating README content
  const readme = files.find((f) => f && f.name === 'README.md');
  const agents = files.find((f) => f && f.name === 'AGENTS.md');
  if (readme?.content && agents?.content) {
    const dupes = findDuplication(readme.content, agents.content);
    if (dupes.length >= DUP_THRESHOLD) {
      findings.push(
        finding({
          severity: SEVERITY.BLOAT,
          bucket: BUCKET.UNVERIFIABLE,
          channel: CHANNEL.MINIMALITY,
          file: 'AGENTS.md',
          line: dupes[0].line,
          title: `AGENTS.md duplicates ${dupes.length} lines from README.md`,
          detail:
            'Context that restates discoverable docs is pure overhead — agents can already read the README. Removing duplicated docs measurably improved agent task success (Gloaguen et al., arXiv:2602.11988, 2026).',
          evidence: dupes
            .slice(0, 3)
            .map((d) => `L${d.line}: ${d.text.slice(0, 60)}`)
            .join(' | '),
          hint: 'Cut the duplicated lines; keep AGENTS.md to repo-unique, load-bearing instructions.',
        }),
      );
    }
  }

  return findings;
}
