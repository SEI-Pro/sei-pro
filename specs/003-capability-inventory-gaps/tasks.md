# Tasks: Inventário e Gaps de Capacidades

**Input**: Design documents from `/specs/003-capability-inventory-gaps/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included — FR-009 / Constitution IV require hard-fail coverage gates (`contracts/coverage-gate.md`). Soft gate (FR-007) is process/docs (not CI Spec Kit parser).

**Organization**: Phases by user story (US1 → US3). Each automated slice MUST leave `npm run verify` green.

**Glossary**:
- **Map** = `docs/capabilities-map.md` (canonical inventory + gaps + YAML anchors)
- **Anchors** = `# capabilities-map:inventory|gaps|exceptions` YAML fences ([contracts/inventory-map.md](./contracts/inventory-map.md))
- **C0–C10** = coverage checks in [contracts/coverage-gate.md](./contracts/coverage-gate.md)
- **FR-013** = maturity gap only when not exclusive **and** legacy parallel / unjustified shared|null key / residual owner

**MVP boundary**: Phases 1–3 (Setup + Foundational + US1) deliver a complete parseable inventory with descriptor/page coverage gates. US2 adds prioritized gaps + FR-006. US3 adds soft-gate/PR/Spec Kit process.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label ([US1]…[US3])
- Include exact file paths in descriptions

## Path Conventions

- Canonical map: `docs/capabilities-map.md`
- Parser: `scripts/lib/parse-capabilities-map.mjs`
- Descriptors scan: `scripts/lib/scan-feature-descriptors.mjs`
- Structure tests: `tests/structure/`
- Ops/docs: `DEVELOPMENT.md`, `.github/pull_request_template.md`, `docs/architecture.md`
- Feature docs: `specs/003-capability-inventory-gaps/`

### Slice DoD (every phase checkpoint)

Before merging a slice: `npm run verify` green; map anchors parse when present; no parallel inventory file outside `docs/capabilities-map.md`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline current coverage and map state before expanding

- [x] T001 Create `specs/003-capability-inventory-gaps/checklists/policy-baseline.md` noting: descriptor count (37), maturity breakdown, current `capability-coverage` allowlists (`SCHEMA_FEATURE_WITHOUT_DESCRIPTOR`, `NULL_CONFIGKEY_ALLOWED`, `CONFIG_KEY_FEATURE_OWNER_OVERRIDES`), page count under `pages/`, and that `docs/capabilities-map.md` is still partial (no YAML anchors yet)
- [x] T002 [P] Confirm `npm run verify` and `npx vitest run tests/structure/capability-coverage.test.js` are green on current HEAD; record commands/results in `specs/003-capability-inventory-gaps/checklists/policy-baseline.md`

**Checkpoint**: Baseline documented; existing verify still green

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Parser + skeleton anchors + shared exception exports — MUST finish before story fill-out

**⚠️ CRITICAL**: No full inventory/gap authoring gates begin until this phase is complete

- [x] T003 Add `scripts/lib/parse-capabilities-map.mjs` that reads `docs/capabilities-map.md`, extracts YAML fences marked `# capabilities-map:inventory`, `# capabilities-map:gaps`, `# capabilities-map:exceptions`, and returns `{ inventory, gaps, exceptions }` (fail closed on missing/invalid YAML)
- [x] T004 Extend `scripts/lib/scan-feature-descriptors.mjs` to parse optional `undocumented: true|false` from `feature.ts` source (default false) and expose it on scan results
- [x] T005 [P] Extract coverage allowlists from `tests/structure/capability-coverage.test.js` into `scripts/lib/capability-coverage-allowlists.mjs` (export the three sets/maps); keep test behavior identical by importing them
- [x] T006 Restructure `docs/capabilities-map.md` with required human section headings (Intro, Inventory, Residuals & non-capabilities, Gap register, Exceptions) per `specs/003-capability-inventory-gaps/contracts/inventory-map.md`, preserving existing useful content as starting prose
- [x] T007 Insert **skeleton** YAML anchors in `docs/capabilities-map.md` (`entries: []`, `gaps: []`, `exceptions: []` or minimal stubs) so T003 parses successfully; document anchor convention in map intro
- [x] T008 Add `tests/structure/capabilities-map-inventory.test.js` with C0 only (anchors parse / schema-shaped objects); skip or soft-assert empty inventory until US1 fills it — must not break verify prematurely; if empty inventory would fail later checks, gate those behind a clear TODO comment and enable in US1/US2 tasks
- [x] T009 Run parser smoke (`node -e` import of `parse-capabilities-map.mjs`) and `npm run verify`; update `specs/003-capability-inventory-gaps/checklists/policy-baseline.md` with parser entrypoint

