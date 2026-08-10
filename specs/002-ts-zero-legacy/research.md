# Research: Código Novo Sem Legado (TypeScript na Arquitetura Moderna)

**Feature**: `002-ts-zero-legacy` | **Date**: 2026-08-10

## R1 — Definition of legacy for gates (clarification B)

**Decision**: Operational legacy = anything **not** installed as a modern feature with `maturity: 'exclusive'`, except an explicit **shared modern infra** allowlist (`src/core`, `src/sei`, `src/platform`, `src/shared`, `src/config`, `src/app` boot/registry helpers, and composition roots under `src/entries` under documented rules). `declared` / `wired` features, bootstrap/content legacy loaders, and banned globals count as legacy for the touched closure.

**Rationale**: Matches clarification Option B and FR-014. Maturity is already parsed by `scripts/lib/scan-feature-descriptors.mjs` and drives registries.

**Alternatives considered**:
- Path denylist only (bootstrap, core-stack, verbatim) — incomplete; wired features would look “modern” while still parallel-legacy.
- Reviewer judgment only — fails Constitution IV.
- Treat all of `src/features/*` as allowed regardless of maturity — contradicts exclusive requirement.

## R2 — Exclusive closure before merge (clarification D)

**Decision**: On any material product-runtime change, the **dependency closure** of touched product behavior MUST be `exclusive` before merge: descriptors set to `exclusive`, no parallel auto-boot/legacy path for that closure, and no imports/calls from closure code into non-exclusive surfaces. Intermediate commits may migrate prerequisites; merge of the requested change waits for exclusive closure.

**Rationale**: Clarification D. Aligns with “só exclusive conta como migrada” while allowing other untouched features to remain wired/declared.

**Alternatives considered**:
- Dual-path OK if new code does not import legacy (clarification A/C) — rejected by user.
- Whole-extension exclusive on any touch — too large; fecho is the unit.

## R3 — Diff-aware policy gate vs whole-tree ratchets

**Decision**: Keep existing whole-tree ratchets (debt ceilings). Add a **diff-aware** policy gate that: (1) detects touched product-runtime paths via `git diff` against the merge base (or explicit path list in local probes); (2) if no product-runtime paths → policy exclusive-closure checks skip (docs-only); (3) if product-runtime paths → resolve owning features + import graph closure; (4) assert maturity exclusive, no `@ts-nocheck` on touched TS, no coupling to non-exclusive, no new `.js` product sources in the change set.

**Rationale**: Spec is about “a partir de agora” on deliveries, not overnight exclusive of the whole tree. Whole-tree ratchets alone cannot express “this PR’s closure”.

**Alternatives considered**:
- Only lower global ratchets — does not enforce per-PR exclusive closure.
- Require exclusive for all 37 features immediately — out of scope / breaks honest migration.
- Manual-only PR checklist — insufficient for FR-008 automated half.

## R4 — Detecting product-runtime vs docs-only (clarification B on trigger)

**Decision**: Product-runtime paths = changes under `src/` that affect extension runtime (features, core, sei, platform, shared, config, app, entries, background, options, content/bootstrap if still present as runtime), plus `manifest.base.json` when it changes runtime surface. **Exclude**: `docs/**`, `specs/**`, `*.md` at root (except when paired with runtime — then runtime drives the gate), pure comment-only is still `src/` → in scope if file is product code. Tests/tooling under `tests/` and `scripts/`: must stay typed / non-coupled when changed, but do **not** alone force a feature to exclusive unless they accompany `src/` runtime changes (FR-017).

**Rationale**: Clarification on trigger scope.

**Alternatives considered**:
- Any repo file triggers exclusive — rejected.
- Only user-visible behavior — too fuzzy for CI.

## R5 — Shared modern infra allowlist

**Decision**: Publish a single contract file (see `contracts/shared-modern-infra.md`) listing allowlisted roots. Infra itself MUST NOT import non-exclusive features. Composition roots (`src/entries/**`) MAY still *load* untouched non-exclusive features for the rest of the product, but code inside the **touched exclusive closure** MUST NOT import those non-exclusive modules.

**Rationale**: Spec assumptions; composition roots must keep the extension usable (FR-009) while the touched fecho stays clean.

