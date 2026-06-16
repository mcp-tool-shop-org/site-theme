import type { ToolSiteConfig } from '@mcptoolshop/site-theme';

export const config: ToolSiteConfig = {
  template: 'tool',
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
    headlineAccent: 'for developers.',
    description: '{{DESCRIPTION}}',
    primaryCta: { href: '#quickstart', label: 'Get started' },
    secondaryCta: { href: '#commands', label: 'View commands' },
    previews: [
      { label: 'Install', code: 'npm install -g {{PACKAGE_NAME}}' },
      { label: 'Run', code: '{{BRAND_NAME}} --help' },
      { label: 'Verify', code: '{{BRAND_NAME}} doctor' },
    ],
  },

  quickstart: [
    {
      title: 'Install',
      code: 'npm install -g {{PACKAGE_NAME}}',
    },
    {
      title: 'Run',
      code: '{{BRAND_NAME}} --help\n# Replace with your real entry-point command',
    },
    {
      title: 'Verify',
      code: '{{BRAND_NAME}} doctor\n# Replace with a self-check or verification command',
    },
  ],

  commands: [
    {
      name: 'doctor',
      description: 'Check local setup and required dependencies.',
      usage: '{{BRAND_NAME}} doctor',
    },
    {
      name: 'run',
      description: 'Execute the main workflow.',
      usage: '{{BRAND_NAME}} run [options]',
    },
    {
      name: 'list',
      description: 'List available resources or outputs.',
      usage: '{{BRAND_NAME}} list',
    },
  ],

  workflow: {
    title: 'Example workflow',
    description: 'A realistic end-to-end usage path.',
    steps: [
      {
        title: 'Configure',
        code: '# Replace with a real configuration step\n{{BRAND_NAME}} init',
      },
      {
        title: 'Run',
        code: '# Replace with the main command\n{{BRAND_NAME}} run --input my-file.ts',
      },
      {
        title: 'Output',
        code: '# Replace with realistic output\n✓ Processed 12 files in 340ms',
      },
    ],
  },

  proof: {
    tests: '0 passing',
    ci: 'passing',
    dogfood: 'pending',
    version: 'v0.1.0',
  },

  integration: {
    title: 'Integration',
    subtitle: 'Add {{BRAND_NAME}} to your project.',
    cards: [
      {
        title: 'npm',
        code: 'npm install {{PACKAGE_NAME}}',
      },
      {
        title: 'Import',
        code: "import { ... } from '{{PACKAGE_NAME}}';\n\n// Replace with real usage",
      },
    ],
  },
};
