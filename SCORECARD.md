# Scorecard

**Repo:** site-theme
**Date:** 2026-09-05
**Type tags:** `[npm]` `[cli]` `[mcp]`
**Version:** 2.2.0

## Assessment

| Category | Score | Notes |
|----------|-------|-------|
| A. Security | 10/10 | SECURITY.md covers theme + front-door MCP; threat model in README; no telemetry; doctest execution opt-in |
| B. Error Handling | 10/10 | CLI exit codes; MCP tool errors return `isError` + message, not a stack |
| C. Operator Docs | 10/10 | README, CHANGELOG, LICENSE, handbook, MCP tools documented |
| D. Shipping Hygiene | 10/10 | `npm run verify`; engines; lockfile; pack includes lib/ + CHANGELOG; CI audit |
| E. Identity (soft) | 10/10 | Preview image, 8-language README nav, live landing page, GitHub metadata |
| **Overall** | **50/50** | |

> Scorecard numbers match `npx @mcptoolshop/shipcheck audit` (2026-09-05): 24 checked, 0 unchecked, 12 skipped, 100% pass rate.
