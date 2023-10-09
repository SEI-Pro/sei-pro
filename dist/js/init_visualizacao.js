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
            href: getUrlExtension(iconBoxSlim ? "css/fontawesome.pro.min.css" : "css/fontawesome.min.css") 
        }).appendTo(target.find(elementTo));
        
        var htmlStyleFont = '<style type="text/css" data-style="seipro-fonticon" data-index="3">'+
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
function verifyConfigValue(name) {
    var configBasePro = ( typeof localStorage.getItem('configBasePro') !== 'undefined' && localStorage.getItem('configBasePro') != '' ) ? JSON.parse(localStorage.getItem('configBasePro')) : [];
    var dataValuesConfig = (typeof jmespath !== 'undefined') ? jmespath.search(configBasePro, "[*].configGeral | [0]") : false;
        dataValuesConfig = (typeof jmespath !== 'undefined') ? jmespath.search(dataValuesConfig, "[?name=='"+name+"'].value | [0]") : false;
        dataValuesConfig = (dataValuesConfig !== null) ? dataValuesConfig : false;
    
    if (dataValuesConfig == true ) {
        return true;
    } else {
        return false;
    }
}
function initNewIcons(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof parent.insertNewIcons !== 'undefined' ) { 
        parent.insertNewIcons();
    } else {
        setTimeout(function(){ 
            initNewIcons(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initNewIcons', typeof parent.insertNewIcons); 
        }, 500);
    }
}
function loadStyleDesign() {
    var body = document.body;
    if (localStorage.getItem('seiSlim')) {
        body.classList.add("seiSlim");
        body.classList.add("seiSlim_view");
        if (localStorage.getItem('darkModePro')) {
            body.classList.add("dark-mode");
        }
        if (localStorage.getItem('seiBtnRight')) {
            body.classList.add("seiBtnRight");
        }
        if (localStorage.getItem('iconLabel')) {
            body.classList.add("seiIconLabel");
        }
        // initNewIcons();
    }
}
loadStyleDesign();
loadFontIcons('head');
$.getScript(getUrlExtension("js/sei-functions-pro.js"));
$.getScript(getUrlExtension("js/sei-pro-visualizacao.js"));