# Editor de documentos em TS: desenho

Data: 20/11/2026. Branch: `feat/editor-ts`. Status: aprovado. Plano 1 executado em 20/11/2026: Fundação + grupo 0 + tiny-url e latex (12 recursos); os 8 recursos restantes do grupo 1 (ref-interna, table-styles, sumario, link-pro, nota-rodape, copy-style, qr-code, legis) passaram para o plano 2 por decisão do autor.

## 1. Intenção

Levar o editor de documentos do SEI Pro (hoje JavaScript com jQuery) para a stack TS no molde de `documentos-lote/` e `comparador-documentos/`: `src/`, `tests/` com linkedom, `build.mjs` com esbuild, aliases `@comum/*` e `@nucleo/*`, scripts `tipos`, `verificar` e `checar`. O editor tem de funcionar em CKEditor 4 (SEI 3.1/4.x) e CKEditor 5 (SEI 5). A migração é feita feature por feature, sem quebrar o legado enquanto ele existir.

Por quê: é o maior bloco do legado com uso visível (`docs/mapa-do-legado.md`, 2.1); o port para CK5 deixou funções "parecendo portadas" com CK4 cru por dentro, mascaradas pelo `tryRun` do monólito; e sem tipos nem provas cada correção (ver `project_campos_dinamicos_regressao`) é descoberta pelo usuário.

## 2. Objetivos, não objetivos, anti-objetivos

**Objetivos**
- Cada feature portada funciona em CK4 e em CK5, provada por teste automatizado e ao vivo nos dois editores.
- Contrato de nomes globais preservado enquanto o legado existir (o monólito chama `window.getInsertCheckboxButtom` etc.).
- Legado cede por feature, de forma reversível, e só é apagado com prova de que nada vivo o referencia.
- Nenhuma mudança de comportamento visível ao usuário nas features portadas, exceto onde o legado estava quebrado em CK5 (aí o port corrige, e fica registrado).

**Não objetivos (deste plano)**
- Grupos 2, 3, 4 e o monólito (barra, colar/soltar, salvamento automático, `setParamEditor`): planos seguintes.
- Trocar o CKEditor, atualizar `lib/ckeditor`, mexer no Agente (`sei-pro-agente-editor.js`).
- Publicar release, subir versão do manifest, push ou merge.

**Anti-objetivos (seria falha mesmo funcionando)**
- Duas cópias ativas da mesma feature (legado e TS) no mesmo editor.
- `innerHTML` cru, `onclick` inline, modal com botão "Cancelar", acento cru em `dist/js`.
- Código TS que só funciona em CK4 ou só em CK5.

## 3. Restrições conhecidas

- O CKEditor (`CKEDITOR.instances` no CK4; `ckeditorInstance` e `INFRA_EDITOR_CONFIG` no CK5) só existe no **mundo da página**. O bloco 8 do manifest (`editor_montar`, `document_end`, frame topo, sem `all_frames`) roda `init.js` no mundo **isolado**, que injeta adapter, módulos e monólito na página via `$.getScript`. O Agente tem o mesmo problema e resolveu com `sei-pro-agente-editor.js` + `postMessage` com token.
- Ordem de carga atual: adapter -> módulos (lista `MODULES` do adapter) -> monólito. Módulos definem globais com os mesmos nomes que o monólito referencia.
- Opções do usuário: o legado lê `localStorage.configBasePro` na própria página (`getConfigValue`/`checkConfigValue`/`verifyConfigValue`); a regra "ausente = ligada" (`checkConfigValue`) ou "ausente = desligada" (`verifyConfigValue`) existe em `sei-comum/src/opcoes/legadas.ts`.
- `esbuild` mira `chrome116` e `firefox115`: `world: "MAIN"` declarativo (Chrome 111+, Firefox 128+) fica fora.
- Em `dist/js/*.js` os acentos ficam como `\uXXXX` (os bundles TS saem ASCII pelo build). `tools/` e `dist/manifest_*.json` estão no `.gitignore`; só `dist/manifest.json` é versionado.
- O `sei-nucleo/src/dominio/editor.ts` lê/grava seções por HTTP, sem editor aberto. Serve de referência para estilos e seções, **não** substitui o editor ao vivo.

## 4. Abordagens consideradas

