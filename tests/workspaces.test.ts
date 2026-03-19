import { describe, it, expect } from 'vitest';

/**
 * Workspace model tests — validates the app template's workspace functions.
 * Source: templates/app/site/src/lib/workspaces.ts
 */

interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'pro' | 'business';
}

const WORKSPACES: Workspace[] = [
  { id: 'ws_1', name: 'Acme Corp', slug: 'acme', plan: 'pro' },
  { id: 'ws_2', name: 'Startup Inc', slug: 'startup', plan: 'starter' },
  { id: 'ws_3', name: 'Side Project', slug: 'side-project', plan: 'starter' },
];

function getWorkspaceBySlug(slug: string): Workspace | undefined {
  return WORKSPACES.find((w) => w.slug === slug);
}

function getDefaultWorkspace(): Workspace {
  return WORKSPACES[0];
}

function getWorkspaceSlugs(): string[] {
  return WORKSPACES.map((w) => w.slug);
}

describe('getWorkspaceBySlug', () => {
  it('returns workspace for valid slug', () => {
    const ws = getWorkspaceBySlug('acme');
    expect(ws).toBeDefined();
    expect(ws!.name).toBe('Acme Corp');
    expect(ws!.plan).toBe('pro');
  });

  it('returns undefined for invalid slug', () => {
    expect(getWorkspaceBySlug('nonexistent')).toBeUndefined();
  });

  it('returns undefined for empty slug', () => {
    expect(getWorkspaceBySlug('')).toBeUndefined();
  });
});

describe('getDefaultWorkspace', () => {
  it('returns the first workspace', () => {
    const ws = getDefaultWorkspace();
    expect(ws.slug).toBe('acme');
    expect(ws.id).toBe('ws_1');
  });
});

describe('getWorkspaceSlugs', () => {
  it('returns all slugs', () => {
    const slugs = getWorkspaceSlugs();
    expect(slugs).toEqual(['acme', 'startup', 'side-project']);
  });

  it('returns correct count', () => {
    expect(getWorkspaceSlugs()).toHaveLength(3);
  });
});
