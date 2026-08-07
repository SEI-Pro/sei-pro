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
import './legacy-api.js'; // único ponto com aliasGlobal
