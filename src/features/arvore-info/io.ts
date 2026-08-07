// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Fronteira de REDE da feature "Informações adicionais na árvore".
 * Isola fetch/cache/submit do resto (Etapa C). Fábrica `createIo` recebe as
 * dependências (win + logger) para ficar testável; usa globais padrão de browser
 * (fetch, DOMParser, TextDecoder, FormData, URL).
 *
 * Semântica VERBATIM do legado:
 *  - Páginas do SEI são ISO-8859-1 (Latin-1) — decodificadas explicitamente p/ evitar mojibake.
 *  - Cache por URL com TTL (hash em URL fica stale; dado muda após save em outra aba).
 *  - 1 retry automático em erro transiente de rede ("Failed to fetch"/NetworkError).
 */

import { escapeComponent } from '../../core/texto.js';

export const PAGE_CACHE_TTL_MS = 60 * 1000;

export function createIo(deps) {
    var win = deps.win;
    var log = deps.log || function () {};
    var warn = deps.warn || function () {};
    var err = deps.err || function () {};

    var pageCache = Object.create(null);

    function invalidatePage(url) { delete pageCache[url]; }

    function fetchPage(url) {
        var entry = pageCache[url];
        if (entry && entry.expiresAt > Date.now()) return entry.promise;
        if (entry) log('fetchPage cache expired →', url.split('?')[0]);
        else log('fetchPage →', url.split('?')[0]);
        // One automatic retry on transient network errors ("Failed to fetch"), which we see
        // right after iframe-based saves while the SEI session is still settling.
        function tryOnce() {
            return fetch(url, { credentials: 'include' })
                .then(function (r) {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.arrayBuffer();
                });
        }
        var promise = tryOnce()
            .catch(function (e) {
                if (!/Failed to fetch|NetworkError/i.test(e.message)) throw e;
                return new Promise(function (res) { setTimeout(res, 500); }).then(tryOnce);
            })
            .then(function (buf) {
                // SEI pages are served as ISO-8859-1 (Latin-1). Decode explicitly to avoid mojibake.
                var html = new TextDecoder('iso-8859-1').decode(buf);
                return new DOMParser().parseFromString(html, 'text/html');
            })
            .catch(function (e) { err('fetchPage failed for', url, e.message); delete pageCache[url]; throw e; });
        pageCache[url] = { promise: promise, expiresAt: Date.now() + PAGE_CACHE_TTL_MS };
        return promise;
    }

    // Submit a native SEI form parsed from a fetched page, with overrides for specific fields.
    // Returns a Promise that resolves to the response's parsed HTML (Latin-1 decoded).
    //
    // Encoding: SEI is ISO-8859-1. We must NOT use FormData here — a FormData body is sent
    // as multipart/form-data with UTF-8 values, so accented chars arrive as 2 bytes and get
    // mangled by the Latin-1 backend (uppercase Ç/Ê collapse to "Ã": "OPERAÇÃO"→"OPERAÃÃO").
    // Instead build an application/x-www-form-urlencoded; charset=ISO-8859-1 body via
    // escapeComponent() (Latin-1 %XX), matching every other SEI write in the project.
    function submitForm(docA, overrides) {
        var form = docA.querySelector('form');
        if (!form) return Promise.reject(new Error('form not found in fetched page'));
        var action = form.getAttribute('action') || '';
        var absAction = new URL(action, docA.baseURI || win.location.href).href;
        var parts = [];
        function appendField(name, value) {
            parts.push(escapeComponent(name) + '=' + escapeComponent(value != null ? String(value) : ''));
        }
        var inputs = form.querySelectorAll('input, textarea, select, button');
        var submitEl = null;
        inputs.forEach(function (el) {
            var name = el.getAttribute('name');
            var type = (el.getAttribute('type') || el.type || '').toLowerCase();
            if ((el.tagName === 'BUTTON' && (type === 'submit' || type === '')) || (el.tagName === 'INPUT' && type === 'submit')) {
                if (!submitEl && name) submitEl = el;
                return;
            }
            if (!name) return;
            if (overrides.hasOwnProperty(name)) return;
            if (type === 'checkbox' || type === 'radio') {
                if (el.checked || el.getAttribute('checked') !== null) appendField(name, el.value || 'on');
            } else if (el.tagName === 'SELECT') {
                var sel = el.querySelector('option[selected]') || el.options[el.selectedIndex];
                if (sel) appendField(name, sel.value);
            } else {
                appendField(name, el.value != null ? el.value : '');
            }
        });
        if (submitEl) {
            appendField(submitEl.getAttribute('name'), submitEl.value || submitEl.textContent.trim() || 'Salvar');
            log('submitForm: including submit button', submitEl.getAttribute('name'));
        } else {
            warn('submitForm: no named submit button found — server may reject');
        }
        Object.keys(overrides).forEach(function (k) {
            var v = overrides[k];
            if (v === false || v == null) return; // omit (unchecked checkboxes)
            appendField(k, v === true ? 'on' : v);
        });
        log('submitForm →', absAction.split('?')[0]);
        return fetch(absAction, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1' },
            body: parts.join('&')
        })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); })
            .then(function (buf) { return new DOMParser().parseFromString(new TextDecoder('iso-8859-1').decode(buf), 'text/html'); });
    }

    return { fetchPage: fetchPage, invalidatePage: invalidatePage, submitForm: submitForm };
}
