$.getScript(getUrlExtension("js/sei-functions-pro.js"));

function getUrlExtension(url) {
    if (typeof browser === "undefined") {
        return chrome.extension.getURL(url);
    } else {
        return browser.runtime.getURL(url);
    }
}
function getVersionExtension() {
    if (typeof browser === "undefined") {
        return chrome.runtime.getManifest().version;
    } else {
        return browser.runtime.getManifest().version;
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
    var URL_SEIPRO = getUrlExtension("js/sei-pro.js");
        URL_SEIPRO = URL_SEIPRO.toString().replace('js/sei-pro.js', '');
    return URL_SEIPRO;
}
function getPathExtensionPro() {
    if ($('script[data-config="config-seipro"]').length == 0) {
        var URL_SEIPRO = pathExtensionSEIPro();
        var scriptText =    "<script data-config='config-seipro'>\n"+
                            "   var URL_SEIPRO = '"+URL_SEIPRO+"';\n"+
                            "   var VERSION_SEIPRO = '"+getVersionExtension()+"';\n"+
                            "</script>";
        $(scriptText).appendTo('head');
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
loadScriptProAll();