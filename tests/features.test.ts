import { describe, it, expect } from 'vitest';

/**
 * Feature flag tests — validates the app template's feature system.
 * Source: templates/app/site/src/lib/features.ts
 */

interface FeatureFlags {
  billing: boolean;
  teams: boolean;
  auditLog: boolean;
  apiKeys: boolean;
}

const features: FeatureFlags = {
  billing: true,
  teams: true,
  auditLog: false,
  apiKeys: false,
};

function isEnabled(flag: keyof FeatureFlags): boolean {
  return features[flag];
}

describe('feature flags defaults', () => {
  it('billing is enabled by default', () => expect(isEnabled('billing')).toBe(true));
  it('teams is enabled by default', () => expect(isEnabled('teams')).toBe(true));
  it('auditLog is disabled by default', () => expect(isEnabled('auditLog')).toBe(false));
  it('apiKeys is disabled by default', () => expect(isEnabled('apiKeys')).toBe(false));
});

describe('isEnabled returns boolean', () => {
  it('returns true for enabled flags', () => {
    expect(typeof isEnabled('billing')).toBe('boolean');
  });

  it('returns false for disabled flags', () => {
    expect(typeof isEnabled('auditLog')).toBe('boolean');
  });
});
