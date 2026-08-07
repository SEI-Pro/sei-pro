// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { fetchComparableDocument, listComparableDocuments } from './io/process-documents.js';
import { openSemanticDiffPanel } from './view/semantic-diff.js';

export function openProcessDocumentDiff({
    source = globalThis,
    getInstances = () => source.CKEDITOR?.instances || {}
} = {}) {
    return openSemanticDiffPanel({
        documents: listComparableDocuments(source),
        loadDocument: (document) => fetchComparableDocument(document.src),
        readCurrentText: () => {
            const editors = Object.values(getInstances());
            const editor = editors.find((item) => item?.focusManager?.hasFocus) || editors[0];
            const html = editor?.getData?.() || '';
            const parsed = new DOMParser().parseFromString(html, 'text/html');
            return parsed.body?.textContent || '';
        }
    });
}
