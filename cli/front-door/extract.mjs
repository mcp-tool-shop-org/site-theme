/**
 * front-door — claim extraction from front-door markdown.
 *
 * v1 extracts the deterministically-checkable surface: fenced code blocks,
 * inline-code path references, package-manager commands, links, and badges.
 * Every extractor returns 1-based line numbers so findings can point at source.
 */

const FENCE_RE = /^(\s*)(`{3,}|~{3,})(.*)$/;

/** Set of 0-based line indices that fall inside (or are) a fenced code block. */
function fenceLineSet(md) {
  const lines = md.split(/\r?\n/);
  const inside = new Set();
  let open = null;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(FENCE_RE);
    if (m) {
      const marker = m[2][0];
      if (open === null) {
        open = marker;
        inside.add(i);
        continue;
      }
      if (marker === open) {
        inside.add(i);
        open = null;
        continue;
      }
    }
    if (open !== null) inside.add(i);
  }
  return inside;
}

/** Fenced code blocks with language + 1-based start line of the block body. */
export function extractCodeBlocks(md) {
  const lines = md.split(/\r?\n/);
  const blocks = [];
  let open = null;
  let lang = '';
  let buf = [];
  let startLine = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(FENCE_RE);
    if (m && open === null) {
      open = m[2][0];
      lang = m[3].trim().toLowerCase();
      buf = [];
      startLine = i + 2; // first body line is the next line (1-based)
      continue;
    }
    if (m && open !== null && m[2][0] === open) {
      blocks.push({ lang, code: buf.join('\n'), startLine });
      open = null;
      lang = '';
      buf = [];
      continue;
    }
    if (open !== null) buf.push(lines[i]);
  }
  return blocks;
}

const LINK_RE = /(!?)\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g;

/** Markdown links and images, with 1-based line numbers, outside code fences. */
export function extractLinks(md) {
  const lines = md.split(/\r?\n/);
  const fenced = fenceLineSet(md);
  const links = [];
  for (let i = 0; i < lines.length; i++) {
    if (fenced.has(i)) continue;
    LINK_RE.lastIndex = 0;
    for (let m = LINK_RE.exec(lines[i]); m !== null; m = LINK_RE.exec(lines[i])) {
      links.push({ isImage: m[1] === '!', label: m[2], target: m[3], line: i + 1 });
    }
  }
  return links;
}

const INLINE_RE = /`([^`]+)`/g;

/** Backticked inline-code spans outside code fences. */
export function extractInlineCode(md) {
  const lines = md.split(/\r?\n/);
  const fenced = fenceLineSet(md);
  const codes = [];
  for (let i = 0; i < lines.length; i++) {
    if (fenced.has(i)) continue;
    INLINE_RE.lastIndex = 0;
    for (let m = INLINE_RE.exec(lines[i]); m !== null; m = INLINE_RE.exec(lines[i])) {
      codes.push({ text: m[1].trim(), line: i + 1 });
    }
  }
  return codes;
}

const CODE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|mts|cts|json|md|mdx|astro|css|scss|html|yml|yaml|toml|py|rs|go|rb|sh|sql)$/i;
const DIR_PREFIX =
  /^(\.{1,2}\/|src\/|cli\/|tests?\/|docs\/|lib\/|app\/|packages\/|scripts\/|bin\/|types\/|components\/|styles\/|templates\/|public\/|examples?\/)/;

/**
 * Conservative heuristic: does this inline-code token denote a repo path?
 * Deliberately tight to avoid flagging npm package specifiers (e.g.
 * "@astrojs/starlight") or prose. A token qualifies if it starts with a known
 * repo directory prefix, or carries a code-file extension.
 */
export function looksLikePath(token) {
  if (!token) return false;
  const t = token.trim();
  if (!t || /\s/.test(t)) return false;
  if (/^(https?:|mailto:|tel:|#|\$)/i.test(t)) return false;
  if (t.startsWith('@')) return false; // scoped npm package
  if (/[<>{}*?|"'`]/.test(t)) return false; // placeholders / globs / quotes
  if (DIR_PREFIX.test(t)) return true;
  const bare = t.replace(/^\.\//, '');
  // A token only counts as a path claim if it carries a directory separator. A
  // bare filename (`global.css`, `llms.txt`, `package.json`) is almost always
  // descriptive prose — front-door docs mention these names constantly — not a
  // claim that the file exists at the repo root.
  if (bare.includes('/') && CODE_EXT.test(bare) && /^[\w./-]+$/.test(bare)) return true;
  return false;
}

/** Inline-code tokens that look like repo paths. */
export function extractPathRefs(inlineCodes) {
  return inlineCodes.filter((c) => looksLikePath(c.text));
}

const PM_RE = /^(npm|pnpm|yarn)\s+(?:(run|run-script)\s+)?([a-z0-9:_-]+)/i;

/**
 * Package-manager invocations found in shell-ish code blocks.
 * `explicitRun` is true for `<pm> run <script>` (the only form v1 checks against
 * package.json, to keep false positives near zero).
 */
export function extractCommands(blocks) {
  const cmds = [];
  for (const b of blocks) {
    if (b.lang && !/^(bash|sh|shell|console|zsh|shellscript)$/.test(b.lang)) continue;
    const lines = b.code.split(/\r?\n/);
    let cdContext = false; // a `cd <subdir>` means later commands run elsewhere
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/^[\s$>]+/, '').trim();
      if (/^cd\s+\S/.test(line)) cdContext = true;
      const m = line.match(PM_RE);
      if (!m) continue;
      cmds.push({
        tool: m[1].toLowerCase(),
        explicitRun: Boolean(m[2]),
        script: m[3].toLowerCase(),
        line: b.startLine + i,
        cdContext,
      });
    }
  }
  return cmds;
}

const BADGE_HOST_RE =
  /(img\.shields\.io|shields\.io|badge\.fury\.io|badgen\.net|codecov\.io|coveralls\.io|circleci\.com|travis-ci)/i;
const STATUS_BADGE_RE = /(build|ci|tests?|coverage|passing|workflow|action|lint|pipeline|status)/i;

/** Is this image target a shields-style status/info badge? */
export function isBadge(target) {
  if (!target) return false;
  if (BADGE_HOST_RE.test(target)) return true;
  if (/\/badge[/.]/i.test(target)) return true;
  if (/badge\.svg($|\?)/i.test(target)) return true;
  return false;
}

/** 'status' badges assert a verifiable run result; 'decorative' ones don't. */
export function classifyBadge(label, target) {
  return STATUS_BADGE_RE.test(`${label} ${target}`) ? 'status' : 'decorative';
}

/** Image links that are badges, tagged status|decorative. */
export function extractBadges(links) {
  return links
    .filter((l) => l.isImage && isBadge(l.target))
    .map((l) => ({ ...l, kind: classifyBadge(l.label, l.target) }));
}

/**
 * Substantial lines (>= minLen chars, normalized) present in BOTH texts.
 * Used to detect AGENTS.md duplicating README content (pure agent overhead).
 */
export function findDuplication(readme, agents, minLen = 40) {
  const norm = (s) => s.trim().replace(/\s+/g, ' ').toLowerCase();
  const readmeLines = new Set(
    readme
      .split(/\r?\n/)
      .map(norm)
      .filter((l) => l.length >= minLen),
  );
  const dupes = [];
  const seen = new Set();
  const lines = agents.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const n = norm(lines[i]);
    if (n.length >= minLen && readmeLines.has(n) && !seen.has(n)) {
      seen.add(n);
      dupes.push({ line: i + 1, text: lines[i].trim() });
    }
  }
  return dupes;
}
