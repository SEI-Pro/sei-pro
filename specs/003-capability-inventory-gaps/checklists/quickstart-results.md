# Quickstart results — 003-capability-inventory-gaps

**Date**: 2026-08-10

| Scenario | Result | Notes |
|----------|--------|-------|
| 1. Map readable | PASS | Inventory + residuals + gaps P1–P4 + exceptions + anchors |
| 2. Anchors parse | PASS | `parseCapabilitiesMap()` returns inventory/gaps/exceptions |
| 3. Coverage gate | PASS | capability-coverage + capabilities-map-inventory (C0–C10) green |
| 4. Fault probes | DOCUMENTED | See `verify-probes.md` (not executed destructively in this run) |
| 5. Soft gate process | PASS | DEVELOPMENT.md + PR template items present |
| 6. Top-5 consolidations | PASS | Open P1: `gap-atividades-shared-key`, `gap-prescricoes-schema-owner`; then P2 residual/ownership |

`npm run verify`: **PASS** (2026-08-10) — 1208 tests.

Note: `undocumented` is recorded on inventory entries in the map (not on wired `feature.ts`) so product-runtime touches do not trip `002` exclusive-closure. Optional field remains on `SeiFeatureDescriptor` for future exclusive features.
