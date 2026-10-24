# Módulo "Processo" em TypeScript: painéis, menu do documento, capa, histórico em Gantt

Data: 23/10/2026. Estado: rascunho para aprovação do autor. Escopo: reescrever do zero, em TS, tudo o que o SEI Pro desenha em volta da árvore de um processo.

## 1. Intenção e motivo

Hoje, ao abrir um processo, os painéis abaixo da árvore (Atribuição, Marcador, Anotações, Acompanhamento Especial, Descrição, Tipo, Nível de acesso, Interessados, Assuntos, Observações, Bloco Interno) às vezes aparecem e às vezes não. O autor quer que tudo carregue rápido e sem erro. A causa não é um bug isolado, é a arquitetura do legado (`dist/js/sei-pro-arvore.js` e `sei-functions-pro.js`):

- Quase todos os dados vêm de um iframe oculto (`#frmCheckerProcessoPro`) que recarrega o processo inteiro uma segunda vez e é consultado a cada 500 ms, sem limite de tentativas. O mesmo iframe serve a cinco operações de gravação, e duas simultâneas derrubam os handlers uma da outra.
- A função que desenha os painéis (`setDadosProcessoArvore`) espera cerca de 5 s e desiste em silêncio. A cada chamada apaga e recria todos os painéis, e há cinco chamadores, então o resultado visível depende de quem termina por último.
- Quase nenhuma consulta trata falha (anotações, marcador, acompanhamento, atribuição, andamento). O spinner fica para sempre ou o painel não aparece, sem aviso.
- Há dependências ocultas: os painéis só funcionam se o "menu rápido" estiver ligado (`selectedItensPanelArvore`), e parte da inicialização testa `typeof parent.X` uma única vez, antes de `sei-pro-favoritos.js` e `sei-pro-atividades.js` terem chegado.
- A gravação assume sucesso assim que o iframe carrega, sem conferir o resultado.

A reescrita também é a chance de entregar o que o autor pediu de novo: menu do documento, capa com cards de estatística, histórico de tramitação em Gantt, e algumas funcionalidades novas.

## 2. Objetivos

1. Painéis abaixo da árvore que carregam rápido e de forma previsível, cada um independente dos outros, com estados explícitos (carregando, pronto, erro com nova tentativa, desatualizado).
2. Manter a proposta atual: botões que abrem modais e executam as ações (editar atribuição, marcador, acompanhamento, anotação, etc.).
3. Menu que abre ao passar o mouse sobre um documento, refeito.
4. Capa do processo refeita, com uma faixa de cards de estatística no topo.
5. Modal "Histórico de tramitação" em Gantt, refeito.
6. Cinco funcionalidades novas (seção 6).
7. Mesma stack dos módulos novos (histórico, favoritos, projetos, demandas): pacote TS próprio, `@nucleo` e `@comum`, DOM seguro, só ASCII nos bundles.

## 3. Fora do escopo e antiobjetivos

Fora do escopo:
- Painel de Atividades e barra de prescrição (dependem do servidor externo de atividades). O módulo deixa um ponto de encaixe e o legado continua desenhando esses dois.
- Manifests oficial e Firefox. Entrega só no Lab MV3 (`dist/manifest.json`), como foi com favoritos, histórico e projetos.
- Opções (tela de configuração). Reaproveitar as chaves existentes; o redesenho da tela de opções é outro projeto.
- Release, `pages/HISTORICO.md` e push: só quando o autor pedir.

Antiobjetivos (seria falha mesmo funcionando):
- Buscar a árvore de processo aberto na unidade (`procedimento_visualizar`, `arvore_montar`, `procedimento_atribuicao_cadastrar`). Isso grava "Processo recebido" em nome do usuário. O módulo só lê a árvore que o frame já tem na tela (`lerArvore(paginaDe(document))`). O `build.mjs` deve reprovar esses endereços no código que roda na página, como o do `projetos/` já faz.
- Montar links do SEI à mão (derruba a sessão): colher com `linkDaAcao`/`linksAssinados`, abrir processo com `abrirProcesso`.
- Perder a personalização do usuário: manter nomes de opções e chaves de configuração do menu e dos painéis.
- Mexer no estado do histórico do SEI de forma que o "Consultar Andamento" nativo fique vazio ou paginado depois da coleta.
- Tocar processo sigiloso: não guardar nem consultar especificação, interessados ou assuntos, e não coletar histórico (o legado já retorna cedo).

