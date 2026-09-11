/**
 * SEI Pro - Editor Feature: table-styles
 *
 * Aplica um estilo visual (cor + variacao + largura + cabecalho) a tabela
 * selecionada no editor (CK4/CK5). Entrada: getSyleSelectedTable (botao da
 * toolbar .getTablestylesButtom). Abre um dialogo jQuery UI on-demand (via
 * SeiProEditorAdapter.openDialog) onde o usuario escolhe a variacao de cores,
 * o estilo da tabela, a largura em % e se a primeira linha vira cabecalho;
 * setSyleTable entao reescreve os atributos style de table/tr/td.
 *
 * Portado do monolito sei-pro-editor.js. Toda interacao com o editor passa
 * pelo SeiProEditorAdapter:
 *   - getInstance(this_) resolve a instancia a partir do botao;
 *   - withEdit(ed, fn) envelopa focus + snapshot na aplicacao do estilo;
 *   - detectSyleSelectedTable(ed) (helper compartilhado do monolito) usa
 *     getSelectionElement por baixo para achar a <table> sob o cursor.
 * O antigo CKEDITOR.dialog / $('#dialogBoxPro').dialog(...) foi trocado por
 * SeiProEditorAdapter.openDialog, lendo os inputs por id dentro do $box.
 *
 * Helpers compartilhados (definidos no monolito ou em sei-functions-pro.js,
 * chamados apenas em tempo de clique -- NAO movidos): detectSyleSelectedTable,
 * setBgTableColor, getColorID, getStyleTable, sanitizeHTML, alertaBoxPro.
 */
