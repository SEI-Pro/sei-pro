# Implementation Plan: Código Novo Sem Legado (TypeScript na Arquitetura Moderna)

**Branch**: `002-ts-zero-legacy` | **Date**: 2026-08-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-ts-zero-legacy/spec.md`

## Summary

Governança de entrega: qualquer toque em **runtime de produto** MUST aterrissar em TypeScript verificável, na arquitetura moderna, com o **fecho completo de dependências em maturidade `exclusive`**, sem acoplamento a qualquer superfície que não seja `exclusive` (nem infraestrutura moderna compartilhada permitida). Portão **duplo** (automatizado + revisão humana). Agentes MUST pedir inspeção efêmera do SEI no navegador integrado quando o DOM da página for necessário — sem persistir HTML/capturas.

Abordagem: estender fitness functions/`tests/structure` e o inventário de maturidade já existentes; adicionar gate **diff-aware** de fecho exclusive + tipagem honesta; fechar dívidas ADR-0014 (`typescript-boundary`, ratchet de `any`/`@ts-ignore`); formalizar checklist humano e orientação de agente; documentar allowlist de infraestrutura moderna compartilhada.

## Technical Context

**Language/Version**: TypeScript (strict) for product runtime; Node.js `>=22.23.1 <23` for gate scripts (ESM `.mjs`); Vitest for structure tests

**Primary Dependencies**: Existing `tsc`, Vitest structure suite, `scripts/lib/scan-feature-descriptors.mjs`, `scripts/measure-ratchets.mjs`, feature `maturity` on `feature.ts`, generated context registries; Git diff against the PR/push base SHA for touched-path detection

**Storage**: N/A (policy/gates over repo sources). No new persistent SEI page artifacts (FR-016)

**Testing**: Vitest `tests/structure/*`; `npm run typecheck`; `npm run verify`; intentional fault probes for the new policy gate; human checklist as non-automatable half of FR-008/FR-015

**Target Platform**: Chrome extension MV3 (product); CI + local contributor/agent workflows (gates)

**Project Type**: Engineering governance / architecture enforcement (not a SEI end-user capability)

**Performance Goals**: Policy gate suite finishes within existing `verify` budget (target: +≤30s on CI-class machine for new structure tests)

**Constraints**:
- Spec clarifications: exclusive closure before merge; legacy = non-exclusive; dual gate; ephemeral SEI inspection; docs-only out of exclusive trigger
- Constitution IV: rules MUST be executable or are not rules
- Constitution V: untouched dual-path may remain; touched closure MUST become exclusive (hardened by this feature)
- No `@ts-nocheck` / `any` / `@ts-ignore` debt on touched product files
- Agent MUST NOT persist SEI HTML/screenshots
- Packaging/distribution out of scope

**Scale/Scope**: ~37 features (14 exclusive today); whole-tree ratchets remain; new **diff-scoped** policy for PRs; allowlist of shared modern infra (`src/core`, `src/sei`, `src/platform`, `src/shared`, `src/config`, `src/app`, `src/types`; composition roots are boundaries, not fecho dependencies)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Capacidade do Usuário Primeiro | Não é capacidade SEI nova; é política de engenharia que protege qualidade das capacidades. Sem chave de options inventada. | PASS |
| II. Contexto de Execução | Não altera fronteiras MV3; reforça que código novo respeite contextos e composição. | PASS |
| III. Anti-Corrupção / Confiança | Inspeção SEI efêmera; sem persistir conteúdo de processo; sem nova permissão de host. Fortalece fronteira de confiança. | PASS |
| IV. Arquitetura Verificada | Objetivo central: gates executáveis (fecho exclusive, tipagem, non-exclusive coupling) + revisão humana para julgamento. | PASS |
| V. Migração Honesta | Fatias incrementais e extensão utilizável permanecem. Política **endurece** V no escopo tocado: merge só com fecho `exclusive` (clarificação D). Dual-path permanece só fora do fecho tocado. | PASS (hardening intentional) |

**Post-design re-check**: Design (diff-aware exclusive-closure gate + ADR-0014 completion + dual human checklist + ephemeral agent rule) strengthens IV/III/V; no unjustified violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/002-ts-zero-legacy/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
│   ├── policy-gate.md
│   ├── human-review.md
│   ├── agent-sei-inspection.md
│   └── shared-modern-infra.md
└── tasks.md             # Phase 2 (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
scripts/
├── lib/scan-feature-descriptors.mjs   # Extend: maturity inventory for gates
├── measure-ratchets.mjs               # Extend: any/@ts-ignore metrics if needed
├── policy-check.mjs                   # CLI entry for P0–P6
└── policy/
    ├── shared-modern-infra.mjs        # Allowlist export
    ├── classify-change-scope.mjs
    ├── touched-paths.mjs
    ├── dependency-closure.mjs
    └── assert-exclusive-closure.mjs

tests/structure/
├── ratchets.test.js                   # Existing baselines
├── feature-descriptor.test.js         # Maturity presence
├── (new) typescript-boundary.test.js  # ADR-0014 debt
├── (new) exclusive-closure-policy.test.js  # FR-003/013/014 diff-aware
├── (new) touched-ts-nocheck.test.js   # Touched files lose @ts-nocheck
├── (new) touched-dom-policy.test.js   # Inline handlers fail on touch
└── (new) no-sei-page-fixtures.test.js # FR-016 persistence ban

src/features/*/feature.ts              # maturity: exclusive required for touched closure
src/{core,sei,platform,shared,config,app,entries}/  # shared modern infra allowlist

.cursor/agents/architecture-verifier.md  # Align checklist with 002 policy
DEVELOPMENT.md                           # Contributor/agent policy + branch-protection ops
docs/adr/                                # Update 0014 Verificação; optional ADR for exclusive-on-touch
.github/workflows/ci.yml                 # typecheck/lint/build/test/audit:dist — hook policy here (not only local verify)
.github/pull_request_template.md         # H1–H6 dual-gate checklist
```

**Structure Decision**: Stay in the single-repo extension layout. Implement policy as structure tests + `scripts/policy/*` beside existing ratchets/descriptor scan. Do not invent a second package. CI uses a full-depth checkout and the event base SHA so the diff-aware gate cannot silently classify a PR as docs-only. Human half = PR template + required review process (documented) + architecture-verifier, not a new service.

## Complexity Tracking

> Unused — Constitution Check has no justified violations.
