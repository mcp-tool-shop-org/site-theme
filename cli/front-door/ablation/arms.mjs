/**
 * front-door ablation — arm construction.
 *
 * Three arms, identical agent/model/pin; only the front door varies:
 *   A — repo as-is (baseline)
 *   B — repo + front-door (the real-world delta)
 *   C — docs-stripped repo + front-door (isolates the front door's MARGINAL
 *       contribution: context that just duplicates existing docs is overhead,
 *       so strip the docs and see if the front door alone still carries it)
 *
 * A "workspace" here is a plain map of POSIX relative path -> file content. All
 * transforms are pure on that map, so arm construction is trivially testable and
 * never touches the real filesystem (the runner materializes to a temp dir only
 * when it actually executes tests).
 */

export const ARMS = [
  { id: 'A', label: 'repo as-is', frontDoor: false, stripDocs: false },
  { id: 'B', label: 'repo + front-door', frontDoor: true, stripDocs: false },
  { id: 'C', label: 'docs-stripped + front-door', frontDoor: true, stripDocs: true },
];

// What "docs" means for arm C: human-facing prose the front door would be
// duplicating. Source and tests are NEVER stripped — that would change the task,
// not the front door's contribution.
export const DEFAULT_DOC_GLOBS = ['**/*.md', '**/*.mdx', '**/*.rst', 'docs/**', 'doc/**', 'documentation/**'];

/** Compile a tiny subset of glob (`**`, `*`, literal) to an anchored RegExp. */
function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const ch = glob[i];
    if (ch === '*') {
      if (glob[i + 1] === '*') {
        // `**/` matches any number of path segments (including none).
        if (glob[i + 2] === '/') {
          re += '(?:.*/)?';
          i += 2;
        } else {
          re += '.*';
          i += 1;
        }
      } else {
        re += '[^/]*';
      }
    } else if (/[.^$|+(){}[\]\\]/.test(ch)) {
      re += `\\${ch}`;
    } else {
      re += ch;
    }
  }
  return new RegExp(`^${re}$`);
}

/** True if `path` matches any of the globs. */
export function matchesAny(path, globs) {
  return globs.some((g) => globToRegExp(g).test(path));
}

/**
 * Remove documentation files from a workspace (pure; returns a new map).
 * @param {Record<string,string>} files
 * @param {string[]} [docGlobs]
 */
export function stripDocs(files, docGlobs = DEFAULT_DOC_GLOBS) {
  const out = {};
  for (const [path, content] of Object.entries(files)) {
    if (!matchesAny(path, docGlobs)) out[path] = content;
  }
  return out;
}

/** Overlay the front-door bundle on top of a workspace (front door wins). */
function overlay(files, frontDoor) {
  return { ...files, ...frontDoor };
}

/**
 * Build the workspace the agent sees for one arm.
 * @param {{baseFiles:Record<string,string>, frontDoor:Record<string,string>,
 *   arm:{frontDoor:boolean, stripDocs:boolean}, docGlobs?:string[]}} opts
 * @returns {Record<string,string>}
 */
export function buildArmWorkspace({ baseFiles, frontDoor, arm, docGlobs = DEFAULT_DOC_GLOBS }) {
  let files = { ...baseFiles };
  if (arm.stripDocs) files = stripDocs(files, docGlobs);
  if (arm.frontDoor) files = overlay(files, frontDoor ?? {});
  return files;
}
