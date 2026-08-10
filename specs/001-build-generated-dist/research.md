# Research: Pasta `dist` Gerada pelo Build

**Feature**: `001-build-generated-dist` | **Date**: 2026-08-10

## R1 — Clean tree strategy (FR-004a)

**Decision**: Official (non-watch) build MUST wipe `dist/` entirely at the start (or rebuild into a fresh tree and atomically replace), so the finished tree contains only files produced by that run. Remove reliance on a hand-maintained `obsoleteOutputs` allowlist as the primary cleanliness mechanism.

**Rationale**: Spec clarification requires zero leftovers. Current `scripts/build.mjs` only deletes a small `obsoleteOutputs` list; deleted sources can leave orphans that `audit:dist` would flag but the build itself would not remove. A full wipe makes FR-004a structural, not advisory.

**Alternatives considered**:
- Keep incremental overwrite + allowlist of obsolete paths — fails when someone forgets to extend the list; already a known debt pattern.
- Wipe only in CI — leaves local `dist` dirty and diverges from FR-004a / SC-002.
- Hybrid (wipe in verify only) — rejected by clarification Option A for official build completion state.

## R2 — Bit-identical reproducibility (FR-004b)

**Decision**: Treat bit-identity as a hard gate: two consecutive clean official builds from the same commit MUST yield `diff`-empty `dist` trees. Configure the bundler for deterministic output (no absolute path comments / non-deterministic metadata). Pin toolchain via lockfile (already required). Fail the verify suite if identity breaks.

**Rationale**: Clarification chose Option A (byte-for-byte), not an allowlist of “known diffs”. ADR-0011 historically verified identity once manually (`diff -rq`); that check is not continuously enforced in tests today.

**Alternatives considered**:
- Allowlist known non-deterministic diffs — rejected by clarification.
- Semantic-only (files exist / extension loads) — too weak given leftover ban.
- Hash-only of required manifest paths — misses undeclared orphans and extra files.

**Known risk**: esbuild may embed path info depending on options/version. Mitigation: set options that keep bundles deterministic; if a comment path remains, strip or normalize in a post-step that itself is deterministic. Prefer fixing generator settings over growing an allowlist.

## R3 — Greenfield rediscovery with incremental delivery (FR-009, FR-010)

**Decision**: Redesign the pipeline as greenfield *requirements and orchestration*, delivered behind the stable entrypoint `npm run build`, in slices that each leave a loadable `dist`. Inform design from ADR-0011 / current scripts, but do not treat “already green on audit” as done. Do not dual-run two competing build systems long-term.

**Rationale**: Clarification chose full rediscovery and incremental loadable slices. Constitution V forbids long broken windows. Replacing the public command keeps contributors and CI stable while internals are rewritten.

**Alternatives considered**:
- Verification-only / residual-gap pass — rejected (clarification C).
- Dual-track old+new until flip — higher complexity; acceptable only as a short internal spike, not as the delivery model.
- Big-bang cutover with broken `dist` — rejected (clarification A / FR-010).

**Suggested slice order** (planning hint for `/speckit-tasks`):
1. Official build wipe + loadable `dist` still works.
2. Single declared-output inventory consumed by build + audit + tests.
3. Hard-fail orphan audit in verify/CI.
4. Double-build bit-identity test in structure suite.
5. Docs/onboarding alignment; remove obsolete allowlist pattern if superseded.

## R4 — Canonical mapping fonte→saída

**Decision**: Keep one declarative inventory for static pairs/dirs (today `scripts/asset-manifest.mjs`) plus explicit generation rules for bundles, legacy copies, feature CSS, HTML shell, and manifest sync. Build, audit, and structure tests MUST share the same inventory API so “produced by build” has one definition.

**Rationale**: ADR-0011 already established shared manifest as the fix for orphan assets. Greenfield keeps the idea; may reshape modules/API but not the “single source of truth” rule.

**Alternatives considered**:
- Infer outputs only by scanning `dist` after build — cannot detect missing required files before load; weak for FR-003.
- Duplicate lists in build vs tests — drift caused the original failure mode.

## R5 — Watch / dev vs official build

**Decision**: Watch mode may update subsets of `dist` for developer feedback. Official build (default `npm run build` without `--watch`) and verification MUST always produce a clean full tree meeting FR-004a/b. Document that verify/CI never use watch output as the gate artifact.

**Rationale**: Spec allows watch to regenerate parts during a session; completion of official build and portão expectations remain clean-tree.

**Alternatives considered**:
- Force wipe on every watch rebuild — slow and hostile to local UX; unnecessary if official path is gated.
- Treat watch output as authoritative for CI — violates bit-identity and cleanliness.

## R6 — Packaging / release (FR-008)

**Decision**: Out of delivery scope. If `package-extension` / zip / GitHub release already exists or is added later, it MUST consume the official-build `dist` only. This feature does not rebuild packaging.

**Rationale**: Clarification Option B.

**Alternatives considered**: Include zip/release rebuild — rejected for scope control under greenfield.

## R7 — Bundler and legacy copy policy

**Decision**: Continue esbuild for ESM→IIFE bundles (readable, no minify) and verbatim copy for legacy global scripts. Do not revisit Vite/CRXJS in-place transforms as part of this feature.

**Rationale**: `DEVELOPMENT.md` and build header document a failed attempt that minified/rewrote legacies in place. Greenfield rediscovery targets cleanliness and gates, not a second bundler migration.

**Alternatives considered**:
- Reintroduce Vite/CRXJS — high regression risk; orthogonal to FR-001–010.
- Bundle all legacies — blocked by ~1300 shared globals / load-order coupling until feature migration (ADR-0007) progresses.

## R8 — Optional resources

**Decision**: Keep an explicit optional-resource allowlist with mandatory rationale (pattern already in `dist-reproducible.test.js`, e.g. `js/sei-pro-config-local.js`). Optionals may be absent; they never count as orphans. Undeclared extras always fail.

**Rationale**: Spec edge case + existing ADR-0011 practice.

## Unresolved → resolved

All Technical Context items were filled from repo reality and clarifications; no remaining NEEDS CLARIFICATION markers for planning.
