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
 * Estado da reescrita (incremental, carregável a cada etapa):
 *   ✓ domain.js / store.js   — núcleo puro + IO (instalados via core-stack)
 *   ✓ dom.js                 — helpers vanilla + delegação
 *   ✓ icon.js                — ícone-estrela (add/remover) com clique DELEGADO
 *   … pendente               — panel, datas, categorias, maps, sync, server, CSS
 *
 * Enquanto painel/diálogo não são portados, o clique do ícone delega ao fluxo
 * legado window.actMonitoradoPro (mesmo mundo isolado), e os pontos de entrada
 * chamados por OUTROS arquivos (insertIconMonitorados/appendIconMonitorados)
 * são servidos pela versão vanilla via aliasGlobal — substituindo o legado.
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