| | Onde roda | A favor | Contra |
|---|---|---|---|
| **A (escolhida)** | Um bundle TS (IIFE) no mundo da página, injetado por um content script mínimo | Mesmo modelo de execução de hoje; handlers síncronos (colar, soltar, tecla) continuam possíveis; globais no mesmo mundo do monólito; sem RPC | Sem `chrome.*` na página (config vem do `localStorage`; URLs da extensão vêm do `data-*` do script) |
| B | TS no mundo isolado, RPC para a página (desenho do Agente) | `chrome.*` e testes mais simples | Paste/drop/keydown exigem código síncrono na página de qualquer jeito; globais em mundos diferentes do monólito quebram o contrato de nomes; tudo assíncrono |
| C | `world: "MAIN"` no manifest | Sem `<script>` injetado | Exige Chrome 111+/Firefox 128+; o projeto mira Firefox 115 |

Escolha do autor: **A**.

## 5. Inventário (medido com `acorn` em 20/11/2026)

Colunas: linhas; **CK4 cru** = ocorrências de `CKEDITOR.` (candidatas a quebrar no CK5); **monólito** = quantas das funções exportadas o `sei-pro-editor.js` referencia; **fora** = quantas são referenciadas em outros arquivos do legado (`sei-functions-pro.js`, `sei-pro.js`, `sei-pro-all.js`, `sei-pro-ai.js`, árvore, visualização); **helpers** = globais que o módulo usa do monólito/`sei-functions-pro.js`.

### Grupo 0 (primeiro plano): quase só adapter

| Módulo | Linhas | CK4 cru | monólito | fora | Helpers de fora do adapter |
|---|---|---|---|---|---|
| page-break | 25 | 0 | 1 | 0 | nenhum |
| session-break | 26 | 0 | 1 | 0 | nenhum |
| checkbox | 45 | 0 | 1 | 0 | `randomString` |
| cap-letter | 30 | 1 | 1 | 0 | `capitalizeFirstLetter`, `alertaBoxPro` |
| style-editor | 60 | 1 | 2 | 0 | `insertFontIcon` |
| font-size | 93 | 4 | 1 | 0 | `alertaBoxPro` |
| align | 220 | 1 | 3 | 0 | nenhum |
| folha-papel | 153 | 4 | 2 | 1 | `getIframesEditorPro` |
| quick-table | 210 | 0 | 4 | 0 | `htmlPro`, `randomString` |
| ghs-unlock | 373 | 0 | 2 | 3 | nenhum (expõe `SeiProGhs`, usado por todos) |

### Grupo 1 (primeiro plano): diálogo + helpers genéricos de UI

| Módulo | Linhas | CK4 cru | monólito | fora | Helpers |
|---|---|---|---|---|---|
| tiny-url | 121 | 0 | 1 | 0 | `ajaxTinyUrl`, diálogo, `sanitizeHTML` |
| latex | 126 | 2 | 3 | 0 | `setParamEditor`, diálogo |
| ref-interna | 259 | 2 | 3 | 0 | `clickScroolToRef`, diálogo |
| table-styles | 177 | 1 | 7 | 0 | `getStyleTable`, `getColorID`, `setBgTableColor`, `detectSyleSelectedTable` |
| sumario | 182 | 4 | 6 | 0 | diálogo, `uniqPro` |
| link-pro | 209 | 1 | 8 | 0 | `restoreIframeDisplayLink`, `idEditor` |
| nota-rodape | 317 | 1 | 8 | 0 | `clickScroolToRef`, `setMomentPtBr` |
| copy-style | 233 | 5 | 6 | 0 | `getElementStyleSelected`, `setParamEditor` |
| qr-code | 280 | 7 | 11 | 0 | `ajaxTinyUrl`, `iconSeiPro` |
| legis | 578 | 6 | 6 | 0 | `setChosenInCke`, `onlyNumber` |

Total do primeiro plano: 20 módulos, cerca de 3,7 mil linhas.

### Planos seguintes (fora de escopo agora)

