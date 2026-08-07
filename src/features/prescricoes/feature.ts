/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 * Ainda é script legado verbatim; install no-op até decomposição.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'prescricoes',
    maturity: 'declared',
    contexts: ['lista'],
    configKey: 'gerenciarprescricoes',
    // TODO(ADR-0004): legacy global script — no ESM install yet
    install() {},
    api: Object.freeze({})
};

export default descriptor;
