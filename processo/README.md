# processo

Tudo o que o SEI Pro desenha em volta da árvore de um processo, em TypeScript: painéis abaixo da árvore, menu do documento,
capa com cards, histórico de tramitação em Gantt (com comparativo, CSV e impressão), filtro da árvore, título da aba, aviso de
documentos não assinados no Enviar Processo, edição de assuntos e interessados e a pesquisa dos processos de um interessado.
Desenho: `docs/superpowers/specs/2026-10-23-processo-design.md`; plano: `docs/superpowers/plans/2026-10-24-processo.md`.

## Estado

Etapas 1 a 5 concluídas, a etapa 6 (fechamento) feita e a etapa 7 (24/10/2026: título da aba, aviso de não assinados, edição de
assuntos e interessados, processos do interessado e a pele de post-it do modal da anotação) entregue; a rodada seguinte (24/10/2026) igualou os cabeçalhos dos painéis ao rótulo nativo "Consultar Andamento" e trocou o modal da anotação pela edição no próprio painel (ver "Escala de tamanhos" e a etapa 7, item 5). Base e painéis: base e painéis, menu da árvore,
andamentos e Gantt, capa e cards, filtro da árvore. Testadas ao vivo no SEI SP de treinamento (4.1.5, CK4), com todas as opções ligadas e com perfil limpo mais só as
opções do módulo. **O SEI 5 não foi exercitado ao vivo** (sem credencial utilizável sem login manual); só há teste com árvore
sintética no formato do 5 e leitura do fonte do 5.0.0. Entrega só no `dist/manifest.json` (Lab, MV3).

## Visão geral

Dois content scripts, ambos `all_frames` e no mundo isolado, só no `dist/manifest.json` do Lab:

| Bundle | Roda em | O que faz |
| --- | --- | --- |
| `js/init_processo_arvore.js` (`src/pagina/main.ts`, `document_start`) | quadro da árvore (`acao=procedimento_visualizar`) e janela de topo do processo (só para marcar a capa) | painéis, menu do documento, Gantt (modal), filtro da árvore, ponte de dados para a capa |
| `js/init_processo_capa.js` (`src/capa/main.ts`, `document_idle`) | quadro do visualizador que traz `#divArvoreHtml` | capa com cards, copiar resumo, QR, alerta de parado |

Os dois quadros não compartilham memória: o quadro da árvore é o dono da escrita (loja do processo, cache, coleta do histórico) e
a capa só lê o cache (`chrome.storage.onChanged`) e pede por evento. A árvore do processo é SEMPRE a que o quadro já tem na tela
(`lerArvore(paginaDe(document))`): nenhum recurso do módulo busca `procedimento_visualizar`, `arvore_montar` ou
`procedimento_atribuicao_cadastrar` (que gravam "Processo recebido"); o `build.mjs` reprova esses endereços. O histórico completo
só é coletado por clique (cache de 30 min).

## Estrutura

```
processo/
  build.mjs            esbuild (IIFE, ASCII) + portões: sem innerHTML & cia, sem endereços que gravam "Processo recebido"
  estatico/processo.css  CSS do módulo (vai DENTRO do bundle e entra numa <style>; tema do SEI, nunca do sistema)
  src/
    modelo/            SEM DOM: loja do processo (fatias com estado, cache, fila), textos, tipos, constantes, lista editável
                       (assuntos/interessados), pesquisador (busca incremental) e busca de processos do interessado
    repositorio.ts     cache em chrome.storage.local
    pagina/            quadro da árvore: main, árvore, contexto, leituras, operações, opções, marca (cessão do legado), titulo
      paineis/ modais/ painéis e edições (lupa.ts: assuntos e interessados; interessado.ts: processos do interessado;
                         paineis/anotacaoEditor.ts: editor da anotação no próprio painel, sem modal)
      menuDoc/ menu vertical e ícones fixos do documento
      filtro/            filtro da árvore (modelo, DOM, barra)
      aviso/             aviso de não assinados no quadro do Enviar Processo (modelo, DOM, ligar)
    gantt/             modal do histórico: modelo, SVG, dica, comparativo, CSV/impressão, cache de 30 min
    capa/              capa e cards: dados, cards, resumo, QR próprio, parado, controle (vigia)
    ui/                casca do painel, glifos preenchidos (SVG próprio), esqueleto, erro com "Tentar de novo"
  tests/               tsx + linkedom (verificar-*.ts); fixtures reais em ../sei-nucleo/tests/fixtures
```

No núcleo (`sei-nucleo/src/dominio`): `painelProcesso.ts` (leituras e escritas dos painéis), `historico.ts` + `historicoSessao.ts`
(coleta do histórico completo com cache incremental e restauro da sessão), `passagens.ts` (passagens por unidade), e acréscimos
em `arvore.ts`/`processo.ts`. Em `sei-comum`: ícones novos em `ui/dom.ts` e `valorOpcaoLegada` exportada.

## Opções

Todas na página de opções (`opcoes-pagina/src/schema-dados.ts`, mantido à mão), gravadas em `chrome.storage.sync` (`dataValues`):

| Opção | Padrão | Efeito |
| --- | --- | --- |
| `infoarvore` | ligada | painéis abaixo da árvore (respeita também a personalização `configViewFlashPanelArvorePro`) |
| `menurapido` | ligada | menu do documento e do processo e ícones fixos (independente de `infoarvore`) |
| `filtroarvore` | ligada, só no Lab | barra de filtro acima da árvore. Decisão desta etapa: ligada porque só esconde linhas quando o usuário pede, não faz consulta nenhuma, é invisível ao SEI e vale só no pacote do Lab (testadores); quem não quiser desliga na página de opções |
| `processoparado` | 15 (dias; 0 desliga), só no Lab | destaque do card "Na unidade atual" na capa |
| `disablequery` | desligada | quando marcada, nenhuma consulta além do que a tela traz (painéis ficam com o que a árvore tem) |
| `naoassinados` | ligada (padrão do legado) | agora lida pelo módulo: o aviso de documentos não assinados no Enviar Processo (`pagina/aviso/`); desligada, nem o módulo nem o legado mostram o aviso |
| `reaberturaprogramada`, `citacaodoc`, `uploaddocsexternos`, `acoesemlote` | do legado | lidas, não definidas aqui |

O título da aba não tem opção própria (o legado também não tinha): vale sempre, menos com `disablequery` ligada (sem consulta
nenhuma, o título do SEI fica como está) e em processo sigiloso. Os filtros "Tramitados na unidade" e "De mesmo tipo" da pesquisa
do interessado são lembrados nas mesmas chaves do legado (`optionsPro`: `panelDadosArvoreInteressados_tramiteUnidade` e
`panelDadosArvoreInteressados_mesmaNatureza`).

A personalização do menu e dos painéis é a do legado (mesmas chaves do `localStorage`), para ninguém perder o que já escolheu.

## Chaves de storage

| Onde | Chave | Quem |
| --- | --- | --- |
| `chrome.storage.local` | `processo/<host\|login>/<idProcedimento>` | cache das fatias do processo (teto de 200 processos e 2 MB; entrada acima de 64 KB só em memória; sigiloso nunca grava) |
| `chrome.storage.local` | `processo-historico/<host\|login>/<idProcedimento>` | histórico completo coletado por clique (30 min; até 900 KB por entrada, 12 processos, 24 h) |
| `localStorage` do SEI | `seiProHistoricoRestauro` | pendência de restauro da paginação do histórico (10 min) |
| `localStorage` do SEI | `configViewFlashPanelArvorePro`, `optionsPro` (`panelDadosArvorePro_<tipo>`, `optionsFlashMenu_*`), `configViewFlashMenuPro`, `configViewFlashDocMenuPro`, `configViewFlashDocArvorePro` | personalização do legado, lida e (os painéis recolhidos) gravada |
| `localStorage` do SEI | `configDataRecebimentoPro` | SÓ LEITURA: data de recebimento que o legado guarda; alimenta o alerta de parado quando não há histórico |

O filtro da árvore NÃO persiste nada (o estado vive na tela; recarregar a árvore volta ao filtro limpo).

## Cessão do legado (atributos `data-seipro-processo-*`)

Cada peça do legado cede por um atributo no `<html>`, posto em `document_start` (síncrono, antes de o legado olhar), para cada
etapa poder ceder sem desligar as outras:

| Atributo | Posto em | O que o legado deixa de fazer (`dist/js/…`) |
| --- | --- | --- |
| `data-seipro-processo-paineis` | quadro da árvore | `sei-pro-arvore.js`: `setDadosProcessoArvore` (só os efeitos de que a capa legada ainda dependia), `getDadosAnotacao`, `stylePanelArvore` (sem Atribuição nem o espaço das Atividades), `setAtividadesProcesso` preenche o espaço do módulo |
| `data-seipro-processo-menu` | quadro da árvore | `sei-pro-arvore.js`: `initToolbarDocs`, `setToolbarDocs`, `getToolbarPro`, `addIconActionsArvore` (via `menuCedidoPro()`) |
| `data-seipro-processo-gantt` | quadro da árvore | `sei-functions-pro.js`: `initGanttHistoryProc` dispara `spro-processo-gantt-abrir` e sai (sem frappe-gantt nem jmespath) |
| `data-seipro-processo-capa` | janela de topo | `sei-functions-pro.js`: `setCapaProcesso` não desenha a capa antiga |
| `data-seipro-processo-titulo` | janela de topo (`acao=procedimento_trabalhar`, `document_start`) | `sei-functions-pro.js`: `updateTitlePage`, modo `processo`, não grava mais o `<title>` (o modo `editor` e o `updateUrlPage` da URL amigável seguem do legado) |
| `data-seipro-processo-aviso` | janela de topo (idem) | `sei-functions-pro.js`: `getActionsOnSendProcess` não chama mais `initCheckNaoAssinados` (o que também acaba com a coleta automática do histórico completo a cada Enviar Processo) |

O filtro da árvore não cede nada (não havia equivalente no legado) e só põe `data-spro-f-oculto` nas linhas que esconde.
Outros sinais entre peças (diagnóstico e ponte): `data-spro-capa-estado`, `data-spro-capa-coleta`, `data-spro-pm-pedido` (+ evento
`seipro-processo-menu`), `data-spro-slot="atividades"`, `data-spro-tema`.

## O que sobra no legado

O iframe oculto `#frmCheckerProcessoPro` (`initDadosProcesso`, `sei-pro.js:928`, chamado por `initSeiPro`) e a cadeia
`dadosProcessoPro` NÃO foram desligados. A etapa 7 tirou mais dois consumidores (o título da aba e o aviso de não assinados) e a
conta foi refeita função a função (`grep` em `dist/js` por `dadosProcessoPro`, `getDadosIframeProcessoPro`, `frmCheckerProcessoPro`,
24/10/2026). **Sobram consumidores; por isso a cadeia continua.** O módulo novo não depende dela (painéis, capa, título, aviso, edições
e pesquisa leem a árvore da tela, a loja e o cache), e com o módulo ativo ela só carrega o que os consumidores abaixo pedem.

Quem cria o iframe: `initDadosProcesso` (modo `processo`, sempre, a não ser com `disablequery`) e, por pedido, `getDadosIframeProcessoPro`
de Favoritos (`favorites`), do Editor (`editor`) e de Projetos (`projeto`). Consumidores que sobram (função, arquivo):

| Consumidor | Onde lê `dadosProcessoPro` | Observação |
| --- | --- | --- |
| Favoritos legado | `sei-pro-favoritos.js`: `initDadosSelectDoc`, `getDadosSelectDoc`, `updateSelectFavorites`, `updateArraySelectFavorites`, `checkDataFavoritePro`, `storeFavoritePro`, `addFavoritePro` | o Favoritos em TS (só no Lab) não precisa, mas o legado segue nos outros pacotes |
| Editor | `sei-pro-editor.js`: `arrayDadosEditor`, `replaceDadosEditor`; `sei-functions-pro.js`: `camposDinamicosProcesso`, `openCamposDinamicosForm`, `getInteressadosProcesso`, `getListaAtribuicaoProcesso`, `sumTagValue`, título do editor (`updateTitlePage`, modo `editor`) | janela do editor, outro documento: o módulo não roda lá |
| Edição legada de dados do processo | `editDadosArvorePro_`, `updateDadosArvore*` (Iframe, Mult), `updateDadosProcesso`, `formControlerAlterarProcesso`, `getSelectHipoteseLegal`, `getHipoteseLegal`, `addUrgenteProcessoPro`, `addTrancadoProcessoPro`, `getIsProcUrgente`, `getIsProcTrancado`, `confirmaDadosUrgencia` | chamada pelo menu legado, pelo Enviar Processo (remover marcador/atribuição) e pelas Ações em lote |
| URL amigável | `updateUrlPage` (opção `urlamigavel`; o título já não passa por ela) | lê o número do processo de `dadosProcessoPro.propProcesso` |
| Lista de documentos e Ações em lote | `getListDocumentosArvore`, `checkDadosIframeDocumentosPro`, `arrayDadosIframeDocumentosPro`, `getBatchActionsPro`, `fillDocumentosActionsPro`, `refreshDocumentosActionsPro`, `getDocumentosActions`, `resetDocsActions`, `openDialogDoc`, `getNewDocCompareDocs`, `setAppendIconsDocumentosActions` | `initCheckNaoAssinados`/`boxCheckNaoAssinados` (o aviso antigo) só rodam agora sem o módulo |
| Histórico legado | `mergeAllAndamentosProcesso`, `initMergeAllAndamentosProcesso`, `setHistoryProcessosPro` (opção `historicoproc`), `getDadosAndamentoPro`, `getBlocoProcessoHistorico`/`initBlocoProcessoHistorico`, `getDataRecebimentoPro` (esta alimenta o `configDataRecebimentoPro` que a capa nova lê) | o Gantt e os cards já usam o leitor do núcleo |
| Controle de processos e pesquisa | `getDadosProcedimentosControlar`, `initCheckDadosProcedimentos`, `newTabDadosProcedimentosControlar`, `breakDadosProcedimentosControlar`, `getDadosPesquisaPro` | |
| Atividades, prescrição, projetos | `sei-pro-atividades.js` (`getServersPro`, `removeTokenAcessoRevogado`), `sei-pro-prescricoes.js` (`optionSelectDocsPrescricao`, `checkListTipoPrescricaoInProcesso`), `checkTipoPrescricaoProcesso`, `sei-pro-projetos.js` (`updateSelectConcluirProjetoEtapa`), `sei-pro-docs-lote.js` | |
| Upload pela árvore | `sei-pro.js`: `iniciarUploadArvoreProcessoPro`, `loadIframeProcessUpload`, `setUploadFilesInProcess` | |
| Outros | `enableConsultasExtras`, `getLinksProcessoPro`, `getAjaxListaAtribuicao`, `setSessionProcessosPro`/`pullDadosProcessoSession`, `getToolbarPro`/`getLinksArvore`/`initPanelPrescricaoProcesso` (árvore) | |

