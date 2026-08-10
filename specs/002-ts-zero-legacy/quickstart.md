# Quickstart: Validate Código Novo Sem Legado

**Feature**: `002-ts-zero-legacy` | **Date**: 2026-08-10

Validation guide for the dual policy gate.

## Prerequisites

- Node from `.nvmrc` / `package.json` engines
- Dependencies installed (`npm ci`)
- Clean awareness of merge base (for diff-aware checks)
- In CI, checkout must include the base commit (`fetch-depth: 0`) and expose it as `POLICY_MERGE_BASE`
- For UI/DOM work on SEI: human-ready session in the integrated browser (ephemeral only — see [contracts/agent-sei-inspection.md](./contracts/agent-sei-inspection.md))

## Baseline verify (always)

```bash
npm run policy:check
npm run verify
```

Expected: typecheck, lint, `policy:check`, tests (incl. structure), `audit:dist` all pass.

## Scenario A — Docs-only change (policy exclusive rules skip)

1. Change only a markdown doc under `docs/` or `specs/`.
2. Run `POLICY_TOUCHED_PATHS='docs/architecture.md' npm run policy:check`.
3. Expected: `PASS scope=docs-only`.

## Scenario B — Intentional exclusive-closure fault

1. `POLICY_TOUCHED_PATHS='src/features/acoes-capa/feature.ts' npm run policy:check` (wired).
2. Expected: **FAIL** with P3 (maturity not exclusive).
3. Structure test `exclusive-closure-policy.test.js` covers the same probe.

## Scenario C — Intentional typing fault

1. Run the deterministic temporary-fixture probe in `tests/structure/touched-ts-nocheck.test.js`.
2. `npx vitest run tests/structure/touched-ts-nocheck.test.js`.
3. Expected: **FAIL** P2 for the planted `@ts-nocheck`; the probe itself passes only when that failure is observed.

## Scenario D — Happy path / fecho ampliado

1. Product-runtime change whose fecho can reach `exclusive`.
2. Descriptors in the fecho are `exclusive`; no imports to non-exclusive surfaces; TypeScript clean on touched files.
3. If prerequisites must be migrated first (**fecho ampliado**), land those exclusive migrations in earlier slices; merge the requested change only when the full fecho is exclusive and still loadable.
4. `npm run verify` → automated pass (includes `policy:check`).
5. Complete human checklist ([human-review.md](./contracts/human-review.md)) → dual gate pass.

If CI cannot resolve the merge base, `policy:check` fails P0 instead of treating the delivery as docs-only.

## Scenario E — Agent SEI inspection discipline

1. For a SEI UI task without current DOM evidence: agent asks for integrated-browser access.
2. Inspect live page; implement modern markup.
3. Confirm PR contains **no** saved SEI HTML/screenshots (`no-sei-page-fixtures.test.js`).
4. If access denied: no guessed DOM delivery.

## Scenario F — Shared infra allowlist

1. Fecho imports only allowlisted roots or exclusive features ([shared-modern-infra.md](./contracts/shared-modern-infra.md)).
2. Exclusive module importing a wired feature → P4 fails.

## Dual gate reminder

Automated green ≠ mergeable for product-runtime. Human H1–H6 (or N/A) required. Branch protection: required review (see `DEVELOPMENT.md`).

## Related contracts

- [policy-gate.md](./contracts/policy-gate.md)
- [human-review.md](./contracts/human-review.md)
- [agent-sei-inspection.md](./contracts/agent-sei-inspection.md)
- [shared-modern-infra.md](./contracts/shared-modern-infra.md)
