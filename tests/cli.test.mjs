import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const CLI = join(import.meta.dirname, '..', 'cli', 'init.mjs');
const TMP = join(import.meta.dirname, '..', '.test-tmp');

function run(args, cwd = TMP) {
  return execSync(`node ${CLI} ${args}`, { cwd, encoding: 'utf-8', timeout: 15000 });
}

beforeEach(() => {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
  writeFileSync(
    join(TMP, 'package.json'),
    JSON.stringify({ name: '@test/my-tool', version: '1.0.0', description: 'Test tool' }),
  );
});

afterEach(() => {
  rmSync(TMP, { recursive: true, force: true });
});

describe('CLI argument parsing', () => {
  it('shows help with --help flag', () => {
    const out = run('--help');
    expect(out).toContain('Usage:');
    expect(out).toContain('init');
    expect(out).toContain('list-templates');
  });

  it('shows version with --version flag', () => {
    const out = run('--version');
    expect(out).toMatch(/\d+\.\d+\.\d+/);
  });

  it('dies on unknown command', () => {
    expect(() => run('bogus')).toThrow();
  });
});

describe('list-templates', () => {
  it('lists available templates in text mode', () => {
    const out = run('list-templates');
    expect(out).toContain('default');
    expect(out).toContain('docs');
    expect(out).toContain('product');
    expect(out).toContain('app');
  });

  it('lists templates as JSON with --json', () => {
    const out = run('list-templates --json');
    const parsed = JSON.parse(out);
    expect(parsed.templates).toBeInstanceOf(Array);
    expect(parsed.templates.length).toBeGreaterThanOrEqual(4);
    expect(parsed.templates.map((t) => t.name)).toContain('default');
  });
});

describe('init --dry-run', () => {
  it('shows plan without creating files', () => {
    const out = run('init --dry-run');
    expect(out).toContain('Dry run');
    expect(out).toContain('PACKAGE_NAME: @test/my-tool');
    expect(existsSync(join(TMP, 'site'))).toBe(false);
  });

  it('supports --template flag', () => {
    const out = run('init --dry-run --template docs');
    expect(out).toContain('Dry run');
    expect(out).toContain('docs');
  });

  it('rejects invalid template names', () => {
    expect(() => run('init --template nonexistent')).toThrow();
  });

  it('rejects path traversal in --template', () => {
    expect(() => run('init --template ../../etc')).toThrow();
  });
});

describe('init (default template)', () => {
  it('scaffolds site/ directory with token replacement', () => {
    run('init');
    expect(existsSync(join(TMP, 'site'))).toBe(true);

    const siteConfig = readFileSync(join(TMP, 'site', 'src', 'site-config.ts'), 'utf-8');
    expect(siteConfig).toContain('@test/my-tool');
    expect(siteConfig).toContain('my-tool');
  });

  it('creates .gitignore entry for site/.astro/', () => {
    writeFileSync(join(TMP, '.gitignore'), 'node_modules/\n');
    run('init');
    const gitignore = readFileSync(join(TMP, '.gitignore'), 'utf-8');
    expect(gitignore).toContain('site/.astro/');
  });

  it('fails if site/ already exists', () => {
    mkdirSync(join(TMP, 'site'), { recursive: true });
    expect(() => run('init')).toThrow();
  });
});

describe('init --out', () => {
  it('scaffolds to custom output directory', () => {
    const outDir = join(TMP, 'custom-out');
    mkdirSync(outDir, { recursive: true });
    writeFileSync(
      join(outDir, 'package.json'),
      JSON.stringify({ name: '@test/custom', version: '1.0.0', description: 'Custom' }),
    );
    run(`init --out "${outDir}"`);
    expect(existsSync(join(outDir, 'site'))).toBe(true);
  });
});

describe('init with recursive templates', () => {
  for (const template of ['docs', 'product', 'app']) {
    it(`scaffolds ${template} template`, () => {
      run(`init --template ${template}`);
      expect(existsSync(join(TMP, 'site'))).toBe(true);
      expect(existsSync(join(TMP, 'site', 'package.json'))).toBe(true);
      expect(existsSync(join(TMP, 'site', 'astro.config.mjs'))).toBe(true);

      // Verify astro config exists and is valid JS
      const config = readFileSync(join(TMP, 'site', 'astro.config.mjs'), 'utf-8');
      expect(config).toContain('defineConfig');

      // Cleanup for next iteration
      rmSync(join(TMP, 'site'), { recursive: true, force: true });
    });
  }
});
