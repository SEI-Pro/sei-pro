/**
 * Árvore — pure domain.
 *
 * Menus, upload serialization, link parsing, dropzone MIME→icon, sticknote
 * paragraph formatting, and init signature hashing. No DOM, no jQuery, no
 * chrome.* (callers inject formatters / URL parsers when needed).
 */

import { isValidEditorMontarUrl } from '../../shared/sei-editor-url.js';

function isMenuEntry(value) {
    return Array.isArray(value) && typeof value[0] === 'string' && value[0].trim() !== '';
}

export function resolveMenuSelection(stored, fallback) {
    if (!Array.isArray(stored) || stored.length === 0) return fallback;
    const valid = stored.filter(isMenuEntry).map((entry) => [entry[0]]);
    return valid.length > 0 ? valid : fallback;
}

export function resolveMenuCatalogs(stored, defaults) {
    const source = stored || {};
    return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [
        key,
        resolveMenuSelection(source[key], fallback)
    ]));
}

export function hasUploadFiles(dataTransfer) {
    if (!dataTransfer) return false;
    if (dataTransfer.files && dataTransfer.files.length > 0) return true;
    if (!dataTransfer.types) return false;
    return Array.prototype.indexOf.call(dataTransfer.types, 'Files') !== -1;
}

export function serializeUploadAttachment(response, params, formatBytes) {
    const tamanho = response[3];
    const value = [response[0], response[1], response[4], tamanho,
        formatBytes(Number.parseInt(tamanho, 10)), params.userUnidade.user,
        params.userUnidade.unidade].join('\u00B1');
    return encodeURIComponent(value.replace(/ /g, '+')).replace(/%C2/g, '').replace(/%2B/g, '+');
}

export function extractUploadExtensions(lines) {
    return lines.reduce((extensions, line) => {
        if (line.includes('arrExt')) {
            const extension = line.split('"')[1];
            if (extension !== undefined) extensions.push(`.${extension}`);
        }
        return extensions;
    }, []);
}

/** Parse SEI documento_receber HTML scripts for infraUpload URL + user/unidade. */
export function parseInfraUploadMeta(html) {
    const lines = String(html || '').split('\n');
    let urlUpload = '';
    let userUnidade = { user: '', unidade: '' };
    const userRegex = /\s*objTabelaAnexos\.adicionar\(\[arr\['nome_upload'\],arr\['nome'\],arr\['data_hora'\],arr\['tamanho'],infraFormatarTamanhoBytes\(arr\['tamanho'\]\),'(.+?)' ,'(.+?)']\);/;
    lines.forEach((value) => {
        if (value.indexOf('objUpload = new infraUpload') !== -1) {
            const quoted = value.match(/'([^']+)'/g) || [];
            const parts = quoted.map((q) => q.slice(1, -1));
            urlUpload = parts.find((s) => /controlador|upload/i.test(s)) || parts[2] || parts[3] || '';
        }
        if (value.indexOf('objTabelaAnexos.adicionar') !== -1) {
            const paramV = userRegex.exec(value);
            if (paramV) userUnidade = { user: paramV[1], unidade: paramV[2] };
        }
    });
    return {
        urlUpload,
        extensions: extractUploadExtensions(lines),
        userUnidade
    };
}

