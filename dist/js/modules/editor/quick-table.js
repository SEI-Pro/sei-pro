/**
 * SEI Pro - Editor / Feature: Tabela Rapida (quick-table)
 *
 * Seletor visual de tabela na toolbar. O botao .getQuickTableButtom abre um
 * mini grid (.divQuickTable) onde o usuario passa o mouse para dimensionar a
 * tabela (linhas x colunas, ate 50x50) e clica para inserir.
 *
 * Entradas (mesmos nomes globais que o monolito referencia por nome):
 *   - getQuickTable(this_)   -> clique do botao da toolbar (toggle do grid)
 *   - quickTableOver(this_)  -> mouseover/mouseout em cada celula do grid
 *   - quickTableClick(this_) -> clique numa celula do grid (insere a tabela)
 *   - hideQuickTable()       -> fecha/limpa o grid
 *
 * PORTADO: getQuickTable/quickTableOver/hideQuickTable eram DOM/jQuery puro
 * (extraidos quase verbatim); quickTableClick usava CK4 cru (oEditor,
 * iframeEditor, getSelection().getRanges, setParamEditor) -> reescrito para
 * rotear tudo pelo SeiProEditorAdapter (getInstance/withEdit/
 * getSelectionParagraph/insertHtmlBefore). A insercao DEPOIS do paragrafo do
 * cursor foi obtida inserindo ANTES do irmao seguinte; sem irmao, anexa no
 * corpo (appendToBody).
 *
 * Cuidado da toolbar: no CK4 o grid (.divQuickTable) e o botao vivem num
 * .cke_toolgroup; no CK5 a toolbar e .ck-toolbar__items e nao ha .cke_toolgroup.
 * findQuickTableGrid(this_) resolve o container de forma agnostica de versao
 * (closest .cke_toolgroup -> closest .ck-toolbar__items -> prevAll), pois o
 * div .divQuickTable e o irmao imediatamente anterior ao botao em ambos.
 *
 * Globais que permanecem no monolito / shared (chamados em tempo de clique):
 *   randomString (sei-functions-pro.js / sei-legis.js). Ver README.md.
 */
