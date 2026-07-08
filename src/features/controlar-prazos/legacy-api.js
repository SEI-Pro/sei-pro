/**
 * Controlar Prazos — ponte de compatibilidade com o legado.
 * ÚNICO arquivo da feature que usa aliasGlobal (regra do DEVELOPMENT.md).
 *
 * O legado em src/features/lista-processos/sei-pro.js ainda chama
 * `initControlePrazo()` por nome e a view ainda possui handlers/dados que resolvem
 * funções globais durante a transição. Por isso toda função exportada por
 * domain/io/view segue exposta como global no mesmo mundo isolado, sem mudar os
 * call-sites atuais.
 *
 * TODO: remover quando lista-processos e os handlers remanescentes de controlar
 * prazos forem migrados para chamadas diretas da feature.
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
