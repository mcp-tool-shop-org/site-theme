/**
 * front-door ablation — statistics.
 *
 * The three-arm ablation is a PAIRED design: every SWE-bench instance is run
 * through arms A, B and C, so the right test for "did the front door change the
 * resolution rate" is McNemar's test on the discordant pairs, not a two-sample
 * proportion test. This module is the zero-dependency stats core: probit, the
 * normal CDF, Wilson intervals, exact + corrected McNemar, the McNemar
 * sample-size / power calculator (so the run can be powered for a ~2-4pp
 * effect, per EVAL.md), and a seeded bootstrap for paired cost deltas.
 *
 * Everything here is pure and deterministic (the bootstrap takes an explicit
 * seed), which keeps a receipt byte-for-byte replayable (PIN_PER_STEP).
 */

// --- normal distribution ---------------------------------------------------

// Acklam's rational approximation to the inverse normal CDF. Accurate to ~1e-9
// over (0,1); used for the z-multipliers in Wilson intervals and power.
const A = [
  -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1,
  2.506628277459239,
];
const B = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
const C = [
  -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968,
  2.938163982698783,
];
const D = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

/** Inverse standard-normal CDF (quantile function). probit(0.975) ≈ 1.959964. */
export function probit(p) {
  if (p <= 0 || p >= 1) throw new Error(`probit: p must be in (0,1), got ${p}`);
  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5]) /
      ((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q + 1)
    );
  }
  if (p <= pHigh) {
    const q = p - 0.5;
    const r = q * q;
    return (
      ((((((A[0] * r + A[1]) * r + A[2]) * r + A[3]) * r + A[4]) * r + A[5]) * q) /
      (((((B[0] * r + B[1]) * r + B[2]) * r + B[3]) * r + B[4]) * r + 1)
    );
  }
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(
    (((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5]) /
    ((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q + 1)
  );
}

/** Error function (Abramowitz & Stegun 7.1.26), ~1e-7 accuracy. */
function erf(x) {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}

/** Standard-normal CDF. normalCdf(1.959964) ≈ 0.975. */
export function normalCdf(z) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

// --- log-gamma (for exact binomial tails) ----------------------------------

const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
  12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
];

/** Natural log of the gamma function (Lanczos approximation, g=7). */
export function lgamma(z) {
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  }
  const x = z - 1;
  let a = LANCZOS[0];
  const t = x + 7.5;
  for (let i = 1; i < LANCZOS.length; i++) a += LANCZOS[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/** Natural log of the binomial coefficient C(n, k). */
function lnChoose(n, k) {
  if (k < 0 || k > n) return Number.NEGATIVE_INFINITY;
  return lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1);
}

// --- proportions -----------------------------------------------------------

/**
 * Wilson score interval for a binomial proportion — well-behaved at the small
 * counts and rates near 0/1 that an early ablation run lands in.
 * @returns {{point:number, low:number, high:number, n:number}}
 */
export function wilsonInterval(k, n, alpha = 0.05) {
  if (n === 0) return { point: 0, low: 0, high: 0, n: 0 };
  const z = probit(1 - alpha / 2);
  const phat = k / n;
  const denom = 1 + (z * z) / n;
  const center = (phat + (z * z) / (2 * n)) / denom;
  const half = (z * Math.sqrt((phat * (1 - phat)) / n + (z * z) / (4 * n * n))) / denom;
  return { point: phat, low: Math.max(0, center - half), high: Math.min(1, center + half), n };
}

// --- McNemar (paired binary outcomes) --------------------------------------

/**
 * McNemar's test on a 2x2 paired table. `b` = instances the first arm resolved
 * and the second did not; `c` = the reverse. Discordant pairs (b + c) carry all
 * the signal. Returns both the exact two-sided binomial p-value (right for the
 * small samples a partial run produces) and the continuity-corrected chi-square.
 * @returns {{b:number, c:number, discordant:number, chiSquare:number,
 *   pExact:number, pChiSquare:number}}
 */
export function mcnemar(b, c) {
  const n = b + c;
  if (n === 0) {
    return { b, c, discordant: 0, chiSquare: 0, pExact: 1, pChiSquare: 1 };
  }
  const chiSquare = (Math.abs(b - c) - 1) ** 2 / n;
  const pChiSquare = Math.min(1, 2 * (1 - normalCdf(Math.sqrt(chiSquare))));
  const ln05n = n * Math.log(0.5);
  const kMin = Math.min(b, c);
  let tail = 0;
  for (let i = 0; i <= kMin; i++) tail += Math.exp(lnChoose(n, i) + ln05n);
  const pExact = Math.min(1, 2 * tail);
  return { b, c, discordant: n, chiSquare, pExact, pChiSquare };
}

/**
 * Required number of paired instances to detect a marginal resolution-rate
 * change of `delta` (e.g. 0.03 for 3pp) given the expected discordance rate
 * `discordRate` (p_b + p_c). Normal approximation for McNemar from Machin et
 * al., *Sample Size Tables for Clinical Studies* (3rd ed.); equivalently
 * Connor, *Biometrics* 43 (1987). Returns Infinity for a zero effect.
 */
export function mcnemarSampleSize(delta, discordRate, alpha = 0.05, power = 0.8) {
  const d = Math.abs(delta);
  if (d === 0) return Number.POSITIVE_INFINITY;
  if (discordRate < d) throw new Error(`discordRate (${discordRate}) must be >= |delta| (${d})`);
  const za = probit(1 - alpha / 2);
  const zb = probit(power);
  const inner = za * Math.sqrt(discordRate) + zb * Math.sqrt(Math.max(0, discordRate - d * d));
  return Math.ceil(inner ** 2 / (d * d));
}

/** Achieved power to detect `delta` with `n` paired instances at `discordRate`. */
export function mcnemarPower(n, delta, discordRate, alpha = 0.05) {
  const d = Math.abs(delta);
  if (d === 0 || n <= 0) return alpha;
  const za = probit(1 - alpha / 2);
  const variance = Math.max(1e-12, discordRate - d * d);
  const zb = (Math.sqrt(n) * d - za * Math.sqrt(discordRate)) / Math.sqrt(variance);
  return Math.max(0, Math.min(1, normalCdf(zb)));
}

// --- seeded bootstrap (paired cost deltas) ---------------------------------

/** mulberry32 — small, fast, seedable PRNG so the bootstrap is replayable. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mean(xs) {
  if (xs.length === 0) return 0;
  let s = 0;
  for (const x of xs) s += x;
  return s / xs.length;
}

/**
 * Percentile bootstrap CI for the mean of paired deltas (e.g. per-instance cost
 * differences B - A). Deterministic given `seed`.
 * @returns {{mean:number, low:number, high:number, iterations:number, n:number}}
 */
export function bootstrapMeanCI(values, { iterations = 2000, alpha = 0.05, seed = 1 } = {}) {
  const n = values.length;
  if (n === 0) return { mean: 0, low: 0, high: 0, iterations: 0, n: 0 };
  const rng = mulberry32(seed);
  const means = new Array(iterations);
  for (let it = 0; it < iterations; it++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += values[(rng() * n) | 0];
    means[it] = s / n;
  }
  means.sort((x, y) => x - y);
  const lo = means[Math.floor((alpha / 2) * iterations)];
  const hi = means[Math.min(iterations - 1, Math.floor((1 - alpha / 2) * iterations))];
  return { mean: mean(values), low: lo, high: hi, iterations, n };
}
