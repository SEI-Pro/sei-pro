/**
 * SEI Pro - Editor / Feature: Gerar link curto (TinyURL)
 *
 * Abre um dialogo jQuery UI para encurtar um link via TinyURL, com nome
 * personalizado (alias) opcional, e insere o link curto resultante como
 * ancora no documento.
 *
 * Modulo da arquitetura modular (ver js/modules/editor/README.md):
 *  - Define o handler global com o MESMO nome usado pelo monolito em
 *    setClickButtons: $('.getTinyUrlButtom').on('click', ... getTinyUrl(this)).
 *  - Carregado ANTES do monolito (adapter -> modulos -> editor), portanto NAO
 *    chama helpers do monolito em tempo de avaliacao. Os helpers usados
 *    (sanitizeHTML, resetDialogBoxPro, initChosenReplace, isValidHttpUrl,
 *    alertaBoxPro) vem de sei-functions-pro.js (globais, disponiveis no clique).
 *  - A instancia do editor e a insercao do link sao roteadas pelo
 *    SeiProEditorAdapter (CK4 e CK5).
 *
 * Estado: EXTRACAO. getTinyUrl ja estava limpo (dialogo jQuery UI + selecao
 * nativa via window.getSelection + adapter.getInstance), sem dependencia de
 * CK4 cru. Movido verbatim.
 *
 * Observacao: ajaxTinyUrl NAO foi movido. Alem de getTinyUrl (modo 'insert'),
 * ele e chamado por convertTinyURL() da feature de QR Code (modo 'setinput').
 * Por ser compartilhado entre features, permanece no monolito.
 */
(function () {
    'use strict';

    window.getTinyUrl = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        const htmlBox = sanitizeHTML(`
            <div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
                <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                    <tr>
                        <td style="vertical-align: bottom; text-align: left;" class="label">
                            <label for="urlTiny"><i class="iconPopup iconSwitch fas fa-compress-arrows-alt cinzaColor"></i>Insira o link que deseja encurtar:</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" id="urlTiny">
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: bottom; text-align: left;" class="label">
                            <label for="aliasTiny"><i class="iconPopup iconSwitch fas fa-audio-description cinzaColor"></i>Insira um Nome Personalizado para o link (opcional):</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" id="aliasTiny">
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: bottom; text-align: left;" class="label" id="tinyResult" colspan="2">
                        </td>
                    </tr>
                </table>
            </div>
        `);

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html(htmlBox)
            .dialog({
                title : 'Gerar link curto do TinyURL',
                width : 600,
                height : 300,
                open: function () {
                    initChosenReplace('box_multiple', this, true);
                    // Texto selecionado: prefere selecao nativa do DOM (funciona em CK4 e CK5).
                    var _nsel = window.getSelection && window.getSelection();
                    var selectTxt = _nsel ? String(_nsel).trim() : '';
                    setTimeout(function(){
                        $('#tinyResult').html('');
                        $('#urlTiny').focus();
                        if ( selectTxt != '' && isValidHttpUrl(selectTxt) ) {
                            $('#urlTiny').val(selectTxt);
                        }
                        $('#aliasTiny').unbind('keyup').keyup(function() {
                            $('#tinyResult').html('');
                            var alias = $('#aliasTiny').val();
                            if ( alias != '' ) {
                                var regex = /^[0-9A-Za-z\-]+$/;
                                var htmlTinyResult = ( regex.test(alias) ) ? 'Resultado: <a class="linkDialog" style="cursor: auto;">https://tinyurl.com/'+alias+'</a>' : '<strong style="color:red;">O nome personalizado deve conter apenas letras, n\u00FAmeros e travess\u00F5es.</strong>';
                                $('#tinyResult').html(htmlTinyResult);
                            }
                        });
                    }, 100);
                },
                buttons: [{
                    text: 'Inserir',
                    class: 'confirm ui-state-active',
                    click: function(event) {
                        var regex = /^[0-9A-Za-z\-]+$/;
                        var url_Tiny = $('#urlTiny' ).val();
                        var alias_Tiny =  $('#aliasTiny' ).val();
                        if ( url_Tiny != '' && isValidHttpUrl(url_Tiny) && ( ( alias_Tiny != '' && regex.test(alias_Tiny) ) || alias_Tiny == '' ) ) {
                            ajaxTinyUrl(url_Tiny, alias_Tiny, 'insert');
                            resetDialogBoxPro('dialogBoxPro');
                        } else {
                            if ( url_Tiny == '' || !isValidHttpUrl(url_Tiny) ) {
                                alertaBoxPro('Error', 'exclamation-triangle', 'Digite um link v\u00E1lido!');
                            } else if ( alias_Tiny != '' && !regex.test(alias_Tiny) ) {
                                alertaBoxPro('Error', 'exclamation-triangle', 'O nome personalizado deve conter apenas letras, n\u00FAmeros e travess\u00F5es!');
                            } else if ( alias_Tiny.length < 5 ) {
                                alertaBoxPro('Error', 'exclamation-triangle', 'O nome personalizado deve ter mais de 4 (quatro) caracteres')
                            } else {
                                alertaBoxPro('Error', 'exclamation-triangle', 'Digite um link v\u00E1lido!');
                            }
                            resetDialogBoxPro('dialogBoxPro');
                        }
                    }
                }]
            });
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'tiny-url' });
    }
})();