Saíram da lista nesta etapa: o título da aba (modo `processo` de `updateTitlePage`), o aviso de não assinados do Enviar Processo
(`initCheckNaoAssinados`, que também coletava o histórico completo sozinho) e a pesquisa "processos do interessado"
(`getDadosInteressadosArvore`, que carregava `protocolo_pesquisar` no iframe oculto): esta última já estava sem chamador, porque
o painel legado de Interessados (que a chamava) cede por `data-seipro-processo-paineis`.

Também seguem do legado: o destaque de não assinados na árvore (`initDestacarNaoAssinadosPro`), a numeração e as duas linhas da
árvore, `jquery.toolbar` (as Atividades usam), Processos Relacionados (elemento nativo estilizado) e as janelas "Copiar para outro
processo", "Enviar documento externo", "Ações em lote" e "Personalizar menu".

## Limites conhecidos

- SEI 5: não exercitado ao vivo (a árvore sintética no formato do 5 e o fonte do 5.0.0 estão nos testes). Só o SEI SP 4.1.5.
- Entrega só no Lab MV3: os manifests derivados (oficial, whitelabels, Firefox) não têm o módulo, e as opções novas só aparecem no Lab.
- Filtro da árvore: pasta fechada não entra (o SEI só traz os documentos da pasta quando o usuário a abre; a barra avisa); a
  linha de um processo anexado/relacionado nunca é escondida; "Não assinados" mostra os documentos do editor da unidade do usuário
  (a unidade geradora só vem no SEI 4+; sem ela vale o documento); os chips somam (um ou outro) e a busca restringe; o estado não
  sobrevive à recarga da árvore.
- Cards e filtro contam o que a árvore tem na tela. O "Bloco interno" só aparece com o histórico completo em cache.
- Histórico completo: cada coleta muda o estado do "Consultar Andamento" na sessão do SEI (o módulo restaura); em processo com
  milhares de andamentos há dezenas de POSTs (progresso e cancelamento existem).
- Edição: o nível sigiloso não se define por aqui. Assuntos e interessados se editam (adicionar e retirar), mas não se criam contatos
  nem assuntos novos (só os que a pesquisa do SEI devolve); item acrescentado por OUTRA unidade não sai (regra da tela nativa).
  Detalhes em "Divergências e pendências" e na etapa 7.
- Modo escuro antigo (`dark-mode` no corpo, sem Estilo Avançado) não foi visto ao vivo; o `data-tema` segue o mesmo teste dos painéis.
- O primeiro processo aberto num perfil novo, com todas as opções do legado ligadas, às vezes demora até ~3 s para os painéis (a
  variação é do servidor do SEI: 0,6 a 3,1 s em 4 medições); com a sessão aquecida, 0,3 a 0,5 s.

## Como testar

```
cd processo && npm run tipos && npm run verificar && npm run build   # build = verificar + gera os dois bundles em ../dist/js
cd ../sei-nucleo && npm run tipos && npm run verificar
cd ../opcoes-pagina && npm run tipos && npm run build                # build = verificar + dist/html/options.js
```

Portões na raiz do repositório (a pasta `tools/` é ignorada pelo git: ver "Alteração necessária em `tools/`"):
`node tools/check-dom-injection.mjs` e `node tools/patch-manifests.mjs --check`.

Ao vivo (SEI SP de treinamento 4.1.5, unidade TESTE; nunca enviar, tramitar nem concluir processo): Chrome for Testing com
`puppeteer.launch({ enableExtensions: true, pipe: true, ignoreDefaultArgs: ["--disable-extensions"], args: ["--remote-debugging-port=PORTA"] })`
e `browser.installExtension("<repo>/dist")`; ligar as opções abrindo `chrome-extension://<id>/html/options.html` e gravando
`chrome.storage.sync.set({ dataValues: JSON.stringify([{ configGeral: [{ name, value }] }]) })` (perfil limpo lê TODA opção como
desligada; nunca ligar `disablequery` junto; reinstalar a extensão zera esse storage). Ao pesquisar o processo, usar sempre a
pesquisa rápida ou links assinados (URL sem `infra_hash` derruba a sessão do SEI 5). Para o teste de perfil limpo, perfil novo e só
`infoarvore`, `menurapido` e `filtroarvore` ligadas.

### Alteração necessária em `tools/` (gitignorado)

`tools/check-dom-injection.mjs` precisa conhecer os bundles novos. Em `ARQUIVOS_GERADOS`, acrescentar:

```js
  'dist/js/init_processo_arvore.js',
  'dist/js/init_processo_capa.js'
```

(Aplicado só na cópia local da worktree; no clone principal a mesma alteração deve ser feita à mão.)

## Escala de tamanhos do quadro da árvore

Variáveis em `estatico/processo.css` (valem no `<html data-seipro-processo-paineis>`, nos painéis `.spro-p-raiz` e no filtro). Medido ao vivo no SEI SP (quadro de 373 px, 24/10/2026); os modais e o menu do documento não mudam.

**Regra da harmonia (24/10/2026): o cabeçalho de cada painel é o rótulo nativo "Consultar Andamento".** O legado desenha esse rótulo como
`a.newLink` com `i.fas.fa-search.azulColor.iconDadosProcesso`; os painéis do módulo (e "Processos Relacionados", que o legado estiliza) copiam o
estilo medido, não o estilo que parecia certo:

| Variável (`processo.css`) | Valor | Origem |
| --- | --- | --- |
| `--spro-p-fonte-titulo` | 13,5 px, peso 400, `line-height` 18,9 px, `letter-spacing: normal`, mesma família (Roboto) | `a.newLink` com o módulo ativo |
| `--spro-p-cor-titulo` | claro `#666666`; escuro `#fbfbfe` | `a.newLink` (`#666`) e a regra `.seiSlim.dark-mode *` do legado |
| `--spro-p-cor-icone` | claro `#4285f4`; escuro `#0494c7` | `azulColor` e `.seiSlim.dark-mode i.azulColor` |
| `--spro-p-icone`, `--spro-p-gap-icone` | 16 px; 5 px | a lupa (`font-size: 16px`) e a margem de 5 px do ícone |
| `--spro-p-recuo` | 17,4 px | 8 (quadro) + 2,4 (padding de `#divConsultarAndamento`) + 5 (margem do link) + 5 (padding do link) = lupa em x 25,4 px; o texto sai 21 px depois (x 46,4 px) |
| `--spro-p-cor-corpo` | claro `#444b52`; escuro `#dfe2e6` | corpo um degrau abaixo do título em tamanho (`--spro-p-fonte-corpo`, 13 px) e cinza escuro, não preto |
| `--spro-p-alvo` | 26 px | botões de ação e de recolher (cinza, preenchidos, `--spro-suave`; azul só no hover) |

Os ícones são SVG PREENCHIDOS próprios (`src/ui/glifos.ts`, grade de 24, `currentColor`): sem Font Awesome, sem jQuery, mesmo peso visual dos `fas fa-*`.
Equivalências: Anotações = sticky-note, Atribuição = user-tie, Marcador = tags, Acompanhamento = eye, Bloco Interno = book, Especificação = comment-dots,
Tipo = inbox, Nível de Acesso = globe-americas / lock / user-slash (o ícone do cabeçalho troca com o nível, como no legado), Interessados = users,
Assuntos = bookmark, Observações = comment-alt; ações: lápis, lixeira, mais, exclamação (prioridade, urgência), cadeado, chevron, lupa, disquete,
checklist, calendário, fechar. No modo escuro antigo o SEI Pro pinta todo descendente de claro com `!important`; o ícone reafirma o azul com `!important`.
O ícone fica na linha de cima da caixa do texto, como no link nativo (o `a.newLink` alinha a lupa pela linha de base: o ícone sobe 2,0 px em relação ao topo do texto);
o cabeçalho é `header > .spro-p-titulo (ícone + h3) + ações + recolher`.

### Computed styles: Consultar Andamento x cabeçalhos (SEI SP, quadro de 373 px, 24/10/2026)

Alvo: diferença de 0 nos pares. `x` é a posição absoluta no quadro; `dY` é a distância entre o topo do ícone e o topo da caixa do texto. Antes: o cabeçalho tinha 650
de peso, `#1b1f24`, ícone traçado de 1,8 px em `#1f5fbf` na coluna x 12 e o texto em x 34.

| Linha | cor do texto | tamanho / peso / altura de linha | cor do ícone | ícone | ícone x | texto x | dY |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Consultar Andamento (nativo), claro | `rgb(102,102,102)` | 13,5 px / 400 / 18,9 px | `rgb(66,133,244)` | 16 x 16, glifo FA 900 | 25,4 | 46,4 | -2 |
| Cabeçalhos ANTES (todos, claro) | `rgb(27,31,36)` | 13,5 px / **650** / 18,9 px | `rgb(31,95,191)` | 16 x 16, traço | **12** | **34** | -0,05 |
| Cabeçalhos DEPOIS (11 painéis, claro) | `rgb(102,102,102)` | 13,5 px / 400 / 18,9 px | `rgb(66,133,244)` | 16 x 16, preenchido | 25,4 | 46,4 | -2 |
| Processos Relacionados ANTES (claro) | `rgb(33,37,41)` | 13,5 px / 400 / 18,9 px | `rgb(66,133,244)` | **20** x 16 | **27,4** | **52,4** | -2 |
| Processos Relacionados DEPOIS (claro) | `rgb(102,102,102)` | 13,5 px / 400 / 18,9 px | `rgb(66,133,244)` | 16 x 16 | 25,4 | 46,4 | -2 |
| Consultar Andamento (nativo), escuro | `rgb(251,251,254)` | 13,5 px / 400 / 18,9 px | `rgb(4,148,199)` | 16 x 16 | 25,4 | 46,4 | -2 |
| Cabeçalhos ANTES (escuro) | `rgb(251,251,254)` | 13,5 px / **650** / 18,9 px | **`rgb(251,251,254)`** (o `*` do legado pintava o ícone de branco) | 16 x 16 | **12** | **34** | -0,05 |
| Cabeçalhos DEPOIS (11 painéis, escuro) | `rgb(251,251,254)` | 13,5 px / 400 / 18,9 px | `rgb(4,148,199)` | 16 x 16 | 25,4 | 46,4 | -2 |

Capturas lado a lado (antes | depois): `scratchpad/live/shots/lado-a-lado-{claro,escuro}-{topo,paineis}.png` (e as originais `antes-*` / `depois-*`).

### Escala geral (24/10/2026, antes da harmonia dos cabeçalhos)

| Elemento | Antes | Depois |
| --- | --- | --- |
| "Consultar Andamento" (legado `a.newLink`) | 14,4 px, lupa 17,3 px | 13,5 px (`--spro-p-fonte-titulo`), lupa 16 px (`--spro-p-icone`) |
| "Processos Relacionados" (rótulo / itens) | 14 px, ícone 16,8 px / 14 px | 13,5 px, ícone 16 px / 13 px |
| Corpo, vazio, erro, link, status do filtro | 12 / 11,5 px | 13 px (`--spro-p-fonte-corpo`) |
| Chips, chips do filtro | 11 / 11,5 px | 12 px (`--spro-p-fonte-pequena`) |
| Botões de ação e de recolher | 22 px | 26 px (`--spro-p-alvo`) |
| Ícone dentro de chip e do nível | 11 a 13 px | 13 px (`--spro-p-icone-mini`) |
| Campo de busca do filtro / chip do filtro | 28 / 22 px | 30 / 26 px |

O legado só cede de tamanho com o módulo ativo (`html[data-seipro-processo-paineis]`); sem o módulo nada muda. A anotação segue a pele do post-it do legado
(degradê amarelo `#f9efaf` a `#f7e98d`, borda tracejada fina, sombra suave, canto dobrado), amarelo também no escuro, com texto escuro reafirmado por
`!important` porque `.seiSlim.dark-mode *` pinta todo descendente de claro. A edição é no próprio painel (etapa 7, item 5).

## Base e painéis (etapa 1)

### O que existe

- `src/modelo/`: sem DOM. `loja.ts` (`LojaProcesso`: fatias com estado, cache, fila de gravações), `texto.ts` (marcador com
  prazo, anotação com checklist e data, marcas (URGENTE)/(TRANCADO), observações, atribuição), `paineis.ts` (tipos, ordem,
  personalização do menu), `dados.ts` (o que cada fatia guarda).
- `src/repositorio.ts`: cache em `chrome.storage.local`, uma chave `processo/<host|login>/<id>` por processo, teto de 200
  processos e 2 MB, entrada acima de 64 KB só em memória, qualquer falha do storage (cota cheia) é engolida.
- `src/pagina/` (content script do quadro da árvore, `js/init_processo_arvore.js`):
  - `marca.ts`: `data-seipro-processo-paineis` no `<html>`, síncrono, só no quadro `acao=procedimento_visualizar` (não na
    janela de topo, e a árvore dentro do iframe oculto `frmCheckerProcessoPro` nem monta painéis).
  - `main.ts`, `arvore.ts` (espera a árvore por `MutationObserver` com prazo de 10 s e remonta sozinha se algo tirar os
    painéis da página), `contexto.ts` (`SeiDaPagina`: o `Sei` do núcleo devolvendo a árvore que já está na tela, em vez de
    buscá-la de novo), `leituras.ts` (quem alimenta cada fatia), `operacoes.ts` (escritas do núcleo com `aplicar: true`, na
    fila do processo), `opcoes.ts` (mesmas chaves do legado), `menuTopo.ts` (marca `urgentePro`/`trancadoPro` no menu).
  - `paineis/`: um por painel, cada um só redesenha o seu corpo na sua fatia. `modais/`: edição, em `dialog.spro-dialogo`
    aberto na janela de topo (o quadro da árvore é estreito), sem botão Cancelar.
- `src/ui/`: casca do painel (opção A: cabeçalho com ícone, ações à direita, recolher), esqueleto, erro com "Tentar de novo".
- `estatico/processo.css`: o CSS vai dentro do bundle (junto com o `base.css`) e entra numa `<style>`; o tema é o do SEI
  (Estilo Avançado ou `dark-mode` no corpo), nunca o do sistema operacional.

