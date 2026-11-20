# Limpeza do legado Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remover do `dist/js/` o que sobrou da ferramenta antiga com Google (Sheets e login) e os arquivos legados de Favoritos, Processos em lote e Documentos em lote, sem deixar referência quebrada nem regressão nos módulos TS.

**Architecture:** Só deleção e reescrita de pontes em arquivos JavaScript legados (`dist/js/`), mais uma opção em `opcoes-pagina` (TS) e documentação. Cada etapa é verificada por: busca de símbolos removidos (zero uso fora de comentário), `node --check`, portões do projeto, suítes TS, e validação ao vivo no Chrome de teste.

**Tech Stack:** JavaScript legado (jQuery), TypeScript (`opcoes-pagina`), Node (`acorn` do `tests/` para separar código vivo de comentário), Chrome de teste por CDP.

**Spec:** `docs/superpowers/specs/2026-11-20-limpeza-do-legado-design.md` (e `docs/mapa-do-legado.md`)

**Correções ao desenho, descobertas ao ler o código (valem para este plano):**
- O código do login Google no `sei-functions-pro.js` (`initClientPro` … `logoutSheetPro`) e em `sei-pro-atividades.js` (`getTokenGoogle`, `onLoad`, `signOutProfile`) já está **dentro de comentários** `/* … */`; `sei-forms.js`, `sei-sync-processos.js` e `sei-gantt.js` nem existem mais em `dist/js/`. Logo o Atividades **não** perde o login por esta limpeza (o `CLIENT_ID` do perfil dele é dado do Atividades e **fica**).
- `initProcLoteModal` (em `sei-pro-proc-lote.js`) é a **ponte** que dispara `spro-processos-lote-abrir` para o módulo TS: `abrirProcessosLotePro` (em `sei-pro-all.js`) só funciona por causa dela, então vira a ponte (como já é `initDialogCompareDocs`).
- `opcoes-pagina/src/perfis.ts` já preserva `CLIENT_ID`/`API_KEY`/`spreadsheetId` guardados; nada a mudar ali.

## Global Constraints

- Edições em `dist/js/*.js` legados **por script Python com fatiamento de texto** (ou `Edit` só em linhas ASCII): acentos nesses arquivos ficam como `\uXXXX` (a ferramenta `Edit` converte). Conferir no fim: `node tools/escape-nonascii.mjs --check <arquivo>` não pode piorar a contagem de linhas com não-ASCII (baseline: `sei-functions-pro.js` 53 linhas, `init.js` 0).
- `tools/` e `dist/manifest_*.json` estão no `.gitignore`: ajustes neles são locais e **não entram no commit**; só `dist/manifest.json` é versionado.
- Nenhum release e nenhuma mudança de versão do manifest. Notas entram em "Versão 3.9.5 / Em preparação" de `pages/HISTORICO.md`.
- Branch de trabalho: `chore/limpeza-legado` (a partir de `master`). Commits terminam com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Ferramenta de conferência (scratchpad, não versionada): `vivo.mjs <arquivo> '<regex>'` lista só as linhas **fora de comentário** que casam (usa `acorn`). Caminho: `/private/tmp/claude-501/-Users-phs-Develop-Git-Lab2Code-SEI-Pro-sei-pro/21a70d42-4982-4486-b5bd-f80268e5bef1/scratchpad/vivo.mjs`.
- Busca de símbolos removidos: `git grep -nwE '<s1>|<s2>' -- dist '*/src' ':!dist/js/lib' ':!*.md'` (a saída esperada é vazia, ou só comentários explicando a remoção).

## Review Focus

