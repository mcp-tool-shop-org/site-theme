/**
 * front-door — the minimality channel.
 *
 * Agent-context files (AGENTS.md, CLAUDE.md) must stay short, scoped, and
 * readable. Grounded in mid-2026 evidence:
 * - Length alone degrades models even with perfect retrieval — Du et al.,
 *   "Context Length Alone Hurts LLM Performance", EMNLP 2025 (arXiv:2510.05381).
 * - Broad mandates correlate with agent over-exploration — Gloaguen et al.,
 *   arXiv:2602.11988, 2026 (the directive-breadth check is a proposed proxy).
 * - Real context files score "very difficult" to read (median Flesch ~16.6) —
 *   Chatlatanagulchai et al., arXiv:2511.12884, 2025.
 */

import { BUCKET, CHANNEL, finding, SEVERITY } from './model.mjs';

const LINE_WARN = 150; // practitioner ~150-line guidance anchored to the cost evidence
const TOKEN_WARN = 2000; // ~ chars / 4
const DIRECTIVE_WARN = 15; // broad-quantifier mandates (proposed proxy, not a validated metric)
const FRE_VERY_DIFFICULT = 30;
const AGENT_CONTEXT = new Set(['AGENTS.md', 'CLAUDE.md']);

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return w ? 1 : 0;
  const groups = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').match(/[aeiouy]{1,2}/g);
  return groups ? groups.length : 1;
}

/** Flesch Reading Ease over the prose (code/links stripped). null if too little prose. */
export function fleschReadingEase(text) {
  const prose = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_|-]/g, ' ');
  const sentences = (prose.match(/[.!?]+/g) || []).length || 1;
  const words = prose.split(/\s+/).filter((w) => /[a-z]/i.test(w));
  if (words.length < 20) return null;
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  return 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length);
}

function countDirectives(text) {
  const matches = text.match(/\b(always|never|all|every|must|shall|do not)\b/gi);
  return matches ? matches.length : 0;
}

/**
 * @param {{files: {name:string, content:string}[]}} ctx
 * @returns {object[]} findings
 */
export function checkMinimality({ files }) {
  const findings = [];
  for (const file of files) {
    if (!file?.content || !AGENT_CONTEXT.has(file.name)) continue;

    const lineCount = file.content.split(/\r?\n/).length;
    const tokens = estimateTokens(file.content);
    if (lineCount > LINE_WARN || tokens > TOKEN_WARN) {
      findings.push(
        finding({
          severity: SEVERITY.BLOAT,
          bucket: BUCKET.UNVERIFIABLE,
          channel: CHANNEL.MINIMALITY,
          file: file.name,
          title: `${file.name} is long (${lineCount} lines, ~${tokens} tokens)`,
          detail:
            'Long agent-context files lower task success and raise cost; length degrades models even with perfect retrieval (Du et al., EMNLP 2025, arXiv:2510.05381).',
          evidence: `${lineCount} lines / ~${tokens} tokens (budget ${LINE_WARN} lines / ${TOKEN_WARN} tokens)`,
          hint: 'Move reference detail to docs/ or skills; keep only repo-unique, durable instructions.',
        }),
      );
    }

    const directives = countDirectives(file.content);
    if (directives > DIRECTIVE_WARN) {
      findings.push(
        finding({
          severity: SEVERITY.BLOAT,
          bucket: BUCKET.UNVERIFIABLE,
          channel: CHANNEL.MINIMALITY,
          file: file.name,
          title: `${file.name} has ${directives} broad directives`,
          detail:
            'Many broad "always/never/all/every/must" mandates correlate with agent over-exploration and extra reasoning (Gloaguen et al., arXiv:2602.11988, 2026). Prefer scoped rules ("when editing X, do Y").',
          evidence: `${directives} broad-quantifier directives (soft budget ${DIRECTIVE_WARN})`,
          hint: 'Scope mandates to when they apply; cut what the agent can infer from config.',
        }),
      );
    }

    const fre = fleschReadingEase(file.content);
    if (fre !== null && fre < FRE_VERY_DIFFICULT) {
      findings.push(
        finding({
          severity: SEVERITY.STYLE,
          bucket: BUCKET.UNVERIFIABLE,
          channel: CHANNEL.MINIMALITY,
          file: file.name,
          title: `${file.name} is hard to read (Flesch ${Math.round(fre)})`,
          detail:
            'Real context files score "very difficult" (median Flesch ~16.6; Chatlatanagulchai et al., arXiv:2511.12884, 2025). Hard-to-parse instructions are easy to misapply.',
          evidence: `Flesch Reading Ease ${Math.round(fre)} (< ${FRE_VERY_DIFFICULT} = very difficult)`,
          hint: 'Prefer short imperative sentences over dense prose.',
        }),
      );
    }
  }
  return findings;
}
