
function valuePrescricao(id_prescricao, arrayPrescricoes = arrayPrescricoesProcPro) {
    var value = (id_prescricao == 0) ? null : jmespath.search(arrayPrescricoes, "[?id_prescricao==`"+id_prescricao+"`] | [0]");
        value = value === null ? false : value;
    return value;
}
function valueTipoPrescricao(id_tipo_prescricao, arrayTiposPrescricoes = arrayConfigAtividades.tipos_prescricoes) {
    var value = (id_tipo_prescricao == 0) ? null : jmespath.search(arrayTiposPrescricoes, "[?id_tipo_prescricao==`"+id_tipo_prescricao+"`] | [0]");
        value = value === null ? false : value;
    return value;
}
function getCtrPrescricao(prescData = arrayPrescricoesProcPro) {
    if ($.map(parent.arrayConfigAtividades.tipos_prescricoes, function(v){ if (parent.checkListTipoPrescricaoInProcesso(v)) { return v }}).length > 0) {
        var tipos_prescricao = typeof jmespath !== 'undefined' ? jmespath.search(prescData,"[*].id_tipo_prescricao") : null;
            tipos_prescricao = tipos_prescricao !== null ? uniqPro(tipos_prescricao) : null;

        var htmlBox =   '<div class="atividadeWork" style="max-height: 400px;overflow: auto;">';

        if (typeof prescData !== 'undefined' && prescData.length > 0 && tipos_prescricao !== null && tipos_prescricao.length > 0) {
            $.each(tipos_prescricao, function(i, v){
                var value_prescricao = typeof arrayConfigAtividades.tipos_prescricoes !== 'undefined' ? jmespath.search(parent.arrayConfigAtividades.tipos_prescricoes, "[?id_tipo_prescricao==`"+v+"`] | [0]") : null;
                    value_prescricao = value_prescricao !== null ? value_prescricao : false;
                var prescricao = jmespath.search(prescData,"[?id_tipo_prescricao==`"+v+"`]");
                    prescricao = prescricao !== null ? prescricao : false;
                var vigente = jmespath.search(prescricao, "[?data_fim=='0000-00-00 00:00:00'] | [0]");
                    vigente = vigente !== null ? vigente : false;
                var prazo = value_prescricao ? value_prescricao.prazo : false;
                var config = value_prescricao ? value_prescricao.config : false;
                var totalDecorrido = 0;

                if (prazo) {
                    
                    htmlBox +=  '   <table id="prescricaoProcPro_'+v+'" style="font-size: 9pt !important;width: 100%;" class="seiProForm tableAtividades tableInfo tableZebra">'+
                                '        <thead>'+
                                (checkCapacidade('update_prescricao') ? 
                                '            <tr>'+
                                '                <th colspan="8" style="text-align: right;">'+
                                '                    <a class="newLink addConfigItem" onclick="dialogSavePrescricao(this)" style="cursor: pointer; margin: 5px 5px 15px 5px;display: inline-block;">'+
                                '                        <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>'+
                                '                        Adicionar nova prescri\u00E7\u00E3o'+
                                '                    </a>'+
                                '                </th>'+
                                '            </tr>'+
                                '' : '')+
                                '            <tr class="tableHeader">'+
                                '                <th class="tituloControle" style="text-align: center;">Tipo</th>'+
                                '                <th class="tituloControle" style="text-align: center;">Prazo (dias)</th>'+
                                '                <th class="tituloControle" style="text-align: center;width: 250px;">A\u00E7\u00E3o inaugural</th>'+
                                '                <th class="tituloControle" style="text-align: center;">Data In\u00EDcio</th>'+
                                '                <th class="tituloControle" style="text-align: center;">Data Fim</th>'+
                                '                <th class="tituloControle" style="text-align: center;">Dias decorridos</th>'+
                                '                <th class="tituloControle" style="text-align: center;">Dura\u00E7\u00E3o</th>'+
                                '                <th class="tituloControle" style="text-align: center;width: 60px;">A\u00E7\u00E3o</th>'+
                                '            </tr>'+
                                '        </thead>'+
                                '        <tbody>';

                    var decorrido = moment().diff(moment(vigente.data_inicio, 'YYYY-MM-DD HH:mm:ss'),'days');
                    var porcentagem = parseFloat(((decorrido/prazo)*100).toFixed(2));
                    var nivel_critico = config && typeof config.nivel_critico !== 'undefined' ? config.nivel_critico : 75;
                    var urgencia_nivel_critico = config && typeof config.urgencia_nivel_critico !== 'undefined' ? config.urgencia_nivel_critico : false;
                    var classUrgente = porcentagem >= nivel_critico ? 'urgente' : '';

                    $.each(prescricao, function(i, p){
                        var htmlDuration = '';
                        var htmlDias = '';
                        var _dataFim = p.data_fim == '0000-00-00 00:00:00' ? moment() : moment(p.data_fim,'YYYY-MM-DD HH:mm:ss');
                        var _dataInicio = moment(p.data_inicio,'YYYY-MM-DD HH:mm:ss');
                        var _diff = _dataFim.diff(_dataInicio);
                        var _diffDays = _dataFim.diff(_dataInicio, 'days');
                        var _duration = moment.duration(_diff, "milliseconds");
                        var subtract = moment().subtract(_duration, "milliseconds");
                            htmlDuration = getDatesPreview({date: subtract.format('YYYY-MM-DD HH:mm:ss')});
                            htmlDuration = (htmlDuration && htmlDuration.indexOf('atr\u00E1s') !== -1) ? htmlDuration.replace('atr\u00E1s','') : '';
                            htmlDuration = _diffDays >= 1 ? htmlDuration : '<span class="dateboxDisplay tagTableText_date_vencido "><i class="fas fa-history" style="color: #777; padding-right: 3px; font-size: 12pt;"></i> '+(typeof _duration !== 'undefined' ? moment.duration(_duration, "minutes").format("H[h]:m[m]") : '')+' </span>';
                            htmlDias = _diffDays;

                            if (!p.suspensao) totalDecorrido = totalDecorrido+_diffDays;

                        var modalDocEntrega = (p.id_procedimento) ? "openDialogDoc({title: '"+p.documento_relacionado+"', id_procedimento: '"+p.id_procedimento+"', id_documento: '"+p.id_documento_sei+"'})" : '';
                        htmlBox +=  '           <tr>'+
                                    '              <td align="left">'+(p.suspensao ? 'Suspensivo' : p.nome_prescricao)+'</td>'+
                                    '              <td align="center">'+(p.suspensao ? '-' : prazo)+'</td>'+
                                    '              <td align="left">'+
                                    '                   <a class="newLink '+(p.id_procedimento ? 'bLink' : '')+'" style="text-decoration: underline;cursor: pointer;" onclick="'+modalDocEntrega+'" onmouseover="return infraTooltipMostrar(\'Visualiza\u00E7\u00E3o r\u00E1pida\');" onmouseout="return infraTooltipOcultar();">'+
                                    '                       '+(p.id_procedimento ? '<i class="fas fa-file-signature azulColor" style="padding-right: 5px;"></i>' : '')+(p.documento_relacionado ? p.documento_relacionado : '-')+
                                    '                       '+(p.id_procedimento ? '<i class="fas fa-eye bLink" style="font-size: 80%;vertical-align: top;margin-left: 5px;"></i>' : '')+
                                    '                   </a>'+
                                    '              </td>'+
                                    '              <td align="left">'+moment(p.data_inicio,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm')+'</td>'+
                                    '              <td align="left">'+(p.data_fim == '0000-00-00 00:00:00' ? '-' : moment(p.data_fim,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm'))+'</td>'+
                                    '              <td align="center">'+htmlDias+'</td>'+
                                    '              <td align="left">'+htmlDuration+'</td>'+
                                    '              <td align="center">'+
                                    (checkCapacidade('delete_prescricao') && i == prescricao.length-1 && !p.key_prescricao ? 
                                    '                   <a class="newLink removePresc" style="cursor: pointer;float: right;margin: 0 !important;font-size: 1em;" data-id_prescricao="'+p.id_prescricao+'" onclick="removePrescicao(this)"><i class="fas fa-trash-alt cinzaColor"></i></a>'+
                                    '' : '')+
                                    (checkCapacidade('edit_prescricao') && !p.key_prescricao ? 
                                    '                   <a class="newLink editPresc" style="cursor: pointer;float: right;margin: 0 !important;font-size: 1em;" data-id_prescricao="'+p.id_prescricao+'" onclick="dialogSavePrescricao(this)"><i class="fas fa-edit cinzaColor"></i></a>'+
                                    '' : '')+
                                    '              </td>'+
                                    '           </tr>';
                    });

                    htmlBox +=  '       </tbody>'+
                                '       <tfoot>'+
                                '           <tr>'+
                                '               <th colspan="5" style="text-align: right;" class="tituloControle">Total</th>'+
                                '               <th class="tituloControle">'+totalDecorrido+'</th>'+
                                '               <th class="tituloControle"></th>'+
                                '               <th class="tituloControle"></th>'+
                                '           </tr>'+
                                '       </tfooter>'+
                                '   </table>';
                }
            });
        } else {

            htmlBox +=  '   <table id="prescricaoProcPro_0" style="font-size: 9pt !important;width: 100%;" class="seiProForm tableAtividades tableInfo tableZebra">'+
                        '        <thead>'+
                        (checkCapacidade('update_prescricao') ? 
                        '            <tr>'+
                        '                <th colspan="8" style="text-align: right;">'+
                        '                    <a class="newLink addConfigItem" onclick="dialogSavePrescricao(this)" style="cursor: pointer; margin: 5px 5px 15px 5px;display: inline-block;">'+
                        '                        <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>'+
                        '                        Adicionar nova prescri\u00E7\u00E3o'+
                        '                    </a>'+
                        '                </th>'+
                        '            </tr>'+
                        '' : '')+
                        '        </thead>'+
                        '        <tbody>'+
                        '       </tbody>'+
                        '   </table>';
        }

            htmlBox +=  '</div>';

            resetDialogBoxPro('dialogBoxPro');
            dialogBoxPro = $('#dialogBoxPro')
                .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
                .dialog({
                    title: 'Gerenciar prescri\u00E7\u00F5es do processo',
                    width: 980,
                    open: function() { 
                        if($.isEmptyObject(arrayListTypesSEI)) getListTypesSEI();
                    },
                    close: function() { 
                        resetDialogBoxPro('dialogBoxPro');
                    },
                    buttons: []
            });
    }
}
function changeDocumentoDtAssinatura(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    var _data_inicio = _parent.find('[data-key="data_inicio"]');
    if (_data_inicio.length) _data_inicio.val(_this.find('option:selected').attr('data_assinatura'));  
    checkAtivRequiredFields(this_, 'mark');
    checkDtAssinatura(_data_inicio[0]);
}
function checkDtAssinatura(this_) {
    var _this = $(this_);  
    if ( moment(_this.val(), 'YYYY-MM-DDTHH:mm') < moment(_this.attr('min'), 'YYYY-MM-DDTHH:mm') ) { 
        this_.setCustomValidity('*'); 
    } else { 
        this_.setCustomValidity(''); 
    }
    var userValidation = this_.checkValidity();
    
    if (userValidation) {
        _this.removeClass('requiredNull').closest('tr').removeClass('requiredNull');
        updateButtonConfirm(this_, true);
    } else {
        _this.addClass('requiredNull').closest('tr').addClass('requiredNull');
        this_.setCustomValidity('A data de assinatura deve ser maior que a data da \u00FAltima prescri\u00E7\u00E3o ('+moment(_this.attr('min'),'YYYY-MM-DDTHH:mm').format('DD/MM/YYYY HH:mm')+')');
        updateButtonConfirm(this_, false);
        setTimeout(() => {
            this_.reportValidity();
        }, 500);
    }
}
function setSavePrescricao(this_) {
    var _parent = $(this_);
    var dadosProcesso = getIfrArvoreDadosProcesso();
    var id_prescricao = _parent.find('#boxPrescricao').data('prescricao');
    var id_tipo_prescricao = _parent.find('[data-key="id_tipo_prescricao"]').val();
        id_tipo_prescricao = (id_tipo_prescricao.trim() == '') ? false : id_tipo_prescricao;
    var documento_relacionado = _parent.find('[data-key="documento_relacionado"]').val();
        documento_relacionado = (documento_relacionado.trim() == '') ? false : documento_relacionado;
    var id_documento_sei = _parent.find('[data-key="id_documento_sei"]').val();
        id_documento_sei = (id_documento_sei.trim() == '') ? false : id_documento_sei;
    var documento_sei = _parent.find('[data-key="documento_sei"]').val();
        documento_sei = (documento_sei.trim() == '') ? false : documento_sei;
    var data_inicio = _parent.find('[data-key="data_inicio"]').val();
        data_inicio = typeof data_inicio !== 'undefined' ? moment(data_inicio,'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss') : false;
    var transito_julgado = _parent.find('[data-key="transito_julgado"]').is(':checked');
    var suspende_contagem = _parent.find('[data-key="suspende_contagem"]').is(':checked');

    var action = 'update_prescricao';
    var param = {
        action: action, 
        mode: id_prescricao == 0 ? 'save_prescricao' : 'edit_prescricao',
        id_tipo_prescricao: id_tipo_prescricao,
        id_prescricao: id_prescricao,
        transito_julgado: transito_julgado,
        suspende_contagem: suspende_contagem,
        id_procedimento: dadosProcesso.id_procedimento,
        processo_sei: dadosProcesso.processo_sei,
        data_inicio: data_inicio,
        documento_relacionado: documento_relacionado,
        id_documento_sei: id_documento_sei,
        documento_sei: documento_sei
    };
    getServerAtividades(param, action);
}
function changeOptionsSavePrescricao(this_) {
	var _this = $(this_);
    var _parent = _this.closest('table');
    if (_this.is(':checked')) {
        if (_this.data('key') == 'suspende_contagem') _parent.find('[data-key="transito_julgado"]').prop('checked',false);
        if (_this.data('key') == 'transito_julgado') _parent.find('[data-key="suspende_contagem"]').prop('checked',false);
    } 
}
function removePrescicao(this_) {
	var _this = $(this_);
	var data = _this.data();
    var id_prescricao = (typeof data.id_prescricao !== 'undefined') ? data.id_prescricao : false;
    var dadosProcesso = getIfrArvoreDadosProcesso();

    confirmaFraseBoxPro('Tem certeza que deseja <b style="font-weight: bold;">DELETAR</b> o item?', 'SIM', 
    function(){
        var action = 'delete_prescricao';
        var param = {
            action: action, 
            id_procedimento: dadosProcesso.id_procedimento,
            id_prescricao: id_prescricao
        };
        if (id_prescricao) getServerAtividades(param, action);
    });
}
function changeSelectDocsPrescricao(this_) {
	var _this = $(this_);
    var value = _this.val() != '' ? valueTipoPrescricao(_this.val()) : false;
    var optionsDocSEI = optionSelectDocsPrescricao(value);
        _this.closest('table').find('[data-key="documento_relacionado"]').html('<option>&nbsp;</option>'+optionsDocSEI).chosen("destroy").chosen({
            placeholder_text_single: ' ',
            no_results_text: 'Nenhum resultado encontrado'
        });
    checkAtivRequiredFields(this_, 'mark');
}
function optionSelectDocsPrescricao(value) {
    var dadosProcesso = getDadosProcessoSession();
    var listDocumentos = (dadosProcesso) ? dadosProcesso.listDocumentosAssinados : dadosProcessoPro.listDocumentosAssinados;
    var value_tipo_prescricao = value ? valueTipoPrescricao(value.id_tipo_prescricao) : false;
    var listDocumentosPermitidos = value && value_tipo_prescricao && typeof value_tipo_prescricao.config !== 'undefined' && typeof value_tipo_prescricao.config.tipo_documento !== 'undefined' && value_tipo_prescricao.config.tipo_documento.length
        ?   value_tipo_prescricao.config.tipo_documento.map(function(v){ 
                var name = jmespath.search(arrayListTypesSEI.selSeriePesquisa, "[?value=='"+v.value+"'] | [0].name");
                if (name !== null) return name;
            })
        : false;
    var optionsDocSEI = $.map(listDocumentos, function(v){
                            var disabled = listDocumentosPermitidos && !listDocumentosPermitidos.some(function(d) { return v.nome_documento.indexOf(d) >= 0; }) ? 'disabled' : '';
                            return '<option data_id_documento_sei="'+v.id_documento+'" data_nr_sei="'+v.nr_sei+'" data_assinatura="'+moment(v.data_assinatura, 'DD/MM/YYYY').format('YYYY-MM-DDTHH:mm')+'" '+(value && typeof value.id_documento_sei !== 'undefined' && disabled == '' && v.id_documento.toString() == value.id_documento_sei.toString() ? 'selected' : '')+' '+disabled+' >'+v.nome_documento+' ('+v.nr_sei+')'+'</option>'
                        }).join('');
    return optionsDocSEI;
}
function checkListTipoPrescricaoInProcesso(v) {
    var _return =  
                typeof v.config !== 'undefined'
                && typeof v.config.tipo_processo !== 'undefined'
                && v.config.tipo_processo.length
                && typeof dadosProcessoPro.propProcesso !== 'undefined'
                && typeof dadosProcessoPro.propProcesso.hdnIdTipoProcedimento !== 'undefined'
                && jmespath.search(v.config.tipo_processo, "[?value=='"+dadosProcessoPro.propProcesso.hdnIdTipoProcedimento+"'] | [0]") !== null
                && (typeof v.config.unidades === 'undefined' || (typeof v.config.unidades !== 'undefined' && jmespath.search(v.config.unidades,"[?id_unidade==`"+arrayConfigAtivUnidade.id_unidade+"`]").length))
            ? true : false;
    return _return;
}
function dialogSavePrescricao(this_, prescData = arrayPrescricoesProcPro) {
	var _this = $(this_);
	var data = _this.data();
    var value = (typeof data.id_prescricao !== 'undefined') ? valuePrescricao(data.id_prescricao) : false;
    var dataMin = !value 
        ? prescData.length ? jmespath.search(prescData,"[*].data_inicio").reduce(function (a, b) { return a > b ? a : b; }) : ''
        : prescData.length ? jmespath.search(prescData,"[?id_dependencia==`"+value.id_prescricao+"`] | [0].data_inicio") : '';
    var countTiposPresc = 0;
    var optionsTiposPresc = $.map(arrayConfigAtividades.tipos_prescricoes, function(v){
                            if (checkListTipoPrescricaoInProcesso(v)) {
                                countTiposPresc++;
                                return '<option value="'+v.id_tipo_prescricao+'" '+(value && value.id_tipo_prescricao == v.id_tipo_prescricao ? 'selected' : '')+'>'+v.nome_prescricao+'</option>'
                            }
                        }).join('');
    var htmlSelectTipoPresc = '<select id="presc_tipo_prescricao" class="requiredSelect" data-key="id_tipo_prescricao" onchange="changeSelectDocsPrescricao(this);" required>'+(countTiposPresc > 1 ? '<option>&nbsp;</option>' : '')+''+optionsTiposPresc+'</select>';
    
    var optionsDocSEI = optionSelectDocsPrescricao(value);
    var htmlSelectDocSEI = '<select id="presc_documento_relacionado" class="requiredSelect" onchange="changeDocumentoRelacionado(this); changeDocumentoDtAssinatura(this);" data-key="documento_relacionado" required><option>&nbsp;</option>'+optionsDocSEI+'</select>';

    var htmlBox =   '<div id="boxPrescricao" class="atividadeWork" data-prescricao="'+(value ? value.id_prescricao : 0)+'">'+
                    '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                    '      <tr>'+
                    '          <td style="vertical-align: bottom; text-align: left;width: 230px;" class="label">'+
                    '               <label for="presc_documento_relacionado"><i class="iconPopup iconSwitch fas fa-hourglass-half cinzaColor"></i>Tipo de Prescri\u00E7\u00E3o:</label>'+
                    '           </td>'+
                    '           <td class="required">'+
                    '               '+htmlSelectTipoPresc+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr>'+
                    '          <td style="vertical-align: bottom; text-align: left;width: 230px;" class="label">'+
                    '               <label for="presc_documento_relacionado"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i>Documento:</label>'+
                    '           </td>'+
                    '           <td class="required">'+
                    '               '+htmlSelectDocSEI+
                    '               <input type="hidden" id="presc_id_documento_sei" data-key="id_documento_sei" value="'+(value.id_documento_sei ? value.id_documento_sei : '')+'">'+
                    '               <input type="hidden" id="presc_documento_sei" data-key="documento_sei" value="'+(value.documento_sei ? value.documento_sei : '')+'">'+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr>'+
                    '           <td style="vertical-align: bottom; text-align: left;" class="label">'+
                    '               <label for="presc_data_inicio"><i class="iconPopup iconSwitch fas fa-calendar cinzaColor" style="float: initial;"></i>Data:</label>'+
                    '           </td>'+
                    '           <td class="required date">'+
                    '               <input type="datetime-local" id="presc_data_inicio" onchange="checkThisAtivRequiredFields(this);checkDtAssinatura(this);" data-key="data_inicio" value="'+(value ? moment(value.data_inicio,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm') : 0)+'" min="'+(dataMin || '')+'" '+(value && value.data_fim != '0000-00-00 00:00:00' ? 'max="'+moment(value.data_fim,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm')+'"' : '')+' required>'+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td colspan="2" style="vertical-align: bottom; text-align: left;" class="label">'+
                    '               <label for="presc_suspende_contagem"><i class="iconPopup iconSwitch fas fa-stopwatch cinzaColor"></i> Suspender a contagem prescricional?</label>'+
                    '              <div class="onoffswitch" style="float: right;">'+
                    '                  <input type="checkbox" name="onoffswitch" data-target="#listCompleteOtherAtiv" onchange="changeOptionsSavePrescricao(this)" class="onoffswitch-checkbox singleOptionConfig" id="presc_suspende_contagem" data-key="suspende_contagem" tabindex="0" '+(value && value.suspensao ? 'checked' : '')+'>'+
                    '                  <label class="onoffswitch-label" for="presc_suspende_contagem"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td colspan="2" style="vertical-align: bottom; text-align: left;" class="label">'+
                    '               <label for="presc_transito_julgado"><i class="iconPopup iconSwitch fas fa-times-circle cinzaColor"></i> Encerrar a contagem prescricional? (tr\u00E2nsito em julgado)</label>'+
                    '              <div class="onoffswitch" style="float: right;">'+
                    '                  <input type="checkbox" name="onoffswitch" data-target="#listCompleteOtherAtiv" onchange="changeOptionsSavePrescricao(this)" class="onoffswitch-checkbox singleOptionConfig" id="presc_transito_julgado" data-key="transito_julgado" tabindex="0">'+
                    '                  <label class="onoffswitch-label" for="presc_transito_julgado"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '   </table>'+
                    '</div>';

    var btnActions = [{
                        text: "Salvar",
                        icon: 'ui-icon-disk',
                        class: 'confirm',
                        click: function() {
                            if (checkAtivRequiredFields($('#presc_data_inicio')[0], 'mark')) {
                                setSavePrescricao(this);
                            }
                        }}];
                    
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</span>')
            .dialog({
                width: 700,
                title: 'Adicionar nova prescri\u00E7\u00E3o',
                open: function() { 
                    updateButtonConfirm(this, true);
                    prepareFieldsReplace(this);
                },
                buttons: btnActions
        });
}