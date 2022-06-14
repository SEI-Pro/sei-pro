var dadosSyncProcessoObj = [];
var fielsSyncProcesso = [];
var maxRowSyncProcesso = 1;

function selectTabSheetSyncProc(callback = false, sheetSelect = false, msgError = 'Nenhuma p\u00E1gina selecionada!', openDialog = false) {
    var initSheet = (sheetSelect) ? parseInt(sheetSelect) : 0;
    gapi.client.sheets.spreadsheets.get({
        spreadsheetId: spreadsheetIdSyncProcessos_Pro
    }).then((response) => {
        // console.log(sheetSelect, response);
        dadosSyncProcessoObj = [];
        fielsSyncProcesso = [];
        maxRowSyncProcesso = 1;
        localStorageRemovePro('loadSyncProcessosSheet');
        if ((response.result.sheets.length > 1 && !sheetSelect) || openDialog) {
            var sheetPages = $.map(response.result.sheets, function(v,i){ 
                var seleted = (getOptionsPro('syncProcessosSheetName') && getOptionsPro('syncProcessosSheetName').name == v.properties.title) ? 'selected' : '';
                return '<option value="'+i+'" '+seleted+'>'+response.result.properties.title+' / '+v.properties.title+'</option>' 
            }).join('');

            var dataBases = localStorageRestorePro('configBasePro');
            var dbSyncProcessosSheets = jmespath.search(dataBases, "[?baseTipo=='processos'] | [?conexaoTipo=='sheets'] | [?API_KEY!='']");
            var baseSyncProcesso = $.map(dbSyncProcessosSheets, function(v,i){
                var seleted = (getOptionsPro('configBaseSelectedProcessosPro') && getOptionsPro('configBaseSelectedProcessosPro') == v.baseName) ? 'selected' : '';
                return '<option value="'+v.baseName+'" '+seleted+'>'+v.baseName+' ('+v.spreadsheetId+')</option>' 
            }).join(' ');
            var configBaseLinkSelected = ( getOptionsPro('configBaseSelectedProcessosPro') == '' ) ? jmespath.search(dbSyncProcessosSheets, "[0].spreadsheetId") : jmespath.search(dbSyncProcessosSheets, "[?baseName=='"+getOptionsPro('configBaseSelectedProcessosPro')+"'].spreadsheetId | [0]");
            var configBaseLink = ( dataBases != '' && configBaseLinkSelected !== null ) ? configBaseLinkSelected : '';
            var htmlLinkBasedados = ( configBaseLink != '') ? '<a id="linkBaseDados" href="https://docs.google.com/spreadsheets/d/'+configBaseLink+'" target="_blank" onmouseover="return infraTooltipMostrar(\'Abrir Base de Dados (Google Spreadsheets)\');" onmouseout="return infraTooltipOcultar();" style="float: right;"><i class="iconPopup fas fa-database cinzaColor"></i></a>' : '';

            var htmlBox =   msgError+
                            '<div style="margin: 10px 0">'+
                            '   Selecione a planilha e a p\u00E1gina para sincronizar com os processos do SEI'+
                            '</div>'+
                            '<div>'+
                            '   <select style="width: 85%;" class="selectPro" id="selectSheetProc" onchange="changeSheetSyncProc()">'+baseSyncProcesso+'</select>'+
                            '   '+htmlLinkBasedados+
                            '</div>'+
                            '<div>'+
                            '   <select style="width: 100%;margin-top: 10px !important;" class="selectPro" id="selectTabSheetSyncProc" onchange="changeTabSheetSyncProc()">'+sheetPages+'</select>'+
                            '</div>';
                            confirmaBoxPro(htmlBox, function(){
                                changeTabSheetSyncProc();
                            }, 'Selecionar');

                            
        } else if (response.result.sheets.length == 1 || sheetSelect) {
            console.log(sheetSelect, initSheet, response.result);
            var sheetSelected = {sheet: response.result.properties.title, index: initSheet, name: response.result.sheets[initSheet].properties.title, range: response.result.sheets[initSheet].properties.title+'!A:'+numberToLetter(response.result.sheets[initSheet].properties.gridProperties.columnCount)};
            setOptionsPro('syncProcessosSheetName',sheetSelected);
            loadSyncProcessosSheet(callback);
        } else {
            alertaBoxPro('Error', 'exclamation-triangle', 'Nenhuma p\u00E1gina localizada em sua planilha!');
        }
    }, function(error) {
        console.log(error.result.error.message, error);
    });
}
function changeSheetSyncProc(this_) {
    var _this = $(this_);
    setOptionsPro('configBaseSelectedProcessosPro', _this.val());
    window.location.reload();
}
function changeTabSheetSyncProc() {
    loadingButtonConfirm(true);
    selectTabSheetSyncProc(function(){
        loadingButtonConfirm(false);
        resetDialogBoxPro('alertBoxPro');
        alertaBoxPro('Sucess', 'check-circle', 'P\u00E1gina da planilha selecionada com sucesso!');
        loadSyncProcessosSheet();
    }, $('#selectTabSheetSyncProc').val());
}
function loadSyncProcessosSheet(callback = false) {
    if (!getOptionsPro('syncProcessosSheetName')) {
        selectTabSheetSyncProc(callback);
    } else {
        loadSheetIconPro('load');
        var ranges = [ getOptionsPro('syncProcessosSheetName').range ];
        gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: spreadsheetIdSyncProcessos_Pro,
        //   ranges: []
        ranges: ranges
        }).then((response) => {
            loadSheetIconPro('complete');
            loadSheetActionSyncProc(response.result);
            localStorageStorePro('loadSyncProcessosSheet', response.result);
            if (typeof callback === 'function') callback();
        }, function(error) {
            loadSheetIconPro('noperfil');
            console.log(error.result.error.message, error);
            var msg_error = JSON.stringify(error.result.error.message, null, 2);
            selectTabSheetSyncProc(false, false, msg_error);
        });
    }
}
function loadSheetActionSyncProc(result) {
    if (typeof result.valueRanges[0].values !== 'undefined' && result.valueRanges[0].values.length > 0) {
        fielsSyncProcesso = result.valueRanges[0].values[0];
        fielsSyncProcesso = (typeof fielsSyncProcesso !== 'undefined' && fielsSyncProcesso !== null && fielsSyncProcesso.length > 0) 
            ? fielsSyncProcesso.map(function(v){ return removeAcentos(v.toLowerCase()).replace(/ /g, '_') }) 
            : [];
        dadosSyncProcessoObj = jmespath.search(arraySheetToJSON_WithRow(result.valueRanges[0].values), "[?ID]");
        maxRowSyncProcesso = result.valueRanges[0].values.length+1;
        console.log(arraySheetToJSON_WithRow(result.valueRanges[0].values), dadosSyncProcessoObj, maxRowSyncProcesso);
    }
}
function openProcSheet(ignore = false) {
    var requiredFields = [
        'ID', 
        'Protocolo', 
        'Link_Permanente',
        'Atribuicao',
        'Etiqueta',
        'Etiqueta_Descricao',
        'Anotacao',
        'Anotacao_Responsavel',
        'Ponto_Controle',
        'Especificacao',
        'Tipo',
        'Data_Autuacao',
        'Data_Autuacao_Descricao',
        'Data_Recebimento',
        'Data_Recebimento_Descricao',
        'Data_Envio',
        'Data_Envio_Descricao',
        'Unidade_Envio',
        'Documento_Incluido',
        'Data_Sincronizacao'
    ];
    // var procFields = extractDataSyncProcesso('fields');
    var checkRequiredFields = $.map(requiredFields, function(v, i){ if (fielsSyncProcesso.indexOf(v) === -1) return v });
    // var checkProcFields = $.map(procFields, function(v, i){ if (fielsSyncProcesso.indexOf(v) === -1) return v });
    /*
    if ((checkRequiredFields.length == 0 && checkProcFields.length == 0) || ignore) {
        var ifrArvoreHtml = $('#ifrVisualizacao').contents().find('#ifrArvoreHtml').contents();
        var nr_sei = ifrArvoreHtml.find('#titulo label').text();
            nr_sei = (typeof nr_sei !== 'undefined' && nr_sei != '' && nr_sei.indexOf('-') !== -1) ? nr_sei.split('-')[nr_sei.split('-').length-1].trim() : false;
        if (nr_sei && dadosSyncProcessoObj.length > 0 && jmespath.search(dadosSyncProcessoObj, "[?nr_sei=='"+nr_sei+"'] | [0]") !== null) {
            var objIndexDados = (typeof dadosSyncProcessoObj === 'undefined' || !dadosSyncProcessoObj || dadosSyncProcessoObj.length == 0) ? -1 : dadosSyncProcessoObj.findIndex((obj => obj.nr_sei == nr_sei));
            updateProcSheetBox(objIndexDados);
        } else {
            newProcSheet();
        }
    } else {
        */
        if (checkRequiredFields.length > 0) {
            createNewColumnsSyncProc(checkRequiredFields);
        // } else if (checkProcFields.length > 0) {
            // console.log(checkRequiredFields, checkProcFields);
            // createNewColumnsSyncProc(checkProcFields);
        }
    // }
}
function createNewColumnsSyncProc(listFields) {
    var fieldsHtml = $.map(listFields, function(v){ return '<span style="display: inline-block;background: #e4e4e4; padding: 2px 5px; margin: 5px; border-radius: 5px;">'+(v == 'nr_sei' ? '<i class="fas fa-key laranjaColor"></i> ' : '')+v+'</span>' }).join(' ');
    var sheetName = getOptionsPro('syncProcessosSheetName');
        confirmaBoxPro(
        'N&atilde;o foi poss&iacute;vel encontrar '+(listFields.length > 1 ? 'as colunas' : 'a coluna')+' '+fieldsHtml+' na planilha <span style="display: inline-block;background: #e4e4e4; padding: 2px 5px; margin: 5px; border-radius: 5px;"><i class="fas fa-table" style="color: #888;"></i> '+sheetName.sheet+' / '+sheetName.name+'</span><br><br> Deseja criar agora?', 
        function(){
            gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: spreadsheetIdSyncProcessos_Pro,
                range: getOptionsPro('syncProcessosSheetName').name+'!'+numberToLetter(fielsSyncProcesso.length+1)+'1',
                majorDimension: 'ROWS',
                valueInputOption: 'USER_ENTERED',
                values: [listFields]
            }).then(function(response) {
                var result = response.result;
                if ( result.updatedColumns > 0 ) {
                        console.log(result.updatedColumns)
                        selectTabSheetSyncProc(openProcSheet, getOptionsPro('syncProcessosSheetName').index);
                } else {
                    loadingButtonConfirm(false);
                    alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao alterar os dados!');
                }
            }, function(err) {
                loadingButtonConfirm(false);
                console.error("Execute error", err); 
                alertaBoxPro('Error', 'exclamation-triangle', err.result.error.message );
            });
        }, 
        'Criar '+(listFields.length > 1 ? 'colunas' : 'coluna'), 
        function(){ 
            resetDialogBoxPro('confirmaBoxPro');
            selectTabSheetSyncProc(openProcSheet, false, 'Configura\u00E7\u00F5es da planilha');
        }
    );
}
/*
function updateProcSheetBox(objIndexDados) {
    var arrayNewProcSheet = extractDataSyncProcesso('array', true);
    var _ROW = dadosSyncProcessoObj[objIndexDados]['_ROW'];
    var sheetName = getOptionsPro('syncProcessosSheetName');
    var htmlBox =   '<table id="tableProcSheet" class="tableInfo tableZebra" style="font-size: 10pt;width: 100%;">'+
                    '   <thead>'+
                    '        <tr>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Resultado</th>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;min-width: 140px;"><i class="fas fa-clipboard-list" style="color: #888;margin-right: 10px;"></i> Nome do campo <br>no formul\u00E1rio</th>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;min-width: 140px;"><i class="fas fa-table" style="color: #888;margin-right: 10px;"></i> Nome da coluna <br>na planilha</th>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;min-width: 140px;"><i class="fas fa-clipboard-list" style="color: #888;margin-right: 10px;"></i> Valor do campo <br>no formul\u00E1rio</th>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;min-width: 140px;"><i class="fas fa-table" style="color: #888;margin-right: 10px;"></i> Valor da coluna <br>na planilha</th>'+
                    '        </tr>'+
                    '   </thead>'+
                    '   <tbody>';
    arrayNewProcSheet.map(function(v, i){
        var objIndexField = (typeof fielsSyncProcesso === 'undefined' || !fielsSyncProcesso || fielsSyncProcesso.length == 0) ? -1 : fielsSyncProcesso.findIndex((obj => obj == v.name));
        var columnSheet = (objIndexField !== -1) ? fielsSyncProcesso[objIndexField] : false;
        var valueSheet = (columnSheet) ? dadosSyncProcessoObj[objIndexDados][columnSheet] : '-';
        var checkValues = (valueSheet.toString().toLowerCase() == v.value.toString().toLowerCase()) ? true : false;

        htmlBox +=  '       <tr data-index="'+objIndexField+'">'+
                    '          <td style="text-align:center;"><span>'+(checkValues ? '<i class="fas fa-equals verdeColor"></i>' : '<i class="fas fa-not-equal vermelhoColor"></i>')+'</span></td>'+
                    '          <td>'+
                    (columnSheet == 'nr_sei' ? '<i class="fas fa-key laranjaColor"></i>' : '')+
                    '             <span style="background: #e4e4e4; padding: 2px 5px; border-radius: 5px;">'+v.name+'</span>'+
                    '          </td>'+
                    '          <td><span style="background: #e4e4e4; padding: 2px 5px; border-radius: 5px;">'+(columnSheet ? columnSheet : '-')+'</span></td>'+
                    '          <td class="value"><span style="font-weight: bold;color: '+(checkValues ? '#000' : '#bb3636')+';background: '+(checkValues ? '#e4e4e4' : '#fff1f0')+'; padding: 2px 5px; border-radius: 5px;">'+v.value+'</span></td>'+
                    '          <td><span style="font-weight: bold;color: '+(checkValues ? '#000' : '#bb3636')+';background: '+(checkValues ? '#e4e4e4' : '#fff1f0')+'; padding: 2px 5px; border-radius: 5px;">'+valueSheet+'</span></td>'+
                    '       </tr>';
                    '   </tbody>';
    });
    htmlBox += '</table>';
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv" style="overflow-x: scroll;"> '+htmlBox+'</div>')
        .dialog({
            title: 'Atualizar formul\u00E1rio ('+sheetName.sheet+' / '+sheetName.name+')',
        	width: 800,
        	buttons: [{
                text: 'Configura\u00E7\u00F5es',
                click: function() { 
                    resetDialogBoxPro('dialogBoxPro');
                    selectTabSheetSyncProc(openProcSheet, false, 'Configura\u00E7\u00F5es da planilha', true);
                }
            },{
                text: 'Atualizar',
                class: 'confirm ui-state-active',
                click: function() { 
                    var updateProcSheet = [];
                    var updateSyncProcessoObj = {}
                    var table = $('#tableProcSheet');
                    $.each(fielsSyncProcesso, function(i, v){
                        var field = table.find('tbody tr[data-index="'+i+'"] td.value').text();
                            field = (typeof field !== 'undefined') ? field.trim() : null;
                            field = (v == 'data_atualizacao') ? moment().format('DD/MM/YYYY HH:mm') : field;
                            updateProcSheet.push([field]);
                            updateSyncProcessoObj[v] = field;
                    });
                    console.log(updateProcSheet, updateSyncProcessoObj);
                    loadingButtonConfirm(true);
                    
                    gapi.client.sheets.spreadsheets.values.update({
                        spreadsheetId: spreadsheetIdSyncProcessos_Pro,
                        range: getOptionsPro('syncProcessosSheetName').name+'!A'+_ROW,
                        majorDimension: 'COLUMNS',
                        valueInputOption: 'USER_ENTERED',
                        values: updateProcSheet
                    }).then(function(response) {
                        var result = response.result;
                        if ( result.updatedColumns > 0 ) {
                                dadosSyncProcessoObj[objIndexDados] = updateSyncProcessoObj;
                                loadingButtonConfirm(false);
                                resetDialogBoxPro('dialogBoxPro');
                                alertaBoxPro('Sucess', 'check-circle', 'Processo atualizado com sucesso!');
                        } else {
                            loadingButtonConfirm(false);
                            alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao alterar os dados!');
                        }
                    }, function(err) {
                        loadingButtonConfirm(false);
                        console.error("Execute error", err); 
                        alertaBoxPro('Error', 'exclamation-triangle', err.result.error.message );
                    });

                }
            }]
    });
}
function newProcSheet() {
    var arrayNewProcSheet = extractDataSyncProcesso('array', true);
    var sheetName = getOptionsPro('syncProcessosSheetName');
    var htmlBox =   '<table id="tableProcSheet" class="tableInfo tableZebra" style="font-size: 10pt;width: 100%;">'+
                    '   <thead>'+
                    '        <tr>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Resultado</th>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;min-width: 140px;"><i class="fas fa-clipboard-list" style="color: #888;margin-right: 10px;"></i> Nome do campo <br>no formul\u00E1rio</th>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;min-width: 140px;"><i class="fas fa-table" style="color: #888;margin-right: 10px;"></i> Nome da coluna <br>na planilha</th>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Valor</th>'+
                    '        </tr>'+
                    '   </thead>'+
                    '   <tbody>';
    arrayNewProcSheet.map(function(v, i){
        var objIndexField = (typeof fielsSyncProcesso === 'undefined' || !fielsSyncProcesso || fielsSyncProcesso.length == 0) ? -1 : fielsSyncProcesso.findIndex((obj => obj == v.name));
        var columnSheet = (objIndexField !== -1) ? fielsSyncProcesso[objIndexField] : false;

        htmlBox +=  '       <tr data-index="'+objIndexField+'">'+
                    '          <td style="text-align:center;"><span>'+(columnSheet ? '<i class="fas fa-check-circle verdeColor"></i>' : '<i class="fas fa-times-circle vermelhoColor"></i>')+'</span></td>'+
                    '          <td>'+
                    (columnSheet == 'nr_sei' ? '<i class="fas fa-key laranjaColor"></i>' : '')+
                    '             <span style="background: #e4e4e4; padding: 2px 5px; border-radius: 5px;">'+v.name+'</span>'+
                    '          </td>'+
                    '          <td><span style="background: #e4e4e4; padding: 2px 5px; border-radius: 5px;">'+(columnSheet ? columnSheet : '-')+'</span></td>'+
                    '          <td class="value"><span style="font-weight: bold;background: #e4e4e4; padding: 2px 5px; border-radius: 5px;">'+v.value+'</span></td>'+
                    '       </tr>';
                    '   </tbody>';
    });
    htmlBox += '</table>';
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv" style="overflow-x: scroll;"> '+htmlBox+'</div>')
        .dialog({
            title: 'Salvar formul\u00E1rio ('+sheetName.sheet+' / '+sheetName.name+')',
        	width: 600,
        	buttons: [{
                text: 'Configura\u00E7\u00F5es',
                click: function() { 
                    resetDialogBoxPro('dialogBoxPro');
                    selectTabSheetSyncProc(openProcSheet, false, 'Configura\u00E7\u00F5es da planilha', true);
                }
            },{
                text: 'Salvar',
                class: 'confirm ui-state-active',
                click: function() { 
                    var saveProcSheet = [];
                    var table = $('#tableProcSheet');
                    $.each(fielsSyncProcesso, function(i, v){
                        var field = table.find('tbody tr[data-index="'+i+'"] td.value').text();
                            field = (typeof field !== 'undefined') ? field.trim() : null;
                            field = (v == 'data_atualizacao') ? moment().format('DD/MM/YYYY HH:mm') : field;
                        saveProcSheet.push(field);
                    });
                    console.log(saveProcSheet);
                    loadingButtonConfirm(true);

                    var range = getOptionsPro('syncProcessosSheetName').name+'!A'+maxRowSyncProcesso;
                    var values = [ saveProcSheet ];
                    var data = [];
                        data.push({ range: range, values: values });
                    var body = { values: values };

                    gapi.client.sheets.spreadsheets.values.append({
                    spreadsheetId: spreadsheetIdSyncProcessos_Pro,
                    range: range,
                    valueInputOption: "USER_ENTERED",
                    resource: body
                    }).then((response) => {
                        var result = response.result;
                        if ( result.updates.updatedRows > 0 ) {
                            loadingButtonConfirm(false);
                            console.log(result);
                            resetDialogBoxPro('dialogBoxPro');
                            alertaBoxPro('Sucess', 'check-circle', 'Processo cadastrado com sucesso!');
                            loadSyncProcessosSheet();
                        } else {
                            loadingButtonConfirm(false);
                            alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao adicionar os dados!');
                        }
                    }, function(err) { 
                        loadingButtonConfirm(false);
                        console.error("Execute error", err); 
                        alertaBoxPro('Error', 'exclamation-triangle', err.result.error.message );
                    });
                }
            }]
    });
}
*/