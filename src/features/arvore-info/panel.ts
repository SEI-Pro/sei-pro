/**
 * Painel "Informações adicionais na árvore" (`infoarvore`) — mount / refresh / seções.
 */
import { extractNosHtml } from './parse/inline-payload.js';
import { isAtribuicaoUnassigned } from './parse/atribuicao.js';
import { installConsultaSection } from './sections/consulta.js';
import { installAcompanhamentoSection } from './sections/acompanhamento.js';
import { installMarcadorSection } from './sections/marcador.js';
import { createAtribuicaoSection } from './sections/atribuicao.js';
import { installAnotacaoSection } from './sections/anotacao.js';
import { createSectionEnabledChecker } from './preference.js';
import { normalizeMojibakeUtf8 } from '../../core/texto.js';
import {
    TREE_PANEL_FORM,
    TREE_ANDAMENTO,
    TREE_PANEL_MARCADOR_SELECT
} from '../../sei/selectors.js';
import {
    clearChildren,
    restoreChildren,
    setMutedStatus,
    snapshotChildren
} from './dom/status.js';

export type BuildPanelSectionOpts = {
    type: string;
    icon: string;
    title: string;
    bodyClass?: string;
    /** When true (default), body starts with a muted "carregando…" placeholder. */
    loading?: boolean;
};

/** Build a panel section root with createElement (no HTML string concat). */
export function buildPanelSection(doc: Document, opts: BuildPanelSectionOpts): HTMLElement {
    const el = doc.createElement('div');
    el.className = 'panelDadosArvore';
    el.dataset.type = opts.type;

    const label = doc.createElement('label');
    label.className = 'newLink panelArvoreHead seipro-infoarvore-head';

    const iconEl = doc.createElement('i');
    iconEl.className = 'fas ' + opts.icon + ' azulColor iconDadosProcesso';
    label.appendChild(iconEl);
    label.appendChild(doc.createTextNode(' ' + opts.title + ' '));

    const toggle = doc.createElement('i');
    toggle.className = 'fas fa-chevron-down azulColor seipro-toggle seipro-infoarvore-toggle';
    label.appendChild(toggle);
    el.appendChild(label);

    const body = doc.createElement('div');
    const bodyClass = opts.bodyClass ? String(opts.bodyClass).trim() : '';
    body.className = bodyClass ? ('infoDadosArvore ' + bodyClass) : 'infoDadosArvore';
    if (opts.loading !== false) {
        const span = doc.createElement('span');
        span.className = 'seipro-infoarvore-muted';
        span.textContent = 'carregando…';
        body.appendChild(span);
    }
    el.appendChild(body);
    return el;
}

export type InfoArvorePanelDeps = {
    doc: Document;
    win: Window & typeof globalThis;
    fetchPage: (url: string) => Promise<Document>;
    invalidatePage: (url: string) => void;
    submitForm: (docA: Document, values: Record<string, string | boolean>) => Promise<unknown>;
    findToolbarLink: (hrefFragment: string) => string | null;
    getToolbarLinks: () => Array<{ name: string; url: string }>;
    log: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    err: (...args: unknown[]) => void;
    report: (reason: string, detail?: unknown) => void;
    forceTrueConfirm?: (winObj: Window | null | undefined) => void;
    normalizeMojibakeUtf8?: (value: string) => string;
};

type PanelParent = {
    checkConfigValue?: (key: string) => boolean;
    location: { href: string };
    document: Document;
    copyTextThis?: (el: Element) => void;
};

type InlineField = {
    kind: 'select' | 'textarea';
    label: string;
    srcSelector: string;
    name: string;
};

type SubmitValues = Record<string, string>;
type SubmitPrepareFn = (w: Window, d: Document) => void;

/**
 * Feature descriptor for the infoarvore panel (registered on SeiProTree pipeline).
 */
