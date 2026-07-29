# Changelog — SEI Pro PRF

## [2.1.0] - 2026-07-29

Mais um passo na modernização interna iniciada na 2.0: o comportamento das funcionalidades permanece o mesmo, com a extensão mais leve e estável no dia a dia.

### Melhorado

- **Carregamento mais rápido:** bibliotecas grandes (gráficos, OCR, upload, conversão de documentos, etc.) só entram quando o recurso é de fato usado, em vez de em toda página do SEI
- **Pacote mais enxuto:** remoção de bibliotecas que não eram mais utilizadas

### Alterado

- Continuidade da reestruturação modular (árvore, lista de processos, editor, tela de opções, IA, documentos em lote e áreas correlatas), sem mudança de escopo para o usuário

### Corrigido

- Estabilidade adicional de cliques e do editor no mundo isolado da extensão

## [2.0.4] - 2026-07-02

Estabilização adicional do legado contra condições de corrida no carregamento da página do SEI (`readyState=interactive`), com foco nos reportes automáticos de erro recebidos em produção (versões 2.0.1 e anteriores).

### Corrigido

- **Tooltips nativos do SEI (`sei-pro.js`, `sei-functions-pro.js`):** chamadas diretas a `infraTooltipMostrar` / `infraTooltipOcultar` passam a ser guardadas com `typeof` em `updateTipSelectAll`, `orderbyTableGroup`, `pinKanbanItensProc` e `_infraTooltipMostrar`, evitando `ReferenceError` no hover/interação enquanto os scripts nativos do SEI ainda não carregaram
- **`parent.hideMenuSistemaView` (`sei-pro-arvore.js`):** verificação `typeof parent.hideMenuSistemaView === 'function'` antes da chamada no fluxo `menususpenso` do iframe da árvore, evitando `TypeError` quando o core já carregou mas o legado do `parent` ainda não
- **Corrupção de acentuadas maiúsculas ao salvar anotações (`arvore-info/io.js`):** o `submitForm` gravava via `FormData` (multipart, sempre UTF-8) contra o backend do SEI que é ISO-8859-1, corrompendo `Ç`/`Ê` maiúsculos (ex.: "OPERAÇÃO" → "OPERAÃÃO", "CIÊNCIA" → "CIÃNCIA") tanto no controle de processos quanto na árvore. Passa a montar o corpo como `application/x-www-form-urlencoded; charset=ISO-8859-1` via `escapeComponent` (Latin-1 `%XX`), alinhando-se à convenção de todos os outros writes do projeto. Cobertura em `tests/features/arvore-info/io.test.js`
- **Ruído de "Extension context invalidated" no coletor (`platform/report.js`):** o relatório automático passa a ignorar esse erro, que é benigno e inevitável quando a extensão é recarregada/atualizada enquanto uma aba antiga ainda roda o content script (toda chamada a `chrome.runtime.*` como `getURL` passa a lançar). Não é acionável — a aba só precisa ser recarregada — e antes inundava o coletor. Cobertura em `tests/platform/report.test.js`

## [2.0.3] - 2026-07-02

Gestão proativa do cache de sessão de processos e redução de ruído no console/coletor de erros do Chrome.

### Adicionado

- **Escrita limitada de cache** (`SeiPro.core.webstore.sessionStorageStoreBoundedPro` + `boundArrayForStorage`): limita arrays-cache por quantidade e por tamanho serializado **antes** de gravar, evitando estourar a cota do `sessionStorage` (~5MB) — em vez de depender de capturar `QuotaExceededError`
- Testes unitários do bounding proativo e da rede de segurança reativa (`tests/platform/webstore.test.js`)

### Alterado

- **Cache `dadosSessionProcessoPro` (`setSessionProcessosPro`):** passa a gravar com limite proativo (máx. 25 processos / ~3MB), mantendo os mais recentes. Elimina a poda reativa recorrente que gerava o aviso "sessionStorage cheio" no console
- **Ruído de log:** mensagens de manutenção do `sessionStorage` (poda/limite) rebaixadas de `console.warn` para `SeiPro.core.logger.debug` (condicionado a `debugpage`), para não poluir o console nem o coletor de erros da extensão no Chrome em uso normal

## [2.0.2] - 2026-07-02

Correções de condições de corrida no legado (relatadas via reporte automático de erro) e melhoria de arquitetura na montagem da capa do processo.