## 4. Decisões já tomadas pelo autor

Painéis (escolha A, "lista refinada"): a mesma lista vertical de hoje, com cada seção independente. Cada seção tem cabeçalho com ícone, ações à direita (editar, remover, recolher), esqueleto enquanto carrega, e erro com "Tentar de novo". Ordem final e persistência de aberto/fechado preservadas.

Capa (escolha A): faixa de cards no topo, dados cadastrais logo abaixo. Cards que dependem só da árvore (documentos, internos e externos, assinados, cancelados) aparecem na hora. Cards que dependem do histórico completo (unidades por onde passou, tempo na unidade atual, tempo total, tramitações) aparecem tracejados com "Calcular" e são gerados por demanda.

Menu do documento (escolha A): menu vertical agrupado em Copiar, Abrir e Ações. Só aparecem os itens que o SEI oferece para aquele documento.

Gantt (escolha B): uma raia por unidade, com uma barra por passagem (rótulo com contagem, "GPF 3x"), losangos nos documentos gerados, barra listrada para passagem em curso.

Escopo: todas as cinco funcionalidades novas entram (seção 6). Ordem de entrega: seção 7.

## 5. Arquitetura

### 5.1 Pacote e carregamento

- Pacote novo `processo/` (nome proposto; ajustável), no molde do `historico/` (`modelo/` sem DOM, `pagina/`, `app/` só se algum modal precisar de iframe, `tests/`). Alias `@nucleo` e `@comum`.
- Content scripts no `dist/manifest.json`, `all_frames`, mundo isolado. Dois pontos de entrada, escolhidos pelo tipo de frame detectado no DOM:
  - quadro da árvore (`#ifrArvore`): painéis, menu do documento, filtro da árvore;
  - quadro do visualizador (`#ifrVisualizacao`): capa e cards (a capa legada vive no `#divArvoreHtml` do visualizador).
- Os dois frames não compartilham memória. Compartilham o cache em `chrome.storage` (leitura e `onChanged`), e usam mensagem entre frames só quando precisarem avisar "dados prontos".
- O legado cede por atributo no `<html>`, um por peça (`data-seipro-processo-paineis`, `-menu`, `-capa`, `-gantt`), marcado de forma síncrona em `document_start`, para cada etapa poder ceder sem desligar as outras. Reaproveitar as opções existentes (`infoarvore`, `menurapido`, `historicoproc` etc.); novas opções só para as funcionalidades da seção 6.
- Não haver acoplamento com o menu rápido: nenhum painel pode depender de `selectedItensPanelArvore`.

### 5.2 Camada de dados do processo (peça central da etapa 1)

- Uma "loja do processo" por `host|login|idProcedimento`. Cada fatia de dado tem estado: `carregando | pronto | erro | desatualizado`, com carimbo de hora.
- Fatias (cada uma independente, buscada em paralelo, com tentativa automática limitada e depois erro visível): `dadosProcesso` (tipo, descrição, assuntos, interessados, nível de acesso, hipótese legal, observações), `anotacao`, `marcador`, `acompanhamento`, `atribuicao`, `relacionados`, `blocoInterno`.
- Fontes, em ordem de preferência: (1) a própria página da árvore, sem rede (atribuição e ações em `Nos[0]`, prazo nativo em `infraArvoreAcao("CONTROLEPRAZO"...)`); (2) leituras diretas pelo `Http` do núcleo (`consultarDaArvore`, `marcadoresDoProcesso`, etc. já existem); (3) nenhuma outra. Sem iframe oculto.
- Cache em `chrome.storage.local`, uma chave por processo, teto de entradas e de bytes. Ao abrir o processo, pinta o cache na hora e atualiza em segundo plano, marcando a fatia como `desatualizado` até confirmar. A escrita do cache é tolerante a cota cheia.
- Escrita: pelo `Formulario` do núcleo (`aplicar:true`, prova de sucesso exigida). A fatia só vira `pronto` depois que o SEI confirma, e só o painel afetado é redesenhado. Falha mostra erro com a mensagem do SEI e mantém o valor anterior.
- Concorrência: uma fila por processo para gravações (nunca duas ao mesmo tempo no mesmo formulário). Leituras em paralelo respeitam o limite de concorrência do `Http` (3).
- Redesenho: cada painel observa só a sua fatia. Nada de "apagar tudo e recriar".
- Dependência de ordem: nenhuma. Os painéis esperam a árvore por `MutationObserver` com prazo e, se a árvore recarregar (o iframe recarrega), remontam sozinhos.

