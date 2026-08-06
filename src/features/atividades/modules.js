/**
 * Atividades — composição da superfície pública da feature.
 *
 * Manter a lista aqui deixa index.js pequeno e dá ao legado uma única fronteira
 * para publicar aliases. Os módulos continuam independentes e não importam
 * legacy-api.js de volta.
 */
import * as runtime from './runtime.js';
import * as compat from './compat.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as state from './state.js';
import * as templates from './templates.js';
import * as handlers from './handlers.js';
import * as view from './view.js';
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

export const atividadesModules = Object.freeze([
    runtime,
    compat,
    domain,
    io,
    state,
    templates,
    handlers,
    view,
    server,
    data,
    charts,
    panel,
    reportsPanel,
    configPanel,
    configTable,
    configOptions,
    reportsDetail,
    afastamentos,
    kanban,
    activityWork,
    activityActions,
    activityForm,
    ratings,
    boot
]);
