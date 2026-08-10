# Tasks: Pasta `dist` Gerada pelo Build

**Input**: Design documents from `/specs/001-build-generated-dist/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included — FR-007 / constitution Principle IV require executable fitness functions (verify-gate contract).

**Organization**: Phases by user story (US1 → US2 → US3); each slice MUST leave loadable `dist` (FR-010).

**Glossary**: Prefer **official build** = `npm run build` (non-watch). **Declared outputs** = union returned by `listDeclaredDistOutputs` (“produzidos pelo build”).

**MVP boundary (analyze I2)**: Phases 1–3 deliver clean wipe + loadable `dist` (FR-001, FR-003, FR-004a). **FR-004b / SC-002a bit-identity is US3-only** — T014 may prep deterministic esbuild options, but the hard gate is T023/T026.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label ([US1], [US2], [US3])
- Include exact file paths in descriptions

## Path Conventions

- Build tooling: `scripts/`
- Structure gates: `tests/structure/`
- Docs: `DEVELOPMENT.md`, `docs/adr/0011-dist-fora-do-versionamento.md`
- Feature docs: `specs/001-build-generated-dist/`

### FR-010 slice DoD (required at every phase checkpoint)

Before merging a slice: `rm -rf dist && npm run build` succeeds; `dist/manifest.json` exists; required manifest refs resolve under `dist/`; targeted tests for that phase pass. Optional unpacked load in Chromium is manual smoke when UI-adjacent; for this feature, manifest+required-refs check is the automated proxy for “loadable”.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline for greenfield rediscovery without changing runtime behavior yet

- [x] T001 Capture current official-build output inventory (file count + sample `dist/manifest.json` refs) in `specs/001-build-generated-dist/checklists/baseline-dist.md` after `rm -rf dist && npm run build`
- [x] T002 [P] List gaps vs contracts in `specs/001-build-generated-dist/checklists/baseline-dist.md` (no full wipe today; no bit-identity test; soft `audit:dist` exit; `obsoleteOutputs` allowlist in `scripts/build.mjs`)
- [x] T003 [P] Confirm `.gitignore` contains `/dist/` and `git ls-files dist` is empty; note result in `specs/001-build-generated-dist/checklists/baseline-dist.md`

**FR-010 checkpoint**: Baseline build left a loadable `dist/` (inventory in T001 implies build succeeded).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Single declared-outputs API shared by build, audit, and tests — MUST finish before story work

**⚠️ CRITICAL**: No user story work begins until this phase is complete

- [x] T004 Add `listDeclaredDistOutputs(root)` (and related helpers) exporting the full legal `dist/` file set in `scripts/asset-manifest.mjs` (static pairs/dirs + documented extension points for bundles/legacy/css/html/manifest)
- [x] T005 Move optional-resource allowlist with mandatory reasons into `scripts/asset-manifest.mjs` (or `scripts/dist-optionals.mjs` imported by tests) so `tests/structure/dist-reproducible.test.js` and audit share one source
- [x] T006 Refactor `scripts/audit-dist-sources.mjs` to (a) compute “produzidos pelo build” only via `listDeclaredDistOutputs` / shared helpers, and (b) **`process.exit(1)` when any undeclared file exists** so CI `npm run audit:dist` enforces G5 (analyze I1 — do not leave audit soft-fail)
- [x] T007 Wire `scripts/build.mjs` generation lists (bundles, `legacyFiles`, `featureCss`, `htmlFiles`, `extraFiles`, `syncManifest`) so they register into the same declared-outputs helper used by T004
- [x] T008 Run `npm run audit:dist` and `npx vitest run tests/structure/dist-reproducible.test.js tests/structure/no-dist-in-git.test.js` and fix any drift introduced by the shared API; confirm FR-010 slice DoD (loadable `dist`)

**Checkpoint**: Declared-outputs API is the single definition of “produced by build”; audit hard-fails on orphans; existing structure tests still pass; FR-010 DoD met

---

## Phase 3: User Story 1 — Clone limpo produz extensão completa (Priority: P1) 🎯 MVP

**Goal**: Official `npm run build` wipes/recreates `dist/` so a clean clone (or dirty tree) yields a complete, loadable extension tree with no leftovers

**Independent Test**: `rm -rf dist && npm run build` → required manifest paths exist; plant orphan under `dist/`, rebuild → orphan gone (quickstart Scenarios A–B)

**MVP excludes**: FR-004b / SC-002a (bit-identity) — deferred to US3

### Tests for User Story 1

- [x] T009 [P] [US1] Add structure test in `tests/structure/dist-clean-tree.test.js` that **does not rely on pretest alone**: inside the test, write an orphan under `dist/`, then invoke official build via `execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: root })` (or equivalent), then assert the orphan path is absent and required manifest refs exist (analyze U1)
- [x] T010 [P] [US1] Extend `tests/structure/dist-reproducible.test.js` to assert every file under `dist/` is ∈ `listDeclaredDistOutputs` after pretest build

### Implementation for User Story 1

- [x] T011 [US1] Implement full `dist/` wipe (or atomic replace) at start of non-watch official build in `scripts/build.mjs` per `contracts/build-command.md`
- [x] T012 [US1] Ensure watch path in `scripts/build.mjs` does not claim gate-quality output (no full wipe required; comment + behavior aligned with research R5)
- [x] T013 [US1] Remove primary reliance on `obsoleteOutputs` allowlist in `scripts/build.mjs` once wipe guarantees cleanliness (delete list or reduce to documented no-op)
- [x] T014 [US1] Prep deterministic esbuild options in `scripts/build.mjs` for official builds (no absolute-path metadata; readable IIFE, `minify: false` preserved) — **best-effort for US1; bit-identity hard gate remains T023/T026**
- [x] T015 [US1] Verify FR-010 slice DoD after wipe: `rm -rf dist && npm run build`; confirm `dist/manifest.json` + required refs; fix any missing copies (manual Chromium unpacked load optional smoke)
- [x] T016 [US1] Make T009–T010 pass; run `npm run audit:dist` with zero SEM FONTE and exit 0

**Checkpoint**: US1 done — clean official build, no leftovers, extension loadable (MVP). Bit-identity not required yet.

---

## Phase 4: User Story 2 — Nenhum arquivo de `dist` é fonte editável (Priority: P1)

**Goal**: `dist/` stays out of git and is never the place to add/edit assets; contributors change sources + mapping only

**Independent Test**: `git ls-files dist` empty; docs forbid hand-editing `dist/`; new asset path is `vendor|src|assets` + manifest entry

### Tests for User Story 2

- [x] T017 [P] [US2] Keep/strengthen assertions in `tests/structure/no-dist-in-git.test.js` (tracked empty + `git check-ignore --no-index` for `dist/manifest.json`)
- [x] T018 [P] [US2] Add structure assertion that every `ALL_FILE_PAIRS`/`ASSET_DIRS` source matches `^(src|vendor|assets)/` in `tests/structure/dist-reproducible.test.js` (already partially present — close any gaps)

### Implementation for User Story 2

- [x] T019 [US2] Align onboarding language in `DEVELOPMENT.md` with FR-005/FR-006 (clone has no `dist`; never edit `dist/`; declare pairs in `scripts/asset-manifest.mjs`; note `rm -rf dist` as accepted clean-tree proxy for FR-003)
- [x] T020 [US2] Cross-link build rules in `docs/adr/0011-dist-fora-do-versionamento.md` verification section to the new clean-tree + declared-outputs gates (status note: greenfield rediscovery under Spec Kit)
- [x] T021 [US2] Ensure `package.json` script comments (`//build`) and `scripts/asset-manifest.mjs` header state the same “never create files only in dist” rule
- [x] T022 [US2] Confirm ignore rules in `.gitignore` for `/dist/`, `dist.zip`, `dist-temp/` remain correct after pipeline changes
- [x] T035 [P] [US2] Document FR-008 constraint on existing `scripts/package-extension.sh`: packaging MUST consume official-build `dist/` only; add a short comment in that script and a sentence in `DEVELOPMENT.md` — **do not rebuild a release pipeline** (analyze G1)
- [x] T036 [US2] Re-run FR-010 slice DoD after US2 doc/ignore changes (`rm -rf dist && npm run build` + required refs) and note in `specs/001-build-generated-dist/checklists/baseline-dist.md` or a US2 checkpoint line

