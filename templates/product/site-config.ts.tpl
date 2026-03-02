import type { ProductSiteConfig } from '@mcptoolshop/site-theme';

export const config: ProductSiteConfig = {
  template: 'product',
  title: '{{PACKAGE_NAME}}',
  description: '{{DESCRIPTION}}',
  logoBadge: '{{LOGO_BADGE}}',
  brandName: '{{BRAND_NAME}}',
  repoUrl: '{{REPO_URL}}',
  npmUrl: '{{NPM_URL}}',
  footerText: 'MIT Licensed — built by <a href="https://github.com/mcp-tool-shop-org" style="color:var(--color-muted);text-decoration:underline">mcp-tool-shop-org</a>',

  hero: {
    badge: 'Now available',
    headline: '{{BRAND_NAME}}',
    headlineAccent: 'for teams that ship.',
    description: '{{DESCRIPTION}}',
    primaryCta: { href: '#pricing', label: 'Get started' },
    secondaryCta: { href: '#features', label: 'See features' },
    previews: [
      { label: 'Install', code: 'npm install {{PACKAGE_NAME}}' },
      { label: 'Setup', code: '// one-line setup example' },
      { label: 'Ship', code: '// one-line usage example' },
    ],
  },

  socialProof: {
    headline: 'Trusted by developers worldwide',
    stats: [
      { value: '10k+', label: 'Downloads' },
      { value: '99%', label: 'Uptime' },
      { value: '<50ms', label: 'Latency' },
      { value: '4.9/5', label: 'Rating' },
    ],
  },

  features: [
    { title: 'Lightning Fast', desc: 'Describe what makes {{BRAND_NAME}} fast or efficient.' },
    { title: 'Type Safe', desc: 'Describe the type safety or schema guarantees.' },
    { title: 'Battle Tested', desc: 'Describe the reliability and test coverage story.' },
  ],

  pricing: {
    headline: 'Simple pricing',
    subtitle: 'No hidden fees. Cancel anytime.',
    tiers: [
      {
        name: 'Free',
        price: '$0',
        description: 'For individuals and small projects.',
        features: ['Core features', 'Community support', 'Public repos'],
        cta: { href: '#', label: 'Get started free' },
      },
      {
        name: 'Pro',
        price: '$19/mo',
        description: 'For teams that need more.',
        features: ['Everything in Free', 'Priority support', 'Private repos', 'Advanced analytics'],
        cta: { href: '#', label: 'Start free trial' },
        highlighted: true,
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For large organizations.',
        features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
        cta: { href: '#', label: 'Contact sales' },
      },
    ],
  },

  testimonials: [
    {
      quote: 'Replace this with a real testimonial from a happy user.',
      author: 'Jane Doe',
      role: 'CTO, Acme Corp',
    },
    {
      quote: 'Replace this with another compelling testimonial.',
      author: 'John Smith',
      role: 'Lead Developer, Startup Inc',
    },
  ],

  ctaBanner: {
    headline: 'Ready to get started?',
    description: 'Join thousands of developers using {{BRAND_NAME}} today.',
    cta: { href: '{{REPO_URL}}', label: 'Get started now' },
  },
};
