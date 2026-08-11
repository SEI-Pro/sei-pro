# Tasks: Migrar Informações Adicionais na Árvore

**Input**: Design documents from `/specs/004-migrate-infoarvore/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluídos — FR-013 / plan exigem testes automatizados de domínio/IO/contratos + smoke SEI por fatia de UI.

**Organization**: Fases por user story (US1 → US2 → US4 → US3 por prioridade P1/P1/P1/P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1–US4)
- Paths are repository-root relative

## Path Conventions

- Feature: `src/features/arvore-info/`
- Peer tree: `src/features/arvore/`
- ACL: `src/sei/`
- Tests: `tests/features/arvore-info/`, `tests/structure/`
- CSS pipeline: `scripts/dist-pipeline.mjs`, `manifest.base.json`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estrutura-alvo e tipos compartilhados sem mudar comportamento ainda

- [x] T001 Create `src/features/arvore-info/domain.ts` with canonical section ids, preference storage key `configViewFlashPanelArvorePro`, and section state union per `specs/004-migrate-infoarvore/data-model.md`
- [x] T002 [P] Create empty `src/features/arvore-info/arvore-info.css` with a header comment stating it will become the visual source of truth for the panel
- [x] T003 [P] Add `tests/features/arvore-info/domain.test.js` asserting canonical section id list and default preference semantics (empty → all enabled)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Fecho honesto + characterization + tipagem das camadas puras — MUST complete before user stories

**⚠️ CRITICAL**: No user story work until this phase is complete

- [x] T004 Extend `tests/features/arvore-info/ctx-wiring.test.js` (or add `tests/features/arvore-info/config-gate.test.js`) to characterize: panel install respects `infoarvore` on/off without changing product behavior yet
- [x] T005 Add `tests/features/arvore-info/section-preference.test.js` characterizing current filter behavior for `configViewFlashPanelArvorePro` (missing/empty → all; subset → only those ids)
- [x] T006 Extract non-`infoarvore` tree enrichers (`duaslinhas`, `numerar_documentos`, `urgente`, `tag`) from `src/features/arvore-info/index.ts` into `src/features/arvore/tree-enrichers.ts` (or equivalent under `src/features/arvore/`)
- [x] T007 Wire extracted enrichers from `src/features/arvore/boot.ts` or `src/features/arvore/index.ts` so tree observation/`__SEI_PRO_TREE_BOOT__` contract remains usable; remove their registration from `installArvoreInfo` in `src/features/arvore-info/index.ts`
- [x] T008 Update `tests/features/arvore-info/ctx-wiring.test.js` (and any `arvore` wiring tests) so `arvore-info` install is panel-only and enrichers are owned by `arvore`
- [x] T009 [P] Move SEI selectors/URLs used by the panel from `src/features/arvore-info/**` into `src/sei/selectors.ts` and/or a dedicated `src/sei/` module (e.g. tree panel anchors, `#frmArvore`, toolbar action patterns)
- [x] T010 Update `src/features/arvore-info/index.ts` and `src/features/arvore-info/sections/*.ts` to import selectors from `src/sei/` instead of hardcoding
- [x] T011 Shrink `arvore-info` entries in `tests/structure/sei-acl.test.js` allowlist to match remaining justified exceptions only
- [x] T012 [P] Remove `@ts-nocheck` and type `src/features/arvore-info/parse/*.ts` (keep behavior verbatim); keep `tests/features/arvore-info/parse.test.js` and `sections-parse.test.js` green
- [x] T013 [P] Remove `@ts-nocheck` and type `src/features/arvore-info/io.ts`; keep `tests/features/arvore-info/io.test.js` green
- [x] T014 [P] Remove `@ts-nocheck` and type `src/features/arvore-info/dom/caret.ts` and `src/features/arvore-info/dom/confirm.ts`
- [x] T015 Replace optional `win.SeiPro.core.texto.normalizeMojibakeUtf8` fallback in `src/features/arvore-info/index.ts` with ESM import from `src/core/texto.js`

**Checkpoint**: Enrichers extracted; ACL imports in place; parse/io/dom typed; characterization tests green — story work can begin

---

## Phase 3: User Story 1 — Ver informações do processo junto à árvore (Priority: P1) 🎯 MVP

**Goal**: Painel monta/desmonta com `infoarvore` e exibe seções (leitura) com estados explícitos, sem regressão de produto

**Independent Test**: Quickstart A — opção ligada → painel com seções; desligada → ausente; sem duplicata

### Tests for User Story 1

- [x] T016 [P] [US1] Add `tests/features/arvore-info/panel-mount.test.js` covering single mount, `infoarvore` off → no panel, and section empty/unavailable state helpers using fixtures (no live SEI)
- [x] T017 [P] [US1] Extend `tests/features/arvore-info/sections-parse.test.js` (or add fixtures) for empty interessados/assuntos/obs paths used by read-only sections

### Implementation for User Story 1

- [x] T018 [US1] Extract panel mount/refresh/orchestration from `src/features/arvore-info/index.ts` into `src/features/arvore-info/panel.ts` (install remains the composition entry)
- [x] T019 [US1] Implement panel root scaffold in `src/features/arvore-info/panel.ts` with semantic structure (`section`/headings as appropriate) and native controls for chrome; no new inline handlers
- [x] T020 [US1] Rewrite read-only consulta-driven rendering in `src/features/arvore-info/sections/consulta.ts` to use `textContent`/`createElement` (no SEI HTML string concat into `innerHTML`)
- [x] T021 [US1] Ensure isolated section failure in `src/features/arvore-info/panel.ts` / sections does not prevent sibling sections from rendering
- [x] T022 [US1] Gate mount exclusively on `infoarvore` via modern config check path in `src/features/arvore-info/panel.ts` / `index.ts` (preserve stub-parent degrade behavior only where still required for readiness)
- [ ] T023 [US1] Run quickstart scenario A in `specs/004-migrate-infoarvore/quickstart.md` on real SEI and record pass/fail in `.github/pull_request_template.md` checklist (no SEI HTML committed)

**Checkpoint**: MVP — painel de leitura utilizável com opção on/off

---

## Phase 4: User Story 2 — Personalizar quais informações aparecem (Priority: P1)

**Goal**: Preferência de seções respeitada na montagem; default = todas

**Independent Test**: Quickstart B — subset oculto; restore → completo

### Tests for User Story 2

- [x] T024 [P] [US2] Expand `tests/features/arvore-info/section-preference.test.js` to lock contract in `specs/004-migrate-infoarvore/contracts/section-preference.md` (unknown ids ignored; empty → all)

### Implementation for User Story 2

- [x] T025 [US2] Implement preference reader facade in `src/features/arvore-info/preference.ts` (or `domain.ts` + thin IO) reading `configViewFlashPanelArvorePro` without changing the menus-rapidos writer UI
- [x] T026 [US2] Wire `src/features/arvore-info/panel.ts` to filter sections solely through the preference facade
- [ ] T027 [US2] Run quickstart scenario B in `specs/004-migrate-infoarvore/quickstart.md` on real SEI and record pass/fail in `.github/pull_request_template.md` checklist

**Checkpoint**: US1 + US2 — personalização estável

---

## Phase 5: User Story 4 — Capacidade isolada (HTML/DOM/CSS/TS) (Priority: P1)

**Goal**: CSS próprio, markup/DOM alinhados, fecho tipado sem `@ts-nocheck`, isolation contract satisfeito

**Independent Test**: Quickstart D + `policy:check` + zero `@ts-nocheck` under `src/features/arvore-info/`

### Tests for User Story 4

- [x] T028 [P] [US4] Add `tests/structure/arvore-info-css-prefix.test.js` asserting `src/features/arvore-info/arvore-info.css` exists, uses `.seipro-` classes, and is listed in `scripts/dist-pipeline.mjs`
- [x] T029 [P] [US4] Add structure assert (new test or extend existing) that `src/features/arvore-info/**/*.ts` contains zero `@ts-nocheck`

### Implementation for User Story 4

- [x] T030 [US4] Migrate `.panelDadosArvore*` rules from `src/css/sei-pro.css` into `src/features/arvore-info/arvore-info.css` with `.seipro-*` BEM naming as needed for the panel
- [x] T031 [P] [US4] Move panel annotation styles (`seipro-anot-*`) from `src/features/arvore/style.css` into `src/features/arvore-info/arvore-info.css`
- [x] T032 [P] [US4] Migrate dark-mode panel rules from `src/css/sei-slim.css` into `src/features/arvore-info/arvore-info.css` (or feature-owned dark hooks consistent with project pattern)
- [x] T033 [US4] Register CSS copy in `scripts/dist-pipeline.mjs` (`src/features/arvore-info/arvore-info.css` → `dist/css/arvore-info.css`) and wire `manifest.base.json` / `tests/structure/manifest-contexts.snapshot.json` for the `arvore` context
- [x] T034 [US4] Ensure `dist/css/arvore-info.css` loads in the tree iframe via `src/entries/arvore.ts` and/or `src/features/arvore-info/` inject (same pattern as `src/features/arvore/style.css` / monitorados); remove reliance on `src/css/sei-pro.css` as source of truth
- [x] T035 [US4] Replace remaining inline `style.cssText` on panel chrome in `src/features/arvore-info/panel.ts` and read-path sections with classes from `arvore-info.css`
- [x] T036 [US4] Remove `@ts-nocheck` from `src/features/arvore-info/index.ts`, `panel.ts`, and any remaining read-path section files still unchecked after US1
- [x] T037 [US4] If SEI HTML fragments must be re-hosted, route through centralized ACL sanitization in `src/sei/` and assert no raw concat path remains in read-path renderers
- [ ] T038 [US4] Run `npm run policy:check` (arvore-info P2 clean) and quickstart scenario D in `specs/004-migrate-infoarvore/quickstart.md` on real SEI; fix fecho imports under `src/features/arvore-info/` to exclusive + allowlisted infra only

**Checkpoint**: Isolation contract largely met for display path (edit path may still finish in US3)

---

## Phase 6: User Story 3 — Consultar/atualizar no painel (Priority: P2)

**Goal**: Fluxos inline existentes preservados com DOM seguro, cancel/save/fail isolados

**Independent Test**: Quickstart C — cancel restaura; save atualiza seção; falha não derruba irmãs

### Tests for User Story 3

- [x] T039 [P] [US3] Add `tests/features/arvore-info/inline-edit-state.test.js` for cancel→restore and failed save leaving siblings untouched (harness/mocks, no live SEI)
- [x] T040 [P] [US3] Extend `tests/features/arvore-info/io.test.js` for cache invalidate-after-submit behavior used by edit flows

### Implementation for User Story 3

- [x] T041 [P] [US3] Rewrite inline edit UI in `src/features/arvore-info/sections/atribuicao.ts` with native `select`/`button`, class-based styles, no unsafe `innerHTML` for SEI-derived text
- [x] T042 [P] [US3] Rewrite `src/features/arvore-info/sections/marcador.ts` edit/remove controls to native DOM + `arvore-info.css` classes
- [x] T043 [P] [US3] Rewrite `src/features/arvore-info/sections/acompanhamento.ts` likewise
- [x] T044 [US3] Rewrite `src/features/arvore-info/sections/anotacao.ts` editor chrome (keep contenteditable model) with typed caret helpers, native action buttons, class-based styles, safe text handling
- [x] T045 [US3] Migrate tipo/other inline editors still in `src/features/arvore-info/index.ts` or `panel.ts` to the same DOM/CSS rules
- [x] T046 [US3] Remove any remaining `@ts-nocheck` under `src/features/arvore-info/` left from edit sections
- [ ] T047 [US3] Run quickstart scenario C in `specs/004-migrate-infoarvore/quickstart.md` on real SEI and record pass/fail in `.github/pull_request_template.md` checklist

**Checkpoint**: All user stories independently demonstrable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Limpeza documental e remoção de dívida residual

- [x] T048 Delete migrated panel rules from `src/css/sei-pro.css` and obsolete dark rules from `src/css/sei-slim.css` after verifying `arvore-info.css` covers them
- [x] T049 [P] Remove duplicated annotation panel rules from `src/features/arvore/style.css` if fully moved; keep only styles still owned by `arvore`
- [x] T050 [P] Optional honesty note in `docs/capabilities-map.md` that `DADOSPROCESSO.md` is not part of the `infoarvore` runtime fecho (inventory only — no runtime change)
- [x] T051 Confirm `src/features/arvore-info/feature.ts` still `exclusive` + `infoarvore` and install points at panel-only composition
- [x] T052 Run automated suite: `npm test -- tests/features/arvore-info`, structure CSS/ACL tests, `npm run build`; record remaining SEI smoke status in `specs/004-migrate-infoarvore/checklists/quickstart-results.md`
- [x] T053 [P] Update measured blurb in `docs/architecture.md` or `DEVELOPMENT.md` only if this delivery changes a documented measured claim about `arvore-info` debt

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories
- **US1 (Phase 3)**: After Foundational — MVP
- **US2 (Phase 4)**: After Foundational; ideally after US1 panel extraction (T018) so filter wires into `panel.ts`
- **US4 (Phase 5)**: After Foundational; can overlap late US1/US2 once panel exists; CSS load should precede large style cleanups in US3
- **US3 (Phase 6)**: After US1 panel/sections exist; best after US4 CSS is loadable so edit UIs use classes
- **Polish (Phase 7)**: After desired stories complete

### User Story Dependencies

- **US1**: No dependency on other stories
- **US2**: Soft dependency on US1 `panel.ts` for clean wiring
- **US4**: Soft dependency on US1 for meaningful CSS/DOM migration of real markup
- **US3**: Depends on US1 section hosts; preferred after US4 CSS pipeline

### Within Each Story

- Tests first (fail or characterize) → implementation → smoke when UI touched
- Remove `@ts-nocheck` in the same commit as the file edit (constituição IV)

### Parallel Opportunities

- Phase 1: T002 ∥ T003
- Phase 2: T012 ∥ T013 ∥ T014; T009 can proceed beside enricher extract after T006 planning
- US1: T016 ∥ T017
- US3: T041 ∥ T042 ∥ T043 after T039/T040
- Polish: T049 ∥ T050 ∥ T053

---

## Parallel Example: User Story 1

```bash
# Tests in parallel:
Task: "Add tests/features/arvore-info/panel-mount.test.js …"
Task: "Extend tests/features/arvore-info/sections-parse.test.js …"

