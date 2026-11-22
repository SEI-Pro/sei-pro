# Editor de documentos em TS: Plano 2 (recursos restantes do grupo 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portar para o pacote `editor/` os 8 recursos que sobraram do grupo 1 (copy-style, link-pro, table-styles, sumario, ref-interna, nota-rodape, qr-code, legis), funcionando em CKEditor 4 e 5, e apagar os módulos legados correspondentes.

**Architecture:** Igual ao plano 1: bundle TS no mundo da página (`dist/js/editor/pagina.js`) instala `window.<nome>` com os nomes do legado; o adapter legado pula módulos cujo id está em `data-seipro-editor-ts`. A novidade é que estes 8 recursos mexem no documento por **DOM direto** (âncoras `<a name>`, estilos célula a célula, renumeração de texto), o que não persiste no CK5; por isso o plano abre com uma sonda ao vivo do que o CK5 aceita e com utilitários compartilhados, antes de portar.

**Tech Stack:** TypeScript 5.9, esbuild, linkedom, tsx, biome, `@comum/*`, `acorn` (só nos testes de contrato), puppeteer-core (só no harness ao vivo).

**Spec:** `docs/superpowers/specs/2026-11-20-editor-ts-design.md` (seções 6, 8, 9). **Plano anterior:** `docs/superpowers/plans/2026-11-20-editor-ts.md` (Fundação e 12 recursos; leia o ledger `.superpowers/sdd/2026-11-20-editor-ts/progress.md` para os rulings e a lição de validação) e `editor/README.md`.

## Global Constraints

