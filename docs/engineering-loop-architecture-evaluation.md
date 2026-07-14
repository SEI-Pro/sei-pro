# Avaliação para recriação do Engineering Loop — SEI Pro PRF

> Data: 2026-07-08  
> Repo alvo: `/home/tadeu/repos/sei-pro-prf`  
> Repo antigo usado apenas como referência local: `/home/tadeu/Repos/sei-pro-prf-arquitetura-extensoes`

## Resumo executivo

A conclusão desta avaliação é: **devemos portar apenas a estrutura operacional do loop**, não o código migrado no repositório antigo.

O repositório correto já possui uma arquitetura mais avançada que a arquitetura pressuposta pelo loop antigo. Portanto, o loop deve ser recriado para trabalhar com a arquitetura atual do repo correto:

- `src/` é a fonte única da verdade.
- `dist/` é saída gerada e não deve ser editado manualmente.
- O build usa `scripts/build.mjs` com esbuild.
- Os testes usam Vitest (`npm test`, com `pretest` rodando build).
- A arquitetura já tem camadas explícitas: `core`, `platform`, `sei`, `entries`, `features`, `shared/ui`, `bootstrap` e `background`.

O código migrado no repo antigo (`src/shared/config.js`, `src/shared/browser.js`, alterações em `dist/js/*`, etc.) deve ser tratado como **obsoleto para port direto**. No máximo, pode servir como referência histórica de intenção, mas não como patch aplicável.

---

## Evidências observadas

### Repo correto

Arquivos e estruturas inspecionados:

- `DEVELOPMENT.md`
- `package.json`
- `scripts/build.mjs`
- `SMOKE_TEST.md`
- `manifest.base.json`
- `src/core/*`
- `src/platform/*`
- `src/sei/*`
- `src/features/*`
- `src/entries/*`
- `src/shared/*`
- `src/bootstrap/*`
- `tests/*`

O `DEVELOPMENT.md` estabelece explicitamente:

- `src/` é a fonte única da verdade.
- `dist/` contém saída gerada.
- Nada em `dist/` é editado à mão.
- Features migradas devem seguir o formato `domain.js`, `io.js`, `view.js`, `templates.js`, `index.js`, `legacy-api.js` quando aplicável.
- `legacy-api.js` deve ser o único ponto de `aliasGlobal` de uma feature.
- Classes CSS novas devem usar prefixo `.seipro-`.
- O gate técnico mínimo é `npm test`.

O repo correto também possui smoke test manual documentado em `SMOKE_TEST.md`, cobrindo os contextos de lista de processos, árvore, editor, visualização, todas as páginas e login.

### Repo antigo

Artefatos úteis como referência:

- `docs/refactoring-progress.md`
- `docs/agent-refactoring-loop-skill.md`
- `docs/hermes-loop-plugins.md`
- `docs/funcoes-por-opcao-configuracao.md`
- `docs/mapping-funcoes-configuracoes/opcoes_funcoes.csv`
- `docs/mapping-funcoes-configuracoes/funcoes.csv`
- `scripts/ai-loop-verify.sh`

O mapa antigo tinha:

- 74 opções/configurações mapeadas.
- 2529 funções extraídas.
- 1125 funções compartilhadas por mais de uma opção.
- 1109 funções sem vínculo estático com opções da UI.

Esse mapa é valioso, mas está preso à estrutura antiga (`dist/js/*`) e precisa ser **regenerado contra o repo correto**, onde as fontes reais estão em `src/`.

---

## O que reaproveitar do loop antigo

### 1. Modelo maker/checker

Manter dois papéis separados:

1. **Migration/Maker job**
   - escolhe uma fatia pequena;
   - implementa ou ajusta documentação/infra conforme o estado do repo;
   - roda verificação real;
   - atualiza o board;
   - cria um commit;
   - deixa o item como `migrated_pending_review`.

2. **Verification/Checker job**
   - lê itens `migrated_pending_review`;
   - revisa diff, testes, arquitetura e documentação;
   - marca como `review_passed` ou `review_failed_needs_fix`;
   - cria commit de verificação quando atualizar o board.

Esse padrão funcionou bem e deve ser mantido.

