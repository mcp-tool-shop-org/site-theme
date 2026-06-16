import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { generate, planScaffold } from '../../cli/front-door/generate.mjs';
import { verify } from '../../cli/front-door/index.mjs';

const TMP = join(import.meta.dirname, '..', '.test-tmp-fd-gen');

beforeEach(() => {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
  writeFileSync(join(TMP, 'package.json'), JSON.stringify({ name: '@scope/tool' }));
});

afterEach(() => rmSync(TMP, { recursive: true, force: true }));

describe('planScaffold', () => {
  it('plans README + AGENTS.md and fills the name', () => {
    const plan = planScaffold(TMP);
    expect(plan.map((p) => p.rel)).toEqual(['README.md', 'AGENTS.md']);
    expect(plan.find((p) => p.rel === 'README.md').content).toContain('@scope/tool');
  });

  it('plans llms.txt only when a docs site exists', () => {
    expect(planScaffold(TMP).some((p) => p.rel === 'llms.txt')).toBe(false);
    mkdirSync(join(TMP, 'docs'), { recursive: true });
    expect(planScaffold(TMP).some((p) => p.rel === 'llms.txt')).toBe(true);
  });
});

describe('generate', () => {
  it('writes the scaffolds', () => {
    const r = generate({ root: TMP });
    expect(r.created).toContain('README.md');
    expect(existsSync(join(TMP, 'AGENTS.md'))).toBe(true);
  });

  it('produces a scaffold that PASSES front-door verify (dogfood)', () => {
    generate({ root: TMP });
    expect(verify({ root: TMP }).gate.pass).toBe(true);
  });

  it('does not overwrite existing files without --force', () => {
    writeFileSync(join(TMP, 'README.md'), 'KEEP ME');
    const r = generate({ root: TMP });
    expect(r.skipped).toContain('README.md');
    expect(readFileSync(join(TMP, 'README.md'), 'utf-8')).toBe('KEEP ME');
  });

  it('overwrites with force', () => {
    writeFileSync(join(TMP, 'README.md'), 'OLD');
    generate({ root: TMP, force: true });
    expect(readFileSync(join(TMP, 'README.md'), 'utf-8')).not.toBe('OLD');
  });

  it('dry-run writes nothing', () => {
    generate({ root: TMP, dryRun: true });
    expect(existsSync(join(TMP, 'README.md'))).toBe(false);
  });
});
