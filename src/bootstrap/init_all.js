const compareVersionNumbers_initall = (v1, v2) => /^\d+(\.\d+)*$/.test(v1) && /^\d+(\.\d+)*$/.test(v2) ? ((a, b) => { for (let i = 0; i < Math.max(a.length, b.length); i++) { const n1 = +a[i] || 0, n2 = +b[i] || 0; if (n1 !== n2) return n1 > n2 ? 1 : -1; } return 0; })(v1.split('.'), v2.split('.')) : NaN;
var isNewSEI = $('#divInfraSidebarMenu ul#infraMenu').length ? true : false;
var isSEI_5 = isNewSEI && sessionStorage.getItem('versaoSei') && compareVersionNumbers_initall(sessionStorage.getItem('versaoSei'),'5') >= 0 ? true : false;
var frmEditor = SeiPro.sei.adapter.isSEI5() ? $('.infra-editor__editor-completo') : $('#frmEditor');

var seiProFunctionsLoaded = $.Deferred().resolve();
if (!frmEditor.length) {
    seiProFunctionsLoaded = $.getScript(getUrlExtension("js/sei-functions-pro.js"));
}

// [migrado para core/sei] getUrlExtension
// [migrado para core/sei] getManifestExtension
// [migrado para core/sei] loadFontIcons
// [migrado para core/sei] loadStylePro
// [migrado para core/sei] loadFilesUI
// [migrado para core/sei] pathExtensionSEIPro
// [migrado para core/sei] getPathExtensionPro
// [migrado para core/sei] setSessionNameSpace
// [migrado para core/sei] _P
// [migrado para core/sei] loadStyleDesign
function divDialogsPro() {
    var html_box = '<div class="divBoxPro" style="display: none;">'
                            +'  <div id="alertaBoxPro" style="display: none;"></div>'
                            +'  <div id="dialogBoxPro" style="display: none;"></div>'
                            +'  <div id="configBoxPro" style="display: none;"></div>'
                            +'  <div id="iframeBoxPro" style="display: none;"></div>'
                            +'  <div id="editorBoxPro" style="display: none;"></div>'
                            +'  <div id="printBoxPro" class="ck-content" style="display: none;"></div>'
                            +'</div>';
    $('.divBoxPro').remove();
    $('body').append(html_box);
}
function loadScriptProAll() {
    getPathExtensionPro();
    divDialogsPro();
    loadFilesUI();
	if (!frmEditor.length) {
        loadFontIcons('head');
        if (typeof jmespath === 'undefined') $.getScript(getUrlExtension("js/lib/jmespath.min.js"));
        if (typeof DOMPurify === 'undefined') $.getScript(getUrlExtension("js/lib/purify.min.js"));
        if (typeof moment === 'undefined') $.getScript(getUrlExtension("js/lib/moment.min.js"));
        if (typeof $.tablesorter === 'undefined') $.getScript(getUrlExtension("js/lib/jquery.tablesorter.combined.min.js"));
        if (typeof $().chosen === 'undefined') $.getScript(getUrlExtension("js/lib/chosen.jquery.min.js"));
        if (typeof Favico === 'undefined') $.getScript(getUrlExtension("js/lib/favico-0.3.10.min.js"));
        seiProFunctionsLoaded.done(function() {
            if (typeof initGlobalSignatureBlockIndicatorPro === 'function') initGlobalSignatureBlockIndicatorPro();
            if (typeof loadSEIProAll === 'undefined') $.getScript(getUrlExtension("js/sei-pro-all.js"));
        });
    }
}
if (getManifestExtension().short_name == 'SPro') {
    setTimeout(function(){ 
        if (sessionStorage.getItem('new_extension') === null){
            loadScriptProAll();
        } else {
            var URL_SPRO = pathExtensionSEIPro();
            var manifest = getManifestExtension();
            var VERSION_SPRO = manifest.version;
            var NAMESPACE_SPRO = manifest.short_name;
            setSessionNameSpace({URL_SPRO: URL_SPRO, NAMESPACE_SPRO: NAMESPACE_SPRO, VERSION_SPRO: VERSION_SPRO, ICON_SPRO: manifest.icons});
        }
    }, 1000);
} else {
    loadScriptProAll();
}
// secondClass=nenhum; parent (seiSlim_parent) + autoView (seiSlim_view quando divInfraAreaTelaE ausente)
loadStyleDesign(undefined, undefined, { parent: true, autoView: true });