- **Grupo 2, imagens:** image-quality (103), image-base64 (694), image-background (677), image-editor (377). Dependem de `qualityImages`, `qualidadeImagens`, `isDarkMode` do monólito e da lib `filerobot`.
- **Grupo 3, `dadosProcessoPro` (iframe oculto):** dados-processo (498), escrita-interativa (525), citacao (133), processo-publico (261), link-sei-lote (592), minuta-watermark (206), sigilo (631). Dependem de `arrayDadosEditor`, `replaceDadosEditor`, `camposDinamicosProcesso`, `openCamposDinamicosForm`, `getInteressadosProcesso`, `getListaAtribuicaoProcesso`, `sumTagValue`. Aqui fecha-se a cadeia do iframe oculto (`#frmCheckerProcessoPro`).
- **Grupo 4, grandes ou parciais:** review (727, 11 `CKEDITOR.`), ditado (588, parcial), importar-doc (492, parcial), context-menu (298), auto-cleanup (379).
- **Monólito (2501 linhas, 77 funções):** barra (`htmlButton`, `addButton`), colar/soltar imagens, salvamento automático, `setParamEditor`/`getIframeEditorPro`, certidão e documento automático, estilos CK4.
- **`sei-functions-pro.js`:** ~19 funções do editor, que vão sendo substituídas por equivalentes de `sei-comum`.

## 6. Desenho da abordagem A

### 6.1 Pacote e build

Pasta `editor/` na raiz, como `comparador-documentos/`:

```
editor/
  package.json  build.mjs  tsconfig.json  biome.json
  src/
    pagina/main.ts          entrada do bundle do mundo da pagina
    adaptador/              CK4 e CK5 tipados (espelha o contrato do SeiProEditorAdapter)
    recursos/<id>.ts        uma feature por arquivo; cada uma exporta {id, globais, iniciar?}
    ui/                     dialogo e botoes por DOM API (usa @comum/ui, sem innerHTML)
    opcoes.ts               leitura de localStorage.configBasePro (regras check/verify)
    contrato.ts             ids, marcador de cedencia, nomes globais
    ponte/init.ts           content script isolado minimo (init_editor.js)
  tests/                    verificar.ts + fixtures; linkedom; CKEditor 4 e 5 falsos
```

Saídas (todas ASCII, com portão de bytes como o `comparador-documentos/build.mjs`):
- `dist/js/init_editor.js`: content script isolado (IIFE).
- `dist/js/editor/pagina.js`: bundle do mundo da página (IIFE), `web_accessible_resources`.

### 6.2 Ligação ao CKEditor

1. `init_editor.js` entra no manifest com os mesmos `matches` do bloco 8 (`editor_montar`, `texto_padrao_interno_*`, `secao_modelo_alterar`), `run_at: document_end`, frame topo.
2. Ele (a) grava no `<html>` o atributo `data-seipro-editor-ts="id1,id2,..."` (lista gerada pelo build), de forma síncrona, e (b) injeta `<script src="js/editor/pagina.js" data-base="<URL da extensao>">`.
3. `pagina.js` espera o editor ficar pronto (mesma regra de `detectVersion`: `.ck-editor__editable` => CK5; `CKEDITOR.instances` => CK4; indeterminado => aguardar) e então instala os globais de cada recurso.

O atributo do `<html>` é visível aos dois mundos, então o `init.js` legado não precisa ser editado para saber o que ceder.

### 6.3 Cedência do legado

`SeiProEditorAdapter.loadModules` (legado) passa a **pular** todo módulo cujo id esteja em `data-seipro-editor-ts`. É uma edição ASCII em `sei-pro-editor-adapter.js` (poucas linhas), e a cedência é reversível: tirar o id da lista do build devolve o legado. O módulo legado só é apagado depois da prova de limpeza (seção 9).

Se o atributo faltar (por exemplo, `init_editor.js` não carregou), o legado carrega normalmente: falha segura.

### 6.4 Contrato com o legado

Cada recurso TS define `window.<nome>` com **os mesmos nomes e assinaturas** que o módulo legado exportava e que o monólito ou outros arquivos chamam (inventário da seção 5, colunas monólito e fora). Um teste de contrato percorre o monólito com `acorn`, lista os globais chamados e confere que cada um existe após o carregamento do bundle (TS ou legado).

