/**
 * Árvore upload IO — fetch/XHR vanilla (no jQuery).
 */
import { parseDocument } from '../../dom/index.js';
import { parseInfraUploadMeta } from './domain.js';

const MENU_STORAGE_KEYS = {
    process: 'configViewFlashMenuPro',
    document: 'configViewFlashDocMenuPro',
    tree: 'configViewFlashDocArvorePro',
    panel: 'configViewFlashPanelArvorePro'
};

const MENU_OPTION_KEYS = {
    process: 'optionsFlashMenu_menuproc',
    document: 'optionsFlashMenu_menudoc',
    tree: 'optionsFlashMenu_iconstree',
    panel: 'optionsFlashMenu_panelinfo'
};

export function readArvoreMenuConfig({ restore, getOption }) {
    const stored = Object.fromEntries(Object.entries(MENU_STORAGE_KEYS).map(([name, key]) => [
        name,
        restore(key)
    ]));
    const enabled = Object.fromEntries(Object.entries(MENU_OPTION_KEYS).map(([name, key]) => [
        name,
        getOption(key) !== 'disabled'
    ]));
    return { stored, enabled };
}

function defaultFetch(url, init) {
    return fetch(url, { credentials: 'same-origin', ...init }).then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
    });
}

export function fetchText(url, deps = {}) {
    const doFetch = deps.fetch || defaultFetch;
    return doFetch(url).then((html) => {
        if (typeof deps.onSuccess === 'function') deps.onSuccess(html);
        return html;
    });
}

/** @deprecated Dropzone-era ajax adapter — prefer fetchText */
export function fetchUploadPage({ ajax, url, onSuccess, fetch: fetchImpl }) {
    if (typeof fetchImpl === 'function' || !ajax) {
        return fetchText(url, { fetch: fetchImpl, onSuccess });
    }
    return ajax({ url }).done(onSuccess);
}

export function postFormData(url, data, deps = {}) {
    const body = typeof data === 'string'
        ? data
        : Object.keys(data || {}).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&');
    const doFetch = deps.fetch || ((u, init) => fetch(u, { credentials: 'same-origin', ...init }).then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
    }));
    return doFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body
    }).then((html) => {
        if (typeof deps.onSuccess === 'function') deps.onSuccess(html);
        return html;
    });
}

/** @deprecated Dropzone-era ajax adapter — prefer postFormData */
export function postUploadForm({ ajax, url, data, onSuccess, fetch: fetchImpl }) {
    if (typeof fetchImpl === 'function' || !ajax) {
        return postFormData(url, data, { fetch: fetchImpl, onSuccess });
    }
    return ajax({ method: 'POST', data, url }).done(onSuccess);
}

/**
 * POST ISO-8859-1 form body (SEI save document). Uses XHR to keep responseURL.
 */
export function postSavedUpload({ url, data, onSuccess, xhrFactory = () => new XMLHttpRequest() }) {
    const xhr = xhrFactory();
    return new Promise((resolve, reject) => {
        xhr.open('POST', url, true);
        xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=ISO-8859-1');
        xhr.onload = () => {
            const html = xhr.responseText;
            if (typeof onSuccess === 'function') onSuccess(html, xhr);
            resolve({ html, xhr });
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(data);
    });
}

/** Collect hidden/text/select/radio fields from #frmDocumentoCadastro. */
export function readDocumentoCadastroFields(doc) {
    const form = doc.querySelector('#frmDocumentoCadastro');
    if (!form) return { hrefForm: '', fields: {}, seriesOptions: [], checkedNivel: null };
    const fields = {};
    form.querySelectorAll('input[type=hidden]').forEach((el) => {
        if (el.name && el.id && el.id.indexOf('hdn') !== -1) fields[el.name] = el.value;
    });
    form.querySelectorAll('input[type=text]').forEach((el) => {
        if (el.id && el.id.indexOf('txt') !== -1) fields[el.id] = el.value;
    });
    form.querySelectorAll('select').forEach((el) => {
        if (el.id && el.id.indexOf('sel') !== -1) fields[el.id] = el.value;
    });
    form.querySelectorAll('input[type=radio]').forEach((el) => {
        if (el.name && el.name.indexOf('rdo') !== -1 && el.checked) fields[el.name] = el.value;
    });
    const seriesOptions = [];
    form.querySelectorAll('#selSerie option').forEach((opt) => {
        if (opt.textContent.trim() !== '') {
            seriesOptions.push({ name: opt.textContent.trim().toLowerCase().replace(/_|:/g, ' '), value: opt.value });
        }
    });
    const checkedNivel = form.querySelector('input[name="rdoNivelAcesso"]:checked');
    return {
        hrefForm: form.getAttribute('action') || '',
        fields,
        seriesOptions,
        checkedNivel: checkedNivel ? checkedNivel.value : null
    };
}

export function readEscolherTipoForm(doc) {
    const form = doc.querySelector('#frmDocumentoEscolherTipo');
    if (!form) return { urlForm: '', param: {} };
    const param = {};
    form.querySelectorAll('input[type=hidden]').forEach((el) => {
        if (el.name && el.id && el.id.indexOf('hdn') !== -1) param[el.name] = el.value;
    });
    param.hdnIdSerie = -1;
    return { urlForm: form.getAttribute('action') || '', param };
}

export function findDocumentoReceberHref(doc) {
    const a = doc.querySelector('#tblSeries a[href*="controlador.php?acao=documento_receber"]');
    return a ? a.getAttribute('href') : null;
}

export function isEscolherTipoPostFlow(doc) {
    const a = doc.querySelector('#tblSeries a.ancoraOpcao');
    return a && a.getAttribute('href') === '#';
}

export function parseUploadPageHtml(html) {
    const doc = parseDocument(html);
    return {
        doc,
        meta: parseInfraUploadMeta(html),
        cadastro: readDocumentoCadastroFields(doc),
        escolherTipo: readEscolherTipoForm(doc),
        documentoReceberHref: findDocumentoReceberHref(doc),
        isPostFlow: isEscolherTipoPostFlow(doc)
    };
}
