# Contract: Shared Modern Infrastructure Allowlist

**Feature**: `002-ts-zero-legacy`  
**Consumers**: Exclusive feature closures; policy gate P4/P5

## Purpose

Define what exclusive closures MAY import without counting as legacy, even though these roots are not `feature.ts` capabilities (spec Assumptions + FR-003 exception).

## Allowlisted roots (v1)

| Root | Role |
|------|------|
| `src/core/` | Pure domain helpers |
| `src/sei/` | SEI anti-corruption layer |
| `src/platform/` | Ports (`chrome.*` boundary) |
| `src/shared/` | Shared modern UI/helpers |
| `src/config/` | Schema/read/migrations |
| `src/app/` | Registry/boot/publish helpers (not feature bodies) |
| `src/types/` | Type declarations |

## Composition roots (special)

| Root | Rule |
|------|------|
| `src/entries/` | May **compose/load** exclusive and still-non-exclusive features for the whole product so the extension stays usable. Code that belongs to a **touched exclusive fecho** MUST NOT import non-exclusive feature modules; loading siblings for untouched capabilities happens at the root, not inside the fecho. |
| `src/background/`, `src/options/` | Treated as product runtime; new/changed code follows the same exclusive-closure policy for their fecho. Prefer depending on exclusive feature `.api` and allowlisted infra. |

## Forbidden for fecho modules

- `src/features/<id>/**` where maturity ≠ `exclusive`
- Legacy loaders / bootstrap / content core-stack paths still present as legacy runtime
- Banned globals (`getSeiPro` misuse, new `aliasGlobal` debt, etc. per existing ADRs)

## Invariant

Allowlisted infra MUST NOT import SuperficieLegada. If an infra module needs behavior that only exists in a non-exclusive feature, that behavior MUST be migrated to exclusive (or into infra) before the fecho merge.

## Change control

Expanding this allowlist REQUIRES updating this contract and the structure test that encodes it in the same delivery.
