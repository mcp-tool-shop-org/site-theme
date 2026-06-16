import { describe, expect, it } from 'vitest';
import { lookupAgent } from '../../../cli/front-door/ablation/agent.mjs';
import { syntheticCorpus } from '../../../cli/front-door/ablation/corpus.mjs';
import { definePin } from '../../../cli/front-door/ablation/pin.mjs';
import { runAblation } from '../../../cli/front-door/ablation/runner.mjs';

/**
 * Fast in-memory executor mirroring the hidden-test semantics (widget value vs
 * the key embedded in run-tests.mjs) without spawning Node — keeps the runner's
 * stats/receipt assertions deterministic and quick. The real spawn path is
 * covered by execute.test.mjs and the CLI test.
 */
function stubExecutor(workspace) {
  const widget = workspace['src/widget.mjs'] ?? '';
  const test = workspace['run-tests.mjs'] ?? '';
  const value = /return '([^']*)'/.exec(widget)?.[1] ?? '';
  // Anchor on the f2p marker so we don't accidentally match `typeof v === 'string'`.
  const key = /=== '([^']*)' \? 'PASS f2p:value'/.exec(test)?.[1] ?? '';
  const passing = new Set();
  if (typeof value === 'string') passing.add('p2p:callable');
  if (value === key) passing.add('f2p:value');
  return { passing };
}

function go(n = 50) {
  return runAblation({
    corpus: syntheticCorpus({ n }),
    agent: lookupAgent,
    execute: stubExecutor,
    pin: definePin(),
    kind: 'harness-self-validation',
    measuresFrontDoorEffect: false,
    disclaimer: 'test',
  });
}

describe('runAblation', () => {
  it('emits a receipt with three arms, comparisons, and a power section', () => {
    const r = go();
    expect(r.arms.map((a) => a.id)).toEqual(['A', 'B', 'C']);
    expect(r.comparisons.map((c) => `${c.from}${c.to}`)).toEqual(['AB', 'BC', 'AC']);
    expect(r.pin.hash).toBeDefined();
    expect(r.power.requiredNForTargetPower['3pp']).toBeDefined();
    expect(r.perInstance).toHaveLength(50);
    expect(r.grading).toMatch(/execution/);
  });

  it('the front door lifts resolution over baseline (B > A), driven by doc-only wins', () => {
    const r = go();
    const a = r.arms.find((x) => x.id === 'A').resolved;
    const b = r.arms.find((x) => x.id === 'B').resolved;
    expect(b).toBeGreaterThan(a);
    // McNemar A→B must have B-only wins (c > 0) and the delta must be positive.
    expect(r.comparisons[0].mcnemar.c).toBeGreaterThan(0);
    expect(r.comparisons[0].resolutionDelta.points).toBeGreaterThan(0);
  });

  it('carries the honesty flags through to the receipt', () => {
    const r = go();
    expect(r.measuresFrontDoorEffect).toBe(false);
    expect(r.kind).toBe('harness-self-validation');
  });

  it('is fully deterministic for fixed inputs (replayable)', () => {
    expect(JSON.stringify(go(40))).toBe(JSON.stringify(go(40)));
  });

  it('refuses to fake-run external (real SWE-bench) instances', () => {
    const corpus = {
      name: 'x',
      instances: [{ id: 'i', category: 'swebench-verified', external: true, gradeSpec: {} }],
    };
    expect(() => runAblation({ corpus, agent: lookupAgent, execute: stubExecutor, pin: definePin() })).toThrow(
      /external/,
    );
  });
});
