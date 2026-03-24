# Fix Bug

## Sequence
1. **Orchestrator** routes the bug report.
2. **Product Strategist** clarifies expected correct behavior (only if needed).
3. **Backend Engineer** or **Frontend Developer** fixes the issue (routed by domain).
4. **Test Engineer** adds regression defense.
5. **Critic Reviewer** verifies the fix resolves the reported issue.

## Skip Rules
- Skip Product Strategist if the correct behavior is already obvious.
- Only one of Backend/Frontend is typically needed per bug.

## Handoff Format
Each step produces a handoff per `schemas/handoff.md`.

## Done
The workflow is done when the Critic Reviewer confirms the fix matches the reported problem and regression tests exist.
