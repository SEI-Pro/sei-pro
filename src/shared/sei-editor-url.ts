// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Pure helpers for SEI document-editor URLs (`acao=editor_montar`).
 * No DOM / chrome / jQuery — safe for domain tests and any world.
 */

const EDITOR_URL_RE = /controlador\.php\?acao=editor_montar[^'"\s<>]*/gi;

export function getUrlDocumentoId(url) {
    const m = String(url || '').match(/[?&]id_documento=([^&]*)/i);
    if (!m) return '';
    return String(m[1] || '').trim();
}

export function isValidEditorMontarUrl(url) {
    const s = String(url || '');
    if (s.indexOf('acao=editor_montar') === -1) return false;
    return /^\d+$/.test(getUrlDocumentoId(s));
}

/** True when an already-open editor window should be forced to a valid URL. */
export function editorWindowNeedsNavigate(href) {
    const s = String(href || '');
    if (!s || s === 'about:blank') return true;
    if (s.indexOf('acao=editor_montar') === -1) return true;
    return !isValidEditorMontarUrl(s);
}

/** Complete an editor URL when SEI has not interpolated its document id yet. */
export function repairEditorMontarUrl(url, documentId, baseUrl = '') {
    const id = String(documentId || '').trim();
    if (!/^\d+$/.test(id)) return null;

    const raw = String(url || '').trim();
    if (!raw) return null;

    try {
        const parsed = new URL(raw, baseUrl || 'https://sei.invalid/');
        parsed.searchParams.set('acao', 'editor_montar');
        parsed.searchParams.set('id_documento', id);
        const absolute = /^[a-z][a-z\d+.-]*:/i.test(raw);
        return absolute ? parsed.href : `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch (error) {
        return null;
    }
}

function resolveJsNumericVar(src, varName) {
    if (!varName) return '';
    const re = new RegExp(
        '(?:(?:var|let|const)\\s+)?' + varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
            '\\s*=\\s*[\'"]?(\\d+)[\'"]?',
        'i'
    );
    const m = String(src || '').match(re);
    return m ? m[1] : '';
}

/**
 * Best `editor_montar` URL in HTML/script text with a non-empty numeric
 * `id_documento`. Handles:
 * - complete literal URLs
 * - SEI JS concatenations like
 *   `'...&id_documento='+idDocumento+'&infra_hash=...'`
 *   (legacy `split("'")[1]` truncated these and opened empty-id editors)
 */
export function extractEditorMontarUrl(text) {
    const src = String(text || '');
    let best = null;
    const re = new RegExp(EDITOR_URL_RE.source, 'gi');
    let m;
    while ((m = re.exec(src)) !== null) {
        const cand = m[0].replace(/\\+$/g, '');
        if (isValidEditorMontarUrl(cand)) best = cand;
    }
    if (best) return best;

    const concat = src.match(
        /'(controlador\.php\?acao=editor_montar[^']*id_documento=)'\s*\+\s*([A-Za-z_$][\w$]*)\s*\+\s*'([^']*)'/i
    );
    if (concat) {
        const id = resolveJsNumericVar(src, concat[2]);
        if (id) {
            const stitched = concat[1] + id + concat[3];
            if (isValidEditorMontarUrl(stitched)) return stitched;
        }
    }
    return null;
}

/** True when `link` carries exactly this document id (rejects empty id). */
export function linkMatchesDocumentoId(link, id) {
    if (id === null || typeof id === 'undefined') return false;
    const want = String(id).trim();
    if (!want) return false;
    return getUrlDocumentoId(link) === want;
}
