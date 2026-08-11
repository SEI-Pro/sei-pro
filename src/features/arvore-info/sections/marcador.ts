/**
 * Seção "Marcador" do painel infoarvore (Etapa D — split por seção).
 * Render READ + remoção inline (via submitViaIframe + forceTrueConfirm). A adição
 * (openInlineEditor no clique do lápis) fica em panel.ts e re-renderiza via refreshers.
 */
import { parseAcaoRemoverId } from '../parse/marcador.js';
import { forceTrueConfirm } from '../dom/confirm.js';
import {
    TREE_PANEL_INFRA_TABLE,
    TREE_PANEL_MARCADOR_SELECT
} from '../../../sei/selectors.js';
import {
    clearChildren,
    createFaIcon,
    setFailedStatus,
    setMutedStatus
} from '../dom/status.js';

export type MarcadorItem = {
    id: string | null;
    iconSrc: string | null | undefined;
    tag: string;
    note: string;
    user: string;
};

export type MarcadorSectionCtx = {
    doc: Document;
    marcPanel: HTMLElement;
    findToolbarLink: (hrefFragment: string) => string | null;
    fetchPage: (url: string) => Promise<Document>;
    invalidatePage: (url: string) => void;
    submitViaIframe: (url: string, valuesOrFn: Record<string, string> | ((w: Window, d: Document) => void)) => Promise<void>;
    refreshSection: (name: string, reason?: string) => void;
    refreshers: Record<string, () => void>;
    sectionEnabled: (sectionId: string) => boolean;
    log: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    err: (...args: unknown[]) => void;
    report: (reason: string, detail?: unknown) => void;
};

// Parsing PURO do documento de marcadores (SEI 4.1+ tabela / fallback form single).
export function parseMarcadorItems(docM: Document): MarcadorItem[] {
    const items: MarcadorItem[] = [];
    // SEI 4.1+: table-of-marcadores layout (one row per marcador).
    const rows = docM.querySelectorAll(TREE_PANEL_INFRA_TABLE + ' tr');
    for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row) continue;
        const tds = row.querySelectorAll('td');
        if (tds.length < 4) continue;
        const td1 = tds[1];
        const td2 = tds[2];
        const td3 = tds[3];
        if (!td1 || !td2 || !td3) continue;
        const img = td1.querySelector('img');
        const remA = row.querySelector('a[onclick*="acaoRemover"]');
        const remMatch = remA ? parseAcaoRemoverId(remA.getAttribute('onclick')) : null;
        const tagA = td1.querySelector('a[title]');
        items.push({
            id: remMatch,
            iconSrc: img ? img.getAttribute('src') : null,
            tag: (tagA && tagA.getAttribute('title')) || (td1.textContent || '').trim(),
            note: (td2.textContent || '').trim(),
            user: (td3.textContent || '').trim()
        });
    }
    // Legacy fallback: single-marcador form layout.
    if (!items.length) {
        const sel = docM.querySelector(TREE_PANEL_MARCADOR_SELECT) as HTMLSelectElement | null;
        const ta = docM.getElementById('txaTexto') as HTMLTextAreaElement | null;
        const opt = sel && (sel.querySelector('option[selected]') || (sel.options && sel.options[sel.selectedIndex]));
        const tag = opt && opt.textContent ? opt.textContent.trim() : '';
        const note = ta ? ta.value || ta.textContent || '' : '';
        if (tag || note) {
            items.push({
                id: null,
                iconSrc: opt && (opt.getAttribute('data-imagesrc') || (opt as HTMLElement).dataset.imagesrc),
                tag: tag,
                note: note,
                user: ''
            });
        }
    }
    return items;
}