### Adicionado

- **Primitivo de espera reutilizável** (`SeiPro.core.async`, `src/core/async.js`): `retryWithProgress` (retry ciente de progresso + backoff exponencial + teto wall-clock), `clearRetry` e `nudgeOnce` (registro único de listeners para caminho orientado a evento) — consolida o padrão de "poll cego" que estava espalhado pelo legado
- Testes unitários do primitivo (`tests/core/async.test.js`)

### Corrigido

- **`infraTooltipOcultar is not defined` (`sei-functions-pro.js`):** chamadas diretas à função nativa do SEI (linhas de `breakDadosProcedimentosControlar`, `newTabDadosProcedimentosControlar`, filtros de Kanban/tabela e etiquetas) passam a ser guardadas com `typeof`, evitando `ReferenceError` quando a página do SEI ainda não carregou seus scripts nativos (`readyState=interactive`)
- **`infraTooltipMostrar is not defined` (`sei-pro.js`, `sei-functions-pro.js`):** chamadas diretas às funções nativas de tooltip do SEI em `updateTipSelectAll`, `orderbyTableGroup`, `pinKanbanItensProc` e `_infraTooltipMostrar` passam a ser guardadas com `typeof`, evitando `ReferenceError` no hover/interação enquanto os scripts nativos do SEI ainda não carregaram (`readyState=interactive`)
- **`parent.hideMenuSistemaView is not a function` (`sei-pro-arvore.js`):** a chamada do `menususpenso` a partir do iframe da árvore passa a checar `typeof parent.hideMenuSistemaView === 'function'` (como as chamadas vizinhas já fazem), evitando `TypeError` na janela em que o core já carregou (`verifyConfigValue`) mas o legado `sei-functions-pro.js` do `parent` ainda não (`readyState=interactive`)
- **`ifrVisualizacaoWindow.$ is not a function` (`replaceSelectAllVisualizacao`):** valida que o jQuery do iframe de visualização existe antes de usá-lo e reagenda via o parâmetro `TimeOut` (antes ignorado) até o iframe ficar pronto, eliminando o crash e garantindo a aplicação do `chosen`

### Alterado

- **Capa do processo (`setCapaProcesso`):** pré-condições reduzidas de 5 → 3 (dado da sessão, id e o container `#divArvoreHtml` — sinal direto de que a capa está exibida, confirmado no DOM real do SEI 4.1+); `ifrArvore`/`rootSelected` deixam de bloquear a montagem (viram sinais opcionais). Retry, nudge por evento e limpeza agora delegam ao primitivo compartilhado `SeiPro.core.async`, tornando a montagem resiliente a recursos que chegam dispersos no tempo (cargas lentas / `reset=1`)

## [2.0.1] - 2026-06-30

Correções de estabilização pós-**2.0.0** (mundo isolado): regressões observadas no SEI real após a migração isolated-first, sem mudança de escopo arquitetural.

### Adicionado

- **Ponte de handlers inline legados** (`legacy-inline-bridge`): intercepta `onclick` / `onmouseover` / etc. com gramática estrita (`nomeFuncao(this, 'literal', …)`) e executa a função no mundo isolado — ponte temporária até migrar cada call-site para `data-act` + delegação
- Testes unitários da ponte inline (`tests/platform/legacy-inline-bridge.test.js`)

### Alterado

- **SEI adapter:** detecção de versão passa a usar sempre `resolveVersionFlags()`; removidos `applyToState`, `aliasState` e `linkStateAll` (estado espelhado obsoleto no namespace)
- **Background:** aba do histórico de versões na atualização da extensão desativada temporariamente (URL externa comentada em `handleInstalled`)
- **Controle de processos — "Ver meus processos":** clique em `#ancLiberarMeusProcessos` passa a submeter `#frmProcedimentoControlar` via DOM puro (`hdnMeusProcessos='T'`), sem chamar `verMeusProcessos` do mundo MAIN; binds duplicados de `#ancLiberarMarcador` / tipo / prioridade removidos (gap documentado — corpos nativos ainda não replicados com segurança)

### Corrigido