/** Pick series option from filename / defaults (pure). */
export function resolveUploadSerie({
    fileName,
    seriesOptions,
    defaultDocName,
    removeAccents
}) {
    const normalize = typeof removeAccents === 'function'
        ? (s) => removeAccents(String(s || '').trim().toLowerCase().replace(/_|:/g, ' '))
        : (s) => String(s || '').trim().toLowerCase().replace(/_|:/g, ' ');
    const nameFileReg = normalize(fileName);
    let valueSerie = false;
    let matched = null;
    for (const opt of seriesOptions || []) {
        const nameOption = normalize(opt.name);
        const nameOptionReg = nameOption.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const reg = new RegExp('^\\b' + nameOptionReg, 'igm');
        if (reg.test(nameFileReg)) {
            valueSerie = opt.value;
            matched = opt;
            break;
        }
    }
    const findByName = (needle) => (seriesOptions || []).find((v) => normalize(v.name) === needle);
    let selSerieDefault = defaultDocName
        ? findByName(String(defaultDocName).trim().toLowerCase().replace(/_|:/g, ' '))
        : findByName('anexo');
    if (!selSerieDefault) {
        selSerieDefault = (seriesOptions || []).find((v) => normalize(v.name).indexOf('anexo') !== -1);
    }
    if (!selSerieDefault) selSerieDefault = (seriesOptions || [])[0];
    const selSerie = valueSerie || (selSerieDefault && selSerieDefault.value);
    const selSerieSelected = matched || selSerieDefault;
    return { selSerie, selSerieSelected };
}

/** Document title derived from filename + series name. */
export function buildUploadDocumentTitle(fileName, serieName) {
    let nameDoc = String(fileName || '').normalize('NFC');
    if (serieName) {
        const reg = new RegExp('^\\b' + String(serieName).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'igm');
        if (reg.test(nameDoc)) nameDoc = nameDoc.replace(reg, '').trim();
    }
    const dot = nameDoc.lastIndexOf('.');
    if (dot !== -1) nameDoc = nameDoc.substring(0, dot);
    nameDoc = (nameDoc.length > 50) ? nameDoc.replace(/^(.{50}[^\s]*).*/, '$1') : nameDoc;
    nameDoc = (nameDoc.length > 50) ? nameDoc.substring(0, 49) : nameDoc;
    return nameDoc;
}

/** Extract tree node fields from infraArvoreNo script line. */
export function parseArvoreDocumentoNoLine(line) {
    const parts = String(line || '').split('"');
    return {
        href: parts[7] || '',
        title: parts[11] || '',
        icon: parts[15] || ''
    };
}

/** Find arvore reload URL and documento node line in SEI HTML. */
export function findArvoreUpdateTargets(html, idProcedimento, idDocumento) {
    const lines = String(html || '').split('\n');
    let urlArvore = '';
    for (const value of lines) {
        if (
            value.indexOf("atualizarArvore('controlador.php?acao=procedimento_visualizar&acao_origem=arvore_visualizar&id_procedimento=" + idProcedimento + "&id_documento=" + idDocumento) !== -1
            || value.indexOf('var linkMontarArvoreProcessoDocumento') !== -1
        ) {
            urlArvore = value.split("'")[1] || '';
            break;
        }
    }
    return { urlArvore };
}

export function findDocumentoNoInArvoreHtml(htmlArvore, idDocumento, idProcedimento) {
    const needle = 'new infraArvoreNo("DOCUMENTO","' + idDocumento + '","' + idProcedimento + '"';
    for (const value of String(htmlArvore || '').split('\n')) {
        if (value.indexOf(needle) !== -1) return parseArvoreDocumentoNoLine(value);
    }
    return null;
}

export function sortUploadFiles(files, getPosition) {
    return files.slice().sort((a, b) => getPosition(a) > getPosition(b) ? 1 : -1);
}

/**
 * Extract controlador.php links from inline tree script text.
 * `resolveIdDocumento(prevLink)` is optional — when provided, download links
 * get the fake visualizar suffix (legacy parent.getParamsUrlPro path).
 */