### 5.3 Leitor de andamentos (núcleo)

- `sei-nucleo/src/dominio/historico.ts` ganha: data em ISO, `nrSei` e `idDocumento` por linha (hoje só o legado extrai de `a.ancoraHistoricoProcesso`), `hash` dos critérios e total de registros.
- Cache incremental: se `hdnInfraHashCriterios` é o mesmo e o total só cresceu, busca só os andamentos novos da primeira página e confere os 10 mais recentes por `datahora|unidade|usuario|descricao` (comportamento do legado, `atualizarCacheHistoricoPro`).
- Uma coleta por vez por processo, com chamadores que chegam durante a coleta esperando o mesmo resultado. Progresso informado ("página 7 de 34").
- Pendência de verificação ao vivo (seção 9): a coleta altera tipo e página do histórico na sessão do SEI. O legado mede e documenta que o "Consultar Andamento" aberto depois sai vazio ou paginado e por isso restaura; o README do núcleo diz que restaurar é desnecessário. A implementação deve começar medindo isso nos dois SEIs de teste e só então decidir se restaura.

### 5.4 Menu do documento

- Fonte dos itens: `lerArvore` já entrega `acoes` e `botoes` por documento, sem a requisição de `arvore_visualizar` que o legado faz ao abrir cada menu. O menu mostra apenas o que o SEI oferece.
- Identificar a ação pelo endereço (`acao=...`), nunca pelo texto do rótulo.
- Itens locais sempre presentes: copiar número SEI, nome, link, "nome com link", "número com link" (respeitando `citacaodoc`), duplicar (com a pergunta "remover MINUTA"), copiar para.
- Itens condicionados ao SEI: abrir em nova aba, baixar, imprimir web, consultar, incluir em bloco, cancelar, versões, circular, assinatura externa, excluir, editar, assinar, favoritos, ciência, e-mail, mover, intimação.
- Hover por padrão, clique se "Ativar menu ao clicar". Preservar as chaves `configViewFlashDocMenuPro` e `optionsFlashMenu_menudoc`. Os ícones fixos da árvore (`configViewFlashDocArvorePro`) e o menu do nó do processo seguem o mesmo mecanismo.
- Seletor do âncora do documento difere entre SEI 4.0 (`a.clipboard[id*=anchorImg]`) e SEI 5 (`a[id*=anchorImg][data-serialtip]`); a leitura da árvore deve tratar os dois, mais o 4.1.
- Teclado e foco: abrir com foco no item, Esc fecha, setas navegam; `aria-label` em vez de `title` (o Estilo Avançado converte `title`).

### 5.5 Capa e cards

- Cards da árvore (instantâneos), a partir de `lerArvore`: total de documentos, internos x externos, assinados x total, cancelados, sigilosos, pastas.
- Cards do histórico (por demanda, botão "Calcular", e automáticos quando o histórico completo já está em cache): unidades por onde passou, número de tramitações, tempo em cada unidade, tempo total, tempo na unidade atual, quem gerou e quem assinou (quando disponível).
- A capa para de se redesenhar a cada 1,5 s (o módulo do agente já documenta essa armadilha em `agente-ia/src/ponte/capa.ts`); passa a reagir a mudança de seleção e de dados.
- Campos preservados: histórico de tramitação (link), número do processo com copiar número e link, autuação, tipo, especificação (destaque para URGENTE), assuntos, interessados, nível de acesso com hipótese legal, marcador com prazo, bloco interno, observações, QR code.
- Fonte dos campos cadastrais: a mesma loja do processo da seção 5.2.

### 5.6 Histórico em Gantt

