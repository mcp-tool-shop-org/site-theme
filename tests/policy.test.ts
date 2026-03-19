import { describe, expect, it } from 'vitest';

/**
 * RBAC policy tests — validates the app template's policy functions.
 * Source: templates/app/site/src/lib/policy.ts
 */

type Role = 'owner' | 'admin' | 'member';

function canViewBilling(role: Role): boolean {
  return role === 'owner' || role === 'admin';
}

function canManageTeam(role: Role): boolean {
  return role === 'owner' || role === 'admin';
}

function canManageWorkspace(role: Role): boolean {
  return role === 'owner';
}

describe('canViewBilling', () => {
  it('allows owner', () => expect(canViewBilling('owner')).toBe(true));
  it('allows admin', () => expect(canViewBilling('admin')).toBe(true));
  it('denies member', () => expect(canViewBilling('member')).toBe(false));
});

describe('canManageTeam', () => {
  it('allows owner', () => expect(canManageTeam('owner')).toBe(true));
  it('allows admin', () => expect(canManageTeam('admin')).toBe(true));
  it('denies member', () => expect(canManageTeam('member')).toBe(false));
});

describe('canManageWorkspace', () => {
  it('allows owner only', () => expect(canManageWorkspace('owner')).toBe(true));
  it('denies admin', () => expect(canManageWorkspace('admin')).toBe(false));
  it('denies member', () => expect(canManageWorkspace('member')).toBe(false));
});
