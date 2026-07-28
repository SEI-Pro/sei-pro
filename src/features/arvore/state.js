/**
 * Árvore — mutable runtime state shared with the parent frame / inline handlers.
 * Installed on globalThis so bare identifiers in the migrated body keep working
 * inside the IIFE bundle (undeclared refs resolve on the global object).
 */
export function installArvoreState() {
    const g = globalThis;
    if (g.__SEI_PRO_ARVORE_STATE_INSTALLED__) return g;

    g.loadSEIProArvore = true;
    g.arrayLinksArvore = g.arrayLinksArvore || [];
    g.arrayLinksArvoreAll = g.arrayLinksArvoreAll || [];
    g.arrayIconsView = g.arrayIconsView || [];
    g.arrayLinksPage = g.arrayLinksPage || [];
    g.arvoreDropzone = g.arvoreDropzone || false;
    g.containerUpload = g.containerUpload || 'body';
    g.uploadArvoreDragBound = g.uploadArvoreDragBound || false;
    g.delayAjax = g.delayAjax || false;
    g.selectedItensPanelArvore = g.selectedItensPanelArvore || false;
    g.stickNoteDivSelected = g.stickNoteDivSelected || 0;

    const parent = g.parent || g;
    g.pathArvore = parent.isNewSEI ? '/infra_js/arvore/24/' : '/infra_js/arvore/';
    g.anchorDoc = parent.isSEI_5
        ? 'a[id*="anchorImg"][data-serialtip]'
        : 'a.clipboard[id*="anchorImg"]';

    g.__SEI_PRO_ARVORE_STATE_INSTALLED__ = true;
    return g;
}

export function getArvoreState() {
    return installArvoreState();
}
