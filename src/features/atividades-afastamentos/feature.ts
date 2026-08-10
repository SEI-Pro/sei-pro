/**
 * Descritor ADR-0004 / ADR-0007 — afastamentos extraídos do agregado.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { atividadesAfastamentos, installAtividadesAfastamentosFeature } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'atividades-afastamentos',
    maturity: 'wired',
    contexts: ['lista', 'arvore'],
    // Dedicated configKey when extracted from gerenciaratividades (see docs/capabilities-map.md).
    configKey: null,
    install: installAtividadesAfastamentosFeature,
    api: atividadesAfastamentos.api
};

export default descriptor;
