import { describe, expect, it } from 'vitest';
import { lookupAgent } from '../../../cli/front-door/ablation/agent.mjs';
import { ARMS, buildArmWorkspace } from '../../../cli/front-door/ablation/arms.mjs';
import { syntheticCorpus } from '../../../cli/front-door/ablation/corpus.mjs';

const arm = (id) => ARMS.find((a) => a.id === id);
const corpus = syntheticCorpus({ n: 50 });
const byCat = (c) => corpus.instances.find((i) => i.category === c);

function run(instance, armId) {
  const ws = buildArmWorkspace({ baseFiles: instance.baseFiles, frontDoor: instance.frontDoor, arm: arm(armId) });
  return lookupAgent(ws, instance);
}

describe('lookupAgent (emergent success + cost, no per-arm hard-coding)', () => {
  it('learns the fact from whatever files the arm exposes and applies the edit', () => {
    const inst = byCat('doc-only');
    const a = run(inst, 'A');
    const b = run(inst, 'B');
    // doc-only: arm A cannot find the fact; arm B can (front door carries it).
    expect(a.found).toBe(false);
    expect(b.found).toBe(true);
    expect(b.learned).toBe(inst.fix.key);
    expect(b.workspace['src/widget.mjs']).toContain(inst.fix.key);
  });

  it('never receives the answer directly — it reads it from the docs', () => {
    // The fix file the agent starts from contains only the placeholder.
    const inst = byCat('doc-and-frontdoor');
    expect(inst.baseFiles['src/widget.mjs']).toContain('PLACEHOLDER_ANSWER');
    const r = run(inst, 'B');
    expect(r.found).toBe(true);
    expect(r.workspace['src/widget.mjs']).not.toContain('PLACEHOLDER_ANSWER');
  });

  it('a redundant front door ADDS read cost (Gloaguen-style overhead)', () => {
    // code-evident: fact is in source, reachable in every arm. The front door
    // in arm B is read first and carries nothing, so B reads strictly more.
    const inst = byCat('code-evident');
    const a = run(inst, 'A');
    const b = run(inst, 'B');
    expect(a.found).toBe(true);
    expect(b.found).toBe(true);
    expect(b.cost.tokensIn).toBeGreaterThan(a.cost.tokensIn);
  });

  it('fails cleanly when the fact is nowhere', () => {
    const inst = byCat('unfixable');
    for (const id of ['A', 'B', 'C']) {
      const r = run(inst, id);
      expect(r.found).toBe(false);
      expect(r.workspace['src/widget.mjs']).toContain('PLACEHOLDER_ANSWER');
    }
  });

  it('is deterministic', () => {
    const inst = byCat('doc-and-frontdoor');
    expect(JSON.stringify(run(inst, 'B').cost)).toBe(JSON.stringify(run(inst, 'B').cost));
  });
});
