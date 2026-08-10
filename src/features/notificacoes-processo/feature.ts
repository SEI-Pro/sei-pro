import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { notificacoesProcesso, installNotificacoesProcesso } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'notificacoes-processo',
    maturity: 'wired',
    contexts: ['lista', 'visualizacao'],
    configKey: 'notificacaonovoprocesso',
    install: installNotificacoesProcesso,
    api: notificacoesProcesso.api
};

export default descriptor;

