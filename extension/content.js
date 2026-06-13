(() => {
  const PANEL_ID = 'agent-form-filler-panel';
  const FIELD_THRESHOLD = 0.8;

  if (document.getElementById(PANEL_ID)) return;

  const panel = document.createElement('section');
  panel.id = PANEL_ID;
  panel.innerHTML = `
    <strong>Agent Form Filler</strong>
    <p>Demo mode. Generates reviewable field suggestions only.</p>
    <textarea placeholder="Paste sanitized evidence text here"></textarea>
    <button type="button" data-action="suggest">Suggest fields</button>
    <button type="button" data-action="clear">Clear</button>
    <pre aria-live="polite"></pre>
  `;
  document.documentElement.appendChild(panel);

  const textarea = panel.querySelector('textarea');
  const output = panel.querySelector('pre');

  panel.addEventListener('click', event => {
    const action = event.target?.dataset?.action;
    if (action === 'clear') {
      textarea.value = '';
      output.textContent = '';
      return;
    }
    if (action === 'suggest') {
      const candidates = inferCandidates(textarea.value);
      const result = applyHighConfidenceCandidates(candidates);
      output.textContent = JSON.stringify(result, null, 2);
    }
  });

  function inferCandidates(text) {
    const normalized = String(text).replace(/\s+/g, ' ').trim();
    const candidates = [];
    const distance = findNumberNear(normalized, ['distance', 'km']);
    const duration = findNumberNear(normalized, ['duration', 'min']);
    const paid = findNumberNear(normalized, ['paid', 'total']);

    if (distance !== null) candidates.push(candidate('estimated_distance_km', distance, 0.82, 'distance keyword'));
    if (duration !== null) candidates.push(candidate('estimated_duration_min', duration, 0.82, 'duration keyword'));
    if (paid !== null) candidates.push(candidate('actual_paid_amount', paid, 0.82, 'paid keyword'));
    if (/platform a/i.test(normalized)) candidates.push(candidate('platform', 'platform_a', 0.7, 'platform marker'));
    if (/platform b/i.test(normalized)) candidates.push(candidate('platform', 'platform_b', 0.7, 'platform marker'));
    return candidates;
  }

  function findNumberNear(text, terms) {
    for (const term of terms) {
      const index = text.toLowerCase().indexOf(term.toLowerCase());
      if (index === -1) continue;
      const windowText = text.slice(Math.max(0, index - 24), index + 64);
      const match = windowText.match(/-?\d+(?:\.\d+)?/);
      if (match) return Number(match[0]);
    }
    return null;
  }

  function candidate(field, value, confidence, reason) {
    return { field, value, confidence, reason };
  }

  function applyHighConfidenceCandidates(candidates) {
    const filled = [];
    const review = [];
    for (const item of candidates) {
      const input = document.querySelector(`[name="${CSS.escape(item.field)}"], [data-field="${CSS.escape(item.field)}"]`);
      if (!input || item.confidence < FIELD_THRESHOLD) {
        review.push(item);
        continue;
      }
      if (input.value && input.value !== String(item.value)) {
        review.push({ ...item, reason: `${item.reason}; existing value preserved` });
        continue;
      }
      input.value = String(item.value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      filled.push(item);
    }
    return { filled, review, note: 'No save or submit action was performed.' };
  }
})();
