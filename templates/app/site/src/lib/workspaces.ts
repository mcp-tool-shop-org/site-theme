/**
 * Workspace model for multi-tenant routing.
 * The URL is the source of truth for the active workspace.
 * Replace with API-backed workspaces when connecting a backend.
 */

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'pro' | 'business';
}

export const WORKSPACES: Workspace[] = [
  { id: 'ws_1', name: 'Acme Corp', slug: 'acme', plan: 'pro' },
  { id: 'ws_2', name: 'Startup Inc', slug: 'startup', plan: 'starter' },
  { id: 'ws_3', name: 'Side Project', slug: 'side-project', plan: 'starter' },
];

export function getWorkspaceBySlug(slug: string): Workspace | undefined {
  return WORKSPACES.find((w) => w.slug === slug);
}

export function getDefaultWorkspace(): Workspace {
  return WORKSPACES[0];
}

/** Returns all workspace slugs — used by getStaticPaths() in every [workspace] page. */
export function getWorkspaceSlugs(): string[] {
  return WORKSPACES.map((w) => w.slug);
}