Painéis, na ordem do legado: Anotações (logo depois de "Consultar Andamento"), espaço das Atividades
(`[data-spro-slot="atividades"]`, antes dos Processos Relacionados, preenchido pelo legado), e no fim do formulário da
árvore: Atribuição, Bloco Interno, Marcador, Acompanhamento Especial, Especificação, Tipo, Nível de Acesso, Interessados,
Assuntos, Observações. Respeitam `configViewFlashPanelArvorePro`, `panelDadosArvorePro_<tipo>` e `infoarvore`; nenhum
depende do menu rápido.

### Edições (todas por função de escrita do núcleo, com prova de sucesso)

Atribuição (lista com busca, remover), Marcador (adicionar, trocar, texto, prazo com vencimento, remover), Acompanhamento
(grupo, texto, reabertura programada), Anotação (texto, checklist, data, prioridade, remover; marcar item e prioridade direto
no painel, lendo a anotação dentro da fila para dois cliques seguidos não se atropelarem), Especificação (editar, urgência,
trancamento só no Lab), Tipo, Nível (público ou restrito com hipótese), Observações da unidade, Interessados (retirar).

### Cessão do legado (`dist/js/sei-pro-arvore.js`)

Guardas pequenas por `data-seipro-processo-paineis`: `setDadosProcessoArvore` (só os efeitos de que a capa legada ainda
depende: cache de marcador que `getHtmlMarcador` lê, `setCapaProcesso`, cores dos marcadores, dado corporativo),
`getDadosAnotacao`, `stylePanelArvore` (não monta Atribuição nem o espaço das Atividades) e `setAtividadesProcesso`
(preenche o espaço do módulo).

O iframe oculto `#frmCheckerProcessoPro` (`initDadosProcesso`) CONTINUA: `dadosProcessoPro` ainda alimenta a capa legada
(`setCapaProcesso`: propProcesso, cache de marcador, `listAndamento`/Bloco Interno), os editores (`editDadosArvorePro_`,
`getIsProcUrgente`), a lista de documentos assinados, o título da página e as Atividades. Ele só sai quando a capa nova
(Etapa 4) e o leitor de andamentos (Etapa 3) existirem. Os painéis novos não esperam por ele.

### Bloco Interno

Só tem leitura no histórico completo. Decisão do autor: o painel só mostra o bloco quando o histórico completo está em cache
(30 min, coletado por clique); senão, apenas o link discreto "Carregar do histórico", que chama o gancho
`ctx.aoPedirHistorico` (inerte até a Etapa 3: avisa que a coleta ainda não está disponível). Quem coletar grava a fatia
`blocoInterno` (`{descricao, coletadoEm}`) e o painel redesenha sozinho.

### Resultado do teste ao vivo (Task 4, 24/10/2026, SEI SP de treinamento 4.1.5, unidade TESTE)

Chrome for Testing com a extensão carregada de `dist/`, todas as opções ligadas (menos `disablequery`) pela `options.html`.
24 processos abertos em sequência (22 já visualizados da unidade, 1 sigiloso, 1 não visualizado), pela pesquisa rápida.
Marco zero = a árvore na tela.

| Situação | Painéis | Tempo após a árvore (mediana / pior) |
| --- | --- | --- |
| Sem cache, menu rápido desligado (23 processos) | 230 de 230 "pronto", nenhum painel legado, 2 raízes por processo | Anotações 76 / 175 ms; Marcador 231 / 521 ms; Acompanhamento 362 / 514 ms; Especificação, Interessados, Assuntos, Observações 361 / 544 ms; Tipo, Nível e Atribuição na hora (da árvore, sem rede) |
| Com cache, menu rápido desligado | 230 de 230 | Primeiro conteúdo do cache no mesmo instante da árvore (0 ms); a rede confirma em até 816 ms, sem trocar o layout |
| Sem cache, menu rápido ligado (13 processos) | 130 de 130 | Igual: pior 804 ms |

Metas da spec: 300 ms com cache, 2 s por painel sem cache. Cumpridas. O processo sigiloso (pede a senha do usuário num modal
do SEI) mostrou Anotações, Atribuição, Marcador, Acompanhamento, Tipo e Nível "Sigiloso", e nenhum de Especificação,
Interessados, Assuntos, Observações ou Bloco Interno; nada dele foi para o cache (23 entradas para 24 processos).

Edições conferidas no SEI (reabrindo o processo) e desfeitas: atribuição (trocar e voltar), marcador (adicionar com prazo,
editar o texto, remover), anotação (texto, checklist, data, prioridade, remover e restaurar igual ao original), acompanhamento
em outro processo (grupo, texto, reabertura programada, restaurar), especificação (editar, urgência ligar e desligar, com a
marca no menu da árvore), observações, tipo e nível (público e de volta a restrito com a mesma hipótese). Três cliques juntos
(dois itens da checklist e a prioridade) gravaram os três. Leitura que devolve tela de erro (injetada): o painel com cache
mantém o dado e mostra "Tentar de novo"; ao tentar de novo, volta. Painéis tirados da página (simulando a árvore que se refaz) voltam sozinhos, sem duplicar, mesmo repetindo.
Nenhuma mensagem de erro do módulo no console nas rodadas de 24 processos.

### Menu da árvore (etapa 2): `src/pagina/menuDoc/`

Substitui o "menu rápido" do legado (jquery.toolbar: `initToolbarDocs`, `setToolbarDocs`, `getToolbarPro`,
`actionToolbarDocs`, `actionToolbarPro`, `updateLinksToolbar`, `callActionsArvore`) e os ícones fixos ao lado do documento
(`addIconActionsArvore`, `getActionsArvore`). Liga com a opção `menurapido`, independente de `infoarvore`.

