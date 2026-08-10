import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { urlAmigavel, installUrlAmigavel } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'url-amigavel',
    maturity: 'wired',
    contexts: ['all', 'lista', 'arvore', 'visualizacao', 'documento'],
    configKey: 'urlamigavel',
    install: installUrlAmigavel,
    api: urlAmigavel.api
};

export default descriptor;

