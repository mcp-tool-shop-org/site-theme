import { describe, expect, it } from 'vitest';
import { gradeOutcome } from '../../../cli/front-door/ablation/grade.mjs';

const spec = { failToPass: ['f1', 'f2'], passToPass: ['p1'] };

describe('gradeOutcome (the execution oracle)', () => {
  it('resolved only when all fail-to-pass AND all pass-to-pass pass', () => {
    const r = gradeOutcome(['f1', 'f2', 'p1'], spec);
    expect(r.resolved).toBe(true);
    expect(r.f2p).toEqual({ passed: 2, total: 2 });
    expect(r.p2p).toEqual({ passed: 1, total: 1 });
    expect(r.missing).toEqual([]);
  });

  it('a failing fail-to-pass test means unresolved', () => {
    const r = gradeOutcome(['f1', 'p1'], spec);
    expect(r.resolved).toBe(false);
    expect(r.f2pPassed).toBe(false);
    expect(r.missing).toContain('f2');
  });

  it('a regressed pass-to-pass test means unresolved even if the fix lands', () => {
    const r = gradeOutcome(['f1', 'f2'], spec);
    expect(r.resolved).toBe(false);
    expect(r.p2pPassed).toBe(false);
    expect(r.missing).toContain('p1');
  });

  it('accepts a Set as well as an array', () => {
    expect(gradeOutcome(new Set(['f1', 'f2', 'p1']), spec).resolved).toBe(true);
  });
});
