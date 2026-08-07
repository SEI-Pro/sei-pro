// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Lista de processos — mutable runtime state on globalThis.
 */
export function installListaProcessosState() {
    const g = globalThis;
    if (g.__SEI_PRO_LISTA_PROCESSOS_STATE_INSTALLED__) return g;

    g.actionTest = g.actionTest || 'ondblclick="removeCacheGroupTable(this)"';
    g.totalSecondsTest = g.totalSecondsTest || 0;
    g.totalSecondsTestText = g.totalSecondsTestText || '';
    g.timerTest = g.timerTest || undefined;
    g.tableHomePro = g.tableHomePro || [];
    g.kanbanProcessos = g.kanbanProcessos || false;
    g.kanbanProcessosMoving = g.kanbanProcessosMoving || false;
    g.containerUpload = g.containerUpload || 'body';
    g.arvoreDropzone = g.arvoreDropzone || false;
    g.contentW = g.contentW || false;

    try {
        const supports = g.SeiPro && g.SeiPro.sei && g.SeiPro.sei.supports;
        const modern = supports
            ? supports.modernCheckbox()
            : !!(g.SeiPro && g.SeiPro.sei && g.SeiPro.sei.adapter && g.SeiPro.sei.adapter.isNewSEI());
        g.pathArvore = modern ? '/infra_js/arvore/24/' : '/infra_js/arvore/';
        g.elemCheckbox = modern ? '.infraCheckboxInput' : '.infraCheckbox';
    } catch (e) {
        g.pathArvore = g.pathArvore || '/infra_js/arvore/';
        g.elemCheckbox = g.elemCheckbox || '.infraCheckbox';
    }

    g.__SEI_PRO_LISTA_PROCESSOS_STATE_INSTALLED__ = true;
    return g;
}
