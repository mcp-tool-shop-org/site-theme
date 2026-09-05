import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

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

  it('pack files include lib, CHANGELOG, and the default favicon', () => {
    expect(pkg.files).toContain('lib');
    expect(pkg.files).toContain('CHANGELOG.md');
    expect(pkg.files).toContain('assets/favicon.svg');
  });
});
