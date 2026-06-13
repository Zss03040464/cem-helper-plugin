# Agent Form Filler

A sanitized, public-safe browser form automation starter kit for agent-assisted workflows.

This repository is a generic version of a private form automation workflow. It intentionally removes all real business names, production URLs, task IDs, screenshots, account data, cookies, OCR raw text, private paths, and operational handoff logs.

## What it does

Agent Form Filler helps turn image/text evidence into reviewable form field candidates. It is designed for workflows where an automation agent can assist, but a human must still review uncertain fields before any final submission.

Core ideas:

- Browser extension injects a small assistant panel into matching pages.
- Rule engine maps extracted evidence to form field candidates.
- Low-confidence or conflicting candidates are left empty and reported.
- The tool does not click submit, save, approve, reject, or destructive buttons.
- Sensitive runtime data stays outside the repository.

## Public-safe scope

This repository contains only generic examples:

- Mock HTML form under `examples/`.
- Generic field names such as `estimated_distance_km`, `estimated_duration_min`, and `actual_paid_amount`.
- Placeholder platforms such as `platform_a` and `platform_b`.
- A sanitization audit script that rejects obvious secrets, real URLs, local private paths, cookies, and known private workflow terms.

It does not contain:

- Production website names or URLs.
- Real screenshots, OCR text, task IDs, order IDs, phone numbers, addresses, vehicle plates, driver names, cookies, or credentials.
- Private agent conversation files such as `对话.md`, `AGENTS.md`, local session logs, or project-specific rule archives.

## Repository layout

```text
.
├── extension/                 # Minimal MV3 browser extension
├── src/                       # Generic rule engine and sanitizer
├── scripts/                   # Public-safety audit scripts
├── examples/                  # Mock pages and sample payloads
├── docs/                      # Runbook and sanitization policy
├── package.json
└── README.md
```

## Quick start

```bash
npm install
npm test
npm run audit:sanitize
```

Load the extension during development:

1. Open `chrome://extensions`.
2. Enable Developer Mode.
3. Load the `extension/` directory.
4. Open `examples/mock-form.html` locally or serve the repo with any static server.

## Design boundary

This project is intentionally conservative. It assists with field suggestions, but it does not make final business decisions. A real deployment should keep private adapters, production selectors, screenshots, and business-specific rule files in a private repository.

## Agent handoff rule

Agents working on this repository must preserve public-safety boundaries. Do not add real URLs, real screenshots, cookies, credentials, private local paths, production task identifiers, or private conversation logs. Run `npm run audit:sanitize` before committing.
