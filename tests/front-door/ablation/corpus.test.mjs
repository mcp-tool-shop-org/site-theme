import { describe, expect, it } from 'vitest';
import { ARMS, buildArmWorkspace } from '../../../cli/front-door/ablation/arms.mjs';
import { parseSweBenchVerified, syntheticCorpus } from '../../../cli/front-door/ablation/corpus.mjs';

const arm = (id) => ARMS.find((a) => a.id === id);

/** Does the planted fact resolve to the expected key inside a file set? */
function factReachable(files, instance) {
  const blob = Object.values(files).join('\n');
  const m = new RegExp(instance.keyPattern).exec(blob);
  return m ? (m[1] ?? m[0]) === instance.fix.key : false;
}

describe('syntheticCorpus', () => {
  const corpus = syntheticCorpus({ n: 50 });

  it('produces the requested count with all five categories', () => {
    expect(corpus.instances).toHaveLength(50);
    const cats = new Set(corpus.instances.map((i) => i.category));
    expect(cats).toEqual(new Set(['doc-only', 'doc-and-frontdoor', 'doc-only-base', 'code-evident', 'unfixable']));
  });

  it('is deterministic (no RNG)', () => {
    expect(JSON.stringify(syntheticCorpus({ n: 30 }))).toBe(JSON.stringify(syntheticCorpus({ n: 30 })));
  });

  it('every instance has a hidden test the agent never sees in its workspace', () => {
    for (const inst of corpus.instances) {
      expect(inst.testFiles['run-tests.mjs']).toContain(inst.fix.key);
      // The fix file the agent edits must NOT itself contain the answer.
      expect(inst.baseFiles['src/widget.mjs']).not.toContain(inst.fix.key);
    }
  });

  it('plants the fact exactly where each category claims', () => {
    const byCat = (c) => corpus.instances.find((i) => i.category === c);

    // doc-only: reachable only once the front door is present (B/C, not A).
    const docOnly = byCat('doc-only');
    expect(factReachable(buildArmWorkspace({ ...docOnly, arm: arm('A') }), docOnly)).toBe(false);
    expect(factReachable(buildArmWorkspace({ ...docOnly, arm: arm('B') }), docOnly)).toBe(true);
    expect(factReachable(buildArmWorkspace({ ...docOnly, arm: arm('C') }), docOnly)).toBe(true);

    // doc-only-base: in base docs but NOT the front door → arm C loses it.
    const docBase = byCat('doc-only-base');
    expect(factReachable(buildArmWorkspace({ ...docBase, arm: arm('A') }), docBase)).toBe(true);
    expect(factReachable(buildArmWorkspace({ ...docBase, arm: arm('C') }), docBase)).toBe(false);

    // code-evident: in source → reachable in every arm (source is never stripped).
    const codeEvident = byCat('code-evident');
    for (const a of ARMS) {
      expect(factReachable(buildArmWorkspace({ ...codeEvident, arm: a }), codeEvident)).toBe(true);
    }

    // unfixable: nowhere → unreachable in every arm.
    const unfixable = byCat('unfixable');
    for (const a of ARMS) {
      expect(factReachable(buildArmWorkspace({ ...unfixable, arm: a }), unfixable)).toBe(false);
    }
  });
});

describe('parseSweBenchVerified', () => {
  it('parses JSONL, flags instances external, and normalizes test arrays', () => {
    const jsonl = [
      JSON.stringify({
        instance_id: 'astropy__astropy-12907',
        repo: 'astropy/astropy',
        base_commit: 'abc123',
        problem_statement: 'bug',
        FAIL_TO_PASS: '["test_a", "test_b"]',
        PASS_TO_PASS: '["test_c"]',
      }),
      JSON.stringify({
        instance_id: 'django__django-11099',
        repo: 'django/django',
        base_commit: 'def456',
        FAIL_TO_PASS: ['t1'],
        PASS_TO_PASS: ['t2', 't3'],
      }),
    ].join('\n');

    const corpus = parseSweBenchVerified(jsonl, 'unit-test');
    expect(corpus.name).toBe('SWE-bench_Verified');
    expect(corpus.n).toBe(2);
    expect(corpus.instances[0].external).toBe(true);
    expect(corpus.instances[0].gradeSpec.failToPass).toEqual(['test_a', 'test_b']);
    expect(corpus.instances[0].gradeSpec.passToPass).toEqual(['test_c']);
    expect(corpus.instances[1].gradeSpec.failToPass).toEqual(['t1']);
  });

  it('also parses a JSON array form', () => {
    const arr = JSON.stringify([{ instance_id: 'x', FAIL_TO_PASS: ['a'], PASS_TO_PASS: [] }]);
    expect(parseSweBenchVerified(arr).instances[0].id).toBe('x');
  });
});
