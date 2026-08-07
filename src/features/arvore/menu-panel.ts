// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Árvore — menu adapters + panel selection.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    resolveMenuCatalogs
} from './domain.js';

import { readArvoreMenuConfig as readArvoreMenuConfigIO } from './io.js';

import { installArvoreState } from './state.js';

installArvoreState();


export function resolveArvoreMenuCatalogs(stored, defaults) {
    return resolveMenuCatalogs(stored, defaults);
}

export function readArvoreMenuConfig() {
    if (typeof localStorageRestorePro !== 'function' || typeof getOptionsPro !== 'function') {
        return null;
    }
    return readArvoreMenuConfigIO({
        restore: localStorageRestorePro,
        getOption: getOptionsPro
    });
}

export function getSelectedItensPanelArvore() {
    var defaults = { panel: [["Anota\u00E7\u00F5es"],["Marcador"],["Acompanhamento Especial"],["Tipo de Procedimento"],["Assuntos"],["Interessados"],["Atribui\u00E7\u00E3o"],["N\u00EDvel de Acesso"],["Observa\u00E7\u00F5es"]] };
    var config = null;
    try {
        config = readArvoreMenuConfig();
    } catch (e) {
        config = null;
    }
    var stored = config ? { panel: config.stored.panel } : { panel: (typeof localStorageRestorePro === 'function') ? localStorageRestorePro('configViewFlashPanelArvorePro') : undefined };
    return resolveArvoreMenuCatalogs(stored, defaults).panel;
}
try {
    selectedItensPanelArvore = getSelectedItensPanelArvore();
} catch (e) {
    selectedItensPanelArvore = false;
}

export function isSparklingModalVisible() {
    return typeof parent.$ === 'function' &&
        parent.$('#divInfraSparklingModalContent').length > 0 &&
        parent.$('#divInfraSparklingModalContent').is(':visible');
}
