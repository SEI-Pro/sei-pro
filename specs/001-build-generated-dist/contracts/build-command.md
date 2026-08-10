# Contract: Official Build Command

**Feature**: `001-build-generated-dist`  
**Audience**: Contributors, CI, verify scripts  
**Stable entrypoint**: `npm run build`

## Purpose

Produce a complete, clean, loadable Chrome MV3 extension tree at `dist/` from versioned sources only.

## Invocation

| Mode | Command | Wipe `dist` | Gate-quality output |
|------|---------|-------------|---------------------|
| Official | `npm run build` | YES (full clean tree) | YES |
| Watch/dev | `npm run build -- --watch` / `npm run dev` | NO (incremental OK) | NO — not used for verify/CI |

## Inputs

- Versioned tree: `src/`, `vendor/`, `assets/`, `manifest.base.json`, lockfile/toolchain
- Declared mappings and generation rules (see [asset-manifest.md](./asset-manifest.md))
- Node engine per `package.json` / `.nvmrc`

## Outputs

- `dist/` containing **exactly** the declared outputs of this run
- Exit code `0` on success; non-zero if registries stale, build error, or post-conditions fail (as implemented by orchestrator)

## Guarantees (post-success official build)

1. Every load-required manifest reference exists under `dist/` (except documented optionals).
2. No file under `dist/` lacks a producing rule for this run.
3. Repeating official build on the same commit yields byte-identical `dist/`.
4. Extension can be loaded unpacked from `dist/` in Chromium.

## Non-goals

- Creating zip/release artifacts
- Editing or reading prior `dist` contents as source
- Minifying or rewriting legacy globals in place

## Failure modes (caller-visible)

| Condition | Expected |
|-----------|----------|
| Missing declared source | Non-zero exit; message names the path |
| Stale generated registry (if checked pre-build) | Non-zero exit; instructs refresh command |
| Bundler/copy error | Non-zero exit; esbuild/Node error surfaced |
