/**
 * Atividades — registry of feature handlers for data-act dispatch.
 *
 * view.js resolves data-fn through this map (no MAIN-world globals required for
 * in-feature actions). legacy-api.js aliases the same map for external callers
 * (sei-functions, lista-processos, monitorados/projetos bridges).
 *
 * Does not import view.js / modules.js / legacy-api.js / index.js (avoids cycles).
 */
import * as runtime from './runtime.js';
import * as compat from './compat.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as state from './state.js';
import * as templates from './templates.js';
import * as server from './server.js';
import * as data from './data.js';
import * as charts from './charts.js';
import * as panel from './panel.js';
import * as reportsPanel from './reports-panel.js';
import * as configPanel from './config-panel.js';
import * as configTable from './config-table.js';
import * as configOptions from './config-options.js';
import * as reportsDetail from './reports-detail.js';
import * as afastamentos from './afastamentos.js';
import * as kanban from './kanban.js';
import * as activityWork from './activity-work.js';
import * as activityActions from './activity-actions.js';
import * as activityForm from './activity-form.js';
import * as ratings from './ratings.js';
import * as boot from './boot.js';

/**
 * The module label is deliberately kept next to the namespace.  A plain
 * array of namespaces made duplicate exports silently depend on import order;
 * that is how the pure domain homologação gates ended up shadowing their
 * runtime adapters.
 */
const handlerModules = [
    ['runtime', runtime],
    ['compat', compat],
    ['domain', domain],
    ['io', io],
    ['state', state],
    ['templates', templates],
    ['server', server],
    ['data', data],
    ['charts', charts],
    ['panel', panel],
    ['reportsPanel', reportsPanel],
    ['configPanel', configPanel],
    ['configTable', configTable],
    ['configOptions', configOptions],
    ['reportsDetail', reportsDetail],
    ['afastamentos', afastamentos],
    ['kanban', kanban],
    ['activityWork', activityWork],
    ['activityActions', activityActions],
    ['activityForm', activityForm],
    ['ratings', ratings],
    ['boot', boot]
];

/**
 * Intentional duplicate exports and the module that owns the public handler.
 *
 * The compat functions wrap pure domain helpers with the legacy runtime
 * dependencies.  The activity-form homologação functions do the same for
 * entity options and moment.  Keeping this policy explicit makes a future
 * duplicate fail at module initialization instead of changing behavior based
 * on array order.
 */
export const ATIVIDADES_HANDLER_PREFERENCES = Object.freeze({
    getAppsScriptUrlAtiv: 'compat',
    getLabIdTables: 'compat',
    getNumMonthsBetween2Dates: 'compat',
    checkHomologacaoPreviaPlanos: 'activityForm',
    checkHomologacaoPreviaProgramas: 'activityForm'
});

/**
 * Compose one public handler map from feature slices.
 *
 * Every duplicate must have an explicit preference.  This protects the
 * cross-slice callAtiv/data-act contract from accidental shadowing while
 * preserving the few deliberate compatibility aliases above.
 */
export function buildAtividadesHandlers(modules = handlerModules, preferences = ATIVIDADES_HANDLER_PREFERENCES) {
    const candidates = new Map();

    modules.forEach((entry) => {
        const moduleName = Array.isArray(entry) ? entry[0] : entry.name;
        const namespace = Array.isArray(entry) ? entry[1] : entry.handlers;
        if (!moduleName || !namespace) return;

        Object.entries(namespace).forEach(([name, value]) => {
            if (typeof value !== 'function') return;
            if (!candidates.has(name)) candidates.set(name, []);
            candidates.get(name).push({ moduleName, value });
        });
    });

    const map = Object.create(null);
    candidates.forEach((items, name) => {
        if (items.length === 1) {
            map[name] = items[0].value;
            return;
        }

        const preferredModule = preferences && preferences[name];
        const preferred = items.filter((item) => item.moduleName === preferredModule);
        if (preferred.length === 1) {
            map[name] = preferred[0].value;
            return;
        }

        const modulesWithName = items.map((item) => item.moduleName).join(', ');
        const preferenceHint = preferredModule
            ? `; preference ${preferredModule} is not unique`
            : '; add an explicit preference';
        throw new Error(`Duplicate Atividades handler "${name}" from ${modulesWithName}${preferenceHint}`);
    });

    return Object.freeze(map);
}

export const atividadesHandlers = buildAtividadesHandlers();

export function resolveAtividadesHandler(name, scope) {
    if (!name) return null;
    if (scope === 'parent' && typeof globalThis !== 'undefined' && globalThis.parent) {
        const parentMap = globalThis.parent.SeiPro
            && globalThis.parent.SeiPro.features
            && globalThis.parent.SeiPro.features.atividades
            && globalThis.parent.SeiPro.features.atividades.handlers;
        if (parentMap && typeof parentMap[name] === 'function') return parentMap[name];
        const parentFn = globalThis.parent[name];
        if (typeof parentFn === 'function') return parentFn;
    }
    const registryFn = typeof atividadesHandlers[name] === 'function'
        ? atividadesHandlers[name]
        : null;
    const globalFn = (typeof globalThis !== 'undefined' && typeof globalThis[name] === 'function')
        ? globalThis[name]
        : null;
    // Prefer an explicit global override (tests / rare monkey-patches) when it
    // differs from the registry entry installed by legacy-api.
    if (globalFn && globalFn !== registryFn) return globalFn;
    if (registryFn) return registryFn;
    if (globalFn) return globalFn;
    return null;
}
