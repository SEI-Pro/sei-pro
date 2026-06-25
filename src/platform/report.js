import { aliasGlobal, getSeiPro, globalRef } from '../core/global.js';

/**
 * Captura de log + auto-report de bugs (camada de plataforma, isolated-world).
 *
 * Origem: cluster SEIPro*Log* / *AutoReport* de dist/js/sei-functions-pro.js.
 * Espelha o console (log/info/warn/error) num buffer (window + sessionStorage),
 * e em erros agenda um relatório automático debounced para o endpoint Apps Script
 * (restrito ao host da PRF). Envio delegado ao service worker via a fachada de
 * messaging (action 'enviarRelatorioBug').
 *
 * Comportamento preservado verbatim do legado; única mudança: o envio usa
 * SeiPro.core.messaging em vez de chrome.runtime.sendMessage cru.
 */

const LOG_STORAGE_KEY = '__sei_pro_report_logs__';
const LOG_MAX_ENTRIES = 200;
const LOG_MAX_CHARS = 60000;
const AUTO_REPORT_STATE_KEY = '__sei_pro_auto_report_state__';
const AUTO_REPORT_MAX_PER_SESSION = 10;
const AUTO_REPORT_DEBOUNCE_MS = 1500;
const APPS_SCRIPT_URL_FALLBACK = 'https://script.google.com/macros/s/AKfycby8ZZuKIHICpWYxEualArOnC1CIotYWXQvLNhe6eeoR-pQd1EOPNXjxt9UQ1XqJERxH/exec';
const PRF_SEI_HOSTNAME = 'sei.prf.gov.br';

