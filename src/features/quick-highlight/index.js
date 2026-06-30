/**
 * Feature "highlight de pesquisa rápida" no visualizador de documentos.
 * Origem: dist/js/init_visualizacao.js (funções quickVisualizacao*).
 *
 * Porte isolated-first, SEM jQuery (TreeWalker + querySelector nativos). Não usa
 * parent.* nem o stack legado — por isso é destacável como bundle próprio
 * (padrão arvore-info). Roda no frame do visualizador (arvore_visualizar etc.),
 * escuta o #txtPesquisaRapida do frame pai e destaca document + iframes filhos.
 */
import { getQuickTokens, buildQuickRanges } from './core.js';

const HL_CLASS = 'seipro-quick-highlight';

function clearHighlights(rootDoc) {
    rootDoc.querySelectorAll('.' + HL_CLASS).forEach(function (span) {
        span.replaceWith(rootDoc.createTextNode(span.textContent));
    });
    if (rootDoc.body && typeof rootDoc.body.normalize === 'function') rootDoc.body.normalize();
}

function shouldSkipNode(node) {
    if (!node || !node.parentNode) return true;
    const parentNode = node.parentNode;
    if (parentNode.nodeType !== 1) return false;
    if (parentNode.closest('script, style, noscript, textarea, title')) return true;
    if (parentNode.closest('.' + HL_CLASS)) return true;
    return false;
}

function highlightTextNode(node, tokens, rootDoc) {
    const text = node.nodeValue;
    if (!text || !text.trim()) return;
    const ranges = buildQuickRanges(text, tokens);
    if (!ranges.length) return;
    const fragment = rootDoc.createDocumentFragment();
    let cursor = 0;
    ranges.forEach(function (range) {
        if (range.start > cursor) fragment.appendChild(rootDoc.createTextNode(text.slice(cursor, range.start)));
        const span = rootDoc.createElement('span');
        span.className = HL_CLASS;
        span.style.cssText = 'background:#ffef86;color:inherit;border-radius:2px;box-shadow:inset 0 -1px 0 rgba(0,0,0,0.18);padding:0 1px;';
        span.textContent = text.slice(range.start, range.end);
        fragment.appendChild(span);
        cursor = range.end;
    });
    if (cursor < text.length) fragment.appendChild(rootDoc.createTextNode(text.slice(cursor)));
    node.parentNode.replaceChild(fragment, node);
}

function applyInDocument(rootDoc, value) {
    if (!rootDoc || !rootDoc.body) return;
    const tokens = getQuickTokens(value);
    clearHighlights(rootDoc);
    if (!tokens.length) return;
    const walker = rootDoc.createTreeWalker(rootDoc.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
            return shouldSkipNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(function (node) { highlightTextNode(node, tokens, rootDoc); });
}

function applyHighlight(value) {
    applyInDocument(document, value);
    document.querySelectorAll('#ifrConteudoVisualizacao, #ifrVisualizacao').forEach(function (ifr) {
        try {
            applyInDocument(ifr.contentDocument || null, value);
        } catch (e) { /* cross-origin */ }
    });
}

function getSearchInput() {
    try {
        if (parent && parent.document) {
            const el = parent.document.getElementById('txtPesquisaRapida');
            if (el) return el;
        }
    } catch (e) {}
    try {
        if (parent && parent.parent && parent.parent.document) {
            const el = parent.parent.document.getElementById('txtPesquisaRapida');
            if (el) return el;
        }
    } catch (e) {}
    return null;
}

export function initQuickHighlight() {
    const input = getSearchInput();
    if (!input) return;
    if (window.__SEI_PRO_QUICK_VISUALIZACAO_HANDLER__) {
        input.removeEventListener('input', window.__SEI_PRO_QUICK_VISUALIZACAO_HANDLER__);
        input.removeEventListener('keydown', window.__SEI_PRO_QUICK_VISUALIZACAO_KEYDOWN__);
    }
    window.__SEI_PRO_QUICK_VISUALIZACAO_HANDLER__ = function () { applyHighlight(input.value || ''); };
    window.__SEI_PRO_QUICK_VISUALIZACAO_KEYDOWN__ = function (event) {
        if (event.key === 'Escape') applyHighlight('');
    };
    input.addEventListener('input', window.__SEI_PRO_QUICK_VISUALIZACAO_HANDLER__);
    input.addEventListener('keydown', window.__SEI_PRO_QUICK_VISUALIZACAO_KEYDOWN__);
    applyHighlight(input.value || '');
}

// Bootstrap: roda no frame do visualizador; reaplica quando os iframes carregam.
(function () {
    if (window.__SEI_PRO_QUICK_HL_BOOTED__) return;
    window.__SEI_PRO_QUICK_HL_BOOTED__ = true;
    function boot() {
        initQuickHighlight();
        setTimeout(function () {
            if (document.querySelector('#ifrConteudoVisualizacao, #ifrVisualizacao')) initQuickHighlight();
        }, 500);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
    else boot();
})();
