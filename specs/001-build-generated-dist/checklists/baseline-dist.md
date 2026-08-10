# Baseline dist inventory (T001–T003)

**Date**: 2026-08-10  
**Command**: `rm -rf dist && npm run build`

## Inventory

| Metric | Value |
|--------|-------|
| Files under `dist/` | 205 |
| `dist/manifest.json` | present |
| `git ls-files dist` | empty (0) |
| `.gitignore` `/dist/` | present |

## Gaps vs contracts (pre-implementation → closed in this feature)

| Gap | Status after implement |
|-----|------------------------|
| No full wipe on official build | Closed — `wipeDist()` in `scripts/build.mjs` |
| Soft `audit:dist` (no exit 1) | Closed — exit 1 on orphans |
| No bit-identity structure test | Closed — `tests/structure/dist-bit-identical.test.js` |
| `obsoleteOutputs` allowlist | Removed — wipe supersedes |
| Declared outputs regex-over-build.mjs | Closed — `scripts/dist-pipeline.mjs` |

## US2 FR-010 checkpoint

Re-ran `rm -rf dist && npm run build` after docs/ignore/package-extension updates — manifest + required refs present.
