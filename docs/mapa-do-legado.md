# Mapa do legado do SEI Pro

Data: 20/11/2026 (branch `master` após o Comparador de Documentos em TS, versão em preparação 3.9.5).

Este documento diz **o que já foi refatorado para a stack TypeScript** e **o que ainda roda no código legado** (JavaScript com jQuery, em `dist/js/`), com o tamanho de cada pedaço, as dependências que impedem removê-lo e uma ordem sugerida para as próximas refatorações.

## Como este mapa foi feito (e o que ele não garante)

- Contagem de funções top-level por arquivo legado, agrupadas por palavras do nome. É heurística: um nome pode cair no grupo errado, e os números são aproximados.
- Cruzamento com `tools/fora-do-escopo.json` (funções com substituto TS), `processo/README.md` ("O que sobra no legado"), `init.js` (o que carrega o quê) e os manifests.
- Os nomes das funcionalidades vêm das páginas de ajuda (`pages/*.md`). Onde o item está marcado **(confirmar)**, a associação com o código foi feita só pelo nome da página, não lendo o código.
- Os manifests de marca (`dist/manifest_*.json`, ignorados pelo git) estão defasados e não foram usados como fonte; vale só `dist/manifest.json` (Lab, 3.9.4).

## 1. Já refatorado (pacotes TS)

Cada pasta tem `src/`, `tests/` e build próprio; compartilham `sei-comum` (UI, ponte, armazenamento, sincronia) e `sei-nucleo` (leitura e escrita no SEI).

| Pacote | Funcionalidade |
|---|---|
| `favoritos` | Favoritos / Monitorados |
| `projetos` | Projetos (Gantt, entregas, compartilhamento) |
| `demandas` | Demandas |
| `prazos` | Prazos |
| `documentos-lote`, `processos-lote`, `acoes-lote` | Documentos, Processos e Ações em lote |
| `comparador-documentos` | Comparador de Documentos (diff em duas fases, em Web Worker) |
| `historico` | Histórico de processos visitados |
| `link-permanente` | Link permanente e pesquisa |
| `pesquisa-rapida` | Pesquisa rápida |
| `anotacoes-controle` | Anotações do Controle de Processos |
| `grade-controle` | Grade do Controle de Processos |
| `menu-suspenso`, `ordem-paineis` | Menu suspenso, ordem dos painéis |
| `estilo-avancado` | Estilo avançado 2 |
| `blocos-assinatura` | Blocos de assinatura |
| `processo` | Capa, painéis, filtro da árvore, menu rápido, Gantt de tramitação, título e aviso |
| `agente-ia` | Agente de IA (inclui MCP, fluxos, backup) |
| `ferramentas-pdf` | Ferramentas de PDF |
| `opcoes-pagina` | Página de opções |

## 2. Ainda no legado

Tamanho = linhas do arquivo em `dist/js/`; "restantes" = funções que **não** têm substituto TS segundo `fora-do-escopo.json`.

### 2.1 Editor de documentos (maior bloco com uso visível)

- Arquivos: `sei-pro-editor.js` (2,5 mil linhas, 77 funções), `sei-pro-editor-adapter.js` (1,1 mil), CKEditor em `lib/ckeditor` e `modules/editor/`, mais ~19 funções em `sei-functions-pro.js`.
- Opções que ele lê: teclas de atalho (`teclasatalho`, `combinacaoteclas`), ditado, editar imagens, qualidade de imagens, editar links, revisão de texto, salvamento automático, substituir seleção.
- Funcionalidades (páginas de ajuda): Revisar documento, Ditado, Teclas de atalho, Escrita interativa **(confirmar)**, Equações **(confirmar)**, Tabela rápida e Estilo de tabela **(confirmar)**, Parágrafos numerados **(confirmar)**, Quebra de página e de seção **(confirmar)**, Sumário **(confirmar)**, Referências, Referência interna e Citações **(confirmar)**, Nota de rodapé, Editar imagens, Qualidade das imagens, Redimensionar imagens, Substituir seleção, Salvamento automático, Copiar formatação **(confirmar)**, Alinhar texto **(confirmar)**, Letra maiúscula **(confirmar)**, Link curto **(confirmar)**, Campos dinâmicos.
- Observação: o port para CK5 está em andamento (falta, por exemplo, `setParamEditor`); a cadeia `dadosProcessoPro` ainda é lida por `arrayDadosEditor`/`replaceDadosEditor` (ver 2.9).

### 2.2 Atividades (modo servidor)

