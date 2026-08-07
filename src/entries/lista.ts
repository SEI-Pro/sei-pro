// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Domínio puro da composição do contexto de lista de processos + raiz parcial
 * (ADR-0005). A entry real ainda convive com o legado `sei-pro.js` e com
 * bundles de features no manifest; `createListaDeps` expõe ports explícitos
 * para quem orquestra o boot sem buscar em global.
 */

import { createStorage } from '../platform/storage.js';
import { createLogger } from '../platform/logger.js';
import { createMessaging } from '../platform/messaging.js';
import { readListaEntryInputs } from './lista/io.js';
import { runListaProcessosView } from './lista/view.js';
import { installListaEntryLegacyApi as installLegacyApi } from './lista/legacy-api.js';

const LISTA_FEATURES = Object.freeze([
    'lista-processos',
    'lista-agrupamento',
    'controlar-prazos',
    'nao-lido'
]);

const MONITORADOS_FEATURE = 'monitorados';

/**
 * Ports e deps de composição para o contexto lista (ADR-0005).
 * Não muta global; callers injetam o retorno em boot / view.
 *
 * @param {object} [overrides]
 */
export function createListaDeps(overrides = {}) {
    const messaging = overrides.messaging || createMessaging();
    return {
        clock: { now: () => Date.now() },
        document: typeof document !== 'undefined' ? document : null,
        logger: createLogger({ scope: 'lista' }),
        messaging,
        storage: createStorage({ messaging }),
        ...overrides
    };
}

export function composeListaFeatures({
    hasProcessTables = false,
    hasTreeFrame = false,
    enabled = {}
} = {}) {
    if (hasProcessTables) {
        const features = LISTA_FEATURES.filter((feature) => enabled[feature] !== false);
        if (enabled.monitorados !== false) features.push(MONITORADOS_FEATURE);
        return { context: 'lista', features };
    }

    if (hasTreeFrame) {
        return { context: 'arvore', features: ['arvore'] };
    }

    return { context: 'desconhecido', features: [] };
}

export function installListaEntryDomain(globalRef = globalThis) {
    globalRef.SeiPro = globalRef.SeiPro || {};
    globalRef.SeiPro.entries = globalRef.SeiPro.entries || {};
    globalRef.SeiPro.entries.lista = {
        composeListaFeatures,
        createListaDeps,
        readListaEntryInputs,
        runListaProcessosView
    };
}

export function installListaEntryLegacyApi() {
    installLegacyApi();
}

installListaEntryDomain(typeof window !== 'undefined' ? window : globalThis);
