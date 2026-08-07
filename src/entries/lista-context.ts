/**
 * Raiz de composição do contexto LISTA.
 *
 * Este bundle é injetado depois de `sei-pro.js`: mantém os globais de
 * compatibilidade disponíveis ao init legado, mas a capability exclusiva é
 * instalada apenas pelo registry gerado — sem auto-boot paralelo.
 */
import { boot } from '../app/boot.js';
import { globalRef } from '../core/global.js';
import { ready } from '../dom/index.js';
import { registerListaExclusiveFeatures } from '../generated/lista-feature-registry.js';
import { createListaDeps, installListaEntryLegacyApi } from './lista.js';
import { readListaEntryInputs } from './lista/io.js';

registerListaExclusiveFeatures();
installListaEntryLegacyApi();

type ListaConfig = { verifyConfigValue?: (key: string) => boolean };
type ListaContextOverrides = {
    root?: Document;
    document?: Document;
    config?: ListaConfig;
    [key: string]: unknown;
};

export async function bootListaContext(overrides: ListaContextOverrides = {}) {
    const root = overrides.root || overrides.document || (typeof document !== 'undefined' ? document : null);
    const config = overrides.config || globalRef.SeiPro?.core?.config;
    const inputs = readListaEntryInputs({
        root,
        checkConfigValue: config?.verifyConfigValue
    });
    if (!inputs.hasProcessTables) {
        return { context: 'lista', installed: [], failed: [], cleanup() {} };
    }

    const deps = createListaDeps({
        ...overrides,
        root,
        document: root,
        config
    });
    return boot('lista', deps);
}

ready(async () => {
    const result = await bootListaContext();
    // boot() já registra e sinaliza na UI as falhas por capability.
    void result;
});
