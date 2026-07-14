# Engineering Loop — SEI Pro PRF

> Repo alvo: `/home/tadeu/repos/sei-pro-prf` (local Mac: este repositório)  
> Fonte da verdade: `src/`  
> Saída gerada: `dist/`  
> Skill Hermes: `sei-pro-prf-refactoring-loop`  
> Prompts dos jobs: `docs/engineering-loop-prompts.md`

## Objetivo

Este loop opera a migração incremental do legado para a arquitetura em `DEVELOPMENT.md`, com padrão maker/checker:

1. **Migration/Maker** escolhe **uma fatia média verificável** do épico ativo (escada P0–P7), implementa, roda gates, atualiza o board → `migrated_pending_review`.
2. **Verification/Checker** revisa essa fatia, reexecuta gates, confere escopo/arquitetura → `review_passed` ou `review_failed_needs_fix`.

O loop **não** existe para minerar classes CSS ad infinitum. CSS prefixado (`.seipro-*`) é o **passo final de um épico**, em lote — não a fila principal.

## Regras fundamentais

- Editar `src/` como fonte única da verdade.
- Não editar `dist/` à mão.
- Não portar automaticamente código do repo antigo `/home/tadeu/Repos/sei-pro-prf-arquitetura-extensoes`.
- Uma execução = **uma fatia** = no máximo um commit funcional.
- Fatia preferida: **média** (comportamento observável + teste novo), não micro-hook.
- O board é registro auditável; a **fila de épicos** é o programa ativo.
- Antes de commitar, sempre executar o gate automático real.
- Não afirmar smoke manual sem evidência humana ou browser real.

## Arquivos do loop

- `docs/engineering-loop.md` — este documento canônico (política).
- `docs/engineering-loop-prompts.md` — texto dos jobs maker/checker (colar na skill/cron Hermes).
- `docs/engineering-loop-board.md` — board + fila de épicos.
- `docs/engineering-loop-map.md` — resumo humano do mapa gerado.
- `docs/mapping-funcoes-configuracoes/*.csv` — mapa opção ↔ funções.
- `scripts/engineering-loop-map.mjs` — gerador/checker dos mapas.
- `scripts/engineering-loop-next.mjs` — sugere a próxima fatia a partir do board.
- `docs/engineering-loop-architecture-evaluation.md` — decisão de recriação do loop.

## Estados válidos do board

- `pending_migration`
- `migration_in_progress`
- `migrated_pending_review`
- `review_in_progress`
- `review_failed_needs_fix`
- `review_passed`
- `blocked`

## Tipos / contextos

Tipos: `infra`, `core`, `platform`, `sei`, `feature`, `entry`, `shared-legacy`, `bootstrap`, `legacy-bridge`, `docs`, `map`, `epic`.

Contextos: `lista-processos`, `arvore`, `editor`, `visualizacao`, `todas-paginas`, `login`, `options`, `background`, `global`.

---

## Modelo: épicos + escada P0–P7

### Épico

Unidade de programa (dias/semanas): um pedaço migrável da extensão  
(ex.: favoritos da lista, dropzone da árvore, cluster de datas em `sei-functions-pro`).

### Fatia

Uma execução do maker. Deve avançar **exatamente um** passo da escada do épico ativo.

| Passo | Nome | O que entregar | Gate automático mínimo |
|---|---|---|---|
| **P0** | Inventário | Globais, call-sites, config flags, arquivos, smoke scope | mapa regenerado se tocado + board |
| **P1** | Domain | Funções puras → `domain.js` + **teste Vitest novo/ampliado** | `npm test` |
| **P2** | IO | Storage/rede/sessão → `io.js` + mocks/testes | `npm test` |
| **P3** | View | DOM/eventos → `view.js` / templates; novos handlers **sem** `onclick` inline | `npm test` + estrutura se aplicável |
| **P4** | Legacy bridge | `legacy-api.js` + remover definição duplicada do monolito | `npm test` + guards de duplicata |
| **P5** | Wire | `index.js` + `build.mjs` / `manifest.base.json` se necessário | `npm test` + `manifest-order` |
| **P6** | CSS (lote) | Prefixar **todas** as classes próprias restantes do épico/feature | teste de prefixo da feature |
| **P7** | Done / smoke | Épico `review_passed` no programa; smoke humano | **humano** — job só registra scope |

