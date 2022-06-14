var dadosFormularioObj = [];
var fielsFormulario = [];
var maxRowFormulario = 1;

function selectTabSheet(callback = false, sheetSelect = false, msgError = 'Nenhuma p\u00E1gina selecionada!', openDialog = false) {
    var initSheet = (sheetSelect) ? parseInt(sheetSelect) : 0;
    gapi.client.sheets.spreadsheets.get({
        spreadsheetId: spreadsheetIdFormularios_Pro
    }).then((response) => {
        // console.log(sheetSelect, response);
        dadosFormularioObj = [];
        fielsFormulario = [];
        maxRowFormulario = 1;
        localStorageRemovePro('loadFormulariosSheet');
        if ((response.result.sheets.length > 1 && !sheetSelect) || openDialog) {
            var sheetPages = $.map(response.result.sheets, function(v,i){ 
                var seleted = (getOptionsPro('formulariosSheetName') && getOptionsPro('formulariosSheetName').name == v.properties.title) ? 'selected' : '';
                return '<option value="'+i+'" '+seleted+'>'+response.result.properties.title+' / '+v.properties.title+'</option>' 
            }).join('');

            var dataBases = localStorageRestorePro('configBasePro');
            var dbFormulariosSheets = jmespath.search(dataBases, "[?baseTipo=='formularios'] | [?conexaoTipo=='sheets'] | [?API_KEY!='']");
            var baseFormulario = $.map(dbFormulariosSheets, function(v,i){
                var seleted = (getOptionsPro('configBaseSelectedFormPro') && getOptionsPro('configBaseSelectedFormPro') == v.baseName) ? 'selected' : '';
                return '<option value="'+v.baseName+'" '+seleted+'>'+v.baseName+' ('+v.spreadsheetId+')</option>' 
            }).join(' ');
            var configBaseLinkSelected = ( getOptionsPro('configBaseSelectedFormPro') == '' ) ? jmespath.search(dbFormulariosSheets, "[0].spreadsheetId") : jmespath.search(dbFormulariosSheets, "[?baseName=='"+getOptionsPro('configBaseSelectedFormPro')+"'].spreadsheetId | [0]");
            var configBaseLink = ( dataBases != '' && configBaseLinkSelected !== null ) ? configBaseLinkSelected : '';
            var htmlLinkBasedados = ( configBaseLink != '') ? '<a id="linkBaseDados" href="https://docs.google.com/spreadsheets/d/'+configBaseLink+'" target="_blank" onmouseover="return infraTooltipMostrar(\'Abrir Base de Dados (Google Spreadsheets)\');" onmouseout="return infraTooltipOcultar();" style="float: right;"><i class="iconPopup fas fa-database cinzaColor"></i></a>' : '';

            var htmlBox =   msgError+
                            '<div style="margin: 10px 0">'+
                            '   Selecione a planilha e a p\u00E1gina para sincronizar com os formul\u00E1rios do SEI'+
                            '</div>'+
                            '<div>'+
                            '   <select style="width: 85%;" class="selectPro" id="selectSheetForm" onchange="changeSheetForm()">'+baseFormulario+'</select>'+
                            '   '+htmlLinkBasedados+
                            '</div>'+
                            '<div>'+
                            '   <select style="width: 100%;margin-top: 10px !important;" class="selectPro" id="selectTabSheetForm" onchange="changeTabSheetForm()">'+sheetPages+'</select>'+
                            '</div>';
                            confirmaBoxPro(htmlBox, function(){
                                changeTabSheetForm();
                            }, 'Selecionar');

                            
        } else if (response.result.sheets.length == 1 || sheetSelect) {
            console.log(sheetSelect, initSheet, response.result);
            var sheetSelected = {sheet: response.result.properties.title, index: initSheet, name: response.result.sheets[initSheet].properties.title, range: response.result.sheets[initSheet].properties.title+'!A:'+numberToLetter(response.result.sheets[initSheet].properties.gridProperties.columnCount)};
            setOptionsPro('formulariosSheetName',sheetSelected);
            loadFormulariosSheet(callback);
        } else {
            alertaBoxPro('Error', 'exclamation-triangle', 'Nenhuma p\u00E1gina localizada em sua planilha!');
        }
    }, function(error) {
        console.log(error.result.error.message, error);
    });
}
function changeSheetForm(this_) {
    var _this = $(this_);
    setOptionsPro('configBaseSelectedFormPro', _this.val());
    window.location.reload();
}
function changeTabSheetForm() {
    loadingButtonConfirm(true);
    selectTabSheet(function(){
        loadingButtonConfirm(false);
        resetDialogBoxPro('alertBoxPro');
        alertaBoxPro('Sucess', 'check-circle', 'P\u00E1gina da planilha selecionada com sucesso!');
        loadFormulariosSheet();
    }, $('#selectTabSheetForm').val());
}
function loadFormulariosSheet(callback = false) {
    if (!getOptionsPro('formulariosSheetName')) {
        selectTabSheet(callback);
    } else {
        loadSheetIconPro('load');
        var ranges = [ getOptionsPro('formulariosSheetName').range ];
        gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: spreadsheetIdFormularios_Pro,
        //   ranges: []
        ranges: ranges
        }).then((response) => {
            loadSheetIconPro('complete');
            loadFormSheetAction(response.result);
            localStorageStorePro('loadFormulariosSheet', response.result);
            if (typeof callback === 'function') callback();
        }, function(error) {
            loadSheetIconPro('noperfil');
            console.log(error.result.error.message, error);
            var msg_error = JSON.stringify(error.result.error.message, null, 2);
            selectTabSheet(false, false, msg_error);
        });
    }
}
function loadFormSheetAction(result) {
    if (typeof result.valueRanges[0].values !== 'undefined' && result.valueRanges[0].values.length > 0) {
        fielsFormulario = result.valueRanges[0].values[0];
        fielsFormulario = (typeof fielsFormulario !== 'undefined' && fielsFormulario !== null && fielsFormulario.length > 0) 
            ? fielsFormulario.map(function(v){ return removeAcentos(v.toLowerCase()).replace(/ /g, '_') }) 
            : [];
        dadosFormularioObj = jmespath.search(arraySheetToJSON_WithRow(result.valueRanges[0].values), "[?nr_sei]");
        maxRowFormulario = result.valueRanges[0].values.length+1;
        appendIconsFormArvore();
        appendIconsFormHome();
    }
}
function appendIconsFormArvore() {
    if ($('#ifrArvore').length > 0 && typeof dadosFormularioObj !== 'undefined') {
        var ifrArvore = $('#ifrArvore').contents();
            ifrArvore.find('.form-sheet-icon').remove();
        $.each(dadosFormularioObj, function(index, value){
            var elemForm = ifrArvore.find('a[target="ifrVisualizacao"]').filter(function() { return ($(this).text().indexOf('('+value.nr_sei+')') !== -1  || $(this).text().indexOf(' '+value.nr_sei+'') !== -1 ) });
            if (typeof elemForm !== 'undefined' && elemForm.length > 0) {
                var keys = Object.keys(this);
                var tip = keys.map(function(v){ return v+': '+value[v]+'<br> ' }).join('');
                    elemForm.after('<span class="form-sheet-icon action-doc" onmouseover="return infraTooltipMostrar(\'Formul\u00E1rio cadastrado: <br>'+tip+' \');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-clipboard-list" style="color: #03a152;font-size: 11pt;"></i></span>');
            }
        });
    }
}
function appendIconsFormHome() {
    var tblProcessos = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    if (tblProcessos.length > 0 && typeof dadosFormularioObj !== 'undefined') {
        tblProcessos.find('.form-sheet-icon').remove();
        $.each(dadosFormularioObj, function(index, value){
            var elemForm = tblProcessos.find('a[href*="acao=procedimento_trabalhar"]').filter(function() { return ($(this).text().trim() == value.processo) });
            if (typeof elemForm !== 'undefined' && elemForm.length > 0) {
                var keys = Object.keys(this);
                var tip = keys.map(function(v){ return v+': '+value[v]+'<br> ' }).join('');
                    elemForm.closest('tr').find('td').eq(1).append('<span class="form-sheet-icon action-doc" onmouseover="return infraTooltipMostrar(\'Formul\u00E1rio cadastrado: <br>'+tip+' \');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-clipboard-list" style="color: #03a152;font-size: 11pt;"></i></span>');
            }
        });
    }
}
function openFormSheet(ignore = false) {
    var requiredFields = ['nr_sei', 'data_assinatura', 'data_atualizacao', 'processo'];
    var formFields = extractDataFormulario('fields');
    var checkRequiredFields = $.map(requiredFields, function(v, i){ if (fielsFormulario.indexOf(v) === -1) return v });
    var checkFormFields = $.map(formFields, function(v, i){ if (fielsFormulario.indexOf(v) === -1) return v });
    if ((checkRequiredFields.length == 0 && checkFormFields.length == 0) || ignore) {
        var ifrArvoreHtml = $('#ifrVisualizacao').contents().find('#ifrArvoreHtml').contents();
        var nr_sei = ifrArvoreHtml.find('#titulo label').text();
            nr_sei = (typeof nr_sei !== 'undefined' && nr_sei != '' && nr_sei.indexOf('-') !== -1) ? nr_sei.split('-')[nr_sei.split('-').length-1].trim() : false;
        if (nr_sei && dadosFormularioObj.length > 0 && jmespath.search(dadosFormularioObj, "[?nr_sei=='"+nr_sei+"'] | [0]") !== null) {
            var objIndexDados = (typeof dadosFormularioObj === 'undefined' || !dadosFormularioObj || dadosFormularioObj.length == 0) ? -1 : dadosFormularioObj.findIndex((obj => obj.nr_sei == nr_sei));
            updateFormSheetBox(objIndexDados);
        } else {
            newFormSheet();
        }
    } else {
        if (checkRequiredFields.length > 0) {
            createNewColumns(checkRequiredFields);
        } else if (checkFormFields.length > 0) {
            console.log(checkRequiredFields, checkFormFields);
            createNewColumns(checkFormFields);
        }
    }
}
function createNewColumns(listFields) {
    var fieldsHtml = $.map(listFields, function(v){ return '<span style="display: inline-block;background: #e4e4e4; padding: 2px 5px; margin: 5px; border-radius: 5px;">'+(v == 'nr_sei' ? '<i class="fas fa-key laranjaColor"></i> ' : '')+v+'</span>' }).join(' ');
    var sheetName = getOptionsPro('formulariosSheetName');
        confirmaBoxPro(
        'N&atilde;o foi poss&iacute;vel encontrar '+(listFields.length > 1 ? 'as colunas' : 'a coluna')+' '+fieldsHtml+' na planilha <span style="display: inline-block;background: #e4e4e4; padding: 2px 5px; margin: 5px; border-radius: 5px;"><i class="fas fa-table" style="color: #888;"></i> '+sheetName.sheet+' / '+sheetName.name+'</span><br><br> Deseja criar agora?', 
        function(){
            gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: spreadsheetIdFormularios_Pro,
                range: getOptionsPro('formulariosSheetName').name+'!'+numberToLetter(fielsFormulario.length+1)+'1',
                majorDimension: 'ROWS',
                valueInputOption: 'USER_ENTERED',
                values: [listFields]
            }).then(function(response) {
                var result = response.result;
                if ( result.updatedColumns > 0 ) {
                        console.log(result.updatedColumns)
                        selectTabSheet(openFormSheet, getOptionsPro('formulariosSheetName').index);
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
            selectTabSheet(openFormSheet, false, 'Configura\u00E7\u00F5es da planilha');
        }
    );
}
function updateFormSheetBox(objIndexDados) {
    var arrayNewFormSheet = extractDataFormulario('array', true);
    var _ROW = dadosFormularioObj[objIndexDados]['_ROW'];
    var sheetName = getOptionsPro('formulariosSheetName');
    var htmlBox =   '<table id="tableFormSheet" class="tableInfo tableZebra" style="font-size: 10pt;width: 100%;">'+
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
    arrayNewFormSheet.map(function(v, i){
        var objIndexField = (typeof fielsFormulario === 'undefined' || !fielsFormulario || fielsFormulario.length == 0) ? -1 : fielsFormulario.findIndex((obj => obj == v.name));
        var columnSheet = (objIndexField !== -1) ? fielsFormulario[objIndexField] : false;
        var valueSheet = (columnSheet) ? dadosFormularioObj[objIndexDados][columnSheet] : '-';
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
                    selectTabSheet(openFormSheet, false, 'Configura\u00E7\u00F5es da planilha', true);
                }
            },{
                text: 'Atualizar',
                class: 'confirm ui-state-active',
                click: function() { 
                    var updateFormSheet = [];
                    var updateFormularioObj = {}
                    var table = $('#tableFormSheet');
                    $.each(fielsFormulario, function(i, v){
                        var field = table.find('tbody tr[data-index="'+i+'"] td.value').text();
                            field = (typeof field !== 'undefined') ? field.trim() : null;
                            field = (v == 'data_atualizacao') ? moment().format('DD/MM/YYYY HH:mm') : field;
                            updateFormSheet.push([field]);
                            updateFormularioObj[v] = field;
                    });
                    console.log(updateFormSheet, updateFormularioObj);
                    loadingButtonConfirm(true);
                    
                    gapi.client.sheets.spreadsheets.values.update({
                        spreadsheetId: spreadsheetIdFormularios_Pro,
                        range: getOptionsPro('formulariosSheetName').name+'!A'+_ROW,
                        majorDimension: 'COLUMNS',
                        valueInputOption: 'USER_ENTERED',
                        values: updateFormSheet
                    }).then(function(response) {
                        var result = response.result;
                        if ( result.updatedColumns > 0 ) {
                                dadosFormularioObj[objIndexDados] = updateFormularioObj;
                                loadingButtonConfirm(false);
                                resetDialogBoxPro('dialogBoxPro');
                                alertaBoxPro('Sucess', 'check-circle', 'Formul\u00E1rio atualizado com sucesso!');
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
function newFormSheet() {
    var arrayNewFormSheet = extractDataFormulario('array', true);
    var sheetName = getOptionsPro('formulariosSheetName');
    var htmlBox =   '<table id="tableFormSheet" class="tableInfo tableZebra" style="font-size: 10pt;width: 100%;">'+
                    '   <thead>'+
                    '        <tr>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Resultado</th>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;min-width: 140px;"><i class="fas fa-clipboard-list" style="color: #888;margin-right: 10px;"></i> Nome do campo <br>no formul\u00E1rio</th>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;min-width: 140px;"><i class="fas fa-table" style="color: #888;margin-right: 10px;"></i> Nome da coluna <br>na planilha</th>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Valor</th>'+
                    '        </tr>'+
                    '   </thead>'+
                    '   <tbody>';
    arrayNewFormSheet.map(function(v, i){
        var objIndexField = (typeof fielsFormulario === 'undefined' || !fielsFormulario || fielsFormulario.length == 0) ? -1 : fielsFormulario.findIndex((obj => obj == v.name));
        var columnSheet = (objIndexField !== -1) ? fielsFormulario[objIndexField] : false;

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
                    selectTabSheet(openFormSheet, false, 'Configura\u00E7\u00F5es da planilha', true);
                }
            },{
                text: 'Salvar',
                class: 'confirm ui-state-active',
                click: function() { 
                    var saveFormSheet = [];
                    var table = $('#tableFormSheet');
                    $.each(fielsFormulario, function(i, v){
                        var field = table.find('tbody tr[data-index="'+i+'"] td.value').text();
                            field = (typeof field !== 'undefined') ? field.trim() : null;
                            field = (v == 'data_atualizacao') ? moment().format('DD/MM/YYYY HH:mm') : field;
                        saveFormSheet.push(field);
                    });
                    console.log(saveFormSheet);
                    loadingButtonConfirm(true);

                    var range = getOptionsPro('formulariosSheetName').name+'!A'+maxRowFormulario;
                    var values = [ saveFormSheet ];
                    var data = [];
                        data.push({ range: range, values: values });
                    var body = { values: values };

                    gapi.client.sheets.spreadsheets.values.append({
                    spreadsheetId: spreadsheetIdFormularios_Pro,
                    range: range,
                    valueInputOption: "USER_ENTERED",
                    resource: body
                    }).then((response) => {
                        var result = response.result;
                        if ( result.updates.updatedRows > 0 ) {
                            loadingButtonConfirm(false);
                            console.log(result);
                            resetDialogBoxPro('dialogBoxPro');
                            alertaBoxPro('Sucess', 'check-circle', 'Formul\u00E1rio cadastrado com sucesso!');
                            loadFormulariosSheet();
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