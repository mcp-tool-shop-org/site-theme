# site-theme Visual OS Design Pass

This design pass proves the product thesis:

> One config. Five project surfaces.

## Acceptance checks

- A cold reader understands that site-theme is config-driven.
- The five-template model is obvious: default, docs, product, portfolio, app.
- The config-to-preview panel is visually central.
- Semantic tokens are presented as developer-facing design infrastructure.
- Deployment flow is clear: scaffold → edit config → push → live.
- Org rollout shows shared system, distinct repo identities.

## Implementation sequence

**1. Land the design artifact unchanged**

Do not immediately refactor it into Astro. Preserve the full Claude Design output as reference truth.

**2. Extract the visual language**

- Typography scale
- Card structure
- Dark palette
- Accent behavior
- Token grouping
- Template preview grammar

**3. Build the real Astro page**

Likely as the new homepage or `/showcase`. Keep the config-preview interaction. Keep the five template cards. Keep the deploy strip. Cut only if it weakens implementation, not if it merely takes effort.

**4. Align repo/docs/org copy**

- README: "One config. Five project surfaces."
- Org website card: mention five templates
- Package metadata: config-driven Astro project-site toolkit
- Changelog: design direction / visual OS pass

## What to protect

The Config → Preview panel is the core. Everything else can evolve, but that interaction is the product's proof. Without it, site-theme risks reading like a template gallery. With it, the product reads like a developer-native site system.
