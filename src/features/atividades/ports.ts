// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Stable ports consumed by the Atividades application layer. */

export const ATIVIDADES_PORTS = Object.freeze([
    'transport',
    'storage',
    'dom',
    'options',
    'permissions',
    'effects',
    'schedule',
    'cancelSchedule'
]);

export function assertAtividadesPorts(context) {
    if (!context || typeof context !== 'object') throw new TypeError('Atividades context is required');
    for (const port of ['store', 'dom', 'options', 'permissions', 'effects']) {
        if (!context[port]) throw new TypeError(`Atividades context missing ${port}`);
    }
    return context;
}

