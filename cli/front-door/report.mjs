/**
 * front-door — report rendering (human ANSI + JSON).
 *
 * Human output is risk-ordered: contradicted/unbacked first, style last, so the
 * reader sees what's actually wrong before what's merely improvable.
 */

import { SEVERITY_ORDER } from './model.mjs';

const C = {
  reset: '\x1b[0m',
  dim: '\x1b[90m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const SEVERITY_COLOR = {
  contradicted: C.red,
  unbacked: C.red,
  stale: C.yellow,
  bloat: C.yellow,
  hygiene: C.cyan,
  style: C.dim,
};

export function renderJson(scorecard) {
  return JSON.stringify(scorecard, null, 2);
}

export function renderHuman(scorecard) {
  const { findings, counts, gate } = scorecard;
  const out = ['', `${C.bold}front-door — verification report${C.reset}`, ''];

  if (findings.length === 0) {
    out.push(`${C.green}No findings.${C.reset} The front door is clean.`);
    out.push(`${C.bold}Gate:${C.reset} ${C.green}PASS${C.reset} — ${gate.reason}`, '');
    return out.join('\n');
  }

  let lastSeverity = '';
  for (const f of findings) {
    const color = SEVERITY_COLOR[f.severity] ?? C.reset;
    if (f.severity !== lastSeverity) {
      lastSeverity = f.severity;
      out.push(`${color}${C.bold}${f.severity.toUpperCase()}${C.reset}`);
    }
    const loc = f.line ? `${f.file}:${f.line}` : f.file;
    out.push(`  ${color}•${C.reset} ${f.title} ${C.dim}(${loc})${C.reset}`);
    if (f.detail) out.push(`    ${C.dim}${f.detail}${C.reset}`);
    if (f.hint) out.push(`    ${C.cyan}fix:${C.reset} ${f.hint}`);
  }
  out.push('');

  const parts = SEVERITY_ORDER.filter((s) => counts.bySeverity[s] > 0).map(
    (s) => `${SEVERITY_COLOR[s] ?? ''}${counts.bySeverity[s]} ${s}${C.reset}`,
  );
  out.push(`${C.bold}Summary:${C.reset} ${parts.join(', ')} ${C.dim}(${counts.total} total)${C.reset}`);
  const gateColor = gate.pass ? C.green : C.red;
  out.push(`${C.bold}Gate:${C.reset} ${gateColor}${gate.pass ? 'PASS' : 'FAIL'}${C.reset} — ${gate.reason}`, '');
  return out.join('\n');
}
