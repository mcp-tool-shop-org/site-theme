/**
 * front-door ablation — test execution.
 *
 * Materializes an arm workspace to a throwaway temp dir and runs the instance's
 * test command, returning the set of test ids that PASSED. This is the part that
 * makes grading real: it runs code, it does not ask a model.
 *
 * Two executors:
 *   - makeNodeExecutor — runs a workspace-provided Node entry that prints
 *     `PASS <id>` / `FAIL <id>` lines. Used by the synthetic corpus and by the
 *     harness self-validation run; works cross-platform with zero deps.
 *   - makeCommandExecutor — runs an arbitrary shell command and parses the same
 *     marker lines. The hook for the REAL SWE-bench path, where the command runs
 *     the instance's pytest selection inside its environment/container. (Not
 *     exercised in this session — see ABLATION.md.)
 */

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';

/** Write a path->content workspace under `root`, creating parent dirs. */
export function materialize(root, files) {
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(root, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content, 'utf-8');
  }
}

/**
 * Read a directory tree back into a POSIX-keyed path->content map (the inverse
 * of materialize). Used by the real external-agent adapter to recover the edited
 * workspace. `ignore` lists relative paths to skip.
 * @param {string} root
 * @param {{ignore?:string[]}} [opts]
 */
export function readWorkspace(root, { ignore = [] } = {}) {
  const skip = new Set(ignore);
  const out = {};
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(abs);
      } else {
        const rel = relative(root, abs).split(sep).join('/');
        if (skip.has(rel)) continue;
        out[rel] = readFileSync(abs, 'utf-8');
      }
    }
  };
  walk(root);
  return out;
}

/** Parse `PASS <id>` / `FAIL <id>` marker lines from captured stdout. */
export function parseMarkers(stdout) {
  const passing = new Set();
  const failing = new Set();
  for (const line of String(stdout).split(/\r?\n/)) {
    const m = /^(PASS|FAIL)\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    if (m[1] === 'PASS') passing.add(m[2]);
    else failing.add(m[2]);
  }
  return { passing, failing };
}

function withTempDir(files, fn) {
  const dir = mkdtempSync(join(tmpdir(), 'fd-ablation-'));
  try {
    materialize(dir, files);
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Executor that runs a Node entry script inside the materialized workspace.
 * @param {{entry?:string, timeoutMs?:number}} [opts] entry defaults to
 *   `run-tests.mjs`; the workspace must provide it.
 * @returns {(workspace:Record<string,string>)=>{passing:Set<string>, failing:Set<string>, stdout:string, code:number}}
 */
export function makeNodeExecutor({ entry = 'run-tests.mjs', timeoutMs = 15000 } = {}) {
  return (workspace) =>
    withTempDir(workspace, (dir) => {
      const res = spawnSync(process.execPath, [entry], {
        cwd: dir,
        encoding: 'utf-8',
        timeout: timeoutMs,
        windowsHide: true,
      });
      const stdout = `${res.stdout ?? ''}\n${res.stderr ?? ''}`;
      const { passing, failing } = parseMarkers(stdout);
      return { passing, failing, stdout, code: res.status ?? -1 };
    });
}

/**
 * Executor that runs an arbitrary command (the real SWE-bench hook). The command
 * is expected to emit `PASS <id>` / `FAIL <id>` lines (a thin pytest reporter
 * shim does this on the real benchmark).
 * @param {{command:string, args?:string[], timeoutMs?:number, env?:object}} opts
 */
export function makeCommandExecutor({ command, args = [], timeoutMs = 600000, env = {} }) {
  if (!command) throw new Error('makeCommandExecutor: a `command` is required.');
  return (workspace) =>
    withTempDir(workspace, (dir) => {
      const res = spawnSync(command, args, {
        cwd: dir,
        encoding: 'utf-8',
        timeout: timeoutMs,
        env: { ...process.env, ...env },
        windowsHide: true,
        shell: false,
      });
      const stdout = `${res.stdout ?? ''}\n${res.stderr ?? ''}`;
      const { passing, failing } = parseMarkers(stdout);
      return { passing, failing, stdout, code: res.status ?? -1 };
    });
}
