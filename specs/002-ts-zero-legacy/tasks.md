# Tasks: Código Novo Sem Legado (TypeScript na Arquitetura Moderna)

**Input**: Design documents from `/specs/002-ts-zero-legacy/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included — Constitution IV / FR-008 require executable gates (`contracts/policy-gate.md`). Human half is checklist + architecture-verifier (not CI-only).

**Organization**: Phases by user story (US1 → US5). Each automated slice MUST leave `npm run verify` green and the extension buildable/loadable (FR-009).

**Glossary**:
- **Exclusive fecho** = dependency closure of touched product-runtime paths; all features in it `maturity: 'exclusive'`
- **Legacy surface** = anything not exclusive (plus banned loaders/globals), except shared modern infra allowlist
- **Dual gate** = automated structure/verify + mandatory human policy review

**MVP boundary**: Phases 1–3 (Setup + Foundational + US1) deliver diff-aware exclusive-closure + typing honesty for product-runtime touches. US2–US5 add DOM guidance, dual-gate process, slice usability docs, and agent SEI rules.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label ([US1]…[US5])
- Include exact file paths in descriptions

## Path Conventions

- Gate scripts: `scripts/`, `scripts/lib/`
- Structure tests: `tests/structure/`
- Ops/agent docs: `DEVELOPMENT.md`, `.cursor/agents/architecture-verifier.md`
- ADRs: `docs/adr/`
- Feature docs: `specs/002-ts-zero-legacy/`

### FR-009 slice DoD (every phase checkpoint)

Before merging a slice: `npm run verify` green; `rm -rf dist && npm run build` produces loadable `dist` (manifest + required refs). No product break for untouched capabilities.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Encode contracts as repo artifacts and capture baseline before gates change behavior

- [x] T001 Create `scripts/policy/shared-modern-infra.mjs` exporting allowlisted roots from `specs/002-ts-zero-legacy/contracts/shared-modern-infra.md` (`src/core`, `src/sei`, `src/platform`, `src/shared`, `src/config`, `src/app`, `src/types`)
- [x] T002 [P] Add checklist stub `specs/002-ts-zero-legacy/checklists/policy-baseline.md` documenting current counts: exclusive/wired/declared features (from descriptors), `tsNocheck` baseline, absence of `typescript-boundary.test.js`
- [x] T003 [P] Confirm `npm run typecheck`, `npm run verify`, and `scripts/lib/scan-feature-descriptors.mjs` run successfully; note commands in `specs/002-ts-zero-legacy/checklists/policy-baseline.md`

**Checkpoint**: Allowlist artifact exists; baseline noted; existing verify still green

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Diff → scope → fecho helpers shared by all policy tests — MUST finish before story gates

**⚠️ CRITICAL**: No user story gate work begins until this phase is complete

- [x] T004 Extend `scripts/lib/scan-feature-descriptors.mjs` (or add `scripts/lib/feature-maturity-index.mjs`) to export a stable API: feature id → `{ maturity, rootDir, sourceGlobs }` for all descriptors
- [x] T005 Add `scripts/policy/classify-change-scope.mjs` that classifies path lists as `docs-only` | `tooling-only` | `product-runtime` per FR-017 / research R4
- [x] T006 Add `scripts/policy/touched-paths.mjs` that resolves touched paths from `git diff --name-only` against merge-base (env override `POLICY_TOUCHED_PATHS`; CI base SHA/fetch-depth required; unresolved CI base fails closed)
- [x] T007 Add `scripts/policy/dependency-closure.mjs` that, given touched product paths + maturity index, returns the feature fecho set and static import edges (enough for P3–P5)
- [x] T008 Add `scripts/policy/assert-exclusive-closure.mjs` implementing checks P0–P6 from `specs/002-ts-zero-legacy/contracts/policy-gate.md` as pure functions returning `{ ok, failures[] }`
- [x] T009 Wire a thin CLI `scripts/policy-check.mjs` that runs T005–T008 and exits 0/1 with actionable output; document usage in `specs/002-ts-zero-legacy/checklists/policy-baseline.md`
- [x] T010 Run `node scripts/policy-check.mjs` on current HEAD (expect docs-only or pass on empty product diff) and ensure `npm run verify` still green

**Checkpoint**: Policy helper API + CLI exist; foundation ready for story tests

---

## Phase 3: User Story 1 — Mudança entrega só código tipado na arquitetura moderna (Priority: P1) 🎯 MVP

**Goal**: Product-runtime deliveries must land as TypeScript in exclusive modern fecho with zero coupling to non-exclusive surfaces

**Independent Test**: Simulate touch of a wired feature without exclusive migration → policy check fails (P3/P4); exclusive typed fecho → passes (quickstart B/D)

### Tests for User Story 1

- [x] T011 [P] [US1] Add `tests/structure/typescript-boundary.test.js` covering ADR-0014 boundary: product sources under gate are `.ts`; cite ADR-0014; fail on new product `.js` patterns as designed
- [x] T012 [P] [US1] Add `tests/structure/touched-ts-nocheck.test.js` that fails when touched product `.ts` paths (via `POLICY_TOUCHED_PATHS` fixture) contain `@ts-nocheck` or new `any`/`as any`/`@ts-ignore`
- [x] T013 [P] [US1] Add `tests/structure/exclusive-closure-policy.test.js` with deterministic probes: wired feature → P3, docs-only → P0 skip, tooling-only typing/coupling, touched historical JS → P1, exclusive→wired import → P4, and stale registry → P6

### Implementation for User Story 1

- [x] T014 [US1] Implement exclusive-maturity + non-exclusive coupling assertions inside `scripts/policy/assert-exclusive-closure.mjs` (P3/P4/P5) using allowlist from `scripts/policy/shared-modern-infra.mjs`; P4 MUST also flag imports of known legacy loaders and banned globals (`getSeiPro` misuse / new `aliasGlobal` debt) from the fecho
- [x] T015 [US1] Implement typing honesty assertions (P1/P2) in `scripts/policy/assert-exclusive-closure.mjs` for touched product files
- [x] T016 [US1] Ensure registry alignment check (P6) reuses existing registry freshness concepts from `scripts/generate-context-registry.mjs` / build verify for exclusive features in the fecho
- [x] T017 [US1] Make T011–T013 pass against fixtures; keep whole-tree `tests/structure/ratchets.test.js` unchanged except if new metrics are added intentionally
- [x] T018 [US1] Add `npm run policy:check` script in `package.json` pointing at `scripts/policy-check.mjs`
- [x] T019 [US1] Document US1 contributor rule in `DEVELOPMENT.md` (touch product runtime ⇒ exclusive fecho + TypeScript; no non-exclusive imports)
- [x] T020 [US1] FR-009 DoD: `npm run verify` green after US1 gates land

**Checkpoint**: MVP — automated exclusive-closure + typing policy enforceable locally

---

## Phase 4: User Story 2 — Interface usa HTML/DOM semântico e acessível (Priority: P1)

**Goal**: UI changes prefer native/semantic HTML/DOM and modern shared UI; no new inline handlers or legacy DOM patterns

**Independent Test**: PR/checklist rejects inline handlers / non-semantic controls; docs state the rule; structure probe **fails** on inline handlers in touched UI files when fixture-enabled

### Tests for User Story 2

- [x] T021 [P] [US2] Add `tests/structure/touched-dom-policy.test.js` that, when `POLICY_TOUCHED_PATHS` includes UI sources, **fails** (not warn) on new inline handler attributes (`onclick=`, `onchange=`, etc.); semantic element choice remains human (H3) — document that split in the test header

### Implementation for User Story 2

- [x] T022 [P] [US2] Add DOM/HTML delivery rules section to `DEVELOPMENT.md` (native elements, labels/focus/keyboard, reuse `src/shared/ui`, no inline handlers, no copying legacy jQuery DOM patterns)
- [x] T023 [P] [US2] Extend human checklist items H3 in `.github/pull_request_template.md` (create template if missing) for semantic HTML / no inline handlers
- [x] T024 [US2] Align `.cursor/agents/architecture-verifier.md` with US2 DOM/HTML checks (judgment for semantics beyond static scan)
- [x] T025 [US2] Make T021 pass; `npm run verify` green (FR-009)

**Checkpoint**: US2 guidance + light automated inline-handler probe + human H3

---

## Phase 5: User Story 3 — Portão impede regressão para o legado (Priority: P1)

**Goal**: Dual gate blocks merges that violate typing, exclusive fecho, or human policy review

**Independent Test**: Intentional faults fail automated gate; PR template requires human H1–H6; CI runs policy checks (quickstart B/C)

### Tests for User Story 3

- [x] T026 [US3] Add deterministic fixture fault probes in `tests/structure/exclusive-closure-policy.test.js` / `touched-ts-nocheck.test.js` for: exclusive module importing wired feature → P4 fail; `@ts-nocheck` on touched path → P2 fail
- [x] T027 [P] [US3] Add `specs/002-ts-zero-legacy/checklists/verify-probes.md` recording commands + expected fail/pass for quickstart Scenarios B–C

### Implementation for User Story 3

- [x] T028 [US3] Add `npm run policy:check` to `package.json` and ensure it runs on CI by either (a) invoking it from a structure test / `npm test` path CI already runs, or (b) adding `- run: npm run policy:check` to `.github/workflows/ci.yml` after build — prefer (a)+(b) if the CLI is cheap; also include it in local `npm run verify`
- [x] T029 [US3] Wire automated half into the **actual CI path** in `.github/workflows/ci.yml` (dedicated step and/or via `npm test`) — do not assume `npm run verify` is what CI runs
- [x] T029a [US3] Document dual-gate merge enforcement in `DEVELOPMENT.md`: product-runtime PRs require (1) green CI including policy checks and (2) approving human review that completed H1–H6; CI green alone is insufficient; UI touches make H6 smoke **blocking**
- [x] T029b [P] [US3] Add `DEVELOPMENT.md` subsection “Branch protection (manual ops)”: require PR reviews before merge on default branch; reviewers MUST treat unchecked H1–H6 as reject; note CODEOWNERS as optional follow-up
- [x] T030 [US3] Complete `.github/pull_request_template.md` with full dual-gate checklist H1–H6 from `specs/002-ts-zero-legacy/contracts/human-review.md` (N/A allowed with reason); state at top: “Merge blocked without completed checklist + CI green”
- [x] T031 [US3] Update `.cursor/agents/architecture-verifier.md` to require dual-gate judgment (H1/H2/H4/H6 + FR-010 rename≠exclusive) and to treat CI-green-alone as insufficient for product-runtime
- [x] T032 [US3] Update `docs/adr/0014-typescript-para-codigo-novo.md` Verificação section to cite `typescript-boundary.test.js`, touched `@ts-nocheck` gate, and `policy:check`
- [x] T033 [US3] FR-009 DoD: full `npm run verify` green; probes in T027 documented as failing when faults planted

**Checkpoint**: Dual gate wired (automated on real CI path + human review that can block merge)

---

## Phase 6: User Story 4 — Fatia permanece utilizável mesmo com migração ampliada (Priority: P2)

**Goal**: Prerequisite migrations may widen the fecho; merge waits for exclusive; each slice keeps the extension usable

**Independent Test**: Docs/checklist state merge-only-when-exclusive; intermediate slices don’t couple new code to legacy; verify/build still loadable after policy landing

### Implementation for User Story 4

- [x] T034 [P] [US4] Document slice strategy in `DEVELOPMENT.md`: prerequisite exclusive migrations before merge; intermediate commits must not import non-exclusive from new code; extension remains loadable each slice (FR-009 / User Story 4)
- [x] T034a [US4] Add “characterization before move” rule to `DEVELOPMENT.md`: when migrating fecho modules that lack tests, add/preserve behavioral tests covering current behavior before the exclusive move (constitution V); cite in PR template H1 as required when scope expands
- [x] T034b [P] [US4] Extend `.github/pull_request_template.md` H1 with checkbox: “Characterization tests added/updated for untested behavior being moved (or N/A: already covered)”
- [x] T035 [P] [US4] Add H1/H6 clarifying notes to `.github/pull_request_template.md` for expanded-fecho PRs (list migrated prerequisites in PR body; H6 smoke blocking when UI touched)
- [x] T036 [US4] Add short “fecho ampliado” acceptance note to `specs/002-ts-zero-legacy/quickstart.md` Scenario D
- [x] T037 [US4] FR-009 DoD: `rm -rf dist && npm run build` + `npm run verify` after doc-only US4 changes

**Checkpoint**: Contributors know how to widen fecho without breaking usability or dual-path-at-merge; untested moves get characterization first

---

## Phase 7: User Story 5 — Agente inspeciona o SEI real quando o DOM importa (Priority: P2)

**Goal**: Agents ask for integrated-browser SEI access when DOM evidence is needed; inspection is ephemeral; no persisted SEI HTML/screenshots

**Independent Test**: Agent/docs require ask-before-guess; PR checklist H5; no SEI page fixtures committed as policy examples

### Implementation for User Story 5

- [x] T038 [P] [US5] Add agent SEI inspection section to `DEVELOPMENT.md` mirroring `specs/002-ts-zero-legacy/contracts/agent-sei-inspection.md` (ask access; ephemeral; never invent DOM; never save HTML/screenshots)
- [x] T039 [P] [US5] Update `.cursor/agents/architecture-verifier.md` with H5 checks (access requested when needed; zero persisted SEI artifacts in diff)
- [x] T040 [US5] Ensure `.github/pull_request_template.md` includes H5 ephemeral-inspection item
- [x] T041 [US5] Add `tests/structure/no-sei-page-fixtures.test.js` failing if new files match forbidden globs (`**/sei-page-*.html`, `**/sei-screenshot*.png`, and equivalents listed in the test) without an explicit allowlist comment/file; globs MUST NOT ban legitimate synthetic DOM fixtures unrelated to real SEI process content
- [x] T042 [US5] FR-009 DoD: `npm run verify` green

**Checkpoint**: Agent + human dual-gate cover ephemeral SEI inspection

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Close docs loop and validate quickstart end-to-end

- [x] T043 [P] Add or update ADR note for exclusive-on-touch policy (extend `docs/adr/0014-typescript-para-codigo-novo.md` or add `docs/adr/0016-exclusive-on-touch.md` if 0014 would bloat) linking contracts + `policy:check`
- [x] T044 [P] Cross-link policy in `docs/architecture.md` measured-state / navigation (pointer to Spec Kit feature `002-ts-zero-legacy`, not duplicate decisions)
- [x] T045 Run full quickstart validation from `specs/002-ts-zero-legacy/quickstart.md` Scenarios A–F; record results in `specs/002-ts-zero-legacy/checklists/quickstart-results.md`
- [x] T046 [P] During `$speckit-implement`, after T045 passes, set `specs/002-ts-zero-legacy/spec.md` Status to `Implemented`
- [x] T047 Final FR-009 DoD: `npm run verify` green on branch

---

## Phase 9: Post-review hardening

**Purpose**: Close adversarial gaps found during cross-artifact and implementation review.

- [x] T048 Make merge-base resolution CI-safe: use PR/push base SHA, fetch full history, and fail closed when the base cannot be resolved.
- [x] T049 Treat any touched product-runtime `.js` as a P1 failure; enforce tooling typing/coupling checks without forcing feature maturity.
- [x] T050 Add deterministic temporary-fixture probes for P0/P1/P2/P4/P6, including stale registry and exclusive→wired imports.
- [x] T051 Make the DOM policy consume the real touched-path resolver and broaden inline-handler detection.
- [x] T052 Align policy contracts, quickstart, contributor guidance, and checklists with the hardened behavior and explicit branch-protection dependency.
- [x] T053 Re-run the complete `npm run verify` suite and record the final regression count.

**Checkpoint**: Review findings are represented by executable probes and the full verification suite remains green.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories
- **US1 (Phase 3)**: Depends on Foundational — **MVP**
- **US2 (Phase 4)**: Depends on Foundational; benefits from US1 policy CLI but can proceed after T008 API exists
- **US3 (Phase 5)**: Depends on US1 gates existing (T018/T011–T013) to integrate into verify
- **US4 (Phase 6)**: Depends on US3 checklist/template existing (or create stub earlier); mostly docs
- **US5 (Phase 7)**: Can parallelize with US4 after US3 template exists
- **Polish (Phase 8)**: After desired stories complete
- **Post-review hardening (Phase 9)**: After Phase 8; closes CI, gate, and probe gaps before final handoff

### User Story Dependencies

- **US1**: After Phase 2 — no story deps — MVP
- **US2**: After Phase 2 — parallelizable with early US1 once helpers exist; ideally after T008
- **US3**: After US1 automated gates (needs `policy:check` on real CI path + T029a/T029b merge docs)
- **US4**: After US3 PR template (H1/H6); includes T034a/T034b characterization-before-move
- **US5**: After US3 checklist shell; T041 required (FR-016); parallel with US4

### Parallel Opportunities

- T002/T003 after T001 started
- T011/T012/T013 in parallel once T008 exists
- T022/T023 in parallel
- T034/T035/T036 in parallel
- T038/T039/T041 in parallel
- T043/T044 in parallel
- US4 + US5 in parallel after US3 template

---

## Parallel Example: User Story 1

```bash
# After Phase 2 (T008), launch US1 tests together:
Task: "Add tests/structure/typescript-boundary.test.js"
Task: "Add tests/structure/touched-ts-nocheck.test.js"
Task: "Add tests/structure/exclusive-closure-policy.test.js"