- Texto com travessão (—) e aspas curvas (“ ”) em **texto de marcador** e em **nome de documento enviado por arrastar** continua convertido, não apagado (mesma saída de `procLote_paraLatin1`). Teste na Task 3.
- Menus **Processos em lote** e **Documentos em lote**: abrem o módulo TS; sem o content script na página mostram aviso (nunca silêncio). Teste na Task 3 (evento e aviso) e na Task 7 (ao vivo).
- Carregar home, processo, visualização e editor **sem `ReferenceError`** novo no console: chamadores de símbolo removido não podem ficar sem guarda. Teste na Task 5 (busca) e Task 7 (console ao vivo).
- Perfis salvos com `CLIENT_ID`/`API_KEY`/`spreadsheetId` continuam preservados ao salvar as opções. Teste na Task 2.
- Favoritos TS (estrela, painel, ações em lote) e etiquetas dos Projetos (`getColorTags` sem `getStoreFavoritePro`) seguem funcionando. Teste na Task 5 e na Task 7.

---

### Task 1: Google no código legado vivo

**Files:**
- Modify: `dist/js/init.js`, `dist/js/sei-pro.js`, `dist/js/sei-functions-pro.js`, `dist/js/sei-pro-visualizacao.js`, `dist/js/sei-pro-arvore.js`, `dist/js/init_db.js`, `dist/css/sei-pro.css`, `dist/css/sei-slim.css`
- Create (commit): `docs/mapa-do-legado.md`, `docs/superpowers/specs/2026-11-20-limpeza-do-legado-design.md`, este plano

**Interfaces:**
- Produces: nenhum símbolo novo. Remove (nomes que as demais tasks podem supor ausentes): `divIconsLoginPro`, `handleClientLoadPro`, `checkLoadConfigSheets`, `loadDataBaseSheets{Projetos,Formularios,Processos}Pro`, `setSessionGoogle`, `_G`, `CLIENT_ID_PRO`, `API_KEY_PRO`, `insertIconFormSheet`, `appendIconFormSheet`, `initClientPro`, `onSignInPro`, `updateSigninStatusPro`, `loadSheetIconPro`, `handleAuthClickPro`, `handleSignoutClickPro`, `logoutSheetPro`.

- [ ] **Step 1: Branch e documentos**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro" && git switch -c chore/limpeza-legado
git add docs/mapa-do-legado.md docs/superpowers/specs/2026-11-20-limpeza-do-legado-design.md docs/superpowers/plans/2026-11-20-limpeza-do-legado.md
git commit -m "Docs: mapa do legado, desenho e plano da limpeza"
```

- [ ] **Step 2: Linha de base (deve ser o estado a comparar depois)**

Run: `node vivo.mjs dist/js/init.js 'gapi|Sheets?\b|divIconsLoginPro|sheetsLoginPro'` e o mesmo para `sei-pro.js`, `sei-functions-pro.js`, `sei-pro-visualizacao.js`, `sei-pro-arvore.js` com a regex `gapi|spreadsheet|handleClientLoadPro|checkLoadConfigSheets|insertIconFormSheet|appendIconFormSheet|appendIconsFormArvore|CLIENT_ID_PRO|API_KEY_PRO`.
Expected: linhas vivas listadas (init.js ~17, sei-pro.js ~18, functions: `CLIENT_ID_PRO`/`API_KEY_PRO`, `insertIconFormSheet`, `appendIconFormSheet`; arvore 2; visualizacao 2).

- [ ] **Step 3: Remover, por script Python com fatiamento (um por arquivo)**

  - `init.js`: o bloco que declara `dataValues_ProjetosSheets`, `dataValues_FormulariosSheets`, `dataValues_ProcessosSheets` e os **três** `if/else` que os usam (incluindo `localStorageRemovePro('loadEtapasSheet' | 'loadFormulariosSheet' | 'loadSyncProcessosSheet')`); o comentário `/* function loadDataBaseSheetsProjetosPro … } */` com as três funções e `setSessionGoogle`; a função `divIconsLoginPro` e a chamada dela (`divIconsLoginPro();` perto de `loadDataBaseProStorage`); a linha `localStorageRemovePro('loadEtapasSheet')` solta (linha ~340). **Ficam**: `dataValues_AtividadesAPI` (inclui `conexaoTipo=='googleapi'`), OpenAI, Gemini e `perfil.CLIENT_ID` do Atividades.
  - `sei-pro.js`: funções `handleClientLoadPro` e `checkLoadConfigSheets` (corpo inteiro) e **as duas** chamadas `checkLoadConfigSheets();` (em `initSeiPro`/arredores).
  - `sei-functions-pro.js`: o comentário `/* function _G() { … } */`; as linhas `var CLIENT_ID_PRO = false;` e `var API_KEY_PRO = false;` (e os 3 comentários `// var spreadsheetId…_Pro = …` vizinhos); o bloco comentado inteiro do login Google, de `//Initializes the API client library…` até o fim de `logoutSheetPro` (conferir que `loadSheetIconPro`, `handleAuthClickPro` e `handleSignoutClickPro` estão dentro do mesmo bloco; achar o fim por `*/`); as funções `insertIconFormSheet` e `appendIconFormSheet` (a segunda carrega um ícone base64 grande).
  - `sei-pro-visualizacao.js`: o `if` de `parent.insertIconFormSheet` (3 linhas). `sei-pro-arvore.js`: o `if` de `parent.appendIconsFormArvore` (3 linhas).
  - `dist/css/sei-pro.css`: `.sheetsLoginPro i`, `#authorizeButtonPro, #signoutButtonPro` e `#authorizeButtonPro` (regras e os `{}` delas); `dist/css/sei-slim.css`: as regras `…a#signoutButtonPro:before` (2 seletores).
  - `init_db.js`: o ramo `else if` que cria perfil `conexaoTipo: 'sheets'` a partir de `param.client_id/api_key/sheet_id` (o `NEW_BASE` de Sheets, perto da linha ~244). O ramo do Atividades (`conexaoTipo: "api"`) **fica**.

