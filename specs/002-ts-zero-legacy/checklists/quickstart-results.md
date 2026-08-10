# Quickstart results (002-ts-zero-legacy)

**Date**: 2026-08-10

| Scenario | Result | Notes |
|----------|--------|-------|
| A docs-only | PASS | `POLICY_TOUCHED_PATHS='docs/architecture.md'` |
| B wired fault | FAIL as expected | P3 on `acoes-capa` |
| tooling-only | PASS | scripts path |
| C typing | PASS | deterministic temporary fixture in `touched-ts-nocheck.test.js` |
| D / F | PASS probes | exclusive closure, wired-import P4, stale-registry P6, and touched-JS P1 |
| E fixtures | PASS | `no-sei-page-fixtures.test.js` |
| Structure suite (6 files) | PASS | 16 tests, including deterministic P0/P1/P2/P4/P6 probes |
| CI wiring | DONE | full-depth checkout + base SHA + `policy:check` step |
| Branch protection | PENDING ADMIN | GitHub `master` is currently unprotected; this account lacks admin permission to enable it |
| Full `npm run verify` | PASS | 226 test files / 1.197 tests; typecheck, lint, build, policy gate, and `audit:dist` green |

Full `npm run verify` should be run before merge (includes build via pretest).
