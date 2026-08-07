/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 * Instalação feita pela raiz de composição da lista.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { installControlarPrazos } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'controlar-prazos',
    maturity: 'exclusive',
    contexts: ['lista'],
    configKey: 'gerenciarprazos',
    install: installControlarPrazos,
    api: Object.freeze({})
};

export default descriptor;
