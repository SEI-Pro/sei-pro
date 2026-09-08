/**
 * SEI Pro - Editor / Feature: Primeira letra maiuscula
 *
 * Capitaliza a primeira letra de cada palavra do texto selecionado (exceto
 * artigos e preposicoes, conforme capitalizeFirstLetter).
 *
 * PORTADO de CK4 para CK5: a versao antiga usava setParamEditor + oEditor
 * (CKEDITOR.instances) + oEditor.getSelection().getSelectedText(), que quebram
 * no CK5. Agora roteia tudo pelo SeiProEditorAdapter (getSelectedText/insertHtml),
 * funcionando em CK4 e CK5. capitalizeFirstLetter/alertaBoxPro sao globais
 * (sei-functions-pro.js), chamados no clique. Ver README.md.
 */
(function () {
    'use strict';

    window.convertFirstLetter = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        var selectTxt = SeiProEditorAdapter.getSelectedText(editor);
        if (selectTxt && selectTxt !== '') {
            SeiProEditorAdapter.insertHtml(editor, capitalizeFirstLetter(selectTxt));
        } else {
            alertaBoxPro('Error', 'exclamation-triangle', 'Selecione um texto para converter');
        }
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'cap-letter' });
    }
})();
