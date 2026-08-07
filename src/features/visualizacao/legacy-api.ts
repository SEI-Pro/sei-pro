// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Único ponto de aliases globais do contexto visualização. */
import { aliasGlobal } from '../../core/global.js';
import { initSeiProVisualizacao } from './sei-pro-visualizacao.js';
import {
    replaceSelectOnVisualizacao,
    setReplaceSelectOnVisualizacao,
    initForceChosenVisualizacao
} from './sei-pro-visualizacao-chosen.js';

export function installVisualizacaoLegacyApi() {
    aliasGlobal('initSeiProVisualizacao', initSeiProVisualizacao);
    aliasGlobal('replaceSelectOnVisualizacao', replaceSelectOnVisualizacao);
    aliasGlobal('setReplaceSelectOnVisualizacao', setReplaceSelectOnVisualizacao);
    aliasGlobal('initForceChosenVisualizacao', initForceChosenVisualizacao);
}
