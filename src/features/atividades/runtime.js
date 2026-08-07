/**
 * Atividades — runtime e inicialização tardia da feature.
 *
 * Runtime state is assembled by runtime-state.js and committed to the
 * canonical store. The old global names remain readable through state.js's
 * compatibility projection, but this module no longer owns that namespace.
 */
import { installAtividadesState, syncAtividadesStateFromPage } from './state.js';
import { getAtividadesContext } from './context.js';
import { createAtividadesRuntimeState } from './runtime-state.js';

installAtividadesState();

let chartAtividadesLoading = false;

export function loadChartAtividades() {
    const context = getAtividadesContext();
    const page = context.page;
    if (typeof page.Chart !== 'undefined' || chartAtividadesLoading) return;
    const base = page.URL_SPRO || '';
    if (!base || !page.$ || typeof page.$.getScript !== 'function') return;
    chartAtividadesLoading = true;
    if (typeof page.loadStylePro === 'function') page.loadStylePro(`${base}css/chart.min.css`);
    page.$.getScript(`${base}js/lib/chart.min.js`);
}

export function loadKanbanStyleAtividades() {
    const page = getAtividadesContext().page;
    const base = page.URL_SPRO || '';
    if (!base || typeof page.loadStylePro !== 'function') return;
    page.loadStylePro(`${base}css/jkanban.min.css`);
}

function applyChartDefaults(context, state) {
    const page = context.page;
    if (!page.Chart || !page.Chart.defaults) return;
    const storage = context.storage && context.storage.local;
    const darkMode = storage && typeof storage.getItem === 'function'
        ? storage.getItem('darkModePro')
        : false;
    page.Chart.defaults.color = darkMode
        ? state.chartColors.light_grey
        : state.chartColors.dark_grey;
}

/** Run after feature exports have been installed in the compatibility API. */
export function initializeAtividadesRuntime() {
    const context = getAtividadesContext();
    const state = createAtividadesRuntimeState(context);
    context.store.patch(state);
    try {
        if (typeof context.page.ensureSEIProLogCapture === 'function') {
            context.page.ensureSEIProLogCapture();
        }
    } catch (e) {
        // Log capture is an optional host integration.
    }
    applyChartDefaults(context, state);
    syncAtividadesStateFromPage();
    return context.store.get();
}

export { createAtividadesRuntimeState } from './runtime-state.js';
