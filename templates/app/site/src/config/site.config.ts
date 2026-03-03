/**
 * App template site configuration.
 * Token-replaced values ({{BRAND_NAME}}, etc.) are filled by the CLI at scaffold time.
 */

import type { Role } from '../lib/policy';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  featureFlag?: string;
  requiredRole?: Role;
}

export const siteConfig = {
  brand: '{{BRAND_NAME}}',
  description: '{{DESCRIPTION}}',
  repoUrl: '{{REPO_URL}}',
  defaultWorkspace: 'acme',
};

export function getNav(workspace: string): Record<string, NavItem> {
  const base = import.meta.env.BASE_URL;
  return {
    dashboard: { label: 'Dashboard', href: `${base}app/${workspace}`, icon: '▦' },
    projects: { label: 'Projects', href: `${base}app/${workspace}/projects`, icon: '◫' },
    settings: { label: 'Settings', href: `${base}app/${workspace}/settings/profile`, icon: '⚙' },
  };
}

export function getSettingsNav(workspace: string): NavItem[] {
  const base = import.meta.env.BASE_URL;
  return [
    { label: 'Profile', href: `${base}app/${workspace}/settings/profile` },
    { label: 'Team', href: `${base}app/${workspace}/settings/team`, featureFlag: 'teams', requiredRole: 'admin' },
    { label: 'Billing', href: `${base}app/${workspace}/settings/billing`, featureFlag: 'billing', requiredRole: 'admin' },
    { label: 'Security', href: `${base}app/${workspace}/settings/security` },
  ];
}
