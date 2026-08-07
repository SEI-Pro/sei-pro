// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
const BRIDGE_ID = 'seipro-editor-ai-bridge';
const REQUEST_EVENT = 'seipro-editor-ai-request';
const RESPONSE_EVENT = 'seipro-editor-ai-response';
const OPEN_EVENT = 'seipro-editor-ai-open';
const INLINE_EVENT = 'seipro-editor-ai-inline';
const DEFAULT_TIMEOUT_MS = 5000;

let requestSequence = 0;

function element() {
    return document.getElementById(BRIDGE_ID);
}

export function requestEditor(operation, payload = {}, {
    timeoutMs = DEFAULT_TIMEOUT_MS
} = {}) {
    const target = element();
    if (!target) {
        return Promise.reject(new Error('A ponte isolada do editor ainda não está disponível'));
    }
    const id = `editor-ai-${Date.now()}-${++requestSequence}`;
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            target.removeEventListener(RESPONSE_EVENT, onResponse);
            reject(new Error(`Tempo esgotado ao executar ${operation} no editor`));
        }, timeoutMs);
        function onResponse() {
            let response;
            try {
                response = JSON.parse(target.dataset.response || '{}');
            } catch {
                return;
            }
            if (response.id !== id) return;
            clearTimeout(timer);
            target.removeEventListener(RESPONSE_EVENT, onResponse);
            if (response.ok) resolve(response.result);
            else reject(new Error(response.error || 'Falha na ponte do editor'));
        }
        target.addEventListener(RESPONSE_EVENT, onResponse);
        target.dataset.request = JSON.stringify({ id, operation, payload });
        target.dispatchEvent(new CustomEvent(REQUEST_EVENT));
    });
}

export const readEditorSnapshot = (payload) => requestEditor('snapshot', payload);
export const insertEditorHtml = (payload) => requestEditor('insertHtml', payload);

export function publishAiEditorConfig({ inlineEnabled = false, keyword = '+gpt' } = {}) {
    const target = element();
    if (!target) return false;
    target.dataset.config = JSON.stringify({
        inlineEnabled: inlineEnabled === true,
        keyword: String(keyword || '+gpt')
    });
    return true;
}

export function installIsolatedEditorAiBridge({ onOpen, onInline } = {}) {
    const attach = () => {
        const target = element();
        if (!target || target.dataset.isolatedInstalled === 'true') return false;
        target.dataset.isolatedInstalled = 'true';
        target.addEventListener(OPEN_EVENT, () => {
            let detail = {};
            try { detail = JSON.parse(target.dataset.open || '{}'); } catch { /* noop */ }
            if (typeof onOpen === 'function') void onOpen(detail);
        });
        target.addEventListener(INLINE_EVENT, () => {
            let detail = {};
            try { detail = JSON.parse(target.dataset.inline || '{}'); } catch { /* noop */ }
            if (typeof onInline === 'function') void onInline(detail);
        });
        return true;
    };
    if (attach()) return () => {};
    const observer = new MutationObserver(() => {
        if (attach()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return () => observer.disconnect();
}
