/**
 * Árvore — toolbar CSS, docs menu, links.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import { getLinksInText as domainGetLinksInText } from './domain.js';

import {
    bindArvoreToolbarProcess
} from './view.js';

import * as templates from './templates.js';

import {
    openModalDropzone
} from './upload.js';

import {
    addIconActionsArvore,
    callActionsArvore,
    getSelectedItensPanelArvore,
    readArvoreMenuConfig,
    resolveArvoreMenuCatalogs
} from './modules.js';


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
