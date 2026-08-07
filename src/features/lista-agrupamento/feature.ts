/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 * Instalação feita pela raiz de composição da lista.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { installListaAgrupamento } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'lista-agrupamento',
    maturity: 'exclusive',
    contexts: ['lista'],
    configKey: 'agruparlista',
    install: installListaAgrupamento,
    api: Object.freeze({})
};

export default descriptor;