Regra de sequência: o maker só pode pegar **P(n+1)** se **P(n)** do mesmo épico estiver `review_passed` (ou o épico já documentou pulo justificado no board, ex.: feature sem IO).

### Tamanho da fatia

Aceitar fatia se:

- Alvo **~100–400 LOC** de mudança real em `src/` (não 2 linhas de classe).
- No máximo **um** arquivo legado profundamente alterado + poucos arquivos novos da feature + testes.
- Entrega **um comportamento observável** (ex.: “favoritar via `SeiPro.features.X` com global legado intacto”).
- Todo **P1+** cria ou amplia teste Vitest daquele comportamento.

Rejeitar / marcar `blocked` se:

- Só dá para validar no DOM real do SEI (sem Vitest possível) → vai para `pending_migration` manual + smoke humano, **fora** do ciclo automático.
- A mudança proposta é só hook CSS aditivo sem avanço de P0–P5.

---

## Banimentos (obrigatórios)

Enquanto existir épico com passos **P1–P5** pendentes na fila:

1. **Proibido** escolher fatia cujo tipo seja só “CSS prefixado / adicionar hook `.seipro-*`”.
2. **Proibido** fatia de “adicionar hook aditivo” que preserve a classe antiga sem remover/renomear o contrato próprio da feature (exceto exceção explícita no board com motivo).
3. **Proibido** abrir novo micro-item no estilo A1-011…A1-205 (uma classe por commit) como seleção dinâmica.
4. CSS (`P6`) só depois de P1–P5 do épico (ou quando o épico for explicitamente “fechar CSS em lote” de feature já modularizada).

A fila histórica A1-* permanece no board como auditoria; **não** é fonte de seleção.

---

## Fila de épicos (ordem de programa)

Trabalhar nesta ordem. Só avançar ao próximo épico quando o atual estiver concluído (P7 registrado) ou `blocked` com motivo objetivo.

| Ordem | Épico ID | Contexto | Escopo | Por quê |
|---:|---|---|---|---|
| 1 | `E-controlar-prazos-close` | lista-processos | Fechar `controlar-prazos`: testes de domain, gaps P1–P5, CSS em lote se restar | Semi-migrado; ROI alto |
| 2 | `E-docs-lote-close` | arvore | Fechar `docs-lote`: limpar legado duplicado, P6 em lote residual | Semi-migrado |
| 3 | `E-nao-lido-close` | lista-processos | Fechar `nao-lido` (testes + gaps) | Semi-migrado |
| 4 | `E-anotacao-controle-close` | lista-processos | Fechar `anotacao-controle` | Semi-migrado |
| 5 | `E-lista-favoritos` | lista-processos | Extrair favoritos de `sei-pro.js` → feature ESM | Monolito médio (~3k) |
| 6 | `E-lista-agrupamento` | lista-processos | Extrair agrupamento/projetos UI de `sei-pro.js` | Continuidade lista |
| 7 | `E-arvore-dropzone` | arvore | Extrair dropzone/upload de `sei-pro-arvore.js` | Pedação visível |
| 8 | `E-arvore-menus` | arvore | Menus de ação rápida ainda no legado da árvore | |
| 9 | `E-editor-toolbar` | editor | Toolbar SEI Pro de `sei-pro-editor.js` | |
| 10 | `E-functions-datas` | shared-legacy | Cluster datas/prazos de `sei-functions-pro.js` | Desbloqueia vários consumidores |
| 11 | `E-entry-lista` | lista-processos | `src/entries/lista.js` quando ≥2 features da lista estiverem fechadas | Arquitetura médio prazo |
| … | (depois) | — | AI domain/io real; atividades por subpainel (kanban/gantt/relatório); demais entries | Só após a fila acima |

Detalhe operacional e fatias `pending_migration` ficam em `docs/engineering-loop-board.md` (seção **Epic queue**).

---

## Gate automático mínimo

Para qualquer mudança de código:

```bash
git status --short
git diff --check
npm test
git status --short
```

`npm test` já roda `pretest` → `node scripts/build.mjs`.

Quando a mudança tocar o mapa:

```bash
node scripts/engineering-loop-map.mjs
node scripts/engineering-loop-map.mjs --check
```

Antes de escolher fatia (maker) ou ao planejar:

```bash
node scripts/engineering-loop-next.mjs
```

