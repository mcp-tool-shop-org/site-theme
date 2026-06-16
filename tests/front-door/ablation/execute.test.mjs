import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  makeNodeExecutor,
  materialize,
  parseMarkers,
  readWorkspace,
} from '../../../cli/front-door/ablation/execute.mjs';

describe('parseMarkers', () => {
  it('separates PASS and FAIL marker lines, ignoring noise', () => {
    const { passing, failing } = parseMarkers('PASS a\nsome log\nFAIL b\nPASS c\n');
    expect([...passing].sort()).toEqual(['a', 'c']);
    expect([...failing]).toEqual(['b']);
  });
});

describe('materialize + readWorkspace round-trip', () => {
  it('writes and reads a nested workspace, honoring the ignore list', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fd-rt-'));
    try {
      materialize(dir, { 'src/a.mjs': 'a', 'docs/b.md': 'b', '.skip': 'x' });
      const out = readWorkspace(dir, { ignore: ['.skip'] });
      expect(out['src/a.mjs']).toBe('a');
      expect(out['docs/b.md']).toBe('b');
      expect(out['.skip']).toBeUndefined();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('makeNodeExecutor (real code execution)', () => {
  it('runs a workspace test entry and collects passing ids', () => {
    const exec = makeNodeExecutor();
    const workspace = {
      'src/widget.mjs': "export function answer() { return 'OK'; }\n",
      'run-tests.mjs': [
        "import { answer } from './src/widget.mjs';",
        "console.log(answer() === 'OK' ? 'PASS f2p:value' : 'FAIL f2p:value');",
        "console.log('PASS p2p:callable');",
      ].join('\n'),
    };
    const { passing } = exec(workspace);
    expect(passing.has('f2p:value')).toBe(true);
    expect(passing.has('p2p:callable')).toBe(true);
  });

  it('reports an unresolved fix (no PASS for the failing test)', () => {
    const exec = makeNodeExecutor();
    const workspace = {
      'src/widget.mjs': "export function answer() { return 'WRONG'; }\n",
      'run-tests.mjs': [
        "import { answer } from './src/widget.mjs';",
        "console.log(answer() === 'OK' ? 'PASS f2p:value' : 'FAIL f2p:value');",
      ].join('\n'),
    };
    expect(exec(workspace).passing.has('f2p:value')).toBe(false);
  });
});
