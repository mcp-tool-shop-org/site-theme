import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { analyzeFeature, checkGherkin } from '../../cli/front-door/gherkin.mjs';

const TMP = join(import.meta.dirname, '..', '.test-tmp-fd-gherkin');

beforeEach(() => {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(join(TMP, 'features'), { recursive: true });
});

afterEach(() => rmSync(TMP, { recursive: true, force: true }));

function feat(name, content) {
  writeFileSync(join(TMP, 'features', name), content);
}

describe('analyzeFeature', () => {
  it('counts total and skipped scenarios', () => {
    const r = analyzeFeature('Feature: F\n  @wip\n  Scenario: a\n    Given x\n  Scenario: b\n    Given y\n');
    expect(r).toEqual({ total: 2, skipped: 1 });
  });
});

describe('checkGherkin', () => {
  it('is a no-op when there are no .feature files', () => {
    rmSync(join(TMP, 'features'), { recursive: true, force: true });
    expect(checkGherkin({ repoRoot: TMP })).toHaveLength(0);
  });

  it('passes when all scenarios are active', () => {
    feat('a.feature', 'Feature: A\n  Scenario: one\n    Given x\n  Scenario: two\n    Given y\n');
    expect(checkGherkin({ repoRoot: TMP })).toHaveLength(0);
  });

  it('flags skipped scenarios', () => {
    feat('b.feature', 'Feature: B\n  @wip\n  Scenario: pending\n    Given x\n  Scenario: ok\n    Given y\n');
    const f = checkGherkin({ repoRoot: TMP });
    expect(f).toHaveLength(1);
    expect(f[0].channel).toBe('gherkin');
    expect(f[0].title).toContain('1/2');
  });
});
