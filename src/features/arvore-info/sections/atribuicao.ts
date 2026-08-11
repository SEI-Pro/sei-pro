/**
 * Seção "Atribuição" do painel infoarvore (Etapa D — split por seção).
 * Fábrica retorna { renderRows, editInline }:
 *  - renderRows(body, items): pinta a lista de responsáveis (usado no render inicial
 *    e após salvar);
 *  - editInline(panel): editor inline (select de atribuição → submit via iframe →
 *    re-parse do Nos[0].html da própria árvore, sem recarregar o iframe).
 * A lógica PURA (extração de payload + heurística "não atribuído") vem de parse/.
 */
import { extractNosHtml } from '../parse/inline-payload.js';
import { isAtribuicaoUnassigned } from '../parse/atribuicao.js';
import { TREE_PANEL_ATRIBUICAO_SELECT } from '../../../sei/selectors.js';
import {
    clearChildren,
    restoreChildren,
    setMutedStatus,
    snapshotChildren
} from '../dom/status.js';

export type AtribuicaoItem = {
    text: string;
    unassigned: boolean;
};

export type AtribuicaoSectionCtx = {
    doc: Document;
    win: Window & typeof globalThis;
    findToolbarLink: (hrefFragment: string) => string | null;
    fetchPage: (url: string) => Promise<Document>;
    invalidatePage: (url: string) => void;
    submitViaIframe: (url: string, valuesOrFn: Record<string, string> | ((w: Window, d: Document) => void)) => Promise<void>;
    log: (...args: unknown[]) => void;
    err: (...args: unknown[]) => void;
    report: (reason: string, detail?: unknown) => void;
};

// Parsing PURO da lista de responsáveis a partir do Nos[0].html inline (só LÊ docR).
export function parseAtribuicaoItemsFromDoc(docR: Document): AtribuicaoItem[] {
    const newResp: AtribuicaoItem[] = [];
    const scrs = docR.querySelectorAll('script:not([src])');
    for (let i = 0; i < scrs.length; i++) {
        const txt = scrs[i]?.textContent || '';
        const raw = extractNosHtml(txt);
        if (raw === null) continue;
        raw.split('<br />').forEach(function (frag) {
            // Parse SEI fragment in an isolated document — never inject into the panel.
            const tmp = new DOMParser().parseFromString(frag, 'text/html').body;
            const text = (tmp.textContent || '').trim();
            if (text) {
                newResp.push({
                    text: text,
                    unassigned: isAtribuicaoUnassigned(text, tmp.querySelector('a.ancoraSigla'))
                });
            }
        });
        break;
    }
    return newResp;
}

export function createAtribuicaoSection(ctx: AtribuicaoSectionCtx) {
    const doc = ctx.doc;
    const win = ctx.win;
    const findToolbarLink = ctx.findToolbarLink;
    const fetchPage = ctx.fetchPage;
    const invalidatePage = ctx.invalidatePage;
    const submitViaIframe = ctx.submitViaIframe;
    const log = ctx.log;
    const err = ctx.err;
    const report = ctx.report;

    function renderRows(body: Element, items: AtribuicaoItem[]) {
        clearChildren(body);
        if (!items.length) {
            const span = doc.createElement('span');
            span.className = 'infoAlerta seipro-infoarvore-status-failed';
            span.textContent = '(sem responsáveis)';
            body.appendChild(span);
            return;
        }
        items.forEach(function (r) {
            const row = doc.createElement('div');
            const a = doc.createElement('a');
            a.className = 'newLink seipro-copy seipro-infoarvore-copy';
            a.textContent = r.text + (r.unassigned ? ' ' : '');
            if (r.unassigned) {
                const alert = doc.createElement('span');
                alert.className = 'infoAlerta';
                alert.textContent = '(não atribuído)';
                a.appendChild(alert);
            }
            row.appendChild(a);
            body.appendChild(row);
        });
    }

    function editInline(panel: HTMLElement) {
        const atribUrl = findToolbarLink('procedimento_atribuicao_cadastrar');
        if (!atribUrl) {
            report('inline atrib: toolbar link not found — edit Atribuição disabled', { sought: 'procedimento_atribuicao_cadastrar' });
            return;
        }
        const body = panel.querySelector('.infoDadosArvore');
        if (!body) return;
        const saved = snapshotChildren(body);
        setMutedStatus(body, 'carregando formulário…');
        invalidatePage(atribUrl);
        fetchPage(atribUrl).then(function (docA) {
            const srcSel = docA.querySelector(TREE_PANEL_ATRIBUICAO_SELECT) as HTMLSelectElement | null;
            if (!srcSel) {
                err('inline atrib: #selAtribuicao not found');
                restoreChildren(body, saved);
                return;
            }
            const wrap = doc.createElement('div');
            wrap.className = 'seipro-infoarvore-edit-wrap';
            const sel = doc.createElement('select');
            sel.className = 'seipro-infoarvore-edit-select';
            Array.prototype.forEach.call(srcSel.options, function (o: HTMLOptionElement) {
                const opt = doc.createElement('option');
                opt.value = o.value;
                opt.textContent = o.text;
                if (o.selected) opt.selected = true;
                sel.appendChild(opt);
            });
            const btnRow = doc.createElement('div');
            btnRow.className = 'seipro-infoarvore-edit-actions';
            const btnSave = doc.createElement('button');
            btnSave.type = 'button';
            btnSave.className = 'newLink seipro-infoarvore-edit-btn';
            btnSave.textContent = 'Salvar';
            const btnCancel = doc.createElement('button');
            btnCancel.type = 'button';
            btnCancel.className = 'newLink seipro-infoarvore-edit-btn';
            btnCancel.textContent = 'Cancelar';
            btnRow.appendChild(btnCancel);
            btnRow.appendChild(btnSave);
            wrap.appendChild(sel);
            wrap.appendChild(btnRow);
            clearChildren(body);
            body.appendChild(wrap);

            btnCancel.addEventListener('click', function () { restoreChildren(body, saved); });
            btnSave.addEventListener('click', function () {
                btnSave.disabled = true;
                btnCancel.disabled = true;
                btnSave.textContent = 'salvando…';
                submitViaIframe(atribUrl, { selAtribuicao: sel.value }).then(function () {
                    log('inline atrib: saved, re-rendering responsáveis');
                    invalidatePage(win.location.href);
                    return fetchPage(win.location.href).then(function (docR) {
                        const newResp = parseAtribuicaoItemsFromDoc(docR);
                        renderRows(body, newResp);
                        const pencilA = panel.querySelector('.seipro-edit[data-mode="responsaveis"]') as HTMLElement | null;
                        if (pencilA) pencilA.dataset.text = (newResp[0] && newResp[0].text) || '';
                    });
                }).catch(function (e: Error) {
                    err('inline atrib submit:', e.message);
                    restoreChildren(body, saved);
                    report('inline atrib: submit failed — reverted to previous value');
                });
            });
        }).catch(function (e: Error) {
            err('inline atrib fetch:', e.message);
            restoreChildren(body, saved);
        });
    }

    return { renderRows: renderRows, editInline: editInline, parseFromDoc: parseAtribuicaoItemsFromDoc };
}
