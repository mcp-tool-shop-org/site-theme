/**
 * front-door — core data model.
 *
 * Severity is ordered by PRODUCT RISK (user harm first), not by code metric:
 * a README that lies outranks a README that is merely long. This ordering
 * drives the scorecard layout and the exit gate (audit-framing rule).
 *
 * Verdict buckets follow the proven four-bucket model from README Clew
 * (L. Cordero, 2025): a claim is Verified, Contradicted, Missing, or Unverifiable.
 */

// Severity, highest harm first.
export const SEVERITY = {
  CONTRADICTED: 'contradicted', // the repo actively disproves a documented claim
  UNBACKED: 'unbacked', // a load-bearing claim with no discoverable evidence
  STALE: 'stale', // a reference / command / link that no longer resolves
  BLOAT: 'bloat', // minimality violation (duplication, length, breadth)
  HYGIENE: 'hygiene', // missing front-door artifact or structure
  STYLE: 'style', // readability / cosmetic
};

// Risk order — index is the rank (lower = worse). Sorts findings and sets the gate.
export const SEVERITY_ORDER = [
  SEVERITY.CONTRADICTED,
  SEVERITY.UNBACKED,
  SEVERITY.STALE,
  SEVERITY.BLOAT,
  SEVERITY.HYGIENE,
  SEVERITY.STYLE,
];

// Severities that fail the verify gate (the rest are warnings): the doc is
// wrong, not merely improvable.
export const GATE_FAIL = new Set([SEVERITY.CONTRADICTED, SEVERITY.UNBACKED, SEVERITY.STALE]);

// Evidence channel a claim is routed to. The moat: classify a claim, then route
// it to the channel that can actually back it.
export const CHANNEL = {
  REFERENCE: 'reference', // a file / path / script / link exists in the repo
  DOCTEST: 'doctest', // a fenced example compiles and runs
  ATTESTATION: 'attestation', // a SLSA / in-toto / Sigstore receipt backs the claim
  GHERKIN: 'gherkin', // a behavioral claim maps to an executable scenario
  BADGE: 'badge', // a shields-style badge — untrusted by default
  MINIMALITY: 'minimality', // not a claim; a bloat / length check
};

// Verdict buckets (credited to README Clew).
export const BUCKET = {
  VERIFIED: 'verified', // claim mapped to evidence that holds
  CONTRADICTED: 'contradicted', // evidence disproves the claim
  MISSING: 'missing', // claim needs backing; none found
  UNVERIFIABLE: 'unverifiable', // outside what this tool can check
};

const SEVERITY_RANK = Object.fromEntries(SEVERITY_ORDER.map((s, i) => [s, i]));

/** Numeric rank for a severity (lower = higher risk). Unknown sorts last. */
export function severityRank(severity) {
  const rank = SEVERITY_RANK[severity];
  return rank === undefined ? SEVERITY_ORDER.length : rank;
}

function slug(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

/**
 * Build a normalized finding — the unit the scorecard aggregates. The id is
 * derived from content so a given defect produces a stable id across runs.
 *
 * @param {{severity:string, channel:string, file:string, title:string,
 *   bucket?:string, line?:number|null, detail?:string, claim?:string,
 *   evidence?:string, hint?:string}} f
 */
export function finding(f) {
  return {
    id: `${f.channel}:${f.file}:${f.line ?? 0}:${slug(f.title)}`,
    severity: f.severity,
    bucket: f.bucket ?? BUCKET.UNVERIFIABLE,
    channel: f.channel,
    file: f.file,
    line: f.line ?? null,
    title: f.title,
    detail: f.detail ?? '',
    claim: f.claim ?? '',
    evidence: f.evidence ?? '',
    hint: f.hint ?? '',
  };
}
