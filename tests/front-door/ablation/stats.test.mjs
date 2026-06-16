import { describe, expect, it } from 'vitest';
import {
  bootstrapMeanCI,
  lgamma,
  mcnemar,
  mcnemarPower,
  mcnemarSampleSize,
  mulberry32,
  normalCdf,
  probit,
  wilsonInterval,
} from '../../../cli/front-door/ablation/stats.mjs';

const close = (a, b, eps = 1e-3) => Math.abs(a - b) <= eps;

describe('probit / normalCdf', () => {
  it('matches known normal quantiles', () => {
    expect(close(probit(0.975), 1.959964)).toBe(true);
    expect(close(probit(0.95), 1.644854)).toBe(true);
    expect(close(probit(0.8), 0.841621)).toBe(true);
  });
  it('is the inverse of normalCdf', () => {
    expect(close(normalCdf(0), 0.5)).toBe(true);
    expect(close(normalCdf(1.959964), 0.975, 1e-3)).toBe(true);
    expect(close(normalCdf(probit(0.3)), 0.3, 1e-3)).toBe(true);
  });
  it('rejects out-of-range p', () => {
    expect(() => probit(0)).toThrow();
    expect(() => probit(1)).toThrow();
  });
});

describe('lgamma', () => {
  it('matches factorials: lgamma(n+1) = ln(n!)', () => {
    expect(close(Math.exp(lgamma(6)), 120, 1e-6)).toBe(true); // 5!
    expect(close(Math.exp(lgamma(11)), 3628800, 1)).toBe(true); // 10!
  });
});

describe('wilsonInterval', () => {
  it('brackets the point estimate inside (0,1)', () => {
    const w = wilsonInterval(8, 10);
    expect(w.point).toBe(0.8);
    expect(w.low).toBeGreaterThan(0);
    expect(w.low).toBeLessThan(0.8);
    expect(w.high).toBeGreaterThan(0.8);
    expect(w.high).toBeLessThanOrEqual(1);
  });
  it('returns zeros for n=0', () => {
    expect(wilsonInterval(0, 0)).toEqual({ point: 0, low: 0, high: 0, n: 0 });
  });
});

describe('mcnemar', () => {
  it('exact p-value matches the binomial tail (8 vs 2 ≈ 0.109)', () => {
    const r = mcnemar(8, 2);
    expect(close(r.pExact, 0.109375, 1e-4)).toBe(true);
    expect(r.discordant).toBe(10);
  });
  it('extreme discordance is significant (10 vs 0 ≈ 0.00195)', () => {
    const r = mcnemar(10, 0);
    expect(close(r.pExact, 0.001953, 1e-5)).toBe(true);
    expect(close(r.chiSquare, 8.1, 1e-9)).toBe(true);
  });
  it('no discordant pairs → p = 1', () => {
    const r = mcnemar(0, 0);
    expect(r.pExact).toBe(1);
    expect(r.discordant).toBe(0);
  });
});

describe('McNemar power / sample size', () => {
  it('sample size for 10pp at 50% discordance ≈ 391', () => {
    expect(mcnemarSampleSize(0.1, 0.5, 0.05, 0.8)).toBe(391);
  });
  it('that sample size achieves ~80% power', () => {
    expect(close(mcnemarPower(391, 0.1, 0.5, 0.05), 0.8, 0.02)).toBe(true);
  });
  it('zero effect needs infinite n', () => {
    expect(mcnemarSampleSize(0, 0.5)).toBe(Number.POSITIVE_INFINITY);
  });
  it('rejects a discordance rate below the effect', () => {
    expect(() => mcnemarSampleSize(0.6, 0.5)).toThrow();
  });
});

describe('seeded bootstrap', () => {
  it('mulberry32 is deterministic for a seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it('CI is deterministic and brackets the mean', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8];
    const r1 = bootstrapMeanCI(values, { seed: 7, iterations: 1000 });
    const r2 = bootstrapMeanCI(values, { seed: 7, iterations: 1000 });
    expect(r1).toEqual(r2);
    expect(r1.mean).toBe(4.5);
    expect(r1.low).toBeLessThanOrEqual(4.5);
    expect(r1.high).toBeGreaterThanOrEqual(4.5);
  });
  it('handles an empty sample', () => {
    expect(bootstrapMeanCI([])).toEqual({ mean: 0, low: 0, high: 0, iterations: 0, n: 0 });
  });
});
