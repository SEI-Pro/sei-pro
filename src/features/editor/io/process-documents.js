import { listProcessDocuments } from '../domain/process-documents.js';

export {
    listProcessDocuments,
    processDocumentId,
    buildProcessDocumentReference
} from '../domain/process-documents.js';

export function listComparableDocuments(source = globalThis) {
    const data = source.dadosProcessoPro || {};
    const documents = listProcessDocuments(source);
    const links = data.listLinksAll || data.treeModel?.linksAll || data.listLinks || [];
    return documents.map((document, index) => {
        const id = String(document.id_documento || document.id_protocolo || document.id || index);
        const src = document.src || links.find((link) => String(link).includes(`id_documento=${id}`)) || '';
        return {
            id,
            label: [
                document.tipo || document.nome_documento || document.documento || 'Documento',
                document.numeroSEI || document.nr_sei || document.numero || ''
            ].filter(Boolean).join(' '),
            src: absolutize(src, source.location?.href)
        };
    }).filter((document) => document.src);
}

export async function fetchComparableDocument(src, {
    fetchImpl = globalThis.fetch?.bind(globalThis),
    parseHtml = (html) => new DOMParser().parseFromString(html, 'text/html')
} = {}) {
    if (!fetchImpl) throw new Error('Leitura de documentos indisponível');
    const first = await fetchText(src, fetchImpl);
    const document = parseHtml(first);
    const nested = document.querySelector(
        '#ifrArvoreHtml, #ifrVisualizacao, iframe[src*="documento_"]'
    )?.getAttribute('src');
    const finalDocument = nested
        ? parseHtml(await fetchText(absolutize(nested, src), fetchImpl))
        : document;
    const container = finalDocument.querySelector('#divArvoreHtml, #conteudo, article, main')
        || finalDocument.body;
    return String(container?.textContent || '').replace(/\s+/g, ' ').trim();
}

async function fetchText(url, fetchImpl) {
    const response = await fetchImpl(url, { credentials: 'same-origin' });
    if (!response || response.ok === false) {
        throw new Error(`O SEI retornou ${response?.status || 'uma resposta inválida'}`);
    }
    return response.text();
}

function absolutize(value, base) {
    try {
        return new URL(value, base || 'http://localhost/').href;
    } catch (_) {
        return String(value || '');
    }
}
