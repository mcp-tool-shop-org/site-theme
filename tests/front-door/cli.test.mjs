import { execSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const CLI = join(import.meta.dirname, '..', '..', 'cli', 'init.mjs');
const TMP = join(import.meta.dirname, '..', '.test-tmp-fd-cli');

function run(args) {
  return execSync(`node "${CLI}" ${args}`, { cwd: TMP, encoding: 'utf-8', timeout: 15000 });
}

beforeEach(() => {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
  writeFileSync(join(TMP, 'package.json'), JSON.stringify({ name: 't', scripts: { test: 'x' } }));
});

afterEach(() => rmSync(TMP, { recursive: true, force: true }));

describe('front-door CLI', () => {
  it('prints the standard spine', () => {
    const out = run('front-door standard');
    expect(out).toContain('README.md spine');
    expect(out).toContain('AGENTS.md');
  });

  it('shows help', () => {
    const out = run('front-door --help');
    expect(out).toContain('verify');
    expect(out).toContain('standard');
  });

  it('verify passes (exit 0) on a clean front door', () => {
    writeFileSync(join(TMP, 'README.md'), '# t\n\nA clean readme with no dead refs.\n');
    writeFileSync(join(TMP, 'AGENTS.md'), '# AGENTS\n\nRepo-unique notes.\n');
    expect(run('front-door verify')).toContain('PASS');
  });

  it('verify fails (exit 1) on a dead reference', () => {
    writeFileSync(join(TMP, 'README.md'), 'See `src/missing.ts`.\n');
    writeFileSync(join(TMP, 'AGENTS.md'), '# AGENTS\n\nNotes.\n');
    expect(() => run('front-door verify')).toThrow();
  });

  it('verify --json emits valid JSON with gate + counts', () => {
    writeFileSync(join(TMP, 'README.md'), '# t\n\nClean.\n');
    writeFileSync(join(TMP, 'AGENTS.md'), '# A\n\nNotes.\n');
    const parsed = JSON.parse(run('front-door verify --json'));
    expect(parsed.gate).toBeDefined();
    expect(parsed.counts).toBeDefined();
  });
});
