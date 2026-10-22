# DOM seguro — plano 2 re-escopado ao master 3.8 (plano 2b)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Levar ao portão de inserção e ao despachante `data-spro-*` só o legado que **não** tem
correspondente em TypeScript — `sei-pro-prescricoes.js`, `sei-pro-all.js`, `sei-pro.js` e
`sei-pro-arvore.js` — e montar o pacote do Firefox com os módulos TS no lugar dos legados que eles
já substituíram.

**Architecture:** Este plano **reaproveita** o plano 2
([2026-09-28-dom-seguro-plano-2.md](2026-09-28-dom-seguro-plano-2.md)), escrito sobre a 2.2.3 e
nunca executado. A infraestrutura dele (helpers do bloco, os dois codemods, os detectores, a
correção das prescrições e o resolvedor da árvore) continua válida: o bloco DOM do
`sei-functions-pro.js` está idêntico na 3.8, o `sei-pro-prescricoes.js` não mudou, e a corrida do
`init_arvore.js` (linhas 92 e 93) continua lá. O que muda é **o recorte**: uma lista nominal de
funções fora do escopo (`tools/fora-do-escopo.json`), que os codemods e os detectores respeitam, e
uma task nova para o pacote MV2 do Firefox.

**Tech Stack:** JavaScript ES5 em `dist/js/` (template literal permitido), jQuery 3.4.1,
DOMPurify 3.2.5, Node 20 com `node:test`, jsdom 24 e acorn, puppeteer-core com Chrome for Testing,
`web-ext lint` para o pacote do Firefox.

**Spec:** [docs/superpowers/specs/2026-09-23-dom-seguro-firefox-design.md](../specs/2026-09-23-dom-seguro-firefox-design.md)
**Plano reaproveitado:** [2026-09-28-dom-seguro-plano-2.md](2026-09-28-dom-seguro-plano-2.md) — o
executor **lê as Tasks 1 a 5 e 10 dele**; aqui estão só as emendas.

---

## O que mudou desde o plano 2 (decisões do autor em 22/10/2026)

1. **Só converte o que não tem TS.** O master avançou 739 commits (2.2.3 → 3.8), e as principais
   funções viraram projetos TypeScript com content script próprio (`init_<nome>.js`).
2. **`sei-pro-atividades.js` será descontinuado.** Não é convertido, e a regressão ao vivo não
   inclui mais o gestor de atividades nem o backend do Docker.
3. **Saem do plano** as Tasks 7 (`sei-pro-projetos.js`), 8 (`sei-pro-favoritos.js`) e 11 (parses do
   `sei-pro-docs-lote.js`): os três têm substituto em TS.
4. **Zonas cinzentas ficam fora:** grade-controle (TS opcional, desligado por padrão), o esqueleto
   da coluna de prazos e a barra do estilo antigo. **Consequência que o autor precisa ter em mente:**
   esse código continua com `on*=` e roda no Firefox; a AMO só deixa de vê-lo quando o TS virar o
   padrão e o legado for apagado. O fechamento mede quanto sobra (Task 7, Step 1).
5. **Firefox recebe os módulos TS.** Os manifests MV2 estão parados na 2.9 e só carregam
   `init_agente.js` e `init_ferramentaspdf.js`; no Firefox o legado roda inteiro. Os módulos TS são
   content scripts isolados, sem `world: MAIN`, e usam só `getURL`, `storage.sync` e `import()`
   dinâmico — tudo suportado no Firefox. A Task 6 os leva ao MV2 e tira do zip o legado que
   ficou morto.
6. **O plano 3 encolhe** para `sei-functions-pro.js` (sem as regiões substituídas) e o editor
   (`sei-pro-editor.js`, `sei-pro-editor-adapter.js`, `js/modules/editor/`). Até lá, o HTML dos
   produtores pendentes entra por `htmlCruPro`, como o plano 2 previa.