- `catalogo.ts`: os itens do documento e do processo, com o NOME de cada um igual ao do legado (`iconsFlashDocMenu`,
  `iconsFlashMenu`, `iconsFlashDocArvore`), porque o nome é a chave da personalização (`configViewFlashMenuPro`,
  `configViewFlashDocMenuPro`, `configViewFlashDocArvorePro`, `optionsFlashMenu_menuproc/_menudoc/_iconstree`; "Ativar menu ao
  clicar" continua sendo uma entrada da lista do menu do documento). Os nomes antigos "Add/Remover Urgência" e "Ações em lote"
  valem como alias. Cada item diz de onde vem: local, endereço de ação (`acao=...`), conteúdo (`src` do nó) ou função do botão
  sem endereço (`excluirDocumento`, `cienciaDocumento`...). O catálogo só cita endereços como dado; o `build.mjs` o libera do
  portão dos endereços que gravam "Processo recebido" (nada ali busca coisa alguma).
- `acoes.ts`: `itensDoDocumento(alvo, opc)` / `itensDoProcesso(opc)` / `iconesFixosDoDocumento`. Só aparece o que a árvore
  oferece (nunca pelo rótulo). Itens locais sempre presentes (copiar número SEI, nome, link, número com link, nome com link,
  respeitando `citacaodoc`; duplicar com a pergunta "remover MINUTA"; copiar para), desativados com o motivo quando não valem
  (anexo, documento cancelado, processo fechado). Quem mexe no mundo (copiar, abrir, duplicar, perguntar) é o `Servicos`,
  trocado por falsos nos testes.
- `menu.ts`: menu vertical agrupado em Copiar, Abrir e Ações, `role=menu`, setas/Home/End/Enter/Esc/Tab, `aria-label` (sem
  `title`), foco de volta no ícone ao fechar; item "Personalizar menu" no pé. `ligar.ts`: um só ouvinte no documento da árvore
  (passar o mouse com espera de 150 ms para abrir e 300 ms para fechar; clique se "Ativar menu ao clicar" estiver na lista, e
  então o balão de cópia nativo do SEI não aparece; seta para baixo no ícone abre pelo teclado). Serve tanto o 4.1
  (`a.clipboard[id^=anchorImg][data-toggle=popover]`) quanto o 5 (`a[id^=anchorImg][data-serialtip]`): casa pelo id do nó.
- `documentos.ts`: o mapa dos documentos que o menu conhece. Os da árvore (`lerArvore`) e os das pastas abertas sob demanda: o
  SEI as carrega no `#ifrPasta` e a resposta (com os `Nos[n].acoes`) fica nos comentários do documento do iframe;
  `lerDocumentosDaPagina` (núcleo) a lê a cada `load` do iframe, sem requisição.
- `icones.ts`: ícones fixos com as mesmas classes (`action-doc action-<modo>`, `data-id`) que Favoritos e Ações em Lote
  procuram, depois do nome e das quebras de linha do "duas linhas"; mantidos por MutationObserver, idempotentes. Fora da ordem
  de Tab (`tabindex=-1`): pelo teclado, as mesmas ações estão no menu.
- `servicos.ts`: duplicar pelo núcleo (`duplicarDocumento`, com prova de sucesso; `semMinuta` tira a palavra da descrição e do
  nome da cópia) e recarga da árvore; excluir pede confirmação; o `SeiDaPagina` agora resolve o processo da tela e os
  documentos da tela (inclusive os das pastas) sem a pesquisa rápida. "Copiar para outro processo", "Enviar documento
  externo", "Ações em lote" e "Personalizar menu" continuam do legado/outros módulos: o módulo grava o pedido em
  `data-spro-pm-pedido` no `<html>` e dispara o evento `seipro-processo-menu`; um ouvinte pequeno em `sei-pro-arvore.js` (mundo da
  página, registrado uma vez) lê, apaga e chama a função. Se ninguém apagar o pedido, o menu avisa que a função ainda carrega.
- Núcleo: `DocumentoArvore.funcoes` e `Arvore.funcoesProcesso` (nomes das funções dos botões sem endereço, opcionais),
  `lerDocumentosDaPagina`, `tirarMinuta` e a opção `semMinuta` de `duplicarDocumento`.

Cessão do legado (`dist/js/sei-pro-arvore.js`): `data-seipro-processo-menu` no `<html>` (síncrono, `marcarMenu`, só no quadro da
árvore). Guardas pequenas em `initToolbarDocs`, `setToolbarDocs`, `getToolbarPro` e `addIconActionsArvore` (via
`menuCedidoPro()`). Como `selectedItensPanelArvore` era preenchida só dentro do `setToolbarDocs` e o `initStylePanelArvore`
espera por ela, a leitura virou `loadSelectedItensPanelArvorePro()`, chamada pela guarda e pelo próprio `initStylePanelArvore`:
o estilo do que o legado ainda desenha (Processos Relacionados) agora não depende do menu rápido, ligado, cedido ou desligado.
`getTooltipOnSign` segue rodando. `jquery.toolbar` continua carregado (as Atividades usam o `.toolbar_control`).

### Resultado do teste ao vivo (Task 6, 24/10/2026, SEI SP de treinamento 4.1.5, unidade TESTE)

Processo de teste 99906.713-630.000032/2025-82 (62 documentos), opções todas ligadas menos `disablequery`, personalização
com TODOS os itens. Capturas em `scratchpad/live/shots/menu-*.png`.

| Documento | Itens do SEI oferecidos (além dos 5 de copiar, duplicar e copiar para) |
| --- | --- |
| interno não assinado (0103947) | visualizar em nova aba, baixar, consultar, versões, incluir em bloco, assinatura externa, favoritos, assinar, excluir (editar só em documento que o SEI libera, como o recém-duplicado) |
| externo PDF (0103949) | visualizar, baixar, consultar, cancelar, favoritos, ciência, e-mail, mover; duplicar e copiar para desativados ("só documento do SEI") |
| assinado (0094793, 0094776) | + cancelar, ciência, e-mail; sem excluir nem editar |
| cancelado (0104044) | o SEI não oferece nada (sem ações nem conteúdo): só os de copiar; duplicar e copiar para desativados ("cancelado") |
| zip, vídeo movido, processo anexado | zip: como o externo; movido: copiar número e nome; anexado (sem número SEI): o menu nem abre |

Itens executados com o mouse de verdade: copiar número, nome, link, número com link e nome com link (conferidos na área de
transferência, inclusive o `text/html`); visualizar em nova aba (interno e anexo); baixar (o download começa com o arquivo e o
tamanho certos; neste Chrome de teste nem um download de blob termina, então o fim não foi gravado); consultar, versões,
incluir em bloco (sem confirmar), assinatura externa, favoritos, cancelar (sem confirmar) e mover (sem confirmar) abrem no quadro
interno do visualizador mantendo a barra de botões; assinar e e-mail abrem em nova aba; editar abre o `editor_montar` em nova aba;
copiar para outro processo abre a janela do legado; excluir pergunta, "Voltar" não faz nada, "Excluir" pede o endereço da exclusão
(requisição abortada de propósito nos documentos reais); ciência (abortada de propósito). Duplicar: o documento 0103947 foi
duplicado 4 vezes no mesmo processo (0105189 a 0105192), a árvore recarregou a cada vez, e cada duplicado foi excluído pelo
próprio menu ("Excluir"): o processo voltou aos 62 documentos. A pergunta "remover MINUTA" aparece quando o nome do nó tem
MINUTA (testado trocando o texto do nó na tela) e fechar pelo Esc não duplica.
Menu do processo: copiar número, só o número e link; enviar documento externo (a zona de soltar do legado abre); ações em lote
(abre o modal do módulo); personalizar menu (a janela do legado); urgência liga e desliga (a especificação ganha e perde
"(URGENTE)" e a marca do menu da árvore acompanha); atribuir, anotações, marcador, acompanhamento especial, consultar/alterar,
incluir documento e gerar PDF abrem no visualizador; incluir em bloco (processo) clica o botão nativo da barra e abre o "Selecionar
Bloco"; ciência e concluir pelo endereço certo (abortados de propósito).
Modo clique: passar o mouse não abre, o clique abre e o balão nativo não aparece, o segundo clique fecha. Teclado: Enter no ícone
(modo clique) ou seta para baixo (modo hover) abre com o foco no primeiro item; setas, End, Enter e Esc funcionam, e o Esc devolve
o foco ao ícone.
Rede: 0 requisições `arvore_visualizar` ao passar o mouse em 8 tipos de nó (e nenhuma nas pastas abertas sob demanda). Menu rápido
ligado, desligado, só-menu (painéis desligados) e tudo desligado: sem erro de console, painéis novos (10) intactos, sem barra do
jquery.toolbar, `selectedItensPanelArvore` preenchida enquanto houver painel, ícones fixos só com o menu ligado.

### Divergências e pendências do menu

- Cinco itens do documento não têm endereço na árvore (`excluirDocumento`, `cienciaDocumento`, `assinarDocumento`,
  `editarConteudo`, `enviarEmailDocumento`) e três do processo (`cienciaProcesso`, `reabrirProcesso`, `enviarEmailProcedimento`):
  o endereço está na tela do nó (`var linkX` da `arvore_visualizar`). Por isso, SÓ quando o usuário escolhe um deles, há UM GET
  da tela do nó. Ao passar o mouse não há requisição nenhuma. "Incluir em bloco" do processo clica o botão nativo (precisa do
  processo aberto no visualizador; senão o menu orienta a clicar no número).
- "Editar documento" não aparece em documento assinado (o SEI pergunta antes de perder a assinatura; essa pergunta fica com o
  botão da barra). "Reabrir processo" e "Ciência" executam na hora, como o botão nativo.
- Itens locais respeitam a personalização: sem personalizar valem os 5 padrões do legado (e, no processo, a urgência, que o
  legado perdia por usar o `alt` como nome). "Sempre presentes" quer dizer que não dependem do SEI oferecer.
- "Imprimir Web", "Gerar circular" e "Intimação eletrônica" não são oferecidos ao perfil do SP de treinamento; só foram
  provados por teste com a barra sintética. O SEI 5 não foi exercitado ao vivo (sem acesso nesta rodada): a ancora do 5
  (`data-serialtip`) e a árvore sintética saem do fonte do 5.0.0 (`arvore_montar.js`, `ProtocoloINT.php`) e estão nos testes; não há
  captura real de árvore do 5 nas fixtures.
- Modo escuro: coberto por teste (`data-tema`), mas o modo noturno antigo não pintou a página neste perfil e o Estilo Avançado
  não foi ligado, então não há captura ao vivo do menu no escuro. Processo sigiloso: não exercitado (pede senha).
- O ícone de "Duplicar documento" do menu e o de "Copiar número SEI" são parecidos (dois quadrados); "Copiar para outro processo"
  e "Enviar documento externo" dependem do legado.

### Divergências e pendências

- Assuntos e interessados: a edição (adicionar e retirar) e a pesquisa dos processos do interessado entraram na etapa 7 (abaixo).
- Nível: define público e restrito; o sigiloso não se define por aqui (o núcleo não opera processo sigiloso, então no
  sigiloso nenhuma edição aparece).
- Processos Relacionados continua o elemento nativo estilizado pelo legado (`stylePanelArvore`).
- Marcador: a lista de escolha ainda não mostra o ícone de cada marcador.
- Bloco Interno: depende da Etapa 3 (coleta do histórico).
- A capa legada só atualiza a especificação, o nível e o marcador depois de uma edição na próxima carga (o `dadosProcessoPro`
  dela vem do iframe oculto); a capa nova (Etapa 4) lê a mesma loja.
- Só o SEI SP (4.1.5) foi exercitado ao vivo; o MJ 5.0.4 ainda não.

## Leitor de andamentos e passagens (etapa 3, Task 7, `sei-nucleo`)

### Medição: a coleta do histórico completo deixa o "Consultar Andamento" nativo trocado? SIM, restaurar é necessário

O README do núcleo dizia que restaurar era desnecessário; o legado dizia que era necessário. Medido ao vivo (24/10/2026, SEI SP
de treinamento 4.1.5, unidade TESTE, processo 99906.713-630.000047/2023-89, 50 andamentos resumidos, 150 no completo, 2 páginas),
com o fluxo do próprio núcleo (`andamentosDoLink` completo, que não restaurava):

| Momento | O que o Consultar Andamento nativo mostra |
| --- | --- |
| Antes da coleta | `R`, página 0: "Lista de Andamentos (50 registros)" |
| Depois da coleta (aba nova, e a aba antiga recarregada) | `P`, página 1: "150 registros - 101 a 150", só os 50 mais antigos, com o link "página anterior" |

O estado (tipo `hdnTipoHistorico` e página `hdnInfraPaginaAtual` do último POST) fica na SESSÃO do SEI: vale para todas as abas
e para qualquer processo (outro processo aberto depois também sai no tipo completo). Não saiu vazio nesta medição (isso
acontecia quando a coleta parava numa página além da última); saiu trocado e paginado, que é o que o antiobjetivo da spec
proíbe. A página só é lembrada quando o hash dos critérios bate (um POST com tipo trocado e o hash do formulário antigo volta à
página 0), por isso o percurso usa sempre o formulário da resposta anterior.

Decisão: RESTAURAR, em `src/dominio/historico.ts` + `src/dominio/historicoSessao.ts` do núcleo, e não só no coletor, porque
`andamentos(... tipo: "completo"|"total")` (Ações em Lote, cancelar assinatura, agente) tinha o mesmo defeito:

- o percurso lê o tipo e a página da sessão no GET inicial e, depois do último POST, reenvia o formulário ORIGINAL com esse
  estado (sem o sinal de cancelamento: devolver a sessão não se cancela); sem POST quando a sessão já está no tipo e na página
  pedidos e a primeira tela basta (histórico resumido comum: um GET, sem exclusão);
- só um percurso por vez em toda a origem (`navigator.locks`, que o navegador solta se a aba morre; sem ele, fila no contexto),
  porque o "estado original" de uma segunda coleta seria o que a primeira deixou no meio;
- pendência de restauro em `localStorage` (gravada antes do 1º POST, apagada depois do restauro, vale 10 min, por host): se a
  aba morrer no meio, a próxima coleta devolve o estado de antes antes de ler o seu "original" (equivale às "coletas
  interrompidas" do legado, sem os registros por token);
- cancelar a última chamada interessada só solta o chamador depois que a sessão voltou ao estado de antes.

Validado ao vivo (nucleo empacotado, aba SEI):

| Cenário | Resultado |
| --- | --- |
| Coleta completa (150 andamentos, 2 páginas, 1,1 s) e abrir o nativo depois | `R`/0, "50 registros" (igual ao antes); pedidos: GET, GET, POST P/0, POST P/1, POST R/0 |
| Segunda coleta com o cache (hash + total) | só a 1ª página: GET, GET, POST P/0, POST R/0; resultado idêntico; cache sem o andamento mais recente: junta o novo sem a 2ª página; cache adulterado: coleta tudo |
| Duas chamadas simultâneas | uma coleta (mesmo resultado, 5 pedidos) |
| Cancelar depois da 1ª página | `CANCELADO` e sessão em `R`/0 |
| Duas "abas" (dois contextos JS da mesma origem) coletando juntas | a segunda espera a primeira (A termina em 1,1 s, B em 2,2 s); estado final `R`/0 |
| Usuário em `T`/0 (histórico total) ou em `P`/1 (2ª página do completo) quando a coleta roda | a coleta devolve `T`/0 e `P`/1 |
| Pendência (aba que morreu no meio, sessão deixada em `P`) | a coleta seguinte devolve `R`/0 |
| `andamentosDoLink` resumido com a sessão em `R`/0 | um GET, nenhum POST |
| `andamentosDoLink` resumido com a sessão em `P`/1 | lê o resumido e devolve `P`/1 |

Não foi exercitado: o mesmo no SEI 5.0.4 (sem acesso nesta rodada; o formulário `#frmProcedimentoHistorico` e o fonte
`procedimento_historico.php` do 5.0.0 são os mesmos que as fixtures do 4.1.5 mostram).

### O que existe

- `Andamento` ganhou `dataISO` (`aaaa-mm-ddThh:mm:00`, o relógio do SEI sem fuso), `usuarioNome`, `nrSei` e `idDocumento` (do
  `a.ancoraHistoricoProcesso`; o link de um documento excluído não traz `id_documento`), `unidadeCitada`/`unidadeCitadaNome`
  (em "Processo remetido pela unidade X": a unidade X) e `aberto` (linha `andamentoAberto`). Todos opcionais; os consumidores
  atuais (grade do controle, agente, ações em lote) não mudam.
- `coletarHistorico(sei, link, {sinal, aoProgresso, cache, limite})` e `coletarHistoricoDaArvore` (recusa sigiloso):
  histórico completo (`P`), cache incremental (`hdnInfraHashCriterios` + total; confere os 10 mais recentes por
  `dataISO|unidade|usuario|descricao`), progresso em páginas ("1/2", "7/34"), uma coleta por vez por processo (quem chega durante
  ela recebe o mesmo resultado e o progresso já andado; só cancela quando todos desistem). O cache de 30 minutos (spec 8.2) fica
  com quem chama: `CacheHistorico = {hash, total, andamentos}` vem de `HistoricoColetado`.
- `calcularPassagens(andamentos, agora)`: ver abaixo. Rótulos do SEI numa tabela única, `ROTULOS` (acentos em `\uXXXX`).

### Passagens (spec 5.6): como o SEI escreve o histórico e o que isso muda

Conferido em processos reais: a linha "Processo remetido pela unidade S" fica na unidade DESTINO (coluna Unidade) e cita S (no
texto e no `title` do link); o usuário da linha é quem enviou. Daí: a passagem de S termina na primeira linha que cita S depois
da entrada, e os destinos são as unidades dessas linhas.

- Começa em "recebido", "Processo ... gerado" ou "Reabertura"; termina na primeira remessa que cita a unidade ou na "Conclusão";
  sem fim, em curso. Reabertura vira nova passagem. A mesma unidade nunca tem duas ao mesmo tempo.
- Remessa para várias unidades: linhas do mesmo envio com até 2 minutos entre si (o envio cruza a virada do minuto: medido, 15:39
  e 15:40) entram nos destinos da mesma passagem.
- Identidade da unidade: o histórico NÃO traz o id. O nome (`title`) não identifica: "Chefia de Gabinete" é o nome de cinco
  unidades de órgãos diferentes, e a sigla SSP-CG aparece com dois nomes ao longo do histórico (provavelmente renomeada). Então:
  a sigla identifica; o nome só desempata quando a mesma sigla tem duas passagens abertas ao mesmo tempo (a remessa que cita
  "GAB" fecha o "GAB" do nome citado) e só nesse caso separa as raias (`chave` = `sigla|nome`).
- Mesmo minuto: não basta a posição na lista. O SEI grava o "recebido" da unidade DEPOIS (id maior) da remessa que ela mesma faz
  no mesmo minuto (medido: DETRAN-VICEPRE), e a remessa que traz o processo precisa estar registrada antes de a unidade
  recebê-lo. Cada minuto vale em três fases: chegadas (as remessas), "recebido", e o resto na ordem da lista (geração, reabertura,
  conclusão, remessa que fecha). Conclusão e reabertura no mesmo minuto ficam na ordem da lista (duas passagens).
- Sem fuso: o horário é o relógio do servidor do SEI. As datas das passagens são esse relógio escrito como UTC (`relogioDoISO`),
  então a duração é a diferença do relógio, sem horário de verão nem o fuso do computador (testado em 4 fusos, com a virada do
  horário de verão de 2018). `agora` é um instante real (`new Date()`), convertido pelos campos locais (`relogioDe`).
- Documentos: "Gerado documento" e "Assinado Documento" (`documentos`, `assinaturas`: `nrSei`, `idDocumento`, `em`, `titulo`)
  vão para a passagem da unidade cujo intervalo os contém; se nenhuma contém (a unidade seguiu trabalhando depois de remeter), para
  a mais recente que já havia começado. Assinatura de unidade que nunca teve o processo (assinou de fora) não entra em passagem.
- Quem recebeu e quem enviou: `usuarioRecebeu`/`usuarioEnviou` (login) e `...Nome`, `origem` (sigla da unidade que enviou), `chegouEm`
  (quando a remessa foi registrada, antes do "recebido") e `destinos`.

Divergências do legado (`getGanttHistoryProc`):

1. Remetido a uma unidade que ainda não abriu o processo (nenhum "recebido"): vira passagem em curso com `pendenteRecebimento`.
   O legado ignorava; mas é onde o processo está, e o SEI a pinta de amarelo.
2. Remessa "mantendo o processo aberto na unidade": o histórico não distingue pelo texto, mas o SEI marca a linha da unidade como
   `andamentoAberto` (fonte do SEI: `sin_ultima_unidade_historico`). Se a passagem foi fechada por remessa e a unidade ainda
   tem a linha amarela, ela segue em curso (`mantidoAberto`, `remetido` nulo, `enviouEm` com a data da remessa). Sem a marca
   (tela sem a classe), vale a regra da spec.
3. Pareamento por sigla com desempate por nome, em vez de só pela sigla ou só pelo nome.

### Validação ao vivo de `calcularPassagens` contra a tela do Consultar Andamento (4 processos reais, SEI SP, 24/10/2026)

Para cada processo: a coleta do módulo (`coletarHistorico`), o cálculo, e em seguida o Consultar Andamento nativo aberto numa
aba, passado ao histórico completo pelo link da própria tela, página a página (clicando em "próxima"), e de volta ao resumido, lendo
as linhas e a classe de cada `tr`. Conferido: (a) as linhas coletadas são exatamente as da tela, na mesma ordem; (b) cada
passagem tem a linha de entrada na tela; o fim bate com a primeira remessa que cita a unidade (ou a conclusão); os destinos são as
unidades das linhas do mesmo envio; (c) os totais de documentos gerados e assinados batem com as linhas "Gerado documento" e
"Assinado Documento" das unidades que tiveram passagem; (d) as unidades "em curso" são EXATAMENTE as que o próprio SEI pinta de
amarelo (`andamentoAberto`). E o Consultar Andamento nativo reaberto depois voltou ao que mostrava antes, em todos.

| Processo | Andamentos | Passagens | Em curso (SEI amarelo = módulo) | Resultado |
| --- | --- | --- | --- | --- |
| 99906.713-630.000047/2023-89 | 150 (2 páginas) | 20 (2 pendentes de recebimento) | 4 = 4 | tudo confere |
| 026.00000054/2023-36 | 60 | 12 (1 pendente) | 3 = 3 | tudo confere (CGE-CG com dois nomes) |
| 001.00000003/2026-62 | 79 | 37 (19 pendentes; remessa para 35 unidades) | 35 = 35 | tudo confere |
| 99906.713-630.000032/2025-82 | 169 (2 páginas) | 5 | 2 = 2 | confere, exceto a regra "remessa fecha": TESTE remeteu mantendo aberto (divergência 2) |

Duas conferências falharam no caminho e viraram correção: a identidade só pelo nome (misturava unidades de mesmo nome) e a
ordem do mesmo minuto (a unidade que recebe e devolve no mesmo minuto ficava em curso para sempre).

### Fixtures (reais, anonimizadas) e testes

`sei-nucleo/tests/fixtures/sei41/historico_completo_{p0,p1,siglas}.html` (ver o `LEIAME.md`). `tests/verificar-historico2.ts`: 118
conferências (leitura; coleta, cache, uma coleta por vez, cancelamento, falha e pendência com um SEI falso que guarda tipo e página
da sessão; passagens reais e montadas: vazio, siglas repetidas, reabertura, remessa múltipla, em curso, mesmo minuto, mantido
aberto, documentos, datas e fuso).

## Gantt de tramitação (etapa 3, Tasks 8 e 9): `src/gantt/`

Ponto de entrada: o link “Histórico de tramitação do processo” da capa LEGADA. `initGanttHistoryProc` (`sei-functions-pro.js`) tem uma
guarda no começo: se o `<html>` do `#ifrArvore` tem `data-seipro-processo-gantt` (marcado em `document_start` por `marcarGantt`), dispara
`spro-processo-gantt-abrir` nesse documento e sai (sem frappe-gantt, sem jmespath). `gantt/ligar.ts` escuta o evento (sempre, com ou sem
painéis e menu ligados) e chama `abrirGantt(ctx)`, que a capa nova (Etapa 4) reusa. O contexto agora tem `coletarHistorico`,
`documentos` (árvore + pastas abertas) e o gancho `aoPedirHistorico(aoProgresso)` ligado (Bloco Interno: coleta com “página x de y”).

- `modelo.ts` (sem DOM): raias por unidade (“GPF 3x”), escalas Dia 28 / Semana 9 / Mês 2,2 px por dia (teto de 30 mil px; escala
  inicial = a mais detalhada que cabe), eixo em duas faixas, durações, texto das dicas. `svg.ts`: SVG com `createElementNS`; barra
  por passagem, listrada se em curso, pontilhada e tracejada se aguardando recebimento, trecho listrado depois da marca da remessa se
  “mantido aberto”, losango por documento (clique/Enter/Espaço), linha “Agora”, cabeçalho e rótulos fixos na rolagem. `dica.ts`: balão
  próprio (`role=tooltip`, por mouse e foco), nunca `title`. `visualizacao.ts`: o losango abre o documento num diálogo com o `src` que
  a árvore já tem (nunca montado); documento fora da tela avisa (pasta fechada ou excluído).
- `visao.ts` + `modal.ts`: `dialog.spro-dialogo` sem Cancelar; estados coletando (progresso + “Cancelar coleta”, que para só a coleta),
  erro (“Tentar de novo”), cancelado, vazio, sigiloso, pronto e desatualizado; abas Gantt e Tempo por unidade; Atualizar, Exportar CSV,
  Imprimir. Fechar o modal para a coleta.
- `comparativo.ts`: `tempoPorUnidade` (maior para o menor; dias e % com uma casa). Regra: em curso conta até agora; passagens
  simultâneas contam cada uma na sua unidade e o % é sobre a SOMA do tempo de todas (fecha em 100%); o tempo corrido vai à parte.
- `exportar.ts`: CSV (BOM, `;`, aspas, fórmula neutralizada; 13 colunas) e visão de impressão (`.spro-g-impressao`, só visível em
  `@media print` com `data-spro-imprimindo`; tabela de passagens, tempo por unidade e o gráfico numa largura só).
- `coleta.ts`: cache de 30 min do histórico completo numa chave PRÓPRIA (`processo-historico/<host|login>/<id>`, até 900 KB por
  entrada, 12 processos, 24 h; acima disso fica só em memória), porque cabe pouco na entrada de 64 KB dos painéis. Dentro de 30 min:
  sem rede. Vencido: o dado antigo aparece como “desatualizado” e a coleta INCREMENTAL do núcleo o atualiza. Sigiloso nunca coleta
  nem grava. Toda coleta publica a fatia `blocoInterno`; ao abrir o processo, histórico ainda válido no cache preenche o Bloco Interno
  sem rede (`restaurarBlocoInterno`). A coleta só começa por clique.

### Resultado do teste ao vivo (Task 9, 24/10/2026, SEI SP de treinamento 4.1.5, unidade TESTE)

Processo grande 99906.713-630.000047/2023-89 (150 andamentos, 2 páginas, 20 passagens, 12 raias) e pequeno 99906.713-630.000111/2023-21
(9 andamentos, 5 passagens). Capturas em `scratchpad/live/shots/gantt-*.png`.

| Cenário | Resultado |
| --- | --- |
| 1ª abertura (grande) | modal em 80 ms, coleta de 1,5 s, 20 barras, 17 losangos, raias “TESTE 2x, SSP-CG 5x...”; 37 KB no cache |
| 2ª abertura | 60 ms, 0 requisições de histórico |
| Cancelar no meio (POST atrasado 1,8 s) | “página 1 de 2”, cancela, aviso “Coleta cancelada”, nada gravado no cache |
| Atualizar (incremental) | GET, GET, POST P/0, POST R/0 (só a 1ª página) |
| Cache vencido (40 min) | abre na hora com as 20 barras e o aviso “coletado há 40 min enquanto é atualizado”; atualiza e some o aviso |
| “Consultar Andamento” nativo | antes `R`/0, 50 registros; depois da coleta, do cancelamento e da atualização: idêntico (e 9 registros no pequeno) |
| CSV (download real) | BOM `efbbbf`, `;`, cabeçalho + 20 linhas, datas e unidades iguais às da validação da Task 7 |
| Imprimir | `window.print()` abre a prévia do Chrome (2 páginas: gráfico, passagens, tempo por unidade); aberta e fechada, sem imprimir |
| Dica | por mouse e por foco: quem recebeu/enviou, datas, duração, documentos; pendente e em curso distintos |
| Visualização rápida | losango com a pasta aberta na árvore abre o documento (0000130) no diálogo; Esc fecha só ele; pasta fechada avisa |
| Escalas | Dia, Semana e Mês com rolagem e “Ir para o mais recente” |
| Tema escuro | `data-spro-tema=escuro` no quadro da árvore escurece o modal |

Divergências e pendências: o histórico tem 4 unidades “em curso” ao mesmo tempo, então o Tempo por unidade dá ~24,6% a cada uma (regra
acima). Abrir pelo link da capa legada só funciona com a opção que mostra a capa; a capa nova virá na Etapa 4. A visualização rápida só
acha documentos da árvore e das pastas já abertas. O SEI 5 não foi exercitado (sem acesso nesta rodada).

## Capa e cards (etapa 4, Tasks 10 e 11): `src/capa/`

Content script `js/init_processo_capa.js` (`src/capa/main.ts`; `all_frames`, `document_idle`, só no `dist/manifest.json` do Lab). Age só
no quadro do visualizador que traz a capa (`#divArvoreHtml`), nunca na janela de topo nem na cópia oculta `#frmCheckerProcessoPro`.

### Como a capa obtém os dados (e a divergência da spec 8.1)

- Árvore: lida DIRETO do quadro vizinho (`topo.querySelector('#ifrArvore').contentDocument` + `lerArvore`, mesma origem, zero rede). A
  spec dizia "só lê o cache e pede por mensagem"; para os cards da árvore isso seria mais lento e não traria nada (a árvore já está na
  tela, no quadro ao lado). O que é DADO (cadastro, marcadores, histórico) segue pelo cache.
- Cadastro e marcadores: o cache do processo (`chrome.storage.local`, `processo/<host|login>/<id>`, as fatias `dadosProcesso` e
  `marcador`), lido uma vez e de novo a cada `chrome.storage.onChanged` dessa chave. Se faltar, a capa PEDE ao quadro da árvore (o dono
  da escrita da loja) por evento no documento da árvore (`spro-processo-capa-pedir`); o quadro da árvore carrega as fatias e grava o
  cache, e o `onChanged` redesenha a capa. Sem resposta em 8 s, os campos viram "Não foi possível carregar" com "Tentar de novo".
- Histórico: o cache de 30 min (`processo-historico/...`). Cards do histórico em três estados: tracejados com "Calcular" (sem cache ou
  vencido), "Calculando... página x de y" e calculados. "Calcular" dispara `spro-processo-capa-calcular` no quadro da árvore, que roda
  `obterHistorico` (coleta do núcleo, com restauro) e devolve o progresso em `data-spro-capa-coleta` no `<html>` da árvore
  (`coletando:3/34`, `erro:mensagem`, `pronto`); a capa observa o atributo. "Cancelar o cálculo" dispara `...-cancelar`. O `detail` de
  um evento não atravessa mundos isolados: por isso os pedidos são só o NOME do evento e a resposta vai por atributo/cache. O link
  "Histórico de tramitação do processo" dispara o `spro-processo-gantt-abrir` que já existia (abre o Gantt da etapa 3).
- Quem escreve é sempre o quadro da árvore (`src/pagina/ponteCapa.ts`); a capa nunca grava nem busca nada por rede.

### O que se vê

Faixa de cards (opção A) e, abaixo, os campos preservados do legado (cada valor copiável com um clique): link do histórico, número do
processo com copiar link, autuação, tipo, especificação (selo URGENTE), assuntos, interessados, nível de acesso com hipótese legal,
marcador com prazo (e o prazo nativo do SEI), bloco interno (só com o histórico em cache), observações da unidade e das outras, mais
QR code e o aviso do SEI ("Processo aberto somente na unidade X") do lado.

- Cards da árvore (instantâneos): documentos (avisa "pasta fechada não contada": o SEI só traz a pasta quando o usuário a abre, e a
  contagem é do que a árvore tem), internos / externos, assinados de N, cancelados, sigilosos (com os restritos no detalhe), pastas.
- Cards do histórico: unidades por onde passou, tramitações (passagens encerradas por remessa), tempo total, "Na unidade atual" e, se o
  histórico diz, "Gerado por" e "Última assinatura".
- Alerta de parado: o card "Na unidade atual" ganha destaque quando `dias > limite`. Fonte: a passagem em curso da unidade; sem
  histórico, a data de recebimento que o próprio legado guarda em `localStorage.configDataRecebimentoPro` (só leitura; formato real
  medido ao vivo: `datahora: "aaaa-mm-dd hh:mm:ss"`, o do andamento "Processo recebido na unidade" da unidade do usuário; o legado a
  grava ao abrir o processo). Com essa data o card sai pronto na hora, sem "Calcular". Opção nova `processoparado` (número de dias,
  padrão 15, 0 desliga; ausente = 15): `opcoes-pagina/src/schema-dados.ts` (a mão, `gerar-schema.mjs` não rodou) e a página rebuildada.
- Copiar resumo: `resumoDoProcesso` (número, tipo, interessados, situação com a frase do SEI de onde está aberto, unidade atual com dias
  na unidade, contagem de documentos). Sigiloso: só o número.
- Sigiloso: só número, tipo, nível e os cards da árvore; nem o cache é lido; a capa não pede nada ao quadro da árvore, não há link do
  histórico nem cards do histórico; "Copiar resumo" copia só o número.
- QR code: gerador próprio (`qr.ts`, ISO 18004, modo byte, nível M, versões 1 a 10 = até 213 bytes), desenhado em SVG (um `path`, zona de
  silêncio e fundo branco: o escuro do SEI não o inverte). Sem jQuery, sem `jquery-qrcode`, sem HTML por string. Conferido: BCH do
  formato e da versão contra as tabelas da norma, resto de Reed-Solomon zero em cada bloco, e DECODIFICADO pelo `BarcodeDetector` do
  Chrome em 14 textos de 3 a 213 bytes (versões 1 a 10, vários blocos, UTF-8): todos voltam idênticos. O link é o permanente do
  processo (`<origem><caminho do quadro>?acao=procedimento_trabalhar&id_procedimento=...`); a base vem do PRÓPRIO quadro, não da janela
  de topo, cuja URL vira `/sei/#processo?...` (URL amigável) e quebrava o link.
- Não se redesenha em loop: a vista é comparada (assinatura), cada parte (faixa, campos, barra, lado) só se refaz se mudou, os eventos
  são agrupados num `setTimeout(0)`, e há UM relógio que refaz a faixa quando o histórico vence (30 min). 20 atualizações e 5
  `onChanged` sem mudança = 0 redesenhos (teste).
- Reposicionamento por vigia, não por relógio: o SEI às vezes reescreve o `#divArvoreHtml` DEPOIS de nós (medido ao vivo no processo
  sigiloso, depois da senha) e leva a capa junto; um `MutationObserver` (filhos do corpo, ignorando o que muda dentro da própria capa) a
  põe de volta e copia o aviso do SEI de novo. O legado usava um laço de 1,5 s para isso.
- Diagnóstico: `data-spro-capa-estado` no `<html>` do quadro (`iniciando`, `desenhada`, `desistiu: motivo`, `erro: mensagem`).
- Acessibilidade: a faixa é uma lista; o card pendente é um botão DENTRO do item; sem `title`; tema escuro pelo atributo do Estilo
  Avançado ou o `dark-mode` antigo (`data-tema` na raiz).

### Agente de IA (`agente-ia/src/ponte/capa.ts`)

O Agente procura `#capaProcessoPro` (a cada 2 s) e põe o cartão de sugestão como primeiro filho dela. A raiz nova mantém esse id e
`data-spro-capa="1"`, e nós trocamos só as partes internas, sem apagar filhos de outros módulos. Provado com o PRÓPRIO
`mostrarCartaoNaCapa` do agente (teste) e ao vivo (a mesma travessia de iframes acha a capa na profundidade 2, e o cartão sobrevive a um
`onChanged` que redesenha). Nada mudou no agente.

### Cessão do legado

- `dist/js/sei-functions-pro.js`: guarda de 3 linhas no início de `setCapaProcesso` (`data-seipro-processo-capa` no `<html>` da janela
  de topo, onde o legado roda). O atributo é posto em `document_start` pelo script da ÁRVORE (`marcarCapa`, só na janela de topo com
  `acao=procedimento_trabalhar`), para existir antes da primeira chamada do legado; a capa nova o reafirma ao montar e, se o legado já
  desenhou a dele, a troca (uma raiz só).
- O iframe oculto `#frmCheckerProcessoPro` (`initDadosProcesso`, sei-pro.js) e `dadosProcessoPro` NÃO foram desligados: sobram
  consumidores, e a capa legada era só um deles. Os que sobraram (funções, `dist/js`):
  - Favoritos (`sei-pro-favoritos.js`: `addFavoritePro`, `initDadosSelectDoc`, `getDadosSelectDoc`, `storeFavoritePro`,
    `checkDataFavoritePro`, `updateSelectFavorites`...): `propProcesso`, `listAndamento`, `listDocumentosAssinados`, `tiposDocumentos`;
  - Editor (`sei-pro-editor.js`: `arrayDadosEditor`, `replaceDadosEditor`, `initFunctions`; e `camposDinamicosProcesso`,
    `openCamposDinamicosForm`, `getInteressadosProcesso`, `getListaAtribuicaoProcesso`);
  - Edição legada de dados do processo: `editDadosArvorePro_`, `addUrgenteProcessoPro`, `addTrancadoProcessoPro`, `getIsProcUrgente`,
    `getIsProcTrancado`, `confirmaDadosUrgencia`, `updateDadosArvore*`, `updateDadosProcesso`, `formControlerAlterarProcesso`,
    `getSelectHipoteseLegal`, `getHipoteseLegal`;
  - Documentos assinados e lista de documentos: `initCheckNaoAssinados`/`boxCheckNaoAssinados` (o aviso de não assinados),
    `getListDocumentosArvore`, `fillDocumentosActionsPro`, `refreshDocumentosActionsPro`, `getDocumentosActions`, `openDialogDoc`,
    `getNewDocCompareDocs`, `getBatchActionsPro` (ações em lote);
  - Histórico legado: `mergeAllAndamentosProcesso`, `setHistoryProcessosPro`, `getDadosAndamentoPro`, `getBlocoProcessoHistorico`,
    `getDataRecebimentoPro` (esta é quem alimenta o `configDataRecebimentoPro` que a capa nova lê);
  - Título da página e URL amigável: `updateTitlePage`, `updateUrlPage`;
  - Controle de processos e pesquisa: `getDadosProcedimentosControlar`, `initCheckDadosProcedimentos`, `getDadosPesquisaPro`;
  - Atividades e prescrição: `sei-pro-atividades.js`, `checkTipoPrescricaoProcesso`, `initPanelPrescricaoProcesso`;
  - Upload pela árvore: `iniciarUploadArvoreProcessoPro`, `loadIframeProcessUpload`, `setUploadFilesInProcess` (`sei-pro.js`).

### Testes

`tests/verificar-capa.ts` (175 conferências; o pacote todo, 581): QR (tabelas da norma, Reed-Solomon, estrutura, SVG);
cards da árvore nas fixtures do 4.1 (completa, com pastas fechadas) e numa árvore no formato do 5 (sintética: internos, PDF e zip,
cancelado, restrito e sigiloso, assinado, sem pastas); cards do histórico (sem cache, com cache, vencido aos 31 min, válido aos 29);
parado (histórico, data do legado no formato real, limite 0, limite inválido); resumo (e a situação em várias linhas); sigiloso; vista;
ponte (estado da coleta, cache e `onChanged`); controle (uma raiz, sem laço, reage a `onChanged`, preserva o cartão do Agente, erro
com "Tentar de novo", Calcular/progresso/erro/cancelar, copiar, abrir o Gantt, seleção do nó, capa antiga do legado trocada, vigia,
destruir); o lado da árvore (pedir, calcular, cancelar, erro, sigiloso); compatibilidade com o `mostrarCartaoNaCapa` do Agente.

### Resultado do teste ao vivo (Task 11, 24/10/2026, SEI SP de treinamento 4.1.5, unidade TESTE)

Chrome for Testing com a extensão de `dist/`, opções todas ligadas menos `disablequery`. Capturas em `scratchpad/live/shots/capa-*.png`.

| Cenário | Resultado |
| --- | --- |
| 20 processos em sequência, SEM cache (cache zerado) | 20 de 20: uma raiz, 10 cards, 9 campos, dados prontos; a capa aparece 19 ms (mediana) / 207 ms (pior) depois de o quadro dela existir |
| Os mesmos 20, COM cache | 20 de 20; 38 ms / 69 ms |
| Tempo total | O quadro do visualizador chega 0,8 a 1,6 s depois da árvore (ritmo do próprio SEI); a meta de "300 ms" vale DEPOIS dele: é onde a capa pode existir |
| "Calcular" (processo de 150 andamentos, 2 páginas) | "Calculando... página 1 de 2" e "2 de 2", 3,4 s no total; cards: 12 unidades, 8 tramitações, 1285 d, "parado há 1268 dias", "Gerado por", "Última assinatura"; pedidos de rede: 2 GET + 3 POST de `procedimento_consultar_historico`, todos do quadro da árvore; Consultar Andamento nativo depois: `R`/0, 50 registros (restaurado) |
| Cache de 30 min | reabrir o processo mostra os cards calculados sem clicar e sem requisição |
| Erro de rede na coleta (POST abortado) | "Sem conexão com o SEI. Tentar de novo" nos 3 cards; depois com a rede boa, calcula; Consultar Andamento nativo intacto |
| Cancelar no meio (POST atrasado 3 s) | volta a "Calcular", atributo limpo, nada gravado, nativo intacto |
| Alerta de parado | limite 5, 15 e 100 com a data real do legado (606 dias): card em alerta; limite 0: card pronto sem alerta; valor `true` (opção marcada pela página) cai no padrão 15 |
| Data do legado sem histórico | "Na unidade atual" pronto e em alerta, os outros 3 tracejados |
| Copiar resumo | área de transferência: número, tipo, situação ("Processo aberto nas unidades: A, B, C"), unidade atual com dias, documentos; toast "Resumo copiado." |
| Copiar link do processo, copiar valor | `.../sei/controlador.php?acao=procedimento_trabalhar&id_procedimento=...`; o valor clicado |
| Link "Histórico de tramitação do processo" | abre o Gantt (20 barras) e a capa segue intacta ao fechar |
| Sigiloso (`034.00000265/2026-31`, senha pelo modal) | só processo, tipo, nível "Sigiloso" e 6 cards da árvore; sem cards do histórico; copiar resumo = só o número; nenhuma chave `processo...` no storage; nenhuma requisição de dados feita pela capa. A capa só apareceu depois do vigia (o SEI reescreve o quadro depois da senha) |
| Painéis e menu desligados | a capa pede as fatias ao quadro da árvore e os campos chegam em ~1,2 s; 0 painéis na árvore |
| `disablequery` ligada | nota "as consultas adicionais estão desativadas nas opções do SEI Pro", sem erro |
| Árvore recarregada / documento aberto e volta ao nó do processo | uma raiz só, 10 cards |
| Mudar o cache de fora (`onChanged`) | a especificação ganha "(URGENTE)" e o selo aparece em < 600 ms; o cartão do Agente (simulado) continua no lugar |
| Estilo Avançado escuro | raiz `data-tema=escuro`, cards e QR legíveis (QR sempre sobre branco) |
| QR code | `BarcodeDetector` decodifica o link permanente do processo (e, no teste à parte, 14 textos de 3 a 213 bytes, versões 1 a 10) |
| Console | sem erro do módulo nas rodadas |

### Divergências e pendências da capa

- O SEI 5 não foi exercitado ao vivo (sem acesso nesta rodada); a árvore do 5 dos testes é sintética (mesmo formato `infraArvoreNo`).
- Os cards da árvore contam o que a árvore tem na tela; documentos de pastas fechadas só entram quando o SEI as carrega (o card avisa).
- "Bloco interno" só aparece com o histórico completo em cache (decisão da etapa 3).
- O Estilo Avançado desligado + modo noturno ANTIGO (`dark-mode` no corpo, sem `data-spro-tema`) não foi visto ao vivo (nem a etapa 3 o pintou): o `data-tema` segue o mesmo teste dos painéis.
- A capa legada deixou de ser desenhada; o iframe oculto e a cadeia `dadosProcessoPro` ficaram (lista acima).

## Filtro da árvore (etapa 5, Task 12): `src/pagina/filtro/`

Barra acima da lista da árvore, no quadro `#frmArvore` (logo antes de `#divArvore`): campo de busca, três chips (Não assinados,
Externos, Cancelados), botão de limpar e uma linha de estado ("21 de 60 documentos", e o aviso de pastas fechadas). Liga com a opção
`filtroarvore`, independente de `infoarvore` e `menurapido`. Sem rede, sem tocar na árvore do SEI.

- `filtro.ts` (sem DOM): `aplicarFiltro(arv, f, {unidade})` devolve os ids à vista (documentos que casam e as pastas com algum
  deles); `documentoCasa`, `naoAssinado`, `eExterno`, `contar`. Regras: os chips SOMAM (com mais de um ligado vale quem casa com
  qualquer um; "e" daria sempre vazio), a busca RESTRINGE (todas as palavras, sem acento e sem caixa, no nome da árvore ou no número
  SEI; `normalizarTexto` do `@comum`) e combina com os chips em "e". "Não assinados" = documento do editor (interno ou circular),
  sem assinatura, não cancelado e, quando a árvore diz a unidade geradora (SEI 4+), da unidade do usuário: é o mesmo conjunto que o
  destaque do legado (`naoAssinadoPro`) pinta. O núcleo marca o circular como "externo" (o ícone dele não está na lista de internos);
  o filtro corrige (`eExterno`).
- `dom.ts`: a árvore do SEI é plana (cada nó são irmãos terminados por `<span><br></span>`; os filhos de uma pasta ficam num `<div>`
  à parte), então esconder um nó é pôr `data-spro-f-oculto` em cada irmão da linha (numeração, ligação, ícone, nome, duas linhas,
  ícones rápidos, estrela, unidade geradora, quebra) e o CSS faz `display: none !important`. Nenhum nó muda de lugar; nenhuma classe,
  id, `href` ou ouvinte do SEI ou dos outros módulos é tocado (o destaque do legado refaz a própria classe sem conflito); limpar
  devolve o HTML idêntico (teste). A pasta fica à vista se algum documento dela ficar; o `<div>` dos filhos some junto com a pasta.
  Pasta sem documento conhecido (fechada: só o "Aguarde...") fica à vista e conta no aviso; o nó do processo e qualquer nó que não
  seja documento (processo anexado) nunca somem. Documento que a árvore mostra mas o modelo não conhece (a leitura do `#ifrPasta` ainda
  não aconteceu) é classificado pelo DOM (ícone, assinatura `anchorA`, unidade `anchorUG`), igual ao núcleo.
- `barra.ts`: a barra (`role=search`, `aria-label`; busca `type=search` com `aria-label`; chips são `<button aria-pressed>` com
  `aria-label` completo; limpar com `aria-label`; estado em `role=status aria-live=polite`; sem `title`). Teclado: Tab percorre busca,
  limpar e chips; Enter/Espaço alterna o chip; Esc na busca limpa o filtro inteiro e mantém o foco. Digitar espera 90 ms. Um
  `MutationObserver` (só `childList`: o filtro mexe em atributos e não pode se disparar) reaplica quando a árvore muda por baixo
  (pasta aberta sob demanda, numeração, duas linhas): logo, no fim da mesma tarefa (para um nó novo numa linha escondida não piscar),
  e uma vez mais 120 ms depois. Se algo tirar a barra da página, ela volta no mesmo lugar com o mesmo estado. Processo sem documentos
  nem pastas: a barra se esconde. Tema pelo `data-tema` (Estilo Avançado ou `dark-mode`).
- Pastas abertas sob demanda: o SEI carrega os documentos da pasta no `#ifrPasta`; `ctx.documentos` (o mesmo mapa do menu) os lê a
  cada `load`, e o observador reaplica. Pasta aberta depois entra no filtro; o aviso "Pastas fechadas não entram" some quando não há mais.
- Opção `filtroarvore` (e `processoparado`) com `visivelEm: "lab"` em `opcoes-pagina/src/schema-dados.ts` (a mão; `gerar-schema.mjs`
  não foi rodado) e a página rebuildada (`dist/html/options.js`).

### Testes e resultado ao vivo

`tests/verificar-filtro.ts` (99 conferências; o pacote todo, 680): modelo na fixture real do 4.1 (43 documentos: cada chip, união,
busca por nome, sem acento e sem caixa, por número, várias palavras, texto + chip, pastas) e numa árvore sintética no formato do 5
(cancelado, circular, formulário, outra unidade geradora); DOM montado como a `InfraArvore.js` do SEI monta (linha inteira com
numeração, duas linhas, ícones rápidos e estrela; pasta fechada; pasta aberta depois; documento só do DOM; processo anexado;
HTML idêntico ao limpar; ouvintes e classe do destaque do legado intactos; a regra de CSS existe); barra (aria, teclado, Esc,
contagem, observador, barra tirada que volta, mudança dentro da barra que não reaplica, tema); borda (sem documentos, sem árvore,
processo de nível sigiloso, com `fetch` que lança: nada de rede).

Ao vivo (SEI SP 4.1.5, processo de 60 documentos em 4 pastas): Não assinados 35 de 60 (os mesmos 35 do destaque do legado),
Externos 21, Cancelados 1, Despacho + Maria 2, número `0103947` 1; pasta sem documento à vista some (PASTA4 com o filtro de externos)
e as fechadas ficam; abrir as pastas depois reaplica; Tab, Tab, Enter liga o chip; Esc limpa; botão de limpar. Processo sigiloso
(`034.00000265/2026-31`, senha pelo modal): barra e filtros funcionam, 0 requisições durante o uso, sem erro de console. Escuro:
legível (capturas em `scratchpad/live/shots/fim-filtro-*.png`). O botão de limpar do navegador (X dobrado em `type=search`) foi escondido.

## Etapa 7 (24/10/2026): título, aviso de não assinados, assuntos e interessados, processos do interessado, anotação

### 1. Título da aba (`src/pagina/titulo.ts`)

Formato do legado (`updateTitlePage`, modo `processo`): `<especificação> | SEI - Processo <número>`. O quadro da árvore grava o título
da JANELA DE TOPO (mesma origem) a partir da fatia `dadosProcesso` da loja: o cache pinta na hora, a rede confirma e troca; não há
iframe oculto. A janela de topo ganha `data-seipro-processo-titulo` em `document_start` (ver "Cessão do legado"); o legado só deixa de
gravar o texto do título, a URL amigável (`updateUrlPage`) e o título do editor seguem dele.

Divergências do legado: processo sem especificação fica `SEI - Processo <número>` (o legado deixava ` | SEI - Processo ...` com a barra
sobrando); sigiloso não é tocado (a especificação dele não vai para a tela, spec 8.1); `disablequery` ligada deixa o título do SEI como
está (como o legado, que nem tinha o dado). O título só se aplica na janela de topo do processo (`acao=procedimento_trabalhar`), não em
janela auxiliar. A fatia `dadosProcesso` passa a ser carregada mesmo com painéis e menu desligados (um GET do formulário do processo).

### 2. Aviso de documentos não assinados (`src/pagina/aviso/`)

Onde aparece e quando: no quadro do **Enviar Processo** (`acao=procedimento_enviar`, aninhado no visualizador), com a opção
`naoassinados` ligada (padrão). Uma linha na barra de localização (no lugar do `#checkNaoAssinados` do legado) e o diálogo
"Documentos pendentes de assinatura", que abre sozinho quando há pendentes (como no legado); "Detalhes" o reabre; clicar num documento
o seleciona na árvore. O quadro do Enviar lê a árvore do quadro vizinho (`#ifrArvore` da janela de topo): **nenhuma requisição**.

**O que o legado fazia e o que muda (regra da spec 8.2: nenhum recurso coleta histórico sozinho).** O legado, ao abrir o Enviar Processo
com a opção ligada (que é o padrão), chamava `mergeAllAndamentosProcesso`: coletava o HISTÓRICO COMPLETO do processo (dezenas de POSTs
em processo longo) só para saber a unidade de cada documento (`listDocumentos[].unidade`) e a data, e então filtrava
`assinado == false`, `unidade == sigla da unidade atual` e `nativo` (ícone de documento interno). Agora:

| Legado | Módulo |
| --- | --- |
| Unidade do documento vinda do histórico completo, coletado a cada Enviar Processo | Unidade vinda da própria árvore (SEI 4+: `unidadeGeradora`, a sigla do `anchorUG`); **sem coleta de histórico, nunca** |
| Data do documento (do histórico) na lista | Só quando o histórico completo JÁ está no cache de 30 min (coletado por clique, Gantt ou cards): a data de geração aparece na lista; senão a lista vem sem data |
| `nativo` = ícone `documento_interno` | Documento do editor do SEI: interno **ou circular** (mesmo critério do chip "Não assinados" do filtro da árvore); cancelado não conta |
| SEI 3.x: unidade pelo histórico | Sem `unidadeGeradora` na árvore (SEI 3.x, fora do alvo) vale o documento, de qualquer unidade |
| Só os documentos que a árvore tinha na tela | Idem, mais os que o SEI inseriu no DOM ao abrir uma pasta; **e** o aviso diz quantas pastas fechadas faltam verificar, em vez de afirmar "tudo assinado", e oferece "Verificar pastas" |
| Diálogo navegava o visualizador de volta ao Enviar Processo | Não navega: só seleciona o documento na árvore |

"Verificar pastas" é um clique do usuário que o módulo repete na árvore: clica no "+" (`ancjoinPASTAn`) de cada pasta fechada, uma de cada
vez, e o SEI carrega a pasta por conta própria (`procedimento_paginar`, o mesmo que o usuário dispararia); depois verifica de novo.
O nome da pasta (`anchorPASTAn`) abre por `javascript:` no `href`, que o navegador bloqueia quando o clique vem do mundo isolado
(erro de CSP no console); o "+" tem ouvinte normal, e o clique ainda leva `preventDefault` para não executar o `href`.

Cessão: `data-seipro-processo-aviso` na janela de topo; `getActionsOnSendProcess` não chama mais `initCheckNaoAssinados`. O legado
continua capaz de tudo isso quando o módulo não está carregado.

### 3. Assuntos e interessados (`src/pagina/modais/lupa.ts`, `src/modelo/lista.ts`, `src/modelo/pesquisador.ts`)

Os painéis ganharam o lápis "Editar assuntos" e (já existia) "Editar interessados": modal `dialog.spro-dialogo` sem Cancelar com a lista do
processo (Retirar/Manter; item novo mostra "Novo" e "Desfazer"), busca incremental (3 letras, 350 ms, Enter pesquisa na hora, seta para baixo
vai aos resultados) no AUTOCOMPLETAR DO PRÓPRIO SEI e o botão Salvar, que grava pela lupa do formulário do processo.

- Núcleo: `alterarProcesso` ganhou `assuntos` (`selAssuntos`/`hdnAssuntos`); `lerFormularioDoProcesso` traz `assuntos`, os itens "negados"
  e `pesquisarAssuntos`/`pesquisarContatos`, que usam o link do `infraAjaxAutoCompletar` lido do script da tela (`hdnIdAssunto` e
  `hdnIdInteressadoProcedimento`; nunca montado) e a codificação da tela (o de contatos já codifica o termo). `MetadadosProcesso` traz
  `assuntosItens`, `interessadosItens` e `idTipo`. Os mesmos ids e a mesma codificação no fonte do SEI 5.0.0.
- Prova de sucesso e fila: igual às demais edições (`alterarProcesso` com `aplicar: true`, o SEI precisa sair de `procedimento_alterar`;
  fila do processo; só o painel afetado muda). Não aparece em sigiloso (os painéis nem existem) nem em processo não aberto na unidade
  (sem `editavel`, como Tipo, Nível e Observações).
- Regras do SEI replicadas: o processo precisa de ao menos um assunto (`Informe os Assuntos.` da tela; o modal e o núcleo recusam antes de
  gravar); assunto ou interessado acrescentado por OUTRA unidade não se retira (`arrAssuntosNegados`/`arrInteressadosNegados` do script da
  tela; o modal mostra "Acrescentado por <sigla>" sem botão, e o núcleo lança a mensagem da própria tela).
- Estados: carregando (formulário), erro com "Tentar de novo" (formulário e pesquisa), "Digite mais N letras", "Pesquisando…" (`aria-busy`),
  "N resultados", vazio ("Nenhum resultado para ..."), item já no processo desabilitado; `aria-label` em tudo (nenhum `title`); o foco vai ao
  campo de busca ao abrir e ao próximo "Adicionar" livre depois de adicionar. A resposta de uma busca antiga é descartada e a requisição é abortada.

### 4. Processos do interessado (`sei-nucleo/src/dominio/pesquisa.ts`, `src/pagina/modais/interessado.ts`, `src/modelo/buscaProcessos.ts`)

Na linha de cada interessado do painel, o botão "Processos de <nome>" abre o modal com a lista (número, tipo, unidade com sigla e nome,
usuário com nome e login, data), os dois filtros do legado ("Tramitados na unidade" = `chkSinTramitacao`; "De mesmo tipo (<tipo>)" =
`selTipoProcedimentoPesquisa`, pelo `idTipo` do processo) e "Mais resultados (N restantes)" (páginas de 10, `hdnInicio`). Clicar no número
abre o processo por `abrirProcesso` (`@comum/pagina/abrir`: pesquisa rápida do cabeçalho, nunca um link montado); Ctrl ou Cmd (ou o botão
do meio) abre em outra aba e mantém o modal.

Núcleo: `pesquisarProcessosDoInteressado(sei, {interessadoId, tramitadoNaUnidade?, tipoProcesso?, inicio?})` é a mesma pesquisa da tela
(`protocolo_pesquisar`, o formulário do menu, com `rdoPesquisarEm=P` e `hdnIdContato`); só vêm os processos que o usuário pode ver. Lê o
resultado com `lerResultados` (agora com `idProcedimento`, `unidadeNome`, `usuarioNome` e o total também em "13 resultados", que é como
a última página escreve). **Com um único resultado o SEI pula direto para o processo** (`procedimento_trabalhar`): o módulo lê só o número
(título da tela) e o id da URL, sem buscar a árvore. Rede: um GET do formulário da pesquisa e um POST por página. Divergências do
legado: não usa iframe; sigiloso não tem o painel; o legado montava a URL do processo à mão (`...?acao=procedimento_trabalhar&id_procedimento=`),
que derruba a sessão no SEI 5.

### 5. Edição da anotação NO LUGAR, sem modal (`src/pagina/paineis/anotacaoEditor.ts`, `anotacoes.ts`)

O modal de edição da anotação foi apagado (a pele de post-it e o rodapé que se sobrepunha ao contador ficaram para trás). Clicar no papel do cartão, no
lápis, no "+" ou em "Adicionar anotação" troca o cartão, no mesmo painel, por um editor com a mesma pele do post-it (amarelo nos dois temas):

- **Área de texto** (`aria-label="Anotação"`) que CRESCE com o conteúdo (mede o `scrollHeight`; teto de 60% da altura do quadro, depois rola), limite de **500
  caracteres** (o SEI: `definirAnotacao` corta em 500 e o legado tem `maxlength=500`), contador "N caracteres restantes" e, no limite, "Você atingiu o número máximo
  de caracteres.". O texto gravado é aparado.
- **Barra de ferramentas** em linha própria (`role=toolbar`, quebra de linha em vez de sobrepor, qualquer largura): Salvar, Prioridade (`aria-pressed`), Checklist
  (alterna `[ ]` nas linhas selecionadas, como o legado), subir e descer linhas, data (`<input type=date>`: coloca ou troca a primeira data `dd/mm/aaaa` do texto),
  Remover (só anotação existente, com confirmação) e Descartar. Todos os botões têm `aria-label`; alvos de 26 px; sem `title`.
- **Checklist**: Enter no fim (ou no meio) de um item abre o próximo item ABERTO levando o resto da linha; Enter em item vazio tira a marca e sai da lista;
  Alt+seta para cima/baixo move as linhas selecionadas (com o cursor sem seleção, ele continua na mesma coluna: digitar não apaga nada). Marcar e desmarcar
  itens continua direto no cartão, sem entrar em edição: grava na hora (`alternarItemDaAnotacao`, lendo a anotação dentro da fila) e o painel relê.
- **Atalhos**: Ctrl/Cmd+Enter salva; Esc descarta, e só pergunta ("Descartar as alterações desta anotação?") se houver mudança (texto OU prioridade).
- **Quando grava (decisão pelo legado, `sticknoteSave_`)**: o legado gravava ao SAIR do campo (blur, com 500 ms de espera e sem gravar se o mouse estava na barra) e
  tinha o botão salvar; o editor faz as duas coisas. Sair do campo grava só se mudou, e só com **gesto do usuário**: clique fora do editor neste quadro, Tab, ou o foco
  ir para OUTRO quadro visível do SEI (o visualizador do documento). O foco que some sem gesto (captura de tela, diálogo, script da página, trocar de aba) NÃO grava, nem
  fecha o editor. Sair sem mudança fecha o editor. Texto apagado nunca grava sozinho (apagar tudo e Salvar pergunta "Tem certeza que deseja remover esta anotação?").
- **Estados**: "Salvando…" (campo só de leitura, botões travados, `aria-busy`); em erro o editor continua aberto com o texto digitado, a mensagem do SEI (`role=alert`) e
  "Tentar de novo". Quando a escrita do núcleo (`definirAnotacao`, `{aplicar: true}`, na fila da loja) confirma, o valor gravado entra na fatia como pronto (sem piscar o
  texto antigo) e a releitura confere com o SEI.
- **O painel não derruba o editor**: o painel devolve sempre o MESMO elemento e a casca (`sincronizarFilhos` em `ui/painel.ts`) só mexe no DOM do que mudou, em vez de
  `replaceChildren` (que tirava o campo da página e perdia o foco). Se a fatia mudar enquanto se escreve, o editor só marca `data-desatualizado` e mostra "Esta anotação mudou no
  SEI enquanto você editava. Se salvar, a sua versão substitui a do SEI." com "Usar a versão do SEI" (nada do que foi digitado se perde sem pedir). Se a árvore se refizer e
  o painel for remontado, o editor volta com o texto (o foco não).
- Sigiloso e processo não aberto na unidade seguem só de leitura (sem lápis, sem "+", sem clique no papel).

Divergências do legado: o legado não tinha reordenar linhas nem Enter de checklist (só alternava a marca nas linhas); gravava ao perder o foco da janela; apagar tudo e sair
gravava a remoção sem perguntar.

### Testes (etapa 7)

`processo/tests/verificar-titulo-aviso.ts` (título: formato, cache, rede, erro, sigiloso, `disablequery`; aviso: modelo na árvore real, dialogo,
datas só com histórico em cache, outra unidade, árvore inacessível, duas cópias da extensão, pastas fechadas e "Verificar pastas", documentos
do DOM), `verificar-lupa.ts` (lista editável, pesquisador, modais de assuntos e interessados), `verificar-anotacao.ts` (o editor inline: abrir, digitar, contador, salvar, erro sem perder o texto, fatia mudando durante a edição, checklist, atalhos, sair do foco, descartar e remover) e, em `verificar-paineis.ts`, o painel (lápis, clique no papel, a fatia atualizando sem refazer o campo, `sincronizarFilhos`),
`verificar-processos-interessado.ts` (paginação, corrida, filtros, modal sobre a pesquisa real). No núcleo: `verificar-lupas-processo.ts`
(negados, lupa, pesquisa com o XML real, gravação, prova de sucesso) e `verificar-pesquisa-interessado.ts` (páginas reais, único resultado,
vazio, erro). Fixtures reais anonimizadas do SEI SP em `sei-nucleo/tests/fixtures/sei41` (ver o `LEIAME.md`).

### Resultado ao vivo (24/10/2026, SEI SP de treinamento 4.1.5, unidade TESTE)

| Cenário | Resultado |
| --- | --- |
| Título da aba em 5 processos, sem cache | mediana 272 ms depois da árvore (223 a 540 ms); `data-seipro-processo-titulo` na janela de topo, o legado não regrava |
| Título com cache | no mesmo instante da árvore (a diferença medida foi de -89 a -16 ms: o título chega antes dos nós) |
| Título: sem especificação; sigiloso; `disablequery` | `SEI - Processo <número>`; sigiloso fica `SEI - <número>` do próprio SEI; com `disablequery` o módulo não mexe |
| Aviso: banner e diálogo | 0,4 a 1,9 s depois do clique em Enviar Processo (tempo do SEI), nenhuma requisição do módulo; o `#checkNaoAssinados` legado não aparece |
| Aviso: pastas fechadas | 3 pastas fechadas avisadas; "Verificar pastas" abre as 3 em 3 s; de 1 para 35 pendentes (os mesmos 35 do destaque do legado e do chip do filtro) |
| Aviso com e sem histórico em cache | sem cache: lista sem datas; com o Gantt aberto antes (cache de 30 min): a data de geração aparece (`18/10/2026`) |
| Aviso com `naoassinados` desligada; perfil limpo (só 4 opções) | nenhum aviso; no perfil limpo o aviso e o título funcionam (o iframe oculto continua sendo criado: ver "O que sobra") |
| Assuntos: adicionar, retirar | pesquisa "contrata": 41 resultados; adicionado "004.01.05.005" (painel e SEI atualizados em 0,9 s), retirado: estado final IGUAL ao original, conferido abrindo o formulário de novo |
| Interessados: adicionar, retirar | pesquisa "seguran": adicionado um contato (id e nome no painel e no SEI), retirado: estado final IGUAL ao original |
| Processos do interessado | contato órgão com 13 processos: 10 + "Mais resultados (3 restantes)" = 13; "Tramitados na unidade": 2; mais "De mesmo tipo (Decreto)": 1; sem filtros: volta a 13; clique abriu o processo pela pesquisa rápida e o título da aba mudou |
| Rede do módulo nas edições | só `procedimento_alterar` (GET do formulário, POST de gravação) e o autocompletar (POST); nenhuma `arvore_montar`/`procedimento_visualizar`/`atribuicao_cadastrar` partiu do bundle do módulo (as que apareceram no log vêm do jQuery do legado: iframe oculto) |
| Edição da anotação (substituída no item 5) | ver a tabela "Edição da anotação no lugar" abaixo |
| Console | sem erro nem aviso do módulo em todas as rodadas |

Capturas em `scratchpad/live/shots/`: `aviso-1.png`, `aviso-pastas.png`, `aviso-com-cache.png`, `lupa-assuntos-1..3.png`, `lupa-interessados-1.png`,
`interessado-1..3.png`, `anotacao-antes-{claro,escuro}.png`, `anotacao-depois2-{claro,escuro}.png`, `anotacao-largura-{900,520,400}.png`,
`sigiloso-titulo-aviso.png`.

### Edição da anotação no lugar: resultado ao vivo (24/10/2026, SEI SP de treinamento 4.1.5, unidade TESTE, processo `99906.713-630.000032/2025-82`)

Tudo num processo só; o estado inicial foi guardado (texto exato e prioridade) e o final conferido reabrindo o processo pela pesquisa rápida: **igual ao original**
(`Aguardando parecer da área técnica.` + 3 itens de checklist, com prioridade). Teclado de verdade pelo `page.keyboard` do Puppeteer.

| Cenário | Resultado |
| --- | --- |
| Abrir pelo lápis e clicando no texto do cartão | o editor entra no lugar do cartão, com o foco no campo; nenhum `<dialog>` aberto (nem no quadro nem no topo) |
| Digitar, contador, Enter em checklist, Enter em item vazio, Alt+seta | `[ ] item` abre o próximo item; Enter em item vazio sai da lista; Alt+cima move a linha e o cursor continua na coluna |
| Crescer com o conteúdo | 137 px (7 linhas) para 254 px (13 linhas); contador "249 caracteres restantes" |
| Ctrl+Enter | "Salvando…", depois o cartão com o texto novo; reaberto no SEI o texto é o mesmo |
| Marcar item no cartão | não entra em edição; gravou (reaberto: `[true,false,false,true]`) |
| Sair do campo clicando em outro lugar do quadro | gravou sozinho (reaberto no SEI) |
| Sair do campo clicando no quadro do visualizador (outro quadro) | gravou sozinho |
| Captura de tela, diálogo e troca de janela | NÃO gravam nem fecham o editor (o foco do quadro oculto `frmCheckerProcessoPro` não conta) |
| Erro: `setOfflineMode(true)` e Salvar | o editor segue aberto, "Falha ao falar com o SEI: Failed to fetch" + "Tentar de novo", o texto digitado preservado; de novo com rede: gravou |
| Painel refeito com o editor aberto (a raiz dos painéis removida da página) | os painéis voltam sozinhos e o editor volta com o texto; o foco não volta |
| Esc com mudança | confirmação ("Descartar as alterações desta anotação?"); "Cancelar" mantém o editor e o texto; "Descartar" volta ao cartão sem gravar |
| Remover (lixeira do cartão) e "Adicionar anotação" | confirmou, o SEI ficou sem anotação ("Sem anotação."); o editor novo abre vazio e sem "Remover"; recriada com o texto e a prioridade originais |
| Claro e escuro | papel amarelo nos dois; área de texto sem fundo próprio; botões legíveis (`shots/editor-{claro,escuro}.png`) |
| Larguras do papel de 170, 230 e 240 px | a barra quebra em 4 a 7 linhas e nenhum item se sobrepõe a outro nem sai do papel; o contador fica sobre a barra (`shots/ed-6-largura-*.png`) |
| Console | nenhum erro ou aviso do módulo |

Capturas em `scratchpad/live/shots/`: `ed-1-aberto-claro.png`, `ed-3-cresce-claro.png`, `ed-4-confirma-descartar.png`, `ed-5-aberto-escuro.png`, `ed-6-largura-{240,300,520}.png`,
`ed-7-digitado-claro.png`, `ed-8-cartao-salvo-claro.png`, `ed-9-erro-{claro,escuro}.png`, `ed-10-vazio-claro.png`, `ed-11-final-restaurado.png`, `editor-{claro,escuro}.png`, `editor-largura-{240,300}.png`.

Armadilhas da rodada: (1) o Chrome for Testing recente DESABILITA extensão descompactada com o perfil sem "modo desenvolvedor" (`unsupportedDeveloperExtension`): `chrome.developerPrivate.updateProfileConfiguration({inDeveloperMode: true})`
na página `chrome://extensions` e reativar; `chrome.developerPrivate.reload(id)` serve para recarregar o `dist/` e mantém o storage; (2) `page.screenshot` tira o foco do quadro (`WINBLUR`) e põe o foco
em um iframe OCULTO (`frmCheckerProcessoPro`): uma primeira versão do editor tratava isso como "foco foi para outro quadro" e gravava sozinha; (3) no macOS, Ctrl+End não vai ao fim do texto.
**Não visto ao vivo**: o aviso "mudou no SEI enquanto você editava" (sem um segundo usuário/aba para mudar a anotação durante a edição; coberto nos testes com o `linkedom`).

### Divergências e pendências da etapa 7

- SEI 5: não exercitado ao vivo (sem acesso nesta rodada). Os campos e o autocompletar vêm do fonte do 5.0.0; o aviso e o título não dependem
  de nada específico do 4.1 além de `#divInfraBarraLocalizacao` (que o 5 também tem) e do `unidadeGeradora` da árvore.
- Aviso: documentos de pastas fechadas só entram depois de "Verificar pastas" (o aviso diz quantas faltam). Circular conta como do editor.
- Assuntos e interessados: não cria contato nem assunto; um contato que a pesquisa não acha continua precisando da tela do SEI.
- Pesquisa do interessado: lê só o que o SEI devolve na primeira tela de cada página; um interessado com milhares de processos pede página a página.
- O título do editor (`updateTitlePage`, modo `editor`) e a URL amigável continuam no legado.
- Anotação inline: SEI 5 não exercitado ao vivo (o editor só usa o formulário de `definirAnotacao`, já provado nos dois SEI nos testes do núcleo). O foco não volta ao campo quando a árvore se refaz e o painel é remontado.
  "Sair do campo grava" depende de `topo.activeElement` (quadro visível) para distinguir clique em outro quadro de captura de tela: em SEI com outra estrutura de quadros esse caso pode não gravar, o botão Salvar e o Ctrl+Enter continuam valendo.

## Fechamento (etapa 6, Task 13)

### Fluxo completo ao vivo, numa sessão contínua (SEI SP de treinamento 4.1.5, unidade TESTE, 24/10/2026)

Processo `99906.713-630.000032/2025-82` (60 documentos, 169 andamentos em 2 páginas). Sequência: abrir (sem cache) → painéis → editar uma
anotação e desfazer → menu do documento (copiar número SEI) → capa → Calcular → Gantt → comparativo → exportar CSV → filtro (chips,
busca, Esc) → reabrir com cache → limpar o cache e reabrir. Duas configurações: TODAS as opções ligadas (menos `disablequery`) e PERFIL
LIMPO (Chrome novo) só com `infoarvore`, `menurapido` e `filtroarvore`. Em ambas: todas as etapas passaram, a anotação voltou idêntica ao
original (conferida reabrindo o modal), a área de transferência recebeu `0105060`, o CSV saiu com BOM, `;` e 6 linhas, o "Consultar
Andamento" nativo não foi tocado, **0 erros de console** (nem avisos `[SEI Pro]`). Marco zero da tabela de painéis e capa: a árvore na tela.

| Medida | Todas as opções | Perfil limpo + só do módulo |
| --- | --- | --- |
| Árvore na tela, contada do pedido (1º processo do perfil, sem cache) | 3,2 / 5,6 / 6,2 / 1,8 s (4 medições; servidor do SEI) | 1,9 s |
| Painéis prontos depois da árvore, 1º processo do perfil, sem cache | 0,6 a 3,1 s (3,1 / 1,6 / 2,7 / 0,6 s) | 0,29 s |
| Painéis prontos depois da árvore, sessão aquecida, sem cache | 0,33 s | 0,45 s |
| Painéis prontos depois da árvore, com cache (o conteúdo do cache aparece junto com a árvore; a rede confirma) | 0,49 s | 0,36 s |
| Capa depois da árvore (o visualizador chega depois, ritmo do SEI): 1º processo / com cache / aquecida | 1,4 a 1,8 / 1,3 / 0,6 s | 1,4 / 0,6 / 1,3 s |
| Barra do filtro | junto com a árvore (até 0,2 s antes de os nós serem desenhados) | idem |
| Editar anotação (salvar e o painel mostrar o novo texto) / desfazer | 0,8 a 1,8 s / 0,5 a 2,7 s (SEI) | 2,2 s / 0,46 s |
| Menu do documento abre (inclui os 150 ms de espera do mouse) | 0,17 a 0,19 s | 0,18 s |
| Calcular (169 andamentos, 2 páginas: 2 GET + 3 POST) | 1,6 s | 1,6 s |
| Gantt abre com o histórico em cache / comparativo / CSV | 34 a 101 ms / 17 a 23 ms / 76 a 135 ms | 34 ms / 22 ms / 66 ms |
| Filtro: aplicar um chip (60 documentos) | 1,2 a 1,9 ms | 2,7 ms |

Metas da spec: 300 ms com cache e 2 s por painel sem cache. Com cache e na sessão aquecida, cumpridas no sentido de "o primeiro conteúdo
aparece junto com a árvore"; "todos os painéis fora de carregando ou desatualizado" leva 0,33 a 0,49 s (a rede confirma o cache). No PRIMEIRO
processo de um perfil novo, com todas as opções do legado ligadas, 2 das 4 medições passaram de 2 s (3,1 e 2,7 s); a quarta, feita com log de
rede, deu 0,6 s e mostrou os 6 GETs de dados do módulo terminando entre 0,1 e 0,6 s depois de pedidos. Não consegui reproduzir uma medição
lenta com log de rede, então a causa (servidor do SEI e o legado pedindo muita coisa ao mesmo tempo no primeiro processo) é hipótese, não
prova. Fica como pendência de acompanhamento.

### SEI 5

Não testado no SEI 5. A única credencial de teste do SEI 5 conhecida é a do ambiente de homologação do MJ, e ela não consta com senha na
memória do autor (precisaria de login manual); produção (`sei.mj.gov.br`) nunca se usa. Fica como a pendência número 1.

### Portões (24/10/2026, na worktree, branch `feat/processo-ts`)

| Pacote | `tipos` | `verificar` |
| --- | --- | --- |
| processo | ok | 680 ok |
| sei-nucleo (+ `build`) | ok | 511 ok |
| sei-comum | ok (havia 1 erro de tipo antigo em `tests/verificar-opcoes.ts`, que já existia no master; corrigido) | 763 ok |
| opcoes-pagina (+ `build`) | ok | 645 ok |
| acoes-lote / agente-ia / documentos-lote / favoritos / historico / processos-lote | ok | 704 / 1669 / 961 / 620 / 485 / 723 ok |
| estilo-avancado / link-permanente / ferramentas-pdf | ok | 132 / 117 / 6 ok |
| projetos | ok | 2588 ok |
| anotacoes-controle / grade-controle / menu-suspenso / ordem-paineis / pesquisa-rapida / prazos / blocos-assinatura | ok | verdes (34 / "tudo certo" / 17 / 41 / 19 / 58 / OK) |
| demandas | ok | 1038 ok, **1 falha que já existe no master** ("sem projeto com etapas abertas": `tests/verificar-integracao-projetos.ts`), reproduzida num `git archive` do master; não tem relação com o módulo |

`node tools/check-dom-injection.mjs` (com os dois bundles em `ARQUIVOS_GERADOS`): 0 erros, 0 avisos. `node tools/patch-manifests.mjs
--check`: 0 manifests a ajustar (a worktree só tem o `dist/manifest.json` do Lab; os derivados são gerados do Lab e, por decisão da
spec, não recebem o módulo). Bytes: os dois bundles e `dist/html/options.js` só ASCII; as linhas que a branch acrescentou em
`dist/js/sei-pro-arvore.js` e `sei-functions-pro.js` (escritos à mão) não têm nenhum byte acima de 127 (os 381 de
`sei-functions-pro.js` já eram do master) nem NUL; sem cópias "nome 2.ext" do iCloud.

### Portões da etapa 7 (24/10/2026)

`tipos` sem erro e `verificar` verde em todos os pacotes que importam o núcleo ou o comum: processo 822, sei-nucleo 562, sei-comum 763,
opcoes-pagina 645 (não foi tocada), acoes-lote 704, agente-ia 1669, documentos-lote 961, favoritos 620, historico 485, processos-lote 723,
projetos 2588, estilo-avancado 132, link-permanente 117, ferramentas-pdf 6, anotacoes-controle 34, grade-controle, menu-suspenso 17,
ordem-paineis 41, pesquisa-rapida 19, prazos 58, blocos-assinatura; demandas 1038 com a mesma 1 falha que já existe no master
(`verificar-integracao-projetos.ts`). `node tools/check-dom-injection.mjs`: 0 erros, 0 avisos; `node tools/patch-manifests.mjs --check`:
0 manifests a ajustar. Os dois bundles e as linhas novas de `dist/js/sei-functions-pro.js` só têm ASCII (os 381 bytes altos do arquivo já
eram do master).

### Portões da rodada de harmonia e anotação inline (24/10/2026)

`tipos` sem erro e `verificar` verde: processo 909 (eram 822), sei-nucleo 562. `node tools/check-dom-injection.mjs`: 0 erros, 0 avisos. Os dois bundles só têm ASCII.
`sei-comum` e `opcoes-pagina` não foram tocados (o módulo ganhou glifos próprios em vez de acrescentar ícones ao `ui/dom.ts` compartilhado).

## Comandos

```
npm run tipos       # tsc --noEmit
npm run verificar   # testes (tsx + linkedom)
npm run build       # verificar + build.mjs (gera init_processo_arvore.js e init_processo_capa.js em ../dist/js)
```

O `build.mjs` reprova, no código que roda na página, `innerHTML` & cia e os endereços que gravam
"Processo recebido" (`procedimento_visualizar`, `arvore_montar`, `procedimento_atribuicao_cadastrar`).
