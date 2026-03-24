# Example: Identity Packet

**Problem shape:** Repairing inherited or drifted fiction, branding, terminology, or visual language across existing code — without turning into a broad redesign.

**When to use this shape:** The product's visible surfaces don't match its actual identity. A fork ancestor's language is still present. Terminology from a different domain leaked in. Visual motifs belong to a different product.

---

## What an identity packet teaches

### 1. Replacement doctrine, not just removal
Removing contaminated terms without defining replacements creates bland output. Product Strategist must define what the correct register is — not just what's banned, but what replaces it and why.

**Key pattern:** Build a replacement table with contaminated term, replacement, and rationale. "No legacy language" becomes "specific replacement per term, not blanket removal." Every banned term has a specific replacement.

### 2. No redesign drift
The strongest discipline in an identity packet is doing only the purge. Roles will be tempted to "improve" layout, hierarchy, or features while they're in the file. Reject that.

**Key pattern:** The done definition includes "no unrelated redesign was performed." The critic checks this explicitly. A screen that was purged AND redesigned gets sent back.

### 3. Severity ranking
Not all contamination is equally damaging. Product Strategist ranks contamination by visibility and impact. Hero visuals (splash screens, headers) are more damaging than internal code comments.

**Key pattern:** Priority order guides Frontend's implementation sequence. If time is constrained, the most visible contamination is fixed first.

### 4. Durable contamination defense
Cleaning files is necessary but insufficient. Without regression tests, the contamination returns. The test engineer's job is to produce tests that outlive the packet — permanent CI checks, not one-time audits.

**Key pattern:** Banned-term scans, banned-symbol scans, required-replacement assertions, and import-source checks. These tests run on every CI pass and fail if contamination is reintroduced by any contributor.

---

## Typical chain
Orchestrator → Product Strategist → UI Designer → Frontend Developer → Test Engineer → Critic Reviewer

## When to shorten
- Skip UI Designer if the contamination is purely textual (labels, terms) with obvious replacements
- Skip Backend if no contamination is in data-generating code
- Add Backend if contaminated strings are generated from data models rather than hardcoded in views