export function createInfoArvorePanelFeature(deps: InfoArvorePanelDeps) {
    const doc = deps.doc;
    const win = deps.win;
    const fetchPage = deps.fetchPage;
    const invalidatePage = deps.invalidatePage;
    const submitForm = deps.submitForm;
    const findToolbarLink = deps.findToolbarLink;
    const getToolbarLinks = deps.getToolbarLinks;
    const log = deps.log;
    const warn = deps.warn;
    const err = deps.err;
    const report = deps.report;
    const normalize = deps.normalizeMojibakeUtf8 || normalizeMojibakeUtf8;

    return {
    id: 'infoarvore',
    enabled: function (parent: unknown) {
        const p = parent as PanelParent;
        return typeof p.checkConfigValue === 'function' && !!p.checkConfigValue('infoarvore');
    },
    initOnce: function (ctx?: { parent?: PanelParent } | null) {
        const p = (ctx && ctx.parent) as PanelParent;
        if (!p) { report('infoarvore: initOnce missing parent'); return; }
        // Mount target preference: TREE_PANEL_FORM (canonical), then TREE_ANDAMENTO's parent,
        // then body. Resilient to SEI variants where #frmArvore is renamed/removed.
        const andamento = doc.querySelector(TREE_ANDAMENTO);
        const frmArvore = (doc.querySelector(TREE_PANEL_FORM)
            || (andamento && andamento.parentElement)
            || doc.body) as HTMLElement | null;
        if (!frmArvore) { report('infoarvore: no mount target found — panel cannot mount'); return; }
        log('infoarvore: mount target =', frmArvore.id || frmArvore.tagName);
        if (frmArvore.querySelector('.panelDadosArvore')) { log('infoarvore: panel already mounted — skip'); return; }

        const sectionEnabled = createSectionEnabledChecker({
            storageHost: win as { localStorageRestorePro?: (key: string) => unknown }
        });
        log('infoarvore: section filter via preference facade');

        // --- 1) Atribuição: scrape responsáveis from SEI inline script.
        const responsaveis: Array<{ text: string; unassigned: boolean }> = [];
        const scripts = doc.querySelectorAll('script:not([src])');
        for (let i = 0; i < scripts.length; i++) {
            const txt = scripts[i]?.textContent || '';
            const raw = extractNosHtml(txt);
            if (raw === null) continue;
            raw.split('<br />').forEach(function (frag) {
                const tmp = new DOMParser().parseFromString(frag, 'text/html').body;
                const text = (tmp.textContent || '').trim();
                if (text) {
                    responsaveis.push({
                        text: text,
                        unassigned: isAtribuicaoUnassigned(text, tmp.querySelector('a.ancoraSigla'))
                    });
                }
            });
            break;
        }
        log('infoarvore: parsed', responsaveis.length, 'responsável(is) from inline scripts');

        const atribSection = createAtribuicaoSection({
            doc: doc, win: win, findToolbarLink: findToolbarLink,
            fetchPage: fetchPage, invalidatePage: invalidatePage, submitViaIframe: submitViaIframe,
            log: log, err: err, report: report
        });

        // --- 2) Build panel (Atribuição + Marcador placeholder).
        const panel = buildPanelSection(doc, { type: 'responsaveis', icon: 'fa-user-tie', title: 'Atribuição:', bodyClass: '', loading: false });
        const body = panel.querySelector('.infoDadosArvore');
        if (body) atribSection.renderRows(body, responsaveis);

        const marcPanel = buildPanelSection(doc, { type: 'marcador', icon: 'fa-bookmark', title: 'Marcador:', bodyClass: 'seipro-marcador-body' });
        const intPanel = buildPanelSection(doc, { type: 'interessados', icon: 'fa-users', title: 'Interessados:', bodyClass: 'seipro-interessados-body' });
        const anotPanel = buildPanelSection(doc, { type: 'anotacoes', icon: 'fa-sticky-note', title: 'Anotação:', bodyClass: 'seipro-anot-body' });
        const acompPanel = buildPanelSection(doc, { type: 'acompanhamento_especial', icon: 'fa-eye', title: 'Acompanhamento Especial:', bodyClass: 'seipro-acomp-body' });
        const tipoPanel = buildPanelSection(doc, { type: 'tipo_procedimento', icon: 'fa-inbox', title: 'Tipo de Processo:', bodyClass: 'seipro-tipo-body' });
        const acessoPanel = buildPanelSection(doc, { type: 'nivel_acesso', icon: 'fa-lock', title: 'Nível de Acesso:', bodyClass: 'seipro-acesso-body' });
        const assuntosPanel = buildPanelSection(doc, { type: 'assuntos', icon: 'fa-bookmark', title: 'Assuntos:', bodyClass: 'seipro-assuntos-body' });
        const obsPanel = buildPanelSection(doc, { type: 'observacoes', icon: 'fa-comment-alt', title: 'Observações desta unidade:', bodyClass: 'seipro-obs-body' });

        [anotPanel, panel, marcPanel, acompPanel, tipoPanel, intPanel, acessoPanel, assuntosPanel, obsPanel]
            .forEach(function (sec) {
                if (sectionEnabled(sec.dataset.type || '')) frmArvore.appendChild(sec);
            });
        log('infoarvore: panel mounted (' + frmArvore.querySelectorAll('.panelDadosArvore').length + ' sections)');

        const refreshers: Record<string, () => void> = {};
        const sectionRefreshMap: Record<string, string> = {
            responsaveis: 'responsaveis',
            marcador: 'marcador',
            tipo_procedimento: 'consulta',
            nivel_acesso: 'consulta',
            interessados: 'consulta',
            assuntos: 'consulta',
            observacoes: 'consulta',
            acompanhamento_especial: 'acomp',
            anotacoes: 'anotacoes',
            consulta: 'consulta',
            acomp: 'acomp'
        };
        function resolveRefreshKey(name: string) {
            return sectionRefreshMap[name] || name;
        }
        function refreshSection(name: string, reason?: string) {
            const key = resolveRefreshKey(name);
            if (!refreshers[key]) { report('refreshSection: no refresher named ' + name + ' (resolved=' + key + ')'); return; }
            log('infoarvore: refreshing ' + name + ' -> ' + key + ' (' + (reason || 'manual') + ')');
            try { refreshers[key]!(); } catch (e) { err('refresh ' + key + ':', (e as Error).message); }
        }

        function addHeadBtn(
            sectionPanel: HTMLElement,
            mode: string,
            icon: string,
            title: string,
            extraData?: Record<string, string>
        ) {
            const head = sectionPanel.querySelector('.panelArvoreHead');
            if (!head) return null;
            // Native button — avoid nested `a.newLink` (padding + float:none !important hide the glyph).
            const btn = doc.createElement('button');
            btn.type = 'button';
            btn.className = 'seipro-edit seipro-infoarvore-pencil';
            btn.dataset.mode = mode;
            btn.title = title || 'Editar';
            btn.setAttribute('aria-label', title || 'Editar');
            const iEl = doc.createElement('i');
            iEl.className = 'fas ' + icon + ' azulColor';
            iEl.setAttribute('aria-hidden', 'true');
            btn.appendChild(iEl);
            if (extraData) Object.keys(extraData).forEach(function (k) { btn.dataset[k] = extraData[k]; });
            head.appendChild(btn);
            return btn;
        }

        frmArvore.addEventListener('click', function (ev) {
            const t = ev.target as Element | null;
            if (!t || !t.closest) return;
            const toggle = t.closest('.seipro-toggle');
            if (toggle) {
                const pn = toggle.closest('.panelDadosArvore');
                const bd = pn && pn.querySelector('.infoDadosArvore') as HTMLElement | null;
                if (!bd) return;
                const hidden = bd.style.display === 'none';
                bd.style.display = hidden ? '' : 'none';
                toggle.classList.toggle('fa-chevron-down', hidden);
                toggle.classList.toggle('fa-chevron-right', !hidden);
                return;
            }
            const editA = t.closest('.seipro-edit') as HTMLElement | null;
            if (editA) {
                ev.preventDefault();
                ev.stopPropagation();
                const mode = editA.dataset.mode;
                log('edit click: mode=' + mode);
                if (mode === 'responsaveis') {
                    atribSection.editInline(panel);
                    return;
                }
                if (mode === 'marcador') {
                    const marcGerUrl = findToolbarLink('andamento_marcador_gerenciar');
                    if (!marcGerUrl) { err('inline marcador: toolbar link missing'); return; }
                    const fields: InlineField[] = [
                        { kind: 'select', label: 'Marcador', srcSelector: TREE_PANEL_MARCADOR_SELECT, name: 'selMarcador' },
                        { kind: 'textarea', label: 'Observação (opcional)', srcSelector: '#txaTexto', name: 'txaTexto' },
                    ];
                    invalidatePage(marcGerUrl);
                    fetchPage(marcGerUrl).then(function (docM) {
                        let addUrl = marcGerUrl;
                        if (!docM.querySelector(TREE_PANEL_MARCADOR_SELECT)) {
                            const btnAdd = docM.querySelector('#btnAdicionar');
                            const oc = (btnAdd && btnAdd.getAttribute('onclick')) || '';
                            const m = oc.match(/['"]([^'"]*controlador\.php[^'"]*acao=andamento_marcador_cadastrar[^'"]*)['"]/);
                            if (m && m[1]) {
                                try { addUrl = new URL(m[1], p.location.href).href; } catch { addUrl = m[1]; }
                                log('marcador: using add URL from btnAdicionar');
                            } else {
                                err('marcador: could not extract add URL from listing');
                                return;
                            }
                        }
                        openInlineEditor(marcPanel, addUrl, fields, function () { refreshSection('marcador', 'post-add'); });
                    }).catch(function (e: Error) { err('marcador prefetch:', e.message); });
                    return;
                }
                if (mode === 'tipo_procedimento') {
                    editTipoInline(tipoPanel);
                    return;
                }
                if (mode === 'acompanhamento_especial') {
                    editAcompInline(acompPanel);
                    return;
                }
                err('edit: unhandled mode "' + mode + '" — no inline editor');
                return;
            }
            const copyA = t.closest('.seipro-copy');
            if (copyA) {
                const text = (copyA.textContent || '').trim();
                if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function (e: Error) { err('clipboard:', e.message); });
                else if (typeof p.copyTextThis === 'function') p.copyTextThis(copyA);
            }
        });

        const atribText = (responsaveis[0] && responsaveis[0].text) || '';
        addHeadBtn(panel, 'responsaveis', 'fa-edit', 'Editar atribuição', { text: atribText });
        addHeadBtn(marcPanel, 'marcador', 'fa-edit', 'Editar marcador');
        addHeadBtn(acompPanel, 'acompanhamento_especial', 'fa-edit', 'Editar acompanhamento especial');
        addHeadBtn(tipoPanel, 'tipo_procedimento', 'fa-edit', 'Editar tipo de processo');

        function submitViaIframe(url: string, valuesOrFn: SubmitValues | SubmitPrepareFn): Promise<void> {
            return new Promise(function (resolve, reject) {
                const hostDoc = p.document;
                const ifr = hostDoc.createElement('iframe');
                ifr.className = 'seipro-infoarvore-submit-frame';
                ifr.id = 'seipro-submit-frame-' + Date.now();
                ifr.setAttribute('sandbox', 'allow-same-origin allow-forms allow-scripts allow-modals');
                let loads = 0;
                const timeout = setTimeout(function () {
                    try { ifr.remove(); } catch { /* ignore */ }
                    reject(new Error('submitViaIframe: timeout'));
                }, 15000);
                ifr.addEventListener('load', function () {
                    loads++;
                    if (loads === 1) {
                        try {
                            const ifrDoc = ifr.contentDocument;
                            const ifrWin2 = ifr.contentWindow;
                            if (!ifrDoc || !ifrWin2) throw new Error('submitViaIframe: no iframe document');
                            if (typeof valuesOrFn === 'function') {
                                try { ifrWin2.confirm = function () { return true; }; } catch { /* ignore */ }
                                valuesOrFn(ifrWin2, ifrDoc);
                            } else {
                                const values = valuesOrFn;
                                Object.keys(values).forEach(function (id) {
                                    if (id.indexOf('sel') === 0) {
                                        const hdnId = 'hdnId' + id.replace('sel', '');
                                        const hdn = ifrDoc.getElementById(hdnId) as HTMLInputElement | null;
                                        if (hdn) hdn.value = values[id]!;
                                    }
                                    const el = ifrDoc.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
                                    if (!el) return;
                                    if (el.tagName === 'SELECT') { (el as HTMLSelectElement).value = values[id]!; }
                                    else if (el.type === 'checkbox' || el.type === 'radio') { el.checked = !!values[id]; }
                                    else { el.value = values[id]!; }
                                });
                                const submitBtn = ifrDoc.querySelector('button[type=submit], input[type=submit]')
                                    || ifrDoc.querySelector('#sbmSalvar')
                                    || ifrDoc.querySelector('button[name=btnSalvar], input[name=btnSalvar]')
                                    || ifrDoc.querySelector('button[name=sbmSalvar], input[name=sbmSalvar]');
                                if (!submitBtn) throw new Error('no submit button in form');
                                (submitBtn as HTMLElement).click();
                            }
                        } catch (e) {
                            clearTimeout(timeout);
                            try { ifr.remove(); } catch { /* ignore */ }
                            reject(e);
                        }
                    } else {
                        clearTimeout(timeout);
                        try { ifr.remove(); } catch { /* ignore */ }
                        resolve();
                    }
                });
                ifr.src = url;
                hostDoc.body.appendChild(ifr);
            });
        }

        function openInlineEditor(
            sectionPanel: HTMLElement,
            formUrl: string,
            fields: InlineField[],
            onSaved?: () => void
        ) {
            const editorBody = sectionPanel.querySelector('.infoDadosArvore');
            if (!editorBody) return;
            const saved = snapshotChildren(editorBody);
            setMutedStatus(editorBody, 'carregando formulário…');
            invalidatePage(formUrl);
            fetchPage(formUrl).then(function (docA) {
                const wrap = doc.createElement('div');
                wrap.className = 'seipro-infoarvore-edit-wrap';
                const inputs: Record<string, HTMLSelectElement | HTMLTextAreaElement> = {};
                fields.forEach(function (f) {
                    const src = docA.querySelector(f.srcSelector) as HTMLSelectElement | HTMLTextAreaElement | null;
                    if (!src) {
                        report('inline editor: missing source field in fetched form', { selector: f.srcSelector, formUrl: formUrl });
                        return;
                    }
                    const label = doc.createElement('label');
                    label.textContent = f.label;
                    label.className = 'seipro-infoarvore-edit-label';
                    wrap.appendChild(label);
                    let el: HTMLSelectElement | HTMLTextAreaElement;
                    if (f.kind === 'select') {
                        el = doc.createElement('select');
                        el.className = 'seipro-infoarvore-edit-select';
                        Array.prototype.forEach.call((src as HTMLSelectElement).options, function (o: HTMLOptionElement) {
                            const opt = doc.createElement('option');
                            opt.value = o.value;
                            opt.textContent = o.text;
                            if (o.selected) opt.selected = true;
                            el.appendChild(opt);
                        });
                    } else {
                        el = doc.createElement('textarea');
                        el.className = 'seipro-infoarvore-edit-textarea';
                        el.value = (src as HTMLTextAreaElement).value || src.textContent || '';
                    }
                    wrap.appendChild(el);
                    inputs[f.name] = el;
                });
                const btnRow = doc.createElement('div');
                btnRow.className = 'seipro-infoarvore-edit-actions';
                const btnCancel = doc.createElement('button');
                btnCancel.type = 'button';
                btnCancel.className = 'newLink seipro-infoarvore-edit-btn';
                btnCancel.textContent = 'Cancelar';
                const btnSave = doc.createElement('button');
                btnSave.type = 'button';
                btnSave.className = 'newLink seipro-infoarvore-edit-btn';
                btnSave.textContent = 'Salvar';
                btnRow.appendChild(btnCancel);
                btnRow.appendChild(btnSave);
                wrap.appendChild(btnRow);
                clearChildren(editorBody);
                editorBody.appendChild(wrap);

                btnCancel.addEventListener('click', function () { restoreChildren(editorBody, saved); });
                btnSave.addEventListener('click', function () {
                    btnSave.disabled = true;
                    btnCancel.disabled = true;
                    btnSave.textContent = 'salvando…';
                    const values: SubmitValues = {};
                    Object.keys(inputs).forEach(function (k) { values[k] = inputs[k]!.value; });
                    submitViaIframe(formUrl, values).then(function () {
                        log('inline editor saved:', Object.keys(values).join(','));
                        setTimeout(function () {
                            try { if (onSaved) onSaved(); } catch (e) { err('onSaved:', (e as Error).message); }
                        }, 400);
                    }).catch(function (e: Error) {
                        err('inline submit:', e.message);
                        restoreChildren(editorBody, saved);
                        report('inline editor: submit failed — reverted to previous value');
                    });
                });
            }).catch(function (e: Error) {
                err('inline fetch:', e.message);
                restoreChildren(editorBody, saved);
            });
        }

        function editTipoInline(sectionPanel: HTMLElement) {
            const url = findToolbarLink('procedimento_alterar');
            if (!url) {
                report('inline tipo: toolbar link missing — edit Tipo de Processo disabled', { sought: 'procedimento_alterar' });
                return;
            }
            openInlineEditor(sectionPanel, url, [
                { kind: 'select', label: 'Tipo de Processo', srcSelector: '#selTipoProcedimento', name: 'selTipoProcedimento' },
            ], function () { refreshSection('tipo_procedimento', 'post-edit tipo'); });
        }

        function editAcompInline(sectionPanel: HTMLElement) {
            const gerUrl = findToolbarLink('acompanhamento_gerenciar');
            if (!gerUrl) {
                report('inline acomp: toolbar link missing — edit Acompanhamento Especial disabled', { sought: 'acompanhamento_gerenciar' });
                return;
            }
            const fields: InlineField[] = [
                { kind: 'select', label: 'Grupo', srcSelector: '#selGrupoAcompanhamento', name: 'selGrupoAcompanhamento' },
                { kind: 'textarea', label: 'Observação', srcSelector: '#txaObservacao', name: 'txaObservacao' },
            ];
            invalidatePage(gerUrl);
            fetchPage(gerUrl).then(function (docA) {
                let addUrl = gerUrl;
                if (!docA.querySelector('#selGrupoAcompanhamento')) {
                    const btnAdd = docA.querySelector('#btnAdicionar');
                    const oc = (btnAdd && btnAdd.getAttribute('onclick')) || '';
                    const m = oc.match(/['"]([^'"]*controlador\.php[^'"]*acao=acompanhamento_cadastrar[^'"]*)['"]/);
                    if (m && m[1]) {
                        try { addUrl = new URL(m[1], p.location.href).href; } catch { addUrl = m[1]; }
                        log('acomp: using add URL from btnAdicionar');
                    } else {
                        err('acomp: could not extract add URL from listing');
                        return;
                    }
                }
                openInlineEditor(sectionPanel, addUrl, fields, function () { refreshSection('acomp', 'post-add'); });
            }).catch(function (e: Error) { err('acomp prefetch:', e.message); });
        }

        // --- 4) Marcador
        installMarcadorSection({
            doc: doc, marcPanel: marcPanel,
            findToolbarLink: findToolbarLink, fetchPage: fetchPage, invalidatePage: invalidatePage,
            submitViaIframe: submitViaIframe, refreshSection: refreshSection, refreshers: refreshers,
            sectionEnabled: sectionEnabled, log: log, warn: warn, err: err, report: report
        });

        // --- 5) Consulta
        installConsultaSection({
            doc: doc,
            intPanel: intPanel, tipoPanel: tipoPanel, acessoPanel: acessoPanel,
            assuntosPanel: assuntosPanel, obsPanel: obsPanel,
            findToolbarLink: findToolbarLink, fetchPage: fetchPage, invalidatePage: invalidatePage,
            refreshers: refreshers, sectionEnabled: sectionEnabled,
            log: log, warn: warn, report: report
        });

        // --- 5b) Acompanhamento Especial
        installAcompanhamentoSection({
            doc: doc, acompPanel: acompPanel,
            findToolbarLink: findToolbarLink, getToolbarLinks: getToolbarLinks,
            fetchPage: fetchPage, invalidatePage: invalidatePage, submitViaIframe: submitViaIframe,
            refreshSection: refreshSection, refreshers: refreshers, sectionEnabled: sectionEnabled,
            log: log, warn: warn, err: err, report: report
        });

        // --- 6) Anotação
        installAnotacaoSection({
            doc: doc, win: win, fetchPage: fetchPage, invalidatePage: invalidatePage, submitForm: submitForm,
            refreshers: refreshers, sectionEnabled: sectionEnabled, anotPanel: anotPanel,
            findToolbarLink: findToolbarLink, log: log, warn: warn, err: err, report: report,
            normalizeMojibakeUtf8: normalize
        });
    },
    enrich: function (_anchor?: Element) { /* panel is process-level — no per-anchor work */ }
    };
}
