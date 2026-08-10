/**
 * Descritor ADR-0004 / ADR-0007 — registro de atividades extraído do agregado.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { atividadesRegistro, installAtividadesRegistroFeature } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'atividades-registro',
    maturity: 'wired',
    contexts: ['lista', 'arvore'],
    configKey: null,
    install: installAtividadesRegistroFeature,
    api: atividadesRegistro.api
};

export default descriptor;
