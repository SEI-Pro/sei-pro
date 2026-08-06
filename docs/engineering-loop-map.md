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

- Arquivos JS analisados: **336**.
- Funções extraídas: **4046**.
- Opções/configurações encontradas: **72**.
- Funções compartilhadas por mais de uma opção: **1100**.
- Funções sem vínculo estático com opções: **2615**.

## Funções por camada

| Camada | Funções |
|---|---:|
| `feature` | 3261 |
| `core` | 227 |
| `shared` | 180 |
| `options` | 105 |
| `background` | 71 |
| `platform` | 69 |
| `bootstrap` | 68 |
| `sei` | 28 |
| `dom` | 16 |
| `shared-legacy` | 11 |
| `entry` | 10 |

## Funções compartilhadas mais relevantes

| Função | Arquivo:linha | Camada | Qtde opções | Opções |
|---|---|---|---:|---|
| `onSeiProConfigReady` | `src/features/todas-paginas/sei-pro-all.js:964` | `feature` | 52 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `duaslinhas`, `editarimagens`, `editarlinks` ... |
| `handler` | `src/features/monitorados/datas.js:212` | `feature` | 49 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `duaslinhas`, `editarimagens`, `editarlinks` ... |
| `installProjetosView` | `src/features/projetos/view/panel.js:343` | `feature` | 49 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `duaslinhas`, `editarimagens`, `editarlinks` ... |
| `waitFor` | `src/features/arvore-info/index.js:107` | `feature` | 49 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `duaslinhas`, `editarimagens`, `editarlinks` ... |
| `addNewsRowsTableTabConfig` | `src/features/atividades/config-panel.js:989` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `checkFileRemoteMonitorado` | `src/features/monitorados/server.js:51` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `checkFileSystemInit` | `src/features/monitorados/server.js:25` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `confirmaFraseBoxPro` | `src/features/atividades/ratings.js:1116` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `docLoteModalAnaliseDocModelo` | `src/features/docs-lote/view.js:551` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `documentosemlote`, `editarimagens`, `editarlinks` ... |
| `getChartPlanosTrabalho` | `src/features/atividades/charts.js:598` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `getContentDocSEI` | `src/features/sei-functions/body.js:1644` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `getServerAtividades` | `src/features/atividades/server.js:15` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `getTabConfig` | `src/features/atividades/config-panel.js:294` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `getTabReport` | `src/features/atividades/reports-panel.js:141` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `hasSpecialChars` | `src/features/docs-lote/view.js:272` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `initConfigSEIPro` | `src/features/todas-paginas/sei-pro-all.js:843` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `initMaskPhoneConfig` | `src/features/atividades/config-panel.js:247` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `initUploadArvore` | `src/features/arvore/upload.js:457` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `insertActionHipoteseLegal` | `src/features/sei-functions/body.js:10434` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `installLoginAutofill` | `src/features/login/index.js:97` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `autopreenchersenha`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks` ... |
| `matches` | `src/shared/ui/tags-input.js:92` | `shared` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `ratePlano` | `src/features/atividades/ratings.js:126` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `ratePrograma` | `src/features/atividades/ratings.js:54` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `removeMonitorado` | `src/features/monitorados/extras.js:58` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `saveAfastamento` | `src/features/atividades/afastamentos.js:639` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `saveAtividadeQuick` | `src/features/atividades/activity-work.js:1622` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `submitViaIframe` | `src/features/arvore-info/index.js:743` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `viewEspecifacaoProcesso` | `src/features/sei-functions/body.js:1981` | `feature` | 46 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `$` | `src/features/sei-functions/body.js:12212` | `feature` | 45 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |
| `addNewItemSelect` | `src/features/sei-functions/body.js:1995` | `feature` | 45 | `agruparlista`, `atalhopublicacoeseletronicas`, `certidaosigilo`, `citacaodoc`, `contadoricone`, `coresmarcadores`, `debugpage`, `disablequery`, `ditado`, `editarimagens`, `editarlinks`, `escrivainterativa` ... |

## Artefatos gerados

- `docs/mapping-funcoes-configuracoes/opcoes_funcoes.csv`
- `docs/mapping-funcoes-configuracoes/funcoes.csv`

## Como o loop deve usar este mapa

1. Use o mapa para identificar opções/camadas com maior acoplamento.
2. Confirme a fatia no código e no `DEVELOPMENT.md` antes de editar.
3. Prefira fatias pequenas: uma função pura, um adapter, um alias global, um entry ou um ponto de bootstrap por vez.
4. Não migre cegamente por contagem de funções; priorize as dívidas explícitas do `DEVELOPMENT.md`, especialmente dependências de feature dentro de `core/stack.js`.
