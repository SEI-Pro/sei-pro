/**
 * Domínio puro da composição do contexto de lista de processos.
 *
 * A entry real ainda convive com o legado `sei-pro.js` e com bundles de
 * features carregados pelo manifest. Este módulo descreve, sem DOM ou
 * globals, quais superfícies pertencem a cada variante do contexto; a
 * fachada legada usa o plano quando o bundle estiver disponível e mantém
 * fallback para load orders antigos.
 */

import { readListaEntryInputs } from './lista/io.js';
import { runListaProcessosView } from './lista/view.js';

const LISTA_FEATURES = Object.freeze([
    'lista-processos',
    'lista-agrupamento',
    'controlar-prazos',
    'nao-lido'
]);

const MONITORADOS_FEATURE = 'monitorados';

export function composeListaFeatures({
    hasProcessTables = false,
    hasTreeFrame = false,
    enabled = {}
} = {}) {
    if (hasProcessTables) {
        const features = LISTA_FEATURES.filter((feature) => enabled[feature] !== false);
        if (enabled.monitorados !== false) features.push(MONITORADOS_FEATURE);
        return { context: 'lista-processos', features };
    }

    if (hasTreeFrame) {
        return { context: 'arvore', features: ['arvore'] };
    }

    return { context: 'desconhecido', features: [] };
}

export function installListaEntryDomain(globalRef = globalThis) {
    globalRef.SeiPro = globalRef.SeiPro || {};
    globalRef.SeiPro.entries = globalRef.SeiPro.entries || {};
    globalRef.SeiPro.entries.lista = { composeListaFeatures, readListaEntryInputs, runListaProcessosView };
}

installListaEntryDomain(typeof window !== 'undefined' ? window : globalThis);
