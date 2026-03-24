# Example: Integration Packet

**Problem shape:** Wiring two systems together across an architectural seam — making state, data, or control flow reach a place it currently can't.

**When to use this shape:** A feature is blocked because System A can't access System B's state. Or a save/load path doesn't include new state. Or a session layer doesn't expose data that a screen or tool needs.

---

## What an integration packet teaches

### 1. Dependency verification first
Before any design work, verify every upstream assumption against actual repo truth. "The session exposes this data" might be false — check the actual code, not the docs.

**Key pattern:** Build a dependency table with file paths, line numbers, and verified/unverified status. Catch false assumptions at Step 1, not Step 5.

### 2. Bridge/seam resolution
The bridge should be clean and typed — a new attribute, a serialization pair, a wiring function. Not a hybrid where the system "sometimes reads from A and sometimes from B."

**Key pattern:** Backend proposes the exact attribute name, import alias (if naming collisions exist), initialization point, and serialization format. Frontend receives a concrete contract, not a vague "data will be available."

### 3. Anti-fallback testing
The most dangerous failure mode is silent fallback — the app appears to work but quietly uses legacy/placeholder data instead of the real source. Tests must assert the live path is real, not just present.

**Key pattern:** Write tests that assert `state is not None` after initialization, assert the state type is correct (not legacy), and assert the data content matches what was stored. A test that passes when the feature is broken is worse than no test.

### 4. Breaking change management
Integration work often changes return types, tuple sizes, or function signatures. Every caller must be updated. The blast radius must be documented before implementation.

**Key pattern:** Grep for all callers of the changed function. Categorize them by update pattern. Document which are mechanical (add `_ignored` to unpacking) vs which need inspection.

---

## Typical chain
Orchestrator → Backend Engineer → Frontend Developer → Test Engineer → Critic Reviewer

## When to shorten
- Skip Frontend if the wiring is purely backend (no screen or tool changes)
- Skip Product Strategist if there are no user-visible behavior choices
- Add Product Strategist if the integration reveals ambiguity about what state should be canonical
