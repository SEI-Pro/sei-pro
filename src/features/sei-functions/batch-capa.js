/**
 * Sei Functions Pro — batch actions + capa.
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
    checkboxRangerSelectShift,
    confirmaBoxPro,
    copyToClipboard,
    getAllLinksFolder,
    getCheckerProcessoPro,
    getIframeArvoreElement,
    getLinksInText,
    getListDocumentosArvore,
    getTreeDocumentsSession,
    getTreeIconsViewSession,
    getTreeLinkUrlByName,
    getTreeLinksAllSession,
    initBlocoProcessoHistorico,
    loadingButtonConfirm,
    mergeAllAndamentosProcesso,
    openWindowEditor,
    pullDadosProcessoSession,
    removeTreeDocumentById,
    replaceColorsIcons,
    resetDialogBoxPro,
    setSessionProcessosPro,
    updateTreeDocumentById
} from './modules.js';

export function batchActionsPro(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var _table = _parent.find('.tableDialog');
    var btnData = _this.data();
    var checkboxList = _table.find('tr.'+btnData.action).find('input[type="checkbox"]:checked').map(function(){ return $(this).val() }).get();

    window.loopActionsPro = {list: checkboxList, index: 0, sigilo: {}, assinatura: {}};
    $('#frmCheckerProcessoPro').remove();

    if (btnData.action !== 'documento_alterar' && btnData.action !== 'documento_assinar' && checkboxList.length > 0 && _parent.find('#iconsActions i.fa-spin').length == 0) {
        if (btnData.action == 'documento_excluir') {
            confirmaBoxPro('Tem certeza que deseja excluir '+(checkboxList.length > 1 ? 'os documentos selecionados' : 'o documento selecionado')+'?', function() { 
                getBatchActionsPro(this_);
                _this.data('lastclass',_this.find('i').attr('class')).find('i').attr('class', 'fas fa-sync fa-spin cinzaColor');
            }, 'Excluir');
        } else if (btnData.action == 'editor_montar') {
            confirmaBoxPro('Tem certeza que deseja cancelar a assinatura '+(checkboxList.length > 1 ? 'dos documentos selecionados' : 'do documento selecionado')+'?', function() { 
                getBatchActionsPro(this_);
                _this.data('lastclass',_this.find('i').attr('class')).find('i').attr('class', 'fas fa-sync fa-spin cinzaColor');
            }, 'Cancelar Assinatura');
        } else {   
            getBatchActionsPro(this_);
            _this.data('lastclass',_this.find('i').attr('class')).find('i').attr('class', 'fas fa-sync fa-spin cinzaColor');
        }
    } else if (btnData.action == 'documento_assinar' && checkboxList.length > 0 && _parent.find('#iconsActions i.fa-spin').length == 0) {
        var arrayLinksArvoreAll = getTreeLinksAllSession();
        var linkDoc = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('acao=arvore_visualizar') !== -1 && v.indexOf('id_documento='+checkboxList[0]) !== -1) });
        if (linkDoc.length > 0) {
                $.ajax({ url: linkDoc[0] }).done(function (htmlDoc) {
                    var $htmlDoc = $(htmlDoc);
                    var textLink = $htmlDoc.filter('script').not('[src*="js"]').text();
                    var arrayLinksArvoreDoc = getLinksInText(textLink);
                    var linkAssinar = arrayLinksArvoreDoc.filter(function(v){ return v.indexOf('documento_assinar') !== -1 });
                    if (linkAssinar.length > 0) {
                        $.ajax({ url: linkAssinar[0] }).done(function (htmlAssinar) {
                            var $htmlAssinar = $(htmlAssinar);
                            var selOrgao = $htmlAssinar.find('#selOrgao option').map(function(){ if ($(this).val() !== 'null') { return {value: $(this).val(), txt: $(this).text().trim(), selected: $(this).attr('selected') } } }).get();
                            var selContexto = $htmlAssinar.find('#selContexto option').map(function(){ if ($(this).val() !== 'null') { return {value: $(this).val(), txt: $(this).text().trim(), selected: $(this).attr('selected') } } }).get();
                            var selCargoFuncao = $htmlAssinar.find('#selCargoFuncao option').map(function(){ if ($(this).val() !== 'null') { return {value: $(this).val(), txt: $(this).text().trim(), selected: $(this).attr('selected') } } }).get();
                            var txtUsuario = $htmlAssinar.find('#txtUsuario').val();
                            // console.log(selOrgao, selContexto, selCargoFuncao);
                            var textBox =   '<div class="dialogBoxDiv seiProForm">'+
                                            '   <div class="configBoxPro_selOrgao">'+
                                            '       <label style="margin-bottom: 10px;display: block;">\u00D3rg\u00E3o do Assinante</label>'+
                                            '       <select id="configBoxPro_selOrgao" style="font-size: 10pt; width: 100%;">'+
                                            ($.map(selOrgao, function(v){ return '<option value="'+v.value+'" '+(v.selected ? v.selected : '')+'>'+v.txt+'</option>' }).join(''))+
                                            '       </select>'+
                                            '   </div>'+
                                            (typeof txtUsuario !== 'undefined' && txtUsuario != '' ? 
                                            '   <div class="configBoxPro_txtUsuario" style="margin-top:20px">'+
                                            '       <label style="margin-bottom: 10px;display: block;">Assinante</label>'+
                                            '       <input id="configBoxPro_txtUsuario" type="text" value="'+txtUsuario+'" style="font-size: 10pt; width: 96%;" disabled>'+
                                            '   </div>'+
                                            '': '')+
                                            '   <div class="configBoxPro_selContexto" style="margin-top:20px">'+
                                            '       <label style="margin-bottom: 10px;display: block;">Contexto do Assinante</label>'+
                                            '       <select id="configBoxPro_selContexto" style="font-size: 10pt; width: 100%;">'+
                                            ($.map(selContexto, function(v){ return '<option value="'+v.value+'" '+(v.selected ? v.selected : '')+'>'+v.txt+'</option>' }).join(''))+
                                            '       </select>'+
                                            '   </div>'+
                                            '   <div class="configBoxPro_selCargoFuncao" style="margin-top:20px">'+
                                            '       <label style="margin-bottom: 10px;display: block;">Cargo / Fun\u00E7\u00E3o</label>'+
                                            '       <select id="configBoxPro_selCargoFuncao" style="font-size: 10pt; width: 100%;">'+
                                            ($.map(selCargoFuncao, function(v){ return '<option value="'+v.value+'" '+(v.selected ? v.selected : '')+'>'+v.txt+'</option>' }).join(''))+
                                            '       </select>'+
                                            '   </div>'+
                                            '   <div class="configBoxPro_pwdSenha" style="margin-top:20px">'+
                                            '       <label style="margin-bottom: 10px;display: block;">Senha</label>'+
                                            '       <input id="configBoxPro_pwdSenha" onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" autocomplete="off" type="password" style="font-size: 10pt; width: 96%;">'+
                                            '   </div>'+
                                            '</div>';
                                resetDialogBoxPro('configBoxPro');
                                configBoxPro = $('#configBoxPro')
                                    .html('<div class="configBoxProDiv"> '+textBox+'</span>')
                                    .dialog({
                                        width: 450,
                                        title: 'Assinatura em lote',
                                        open: function(){
                                            $('#configBoxPro_selOrgao').chosen({ 
                                                placeholder_text_single: ' ', 
                                                no_results_text: 'Nenhum resultado encontrado',
                                                normalize_search_text: function(text) {
                                                    return removeAcentos(text.toLowerCase());
                                                } 
                                            });
                                            if (selContexto.length > 0) {
                                                $('#configBoxPro_selContexto').chosen({ 
                                                    placeholder_text_single: ' ', 
                                                    no_results_text: 'Nenhum resultado encontrado',
                                                    normalize_search_text: function(text) {
                                                        return removeAcentos(text.toLowerCase());
                                                    } 
                                                });
                                            } else {
                                                $('.configBoxPro_selContexto').hide();
                                            }
                                            $('#configBoxPro_selCargoFuncao').chosen({ 
                                                placeholder_text_single: ' ', 
                                                disable_search: true,
                                                no_results_text: 'Nenhum resultado encontrado',
                                                normalize_search_text: function(text) {
                                                    return removeAcentos(text.toLowerCase());
                                                } 
                                            });
                                            $('.ui-dialog[aria-describedby="configBoxPro"], #configBoxPro').css('overflow','visible');
                                            $('#configBoxPro_pwdSenha').focus();
                                        },
                                        buttons: [{
                                            text: "Assinar",
                                            class: 'confirm ui-state-active',
                                            click: function() {
                                                loadingButtonConfirm(true);
                                                var selOrgaoForm = $('#configBoxPro_selOrgao').val();
                                                var selContextoForm = $('#configBoxPro_selContexto').val();
                                                var selCargoFuncaoForm = $('#configBoxPro_selCargoFuncao').val();
                                                var pwdSenhaForm = $('#configBoxPro_pwdSenha').val();
                                                var txtUsuario = $('#configBoxPro_txtUsuario').val();

                                                loopActionsPro.assinatura = {orgao: selOrgaoForm, usuario: txtUsuario, contexto: selContextoForm, cargo: selCargoFuncaoForm, senha: pwdSenhaForm };
                                                getBatchActionsPro(this_);
                                                _this.data('lastclass',_this.find('i').attr('class')).find('i').attr('class', 'fas fa-sync fa-spin cinzaColor');
                                                resetDialogBoxPro('configBoxPro');
                                            }
                                        }]
                                });
                        });
                    }
                });
        }
    } else if (btnData.action == 'documento_alterar' && checkboxList.length > 0 && _parent.find('#iconsActions i.fa-spin').length == 0) {
        var textBox =   '<div class="dialogBoxDiv seiProForm">'+
                        '   <select id="configBoxProSigiloBatch" onchange="changeSelectHipoteseLegal(this)" style="font-size: 10pt; width: 100%;">'+
                        '       <option value="0" selected>P\u00FAblico</option>'+
                        '       <option value="1">Restrito</option>'+
                        '       <option value="2">Sigiloso</option>'+
                        '   </select>'+
                        '   <div style="margin-top:20px">'+
                        '       <select id="configBoxProSigiloBatch_hipoteses" class="select_hipoteses" style="font-size: 10pt; width: 100%; margin-top:20px;display:none;">'+
                        '       </select>'+
                        '   </div>'+
                        '</div>';
            resetDialogBoxPro('configBoxPro');
            configBoxPro = $('#configBoxPro')
                .html('<div class="configBoxProDiv"> '+textBox+'</span>')
                .dialog({
                    width: 450,
                    title: 'N\u00EDvel de acesso',
                    open: function(){
                        $('#configBoxProSigiloBatch').chosen({
                            placeholder_text_single: ' ',
                            no_results_text: 'Nenhum resultado encontrado',
                            normalize_search_text: function(text) {
                                return removeAcentos(text.toLowerCase());
                            }
                        });
                        $('.ui-dialog[aria-describedby="configBoxPro"], #configBoxPro').css('overflow','visible');
                    },
                    buttons: [{
                        text: "Editar",
                        class: 'confirm ui-state-active',
                        click: function() {
                            loadingButtonConfirm(true);
                            var value = $('#configBoxProSigiloBatch').val().trim();
                            var hipotese = $('#configBoxProSigiloBatch_hipoteses').val() !== null ? $('#configBoxProSigiloBatch_hipoteses').val().trim() : false;
                            var text = (value == '0') ? '' : 'Acesso '+$('#configBoxProSigiloBatch').find('option:selected').text()+' '+$('#configBoxProSigiloBatch_hipoteses').find('option:selected').text();
                            var elementOption = (value == '0') ? 'optPublico' : false;
                                elementOption = (value == '2') ? 'optSigiloso' : elementOption;
                                elementOption = (value == '1') ? 'optRestrito' : elementOption;

                                loopActionsPro.sigilo = {value: value, hipotese: hipotese, element: elementOption, text: text };
                                getBatchActionsPro(this_);
                                _this.data('lastclass',_this.find('i').attr('class')).find('i').attr('class', 'fas fa-sync fa-spin cinzaColor');
                                resetDialogBoxPro('configBoxPro');
                        }
                    }]
            });
    }
}
export function getBatchActionsPro(this_) {
    var id_documento = loopActionsPro.list[loopActionsPro.index];
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var _table = _parent.find('.tableDialog');
    var _ifrArvore = $('#ifrArvore');
    var ifrArvore = _ifrArvore.contents();
    var arrayLinksArvoreAll = getTreeLinksAllSession();
    var arrayIconsView = getTreeIconsViewSession();
    var doc = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('acao=arvore_visualizar') !== -1 && v.indexOf('id_documento='+id_documento) !== -1) });

    if (doc.length > 0) {
            var tr = _table.find('tr[data-index="'+id_documento+'"]');
                td_doc = tr.find('td.documento');
                tr.find('td.documento').prepend('<i class="fas fa-sync fa-spin azulColor batchLoading"></i> ');
                $.ajax({ url: doc[0] }).done(function (html) {
                    var id_documento = loopActionsPro.list[loopActionsPro.index];
                    var $html = $(html);
                    var textLink = $html.filter('script').not('[src*="js"]').text();
                    var arrayLinksArvoreDoc = getLinksInText(textLink);
                    var btnData = _this.data();
                    var linkAction = arrayLinksArvoreDoc.filter(function(v){ return (v.indexOf('acao='+btnData.action) !== -1) });
                        linkAction = (linkAction.length == 0) ? arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf(btnData.action) !== -1) }) : linkAction;
                    var listIconsView = (arrayIconsView.length > 0) ? jmespath.search(arrayIconsView, "[?id_documento==`"+id_documento+"`] | [0].icones") : null;
                        listIconsView = (listIconsView === null) ? [] : listIconsView;
                    var checkIconView = listIconsView.filter(function(v){ return v.indexOf(btnData.icon) !== -1 });

                    /*
                    console.log({
                        id_documento: id_documento, 
                        select_id_documento: arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1) }), 
                        action: arrayLinksArvoreAll.filter(function(v){ return (v.indexOf(btnData.action) !== -1) }), 
                        btnData:btnData, 
                        linkAction:linkAction, 
                        arrayLinksArvoreAll:arrayLinksArvoreAll, 
                        checkIconView:checkIconView
                    });
                    */

                    if (btnData.action != 'documento_visualizar' && btnData.action != 'documento_alterar' && btnData.action != 'documento_assinar' && btnData.action != 'documento_duplicar' && linkAction.length > 0 && checkIconView.length > 0) {
                        $.ajax({ url: linkAction }).done(function (htmlArvore) {
                            var dadosProcessoPro = pullDadosProcessoSession();
                            var id_documento = loopActionsPro.list[loopActionsPro.index];
                            tr.removeClass('infraTrMarcada').find('i.batchLoading').remove();
                            tr.find('td.documento').prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
                            tr.find('input').prop('checked',false);
                            if (btnData.action == 'documento_excluir') {
                                tr.removeClass('documento_excluir').find('input').prop('disabled', true);
                                tr.find('td.icons').html('');
                                ifrArvore.find('#anchorImg'+id_documento).prev().remove().end().prev().remove();
                                ifrArvore.find('#anchorImg'+id_documento+', #anchor'+id_documento+',  #anchorUG'+id_documento+', .action-doc[data-id="'+id_documento+'"], #anchorCD'+id_documento).remove();
                            } else if (btnData.action == 'editor_montar') {
                                ifrArvore.find('#anchorA'+id_documento).remove();
                                tr.find('td.icons').find('a[data-action="editor_montar"]').remove();
                                tr.find('td.assinatura').html('');
                                tr.find('td.data_assinatura').html('');
                            }
                            if (btnData.action == 'documento_excluir') {
                                removeTreeDocumentById(id_documento, dadosProcessoPro);
                            } else if (btnData.action == 'editor_montar') {
                                updateTreeDocumentById(id_documento, {
                                    assinatura: '',
                                    data_assinatura: ''
                                }, dadosProcessoPro);
                            }
                            // console.log('->seetSessionProcessosPro', dadosProcessoPro.listAndamento);
                            setSessionProcessosPro(dadosProcessoPro);

                            loopActionsPro.index = loopActionsPro.index+1;
                            if (typeof loopActionsPro.list[loopActionsPro.index] !== 'undefined') {
                                getBatchActionsPro(this_);
                            } else {
                                window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
                                $(this_).find('i').attr('class', $(this_).data('lastclass'));
                                var ifrArvore = getIframeArvoreElement();
                                if (ifrArvore && ifrArvore.contentWindow) ifrArvore.contentWindow.location.reload();
                                initAppendIconsDocumentosActions();
                            }
                        });
                    } else if (btnData.action == 'documento_duplicar' && checkIconView.length > 0) {
                        var id_documento = loopActionsPro.list[loopActionsPro.index];

                        function resetDocsActions(){
                            window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
                            $(this_).find('i').attr('class', $(this_).data('lastclass'));
                            setTimeout(function(){ 
                                var ifrArvore = getIframeArvoreElement();
                                if (ifrArvore && ifrArvore.contentWindow) ifrArvore.contentWindow.location.reload();
                                initAppendIconsDocumentosActions();
                            }, 1000);
                        }
                        
                        if (typeof id_documento !== 'undefined') {
                            console.log(id_documento, tr[0], loopActionsPro, loopActionsPro, loopActionsPro.index, loopActionsPro.list[loopActionsPro.index]);
                            $('#ifrArvore')[0].contentWindow.getDadosDoc($('#ifrArvore').contents().find('#anchor'+id_documento), false, false, 
                            function(){
                                tr.removeClass('infraTrMarcada').find('i.batchLoading').remove();
                                tr.find('td.documento').prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
                                tr.find('input').prop('checked',false);
                                loopActionsPro.index = loopActionsPro.index+1;
                                console.log(loopActionsPro.list[loopActionsPro.index]);
                                getBatchActionsPro(this_);
                                if (typeof loopActionsPro.list[loopActionsPro.index] === 'undefined') {
                                    resetDocsActions();
                                }
                            }, function(){
                                tr.find('i.batchLoading').remove();
                                tr.find('td.documento').prepend('<i class="fas fa-times-circle vermelhoColor batchLoading"></i> ');
                                loopActionsPro.index = loopActionsPro.index+1;
                                console.log(loopActionsPro.list[loopActionsPro.index]);
                                getBatchActionsPro(this_);
                                if (typeof loopActionsPro.list[loopActionsPro.index] === 'undefined') {
                                    resetDocsActions();
                                }
                            });
                        } else if (typeof id_documento === 'undefined' || typeof loopActionsPro.list[loopActionsPro.index+1] === 'undefined') {
                            resetDocsActions();
                        }
                    } else if (btnData.action == 'documento_assinar' && linkAction.length > 0 && checkIconView.length > 0) {
                        var orgao = loopActionsPro.assinatura.orgao;
                        var contexto = loopActionsPro.assinatura.contexto;
                        var cargo = loopActionsPro.assinatura.cargo;
                        var senha = loopActionsPro.assinatura.senha;
                        var usuario_assinante = loopActionsPro.assinatura.usuario;

                        if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
                        $('#frmCheckerProcessoPro').attr('src', linkAction[0]).unbind().on('load', function(){
                            var iframe = $(this).contents();
                            var usuario = iframe.find('#txtUsuario').val();
                                iframe.find('#selOrgao').val(orgao);
                                iframe.find('#selContexto').val(contexto);
                                iframe.find('#selCargoFuncao').val(cargo);
                                iframe.find('#pwdSenha').remove();
                                // iframe.find('#pwdSenha').val(senha);
                                iframe.find('#divAutenticacao').append('<input id="pwdSenha" name="pwdSenha" type="hidden" value="'+senha+'">');
                            var assinatura = usuario+' / '+cargo;
                            var data_assinatura = moment().format('DD/MM/YYYY HH:mm');

                            console.log(loopActionsPro, senha);
                            
                            $(this).unbind();
                            iframe.find('#btnAssinar').trigger('click');

                            $('#frmCheckerProcessoPro').on('load', function(){
                                $(this).unbind();
                                var _validacao = $(this).contents().find('#txaInfraValidacao');

                                if (_validacao.length > 0 && _validacao.val() != '') {
                                    tr.find('i.batchLoading').remove();
                                    tr.find('td.documento').prepend('<i class="fas fa-times-circle vermelhoColor batchLoading"></i> ');
            
                                    loopActionsPro.index = loopActionsPro.index+1;
                                    if (typeof loopActionsPro.list[loopActionsPro.index] !== 'undefined') {
                                        getBatchActionsPro(this_);
                                    } else {
                                        window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
                                        $(this_).find('i').attr('class', $(this_).data('lastclass'));
                                        var ifrArvore = getIframeArvoreElement();
                                        if (ifrArvore && ifrArvore.contentWindow) ifrArvore.contentWindow.location.reload();
                                        initAppendIconsDocumentosActions();
                                    }
                                } else {
                                    tr.removeClass('infraTrMarcada').find('i.batchLoading').remove();
                                    tr.find('td.documento').prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
                                    tr.find('td.assinatura').html(assinatura);
                                    tr.find('td.data_assinatura').html(data_assinatura);
                                    tr.find('input').prop('checked',false);

                                    var dadosProcessoPro = pullDadosProcessoSession();
                                    updateTreeDocumentById(id_documento, {
                                        assinatura: assinatura,
                                        data_assinatura: data_assinatura
                                    }, dadosProcessoPro);
                                    // console.log('->seetSessionProcessosPro', dadosProcessoPro.listAndamento);
                                    setSessionProcessosPro(dadosProcessoPro);

                                    loopActionsPro.index = loopActionsPro.index+1;
                                    if (typeof loopActionsPro.list[loopActionsPro.index] !== 'undefined') {
                                            getBatchActionsPro(this_);
                                    } else {
                                        window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
                                        $(this_).find('i').attr('class', $(this_).data('lastclass'));
                                        setTimeout(function(){ 
                                            var ifrArvore = getIframeArvoreElement();
                                            if (ifrArvore && ifrArvore.contentWindow) ifrArvore.contentWindow.location.reload();
                                            initAppendIconsDocumentosActions();
                                        }, 1000);
                                    }
                                }
                            });
                        });
                    } else if (btnData.action == 'documento_visualizar' && linkAction.length > 0 && checkIconView.length > 0) {

                        var id_documento = loopActionsPro.list[loopActionsPro.index];
                        if (typeof id_documento !== 'undefined') {
                            console.log('*****', loopActionsPro);
                            var urlLink = linkAction[0];
                            var link = document.createElement('a');
                                link.href = urlLink;
                                
                                if (urlLink.indexOf('documento_download_anexo') === -1) {
                                    link.download =  ifrArvore.find('#anchor'+id_documento).text().trim()+'.html';
                                } else {
                                    link.download =  ifrArvore.find('#anchor'+id_documento).text().trim();
                                }
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);


                            tr.removeClass('infraTrMarcada').find('i.batchLoading').remove();
                            tr.find('td.documento').prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
                            tr.find('input').prop('checked',false);

                            loopActionsPro.index = loopActionsPro.index+1;
                            if (typeof loopActionsPro.list[loopActionsPro.index] !== 'undefined') {
                                getBatchActionsPro(this_);
                            } else {
                                window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
                                $(this_).find('i').attr('class', $(this_).data('lastclass'));
                            }

                        } else if (typeof id_documento === 'undefined' || typeof loopActionsPro.list[loopActionsPro.index+1] === 'undefined') {
                            resetDocsActions();
                        }

                    } else if (btnData.action == 'documento_alterar' && linkAction.length > 0 && checkIconView.length > 0) {
                        var idElement = loopActionsPro.sigilo.element;
                        var hipotese = loopActionsPro.sigilo.hipotese;
                        var text_hipotese = loopActionsPro.sigilo.text;

                        if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
                        $('#frmCheckerProcessoPro').attr('src', linkAction[0]).unbind().on('load', function(){
                            var iframe = $(this).contents();
                            var element = iframe.find('#'+idElement);
                                element.prop('checked',true).trigger('change');
                            if (idElement == 'optRestrito' || idElement == 'optSigiloso') {
                                iframe.find('#selHipoteseLegal').after('<input id="selHipoteseLegal" value="'+hipotese+'" name="selHipoteseLegal"></input>').remove();
                            }
                            
                            $(this).unbind();
                            if (iframe.find('button[type="submit"]').length > 0) {
                                iframe.find('button[type="submit"]').trigger('click');
                            } else {
                                iframe.find('button[name="btnSalvar"]').trigger('click');
                            }
                            tr.removeClass('infraTrMarcada').find('i.batchLoading').remove();
                            tr.find('td.documento').prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
                            tr.find('td.sigilo').html(text_hipotese);
                            tr.find('input').prop('checked',false);

                            var dadosProcessoPro = pullDadosProcessoSession();
                            updateTreeDocumentById(id_documento, {
                                sigilo: text_hipotese
                            }, dadosProcessoPro);
                            // console.log('->seetSessionProcessosPro', dadosProcessoPro.listAndamento);
                            setSessionProcessosPro(dadosProcessoPro);

                            loopActionsPro.index = loopActionsPro.index+1;
                            if (typeof loopActionsPro.list[loopActionsPro.index] !== 'undefined') {
                                getBatchActionsPro(this_);
                            } else {
                                window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
                                $(this_).find('i').attr('class', $(this_).data('lastclass'));
                                initAppendIconsDocumentosActions();
                            }
                        });
                    } else {
                        tr.find('i.batchLoading').remove();
                        tr.find('td.documento').prepend('<i class="fas fa-times-circle vermelhoColor batchLoading"></i> ');

                        loopActionsPro.index = loopActionsPro.index+1;
                        if (typeof loopActionsPro.list[loopActionsPro.index] !== 'undefined') {
                            getBatchActionsPro(this_);
                        } else {
                            window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
                            $(this_).find('i').attr('class', $(this_).data('lastclass'));
                            var ifrArvore = getIframeArvoreElement();
                            if (ifrArvore && ifrArvore.contentWindow) ifrArvore.contentWindow.location.reload();
                            initAppendIconsDocumentosActions();
                        }
                    }
                });
    }
}
export function getDocumentosActions() {
    getListDocumentosArvore($('#ifrArvore').contents());
    var dadosProcesso = pullDadosProcessoSession();
    var listDocumentos = getTreeDocumentsSession(dadosProcesso);
        var htmlBox =   '<div id="iconsActions">'+
                        '   <a class="newLink documento_ciencia" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Ci\u00EAncia\')" data-action="documento_ciencia" data-icon="'+(SeiPro.sei.adapter.isNewSEI() ? 'ciencia' : 'sei_ciencia')+'">'+
                        '       <span class="fa-layers fa-fw">'+
                        '           <i class="fas fa-thumbs-up azulColor"></i>'+
                        '           <span class="fa-layers-counter" style="display:none">1</span>'+
                        '       </span>'+
                        '   </a>'+
                        '   <a class="newLink documento_visualizar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Baixar documento\')" data-action="documento_visualizar" data-icon="'+(SeiPro.sei.adapter.isNewSEI() ? 'consultar_alterar_protocolo' : 'sei_consultar_alterar_protocolo')+'">'+
                        '       <span class="fa-layers fa-fw">'+
                        '           <i class="fas fa-download azulColor"></i>'+
                        '           <span class="fa-layers-counter" style="display:none">1</span>'+
                        '       </span>'+
                        '   </a>'+
                        '   <a class="newLink documento_excluir" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Excluir\')" data-action="documento_excluir" data-icon="'+(SeiPro.sei.adapter.isNewSEI() ? 'protocolo_excluir' : 'sei_lixeira')+'">'+
                        '       <span class="fa-layers fa-fw">'+
                        '           <i class="fas fa-trash-alt vermelhoColor"></i>'+
                        '           <span class="fa-layers-counter" style="display:none">1</span>'+
                        '       </span>'+
                        '   </a>'+
                        '   <a class="newLink documento_alterar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Alterar Sigilo\')" data-action="documento_alterar" data-icon="'+(SeiPro.sei.adapter.isNewSEI() ? 'documento_alterar' : 'sei_consultar_alterar_protocolo')+'">'+
                        '       <span class="fa-layers fa-fw">'+
                        '           <i class="fas fa-key laranjaColor"></i>'+
                        '           <span class="fa-layers-counter" style="display:none">1</span>'+
                        '       </span>'+
                        '   </a>'+
                        '   <a class="newLink documento_assinar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Assinar\')" data-action="documento_assinar" data-icon="'+(SeiPro.sei.adapter.isNewSEI() ? 'documento_assinar' : 'sei_assinar')+'">'+
                        '       <span class="fa-layers fa-fw">'+
                        '           <i class="fas fa-pen-alt laranjaColor"></i>'+
                        '           <span class="fa-layers-counter" style="display:none">1</span>'+
                        '       </span>'+
                        '   </a>'+
                        '   <a class="newLink editor_montar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Cancelar Assinatura\')" data-action="editor_montar" data-icon="'+(SeiPro.sei.adapter.isNewSEI() ? 'documento_editar_conteudo' : 'sei_editar_conteudo')+'">'+
                        '       <span class="fa-layers fa-fw">'+
                        '           <i class="fas fa-ban vermelhoColor"></i>'+
                        '           <span class="fa-layers-counter" style="display:none">1</span>'+
                        '       </span>'+
                        '   </a>'+
                        '   <a class="newLink documento_duplicar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Duplicar Documento\')" data-action="documento_duplicar" data-icon="'+(SeiPro.sei.adapter.isNewSEI() ? 'documento_alterar' : 'sei_consultar_alterar_protocolo')+'">'+
                        '       <span class="fa-layers fa-fw">'+
                        '           <i class="fas fa-copy azulColor"></i>'+
                        '           <span class="fa-layers-counter" style="display:none">1</span>'+
                        '       </span>'+
                        '   </a>'+
                        '</div>'+
                        '<div id="boxActions" class="tabelaPanelScroll" style="margin-top: 10px;height: 550px;">'+
                        '   <table id="actionsTablePro" style="font-size: 8pt !important;width: 100%;" class="seiProForm tabelaControle tableDialog tableInfo tableZebra">'+
                        '        <thead>'+
                        '            <tr class="tableHeader" onmouseout="infraTooltipOcultar();">'+
                        '                <th class="tituloControle" style="text-align: center;width: 50px;"><span class="lblInfraCheck" aria-hidden="true"></span><a style="text-align: center; display: block;" id="lnkInfraCheck" onclick="setSelectAllTr(this, \'SemGrupo\');"><img src="/infra_css/'+(SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg': 'imagens/check.gif')+'" id="imgRecebidosCheck" title="Selecionar Tudo" alt="Selecionar Tudo" class="infraImg"></a></th>'+
                        '                <th class="tituloControle" style="text-align: center;">N\u00BA SEI</th>'+
                        '                <th class="tituloControle" style="text-align: center;">Documento</th>'+
                        '                <th class="tituloControle" style="text-align: center;">Assinatura</th>'+
                        '                <th class="tituloControle" style="text-align: center;">Data da Assinatura</th>'+
                        '                <th class="tituloControle" style="text-align: center;">Data do Documento</th>'+
                        '                <th class="tituloControle" style="text-align: center;">Unidade</th>'+
                        '                <th class="tituloControle" style="text-align: center;">Sigilo</th>'+
                        '                <th class="tituloControle" style="text-align: center; width: 140px;">A\u00E7\u00F5es</th>'+
                        '            </tr>'+
                        '        </thead>'+
                        '        <tbody>';
        if (listDocumentos){
            $.each(listDocumentos, function(i, v){
                htmlBox +=  '   <tr style="text-align: left;" data-tagname="SemGrupo" data-index="'+v.id_protocolo+'">'+
                            '       <td style="text-align: center;">'+
                            '           <input type="checkbox" onclick="followSelecionarItens(this)" name="actionsPro" value="'+v.id_protocolo+'">'+
                            '       </td>'+
                            '       <td>'+v.nr_sei+'</td>'+
                            '       <td class="documento"><a class="newLink" onclick="getDocOnArvore('+v.id_protocolo+')" style="display: initial;font-size: 10pt;text-decoration: underline;"><i class="far fa-file azulColor" style="margin-right: 5px;"></i>'+v.documento+'</a></td>'+
                            '       <td class="assinatura">'+v.assinatura+'</td>'+
                            '       <td class="data_assinatura"></td>'+
                            '       <td class="data_documento">'+(v.data_documento ? moment(v.data_documento, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') : '')+'</td>'+
                            '       <td class="unidade"></td>'+
                            '       <td class="sigilo">'+v.sigilo+'</td>'+
                            '       <td class="icons"></td>'+
                            '   </tr>';

            });
        }
        htmlBox +=          '   </table>'+
                            '</div>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'A\u00E7\u00F5es em lote',
            width: $('body').width()-300,
            height: 650,
            resize: function(event, ui) {
                setTabelaPanelScrollHeight('#boxActions', 80);
            },
            open: function() { 
                if (typeof $().chosen === 'undefined' && typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
                alertaBoxPro('Sucess', 'sync fa-spin', 'Aguarde... Pesquisando links de documentos');
                var urlAllPasta = $('#ifrArvore').contents().find('#topmenu a[id*="anchorAP"]').attr('href');
                if (typeof urlAllPasta !== 'undefined' && urlAllPasta !== '') {
                    $('#ifrArvore').attr('src', urlAllPasta).unbind().on('load', function(){
                        $(this).unbind();
                        getListDocumentosArvore($('#ifrArvore').contents());
                        resetDialogBoxPro('alertBoxPro');
                    })
                } else {
                    getAllLinksFolder();
                }
                setTabelaPanelScrollHeight('#boxActions', 80);
                initAppendIconsDocumentosActions();
                mergeAllAndamentosProcesso(function(){
                    var actionsTable = $('#actionsTablePro');
                    var listDocumentos = getTreeDocumentsSession(dadosProcessoPro);
                    if (listDocumentos.length > 0) {
                        actionsTable.find('tbody tr').each(function(){
                            var id_protocolo = $(this).data('index');
                            var values = jmespath.search(listDocumentos, "[?id_protocolo=='"+id_protocolo+"'] | [0]");
                            if (values !== null) {
                                $(this).find('td.unidade').text((values.unidade ? values.unidade : ''));
                                $(this).find('td.data_assinatura').text((values.assinado && values.data_assinatura ? moment(values.data_assinatura, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') : ''));
                                if (values.data_documento) {
                                    $(this).find('td.data_documento').text(moment(values.data_documento, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm'));
                                }
                            }
                        }).trigger('update');
                    }
                    resetDialogBoxPro('alertBoxPro');
                });
                window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
            },
            close: function() { 
                $('#boxActions').remove();
                resetDialogBoxPro('dialogBoxPro');
                resetDialogBoxPro('alertBoxPro');
            }
    });
    setTimeout(function(){ 
        var actionsTable = $('#actionsTablePro');
            actionsTable.tablesorter({
                sortLocaleCompare : true,
                textExtraction: {
                    4: function (elem, table, cellIndex) {
                        var text_date = $(elem).text() != '' ? moment($(elem).text(), 'DD/MM/YYYY').format('YYYY-MM-DD') : false;
                        return text_date;
                    },
                    5: function (elem, table, cellIndex) {
                        var text_date = $(elem).text() != '' ? moment($(elem).text(), 'DD/MM/YYYY').format('YYYY-MM-DD') : false;
                        return text_date;
                    },
                    8: function (elem, table, cellIndex) {
                        var sort = $(elem).find('a').map(function(){ return $(this).data('action') }).get().join(' ');
                        return sort;
                    }
                },
                widgets: ["saveSort", "filter"],
                widgetOptions: {
                    saveSort: true,
                    filter_hideFilters: true,
                    filter_columnFilters: true,
                    filter_saveFilters: true,
                    filter_hideEmpty: true,
                    filter_excludeFilter: {}
                },
                sortReset: true,
                headers: {
                    0: { sorter: false, filter: false },
                    1: { filter: true },
                    2: { filter: true },
                    3: { filter: true },
                    4: { filter: true },
                    6: { filter: true },
                    5: { filter: true }
                }
            }).on("filterEnd", function (event, data) {
                checkboxRangerSelectShift();
                var caption = $(this).find("caption").eq(0);
                var tx = caption.text();
                    caption.text(tx.replace(/\d+/g, data.filteredRows));
                    $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                    $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
            });
            // initPanelResize('#boxActions', 'actionsPro');

        var filterAction = actionsTable.find('.tablesorter-filter-row').get(0);
        if (typeof filterAction !== 'undefined') {
            var observerFilterAction = new MutationObserver(function(mutations) {
                var _this = $(mutations[0].target);
                var _parent = _this.closest('table');
                var iconFilter = _parent.find('.filterTableActions button');
                var checkIconFilter = iconFilter.hasClass('active');
                var hideme = _this.hasClass('hideme');
                if (hideme && checkIconFilter) {
                    iconFilter.removeClass('active');
                }
            });

            var observerTableActions = new MutationObserver(function(mutations) {
                var _this = $(mutations[0].target);
                var _parent = _this.closest('table');
                function updateCountIcon(_parent, class_icon) {
                    var counter = _parent.find('tr.infraTrMarcada.'+class_icon).length;
                    if (counter > 0) {
                        $('#iconsActions').find('.'+class_icon).find('.fa-layers-counter').text(counter).show();
                    } else {
                        $('#iconsActions').find('.'+class_icon).find('.fa-layers-counter').hide();
                    }
                }
                updateCountIcon(_parent, 'documento_visualizar');
                updateCountIcon(_parent, 'documento_ciencia');
                updateCountIcon(_parent, 'documento_excluir');
                updateCountIcon(_parent, 'documento_alterar');
                updateCountIcon(_parent, 'documento_assinar');
                updateCountIcon(_parent, 'editor_montar');
                updateCountIcon(_parent, 'documento_duplicar');
            });
            setTimeout(function(){ 
                var htmlFilterActions =    '<div class="btn-group filterTableActions" role="group" style="right: 45px;top: 18px;z-index: 999;position: absolute;">'+
                                            '   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">'+
                                            '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                            '       <span class="text">Baixar</span>'+
                                            '   </button>'+
                                            '   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                                            '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                            '       <span class="text">Copiar</span>'+
                                            '   </button>'+
                                            '   <button type="button" onclick="filterTablePro(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light '+(actionsTable.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active')+'">'+
                                            '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                            '       Pesquisar'+
                                            '   </button>'+
                                            '</div>';
                    actionsTable.find('thead .filterTableActions').remove();
                    actionsTable.find('thead').prepend(htmlFilterActions);
                    observerFilterAction.observe(filterAction, {
                        attributes: true
                    });
                    actionsTable.find('tbody tr').each(function(){
                        observerTableActions.observe(this, {
                                attributes: true
                        });
                    });
                    checkboxRangerSelectShift();
            }, 1000);
        }
    }, 500);
    if (typeof $().visible == 'undefined') $.getScript(URL_SPRO+"js/lib/jquery-visible.min.js");
}
export function setTabelaPanelScrollHeight(target, padding) {
    var availableHeight = $('#dialogBoxPro').outerHeight(true)-padding;
    $(target).css({'max-height': availableHeight, 'height': availableHeight, 'min-height': availableHeight});
}

export function initAppendIconsDocumentosActions(TimeOut = 3000) {
    if (TimeOut <= 0) { 
        setAppendIconsDocumentosActions();
        return; 
    }
    var arrayIconsView = getTreeIconsViewSession();
    if (typeof arrayIconsView !== 'undefined' && arrayIconsView.length >= $('#actionsTablePro').find('tbody tr').length) {
        setAppendIconsDocumentosActions();
    } else {
        setTimeout(function(){ 
            initAppendIconsDocumentosActions(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initAppendIconsDocumentosActions => '+TimeOut); 
        }, 500);
    }
}
export function setAppendIconsDocumentosActions() {
    var actionsTable = $('#actionsTablePro');
    var _ifrArvore = $('#ifrArvore');
    var arrayIconsView = getTreeIconsViewSession();
    var dadosProcesso = pullDadosProcessoSession();
    var listDocumentos = getTreeDocumentsSession(dadosProcesso);


    actionsTable.find('tbody tr').each(function(){
        var id_documento = $(this).data('index');
        var td_icon = $(this).find('td.icons');
        var iconList = jmespath.search(arrayIconsView, "[?id_documento==`"+id_documento+"`] | [0].icones");
        var dataDocumento = (listDocumentos.length > 0) ? jmespath.search(listDocumentos, "[?id_protocolo=='"+id_documento+"'] | [0]") : null;
        var htmlIcon = '';
        var classIcon = '';
        if (iconList !== null) {

            if (iconList.filter(function(v){ return (v.indexOf('sei_lixeira') !== -1 || v.indexOf('protocolo_excluir') !== -1) }).length > 0) {
                htmlIcon += ' <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_excluir" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Excluir\')" style="margin: 0;padding: 5px 0;"><i class="fas fa-trash-alt vermelhoColor"></i></a>';
                classIcon += 'documento_excluir ';
            }
            if (iconList.filter(function(v){ return v.indexOf('ciencia') !== -1 }).length > 0) {
                htmlIcon += ' <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_ciencia" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Ci\u00EAncia\')" style="margin: 0;padding: 5px 0;"><i class="fas fa-thumbs-up azulColor"></i></a>';
                classIcon += 'documento_ciencia ';
            }
            if (iconList.filter(function(v){ return v.indexOf('consultar') !== -1 }).length > 0) {
                htmlIcon += ' <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_visualizar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Baixar documento\')" style="margin: 0;padding: 5px 0;"><i class="fas fa-download azulColor"></i></a>';
                classIcon += 'documento_visualizar ';
            }
            if (iconList.filter(function(v){ return (v.indexOf('sei_consultar_alterar_protocolo') !== -1 || v.indexOf('documento_alterar') !== -1) }).length > 0) {
                htmlIcon += ' <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_alterar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Alterar sigilo\')" style="margin: 0;padding: 5px 0;"><i class="fas fa-key laranjaColor"></i></a>';
                classIcon += 'documento_alterar ';
            }
            if (iconList.filter(function(v){ return (v.indexOf('sei_assinar') !== -1 || v.indexOf('documento_assinar') !== -1) }).length > 0) {
                htmlIcon += ' <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_assinar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Assinar\')" style="margin: 0;padding: 5px 0;"><i class="fas fa-pen-alt laranjaColor"></i></a>';
                classIcon += 'documento_assinar ';
            }
            if (iconList.filter(function(v){ return (v.indexOf('sei_editar_conteudo') !== -1 || v.indexOf('sei_assinar') !== -1 || v.indexOf('documento_assinar') !== -1 || v.indexOf('documento_editar_conteudo') !== -1) }).length > 1 && dataDocumento !== null && typeof dataDocumento.assinatura !== 'undefined' && dataDocumento.assinatura != '' ) {
                htmlIcon += ' <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="editor_montar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Cancelar Assinatura\')" style="margin: 0;padding: 5px 0;"><i class="fas fa-ban vermelhoColor"></i></a>';
                classIcon += 'editor_montar ';
            }
            if (iconList.filter(function(v){ return (v.indexOf('sei_consultar_alterar_protocolo') !== -1 || v.indexOf('documento_alterar') !== -1) }).length > 0) {
                htmlIcon += ' <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_duplicar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Duplicar Documento\')" style="margin: 0;padding: 5px 0;"><i class="fas fa-copy azulColor"></i></a>';
                classIcon += 'documento_duplicar ';
            }
        }
        td_icon.html(htmlIcon);
        $(this).addClass(classIcon);
    }).trigger('update');
}
export function batchActionsSinglePro(this_) {
    var _this = $(this_);
    var _table = _this.closest('table');
    var action = _this.data('action');
        _table.find('thead th a[onclick*="setSelectAllTr"]').data('index',1).trigger('click');
        _this.closest('tr').find('input[type=checkbox]').trigger('click');
        $('#iconsActions').find('a.'+action).trigger('click');
}
export function copyLinkProcesso(this_) {
    var _this = $(this_);
    var id_procedimento = _this.data('id_procedimento');
    var linkProc = parent.url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento;
    copyToClipboard(linkProc);
    _this.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}
/*
export function verifyMenuSistemaView() {
    var prefixoCookie = $('#hdnInfraPrefixoCookie').val();
    if (infraLerCookie(prefixoCookie+'_menu_mostrar') == 'N' && $(mainMenu).is(':visible')) {
        $('#lnkInfraMenuSistema').trigger('click');
    }
    checkMenuSistemaView();
}
*/
export function getDocsArvore_fillSelect(select, optionBlank = false, disableId = false, docExternoDisable = true, docExternoOnlyPDF = false) {
    let idRef = $('#ifrArvore').contents().find('#content .infraArvoreNoSelecionado').attr('id');
        idRef = typeof idRef !== 'undefined' ? idRef.replace('span','') : false;
    let resultado = optionBlank ? '<option value="">&nbsp;</option>' : '';
    let contadorDocsValidos = 0;
        dataDocs.forEach((doc) => {
            if (
                doc.cancelado 
                || (docExternoDisable && doc.externo) 
                || (!docExternoDisable && doc.externo && docExternoOnlyPDF && !/pdf/i.test(doc.image) ) 
                || !doc.src 
                || disableId == doc.id_documento
            ) {
                resultado += `<option value="${doc.nome}" data-nr_sei="${doc.numero}" data-id_procedimento="${doc.id_procedimento}" data-id_documento="${doc.id_documento}" disabled title="Documento n\u00E3o v\u00E1lido">${doc.nome}</option>`
            } else {
                let selected = idRef.toString() == doc.id_documento.toString() ? 'selected' : '';
                resultado += `<option value="${doc.nome}" data-nr_sei="${doc.numero}" data-id_procedimento="${doc.id_procedimento}" data-id_documento="${doc.id_documento}" ${selected}>${doc.nome}</option>`;
                contadorDocsValidos++;
            }
        });
    if (contadorDocsValidos === 0) {
        select.after(`<small class="noFieldsError">N\u00E3o h\u00E1 documentos v\u00E1lidos<small>`);
    } else {
        select.removeAttr('disabled');
        select.children().remove();
        select.append(resultado);
    }
    select.trigger('chosen:updated');
    $('#'+select.attr('id')+'_chosen').removeClass('chosenLoading');
}
export function getDocsArvore(select = false, callback_end = false, callback_done = false, optionBlank = false, disableId = false) {
    dataDocs = [];
    /* Verifica se existe o botão (+) para expandir pastas na árvore */
    const urlBtnExpandirPastas = $("#ifrArvore").contents().find("[id^='anchorAP']").attr('href');
    const urlArvore = $("#ifrArvore").attr('src');
    const urlBusca = urlBtnExpandirPastas ? urlBtnExpandirPastas : urlArvore;
    const id_procedimento = getParamsUrlPro(urlArvore).id_procedimento ?? false;

    $.get(urlBusca).done((htmlArvore) => { 
        dataDocs = setDataDocs(htmlArvore, id_procedimento);
        if (typeof callback_end === 'function') callback_end(select, optionBlank, disableId);
    }).then(() => {
        if (typeof callback_done === 'function') callback_done();
    });
}
export function setDataDocs(htmlArvore, id_procedimento) {
    let listDocs = [];
    const lines = htmlArvore.split('\n');
    const pattern1 = /^Nos\[\d{1,}\] = new infraArvoreNo\("DOCUMENTO/i;
    const pattern2 = /^Nos\[\d{1,}\]\.src = 'controlador/i;

    lines.forEach((line) => {
        if (pattern1.test(line)) {
            const nrNo = line.substring(1, line.indexOf(']')).match(/\d{1,}/)[0];
            const props = line.slice(line.indexOf('(') + 1, line.lastIndexOf(')')).replaceAll(`"`, ``).replaceAll(`\\\\`).split(',');
            const split_doc = line.split('"');
            if (props[17]) { //documentos com vírgula têm quebra de linha por conta do split. Esta condição concatena as linhas quebradas
                listDocs.push({
                    nrNo,
                    nome: `${props[5]},${props[6]}`,
                    numero: SeiPro.sei.adapter.isNewSEI() ? split_doc[25] : split_doc[21],
                    id_documento: split_doc[3],
                    cancelado: props[7].startsWith('Documento Cancelado') ? true : false,
                    externo: props[9].includes('documento_interno') || /email/i.test(split_doc[15]) ? false : true,
                    image: split_doc[15],
                    id_procedimento: id_procedimento
                });
            } else {
                listDocs.push({
                    nrNo,
                    nome: props[5],
                    numero: SeiPro.sei.adapter.isNewSEI() ? split_doc[25] : split_doc[21],
                    id_documento: split_doc[3],
                    cancelado: props[6].startsWith('Documento Cancelado') ? true : false,
                    externo: props[9].includes('documento_interno') || /email/i.test(split_doc[15]) ? false : true,
                    image: split_doc[15],
                    id_procedimento: id_procedimento
                });
            }
        }
    });
    lines.forEach((line) => {   //Percorre o array novamente em busca dos links diretos para os documentos
        if (pattern2.test(line)) {
            const nrNo = line.substring(1, line.indexOf(']')).match(/\d{1,}/)[0];
            const src = line.substring(line.indexOf(`'`) + 1, line.lastIndexOf(`'`))
            const docMatched = listDocs.find((dataDoc) => dataDoc.nrNo === nrNo);
            listDocs[listDocs.indexOf(docMatched)] = { ...docMatched, src };
        }
    });
    return listDocs;
}
export function setCapaProcesso(loop = true) {
    var ifrArvore = $('#ifrArvore').contents();
    // Resolve o frame de visualização pelo DOM REAL, não pelo flag isNewSEI (que se
    // mostrou instável no mundo isolado e levava a procurar #ifrVisualizacao — id antigo,
    // inexistente no SEI 4.1+). No SEI 4.1+ o frame é #ifrConteudoVisualizacao, com
    // #ifrVisualizacao ANINHADO dentro; no SEI antigo é #ifrVisualizacao no topo.
    var _ifrConteudoViz = $('#ifrConteudoVisualizacao');
    var ifrVisualizacao = _ifrConteudoViz.length
                        ? _ifrConteudoViz.contents().find('#ifrVisualizacao').contents()
                        : $($ifrVisualizacao).contents();
    var dadosProcessoSession = pullDadosProcessoSession();
    var prop = dadosProcessoSession ? dadosProcessoSession.propProcesso : dadosProcessoPro.propProcesso;
    var _urlParamsCapa = getParamsUrlPro(window.location.href);
    // URLs de procedimento_trabalhar carregam id_procedimento; protocolo, id_protocolo.
    // Antes só id_protocolo era lido aqui — por isso o id ficava "pending" nessas páginas.
    var id_procedimento = (typeof prop !== 'undefined' && typeof prop.hdnIdProcedimento !== 'undefined') ? prop.hdnIdProcedimento : (_urlParamsCapa.id_procedimento || _urlParamsCapa.id_protocolo);
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
    var hipoteseLegal = (typeof prop !== 'undefined' && typeof prop.rdoNivelAcesso !== 'undefined' && prop.rdoNivelAcesso == '1') ? jmespath.search(prop.selHipoteseLegal_select, "[?id=='"+prop.selHipoteseLegal+"'] | [0].name") : null;
        hipoteseLegal = (hipoteseLegal == null) ? '' :  hipoteseLegal;
    var dataNivelAcesso = (typeof prop !== 'undefined' && typeof prop.rdoNivelAcesso !== 'undefined' && prop.rdoNivelAcesso == '0') ? {name: 'P\u00FAblico', icon: 'fas fa-globe-americas'} : false;
        dataNivelAcesso = (typeof prop !== 'undefined' && typeof prop.rdoNivelAcesso !== 'undefined' && prop.rdoNivelAcesso == '1') ? {name: 'Restrito: '+hipoteseLegal, icon: 'fas fa-lock'} : dataNivelAcesso;
        dataNivelAcesso = (typeof prop !== 'undefined' && typeof prop.rdoNivelAcesso !== 'undefined' && prop.rdoNivelAcesso == '2') ? {name: 'Sigiloso', icon: 'fas fa-user-slash'} : dataNivelAcesso;
    // Robusto à versão: divInformacao do flag isNewSEI pode estar errado (ver acima);
    // tenta os dois ids (novo: #divArvoreInformacao, antigo: #divInformacao).
    var infoProcNode = ifrVisualizacao.find('#divArvoreInformacao, #divInformacao').get(0);
    // Sinal DIRETO de que a capa está exibida e é montável: o container #divArvoreHtml
    // só existe no frame de visualização quando a raiz (capa) está aberta — some quando
    // um documento é selecionado (confirmado no DOM real do SEI 4.1+). Substitui as
    // antigas pré-condições ifrArvore + rootSelected (indiretas, via nó selecionado na
    // árvore) por esta, que é o próprio alvo de montagem da capa.
    var coverContainer = ifrVisualizacao.find('#divArvoreHtml');
    var coverPresent = coverContainer.length > 0;
    // rootSelected fica como sinal OPCIONAL (não bloqueia): serve apenas para distinguir
    // "usuário vendo um documento" de "capa ainda carregando" no ramo de retry.
    var rootSelected = !!(id_procedimento && ifrArvore.find('#span'+id_procedimento).hasClass('infraArvoreNoSelecionado'));

    // Pré-condições REAIS (3): dado do processo, identidade e o container da capa.
    var capaReady = !!prop && !!id_procedimento && coverPresent;
    // Progresso (0..3) — como as 3 chegam dispersas no tempo, mantém o retry vivo
    // enquanto houver avanço (ver retryWithProgress em src/core/async.js).
    var capaProgress = (prop ? 1 : 0) + (id_procedimento ? 1 : 0) + (coverPresent ? 1 : 0);

    // Caminho primário orientado a evento: reage no instante em que o dado do processo
    // é gravado na sessão (a pré-condição que mais falta). Idempotente: setCapaProcesso
    // remove a capa anterior antes de montar. Usa o primitivo compartilhado core/async.
    if (loop && typeof nudgeOnce === 'function') {
        nudgeOnce('__SEI_PRO_CAPA_NUDGE__', ['sei-pro-process-session-updated'], function () {
            setCapaProcesso(true);
        });
    }

    // Rede de segurança: retry ciente de progresso + backoff exponencial + teto
    // wall-clock, delegado ao primitivo compartilhado SeiPro.core.async (reusável).
    function retryCapaProcesso(reason) {
        if (!loop || typeof retryWithProgress !== 'function') return;
        retryWithProgress({
            bag: (window.__SEI_PRO_CAPA_PROCESSO_RETRY__ || (window.__SEI_PRO_CAPA_PROCESSO_RETRY__ = {})),
            key: id_procedimento || 'pending',
            progress: capaProgress,
            reason: reason,
            run: function () { setCapaProcesso(true); },
            onGiveUp: function (info) {
                console.warn('[SEI Pro]', 'setCapaProcesso: retry limit reached for', info.key, 'reason=', info.reason, 'progress=', info.progress + '/3', 'elapsed=', info.elapsed + 'ms');
            }
        });
    }

    if (!capaReady) {
        // Não é o HOST da capa se não há nenhum frame relevante (ex.: setCapaProcesso
        // disparado de DENTRO de um iframe aninhado via parent.setCapaProcesso). Aí não
        // há capa para montar — sai sem retentar.
        if (ifrVisualizacao.length === 0 && $('#ifrConteudoVisualizacao').length === 0 && $($ifrVisualizacao).length === 0 && ifrArvore.length === 0) {
            return;
        }
        // Usuário está vendo um DOCUMENTO: frame de visualização carregado, sem o
        // container da capa (#divArvoreHtml) e com outro nó da árvore selecionado. Não
        // há capa para montar — sai sem retentar, evitando tentativas a cada documento.
        if (!coverPresent && ifrVisualizacao.length > 0 && !rootSelected && ifrArvore.find('.infraArvoreNoSelecionado').length > 0) {
            return;
        }
        // Caso contrário, algo ainda está carregando. Diagnóstico do que falta: `prop`
        // vem de pullDadosProcessoSession() → cache dadosSessionProcessoPro (se faltar,
        // suspeitar do sessionStorage); o container é o alvo de montagem no frame de viz.
        var capaMissing = [];
        if (!prop) capaMissing.push('prop(dadosProcessoSession)');
        if (!id_procedimento) capaMissing.push('id_procedimento');
        if (!coverPresent) capaMissing.push('capaContainer(#divArvoreHtml)');
        retryCapaProcesso('não pronto: faltando ' + capaMissing.join(', '));
        return;
    }

    var checkBlocoInterno = (typeof $('#ifrArvore')[0] !== 'undefined' && typeof $('#ifrArvore')[0].contentWindow.selectedItensPanelArvore !== 'undefined' && $.inArray("Bloco Interno",jmespath.search($('#ifrArvore')[0].contentWindow.selectedItensPanelArvore,"[]")) !== -1) ? true : false;
    var blocoProcesso = checkBlocoInterno ? initBlocoProcessoHistorico() : false;
    var dadosProcessoP = dadosProcessoSession || false;
    var descBlocoInterno = (typeof blocoProcesso !== 'undefined' && blocoProcesso !== null) 
                        ? (typeof blocoProcesso !== 'undefined' && blocoProcesso.length > 0 && typeof blocoProcesso[0].descricao !== 'undefined') ? blocoProcesso[0].descricao : false
                        : false;
        descBlocoInterno = (typeof blocoProcesso !== 'undefined' && blocoProcesso !== null && blocoProcesso.length == 0 && typeof dadosProcessoP.listAndamento !== 'undefined' && dadosProcessoP.listAndamento.historico_completo) ? 'Nenhum bloco localizado' : descBlocoInterno;

    var htmlMarcador = getHtmlMarcador(id_procedimento, false);
    var iconMarcador = htmlMarcador.icon;
    var linkPrazo = htmlMarcador.prazo;
    var dataMarcador = htmlMarcador.data;
    var capaDoc = ifrVisualizacao[0] || document;
    function bindTooltip(el, text) {
        if (!el || !text) return el;
        el.title = text;
        el.setAttribute('aria-label', text);
        el.addEventListener('mouseenter', function () {
            if (typeof parent.infraTooltipMostrar === 'function') parent.infraTooltipMostrar(text);
        });
        el.addEventListener('focus', function () {
            if (typeof parent.infraTooltipMostrar === 'function') parent.infraTooltipMostrar(text);
        });
        el.addEventListener('mouseleave', function () {
            if (typeof parent.infraTooltipOcultar === 'function') parent.infraTooltipOcultar();
        });
        el.addEventListener('blur', function () {
            if (typeof parent.infraTooltipOcultar === 'function') parent.infraTooltipOcultar();
        });
        return el;
    }
    function createButton(opts) {
        var btn = capaDoc.createElement('button');
        btn.type = 'button';
        btn.className = 'newLink capaProcessoAction' + (opts && opts.className ? ' ' + opts.className : '');
        if (opts && opts.html) {
            btn.innerHTML = opts.html;
        } else {
            if (opts && opts.iconClass) {
                var icon = capaDoc.createElement('i');
                icon.className = opts.iconClass;
                btn.appendChild(icon);
                if (opts.text) btn.appendChild(capaDoc.createTextNode(' '));
            }
            if (opts && opts.text) {
                btn.appendChild(capaDoc.createTextNode(opts.text));
            }
        }
        bindTooltip(btn, opts && opts.tooltip ? opts.tooltip : '');
        return btn;
    }
    function createField(labelIconClass, labelText) {
        var field = capaDoc.createElement('div');
        field.className = 'field';
        var label = capaDoc.createElement('div');
        label.className = 'label txt_cinza';
        if (labelIconClass) {
            var icon = capaDoc.createElement('i');
            icon.className = labelIconClass + ' iconDadosProcesso';
            label.appendChild(icon);
        }
        if (labelText) label.appendChild(capaDoc.createTextNode(labelText));
        var data = capaDoc.createElement('div');
        data.className = 'data';
        field.appendChild(label);
        field.appendChild(data);
        return { field: field, data: data, label: label };
    }
    function appendValueButton(data, value, tooltip, clickHandler, opts) {
        var btn = createButton({
            text: value,
            html: opts && opts.html ? opts.html : '',
            iconClass: opts && opts.iconClass ? opts.iconClass : '',
            className: opts && opts.className ? opts.className : '',
            tooltip: tooltip
        });
        if (clickHandler) btn.addEventListener('click', clickHandler);
        data.appendChild(btn);
        return btn;
    }
    function appendHtml(data, html) {
        if (!html) return null;
        var span = capaDoc.createElement('span');
        span.innerHTML = html;
        data.appendChild(span);
        return span;
    }
    function appendLineButton(data, text, tooltip, clickHandler, opts) {
        return appendValueButton(data, text, tooltip, clickHandler, opts || {});
    }

    var capaRoot = capaDoc.createElement('div');
    capaRoot.id = 'capaProcessoPro';
    if (SeiPro.sei.adapter.isNewSEI()) capaRoot.className = 'newSEI_capaProcessoPro';

    var infoSide = capaDoc.createElement('div');
    infoSide.style.cssText = 'float:right;max-width:40%;';

    var qrcapa = capaDoc.createElement('div');
    qrcapa.className = 'qrcapa';
    bindTooltip(qrcapa, 'Aponte a c\u00E2mera para abrir o processo em seu celular');
    infoSide.appendChild(qrcapa);

    var infocapa = capaDoc.createElement('div');
    infocapa.className = 'infocapa';
    if (infoProcNode) {
        infocapa.appendChild(infoProcNode.cloneNode(true));
    }
    infoSide.appendChild(infocapa);
    capaRoot.appendChild(infoSide);

    var historyField = createField(null, '');
    historyField.data.style.cssText = 'margin: 10px 0;';
    var historyBtn = createButton({
        iconClass: 'fas fa-history azulColor iconDadosProcesso',
        text: 'Hist\u00F3rico de tramita\u00E7\u00E3o do processo',
        tooltip: 'Abrir hist\u00F3rico de tramita\u00E7\u00E3o do processo'
    });
    historyBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        if (typeof parent.initGanttHistoryProc === 'function') parent.initGanttHistoryProc();
    });
    historyField.data.appendChild(historyBtn);
    capaRoot.appendChild(historyField.field);

    var processoField = createField('fas fa-scroll azulColor', 'Processo:');
    if (typeof prop !== 'undefined' && typeof prop.hdnProtocoloFormatado !== 'undefined') {
        appendLineButton(processoField.data, prop.hdnProtocoloFormatado, 'Clique para copiar', function () {
            if (typeof parent.copyTextThis === 'function') parent.copyTextThis(this);
        }, { className: 'capaProcessoTextAction' });
        var linkBtn = createButton({
            iconClass: 'fas fa-link iconDadosProcesso',
            tooltip: 'Clique para copiar o link do processo',
            className: 'capaProcessoLink'
        });
        linkBtn.dataset.id_procedimento = id_procedimento;
        linkBtn.addEventListener('click', function (ev) {
            ev.preventDefault();
            if (typeof parent.copyLinkProcesso === 'function') parent.copyLinkProcesso(this);
        });
        processoField.data.appendChild(linkBtn);
    }
    capaRoot.appendChild(processoField.field);

    var autuacaoField = createField('fas fa-calendar-check azulColor', 'Data de Autua\u00E7\u00E3o:');
    if (typeof prop !== 'undefined' && typeof prop.hdnDtaGeracao !== 'undefined') {
        appendLineButton(autuacaoField.data, prop.hdnDtaGeracao, 'Clique para copiar', function () {
            if (typeof parent.copyTextThis === 'function') parent.copyTextThis(this);
        }, { className: 'capaProcessoTextAction' });
    }
    capaRoot.appendChild(autuacaoField.field);

    var tipoField = createField('fas fa-inbox azulColor', 'Tipo do Processo:');
    if (typeof prop !== 'undefined' && typeof prop.hdnNomeTipoProcedimento !== 'undefined') {
        appendLineButton(tipoField.data, prop.hdnNomeTipoProcedimento, 'Clique para copiar', function () {
            if (typeof parent.copyTextThis === 'function') parent.copyTextThis(this);
        }, { className: 'capaProcessoTextAction' });
    }
    capaRoot.appendChild(tipoField.field);

    var especificacaoField = createField('fas fa-comment-dots azulColor', 'Especifica\u00E7\u00E3o:');
    if (typeof prop !== 'undefined' && typeof prop.txtDescricao !== 'undefined') {
        var descricao = String(prop.txtDescricao || '');
        var urgente = descricao.toLowerCase().indexOf('(urgente)') !== -1;
        var descricaoBtn = createButton({
            className: 'capaProcessoTextAction' + (urgente ? ' urgentePro' : ''),
            tooltip: 'Clique para copiar'
        });
        if (urgente) {
            var urg = capaDoc.createElement('span');
            urg.className = 'urgentePro';
            urg.setAttribute('aria-hidden', 'true');
            descricaoBtn.appendChild(urg);
        }
        descricaoBtn.appendChild(capaDoc.createTextNode(descricao));
        descricaoBtn.addEventListener('click', function () {
            if (typeof parent.copyTextThis === 'function') parent.copyTextThis(this);
        });
        especificacaoField.data.appendChild(descricaoBtn);
    }
    capaRoot.appendChild(especificacaoField.field);

    var assuntosField = createField('fas fa-bookmark azulColor', 'Assuntos:');
    if (typeof prop !== 'undefined' && typeof prop.selAssuntos !== 'undefined') {
        $.each(prop.selAssuntos, function (i, v) {
            appendLineButton(assuntosField.data, v, 'Clique para copiar', function () {
                if (typeof parent.copyTextThis === 'function') parent.copyTextThis(this);
            }, { className: 'capaProcessoTextAction' });
        });
    }
    capaRoot.appendChild(assuntosField.field);

    var interessadosField = createField('fas fa-users azulColor', 'Interessados:');
    if (typeof prop !== 'undefined' && typeof prop.selInteressadosProcedimento !== 'undefined') {
        $.each(prop.selInteressadosProcedimento, function (i, v) {
            appendLineButton(interessadosField.data, v, 'Clique para copiar', function () {
                if (typeof parent.copyTextThis === 'function') parent.copyTextThis(this);
            }, { className: 'capaProcessoTextAction' });
        });
    }
    capaRoot.appendChild(interessadosField.field);

    var nivelField = createField(dataNivelAcesso ? dataNivelAcesso.icon : 'fas fa-globe-americas', 'N\u00EDvel de Acesso:');
    if (dataNivelAcesso) {
        appendLineButton(nivelField.data, dataNivelAcesso.name, 'Clique para copiar', function () {
            if (typeof parent.copyTextThis === 'function') parent.copyTextThis(this);
        }, { className: 'capaProcessoTextAction' });
    }
    capaRoot.appendChild(nivelField.field);

    var marcadorField = createField('fas fa-tag azulColor', 'Marcador:');
    if (dataMarcador) {
        var marcadorBtn = createButton({
            html: iconMarcador,
            tooltip: 'Clique para copiar',
            className: 'capaProcessoTextAction'
        });
        marcadorBtn.addEventListener('click', function () {
            if (typeof parent.copyTextThis === 'function') parent.copyTextThis(this);
        });
        marcadorField.data.appendChild(marcadorBtn);
        if (linkPrazo) appendHtml(marcadorField.data, linkPrazo);
    }
    capaRoot.appendChild(marcadorField.field);

    if (descBlocoInterno) {
        var blocoField = createField('fas fa-book azulColor', 'Bloco Interno:');
        appendLineButton(blocoField.data, descBlocoInterno, 'Clique para copiar', function () {
            if (typeof parent.copyTextThis === 'function') parent.copyTextThis(this);
        }, { className: 'capaProcessoTextAction' });
        capaRoot.appendChild(blocoField.field);
    }

    var obsField = createField('fas fa-comment-dots azulColor', 'Observa\u00E7\u00F5es:');
    if (typeof prop !== 'undefined' && typeof prop.txaObservacoes !== 'undefined') {
        $.each(prop.txaObservacoes, function (i, v) {
            var obsRow = capaDoc.createElement('div');
            var obsBtn = createButton({
                className: 'capaProcessoTextAction',
                tooltip: 'Clique para copiar'
            });
            obsBtn.appendChild(capaDoc.createTextNode((v.unidade || '') + ': ' + (v.observacao || '')));
            obsBtn.addEventListener('click', function () {
                if (typeof parent.copyTextThis === 'function') parent.copyTextThis(this);
            });
            obsRow.appendChild(obsBtn);
            obsField.data.appendChild(obsRow);
        });
    }
    capaRoot.appendChild(obsField.field);

    ifrVisualizacao.find('#capaProcessoPro').remove();
    // Capa montada: encerra o retry desta chave (cancela timer e limpa estado).
    if (typeof clearRetry === 'function') clearRetry(id_procedimento, window.__SEI_PRO_CAPA_PROCESSO_RETRY__);

    if (coverPresent) {
        coverContainer.prepend(capaRoot);
        ifrVisualizacao.find(divInformacao).hide();
        if (SeiPro.sei.adapter.isSEI5()) ifrVisualizacao.find('#divArvoreHtml').removeClass('d-flex');
        replaceColorsIcons(ifrVisualizacao.find('#tagUserColorPro'));
        var qrCapaTarget = ifrVisualizacao.find('.qrcapa')[0];
        if (qrCapaTarget) {
            renderQrCode(qrCapaTarget, {
                render: 'image',
                size: 150,
                text: parent.url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento
            }).catch((error) => {
                console.error('[SEI Pro] QR code indisponível', error);
                qrCapaTarget.textContent = '';
            });
        }
        if (loop) {
            setTimeout(function () {
                setCapaProcesso(false);
            },1500);
        }
    }
}
export function getHtmlMarcador(id_procedimento, processoAberto) {
    var listMarcadores = sessionStorageRestorePro('dadosMarcadoresProcessoPro');
    var dataMarcador = (id_procedimento && listMarcadores) ? jmespath.search(listMarcadores, "[?id_procedimento=='"+id_procedimento+"'] | [0]") : null;
        dataMarcador = (dataMarcador !== null) ? dataMarcador : false;
    var iconMarcador = (processoAberto) ? '<i class="fas fa-spinner fa-spin"></i>' : '';
    var linkPrazo = '';
    if (dataMarcador) {
        var tagNameClean = (dataMarcador.tag && dataMarcador.tag != '' && dataMarcador.tag.indexOf('#') !== -1) ? dataMarcador.tag.replace(extractHexColor(dataMarcador.tag),'') : dataMarcador.tag;
            tagNameClean = (typeof tagNameClean !== 'undefined' && tagNameClean !=  '') ? tagNameClean.trim() : tagNameClean;
        var regex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
        var time = (typeof dataMarcador.name !== 'undefined' && dataMarcador.name !== null) ? String(dataMarcador.name).match(/(\d{1,2}:\d{2})/img) : null;
            time = (time !== null) ? ' '+time[0] : '';
        var regexDue = /(ate )(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
        var checkDateDue = (typeof dataMarcador.name !== 'undefined' && dataMarcador.name !== null && typeof dataMarcador.name === 'string') ? regexDue.exec(removeAcentos(String(dataMarcador.name).trim()).toLowerCase().replaceAll('  ',' ')) : null;
            datePrazoDue = (checkDateDue !== null) ? moment(checkDateDue[0]+time, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss') : false;
        var checkDate = (typeof dataMarcador.name !== 'undefined' && dataMarcador.name !== null && typeof dataMarcador.name === 'string') ? regex.exec(removeAcentos(dataMarcador.name.trim())) : null;
            datePrazo = (checkDateDue === null && checkDate !== null) ? moment(checkDate[0]+time, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss') : false;
            iconPrazo = (datePrazo) ? parent.getDatesPreview({date: datePrazo}) : false;
            iconPrazo = (datePrazoDue) ? parent.getDatesPreview({date: datePrazoDue}) : iconPrazo;
            linkPrazo = (iconPrazo) ? '<a class="newLink" style="cursor:pointer;max-width: calc(100% - 70px);" onclick="parent.copyTextThis(this)" onmouseover="return infraTooltipMostrar(\'Clique para copiar\');" onmouseout="return infraTooltipOcultar();">'+iconPrazo+'</a>' : '';
            iconMarcador = (typeof dataMarcador.icon !== 'undefined') ? (checkConfigValue('coresmarcadores') ? '<span data-color="true" class="tagUserColorPro">' : '')+'<img src="'+dataMarcador.icon+'" class="imagemStatus" title="'+dataMarcador.tag+'">'+(checkConfigValue('coresmarcadores') ? '</span>' : '')+' '+tagNameClean+(dataMarcador.name ? ': '+dataMarcador.name.replace(/\\r\\n/g, "<br>") : '') : 'Nenhum marcador';
    }
    return {icon: iconMarcador, prazo: linkPrazo, data: dataMarcador};
}
export function getDocCertidao(this_) {
    var _this = $(this_);
    var itemSelected = false;
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var ifrArvoreHtml = ifrVisualizacao.find($ifrArvoreHtml).contents();
    var contentBody = ifrArvoreHtml.find('body').clone(true);
        contentBody.find('img[alt="QRCode Assinatura"]').closest('table').remove();
        contentBody.find('a[onclick*="alert"]').remove();
    var contentHtml = contentBody[0].outerHTML;
    var ifrArvore = $('#ifrArvore');
    var href = getTreeLinkUrlByName('Incluir Documento');
    var nameDoc = (checkConfigValue('certidaosigilo_nomedoc')) ? getConfigValue('certidaosigilo_nomedoc') : 'Certid\u00E3o';

    if (href !== null) {
        alertaBoxPro('Sucess', 'sync fa-spin', 'Aguarde... Gerando Certid\u00E3o de Documento Oficial com Sigilo');
        $.ajax({ url: href }).done(function (htmlInitDoc) {
            var $htmlInitDoc = $(htmlInitDoc);
            var form = $htmlInitDoc.find('#frmDocumentoEscolherTipo');
            var hrefForm = form.attr('action');
            var param = {};
                form.find("input[type=hidden]").each(function () {
                    if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                        param[$(this).attr('name')] = $(this).val(); 
                    }
                });
                param.hdnFiltroSerie = 'T';
            
                $.ajax({
                    method: 'POST',
                    data: param,
                    url: hrefForm
                }).done(function (htmlFullList) {
                    var $htmlFullList = $(htmlFullList);
                    $htmlFullList.find('#tblSeries tbody tr').each(function (v) {
                        var text = $(this).data('desc').trim();
                        var value = $(this).find('input').val();
                        var urlDoc = $(this).find('a.ancoraOpcao').attr('href');
                        if (text != '') {
                            var nameOption = escapeRegExp(text.replace(/_|:/g, ' '));
                                nameDoc = nameDoc.replace(/_|:/g, ' ');
                            var reg = new RegExp('^\\b'+nameOption, "igm");
                            if (reg.test(parent.removeAcentos(nameDoc.trim().toLowerCase()))) {
                                if (typeof urlDoc !== 'undefined' && text != 'externo') {
                                    itemSelected = true;
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
                                            param.txtDescricao = 'de Documento Oficial com Sigilo';

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
                                                var class_icon = '';
                                                var text_icon = '';
                                                if (status) {
                                                    alertaBoxPro('Sucess', 'check-circle', 'Certid\u00E3o gerada com sucesso');
                                                    var $htmlResult = $(htmlResult);
                                                    var urlEditor = [];
                                                    var idUser = false;
                                                    $.each($htmlResult.text().split('\n'), function(i, v){
                                                        if (v.indexOf("atualizarArvore('") !== -1) {
                                                            urlReload = v.split("'")[1];
                                                        }
                                                        if (v.indexOf("acao=editor_montar") !== -1) {
                                                            var editorUrlCert = extractEditorMontarUrl(v);
                                                            if (editorUrlCert) urlEditor.push(editorUrlCert);
                                                        }
                                                        if (v.indexOf("janelaEditor_") !== -1) {
                                                            idUser = v.split("_")[1];
                                                        }
                                                    });
                                                    if (!urlEditor.length) {
                                                        var editorUrlCertHtml = extractEditorMontarUrl(htmlResult);
                                                        if (editorUrlCertHtml) urlEditor.push(editorUrlCertHtml);
                                                    }
                                                    if (urlEditor.length > 0 && idUser) {
                                                        sessionStorageStorePro('dadosDocCertidao',contentHtml);
                                                        sessionStorageStorePro('nomeDocCertidao',ifrArvore.contents().find('.infraArvoreNoSelecionado').eq(0).text());
                                                        openWindowEditor(urlEditor[0]+'#&acao_pro=set_certidao', idUser);
                                                    }
                                                    if (urlReload) {
                                                        ifrArvore.attr('src', urlReload);
                                                    } else {
                                                        var ifrArvoreElem = getIframeArvoreElement();
                                                        if (ifrArvoreElem && ifrArvoreElem.contentWindow) ifrArvoreElem.contentWindow.location.reload(true);
                                                    }
                                                } else {
                                                    alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao gerar o documento do tipo "'+nameDoc+'".');
                                                }
                                            });
                                    });
                                }
                                return false;
                            }
                        }
                });
                if (!itemSelected) { 
                    alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao selecionar o tipo de documento "'+nameDoc+'". Verifique se o tipo est\u00E1 dispon\u00EDvel no sistema e tente novamente');
                }
            });
        });
    } else {
        if (!itemSelected) { 
            console.log('Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!');
        }
    }
}
