/**
 * Leitura da preferência de seções do painel (`configViewFlashPanelArvorePro`).
 * A UI de escrita continua em menus-rapidos; aqui só o contrato de leitura.
 */
import {
    PREFERENCE_STORAGE_KEY,
    type PanelSectionId,
    isSectionEnabled,
    resolveEnabledSectionIds
} from './domain.js';

export type PreferenceReaderDeps = {
    /** Host that may expose `localStorageRestorePro` (tree iframe or parent). */
    storageHost?: {
        localStorageRestorePro?: (key: string) => unknown;
    } | null;
    localStorageRestorePro?: (key: string) => unknown;
};

export function readSectionPreferenceRaw(deps: PreferenceReaderDeps = {}): unknown {
    const fn =
        deps.localStorageRestorePro ||
        (deps.storageHost && typeof deps.storageHost.localStorageRestorePro === 'function'
            ? deps.storageHost.localStorageRestorePro.bind(deps.storageHost)
            : null);
    if (!fn) return null;
    try {
        return fn(PREFERENCE_STORAGE_KEY);
    } catch {
        return null;
    }
}

export function readEnabledSectionIds(deps: PreferenceReaderDeps = {}): ReadonlySet<PanelSectionId> {
    return resolveEnabledSectionIds(readSectionPreferenceRaw(deps));
}

export function createSectionEnabledChecker(deps: PreferenceReaderDeps = {}) {
    const enabledIds = readEnabledSectionIds(deps);
    return function sectionEnabled(sectionId: string): boolean {
        return isSectionEnabled(sectionId, enabledIds);
    };
}

export { PREFERENCE_STORAGE_KEY };
