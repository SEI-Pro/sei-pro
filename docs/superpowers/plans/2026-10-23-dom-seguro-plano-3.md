# DOM seguro — plano 3: `sei-functions-pro.js`, o editor e o fim das exceções

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Levar ao portão (`htmlPro`) e ao despachante `data-spro-*` o que sobra do legado sem
correspondente em TypeScript — `sei-functions-pro.js` e o editor — e zerar as exceções provisórias
(`htmlCruPro`), deixando o pacote do Firefox pronto para a AMO.

**Architecture:** Mesmo método do plano 2b: lista nominal do que fica fora
(`tools/fora-do-escopo.json`), os dois codemods sobre o acorn no arquivo inteiro e os casos manuais por
área, cada área com a sua validação ao vivo. A diferença é que aqui estão os **produtores**: as funções
que hoje devolvem HTML com `on*=` (`getDatesPreview`, `getHtmlMarcador` e mais 26). Convertidas, os
`htmlCruPro` que as protegiam viram `htmlPro`. No editor, o conteúdo do documento do usuário continua
passando por `reescreverDocumentoPro`, que **não** sanitiza.

**Tech Stack:** JavaScript ES5 em `dist/js/` (template literal permitido), jQuery 3.4.1, DOMPurify 3.2.5,
CKEditor 4 (SEI 4.1) e 5 (SEI 5), Node 20 com `node:test`, jsdom 24 e acorn, puppeteer-core (Chrome for
Testing e Firefox), `web-ext lint`.

**Spec:** [docs/superpowers/specs/2026-09-23-dom-seguro-firefox-design.md](../specs/2026-09-23-dom-seguro-firefox-design.md)
**Planos anteriores:** [plano 2](2026-09-28-dom-seguro-plano-2.md) (roteiro de arquivo, ferramentas) e
[plano 2b](2026-10-22-dom-seguro-plano-2b.md) (re-escopo, lista de exclusão, lições). O ledger do 2b
(`.superpowers/sdd/2026-10-22-dom-seguro-plano-2b/progress.md`) tem os `Ruling:` que este plano herda.

---

## Ponto de partida e triagem (23/10/2026, branch `fix/dom-seguro-plano-2b` em `db82db6`)

**`sei-functions-pro.js`** — 14,9 mil linhas, 641 funções top-level. Simulação dos codemods já com a lista
de exclusão da Task 1 aplicada:

| | convertidos pelo codemod | manuais | fora do escopo | em comentário |
|---|---|---|---|---|
| handlers `on*=` | 31 tooltips + 33 "ocultar" removidos + 53 chamadas | 21 | 80 | 7 |
| inserções | 56 marcação literal + 10 `.html('')` → `.empty()` | 89 | 51 | — |

- `diff-sanitize`: `<style>` ×5, `<iframe>` ×4, `<link>` ×3, `<html>` ×2, `<meta>` ×1, `<script>` ×1 (todos
  por DOM API) e `span[contenteditable]`, `i[acao]` (conferir cada um), `svg[viewbox]` (falso positivo).
- **Produtores pendentes:** 39 funções devolvem HTML com `on*=`; 28 ficam no escopo (11 estão em
  funções excluídas). Exceções registradas hoje: `htmlCruPro` ×4 — `getDatesPreview` ×3 (prescrições,
  nota da árvore, Reabertura) e `getHtmlMarcador` ×1 (prazo do marcador na árvore).
- `innerHTML` no escopo: `sei-functions-pro.js:602` (o próprio portão — o lint acusa mesmo sanitizado),
  `:2564`, `:3459`.

Manuais por área (linhas de hoje; o executor relocaliza pelo nome):

