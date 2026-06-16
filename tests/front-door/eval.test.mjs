import { describe, expect, it } from 'vitest';
import { runEval } from '../../cli/front-door/eval.mjs';

describe('front-door self-eval', () => {
  it('every corpus case behaves as labeled (100% accuracy)', () => {
    const r = runEval();
    expect(r.cases.filter((c) => !c.ok).map((c) => c.name)).toEqual([]);
    expect(r.accuracy).toBe(1);
  });

  it('produces a receipt-shaped report', () => {
    const r = runEval();
    expect(r.tool).toBe('front-door');
    expect(r.kind).toBe('verifier-self-eval');
    expect(r.total).toBeGreaterThanOrEqual(6);
    expect(typeof r.accuracy).toBe('number');
  });
});
