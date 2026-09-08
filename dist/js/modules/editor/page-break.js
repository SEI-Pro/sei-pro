/**
 * SEI Pro - Editor / Feature: Quebra de pagina
 *
 * Insere uma quebra de pagina (<div class="pageBreakPro">) imediatamente antes
 * do paragrafo onde esta o cursor. Totalmente roteado pelo SeiProEditorAdapter
 * (funciona em CK4 e CK5). Ver js/modules/editor/README.md.
 */
(function () {
    'use strict';

    window.getPageBreak = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        var pElement = SeiProEditorAdapter.getSelectionParagraph(editor);
        if (!pElement) return;
        var htmlBreakPage = '<div class="pageBreakPro" style="page-break-after: always"></div>';
        SeiProEditorAdapter.withEdit(editor, function () {
            SeiProEditorAdapter.insertHtmlBefore(editor, pElement, htmlBreakPage);
        });
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'page-break' });
    }
})();
