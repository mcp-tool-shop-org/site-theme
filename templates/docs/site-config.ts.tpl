import type { DocsSiteConfig } from '@mcptoolshop/site-theme';

export const config: DocsSiteConfig = {
  template: 'docs',
  title: '{{PACKAGE_NAME}} Docs',
  description: '{{DESCRIPTION}}',
  logoBadge: '{{LOGO_BADGE}}',
  brandName: '{{BRAND_NAME}}',
  repoUrl: '{{REPO_URL}}',
  npmUrl: '{{NPM_URL}}',
  footerText: 'MIT Licensed — built by <a href="https://github.com/mcp-tool-shop-org" style="color:var(--color-muted);text-decoration:underline">mcp-tool-shop-org</a>',

  sidebar: [
    {
      title: 'Getting Started',
      items: [
        { label: 'Introduction', href: '#introduction' },
        { label: 'Installation', href: '#installation' },
        { label: 'Quick Start', href: '#quick-start' },
      ],
    },
    {
      title: 'Guides',
      items: [
        { label: 'Configuration', href: '#configuration' },
        { label: 'Customization', href: '#customization' },
      ],
    },
  ],

  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      content: '<p>{{BRAND_NAME}} — {{DESCRIPTION}}</p><p>Replace this section with your introduction content.</p>',
    },
    {
      id: 'installation',
      title: 'Installation',
      content: '<pre><code>npm install {{PACKAGE_NAME}}</code></pre><p>Or with your preferred package manager:</p><pre><code>pnpm add {{PACKAGE_NAME}}\nyarn add {{PACKAGE_NAME}}</code></pre>',
    },
    {
      id: 'quick-start',
      title: 'Quick Start',
      content: '<p>Get up and running in under a minute:</p><pre><code>import { ... } from \'{{PACKAGE_NAME}}\';\n\n// Replace with a real quick-start example</code></pre>',
    },
    {
      id: 'configuration',
      title: 'Configuration',
      content: '<p>Replace this with configuration options and examples.</p>',
    },
    {
      id: 'customization',
      title: 'Customization',
      content: '<p>Replace this with customization guides and advanced usage.</p>',
    },
  ],
};
