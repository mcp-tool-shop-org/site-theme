---
title: Design Tokens
description: Full design token reference for @mcptoolshop/site-theme with customization instructions.
sidebar:
  order: 4
---

The theme uses semantic CSS custom properties (design tokens) instead of hardcoded colors. Components reference these tokens, so you can reskin the entire theme by overriding a few values.

## Token reference

| Token                    | Default   | Used for                          |
|--------------------------|-----------|-----------------------------------|
| `--color-surface`        | `#09090b` | Page background                   |
| `--color-surface-raised` | `#18181b` | Elevated elements, code blocks    |
| `--color-surface-strong` | `#27272a` | Badges, emphasized backgrounds    |
| `--color-edge`           | `#27272a` | Primary borders                   |
| `--color-edge-subtle`    | `#18181b` | Card and table borders            |
| `--color-heading`        | `#fafafa` | Headings, primary text            |
| `--color-body`           | `#e4e4e7` | Body and secondary text           |
| `--color-muted`          | `#d4d4d8` | Muted text                        |
| `--color-dim`            | `#a1a1aa` | Labels, descriptions              |
| `--color-accent`         | `#34d399` | Status indicators                 |
| `--color-action`         | `#fafafa` | Primary button background         |
| `--color-action-text`    | `#09090b` | Primary button text               |
| `--color-action-hover`   | `#e4e4e7` | Primary button hover              |

## Customizing tokens

Override any token in your site's `global.css` by adding a `@theme` block after the imports:

```css
@import "tailwindcss";
@import "@mcptoolshop/site-theme/styles/theme.css";
@source "../../node_modules/@mcptoolshop/site-theme";

/* Override tokens */
@theme {
  --color-accent: #60a5fa;          /* blue status dot   */
  --color-surface: #0a0a1a;         /* navy background   */
  --color-action: #60a5fa;          /* blue buttons      */
  --color-action-hover: #3b82f6;
}
```

## How tokens become utilities

Tokens are defined inside a `@theme` block in the theme stylesheet. Tailwind CSS v4 automatically generates utilities from them:

- `--color-surface` becomes `bg-surface`, `text-surface`, `border-surface`
- `--color-heading` becomes `text-heading`
- `--color-edge` becomes `border-edge`

You can use these utilities in your own components alongside the theme components.

## Color palette at a glance

The default palette is built on Zinc grays with an emerald accent:

- **Backgrounds:** Near-black (`#09090b`) through dark gray (`#27272a`)
- **Text:** White (`#fafafa`) through medium gray (`#a1a1aa`)
- **Accent:** Emerald (`#34d399`) for status indicators and highlights
- **Actions:** White buttons with black text for maximum contrast

## Tips

- Override only the tokens you need. The rest keep their defaults.
- The `@source` directive tells Tailwind to scan the theme's component files. Without it, theme utilities will not be generated.
- All components use token-based classes, so a single `@theme` override affects every component consistently.
