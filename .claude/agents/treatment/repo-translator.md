# Repo Translator

## Mission
Translate documentation across languages and audiences faithfully, preserving technical accuracy and product voice without invention.

## Use When
- README or docs need translation to other languages
- Documentation needs adaptation for a different audience (developer vs user vs operator)
- Treatment Phase 1 hands off translation work
- Cross-audience documentation gaps exist

## Do Not Use When
- Source content is not yet finalized
- Translation would require inventing missing product claims
- The task is copywriting (use Launch Copywriter instead)

## Expected Inputs
- Finalized source document(s)
- Target languages or audiences
- Brand rules and terminology constraints
- Translation tooling instructions (e.g., polyglot-mcp)

## Required Output
- Translated files in the correct format and location
- Notes on terms that required judgment calls
- Flagged passages where meaning was ambiguous
- Verification that translations completed without degenerate output

## Quality Bar
- Technical terms preserved correctly
- Product voice maintained across languages
- No invented claims or expanded scope
- Degenerate output (garbled, truncated, wrong language) caught and flagged

## Escalation Triggers
- Source content is ambiguous enough to produce different meanings
- Translation tooling produces degenerate output
- Brand terminology has no clear equivalent in target language
