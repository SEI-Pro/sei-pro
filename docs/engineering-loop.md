# Engineering Loop — SEI Pro PRF

> Repo alvo: `/home/tadeu/repos/sei-pro-prf`  
> Fonte da verdade: `src/`  
> Saída gerada: `dist/`  
> Skill Hermes: `sei-pro-prf-refactoring-loop`

## Objetivo

Este loop opera uma modernização incremental da extensão SEI Pro PRF usando o padrão maker/checker:

1. **Migration/Maker job** escolhe exatamente uma fatia pequena, implementa, roda build/test, atualiza o board e deixa a fatia como `migrated_pending_review`.
2. **Verification/Checker job** revisa uma fatia `migrated_pending_review`, roda build/test, verifica arquitetura/diff/board e marca `review_passed` ou `review_failed_needs_fix`.

O loop existe para dar continuidade segura à migração do legado para a arquitetura moderna em `src/`, sem portar patches do clone antigo nem editar `dist/` manualmente.

## Regras fundamentais

- Editar `src/` como fonte única da verdade.
- Não editar `dist/` à mão.
- Não portar automaticamente código do repo antigo `/home/tadeu/Repos/sei-pro-prf-arquitetura-extensoes`.
- Uma execução = uma fatia pequena = no máximo um commit funcional.
- O board é registro auditável, não backlog fechado.
- Se não houver item manual `pending_migration`, o migration job escolhe dinamicamente a próxima fatia a partir de `DEVELOPMENT.md`, mapa gerado e testes.
- Antes de commitar, sempre executar build/test real.
- Não afirmar smoke manual sem evidência humana ou browser real.

## Arquivos do loop

- `docs/engineering-loop.md` — este documento canônico.
- `docs/engineering-loop-board.md` — board maker/checker.
- `docs/engineering-loop-map.md` — resumo humano do mapa gerado.
- `docs/mapping-funcoes-configuracoes/opcoes_funcoes.csv` — mapa opção/configuração → funções.
- `docs/mapping-funcoes-configuracoes/funcoes.csv` — inventário estático de funções.
- `scripts/engineering-loop-map.mjs` — gerador/checker dos mapas.
- `docs/engineering-loop-architecture-evaluation.md` — decisão de recriação do loop no repo correto.

Não há `scripts/engineering-loop-verify.mjs` nesta fase. O gate inicial fica explícito no prompt dos jobs.

## Estados válidos do board

- `pending_migration`
- `migration_in_progress`
- `migrated_pending_review`
- `review_in_progress`
- `review_failed_needs_fix`
- `review_passed`
- `blocked`

## Tipos/camadas válidas

- `infra`
- `core`
- `platform`
- `sei`
- `feature`
- `entry`
- `shared-legacy`
- `bootstrap`
- `legacy-bridge`
- `docs`
- `map`

## Contextos válidos

- `lista-processos`
- `arvore`
- `editor`
- `visualizacao`
- `todas-paginas`
- `login`
- `options`
- `background`
- `global`

## Gate automático mínimo

Para qualquer mudança de código:

```bash
git status --short
git diff --check
npm test
git status --short
```

`npm test` roda `pretest`, e o `pretest` executa:

```bash
node scripts/build.mjs
```

Logo, o gate mínimo já faz build + test.

Quando a mudança tocar o mapa do loop, também rodar:

```bash
node scripts/engineering-loop-map.mjs
node scripts/engineering-loop-map.mjs --check
```

## Política sobre `dist/`

O build pode atualizar arquivos em `dist/`. Isso é permitido quando decorre de alteração correspondente em `src/`, `manifest.base.json`, CSS ou build. Porém:

- não fazer edição manual em `dist/`;
- revisar `git diff -- dist/` antes do commit;
- se `npm test` gerar alteração incidental não intencional, reverter antes de commitar;
- explicar no board quando um commit inclui saída gerada.

## Seleção do migration job

O migration job deve seguir esta ordem:

1. Corrigir o item `review_failed_needs_fix` mais antigo/mais crítico.
2. Executar o item manual `pending_migration` mais prioritário, se houver.
3. Se não houver item manual, escolher dinamicamente a menor fatia segura a partir de:
   - `DEVELOPMENT.md`;
   - `docs/engineering-loop-map.md`;
   - CSVs em `docs/mapping-funcoes-configuracoes/`;
   - `src/**`;
   - `tests/**`;
   - lacunas/violações explícitas de arquitetura.
4. Registrar a escolha no board.
5. Implementar só essa fatia.
6. Rodar build/test.
7. Commitar.
8. Atualizar o board para `migrated_pending_review`.

A primeira fatia real semeada no board é a prioridade explícita do `DEVELOPMENT.md`: remover dependência de feature de `src/core/stack.js`, especialmente `installMonitoradoStore`.

## Seleção do verification job

O verification job deve:

1. Selecionar o item `migrated_pending_review` mais antigo/mais prioritário.
2. Ler o commit/diff de migração.
3. Rodar:

```bash
git status --short
git diff --check
npm test
node scripts/engineering-loop-map.mjs --check
```

4. Verificar se a mudança respeita `DEVELOPMENT.md` e o escopo da fatia.
5. Se aprovada, marcar `review_passed` e commitar a atualização do board.
6. Se reprovada, marcar `review_failed_needs_fix`, registrar motivo objetivo e commitar a atualização do board.

O checker não deve implementar uma nova fatia. Ele só revisa ou registra falha.

## Política de commit

Um commit por fatia.

Formato recomendado:

```text
refactor(<escopo>): <descrição curta> [sei-pro-prf-loop]
```

Para docs/infra do próprio loop:

```text
docs(loop): <descrição curta> [sei-pro-prf-loop]
chore(loop): <descrição curta> [sei-pro-prf-loop]
```

## Cron jobs planejados

Os jobs antigos, apontando para o repo errado, devem permanecer pausados.

Novos jobs do repo correto:

| Job | Schedule | Modelo | Workdir |
|---|---|---|---|
| `sei-pro-prf-engineering-loop-migration` | `*/30 * * * *` | `openai-codex/gpt-5.5` | `/home/tadeu/repos/sei-pro-prf` |
| `sei-pro-prf-engineering-loop-verification` | `15,45 * * * *` | `opencode-go/glm-5.2` | `/home/tadeu/repos/sei-pro-prf` |

A migração roda a cada 30 minutos nos minutos 00/30. A verificação também roda a cada 30 minutos, defasada para os minutos 15/45, para revisar a fatia recém-produzida sem concorrer com o maker.

Em Hermes TUI, `deliver=local` salva o output em cron, mas não entrega mensagem no chat. Se for necessário notificar por gateway, configurar `deliver` explicitamente para uma plataforma conectada.

## Smoke manual

Quando a fatia tocar DOM, entry, bootstrap, manifest, CSS, `platform/*` ou feature visível, preencher `Smoke scope` no board com uma seção de `SMOKE_TEST.md`.

O job automatizado pode dizer apenas que o smoke manual é necessário; não pode declarar que passou sem execução real.
