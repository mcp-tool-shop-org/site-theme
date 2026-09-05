# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.x     | Yes       |
| 1.x     | Security fixes only |
| < 1.0   | No        |

## Reporting a Vulnerability

Email: **64996768+mcp-tool-shop@users.noreply.github.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Version affected
- Potential impact

### Response timeline

| Action | Target |
|--------|--------|
| Acknowledge report | 48 hours |
| Assess severity | 7 days |
| Release fix | 30 days |

## Scope

This package is an **Astro theme** plus a **front-door verifier** (CLI + optional stdio MCP server).

- **Data touched:** project source files at build time (theme) and on disk at verify time (README, AGENTS.md, llms.txt, CLAUDE.md, package manifests). The MCP server speaks JSON-RPC over stdio only.
- **Data NOT touched:** no user accounts, no runtime site state, no analytics, no third-party APIs.
- **Network egress:** off by default. `front-door verify` is local filesystem. `--run-doctests` / MCP `runDoctests: true` execute fenced JS examples in child processes and are opt-in; they do not install packages or open a network by default.
- **No secrets handling** — does not read, store, or transmit credentials.
- **No telemetry** is collected or sent.
