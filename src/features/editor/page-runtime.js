/**
 * Runtime helpers for the editor when it runs as a MAIN-world page script
 * (WAR-injected). Isolated content scripts already have chrome.*; page scripts do not.
 */
import { globalRef } from '../../core/global.js';
import { installCoreStack } from '../../core/stack.js';
import { q } from './lib/domq.js';

function ensureGlobal(name, value) {
    if (typeof globalRef[name] === 'undefined') {
        globalRef[name] = value;
    }
}

function extensionBaseFromDataset() {
    try {
        const root = globalRef.document && globalRef.document.documentElement;
        return (root && root.dataset && root.dataset.seiproExtensionUrl) || '';
    } catch (e) {
        return '';
    }
}

function hasRealChromeRuntime() {
    try {
        return !!(
            globalRef.chrome
            && globalRef.chrome.runtime
            && typeof globalRef.chrome.runtime.getURL === 'function'
            && globalRef.chrome.runtime.id
            && globalRef.chrome.runtime.id !== 'seipro-page-inject'
        );
    } catch (e) {
        return false;
    }
}

/** Install a minimal chrome.runtime so createRuntime / getUrlExtension work on the page. */
export function installPageChromeShim() {
    const base = extensionBaseFromDataset();
    if (!base || hasRealChromeRuntime()) return !!hasRealChromeRuntime();

    const root = globalRef.document.documentElement;
    const version = (root && root.dataset && root.dataset.seiproVersion) || '0';
    const shortName = (root && root.dataset && root.dataset.seiproShortName) || 'SPro';

    globalRef.chrome = {
        runtime: {
            id: 'seipro-page-inject',
            getURL(path) {
                return base.replace(/\/?$/, '/') + String(path || '').replace(/^\//, '');
            },
            getManifest() {
                return { version, short_name: shortName, icons: {} };
            },
            sendMessage(_message, callback) {
                if (typeof callback === 'function') {
                    callback({ ok: false, error: 'Runtime indisponível no mundo MAIN' });
                }
            },
            lastError: null
        }
    };
    return true;
}

function insertFontIconNative(elementTo, target) {
    const base = (typeof globalRef.URL_SPRO !== 'undefined' && globalRef.URL_SPRO)
        || extensionBaseFromDataset()
        || '';
    if (!base) return;

    let $target = target;
    if (!$target || typeof $target.find !== 'function') {
        $target = q('html');
    }
    if ($target.find('link[data-style="seipro-fonticon"]').length
        || $target.find('style[data-style="seipro-fonticon"]').length) {
        return;
    }

    const head = $target.find(elementTo || 'head');
    if (!head.length) return;

    const link = globalRef.document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.setAttribute('data-style', 'seipro-fonticon');
    link.href = base.replace(/\/?$/, '/') + 'css/fontawesome.pro.min.css';
    head.get(0).appendChild(link);

    const slim = !!(globalRef.localStorage.getItem('seiSlim') || globalRef.localStorage.getItem('seiSlim_editor'));
    const style = globalRef.document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('data-style', 'seipro-fonticon');
    style.setAttribute('data-index', '1');
    style.textContent = [
        '@font-face{font-family:"Font Awesome 5 Pro";font-style:normal;font-weight:900;font-display:block;',
        'src:url(' + base + 'webfonts/pro/fa-solid-900.woff2) format("woff2")}',
        '@font-face{font-family:"Font Awesome 5 Pro";font-style:normal;font-weight:400;font-display:block;',
        'src:url(' + base + 'webfonts/pro/fa-regular-400.woff2) format("woff2")}',
        slim
            ? '@font-face{font-family:"Font Awesome 5 Pro";font-style:normal;font-weight:300;font-display:block;src:url(' + base + 'webfonts/pro/fa-light-300.woff2) format("woff2")}'
            : ''
    ].join('');
    const headEl = $target.find('head').get(0);
    if (headEl) headEl.appendChild(style);

    if (globalRef.localStorage.getItem('seiSlim_editor')) {
        q('body').addClass('seiSlim seiSlim_parent seiSlim_view');
    }
}

/** Patch SEI link dialogs — must run against the page CKEDITOR. */
export function updateDialogDefinitionPro() {
    const CKE = globalRef.CKEDITOR;
    if (!CKE || typeof CKE.on !== 'function') return;
    CKE.on('dialogDefinition', function (ev) {
        const dialogName = ev.data.name;
        const dialogDefinition = ev.data.definition;
        if (dialogName === 'linkseiDialog') {
            dialogDefinition.onShow = function () {
                const idEditor = this.getParentEditor().name;
                q('#idEditor').val(idEditor);
                if (typeof globalRef.insertProtocoloOnBox === 'function') {
                    globalRef.insertProtocoloOnBox(idEditor);
                }
            };
        }
        if (dialogName === 'simpleLinkDialog') {
            dialogDefinition.onShow = function () {
                const idEditor = this.getParentEditor().name;
                q('#idEditor').val(idEditor);
                if (typeof globalRef.insertTextTotLink === 'function') {
                    globalRef.insertTextTotLink(idEditor);
                }
            };
            dialogDefinition.onOk = function () {
                const a = this.getParentEditor();
                const b = {};
                const c = a.document.createElement('a');
                this.commitContent(b);
                c.setAttribute('href', b.url);
                if (b.newPage) c.setAttribute('target', '_blank');
                switch (b.style) {
                case 'b': c.setStyle('font-weight', 'bold'); break;
                case 'u': c.setStyle('text-decoration', 'underline'); break;
                case 'i': c.setStyle('font-style', 'italic'); break;
                default: break;
                }
                c.setHtml(b.contents);
                a.insertElement(c);
                setTimeout(function () {
                    if (typeof globalRef.initDropImages === 'function') globalRef.initDropImages();
                }, 1000);
            };
        }
    });
}

function restoreProcessSessionFromStorage() {
    try {
        const storage = globalRef.sessionStorage;
        const raw = storage && typeof storage.getItem === 'function'
            ? storage.getItem('dadosSessionProcessoPro')
            : null;
        const parsed = raw ? JSON.parse(raw) : null;
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function resolveDocumentId() {
    const candidates = [];
    try {
        const params = new URL(globalRef.location.href).searchParams;
        candidates.push(params.get('id_documento'));
    } catch (_) { /* noop */ }
    try {
        const hidden = globalRef.document?.querySelector?.(
            '[name="id_documento"], #id_documento, #hdnIdDocumento'
        );
        if (hidden?.value) candidates.push(hidden.value);
    } catch (_) { /* noop */ }
    return candidates.map((value) => String(value || '').trim()).find((value) => /^\d+$/.test(value)) || '';
}

function resolveProcessId() {
    const urls = [];
    try { urls.push(globalRef.location.href); } catch (_) { /* noop */ }
    try { if (globalRef.document?.referrer) urls.push(globalRef.document.referrer); } catch (_) { /* noop */ }
    try {
        if (globalRef.opener && !globalRef.opener.closed) {
            urls.push(globalRef.opener.location?.href || '');
            const openerFrame = globalRef.opener.document?.querySelector?.('#ifrArvore, iframe[id*="Arvore"]');
            if (openerFrame?.src) urls.push(openerFrame.src);
        }
    } catch (_) { /* cross-window access can be unavailable */ }

    const candidates = [];
    try {
        const processData = globalRef.dadosProcessoPro?.propProcesso;
        if (processData?.hdnIdProcedimento) candidates.push(processData.hdnIdProcedimento);
    } catch (_) { /* noop */ }
    try {
        const hidden = globalRef.document?.querySelector?.(
            '[name="id_procedimento"], #id_procedimento, #hdnIdProcedimento, '
            + '[name="id_protocolo"], #id_protocolo, #hdnIdProtocolo'
        );
        if (hidden?.value) candidates.push(hidden.value);
        const dataId = globalRef.document?.querySelector?.('[data-id-procedimento], [data-id_procedimento]');
        if (dataId?.dataset?.idProcedimento) candidates.push(dataId.dataset.idProcedimento);
        if (dataId?.dataset?.id_procedimento) candidates.push(dataId.dataset.id_procedimento);
    } catch (_) { /* noop */ }

    urls.forEach((url) => {
        if (!url) return;
        try {
            if (typeof globalRef.getParamsUrlPro === 'function') {
                const parsed = globalRef.getParamsUrlPro(url);
                if (parsed) candidates.push(parsed.id_procedimento, parsed.id_protocolo);
            }
        } catch (_) { /* fall through to URL parsing */ }
        try {
            const params = new URL(url, globalRef.location.href).searchParams;
            candidates.push(params.get('id_procedimento'), params.get('id_protocolo'));
        } catch (_) { /* noop */ }
    });

    return candidates.map((value) => String(value || '').trim()).find((value) => /^\d+$/.test(value)) || '';
}

function parseHtml(html) {
    if (typeof globalRef.DOMParser !== 'function') return null;
    return new globalRef.DOMParser().parseFromString(String(html || ''), 'text/html');
}

function parseProcessTreeUrl(html, baseHref) {
    const document = parseHtml(html);
    const frame = document && (document.querySelector('#ifrArvore')
        || document.querySelector('iframe[id*="Arvore"]'));
    const src = frame && frame.getAttribute('src');
    if (!src) return '';
    try {
        return new URL(src, baseHref).href;
    } catch (e) {
        return String(src);
    }
}

export function extractProcessDocuments(html) {
    const document = parseHtml(html);
    if (!document) return [];
    const byId = new Map();
    Array.from(document.querySelectorAll('a[id^="anchor"]')).forEach((anchor) => {
        const id = String(anchor.id || '').replace(/^anchor/, '');
        if (!/^\d+$/.test(id)) return;
        const text = String(anchor.textContent || '').replace(/\s+/g, ' ').trim();
        if (!text) return;
        const match = text.match(/\(([^()]*)\)\s*$/);
        const documento = (match ? text.slice(0, match.index) : text).trim();
        const nrSei = match ? match[1].trim() : '';
        if (!documento) return;
        let src = '';
        try {
            const href = anchor.getAttribute('href') || '';
            const url = new URL(href, globalRef.location.href);
            if (url.searchParams.has('id_documento')) src = url.href;
        } catch (_) { /* keep metadata even when the tree link is malformed */ }
        byId.set(id, {
            id_protocolo: id,
            documento,
            nr_sei: nrSei,
            src
        });
    });
    return [...byId.values()];
}

export async function loadEditorProcessDocuments() {
    if (globalRef.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__ === 'ready') {
        const data = globalRef.dadosProcessoPro || {};
        return data.listDocumentos || data.treeModel?.documents || [];
    }
    if (globalRef.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__ === 'loading') return [];

    const existing = globalRef.dadosProcessoPro || {};
    const existingDocuments = Array.isArray(existing.listDocumentos)
        ? existing.listDocumentos
        : (Array.isArray(existing.treeModel?.documents) ? existing.treeModel.documents : []);
    if (existingDocuments.length) {
        globalRef.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__ = 'ready';
        markProcessDataStatus(`ready-${existingDocuments.length}`);
        return existingDocuments;
    }

    const id = resolveProcessId();
    const fetchImpl = globalRef.fetch;
    if (!/^\d+$/.test(id) || typeof fetchImpl !== 'function') {
        markProcessDataStatus('unavailable');
        return [];
    }

    globalRef.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__ = 'loading';
    markProcessDataStatus('loading');
    try {
        const current = new URL(globalRef.location.href);
        current.searchParams.set('acao', 'procedimento_trabalhar');
        current.searchParams.set('id_procedimento', id);
        current.searchParams.delete('id_documento');
        current.searchParams.delete('acao_origem');
        current.searchParams.delete('acao_retorno');

        const processResponse = await fetchImpl.call(globalRef, current.href, { credentials: 'same-origin' });
        if (!processResponse || processResponse.ok === false) throw new Error('process page unavailable');
        const processHtml = await processResponse.text();
        const treeUrl = parseProcessTreeUrl(processHtml, current.href);
        if (!treeUrl) throw new Error('process tree unavailable');
        const treeResponse = await fetchImpl.call(globalRef, treeUrl, { credentials: 'same-origin' });
        if (!treeResponse || treeResponse.ok === false) throw new Error('process tree unavailable');
        const documents = extractProcessDocuments(await treeResponse.text());
        if (!documents.length) throw new Error('process tree has no documents');

        const next = { ...existing, listDocumentos: documents };
        next.treeModel = { ...(existing.treeModel || {}), documents };
        globalRef.dadosProcessoPro = next;
        globalRef.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__ = 'ready';
        markProcessDataStatus(`ready-${documents.length}`);
        if (typeof globalRef.dispatchEvent === 'function' && typeof globalRef.CustomEvent === 'function') {
            globalRef.dispatchEvent(new globalRef.CustomEvent('seipro-processo-dados-ready'));
        }
        return documents;
    } catch (e) {
        globalRef.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__ = 'error';
        markProcessDataStatus('error');
        try { globalRef.console?.warn?.('SEI Pro: process documents unavailable', e); } catch (_) { /* noop */ }
        return [];
    }
}

function markProcessDataStatus(status) {
    try {
        globalRef.document?.documentElement?.setAttribute('data-seipro-editor-process-data', String(status));
    } catch (_) { /* noop */ }
}

export function syncDadosProcessoPro() {
    try {
        const id = resolveProcessId();
        const documentId = resolveDocumentId();
        const restored = typeof globalRef.sessionStorageRestorePro === 'function'
            ? globalRef.sessionStorageRestorePro('dadosSessionProcessoPro')
            : null;
        const all = Array.isArray(restored) ? restored : restoreProcessSessionFromStorage();
        if (!Array.isArray(all)) return false;
        let found = null;
        for (let i = 0; i < all.length; i++) {
            const d = all[i];
            if (!d) continue;
            const hid = d.propProcesso && d.propProcesso.hdnIdProcedimento;
            const lid = d.listAndamento && d.listAndamento.id_procedimento;
            const documents = [
                ...(Array.isArray(d.listDocumentos) ? d.listDocumentos : []),
                ...(Array.isArray(d.treeModel?.documents) ? d.treeModel.documents : [])
            ];
            const matchesDocument = documentId && documents.some((document) =>
                String(document?.id_documento || document?.id_protocolo || document?.id || '') === documentId
            );
            if ((id && (String(hid) === String(id) || String(lid) === String(id))) || matchesDocument) {
                found = d;
                break;
            }
        }
        if (found) {
            globalRef.dadosProcessoPro = found;
            return true;
        }
    } catch (e) { /* noop */ }
    return false;
}

function runEditorProcessoCallbacks() {
    if (globalRef.__SEI_PRO_EDITOR_PROCESSO_CB__) return;
    const dados = globalRef.dadosProcessoPro;
    if (!dados || (!dados.listDocumentos && !dados.propProcesso)) return;
    globalRef.__SEI_PRO_EDITOR_PROCESSO_CB__ = true;
    try {
        if (typeof globalRef.getDialogDadosEditor === 'function') {
            globalRef.getDialogDadosEditor();
        }
    } catch (e) { /* noop */ }
    try {
        if (typeof globalRef.insertAutomaticMinutaWatermark === 'function') {
            globalRef.insertAutomaticMinutaWatermark();
        }
    } catch (e2) { /* noop */ }
}

function installEditorPageState() {
    // Mirrors the scalars sei-functions/state.js installs for isolated content scripts.
    // Without these, MAIN-world editor code throws ReferenceError on bare reads.
    ensureGlobal('delayCrash', false);
    ensureGlobal('dialogBoxPro', false);
    ensureGlobal('dialogIsDraggable', false);
    ensureGlobal('alertBoxPro', false);
    ensureGlobal('configBoxPro', false);
    ensureGlobal('iframeBoxPro', false);
    ensureGlobal('editorBoxPro', false);
    ensureGlobal('dadosProcessoPro', {});
    ensureGlobal('url_host', String(globalRef.location.href.split('?')[0] || ''));
    // Control / format chars — full table lives in sei-functions/state.js; this covers
    // the common editor cleanup paths (ZW*, BOM, C0/C1).
    ensureGlobal(
        'invisibleCharacters',
        /[\0-\x1F\x7F-\x9F\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g
    );

    if (globalRef.URL_SPRO) {
        globalRef.iconSeiPro = globalRef.URL_SPRO + 'icons/menu/seipro.png';
    } else {
        ensureGlobal('iconSeiPro', '');
    }

    if (typeof globalRef.siglaUnidadeAtual === 'undefined') {
        try {
            const lnk = globalRef.document.querySelector('#lnkInfraUnidade');
            const sel = globalRef.document.querySelector('#selInfraUnidades');
            const opt = sel && sel.options && sel.selectedIndex >= 0
                ? sel.options[sel.selectedIndex]
                : null;
            globalRef.siglaUnidadeAtual = (
                (lnk && (lnk.textContent || lnk.innerText))
                || (opt && opt.textContent)
                || ''
            ).trim();
        } catch (e) {
            globalRef.siglaUnidadeAtual = '';
        }
    }

    if (typeof globalRef.frmEditor === 'undefined') {
        try {
            globalRef.frmEditor = globalRef.document.querySelector('#frmEditor')
                || globalRef.document.querySelector('.infra-editor__editor-completo')
                || null;
        } catch (e2) {
            globalRef.frmEditor = null;
        }
    }
}

function installSoftPageGlobals() {
    installEditorPageState();

    ensureGlobal('insertFontIcon', function (elementTo, target) {
        if (typeof globalRef.loadFontIcons === 'function' && (globalRef.jQuery || globalRef.$)) {
            try {
                return globalRef.loadFontIcons(elementTo, target);
            } catch (e) { /* fall through */ }
        }
        return insertFontIconNative(elementTo, target);
    });
    ensureGlobal('updateDialogDefinitionPro', updateDialogDefinitionPro);
    ensureGlobal('reloadModalLink', function () {});
    ensureGlobal('getStylesOnEditor', function () {});
    ensureGlobal('checkLoadJqueryUI', function (cb) {
        if (typeof cb === 'function') cb();
    });
    ensureGlobal('checkHostLimit', function () { return false; });
    ensureGlobal('restrictConfigValue', function (name) {
        return typeof globalRef.checkConfigValue === 'function'
            ? globalRef.checkConfigValue(name)
            : true;
    });
    ensureGlobal('sanitizeHTML', function (html) { return html; });
    ensureGlobal('alertaBoxPro', function (status, icon, text) {
        try { console.warn('SEI Pro:', text); } catch (e) { /* noop */ }
    });
    ensureGlobal('initChosenReplace', function () {});
    ensureGlobal('enableButtonSavePro', function () {});
    ensureGlobal('resetDialogBoxPro', function () {});
    ensureGlobal('checkProcessoSigiloso', function () { return false; });
    ensureGlobal('getCitacaoDoc', function () { return ''; });
    ensureGlobal('setMomentPtBr', function () {});
    ensureGlobal('centralizeDialogBoxEditor', function () {});
    ensureGlobal('resizeHeigthDialogBox', function () {});
    ensureGlobal('initResizeImg', function () {});
    ensureGlobal('loadCSSResize', function () {});
    ensureGlobal('loadGoogleDocs', function () {});
    ensureGlobal('getBase64Image', function () { return ''; });
    ensureGlobal('getQRProcesso', function () { return ''; });
    ensureGlobal('sumTagValue', function (v) { return v; });
    ensureGlobal('camposDinamicosProcesso', function (tags) { return tags || {}; });
    ensureGlobal('getInteressadosProcesso', function (_text, cb) {
        if (typeof cb === 'function') cb([]);
    });
    ensureGlobal('copyToClipboard', function (text) {
        try {
            const ta = globalRef.document.createElement('textarea');
            ta.value = text == null ? '' : String(text);
            globalRef.document.body.appendChild(ta);
            ta.select();
            globalRef.document.execCommand('copy');
            ta.remove();
        } catch (e) { /* noop */ }
    });
    ensureGlobal('waitLoadPro', function (_obj, _root, _elem, func) {
        if (typeof func === 'function') setTimeout(func, 50);
    });
    // Never create the checker iframe from MAIN — it races SEI editor iframes.
    ensureGlobal('getDadosIframeProcessoPro', function () {});
    ensureGlobal('getDadosProcessoSession', function () {
        syncDadosProcessoPro();
        return globalRef.dadosProcessoPro || false;
    });
    ensureGlobal('pullDadosProcessoSession', function () {
        syncDadosProcessoPro();
        return globalRef.dadosProcessoPro || {};
    });
    ensureGlobal('loadEditorProcessDocuments', loadEditorProcessDocuments);

    if (typeof globalRef.dadosProcessoPro === 'undefined') {
        globalRef.dadosProcessoPro = {};
    }
    syncDadosProcessoPro();
    loadEditorProcessDocuments();
    runEditorProcessoCallbacks();
    const processDataTimer = setInterval(function () {
        if (globalRef.__SEI_PRO_EDITOR_PROCESSO_CB__) {
            clearInterval(processDataTimer);
            return;
        }
        if (syncDadosProcessoPro()) {
            runEditorProcessoCallbacks();
            if (globalRef.__SEI_PRO_EDITOR_PROCESSO_CB__) clearInterval(processDataTimer);
        }
    }, 1500);
    try {
        globalRef.addEventListener('seipro-processo-dados-ready', function () {
            syncDadosProcessoPro();
            runEditorProcessoCallbacks();
        });
        globalRef.addEventListener('sei-pro-process-session-updated', function () {
            syncDadosProcessoPro();
            runEditorProcessoCallbacks();
        });
    } catch (e3) { /* noop */ }
}

/**
 * Boot core stack + page-only shims when the editor runs in MAIN (WAR inject).
 * No-op when already running as an isolated content script with a real stack.
 */
export function installEditorPageRuntime() {
    if (globalRef.__SEI_PRO_EDITOR_PAGE_RUNTIME__) {
        return globalRef.__SEI_PRO_EDITOR_PAGE_RUNTIME__;
    }

    const pageInjected = !!extensionBaseFromDataset() && !hasRealChromeRuntime();
    if (pageInjected) {
        installPageChromeShim();
    }

    // Isolated editor path already has core-stack.bundle.js; page path needs it.
    if (!globalRef.SeiPro || !globalRef.SeiPro.core || !globalRef.SeiPro.core.runtime) {
        installCoreStack();
    }

    if (typeof globalRef.getPathExtensionPro === 'function') {
        try { globalRef.getPathExtensionPro(); } catch (e) { /* noop */ }
    }

    try {
        const ns = typeof globalRef._P === 'function' ? globalRef._P() : null;
        if (ns) {
            if (ns.URL_SPRO) globalRef.URL_SPRO = ns.URL_SPRO;
            if (ns.NAMESPACE_SPRO) globalRef.NAMESPACE_SPRO = ns.NAMESPACE_SPRO;
            if (ns.VERSION_SPRO) globalRef.VERSION_SPRO = ns.VERSION_SPRO;
        }
    } catch (e) { /* noop */ }

    if (!globalRef.URL_SPRO) {
        const base = extensionBaseFromDataset();
        if (base) globalRef.URL_SPRO = base;
    }
    if (!globalRef.NAMESPACE_SPRO) {
        try {
            globalRef.NAMESPACE_SPRO =
                (globalRef.document.documentElement.dataset.seiproShortName) || 'SPro';
        } catch (e2) {
            globalRef.NAMESPACE_SPRO = 'SPro';
        }
    }

    installSoftPageGlobals();
    const result = { pageInjected };
    globalRef.__SEI_PRO_EDITOR_PAGE_RUNTIME__ = result;
    return result;
}

// Side-effect install so entry import order runs this before legis/editor boot.
installEditorPageRuntime();
