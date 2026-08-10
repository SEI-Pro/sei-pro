import * as notifications from './notifications-process.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const notificacoesProcesso = defineLegacyFeature({ id: 'notificacoes-processo', nsKey: 'notificacoesProcesso', modules: [notifications] });
export const installNotificacoesProcesso = notificacoesProcesso.install;
