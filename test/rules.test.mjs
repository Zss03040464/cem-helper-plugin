import test from 'node:test';
import assert from 'node:assert/strict';
import { inferGenericFormCandidates, splitCandidatesByConfidence } from '../src/rules.mjs';
import { redactSensitiveText, findSanitizationIssues } from '../src/sanitizer.mjs';

test('infers generic candidates from sanitized evidence', () => {
  const candidates = inferGenericFormCandidates(`
    Platform A receipt
    Estimated distance: 2.4 km
    Estimated duration: 8 min
    Actual paid: 12.50
  `);
  assert.equal(candidates.some(item => item.field === 'estimated_distance_km'), true);
  assert.equal(candidates.some(item => item.field === 'estimated_duration_min'), true);
  assert.equal(candidates.some(item => item.field === 'actual_paid_amount'), true);
  assert.equal(candidates.some(item => item.field === 'platform'), true);
});

test('keeps low-confidence candidates in review bucket', () => {
  const grouped = splitCandidatesByConfidence([
    { field: 'a', confidence: 0.9 },
    { field: 'b', confidence: 0.4 }
  ], 0.8);
  assert.deepEqual(grouped.fillable.map(item => item.field), ['a']);
  assert.deepEqual(grouped.review.map(item => item.field), ['b']);
});

test('redacts sensitive content', () => {
  const text = redactSensitiveText('token=sk-exampleexampleexampleexample and https://private.example/task?id=1');
  assert.equal(text.includes('sk-example'), false);
  assert.equal(text.includes('https://private.example'), false);
});

test('detects private context terms', () => {
  const issues = findSanitizationIssues('sample.md', 'Open approveData in the private workflow.');
  assert.equal(issues.length > 0, true);
});