**Checkpoint**: Parser + skeleton map + allowlist module exist; foundation ready for US1 fill

---

## Phase 3: User Story 1 — Inventário completo e legível das capacidades (Priority: P1) 🎯 MVP

**Goal**: Every user capability (and residual/non-capability) appears once in `docs/capabilities-map.md` with user name, one-sentence summary, maturity, config key mode, and pages/descriptor evidence

**Independent Test**: Open the map; verify the human-readable tables and YAML anchors contain the same capability/gap IDs; spot-check prazos / menus rápidos / atividades-*; every descriptor id present; `vitest` C1–C6 and C10 pass

### Tests for User Story 1

- [x] T010 [P] [US1] Extend `tests/structure/capabilities-map-inventory.test.js` with C1 (every descriptor id ∈ inventory), C2 (no phantom `descriptorId`), and C10 (human-readable Inventory/Residuals/Gap register table IDs exactly match their respective YAML anchors; reject prose-only or YAML-only ids)
- [x] T011 [P] [US1] Extend `tests/structure/capabilities-map-inventory.test.js` with C5 (every `pages/*.md` referenced or orphan-doc gap) and C6 (capability entries have `pages[]` or `undocumented=true` with justification path)
- [x] T012 [P] [US1] Extend `tests/structure/capability-coverage.test.js` (or inventory test) with C3 config-key claim vs schema using inventory ownership + `scripts/lib/capability-coverage-allowlists.mjs` (keep existing C4 ownership asserts)

### Implementation for User Story 1

- [x] T013 [US1] Populate `# capabilities-map:inventory` in `docs/capabilities-map.md` with one entry per `src/features/*/feature.ts` id (37), fields per `specs/003-capability-inventory-gaps/data-model.md` (`id`, `kind`, `name`, `summary`, `maturity`, `configKey`, `configKeyMode`, `sharedWith`, `pages`, `undocumented`, `descriptorId`)
- [x] T014 [US1] Map `pages/*.md` evidence onto inventory entries (many-to-one/many allowed); mark true orphans only via gap stubs deferred to US2 **or** temporary orphan-doc gap ids listed in inventory test allow-during-fill — prefer completing page links in this task so C5 can pass without US2
- [x] T015 [US1] Add residual / non-capability rows (`kind: residual|non-capability`) for `atividades` residual orchestration, `src/shared/sei-runtime` (if listed), and other non-user infra called out in current map; emptying conditions in `notes`
- [x] T016 [US1] Write human-readable Inventory + Residuals tables in `docs/capabilities-map.md` mirroring YAML (user vocabulary; no legacy filename as primary name)
- [x] T017 [US1] Set `undocumented: true` on descriptors that lack pages **or** list pages; if using descriptor flag, update affected `src/features/*/feature.ts` and ensure NULL/undocumented story stays honest (atividades-* expected)
- [x] T018 [US1] Make T010–T012 pass (C1–C6 and C10); `npm run verify` green

**Checkpoint**: MVP — complete parseable inventory + page/descriptor coverage hard-fail

---

## Phase 4: User Story 2 — Registro priorizado de gaps (Priority: P1)

**Goal**: Prioritized P1–P4 gap register in the same map, including all FR-006 known lacunas; exceptions linked to allowlists; maturity gaps only when FR-013 applies

