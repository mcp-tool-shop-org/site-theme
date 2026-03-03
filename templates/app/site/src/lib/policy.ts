/**
 * RBAC policy functions.
 * Pure functions — no side effects, easily testable.
 * Replace with your own authorization logic when connecting a backend.
 */

export type Role = 'owner' | 'admin' | 'member';

export function canViewBilling(role: Role): boolean {
  return role === 'owner' || role === 'admin';
}

export function canManageTeam(role: Role): boolean {
  return role === 'owner' || role === 'admin';
}

export function canManageWorkspace(role: Role): boolean {
  return role === 'owner';
}
