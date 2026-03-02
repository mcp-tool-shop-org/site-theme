#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatesDir = join(__dirname, '..', 'templates');
const cwd = process.cwd();

// --- Helpers ---

function die(msg) {
  console.error(`\x1b[31mError:\x1b[0m ${msg}`);
  process.exit(1);
}

function info(msg) {
  console.log(`\x1b[36m>\x1b[0m ${msg}`);
}

function deriveBadge(name) {
  return name
    .split('-')
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);
}

function unscopeName(name) {
  return name.replace(/^@[^/]+\//, '');
}

function extractRepoName(repoUrl) {
  if (!repoUrl) return '';
  return repoUrl.replace(/\.git$/, '').split('/').pop() || '';
}

function extractRepoNameFromGit() {
  try {
    const url = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    return extractRepoName(url);
  } catch {
    return '';
  }
}

function readTemplate(templateName, fileName) {
  return readFileSync(join(templatesDir, templateName, fileName), 'utf-8');
}

function applyVars(content, vars) {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}

function writeFile(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf-8');
}

// --- Argument parsing ---

function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0] && !args[0].startsWith('-') ? args[0] : 'init';
  const rest = command === args[0] ? args.slice(1) : args;

  const flags = { template: 'default', json: false, dryRun: false, out: '' };
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--template' && rest[i + 1]) {
      flags.template = rest[++i];
    } else if (rest[i] === '--json') {
      flags.json = true;
    } else if (rest[i] === '--dry-run') {
      flags.dryRun = true;
    } else if (rest[i] === '--out' && rest[i + 1]) {
      flags.out = rest[++i];
    }
  }

  return { command, flags };
}

