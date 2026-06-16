/**
 * front-door ablation — agent adapters.
 *
 * An adapter is `(workspace, instance, pin) => { workspace, cost }`: it sees the
 * files for one arm, edits them to attempt the fix, and reports cost
 * (steps + tokens). The runner grades the edited workspace by execution.
 *
 * Two adapters:
 *
 *   - lookupAgent — a DETERMINISTIC reference agent for the harness
 *     self-validation run. It does NOT know which arm it is; it reads the files
 *     it was given (front-door files first, then README, then the rest), and the
 *     fix it needs is a fact (a captured value) that may or may not be reachable
 *     in those files. So whether it succeeds, and how much it spends doing so,
 *     EMERGES from the arm's file set — it is never hard-coded per arm. Token
 *     cost is a transparent chars/4 proxy for bytes read. This makes the
 *     self-validation numbers a real output of the pipeline, but they are
 *     properties of a TOY agent on a SYNTHETIC corpus — not evidence about real
 *     front doors. See ABLATION.md.
 *
 *   - commandAgent — the REAL hook: shells out to an external coding agent
 *     (e.g. mini-swe-agent) bound to the pin, lets it edit a checkout in place,
 *     and reads back the edited tree + a cost file. Not exercised in this
 *     session (no external agent / API here); fails loud if misconfigured.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { materialize, readWorkspace } from './execute.mjs';

// Agents read the front door first, then the README, then everything else —
// which is exactly why a redundant front door can ADD cost (it gets read before
// the agent discovers the fact was in the README all along).
const READ_PRIORITY = ['AGENTS.md', 'llms.txt', 'CLAUDE.md', 'README.md'];

function readRank(path) {
  const i = READ_PRIORITY.indexOf(path);
  return i === -1 ? READ_PRIORITY.length : i;
}

/** chars/4 token proxy — documented and deliberately simple. */
function toks(s) {
  return Math.ceil(s.length / 4);
}

function emptyCost() {
  return { steps: 0, tokensIn: 0, tokensOut: 0, tokensTotal: 0 };
}

/**
 * Deterministic reference agent. Reads the arm's files in priority order until
 * it finds the fact (a `keyPattern` match whose capture group is the value),
 * then applies the edit. Cost emerges from how much it had to read.
 * @returns {{workspace:Record<string,string>, cost:object, found:boolean,
 *   learned:string|null, filesRead:number}}
 */
export function lookupAgent(workspace, instance) {
  const { fix, keyPattern } = instance;
  const pattern = new RegExp(keyPattern);
  const paths = Object.keys(workspace).sort((a, b) => {
    const d = readRank(a) - readRank(b);
    return d !== 0 ? d : a < b ? -1 : 1;
  });

  const cost = emptyCost();
  let learned = null;
  for (const path of paths) {
    const content = workspace[path];
    cost.steps += 1;
    cost.tokensIn += toks(content);
    const m = pattern.exec(content);
    if (m) {
      learned = m[1] ?? m[0];
      break;
    }
  }

  const filesRead = cost.steps;
  let edited = workspace;
  let found = false;
  if (learned !== null && fix && typeof workspace[fix.file] === 'string') {
    const before = workspace[fix.file];
    const after = before.replace(fix.placeholder, learned);
    if (after !== before) {
      edited = { ...workspace, [fix.file]: after };
      cost.steps += 1; // the edit step
      cost.tokensOut += toks(`${fix.placeholder}->${learned}`);
      found = true;
    }
  }

  cost.tokensTotal = cost.tokensIn + cost.tokensOut;
  return { workspace: edited, cost, found, learned, filesRead };
}

/**
 * Real external-agent adapter. Materializes the workspace, hands it to the
 * external agent (which edits in place), reads the tree back, and parses a cost
 * file the agent is expected to drop. The contract is documented in ABLATION.md.
 * @param {{command:string, args?:string[], costFile?:string, timeoutMs?:number, env?:object}} opts
 */
export function makeCommandAgent({
  command,
  args = [],
  costFile = '.front-door-cost.json',
  timeoutMs = 1800000,
  env = {},
}) {
  if (!command) throw new Error('makeCommandAgent: a `command` is required.');
  return (workspace, instance, pin) => {
    const dir = mkdtempSync(join(tmpdir(), 'fd-agent-'));
    try {
      materialize(dir, workspace);
      writeFileSync(join(dir, '.front-door-pin.json'), JSON.stringify(pin, null, 2), 'utf-8');
      writeFileSync(join(dir, '.front-door-task.json'), JSON.stringify(instance.task ?? {}, null, 2), 'utf-8');
      const res = spawnSync(command, args, {
        cwd: dir,
        encoding: 'utf-8',
        timeout: timeoutMs,
        env: { ...process.env, ...env },
        windowsHide: true,
        shell: false,
      });
      if (res.status !== 0) {
        throw new Error(`commandAgent: "${command}" exited ${res.status}: ${(res.stderr ?? '').slice(0, 500)}`);
      }
      const edited = readWorkspace(dir, { ignore: [costFile, '.front-door-pin.json', '.front-door-task.json'] });
      let cost = emptyCost();
      if (typeof edited[costFile] === 'string') {
        const parsed = JSON.parse(edited[costFile]);
        cost = {
          steps: parsed.steps ?? 0,
          tokensIn: parsed.tokensIn ?? 0,
          tokensOut: parsed.tokensOut ?? 0,
          tokensTotal: (parsed.tokensIn ?? 0) + (parsed.tokensOut ?? 0),
        };
      }
      return { workspace: edited, cost, found: null };
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };
}
