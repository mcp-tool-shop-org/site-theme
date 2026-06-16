/**
 * front-door ablation — corpora.
 *
 * Two sources of instances:
 *
 *   - syntheticCorpus — a self-contained, execution-graded micro-benchmark used
 *     by the harness self-validation run. Each instance is a tiny repo with a
 *     real bug (a placeholder the agent must replace with a fact) and a HIDDEN
 *     test that checks the fix by running code. The fact is planted in different
 *     places per CATEGORY, so the three arms genuinely differ — but the agent
 *     never sees the hidden test, exactly like SWE-bench. This is machinery
 *     proof, not evidence about real front doors (see ABLATION.md).
 *
 *   - loadSweBenchVerified — the real path: parse SWE-bench Verified instance
 *     metadata (Jimenez et al., arXiv:2310.06770) into the same shape. Producing
 *     each instance's repo files requires a git checkout at base_commit and the
 *     per-instance environment/Docker image; that, the external agent, and the
 *     model are NOT bundled, so these instances are flagged `external` and the
 *     in-process Node executor refuses them. See ABLATION.md for the full
 *     real-run contract.
 *
 * The fact convention: docs/front-door that carry the fact contain a line
 * `canon-answer: <KEY>`; the agent's keyPattern captures <KEY>; the hidden test
 * checks that the widget returns <KEY>. Source/tests are never stripped by arm C
 * (that would change the task, not the front door).
 */

const KEY_PATTERN = 'canon-answer:\\s*([A-Za-z0-9_-]+)';
const PLACEHOLDER = 'PLACEHOLDER_ANSWER';

// Category mix (proportions sum to 1). Chosen to exercise every arm contrast:
// gains, redundant-overhead, strip-risk, cost-only, and a never-solvable
// control. See ABLATION.md for what each one demonstrates.
const CATEGORIES = [
  { name: 'doc-only', weight: 0.24 }, // fact only in the front door -> B/C win, A fails
  { name: 'doc-and-frontdoor', weight: 0.24 }, // fact in base docs AND front door -> C isolates contribution
  { name: 'doc-only-base', weight: 0.18 }, // fact only in base docs -> C loses it (strip risk)
  { name: 'code-evident', weight: 0.22 }, // fact in code -> all pass; front door is pure cost (Gloaguen)
  { name: 'unfixable', weight: 0.12 }, // fact nowhere -> all fail (false-positive guard)
];

/** Deterministic, collision-resistant key from an index (no RNG needed). */
function keyFor(i) {
  const h = (Math.imul(i + 1, 2654435761) >>> 0).toString(36).toUpperCase();
  return `K${h}`;
}

function widgetSource() {
  return `export function answer() {\n  return '${PLACEHOLDER}';\n}\n`;
}

// The HIDDEN oracle: fail-to-pass checks the value; pass-to-pass guards that the
// function stays callable and string-returning. Overlaid only at execution.
function hiddenTest(key) {
  return [
    "import { answer } from './src/widget.mjs';",
    'const v = answer();',
    "console.log(typeof v === 'string' ? 'PASS p2p:callable' : 'FAIL p2p:callable');",
    `console.log(v === '${key}' ? 'PASS f2p:value' : 'FAIL f2p:value');`,
    '',
  ].join('\n');
}

const GENERIC_README = '# widget\n\nA tiny library exposing `answer()`.\n';
const GENERIC_AGENTS = '# AGENTS\n\nRun `node run-tests.mjs`. Keep edits scoped to `src/`.\n';

