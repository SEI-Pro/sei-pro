/**
 * Árvore — pure domain.
 *
 * Menus, upload serialization, link parsing, dropzone MIME→icon, sticknote
 * paragraph formatting, and init signature hashing. No DOM, no jQuery, no
 * chrome.* (callers inject formatters / URL parsers when needed).
 */

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

/** MIME → SEI tree icon path (pure; no DOM). */
export function resolveDropzoneIcon(fileType, isNewSEI) {
    const type = String(fileType || '');
    const svg = (name) => (isNewSEI ? `svg/${name}.svg` : `/infra_css/imagens/${name}.gif`);
    let urlIcon = isNewSEI ? 'svg/documento_pdf.svg' : '/infra_css/imagens/pdf.gif';
    if (type.indexOf('image/') !== -1) urlIcon = svg(isNewSEI ? 'documento_imagem' : 'imagem');
    else if (type.indexOf('video/') !== -1) urlIcon = svg(isNewSEI ? 'documento_video' : 'video');
    else if (type.indexOf('audio/') !== -1) urlIcon = svg(isNewSEI ? 'documento_audio' : 'audio');
    else if (type.indexOf('application/zip') !== -1) urlIcon = svg(isNewSEI ? 'documento_zip' : 'zip');
    else if (type.indexOf('text/htm') !== -1) urlIcon = svg(isNewSEI ? 'documento_html' : 'html');
    else if (type.indexOf('text/plain') !== -1) urlIcon = svg(isNewSEI ? 'documento_txt' : 'txt');
    else if (type.indexOf('word') !== -1) urlIcon = svg(isNewSEI ? 'documento_doc' : 'doc');
    else if (type.indexOf('officedocument.presentation') !== -1) {
        urlIcon = isNewSEI ? 'svg/documento_powerpoint.svg' : '/infra_css/imagens/pps.gif';
    } else if (type.indexOf('text/csv') !== -1 || type.indexOf('sheet') !== -1) {
        urlIcon = svg(isNewSEI ? 'documento_excel' : 'xls');
    }
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
