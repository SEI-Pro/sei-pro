// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Contexto LISTA DE PROCESSOS da feature "Filtrar a página pelo campo de pesquisa
 * rápida" (config `filtrarpaginapelapesquisarapida`).
 *
 * Comportamento (preservado do legado sei-pro.js): ao digitar no campo nativo
 * #txtPesquisaRapida, esconde as linhas das tabelas de processos que não casam
 * (#tblProcessosRecebidos/Gerados/Detalhado) E destaca o termo no resto da tela.
 * Enter mantém a pesquisa rápida nativa do SEI.
 *
 * Porte isolated-first, SEM jQuery: TreeWalker/querySelector nativos + o motor de
 * highlight compartilhado (core/quickfilter-dom). Tokenização e faixas vêm do
 * core puro (core/quickfilter).
 */
import { getFilterTokens, normalizeFilterText } from '../../shared/quickfilter/domain.js';
import { applyHighlight as coreApplyHighlight, clearHighlights, HIGHLIGHT_CLASS } from '../../shared/quickfilter/dom.js';
import { buildRowHaystack, rowMatchesTokens } from './domain.js';

const HIDDEN_CLASS = 'seipro-quick-hidden';
const CONTROL_TABLES = '#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado';

// Cache do haystack por linha (conteúdo não muda entre teclas; chaveado pelo nó
// DOM, então re-render da tabela cria entradas novas e descarta as antigas).
const rowTextCache = (typeof WeakMap !== 'undefined') ? new WeakMap() : null;

// Coleta os segmentos de texto crus de uma linha (texto, atributos, tooltips) e
// delega ao domínio a normalização/dedup. Os parsers de tooltip ainda são globais
// legados (extractTooltipToArray/extractGroupTableTooltipToArray, em sei-pro.js);
// usados via window enquanto o legado não migra — ponte temporária.
function buildRowText(rowEl) {
    if (rowTextCache && rowTextCache.has(rowEl)) return rowTextCache.get(rowEl);

    const raw = [];
    raw.push(rowEl.textContent);

    rowEl.querySelectorAll('a, span, td, th, img').forEach(function (elem) {
        raw.push(elem.textContent);
        raw.push(elem.getAttribute('title'));
        raw.push(elem.getAttribute('aria-label'));
        raw.push(elem.getAttribute('alt'));
        raw.push(elem.getAttribute('data-tagname'));

        const onmouseover = elem.getAttribute('onmouseover');
        if (onmouseover) {
            raw.push(onmouseover);
            pushTooltip(raw, window.extractTooltipToArray, onmouseover);
            pushTooltip(raw, window.extractGroupTableTooltipToArray, onmouseover);
            pushTooltip(raw, window.extractAllTextBetweenQuotes, onmouseover);
        }
    });

    const result = buildRowHaystack(raw);
    if (rowTextCache) rowTextCache.set(rowEl, result);
    return result;
}

function pushTooltip(raw, fn, source) {
    if (typeof fn !== 'function') return;
    const out = fn(source);
    if (Array.isArray(out)) for (let i = 0; i < out.length; i++) raw.push(out[i]);
}

function getProcessRows(table) {
    return Array.prototype.filter.call(
        table.querySelectorAll('tbody tr'),
        function (tr) { return !tr.classList.contains('tableHeader') && !tr.classList.contains('tagintable') && !tr.classList.contains('infraCaption'); }
    );
}

// Esconde os cabeçalhos de grupo (.tableHeader/.tagintable) cujas linhas estão todas ocultas.
function updateHeaders(table) {
    let currentHeader = null;
    let hasVisibleRows = false;

    table.querySelectorAll('tbody tr').forEach(function (row) {
        if (row.classList.contains('tableHeader') || row.classList.contains('tagintable')) {
            if (currentHeader !== null) currentHeader.classList.toggle(HIDDEN_CLASS, !hasVisibleRows);
            currentHeader = row;
            hasVisibleRows = false;
            return;
        }
        if (!row.classList.contains(HIDDEN_CLASS) && row.offsetParent !== null) hasVisibleRows = true;
    });

    if (currentHeader !== null) currentHeader.classList.toggle(HIDDEN_CLASS, !hasVisibleRows);
}

function applyTableFilter(value) {
    const tokens = getFilterTokens(value);
    document.querySelectorAll(CONTROL_TABLES).forEach(function (table) {
        getProcessRows(table).forEach(function (row) {
            const matches = rowMatchesTokens(buildRowText(row), tokens);
            row.classList.toggle(HIDDEN_CLASS, !matches);
        });
        updateHeaders(table);
    });
}

function highlightContainer() {
    return document.getElementById('divInfraAreaTelaD')
        || document.getElementById('divInfraAreaTela')
        || document.body;
}

function shouldSkipNode(node) {
    if (!node || !node.parentNode) return true;
    const parent = node.parentNode;
    if (parent.nodeType !== 1) return true;
    if (parent.closest('#navInfraBarraNavegacao, #divInfraBarraSistema, #frmProtocoloPesquisaRapida, #divInfraSidebarMenu, #divInfraBarraLocalizacao')) return true;
    if (parent.closest('.' + HIGHLIGHT_CLASS + ', .' + HIDDEN_CLASS)) return true;
    const tag = (parent.tagName || '').toLowerCase();
    if (!tag) return true;
    if (['script', 'style', 'textarea', 'input', 'select', 'option', 'button', 'noscript'].indexOf(tag) !== -1) return true;
    if (parent.closest('[contenteditable="true"]')) return true;
    return !node.nodeValue || !node.nodeValue.trim();
}

function applyPageHighlight(value) {
    const tokens = getFilterTokens(value);
    const container = highlightContainer();
    if (!container) { clearHighlights(document); return; }
    coreApplyHighlight(container, tokens, { shouldSkip: shouldSkipNode });
}

function apply(value) {
    if (document.querySelector(CONTROL_TABLES)) applyTableFilter(value);
    applyPageHighlight(value);
}

export function initQuickFilterList() {
    const input = document.getElementById('txtPesquisaRapida');
    if (!input || input.dataset.seiproQuickFilterBound) return;
    input.dataset.seiproQuickFilterBound = '1';
    input.setAttribute('title', 'Digite para filtrar a página atual. Enter mantém a pesquisa rápida nativa.');

    let debounceId = null;
    input.addEventListener('input', function () {
        const value = this.value;
        clearTimeout(debounceId);
        debounceId = setTimeout(function () { apply(value); }, 120);
    });
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            this.value = '';
            clearTimeout(debounceId);
            applyTableFilter('');
            clearHighlights(document);
        }
    });

    if (input.value) apply(input.value);
}
