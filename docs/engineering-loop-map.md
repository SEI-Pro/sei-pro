# Mapa opção ↔ função — Engineering Loop

> Gerado por `node scripts/engineering-loop-map.mjs`. A saída é determinística para permitir `--check`.

## Metodologia

- Analisa `src/**/*.js` e ignora `dist/`, `node_modules` e artefatos gerados.
- Extrai funções por padrões estáticos de declaração/atribuição comuns.
- Lê opções/configurações de `src/options/options.html` via `data-name`.
- Associa uma opção diretamente quando a função contém a chave como string literal.
- Propaga associações por chamadas detectadas até profundidade 2.
- Classifica os arquivos por camada: `core`, `platform`, `sei`, `feature`, `entry`, `shared-legacy`, `bootstrap`, etc.

Limitação: análise estática aproximada; callbacks, chamadas dinâmicas e strings montadas em runtime exigem revisão manual. O mapa orienta a escolha de fatias, mas não substitui leitura de código.

## Resumo

- Arquivos JS analisados: **137**.
- Funções extraídas: **3010**.
- Opções/configurações encontradas: **72**.
- Funções compartilhadas por mais de uma opção: **610**.
- Funções sem vínculo estático com opções: **2009**.

## Funções por camada

| Camada | Funções |
|---|---:|
| `feature` | 1912 |
| `shared-legacy` | 674 |
| `core` | 157 |
| `platform` | 61 |
| `bootstrap` | 52 |
| `shared` | 46 |
| `background` | 36 |
| `options` | 28 |
| `sei` | 28 |
| `dom` | 16 |

## Funções compartilhadas mais relevantes

| Função | Arquivo:linha | Camada | Qtde opções | Opções |
|---|---|---|---:|---|
| `onSeiProConfigReady` | `src/features/todas-paginas/sei-pro-all.js:967` | `feature` | 54 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `addNewsRowsTableTabConfig` | `src/features/atividades/sei-pro-atividades.js:4573` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `checkFileRemoteMonitorado` | `src/features/monitorados/server.js:44` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `checkFileSystemInit` | `src/features/monitorados/server.js:19` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `confirmaFraseBoxPro` | `src/features/atividades/sei-pro-atividades.js:25528` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `docLoteModalAnaliseDocModelo` | `src/features/docs-lote/view.js:551` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `filterProjetos` | `src/features/projetos/sei-pro-projetos.js:1908` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `getChartPlanosTrabalho` | `src/features/atividades/sei-pro-atividades.js:1704` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `getContentDocSEI` | `src/shared/legacy/sei-functions-pro.js:1831` | `shared-legacy` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `getDialogPlataformAI` | `src/features/editor/sei-pro-editor.js:6321` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `getServerAtividades` | `src/features/atividades/sei-pro-atividades.js:135` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `getTabConfig` | `src/features/atividades/sei-pro-atividades.js:3881` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `getTabReport` | `src/features/atividades/sei-pro-atividades.js:3554` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `hasSpecialChars` | `src/features/docs-lote/view.js:272` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `initConfigSEIPro` | `src/features/todas-paginas/sei-pro-all.js:846` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `initMaskPhoneConfig` | `src/features/atividades/sei-pro-atividades.js:3834` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `insertActionHipoteseLegal` | `src/shared/legacy/sei-functions-pro.js:10792` | `shared-legacy` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `matches` | `src/shared/ui/tags-input.js:92` | `shared` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `ratePlano` | `src/features/atividades/sei-pro-atividades.js:24545` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `ratePrograma` | `src/features/atividades/sei-pro-atividades.js:24476` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `removeMonitorado` | `src/features/monitorados/extras.js:58` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `saveAfastamento` | `src/features/atividades/sei-pro-atividades.js:15148` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `saveAtividadeQuick` | `src/features/atividades/sei-pro-atividades.js:19380` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `setProjetos` | `src/features/projetos/sei-pro-projetos.js:16` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `submitViaIframe` | `src/features/arvore-info/index.js:743` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `viewEspecifacaoProcesso` | `src/shared/legacy/sei-functions-pro.js:2168` | `shared-legacy` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `$` | `src/shared/legacy/sei-functions-pro.js:12541` | `shared-legacy` | 51 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `addNewItemSelect` | `src/shared/legacy/sei-functions-pro.js:2182` | `shared-legacy` | 51 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `botProIdea` | `src/features/ai/sei-pro-ai.js:1612` | `feature` | 51 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |
| `boxAIConcent` | `src/features/ai/sei-pro-ai.js:1583` | `feature` | 51 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `certidaosigilo_nomedoc`, `citacaodoc`, `combinacaoteclas`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado` ... |

## Artefatos gerados

- `docs/mapping-funcoes-configuracoes/opcoes_funcoes.csv`
- `docs/mapping-funcoes-configuracoes/funcoes.csv`

## Como o loop deve usar este mapa

1. Use o mapa para identificar opções/camadas com maior acoplamento.
2. Confirme a fatia no código e no `DEVELOPMENT.md` antes de editar.
3. Prefira fatias pequenas: uma função pura, um adapter, um alias global, um entry ou um ponto de bootstrap por vez.
4. Não migre cegamente por contagem de funções; priorize as dívidas explícitas do `DEVELOPMENT.md`, especialmente dependências de feature dentro de `core/stack.js`.
