import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '@mcptoolshop/site-theme',
  description: 'Config-driven Astro theme for MCP Tool Shop project landing pages. Dark palette, Tailwind CSS v4, GitHub Pages ready.',
  logoBadge: 'ST',
  brandName: 'site-theme',
  repoUrl: 'https://github.com/mcp-tool-shop-org/site-theme',
  npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/site-theme',
  footerText: 'MIT Licensed',

  hero: {
    badge: 'Open source',
    headline: 'Landing pages,',
    headlineAccent: 'zero fuss.',
    description: 'One CLI command scaffolds a full Astro site with a dark theme, Tailwind CSS v4, and a GitHub Pages workflow — all wired up and ready to deploy.',
    primaryCta: { href: '#quick-start', label: 'Get started' },
    secondaryCta: { href: '#components', label: 'See components' },
    previews: [
      { label: 'Scaffold', code: 'npx @mcptoolshop/site-theme init' },
      { label: 'Edit', code: 'site/src/site-config.ts' },
      { label: 'Deploy', code: 'git push  # GitHub Actions handles the rest' },
    ],
  },

  sections: [
    {
      kind: 'features',
      id: 'features',
      title: 'What you get',
      subtitle: 'Everything a project landing page needs, pre-wired.',
      features: [
        {
          title: 'Config-driven',
          desc: 'All page content lives in site-config.ts. No JSX, no HTML — just a typed SiteConfig object.',
        },
        {
          title: 'Dark by default',
          desc: 'Semantic design tokens (bg-surface, text-heading, border-edge) ready to use. Override any token to reskin the whole theme.',
        },
        {
          title: 'GitHub Pages ready',
          desc: 'The init CLI writes .github/workflows/pages.yml automatically. Push and set the source — done.',
        },
        {
          title: 'Six composable components',
          desc: 'Hero, FeatureGrid, DataTable, CodeCardGrid, ApiList, and Section — mix and match in any order.',
        },
        {
          title: 'Zero surprise setup',
          desc: 'The CSS import, @source path, and base path are all pre-wired by the CLI. No manual config hunting.',
        },
        {
          title: 'Fully customizable',
          desc: 'Every color, radius, and spacing value is a CSS custom property. Override in @theme — no config file needed.',
        },
      ],
    },
    {
      kind: 'code-cards',
      id: 'quick-start',
      title: 'Quick start',
      subtitle: 'From zero to deployed in minutes.',
      cards: [
        {
          title: 'Scaffold',
          code: `npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev`,
        },
        {
          title: 'Edit your content',
          code: `// site/src/site-config.ts
export const config: SiteConfig = {
  title: '@mcptoolshop/my-tool',
  description: 'What my tool does.',
  logoBadge: 'MT',
  brandName: 'my-tool',
  hero: { /* ... */ },
  sections: [ /* ... */ ],
};`,
        },
        {
          title: 'Override design tokens',
          code: `/* site/src/styles/global.css */
@import "tailwindcss";
@import "@mcptoolshop/site-theme/styles/theme.css";
@source "../../node_modules/@mcptoolshop/site-theme";

@theme {
  --color-accent: #60a5fa;      /* blue accent  */
  --color-surface: #0a0a1a;     /* dark navy    */
  --color-action: #60a5fa;
}`,
        },
        {
          title: 'Deploy to GitHub Pages',
          code: `# 1. Push to GitHub
git push

# 2. Repo → Settings → Pages → Source → "GitHub Actions"
# 3. Push any change to site/ to trigger a deploy`,
        },
      ],
    },
    {
      kind: 'api',
      id: 'components',
      title: 'Components',
      subtitle: 'Import individually from the package.',
      apis: [
        {
          signature: 'BaseLayout(title, description, logoBadge, brandName, nav, repoUrl, npmUrl?, footerText)',
          description: 'Full page shell with sticky header (logo badge, nav links, GitHub/npm buttons) and footer. Wrap all your sections in this.',
        },
        {
          signature: 'Hero(badge, headline, headlineAccent, description, primaryCta, secondaryCta, previews?)',
          description: 'Gradient hero with status badge, large headline, CTA buttons, and optional code preview cards.',
        },
        {
          signature: 'Section(id, title, subtitle?)',
          description: 'Anchor section with heading and optional subtitle. Wraps any content as a slot.',
        },
        {
          signature: 'FeatureGrid(features: { title, desc }[])',
          description: '3-column responsive card grid. Each card has a bold title and a short description.',
        },
        {
          signature: 'DataTable(columns: string[], rows: string[][])',
          description: 'Grid-based bordered table. First cell in each row is styled as a header.',
        },
        {
          signature: 'CodeCardGrid(cards: { title, code }[])',
          description: '2-column grid of dark code block cards. Ideal for install/usage examples.',
        },
        {
          signature: 'ApiList(apis: { signature, description }[])',
          description: 'Full-width stacked API reference cards. Signature in monospace, description below.',
        },
      ],
    },
    {
      kind: 'data-table',
      id: 'tokens',
      title: 'Design tokens',
      subtitle: 'Override any token in global.css via @theme.',
      columns: ['Token', 'Default', 'Used for'],
      rows: [
        ['--color-surface', '#09090b', 'Page background'],
        ['--color-surface-raised', '#18181b', 'Elevated elements, code blocks'],
        ['--color-edge', '#27272a', 'Primary borders'],
        ['--color-heading', '#fafafa', 'Headings, primary text'],
        ['--color-body', '#e4e4e7', 'Body / secondary text'],
        ['--color-dim', '#a1a1aa', 'Labels, captions'],
        ['--color-accent', '#34d399', 'Status indicator dot'],
        ['--color-action', '#fafafa', 'Primary button background'],
        ['--color-action-text', '#09090b', 'Primary button text'],
      ],
    },
  ],
};
