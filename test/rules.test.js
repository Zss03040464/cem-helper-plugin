import { describe, it } from 'node:test';
import assert from 'assert';
import { getSuggestion, generateSuggestions } from '../src/rules.js';
import { sanitize, detectSensitive } from '../src/sanitizer.js';

describe('Rule Engine', () => {
  it('should suggest name from alias', () => {
    const { value, confidence } = getSuggestion('姓名');
    assert.strictEqual(value, '张三');
    assert.ok(confidence > 0);
  });
  it('should return null for unknown field', () => {
    const { value, confidence } = getSuggestion('未知字段');
    assert.strictEqual(value, null);
    assert.strictEqual(confidence, 0);
  });
  it('should generate suggestions for multiple fields', () => {
    const suggestions = generateSuggestions([{ name: '邮箱' }, { name: '用户名' }], 'platform_b');
    assert.strictEqual(suggestions[0].suggestion, 'example@example.com');
    assert.strictEqual(suggestions[1].suggestion, 'demoUser');
  });
});

describe('Sanitizer', () => {
  it('should detect and sanitize mobile number', () => {
    const text = '手机号：13812345678';
    const result = sanitize(text);
    assert.ok(result.includes('1381234****'));
    const detected = detectSensitive(text);
    assert.ok(detected.some(item => item.name === 'mobile'));
  });
  it('should detect and sanitize id card', () => {
    const id = '110101199003074015';
    const result = sanitize(id);
    assert.ok(result.startsWith('110101') && result.endsWith('4015'));
    const detected = detectSensitive(id);
    assert.ok(detected.some(item => item.name === 'id_card'));
  });
});