**Checkpoint**: US2 done — policy + gates prevent treating `dist` as source; FR-008 constraint documented; FR-010 DoD met

---

## Phase 5: User Story 3 — CI e contribuinte detectam regressão (Priority: P2)

**Goal**: Verify/CI fail closed on orphans, missing required outputs, tracked `dist`, and non-bit-identical clean rebuilds

**Independent Test**: Intentional orphan / omitted output / divergent double-build → `npm run verify` (or targeted structure tests) fails; fix restores green (quickstart Scenario E)

### Tests for User Story 3

- [x] T024 [US3] **First in US3 (analyze I1)**: Confirm `node scripts/audit-dist-sources.mjs` exits non-zero with an planted orphan (depends on T006); if gaps remain, finish hard-fail + clear SEM FONTE messaging in `scripts/audit-dist-sources.mjs`
- [x] T023 [P] [US3] Add bit-identity structure test (two clean official builds, recursive compare) in `tests/structure/dist-bit-identical.test.js` per `contracts/verify-gate.md` G6 — **this is the FR-004b / SC-002a gate**
- [x] T025 [US3] Ensure `npm run verify` in `package.json` runs structure suite + `audit:dist` such that G1–G6 from `contracts/verify-gate.md` are covered (extend script chain if a gap remains)

