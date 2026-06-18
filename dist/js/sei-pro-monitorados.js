const loadMonitoradosPro = true;
var statusLoadRemoteFile = true;
var map;
var markers = [];
var markersLayer = false;
var locationUser = false;
var current_position = false;
var monitoradoLocationDenied = false;
var monitorado_loopServer = 0;
// ADICIONA ACOMPANHAMENTO DE PROCESSOS
function defaultConfigDate() {
    return {
        date: moment().format('YYYY-MM-DD'),
        listdocs: false,
        dateDue: moment().add(5,'d').format('YYYY-MM-DD'),
        countdown: true,
        countdays: false,
        workday: false,
        setdate: true,
        duenumber: 5,
        duecounter: 'corrido',
        duemode: 'depois',
        duesetdate: false,
        duedate: false,
        newdoc: true,
        selectdoc: false,
        advanced: false,
        displayformat: false,
        displayicon: false,
        displaydue: false,
        displaydue_txt: 'Vencimento:',
        displaytip: '',
        deliverydoc: false,
        deliverydoc_style: '',
        newdoclist: []
    };
}
function getOptionsConfigDate(index) {
    var storeMonitorados = getStoreMonitoradoPro();
    var item = (index >= 0 && storeMonitorados['monitorados'][index]) ? storeMonitorados['monitorados'][index] : false;
    return (item && !$.isEmptyObject(item['configdate'])) ? item['configdate'] : defaultConfigDate();
}
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
function monitoradoProcessDataReady(id_procedimento, dados) {
    return (
        typeof dados !== 'undefined' &&
        dados &&
        Object.keys(dados).length > 0 &&
        dados.constructor === Object &&
        typeof dados.listAndamento !== 'undefined' &&
        dados.listAndamento !== null &&
        dados.hasOwnProperty('listAndamento') &&
        typeof dados.listAndamento.id_procedimento !== 'undefined' &&
        dados.listAndamento.id_procedimento !== null &&
        dados.listAndamento.hasOwnProperty('id_procedimento') &&
        String(dados.listAndamento.id_procedimento) == String(id_procedimento) &&
        typeof dados.propProcesso !== 'undefined' &&
        dados.propProcesso !== null
    );
}
function monitoradoProcessPayloadReady(id_procedimento, dados) {
    return (
        monitoradoProcessDataReady(id_procedimento, dados) &&
        typeof dados.listDocumentosAssinados !== 'undefined' &&
        $.isArray(dados.listDocumentosAssinados)
    );
}
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
// Mantida apenas como atalho: atualiza datetime e persiste localmente (sem remoto).
function getConfigDatetimeMonitorado() {
    var storeMonitorados = getStoreMonitoradoPro();
    persistMonitoradoStore(storeMonitorados, { remote: false });
    return storeMonitorados;
}
// Persiste o store atual e agenda (debounce) o envio remoto. Chamada também por sei-functions-pro (etiquetas).
function saveConfigMonitorado() {
    persistMonitoradoStore(getStoreMonitoradoPro());
}
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
// O objeto vivo fica em memória e o localStorage é write-through (síncrono),
// para os demais arquivos continuarem lendo a chave 'configDataMonitoradosPro'.
// O cache de parse é invalidado comparando a string crua do localStorage, então
// escritas externas (sync de servidor, etiquetas, outras abas) são sempre refletidas.
// A persistência remota (servidor + FileSystem) é agrupada com debounce.
var SEIPRO_MONITORADO_KEY = 'configDataMonitoradosPro';
var monitoradoStoreState = null;
var monitoradoStoreLastRaw = null;
var monitoradoRemoteTimer = null;
function defaultMonitoradoStore() {
    return { monitorados: [], config: { colortags: [] } };
}
function getStoreMonitoradoPro() {
    var raw = localStorage.getItem(SEIPRO_MONITORADO_KEY);
    if (raw === monitoradoStoreLastRaw && monitoradoStoreState !== null) {
        return monitoradoStoreState;
    }
    var parsed = (raw && isJson(raw)) ? JSON.parse(raw) : false;
    monitoradoStoreState = (parsed && !$.isEmptyObject(parsed)) ? parsed : defaultMonitoradoStore();
    monitoradoStoreLastRaw = raw;
    return monitoradoStoreState;
}
// Localiza o índice de um processo monitorado no store (retorna -1 se ausente).
function findMonitoradoIndex(store, id_procedimento) {
    if (!store || !store.monitorados) return -1;
    return store.monitorados.findIndex(function(obj){
        return String(obj.id_procedimento) === String(id_procedimento);
    });
}
function persistMonitoradoStore(store, options) {
    options = options || {};
    monitoradoStoreState = store || getStoreMonitoradoPro();
    if (!monitoradoStoreState.config) monitoradoStoreState.config = { colortags: [] };
    monitoradoStoreState.config.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    monitoradoStoreLastRaw = JSON.stringify(monitoradoStoreState);
    localStorage.setItem(SEIPRO_MONITORADO_KEY, monitoradoStoreLastRaw);
    if (options.remote !== false) scheduleMonitoradoRemote();
}
function scheduleMonitoradoRemote() {
    if (monitoradoRemoteTimer) clearTimeout(monitoradoRemoteTimer);
    monitoradoRemoteTimer = setTimeout(function(){
        monitoradoRemoteTimer = null;
        flushMonitoradoRemote();
    }, 800);
}
// Se houver envio remoto pendente, dispara imediatamente ao sair da página
// (o localStorage já é síncrono; isto garante o backup remoto/FileSystem).
if (!window.__seiProMonitoradoFlushBound) {
    window.__seiProMonitoradoFlushBound = true;
    window.addEventListener('pagehide', function(){
        if (monitoradoRemoteTimer) {
            clearTimeout(monitoradoRemoteTimer);
            monitoradoRemoteTimer = null;
            flushMonitoradoRemote();
        }
    });
}
function flushMonitoradoRemote() {
    var storeMonitorados = getStoreMonitoradoPro();
    if (typeof storeMonitorados === 'undefined' || !storeMonitorados.hasOwnProperty('monitorados')) return;
    if (typeof perfilLoginAtiv === 'undefined' || perfilLoginAtiv === null) return;
    var sendMonitorados = { monitorados: [], config: { colortags: [] } };
    sendMonitorados.monitorados = jmespath.search(storeMonitorados.monitorados, "[*].{id_procedimento: id_procedimento, assuntos: assuntos, descricao: descricao, interessados: interessados, processo: processo, tipo_procedimento: tipo_procedimento, categoria: categoria, order: order, etiquetas: etiquetas, configdate: configdate}");
    sendMonitorados.config.colortags = storeMonitorados.config.colortags;
    getServerAtividades({
        config: encodeURIComponent(encodeJSON_toHex(JSON.stringify(sendMonitorados))),
        action: 'set_monitorados'
    }, 'set_monitorados');
    setLocalFilePro(getStoreMonitoradoPro());
}
function getMonitoradoProcessAnchor(ifrArvore) {
    if (!ifrArvore || !ifrArvore.length) return $();
    var targetSelectors = [
        '#topmenu a[target="' + ifrVisualizacao_ + '"]',
        '#topmenu a[target="ifrConteudoVisualizacao"]',
        '#topmenu a[target="ifrVisualizacao"]'
    ];
    for (var i = 0; i < targetSelectors.length; i++) {
        var anchor = ifrArvore.find(targetSelectors[i]).eq(0);
        if (anchor.length > 0) return anchor;
    }
    return $();
}
function getMonitoradoVisualizacaoContents() {
    var visualizacao = $($ifrVisualizacao);
    if (visualizacao.length > 0) return visualizacao.contents();
    var fallback = $('#ifrConteudoVisualizacao, #ifrVisualizacao').eq(0);
    return fallback.length > 0 ? fallback.contents() : false;
}
function insertIconMonitorados() {
    const target = `a[target="${ifrVisualizacao_}"], a[target="ifrConteudoVisualizacao"], a[target="ifrVisualizacao"]`;
    if (!$('#ifrArvore').length) return;
    waitLoadPro($('#ifrArvore').contents(), '#topmenu', target, appendIconMonitorados);
}
function appendIconMonitorados() {
    if (!$('#ifrArvore').length) return;
    var ifrArvore = $('#ifrArvore').contents(); 
    var iconProc = getMonitoradoProcessAnchor(ifrArvore);
    if (!iconProc.length || !iconProc.attr('href')) return;
    var id_procedimento = String(getParamsUrlPro(iconProc.attr('href')).id_procedimento);
    if (!id_procedimento || id_procedimento === 'undefined') return;
    var iconStar = htmlIconMonitorados(id_procedimento);
    ifrArvore.find('.iconMonitoradoPro').remove();
    iconProc.after(iconStar);    
}
function actMonitoradoPro(this_, mode) {
    if (this_) {
        var _this = $(this_);
        var id_procedimento = _this.data('id_procedimento');
        var ifrArvore = false;
        var ifrVisualizacao = false;
    } else {
        var _this = false;
        var ifrArvore = $('#ifrArvore').length ? $('#ifrArvore').contents() : false; 
        var ifrVisualizacao = getMonitoradoVisualizacaoContents(); 
        var iconProc = getMonitoradoProcessAnchor(ifrArvore);
        if (!iconProc.length || !iconProc.attr('href')) return false;
        var id_procedimento = String(getParamsUrlPro(iconProc.attr('href')).id_procedimento);
    }
    checkDataMonitoradoPro(this_, mode, id_procedimento);

    if (mode == 'add' && ifrVisualizacao && ifrVisualizacao.find('#frmAtividadeListar').length == 0 && ifrArvore && ifrArvore.length > 0) {
        var htmlBox = monitoradosLabelOptions(id_procedimento);
        var htmlSucess =    '<strong class="iframeSucessPro" style="background-color: #f9efad;font-size: 10pt;padding: 10px;border-radius: 5px;margin: 0 0 10px 0;display: block;color: #404040;">'+
                            '   <i class="fas fa-check-circle azulColor" style="margin-right: 5px;"></i>'+
                            '   Processo adicionado com sucesso no painel de Processos Monitorados (p\u00E1gina incial do SEI)'+
                            '</strong>';
        resetDialogBoxPro('iframeBoxPro');
        iframeBoxPro = $('#iframeBoxPro')
            .html('<div class="dialogBoxDiv">'+htmlSucess+htmlBox+'</div>')
            .dialog({
                title: 'Op\u00E7\u00F5es: Processos Monitorados',
                width: 650,
                open: function(event) { 
                    initChosenReplace('box_init', this);
                },
                buttons: [{
                    text: 'Ok',
                    class: 'confirm',
                    click: function(event) { 
                        resetDialogBoxPro('iframeBoxPro');
                    }
                }]
        });
    }
}
function getFallbackMonitoradoRowData(target, id_procedimento) {
    var row = (target && target.length > 0) ? target.closest('tr') : $();
    if ((!row || row.length === 0) && id_procedimento) {
        row = $('.tabelaControle tr').filter(function(){
            var _row = $(this);
            var hrefAtribuicao = _row.find('a[href*="id_procedimento="]').eq(0).attr('href');
            return hrefAtribuicao && String(getParamsUrlPro(hrefAtribuicao).id_procedimento) === String(id_procedimento);
        }).eq(0);
    }
    if (!row || row.length === 0) return false;

    var rowText = row.text().trim();
    var checkbox = row.find('input[type="checkbox"]').eq(0);
    var processo = '';
    var descricao = '';
    var tipo_procedimento = '';
    var assuntos = [];
    var interessados = [];
    var hrefProcesso = row.find('a[href*="acao=procedimento_trabalhar"]').eq(0);
    var processoCell = row.find('td').eq(3);
    var descricaoCell = row.find('td').eq(2);
    var processCheckboxHelp = checkbox.attr('title') || checkbox.attr('aria-label') || checkbox.attr('data-original-title') || '';
    var processCheckboxDesc = checkbox.attr('alt') || checkbox.attr('label') || '';

    if (processoCell.length > 0) {
        processo = processoCell.text().trim();
    }
    if (!processo && processCheckboxHelp) {
        processo = processCheckboxHelp.trim();
    }
    if (!processo && hrefProcesso.length > 0) {
        processo = hrefProcesso.text().trim();
    }

    if (descricaoCell.length > 0) {
        descricao = descricaoCell.text().trim();
    }
    if (!descricao && processCheckboxDesc) {
        var descMatch = processCheckboxDesc.match(/Especifica(?:ção|cao)\s+(.+)$/i);
        if (descMatch && descMatch[1]) descricao = descMatch[1].trim();
    }

    var tipoTooltip = hrefProcesso.attr('onmouseover') || '';
    var tooltipArray = extractTooltipToArray(tipoTooltip);
    if (tooltipArray && tooltipArray.length > 1) {
        tipo_procedimento = tooltipArray[1].split(' / ')[0].trim();
    }
    if (!tipo_procedimento && processCheckboxDesc) {
        var tipoMatch = processCheckboxDesc.match(/Tipo\s+(.+?)(?:\s*\/\s*Especifica(?:ção|cao)\s+|$)/i);
        if (tipoMatch && tipoMatch[1]) tipo_procedimento = tipoMatch[1].trim();
    }
    if (!descricao && rowText) {
        descricao = rowText.replace(/\s+/g, ' ').trim();
    }
    if (!processo) {
        processo = String(id_procedimento);
    }

    if (descricao && tipo_procedimento && descricao !== tipo_procedimento) {
        interessados = [];
    }

    return {
        listAndamento: {
            historico_completo: false,
            processo: processo,
            id_procedimento: String(id_procedimento),
            andamento: []
        },
        listDocumentosAssinados: [],
        tiposDocumentos: [],
        propProcesso: {
            hdnIdProcedimento: String(id_procedimento),
            hdnNomeTipoProcedimento: tipo_procedimento,
            selAssuntos_select: assuntos,
            selInteressadosProcedimento: interessados,
            txtDescricao: descricao
        }
    };
}
function saveImmediateMonitoradoPro(target, id_procedimento) {
    var fallbackData = getFallbackMonitoradoRowData(target, id_procedimento);
    if (!fallbackData) return false;
    dadosProcessoPro = fallbackData;
    if (!dadosProcessoPro.hasOwnProperty('tiposDocumentos')) dadosProcessoPro.tiposDocumentos = [];
    if (!dadosProcessoPro.hasOwnProperty('listDocumentosAssinados')) dadosProcessoPro.listDocumentosAssinados = [];
    storeMonitoradoPro('add', id_procedimento);
    return fallbackData;
}
function checkDataMonitoradoPro(this_, mode, id_procedimento, TimeOut = 9000) {
    var target = (this_) ? $(this_) : $('#ifrArvore').contents().find('#iconMonitoradoPro_'+id_procedimento);
    var monitoradoSaved = false;
    var storeWhenReady = function(dados) {
        dadosProcessoPro = dados;
        if (typeof dadosProcessoPro !== 'undefined' && dadosProcessoPro && !dadosProcessoPro.hasOwnProperty('tiposDocumentos')) dadosProcessoPro.tiposDocumentos = [];
        if (typeof dadosProcessoPro !== 'undefined' && dadosProcessoPro && !dadosProcessoPro.hasOwnProperty('listDocumentosAssinados')) dadosProcessoPro.listDocumentosAssinados = [];
        if (mode == 'add' && monitoradoSaved) {
            syncMonitoradoProProcessData(id_procedimento, dadosProcessoPro);
        } else {
            storeMonitoradoPro(mode, id_procedimento);
            monitoradoSaved = (mode == 'add');
        }
        if (target && target.length > 0) target.fadeOut(100).fadeIn(100);
    };

    if (mode == 'remove') {
        storeWhenReady();
        return true;
    }

    var dados = pullDadosProcessoSession(id_procedimento);
    if (monitoradoProcessPayloadReady(id_procedimento, dados)) {
        storeWhenReady(dados);
        return true;
    }

    if (mode == 'add') {
        monitoradoSaved = !!saveImmediateMonitoradoPro(target, id_procedimento);
        if (monitoradoSaved && target && target.length > 0) target.fadeOut(100).fadeIn(100);
    }

    waitMonitoradoProcessData(id_procedimento, function(dados){
        if (!monitoradoProcessPayloadReady(id_procedimento, dados)) return;
        storeWhenReady(dados);
    }, function(){
        if (mode == 'add' && monitoradoSaved) return;
        if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Timeout checkDataMonitoradoPro => '+id_procedimento);
    });

    if (mode == 'add') {
        getDadosIframeProcessoPro(id_procedimento, 'monitorados');
    }

    return false;
}
function syncMonitoradoProProcessData(id_procedimento, dados) {
    if (typeof id_procedimento === 'undefined' || id_procedimento === null || id_procedimento === '') return;
    if (typeof dados === 'undefined' || !dados || typeof dados.propProcesso === 'undefined' || dados.propProcesso === null) return;
    var storeMonitorados = getStoreMonitoradoPro();
    if (!storeMonitorados || typeof storeMonitorados.monitorados === 'undefined' || !storeMonitorados.monitorados.length) return;

    var monitoradoIndex = findMonitoradoIndex(storeMonitorados, id_procedimento);
    if (monitoradoIndex === -1) return;

    var andamento = dados.listAndamento || {};
    var prop = dados.propProcesso || {};
    var item = storeMonitorados.monitorados[monitoradoIndex];
    var previousSnapshot = JSON.stringify({
        processo: item.processo || '',
        andamento: item.andamento || [],
        documentos: item.documentos || [],
        tipo_procedimento: item.tipo_procedimento || '',
        assuntos: item.assuntos || [],
        interessados: item.interessados || [],
        descricao: item.descricao || ''
    });
    item.id_procedimento = andamento.id_procedimento || item.id_procedimento;
    item.processo = andamento.processo || item.processo;
    item.andamento = andamento.andamento || item.andamento || [];
    item.documentos = dados.listDocumentosAssinados || item.documentos || [];
    item.tipo_procedimento = prop.hdnNomeTipoProcedimento || item.tipo_procedimento || '';
    item.assuntos = prop.selAssuntos_select || item.assuntos || [];
    item.interessados = prop.selInteressadosProcedimento || item.interessados || [];
    item.descricao = prop.txtDescricao || item.descricao || '';
    storeMonitorados.monitorados[monitoradoIndex] = item;
    if (typeof dados.tiposDocumentos !== 'undefined' && $.isArray(dados.tiposDocumentos) && dados.tiposDocumentos.length > 0) {
        storeMonitorados.config = storeMonitorados.config || {};
        storeMonitorados.config.tiposdocs = dados.tiposDocumentos;
    }
    persistMonitoradoStore(storeMonitorados);
    var currentSnapshot = JSON.stringify({
        processo: item.processo || '',
        andamento: item.andamento || [],
        documentos: item.documentos || [],
        tipo_procedimento: item.tipo_procedimento || '',
        assuntos: item.assuntos || [],
        interessados: item.interessados || [],
        descricao: item.descricao || ''
    });
    if ($('#ifrArvore').length == 0 && $('#monitoradosPro').length > 0 && previousSnapshot !== currentSnapshot) {
        setPanelMonitorados('refresh');
    }
}
function bindMonitoradoProcessSync() {
    if (window.__seiProMonitoradoProcessSyncBound) return;
    window.__seiProMonitoradoProcessSyncBound = true;
    window.addEventListener('sei-pro-process-session-updated', function(event){
        var detail = (event && event.detail) ? event.detail : {};
        var id_procedimento = detail.id_procedimento;
        if (typeof id_procedimento === 'undefined' || id_procedimento === null || id_procedimento === '') return;
        var dados = pullDadosProcessoSession(id_procedimento);
        if (!monitoradoProcessDataReady(id_procedimento, dados)) return;
        syncMonitoradoProProcessData(id_procedimento, dados);
    });
}
bindMonitoradoProcessSync();
function storeMonitoradoPro(mode, id_procedimento) {
    if (mode == 'add') {
        var storeMonitorados = addMonitoradoPro(id_procedimento);
    } else {
        var storeMonitorados = removeMonitoradoPro(id_procedimento);
    }
    if (typeof dadosProcessoPro !== 'undefined' && dadosProcessoPro.hasOwnProperty('tiposDocumentos') && dadosProcessoPro.tiposDocumentos.length > 0 ) { storeMonitorados['config']['tiposdocs'] = dadosProcessoPro.tiposDocumentos; }
    persistMonitoradoStore(storeMonitorados);
    appendIconMonitorados();
    if ($('#ifrArvore').length == 0) {
        // console.log('### addMonitoradoPro', mode, storeMonitorados); 
        if ($('#monitoradosPro').length == 0) {
                setPanelMonitorados('insert');
                initAppendIconMonitorados();
        } else {
            if (typeof storeMonitorados.monitorados === 'undefined' || storeMonitorados.monitorados === null || storeMonitorados.monitorados.length == 0) {
                $('#monitoradosPro').remove();
                appendStarOnProcess();
            } else {
                setPanelMonitorados('refresh');
            }
        }
        dadosProcessoPro = {};
        if ($('#processosKanban').is(':visible')) addKanbanProc();
    }
}
function removeMonitoradoPainelPro(this_, id_procedimento = 0) {
    confirmaBoxPro('Tem certeza que deseja remover esse processo dos Processos Monitorados?', function(){
        if (id_procedimento == 0) {
            $('#monitoradoTablePro').find('input[name="monitoradoPro"]:checked').each(function(){
                var id_procedimento = $(this).val().trim();
                removeMonitoradoPainelPro_(this, id_procedimento);
            });
            setTimeout(function(){ 
                $(this_).hide();
            }, 500);
        } else {
            removeMonitoradoPainelPro_(this_, id_procedimento);
        }
    });
}
function removeMonitoradoPainelPro_(this_, id_procedimento) {
    var _this = $(this_);
    var storeMonitorados = removeMonitoradoPro(id_procedimento);
    persistMonitoradoStore(storeMonitorados);
    _this.closest('tr').slideUp();
}
function updateMonitorados(this_) {
    $(this_).find('i').addClass('fa-spin');
    setPanelMonitorados('refresh');
    initChosenReplace('panel', this_);
}
function configureLeafletAssets() {
    if (typeof L === 'undefined' || typeof L.Icon === 'undefined' || typeof L.Icon.Default === 'undefined') return;
    if (L.Icon.Default.prototype._seiProAssetsConfigured) return;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: URL_SPRO+'css/images/marker-icon-2x.png',
        iconUrl: URL_SPRO+'css/images/marker-icon.png',
        shadowUrl: URL_SPRO+'css/images/marker-shadow.png'
    });
    L.Icon.Default.prototype._seiProAssetsConfigured = true;
}
function removeMonitoradoPro(id_procedimento, storeMonitorados = false) {
    var storeMonitorados = storeMonitorados || getStoreMonitoradoPro();
    storeMonitorados['monitorados'] = storeMonitorados['monitorados'].filter(function(item){
        return item['id_procedimento'] != id_procedimento;
    });
    return storeMonitorados;
}
function editCategoryMonitorado(this_, id_procedimento) {
    var _this = $(this_);
    var storeMonitorados = getStoreMonitoradoPro()['monitorados'];
    var category_elem = _this.closest('td').find('.info_category');
    var category_txt = _this.closest('td').find('.info_category_txt');
    if (category_elem.is(':visible')) {
        category_elem.hide();
        category_txt.show();
        _this.find('i').attr('class','fas fa-pencil-alt');
    } else {
        var value = jmespath.search(storeMonitorados, "[?id_procedimento=='"+id_procedimento+"'] | [0]");
        var categoriaLista = selectCategoryMonitorado(value.categoria, 'changeCategoryMonitorado', true, id_procedimento);
        category_elem.show().html(categoriaLista);
        category_txt.hide();
        _this.find('i').attr('class','fas fa-thumbs-up');
    }
}
function selectCategoryMonitorado(select = '', func = false, newItem = false, id_procedimento = 0) {
    var storeMonitorados = getStoreMonitoradoPro()['monitorados'];
    var listaCategorias = jmespath.search(storeMonitorados,"[*].categoria");
        listaCategorias = (listaCategorias !== null) ? uniqPro(listaCategorias) : false;
    var categoriaLista = (listaCategorias) 
        ? $.map(listaCategorias, function(v, i){
            if (v !== null && v != '') {
                var selected = (select !== null && v == select) ? 'selected' : '';
                return '<option value="'+v+'" '+selected+'>'+v+'</option>';
            }
        }).join('')
        : '';
        categoriaLista = '<select class="selectPro" '+(id_procedimento ? 'style="margin: 0 !important;font-size: 10pt;" data-id="'+id_procedimento+'"' : 'style="width: 100%;font-size: 10pt;"')+' '+(func ? 'onchange="'+func+'(this)"' : '')+'><option value="&nbsp;">&nbsp;</option>'+categoriaLista+(newItem ? '<option value="new">\u2795 Nova categoria</option>' : '')+'</select>';
   return categoriaLista;
}
function changePanelCategoryMonitorado(this_) {
    var _this = $(this_);
    setOptionsPro('panelMonitoradosView', _this.val().trim());
    setPanelMonitorados('refresh');
}
function changeCategoryMonitorado(this_) {
    var _this = $(this_);
    if (_this.val() == 'new') {
        var textBox =   '<i class="fas fa-info-circle azulColor" style="margin-right: 5px;"></i> Digite o nome da nova categoria:'+
                        '<br><br><span class="seiProForm" style="text-align: center; display: block; font-size: 9pt;">'+
                        '   <input onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" type="text" style="width: 90% !important;" class="required infraText" value="" name="nomeNovoItem" id="nomeNovoItem">'+
                        '</span>';
        resetDialogBoxPro('alertBoxPro');
        alertBoxPro = $('#alertaBoxPro')
            .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
            .dialog({
                width: 400,
                title: 'Adicionar nova categoria',
                close: function() {
                    if ($(this_).closest('#frmAtividadeListar').length == 0 && $('#iframeBoxPro:visible').length == 0) {
                        _this.closest('td').find('.info_category').hide().html('');
                        _this.closest('td').find('.info_category_txt').show();
                    } else {
                        var newValue = $('#nomeNovoItem').val().trim();
                        _this.find('option:selected').before('<option value="'+newValue+'">'+newValue+'</option>').end().val(newValue);
                        if ($('#iframeBoxPro:visible').length > 0) {
                            initChosenReplace('box_refresh', this_);
                        }
                    }
                },
                open: function() {
                    $('#nomeNovoItem').focus();
                },
                buttons: [{
                    text: "Ok",
                    class: 'confirm ui-state-active',
                    click: function() {
                        saveCategoryMonitorado(this_, $('#nomeNovoItem').val().trim());
                    }
                }]
        });
    } else {
        saveCategoryMonitorado(this_, _this.val().trim());
    }
}
function saveCategoryMonitorado(this_, value) {
    var _this = $(this_);
    var data = _this.data();
    var id_procedimento = data.id;
    var storeMonitorados = getStoreMonitoradoPro();
    var monitoradoIndex = findMonitoradoIndex(storeMonitorados, id_procedimento);
    if (monitoradoIndex >= 0) {
            var item = storeMonitorados.monitorados[monitoradoIndex];
                item.categoria = value;
            storeMonitorados.monitorados[monitoradoIndex] = item;
    }
    persistMonitoradoStore(storeMonitorados);
    setPanelMonitorados('refresh');
    if (alertBoxPro) {   
        alertBoxPro.dialog('close');
        resetDialogBoxPro('alertBoxPro');
    }
}
function addMonitoradoPro(id_procedimento = false) {
    var storeMonitorados = getStoreMonitoradoPro();
    var monitoradoId = id_procedimento || (dadosProcessoPro && dadosProcessoPro.listAndamento ? dadosProcessoPro.listAndamento.id_procedimento : false);
    if (monitoradoId !== false) {
        storeMonitorados = removeMonitoradoPro(monitoradoId, storeMonitorados);
    }
    var andamento = (typeof dadosProcessoPro !== 'undefined' && dadosProcessoPro.listAndamento) ? dadosProcessoPro.listAndamento : {};
    var prop = (typeof dadosProcessoPro !== 'undefined' && dadosProcessoPro.propProcesso) ? dadosProcessoPro.propProcesso : {};
        storeMonitorados['monitorados'].push({
            id_procedimento: andamento.id_procedimento,
            processo: andamento.processo,
            andamento: andamento.andamento || [],
            documentos: dadosProcessoPro.listDocumentosAssinados || [],
            tipo_procedimento: prop.hdnNomeTipoProcedimento || '',
            assuntos: prop.selAssuntos_select || [],
            interessados: prop.selInteressadosProcedimento || [],
            descricao: prop.txtDescricao || '',
            order: -1,
            categoria: ''
        });
    return storeMonitorados;
}
function setPanelMonitorados(mode) {
    var statusView = ( getOptionsPro('monitoradosProDiv') == 'hide' ) ? 'display:none;' : 'display: inline-table;';
    var statusIconShow = ( getOptionsPro('monitoradosProDiv') == 'hide' ) ? '' : 'display:none;';
    var statusIconHide = ( getOptionsPro('monitoradosProDiv') == 'hide' ) ? 'display:none;' : '';
    var storeMonitorados = getStoreMonitoradoPro()['monitorados'];
        storeMonitorados.forEach(function(monitorado){
            if (monitorado.order === null) {
                monitorado.order = -1;
            }
        });
        storeMonitorados = (checkObjHasProperty(storeMonitorados, 'order')) ? jmespath.search(storeMonitorados, "sort_by([*],&order)") : storeMonitorados;
    var arrayProcessosUnidade = getProcessoUnidadePro();
    var selectedCategoryView = (getOptionsPro('panelMonitoradosView')) ? getOptionsPro('panelMonitoradosView') : '';

    var listMonitorado = (selectedCategoryView != '') ? jmespath.search(storeMonitorados, "[?categoria=='"+selectedCategoryView+"']") : storeMonitorados;
    var countMonitorado = (listMonitorado.length == 1) ? listMonitorado.length+' registro:' : listMonitorado.length+' registros:';
    var checkMaps = (jmespath.search(storeMonitorados, "length([?not_null(latlng)])") > 0) ? true : false;

    if (listMonitorado !== null && listMonitorado.length > 0) {
        var htmlTableMonitorados =    '<table class="tableInfo tableZebra infraTable tableFollow tableMonitorados tabelaControle" data-name-table="Processos Monitorados" data-tabletype="monitorados" id="monitoradoTablePro">'+
                                    '   <caption class="infraCaption" style="text-align: left;">'+countMonitorado+'</caption>'+
                                    '   <thead>'+
                                    '       <tr class="tableHeader">'+
                                    '           <th class="tituloControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+'" style="width: 50px;" align="center"><span class="lblInfraCheck" aria-hidden="true"></span><a id="lnkInfraCheck" onclick="getSelectAllTr(this, \'SemGrupo\');"><img src="/infra_css/'+(SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg': 'imagens/check.gif')+'" id="imgRecebidosCheck" title="Selecionar Tudo" alt="Selecionar Tudo" class="infraImg"></a></th>'+
                                    '           <th class="tituloControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+'" style="width: 210px;">Processo</th>'+
                                    '           <th class="tituloControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+' tituloFilter" data-filter-type="date" style="width: 150px;">Prazo</th>'+
                                    '           <th class="tituloControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+' tituloFilter" data-filter-type="etiqueta" style="width: 150px;">Marcador</th>'+
                                    '           <th class="tituloControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+' tituloFilter" data-filter-type="etiqueta" style="width: 80px;">Mapa</th>'+
                                    '           <th class="tituloControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+'">Anota\u00E7\u00E3o</th>'+
                                    '           <th class="tituloControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+'">Tipo de Processo</th>'+
                                    '           <th class="tituloControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+'">Categoria</th>'+
                                    '           <th class="tituloControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+'" style="width: 50px;" align="center"><i class="fas fa-sort-numeric-up"></i></th>'+
                                    '       </tr>'+
                                    '   </thead>'+
                                    '   <tbody>';
            $.each(listMonitorado,function(index, value){
                var linkDoc = url_host+'?acao=procedimento_trabalhar&id_procedimento='+value.id_procedimento;
                var tagsMonitorado = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? (value.etiquetas.length > 0 ? value.etiquetas.join(';') : value.etiquetas[0]) : '';
                var tagsMonitoradoHtml = (typeof value.etiquetas !== 'undefined') ? $.map(listMonitorado[index].etiquetas, function (i) { return getHtmlEtiqueta(i,'monitorado') }).join('') : '';
                var tagsMonitoradoClass = (typeof value.etiquetas !== 'undefined') ? $.map(listMonitorado[index].etiquetas, function (i) { return 'tagTableName_'+normalizeNameTag(i); }).join(' ') : '';   
                var datesMonitorado = (typeof value.configdate !== 'undefined' && value.configdate !== null && typeof value.configdate.date !== 'undefined' && value.configdate.date !== null) ? value.configdate.date : '';
                if (typeof value.configdate !== 'undefined' && value.configdate !== null && typeof value.configdate.dateTo !== 'undefined' && value.configdate.dateTo !== null) { value.configdate.dateTo = moment().format('YYYY-MM-DD') }
                var datesMonitoradoHtml = (typeof value.configdate !== 'undefined' && value.configdate !== null) ? getDatesPreview(value.configdate) : ''; 
                var tagDatesMonitoradoClass = (datesMonitoradoHtml != '') ? 'tagTableName_'+$(datesMonitoradoHtml).data('tagname') : '';
                var iconProcesso = ( $.inArray(value.processo, arrayProcessosUnidade) == -1 ) ? 'fas fa-folder' : 'far fa-folder-open';
                var tipsProcesso = ( $.inArray(value.processo, arrayProcessosUnidade) == -1 ) ? 'Processo fechado nesta unidade' : 'Processo aberto nesta unidade';
                var issetOrder = (value.hasOwnProperty('order') && value.order !== null && value.order != -1) ? true : false;
                var order = (issetOrder) ? value.order : index;
                var categoria = (value.hasOwnProperty('categoria') && value.categoria !== null && value.categoria != '') ? value.categoria : false;
                var htmlIconsHome = ($('#P'+value.id_procedimento).find('td').eq(1).find('a').length > 0) ? $('#P'+value.id_procedimento).find('td').eq(1).find('a').map(function(v){ return this.outerHTML }).get().join('') : '';
                var processoSafe = (typeof escapeHtml === 'function') ? escapeHtml(value.processo) : value.processo;
                var descricaoSafe = (typeof escapeHtml === 'function') ? escapeHtml(value.descricao) : value.descricao;
                var tipoProcedimentoSafe = (typeof escapeHtml === 'function') ? escapeHtml(value.tipo_procedimento) : value.tipo_procedimento;
                var categoriaSafe = (categoria && typeof escapeHtml === 'function') ? escapeHtml(categoria) : (categoria ? categoria : '');
                if (selectedCategoryView == '' || selectedCategoryView == categoria) {
                    htmlTableMonitorados +=   '       <tr data-tagname="SemGrupo" data-index="'+index+'" data-id_procedimento="'+value.id_procedimento+'" class="'+tagsMonitoradoClass+' '+tagDatesMonitoradoClass+'">'+
                                            '           <td align="center"><input type="checkbox" onclick="followSelecionarItens(this)" id="monitoradoPro_'+value.id_procedimento+'" name="monitoradoPro" value="'+value.id_procedimento+'"></td>'+
                                            '           <td align="left">'+
                                            '               <a class="followLinkProcesso bLink" style="text-decoration: underline;" href="'+linkDoc+'">'+
                                            '               <i class="'+iconProcesso+' bLink" style="text-decoration: underline;"  onmouseover="return infraTooltipMostrar(\''+tipsProcesso+'\');" onmouseout="return infraTooltipOcultar();"></i> '+
                                            '               '+processoSafe+'</a>'+
                                            '               <a class="newLink followLink followLinkNewtab" href="'+linkDoc+'" onmouseover="return infraTooltipMostrar(\'Abrir em nova aba\');" onmouseout="return infraTooltipOcultar();" target="_blank"><i class="fas fa-external-link-alt" style="font-size: 90%; text-decoration: underline;"></i></a>'+
                                            '               <div class="info_icons_monitorado">'+htmlIconsHome+'</div>'+
                                            '           </td>'+
                                            '           <td align="left" class="tdmonitorado_dates '+((datesMonitoradoHtml.trim() == '' ) ? 'info_dates_follow_empty' : '')+'">'+
                                            '               <span class="info_dates_monitorado">'+datesMonitoradoHtml+
                                            '               </span>'+
                                            '               <a class="newLink followLink followLinkDates followLinkDatesEdit" onclick="showDatesMonitorado(this, \'show\')" onmouseover="return infraTooltipMostrar(\'Editar prazo\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-pencil-alt" style="font-size: 100%;"></i></a>'+
                                            '               <a class="newLink followLink followLinkDates followLinkDatesAdd" onclick="showDatesMonitorado(this, \'show\')" onmouseover="return infraTooltipMostrar(\'Adicionar prazo\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-stopwatch" style="font-size: 100%;"></i></a>'+
                                            '               <span class="info_dates_monitorado_txt" style="display:none;">'+
                                            '                   <input value="'+datesMonitorado+'" onblur="showDatesMonitorado(this, \'hide\')"  onkeypress="keyDatesMonitorado(event)" type="date" class="monitoradoDatesPro" name="monitoradoDatesPro">'+
                                            '                   <a class="newLink" onclick="showDatesMonitorado(this, \'hide\')" style="padding: 2px; margin: 0 2px;" onmouseover="return infraTooltipMostrar(\'Salvar\');" onmouseout="return infraTooltipOcultar();">'+
                                            '                      <i class="fas fa-thumbs-up" style="font-size: 100%;"></i>'+
                                            '                   </a>'+
                                            '                   <a class="newLink monitoradoConfigDates" onclick="openBoxConfigDates(this)" style="padding: 2px; margin: 0 2px;" onmouseover="return infraTooltipMostrar(\'Op\u00E7\u00F5es\');" onmouseout="return infraTooltipOcultar();">'+
                                            '                      <i class="fas fa-cog" style="font-size: 100%;"></i>'+
                                            '                   </a>'+
                                            '               </span>'+
                                            '           </td>'+
                                            '           <td align="left" class="tdmonitorado_tags '+((tagsMonitoradoHtml.trim() == '' ) ? 'info_tags_follow_empty' : '')+'" data-etiqueta-mode="monitorado">'+
                                            '               <span class="info_tags_follow">'+tagsMonitoradoHtml+
                                            '               </span>'+
                                            '               <span class="info_tags_follow_txt" style="display:none">'+
                                            '                   <input value="'+tagsMonitorado+'" class="monitoradoTagsPro" name="monitoradoTagsPro">'+
                                            '               </span>'+
                                            '               <a class="newLink followLink followLinkTags followLinkTagsEdit" onclick="showFollowEtiqueta(this, \'show\', \'monitorado\')" onmouseover="return infraTooltipMostrar(\'Editar etiqueta\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-pencil-alt" style="font-size: 100%;"></i></a>'+
                                            '               <a class="newLink followLink followLinkTags followLinkTagsAdd" onclick="showFollowEtiqueta(this, \'show\', \'monitorado\')" onmouseover="return infraTooltipMostrar(\'Adicionar etiqueta\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-tags" style="font-size: 100%;"></i></a>'+
                                            '           </td>'+
                                            '           <td class="tdmonitorado_map '+((typeof value.latlng !== 'undefined' && value.latlng !== null) ? '' : 'info_maps_follow_empty')+'">'+
                                            '               <span class="info_maps_follow">'+(typeof value.latlng !== 'undefined' && value.latlng !== null ? '<a class="newLink" onclick="openBoxSingleMap(this, true)"><i class="fas fa-map-marked azulColor" style="font-size: 100%;"></i></a>' : '')+'</span>'+
                                            '               <a class="newLink followLink followLinkMaps followLinkMapsEdit" onclick="openBoxSingleMap(this)" onmouseover="return infraTooltipMostrar(\'Editar mapa\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-pencil-alt" style="font-size: 100%;"></i></a>'+
                                            '               <a class="newLink followLink followLinkMaps followLinkMapsAdd" onclick="openBoxSingleMap(this)" onmouseover="return infraTooltipMostrar(\'Adicionar mapa\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-map-marker-alt" style="font-size: 100%;"></i></a>'+
                                            '           </td>'+
                                            '           <td class="content_desc">'+
                                            '               <span class="info_txt" style="display:none"><input onblur="saveFollowDesc(this, \'monitorado\')" onkeypress="keyFollowDesc(event, \'monitorado\')" value="'+descricaoSafe+'" name="monitoradoDescriptionPro"></span>'+
                                            '               <span class="info">'+descricaoSafe+'</span>'+
                                            '               <a class="newLink followLink followLinkDesc" onclick="editFollowDesc(this, \'monitorado\')" onmouseover="return infraTooltipMostrar(\'Editar especifica\u00E7\u00E3o\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-pencil-alt" style="font-size: 100%;"></i></a>'+
                                            '           </td>'+
                                            '           <td>'+
                                            '               '+tipoProcedimentoSafe+
                                            '               <a class="newLink followLink followLinkTags followLinkMonitoradoRemove" onclick="removeMonitoradoPainelPro(this, \''+value.id_procedimento+'\')" onmouseover="return infraTooltipMostrar(\'Remover dos Processos Monitorados\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-trash-alt" style="font-size: 100%;"></i></a>'+
                                            '           </td>'+
                                            '           <td class="td_monitorado_category">'+
                                            '               <span class="info_category_txt">'+categoriaSafe+'</span>'+
                                            '               <span class="info_category" style="display:none"></span>'+
                                            '               <a class="newLink followLink followLinkTags followLinkMonitoradoCategory" onclick="editCategoryMonitorado(this, \''+value.id_procedimento+'\')" onmouseover="return infraTooltipMostrar(\'Editar categoria\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-pencil-alt" style="font-size: 100%;"></i></a>'+
                                            '           </td>'+
                                            '           <td align="center" data-order="'+order+'">'+
                                            '               <a class="newLink sorterTrMonitorado" style="margin-right: 20px; cursor: grab;"></i>'+
                                            '                   <span class="fa-layers fa-fw">'+
                                            '                       <i class="fas fa-bars cinzaColor"></i>'+
                                            (issetOrder ? 
                                            '                       <span class="fa-layers-counter">'+value.order+'</span>'+
                                            '' : '')+
                                            '                   </span>'+
                                            '               </a>'+
                                            '           </td>'+
                                            '       </tr>';
                }
            });
            htmlTableMonitorados +=   '   </tbody>'+
                                    '</table>';
        var idOrder = (getOptionsPro('orderPanelHome') && jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='monitoradosPro'].index | length(@)") > 0) ? jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='monitoradosPro'].index | [0]") : '';
        var htmlPanelMonitorados = '<div class="panelHomePro" style="display: inline-block; width: 100%;" id="monitoradosPro" data-order="'+idOrder+'">'+
                                '   <div class="infraBarraLocalizacao titlePanelHome">'+
                                '       <i class="fas fa-star starGold" style="margin: 0 5px; font-size: 1.1em;"></i>'+
                                '       Processos Monitorados'+
                                '       <a class="newLink" id="monitoradosProDiv_showIcon" onclick="toggleTablePro(\'#monitoradosProDiv\',\'show\')" onmouseover="return infraTooltipMostrar(\'Mostrar Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconShow+'"><i class="fas fa-plus-square cinzaColor"></i></a>'+
                                '       <a class="newLink" id="monitoradosProDiv_hideIcon" onclick="toggleTablePro(\'#monitoradosProDiv\',\'hide\')" onmouseover="return infraTooltipMostrar(\'Recolher Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconHide+'"><i class="fas fa-minus-square cinzaColor"></i></a>'+
                                '   </div>'+
                                '   <div id="monitoradosProDiv" class="panelHome" style="width: 100%; '+statusView+'">'+
                                '   	<div id="monitoradosProActions" style="top:0; position: absolute; z-index: 9999; left: 190px; width: calc(100% - 230px)">'+
                                '           <a class="newLink iconMonitorados_remove" onclick="removeMonitoradoPainelPro(this)" onmouseover="return infraTooltipMostrar(\'Remover processos monitorados\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 14pt; display: none">'+
                                '                   <span class="fa-layers fa-fw">'+
                                '                       <i class="fas fa-trash-alt"></i>'+
                                '                       <span class="fa-layers-counter">1</span>'+
                                '                   </span>'+
                                '           </a>'+
                                '           <span style="display:block; float:right; width:200px;">'+selectCategoryMonitorado(selectedCategoryView, 'changePanelCategoryMonitorado')+'</span>'+
                                '           <a class="newLink iconMonitorados_update" onclick="updateMonitorados(this)" onmouseover="return infraTooltipMostrar(\'Atualizar Informa\u00E7\u00F5es\');" onmouseout="return infraTooltipOcultar();" style="margin-right: 10px;;font-size: 14pt;float: right;">'+
                                '               <i class="fas fa-sync-alt"></i>'+
                                '           </a>'+
                                '           <a class="newLink iconMonitorados_maps" onclick="openBoxMultipleMap()" onmouseover="return infraTooltipMostrar(\'Mapa de processos monitorados\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 14pt;float: right; '+(checkMaps ? '' : 'display:none;')+'">'+
                                '              <i class="fas fa-map-marker-alt" style="font-size: 100%;"></i>'+
                                '           </a>'+
                                '           <a class="newLink iconMonitorados_config" onclick="openConfigMonitorados(this)" onmouseover="return infraTooltipMostrar(\'Configura\u00E7\u00F5es\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 14pt;float: right;">'+
                                '               <i class="fas fa-cog"></i>'+
                                '           </a>'+
                                '   	</div>'+
                                '   	<div class="tabelaPanelScroll">'+
                                '           '+htmlTableMonitorados+
                                '   	</div>'+
                                '   </div>'+
                                '</div>';

        function positionMonitoradosBeforeControl() {
            if (!$('#monitoradosPro').length || !$('#processosSEIPro').length) return;
            $('#monitoradosPro').insertBefore('#processosSEIPro');
        }

        if ( mode == 'insert' ) {
            if ( $('#monitoradosPro').length > 0 ) { $('#monitoradosPro').remove(); }        
            orderDivPanel(htmlPanelMonitorados, idOrder, 'monitoradosPro');
            positionMonitoradosBeforeControl();

            if (typeof L === 'undefined') {
                loadStylePro(URL_SPRO+"css/leaflet.css");
                $.getScript(URL_SPRO+"js/lib/leaflet.js", function( data, textStatus, jqxhr ) {
                    if (typeof L === 'object' && jqxhr.status == 200) {
                        $.getScript(URL_SPRO+"js/lib/leaflet-geocoder.js");
                    }
                  });
            }

            if (getOptionsPro('panelSortPro')) {
                initSortDivPanel();
            }
        } else if ( mode == 'refresh' ) {
            $('#monitoradosPro').attr('id', 'monitoradosPro_temp');
            $('#monitoradosPro_temp').after(htmlPanelMonitorados);
            $('#monitoradosPro_temp').remove();
            positionMonitoradosBeforeControl();
        }
        initFunctionsPanelMonitorado();
        checkFileSystemInit();
        appendStarOnProcess();
        // console.log('setPanelMonitorados');
    } else {
        checkFileLocalMonitorado();
        appendStarOnProcess();
    }
}
function appendStarOnProcess() {
    var storeMonitorados = getStoreMonitoradoPro()['monitorados'];
    $('.tabelaControle').find('tbody tr').each(function(){
        var _this = $(this);
        // A estrela é exibida em TODOS os processos, inclusive os não visualizados
        // (a marca .processoNaoVisualizado fica no td do número, não no td da estrela).
        var id_procedimento = _this.attr('id');
            id_procedimento = (typeof id_procedimento !== 'undefined' && id_procedimento !== null && id_procedimento !== '') ? id_procedimento.replace('P', '') : false;
        if (!id_procedimento) {
            var hrefAtribuicao = _this.find('a[href*="id_procedimento="]').eq(0).attr('href');
            id_procedimento = (typeof hrefAtribuicao !== 'undefined' && hrefAtribuicao) ? getParamsUrlPro(hrefAtribuicao).id_procedimento : false;
        }
        if (!id_procedimento) {
            var hrefProcesso = _this.find('a[href*="acao=procedimento_trabalhar"]').eq(0).attr('href');
            id_procedimento = (typeof hrefProcesso !== 'undefined' && hrefProcesso) ? getParamsUrlPro(hrefProcesso).id_procedimento : false;
        }
        // Sem float: a estrela fica inline e centralizada verticalmente na célula
        // (vertical-align:middle) em relação à descrição do processo.
        var iconStar = (id_procedimento) ? htmlIconMonitorados(id_procedimento) : '';
        var td = _this.find('td').eq(1);
        td.find('.iconMonitoradoPro').remove();
        td.css('vertical-align', 'middle').prepend(iconStar);
    });
}
function checkFileSystemInit() {
    if (!fileSystemPro) {
        getLocalFilePro();
        setTimeout(function(){
            if (!fileSystemPro) {
                var htmlFileSystemStatus =  '<span id="htmlFileSystemStatus" style="display:block;float: left;font-size: 9pt;color: #888;clear: both;top: 0; left:60px;position: absolute;width: calc(100% - 400px);">'+
                                            '   <i class="fas fa-exclamation-triangle vermelhoColor"></i> Seu navegador n\u00E3o possui suporte ao sistema de arquivos local (FileSystem API) ou o usu\u00E1rio n\u00E3o autorizou o seu uso. '+
                                            '   <br> A n\u00E3o utiliza\u00E7\u00E3o dessa tecnologia poder\u00E1 ocasionar a perda de dados dos Processos Monitorados, caso o dados de cache do navegador sejam apagados. '+
                                            '   <br><a onclick="initFileSystem(); setPanelMonitorados(\'refresh\');" style="font-size: 9pt;color: blue; text-decoration: underline;">Re-autorize</a> a aplica\u00E7\u00E3o ou utilize outro navegador compat\u00EDvel.'+
                                            '</span>';
                $('#htmlFileSystemStatus').remove();
                $('#monitoradosProActions').append(htmlFileSystemStatus);
            }
        }, 1000);
    }
}
function checkFileRemoteMonitorado(mode, data = false) {
    if (mode == 'get' && typeof getServerAtividades !== 'undefined' && (typeof checkLoadMonitoradosProcPro === 'undefined' || !checkLoadMonitoradosProcPro) ) {
        var action = 'check_monitorados';
        var param = {
            action: action
        };
        getServerAtividades(param, action);
    } else if (mode == 'set') {
        if (data) {
            var storeMonitorados = getStoreMonitoradoPro();
            var datetime_server = moment(data.datetime,'YYYY-MM-DD HH:mm:ss');
            var datetime_local = moment(storeMonitorados.datetime,'YYYY-MM-DD HH:mm:ss');
            if (statusLoadRemoteFile && datetime_server.isValid() && datetime_local.isValid() && datetime_server > datetime_local.add(1,'minutes')) {
                getConfigDatetimeMonitorado();
                setTimeout(function(){
                    getRemoteFileMonitorado();
                    statusLoadRemoteFile = false;
                    setTimeout(function(){
                        statusLoadRemoteFile = true;
                    }, 5000);
                    if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('getRemoteFileMonitorado', storeMonitorados, datetime_server.format('YYYY-MM-DD HH:mm:ss'), datetime_local.add(1,'minutes').format('YYYY-MM-DD HH:mm:ss'));
                }, 3000);
            }
        }
    }
}
function checkFileLocalMonitorado() {
        getLocalFilePro();
        setTimeout(function(){ 
            if (fileSystemPro && fileSystemContentPro && typeof fileSystemContentPro === 'object' && typeof moment().isoWeekdayCalc === 'function' && fileSystemContentPro.hasOwnProperty('monitorados') && fileSystemContentPro.monitorados.length > 0 ) {
                persistMonitoradoStore(fileSystemContentPro);
                initPanelMonitorados();
                if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('checkFileLocalMonitorado => backup setPanelMonitorados');
            } else if (typeof perfilLoginAtiv !== 'undefined' && perfilLoginAtiv !== null) {
                getRemoteFileMonitorado();
                if (typeof moment().isoWeekdayCalc !== 'function') $.getScript(URL_SPRO+"js/lib/moment-weekday-calc.js");
            }
        }, 500);
}
function getRemoteFileMonitorado() {
    if (monitorado_loopServer < 5) {
        var action = 'get_monitorados';
        var param = {
            action: action
        };
        getServerAtividades(param, action);
        monitorado_loopServer++;
    }
}
function restoreMonitoradoServer(data) {
    var storeMonitorados = getStoreMonitoradoPro();
    if (typeof storeMonitorados !== 'undefined' && typeof storeMonitorados.monitorados !== 'undefined' && typeof data !== 'undefined' && typeof data.monitorados !== 'undefined' && typeof data.config.colortags !== 'undefined') {
        storeMonitorados.monitorados = data.monitorados;
        storeMonitorados.config.colortags = data.config.colortags;
        persistMonitoradoStore(storeMonitorados, { remote: false });
        setLocalFilePro(storeMonitorados);
        initPanelMonitorados();
        if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('restoreMonitoradoServer => backup setPanelMonitorados');
    }
}
function keyDatesMonitorado(e) {
    if(e.which == 13) {
        var target = (e && e.target) ? e.target : (e && e.currentTarget) ? e.currentTarget : (e && e.path && e.path.length > 0) ? e.path[0] : false;
        if (target) showDatesMonitorado(target, 'hide');
    }
}
function initFunctionsPanelMonitorado(TimeOut = 9000) {
    if (typeof window.seiProMonitoradoInitTimer !== 'undefined' && window.seiProMonitoradoInitTimer && TimeOut == 9000) {
        clearTimeout(window.seiProMonitoradoInitTimer);
        window.seiProMonitoradoInitTimer = false;
    }
    if (TimeOut <= 0) { return; }
    var hasTagsInput = typeof $.fn.tagsInput === 'function';
    var hasTableSorter = typeof $.fn.tablesorter === 'function';
    var hasAutocomplete = typeof $.fn.autocomplete === 'function';
    if (hasTagsInput && hasTableSorter && hasAutocomplete) {

        var idTableMonitorado = '#monitoradoTablePro';
        var tableMonitorados = $(idTableMonitorado);
        if (!tableMonitorados.length) { return; }
        if (tableMonitorados.data('sei-pro-monitorado-init') === true) { return; }
        if (tableMonitorados.data('sei-pro-monitorado-init-pending') === true) { return; }
        tableMonitorados.data('sei-pro-monitorado-init-pending', true);
        tableMonitorados.data('sei-pro-monitorado-init', true);
        window.seiProMonitoradoInitTimer = false;

        initChosenReplace('panel');

        $('.monitoradoTagsPro').each(function(){
            var _input = $(this);
            if (_input.data('sei-pro-tags-init') === true) return;
            _input.data('sei-pro-tags-init', true);
            _input.tagsInput({
              interactive: true,
              placeholder: 'Adicionar etiqueta',
              minChars: 2,
              maxChars: 100,
              limit: 8,
              autocomplete_url: '',
              autocomplete: {'source': sugestEtiquetaPro('monitorado') },
              hide: true,
              delimiter: [';'],
              unique: true,
              removeWithBackspace: true,
              onAddTag: saveFollowEtiqueta,
              onRemoveTag: saveFollowEtiqueta,
              onChange: saveFollowEtiqueta
            });
        });
        
        var tagName = getOptionsPro('filterTag_monitorados');
        if (typeof tagName !== 'undefined' && tagName != '') {
            setTimeout(function(){ 
                $('.tableMonitorados .tagTableText_'+tagName).eq(0).trigger('click');
                if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('tagName',tagName);
            }, 500);
        }
        tableMonitorados.tablesorter({
            sortLocaleCompare : true,
            textExtraction: {
                2: function (elem, table, cellIndex) {
                  var target = $(elem).find('.dateboxDisplay').eq(0);
                  var text_date = target.data('time-sorter');
                  return text_date;
                },
                7: function (elem, table, cellIndex) {
                    var target = parseInt($(elem).data('order'));
                    return target;
                }
              },
              widgets: ["saveSort", "filter"],
              widgetOptions: {
                  saveSort: true,
                  filter_hideFilters: true,
                  filter_columnFilters: true,
                  filter_saveFilters: true,
                  filter_hideEmpty: true,
                  filter_excludeFilter: {}
              },
              sortReset: true,
              headers: {
                  0: { sorter: false, filter: false },
                  1: { filter: true },
                  2: { filter: true },
                  3: { filter: true },
                  4: { filter: true }
              }
        }).on("sortEnd", function (event, data) {
            checkboxRangerSelectShift(idTableMonitorado);
        }).on("filterEnd", function (event, data) {
            checkboxRangerSelectShift(idTableMonitorado);
            var caption = $(this).find("caption").eq(0);
            var tx = caption.text();
                caption.text(tx.replace(/\d+/g, data.filteredRows));
                $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
        });
        checkboxRangerSelectShift(idTableMonitorado);

        tableMonitorados.sortable({
            items: 'tr',
            cursor: 'grabbing',
            handle: '.sorterTrMonitorado',
            forceHelperSize: true,
            opacity: 0.5,
            axis: 'y',
            dropOnEmpty: false,
            update: function(event, ui) {
                setTimeout(function(){ 
                    var storeMonitorados = getStoreMonitoradoPro();
                    $('#monitoradoTablePro').find('tbody tr').each(function(index, value){
                        var _tr = $(this);
                        var id_procedimento = _tr.data('id_procedimento');
                        var monitoradoIndex = findMonitoradoIndex(storeMonitorados, id_procedimento);

                        if (monitoradoIndex >= 0) {
                                var newIndex = index+1;
                                var item = storeMonitorados.monitorados[monitoradoIndex];
                                    item.order = newIndex;
                                storeMonitorados.monitorados[monitoradoIndex] = item;
                        }
                    });
                    persistMonitoradoStore(storeMonitorados);
                    $('#monitoradoTablePro').find('tbody tr').each(function(index){
                        $(this).attr('data-index', index).find('td').last().attr('data-order', index + 1);
                    });
                }, 500);
            }
        });

        // Um único observer no tbody (subtree + filtro de class) substitui um observer por linha.
        var tbodyMonitorado = tableMonitorados.find('tbody').get(0);
        var observerTableMonitorado = new MutationObserver(function() {
            var count_all = tableMonitorados.find('tr.infraTrMarcada').length;
            if (count_all > 0) {
                $('#monitoradosProActions').find('.iconMonitorados_remove').show().find('.fa-layers-counter').text(count_all);
            } else {
                $('#monitoradosProActions').find('.iconMonitorados_remove').hide();
            }
        });
        setTimeout(function(){
            if (tbodyMonitorado) {
                observerTableMonitorado.observe(tbodyMonitorado, {
                    attributes: true,
                    attributeFilter: ['class'],
                    subtree: true
                });
            }
            checkboxRangerSelectShift();
            checkFileRemoteMonitorado('get');
            tableMonitorados.removeData('sei-pro-monitorado-init-pending');
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('initFunctionsPanelMonitorado => '+TimeOut);
        }, 500);

        var filterMonitorado = tableMonitorados.find('.tablesorter-filter-row').get(0);
        if (typeof filterMonitorado !== 'undefined') {
            var observerFilterTableMonitorado = new MutationObserver(function(mutations) {
                var _this = $(mutations[0].target);
                var _parent = _this.closest('table');
                var iconFilter = _parent.find('.filterIfraTable');
                var checkIconFilter = iconFilter.hasClass('active');
                var hideme = _this.hasClass('hideme');
                if (hideme && checkIconFilter) {
                    iconFilter.removeClass('active');
                }
            });
            setTimeout(function(){ 
                var htmlFilterMonitorado = '<div class="btn-group filterIfraTable" role="group" style="right: 30px; top: -15px;z-index: 999; position: absolute;">'+
                                    '   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">'+
                                    '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                    '       <span class="text">Baixar</span>'+
                                    '   </button>'+
                                    '   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                                    '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                    '       <span class="text">Copiar</span>'+
                                    '   </button>'+
                                    '   <button type="button" onclick="filterIfraTable(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light '+(tableMonitorados.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active')+'">'+
                                    '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>'+
                                    '       Pesquisar'+
                                    '   </button>'+
                                    '</div>';

                tableMonitorados.find('thead .filterIfraTable').remove();
                tableMonitorados.find('thead').prepend(htmlFilterMonitorado);
                observerFilterTableMonitorado.observe(filterMonitorado, {
                    attributes: true
                });
            }, 500);
        }
    } else {
        if (typeof window.seiProMonitoradoInitTimer !== 'undefined' && window.seiProMonitoradoInitTimer) { return; }
        window.seiProMonitoradoInitTimer = setTimeout(function(){ 
            window.seiProMonitoradoInitTimer = false;
            if (typeof $.fn.tagsInput !== 'function' && TimeOut == 9000) { $.getScript((URL_SPRO+"js/lib/jquery.tagsinput-revisited.js")) }
            if (typeof $.fn.tablesorter !== 'function' && TimeOut == 9000) { $.getScript((URL_SPRO+"js/lib/jquery.tablesorter.combined.min.js")) }
            initFunctionsPanelMonitorado(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initFunctionsPanelMonitorado'); 
        }, 500);
    }
}

function openConfigMonitorados() {
    var textBox =   '<table style="font-size: 9pt;width: 100%;" class="seiProForm">'+
                    '   <tr style="height: 40px;">'+
                    '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                    '               <a id="backup_monitorado" style="cursor:pointer" onclick="initDownloadLocalFilePro(this)" class="newLink"><i class="fas fa-download azulColor"></i>Baixar Processos Monitorados</a>'+
                    '           </td>'+
                    '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                    '               <input type="file" id="selectLocalFilesPro" onchange="loadLocalFilePro()" value="Import" style="display: none" />'+
                    '               <a id="restore_monitorado" style="cursor:pointer;float: right;" onclick="initLoadLocalFilePro()" class="newLink"><i class="fas fa-upload azulColor"></i>Carregar Processos Monitorados</a>'+
                    '           </td>'+
                    '       <td>'+
                    '       </td>'+
                    '   </tr>'+
                    '</table>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
        .dialog({
        	width: 450,
            title: 'Configura\u00E7\u00F5es: Processos Monitorados',
            open: function(){
                getLocalFilePro();
            }
    });
}
function actionToolbarMonitoradoPro(this_, triggerButton) {
    var button = $(triggerButton);
    var name_action = button.data('action');
    if (name_action == 'etiqueta') {
        showFollowEtiqueta(this_, 'show');
    } else if (name_action == 'remove') {
        removeMonitorado(this_);
    } else if (name_action == 'dates') {
        showDatesMonitorado(this_, 'show');
    } else if (name_action == 'descricao') {
        editMonitoradoDesc(this_);
    }
}
function updateDatesMonitorado(this_) {
    var storeMonitorados = getStoreMonitoradoPro();
    var index = parseInt($(this_).closest('tr').data('index'));
    var id_procedimento = parseInt($(this_).closest('tr').data('id_procedimento'));
    var monitoradoIndex = findMonitoradoIndex(storeMonitorados, id_procedimento);
    if (monitoradoIndex < 0) { return; }
    var config = getOptionsConfigDate(monitoradoIndex);
    if ($(this_).val().trim() != '') {
            if ($(this_).val().trim() != config.date && config.date != '' && $(this_).val().trim() != '' ) {
                config.selectdoc = false;
                config.setdate = true;
            }
            config.date = ($(this_).val().trim() != '') ? $(this_).val().trim() : config.date;
            config.dateTo = moment().format('YYYY-MM-DD');
        var htmlDatePreview = getDatesPreview(config);
        var followLink = $(this_).closest('td').find('.followLink');
        if (followLink.length > 0) {
            $(this_).closest('td').find('.info_dates_monitorado').html(htmlDatePreview+followLink[0].outerHTML);
        }
        storeMonitorados['monitorados'][monitoradoIndex]['configdate'] = config;
        persistMonitoradoStore(storeMonitorados);
    }
}
function showDatesMonitorado(this_, mode) {
    if ($(this_).closest('#frmAtividadeListar').length > 0) {
        updateDatesMonitorado(this_);
    } else {
        if(!$(this_).closest('tr').find('.monitoradoConfigDates').is(':hover')) {
            $(this_).closest('table').find('.info_dates_monitorado').show();
            $(this_).closest('table').find('.info_dates_monitorado_txt').hide();
            $(this_).closest('table').find('.followLinkDates').show();
            infraTooltipOcultar();
            updateDatesMonitorado(this_);
        }
        if(mode == 'show') {
            $(this_).closest('td').find('.followLinkDates').hide();
            $(this_).closest('tr').find('.info_dates_monitorado').hide();
            $(this_).closest('tr').find('.info_dates_monitorado_txt').css('display','inline-flex').find('input.monitoradoDatesPro').focus().trigger('click');
        }
        if ($(this_).closest('tr').find('.info_dates_monitorado').text().trim() != '') {
            $(this_).closest('td').removeClass('info_dates_follow_empty');
        } else {
            $(this_).closest('td').addClass('info_dates_follow_empty');
        }
    }
}
function getMonitoradosEnviarProcesso() {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var storeMonitorados = getStoreMonitoradoPro();
    var id_procedimento = String(getParamsUrlPro(window.location.href).id_procedimento);
    var value = jmespath.search(storeMonitorados.monitorados, "[?id_procedimento=='"+id_procedimento+"'] | [0]");
    var htmlAddMonitorado =    '<div id="divSinAdicionarMonitorados" class="infraDivCheckbox" style="position: absolute;top: 100%;left: 0;">'+
                        '   <input type="checkbox" id="chkSindicionarMonitorados" onchange="parent.actionMonitoradoCheckbox(this)" name="chkSindicionarMonitorados" class="infraCheckbox" tabindex="510" '+(value ? 'checked' : '')+'>'+
                        '   <label id="lblSinAdicionarMonitorados" for="chkSindicionarMonitorados" accesskey="" class="infraLabelCheckbox">Manter processo em Processos Monitorados</label>'+
                        '   <div class="monitoradosLabelOptions seiProForm" style="display:'+(value ? 'block' : 'none')+';font-size: 9pt;clear: both;">'+
                        monitoradosLabelOptions(id_procedimento)+
                        '   </div>'+
                        '</div>';
    if (ifrVisualizacao.find('#divSinAdicionarMonitorados').length == 0) ifrVisualizacao.find('#frmAtividadeListar').append(htmlAddMonitorado);
    loadStylePro(URL_SPRO+"css/sei-pro.css", ifrVisualizacao.find('head'), ifrVisualizacao);
    loadStylePro((localStorage.getItem('seiSlim') ? URL_SPRO+"css/fontawesome.pro.min.css" : URL_SPRO+"css/fontawesome.min.css"), ifrVisualizacao.find('head'), ifrVisualizacao);
    loadScriptMonitoradoTag(ifrVisualizacao);
}
function monitoradosLabelOptions(id_procedimento) {
    var storeMonitorados = getStoreMonitoradoPro();
    var value = jmespath.search(storeMonitorados.monitorados, "[?id_procedimento=='"+id_procedimento+"'] | [0]");
    var value = (value !== null) ? value : false;   
    var config = (value && typeof value.configdate !== 'undefined' && value.configdate !== null) ? value.configdate : '';
    var tagsMonitorado = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? value.etiquetas : false;
        tagsMonitorado = (tagsMonitorado && tagsMonitorado.length > 0) ? value.etiquetas.join(';') : '';
    var tagsMonitoradoHtml = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? $.map(value.etiquetas, function (i) { return getHtmlEtiqueta(i,'monitorado') }).join('') : '';

    var monitoradosOptions = '       <table style="font-size: 10pt;width: 100%;min-width: 610px;" class="seiProForm">'+
                            '          <tr data-id_procedimento="'+id_procedimento+'" data-index="0">'+
                            '              <td style="vertical-align: bottom; text-align: left;" class="label">'+
                            '                   <label for="categoria_monitorado"><i class="iconPopup iconSwitch fas fa-layer-group cinzaColor"></i>Categoria:</label>'+
                            '               </td>'+
                            '               <td>'+
                            '                   '+selectCategoryMonitorado((value ? value.categoria : ''), 'parent.changeCategoryMonitorado', true, id_procedimento).replace('<select ', '<select id="categoria_monitorado" ')+
                            '               </td>'+
                            '               <td style="vertical-align: bottom;" class="label">'+
                            '                   <label class="last" for="monitoradoPrazoSend"><i class="iconPopup iconSwitch fas fa-stopwatch cinzaColor" style="float: initial;"></i>Prazo:</label>'+
                            '               </td>'+
                            '               <td>'+
                            '                   <span class="info_dates_monitorado_txt">'+
                            '                       <input id="monitoradoPrazoSend" value="'+(config && typeof config.date !== 'undefined' && config.date !== null ? config.date : '')+'" style="width: 120px; background-color: #f9fafa;" onblur="parent.showDatesMonitorado(this, \'hide\')" onkeypress="parent.keyDatesMonitorado(event)" type="date" class="monitoradoDatesPro" name="monitoradoPrazoSend">'+
                            '                       <a class="newLink monitoradoConfigDates" onclick="parent.openBoxConfigDates(this)" style="padding: 5px 8px;margin: 8px 2px 0 10px;font-size: 10pt;" onmouseover="return infraTooltipMostrar(\'Op\u00E7\u00F5es\');" onmouseout="return infraTooltipOcultar();">'+
                            '                          <i class="fas fa-cog" style="font-size: 100%;"></i>'+
                            '                       </a>'+
                            '                   </span>'+
                            '               </td>'+
                            '          </tr>'+
                            '          <tr data-id_procedimento="'+id_procedimento+'" data-index="0" style="height: 40px;">'+
                            '               <td align="left" class="tdmonitorado_tags" data-etiqueta-mode="monitorado" colspan="4">'+
                            '                   <span class="info_tags_follow">'+tagsMonitoradoHtml+
                            '                   </span>'+
                            '                   <span class="info_tags_follow_txt" style="display:none;margin-top: -8px !important;">'+
                            '                       <input value="'+tagsMonitorado+'" class="monitoradoTagsPro" name="monitoradoTagsPro">'+
                            '                   </span>'+
                            '                   <a class="newLink followLinkTagsAdd_send" style="font-size: 10pt;" onclick="parent.showFollowEtiqueta(this, \'show\', \'monitorado\')" onmouseout="return infraTooltipOcultar();"><i class="fas fa-tags" style="font-size: 100%;"></i> Adicionar etiqueta</a>'+
                            '               </td>'+
                            '          </tr>'+
                            '       </table>';
    return monitoradosOptions;
}
function loadScriptMonitoradoTag(iFrame) {
    var scriptText =    '<script data-config="config-seipro-monitorado">\n'+
                        '   function initMonitoradoTagIframe(TimeOut = 9000) {\n'+
                        '       if (TimeOut <= 0) { return; }\n'+
                        '       if (typeof $().tagsInput !== \'undefined\') {\n'+
                        '           getMonitoradoTagIframe();\n'+
                        '       } else {\n'+
                        '           $.getScript(\''+URL_SPRO+'js/lib/jquery.tagsinput-revisited.js\');\n'+
                        '           setTimeout(function(){\n'+
                        '               initMonitoradoTagIframe(TimeOut - 100);\n'+
                        '               console.log(\'Reload initMonitoradoTagIframe\');\n'+
                        '           }, 500);\n'+
                        '       }\n'+
                        '   }\n'+
                        '   function getMonitoradoTagIframe() {\n'+
                        '       $(\'.monitoradoTagsPro\').tagsInput({\n'+
                        '           interactive: true,\n'+
                        '           placeholder: \'Adicionar etiqueta\',\n'+
                        '           minChars: 2,\n'+
                        '           maxChars: 100,\n'+
                        '           limit: 8,\n'+
                        '           autocomplete_url: \'\',\n'+
                        '           autocomplete: {\'source\': parent.sugestEtiquetaPro(\'monitorado\') },\n'+
                        '           hide: true,\n'+
                        '           delimiter: [\';\'],\n'+
                        '           unique: true,\n'+
                        '           removeWithBackspace: true,\n'+
                        '           onAddTag: parent.saveFollowEtiqueta,\n'+
                        '           onRemoveTag: parent.saveFollowEtiqueta,\n'+
                        '           onChange: parent.saveFollowEtiqueta\n'+
                        '         });\n'+
                        '   }\n'+
                        '   initMonitoradoTagIframe();\n'+
                        '</script>';
    $(scriptText).appendTo(iFrame.find('head'));
}
function checkPageMonitoradosVisualizacao() {
    waitLoadPro($($ifrVisualizacao).contents(), '#frmAtividadeListar[action*="acao=procedimento_enviar"]', infraBarraComandos, getMonitoradosEnviarProcesso);
}
function removeMonitorado(this_) { 
    var storeMonitorados = getStoreMonitoradoPro();
    var index = parseInt($(this_).closest('tr').data('index'));
    if (typeof index && parseInt(index) >= 0) {
        storeMonitorados['monitorados'].splice(parseInt(index),1);
        $(this_).closest('tr').trigger('click').effect('highlight').effect('highlight').fadeOut( "slow", function() {
            $(this).remove();
            updateIndexTableMonitorado();
            updateCountTableMonitorado();
            persistMonitoradoStore(storeMonitorados);
        });
    }
}
function updateIndexTableMonitorado() {
    $('.tableFollow').find('tbody tr').each(function(index){
        $(this).data('index', index);
    });
}
function setSingleMap(id_procedimento, readonly = false) {
    var storeMonitorados = getStoreMonitoradoPro();
    var value = jmespath.search(storeMonitorados.monitorados, "[?id_procedimento=='"+id_procedimento+"'] | [0]");
        value = (value !== null) ? value : false;
    var latlng = (value !== null && typeof value.latlng !== 'undefined' && value.latlng !== null && value.latlng.length > 0 && value.latlng[0] !== null && value.latlng[1] !== null) ? value.latlng : false;
    var latlng_monitorado = (latlng) ? latlng : [-15.800909532800379, -47.861289633438];

    function onLocationFound(e) {
        // if position defined, then remove the existing position marker and accuracy circle from the map
        map.eachLayer((layer) => {
            if(layer['_latlng'] != undefined) layer.remove();
        });
        if (current_position) {
            map.removeLayer(current_position);
        }
        var radius = e.accuracy / 2;
            current_position = L.marker(e.latlng).addTo(map).bindPopup("Sua localiza\u00E7\u00E3o em um raio de " + radius + " metros deste ponto").openPopup();
            clearLocationUser();
            markers = e.latlng;
    }
    function onLocationError(e) {
        monitoradoLocationDenied = true;
        clearLocationUser();
    }
    // wrap map.locate in a function    
    function locate() {
        var htmlLoadingLocation =   '<div class="loadingLocation" style="color: #888;position: absolute;z-index: 9999;right: 0;padding: 5px 15px 5px 10px;background-color: #fff;border-bottom-left-radius: 5px;font-size: 10pt;">'+
                                    '   <i class="fas fa-spinner fa-spin"></i>'+
                                    '   Carregando sua localiza\u00E7\u00E3o'+
                                    '   <i class="fas fa-times-circle" onclick="clearLocationUser()"></i>'+
                                    '</div>';
        $('.loadingLocation').remove();
        $('#mapid').before(htmlLoadingLocation);
        map.locate({setView: true, maxZoom: 16});
    }

    markersLayer = new L.LayerGroup();
    map = L.map('mapid').setView(latlng_monitorado, 16);
    configureLeafletAssets();

    var geocoder = L.Control.Geocoder.nominatim();
    if (typeof URLSearchParams !== 'undefined' && location.search) {
        // parse /?geocoder=nominatim from URL
        var params = new URLSearchParams(location.search);
        var geocoderString = params.get('geocoder');
        if (geocoderString && L.Control.Geocoder[geocoderString]) {
            console.log('Using geocoder', geocoderString);
            geocoder = L.Control.Geocoder[geocoderString]();
        } else if (geocoderString) {
            console.warn('Unsupported geocoder', geocoderString);
        }
    }
    var control = L.Control.geocoder({
        placeholder: 'Localizar...',
        geocoder: geocoder
    }).addTo(map).on('markgeocode', function(e) {
        map.eachLayer((layer) => {
            if(layer['_latlng'] != undefined) layer.remove();
        });
        var result = e.geocode.bbox.getCenter();
        var marker = L.marker([result.lat, result.lng]).addTo(map);
            marker.bindPopup(e.geocode.html).openPopup();
            markers = result;
    });

    // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '<a href="https://seipro.app" target="_blank">SEI Pro</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    var marker = L.marker(latlng_monitorado).addTo(map);
    markers = marker._latlng;
    if (value && latlng) {
        var linkProc = $('#monitoradoTablePro tbody tr[data-id_procedimento="'+id_procedimento+'"] .followLinkProcesso')[0].outerHTML;
        marker.bindPopup('<b>'+linkProc+'</b><br>'+((typeof escapeHtml === 'function') ? escapeHtml(value.descricao) : value.descricao)).openPopup();
    }
    
    if (!readonly) {   
        map.on('click', addMarker);
        if (latlng === false && !monitoradoLocationDenied) {
            locationUser = setInterval(locate, 3000);
            map.on('locationfound', onLocationFound);
            map.on('locationerror', onLocationError);
        }
    }

}
function addMarker(e){
    clearLocationUser();
    map.eachLayer((layer) => {
        if(layer['_latlng'] != undefined) layer.remove();
    });
    // Add marker to map at click location; add popup window
    var newMarker = new L.marker(e.latlng).addTo(map);
    markers = e.latlng;

    setTimeout(function(){ 
        map.panTo(new L.LatLng(e.latlng.lat, e.latlng.lng));
    }, 500);
}
function clearLocationUser() {
    $('.loadingLocation').remove();
    clearInterval(locationUser);
    locationUser = false;
}
function openBoxSingleMap(this_, readonly = false) {
    monitoradoLocationDenied = false;
    var _this = $(this_);
    var id_procedimento = _this.closest('tr').data('id_procedimento');
    var buttons = (readonly) 
        ? null
        : [{
            text: "Remover",
            icon: 'ui-icon-trash',
            click: function() {
                saveConfigMapsMonitorado(id_procedimento, 'remove');
                resetDialogBoxPro('dialogBoxPro');
            }
        },{
            text: "Salvar",
            class: 'confirm ui-state-active',
            click: function() {
                saveConfigMapsMonitorado(id_procedimento);
                resetDialogBoxPro('dialogBoxPro');
            }
        }];
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div id="mapid" style="width: 600px; height: 400px;"></div>')
        .dialog({
            title: "Processos Monitorados: Mapa",
            width: 620,
            close: function(){
                clearLocationUser();
                setTimeout(function(){ 
                    markers = [];
                }, 1000);
            },
            open: function(){
                setSingleMap(id_procedimento, readonly);
            },
            buttons: buttons
    });
}
function openBoxMultipleMap() {
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div id="mapid" style="width: 900px; height: 600px;"></div>')
        .dialog({
            title: "Processos Monitorados: Mapa",
            width: 920,
            open: function(){
                setMultipleMap();
            }
    });
}
function setMultipleMap() {
    var marker_list = [];
    var storeMonitorados = getStoreMonitoradoPro();
    var listMonitorado = jmespath.search(storeMonitorados.monitorados, "[?not_null(latlng)]");
        listMonitorado = (typeof listMonitorado !== 'undefined' && listMonitorado !== null && listMonitorado.length > 0) ? listMonitorado : false;
    if (listMonitorado) {
        markersLayer = new L.LayerGroup();
        map = L.map('mapid').setView(listMonitorado[0].latlng, 16);

        var geocoder = L.Control.Geocoder.nominatim();
        if (typeof URLSearchParams !== 'undefined' && location.search) {
            // parse /?geocoder=nominatim from URL
            var params = new URLSearchParams(location.search);
            var geocoderString = params.get('geocoder');
            if (geocoderString && L.Control.Geocoder[geocoderString]) {
                console.log('Using geocoder', geocoderString);
                geocoder = L.Control.Geocoder[geocoderString]();
            } else if (geocoderString) {
                console.warn('Unsupported geocoder', geocoderString);
            }
        }
        var control = L.Control.geocoder({
            placeholder: 'Localizar...',
            defaultMarkGeocode: false,
            geocoder: geocoder
        }).addTo(map).on('markgeocode', function(e) {
            var result = e.geocode.bbox.getCenter();
            var result_latlng = [result.lat, result.lng];
            var marker = L.marker(result_latlng).addTo(map);
                marker.bindPopup(e.geocode.html).openPopup();
                L.DomUtil.addClass(marker._icon, 'markerSearch');
                map.fitBounds([result_latlng]).setZoom(13);
        });


        // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '<a href="https://seipro.app" target="_blank">'+NAMESPACE_SPRO+'</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(map);
        $.each(listMonitorado,function(index, value){
            var marker = L.marker(value.latlng).addTo(map).on('click', openMarkerMonitorado);
            var linkProc = $('#monitoradoTablePro tbody tr[data-id_procedimento="'+value.id_procedimento+'"] .followLinkProcesso')[0].outerHTML;
                marker.bindPopup('<b>'+linkProc+'</b><br>'+((typeof escapeHtml === 'function') ? escapeHtml(value.descricao) : value.descricao));
                marker_list.push([marker._latlng.lat, marker._latlng.lng]);
                marker.monitorados = value;
        });
        map.fitBounds(marker_list);
        marker = false;
    }
}
function openMarkerMonitorado(e){
    var value = e.target.monitorados;
    $('#monitoradoTablePro').find('#lnkInfraCheck').data('index',1).trigger('click');
    scrollToElement($('#monitoradosProDiv .tabelaPanelScroll'), $('#monitoradoTablePro tbody tr[data-id_procedimento="'+value.id_procedimento+'"]'), 30);
    $('#monitoradoPro_'+value.id_procedimento).trigger('click');
}
function saveConfigMapsMonitorado(id_procedimento, mode = 'add'){
    if (typeof markers === 'object' && markers.lat !== null && markers.lng !== null) {
        var storeMonitorados = getStoreMonitoradoPro();
        var monitoradoIndex = findMonitoradoIndex(storeMonitorados, id_procedimento);
        if (monitoradoIndex >= 0) {
            var item = storeMonitorados.monitorados[monitoradoIndex];
                item.latlng = (mode == 'remove') ? null : [markers.lat, markers.lng];
            storeMonitorados.monitorados[monitoradoIndex] = item;
            persistMonitoradoStore(storeMonitorados);
            setPanelMonitorados('refresh');
            markers = [];
            setTimeout(function(){ 
                alertaBoxPro('Sucess', 'check-circle', 'Mapa '+(mode == 'remove' ? 'removido' : 'adicionado')+' com sucesso!');
            }, 500);
        }
    }
}