| área (Task) | faixa | handlers manuais | inserções manuais |
|---|---|---|---|
| 3 — utilitários, diálogos, área de transferência, dados por AJAX | 906–2435 e 7481–10205 | 2 | 18 |
| 4 — comparar documentos, editar dados pela árvore, marcadores, atribuição, hipótese legal, não lido | 2436–3972 | 4 | 16 |
| 5 — ações ao enviar, acompanhamento especial, reabertura programada, visualizadores, não assinados, baixar HTML/DOCX | 3973–5541 | 5 | 14 |
| 6 — histórico de andamentos, Gantt, datas e prazos (`getDatesPreview`), menu rápido, urgente | 5542–7480 | 6 | 1 |
| 7 — copiar link, capa, certidão, tabelas, imagens, Google Docs, visualizador e editor em diálogo, integridade, padrões | 10206–13114 | 2 | 15 |
| 8 — ícones das barras, Chosen, troca de unidade, criar documento/processo, QR, sigiloso | 13115–fim | 2 | 18 |

(As 7 inserções manuais restantes estão no topo do arquivo, fora das áreas; a Task 2 as trata.)

> **Atenção ao nome:** o "histórico de **andamentos**" (cache, paginação, Gantt, linhas 5673–6260) **não**
> é o Histórico TS (processos visitados). Ele fica no escopo.

**Editor:**

| arquivo | chamadas | tooltip | literal | `.html('')` | inserções manuais |
|---|---|---|---|---|---|
| `sei-pro-editor.js` | 0 | 0 | 2 | 0 | 32 |
| `sei-pro-editor-adapter.js` | 0 | 0 | 0 | 0 | 8 |
| `modules/editor/*.js` (35 arquivos, 18 com algo) | 14 | 1 | 8 | 17 | 29 |

`innerHTML`/`insertAdjacentHTML` no editor: `sei-pro-editor.js:1601`, `image-background.js:583, 643`,
`importar-doc.js:98, 106`, `nota-rodape.js:263`, `sigilo.js:392, 546` — os sete escrevem no **documento
do usuário** (P3).

## Global Constraints

- Tudo do plano 2b continua: ES5 em `dist/js` fora de template literal; acentos em `dist/js` como
  `\uXXXX` (`tools/escape-nonascii.mjs --check`, contagem não sobe); conversão iso-funcional; commits só com
  `dist/`, `docs/`, `pages/`; **nunca `git add -A`**; `tools/` e `tests/` ignorados pelo git.
- **Worktree:** `../sei-pro-dom-seguro`. O plano 3 parte do fim do 2b: criar a branch
  `fix/dom-seguro-plano-3` a partir de `fix/dom-seguro-plano-2b` e a ref
  `refs/dom-seguro/base-plano3` nesse commit; `export SPRO_REF_BASE=refs/dom-seguro/base-plano3`.
- **P3 nunca sanitiza:** conteúdo do documento do usuário (editor, numeração, sigilo, nota de rodapé,
  importação) vai por `reescreverDocumentoPro`. Perder conteúdo de documento é pior que a pendência da AMO.
- **Atividades fora:** função que só serve ao `sei-pro-atividades.js` não é convertida (lista na Task 1).
- **Lições que valem para toda conversão** (plano 2b):
  - `fn()` leva a lista vazia (`data-spro-args="'+argsPro()+'"`; o codemod já faz) — `tools/args-vazios.mjs`;
  - o codemod e o verificador não tocam `[onclick=...]` (seletor que lê handler nativo do SEI);
  - código que procura `[onclick*="fn"]` ou faz `removeAttr('onclick')` em elemento convertido tem de
    aceitar/remover também o `data-spro-*` (`tests/ferramentas/seletores-legados.test.mjs`);
  - `typeof X` num content script testa o mundo **isolado**;
  - dentro de template literal é `${argsPro()}`, nunca `'+argsPro()+'` (passa no `node --check` e vira texto);
  - tooltip gravado com `.attr('onmouseover', ...)` em elemento **da extensão** vira `.attr('data-spro-tip', ...)`;
    em elemento **nativo do SEI** (lido de volta por `extractTooltip` etc.) fica;
  - `// spro-limpo: <motivo>` silencia o detector de produtor numa atribuição conferida à mão;
  - `$('<div/>').html(v).contents()` → `lerHtmlPro('<div>' + v + '</div>').contents()`.
