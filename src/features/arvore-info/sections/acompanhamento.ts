/**
 * Seção "Acompanhamento Especial" do painel infoarvore (Etapa D — split por seção).
 * Render READ + remoção inline (via submitViaIframe). A EDIÇÃO/adição (editAcompInline)
 * fica em panel.ts (acoplada ao scaffolding compartilhado de editores) e re-renderiza
 * por meio do registry `refreshers` (refreshSection('acomp')).
 */
import { TREE_PANEL_INFRA_TABLE } from '../../../sei/selectors.js';
import {
    clearChildren,
    createFaIcon,
    setFailedStatus,
    setMutedStatus
} from '../dom/status.js';

export type AcompItem = {
    id: string | null;
    grupo: string;
    obs: string;
    user: string;
    date: string;
};

export type AcompanhamentoSectionCtx = {
    doc: Document;
    acompPanel: HTMLElement;
    findToolbarLink: (hrefFragment: string) => string | null;
    getToolbarLinks: () => Array<{ name?: string; url: string }>;
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

// Parsing PURO do documento de acompanhamento especial (só LÊ docA).
export function parseAcompItems(docA: Document): AcompItem[] {
    const rows = docA.querySelectorAll(TREE_PANEL_INFRA_TABLE + ' tr');
    const items: AcompItem[] = [];
    for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row) continue;
        const tds = row.querySelectorAll('td');
        if (tds.length < 3) continue;
        let acompId: string | null = null;
        const exLink = row.querySelector('a[onclick*="acaoExcluir"]');
        if (exLink) {
            const idM = (exLink.getAttribute('onclick') || '').match(/acaoExcluir\((\d+)/);
            if (idM) acompId = idM[1] || null;
        }
        if (!acompId) {
            const chk = row.querySelector('input[type="checkbox"][name*="chk"]') as HTMLInputElement | null;
            if (chk) acompId = chk.value;
        }
        items.push({
            id: acompId,
            grupo: (tds[1]?.textContent || '').trim(),
            obs: (tds[2]?.textContent || '').trim(),
            user: tds[3] ? (tds[3].textContent || '').trim() : '',
            date: tds[4] ? (tds[4].textContent || '').trim() : ''
        });
    }
    return items;
}

export function installAcompanhamentoSection(ctx: AcompanhamentoSectionCtx): void {
    const doc = ctx.doc;
    const acompPanel = ctx.acompPanel;
    const findToolbarLink = ctx.findToolbarLink;
    const getToolbarLinks = ctx.getToolbarLinks;
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

    const acompBody = acompPanel.querySelector('.seipro-acomp-body');
    const acompUrl = findToolbarLink('acompanhamento_gerenciar')
        || findToolbarLink('acompanhamento_listar')
        || findToolbarLink('acompanhamento_cadastrar')
        || findToolbarLink('acompanhamento_alterar');

    function renderAcompItemRow(it: AcompItem): HTMLElement {
        const row = doc.createElement('div');
        row.className = 'seipro-infoarvore-row';
        const txt = it.obs + (it.grupo ? (it.obs ? ' ' : '') + '(' + it.grupo + ')' : '');
        const a = doc.createElement('a');
        a.className = 'newLink seipro-copy seipro-infoarvore-row-grow';
        a.textContent = txt || '(em acompanhamento)';
        row.appendChild(a);
        if (it.id) {
            const btn = doc.createElement('a');
            btn.className = 'newLink seipro-infoarvore-remove';
            btn.title = 'Remover acompanhamento especial';
            btn.appendChild(createFaIcon(doc, 'fas fa-times'));
            btn.addEventListener('click', function () {
                if (btn.classList.contains('seipro-infoarvore-busy')) return;
                btn.classList.add('seipro-infoarvore-busy');
                submitViaIframe(acompUrl!, function (w, d2) {
                    const removeLink = Array.from(d2.querySelectorAll('a[onclick*="acaoExcluir"]'))
                        .find(function (aEl) {
                            const oc = aEl.getAttribute('onclick') || '';
                            return oc.indexOf('acaoExcluir(' + it.id) !== -1 || oc.indexOf("acaoExcluir('" + it.id + "'") !== -1;
                        });
                    if (removeLink) {
                        (removeLink as HTMLElement).click();
                    } else if (typeof (w as Window & { acaoExcluir?: (id: string, label: string) => void }).acaoExcluir === 'function') {
                        (w as Window & { acaoExcluir: (id: string, label: string) => void }).acaoExcluir(it.id!, it.obs || it.grupo || '');
                    } else {
                        const chks = d2.querySelectorAll('input[type="checkbox"]');
                        for (let c = 0; c < chks.length; c++) {
                            const chk = chks[c] as HTMLInputElement;
                            chk.checked = (chk.value == it.id);
                        }
                        const f = d2.querySelector('form');
                        if (f) (f as HTMLFormElement).submit();
                    }
                }).then(function () {
                    refreshSection('acomp', 'post-remove acomp');
                }).catch(function (e: Error) {
                    err('acomp remove:', e.message);
                    btn.classList.remove('seipro-infoarvore-busy');
                });
            });
            row.appendChild(btn);
        }
        return row;
    }

    function renderAcomp() {
        if (!acompUrl || !acompBody) return;
        invalidatePage(acompUrl);
        setMutedStatus(acompBody, 'carregando…');
        fetchPage(acompUrl).then(function (docA) {
            const items = parseAcompItems(docA);
            clearChildren(acompBody);
            if (!items.length) {
                setMutedStatus(acompBody, '(não está em acompanhamento especial)');
                return;
            }
            items.forEach(function (it) { acompBody.appendChild(renderAcompItemRow(it)); });
        }).catch(function (e: Error) {
            setFailedStatus(acompBody, '(falha ao carregar)');
            report('infoarvore_acomp: fetch failed', { error: e.message, url: acompUrl });
        });
    }
    refreshers.acomp = renderAcomp;
    if (!acompUrl) {
        setMutedStatus(acompBody, '(indisponível)');
        const names = getToolbarLinks().map(function (l) {
            return (l.url.match(/acao=([^&]+)/) || [])[1];
        }).filter(Boolean);
        warn('infoarvore_acomp: no acompanhamento_* toolbar link. Toolbar actions:', names.join(', '));
    } else if (sectionEnabled('acompanhamento_especial')) renderAcomp();
    else log('infoarvore_acomp: skipped (section disabled by user)');
}
