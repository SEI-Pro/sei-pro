# Engineering Loop Board — SEI Pro PRF

> Atualize este arquivo a cada execução do loop.  
> Estados válidos: `pending_migration`, `migration_in_progress`, `migrated_pending_review`, `review_in_progress`, `review_failed_needs_fix`, `review_passed`, `blocked`.

## Board

| ID | Prioridade | Tipo | Contexto | Feature/Camada | Fatia | Estado | Commit migração | Commit verificação | Fonte | Gate | Smoke scope | Observações |
|---|---:|---|---|---|---|---|---|---|---|---|---|---|
| L0-001 | 0 | docs | global | loop | Criar `docs/engineering-loop.md` | review_passed | bootstrap-atual | bootstrap-atual | `docs/engineering-loop-architecture-evaluation.md` | `git diff --check`; `npm test` | n/a | Documento canônico criado na implantação inicial do loop. |
| L0-002 | 0 | docs | global | loop | Criar `docs/engineering-loop-board.md` | review_passed | bootstrap-atual | bootstrap-atual | `docs/engineering-loop-architecture-evaluation.md` | `git diff --check`; `npm test` | n/a | Board criado como registro auditável, não fila fechada. |
| L0-003 | 0 | map | global | loop-map | Criar `scripts/engineering-loop-map.mjs` | review_passed | bootstrap-atual | bootstrap-atual | `docs/engineering-loop-architecture-evaluation.md` | `node scripts/engineering-loop-map.mjs --check`; `npm test` | n/a | Script gerador de mapa criado sem depender do repo antigo. |
| L0-004 | 0 | map | global | loop-map | Gerar `docs/engineering-loop-map.md` e CSVs de mapa a partir de `src/` | review_passed | bootstrap-atual | bootstrap-atual | `scripts/engineering-loop-map.mjs` | `node scripts/engineering-loop-map.mjs --check`; `npm test` | n/a | Artefatos gerados pelo script local. |
| L0-005 | 0 | infra | global | hermes-cron | Criar novos cron jobs no repo correto, com migração em `openai-codex/gpt-5.5` e verificação 30min depois | review_passed | bootstrap-atual | bootstrap-atual | `docs/engineering-loop.md` | `cronjob list`; `git diff --check`; `npm test` | n/a | Jobs antigos ficam pausados; novos jobs apontam para `/home/tadeu/repos/sei-pro-prf`. |
| A1-001 | 1 | core | global | `src/core/stack.js` / `monitorados` | Tirar dependência de feature de dentro de `core/stack.js`: avaliar `installMonitoradoStore` e mover para `shared/` ou para o entry/contexto correto | pending_migration |  |  | `DEVELOPMENT.md` linhas 291-292 e tabela de violações conhecidas | `git diff --check`; `npm test`; `node scripts/engineering-loop-map.mjs --check` | `lista-processos`; `todas-paginas` se a carga global mudar | Primeira fatia real de arquitetura. Manter escopo pequeno e preservar compatibilidade. |

## Regras de atualização

- O migration job deve marcar no máximo uma linha por execução como `migration_in_progress` e depois `migrated_pending_review`, ou registrar bloqueio objetivo.
- O verification job deve revisar apenas linhas `migrated_pending_review` e alterar para `review_passed` ou `review_failed_needs_fix`.
- Se um job escolher uma fatia dinâmica que ainda não está no board, deve adicionar a linha antes ou durante a implementação.
- Não remover histórico; adicionar observações em vez de apagar decisões relevantes.
- `Commit migração` e `Commit verificação` podem ser preenchidos com hash curto após commit.
