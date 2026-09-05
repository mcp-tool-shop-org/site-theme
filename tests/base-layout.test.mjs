import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = readFileSync(join(import.meta.dirname, '..', 'components', 'BaseLayout.astro'), 'utf-8');

describe('BaseLayout.astro', () => {
  it('exposes a named head slot for consumer-injected meta', () => {
    expect(SRC).toMatch(/<slot\s+name=["']head["']\s*\/>/);
  });

  it('places the head slot before </head> so injected tags land in the document head', () => {
    const slot = SRC.search(/<slot\s+name=["']head["']\s*\/>/);
    const close = SRC.indexOf('</head>');
    expect(slot).toBeGreaterThan(-1);
    expect(close).toBeGreaterThan(slot);
  });

  it('emits default Open Graph tags from title/description', () => {
    expect(SRC).toContain('property="og:title"');
    expect(SRC).toContain('property="og:description"');
    expect(SRC).toContain('property="og:type"');
  });

  it('resolves packageUrl with npmUrl as a deprecated alias', () => {
    expect(SRC).toContain("from '../lib/package-link.mjs'");
    expect(SRC).toContain('resolvePackageLink');
    expect(SRC).toContain('packageUrl');
    expect(SRC).toContain('packageLabel');
    expect(SRC).toContain('packageLink.label');
  });

  it('does not hardcode the package button as npm', () => {
    expect(SRC).not.toMatch(/>npm</);
  });
});
