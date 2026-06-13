# Sanitization Policy

This repository is public-safe by design. It must remain a generic starter kit, not a mirror of any private production workflow.

## Never commit

- Real production URLs, route names, task links, query strings, IDs, or internal system names.
- Cookies, tokens, passwords, private keys, API keys, `.env` files, browser profiles, or session storage.
- Real screenshots, OCR raw text, phone numbers, addresses, names, vehicle plates, receipts, invoices, or account identifiers.
- Private agent handoff files, local conversation logs, private task lists, or local absolute paths.
- Business-specific field names that reveal a private workflow.

## Allowed content

- Generic field names.
- Synthetic HTML examples.
- Placeholder platforms such as `platform_a` and `platform_b`.
- Small rule-engine examples that do not reveal a real target site.
- Documentation that describes architecture without exposing private operations.

## Required checks before publishing

Run:

```bash
npm run audit:sanitize
npm test
```

Any failed sanitization audit must be treated as a release blocker.

## Recommended private/public split

Keep these in a private repository:

- Production selectors.
- Real OCR adapters.
- Real workflow-specific rules.
- Browser profile data.
- Task URL lists.
- Reports and screenshots.
- Agent session logs.

Keep these in this public repository:

- Generic extension shell.
- Generic rule-engine interfaces.
- Mock examples.
- Sanitization tooling.
- Human-in-the-loop workflow documentation.
