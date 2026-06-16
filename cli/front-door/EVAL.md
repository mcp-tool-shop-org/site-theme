# front-door — evaluation

Two levels of proof. The first ships now; the second is a protocol for when an
external agent harness is wired up.

## 1. Verifier self-eval (implemented)

`site-theme front-door eval` runs the verifier against a labeled corpus of
synthetic front doors (in `eval.mjs`): clean ones must pass the gate, and each
planted-defect one must be caught on the expected channel. It reports accuracy
and can emit a receipt:

```bash
site-theme front-door eval --out receipts/front-door-eval.json
```

This proves the **verifier** behaves correctly. It does not, by itself, prove
that a good front door helps an agent — that is the experiment below.

## 2. Does the front door help an agent? (harness — implemented)

The honest test is a **docs-on / docs-off ablation** on an execution-graded
agent benchmark, not a model's self-judgment. The harness for it is now built
and runnable — see [ABLATION.md](./ABLATION.md) for the module map, the
real-run contract, and the standards-compliance + compensators sections.

```bash
# Synthetic self-validation (runs anywhere, zero deps): proves the harness
# (arm construction, execution grading, cost accounting, paired stats) end to
# end. NOT a measurement of the real front-door effect.
site-theme front-door ablation run --out receipts/front-door-ablation.json
```

The latest self-validation receipt + writeup live in `receipts/`
(`front-door-ablation.json`, `front-door-ablation.md`). The real-effect run on
SWE-bench Verified needs an external agent + per-instance containers + a model;
the CLI prints that contract and exits rather than faking it.

The design below is what the harness implements.

**Design (three arms; the agent, model, tool schema, and prompts are pinned —
only the front door varies):**

1. **A — repo as-is** (baseline).
2. **B — repo + front-door** (the real-world delta).
3. **C — docs-stripped repo + front-door** (isolates the front door's marginal
   contribution, since context that duplicates existing docs is overhead).

**Harness:** SWE-bench Verified (Jimenez et al., arXiv:2310.06770); success is
decided by hidden **fail-to-pass** tests plus **pass-to-pass** regression guards
— code execution, never an LLM grade. Hold the agent/ACI fixed across arms, since
scaffolding alone is a first-order driver of measured success (SWE-agent,
arXiv:2405.15793).

**Metrics:** resolution rate (primary) **and** cost (tokens, steps) — a front
door that raises success but balloons cost is a mixed result. Power the run to
detect a small (~2-4pp) effect, since the AGENTS.md ablation found context can
even *lower* success and add 20-23% cost (Gloaguen et al., arXiv:2602.11988).

**Judging:** the grader is the test oracle. Any unavoidable qualitative call uses
a **different model family** with the generator's reasoning hidden — models
cannot reliably verify their own output (Huang et al., arXiv:2310.01798;
Kambhampati et al., arXiv:2402.01817).

Pair the execution harness with a comprehension probe (RepoQA-style) so the front
door is credited for understanding gains, not just for shortening search.
