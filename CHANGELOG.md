# Changelog — SEI Pro PRF

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
