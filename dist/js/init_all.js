var isNewSEI = $('#divInfraSidebarMenu ul#infraMenu').length ? true : false;

if ($('#frmEditor').length == 0)  {
    $.getScript(getUrlExtension("js/sei-functions-pro.js")); 
}

function getUrlExtension(url) {
    if (typeof browser === "undefined") {
        return chrome.runtime.getURL(url);
    } else {
        return browser.runtime.getURL(url);
    }
}
function getManifestExtension() {
    if (typeof browser === "undefined") {
        return chrome.runtime.getManifest();
    } else {
        return browser.runtime.getManifest();
    }
}
function loadFontIcons(elementTo, target = $('html')) {
    var iconBoxSlim = (localStorage.getItem('seiSlim')) ? true : false;
    var pathExtension = pathExtensionSEIPro();
    if (target.find('link[data-style="seipro-fonticon"]').length == 0 && target.find('style[data-style="seipro-fonticon"]').length == 0) {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            datastyle: "seipro-fonticon",
            href: getUrlExtension(iconBoxSlim ? "css/fontawesome.pro.min.css" : "css/fontawesome.min.css") 
        }).appendTo(target.find(elementTo));
        
        var htmlStyleFont = '<style type="text/css" data-style="seipro-fonticon" data-index="1">'+
                            '    @font-face {\n'+
                            '       font-family: "Font Awesome 5 '+(iconBoxSlim ? 'Pro' : 'Free')+'";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 900;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.eot?#iefix) format("embedded-opentype"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.woff2) format("woff2"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.woff) format("woff"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.ttf) format("truetype"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.svg#fontawesome) format("svg") !important;\n'+
                            '   }\n'+
                            '   @font-face {\n'+
                            '       font-family: \"Font Awesome 5 '+(iconBoxSlim ? 'Pro' : 'Free')+'";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 400;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.eot?#iefix) format("embedded-opentype"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.woff2) format("woff2"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.woff) format("woff"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.ttf) format("truetype"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.svg#fontawesome) format("svg") !important;\n'+
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
function loadStylePro(url, elementTo) {
    if ($('link[data-style="seipro-style"]').length == 0) {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            datastyle: "seipro-style",
            href: url
        }).appendTo(elementTo);
    }
}
function loadFilesUI() {
    $.getScript(getUrlExtension('js/lib/jquery-ui.min.js'));
    loadStylePro(getUrlExtension('css/jquery-ui.css'), 'head');
}
function pathExtensionSEIPro() {
    var URL_SPRO = getUrlExtension("js/sei-pro.js");
        URL_SPRO = URL_SPRO.toString().replace('js/sei-pro.js', '');
    return URL_SPRO;
}
function getPathExtensionPro() {
    if ($('script[data-config="config-seipro"]').length == 0) {
        var URL_SPRO = pathExtensionSEIPro();
        var manifest = getManifestExtension();
        var VERSION_SPRO = manifest.version;
        var NAMESPACE_SPRO = manifest.short_name;
        var URLPAGES_SPRO = manifest.homepage_url;
        setSessionNameSpace({URL_SPRO: URL_SPRO, NAMESPACE_SPRO: NAMESPACE_SPRO, URLPAGES_SPRO: URLPAGES_SPRO, VERSION_SPRO: VERSION_SPRO, ICON_SPRO: manifest.icons});
    }
}
function setSessionNameSpace(param) {
    sessionStorage.setItem((param.NAMESPACE_SPRO != 'SPro' ? 'new_extension' : 'old_extension'),  JSON.stringify(param));
}
function _P() { // get  Session Name Space
    return JSON.parse(sessionStorage.getItem('new_extension'));
}
function loadStyleDesign() {
    var body = document.body;
    if (localStorage.getItem('seiSlim')) {
    // if (localStorage.getItem('seiSlim') && !isNewSEI) {
        body.classList.add("seiSlim");
        body.classList.add("seiSlim_parent");
        if (document.getElementById("divInfraAreaTelaE") === null) body.classList.add("seiSlim_view");
        if (localStorage.getItem('darkModePro')) {
            body.classList.add("dark-mode");
        }
    }
}
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
	if (!$('#frmEditor').length) {
        divDialogsPro();
        loadFilesUI();
        loadFontIcons('head');
        $.getScript(getUrlExtension("js/lib/jmespath.min.js"));
        $.getScript(getUrlExtension("js/lib/moment.min.js"));
        $.getScript(getUrlExtension("js/lib/jquery.tablesorter.combined.min.js"));
        $.getScript(getUrlExtension("js/lib/chosen.jquery.min.js"));
        $.getScript(getUrlExtension("js/lib/favico-0.3.10.min.js"));
        $.getScript(getUrlExtension("js/sei-pro-all.js"));
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
loadStyleDesign();