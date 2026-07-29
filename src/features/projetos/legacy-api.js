/**
 * Projetos — legacy API bridge (ONLY file that calls aliasGlobal).
 */
import { aliasGlobal } from '../../core/global.js';
import {
    initProjetos,
    setProjetos,
    initProjetosPanel,
    setProjetosPanel,
    refreshProjetosPanel,
    openProjetoForm,
    openEtapaForm,
    selectProjetoTab
} from './view/panel.js';
import { bootProjetos, refreshAfterAtividades } from './boot.js';
import {
    dispatchProjetoAction,
    ensureDemoSeed,
    getStoreProjetos,
    listProjetos,
    replaceProjetos
} from './store.js';
import { checkPermissionProjeto } from './commands.js';

const legacy = {
    initProjetos,
    setProjetos,
    initProjetosPanel,
    setProjetosPanel,
    refreshProjetosPanel,
    selectProjetoTab,
    bootProjetos,
    refreshAfterAtividades,
    openProjetoForm,
    openEtapaForm,
    dispatchProjetoAction,
    ensureDemoSeed,
    getStoreProjetos,
    listProjetos,
    replaceProjetos,
    checkPermissionProjeto,
    // Legacy names still referenced from atividades / inline remnants
    saveProjeto: (el) => openProjetoForm(),
    saveEtapa: (el) => {
        const id = el && el.dataset ? Number(el.dataset.id_projeto) : 0;
        const p = listProjetos().find((x) => x.id_projeto === id);
        if (p) openEtapaForm(p, {});
    },
    openProjetoConfig: () => openProjetoForm(),
    openFilterProjeto: () => {
        const btn = document.querySelector('#projetosGantt [data-act="open-filter"]');
        if (btn) btn.click();
    }
};

export function installProjetosLegacyApi() {
    Object.keys(legacy).forEach((name) => aliasGlobal(name, legacy[name]));
    aliasGlobal('loadProjetosPro', true);
}

export const legacyApi = legacy;
