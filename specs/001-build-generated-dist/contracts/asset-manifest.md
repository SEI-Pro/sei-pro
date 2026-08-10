# Contract: Asset / Output Manifest

**Feature**: `001-build-generated-dist`  
**Canonical module (current)**: `scripts/asset-manifest.mjs` (may be reshaped; contract remains)

## Purpose

Single shared definition of what the build is allowed to place under `dist/` for static copies, plus the rule that generated outputs (bundles, legacy basename copies, feature CSS, HTML, manifest sync) are enumerated by the same “declared outputs” API used by audit and tests.

## Static pair schema

Each file pair:

```text
{ src: "<repo-relative source>", out: "dist/<repo-relative output>" }
```

Each directory pair:

```text
{ src: "<repo-relative source dir>", out: "dist/<output dir>" }
```

### Rules

- `src` MUST match `^(src|vendor|assets)/`
- `out` MUST start with `dist/`
- Adding an asset means adding a source under those roots **and** a pair/dir entry (or a generation rule), never creating files only under `dist/`
- Consumers: official build copy step, orphan audit, structure tests

## Declared outputs API (logical)

Consumers MUST be able to obtain:

1. **All static outputs** — flattened file paths from pairs + walked dirs  
2. **All generated outputs** — bundle outfiles, legacy basenames, feature CSS outs, HTML outs, `dist/manifest.json`, and any other rule-produced paths  
3. **Union** = complete legal `dist` file set after official build

Audit rule: every file found under `dist/` after official build ∈ union; every required load path ∈ union or optional allowlist.

## Optional resources

Separate allowlist of extension-relative paths that may be **absent**. Each entry requires a documented reason. Absence is OK; presence without a producing rule is still an orphan failure.

## Change control

- Manifest/API changes land in the same slice as build + tests that consume them (no drift).
- Rescue one-offs are historical; ongoing path is declare-then-build.
