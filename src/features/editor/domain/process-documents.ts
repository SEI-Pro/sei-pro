// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Return the canonical process-document list during the tree-model migration. */
export function listProcessDocuments(source = globalThis) {
    const data = source.dadosProcessoPro || {};
    const direct = Array.isArray(data.listDocumentos) ? data.listDocumentos : [];
    const tree = Array.isArray(data.treeModel?.documents) ? data.treeModel.documents : [];
    if (!direct.length) return tree.slice();
    if (!tree.length) return direct.slice();

    // A sessão antiga e o treeModel podem coexistir durante a migração. Keep the
    // richer direct record first, then add documents that only exist in the model.
    const byId = new Map();
    [...direct, ...tree].forEach((document, index) => {
        const id = String(document?.id_documento || document?.id_protocolo || document?.id || index);
        const previous = byId.get(id) || {};
        const merged = { ...previous };
        Object.entries(document || {}).forEach(([key, value]) => {
            if (merged[key] === undefined || merged[key] === null || merged[key] === '') {
                merged[key] = value;
            }
        });
        byId.set(id, merged);
    });
    return [...byId.values()];
}

export function processDocumentId(document, fallback = '') {
    return String(document?.id_protocolo || document?.id_documento || document?.id || fallback || '').trim();
}

/** Reproduce SEI's native linksei markup for a process-document reference. */
export function buildProcessDocumentReference(document) {
    const id = processDocumentId(document);
    const text = String(document?.nr_sei || document?.numeroSEI || document?.numero || document?.documento || '').trim();
    if (!id || !text) return '';
    return '<span contenteditable="false" data-cke-linksei="1" style="text-indent:0px;">'
        + '<a id="lnkSei' + escapeHtml(id) + '" class="ancora_sei" style="text-indent:0px;">'
        + escapeHtml(text)
        + '</a></span>';
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));
}
