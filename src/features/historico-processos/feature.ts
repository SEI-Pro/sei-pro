import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { historicoProcessos, installHistoricoProcessos } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'historico-processos',
    maturity: 'wired',
    contexts: ['all', 'lista', 'visualizacao'],
    configKey: 'historicoproc',
    install: installHistoricoProcessos,
    api: historicoProcessos.api
};

export default descriptor;

