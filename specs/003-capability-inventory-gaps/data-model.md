# Data Model: Inventário e Gaps de Capacidades

**Feature**: `003-capability-inventory-gaps` | **Date**: 2026-08-10

Persisted primarily as structured YAML anchors inside `docs/capabilities-map.md`, cross-checked against live sources (descriptors, schema, `pages/`).

## Entities

### Capability (Capacidade)

User-recognizable unit of value; inventory primary row.

| Field | Type | Rules |
|-------|------|-------|
| `id` | string (kebab-case) | Stable; normally matches `feature.ts` `id` when a descriptor exists |
| `kind` | enum | `capability` \| `residual` \| `non-capability` |
| `name` | string | User vocabulary; not legacy filename; not SEI page id as primary name |
| `summary` | string | One sentence; no file/folder/implementation talk |
| `maturity` | enum \| null | `declared` \| `wired` \| `exclusive`; required for descriptor-backed entries; null only for pure residual/non-capability without descriptor |
| `configKey` | string \| null | Own key, or null with justification |
| `configKeyMode` | enum | `own` \| `shared` \| `null_justified` |
| `sharedWith` | string[] | Required when `configKeyMode=shared` (peer feature ids) |
| `pages` | string[] | Paths relative to repo (`pages/FOO.md`); empty only if `undocumented=true` or kind≠capability |
| `undocumented` | boolean | Default false; if true, must appear as doc gap or explicit justification |
| `descriptorId` | string \| null | Folder/descriptor id; null for map-only residual/non-capability rows |
| `notes` | string | Optional end-state / emptying condition |

### Gap (Gap de capacidade)

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Stable slug (e.g. `gap-atividades-pages`, `gap-telemetry-folder`) |
| `type` | enum | `documentation` \| `key_ownership` \| `maturity` \| `residual` \| `source_inconsistency` |
| `priority` | enum | `P1` \| `P2` \| `P3` \| `P4` (FR-005 meanings) |
| `impact` | string | Product language: what user/maintainer cannot decide/verify |
| `evidence` | string[] | Pointers: page paths, schema keys, descriptor ids, allowlist names, CSV hints |
| `relatedCapabilityIds` | string[] | Inventory ids affected |
| `suggestedNextSpec` | string \| null | Optional hint for next Spec Kit short-name |
| `status` | enum | `open` \| `not_a_gap` (justified) \| `closed` |

### ExplicitException

Mirrors executable allowlists.

| Field | Type | Rules |
|-------|------|-------|
| `kind` | enum | `schema_feature_without_descriptor` \| `null_config_key` \| `shared_config_key` |
| `keyOrFeatureId` | string | Schema key or feature id |
| `owners` | string[] | For shared keys |
| `gapId` | string \| null | Linked open gap, or null if `not_a_gap` justification |
| `justification` | string | Required |

### FonteCanonica (read-only inputs)

Not stored in the map; consumed by gates:

- `pages/*.md` file set
- `src/features/*/feature.ts` via `scanFeatureDescriptors`
- `CONFIG_SCHEMA` keys + `feature` ownership field
- CSVs under `docs/mapping-funcoes-configuracoes/` (advisory evidence)

## Relationships

```text
Capability 1──* Gap (relatedCapabilityIds)
Capability *──* pages/*.md (evidence)
Capability 0..1──1 feature descriptor (descriptorId)
Capability *──0..1 config schema key
ExplicitException 0..1──1 Gap
```

## Validation rules

1. Every descriptor id appears exactly once in inventory (`kind` capability or residual).
2. Every `pages/*.md` is referenced by ≥1 capability **or** listed on an open `documentation` gap as orphan.
3. Every schema key is claimed by exactly one capability ownership story **or** an `ExplicitException` / typed gap.
4. `maturity` gap rows MUST satisfy FR-013 eligibility; non-exclusive alone is insufficient.
5. Known FR-006 lacunas MUST appear as gap ids (or `not_a_gap`) — inclusion list in coverage contract.
6. Priority MUST be P1–P4; soft gate reads only `status=open` && `priority=P1`.

## State transitions

### Gap

- `open` → `closed` when a later Spec Kit / PR resolves the underlying issue and updates map + allowlists.
- `open` → `not_a_gap` only with written justification (rare; prefer closing by fixing honesty).
- New gaps added when sources diverge or product judgment finds a frontier failure.

### Capability

- `residual` → `capability` when frontier test passes (own toggle + user sentence) after a future split — out of scope to implement here; map must already label residuals honestly.
- Maturity field tracks descriptor; does not alone transition gap state (FR-013).

## Identity & uniqueness

- Inventory `id` unique in map.
- Gap `id` unique in map.
- User-facing `name` should be unique among `kind=capability`; collisions → `source_inconsistency` or `P4` naming gap, not duplicate rows.
