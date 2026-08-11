# Implementation Plan: Inventário e Gaps de Capacidades

**Branch**: `003-capability-inventory-gaps` | **Date**: 2026-08-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-capability-inventory-gaps/spec.md`

## Summary

Entrega de **produto/governança**: expandir `docs/capabilities-map.md` até inventário completo de capacidades de usuário + registro de gaps priorizados **P1–P4**, com verificação bloqueante em verify/CI (cobertura páginas↔descritores↔chaves, exceções explícitas, sem capacidades fantasma). Portão suave para capacidade nova enquanto gaps **P1** estiverem abertos. Não migra runtime para `exclusive` nem cria páginas de usuário novas além do mínimo documental para honestidade do mapa.

Abordagem: promover o mapa parcial atual; embutir índice estruturado parseável no mesmo arquivo; estender `capability-coverage` (+ testes irmãos) e orientação Spec Kit/PR; incorporar lacunas já admitidas (FR-006) no registro.

## Technical Context

**Language/Version**: Markdown (mapa humano) + YAML embutido parseável; Node.js `>=22.23.1 <23` (ESM `.mjs`) para parsers/gates; TypeScript descriptors já existentes (`feature.ts`)

**Primary Dependencies**: Vitest structure suite; `scripts/lib/scan-feature-descriptors.mjs`; `src/config/schema.ts`; `pages/*.md`; CSVs `docs/mapping-funcoes-configuracoes/`; `npm run verify` / CI

**Storage**: Arquivo canônico `docs/capabilities-map.md` (prosa + blocos YAML âncora). Sem banco. Sem artefato inventário paralelo.

**Testing**: Vitest `tests/structure/*` (estender `capability-coverage.test.js` + novos asserts de mapa/pages/gaps); probes de falha intencional; checklist humano de inclusão de lacunas conhecidas (SC-003)

**Target Platform**: Repo + CI (contribuinte/mantenedor/Spec Kit). Não é capacidade SEI de usuário final.

**Project Type**: Product inventory / architecture governance

**Performance Goals**: Novos asserts de estrutura dentro do orçamento atual de `npm test` (alvo: +≤15s em máquina CI-class)

**Constraints**:
- Clarificações: home = `capabilities-map.md` expandido; soft gate P1; escala P1–P4; maturidade-gap só com FR-013; hard-fail CI
- Constituição I + mapa `pages/`/descritores; IV (regra sem verificação não é regra); consolidação antes de expandir (portão suave)
- FR-012: fechar gaps de migração/páginas fica para Spec Kits seguintes
- Política 002 (exclusive-on-touch) permanece independente; este feature não força exclusive em massa

**Scale/Scope**: ~78 `pages/`; ~37 `feature.ts`; dezenas de chaves no schema; allowlists atuais em `capability-coverage.test.js` (telemetry, null configKeys, strangler overrides)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Capacidade do Usuário Primeiro | Inventário nomeia/fronteiriza no vocabulário do usuário; proíbe nome por arquivo/página SEI; alimenta Spec Kit. Sem inventar chave de options só para o mapa. | PASS |
| II. Contexto de Execução | Não altera composição MV3 nem ports. | PASS |
| III. Anti-Corrupção / Confiança | Sem nova permissão, sem persistir DOM SEI, sem rede. CSVs/`pages/` já no repo. | PASS |
| IV. Arquitetura Verificada | FR-009: cobertura/divergência hard-fail no verify/CI; allowlists de exceção explícitas e encolhíveis. | PASS |
| V. Migração Honesta | Não declara migração por inventário; maturidade-gap só quando elegível (FR-013); residuals rotulados com condição de esvaziamento. | PASS |

**Post-design re-check**: Design (mapa expandido + YAML âncora + coverage gate + soft-gate docs/PR) fortalece I/IV/V; sem violações. Complexity Tracking não necessário.

## Project Structure

### Documentation (this feature)

```text
specs/003-capability-inventory-gaps/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── inventory-map.md
│   ├── coverage-gate.md
│   ├── gap-register.md
│   └── soft-gate-new-capability.md
└── tasks.md             # /speckit-tasks — not created here
```

### Source Code (repository root)

```text
docs/
├── capabilities-map.md              # CANONICAL: expand → full inventory + P1–P4 gaps (+ YAML anchors)
└── mapping-funcoes-configuracoes/   # Evidence source (unchanged role)

pages/                               # User-facing docs (evidence; not replaced)

src/features/*/feature.ts            # maturity, configKey, future undocumented flag if needed
src/config/schema.ts                 # config keys + feature ownership fields

scripts/
├── lib/scan-feature-descriptors.mjs # Reuse / minor extend (e.g. undocumented)
└── lib/parse-capabilities-map.mjs   # NEW: parse YAML anchors from capabilities-map.md

tests/structure/
├── capability-coverage.test.js      # EXTEND: pages↔descriptor, map↔sources, known gaps
├── (new) capabilities-map-inventory.test.js  # Map anchors parse + SC-001/002 dimensions
└── (optional) capabilities-map-gaps.test.js  # Gap schema P1–P4 + FR-006 inclusion list

DEVELOPMENT.md                       # Soft gate + “update map in same PR”
.github/pull_request_template.md     # Checklist item: map/gaps updated; soft-gate if new capability
docs/architecture.md                 # Point measured state at expanded map (brief)
```

**Structure Decision**: Single-repo governance. Canonical product artifact remains `docs/capabilities-map.md`. Machine checks live under `tests/structure` + small parser helper; no parallel inventory file; no new SEI runtime feature package.

## Complexity Tracking

> N/A — no constitution violations to justify.
