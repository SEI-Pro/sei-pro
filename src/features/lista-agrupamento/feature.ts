/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 * Bundle atual auto-inicia em index.ts; install no-op até raiz de composição (fase 4).
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'lista-agrupamento',
    maturity: 'declared',
    contexts: ['lista'],
    configKey: 'agruparlista',
    // TODO(ADR-0004): wiring via composition root — bundle still self-boots
    install() {},
    api: Object.freeze({})
};

export default descriptor;
