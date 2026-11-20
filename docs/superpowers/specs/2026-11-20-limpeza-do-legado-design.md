# Limpeza do legado: resíduos de módulos já refatorados e Google

Data: 2026-11-20. Status: aguardando aprovação. Base: `docs/mapa-do-legado.md`.

## Intenção

Tirar do `dist/js/` o código que não faz mais nada ou que só existe por causa de um módulo já refatorado, para que as próximas refatorações (Editor, Árvore, home, Prescrições) partam de um legado menor e sem referências mortas.

## Decisões já tomadas pelo Pedro

1. **Google, tudo**: a base Google Sheets (Projetos antigo, Formulários, Sincronizar processos) **e** o login Google (`gapi.auth2`) saem agora.
2. **Consequência aceita**: o **Atividades** (modo servidor, `sei-pro-atividades.js`) perde o login e fica sem conseguir entrar no servidor até haver decisão sobre ele. Ele não é tocado além do necessário para falhar de forma limpa.
3. **Resíduos de módulos refatorados**: saem `sei-pro-favoritos.js`, `sei-pro-proc-lote.js` e `sei-pro-docs-lote.js`. Premissa dita pelo Pedro: todo pacote distribuído (Chrome oficial, Firefox, marcas) já inclui os módulos TS de Favoritos e de Processos em lote.
4. `sei-pro-projetos.js` **fica**: ainda carrega com servidor do Atividades configurado.

## Metas

- Nenhuma referência a símbolo removido que possa lançar erro: cada uso externo é apagado (ramo morto) ou fica sob guarda explícita.
- Nenhuma regressão de comportamento nos módulos TS (Favoritos, Projetos, Processos e Documentos em lote, Ações em lote) nem no que usava o legado como apoio.
- Documentação e histórico dizem a verdade: páginas de Sheets saem, o histórico informa o que foi removido e que o Atividades ficou sem login.

## Não-metas

- Descontinuar ou refatorar o Atividades; remover `sei-pro-projetos.js`.
- Mexer em `sei-functions-pro.js`, `sei-pro.js`, `sei-pro-arvore.js` além de remover o que aponta para o removido.
- Publicar release ou mudar a versão do manifest.

## Antimetas (falha mesmo que "funcione")

- Funcionalidade TS que passa a quebrar porque dependia, sem se saber, de uma função do arquivo apagado.
- Perda silenciosa de dados do usuário (perfis com `CLIENT_ID`/`API_KEY`/`spreadsheetId` guardados).
- Texto que perde travessão e aspas curvas (ver "Achado" abaixo).

## Achado que muda o desenho

`procLote_paraLatin1` e `PROCLOTE_TROCAS` (tabela de equivalentes ASCII para travessão, aspas curvas etc.) estão em `sei-pro-proc-lote.js` e são usados por três chamadores legados: `sei-pro.js:2677` (texto do marcador), `sei-functions-pro.js:3424` (texto do marcador) e `sei-pro-arvore.js:1477` (nome do documento enviado por arrastar). Todos têm `typeof ... === 'function' ? ... : descarta o que passa de 255`. **Sem a função, o fallback apaga esses caracteres.** Então a tabela precisa ser **mudada de lugar** (para um arquivo legado que continue carregando, mantendo o nome global), e não apagada com o arquivo.

## Inventário

### A. Resíduos de módulos refatorados

Carregadores e declarações a remover:

- `init.js:49` (`sei-pro-docs-lote.js`), `init.js:50` (`sei-pro-proc-lote.js`), `init.js:486` (`sei-pro-favoritos.js`).
- Entradas `web_accessible_resources` desses arquivos em `dist/manifest.json` (os manifests de marca são ignorados pelo git e defasados).
- Ferramentas locais (em `tools/`, ignoradas pelo git, então só se corrigem na máquina do Pedro): `LEGADO_SUBSTITUIDO` e `SO_LAB` em `gerar-pacote-firefox.mjs`, a entrada `"dist/js/sei-pro-docs-lote.js": "*"` e `_pontesAtrasDoModulo` em `fora-do-escopo.json`, `ARQUIVOS_CONVERTIDOS` em `check-dom-injection.mjs`.

Referências externas a símbolos desses arquivos (levantadas por busca; cada uma vira "apagar o ramo morto" ou "guarda"):