- [ ] **Step 4: Verificar (zero vivo e sintaxe)**

Run: o mesmo `vivo.mjs` do Step 2 com a regex ampliada acima; `node --check` em cada `.js` editado; `node tools/escape-nonascii.mjs --check dist/js/sei-functions-pro.js dist/js/init.js`.
Expected: `0 linhas VIVAS` em todos; `--check` sem piora (functions 53 linhas, init 0); `node --check` sem saída.

- [ ] **Step 5: Portões do projeto**

Run: `node tools/check-dom-injection.mjs 2>&1 | tail -3` e `node tools/conferir-modos.mjs dist/js/sei-functions-pro.js master 2>&1 | tail -3`.
Expected: `0 erro(s)`. Se `check-dom-injection` acusar "modo de inserção perdido" para `sei-functions-pro.js` (o `appendIconFormSheet` tinha um `htmlPro(…, 'append')`), registrar em `tools/check-dom-injection.mjs`, tabela `REDUCOES_ESPERADAS`, `'dist/js/sei-functions-pro.js': { append: N }` (somar ao `5` que já existe do comparador), com o motivo.

- [ ] **Step 6: Commit**

```bash
git add dist/js dist/css && git commit -m "Remove a ferramenta antiga do Google (Sheets, login e botoes) do codigo legado"
```

### Task 2: Opção `sincronizarprocessos` e perfis

**Files:**
- Modify: `opcoes-pagina/src/schema-dados.ts` (remover o item `nome: "sincronizarprocessos"`), e o que os testes de `opcoes-pagina/tests/` referenciarem (contagem de itens, lista de chaves)
- Regenerate: `dist/html/options.js` (bundle do `opcoes-pagina`)
- Test: `opcoes-pagina/tests/`

**Interfaces:**
- Consumes: nenhuma da Task 1.
- Produces: o schema sem `sincronizarprocessos`. `perfis.ts` **não muda** (preserva `CLIENT_ID`/`API_KEY`/`spreadsheetId`).

- [ ] **Step 1: Teste que falha**

