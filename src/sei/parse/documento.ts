/**
 * Pure parser for documento / visualization chrome HTML.
 * Accepts Document | Element; returns plain data — no jQuery, no DOM nodes.
 */

export type DocumentoParsed = {
    infoPanelId: string | null;
    downloadHref: string | null;
    visualizationIframeId: string | null;
    visualizationIframeSrc: string | null;
    idDocumento: string | null;
    idProcedimento: string | null;
    editorPresent: boolean;
    documentFormAction: string | null;
};

function queryParam(href: string | null, key: string): string | null {
    if (!href) return null;
    const match = href.match(new RegExp('[?&]' + key + '=([^&#]*)'));
    if (!match) return null;
    const raw = match[1];
    if (raw === undefined || raw === '') return null;
    try {
        return decodeURIComponent(raw.replace(/\+/g, ' ')) || null;
    } catch {
        return raw;
    }
}

function firstPresentId(root: Document | Element, ids: string[]): string | null {
    for (const id of ids) {
        if (root.querySelector('#' + id)) return id;
    }
    return null;
}

export function parseDocumento(root: Document | Element): DocumentoParsed {
    const infoPanel =
        root.querySelector('#divArvoreInformacao') || root.querySelector('#divInformacao');
    const infoPanelId = infoPanel?.id || null;

    const download =
        (infoPanel || root).querySelector<HTMLAnchorElement>(
            'a.ancoraVisualizacaoArvore, a.ancoraArvoreDownload'
        ) ||
        root.querySelector<HTMLAnchorElement>(
            'a.ancoraVisualizacaoArvore, a.ancoraArvoreDownload'
        );

    const iframe =
        root.querySelector<HTMLIFrameElement>('#ifrConteudoVisualizacao') ||
        root.querySelector<HTMLIFrameElement>('#ifrVisualizacao');
    const iframeSrc = iframe?.getAttribute('src') || null;

    const form = root.querySelector<HTMLFormElement>('#frmDocumentoCadastro');
    const downloadHref = download?.getAttribute('href') || null;

    return {
        infoPanelId,
        downloadHref,
        visualizationIframeId: firstPresentId(root, [
            'ifrConteudoVisualizacao',
            'ifrVisualizacao'
        ]),
        visualizationIframeSrc: iframeSrc,
        idDocumento:
            queryParam(downloadHref, 'id_documento') ||
            queryParam(iframeSrc, 'id_documento') ||
            queryParam(form?.getAttribute('action') || null, 'id_documento'),
        idProcedimento:
            queryParam(downloadHref, 'id_procedimento') ||
            queryParam(iframeSrc, 'id_procedimento') ||
            queryParam(form?.getAttribute('action') || null, 'id_procedimento'),
        editorPresent: !!(
            root.querySelector('#frmEditor') ||
            root.querySelector('.infra-editor__editor-completo')
        ),
        documentFormAction: form?.getAttribute('action') || null
    };
}