- **No SEI, navegar só por clique.** SEI MJ de homologação estava fora do ar em 23/10: passo condicional.
- **Nunca enviar processo** no SEI; documento criado para teste é apagado ou cancelado no fim.
- **Versão e HISTORICO no merge** (decisão do 2b); merge e envio à AMO, só com o autor.

## Review Focus

1. **Selo de prazo depois de convertido:** `getDatesPreview` passa a devolver `data-spro-click`/
   `data-spro-tip`. Prescrições, nota da árvore, Reabertura e Controle precisam manter tooltip e clique
   (`parent.filterTagView`). → teste na Task 6 e verificação ao vivo na Task 12.
2. **Ação resolvida na janela errada:** funções do `sei-functions-pro.js` montam HTML que vai para
   iframes (`ifrVisualizacao`, aninhado no SEI 4.1; diálogos). Com `data-spro-*`, quem resolve é o
   despachante do documento de destino, subindo de janela. → sonda em todos os frames nas Tasks 5 e 7.
3. **Conteúdo do documento perdido no editor:** Legística, sigilo, nota de rodapé, importar documento e
   imagem de fundo escrevem no corpo do documento. → teste de ida e volta (texto, `contenteditable`,
   atributos desconhecidos) na Task 10.
4. **Ação definida só no mundo isolado:** a cópia isolada do `sei-functions-pro.js` monta HTML com
   `data-spro-*`, mas o despachante resolve no mundo da página; nome que só exista no isolado vira órfão.
   → `auditActionsPro` em toda tela das Tasks 3 a 8 (órfãos = []).
5. **Função excluída que outro código chama:** excluir não remove nada, mas o que fica com `on*=`
   continua no zip e a AMO vê. → contagem "fora do escopo" no fechamento e decisão do autor (Task 14).

---

## Task 1: Lista de exclusão do `sei-functions-pro.js` e verificação por área

**Files:**
- Modify: `tools/fora-do-escopo.json`, `tools/check-dom-injection.mjs`
- Create: `tests/ferramentas/fora-sfp.test.mjs`

**Interfaces:**
- Produces: `tools/fora-do-escopo.json` com a chave `dist/js/sei-functions-pro.js`; a opção
  `node tools/check-dom-injection.mjs --faixa <arquivo>:<ini>-<fim>` (só varre ali, ignora
  `ARQUIVOS_CONVERTIDOS`); o bloco entre `=== INICIO SEI PRO DOM ===` e `=== FIM SEI PRO DOM ===` nunca é
  varrido (é o portão).

- [ ] **Step 1: Branch e base**

```bash
cd "/Users/phs/Documents/Git/Lab2Code/SEI Pro/sei-pro-dom-seguro"
git switch -c fix/dom-seguro-plano-3
git update-ref refs/dom-seguro/base-plano3 HEAD
export SPRO_REF_BASE=refs/dom-seguro/base-plano3
(cd tests && node --test dom-seguro/ ferramentas/ 2>&1 | grep -E "^# (pass|fail)")
```
Esperado: `# pass 170`, `# fail 0`.

- [ ] **Step 2: Teste que falha**

`tests/ferramentas/fora-sfp.test.mjs`:
- `carregarForaDoEscopo('dist/js/sei-functions-pro.js').funcoes` contém `batchActionsPro`,
  `setHistoryProcessosPro`, `getHtmlEtiqueta`, `setDarkModePro`, `filterTagKanban`, `openEditorViewDoc`;
- `validarForaDoEscopo(<fonte do arquivo>, <essa lista>)` não lança;
- **não** contém `getDatesPreview`, `getHtmlMarcador`, `getDadosHistoricoPro`, `getHistoryProcessosPro`,
  `initBoxSearchProtocoloSEI`, `initDocLoteModalSelecaoDoc` (são produtores ou pontes e ficam no escopo);
