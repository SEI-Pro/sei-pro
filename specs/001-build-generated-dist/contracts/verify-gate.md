# Contract: Verification Gate

**Feature**: `001-build-generated-dist`  
**Entrypoints**: `npm test` / structure tests, `npm run audit:dist`, `npm run verify`, CI

## Purpose

Fail closed when `dist` invariants regress (FR-007).

## Checks

| ID | Check | Pass | Fail signal |
|----|-------|------|-------------|
| G1 | `dist` not in git | `git ls-files dist` empty; ignore rule covers `dist/` | Non-empty tracked paths |
| G2 | Sources exist | Every declared source path exists | List of missing sources |
| G3 | Required present | Every load-required ref exists under `dist/` | List of missing refs |
| G4 | No dead WAR (non-optional) | Declared non-optional web_accessible_resources exist | List of missing resources |
| G5 | No orphans | Every file under `dist/` ∈ declared outputs | Paths “SEM FONTE” / undeclared |
| G6 | Bit-identical | Two clean official builds same commit → empty recursive diff | Diff summary / failing assertion |
| G7 | Vendor VERSION.txt | Each `vendor/*/` has `VERSION.txt` | Missing dirs |
| G8 | Notices sync | Existing notices `--check` passes | Command failure |

Optional resources exempt **absence** in G3/G4 only.

## When they run

- **Local contribute**: `npm run verify` MUST include G1–G8 (or equivalent covering set).
- **CI**: same portão on PR/push; build from clean tree (no trusted pre-existing `dist`).
- **pretest**: at minimum produces a build; full orphan + bit-identity MUST not be skippable on the verify path used for merge.

## Non-goals

- Measuring runtime SEI UI correctness (smoke remains separate when UI changes).
- Building zip/release.

## Regression probes (acceptance)

Intentional faults MUST fail the gate:

1. Drop a required output from the build → G3 fails.  
2. Leave an extra file under `dist/` not in declared outputs → G5 fails.  
3. Track a file under `dist/` → G1 fails.  
4. Inject non-determinism so two builds differ → G6 fails.