Convivência dos dois adaptadores na transição: o adaptador TS é usado só pelos recursos TS; o monólito e os módulos não portados seguem no adapter legado. O estado compartilhado precisa ser comum, e por isso:
- `SeiProGhs` (ghs-unlock) é portado **primeiro** e continua em `window.SeiProGhs`; todos os módulos legados o usam.
- Menu de contexto: o registro de construtores (`bodyEl.__seiProCtxBuilders`) é o mesmo objeto nos dois lados; o adaptador TS o reutiliza em vez de criar outro.
- Contador de marcadores de seleção do CK5 (`markerSeq`): o adaptador TS usa um prefixo próprio, sem colisão.

### 6.5 Regras de código dos recursos

- Operar no editor só pelo adaptador TS. Nada de `CKEDITOR.*` solto, `iframe.contents()` ou `editor.getSelection()` cru fora do ramo CK4 do adaptador.
- No CK5, classes, estilos e atributos só pelo model (General HTML Support, via `SeiProGhs`), nunca por mutação de DOM.
- Diálogos por DOM API, sem `innerHTML`, sem `onclick` (usar `data-spro-click` quando houver HTML estático), **sem botão "Cancelar"** (X e Esc fecham).
- Sem jQuery e sem DOMPurify nos recursos novos; o que o legado sanitizava vira construção por DOM.
- Nada em tempo de avaliação que dependa do monólito; helpers de `sei-functions-pro.js` são substituídos por equivalentes locais ou de `@comum`.

## 7. Ordem do primeiro plano

0. **Fundação:** pacote, build, adaptador TS (CK4 e CK5), opções, marcador de cedência, edição do adapter legado, sonda ao vivo (item 8), harness de testes com CKEditor falso.
1. **Grupo 0**, nesta ordem: ghs-unlock, page-break, session-break, checkbox, cap-letter, align, font-size, style-editor, quick-table, folha-papel.
2. **Grupo 1**, dos menos acoplados: tiny-url, latex, ref-interna, table-styles, sumario, link-pro, nota-rodape, copy-style, qr-code, legis.

Cada recurso: teste automatizado primeiro, port, validação ao vivo em CK4 (SP) e CK5 (ANTAQ), commit. Depois do grupo 0 e do grupo 1, rodar a prova de limpeza antes de apagar qualquer módulo legado.

## 8. Achados da sonda ao vivo (Task 10)

Medidos em 20/11/2026 no SEI SP treinamento (4.1.5, CKEditor 4), Chrome for Testing 157, com `init_editor.js` e o bundle construídos a partir desta branch. O lado CK5 ainda não foi sondado (falta o ambiente, ver abaixo).

**CK4 (SP):**
- `editor_montar` abre como **janela própria** (alvo `page` de topo, `window.name` = `janelaEditor_<unidade>_<documento>`), não como iframe. O bloco do manifest sem `all_frames` (frame topo) basta: `init_editor.js` e `js/editor/pagina.js` rodaram na janela do editor e em nenhum outro frame.
- O frame topo traz 4 instâncias `CKEDITOR.instances` (`txaEditor_776` "Cabeçalho" e `txaEditor_777` "Título do Documento", somente leitura; `txaEditor_778` "Processo e Interessado" e `txaEditor_779` "Corpo do Texto", editáveis) e 4 iframes `iframe.cke_wysiwyg_frame` **titulados pelo nome da seção**, nunca `txaEditor_N`. Confirma o motivo de `getInstance` achar a instância pelo contêiner `div.cke`, e de a primeira instância ser somente leitura.
- Os iframes das seções são `about:srcdoc` (same-origin). Além deles, na janela há `ifrEditorSalvar` (`about:blank`), `ifrPasta` e o `frmCheckerProcessoPro` (iframe oculto do `dadosProcessoPro`).
- **Cedência provada funcionalmente, em 2 recarregamentos:** com `IDS_RECURSOS=["page-break"]`, o `<html>` recebeu `data-seipro-editor-ts="page-break"`, o `<script data-seipro-editor="pagina">` foi injetado e o bundle rodou (`window.__seiProEditorTs`). O adapter legado então **não** carregou `page-break.js` (`typeof getPageBreak === "undefined"`, ausente de `getFeatures()`) e carregou os outros 35 módulos (`getSessionBreak` e `getInsertCheckboxButtom` definidas). Sem o id (linha de base), `getPageBreak` volta a existir. O `loadModules` do legado só roda depois de a cadeia `setTimeout(500)` + `ready` + `$.getScript` do adapter, bem depois de `document_end`, o que dá folga ao atributo síncrono; não foi medida em milissegundos (o buffer de resource timing da janela está cheio de plugins do CK4).
- Ruído preexistente, igual com e sem as mudanças desta branch: `pageerror: TypeError: Cannot read properties of null (reading 'contentWindow')` ao carregar a janela (duas vezes por carga).
- Não deixar o mundo da página cair em `Page.reload`: a recarga da janela do editor funciona, mas o Chrome de teste guarda o content script em cache (reinstalar a extensão com o mesmo id antes de recarregar, como nas memórias de teste).

