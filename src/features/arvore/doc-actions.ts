// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Árvore — tree actions, duplicate, loading.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import * as templates from './templates.js';

import {
    extractEditorMontarUrl,
    isValidEditorMontarUrl,
    linkMatchesDocumentoId
} from '../../shared/sei-editor-url.js';


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
