import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { interessadosForms, installInteressadosForms } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'interessados-forms',
    maturity: 'wired',
    contexts: ['arvore', 'visualizacao', 'documento'],
    configKey: null,
    install: installInteressadosForms,
    api: interessadosForms.api
};

export default descriptor;

