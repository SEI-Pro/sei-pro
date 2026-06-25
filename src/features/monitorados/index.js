import { aliasGlobal, getSeiPro } from '../../core/global.js';
import { initIcon, mountIcon, iconHtml } from './icon.js';
import { openBoxSingleMap, openBoxMultipleMap, saveConfigMapsMonitorado } from './maps.js';
import { setPanelMonitorados, bindPanelDispatcher } from './panel.js';
import { openBoxConfigDates, installDatas } from './datas.js';
import { installCategorias } from './categorias.js';
import { installCommands } from './commands.js';

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
monitorados.maps = { openSingle: openBoxSingleMap, openMultiple: openBoxMultipleMap, save: saveConfigMapsMonitorado };
monitorados.panel = { render: setPanelMonitorados };
monitorados.datas = { openBox: openBoxConfigDates };
installDatas();
installCategorias();
installCommands();

// Pontos de entrada cross-arquivo (chamados por init/arvore/sei-pro): agora vanilla.
aliasGlobal('insertIconMonitorados', initIcon);
aliasGlobal('appendIconMonitorados', mountIcon);
aliasGlobal('htmlIconMonitorados', iconHtml);

// Mapas (Leaflet + modal vanilla) — substituem o slice legado de mapas.
aliasGlobal('openBoxSingleMap', openBoxSingleMap);
aliasGlobal('openBoxMultipleMap', openBoxMultipleMap);
aliasGlobal('saveConfigMapsMonitorado', saveConfigMapsMonitorado);

// Painel (render vanilla + dispatcher delegado que revive os botões).
aliasGlobal('setPanelMonitorados', setPanelMonitorados);
bindPanelDispatcher(document);
