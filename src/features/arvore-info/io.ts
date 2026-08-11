/**
 * Fronteira de REDE da feature "Informações adicionais na árvore".
 */
import { escapeComponent } from '../../core/texto.js';

export const PAGE_CACHE_TTL_MS = 60 * 1000;

export type IoLogger = (...args: unknown[]) => void;

export type CreateIoDeps = {
    win: Window & typeof globalThis;
    log?: IoLogger;
    warn?: IoLogger;
    err?: IoLogger;
};

type CacheEntry = {
    promise: Promise<Document>;
    expiresAt: number;
};

export function createIo(deps: CreateIoDeps) {
    const win = deps.win;
    const log: IoLogger = deps.log || function () {};
    const warn: IoLogger = deps.warn || function () {};
    const err: IoLogger = deps.err || function () {};

    const pageCache: Record<string, CacheEntry | undefined> = Object.create(null);

    function invalidatePage(url: string) { delete pageCache[url]; }

    function fetchPage(url: string): Promise<Document> {
        const entry = pageCache[url];
        if (entry && entry.expiresAt > Date.now()) return entry.promise;
        if (entry) log('fetchPage cache expired →', url.split('?')[0]);
        else log('fetchPage →', url.split('?')[0]);

        function tryOnce() {
            return fetch(url, { credentials: 'include' })
                .then(function (r) {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.arrayBuffer();
                });
        }

        const promise = tryOnce()
            .catch(function (e: Error) {
                if (!/Failed to fetch|NetworkError/i.test(e.message)) throw e;
                return new Promise<void>(function (res) { setTimeout(res, 500); }).then(tryOnce);
            })
            .then(function (buf) {
                const html = new TextDecoder('iso-8859-1').decode(buf);
                return new DOMParser().parseFromString(html, 'text/html');
            })
            .catch(function (e: Error) {
                err('fetchPage failed for', url, e.message);
                delete pageCache[url];
                throw e;
            });

        pageCache[url] = { promise: promise, expiresAt: Date.now() + PAGE_CACHE_TTL_MS };
        return promise;
    }

    function submitForm(docA: Document, overrides: Record<string, unknown>): Promise<Document> {
        const form = docA.querySelector('form');
        if (!form) return Promise.reject(new Error('form not found in fetched page'));
        const action = form.getAttribute('action') || '';
        const absAction = new URL(action, docA.baseURI || win.location.href).href;
        const parts: string[] = [];
        function appendField(name: string, value: unknown) {
            parts.push(escapeComponent(name) + '=' + escapeComponent(value != null ? String(value) : ''));
        }
        const inputs = form.querySelectorAll('input, textarea, select, button');
        let submitEl: Element | null = null;
        inputs.forEach(function (el) {
            const name = el.getAttribute('name');
            const type = ((el.getAttribute('type') || (el as HTMLInputElement).type || '')).toLowerCase();
            if ((el.tagName === 'BUTTON' && (type === 'submit' || type === '')) || (el.tagName === 'INPUT' && type === 'submit')) {
                if (!submitEl && name) submitEl = el;
                return;
            }
            if (!name) return;
            if (Object.prototype.hasOwnProperty.call(overrides, name)) return;
            if (type === 'checkbox' || type === 'radio') {
                const input = el as HTMLInputElement;
                if (input.checked || el.getAttribute('checked') !== null) appendField(name, input.value || 'on');
            } else if (el.tagName === 'SELECT') {
                const selEl = el as HTMLSelectElement;
                const sel = selEl.querySelector('option[selected]') || selEl.options[selEl.selectedIndex];
                if (sel) appendField(name, (sel as HTMLOptionElement).value);
            } else {
                const input = el as HTMLInputElement | HTMLTextAreaElement;
                appendField(name, input.value != null ? input.value : '');
            }
        });
        if (submitEl) {
            const btn = submitEl as HTMLElement;
            appendField(btn.getAttribute('name') || '', (btn as HTMLInputElement).value || btn.textContent?.trim() || 'Salvar');
            log('submitForm: including submit button', btn.getAttribute('name'));
        } else {
            warn('submitForm: no named submit button found — server may reject');
        }
        Object.keys(overrides).forEach(function (k) {
            const v = overrides[k];
            if (v === false || v == null) return;
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
            .then(function (buf) {
                return new DOMParser().parseFromString(new TextDecoder('iso-8859-1').decode(buf), 'text/html');
            });
    }

    return { fetchPage: fetchPage, invalidatePage: invalidatePage, submitForm: submitForm };
}
