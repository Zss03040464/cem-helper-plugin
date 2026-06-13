const SECRET_PATTERNS = [
  /ghp_[A-Za-z0-9_]{20,}/g,
  /github_pat_[A-Za-z0-9_]{20,}/g,
  /sk-[A-Za-z0-9_-]{20,}/g,
  /AIza[0-9A-Za-z_-]{20,}/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  /Cookie\s*:/gi,
  /Set-Cookie\s*:/gi,
  /password\s*[:=]/gi,
  /token\s*[:=]/gi,
  /secret\s*[:=]/gi
];

const PRIVATE_CONTEXT_PATTERNS = [
  /cempro/gi,
  /approveData/gi,
  /approveTask/gi,
  /CEM\s*SD/gi,
  /\/Users\/vivian\//g,
  /D:\\AI_Workspace/gi,
  /对话\.md/g,
  /用户指令清单\.md/g,
  /AGENT_HANDOFF\.md/g,
  /logs\/agent_sessions/g
];

export function redactSensitiveText(input = '') {
  let output = String(input);
  for (const pattern of [...SECRET_PATTERNS, ...PRIVATE_CONTEXT_PATTERNS]) {
    output = output.replace(pattern, '[REDACTED]');
  }
  output = output.replace(/https?:\/\/[^\s)]+/g, '[URL_REDACTED]');
  return output;
}

export function findSanitizationIssues(path, content) {
  const issues = [];
  const text = String(content);
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) issues.push({ path, type: 'secret-pattern', pattern: pattern.toString() });
    pattern.lastIndex = 0;
  }
  for (const pattern of PRIVATE_CONTEXT_PATTERNS) {
    if (pattern.test(text)) issues.push({ path, type: 'private-context-pattern', pattern: pattern.toString() });
    pattern.lastIndex = 0;
  }
  return issues;
}
