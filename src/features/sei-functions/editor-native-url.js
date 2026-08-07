/**
 * Sei Functions Pro — native editor URL patching.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    extractEditorMontarUrl,
    isValidEditorMontarUrl,
    editorWindowNeedsNavigate,
    getUrlDocumentoId,
    repairEditorMontarUrl
} from '../../shared/sei-editor-url.js';

import {
    alertaBoxPro,
    getTreeLinkUrlByName,
    openLinkNewTab
} from './modules.js';

export function getUrlNewDocArvore() {
    var ifrArvore = $('#ifrArvore');
    var urlNewDoc = getTreeLinkUrlByName('Incluir Documento');
        urlNewDoc = urlNewDoc !== null ? urlNewDoc : false;
    return urlNewDoc;
}
export function openWindowEditor(urlEditor, idUser) {
    if (!isValidEditorMontarUrl(urlEditor)) {
        console.warn('SEI Pro: openWindowEditor skipped — missing id_documento', urlEditor);
        if (typeof alertaBoxPro === 'function') {
            alertaBoxPro('Error', 'exclamation-triangle', 'N\u00E3o foi poss\u00EDvel abrir o editor: documento sem identifica\u00E7\u00E3o.');
        }
        return;
    }
    var abs = toAbsoluteSeiUrl(urlEditor);
    var id_documento = getParamsUrlPro(urlEditor).id_documento;
    var nome = 'janelaEditor_'+idUser+'_'+id_documento;
    var janelaEditor = null;
    try {
        // Pass URL as first arg (like SEI iniciarEditor). Empty-string open does NOT
        // navigate an existing named window that already has a bad empty-id URL.
        janelaEditor = infraAbrirJanela(abs, nome, parent.infraClientWidth(), parent.infraClientHeight(), 'location=0,status=0,resizable=1,scrollbars=1', false);
    } catch (e) {
        janelaEditor = null;
    }
    if (!janelaEditor) {
        openLinkNewTab(abs);
        return;
    }
    try {
        var href = '';
        try { href = String(janelaEditor.location.href || ''); } catch (e2) { href = ''; }
        if (editorWindowNeedsNavigate(href)) {
            janelaEditor.location.href = abs;
        }
        janelaEditor.focus();
    } catch (e3) {
        openLinkNewTab(abs);
    }
}

function toAbsoluteSeiUrl(url) {
    try {
        var a = document.createElement('a');
        a.href = url;
        return a.href;
    } catch (e) {
        return url;
    }
}

function firstEditorContextDocumentId(win) {
    const candidates = [];
    const add = (value) => {
        if (value) candidates.push(String(value));
    };

    try {
        let current = win;
        for (let depth = 0; current && depth < 3; depth++, current = current.parent) {
            add(current?.linkEditarConteudo);
            add(current?.location?.href);
            const doc = current?.document;
            if (!doc) continue;
            const input = doc.querySelector('[name="id_documento"], #hdnIdDocumento, #id_documento');
            add(input?.value);
            doc.querySelectorAll('a[href*="id_documento="]').forEach((link) => {
                add(link.href || link.getAttribute('href'));
            });
        }
    } catch (error) { /* noop */ }

    // The selected document remains available in the process tree even when
    // the visualisation frame itself was loaded without id_documento.
    try {
        const parentDoc = win?.parent?.document;
        const tree = parentDoc?.querySelector('#ifrArvore');
        const selected = tree?.contentDocument?.querySelector('.infraArvoreNoSelecionado');
        add(selected?.closest('a')?.href);
        add(selected?.getAttribute('href'));
    } catch (error) { /* noop */ }

    for (const candidate of candidates) {
        const id = getUrlDocumentoId(candidate);
        if (/^\d+$/.test(id)) return id;
        if (/^\d+$/.test(candidate.trim())) return candidate.trim();
    }
    return '';
}

function editorLinksFromContext(win) {
    const links = [];
    const add = (value) => {
        const candidate = String(value || '').trim();
        if (candidate && /acao=editor_montar/i.test(candidate)) links.push(candidate);
    };

    try {
        let current = win;
        for (let depth = 0; current && depth < 3; depth++, current = current.parent) {
            add(current?.linkEditarConteudo);
            const doc = current?.document;
            doc?.querySelectorAll('a[href*="editor_montar"]').forEach((link) => {
                add(link.href || link.getAttribute('href'));
            });
        }
    } catch (error) { /* noop */ }

    return links;
}

function resolveNativeEditorUrl(win) {
    if (!win) return null;
    const documentId = firstEditorContextDocumentId(win);
    if (!documentId) return null;

    const base = editorLinksFromContext(win)[0] || '';
    if (!base) return null;

    const repaired = repairEditorMontarUrl(base, documentId, win.location?.href || '');
    return repaired && isValidEditorMontarUrl(repaired) ? repaired : null;
}