- `check-dom-injection --faixa dist/js/sei-functions-pro.js:557-1100` não acusa nada (o bloco DOM).

Rodar `(cd tests && node --test ferramentas/fora-sfp.test.mjs)`. Esperado: FAIL.

- [ ] **Step 3: A lista**

Acrescentar a `tools/fora-do-escopo.json`, com comentário por grupo (no `_leia`):
- **Histórico visitados (TS):** `setHistoryProcessosPro`, `cleanHistoryPro`. (`getHistoryProcessosPro` é
  a ponte do menu: fica.)
- **Ações em lote (TS):** `batchActionsPro`, `getDownloadAnexoFromArvore`, `getBatchActionsPro`,
  `getRowsDocumentosActionsPro`, `fillDocumentosActionsPro`, `refreshDocumentosActionsPro`,
  `getDocumentosActions`, `initAppendIconsDocumentosActions`, `setAppendIconsDocumentosActions`,
  `batchActionsSinglePro`.
- **Documentos em lote (TS):** `montarAtalhoLoteNoDialogoPro`.
- **Link permanente (TS):** `loopIDProtocoloSEI`, `initSearchProtocoloSEI`, `cleanSearchProtocoloSEI`,
  `appendSearchProtocoloSEI`.
- **Ordem dos painéis (TS):** `changePanelSortPro`, `changePanelSortColumnsPro`, `setSortDivPanel`,
  `controleSortDivPanel`.
- **Favoritos e etiquetas do legado (TS):** `htmlIconFavorites`, `saveFollowDesc`, `editFollowDesc`,
  `keyFollowDesc`, `showFollowEtiqueta`, `checkEtiquetaPriority`, `addOptionsEtiqueta`, `openColorEtiqueta`,
  `selectIconEtiqueta`, `changeColorEtiqueta`, `saveConfigEtiqueta`, `saveFollowEtiqueta`,
  `sugestEtiquetaPro`, `getHtmlEtiqueta`.
- **Estilo antigo (cinzenta):** `openStyleBoxSlimPro`, `openStyleBoxSlimPro_`, `changeSlimPro`,
  `_setColorSlimPro`, `setColorSlimPro`, `setIconLabel`, `setBtnRight`, `initToolbarOnTop`,
  `setDarkModePro`, `loadStyleDesign`.
- **Grade antiga e células de prazo (cinzenta):** `getDadosProcedimentosControlar`,
  `newTabDadosProcedimentosControlar`, `updateProcessGroupTable`, `setProcessGroupTable`,
  `cancelDadosProcedimentosControlar`, `endProcessGroupTable`, `breakDadosProcedimentosControlar`,
  `filterTagKanban`, `filterTagTable`, `updateTablePrazoProcesso`.
- **Só o Atividades chama:** `openEditorDoc`, `openEditorViewDoc`, `openConfigBoxPro`, `togglePainelPro`,
  `setProgressBarOnProcesso`, `ganttAutoProgressPercent`, `configDatesPreview`.

Antes de gravar, conferir cada nome com acorn e cada "só o Atividades chama" com a varredura da triagem
(nome sem uso em nenhum arquivo que fica: `sei-pro`, `sei-pro-all`, `sei-pro-arvore`, prescrições, `init*`,
legis, editor, `modules/editor`, visualização, lotes, ícones).

- [ ] **Step 4: `--faixa` e o bloco**

Em `check-dom-injection.mjs`: argumento `--faixa arquivo:ini-fim` (varre só aquelas linhas, com as mesmas
regras e respeitando a exclusão); e, em qualquer varredura do `sei-functions-pro.js`, pular as posições
entre as sentinelas do bloco DOM.

- [ ] **Step 5: Verde e linha de base**

