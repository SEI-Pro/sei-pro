/**
 * Fake in-memory storage port (ADR-0005).
 * Same surface as createStorage / installStorage.
 *
 * @param {{ sync?: object, local?: object, session?: object }} [seed]
 */
export function fakeStorage(seed = {}) {
    const areas = {
        sync: { ...(seed.sync || {}) },
        local: { ...(seed.local || {}) },
        session: { ...(seed.session || {}) }
    };

    function pick(area, keys) {
        const store = areas[area];
        if (keys == null) return { ...store };
        if (typeof keys === 'string') {
            return { [keys]: store[keys] };
        }
        if (Array.isArray(keys)) {
            const out = {};
            for (const k of keys) out[k] = store[k];
            return out;
        }
        if (typeof keys === 'object') {
            const out = {};
            for (const k of Object.keys(keys)) {
                out[k] = k in store ? store[k] : keys[k];
            }
            return out;
        }
        return { ...store };
    }

    function set(area, items) {
        Object.assign(areas[area], items || {});
    }

    function remove(area, keys) {
        const list = Array.isArray(keys) ? keys : [keys];
        for (const k of list) delete areas[area][k];
    }

    return {
        getSync: async (keys) => pick('sync', keys),
        setSync: async (items) => { set('sync', items); },
        removeSync: async (keys) => { remove('sync', keys); },
        getLocal: async (keys) => pick('local', keys),
        setLocal: async (items) => { set('local', items); },
        removeLocal: async (keys) => { remove('local', keys); },
        getSession: async (keys) => pick('session', keys),
        setSession: async (items) => { set('session', items); },
        removeSession: async (keys) => { remove('session', keys); },
        /** Test helper: inspect raw area. */
        _dump: () => ({
            sync: { ...areas.sync },
            local: { ...areas.local },
            session: { ...areas.session }
        })
    };
}
