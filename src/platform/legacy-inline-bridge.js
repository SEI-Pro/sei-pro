/**
 * Ponte ESTRITA e isolada para handlers inline (`onclick="fn(...)"`, `onmouseover=...`,
 * etc.) gerados pelo legado ainda não migrado (~921 linhas em sei-pro.js,
 * sei-functions-pro.js, sei-pro-atividades.js e outros — ver levantamento de
 * 2026-06-30). Atributos inline são avaliados pelo NAVEGADOR no contexto da
 * PÁGINA (mundo MAIN), independente de qual mundo criou o elemento — desde a
 * migração isolated-first (sem world:"MAIN"), toda função NOSSA referenciada
 * assim deixou de existir nesse contexto e o clique lança ReferenceError.
 *
 * Esta ponte NÃO é a arquitetura-alvo. Features migradas usam `data-act` +
 * `on()` de src/dom/index.js (delegação real, sem parsing de atributo) — ver
 * DEVELOPMENT.md. Este módulo existe SÓ para reviver, com segurança limitada,
 * o legado que ainda não foi migrado, sem contaminar o padrão novo.
 *
 * Gramática reconhecida (estrita — fora disso, NÃO tenta adivinhar):
 *   nomeDaFuncao(arg1, arg2, ...)  ou  nomeDaFuncao(arg1, ...);
 *   onde cada arg é: this | 'string' | "string" | número | null | true | false
 *
 * O que esta ponte DELIBERADAMENTE não cobre (loga aviso, não executa):
 *   - múltiplas instruções no mesmo atributo (separadas por ';' com código depois)
 *   - expressões jQuery encadeadas ($(this).closest(...).remove())
 *   - chamadas em outro frame (parent.algumaFuncao(...))
 *   - qualquer args que não seja this/literal simples
 * Esses casos precisam de migração manual para data-act — nunca DEVEM ser
 * "adivinhados" por regex (risco de chamar a coisa errada silenciosamente).
 *
 * Chrome isolated-world quirk (2026-07): `removeAttribute('onclick')` from the
 * content-script world does NOT clear the MAIN-world IDL event handler compiled
 * from that attribute. The inline call still runs in MAIN and throws
 * ReferenceError. Mitigação: um companion no mundo MAIN instala stubs no-op
 * sob demanda (capture) para nomes que ainda não existem lá — a ponte isolada
 * continua executando a função real.
 */
import { globalRef } from '../core/global.js';

const HANDLER_ATTRS = ['onclick', 'onmouseover', 'onmouseout', 'onchange', 'onfocus', 'onblur', 'ondblclick'];

// nomeFuncao( args ) ; opcional — sem parênteses aninhados (gramática estrita).
const CALL_RE = /^\s*([A-Za-z_$][\w$]*)\s*\(([^()]*)\)\s*;?\s*$/;

function parseArg(raw, el) {
    const a = raw.trim();
    if (a === 'this') return { ok: true, value: el };
    if (a === 'null') return { ok: true, value: null };
    if (a === 'true') return { ok: true, value: true };
    if (a === 'false') return { ok: true, value: false };
    if (/^-?\d+(\.\d+)?$/.test(a)) return { ok: true, value: Number(a) };
    const strMatch = a.match(/^'([^']*)'$/) || a.match(/^"([^"]*)"$/);
    if (strMatch) return { ok: true, value: strMatch[1] };
    return { ok: false };
}

// Exportado para teste: tenta casar a gramática estrita; retorna { fnName, args } ou null.
export function parseStrictCall(attrValue, el) {
    const m = CALL_RE.exec(attrValue || '');
    if (!m) return null;
    const fnName = m[1];
    const rawArgs = m[2].trim();
    if (rawArgs === '') return { fnName, args: [] };
    const parts = rawArgs.split(',');
    const args = [];
    for (let i = 0; i < parts.length; i++) {
        const parsed = parseArg(parts[i], el);
        if (!parsed.ok) return null; // fora da gramática — não adivinha
        args.push(parsed.value);
    }
    return { fnName, args };
}

// Sobe a árvore a partir do alvo do evento procurando o ATRIBUTO ESPECÍFICO deste
// tipo de evento (não "qualquer um") — elementos comuns no legado têm onclick E
// onmouseover juntos (ex.: lnkInfraCheck), e cada evento só deve casar com o seu.
function findHandlerTarget(eventTarget, attr) {
    let node = eventTarget;
    while (node && node.nodeType === 1) {
        if (node.hasAttribute(attr)) return node;
        node = node.parentElement;
    }
    return null;
}

function eventTypeForAttr(attr) {
    return attr.slice(2); // 'onclick' -> 'click'
}

