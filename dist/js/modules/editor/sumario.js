/**
 * SEI Pro - Editor / Feature: Inserir sumario/indice do documento
 *
 * Le os paragrafos do corpo, monta um sumario (lista de links com ancoras
 * "bookmark-...") a partir dos estilos de titulo escolhidos pelo usuario e
 * insere no ponto do cursor. Tambem prepende uma ancora <a name=...> em cada
 * titulo referenciado para que os links do sumario naveguem ate ele.
 *
 * Modulo da arquitetura modular (ver js/modules/editor/README.md):
 *  - Define os handlers globais com os MESMOS nomes usados pelo monolito em
 *    setClickButtons: $('.getSumarioButtom').on('click', ... getSumarioDocumento(this)).
 *  - Toda operacao no editor passa pelo SeiProEditorAdapter (CK4 e CK5).
 *  - Dialogo via SeiProEditorAdapter.openDialog (jQuery UI on-demand) -- nada de
 *    CKEDITOR.dialog (o getDialogSumarioDocumento_ legado, que usava
 *    CKEDITOR.dialog.add, foi portado para delegar ao dialogo unificado).
 *  - Carregado ANTES do monolito; helpers compartilhados (uniqPro, randomString,
 *    initChosenReplace, sanitizeHTML, alertaBoxPro) ficam no monolito /
 *    sei-functions-pro.js e so sao chamados em tempo de clique.
 */