### Implementation for User Story 3

- [x] T026 [US3] Fix any non-determinism revealed by T023 (esbuild options / post-normalize in `scripts/build.mjs`) until double-build diff is empty
- [x] T027 [US3] Confirm `.github/workflows/ci.yml` runs build + tests + `audit:dist` and that orphan hard-fail (T006/T024) would fail the job; align with `npm run verify` coverage if jobs drift
- [x] T028 [US3] Document gate IDs and failure meanings briefly in `DEVELOPMENT.md` (pointer to `specs/001-build-generated-dist/contracts/verify-gate.md`)
- [x] T029 [US3] Run negative probes from `specs/001-build-generated-dist/quickstart.md` Scenario E and record pass/fail notes in `specs/001-build-generated-dist/checklists/verify-probes.md`
- [x] T037 [US3] Re-run FR-010 slice DoD after bit-identity work; confirm loadable `dist` still produced

**Checkpoint**: US3 done — regressions fail the portão automatically (including bit-identity); FR-010 DoD met

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Close greenfield Definition of Done; docs and cleanup across stories

- [x] T030 [P] Execute full `specs/001-build-generated-dist/quickstart.md` Scenarios A–F; for Scenario F note approximate time-to-first-`dist` (SC-006 qualitative); tick results in `specs/001-build-generated-dist/checklists/quickstart-results.md`
- [x] T031 [P] Update `docs/architecture.md` measured note for `dist/` reproducibility / gates if the architecture dashboard tracks ADR-0011 status
- [x] T032 Remove dead rescue-only references that imply `dist` can be source (e.g. stale comments in `scripts/rescue-dist-assets.mjs` header if misleading) without deleting historical scripts unless unused
- [x] T033 Run full `npm run verify` on a clean tree and fix any residual failures
- [x] T034 Mark feature readiness in `specs/001-build-generated-dist/spec.md` Status field (`Draft` → `Implemented`) after verify is green

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories; **T006 hard-fail audit is required before trusting CI G5**
- **US1 (Phase 3)**: Depends on Foundational — MVP (**excludes bit-identity**)
- **US2 (Phase 4)**: Depends on Foundational; ideally after US1 wipe exists so docs match behavior
- **US3 (Phase 5)**: Depends on Foundational + US1 clean build; **start with T024**, then T023/T026 for FR-004b
- **Polish (Phase 6)**: Depends on US1–US3 desired scope complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependency on US2/US3
- **US2 (P1)**: After Phase 2 — independently testable; docs stronger after US1
- **US3 (P2)**: After US1 for G5/G6 meaningfulness; T024 validates T006 in CI context

