---
title: site-theme Visual OS — Design Brief
status: approved
created: 2026-05-04
---

# site-theme Visual OS

## Product Thesis

site-theme is the **visual operating system for MCP Tool Shop project pages**.

It is not a generic template pack. It is a config-driven Astro toolkit that turns one repo config into a coherent project website. A repo can scaffold a landing page, docs site, product marketing page, portfolio/catalog page, or app shell from one CLI command — with semantic design tokens and GitHub Pages deployment already wired.

**Primary headline:** One config. Five project surfaces.

---

## The Drift This Design Fixes

The live landing page says four templates. The README says five. The fifth (portfolio) was added but never made visible. This design makes the full five-template model obvious, differentiated, and worth choosing.

**Templates:**
1. Default / Landing
2. Docs
3. Product
4. Portfolio
5. App

---

## Required Sections

### 1. Hero
- Headline: "One config. Five project surfaces."
- Subheadline: "Config-driven Astro sites for tools, docs, products, portfolios, and app shells."
- Five small surface previews generated from the same config.
- Developer-native, precise, useful tone.

### 2. Template Gallery
Five differentiated template cards, each showing:
- Best use case
- Page structure
- Scaffold command
- Small visual preview
- What makes it distinct from the others

### 3. Config → Preview Panel
Split panel:
- Left: `site.config.ts`
- Right: rendered page preview
- The soul of the product: one file drives the site.

### 4. Token Studio
Semantic design tokens, not generic color swatches.

Tokens: `surface`, `raised`, `edge`, `heading`, `body`, `accent`, `action`, `muted`, `code`, `success`

Framing: a design system for developers.

### 5. Deploy Strip
Value chain: `scaffold → edit config → push → live`

GitHub Pages deployment as a clean, confident final step.

### 6. Org Rollout
Multiple MCP Tool Shop repos using the same system, each with unique project identity.

Message: **One shared visual language. Many distinct tools.**

---

## Visual Style

- Dark developer-tool aesthetic
- Astro/Tailwind feel
- Sharp typography, high contrast
- Code preview cards
- Subtle green accent
- No mascot, no stock visuals, no decorative gradients
- No fake analytics dashboard, no pricing emphasis
- Quality target: could become the real site-theme homepage

---

## Acceptance Criteria

A cold reader must understand these three things in under 10 seconds:

1. site-theme generates different project surfaces from one config.
2. There are five distinct templates, not four.
3. The product is a reusable org/site system, not a one-off theme.