- **Capa do processo (`setCapaProcesso`):** resolução do iframe de visualização pelo DOM real (`#ifrConteudoVisualizacao` → `#ifrVisualizacao`) em vez do flag `isNewSEI`; leitura de `id_procedimento` também em URLs `procedimento_trabalhar`; seletor `#divArvoreInformacao, #divInformacao`; saída antecipada em frames que não são host da capa; mensagens de retry indicam qual pré-condição falhou
- **Checker de documentos:** stub `atualizarVisualizacao` atribuído via `contentWindow` no iframe same-origin, substituindo injeção de `<script>` inline bloqueada pela CSP do SEI
- **Informações na árvore (`arvore-info`):** fast path síncrono quando `parent.checkConfigValue` já existe, eliminando falso-positivo de erro no `chrome://extensions` por polling desnecessário de `SeiProReady`

## [2.0.0] - 2026-06-30

Versão major de reestruturação interna (**isolated-first** + migração incremental para módulos ESM). O comportamento das funcionalidades existentes foi preservado; a mudança principal é a arquitetura de build e manutenção.

### Adicionado

- **Nova arquitetura de build:** empacotamento com **esbuild** (`scripts/build.mjs`); `src/` como fonte única da verdade e `dist/` apenas como saída gerada
- **Content scripts no mundo isolado** (isolated-first): núcleo (`core-stack`), SEI adapters e plataforma carregados antes dos `init_*.js`
- **Features migradas para ESM** (domain / io / view / bundles dedicados):
  - Processos Monitorados (referência completa da nova arquitetura)
  - Mostrar anotação na tela de controle de processos (`anotacao-controle`)
  - Filtrar a página pelo campo de pesquisa rápida (`quick-filter`)
  - Permitir marcar processos como "Não Visualizado" (`nao-lido`)
  - Controlar Prazos e preview de datas (`controlar-prazos`, `prazo-preview`)
  - Enviar Múltiplos Documentos Externos (`docs-lote`)
  - Informações adicionais na árvore do processo (`arvore-info`, já bundlada)
- **Primitivos vanilla reutilizáveis** em `src/shared/ui/`: modal, sortable, sortable-table, tags-input, prazo-preview
- **CSS por feature** extraído de `sei-pro.css`: `monitorados.css`, `anotacao-controle.css`, `quick-filter.css`, `controlar-prazos.css`, `prazo-preview.css`
- **Página de opções** migrada para `src/options/`; dependência Processos Monitorados ↔ sub-opção delegada a `monitorados-options.bundle.js`
- **Testes unitários** ampliados (domínio, IO, primitivos de UI, guards estruturais de migração)
- **`DEVELOPMENT.md`** reescrito com anatomia de feature, regras de camada e checklist de migração

### Alterado

- Scripts legados fundacionais (`sei-pro.js`, `sei-functions-pro.js`, `init_*.js`, etc.) passaram a viver em `src/` e são copiados verbatim para `dist/js/` até cada feature ser decomposta
- **Opções habilitadas por padrão** na interface (instalação nova / config vazia): Processos Monitorados, Marcar como "Não Visualizado", Enviar Múltiplos Documentos Externos, Informações adicionais na árvore, Filtrar pela pesquisa rápida, Mostrar anotação no controle e Autopreencher senha no login
- Login: fluxo de autopreencher senha alinhado ao bundle `login` e ao mundo isolado
- Anotações no controle: classes renomeadas para prefixo `.seipro-sticknote-*` (BEM)

### Corrigido

- **Controlar Prazos:** erros de sintaxe na extração do CSS para `controlar-prazos.css` e regras órfãs em `sei-pro.css` que quebravam o `display: none` do link de prazo até o hover
- **Opções — Processos Monitorados:** IDs legados (`gerenciarfavoritos` / `favoritesPro_beforeControl`) substituídos pelos nomes atuais; sub-opção volta a esconder/desmarcar ao desligar o master
- **Núcleo:** guards para dependências do mundo MAIN, `reloadModalLink` sem `globalEval` (CSP) e runtime sem fallbacks mortos do mundo MAIN

### Removido

- Pipeline **Vite + CRXJS** (substituído por esbuild; a tentativa anterior minificava legados in-place e destruía a fonte)
- Fluxo de desenvolvimento que editava `dist/` à mão como fonte

## [1.7.17] - 2026-06-17

### Removido

- Reabertura programada de processos:
  - funcionalidade descontinuada (o SEI 4.1+ já oferece o mecanismo nativamente); removidos a opção nas configurações, o botão na barra de comandos, o diálogo de reabertura, os campos no editor de acompanhamento especial, os estilos, o ícone e a documentação relacionados

