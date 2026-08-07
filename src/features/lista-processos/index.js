/**
 * Lista de processos — entry do bundle.
 * Contrato público { id, api, install }. body.js ainda é monolito residual.
 */
import { ready } from '../../dom/index.js';
import { publishFeature } from '../../app/publish-feature.js';
import { installListaProcessosState } from './state.js';
import {
    normalizeHomeFilterText,
    normalizeHomeFilterKey,
    quoteInlineJsText,
    rewriteHomeFilterCaption,
    rowMatchesHomeFilterFacts,
    getListIdProtocoloSelectedFromValues
} from './domain.js';
import { listaAgrupamentoIO, readGroupOrder } from './io.js';
import { installListaProcessosLegacyApi } from './legacy-api.js';
import { initSeiPro } from './body.js';

installListaProcessosState();

export function installListaProcessos() {
    installListaProcessosLegacyApi();
    ready(function () {
        initSeiPro();
    });
}

publishFeature({
    id: 'lista-processos',
    nsKey: 'listaProcessos',
    api: Object.freeze({
        normalizeHomeFilterText,
        normalizeHomeFilterKey,
        quoteInlineJsText,
        rewriteHomeFilterCaption,
        rowMatchesHomeFilterFacts,
        getListIdProtocoloSelectedFromValues,
        listaAgrupamentoIO,
        readGroupOrder
    }),
    install: installListaProcessos
});

// Compat: IO namespace still referenced by lista-agrupamento / io bridges.
const namespace = globalThis.SeiPro = globalThis.SeiPro || {};
namespace.features = namespace.features || {};
namespace.features.listaProcessosIO = {
    listaAgrupamentoIO,
    readGroupOrder
};

installListaProcessos();
