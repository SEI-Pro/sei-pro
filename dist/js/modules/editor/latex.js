/**
 * SEI Pro - Editor Feature: latex
 *
 * Inserir equacao no formato LaTeX/Mathematics no documento do editor (CK4/CK5).
 * Entrada: openDialogLatex (botao .getLatexButtom da toolbar). Abre um dialogo
 * jQuery UI (via dialogBoxPro/resetDialogBoxPro) com um textarea para a equacao
 * e um preview renderizado por https://latex.codecogs.com (convertido para
 * base64 antes de inserir). Ao confirmar, insere a imagem no editor.
 *
 * Portado do monolito sei-pro-editor.js. Toda interacao com o editor passa pelo
 * SeiProEditorAdapter:
 *   - openDialogLatex / updatePreviewLatex ja estavam limpos (jQuery UI +
 *     adapter + selecao nativa do DOM) -> extraidos verbatim.
 *   - getDialogLatex era o antigo CKEDITOR.dialog.add (CK4 cru, com 'oEditor'
 *     global e this.getContentElement). Esse dialogo foi substituido pelo
 *     dialogo jQuery UI de openDialogLatex; como nao ha referencia a
 *     getDialogLatex em lugar nenhum, mantemos o nome como no-op (compat com
 *     initFunctions antigos) e removemos toda a dependencia CK4.
 *
 * Helpers compartilhados (definidos no monolito / sei-functions-pro.js, usados
 * tambem por outras features; chamados apenas em tempo de clique/abertura):
 *   setParamEditor, sanitizeHTML, resetDialogBoxPro, initChosenReplace,
 *   resizeHeigthDialogBox, getBase64Image. Variavel global compartilhada:
 *   dialogBoxPro (declarada no monolito).
 */
(function () {
    'use strict';

    // Atualiza o preview da equacao a partir do conteudo do textarea #MathText.
    // Renderiza via servico codecogs e dispara getBase64Image (helper compart.)
    // para embutir a imagem como data URI antes de uma eventual insercao.
    window.updatePreviewLatex = function () {
        resizeHeigthDialogBox(dialogBoxPro);
        var mathTextValue = $('#MathText').val();
        if (mathTextValue != '') {
            $('#latexPreview').html('<img src="https://latex.codecogs.com/png.latex?' + encodeURI(mathTextValue) + '">');
            getBase64Image($('#latexPreview').find('img'));
            setTimeout(function () {
                resizeHeigthDialogBox(dialogBoxPro);
            }, 500);
        } else {
            $('#latexPreview').html('');
        }
        resizeHeigthDialogBox(dialogBoxPro);
    };

    // Entrada do botao da toolbar (.getLatexButtom -> openDialogLatex(this)).
    // Abre o dialogo jQuery UI de insercao de equacao LaTeX.
    window.openDialogLatex = function (this_) {
        setParamEditor(this_);
        var htmlBox = sanitizeHTML(
            '<div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">'
                + '<table style="font-size: 10pt;width: 100%;" class="seiProForm">'
                    + '<tr>'
                        + '<td style="vertical-align: bottom; text-align: left;" class="label">'
                            + '<label for="MathText"><i class="iconPopup iconSwitch fas fa-sigma cinzaColor"></i>Digite a equa\u00E7\u00E3o no formato LaTeX/Mathematics:</label>'
                        + '</td>'
                    + '</tr>'
                    + '<tr>'
                        + '<td>'
                            + '<textarea id="MathText" style="width: 100%;height: 100px;"></textarea>'
                        + '</td>'
                    + '</tr>'
                    + '<tr>'
                        + '<td style="vertical-align: bottom; text-align: left;" class="label">'
                            + '<div id="latexPreview" style="text-align: center;margin: 20px;"></div>'
                            + '<label style="font-style: italic;color: #616161;">'
                                + '<i class="fas fa-info-circle" style="color: #007fff;"></i> Consulte o <a href="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX" target="_blank" class="linkDialog" style="font-style: italic;">Guia de edi\u00E7\u00E3o/F\u00F3rmulas TeX</a> para utilizar a liguagem LaTeX. <br>Se preferir, utilize um <a href="https://editor.codecogs.com/" target="_blank" class="linkDialog" style="font-style: italic;">editor visual de equa\u00E7\u00F5es LaTeX</a>.'
                            + '</label>'
                        + '</td>'
                    + '</tr>'
                + '</table>'
            + '</div>'
        );

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html(htmlBox)
            .dialog({
                title: 'Inserir Equa\u00E7\u00E3o',
                width: 600,
                height: 350,
                open: function () {
                    initChosenReplace('box_multiple', this, true);
                    // Texto selecionado: prefere selecao nativa do DOM (CK4 e CK5).
                    var _nsel = window.getSelection && window.getSelection();
                    var selectTxt = _nsel ? String(_nsel).trim() : '';
                    var mathText = $('#MathText');
                    setTimeout(function () {
                        $('#latexPreview').html('');
                        if (mathText != '') {
                            mathText.val(selectTxt);
                            updatePreviewLatex();
                        }
                        mathText.unbind('change').on('input change', function () {
                            updatePreviewLatex();
                        });
                    }, 100);
                },
                buttons: [{
                    text: 'Inserir',
                    'class': 'confirm ui-state-active',
                    click: function (event) {
                        var mathText = $('#MathText').val();
                        var imgMath = $('#latexPreview').find('img');
                        if (mathText != '' && imgMath.length) {
                            var ed = SeiProEditorAdapter.getInstance();
                            if (ed) {
                                SeiProEditorAdapter.withEdit(ed, function () {
                                    SeiProEditorAdapter.insertHtml(ed, $('#latexPreview').html());
                                });
                            }
                            resetDialogBoxPro('dialogBoxPro');
                        }
                    }
                }]
            });
    };

    // Compat: o antigo getDialogLatex registrava um CKEDITOR.dialog (CK4) que nao
    // existe no CK5 e nao era referenciado em lugar nenhum. O dialogo agora eh
    // jQuery UI on-demand em openDialogLatex(). Mantemos o nome como no-op.
    window.getDialogLatex = function () { /* no-op: dialogo on-demand em openDialogLatex() */ };

    // Registra a feature (leve: id). Idempotente.
    SeiProEditorAdapter.registerFeature({ id: 'latex' });
})();
