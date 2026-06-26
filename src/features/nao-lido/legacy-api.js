/**
 * Marcar como "Não Visualizado" — ponte de compatibilidade com o legado.
 * ÚNICO arquivo da feature que usa aliasGlobal (regra do DEVELOPMENT.md).
 *
 * O legado em src/features/lista-processos/sei-pro.js ainda chama
 * `initNaoVisualizadoPro()` por nome (no init da home, ~linha 3457). As demais
 * funções de io/view são reexpostas como globais porque resolvem umas às outras
 * por nome no escopo isolado durante a transição.
 *
 * TODO: remover quando lista-processos (sei-pro.js) for migrado para a arquitetura
 * nova — aí o init chamará a feature diretamente, sem global.
 */
import { aliasGlobal } from '../../core/global.js';
import * as io from './io.js';
import * as view from './view.js';

[io, view].forEach(function (mod) {
    Object.keys(mod).forEach(function (name) {
        if (typeof mod[name] === 'function') aliasGlobal(name, mod[name]);
    });
});
