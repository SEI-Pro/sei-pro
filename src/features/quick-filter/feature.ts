/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 * Entries index-list / index-tree auto-iniciam; install no-op até raiz de composição.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'quick-filter',
    maturity: 'declared',
    contexts: ['lista', 'arvore'],
    configKey: 'filtrarpaginapelapesquisarapida',
    // TODO(ADR-0004): wiring via composition root — list/tree bundles still self-boot
    install() {},
    api: Object.freeze({})
};

export default descriptor;
