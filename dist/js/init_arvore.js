function getUrlExtension(url) {
    if (typeof browser === "undefined") {
        return chrome.extension.getURL(url);
    } else {
        return browser.runtime.getURL(url);
    }
}
function pathExtensionSEIPro() {
    var URL_SPRO = getUrlExtension("js/sei-pro.js");
        URL_SPRO = URL_SPRO.toString().replace('js/sei-pro.js', '');
    return URL_SPRO;
}
function loadFontIcons(elementTo) {
	$("<link/>", {
	   rel: "stylesheet",
	   type: "text/css",
       datastyle: "seipro-fonticon",
	   href: getUrlExtension("css/fontawesome.min.css")
        
	}).appendTo(elementTo);
    $('head').append("<style type='text/css' data-style='seipro-fonticon'>"
                    +"   @font-face {\n"
                    +"    font-family: \"Font Awesome 5 Free SEIPro\";\n"
                    +"    font-style: normal;\n"
                    +"    font-weight: 900;\n"
                    +"    font-display: block;\n"
                    +"    src: url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.eot);\n"
                    +"    src: url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.eot?#iefix) format(\"embedded-opentype\"),url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.woff2) format(\"woff2\"),url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.woff) format(\"woff\"),url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.ttf) format(\"truetype\"),url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.svg#fontawesome) format(\"svg\")\n"
                    +"}\n"
                    +"@font-face {\n"
                    +"    font-family: \"Font Awesome 5 Free SEIPro\";\n"
                    +"    font-style: normal;\n"
                    +"    font-weight: 400;\n"
                    +"    font-display: block;\n"
                    +"    src: url("+pathExtensionSEIPro()+"webfonts/fa-regular-400.eot);\n"
                    +"    src: url("+pathExtensionSEIPro()+"webfonts/fa-regular-400.eot?#iefix) format(\"embedded-opentype\"),url("+pathExtensionSEIPro()+"webfonts/fa-regular-400.woff2) format(\"woff2\"),url("+pathExtensionSEIPro()+"webfonts/fa-regular-400.woff) format(\"woff\"),url("+pathExtensionSEIPro()+"webfonts/fa-regular-400.ttf) format(\"truetype\"),url("+pathExtensionSEIPro()+"webfonts/fa-regular-400.svg#fontawesome) format(\"svg\")\n"
                    +"}\n"
                    +"</style>");
}

loadFontIcons('head');
$.getScript(getUrlExtension("js/lib/jquery.toolbar.min.js"));
$.getScript(getUrlExtension("js/lib/jmespath.min.js"));
$.getScript(getUrlExtension("js/lib/dropzone.min.js"));
$.getScript(getUrlExtension("js/lib/moment.min.js"));
$.getScript(getUrlExtension("js/sei-functions-pro.js"));
$.getScript(getUrlExtension("js/sei-pro-arvore.js"));