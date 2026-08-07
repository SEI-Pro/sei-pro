/**
 * Projetos (Gantt) — feature entry (esbuild → dist/js/sei-pro-projetos.js).
 */
import { getSeiPro } from '../../core/global.js';
import { installProjetosStore } from './store.js';
import {
    installProjetosView,
    initProjetos,
    refreshProjetosPanel,
    selectProjetoTab
} from './view/panel.js';
import {
    dispatchProjetoAction,
    getStoreProjetos,
    listProjetos,
    replaceProjetos
} from './store.js';
import { installProjetosLegacyApi } from './legacy-api.js';
import { bootProjetos } from './boot.js';
import * as domain from './domain/index.js';

const ns = getSeiPro().features.projetos || (getSeiPro().features.projetos = {});
ns.domain = domain;
const projetosApi = Object.freeze({
    commands: Object.freeze({ dispatchProjetoAction, replaceProjetos }),
    queries: Object.freeze({ getStoreProjetos, listProjetos }),
    initProjetos,
    refreshProjetosPanel,
    selectProjetoTab
});
ns.api = projetosApi;
ns.commands = projetosApi.commands;
ns.queries = projetosApi.queries;
ns.initProjetos = initProjetos;
ns.refreshProjetosPanel = refreshProjetosPanel;
ns.selectProjetoTab = selectProjetoTab;
ns.replaceProjetos = replaceProjetos;
installProjetosStore();
installProjetosLegacyApi();
installProjetosView();
bootProjetos();
