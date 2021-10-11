var statusLoadRemoteFile = true;
var map;
var markers = [];
var markersLayer = false;
var locationUser = false;
var current_position = false;
// ADICIONA ACOMPANHAMENTO DE PROCESSOS
function getOptionsConfigDate(index) {
    var storeFavorites = getStoreFavoritePro();
    var configdate = (!$.isEmptyObject(storeFavorites['favorites'][index]['configdate'])) 
                        ? storeFavorites['favorites'][index]['configdate']
                        : {
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
    return configdate;
}
function openBoxConfigDates(this_) {
    var _this = $(this_);
    var index = parseInt(_this.closest('tr').data('index'));
    var id_procedimento = parseInt(_this.closest('tr').data('id_procedimento'));
    var storeFavorites = getStoreFavoritePro();
    var favoriteIndex = storeFavorites.favorites.findIndex((obj => obj.id_procedimento == id_procedimento));
    var dateInput = _this.closest('.info_dates_fav_txt').find('.favoriteDatesPro').val().trim();
    var date_ = (dateInput == '') ? moment().format('YYYY-MM-DD') : dateInput;
    var configdate = getOptionsConfigDate(favoriteIndex);
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
    var arrayItemFavorite = storeFavorites['favorites'][favoriteIndex];
    var favoriteDocList = arrayItemFavorite['documentos'];

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
                    '                  <label class="onoffswitch-label" for="configDatesBox_selectdoc"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px; '+stateSelectDocDiv+'" class="configDates_selectdoc">'+
                    '          <td colspan="2">'+
                    '               <select onchange="configDatesSetUpdate(\'update\')" id="configDatesBox_listdocs">';
        if (typeof favoriteDocList !== 'undefined' && favoriteDocList !== null && favoriteDocList.length > 0) {
            $.each(favoriteDocList, function(i,value){
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
                    '                  <label class="onoffswitch-label" for="configDatesBox_setdate"></label>'+
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
                    '                  <label class="onoffswitch-label" for="configDatesBox_countdown"></label>'+
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
                    '                  <label class="onoffswitch-label" for="configDatesBox_countdays"></label>'+
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
                    '                  <label class="onoffswitch-label" for="configDatesBox_workday"></label>'+
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
                    '                  <label class="onoffswitch-label" for="configDatesBox_newdoc"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '      <tr class="configDates_newdoc"><td colspan="2"><span id="configDatesBox_newdoclist">'+htmlNewDocList+'</span></td></tr>'+
                    '      <tr style="height: 40px; '+stateNewDocDiv+'" class="configDates_newdoc">'+
                    '          <td colspan="2">'+
                    '               <select id="configDatesBox_listnewdoc" onchange="configDatesDocsChange(this)">'+
                    '                   <option value="0">Qualquer tipo de documento</option>';
        if (storeFavorites['config']['tiposdocs'].length > 0) {
            $.each(storeFavorites['config']['tiposdocs'], function(i,value){
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
                    '                  <label class="onoffswitch-label" for="configDatesBox_duedate"></label>'+
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
                    '                  <label class="onoffswitch-label" for="configDatesBox_duesetdate"></label>'+
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
                title: "Favoritos: Op\u00E7\u00F5es",
                width: 500,
                close: function() { $('#configDatesBox').remove() },
                buttons: [{
                    text: "Ok",
                    click: function() {
                        saveConfigDatesFav(this_);
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
        getDadosIframeProcessoPro(String(id_procedimento), 'favorites');
        initDadosSelectDoc(id_procedimento);
    }
    console.log(_this, id_procedimento);
}
function initDadosSelectDoc(id_procedimento, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof dadosProcessoPro !== 'undefined' && 
        dadosProcessoPro && 
        Object.keys(dadosProcessoPro).length > 0 && 
        dadosProcessoPro.constructor === Object && 
        typeof dadosProcessoPro.listAndamento !== 'undefined' &&
        dadosProcessoPro.listAndamento !== null &&
        dadosProcessoPro.hasOwnProperty('listAndamento') &&
        typeof dadosProcessoPro.listAndamento.id_procedimento !== 'undefined' &&
        dadosProcessoPro.listAndamento.id_procedimento !== null &&
        dadosProcessoPro.listAndamento.hasOwnProperty('id_procedimento') &&
        dadosProcessoPro.listAndamento.id_procedimento == id_procedimento
        ) { 
        updateSelectFavorites(id_procedimento);
    } else {
        setTimeout(function(){ 
            initDadosSelectDoc(id_procedimento, TimeOut - 100); 
            console.log('Reload initDadosSelectDoc'); 
        }, 500);
    }
}
function updateSelectFavorites(id_procedimento) {
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
        updateArraySelectFavorites(id_procedimento);
    }
}
function updateArraySelectFavorites(id_procedimento) {
    var storeFavorites = getStoreFavoritePro();
    if (typeof storeFavorites !== 'undefined' && storeFavorites.hasOwnProperty('favorites')) {
        var favoriteIndex = storeFavorites.favorites.findIndex((obj => obj.id_procedimento == id_procedimento));
        if (typeof favoriteIndex !== 'undefined' && favoriteIndex !== null) {
            var item = storeFavorites.favorites[favoriteIndex];
                item.documentos = dadosProcessoPro.listDocumentosAssinados;
                item.andamento = dadosProcessoPro.listAndamento.andamento;
                storeFavorites.favorites[favoriteIndex] = item;
                localStorageStorePro('configDataFavoritesPro', storeFavorites);
                saveConfigFav();
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
function getConfigDatetimeFav() {
    var storeFavorites = getStoreFavoritePro();
    var config = storeFavorites.config;
        config.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        storeFavorites.config = config;
        localStorageStorePro('configDataFavoritesPro', storeFavorites);
    return storeFavorites;
}
function saveConfigFav() {
    var storeFavorites = getConfigDatetimeFav();
    if (typeof storeFavorites !== 'undefined' && storeFavorites.hasOwnProperty('favorites')) {
        var sendFavorites = {favorites: [], config: {colortags: []}};
            sendFavorites.favorites = jmespath.search(storeFavorites.favorites, "[*].{id_procedimento: id_procedimento, assuntos: assuntos, descricao: descricao, interessados: interessados, processo: processo, tipo_procedimento: tipo_procedimento, categoria: categoria, order: order, etiquetas: etiquetas, configdate: configdate}");
            sendFavorites.config.colortags = storeFavorites.config.colortags;
        if (typeof perfilLoginAtiv !== 'undefined' && perfilLoginAtiv !== null) {
            var action = 'set_favoritos';
            var param = {
                config: encodeURIComponent(encodeJSON_toHex(JSON.stringify(sendFavorites))),
                action: action
            };
            getServerAtividades(param, action);
            setLocalFilePro(getStoreFavoritePro());
        } else {
            console.log('OK');
        }
    }
}
function actionFavoriteCheckbox(this_) {
    var _this = $(this_);
    var optionsDiv = _this.closest('.infraDivCheckbox').find('.favoritosLabelOptions');
    if (_this.is(':checked')) {
        actFavoritePro(false, 'add');
        optionsDiv.slideDown();
    } else {
        actFavoritePro(false, 'remove');
        optionsDiv.slideUp();
        optionsDiv.find('.selectPro').val('');
        optionsDiv.find('#favoritePrazoSend').val('');
        optionsDiv.find('.favoriteTagsPro').val('');
        optionsDiv.find('.info_tags_follow').html('');
        optionsDiv.find('div.tagsinput .tag').remove();
    }
}
function saveConfigDatesFav(this_) {
    var _this = $(this_);
    var config = getConfigDatesFav();
    var storeFavorites = getStoreFavoritePro();
    var id_procedimento = parseInt($('#configDatesBox_id_procedimento').val().trim());
    var favoriteIndex = storeFavorites.favorites.findIndex((obj => obj.id_procedimento == id_procedimento));
    if (favoriteIndex >=0 && typeof storeFavorites['favorites'][favoriteIndex] !== undefined && typeof getConfigDatesFav() !== undefined) {
        //console.log(config);
        var htmlDatePreview = getDatesPreview(config);
        var trFavorite = _this.closest('table').find('tr[data-id_procedimento="'+id_procedimento+'"]');
        
        if ($(this_).closest('#frmAtividadeListar').length == 0) {
            trFavorite.find('.info_dates_fav').html(htmlDatePreview).show().closest('td').find('.info_dates_fav_txt').hide();
            trFavorite.find('.followLinkDatesEdit').show();
        }
        $('#configDatesBox').remove();
        trFavorite.find('.favoriteDatesPro').val(config.date);
        storeFavorites['favorites'][favoriteIndex]['configdate'] = config;
        localStorageStorePro('configDataFavoritesPro', storeFavorites);
        alertaBoxPro('Sucess', 'check-circle', 'Contagem de tempo cadastrada com sucesso!');
        resetDialogBoxPro('iframeBoxPro');
        saveConfigFav();
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao cadastrar!');
    }
}
function getConfigDatesFav() {
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
function configSwitchChange(this_, option1, option2, option3) {
    var data_this = $(this_).data();
    if (data_this.type == option1 && $(this_).is(':checked')) {
        $('#configDatesBox_'+option2).prop('checked', false);
        $('#configDatesBox_'+option2).closest('tr').find('.iconSwitch').removeClass('azulColor');
        if (option3) { 
            $('#configDatesBox_'+option3).prop('checked', false); 
            $('#configDatesBox_'+option3).closest('tr').find('.iconSwitch').removeClass('azulColor');
        }
        $('.configDates_'+option1).fadeIn('slow');
        $('.configDates_'+option2).fadeOut('slow');
        if (option3) { $('.configDates_'+option3).fadeOut('slow'); }
    } else if (data_this.type == option1 && !$(this_).is(':checked')) {
        $('#configDatesBox_'+option2).prop('checked', true);
        $('#configDatesBox_'+option2).closest('tr').find('.iconSwitch').addClass('azulColor');
        if (option3) { 
            $('#configDatesBox_'+option3).prop('checked', false); 
            $('#configDatesBox_'+option3).closest('tr').find('.iconSwitch').removeClass('azulColor');
        }
        $('.configDates_'+option2).fadeIn('slow');
        $('.configDates_'+option1).fadeOut('slow');
        if (option3) { $('.configDates_'+option3).fadeOut('slow'); }
    } else if (data_this.type == option2 && !$(this_).is(':checked')) {
        $('#configDatesBox_'+option1).prop('checked', true);
        $('#configDatesBox_'+option1).closest('tr').find('.iconSwitch').addClass('azulColor');
        if (option3) { 
            $('#configDatesBox_'+option3).prop('checked', false); 
            $('#configDatesBox_'+option3).closest('tr').find('.iconSwitch').removeClass('azulColor');
        }
        $('.configDates_'+option1).fadeIn('slow');
        $('.configDates_'+option2).fadeOut('slow');
        if (option3) { $('.configDates_'+option3).fadeOut('slow'); }
    } else if (data_this.type == option2 && $(this_).is(':checked')) {
        $('#configDatesBox_'+option1).prop('checked', false);
        $('#configDatesBox_'+option1).closest('tr').find('.iconSwitch').removeClass('azulColor');
        if (option3) { 
            $('#configDatesBox_'+option3).prop('checked', false); 
            $('#configDatesBox_'+option3).closest('tr').find('.iconSwitch').removeClass('azulColor');
        }
        $('.configDates_'+option1).fadeOut('slow');
        $('.configDates_'+option2).fadeIn('slow');
        if (option3) { $('.configDates_'+option3).fadeOut('slow'); }
    } else if (option3 && data_this.type == option3 && !$(this_).is(':checked')) {
        $('#configDatesBox_'+option2).prop('checked', true);
        $('#configDatesBox_'+option2).closest('tr').find('.iconSwitch').addClass('azulColor');
        $('#configDatesBox_'+option1).prop('checked', false);
        $('#configDatesBox_'+option1).closest('tr').find('.iconSwitch').removeClass('azulColor');
        $('.configDates_'+option2).fadeIn('slow');
        $('.configDates_'+option1).fadeOut('slow');
        $('.configDates_'+option3).fadeOut('slow');
    } else if (option3 && data_this.type == option3 && $(this_).is(':checked')) {
        $('#configDatesBox_'+option1).prop('checked', false);
        $('#configDatesBox_'+option1).closest('tr').find('.iconSwitch').removeClass('azulColor');
        $('#configDatesBox_'+option2).prop('checked', false);
        $('#configDatesBox_'+option2).closest('tr').find('.iconSwitch').removeClass('azulColor');
        $('.configDates_'+option1).fadeOut('slow');
        $('.configDates_'+option2).fadeOut('slow');
        $('.configDates_'+option3).fadeIn('slow');
    }
    if ($(this_).is(':checked')) { 
        $(this_).closest('tr').find('.iconSwitch').addClass('azulColor');
    } else {
        $(this_).closest('tr').find('.iconSwitch').removeClass('azulColor');
    }
}
function updateCountTableFav() {
    var count = $('.tableFollow').find('tbody').find('tr:visible').length;
    var countTxt = (count == 1) ? count+' registro:' : count+' registros:';
        $('.tableFollow').find('caption.infraCaption').text(countTxt);
}
function getStoreFavoritePro() {
    return ( typeof localStorageRestorePro('configDataFavoritesPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataFavoritesPro')) ) ? localStorageRestorePro('configDataFavoritesPro') : {favorites: [], config: {colortags: []} };
}
function insertIconFavorites() {
    waitLoadPro($('#ifrArvore').contents(), '#topmenu', "a[target='ifrVisualizacao']", appendIconFavorites);
}
function appendIconFavorites() {
    var ifrArvore = $('#ifrArvore').contents(); 
    var iconProc = ifrArvore.find('#topmenu a[target="ifrVisualizacao"]').eq(0);
    var id_procedimento = String(getParamsUrlPro(iconProc.attr('href')).id_procedimento);
    var iconStar = htmlIconFavorites(id_procedimento);
    ifrArvore.find('.iconFavoritePro').remove();
    ifrArvore.find('#topmenu a[target="ifrVisualizacao"]').eq(0).after(iconStar);    
}
function actFavoritePro(this_, mode) {
    if (this_) {
        var _this = $(this_);
        var id_procedimento = _this.data('id_procedimento');
        var ifrArvore = false;
        var ifrVisualizacao = false;
    } else {
        var _this = false;
        var ifrArvore = $('#ifrArvore').contents(); 
        var ifrVisualizacao = $('#ifrVisualizacao').contents(); 
        var iconProc = ifrArvore.find('#topmenu a[target="ifrVisualizacao"]').eq(0);
        var id_procedimento = String(getParamsUrlPro(iconProc.attr('href')).id_procedimento);
    }
    checkDataFavoritePro(this_, mode, id_procedimento);

    if (mode == 'add' && ifrVisualizacao && ifrVisualizacao.find('#frmAtividadeListar').length == 0 && ifrArvore && ifrArvore.length > 0) {
        var htmlBox = favoritosLabelOptions(id_procedimento);
        var htmlSucess =    '<strong class="iframeSucessPro" style="background-color: #f9efad;font-size: 10pt;padding: 10px;border-radius: 5px;margin: 0 0 10px 0;display: block;color: #404040;">'+
                            '   <i class="fas fa-check-circle azulColor" style="margin-right: 5px;"></i>'+
                            '   Processo adicionado com sucesso no painel de processos favoritos (p\u00E1gina incial do SEI)'+
                            '</strong>';
        resetDialogBoxPro('iframeBoxPro');
        iframeBoxPro = $('#iframeBoxPro')
            .html('<div class="dialogBoxDiv">'+htmlSucess+htmlBox+'</div>')
            .dialog({
                title: 'Op\u00E7\u00F5es: Favoritos',
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
function checkDataFavoritePro(this_, mode, id_procedimento, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (mode == 'remove' || (typeof dadosProcessoPro !== 'undefined' && dadosProcessoPro.hasOwnProperty('listAndamento') && dadosProcessoPro.hasOwnProperty('propProcesso') && dadosProcessoPro.hasOwnProperty('tiposDocumentos'))) { 
        storeFavoritePro(mode, id_procedimento);
    } else {
        setTimeout(function(){ 
            var target = (this_) ? $(this_) : $('#ifrArvore').contents().find('#iconFavoritePro_'+id_procedimento);
            target.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
            console.log('Reload checkDataFavoritePro', TimeOut); 
            if (TimeOut == 9000 && mode == 'add') {
                getDadosIframeProcessoPro(id_procedimento, 'favorites');
            }
            checkDataFavoritePro(this_, mode, id_procedimento, TimeOut - 100);
        }, 500);
    }
}
function storeFavoritePro(mode, id_procedimento) {
    if (mode == 'add') {
        var storeFavorites = addFavoritePro();
    } else {
        var storeFavorites = removeFavoritePro(id_procedimento);
    }
    if (typeof dadosProcessoPro !== 'undefined' && dadosProcessoPro.hasOwnProperty('tiposDocumentos') && dadosProcessoPro.tiposDocumentos.length > 0 ) { storeFavorites['config']['tiposdocs'] = dadosProcessoPro.tiposDocumentos; }
    localStorageStorePro('configDataFavoritesPro', storeFavorites);
    saveConfigFav();
    appendIconFavorites();
    if ($('#ifrArvore').length == 0) {
        console.log('### addFavoritePro', mode, storeFavorites); 
        if ($('#favoritesPro').length == 0) {
                setPanelFavorites('insert');
        } else {
            if (typeof storeFavorites.favorites === 'undefined' || storeFavorites.favorites === null || storeFavorites.favorites.length == 0) {
                $('#favoritesPro').remove();
                appendStarOnProcess();
            } else {
                setPanelFavorites('refresh');
            }
        }
        dadosProcessoPro = {};
    }
}
function removeFavoritePainelPro(this_, id_procedimento = 0) {
    confirmaBoxPro('Tem certeza que deseja remover esse processo dos favoritos?', function(){
        if (id_procedimento == 0) {
            $('#favoriteTablePro').find('input[name="favoritePro"]:checked').each(function(){
                var id_procedimento = $(this).val().trim();
                removeFavoritePainelPro_(this, id_procedimento);
            });
            setTimeout(function(){ 
                $(this_).hide();
            }, 500);
        } else {
            removeFavoritePainelPro_(this_, id_procedimento);
        }
    });
}
function removeFavoritePainelPro_(this_, id_procedimento) {
    var _this = $(this_);
    var storeFavorites = removeFavoritePro(id_procedimento);
    localStorageStorePro('configDataFavoritesPro', storeFavorites);
    saveConfigFav();
    _this.closest('tr').slideUp();
}
function updateFavorites(this_) {
    $(this_).find('i').addClass('fa-spin');
    setPanelFavorites('refresh');
    initChosenReplace('panel', this_);
}
function removeFavoritePro(id_procedimento) {
    var storeFavorites = getStoreFavoritePro();
    for (i = 0; i < storeFavorites['favorites'].length; i++) {
        if( storeFavorites['favorites'][i]['id_procedimento'] == id_procedimento) {
            console.log('notinclude', i, storeFavorites['favorites'][i]['id_procedimento'], storeFavorites['favorites'][i]['processo']);
            storeFavorites['favorites'].splice(i,1);
            i--;
        }
    }
    return storeFavorites;
}
function editCategoryFavorite(this_, id_procedimento) {
    var _this = $(this_);
    var storeFavorites = getStoreFavoritePro()['favorites'];
    var category_elem = _this.closest('td').find('.info_category');
    var category_txt = _this.closest('td').find('.info_category_txt');
    if (category_elem.is(':visible')) {
        category_elem.hide();
        category_txt.show();
        _this.find('i').attr('class','fas fa-pencil-alt');
    } else {
        var value = jmespath.search(storeFavorites, "[?id_procedimento=='"+id_procedimento+"'] | [0]");
        var categoriaLista = selectCategoryFavorite(value.categoria, 'changeCategoryFavorite', true, id_procedimento);
        category_elem.show().html(categoriaLista);
        category_txt.hide();
        _this.find('i').attr('class','fas fa-thumbs-up');
    }
}
function selectCategoryFavorite(select = '', func = false, newItem = false, id_procedimento = 0) {
    var storeFavorites = getStoreFavoritePro()['favorites'];
    var listaCategorias = jmespath.search(storeFavorites,"[*].categoria");
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
function changePanelCategoryFavorite(this_) {
    var _this = $(this_);
    setOptionsPro('panelFavoritosView', _this.val().trim());
    setPanelFavorites('refresh');
}
function changeCategoryFavorite(this_) {
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
                        saveCategoryFavorite(this_, $('#nomeNovoItem').val().trim());
                    }
                }]
        });
    } else {
        saveCategoryFavorite(this_, _this.val().trim());
    }
}
function saveCategoryFavorite(this_, value) {
    var _this = $(this_);
    var data = _this.data();
    var id_procedimento = data.id;
    var storeFavorites = getStoreFavoritePro();
    var favoriteIndex = storeFavorites.favorites.findIndex((obj => obj.id_procedimento == id_procedimento));
    if (typeof favoriteIndex !== 'undefined' && favoriteIndex !== null) {
            var item = storeFavorites.favorites[favoriteIndex];
                item.categoria = value;
            storeFavorites.favorites[favoriteIndex] = item;
    }
    localStorageStorePro('configDataFavoritesPro', storeFavorites);
    saveConfigFav();
    setPanelFavorites('refresh');
    if (alertBoxPro) {   
        alertBoxPro.dialog('close');
        resetDialogBoxPro('alertBoxPro');
    }
}
function addFavoritePro() {
    var storeFavorites = getStoreFavoritePro();
        storeFavorites['favorites'].push({
            id_procedimento: dadosProcessoPro.listAndamento.id_procedimento,
            processo: dadosProcessoPro.listAndamento.processo,
            andamento: dadosProcessoPro.listAndamento.andamento,
            documentos: dadosProcessoPro.listDocumentosAssinados,
            tipo_procedimento: dadosProcessoPro.propProcesso.hdnNomeTipoProcedimento,
            assuntos: dadosProcessoPro.propProcesso.selAssuntos_select,
            interessados: dadosProcessoPro.propProcesso.selInteressadosProcedimento,
            descricao: dadosProcessoPro.propProcesso.txtDescricao,
            order: -1,
            categoria: ''
        });
    return storeFavorites;
}
function setPanelFavorites(mode) {
    var statusView = ( getOptionsPro('favoritesProDiv') == 'hide' ) ? 'display:none;' : 'display: inline-table;';
    var statusIconShow = ( getOptionsPro('favoritesProDiv') == 'hide' ) ? '' : 'display:none;';
    var statusIconHide = ( getOptionsPro('favoritesProDiv') == 'hide' ) ? 'display:none;' : '';
    var storeFavorites = getStoreFavoritePro()['favorites'];
        storeFavorites = (checkObjHasProperty(storeFavorites, 'order')) ? jmespath.search(storeFavorites, "sort_by([*],&order)") : storeFavorites;
    var arrayProcessosUnidade = getProcessoUnidadePro();
    var selectedCategoryView = (getOptionsPro('panelFavoritosView')) ? getOptionsPro('panelFavoritosView') : '';

    var listFavorite = (selectedCategoryView != '') ? jmespath.search(storeFavorites, "[?categoria=='"+selectedCategoryView+"']") : storeFavorites;
    var countFavorite = (listFavorite.length == 1) ? listFavorite.length+' registro:' : listFavorite.length+' registros:';
    var checkMaps = (jmespath.search(storeFavorites, "length([?not_null(latlng)])") > 0) ? true : false;

    if (listFavorite !== null && listFavorite.length > 0) {
        var htmlTableFavorites =    '<table class="tableInfo tableZebra tableFollow tableFavoritos tabelaControle" data-name-table="Favoritos" data-tabletype="favoritos" id="favoriteTablePro">'+
                                    '   <caption class="infraCaption" style="text-align: left;">'+countFavorite+'</caption>'+
                                    '   <thead>'+
                                    '       <tr class="tableHeader">'+
                                    '           <th class="tituloControle" style="width: 50px;" align="center"><label class="lblInfraCheck" for="lnkInfraCheck" accesskey=";"></label><a id="lnkInfraCheck" onclick="getSelectAllTr(this, \'SemGrupo\');"><img src="/infra_css/imagens/check.gif" id="imgRecebidosCheck" title="Selecionar Tudo" alt="Selecionar Tudo" class="infraImg"></a></th>'+
                                    '           <th class="tituloControle" style="width: 210px;">Processo</th>'+
                                    '           <th class="tituloControle tituloFilter" data-filter-type="date" style="width: 150px;">Prazo</th>'+
                                    '           <th class="tituloControle tituloFilter" data-filter-type="etiqueta" style="width: 150px;">Etiqueta</th>'+
                                    '           <th class="tituloControle tituloFilter" data-filter-type="etiqueta" style="width: 80px;">Mapa</th>'+
                                    '           <th class="tituloControle">Especifica\u00E7\u00E3o</th>'+
                                    '           <th class="tituloControle">Tipo de Processo</th>'+
                                    '           <th class="tituloControle">Categoria</th>'+
                                    '           <th class="tituloControle" style="width: 50px;" align="center"><i class="fas fa-sort-numeric-up"></i></th>'+
                                    '       </tr>'+
                                    '   </thead>'+
                                    '   <tbody>';
            $.each(listFavorite,function(index, value){
                var linkDoc = url_host+'?acao=procedimento_trabalhar&id_procedimento='+value.id_procedimento;
                var tagsFav = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? (value.etiquetas.length > 0 ? value.etiquetas.join(';') : value.etiquetas[0]) : '';
                var tagsFavHtml = (typeof value.etiquetas !== 'undefined') ? $.map(listFavorite[index].etiquetas, function (i) { return getHtmlEtiqueta(i,'fav') }).join('') : '';
                var tagsFavClass = (typeof value.etiquetas !== 'undefined') ? $.map(listFavorite[index].etiquetas, function (i) { return 'tagTableName_'+removeAcentos(i).replace(/\ /g, '').toLowerCase(); }).join(' ') : '';   
                var datesFav = (typeof value.configdate !== 'undefined' && value.configdate !== null && typeof value.configdate.date !== 'undefined' && value.configdate.date !== null) ? value.configdate.date : '';
                if (typeof value.configdate !== 'undefined' && value.configdate !== null && typeof value.configdate.dateTo !== 'undefined' && value.configdate.dateTo !== null) { value.configdate.dateTo = moment().format('YYYY-MM-DD') }
                var datesFavHtml = (typeof value.configdate !== 'undefined' && value.configdate !== null) ? getDatesPreview(value.configdate) : ''; 
                var tagDatesFavClass = (datesFavHtml != '') ? 'tagTableName_'+$(datesFavHtml).data('tagname') : '';
                var iconProcesso = ( $.inArray(value.processo, arrayProcessosUnidade) == -1 ) ? 'fas fa-folder' : 'far fa-folder-open';
                var tipsProcesso = ( $.inArray(value.processo, arrayProcessosUnidade) == -1 ) ? 'Processo fechado nesta unidade' : 'Processo aberto nesta unidade';
                var issetOrder = (value.hasOwnProperty('order') && value.order !== null && value.order != -1) ? true : false;
                var order = (issetOrder) ? value.order : index;
                var categoria = (value.hasOwnProperty('categoria') && value.categoria !== null && value.categoria != '') ? value.categoria : false;
                var htmlIconsHome = ($('#P'+value.id_procedimento).find('td').eq(1).find('a').length > 0) ? $('#P'+value.id_procedimento).find('td').eq(1).find('a').map(function(v){ return this.outerHTML }).get().join('') : '';
                if (selectedCategoryView == '' || selectedCategoryView == categoria) {
                    htmlTableFavorites +=   '       <tr data-tagname="SemGrupo" data-index="'+index+'" data-id_procedimento="'+value.id_procedimento+'" class="'+tagsFavClass+' '+tagDatesFavClass+'">'+
                                            '           <td align="center"><input type="checkbox" onclick="followSelecionarItens(this)" id="favoritePro_'+value.id_procedimento+'" name="favoritePro" value="'+value.id_procedimento+'"></td>'+
                                            '           <td align="left">'+
                                            '               <a class="followLinkProcesso" style="text-decoration: underline; color: #00c;" href="'+linkDoc+'">'+
                                            '               <i class="'+iconProcesso+'" style="color: #00c;text-decoration: underline;"  onmouseover="return infraTooltipMostrar(\''+tipsProcesso+'\');" onmouseout="return infraTooltipOcultar();"></i> '+
                                            '               '+value.processo+'</a>'+
                                            '               <a class="newLink followLink followLinkNewtab" href="'+linkDoc+'" onmouseover="return infraTooltipMostrar(\'Abrir em nova aba\');" onmouseout="return infraTooltipOcultar();" target="_blank"><i class="fas fa-external-link-alt" style="font-size: 90%; text-decoration: underline;"></i></a>'+
                                            '               <div class="info_icons_fav">'+htmlIconsHome+'</div>'+
                                            '           </td>'+
                                            '           <td align="left" class="tdfav_dates '+((datesFavHtml.trim() == '' ) ? 'info_dates_follow_empty' : '')+'">'+
                                            '               <span class="info_dates_fav">'+datesFavHtml+
                                            '               </span>'+
                                            '               <a class="newLink followLink followLinkDates followLinkDatesEdit" onclick="showDatesFav(this, \'show\')" onmouseover="return infraTooltipMostrar(\'Editar prazo\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-pencil-alt" style="font-size: 100%;"></i></a>'+
                                            '               <a class="newLink followLink followLinkDates followLinkDatesAdd" onclick="showDatesFav(this, \'show\')" onmouseover="return infraTooltipMostrar(\'Adicionar prazo\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-stopwatch" style="font-size: 100%;"></i></a>'+
                                            '               <span class="info_dates_fav_txt" style="display:none;">'+
                                            '                   <input value="'+datesFav+'" onblur="showDatesFav(this, \'hide\')"  onkeypress="keyDatesFav(event)" type="date" class="favoriteDatesPro">'+
                                            '                   <a class="newLink" onclick="showDatesFav(this, \'hide\')" style="padding: 2px; margin: 0 2px;" onmouseover="return infraTooltipMostrar(\'Salvar\');" onmouseout="return infraTooltipOcultar();">'+
                                            '                      <i class="fas fa-thumbs-up" style="font-size: 100%;"></i>'+
                                            '                   </a>'+
                                            '                   <a class="newLink favoriteConfigDates" onclick="openBoxConfigDates(this)" style="padding: 2px; margin: 0 2px;" onmouseover="return infraTooltipMostrar(\'Op\u00E7\u00F5es\');" onmouseout="return infraTooltipOcultar();">'+
                                            '                      <i class="fas fa-cog" style="font-size: 100%;"></i>'+
                                            '                   </a>'+
                                            '               </span>'+
                                            '           </td>'+
                                            '           <td align="left" class="tdfav_tags '+((tagsFavHtml.trim() == '' ) ? 'info_tags_follow_empty' : '')+'" data-etiqueta-mode="fav">'+
                                            '               <span class="info_tags_follow">'+tagsFavHtml+
                                            '               </span>'+
                                            '               <span class="info_tags_follow_txt" style="display:none">'+
                                            '                   <input value="'+tagsFav+'" class="favoriteTagsPro">'+
                                            '               </span>'+
                                            '               <a class="newLink followLink followLinkTags followLinkTagsEdit" onclick="showFollowEtiqueta(this, \'show\', \'fav\')" onmouseover="return infraTooltipMostrar(\'Editar etiqueta\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-pencil-alt" style="font-size: 100%;"></i></a>'+
                                            '               <a class="newLink followLink followLinkTags followLinkTagsAdd" onclick="showFollowEtiqueta(this, \'show\', \'fav\')" onmouseover="return infraTooltipMostrar(\'Adicionar etiqueta\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-tags" style="font-size: 100%;"></i></a>'+
                                            '           </td>'+
                                            '           <td class="tdfav_map '+((typeof value.latlng !== 'undefined' && value.latlng !== null) ? '' : 'info_maps_follow_empty')+'">'+
                                            '               <span class="info_maps_follow">'+(typeof value.latlng !== 'undefined' && value.latlng !== null ? '<a class="newLink" onclick="openBoxSingleMap(this, true)"><i class="fas fa-map-marked azulColor" style="font-size: 100%;"></i></a>' : '')+'</span>'+
                                            '               <a class="newLink followLink followLinkMaps followLinkMapsEdit" onclick="openBoxSingleMap(this)" onmouseover="return infraTooltipMostrar(\'Editar mapa\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-pencil-alt" style="font-size: 100%;"></i></a>'+
                                            '               <a class="newLink followLink followLinkMaps followLinkMapsAdd" onclick="openBoxSingleMap(this)" onmouseover="return infraTooltipMostrar(\'Adicionar mapa\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-map-marker-alt" style="font-size: 100%;"></i></a>'+
                                            '           </td>'+
                                            '           <td class="tdfav_desc">'+
                                            '               <span class="info_txt" style="display:none"><input onblur="saveFollowDesc(this, \'fav\')" onkeypress="keyFollowDesc(event, \'fav\')" value="'+value.descricao+'"></span>'+
                                            '               <span class="info">'+value.descricao+'</span>'+
                                            '               <a class="newLink followLink followLinkDesc" onclick="editFollowDesc(this, \'fav\')" onmouseover="return infraTooltipMostrar(\'Editar especifica\u00E7\u00E3o\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-pencil-alt" style="font-size: 100%;"></i></a>'+
                                            '           </td>'+
                                            '           <td>'+
                                            '               '+value.tipo_procedimento+
                                            '               <a class="newLink followLink followLinkTags followLinkFavRemove" onclick="removeFavoritePainelPro(this, \''+value.id_procedimento+'\')" onmouseover="return infraTooltipMostrar(\'Remover favorito\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-trash-alt" style="font-size: 100%;"></i></a>'+
                                            '           </td>'+
                                            '           <td class="td_fav_category">'+
                                            '               <span class="info_category_txt">'+(categoria ? categoria : '')+'</span>'+
                                            '               <span class="info_category" style="display:none"></span>'+
                                            '               <a class="newLink followLink followLinkTags followLinkFavCategory" onclick="editCategoryFavorite(this, \''+value.id_procedimento+'\')" onmouseover="return infraTooltipMostrar(\'Editar categoria\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-pencil-alt" style="font-size: 100%;"></i></a>'+
                                            '           </td>'+
                                            '           <td align="center" data-order="'+order+'">'+
                                            '               <a class="newLink sorterTrFavorite" style="margin-right: 20px; cursor: grab;"></i>'+
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
            htmlTableFavorites +=   '   </tbody>'+
                                    '</table>';
        var idOrder = (getOptionsPro('orderPanelHome') && jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='favoritesPro'].index | length(@)") > 0) ? jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='favoritesPro'].index | [0]") : '';
        var htmlPanelFavorites = '<div class="panelHomePro" style="display: inline-block; width: 100%;" id="favoritesPro" data-order="'+idOrder+'">'+
                                '   <div class="infraBarraLocalizacao titlePanelHome">'+
                                '       <i class="fas fa-star starGold" style="margin: 0 5px; font-size: 1.1em;"></i>'+
                                '       Favoritos'+
                                '       <a class="newLink" id="favoritesProDiv_showIcon" onclick="toggleTablePro(\'favoritesProDiv\',\'show\')" onmouseover="return infraTooltipMostrar(\'Mostrar Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconShow+'"><i class="fas fa-plus-square cinzaColor"></i></a>'+
                                '       <a class="newLink" id="favoritesProDiv_hideIcon" onclick="toggleTablePro(\'favoritesProDiv\',\'hide\')" onmouseover="return infraTooltipMostrar(\'Recolher Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconHide+'"><i class="fas fa-minus-square cinzaColor"></i></a>'+
                                '   </div>'+
                                '   <div id="favoritesProDiv" class="panelHome" style="width: 98%; '+statusView+'">'+
                                '   	<div id="favoritosProActions" style="top:0; position: absolute; z-index: 9999; left: 190px; width: calc(100% - 230px)">'+
                                '           <a class="newLink iconFavoritos_remove" onclick="removeFavoritePainelPro(this)" onmouseover="return infraTooltipMostrar(\'Remover favoritos\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 14pt; display: none">'+
                                '                   <span class="fa-layers fa-fw">'+
                                '                       <i class="fas fa-trash-alt"></i>'+
                                '                       <span class="fa-layers-counter">1</span>'+
                                '                   </span>'+
                                '           </a>'+
                                '           <span style="display:block; float:right; width:200px;">'+selectCategoryFavorite(selectedCategoryView, 'changePanelCategoryFavorite')+'</span>'+
                                '           <a class="newLink iconFavoritos_update" onclick="updateFavorites(this)" onmouseover="return infraTooltipMostrar(\'Atualizar Informa\u00E7\u00F5es\');" onmouseout="return infraTooltipOcultar();" style="margin-right: 10px;;font-size: 14pt;float: right;">'+
                                '               <i class="fas fa-sync-alt"></i>'+
                                '           </a>'+
                                '           <a class="newLink iconFavoritos_maps" onclick="openBoxMultipleMap()" onmouseover="return infraTooltipMostrar(\'Mapa de favoritos\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 14pt;float: right; '+(checkMaps ? '' : 'display:none;')+'">'+
                                '              <i class="fas fa-map-marker-alt" style="font-size: 100%;"></i>'+
                                '           </a>'+
                                '           <a class="newLink iconFavoritos_config" onclick="openConfigFavorites(this)" onmouseover="return infraTooltipMostrar(\'Configura\u00E7\u00F5es\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 14pt;float: right;">'+
                                '               <i class="fas fa-cog"></i>'+
                                '           </a>'+
                                '   	</div>'+
                                '   	<div class="tabelaPanelScroll">'+
                                '           '+htmlTableFavorites+
                                '   	</div>'+
                                '   </div>'+
                                '</div>';

        if ( mode == 'insert' ) {
            if ( $('#favoritesPro').length > 0 ) { $('#favoritesPro').remove(); }        
            orderDivPanel(htmlPanelFavorites, idOrder, 'favoritesPro');

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
            $('#favoritesPro').attr('id', 'favoritesPro_temp');
            $('#favoritesPro_temp').after(htmlPanelFavorites);
            $('#favoritesPro_temp').remove();
        }
        initFunctionsPanelFav();
        checkFileSystemInit();
        appendStarOnProcess();
    } else {
        checkFileLocalFav();
        appendStarOnProcess();
    }
}
function appendStarOnProcess() {
    var storeFavorites = getStoreFavoritePro()['favorites'];
    $('.tabelaControle').find('tbody tr').each(function(){
        var _this = $(this);
        if (_this.find('.processoNaoVisualizado').length == 0) {
            var id_procedimento =_this.attr('id');
                id_procedimento = (typeof id_procedimento !== 'undefined') ? id_procedimento.replace('P', '') : false;
            var iconStar = (id_procedimento) ? htmlIconFavorites(id_procedimento, 'left') : '';
            var td = _this.find('td').eq(1);
            td.find('.iconFavoritePro').remove();
            td.prepend(iconStar);
        }
    });
}
function checkFileSystemInit() {
    if (!fileSystemPro) {
        getLocalFilePro();
        setTimeout(function(){
            if (!fileSystemPro) {
                var htmlFileSystemStatus =  '<span id="htmlFileSystemStatus" style="display:block;float: left;font-size: 9pt;color: #888;clear: both;top: 0; left:60px;position: absolute;width: calc(100% - 400px);">'+
                                            '   <i class="fas fa-exclamation-triangle vermelhoColor"></i> Seu navegador n\u00E3o possui suporte ao sistema de arquivos local (FileSystem API) ou o usu\u00E1rio n\u00E3o autorizou o seu uso. '+
                                            '   <br> A n\u00E3o utiliza\u00E7\u00E3o dessa tecnologia poder\u00E1 ocasionar a perda de dados dos processos favoritos, caso o dados de cache do navegador sejam apagados. '+
                                            '   <br><a onclick="initFileSystem(); setPanelFavorites(\'refresh\');" style="font-size: 9pt;color: blue; text-decoration: underline;">Re-autorize</a> a aplica\u00E7\u00E3o ou utilize outro navegador compat\u00EDvel.'+
                                            '</span>';
                $('#htmlFileSystemStatus').remove();
                $('#favoritosProActions').append(htmlFileSystemStatus);
            }
        }, 1000);
    }
}
function checkFileRemoteFav(mode, data = false) {
    if (mode == 'get') {
        var action = 'check_favoritos';
        var param = {
            action: action
        };
        getServerAtividades(param, action);
    } else if (mode == 'set') {
        if (data) {
            var storeFavorites = getStoreFavoritePro();
            var datetime_server = moment(data.datetime,'YYYY-MM-DD HH:mm:ss');
            var datetime_local = moment(storeFavorites.config.datetime,'YYYY-MM-DD HH:mm:ss');
            if (statusLoadRemoteFile && datetime_server.isValid() && datetime_local.isValid() && datetime_server > datetime_local.add(1,'minutes')) {
                getConfigDatetimeFav();
                getRemoteFileFav();
                statusLoadRemoteFile = false;
                setTimeout(function(){
                    statusLoadRemoteFile = true;
                }, 5000);
                console.log('getRemoteFileFav');
            }
        }
    }
}
function checkFileLocalFav() {
    getLocalFilePro();
    setTimeout(function(){ 
        if (fileSystemPro && fileSystemContentPro && typeof fileSystemContentPro === 'object' && fileSystemContentPro.hasOwnProperty('favorites') && fileSystemContentPro.favorites.length > 0 ) {
            console.log('ok');
            localStorageStorePro('configDataFavoritesPro', fileSystemContentPro);
            saveConfigFav();
            initPanelFavorites();
            console.log('backup setPanelFavorites');
        } else if (typeof perfilLoginAtiv !== 'undefined' && perfilLoginAtiv !== null) {
            getRemoteFileFav();
        }
    }, 500);
}
function getRemoteFileFav() {
    var action = 'get_favoritos';
    var param = {
        action: action
    };
    getServerAtividades(param, action);
}
function restoreFavServer(data) {
    var storeFavorites = getStoreFavoritePro();
        storeFavorites.favorites = data.favorites;
        storeFavorites.config.colortags = data.config.colortags;
        localStorageStorePro('configDataFavoritesPro', storeFavorites);
        setLocalFilePro(storeFavorites);
        initPanelFavorites();
        console.log('backup setPanelFavorites');
}
function keyDatesFav(e) {
    if(e.which == 13) {
        showDatesFav(e.path[0], 'hide');
    }
}
function initFunctionsPanelFav(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $('.favoriteTagsPro').tagsInput !== 'undefined' && 
        typeof $('.tabelaPanelScroll').tagsInput !== 'undefined' && 
        typeof $().tablesorter !== 'undefined' && 
        typeof $('.ui-autocomplete-input').autocomplete !== 'undefined') {

        var idTableFavorite = '#favoriteTablePro';
        var tableFavorites = $(idTableFavorite);

        initChosenReplace('panel');

        $('.favoriteTagsPro').tagsInput({
          interactive: true,
          placeholder: 'Adicionar etiqueta',
          minChars: 2,
          maxChars: 100,
          limit: 8,
          autocomplete_url: '',
          autocomplete: {'source': sugestEtiquetaPro('fav') },
          hide: true,
          delimiter: [';'],
          unique: true,
          removeWithBackspace: true,
          onAddTag: saveFollowEtiqueta,
          onRemoveTag: saveFollowEtiqueta,
          onChange: saveFollowEtiqueta
        });
        
        var tagName = getOptionsPro('filterTag_favoritos');
        if (typeof tagName !== 'undefined' && tagName != '') {
            setTimeout(function(){ 
                $('.tableFavoritos .tagTableText_'+tagName).eq(0).trigger('click');
                console.log('tagName',tagName);
            }, 500);
        }
        initPanelResize('#favoritesProDiv .tabelaPanelScroll', 'favoritesPro');

        tableFavorites.tablesorter({
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
            checkboxRangerSelectShift(idTableFavorite);
        }).on("filterEnd", function (event, data) {
            checkboxRangerSelectShift(idTableFavorite);
            var caption = $(this).find("caption").eq(0);
            var tx = caption.text();
                caption.text(tx.replace(/\d+/g, data.filteredRows));
                $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
        });
        checkboxRangerSelectShift(idTableFavorite);

        tableFavorites.sortable({
            items: 'tr',
            cursor: 'grabbing',
            handle: '.sorterTrFavorite',
            forceHelperSize: true,
            opacity: 0.5,
            axis: 'y',
            dropOnEmpty: false,
            update: function(event, ui) {
                console.log(event, ui);
                setTimeout(function(){ 
                    var storeFavorites = getStoreFavoritePro();
                    $('#favoriteTablePro').find('tbody tr').each(function(index, value){
                        var _tr = $(this);
                        var id_procedimento = _tr.data('id_procedimento');
                        var favoriteIndex = storeFavorites.favorites.findIndex((obj => obj.id_procedimento == id_procedimento));

                        if (typeof favoriteIndex !== 'undefined' && favoriteIndex !== null) {
                                var newIndex = index+1;
                                var item = storeFavorites.favorites[favoriteIndex];
                                    item.order = newIndex;
                                storeFavorites.favorites[favoriteIndex] = item;
                        }
                    });
                    localStorageStorePro('configDataFavoritesPro', storeFavorites);
                    saveConfigFav();
                    setPanelFavorites('refresh');
                }, 500);
            }
        });

        var observerTableFav = new MutationObserver(function(mutations) {
            var _this = $(mutations[0].target);
            var _parent = _this.closest('table');
            var count_all = _parent.find('tr.infraTrMarcada').length;
            if (count_all > 0) {
                $('#favoritosProActions').find('.iconFavoritos_remove').show().find('.fa-layers-counter').text(count_all);
            } else {
                $('#favoritosProActions').find('.iconFavoritos_remove').hide();
            }
        });
        setTimeout(function(){ 
            tableFavorites.find('tbody tr').each(function(){
                observerTableFav.observe(this, {
                        attributes: true
                });
            });
            checkboxRangerSelectShift();
            checkFileRemoteFav('get');
        }, 500);

        var filterFav = tableFavorites.find('.tablesorter-filter-row').get(0);
        if (typeof filterFav !== 'undefined') {
            var observerFilterTableFav = new MutationObserver(function(mutations) {
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
                var htmlFilterFav = '<div class="btn-group filterIfraTable" role="group" style="right: 30px; top: -15px;z-index: 999; position: absolute;">'+
                                    '   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">'+
                                    '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                    '       <span class="text">Baixar</span>'+
                                    '   </button>'+
                                    '   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                                    '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                    '       <span class="text">Copiar</span>'+
                                    '   </button>'+
                                    '   <button type="button" onclick="filterIfraTable(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light '+(tableFavorites.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active')+'">'+
                                    '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>'+
                                    '       Pesquisar'+
                                    '   </button>'+
                                    '</div>';

                tableFavorites.find('thead .filterIfraTable').remove();
                tableFavorites.find('thead').prepend(htmlFilterFav);
                observerFilterTableFav.observe(filterFav, {
                    attributes: true
                });
            }, 500);
        }
    } else {
        setTimeout(function(){ 
            initFunctionsPanelFav(TimeOut - 100); 
            console.log('Reload initFunctionsPanelFav'); 
        }, 500);
    }
}

function openConfigFavorites() {
    var textBox =   '<table style="font-size: 9pt;width: 100%;" class="seiProForm">'+
                    '   <tr style="height: 40px;">'+
                    '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                    '               <a id="backup_fav" style="cursor:pointer" onclick="initDownloadLocalFilePro(this)" class="newLink"><i class="fas fa-download azulColor"></i>Baixar Favoritos</a>'+
                    '           </td>'+
                    '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                    '               <input type="file" id="selectLocalFilesPro" onchange="loadLocalFilePro()" value="Import" style="display: none" />'+
                    '               <a id="restore_fav" style="cursor:pointer;float: right;" onclick="initLoadLocalFilePro()" class="newLink"><i class="fas fa-upload azulColor"></i>Carregar Favoritos</a>'+
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
            title: 'Configura\u00E7\u00F5es',
            open: function(){
                getLocalFilePro();
            }
    });
}
function actionToolbarFavPro(this_, triggerButton) {
    var button = $(triggerButton);
    var name_action = button.data('action');
    if (name_action == 'etiqueta') {
        showFollowEtiqueta(this_, 'show');
    } else if (name_action == 'remove') {
        removeFav(this_);
    } else if (name_action == 'dates') {
        showDatesFav(this_, 'show');
    } else if (name_action == 'descricao') {
        editFavoriteDesc(this_);
    }
}
function updateDatesFav(this_) {
    var storeFavorites = getStoreFavoritePro();
    var index = parseInt($(this_).closest('tr').data('index'));
    var id_procedimento = parseInt($(this_).closest('tr').data('id_procedimento'));
    var favoriteIndex = storeFavorites.favorites.findIndex((obj => obj.id_procedimento == id_procedimento));
    var config = getOptionsConfigDate(favoriteIndex);
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
            $(this_).closest('td').find('.info_dates_fav').html(htmlDatePreview+followLink[0].outerHTML);
        }
        storeFavorites['favorites'][favoriteIndex]['configdate'] = config;
        localStorageStorePro('configDataFavoritesPro', storeFavorites);
    }
}
function showDatesFav(this_, mode) {
    if ($(this_).closest('#frmAtividadeListar').length > 0) {
        updateDatesFav(this_);
    } else {
        if(!$(this_).closest('tr').find('.favoriteConfigDates').is(':hover')) {
            $(this_).closest('table').find('.info_dates_fav').show();
            $(this_).closest('table').find('.info_dates_fav_txt').hide();
            $(this_).closest('table').find('.followLinkDates').show();
            infraTooltipOcultar();
            updateDatesFav(this_);
        }
        if(mode == 'show') {
            $(this_).closest('td').find('.followLinkDates').hide();
            $(this_).closest('tr').find('.info_dates_fav').hide();
            $(this_).closest('tr').find('.info_dates_fav_txt').css('display','inline-flex').find('input.favoriteDatesPro').focus().trigger('click');
        }
        if ($(this_).closest('tr').find('.info_dates_fav').text().trim() != '') {
            $(this_).closest('td').removeClass('info_dates_follow_empty');
        } else {
            $(this_).closest('td').addClass('info_dates_follow_empty');
        }
    }
}
function getFavoritesEnviarProcesso() {
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    var storeFavorites = getStoreFavoritePro();
    var id_procedimento = String(getParamsUrlPro(window.location.href).id_procedimento);
    var value = jmespath.search(storeFavorites.favorites, "[?id_procedimento=='"+id_procedimento+"'] | [0]");
    var htmlAddFav =    '<div id="divSinAdicionarFavoritos" class="infraDivCheckbox" style="position: absolute;top: 100%;left: 0;">'+
                        '   <input type="checkbox" id="chkSindicionarFavoritos" onchange="parent.actionFavoriteCheckbox(this)" name="chkSindicionarFavoritos" class="infraCheckbox" tabindex="510" '+(value ? 'checked' : '')+'>'+
                        '   <label id="lblSinAdicionarFavoritos" for="chkSindicionarFavoritos" accesskey="" class="infraLabelCheckbox">Manter processo em Favoritos</label>'+
                        '   <div class="favoritosLabelOptions seiProForm" style="display:'+(value ? 'block' : 'none')+';font-size: 9pt;clear: both;">'+
                        favoritosLabelOptions(id_procedimento)+
                        '   </div>'+
                        '</div>';
    ifrVisualizacao.find('#frmAtividadeListar').prepend(htmlAddFav);
    loadStylePro(URL_SPRO+"css/sei-pro.css", ifrVisualizacao.find('head'), ifrVisualizacao);
    loadStylePro(URL_SPRO+"css/fontawesome.min.css", ifrVisualizacao.find('head'), ifrVisualizacao);
    loadScriptFavoriteTag(ifrVisualizacao);
}
function favoritosLabelOptions(id_procedimento) {
    var storeFavorites = getStoreFavoritePro();
    var value = jmespath.search(storeFavorites.favorites, "[?id_procedimento=='"+id_procedimento+"'] | [0]");
    var value = (value !== null) ? value : false;   
    var config = (value && typeof value.configdate !== 'undefined' && value.configdate !== null) ? value.configdate : '';
    var tagsFav = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? value.etiquetas : false;
        tagsFav = (tagsFav && tagsFav.length > 0) ? value.etiquetas.join(';') : '';
    var tagsFavHtml = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? $.map(value.etiquetas, function (i) { return getHtmlEtiqueta(i,'fav') }).join('') : '';

    var favoritosOptions = '       <table style="font-size: 10pt;width: 100%;min-width: 610px;" class="seiProForm">'+
                            '          <tr data-id_procedimento="'+id_procedimento+'" data-index="0">'+
                            '              <td style="vertical-align: bottom; text-align: left;" class="label">'+
                            '                   <label for="categoria_fav"><i class="iconPopup iconSwitch fas fa-layer-group cinzaColor"></i>Categoria:</label>'+
                            '               </td>'+
                            '               <td>'+
                            '                   '+selectCategoryFavorite((value ? value.categoria : ''), 'parent.changeCategoryFavorite', true, id_procedimento)+
                            '               </td>'+
                            '               <td style="vertical-align: bottom;" class="label">'+
                            '                   <label class="last" for="favoritePrazoSend"><i class="iconPopup iconSwitch fas fa-stopwatch cinzaColor" style="float: initial;"></i>Prazo:</label>'+
                            '               </td>'+
                            '               <td>'+
                            '                   <span class="info_dates_fav_txt">'+
                            '                       <input id="favoritePrazoSend" value="'+(config && typeof config.date !== 'undefined' && config.date !== null ? config.date : '')+'" style="width: 120px; background-color: #f9fafa;" onblur="parent.showDatesFav(this, \'hide\')" onkeypress="parent.keyDatesFav(event)" type="date" class="favoriteDatesPro">'+
                            '                       <a class="newLink favoriteConfigDates" onclick="parent.openBoxConfigDates(this)" style="padding: 5px 8px;margin: 8px 2px 0 10px;font-size: 10pt;" onmouseover="return infraTooltipMostrar(\'Op\u00E7\u00F5es\');" onmouseout="return infraTooltipOcultar();">'+
                            '                          <i class="fas fa-cog" style="font-size: 100%;"></i>'+
                            '                       </a>'+
                            '                   </span>'+
                            '               </td>'+
                            '          </tr>'+
                            '          <tr data-id_procedimento="'+id_procedimento+'" data-index="0" style="height: 40px;">'+
                            '               <td align="left" class="tdfav_tags" data-etiqueta-mode="fav" colspan="4">'+
                            '                   <span class="info_tags_follow">'+tagsFavHtml+
                            '                   </span>'+
                            '                   <span class="info_tags_follow_txt" style="display:none;margin-top: -8px !important;">'+
                            '                       <input value="'+tagsFav+'" class="favoriteTagsPro">'+
                            '                   </span>'+
                            '                   <a class="newLink followLinkTagsAdd_send" style="font-size: 10pt;" onclick="parent.showFollowEtiqueta(this, \'show\', \'fav\')" onmouseout="return infraTooltipOcultar();"><i class="fas fa-tags" style="font-size: 100%;"></i> Adicionar etiqueta</a>'+
                            '               </td>'+
                            '          </tr>'+
                            '       </table>';
    return favoritosOptions;
}
function loadScriptFavoriteTag(iFrame) {
    var scriptText =    '<script data-config="config-seipro-fav">\n'+
                        '   function initFavoriteTagIframe(TimeOut = 9000) {\n'+
                        '       if (TimeOut <= 0) { return; }\n'+
                        '       if (typeof $().tagsInput !== \'undefined\') {\n'+
                        '           getFavoriteTagIframe();\n'+
                        '       } else {\n'+
                        '           $.getScript(\''+URL_SPRO+'js/lib/jquery.tagsinput-revisited.js\');\n'+
                        '           setTimeout(function(){\n'+
                        '               initFavoriteTagIframe(TimeOut - 100);\n'+
                        '               console.log(\'Reload initFavoriteTagIframe\');\n'+
                        '           }, 500);\n'+
                        '       }\n'+
                        '   }\n'+
                        '   function getFavoriteTagIframe() {\n'+
                        '       $(\'.favoriteTagsPro\').tagsInput({\n'+
                        '           interactive: true,\n'+
                        '           placeholder: \'Adicionar etiqueta\',\n'+
                        '           minChars: 2,\n'+
                        '           maxChars: 100,\n'+
                        '           limit: 8,\n'+
                        '           autocomplete_url: \'\',\n'+
                        '           autocomplete: {\'source\': parent.sugestEtiquetaPro(\'fav\') },\n'+
                        '           hide: true,\n'+
                        '           delimiter: [\';\'],\n'+
                        '           unique: true,\n'+
                        '           removeWithBackspace: true,\n'+
                        '           onAddTag: parent.saveFollowEtiqueta,\n'+
                        '           onRemoveTag: parent.saveFollowEtiqueta,\n'+
                        '           onChange: parent.saveFollowEtiqueta\n'+
                        '         });\n'+
                        '   }\n'+
                        '   initFavoriteTagIframe();\n'+
                        '</script>';
    $(scriptText).appendTo(iFrame.find('head'));
}
function checkPageFavoritosVisualizacao() {
    waitLoadPro($('#ifrVisualizacao').contents(), '#frmAtividadeListar[action*="acao=procedimento_enviar"]', ".infraBarraComandos", getFavoritesEnviarProcesso);
}
function removeFav(this_) { 
    var storeFavorites = getStoreFavoritePro();
    var index = parseInt($(this_).closest('tr').data('index'));
    if (typeof index && parseInt(index) >= 0) {
        storeFavorites['favorites'].splice(parseInt(index),1);
        $(this_).closest('tr').trigger('click').effect('highlight').effect('highlight').fadeOut( "slow", function() {
            $(this).remove();
            updateIndexTableFav();
            updateCountTableFav();
            localStorageStorePro('configDataFavoritesPro', storeFavorites);
        });
    }
}
function updateIndexTableFav() {
    $('.tableFollow').find('tbody tr').each(function(index){
        $(this).data('index', index);
    });
}
function setSingleMap(id_procedimento, readonly = false) {
    var storeFavorites = getStoreFavoritePro();
    var value = jmespath.search(storeFavorites.favorites, "[?id_procedimento=='"+id_procedimento+"'] | [0]");
        value = (value !== null) ? value : false;
    var latlng = (value !== null && typeof value.latlng !== 'undefined' && value.latlng !== null && value.latlng.length > 0 && value.latlng[0] !== null && value.latlng[1] !== null) ? value.latlng : false;
    var latlng_fav = (latlng) ? latlng : [-15.800909532800379, -47.861289633438];

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
        console.log(e.message);
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
        console.log('setInterval->locate');
        map.locate({setView: true, maxZoom: 16});
    }

    markersLayer = new L.LayerGroup();
    map = L.map('mapid').setView(latlng_fav, 16);

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

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: '<a href="https://seipro.app" target="_blank">SEI Pro</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    var marker = L.marker(latlng_fav).addTo(map);
    markers = marker._latlng;
    if (value && latlng) {
        var linkProc = $('#favoriteTablePro tbody tr[data-id_procedimento="'+id_procedimento+'"] .followLinkProcesso')[0].outerHTML;
        marker.bindPopup('<b>'+linkProc+'</b><br>'+value.descricao).openPopup();
    }
    
    if (!readonly) {   
        map.on('click', addMarker);
        if (latlng === false) {
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
}
function openBoxSingleMap(this_, readonly = false) {
    var _this = $(this_);
    var id_procedimento = _this.closest('tr').data('id_procedimento');
    var buttons = (readonly) 
        ? null
        : [{
            text: "Remover",
            icon: 'ui-icon-trash',
            click: function() {
                saveConfigMapsFav(id_procedimento, 'remove');
                resetDialogBoxPro('dialogBoxPro');
            }
        },{
            text: "Salvar",
            class: 'confirm ui-state-active',
            click: function() {
                saveConfigMapsFav(id_procedimento);
                resetDialogBoxPro('dialogBoxPro');
            }
        }];
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div id="mapid" style="width: 600px; height: 400px;"></div>')
        .dialog({
            title: "Favoritos: Mapa",
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
            title: "Favoritos: Mapa",
            width: 920,
            open: function(){
                setMultipleMap();
            }
    });
}
function setMultipleMap() {
    var marker_list = [];
    var storeFavorites = getStoreFavoritePro();
    var listFavorite = jmespath.search(storeFavorites.favorites, "[?not_null(latlng)]");
        listFavorite = (typeof listFavorite !== 'undefined' && listFavorite !== null && listFavorite.length > 0) ? listFavorite : false;
    if (listFavorite) {
        markersLayer = new L.LayerGroup();
        map = L.map('mapid').setView(listFavorite[0].latlng, 16);

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


        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: '<a href="https://seipro.app" target="_blank">SEI Pro</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(map);
        $.each(listFavorite,function(index, value){
            var marker = L.marker(value.latlng).addTo(map).on('click', openMarkerFav);
            var linkProc = $('#favoriteTablePro tbody tr[data-id_procedimento="'+value.id_procedimento+'"] .followLinkProcesso')[0].outerHTML;
                marker.bindPopup('<b>'+linkProc+'</b><br>'+value.descricao);
                marker_list.push([marker._latlng.lat, marker._latlng.lng]);
                marker.favorites = value;
        });
        map.fitBounds(marker_list);
        marker = false;
    }
}
function openMarkerFav(e){
    console.log(e);
    var value = e.target.favorites;
    $('#favoriteTablePro').find('#lnkInfraCheck').data('index',1).trigger('click');
    scrollToElement($('#favoritesProDiv .tabelaPanelScroll'), $('#favoriteTablePro tbody tr[data-id_procedimento="'+value.id_procedimento+'"]'), 30);
    $('#favoritePro_'+value.id_procedimento).trigger('click');
}
function saveConfigMapsFav(id_procedimento, mode = 'add'){
    if (typeof markers === 'object' && markers.lat !== null && markers.lng !== null) {
        var storeFavorites = getStoreFavoritePro();
        var favoriteIndex = storeFavorites.favorites.findIndex((obj => obj.id_procedimento == id_procedimento));
        if (typeof favoriteIndex !== 'undefined' && favoriteIndex !== null) {
            var item = storeFavorites.favorites[favoriteIndex];
                item.latlng = (mode == 'remove') ? null : [markers.lat, markers.lng];
            storeFavorites.favorites[favoriteIndex] = item;
            localStorageStorePro('configDataFavoritesPro', storeFavorites);
            saveConfigFav();
            setPanelFavorites('refresh');
            markers = [];
            setTimeout(function(){ 
                alertaBoxPro('Sucess', 'check-circle', 'Mapa '+(mode == 'remove' ? 'removido' : 'adicionado')+' com sucesso!');
            }, 500);
        }
    }
}