- Arquivo: `sei-pro-atividades.js` — **27 mil linhas, 495 funções, nenhuma com substituto TS**. É o maior arquivo do repositório.
- Conteúdo (por nome): Kanban e Gantt de atividades (~205 funções), configuração e sincronia local (~77), tabelas e filtros do controle (~42), planos de trabalho e entregas (~18), perfil e capacidade, termo antes de assinar, avaliação de trabalho.
- Depende de um **servidor próprio** (`URL_API`, `KEY_USER`, em `configBasePro_atividades`) e de login Google (`gapi.auth2`, ver 2.10).
- Carrega sempre (`init.js:487`), sem marcador. Faz o `sei-pro-projetos.js` legado continuar carregando quando há servidor configurado (ver 3).
- Decisão pendente: refatorar, manter como produto separado ou descontinuar.

### 2.3 `sei-functions-pro.js` (depósito de utilidades)

- 14,8 mil linhas, 652 funções, 66 com substituto TS; **~585 restantes**.
- Grupos por nome: utilitários gerais (~254), árvore e processo (~77), menu/UI (~57), controle (~50), configuração (~29), histórico do legado (~29, em grande parte substituído por `historico`/`processo`), editor (~19), links/QR/hash (~18), arquivos/CSV (~17), marcadores e cores (~15).
- Funcionalidades: Urgente/trancado, Sigilo do documento, Certidão de sigilo, Hashcode, QR Code, Copiar e duplicar documento, Baixar documento, Documento público, Barra de ações, Marca de minuta **(confirmar)**, Inserir documento e planilha **(confirmar)**, Play de vídeo **(confirmar)**.
- É o arquivo mais difícil de fatiar: não tem fronteira de funcionalidade, e muita coisa dele é chamada por todos os outros.

### 2.4 Árvore do processo

- Arquivo: `sei-pro-arvore.js` — 3,1 mil linhas, 110 funções (5 com substituto, **105 restantes**).
- Conteúdo: upload de documentos externos por arrastar (dropzone, `uploaddocsexternos`), post-its (`sticknote*`), barra de ações do documento, valores padrão de novo documento (`newdoc*`: formato, nome, nível, sigilo, observação, hoje), numerar documentos, cores de marcadores, divisão de linhas, destaque de não assinados, ajuste do tamanho da árvore, citações.
- O módulo `processo` já cobre capa, painéis, filtro, menu rápido, Gantt, título e aviso; o que sobra aqui é o resto.

### 2.5 Controle de Processos / home legados

- Arquivos: `sei-pro.js` (3,8 mil linhas, 130 funções, 42 com substituto, **88 restantes**) e `sei-pro-all.js` (1 mil linhas, 52 funções, 4 com substituto, **48 restantes**).
- Conteúdo: tabela ordenável (`ordernartabela`) e filtro, post-its e marcadores da home, acompanhamento especial, reabertura programada, nomes de usuários, contador de processos no ícone, marcar não lido, remover paginação, rolagem infinita da pesquisa, trocar unidade, ordenar menu, upload de arquivos no processo, URL amigável, cor de marcador do usuário.
- A `grade-controle` TS cobre a grade; esses são os complementos.

### 2.6 Legística (SEI Legis)

- Arquivo: `sei-legis.js` — 707 linhas, 33 funções.
- Conteúdo: link de legislação, estilo de legística (`estilolegistica`), tags de hash de normas.

### 2.7 Prescrições

- Arquivo: `sei-pro-prescricoes.js` — 400 linhas, 14 funções (carrega sempre, `init.js:494`), mais pedaços em `atividades`, `arvore` e `functions`.
- Conteúdo: painel e cálculo de prescrição por processo (`gerenciarprescricoes`).
- Não confundir com o módulo `prazos` TS.

### 2.8 Visualização de ZIP

- Arquivo: `sei-pro-visualizacao.js` (74 linhas) e `sei-pro-visualizacao-chosen.js` (111 linhas): pré-visualizar e baixar arquivos de dentro de um ZIP (`visualizarzip`), mover ícone (`movericone`).

### 2.9 Infraestrutura

- `init.js` (529 linhas): carrega o legado, a configuração (`loadConfigPro`, `ouvirConfigSyncPro`) e a base de atividades.
- Pilha jQuery: jQuery 3.4.1, jQuery UI, chosen, tablesorter, entre outros em `dist/js/lib/`.
- Cadeia do iframe oculto `#frmCheckerProcessoPro` (`dadosProcessoPro`, criada por `initDadosProcesso`): continua ativa porque ainda há consumidores — Favoritos legado, editor, edição legada de dados do processo, URL amigável, lista de documentos e Ações em lote, histórico legado, controle e pesquisa, Atividades/Prescrição/Projetos e upload pela árvore (lista completa em `processo/README.md`, "O que sobra no legado").

