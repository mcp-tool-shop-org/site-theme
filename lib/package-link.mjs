/**
 * Resolve a registry-agnostic package link for BaseLayout.
 *
 * `packageUrl` is preferred; `npmUrl` is the back-compat alias. The visible
 * label is derived from the URL host unless `packageLabel` is set.
 */

const HOST_LABELS = {
  'www.npmjs.com': 'npm',
  'npmjs.com': 'npm',
  'pypi.org': 'PyPI',
  'www.pypi.org': 'PyPI',
  'crates.io': 'crates.io',
  'pkg.go.dev': 'pkg.go.dev',
  'rubygems.org': 'RubyGems',
  'www.rubygems.org': 'RubyGems',
  'search.maven.org': 'Maven Central',
  'central.sonatype.com': 'Maven Central',
  'repo.maven.apache.org': 'Maven Central',
};

/**
 * @param {string} hostname
 * @returns {string}
 */
export function labelForPackageHost(hostname) {
  const host = String(hostname || '').toLowerCase();
  if (HOST_LABELS[host]) return HOST_LABELS[host];
  if (host.endsWith('.npmjs.com')) return 'npm';
  return 'Package';
}

/**
 * @param {{ packageUrl?: string, npmUrl?: string, packageLabel?: string }} [input]
 * @returns {{ url: string, label: string } | null}
 */
export function resolvePackageLink(input = {}) {
  const packageUrl = typeof input.packageUrl === 'string' ? input.packageUrl.trim() : '';
  const npmUrl = typeof input.npmUrl === 'string' ? input.npmUrl.trim() : '';
  const url = packageUrl || npmUrl;
  if (!url) return null;

  const override = typeof input.packageLabel === 'string' ? input.packageLabel.trim() : '';
  if (override) return { url, label: override };

  try {
    return { url, label: labelForPackageHost(new URL(url).hostname) };
  } catch {
    return { url, label: 'Package' };
  }
}
