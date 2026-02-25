#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
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
  // "registry-stats" → "RS", "mcpt" → "M", "tool-compass" → "TC"
  return name
    .split('-')
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);
}

function unscopeName(name) {
  // "@mcptoolshop/registry-stats" → "registry-stats"
  return name.replace(/^@[^/]+\//, '');
}

function extractRepoName(repoUrl) {
  // "https://github.com/mcp-tool-shop-org/registry-stats.git" → "registry-stats"
  if (!repoUrl) return '';
  return repoUrl.replace(/\.git$/, '').split('/').pop() || '';
}

function extractRepoNameFromGit() {
  // Read the case-correct repo name from git remote (most reliable source)
  try {
    const url = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    return extractRepoName(url);
  } catch {
    return '';
  }
}

function readTemplate(name) {
  return readFileSync(join(templatesDir, name), 'utf-8');
}

function applyVars(content, vars) {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}

function writeFile(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf-8');
}

// --- Main ---

function main() {
  const siteDir = join(cwd, 'site');

  if (existsSync(siteDir)) {
    die('site/ directory already exists. Remove it first or run from a different repo.');
  }

  // Read repo's package.json
  const pkgPath = join(cwd, 'package.json');
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

  info(`Package: ${packageName}`);
  info(`Brand: ${brandName} (${logoBadge})`);
  info(`Base path: ${basePath}`);
  info('');

  // Create site/ files
  const files = [
    ['astro.config.mjs', 'astro.config.mjs.tpl'],
    ['package.json', 'package.json.tpl'],
    ['tsconfig.json', 'tsconfig.json.tpl'],
    ['src/styles/global.css', 'global.css.tpl'],
    ['src/pages/index.astro', 'index.astro.tpl'],
    ['src/site-config.ts', 'site-config.ts.tpl'],
  ];

  for (const [dest, tpl] of files) {
    let content = applyVars(readTemplate(tpl), vars);
    // Strip npmUrl line when package is private (no npm page)
    if (dest === 'src/site-config.ts' && !npmUrl) {
      content = content.replace(/^\s*npmUrl:.*\r?\n/m, '');
    }
    writeFile(join(siteDir, dest), content);
    info(`Created site/${dest}`);
  }

  // Create .github/workflows/pages.yml
  const workflowDir = join(cwd, '.github', 'workflows');
  const workflowDest = join(workflowDir, 'pages.yml');
  if (!existsSync(workflowDest)) {
    const content = applyVars(readTemplate('pages.yml.tpl'), vars);
    writeFile(workflowDest, content);
    info('Created .github/workflows/pages.yml');
  } else {
    info('Skipped .github/workflows/pages.yml (already exists)');
  }

  // Update .gitignore with site/.astro/ if needed
  const gitignorePath = join(cwd, '.gitignore');
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

main();