## As funções fora do escopo

Lista nominal, por declaração top-level. Tudo o que estiver **dentro** dessas funções é ignorado
pelos codemods e pelos detectores, e contado à parte como "fora do escopo". O resto do arquivo é
convertido normalmente.

| arquivo | motivo | funções |
|---|---|---|
| `sei-pro.js` | grade-controle (cinzenta) | `removeAllTags getTagName getUniqueTableTag getTrGroupTablePro toggleGroupTablePro getTableOnTag orderbyTableGroup getArrayProcessoRecebido updateGroupTablePro storeGroupTablePro insertGroupTable initChosenFilterHome removeCacheGroupTable updateGroupTable initUpdateGroupTable getTableTag initTableTag getFilterTableHome selectFilterTableHome getProcessosPaginacao checkProcessoPaginacao initProcessoPaginacao selectPanelKanbanHome removeDataPanelProc getPanelProc initAddKanbanProc addKanbanProc cancelMoveKanbanItensProc pinKanbanItensProc updateOrderKanbanBoardProc collapseKanbanBoardProc updateCountKanbanBoardProc getTableProcessosCSV` |
| `sei-pro.js` | favoritos (TS) | `initPanelFavorites` |
| `sei-pro.js` | prazos (cinzenta) | `addControlePrazo setPrazoMarcador configDatesSwitchChangePrazo setControlePrazo initControlePrazo` |
| `sei-pro.js` | ordem dos painéis (TS) | `orderDivPanel initSortDivPanel` |
| `sei-pro.js` | link permanente (TS) | `copyTableResultProtocoloSEI downloadTableResultProtocoloSEI` |
| `sei-pro-all.js` | favoritos (TS) | `initAppendIconFavorites setAppendIconFavorites` |
| `sei-pro-all.js` | estilo antigo (cinzenta) | `initSlimPro initStyleBoxSlimPro` |
| `sei-pro-arvore.js` | atividades (descontinuado) | `initAtividadesProcesso setAtividadesProcesso filterTagKanbanArvore getAtividadesProcessoArvore` |
| `sei-pro-arvore.js` | estilo antigo (cinzenta) | `loadStyleDesign` |
| `sei-pro-docs-lote.js` | documentos em lote (TS) | arquivo inteiro (`"*"`) |

**Ficam dentro, de propósito** (não têm TS, mesmo morando perto das excluídas): acompanhamento
especial (`getGrupoAcompanhamentoEspPro` … `checkListaAcompanhamentoEspIconPro`),
`urgenteProMoveOnTop`, `checkLoadedTableSorter`, `initDadosProcesso`, `getListaMarcadores`,
`configDatesSwitchChangeHome`, `getAllMarcadoresHome`, `insertDivPanelControleProc`,
`insertDivPanel`, `addAcompanhamentoEspIcon`, `insertNewLinksMenu` (pontos de entrada também dos
módulos TS), o painel de prazo da árvore (`getHtmlPrazoNativoArvore`) e as condições de favoritos
que moram dentro de funções maiores da árvore (linhas ~493 e ~2930). Na dúvida, converter: código
convertido a mais não quebra nada; a mais na lista de exclusão, fica para a AMO ver.

## Global Constraints

Valem todas as do plano 2, com estas emendas:

- **Worktree** `../sei-pro-dom-seguro`, branch **`fix/dom-seguro-plano-2b`** (já criados a partir do
  master `4937601`).
- **Base de comparação:** `export SPRO_REF_BASE=refs/dom-seguro/base-plano2b` (= `4937601`, a 3.8).
- **Sem backend de atividades.** Não subir o Docker, não usar `tests/ao-vivo/backend.mjs`. A
  sincronização MGI continua desligada no banco local; não religar.
- **Login no SEI SP de treinamento é feito pelo executor**, com a credencial de teste da memória
  (`reference_sei_sp_treinamento`). SEI MJ: só `hmlsei.mj.gov.br`; `sei.mj.gov.br` é produção.
