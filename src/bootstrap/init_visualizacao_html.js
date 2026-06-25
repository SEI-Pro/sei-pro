// [migrado para core/sei] loadStyleDesign
// [migrado para core/sei] verifyConfigValue
function normalizeQuickVisualizacaoHtmlText(text) {
    text = (typeof text === 'string') ? text : '';
    if (typeof parent !== 'undefined' && typeof parent.removeAcentos === 'function') {
        text = parent.removeAcentos(text.toLowerCase());
    } else {
        text = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return text.replace(/\s+/g, ' ').trim();
}
function getQuickVisualizacaoHtmlTokens(text) {
    var query = normalizeQuickVisualizacaoHtmlText(text);
    return query === '' ? [] : query.split(' ').filter(function(token){ return token !== ''; });
}
function clearQuickVisualizacaoHtmlHighlights() {
    $('.seiProQuickPageHighlight').each(function(){
        $(this).replaceWith(document.createTextNode($(this).text()));
    });
    if (document.body && typeof document.body.normalize === 'function') {
        document.body.normalize();
    }
}
function shouldSkipQuickVisualizacaoHtmlNode(node) {
    if (!node || !node.parentNode) return true;
    var parentNode = node.parentNode;
    if (parentNode.nodeType !== 1) return false;
    var parentElem = $(parentNode);
    if (parentElem.closest('script, style, noscript, textarea, title').length > 0) return true;
    if (parentElem.closest('.seiProQuickPageHighlight').length > 0) return true;
    return false;
}
function buildQuickVisualizacaoHtmlRanges(text, tokens) {
    var ranges = [];
    var normalizedText = normalizeQuickVisualizacaoHtmlText(text);

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
function highlightQuickVisualizacaoHtmlTextNode(node, tokens) {
    var text = node.nodeValue;
    if (!text || !text.trim()) return;

    var ranges = buildQuickVisualizacaoHtmlRanges(text, tokens);
    if (!ranges.length) return;

    var fragment = document.createDocumentFragment();
    var cursor = 0;

    ranges.forEach(function(range){
        if (range.start > cursor) {
            fragment.appendChild(document.createTextNode(text.slice(cursor, range.start)));
        }
        var span = document.createElement('span');
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
        fragment.appendChild(document.createTextNode(text.slice(cursor)));
    }

    node.parentNode.replaceChild(fragment, node);
}
function applyQuickVisualizacaoHtmlHighlight(value) {
    var tokens = getQuickVisualizacaoHtmlTokens(value);
    clearQuickVisualizacaoHtmlHighlights();
    if (!tokens.length) return;

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            return shouldSkipQuickVisualizacaoHtmlNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
    });

    var textNodes = [];
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    textNodes.forEach(function(node){
        highlightQuickVisualizacaoHtmlTextNode(node, tokens);
    });
}
function getQuickVisualizacaoHtmlSearchInput() {
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
function initQuickPageHighlightVisualizacaoHtml() {
    var input = getQuickVisualizacaoHtmlSearchInput();
    if (!input) return;

    if (window.__SEI_PRO_QUICK_VISUALIZACAO_HTML_HANDLER__) {
        input.removeEventListener('input', window.__SEI_PRO_QUICK_VISUALIZACAO_HTML_HANDLER__);
        input.removeEventListener('keydown', window.__SEI_PRO_QUICK_VISUALIZACAO_HTML_KEYDOWN__);
    }

    window.__SEI_PRO_QUICK_VISUALIZACAO_HTML_HANDLER__ = function() {
        applyQuickVisualizacaoHtmlHighlight(input.value || '');
    };
    window.__SEI_PRO_QUICK_VISUALIZACAO_HTML_KEYDOWN__ = function(event) {
        if (event.key === 'Escape') {
            applyQuickVisualizacaoHtmlHighlight('');
        }
    };

    input.addEventListener('input', window.__SEI_PRO_QUICK_VISUALIZACAO_HTML_HANDLER__);
    input.addEventListener('keydown', window.__SEI_PRO_QUICK_VISUALIZACAO_HTML_KEYDOWN__);
    applyQuickVisualizacaoHtmlHighlight(input.value || '');
}
function initLinhaNumerada(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof parent.parent.getLinhaNumerada !== 'undefined') { 
        parent.parent.getLinhaNumerada();
    } else if (parent.window.name != 'ifrConteudoVisualizacao') {
        setTimeout(function(){ 
            initLinhaNumerada(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initLinhaNumerada'); 
        }, 500);
    }
}
function initRepareBgTableColor(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof parent.parent.getBrightnessColor !== 'undefined') { 
        repareBgTableColor();
    } else {
        setTimeout(function(){ 
            initRepareBgTableColor(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload repareBgTableColor'); 
        }, 500);
    }
}
function repareBgTableColor() {
    $('body').find('span[style*="background-color"], tr[style*="background-color"],td[style*="background-color"]').each(function(){
        setBgTableColor(this);
    });
}
function setBgTableColor(this_) {
    var bgColor = $(this_).css('background-color');
    if (typeof bgColor !== 'undefined' && bgColor !== null) {
        var brightness = parent.parent.getBrightnessColor(parent.parent.rgbToHexString(bgColor));
        var textColour = (brightness > 125) ? 'black' : 'white';
        $(this_).addClass('dark-mode-color-'+textColour);
    }
}
function debugListStylesheetsVisualizacaoHtml() {
    if (typeof verifyConfigValue !== 'function' || !verifyConfigValue('debugpage')) {
        return;
    }
    var stylesheets = $('link[rel="stylesheet"]').map(function() {
        return {
            href: $(this).attr('href') || '',
            id: $(this).attr('id') || '',
            className: $(this).attr('class') || '',
            dataStyle: $(this).attr('data-style') || '',
            outerHTML: this.outerHTML || ''
        };
    }).get();
    console.log('SEI Pro stylesheet audit', stylesheets);
    stylesheets.forEach(function(sheet) {
        if (sheet.href && sheet.href.indexOf('controlador.php?acao=arvore_processar_html') !== -1) {
            console.warn('SEI Pro suspected broken stylesheet URL', sheet.href, sheet.outerHTML);
        }
    });
}
// secondClass='html' (seiSlim_html); htmlExtras -> CSS extra de dark-mode + initRepareBgTableColor()
loadStyleDesign(undefined, 'html', { htmlExtras: true });
initQuickPageHighlightVisualizacaoHtml();
initLinhaNumerada();
debugListStylesheetsVisualizacaoHtml();
