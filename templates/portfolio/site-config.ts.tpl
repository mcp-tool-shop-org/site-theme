import type { PortfolioSiteConfig } from '@mcptoolshop/site-theme/types/portfolio-config';

export const config: PortfolioSiteConfig = {
  template: 'portfolio',
  title: '{{PACKAGE_NAME}}',
  description: '{{DESCRIPTION}}',
  logoBadge: '{{LOGO_BADGE}}',
  brandName: '{{BRAND_NAME}}',
  repoUrl: '{{REPO_URL}}',
  npmUrl: '{{NPM_URL}}',
  footerText: 'MIT Licensed — built by <a href="https://github.com/mcp-tool-shop-org" style="color:var(--color-muted);text-decoration:underline">mcp-tool-shop-org</a>',

  // Optional hero — remove this block for a simpler catalog page
  hero: {
    badge: 'Catalog',
    headline: '{{BRAND_NAME}}',
    headlineAccent: 'collection.',
    description: '{{DESCRIPTION}}',
    primaryCta: { href: '#catalog', label: 'Browse catalog' },
    secondaryCta: { href: '{{REPO_URL}}', label: 'View source' },
    previews: [],
  },

  portfolioHeading: 'Catalog',
  portfolioSubtitle: 'Browse, search, and filter the full collection.',

  // Toggle features on/off
  filterable: true,
  searchable: true,
  groupByCategory: false,
  columns: 3,

  items: [
    {
      title: 'Example Tool',
      description: 'A short description of what this tool does. Replace with your own items.',
      href: 'https://github.com/example/tool',
      badge: 'ET',
      tags: ['cli', 'typescript'],
      category: 'Tools',
      status: 'stable',
      meta: 'v1.0.0 · MIT',
      secondaryAction: { href: 'https://npmjs.com/package/example', label: 'npm' },
    },
    {
      title: 'Another Project',
      description: 'Another item in the portfolio. Works with any content type — tools, people, recipes, courses.',
      href: 'https://github.com/example/project',
      tags: ['python', 'ml'],
      category: 'Libraries',
      status: 'beta',
      meta: 'v0.3.0 · Apache-2.0',
    },
    {
      title: 'Integration Hub',
      description: 'Integrations, services, APIs — anything that connects. The grid adapts to your content.',
      href: 'https://github.com/example/hub',
      tags: ['api', 'integration'],
      category: 'Integrations',
      status: 'new',
      meta: 'v2.1.0',
      secondaryAction: { href: '#', label: 'Docs' },
    },
    {
      title: 'Data Pipeline',
      description: 'Structured data processing. Status badges show lifecycle state at a glance.',
      href: '#',
      tags: ['python', 'data'],
      category: 'Tools',
      status: 'stable',
      meta: 'v3.0.0 · MIT',
    },
    {
      title: 'Design System',
      description: 'UI components, tokens, and patterns. Secondary actions link to related resources.',
      href: '#',
      tags: ['css', 'typescript', 'ui'],
      category: 'Libraries',
      status: 'stable',
      meta: 'v1.4.0',
      secondaryAction: { href: '#', label: 'Storybook' },
    },
    {
      title: 'Archived Widget',
      description: 'Archived items stay visible but visually deprioritized with the "archived" status.',
      href: '#',
      tags: ['legacy'],
      category: 'Tools',
      status: 'archived',
      meta: 'v0.1.0 · Deprecated',
    },
  ],

  ctaBanner: {
    headline: 'Want to contribute?',
    description: 'Submit your project or suggest improvements.',
    cta: { href: '{{REPO_URL}}', label: 'Get involved' },
  },
};
