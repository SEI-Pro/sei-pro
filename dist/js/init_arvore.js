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
if (typeof Dropzone === 'undefined') {
    if (typeof loadStylePro === 'function') loadStylePro(getUrlExtension('css/dropzone.min.css'));
    $.getScript(getUrlExtension("js/lib/dropzone.min.js"));
}
if (typeof moment === 'undefined') $.getScript(getUrlExtension("js/lib/moment.min.js"));
if (typeof loadFunctionsPro === 'undefined') {
    $.getScript(getUrlExtension("js/sei-functions-pro.js")).then(function() {
        if (typeof loadSEIProArvore === 'undefined') $.getScript(getUrlExtension("js/sei-pro-arvore.js"));
    });
} else if (typeof loadSEIProArvore === 'undefined') {
    $.getScript(getUrlExtension("js/sei-pro-arvore.js"));
}
