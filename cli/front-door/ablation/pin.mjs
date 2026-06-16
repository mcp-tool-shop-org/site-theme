/**
 * front-door ablation — the pinned run spec (PIN_PER_STEP).
 *
 * The whole experiment hinges on ONE thing being true: across arms A, B and C
 * the agent, model, tool schema, decoding params and prompts are identical, so
 * the ONLY thing that varies is the front door. This module is that pin — a
 * frozen spec plus a content hash, so a wave is byte-for-byte replayable and any
 * arm that ran under a different pin is detectable (ANDON_AUTHORITY).
 *
 * It also encodes EXTERNAL_VERIFIER: the test oracle grades resolution (code
 * execution, not a model), and any unavoidable qualitative call must use a
 * DIFFERENT model family from the generator with the generator's reasoning
 * hidden (Huang et al. arXiv:2310.01798; Kambhampati et al. arXiv:2402.01817).
 * `definePin` refuses a same-family judge.
 */

import { createHash } from 'node:crypto';

/** Canonical (sorted-key) JSON so the hash is stable regardless of key order. */
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

/** SHA-256 of a pin's identity fields — the replayability fingerprint. */
export function pinHash(pin) {
  const identity = {
    agent: pin.agent,
    generator: pin.generator,
    judge: pin.judge,
    grading: pin.grading,
  };
  return createHash('sha256').update(canonical(identity)).digest('hex').slice(0, 16);
}

/**
 * Build a frozen, hashed run spec. Throws if the qualitative-judge family equals
 * the generator family (would violate EXTERNAL_VERIFIER) or if grading is not
 * execution-based (the protocol forbids an LLM grade of resolution).
 *
 * @param {object} [overrides] partial spec to merge over the defaults
 */
export function definePin(overrides = {}) {
  const pin = {
    // The agent / ACI is held fixed across arms — scaffolding alone is a
    // first-order driver of measured success (SWE-agent, arXiv:2405.15793).
    agent: {
      harness: 'mini-swe-agent',
      version: 'PINNED-AT-RUN',
      toolSchema: ['bash', 'str_replace_editor', 'submit'],
      maxSteps: 40,
      ...(overrides.agent ?? {}),
    },
    // The generator model that drives every arm. Identical across A/B/C.
    generator: {
      model: 'claude-sonnet-4-6',
      family: 'anthropic',
      decoding: { temperature: 0, topP: 1 },
      systemPromptHash: 'PINNED-AT-RUN',
      ...(overrides.generator ?? {}),
    },
    // Only consulted for an unavoidable qualitative call. MUST be a different
    // family from the generator, reasoning hidden. Resolution itself is never
    // judged by a model.
    judge: {
      model: 'gpt-oss:120b-cloud',
      family: 'openai',
      reasoningHidden: true,
      role: 'tie-break-qualitative-only',
      ...(overrides.judge ?? {}),
    },
    // The grader is the test oracle: hidden fail-to-pass + pass-to-pass tests,
    // executed. Never an LLM grade.
    grading: {
      method: 'execution',
      oracle: 'fail_to_pass + pass_to_pass',
      ...(overrides.grading ?? {}),
    },
  };

  if (pin.judge.family === pin.generator.family) {
    throw new Error(
      `pin: judge family "${pin.judge.family}" must differ from generator family "${pin.generator.family}" (EXTERNAL_VERIFIER).`,
    );
  }
  if (pin.grading.method !== 'execution') {
    throw new Error(
      `pin: grading.method must be "execution" (code execution, never an LLM grade), got "${pin.grading.method}".`,
    );
  }

  pin.hash = pinHash(pin);
  return Object.freeze(pin);
}

/**
 * ANDON gate: every per-arm record must carry the run's pin hash. A divergent
 * hash means an arm ran under different conditions and the comparison is void —
 * halt rather than report a contaminated delta.
 * @param {string} expected the run pin hash
 * @param {Array<{arm:string, instanceId:string, pinHash:string}>} records
 */
export function assertArmsSharePin(expected, records) {
  const offenders = records.filter((r) => r.pinHash !== expected);
  if (offenders.length > 0) {
    const sample = offenders
      .slice(0, 3)
      .map((o) => `${o.instanceId}/${o.arm} used ${o.pinHash}`)
      .join('; ');
    throw new Error(
      `ANDON: ${offenders.length} record(s) ran under a different pin than ${expected} (${sample}). The arms are not comparable.`,
    );
  }
}
