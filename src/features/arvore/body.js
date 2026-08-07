/**
 * Árvore — monolito residual (menus, sticknote, atividades, init).
 *
 * Upload/dropzone vive em ./upload.js (domain · io · view · templates).
 * State: ./state.js. jQuery / SEI globals vêm do iframe da árvore.
 */
import { installArvoreState } from './state.js';
import {
    resolveMenuCatalogs,
    getLinksInText as domainGetLinksInText,
    formatAnotacaoToParagraphs,
    buildArvoreInitSignature,
    sticknotePresetRankIconHtml as domainSticknotePresetRankIconHtml
} from './domain.js';
import { readArvoreMenuConfig as readArvoreMenuConfigIO } from './io.js';
import { bindArvoreToolbarProcess, bindParentAtividadesActions } from './view.js';
import * as templates from './templates.js';
import {
    openModalDropzone,
    initUploadArvore
} from './upload.js';
import {
    extractEditorMontarUrl,
    isValidEditorMontarUrl,
    linkMatchesDocumentoId
} from '../../shared/sei-editor-url.js';
import {
    atividadesApiParent,
    atividadesStateParent,
    callParentAtividades
} from './atividades-bridge.js';

export { atividadesApiParent, atividadesStateParent, callParentAtividades };

installArvoreState();

bindParentAtividadesActions({ callParentAtividades });


export function resolveArvoreMenuCatalogs(stored, defaults) {
    return resolveMenuCatalogs(stored, defaults);
}

export function readArvoreMenuConfig() {
    if (typeof localStorageRestorePro !== 'function' || typeof getOptionsPro !== 'function') {
        return null;
    }
    return readArvoreMenuConfigIO({
        restore: localStorageRestorePro,
        getOption: getOptionsPro
    });
}

export function getSelectedItensPanelArvore() {
    var defaults = { panel: [["Anota\u00E7\u00F5es"],["Marcador"],["Acompanhamento Especial"],["Tipo de Procedimento"],["Assuntos"],["Interessados"],["Atribui\u00E7\u00E3o"],["N\u00EDvel de Acesso"],["Observa\u00E7\u00F5es"]] };
    var config = null;
    try {
        config = readArvoreMenuConfig();
    } catch (e) {
        config = null;
    }
    var stored = config ? { panel: config.stored.panel } : { panel: (typeof localStorageRestorePro === 'function') ? localStorageRestorePro('configViewFlashPanelArvorePro') : undefined };
    return resolveArvoreMenuCatalogs(stored, defaults).panel;
}
try {
    selectedItensPanelArvore = getSelectedItensPanelArvore();
} catch (e) {
    selectedItensPanelArvore = false;
}

export function isSparklingModalVisible() {
    return typeof parent.$ === 'function' &&
        parent.$('#divInfraSparklingModalContent').length > 0 &&
        parent.$('#divInfraSparklingModalContent').is(':visible');
}

