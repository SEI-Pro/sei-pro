/**
 * Tabela ordenável/filtrável vanilla — primitivo compartilhado (src/shared/ui/).
 *
 * Substitui jquery.tablesorter (+ widget filter/saveSort) no essencial usado pela
 * extensão: ordenar clicando no cabeçalho (asc/desc/reset), filtros por coluna,
 * extração customizada de texto por coluna (ex.: data via data-time-sorter, ordem
 * via data-order) e persistência opcional do estado.
 *
 * API: createSortableTable(table, {
 *   headers: { 0:{sorter:false}, 1:{filter:true}, ... },   // default: sortable, sem filtro
 *   textExtraction: { 2:(cell)=>..., 7:(cell)=>... },
 *   saveKey: 'monitorados',           // persiste sort/filtros em localStorage (opcional)
 *   onSortEnd(api), onFilterEnd(filteredCount, api)
 * })
 */

// Puro/testável: compara dois valores (numérico se ambos numéricos; senão locale).
export function compareValues(a, b) {
    const na = parseFloat(a), nb = parseFloat(b);
    const bothNum = !isNaN(na) && !isNaN(nb) && String(a).trim() !== '' && String(b).trim() !== '';
    if (bothNum) return na - nb;
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function createSortableTable(table, opts = {}) {
    const headers = opts.headers || {};
    const extraction = opts.textExtraction || {};
    const tbody = table.tBodies[0];
    const headRow = table.tHead ? table.tHead.rows[table.tHead.rows.length - 1] : null;
    if (!tbody || !headRow) return { destroy() {} };

    let sortState = { col: -1, dir: 0 }; // dir: 1 asc, -1 desc, 0 none
    const filters = {};

    function cfg(col) { return headers[col] || {}; }
    function sortable(col) { return cfg(col).sorter !== false; }
    function filterable(col) { return cfg(col).filter === true; }
    function cellText(row, col) {
        const cell = row.cells[col];
        if (!cell) return '';
        const fn = extraction[col];
        return fn ? fn(cell, table, col) : cell.textContent.trim();
    }

    // --- persistência ---
    function save() {
        if (!opts.saveKey) return;
        try { localStorage.setItem('seipro-table-' + opts.saveKey, JSON.stringify({ sortState, filters })); } catch (_) { /* noop */ }
    }
    function load() {
        if (!opts.saveKey) return;
        try {
            const raw = localStorage.getItem('seipro-table-' + opts.saveKey);
            if (!raw) return;
            const s = JSON.parse(raw);
            if (s.sortState) sortState = s.sortState;
            Object.assign(filters, s.filters || {});
        } catch (_) { /* noop */ }
    }

    // --- ordenação ---
    function applySort() {
        if (sortState.dir === 0 || sortState.col < 0) return;
        const rows = Array.prototype.slice.call(tbody.rows);
        const col = sortState.col, dir = sortState.dir;
        rows.sort((ra, rb) => dir * compareValues(cellText(ra, col), cellText(rb, col)));
        rows.forEach((r) => tbody.appendChild(r));
    }
    function onHeaderClick(ev) {
        const th = ev.target.closest('th');
        if (!th) return;
        const col = Array.prototype.indexOf.call(headRow.cells, th);
        if (col < 0 || !sortable(col)) return;
        if (sortState.col !== col) sortState = { col, dir: 1 };
        else sortState.dir = sortState.dir === 1 ? -1 : (sortState.dir === -1 ? 0 : 1);
        updateHeaderIndicators();
        applySort();
        applyFilter();
        save();
        if (typeof opts.onSortEnd === 'function') opts.onSortEnd(api);
    }
    function updateHeaderIndicators() {
        Array.prototype.forEach.call(headRow.cells, (th, i) => {
            th.classList.remove('seipro-sort-asc', 'seipro-sort-desc');
            if (i === sortState.col && sortState.dir === 1) th.classList.add('seipro-sort-asc');
            if (i === sortState.col && sortState.dir === -1) th.classList.add('seipro-sort-desc');
            if (sortable(i)) th.style.cursor = 'pointer';
        });
    }

    // --- filtros ---
    let filterRow = null;
    function buildFilterRow() {
        if (!Object.keys(headers).some((k) => filterable(Number(k)))) return;
        filterRow = document.createElement('tr');
        filterRow.className = 'seipro-filter-row';
        Array.prototype.forEach.call(headRow.cells, (th, i) => {
            const td = document.createElement('td');
            if (filterable(i)) {
                const inp = document.createElement('input');
                inp.type = 'search';
                inp.className = 'seipro-filter';
                inp.value = filters[i] || '';
                inp.style.cssText = 'width:100%;box-sizing:border-box;font-size:11px;';
                inp.addEventListener('input', () => { filters[i] = inp.value; applyFilter(); save(); });
                td.appendChild(inp);
            }
            filterRow.appendChild(td);
        });
        table.tHead.appendChild(filterRow);
    }
    function rowMatches(row) {
        return Object.keys(filters).every((col) => {
            const q = (filters[col] || '').trim().toLowerCase();
            if (!q) return true;
            return cellText(row, Number(col)).toLowerCase().indexOf(q) !== -1;
        });
    }
    function applyFilter() {
        let count = 0;
        Array.prototype.forEach.call(tbody.rows, (row) => {
            const ok = rowMatches(row);
            row.style.display = ok ? '' : 'none';
            if (ok) count++;
        });
        if (typeof opts.onFilterEnd === 'function') opts.onFilterEnd(count, api);
        return count;
    }

    const api = {
        sort(col, dir) { sortState = { col, dir }; updateHeaderIndicators(); applySort(); applyFilter(); save(); },
        filter(col, value) { filters[col] = value; if (filterRow) { const inp = filterRow.cells[col] && filterRow.cells[col].querySelector('input'); if (inp) inp.value = value; } applyFilter(); save(); },
        refresh() { applySort(); applyFilter(); },
        visibleCount() { return Array.prototype.filter.call(tbody.rows, (r) => r.style.display !== 'none').length; },
        destroy() { headRow.removeEventListener('click', onHeaderClick); if (filterRow) filterRow.remove(); }
    };

    load();
    headRow.addEventListener('click', onHeaderClick);
    buildFilterRow();
    updateHeaderIndicators();
    applySort();
    applyFilter();
    return api;
}
