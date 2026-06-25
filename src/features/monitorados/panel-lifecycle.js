import { aliasGlobal, globalRef } from '../../core/global.js';
import { qs, qsa } from './dom.js';
import { getStoreMonitoradoPro, persistMonitoradoStore } from './store.js';
import { findMonitoradoIndex } from './domain.js';
import { createTagsInput } from '../../shared/ui/tags-input.js';
import { createSortable } from '../../shared/ui/sortable.js';
import { createSortableTable } from '../../shared/ui/sortable-table.js';

/**
 * Monitorados — lifecycle do painel, vanilla ESM. Substitui initFunctionsPanelMonitorado:
 * tablesorter -> shared/ui/sortable-table, jQuery UI sortable -> shared/ui/sortable,
 * jquery.tagsInput -> shared/ui/tags-input, chosen -> <select> nativo.
 *
 * A LÓGICA DE NEGÓCIO compartilhada (etiquetas: getHtmlEtiqueta/saveFollowEtiqueta/
 * sugestEtiquetaPro; seleção: checkboxRangerSelectShift; export: downloadTablePro/
 * copyTablePro) entra via globais — os widgets são os primitivos compartilhados.
 *
 * NOTA: é a parte que mais depende de contratos de globais legados (saveFollowEtiqueta
 * etc.); requer verificação no SEI.
 */

const g = (n) => globalRef[n];

function initTags(table) {
    qsa('.monitoradoTagsPro', table).forEach((input) => {
        if (input.dataset.seiproTagsInit === '1') return;
        input.dataset.seiproTagsInit = '1';
        const persist = () => { if (typeof g('saveFollowEtiqueta') === 'function') g('saveFollowEtiqueta')(input); };
        createTagsInput(input, {
            delimiter: ';', placeholder: 'Adicionar etiqueta', limit: 8, minChars: 2, maxChars: 100,
            source: () => (typeof g('sugestEtiquetaPro') === 'function' ? g('sugestEtiquetaPro')('monitorado') : []),
            onAdd: persist, onRemove: persist
        });
    });
}

function initTable(table) {
    const dateExtract = (cell) => { const d = cell.querySelector('.dateboxDisplay'); return d ? d.getAttribute('data-time-sorter') : cell.textContent.trim(); };
    const orderExtract = (cell) => parseInt(cell.getAttribute('data-order')) || 0;
    return createSortableTable(table, {
        headers: { 0: { sorter: false }, 1: { filter: true }, 2: { filter: true }, 3: { filter: true }, 4: { filter: true } },
        textExtraction: { 2: dateExtract, 8: orderExtract },
        saveKey: 'monitorados',
        onSortEnd: () => { if (g('checkboxRangerSelectShift')) g('checkboxRangerSelectShift')('#monitoradoTablePro'); },
        onFilterEnd: (count) => {
            const cap = qs('caption', table);
            if (cap) cap.textContent = cap.textContent.replace(/\d+/g, count);
            qsa('tbody tr', table).forEach((tr) => {
                const inp = tr.querySelector('td input');
                if (inp) inp.disabled = (tr.style.display === 'none');
            });
            if (g('checkboxRangerSelectShift')) g('checkboxRangerSelectShift')('#monitoradoTablePro');
        }
    });
}

function initRowSortable(table) {
    const tbody = table.tBodies[0];
    if (!tbody) return;
    createSortable(tbody, {
        items: 'tr', handle: '.sorterTrMonitorado',
        onUpdate: (rows) => {
            const store = getStoreMonitoradoPro();
            rows.forEach((tr, index) => {
                const id = tr.getAttribute('data-id_procedimento');
                const idx = findMonitoradoIndex(store, id);
                if (idx >= 0) store.monitorados[idx].order = index + 1;
            });
            persistMonitoradoStore(store);
            rows.forEach((tr, index) => {
                tr.setAttribute('data-index', index);
                const last = tr.cells[tr.cells.length - 1];
                if (last) last.setAttribute('data-order', index + 1);
            });
        }
    });
}

// Observa marcação de linhas (.infraTrMarcada) p/ mostrar o ícone de remoção em lote.
function initSelectionObserver(table) {
    const tbody = table.tBodies[0];
    if (!tbody) return;
    const update = () => {
        const count = qsa('tr.infraTrMarcada', table).length;
        const actions = qs('#monitoradosProActions');
        const icon = actions && actions.querySelector('.iconMonitorados_remove');
        if (!icon) return;
        icon.style.display = count > 0 ? '' : 'none';
        const counter = icon.querySelector('.fa-layers-counter');
        if (counter && count > 0) counter.textContent = count;
    };
    new MutationObserver(update).observe(tbody, { attributes: true, attributeFilter: ['class'], subtree: true });
    update();
}

function initFunctionsPanelMonitorado() {
    const table = qs('#monitoradoTablePro');
    if (!table || table.dataset.seiproInit === '1') return;
    table.dataset.seiproInit = '1';
    initTags(table);
    initTable(table);
    initRowSortable(table);
    initSelectionObserver(table);
    if (g('checkboxRangerSelectShift')) g('checkboxRangerSelectShift')('#monitoradoTablePro');
    if (typeof g('checkFileRemoteMonitorado') === 'function') g('checkFileRemoteMonitorado')('get');
}

export function installPanelLifecycle() {
    aliasGlobal('initFunctionsPanelMonitorado', initFunctionsPanelMonitorado);
}
