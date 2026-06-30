import { getSeiPro, globalRef } from './global.js';

/**
 * SEI Pro — global namespace bootstrap (Phase 2 / ES modules Phase 5).
 */
export function createNamespace() {
    const root = getSeiPro();

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

    return root;
}
