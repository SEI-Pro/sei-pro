/**
 * Atividades — composição da superfície pública da feature.
 *
 * Manter a lista aqui deixa index.js pequeno e dá ao legado uma única fronteira
 * para publicar a API. Os módulos continuam independentes e não importam
 * legacy-api.js de volta.
 */
import * as runtime from './runtime.js';
import * as runtimeState from './runtime-state.js';
import * as context from './context.js';
import * as store from './store.js';
import * as compat from './compat.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as state from './state.js';
import * as templates from './templates.js';
import * as handlers from './handlers.js';
import * as view from './view.js';
import * as server from './server.js';
import * as serverResponse from './server-response.js';
import * as serverPorts from './server-ports.js';
import * as ports from './ports.js';
import * as storage from './storage.js';
import * as effects from './effects.js';
import * as request from './request.js';
import * as api from './api.js';
import * as application from './application.js';
import * as activityUseCases from './activity-use-cases.js';
import * as configUseCases from './config-use-cases.js';
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
import * as applicationCommands from './application/commands.js';
import * as applicationQueries from './application/queries.js';
import * as response from './response.js';
import * as configDomain from './config-domain.js';
import * as configQueries from './config-queries.js';

export const atividadesModules = Object.freeze([
    runtime,
    runtimeState,
    context,
    store,
    compat,
    domain,
    io,
    state,
    templates,
    handlers,
    view,
    server,
    serverResponse,
    serverPorts,
    ports,
    storage,
    effects,
    request,
    api,
    application,
    activityUseCases,
    configUseCases,
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
    boot,
    applicationCommands,
    applicationQueries,
    response,
    configDomain,
    configQueries
]);
