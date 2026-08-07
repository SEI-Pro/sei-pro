/**
 * Anotação na lista (sticknote) — Tier S. Contrato { id, api, install }.
 */
import { publishFeature } from '../../app/publish-feature.js';
import { initReplaceSticknoteHome, renderSticknoteHomeInline, replaceSticknoteHome } from './view.js';
import './legacy-api.js';

export function installAnotacaoControle() {
    // Lifecycle is driven by lista-processos via api.init / api.render.
}

publishFeature({
    id: 'anotacao-controle',
    nsKey: 'anotacaoControle',
    api: Object.freeze({
        init: initReplaceSticknoteHome,
        render: renderSticknoteHomeInline,
        replace: replaceSticknoteHome
    }),
    install: installAnotacaoControle
});
