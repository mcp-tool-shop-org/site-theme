# Role OS Starter Pack

A repo-native operating layer that routes work through role contracts, structured handoffs, review, and escalation — preventing drift, false completion, and cross-project contamination.

## What's in the pack

```
starter-pack/
  handbook.md              ← Start here. How Role OS works.
  context/                 ← Fill these for your repo.
    product-brief.md         Product truth
    repo-map.md              Technical truth
    current-priorities.md    What's happening now
    brand-rules.md           Identity law
  examples/                ← Learn from real trials.
    feature-packet.md        Building a new capability
    integration-packet.md    Wiring systems together
    identity-packet.md       Repairing inherited drift
  agents/                  ← Role contracts. The spine.
    core/
      orchestrator.md        Decomposes and routes work
      product-strategist.md  Shapes scope and intent
      critic-reviewer.md     Accepts or rejects against contract
    engineering/
      frontend-developer.md  Implements user-facing surfaces
      backend-engineer.md    Implements server/data/contracts
      test-engineer.md       Verifies and defends against regression
    design/
      ui-designer.md         Designs hierarchy and interaction
    marketing/
      launch-copywriter.md   Writes truthful launch messaging
  schemas/                 ← Packet and handoff formats.
    task-packet.md           What work needs doing
    handoff.md               What one role passes to the next
    review-verdict.md        Accept, reject, or block
  policy/                  ← System law.
    routing-rules.md         Which role handles what
    tool-permissions.md      What each role may and must not do
    escalation-rules.md      When to escalate instead of guess
    done-definition.md       What "done" actually means
  workflows/               ← Predefined role sequences.
    ship-feature.md          Feature from shaping to review
    fix-bug.md               Bug from report to regression defense
    launch-update.md         Copy from shipped truth to messaging
```

## Quick start

1. Copy this pack into your repo's `.claude/` directory
2. Read `handbook.md` (under 400 words)
3. Fill the four `context/` files for your project
4. Create your first packet using `schemas/task-packet.md`
5. Route it through the smallest chain that covers the work
6. Review and record the verdict

## Evidence

Role OS was proven across three trial shapes:

- **Feature work** (Crew Screen) — prevented contamination, inline invention, and hidden blockers across a 7-role chain
- **Integration work** (CampaignState wiring) — resolved an architectural seam without fallback lies or hybrid-state ambiguity
- **Identity work** (contamination purge) — repaired inherited fiction drift without collapsing into broad redesign

Portability was proven by adopting the same spine in a structurally different repo (MCP server vs Python game) with context changes only — no core contract modifications.

## Core properties

These are the properties Role OS protects. If a change would weaken any of them, reject it.

- **Role boundaries hold** — roles do not collapse into each other
- **Review has teeth** — the critic rejects work that is vague, contaminated, or incomplete
- **Escalation stays honest** — roles surface gaps instead of hiding them
- **Packets stay testable** — done definitions are concrete, not aspirational
- **Portability requires context, not surgery** — new repos adapt context files, not the spine
