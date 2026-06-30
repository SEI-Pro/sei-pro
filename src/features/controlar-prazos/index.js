/**
 * Controlar Prazos (config `gerenciarprazos`) — ENTRY do bundle.
 *
 * Decomposição em domain/io/view (substitui o antigo script-legado verbatim
 * sei-pro-controle-prazo.js). Bundlado por esbuild → dist/js/sei-pro-controle-prazo.js
 * (mesmo nome de saída ⇒ manifest inalterado), carregado após sei-pro.js nos blocos
 * 3 e 4 do manifest, no mundo isolado.
 *
 * Preserva a superfície GLOBAL do script legado: toda função exportada (domain/io/view)
 * é reexposta como global via aliasGlobal — chamadores legados (ex.: sei-pro.js
 * initControlePrazo) e handlers inline continuam resolvendo por nome, sem mudança de
 * comportamento. A separação é estrutural; o que era global continua global.
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