- **Nunca enviar processo** no SEI; não tocar em abas de `sei.antaq.gov.br`.
- **Os manifests de whitelabel e os MV2 são ignorados pelo git** (`.gitignore:25`); o que se
  versiona do Firefox é o gerador, não o resultado. Commits só com `dist/`, `docs/`, `pages/`;
  nunca `git add -A`.
- **Acentos em `dist/js/*.js` são `\uXXXX`** (o Edit converte escapes em caractere; conferir com
  `tools/escape-nonascii.mjs --check`).
- **Integrar ao master e publicar são decisões do autor.**

## Review Focus

As cinco do plano 2 continuam (Cancelar dentro do Dropzone; produtor pendente passando pelo portão;
árvore antes do bloco; argumento numérico virando string; `blur` da anotação). Mais estas, que o
re-escopo criou:

1. **Ação convertida que chama função excluída.** Um `data-spro-click="toggleGroupTablePro"` gerado
   fora de uma função excluída continua resolvendo, porque o despachante resolve por nome no
   `window`. O risco é o contrário: **HTML montado dentro de função excluída e inserido por função
   convertida** passa pelo portão e perde os `on*=`. → o detector de produtores da Task 3 trata
   função excluída como **produtor pendente**, e o teste está lá.
2. **Legado-ponte retirado do zip do Firefox.** O menu "Processos em Lote" chama
   `initProcLoteModal`, que mora no `sei-pro-proc-lote.js` e só então entrega ao TS
   (`sei-pro-proc-lote.js:80`). Retirar o arquivo quebra o menu em silêncio. → checagem de pontes na
   Task 6, Step 2.
3. **Módulo TS que não sobe no Firefox.** `import()` dinâmico de `moz-extension://` exige o alvo em
   `web_accessible_resources`, que no MV2 é uma lista plana. → teste manual de cada módulo na Task 6,
   Step 6.
4. **Marca `data-seipro-*` ausente no Firefox.** Sem a marca, o legado volta a carregar por cima do
   TS (duas estrelas de favoritos, dois painéis). → a sonda da Task 6 confere as marcas.
5. **Função excluída renomeada no master depois deste plano.** O codemod passaria a convertê-la.
   → `fora-do-escopo` falha se um nome da lista não existir no arquivo (Task 2, Step 3).

---

## Task 1: Ferramentas e harness ao vivo no worktree

Segue a **Task 1 do plano 2**, com estas emendas:

- Step 1: igual (copiar `tools/` e `tests/` do clone principal; `npm install` em `tests/`).
- Step 2: `SPRO_REF_BASE=refs/dom-seguro/base-plano2b`. Esperado: `# pass 62`, `# fail 0`.
- Step 6 (`backend.mjs`): **não escrever.**
- Step 7: o executor faz o login sozinho no SEI SP de treinamento.

Sem commit (`tools/` e `tests/` são ignorados).

---

## Task 2: Bloco, codemods e a lista de exclusão

**Files:**
- Modify: `dist/js/sei-functions-pro.js` (só o bloco entre as sentinelas `=== INICIO/FIM SEI PRO DOM ===`)
- Create: `tools/fora-do-escopo.json`, `tools/lib/fora-do-escopo.mjs`
- Create: `tools/converter-handlers.mjs`, `tools/converter-insercoes.mjs` e os testes de `tests/ferramentas/`

**Interfaces:**
- Consumes: Task 1.
- Produces: tudo o que a **Task 2 e a Task 3 do plano 2** produzem (`htmlCruPro`, `lerHtmlPro`,
  `literalInlinePro`, `relatarRemocoesPro`, captura, `data-spro-mouseover/mouseout`, subida de
  janela no resolvedor, `reescreverParentPro`, `confirmarDialogoNoEnterPro`; os dois codemods), mais:
  - `carregarForaDoEscopo(arquivo: string) -> { tudo: boolean, funcoes: Set<string> }`
  - `dentroDeExcluida(ast, no, fora) -> string | null` — o nome da função excluída que contém o nó.
  - Os dois codemods aceitam o arquivo e passam a reportar `fora do escopo (ignorados) N`.