**CK5 (ANTAQ, SEI 5.0.4), medido no mesmo dia:**
- `editor_montar` também é **janela própria** (`janelaEditor_<unidade>_<documento>`), e o mesmo bloco do manifest basta: `init_editor.js` e o bundle rodaram nela (atributo `data-seipro-editor-ts`, `<script data-seipro-editor="pagina">`, `window.__seiProEditorTs`). O `window.CKEDITOR.instances` **não existe** (`ckGlobalInstances: false`); a detecção é `.ck-editor__editable` e `ckeditorInstance`.
- Documento "Despacho-MINUTA": 7 raízes em `INFRA_EDITOR_CONFIG.rootsAttributes` (`txaEditor_1768` Cabeçalho, `1769` Título do Documento, `1771` Separador de Seções e `1775` Rodapé somente leitura; `1770` Endereçamento, `1772` **Corpo do Texto (`principal: true`)** e `1773` Assinatura_Signatario_Cargo editáveis), todas como `.ck-editor__editable_inline` na janela de topo (sem iframe de seção). O adapter legado se declara versão 5.
- **Cedência provada também no CK5:** com `page-break` no atributo, `getPageBreak` ficou `undefined` e os outros 34 módulos carregaram (35 features, com o `ghs-unlock` ativo).
- Ruído preexistente na ANTAQ: `pageerror` de `contentWindow` e de `parent.infraIsBreakpointBootstrap is not a function` (dois de cada por carga), que independem desta branch.
- **Ambiente de escrita em CK5:** processo de testes da ANTAQ `50300.018905/2018-67` (`id_procedimento=683589`), liberado pelo autor para escrita; documento de teste "Despacho-MINUTA" `id_documento=3385255`. Há também um Despacho de teste no SP (processo 148265, `id_documento=162824`).

## 9. Prova antes de apagar legado (todo módulo)

1. Busca de símbolos de cada nome global exportado em `dist/js`, `dist/html`, `*/src` e nas strings `data-spro-click`/`parent.xxx`, com o `acorn` de `tests/` separando código vivo de comentário.
2. `node tools/check-dom-injection.mjs`
3. `node tools/conferir-modos.mjs <arquivo> <ref>`
4. `node tools/escape-nonascii.mjs --check`
5. Retirar o id do módulo da lista `MODULES` e do diretório só depois dos itens acima e da validação ao vivo.

## 10. Validação ao vivo

- **SEI SP treinamento** (4.1.5, CK4): login da memória (feito por mim); se vier "404 Not Found", apagar cookies do domínio (Incapsula) e logar de novo. Criar documentos novos no processo de teste da unidade; nunca escrever em processo real.
- **SEI ANTAQ** (5, CK5): o login Microsoft é do autor (peço quando precisar); só leitura em documentos públicos. Para escrita em CK5 usar o SEI MJ homologação quando o autor logar, ou documento de teste em ambiente liberado por ele.
- Chrome de teste por CDP (Chrome for Testing, `Extensions.uninstall` + `Extensions.loadUnpacked` para recarregar). Nunca mexer em Chromes de outras sessões; nunca duas cópias do SEI Pro no mesmo navegador.

## 11. Fica para quem constrói

- Forma exata de cada recurso (assinaturas, estados internos) desde que o contrato de nomes do inventário seja mantido.
- Estrutura interna de `adaptador/` e dos falsos de CKEditor para os testes.
- Escolha de componentes de `@comum/ui` para os diálogos.
- Textos de ajuda e mensagens já existentes nas páginas `pages/` são mantidos; mudança de texto fica registrada em `pages/HISTORICO.md` (só no release, que este plano não faz).

## 12. Riscos