```bash
(cd tests && node --test dom-seguro/ ferramentas/ 2>&1 | grep -E "^# (pass|fail)")
for f in 906-2435 2436-3972 3973-5541 5542-7480 7481-10205 10206-13114 13115-14900; do
  printf "%s " $f; node tools/check-dom-injection.mjs --faixa dist/js/sei-functions-pro.js:$f | tail -1; done
```
Esperado: suíte verde; uma linha por área com a contagem de erros de hoje (anotar: é o que cada task zera).

Sem commit (`tools/` e `tests/`).

---

## Task 2: Codemods no arquivo inteiro

**Files:**
- Modify: `dist/js/sei-functions-pro.js`

**Interfaces:**
- Consumes: Task 1.
- Produces: os produtores regulares já emitindo `data-spro-*`; a partir daqui, `produtores-pendentes`
  considera o `sei-functions-pro.js` convertido só no fim (Task 12).

- [ ] **Step 1: Aplicar**

```bash
F=dist/js/sei-functions-pro.js
node tools/converter-handlers.mjs $F --aplicar | grep -E "^tooltips"
node tools/converter-insercoes.mjs $F --aplicar | grep -E "^marcacao"
```
Esperado: `tooltips 31 | ocultar removidos 33 | chamadas 53 | ... | fora do escopo (ignorados) 80 | manuais 21`
e `marcacao literal -> htmlPro: 56 | .html('') -> .empty(): 10 | fora do escopo (ignorados): 51 | manuais: 89`
(números de 23/10; se o master mudou, registrar os novos no ledger).

- [ ] **Step 2: Os sete manuais do topo do arquivo** (linhas antes de 906, fora do bloco DOM) — pela
  população (P1 `htmlPro`, P2 `.text()`/`createTextNode`, P4 mover o nó, P5 `lerHtmlPro`).

- [ ] **Step 3: Bateria**

```bash
node --check $F
node tools/conferir-modos.mjs $F | tail -1          # 0 divergencia(s)
node tools/paridade-acoes.mjs $F | sed -n '/ausentes/,$p'   # ausentes: 0
node tools/args-vazios.mjs $F refs/dom-seguro/base-plano3 | tail -1   # args-vazios: 0
node tools/escape-nonascii.mjs --check $F           # contagem igual a da base
(cd tests && node --test dom-seguro/ ferramentas/ 2>&1 | grep -E "^# (pass|fail)")
```

- [ ] **Step 4: Ao vivo, fumaça** (SEI SP, Chrome; harness do 2b: `tests/ao-vivo/reiniciar.sh`,
  `config.mjs`): Controle, Pesquisa, um processo aberto e a árvore em 4 aberturas
  (`tests/ao-vivo/arvore.mjs 4`). Esperado: `marca: 'sim'`, 1 despachante, `orfaos: []`, nenhum aviso
  `[SEIPro] htmlPro:` e nenhum `pageerror` do SEI Pro.

- [ ] **Step 5: Commit** `DOM seguro: sei-functions-pro.js, conversao regular pelos codemods`.

---

## Tasks 3 a 8: os manuais de cada área

Uma task por área da tabela da triagem, **na ordem 3, 4, 5, 6, 7, 8**, cada uma com commit próprio.
Todas seguem o mesmo roteiro (o do plano 2, itens 2 a 8, com as lições das Global Constraints):

1. `node tools/check-dom-injection.mjs --faixa dist/js/sei-functions-pro.js:<faixa>` lista o que resta;
2. handlers manuais: função nomeada quando houver duas chamadas, `data-spro-captura` quando a ação
   precisa parar a propagação, `literalInlinePro` para token numérico;