/**
 * No-op stub listeners for the current window. Covers jsdom (single world) and
 * is harmless in the Chrome isolated world (our real functions already exist).
 * The MAIN-world companion below is what silences ReferenceError in production.
 */
function installNoopStubListeners(win) {
    if (!win || win.__SEI_PRO_MAIN_INLINE_STUBS__) return;
    win.__SEI_PRO_MAIN_INLINE_STUBS__ = true;
    const doc = win.document;
    if (!doc || typeof doc.addEventListener !== 'function') return;

    HANDLER_ATTRS.forEach(function (attr) {
        const type = eventTypeForAttr(attr);
        doc.addEventListener(type, function (event) {
            const el = findHandlerTarget(event.target, attr);
            if (!el) return;
            const val = el.getAttribute(attr) || '';
            const m = CALL_RE.exec(val);
            if (!m) return;
            const fnName = m[1];
            if (/^infra/i.test(fnName)) return;
            if (typeof win[fnName] === 'function') return;
            win[fnName] = function () {};
        }, true);
    });
}

/**
 * Injects inline-stubs-main.js into the page MAIN world via web_accessible
 * extension URL (MV3-safe). Inline <script> text often does not execute when
 * inserted from an isolated content script; an external chrome-extension:// src does.
 */
function injectMainWorldNoopStubs(doc, win) {
    if (!doc || !doc.documentElement) return;
    if (doc.documentElement.getAttribute('data-seipro-inline-stubs') === '1') return;

    var getURL = null;
    try {
        if (win && win.chrome && win.chrome.runtime && typeof win.chrome.runtime.getURL === 'function') {
            getURL = win.chrome.runtime.getURL.bind(win.chrome.runtime);
        } else if (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.getURL === 'function') {
            getURL = chrome.runtime.getURL.bind(chrome.runtime);
        }
    } catch (e) { /* ignore */ }
    if (!getURL) return;

    doc.documentElement.setAttribute('data-seipro-inline-stubs', '1');
    const script = doc.createElement('script');
    script.src = getURL('js/inline-stubs-main.js');
    script.async = false;
    script.onload = function () { script.remove(); };
    script.onerror = function () {
        doc.documentElement.removeAttribute('data-seipro-inline-stubs');
        script.remove();
    };
    doc.documentElement.appendChild(script);
}

export function installLegacyInlineBridge(win) {
    const w = win || globalRef;
    // Sandboxes de teste (vm.runInNewContext, sem jsdom) não têm document/DOM —
    // mesmo padrão defensivo de outros installs do core-stack diante de globals
    // ausentes (ex.: installVersion checa `if (!$) return false`).
    if (!w.document || typeof w.document.addEventListener !== 'function') return;
    if (w.__SEI_PRO_LEGACY_INLINE_BRIDGE__) return;
    w.__SEI_PRO_LEGACY_INLINE_BRIDGE__ = true;

    installNoopStubListeners(w);
    try {
        injectMainWorldNoopStubs(w.document, w);
    } catch (e) {
        // CSP or detached document — isolated bridge still runs; MAIN may throw.
    }

    HANDLER_ATTRS.forEach(function (attr) {
        const type = eventTypeForAttr(attr);
        w.document.addEventListener(type, function (event) {
            const el = findHandlerTarget(event.target, attr);
            if (!el) return;

            const attrValue = el.getAttribute(attr);
            // Chamadas a funções nativas do SEI (ex.: infraTooltipMostrar) já funcionam
            // sozinhas — o navegador as avalia no mundo da página, onde elas existem de
            // verdade. Só interceptamos quando o alvo é uma função NOSSA.
            const parsed = parseStrictCall(attrValue, el);
            if (!parsed) return; // fora da gramática estrita — não mexe, deixa o navegador tentar
            if (/^infra/i.test(parsed.fnName)) return; // nativo SEI — não interceptar
            const fn = w[parsed.fnName];
            if (typeof fn !== 'function') return; // não é nossa (ou não existe) — deixa pra página

            // Best-effort: remove attribute during capture. In Chrome this does NOT
            // clear the MAIN IDL handler (see file header); MAIN stubs cover that.
            // Restore after dispatch so repeated clicks keep working.
            el.removeAttribute(attr);
            Promise.resolve().then(function () { el.setAttribute(attr, attrValue); });
            if (type === 'click') event.preventDefault(); // evita salto de scroll em <a href="#">
            try {
                fn.apply(el, parsed.args);
            } catch (e) {
                console.error('[SEI Pro] legacy-inline-bridge: erro ao executar', parsed.fnName, e);
            }
        }, true); // capture: roda ANTES do atributo inline ser avaliado pelo navegador
    });
}