# Then implement assertions + wire npm script sequentially:
Task: "Implement P3/P4/P5 in scripts/policy/assert-exclusive-closure.mjs"
Task: "Implement P1/P2 typing assertions"
Task: "Add npm run policy:check in package.json"
```

---

## Parallel Example: User Stories 4 + 5

```bash
# After US3 PR template exists:
Task: "Document slice strategy in DEVELOPMENT.md"          # US4
Task: "Add agent SEI inspection section to DEVELOPMENT.md" # US5
Task: "Update architecture-verifier H5"                   # US5
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup  
2. Phase 2 Foundational (helpers + CLI)  
3. Phase 3 US1 (structure tests + exclusive/typing gates + `policy:check`)  
4. **STOP and VALIDATE** with quickstart Scenarios B/D  
5. Then US3 to put the gate on `verify`/CI (strongly recommended before calling the feature “enforced”)

### Incremental Delivery

1. Setup + Foundational → helpers ready  
2. US1 → local policy enforceable (MVP)  
3. US2 → DOM rules + light probe  
4. US3 → dual gate on verify/CI + PR checklist (enforcement)  
5. US4 → expanded-fecho usability guidance  
6. US5 → agent ephemeral SEI rules  
7. Polish → ADR/architecture pointers + quickstart results  

### Suggested MVP scope

**T001–T020 (Phases 1–3)** plus **T028–T030 / T029a–T029b** from US3 so the policy is on the real CI path and human merge-block is documented.

---

## Notes

- [P] = different files, no ordering dependency within the mark
- Do not mark `spec.md` Implemented until quickstart validation (T045) during `$speckit-implement`
- Composition roots may still load untouched non-exclusive features; fecho code must not import them (`contracts/shared-modern-infra.md`)
- Avoid committing SEI HTML dumps even as “test fixtures” (FR-016); use synthetic HTML fixtures unrelated to real process content if DOM tests need markup samples
- Remediation 2026-08-10: C1 characterization-before-move; C2 dual-gate merge block docs; I1 real CI path; U1 required no-sei-page-fixtures; tooling-only probe; shared-modern-infra.mjs only
