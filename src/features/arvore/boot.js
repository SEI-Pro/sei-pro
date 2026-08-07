/**
 * Árvore — initSeiProArvore boot.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    bindParentAtividadesActions
} from './view.js';

import {
    initUploadArvore
} from './upload.js';

import {
    callParentAtividades
} from './atividades-bridge.js';

import {
    checkProcessoSigiloso,
    getArvoreInitSignature,
    getLinksArvore,
    getLinksPage,
    initBreakDocTwoLines,
    initCSSArvore,
    initNumericDocsPro,
    initPanelPrescricaoProcesso,
    initToolbarDocs,
    loadStyleDesignArvore
} from './modules.js';

bindParentAtividadesActions({ callParentAtividades });


export function initSeiProArvore(loop = true) {
    if (typeof jmespath === 'undefined') {
        if (!window.__SEI_PRO_JMESPATH_LOADING__ && typeof parent.URL_SPRO !== 'undefined') {
            window.__SEI_PRO_JMESPATH_LOADING__ = true;
            $.getScript(parent.URL_SPRO+"js/lib/jmespath.min.js")
                .always(function() {
                    window.__SEI_PRO_JMESPATH_LOADING__ = false;
                    initSeiProArvore(loop);
                });
        }
        return;
    }
    var treeSignature = getArvoreInitSignature();
    if (treeSignature && window.__SEI_PRO_ARVORE_LAST_SIGNATURE__ === treeSignature) {
        return;
    }
    if (treeSignature) {
        window.__SEI_PRO_ARVORE_LAST_SIGNATURE__ = treeSignature;
    }
    loadStyleDesignArvore();
    checkProcessoSigiloso();
    if (callParentAtividades('checkCapacidade', 'view_prescricoes') && parent.checkConfigValue('gerenciarprescricoes')) initPanelPrescricaoProcesso();
    arrayLinksArvore = getLinksArvore();
    arrayLinksPage = getLinksPage();
    parent.linksArvore = getLinksPage(); 
    if (typeof parent.syncTreeModelSession === 'function' && typeof parent.pullDadosProcessoSession === 'function') {
        parent.syncTreeModelSession(parent.pullDadosProcessoSession(), {
            links: arrayLinksArvore,
            linksAll: arrayLinksArvoreAll,
            iconsView: arrayIconsView,
            pageLinks: arrayLinksPage,
            signature: treeSignature,
            source: window.location.href
        });
    }

    if (typeof localStorageRestorePro === "function" && typeof parent.checkConfigValue !== 'undefined'  && !parent.checkConfigValue('infoarvore')) {
        if (typeof parent.resizeArvoreMaxWidth === 'function') {
            parent.resizeArvoreMaxWidth(true);
        }
        console.log('forceOnLoadBodyPage');
    }
    
    if (typeof localStorageRestorePro === "function" && typeof parent.checkConfigValue !== 'undefined'  && parent.checkConfigValue('menurapido') ) { 
        initToolbarDocs(); 
        initCSSArvore();
    }
    if (!window.__SEI_PRO_TREE_BOOT__ && typeof localStorageRestorePro === "function" && typeof parent.verifyConfigValue !== 'undefined'  && parent.verifyConfigValue('duaslinhas') ) {
        initBreakDocTwoLines();
    }
    if (typeof resizeArvoreMaxWidth === "function" && typeof parent.verifyConfigValue !== 'undefined'  && parent.verifyConfigValue('resizearvore') ) { 
        parent.resizeArvoreMaxWidth();
    }
    if (!window.__SEI_PRO_TREE_BOOT__ && typeof parent.verifyConfigValue !== 'undefined'  && parent.verifyConfigValue('numerar_documentos') ) {
        initNumericDocsPro();
    }
    if (
        (typeof parent.initAtividadesProcesso === 'function' || typeof parent.initAtividadesProcesso !== 'undefined') && 
        parent.checkConfigValue('gerenciaratividades') && localStorage.getItem('configBasePro_atividades') !== null &&
        typeof parent.__ !== 'undefined'
        ) {
        parent.initAtividadesProcesso();
    }
    if (
        (typeof parent.insertIconMonitorados === 'function' || typeof parent.insertIconMonitorados !== 'undefined') && 
        typeof parent.checkConfigValue !== 'undefined' && parent.checkConfigValue('gerenciarmonitorados')
        ) {
        parent.insertIconMonitorados();
    }
    if (!window.__SEI_PRO_TREE_BOOT__ && typeof parent.checkHostLimit !== 'undefined'  && !parent.checkHostLimit() && (typeof parent.initCheckDadosProcesso === 'function' || typeof parent.initCheckDadosProcesso !== 'undefined')) {
        parent.initCheckDadosProcesso();
    }
    if (typeof localStorageRestorePro === "function" && typeof parent.checkConfigValue !== 'undefined' && parent.checkConfigValue('uploaddocsexternos')) {
        initUploadArvore();
    }
    if (typeof localStorageRestorePro === "function" && typeof parent.checkConfigValue !== 'undefined' && typeof parent.hideMenuSistemaView === 'function' && parent.verifyConfigValue('menususpenso')) {
        parent.hideMenuSistemaView();
    }
    if (typeof parent.setClickUrlAmigavel !== 'undefined'  && parent.verifyConfigValue('urlamigavel')) {
        parent.setClickUrlAmigavel();
    }
    if (typeof parent.appendIconsFormArvore !== 'undefined' && typeof parent.dadosFormularioObj !== 'undefined' && parent.verifyConfigValue('gerenciarformularios')) {
        parent.appendIconsFormArvore();
    }
    if (typeof parent.getOptionsPro !== 'undefined' && parent.getOptionsPro('iframeSizeSlimPro') && typeof parent.setSizeIframePro !== 'undefined') {
        parent.setSizeIframePro(parent.getOptionsPro('iframeSizeSlimPro'));
    }
    if (typeof replaceColorsIcons !== 'undefined' && checkConfigValue('coresmarcadores')) {
        replaceColorsIcons($('a[href*="andamento_marcador_gerenciar"], .tagUserColorPro'));
    }
    
    var markTreeAnchors = function() {
        $('a[id*="anchor"][target="'+ifrVisualizacao_+'"]').data('arvore-pro', true);
    };
    var scheduleTreeAnchorMark = function() {
        if (window.__SEI_PRO_ARVORE_MARK_PENDING__) return;
        window.__SEI_PRO_ARVORE_MARK_PENDING__ = true;
        requestAnimationFrame(function() {
            window.__SEI_PRO_ARVORE_MARK_PENDING__ = false;
            markTreeAnchors();
        });
    };

    markTreeAnchors();
    if (!window.__SEI_PRO_TREE_BOOT__) {
        $('a[target="ifrVisualizacao"]:contains("(URGENTE)")').addClass('urgentePro').find('div.urgentePro').remove().end().prepend('<div class="urgentePro"></div>');
    }

    if (!window.__SEI_PRO_ARVORE_MUTATION_OBSERVER__ && typeof MutationObserver !== 'undefined') {
        var treeObserverTarget = document.getElementById('divArvore') || document.body;
        if (treeObserverTarget) {
            window.__SEI_PRO_ARVORE_MUTATION_OBSERVER__ = new MutationObserver(function() {
                scheduleTreeAnchorMark();
            });
            window.__SEI_PRO_ARVORE_MUTATION_OBSERVER__.observe(treeObserverTarget, {
                childList: true,
                subtree: true
            });
        }
    }

    if (typeof DOMPurify === 'undefined' && typeof parent.URL_SPRO !== 'undefined') $.getScript(parent.URL_SPRO+"js/lib/purify.min.js");

    if (!window.__SEI_PRO_TREE_BOOT__ && !window.__SEI_PRO_ARVORE_READY_EVENT_SENT__ && typeof parent.dispatchEvent === 'function') {
        window.__SEI_PRO_ARVORE_READY_EVENT_SENT__ = true;
        try {
            var ArvoreReadyEvent = (typeof parent.CustomEvent === 'function') ? parent.CustomEvent : CustomEvent;
            parent.dispatchEvent(new ArvoreReadyEvent('sei-pro-arvore-ready', {
                detail: {
                    href: window.location.href,
                    loop: loop
                }
            }));
        } catch (e) {
            window.__SEI_PRO_ARVORE_READY_EVENT_SENT__ = false;
        }
    }

    if (!window.__SEI_PRO_TREE_BOOT__ && typeof parent.checkHostLimit !== 'undefined'  && parent.checkHostLimit() && typeof parent.getUrlAcaoPro !== 'undefined'  && parent.getUrlAcaoPro('duplicar_documento')) {
        parent.initCheckDadosProcesso();
        console.log('parent.getUrlAcaoPro(duplicar_documento)',parent.getUrlAcaoPro('duplicar_documento'));
    }
}
