# Contract: Human Policy Review

**Feature**: `002-ts-zero-legacy`  
**Entrypoints**: Pull request checklist; `.cursor/agents/architecture-verifier.md`; reviewer process in `DEVELOPMENT.md`

## Purpose

Mandatory human half of the dual gate (FR-008, FR-015, clarification C). Covers judgments automation cannot fully prove.

## Required checklist items (product-runtime PRs)

Reviewer (or architecture-verifier agent used as reviewer aid) MUST confirm:

| ID | Item | Pass criteria |
|----|------|---------------|
| H1 | Fecho honesty | Dependency closure listed in PR is complete enough; no “hidden” legacy helper left out to dodge exclusive; characterization tests added/updated when moving untested behavior (constitution V) or N/A already covered |
| H2 | Exclusive really exclusive | No parallel auto-boot / legacy path remains for capabilities in the fecho |
| H3 | DOM/HTML quality | If UI changed: native/semantic elements, no new inline handlers, modern shared UI reused when applicable (FR-006/007) |
| H4 | No legacy reinforcement | Change does not add behavior to non-exclusive paths; rename/wrap without migrate does not count (FR-010) |
| H5 | Agent SEI discipline | If agent touched SEI UI: asked for integrated-browser access when needed; no persisted SEI HTML/screenshots in the PR |
| H6 | Usability | Extension still loadable; when UI touched, critical-flow smoke on real SEI is **blocking** (constitution V / FR-009) |

## Merge rule

- Product-runtime merge requires **both**: (1) green CI including policy/automated checks on the **actual CI path**, and (2) approving human review with checklist H1–H6 completed (or N/A with reason).
- Incomplete checklist or missing required review MUST be treated as **reject** — template theater without review does not satisfy FR-008.
- CI green alone is **not** sufficient for product-runtime merges under this policy.
- Ops: document branch protection (required PR reviews on default branch) in `DEVELOPMENT.md`; CODEOWNERS optional follow-up.

## Docs-only / tooling-only

- Full H1–H6 exclusive checklist not required.
- Tooling-only: reviewer still rejects coupling of new tooling to legacy product surfaces when applicable (FR-017).

## Non-goals

- Replacing structure tests.
- Storing SEI page dumps as review evidence (forbidden by FR-016).
