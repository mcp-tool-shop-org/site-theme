# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |

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

This is an **Astro theme package** — static site components with no runtime server.

- **Data touched:** Astro component files, CSS tokens, site configuration at build time only
- **Data NOT touched:** No user data, no runtime state, no server-side processing
- **No network egress** — static build output only
- **No secrets handling** — does not read, store, or transmit credentials
- **No telemetry** is collected or sent