Em `opcoes-pagina/tests/` (achar o arquivo que cobre o schema e o que cobre `perfis`): adicionar duas asserções, seguindo o estilo dos testes vizinhos — (a) o schema **não** contém nenhuma opção de nome `sincronizarprocessos`; (b) coleta de um perfil legado `{baseTipo:"projetos", conexaoTipo:"sheets", CLIENT_ID:"c", API_KEY:"k", spreadsheetId:"s", …}` devolve os três campos `CLIENT_ID`, `API_KEY` e `spreadsheetId` com os mesmos valores (já preservados hoje; esta é a prova de que a limpeza não os descarta).

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd opcoes-pagina && npm run verificar 2>&1 | grep -E "FALHA|falha"`
Expected: FALHA somente em (a); (b) passa desde já.

- [ ] **Step 3: Remover o item** `sincronizarprocessos` de `schema-dados.ts` e ajustar os testes antigos que contavam ou listavam esse item (ler a falha, corrigir o número esperado).

- [ ] **Step 4: Rodar tudo e regenerar o bundle**

Run: `cd opcoes-pagina && npm run tipos && npm run verificar 2>&1 | tail -3 && npm run checar >/dev/null; echo checar=$?` e depois o build que gera `dist/html/options.js` (`npm run build`; conferir em `package.json` o nome do script).
Expected: `tipos` limpo; `0 falha(s)`; `checar=0`; build gera `dist/html/options.js` e `LC_ALL=C grep -c -P '[\x80-\xff]' dist/html/options.js` imprime `0`.

- [ ] **Step 5: Commit**

```bash
cd .. && git add opcoes-pagina dist/html && git commit -m "Opcoes: remove sincronizarprocessos (base Sheets); perfis legados seguem preservados"
```

### Task 3: Pontes dos lotes e `procLote_paraLatin1`

**Files:**
- Modify: `dist/js/sei-functions-pro.js` (recebe `PROCLOTE_TROCAS` e `procLote_paraLatin1`; `initDocLoteModalSelecaoDoc` perde o fallback), `dist/js/sei-pro-all.js` (`abrirProcessosLotePro`)
- Test (scratchpad, não versionado): `provas-pontes.mjs`

**Interfaces:**
- Consumes: nada das tasks anteriores.
- Produces: `var PROCLOTE_TROCAS` e `var procLote_paraLatin1 = (texto) => string` **globais** em `sei-functions-pro.js`, idênticos ao de `sei-pro-proc-lote.js` (linhas 44-70 atuais; **não** levar `procLote_contarConvertidas`). `abrirProcessosLotePro()` sem argumentos. `initDocLoteModalSelecaoDoc(TimeOut?)` sem referência a `docLoteModalSelecaoDoc`.

- [ ] **Step 1: Prova que falha** — `provas-pontes.mjs` (Node, usa `vm`):

  (a) carrega **a função original** de `git show master:dist/js/sei-pro-proc-lote.js` (trecho `var PROCLOTE_TROCAS … };` + `var procLote_paraLatin1 = …;`) e **a nova** de `dist/js/sei-functions-pro.js` (mesmo trecho, extraído pelos mesmos marcadores) em dois contextos `vm` separados; para as entradas `["Contrato — nº 5", "“aspas” ‘simples’", "a b", "ação…", "€ 10 ™", "ÿ ok", "", null, undefined]` as saídas dos dois contextos são **iguais** e `"Contrato — nº 5"` vira `"Contrato - nº 5"`;
  (b) `abrirProcessosLotePro`: executar o corpo da função de `sei-pro-all.js` num contexto com um `document` falso: com `documentElement.hasAttribute('data-seipro-processos-lote') === true` dispara **um** `CustomEvent` de nome `spro-processos-lote-abrir`; sem o atributo chama `alertaBoxPro('Error','exclamation-triangle', <texto contendo "Processos em Lote" e "F5">)`;
  (c) `initDocLoteModalSelecaoDoc`: com o atributo `data-seipro-documentos-lote` dispara `spro-documentos-lote-abrir`; sem ele chama `alertaBoxPro` com texto contendo "Documentos em Lote" e "F5", e **não** referencia `docLoteModalSelecaoDoc` (`grep` no corpo da função).

- [ ] **Step 2: Rodar e ver falhar**

Run: `node provas-pontes.mjs`
Expected: FALHA em (a) (a função nova ainda não existe em `sei-functions-pro.js`), (b) e (c).

- [ ] **Step 3: Implementar (script Python, mantendo `\uXXXX`)**

  - Copiar para `sei-functions-pro.js` o bloco `PROCLOTE_TROCAS` + `procLote_paraLatin1` de `sei-pro-proc-lote.js` (com o comentário explicativo curto: por que a tabela vem antes do atalho de latin-1) e colocá-lo **no topo do arquivo, antes da primeira função que o chama** (o chamador em `sei-functions-pro.js` está na linha ~3424).
  - `sei-pro-all.js`: reescrever `abrirProcessosLotePro` para: se `document.documentElement.hasAttribute('data-seipro-processos-lote')` → `document.dispatchEvent(new CustomEvent('spro-processos-lote-abrir'))`; senão `alertaBoxPro('Error', 'exclamation-triangle', 'Não foi possível abrir os Processos em Lote nesta tela. Recarregue a página (F5) e tente de novo.')`. Atualizar o comentário acima da função (já não fala de "onclick antigo").
  - `initDocLoteModalSelecaoDoc`: manter só a linha do atributo/evento e, no lugar de todo o resto do corpo, o mesmo `alertaBoxPro` com "Documentos em Lote".

- [ ] **Step 4: Rodar e ver passar**

Run: `node provas-pontes.mjs && node --check dist/js/sei-functions-pro.js && node --check dist/js/sei-pro-all.js`
Expected: todas as provas `ok`; sem saída dos `--check`.

- [ ] **Step 5: Portões**

Run: `node tools/check-dom-injection.mjs 2>&1 | tail -2; node tools/escape-nonascii.mjs --check dist/js/sei-functions-pro.js dist/js/sei-pro-all.js`
Expected: `0 erro(s)`; não-ASCII sem piora.

- [ ] **Step 6: Commit**

```bash
git add dist/js && git commit -m "Pontes dos lotes viram evento ou aviso; procLote_paraLatin1 passa para o sei-functions-pro"
```

### Task 4: Remover `sei-pro-docs-lote.js` e `sei-pro-proc-lote.js`

**Files:**
- Delete: `dist/js/sei-pro-docs-lote.js`, `dist/js/sei-pro-proc-lote.js`
- Modify: `dist/js/init.js` (as duas linhas `$.getScript(...)`), `dist/manifest.json` (entradas de `web_accessible_resources` desses arquivos, se houver), e **locais** (não versionados): `tools/gerar-pacote-firefox.mjs` (`LEGADO_SUBSTITUIDO`, `SO_LAB`, texto de "fica só com as pontes"), `tools/fora-do-escopo.json` (`"dist/js/sei-pro-docs-lote.js": "*"` e `_pontesAtrasDoModulo.docLoteModalSelecaoDoc`), `tools/check-dom-injection.mjs` (`ARQUIVOS_CONVERTIDOS`)

**Interfaces:**
- Consumes: Task 3 (as pontes já não dependem desses arquivos).
- Produces: nenhum símbolo.

- [ ] **Step 1: Prova que falha**

Run: `git grep -nwE 'initProcLoteModal|docLoteModalSelecaoDoc|procLote_form|procLote_criados|procLote_abortado|procLoteModalConfig|procLote_contarConvertidas|getInitialProcUrl|getInitialProcHtml|getSerieForm|extractFormParams|createProc|extractProcId' -- dist ':!dist/js/sei-pro-proc-lote.js' ':!dist/js/sei-pro-docs-lote.js' ':!dist/js/lib' | grep -v '^dist/js/init_'`
Expected: saída **vazia** (se algo aparecer fora dos dois arquivos, tratar antes de seguir: cada ocorrência vira apagar o ramo morto, como na Task 5). Dizer na saída do passo quais símbolos foram checados.

- [ ] **Step 2: Remover**

`git rm dist/js/sei-pro-docs-lote.js dist/js/sei-pro-proc-lote.js`; apagar de `init.js` as linhas `$.getScript(getUrlExtension("js/sei-pro-docs-lote.js"));` e `$.getScript(getUrlExtension("js/sei-pro-proc-lote.js"));`; `grep -n "sei-pro-docs-lote\|sei-pro-proc-lote" dist/manifest.json` e remover as entradas que aparecerem; ajustar as ferramentas locais citadas em Files.

- [ ] **Step 3: Verificar**

Run: `git grep -nE 'sei-pro-docs-lote|sei-pro-proc-lote' -- dist '*/src' ':!*.md'` ; `node --check dist/js/init.js`; `python3 -c "import json;json.load(open('dist/manifest.json'))"`; `node tools/check-dom-injection.mjs 2>&1 | tail -1`.
Expected: sem ocorrências fora de comentário; sintaxe OK; manifest válido; `0 erro(s)`.

- [ ] **Step 4: Pacote do Firefox**

Run: `node tools/gerar-pacote-firefox.mjs 3.9.5 --oficial --sem-fora-do-escopo --saida <scratchpad>/ff 2>&1 | tail -12`
Expected: termina sem erro e com `arquivos citados ausentes: 0`; as linhas "legado retirado"/"fica só com as pontes" já não citam os dois arquivos.

- [ ] **Step 5: Commit**

```bash
git add dist && git commit -m "Remove os legados de Documentos em lote e Processos em lote (o modulo TS assume)"
```

### Task 5: Remover `sei-pro-favoritos.js` e os chamadores mortos

**Files:**
- Delete: `dist/js/sei-pro-favoritos.js`
- Modify: `dist/js/init.js` (carregador `loadFavoritosPro`), `dist/js/sei-functions-pro.js`, `dist/js/sei-pro.js`, `dist/js/sei-pro-all.js`, `dist/js/sei-pro-atividades.js`, `dist/manifest.json` (WAR, se houver), e ferramentas locais como na Task 4

**Interfaces:**
- Consumes: nada das anteriores.
- Produces: `getColorTags(mode)` em `sei-functions-pro.js` sem a chamada a `getStoreFavoritePro` (usa a lista vazia `[]` no modo não-`ativ`).

- [ ] **Step 1: Mapear os símbolos do arquivo e seus usos externos**

Run (script Python, gera `refs-fav.txt` no scratchpad): lista as definições top-level de `sei-pro-favoritos.js` (funções e `var/let/const`) com 5 ou mais caracteres e, para cada uma, as ocorrências em `dist/js/*.js` (exceto o próprio arquivo e `lib/`), `dist/html/*` e `dist/css/*`.
Expected: reproduz a lista conhecida (13 símbolos: `getStoreFavoritePro`, `setPanelFavorites`, `saveConfigFav`, `checkPageFavoritosVisualizacao`, `appendStarOnProcess`, `configDatesSetUpdate`, `checkFileRemoteFav`, `getConfigDatesFav`, `updateSelectFavorites`, `loadFavoritosPro`, `updateCountTableFav`, `restoreFavServer`) e quaisquer outros; **o que aparecer a mais entra no passo seguinte**.

- [ ] **Step 2: Remover o arquivo e o carregador**; `git rm dist/js/sei-pro-favoritos.js`; apagar a linha de `init.js` que contém `loadFavoritosPro` e o comentário acima dela; limpar `web_accessible_resources` e as ferramentas locais.

- [ ] **Step 3: Tratar cada chamador (apagar o ramo morto; sem guarda nova)**

  - `sei-pro-all.js`: função `initAppendIconFavorites` (e `setAppendIconFavorites` se for definida em outro lugar legado: conferir) e quem a chama.
  - `sei-pro.js`: `initPanelFavorites` inteira, a chamada `initPanelFavorites();` e a linha `appendStarOnProcess` (guardada por `gerenciarfavoritos`).
  - `sei-functions-pro.js`: nos blocos de Favoritos legado: `loadLocalFilePro` (o ramo que usa `setPanelFavorites`/`getStoreFavoritePro`) e demais funções de arquivo local de Favoritos que ficarem sem uso (conferir `setLocalFilePro`, `selectLocalFilesPro`), `htmlIconFavorites`, o ramo `mode == 'fav'` de `saveFollowDesc`, `keyFollowDesc` (tira `saveConfigFav`), `showFollowEtiqueta` (tira o `saveConfigFav` do `setTimeout`), o ramo `mode == 'favorites'` do `switch` perto da linha ~9099 (`parent.updateSelectFavorites…`), `configDatesPreview` e o que for só dos "config dates" de Favoritos, a chamada `updateCountTableFav()` (linha ~6423), e a linha `checkPageFavoritosVisualizacao` em `scriptVisualizacaoPro`; reescrever `getColorTags` para `[]` no modo não-`ativ` (sem `getStoreFavoritePro`) e atualizar o comentário.
  - `sei-pro-atividades.js`: os ramos `mode == 'check_favoritos'` e `mode == 'get_favoritos'` (chamam `checkFileRemoteFav` e `restoreFavServer`); o `set_favoritos` vizinho fica se só chama `loadingButtonConfirm(false)`.

- [ ] **Step 4: Varredura de órfãs (até estabilizar)**

Run (script no scratchpad `orfas.py`): para `dist/js/{sei-functions-pro,sei-pro,sei-pro-all,sei-pro-arvore,init}.js`, listar funções top-level cujo nome só aparece na própria definição (considerando ocorrências em strings, `data-spro-click`, `onclick`, `dist/html`, `dist/css` e nos bundles `init_*.js`); filtrar por `/fav|favorit|monitor|etiqueta|configDates|colortag|LocalFile|selectdoc/i`; remover as que forem de fato órfãs de Favoritos e **repetir** até a lista filtrada vir vazia. Funções com nome genérico ficam (decisão por ler o corpo).
Expected: a lista filtrada termina vazia; cada função removida na varredura foi lida antes.

- [ ] **Step 5: Verificar**

Run: `git grep -nwE 'getStoreFavoritePro|setPanelFavorites|saveConfigFav|checkPageFavoritosVisualizacao|appendStarOnProcess|configDatesSetUpdate|checkFileRemoteFav|getConfigDatesFav|updateSelectFavorites|loadFavoritosPro|updateCountTableFav|restoreFavServer|htmlIconFavorites|initAppendIconFavorites|initPanelFavorites' -- dist '*/src' ':!dist/js/lib' ':!*.md'`; `node --check` nos editados; `node tools/check-dom-injection.mjs | tail -2`; `node tools/conferir-modos.mjs dist/js/sei-functions-pro.js master | tail -2`; `node tools/escape-nonascii.mjs --check` nos editados.
Expected: busca vazia (ou só comentário); `0 erro(s)` (ajustar `REDUCOES_ESPERADAS` com motivo se `append` cair); `0 divergencia(s)`; não-ASCII sem piora.

