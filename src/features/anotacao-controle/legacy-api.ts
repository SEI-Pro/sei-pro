// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Mostrar anotação na tela de controle — ponte de compatibilidade com o legado.
 * ÚNICO arquivo da feature que usa aliasGlobal (regra do DEVELOPMENT.md).
 *
 * O namespace `SeiPro.features.anotacaoControle` continua sendo a API preferida
 * pelos call-sites já migrados em sei-pro.js. Os aliases preservam a superfície
 * global durante a transição e permitem que consumidores legados ainda chamem os
 * helpers pelo nome.
 *
 * TODO: remover quando lista-processos (sei-pro.js) for migrado para a arquitetura
 * nova e não houver mais consumidores globais dos helpers da feature.
 */
import { aliasGlobal } from '../../core/global.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as view from './view.js';

[domain, io, view].forEach(function (mod) {
    Object.keys(mod).forEach(function (name) {
        if (typeof mod[name] === 'function') aliasGlobal(name, mod[name]);
    });
});
