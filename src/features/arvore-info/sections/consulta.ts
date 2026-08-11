/**
 * Seção "Consulta" do painel infoarvore (Etapa D — split por seção).
 * Lê a página procedimento_alterar/consultar e popula 5 sub-seções READ-ONLY:
 * Tipo de Processo, Nível de Acesso, Assuntos, Observações, Interessados.
 *
 * É view (DOM): recebe um `ctx` com os elementos de painel e as dependências de
 * runtime (fetch/toolbar/refreshers/logger). A lógica PURA (mapa de acesso, split
 * de interessados) vem de parse/consulta.js.
 */
import { acessoLabel, splitInteressado } from '../parse/consulta.js';
import { clearChildren, setFailedStatus, setMutedStatus } from '../dom/status.js';

export type AcessoTextResult = {
    text: string;
    element: Element | null;
};

export type ConsultaSectionCtx = {
    doc: Document;
    intPanel: HTMLElement;
    tipoPanel: HTMLElement;
    acessoPanel: HTMLElement;
    assuntosPanel: HTMLElement;
    obsPanel: HTMLElement;
    findToolbarLink: (hrefFragment: string) => string | null;
    fetchPage: (url: string) => Promise<Document>;
    invalidatePage: (url: string) => void;
    refreshers: Record<string, () => void>;
    sectionEnabled: (sectionId: string) => boolean;
    log: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    report: (reason: string, detail?: unknown) => void;
};

// Parsing PURO do form de consulta (só LÊ docA). Testável jsdom.
export function getAcessoText(docA: Document): AcessoTextResult {
    const rdo = docA.querySelector('input[name="rdoNivelAcesso"]:checked') as HTMLInputElement | null;
    let hipoteseText = '';
    if (rdo && rdo.value === '1') {
        const hipSel = docA.getElementById('selHipoteseLegal') as HTMLSelectElement | null;
        const hipOpt = hipSel && (hipSel.querySelector('option[selected]') || (hipSel.options && hipSel.options[hipSel.selectedIndex]));
        if (hipOpt && hipOpt.textContent && hipOpt.textContent.trim()) hipoteseText = hipOpt.textContent.trim();
    }
    return { text: acessoLabel(rdo ? rdo.value : null, hipoteseText), element: rdo };
}

export function getInteressadosTexts(docA: Document): string[] {
    const opts = docA.querySelectorAll('#selInteressadosProcedimento option, #selInteressados option');
    const items: string[] = [];
    for (let i = 0; i < opts.length; i++) {
        const name = (opts[i]?.textContent || '').trim();
        if (!name) continue;
        splitInteressado(name).forEach(function (part) {
            items.push(part);
        });
    }
    return items;
}

