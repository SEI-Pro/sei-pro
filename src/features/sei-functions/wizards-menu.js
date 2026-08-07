/**
 * Sei Functions Pro — new doc/proc wizards + SEI menu chrome.
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
    createQrCodePlaceholder,
    hydrateQrCodePlaceholders,
    renderQrCode
} from '../../shared/qr-code.js';

import {
    alertaBoxPro,
    checkProcessoSigiloso,
    getCitacaoDoc,
    getIframeArvoreElement,
    getLinksInText,
    getTreeDocumentsSession,
    getTreeSignedDocumentsSession,
    openLinkNewTab,
    openWindowEditor
} from './modules.js';

export function setNewDoc(id_procedimento, id_tipo_documento, insertHtml = false, openProc = true) {
    if (!checkProcessoSigiloso()) {
        var href = url_host.replace('controlador.php','')+'controlador.php?acao=procedimento_trabalhar&id_procedimento='+String(id_procedimento);
        $.ajax({ url: href }).done(function (html) {
            let $html = $(html);
            var urlArvore = $html.find("#ifrArvore").attr('src');
            $.ajax({ url: urlArvore }).done(function (htmlArvore) {
                var $htmlArvore = $(htmlArvore);
                var textLink = $htmlArvore.filter('script').not('[src*="js"]').text();
                var arrayLinksArvoreDoc = getLinksInText(textLink);
                var urlNewDoc = arrayLinksArvoreDoc.filter(function(v){ return v.indexOf('acao=documento_escolher_tipo') !== -1 });
                if (urlNewDoc) {
                    $.ajax({ url: urlNewDoc }).done(function (htmlNewDoc) {
                        let $htmlNewDoc = $(htmlNewDoc);
                        var urlDoc = $htmlNewDoc.find('a[href*="&id_serie='+id_tipo_documento+'&"]').attr('href');
                        console.log(urlDoc, id_tipo_documento);
                            if (typeof urlDoc !== 'undefined') {
                                $.ajax({ url: urlDoc }).done(function (htmlDoc) {
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
                                        param.rdoNivelAcesso = '0';
                                        param.hdnFlagDocumentoCadastro = '2';
                                        param.txaObservacoes = '';
                                        param.txtDescricao = '';

                                        var postData = '';
                                        for (var k in param) {
                                            if (postData !== '') postData = postData + '&';
                                            var valor = (k=='hdnAssuntos') ? param[k] : escapeComponent(param[k]);
                                                valor = (k=='txtDataElaboracao') ? param[k] : escapeComponent(param[k]);
                                                valor = (k=='hdnInteressados') ? param[k] : valor;
                                                valor = (k=='txtDescricao') ? parent.encodeURI_toHex(param[k].normalize('NFC')) : valor;
                                                valor = (k=='txtNumero') ? escapeComponent(param[k]) : valor;
                                                postData = postData + k + '=' + valor;
                                        }

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
                                            var status = (xhr.responseURL.indexOf('controlador.php?acao=arvore_visualizar&acao_origem=documento_gerar') !== -1) ? true : false;
                                            var ifrArvore = $('#ifrArvore');
                                            if (status) {
                                                console.log('Documento gerado com sucesso');
                                                var $htmlResult = $(htmlResult);
                                                var urlEditor = [];
                                                var idUser = false;
                                                $.each($htmlResult.text().split('\n'), function(i, v){
                                                    if (v.indexOf("atualizarArvore('") !== -1) {
                                                        urlReload = v.split("'")[1];
                                                    }
                                                    if (v.indexOf("acao=editor_montar") !== -1) {
                                                        var editorUrlNew = extractEditorMontarUrl(v);
                                                        if (editorUrlNew) urlEditor.push(editorUrlNew);
                                                    }
                                                    if (v.indexOf("janelaEditor_") !== -1) {
                                                        idUser = v.split("_")[1];
                                                    }
                                                });
                                                if (!urlEditor.length) {
                                                    var editorUrlNewHtml = extractEditorMontarUrl(htmlResult);
                                                    if (editorUrlNewHtml) urlEditor.push(editorUrlNewHtml);
                                                }
                                                if (urlEditor.length > 0 && idUser) {
                                                    var acao_pro = insertHtml ? 'set_automatico' : 'set_new_doc';
                                                    if (openProc) openLinkNewTab(href);
                                                    openWindowEditor(urlEditor[0]+'#&acao_pro='+acao_pro, idUser);
                                                    if (insertHtml) alertaBoxPro('Sucess', 'check-circle', 'Documento gerado com sucesso', refreshDocViewArvorePro);
                                                }
                                                if (ifrArvore.length) {
                                                if (urlReload) {
                                                    ifrArvore.attr('src', urlReload);
                                                } else {
                                                    var ifrArvoreElem = getIframeArvoreElement();
                                                    if (ifrArvoreElem && ifrArvoreElem.contentWindow) ifrArvoreElem.contentWindow.location.reload(true);
                                                }
                                                }
                                            } else {
                                                alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao gerar o documento.');
                                            }
                                        });
                                });
                            } else {
                                alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao selecionar o tipo de documento. Verifique se o tipo est\u00E1 dispon\u00EDvel no sistema e tente novamente');
                            }
                    });
                } else {
                    alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!')
                }
            });
        });
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Funcionalidade n\u00E3o dispon\u00EDvel para processos sigilosos!')
    }
}
export function refreshDocViewArvorePro() {
    $('#ifrArvore').contents().find('.infraArvoreNoSelecionado').trigger('click');
}
export function setNewProc(id_tipo_procedimento, id_tipo_documento) {
    var urlInitProc = $(mainMenu+' a[href*="acao=procedimento_escolher_tipo"]').attr('href');
    if (urlInitProc !== null) {
        $.ajax({ url: urlInitProc }).done(function (htmlInitProc) {
            var $htmlInitProc = $(htmlInitProc);
            var form = $htmlInitProc.find('#frmIniciarProcessoEscolhaTipo');
            var hrefForm = form.attr('action');
            var param = {};
                form.find("input[type=hidden]").each(function () {
                    if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                        param[$(this).attr('name')] = $(this).val(); 
                    }
                });
                param.hdnFiltroTipoProcedimento = 'T';
            
                $.ajax({
                    method: 'POST',
                    data: param,
                    url: hrefForm
                }).done(function (htmlFullList) {
                    let $htmlFullList = $(htmlFullList);
                    var urlProc = $htmlFullList.find('a[href*="procedimento_escolher_tipo&id_tipo_procedimento='+id_tipo_procedimento+'"]').attr('href');
                    if (urlProc !== null) {
                        $.ajax({ url: urlProc }).done(function (htmlFormProc) {
                            var $htmlFormProc = $(htmlFormProc);
                            var form = $htmlFormProc.find('#frmProcedimentoCadastro');
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
                                param.rdoNivelAcesso = '0';
                                param.hdnFlagProcedimentoCadastro = '2';
                                param.rdoProtocolo = 'M';
                                param.txaObservacoes = '';
                                param.hdnAssuntos = ($htmlFormProc.find('#selAssuntos option').length == 0) ? [] : $htmlFormProc.find('#selAssuntos option').map(function(){ return $(this).val()+'\u00B1'+$(this).text() }).get().join('\u00A5').replaceAll(' ','+');
                                param.hdnInteressados = $htmlFormProc.find('#selInteressados option').map(function(){ return $(this).val()+'\u00B1'+$(this).text() }).get().join('\u00A5').replaceAll(' ','+');

                                var postData = '';
                                for (var k in param) {
                                    if (postData !== '') postData = postData + '&';
                                    var valor = (k=='hdnNomeTipoProcedimento') ? escapeComponent(param[k]) : param[k];
                                        valor = (k=='hdnAssuntos') ? escapeComponent(param[k])  : valor;
                                        postData = postData + k + '=' + valor;
                                }
                                console.log(param, postData);

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
                                    var status = (xhr.responseURL.indexOf('controlador.php?acao=procedimento_trabalhar&acao_origem=procedimento_gerar') !== -1) ? true : false;
                                    if (status) {
                                        var $htmlResult = $(htmlResult);
                                        var linkProc = $htmlResult.find('#ifrArvore').attr('src');
                                        var id_procedimento = (linkProc !== null) ? getParamsUrlPro(linkProc).id_procedimento : false;
                                            id_procedimento = (typeof id_procedimento !== 'undefined') ? id_procedimento : false;
                                        var href = url_host.replace('controlador.php','')+'controlador.php?acao=procedimento_trabalhar&id_procedimento='+String(id_procedimento);
                                        if (id_procedimento && href) {
                                            setNewDoc(id_procedimento, id_tipo_documento);
                                        } else {
                                            alertaBoxPro('Error', 'exclamation-triangle', 'N\u00E3o foi poss\u00EDvel abrir o processo gerado. Verifique na caixa de entrada de sua unidade');
                                        }
                                    }
                                });
                        });
                    } else { 
                        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao selecionar o tipo de processo. Verifique se o tipo est\u00E1 dispon\u00EDvel no sistema e tente novamente');
                    }
                });
            
        });
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao iniciar a cria\u00E7\u00E3o do processo');
    }
}
export function setSizeIframePro(tLeft, saveSize = true) {
      $('head').find('style[data-style="seipro-sizeiframe"]').remove();
      $('head').prepend(  "<style type='text/css' data-style='seipro-sizeiframe'> "
                          +"  .seiSlim:not(.newSEI) iframe#ifrArvore {\n"
                          +"      width: "+(tLeft-6)+"px !important;\n"
                          +"  }\n"
                          +"  .seiSlim.seiSlim_hidemenu:not(.newSEI) iframe#ifrVisualizacao,\n"
                          +"  .seiSlim.seiSlim_hidemenu:not(.newSEI) iframe#ifrConteudoVisualizacao {\n"
                          +"      width: calc(97vw - "+(tLeft-6)+"px) !important;\n"
                          +"  }\n"
                          +"  .seiSlim:not(.newSEI) iframe#ifrVisualizacao,\n"
                          +"  .seiSlim:not(.newSEI) iframe#ifrConteudoVisualizacao {\n"
                          +"      width: calc(78vw - "+(tLeft-6)+"px) !important;\n"
                          +"  }\n"
                          +"</style>");
    if (saveSize) setOptionsPro('iframeSizeSlimPro',tLeft);
    if (SeiPro.sei.adapter.isNewSEI()) $('#divIframeArvore').css('width',tLeft);
}
/*
if (verifyConfigValue('menususpenso')) {
    function infraMenuSistemaEsquema(bolInicializar, tipo){
        var mostrarMenu = null;
        var tamanhoDados = null;
        var title = '';

        if (bolInicializar == undefined) bolInicializar = false; 

        var lnkMenu = document.getElementById('lnkInfraMenuSistema');
        if (lnkMenu == null) return;

        var hdnCookie = document.getElementById('hdnInfraPrefixoCookie');
        if (hdnCookie == null) return;

        var prefixoCookie = hdnCookie.value;
        infraTooltipOcultar();

        if (bolInicializar){
            //le do cookie
            if (infraLerCookie(prefixoCookie+'_menu_mostrar')!='N'){
                tamanhoDados = document.getElementById("divInfraAreaTelaD").offsetWidth/document.getElementById("divInfraAreaTela").offsetWidth;
                tamanhoDados = Math.floor(tamanhoDados*Math.pow(10,2));
                infraCriarCookie(prefixoCookie+'_menu_tamanho_dados',tamanhoDados,1);
                title = 'Ocultar';
            } else {
                title = 'Exibir';
            }
        } else {
            if (tipo == undefined || tipo == null) {
                if (document.getElementById('divInfraAreaTelaE').style.display == ''){
                    tipo = 'Ocultar';
                } else {
                    tipo = 'Exibir';
                }
            }
            if (tipo == 'Ocultar' || (getOptionsPro('panelMenuSistemaView') !== false && !$('#divInfraBarraSistemaE').hasClass('barSuspenso'))) {
                document.getElementById('divInfraAreaTelaE').style.display='none';
                document.getElementById('divInfraAreaTelaD').style.width = '99%';
                infraCriarCookie(prefixoCookie+'_menu_mostrar','N',1);
                title = 'Exibir';
                if ($('#divInfraBarraSistemaE').hasClass('barSuspenso')) removeOptionsPro('panelMenuSistemaView');
                if (getOptionsPro('panelMenuSistemaView')) setMenuSistemaView();
            } else {
                setMenuSistemaView(true);
                removeOptionsPro('panelMenuSistemaView');

                tamanhoDados = infraLerCookie(prefixoCookie+'_menu_tamanho_dados');
                document.getElementById('divInfraAreaTelaE').style.display='';

                if (tamanhoDados == null) tamanhoDados = infraClientWidth() * 0.80;

                document.getElementById('divInfraAreaTelaD').style.width = tamanhoDados+'%';
                infraCriarCookie(prefixoCookie+'_menu_mostrar','S',1);
                title = 'Ocultar';
            }
            if (tipo == 'Ocultar') setOptionsPro('panelMenuSistemaView', 'active');
                infraResize();
                checkMenuSistemaView();
        }
        // console.log('***** infraMenuSistemaEsquema',bolInicializar, tipo, prefixoCookie, tamanhoDados, window.name);
    }
}
*/
export function infraMenuSistemaEsquema() {
    return false;
}
export function infraMenuSistemaEsquemaPro() {
    if (!delayCrash) {
        if (SeiPro.sei.adapter.isNewSEI()) {
            if (!checkMenuVisible()) {
                showMenuSEIPro();
            } else {
                hideMenuSEIPro();
            }
        } else {
            if ($('#divInfraAreaTelaE').is(':visible')) {
                hideMenuSEIPro();
            } else {
                showMenuSEIPro();
            }
        }
        delayCrash = true;
        setTimeout(function(){ delayCrash = false }, 300);
    }
}
export function hideMenuSEIPro() {
    if (verifyConfigValue('menususpenso') && !SeiPro.sei.adapter.isNewSEI()) {
        $('#divInfraAreaTelaE').hide({ effect: 'slide', direction: 'left', duration: 300, complete: function(){ 
                $(this).attr('style','display:none;');
        }});
        $(infraBarraS).addClass('barSuspenso_hide').removeClass('barSuspenso_show');
        $('#divInfraAreaTelaE').hide();
        $('#divInfraAreaTelaD').css({'width': '99%'});
        setOptionsPro('showMenuSEIPro',true);
        $('body').addClass('seiSlim_hidemenu');
    } else {
        $('#divInfraAreaTelaE').hide();
        $('#divInfraAreaTelaD').css({'width': '99%'});
        setOptionsPro('showMenuSEIPro',true);
        $('body').addClass('seiSlim_hidemenu');
        if (SeiPro.sei.adapter.isNewSEI()) {
            $("#divInfraAreaTelaE").addClass("infraMenuAnimacao");
            $("#divInfraAreaTelaE").addClass("text-truncate");
            $("#divInfraAreaTelaE").removeClass("infraAreaTelaEExibeGrande");
            $("#divInfraAreaTelaE").addClass("infraAreaTelaEEscondeGrande");
            $("#divInfraAreaTelaE").removeClass("infraAreaTelaEExibePequeno")
            $("#divInfraAreaTelaD").removeClass("infraAreaTelaDEscondePequeno");
            $("#divInfraAreaTelaE").addClass("infraAreaTelaEEscondePequeno");
            $("#divInfraSidebarMenu").css("overflow-x", "hidden");
            if (verifyConfigValue('menususpenso')) $(infraBarraS).addClass('barSuspenso_hide').removeClass('barSuspenso_show');
        }
    }
}
export function showMenuSEIPro() {
    if (verifyConfigValue('menususpenso') && !SeiPro.sei.adapter.isNewSEI()) {
        if (typeof $.easing !== 'undefined') {
            $('#divInfraAreaTelaE').show({ effect: 'slide', direction: 'left', duration: 300, complete: function(){ 
                $(this).removeAttr('style'); 
            }});
        }
        $(infraBarraS).addClass('barSuspenso_show').removeClass('barSuspenso_hide');
    } else {
        $('#divInfraAreaTelaE').show();
        $('#divInfraAreaTelaD').css({'width': '79%'});
        setOptionsPro('showMenuSEIPro',false);
        $('body').removeClass('seiSlim_hidemenu');
        if (SeiPro.sei.adapter.isNewSEI()) {
            $("#divInfraAreaTelaE").addClass("text-truncate");
            $("#divInfraAreaTelaE").addClass("infraMenuAnimacao");
            $("#divInfraAreaTelaE").addClass("infraAreaTelaEExibeGrande");
            $("#divInfraAreaTelaE").removeClass("infraAreaTelaEEscondeGrande");
            $("#divInfraAreaTelaE").addClass("infraAreaTelaEExibePequeno");
            $("#divInfraAreaTelaD").addClass("infraAreaTelaDEscondePequeno");
            $("#divInfraAreaTelaE").removeClass("infraAreaTelaEEscondePequeno");
            if (verifyConfigValue('menususpenso')) $(infraBarraS).addClass('barSuspenso_show').removeClass('barSuspenso_hide');
        }
    }
}
export function checkMenuVisible() {
    let displayMenu = $('#divInfraAreaTelaE').attr('style');
        displayMenu = typeof displayMenu !== 'undefined' ? displayMenu.replace(/ /g,'') : '';
    return (displayMenu == 'display:none;') ? false : true;
}
export function checkMenuSEIPro() {
    setTimeout(() => {
        $('#lnkInfraMenuSistema')
            .attr('onclick', 'return false;')
            .off('click.seiProMenuSistema')
            .on('click.seiProMenuSistema', function(event) {
                event.preventDefault();
                event.stopPropagation();
                infraMenuSistemaEsquemaPro();
                return false;
            });
        if (verifyConfigValue('menususpenso')) {
            $('#divInfraAreaTelaE').addClass('menuSuspenso');
            $(infraBarraS).addClass('barSuspenso').attr('onclick','infraMenuSistemaEsquemaPro()');
        }
        if (getOptionsPro('showMenuSEIPro') && checkMenuVisible()) hideMenuSEIPro();
    }, 500);

    // OCULTA O ÍCONE NATIVO DE EXIBIR MENU DO SISTEMA PARA O SEI > 5.0
    $('img[title="Exibir/Ocultar Menu do Sistema"]').hide()
}

