# Verify probes (002-ts-zero-legacy)

**Date**: 2026-08-10

| Scenario | Command | Expected |
|----------|---------|----------|
| A docs-only | `POLICY_TOUCHED_PATHS='docs/architecture.md' npm run policy:check` | PASS scope=docs-only |
| B wired touch | `POLICY_TOUCHED_PATHS='src/features/acoes-capa/feature.ts' npm run policy:check` | FAIL P3 |
| tooling-only | `POLICY_TOUCHED_PATHS='scripts/policy-check.mjs' npm run policy:check` | PASS scope=tooling-only |
| structure suite | `npx vitest run tests/structure/exclusive-closure-policy.test.js tests/structure/touched-ts-nocheck.test.js tests/structure/touched-dom-policy.test.js tests/structure/policy-check-cli.test.js tests/structure/typescript-boundary.test.js tests/structure/no-sei-page-fixtures.test.js` | all pass |
| stale JS touch | `POLICY_TOUCHED_PATHS='src/shared/legacy/sei-pro-icons.js' npm run policy:check` | FAIL P1 |
| stale registry | fixture probe in `exclusive-closure-policy.test.js` | FAIL P6 |
| invalid CI base | `CI=true POLICY_MERGE_BASE=missing npm run policy:check` | FAIL P0 |
| CI path | `.github/workflows/ci.yml` uses `fetch-depth: 0`, base SHA, and `npm run policy:check` after build | present |

Planted-fault note: Scenario B must fail until the feature is exclusive; do not “fix” by weakening P3.
