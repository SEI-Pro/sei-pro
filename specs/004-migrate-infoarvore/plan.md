# Implementation Plan: Migrar Informações Adicionais na Árvore

**Branch**: `004-migrate-infoarvore` | **Date**: 2026-08-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-migrate-infoarvore/spec.md`

## Summary

Aprofundar a migração honesta da capacidade **Informações adicionais na árvore do processo** (`arvore-info` / `infoarvore`): hoje já é `exclusive` no descritor e no boot da árvore, mas ainda é porte verbatim com `@ts-nocheck`, seletores SEI hardcoded, `innerHTML`/estilos inline, CSS no monolito/`arvore/style.css`, e enrichers de **outras** chaves (`duaslinhas`, `numerar_documentos`, …) colados no mesmo `install`.

Abordagem: preservar comportamento observável do painel; tipar removendo `@ts-nocheck` ao tocar; isolar markup/CSS da capacidade; passar seletores/parsing SEI pelo ACL; montar UI com DOM nativo/`shared/ui`; extrair enrichers que não são `infoarvore` para a peer `arvore`; testes de domínio/IO + smoke SEI por fatia de UI. Sem redesign de produto e sem migrar `DADOSPROCESSO` / outras opções da árvore além do fecho necessário.

## Technical Context

**Language/Version**: TypeScript (ESM) no fecho tocado; Node.js `>=22.23.1 <23` para Vitest/gates; Chrome MV3 content script no contexto `arvore`

**Primary Dependencies**: Descritor ADR-0004 (`feature.ts`); `src/app` boot/registry; ACL `src/sei/`; `src/core` (texto); `src/shared/ui` quando couber; `src/config` (`infoarvore`); Vitest; política 002 (`policy:check` / exclusive-on-touch)

**Storage**: Preferência de seções via chave existente `configViewFlashPanelArvorePro` (localStorage do host SEI — comportamento a preservar); config de produto `infoarvore` no schema/`chrome.storage` via stack moderna. Sem storage novo. Leitura e submissão de páginas do SEI passam por contrato serializável em `platform/messaging` para handler do service worker; o contexto `arvore` conserva somente montagem, interação DOM e renderização das respostas.

**Testing**: Vitest em `tests/features/arvore-info/` (estender parse/io/wiring; novos asserts de preferência de seções, montagem DOM sem concatenação insegura, ausência de `@ts-nocheck` no fecho); structure tests ACL/CSS/prefix quando aplicável; smoke manual SEI (quickstart) por fatia que toque UI

**Target Platform**: Extensão Chrome MV3 sobre SEI 4.1 / 5.x (iframe da árvore / `procedimento_visualizar`)

**Project Type**: Chrome extension feature migration (capability deepening)

**Performance Goals**: Montagem do painel sem bloquear a árvore; seções com fetch não serializam o restante; cache de página com TTL atual (~60s) preservado ou equivalente; sem regressão perceptível vs. comportamento atual

**Constraints**:
- Constituição I–V + política 002 (fecho exclusive tipado, sem acoplamento legado)
- FR-007: zero mudança intencional de produto além do necessário à arquitetura/DOM
- FR-011: sem concatenação insegura de HTML do SEI; sanitização na fronteira ACL
- Seletores/versão SEI só em `src/sei/`
- CSS da capacidade em arquivo próprio da feature (`.seipro-*`); remover dependência do monolito como fonte de verdade
- Fatias utilizáveis (build + CI verdes); smoke SEI quando UI muda
- Fora: `DADOSPROCESSO`, redesign visual, novas seções, bugs de produto “já funciona”

**Scale/Scope**: ~15 arquivos / ~2.4k LOC em `src/features/arvore-info/` + CSS espalhado (`sei-pro.css`, `arvore/style.css`); 9 seções de painel; 4 testes de feature existentes a estender

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Capacidade do Usuário Primeiro | Fronteira = opção **Informações adicionais…** / `infoarvore`; não nomear por arquivo legado; anotação no painel preservada como comportamento atual; `DADOSPROCESSO` fora. | PASS |
| II. Contexto de Execução | Continua no contexto `arvore`; install pela raiz/registry; deps `entries → features → shared → core\|sei\|platform`; falha de seção não derruba o contexto. | PASS |
| III. Anti-Corrupção / Confiança | Seletores/URLs → `src/sei/`; HTML do SEI sem concat insegura; leitura/submissão do SEI delegadas ao service worker por `platform/messaging`; sem nova permissão. | PASS |
| IV. Arquitetura Verificada | Arquivos tocados perdem `@ts-nocheck`; testes + structure/ACL/CSS; ratchet baselines só baixam; `tsc` no CI. | PASS |
| V. Migração Honesta | Já `exclusive` no rótulo — entrega aprofunda isolamento real; enrichers alienígenas saem do install; fatias incrementais; characterization antes de mover onde faltar cobertura. | PASS |

**Post-design re-check**: Contratos (panel UI, section preference, ACL/render safety, feature isolation) e data-model reforçam I–V sem violações. Complexity Tracking não necessário.

## Project Structure

### Documentation (this feature)

```text
specs/004-migrate-infoarvore/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── panel-ui.md
│   ├── section-preference.md
│   ├── acl-render-safety.md
│   └── feature-isolation.md
└── tasks.md             # /speckit-tasks — not created here
```

### Source Code (repository root)

```text
src/features/arvore-info/
├── feature.ts                 # descriptor (keep exclusive + infoarvore)
├── index.ts / boot.ts         # install painel-only (após extrair enrichers)
├── panel.ts                   # mount / refresh / section filter (alvo)
├── view/ ou sections/         # seções tipadas; DOM nativo
├── parse/                     # regras puras (manter/expandir testes)
├── io.ts                      # fetchPage / submit (tipar; deps injetadas)
├── dom/                       # caret, confirm (tipar)
├── arvore-info.css            # NEW: fonte de verdade visual da capacidade
└── (opcional) domain.ts       # estados de seção / preferência se crescer

src/features/arvore/           # destino dos enrichers não-infoarvore + CSS anotações movido para cá só se ainda for de arvore; preferir arvore-info.css para seipro-anot-*

src/sei/                       # seletores/páginas da árvore usados pelo painel

src/platform/messaging.ts       # contrato serializável entre arvore e service worker
src/background/                 # handler de I/O do SEI registrado pelo router do service worker

src/css/sei-pro.css            # remover regras do painel após migração p/ feature CSS
src/css/sei-slim.css           # dark-mode: apontar p/ classes .seipro-* da feature ou mover

src/config/schema.ts           # infoarvore (sem mudança de chave)

tests/features/arvore-info/    # estender + novos
tests/structure/               # ACL allowlist encolher; CSS prefix; policy
```

**Structure Decision**: Continuar no pacote `src/features/arvore-info/` (capacidade já nomeada). Não criar app/package novo. Anatomia alvo: descriptor + install painel + sections/view + parse puro + io + CSS próprio; enrichers de outras chaves migram para `arvore` (peer exclusive). Infra allowlisted per contrato 002.

## Complexity Tracking

> N/A — no constitution violations to justify.
