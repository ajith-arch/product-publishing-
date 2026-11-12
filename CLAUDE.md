# AI Product Publishing Studio

## Role
You are a senior full-stack engineer implementing an AI-assisted e-commerce product publishing application.

Work incrementally. Prioritize clean architecture, maintainability, accuracy, and minimal complexity.

## Product Goal
Build a standalone web application that converts user-provided product identifiers into reviewed, structured, CSV-exportable product listing data.

## Initial Target Workflow
1. User enters SKU, NetSuite Internal ID, and Product Name.
2. User optionally supplies product images.
3. Application researches the product using trusted sources.
4. AI generates structured product content.
5. User reviews and edits all generated information.
6. User approves the product.
7. Application exports a CSV matching a configurable NetSuite import template.
8. User manually imports the file into NetSuite.

## Strict Scope
- Single-product workflow for MVP.
- No NetSuite API integration.
- No direct publishing to NetSuite.
- No automatic NetSuite data modification.
- No bulk processing until single-product MVP is validated.
- No unnecessary authentication or cloud infrastructure.
- Use mock data until live integrations are deliberately implemented.

## Technology
- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zod validation
- React Hook Form
- Server-side AI API calls
- Deterministic CSV export
- Vitest for tests

## Product Input
Required:
- SKU (string)
- Internal ID (string)
- Product Name (string)

Optional:
- Product images

Preserve identifiers exactly as entered. Never allow AI to invent or modify the SKU or Internal ID.

## Generated Content
- Page Title
- Web Store Display Name
- Web Store Description
- Detailed Description
- Featured Description
- Meta Title
- Meta Description
- Search Keywords
- URL Component
- Product Specifications
- In the Box
- Suggested merchandising attributes

## Research Requirements
- Prefer official manufacturer sources.
- Support research citations and evidence.
- Distinguish verified information from unsupported claims.
- Never fabricate specifications.
- Flag uncertain or missing information for review.
- Never present guessed image URLs as verified assets.

## Review Requirements
- Every generated content field must be editable.
- Separate raw AI output from approved user edits.
- Support regenerate-by-field later.
- Require approval before export.
- Keep track of unverified claims.

## CSV Requirements
- CSV must be produced by application code, not AI text output.
- Column mapping must be configurable.
- Respect exact mapped headers and ordering.
- Escape CSV content safely.
- Do not invent NetSuite field IDs.
- Never treat missing values as explicit field-clearing instructions.
- Do not enable publishing flags silently.

## Engineering Guidelines
- Build small, reusable components.
- Use strict TypeScript types.
- Validate external data with Zod.
- Keep API keys on the server.
- Sanitize rich HTML when rendering.
- Avoid unnecessary dependencies.
- Add focused tests for critical logic.
- Explain assumptions briefly.

## Token-Efficiency Rules
- Implement only the requested milestone.
- Do not redesign unrelated modules.
- Do not rewrite working files without a clear reason.
- Do not add speculative features.
- Reuse existing components.
- Summarize changed files and test results concisely.
- Ask only when a missing detail truly blocks implementation.

## Definition of Done
A task is complete when:
1. Requested functionality works.
2. TypeScript checks pass.
3. Relevant tests pass.
4. No unrelated feature was modified.
5. Remaining limitations are clearly stated.

## Project Layout (current)
- `src/app/` — routes (App Router): `/`, `/products/new`, `/products`, `/products/[id]` (editor, `?tab=`), `/exports`, `/settings/field-mapping`, `/settings`.
- `src/components/ui/` — shadcn/ui primitives (added by hand; the shadcn registry is not reachable from the cloud sandbox).
- `src/components/layout/` — app shell, sidebar, header, empty states.
- `src/components/products/` — New Product form, image picker, product tables.
- `src/components/editor/` — product editor and its six tabs.
- `src/config/navigation.ts` — sidebar groups and breadcrumb lookup.
- `src/lib/product/` — Zod schema, mock generator, readiness rules, pure operations, browser stores, tests.

## Data & State (prototype)
- Product records persist in `localStorage` (`pps.products.v1`), validated with Zod on load.
- `generated` (raw output) and `edited` (user's saved copy) are separate; `input` identifiers are never modified.
- Images are in-memory object URLs only; they are cleared on refresh.
- Any saved edit to an approved product moves it back to `draft`.

## Commands
- `npm run dev` — local dev server
- `npm run typecheck` — TypeScript check
- `npm run lint` — ESLint
- `npm test` — Vitest unit tests
- `npm run build` — production build

## Milestone Status
- [x] M1 Project foundation
- [x] M2 Product input
- [x] M3 Product data schema (mock generator)
- [ ] M4 Research and AI engine
- [x] M5 Review and edit workspace (UI; regenerate-by-field pending)
- [ ] M6 CSV export engine (Export Preview + Field Mapping are read-only placeholders)
- [ ] M7 Quality assurance
