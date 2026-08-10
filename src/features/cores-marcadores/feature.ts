import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { coresMarcadores, installCoresMarcadores } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'cores-marcadores',
    maturity: 'wired',
    contexts: ['lista', 'arvore', 'visualizacao'],
    configKey: 'coresmarcadores',
    install: installCoresMarcadores,
    api: coresMarcadores.api
};

export default descriptor;

