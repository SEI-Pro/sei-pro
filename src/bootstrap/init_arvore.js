// [migrado para core/sei] getUrlExtension
// [migrado para core/sei] pathExtensionSEIPro
// [migrado para core/sei] loadFontIcons
// [migrado para core/sei] loadStyleDesign
// secondClass='arvore' (seiSlim_arvore); checkParentNewSEI -> classe newSEI quando parent.isNewSEI
loadStyleDesign(undefined, 'arvore', { checkParentNewSEI: true });
loadFontIcons('head');
if (typeof $().toolbar === 'undefined') $.getScript(getUrlExtension("js/lib/jquery.toolbar.min.js"));
if (typeof jmespath === 'undefined') $.getScript(getUrlExtension("js/lib/jmespath.min.js"));
if (typeof DOMPurify === 'undefined') $.getScript(getUrlExtension("js/lib/purify.min.js"));
// Dropzone removido — upload usa src/shared/ui/file-queue.js (vanilla)
if (typeof moment === 'undefined') $.getScript(getUrlExtension("js/lib/moment.min.js"));
if (typeof loadFunctionsPro === 'undefined') {
    const legacyReady = typeof loadFunctionsPro === 'undefined'
        ? $.getScript(getUrlExtension("js/legacy-context.bundle.js"))
        : $.Deferred().resolve();
    legacyReady.then(function() {
        if (typeof loadSEIProArvore === 'undefined') $.getScript(getUrlExtension("js/sei-pro-arvore.js"));
    });
} else if (typeof loadSEIProArvore === 'undefined') {
    $.getScript(getUrlExtension("js/sei-pro-arvore.js"));
}
