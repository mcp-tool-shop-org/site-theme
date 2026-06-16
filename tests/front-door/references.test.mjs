import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { checkReferences } from '../../cli/front-door/references.mjs';

const TMP = join(import.meta.dirname, '..', '.test-tmp-fd-refs');

beforeEach(() => {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(join(TMP, 'src'), { recursive: true });
  writeFileSync(join(TMP, 'src', 'real.ts'), 'export const x = 1;\n');
  writeFileSync(join(TMP, 'package.json'), JSON.stringify({ name: 't', scripts: { build: 'tsc' } }));
});

afterEach(() => rmSync(TMP, { recursive: true, force: true }));

function refs(content, pkg = { scripts: { build: 'tsc' } }) {
  return checkReferences({ files: [{ name: 'README.md', content }], repoRoot: TMP, pkg });
}

describe('checkReferences — dead paths', () => {
  it('flags a path that does not exist', () => {
    const f = refs('See `src/missing.ts` for details.');
    expect(f).toHaveLength(1);
    expect(f[0].severity).toBe('stale');
    expect(f[0].bucket).toBe('contradicted');
    expect(f[0].title).toContain('src/missing.ts');
  });

  it('does not flag a path that exists', () => {
    expect(refs('See `src/real.ts`.')).toHaveLength(0);
  });

  it('does not flag npm package specifiers', () => {
    expect(refs('Install `@astrojs/starlight`.')).toHaveLength(0);
  });
});

describe('checkReferences — scripts', () => {
  it('flags npm run for a missing script', () => {
    const f = refs('```bash\nnpm run nope\n```');
    expect(f.some((x) => x.title.includes('nope'))).toBe(true);
  });

  it('does not flag a script that exists', () => {
    expect(refs('```bash\nnpm run build\n```')).toHaveLength(0);
  });

  it('does not flag scripts that run after a cd into a subdir', () => {
    expect(refs('```bash\ncd site && npm install\nnpm run dev\n```')).toHaveLength(0);
  });
});

describe('checkReferences — descriptive filenames', () => {
  it('does not flag a bare slash-free filename mentioned in prose', () => {
    expect(refs('Edit `global.css` to change the theme.')).toHaveLength(0);
  });
});

describe('checkReferences — badges', () => {
  it('flags a status badge as unbacked', () => {
    const f = refs('![CI](https://img.shields.io/github/actions/workflow/status/o/r/ci.yml)');
    expect(f).toHaveLength(1);
    expect(f[0].severity).toBe('unbacked');
    expect(f[0].channel).toBe('badge');
  });

  it('ignores a decorative badge', () => {
    expect(refs('![license](https://img.shields.io/badge/license-MIT-green)')).toHaveLength(0);
  });
});

describe('checkReferences — duplication', () => {
  it('flags AGENTS.md duplicating README beyond threshold', () => {
    const shared = [
      'This is a long shared line number one about the project setup.',
      'This is a long shared line number two about running the tests.',
      'This is a long shared line number three about the architecture.',
    ].join('\n');
    const files = [
      { name: 'README.md', content: `# R\n${shared}\n` },
      { name: 'AGENTS.md', content: `# A\n${shared}\n` },
    ];
    const f = checkReferences({ files, repoRoot: TMP, pkg: {} });
    expect(f.some((x) => x.title.includes('duplicates'))).toBe(true);
  });
});
