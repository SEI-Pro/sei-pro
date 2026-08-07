// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { getSeiPro } from '../../core/global.js';
import { publishFeature } from '../../app/publish-feature.js';
import { initIcon, mountIcon, iconHtml, bindToggle } from './icon.js';
import { setPanelMonitorados, bindPanelDispatcher } from './panel.js';
import { openBoxConfigDates } from './datas.js';
import { installCategorias } from './categorias.js';
import { installCommands, actMonitoradoPro } from './commands.js';
import { installVisualizacao } from './visualizacao.js';
import './legacy-api.js'; // único ponto com aliasGlobal — expõe a compat global da feature

/**
 * Processos Monitorados — Tier S. Contrato { id, api, install }.
 */

export function installMonitorados() {
    installCategorias();
    installCommands();
    installVisualizacao();
    bindPanelDispatcher(document);
    bindToggle(document, actMonitoradoPro);
}

const existing = getSeiPro().features.monitorados || {};
const storeApi = {
    getStore: existing.getStore,
    getOptionsConfigDate: existing.getOptionsConfigDate,
    persist: existing.persist,
    scheduleRemote: existing.scheduleRemote,
    flushRemote: existing.flushRemote,
    getConfigDatetime: existing.getConfigDatetime,
    save: existing.save,
    defaultConfigDate: existing.defaultConfigDate,
    defaultStore: existing.defaultStore,
    findIndex: existing.findIndex,
    processDataReady: existing.processDataReady,
    processPayloadReady: existing.processPayloadReady
};

publishFeature({
    id: 'monitorados',
    api: Object.freeze({
        view: Object.freeze({ initIcon, mountIcon, iconHtml }),
        panel: Object.freeze({ render: setPanelMonitorados }),
        datas: Object.freeze({ openBox: openBoxConfigDates }),
        act: actMonitoradoPro,
        ...Object.fromEntries(Object.entries(storeApi).filter(([, v]) => typeof v !== 'undefined'))
    }),
    install: installMonitorados
});

installMonitorados();
