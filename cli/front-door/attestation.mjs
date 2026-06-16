/**
 * front-door — the attestation channel.
 *
 * Some claims cannot be re-run by a reader — "signed", "ships with SLSA
 * provenance", "supply-chain secured". Those must map to a real receipt: a
 * workflow step or publish flag that actually produces an attestation
 * (SLSA / in-toto / Sigstore / `npm publish --provenance`). A provenance claim
 * with no such evidence is unbacked — and an unbacked security claim is worse
 * than none.
 *
 * Grounded in in-toto (Torres-Arias et al., USENIX Security 2019), SLSA build
 * provenance (OpenSSF), and Sigstore keyless signing.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BUCKET, CHANNEL, finding, SEVERITY } from './model.mjs';

const CLAIM_RE =
  /\b(slsa|provenance|sigstore|cosign|in-toto|attestation|attested|sbom|supply[- ]chain|signed (?:release|artifact|package|build|commit))\b/i;
const EVIDENCE_RE =
  /(attest-build-provenance|cosign|sigstore|in-toto|slsa|--provenance|provenance"?\s*[:=]\s*true|id-token:\s*write)/i;

function gatherEvidence(repoRoot) {
  const sources = [];
  const wfDir = join(repoRoot, '.github', 'workflows');
  if (existsSync(wfDir)) {
    for (const f of readdirSync(wfDir)) {
      if (!/\.ya?ml$/i.test(f)) continue;
      try {
        sources.push(readFileSync(join(wfDir, f), 'utf-8'));
      } catch {
        /* ignore unreadable workflow */
      }
    }
  }
  const pkgPath = join(repoRoot, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      sources.push(readFileSync(pkgPath, 'utf-8'));
    } catch {
      /* ignore */
    }
  }
  return sources.join('\n');
}

/**
 * @param {{files: {name:string, content:string}[], repoRoot: string}} ctx
 * @returns {object[]} findings
 */
export function checkAttestation({ files, repoRoot }) {
  let claimFile = null;
  let claimLine = 0;
  let claimText = '';
  for (const file of files) {
    if (!file?.content) continue;
    const lines = file.content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(CLAIM_RE);
      if (m) {
        claimFile = file.name;
        claimLine = i + 1;
        claimText = m[0];
        break;
      }
    }
    if (claimFile) break;
  }
  if (!claimFile) return []; // no provenance/signing claim → nothing to verify
  if (EVIDENCE_RE.test(gatherEvidence(repoRoot))) return []; // claim is backed

  return [
    finding({
      severity: SEVERITY.UNBACKED,
      bucket: BUCKET.MISSING,
      channel: CHANNEL.ATTESTATION,
      file: claimFile,
      line: claimLine,
      title: `Provenance/signing claim with no attestation evidence ("${claimText}")`,
      detail:
        'The front door asserts supply-chain provenance or signing, but no workflow step or publish flag produces an attestation (SLSA/in-toto/Sigstore or `npm publish --provenance`). An unbacked security claim is worse than none.',
      claim: claimText,
      evidence:
        'no attest-build-provenance / cosign / --provenance / id-token:write in .github/workflows or package.json',
      hint: 'Produce a real attestation (`npm publish --provenance` with `id-token: write`, or actions/attest-build-provenance), or drop the claim.',
    }),
  ];
}
