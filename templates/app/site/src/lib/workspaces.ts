/**
 * Client-side workspace management using localStorage.
 * Provides sample workspaces for the template demo.
 * Replace with API-backed workspaces when connecting to a backend.
 */

export interface Workspace {
  id: string;
  name: string;
  slug: string;
}

const STORAGE_KEY = 'active_workspace';

export const WORKSPACES: Workspace[] = [
  { id: 'ws_1', name: 'Acme Corp', slug: 'acme-corp' },
  { id: 'ws_2', name: 'Startup Inc', slug: 'startup-inc' },
  { id: 'ws_3', name: 'Side Project', slug: 'side-project' },
];

export function getActiveWorkspace(): Workspace {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    const found = WORKSPACES.find((w) => w.id === id);
    if (found) return found;
  } catch {
    // localStorage unavailable
  }
  return WORKSPACES[0];
}

export function setActiveWorkspace(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // localStorage unavailable
  }
}
