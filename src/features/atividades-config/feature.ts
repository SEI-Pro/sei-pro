/**
 * Descritor ADR-0004 / ADR-0007 — administração de configuração de atividades.
 * A implementação foi extraída para esta pasta; `atividades/` mantém apenas
 * reexports de compatibilidade enquanto os call-sites são migrados.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { atividadesConfig, installAtividadesConfigFeature } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'atividades-config',
    maturity: 'wired',
    contexts: ['lista', 'arvore'],
    // Shares parent toggle during strangler; dedicated key comes with full extraction.
    configKey: 'gerenciaratividades',
    install: installAtividadesConfigFeature,
    api: atividadesConfig.api
};

export default descriptor;
