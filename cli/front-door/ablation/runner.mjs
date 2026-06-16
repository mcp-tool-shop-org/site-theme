/**
 * front-door ablation — the runner.
 *
 * Runs every instance through arms A/B/C under ONE pin, grades each by executing
 * the hidden tests, and reduces the results to a receipt: per-arm resolution
 * rate (Wilson CI) and cost, paired A->B / B->C / A->C comparisons (McNemar +
 * bootstrapped cost deltas), and a power section sized for a ~2-4pp effect.
 *
 * Generation and grading are separated (EXTERNAL_VERIFIER): the agent edits the
 * workspace; the runner overlays the HIDDEN test files and executes them. The
 * agent never sees the oracle. A divergent pin halts the run (ANDON).
 */

import { ARMS, buildArmWorkspace } from './arms.mjs';
import { gradeOutcome } from './grade.mjs';
import { assertArmsSharePin } from './pin.mjs';
import { bootstrapMeanCI, mcnemar, mcnemarPower, mcnemarSampleSize, wilsonInterval } from './stats.mjs';

function median(xs) {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function sum(xs) {
  return xs.reduce((a, b) => a + b, 0);
}

function costAggregate(costs) {
  const tokensTotal = costs.map((c) => c.tokensTotal);
  const steps = costs.map((c) => c.steps);
  const n = costs.length || 1;
  return {
    meanSteps: sum(steps) / n,
    meanTokensIn: sum(costs.map((c) => c.tokensIn)) / n,
    meanTokensOut: sum(costs.map((c) => c.tokensOut)) / n,
    meanTokensTotal: sum(tokensTotal) / n,
    medianTokensTotal: median(tokensTotal),
    totalTokens: sum(tokensTotal),
  };
}

function pct(x) {
  return Math.round(x * 1000) / 10; // one decimal place, as a percentage
}

function compare(from, to, perInstance, rates, bootSeed) {
  let b = 0;
  let c = 0;
  const tokenDeltas = [];
  const stepDeltas = [];
  for (const inst of perInstance) {
    const x = inst.arms[from].resolved;
    const y = inst.arms[to].resolved;
    if (x && !y) b += 1;
    if (!x && y) c += 1;
    tokenDeltas.push(inst.arms[to].cost.tokensTotal - inst.arms[from].cost.tokensTotal);
    stepDeltas.push(inst.arms[to].cost.steps - inst.arms[from].cost.steps);
  }
  const mc = mcnemar(b, c);
  const deltaRate = rates[to].point - rates[from].point;
  const meanTokenFrom = bootstrapMeanCI(
    perInstance.map((i) => i.arms[from].cost.tokensTotal),
    { seed: bootSeed },
  );
  return {
    from,
    to,
    resolutionDelta: { points: deltaRate, percentagePoints: pct(deltaRate) },
    mcnemar: { b, c, discordant: mc.discordant, chiSquare: mc.chiSquare, pExact: mc.pExact, pChiSquare: mc.pChiSquare },
    cost: {
      tokensTotalDelta: bootstrapMeanCI(tokenDeltas, { seed: bootSeed }),
      stepsDelta: bootstrapMeanCI(stepDeltas, { seed: bootSeed + 1 }),
      relativeTokenChange: meanTokenFrom.mean ? sum(tokenDeltas) / perInstance.length / meanTokenFrom.mean : 0,
    },
  };
}

/**
 * @param {{
 *   corpus:{name:string, version?:number, instances:Array},
 *   agent:(ws:object, instance:object, pin:object)=>{workspace:object, cost:object},
 *   execute:(ws:object)=>{passing:Set<string>},
 *   pin:object,
 *   docGlobs?:string[],
 *   bootstrapSeed?:number,
 *   powerTargets?:number[],
 *   alpha?:number,
 *   targetPower?:number,
 *   stampedAt?:string,
 *   kind?:string,
 *   measuresFrontDoorEffect?:boolean,
 *   disclaimer?:string,
 * }} opts
 */
export function runAblation(opts) {
  const {
    corpus,
    agent,
    execute,
    pin,
    docGlobs,
    bootstrapSeed = 12345,
    powerTargets = [0.02, 0.03, 0.04],
    alpha = 0.05,
    targetPower = 0.8,
    stampedAt = null,
    kind = 'swe-ablation',
    measuresFrontDoorEffect = true,
    disclaimer = '',
  } = opts;

  const external = corpus.instances.find((i) => i.external);
  if (external) {
    throw new Error(
      `runAblation: instance "${external.id}" is flagged external (real SWE-bench needs a repo checkout + container + external agent). Use the command adapter/executor — see ABLATION.md.`,
    );
  }

  const pinRecords = [];
  const perInstance = [];
  const byCategory = {};

  for (const instance of corpus.instances) {
    byCategory[instance.category] = (byCategory[instance.category] ?? 0) + 1;
    const arms = {};
    for (const arm of ARMS) {
      const armWorkspace = buildArmWorkspace({
        baseFiles: instance.baseFiles,
        frontDoor: instance.frontDoor,
        arm,
        docGlobs,
      });
      const result = agent(armWorkspace, instance, pin);
      pinRecords.push({ arm: arm.id, instanceId: instance.id, pinHash: pin.hash });
      // Overlay the HIDDEN oracle only now — the agent never saw it.
      const graded = execute({ ...result.workspace, ...instance.testFiles });
      const verdict = gradeOutcome(graded.passing, instance.gradeSpec);
      arms[arm.id] = { resolved: verdict.resolved, cost: result.cost, verdict };
    }
    perInstance.push({ id: instance.id, category: instance.category, arms });
  }

  assertArmsSharePin(pin.hash, pinRecords);

  const n = perInstance.length;
  const armSummaries = ARMS.map((arm) => {
    const resolved = perInstance.filter((i) => i.arms[arm.id].resolved).length;
    const costs = perInstance.map((i) => i.arms[arm.id].cost);
    return {
      id: arm.id,
      label: arm.label,
      n,
      resolved,
      resolutionRate: wilsonInterval(resolved, n, alpha),
      cost: costAggregate(costs),
    };
  });
  const rates = Object.fromEntries(armSummaries.map((a) => [a.id, a.resolutionRate]));

  const comparisons = [
    compare('A', 'B', perInstance, rates, bootstrapSeed),
    compare('B', 'C', perInstance, rates, bootstrapSeed + 10),
    compare('A', 'C', perInstance, rates, bootstrapSeed + 20),
  ];

  // Power: use the primary A->B discordance to size the run for a small effect.
  const ab = comparisons[0].mcnemar;
  const discordRate = ab.discordant / n;
  const requiredN = {};
  for (const t of powerTargets) {
    const key = `${pct(t)}pp`;
    requiredN[key] =
      discordRate >= t
        ? mcnemarSampleSize(t, discordRate, alpha, targetPower)
        : 'discordance too low at this n to size';
  }
  const power = {
    note: 'Sized from the A->B discordance rate; requires the discordance rate to exceed the target effect.',
    alpha,
    targetPower,
    discordanceRateObserved: discordRate,
    discordantPairsAB: ab.discordant,
    requiredNForTargetPower: requiredN,
    achievedPowerFor3pp: discordRate > 0.03 ? mcnemarPower(n, 0.03, discordRate, alpha) : null,
  };

  return {
    tool: 'front-door',
    kind,
    measuresFrontDoorEffect,
    disclaimer,
    generatedAt: stampedAt,
    grading: 'execution — fail_to_pass + pass_to_pass (no model grade)',
    pin: { hash: pin.hash, agent: pin.agent, generator: pin.generator, judge: pin.judge, grading: pin.grading },
    corpus: { name: corpus.name, version: corpus.version ?? 1, n, byCategory },
    arms: armSummaries,
    comparisons,
    power,
    perInstance: perInstance.map((i) => ({
      id: i.id,
      category: i.category,
      arms: Object.fromEntries(ARMS.map((a) => [a.id, { resolved: i.arms[a.id].resolved, cost: i.arms[a.id].cost }])),
    })),
  };
}
