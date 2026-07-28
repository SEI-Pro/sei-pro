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
        const adapter = g.SeiPro && g.SeiPro.sei && g.SeiPro.sei.adapter;
        const isNew = typeof g.isNewSEI !== 'undefined' && adapter && adapter.isNewSEI();
        g.pathArvore = isNew ? '/infra_js/arvore/24/' : '/infra_js/arvore/';
        g.elemCheckbox = isNew ? '.infraCheckboxInput' : '.infraCheckbox';
    } catch (e) {
        g.pathArvore = g.pathArvore || '/infra_js/arvore/';
        g.elemCheckbox = g.elemCheckbox || '.infraCheckbox';
    }

    g.__SEI_PRO_LISTA_PROCESSOS_STATE_INSTALLED__ = true;
    return g;
}
