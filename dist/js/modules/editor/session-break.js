/**
 * SEI Pro - Editor / Feature: Quebra de secao
 *
 * Insere uma quebra de secao (<p class="sessionBreakPro">) que reinicia os
 * contadores de numeracao (paragrafos, incisos, alineas etc.) antes do
 * paragrafo onde esta o cursor. Totalmente roteado pelo SeiProEditorAdapter
 * (funciona em CK4 e CK5). Ver js/modules/editor/README.md.
 */
(function () {
    'use strict';

    window.getSessionBreak = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        var pElement = SeiProEditorAdapter.getSelectionParagraph(editor);
        if (!pElement) return;
        var htmlSessionPage = '<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>';
        SeiProEditorAdapter.withEdit(editor, function () {
            SeiProEditorAdapter.insertHtmlBefore(editor, pElement, htmlSessionPage);
        });
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'session-break' });
    }
})();
