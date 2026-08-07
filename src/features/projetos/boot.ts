// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Projetos — boot glue (retry until home DOM is ready).
 */
import { globalRef } from '../../core/global.js';
import { initProjetosPanel, refreshProjetosPanel } from './view/panel.js';
import { ensureDemoSeed, installProjetosStore, replaceProjetos } from './store.js';

export function bootProjetos(timeout = 9000) {
    installProjetosStore();
    if (timeout <= 0) return;
    const enabled = (() => {
        try {
            if (typeof globalRef.checkConfigValue === 'function') return !!globalRef.checkConfigValue('gerenciarprojetos');
            if (typeof globalRef.verifyConfigValue === 'function') return !!globalRef.verifyConfigValue('gerenciarprojetos');
        } catch (e) { /* noop */ }
        return true;
    })();
    if (!enabled) return;

    // Skip if running inside the tree iframe
    if (window.frameElement) return;

    ensureDemoSeed(false);
    try {
        initProjetosPanel(timeout);
    } catch (e) {
        setTimeout(() => bootProjetos(timeout - 200), 200);
    }
}

export function refreshAfterAtividades(arrayProjetos) {
    if (Array.isArray(arrayProjetos)) replaceProjetos(arrayProjetos);
    refreshProjetosPanel();
}
