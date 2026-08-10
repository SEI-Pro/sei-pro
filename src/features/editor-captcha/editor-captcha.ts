// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sei Functions Pro — editor dialogs, captcha, checksum.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import { sha256Hex } from '../../core/crypto.js';

import {
    atividadesState,
    checkCapacidade,
    checkPerfilNivelAdm,
    extractDataDocument,
    getConfigServer,
    getConfigServerDoc,
    setParamEditorAtiv,
    signCancelDocumento
} from './atividades-bridge.js';

import {
    alertaBoxPro,
    confirmaBoxPro,
    confirmaFraseBoxPro,
    getCheckerProcessoPro,
    getIDProtocoloSEI,
    resetDialogBoxPro,
    scrollToElement,
    setCaretPosition,
    updateButtonConfirm
} from './modules.js';

export function openLinkNewTab(url) {
    var win = window.open(url, '_blank');
    if (win) {
        win.focus();
    } else {
        alert('Por favor, permita popups para essa p\u00E1gina');
    }
}
export function openLinkSEIPro(id_procedimento) {
    //var url_host = window.location.href.split('?')[0];
    var url = url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento;
    var win = window.open(url, '_blank');
    if (win) {
        win.focus();
    } else {
        alert('Por favor, permita popups para essa p\u00E1gina');
    }
}
export function openSEINrPro(this_, nrSEI){
    // $('#txtPesquisaRapida').val(nrSEI);
    // $('#frmProtocoloPesquisaRapida').submit();
    var _this = $(this_);
    var title = _this.text();
    var iconLoad = _this.find('i').attr('class');
        _this.data('icon-load', iconLoad);
        _this.find('i').attr('class', 'fas fa-spinner fa-spin');
    getIDProtocoloSEI(nrSEI,  
        function(html){
            let $html = $(html);
            var param = getParamsUrlPro($html.find('#ifrArvore').attr('src'));
                param.title = title;
            console.log(param);
            openDialogDoc(param);
            _this.find('i').attr('class', _this.data('icon-load'));
        }, 
        function(){
            alertBoxPro();
        }
    );
}
export function openEditorDoc(paramData) {
    var htmlEditorBox =  '<div class="editorBoxProDiv" style="width: 100%; margin: 0; text-align: center;">'+
                         '  <input type="hidden" id="editor_id" value="'+paramData.id+'" tabindex="0">'+
                         '  <textarea id="editor_doc" class="setClassEditor" name="editor_doc" style="min-height: 200px;">'+paramData.text+'</textarea>'+
                         '</div>';
    resetDialogBoxPro('editorBoxPro');
    // console.log(paramData);
    editorBoxPro = $('#editorBoxPro')
        .html(htmlEditorBox)
        .dialog({
            width: 980,
            height: 820,
            title: (paramData.title_page ? paramData.title_page : ''),
            open: function() { 
                updateButtonConfirm(this, true);
                getEditorConfigOptions();
                // initClassicEditor();
            },
            buttons: [{
                text: 'Salvar documento',
                icon: 'ui-icon-disk',
                click: function(event) {
                    var dataEditor = configClassicEditor['editor_doc'].getData();

                    var action = 'edit_documento';
                    var param = {
                        action: action,
                        id_documento: paramData.id_documento,
                        title: paramData.title,
                        mode: paramData.mode,
                        id_reference: paramData.id_reference,
                        reference: paramData.reference,
                        type: paramData.type,
                        text: dataEditor
                    };
                    getConfigServer(action, param);
                    // console.log(action, param);
                }
            }]
        });
}
export function openEditorViewDoc(paramData, paramTarget, dataResult) {
    var ativState = atividadesState();
    // console.log(paramData, paramTarget, dataResult);
    if (!paramTarget.return_sign || paramTarget.return_sign && (dataResult.status_assinatura || !dataResult.status_assinatura && (paramTarget.return_user == (ativState.arrayConfigAtividades.perfil && ativState.arrayConfigAtividades.perfil.id_user)))) {
        var htmlEditorBox =  '<div class="editorBoxProDiv ck ck-reset ck-editor ck-rounded-corners" style="width: 100%; margin: 0; text-align: center;">'+
                            '  <div class="ck ck-editor__main">'+
                            '      <div id="view_doc" class="readOnly ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline" name="view_doc">'+
                            '      </div>'+
                            '  </div>'+
                            (dataResult.status_assinatura ? 
                            '  <div class="signed">'+
                            '      <span>'+
                            '          <i class="fas fa-key laranjaColor" style="margin-right: 10px;"></i>'+
                            '          Documento assinado eletronicamente por <strong style="font-weight: bold;">'+dataResult.config.assinatura[0].nome_completo+'</strong>, em '+moment(dataResult.config.assinatura[0].datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm')+', conforme hor\u00E1rio oficial de Bras\u00EDlia'+
                            '      </span>'+
                            '  </div>'+
                            '' : '')+
                            '</div>';
        resetDialogBoxPro('editorBoxPro');
        // console.log(paramData, paramTarget);

        var btnDialogBoxPro = [{
            text: 'Imprimir Documento',
            icon: 'ui-icon-print',
            click: function(event) {
                printDocumento();
            }
        }];
        
        if (paramTarget.return_sign && dataResult.status_assinatura) {
            if (checkCapacidade('sign_cancel_documento')) {
                btnDialogBoxPro = [{
                    text: 'Imprimir Documento',
                    icon: 'ui-icon-print',
                    click: function(event) {
                        printDocumento();
                    }
                },{
                    text: 'Cancelar Assinatura',
                    icon: 'ui-icon-close',
                    click: function(event) {
                        signCancelDocumento(paramData);
                    }
                }];
            }
        } else if (paramTarget.return_sign && !dataResult.status_assinatura && (paramTarget.return_user == (ativState.arrayConfigAtividades.perfil && ativState.arrayConfigAtividades.perfil.id_user))) {
            btnDialogBoxPro = [{
                text: 'Assinar documento',
                class: 'confirm ui-state-active',
                click: function(event) {
                    if (!checkDocAssinatura(this)) {
                        scrollToElement($(this).closest('.ui-dialog').find('#view_doc'), $(this).closest('.ui-dialog').find('.requiredNull').eq(0));
                        alertaBoxPro('Error', 'exclamation-triangle', 'Preencha os campos sinalizados no documento!', function(){ $('input.requiredNull').focus() });
                    } else {
                        var _this = this;
                        confirmaFraseBoxPro('Voc\u00EA est\u00E1 de acordo com os termos do documento proposto?', 'DE ACORDO', function() { 
                            var keys = extractDataDocument(_this);
                                closeEditorViewBeforeSign(_this);
                            var dataEditor = $('#view_doc').html();
                            var action = 'sign_documento';
                            var param = {
                                action: action,
                                id_documento: paramData.id_documento,
                                title: paramData.title,
                                mode: paramData.mode,
                                id_reference: paramData.id_reference,
                                reference: paramData.reference,
                                text: fixedEncodeURIComponent(dataEditor),
                                keys: keys,
                                type: paramData.type
                            };
                            // getConfigServer(action, param);
                            getConfigServerDoc(action, param);
                        });
                    }
                }
            }];
        }
        
        editorBoxPro = $('#editorBoxPro')
            .html(htmlEditorBox)
            .dialog({
                width: 980,
                height: (dataResult.status_assinatura ? 790 : 750),
                title: (paramData.title_page ? paramData.title_page : ''),
                open: function() { 
                    updateButtonConfirm(this, true);
                    var textEncode = (is_html(paramData.text)) ? paramData.text : $("<div/>").html(paramData.text).text();
                    if (paramData.reference == 'modelo' && paramTarget.return_sign) {
                        var user = (typeof paramTarget.return_user !== 'undefined' && paramTarget.return_user) ? paramTarget.return_user : false;
                        var id_reference = (typeof paramTarget.id_reference !== 'undefined' && paramTarget.id_reference) ? paramTarget.id_reference : false;
                        var type = (typeof paramTarget.type !== 'undefined' && paramTarget.type) ? paramTarget.type : false;
                        textEncode = setParamEditorAtiv(paramData.mode, textEncode, user, id_reference, type);
                    }
                    $('#view_doc').html(textEncode);
                    if (paramTarget.return_sign) {
                        loadFunctionEditorView(this);
                    }
                },
                buttons: btnDialogBoxPro
            });
    } else {
        // alertaBoxPro('Error', 'exclamation-triangle', 'Assinatura dispon\u00EDvel apenas para o usu\u00E1rio!');
        var btnDialogBoxPro = [{
            text: "OK",
            class: "confirm",
            click: function() {
                $(this).dialog('close');
                }
            }];

        if (checkPerfilNivelAdm()) {
            btnDialogBoxPro.unshift({
                text: 'Dispensar assinatura',
                icon: 'ui-icon-pencil',
                click: function(event) { 
                    confirmaBoxPro('Tem certeza que deseja dispensar a assinatura?', function(){
                        var action = 'sign_documento';
                        var param = {
                            action: action,
                            id_documento: paramData.id_documento,
                            title: paramData.title,
                            mode: paramData.mode,
                            id_reference: paramData.id_reference,
                            reference: paramData.reference,
                            text: fixedEncodeURIComponent('<p style="text-align: center;font-size: 11pt;font-family: monospace;color: #666;padding: 10pt 0;">Assinatura dispensada pelo administrador do sistema em '+moment().format('DD/MM/YYYY [\u00E0s] HH:mm')+'</p>'),
                            keys: {dispensa_admin: true, data_dispensa: moment().format('YYYY-MM-DD HH:mm:ss')},
                            type: paramData.type,
                            permission: 'dispensa_admin'
                        };
                        getConfigServerDoc(action, param);
                    }, 'Dispensar');
                }
            });
        }

        resetDialogBoxPro();
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div id="dialogBoxPro" style="width: auto; min-height: 51.5938px; max-height: none; height: auto;" class="ui-dialog-content ui-widget-content"><strong class="alertaErrorPro dialogBoxDiv"><i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i> Assinatura dispon\u00EDvel apenas para o usu\u00E1rio!</strong></div>')
            .dialog({
                title: NAMESPACE_SPRO,
                width: 400,
                buttons: btnDialogBoxPro
            });
    }
}
export function printDocumento() {
    var htmlPrint = ($('.signed').length) ? $('#view_doc').html()+$('.signed')[0].outerHTML : $('#view_doc').html();

        $('#printBoxPro').addClass('hidePrint').html(htmlPrint);
        $('.infraAreaGlobal').addClass('hidePrint');
        $('.ui-dialog').addClass('hidePrint');
        window.print();

        setTimeout(function(){ 
            $('#printBoxPro').removeClass('hidePrint').html('');
            $('.infraAreaGlobal').removeClass('hidePrint');
            $('.ui-dialog').removeClass('hidePrint');
        }, 500);
}
export function checkDocAssinatura(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var count_list = 0;
    var check_list = false;
    var check_required = false;
    _parent.find('.todo-list input[type="checkbox"]').each(function(){
        count_list = ($(this).attr('checked') == 'checked') ? count_list+1 : count_list;
    });
    if (count_list != 1) {
        _parent.find('.todo-list').addClass('requiredNull');
        check_list = true;
    } else {
        _parent.find('.todo-list').removeClass('requiredNull');
    }

    _parent.find('input').each(function(){
        if ($(this).prop('required') && $(this).val() == '' ) { 
            $(this).addClass('requiredNull');
            check_required = true;
        } else {
            $(this).removeClass('requiredNull');
        }
    });
    return (!check_list && !check_required) ? true : false;
}
export function closeEditorViewBeforeSign(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var style_field = 'font-weight: bold;padding: 5px 8px;margin: 5px 0px;display: inline-block;background: #f5f5f5;border-radius: 5px;';
    _parent.find('input[type="time"]').each(function(){
        $(this).after('<span style="'+style_field+'">'+$(this).val()+'</span>').remove();
    });
    _parent.find('select').each(function(){
        $(this).after('<span style="'+style_field+'">'+$(this).find('option:selected').val()+'</span>').remove();
    });
    _parent.find('input[type="text"]').each(function(){
        $(this).after('<span style="'+style_field+'">'+$(this).val()+'</span>').remove();
    });
    _parent.find('input[type="number"]').each(function(){
        $(this).after('<span style="'+style_field+'">'+parseInt($(this).val())+'</span>').remove();
    });
    _parent.find('input[type="date"]').each(function(){
        $(this).after('<span style="'+style_field+'">'+moment($(this).val(),'YYYY-MM-DD').format('DD/MM/YYYY')+'</span>').remove();
    });
    _parent.find('input[type="datetime-local"]').each(function(){
        $(this).after('<span style="'+style_field+'">'+moment($(this).val(),'YYYY-MM-DDTHH:mm').format('DD/MM/YYYY HH:mm')+'</span>').remove();
    });
    _parent.find('input[type="checkbox"]').each(function(){
        if ($(this).attr('checked') == 'checked') {
            var icone = '[X]';
            $(this).closest('label').css({'background': '#f5f5f5', 'border-radius': '5px', 'text-decoration': 'underline'});
            $(this).closest('label').find('.todo-list__label__description').css({'font-weight': 'bold'});
        } else {
            var icone = '[_]';
        }
        $(this).after('<span style="'+style_field+'">'+icone+'</span>').remove();
    });
}
export function loadFunctionEditorView(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    _parent.find('.todo-list__label').find('input[type="checkbox"]').prop('disabled',false);
    _parent.find('.todo-list__label').unbind().on('click', function(e){
        e.preventDefault();
        $('.todo-list__label input[type="checkbox"]').not(this).attr('checked', false);
       var checkbox = $(this).find('input[type="checkbox"]');
        if (checkbox.attr('checked') == 'checked') {
           checkbox.removeProp('checked');
           checkbox.removeAttr('checked');
        } else {
           checkbox.prop('checked','checked');
           checkbox.attr('checked','checked');
        }
    });
    if (typeof $.mask !== 'undefined') {
        if (_parent.find("input[data-key='tel_celular']").length > 0) {
            _parent.find("input[data-key='tel_celular']").mask("+99 (99) 99999-999?9", {placeholder: '+55 (__) _____-____', completed: function () { 
                this.removeClass('requiredNull');
            }}).on('focus', function(){
                setTimeout(() => {
                    // console.log($(this).val(),'focus');
                    if ($(this).val() == '+55 (__) _____-____') {
                        setCaretPosition(this, 5);
                    }
                }, 1000);
            });
        }
        if (_parent.find("input[data-key='tel_residencial']").length > 0) {
            _parent.find("input[data-key='tel_residencial']").mask("(99) 9999-9999");
        }
    }
}
export function getEditorConfigOptions(readonly = false) {
    if ($('.setClassEditor').length > 0) {
        $('.setClassEditor').each(function(){
            ClassicEditor.create( this, {
                toolbar: (readonly ? null : {
                    items: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'link',
                        'bulletedList',
                        'numberedList',
                        'alignment',
                        '|',
                        'fontColor',
                        'fontBackgroundColor',
                        'fontFamily',
                        'fontSize',
                        '|',
                        'highlight',
                        'strikethrough',
                        'subscript',
                        'superscript',
                        'horizontalLine',
                        '|',
                        'undo',
                        'redo',
                        '-',
                        'todoList',
                        'insertTable',
                        '|',
                        'blockQuote',
                        'outdent',
                        'indent',
                        '|',
                        'htmlEmbed',
                        'mediaEmbed',
                        'sourceEditing'
                    ],
                    shouldNotGroupWhenFull: true
                }),
                language: 'pt-br',
                image: {
                    toolbar: [
                        'imageTextAlternative',
                        'imageStyle:inline',
                        'imageStyle:block',
                        'imageStyle:side'
                    ]
                },
                table: {
                    contentToolbar: [
                        'tableColumn',
                        'tableRow',
                        'mergeTableCells',
                        'tableCellProperties',
                        'tableProperties'
                    ]
                }
            }).then( editor => {
                console.log( 'Editor was initialized', editor );
                configClassicEditor[$(this).attr('id')] = editor;
                if (readonly) {
                    configClassicEditor[$(this).attr('id')].isReadOnly = true;
                }
            })
            .catch( error => {
                console.error( error );
            });
        })
    }
}
export function openDialogAnexo(this_) {
    var _this = $(this_);
    var data = _this.data();
    var iconLoad = _this.find('i').attr('class');
        _this.data('icon-load', iconLoad);
        _this.find('i').attr('class', 'fas fa-spinner fa-spin');

    var btnDialogBoxPro = [{
        text: 'Baixar',
        icon: 'ui-icon-disk',
        click: function(event) {
            var link = document.createElement('a');
            link.href = data.url;
            link.download = data.title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },{
        text: 'Abrir',
        icon: 'ui-icon-extlink',
        click: function(event) {
            var win = window.open(data.url, '_blank');
            if (win) {
                win.focus();
            } else {
                alert('Por favor, permita popups para essa p\u00E1gina');
            }
            resetDialogBoxPro('iframeBoxPro');
        }
    }];
    resetDialogBoxPro('iframeBoxPro');
    iframeBoxPro = $('#iframeBoxPro')
        .html('<div class="iframeBoxDiv" style="width: 100%; height: 100%; margin: 0;"><iframe src="'+data.url+'" frameborder="0" height="100%" width="100%"></iframe></div>')
        .dialog({
            width: 950,
            height: $(window).height(),
            title: data.title,
            open: function(){
                _this.find('i').attr('class', _this.data('icon-load'));
            },
            buttons: btnDialogBoxPro
        });
}
export function openDialogDoc(param, forceDownload = false, _this = false) {
    var href = url_host+'?acao=procedimento_trabalhar&id_procedimento='+param.id_procedimento+'&id_documento='+param.id_documento;

    if (forceDownload) {
        _this.find('i').attr('class', 'fas fa-spinner fa-spin');
    } else {
        var btnDialogBoxPro = [{
                text: 'Imprimir',
                icon: 'ui-icon-print',
                click: function(event) {
                    var htmlPrint = $('.iframeBoxDiv iframe').contents().find('html');
                    $('#printBoxPro').addClass('hidePrint').html(htmlPrint);
                    $('.infraAreaGlobal').addClass('hidePrint');
                    $('.ui-dialog').addClass('hidePrint');
                    window.print();

                    setTimeout(function(){ 
                        $('#printBoxPro').removeClass('hidePrint').html('');
                        $('.infraAreaGlobal').removeClass('hidePrint');
                        $('.ui-dialog').removeClass('hidePrint');
                        resetDialogBoxPro('iframeBoxPro');
                    }, 500);
                }
            },{
                text: 'Baixar',
                icon: 'ui-icon-disk',
                click: function(event) {
                    var iframeBoxDiv = $('.iframeBoxDiv iframe').contents();
                    var nameFile = iframeBoxDiv.find('title').text();
                    var contentDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
                        contentDocument += iframeBoxDiv.find('html')[0].outerHTML;
                    var downloadLink = document.createElement("a");
                    var blob = new Blob(["\ufeff", contentDocument]);
                    var url = URL.createObjectURL(blob);
                    downloadLink.href = url;
                    downloadLink.download = nameFile+'.html';
                    
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                }
            },{
                text: 'Abrir',
                icon: 'ui-icon-extlink',
                click: function(event) {
                    var win = window.open(href, '_blank');
                    if (win) {
                        win.focus();
                    } else {
                        alert('Por favor, permita popups para essa p\u00E1gina');
                    }
                    resetDialogBoxPro('iframeBoxPro');
                }
            }];
        resetDialogBoxPro('iframeBoxPro');
        iframeBoxPro = $('#iframeBoxPro')
            .html('<div class="iframeBoxDiv" style="width: 100%; margin: 10% 0; text-align: center;"><i class="fas fa-spinner fa-spin azulColor" style="font-size: 22pt;"></i></div>')
            .dialog({
                width: 500,
                height: 200,
                title: (param.title ? param.title : ''),
                buttons: btnDialogBoxPro
            });
    }

    $.ajax({ url: href }).done(function (html) {
        let $html = $(html);
        var urlArvore = $html.find("#ifrArvore").attr('src');
        $.ajax({ url: urlArvore }).done(function (htmlArvore) {
            var urlVisualizacao = $.map(htmlArvore.split('\n'), function(substr, i) {
                    return (substr.indexOf("'controlador.php?acao=documento_visualizar&acao_origem=procedimento_visualizar&id_documento="+param.id_documento+"&") !== -1) ? substr : null;
                }).join('');
                urlVisualizacao = (urlVisualizacao != '') ? urlVisualizacao.split("'")[1] : false;
                urlVisualizacao = (urlVisualizacao) ? url_host+urlVisualizacao.replace('controlador.php', '') : false;
            
            var procVisualizacao = $.map(htmlArvore.split('\n'), function(substr, i) {
                    return (substr.indexOf('new infraArvoreNo("PROCESSO"') !== -1) ? substr : null;
                }).join('');
                procVisualizacao = (procVisualizacao != '') ? procVisualizacao.split(",") : false;
                procVisualizacao = (procVisualizacao) ? procVisualizacao[procVisualizacao.length - 1] : false;
                procVisualizacao = (procVisualizacao) ? procVisualizacao.split('"')[1] : false;
                
            if (urlVisualizacao) {
                if (forceDownload) {
                    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
                    $('#frmCheckerProcessoPro').attr('src', urlVisualizacao).unbind().on('load', function(){
                        var nameFile = $(this).contents().find('title').text();
                        var contentDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
                            contentDocument += $(this).contents().find('html')[0].outerHTML;
                        var downloadLink = document.createElement("a");
                        var blob = new Blob(["\ufeff", contentDocument]);
                        var url = URL.createObjectURL(blob);
                        downloadLink.href = url;
                        downloadLink.download = nameFile+'.html';
                        
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);

                        _this.attr('onmouseover','return infraTooltipMostrar(\'Documento baixado\')').find('i').attr('class', 'fas fa-download verdeColor');
                        _this.closest('tr').addClass('infraTrAcessada').addClass('infraDocBaixado');
                        //scrollToElement($('html'),_this.closest('tr'), 50);
                    });

                } else {
                    resetDialogBoxPro('iframeBoxPro');
                    iframeBoxPro = $('#iframeBoxPro')
                        .html('<div class="iframeBoxDiv" style="width: 100%; height: 100%; margin: 0;"><iframe src="'+urlVisualizacao+'" frameborder="0" height="100%" width="100%"></iframe></div>')
                        .dialog({
                            width: 950,
                            height: $(window).height(),
                            title: (param.title ? param.title : ''),
                            close: function() { 
                                iframeBoxPro = false;
                                $('.iframeBoxPro').html('');
                            },
                            buttons: btnDialogBoxPro
                        });
                }
            } else {
                if (forceDownload) {
                    _this.attr('onmouseover','return infraTooltipMostrar(\'Erro ao baixar documento\')').find('i').attr('class', 'fas fa-exclamation-circle vermelhoColor');
                } else {
                    resetDialogBoxPro('iframeBoxPro');
                    alertaBoxPro('Error', 'exclamation-triangle', 'N\u00E3o foi poss\u00EDvel acessar o documento. <br> Verifique se o processo <a href="'+href+'" target="_blank" class="bLink" style="text-decoration: underline; font-size: 10pt;">'+procVisualizacao+'<i class="fas fa-external-link-alt bLink"" style="font-size: 80%;vertical-align: top;margin-left: 5px;"></i></a> est\u00E1 acess\u00EDvel para sua unidade');    
                }
            }
        }).fail(function(data){
            if (forceDownload) {
                _this.attr('onmouseover','return infraTooltipMostrar(\'Erro ao baixar documento\')').find('i').attr('class', 'fas fa-exclamation-circle vermelhoColor');
            } else {
                resetDialogBoxPro('iframeBoxPro');
                alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao acessar o documento.');
            }
        });
    }).fail(function(data){
        if (forceDownload) {
            _this.attr('onmouseover','return infraTooltipMostrar(\'Erro ao baixar documento\')').find('i').attr('class', 'fas fa-exclamation-circle vermelhoColor');
        } else {
            resetDialogBoxPro('iframeBoxPro');
            alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao acessar o documento.');
        }
    });
}
export function getContentDocSEI(param, callback) {
    var urlProcesso = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+param.id_procedimento+'&id_documento='+param.id_documento;
    $.ajax({ url: urlProcesso }).done(function (html) {
        let $html = $(html);
        var urlArvore = $html.find("#ifrArvore").attr('src');
        $.ajax({ url: urlArvore }).done(function (htmlArvore) {
            var urlVisualizacao = $.map(htmlArvore.split('\n'), function(substr, i) {
                    return (substr.indexOf("'controlador.php?acao=documento_visualizar&acao_origem=procedimento_visualizar&id_documento="+param.id_documento+"&") !== -1) ? substr : null;
                }).join('');
                urlVisualizacao = (urlVisualizacao != '') ? urlVisualizacao.split("'")[1] : false;
                urlVisualizacao = (urlVisualizacao) ? url_host+urlVisualizacao.replace('controlador.php', '') : false;
                
            if (urlVisualizacao) {
                $.ajax({ url: urlVisualizacao }).done(function (contentDoc) {
                    if (typeof callback === 'function') callback(contentDoc);
                }).fail(function(data){
                    alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao acessar o documento.');
                });
            }
        }).fail(function(data){
            alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao acessar o documento.');
        });
    }).fail(function(data){
        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao acessar o documento.');
    });
}
export function updateDialogDefinitionPro() {
    CKEDITOR.on('dialogDefinition', function (ev) {
            var dialogName = ev.data.name;
            var dialogDefinition = ev.data.definition;
            var dialog = dialogDefinition.dialog;
            if (dialogName == 'linkseiDialog') {
                dialogDefinition.onShow = function () {
                    var idEditor = this.getParentEditor().name;
                    $('#idEditor').val(idEditor);
                    insertProtocoloOnBox(idEditor);
                };
            }
            if (dialogName == 'simpleLinkDialog') {
                dialogDefinition.onShow = function () {
                    var idEditor = this.getParentEditor().name;
                    $('#idEditor').val(idEditor);
                    insertTextTotLink(idEditor);
                };
                dialogDefinition.onOk = function () {
                    var a = this.getParentEditor(),
                        b = {},
                        c = a.document.createElement("a");
                    this.commitContent(b);
                    c.setAttribute("href", b.url);
                    b.newPage && c.setAttribute("target", "_blank");
                    switch (b.style) {
                    case "b":
                        c.setStyle("font-weight", "bold");
                        break;
                    case "u":
                        c.setStyle("text-decoration", "underline");
                        break;
                    case "i":
                        c.setStyle("font-style", "italic")
                    }
                    c.setHtml(b.contents);
                    a.insertElement(c);
                    //console.log('setAllLinkTipsPro');
                    setTimeout(function(){ initDropImages() }, 1000);
                };
            }
    });
}
export function centralizeDialogBoxEditor() {
    let dialog = CKEDITOR.dialog.getCurrent();
    if (!!dialog) dialog.move(dialog.getPosition().x, ($(window).height()-$('.cke_dialog_body').height())/2);
}
export function centralizeDialogBox(el, resize = true) {
    if (!dialogIsDraggable) {
        $(document).ready(function() {
            if (el) {
                var paramPos = $(window).height() > $(el).outerHeight() ? { my: "center", at: "center", of: window } : { my: "top", at: "top", of: window }
                el.dialog({ position: paramPos, width: resize && $(el).outerWidth() < 800 ? 'auto' : undefined});
                if (resize) el.dialog({ width: $(el).outerWidth() });
            }
        });
    }
}
export function resizeHeigthDialogBox(dialogBox = dialogBoxPro) {
    const heightSelectBox = dialogBox ? dialogBox.find('.dialogBoxDiv').outerHeight(true) : 0;
    const heightDialogUI = dialogBox ? dialogBox.closest('.ui-dialog').outerHeight(true) : 0;
    const heightDialogBox = dialogBox ? dialogBox.outerHeight(true) : 0;
    const diff = parseInt(heightSelectBox - heightDialogBox);
    if (diff > 0) dialogBox.dialog({ height: heightDialogUI + diff });
}
export const getImageBase64FromImgElement = async (imgElement) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Necessário para imagens de outros domínios com CORS liberado

    return new Promise((resolve, reject) => {
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const dataURL = canvas.toDataURL('image/png'); // ou 'image/jpeg'
                resolve(dataURL);
            } catch (e) {
                reject('Erro ao converter imagem para base64');
            }
        };

        img.onerror = () => reject('Erro ao carregar imagem');

        img.src = imgElement.src;
    });
};
export const getDataBodyResolveCaptcha = (prompt_text, imageBase64 = null) => {
    const parts = imageBase64 ? [
        { text: prompt_text },
        {
            inlineData: {
                mimeType: "image/png", // ou "image/jpeg"
                data: imageBase64.replace(/^data:image\/(png|jpeg);base64,/, '')
            }
        }
    ] : [
        { text: prompt_text }
    ];

    return JSON.stringify({
        contents: [{ role: "user", parts: parts }]
    });
};
export const resolveCaptchaAI = async (prompt_text, imageBase64 = null) => {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${perfilGemini.KEY_USER}`;
    const data = getDataBodyResolveCaptcha(prompt_text, imageBase64); // <-- INCLUINDO A IMAGEM

    // Fase 4 — rede remota delegada ao service worker (centraliza CORS/host).
    // facade-com-fallback: usa SeiPro.core.net SÓ quando há chrome.runtime (mundo
    // ISOLADO). No mundo MAIN (script injetado via $.getScript) chrome.runtime não
    // existe e a fachada REJEITA — então é preciso cair no XHR legado. Checar apenas
    // a existência de SeiPro.core.net não basta (o core é instalado nos dois mundos);
    // por isso o gate é chrome.runtime, a condição real de funcionamento da fachada.
    var hasRuntime = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id);
    var net = hasRuntime && (typeof SeiPro !== 'undefined' && SeiPro.core && SeiPro.core.net);
    if (net) {
        return net.fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data
        }).then(function (response) {
            if (response.status === 200) {
                try {
                    return JSON.parse(response.body).candidates[0].content.parts[0].text;
                } catch (e) {
                    return Promise.reject('Erro ao processar a resposta da IA');
                }
            }
            try {
                var error = JSON.parse(response.body);
                var errorMsg = error?.error?.message ?? 'Erro inesperado';
                console.error(errorMsg);
                return Promise.reject(errorMsg);
            } catch (e) {
                return Promise.reject('Erro inesperado');
            }
        }, function () {
            return Promise.reject('Erro inesperado');
        });
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        let responseText = JSON.parse(xhr.responseText);
                        responseText = responseText.candidates[0].content.parts[0].text;
                        resolve(responseText);
                    } catch (e) {
                        reject('Erro ao processar a resposta da IA');
                    }
                } else {
                    try {
                        const error = JSON.parse(xhr.responseText);
                        const errorMsg = error?.error?.message ?? 'Erro inesperado';
                        console.error(errorMsg);
                        reject(errorMsg);
                    } catch (e) {
                        reject('Erro inesperado');
                    }
                }
            }
        };
        xhr.send(data);
    });
};
export function checkInternalWidthDialogBox() {
    var dialogBoxW = $('#dialogBoxPro').width();
    var dialogBoxTableW = $('#dialogBoxPro table').width();
    if (dialogBoxTableW > dialogBoxW) {
        var widthDialog = dialogBoxTableW+35;
            widthDialog = widthDialog > $(window).width() ? $(window).width() : widthDialog;
            dialogBoxPro.dialog('option', 'width', widthDialog);
    }
}
export function selectTextPro(el) {
    var sel, range;
    if (window.getSelection && document.createRange) { //Browser compatibility
      sel = window.getSelection();
      if(sel.toString() == ''){ //no text selection
         window.setTimeout(function(){
            range = document.createRange(); //range object
            range.selectNodeContents(el); //sets Range
            sel.removeAllRanges(); //remove all ranges from selection
            sel.addRange(range);//add Range to a Selection.
        },1);
      }
    }
}
export function hashCompareDocToggle(this_) {
    if ($(this_).find('i').hasClass('fa-chevron-circle-down')) {
        $(this_).closest('#hashIntegrityPro').find('.hashCompareDoc').show();
        $(this_).find('i').addClass('fa-chevron-circle-up').removeClass('fa-chevron-circle-down');
    } else {
        $(this_).closest('#hashIntegrityPro').find('.hashCompareDoc').hide();
        $(this_).find('i').addClass('fa-chevron-circle-down').removeClass('fa-chevron-circle-up');
    }
}
export function updateChecksumPro(hash) {
    var nameDoc = $('#ifrArvore').contents().find('.infraArvoreNoSelecionado').text();
    var droppableDoc =   '  <div class="input">'+
                         '      <div id="droppable-zone">'+
                         '          <div id="droppable-zone-wrapper">'+
                         '              <div id="droppable-zone-text"><i class="fa fa-upload cinzaColor" style="font-size: 16pt;"></i> Clique ou arraste para carregar um documento</div>'+
                         '          </div>'+
                         '          <input id="inputCompareDoc" type="file" placeholder="Clique ou arraste para carregar um documento" class="droppable-file">'+
                         '      </div>'+
                         '  </div>';
    var tableIntegrity = '<table>'+
                         '  <tr>'+
                         '    <td colspan="2"><h3><i class="iconPopup fa fa-file azulColor" style="margin: 3px 3px 0 0;"></i>'+nameDoc+'</h3></td>'+
                         '  </tr>'+
                         '  <tr>'+
                         '    <td><label>MD5:</label></td>'+
                         '    <td><label class="hash hashMD5">'+hash.hashMD5+'</label></td>'+
                         '  </tr>'+
                         '  <tr>'+
                         '    <td><label>SHA256:</label></td>'+
                         '    <td><label class="hash hashSHA256">'+hash.hashSHA256+'</label></td>'+
                         '  </tr>'+
                         '</table>'+
                         '<div><a onclick="hashCompareDocToggle(this)" class="newLink link_line" style="cursor:pointer"><i class="fa fa-chevron-circle-down cinzaColor" style="margin: 3px 3px 0 0;"></i> Comparar documento</a></div>'+
                         '<div class="hashCompareDoc" style="display:none;">'+
                         '          <input id="inputCompareDoc" style="font-size: 10pt; padding: 15px 10px;" type="file" placeholder="Clique ou arraste para carregar um documento">'+
                         '  <div id="outputompareDoc" style="border-radius: 10px; padding: 0 10px;"></div>'+
                         '</div>';
    $('#hashIntegrityPro').html(tableIntegrity).find('label.hash').on('mouseup', function() { 
        selectTextPro($(this)[0]);
    });
    $('#inputCompareDoc').on('change', function() {
        var input = $('#inputCompareDoc')[0];
        if (input.files && input.files[0]) {
            centralizeDialogBox(dialogBoxPro);
            $('#outputompareDoc').html('<i class="fas fa-sync-alt fa-spin azulColor" style="float: left;margin: 0 8px 0 0;"></i> Carregando dados...').css('background', '#fff');
            var global = global || window;
            const reader = new global.FileReader();
            reader.onload = async event => {
                try {
                    var result = event.target.result;
                    var wordArray = CryptoJS.lib.WordArray.create(result),
                        hashMD5 = CryptoJS.MD5(wordArray).toString(),
                        hashSHA256 = await sha256Hex(result);
                    compareChecksumPro({hashMD5: hashMD5, hashSHA256: hashSHA256});
                } catch (error) {
                    $('#outputompareDoc').text('Não foi possível calcular a integridade do arquivo.').css('background', '#fdf7f7');
                    console.error('[SEI Pro] SHA-256 indisponível', error);
                }
            };
            reader.readAsArrayBuffer(input.files[0]);
        }
    });
}
export function compareChecksumPro(hash) {
    var hashMD5 = $('#hashIntegrityPro').find('.hashMD5').text();
    var hashSHA256 = $('#hashIntegrityPro').find('.hashSHA256').text();
    var statusCompare = (hashMD5 == hash.hashMD5 && hashSHA256 == hash.hashSHA256) ? {background: '#f8fdf7', icon: 'check-circle', color: 'verdeColor', text: 'Os c\u00F3digos de integridade s\u00E3o id\u00EAnticos'} : {background: '#fdf7f7', icon: 'times-circle', color: 'vermelhoColor', text: 'Os c\u00F3digos de integridade N\u00C3O s\u00E3o id\u00EAnticos'};
    var tableIntegrityCompare =  '<table>'+
                                 '  <tr>'+
                                 '    <td colspan="2"><h3><i class="iconPopup fa fa-'+statusCompare.icon+' '+statusCompare.color+'" style="font-size: 18pt;"></i>'+statusCompare.text+'</h3></td>'+
                                 '  </tr>'+
                                 '  <tr>'+
                                 '    <td><label>MD5:</label></td>'+
                                 '    <td><label class="hash hashMD5_compare">'+hash.hashMD5+'</label></td>'+
                                 '  </tr>'+
                                 '  <tr>'+
                                 '    <td><label>SHA256:</label></td>'+
                                 '    <td><label class="hash hashSHA256_compare">'+hash.hashSHA256+'</label></td>'+
                                 '  </tr>'+
                                 '</table>';
    $('#outputompareDoc')
        .html(tableIntegrityCompare)
        .css('background',statusCompare.background)
        .find('label.hash').on('mouseup', function() { 
            selectTextPro($(this)[0]);
    });
    centralizeDialogBox(dialogBoxPro);
}
export function openChecksumPro() {
    var htmlBox = '<div id="hashIntegrityPro"><i class="fas fa-sync-alt fa-spin azulColor" style="float: left;margin: 0 8px 0 0;"></i> Carregando dados...</div>';
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
            .dialog({
                title: "Visualizar C\u00F3digo de Integridade",
                width: 650
        });
}
export function calculateHashPro(blob) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onload = async function () {
      try {
          var wordArray = CryptoJS.lib.WordArray.create(reader.result),
              hashMD5 = CryptoJS.MD5(wordArray).toString(),
              hashSHA256 = await sha256Hex(reader.result);
          updateChecksumPro({hashMD5: hashMD5, hashSHA256: hashSHA256});
          centralizeDialogBox(dialogBoxPro);
      } catch (error) {
          $('#hashIntegrityPro').text('Não foi possível calcular a integridade do arquivo.');
          console.error('[SEI Pro] SHA-256 indisponível', error);
      }
    };
}
export function sendChecksumPro(url) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';

  xhr.onreadystatechange = function (event) {
    if (event.target.readyState == 4) {
      if (event.target.status == 200 || event.target.status == 0) {
        //Status 0 is setup when protocol is "file:///" or "ftp://"
        var blob = this.response;
        calculateHashPro(blob);
      } else {
      }
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
}
export function getChecksumPro() {
    var linkAnexo = $($ifrVisualizacao).contents().find(divInformacao+' a');
    var url = (linkAnexo.length > 0 && linkAnexo.attr('href').indexOf('acao=documento_download_anexo') !== -1) ? linkAnexo.attr('href') : false;
    if (url) { 
        openChecksumPro();
        sendChecksumPro(url);
    }
}

// GERA LISTA DE FERIADOS NACIONAIS
// easterDay migrada para SeiPro.core.feriados (src/core/feriados.js) — Fase 6

// getHolidaysBr e getHolidayBetweenDates migradas para SeiPro.core.feriados (src/core/feriados.js) — Fase 6
export function noNotifyPro(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.no_notifyPro');
    var data = _parent.data();
    if (_this.is(':checked')) {
        setOptionsPro('noNotify_'+data.notify, true);
    } else {
        removeOptionsPro('noNotify_'+data.notify);
    }
}
