// @ts-nocheck — fatias legadas isoladas; a tipagem entra após a caracterização.
import * as actions from './activity-actions.js';
import * as form from './activity-form.js';
import * as useCases from './activity-use-cases.js';
import * as work from './activity-work.js';
import * as charts from './charts.js';
import * as kanban from './kanban.js';
import * as panel from './panel.js';
import * as reportsDetail from './reports-detail.js';
import * as reportsPanel from './reports-panel.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const atividadesRegistro = defineLegacyFeature({
    id: 'atividades-registro',
    nsKey: 'atividadesRegistro',
    modules: [actions, form, useCases, work, charts, kanban, panel, reportsDetail, reportsPanel]
});
export const installAtividadesRegistroFeature = atividadesRegistro.install;
