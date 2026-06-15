/*
 * Content script for Agent Form Filler Demo
 *
 * 扫描页面输入元素，调用内置的规则引擎生成填充建议。
 * 高置信度字段会自动填充；置信度低或已有值的字段会加入审核面板。
 */

(() => {
  const defaults = {
    default: {
      name: '张三',
      phone: '13800000000',
      email: 'example@example.com',
      address: '北京市海淀区某街道100号'
    }
  };

  const aliases = {
    name: ['姓名', 'full_name', 'real_name'],
    phone: ['联系电话', 'phone', 'phone_number', '手机号'],
    email: ['电子邮件', 'mail', '邮箱', 'e-mail'],
    address: ['住址', '地址', 'address']
  };

  function fuzzyMatch(name) {
    const lower = (name || '').toLowerCase();
    for (const key of Object.keys(aliases)) {
      for (const alias of aliases[key]) {
        if (lower.includes(alias.toLowerCase())) {
          return { key, confidence: alias.length / Math.max(lower.length, alias.length) };
        }
      }
    }
    return null;
  }

  function getSuggestion(fieldName) {
    const match = fuzzyMatch(fieldName);
    if (match && defaults.default[match.key]) {
      return { value: defaults.default[match.key], confidence: match.confidence };
    }
    return { value: null, confidence: 0 };
  }

  function sanitizeValue(value) {
    return String(value)
      .replace(/1\d{6}(\d{4})/g, '1380000$1')
      .replace(/\b\d{14,17}[\dXx]\b/g, '[ID_REDACTED]');
  }

  function createReviewPanel(items) {
    const existing = document.getElementById('agent-form-filler-review-panel');
    if (existing) existing.remove();

    const panel = document.createElement('div');
    panel.id = 'agent-form-filler-review-panel';
    panel.style.position = 'fixed';
    panel.style.bottom = '10px';
    panel.style.right = '10px';
    panel.style.zIndex = '9999';
    panel.style.background = '#fff';
    panel.style.border = '1px solid #ccc';
    panel.style.padding = '10px';
    panel.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    panel.style.font = '14px system-ui, sans-serif';
    panel.innerHTML = '<strong>Agent Form Filler 待审核字段</strong><br/>';

    for (const { el, suggestion, field, reason } of items) {
      const row = document.createElement('div');
      row.style.marginTop = '6px';

      const label = document.createElement('span');
      label.textContent = `${field}: `;

      const input = document.createElement('input');
      input.value = suggestion || '';
      input.title = reason || '';
      input.style.marginLeft = '5px';

      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = '填充';
      button.style.marginLeft = '5px';
      button.onclick = () => {
        el.value = sanitizeValue(input.value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        row.remove();
      };

      row.append(label, input, button);
      panel.appendChild(row);
    }

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = '关闭';
    closeButton.style.marginTop = '10px';
    closeButton.onclick = () => panel.remove();
    panel.appendChild(closeButton);
    document.body.appendChild(panel);
  }

  function fieldNameOf(el) {
    return el.getAttribute('name') || el.getAttribute('id') || el.getAttribute('aria-label') || '';
  }

  function processForm() {
    const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input:not([type])'));
    const reviewItems = [];

    for (const el of inputs) {
      const field = fieldNameOf(el);
      const { value, confidence } = getSuggestion(field);
      if (!value) continue;

      if (!el.value && confidence > 0.6) {
        el.value = sanitizeValue(value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        reviewItems.push({ el, suggestion: value, field, reason: el.value ? '已有值，保留并交给人工确认' : '置信度不足' });
      }
    }

    if (reviewItems.length) createReviewPanel(reviewItems);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(processForm, 500);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(processForm, 500));
  }
})();
