// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Page effects adapter. All UI primitives are injected at this boundary. */
export function createAtividadesEffects(context) {
    if (!context) throw new TypeError('Effects adapter requires context');
    return Object.freeze({
        loading: (value) => context.effects.loading(value),
        alert: (...args) => context.effects.alert(...args),
        confirm: (...args) => context.effects.confirm(...args),
        notify: (...args) => context.effects.notify(...args),
        emit: (name, detail) => context.events.emit(name, detail),
        schedule: (fn, delay) => context.schedule(fn, delay)
    });
}

