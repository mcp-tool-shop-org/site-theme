/**
 * front-door — scorecard aggregation.
 *
 * Findings are sorted by product risk (audit-framing rule) and reduced to
 * counts plus a pass/fail gate. The gate fails on contradicted / unbacked /
 * stale findings (the front door is wrong), and warns on the rest.
 */

import { GATE_FAIL, SEVERITY_ORDER, severityRank } from './model.mjs';

/**
 * @param {object[]} findings
 * @returns {{findings: object[], counts: object, gate: object}}
 */
export function buildScorecard(findings) {
  const sorted = [...findings].sort((a, b) => {
    const d = severityRank(a.severity) - severityRank(b.severity);
    if (d !== 0) return d;
    if (a.file !== b.file) return a.file < b.file ? -1 : 1;
    return (a.line ?? 0) - (b.line ?? 0);
  });

  const bySeverity = {};
  for (const s of SEVERITY_ORDER) bySeverity[s] = 0;
  const byBucket = {};
  for (const f of sorted) {
    bySeverity[f.severity] = (bySeverity[f.severity] ?? 0) + 1;
    byBucket[f.bucket] = (byBucket[f.bucket] ?? 0) + 1;
  }

  const failing = sorted.filter((f) => GATE_FAIL.has(f.severity)).length;
  const gate = {
    pass: failing === 0,
    failing,
    reason:
      failing === 0
        ? 'No contradicted, unbacked, or stale claims.'
        : `${failing} gate-failing finding(s): the front door makes claims the repo does not back.`,
  };

  return { findings: sorted, counts: { bySeverity, byBucket, total: sorted.length }, gate };
}