3. inserções manuais pela população; `<style>`/`<iframe>`/`<link>`/`<meta>`/`<script>` por DOM API;
4. parse de resposta do servidor → `lerHtmlPro`;
5. `.attr('on...')` em elemento da extensão → `data-spro-tip`;
6. seletores `[onclick*=...]` que leem elemento convertido aceitam o `data-spro-*`;
7. `--faixa` da área: **0 erro**; `conferir-modos`, `paridade-acoes`, `args-vazios`, `escape-nonascii`;
8. ao vivo no SEI SP (Chrome), com a sonda em todos os frames: `orfaos: []` e nenhum aviso `[SEIPro]`.

O que cada área tem de específico e precisa de teste ou de verificação própria:

### Task 3 — utilitários, diálogos, área de transferência, dados por AJAX
- `confirmaBoxPro`, `alertaBoxPro` e afins montam diálogos com texto vindo de fora: o texto é P2 ou P1
  sanitizado; os botões continuam do jQuery UI (`restaurarBotaoJqueryUIPro`).
- `sei-functions-pro.js:2564` (`txt.innerHTML = html`): é decodificação de entidades → `lerHtmlPro`.
- Ao vivo: um diálogo de confirmação qualquer (ex.: remover marcador, cancelado), copiar para a área de
  transferência.

### Task 4 — comparar documentos, editar dados, marcadores, atribuição, hipótese legal, não lido
- `sei-functions-pro.js:3459` (`t.innerHTML = String(nome)`) → `.textContent` se for texto, `lerHtmlPro`
  se for entidade.
- `span[contenteditable]` do `diff-sanitize` está aqui: decidir pela população; se for edição inline de
  dado do processo, construir por DOM API (o sanitizador remove `contenteditable`).
- Ao vivo: comparar dois documentos; editar dados pela árvore e **cancelar**; marcar como não lido e
  desfazer.

### Task 5 — ações ao enviar, acompanhamento especial, reabertura, visualizadores, não assinados, baixar
- Os visualizadores (imagem, zip, vídeo) e a checagem de não assinados escrevem no `ifrVisualizacao`
  (aninhado no SEI 4.1): sonda em **todos** os frames (Review Focus 2).
- Ao vivo: abrir uma imagem e um zip pelo visualizador; "Baixar HTML" e "Baixar DOCX" de um documento;
  a tela de Enviar Processo (sem enviar).

### Task 6 — histórico de andamentos, Gantt, datas e prazos, menu rápido, urgente
- **`getDatesPreview` (Review Focus 1):** depois do codemod o selo sai com `data-spro-click` e
  `data-spro-tip`. Teste em `tests/dom-seguro/` com a função real extraída: chamar com
  `{date, duedate: true}` e com `{date}`, passar o retorno por `htmlPro`, disparar `mouseover` e `click`
  pelo despachante; esperado: tooltip mostra o texto de vencimento e o clique chama `filterTagView` com o
  elemento.
- Ao vivo: o selo nas prescrições (`tests/ao-vivo/prescricoes.mjs`), no Controle e na árvore; histórico de
  andamentos com paginação e o Gantt.

### Task 7 — copiar link, capa, certidão, tabelas, imagens, Google Docs, visualizador e editor em diálogo, integridade, padrões
- `getHtmlMarcador` (produtor) sai daqui; `setCapaProcesso` também.
- `<iframe>`/`<link>`/`<html>` do `diff-sanitize` concentram-se aqui (capa, visualização em diálogo,
  impressão): DOM API ou `reescreverDocumentoPro` quando for documento inteiro a imprimir (P3).
- Ao vivo: capa do processo, certidão (gerar e **não** salvar), abrir documento em diálogo, imprimir
  (cancelar a impressão), checar integridade.

### Task 8 — ícones das barras, Chosen, troca de unidade, criar documento/processo, QR, sigiloso
- Os `insertIcon*`/`appendIcon*` são os **pontos de entrada** de quase tudo, inclusive dos módulos TS:
  cada um tem de seguir disparando o que disparava (paridade).
- Ao vivo: cada ícone da barra do processo e da visualização abre o que abria; troca de unidade (e volta);
  "Novo documento" até a tela de cadastro (sem salvar); QR do processo; modal de senha do sigiloso.

