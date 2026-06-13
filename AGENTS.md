# Agent Instructions

This repository is the public sanitized edition of a browser form automation workflow. It must stay generic.

## Required first steps

1. Read `README.md`.
2. Read `docs/SANITIZATION.md`.
3. Run or reason through `npm run audit:sanitize` before proposing any publishable change.

## Hard boundaries

Do not add:

- Production website names or URLs.
- Real screenshots, OCR raw text, task IDs, order IDs, names, phone numbers, addresses, vehicle plates, receipts, cookies, credentials, or browser profiles.
- Private local paths.
- Private agent conversation logs or handoff files.
- Business-specific selectors or field names from a private deployment.

## Expected behavior

Prefer generic abstractions:

- `platform_a` / `platform_b` instead of real platform names.
- `estimated_distance_km`, `estimated_duration_min`, `actual_paid_amount` instead of private field labels.
- Mock HTML fixtures instead of production pages.
- Public-safe tests instead of real screenshots.

## Verification

Before finalizing changes, report:

- Files changed.
- Whether sanitization boundaries were preserved.
- Whether tests or audit scripts need to be run locally.
