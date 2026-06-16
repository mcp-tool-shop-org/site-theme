---
title: site-theme Visual OS — Claude Design Prompt
status: ready-to-run
created: 2026-05-04
---

Design a polished product page and product UI concept for @mcptoolshop/site-theme.

Core thesis:
site-theme is a config-driven Astro toolkit that turns one repo config into a coherent project website. It is not a generic template pack. It is the visual operating system for MCP Tool Shop project pages.

Primary headline:
One config. Five project surfaces.

Product promise:
A repo can scaffold a landing page, docs site, product marketing page, portfolio/catalog page, or app shell from one CLI command, then customize identity through semantic tokens and deploy cleanly to GitHub Pages.

Required design sections:

1. Hero
- Headline: "One config. Five project surfaces."
- Subheadline: "Config-driven Astro sites for tools, docs, products, portfolios, and app shells."
- Show five small surface previews generated from the same config.
- Make the product feel developer-native, precise, and useful.

2. Template Gallery
Create five differentiated template cards:
- Default / Landing
- Docs
- Product
- Portfolio
- App

Each card should include:
- Best use case
- Page structure
- Scaffold command
- Small visual preview
- What makes it different from the others

This section should resolve template confusion by making the full five-template model obvious.

3. Config → Preview
Show a split panel:
- Left: site.config.ts
- Right: rendered page preview

The viewer should immediately understand that the site is driven by one config file. This is the soul of the product.

4. Token Studio
Show semantic design tokens, not generic color swatches.

Include tokens like:
- surface
- raised
- edge
- heading
- body
- accent
- action
- muted
- code
- success

Make this feel like a design system for developers.

5. Deploy Strip
Show the value chain:
scaffold → edit config → push → live

Represent GitHub Pages deployment as a clean, confident final step.

6. Org Rollout
Show several MCP Tool Shop repos using the same system while keeping unique project identity.

The message:
One shared visual language. Many distinct tools.

Visual style:
- Dark developer-tool aesthetic
- Astro/Tailwind feel
- Sharp typography
- Code preview cards
- Subtle green accent
- Clean layout
- High contrast
- No mascot
- No generic SaaS stock visuals
- No decorative gradients unless they clarify structure
- No fake analytics dashboard
- No pricing emphasis

Design quality target:
This should look like a real product surface that could become the site-theme homepage, not a concept poster.

Deliverable:
Create a high-fidelity mockup for the main product page, with enough structure that it can be implemented as an Astro page.

Acceptance check (cold reader, under 10 seconds):
1. site-theme generates different project surfaces from one config.
2. There are five distinct templates, not four.
3. The product is a reusable org/site system, not a one-off theme.