### 2. Board como registro, não fila fechada

A melhoria feita no loop antigo continua correta: o board não deve ser a única fonte do backlog. Ele deve registrar o que foi escolhido, executado, revisado ou bloqueado.

O job de migração deve conseguir escolher nova fatia dinamicamente a partir de fontes autoritativas quando não houver linha manual `pending_migration`.

### 3. Seleção dinâmica de fatias

A ideia de selecionar fatias a partir de documentos e mapas continua boa, mas a fonte deve mudar.

No repo correto, a seleção deve considerar:

- `DEVELOPMENT.md`
- `SMOKE_TEST.md`
- `src/features/*`
- `src/core/*`
- `src/platform/*`
- `src/sei/*`
- `src/entries/*`
- testes existentes em `tests/*`
- novo mapa opção ↔ função gerado a partir de `src/`
- eventualmente os mapas antigos como referência comparativa, não como verdade atual

### 4. Estados do board

Os estados antigos continuam adequados:

- `pending_migration`
- `migration_in_progress`
- `migrated_pending_review`
- `review_in_progress`
- `review_failed_needs_fix`
- `review_passed`
- `blocked`

Mas a linha do board precisa ter mais metadados para a arquitetura nova.

### 5. Modelos pinados por job

Manter pinagem explícita de provider/model no cron job para evitar drift de config global.

Decisão atual, após confirmação do usuário:

- Migração autônoma: `opencode-go` / `glm-5.2`, pinado explicitamente no cron job.
- Contenção de escopo: o prompt do job, o board e a skill devem reforçar execução de **uma única fatia pequena por run**, gate obrigatório e commit pequeno, para compensar o risco de o modelo ampliar demais o escopo.
- Verificação/checker: `opencode-go` / `kimi-2.7`, pinado explicitamente, mantendo independência entre maker e checker.
- A configuração do campo `model` do scheduler é a fonte da verdade; os prompts não duplicam nomes de modelo.

---

## O que NÃO reaproveitar diretamente

Não portar diretamente:

- `src/shared/config.js` antigo;
- `src/shared/browser.js` antigo;
- alterações em `dist/js/sei-functions-pro.js`;
- alterações em `dist/js/init.js`;
- alterações em `dist/manifest.json`;
- commits de migração feitos no repo antigo;
- board antigo como fonte de verdade;
- `scripts/ai-loop-verify.sh` como gate principal;
- plugins locais `.hermes/plugins/*` como mecanismo operacional.

Motivo: no repo correto, `dist/` é gerado, e já existem camadas modernas para configuração, runtime, storage, messaging e features.

---

## Nova arquitetura operacional proposta para o loop

### Arquivos a criar ou adaptar no repo correto

Proposta de arquivos do loop:

```text
docs/engineering-loop.md
docs/engineering-loop-board.md
docs/engineering-loop-map.md
docs/mapping-funcoes-configuracoes/opcoes_funcoes.csv
docs/mapping-funcoes-configuracoes/funcoes.csv
scripts/engineering-loop-map.mjs
```

Observação: os nomes podem mudar, mas a separação de responsabilidades deve ser mantida.

Observação importante: **não criar `scripts/engineering-loop-verify.mjs` na Fase 0**. No início, o gate deve ser simples e explícito no prompt do cron: `git diff --check` + `npm test`. Um script encapsulador de verificação só deve entrar depois, quando houver checks específicos de mapa/board suficientes para justificar a abstração.

### `docs/engineering-loop.md`

Documento canônico do loop no repo correto.

Deve conter:

- objetivo do loop;
- arquitetura alvo do repo correto;
- regra de não editar `dist/` manualmente;
- regra de uma fatia pequena por execução;
- contrato maker/checker;
- comandos de verificação;
- política de commit;
- como escolher fatia;
- como atualizar o board;
- como lidar com smoke test manual quando necessário.

### `docs/engineering-loop-board.md`

Novo arquivo de controle.

Diferente do antigo, ele deve ter campos adaptados à arquitetura nova:

```markdown
| ID | Prioridade | Tipo | Contexto | Feature/Camada | Fatia | Estado | Commit migração | Commit verificação | Fonte | Gate | Smoke scope | Observações |
|---|---:|---|---|---|---|---|---|---|---|---|---|---|
```