- [ ] **Step 1: Executar a Task 2 do plano 2** (helpers do bloco e seus testes), sem alterações. O
  bloco não mudou entre a 2.2.3 e a 3.8; as linhas citadas lá continuam válidas.

- [ ] **Step 2: Executar a Task 3 do plano 2** (os dois codemods sobre o acorn e os testes de
  equivalência contra o `onclick` inline real). O código dos codemods está inteiro no plano 2; os
  protótipos de `/private/tmp/.../plano2/proto` não existem mais. Onde a Task 3 roda o ensaio em
  `sei-pro-projetos` e `sei-pro-favoritos`, rodar em `sei-pro-all`, `sei-pro` e `sei-pro-arvore`.

- [ ] **Step 3: Teste que falha — a lista de exclusão**

`tests/ferramentas/fora-do-escopo.test.mjs`:

```javascript
test('ignora o que esta dentro de funcao excluida e reporta a contagem', () => {
  const fonte = "function fora(){ $('#a').html('<b onclick=\"x()\">1</b>'); }\n" +
                "function dentro(){ $('#b').html('<b onclick=\"y()\">2</b>'); }";
  const r = converterHandlers(fonte, { funcoes: new Set(['fora']), tudo: false });
  assert.match(r.codigo, /onclick="x\(\)"/);            // intocado
  assert.match(r.codigo, /data-spro-click="y"/);        // convertido
  assert.equal(r.relatorio.foraDoEscopo, 1);
});
test('arquivo inteiro fora ("*") nao recebe nenhuma conversao', () => { /* tudo: true -> codigo === fonte */ });
test('nome da lista que nao existe no arquivo derruba a ferramenta', () => {
  assert.throws(() => validarForaDoEscopo('function a(){}', new Set(['b'])), /b.*nao existe/);
});
```

Rodar: `(cd tests && node --test ferramentas/fora-do-escopo.test.mjs)`. Esperado: FAIL
(`converterHandlers` ainda não aceita o segundo argumento).

- [ ] **Step 4: Implementar**

`tools/fora-do-escopo.json` com a tabela da seção *As funções fora do escopo*, no formato
`{ "dist/js/sei-pro.js": ["removeAllTags", ...], "dist/js/sei-pro-docs-lote.js": "*" }`.
`tools/lib/fora-do-escopo.mjs` com `carregarForaDoEscopo`, `validarForaDoEscopo` (nome ausente →
erro com o nome) e `dentroDeExcluida` (sobe os ancestrais do nó até um `FunctionDeclaration`
top-level com nome na lista). Os dois codemods chamam `validarForaDoEscopo` antes de tudo e pulam os
nós para os quais `dentroDeExcluida` devolve nome.

- [ ] **Step 5: Verde e validação contra o arquivo real**

```bash
(cd tests && node --test dom-seguro/ ferramentas/ 2>&1 | grep -E "^# (pass|fail)")
for f in sei-pro sei-pro-all sei-pro-arvore; do node tools/converter-handlers.mjs dist/js/$f.js | tail -2; done
```
Esperado: suíte verde; os três relatórios **sem gravar** (sem `--aplicar`), cada um com
`fora do escopo (ignorados) N`, N > 0, e nenhum erro de nome ausente.

- [ ] **Step 6: Commit** — só o bloco:

