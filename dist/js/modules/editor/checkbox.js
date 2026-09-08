/**
 * SEI Pro - Editor / Feature: Caixa de selecao (checkbox)
 *
 * Insere um icone de checkbox (U+2610) ancorado no ponto do cursor.
 *
 * Modulo de referencia da arquitetura modular (ver js/modules/editor/README.md):
 *  - Define o handler global com o MESMO nome usado pelo monolito em
 *    setClickButtons: $('.getInsertCheckboxButtom').on('click', ... getInsertCheckboxButtom(this)).
 *  - Toda a operacao no editor passa pelo SeiProEditorAdapter (CK4 e CK5).
 *  - Carregado ANTES do monolito (adapter -> modulos -> editor), portanto NAO
 *    chama helpers do monolito em tempo de avaliacao; randomString vem de
 *    sei-functions-pro.js (global, disponivel no clique).
 *
 * Observacao: o toggle de marcar/desmarcar (setActionCheckbox) ainda vive no
 * monolito, acoplado ao subsistema de eventos do corpo (setOnBodyActs/iframe).
 * Sera portado junto com esse subsistema.
 */
(function () {
    'use strict';

    window.getInsertCheckboxButtom = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        SeiProEditorAdapter.withEdit(editor, function () {
            SeiProEditorAdapter.insertHtml(editor,
                '<span class="ancoraSei checkboxSEI" data-id="' + randomString(16) + '" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>'
            );
        });
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'checkbox' });
    }
})();
