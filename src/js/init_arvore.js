function getUrlExtension(url) {
    if (typeof browser === "undefined") {
        return chrome.extension.getURL(url);
    } else {
        return browser.runtime.getURL(url);
    }
}
function loadFontIcons(elementTo) {
	$("<link/>", {
	   rel: "stylesheet",
	   type: "text/css",
	   href: getUrlExtension("css/fontawesome.min.css")
        
	}).appendTo(elementTo);
}
loadFontIcons('head');
$.getScript(getUrlExtension("js/lib/jquery.toolbar.min.js"));
$.getScript(getUrlExtension("js/sei-functions-pro.js"));
$.getScript(getUrlExtension("js/sei-pro-arvore.js"));