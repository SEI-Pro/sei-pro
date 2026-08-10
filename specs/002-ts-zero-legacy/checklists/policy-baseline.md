# Policy baseline (002-ts-zero-legacy)

**Captured**: 2026-08-10

| Metric | Value |
|--------|-------|
| Features total | 37 |
| exclusive | 14 |
| wired | 17 |
| declared | 6 |
| tsNocheck baseline | 386 (`tests/structure/ratchets.baseline.json`) |
| typescript-boundary.test.js | **present** (`tests/structure/typescript-boundary.test.js`) |

## Commands verified at capture

- `node` import of `scripts/lib/scan-feature-descriptors.mjs`
- `npm run typecheck` / `npm run verify` expected green after policy landing

## Policy CLI

```bash
npm run policy:check
# or
node scripts/policy-check.mjs
POLICY_TOUCHED_PATHS='src/features/foo/x.ts' node scripts/policy-check.mjs
```

## exclusive ids

`login`, `external-config`, `nao-lido`, `arvore`, `arvore-info`, `quick-highlight`, `visualizacao`, `editor`, `anotacao-controle`, `controlar-prazos`, `docs-lote`, `lista-agrupamento`, `lista-processos`, `monitorados`

## Counts note

Exact id lists: run `scanFeatureDescriptors()` — totals above measured 2026-08-10.