Campos sugeridos:

- **Tipo:** `infra`, `core`, `platform`, `sei`, `feature`, `entry`, `shared-legacy`, `bootstrap`, `legacy-bridge`, `docs`, `map`.
- **Contexto:** `lista-processos`, `arvore`, `editor`, `visualizacao`, `todas-paginas`, `login`, `options`, `background`, `global`.
- **Feature/Camada:** exemplo: `monitorados`, `controlar-prazos`, `core/config`, `platform/storage`.
- **Fonte:** documento/mapa que justificou a escolha.
- **Gate:** comando executado, normalmente `npm test`.
- **Smoke scope:** qual seção de `SMOKE_TEST.md` deve ser exercitada manualmente se a fatia tocar DOM/contexto real.

O board deve ser registro auditável, não fila exaustiva.

### `docs/engineering-loop-map.md`

Documento humano explicando o mapa opção ↔ função atual.

Deve substituir conceitualmente o antigo `docs/funcoes-por-opcao-configuracao.md`, mas regenerado com base em `src/`.

Deve conter:

- metodologia de extração;
- limitações da análise estática;
- resumo quantitativo;
- opções mais complexas;
- funções/camadas mais compartilhadas;
- relação com `DEVELOPMENT.md`;
- como o migration job usa o mapa sem obedecer cegamente a ele.

### `docs/mapping-funcoes-configuracoes/*.csv`

Recriar os CSVs no repo correto com o mesmo espírito do antigo, mas mudando a base de análise:

- analisar `src/**/*.js`;
- excluir `node_modules`, `dist`, bibliotecas vendorizadas e outputs gerados;
- distinguir arquivos modernos e legados:
  - `src/core/*`
  - `src/platform/*`
  - `src/sei/*`
  - `src/features/*`
  - `src/shared/legacy/*`
  - `src/bootstrap/*`
  - `src/background/*`
- mapear opções/config flags para funções e arquivos;
- marcar se a função está em camada moderna ou legado copiado.

O schema antigo pode ser reaproveitado, mas precisa de colunas novas.

Sugestão para `opcoes_funcoes.csv`:

```csv
opcao,label,contextos,diretas,indiretas,total,modernas,legadas,arquivos,funcoes
```

Sugestão para `funcoes.csv`:

```csv
id,arquivo,linha,funcao,camada,feature,moderno_ou_legado,opcoes_diretas,opcoes_mapeadas,compartilhada,chamadas_detectadas_qtd
```

### `scripts/engineering-loop-map.mjs`

Script para gerar os mapas.

Responsabilidades:

1. Ler opções/configurações conhecidas.
2. Analisar funções em `src/**/*.js`.
3. Detectar referências diretas a config flags/opções.
4. Propagar chamadas diretas com profundidade limitada.
5. Classificar camada/feature pelo path.
6. Gerar CSVs e o resumo markdown.

Esse script não deve depender do repo antigo. Os mapas antigos só servem como referência para validar cobertura inicial.

### Futuro `scripts/engineering-loop-verify.mjs`

Script opcional para encapsular o gate do loop **somente em fase posterior**.

Na Fase 0 e na recriação inicial dos cron jobs, não criar nem depender deste arquivo. O prompt do cron deve chamar diretamente:

```bash
git diff --check
npm test
```

O encapsulador passa a valer a pena quando já existirem mapa, board e checks específicos para orquestrar, por exemplo:

```bash
git diff --check
npm test
node scripts/engineering-loop-map.mjs --check
```

Possíveis checks adicionais:

- falhar se uma mudança editar `dist/` sem mudança correspondente em `src/`, exceto quando `dist/` for produto de `npm run build`;
- validar que `manifest.base.json` e `dist/manifest.json` estão sincronizados após build;
- validar que os CSVs foram atualizados quando houver alteração em opções/configurações;
- detectar segredos/tokens óbvios em diffs;
- garantir que arquivos de board usem estados válidos.

---

## Nova regra de seleção de fatia

O migration job deve seguir esta ordem:

1. Se houver item `review_failed_needs_fix`, corrigir o mais antigo/mais crítico.
2. Se houver item `pending_migration` semeado manualmente, executar esse item.
3. Se não houver item manual, escolher dinamicamente a próxima fatia com base em:
   - violações conhecidas em `DEVELOPMENT.md`;
   - prioridades arquiteturais do próprio repo;
   - mapa opção ↔ função gerado a partir de `src/`;
   - testes existentes ou lacunas de teste;
   - menor fatia segura que preserve compatibilidade.
4. Registrar a escolha no board antes ou durante a implementação.
5. Finalizar com estado `migrated_pending_review` se houver commit de migração válido.

Critérios de boa fatia:

- cabe em um commit;
- tem comportamento preservado;
- toca `src/` como fonte principal;
- não edita `dist/` manualmente;
- adiciona/ajusta teste quando aplicável;
- informa smoke scope se tocar DOM/contexto SEI.

---

## Gates de validação

### Gate automático mínimo

Para mudanças de código:

```bash
git diff --check
npm test
```

Como `npm test` executa `pretest`, isso também roda:

```bash
node scripts/build.mjs
```

Na Fase 0, os cron jobs devem executar esses comandos diretamente. Não há ganho em criar um wrapper antes de existir mapa/board/checks próprios do loop.

### Gate para mudanças de build/manifest

Quando tocar `scripts/build.mjs`, `manifest.base.json`, entries ou feature bundles:

```bash
npm run build
npm test
git diff --check
```

### Gate de mapa

Quando os scripts/mapas forem criados:

```bash
node scripts/engineering-loop-map.mjs
node scripts/engineering-loop-map.mjs --check
npm test
```

Só depois desse gate existir e se repetir é que um `scripts/engineering-loop-verify.mjs` deve ser considerado.

### Gate manual/smoke

Quando a fatia tocar DOM, entries, bootstrap, manifest, CSS, `platform/*`, ou feature visível, o board deve apontar a seção aplicável de `SMOKE_TEST.md`.

O job automatizado não deve afirmar que o smoke manual passou sem evidência humana ou browser real.

---

## Recriação dos cron jobs

Os jobs antigos não devem ser retomados como estão porque apontam para o workdir antigo.

Recomenda-se criar novos jobs ou atualizar os existentes somente depois que os documentos e scripts acima existirem.

Configuração proposta:

### Job de migração

- Nome: `sei-pro-prf-engineering-loop-migration`
- Workdir: `/home/tadeu/repos/sei-pro-prf`
- Schedule atual: `*/30 * * * *` — roda a cada 30 minutos nos minutos 00/30. Também seriam válidas frases `every`, mas usar cron de 5 campos evita ambiguidade e permite defasagem com o checker. Evitar cron de 6 campos.
- Repeat: alto/recorrente, por exemplo `9999`
- Skill: atualizar e reutilizar a skill existente `sei-pro-prf-refactoring-loop`, em vez de criar uma skill nova e fragmentar o procedimento.
- Modelo: `opencode-go` / `glm-5.2`, pinado no scheduler. O prompt não duplica o nome do modelo; manter contenção: uma única fatia pequena, sem re-arquitetar além do item escolhido, build/test obrigatório e commit pequeno.
- Saída esperada: commit pequeno + board atualizado, ou relatório de bloqueio.

### Job de verificação

- Nome: `sei-pro-prf-engineering-loop-verification`
- Workdir: `/home/tadeu/repos/sei-pro-prf`
- Schedule atual: `15,45 * * * *` — roda a cada 30 minutos, defasado 15 minutos da migração. Evitar cron de 6 campos.
- Skill: a mesma skill existente `sei-pro-prf-refactoring-loop`, atualizada para os novos arquivos do loop.
- Modelo: `opencode-go` / `kimi-2.7`, pinado no scheduler; o prompt não duplica o nome do modelo.
- Saída esperada: item revisado como `review_passed` ou `review_failed_needs_fix`.

Observação operacional: em Hermes TUI, cron jobs locais salvam output, mas não entregam mensagem ao chat. Se quisermos notificação ativa, é preciso configurar `deliver` para gateway conectado.