- **Dois adaptadores em convivência** (6.4): estado compartilhado mal alinhado gera bug só visível em CK5. Mitigação: portar `ghs-unlock` e o registro de menu de contexto primeiro, e testes de contrato.
- **`tryRun` mascarando falha**: o monólito engole erros "esperados" em CK5. A sonda e a validação ao vivo precisam olhar o console, não só a tela.
- **Cache do content script no Chrome de teste** (memória `reference_chrome_teste_porta_9555`): reinstalar a extensão (mesmo id) depois de cada build.
- **Cobertura dos manifests de marca**: só `dist/manifest.json` é versionado; os de marca ficam defasados até serem regenerados antes de empacotar (regra de empacotamento do mapa, seção 4.1).

## 9. Achados da sonda do CK5 para o plano 2 (22/11/2026)

Medidos na ANTAQ (SEI 5.0.4, CKEditor 5) com `editor/vivo/sondas/ck5-ancoras.cjs` e `ck5-tabela-id.cjs`; só edição em memória.

| Pergunta | Resposta |
|---|---|
| `<a name="x" class="seipro-bookmark"></a>` (âncora nomeada, vazia ou com `&#8203;`) sobrevive em `data.get`, por `insertContent` ou por `data.set`? | **Não.** O `<a>` sem `href` é descartado nas duas rotas (com `&#8203;` sobra só o caractere). |
| `id` num parágrafo, posto por `SeiProGhs.setAtributos(p, {id})`? | **Sim**, sai em `data.get` e sobrevive a reler com `data.set`. |
| `<a href="#id">` (link interno) sobrevive? | **Sim**, mas a classe `ancoraSei`/`refInternaPro` do link é descartada (só `href`). |
| `editor.data.set({raiz: html})` é desfazível? | **Não**: o comando `undo` continua desabilitado e o conteúdo não volta. O fallback "reescrever o corpo" **perde o desfazer** e fica descartado. |
| Estilo/atributo em `tr` e `td` por `SeiProGhs` (célula a célula)? | **Sim** (`style`, `data-*`). |
| Estilo na `<table>`? | **Sim, pelo elemento de model `table`** (GHS `setModelHtmlStyles("table", …)`/`setModelHtmlAttributes("table", …)`), obtido do `figure.table` do DOM: `style="border-collapse:…;width:80%;…" border cellspacing cellpadding` saem em `<table class="table">`. O `SeiProGhs.setEstilos` NÃO serve para a tabela (mapeia o DOM `<table>` interno, que não tem elemento de model, e devolve false). |
| Várias chamadas de GHS num mesmo `model.change` externo são um passo de desfazer? | **Sim** (chamadas isoladas são um passo cada). |
| `counter-reset` por `SeiProGhs.setEstilos` num parágrafo já inserido? | **Sim**: `style="counter-reset:paragrafo-n1 …;"` sai em `data.get` (a importação por `insertContent` o descartava). |
| Cabeçalho da primeira linha: `data.set` com `<thead>` volta como `<thead><tr><th>`; o comando `setTableRowHeader` estava desabilitado com o cursor numa célula. | Usar o atributo `headingRows` do model `table` (a medir na implementação). |

**Decisão (regra da Task 2, caminho (i) adaptado):** no CK5 a "âncora" de uma referência é o **`id` do próprio elemento** (parágrafo ou título), posto pelo model (`SeiProGhs`), e os links são `<a href="#id">`. No CK4 continua a âncora do legado, `<a name>` no início do elemento (o CK4 grava o DOM). As referências no CK5 se identificam por `a[href^="#<prefixo>"]` (a classe do link não sobrevive). Documentos criados no CK4 com `<a name>` perdem a âncora ao abrir no CK5 (o CK5 a descarta no carregamento): as referências para elas ficam "perdidas", e `updateRefsInternas` precisa tratar isso. Risco a conferir ao gravar no SEI real: o servidor aceitar `id` em parágrafos (o CK5 já o emite).


### Sonda da API de legislacao (plano 2, Task 12, 22/11/2026)

`fetch` a partir da pagina do editor (SP treinamento e ANTAQ): GET `https://legis.seipro.app/v1/normas?...` e POST `/v1/normas/resolver` (JSON, com preflight) respondem 200 com CORS liberado nos dois ambientes. Nada a pedir ao autor; o recurso `legis` fala direto com a API.