| Símbolo | Usado em | Tratamento previsto |
|---|---|---|
| `procLote_paraLatin1` | `sei-pro.js:2677`, `sei-functions-pro.js:3424`, `sei-pro-arvore.js:1477` | Mover a função e a tabela para o legado que fica; nome global igual |
| `initProcLoteModal` | `sei-pro-all.js:163` (guardado por `typeof`) | Remover a chamada |
| `docLoteModalSelecaoDoc` | `sei-functions-pro.js:13293` | Verificar guarda; remover |
| `getStoreFavoritePro` | `sei-pro-all.js:467`, `sei-pro.js:1347`, `sei-functions-pro.js:1890,1897,6509` | Remover os blocos de Favoritos legado que o chamam |
| `setPanelFavorites`, `appendStarOnProcess` | `sei-pro.js:989,1346-1350`, `sei-functions-pro.js:1886` | Remover |
| `saveConfigFav`, `configDatesSetUpdate`, `getConfigDatesFav`, `updateCountTableFav`, `updateSelectFavorites`, `checkPageFavoritosVisualizacao` | `sei-functions-pro.js` (vários) | Remover os blocos |
| `checkFileRemoteFav`, `restoreFavServer` | `sei-pro-atividades.js:250,255` | Remover a chamada (Atividades segue sem login mesmo) |
| `loadFavoritosPro` | `init.js:486` | Sai com o carregador |

### B. Google

Pegadas conhecidas (a lista final sai de `grep` no plano):

- `init.js`: `loadDataBaseSheetsFormulariosPro`, `loadDataBaseSheetsProcessosPro`, bloco comentado de Projetos, `setSessionGoogle`, chamadas nas linhas ~211-221 e funções ~273-330.
- `sei-pro.js`: `handleClientLoadPro` (linhas ~32-48), `checkLoadConfigSheets` (~1360) e quem as chama.
- `sei-functions-pro.js`: `initClientPro`, `onSignInPro`, `updateSigninStatusPro`, `handleSignoutClickPro` (~7660-7730), comentários `spreadsheetId*`.
- `sei-pro-atividades.js`: uso de `gapi.auth2` (~26521-26543, ~26740): **só o mínimo** para não lançar exceção sem `gapi`; o Atividades fica sem login.
- Dados e telas: `init_db.js` (`spreadsheetId`, bundle gerado), `opcoes-pagina/src/perfis.ts` (`CLIENT_ID`, `API_KEY`, `spreadsheetId`), `opcoes-pagina/src/schema-dados.ts:784` (`sincronizarprocessos`), a opção `gerenciarformularios` e `dist/html/options.js` (bundle).
- Documentação: `pages/BASEDADOS.md`, `pages/SEISHEETS.md` e os links para elas em `pages/PROJETOS.md`, `PROJETOSIMPORT.md`, `PROJETOSSHARE.md`, `_data/icones.yml`/`_includes/icones.svg` se o ícone for só delas.

## Abordagens

1. **Uma branch, três etapas verificadas e commitadas em separado** (Google; resíduos; documentação e histórico), cada etapa com sua suíte e conferência de referências. Escolhida: o Google e os resíduos tocam os mesmos arquivos (`init.js`, `sei-functions-pro.js`), e etapas pequenas deixam reverter uma sem a outra.
2. Uma branch por arquivo removido: mais granular, mas obriga a reconciliar conflitos nos mesmos arquivos e repetir a validação ao vivo várias vezes. Descartada.
3. Só marcar como obsoleto e adiar a remoção: não resolve o objetivo (legado menor).

## Como se prova que está certo

- **Referências**: depois de cada etapa, a busca por cada símbolo removido em `dist/js`, `dist/html` e `*/src` não acha uso fora de comentário.
- **Sintaxe e portões**: `node --check` nos arquivos editados, `tools/check-dom-injection.mjs`, `tools/conferir-modos.mjs`, `tools/escape-nonascii.mjs --check`, geração do pacote do Firefox sem "arquivos citados ausentes".
- **Suítes**: `npm run verificar` e `npm run tipos` em `opcoes-pagina`, `comparador-documentos`, `sei-comum`, e nos pacotes TS afetados (`favoritos`, `processos-lote`, `documentos-lote`, `projetos`).
- **Ao vivo (SEI SP 4 e ANTAQ 5, Chrome de teste)**: carregar o SEI sem erro de console novo; Favoritos TS (estrela, painel); Processos e Documentos em lote abrindo; marcador com texto contendo travessão e aspas curvas (regressão do `procLote_paraLatin1`); upload por arrastar com nome com aspas curvas; Projetos TS.
- **Atividades**: confirmar que abrir o SEI com servidor configurado **não lança exceção** (apenas fica sem login).

## Riscos e o que fica para o construtor

- **Atividades quebrado** é aceito, mas o histórico deve dizer isso com clareza para o usuário final.
- **Perfis com `CLIENT_ID`/`API_KEY`/`spreadsheetId` guardados**: decidir no plano se as chaves antigas são preservadas (leitura sem uso) ou apagadas ao salvar; o padrão proposto é **preservar** e só parar de oferecê-las na tela.
- **Ordem do `procLote_paraLatin1`**: em que arquivo legado fica (precisa carregar no mesmo mundo que os chamadores e antes deles).
- **Premissa do Pedro** ("todos os pacotes têm Favoritos e Processos em lote em TS") não foi verificada nos manifests de marca, que estão defasados e fora do git; a verificação possível aqui é o `dist/manifest.json` (Lab) e o gerador do Firefox.
- Nada de release: a nota entra em "3.9.5 / Em preparação".
