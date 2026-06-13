# Runbook

## Local development

```bash
npm install
npm test
npm run demo
npm run audit:sanitize
```

## Browser extension demo

1. Open `chrome://extensions`.
2. Enable Developer Mode.
3. Load the `extension/` folder.
4. Open `examples/mock-form.html`.
5. Paste the sample evidence text into the panel.
6. Click `Suggest fields`.

The demo fills only high-confidence fields and prints all other candidates for review. It does not submit or save the form.

## Human-in-the-loop workflow

Recommended production pattern:

1. Collect evidence from an allowed source.
2. Convert evidence into normalized text or structured observations.
3. Run generic extraction and business-specific private rules.
4. Fill only high-confidence fields.
5. Leave conflicts and low-confidence values unchanged.
6. Produce an exception report.
7. Require human review before final submission.

## Safety defaults

- No automatic submit.
- No destructive action.
- No credential handling in the browser extension.
- No production URL in public code.
- No raw screenshot or OCR archival in public examples.
- No private handoff logs in public documentation.

## Extending privately

A private adapter can import the generic rule interfaces and provide:

- Site-specific selectors.
- OCR pipeline.
- Field mappings.
- Platform-specific evidence handling.
- Report storage policy.

Keep those files out of this repository unless they are fully synthetic.