```bash
git add dist/js/sei-functions-pro.js
git commit -m "DOM seguro: helpers do bloco para o plano 2b

htmlCruPro, lerHtmlPro, literalInlinePro, captura, mouseover/mouseout e o
aviso de handler arrancado (relatarRemocoesPro), como desenhado no plano 2.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Detectores, com a exclusão e o produtor implícito

**Files:**
- Create/Modify: `tools/produtores-pendentes.mjs`, `tools/paridade-acoes.mjs`,
  `tools/check-dom-injection.mjs`, `tools/conferir-modos.mjs`, testes em `tests/ferramentas/`

**Interfaces:**
- Consumes: `carregarForaDoEscopo`, `dentroDeExcluida` (Task 2).
- Produces: os detectores da **Task 4 do plano 2**, mais: `check-dom-injection` imprime uma linha
  final `fora do escopo: <arquivo> <n>` por arquivo, e `produtores-pendentes` trata **toda função
  excluída que devolve ou monta HTML com `on*=`** como produtor pendente.

- [ ] **Step 1: Executar a Task 4 do plano 2**, com estas trocas:
  - onde lista `sei-pro-projetos`/`sei-pro-favoritos`, usar `sei-pro`/`sei-pro-all`/`sei-pro-arvore`;
  - os 13 parses do `sei-pro-docs-lote.js` **não** são mais esperados como `ERRO`: o arquivo está
    em `fora-do-escopo.json` como `"*"`. Esperado no lugar: `fora do escopo: dist/js/sei-pro-docs-lote.js 13`.

- [ ] **Step 2: Teste que falha — função excluída como produtora (Review Focus 1)**

```javascript
test('HTML montado em funcao excluida e inserido pelo portao e acusado', () => {
  const fonte = "function getTagName(){ return '<a onclick=\"z()\">t</a>'; }\n" +
                "function convertida(){ htmlPro($('#x'), getTagName(), 'append'); }";
  const r = produtoresPendentes(fonte, { funcoes: new Set(['getTagName']), tudo: false });
  assert.equal(r.erros.length, 1);
  assert.match(r.erros[0].mensagem, /getTagName/);
});
```

- [ ] **Step 3: Implementar** — `produtoresPendentes` junta à lista de produtores do
  `sei-functions-pro.js` (já existente no plano 2) as funções excluídas do próprio arquivo cujo corpo
  contenha literal com `on[a-z]+=`.

- [ ] **Step 4: Verde e linha de base**

```bash
export SPRO_REF_BASE=refs/dom-seguro/base-plano2b
(cd tests && node --test dom-seguro/ ferramentas/ 2>&1 | grep -E "^# (pass|fail)")
node tools/check-dom-injection.mjs | tail -6
```
Esperado: suíte verde; `0 erro(s)`; as linhas `fora do escopo:` impressas. **Anotar os números**:
são a linha de base que o fechamento compara.

Sem commit (só `tools/` e `tests/`).

---

## Task 4: `sei-pro-prescricoes.js` — a regressão da 2.2.2

**Executar a Task 5 do plano 2 sem alterações.** O arquivo não mudou desde a 2.2.3 (`git diff
refs/dom-seguro/base-plano2 master -- dist/js/sei-pro-prescricoes.js` vazio), então as linhas
citadas lá valem. `SPRO_REF_BASE=refs/dom-seguro/base-plano2b` nos verificadores. Commit como lá.

---

## Task 5: os três arquivos — `sei-pro-all.js`, `sei-pro.js`, `sei-pro-arvore.js`

Uma task por arquivo, **nesta ordem** (5a, 5b, 5c), cada uma com commit próprio. Todas seguem
o **roteiro de cada arquivo do plano 2** (seção *O roteiro de cada arquivo*, itens 1 a 8), com
duas emendas que valem para as três:

- **Os números e as linhas das Tasks 6, 9 e 10 do plano 2 estão defasados.** Servem de guia de
  *quais* casos manuais existem e de *como* resolvê-los. O Step 1 de cada task refaz a triagem e
  registra os números novos; a conversão manual se guia pelo nome da função e pelo trecho, não pela
  linha.
- **Caso manual que caia dentro de função excluída é pulado** e anotado no relatório da task.

### Task 5a: `sei-pro-all.js`

Guia: **Task 6 do plano 2.** Saem do recorte, por estarem em função excluída:
- `td.prepend(iconStar)` (estrela de favoritos, `setAppendIconFavorites`);
- as duas inserções do `htmlSlimPro` (`initSlimPro`).

Ficam, e são resolvidos como lá: a guarda `initProcLoteModal` do menu, as duas ações compostas da
visualização rápida (`abrirVisualizacaoRapidaPro`, `abrirAnexoRapidoPro`), a paginação da pesquisa
como P4, o `<iframe>` da tela *Configurar* por DOM API e os três parses.

Ao vivo (SEI SP): os passos 1 a 4 e 6 da Task 6 do plano 2. O passo 5 (estrela) sai.

- [ ] Step 1: triagem (`diff-sanitize`, `converter-handlers` e `converter-insercoes` sem `--aplicar`) e registro dos números
- [ ] Step 2: handlers (codemod + manuais)
- [ ] Step 3: inserções (codemod + manuais)
- [ ] Step 4: parses
- [ ] Step 5: produtores, registro em `ARQUIVOS_CONVERTIDOS` e bateria (roteiro, itens 5 e 6)
- [ ] Step 6: ao vivo com a sonda
- [ ] Step 7: commit `DOM seguro: sei-pro-all.js pelo portao` (corpo como no plano 2, citando o recorte)

### Task 5b: `sei-pro.js`

Guia: **Task 9 do plano 2.** Saem do recorte, por estarem em função excluída:
- o agrupamento por tag e tipo (o `appendTo` com `data-htagname` e o clone de linhas para
  `#divRecebidos`);