- Modal no padrão `dialog.spro-dialogo` (sem botão Cancelar), aberto pelo link da capa e pelo atalho do painel.
- Modelo de passagem por unidade: entrada em "Processo recebido na unidade" (ou "Processo ... gerado" para a primeira); fim na próxima "Processo remetido pela unidade X" posterior à entrada, ou em "Conclusão do processo na unidade"; sem fim = em curso (barra listrada). "Reabertura do processo na unidade" abre uma nova passagem (o legado ignora).
- Parear remessa pela unidade pelo identificador, não só pela sigla, quando o HTML do histórico o fornecer; e tratar remessa para várias unidades e siglas repetidas. Rótulos em português são strings fixas: concentrar numa tabela única com testes para os SEIs 4.1.5 e 5.0.4.
- Desenho: SVG próprio (decisão minha, ver seção 8), uma raia por unidade, barra por passagem, losango por documento gerado (clique abre visualização rápida), rótulo da raia com contagem, escalas Dia, Semana e Mês, tooltip com quem recebeu, quem enviou, datas, duração e documentos. Sem `innerHTML`.
- Sem biblioteca externa, sem `jmespath`: o pareamento é código tipado e testado.

## 6. Funcionalidades novas (todas no escopo)

1. **Alerta de processo parado:** card "Na unidade atual" ganha destaque quando passa de N dias (N configurável, padrão proposto 15, decisão minha). Usa o histórico completo (cache) ou a data de recebimento já registrada pelo legado (`configDataRecebimentoPro`) quando o histórico ainda não foi coletado.
2. **Filtro da árvore:** chips para mostrar só não assinados, externos, cancelados, e busca por nome/número. Opera sobre `lerArvore`, sem rede, e só esconde nós (não altera a árvore do SEI). Estado do filtro por processo, não persistente por padrão.
3. **Copiar resumo do processo:** botão na capa que copia texto pronto (número, tipo, interessados, situação, unidade atual, dias na unidade, contagem de documentos). Em processo sigiloso, copia só o número.
4. **Exportar histórico:** CSV (`gerarCsv` do `@comum`) da tabela de passagens (unidade, recebido, enviado, duração, documentos) e visão para impressão. O CSV começa com BOM e usa ponto e vírgula, para o Excel em português.
5. **Comparativo de tempo por unidade:** no modal do Gantt, aba/seção "Tempo por unidade" com tempo total por unidade, percentual do tempo total e número de passagens, ordenado do maior para o menor.

## 7. Ordem de entrega (cada etapa vira um plano e pode ser publicada no Lab sozinha)

1. **Base e painéis.** Loja do processo, leituras e gravações, painéis da seção 5.2, cessão do legado por `data-seipro-processo-paineis`. Critério: nenhum painel some em 20 aberturas seguidas de processos diferentes, em ambos os SEIs de teste, com e sem cache, e com o menu rápido desligado.
2. **Menu do documento** (seção 5.4).
3. **Leitor de andamentos no núcleo e Gantt** (seções 5.3 e 5.6), incluindo exportar histórico e comparativo de tempo (funcionalidades 4 e 5).
4. **Capa e cards** (seção 5.5), incluindo alerta de parado e copiar resumo (funcionalidades 1 e 3).
5. **Filtro da árvore** (funcionalidade 2), que é independente e entra por último porque depende só do `lerArvore`.

## 8. O que fica a cargo de quem for construir

- Nome e estrutura exata do pacote, forma do armazenamento (chaves, teto), detalhes dos estados e do tempo de nova tentativa.
- Formato dos modais de edição (reaproveitar `criarAbrirModal`; manter os campos e a lógica de cada edição do legado: marcador com prazo e texto, acompanhamento com grupo, atribuição com lista, anotação com checklist, prioridade e data, interessados, assuntos, observações).
- Escala e interação do Gantt (zoom, rolagem), cores por unidade, acessibilidade.

Minhas decisões, para o autor conferir: SVG próprio em vez da frappe-gantt; reabertura vira nova passagem; N=15 dias para o alerta; nome `processo/`; CSV com BOM e ponto e vírgula; filtro da árvore sem persistência por padrão.

## 8.1 Esclarecimentos da revisão (decisões minhas, salvo indicação)

