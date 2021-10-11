$.getScript(getUrlExtension("js/sei-functions-pro.js"));

function getUrlExtension(url) {
    if (typeof browser === "undefined") {
        return chrome.extension.getURL(url);
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
function loadFontIcons(elementTo) {
    if ($('link[data-style="seipro-fonticon"]').length == 0 && $('style[data-style="seipro-fonticon"]').length == 0) {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            datastyle: "seipro-fonticon",
            href: getUrlExtension("css/fontawesome.min.css")
        }).appendTo(elementTo);
        $('head').prepend("<style type='text/css' data-style='seipro-fonticon'> "
                        +"   @font-face { font-family: \"Font Awesome 5 Free SEIPro\"; font-style: normal; font-weight: 900; font-display: block; src: url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.eot); src: url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.eot?#iefix) format(\"embedded-opentype\"),url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.woff2) format(\"woff2\"),url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.woff) format(\"woff\"),url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.ttf) format(\"truetype\"),url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.svg#fontawesome) format(\"svg\") }"
                        +"</style>");
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
        var scriptText =    "<script data-config='config-seipro'>\n"+
                            "   var URL_SPRO = '"+URL_SPRO+"';\n"+
                            "   var VERSION_SPRO = '"+VERSION_SPRO+"';\n"+
                            "   var NAMESPACE_SPRO = '"+NAMESPACE_SPRO+"';\n"+
                            "</script>";
        $(scriptText).appendTo('head');

        if (NAMESPACE_SPRO != 'SPro') {
            sessionStorage.setItem('other_extension', URL_SPRO);
        }
    }
}
function loadScriptProAll() {
    getPathExtensionPro();
	if (!$('#frmEditor').length) {
        loadFilesUI();
        loadFontIcons('head');
        $.getScript(getUrlExtension("js/lib/jmespath.min.js"));
        $.getScript(getUrlExtension("js/lib/moment.min.js"));
        $.getScript(getUrlExtension("js/lib/jquery.tablesorter.combined.min.js"));
        $.getScript(getUrlExtension("js/lib/chosen.jquery.min.js"));
        $.getScript(getUrlExtension("js/sei-pro-all.js"));
    }
}
if (getManifestExtension().short_name == 'SPro') {
    setTimeout(function(){ 
        if (sessionStorage.getItem('other_extension') === null){
            loadScriptProAll();
            console.log('@@@ LOADING SPRO ALL');
        } else {
            console.log('&&&&&&& RECUSE SPRO ALL');
        }
    }, 1000);
} else {
    loadScriptProAll();
}