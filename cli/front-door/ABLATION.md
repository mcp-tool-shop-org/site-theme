# front-door — three-arm ablation harness

This is the **§2 experiment from [EVAL.md](./EVAL.md)**, implemented as a runnable
harness: *does a good front door actually help a coding agent, and at what cost?*
It is distinct from the verifier self-eval ([eval.mjs](./eval.mjs)), which only
proves the verifier behaves correctly.

The design (verbatim from EVAL.md): three arms, with the agent, model, tool
schema and prompts **pinned** across arms so only the front door varies —

- **A** — repo as-is (baseline)
- **B** — repo + front-door (the real-world delta)
- **C** — docs-stripped repo + front-door (isolates the front door's *marginal*
  contribution; context that just duplicates existing docs is overhead)

Success is decided by **code execution** — hidden fail-to-pass tests plus
pass-to-pass regression guards (Jimenez et al., [arXiv:2310.06770](https://arxiv.org/abs/2310.06770)) —
**never an LLM grade**. We report **resolution rate (primary)** and **cost
(tokens, steps)**, because context can *raise* success while ballooning cost
(Gloaguen et al., [arXiv:2602.11988](https://arxiv.org/abs/2602.11988): AGENTS.md
files lowered success and added 20–23% cost). Any unavoidable qualitative call
uses a **different model family** with the generator's reasoning hidden (Huang et
al., [arXiv:2310.01798](https://arxiv.org/abs/2310.01798); Kambhampati et al.,
[arXiv:2402.01817](https://arxiv.org/abs/2402.01817)).

## Standards compliance (memory/workflow_standards.md)

Scored 0–3 (0 missing · 1 partial · 2 present · 3 exemplary).

- **PIN_PER_STEP — 3.** `definePin()` freezes + SHA-256-hashes the full spec
  (agent, generator model+decoding, judge, grading). Every per-arm record carries
  the hash; the run is replayable byte-for-byte (deterministic agent + seeded
  bootstrap + no `Date.now()` inside the runner). Tested in `pin.test.mjs`.
- **ANDON_AUTHORITY — 3.** `assertArmsSharePin()` halts the run if any arm ran
  under a different pin (the comparison would be void). The runner also refuses
  to fake-run `external` (real SWE-bench) instances through the in-process Node
  executor. Both tested.
- **NAMED_COMPENSATORS — 2.** The harness performs **no irreversible public
  action**. Side effects + undos are tabled below.
- **DECOMPOSE_BY_SECRETS — 3.** One module per concern (`stats`, `arms`, `grade`,
  `execute`, `agent`, `corpus`, `runner`, `pin`); astro-free, zero-dependency.
  Adapters and executors are injected, so the real path swaps in without touching
  the stats/grading core.
- **UNCERTAINTY_GATED_HUMANS — 2.** The receipt foregrounds its own
  uncertainty — Wilson CIs per arm, McNemar p-values per comparison, and a
  **power section** that states the achieved power and the N required for a
  2–4pp effect. The CLI refuses the real-effect path with a printed contract
  rather than silently producing a number it can't back.
- **EXTERNAL_VERIFIER — 3.** Resolution is graded by executing tests, never by a
  model. The agent **never sees the hidden tests** (they are overlaid only at
  grading time). `definePin()` rejects a same-family judge and any non-execution
  grader.

### Compensators (side effects → undo)

| Action | Path | Compensator | Post-rollback state | Owner |
| --- | --- | --- | --- | --- |
| Write receipt JSON | both | overwrite, or `git checkout -- receipts/front-door-ablation.json` | receipt unchanged | ablation |
| Materialize workspace to a temp dir | both | executor always `rm -rf`s its temp dir in a `finally` | no temp left | ablation |
| Spawn per-instance container | real | `docker rm -f <id>` (and the temp-dir cleanup above) | containers removed | ablation |
| LLM API generation spend | real | **none — spend is irreversible.** Size the run with `--instances` + the power calc BEFORE launching | budget consumed | operator |

## Two run modes

### 1. Synthetic self-validation (runs here, zero deps)

```bash
site-theme front-door ablation run --instances 60 --out receipts/front-door-ablation.json
```

Runs the full pipeline end-to-end on a **synthetic, execution-graded
micro-benchmark** with a **deterministic reference agent**. It proves the
machinery — arm construction, real test-execution grading, cost accounting,
paired statistics, receipt emission — on real code execution (it actually spawns
Node to run each instance's hidden test).

It is **not** a measurement of the front door's real effect. The corpus is toy
and the agent is a lookup rule, so the receipt carries `measuresFrontDoorEffect:
false` and `kind: "harness-self-validation"`. What the numbers *do* mean: they
are emergent outputs of the corpus + agent, not values hand-set per arm. The
corpus plants a load-bearing fact in different places per **category**, and the
agent's success/cost falls out of which arm exposes that fact:

| Category | Fact lives in | Demonstrates |
| --- | --- | --- |
| `doc-only` | front door only | front door **helps** (A fails, B/C win) |
| `doc-and-frontdoor` | base docs **and** front door | C **isolates** the marginal contribution (still wins after strip) |
| `doc-only-base` | base docs only | **strip risk** — C loses the fact the front door didn't capture |
| `code-evident` | source (never stripped) | front door is **pure cost** (Gloaguen): same success, more tokens |
| `unfixable` | nowhere | **false-positive guard** — all arms fail |

The agent reads the front door first, then the README, then the rest — which is
why a redundant front door measurably *adds* read cost. Token cost is a
documented `chars / 4` proxy for bytes read.

### 2. Real-effect run (SWE-bench Verified — external compute, NOT run here)

The in-process harness does not bundle the external stack a real run needs:

1. **Dataset** — `princeton-nlp/SWE-bench_Verified` (500 instances).
2. **Repos** — a git checkout at each `base_commit` plus the instance's
   environment / Docker image.
3. **Agent** — an external coding agent (e.g. `mini-swe-agent` / `SWE-agent`)
   bound to the pin; the ACI is held fixed across arms because scaffolding alone
   is a first-order driver of measured success (SWE-agent,
   [arXiv:2405.15793](https://arxiv.org/abs/2405.15793)).
4. **Model** — an LLM API for the generator (and a cross-family judge if a
   qualitative call is ever needed).

The harness exposes the seams to wire it, reusing the stats / grading / arms /
pin core unchanged:

```js
import { parseSweBenchVerified } from './corpus.mjs';   // dataset -> instances (flagged external)
import { makeCommandAgent } from './agent.mjs';          // drives the external agent on a checkout
import { makeCommandExecutor } from './execute.mjs';     // runs the hidden tests in the image
import { definePin } from './pin.mjs';
import { runAblation } from './runner.mjs';
```

**Real-run contract.** For each `external` instance, an orchestrator (not bundled
here) must: check out `repo@base_commit`, build arms A/B/C with `buildArmWorkspace`
(arm B/C overlay the front door; C also strips docs), hand each arm to the agent
under the **same pin**, apply the instance's hidden `test_patch`, run the
`FAIL_TO_PASS` + `PASS_TO_PASS` selection inside the image via a reporter shim
that emits `PASS <id>` / `FAIL <id>`, and feed the passing set to `gradeOutcome`.
The agent's cost is read from a `.front-door-cost.json` it drops. Then the same
`runAblation` reductions (per-arm Wilson rates, McNemar, bootstrap cost deltas,
power) apply. **Power it for the real target:** to detect a 2–4pp effect you need
on the order of 1,000–5,000 paired instances *at the observed discordance rate*
(the receipt's `power.requiredNForTargetPower` computes this from the actual run),
which means multiple passes over the 500-instance set or a multi-seed design —
budget accordingly, since the API spend is the irreversible cost above.

The CLI prints this contract and exits non-zero for `--corpus swebench` /
`--adapter command` rather than emitting a number it did not actually measure.

## What this session covered (and did not)

**Covered (shipped + run):**

- The full harness: arm construction, execution grading, cost accounting, paired
  statistics (McNemar exact + chi-square, Wilson, seeded bootstrap, McNemar power
  / sample size), pin + andon, receipt emission.
- A real, executed synthetic self-validation run (`receipts/front-door-ablation.json`
  + `receipts/front-door-ablation.md`), graded by spawning Node — not simulated.
- The real-effect seams (`parseSweBenchVerified`, `makeCommandAgent`,
  `makeCommandExecutor`) with a fail-loud guard so the real path cannot be faked.
- 56 tests (`tests/front-door/ablation/`), `npm run lint` clean.

**NOT covered (needs external compute):**

- No real SWE-bench Verified instances were run. No external agent, no model, no
  Docker images were invoked. The self-validation numbers are **machinery proof
  on a toy corpus**, not evidence about real front doors, and the receipt says so.

## Module map

```
cli/front-door/ablation/
  pin.mjs        pinned run spec + hash + andon (PIN_PER_STEP, EXTERNAL_VERIFIER)
  arms.mjs       A/B/C workspace construction; docs-strip; front-door overlay
  grade.mjs      the execution oracle: passing-ids + spec -> resolved verdict
  execute.mjs    materialize + run tests + parse PASS/FAIL (node / command executors)
  agent.mjs      lookup reference agent (self-validation) + command agent (real path)
  corpus.mjs     synthetic micro-benchmark + SWE-bench Verified parser
  stats.mjs      probit, normalCdf, Wilson, McNemar, power, seeded bootstrap
  runner.mjs     orchestrate instance x arm -> graded receipt
  index.mjs      CLI: `front-door ablation run`
```
