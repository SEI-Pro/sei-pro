# Quickstart: Inventário e Gaps de Capacidades

**Feature**: `003-capability-inventory-gaps` | **Date**: 2026-08-10

Validation guide after implementation. Details: [contracts/](./contracts/), [data-model.md](./data-model.md).

## Prerequisites

- Node `>=22.23.1 <23` (see `.nvmrc` / `engines`)
- Dependencies installed (`npm ci`)
- On branch with the expanded map + coverage gates

## 1. Map is readable and complete

1. Open `docs/capabilities-map.md`.
2. Confirm sections: inventory, residuals/non-capabilities, gap register (P1→P4), exceptions.
3. Select and record 10 capability rows, including prazos, menus rápidos, and one atividades-* row. For each, record the ID and whether its user-vocabulary summary is exactly one understandable sentence without a file, folder, or technical SEI-page name as its definition.
4. Confirm at least 9 of the 10 sampled rows pass that check (SC-005), then record the 10 IDs, individual pass/fail results, and aggregate result in `specs/003-capability-inventory-gaps/checklists/quickstart-results.md`.
5. Confirm residuals are labeled (not presented as finished capabilities).

**Expect**: ≥90% (at least 9/10) of the recorded sample meets SC-005; no legacy-filename-as-primary-name.

## 2. Anchors parse

```bash
node -e "import('./scripts/lib/parse-capabilities-map.mjs').then(m => console.log(Object.keys(m.parseCapabilitiesMap())))"
```

**Expect**: prints keys including inventory/gaps/exceptions (API as implemented); no throw.

## 3. Coverage gate green

```bash
npx vitest run tests/structure/capability-coverage.test.js tests/structure/capabilities-map-inventory.test.js
# or full:
npm run verify
```

**Expect**: exit 0; C0–C10 pass ([coverage-gate.md](./contracts/coverage-gate.md)).

## 4. Intentional fault probes

| Probe | Action | Expect |
|-------|--------|--------|
| Phantom feature | Add inventory id with fake `descriptorId` | C2 fail |
| Orphan page | Add empty `pages/_ORPHAN_PROBE.md` without map reference | C5 fail |
| Drop known gap | Remove `gap-telemetry-folder` (or FR-006 peer) from gaps YAML | C8 fail |
| Illegal maturity gap | Add `type: maturity` for exclusive feature with no FR-013 evidence | C9 fail |
| Undocumented allowlist | Add null-configKey feature without exception/gap | C4/C7 fail |
| Prose-only row | Add a capability or gap ID to a human-readable map table without adding it to its YAML anchor | C10 fail |

Revert probes after observation.

## 5. Soft gate (process)

1. Ensure ≥1 open P1 gap exists in the map (typical after first fill).
2. Draft a hypothetical new-capability Spec Kit without P1 justification → reviewer rejects.
3. Same draft with deferred P1 ids + rationale → acceptable under FR-007.

**Expect**: checklist item in PR template / DEVELOPMENT.md is unambiguous.

## 6. Top-5 consolidations (SC-004)

Using only the gap register, list the first five open gaps in P1→P4 order and state why each matters (impact field).

**Expect**: answerable in ≤15 minutes without reading `src/`.

## Done when

- [ ] Map expanded and anchors present
- [ ] `npm run verify` green
- [ ] Fault probes fail as specified
- [ ] FR-006 lacunas visible in gap register
- [ ] Recorded 10-capability SC-005 sample passes at least 9/10
- [ ] Soft-gate docs/PR item present
- [ ] No parallel inventory file introduced
