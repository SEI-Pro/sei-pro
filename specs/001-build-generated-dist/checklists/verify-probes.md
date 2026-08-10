# Verify probes (T029)

**Date**: 2026-08-10

| Probe | Result |
|-------|--------|
| `npm run audit:dist` on clean build | PASS (0 orphans, exit 0) |
| Plant `dist/js/__x.js` then `audit:dist` | FAIL exit 1 (expected) |
| `npx vitest run tests/structure/dist-*.test.js tests/structure/no-dist-in-git.test.js` | PASS |
| CI jobs include build + test + audit:dist | Confirmed in `.github/workflows/ci.yml` |