(function () {
    'use strict';

    /**
     * Entry point. Abre o dialogo de selecao de estilos de titulo.
     * No SEI 5 (CK5) o sumario depende de prepender <a name="bookmark-...">
     * em paragrafos existentes do editable. Isso nao pode ser feito dentro de
     * model.change() (erro cannot-change-view-tree) e uma porta completa requer
     * schema extensions para ancoras. Por ora neutralizamos.
     */
    window.getSumarioDocumento = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        if (SeiProEditorAdapter.version === 5) {
            alertaBoxPro('Info', 'info-circle', 'Inserir sum\u00E1rio em migra\u00E7\u00E3o para o SEI 5.');
            return;
        }
        getDialogSumarioDocumento(editor);
    };

    /**
     * Coleta os estilos (primeira classe de cada <p>) presentes no corpo e
     * monta as <option> do select. Retorna string de <option>s.
     */
    window.getListStylesDocumento = function (editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return '';
        var arrayStylesDoc = [];
        var paragraphs = SeiProEditorAdapter.findInBody(editor, 'p');
        if (paragraphs && paragraphs.length) {
            paragraphs.each(function () {
                var cls = $(this).attr('class');
                if (typeof cls === 'undefined' || cls === null) return;
                var style = (cls.indexOf(' ') !== -1) ? cls.split(' ')[0] : cls;
                arrayStylesDoc.push(style);
            });
        }
        arrayStylesDoc = uniqPro(arrayStylesDoc);
        var optionsStyles = $.map(arrayStylesDoc, function (value) {
            if (value) return '<option value=".' + value + '">' + value + '</option>';
        }).join('');
        return optionsStyles;
    };

    /**
     * Helper privado: repovoa um <select> por id com pares [label, value].
     * Mantido por compatibilidade com o fluxo legado (getDialogSumarioDocumento_).
     */
    window.updateSelectDialog = function (element, array) {
        if ($('select#' + element).length) {
            $('select#' + element).html('');
            $.each(array, function (index, value) {
                $('select#' + element).append('<option value="' + value[1] + '">' + value[0] + '</option>');
            });
        }
    };

    /**
     * Dialogo de selecao dos estilos de Titulo 1/2/3. Portado de
     * $('#dialogBoxPro').dialog(...) para SeiProEditorAdapter.openDialog (jQuery
     * UI on-demand, agnostico de CK4/CK5).
     */
    window.getDialogSumarioDocumento = function (editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        var optionsStyles = getListStylesDocumento(editor);
        var htmlBox = sanitizeHTML(
            '<div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">'
          +     '<table style="font-size: 10pt;width: 100%;" class="seiProForm">'
          +         '<tr>'
          +             '<td style="vertical-align: bottom; text-align: left;" class="label">'
          +                 '<label for="listStyle1"><i class="iconPopup iconSwitch fas fa-h1 cinzaColor"></i>Estilo do T\u00EDtulo 1 (obrigat\u00F3rio):</label>'
          +             '</td>'
          +             '<td>'
          +                 '<select id="listStyle1" style="width: 350px;">' + optionsStyles + '</select>'
          +             '</td>'
          +         '</tr>'
          +         '<tr>'
          +             '<td style="vertical-align: bottom; text-align: left;" class="label">'
          +                 '<label for="listStyle2"><i class="iconPopup iconSwitch fas fa-h2 cinzaColor"></i>Estilo do T\u00EDtulo 2:</label>'
          +             '</td>'
          +             '<td>'
          +                 '<select id="listStyle2" style="width: 350px;">' + optionsStyles + '</select>'
          +             '</td>'
          +         '</tr>'
          +         '<tr>'
          +             '<td style="vertical-align: bottom; text-align: left;" class="label">'
          +                 '<label for="listStyle3"><i class="iconPopup iconSwitch fas fa-h3 cinzaColor"></i>Estilo do T\u00EDtulo 3:</label>'
          +             '</td>'
          +             '<td>'
          +                 '<select id="listStyle3" style="width: 350px;">' + optionsStyles + '</select>'
          +             '</td>'
          +         '</tr>'
          +     '</table>'
          + '</div>'
        );

        SeiProEditorAdapter.openDialog({
            id: 'dialogBoxPro',
            title: 'Inserir sum\u00E1rio',
            html: htmlBox,
            width: 650,
            height: 250,
            onOpen: function ($box) {
                // initChosenReplace resolve o .ui-dialog a partir de um node interno.
                var node = $box.find('select')[0] || $box[0];
                initChosenReplace('box_init', node, true);
            },
            buttons: [{
                text: 'Inserir',
                primary: true,
                click: function ($box) {
                    var arrayStylesUser = [];
                    var id_style1 = $box.find('#listStyle1').val();
                    var id_style2 = $box.find('#listStyle2').val();
                    var id_style3 = $box.find('#listStyle3').val();
                    if (id_style1 != '') { arrayStylesUser.push(id_style1); }
                    if (id_style2 != '') { arrayStylesUser.push(id_style2); }
                    if (id_style3 != '') { arrayStylesUser.push(id_style3); }
                    if (arrayStylesUser.length) {
                        insertSumarioDocumento(arrayStylesUser, editor);
                        try { $box.dialog('close'); } catch (e) {}
                    }
                }
            }]
        });
    };

    /**
     * Variante legada (SEI 3.1/4) que usava CKEDITOR.dialog.add. Portada para
     * delegar ao dialogo unificado -- mantemos o nome global porque o monolito
     * podia referencia-lo, mas sem nenhum acoplamento a CKEDITOR.
     */
    window.getDialogSumarioDocumento_ = function () {
        getDialogSumarioDocumento();
    };

    /**
     * Monta e insere o sumario. Para cada paragrafo cujo estilo esta entre os
     * escolhidos, gera um link no sumario e prepende uma ancora no proprio
     * paragrafo, depois insere o bloco do sumario no ponto do cursor.
     */
    window.insertSumarioDocumento = function (arrayStylesUser, editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;
        var selectStyles = arrayStylesUser.join(', ');
        var htmlSumario = '<p class="Texto_Alinhado_Esquerda"><strong>SUM\u00C1RIO</strong></p>';
        SeiProEditorAdapter.withEdit(editor, function () {
            SeiProEditorAdapter.findInBody(editor, selectStyles).each(function () {
                var randRef = randomString(16);
                htmlSumario += '<p class="Texto_Alinhado_Esquerda"><a href="#bookmark-' + randRef + '">' + $(this).text().trim() + '</a></p>';
                $(this).find('a.seipro-bookmark').remove();
                $(this).prepend('<a class="seipro-bookmark" name="bookmark-' + randRef + '"></a>');
            });
            // Insere o sumario imediatamente apos o paragrafo do cursor (fallback:
            // insere na posicao atual se nao houver paragrafo foco).
            SeiProEditorAdapter.insertHtml(editor, htmlSumario);
        });
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'sumario' });
    }
})();
