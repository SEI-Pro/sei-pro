/** View/eventos do agrupamento, com a borda jQuery legada injetada. */

export function toggleGroupTable(this_, $, persistGroupCollapsed, clearGroupCollapsed) {
    if (typeof $ !== 'function') return false;
    const current = $(this_);
    const data = current.data();
    const table = current.closest('table');
    const controls = current.closest('span');
    const isHide = data.action === 'hide';

    table.find('tr[data-tagname="' + data.htagname + '"]')[isHide ? 'hide' : 'show']();
    controls.find('a[data-action="show"]')[isHide ? 'show' : 'hide']();
    controls.find('a[data-action="hide"]')[isHide ? 'hide' : 'show']();
    if (isHide) {
        if (typeof persistGroupCollapsed === 'function') persistGroupCollapsed(data.htagname);
    } else if (typeof clearGroupCollapsed === 'function') {
        clearGroupCollapsed(data.htagname);
    }
    return true;
}

export function installListaAgrupamentoView(globalRef = globalThis) {
    globalRef.SeiPro = globalRef.SeiPro || {};
    globalRef.SeiPro.features = globalRef.SeiPro.features || {};
    globalRef.SeiPro.features.listaAgrupamentoView = { toggleGroupTable };
}
