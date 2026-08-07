// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { getSeiPro } from '../core/global.js';

/**
 * Fachada de rede REMOTA delegada ao service worker (isolated-world).
 *
 * Use esta fachada APENAS para rede cross-origin (Google Apps Script, APIs de IA,
 * busca de legislação). Rede SAME-ORIGIN ao próprio SEI deve usar `fetch` direto
 * no content script — precisa da sessão/cookies da página e não deve passar pelo SW.
 *
 * CONTRATO (não é a Response do fetch): resolve com { ok, status, body } onde
 * `body` é sempre texto cru. Rejeita só em falha de transporte (URL bloqueada
 * pela allowlist do SW, erro de rede); 4xx/5xx resolvem com ok:false e corpo
 * preservado — espelhando a semântica de fetch().
 */
export function installNet() {
    function fetchRequest(url, options) {
        return getSeiPro().core.messaging.sendMessage({
            action: 'fetch', url, options: options || {}
        }).then(function (response) {
            if (!response || typeof response.status === 'undefined') {
                throw new Error((response && response.error) || 'fetch failed');
            }
            return response;
        });
    }

    const net = { fetch: fetchRequest };
    getSeiPro().core.net = net;
    return net;
}