(function () {
    'use strict';

    // Resolve o container do mini grid (.divQuickTable) de forma agnostica de
    // versao a partir do botao clicado. CK4: dentro de um .cke_toolgroup.
    // CK5: dentro de .ck-toolbar__items (sem .cke_toolgroup). Fallback final:
    // o .divQuickTable e o irmao imediatamente anterior ao botao (eles sao
    // inseridos juntos via htmlButtonTable), entao prevAll resolve.
    function findQuickTableGrid(this_) {
        var $btn = $(this_);
        var $scope = $btn.closest('.cke_toolgroup');
        if ($scope.length) {
            var $g = $scope.find('.divQuickTable');
            if ($g.length) return $g;
        }
        $scope = $btn.closest('.ck-toolbar__items');
        if ($scope.length) {
            var $g2 = $scope.find('.divQuickTable');
            if ($g2.length) return $g2;
        }
        // Fallback: irmao anterior direto.
        var $prev = $btn.prevAll('.divQuickTable').first();
        if ($prev.length) return $prev;
        return $('.divQuickTable').first();
    }

    // Habilita o botao "Adicionar estilo a tabela" apos inserir uma tabela.
    // CK4 tinha o wrapper #cke_<idEditor>; no CK5 nao existe, entao buscamos o
    // botao a partir da toolbar do botao clicado (com fallback global).
    function enableTableStylesButton(this_) {
        var $scope = $(this_).closest('.ck-toolbar__items, .cke_toolbox, .cke');
        var $tgt = $scope.length ? $scope.find('.getTablestylesButtom') : $();
        if (!$tgt.length) $tgt = $('.getTablestylesButtom');
        $tgt.removeClass('cke_button_disabled');
    }

    window.hideQuickTable = function () {
        $('.divQuickTable').each(function () {
            $(this).html('').hide();
        });
        $('.getQuickTableButtom').addClass('cke_button_off').removeClass('cke_button_on');
    };

    window.quickTableOver = function (this_) {
        var rowThis = parseInt($(this_).attr('data-row'));
        var colThis = parseInt($(this_).attr('data-col'));
        var table = $(this_).closest('table');
        table.find('td').removeClass('td_hover');

        if (rowThis >= 3 && parseInt(table.find('tr:last td:first').attr('data-row')) > rowThis + 1) {
            table.find('tr:last').remove();
            table.attr('data-row', (parseInt(table.attr('data-row')) - 1));
        }
        if (colThis >= 3 && parseInt(table.find('tr:last td:last').attr('data-col')) > colThis + 1) {
            table.find('tr :last-child').remove();
            table.attr('data-col', (parseInt(table.attr('data-col')) - 1));
        }
        table.find('td').each(function () {
            var rowTd = parseInt($(this).attr('data-row'));
            var colTd = parseInt($(this).attr('data-col'));
            if (rowTd <= rowThis && colTd <= colThis) {
                $(this).addClass('td_hover');
            }
        });
        $(this_).closest('.divQuickTable').find('.quickTableInfo').html('Tabela ' + (rowThis + 1) + 'x' + (colThis + 1));

        if (rowThis == parseInt(table.attr('data-row')) && rowThis < 49) {
            var tableAppend = $(this_).closest('table');
            var rowLast = tableAppend.find('tr:last');
            var rowNew = rowLast.clone().appendTo(tableAppend);
            rowNew.find('td').each(function (index) {
                $(this).attr('data-row', (rowThis + 1)).attr('data-col', index).removeClass('td_hover');
            });
            tableAppend.attr('data-row', (rowThis + 1));
        }
        if (colThis == parseInt(table.attr('data-col')) && colThis < 49) {
            var tableAppend2 = $(this_).closest('table');
            tableAppend2.find('tr :last-child').each(function () {
                var colNew = $(this).clone().attr('data-col', (colThis + 1)).removeClass('td_hover');
                $(this).parent().append(colNew);
            });
            tableAppend2.attr('data-col', (colThis + 1));
        }
    };

    window.getQuickTable = function (this_) {
        var rowDefault = 5;
        var colDefault = 5;
        var divQuickTable = findQuickTableGrid(this_);

        if ($(this_).hasClass('cke_button_off')) {
            var htmlTable = '<div class="quickTableInfo">Inserir Tabela</div>';
            htmlTable += '<table data-row="' + (rowDefault - 1) + '" data-col="' + (colDefault - 1) + '">';
            for (var i = 0; i < rowDefault; i++) {
                htmlTable += '<tr>';
                for (var j = 0; j < colDefault; j++) {
                    htmlTable += '<td onmouseout="quickTableOver(this);" onmouseover="quickTableOver(this);" data-row="' + i + '" data-col="' + j + '" onclick="quickTableClick(this)"></td>';
                }
                htmlTable += '</tr>';
            }
            htmlTable += '</table>';
            divQuickTable.html(htmlTable).show();
            $(this_).removeClass('cke_button_off').addClass('cke_button_on');
        } else {
            hideQuickTable();
            $(this_).addClass('cke_button_off').removeClass('cke_button_on');
        }
    };

    window.quickTableClick = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) { hideQuickTable(); return; }

        var row = $(this_).attr('data-row');
        var col = $(this_).attr('data-col');
        var idFirstTD = 'quickTablePos_' + randomString(8);

        var htmlTable = '<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';
        htmlTable += '  <tbody>';
        for (var i = 0; i <= row; i++) {
            htmlTable += '      <tr>';
            for (var j = 0; j <= col; j++) {
                var firstTD = (i == 0 && j == 0) ? 'id="' + idFirstTD + '" ' : '';
                htmlTable += '          <td><p class="Tabela_Texto_Alinhado_Esquerda" ' + firstTD + '><br></p></td>';
            }
            htmlTable += '      </tr>';
        }
        htmlTable += '  </tbody>';
        htmlTable += '</table>';

        // Paragrafo onde o cursor esta -- inserimos a tabela DEPOIS dele.
        var pElement = SeiProEditorAdapter.getSelectionParagraph(editor);

        SeiProEditorAdapter.withEdit(editor, function () {
            if (pElement) {
                // "Depois do paragrafo" = "antes do proximo irmao". Se nao houver
                // irmao seguinte, anexa no corpo do documento.
                var nextEl = pElement.nextElementSibling;
                if (nextEl) {
                    SeiProEditorAdapter.insertHtmlBefore(editor, nextEl, htmlTable);
                } else {
                    SeiProEditorAdapter.appendToBody(editor, htmlTable);
                }
            } else {
                // Sem paragrafo de referencia: insere na posicao da selecao.
                SeiProEditorAdapter.insertHtml(editor, htmlTable);
            }
        });

        hideQuickTable();
        enableTableStylesButton(this_);

        // Move o cursor para a primeira celula da tabela recem inserida e
        // remove o id temporario. Localiza a celula no corpo via adapter
        // (findInBody) e usa a Selection API nativa (funciona em CK4 iframe e
        // CK5 inline, ambos expostos pelo adapter como DOM real).
        try {
            var $first = SeiProEditorAdapter.findInBody(editor, '#' + idFirstTD);
            if ($first && $first.length) {
                var firstEl = $first[0];
                var target = firstEl.firstChild || firstEl;
                var sel = (firstEl.ownerDocument && firstEl.ownerDocument.defaultView)
                    ? firstEl.ownerDocument.defaultView.getSelection()
                    : window.getSelection();
                if (sel && target) {
                    var range = firstEl.ownerDocument.createRange();
                    range.setStart(target, 0);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                $first.attr('id', '');
            }
        } catch (e) { /* posicionamento do cursor e best-effort */ }
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'quick-table' });
    }
})();