- **Cessão do legado.** Os atributos `data-seipro-processo-*` não existem hoje: a etapa 1 inclui acrescentar guardas pequenas no legado (`sei-pro-arvore.js` e `sei-functions-pro.js`), uma por peça, como o histórico e os favoritos fizeram. Painéis: guarda em `initDadosProcessoArvore`/`setDadosProcessoArvore` e na criação do iframe oculto (`initDadosProcesso`). Atividades e prescrição seguem no legado; o ponto de encaixe é um contêiner vazio `[data-spro-slot="atividades"]` posicionado no lugar certo, que o legado preenche.
- **Leituras no núcleo.** Já existem: metadados do processo (`consultarDaArvore`: um GET do formulário `procedimento_alterar`/`procedimento_consultar`, o mesmo que o legado usa e que não grava "recebido"), marcadores (`marcadoresDoProcesso`) e as gravações de anotação, atribuição, acompanhamento e marcador. Faltam e entram na etapa 1: leitura da anotação atual, do acompanhamento especial, do nível de acesso e da hipótese legal em `consultarDaArvore`, dos relacionados e do bloco interno. Atribuição e ações vêm da página, sem rede. Se alguma leitura exigir endereço que grava "recebido", a fatia fica de fora e vai para o legado, em vez de usar o iframe oculto.
- **Sigiloso.** Detectar pela página da árvore, sem rede. Os painéis de Descrição, Interessados, Assuntos e Observações não aparecem nem entram no cache. Atribuição, Marcador, Anotação e Acompanhamento aparecem, porque o usuário já os vê na tela, mas sem cache persistente. Capa: só número, tipo, nível e cards da árvore. Sem coleta de histórico.
- **Versões do SEI.** Alvo: 4.1.x e 5.x, com os ambientes de teste 4.1.5 e 5.0.4. O SEI 4.0 não é alvo; os seletores dele no legado podem ser mantidos, mas sem garantia nem teste.
- **Desempenho.** Metas: com cache, painéis pintados em até 300 ms depois da árvore estar pronta; sem cache, cada painel em até 2 s num SEI normal, sem bloquear os outros; capa e cards da árvore em até 300 ms. Medir nos dois SEIs de teste.
- **Dois frames.** O frame da árvore é o único dono da escrita da loja (leituras e gravações). O frame da capa só lê o cache e reage a `chrome.storage.onChanged`; se a fatia estiver ausente ou velha, pede por mensagem à árvore em vez de buscar por conta própria.
- **Chaves antigas.** O módulo novo usa chaves próprias (`processo/...`). Só lê, sem gravar, `configDataRecebimentoPro` (alerta de parado) e as chaves de configuração do usuário. Não reaproveita os caches do legado.

## 8.2 Decisão do autor sobre o histórico completo

A coleta do histórico completo só começa quando o usuário clica ("Calcular" nos cards ou abrir o Gantt). Depois de uma coleta, o resultado fica em cache por um período curto (proposta minha: 30 minutos, a confirmar na construção); dentro desse período, os cards do histórico e o Gantt abrem sem nova coleta e podem aparecer automaticamente na capa. Fora dele, voltam ao estado "Calcular". A atualização reaproveita o cache incremental (seção 5.3). Nenhum recurso novo coleta histórico sozinho; o legado continua coletando só onde já coleta, até a respectiva etapa ceder.

## 9. Verificação e riscos

- Testes: `npm run verificar` no pacote (tsx + linkedom) para modelo, loja, pareamento do Gantt e cálculo dos cards; fixtures reais dos SEIs 4.1 e 5 já existem em `sei-nucleo/tests/fixtures`. O linkedom não simula `<dialog>` modal nem a fase de captura de eventos: o que depender disso se prova ao vivo.
- Ao vivo: SEI SP de treinamento (4.1.5, CK4) e MJ homologação (5.0.4, CK5; `sei.mj.gov.br` é produção, nunca usar). Perfil limpo lê toda opção como desligada, então ligar pelas opções antes. Reinstalar a extensão depois de cada build.
- Riscos: (a) o restauro da paginação do histórico (seção 5.3); (b) processo com milhares de andamentos (dezenas de POSTs): mostrar progresso e permitir cancelar; (c) diferença de seletores entre SEI 4.0, 4.1 e 5; (d) cota do `chrome.storage.local` dividida com Favoritos e Agente; (e) o frame do visualizador e o da árvore não compartilham memória; (f) cada coleta completa de histórico muda estado na sessão do SEI para todas as abas do usuário.
- Portões de build herdados: sem `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`on*=`, só ASCII, teto de tamanho do carregador, e os endereços proibidos do antiobjetivo.
- Trabalhar numa worktree própria (o repositório tem várias; duas sessões no mesmo clone se atropelam) e adicionar arquivos por caminho, nunca `git add -A`.
