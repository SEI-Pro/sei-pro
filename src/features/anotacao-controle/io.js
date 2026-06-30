/**
 * IO da feature "Mostrar anotação do processo na tela de controle de processos".
 *
 * Único efeito de rede da feature: buscar a página de registro da anotação
 * (same-origin, do próprio SEI) e ler o checkbox de prioridade. Rede same-origin
 * usa fetch direto (cookies de sessão vão por padrão) — não delega ao SW.
 * Não toca o DOM da página nem chama a view; retorna apenas o dado.
 */

// Busca `href` (page de anotacao_registrar) e resolve com o estado do checkbox
// #chkSinPrioridade. Resolve false se o checkbox não existir; rejeita só em
// falha de transporte (espelha a semântica de fetch()).
export function fetchSticknotePriority(href) {
    return fetch(href, { credentials: 'same-origin' })
        .then(function (response) { return response.text(); })
        .then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var checkbox = doc.querySelector('#chkSinPrioridade');
            return checkbox ? checkbox.checked : false;
        });
}
