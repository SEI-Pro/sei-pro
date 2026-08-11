# Contract: Capability Coverage Gate

**Feature**: `003-capability-inventory-gaps`  
**Entrypoints**: `tests/structure/capability-coverage.test.js` (extend) + `tests/structure/capabilities-map-inventory.test.js` (new); included in `npm test` / `npm run verify` / CI

## Purpose

Hard-fail when the expanded map drifts from canonical sources, or when pages/descriptors/keys omit coverage (FR-009, SC-001, SC-002).

## Inputs

| Input | Source |
|-------|--------|
| Descriptors | `scripts/lib/scan-feature-descriptors.mjs` |
| Schema | `src/config/schema.ts` (`CONFIG_SCHEMA`) |
| Pages | filesystem `pages/*.md` |
| Map anchors | `scripts/lib/parse-capabilities-map.mjs` |
| Exception allowlists | Existing sets/maps in coverage test (or shared module) |

## Checks

| ID | Check | Pass | Fail signal |
|----|-------|------|-------------|
| C0 | Map parse | All three anchors present and schema-valid | Missing/invalid YAML |
| C1 | Descriptor coverage | Every descriptor `id` ∈ inventory entries | Missing ids |
| C2 | Inventory honesty | Every inventory `descriptorId` exists on disk (or null only for residual/non-capability rules) | Phantom features |
| C3 | Config keys | Every schema key claimed by inventory ownership or exception/gap | Orphan keys |
| C4 | Ownership | Descriptor `configKey` vs schema `feature` vs shared overrides (existing C4) | Unexplained ownership |
| C5 | Pages → inventory | Every `pages/*.md` referenced by an entry or orphan-doc gap | Orphan pages |
| C6 | Descriptor → pages | Every capability entry has `pages[]` or `undocumented=true` (with gap/exception) | Undocumented silent |
| C7 | Exceptions ↔ gaps | Every code allowlist entry linked in `exceptions` anchor to gap or `not_a_gap` | Undocumented allowlist |
| C8 | Known lacunas | FR-006 inclusion list present as gap ids (see below) | Missing known gap |
| C9 | Maturity gaps | Any `type=maturity` gap satisfies FR-013; non-exclusive-only rows rejected | Illegal maturity gap |
| C10 | Prose ↔ YAML consistency | Every capability/gap ID shown in the map's human-readable Inventory, Residuals, or Gap register tables exists in its respective YAML anchor, and every YAML ID is represented in the corresponding prose table | Prose-only or YAML-only capability/gap |

### FR-006 inclusion list (minimum gap ids)

Gates MUST assert these ids exist in `gaps` (status `open` or justified `not_a_gap`):

| Gap id (suggested) | Topic |
|--------------------|--------|
| `gap-atividades-pages` | No dedicated user pages for atividades splits |
| `gap-atividades-shared-key` | Shared / null keys for atividades-* |
| `gap-prescricoes-schema-owner` | Schema `gerenciarprescricoes` → atividades vs prescritoes claim |
| `gap-telemetry-folder` | Schema feature `telemetry` without folder |
| `gap-transitional-ownership` | Post–sei-functions transitional owners (chrome-ui / acoes-capa / editor-captcha clusters as applicable) |
| `gap-strangler-shared-keys` | Documented shared keys in overrides map |

Exact slugs may be normalized in implementation as long as the inclusion list in the test is explicit and complete.

## When they run

- **Local**: `npm test` / `npm run verify`
- **CI**: same on PR/push
- **Fail closed**: any C0–C10 failure fails the job

## Non-goals

- Does not fail because a capability is `wired` without FR-013 conditions
- Does not require CSV bijection
- Does not migrate code to `exclusive`
