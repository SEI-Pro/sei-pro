/**
 * Decisões de apresentação do toggle de Processos Monitorados.
 *
 * A view não conhece storage nem a fachada legada: transforma o elemento
 * clicado no comando observável que o controlador da feature deve executar.
 */
export function getMonitoradoToggleAction(target) {
    if (!target || typeof target.getAttribute !== 'function') return null;
    const id = target.getAttribute('data-id_procedimento');
    if (id == null || id === '') return null;
    const mode = target.getAttribute('data-mode') || 'add';
    if (mode !== 'add' && mode !== 'remove') return null;
    return { id_procedimento: id, mode };
}

export function isMonitoradoToggle(target) {
    return !!target && typeof target.matches === 'function'
        && target.matches('[data-act="monitorado-toggle"]');
}