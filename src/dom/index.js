/**
 * src/dom — micro-helper de DOM que substitui o jQuery na arquitetura-alvo.
 *
 * Por quê: a extensão dependia de jQuery para seleção, eventos, manipulação de
 * DOM e AJAX. Na refundação isolated-first esses usos viram DOM nativo. Este
 * módulo concentra os poucos açúcares que o jQuery dava e que a feature layer
 * realmente usa, mantendo o resto como API nativa do navegador.
 *
 * Princípios:
 *  - Zero dependências. Roda no mundo ISOLADO (tem DOM; não precisa de chrome.*).
 *  - Funções, não um objeto-wrapper encadeável: `qsa(sel).forEach(...)` em vez de
 *    `$(sel).each(...)`. Isso mantém o código explícito e tree-shakeable.
 *  - `request` (fetch) NÃO mora aqui: rede same-origin do SEI usa fetch direto;
 *    rede remota delega ao service worker (src/platform/net). DOM ≠ rede.
 */

/** Seleciona o primeiro elemento. `root` default = document. */
export function qs(selector, root) {
    return (root || document).querySelector(selector);
}

/** Seleciona todos como Array (não NodeList) — permite map/filter/reduce direto. */
export function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
}

/** Existe ao menos um? */
export function exists(selector, root) {
    return !!qs(selector, root);
}

/**
 * Cria um elemento. `props` aceita:
 *   - className, id, textContent, innerHTML (atalhos diretos)
 *   - style: objeto { prop: valor }
 *   - dataset: objeto { chave: valor }
 *   - on: objeto { tipo: handler }
 *   - qualquer outra chave vira setAttribute (ex.: href, title, type, role).
 * `children` aceita Node, string (vira textNode) ou array deles.
 */
export function el(tag, props, children) {
    const node = document.createElement(tag);
    if (props) {
        Object.keys(props).forEach(function (key) {
            const value = props[key];
            if (value == null) return;
            if (key === 'className') { node.className = value; return; }
            if (key === 'class') { node.className = value; return; }
            if (key === 'textContent' || key === 'text') { node.textContent = value; return; }
            if (key === 'innerHTML' || key === 'html') { node.innerHTML = value; return; }
            if (key === 'style' && typeof value === 'object') {
                Object.keys(value).forEach(function (p) { node.style[p] = value[p]; });
                return;
            }
            if (key === 'dataset' && typeof value === 'object') {
                Object.keys(value).forEach(function (d) { node.dataset[d] = value[d]; });
                return;
            }
            if (key === 'on' && typeof value === 'object') {
                Object.keys(value).forEach(function (t) { node.addEventListener(t, value[t]); });
                return;
            }
            node.setAttribute(key, value);
        });
    }
    appendChildren(node, children);
    return node;
}

/** Normaliza e anexa filhos (Node | string | array | null). */
export function appendChildren(node, children) {
    if (children == null) return node;
    const list = Array.isArray(children) ? children : [children];
    list.forEach(function (c) {
        if (c == null) return;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
}

/**
 * Liga um listener. Duas formas:
 *   on(target, 'click', handler)                     — direto
 *   on(target, 'click', '.seletor', handler)         — delegado (event.target.closest)
 * Retorna uma função `off()` para remover.
 */
export function on(target, type, selectorOrHandler, maybeHandler) {
    const delegated = typeof selectorOrHandler === 'string';
    const selector = delegated ? selectorOrHandler : null;
    const handler = delegated ? maybeHandler : selectorOrHandler;

    function listener(event) {
        if (!delegated) { return handler.call(target, event); }
        const match = event.target && event.target.closest ? event.target.closest(selector) : null;
        if (match && target.contains(match)) {
            return handler.call(match, event, match);
        }
    }

    target.addEventListener(type, listener);
    return function off() { target.removeEventListener(type, listener); };
}

/** Remove o elemento do DOM (no-op se já solto). */
export function remove(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
}

/** Esvazia o conteúdo de um elemento. */
export function empty(node) {
    if (node) while (node.firstChild) node.removeChild(node.firstChild);
    return node;
}

/** Ancestral mais próximo que casa o seletor (inclui o próprio). */
export function closest(node, selector) {
    return node && node.closest ? node.closest(selector) : null;
}

/**
 * Executa quando o DOM estiver pronto (equivalente a $(fn) / jQuery ready).
 *
 * Important: when the document is already past "loading" (typical for MV3
 * content_scripts at document_idle), defer with setTimeout(0) instead of
 * calling synchronously. Sync ready would run mid-manifest injection — before
 * later scripts in the same content_script block (controle-prazo, anotacao,
 * monitorados, …) have installed their globals.
 */
export function ready(fn) {
    if (typeof document === 'undefined') {
        fn();
        return;
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
        setTimeout(fn, 0);
    }
}

/**
 * Faz parse de uma string HTML para um DocumentFragment.
 * Substitui `$(htmlString)`. Use innerHTML do resultado com cautela — para
 * conteúdo vindo de rede, sanitize com DOMPurify antes (camada de feature).
 */
export function parseHTML(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    return tpl.content;
}

/** Faz parse de uma página HTML completa (resposta do SEI) em um Document. */
export function parseDocument(html) {
    return new DOMParser().parseFromString(html, 'text/html');
}

/** Mostra/esconde via style.display (preserva o display original ao mostrar). */
export function show(node) { if (node) node.style.display = ''; }
export function hide(node) { if (node) node.style.display = 'none'; }

export default {
    qs, qsa, exists, el, appendChildren, on, remove, empty,
    closest, ready, parseHTML, parseDocument, show, hide
};
