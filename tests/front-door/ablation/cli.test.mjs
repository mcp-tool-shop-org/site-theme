import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..', '..', '..');
const CLI = join(ROOT, 'cli', 'init.mjs');

function run(args) {
  return execFileSync(process.execPath, [CLI, 'front-door', ...args], {
    cwd: ROOT,
    encoding: 'utf-8',
    timeout: 90000,
  });
}

describe('front-door ablation CLI (real end-to-end run)', () => {
  it('runs the synthetic self-validation and emits a receipt with real deltas', () => {
    const receipt = JSON.parse(
      run(['ablation', 'run', '--instances', '15', '--seed', '7', '--json', '--stamped-at', 'TEST']),
    );
    expect(receipt.tool).toBe('front-door');
    expect(receipt.kind).toBe('harness-self-validation');
    expect(receipt.measuresFrontDoorEffect).toBe(false);
    expect(receipt.grading).toMatch(/execution/);
    expect(receipt.arms).toHaveLength(3);
    expect(receipt.corpus.n).toBe(15);
    // Real execution-graded outcome: arm B resolves at least as many as arm A.
    const a = receipt.arms.find((x) => x.id === 'A').resolved;
    const b = receipt.arms.find((x) => x.id === 'B').resolved;
    expect(b).toBeGreaterThanOrEqual(a);
  });

  it('lists ablation in --help', () => {
    expect(run(['--help'])).toMatch(/ablation/);
  });

  it('refuses the real SWE-bench path and prints the contract (exit 2)', () => {
    let status = 0;
    let stdout = '';
    try {
      run(['ablation', 'run', '--corpus', 'swebench']);
    } catch (err) {
      status = err.status;
      stdout = String(err.stdout ?? '');
    }
    expect(status).toBe(2);
    expect(stdout).toMatch(/SWE-bench/);
    expect(stdout).toMatch(/ABLATION\.md/);
  });
});
