# Ship Feature

## Sequence
1. **Orchestrator** receives the task and decomposes it.
2. **Product Strategist** clarifies scope and success criteria.
3. **UI Designer** shapes the interaction (if UI work is involved).
4. **Backend Engineer** executes backend work (if needed).
5. **Frontend Developer** implements user-facing behavior.
6. **Test Engineer** verifies the result.
7. **Critic Reviewer** accepts or rejects.
8. **Launch Copywriter** writes release language (after acceptance).

## Skip Rules
- Skip UI Designer if the task is backend-only.
- Skip Backend Engineer if no server changes are needed.
- Skip Launch Copywriter if no external communication is required.

## Handoff Format
Each step produces a handoff per `schemas/handoff.md` before the next role begins.

## Done
The workflow is done when the Critic Reviewer issues an `accept` verdict and all downstream artifacts are complete.