### Within Each User Story

- Tests marked first SHOULD fail before implementation where new behavior is introduced
- Each phase ends with FR-010 slice DoD + green targeted tests

### Parallel Opportunities

- T002 ∥ T003 after T001 inventory command
- T009 ∥ T010 (US1 tests)
- T017 ∥ T018 (US2 tests)
- T023 ∥ T035 (bit-identity test authoring ∥ package-extension docs) once US1 wipe landed
- T030 ∥ T031 (polish docs)
- US2 doc tasks (T019–T021) can overlap US3 after T024 if staffing allows

---

## Parallel Example: User Story 1

```bash
# After Phase 2 checkpoint, launch US1 tests together:
Task: "dist-clean-tree.test.js invokes scripts/build.mjs itself after planting orphan"
Task: "Extend dist-reproducible.test.js for declared-outputs membership"

# Then implement wipe sequentially in scripts/build.mjs (T011→T013); T014 prep only
```

---

## Parallel Example: User Story 3

```bash
# Start US3 with hard-fail confirmation:
Task: "Confirm audit-dist-sources.mjs exits non-zero on orphan (T024)"

# Then bit-identity:
Task: "Add dist-bit-identical.test.js (T023)"
Task: "Fix determinism until empty diff (T026)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup  
2. Phase 2 Foundational (shared declared outputs + **audit exit 1 on orphans**)  
3. Phase 3 US1 (wipe + loadable clean `dist`) — **not** bit-identity  
4. **STOP and VALIDATE** quickstart A–B + FR-010 DoD  
5. Merge slice if CI green  

### Incremental Delivery

1. Setup + Foundational → shared inventory + hard-fail audit  
2. US1 → clean complete `dist` (MVP)  
3. US2 → policy/docs + git gates + FR-008 note on `package-extension.sh`  
4. US3 → bit-identity (FR-004b) + verify/CI alignment  
5. Polish → quickstart A–F + `Implemented` status  

### Parallel Team Strategy

1. Pair on Phase 2 (shared API touches build + audit + tests)  
2. After Phase 2: Dev A finishes US1; Dev B drafts US2 docs + T035; then US3 gates  

---

## Notes

- Packaging/zip/release **pipeline rebuild** is out of scope; **T035** only documents FR-008 on existing `scripts/package-extension.sh`  
- Do not reintroduce Vite/CRXJS as part of this feature (research R7)  
- Vendor `VERSION.txt` = `desconhecida` and CSS split remain non-blocking  
- Commit after each slice that meets FR-010 DoD  
- Avoid editing `dist/` by hand during implementation  
- FR-003 clean-tree proxy: `rm -rf dist` on a normal checkout (not a full OS-level clean clone) unless docker verify is used  

## Analyze remediation log (2026-08-10)

| Finding | Change |
|---------|--------|
| U1 | T009 must invoke `scripts/build.mjs` in-test after planting orphan |
| I1 | T006 exits 1 on orphans; T024 confirms; T027 checks CI |
| G1 | T035 documents FR-008 on `package-extension.sh` |
| U2 | FR-010 DoD section + T008/T015/T036/T037 checkpoints |
| I2 | MVP boundary excludes FR-004b; T014 prep-only; T023/T026 own bit-identity |

## Task Summary

| Metric | Count |
|--------|-------|
| **Total tasks** | 37 (T001–T034, T035–T037) |
| **Phase 1 Setup** | 3 |
| **Phase 2 Foundational** | 5 |
| **US1** | 8 (T009–T016) |
| **US2** | 8 (T017–T022, T035–T036) |
| **US3** | 8 (T023–T029, T037; T024 ordered first) |
| **Polish** | 5 (T030–T034) |
| **Parallelizable marked [P]** | 15 |

**MVP scope**: Phases 1–3 (through US1 / T016) — excludes bit-identity  
**Format validation**: All tasks use `- [ ]`, Task IDs, story labels on US phases, file paths included