export function initCSSArvore() {
    // Styles live in style.css (bundled / copied). Keep a tiny fallback inject
    // only when the stylesheet was not loaded into this iframe.
    if ($('head').find('link[data-seipro-arvore-css], style[data-style="seipro-arvore"]').length > 0) return;
    if ($('head').find('style[data-style="seipro"]').length == 0) {
        $('head').prepend(
            "<style type='text/css' data-style='seipro-arvore'>" +
            templates.clipboardSuccessStyleCss() +
            "</style>"
        );
    }
}
export function initToolbarDocs(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof jmespath !== 'undefined' && typeof $().toolbar !== 'undefined') { 
        setToolbarDocs();
    } else {
        setTimeout(function(){ 
            if (TimeOut == 9000) $.getScript((parent.URL_SPRO+"js/lib/jquery.toolbar.min.js"));
            initToolbarDocs(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initToolbarDocs'); 
        }, 500);
    }
}
export function setToolbarDocs() {
    var defaults = {
        process: [['Copiar número do processo'],['Copiar link do processo'],['Enviar Documento Externo'],['Ações em lote'],['Atribuir Processo'],['Add/Remover Urgência']],
        document: [['Copiar número SEI'],['Copiar nome do documento'],['Copiar link do documento'],['Duplicar documento'],['Copiar para...']],
        tree: [['Copiar número SEI'],['Copiar link do documento'],['Duplicar documento']],
        panel: getSelectedItensPanelArvore()
    };
    var config = readArvoreMenuConfig();
    var stored = config ? config.stored : {
        process: localStorageRestorePro('configViewFlashMenuPro'),
        document: localStorageRestorePro('configViewFlashDocMenuPro'),
        tree: localStorageRestorePro('configViewFlashDocArvorePro')
    };
    var catalogs = resolveArvoreMenuCatalogs(stored, defaults);
    var selectedItensMenu = catalogs.process;
    var selectedItensDocMenu = catalogs.document;
    var selectedItensDocArvore = catalogs.tree;
        selectedItensPanelArvore = catalogs.panel;

    var htmlToolbarProc =   '<div id="toolbar-options-proc" class="hidden">';
        if (!config || config.enabled.process) {
            $.each(selectedItensMenu,function(index, value){
                var data = getTreeLinkByName(value[0], {treeModel: {links: arrayLinksArvore}});
                if ( data !== null ) {
                    var valueAlt = ( data.alt != '' ) ? data.alt : data.name;
                    var icon = data.icon == '' ? jmespath.search(iconsFlashMenu, "[?name=='"+value[0]+"'] | [0].icon") : data.icon;
                    htmlToolbarProc +=  '   <a href="#" data-action="linksArvore" style="width: 175px;"><i class="fa '+icon+'"></i><span class="info" title="'+data.name+'" alt="'+valueAlt+'">'+valueAlt+'</span></a>';
                }
            });
        }
        htmlToolbarProc +=  '   <a href="#" data-action="configMenu" style="width: 175px; background: #dedede" class="tool-item-gray"><i class="fa fa-cog" style="color: #666;"></i><span style="color: #666;" class="info" title="Personalizar Menu" alt="Personalizar Menu">Personalizar Menu</span></a>';
        htmlToolbarProc +=  '</div>';
    
    var htmlToolbarDoc =    '';
    if (!config || config.enabled.document) {
        htmlToolbarDoc =    '<div id="toolbar-options-doc" class="hidden">';
        $.each(selectedItensDocMenu,function(index, value){
            var data = (typeof jmespath !== 'undefined') ? jmespath.search(iconsFlashDocMenu, "[?name=='"+value[0]+"'] | [0]") : null;
            if ( data !== null ) {
                var valueAlt = ( data.alt != '' ) ? data.alt : data.name;
                var icon = data.icon == '' ? jmespath.search(iconsFlashMenu, "[?name=='"+value[0]+"'] | [0].icon") : data.icon;
                var show = (data.show) ? '' : 'display:none;';
                htmlToolbarDoc +=  '   <a href="#" data-action="linksArvore" style="width: 175px;'+show+'"><i class="fa '+icon+'"></i><span class="info" title="'+data.name+'" alt="'+valueAlt+'">'+valueAlt+'</span></a>';
            }
        });
        htmlToolbarDoc +=  '</div>';
    }

    if (!config || config.enabled.tree) {
        $.each(reverseArray(selectedItensDocArvore),function(index, value){
            var data = (typeof jmespath !== 'undefined') ? jmespath.search(iconsFlashDocArvore, "[?name=='"+value[0]+"'] | [0]") : null;
            if ( data !== null ) {
                var icon = data.icon == '' ? jmespath.search(iconsFlashMenu, "[?name=='"+value[0]+"'] | [0].icon") : data.icon;
                addIconActionsArvore({name: data.name, mode: data.mode, action: data.action, icon: icon, alt: data.alt});
            }
        });
    }
    
    $('#toolbar-options-doc, #toolbar-options-proc').remove();
    $('body').prepend(htmlToolbarProc+htmlToolbarDoc);
    var click = ( jmespath.search(selectedItensDocMenu, "[?[0]=='Ativar menu ao clicar'] | length(@)") > 0 ) ? true : false;
    getToolbarPro(click); 
    getTooltipOnSign();
}
export function getTooltipOnSign() {
    $('img[id*="iconA"], img[id*="iconCD"], img[id*="iconNA"]').each(function(){ 
        var title = (typeof $(this).attr('title') !== 'undefined') ? $(this).attr('title').replace(/(\r\n|\n|\r)/gm, "<br>") : false;
        if (title) $(this).attr('onmouseover', 'return infraTooltipMostrar(\''+title+'\')').attr('onmouseout', 'return infraTooltipOcultar()').removeAttr('title');
    });
}
export function getLinksPage() {
    var links = [];
    $('script').not('[src*="js"]').each(function(index, value){
        if ($(this).text().indexOf('Nos[0].acoes = ') !== -1) {
            $.each($(this).text().split('\n'), function(ind, val){
                if (val.indexOf('Nos[0].acoes = ') !== -1) {
                    var barraControle = val.trim().replace("Nos[0].acoes = '",'').slice(0,-2);
                    $('<div>'+barraControle+'</div>').find(parent.isNewSEI ? 'a[href*="controlador.php?acao="]' : 'a.botaoSEI').each(function(){ 
                        if (typeof $(this).attr('href') !== 'undefined' && $(this).attr('href') != '#') { 
                            links.push({name: $(this).find('img').attr('title'), url: $(this).attr('href')}); 
                        }
                    });
                }
            });
        }
    });
    return links;
}
export function actionToolbarPro(this_, triggerButton) {
    var button = $(triggerButton);
    var name_action = button.attr('data-action');
    var id_protocolo = this_.attr('id').replace('anchorImg', '').replace('anchor', '');      
    var doc = $('#anchor'+id_protocolo);
    var button_txt = button.find('.info').attr('title');
    var button_alt = button.find('.info').attr('alt');
    var button_clicktxt = '';
    var processo = $(`a[target="${ifrVisualizacao_}"]`).eq(0).text().trim();

    if ( name_action == 'linksArvore' ) {
        button_clicktxt = 'Abrindo...'; 
        var url = jmespath.search(getTreeLinksSession(), "[?name=='"+button_txt+"'].url | [0]");
        if ( button_txt == 'Incluir em Bloco' ) {
            parent.execIncluirEmBlocoPro();
        } else if ( button_txt == 'Concluir Processo' ||  button_txt == 'Reabrir Processo' ) {
            parent.execConcluirReabrirProcessoPro(url);
        } else if ( button_txt == 'Copiar n\u00FAmero do processo' ) {
            copyToClipboard(processo);
            button_clicktxt = 'N\u00FAmero copiado!';
        } else if ( button_txt == 'Copiar somente o n\u00FAmero' ) {
            copyToClipboard(onlyNumber(processo));
            button_clicktxt = 'N\u00FAmero copiado!';
        } else if ( button_txt == 'Copiar link do processo' ) {
            callActionsArvore(doc, 'linkproc');
            button_clicktxt = 'Link copiado!';
        } else if ( button_txt == 'Copiar n\u00FAmero SEI' ) {
            callActionsArvore(doc, 'copy');
            button_clicktxt = 'N\u00FAmero copiado!';
        } else if ( button_txt == 'A\u00E7\u00F5es em lote' ) {
            parent.getDocumentosActions();
            closeToolbarPro();
        } else if ( button_txt == 'Enviar Documento Externo' ) {
            openModalDropzone();
            closeToolbarPro();
        } else if ( button_txt == 'Copiar para...' ) {
            button_clicktxt = 'Abrindo...';
            callActionsArvore(doc, 'copyto');
        } else if ( button_txt == 'Adicionar ou Remover Urg\u00EAncia' ) {
            button_clicktxt = 'Aguarde...';
            parent.addUrgenteProcessoPro();
        } else if ( button_txt == 'Duplicar documento' ) {
            button_clicktxt = 'Duplicando...';
            callActionsArvore(doc, 'clone');
            // getDadosDoc(doc);
            // setLoadingActionDoc(id_protocolo);
        } else if ( button_txt == 'Copiar nome do documento' ) {
            button_clicktxt = 'Nome copiado!'; 
            callActionsArvore(doc, 'name');
        } else if ( button_txt == 'Copiar nome com link' ) {
            callActionsArvore(doc, 'namelink');
            button_clicktxt = 'Nome e link copiado!';
        } else if ( button_txt == 'Copiar n\u00FAmero com link' ) {
            callActionsArvore(doc, 'numberlink');
            button_clicktxt = 'Nome e link copiado!';
        } else if ( button_txt == 'Copiar link do documento' ) {
            callActionsArvore(doc, 'link');
        } else if ( button_txt == 'Imprimir Web' ) {
            callActionsArvore(doc, 'print');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Visualizar em nova aba' ) {
            callActionsArvore(doc, 'view');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Baixar documento' ) {
            callActionsArvore(doc, 'download');
            button_clicktxt = 'Baixando...';
        } else if ( button_txt == 'Consultar documento' ) {
            callActionsArvore(doc, 'doc_view');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Incluir em bloco' ) {
            callActionsArvore(doc, 'doc_bloco');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Cancelar documento' ) {
            callActionsArvore(doc, 'doc_cancelar');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Vers\u00F5es do documento' ) {
            callActionsArvore(doc, 'doc_versoes');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Gerar circular' ) {
            callActionsArvore(doc, 'doc_circular');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Assinatura externa' ) {
            callActionsArvore(doc, 'doc_assinatura_externa');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Excluir documento' ) {
            callActionsArvore(doc, 'doc_excluir');
            button_clicktxt = 'Excluindo...';
        } else if ( button_txt == 'Editar documento' ) {
            callActionsArvore(doc, 'doc_editar');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Assinar documento' ) {
            callActionsArvore(doc, 'doc_assinar');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Adicionar aos monitorados' ) {
            callActionsArvore(doc, 'doc_monitorado');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Ci\u00EAncia' ) {
            callActionsArvore(doc, 'doc_ciencia');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Enviar por e-mail' ) {
            callActionsArvore(doc, 'doc_email');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Mover p/ outro processo' ) {
            callActionsArvore(doc, 'doc_mover');
            button_clicktxt = 'Abrindo...';
        } else if ( button_txt == 'Intima\u00E7\u00E3o eletr\u00F4nica' ) {
            callActionsArvore(doc, 'doc_intimacao');
            button_clicktxt = 'Abrindo...';
        } else {
            parent.targetIfrVisualizacaoPro(url);
        }
    } else if ( name_action == 'configMenu' ) {
        button_clicktxt = 'Abrindo...';
        parent.configFlashMenuPro(arrayLinksArvore);
    }
    button.addClass('tool-item-active').find('.info').text(button_clicktxt);
    button.find('i').addClass('fa-thumbs-up');
    setTimeout(function () {
        button.removeClass('tool-item-active').find('.info').text(button_alt);
        button.find('i').removeClass('fa-thumbs-up');
        closeToolbarPro();
    }, 2000);
}
export function closeToolbarPro() {
    $('.tool-container.tool-bottom.toolbar-menu.animate-standard:visible').css({'opacity': 0, display:'none'});
    $(`.clipboard .highlight, a[target="${ifrVisualizacao_}"].highlight`).removeClass('highlight');
    $('#divMsgClipboard').hide();
}
export function checkToolbarToClose() {
    setTimeout(function () { 
        if ( $('.tool-container.tool-bottom.toolbar-menu.animate-standard:hover').length == 0 ) {
            closeToolbarPro();
        } else {
            checkToolbarToClose();
            // console.log('checkToolbarToClose');
        }
    }, 1000);
}
export function getToolbarPro(click) {
    if ( typeof parent.dadosProcessoPro !== 'undefined') {
        let elemProc = isSEI_5
            ? $('a[id*="anchor"][target="ifrVisualizacao"].infraArvoreNo')
            : $(`a[target="${ifrVisualizacao_}"]`).eq(0);
            
        const toolbarView = typeof SeiPro !== 'undefined' && SeiPro.features && SeiPro.features.arvoreUploadView && SeiPro.features.arvoreUploadView.bindArvoreToolbarProcess;
        const toolbarBinder = typeof bindArvoreToolbarProcess === 'function'
            ? bindArvoreToolbarProcess
            : toolbarView;
        if (toolbarBinder) {
            toolbarBinder({ element: elemProc, $, onAction: actionToolbarPro });
        } else {
            elemProc.toolbar({
                content: '#toolbar-options-proc',
                position: 'bottom',
                //event: 'click', hideOnClick: true,
                adjustment: 5,
                style: 'menu'
            }).on('toolbarItemClick', function( event, triggerButton ) {
                actionToolbarPro($(this), triggerButton);
            });
        }
        if (getOptionsPro('optionsFlashMenu_menudoc') != 'disabled') {
            if ($('a.clipboard').length == 0 || (parent.isNewSEI && $('a[data-toggle="popover"]').length)|| (parent.isSEI_5 && $('a[data-serialtip*="popover"]').length)) {
                $('a[id*="anchorImg"]').not('[id*="PASTA"]').not('[onclick="copiarParaClipboard(this)"]').each(function(){ $(this).addClass('clipboard') });
            }
            var listToolbar = isSEI_5
                ? $('a[id*="anchorImg"][data-serialtip]').not(':first').not('[data-toolbarpro]').get()
                : $('.clipboard').not(':first').not('[id*="PASTA"]').not('[onclick="copiarParaClipboard(this)"]').not('[data-toolbarpro]').get();

                listToolbar.forEach(function (v, i) {
                    setTimeout(function(){
                        actionToolbarDocs($(v), click);
                        $(v).attr('data-toolbarpro',true);
                    }, 50*i);
                });
        }
    }
}
export function actionToolbarDocs(_this, click) {
    _this.toolbar({
        content: '#toolbar-options-doc',
        position: 'bottom',
        event: (click ? 'click' : ''), 
        hideOnClick: (click ? true : false),
        adjustment: 5,
        style: 'menu'
    }).on('toolbarHidden', function( event ) {
        if ( $('.tool-container.tool-bottom.toolbar-menu.animate-standard:visible').length == 0 ) {
            $(event.currentTarget).removeClass('highlight');
            $(event.currentTarget).next().removeClass('highlight');
        }
    }).on('toolbarShown', function( event ) {
        $(event.currentTarget).addClass('highlight');
        $(event.currentTarget).next().addClass('highlight');
        var id_documento = $(event.currentTarget).attr('id');
            id_documento = (typeof id_documento !== 'undefined') ? parseInt(id_documento.replace('anchorImg','')) : false;
        var listLinksAll = getTreeLinksAllSession();
        var listLinks = (id_documento) ? listLinksAll.filter(function(v){ return v.indexOf('id_documento='+id_documento) !== -1 }) : [];
            setTimeout(function () { 
                var toolbar = $('.tool-container.tool-bottom.toolbar-menu.animate-standard:visible');
                if (id_documento && listLinks.length > 0 && toolbar.length > 0) {
                        updateLinksToolbar(toolbar, listLinks, id_documento, false);
                        var doc = listLinks.filter(function(v){ return (v.indexOf('acao=arvore_visualizar') !== -1 && v.indexOf('id_documento='+id_documento) !== -1) });
                        if (doc.length > 0) {
                            setTimeout(function () { 
                                if (toolbar.is(':visible') && !delayAjax) {
                                    delayAjax = true;
                                    setTimeout(function(){ delayAjax = false }, 1000);
                                    $.ajax({ url: doc[0] }).done(function (html) {
                                        var $html = $(html);
                                        var textLink = $html.filter('script').not('[src*="js"]').text();
                                        var arrayLinksArvoreDoc = getLinksInText(textLink);
                                        var arrayLinksArvoreAll = getTreeLinksAllSession();

                                        var objIndexLink = (typeof arrayLinksArvoreAll === 'undefined' || arrayLinksArvoreAll.length == 0) ? -1 : arrayLinksArvoreAll.findIndex((obj => obj == doc[0]));
                                        if (objIndexLink !== -1) {
                                            arrayLinksArvoreAll.splice(objIndexLink, 1);
                                        }

                                        $.merge(arrayLinksArvoreAll, arrayLinksArvoreDoc);
                                        if (typeof parent.syncTreeModelSession === 'function' && typeof parent.pullDadosProcessoSession === 'function') {
                                            parent.syncTreeModelSession(parent.pullDadosProcessoSession(), {
                                                linksAll: arrayLinksArvoreAll
                                            });
                                        }
                                        setTimeout(function () {
                                            updateLinksToolbar(toolbar, arrayLinksArvoreAll.filter(function(v){ return v.indexOf('id_documento='+id_documento) !== -1 }), id_documento, true);
                                            // console.log(arrayLinksArvoreAll.filter(function(v){ return v.indexOf('id_documento='+id_documento) !== -1 }));
                                        }, 300);
                                    });
                                }
                            }, 300);
                        }
                }
            }, 300);
        if (click) {
            checkToolbarToClose();
        }
        setTimeout(function () { 
            if ( $('.tool-container.tool-bottom.toolbar-menu.animate-standard:visible').length > 0 ) {
                $('.tool-container.tool-bottom.toolbar-menu.animate-standard:visible').not(':first').css({'opacity': 0, display:'none'});
                $(`.clipboard .highlight, a[target="${ifrVisualizacao_}"].highlight`).not(':first').removeClass('highlight');
            }
        }, 300);
    }).on('toolbarItemClick', function( event, triggerButton ) {
        if (typeof $(triggerButton).data('click') === 'undefined' || $(triggerButton).data('click') == false) {
            $(triggerButton).data('click', true);
            
            actionToolbarPro($(this), triggerButton);
            setTimeout(function () { 
                $(triggerButton).data('click', false);
            }, 1000);
        }
    }); 
}
export function getLinksArvorePasta(nomePasta) {
    var arrayLinksArvoreAll = getTreeLinksAllSession();
    var href = (nomePasta) ? arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('procedimento_paginar') !== -1 && v.indexOf('no_pai='+nomePasta) !== -1) }) : [];
    if (href.length > 0) {
        $.ajax({ 
            method: 'POST',
            url: href[0],
            data: {
                hdnArvore: $('#hdnArvore').val(),
                hdnPastaAtual: $('#hdnPastaAtual').val(),
                hdnProtocolos: $('#hdnProtocolos').val(),
            }
        }).done(function (html) {
            var newLinks = getLinksInText(html);
                $.merge(newLinks, arrayLinksArvoreAll);
                newLinks = uniqPro(newLinks);
                arrayLinksArvoreAll = newLinks;
                if (typeof parent.syncTreeModelSession === 'function' && typeof parent.pullDadosProcessoSession === 'function') {
                    parent.syncTreeModelSession(parent.pullDadosProcessoSession(), {
                        linksAll: arrayLinksArvoreAll
                    });
                }
        });
    }
}
export function getLinksInText(text) {
    return domainGetLinksInText(text, function(prevLink) {
        if (typeof parent.getParamsUrlPro === 'undefined' || !prevLink) return null;
        var params = parent.getParamsUrlPro(prevLink);
        return params && params.id_documento ? params.id_documento : null;
    });
}
export function updateLinksToolbar(toolbar, listLinks, id_documento, checkIconsView = false) {
    var arrayIconsView = getTreeIconsViewSession();
    var listIconsView = (checkIconsView && arrayIconsView.length > 0) ? jmespath.search(arrayIconsView, "[?id_documento==`"+id_documento+"`] | [0].icones") : null;
        listIconsView = (listIconsView === null) ? [] : listIconsView;
        
        toolbar.find('.tool-item').each(function(){
        var a = $(this);
        if (a.text() == 'Imprimir Web' && listLinks.filter(function(v){ return v.indexOf('documento_imprimir_web') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Baixar documento' && listLinks.filter(function(v){ return v.indexOf('documento_visualizar') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Visualizar em nova aba' && listLinks.filter(function(v){ return v.indexOf('documento_visualizar') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Consultar documento' && listLinks.filter(function(v){ return v.indexOf('documento_alterar') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Incluir em bloco' && listLinks.filter(function(v){ return v.indexOf('bloco_escolher') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Cancelar documento' && listLinks.filter(function(v){ return v.indexOf('documento_cancelar') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Vers\u00F5es do documento' && listLinks.filter(function(v){ return v.indexOf('documento_versao_listar') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Gerar circular' && listLinks.filter(function(v){ return v.indexOf('documento_gerar_circular') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Assinatura externa' && listLinks.filter(function(v){ return v.indexOf('assinatura_externa_gerenciar') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Excluir' && (!checkIconsView || listIconsView.filter(function(v){ return v.indexOf('protocolo_excluir') !== -1 }).length > 0) && listLinks.filter(function(v){ return v.indexOf('documento_excluir') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Excluir documento' && (!checkIconsView || listIconsView.filter(function(v){ return v.indexOf('sei_lixeira') !== -1 }).length > 0) && listLinks.filter(function(v){ return v.indexOf('documento_excluir') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Editar Conte\u00FAdo' && (!checkIconsView || listIconsView.filter(function(v){ return v.indexOf('documento_editar_conteudo') !== -1 }).length > 0) && listLinks.filter(function(v){ return v.indexOf('editor_montar') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Editar documento' && (!checkIconsView || listIconsView.filter(function(v){ return v.indexOf('sei_editar_conteudo') !== -1 }).length > 0) && listLinks.filter(function(v){ return v.indexOf('editor_montar') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Assinar documento' && (!checkIconsView || listIconsView.filter(function(v){ return (v.indexOf('sei_assinar') !== -1 || v.indexOf('documento_assinar') !== -1) }).length > 0) && listLinks.filter(function(v){ return v.indexOf('documento_assinar') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Adicionar aos monitorados' && (!checkIconsView || listIconsView.filter(function(v){ return v.indexOf('sei_documento_modelo') !== -1 }).length > 0) && listLinks.filter(function(v){ return v.indexOf('protocolo_modelo_cadastrar') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Ci\u00EAncia' && (!checkIconsView || listIconsView.filter(function(v){ return v.indexOf('sei_ciencia') !== -1 }).length > 0) && listLinks.filter(function(v){ return v.indexOf('documento_ciencia') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Enviar por e-mail' && (!checkIconsView || listIconsView.filter(function(v){ return v.indexOf('sei_email') !== -1 }).length > 0) && listLinks.filter(function(v){ return v.indexOf('email_encaminhar') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Mover p/ outro processo' && (!checkIconsView || listIconsView.filter(function(v){ return v.indexOf('sei_mover_documento') !== -1 }).length > 0) && listLinks.filter(function(v){ return v.indexOf('documento_mover') !== -1 }).length > 0 ) {
            a.show();
        } else if (a.text() == 'Intima\u00E7\u00E3o eletr\u00F4nica' && (!checkIconsView || listIconsView.filter(function(v){ return v.indexOf('intimacao_eletronica_gerar') !== -1 }).length > 0) && listLinks.filter(function(v){ return v.indexOf('md_pet_intimacao_cadastrar') !== -1 }).length > 0 ) {
            a.show();
        }

    });
}
export function getLinksArvore() {
    var linksArvore = [];
    $('script').each(function(i){
        if (typeof $(this).attr('src') === 'undefined' && $(this).html().indexOf('Nos[0].acoes') !== -1) { 
            var text = $(this).html();
            var linkDocs = $.map(text.split("'"), function(substr, i) {
               return (i % 2 && substr.indexOf('href') !== -1) ? substr : null;
            });
            $.each($(linkDocs[0]),function(index, value){
                if ( typeof $(this).attr('href') !== 'undefined' && $(value).attr('href') != '#' && $(value).attr('href') != '' ) { 
                    var name = $(value).find('img').attr('title');
                    var url = $(value).attr('href');
                    var action = '';
                    var data = ( typeof jmespath !== 'undefined' ) ? jmespath.search(parent.iconsFlashMenu, "[?name=='"+name+"'] | [0]") : null;
                        data = ( data === null ) ? {name: name, icon: '', alt: ''} : data;

                    linksArvore.push({ url: url, name: data.name, icon: data.icon, alt: data.alt}); 
                }
            });
            if ( typeof parent.dadosProcessoPro !== 'undefined' && typeof parent.dadosProcessoPro.listLinks !== 'undefined' && parent.dadosProcessoPro.listLinks.length > 0 ) {
                $.each(parent.dadosProcessoPro.listLinks,function(index, value){
                    linksArvore.push(value);
                });
            }
            $.each(text.split('\n'), function(ind, val){
                if (val.indexOf("].acoes = '") !== -1) {
                    var arrayIconsAcoes = [];
                    if (val.indexOf('"') !== -1) {
                        var id_documento = (val.indexOf('id_documento') !== -1) ? val.match(/id_documento=([^&]*)/)[1] : false;
                        if (id_documento) {
                            val.split('"').filter(function(i){ return i.indexOf(parent.isNewSEI ? 'svg/' :  'imagens/') !== -1}).map(function(j){
                                arrayIconsAcoes.push(j);
                            });
                            arrayIconsView.push({id_documento: parseInt(id_documento), icones: arrayIconsAcoes});
                        }
                    }
                }
            });
        }
    });
    var textLink = $('script').not('[src*="js"]').text();
    arrayLinksArvoreAll = getLinksInText(textLink);

    if ( typeof parent.iconsFlashMenu !== 'undefined' ) {
        linksArvore.push(parent.iconsFlashMenu[0]); 
        linksArvore.push(parent.iconsFlashMenu[1]); 
        linksArvore.push(parent.iconsFlashMenu[2]); 
        if (parent.checkConfigValue('uploaddocsexternos')) {
            linksArvore.push(parent.iconsFlashMenu[3]); 
        }
        if (parent.checkConfigValue('acoesemlote')) {
            linksArvore.push(parent.iconsFlashMenu[4]); 
        }
        linksArvore.push(parent.iconsFlashMenu[5]); 
    }
    return linksArvore;
}
export function initChangeUrl() {
    $(`a[target="${ifrVisualizacao_}"]`).unbind('click').click(function (e) {
        //e.preventDefault();
        var params_url = getParamsUrlPro($(this).attr('href'));
        var id_procedimento = params_url.id_procedimento;
        var id_documento = params_url.id_documento;
        var linkDoc = url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento;
            linkDoc = ( typeof id_documento !== 'undefined' ) ? linkDoc+'&id_documento='+id_documento : linkDoc;
        if (typeof id_procedimento !== 'undefined') { 
            parent.window.history.pushState({id_procedimento: id_procedimento, id_documento: id_documento}, '', linkDoc); 
            parent.iHistoryArray.push({id: iHistory, link: linkDoc});
            iHistory++;
        }
    });
}
export function addIconActionsArvore(param) {
    $(containerUpload).find('.action-'+param.mode).remove();
    $(containerUpload).find(`a[target="${ifrVisualizacao_}"]`).each(function(){
        var name = (param.alt == '') ? param.name : param.alt;
        var id_documento = getParamsUrlPro($(this).attr('href')).id_documento;  
        id_documento = (typeof id_documento !== 'undefined') ? id_documento : $(this).attr('id').replace('anchor', '');
        id_documento = (typeof id_documento !== 'undefined') ? id_documento : false;
        var iconDoc = (id_documento && $('#icon'+id_documento).attr('src').indexOf('documento_interno') !== -1) ? true : false;
        var arrayLinksPage = getTreePageLinksSession();
        var newDocLink = getTreeLinkUrlByName('Incluir Documento', null, true);
        var checkThisDocumento = id_documento ? !seiProArvore.isProcessNode(document.getElementById('anchorImg'+id_documento)) : true;
        if (
                (
                    checkThisDocumento && id_documento && param.mode != 'clone' && typeof $(this).attr('href') !== 'undefined' &&
                    (
                        $(this).attr('href').indexOf('acao=arvore_visualizar&acao_origem=procedimento_visualizar&id_procedimento=') !== -1 ||
                        $(this).attr('href') == 'about:blank'
                    )
                ) || 
                (checkThisDocumento && id_documento && iconDoc && param.mode == 'clone' && newDocLink != null && newDocLink != '')
            ) {
            var html =  '<span class="action-doc action-'+param.mode+'" data-id="'+id_documento+'" data-action="'+param.mode+'" data-title="'+param.name+'" onclick="getActionsArvore(this)" onmouseover="return infraTooltipMostrar(\''+name+'\');" onmouseout="return infraTooltipOcultar();">'+
                        '   <i class="'+param.icon+'" style="color: #017fff9c; font-size: 10pt;"></i>'+
                        '</span>';
            $(this).after(html);
        }
    });
}    
export function getActionsArvore(this_) {
    var _this = $(this_);
    var doc = _this.prevAll(`a[target="${ifrVisualizacao_}"]`).eq(0);
    var mode = _this.data('action');
        _this.data('class',_this.find('i').attr('class'));
        _this.find('i').attr('class', 'far fa-thumbs-up azulColor');
        $('#divInfraTooltip .infraTooltipTexto').text('Copiado para a \u00E1rea de transfer\u00EAncia');
        callActionsArvore(doc, mode);
        setTimeout(function () { 
            _this.find('i').attr('class', _this.data('class'));
            $('#divInfraTooltip .infraTooltipTexto').text(_this.data('title'));
        }, 1000);
}
export function callActionsArvore(doc, mode) {
    var nameDoc = doc.text().trim();
    var nr_sei = getNrSei(nameDoc);
    var documento = parent.getNomeSei(nameDoc);
    var citacaoDoc = getCitacaoDoc();
    var id_documento = doc.attr('id').replace('anchor','');
    var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
    var linkDoc = parent.url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento+'&id_documento='+id_documento;
    var linkProc = parent.url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento;
    var arrayLinksArvoreAll = getTreeLinksAllSession();
    if (mode == 'clone') {
        setLoadingActionDoc(id_documento); 
        window.doc_callActionsArvore = doc
        if (nameDoc.toLowerCase().indexOf('minuta') !== -1) {
            nameDoc = nameDoc.replace(/[-\s]?\bminuta\b/gi, '').trim();
            parent.confirmaBoxPro(
                'Deseja duplicar o documento sem a denomina\u00E7\u00E3o MINUTA?', 
                () => getDadosDoc(window.doc_callActionsArvore, false, true, false, false, true), 
                'Remova a denomina\u00E7\u00E3o MINUTA', 
                () => getDadosDoc(window.doc_callActionsArvore), 
                'Mantenha MINUTA'
            );
        } else {
            getDadosDoc(doc);
        }
    } else if (mode == 'copyto') {
        parent.dialogCopyNewDoc(doc);
    } else if (mode == 'copy') {
        copyToClipboard(nr_sei);
    } else if (mode == 'name') {
        if (getConfigValue('citacaodoc') == 'citacaodoc_4') {
            copyToClipboard(nr_sei);
        } else {
            copyToClipboard(documento+' ('+citacaoDoc+nr_sei+')');
        }
    } else if (mode == 'namelink') {
        if (getConfigValue('citacaodoc') == 'citacaodoc_4') {
            copyToClipboardHTML('<a href="'+linkDoc+'" target="_blank">'+nr_sei+'</a>');
        } else {
            copyToClipboardHTML(documento+' ('+citacaoDoc+'<a href="'+linkDoc+'" target="_blank">'+nr_sei+'</a>)');
        }
    } else if (mode == 'numberlink') {
        copyToClipboardHTML('<a href="'+linkDoc+'" target="_blank">'+nr_sei+'</a>');
    } else if (mode == 'linkproc') {
        copyToClipboard(linkProc);
    } else if (mode == 'print') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('documento_imprimir_web') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.openLinkNewTab(url_host.replace('controlador.php','')+link[0]);
        }
    } else if (mode == 'view') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('documento_visualizar') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.openLinkNewTab(url_host.replace('controlador.php','')+link[0]);
        }
    } else if (mode == 'download') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('documento_visualizar') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            var urlLink = link[0];
            var alink = document.createElement('a');
                alink.href = urlLink;
                if (urlLink.indexOf('documento_download_anexo') === -1) {
                    alink.download =  $('#anchor'+id_documento).text().trim()+'.html';
                } else {
                    alink.download =  $('#anchor'+id_documento).text().trim();
                }
                    document.body.appendChild(alink);
                    alink.click();
                    document.body.removeChild(alink);
        }
    } else if (mode == 'doc_view') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('documento_alterar') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.document.getElementById(ifrVisualizacao_).setAttribute("src",link[0]);
        }
    } else if (mode == 'doc_bloco') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('bloco_escolher') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.document.getElementById(ifrVisualizacao_).setAttribute("src",link[0]);
        }
    } else if (mode == 'doc_cancelar') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('documento_cancelar') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.document.getElementById(ifrVisualizacao_).setAttribute("src",link[0]);
        }
    } else if (mode == 'doc_versoes') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('documento_versao_listar') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.document.getElementById(ifrVisualizacao_).setAttribute("src",link[0]);
        }
    } else if (mode == 'doc_circular') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('documento_gerar_circular') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.document.getElementById(ifrVisualizacao_).setAttribute("src",link[0]);
        }
    } else if (mode == 'doc_assinatura_externa') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('assinatura_externa_gerenciar') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.document.getElementById(ifrVisualizacao_).setAttribute("src",link[0]);
        }
    } else if (mode == 'doc_excluir') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('documento_excluir') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.document.getElementById(ifrVisualizacao_).setAttribute("src",link[0]);
        }
    } else if (mode == 'doc_editar') {
        var linkFromViz = null;
        try {
            var vizFrame = parent.document.getElementById('ifrConteudoVisualizacao')
                || parent.document.getElementById('ifrVisualizacao');
            var vizWin = vizFrame && vizFrame.contentWindow;
            if (vizWin && typeof vizWin.linkEditarConteudo === 'string'
                && isValidEditorMontarUrl(vizWin.linkEditarConteudo)
                && linkMatchesDocumentoId(vizWin.linkEditarConteudo, id_documento)) {
                linkFromViz = vizWin.linkEditarConteudo;
            }
        } catch (e) { /* noop */ }
        var link = linkFromViz
            ? [linkFromViz]
            : arrayLinksArvoreAll.filter(function(v){
                return linkMatchesDocumentoId(v, id_documento) && v.indexOf('editor_montar') !== -1;
            });
        if (link.length > 0 && isValidEditorMontarUrl(link[0])) {
            parent.openLinkNewTab(url_host.replace('controlador.php','')+link[0]);
        } else if (typeof parent.alertaBoxPro === 'function') {
            parent.alertaBoxPro('Error', 'exclamation-triangle', 'N\u00E3o foi poss\u00EDvel abrir o editor: documento sem identifica\u00E7\u00E3o.');
        }
    } else if (mode == 'doc_assinar') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('documento_assinar') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.openLinkNewTab(url_host.replace('controlador.php','')+link[0]);
        }
    } else if (mode == 'doc_monitorado') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('protocolo_modelo_cadastrar') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.document.getElementById(ifrVisualizacao_).setAttribute("src",link[0]);
        }
    } else if (mode == 'doc_ciencia') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('documento_ciencia') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.document.getElementById(ifrVisualizacao_).setAttribute("src",link[0]);
        }
    } else if (mode == 'doc_email') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('email_encaminhar') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.openLinkNewTab(url_host.replace('controlador.php','')+link[0]);
        }
    } else if (mode == 'doc_mover') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('documento_mover') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.document.getElementById(ifrVisualizacao_).setAttribute("src",link[0]);
        }
    } else if (mode == 'doc_intimacao') {
        var link = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('md_pet_intimacao_cadastrar') !== -1) });
        if (link.length > 0 && link[0] !== '') {
            parent.document.getElementById(ifrVisualizacao_).setAttribute("src",link[0]);
        }
    } else if (mode == 'link') {
        copyToClipboard(linkDoc);
    }
    // console.log('copyToClipboard', {id_documento: id_documento, mode: mode, nameDoc: nameDoc, nr_sei: nr_sei, documento: documento});
    // console.log(mode, doc.text(), nr_sei);
}
export function getDadosDoc(doc, newproc = false, openEditor = true, callback = false, callback_error = false, removeMinuta = false) {    
    var paraUrl = getParamsUrlPro(doc.attr('href'));
    var nameDoc = doc.text().trim();
        nameDoc = removeMinuta ? nameDoc.replace(/[-\s]?\bminuta\b/gi, '').trim() : nameDoc;
    var hrefConsulta = false;
    $('script').not('[src*="js"]').each(function(index, value){
        if ($(this).text().indexOf('var objArvore = null;') !== -1) {
            $.each($(this).text().split('\n'), function(ind, val){
                var linkConsultar = 'controlador.php?acao=documento_consultar&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar&id_procedimento='+paraUrl.id_procedimento+'&id_documento='+paraUrl.id_documento;
                var linkAlterar = 'controlador.php?acao=documento_alterar&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar&id_procedimento='+paraUrl.id_procedimento+'&id_documento='+paraUrl.id_documento;
                if (val.indexOf(linkConsultar) !== -1 || val.indexOf(linkAlterar) !== -1) {
                    hrefConsulta = $.map(val.split('"'),function(v){ if (v.indexOf(linkConsultar) !== -1 || v.indexOf(linkAlterar) !== -1) { return v } })[0];
                }
            });
        }
    });
    // console.log(hrefConsulta);
    if (!delayAjax) {
        delayAjax = true;
        setTimeout(function(){ delayAjax = false }, 1000);
        if (hrefConsulta) {
            $.ajax({ url: hrefConsulta }).done(function (html) {
                var $htmlConsulta = $(html);
                var paramDoc = {};
                    paramDoc['selAssuntos'] = $htmlConsulta.find('#selAssuntos option').map(function(){ return $(this).val() }).get();
                    paramDoc['hdnAssuntos'] = ($htmlConsulta.find('#selAssuntos option').length == 0) ? [] : $htmlConsulta.find('#selAssuntos option').map(function(){ return $(this).val()+'\u00B1'+$(this).text() }).get().join('\u00A5').replaceAll(' ','+');
                    paramDoc['hdnAssuntos'] = (paramDoc['hdnAssuntos'].length == 0) ? [] : encodeURIComponent(paramDoc['hdnAssuntos']).replaceAll('%C2','').replaceAll('%2B','+');
                    paramDoc['hdnAssuntos'] = (paramDoc['hdnAssuntos'].length == 0) ? '' : paramDoc['hdnAssuntos'];
                    paramDoc['selInteressados'] = $htmlConsulta.find('#selInteressados option').map(function(){ return $(this).val() }).get();
                    paramDoc['hdnInteressados'] = $htmlConsulta.find('#selInteressados option').map(function(){ return $(this).val()+'\u00B1'+$(this).text() }).get().join('\u00A5').replaceAll(' ','+');
                    paramDoc['hdnInteressados'] = encodeURIComponent(paramDoc['hdnInteressados']).replaceAll('%C2','').replaceAll('%2B','+');
                    paramDoc['hdnInteressados'] = (paramDoc['selInteressados'].length == 0) ? '' : paramDoc['hdnInteressados'];
                    paramDoc['txtNumero'] = $htmlConsulta.find('#txtNumero').val();
                    paramDoc['txtDescricao'] = $htmlConsulta.find('#txtDescricao').val();
                    paramDoc['txaObservacoes'] = $htmlConsulta.find('#txaObservacoes').val();
                    paramDoc['rdoNivelAcesso'] = $htmlConsulta.find('input[name="rdoNivelAcesso"]:checked').val();
                    paramDoc['selHipoteseLegal'] = $htmlConsulta.find('#selHipoteseLegal').val();
                    paramDoc['urlHipoteseLegal'] = parent.getUrlHipoteseLegal(html);
                // console.log(nameDoc, paraUrl.id_documento, paramDoc);
                getDuplicateDoc(nameDoc, paramDoc, newproc, openEditor, callback, callback_error);
            }).fail(function(data){
                getDuplicateDoc(nameDoc, false, newproc, openEditor, callback, callback_error);
            })
        } else {
            getDuplicateDoc(nameDoc, false, newproc, openEditor, callback, callback_error);
        }
    }
}
export function getDuplicateDoc(nameDoc = false, paramDoc = false, newproc = false, openEditor = true, callback = false, callback_error = false) {
    // console.log('getDuplicateDoc', nameDoc, paramDoc, newproc);
    if (newproc) {
        var arrayCurrentCloneDoc = {
            nameDoc: nameDoc, 
            paramDoc: (typeof paramDoc !== 'undefined' ? paramDoc : false) 
        };
        setOptionsPro('currentCloneDoc', arrayCurrentCloneDoc);
        parent.loadingButtonConfirm(false);
        parent.resetDialogBoxPro('dialogBoxPro');

        var newPage = url_host+'?acao=procedimento_trabalhar&id_procedimento='+newproc+'#&acao_pro=duplicar_documento';
        var win = window.open(newPage, '_blank');
        if (win) {
            win.focus();
        } else {
            alert('Por favor, permita popups para essa p\u00E1gina');
        } 
        // console.log('getDuplicateDoc === true', nameDoc, paramDoc, arrayCurrentCloneDoc, newproc);
    } else {
        if (nameDoc && nameDoc != '') {
            var itemSelected = false;
            var nr_sei = getNrSei(nameDoc);
            var href = parent.jmespath.search(getTreeLinksSession(), "[?name=='Incluir Documento'].url | [0]");
            // console.log('getDuplicateDoc === else', nameDoc, nr_sei, href, arrayLinksArvore);
            if (href !== null) {
                $.ajax({ url: href }).done(function (html) {
                    let $html = $(html);
                    $html.find('#tblSeries tbody tr').each(function (v) {
                        var text = $(this).data('desc').trim();
                        var value = $(this).find('input').val();
                        var urlDoc = $(this).find('a.ancoraOpcao').attr('href');
                        var checkPost = $html.find('#tblSeries').find('a.ancoraOpcao').attr('href');
                            checkPost = typeof checkPost !== 'undefined' && checkPost == '#' ? true : false;
                        if (text != '') {
                            var nameOption = escapeRegExp(text.replace(/_|:/g, ' '));
                                nameDoc = nameDoc.replace(/_|:/g, ' ');
                            var reg = new RegExp('^\\b'+nameOption, "igm");
                            if (reg.test(parent.removeAcentos(nameDoc.trim().toLowerCase()))) { 
                                if (typeof urlDoc !== 'undefined' && text != 'externo') {
                                    itemSelected = true;
                                    // console.log('checkPost', checkPost, urlDoc, text, value);
                                    if (checkPost) {
                                        ajaxPostDuplicateArvore($html, value, nr_sei, paramDoc, openEditor, callback, callback_error);
                                    } else {
                                        ajaxGetDuplicateArvore(urlDoc, nr_sei, paramDoc, openEditor, callback, callback_error);
                                    }
                                }
                                return false;
                            }
                        }
                    });
                    if (!itemSelected) { 
                        openAlertDuplicateDoc('Erro ao selecionar o tipo de documento');
                    }
                });
            } else {
                if (!itemSelected) { 
                    openAlertDuplicateDoc('Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!');
                }
            }
        } else {
            if (!itemSelected) { 
                openAlertDuplicateDoc('Erro ao encontrar o documento de modelo');
            }
        }
    }
}
export function ajaxPostDuplicateArvore($html, value, nr_sei, paramDoc, openEditor, callback, callback_error) {
    var urlForm = $html.find('#frmDocumentoEscolherTipo').attr('action');
    var param = {};
        $html.find('#frmDocumentoEscolherTipo').find("input[type=hidden]").map(function () {
            if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                param[$(this).attr('name')] = $(this).val(); 
            }
        });
        param.hdnIdSerie = value;
    $.ajax({ 
        method: 'POST',
        data: param,
        url: urlForm
    }).done(function (htmlDoc) {
        saveDuplicateArvore(htmlDoc, nr_sei, paramDoc, openEditor, callback, callback_error);
    });
}
export function ajaxGetDuplicateArvore(urlDoc, nr_sei, paramDoc, openEditor, callback, callback_error) {
    $.ajax({ url: urlDoc }).done(function (htmlDoc) {
        saveDuplicateArvore(htmlDoc, nr_sei, paramDoc, openEditor, callback, callback_error);
    });
}
export function saveDuplicateArvore(htmlDoc, nr_sei, paramDoc, openEditor, callback, callback_error) {
    var $htmlDoc = $(htmlDoc);
    var form = $htmlDoc.find('#frmDocumentoCadastro');
    var hrefForm = form.attr('action');
    var param = {};
        form.find("input[type=hidden]").each(function () {
            if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                param[$(this).attr('name')] = $(this).val(); 
            }
        });
        form.find('input[type=text]').each(function () { 
            if ( $(this).attr('id') && $(this).attr('id').indexOf('txt') !== -1) {
                param[$(this).attr('id')] = $(this).val();
            }
        });
        form.find('select').each(function () { 
            if ( $(this).attr('id') && $(this).attr('id').indexOf('sel') !== -1) {
                param[$(this).attr('id')] = $(this).val();
            }
        });
        form.find('input[type=radio]').each(function () { 
            if ( $(this).attr('name') && $(this).attr('name').indexOf('rdo') !== -1) {
                param[$(this).attr('name')] = $(this).val();
            }
        });
    param.selTextoPadrao = "0";
    param.hdnFlagDocumentoCadastro = "2";
    param.rdoTextoInicial = "D";
    param.selTextoPadrao = null;
    param.txtProtocoloDocumentoTextoBase = nr_sei;
    param.selAssuntos = (paramDoc && typeof paramDoc.selAssuntos !== 'undefined') ? paramDoc.selAssuntos : param.selAssuntos;
    param.hdnAssuntos = (paramDoc && typeof paramDoc.hdnAssuntos !== 'undefined') ? paramDoc.hdnAssuntos : param.hdnAssuntos;
    param.selInteressados = (paramDoc && typeof paramDoc.selInteressados !== 'undefined') ? paramDoc.selInteressados : param.selInteressados;
    param.hdnInteressados = (paramDoc && typeof paramDoc.hdnInteressados !== 'undefined') ? paramDoc.hdnInteressados : param.hdnInteressados;
    param.txtNumero = (paramDoc && typeof paramDoc.txtNumero !== 'undefined' && !parent.isNumeric(paramDoc.txtNumero)) ? paramDoc.txtNumero : param.txtNumero;
    param.txtDescricao = (paramDoc && typeof paramDoc.txtDescricao !== 'undefined') ? paramDoc.txtDescricao : param.txtDescricao;
    param.txaObservacoes = (paramDoc && typeof paramDoc.txaObservacoes !== 'undefined') ? paramDoc.txaObservacoes : "";
    param.rdoNivelAcesso = (paramDoc && typeof paramDoc.rdoNivelAcesso !== 'undefined') ? paramDoc.rdoNivelAcesso : param.rdoNivelAcesso;
    param.selHipoteseLegal = (paramDoc && typeof paramDoc.selHipoteseLegal !== 'undefined') ? paramDoc.selHipoteseLegal : param.selHipoteseLegal;
    // console.log({nr_sei: nr_sei, value: value, url: urlDoc, param: param});
    var postData = '';
    for (var k in param) {
        if (postData !== '') postData = postData + '&';
        var valor = (k=='hdnAssuntos') ? param[k] : escapeComponent(param[k]);
            valor = (k=='hdnInteressados') ? param[k] : valor;
            valor = (k=='txtDescricao') ? parent.encodeURI_toHex(param[k].normalize('NFC')) : valor;
            valor = (k=='txtNumero') ? escapeComponent(param[k]) : valor;
            postData = postData + k + '=' + valor;
    }
    // console.log(postData);

    var xhr = new XMLHttpRequest();
    $.ajax({
        method: 'POST',
        // data: param,
        data: postData,
        url: hrefForm,
        contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1',
        xhr: function() {
            return xhr;
        },
    }).done(function (htmlResult) {
        // console.log('htmlResult', htmlResult);
        var status = (xhr.responseURL.indexOf('controlador.php?acao=arvore_visualizar&acao_origem=documento_gerar') !== -1) ? true : false;
        var class_icon = '';
        var text_icon = '';
        if (status) {
            // console.log(status);
            class_icon = 'fas fa-check verdeColor';
            text_icon = 'Documento duplicado com sucesso!';
            var $htmlResult = $(htmlResult);
            var urlEditor = [];
            var idUser = false;
            $.each($htmlResult.text().split('\n'), function(i, v){
                if (v.indexOf("var linkMontarArvoreProcessoDocumento") !== -1) {
                    urlReload = v.split("'")[1];
                }
                if (v.indexOf("atualizarArvore('") !== -1) {
                    urlReload = v.split("'")[1];
                }
                if (v.indexOf("acao=editor_montar") !== -1) {
                    var editorUrlLine = extractEditorMontarUrl(v);
                    if (editorUrlLine) urlEditor.push(editorUrlLine);
                }
                if (v.indexOf("iniciarEditor(") !== -1) {
                    idUser = v.split("'")[1];
                }
                if (v.indexOf("janelaEditor_") !== -1) {
                    idUser = v.split("_")[1];
                }
            });
            if (!urlEditor.length) {
                var editorUrlHtml = extractEditorMontarUrl(htmlResult);
                if (editorUrlHtml) urlEditor.push(editorUrlHtml);
            }
            if (urlEditor.length > 0 && idUser && openEditor) {
                parent.openWindowEditor(urlEditor[0], idUser);
            }
            if (openEditor) {
                if (urlReload) {
                    window.location.href = urlReload;
                } else {
                    window.location.reload();
                }
            }
            if (typeof callback === 'function') callback();
        } else {
            class_icon = 'fas fa-exclamation-circle vermelhoColor';
            text_icon = 'Erro ao duplicar o documento';
            if (typeof callback_error === 'function') callback_error();
        }
        if (class_icon != '') {
            $(containerUpload).find('.loading-action-doc').attr('onmouseover','return infraTooltipMostrar(\''+text_icon+'\');').attr('onmouseout', 'return infraTooltipOcultar();').find('i').attr('class', class_icon);
        }
    });
}
export function openAlertDuplicateDoc(textAlert) {
    if ($(containerUpload).find('.loading-action-doc').length > 0) {
        $(containerUpload).find('.loading-action-doc').attr('onmouseover','return infraTooltipMostrar(\''+textAlert+'\');').attr('onmouseout', 'return infraTooltipOcultar();').find('i').attr('class', 'fas fa-exclamation-circle vermelhoColor') 
    } else {
        parent.alertaBoxPro('Error', 'exclamation-triangle', textAlert);
    }
}
export function setLoadingActionDoc(id_documento) {
    var html = templates.loadingActionDocHtml(id_documento);
    $(containerUpload).find('.loading-action-doc').remove();
    $('#anchor'+id_documento).before(html);
}
export {
    sticknoteUpdate,
    sticknoteRemove,
    sticknoteRemoveConfirm,
    sticknoteRemoveCancel,
    sticknoteSave_,
    sticknoteSave,
    sticknoteCancel,
    sticknoteEdit,
    sticknoteSaveDate,
    sticknoteSetDateKey,
    sticknoteSetDate,
    getSticknoteUser,
    sticknoteDates,
    sticknotePriority,
    sticknotePresetRankIconHtml,
    sticknoteQuickPreset,
    removeFormatting,
    checkLimitTextArvore,
    formatDadosAnotacao,
    setDadosAnotacao,
    sticknotePosition,
    sticknoteCheck,
    sticknoteToggleCheck,
    setStickNoteCheck,
    getUrlAnotacaoArvore,
    getDadosAnotacao,
    togglePanelDadosArvore
} from './sticknote-view.js';

