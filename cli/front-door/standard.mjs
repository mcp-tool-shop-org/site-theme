/**
 * front-door — the AI-native front-door standard (the spine).
 *
 * This is the canonical shape the verifier scores against and the generator
 * (later slice) emits. Ordered for a cold human OR agent reader: identity,
 * boundaries, proof, routing, contract, trust.
 *
 * Grounded in the mid-2026 AI-native README research:
 * - AGENTS.md is an Agentic AI Foundation (Linux Foundation) standard, free-form.
 * - llms.txt is a docs-SITE file, only generated when a hosted docs site exists.
 * - Context must be minimal — duplicated/bloated context lowers agent task
 *   success (Gloaguen et al., arXiv:2602.11988, 2026).
 * - Public claims must map to a test, fixture, or receipt (the moat).
 */

export const SPINE = `# {{name}}

> One-sentence product thesis.
> This is for X. It is not for Y. The fastest proof is \`<verify command>\`.

## Use this when
- You need ...
- You want an agent to ...

## Do not use this when
- You expect ...
- You need ...

## Quick proof
\`\`\`bash
<install>
<verify>   # expected: PASS — receipt at ./receipts/latest.json
\`\`\`

## Core surfaces
| Surface | Entry point | Purpose |
| --- | --- | --- |
| CLI | \`<cmd>\` | operator control |
| SDK | \`import { ... } from '<pkg>'\` | programmatic use |
| MCP | \`docs/mcp.md\` | agent tools / resources / prompts |
| Agent guide | \`AGENTS.md\` | coding-agent operating contract |

## Architecture map
<one line per load-bearing directory>

## Verification
<the commands that must pass before claiming this works>

## Invariants
- Source of truth lives in <...>.
- Public claims map to a test, fixture, or receipt.
- Generated files are not edited directly.

## Status
Version: · Stability: · Last verified: · Known gaps:
`;

export const AGENTS_SPINE = `# AGENTS.md

Minimal, repo-unique operating contract. Keep it short — duplicated or generic
context measurably lowers agent task success (Gloaguen et al., arXiv:2602.11988).

## Setup
\`\`\`bash
<install / build>
\`\`\`

## Verify
\`\`\`bash
<test / typecheck>
\`\`\`

## Conventions
- <a repo-unique rule the agent cannot infer from config>

## Boundaries
- Do not rewrite public interfaces without updating tests, docs, and receipts.
- Do not claim support for workflows not exercised by tests or examples.
`;

export function renderStandard() {
  return [
    'front-door — the AI-native front-door spine',
    '',
    'A front door must: prove the product, route the reader, constrain the agent,',
    'and link to executable truth. Keep it minimal; every claim maps to a receipt.',
    '',
    '== README.md spine ==',
    SPINE,
    '== AGENTS.md spine ==',
    AGENTS_SPINE,
  ].join('\n');
}