export function installMarcadorSection(ctx: MarcadorSectionCtx): void {
    const doc = ctx.doc;
    const marcPanel = ctx.marcPanel;
    const findToolbarLink = ctx.findToolbarLink;
    const fetchPage = ctx.fetchPage;
    const invalidatePage = ctx.invalidatePage;
    const submitViaIframe = ctx.submitViaIframe;
    const refreshSection = ctx.refreshSection;
    const refreshers = ctx.refreshers;
    const sectionEnabled = ctx.sectionEnabled;
    const log = ctx.log;
    const warn = ctx.warn;
    const err = ctx.err;
    const report = ctx.report;

    const marcadorUrl = findToolbarLink('andamento_marcador_gerenciar');
    function renderMarcadorItemRow(it: MarcadorItem): HTMLElement {
        const row = doc.createElement('div');
        row.className = 'seipro-infoarvore-row';

        const lbl = doc.createElement('span');
        lbl.className = 'seipro-infoarvore-row-label';
        if (it.iconSrc) {
            const im = doc.createElement('img');
            im.src = it.iconSrc;
            im.className = 'seipro-infoarvore-marcador-icon';
            lbl.appendChild(im);
        }
        const s = doc.createElement('strong');
        s.textContent = it.tag;
        lbl.appendChild(s);
        if (it.note) {
            const n = doc.createElement('div');
            n.className = 'seipro-infoarvore-marcador-note';
            n.textContent = it.note;
            lbl.appendChild(n);
        }
        row.appendChild(lbl);

        if (it.id) {
            const rmBtn = doc.createElement('a');
            rmBtn.className = 'newLink seipro-infoarvore-remove';
            rmBtn.title = 'Remover marcador';
            rmBtn.appendChild(createFaIcon(doc, 'fas fa-times'));
            rmBtn.addEventListener('click', function () {
                if (rmBtn.classList.contains('seipro-infoarvore-busy')) return;
                rmBtn.classList.add('seipro-infoarvore-busy');
                submitViaIframe(marcadorUrl!, function (w, d2) {
                    const removeLink = Array.from(d2.querySelectorAll('a[onclick*="acaoRemover"]'))
                        .find(function (a) {
                            const oc = a.getAttribute('onclick') || '';
                            return oc.indexOf("acaoRemover('" + it.id + "'") !== -1;
                        });
                    if (removeLink) {
                        forceTrueConfirm(w);
                        (removeLink as HTMLElement).click();
                    } else if (typeof (w as Window & { acaoRemover?: (id: string, tag: string) => void }).acaoRemover === 'function') {
                        forceTrueConfirm(w);
                        (w as Window & { acaoRemover: (id: string, tag: string) => void }).acaoRemover(it.id!, it.tag || '');
                    } else {
                        const hdn = d2.getElementById('hdnInfraItemId') as HTMLInputElement | null;
                        if (hdn) hdn.value = it.id!;
                        const f = d2.getElementById('frmGerenciarMarcador') || d2.querySelector('form');
                        if (f) (f as HTMLFormElement).submit();
                    }
                }).then(function () {
                    refreshSection('marcador', 'post-remove marcador');
                }).catch(function (e: Error) {
                    err('marcador remove:', e.message);
                    rmBtn.classList.remove('seipro-infoarvore-busy');
                });
            });
            row.appendChild(rmBtn);
        }
        return row;
    }
    const marcBody = marcPanel.querySelector('.seipro-marcador-body');
    if (!marcadorUrl) {
        warn('infoarvore_marcador: toolbar link not found — section will stay as "carregando"');
        setMutedStatus(marcBody, '(sem marcador)');
        return;
    }
    function renderMarcador() {
        invalidatePage(marcadorUrl!);
        setMutedStatus(marcBody, 'carregando…');
        fetchPage(marcadorUrl!).then(function (docM) {
            const items = parseMarcadorItems(docM);
            const bd = marcPanel.querySelector('.seipro-marcador-body');
            if (!bd) return;
            clearChildren(bd);
            if (!items.length) {
                setMutedStatus(bd, '(sem marcador)');
                return;
            }
            items.forEach(function (it) { bd.appendChild(renderMarcadorItemRow(it)); });
        }).catch(function (e: Error) {
            setFailedStatus(marcPanel.querySelector('.seipro-marcador-body'), '(falha ao carregar marcador)');
            report('infoarvore_marcador: fetch failed', { error: e.message, url: marcadorUrl });
        });
    }
    refreshers.marcador = renderMarcador;
    if (sectionEnabled('marcador')) renderMarcador();
    else log('infoarvore_marcador: skipped (section disabled by user)');
}
