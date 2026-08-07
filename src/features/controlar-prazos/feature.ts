/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 * Bundle atual auto-inicia via legacy-api; install no-op até raiz de composição (fase 4).
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'controlar-prazos',
    maturity: 'declared',
    contexts: ['lista'],
    configKey: 'gerenciarprazos',
    // TODO(ADR-0004): wiring via composition root — bundle still self-boots
    install() {},
    api: Object.freeze({})
};

export default descriptor;
