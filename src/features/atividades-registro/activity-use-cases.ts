// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Application-level activity commands.
 *
 * The old files still expose UI-compatible functions, while this module gives
 * new callers one stable command contract and centralizes permission checks.
 */
export function createActivityUseCases({ context, handlers } = {}) {
    if (!context || !handlers) throw new TypeError('Activity use cases require context and handlers');
    const invoke = (name, args = []) => {
        const fn = handlers[name];
        if (typeof fn !== 'function') throw new Error(`Unknown Atividades command: ${name}`);
        return fn(...args);
    };
    const allowed = (capability) => context.permissions
        && typeof context.permissions.check === 'function'
        ? !!context.permissions.check(capability)
        : false;
    return Object.freeze({
        create(id) { return allowed('save_atividade') ? invoke('saveAtividade', [id || 0]) : false; },
        save(id, mode = 'action') {
            const command = mode === 'quick' ? 'saveAtividadeQuick' : mode === 'full' ? 'saveAtividadeFull' : 'saveAtividade';
            return allowed('save_atividade') ? invoke(command, [id || 0]) : false;
        },
        start(id) { return allowed('start_atividade') ? invoke('startAtividade', [id || 0]) : false; },
        complete(id) { return allowed('complete_atividade') ? invoke('completeAtividade', [id || 0]) : false; },
        pause(id) { return allowed('pause_atividade') ? invoke('pauseAtividade', [id || 0]) : false; },
        archive(id) { return allowed('send_atividade') ? invoke('archiveAtividade', [id || 0]) : false; },
        remove(id) { return allowed('delete_atividade') ? invoke('deleteAtividade', [id || 0]) : false; },
        rate(id) { return allowed('rate_atividade') ? invoke('rateAtividade', [id || 0]) : false; }
    });
}
