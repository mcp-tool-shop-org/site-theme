# @mcptoolshop/site-theme

Shared Astro theme for MCP Tool Shop org repo landing pages. Dark palette, Tailwind CSS v4, config-driven content, fully customizable via design tokens.

## Quick Start

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

## Key Features

- **Config-Driven** — All page content lives in a single `site-config.ts` file
- **Design Tokens** — Semantic CSS custom properties for full reskinning
- **Tailwind v4** — Built on Tailwind CSS v4 with automatic utility generation
- **7 Components** — BaseLayout, Hero, Section, FeatureGrid, DataTable, CodeCardGrid, ApiList
- **CLI Scaffold** — `npx @mcptoolshop/site-theme init` creates a ready-to-deploy site
- **Front Door Verifier** — `site-theme front-door verify` audits README / AGENTS.md / llms.txt for claims the repo doesn't back

## Front Door

site-theme renders the *human* front door; the **front-door** verifier proves
the *agent/machine* front door is true and minimal:

```bash
site-theme front-door verify   # audit README / AGENTS.md / llms.txt
site-theme front-door init     # scaffold a minimal, verify-clean front door
```

See the [Front Door reference](front-door.md) for the channels, the standard
spine, and the exit gate.

## Links

- [Front Door Verifier](front-door.md)
- [GitHub Repository](https://github.com/mcp-tool-shop-org/site-theme)
- [npm Package](https://www.npmjs.com/package/@mcptoolshop/site-theme)
- [MCP Tool Shop](https://github.com/mcp-tool-shop-org)
