/**
 * Descritor ADR-0004 / ADR-0007 — administração de configuração de atividades.
 * Strangler: install no-op; código ainda vive em `atividades/` (reexports em index).
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'atividades-config',
    maturity: 'declared',
    contexts: ['lista', 'arvore'],
    // Shares parent toggle during strangler; dedicated key comes with full extraction.
    configKey: 'gerenciaratividades',
    install() {
        // Parent `atividades` still boots the runtime.
    },
    api: Object.freeze({})
};

export default descriptor;