- [ ] **Step 6: Suítes dos módulos TS que convivem**

Run: `for d in favoritos projetos processos-lote documentos-lote acoes-lote comparador-documentos opcoes-pagina sei-comum; do (cd $d && npm run verificar 2>&1 | tail -1); done`
Expected: `0 falha(s)` em todas.

- [ ] **Step 7: Commit**

```bash
git add dist && git commit -m "Remove o legado de Favoritos e os chamadores que ficaram mortos"
```

### Task 6: Documentação e histórico

**Files:**
- Delete: `pages/BASEDADOS.md`, `pages/SEISHEETS.md`
- Modify: `pages/PROJETOS.md` (seção "Ferramenta antiga (descontinuada)" e links), `pages/PROJETOSIMPORT.md`, `pages/PROJETOSSHARE.md` (links para as páginas removidas), `_data/icones.yml` e `_includes/icones.svg` (só se o ícone for exclusivo delas), `pages/HISTORICO.md`, `docs/mapa-do-legado.md`, `processo/README.md`

**Interfaces:** nenhuma.

- [ ] **Step 1: Achar todos os links para as páginas removidas**

Run: `git grep -nE 'BASEDADOS|SEISHEETS' -- . ':!docs/superpowers'`
Expected: lista dos arquivos acima (e outros, se houver). Cada ocorrência é removida ou reescrita; a seção de PROJETOS.md sobre a ferramenta antiga vira uma frase "Esta ferramenta foi descontinuada e removida na versão 3.9.5".