- a paginação (`$('#tblProcessos'+tipo).append(...)`);
- o quadro (kanban);
- o selo de prazo nas células (`setControlePrazo`, `addControlePrazo`) e o `keypress` do Enter do
  diálogo de prazo, **se** ainda estiver em `addControlePrazo` (conferir no Step 1);
- o CSV da tabela.

Ficam, e são resolvidos como lá:
- os marcadores vindos por AJAX como P4 (`no: this`), se estiverem em `getAllMarcadoresHome` ou
  outra função não excluída;
- a barra de localização com as duas inserções encadeadas;
- o texto padrão (os `$(htmlTxtPadrao)` lidos uma vez);
- a mensagem de erro decodificada por `lerHtmlPro`;
- o Cancelar do upload com `data-spro-captura` (`cancelarUploadProcessosPro`);
- o acompanhamento especial;
- a anotação na tabela (`replaceSticknoteHome`).

Step de custo do portão (Step 6 da Task 9 do plano 2): mantido, mesmo critério (200 inserções
abaixo de 150 ms; se passar, parar e perguntar ao autor).

Ao vivo (SEI SP e SEI MJ de homologação):
- os passos 3, 5 e 6 da Task 9 do plano 2;
- o painel de acompanhamento especial;
- a anotação de um processo na tabela;
- conferir que agrupar, kanban e prazos **continuam funcionando sem mudança** (não foram tocados);
- **com a grade nova ligada** (`gradecontrole`) e **desligada**.

- [ ] Steps 1 a 8 como na Task 5a, mais o de custo; commit `DOM seguro: sei-pro.js, o Controle de Processos (sem grade, kanban e prazos)`

### Task 5c: `sei-pro-arvore.js`

Guia: **Task 10 do plano 2, inteira**:
- o `RESOLVEDOR ARVORE` e o teste dele, `tests/dom-seguro/arvore-resolvedor.test.mjs`;
- os dois `<style>` por DOM API;
- `enviarUploadArvorePro`;
- os manuais do template literal.

Sai do recorte o que está nas funções do Atividades e em `loadStyleDesign`.

