import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { acoesCapa, installAcoesCapa } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'acoes-capa',
    maturity: 'wired',
    contexts: ['all', 'lista', 'arvore', 'visualizacao', 'documento'],
    configKey: null,
    install: installAcoesCapa,
    api: acoesCapa.api
};

export default descriptor;

