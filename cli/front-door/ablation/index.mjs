/**
 * front-door ablation — CLI surface.
 *
 * `front-door ablation run` executes the three-arm docs-on/off experiment from
 * EVAL.md. The self-contained, in-process path (`--adapter lookup --corpus
 * synthetic`, the default) runs end-to-end here and emits a real receipt: it
 * proves the harness — arm construction, execution grading, cost accounting,
 * paired statistics, receipt shape. The real-effect path (`--corpus swebench`)
 * needs an external agent + per-instance containers + a model, which are not
 * bundled; the CLI prints that contract and exits rather than faking it.
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { lookupAgent } from './agent.mjs';
import { syntheticCorpus } from './corpus.mjs';
import { makeNodeExecutor } from './execute.mjs';
import { definePin } from './pin.mjs';
import { runAblation } from './runner.mjs';

const SELF_VALIDATION_DISCLAIMER =
  'Harness self-validation on a SYNTHETIC corpus with a deterministic toy agent. ' +
  'It proves the machinery (arm construction, execution grading, cost accounting, paired statistics), ' +
  'NOT that a real front door helps a real agent. The real-effect arms (SWE-bench Verified + an external ' +
  'agent + a model) were not run in this session — see cli/front-door/ABLATION.md.';

function parseFlags(argv) {
  const flags = {
    adapter: 'lookup',
    corpus: 'synthetic',
    instances: 60,
    seed: 12345,
    out: '',
    json: false,
    dataset: '',
    stampedAt: '',
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--adapter' && argv[i + 1]) flags.adapter = argv[++i];
    else if (a === '--corpus' && argv[i + 1]) flags.corpus = argv[++i];
    else if (a === '--instances' && argv[i + 1]) flags.instances = Number.parseInt(argv[++i], 10);
    else if (a === '--seed' && argv[i + 1]) flags.seed = Number.parseInt(argv[++i], 10);
    else if (a === '--out' && argv[i + 1]) flags.out = argv[++i];
    else if (a === '--dataset' && argv[i + 1]) flags.dataset = argv[++i];
    else if (a === '--stamped-at' && argv[i + 1]) flags.stampedAt = argv[++i];
    else if (a === '--json') flags.json = true;
  }
  return flags;
}

function bar(rate) {
  const filled = Math.round(rate * 20);
  return `${'█'.repeat(filled)}${'░'.repeat(20 - filled)}`;
}

function renderSummary(receipt) {
  const out = ['', '\x1b[1mfront-door — three-arm ablation\x1b[0m', ''];
  out.push(`  kind: ${receipt.kind}   measures-real-effect: ${receipt.measuresFrontDoorEffect}`);
  out.push(`  pin: ${receipt.pin.hash}   grading: ${receipt.grading}`);
  out.push(`  corpus: ${receipt.corpus.name} (n=${receipt.corpus.n})`);
  out.push('');
  out.push('  arm                              resolved   rate    mean tokens');
  for (const a of receipt.arms) {
    const rate = `${(a.resolutionRate.point * 100).toFixed(1)}%`.padStart(6);
    out.push(
      `  ${a.id} ${a.label.padEnd(28)} ${String(a.resolved).padStart(3)}/${a.n}  ${rate}  ${bar(a.resolutionRate.point)}  ${Math.round(a.cost.meanTokensTotal)}`,
    );
  }
  out.push('');
  out.push('  comparison   Δresolution   McNemar p(exact)   Δtokens (mean [95% CI])');
  for (const c of receipt.comparisons) {
    const d = `${c.resolutionDelta.percentagePoints >= 0 ? '+' : ''}${c.resolutionDelta.percentagePoints}pp`.padStart(
      7,
    );
    const ct = c.cost.tokensTotalDelta;
    out.push(
      `  ${c.from}→${c.to}        ${d}      ${c.mcnemar.pExact.toFixed(4)}            ${ct.mean >= 0 ? '+' : ''}${ct.mean.toFixed(1)} [${ct.low.toFixed(1)}, ${ct.high.toFixed(1)}]`,
    );
  }
  out.push('');
  out.push(
    `  power: discordance(A→B)=${(receipt.power.discordanceRateObserved * 100).toFixed(1)}%  ` +
      `N for 3pp@${receipt.power.targetPower}=${receipt.power.requiredNForTargetPower['3pp']}  ` +
      `achieved power for 3pp at n=${receipt.corpus.n}: ${receipt.power.achievedPowerFor3pp === null ? 'n/a' : receipt.power.achievedPowerFor3pp.toFixed(2)}`,
  );
  if (!receipt.measuresFrontDoorEffect) {
    out.push('', `  \x1b[33m⚠ ${receipt.disclaimer}\x1b[0m`);
  }
  out.push('');
  return out.join('\n');
}

function realRunContract() {
  return `
front-door ablation — real-effect run (SWE-bench Verified)

The in-process harness does not bundle the external stack a real run needs:
  1. Dataset    princeton-nlp/SWE-bench_Verified (500 instances)
  2. Repos      per-instance git checkout at base_commit + the instance image
  3. Agent      an external coding agent (e.g. mini-swe-agent) bound to the pin
  4. Model      an LLM API for the generator (and a cross-family judge if needed)

The harness exposes the seams to wire this:
  - corpus.parseSweBenchVerified(text)   -> instances (flagged external)
  - agent.makeCommandAgent({command})     -> drives the external agent on a checkout
  - execute.makeCommandExecutor({command})-> runs the hidden tests in the image
  - pin.definePin(), stats.*, grade.*, arms.* are reused unchanged

See cli/front-door/ABLATION.md for the full wiring + grading contract.
This session ran the synthetic self-validation only (front-door ablation run).
`;
}

/** CLI entry for `front-door ablation [run] [options]`. */
export function runAblationCli(argv) {
  const rest = argv[0] === 'run' ? argv.slice(1) : argv;
  const flags = parseFlags(rest);

  if (flags.corpus === 'swebench' || flags.adapter === 'command') {
    process.stdout.write(realRunContract());
    process.exit(2);
  }

  const corpus = syntheticCorpus({ n: flags.instances });
  // The self-validation runs a DETERMINISTIC lookup agent — no model is invoked,
  // so the pin says so rather than naming a generator that did not run. The
  // real-run default pin (a pinned model generator + cross-family judge) lives in
  // definePin(); see ABLATION.md.
  const pin = definePin({
    agent: {
      harness: 'lookup-reference-agent',
      version: 'deterministic',
      toolSchema: ['read', 'str-replace'],
      maxSteps: 0,
    },
    generator: { model: 'deterministic-lookup', family: 'none', decoding: {}, systemPromptHash: 'n/a' },
  });
  const execute = makeNodeExecutor();
  const receipt = runAblation({
    corpus,
    agent: lookupAgent,
    execute,
    pin,
    bootstrapSeed: flags.seed,
    stampedAt: flags.stampedAt || null,
    kind: 'harness-self-validation',
    measuresFrontDoorEffect: false,
    disclaimer: SELF_VALIDATION_DISCLAIMER,
  });

  if (flags.out) {
    writeFileSync(resolve(process.cwd(), flags.out), `${JSON.stringify(receipt, null, 2)}\n`, 'utf-8');
  }
  if (flags.json) {
    process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  } else {
    process.stdout.write(renderSummary(receipt));
    if (flags.out) process.stdout.write(`receipt written to ${flags.out}\n\n`);
  }
}
