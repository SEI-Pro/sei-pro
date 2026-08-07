/**
 * Descritor ADR-0004 / ADR-0007 — stub: afastamentos (extração futura de atividades).
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installAtividadesAfastamentosFeature } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'atividades-afastamentos',
    maturity: 'declared',
    contexts: ['lista', 'arvore'],
    // Dedicated configKey when extracted from gerenciaratividades (see docs/capabilities-map.md).
    configKey: null,
    install: installAtividadesAfastamentosFeature,
    api: Object.freeze({})
};

export default descriptor;
