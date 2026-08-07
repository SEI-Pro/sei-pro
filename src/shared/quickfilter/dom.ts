// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { getSeiPro } from '../../core/global.js';
import { buildHighlightRanges } from './domain.js';

/**
 * Camada de DOM compartilhada do filtro rápido de página.
 * Usa buildHighlightRanges (shared/quickfilter/domain).
 */

export var HIGHLIGHT_CLASS = 'seipro-quick-highlight';

function resolveDoc(scope) {
    if (scope && scope.ownerDocument) return scope.ownerDocument;
    if (scope && scope.nodeType === 9) return scope;            // é o próprio document
    return (typeof document !== 'undefined') ? document : null;
}

// Desfaz os <span.HIGHLIGHT_CLASS> dentro de `scope`, restaurando os nós de
// texto e normalizando (funde nós de texto adjacentes). `scope` pode ser um
// elemento ou o próprio document.
export function clearHighlights(scope) {
    var doc = resolveDoc(scope);
    if (!doc) return;
    var root = scope || doc.body;
    if (!root || typeof root.querySelectorAll !== 'function') return;
    var spans = root.querySelectorAll('.' + HIGHLIGHT_CLASS);
    for (var i = 0; i < spans.length; i++) {
        var span = spans[i];
        if (span.parentNode) {
            span.parentNode.replaceChild(doc.createTextNode(span.textContent), span);
        }
    }
    if (typeof root.normalize === 'function') root.normalize();
}

// Envolve em <span.HIGHLIGHT_CLASS> as faixas casadas de UM nó de texto.
export function highlightTextNode(node, tokens) {
    var text = node.nodeValue;
    if (!text || !text.trim()) return;

    var ranges = buildHighlightRanges(text, tokens);
    if (!ranges.length) return;

    var doc = node.ownerDocument || (typeof document !== 'undefined' ? document : null);
    if (!doc) return;

    var fragment = doc.createDocumentFragment();
    var cursor = 0;

    ranges.forEach(function (range) {
        if (range.start > cursor) {
            fragment.appendChild(doc.createTextNode(text.slice(cursor, range.start)));
        }
        var span = doc.createElement('span');
        span.className = HIGHLIGHT_CLASS;
        span.textContent = text.slice(range.start, range.end);
        fragment.appendChild(span);
        cursor = range.end;
    });

    if (cursor < text.length) {
        fragment.appendChild(doc.createTextNode(text.slice(cursor)));
    }

    if (node.parentNode) node.parentNode.replaceChild(fragment, node);
}

// Limpa highlights antigos e destaca `tokens` em todos os nós de texto de
// `container` que não forem rejeitados por `options.shouldSkip(node)`.
// Coleta os nós antes de mutar (mutar durante o walk invalida o walker).
export function applyHighlight(container, tokens, options) {
    options = options || {};
    if (!container) return;
    var doc = resolveDoc(container);
    if (!doc || typeof doc.createTreeWalker !== 'function') return;

    clearHighlights(container);
    if (!tokens || !tokens.length) return;

    var shouldSkip = (typeof options.shouldSkip === 'function') ? options.shouldSkip : function () { return false; };

    var walker = doc.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
            return shouldSkip(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
    });

    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (var i = 0; i < nodes.length; i++) highlightTextNode(nodes[i], tokens);
}

export function installQuickFilterDom() {
    const quickfilterDom = {
        HIGHLIGHT_CLASS: HIGHLIGHT_CLASS,
        clearHighlights: clearHighlights,
        highlightTextNode: highlightTextNode,
        applyHighlight: applyHighlight
    };

    getSeiPro().core.quickfilterDom = quickfilterDom;

    return quickfilterDom;
}
