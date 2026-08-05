/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';
import { getColorID, getStyleTable } from '../../../../shared/table-styles.js';

export function hideQuickTable() {
    q('.seipro-editor-quick-table').each(function(){
        q(this).html('').hide();
    })
    q('.getQuickTableButtom').addClass('cke_button_off').removeClass('cke_button_on');
}
export function quickTableOver(this_) {
    var rowThis = parseInt(q(this_).attr('data-row'));
    var colThis = parseInt(q(this_).attr('data-col'));
    var table = q(this_).closest('table');
        table.find('td').removeClass('seipro-editor-quick-table-hover');

    if ( rowThis >= 3 && parseInt(table.find('tr:last td:first').attr('data-row')) > rowThis+1 ) {
        table.find('tr:last').remove();
        table.attr('data-row', (parseInt(table.attr('data-row'))-1));
    }
    if ( colThis >= 3 && parseInt(table.find('tr:last td:last').attr('data-col')) > colThis+1 ) {
        table.find('tr :last-child').remove();
        table.attr('data-col', (parseInt(table.attr('data-col'))-1));
    }
    table.find('td').each(function(){
        var rowTd = parseInt(q(this).attr('data-row'));
        var colTd = parseInt(q(this).attr('data-col'));
        if ( rowTd <= rowThis && colTd <= colThis ) {
            q(this).addClass('seipro-editor-quick-table-hover');
        }
    });
    q(this_).closest('.seipro-editor-quick-table').find('.seipro-editor-quick-table-info').html('Tabela '+(rowThis+1)+'x'+(colThis+1));

    if ( rowThis == parseInt(table.attr('data-row')) && rowThis < 49 ) {
        var tableAppend = q(this_).closest('table');
        var rowLast = tableAppend.find('tr:last');
        var rowNew = rowLast.clone().appendTo(tableAppend);
            rowNew.find('td').each(function(index){
                q(this).attr('data-row', (rowThis+1)).attr('data-col', index).removeClass('seipro-editor-quick-table-hover');
            });
            tableAppend.attr('data-row', (rowThis+1));
    }
    if ( colThis == parseInt(table.attr('data-col')) && colThis < 49 ) {
        var tableAppend = q(this_).closest('table');
            tableAppend.find('tr :last-child').each(function(){
                var colNew = q(this).clone().attr('data-col', (colThis+1)).removeClass('seipro-editor-quick-table-hover');
                var colNew_ = q(this).parent().append(colNew);
            });
            tableAppend.attr('data-col', (colThis+1));
    }
}
export function getQuickTable(this_) {
    var rowDefault = 5;
    var colDefault = 5;
    const quickTableContainer = q(this_).closest('.cke_toolgroup').find('.seipro-editor-quick-table');

    if ( q(this_).hasClass('cke_button_off') ) {
    var htmlTable = '<div class="seipro-editor-quick-table-info">Inserir Tabela</div>';
        htmlTable += '<table data-row="'+(rowDefault-1)+'" data-col="'+(colDefault-1)+'">';
        for (var i = 0; i < rowDefault; i++) {
            htmlTable += '<tr>';
            for (var j = 0; j < colDefault; j++) {
                htmlTable += '<td data-seipro-hover="quickTableOver" data-seipro-leave="quickTableOver" data-row="'+i+'" data-col="'+j+'" data-seipro-action="quickTableClick"></td>';
            }
            htmlTable += '</tr>';
        }
        htmlTable += '</table>';
        quickTableContainer.html(htmlTable).show();
        q(this_).removeClass('cke_button_off').addClass('cke_button_on');
    } else {
        api.hideQuickTable();
        q(this_).addClass('cke_button_off').removeClass('cke_button_on');
    }
}

export function quickTableClick(this_) {
    api.setParamEditor(this_);
    var row = q(this_).attr('data-row');
    var col = q(this_).attr('data-col');
    var idFirstTD = 'quickTablePos_'+randomString(8);
    var htmlTable = '<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';
        htmlTable += '  <tbody>';
        for (var i = 0; i <= row; i++) {
            htmlTable += '      <tr>';
            for (var j = 0; j <= col; j++) {
                var firstTD = ( i == 0 && j == 0 ) ? 'id="'+idFirstTD+'" ' : '';
                htmlTable += '          <td><p class="Tabela_Texto_Alinhado_Esquerda" '+firstTD+'><br></p></td>';
            }
            htmlTable += '      </tr>';
        }
        htmlTable += '  </tbody>';
        htmlTable += '</table>';
    var select = state.oEditor.getSelection().getStartElement();
    var pElement = q(select.$).closest('p');
    if ( pElement.length ) {
        state.oEditor.focus();
        state.oEditor.fire('saveSnapshot');
        state.iframeEditor.find(pElement).after(htmlTable);
        api.hideQuickTable();
        q('#cke_'+state.idEditor).find('.getTablestylesButtom').removeClass('cke_button_disabled');

        // Move o cursor para a primeira celula da tabela
        var sel = state.oEditor.getSelection();
        var element_ = sel.getStartElement();
        var element = state.oEditor.document.getById(idFirstTD);
        var ranges = state.oEditor.getSelection().getRanges();
            ranges[0].setStart(element.getFirst(), 0);
            ranges[0].setEnd(element.getFirst(), 0);
            sel.selectRanges([ranges[0]]);
            state.iframeEditor.find('#'+idFirstTD).attr('id', '');
            oEditor.fire('saveSnapshot');
    }
}

