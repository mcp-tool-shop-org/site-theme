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
- [x] **6** Gherkin channel — flags skipped/@wip scenarios (opt-in; fires only when .feature files exist)
- [x] **7** Generator — `front-door init`: minimal verify-clean spine + AGENTS.md + llms.txt (docs-site only), overwrite-guarded
- [x] **8** Standard docs page (docs/front-door.md) wired into the docs index
- [x] **9** Proof eval — verifier self-eval (labeled corpus, 7/7, `front-door eval` receipt) + full SWE-bench ablation protocol (EVAL.md)
- [x] **10** v2.0.0 release **prep** — README pillar, keywords, CHANGELOG, dogfood AGENTS.md, self-verify script. Deferred (post-publish): the actual `npm publish` / `gh release` (await go), translations, shipcheck integration (downstream repo), MCP surface (v2.1).

### v2.1 line (front-of-house, continued)

- [x] **9-runner** Ablation runner — executable three-arm (A repo-as-is / B repo+front-door / C docs-stripped+front-door) docs-on/off harness for the EVAL.md protocol: `front-door ablation` (`--instances` / `--seed`), pinned arms, synthetic corpus, execution grader, bootstrap stats, receipt. See ABLATION.md.
- [x] **11** Doctest execution — `front-door verify --run-doctests` (`verify({ root, runDoctests })`) compiles/runs fenced JS examples rustdoc-style: builtins+self examples are RUN; third-party/relative-import or `no_run` examples are COMPILE-checked (`node --check`, no install); `+SKIP` / `ignore` → UNBACKED. Opt-in, read-only-by-default, no network/install, per-example timeout.
- [x] **12** MCP surface — `front-door mcp`: hand-rolled **zero-dependency** stdio JSON-RPC server exposing `front_door_verify` (structured scorecard) + `front_door_standard`; exported at `@mcptoolshop/site-theme/front-door/mcp`. No MCP SDK / `zod` — the core stays dependency-light.

## Standards compliance (memory/workflow_standards.md)

Scored 0-3 (0 missing · 1 partial · 2 present · 3 exemplary).

- **PIN_PER_STEP — 2.** Checks are deterministic and dependency-free; the same
  inputs produce the same scorecard (finding ids are content-derived).
- **ANDON_AUTHORITY — 2.** The gate halts the pipeline (CLI exit 1) on any
  contradicted/unbacked/stale finding; bad front doors don't pass silently.
- **NAMED_COMPENSATORS — n/a for `verify` (read-only).** Mandatory for the
  generator (slice 7) and the release (slice 10). The opt-in doctest executor
  (slice 11) writes only temp compile files under the OS temp dir, removed in a
  `finally`; the MCP server (slice 12) is a read-only surface. Table below.
- **DECOMPOSE_BY_SECRETS — 3.** One module per evidence channel; the verify core
  is astro-free so it changes for verification reasons, not theme reasons.
- **UNCERTAINTY_GATED_HUMANS — 2.** Claims the tool cannot check are surfaced as
  UNVERIFIABLE rather than asserted; the human decides.
- **EXTERNAL_VERIFIER — 3.** Evidence is external to the prose (filesystem,
  package.json). The doctest channel now EXECUTES examples out-of-process
  (slice 11) and the ablation runner is execution-graded (slice 9-runner); the
  MCP server (slice 12) is an out-of-process surface — an agent's claims about
  its own front door are checked by a different process, never by the agent. No
  model grades its own output; the proof eval uses execution + a cross-family
  judge.

### Compensators (irreversible actions — NO skip allowed)

| Action | Slice | Compensator | Post-rollback state | Owner |
| --- | --- | --- | --- | --- |
| `front-door init` writes files | 7 | guard: refuse if target exists (mirror `init`); `git checkout -- <paths>` | files unwritten | front-door |
| `verify --run-doctests` temp compile files | 11 | `unlinkSync` in `finally` (OS temp dir only; never the repo) | no temp files left; repo untouched | front-door |
| `front-door mcp` server process | 12 | read-only surface; exits on SIGINT/SIGTERM/stdin-end | no state to roll back | front-door |
| `npm publish` (v2.0.0) | 10 | `npm deprecate` + ship patch; cannot unpublish after 72h | adopters warned | release |
| `gh release create` | 10 | `gh release delete` + delete tag | release withdrawn | release |
