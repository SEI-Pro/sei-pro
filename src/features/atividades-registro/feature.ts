/**
 * Descritor ADR-0004 / ADR-0007 — stub: registro de atividades (extração futura).
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installAtividadesRegistroFeature } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'atividades-registro',
    maturity: 'declared',
    contexts: ['lista', 'arvore'],
    configKey: null,
    install: installAtividadesRegistroFeature,
    api: Object.freeze({})
};

export default descriptor;