export function installConsultaSection(ctx: ConsultaSectionCtx): void {
    const doc = ctx.doc;
    const intPanel = ctx.intPanel;
    const tipoPanel = ctx.tipoPanel;
    const acessoPanel = ctx.acessoPanel;
    const assuntosPanel = ctx.assuntosPanel;
    const obsPanel = ctx.obsPanel;
    const findToolbarLink = ctx.findToolbarLink;
    const fetchPage = ctx.fetchPage;
    const invalidatePage = ctx.invalidatePage;
    const refreshers = ctx.refreshers;
    const sectionEnabled = ctx.sectionEnabled;
    const log = ctx.log;
    const warn = ctx.warn;
    const report = ctx.report;

    const intBodyEl = intPanel.querySelector('.seipro-interessados-body');
    // Prefer "procedimento_alterar" — form layout includes #txaObservacoes. Fall back to consultar (read-only).
    const consultaUrlRaw = findToolbarLink('procedimento_alterar') || findToolbarLink('procedimento_consultar');
    if (!consultaUrlRaw || !intBodyEl) {
        warn('infoarvore_interessados: consulta link not found');
        setMutedStatus(intBodyEl, '(indisponível)');
        setMutedStatus(tipoPanel.querySelector('.seipro-tipo-body'), '(indisponível)');
        setMutedStatus(acessoPanel.querySelector('.seipro-acesso-body'), '(indisponível)');
        setMutedStatus(assuntosPanel.querySelector('.seipro-assuntos-body'), '(indisponível)');
        setMutedStatus(obsPanel.querySelector('.seipro-obs-body'), '(indisponível)');
        refreshers.consulta = function () {
            setMutedStatus(intBodyEl, '(indisponível)');
            setMutedStatus(tipoPanel.querySelector('.seipro-tipo-body'), '(indisponível)');
            setMutedStatus(acessoPanel.querySelector('.seipro-acesso-body'), '(indisponível)');
            setMutedStatus(assuntosPanel.querySelector('.seipro-assuntos-body'), '(indisponível)');
            setMutedStatus(obsPanel.querySelector('.seipro-obs-body'), '(indisponível)');
        };
        return;
    }
    const intBody: Element = intBodyEl;
    const consultaUrl: string = consultaUrlRaw;

    function setSectionText(panelBody: Element, text: string, emptyText?: string) {
        clearChildren(panelBody);
        if (text) {
            const a = doc.createElement('a');
            a.className = 'newLink seipro-copy seipro-infoarvore-copy';
            a.textContent = text;
            panelBody.appendChild(a);
        } else {
            setMutedStatus(panelBody, emptyText || '(indisponível)');
        }
    }

    function appendCopyRow(panelBody: Element, text: string) {
        const row = doc.createElement('div');
        const a = doc.createElement('a');
        a.className = 'newLink seipro-copy seipro-infoarvore-copy-block';
        a.textContent = text;
        row.appendChild(a);
        panelBody.appendChild(row);
    }

    function getSelectedOptionText(docA: Document, selector: string) {
        const el = docA.querySelector(selector) as HTMLSelectElement | null;
        const opt = el && (el.querySelector('option[selected]') || (el.options && el.options[el.selectedIndex]));
        return {
            element: el,
            text: opt && opt.textContent ? opt.textContent.trim() : ''
        };
    }

    function getOptionTexts(docA: Document, selector: string): string[] {
        const nodes = docA.querySelectorAll(selector);
        const items: string[] = [];
        nodes.forEach(function (o) {
            const txt = (o.textContent || '').trim();
            if (txt) items.push(txt);
        });
        return items;
    }

    function renderConsultaSections(docC: Document) {
        // --- Tipo de Processo
        const tipoBody = tipoPanel.querySelector('.seipro-tipo-body');
        if (tipoBody) {
            const tipoData = getSelectedOptionText(docC, '#selTipoProcedimento');
            const tipoName = tipoData.text;
            setSectionText(tipoBody, tipoName, '(indisponível)');
            if (!tipoName) report('infoarvore_consulta: Tipo de Processo unavailable in fetched form', { hasSelTipo: !!tipoData.element });
        }

        // --- Nível de Acesso
        const acessoBody = acessoPanel.querySelector('.seipro-acesso-body');
        let acessoTxt = '';
        if (acessoBody) {
            const acessoData = getAcessoText(docC);
            acessoTxt = acessoData.text;
            setSectionText(acessoBody, acessoTxt, '(indisponível)');
            if (!acessoTxt) report('infoarvore_consulta: Nível de Acesso unavailable', { hasRdo: !!acessoData.element });
        }

        // --- Assuntos
        const assBody = assuntosPanel.querySelector('.seipro-assuntos-body');
        const assOpts = getOptionTexts(docC, '#selAssuntos option');
        if (assBody) {
            clearChildren(assBody);
            if (!assOpts.length) {
                setMutedStatus(assBody, '(sem assuntos)');
            } else {
                assOpts.forEach(function (txt) { appendCopyRow(assBody, txt); });
            }
        }

        // --- Observações
        const obsBody = obsPanel.querySelector('.seipro-obs-body');
        const obsTA = docC.getElementById('txaObservacoes') as HTMLTextAreaElement | null;
        const obsVal = obsTA ? (obsTA.value || obsTA.textContent || '').trim() : '';
        if (obsBody) {
            setSectionText(obsBody, obsVal, '(sem observações)');
            if (obsBody.firstChild && obsVal && obsBody.firstChild instanceof HTMLElement) {
                obsBody.firstChild.classList.add('seipro-infoarvore-prewrap');
            }
        }

        // --- Interessados
        const opts = getInteressadosTexts(docC);
        clearChildren(intBody);
        if (!opts.length) {
            setMutedStatus(intBody, '(sem interessados)');
            log('infoarvore_interessados: empty');
            return;
        }
        opts.forEach(function (part) { appendCopyRow(intBody, part); });

        const tipoNameLog = tipoBody ? ((tipoBody.textContent || '').trim()) : '';
        log('infoarvore_consulta: tipo="' + tipoNameLog + '" acesso="' + acessoTxt + '" assuntos=' + assOpts.length + ' obs.len=' + obsVal.length);
        log('infoarvore_interessados: populated', opts.length, 'interessado(s)');
    }

    function renderConsulta() {
        invalidatePage(consultaUrl);
        fetchPage(consultaUrl).then(function (docC) {
            renderConsultaSections(docC);
        }).catch(function (e: Error) {
            setFailedStatus(intBody, '(falha ao carregar)');
            setFailedStatus(tipoPanel.querySelector('.seipro-tipo-body'), '(falha ao carregar)');
            setFailedStatus(acessoPanel.querySelector('.seipro-acesso-body'), '(falha ao carregar)');
            setFailedStatus(assuntosPanel.querySelector('.seipro-assuntos-body'), '(falha ao carregar)');
            setFailedStatus(obsPanel.querySelector('.seipro-obs-body'), '(falha ao carregar)');
            report('infoarvore_consulta: fetch failed — 5 sections (Tipo/Acesso/Assuntos/Obs/Interessados) shown as "(falha ao carregar)"', { error: e.message, url: consultaUrl });
        });
    }
    refreshers.consulta = renderConsulta;
    // Consulta fetch feeds 5 sections; skip only if all 5 are disabled.
    const consultaSections = ['interessados', 'tipo_procedimento', 'nivel_acesso', 'assuntos', 'observacoes'];
    if (consultaSections.some(sectionEnabled)) renderConsulta();
    else log('infoarvore_consulta: skipped (all 5 dependent sections disabled by user)');
}
