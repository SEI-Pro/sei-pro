/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 * Instalação feita pela raiz de composição da árvore.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { installArvoreInfo, type InstallArvoreInfoDeps } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'arvore-info',
    maturity: 'exclusive',
    contexts: ['arvore'],
    configKey: 'infoarvore',
    install: (deps) => installArvoreInfo(deps as InstallArvoreInfoDeps),
    api: Object.freeze({})
};

export default descriptor;
