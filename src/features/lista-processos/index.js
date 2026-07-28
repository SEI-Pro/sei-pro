/**
 * Lista de processos — entry do bundle (substitui a cópia legada sei-pro.js).
 *
 * Decomposição: domain · io · view · templates · state · body · legacy-api.
 * Saída: dist/js/sei-pro.js (mesmo nome do legado para o manifest).
 */
import { ready } from '../../dom/index.js';
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

const namespace = globalThis.SeiPro = globalThis.SeiPro || {};
namespace.features = namespace.features || {};
namespace.features.listaProcessos = {
    normalizeHomeFilterText,
    normalizeHomeFilterKey,
    quoteInlineJsText,
    rewriteHomeFilterCaption,
    rowMatchesHomeFilterFacts,
    getListIdProtocoloSelectedFromValues
};
namespace.features.listaProcessosIO = {
    listaAgrupamentoIO,
    readGroupOrder
};

installListaProcessosLegacyApi();

ready(function () {
    initSeiPro();
});
