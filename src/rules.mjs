const NUMBER_RE = /-?\d+(?:\.\d+)?/g;

export function normalizeText(input = '') {
  return String(input)
    .replace(/\s+/g, ' ')
    .replace(/[，。；：]/g, match => ({ '，': ',', '。': '.', '；': ';', '：': ':' }[match] || match))
    .trim();
}

export function parseNumberNear(text, keywords) {
  const source = normalizeText(text);
  const terms = Array.isArray(keywords) ? keywords : [keywords];
  for (const term of terms) {
    const index = source.toLowerCase().indexOf(String(term).toLowerCase());
    if (index === -1) continue;
    const windowText = source.slice(Math.max(0, index - 24), index + 64);
    const values = windowText.match(NUMBER_RE);
    if (values?.length) return Number(values[0]);
  }
  return null;
}

export function buildCandidate(field, value, confidence, evidence, reason = '') {
  return {
    field,
    value,
    confidence,
    evidence: normalizeText(evidence).slice(0, 240),
    reason
  };
}

export function inferGenericFormCandidates(evidenceText) {
  const text = normalizeText(evidenceText);
  const candidates = [];

  const distance = parseNumberNear(text, ['distance', 'km', 'miles']);
  if (distance !== null) {
    candidates.push(buildCandidate(
      'estimated_distance_km',
      distance,
      0.72,
      text,
      'Distance-like number found near distance keywords.'
    ));
  }

  const duration = parseNumberNear(text, ['duration', 'minutes', 'min']);
  if (duration !== null) {
    candidates.push(buildCandidate(
      'estimated_duration_min',
      duration,
      0.72,
      text,
      'Duration-like number found near duration keywords.'
    ));
  }

  const paid = parseNumberNear(text, ['paid', 'actual paid', 'total paid']);
  if (paid !== null) {
    candidates.push(buildCandidate(
      'actual_paid_amount',
      paid,
      0.74,
      text,
      'Payment-like number found near paid keywords.'
    ));
  }

  const platform = inferPlatform(text);
  if (platform) {
    candidates.push(buildCandidate(
      'platform',
      platform,
      0.68,
      text,
      'Generic platform marker detected.'
    ));
  }

  return candidates;
}

export function inferPlatform(text) {
  const source = normalizeText(text).toLowerCase();
  if (source.includes('platform a')) return 'platform_a';
  if (source.includes('platform b')) return 'platform_b';
  return null;
}

export function splitCandidatesByConfidence(candidates, threshold = 0.8) {
  return {
    fillable: candidates.filter(item => item.confidence >= threshold),
    review: candidates.filter(item => item.confidence < threshold)
  };
}