export function installReport() {
    const win = globalRef;

    function isSEIProPRFHost() {
        return typeof win !== 'undefined' && win.location &&
            win.location.hostname === PRF_SEI_HOSTNAME;
    }

    function getSharedLogBuffer() {
        try {
            const raw = win.sessionStorage.getItem(LOG_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) { return []; }
    }
    function setSharedLogBuffer(logs) {
        try { win.sessionStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs)); } catch (e) {}
    }

    function trimLogs(logs) {
        if (!Array.isArray(logs)) return [];
        let compact = logs.map((e) => String(e || '').trim()).filter((e) => e !== '');
        if (compact.length > LOG_MAX_ENTRIES) compact = compact.slice(compact.length - LOG_MAX_ENTRIES);
        let totalChars = 0;
        const trimmed = [];
        for (let i = compact.length - 1; i >= 0; i--) {
            let entry = compact[i];
            if (!entry) continue;
            if (!trimmed.length && entry.length > LOG_MAX_CHARS) entry = entry.slice(entry.length - LOG_MAX_CHARS);
            if (totalChars + entry.length > LOG_MAX_CHARS && trimmed.length) break;
            totalChars += entry.length;
            trimmed.unshift(entry);
        }
        return trimmed;
    }

    function normalizeLogValue(value, seen, depth) {
        if (value === null || typeof value === 'undefined') return value;
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
        if (typeof value === 'bigint') return value.toString();
        if (typeof value === 'function') return '[Function ' + (value.name || 'anonymous') + ']';
        if (depth > 3) return '[Max depth]';
        if (value && typeof value === 'object') {
            if (seen.indexOf(value) !== -1) return '[Circular]';
            seen.push(value);
            if (value instanceof Date) { seen.pop(); return value.toISOString(); }
            if (value instanceof RegExp) { seen.pop(); return value.toString(); }
            if (value.jquery) {
                const jqSummary = { jquery: true, length: value.length };
                if (value.selector) jqSummary.selector = value.selector;
                seen.pop(); return jqSummary;
            }
            if (value.nodeType === 1 && value.tagName) {
                let attrs = value.id ? '#' + value.id : '';
                if (value.className && typeof value.className === 'string') {
                    attrs += '.' + value.className.trim().replace(/\s+/g, '.');
                }
                seen.pop(); return '<' + value.tagName.toLowerCase() + attrs + '>';
            }
            if (value.name && value.message && (value.stack || value.description)) {
                const err = { name: value.name, message: value.message };
                if (value.stack) err.stack = value.stack;
                if (value.description) err.description = value.description;
                seen.pop(); return err;
            }
            if (Array.isArray(value)) {
                const arr = value.map((item) => normalizeLogValue(item, seen, depth + 1));
                seen.pop(); return arr;
            }
            const clone = {};
            for (const key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    clone[key] = normalizeLogValue(value[key], seen, depth + 1);
                }
            }
            seen.pop(); return clone;
        }
        try { return String(value); } catch (e) { return '[Unserializable]'; }
    }

    function stringifyLogValue(value) {
        if (typeof value === 'string') return value;
        try {
            const normalized = normalizeLogValue(value, [], 0);
            return (typeof normalized === 'string') ? normalized : JSON.stringify(normalized);
        } catch (e) {
            try { return String(value); } catch (err) { return '[Unserializable]'; }
        }
    }

    function pushLog(level, argsLike) {
        const args = Array.prototype.slice.call(argsLike || []);
        const timestamp = (new Date()).toISOString();
        const label = String(level || 'log').toUpperCase();
        const body = args.map(stringifyLogValue).join(' ');
        const entry = '[' + timestamp + '] [' + label + ']' + (body ? ' ' + body : '');
        const localLogs = Array.isArray(win.__SEI_PRO_LOG_BUFFER__) ? win.__SEI_PRO_LOG_BUFFER__ : [];
        localLogs.push(entry);
        win.__SEI_PRO_LOG_BUFFER__ = trimLogs(localLogs);
        const sharedLogs = getSharedLogBuffer();
        sharedLogs.push(entry);
        setSharedLogBuffer(trimLogs(sharedLogs));
        return entry;
    }

    function getCollectedLogs() {
        const merged = trimLogs(getSharedLogBuffer().concat(
            Array.isArray(win.__SEI_PRO_LOG_BUFFER__) ? win.__SEI_PRO_LOG_BUFFER__ : []
        ));
        const seen = {};
        return merged.filter((entry) => {
            if (!entry || seen[entry]) return false;
            seen[entry] = true; return true;
        });
    }

    function getAppsScriptUrl() {
        return (typeof win.SEI_PRO_APPS_SCRIPT_URL !== 'undefined' && win.SEI_PRO_APPS_SCRIPT_URL)
            ? win.SEI_PRO_APPS_SCRIPT_URL : APPS_SCRIPT_URL_FALLBACK;
    }

    function getAutoReportState() {
        try {
            const raw = win.sessionStorage.getItem(AUTO_REPORT_STATE_KEY);
            let parsed = raw ? JSON.parse(raw) : {};
            if (!parsed || typeof parsed !== 'object') parsed = {};
            if (!parsed.sent || typeof parsed.sent !== 'object') parsed.sent = {};
            if (typeof parsed.count !== 'number') parsed.count = 0;
            return parsed;
        } catch (e) { return { count: 0, sent: {} }; }
    }
    function setAutoReportState(state) {
        try { win.sessionStorage.setItem(AUTO_REPORT_STATE_KEY, JSON.stringify(state)); } catch (e) {}
    }

    function getErrorSignature(textError) {
        const base = String(textError || '')
            .replace(/^\[[^\]]+\]\s+\[[^\]]+\]\s*/, '')
            .replace(/\s+/g, ' ').trim().slice(0, 500);
        return [win.location.pathname || '', base].join(' :: ');
    }

    function buildBugPayload(param) {
        const options = param || {};
        const descricaoBase = options.descricao || '';
        const detalhes = [];
        const includeLogs = (typeof options.includeLogs === 'undefined') ? true : !!options.includeLogs;
        if (options.modo === 'automatico') detalhes.push('Relatório automático de erro do navegador.');
        if (options.origem) detalhes.push('Origem: ' + options.origem);
        if (win.location && win.location.href) detalhes.push('Página: ' + win.location.href);
        return {
            tipo: options.tipo || 'bug',
            versao: (typeof win.VERSION_SPRO !== 'undefined') ? win.VERSION_SPRO : '',
            descricao: [descricaoBase].concat(detalhes).filter((i) => i && i.trim() !== '').join('\n\n'),
            erro_tecnico: options.erro_tecnico || '',
            logs: includeLogs ? JSON.stringify(getCollectedLogs(), null, '\t') : '',
            modo_envio: options.modo || 'manual',
            origem_erro: options.origem || ''
        };
    }

    function sendBugPayload(payload, handlers) {
        const callbacks = handlers || {};
        const appsScriptUrl = getAppsScriptUrl();
        const fail = (m) => { if (typeof callbacks.onError === 'function') callbacks.onError(m || 'Erro ao enviar relatório'); };
        const success = () => { if (typeof callbacks.onSuccess === 'function') callbacks.onSuccess(); };
        if (!appsScriptUrl) { fail('URL do servidor não configurada'); return; }
        getSeiPro().core.messaging.sendMessage({ action: 'enviarRelatorioBug', url: appsScriptUrl, payload })
            .then((response) => {
                if (response && response.ok) success();
                else fail(response && response.erro ? response.erro : '');
            })
            .catch(() => fail('Serviço de envio indisponível'));
    }

    function scheduleAutomaticErrorReport(textError, origem) {
        if (!textError || win.__SEI_PRO_AUTO_REPORT_SENDING__) return;
        if (!getAppsScriptUrl()) return;
        const normalized = String(textError || '').trim();
        if (!normalized) return;
        if (/Relat[oó]rio enviado|Erro ao enviar relat[oó]rio|Falha ao enviar relat[oó]rio/i.test(normalized)) return;
        const signature = getErrorSignature(normalized);
        const state = getAutoReportState();
        if (state.sent[signature]) return;
        if (state.count >= AUTO_REPORT_MAX_PER_SESSION) return;
        clearTimeout(win.__SEI_PRO_AUTO_REPORT_TIMER__);
        win.__SEI_PRO_AUTO_REPORT_TIMER__ = setTimeout(() => {
            const latestState = getAutoReportState();
            if (latestState.sent[signature] || latestState.count >= AUTO_REPORT_MAX_PER_SESSION) return;
            latestState.sent[signature] = true;
            latestState.count += 1;
            setAutoReportState(latestState);
            win.__SEI_PRO_AUTO_REPORT_SENDING__ = true;
            sendBugPayload(buildBugPayload({
                tipo: 'bug', descricao: 'Erro detectado automaticamente pela extensão.',
                erro_tecnico: normalized, modo: 'automatico', origem: origem || 'console.error', includeLogs: true
            }), {
                onSuccess: () => { win.__SEI_PRO_AUTO_REPORT_SENDING__ = false; },
                onError: () => { win.__SEI_PRO_AUTO_REPORT_SENDING__ = false; }
            });
        }, AUTO_REPORT_DEBOUNCE_MS);
    }

    function ensureLogCapture() {
        if (win.__SEI_PRO_LOG_CAPTURE_INSTALLED__) return;
        win.__SEI_PRO_LOG_CAPTURE_INSTALLED__ = true;
        const methods = ['log', 'info', 'warn', 'error'];
        win.__SEI_PRO_LOG_ORIGINALS__ = win.__SEI_PRO_LOG_ORIGINALS__ || {};
        methods.forEach((method) => {
            const original = (console && typeof console[method] === 'function')
                ? console[method]
                : (console && typeof console.log === 'function' ? console.log : function () {});
            win.__SEI_PRO_LOG_ORIGINALS__[method] = original;
            console[method] = function () {
                const entry = pushLog(method, arguments);
                if (method === 'error') scheduleAutomaticErrorReport(entry, 'console.error');
                return original.apply(console, arguments);
            };
        });
        win.addEventListener('error', (event) => {
            const hasMessage = !!(event && event.message);
            const hasFilename = !!(event && event.filename);
            const hasError = !!(event && event.error);
            if (!hasMessage && !hasFilename && !hasError) {
                pushLog('error', ['Script error (cross-origin/opaco, sem stack disponivel)', 'readyState=' + (document.readyState || '?')]);
                return;
            }
            const entry = pushLog('error', [
                hasMessage ? event.message : 'Unhandled error',
                hasFilename ? ('at ' + event.filename + ':' + event.lineno + ':' + event.colno) : '',
                hasError ? event.error : ''
            ]);
            scheduleAutomaticErrorReport(entry, 'window.error');
        }, true);
        win.addEventListener('unhandledrejection', (event) => {
            const entry = pushLog('error', ['Unhandled promise rejection', event && typeof event.reason !== 'undefined' ? event.reason : '']);
            scheduleAutomaticErrorReport(entry, 'unhandledrejection');
        }, true);
    }

    const report = {
        isSEIProPRFHost, getCollectedLogs, getAppsScriptUrl, getAutoReportState,
        buildBugPayload, sendBugPayload, scheduleAutomaticErrorReport, ensureLogCapture, pushLog
    };
    getSeiPro().core.report = report;

    // Globais legados (consumidos por init.js / sei-pro-all / atividades até migrarem).
    aliasGlobal('isSEIProPRFHost', isSEIProPRFHost);
    aliasGlobal('getSEIProCollectedLogs', getCollectedLogs);
    aliasGlobal('getSEIProAppsScriptUrl', getAppsScriptUrl);
    aliasGlobal('getSEIProAutoReportState', getAutoReportState);
    aliasGlobal('buildSEIProBugPayload', buildBugPayload);
    aliasGlobal('sendSEIProBugPayload', sendBugPayload);
    aliasGlobal('scheduleSEIProAutomaticErrorReport', scheduleAutomaticErrorReport);
    aliasGlobal('ensureSEIProLogCapture', ensureLogCapture);
    aliasGlobal('pushSEIProLog', pushLog);

    if (win.addEventListener) ensureLogCapture();
    return report;
}
