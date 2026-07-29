/**
 * Projetos view — shared helpers.
 */
import { globalRef } from '../../../core/global.js';
import { dispatchProjetoAction, hasLocalCapacidade } from '../store.js';
import { hasRemoteBackend, runProjetoAction } from '../io.js';

let ganttLoading = null;

export function can(name) {
    if (typeof globalRef.checkCapacidade === 'function' && hasRemoteBackend()) {
        try { return !!globalRef.checkCapacidade(name); } catch (e) { /* fall through */ }
    }
    return hasLocalCapacidade(name);
}

export function formToObject(form) {
    const data = {};
    new FormData(form).forEach((v, k) => { data[k] = v; });
    if (form.querySelector('[name="marco"]')) {
        data.marco = !!form.querySelector('[name="marco"]').checked;
    }
    return data;
}

export function act(action, param) {
    return runProjetoAction({ action, ...param }, dispatchProjetoAction);
}

export function escapeText(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function downloadText(filename, text, mime) {
    const blob = new Blob([text], { type: mime || 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}

export function getExtensionUrl() {
    if (typeof globalRef.getUrlExtension === 'function') return globalRef.getUrlExtension('');
    if (globalRef.URL_SPRO) return globalRef.URL_SPRO;
    try { return chrome.runtime.getURL(''); } catch (e) { return ''; }
}

export function loadStyle(href) {
    if (typeof globalRef.loadStylePro === 'function') {
        globalRef.loadStylePro(href);
        return;
    }
    if (document.querySelector('link[href="' + href + '"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

export function loadGanttLib() {
    if (globalRef.Gantt) return Promise.resolve(globalRef.Gantt);
    if (ganttLoading) return ganttLoading;
    const base = getExtensionUrl();
    loadStyle(base + 'css/frappe-gantt.css');
    ganttLoading = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = base + 'js/lib/frappe-gantt.js';
        s.onload = () => resolve(globalRef.Gantt);
        s.onerror = () => reject(new Error('Falha ao carregar frappe-gantt'));
        document.head.appendChild(s);
    });
    return ganttLoading;
}