# Then sequential implementation:
Task: "Extract panel.ts from index.ts"
Task: "Rewrite consulta.ts safe DOM"
Task: "Quickstart A smoke"
```

## Parallel Example: User Story 3

```bash
# After state/io tests:
Task: "Rewrite sections/atribuicao.ts …"
Task: "Rewrite sections/marcador.ts …"
Task: "Rewrite sections/acompanhamento.ts …"
# Then anotacao (largest) + tipo leftovers
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup  
2. Phase 2 Foundational (enrichers out, ACL, typed parse/io)  
3. Phase 3 US1 panel read path  
4. **STOP** — validate Quickstart A + automated tests  

### Incremental Delivery

1. Setup + Foundational → honest fecho boundary  
2. US1 → painel on/off (MVP)  
3. US2 → personalização  
4. US4 → CSS/DOM/TS isolation for display  
5. US3 → inline edits preserved  
6. Polish → delete monolito leftovers + verify gate  

### Parallel Team Strategy

- After Foundational: Dev A on US1/US2 panel+preference; Dev B on US4 CSS pipeline/manifest; then converge before US3 edit rewrites  

---

## Notes

- Preserve observable product behavior (FR-007); no bugfix scope beyond migration needs  
- Do not migrate `DADOSPROCESSO` or menus personalization UI writers  
- The annotation editor remains contenteditable as existing product behavior; only its controls, typing, styling, and safe rendering are modernized  
- Each fatia: `npm test` relevant + build green; UI fatias need SEI smoke  
- Commit after each task or tight group; never leave `@ts-nocheck` on a touched file

## Phase 8: Convergence

- [x] T054 Move ownership of the tree enrichment pipeline and `installTreeEnrichers` from `src/features/arvore-info/index.ts` into the `arvore` peer composition root (`src/features/arvore/tree-pipeline.ts` + `src/features/arvore/install-tree.ts` + `feature.ts`), leaving `arvore-info` panel-only per FR-008
- [x] T055 Replace interactive annotation `<i>` elements and `role="button"` shims in `src/features/arvore-info/sections/anotacao.ts` with native `button type="button"` controls while preserving the existing actions and icon presentation per FR-010
- [x] T056 Make `tests/structure/touched-dom-policy.test.js` pass for the `arvore-info` scope by narrowing its matcher to real HTML attribute assignments (`on*=\s*['"\`]`) without rejecting callback identifiers like `onDone` / `onclickAttr` per FR-013
