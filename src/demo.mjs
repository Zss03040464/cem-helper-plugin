import { inferGenericFormCandidates, splitCandidatesByConfidence } from './rules.mjs';

const sampleEvidence = `
Platform A receipt
Estimated distance: 2.4 km
Estimated duration: 8 min
Actual paid: 12.50
`;

const candidates = inferGenericFormCandidates(sampleEvidence);
const grouped = splitCandidatesByConfidence(candidates, 0.8);

console.log(JSON.stringify({ candidates, grouped }, null, 2));
