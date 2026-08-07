// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Anotação na lista (sticknote) — Tier S. Contrato { id, api, install }.
 */
import { publishFeature } from '../../app/publish-feature.js';
import { initReplaceSticknoteHome, renderSticknoteHomeInline, replaceSticknoteHome } from './view.js';
import { installAnotacaoControleLegacyApi } from './legacy-api.js';

export function installAnotacaoControle() {
    installAnotacaoControleLegacyApi();
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
