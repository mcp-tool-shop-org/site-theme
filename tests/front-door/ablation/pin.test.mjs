import { describe, expect, it } from 'vitest';
import { assertArmsSharePin, definePin, pinHash } from '../../../cli/front-door/ablation/pin.mjs';

describe('definePin (PIN_PER_STEP + EXTERNAL_VERIFIER)', () => {
  it('produces a frozen, hashed spec', () => {
    const pin = definePin();
    expect(typeof pin.hash).toBe('string');
    expect(pin.hash).toHaveLength(16);
    expect(Object.isFrozen(pin)).toBe(true);
  });

  it('is deterministic and order-independent', () => {
    expect(definePin().hash).toBe(definePin().hash);
    expect(pinHash({ a: 1, b: 2 })).toBe(pinHash({ b: 2, a: 1 }));
  });

  it('changes hash when the generator changes', () => {
    const a = definePin();
    const b = definePin({ generator: { model: 'claude-opus-4-8', family: 'anthropic' } });
    expect(a.hash).not.toBe(b.hash);
  });

  it('refuses a same-family judge (EXTERNAL_VERIFIER)', () => {
    expect(() => definePin({ judge: { family: 'anthropic' } })).toThrow(/EXTERNAL_VERIFIER/);
  });

  it('refuses a non-execution grader (no LLM grade of resolution)', () => {
    expect(() => definePin({ grading: { method: 'llm-judge' } })).toThrow(/execution/);
  });
});

describe('assertArmsSharePin (ANDON)', () => {
  it('passes when every record shares the run pin', () => {
    const records = [
      { arm: 'A', instanceId: 'i1', pinHash: 'abc' },
      { arm: 'B', instanceId: 'i1', pinHash: 'abc' },
    ];
    expect(() => assertArmsSharePin('abc', records)).not.toThrow();
  });

  it('halts when an arm ran under a different pin', () => {
    const records = [
      { arm: 'A', instanceId: 'i1', pinHash: 'abc' },
      { arm: 'B', instanceId: 'i1', pinHash: 'xyz' },
    ];
    expect(() => assertArmsSharePin('abc', records)).toThrow(/ANDON/);
  });
});