**Alternatives considered**:
- Ban entries from referencing any non-exclusive forever — would force whole-tree exclusive.
- Allow exclusive features to import wired “just this once” — rejected by FR-003/014.

## R6 — TypeScript honesty (ADR-0014 completion)

**Decision**: Implement missing `tests/structure/typescript-boundary.test.js` (and related) as required by ADR-0014: product sources under gate are `.ts`; no new product `.js` in touched set; `@ts-nocheck` inventory/ratchet remains; add shrink-only (or zero-new) discipline for `any` / `as any` / `@ts-ignore` on touched files. Touched files that still have `@ts-nocheck` fail the policy gate.

**Rationale**: Constitution IV + FR-001/010; ADR-0014 verification still incomplete.

**Alternatives considered**:
- Rely on `tsc` alone — does not stop `@ts-nocheck` on touched files.
- Ban all `@ts-nocheck` repo-wide in this feature — larger than “a partir de agora”; ratchet already manages stock.

## R7 — Dual gate: automated + human (clarification C)

**Decision**: Automated half = `npm run verify` (existing) **plus** new structure policy tests always on in CI. Human half = required PR checklist (policy items from FR-015) + architecture-verifier agent criteria updated to 002; merge MUST NOT proceed on CI green alone when policy checklist unchecked (process/branch protection documentation). Automate what is mechanical; leave exclusive-honesty edge cases, DOM semantics, and fecho honesty to humans.

**Rationale**: Clarification C; architecture-verifier already exists for judgment CI cannot make.

**Alternatives considered**:
- CI only / human only — rejected.
- Optional human for UI only — rejected.

## R8 — Agent SEI inspection (clarification A / FR-011/016)

**Decision**: Encode in agent/developer guidance: when DOM of a real SEI page is needed and evidence is insufficient, ask for integrated-browser access and inspect ephemerally; never invent structure; never save HTML/screenshots/process content to repo, fixtures, or durable attachments. If access blocked, stop DOM-dependent delivery rather than persist alternative dumps.

**Rationale**: Clarifications + FR-016 superseded earlier “human HTML export” assumption.

**Alternatives considered**:
- Allow committed structural snippets — rejected (A).
- Allow session chat retention of full HTML as durable artifact — still “persist”; keep guidance as no durable save; chat buffer is not a repo fixture (human session controls retention).

## R9 — Maturity honesty beyond the string

**Decision**: Policy gate MUST combine: (1) descriptor `maturity === 'exclusive'`; (2) feature id appears in generated exclusive context registries as expected; (3) no import edges from exclusive closure into non-exclusive feature modules or known legacy loaders; (4) human review confirms no parallel auto-boot left for that fecho when automation cannot see dynamic loads.

**Rationale**: Today maturity is largely self-declared; exclusive-closure policy fails without honesty checks.

**Alternatives considered**:
- Trust `maturity` field alone — insufficient.
- Full dynamic runtime proof in CI — too heavy; human covers residual.

## R10 — Documentation / ADR surface

**Decision**: Update `DEVELOPMENT.md` with the zero-legacy delivery policy; align `.cursor/agents/architecture-verifier.md`; extend ADR-0014 Verificação with the new tests (or add a short ADR “exclusive-on-touch” if Verificação outgrows 0014). Do not create user-facing options keys.

**Rationale**: Constitution: ADR/docs are source of truth; Spec Kit must not contradict them silently.

**Alternatives considered**: Spec-only policy without ADR/docs — drifts.

## R11 — Delivery slices (hint for `/speckit-tasks`)

1. Shared-modern-infra contract + descriptor inventory helpers reused by tests.
2. `typescript-boundary` + touched `@ts-nocheck` / no-new-`any` probes (ADR-0014).
3. Diff-aware exclusive-closure coupling gate + fault probes.
4. Human PR checklist + architecture-verifier alignment + DEVELOPMENT.md.
5. Agent SEI ephemeral-inspection guidance wired into verifier/docs.
6. Optional: ADR update + CI branch-protection notes for dual gate.

Each slice MUST leave `npm run verify` green and the extension loadable (no product break).