- Mesma branch `feat/editor-ts` (ou uma nova a partir dela, se o autor preferir). **Sem push, sem merge, sem release, sem mudar a versão do manifest, sem tocar em `pages/HISTORICO.md`.** Commits com o rodapé `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Português do Brasil em mensagens, comentários e textos de tela.
- Em `dist/js/*.js` os acentos ficam como `\uXXXX` (a ferramenta Edit converte: editar o legado por script Python ou só linhas ASCII); os bundles TS saem ASCII pelo build.
- Sem `innerHTML` cru; sem `onclick` inline; modais sem botão "Cancelar" (X e Esc fecham); `esbuild` com `target: ["chrome116","firefox115"]`; `world: "MAIN"` proibido.
- `tools/` e `dist/manifest_*.json` estão no `.gitignore`; só `dist/manifest.json` é versionado.
- **Validação ao vivo (CK4 no SP treinamento, CK5 na ANTAQ):** processo de testes da ANTAQ `50300.018905/2018-67` (Despacho-MINUTA `id_documento=3385255`, escrita liberada pelo autor; o login Microsoft é dele), processo de teste do SP (`99906.713-630.000032/2025-82`). **Depois de `installExtension` o primeiro carregamento usa o content script antigo e roda o LEGADO: conferir `data-seipro-editor-ts` contendo o id do recurso e recarregar pelo menos 2 vezes.** Nunca mexer em Chromes de outras sessões; nunca duas cópias do SEI Pro no mesmo navegador; nunca escrever em processo real. Nada é salvo pelos testes (só edição em memória).
- Contrato de nomes: cada recurso exporta **exatamente** os globais da sua tarefa (lista fechada, extraída do legado). O teste de contrato (`tests/verificar-contrato.ts`) falha se faltar um global que o legado ainda chama.
- **Link curto está fora de escopo:** o TinyURL bloqueia CORS e o autor fará um encurtador próprio no seipro.app (memória `project_tinyurl_proprio_seipro_app`). O QR Code continua chamando `window.ajaxTinyUrl` como hoje.

## Review Focus

1. **Âncoras e referências no CK5** (sumario, ref-interna, nota-rodape): a âncora inserida sobrevive ao salvar (`data.get`), ao Ctrl+Z (um passo) e a uma segunda renumeração sem duplicar. Testes nas Tasks 8, 9 e 10.
2. **HTML vindo de fora** (resposta da API de legislação, texto do título copiado para o sumário, URL do link): sempre entra como texto/atributo escapado, nunca como marcação; `javascript:` recusado. Tasks 6, 8 e 12.
3. **Documento sem o elemento procurado** (sem tabela sob o cursor, sem parágrafos numerados, sem títulos, sem nota de rodape): avisa e não altera. Tasks 7 a 10.
4. **Seção somente leitura** (CK4 `readOnly`, CK5 raiz `somenteLeitura`): nenhum recurso escreve nela nem em outra seção; a recusa avisa o usuário (Task 4). Todas as tarefas de recurso.
5. **API externa fora do ar ou bloqueada por CORS** (legis, qr-code com link curto): falha explícita para o usuário, nunca silêncio nem diálogo travado. Tasks 11 e 12.
6. **Renumeração com quebra de seção e níveis misturados** (ref-interna, nota-rodape): a numeração reinicia em `sessionBreakPro` e respeita Nível1 a Nível4. Tasks 9 e 10.

## Procedimento de cada recurso (Tasks 5 a 12)

Mesmo do plano 1, com a Fundação já pronta ("dois editores" = o teste roda nos falsos CK4 e CK5: `nosDoisEditores`, `tests/falsos/`; diálogos testam com `tests/dialogo.ts`).

- **P1. Ler o módulo legado** (`dist/js/modules/editor/<id>.js`) e os chamadores dele (monólito, `context-menu.js`, outros módulos, `sei-functions-pro.js`). Fixar no teste os casos entrada→saída (HTML literal) que o legado produz, **rodando o legado em Node quando for função pura** (foi o que revelou o bug do `capitalizar`) ou ao vivo no SP.
- **P2. Teste primeiro** em `editor/tests/recursos/<id>.ts`, registrado em `tests/verificar.ts`; rodar `cd editor && npm run verificar` e ver FALHAR.
- **P3. Implementar** `editor/src/recursos/<id>.ts` (`recurso: Recurso`) com os globais EXATOS da tarefa; DOM por `h()` de `@comum/ui/dom`; diálogo por `abrirDialogo` e `colunaDeFormulario`/`linhaDeCampo`; nada de jQuery, `innerHTML`, `CKEDITOR.*` ou `.dialog()`. Helpers do legado (`sanitizeHTML`, `alertaBoxPro`, `dialogBoxPro`, `getBase64Image`...) viram `src/util/*`/`src/ui/*`. Registrar em `src/recursos/ids.ts` e `indice.ts`.
- **P4. Verde:** `npm run tipos && npm run verificar && npm run checar && npm run build`.
- **P5. Conferir ao vivo** (harness da Task 1) no CK4 e no CK5: efeito, `getData`, Ctrl+Z em **um** passo, console sem erro novo do SEI Pro, e `data-seipro-editor-ts` com o id. Em diálogo, capturar a tela e olhar (layout, tema escuro).
- **P6. Commit** `feat(editor): porta <id> para TS`. **Não apagar o módulo legado aqui** (Task 13).

---

## Fundação 2

### Task 1: Harness ao vivo versionado

**Files:**
- Create: `editor/vivo/lib.cjs`, `editor/vivo/daemon.cjs`, `editor/vivo/ambientes.cjs`, `editor/vivo/preparar.cjs`, `editor/vivo/cenario.cjs`, `editor/vivo/README.md`

**Interfaces:**
- Produces: `lib.cjs`: `conectar(): Promise<Browser>` (CDP em `http://127.0.0.1:9444`), `pagina(browser, regex): Promise<Page|null>`, `esperar(ms)`. `daemon.cjs`: sobe o Chrome for Testing (caminho em `SPRO_CFT`, perfil em `SPRO_PERFIL`, `--user-agent` de Chrome comum por causa do 404 do SP, porta 9444) com `dist/` carregado. `ambientes.cjs`: `logarSp()` (usuário/senha de `SEI_SP_USUARIO`/`SEI_SP_SENHA`, órgão `0`, tratando "Escolha um Órgão" e a aba de login obsoleta), `abrirEditorSp()` (processo de teste → documento → `editarConteudo`), `editorAntaq()` (aba `editor_montar` já aberta pelo autor). `preparar.cjs [reinstalar]`: reinstala a extensão, **recarrega cada editor 2 vezes**, espera `SeiProEditorAdapter` e imprime `data-seipro-editor-ts`, falhando se faltar um id pedido por argumento. `cenario.cjs`: injeta `window.__spro = { versao, corpo(), definirHtml(html), selecionarTexto(seletorOuTexto), cursorEm(seletor), obterHtml(), desfazer(), focarCorpo() }` com a mesma API para CK4 e CK5 (o que cada script ao vivo reescreveu no plano 1: no CK5 `el.focus()` ANTES da seleção nativa; no CK4 `ed.createRange`), e `rodarEm(page, fn, ...args)`.

- [ ] **Step 1:** Escrever os 6 arquivos a partir dos scripts do plano 1 (estão no scratchpad da sessão anterior; se sumiram, reescrever do `README.md` do harness antigo em `tests/ao-vivo/` e das memórias `reference_sei_sp_treinamento` e `reference_chrome_teste_porta_9555`). Nenhuma credencial no arquivo: tudo por variável de ambiente.
- [ ] **Step 2: Verificar:** `node --check editor/vivo/*.cjs` (sem saída) e, com o daemon no ar e o SP logado, `node editor/vivo/preparar.cjs reinstalar ghs-unlock page-break` imprime os ids do atributo nos dois ambientes. Esperado: `SP/CK4 ok` e `ANTAQ/CK5 ok`.
- [ ] **Step 3: Commit** `chore(editor): harness ao vivo versionado (CDP) para validar CK4 e CK5`.

### Task 2: Sonda do CK5: âncoras, desfazer e estilos de tabela

**Files:**
- Modify: `docs/superpowers/specs/2026-11-20-editor-ts-design.md` (nova seção 9 "Achados da sonda do plano 2")
- Create: `editor/vivo/sondas/ck5-ancoras.cjs` (script versionado, reaproveitável)

Cada medida abaixo é uma pergunta com resposta sim/não e um valor; a Task 3 e as Tasks 7 a 10 usam as respostas. Rodar na ANTAQ (CK5) e, quando fizer sentido, no SP (CK4).

- [ ] **Step 1: Âncora nomeada.** No CK5, inserir por `model.insertContent` o HTML `<p>t</p>` e depois `<a name="x" class="seipro-bookmark"></a>` no início do parágrafo (por GHS e por `insertContent` com posição no início). Medir: (a) a âncora vazia sobrevive em `data.get`? (b) sobrevive com um espaço/`&#8203;` dentro? (c) `<a href="#x">` (link interno) sobrevive? (d) a numeração do próprio SEI (`Paragrafo_Numerado_*`) continua correta? Registrar **o HTML exato que sai**.
- [ ] **Step 2: `data.set` e desfazer.** Medir: `editor.data.set({[raiz]: html})` é desfazível (Ctrl+Z restaura)? O histórico de undo é limpo? A seleção volta onde estava (o `transformBodyHtml` do adaptador a restaura)? Isso decide se o fallback "reescrever o corpo inteiro" é aceitável.
- [ ] **Step 3: Estilos de tabela pelo GHS.** Com o cursor numa tabela 3×3, aplicar `SeiProGhs.setEstilos` e `setAtributos` na tabela, numa linha e numa célula; medir `data.get`. Medir também `<thead>` (primeira linha como cabeçalho) e o `p` dentro da célula.
- [ ] **Step 4: Propriedade `counter-reset`.** Aplicar `SeiProGhs.setEstilos(p, {"counter-reset": "..."})` num parágrafo depois de inserido e conferir se sai em `data.get` (a importação por `insertContent` a descartava).
- [ ] **Step 5: Registrar** as respostas na seção 9 do desenho, com a regra de decisão: (i) âncora por model **funciona** → Tasks 8, 9 e 10 usam model/GHS e Ctrl+Z é um passo; (ii) **não funciona** → usam `transformBodyHtml` (reescreve o corpo) e o spec registra a perda de desfazer; (iii) **nenhuma funciona** → parar e perguntar ao autor (muda o que será construído).
- [ ] **Step 6: Commit** `docs(editor): sonda do CK5 para ancoras, desfazer e estilos de tabela`.

### Task 3: Utilitários de âncora e de estilo de tabela

**Files:**
- Create: `editor/src/util/ancoras.ts`, `editor/src/util/tabelas.ts`, `editor/tests/util-ancoras.ts`
- Modify: `editor/tests/falsos/ck5.ts` (o falso passa a modelar o que a Task 2 mediu)

**Interfaces:**
- Produces:
  - `ancorarNoInicio(c: Contexto, ed: Editor, el: Element, nome: string, classe?: string): boolean` — põe `<a name="nome" class="classe"></a>` no início de `el`; devolve false se `el` está em seção somente leitura. Substitui qualquer âncora anterior com a mesma `classe` em `el` (idempotente, sem duplicar).
  - `nomeDaAncora(el: Element, prefixo: string): string | null` — lê o nome existente (`a[name^=prefixo]`).
  - `reescreverCorpo(c: Contexto, ed: Editor, fn: (doc: Document) => void): void` — fallback `transformBodyHtml` via `DOMParser` + `fn` + serialização (só se a Task 2 mandar).
  - `estilizarTabela(c, ed, tabela: Element, estilos: EstiloDeTabela): void` onde `EstiloDeTabela = { table: string; trCabecalho: string; tr: string | [string, string]; tdCabecalho: string; td: string; tdPrimeira: string; pCabecalho: string; p: string; cabecalho: boolean }` — CK4 por DOM (atributo `style`/`class`), CK5 por `SeiProGhs` conforme a Task 2.
- A implementação segue a decisão da Task 2 (Step 5), registrada como `Ruling:` no ledger.

- [ ] **Step 1: Testes** nos dois editores: `ancorarNoInicio` põe a âncora uma vez (segunda chamada com o mesmo `nome` não duplica); em raiz somente leitura devolve `false` e não escreve; `nomeDaAncora` lê o nome; `estilizarTabela` aplica `table`/`tr`/`td` esperados numa tabela 3×3 (linha 0 = cabeçalho, linhas pares/ímpares alternadas quando `tr` é par ordenado) e, com `cabecalho: true`, a 1ª linha fica em `thead`.
- [ ] **Step 2: Rodar** (FALHA), **implementar** conforme a decisão, **rodar** (PASS), `npm run tipos && npm run checar`.
- [ ] **Step 3: Commit** `feat(editor): utilitarios de ancora e de estilo de tabela (CK4 e CK5)`.

### Task 4: Dívidas da Fundação que estes recursos exigem

**Files:**
- Modify: `editor/src/ui/avisar.ts`, `editor/src/ui/dialogo.ts` (ou `abrir.ts`), `editor/src/adaptador/ck4.ts`, `editor/src/adaptador/ck5.ts`, `editor/src/adaptador/tipos.ts`, `editor/src/pagina/main.ts`, `editor/src/recursos/align.ts`, `editor/src/util/paragrafos.ts`, `editor/src/recursos/latex.ts`, `editor/src/recursos/tiny-url.ts`, `editor/src/recursos/session-break.ts`
- Test: `editor/tests/verificar-ui.ts`, `editor/tests/verificar-adaptador-ck4.ts`, `editor/tests/verificar-adaptador-ck5.ts`, `editor/tests/recursos/{align,latex,tiny-url,quebras}.ts`

São os "minors" diferidos da revisão final do plano 1 que os novos recursos agravam.

**Interfaces:**
- Produces: `avisarEditor(doc, texto)` garante o `<style data-seipro-editor="base">` (mesmo CSS dos diálogos) antes de mostrar o aviso; `Adaptador.aoRecusarEscrita(fn: (motivo: "somente-leitura") => void): void` — cada backend chama `fn` quando uma escrita é ignorada por seção somente leitura; `main.ts` registra `avisarEditor(doc, "Esta seção do documento é somente leitura.")`.

- [ ] **Step 1: Testes (FALHAM primeiro):**
  - `avisarEditor` num documento sem nenhum diálogo injeta **um** `<style data-seipro-editor="base">` (e não duplica depois de abrir um diálogo).
  - Backends: com `aoRecusarEscrita(espiao)`, `insertHtml`/`insertHtmlBefore`/`appendToBody` em seção/raiz somente leitura chamam o espião **uma vez** e não escrevem; em seção editável o espião não é chamado.
  - `align` no CK5: parágrafo com `text-align` inline e estilo SEI, ao trocar o alinhamento, chama `SeiProGhs.setEstilos(p, {"text-align": null}, ed)` além de trocar o `estilo`.
  - `latex` e `tiny-url`: o "Inserir" usa a instância capturada **ao abrir o diálogo** (teste: abrir, depois `focar(null)` e remover `oEditor`; a inserção vai para a instância original).
  - `session-break` no CK5: depois de inserir, aplica `SeiProGhs.setEstilos(<p.sessionBreakPro>, {"counter-reset": "paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "})` (o espaço final é do legado); no CK4 o HTML não muda. (Só se a Task 2, Step 4, mostrou que o GHS preserva a propriedade; senão registrar `Ruling:` e pular este item.)
- [ ] **Step 2: Implementar**, rodar (PASS), `npm run tipos && npm run checar && npm run build`.
- [ ] **Step 3: Ao vivo** (harness): CK5, cursor na raiz somente leitura → o aviso aparece estilizado; quebra de seção no CK5 grava `counter-reset` em `data.get`.
- [ ] **Step 4: Commit** `fix(editor): aviso estilizado, recusa de escrita avisa, align limpa text-align, instancia do dialogo, counter-reset no CK5`.

---

## Recursos

### Task 5: copy-style (Copiar formatação)

**Files:** Create `editor/src/recursos/copy-style.ts`, `editor/tests/recursos/copy-style.ts`. Legado: `copy-style.js` (233).

**Interfaces:** Produces `setCopyStyle`, `actionCopyStyle`, `getCopyStyle`, `applyCopyStyle`, `removeCopyStyle`, `menuCopyStyle` (este último é chamado por `context-menu.js`). Estado do "pincel" em `sessionStorage.copyStylePro` (o estilo capturado) e classe `cke_copyformatting_active` no corpo (mesmo contrato do legado).

- [ ] **P1-P6.** Casos fixados no P1 (rodar o legado ao vivo no SP): capturar de um trecho **negrito + itálico + sublinhado + tachado + sub/sobrescrito + cor + cor de fundo + tamanho**; aplicar em outra seleção reproduz exatamente esses; **sem seleção ao capturar** → aviso e o pincel não liga (Review Focus 3); com o pincel ligado, `Esc`, segundo clique no botão e `removeCopyStyle` o desligam; o botão reflete `cke_button_on/off`; o menu de contexto (`menuCopyStyle`) devolve os itens `{label, action}` e entra por `adaptador.addContextMenu`; aplicar em seção somente leitura avisa e não escreve. No CK5 a cor/fundo/tamanho vão por `span` inserido (como o legado, escapando a seleção que já é HTML serializado — ver o ruling do `font-size` do plano 1) e as marcas por `execCommand`.
- [ ] **Ao vivo:** pincel entre dois parágrafos nos dois editores; Ctrl+Z desfaz a aplicação num passo.

### Task 6: link-pro (balão do link, editar, copiar, remover)

**Files:** Create `editor/src/recursos/link-pro.ts`, `editor/tests/recursos/link-pro.ts`. Legado: `link-pro.js` (209); `restoreIframeDisplayLink` em `sei-pro-editor.js`.

**Interfaces:** Produces `openLinkPro`, `removeLinkPro`, `copyLinkPro`, `editLinkPro`, `getDialogLinkPro`, `openDialogLinkPro`, `hideLinkTips`, `showLinkTips` (usado por `context-menu.js`), e exporta também `restoreIframeDisplayLink()` (o monólito chama). `showLinkTips(alvo?)` aceita o documento do iframe (CK4) ou deriva o corpo por `adaptador.getBodyContainer` (CK5). Área de transferência injetável (`Contexto.areaDeTransferencia?: { writeText(t): Promise<void> }`, padrão `navigator.clipboard`).

- [ ] **P1-P6.** Casos: o balão só aparece sobre `<a href>` http/https (não sobre `#ancora`, `mailto:`, `javascript:`); `openLinkPro` abre `target=_blank` com `rel="noopener noreferrer"`; `copyLinkPro` copia a URL e avisa; `removeLinkPro` troca `<a href="x">t</a>` por `t` mantendo o texto; `editLinkPro` abre o diálogo com URL e texto atuais, Confirmar atualiza **texto e URL** num passo; **URL `javascript:`/`data:text/html` é recusada** com aviso e nada muda (Review Focus 2); `hideLinkTips` limpa o balão; no CK5 as edições vão pelo model (`SeiProGhs.setAtributos` para o `href`; remover = `unlink`).
- [ ] **Ao vivo:** criar um link, passar o mouse, editar, copiar, remover; Ctrl+Z em um passo cada.

### Task 7: table-styles (Estilo de tabela)

**Files:** Create `editor/src/recursos/table-styles.ts`, `editor/src/util/estilos-tabela.ts` (as tabelas de estilos/cores portadas de `getStyleTable`/`getColorID` de `sei-functions-pro.js`), `editor/tests/recursos/table-styles.ts`. Legado: `table-styles.js` (177); `detectSyleSelectedTable` e `setBgTableColor` do monólito.

**Interfaces:** Produces (grafia **"Syle"** do legado mantida) `getSyleSelectedTable`, `changeColorTable`, `getDialogSyleTable`, `buildHtmlSyleTable`, `openDialogSyleTable`, `getSyleTable`, `setSyleTable`. `getSyleSelectedTable` e `openDialogSyleTable` são usados por `context-menu.js`. Usa `estilizarTabela` (Task 3). `estilos-tabela.ts` exporta `CORES: Record<string, ...>` e `estilosDaTabela(cor, larguraPercentual): Record<string, EstiloDeTabela>`.

- [ ] **P1-P6.** Casos: rodar `getStyleTable`/`getColorID` do legado em Node para **cada** combinação (estilo × variação de cor × largura 100/80/50) e fixar os valores no teste (`estilosDaTabela` deve devolver exatamente o mesmo); o diálogo lista os estilos; **trocar a variação de cor (radio) atualiza o preview antes do Aplicar** (regressão histórica de 11/09/2026: listener por `addEventListener`, nunca `onchange` em HTML sanitizado); Aplicar grava na tabela sob o cursor: `table`, `tr` do cabeçalho, `tr` alternadas, `td` da 1ª coluna, `p` com a classe de célula; "primeira linha como cabeçalho" move a 1ª `tr` para `thead`; **sem tabela sob o cursor** avisa e não abre/aplica (Review Focus 3); tabela dentro de tabela: aplica na mais próxima do cursor.
- [ ] **Ao vivo:** tabela rápida 3×4 (recurso já portado) → estilo 2, variação 3, largura 80%: o preview muda de cor, o Aplicar grava (`data.get` mostra `border-color`/`background-color`), Ctrl+Z em um passo.

### Task 8: sumario (Sumário)

**Files:** Create `editor/src/recursos/sumario.ts`, `editor/tests/recursos/sumario.ts`. Legado: `sumario.js` (182).

**Interfaces:** Produces `getSumarioDocumento`, `getListStylesDocumento`, `updateSelectDialog`, `getDialogSumarioDocumento`, `getDialogSumarioDocumento_` (com sublinhado), `insertSumarioDocumento`. Usa `ancorarNoInicio` (Task 3) com `classe: "seipro-bookmark"` e nome `bookmark-<16 aleatórios>`.

- [ ] **P1-P6.** Casos fixados lendo o legado: documento com `Item_Nivel1`, `Item_Nivel2`, `Item_Nivel1` gera "SUMÁRIO" (parágrafo `Texto_Alinhado_Esquerda` em negrito) e 3 linhas `<p class="Texto_Alinhado_Esquerda"><a href="#bookmark-XXXX">título</a></p>`, **uma âncora no início de cada título**; os estilos oferecidos no seletor são os que existem no documento; reinserir o sumário **não duplica âncoras** (a anterior é substituída) nem deixa o sumário antigo; título com `<` ou `&` entra como **texto escapado** no link (Review Focus 2); documento sem títulos avisa e não insere (Review Focus 3); cursor em seção somente leitura avisa (Task 4).
- [ ] **Ao vivo:** documento de teste com 3 itens numerados nos dois editores: `data.get` traz as 3 âncoras e os 3 links; clicar num link do sumário (ele leva à âncora); Ctrl+Z desfaz o sumário e as âncoras **num passo** (Review Focus 1, conforme a decisão da Task 2).

### Task 9: ref-interna (Referência interna)

**Files:** Create `editor/src/recursos/ref-interna.ts`, `editor/src/util/numeracao.ts`, `editor/tests/recursos/ref-interna.ts`. Legado: `ref-interna.js` (259); `clickScroolToRef` em `sei-pro-editor.js:~2391`.

**Interfaces:** Produces `getRefInterna`, `updateRefsInternas(editor?, prefixo, ocultarPrefixo?)` (aceita a assinatura antiga `updateRefsInternas(prefixo, ocultar)`), `getNiveisParagrafos(editor?)`. Exporta também `clickScroolToRef()` (o monólito chama no `initFunctions`; rola até a âncora ao clicar numa referência). `numeracao.ts` exporta `numerar(paragrafos: Array<{ classe: string }>): Array<{ item: string }>` — função pura: contadores `Paragrafo_Numerado_Nivel1..4` ("1", "1.1", "1.1.2", "1.1.2.3") e `Item_Nivel1..4` independentes, e **`sessionBreakPro` zera todos** (Review Focus 6). Âncoras `<a name="RefPro_<16>">` por `ancorarNoInicio` (classe `refpro`), referências `<a href="#RefPro_x" class="ancoraSei refInternaPro anchorRefInternaPro" contenteditable="false">[prefixo item]</a>`.

- [ ] **P1-P6.** `numerar` testado puro com os casos do legado (rodar `getNiveisParagrafos` em Node sobre um DOM fixo): Nível1,Nível2,Nível2,Nível1,Nível3 → "1","1.1","1.2","2","2.0.1" (conferir o valor **literal** que o legado produz para salto de nível); quebra de seção reinicia; `Item_*` conta à parte. Diálogo: prefixo, "Não utilizar prefixo", lista de parágrafos (rótulo "N. texto até ~50 caracteres…"), botões "Atualizar referências" e "Inserir"; inserir 2 referências gera `[pref 1.1] e [pref 2]` (vírgula entre as primeiras, " e " antes da última, como o legado); **atualizar** depois de inserir um parágrafo antes renumera os rótulos existentes; referência a parágrafo removido vira "referência perdida" como o legado; prefixo vazio equivale a "sem prefixo"; sem parágrafos numerados avisa (Review Focus 3).
- [ ] **Ao vivo:** referenciar o 1.1, inserir um parágrafo numerado antes, "Atualizar referências" → o rótulo vira 1.2; clique na referência rola até o alvo; Ctrl+Z (um passo por ação).

### Task 10: nota-rodape (Nota de rodapé)

**Files:** Create `editor/src/recursos/nota-rodape.ts`, `editor/src/util/data-por-extenso.ts` (substitui `setMomentPtBr` só no que o legado usa), `editor/tests/recursos/nota-rodape.ts`. Legado: `nota-rodape.js` (317).

**Interfaces:** Produces `getNotaRodape`, `getDialogNotaRodape`, `openDialogNotaRodape`, `removeNtRodape`, `updateNrABNT`, `insertNtRodape`, `updateNtRodape`, `reorderNtRodape`. Usa `clickScroolToRef` (Task 9) e `ancorarNoInicio` (Task 3). Diálogo com abas **Texto livre**, **Padrão ABNT**, **Atualizar notas**, **Remover notas** (controle de abas por `role="tablist"`/`tab`/`tabpanel`, sem jQuery UI).

- [ ] **P1-P6.** Casos fixados no P1 (HTML literal do legado): nota 1 e depois 2 geram o bloco de rodapé com numeração 1 e 2 e as chamadas sobrescritas; inserir uma nota **antes** da primeira reordena (`reorderNtRodape`) e renumera; remover a nota 1 renumera a 2 para 1; **Remover notas** remove todas as chamadas e o bloco; modo ABNT (`updateNrABNT`) monta a referência (autor, título, local, data por extenso, URL com `isValidHttpUrl`); texto da nota com `<`/`&` entra escapado (Review Focus 2); sem notas, "Atualizar" e "Remover" avisam e não alteram (Review Focus 3).
- [ ] **Ao vivo:** duas notas, reordenar, remover, salvar e reabrir (a chamada continua apontando para a nota); Ctrl+Z em um passo.

### Task 11: qr-code (Código QR)

**Files:** Create `editor/src/recursos/qr-code.ts`, `editor/src/util/qr.ts`, `editor/tests/recursos/qr-code.ts`. Legado: `qr-code.js` (280); a lib `js/lib/jquery-qrcode-0.18.0.min.js` é carregada pelo `init.js`.

**Interfaces:** Produces os 11 globais `getQrCode`, `getDialogQrCode`, `openDialogQrCode`, `buildHtmlQrCodeLab`, `resetOptionsQR`, `toggleOptionsQR`, `tipQrCodeUrl`, `setInputTinyUrl`, `convertTinyURL`, `updateQrCode`, `setQrCode`. **Decisão do plano:** manter a lib jQuery do QR e chamá-la por um único ponto, `util/qr.ts: gerarQr(win, alvo: HTMLElement, opcoes: OpcoesQr): HTMLCanvasElement | null` (`win.jQuery(alvo).qrcode(...)`); trocar a lib fica fora deste plano. `convertTinyURL` chama `window.ajaxTinyUrl(url, "", "setinput")` como o legado (o endpoint será trocado pelo encurtador próprio depois).

- [ ] **P1-P6.** Casos: `getQrCode` abre o diálogo com a URL do documento como texto padrão; `updateQrCode` com "https://exemplo.gov.br/x" chama `gerarQr` com esse texto e as opções de tamanho/cor/nível do legado (espião); "Opções avançadas" abre/fecha o painel (`toggleOptionsQR`), "Redefinir" volta aos padrões (`resetOptionsQR`) — **os dois clicam de verdade** (regressão de 11/09/2026); texto vazio avisa e não insere; confirmar insere a imagem do QR como data URI com `alt` do texto (escapado); `convertTinyURL` com a rede bloqueada por CORS **avisa o erro** (Review Focus 5) e deixa o texto como está; `setInputTinyUrl` troca o campo quando a conversão chega.
- [ ] **Ao vivo:** gerar o QR nos dois editores (sem link curto) e inserir; Ctrl+Z em um passo; conferir a captura do diálogo (painel de opções).

### Task 12: legis (Legislação)

**Files:** Create `editor/src/recursos/legis.ts`, `editor/src/util/legis-api.ts`, `editor/tests/recursos/legis.ts`. Legado: `legis.js` (578).

**Interfaces:** Produces `resolverNormasLegisPro`, `sendLegisSEI`, `insertLegisSEI`, `getLegisSEI`, `getSearchLegisMore`, `getSearchLegis`, `getDialogLegisSEI`. `resolverNormasLegisPro` é chamado por `js/sei-legis.js` (referências "@lei8666") e **precisa continuar global**. `legis-api.ts` exporta `buscarNormas(rede, base, filtros)` e `resolverSiglas(rede, base, siglas)` (GET `/v1/normas`, POST `/v1/normas/resolver`; `base` = `URL_LEGIS_API` da página). Rede injetável (`Contexto.fetch`). Diálogo com abas Federal, Infralegal e Lista de Normas.

- [ ] **Step 1 (decisão antes de codar): sonda de CORS.** Da página do SEI (SP e ANTAQ), chamar `fetch(`${URL_LEGIS_API}/v1/normas?...`)` e registrar o resultado na seção 9 do desenho. **Se for bloqueado por CORS: PARAR e perguntar ao autor** (a API é do seipro.app, então o servidor pode liberar CORS; muda o que será construído).
- [ ] **P1-P6.** Casos com a API simulada: pesquisa "lei 14133" lista normas (título curto e apelido como o legado); escolher a norma insere a âncora `.legisSeiPro` com o texto e o link no formato do legado (fixar o HTML literal no P1); **número repetido lista as opções em vez de escolher uma** (há 7 "Decreto nº 1"); com ano preenchido a busca já volta com uma; busca sem resultado mostra mensagem; resposta com `<img onerror>` ou `javascript:` no texto/URL entra como texto e o href é recusado (Review Focus 2); falha de rede ou HTTP 5xx → aviso claro e o diálogo continua utilizável (Review Focus 5); respeita as opções `verifyOpcao`/`checkOpcao` que o legado consulta; "Ementa" (`getSearchLegisMore`) alterna.
- [ ] **Ao vivo:** pesquisar e inserir um artigo de lei pública nos dois editores; Ctrl+Z em um passo; `sei-legis.js` continua resolvendo "@lei8666" (global `resolverNormasLegisPro` presente).

---

## Fechamento

### Task 13: Prova de limpeza e remoção dos 8 módulos legados

**Files:**
- Delete: `dist/js/modules/editor/{copy-style,link-pro,table-styles,sumario,ref-interna,nota-rodape,qr-code,legis}.js`
- Modify: `dist/js/sei-pro-editor-adapter.js` (tirar os 8 de `MODULES`), `dist/js/sei-pro-editor.js` (remover `clickScroolToRef` e `restoreIframeDisplayLink` se a prova mostrar que só os recursos TS os chamam), `editor/tests/contrato-legado.json`, `editor/README.md`, `dist/js/modules/editor/README.md`, `docs/mapa-do-legado.md` (seção 2.1), `docs/superpowers/specs/2026-11-20-editor-ts-design.md`

- [ ] **Step 1: Congelar o contrato antes de apagar:** gerar (com `contratoDoModulo`, como no plano 1) os `exportados`/`necessarios` dos 8 módulos e acrescentá-los a `tests/contrato-legado.json`.
- [ ] **Step 2: Prova por módulo** (o script do plano 1: nomes de arquivo, globais em `dist/js`, `dist/html`, `*/src` e atributos `data-spro-*`, separando comentário de código com `acorn`) e de duplicatas de declaração (`function X` em outro arquivo legado que sobrescreveria o TS). Módulo com referência viva fora do recurso TS **não** é apagado.
- [ ] **Step 3:** `node tools/check-dom-injection.mjs`, `node tools/conferir-modos.mjs <arquivo> HEAD` para cada arquivo editado, `node tools/escape-nonascii.mjs --check <arquivos>`; tirar os módulos apagados da lista local de `tools/check-dom-injection.mjs`.
- [ ] **Step 4: Apagar**, ajustar `MODULES`, os comentários-ponteiro do monólito (`// X() -> editor/ (TS)`) e a documentação.
- [ ] **Step 5: Ao vivo** (harness, com atributo conferido e 2 recargas): nos dois editores, todos os globais dos 20 recursos definidos, features legadas restantes sem erro de módulo ausente, uma ação de cada recurso funcionando.
- [ ] **Step 6: Commit** `chore(editor): apaga os 8 modulos legados portados no plano 2`.

### Task 14: Verificação final e revisão

- [ ] **Step 1:** `cd editor && npm run tipos && npm run verificar && npm run checar && npm run build`; `git status` limpo; confirmar que não houve push, merge, mudança de versão nem edição de `pages/HISTORICO.md`.
- [ ] **Step 2:** Pedir a revisão de contexto novo da branch inteira (modelo mais capaz), com o Review Focus deste plano verbatim e o ponteiro para os `Ruling:` do ledger; tratar os Critical/Important em **uma** passada com teste que falha primeiro; os Minor vão ao ledger como diferidos.
- [ ] **Step 3:** Reportar ao autor: rulings, minors diferidos, o que foi validado ao vivo em cada editor e o que não foi, e o estado do empacotamento (manifests de marca ainda sem o bloco do `init_editor.js`).
