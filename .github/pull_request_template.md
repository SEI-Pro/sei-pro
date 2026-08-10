<!-- Merge blocked without completed checklist + CI green (002-ts-zero-legacy / FR-008). -->

## Dual-gate checklist (product-runtime)

> Docs-only / tooling-only: mark N/A with reason. Incomplete checklist = **reject**.

- [ ] **H1 Fecho honesty** — Dependency closure listed; no hidden legacy helpers; characterization tests added/updated for untested behavior being moved (or N/A: already covered)
- [ ] **H2 Exclusive really exclusive** — No parallel auto-boot / legacy path remains for fecho capabilities
- [ ] **H3 DOM/HTML quality** — If UI changed: native/semantic elements, no new inline handlers, modern shared UI reused (or N/A: no UI)
- [ ] **H4 No legacy reinforcement** — No new behavior on non-exclusive paths; rename/wrap without migrate does not count (FR-010)
- [ ] **H5 Agent SEI discipline** — If agent touched SEI UI: asked for integrated-browser access when needed; no persisted SEI HTML/screenshots (or N/A)
- [ ] **H6 Usability** — Extension loadable; when UI touched, critical-flow smoke on real SEI is **blocking** (or N/A: no UI)

### Expanded fecho (if prerequisites migrated)

- Migrated prerequisite features/modules:
- 

## CI

- [ ] CI green including `policy:check` (and structure tests)

## Summary

-

## Test plan

-