**Independent Test**: Using only the gap register, answer top-5 consolidations; FR-006 ids present; illegal maturity gap probe fails (quickstart §4/§6)

### Tests for User Story 2

- [x] T019 [P] [US2] Extend `tests/structure/capabilities-map-inventory.test.js` (or add `tests/structure/capabilities-map-gaps.test.js`) with C7 (every allowlist entry ↔ exceptions anchor ↔ gap/`not_a_gap`) and C8 (FR-006 inclusion list from `specs/003-capability-inventory-gaps/contracts/coverage-gate.md`)
- [x] T020 [P] [US2] Add C9 assert: any `type: maturity` gap must satisfy FR-013 against inventory maturity + evidence fields; reject non-exclusive-only maturity gaps

### Implementation for User Story 2

- [x] T021 [US2] Populate `# capabilities-map:gaps` in `docs/capabilities-map.md` with open gaps typed/prioritized per FR-005; include at least FR-006 ids: `gap-atividades-pages`, `gap-atividades-shared-key`, `gap-prescricoes-schema-owner`, `gap-telemetry-folder`, `gap-transitional-ownership`, `gap-strangler-shared-keys` (slugs stable; adjust only if test inclusion list matches)
- [x] T022 [US2] Populate `# capabilities-map:exceptions` linking `scripts/lib/capability-coverage-allowlists.mjs` entries to `gapId` or `not_a_gap` justification
- [x] T023 [US2] Write human Gap register section ordered P1→P4 with impact text; ensure maturity-type gaps only where FR-013 applies (shared/null keys, residual owners, parallel legacy) — status-only maturity for clean wired/declared stays off the gap list
- [x] T024 [US2] Replace old “§4 Lacunas conhecidas” prose with pointers into the new register (no duplicate contradictory lists) in `docs/capabilities-map.md`
- [x] T025 [US2] Make T019–T020 pass; add intentional fault note to `specs/003-capability-inventory-gaps/checklists/verify-probes.md` (orphan page, drop known gap, illegal maturity gap); `npm run verify` green

**Checkpoint**: Gap register actionable; FR-006 visible; C7–C9 hard-fail

---

## Phase 5: User Story 3 — Inventário como base para Spec Kit e revisão (Priority: P2)

**Goal**: Contributors/reviewers use the map as product source of truth; soft gate for new capabilities while open P1 gaps exist

**Independent Test**: PR template + DEVELOPMENT.md state soft-gate rules; hypothetical new capability without P1 justification is rejectable; map update required on capability boundary PRs

### Implementation for User Story 3

- [x] T026 [P] [US3] Add Spec Kit / soft-gate section to `DEVELOPMENT.md` summarizing FR-007 and pointing to `docs/capabilities-map.md` + `specs/003-capability-inventory-gaps/contracts/soft-gate-new-capability.md`
- [x] T027 [P] [US3] Extend `.github/pull_request_template.md` with checklist items: update capabilities-map when touching frontier/keys/pages; soft-gate justification listing deferred open P1 gap ids when adding a **new** user capability (or N/A)
- [x] T028 [P] [US3] Update `docs/architecture.md` measured-state / capabilities pointer to the expanded map (inventory + gaps), without inventing new metrics
- [x] T029 [US3] Add short “how to open a consolidation Spec Kit from a gap id” blurb to `docs/capabilities-map.md` intro or gap register footer
- [x] T030 [US3] Align `.cursor/agents/architecture-verifier.md` (if present) to check map freshness + soft-gate when reviewing new capabilities
- [x] T031 [US3] `npm run verify` still green (docs-only changes must not break structure tests)

**Checkpoint**: Process surfaces enforce map-as-truth + soft gate

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation evidence and doc consistency