Ao vivo (SEI SP 4.1.5 e SEI MJ 5): o Step 9 da Task 10 do plano 2, **sem** os passos do gestor de
atividades.

- [ ] Steps como na Task 10 do plano 2 (1 a 10); commit `DOM seguro: sei-pro-arvore.js, com o resolvedor do frame`

---

## Task 6: O pacote do Firefox com os módulos TS

**Files:**
- Create: `tools/gerar-pacote-firefox.mjs` (ignorado pelo git, como os demais de `tools/`)
- Gerados, também ignorados: `dist/manifest_v2.json`, `dist/manifest_seipro_v2.json`
- Create: `release/sei-pro-<V>-firefox.zip`, `release/sei-pro-oficial-<V>-firefox.zip`

**Interfaces:**
- Consumes: `dist/manifest.json` (Lab MV3, fonte da verdade) e a receita da memória
  `reference_pacote_firefox` (gecko id do Lab, `sidebar_action`, `optional_permissions`, WAR em
  lista plana, o oficial derivado do Lab v2).
- Produces: `node tools/gerar-pacote-firefox.mjs <versao> [--oficial]` → grava o manifest v2 e o
  zip, e imprime a lista de arquivos legados retirados e a de mantidos como ponte.

- [ ] **Step 1: Gerador do manifest v2 a partir do Lab MV3**

Converter de MV3 para MV2:
- `action` → `browser_action`;
- `host_permissions` entram em `permissions`;
- `web_accessible_resources[].resources` vira uma lista plana;
- `background.service_worker` sai (o Firefox não roda o `background.js`; ver a memória);
- **todos os `content_scripts` entram**, inclusive os `init_*.js` dos módulos TS e as pastas
  `js/<modulo>/` no WAR.

O oficial é derivado do Lab v2 com a receita do `reference_pacote_oficial_seipro`.

- [ ] **Step 2: Legados que saem do zip — com checagem de ponte (Review Focus 2)**

Candidatos: `sei-pro-favoritos.js`, `sei-pro-projetos.js`, `sei-pro-docs-lote.js`,
`sei-pro-proc-lote.js`, `sei-pro-atividades.js`. Para cada um, o gerador:
1. extrai, via acorn, os nomes das funções top-level que o arquivo declara;
2. procura chamadas a esses nomes nos arquivos que **ficam** no zip (`dist/js/*.js` menos os
   candidatos, mais `dist/html/*.html`);
3. **sai do zip só se nenhuma chamada sobrar**. Senão, fica e é listado como ponte, com as chamadas.

Esperado, já conhecido: `sei-pro-proc-lote.js` fica como ponte (`initProcLoteModal`, chamado pelo
menu do `sei-pro-all.js`); e `procLote_paraLatin1` só é chamado pelo `docs-lote`, que também sai.
O `init.js` pede os legados por `$.getScript`: confirmar que cada pedido de arquivo retirado está
atrás da marca `data-seipro-*` (favoritos e projetos estão; **docs-lote e proc-lote são pedidos
sempre**, em `init.js:50-51`). Se um arquivo retirado for pedido sem guarda, o 404 é inofensivo,
mas aparece no console: guardar o pedido em `init.js` com a mesma marca e commitar essa mudança.

**`sei-pro-atividades.js` só sai do zip do Firefox com o "sim" do autor** (é perda de função para
quem usa no Firefox). Perguntar antes de gerar o zip final; sem resposta, o arquivo fica.

- [ ] **Step 3: `web-ext lint` antes e depois**

```bash
npx web-ext lint --source-dir <pasta do zip 2.9 extraido> --self-hosted --output=json > /tmp/lint-antes.json
npx web-ext lint --source-dir <pasta do pacote novo> --self-hosted --output=json > /tmp/lint-depois.json
```
Contar `UNSAFE_VAR_ASSIGNMENT` + `UNSAFE_CALL` por arquivo nos dois. Esperado: **0 erros** no novo;
a contagem dos arquivos convertidos cai, e a dos retirados some. Registrar a tabela: é o número que
importa para a AMO.

