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
            "data-style": "seipro-fonticon",
            href: getUrlExtension("css/fontawesome.pro.min.css") 
        }).appendTo(target.find(elementTo));

        var htmlStyleFont = '<style type="text/css" data-style="seipro-fonticon" data-index="3">'+
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
function normalizeQuickVisualizacaoText(text) {
    text = (typeof text === 'string') ? text : '';
    if (typeof removeAcentos === 'function') {
        text = removeAcentos(text.toLowerCase());
    } else {
        text = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return text.replace(/\s+/g, ' ').trim();
}
function getQuickVisualizacaoTokens(text) {
    var query = normalizeQuickVisualizacaoText(text);
    return query === '' ? [] : query.split(' ').filter(function(token){ return token !== ''; });
}
function clearQuickVisualizacaoHighlights(rootDoc) {
    $(rootDoc).find('.seiProQuickPageHighlight').each(function(){
        $(this).replaceWith(rootDoc.createTextNode($(this).text()));
    });
    if (rootDoc.body && typeof rootDoc.body.normalize === 'function') {
        rootDoc.body.normalize();
    }
}
function shouldSkipQuickVisualizacaoNode(node) {
    if (!node || !node.parentNode) return true;
    var parentNode = node.parentNode;
    if (parentNode.nodeType !== 1) return false;
    var parentElem = $(parentNode);
    if (parentElem.closest('script, style, noscript, textarea, title').length > 0) return true;
    if (parentElem.closest('.seiProQuickPageHighlight').length > 0) return true;
    return false;
}
function buildQuickVisualizacaoRanges(text, tokens) {
    var ranges = [];
    var normalizedText = normalizeQuickVisualizacaoText(text);

    tokens.forEach(function(token){
        var startIndex = 0;
        while (startIndex < normalizedText.length) {
            var foundAt = normalizedText.indexOf(token, startIndex);
            if (foundAt === -1) break;
            ranges.push({ start: foundAt, end: foundAt + token.length });
            startIndex = foundAt + token.length;
        }
    });

    ranges.sort(function(a, b){ return a.start - b.start; });
    return ranges.reduce(function(merged, current){
        if (!merged.length) {
            merged.push(current);
            return merged;
        }
        var previous = merged[merged.length - 1];
        if (current.start <= previous.end) {
            previous.end = Math.max(previous.end, current.end);
        } else {
            merged.push(current);
        }
        return merged;
    }, []);
}
function highlightQuickVisualizacaoTextNode(node, tokens, rootDoc) {
    var text = node.nodeValue;
    if (!text || !text.trim()) return;

    var ranges = buildQuickVisualizacaoRanges(text, tokens);
    if (!ranges.length) return;

    var fragment = rootDoc.createDocumentFragment();
    var cursor = 0;

    ranges.forEach(function(range){
        if (range.start > cursor) {
            fragment.appendChild(rootDoc.createTextNode(text.slice(cursor, range.start)));
        }
        var span = rootDoc.createElement('span');
        span.className = 'seiProQuickPageHighlight';
        span.style.background = '#ffef86';
        span.style.color = 'inherit';
        span.style.borderRadius = '2px';
        span.style.boxShadow = 'inset 0 -1px 0 rgba(0, 0, 0, 0.18)';
        span.style.padding = '0 1px';
        span.textContent = text.slice(range.start, range.end);
        fragment.appendChild(span);
        cursor = range.end;
    });

    if (cursor < text.length) {
        fragment.appendChild(rootDoc.createTextNode(text.slice(cursor)));
    }

    node.parentNode.replaceChild(fragment, node);
}
function applyQuickVisualizacaoHighlightInDocument(rootDoc, value) {
    if (!rootDoc || !rootDoc.body) return;

    var tokens = getQuickVisualizacaoTokens(value);
    clearQuickVisualizacaoHighlights(rootDoc);
    if (!tokens.length) return;

    var walker = rootDoc.createTreeWalker(rootDoc.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            return shouldSkipQuickVisualizacaoNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
    });

    var textNodes = [];
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    textNodes.forEach(function(node){
        highlightQuickVisualizacaoTextNode(node, tokens, rootDoc);
    });
}
function applyQuickVisualizacaoHighlight(value) {
    applyQuickVisualizacaoHighlightInDocument(document, value);

    $('#ifrConteudoVisualizacao, #ifrVisualizacao').each(function(){
        try {
            var childDoc = this.contentDocument || ($(this).contents().length ? $(this).contents()[0] : null);
            applyQuickVisualizacaoHighlightInDocument(childDoc, value);
        } catch (error) {}
    });
}
function getQuickVisualizacaoSearchInput() {
    try {
        if (parent && parent.document) {
            var parentInput = parent.document.getElementById('txtPesquisaRapida');
            if (parentInput) return parentInput;
        }
    } catch (error) {}
    try {
        if (parent && parent.parent && parent.parent.document) {
            var topInput = parent.parent.document.getElementById('txtPesquisaRapida');
            if (topInput) return topInput;
        }
    } catch (error) {}
    return null;
}
function initQuickPageHighlightVisualizacao() {
    var input = getQuickVisualizacaoSearchInput();
    if (!input) return;

    if (window.__SEI_PRO_QUICK_VISUALIZACAO_HANDLER__) {
        input.removeEventListener('input', window.__SEI_PRO_QUICK_VISUALIZACAO_HANDLER__);
        input.removeEventListener('keydown', window.__SEI_PRO_QUICK_VISUALIZACAO_KEYDOWN__);
    }

    window.__SEI_PRO_QUICK_VISUALIZACAO_HANDLER__ = function() {
        applyQuickVisualizacaoHighlight(input.value || '');
    };
    window.__SEI_PRO_QUICK_VISUALIZACAO_KEYDOWN__ = function(event) {
        if (event.key === 'Escape') {
            applyQuickVisualizacaoHighlight('');
        }
    };

    input.addEventListener('input', window.__SEI_PRO_QUICK_VISUALIZACAO_HANDLER__);
    input.addEventListener('keydown', window.__SEI_PRO_QUICK_VISUALIZACAO_KEYDOWN__);
    applyQuickVisualizacaoHighlight(input.value || '');
}
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
initQuickPageHighlightVisualizacao();
setTimeout(() => {
    if ($('#ifrConteudoVisualizacao, #ifrVisualizacao').length) {
        loadFontIcons('head', $('#ifrConteudoVisualizacao, #ifrVisualizacao').contents());
        initQuickPageHighlightVisualizacao();
    }
}, 500);
if (typeof loadFunctionsPro === 'undefined') $.getScript(getUrlExtension("js/sei-functions-pro.js"));
if (typeof loadSEIProVisualizacao === 'undefined') $.getScript(getUrlExtension("js/sei-pro-visualizacao.js"));
