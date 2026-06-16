# front-door — design & slice plan

`front-door` is site-theme's **agent/machine front-of-house layer**: it verifies
that a repo's AI-native front door (README, AGENTS.md, llms.txt) tells the truth.
site-theme already owns the *human-rendered* front door (landing page, docs,
handbook); front-door is its verified, machine-readable half.

It is **verify-first, generate-minimal** — because the evidence says generating
rich agent context *backfires* (Gloaguen et al., arXiv:2602.11988, 2026: LLM-
generated context files lower task success and raise cost 20-23%). The product
does not produce more prose; it proves the prose is true and minimal, and
generates the *evidence layer* (receipts, candidate doctests), not the prose.

## Why this is defensible (prior art, mid-2026)

- **README Clew** (Cordero, 2025) verifies README claims against *code* (deps,
  commands, env vars, file refs) with a 4-bucket model — README-only, JS/TS-only,
  code-receipts not tests. We adopt and credit its bucket model.
- **agents-lint / AgentLint / cclint** lint AGENTS.md *structure/format* only;
  they do not verify claims against code or tests.
- **llms.txt** tooling validates spec/links only, never claim truth.

The gap (no tool found in a thorough search): treat README + AGENTS.md + llms.txt
as **one verified bundle**, and map public claims to **tests/receipts**, not just
code presence.

## Architecture (astro-free, zero-dependency `.mjs`)

```
cli/front-door/
  model.mjs        severity ladder (risk-ordered), channels, 4 buckets, finding()
  extract.mjs      markdown -> code blocks, inline-code paths, commands, links, badges
  references.mjs   channel: dead paths/scripts/links, duplication, status-badge distrust
  scorecard.mjs    aggregate -> risk-ordered counts + pass/fail gate
  report.mjs       render human (ANSI) + JSON
  standard.mjs     the front-door spine (README + AGENTS.md) — printed + (later) generated
  index.mjs        verify()/main(): load -> route -> score; CLI entry; programmatic API
```

`verify({ root })` is the programmatic API; **shipcheck consumes it** for its
AI-native gate. The verifier stays astro-free so consumers that only want the
check don't pull in Astro (DECOMPOSE_BY_SECRETS: one repo, separated modules).

## Slice plan (full v1.0, shipped in commit slices)

- [x] **0** Foundation — model, CLI dispatch wiring, programmatic export
- [x] **1** Extract + classify + risk-ordered 4-bucket scorecard + reporter
- [x] **2** References channel — dead path/script/link + duplication + badge distrust
- [x] **3** Minimality linter — length budget, FRE readability, directive breadth
- [x] **4** Doctest channel — example self-imports must resolve to real package exports (execution-based run is a later refinement)
- [x] **5** Attestation channel — provenance/signing claims must map to real attestation evidence (SLSA/in-toto/Sigstore/--provenance)
- [ ] **6** Gherkin / behavioral-claim linkage
- [ ] **7** Generator — minimal spine scaffold + llms.txt + candidate doctests, wired to the `tool` template
- [ ] **8** The front-door standard doc (handbook page)
- [ ] **9** Proof eval — three-arm SWE-bench ablation + published receipt
- [ ] **10** shipcheck integration + MCP surface + v2.0.0 release

## Standards compliance (memory/workflow_standards.md)

Scored 0-3 (0 missing · 1 partial · 2 present · 3 exemplary).

- **PIN_PER_STEP — 2.** Checks are deterministic and dependency-free; the same
  inputs produce the same scorecard (finding ids are content-derived).
- **ANDON_AUTHORITY — 2.** The gate halts the pipeline (CLI exit 1) on any
  contradicted/unbacked/stale finding; bad front doors don't pass silently.
- **NAMED_COMPENSATORS — n/a for `verify` (read-only).** Mandatory for the
  generator (slice 7) and the release (slice 10). Table below.
- **DECOMPOSE_BY_SECRETS — 3.** One module per evidence channel; the verify core
  is astro-free so it changes for verification reasons, not theme reasons.
- **UNCERTAINTY_GATED_HUMANS — 2.** Claims the tool cannot check are surfaced as
  UNVERIFIABLE rather than asserted; the human decides.
- **EXTERNAL_VERIFIER — 2.** Evidence is external to the prose (filesystem,
  package.json, executed tests in slice 4). No model grades its own output; the
  proof eval (slice 9) uses execution tests + a cross-family judge.

### Compensators (irreversible actions — NO skip allowed)

| Action | Slice | Compensator | Post-rollback state | Owner |
| --- | --- | --- | --- | --- |
| `front-door init` writes files | 7 | guard: refuse if target exists (mirror `init`); `git checkout -- <paths>` | files unwritten | front-door |
| `npm publish` (v2.0.0) | 10 | `npm deprecate` + ship patch; cannot unpublish after 72h | adopters warned | release |
| `gh release create` | 10 | `gh release delete` + delete tag | release withdrawn | release |
