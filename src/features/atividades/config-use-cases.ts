// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Application-level configuration commands and selectors. */
export function createConfigUseCases({ context, handlers } = {}) {
    if (!context || !handlers) throw new TypeError('Config use cases require context and handlers');
    const can = (name) => context.permissions
        && typeof context.permissions.check === 'function'
        ? !!context.permissions.check(name)
        : false;
    const call = (name, args) => typeof handlers[name] === 'function' ? handlers[name](...args) : false;
    return Object.freeze({
        open() { return call('openModalConfigPanel', []); },
        load(type, mode = 'get', data = false) {
            const capability = mode === 'get' ? `config_${type}` : `config_update_${type}`;
            return can(capability) ? call('getTabConfig', [type, mode, data]) : false;
        },
        save(form, type, id) { return can(`config_update_${type}`) ? call('saveOptionConfigItem', [form, type, id]) : false; },
        get(type, id) { return call('getConfigServer', [type, id]); }
    });
}