// SUBSTITUI CAMPOS PERSONALIZADOS
export function sumTagValue(value) {
    var return_ = value;
    var prop = dadosProcessoPro.propProcesso;
    var docs = getTreeDocumentsSession(dadosProcessoPro);
        docs = (docs.length === 0) ? getTreeSignedDocumentsSession(dadosProcessoPro) : docs;
    var i = parseInt(value.replace(/[^0-9\.]+/g, ''));
        i = (value.indexOf('-') !== -1) ? (i*-1) : i;
        i = i-1;

    if (value.indexOf('hoje') !== -1) {
        return_ = '<span class="ancoraSei dynamicField">'+moment().add(i+1, 'd').format('LL')+'</span>';
    } else if (value.indexOf('ano') !== -1) {
        return_ = '<span class="ancoraSei dynamicField">'+moment().format('Y')+'</span>';
    } else if (value.indexOf('assunto') !== -1) {
        var index = ((i+1) > prop.selAssuntos_select.length) ? (prop.selAssuntos_select.length-1) : i;
        return_ = '<span class="ancoraSei dynamicField">'+prop.selAssuntos_select[index]+'</span>';
    } else if (value.indexOf('interessado') !== -1) {
        var index = ((i+1) > prop.selInteressadosProcedimento.length) ? (prop.selInteressadosProcedimento.length-1) : i;
        return_ = '<span class="ancoraSei dynamicField">'+prop.selInteressadosProcedimento[index]+'</span>';
    } else if (value.indexOf('observacao') !== -1) {
        var index = ((i+1) > prop.txaObservacoes.length) ? (prop.txaObservacoes.length-1) : i;
        return_ = '<span class="ancoraSei dynamicField">'+prop.txaObservacoes[index].unidade+': '+prop.txaObservacoes[index].observacao+'</span>';
    } else if (value.indexOf('documento') !== -1) {
        var docValue = '';
        if (value.indexOf('+') !== -1 || value.indexOf('-') !== -1) {
            var indexDoc = 0;
            var indexCurrent = false;
            $.each(docs, function(i, v) { 
                if (v.id_protocolo == getParamsUrlPro(window.location.href).id_documento) { 
                    indexCurrent = i;
                    return indexDoc; 
                } indexDoc++; 
            });
            var iDoc = indexDoc+(i+1);
                iDoc = (docs.length <= iDoc) ? (docs.length-1) : iDoc;
                iDoc = (value.indexOf('-') !== -1 && value.split('-')[1] == 'ultimo') ? (docs.length-1) : iDoc;
                iDoc = (value.indexOf('-') !== -1 && value.split('-')[1] == 'atual') ? indexCurrent : iDoc;
            docValue = getHtmlListDocumentos(docs[iDoc]);
        } else if (hasNumber(value)) {
            docValue = getHtmlListDocumentos(docs[i]);
        }
        return_ = '<span class="ancoraSei dynamicField">'+docValue+'</span>';
    }
    return return_;
}
export function getHtmlListDocumentos(value) {
    if (typeof value !== 'undefined') { 
        var nrSei = ( value.nr_sei != '' ) ? value.nr_sei : value.documento;
        var citacaoDoc = getCitacaoDoc();
        var nrSeiHtml = '<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei'+value.id_protocolo+'" style="text-indent:0;">'+nrSei+'</a></span>';
        return ( value.nr_sei != '' || getConfigValue('citacaodoc') == 'citacaodoc_4') ? value.documento.trim()+'&nbsp;('+citacaoDoc+nrSeiHtml+')' : nrSeiHtml;
    } else { return '' }
}
export function getQRProcesso() {
    var text = url_host+"?acao=procedimento_trabalhar&id_procedimento="+getParamsUrlPro(window.location.href).id_procedimento;
    return createQrCodePlaceholder(text, { className: 'seipro-qr-code' });
}
export function camposDinamicosProcesso(arrayTags) {
    var prop = dadosProcessoPro.propProcesso;
    var docs = getTreeDocumentsSession(dadosProcessoPro);
        docs = (docs.length === 0) ? getTreeSignedDocumentsSession(dadosProcessoPro) : docs;
    var processo = (typeof prop.txtProtocoloExibir === 'undefined') ? prop.hdnProtocoloFormatado : prop.txtProtocoloExibir;
        processo = (typeof processo !== 'undefined') ? '<span contenteditable="false" data-cke-linksei="1" style="text-indent:0px;"><a id="lnkSei'+prop.hdnIdProcedimento+'" class="ancoraSei" style="text-indent:0px;">'+processo+'</a></span>' : null;
        processo = (processo !== null && $.inArray('processo_texto', arrayTags) !== -1) ? '<span class="ancoraSei dynamicField">'+(prop.hdnProtocoloFormatado || prop.txtProtocoloExibir)+'</span>' : processo;
    var autuacao = (typeof prop.txtDtaGeracaoExibir === 'undefined') ? prop.hdnDtaGeracao : prop.txtDtaGeracaoExibir;
        autuacao = (typeof autuacao !== 'undefined') ? '<span class="ancoraSei dynamicField">'+autuacao+'</span>' : null;
    var tipo = (typeof prop.hdnNomeTipoProcedimento !== 'undefined') ? '<span class="ancoraSei dynamicField">'+prop.hdnNomeTipoProcedimento+'</span>' : null;
    var especificacao = (typeof prop.txtDescricao !== 'undefined') ? '<span class="ancoraSei dynamicField">'+prop.txtDescricao+'</span>' : null;
    var hoje = '<span class="ancoraSei dynamicField">'+moment().format('LL')+'</span>';
    var ano = '<span class="ancoraSei dynamicField">'+moment().format('Y')+'</span>';
    var qrcode = '<span class="ancoraSei dynamicField">'+getQRProcesso()+'</span>';
    var interessados = (typeof prop.selInteressadosProcedimento !== 'undefined') 
                            ? ($.inArray('interessados_lista', arrayTags) !== -1) 
                                    ? $.map(prop.selInteressadosProcedimento, function(substr, i){ return '<span class="ancoraSei dynamicField">'+substr+'</span><br>' }).join('')
                                    : '<span class="ancoraSei dynamicField">'+joinAnd(prop.selInteressadosProcedimento)+'</span>' 
                            : null;
    var assuntos = (typeof prop.selAssuntos_select !== 'undefined') 
                            ? ($.inArray('assuntos_lista', arrayTags) !== -1) 
                                    ? $.map(prop.selAssuntos_select, function(substr, i){ return '<span class="ancoraSei dynamicField">'+substr+'</span><br>' }).join('')
                                    : '<span class="ancoraSei dynamicField">'+joinAnd(prop.selAssuntos_select)+'</span>' 
                            : null;
    
    var unidadeObs = jmespath.search(dadosProcessoPro.propProcesso.txaObservacoes, "[?unidade=='"+siglaUnidadeAtual+"'] | [0]");
    var observacao = (typeof prop.txaObservacoes !== 'undefined' && prop.txaObservacoes.length > 0 && unidadeObs !== null && unidadeObs.observacao != '')
                        ? '<span class="ancoraSei dynamicField">'+unidadeObs.unidade+': '+unidadeObs.observacao+'</span>' : null;

    var observacoes = (typeof prop.txaObservacoes !== 'undefined' && prop.txaObservacoes.length > 0) 
                        ? ($.inArray('observacoes_lista', arrayTags) !== -1) 
                            ? $.map(prop.txaObservacoes, function(value, i){
                                  return value.unidade+': '+value.observacao+'<br>';
                              }).join('')
                            : joinAnd($.map(prop.txaObservacoes, function(value, i){
                                  return value.unidade+': '+value.observacao;
                              }))
                        : null;
        observacoes = (observacoes !== null) ? '<span class="ancoraSei dynamicField">'+observacoes+'</span>' : observacoes;
    var acesso = (typeof prop.rdoNivelAcesso !== 'undefined' && prop.rdoNivelAcesso == 0) ? '<span class="ancoraSei dynamicField">&#127760;&nbsp; <span>P\u00FAblico</span></span>' : null;
        acesso = (acesso !== null && prop.rdoNivelAcesso == 1) ? '<span class="ancoraSei dynamicField">&#128274;&nbsp; <span>Restrito</span></span>' : acesso;
        acesso = (acesso !== null && prop.rdoNivelAcesso == 2) ? '<span class="ancoraSei dynamicField">&#9940;&nbsp; <span>Sigiloso</span></span>' : acesso;
        acesso = (acesso !== null && $.inArray('acesso_texto', arrayTags) !== -1) ? $(acesso).find('span').text() : acesso;
    var documentos = (typeof docs !== 'undefined') 
                            ? ($.inArray('documentos_lista', arrayTags) !== -1) 
                                    ? $.map(docs, function(value, i){
                                            return getHtmlListDocumentos(value)+'<br>';
                                      }).join('')
                                    : joinAnd($.map(docs, function(value, i){
                                            return getHtmlListDocumentos(value);
                                      }))
                            : null;
        documentos = (documentos !== null) ? '<span class="ancoraSei dynamicField">'+documentos+'</span>' : documentos;
    var totaldocumentos = (typeof docs !== 'undefined' && docs !== null && $.inArray('totaldocumentos', arrayTags) !== -1) ? '<span class="ancoraSei dynamicField">'+docs.length+'</span>' : null;

    var dadosProcesso = {processo: processo, autuacao: autuacao, tipo: tipo, especificacao: especificacao, hoje: hoje, ano: ano, interessados: interessados, assuntos: assuntos, acesso: acesso, documentos: documentos, totaldocumentos: totaldocumentos, observacoes: observacoes, observacao: observacao, qrcode: qrcode};
    return dadosProcesso;
}
export function setInfraImg(target = $('html')) {
    target.find('img[src*="/infra_css/"], img.infraImg, img.InfraImg').wrap(function(){
        if ($(this).is(':visible')) {
            return ($(this).closest('.infraImgPro').length == 0 && $(this).closest('#tblAnexos').length == 0) ? '<span class="infraImgPro" data-img="'+$(this).attr('src')+'"></span>' : false;
        } else {
            return false;
        }
    });
}
export function initModalNewSEISigiloso(TimeOut = 1000) {
    var sigilosoHost = (function () {
        try { return window.top || window; } catch (e) { return window; }
    })();
    if (window !== sigilosoHost) { return; }
    if (sigilosoHost.__SEI_PRO_SIGILOSO_INIT_DONE__) { return; }
    if (TimeOut <= 0 || !SeiPro.sei.adapter.isNewSEI() ||  !checkProcessoSigiloso() || $('#divInfraSparklingModalContent').is(':visible')) { return; }
    if (typeof $.modalLink !== 'undefined' && typeof $().resizable !== 'undefined') { 
        if (checkProcessoSigiloso()) { 
            try {
                // `inicializar` é função da PÁGINA do SEI (mundo MAIN) — invisível
                // no mundo isolado. Guardada para não quebrar; modal de sigiloso
                // degrada quando indisponível.
                if (typeof inicializar !== 'function') { sigilosoHost.__SEI_PRO_SIGILOSO_INIT_DONE__ = false; return; }
                sigilosoHost.__SEI_PRO_SIGILOSO_INIT_DONE__ = true;
                inicializar();
            } catch (e) {
                sigilosoHost.__SEI_PRO_SIGILOSO_INIT_DONE__ = false;
                throw e;
            }
        }
    } else {
        setTimeout(function(){ 
            initModalNewSEISigiloso(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initModalNewSEISigiloso'); 
        }, 500);
    }
}
