# Implementation Plan: Pasta `dist` Gerada pelo Build

**Branch**: `001-build-generated-dist` | **Date**: 2026-08-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-build-generated-dist/spec.md`

## Summary

Redescoberta greenfield do pipeline que monta `dist/`: toda a árvore da extensão unpacked MUST sair só do build oficial, a partir de fontes versionadas (`src/`, `vendor/`, `assets/`), sem versionar `dist/`, sem resíduos de builds anteriores, e com identidade byte a byte entre duas builds limpas do mesmo commit. Empacotamento zip/release fica fora da entrega. Cada fatia termina com `dist` carregável.

Abordagem: redesenhar a orquestração do build (entrada estável `npm run build`) em torno de (1) limpeza total de `dist` no build oficial, (2) inventário único de saídas declaradas, (3) portão automatizado de órfãos + manifesto completo + bit-identity, entregue em fatias incrementais.

## Technical Context

**Language/Version**: Node.js `>=22.23.1 <23` (`.nvmrc` / `package.json` engines); scripts ESM (`.mjs`)

**Primary Dependencies**: esbuild (bundles IIFE sem minify); Node `fs` para cópia verbatim de legados/assets; Vitest para fitness functions; Git para prova de “não versionado”

**Storage**: Filesystem only — fontes em `src/`, `vendor/`, `assets/`; saída efêmera em `dist/` (gitignored)

**Testing**: Vitest (`tests/structure/*`); `npm run audit:dist`; `npm run verify` (typecheck + lint + test + audit); CI via workflow existente (ADR-0008)

**Target Platform**: Chrome extension MV3 loaded unpacked from `dist/`; build/verify on macOS/Linux CI agents

**Project Type**: Browser-extension tooling / build pipeline (not end-user SEI capability)

**Performance Goals**: Official clean build finishes in time suitable for CI and local verify (target: under 2 minutes on CI class machine for build alone; not a runtime latency feature)

**Constraints**:
- FR-004a: official build leaves zero leftovers in `dist`
- FR-004b / SC-002a: bit-identical `dist` across two clean builds of same commit
- FR-010: every mergeable slice leaves loadable `dist`
- No minifying/rewriting legacy globals in place (Vite+CRXJS attempt reverted — see `DEVELOPMENT.md`)
- Packaging/release pipeline out of delivery scope (FR-008 constraint only)
- Constitution IV: architecture rules must be executable gates

**Scale/Scope**: ~200 files in `dist` today; asset-manifest + entry bundles + legacy copies + feature CSS + manifest sync; greenfield redesign of orchestration and gates, not of every feature module

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Capacidade do Usuário Primeiro | Feature não é capacidade SEI; é invariante de engenharia que viabiliza extensão instalável sem asset órfão. Não inventar chave de options. Nomear pelo valor (reprodução de `dist`), não por arquivo legado. | PASS |
| II. Contexto de Execução | Pipeline não altera fronteiras MV3 nem messaging; apenas como artefatos chegam a `dist/`. | PASS |
| III. Anti-Corrupção / Confiança | Sem nova permissão, host, ou superfície de rede. Fontes continuam em `src/`/`vendor/`/`assets/`. | PASS |
| IV. Arquitetura Verificada | Invariantes MUST ter fitness functions: sem `dist` no git; zero órfãos; manifesto completo; bit-identity. | PASS (objetivo central) |
| V. Migração Honesta | Greenfield de desenho com fatias incrementais; cada fatia = commit que passa CI com `dist` carregável (FR-010). Proibido big-bang quebrado. | PASS |

**Post-design re-check**: Design (clean wipe + declared outputs + gates) strengthens IV/V; no new principle violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-build-generated-dist/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
│   ├── build-command.md
│   ├── asset-manifest.md
│   └── verify-gate.md
└── tasks.md             # Phase 2 (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
scripts/
├── build.mjs                 # Official build orchestrator (redesign target)
├── asset-manifest.mjs        # Canonical static fonte→dist pairs + dirs
├── audit-dist-sources.mjs    # Orphan / undeclared-output audit
├── generate-manifest.mjs     # Related (manifest check; not packaging)
└── generate-context-registry.mjs

src/                          # Product + legacy sources consumed by build
vendor/                       # Third-party libs (+ VERSION.txt)
assets/                       # Static product assets
manifest.base.json            # Manifest source → dist/manifest.json

dist/                         # Generated only — gitignored, never edited

tests/structure/
├── dist-reproducible.test.js # Completeness + source roots (+ extend)
├── no-dist-in-git.test.js    # FR-002
└── (new) dist-clean-and-bit-identical gates as designed

DEVELOPMENT.md                # Onboarding: build required after clone
.github/workflows/            # CI must run build + verify gates
```

**Structure Decision**: Single-repo extension tooling. Keep the existing layout; redesign orchestration and verification under `scripts/` and `tests/structure/`. Do not introduce a second package or parallel `dist-temp` as source of truth. Watch mode may skip full wipe; official non-watch build and verify MUST produce a clean, bit-identical tree.

## Complexity Tracking

> Unused — Constitution Check has no justified violations.