(function () {
    'use strict';

    // Entrada da feature: botao .getTablestylesButtom da toolbar.
    window.getSyleSelectedTable = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        if (detectSyleSelectedTable(editor).length) {
            openDialogSyleTable(editor);
        } else {
            alertaBoxPro('Error', 'exclamation-triangle', 'Clique na tabela que deseja aplicar o estilo!');
        }
    };

    // Handler do <input data-spro-change="changeColorTable"> dentro do dialogo:
    // troca a classe do preview de estilos para a variacao de cor escolhida.
    window.changeColorTable = function (this_) {
        var id = $(this_).attr('data-colorid');
        $('#addEstiloTabela').attr('class', id);
    };

    // Mantido por compat com initFunctions(); o dialogo agora eh jQuery UI
    // on-demand em openDialogSyleTable().
    window.getDialogSyleTable = function () { /* no-op */ };

    // Monta o corpo do dialogo: seletor de cores, grade de estilos, campo de
    // largura (%) e checkbox de cabecalho. Usa getColorID/getStyleTable
    // (sei-functions-pro.js) para enumerar as opcoes disponiveis.
    window.buildHtmlSyleTable = function () {
        var color = getColorID();
        var lenColor = Object.keys(getColorID()).length;
        var lenStyleTable = Object.keys(getStyleTable(getColorID().color1)).length;
        var htmlEstilo =   '<div style="padding-bottom: 10px;">Selecione a varia\u00E7\u00E3o de cores da tabela:</div>';
            htmlEstilo +=  '<div id="selectColorTabela" class="listaCoresTabela">';
             for (var i = 0; i < lenColor; i++) {
                var id = (i + 1);
                var checked = (i == 0) ? 'checked' : '';
                htmlEstilo +=  '<span><label for="colorStyle' + id + '">' +
                               '<a class="iconSelectColorTable" style="background-color: ' + color['color' + id].light + '"></a>' +
                               '<a class="iconSelectColorTable" style="background-color: ' + color['color' + id].dark + '"></a>' +
                               '</label><br><input type="radio" data-spro-change="changeColorTable" name="colorStyle" data-colorid="color' + id + '" id="colorStyle' + id + '" value="colorStyle' + id + '" ' + checked + '></span>';
             }
            htmlEstilo +=  '</div>';
            htmlEstilo +=  '<div style="padding-bottom: 10px;">Selecione o estilo da tabela:</div>' +
                            '<div id="addEstiloTabela" class="color1">' +
                            '   <div class="listaEstiloTabela">';
             for (var i = 0; i < lenStyleTable; i++) {
                var id = (i + 1);
                var checked = (i == 0) ? 'checked' : '';
                htmlEstilo +=  (i % 7 === 0 && i != 0 && i != (lenStyleTable - 1)) ? '</div><div class="listaEstiloTabela">' : '';
                htmlEstilo +=  '<span><label for="tableStyle' + id + '"><a class="iconSelectStyleTable" style="background-position-y: -' + (id * 43) + 'px"></a></label><br><input type="radio" name="tableStyle" id="tableStyle' + id + '" value="tableStyle' + id + '" ' + checked + '></span>';
             }
             htmlEstilo +=  '</div></div>';
             htmlEstilo +=  '<div style="padding: 10px 0;">Selecione a largura da tabela: ' +
                            '   <input type="number" id="addEstiloTableWidth" style="background: #f5f5f5; padding: 5px; border-radius: 5px; width: 50px; border: 1px solid #ccc;" max="100" step="5" min="5"> %' +
                            '</div>';
             htmlEstilo +=  '<div style="padding: 10px 0;">' +
                            '   <input type="checkbox" id="addEstiloTableHeader" checked> <label for="addEstiloTableHeader">Determinar a primeira linha como cabe\u00E7alho da tabela</label>' +
                            '</div>';
        return htmlEstilo;
    };

    // Abre o dialogo de estilo de tabela (jQuery UI via adapter). Substitui o
    // antigo $('#dialogBoxPro').dialog(...) -- compativel com CK4 e CK5.
    window.openDialogSyleTable = function (editor) {
        var htmlBox = sanitizeHTML('<div class="dialogBoxDiv" style="font-size:11pt;line-height:14pt;color:#616161;">' + buildHtmlSyleTable() + '</div>');

        SeiProEditorAdapter.openDialog({
            id: 'dialogSyleTablePro',
            title: 'Inserir estilo \u00E0 tabela',
            html: htmlBox,
            width: 760,
            height: 540,
            onOpen: function ($box) {
                // Pre-preenche a largura com o % atual da tabela em relacao ao pai.
                var elementTable = detectSyleSelectedTable(editor);
                var percentInput = 80;
                if (elementTable.length) {
                    var percent = Math.round(100 * parseFloat(elementTable.css('width')) / parseFloat(elementTable.parent().css('width')));
                    percentInput = (typeof percent === 'number' && !isNaN(percent)) ? percent : 80;
                    percentInput = Math.min(100, Math.max(5, percentInput));
                }
                $box.find('#addEstiloTableWidth').val(percentInput);
            },
            buttons: [{
                text: 'Aplicar',
                primary: true,
                click: function ($box) {
                    var valueT = $box.find('#addEstiloTabela').find('input[name="tableStyle"]:checked').val();
                    var valueC = $box.find('#selectColorTabela').find('input[name="colorStyle"]:checked').attr('data-colorid');
                    var valueW = $box.find('#addEstiloTableWidth').val();
                    if (valueT && valueC && valueW) {
                        setSyleTable([valueT, valueC, valueW], editor);
                        try { $box.dialog('close'); } catch (e) {}
                    }
                }
            }]
        });
    };

    // Mantido por compat com fluxos antigos: getSyleTable() apenas envelopa um
    // setSyleTable() placeholder (sem valor nao aplica nada).
    window.getSyleTable = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        SeiProEditorAdapter.withEdit(editor, function () { setSyleTable(undefined, editor); });
    };

    // Aplica o estilo escolhido a tabela selecionada. value = [tableID, colorID,
    // widthID]. Sem value, eh apenas placeholder do fluxo antigo (no-op).
    window.setSyleTable = function (value, editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;
        if (!value) return; // setSyleTable() sem valor eh apenas placeholder do fluxo antigo
        SeiProEditorAdapter.withEdit(editor, function () {
            var tableID = value[0];
            var colorID = value[1];
            var widthID = value[2];
            var color = getColorID()[colorID];
            var arrayStyle = getStyleTable(color, widthID)[tableID];

            var elementTable = detectSyleSelectedTable(editor);
            if (!elementTable.length) return;
            elementTable.attr('style', arrayStyle.table);
            elementTable.find('tr').each(function (index_tr) {
                var styleTr = (index_tr == 0) ? arrayStyle.tr_head : arrayStyle.tr;
                styleTr = (index_tr != 0 && $.isArray(arrayStyle.tr) && (index_tr % 2 === 0)) ? arrayStyle.tr[1] : styleTr;
                styleTr = (index_tr != 0 && $.isArray(arrayStyle.tr) && (index_tr % 2 !== 0)) ? arrayStyle.tr[0] : styleTr;
                var styleTd = (index_tr == 0) ? arrayStyle.td_head : arrayStyle.td;
                var classTdP = (index_tr == 0) ? arrayStyle.td_head_p : arrayStyle.td_p;
                $(this).attr('style', styleTr);
                $(this).find('td').each(function (index_td) {
                    styleTd = (index_td == 0 && index_tr != 0) ? arrayStyle.td_first : arrayStyle.td;
                    styleTd = (index_tr == 0) ? arrayStyle.td_head : styleTd;
                    $(this).attr('style', styleTd);
                    if ($(this).find('p').length) {
                        $(this).find('p').attr('class', classTdP);
                    } else {
                        $(this).html('<p class="' + classTdP + '">' + $(this).html() + '</p>');
                    }
                });
            });
            elementTable.find('span[style*="background-color"],tr[style*="background-color"],td[style*="background-color"]').each(function () {
                setBgTableColor(this);
            });
            if ($('#addEstiloTableHeader').is(':checked')) {
                $('<thead></thead>').prependTo(elementTable).append(elementTable.find('tr:first'));
            }
        });
    };

    // Registra a feature (leve: id). Idempotente.
    SeiProEditorAdapter.registerFeature({ id: 'table-styles' });
})();
