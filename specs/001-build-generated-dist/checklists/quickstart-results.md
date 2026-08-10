# Quickstart results (T030)

**Date**: 2026-08-10

| Scenario | Result | Notes |
|----------|--------|-------|
| A Clone → build → loadable | PASS | `rm -rf dist && npm run build`; manifest present |
| B Dirty tree clean | PASS | `dist-clean-tree.test.js` |
| C Bit-identity | PASS | `dist-bit-identical.test.js` |
| D Not versioned | PASS | `no-dist-in-git.test.js` |
| E Full portão | PASS | `npm run verify` (1180 tests) |
| F Onboarding | PASS | DEVELOPMENT.md documents install→build; ~qualitative &lt;15m excluding npm ci download |

Negative orphan probe: `audit:dist` exit 1 — PASS (see verify-probes.md).
