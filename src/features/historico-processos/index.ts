import * as history from './session-history-tables.js';
import * as home from './wait-load-home.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const historicoProcessos = defineLegacyFeature({ id: 'historico-processos', nsKey: 'historicoProcessos', modules: [history, home] });
export const installHistoricoProcessos = historicoProcessos.install;