/**
 * SEI's editarConteudo opens with infraAbrirJanela('', name) and only assigns
 * location when about:blank — so a prior empty-id_documento window is reused.
 * Replace it to open with the absolute linkEditarConteudo (like iniciarEditor).
 */
export function patchNativeEditorOpen(win) {
    if (!win || win.__SEI_PRO_EDITOR_OPEN_PATCHED__) return false;
    if (typeof win.editarConteudo !== 'function') return false;
    if (!resolveNativeEditorUrl(win)) return false;
    win.__SEI_PRO_EDITOR_OPEN_PATCHED__ = true;
    var orig = win.editarConteudo;
    win.editarConteudo = function patchedEditarConteudo(assinado) {
        try {
            if (win.INFRA_FF > 0 && win.INFRA_FF < 4) {
                win.alert('Para realizar a edi\u00E7\u00E3o de documentos no Firefox \u00E9 recomendado atualizar o navegador para a vers\u00E3o 4 ou posterior.\n\nPara iniciar a atualiza\u00E7\u00E3o autom\u00E1tica acesse o menu "Ajuda / Verificar atualiza\u00E7\u00F5es..." ou "Ajuda / Sobre o Firefox" do navegador.');
            }
            if (assinado == 'S') {
                if (win.objAjaxVerificacaoAssinatura) win.objAjaxVerificacaoAssinatura.bolAssinado = true;
            } else if (win.objAjaxVerificacaoAssinatura && typeof win.objAjaxVerificacaoAssinatura.executar === 'function') {
                win.objAjaxVerificacaoAssinatura.executar();
            }
            if (win.objAjaxVerificacaoAssinatura && win.objAjaxVerificacaoAssinatura.bolAssinado) {
                if (!win.confirm('Este documento j\u00E1 foi assinado. Se for editado perder\u00E1 a assinatura e dever\u00E1 ser assinado novamente.\n\n Deseja editar o documento?')) {
                    if (assinado == 'N' && typeof win.atualizarArvore === 'function') {
                        win.atualizarArvore(win.linkMontarArvoreProcessoDocumento);
                    }
                    return;
                }
            }
        } catch (ePre) {
            console.warn('SEI Pro: editarConteudo pre-check failed, falling back', ePre);
            try { return orig.apply(win, arguments); } catch (eOrig) { /* continue */ }
        }
        ensureNativeEditorWindowNavigates(win);
    };
    return true;
}

export function ensureNativeEditorWindowNavigates(win) {
    const editorUrl = resolveNativeEditorUrl(win);
    if (!editorUrl) return false;
    var abs;
    try {
        var a = win.document.createElement('a');
        a.href = editorUrl;
        abs = a.href;
    } catch (e) {
        abs = editorUrl;
    }
    var nome = 'janelaEditor_' + (win.nomeJanelaDocumento || '');
    var openFn = null;
    try {
        if (win.parent && typeof win.parent.infraAbrirJanela === 'function') openFn = win.parent.infraAbrirJanela.bind(win.parent);
        else if (typeof win.infraAbrirJanela === 'function') openFn = win.infraAbrirJanela.bind(win);
    } catch (eBind) { /* noop */ }

    var w = null;
    try {
        if (openFn) {
            w = openFn(abs, nome, win.infraClientWidth(), win.infraClientHeight(), 'location=0,status=0,resizable=1,scrollbars=1', false);
        } else {
            w = win.open(abs, nome);
        }
    } catch (e2) {
        w = null;
    }
    if (!w) {
        if (typeof openLinkNewTab === 'function') openLinkNewTab(abs);
        else try { win.open(abs, '_blank'); } catch (e3) { /* noop */ }
        return true;
    }
    try {
        var href = '';
        try { href = String(w.location.href || ''); } catch (e4) { href = ''; }
        if (editorWindowNeedsNavigate(href)) {
            w.location.href = abs;
        }
        w.focus();
    } catch (e5) {
        if (typeof openLinkNewTab === 'function') openLinkNewTab(abs);
    }
    return true;
}
export function setResizeIfrArvore() {
    var ifrArvore = $('#ifrArvore');
    var ifrVisualizacao = $($ifrVisualizacao);
    if (ifrArvore.length > 0) { 
        console.log(ifrArvore.width(), ifrVisualizacao.width());
    }
}
export function _infraTooltipMostrar(_this, text) {
    if (!$(_this).find('.text').is(':visible')) {
        if (typeof infraTooltipMostrar === 'function') infraTooltipMostrar(text);
    }
}
export function setResizeAreaTelaD() {
    if ($('.panelHomePro').is(':visible')) {
        var width = $('.panelHomePro:visible').width() - ( $('.panelHomePro:visible').width()*0.02 );
        $('.resizeObserve:visible').css('width', width);
    }
    if ($('#atividadesProActions').length > 0 && $('#atividadesProActions').is(':visible')) {
        $('#atividadesPro').removeClass('minView');

        if ($('#atividadesProActions').height() > 40) {
            $('#atividadesPro').addClass('minView');
        }
    }
}
