/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 * Instalação feita pela raiz de composição da árvore.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { installArvoreInfo } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'arvore-info',
    maturity: 'exclusive',
    contexts: ['arvore'],
    configKey: 'infoarvore',
    install: installArvoreInfo,
    api: Object.freeze({})
};

export default descriptor;
