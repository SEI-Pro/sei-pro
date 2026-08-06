/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';
import { formatEditorDate } from '../../domain/dates.js';
import { filterProcessFields, processFieldPreview } from '../../domain/process-fields.js';
import { hydrateQrCodePlaceholders } from '../../../../shared/qr-code.js';

function installProcessFieldSearch(dialog, fields) {
    const search = document.getElementById('seipro-process-field-search');
    const preview = document.getElementById('seipro-process-field-preview');
    const selectElement = dialog.getContentElement('tab1', 'listDados');
    const select = document.getElementById(selectElement?._?.inputId);
    if (!search || !preview || !select) return;

    const render = () => {
        const selectedValue = select.value;
        const filtered = filterProcessFields(fields, search.value);
        select.replaceChildren();
        filtered.forEach(([label, value]) => {
            const option = document.createElement('option');
            option.textContent = label;
            option.value = value || '';
            select.appendChild(option);
        });
        if (filtered.some(([, value]) => value === selectedValue)) select.value = selectedValue;
        preview.textContent = processFieldPreview(select.value, {
            parseHtml: (html) => new DOMParser().parseFromString(html, 'text/html')
        });
    };
    search.addEventListener('input', render);
    select.addEventListener('change', render);
    render();
}

export function setDocCertidao() {
    var dadosDocCertidao = sessionStorageRestorePro('dadosDocCertidao');
    var nomeDocCertidao = sessionStorageRestorePro('nomeDocCertidao');
    var param = getParamsUrlPro(window.location.href);
    if (typeof param.acao_pro !== 'undefined' && param.acao_pro == 'set_certidao' && dadosDocCertidao && nomeDocCertidao) {
        api.setCKEDITOR_instances();
        api.initAddButtonTarjaSigilo();
        var modeloHtml =    '<p class="Texto_Centralizado_Maiusculas_Negrito">CERTID\u00C3O</p>'+
                            '<p class="Texto_Centralizado_Maiusculas_Negrito">C\u00D3PIA DE DOCUMENTO OFICIAL COM RESTRI\u00C7\u00C3O LEGAL DE PARTE(S) SOB SIGILO<br><br></p>'+
                            '<p class="Texto_Alinhado_Esquerda">Em observ\u00E2ncia \u00E0 <a class="ancoraSei legisSeiPro" data-norma="Lei12527" data-normafull="Lei n\u00BA 12.527, de 18 de novembro de 2011" data-index="0" data-cke-saved-href="http://www.planalto.gov.br/ccivil_03/_Ato2011-2014/2011/Lei/L12527.htm" href="http://www.planalto.gov.br/ccivil_03/_Ato2011-2014/2011/Lei/L12527.htm" target="_blank" data-reflinkpro="HdNxK8xI">Lei n\u00BA 12.527, de 18 de novembro de 2011</a>, que estabelece, em seu artigo 7\u00BA, \u00A72\u00BA, que:</p>'+
                            '<p class="Citacao">Art. 7\u00BA O acesso \u00E0 informa\u00E7\u00E3o de que trata esta Lei compreende, entre outros, os direitos de obter:<br></p>'+
                            '<p class="Citacao">(...)</p>'+
                            '<p class="Citacao">\u00A72\u00BA Quando n\u00E3o for autorizado acesso integral \u00E0 informa\u00E7\u00E3o, por ser ela parcialmente sigilosa, \u00E9 assegurado o acesso \u00E0 parte n\u00E3o sigilosa por meio de certid\u00E3o, extrato ou c\u00F3pia com oculta\u00E7\u00E3o da parte sob sigilo.</p>'+
                            '<p class="Citacao">(...)</p>'+
                            '<p class="Texto_Alinhado_Esquerda">Como servidor(a) p\u00FAblico(a) em exerc\u00EDcio, aponho minha assinatura e confiro f\u00E9 p\u00FAblica ao documento abaixo, confirmando que esta vers\u00E3o se trata de c\u00F3pia fiel da documenta\u00E7\u00E3o original, havendo sido ocultadas (tarjadas) exclusivamente as informa\u00E7\u00F5es protegidas por sigilo legal, assegurando a fidelidade da informa\u00E7\u00E3o p\u00FAblica. Assim, esta vers\u00E3o passa a coexistir com o documento integral criado com o amparo da citada Lei.</p>'+
                            '<p class="Texto_Alinhado_Esquerda"><br></p>'+
                            '<table border="0" cellspacing="1" cellpadding="1" style="border-collapse:collapse;border-color: rgb(206 206 206);margin-left:auto;margin-right:auto;width:100%;">'+
                            '   <tbody>'+
                            '       <tr>'+
                            '           <td style="background-color: rgb(238, 238, 238);">'+
                            '               <p class="Texto_Centralizado" id="">In\u00EDcio do(a) '+nomeDocCertidao+'</p>'+
                            '           </td>'+
                            '       </tr>'+
                            '       <tr>'+
                            '           <td contenteditable="false">'+
                            '               <p class="Tabela_Texto_Alinhado_Esquerda"><br></p>'+
                            '               '+dadosDocCertidao+
                            '               <p class="Tabela_Texto_Alinhado_Esquerda"><br></p>'+
                            '           </td>'+
                            '       </tr>'+
                            '       <tr>'+
                            '           <td style="background-color: rgb(238, 238, 238);">'+
                            '               <p class="Texto_Centralizado">Fim do(a) '+nomeDocCertidao+'<br></p>'+
                            '           </td>'+
                            '       </tr>'+
                            '   </tbody>'+
                            '</table>'+
                            '<p class="Texto_Alinhado_Esquerda"><br></p>';

            var elemIframe = q('iframe').filter(function(){ return q(this).contents().find('body').attr('contenteditable') == 'true' }).eq(0)
            if (elemIframe.length) {
                var iframe = elemIframe.contents();
                if (elemIframe.attr('title').indexOf(',') !== -1) {
                    state.idEditor = elemIframe.attr('title').split(',')[1].trim();
                    q('#idEditor').val(state.idEditor);
                    state.oEditor = CKEDITOR.instances[state.idEditor];
                    if (typeof oEditor !== 'undefined') {
                        state.oEditor.focus();
                        state.oEditor.fire('saveSnapshot');
                        iframe.find('body').html(modeloHtml);
                        api.actionsMarkSigilo(undefined, 'apply');
                        enableButtonSavePro();

                        var $form = state.oEditor.element.$.form;
                        if ($form) $form.submit();

                        sessionStorageRemovePro('dadosDocCertidao');
                        sessionStorageRemovePro('nomeDocCertidao');
                    }
                }
            }
        /*
        var maxIframeHeight = {value: 0, index: -1}
        $('iframe.cke_wysiwyg_frame').each(function(index){
            if ( $(this).contents().find('body').attr('contenteditable') == 'true' ) {
                var height = $(this).height();
                if (height > maxIframeHeight.value) {
                    maxIframeHeight = {value: height, index: index};
                }
            }
        });
        if (maxIframeHeight.index != -1) {
            var elemIframe = $('iframe').eq(maxIframeHeight.index);
            var iframe = elemIframe.contents();
            if (elemIframe.attr('title').indexOf(',') !== -1) {
                var idEditor = elemIframe.attr('title').split(',')[1].trim();
                $('#idEditor').val(idEditor);
                oEditor = CKEDITOR.instances[idEditor];
                if (typeof oEditor !== 'undefined') {
                    oEditor.focus();
                    oEditor.fire('saveSnapshot');
                    iframe.find('body').html(modeloHtml);
                    actionsMarkSigilo(undefined, 'apply');
                    enableButtonSavePro();

                    var $form = oEditor.element.$.form;
                    if ($form) $form.submit();

                    sessionStorageRemovePro('dadosDocCertidao');
                    sessionStorageRemovePro('nomeDocCertidao');
                }
            }
        }
        */
    }
}
export function setDocAutomatico() {
    var dadosDocAutomatico = sessionStorageRestorePro('dadosDocAutomatico');
    var nomeDocAutomatico = sessionStorageRestorePro('nomeDocAutomatico');
    var param = getParamsUrlPro(window.location.href);
    if (typeof param.acao_pro !== 'undefined' && param.acao_pro == 'set_automatico' && dadosDocAutomatico && nomeDocAutomatico) {
        api.setCKEDITOR_instances();
        api.initAddButtonTarjaSigilo();
        var elemIframe = q('iframe').filter(function(){ return q(this).contents().find('body').attr('contenteditable') == 'true' }).eq(0)
        if (elemIframe.length) {
            var iframe = elemIframe.contents();
            if (elemIframe.attr('title').indexOf(',') !== -1) {
                state.idEditor = elemIframe.attr('title').split(',')[1].trim();
                q('#idEditor').val(state.idEditor);
                state.oEditor = CKEDITOR.instances[state.idEditor];
                if (typeof state.oEditor !== 'undefined') {
                    state.oEditor.focus();
                    oEditor.fire('saveSnapshot');
                    iframe.find('body').html(dadosDocAutomatico);
                    api.actionsMarkSigilo(undefined, 'apply');

                    sessionStorageRemovePro('dadosDocAutomatico');
                    sessionStorageRemovePro('nomeDocAutomatico');

                    setTimeout(function(){
                        enableButtonSavePro();

                        var $form = state.oEditor.element.$.form;
                        if ($form) $form.submit();
                    }, 1500);
                }
            }
        }
    }
}
export function replaceDadosEditor(this_) {
    var arrayTags = uniqPro(getHashTagsPro(iframeEditor.find('p').map(function(){ return q(this).text().replace(/\u00A0/gm, " ") }).get().join(' ')));
    var delimitLine = false;
    var prop = dadosProcessoPro.propProcesso;
    var docs = dadosProcessoPro.listDocumentos;

    var tagField = state.iframeEditor.find('body').find('span.hashField');
    if (tagField.length) { tagField.after(tagField.html()).remove() }

    var dadosProcesso = camposDinamicosProcesso(arrayTags);
    var dadosTags = [];
        q.each(prop.txaTagsObservacoes, function (index, valueTag) {
            if (valueTag.unidade != siglaUnidadeAtual) {
                q.each(valueTag.tags, function (i, v) {
                    var isRegex = new RegExp(v.value, 'i').test(undefined);
                    dadosProcesso[v.name] = '<span class="ancoraSei dynamicField">'+v.value+'</span>';
                    dadosTags.push(v.name);
                });
            }
        });
        q.each(prop.txaTagsObservacoes, function (index, valueTag) {
            if (valueTag.unidade == siglaUnidadeAtual) {
                q.each(valueTag.tags, function (i, v) {
                    dadosProcesso[v.name] = '<span class="ancoraSei dynamicField">'+v.value+'</span>';
                    dadosTags.push(v.name);
                });
            }
        });

    var count = 0;
    state.oEditor.focus();
    state.oEditor.fire('saveSnapshot');
    q.each(arrayTags, function (i, value) {
        var _value = value;
        var underline = (value.indexOf('_') !== -1 && q.inArray(_value, dadosTags) === -1) ? '_'+value.split('_')[1] : '';
            value = (value.indexOf('_') !== -1) ? value.split('_')[0] : value;
            value = (q.inArray(_value, dadosTags) !== -1) ? _value : value;
        var hashTag = (value.indexOf('+') !== -1) ? '#'+(value.replace('+', '\\+')) : '#'+value;
        var hashSpan = '<span class="ancoraSei hashField" data-hash="'+value+'">#'+value+'</span>';
        var fieldSpan = (typeof dadosProcesso[value] !== 'undefined' && dadosProcesso[value] !== null) ? dadosProcesso[value] : hashSpan;
            fieldSpan = (value.indexOf('+') !== -1 || value.indexOf('-') !== -1 || (hasNumber(value) && q.inArray(_value, dadosTags) === -1) ) ? sumTagValue(value): fieldSpan;
            fieldSpan = fieldSpan+'&nbsp;';
            state.iframeEditor.find('p').each(function(){
                q(this).html(q(this).html().replace(new RegExp(hashTag+underline, "i"), function(){ count++; return fieldSpan }));
            });
        console.log(arrayTags, value, hashTag+underline, fieldSpan, dadosProcesso);
    });
    hydrateQrCodePlaceholders(state.iframeEditor.get(0), {
        render: 'image',
        size: 150,
        fill: '#333333',
        background: '#ffffff',
        ecLevel: 'L',
        minVersion: 6
    });
    state.oEditor.fire('saveSnapshot');
    var count_error = state.iframeEditor.find('.hashField').length;
        count_error = (count_error == 0) ? '' : '  <i class="fas fa-exclamation-triangle laranjaColor"></i> '+count_error+' '+(count_error==1 ? 'campo din\u00E2mico n\u00E3o substitu\u00EDdo' : 'campos n\u00E3o din\u00E2micos substitu\u00EDdos')+'.';
    var resultDiv = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                    '  <i class="fas fa-check-circle verdeColor"></i> '+count+' '+(count==1 ? 'campo din\u00E2mico substitu\u00EDdo' : 'campos din\u00E2micos substitu\u00EDdos')+' com sucesso!<br>'+count_error+
                    '</label>';
    q('#tabReplaceTag_result').show().html(resultDiv);
}
export function arrayDadosEditor() {
        setMomentPtBr();
    var listaDadosEditor = [['']];
    var prop = dadosProcessoPro.propProcesso;
    var processo = (typeof prop !== 'undefined' && typeof prop.txtProtocoloExibir === 'undefined') ? prop.hdnProtocoloFormatado : prop.txtProtocoloExibir;
    var dataGeracao = (typeof prop.txtDtaGeracaoExibir === 'undefined') ? prop.hdnDtaGeracao : prop.txtDtaGeracaoExibir;
    var htmlProcesso = '<span contenteditable="false" data-cke-linksei="1" style="text-indent:0px;"><a id="lnkSei'+prop.hdnIdProcedimento+'" class="ancoraSei" style="text-indent:0px;">'+processo+'</a></span>';
        listaDadosEditor.push(['Processo: '+processo,htmlProcesso]);
        listaDadosEditor.push(['Data de Autua\u00E7\u00E3o: '+dataGeracao,dataGeracao]);
        listaDadosEditor.push(['Tipo: '+prop.hdnNomeTipoProcedimento,prop.hdnNomeTipoProcedimento]);
        listaDadosEditor.push(['Especifica\u00E7\u00E3o: '+prop.txtDescricao,prop.txtDescricao]);

    var acesso = (typeof prop.rdoNivelAcesso !== 'undefined' && prop.rdoNivelAcesso == 0) ? 'P\u00FAblico' : null;
        acesso = (acesso !== null && prop.rdoNivelAcesso == 1) ? 'Restrito' : acesso;
        acesso = (acesso !== null && prop.rdoNivelAcesso == 2) ? 'Sigiloso' : acesso;
        listaDadosEditor.push(['N\u00EDvel de Acesso: '+acesso,acesso]);

        q.each(prop.selInteressadosProcedimento, function (index, value) {
            listaDadosEditor.push(['Interessado: '+value,value]);
        });
        q.each(prop.selAssuntos_select, function (index, value) {
			var valueAssunto = ( value.length > 100 ) ? value.replace(/^(.{100}[^\s]*).*/, "$1")+'...' : value;
            listaDadosEditor.push(['Assunto: '+valueAssunto,value]);
        });
        q.each(prop.txaObservacoes, function (index, value) {
			var valueObs = ( value.observacao.length > 100 ) ? value.observacao.replace(/^(.{100}[^\s]*).*/, "$1")+'...' : value.observacao;
            listaDadosEditor.push(['Observa\u00E7\u00E3o ('+value.unidade+'): '+valueObs,value.observacao]);
        });
        var today = formatEditorDate(new Date());
        var currentYear = String(new Date().getFullYear());
        listaDadosEditor.push(['Hoje: '+today,today]);
        listaDadosEditor.push(['Ano: '+currentYear,currentYear]);
        listaDadosEditor.push(['QRCode do Processo',getQRProcesso()]);
        q.each(prop.txaTagsObservacoes, function (index, valueTag) {
            q.each(valueTag.tags, function (i, v) {
                var vObs = ( v.value.length > 100 ) ? v.value.replace(/^(.{100}[^\s]*).*/, "$1")+'...' : v.value;
                listaDadosEditor.push(['Personalizado ('+valueTag.unidade+') #'+v.name+': '+vObs,v.value]);
            });
        });
        if (typeof dadosProcessoPro.listAtribuicaoProcesso !== 'undefined') {
            q.each(dadosProcessoPro.listAtribuicaoProcesso, function (index, value) {
                listaDadosEditor.push(['Respons\u00E1vel: '+value.name,value.name]);
            });
        }
    return listaDadosEditor;
}
export function getDadosEditor(this_, TimeOut = 9000) {
    if (checkProcessoSigiloso()) {
        CKEDITOR.dialog.add( 'DadosSEI', function(editor) { return getDialogNaoDisponivel('Dados do Processo') } );
        api.setParamEditor(this_);
        state.oEditor.openDialog('DadosSEI');
    } else {
        if (TimeOut <= 0) {
            if (typeof alertaBoxPro === 'function') {
                alertaBoxPro('Aviso', 'exclamation-triangle', 'Não foi possível carregar os dados do processo. Atualize a página e tente novamente.');
            }
            return;
        }
        if (typeof dadosProcessoPro.propProcesso !== 'undefined' && typeof dadosProcessoPro.listDocumentos !== 'undefined' && api.arrayDadosEditor().length) {
            // The page runtime can receive the process cache before this module
            // is exposed on the legacy API. Register on demand as well, so the
            // toolbar never tries to open an undefined CKEditor dialog.
            api.getDialogDadosEditor();
            api.setParamEditor(this_);
            state.oEditor.openDialog('DadosSEI');
        } else {
            setTimeout(function(){
                if (typeof dadosProcessoPro.propProcesso === 'undefined' && getDadosProcessoSession() ) {
                    dadosProcessoPro = getDadosProcessoSession();
                }
                api.getDadosEditor(this_, TimeOut - 100);
                q(this_).fadeOut(200).fadeIn(200);
                if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload api.getDadosEditor');
            }, 500);
        }
    }
}
export function getDialogDadosEditor() {
    if (!checkProcessoSigiloso()) {
        if (window.__SEI_PRO_DADOS_DIALOG_REGISTERED__) return;
        var tableNewDynamicField = '';
        var dadosEditorArray = api.arrayDadosEditor();
        var tagsArray = jmespath.search(dadosProcessoPro.propProcesso.txaTagsObservacoes, "[?unidade=='"+siglaUnidadeAtual+"'] | [0]");
        tagsArray = (tagsArray === null) ? jmespath.search(dadosProcessoPro.propProcesso.txaTagsObservacoes, "[?unidade==''] | [0]") : tagsArray;
            tableNewDynamicField =        '<table role="presentation" class="cke_dialog_ui_hbox tableZebra">'+
                                        ' <thead>'+
                                        '     <tr>'+
                                        '         <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Nome do campo din\u00E2mico</th>'+
                                        '         <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Valor</th>'+
                                        '     </tr>'+
                                        ' </thead>'+
                                        ' <tbody>';
        if (tagsArray !== null) {
            q.each(tagsArray.tags, function(index, v){
                tableNewDynamicField +=  '     <tr class="cke_dialog_ui_hbox" data-tag="'+v.name+'">'+
                                        '         <td class="" role="presentation" style="width:30%; padding:8px">'+
                                        '             <label class="cke_dialog_ui_labeled_label"><b class="hashSpan">#'+v.name+'</b></label>'+
                                        '         </td>'+
                                        '         <td class="" role="presentation" style="width:70%; padding:8px">'+
                                        '             <em>'+v.value+'</em>'+
                                        '             <a style="user-select: none; float: right;" data-seipro-action="removeDynamicField" title="Remover" hidefocus="true" class="cke_dialog_ui_button" role="button">'+
                                        '                 <span id="buttonRemoveDynamicField_label" class="cke_dialog_ui_button">'+
                                        '                     <i style="color: #989898;" class="fas fa-trash"></i>'+
                                        '                 </span>'+
                                        '             </a>'+
                                        '             <a style="user-select: none; float: right; margin-right: 10px;" data-seipro-action="editDynamicField" title="Editar" hidefocus="true" class="cke_dialog_ui_button" role="button">'+
                                        '                 <span id="buttonEditDynamicField_label" class="cke_dialog_ui_button">'+
                                        '                     <i style="color: #989898;" class="fas fa-pencil-alt"></i>'+
                                        '                 </span>'+
                                        '             </a>'+
                                        '         </td>'+
                                        '     </tr>';
            });
        }
                tableNewDynamicField += ' </tbody>'+
                                        '</table>';

        CKEDITOR.dialog.add( 'DadosSEI', function(editor)
        {
            return {
                title : 'Dados do Processo',
                minWidth : 750,
                minHeight : 80,
                buttons: [ CKEDITOR.dialog.okButton ],
                onOk: function(event, a, b) {
                    var value = this.getContentElement( 'tab1', 'listDados' ).getValue();
                    if ( value != '' ) {
                        api.insertDadosEditor(value);
                        event.data.hide = true;
                    }
                },
                onShow : function() {
                    var arrayTags_len = (getHashTagsPro(iframeEditor.find('p').map(function(){ return q(this).text() }).get().join(' '))).length;
                    var resultDiv = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                                    '  <i class="fas fa-info-circle" style="color: #007fff;"></i> '+arrayTags_len+' '+(arrayTags_len==1 ? 'campo din\u00E2mico detectado' : 'campos din\u00E2micos detectados')+'!<br>'+
                                    '</label>';
                    q('#tabReplaceTag_result').show().html(resultDiv);
                    q('#tabNewDynamicField_alert').hide().html('');
                    if (verifyConfigValue('substituiselecao')) api.setChosenInCke();
                    installProcessFieldSearch(this, dadosEditorArray);
                },
                contents :
                [
                {
                    id : 'tab1',
                    label : 'Inserir Dados do Processo',
                    elements :
                    [
                        {
                            type: 'html',
                            html: '<label for="seipro-process-field-search" class="cke_dialog_ui_labeled_label">Pesquisar campo</label>'+
                                '<input id="seipro-process-field-search" type="search" class="cke_dialog_ui_input_text" autocomplete="off" placeholder="Ex.: interessado, assunto, data ou responsável" style="width:100%;box-sizing:border-box;margin-bottom:8px;">'+
                                '<p id="seipro-process-field-preview" class="seipro-process-field-preview" aria-live="polite" style="margin:0 0 10px;padding:8px;background:#f8f9fa;border-radius:4px;"></p>'
                        },
                        {
                            type: 'select',
                            id: 'listDados',
                            // labelLayout: 'horizontal',
                            inputStyle: 'max-width: 560px',
                            label: 'Dados do Processo',
                            items: dadosEditorArray,
                            'default': ''
                        }
                    ]
                },{
                    id : 'tab2',
                    label : 'Substituir Campos Din\u00E2micos',
                    elements :
                    [
                        {
                            type: 'html',
                            html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                                ' <tbody>'+
                                '     <tr class="cke_dialog_ui_hbox">'+
                                '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                                '             <label class="cke_dialog_ui_labeled_label">Substituir campos din\u00E2micos no documento</label>'+
                                '         </td>'+
                                '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                                '             <a style="user-select: none;" data-seipro-action="replaceDadosEditor" title="Substituir" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo1_label" id="buttonSigilo1_uiElement">'+
                                '                 <span id="buttonSigilo1_label" class="cke_dialog_ui_button">Substituir</span>'+
                                '             </a>'+
                                '         </td>'+
                                '     </tr>'+
                                ' </tbody>'+
                                '</table>'+
                                '<div id="tabReplaceTag_result" class="tabReplaceTag_result" style="display:none; margin-top: 15px;"></div>'
                        }
                    ]
                },{
                    id : 'tab3',
                    label : 'Campos Din\u00E2micos Personalizados',
                    elements :
                    [
                        {
                            type: 'html',
                            html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                                ' <tbody>'+
                                '     <tr class="cke_dialog_ui_hbox">'+
                                '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">'+
                                '             <label class="cke_dialog_ui_labeled_label" id="cke_inputNameDynamicField_label" for="cke_inputNameDynamicField_textInput">Nome do campo din\u00E2mico:</label>'+
                                '         </td>'+
                                '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px 0">'+
                                '             # <input style="max-width: 510px;" tabindex="2" placeholder="Insira um nome personalizado, sem acentos ou espa\u00E7os" class="cke_dialog_ui_input_text" id="cke_inputNameDynamicField_textInput" type="text" aria-labelledby="cke_inputNameDynamicField_label">'+
                                '         </td>'+
                                '     </tr>'+
                                '     <tr class="cke_dialog_ui_hbox">'+
                                '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">'+
                                '             <label class="cke_dialog_ui_labeled_label" id="cke_inputValueDynamicField_label" for="cke_inputValueDynamicField_textInput">Valor do campo din\u00E2mico:</label>'+
                                '         </td>'+
                                '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px 0">'+
                                '             <input tabindex="3" placeholder="Insira o valor para o campo din\u00E2mico" class="cke_dialog_ui_input_text" id="cke_inputValueDynamicField_textInput" type="text" aria-labelledby="cke_inputValueDynamicField_label">'+
                                '         </td>'+
                                '     </tr>'+
                                '     <tr class="cke_dialog_ui_hbox">'+
                                '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">'+
                                '         </td>'+
                                '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px 0">'+
                                '             <a style="user-select: none;" data-seipro-action="newDynamicField" title="Salvar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonNewDynamicField_label" id="buttonNewDynamicField_uiElement">'+
                                '                 <span id="buttonNewDynamicField_label" class="cke_dialog_ui_button">Salvar</span>'+
                                '             </a>'+
                                '         </td>'+
                                '     </tr>'+
                                ' </tbody>'+
                                '</table>'+
                                '<div id="tabNewDynamicField_alert" class="tabReplaceTag_result" style="display:none; margin-top: 15px;"></div>'+
                                '<div id="tabNewDynamicField_result" class="tabReplaceTag_result" style="margin-top: 15px;">'+
                                '     '+tableNewDynamicField+
                                '</div>'+
                                '<div id="tabNewDynamicField_info" class="tabReplaceTag_result" style="margin-top: 15px;">'+
                                '     <label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                                '         <i class="fas fa-info-circle" style="color: #007fff;"></i> Os campos din\u00E2micos personalizados s\u00E3o salvos nas observa\u00E7\u00F5es da unidade para este processo.'+
                                '     </label>'+
                                '</div>'
                        }
                    ]
                },{
                    id : 'tab4',
                    label : 'Lista de Campos Din\u00E2micos',
                    elements :
                    [
                        {
                            type: 'html',
                            html: '<table role="presentation" class="cke_dialog_ui_hbox tableZebra">'+
                                ' <tbody>'+
                                '     <tr class="cke_dialog_ui_hbox">'+
                                '         <td class="" role="presentation" style="width:100%; padding:0px">'+
                                '             <div id="tabReplaceTag_list" style="height: 285px; overflow-y: scroll;">'+
                                '                  <label class="cke_dialog_ui_labeled_label" style="display: block;"><span style="font-size: 10pt;"><i class="fas fa-hashtag" style="color: #007fff; font-size: 12pt;"></i> Lista de campos din\u00E2micos dispon\u00EDveis para utiliza\u00E7\u00E3o</span></label>'+
                                '                  <table role="presentation" style="margin-top: 15px;" class="cke_dialog_ui_hbox" id="cke_tabReplaceTag_uiElement">'+
                                '                   <tbody>'+
                                '                       '+api.getDialogDadosEditor_htmlListTag('processo', 'N\u00FAmero do processo <em>(com link)</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('processo_texto', 'N\u00FAmero do processo <em>(sem link)</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('autuacao', 'Data de autua\u00E7\u00E3o do processo <em>(em formato DD/MM/AAAA)</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('tipo', 'Tipo do processo')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('especificacao', 'Especifica\u00E7\u00E3o do processo')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('assuntos', 'Classifica\u00E7\u00E3o por assuntos do processo <em>(separados por v\u00EDrgula)</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('assuntos_lista', 'Classifica\u00E7\u00E3o por assuntos do processo <em>(em formato de lista)</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('interessados', 'Interessados do processo <em>(separados por v\u00EDrgula)</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('interessados_lista', 'Interessados do processo <em>(em formato de lista)</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('observacoes', 'Observa\u00E7\u00F5es do processo <em>(separados por v\u00EDrgula)</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('observacoes_lista', 'Observa\u00E7\u00F5es do processo <em>(em formato de lista)</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('observacao', 'Observa\u00E7\u00E3o da unidade atual</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('acesso', 'N\u00EDvel de acesso do processo')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('acesso_texto', 'N\u00EDvel de acesso do processo <em>(sem \u00EDcone)</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('documentos', 'Lista de todos os documentos do processo (separados por v\u00EDrgula)</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('totaldocumentos', 'N\u00FAmero de documentos do processo</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('documentos_lista', 'Lista de todos os documentos do processo (em formato de lista)</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('hoje', 'Data de hoje <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('ano', 'Ano corrente <em>(em formato de 4 d\u00EDgitos [YYYY])</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('qrcode', 'QRCode do link para acesso ao processo (SEI Interno)</em>')+
                                '                   </tbody>'+
                                '                  </table>'+
                                '                  <label class="cke_dialog_ui_labeled_label" style="margin-top: 15px; display: block;"><span style="font-size: 10pt;"><i class="fas fa-user-ninja roxoColor" style="font-size: 12pt;"></i> Fun\u00E7\u00F5es Avan\u00E7adas</span></label>'+
                                '                  <table role="presentation" style="margin-top: 15px;" class="cke_dialog_ui_hbox" id="cke_tabReplaceTagAdv_uiElement">'+
                                '                   <tbody>'+
                                '                       '+api.getDialogDadosEditor_htmlListTag('assunto1', 'Primeiro assunto do processo')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('assunto3', 'Terceiro assunto do processo')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('interessado1', 'Primeiro interessado do processo')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('interessado4', 'Quarto interessado do processo')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('observacao1', 'Primeira observa\u00E7\u00E3o do processo')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('observacao2', 'Segunda observa\u00E7\u00E3o do processo')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('documento1', 'Primeiro documento do processo')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('documento5', 'Quinto documento do processo')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('documento+1', 'Pr\u00F3ximo documento do processo em rela\u00E7\u00E3o ao atual')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('documento+3', 'Terceiro documento do processo em rela\u00E7\u00E3o ao atual')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('documento-1', 'Primeiro documento do processo anterior ao atual')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('documento-6', 'Sexto documento do processo anterior ao atual')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('hoje+1', 'Amanh\u00E3 <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('hoje-1', 'Ontem <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('hoje+7', 'Data daqui 7 dias <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')+
                                '                       '+api.getDialogDadosEditor_htmlListTag('hoje-5', 'Data \u00E0 5 dias atr\u00E1s <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')+
                                '                   </tbody>'+
                                '                  </table>'+
                                '             </div>'+
                                '         </td>'+
                                '     </tr>'+
                                ' </tbody>'+
                                '</table>'
                        }
                    ]
                }
                ]
            };
        } );
        window.__SEI_PRO_DADOS_DIALOG_REGISTERED__ = true;
    }
}
export function removeDynamicField(this_) {
    q(this_).closest('tr').fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).slideUp('slow', function() {
        q(this).remove();
        updateDynamicField();
        var result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                     '  <i class="fas fa-check-circle verdeColor"></i> Campo din\u00E2mico exclu\u00EDdo com sucesso!<br>'+
                     '</label>';
        q('#tabNewDynamicField_alert').show().html(result);
    });
}
export function editDynamicField(this_) {
    var _this = q(this_);
    var _parent = _this.closest('tr');
    var name = _parent.find('td').eq(0).find('b').text().replace('#', '');
    var value = _parent.find('td').eq(1).find('em').text();
        q('#cke_inputNameDynamicField_textInput').val(name);
        q('#cke_inputValueDynamicField_textInput').val(value);
}
export function newDynamicField(this_) {
    var _this = q(this_);
    var _parent = _this.closest('table');
    var nameInput = _parent.find('#cke_inputNameDynamicField_textInput');
    var valueInput = _parent.find('#cke_inputValueDynamicField_textInput');
    var arrayRestictTags = uniqPro(q('#tabReplaceTag_list table').find('b').map(function(){ return q(this).text().replace(/[^a-zA-Z_]+/g, '') }).get());
    var name = (nameInput.val() != '') ? removeAcentos(nameInput.val().split(':')[0].replace('#','')).replace(/\ /g, '').toLowerCase().trim() : nameInput.val();
    var value = valueInput.val().trim();
    var result = '';
    q('#tabNewDynamicField_alert').hide().html('');
    if (name != '' && value != '') {
        if (q.inArray(name, arrayRestictTags) === -1) {
            var htmlNewDynamicField = '     <tr class="cke_dialog_ui_hbox" data-tag="'+name+'">'+
                                      '         <td class="" role="presentation" style="width:30%; padding:8px">'+
                                      '             <label class="cke_dialog_ui_labeled_label"><b class="hashSpan">#'+name+'</b></label>'+
                                      '         </td>'+
                                      '         <td class="" role="presentation" style="width:70%; padding:8px">'+
                                      '             <em>'+value+'</em>'+
                                      '             <a style="user-select: none; float: right;" data-seipro-action="removeDynamicField" title="Remover" hidefocus="true" class="cke_dialog_ui_button" role="button">'+
                                      '                 <span id="buttonRemoveDynamicField_label" class="cke_dialog_ui_button">'+
                                      '                     <i style="color: #989898;" class="fas fa-trash"></i>'+
                                      '                 </span>'+
                                      '             </a>'+
                                      '             <a style="user-select: none; float: right; margin-right: 10px;" data-seipro-action="editDynamicField" title="Editar" hidefocus="true" class="cke_dialog_ui_button" role="button">'+
                                      '                 <span id="buttonEditDynamicField_label" class="cke_dialog_ui_button">'+
                                      '                     <i style="color: #989898;" class="fas fa-pencil-alt"></i>'+
                                      '                 </span>'+
                                      '             </a>'+
                                      '         </td>'+
                                      '     </tr>';
            var trTagEdit = q('#tabNewDynamicField_result').find('table tbody').find('tr[data-tag="'+name+'"]');
                if (trTagEdit.length == 0) {
                    q('#tabNewDynamicField_result').find('table tbody').prepend(htmlNewDynamicField);
                    q('#tabNewDynamicField_result').find('table tbody').find('tr').eq(0).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                } else {
                    trTagEdit.find('td').eq(0).find('b').text('#'+name);
                    trTagEdit.find('td').eq(1).find('em').text(value);
                    trTagEdit.eq(0).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                }
                result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                         '  <i class="fas fa-check-circle verdeColor"></i> Campo din\u00E2mico salvo com sucesso!<br>'+
                         '</label>';
                nameInput.val('');
                valueInput.val('');
                api.updateDynamicField();
        } else {
            result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                     '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nome restrito para utiliza&#x00E7;&#x00E3;o interna (Lista de campos din&#x00E2;micos). Insira outro nome!'+
                     '</label>';
        }
        q('#tabNewDynamicField_alert').show().html(result);
    }
}
export function updateDynamicField() {
    var selectId = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'listDados')._.inputId;
        q('#'+selectId).find('option').each(function(){
            if (q(this).text().trim().split(' ')[0] == 'Personalizado') {
                q(this).remove();
            }
        });

    var txtObsDynamicField = '';
    var arrayNewDynamicField = [];
        q('#tabNewDynamicField_result').find('table tbody tr').each(function(index, value){
            var name = q(this).find('td').eq(0).find('b').text().trim().replace('#', '');
            var value = q(this).find('td').eq(1).find('em').text().trim();
            q('#'+selectId).append('<option value="'+value+'">Personalizado ('+siglaUnidadeAtual+') #'+name+': '+value+'</option>');
            arrayNewDynamicField.push({name: name, value: value});
            txtObsDynamicField += '#'+name+': '+value+'\n';
        });

        q.each(dadosProcessoPro.propProcesso.txaTagsObservacoes, function(index, value){
            if (value.unidade == siglaUnidadeAtual) {
                dadosProcessoPro.propProcesso.txaTagsObservacoes[index].tags = arrayNewDynamicField;
            }
        });
    var txaObservacoes = jmespath.search(dadosProcessoPro.propProcesso.txaObservacoes, "[?unidade=='"+siglaUnidadeAtual+"'].observacao | [0]")
        txtObsDynamicField = (txaObservacoes !== null) ? txtObsDynamicField+txaObservacoes : txtObsDynamicField;
        updateDadosProcesso('txaObservacoes', txtObsDynamicField);
        console.log('arrayNewDynamicField', arrayNewDynamicField, txtObsDynamicField);
}
export function getDialogDadosEditor_htmlListTag(tag, desc) {
    return '          <tr class="cke_dialog_ui_hbox">'+
           '              <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:8px">'+
           '                  <label class="cke_dialog_ui_labeled_label"><b class="hashSpan">#'+tag+'</b></label>'+
           '              </td>'+
           '              <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px; vertical-align: middle;">'+
           '                  '+desc+
           '              </td>'+
           '          </tr>';
}
export function insertDadosEditor(value) {
        oEditor.focus();
        state.oEditor.fire('saveSnapshot');
        state.oEditor.insertHtml(value);
        oEditor.fire('saveSnapshot');
}
api.setDocCertidao = setDocCertidao;
api.setDocAutomatico = setDocAutomatico;
api.replaceDadosEditor = replaceDadosEditor;
api.arrayDadosEditor = arrayDadosEditor;
api.getDadosEditor = getDadosEditor;
api.getDialogDadosEditor = getDialogDadosEditor;
api.removeDynamicField = removeDynamicField;
api.editDynamicField = editDynamicField;
api.newDynamicField = newDynamicField;
api.updateDynamicField = updateDynamicField;
api.getDialogDadosEditor_htmlListTag = getDialogDadosEditor_htmlListTag;
api.insertDadosEditor = insertDadosEditor;
