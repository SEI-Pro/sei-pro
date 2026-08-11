# Research: Inventário e Gaps de Capacidades

**Feature**: `003-capability-inventory-gaps` | **Date**: 2026-08-10

## R1 — Canonical home (clarification B)

**Decision**: Expand `docs/capabilities-map.md` into the full user-capability inventory **and** the prioritized gap register. No second canonical inventory under `specs/` or a sibling “full” doc. Specs may quote/link the map; they do not replace it.

**Rationale**: Matches clarify Option B and FR-001/FR-011. Constitution already names `docs/capabilities-map.md` as product truth alongside `pages/`.

**Alternatives considered**:
- Replace map with a new doc — unnecessary churn; map already referenced by tests/ADR-0007.
- Summary map + separate full inventory — creates dual sources of truth (rejected).
- Spec-only one-shot inventory — fails FR-008 freshness and soft-gate reuse.

## R2 — Machine-checkable map without a parallel inventory file

**Decision**: Keep one file (`docs/capabilities-map.md`) with (1) human prose/tables and (2) **required fenced YAML anchors** with stable ids (`inventory`, `gaps`, optionally `non-capabilities`). A small parser (`scripts/lib/parse-capabilities-map.mjs`) extracts those blocks. Structure tests compare anchors to descriptors, schema keys, and `pages/` listings. Prose may elaborate but MUST NOT omit ids present in anchors or contradict them.

**Rationale**: FR-009 hard-fail needs deterministic inputs; pure freeform Markdown tables are brittle. Embedded YAML keeps a single home (clarification B) while satisfying Constitution IV.

**Alternatives considered**:
- Parse only Markdown tables — fragile to formatting.
- External `capabilities-inventory.yaml` as source of truth — parallel inventory (violates clarify B / FR-011 spirit).
- Generate the entire map from code — loses product judgment (names, P1–P4, soft-gate narrative).

## R3 — Pages ↔ descriptor coverage (ADR-0007 gap)

**Decision**: Extend coverage gates so every feature descriptor either (a) lists one or more existing `pages/*.md` evidence paths in the inventory anchor, (b) sets `undocumented: true` (or equivalent allowlisted justification mirrored in the map), or (c) is classified as residual/non-capability in the map. Every `pages/*.md` MUST appear as evidence on at least one inventory entry **or** as an explicit orphan-doc gap. Implement ADR-0007’s stated `undocumented` check that is not fully enforced today.

**Rationale**: SC-001; ADR-0007 verification text; current `capability-coverage.test.js` only covers schema↔descriptor/ownership.

**Alternatives considered**:
- 1:1 page↔feature only — false; one capability may span multiple pages (menus, media).
- Ignore pages in CI; human-only — fails FR-009 Option B.

## R4 — Gap priority and soft gate (clarifications A + B)

**Decision**: Gaps use fixed **P1–P4** meanings from FR-005. Soft gate for **new** user capabilities triggers only on open **P1** gaps: Spec Kit (and PR checklist) MUST name deferred P1 ids and justify proceeding. P2–P4 do not alone trigger the soft gate. Closing gaps remains out of scope except minimal doc honesty (FR-012).

**Rationale**: User clarifications; prevents soft-gate spam from every wired feature.

**Alternatives considered**:
- Hard block until P1 empty — rejected (clarify soft gate).
- Soft gate on any open P2 — too broad.

## R5 — Maturity gaps (clarification C / FR-013)

**Decision**: Inventory always records `declared` | `wired` | `exclusive` from descriptors. Emit a **maturity-type gap** only when not `exclusive` **and** (≥1): parallel legacy path still active for that behavior; shared/`null` config key without justified end-state in the map; residual/aggregator still owns the behavior. Otherwise maturity is status-only (no automatic P2 flood).

**Rationale**: Clarify Option C; keeps top-5 consolidations actionable.

**Alternatives considered**:
- Every non-exclusive is a gap — rejected.
- Maturity never a gap type — hides strangler debt that FR-006 already calls out.

## R6 — Relationship to existing allowlists

**Decision**: Keep mechanical allowlists in `capability-coverage.test.js` (or extracted shared module) as the **executable** exception set: `SCHEMA_FEATURE_WITHOUT_DESCRIPTOR`, `NULL_CONFIGKEY_ALLOWED`, `CONFIG_KEY_FEATURE_OWNER_OVERRIDES`. The map’s gap register MUST include a corresponding gap (or explicit “not a gap” justification) for each allowlist entry (FR-006 / SC-003). Shrinking an allowlist without updating the map fails CI (and vice versa when the map claims an exception the test does not allow).

**Rationale**: Single executable truth for exceptions; map stays honest product narrative.

**Alternatives considered**:
- Move all exceptions only into YAML — still need code-side validation of schema ownership.
- Map-only exceptions without test allowlists — weaker than today’s gates.

## R7 — Soft-gate process surface

**Decision**: Encode soft gate in (1) `contracts/soft-gate-new-capability.md`, (2) `DEVELOPMENT.md` Spec Kit section, (3) PR template item for “new user capability”. No automated Spec Kit parser required in this feature; human checklist + review enforce FR-007. Optional later: structure test that fails if a new `feature.ts` appears while P1 gaps exist and no justification file — **out of scope** unless tasks find a cheap signal; default is process gate.

**Rationale**: Soft gate is judgmental; Constitution IV still covered by coverage hard-fail. Avoid over-automating product priority.

**Alternatives considered**:
- CI fails any new feature folder while P1 open — too hard; conflicts with soft gate.
- Advisory-only mention in docs — rejected by FR-007 “bypass not allowed”.

## R8 — Mapping CSVs role

**Decision**: CSVs remain **evidence/input** for naming and for spotting function↔option mismatches. They are not a third inventory. Gaps of type “inconsistency between sources” MAY cite CSV rows when function/option names diverge from inventory user vocabulary (P4 or P1 if toggle clarity breaks).

**Rationale**: ADR-0007; avoid maintaining three ledgers.

**Alternatives considered**:
- Require CSV↔map bijection in CI — CSV quality is uneven; defer strict bijection unless cheap wins appear in tasks.

## R9 — Out of scope confirmation

**Decision**: This feature does **not**: migrate features to `exclusive`; invent new options keys for `atividades-*`; write full user `pages/` for atividades (beyond noting P3 gaps); dissolve residuals in code; change SEI UI.

**Rationale**: FR-012 and assumptions.

**Alternatives considered**:
- Bundle first exclusive migrations — scope creep; blocked by 002 policy per touch anyway.
