import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '{{PACKAGE_NAME}}',
  description: '{{DESCRIPTION}}',
  logoBadge: '{{LOGO_BADGE}}',
  brandName: '{{BRAND_NAME}}',
  repoUrl: '{{REPO_URL}}',
  npmUrl: '{{NPM_URL}}',
  footerText: 'MIT Licensed',

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
      { label: 'Use', code: '// your code here' },
    ],
  },

  sections: [
    {
      kind: 'features',
      id: 'features',
      title: 'Features',
      subtitle: 'What makes {{BRAND_NAME}} useful.',
      features: [
        { title: 'Feature one', desc: 'Describe the first feature.' },
        { title: 'Feature two', desc: 'Describe the second feature.' },
        { title: 'Feature three', desc: 'Describe the third feature.' },
      ],
    },
    {
      kind: 'code-cards',
      id: 'usage',
      title: 'Usage',
      cards: [
        { title: 'Install', code: 'npm install {{PACKAGE_NAME}}' },
        { title: 'Basic usage', code: "import { ... } from '{{PACKAGE_NAME}}';\n\n// your code here" },
      ],
    },
  ],
};