- [x] T032 [P] Fill `specs/003-capability-inventory-gaps/checklists/quickstart-results.md` by executing `specs/003-capability-inventory-gaps/quickstart.md` scenarios 1–6 (note pass/fail); for SC-005, record 10 sampled capability IDs, individual pass/fail results, aggregate count, and the ≥9/10 threshold result
- [x] T033 [P] Ensure `docs/implementation-plan.md` Fase 5 / capabilities references point at the expanded map (brief cross-link only; no scope expansion)
- [x] T034 Run full `npm run verify`; confirm no second inventory file was added outside `docs/capabilities-map.md`
- [x] T035 Mark `specs/003-capability-inventory-gaps/spec.md` status Implemented (or keep Draft until merge — set to match repo convention from `002`)

**Checkpoint**: Feature ready for `$speckit-implement` completion / PR

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories
- **US1 (Phase 3)**: Depends on Foundational — **MVP**
- **US2 (Phase 4)**: Depends on US1 inventory entries existing (gaps reference capability ids)
- **US3 (Phase 5)**: Depends on US2 gap register (soft gate reads open P1)
- **Polish (Phase 6)**: Depends on US1–US3 as delivered

### User Story Dependencies

- **US1**: After Phase 2 only
- **US2**: After US1 (needs inventory ids + page coverage baseline)
- **US3**: After US2 (needs real P1 gaps for soft-gate docs to be meaningful)

### Within Each Story

- Tests marked before implementation should fail or be skipped until data filled; enable asserts as YAML is populated
- Prefer filling YAML then tightening tests in the same story checkpoint

### Parallel Opportunities

- T001∥T002 (Setup)
- T005∥T003/T004 (Foundational — T005 independent file)
- T010∥T011∥T012 (US1 tests)
- T019∥T020 (US2 tests)
- T026∥T027∥T028 (US3 docs)
- T032∥T033 (Polish)

---

## Parallel Example: User Story 1

```bash
# After skeleton map exists, launch US1 test stubs together:
Task: "T010 C1/C2 in tests/structure/capabilities-map-inventory.test.js"
Task: "T011 C5/C6 in tests/structure/capabilities-map-inventory.test.js"
Task: "T012 C3 in tests/structure/capability-coverage.test.js"

# Then fill inventory (sequential — same file docs/capabilities-map.md):
Task: "T013 Populate inventory YAML"
Task: "T014 Map pages evidence"
Task: "T015 Residuals / non-capabilities"
```

---

## Parallel Example: User Story 2

```bash
Task: "T019 C7/C8 gap inclusion tests"
Task: "T020 C9 maturity-gap eligibility test"
# Then same-file map updates T021–T024 sequentially
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup
2. Phase 2 Foundational (parser + skeleton)
3. Phase 3 US1 inventory + C1–C6/C10
4. **STOP and VALIDATE**: map readable; coverage green
5. Demo: maintainer can see all capabilities in one place

### Incremental Delivery

1. Setup + Foundational → parser ready
2. US1 → full inventory (MVP)
3. US2 → prioritized gaps + FR-006
4. US3 → soft gate / PR / Spec Kit process
5. Polish → quickstart evidence

### Parallel Team Strategy

- After Phase 2: one person fills inventory YAML (US1); another prepares test harness files (T010–T012) against fixtures
- US2/US3 mostly serial on `docs/capabilities-map.md` + docs — avoid concurrent edits to the map file

---

## Notes

- [P] = different files, no incomplete-task dependency
- Do **not** migrate features to `exclusive` or invent new options keys in this feature (FR-012)
- Do **not** create `docs/capabilities-inventory.yaml` as a second source of truth
- Commit after each checkpoint; keep verify green
- Suggested next command after tasks: `$speckit-implement`

---

## Phase 7: Convergence

- [x] T036 Add a fail-closed C10 prose↔YAML consistency assertion for the Inventory, Residuals & non-capabilities, and Gap register tables; correct the C0–C10 coverage-gate reference in `DEVELOPMENT.md`; run `npm run verify` per FR-009 and SC-001/SC-002 (partial)
- [x] T037 Update `.cursor/agents/architecture-verifier.md` to require map freshness and open-P1 soft-gate checks when reviewing capability-boundary changes per US3/T030 (partial)
