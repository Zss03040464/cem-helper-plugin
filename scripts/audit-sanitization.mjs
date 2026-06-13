import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { findSanitizationIssues } from '../src/sanitizer.mjs';

const ROOT = process.cwd();
const TEXT_EXTENSIONS = new Set(['.js', '.mjs', '.json', '.md', '.html', '.css', '.txt', '.example']);
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'coverage']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (TEXT_EXTENSIONS.has(path.extname(entry.name)) || entry.name === '.gitignore') {
      files.push(fullPath);
    }
  }
  return files;
}

const files = await walk(ROOT);
const issues = [];
for (const file of files) {
  const relative = path.relative(ROOT, file);
  const content = await readFile(file, 'utf8');
  issues.push(...findSanitizationIssues(relative, content));
}

if (issues.length) {
  console.error('Sanitization audit failed. Remove private or sensitive content before publishing.');
  console.error(JSON.stringify(issues, null, 2));
  process.exit(1);
}

console.log(`Sanitization audit passed for ${files.length} text files.`);
