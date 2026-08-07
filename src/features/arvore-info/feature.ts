/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 * Bundle atual é IIFE auto-boot; install no-op até raiz de composição (fase 4).
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'arvore-info',
    maturity: 'declared',
    contexts: ['arvore', 'visualizacao'],
    configKey: 'infoarvore',
    // TODO(ADR-0004): wiring via composition root — bundle still self-boots
    install() {},
    api: Object.freeze({})
};

export default descriptor;