- [ ] **Step 4: Carregar no Firefox**

`puppeteer.launch({browser:'firefox'})` + `installExtension(pasta)`, como na memória. O painel do
agente segue sendo teste manual. Login no SEI SP pelo executor.

- [ ] **Step 5: Sonda das marcas (Review Focus 4)**

Na tela de Controle de Processos e num processo aberto: o `<html>` tem `data-seipro-favoritos`,
`data-seipro-historico`, `data-seipro-projetos`, `data-seipro-acoes-lote`,
`data-seipro-documentos-lote`, `data-seipro-processos-lote` e `data-seipro-link-permanente`, e
**não** existem `loadFavoritosPro` nem `loadProjetosPro` no mundo da página.

- [ ] **Step 6: Abrir cada módulo TS uma vez no Firefox (Review Focus 3)**

Favoritos (painel e estrela), Histórico, Projetos, Demandas, Prazos, Ordem dos painéis, Anotações,
Blocos de assinatura, Pesquisa rápida, Ações em lote, Documentos em lote (até a Verificação, **sem
gerar**), Processos em lote (até a Verificação, **sem gerar**), Link permanente, Estilo, Menu
suspenso, Grade do controle. Em cada um: abre, sem erro no console. Sem enviar processo e sem
salvar nada que não se desfaça.

- [ ] **Step 7: Commit** — só se o Step 2 tocou o `init.js`:

```bash
git add dist/js/init.js
git commit -m "init.js: pede o legado de lote so sem o modulo TS

No pacote do Firefox os arquivos legados substituidos ficam de fora; o
pedido incondicional gerava 404 no console.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Fechamento

Segue a **Task 12 do plano 2**, com estas emendas:

- **Step 1 (bateria):** a lista de arquivos é `sei-legis init sei-pro-proc-lote sei-pro-prescricoes
  sei-pro-all sei-pro sei-pro-arvore` (sem projetos, favoritos e docs-lote). Registrar também as
  linhas `fora do escopo:` e comparar com a linha de base da Task 3, Step 4: só podem ter diminuído.
- **Step 2 (regressão ao vivo):** sem o gestor de atividades e sem o backend. Telas: Controle de
  Processos (grade antiga **e** nova), processo aberto (árvore, visualização, capa), editor (a
  Legística), Enviar Processo (sem enviar), Pesquisa, Configurar, Gerenciar prescrições — no Chrome
  (SEI SP e MJ de homologação) e no Firefox (SEI SP).
- **Step 3 (revisão final):** pacote `git diff refs/dom-seguro/base-plano2b..HEAD`, com este plano,
  o plano 2 e o spec.
- **Step 4 (versão e histórico):** a seguinte à maior tag `v*` no momento. Entrada no
  `pages/HISTORICO.md`:
  - a volta do tooltip e do clique no selo de prazo das prescrições;
  - mais telas pelo caminho seguro;
  - as respostas do SEI lidas sem executar nada;
  - no Firefox, os recursos novos (favoritos, histórico, projetos e os demais) passam a valer
    também;
  - "sem mudança de funcionamento" no Chrome.
- **Step 5 (memória):** atualizar `project_dom_seguro_firefox`. Registrar:
  - a contagem de `htmlCruPro` e de "fora do escopo";
  - a tabela do `web-ext lint`;
  - o que o plano 3 herda: `sei-functions-pro.js` sem as regiões substituídas, e o editor.

  Atualizar também `reference_pacote_firefox` (o gerador novo e as pontes).

  Integrar ao master, publicar e enviar à AMO: perguntar ao autor. **Não enviar à AMO antes do plano
  3**: enquanto houver `htmlCruPro`, o pacote ainda tem HTML de produtor sem sanitização.
