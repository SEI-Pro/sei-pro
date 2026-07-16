import { getSeiPro } from '../../core/global.js';
import { initIcon, mountIcon, iconHtml, bindToggle } from './icon.js';
import { setPanelMonitorados, bindPanelDispatcher } from './panel.js';
import { openBoxConfigDates } from './datas.js';
import { installCategorias } from './categorias.js';
import { installCommands } from './commands.js';
import { installVisualizacao } from './visualizacao.js';
import './legacy-api.js'; // único ponto com aliasGlobal — expõe a compat global da feature

/**
 * Processos Monitorados — ENTRY do bundle ESM (reescrita vanilla, isolated-world).
 *
 * Estado da reescrita:
 *   ✓ domain.js / store.js     — núcleo puro + IO (store legado via core-stack)
 *   ✓ dom.js                   — helpers vanilla + delegação
 *   ✓ icon.js / panel.js       — estrela + painel (data-act)
 *   ✓ datas / categorias / commands / visualizacao / CSS `.seipro-*`
 *   ✓ legacy-api.js            — único ponto com aliasGlobal
 *
 * Pontos de entrada legados (insertIconMonitorados/appendIconMonitorados/actMonitoradoPro)
 * continuam via aliasGlobal até os call-sites migrarem.
 */

const monitorados = getSeiPro().features.monitorados || (getSeiPro().features.monitorados = {});
monitorados.view = { initIcon, mountIcon, iconHtml };
monitorados.panel = { render: setPanelMonitorados };
monitorados.datas = { openBox: openBoxConfigDates };

// Módulos com setup real (event binding / guards). Os demais módulos não têm
// install — só expõem `legacyApi`, consolidado em legacy-api.js.
installCategorias();
installCommands();
installVisualizacao();

// Painel: dispatcher delegado que revive os botões (a compat global vem de legacy-api.js).
bindPanelDispatcher(document);

// Clique da estrela (data-act="monitorado-toggle") na tela de controle de processos:
// a estrela é inserida por appendStarOnProcess no document do content script, mas o
// bindPanelDispatcher só trata cliques dentro de #monitoradosPro. Liga a delegação do
// toggle no document para que adicionar/remover dos monitorados funcione na lista.
bindToggle(document);
