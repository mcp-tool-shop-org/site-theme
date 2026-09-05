import { describe, expect, it } from 'vitest';
import { labelForPackageHost, resolvePackageLink } from '../lib/package-link.mjs';

describe('labelForPackageHost', () => {
  it('maps known registries', () => {
    expect(labelForPackageHost('www.npmjs.com')).toBe('npm');
    expect(labelForPackageHost('npmjs.com')).toBe('npm');
    expect(labelForPackageHost('pypi.org')).toBe('PyPI');
    expect(labelForPackageHost('crates.io')).toBe('crates.io');
    expect(labelForPackageHost('pkg.go.dev')).toBe('pkg.go.dev');
    expect(labelForPackageHost('rubygems.org')).toBe('RubyGems');
    expect(labelForPackageHost('search.maven.org')).toBe('Maven Central');
    expect(labelForPackageHost('central.sonatype.com')).toBe('Maven Central');
  });

  it('treats npmjs.com subdomains as npm', () => {
    expect(labelForPackageHost('registry.npmjs.com')).toBe('npm');
  });

  it('falls back to Package for unknown hosts', () => {
    expect(labelForPackageHost('packages.example.internal')).toBe('Package');
    expect(labelForPackageHost('')).toBe('Package');
  });
});

describe('resolvePackageLink', () => {
  it('prefers packageUrl over the npmUrl alias', () => {
    const link = resolvePackageLink({
      packageUrl: 'https://pypi.org/project/sovereignty-game/',
      npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/site-theme',
    });
    expect(link).toEqual({ url: 'https://pypi.org/project/sovereignty-game/', label: 'PyPI' });
  });

  it('uses npmUrl as a back-compat alias', () => {
    const link = resolvePackageLink({ npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/site-theme' });
    expect(link).toEqual({
      url: 'https://www.npmjs.com/package/@mcptoolshop/site-theme',
      label: 'npm',
    });
  });

  it('honours packageLabel over host derivation', () => {
    const link = resolvePackageLink({
      packageUrl: 'https://packages.example.internal/foo',
      packageLabel: 'Internal',
    });
    expect(link).toEqual({ url: 'https://packages.example.internal/foo', label: 'Internal' });
  });

  it('returns null when neither URL is set', () => {
    expect(resolvePackageLink({})).toBeNull();
    expect(resolvePackageLink({ packageUrl: '  ', npmUrl: '' })).toBeNull();
  });

  it('labels an unparseable URL as Package', () => {
    expect(resolvePackageLink({ packageUrl: 'not a url' })).toEqual({ url: 'not a url', label: 'Package' });
  });
});
