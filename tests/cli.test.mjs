import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

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
    expect(out).toContain('portfolio');
    expect(out).toContain('app');
    expect(out).toContain('tool');
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
    expect(out).toContain('site/public/favicon.svg');
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
    expect(existsSync(join(TMP, 'site', 'public', 'favicon.svg'))).toBe(true);
    const sitePkg = JSON.parse(readFileSync(join(TMP, 'site', 'package.json'), 'utf-8'));
    const themeVersion = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'package.json'), 'utf-8')).version;
    expect(sitePkg.dependencies['@mcptoolshop/site-theme']).toBe(`^${themeVersion}`);
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

describe('handbook', () => {
  beforeEach(() => {
    // handbook requires site/ to exist — run init first
    run('init');
  });

  it('fails if site/ does not exist', () => {
    rmSync(join(TMP, 'site'), { recursive: true, force: true });
    expect(() => run('handbook')).toThrow(/site.*not found/i);
  });

  it('fails if handbook already exists', () => {
    run('handbook');
    expect(() => run('handbook')).toThrow(/already exists/i);
  });

  it('fails on unknown accent', () => {
    expect(() => run('handbook --accent neon')).toThrow(/Unknown accent/i);
  });

  it('dry-run shows plan without creating files', () => {
    const out = run('handbook --dry-run --accent amber');
    expect(out).toContain('Dry run');
    expect(out).toContain('amber');
    expect(existsSync(join(TMP, 'site', 'src', 'content', 'docs', 'handbook'))).toBe(false);
  });

  it('creates content.config.ts with docsLoader', () => {
    run('handbook');
    const content = readFileSync(join(TMP, 'site', 'src', 'content.config.ts'), 'utf-8');
    expect(content).toContain('docsLoader');
    expect(content).toContain('docsSchema');
  });

  it('creates starlight-custom.css with accent colors', () => {
    run('handbook --accent amber');
    const css = readFileSync(join(TMP, 'site', 'src', 'styles', 'starlight-custom.css'), 'utf-8');
    expect(css).toContain('#d97706');
    expect(css).toContain('#fbbf24');
    expect(css).toContain('#451a03');
  });

  it('creates 3 handbook pages', () => {
    run('handbook');
    const base = join(TMP, 'site', 'src', 'content', 'docs', 'handbook');
    expect(existsSync(join(base, 'index.md'))).toBe(true);
    expect(existsSync(join(base, 'getting-started.md'))).toBe(true);
    expect(existsSync(join(base, 'reference.md'))).toBe(true);
  });

  it('updates astro.config.mjs with starlight integration', () => {
    run('handbook');
    const config = readFileSync(join(TMP, 'site', 'astro.config.mjs'), 'utf-8');
    expect(config).toContain('starlight');
    expect(config).toContain('disable404Route');
    expect(config).toContain('autogenerate');
  });

  it('adds @astrojs/starlight to site/package.json', () => {
    run('handbook');
    const pkg = JSON.parse(readFileSync(join(TMP, 'site', 'package.json'), 'utf-8'));
    expect(pkg.dependencies['@astrojs/starlight']).toBeDefined();
  });

  it('patches secondaryCta in site-config.ts', () => {
    run('handbook');
    const config = readFileSync(join(TMP, 'site', 'src', 'site-config.ts'), 'utf-8');
    expect(config).toContain("href: 'handbook/'");
    expect(config).toContain('Read the Handbook');
  });

  it('applies token replacement in handbook pages', () => {
    run('handbook');
    const index = readFileSync(join(TMP, 'site', 'src', 'content', 'docs', 'handbook', 'index.md'), 'utf-8');
    expect(index).toContain('my-tool');
    expect(index).not.toContain('{{BRAND_NAME}}');
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

describe('init --template tool', () => {
  it('scaffolds the tool template with ToolSiteConfig', () => {
    run('init --template tool');
    const config = readFileSync(join(TMP, 'site', 'src', 'site-config.ts'), 'utf-8');
    expect(config).toContain('ToolSiteConfig');
    expect(config).toContain("template: 'tool'");
    expect(config).toContain('my-tool');
    expect(existsSync(join(TMP, 'site', 'src', 'pages', 'index.astro'))).toBe(true);
  });

  it('appears in list-templates output', () => {
    const out = run('list-templates');
    expect(out).toContain('tool');
  });
});
