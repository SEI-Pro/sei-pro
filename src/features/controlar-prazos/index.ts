// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Controlar Prazos (config `gerenciarprazos`) — ENTRY do bundle.
 *
 * Decomposição em domain/io/view (substitui o antigo script-legado verbatim
 * sei-pro-controle-prazo.js). Bundlado por esbuild → dist/js/sei-pro-controle-prazo.js
 * (mesmo nome de saída ⇒ manifest inalterado), carregado após sei-pro.js nos blocos
 * 3 e 4 do manifest, no mundo isolado.
 *
 * Preserva a superfície GLOBAL do script legado via legacy-api.js: chamadores
 * legados (ex.: sei-pro.js initControlePrazo) e handlers inline continuam
 * resolvendo por nome, sem mudança de comportamento. A separação é estrutural;
 * o que era global continua global.
 */
import { publishFeature } from '../../app/publish-feature.js';
import { installControlarPrazosLegacyApi } from './legacy-api.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as view from './view.js';

export function installControlarPrazos() {
    installControlarPrazosLegacyApi();
}

publishFeature({
    id: 'controlar-prazos',
    api: Object.freeze({ domain, io, view }),
    install: installControlarPrazos
});
