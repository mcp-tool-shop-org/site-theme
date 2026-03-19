import { describe, it, expect } from 'vitest';

/**
 * Tests for pure helper functions extracted from cli/init.mjs.
 * Since the CLI is a single .mjs file without named exports,
 * we replicate the logic here for unit testing.
 */

// --- Replicated helpers (must match cli/init.mjs) ---

function deriveBadge(name) {
  return name
    .split('-')
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);
}

function unscopeName(name) {
  return name.replace(/^@[^/]+\//, '');
}

function extractRepoName(repoUrl) {
  if (!repoUrl) return '';
  return repoUrl.replace(/\.git$/, '').split('/').pop() || '';
}

function applyVars(content, vars) {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}

const TEXT_EXT = new Set(['.ts', '.mjs', '.js', '.json', '.astro', '.css', '.html', '.md', '.yml', '.yaml', '.toml']);

function shouldTokenReplace(ext) {
  return TEXT_EXT.has(ext.toLowerCase());
}

// --- Tests ---

describe('deriveBadge', () => {
  it('produces 2-char badge from hyphenated name', () => {
    expect(deriveBadge('site-theme')).toBe('ST');
  });

  it('handles single word', () => {
    expect(deriveBadge('registry')).toBe('R');
  });

  it('caps at 2 characters', () => {
    expect(deriveBadge('a-b-c-d')).toBe('AB');
  });

  it('handles empty string', () => {
    expect(deriveBadge('')).toBe('');
  });
});

describe('unscopeName', () => {
  it('strips npm scope', () => {
    expect(unscopeName('@mcptoolshop/site-theme')).toBe('site-theme');
  });

  it('returns unscoped names unchanged', () => {
    expect(unscopeName('site-theme')).toBe('site-theme');
  });

  it('handles empty string', () => {
    expect(unscopeName('')).toBe('');
  });
});

describe('extractRepoName', () => {
  it('extracts name from HTTPS URL', () => {
    expect(extractRepoName('https://github.com/org/my-repo.git')).toBe('my-repo');
  });

  it('extracts name from URL without .git', () => {
    expect(extractRepoName('https://github.com/org/my-repo')).toBe('my-repo');
  });

  it('returns empty string for falsy input', () => {
    expect(extractRepoName('')).toBe('');
    expect(extractRepoName(undefined)).toBe('');
    expect(extractRepoName(null)).toBe('');
  });
});

describe('applyVars', () => {
  it('replaces known tokens', () => {
    const result = applyVars('Hello {{NAME}}!', { NAME: 'World' });
    expect(result).toBe('Hello World!');
  });

  it('replaces multiple tokens', () => {
    const result = applyVars('{{A}} and {{B}}', { A: 'one', B: 'two' });
    expect(result).toBe('one and two');
  });

  it('replaces unknown tokens with empty string', () => {
    const result = applyVars('{{MISSING}}', {});
    expect(result).toBe('');
  });

  it('leaves non-token text unchanged', () => {
    const result = applyVars('no tokens here', { A: 'val' });
    expect(result).toBe('no tokens here');
  });

  it('handles empty content', () => {
    expect(applyVars('', { A: 'val' })).toBe('');
  });

  it('replaces same token multiple times', () => {
    const result = applyVars('{{X}} + {{X}}', { X: '1' });
    expect(result).toBe('1 + 1');
  });
});

describe('shouldTokenReplace (by extension)', () => {
  it('returns true for text file extensions', () => {
    for (const ext of ['.ts', '.mjs', '.js', '.json', '.astro', '.css', '.html', '.md', '.yml', '.yaml', '.toml']) {
      expect(shouldTokenReplace(ext)).toBe(true);
    }
  });

  it('returns false for binary extensions', () => {
    for (const ext of ['.png', '.jpg', '.woff2', '.exe', '.zip']) {
      expect(shouldTokenReplace(ext)).toBe(false);
    }
  });

  it('is case-insensitive', () => {
    expect(shouldTokenReplace('.TS')).toBe(true);
    expect(shouldTokenReplace('.JSON')).toBe(true);
  });
});
