// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Feature visualização: ícones/ações do viewer e adaptação de selects. */
import { publishFeature } from '../../app/publish-feature.js';
import {
    initSeiProVisualizacao,
    loadSEIProVisualizacao
} from './sei-pro-visualizacao.js';
import {
    replaceSelectOnVisualizacao,
    setReplaceSelectOnVisualizacao,
    initForceChosenVisualizacao
} from './sei-pro-visualizacao-chosen.js';
import { installVisualizacaoLegacyApi } from './legacy-api.js';

export function installVisualizacao() {
    globalThis.loadSEIProVisualizacao = loadSEIProVisualizacao;
    installVisualizacaoLegacyApi();
    if (typeof globalThis.$ === 'function') {
        globalThis.$(document).ready(function () { initSeiProVisualizacao(); });
    }
}

publishFeature({
    id: 'visualizacao',
    api: Object.freeze({
        init: initSeiProVisualizacao,
        replaceSelect: replaceSelectOnVisualizacao,
        setReplaceSelect: setReplaceSelectOnVisualizacao,
        initForceChosen: initForceChosenVisualizacao
    }),
    install: installVisualizacao
});
