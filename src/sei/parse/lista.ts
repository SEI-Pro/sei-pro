/**
 * Pure parser for procedimento_controlar (process list) HTML.
 * Accepts Document | Element; returns plain data — no jQuery, no DOM nodes.
 */

export type ListaProcessoRow = {
    rowId: string;
    checkboxId: string | null;
    checkboxValue: string;
    processHref: string | null;
    idProcedimento: string | null;
    visualizado: boolean | null;
    sigiloso: boolean;
    atribuicaoHref: string | null;
    anotacaoHref: string | null;
};

export type ListaProcessosParsed = {
    formAction: string | null;
    hasProcessCommands: boolean;
    tables: {
        recebidos: ListaProcessoRow[];
        gerados: ListaProcessoRow[];
        detalhado: ListaProcessoRow[];
    };
};

function asRoot(root: Document | Element): ParentNode {
    return root;
}

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

function parseRow(tr: Element): ListaProcessoRow | null {
    if (!tr.classList.contains('infraTrClara') && !/^P/i.test(tr.id || '')) {
        // header / caption rows
        if (!tr.querySelector('a[href*="acao=procedimento_trabalhar"]')) return null;
    }
    const processLink =
        tr.querySelector<HTMLAnchorElement>('a[href*="acao=procedimento_trabalhar"]') ||
        tr.querySelector<HTMLAnchorElement>('a.processoVisualizado, a.processoNaoVisualizado');
    if (!processLink && !tr.id) return null;

    const checkbox =
        tr.querySelector<HTMLInputElement>('input.infraCheckboxInput, input.infraCheckbox') ||
        tr.querySelector<HTMLInputElement>('input[type="checkbox"]');
    const processHref = processLink?.getAttribute('href') || null;
    const className = processLink?.className || '';

    let visualizado: boolean | null = null;
    if (/\bprocessoVisualizado\b/.test(className)) visualizado = true;
    else if (/\bprocessoNaoVisualizado\b/.test(className)) visualizado = false;

    const atribuicao = tr.querySelector<HTMLAnchorElement>(
        'a[href*="acao=procedimento_atribuicao"], a.ancoraSigla'
    );
    const anotacao = tr.querySelector<HTMLAnchorElement>('a[href*="acao=anotacao_registrar"]');

    return {
        rowId: tr.id || '',
        checkboxId: checkbox?.id || null,
        checkboxValue: checkbox?.value ?? '',
        processHref,
        idProcedimento: queryParam(processHref, 'id_procedimento'),
        visualizado,
        sigiloso: /\bprocessoVisualizadoSigiloso\b|\bsigiloso\b/i.test(className),
        atribuicaoHref: atribuicao?.getAttribute('href') || null,
        anotacaoHref: anotacao?.getAttribute('href') || null
    };
}

function parseTable(root: ParentNode, tableId: string): ListaProcessoRow[] {
    const table = root.querySelector('#' + tableId);
    if (!table) return [];
    const rows: ListaProcessoRow[] = [];
    table.querySelectorAll('tbody tr, tr').forEach((tr) => {
        const parsed = parseRow(tr);
        if (parsed) rows.push(parsed);
    });
    return rows;
}

export function parseListaProcessos(root: Document | Element): ListaProcessosParsed {
    const doc = asRoot(root);
    const form = doc.querySelector<HTMLFormElement>('#frmProcedimentoControlar');
    const hasProcessCommands = !!(
        doc.querySelector('#divBotoesControleProcessos') || doc.querySelector('#divComandos')
    );

    return {
        formAction: form?.getAttribute('action') || null,
        hasProcessCommands,
        tables: {
            recebidos: parseTable(doc, 'tblProcessosRecebidos'),
            gerados: parseTable(doc, 'tblProcessosGerados'),
            detalhado: parseTable(doc, 'tblProcessosDetalhado')
        }
    };
}
