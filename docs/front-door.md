# front-door — the AI-native front-door verifier

`front-door` is site-theme's second pillar: where the theme renders a repo's
**human** front door (landing page, docs, handbook), `front-door` verifies its
**agent/machine** front door — the README, `AGENTS.md`, and `llms.txt` that
humans, agents, registries, and tooling read first.

It is **verify-first, generate-minimal**. The evidence shows that generating
rich agent context *lowers* coding-agent task success and raises cost (Gloaguen
et al., *Evaluating AGENTS.md*, arXiv:2602.11988, 2026), so front-door does not
write prose for you — it proves your prose is **true** and **minimal**, and
scaffolds only a skeleton plus the evidence layer.

## Commands

```bash
# Audit the current repo's front door (exit 1 if the gate fails)
site-theme front-door verify

# Machine-readable
site-theme front-door verify --json

# Also compile/run fenced JS examples (rustdoc-style; executes code, opt-in)
site-theme front-door verify --run-doctests

# Scaffold a minimal, verify-clean front door
site-theme front-door init

# Print the front-door spine (README + AGENTS.md)
site-theme front-door standard

# Start the MCP server (stdio) so an agent can call verify
site-theme front-door mcp
```

Programmatic use (consumed by shipcheck's AI-native gate):

```js
import { verify } from '@mcptoolshop/site-theme/front-door';

const scorecard = verify({ root: process.cwd() });
if (!scorecard.gate.pass) process.exit(1);
```

## How it works

front-door extracts the **claims** a front door makes and routes each to the
evidence channel that can back it. Findings land in a four-bucket model
(Verified / Contradicted / Missing / Unverifiable, after README Clew) and are
reported **risk-first** — what's wrong before what's merely improvable.

| Channel | What it checks |
| --- | --- |
| **references** | file/path/script/link references resolve; AGENTS.md doesn't duplicate the README; status badges are treated as untrusted claims |
| **minimality** | `AGENTS.md` / `CLAUDE.md` stay within a length/token budget, readable, and free of excessive broad mandates |
| **doctest** | code examples that import from this package only import real `exports` entry points; with `--run-doctests`, examples are also compiled/run (a `+SKIP`/`ignore` example is reported UNBACKED) |
| **attestation** | provenance/signing claims (SLSA, Sigstore, "signed") map to a real attestation step |
| **gherkin** | `.feature` files have no skipped/`@wip` scenarios (opt-in) |

## The gate

`verify` exits non-zero when any **contradicted**, **unbacked**, or **stale**
finding is present — the front door is making a claim the repo does not back.
Bloat, hygiene, and style findings are reported as warnings.

## Running examples (`--run-doctests`)

By default the doctest channel is static (it never executes code). Pass
`--run-doctests` (programmatically: `verify({ root, runDoctests: true })`) to
compile/run the fenced JS examples, rustdoc-style:

- Examples importing **only Node builtins + this package** are executed in a
  child process — a non-zero exit or timeout is **contradicted**.
- Examples that pull in **third-party / relative** modules, or are tagged
  `no_run`, are **compile-checked** (`node --check`, which never resolves
  imports, so nothing is installed).
- An example tagged `+SKIP` / `ignore` is reported **UNBACKED**, not passing —
  a skipped example backs no claim.

It is opt-in and safe: default `verify` stays read-only, nothing is installed,
each example has a per-example timeout, and temp compile files are cleaned up.

## Agent surface (MCP)

`site-theme front-door mcp` starts a hand-rolled, zero-dependency MCP server
(newline-delimited JSON-RPC over stdio) so an agent can call the verifier and
receive the structured scorecard directly:

| Tool | Returns |
| --- | --- |
| `front_door_verify` | the scorecard (findings, four-bucket counts, pass/fail gate); accepts `root` + `runDoctests` |
| `front_door_standard` | the front-door spine |

The server is also exported at `@mcptoolshop/site-theme/front-door/mcp`. The
core package stays zero-dependency — the MCP SDK is not pulled in.

## Links

- [Back to site-theme](index.md)
- [GitHub Repository](https://github.com/mcp-tool-shop-org/site-theme)