### Alterado

- Anotações na árvore do processo:
  - o auto-save passou a aguardar 5 segundos antes de salvar, e a posição do cursor agora é preservada ao reconstruir o editor, evitando que o texto pule para o fim após a gravação automática

## [1.7.16] - 2026-06-17

### Removido

- Reabertura programada de processos:
  - funcionalidade descontinuada (o SEI 4.1+ já oferece o mecanismo nativamente); removidos a opção nas configurações, o botão na barra de comandos, o diálogo de reabertura, os campos no editor de acompanhamento especial, os estilos, o ícone e a documentação relacionados

### Alterado

- Anotações na árvore do processo:
  - o auto-save passou a aguardar 5 segundos antes de salvar, e a posição do cursor agora é preservada ao reconstruir o editor, evitando que o texto pule para o fim após a gravação automática

## [1.7.15] - 2026-06-17

### Corrigido

- Visualização de documentos:
  - a biblioteca `jmespath` passou a ser carregada nas páginas de visualização (`arvore_visualizar`, `documento_visualizar` e `arvore_processar_html`), corrigindo o erro `ReferenceError: jmespath is not defined` que ocorria na inicialização (`getDadosProcessoSession` → `insertIconNewTab` → `initSeiProVisualizacao`)
  - `getDadosProcessoSession` ganhou guarda defensiva para retornar sem erro caso o `jmespath` ainda não esteja disponível

- Capa do processo:
  - `setCapaProcesso` deixou de reretentar (20 tentativas) e de emitir o aviso `setCapaProcesso: retry limit reached ... root not selected yet` ao abrir documentos; quando outro nó da árvore está selecionado e a capa não está visível, a função sai sem insistir, eliminando o desperdício de polling e o ruído de log

- Relatório automático de erros:
  - erros opacos de origem cruzada ("Script error." sem mensagem, arquivo ou stack) deixaram de gerar relatórios automáticos vazios e não diagnosticáveis; passam a ser apenas registrados localmente, garantindo que os relatórios enviados contenham informação acionável

## [1.7.14] - 2026-05-25

### Alterado

- Pesquisa rápida:
  - a opção `Filtrar a página pelo campo de pesquisa rápida` passou a vir habilitada por padrão
  - o filtro instantâneo do Controle de Processos foi expandido para considerar mais metadados da linha, incluindo textos vindos de tooltips e atributos auxiliares
  - na tela de processo, a digitação no campo de pesquisa rápida agora destaca ocorrências também na árvore de documentos, nos painéis laterais e no conteúdo HTML visível do frame principal

### Corrigido

- Pesquisa rápida:
  - a reaplicação do highlight passou a normalizar o DOM antes de marcar novamente o texto, corrigindo o caso em que apenas a primeira letra permanecia destacada ao continuar digitando

## [1.7.13] - 2026-05-25

### Alterado

- Processos Monitorados:
  - nomenclatura da funcionalidade atualizada na interface para diferenciar do favorito nativo do SEI
  - títulos do painel ajustados: `Etiqueta` passou para `Marcador` e `Especificação` para `Anotação`
  - tooltips da estrela, ações do painel e tela de configurações alinhados ao novo nome

### Corrigido

- Processos Monitorados:
  - salvamento da anotação e do prazo por `Enter` deixou de depender de `event.path`, evitando erro `Cannot read properties of undefined (reading '0')`

## [1.7.12] - 2026-05-25

### Alterado

- Controle de processos:
  - links de filtro rápido, filtros de seleção e botões de visualização passaram a compartilhar a mesma linha no topo do painel
  - layout da faixa de filtros ajustado para evitar quebra prematura entre os atalhos e os controles de agrupamento
  - barra de rolagem horizontal oculta nessa faixa, preservando o alinhamento visual sem exibir a scrollbar

## [1.7.11] - 2026-05-19

### Corrigido

- Controle de processos:
  - leitura da anotação inline passou a usar o `aria-label` estável do SEI quando disponível, em vez de depender apenas do tooltip montado em string
  - normalização de quebras de linha reforçada para lidar com textos vindos como `\n`, `\r\n` ou escapes literais
  - montagem do tooltip do link de anotação endurecida para não quebrar com aspas, barras e caracteres especiais no texto

