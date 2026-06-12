function getUrlExtension(url) {
    if (typeof browser === "undefined") {
        return chrome.runtime.getURL(url);
    } else {
        return browser.runtime.getURL(url);
    }
}
function pathExtensionSEIPro() {
    var URL_SPRO = getUrlExtension("js/sei-pro.js");
        URL_SPRO = URL_SPRO.toString().replace('js/sei-pro.js', '');
    return URL_SPRO;
}
function loadFontIcons(elementTo, target = $('html')) {
    var iconBoxSlim = (localStorage.getItem('seiSlim')) ? true : false;
    var pathExtension = pathExtensionSEIPro();
    if (target.find('link[data-style="seipro-fonticon"]').length == 0 && target.find('style[data-style="seipro-fonticon"]').length == 0) {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            datastyle: "seipro-fonticon",
            href: getUrlExtension("css/fontawesome.pro.min.css") 
        }).appendTo(elementTo);
        
        var htmlStyleFont = '<style type="text/css" data-style="seipro-fonticon" data-index="2">'+
                            '    @font-face {\n'+
                            '       font-family: "Font Awesome 5 Pro";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 900;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-solid-900.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-solid-900.eot?#iefix) format("embedded-opentype"),url('+pathExtension+'webfonts/pro/fa-solid-900.woff2) format("woff2"),url('+pathExtension+'webfonts/pro/fa-solid-900.woff) format("woff"),url('+pathExtension+'webfonts/pro/fa-solid-900.ttf) format("truetype"),url('+pathExtension+'webfonts/pro/fa-solid-900.svg#fontawesome) format("svg") !important;\n'+
                            '   }\n'+
                            '   @font-face {\n'+
                            '       font-family: \"Font Awesome 5 Pro";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 400;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-regular-400.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-regular-400.eot?#iefix) format("embedded-opentype"),url('+pathExtension+'webfonts/pro/fa-regular-400.woff2) format("woff2"),url('+pathExtension+'webfonts/pro/fa-regular-400.woff) format("woff"),url('+pathExtension+'webfonts/pro/fa-regular-400.ttf) format("truetype"),url('+pathExtension+'webfonts/pro/fa-regular-400.svg#fontawesome) format("svg") !important;\n'+
                            '   }\n'+
                            (iconBoxSlim ?
                            '   @font-face { \n'+
                            '       font-family: "Font Awesome 5 Pro";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 300;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-light-300.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-light-300.eot?#iefix) format("embedded-opentype"), url('+pathExtension+'webfonts/pro/fa-light-300.woff2) format("woff2"), url('+pathExtension+'webfonts/pro/fa-light-300.woff) format("woff"), url('+pathExtension+'webfonts/pro/fa-light-300.ttf) format("truetype"), url('+pathExtension+'webfonts/pro/fa-light-300.svg#fontawesome) format("svg") !important; }\n'+
                            '   }\n'+
                            '   @font-face {\n'+
                            '       font-family: \"Font Awesome 5 Duotone\";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 900;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-duotone-900.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-duotone-900.eot?#iefix) format(\"embedded-opentype\"), url('+pathExtension+'webfonts/pro/fa-duotone-900.woff2) format("woff2"), url('+pathExtension+'webfonts/pro/fa-duotone-900.woff) format("woff"), url('+pathExtension+'webfonts/pro/fa-duotone-900.ttf) format("truetype"), url('+pathExtension+'webfonts/pro/fa-duotone-900.svg#fontawesome) format("svg") !important; }\n'+
                            '   }\n'
                            : '')
                            '</style>';
        target.find('head').append(htmlStyleFont);
    }
}
function loadStyleDesign() {
    var body = document.body;
    if (localStorage.getItem('seiSlim')) {
        body.classList.add("seiSlim");
        body.classList.add("seiSlim_arvore");
        if (localStorage.getItem('darkModePro')) {
            body.classList.add("dark-mode");
        }
    }
    if (parent.isNewSEI) {
        body.classList.add("newSEI");
    }
}
loadStyleDesign();
loadFontIcons('head');
if (typeof $().toolbar === 'undefined') $.getScript(getUrlExtension("js/lib/jquery.toolbar.min.js"));
if (typeof jmespath === 'undefined') $.getScript(getUrlExtension("js/lib/jmespath.min.js"));
if (typeof DOMPurify === 'undefined') $.getScript(getUrlExtension("js/lib/purify.min.js"));
if (typeof Dropzone === 'undefined') $.getScript(getUrlExtension("js/lib/dropzone.min.js"));
// ─── FIX: carregamento sequencial e seguro no contexto do ifrArvore ────────
//
// PROBLEMA RAIZ: $.getScript() injeta um <script> no DOM da PÁGINA (não no
// isolated world da extensão), portanto o código executa no contexto window
// da página. No ifrArvore, a página SEI tem jQuery mas NÃO tem jQuery UI
// (.dialog, .resizable, .sortable, .tablesorter). Isso causava:
//   - "$.(...).dialog is not a function"    (sei-functions-pro.js)
//   - "$.(...).html(...).dialog is not a function" (sei-pro-docs-lote.js)
//   - "moment is not defined"  (typeof moment.duration falha pois moment
//     é definido no contexto da página, não no isolated world)
//
// SOLUÇÃO: carregar jQuery UI antes de sei-functions-pro.js, e tratar
// o carregamento de moment sem acessar propriedades encadeadas com typeof.
// ─────────────────────────────────────────────────────────────────────────

function _seiProLoadMoment() {
    // Usa window.moment para verificar se está no contexto da página
    if (typeof window.moment === 'undefined') {
        $.getScript(getUrlExtension("js/lib/moment.min.js"), function() {
            // Carrega plugins após moment estar disponível
            $.getScript(getUrlExtension("js/lib/moment-weekday-calc.js"));
            $.getScript(getUrlExtension("js/lib/moment-duration-format.min.js"));
        });
    } else {
        // moment já carregado; verifica plugins
        try {
            if (typeof window.moment.duration.fn.format === 'undefined') {
                $.getScript(getUrlExtension("js/lib/moment-duration-format.min.js"));
            }
        } catch(e) {
            $.getScript(getUrlExtension("js/lib/moment-duration-format.min.js"));
        }
    }
}

function _seiProLoadScripts() {
    if (!document.head) {
        setTimeout(_seiProLoadScripts, 100);
        return;
    }

    // PASSO 1: garante jQuery UI antes de sei-functions-pro.js
    // (sem jQuery UI, .dialog()/.resizable()/.sortable() lançam TypeError)
    var _loadWithUI = function() {
        _seiProLoadMoment();
        // tablesorter: necessário para as tabelas do Ações em Lote
        if (typeof $.tablesorter === 'undefined') {
            $.getScript(getUrlExtension("js/lib/jquery.tablesorter.combined.min.js"));
        }
        if (typeof loadFunctionsPro === 'undefined') {
            $.getScript(getUrlExtension("js/sei-functions-pro.js"), function() {
                if (typeof loadSEIProArvore === 'undefined') {
                    $.getScript(getUrlExtension("js/sei-pro-arvore.js"));
                }
            });
        } else {
            if (typeof loadSEIProArvore === 'undefined') {
                $.getScript(getUrlExtension("js/sei-pro-arvore.js"));
            }
        }
    };

    // Sempre carrega jQuery UI incondicionalmente:
    // typeof $.fn.dialog avalia o isolated world (que JÁ tem jQuery UI),
    // não o contexto da página onde o código realmente executa.
    $.getScript(getUrlExtension("js/lib/jquery-ui.min.js"), _loadWithUI);
}
_seiProLoadScripts();

