/**
 * App template site configuration.
 * Token-replaced values ({{BRAND_NAME}}, etc.) are filled by the CLI at scaffold time.
 */

export const siteConfig = {
  brand: '{{BRAND_NAME}}',
  description: '{{DESCRIPTION}}',
  repoUrl: '{{REPO_URL}}',
  nav: {
    dashboard: { label: 'Dashboard', href: `${import.meta.env.BASE_URL}app` },
    projects: { label: 'Projects', href: `${import.meta.env.BASE_URL}app/projects` },
    settings: { label: 'Settings', href: `${import.meta.env.BASE_URL}app/settings/profile` },
  },
  settings: [
    { label: 'Profile', href: `${import.meta.env.BASE_URL}app/settings/profile` },
    { label: 'Team', href: `${import.meta.env.BASE_URL}app/settings/team` },
    { label: 'Billing', href: `${import.meta.env.BASE_URL}app/settings/billing` },
    { label: 'Security', href: `${import.meta.env.BASE_URL}app/settings/security` },
  ],
};
