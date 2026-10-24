# processo

Painéis abaixo da árvore, menu do documento, capa com cards e Gantt de tramitação, em TypeScript.
Desenho: `docs/superpowers/specs/2026-10-23-processo-design.md`; plano: `docs/superpowers/plans/2026-10-24-processo.md`.

## Estado

Etapa 1 (base e painéis) e etapa 2 (menu da árvore) concluídas e testadas ao vivo no SEI SP de treinamento (4.1.5).
Capa, Gantt e filtro da árvore são das etapas seguintes.

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

- Assuntos: sem edição (o `alterarProcesso` do núcleo não escreve assuntos). Interessados: só retirar; incluir exige a busca
  de contatos. A pesquisa "processos do interessado" do legado (iframe oculto) não foi portada.
- Nível: define público e restrito; o sigiloso não se define por aqui (o núcleo não opera processo sigiloso, então no
  sigiloso nenhuma edição aparece).
- Processos Relacionados continua o elemento nativo estilizado pelo legado (`stylePanelArvore`).
- Marcador: a lista de escolha ainda não mostra o ícone de cada marcador.
- Bloco Interno: depende da Etapa 3 (coleta do histórico).
- A capa legada só atualiza a especificação, o nível e o marcador depois de uma edição na próxima carga (o `dadosProcessoPro`
  dela vem do iframe oculto); a capa nova (Etapa 4) lê a mesma loja.
- Só o SEI SP (4.1.5) foi exercitado ao vivo; o MJ 5.0.4 ainda não.

## Comandos

```
npm run tipos       # tsc --noEmit
npm run verificar   # testes (tsx + linkedom)
npm run build       # verificar + build.mjs (pula entradas que ainda não existem)
```

O `build.mjs` reprova, no código que roda na página, `innerHTML` & cia e os endereços que gravam
"Processo recebido" (`procedimento_visualizar`, `arvore_montar`, `procedimento_atribuicao_cadastrar`).
