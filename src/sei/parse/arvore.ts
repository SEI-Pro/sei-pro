/**
 * Pure parser for arvore_visualizar HTML.
 * Accepts Document | Element; returns plain data — no jQuery, no DOM nodes.
 */

export type ArvoreNode = {
    anchorId: string;
    documentId: string | null;
    isPasta: boolean;
    isProcess: boolean;
    href: string | null;
    target: string | null;
    label: string;
    idProcedimento: string | null;
    idDocumento: string | null;
};

export type ArvoreParsed = {
    treePresent: boolean;
    nodes: ArvoreNode[];
    processLabel: string | null;
    idProcedimento: string | null;
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

function documentIdFromAnchor(id: string): string | null {
    const m = id.match(/^anchor(?:Img)?(.+)$/i);
    return m && m[1] !== undefined ? m[1] : null;
}

export function parseArvore(root: Document | Element): ArvoreParsed {
    const tree = root.querySelector('#divArvore') || root;
    const anchors = tree.querySelectorAll<HTMLAnchorElement>(
        'a.infraArvoreNo, a[id^="anchor"]:not([id^="anchorImg"])'
    );
    const nodes: ArvoreNode[] = [];
    let processLabel: string | null = null;
    let idProcedimento: string | null = null;

    anchors.forEach((a) => {
        const anchorId = a.id || '';
        const href = a.getAttribute('href');
        const target = a.getAttribute('target');
        const label = (a.textContent || '').replace(/\s+/g, ' ').trim();
        const isPasta = /PASTA/i.test(anchorId);
        const hrefProc = queryParam(href, 'id_procedimento');
        const hrefDoc = queryParam(href, 'id_documento');
        const isProcess =
            !isPasta &&
            !hrefDoc &&
            (!!hrefProc || /procedimento_trabalhar|procedimento_visualizar/i.test(href || ''));

        const node: ArvoreNode = {
            anchorId,
            documentId: documentIdFromAnchor(anchorId),
            isPasta,
            isProcess,
            href,
            target,
            label,
            idProcedimento: hrefProc,
            idDocumento: hrefDoc
        };
        nodes.push(node);

        if (isProcess && !processLabel) {
            processLabel = label || null;
            idProcedimento = hrefProc;
        }
        if (!idProcedimento && hrefProc) idProcedimento = hrefProc;
    });

    return {
        treePresent: !!root.querySelector('#divArvore'),
        nodes,
        processLabel,
        idProcedimento
    };
}