## [1.7.10] - 2026-05-14

### Corrigido

- Tela de controle de processos:
  - contadores de `Recebidos` e `Gerados` agora ignoram linhas auxiliares e contam só processos reais
  - a área de anotação inline passou a respeitar o mesmo texto exibido na árvore, sem duplicar contagem nem mostrar `+1`
- Árvore do processo:
  - textos da anotação agora são normalizados ao carregar, corrigindo casos como `extensÃ£o`
  - o fluxo `boot` recebeu a mesma normalização para não depender da ordem de carregamento dos bundles

## [1.7.9] - 2026-05-14

### Alterado

- Árvore do processo:
  - novos atalhos de anotação para inserir, com um clique, os textos "Aguardando a assinatura da chefia imediata" e "Aguardando a assinatura do superintendente"
  - ícones de atalho da anotação aumentados para melhor usabilidade
  - espaçamento ajustado entre a prioridade e os atalhos novos para manter a barra mais legível

## [1.7.8] - 2026-05-14

### Alterado

- Árvore do processo:
  - remoção de marcador ajustada para a tela nova de múltiplos marcadores do SEI
  - remoção de acompanhamento especial alinhada ao fluxo nativo da página do SEI
  - atualização dos botões de remoção para agir apenas no painel lateral da árvore, sem recarregar o frame principal

### Corrigido

- Consoles de desenvolvimento e mensagens de retry excessivas removidos dos fluxos de marcador, acompanhamento especial e capa do processo
- Estabilização dos fluxos de inclusão e remoção de marcador e acompanhamento especial após a adaptação para a estrutura nova do SEI

## [1.7.7] - 2026-05-07

### Alterado

- Painel de Anotação na árvore do processo:
  - movido para o topo do painel lateral, acima de "Atribuição"
  - borda própria e leve sombra para destacar visualmente das demais seções
  - ícones de edição maiores (15pt) com hover suave para facilitar o clique
  - quando a anotação está marcada como prioridade, o painel fica num tom levemente avermelhado para chamar atenção mesmo sem ler o texto
  - duplo clique no texto entra em modo de edição com o cursor onde foi clicado

### Corrigido

- Botão de checklist (☐/☑) na anotação não respondia ao clique: agora a toolbar salva e restaura a seleção do editor antes de alternar a linha, evitando cliques sem efeito, e os checkboxes são desenhados também na nova UI (regras CSS para `stickNoteCheck`/`stickNoteChecked` que antes só funcionavam no painel antigo)
- Capa com os dados da raiz do processo na visualização: montagem agora faz retentativa curta até os dados do processo e a seleção da raiz estarem prontos, reduzindo casos em que a seção aparecia só às vezes ao abrir a tela
- Capa do processo reestruturada para usar botões semânticos e listeners diretos, reduzindo dependência de `onclick` inline e melhorando a acessibilidade dos itens clicáveis
- Bloco informativo da capa agora é clonado do DOM do SEI em vez de ser reserializado como string, reduzindo risco de mojibake em rótulos e preservando melhor o markup original
- Marcador passou a atualizar só o cache/capa e a seção lateral correspondente, sem reinicializar o frame principal do processo
- Atribuição passou a salvar via frame oculto e atualizar só os caches locais, sem recarregar o frame principal visível

## [1.7.6] - 2026-05-07

### Alterado

- Árvore do processo (Informações adicionais):
  - reescrita do bootstrap: detecção determinística por `target="ifrVisualizacao"` em vez de heurísticas baseadas no nome do SVG do ícone (resolve casos em que o painel não carregava em variantes do SEI da PRF)
  - boot tolerante a falhas: nunca aborta quando o frame pai não responde — degrada para um stub silencioso e o painel ainda monta
  - detecção precoce de contexto fora da tela "trabalhar" para evitar 2,5s de polling em frames irrelevantes
  - cache de páginas com TTL de 60s, observador único de mutação debounçado por animation frame, e watcher de diálogo de edição via `MutationObserver` em vez de `setInterval`
  - "Personalizar Menu" volta a funcionar: a seleção de seções a exibir (Atribuição, Marcador, Interessados, Anotação, Acompanhamento Especial, Tipo de Processo, Nível de Acesso, Assuntos, Observações) é respeitada de novo; seções desativadas pulam fetch e DOM

### Corrigido

