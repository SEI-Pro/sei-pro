// Monitorados — Contagem de prazo (caixa de configuração de datas)
// Slice da view de Processos Monitorados (sei-pro-monitorados.js). Script global,
// carregado em sequência pelo manifest. Editor da contagem de tempo/prazo do processo monitorado.
function openBoxConfigDates(this_) {
    var _this = $(this_);
    var index = parseInt(_this.closest('tr').data('index'));
    var id_procedimento = parseInt(_this.closest('tr').data('id_procedimento'));
    var storeMonitorados = getStoreMonitoradoPro();
    var monitoradoIndex = findMonitoradoIndex(storeMonitorados, id_procedimento);
    var dateInput = _this.closest('.info_dates_monitorado_txt').find('.monitoradoDatesPro').val().trim();
    var date_ = (dateInput == '') ? moment().format('YYYY-MM-DD') : dateInput;
    var configdate = getOptionsConfigDate(monitoradoIndex);
        configdate.date = (dateInput == '') ? configdate.date : date_;
    
    var stateCountDown = (configdate.countdown) ? 'checked' : '';
    var stateCountDownIcon = (configdate.countdown) ? 'azulColor' : 'cinzaColor';
    var stateCountDownDiv = (configdate.countdown) ? '' : 'display:none';
    var stateSetDates = (configdate.setdate) ? 'checked' : '';
    var stateSetDatesIcon = (configdate.setdate) ? 'azulColor' : 'cinzaColor';
    var stateSetDatesDiv = (configdate.setdate) ? '' : 'display:none';
    var stateSelectDoc = (configdate.selectdoc) ? 'checked' : '';
    var stateSelectDocIcon = (configdate.selectdoc) ? 'azulColor' : 'cinzaColor';
    var stateSelectDocDiv = (configdate.selectdoc) ? '' : 'display:none';
    var stateCountDays = (configdate.countdays) ? 'checked' : '';
    var stateCountDaysIcon = (configdate.countdays) ? 'azulColor' : 'cinzaColor';
    var stateCountDaysDiv = (configdate.countdays) ? '' : 'display:none';
    var stateWorkday = (configdate.workday) ? 'checked' : '';
    var stateWorkdayIcon = (configdate.workday) ? 'azulColor' : 'cinzaColor';
    var stateWorkdayDiv = (configdate.workday) ? '' : 'display:none';
    var stateDueDate = (configdate.duedate) ? 'checked' : '';
    var stateDueDateIcon = (configdate.duedate) ? 'azulColor' : 'cinzaColor';
    var stateDueDateDiv = (configdate.duedate) ? '' : 'display:none';
    var stateDueSetDate = (configdate.duesetdate) ? 'checked' : '';
    var stateDueSetDateIcon = (configdate.duesetdate) ? 'azulColor' : 'cinzaColor';
    var stateDueSetDateDiv = (configdate.duesetdate) ? '' : 'display:none';
    var stateNewDoc = (configdate.newdoc) ? 'checked' : '';
    var stateNewDocIcon = (configdate.newdoc) ? 'azulColor' : 'cinzaColor';
    var stateNewDocDiv = (configdate.newdoc) ? '' : 'display:none';
    var stateAdvancedDiv = (configdate.advanced) ? '' : 'display:none';
    var stateAdvancedIcon = (configdate.advanced) ? 'newLink_active' : '';
    var htmlNewDocList = appendArrayNewdoclist(configdate.newdoclist);
    var stateDuecounter_corrido = (configdate.duecounter == 'corrido') ? 'selected' : '';
    var stateDuecounter_util = (configdate.duecounter == 'util') ? 'selected' : '';
    var stateDuemode_depois = (configdate.duemode == 'depois') ? 'selected' : '';
    var stateDuemode_antes = (configdate.duemode == 'antes') ? 'selected' : '';
    var duenumber = (configdate.duenumber > 0 ) ? configdate.duenumber : Math.abs(configdate.duenumber);
    var arrayItemMonitorado = storeMonitorados['monitorados'][monitoradoIndex];
    var monitoradoDocList = arrayItemMonitorado['documentos'];

    var htmlBox =   '<div id="configDatesBox">'+
                    '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                    '      <tr style="height: 40px;">'+
                    '          <td colspan="2">Contar o tempo decorrido do processo a partir:</td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td><i class="iconPopup iconSwitch fas fa-file-signature '+stateSelectDocIcon+'"></i> '+
                    '               Da data de assinatura de um documento'+
                    '          </td>'+
                    '          <td>'+
                    '              <div class="onoffswitch" style="float: right;">'+
                    '                  <input type="checkbox" onchange="configDatesSwitchChange(this); getDadosSelectDoc(this, \''+id_procedimento+'\')" name="onoffswitch" class="onoffswitch-checkbox" id="configDatesBox_selectdoc" data-type="selectdoc" tabindex="0" '+stateSelectDoc+'>'+
                    '                  <label class="onoff-switch-label" for="configDatesBox_selectdoc"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px; '+stateSelectDocDiv+'" class="configDates_selectdoc">'+
                    '          <td colspan="2">'+
                    '               <select onchange="configDatesSetUpdate(\'update\')" id="configDatesBox_listdocs">';
        if (typeof monitoradoDocList !== 'undefined' && monitoradoDocList !== null && monitoradoDocList.length > 0) {
            $.each(monitoradoDocList, function(i,value){
                var selected = (configdate.listdocs && configdate.listdocs == value.id_protocolo) ? 'selected' : '';
                htmlBox +=   (value.data_assinatura == '') ? '' : '                   <option data-sign="'+value.data_assinatura+'" data-id-protocolo="'+value.id_documento+'" value="'+value.id_documento+'" '+selected+'>'+value.nome_documento+' (SEI n\u00BA '+value.nr_sei+') [assinado em '+value.data_assinatura+']</option>';
            });
        }
        htmlBox +=  '               </select>'+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr style="height: 10px; display:none" class="configDates_selectdoc"><td colspan="2"></td></tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td><i class="iconPopup iconSwitch fas fa-calendar-check '+stateSetDatesIcon+'"></i> '+
                    '               De uma data espec\u00EDfica'+
                    '          </td>'+
                    '          <td>'+
                    '              <div class="onoffswitch" style="float: right;">'+
                    '                  <input type="checkbox" onchange="configDatesSwitchChange(this)" name="onoffswitch" class="onoffswitch-checkbox" id="configDatesBox_setdate" data-type="setdate" tabindex="0" '+stateSetDates+'>'+
                    '                  <label class="onoff-switch-label" for="configDatesBox_setdate"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px; '+stateSetDatesDiv+'" class="configDates_setdate">'+
                    '          <td>'+
                    '               <i class="iconPopup fas fa-clock cinzaColor"></i> Data referencial'+
                    '          </td>'+
                    '          <td>'+
                    '               <input type="date" onchange="configDatesPreview()" id="configDatesBox_date" value="'+configdate.date+'" style="width:130px; float: right;">'+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr style="height: 10px;">'+
                    '           <td colspan="2">'+
                    '               <a class="newLink '+stateAdvancedIcon+'" onclick="configDatesAdvanced(this)" style="font-size: 10pt; cursor: pointer; margin: 5px 0 0 0; float: right;"><i class="fas fa-wrench cinzaColor"></i> Op\u00E7\u00F5es avan\u00E7adas</a>'+
                    '           </td></tr>'+
                    '   </table>'+
                    '   <table style="font-size: 10pt; width: 100%; '+stateAdvancedDiv+'" class="seiProForm configDates_advanced">'+
                    '      <tr class="hrForm"><td colspan="4"></td></tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td colspan="2">Visualizar o resultado:</td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td><i class="iconPopup iconSwitch fas fa-stopwatch '+stateCountDownIcon+'"></i> '+
                    '               Em tempo relativo'+
                    '          </td>'+
                    '          <td>'+
                    '              <div class="onoffswitch" style="float: right;">'+
                    '                  <input type="checkbox" onchange="configDatesSwitchChange(this)" name="onoffswitch" class="onoffswitch-checkbox" id="configDatesBox_countdown" data-type="countdown" tabindex="0" '+stateCountDown+'>'+
                    '                  <label class="onoff-switch-label" for="configDatesBox_countdown"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td><i class="iconPopup iconSwitch fas fa-calendar-day '+stateCountDaysIcon+'"></i> '+
                    '               Em n\u00FAmero de dias'+
                    '          </td>'+
                    '          <td>'+
                    '              <div class="onoffswitch" style="float: right;">'+
                    '                  <input type="checkbox" onchange="configDatesSwitchChange(this)" name="onoffswitch" class="onoffswitch-checkbox" id="configDatesBox_countdays" data-type="countdays" tabindex="0" '+stateCountDays+'>'+
                    '                  <label class="onoff-switch-label" for="configDatesBox_countdays"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px; '+stateCountDaysDiv+'" class="configDates_countdays">'+
                    '          <td><i class="iconPopup iconSwitch fas fa-briefcase '+stateWorkdayIcon+'"></i> '+
                    '               Calcular em dias \u00FAteis'+
                    '          </td>'+
                    '          <td>'+
                    '              <div class="onoffswitch" style="float: right;">'+
                    '                  <input type="checkbox" onchange="configDatesSwitchIcon(this)" name="onoffswitch" class="onoffswitch-checkbox" id="configDatesBox_workday" data-type="workday" tabindex="0" '+stateWorkday+'>'+
                    '                  <label class="onoff-switch-label" for="configDatesBox_workday"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '      <tr class="hrForm"><td colspan="4"></td></tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td colspan="2">Sinalizar a partir:</td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td><i class="iconPopup iconSwitch fas fa-pen-fancy '+stateNewDocIcon+'"></i> '+
                    '               Da assinatura de um novo documento (EM BREVE)'+
                    '          </td>'+
                    '          <td>'+
                    '              <div class="onoffswitch" style="float: right;">'+
                    '                  <input type="checkbox" onchange="configDatesSwitchChange(this)" name="onoffswitch" class="onoffswitch-checkbox" id="configDatesBox_newdoc" data-type="newdoc" tabindex="0" '+stateNewDoc+'>'+
                    '                  <label class="onoff-switch-label" for="configDatesBox_newdoc"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '      <tr class="configDates_newdoc"><td colspan="2"><span id="configDatesBox_newdoclist">'+htmlNewDocList+'</span></td></tr>'+
                    '      <tr style="height: 40px; '+stateNewDocDiv+'" class="configDates_newdoc">'+
                    '          <td colspan="2">'+
                    '               <select id="configDatesBox_listnewdoc" onchange="configDatesDocsChange(this)">'+
                    '                   <option value="0">Qualquer tipo de documento</option>';
        if (typeof storeMonitorados['config']['tiposdocs'] !== 'undefined' && storeMonitorados['config']['tiposdocs'].length > 0) {
            $.each(storeMonitorados['config']['tiposdocs'], function(i,value){
                htmlBox +=   (value.name == '') ? '' : '                   <option value="'+value.id+'" >'+value.name+'</option>';
            });
        }
        htmlBox +=  '               </select>'+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr style="height: 10px;"><td colspan="2"></td></tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td><i class="iconPopup iconSwitch fas fa-hourglass-half '+stateDueDateIcon+'"></i> '+
                    '               Do n\u00FAmero de dias decorridos'+
                    '          </td>'+
                    '          <td>'+
                    '              <div class="onoffswitch" style="float: right;">'+
                    '                  <input type="checkbox" onchange="configDatesSwitchChange(this)" name="onoffswitch" class="onoffswitch-checkbox" id="configDatesBox_duedate" data-type="duedate" tabindex="0" '+stateDueDate+'>'+
                    '                  <label class="onoff-switch-label" for="configDatesBox_duedate"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px; '+stateDueDateDiv+'" class="configDates_duedate">'+
                    '          <td colspan="2">'+
                    '               <input type="number" onchange="configDatesPreview()" id="configDatesBox_duenumber" value="'+duenumber+'" style="width:40px; margin-left: 35px !important;" min="0">'+
                    '               dias '+
                    '               <select id="configDatesBox_duecounter" onchange="configDatesPreview()" style="width: auto;">'+
                    '                   <option value="corrido" '+stateDuecounter_corrido+'>corridos</option>'+
                    '                   <option value="util" '+stateDuecounter_util+'>\u00FAteis</option></select>'+
                    '               <select id="configDatesBox_duemode" onchange="configDatesPreview()" style="width: auto;">'+
                    '                   <option value="depois" '+stateDuemode_depois+'>depois</option>'+
                    '                   <option value="antes" '+stateDuemode_antes+'>antes</option>'+
                    '               </select>'+
                    '               <span class="configDates_selectdoc" style="display:none">da data de assinatura</span>'+
                    '               <span class="configDates_setdate">da data de refer\u00EAncia</span>'+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr style="height: 10px;" class="configDates_duedate"><td colspan="2"></td></tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td><i class="iconPopup iconSwitch fas fa-calendar-alt '+stateDueSetDateIcon+'"></i> '+
                    '               De uma data de vencimento espec\u00EDfica'+
                    '          </td>'+
                    '          <td>'+
                    '              <div class="onoffswitch" style="float: right;">'+
                    '                  <input type="checkbox" onchange="configDatesSwitchChange(this)" name="onoffswitch" class="onoffswitch-checkbox" id="configDatesBox_duesetdate" data-type="duesetdate" tabindex="0" '+stateDueSetDate+'>'+
                    '                  <label class="onoff-switch-label" for="configDatesBox_duesetdate"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px; '+stateDueSetDateDiv+'" class="configDates_duesetdate">'+
                    '          <td>'+
                    '               <i class="iconPopup iconSwitch fas fa-clock cinzaColor"></i> Data de vencimento'+
                    '          </td>'+
                    '          <td>'+
                    '               <input type="date" onchange="configDatesPreview()" id="configDatesBox_duesetdt" value="'+configdate.dateDue+'" style="width:130px; float: right;">'+
                    '           </td>'+
                    '      </tr>'+
                    '   </table>'+
                    '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                    '      <tr class="hrForm"><td colspan="4"></td></tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td colspan="2">Pr\u00E9via:</td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td colspan="2">'+
                    '              <div id="dateboxPreview" style="display:none; text-align: center;"></div>'+
                    '          </td>'+
                    '      </tr>'+
                    '   </table>'+
                    '   <input type="hidden" value="'+id_procedimento+'" id="configDatesBox_id_procedimento">'+
                    '</div>';
    
        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
            .dialog({
                title: "Processos Monitorados: Op\u00E7\u00F5es",
                width: 500,
                close: function() { $('#configDatesBox').remove() },
                buttons: [{
                    text: "Remover",
                    icon: 'ui-icon-trash',
                    click: function() {
                        removeConfigDatesMonitorado(this_);
                        $(this).dialog('close');
                    }
                },{
                    text: "Ok",
                    click: function() {
                        saveConfigDatesMonitorado(this_);
                        $(this).dialog('close');
                    }
                }]
        });
        configDatesPreview();
}
function getDadosSelectDoc(this_, id_procedimento) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        dadosProcessoPro = {};
        _this.closest('tr').find('td').eq(0).addClass('editCellLoading');
        getDadosIframeProcessoPro(String(id_procedimento), 'monitorados');
        initDadosSelectDoc(id_procedimento);
    }
}
// monitoradoProcessDataReady / monitoradoProcessPayloadReady migrados p/
// src/features/monitorados/domain.js (globais preservados por aliasGlobal).
function waitMonitoradoProcessData(id_procedimento, callback, onTimeout, requireDocs = false) {
    var eventName = 'sei-pro-process-session-updated';
    var resolved = false;
    var timeoutId = null;
    var handler = function(event) {
        var detail = (event && event.detail) ? event.detail : {};
        if (typeof detail.id_procedimento !== 'undefined' && detail.id_procedimento !== null && String(detail.id_procedimento) !== String(id_procedimento)) {
            return;
        }
        var dados = pullDadosProcessoSession(id_procedimento);
        if (monitoradoProcessDataReady(id_procedimento, dados) && (!requireDocs || typeof dados.listDocumentosAssinados !== 'undefined')) {
            resolved = true;
            window.removeEventListener(eventName, handler);
            if (timeoutId) clearTimeout(timeoutId);
            if (typeof callback === 'function') callback(dados);
        }
    };

    var dados = pullDadosProcessoSession(id_procedimento);
    if (monitoradoProcessDataReady(id_procedimento, dados) && (!requireDocs || typeof dados.listDocumentosAssinados !== 'undefined')) {
        if (typeof callback === 'function') callback(dados);
        return true;
    }

    window.addEventListener(eventName, handler);
    timeoutId = setTimeout(function(){
        if (!resolved) {
            window.removeEventListener(eventName, handler);
            if (typeof onTimeout === 'function') onTimeout();
        }
    }, 15000);

    return false;
}
function initDadosSelectDoc(id_procedimento) {
    waitMonitoradoProcessData(id_procedimento, function(dados){
        dadosProcessoPro = dados;
        $('#configDatesBox_selectdoc').closest('tr').find('td').eq(0).removeClass('editCellLoading');
        updateSelectMonitorados(id_procedimento);
    }, function(){
        $('#configDatesBox_selectdoc').closest('tr').find('td').eq(0).removeClass('editCellLoading');
        if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Timeout initDadosSelectDoc => '+id_procedimento);
    }, true);
}
function updateSelectMonitorados(id_procedimento) {
    $('#configDatesBox_selectdoc').closest('tr').find('td').eq(0).removeClass('editCellLoading');
    
    if (typeof dadosProcessoPro.listDocumentosAssinados !== 'undefined' && 
        dadosProcessoPro.listDocumentosAssinados !== null && 
        dadosProcessoPro.listDocumentosAssinados.length > 0
        ) {
        var listDocSelect = dadosProcessoPro.listDocumentosAssinados;
        var selectDoc = $('#configDatesBox_listdocs');
        var itemSelected = selectDoc.val().trim();
        var htmlBox = $.map(listDocSelect, function(value){
            var selected = (itemSelected != '' && itemSelected == value.id_documento) ? 'selected' : '';
            return (value.data_assinatura == '') ? '' : '<option data-sign="'+value.data_assinatura+'" data-id-protocolo="'+value.id_documento+'" '+selected+'>'+value.nome_documento+' (SEI n\u00BA '+value.nr_sei+') [assinado em '+value.data_assinatura+']</option>';
        }).join('');
        selectDoc.html(htmlBox);
        updateArraySelectMonitorados(id_procedimento);
    }
}
function updateArraySelectMonitorados(id_procedimento) {
    var storeMonitorados = getStoreMonitoradoPro();
    if (typeof storeMonitorados !== 'undefined' && storeMonitorados.hasOwnProperty('monitorados')) {
        var monitoradoIndex = findMonitoradoIndex(storeMonitorados, id_procedimento);
        if (typeof monitoradoIndex !== 'undefined' && monitoradoIndex !== null && monitoradoIndex !== -1) {
            var item = storeMonitorados.monitorados[monitoradoIndex];
                item.documentos = dadosProcessoPro.listDocumentosAssinados;
                item.andamento = dadosProcessoPro.listAndamento.andamento;
                storeMonitorados.monitorados[monitoradoIndex] = item;
                persistMonitoradoStore(storeMonitorados);
        }
    }
}
function appendArrayNewdoclist(listArray) {
    var htmlDoc = '';
    $.each(listArray, function(i,value){
        htmlDoc += appendNewdoclist(value);
    });
    return htmlDoc;
}
function appendNewdoclist(nameDoc) {
    return  '<span class="dateboxDoc">'+
            '   <i class="far fa-file-alt" style="color: #777; padding-right: 3px;"></i> '+
                nameDoc+
            '   <i class="fas fa-times" style="color: #F783AD; padding-left: 3px; cursor:pointer" onclick="javascript:$(this).closest(\'span\').remove()"></i> '+
            '</span>';
}
function configDatesDocsChange(this_) {
    var nameDoc = $(this_).find('option:selected').text();
    var valueDoc = parseInt($(this_).val().trim());
    var listDocsSelected = $('#configDatesBox_newdoclist').find('.dateboxDoc').map(function () {  return $(this).text().trim() }).get();
    if (valueDoc == 0) {
        $('#configDatesBox_newdoclist').html('');
    } else if (!listDocsSelected.includes(nameDoc)) {
        if (listDocsSelected.length > 10) {
            alert('Atingido o limite de documentos para pesquisa (10)');
        } else {
            var htmlDoc = appendNewdoclist(nameDoc);
                $('#configDatesBox_newdoclist').append(htmlDoc);
                //console.log(htmlDoc);
        }
    }
}
function configDatesAdvanced(this_) {
    $('.configDates_advanced').toggle();
    $(this_).toggleClass('newLink_active');
}
function configDatesSetUpdate(mode) {
    var dataSign = $('#configDatesBox_listdocs').find('option:selected').data('sign');
    if (dataSign) {
        $('#configDatesBox_date').val(moment(dataSign,'DD/MM/YYYY').format('YYYY-MM-DD'));
        if (mode == 'update') { 
            configDatesPreview(); 
        }
    }
}
// getConfigDatetimeMonitorado / saveConfigMonitorado migrados p/
// src/features/monitorados/store.js (globais preservados por aliasGlobal).
function actionMonitoradoCheckbox(this_) {
    var _this = $(this_);
    var optionsDiv = _this.closest('.infraDivCheckbox').find('.monitoradosLabelOptions');
    if (_this.is(':checked')) {
        actMonitoradoPro(false, 'add');
        optionsDiv.slideDown();
    } else {
        actMonitoradoPro(false, 'remove');
        optionsDiv.slideUp();
        optionsDiv.find('.selectPro').val('');
        optionsDiv.find('#monitoradoPrazoSend').val('');
        optionsDiv.find('.monitoradoTagsPro').val('');
        optionsDiv.find('.info_tags_follow').html('');
        optionsDiv.find('div.tagsinput .tag').remove();
    }
}
function saveConfigDatesMonitorado(this_) {
    var _this = $(this_);
    var config = getConfigDatesMonitorado();
    var storeMonitorados = getStoreMonitoradoPro();
    var id_procedimento = parseInt($('#configDatesBox_id_procedimento').val().trim());
    var monitoradoIndex = findMonitoradoIndex(storeMonitorados, id_procedimento);
    if (monitoradoIndex >=0 && typeof storeMonitorados['monitorados'][monitoradoIndex] !== undefined && typeof getConfigDatesMonitorado() !== undefined) {
        //console.log(config);
        var htmlDatePreview = getDatesPreview(config);
        var trMonitorado = _this.closest('table').find('tr[data-id_procedimento="'+id_procedimento+'"]');
        
        if ($(this_).closest('#frmAtividadeListar').length == 0) {
            trMonitorado.find('.info_dates_monitorado').html(htmlDatePreview).show().closest('td').find('.info_dates_monitorado_txt').hide();
            trMonitorado.find('.followLinkDatesEdit').show();
        }
        $('#configDatesBox').remove();
        trMonitorado.find('.monitoradoDatesPro').val(config.date);
        storeMonitorados['monitorados'][monitoradoIndex]['configdate'] = config;
        persistMonitoradoStore(storeMonitorados);
        alertaBoxPro('Sucess', 'check-circle', 'Contagem de tempo cadastrada com sucesso!');
        resetDialogBoxPro('iframeBoxPro');
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao cadastrar!');
    }
}
function removeConfigDatesMonitorado(this_) {
    var _this = $(this_);
    var config = getConfigDatesMonitorado();
    var storeMonitorados = getStoreMonitoradoPro();
    var id_procedimento = parseInt($('#configDatesBox_id_procedimento').val().trim());
    var monitoradoIndex = findMonitoradoIndex(storeMonitorados, id_procedimento);
    if (monitoradoIndex >=0 && typeof storeMonitorados['monitorados'][monitoradoIndex] !== undefined && typeof getConfigDatesMonitorado() !== undefined) {
        //console.log(config);
        var trMonitorado = _this.closest('table').find('tr[data-id_procedimento="'+id_procedimento+'"]');
        
        if ($(this_).closest('#frmAtividadeListar').length == 0) {
            trMonitorado.find('.info_dates_monitorado').html('').show().closest('td').find('.info_dates_monitorado_txt').hide();
            trMonitorado.find('.followLinkDatesEdit').show();
        }
        $('#configDatesBox').remove();
        trMonitorado.find('.monitoradoDatesPro').val('');
        storeMonitorados['monitorados'][monitoradoIndex]['configdate'] = null;
        persistMonitoradoStore(storeMonitorados);
        alertaBoxPro('Sucess', 'check-circle', 'Contagem de tempo removida com sucesso!');
        resetDialogBoxPro('iframeBoxPro');
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao cadastrar!');
    }
}
function getConfigDatesMonitorado() {
    var countdown = $('#configDatesBox_countdown').is(':checked');
    var countdays = $('#configDatesBox_countdays').is(':checked');
    var workday = $('#configDatesBox_workday').is(':checked');
    var selectdoc = $('#configDatesBox_selectdoc').is(':checked');
    var duedate = $('#configDatesBox_duedate').is(':checked');
    var duesetdate = $('#configDatesBox_duesetdate').is(':checked');
    var newdoc = $('#configDatesBox_newdoc').is(':checked');
    var setdate = $('#configDatesBox_setdate').is(':checked');
    var duemode = $('#configDatesBox_duemode').val().trim();
    var duecounter = $('#configDatesBox_duecounter').val().trim();
    var dateDue = $('#configDatesBox_duesetdt').val().trim();
    var duenumber = $('#configDatesBox_duenumber').val().trim();
        duenumber = (duemode == 'depois') ? duenumber : -Math.abs(duenumber);
    var listdocs = $('#configDatesBox_listdocs').find('option:selected').data('id-protocolo');
    var date = $('#configDatesBox_date').val().trim();
    var dateTo = moment().format('YYYY-MM-DD');
    var newdoclist = (newdoc) ? $('#configDatesBox_newdoclist').find('.dateboxDoc').map(function () {  return $(this).text().trim() }).get() : [];
    var advanced = (countdays || duedate || duesetdate || newdoclist.length > 0) ? true : false;
    return {date: date, dateDue: dateDue, advanced: advanced, newdoclist: newdoclist, listdocs: listdocs, setdate: setdate, newdoc: newdoc, countdown: countdown, countdays: countdays, workday: workday, duenumber: parseInt(duenumber), duecounter: duecounter, duemode: duemode, duesetdate: duesetdate, duedate: duedate, selectdoc: selectdoc};
}
function configDatesSwitchIcon(this_) {
    if ($(this_).is(':checked')) { 
        $(this_).closest('tr').find('.iconSwitch').addClass('azulColor');
    } else {
        $(this_).closest('tr').find('.iconSwitch').removeClass('azulColor');
    }
    configDatesPreview();
}
function configDatesSwitchChange(this_) {
    configSwitchChange(this_, 'countdown', 'countdays');
    configSwitchChange(this_, 'setdate', 'selectdoc');
    configSwitchChange(this_, 'duedate', 'newdoc', 'duesetdate');
    configDatesPreview();
    if ($('#configDatesBox_selectdoc').is(':checked')) { configDatesSetUpdate('update') }
}
// Grupo de switches mutuamente exclusivos (radio-like via checkboxes).
// Regra: o switch que liga vence; ao desligar, opt1<->opt2 se alternam e opt3 off devolve para opt2.
function configSwitchChange(this_, option1, option2, option3) {
    var _this = $(this_);
    var type = _this.data('type');
    var group = option3 ? [option1, option2, option3] : [option1, option2];

    if (group.indexOf(type) !== -1) {
        var active;
        if (_this.is(':checked')) {
            active = type;                      // o que acabou de ligar vence
        } else if (type === option2) {
            active = option1;                   // desligou opt2 -> opt1 assume
        } else {
            active = option2;                   // desligou opt1 ou opt3 -> opt2 assume
        }
        group.forEach(function(opt){
            var on = (opt === active);
            $('#configDatesBox_'+opt).prop('checked', on)
                .closest('tr').find('.iconSwitch').toggleClass('azulColor', on);
            $('.configDates_'+opt)[on ? 'fadeIn' : 'fadeOut']('slow');
        });
    }
    // sincroniza o ícone do próprio switch alterado (idempotente entre as 3 chamadas)
    _this.closest('tr').find('.iconSwitch').toggleClass('azulColor', _this.is(':checked'));
}
function updateCountTableMonitorado() {
    var count = $('.tableFollow').find('tbody').find('tr:visible').length;
    var countTxt = (count == 1) ? count+' registro:' : count+' registros:';
        $('.tableFollow').find('caption.infraCaption').text(countTxt);
}
// ===== Store em memória (fonte da verdade) =====
// MIGRADO p/ src/features/monitorados/store.js + domain.js (instalado via core-stack,
// pois é infraestrutura cross-page lida por sei-pro/sei-pro-all/sei-functions-pro).
// Globais preservados por aliasGlobal: getStoreMonitoradoPro, persistMonitoradoStore,
// scheduleMonitoradoRemote, flushMonitoradoRemote, findMonitoradoIndex, defaultMonitoradoStore.
