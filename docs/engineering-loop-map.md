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

- Arquivos JS analisados: **166**.
- Funções extraídas: **3131**.
- Opções/configurações encontradas: **72**.
- Funções compartilhadas por mais de uma opção: **751**.
- Funções sem vínculo estático com opções: **2019**.

## Funções por camada

| Camada | Funções |
|---|---:|
| `feature` | 1975 |
| `shared-legacy` | 677 |
| `core` | 164 |
| `platform` | 64 |
| `options` | 62 |
| `bootstrap` | 52 |
| `shared` | 47 |
| `background` | 36 |
| `sei` | 28 |
| `dom` | 16 |
| `entry` | 10 |

## Funções compartilhadas mais relevantes

| Função | Arquivo:linha | Camada | Qtde opções | Opções |
|---|---|---|---:|---|
| `onSeiProConfigReady` | `src/features/todas-paginas/sei-pro-all.js:967` | `feature` | 48 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `addNewsRowsTableTabConfig` | `src/features/atividades/sei-pro-atividades.js:4573` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `checkFileRemoteMonitorado` | `src/features/monitorados/server.js:44` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `checkFileSystemInit` | `src/features/monitorados/server.js:19` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `confirmaFraseBoxPro` | `src/features/atividades/sei-pro-atividades.js:25528` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `docLoteModalAnaliseDocModelo` | `src/features/docs-lote/view.js:551` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `documentosemlote`, `editarimagens`, `editarlinks` ... |
| `filterProjetos` | `src/features/projetos/sei-pro-projetos.js:1908` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `getChartPlanosTrabalho` | `src/features/atividades/sei-pro-atividades.js:1704` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `getContentDocSEI` | `src/shared/legacy/sei-functions-pro.js:1831` | `shared-legacy` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `getDialogPlataformAI` | `src/features/editor/sei-pro-editor.js:6256` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `getServerAtividades` | `src/features/atividades/sei-pro-atividades.js:135` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `getTabConfig` | `src/features/atividades/sei-pro-atividades.js:3881` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `getTabReport` | `src/features/atividades/sei-pro-atividades.js:3554` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `hasSpecialChars` | `src/features/docs-lote/view.js:272` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `initConfigSEIPro` | `src/features/todas-paginas/sei-pro-all.js:846` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `initMaskPhoneConfig` | `src/features/atividades/sei-pro-atividades.js:3834` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `insertActionHipoteseLegal` | `src/shared/legacy/sei-functions-pro.js:10739` | `shared-legacy` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `installLoginAutofill` | `src/features/login/index.js:97` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks` ... |
| `matches` | `src/shared/ui/tags-input.js:92` | `shared` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `ratePlano` | `src/features/atividades/sei-pro-atividades.js:24545` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `ratePrograma` | `src/features/atividades/sei-pro-atividades.js:24476` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `removeMonitorado` | `src/features/monitorados/extras.js:58` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `saveAfastamento` | `src/features/atividades/sei-pro-atividades.js:15148` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `saveAtividadeQuick` | `src/features/atividades/sei-pro-atividades.js:19380` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `setProjetos` | `src/features/projetos/sei-pro-projetos.js:16` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `submitViaIframe` | `src/features/arvore-info/index.js:743` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `viewEspecifacaoProcesso` | `src/shared/legacy/sei-functions-pro.js:2168` | `shared-legacy` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `$` | `src/shared/legacy/sei-functions-pro.js:12488` | `shared-legacy` | 45 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `addNewItemSelect` | `src/shared/legacy/sei-functions-pro.js:2182` | `shared-legacy` | 45 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `botProIdea` | `src/features/ai/sei-pro-ai.js:1613` | `feature` | 45 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |

## Artefatos gerados

- `docs/mapping-funcoes-configuracoes/opcoes_funcoes.csv`
- `docs/mapping-funcoes-configuracoes/funcoes.csv`

## Como o loop deve usar este mapa

1. Use o mapa para identificar opções/camadas com maior acoplamento.
2. Confirme a fatia no código e no `DEVELOPMENT.md` antes de editar.
3. Prefira fatias pequenas: uma função pura, um adapter, um alias global, um entry ou um ponto de bootstrap por vez.
4. Não migre cegamente por contagem de funções; priorize as dívidas explícitas do `DEVELOPMENT.md`, especialmente dependências de feature dentro de `core/stack.js`.
