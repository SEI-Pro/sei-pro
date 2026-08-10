# Contract: Automated Policy Gate

**Feature**: `002-ts-zero-legacy`  
**Entrypoints**: structure tests under `tests/structure/` (names finalized in tasks), helpers under `scripts/`, included in `npm test` / `npm run verify` / CI

## Purpose

Fail closed when a product-runtime delivery violates TypeScript honesty, exclusive-closure, or zero-coupling to non-exclusive surfaces (FR-001–FR-003, FR-008 automated half, FR-010, FR-013–FR-014, FR-017).

## Inputs

| Input | Source |
|-------|--------|
| Touched paths | `git diff` vs merge base (CI) or explicit fixture paths (probes) |
| Feature inventory | `scripts/lib/scan-feature-descriptors.mjs` (maturity, ids, paths) |
| Import graph | Static imports from touched/closure modules |
| Shared infra allowlist | [shared-modern-infra.md](./shared-modern-infra.md) |

## Checks

| ID | Check | Pass | Fail signal |
|----|-------|------|-------------|
| P0 | Scope + diff base | docs-only / tooling-only → skip exclusive maturity; product-runtime → continue; unresolved CI base → fail closed | Misclassification or unavailable merge-base is an error |
| P1 | Typed sources | Every touched product-runtime source is `.ts`; historical `.js` may remain only while untouched | List of offending paths |
| P2 | No tipagem debt on touch | Touched product `.ts` have no `@ts-nocheck`; no new `any` / `as any` / `@ts-ignore` on those files | Offending markers/paths |
| P3 | Fecho maturity | Every feature in dependency closure of touched product paths has `maturity === 'exclusive'` | Feature ids still declared/wired |
| P4 | Zero non-exclusive coupling | No import/call from fecho modules into SuperficieLegada (non-exclusive features, legacy loaders, banned globals) | Edge list |
| P5 | Infra cleanliness | Fecho may import shared modern infra only if those modules do not import SuperficieLegada | Offending infra edges |
| P6 | Registry alignment | Exclusive features in fecho appear in fresh generated exclusive context registries | Registry mismatch or missing registry |

Tooling-only changes do not force a feature to `exclusive`, but the changed tooling is still checked for
new typing escapes and imports into non-exclusive product surfaces (T1/T2).

Whole-tree ratchets (existing) remain independent and MUST still pass.

## When they run

- **Local**: `npm run verify` / `npm test` after build pretest.
- **CI**: same on PR/push.
- **Docs-only PRs**: P0 skips P1–P5; other verify checks still run.

## Non-goals

- Judging semantic HTML quality (human — [human-review.md](./human-review.md)).
- Proving absence of every dynamic legacy load (human residual).
- Persisting SEI DOM fixtures.

## Regression probes (acceptance)

1. Change a wired feature file without migrating to exclusive → P3 fails.  
2. Exclusive feature imports a wired feature module → P4 fails.  
3. Add `@ts-nocheck` or touch a product `.js` in the touched set → P1/P2 fails.  
4. Exclusive feature with a stale generated registry → P6 fails.
5. Tooling importing a wired feature or adding an untyped escape → T1/T2 fails.
6. Docs-only markdown change → P0 skips exclusive rules; verify still green.
