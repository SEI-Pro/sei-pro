// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
// docs-lote / state — estado mutável do wizard (antes eram `var` globais soltos
// no topo de sei-pro-docs-lote.js). Verificado: nenhum outro arquivo lê estes nomes,
// então são seguros como estado local da feature (compartilhado entre io e view).
//
// Objeto único e mutável; io e view importam `S` e mutam `S.campo`. Não exportar os
// campos individualmente (binding ESM seria read-only para os consumidores).

export const S = {
    CSVEncoding: 'utf-8',
    dynamicFields: [],
    CSVData: [],
    CSVHeaders: [],
    dataCrossing: [],
    selectedModel: {},
    CSVFileName: '',
    aborted: false,
    flagError: false,
    flagConfirmSpecialChars: false,
    forceNames: false,
    docsCriados: [],
    listTxtPadraoDoc: []
};

// Página de ajuda — derivada do global URLPAGES_SPRO no momento da carga (lazy:
// o global é definido pelo core/sei-functions antes de qualquer clique).
export function helpPageUrl() {
    return typeof URLPAGES_SPRO !== 'undefined' ? `${URLPAGES_SPRO}/pages/DOCUMENTOSEMLOTE.html` : false;
}
