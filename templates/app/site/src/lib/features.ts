/**
 * Feature flag registry.
 * Toggle features on/off without changing components.
 * Disabled features are hidden from nav and pages.
 */

export interface FeatureFlags {
  billing: boolean;
  teams: boolean;
  auditLog: boolean;
  apiKeys: boolean;
}

export const features: FeatureFlags = {
  billing: true,
  teams: true,
  auditLog: false,
  apiKeys: false,
};

export function isEnabled(flag: keyof FeatureFlags): boolean {
  return features[flag];
}