---

## Task 9: O portão sem `innerHTML`

**Files:**
- Modify: `dist/js/sei-functions-pro.js` (só o bloco DOM)
- Test: `tests/dom-seguro/htmlpro.test.mjs`

O `web-ext lint` acusa `caixa.innerHTML = limpo` (`:602`) mesmo sendo o resultado do DOMPurify.

- [ ] **Step 1: Teste** — os testes atuais do `htmlpro` continuam valendo; acrescentar: o bloco DOM não
  contém `innerHTML =` nem `insertAdjacentHTML` (leitura do arquivo entre as sentinelas).
- [ ] **Step 2: Implementar** `sanitizarFragmentoPro` com `DOMPurify.sanitize(html, {...SEIPRO_PURIFY_CONFIG,
  RETURN_DOM_FRAGMENT: true})` (com o envelope de contexto atual — `ENVELOPES_PRO` — desembrulhado no
  fragmento) e `htmlPro` inserindo o fragmento pelo modo. Os 13+ testes de modo, envelope (`<tr>`, `<td>`,
  `<option>`, `<li>`) e despachante têm de seguir verdes.
- [ ] **Step 3: Bateria completa e commit** `DOM seguro: o portao insere fragmento, sem innerHTML`.

---

## Task 10: Editor — núcleo e adaptador

**Files:**
- Modify: `dist/js/sei-pro-editor.js`, `dist/js/sei-pro-editor-adapter.js`
- Create: `tests/dom-seguro/editor-ida-e-volta.test.mjs`

- [ ] **Step 1: Teste de ida e volta (Review Focus 3)** — um documento com `contenteditable="false"`
  (marcador da Legística), atributo desconhecido (`data-x="1"`), tabela com `<colgroup>` e texto com `&nbsp;`
  passa pelos helpers que o editor usar para reescrever o corpo e volta idêntico (comparar
  `outerHTML` normalizado).
- [ ] **Step 2: Classificar as 40 inserções manuais** (32 + 8): o que escreve no **documento** é P3
  (`reescreverDocumentoPro`); o que monta a interface do SEI Pro (diálogos, barras) é P1 (`htmlPro`).
  `sei-pro-editor.js:1601` (`tpl.innerHTML = html`) é parse para ler → `lerHtmlPro`.
- [ ] **Step 3: Converter**, CK4 e CK5 (o adaptador decide; não mexer na detecção de versão).
- [ ] **Step 4: Bateria + ao vivo** no SEI SP (CK4): abrir o Despacho editável da memória
  `reference_sei_sp_treinamento`, numeração (Legística), tabela rápida, estilos; **fechar sem salvar**.
- [ ] **Step 5: Commit** `DOM seguro: editor (nucleo e adaptador), documento pelo caminho P3`.

---

## Task 11: Editor — módulos

**Files:**
- Modify: `dist/js/modules/editor/*.js` (os 18 com achados)

- [ ] **Step 1: Codemods** em cada arquivo (14 chamadas, 1 tooltip, 8 literais, 17 `.empty()`).
- [ ] **Step 2: Os 29 manuais e os 6 `insertAdjacentHTML`/`innerHTML`** (`image-background.js:583, 643`,
  `importar-doc.js:98, 106`, `nota-rodape.js:263`, `sigilo.js:392, 546`): todos escrevem no documento do
  usuário → `reescreverDocumentoPro(el, html, 'prepend'|'append'|'after')` (o jQuery não aciona o lint e
  não sanitiza). `sigilo.js:392` lê um template → `lerHtmlPro`.
- [ ] **Step 3: Teste** — ampliar `editor-ida-e-volta.test.mjs` com sigilo (tarja e volta) e nota de
  rodapé (inserir e renumerar) usando as funções reais extraídas.