//// Insere estilo clean a tabela selecionada do documento
export function detectSyleSelectedTable() {
    var select = state.oEditor.getSelection().getStartElement();
    var tableElement = q(select.$).closest('table');
    return tableElement;
}
export function activeIconsSelectedText() {
    if ( api.detectSyleSelectedTable().length ) {
        q('#cke_'+state.idEditor).find('.getTablestylesButtom').removeClass('cke_button_disabled');
    } else {
        q('#cke_'+state.idEditor).find('.getTablestylesButtom').addClass('cke_button_disabled');
    }
    if (api.hasSelection(state.oEditor)) {
        q('#cke_'+state.idEditor).find('.getFontSizeUpButtom').removeClass('cke_button_disabled');
        q('#cke_'+state.idEditor).find('.getFontSizeDownButtom').removeClass('cke_button_disabled');
        q('#cke_'+state.idEditor).find('.getCapLetterButtom').removeClass('cke_button_disabled');
    } else {
        q('#cke_'+state.idEditor).find('.getFontSizeUpButtom').addClass('cke_button_disabled');
        q('#cke_'+state.idEditor).find('.getFontSizeDownButtom').addClass('cke_button_disabled');
        q('#cke_'+state.idEditor).find('.getCapLetterButtom').addClass('cke_button_disabled');
    }
}
export function getSyleSelectedTable(this_) {
    api.setParamEditor(this_);
    if ( api.detectSyleSelectedTable().length ) {
            state.oEditor.openDialog('TabelaSEI');
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Clique na tabela que deseja aplicar o estilo!');
    }
}
export function changeColorTable(this_) {
	var id = q(this_).attr('data-colorid');
		q('#addEstiloTabela').attr('class', id);
}
export function getDialogSyleTable() {
	var color = getColorID();
	var lenColor = Object.keys(getColorID()).length;
	var lenStyleTable = Object.keys(getStyleTable(getColorID().color1)).length;
    var htmlEstilo =   '<div style="padding-bottom: 10px;">Selecione a varia\u00E7\u00E3o de cores da tabela:</div>';
        htmlEstilo +=  '<div id="selectColorTabela" class="listaCoresTabela">';
         for (var i = 0; i < lenColor; i++) {
            var id = (i+1);
			var checked = ( i == 0 ) ? 'checked' : '';
            htmlEstilo +=  	'<span><label for="colorStyle'+id+'">'+
							'<a class="iconSelectColorTable" style="background-color: '+color['color'+id].light+'"></a>'+
							'<a class="iconSelectColorTable" style="background-color: '+color['color'+id].dark+'"></a>'+
							'</label><br><input type="radio" data-seipro-change="changeColorTable" name="colorStyle" data-colorid="color'+id+'" id="colorStyle'+id+'" value="colorStyle'+id+'" '+checked+'></span>';
         }
        htmlEstilo +=  '</div>';
		htmlEstilo +=  '<div style="padding-bottom: 10px;">Selecione o estilo da tabela:</div>'+
                        '<div id="addEstiloTabela" class="color1">'+
                        '   <div class="listaEstiloTabela">';
         for (var i = 0; i < lenStyleTable; i++) {
            var id = (i+1);
			var checked = ( i == 0 ) ? 'checked' : '';
                htmlEstilo +=  ( i % 7 === 0 && i != 0 && i != (lenStyleTable-1) ) ? '</div><div class="listaEstiloTabela">' : '';
                htmlEstilo +=  '<span><label for="tableStyle'+id+'"><a class="iconSelectStyleTable" style="background-position-y: -'+(id*43)+'px"></a></label><br><input type="radio" name="tableStyle" id="tableStyle'+id+'" value="tableStyle'+id+'" '+checked+'></span>';
         }
         htmlEstilo +=  '</div></div>';
         htmlEstilo +=  '<div style="padding: 10px 0;">Selecione a largura da tabela: '+
                        '   <input type="number" id="addEstiloTableWidth" style="background: #f5f5f5; padding: 5px; border-radius: 5px; width: 50px; border: 1px solid #ccc;" max="100" step="5" min="5"> %'+
                        '</div>';
         htmlEstilo +=  '<div style="padding: 10px 0;">'+
                        '   <input type="checkbox" id="addEstiloTableHeader" checked> <label for="addEstiloTableHeader">Determinar a primeira linha como cabe\u00E7alho da tabela</label>'+
                        '</div>';

    CKEDITOR.dialog.add( 'TabelaSEI', function(editor)
      {
         return {
            title : 'Inserir estilo \u00E0 tabela',
            minWidth : 700,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var valueT = q('#addEstiloTabela').find('input[name="tableStyle"]:checked').val();
                var valueC = q('#selectColorTabela').find('input[name="colorStyle"]:checked').attr('data-colorid');
                var valueW = q('#addEstiloTableWidth').val();
                if ( valueT != '' && valueC != '' && valueW != '' ) {
                    api.setSyleTable([valueT, valueC, valueW]);
                    event.data.hide = true;
                }
            },
            onShow : function() {
                var elementTable = api.detectSyleSelectedTable();
                // var percent = elementTable[0].style.width;
                var percent = Math.round(100 * parseFloat(elementTable.css('width')) / parseFloat(elementTable.parent().css('width')));
                var percentInput = (typeof percent != 'undefined') ? parseInt(percent) : 80;
                    percentInput = (percentInput > 100) ? 100 : percentInput;
                    percentInput = (percentInput < 5 ) ? 5 : percentInput;
                console.log(elementTable[0].style.width, percentInput);
                q('#addEstiloTableWidth').val(percentInput);
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Estilo da tabela',
                  elements :
                  [
                    {
             			type: 'html',
             			html: htmlEstilo
             		}
                  ]
               }
            ]
         };
      } );
}
export function getSyleTable(this_) {
    api.setParamEditor(this_);
        state.oEditor.focus();
        state.oEditor.fire('saveSnapshot');
        api.setSyleTable();
        state.oEditor.fire('saveSnapshot');
}
export function setSyleTable(value) {

	var tableID = value[0];
	var colorID = value[1];
	var widthID = value[2];
	var color = getColorID()[colorID];
	var arrayStyle = getStyleTable(color, widthID)[tableID];

    var elementTable = api.detectSyleSelectedTable();
    elementTable.attr('style', arrayStyle.table);
    elementTable.find('tr').each(function(index_tr){
        var styleTr = ( index_tr == 0 ) ? arrayStyle.tr_head : arrayStyle.tr;
			styleTr = ( index_tr != 0 && q.isArray(arrayStyle.tr) && ( index_tr % 2 === 0 ) ) ? arrayStyle.tr[1] : styleTr;
			styleTr = ( index_tr != 0 && q.isArray(arrayStyle.tr) && ( index_tr % 2 !== 0 ) ) ? arrayStyle.tr[0] : styleTr;
		var styleTd = ( index_tr == 0 ) ? arrayStyle.td_head : arrayStyle.td;
        var classTdP = ( index_tr == 0 ) ? arrayStyle.td_head_p : arrayStyle.td_p;
			q(this).attr('style', styleTr);
			q(this).find('td').each(function(index_td){
				styleTd = ( index_td == 0 && index_tr != 0 ) ? arrayStyle.td_first : arrayStyle.td;
				styleTd = ( index_tr == 0 ) ? arrayStyle.td_head : styleTd;
				q(this).attr('style', styleTd);
				if ( q(this).find('p').length ) {
					q(this).find('p').attr('class', classTdP);
				} else {
					q(this).html('<p class="'+classTdP+'">'+q(this).html()+'</p>');
				}
			});
    });
    elementTable.find('span[style*="background-color"],tr[style*="background-color"],td[style*="background-color"]').each(function(){
        api.setBgTableColor(this);
    });
    if (q('#addEstiloTableHeader').is(':checked')) {
        q('<thead></thead>').prependTo(elementTable).append(elementTable.find('tr:first'));
    }

}

//// INSERE LINK DE NORMAS
api.hideQuickTable = hideQuickTable;
api.quickTableOver = quickTableOver;
api.getQuickTable = getQuickTable;
api.quickTableClick = quickTableClick;
api.detectSyleSelectedTable = detectSyleSelectedTable;
api.activeIconsSelectedText = activeIconsSelectedText;
api.getSyleSelectedTable = getSyleSelectedTable;
api.changeColorTable = changeColorTable;
api.getDialogSyleTable = getDialogSyleTable;
api.getSyleTable = getSyleTable;
api.setSyleTable = setSyleTable;
