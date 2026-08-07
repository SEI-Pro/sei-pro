// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sortable vanilla — primitivo compartilhado (src/shared/ui/).
 *
 * Reordenação por arrastar (pointer events), substitui jQuery UI sortable.
 * Pensado para linhas de tabela (axis 'y'), com handle e callback onUpdate após
 * soltar. Genérico/reusável (monitorados, e qualquer lista ordenável).
 *
 * API: createSortable(container, { items:'tr', handle:'.drag', onUpdate(order) });
 *   - items: seletor das linhas dentro de container
 *   - handle: seletor do "pegador" (default: a própria linha)
 *   - onUpdate: recebe o array ordenado de elementos após soltar
 */

// Puro/testável: dado um Y e a lista de linhas (exceto a arrastada), devolve o
// elemento antes do qual inserir (ou null = inserir ao final).
export function insertionTarget(y, rows) {
    for (const row of rows) {
        const r = row.getBoundingClientRect();
        if (y < r.top + r.height / 2) return row;
    }
    return null;
}

export function createSortable(container, opts = {}) {
    const itemsSel = opts.items || 'tr';
    const handleSel = opts.handle || null;
    let dragged = null;

    function rows() {
        return Array.prototype.slice.call(container.querySelectorAll(itemsSel));
    }

    function onDown(e) {
        const handle = handleSel ? e.target.closest(handleSel) : e.target.closest(itemsSel);
        if (!handle) return;
        const row = handle.closest(itemsSel);
        if (!row || !container.contains(row)) return;
        dragged = row;
        row.classList.add('seipro-sorting');
        row.style.opacity = '0.5';
        try { handle.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
        handle.addEventListener('pointermove', onMove);
        handle.addEventListener('pointerup', onUp, { once: true });
        e.preventDefault();
    }
    function onMove(e) {
        if (!dragged) return;
        const others = rows().filter((r) => r !== dragged);
        const before = insertionTarget(e.clientY, others);
        if (before) dragged.parentNode.insertBefore(dragged, before);
        else dragged.parentNode.appendChild(dragged);
    }
    function onUp(e) {
        if (!dragged) return;
        dragged.classList.remove('seipro-sorting');
        dragged.style.opacity = '';
        const handle = handleSel ? e.target.closest(handleSel) : dragged;
        if (handle) handle.removeEventListener('pointermove', onMove);
        dragged = null;
        if (typeof opts.onUpdate === 'function') opts.onUpdate(rows());
    }

    container.addEventListener('pointerdown', onDown);
    return { destroy() { container.removeEventListener('pointerdown', onDown); } };
}