- Painel lateral da árvore que ocasionalmente "não carregava completamente": logs claros agora identificam cada caminho de degradação, e o boot deixa de abortar silenciosamente

### Removido

- Código legado morto em `sei-pro-arvore.js` (~408 linhas): `setDadosProcessoArvore`, `getDataMarcadorProcesso`, `initDadosProcessoArvore`, `initDadosProcessoArvoreSession`, `stylePanelArvore`, `initStylePanelArvore` e a chamada órfã correspondente em `sei-functions-pro.js`

### Interno

- Renomeado `sei-pro-arvore-boot.proto.js` → `sei-pro-arvore-boot.js` (deixou de ser protótipo, é a implementação canônica)
- Adicionados helpers `seiProArvore.{isProcessNode,isDocumentNode,getNodeIdProc,getNodeWrapper}` em `sei-functions-pro.js` como fonte única de verdade para identificação de nós da árvore
- Logs estruturados auto-reportáveis: novo helper `report(reason, detail)` que sempre inclui contexto (URL, frame, ID do procedimento) e dispara o auto-report já existente. Documentação em `docs/logging.md` define a convenção para o resto da extensão

## [1.7.5] - 2026-04-22

### Alterado

- Documentação pública revisada para publicação externa do fork:
  - README alinhado ao branding da PRF e ao fluxo real de reporte de bugs
  - política de privacidade reescrita para refletir armazenamento local, integrações opcionais e bloqueio de reporte fora da PRF
  - texto-base preparado para a Chrome Web Store em `STORE_LISTING.md`
- Identidade visual e reporte:
  - descrição pública ajustada para deixar claro que o logo da PRF é aplicado apenas no ambiente da PRF
  - esclarecimento de que o reporte técnico só funciona em `sei.prf.gov.br`

## [1.7.4] - 2026-04-17

### Alterado

- Favoritos:
  - sincronização automática dos dados do processo ao atualizar a sessão
  - espera assíncrona centralizada para carregar e atualizar favoritos com mais consistência
  - atualização em tempo real do item favorito quando os dados do processo mudam
- Processo e interface:
  - carregamento inicial mais resiliente quando dependências como `checkHostLimit` e `loadFunctionsPro` ainda não estão prontas
  - tratamento mais seguro ao acessar `ifrArvore` e recarregar conteúdo associado
  - melhorias de semântica HTML e atributos de formulário em telas de favoritos, projetos e opções
  - refinamentos internos para manter o código mais consistente e fácil de manter

### Corrigido

- Editor de revisão:
  - botões dependentes de `CKWebSpeech` agora ficam desabilitados quando a função não está disponível
- Processo e armazenamento:
  - melhoria no tratamento de timeout e validação de dados ao carregar informações do processo
  - correção de erros opcionais ao lidar com arquivos ausentes no filesystem interno
  - redução de falhas ao recarregar a árvore e ao executar ações em lote
- Controle de processos:
  - carregamento dos dados de processo mais robusto ao montar seleções e favoritos

## [1.7.3] - 2026-04-16

### Adicionado

- Controle de processos:
  - opção para notificar quando surgirem novos processos não visualizados
  - badge no ícone da extensão com a contagem atual de processos não visualizados
  - notificação nativa do navegador quando a contagem de processos não visualizados aumentar
  - opção para indicador global de blocos de assinatura pendentes
  - badge no menu de Blocos > Assinatura com a contagem atual de blocos pendentes de assinatura
  - opção para filtro por atribuição no Controle de Processos
  - seletor dedicado para exibir processos atribuídos a um usuário específico ou sem atribuição
  - opção para filtrar instantaneamente a página pelo campo de pesquisa rápida do topo
  - suporte inicial ao Controle de Processos, pesquisando em todos os campos visíveis de cada linha sem exigir `Enter`
  - highlight instantâneo das ocorrências nas demais telas, com tolerância a acentos, maiúsculas/minúsculas e múltiplas palavras independentes
  - opção para atalho de Publicações Eletrônicas na barra de ações do processo/documento
  - criação automática do botão quando a ação nativa `publicacao_agendar` estiver disponível na tela
  - opção para seleção inteligente dentro do bloco de assinatura
  - atalhos para selecionar todos, nenhum, documentos sem assinatura, sem minha assinatura e com minha assinatura dentro do bloco de assinatura

### Referências

