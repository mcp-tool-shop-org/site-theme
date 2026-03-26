import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('version alignment', () => {
  const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

  it('package.json version is semver', () => {
    const parts = pkg.version.split('.');
    expect(parts).toHaveLength(3);
    for (const part of parts) {
      expect(Number.isInteger(Number(part))).toBe(true);
    }
  });

  it('CHANGELOG mentions current version', () => {
    const changelog = readFileSync(join(__dirname, '..', 'CHANGELOG.md'), 'utf-8');
    expect(changelog).toContain(pkg.version);
  });

  it('package name uses @mcptoolshop scope', () => {
    expect(pkg.name).toMatch(/^@mcptoolshop\//);
  });
});