export function getDadosInteressadosArvore(this_) {
    var _this = $(this_);
    var data = _this.data();
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    var hrefConsulta = $((parent.isNewSEI ? '#infraMenu' : '#main-menu')+' a[href*="protocolo_pesquisar"]', parent.document.body).attr('href');
    if (hrefConsulta) {
        _this.find('i.iconInteressadosProcesso').toggleClass('fa-folder-open fa-spinner').addClass('fa-spin');
        $('#frmCheckerProcessoPro').attr('src', hrefConsulta).unbind().on('load', function(){
            var iframe = $(this).contents();
                iframe.find('#hdnIdContato').val(data.interessado);
                iframe.find('#optProcessos').prop('checked',true);
                if (data.mesmaNatureza) {
                    iframe.find('#selTipoProcedimentoPesquisa').val(data.tipoProcedimento);
                }
                iframe.find('#chkSinTramitacao').prop('checked', data.tramiteUnidade);
                // console.log({interessado: data.interessado, natureza: data.mesmaNatureza, tipo: data.tipoProcedimento, tramite: data.tramiteUnidade});
                $(this).unbind().on('load', function(){
                    $(this).unbind();
                    _this.find('i.iconInteressadosProcesso').toggleClass('fa-folder-open fa-spinner').removeClass('fa-spin');
                    var iframeResult = $(this).contents();
                    var conteudo = iframeResult.find('#conteudo');
                    var count = conteudo.find('.barra').text().trim();
                    var result = [];
                        conteudo.find(isNewSEI ? 'table.pesquisaResultado tr' : 'table.resultado').each(function(i){
                            var tr = isNewSEI ? $(this) : $(this).find('tr');
                            var urlArvore = isNewSEI ? tr.find('a.protocoloNormal').attr('href') : tr.eq(0).find('a.arvore').attr('href');
                            var paramsUrl = (typeof urlArvore !== 'undefined') ? getParamsUrlPro(url_host.replace('controlador.php','')+urlArvore) : false;
                            var urlTable = (paramsUrl) ? url_host+'?acao=procedimento_trabalhar&id_procedimento='+paramsUrl.id_procedimento+(typeof paramsUrl.id_documento !== 'undefined' ? '&id_documento='+paramsUrl.id_documento : '') : false;
                            if (isNewSEI && i % 3 == 0) {
                                var nomeProcesso = (urlTable) ? '<a href="'+urlTable+'" target="_blank">'+tr.find('td.pesquisaTituloEsquerda span').text().replace('N\u00BA', '').trim()+'</a>' : tr.find('td.pesquisaTituloEsquerda span').text().replace('N\u00BA', '').trim();
                                var unidadeElem = tr.next().next().find('td.pesquisaMetatag').eq(0).find('a');
                                var usuarioElem = tr.next().next().find('td.pesquisaMetatag').eq(1).find('a');
                                var param = {
                                    title: nomeProcesso,
                                    url_proc: urlTable,
                                    unidade: {sigla: unidadeElem.text(), nome: unidadeElem.attr('title')},
                                    usuario: {login: usuarioElem.text(), nome: usuarioElem.attr('title')},
                                    data: tr.next().next().find('td.pesquisaMetatag').eq(2).text().replace('Inclus\u00E3o:', '').trim()
                                };
                                result.push(param);
                            } else if (!isNewSEI) {
                                var _this = $(this);
                                var unidadeElem = _this.find('.metatag table td').eq(0).find('a');
                                var usuarioElem = _this.find('.metatag table td').eq(1).find('a');
                                var param = {
                                    title: _this.find('.resTituloEsquerda').text(),
                                    url_proc: _this.find('.resTituloEsquerda a').eq(0).attr('href'),
                                    unidade: {sigla: unidadeElem.text(), nome: unidadeElem.attr('title')},
                                    usuario: {login: usuarioElem.text(), nome: usuarioElem.attr('title')},
                                    data: _this.find('.metatag table td').eq(2).text()
                                };
                                result.push(param);
                            }
                        });
                        var htmlResult =    '<div class="options_interessado">'+
                                            '   <a class="newLink" data-type="tramiteUnidade" onclick="optionSearchInteressado(this)">'+
                                            '       <i class="'+(data.tramiteUnidade ? 'fas fa-check-square' : 'far fa-square')+' cinzaColor"></i>'+
                                            '       Tramitado na Unidade'+
                                            '   </a>'+
                                            '   <a class="newLink" data-type="mesmaNatureza" onclick="optionSearchInteressado(this)">'+
                                            '       <i class="far '+(data.mesmaNatureza ? 'fas fa-check-square' : 'far fa-square')+' cinzaColor"></i>'+
                                            '       De mesma natureza'+
                                            '       </a>'+
                                            '</div>'+
                                            (count == '' ? '<div class="notfound_interessado"><i class="fas fa-exclamation-circle vermelhoColor"></i> Nenhum resultado encontrado</div>' : '<div class="count_interessado">'+count+'</div>');
                        $.each(result, function(index, value){
                            htmlResult +=   '<div class="proc_interessado">'+
                                            '   <a class="newLink" href="'+value.url_proc+'" target="_blank">'+
                                            '       <i class="fas fa-folder-open cinzaColor"></i>'+
                                            '       '+value.title+
                                            '   <i class="fas fa-external-link-alt" style="font-size: 90%; text-decoration: underline;"></i>'+
                                            '   </a>'+
                                            '   <div style="margin-bottom: 8px;">'+
                                            '       <span style="color:#666666;">'+
                                            '           <i class="fas fa-briefcase cinzaColor"></i>'+
                                            '           '+value.unidade.nome+' ('+value.unidade.sigla+')'+
                                            '       </span>'+
                                            '   </div>'+
                                            '   <div>'+
                                            '       <span style="color:#666666;">'+
                                            '           <i class="fas fa-user cinzaColor"></i>'+
                                            '           '+value.usuario.nome+' ('+value.usuario.login+')'+
                                            '       </span>'+
                                            '       <span style="color:#666666; float: right;">'+
                                            '           <i class="fas fa-calendar cinzaColor"></i>'+
                                            '           '+value.data+
                                            '       </span>'+
                                            '   </div>'+
                                            '</div>';
                        })
                        _this.closest('.dadosInteressados').find('.dadosInteressados_result').html(htmlResult).show();
                        // console.log(count, result);
                });
                iframe.find('#sbmPesquisar').trigger('click');
        });
    }
}
export function optionSearchInteressado(this_) {
    var _this = $(this_);
    var data = _this.data();
    var _parent = _this.closest('.dadosInteressados');
    var checkbox = _this.find('i').hasClass('fa-check-square') ? false : true;
    // console.log('checkbox',checkbox);
    if (data.type == 'tramiteUnidade') {
        _parent.find('a.interessadosProcesso').data('tramite-unidade',checkbox).trigger('click');
        setOptionsPro('panelDadosArvoreInteressados_tramiteUnidade', checkbox);
    } else if (data.type == 'mesmaNatureza') {
        _parent.find('a.interessadosProcesso').data('mesma-natureza',checkbox).trigger('click');
        setOptionsPro('panelDadosArvoreInteressados_mesmaNatureza', checkbox);
    }
    _this.find('i').toggleClass('fa-check-square fa-square');
}
export function initAtividadesProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (isSparklingModalVisible()) {
        setTimeout(function(){ 
            initAtividadesProcesso(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initAtividadesProcesso => '+TimeOut); 
        }, 500);
        return;
    }
    if (
        typeof atividadesStateParent().arrayConfigAtividades !== 'undefined' &&
        typeof atividadesStateParent().arrayConfigAtividades.perfil !== 'undefined'
    ) {
        if (parent.checkConfigValue('gerenciaratividades')) { 
            setAtividadesProcesso();
        }
    } else {
        setTimeout(function(){ 
            if (TimeOut == 9000) { callParentAtividades('getAtividades'); }
            initAtividadesProcesso(TimeOut - 100); 
        }, 500);
    }
}
export function setAtividadesProcesso() {
    var htmlAtividades = getAtividadesProcessoArvore();
    $('.panelDadosArvore_atividades').remove();
    $('.panelDadosArvore').eq(0).before(htmlAtividades);

    if (htmlAtividades != '') {
        $('.kanban-item .checklist_progress').each(function(){
            $(this).progressbar({
                value: $(this).data('valuenow'),
                max: $(this).data('max')
            });
        });
    }
}
export function filterTagKanbanArvore(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.panelDadosArvore_atividades');
    var head = _parent.find('.panelArvoreHead');
    var data = _this.data();
    var tagName = (typeof data.tagname !== 'undefined' && data.tagname !== null && data.tagname !== '') ? data.tagname : false;
    var htmlFilter = '';
        _parent.find('#filterTagKanban').remove();
    if (tagName) {
        _parent.find('.kanban-item').hide();
        var itemFilter = _parent.find('.kanban-item.tagKanName_'+tagName);
        var nameTag = (typeof data.nametag !== 'undefined') ? data.nametag : _this.text().trim();
        var iconTag = (typeof data.icontag !== 'undefined') ? 'fas fa-'+data.icontag : _this.find('i').attr('class');
            itemFilter.show();
            htmlFilter =    '<span id="filterTagKanban" class="tituloFilter" style="padding: 0 10px 20px; font-size: 9pt; text-align: center;">'+
                            '   Filtro: '+
                            '   <span class="tag" style="background-color: '+data.colortag+'">'+
                            '       <span class="tag-text" style="color: '+data.textcolor+'; margin-right: 5px;">'+
                            '           <i class="tagicon tagicon '+iconTag+'" style="font-size: 120%; margin: 0 2px; color: '+data.textcolor+'"></i>'+
                            '           '+nameTag+
                            '           </span>'+
                            '       <button onclick="filterTagKanbanArvore(this); return false;" class="tag-remove"></button>'+
                            '   </span>'+
                            '</span>';
            head.append(htmlFilter);
    } else {
        _parent.find('.kanban-item').show();
    }
}
export function getAtividadesProcessoArvore() {
    var htmlAtividades = '';
    var htmlInfoAtividades = '';
    var atividadesState = atividadesStateParent();
    if ((atividadesState.arrayAtividadesProcPro || []).length > 0) {
        $.each(atividadesState.arrayAtividadesProcPro,function(index, value){
            var params_url = getParamsUrlPro($(`a[target="${ifrVisualizacao_}"]`).attr('href'));
            var id_procedimento = params_url.id_procedimento;
            if (value.id_procedimento == parseInt(id_procedimento)) {
                var htmlActionsAtividade = callParentAtividades('actionsAtividade', value.id_demanda, 'icon');
                var kanbanItem = callParentAtividades('getKanbanItem', value);
                if (!htmlActionsAtividade || !kanbanItem) return;
                
                    htmlInfoAtividades +=   '<div class="kanban-item '+kanbanItem.class.join(' ')+'" data-eid="_id_'+value.id_demanda+'">'+
                                            '   '+kanbanItem.title+
                                            (htmlActionsAtividade.action == 'info' ? '' :
                                            '   <span class="info_dates_monitorado" style="display: block;padding: 0;margin: 10px 0 0 0;">'+
                                            '       <a class="newLink" href="#" data-seipro-arvore-action="parent-atividades" data-fn="actionsAtividade" data-id="'+value.id_demanda+'">'+
                                            '           <i style="margin-right: 3px;" class="'+htmlActionsAtividade.icon+' azulColor"></i>'+
                                            '           '+htmlActionsAtividade.name+
                                            '       </a>'+
                                            '   </span>'+
                                            '')+
                                            '</div>';
            }
        });
    
        htmlAtividades =    '<div class="panelDadosArvore panelDadosArvore_atividades" data-type="atividades">'+
                            '   <label class="newLink panelArvoreHead" style="margin-bottom: 10px; display: block;">'+
                            '      <i class="fas fa-check-circle azulColor iconDadosProcesso"></i>'+
                            '      Atividades:'+
                            '       <span class="atividadesProActionsArvore">'+
                            '       </span>'+
                            '      <i class="fas fa-chevron-'+(getOptionsPro('panelDadosArvorePro_atividades') == 'hide' ? 'right' : 'down')+' azulColor" style="float: right; cursor:pointer; margin-right: 20px;" onclick="togglePanelDadosArvore(this)"></i>'+
                            '   </label>'+
                            '   <div class="infoDadosArvore kanban-container" style="'+(getOptionsPro('panelDadosArvorePro_atividades') == 'hide' ? 'display:none' : '')+';padding: 10px 0;max-height: 800px;overflow-y: scroll;">'+
                            '       '+htmlInfoAtividades+
                            '   </div>'+
                            '</div>';
    }
    return htmlAtividades;
}
export function breakDocTwoLines() {
    if ($('.breackline_doc').length > 0) { $('.breackline_doc').remove(); }
    $('#divArvore').find(`a[target="${ifrVisualizacao_}"]`).each(function(index){
        var checkLast = (index == $('#divArvore').find(`a[target="${ifrVisualizacao_}"]`).length-1) ? true : false;
        var checkFolder = ($('#divArvore').find('a[id*="anchorImgPASTA"]').length > 0) ? true : false;
        var checkLastFolder = (parseInt($(this).closest('.infraArvore').attr('id').replace('divPASTA','')) == $('#divArvore').find('a[id*="anchorImgPASTA"]').length) ? true : false;
        var checkLastItemFolder = ($(this).attr('id') == $(this).closest('.infraArvore').find(`a[target="${ifrVisualizacao_}"]`).last().attr('id')) ? true : false;
        var nrSEI = $(this).text().trim();
            nrSEI = (nrSEI.indexOf(' ') !== -1) ? nrSEI.split(' ') : '';
            nrSEI = (nrSEI != '') ? '<span style="font-size:9pt">'+nrSEI[nrSEI.length-1]+'</span>' : '';
        var imgDivPasta = (checkFolder && !checkLast && !checkLastFolder ) ? '<img src="'+pathArvore+'line.gif" align="absbottom">' : '';
        var paddingLastFolder = (checkFolder && checkLastFolder) ? '<span style="margin-left: 18px;"></span>' : '';
        var imgDiv = (checkLast || checkLastItemFolder) ? '<img src="'+pathArvore+'joinbottom.gif" align="absbottom" style="margin-left: 18px;">' : '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAASCAYAAAAzI3woAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkIxNDk0NTBFQzFCMTFFQkFERjBGQzQ1Qjk0MkFCNUEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkIxNDk0NTFFQzFCMTFFQkFERjBGQzQ1Qjk0MkFCNUEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxRkIyMEY3NUVDMUExMUVCQURGMEZDNDVCOTQyQUI1QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxRkIyMEY3NkVDMUExMUVCQURGMEZDNDVCOTQyQUI1QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpIKuNMAAABISURBVHjaYvj//z8DLtzQ0PAfnzwxmFQzGEHEYAJM+CQbGxspdi2pZoyG0GgIjYbQaAiNhtBAhRCx9MgLIVLBaAgNuRACCDAA4Zq1PU3G1rcAAAAASUVORK5CYII=" />';
            
        $(this).after('<span class="breackline_doc"><br>'+paddingLastFolder+imgDivPasta+imgDiv+nrSEI+'</span>');
    });
}
export function initBreakDocTwoLines(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (isSparklingModalVisible()) {
        setTimeout(function(){ 
            initBreakDocTwoLines(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initBreakDocTwoLines => '+TimeOut); 
        }, 500);
        return;
    }
    if (typeof resizeArvoreMaxWidth !== 'undefined') {
        breakDocTwoLines();
    } else {
        setTimeout(function(){ 
            initBreakDocTwoLines(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initBreakDocTwoLines => '+TimeOut); 
        }, 500);
    }
}
// Tree-specific variant: applies seiSlim classes + initAnchorImg + retry loop.
// Distinct from the canonical SeiPro.core.ui.loadStyleDesign(body, secondClass, options);
// kept local (renamed) to avoid a global name collision with different semantics.
export function loadStyleDesignArvore(loop = 3) {
    if (localStorage.getItem('seiSlim')) {
        var body = document.body;
        body.classList.add("seiSlim");
        body.classList.add("seiSlim_arvore");
        if (localStorage.getItem('darkModePro')) {
            body.classList.add("dark-mode");
        }
        initAnchorImg();
        // initOnClickPasta();
        if (loop > 0) {
            setTimeout(function(){
                loadStyleDesignArvore(false);
                if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload loadStyleDesignArvore', loop);
            }, 1500);
        }
    }
}
export function initNumericDocsPro(loop = true) {
    var sumP = getSumDocsPasta(loop);
    $('.numericDocsPro').remove();
    var folderDiv = $('.infraArvore[id*="divPASTA"]');
    if (folderDiv.length) {
        folderDiv.each(function(){
            var _this = $(this);
            var folder = _this.attr('id');
                folder = (typeof folder !== 'undefined') ? folder.replace('divPASTA', '') : false;
                folder = (folder) ? parseInt(folder) : false;
            var initCount = (folder * sumP) - sumP;
            _this.find(anchorDoc).each(function(i){
                var count = initCount+i+1;
                $(this).before('<span class="numericDocsPro" data-count="'+count+'"></span>');
            });
        });
    } else {
        $(`#container ${anchorDoc}`).each(function(i){
            $(this).before('<span class="numericDocsPro" data-count="'+(i+1)+'"></span>');
        });
    }
}
export function getSumDocsPasta(loop) {
    if (parent.getOptionsPro('sumDocsPasta')) {
        return parent.getOptionsPro('sumDocsPasta');
    } else {
        var defaultSumPasta = 20;
        var sumDocsPasta = ($('#anchorImgPASTA2').length) 
            ? $('.infraArvore[id*="divPASTA"]:not(:last-child)').map(function(){ if( $(this).find(anchorDoc).length) { return $(this).find(anchorDoc).length } }).get()
            : defaultSumPasta;
        var sumDocsPasta = $.isArray(sumDocsPasta) && !$.isEmptyObject(sumDocsPasta) ? arrayMax(sumDocsPasta) : sumDocsPasta;
        if (sumDocsPasta > defaultSumPasta && loop) {
            parent.setOptionsPro('sumDocsPasta',sumDocsPasta);
            initNumericDocsPro(false);
        } else {
            sumDocsPasta = defaultSumPasta;
        }
        
        return sumDocsPasta;
    }
}
export function checkProcessoSigiloso() {
    if ($('a[id*="anchorNA"] img[src*="_sigiloso"]').length > 0) {
        var id_protocolo = getParamsUrlPro(window.location.href).id_procedimento;
        sessionStorageStorePro('processo_sigiloso_'+id_protocolo,true);
    }
}
export function initPanelPrescricaoProcesso() {
    var prescData = atividadesStateParent().arrayPrescricoesProcPro;
    var tipos_prescricao = typeof jmespath !== 'undefined' ? jmespath.search(prescData,"[*].id_tipo_prescricao") : null;
        tipos_prescricao = tipos_prescricao !== null ? parent.uniqPro(tipos_prescricao) : null;
    if (typeof prescData !== 'undefined' && prescData.length > 0 && tipos_prescricao !== null && tipos_prescricao.length > 0 && typeof parent.checkConfigValue !== 'undefined' && parent.checkConfigValue('gerenciarprescricoes')) {
        $.each(tipos_prescricao, function(i, v){
                var configAtividades = atividadesStateParent().arrayConfigAtividades || {};
                var value_prescricao = typeof configAtividades.tipos_prescricoes !== 'undefined' ? jmespath.search(configAtividades.tipos_prescricoes, "[?id_tipo_prescricao==`"+v+"`] | [0]") : null;
                value_prescricao = value_prescricao !== null ? value_prescricao : false;
            var prescricao = jmespath.search(prescData,"[?id_tipo_prescricao==`"+v+"`]");
                prescricao = prescricao !== null ? prescricao : false;
            var vigente = jmespath.search(prescricao, "[?data_fim=='0000-00-00 00:00:00'] | [0]");
                vigente = vigente !== null ? vigente : false;
            var prazo = value_prescricao ? value_prescricao.prazo : false;
            var config = value_prescricao ? value_prescricao.config : false;
            var suspensao_prazo = config && config.suspensao_prazo ? true : false;

            if (prazo && vigente) {
                if (suspensao_prazo) {
                    var decorrido = jmespath.search(prescData,"[?!suspensao]");
                        decorrido = decorrido.map(function(v){ 
                            var data_fim = v.data_fim == '0000-00-00 00:00:00' ? moment() : moment(v.data_fim, 'YYYY-MM-DD HH:mm:ss');
                            var prazo = data_fim.diff(moment(v.data_inicio, 'YYYY-MM-DD HH:mm:ss'),'days');
                            return prazo
                        }).reduce((b, a) => b + a, 0);
                } else {
                    var decorrido = moment().diff(moment(vigente.data_inicio, 'YYYY-MM-DD HH:mm:ss'),'days');
                }
                var porcentagem = parseFloat(((decorrido/prazo)*100).toFixed(2));
                var nivel_critico = config && typeof config.nivel_critico !== 'undefined' ? config.nivel_critico : 75;
                var urgencia_nivel_critico = config && typeof config.urgencia_nivel_critico !== 'undefined' ? config.urgencia_nivel_critico : false;
                var classProgress = porcentagem >= nivel_critico ? 'urgente' : '';
                    classProgress = vigente.suspensao ? 'suspenso' : classProgress;
                var txtTip =    'Prazo: '+prazo+' dias<br>'+
                                'Decorrido: '+decorrido+' dias ('+porcentagem+'%) <br>'+
                                'Documento: '+vigente.documento_relacionado+' ('+moment(vigente.data_inicio).format('DD/MM/YYYY HH:mm')+')'+
                                '\',\''+
                                (vigente.suspensao ? '(SUSPENSO) ' : '')+value_prescricao.nome_prescricao;

                $('#progressPrescricao_'+v).remove();
                $('#topmenu').append('<div id="progressPrescricao_'+v+'" onmouseover="return infraTooltipMostrar(\''+txtTip+'\');" onmouseout="return infraTooltipOcultar();" onclick="parent.getCtrPrescricao();" class="progressPrescricao '+classProgress+'"></div>');
                $('#progressPrescricao_'+v).progressbar({
                    value: decorrido,
                    max: prazo
                });
                $('#container').css('margin-top','35px');

                setTimeout(function(){ 
                    if (typeof parent.dadosProcessoPro.propProcesso !== 'undefined' && parent.dadosProcessoPro.propProcesso.txtDescricao.toLowerCase().indexOf('(urgente)') === -1 && porcentagem >= nivel_critico && urgencia_nivel_critico) {
                        parent.addUrgenteProcessoPro();
                    }
                }, 4000);
                // console.log(value_prescricao, vigente, prazo, decorrido, porcentagem, nivel_critico, urgencia_nivel_critico, parent.dadosProcessoPro);
            }
        })
    }
}
export function initAnchorImg() {
    $('a[id*="anchorImg"], a[id*="anchorA"], a[id*="ancjoinPASTA"]').each(function(){
        var img = $(this).find('img').attr('src');
        if (img !== null) $(this).attr('data-img', img);
    });
    $('img[src*="/join"], img[src*="/line"]').wrap(function(){
        return ($(this).closest('.anchorJoinPro').length == 0) ? '<span class="anchorJoinPro" data-img="'+$(this).attr('src')+'"></span>' : false;
    });
    $('img[src*="/espaco"], img[src*="/empty"]').wrap(function(){
        return ($(this).closest('.anchorSpacePro').length == 0) ? '<span class="anchorSpacePro" data-img="'+$(this).attr('src')+'"></span>' : false;
    });
}
export function getArvoreInitSignature() {
    var anchors = $('a[id*="anchor"][target="'+ifrVisualizacao_+'"]');
    if (!anchors.length) return '';
    return buildArvoreInitSignature(anchors.map(function() {
        return {
            id: $(this).attr('id') || '',
            href: $(this).attr('href') || ''
        };
    }).get());
}
// Feature "Filtrar a página pelo campo de pesquisa rápida" (config filtrarpaginapelapesquisarapida)
// migrada para src/features/quick-filter/ (bundle quick-filter-tree.bundle.js, self-boot no ifrArvore). — Fase 6.
/*
export function initOnClickPasta() {
    $('a[id*="ancjoinPASTA"]').on('click', function(){
        initAnchorImg();
        console.log('initOnClickPasta');
    });
    $('a[id*="anchorImgPASTA"]').on('click', function(){
        initAnchorImg();
        console.log('initOnClickPasta');
    });
    $('a[id*="anchorPASTA"]').on('click', function(){
        initAnchorImg();
        console.log('initOnClickPasta');
    });
}
*/
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
