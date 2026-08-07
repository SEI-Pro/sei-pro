/**
 * Contexto ÁRVORE DO PROCESSO da feature "Filtrar a página pelo campo de pesquisa
 * rápida" (config `filtrarpaginapelapesquisarapida`).
 *
 * Diferença vs. lista: na árvore a pesquisa rápida NÃO esconde nós — apenas
 * destaca (highlight) o termo. (Esconder é comportamento só da lista.)
 *
 * Roda dentro do iframe ifrArvore; o campo nativo #txtPesquisaRapida vive no frame
 * pai, então o input é lido e escutado via parent.document. Porte isolated-first,
 * sem jQuery; tokenização/faixas e motor de highlight vêm do core.
 */
import { getFilterTokens } from '../../shared/quickfilter/domain.js';
import { applyHighlight as coreApplyHighlight, clearHighlights, HIGHLIGHT_CLASS } from '../../shared/quickfilter/dom.js';

const HIDDEN_CLASS = 'seipro-quick-hidden';

function shouldSkipNode(node) {
    if (!node || !node.parentNode) return true;
    const parent = node.parentNode;
    if (parent.nodeType !== 1) return true;
    if (parent.closest('script, style, noscript, textarea, title')) return true;
    if (parent.closest('.' + HIGHLIGHT_CLASS + ', .' + HIDDEN_CLASS)) return true;
    return false;
}

function applyTreeHighlight(value) {
    const tokens = getFilterTokens(value);
    const container = document.getElementById('divArvore') || document.body;
    if (!container) { clearHighlights(document.body); return; }
    coreApplyHighlight(container, tokens, { shouldSkip: shouldSkipNode });
}

// Reset defensivo da classe Hidden (a árvore nunca esconde) + highlight.
function apply(value) {
    document.querySelectorAll('.infraArvore.' + HIDDEN_CLASS).forEach(function (el) {
        el.classList.remove(HIDDEN_CLASS);
    });
    applyTreeHighlight(value);
}

function getParentInput() {
    try {
        if (parent && parent.document) return parent.document.getElementById('txtPesquisaRapida');
    } catch (e) { /* cross-origin */ }
    return null;
}

export function initQuickFilterTree() {
    const input = getParentInput();
    if (!input) return;

    if (window.__SEI_PRO_QUICK_TREE_INPUT__) {
        window.__SEI_PRO_QUICK_TREE_INPUT__.removeEventListener('input', window.__SEI_PRO_QUICK_TREE_HANDLER__);
        window.__SEI_PRO_QUICK_TREE_INPUT__.removeEventListener('keydown', window.__SEI_PRO_QUICK_TREE_KEYDOWN__);
    }

    let debounceId = null;
    window.__SEI_PRO_QUICK_TREE_INPUT__ = input;
    window.__SEI_PRO_QUICK_TREE_HANDLER__ = function () {
        const value = input.value;
        clearTimeout(debounceId);
        debounceId = setTimeout(function () { apply(value); }, 120);
    };
    window.__SEI_PRO_QUICK_TREE_KEYDOWN__ = function (event) {
        if (event.key === 'Escape') { input.value = ''; clearTimeout(debounceId); apply(''); }
    };

    input.addEventListener('input', window.__SEI_PRO_QUICK_TREE_HANDLER__);
    input.addEventListener('keydown', window.__SEI_PRO_QUICK_TREE_KEYDOWN__);
    apply(input.value || '');
}