### Gates extras por passo (checker deve exigir)

| Passo | Checker reprova se faltar |
|---|---|
| P1 | Teste em `tests/features/<feature>/` cobrindo o domínio novo |
| P2 | Teste ou mock cobrindo IO tocado |
| P4 | Função antiga ainda redefinida no monolito **e** aliasada (duplicata) |
| P5 | Ordem de manifest/bundle quebrada; `dist/` editado à mão |
| P6 | Diff só de 1 hook aditivo; ou classes próprias do épico ainda sem prefixo sem justificativa |
| Qualquer | Diff efetivo só em `docs/engineering-loop-board.md` + cosmético CSS sem avanço de escada |

## Política sobre `dist/`

- Build pode atualizar `dist/` a partir de `src/` / manifest / CSS.
- Não editar `dist/` manualmente.
- Revisar `git diff -- dist/` antes do commit; reverter churn incidental (ex.: whitespace em `init_visualizacao.js`).

---

## Seleção do migration job

Ordem obrigatória:

1. Corrigir o `review_failed_needs_fix` mais antigo/crítico.
2. Executar o `pending_migration` **mais prioritário da Epic queue** (ou item manual marcado por humano).
3. Se o épico ativo tem próximo passo P0–P6 pendente, **continuar esse épico** (criar a linha da fatia se ainda não existir).
4. Se o épico ativo está completo, abrir o **próximo épico** da fila e criar a fatia P0/P1.
5. **Não** cair em seleção “menor CSS seguro”.
6. Se não houver fatia automática viável (só smoke humano), registrar `blocked` objetivo e parar — não inventar micro-CSS.
7. Registrar no board (Épico, Passo P*, estado).
8. Implementar só essa fatia.
9. Rodar gates.
10. Commitar.
11. Atualizar board → `migrated_pending_review`.

Ajudante: `node scripts/engineering-loop-next.mjs` imprime a sugestão; o maker deve segui-la salvo conflito com (1)–(2).

## Seleção do verification job

1. Selecionar o `migrated_pending_review` mais antigo (preferir fatias E2-/épico sobre micro-CSS legado, se ambos existirem).
2. Ler diff do commit de migração.
3. Rodar:

```bash
git status --short
git diff --check
npm test
node scripts/engineering-loop-map.mjs --check
node scripts/engineering-loop-next.mjs --check-board
```

4. Verificar `DEVELOPMENT.md`, escada P*, banimentos e gates extras da tabela acima.
5. Aprovar → `review_passed` + commit do board.  
   Reprovar → `review_failed_needs_fix` + motivo objetivo + commit do board.

O checker **não** implementa fatia nova.  
O checker **deve reprovar** fatia cosméticasem avanço de escada se a política de banimento estiver ativa.

## Política de commit

Um commit por fatia.

```text
refactor(<escopo>): <descrição curta> [sei-pro-prf-loop]
docs(loop): <descrição curta> [sei-pro-prf-loop]
chore(loop): <descrição curta> [sei-pro-prf-loop]
```

## Cron jobs

| Job | Schedule | Papel | Workdir |
|---|---|---|---|
| `sei-pro-prf-engineering-loop-migration` | `*/30 * * * *` (ou `0 * * * *` se fatias P1–P4 pedirem mais tempo) | Maker | repo `sei-pro-prf` |
| `sei-pro-prf-engineering-loop-verification` | `15,45 * * * *` | Checker | repo `sei-pro-prf` |

Prompts canônicos: `docs/engineering-loop-prompts.md`. A skill Hermes `sei-pro-prf-refactoring-loop` deve apontar para este arquivo + `engineering-loop.md`.

## Smoke manual

- Fatias P3–P6 e qualquer tocque em DOM/manifest/CSS: preencher `Smoke scope` com seção de `SMOKE_TEST.md`.
- Job automático **nunca** marca smoke como passado.
- Ritmo humano sugerido: **1× por semana** exercitar os épicos `review_passed` da semana.

## Relação com a fase A1 (CSS hooks)

A série A1-011…A1-205 endureceu prefixos em monitorados/docs-lote/ai. Isso permanece válido como histórico.

A partir da política **E2** (épicos):

- novos micro-hooks CSS **não** são seleção dinâmica;
- `P6` fecha CSS **em lote** por épico/feature;
- progresso = decomposição + testes + remoção de duplicata legada.
