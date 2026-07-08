// [migrado para core/sei] getUrlExtension
// [migrado para core/sei] pathExtensionSEIPro
// [migrado para core/sei] loadFontIcons
// [migrado para core/sei] verifyConfigValue
// [migrado para src/features/quick-highlight] highlight de pesquisa rápida no
//   visualizador (quickVisualizacao*) — agora bundle isolado js/quick-highlight.bundle.js
function initNewIcons(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof parent.insertNewIcons !== 'undefined' ) {
        parent.insertNewIcons();
    } else {
        setTimeout(function(){
            initNewIcons(TimeOut - 100);
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initNewIcons', typeof parent.insertNewIcons);
        }, 500);
    }
}
// [migrado para core/sei] loadStyleDesign
// secondClass='view' (seiSlim_view); viewerExtras -> seiBtnRight / seiIconLabel
loadStyleDesign(undefined, 'view', { viewerExtras: true });
loadFontIcons('head');
setTimeout(() => {
    if ($('#ifrConteudoVisualizacao, #ifrVisualizacao').length) {
        loadFontIcons('head', $('#ifrConteudoVisualizacao, #ifrVisualizacao').contents());
    }
}, 500);
if (typeof loadFunctionsPro === 'undefined') $.getScript(getUrlExtension("js/sei-functions-pro.js"));
if (typeof loadSEIProVisualizacao === 'undefined') $.getScript(getUrlExtension("js/sei-pro-visualizacao.js"));