- Registro de proveniência adicionado em `THIRD_PARTY_NOTICES.md` para a reimplementação funcional inspirada no projeto `jonatasrs/sei` (`SEI++`)

## [1.7.2] - 2026-04-16

### Adicionado

- Controle de processos:
  - opção para editar anotação diretamente na visualização resumida
  - popover inline para criar, editar e remover anotação sem sair da página
  - suporte a checklist, prioridade e inserção rápida de data na anotação
  - opção para notificar quando surgirem novos processos não visualizados
  - badge no ícone da extensão com a contagem atual de processos não visualizados
  - notificação nativa do navegador quando a contagem de processos não visualizados aumentar

### Alterado

- Controle de processos:
  - refinado o posicionamento e o espaçamento da anotação exibida na visualização resumida
  - processos sem anotação deixaram de exibir placeholder visual na coluna da anotação

### Corrigido

- Árvore do processo:
  - texto do tooltip do botão de erro corrigido
- Editor inline de anotação na visualização resumida:
  - correção de encoding em textos como “Anotações”, “Salvar Anotação” e “Remover Anotação”
- Menu do sistema:
  - estabilização adicional do clique no botão `Menu`

## [1.7.1] - 2026-04-16

### Adicionado

- Reformulação da tela de opções:
  - busca de configurações
  - reorganização visual em abas por área funcional
  - retorno para a home do SEI após salvar
- Novas opções em Controle de Processos:
  - mover favoritos para cima do controle de processos
  - ocultar paginação superior dos processos

### Corrigido

- Upload múltiplo na árvore de documentos:
  - prevenção da abertura do arquivo em nova aba ao arrastar para a árvore
  - encaminhamento correto dos arquivos para o fluxo de upload
- Painel de informações adicionais na árvore:
  - restauração da inicialização do painel
  - correção da carga de anotação na árvore
  - fallback mais robusto para localizar a URL da anotação
- Anotação direta na árvore:
  - confirmação inline para remover anotação com joinhas, sem modal
  - remoção do texto relativo de tempo no cabeçalho da anotação
- Favoritos:
  - compatibilidade melhor com `ifrConteudoVisualizacao` e `ifrVisualizacao`
  - coleta de dados do processo via fluxo AJAX específico para favoritar
  - tolerância a dados parciais ao montar o item favorito
- Tooltip do botão de reporte:
  - correção de encoding em “sugestão”
- Controle de processos:
  - correção do retry indevido em `insertGroupTable()` quando agrupamento e remoção de paginação estão desativados
  - aplicação segura da opção de ocultar paginação superior
- Menu do sistema:
  - clique mais estável no botão `Menu`, reduzindo casos de necessidade de duplo clique

## [1.7.0] - 2026-04-10

### Adicionado

- Sistema de reporte de bugs e sugestões diretamente pelo SEI, via Google Apps Script, sem expor e-mail do administrador:
  - Ícone de bug permanente na barra do SEI (pulsa quando erro é detectado automaticamente)
  - Formulário com seletor de tipo (bug / sugestão) e campo de descrição
  - Captura de tela opcional antes do envio
  - Relatório enviado por e-mail ao administrador e salvo em planilha Google Sheets
  - Configurável via `APPS_SCRIPT_URL` em `sei-pro-atividades.js`
- Suporte a **Ollama** (IA local) no módulo de ferramentas de IA (`sei-pro-ai.js`):
  - Integração com modelos locais: llama3.2, llama3.1, mistral, phi3, gemma2
  - Configuração de URL e modelo por perfil
  - `loadAIPromptsToStorage()`: salva system instructions e prompts customizados via `chrome.storage.sync`
  - Ícone do Ollama (`icons/menu/ollama.svg`)
- **`background.js`** (service worker): abre página de boas-vindas na instalação e histórico de versões nas atualizações

### Corrigido

- Race condition em `init.js`: `sei-pro.js` agora só carrega após `sei-functions-pro.js` estar pronto (`seiProFunctionsLoaded_init`), corrigindo o erro `checkHostLimit is not defined`
- `moment-duration-format.min.js` agora carrega dentro do `.done()` do moment, evitando erro de dependência

### Alterado

- Nome da extensão: **SEI Pro Lab** → **SEI Pro PRF Dev**
- Versão: `1.6.2` → `1.7.0`
- Permissão `tabs` adicionada ao manifest (necessária para o `background.js`)
