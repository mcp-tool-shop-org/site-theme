# Example: Feature Packet

**Problem shape:** Building a new user-facing capability that needs product shaping, design, implementation, testing, and review.

**When to use this shape:** The feature touches product intent (what to show, what to defer), has a UI or output surface, needs implementation across 1+ files, and benefits from a quality gate before merge.

---

## What a feature packet teaches

### 1. Product shaping under pressure
The Product Strategist decides what information is primary vs noise, rules on open questions, and sets the information hierarchy. This prevents downstream roles from re-arguing product decisions.

**Key pattern:** Product defines a clear "this is a status surface, not a command surface" ruling. That single frame prevents every other role from inventing a different purpose.

### 2. Contamination/fidelity guard
If the project has a fork ancestor, legacy codebase, or inherited design language, the packet must include a contamination constraint. Every role checks for residue. The critic rejects work that is functional but fiction-wrong.

**Key pattern:** Name the exact files, imports, and terms that are contaminated. "No legacy language" is vague. "Never import from legacy_models.py; never use old_display()" is testable.

### 3. Real escalation
Backend surfaced a missing engine field instead of faking it. Frontend surfaced a session wiring gap instead of hiding it behind a fallback. Both were legitimate escalations that improved the final output.

**Key pattern:** Escalation happens at the role that discovers the gap, not at review. The escalation includes what's missing, why it matters, and a proposed shim or scope reduction.

### 4. Review against contract
The critic judged against the done definition, not against "does it look good." Items were marked MET, UNMET, or CONDITIONAL with evidence. The verdict was accept-with-notes — honest about what worked and what remained external.

**Key pattern:** The critic checks each done-definition item individually. A clean accept requires all items met. Accept-with-notes requires binding follow-up items. Reject requires corrections before re-review.

---

## Typical chain
Orchestrator → Product Strategist → UI Designer → Backend Engineer → Frontend Developer → Test Engineer → Critic Reviewer

## When to shorten
- Skip UI Designer if there's no user-facing surface to design
- Skip Backend if all data already exists
- Skip Product Strategist if scope is already locked by a prior packet