- [ ] **Step 2: Apagar as páginas e ajustar os links**; conferir que nenhuma página restante aponta para as removidas (`git grep` do Step 1 sem resultado, exceto o histórico).

- [ ] **Step 3: `pages/HISTORICO.md`**, em "Versão 3.9.5 / Em preparação": dois itens "Removido": (a) a ferramenta antiga de Projetos com Google Spreadsheets e as funções de Formulários e Sincronizar processos que dependiam dela (já estavam descontinuadas, a API do Google foi desativada); o botão "Conectar Base de Dados" da barra do SEI também sai; (b) código antigo de Favoritos, Processos em lote e Documentos em lote que só servia de reserva, já que os módulos novos assumem.

- [ ] **Step 4: Atualizar `docs/mapa-do-legado.md`**: tirar a seção 3 (resíduos) e o item de Sheets de 2.10 (mantendo o Atividades), atualizar tamanhos e a ordem sugerida; **`processo/README.md`**: remover as linhas dos consumidores que não existem mais (Favoritos legado, `getNewDocCompareDocs`, `sei-pro-docs-lote.js`).

- [ ] **Step 5: Commit**

```bash
git add -A pages _data _includes docs processo && git commit -m "Docs: remove paginas do Google Sheets e atualiza historico, mapa e README do processo"
```

