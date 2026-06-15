#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

/**
 * 脱敏审计脚本
 *
 * 扫描整个项目目录，查找潜在敏感关键字或模式。
 * 该脚本会忽略自身的敏感词定义，避免“检测规则本身”造成误报。
 */

const TARGET_DIR = process.cwd();
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'test/output'];
const IGNORE_FILES = new Set(['scripts/audit-sanitization.js']);

const SENSITIVE_KEYWORDS = [
  'cempro',
  'approveData',
  'approveTask',
  '/Users/',
  'github_pat',
  'ghp_',
  'sk-',
  'Cookie:',
  'Set-Cookie',
  'token='
];

const SENSITIVE_REGEXES = [
  { name: 'openai_like_key', regex: /sk-[A-Za-z0-9]{20,}/ },
  { name: 'github_classic_token', regex: /ghp_[A-Za-z0-9]{36,}/ },
  { name: 'github_fine_grained_token', regex: /github_pat_[A-Za-z0-9_]+/ },
  {
    name: 'email',
    regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
    allow: (value) => /@(example\.com|example\.test|example\.invalid)$/i.test(value)
  }
];

const warnings = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile()) {
      auditFile(fullPath);
    }
  }
}

function auditFile(filePath) {
  const relative = path.relative(TARGET_DIR, filePath).replaceAll(path.sep, '/');
  if (IGNORE_FILES.has(relative)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    for (const keyword of SENSITIVE_KEYWORDS) {
      if (line.includes(keyword)) {
        warnings.push(`${relative}:${idx + 1} 包含关键字 '${keyword}'`);
      }
    }
    for (const rule of SENSITIVE_REGEXES) {
      const match = line.match(rule.regex);
      if (match && !(rule.allow && rule.allow(match[0]))) {
        warnings.push(`${relative}:${idx + 1} 匹配疑似敏感模式 '${rule.name}' -> ${match[0]}`);
      }
    }
  });
}

walk(TARGET_DIR);

if (warnings.length) {
  console.error('脱敏审计失败：');
  for (const warning of warnings) {
    console.error(`[WARNING] ${warning}`);
  }
  process.exit(1);
}

console.log('脱敏审计通过');
