import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '{{PACKAGE_NAME}}',
  description: '{{DESCRIPTION}}',
  logoBadge: '{{LOGO_BADGE}}',
  brandName: '{{BRAND_NAME}}',
  repoUrl: '{{REPO_URL}}',
  npmUrl: '{{NPM_URL}}',
  footerText: 'MIT Licensed — built by <a href="https://github.com/mcp-tool-shop-org" style="color:var(--color-muted);text-decoration:underline">mcp-tool-shop-org</a>',

  hero: {
    badge: 'Open source',
    headline: '{{BRAND_NAME}}',
    headlineAccent: 'by mcp-tool-shop.',
    description: '{{DESCRIPTION}}',
    primaryCta: { href: '#usage', label: 'Get started' },
    secondaryCta: { href: '#features', label: 'Learn more' },
    previews: [
      { label: 'Install', code: 'npm install {{PACKAGE_NAME}}' },
      { label: 'Import', code: "import { ... } from '{{PACKAGE_NAME}}'" },
      { label: 'Use', code: '// replace with a compelling one-liner' },
    ],
  },

  sections: [
    {
      kind: 'features',
      id: 'features',
      title: 'Features',
      subtitle: 'What makes {{BRAND_NAME}} useful.',
      features: [
        { title: 'Fast', desc: 'Describe what makes {{BRAND_NAME}} fast or efficient.' },
        { title: 'Typed', desc: 'Describe the type safety or schema guarantees.' },
        { title: 'Tested', desc: 'Describe the test coverage or reliability story.' },
      ],
    },
    {
      kind: 'code-cards',
      id: 'usage',
      title: 'Usage',
      cards: [
        { title: 'Install', code: 'npm install {{PACKAGE_NAME}}' },
        { title: 'Basic usage', code: "import { ... } from '{{PACKAGE_NAME}}';\n\n// replace with real usage" },
      ],
    },
  ],
};