function getAvailableTemplates() {
  return readdirSync(templatesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const metaPath = join(templatesDir, d.name, 'template.json');
      if (!existsSync(metaPath)) return null;
      try {
        const meta = JSON.parse(readFileSync(metaPath, 'utf-8'));
        return { name: d.name, ...meta };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

// --- Commands ---

function runListTemplates(flags) {
  const templates = getAvailableTemplates();

  if (templates.length === 0) {
    die('No templates found.');
  }

  if (flags.json) {
    console.log(JSON.stringify({ templates }, null, 2));
    return;
  }

  console.log('');
  console.log('Available templates:');
  console.log('');
  for (const t of templates) {
    const tags = t.tags?.length ? ` \x1b[90m[${t.tags.join(', ')}]\x1b[0m` : '';
    console.log(`  \x1b[36m${t.name.padEnd(14)}\x1b[0m ${t.description}${tags}`);
  }
  console.log('');
  console.log('Usage: npx @mcptoolshop/site-theme init --template <name>');
  console.log('');
}

function runInit(flags) {
  const templateName = flags.template;
  const templateDir = join(templatesDir, templateName);
  const dryRun = flags.dryRun;
  const outDir = flags.out ? resolve(cwd, flags.out) : cwd;

  if (!existsSync(templateDir)) {
    const available = getAvailableTemplates().map((t) => t.name).join(', ');
    die(`Template "${templateName}" not found. Available: ${available}`);
  }

  const siteDir = join(outDir, 'site');

  if (!dryRun && existsSync(siteDir)) {
    die('site/ directory already exists. Remove it first or run from a different repo.');
  }

  // Read repo's package.json (from outDir, which is the target project root)
  const pkgPath = join(outDir, 'package.json');
  let pkg = {};
  if (existsSync(pkgPath)) {
    try {
      pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    } catch {
      // ignore parse errors
    }
  }

  const packageName = pkg.name || 'my-package';
  const brandName = unscopeName(packageName);
  const description = pkg.description || 'A tool by mcp-tool-shop';
  const repoUrl = (typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url)
    ?.replace(/\.git$/, '')
    ?.replace(/^git\+/, '') || `https://github.com/mcp-tool-shop-org/${extractRepoNameFromGit() || brandName}`;
  const npmUrl = pkg.private
    ? ''
    : `https://www.npmjs.com/package/${packageName}`;
  const logoBadge = deriveBadge(brandName);
  const basePath = `/${extractRepoName(repoUrl) || brandName}`;

  const vars = {
    PACKAGE_NAME: packageName,
    BRAND_NAME: brandName,
    DESCRIPTION: description,
    REPO_URL: repoUrl,
    NPM_URL: npmUrl,
    LOGO_BADGE: logoBadge,
    BASE_PATH: basePath,
  };

  // Discover .tpl files and map to output paths
  const tplFiles = readdirSync(templateDir).filter((f) => f.endsWith('.tpl'));

  const fileMap = {
    'astro.config.mjs.tpl': 'astro.config.mjs',
    'package.json.tpl': 'package.json',
    'tsconfig.json.tpl': 'tsconfig.json',
    'global.css.tpl': 'src/styles/global.css',
    'index.astro.tpl': 'src/pages/index.astro',
    'site-config.ts.tpl': 'src/site-config.ts',
  };

  // Build the manifest of files to create
  const plan = [];

  for (const tpl of tplFiles) {
    if (tpl === 'pages.yml.tpl') continue;
    const dest = fileMap[tpl];
    if (!dest) continue;
    plan.push({ dest: `site/${dest}`, tpl, target: join(siteDir, dest) });
  }

  if (tplFiles.includes('pages.yml.tpl')) {
    const workflowDest = join(outDir, '.github', 'workflows', 'pages.yml');
    if (!existsSync(workflowDest)) {
      plan.push({ dest: '.github/workflows/pages.yml', tpl: 'pages.yml.tpl', target: workflowDest });
    }
  }

  // --- Dry run: print what would be created and exit ---
  if (dryRun) {
    console.log('');
    console.log(`\x1b[33mDry run\x1b[0m — template: ${templateName}`);
    console.log('');
    console.log('Files that would be created:');
    for (const f of plan) {
      console.log(`  ${f.dest}`);
    }
    const gitignorePath = join(outDir, '.gitignore');
    if (!existsSync(gitignorePath) || !readFileSync(gitignorePath, 'utf-8').includes('site/.astro/')) {
      console.log('  .gitignore (updated)');
    }
    console.log('');
    console.log('Variables:');
    for (const [k, v] of Object.entries(vars)) {
      if (v) console.log(`  ${k}: ${v}`);
    }
    console.log('');
    return;
  }

  // --- Execute: create files ---
  info(`Template: ${templateName}`);
  info(`Package: ${packageName}`);
  info(`Brand: ${brandName} (${logoBadge})`);
  info(`Base path: ${basePath}`);
  if (flags.out) info(`Output: ${outDir}`);
  info('');

  for (const f of plan) {
    let content = applyVars(readTemplate(templateName, f.tpl), vars);
    if (f.dest === 'site/src/site-config.ts' && !npmUrl) {
      content = content.replace(/^\s*npmUrl:.*\r?\n/m, '');
    }
    writeFile(f.target, content);
    info(`Created ${f.dest}`);
  }

  // Update .gitignore with site/.astro/ if needed
  const gitignorePath = join(outDir, '.gitignore');
  if (existsSync(gitignorePath)) {
    const gitignoreContent = readFileSync(gitignorePath, 'utf-8');
    if (!gitignoreContent.includes('site/.astro/')) {
      writeFileSync(gitignorePath, gitignoreContent.trimEnd() + '\nsite/.astro/\n', 'utf-8');
      info('Added site/.astro/ to .gitignore');
    } else {
      info('Skipped .gitignore (site/.astro/ already present)');
    }
  } else {
    writeFileSync(gitignorePath, 'node_modules/\nsite/.astro/\n', 'utf-8');
    info('Created .gitignore with site/.astro/');
  }

  console.log('');
  console.log('\x1b[32mDone!\x1b[0m Site scaffold created.');
  console.log('');
  console.log('Next steps:');
  console.log(`  cd site && npm install`);
  console.log(`  Edit src/site-config.ts with your content`);
  console.log(`  npm run dev`);
  console.log('');
  console.log('To deploy to GitHub Pages:');
  console.log(`  1. Push to GitHub`);
  console.log(`  2. Repo → Settings → Pages → Source → "GitHub Actions"`);
  console.log(`  3. Push any change to site/ to trigger the first deploy`);
  console.log('');
}

// --- Dispatch ---

const { command, flags } = parseArgs(process.argv);

switch (command) {
  case 'init':
    runInit(flags);
    break;
  case 'list-templates':
    runListTemplates(flags);
    break;
  default:
    die(`Unknown command: "${command}". Use "init" or "list-templates".`);
}