---

## Recomendações de ordem de implementação

### Fase 0 — Segurança antes de religar cron

1. Confirmar que jobs antigos continuam pausados.
2. Garantir que nenhum job aponte para o repo antigo.
3. Criar a documentação canônica do novo loop.
4. Criar board novo vazio/seedado apenas com tarefas estruturais.
5. Criar script de geração de mapa.
6. Gerar mapa a partir de `src/`.
7. Rodar `git diff --check` e `npm test` diretamente.
8. Atualizar a skill existente `sei-pro-prf-refactoring-loop` para apontar para os novos documentos.
9. Só então recriar jobs Hermes.

### Fase 1 — Primeiras fatias do próprio loop

Antes de migrar feature real, o loop deve trabalhar nele mesmo:

1. `L0-001` — criar `docs/engineering-loop.md`.
2. `L0-002` — criar `docs/engineering-loop-board.md`.
3. `L0-003` — criar `scripts/engineering-loop-map.mjs` com saída inicial.
4. `L0-004` — criar `docs/engineering-loop-map.md` e CSVs gerados.
5. `L0-005` — atualizar a skill Hermes existente `sei-pro-prf-refactoring-loop` para o repo correto.
6. `L0-006` — criar os cron jobs novos apontando para `/home/tadeu/repos/sei-pro-prf`, com gate direto no prompt (`git diff --check` + `npm test`).
7. `L0-007` — executar dry-run/manual run e verificar commit ou bloqueio verificável.

### Fase 2 — Primeiras fatias de arquitetura real

Depois do loop estar operacional, o migration job deve escolher entre pequenas fatias como:

- **Primeira fatia recomendada:** executar a prioridade explícita de `DEVELOPMENT.md` linhas 291-292 — tirar dependências de feature de dentro de `core/stack.js`, em especial avaliar `installMonitoradoStore` e mover para `shared/` ou para o entry/contexto que realmente precisa dele.
- reduzir dívida explícita em `DEVELOPMENT.md`;
- aumentar teste de uma camada já moderna;
- decompor uma microparte de feature legada para `domain/io/view`;
- melhorar entry/contexto pequeno (`login` ou `db`) antes de contextos grandes;
- reforçar `platform`/`sei` se houver lacuna de teste.

---

## Decisão recomendada

1. **Não portar código migrado do repo antigo.**
2. **Portar a estrutura operacional do loop.**
3. **Recriar o arquivo de controle no repo correto**, com campos alinhados à arquitetura nova.
4. **Regenerar o mapa opção ↔ função a partir de `src/`**, usando o mapa antigo só como referência de cobertura.
5. **Criar/atualizar skill e cron jobs somente depois que documentação, board, mapa e gates existirem.**
6. **Manter jobs antigos pausados** até substituição explícita por jobs com workdir correto.
7. **Atualizar a skill existente `sei-pro-prf-refactoring-loop`**, não criar uma nova, para evitar fragmentação.

---

## Checklist para considerar o loop pronto

- [ ] `docs/engineering-loop.md` criado.
- [ ] `docs/engineering-loop-board.md` criado.
- [ ] `scripts/engineering-loop-map.mjs` criado.
- [ ] `docs/mapping-funcoes-configuracoes/opcoes_funcoes.csv` gerado a partir de `src/`.
- [ ] `docs/mapping-funcoes-configuracoes/funcoes.csv` gerado a partir de `src/`.
- [ ] `docs/engineering-loop-map.md` criado com resumo do mapa atual.
- [ ] Gate inicial direto documentado nos prompts/jobs: `git diff --check` + `npm test`.
- [ ] `scripts/engineering-loop-verify.mjs` avaliado apenas depois que mapa/board/checks específicos existirem.
- [ ] `npm test` passa.
- [ ] Skill Hermes existente `sei-pro-prf-refactoring-loop` atualizada para o repo correto.
- [ ] Jobs antigos seguem pausados ou foram removidos.
- [ ] Novos jobs apontam para `/home/tadeu/repos/sei-pro-prf`.
- [ ] Modelos pinados por job.
- [ ] Primeiro dry-run/manual run produz commit ou bloqueio verificável.
