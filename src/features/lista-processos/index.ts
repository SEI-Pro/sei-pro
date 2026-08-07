// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Lista de processos — entry do bundle.
 *
 * Decomposição: domain · io · view · templates · state · clusters · legacy-api.
 * Saída: dist/js/sei-pro.js (mesmo nome do legado para o manifest).
 *
 * Public surface: SeiPro.features.listaProcessos = { id, api, install }.
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
import {
    initSeiPro,
    insertGroupTable,
    getFilterTableHome,
    setTableSorterHome
} from './modules.js';

export function installListaProcessos() {
    installListaProcessosState();
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
        readGroupOrder,
        initSeiPro,
        insertGroupTable,
        getFilterTableHome,
        setTableSorterHome
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