export function getLinksInText(text, resolveIdDocumento) {
    const array = [];
    let index = 0;
    String(text || '').split("'").filter((el) => el.indexOf('controlador.php') !== -1).forEach((v) => {
        const parts = v.indexOf('"') !== -1
            ? v.split('"').filter((i) => i.indexOf('controlador.php') !== -1)
            : [v];
        parts.forEach((j) => {
            const link = j.replace(/[\\"]/g, '');
            if (link.indexOf('acao=editor_montar') !== -1 && !isValidEditorMontarUrl(link)) {
                return;
            }
            let ldownload = '';
            if (
                link.indexOf('documento_download_anexo') !== -1 &&
                link.indexOf('arvore=1') === -1 &&
                typeof resolveIdDocumento === 'function'
            ) {
                const id = resolveIdDocumento(array[index - 2]);
                if (id) {
                    ldownload = '#&_fake_acao=documento_visualizar&_id_documento=' + id;
                }
            }
            array.push(link + ldownload);
            index++;
        });
    });
    if (array.length === 0) return [];
    return array.sort().filter((item, pos, ary) => !pos || item !== ary[pos - 1]);
}

/**
 * MIME → SEI tree icon path (pure; no DOM).
 * PRF ships `imagens/*.gif` for file types; `svg/documento_*.svg` 404s even when isNewSEI.
 * `isNewSEI` kept for call-site compatibility; ignored for these icons.
 */
export function resolveDropzoneIcon(fileType, _isNewSEI) {
    const type = String(fileType || '');
    const gif = (name) => `/infra_css/imagens/${name}.gif`;
    let urlIcon = gif('pdf');
    if (type.indexOf('image/') !== -1) urlIcon = gif('imagem');
    else if (type.indexOf('video/') !== -1) urlIcon = gif('video');
    else if (type.indexOf('audio/') !== -1) urlIcon = gif('audio');
    else if (type.indexOf('application/zip') !== -1) urlIcon = gif('zip');
    else if (type.indexOf('text/htm') !== -1) urlIcon = gif('html');
    else if (type.indexOf('text/plain') !== -1) urlIcon = gif('txt');
    else if (type.indexOf('word') !== -1) urlIcon = gif('doc');
    else if (type.indexOf('officedocument.presentation') !== -1) urlIcon = gif('pps');
    else if (type.indexOf('text/csv') !== -1 || type.indexOf('sheet') !== -1) urlIcon = gif('xls');
    return urlIcon;
}

/**
 * Convert sticknote plain text (with [ ] / [X] markers) into paragraph HTML.
 * `linkify(text)` injects SEI process links (legacy replaceTextToProcessoSEI).
 */
export function formatAnotacaoToParagraphs(value, linkify) {
    const transform = typeof linkify === 'function' ? linkify : (t) => t;
    const raw = String(value || '');
    const lines = raw.indexOf('\n') !== -1 ? raw.trim().split('\n') : (raw ? [raw] : []);
    let result = '';
    lines.forEach((v, i) => {
        if (v !== '') {
            let check = v.indexOf('[ ]') !== -1 ? ' class="stickNoteCheck"' : '';
            check = v.indexOf('[X]') !== -1 ? ' class="stickNoteCheck stickNoteChecked"' : check;
            let text = v.indexOf('[ ]') !== -1 ? v.replace('[ ]', '').trim() : v;
            text = v.indexOf('[X]') !== -1 ? v.replace('[X]', '').trim() : text;
            result += '<div' + check + '>' + transform(text) + '</div>';
        } else if (i !== 0) {
            result += '<div><br></div>';
        }
    });
    return result;
}

/** Fingerprint tree anchors for idempotent init (pure given id/href pairs). */
export function buildArvoreInitSignature(anchors) {
    if (!Array.isArray(anchors) || anchors.length === 0) return '';
    return anchors.map((a) => [a.id || '', a.href || ''].join('|')).join('::');
}

export function sticknotePresetRankIconHtml(label, text, bars) {
    return (
        '<i class="fas seipro-sticknote-preset seipro-arvore-sticknote-preset" title="' + label +
        '" aria-label="' + label +
        '" role="button" data-seipro-sticknote-preset="' + text +
        '" style="cursor:pointer;color:#666;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;line-height:1;font-size:0;">' +
            '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" style="width:30px;height:30px;display:block;pointer-events:none;">' +
                '<circle cx="10" cy="10" r="8.2" fill="none" stroke="currentColor" stroke-width="1.25"></circle>' +
                bars +
            '</svg>' +
        '</i>'
    );
}