### Task 7: Validação ao vivo e fechamento

**Files:** nenhum (validação); registrar o resultado em `docs/mapa-do-legado.md` só se algo mudar o mapa.

**Interfaces:** nenhuma.

- [ ] **Step 1: Suíte e portões finais**

Run: `for d in opcoes-pagina favoritos projetos processos-lote documentos-lote acoes-lote comparador-documentos sei-comum sei-nucleo; do (cd $d && npm run tipos >/dev/null 2>&1; echo "$d tipos=$?"; npm run verificar 2>&1 | tail -1); done; node tools/check-dom-injection.mjs | tail -1`
Expected: `tipos=0` e `0 falha(s)` em todos; `0 erro(s)`.

- [ ] **Step 2: Chrome de teste, SEI SP (SEI 4)**

Carregar a extensão do `dist/` (receita da sessão: `Extensions.uninstall` + `Extensions.loadUnpacked` no CDP do navegador; login `pedro.soares`, órgão `GESP-TREINAMENTO`). Capturar `Log.entryAdded` (nível error) e `Runtime.exceptionThrown` ao: abrir a home (Controle de Processos), abrir o processo `99906.713-630.000032/2025-82`, abrir um documento, abrir o editor de um despacho. Depois: menu **Processos em lote** abre o modal TS; botão **Documentos em lote** da barra abre o modal TS; estrela de Favoritos do módulo TS adiciona um processo; abrir o comparador e comparar dois documentos; no **Gerenciador de opções** salvar sem erro.
Expected: nenhum `ReferenceError`/exceção nova (aceita-se o ruído de CSP "Executing inline event handler" já documentado); os modais abrem; salvar opções funciona.

- [ ] **Step 3: Regressão do `procLote_paraLatin1` ao vivo (SEI SP)**

Em um processo de teste, aplicar um marcador com texto contendo "—" e “aspas” (pela tela de marcador do SEI Pro) e conferir que o texto gravado tem "-" e `"` (não `%u2014` e não vazio).
Expected: texto convertido, não apagado.

- [ ] **Step 4: SEI ANTAQ (SEI 5)**: repetir o Step 2 (somente leitura; sem salvar marcador, sem criar documento) no Chrome da porta 9444 com o login Microsoft feito pelo Pedro.
Expected: sem exceção nova; menus de lote abrem.

- [ ] **Step 5: Fechar** — rodar a revisão final do ramo (`requesting-code-review`) e, depois dela, `finishing-a-development-branch`. Não publicar nada.
