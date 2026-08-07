// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Monitorados — helpers de DOM vanilla (sem jQuery). Base da reescrita ESM.
 * Tudo roda no mundo isolado do content script (mesmo DOM da página).
 */

// querySelector/All escopados (default: document).
export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.prototype.slice.call(root.querySelectorAll(sel));

// Cria elemento a partir de uma string HTML (primeiro nó-elemento).
export function elFromHtml(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild;
}

// Delegação de eventos: um listener no root despacha por seletor.
// Substitui os onclick/onchange inline (que rodam no mundo MAIN e não
// enxergam funções do mundo isolado — ver discussão da migração).
export function delegate(root, type, selector, handler) {
    root.addEventListener(type, function (ev) {
        const match = ev.target.closest(selector);
        if (match && root.contains(match)) handler(ev, match);
    });
}

// Documento de um iframe do SEI por id (ou null se ausente/cross-origin).
export function frameDoc(id) {
    const ifr = document.getElementById(id);
    try { return ifr && ifr.contentDocument ? ifr.contentDocument : null; }
    catch (e) { return null; }
}

// Espera um seletor aparecer dentro de um root (MutationObserver + timeout).
export function waitFor(root, selector, timeoutMs = 9000) {
    return new Promise(function (resolve) {
        const found = root.querySelector(selector);
        if (found) return resolve(found);
        let done = false;
        const mo = new MutationObserver(function () {
            const el = root.querySelector(selector);
            if (el && !done) { done = true; mo.disconnect(); resolve(el); }
        });
        mo.observe(root, { childList: true, subtree: true });
        setTimeout(function () { if (!done) { done = true; mo.disconnect(); resolve(null); } }, timeoutMs);
    });
}