- [ ] **Step 4: Ao vivo** (SEI SP, CK4): sigilo (aplicar e remover), nota de rodapé, importar documento
  (sem salvar), imagem de fundo, link SEI em lote, QR; **fechar sem salvar**. SEI MJ (CK5) se estiver no ar.
- [ ] **Step 5: Commit** `DOM seguro: modulos do editor`.

---

## Task 12: Zerar as exceções

**Files:**
- Modify: `dist/js/sei-pro-prescricoes.js`, `dist/js/sei-pro-arvore.js`, `tools/check-dom-injection.mjs`

- [ ] **Step 1:** registrar `dist/js/sei-functions-pro.js` e os arquivos do editor em
  `ARQUIVOS_CONVERTIDOS`; `node tools/produtores-pendentes.mjs` em cada convertido: **0 produtores**.
- [ ] **Step 2:** os 4 `htmlCruPro`/`htmlCruArvorePro` viram `htmlPro`/`htmlArvorePro`; os pontos
  reservados (`.prazoPrescricaoPro`, `.prazoMarcadorArvorePro`, `.seloReaberturaArvorePro`, a data da nota)
  podem voltar a ser concatenação simples — **ou ficar**, se for menor diferença: o critério é o selo
  funcionar (Review Focus 1).
- [ ] **Step 3:** remover os `// spro-limpo:` que deixaram de ser necessários (o produtor não existe mais).
- [ ] **Step 4: Bateria** — `check-dom-injection`: `0 erro(s)` e `htmlCruPro (...): 0`; suíte verde.
- [ ] **Step 5: Ao vivo** — o selo de prazo nas prescrições, na nota da árvore, no Reabertura e no painel
  de marcador: tooltip e clique (`tests/ao-vivo/prescricoes.mjs` e o roteiro da árvore do 2b).
- [ ] **Step 6: Commit** `DOM seguro: fim das excecoes provisorias (htmlCruPro)`.

---

## Task 13: Pacote do Firefox

**Depende de:** o conserto do canal dos módulos TS no Firefox (memória `reference_firefox_porta_iframe`,
plano próprio). Sem ele, os módulos TS com iframe abrem e não conversam.

- [ ] **Step 1:** `node tools/gerar-pacote-firefox.mjs <versao> --sem-atividades` e
  `--oficial --sem-atividades`; `arquivos citados ausentes: 0`.
- [ ] **Step 2: `web-ext lint`** nos dois: 0 erros; **nenhum `UNSAFE_*` fora de `js/lib/`,
  `vendor/` e dos bundles do pdf.js (`js/agente/pdf-*.js`, `js/ferramentas-pdf/pdf-*.js`)**.
- [ ] **Step 3: Ao vivo no Firefox** (`tests/ao-vivo/firefox-base.mjs`, pacote **Lab**, que tem ID —
  o oficial temporário sem ID quebra o `storage.sync`): Controle, Pesquisa, processo com árvore e painéis,
  editor (fechar sem salvar), e cada módulo TS abrindo uma vez.
- [ ] **Step 4:** zips em `release/` só quando o autor pedir.

---

## Task 14: Fechamento

- [ ] **Step 1: Bateria completa** (como na Task 7 do 2b, com os arquivos novos) e a contagem
  "fora do escopo" por arquivo.
- [ ] **Step 2: Revisão final** em contexto novo (modelo mais capaz), com este plano, o spec, o Review
  Focus e os `Ruling:` do ledger.
- [ ] **Step 3: Decisão do autor (Review Focus 5):** o código fora do escopo (zonas cinzentas, legado
  substituído, Atividades) segue no zip com `on*=` e a AMO vê. Opções: (a) enviar assim, explicando; (b)
  apagar do pacote do Firefox o que é código morto lá; (c) esperar o TS virar padrão e apagar o legado.
- [ ] **Step 4:** memória (`project_dom_seguro_firefox`, `project_dom_seguro_licoes_conversao`);
  versão, `pages/HISTORICO.md`, merge e envio à AMO — com o autor.
