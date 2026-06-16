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

# Scaffold a minimal, verify-clean front door
site-theme front-door init

# Print the front-door spine (README + AGENTS.md)
site-theme front-door standard
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
| **doctest** | code examples that import from this package only import real `exports` entry points |
| **attestation** | provenance/signing claims (SLSA, Sigstore, "signed") map to a real attestation step |
| **gherkin** | `.feature` files have no skipped/`@wip` scenarios (opt-in) |

## The gate

`verify` exits non-zero when any **contradicted**, **unbacked**, or **stale**
finding is present — the front door is making a claim the repo does not back.
Bloat, hygiene, and style findings are reported as warnings.

## Links

- [Back to site-theme](index.md)
- [GitHub Repository](https://github.com/mcp-tool-shop-org/site-theme)
