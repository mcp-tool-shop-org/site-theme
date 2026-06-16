# front-door three-arm ablation — run writeup

**Receipt:** [`front-door-ablation.json`](./front-door-ablation.json)
**Date:** 2026-06-16 · **Pin:** `63a3092cccbe2a68` (deterministic lookup agent — no model invoked) · **Grading:** execution (fail-to-pass + pass-to-pass), no model grade

> ⚠ **This is a harness self-validation, not a measurement of the real front-door effect.**
> It ran a *synthetic* execution-graded micro-benchmark (n=60) through a
> *deterministic toy agent*. It proves the machinery — arm construction, real
> test-execution grading, cost accounting, paired statistics, receipt emission —
> end to end. It does **not** prove a real front door helps a real agent. The
> real-effect arms (SWE-bench Verified + an external agent + a model) were **not
> run** in this session; the wiring is shipped and documented in
> [`../cli/front-door/ABLATION.md`](../cli/front-door/ABLATION.md).

## Results (synthetic, n=60)

| Arm | Resolved | Rate (95% Wilson) | Mean tokens | Total tokens |
| --- | --- | --- | --- | --- |
| **A** repo as-is | 38/60 | **63.3%** [50.7, 74.4] | 30.4 | 1825 |
| **B** repo + front-door | 53/60 | **88.3%** [77.8, 94.2] | 42.4 | 2542 |
| **C** docs-stripped + front-door | 42/60 | **70.0%** [57.5, 80.1] | 35.6 | 2137 |

| Comparison | Δ resolution | McNemar (exact two-sided) | Δ tokens / instance (mean [95% CI]) |
| --- | --- | --- | --- |
| **A → B** | **+25.0pp** | b=0, c=15, p=0.00006 | **+11.95** [10.65, 13.25] |
| **B → C** | **−18.3pp** | p=0.00098 | **−6.80** [−8.4, −5.2] |
| **A → C** | +6.7pp | p=0.557 (n.s.) | +5.20 [4.7, 5.7] |

**Power.** Discordance on A→B was 25%. At that rate, detecting a 3pp effect at
80% power would need **N ≈ 2,178** paired instances (2pp → 4,904; 4pp → 1,225).
This n=60 run's achieved power for a 3pp effect is **0.07** — i.e. grossly
underpowered, as expected for a machinery demo. A real run must be sized from its
own observed discordance (the receipt computes this).

## What the numbers illustrate (machinery, not a claim)

These are emergent outputs of the corpus + agent, not values set per arm:

- **A→B +25pp** comes entirely from the `doc-only` category (15 instances where
  the load-bearing fact lives *only* in the front door): the baseline can't find
  it; the front door supplies it. b=0, c=15 — a clean one-directional gain.
- **B costs +12 tokens/instance over A.** The agent reads the front door first,
  so even when it carries nothing new the bytes are paid for — a mechanical
  reproduction of the Gloaguen et al. "context adds cost" effect.
- **B→C −18pp** is the **strip risk**: the `doc-only-base` instances had their
  fact in the docs the front door *didn't* capture, so stripping the docs loses
  it. C is cheaper than B (−6.8 tokens) because there's less to read — a real
  cost/coverage trade, surfaced not assumed.
- **A→C is a wash** (+6.7pp, p=0.557): the front door's gains and the strip's
  losses roughly cancel. That a net effect can vanish is exactly the kind of
  mixed result EVAL.md warns about — the harness reports it honestly instead of
  cherry-picking A→B.

## Reproduce

```bash
site-theme front-door ablation run --instances 60 --seed 12345 \
  --stamped-at 2026-06-16 --out receipts/front-door-ablation.json
```

Deterministic: same flags → byte-identical receipt (minus the stamp). For the
real SWE-bench Verified run, see the contract in
[`../cli/front-door/ABLATION.md`](../cli/front-door/ABLATION.md).