### 2.10 Integração com o Google (Sheets e login)

Dois usos diferentes, que **não** têm o mesmo destino:

- **Google Sheets como base de dados** (Projetos antigo, Formulários e Sincronizar processos). Descontinuado: a API do Google que sustentava foi desativada (`pages/PROJETOS.md`, `pages/BASEDADOS.md`, `pages/SEISHEETS.md`). Pegadas no código: `init.js` (`loadDataBaseSheetsFormulariosPro`, `loadDataBaseSheetsProcessosPro` e o bloco comentado de Projetos), `sei-pro.js` (`handleClientLoadPro`, `checkLoadConfigSheets`), `sei-functions-pro.js` (`initClientPro`, `onSignInPro`, `updateSigninStatusPro`, `handleSignoutClickPro`, com escopo `spreadsheets`), `spreadsheetId*` em `init_db.js` e em `opcoes-pagina/src/perfis.ts`, a opção `sincronizarprocessos` em `opcoes-pagina/src/schema-dados.ts`, `gerenciarformularios` no legado e as páginas `BASEDADOS.md` e `SEISHEETS.md`.
- **Login Google do Atividades** (`gapi.auth2`, token de identificação em `sei-pro-atividades.js`): **depende do destino do Atividades** (2.2).

## 3. Resíduos de funcionalidades já refatoradas

Arquivos legados de módulos que já têm versão TS. Cada um tem uma condição de carga e dependências próprias:

| Arquivo | Linhas | Quando carrega hoje | O que impede remover |
|---|---|---|---|
| `sei-pro-favoritos.js` | 1,8 mil | `init.js:486`, **só sem** o marcador `data-seipro-favoritos` (ou seja, sem o módulo TS na página) | Funções suas leem `dadosProcessoPro` (2.9); outros arquivos citam `getStoreFavoritePro`/`loadFavoritosPro` (há comentário em `sei-functions-pro.js:6599`). Sai só se **todo** pacote distribuído tiver `init_favoritos.js`. |
| `sei-pro-projetos.js` | 2,0 mil | `init.js:493`, sem o marcador **ou com servidor do Atividades configurado** (vira "Projetos (Atividades)") | Enquanto o Atividades existir, ele continua. |
| `sei-pro-docs-lote.js` | 1,5 mil | **Sempre**, por `$.getScript` em `init.js:49`, mesmo com o módulo TS | No Firefox já fica só com as pontes (`getInitialProcUrl`, `getInitialProcHtml`, `getSerieForm`, `extractFormParams`, `createProc`, `extractProcId`), que o código que fica ainda chama (o gerador do pacote confere cada chamador; **quem são** ainda não foi levantado). |
| `sei-pro-proc-lote.js` | 0,8 mil | **Sempre**, por `$.getScript` em `init.js:50` | O pacote oficial recebe o `processos-lote` TS só no Lab (receita `SO_LAB` do gerador do Firefox); no oficial, este arquivo é o único Processos em lote. |

## 4. Ordem sugerida

1. **Limpeza de baixo risco e alto ganho:** Google Sheets (2.10, primeiro uso) e as pontes de `sei-pro-docs-lote.js`; ambos são código que não executa mais ou que só existe por causa de outro resíduo.
2. **Pequenos e isolados:** Prescrições (2.7), Legística (2.6), ZIP (2.8).
3. **Fechar a cadeia do iframe oculto:** Árvore (2.4) e home/controle (2.5), que são os consumidores que sobram de `dadosProcessoPro`.
4. **Editor** (2.1): o maior em uso visível; segue o port para CK5.
5. **Atividades** (2.2) e, com ele, `sei-pro-projetos.js` legado e o login Google: decisão de produto antes de qualquer trabalho.
6. **`sei-functions-pro.js`** (2.3): vai diminuindo conforme os itens acima levam suas funções; no fim, o que sobrar vira `sei-comum`/`sei-nucleo` ou é descartado.

## 5. Atualizações de documentação pendentes

- `processo/README.md` ("O que sobra no legado") ainda cita `getNewDocCompareDocs` como consumidor de `dadosProcessoPro`; a função foi removida com o comparador legado (20/11/2026).
- `dist/manifest_*.json` das marcas (ignorados pelo git) estão defasados e sem `init_comparador.js`; regenerar a partir de `dist/manifest.json` antes de empacotar qualquer marca.
