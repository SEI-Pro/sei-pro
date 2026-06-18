import { getSeiPro, globalRef } from './global.js';

/**
 * SEI Pro — global namespace bootstrap (Phase 2 / ES modules Phase 5).
 */
export function createNamespace() {
    const root = getSeiPro();

    root.aliasState = function (name, value) {
        root.state[name] = value;
        if (typeof globalRef[name] === 'undefined') {
            globalRef[name] = value;
        }
        return value;
    };

    root.linkState = function (name) {
        if (Object.prototype.hasOwnProperty.call(root.state, name)) {
            return;
        }
        try {
            Object.defineProperty(root.state, name, {
                enumerable: true,
                configurable: true,
                get: function () { return globalRef[name]; },
                set: function (value) { globalRef[name] = value; }
            });
        } catch (e) {
            root.state[name] = globalRef[name];
        }
    };

    root.linkStateAll = function (names) {
        (names || []).forEach(root.linkState);
    };

    return root;
}
