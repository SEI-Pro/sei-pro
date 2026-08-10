# Data Model: Pasta `dist` Gerada pelo Build

**Feature**: `001-build-generated-dist` | **Date**: 2026-08-10

Logical entities for the build/verify domain (not a database schema).

## Entities

### FonteVersionada

Arquivo ou árvore sob controle de versão consumido pelo build.

| Attribute | Description |
|-----------|-------------|
| path | Repo-relative path under `src/`, `vendor/`, or `assets/` |
| kind | `product-code` \| `legacy-script` \| `vendor-lib` \| `static-asset` \| `stylesheet` \| `html-shell` \| `manifest-source` |
| originRecord | For vendor: `VERSION.txt` (version may be `desconhecida`) |

**Validation**:
- Must exist at build time if referenced by a mapping or generation rule.
- Vendor directories MUST include `VERSION.txt` (existing structural rule).

### MapeamentoFonteSaida

Registro canônico de uma produção fonte → caminho em `dist`.

| Attribute | Description |
|-----------|-------------|
| source | Path of `FonteVersionada` or entry rule id |
| output | Path under `dist/` |
| rule | `copy-file` \| `copy-tree` \| `bundle-iife` \| `copy-legacy-basename` \| `sync-manifest` |
| requiredForLoad | If true, absence after build fails the gate (manifest-required) |

**Validation**:
- `output` MUST start with `dist/`.
- `source` for copy rules MUST be under `src/`, `vendor/`, or `assets/`.
- Every file present in `dist` after official build MUST match exactly one mapping/rule output (except documented optionals that are absent by design — those are not present).

### SaidaBuild (árvore `dist`)

Árvore efêmera pronta para load unpacked.

| Attribute | Description |
|-----------|-------------|
| root | `dist/` |
| files | Set of relative paths produced by the last official build |
| buildId | Logical: commit SHA + toolchain lock identity (for compare runs) |

**State transitions**:
1. `absent` → `building` (wipe/replace begins)
2. `building` → `ready` (all declared outputs written; no leftovers)
3. `ready` → `absent` (manual delete or next wipe)
4. `ready` + dirty leftovers → **invalid** (fails audit until next official build)

**Invariants**:
- Never tracked in git.
- After official build: `files` == declared outputs exactly.
- Two `ready` trees from same commit: byte-identical file contents.

### RecursoOpcionalDocumentado

Referência que pode faltar sem falhar load/gate.

| Attribute | Description |
|-----------|-------------|
| pathInExtension | Path as in manifest / runtime (e.g. `js/sei-pro-config-local.js`) |
| reason | Mandatory human rationale |
| absentOk | Always true for members of this set |

**Validation**: Every optional MUST have a non-empty reason. Not an escape hatch for dead required refs.

### PortaoVerificacao

Resultado agregável do portão.

| Check | Pass condition |
|-------|----------------|
| not-tracked | Zero git-tracked paths under `dist/` |
| sources-exist | All mapping sources exist |
| required-present | All load-required refs exist under `dist/` |
| no-orphans | No file in `dist/` outside declared outputs |
| bit-identical | Two clean official builds of same commit differ by empty set |
| notices-sync | Third-party notices match vendor (existing related gate) |

## Relationships

```text
FonteVersionada 1..* ──produces via──> MapeamentoFonteSaida ──writes──> SaidaBuild
RecursoOpcionalDocumentado ──exempts absence in──> PortaoVerificacao (required-present)
PortaoVerificacao ──validates──> SaidaBuild + MapeamentoFonteSaida + git index
```

## Out of model scope

- Zip/release package contents (consume `SaidaBuild` later).
- Feature domain entities inside the extension UI.
- CSS feature-splitting of monolithic stylesheets (migration workstream).