/** Build one synthetic instance for a category. */
function makeInstance(i, category) {
  const key = keyFor(i);
  const fact = `canon-answer: ${key}`;
  const id = `synthetic-${String(i).padStart(3, '0')}-${category}`;

  const baseFiles = { 'src/widget.mjs': widgetSource() };
  let frontDoor = { 'AGENTS.md': GENERIC_AGENTS };

  switch (category) {
    case 'doc-only':
      baseFiles['README.md'] = GENERIC_README; // docs exist but don't carry the fact
      frontDoor = { 'AGENTS.md': `${GENERIC_AGENTS}\nThe canonical value: ${fact}\n` };
      break;
    case 'doc-and-frontdoor':
      baseFiles['README.md'] = `${GENERIC_README}\nThe canonical value: ${fact}\n`;
      baseFiles['docs/guide.md'] = `# Guide\n\nSee ${fact}.\n`;
      frontDoor = { 'AGENTS.md': `${GENERIC_AGENTS}\nThe canonical value: ${fact}\n` };
      break;
    case 'doc-only-base':
      baseFiles['README.md'] = `${GENERIC_README}\nThe canonical value: ${fact}\n`;
      frontDoor = { 'AGENTS.md': GENERIC_AGENTS }; // front door does NOT carry the fact
      break;
    case 'code-evident':
      baseFiles['README.md'] = GENERIC_README;
      baseFiles['src/notes.mjs'] = `// Implementation note — ${fact}\nexport const NOTE = 1;\n`;
      frontDoor = { 'AGENTS.md': GENERIC_AGENTS };
      break;
    case 'unfixable':
      baseFiles['README.md'] = GENERIC_README; // fact planted nowhere
      frontDoor = { 'AGENTS.md': GENERIC_AGENTS };
      break;
    default:
      throw new Error(`unknown category ${category}`);
  }

  return {
    id,
    category,
    external: false,
    baseFiles,
    frontDoor,
    keyPattern: KEY_PATTERN,
    fix: { file: 'src/widget.mjs', placeholder: PLACEHOLDER, key },
    testFiles: { 'run-tests.mjs': hiddenTest(key) },
    gradeSpec: { failToPass: ['f2p:value'], passToPass: ['p2p:callable'] },
    task: { problemStatement: `answer() returns a placeholder; make it return the canonical value.` },
  };
}

/**
 * Generate `n` synthetic instances with a fixed category mix. Deterministic:
 * the same n yields the same corpus (no RNG), so a receipt is replayable.
 * @param {{n?:number}} [opts]
 */
export function syntheticCorpus({ n = 60 } = {}) {
  // Largest-remainder allocation of n across categories by weight.
  const raw = CATEGORIES.map((c) => ({ name: c.name, exact: c.weight * n }));
  const counts = raw.map((r) => ({ name: r.name, count: Math.floor(r.exact), frac: r.exact - Math.floor(r.exact) }));
  let assigned = counts.reduce((s, c) => s + c.count, 0);
  for (const c of [...counts].sort((a, b) => b.frac - a.frac)) {
    if (assigned >= n) break;
    c.count += 1;
    assigned += 1;
  }

  const instances = [];
  let i = 0;
  for (const c of counts) {
    for (let k = 0; k < c.count; k++) instances.push(makeInstance(i++, c.name));
  }
  return { name: 'synthetic-frontdoor-microbench', version: 1, n: instances.length, instances };
}

function asArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [v];
    } catch {
      return v.split(/\s+/).filter(Boolean);
    }
  }
  return [];
}

/**
 * Parse SWE-bench Verified instance records (a JSON or JSONL string) into the
 * harness instance shape. baseFiles is intentionally absent — materializing the
 * repo needs a checkout + the instance environment, handled on the real path by
 * the command adapter/executor, not here. Instances are flagged `external` so
 * the in-process Node executor refuses to fake-run them.
 * @param {string} text  JSON array or JSONL of SWE-bench records
 * @param {string} [providedBy]  whoever supplied the data, for the receipt
 */
export function parseSweBenchVerified(text, providedBy = 'caller') {
  const records = [];
  const trimmed = text.trim();
  if (trimmed.startsWith('[')) {
    records.push(...JSON.parse(trimmed));
  } else {
    for (const line of trimmed.split(/\r?\n/)) {
      if (line.trim()) records.push(JSON.parse(line));
    }
  }

  const instances = records.map((r) => ({
    id: r.instance_id ?? r.id,
    category: 'swebench-verified',
    external: true,
    repo: r.repo,
    baseCommit: r.base_commit,
    environmentSetupCommit: r.environment_setup_commit,
    testPatch: r.test_patch,
    gradeSpec: {
      failToPass: asArray(r.FAIL_TO_PASS ?? r.fail_to_pass),
      passToPass: asArray(r.PASS_TO_PASS ?? r.pass_to_pass),
    },
    task: { problemStatement: r.problem_statement ?? '', hints: r.hints_text ?? '' },
  }));

  return { name: 'SWE-bench_Verified', version: 1, providedBy, n: instances.length, instances };
}
