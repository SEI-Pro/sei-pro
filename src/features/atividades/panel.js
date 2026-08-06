import { callAtiv } from './call.js';
/**
 * Atividades — painel principal e controles de navegação.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import './runtime.js';
import { getServerAtividades } from './server.js';

export function updateButtonTextarea(this_) {
    if (checkValue($(this_))) { updateButtonConfirm(this_, true) } else { updateButtonConfirm(this_, false) }
}
export function moreCommentBox(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.moreCommentBoxDiv');
    _parent.find('.moreCommentBoxText').toggle();
    _this.toggleClass('newLink_active');
    if (_parent.find('textarea').is(':visible')) {
        _parent.find('textarea').focus();
    } else {
        _parent.find('textarea').val('');
    }
}
export function moreInfoBoxAtiv(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var _moreInfo = _parent.find('.moreInfoBox');
    _this.toggleClass('newLink_active').find('i').toggleClass('fa-minus-circle fa-plus-circle');
    _moreInfo.toggle();
    var infoStatus = (_moreInfo.is(':visible')) ? 'show' : 'hide';
    setOptionsPro('moreInfoBoxAtiv', infoStatus);
}
export function moreInfoBox(this_) {
    $(this_).closest('.dialogBoxDiv').find('.moreInfoBox').toggle();
    $(this_).toggleClass('newLink_active');
}
export function toggleInfoBox(this_) {
    var _this = $(this_);
    var target = _this.data('target');
    _this.closest('.dialogBoxDiv').find(target).toggle();
    _this.toggleClass('newLink_active');
}
export function getConfigDateAtiv(value) {
    var config_unidade = callAtiv('getConfigDadosUnidade',value.sigla_unidade);
    var funcDisplay = 'filterTagView';
    var formatDate = 'YYYY-MM-DD HH:mm:ss';
    var format_hora = (config_unidade && config_unidade.count_horas) ? 'DD/MM/YYYY [\u00E0s] HH:mm' : 'DD/MM/YYYY';
    var titleDoc = value.nome_documento + ' ' + value.numero_documento;
    titleDoc = (typeof value.documento_sei !== 'undefined' && value.documento_sei !== null && parseInt(value.documento_sei) != 0)
        ? titleDoc + ' (' + value.documento_sei + ')'
        : titleDoc;
    var check_ispaused = (typeof value.data_retomada !== 'undefined' && value.data_retomada !== null && value.data_retomada == '0000-00-00 00:00:00') ? true : false;
    var tipPauseAtiv = (typeof value.data_retomada !== 'undefined' && value.data_retomada !== null && value.data_retomada != '0000-00-00 00:00:00')
        ? '<br> Retomada em: ' + moment(value.data_retomada, 'YYYY-MM-DD HH:mm:ss').format(format_hora)
        : (typeof value.data_pausa !== 'undefined' && value.data_pausa !== null && value.data_pausa != '0000-00-00 00:00:00')
            ? '<br> ' + __.Paralisada + ' em: ' + moment(value.data_pausa, 'YYYY-MM-DD HH:mm:ss').format(format_hora)
            : '';
    var tipInitAtiv = (value.data_inicio != '0000-00-00 00:00:00')
        ? '<br> Iniciada em: ' + moment(value.data_inicio, 'YYYY-MM-DD HH:mm:ss').format(format_hora) + tipPauseAtiv
        : '';
    var checklist = (value.checklist) ? '<br>' + callAtiv('getInfoAtividadeChecklist',value, 'text').replace(/'/g, "\\'") : '';
    var value_avaliacao = value.data_avaliacao != '0000-00-00 00:00:00' && value.avaliacao && value.avaliacao != 0 && value.avaliacao.length ? jmespath.search(value.avaliacao, "reverse(sort_by([*],&data_avaliacao)) | [0]") : false;
    var checkRateNull = value_avaliacao ? true : false;

    var _return = (value.data_entrega == '0000-00-00 00:00:00')
        ? {
            date: moment(value.data_distribuicao, 'YYYY-MM-DD HH:mm:ss').format(formatDate),
            dateTo: moment().format(formatDate),
            dateDue: moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss').format(formatDate),
            duecounter: 'corrido',
            countdays: true,
            workday: false,
            setdate: true,
            displayicon: (value.data_inicio != '0000-00-00 00:00:00'
                ? (moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss') >= moment())
                    ? (typeof value.data_retomada !== 'undefined' && value.data_retomada !== null && value.data_retomada == '0000-00-00 00:00:00')
                        ? 'fas fa-pause-circle laranjaColor'
                        : 'fas fa-play-circle azulColor'
                    : 'fas fa-play-circle vermelhoColor'
                : (moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss') < moment())
                    ? 'fas fa-exclamation-triangle vermelhoColor'
                    : ($.inArray(('importante' || 'urgente'), $.map(value.etiquetas, function (v) { return v.toLowerCase() })) !== -1)
                        ? 'fas fa-exclamation-circle laranjaColor'
                        : 'far fa-clock'
            ),
            displayformat: format_hora,
            duesetdate: true,
            displaydue: true,
            displaydue_txt: 'Vencimento:',
            deliverydoc: false,
            func: funcDisplay,
            paused: check_ispaused,
            displaytip: (value.id_user != 0
                ? 'Atribu\u00EDdo \u00E0 ' + value.apelido + tipInitAtiv + checklist
                : 'N\u00E3o atribu\u00EDdo' + checklist)
        } : {
            date: moment(value.data_entrega, 'YYYY-MM-DD HH:mm:ss').format(formatDate),
            dateTo: moment().format(formatDate),
            dateDue: moment(value.data_entrega, 'YYYY-MM-DD HH:mm:ss').add(45, 'd').format(formatDate),
            duecounter: 'corrido',
            countdays: true,
            workday: false,
            setdate: true,
            displayicon: (moment(value.data_entrega, 'YYYY-MM-DD HH:mm:ss') <= moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss')) ? 'fas fa-check-circle verdeColor' : 'fas fa-check-circle laranjaColor',
            displayformat: format_hora,
            duesetdate: true,
            displaydue: false,
            displaydue_txt: 'Entregue em:',
            deliverydoc: true,
            deliverydoc_style: (moment(value.data_entrega, 'YYYY-MM-DD HH:mm:ss') <= moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss')) ? 'fas fa-check-circle verdeColor' : 'fas fa-check-circle laranjaColor',
            func: funcDisplay,
            displaytip: !callAtiv('checkOptionEntidade','desativa_produtividade_geral') && ((callAtiv('checkCapacidade','chart_produtividade') || (typeof arrayConfigAtividades.perfil !== 'undefined' && value.id_user == arrayConfigAtividades.perfil.id_user))
                ? titleDoc + ' (por ' + value.apelido + ')<br>Produtividade: ' + callAtiv('getInfoAtividadeProdutividade_calc',value) + checklist
                : titleDoc + ' (por ' + value.apelido + ')' + checklist)
        };

    _return = (value.data_avaliacao != '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00')
        ? {
            date: moment(value.data_avaliacao, 'YYYY-MM-DD HH:mm:ss').format(formatDate),
            dateTo: moment().format(formatDate),
            dateDue: null,
            duecounter: 'corrido',
            countdays: true,
            workday: false,
            setdate: true,
            displayicon: false,
            displayformat: format_hora,
            duesetdate: true,
            displaydue_txt: (checkRateNull ? 'Avalia\u00E7\u00E3o dispensada em:' : 'Avaliada em:'),
            displaydue: false,
            deliverydoc: true,
            ratingdoc: true,
            deliverydoc_style: 'fas fa-star starGold' + (checkRateNull ? ' starDisabled' : ''),
            func: funcDisplay,
            displaytip: !callAtiv('checkOptionEntidade','desativa_produtividade_geral') && ((callAtiv('checkCapacidade','chart_produtividade') || (typeof arrayConfigAtividades.perfil !== 'undefined' && value.id_user == arrayConfigAtividades.perfil.id_user))
                ? 'Tempo homologado: ' + value.tempo_homologado + ' horas<br>Produtividade: ' + callAtiv('getInfoAtividadeProdutividade_calc',value) + checklist
                : 'Tempo homologado: ' + value.tempo_homologado + ' horas<br>' + checklist)
        } : _return;

    _return = (value.data_avaliacao != '0000-00-00 00:00:00' && value.data_envio != '0000-00-00 00:00:00')
        ? {
            date: moment(value.data_envio, 'YYYY-MM-DD HH:mm:ss').format(formatDate),
            dateTo: moment().format(formatDate),
            dateDue: null,
            duecounter: 'corrido',
            countdays: true,
            workday: false,
            setdate: true,
            displayicon: false,
            displayformat: format_hora,
            duesetdate: true,
            displaydue_txt: __.Arquivada + ' em:',
            displaydue: false,
            deliverydoc: true,
            senddoc: true,
            deliverydoc_style: 'fas fa-archive cinzaColor',
            func: funcDisplay,
            displaytip: !callAtiv('checkOptionEntidade','desativa_produtividade_geral') && ((callAtiv('checkCapacidade','chart_produtividade') || (typeof arrayConfigAtividades.perfil !== 'undefined' && value.id_user == arrayConfigAtividades.perfil.id_user))
                ? titleDoc + ' (por ' + value.apelido + ') <br> Tempo homologado: ' + value.tempo_homologado + ' horas<br>Produtividade: ' + callAtiv('getInfoAtividadeProdutividade_calc',value) + checklist
                : titleDoc + ' (por ' + value.apelido + ') <br> Tempo homologado: ' + value.tempo_homologado + ' horas<br>' + checklist)
        } : _return;

    return _return;
}
export function editFieldAtiv(this_) {
    var _this = $(this_);
    var type_container = ($(this_).closest('.kanban-content').length > 0) ? 'kanban' : 'table';
    var _content_desc = _this.closest('.content_edit');
    var _info = _content_desc.find('span.info');
    var data = _content_desc.data();
    var value = _info.text();
    if (_info.is("[contentEditable='true']")) {
        _content_desc.removeClass('info_noclick');
        _content_desc.find('.content_btnsave').toggleClass('newLink_active newLink_confirm').find('i').toggleClass('fa-thumbs-up fa-edit');
        _info.prop('contenteditable', false).unbind();
        if (data.old != value) {
            getServerAtividades(
                {
                    action: 'edit_field',
                    field: data.field,
                    id: data.id,
                    value: value
                }, 'edit_field');
            var ativIndex = (data.id) ? parent.arrayAtividades.findIndex((obj => obj.id_demanda == data.id)) : data.id;
            arrayAtividades[ativIndex][data.field] = value;
            arrayAtividadesPro[ativIndex][data.field] = value;

            if (type_container == 'table' && $('.kanban-item').is(':visible')) {
                var kanban_item = $('.kanban-item[data-eid="_id_' + data.id + '"] .content_edit[data-field="' + data.field + '"]');
                kanban_item.find('span.info').text(value);
            }
        }
    } else {
        _content_desc.addClass('info_noclick').data('old', value);
        _info.prop('contenteditable', true).focus().on('keypress', function (e) {
            if (e.which == 13) {
                _content_desc.find('.content_btnsave').trigger('click');
                _info.html(replaceTextToProcessoSEI(replaceTextToUrl(_info.html())));
            }
        });
        _content_desc.find('.content_btnsave').toggleClass('newLink_active newLink_confirm').find('i').toggleClass('fa-thumbs-up fa-edit');
    }
}
// INSERE ICONES NA TABELA DE CONTROLE DE PROCESSOS (RECEBIDOS/GERADOS)
export function updateTableProcessos() {
    var tblProcessos = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    if (tblProcessos.find('tbody tr').not('.tableHeader').find('td.atividadeBoxDisplay').length == 0) {
        tblProcessos.find('tbody tr').not('.tableHeader').append('<td class="atividadeBoxDisplay seipro-atividades-box-display" style="text-align: center;"></td>');

        if (tblProcessos.find('thead').length > 0) {
            tblProcessos.find('thead tr').append('<th class="tituloControle tablesorter-header ' + (SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '') + ' atividadeBoxDisplay seipro-atividades-box-display"> ' + __.Demandas + '</th>');
        } else {
            $('#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first').find('.atividadeBoxDisplay').remove();
            $('#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first').not('.tableHeader').append('<th class="tituloControle tablesorter-header ' + (SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '') + ' atividadeBoxDisplay seipro-atividades-box-display"> ' + __.Demandas + '</th>');
        }
        if ($('.tabelaControle').find('tr').hasClass('tableHeader')) {
            $('.tabelaControle').find('tr.tableHeader').each(function () {
                var td = $(this).find('th.tituloControle').eq(1);
                var colspan = parseInt(td.attr('colspan'));
                if (colspan == 6) {
                    td.attr('colspan', colspan + 1);
                }
            });
        }
        if ($('#selectGroupTablePro').val() != '') {
            $('#selectGroupTablePro').trigger('change');
        }
        /*
        if ($('.tabelaControle').hasClass('tablesorter')) {
            if ($('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').length > 0) {
                $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').trigger("destroy");
                initTableSorterHome();
            }
        }
        */
    }
}
export function changeViewStatesAtiv(this_) {
    var _this = $(this_);
    var data = _this.data();
    if (data.type == 'view_ativ_send') {
        setOptionsPro('panelAtividadesViewSend', _this.is(':checked'));
    } else if (data.type == 'view_ativ_self') {
        setOptionsPro('panelAtividadesViewSelf', _this.is(':checked'));
    } else if (data.type == 'view_ativ_sub') {
        setOptionsPro('panelAtividadesViewSubordinada', _this.is(':checked'));
    } else if (data.type == 'view_disable_local') {
        changePanelLocalStorePro(this_);
    } else if (data.type == 'view_ativ_lab') {
        changePanelLabPro(this_);
    } else if (data.type == 'sync_unidades') {
        setOptionsPro('panelAtividadesViewSyncUnidade', _this.is(':checked'));
        perfilAtividadesSelected = idUnidade;
    }
    removeLocalDataAtiv();
    callAtiv('getAtividades',);
    _this.closest('td').addClass('editCellLoading');
}
export function changeProgramaAtiv(this_) {
    var _this = $(this_);
    setOptionsPro('programaAtividadesSelected', _this.val());
    removeLocalDataAtiv();
    callAtiv('getAtividades',);
    _this.closest('tr').find('td').eq(0).addClass('editCellLoading');
}
export function getConfigProgramas(this_) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        _this.closest('tr').find('.selectProgramaAtiv').show();
    } else {
        _this.closest('tr').find('.selectProgramaAtiv').hide();
    }
}
/*
export function changeViewStatesAtivSub(this_){
    var _this = $(this_);
    setOptionsPro('panelAtividadesViewSubordinada',_this.is(':checked'));
    getAtividades();
    _this.closest('td').addClass('editCellLoading');
}
export function changeViewStatesSyncUnidade(this_){
    var _this = $(this_);
    setOptionsPro('panelAtividadesViewSyncUnidade',_this.is(':checked'));
    getAtividades();
    _this.closest('td').addClass('editCellLoading');
}
*/
export function changeBaseDadosAtiv(this_) {
    var _this = $(this_);
    var perfilSelected = parseInt(_this.val());
    var configBasePro = localStorageRestorePro('configBasePro');
    // var dataAPI = jmespath.search(configBasePro, "[?baseTipo=='atividades'] | [?conexaoTipo=='api'||conexaoTipo=='googleapi']");
    var dataAPI = jmespath.search(configBasePro, "[?baseTipo=='atividades'] | [?conexaoTipo=='api']");
    var perfilLoginAtiv = (dataAPI && dataAPI !== null && dataAPI.length > 0 && typeof dataAPI[perfilSelected].KEY_USER !== 'undefined')
        ? dataAPI[perfilSelected]
        : false;
    if (perfilLoginAtiv) {
        urlServerAtiv = perfilLoginAtiv.URL_API;
        userHashAtiv = perfilLoginAtiv.KEY_USER;
        removeOptionsPro('perfilAtividadesSelected');
        setOptionsPro('configBaseSelectedPro_atividades', perfilSelected);
        localStorageStorePro('configBasePro_atividades', { URL_API: perfilLoginAtiv.URL_API, KEY_USER: perfilLoginAtiv.KEY_USER });
        removeLocalDataAtiv(true);
        callAtiv('getAtividades',);
        _this.closest('td').addClass('editCellLoading');
    }
}
export function updateAtividade_(this_) {
    removeLocalDataAtiv();
    resetDialogBoxPro('dialogBoxPro');
    updateAtividade(this_);
}
export function updateAtividade(this_ = false) {
    if (this_) { $(this_).find('i').addClass('fa-spin'); }
    callAtiv('getAtividades',);
}

// CRIA PAINEL DE GESTAO DE ATIVIDADES DO PROCESSO
export function setAtividadesProcessoHome(storeAtividades = arrayAtividadesProcPro) {
    if ($('#ifrArvore').length > 0 && typeof __ !== 'undefined') {
        var ifrArvore = $('#ifrArvore').contents();
        ifrArvore.find('#divArvore .dateboxDisplayAtiv').remove();
        $.each(storeAtividades, function (index, value) {
            var datesAtivHtml = (typeof value.data_distribuicao !== 'undefined' && value.data_distribuicao !== null) ? getDatesPreview(getConfigDateAtiv(value)) : '';
            datesAtivHtml = (datesAtivHtml != '') ? $(datesAtivHtml).find('.dateBoxIcon')[0].outerHTML : '';
            var doc_requisicao = ifrArvore.find('a#anchor' + value.id_documento_requisicao);
            if (doc_requisicao.length > 0 && datesAtivHtml != '') {
                doc_requisicao.after('<span class="dateboxDisplay dateboxDisplayAtiv" data-act="atividades-call" data-fn="actionsAtividade" data-scope="parent" data-pass-el="0" data-id="' + value.id_demanda + '">' + datesAtivHtml + '</span>');
            }
        });
        var ifrArvoreElem = (typeof getIframeArvoreElement === 'function') ? getIframeArvoreElement() : ($('#ifrArvore').length > 0 ? $('#ifrArvore')[0] : null);
        if (ifrArvore.find('.panelDadosArvore_atividades').length == 0 && ifrArvoreElem && ifrArvoreElem.contentWindow && typeof ifrArvoreElem.contentWindow.initAtividadesProcesso === 'function') {
            ifrArvoreElem.contentWindow.initAtividadesProcesso();
        }
        if (typeof moment().isoWeekdayCalc === 'undefined') $.getScript(URL_SPRO + "js/lib/moment-weekday-calc.js");
    }
}

// CRIA PAINEL INDIVIDUAL DE ATIVIDADES DO USUARIO
export function setAtividadesUser() {
    if ($('#frmProcedimentoControlar').length > 0) {
        var unidade = arrayConfigAtivUnidade;
        var plano = (
            typeof arrayConfigAtividades !== 'undefined' && arrayConfigAtividades !== null &&
            typeof arrayConfigAtividades.planos !== 'undefined' && arrayConfigAtividades.planos !== null && arrayConfigAtividades.planos.length > 0 &&
            typeof arrayConfigAtividades.perfil !== 'undefined' && arrayConfigAtividades.perfil !== null
        ) ? jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + arrayConfigAtividades.perfil.id_user + "`] | [0]") : null;
        var filterAtivPanel = $('#tabelaAtivPanel').find('.filterTablePro');
        var target = $('#atividadesProDiv');
        if (plano !== null && target.length > 0) {
            target.find('.atividadesProStatus').remove();
            var htmlUser = '<div id="atividadesStatus" class="seipro-atividades-status atividadesProStatus">' +
                '    <div id="statusUser"><canvas id="chartStatusUser" width="600" height="90"></canvas></div>' +
                '</div>';
            target.prepend(htmlUser).css('margin-top', '90px');
            var element = $('#chartStatusUser');
            waitLoadProSimple(element, function () {
                var mostrar_notas = jmespath.search(arrayConfigAtividades.unidades, "[?id_unidade==`" + plano.id_unidade + "`] | [0].config.planos.mostrar_notas");
                var apelido_display = (mostrar_notas !== null && mostrar_notas) ? 'apelido_avaliacao' : 'apelido';
                var chartStatusUser = callAtiv('getSingleChartTempoPlano',element, plano, plano[apelido_display]);
                chartStatusUser.options.scales.x.ticks.display = false;
                chartStatusUser.options.plugins.legend.display = false;
                chartStatusUser.options.plugins.title = { display: true, text: unidade.nome_unidade + ' - ' + unidade.sigla_unidade + ' [clique para detalhes]' };
                chartStatusUser.update();
                checkProgramacaoPlano(plano);

                element.on('click', function (evt) {
                    callAtiv('getChartProdutividadeMes',plano.id_plano);
                });
            });
            filterAtivPanel.css('top', '140px');
        } else {
            filterAtivPanel.css('top', '52px');
        }
    }
}
export function checkProgramacaoPlano(v) {
    var porcentagemAlerta = callAtiv('getOptionEntidade','alerta_tempo_programado');
    var tempoProgramado = moment(v.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').diff(moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss'), 'days');
    tempoProgramado = (tempoProgramado) ? v.tempo_proporcional / tempoProgramado : tempoProgramado;
    tempoProgramado = (tempoProgramado) ? parseInt((moment().diff(moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss'), 'days')) * tempoProgramado) : tempoProgramado;
    tempoProgramado = (tempoProgramado > v.tempo_proporcional) ? v.tempo_proporcional : tempoProgramado;
    tempoProgramado = (tempoProgramado || tempoProgramado == 0) ? tempoProgramado : false;
    if (tempoProgramado && porcentagemAlerta && porcentagemAlerta != 0 && tempoProgramado * (porcentagemAlerta / 100) > v.tempo_pactuado && tempoProgramado * (porcentagemAlerta / 100) > v.tempo_proporcional) {
        $('#statusUser_alertPlano').remove();
        $('#statusUser').append('<div id="statusUser_alertPlano" style="position: absolute;margin-top: -85px;background: #e46e64;color: white;font-size: 10pt;border-radius: 5px;padding: 5px 10px;"><i class="fas fa-exclamation-triangle brancoColor" style="margin-right: 5px;"></i>Tempo pactuado muito distante do tempo programado<i class="fas fa-times-circle brancoColor" style="margin-left: 5px;cursor: pointer;" data-act="atividades-dismiss-alert"></i></div>');
    }
}
export function setToolbarAtiv() {
    htmlToolbarDoc = '<div id="toolbar_atividades" class="hidden">' +
        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="none" data-action="info_atividade"><i style="margin: 0 5px;" class="fas fa-info-circle azulColor"></i> <span class="info" alt="Informa\u00E7\u00F5es ' + __.da_demanda + '">Informa\u00E7\u00F5es ' + __.da_demanda + '</span></a>' +
        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="start_atividade" data-action="edit_atividade"><i style="margin: 0 5px;" class="fas fa-pencil-alt azulColor"></i> <span class="info" alt="Editar ' + __.Demanda + '">Editar ' + __.Demanda + '</span></a>' +
        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="start_atividade" data-action="edit_atividade" data-subaction="notify_atividade"><i style="margin: 0 5px;" class="fas fa-envelope azulColor"></i> <span class="info" alt="Gerar Notifica\u00E7\u00E3o">Gerar Notifica\u00E7\u00E3o</span></a>' +

        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="complete_atividade pause_atividade" data-action="pause_atividade"><i style="margin: 0 5px;" class="fas fa-pause-circle laranjaColor"></i> <span class="info" alt="Inserir ' + __.Paralisacao + '">Inserir ' + __.Paralisacao + '</span></a>' +
        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="complete_atividade play_atividade" data-action="pause_atividade"><i style="margin: 0 5px;" class="fas fa-play-circle azulColor"></i> <span class="info" alt="Inserir ' + __.Retomar + ' ' + __.Demanda + '">' + __.Retomar + ' ' + __.Demanda + '</span></a>' +
        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="complete_atividade paused_atividade" data-action="extend_atividade"><i style="margin: 0 5px;" class="fas fa-retweet azulColor"></i> <span class="info" alt="' + __.Prorrogar + ' Prazo">' + __.Prorrogar + ' Prazo</span></a>' +
        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="complete_atividade rate_atividade" data-action="variation_atividade"><i style="margin: 0 5px;" class="fas fa-graduation-cap azulColor"></i> <span class="info" alt="Alterar ' + __.Complexidade + '">Alterar ' + __.Complexidade + '</span></a>' +
        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="complete_atividade rate_atividade" data-action="type_atividade"><i style="margin: 0 5px;" class="fas fa-clipboard-list azulColor"></i> <span class="info" alt="Atribuir ' + __.Atividade + '">Atribuir ' + __.Atividade + '</span></a>' +
        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="none" data-action="history_atividade"><i style="margin: 0 5px;" class="fas fa-scroll azulColor"></i> <span class="info" alt="Hist\u00F3rico ' + __.da_demanda + '">Hist\u00F3rico ' + __.da_demanda + '</span></a>' +
        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="complete_atividade" data-action="start_cancel_atividade"><i style="margin: 0 5px;" class="fas fa-times-circle vermelhoColor"></i> <span class="info" alt="Cancelar In\u00EDcio">Cancelar In\u00EDcio</span></a>' +
        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="rate_default_atividade" data-action="rate_default_atividade"><i style="margin: 0 5px;" class="fas fa-exclamation-circle vermelhoColor"></i> <span class="info" alt="Omiss\u00E3o de ' + __.Demanda + '">Omiss\u00E3o de ' + __.Demanda + '</span></a>' +

        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="rate_atividade" data-action="complete_edit_atividade"><i style="margin: 0 5px;" class="fas fa-pencil-alt azulColor"></i> <span class="info" alt="Editar Conclus\u00E3o">Editar Conclus\u00E3o</span></a>' +
        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="rate_atividade" data-action="complete_cancel_atividade"><i style="margin: 0 5px;" class="fas fa-times-circle vermelhoColor"></i> <span class="info" alt="Cancelar Conclus\u00E3o">Cancelar Conclus\u00E3o</span></a>' +

        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="send_atividade" data-action="rate_edit_atividade"><i style="margin: 0 5px;" class="fas fa-pencil-alt azulColor"></i> <span class="info" alt="Editar Avalia\u00E7\u00E3o">Editar Avalia\u00E7\u00E3o</span></a>' +
        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="send_atividade" data-action="rate_cancel_atividade"><i style="margin: 0 5px;" class="fas fa-times-circle vermelhoColor"></i> <span class="info" alt="Cancelar Avalia\u00E7\u00E3o">Cancelar Avalia\u00E7\u00E3o</span></a>' +

        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="archive_atividade" data-action="send_cancel_atividade"><i style="margin: 0 5px;" class="fas fa-times-circle vermelhoColor"></i> <span class="info" alt="Cancelar Arquivamento">Cancelar Arquivamento</span></a>' +

        '   <a href="#" style="width: 175px;padding-top: 10px;display:none;" data-mode="start_atividade delete_atividade_all" data-action="delete_atividade"><i style="margin: 0 5px;" class="fas fa-trash-alt vermelhoColor"></i> <span class="info" alt="Excluir ' + __.Demanda + '">Excluir ' + __.Demanda + '</span></a>' +
        '<div>';
    return htmlToolbarDoc;
}
// CRIA PAINEL DE GESTAO DE ATIVIDADES
export function setPanelAtividades(storeAtividades = arrayAtividadesPro) {
    var statusView = (getOptionsPro('atividadesProDiv') == 'hide') ? 'display:none;' : 'display: inline-table;';
    var statusIconShow = (getOptionsPro('atividadesProDiv') == 'hide') ? '' : 'display:none;';
    var statusIconHide = (getOptionsPro('atividadesProDiv') == 'hide') ? 'display:none;' : '';
    // var arrayProcessosUnidade = getProcessoUnidadePro();
    var viewModePanel = (getOptionsPro('panelAtividadesView')) ? getOptionsPro('panelAtividadesView') : 'Tabela';
    var countAtividade = (storeAtividades.length == 1) ? '<span class="count">' + storeAtividades.length + '</span> registro:' : '<span class="count">' + storeAtividades.length + '</span> registros:';
    var countUnidades = (storeAtividades.length > 0) ? uniqPro(jmespath.search(storeAtividades, "[?sigla_unidade].sigla_unidade")).length : 0;
    var htmlTableAtividades = (userHashAtiv == '') ? '<div class="g-signin2" data-onsuccess="onSignIn" data-longtitle="true"></div>' : '<div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div>';
    /*         htmlTableAtividades = (googleOneTap && userHashAtiv == '') 
            ?   '<div id="g_id_onload"'+
                '        data-client_id="'+CLIENT_ID_PRO+'"'+
                '        data-context="signin"'+
                '        data-ux_mode="popup"'+
                '        data-callback="onSignIn"'+
                '        data-nonce=""'+
                '        data-auto_select="true">'+
                '</div>'+
                '<div class="g_id_signin"'+
                '        data-type="standard"'+
                '        data-shape="pill"'+
                '        data-theme="filled_blue"'+
                '        data-text="$ {button.text}"'+
                '        data-size="large"'+
                '        data-locale="pt-BR"'+
                '        data-logo_alignment="left"'+
                '        data-width="300">'+
                '</div>'
            : htmlTableAtividades; */
    updateTableProcessos();
    if (storeAtividades.length > 0 && (!getOptionsPro('panelHomeView') || getOptionsPro('panelHomeView') == 'Atividade')) {

        function getTdRow(type) {
            var html = '';
            if (type == 'proc') {
                html = '           <th class="tituloControle" data-column-order="0" data-filter-type="proc">ID / Processo / Requisi\u00E7\u00E3o</th>';
            } else if (type == 'date') {
                html = '           <th class="tituloControle tituloFilter" data-column-order="1" data-filter-type="date">Status</th>';
            } else if (type == 'action') {
                html = '           <th class="tituloControle tituloFilter" data-column-order="2" data-filter-type="action">A\u00E7\u00E3o</th>';
            } else if (type == 'user') {
                html = '           <th class="tituloControle tituloFilter" data-column-order="3" data-filter-type="user">Respons\u00E1vel e Tempo Pactuado</th>';
            } else if (type == 'etiqueta') {
                html = '           <th class="tituloControle tituloFilter" data-column-order="4" data-column-order="0" data-filter-type="etiqueta">Etiqueta</th>';
            } else if (type == 'desc') {
                html = '           <th class="tituloControle" data-column-order="5" style="width: 30%;" data-filter-type="desc">' + __.Demanda + ' e Assunto</th>';
            }
            return html;
        }
        var arrayColumnSort = (getOptionsPro('panelAtividadesViewTableSort'))
            ? getOptionsPro('panelAtividadesViewTableSort')
            : [
                "proc",
                "date",
                "action",
                "user",
                "etiqueta",
                "desc"
            ];
        var htmlColumnsAtividades = $.map(arrayColumnSort, function (v) {
            return getTdRow(v);
        }).join('');

        htmlTableAtividades = '<table class="tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table" data-tabletype="atividades" style="margin-top: 0;">' +
            '   <caption class="infraCaption" style="text-align: left; margin-top: 10px;">' + countAtividade + '</caption>' +
            '   <thead>' +
            '       <tr class="tableHeader">' +
            '           <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_atividades" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_atividades" data-act="atividades-select-all" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck"></a></th>' +
            '           ' + htmlColumnsAtividades +
            '       </tr>' +
            '   </thead>' +
            '   <tbody>';
        $('.tabelaControle .atividadeBoxDisplay').html('');
        htmlTableAtividades += '   </tbody>' +
            '</table>';
    }
    var idOrder = (getOptionsPro('orderPanelHome') && jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='atividadesPro'].index | length(@)") > 0) ? jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='atividadesPro'].index | [0]") : '';

    var selectListUsers = '<select id="selectChartUserAtiv" data-type="user" data-act="atividades-change-chart" style="max-width: 160px; float: right;" class="selectPro chosen-min" data-placeholder="Filtrar por usu\u00E1rio" ><option value="0" data-label="">&nbsp;</option></select>';

    var selectListProgramas = '<select id="selectChartProgramasAtiv" data-type="programas" data-act="atividades-change-chart" data-placeholder="Filtrar por ' + __.programa + '" style="max-width: 260px; width: 300px; float: right;" class="selectPro  chosen-min"><option value="0" data-label="">&nbsp;</option></select>';

    var optionSelectsPerfil = (typeof arrayConfigAtividades.perfil !== 'undefined' && typeof arrayConfigAtividades.perfil.lotacoes_obj !== 'undefined') ? callAtiv('getOptionSelectPerfil',arrayConfigAtividades.perfil.lotacoes_obj, getOptionsPro('perfilAtividadesSelected')) : '';
    var selectListPerfilLotacao = (optionSelectsPerfil == '') ? '' : '<select data-type="perfil" data-act="atividades-change-perfil" data-placeholder="Filtrar por usu\u00E1rio" style="max-width: 300px; float: right;" class="selectPro">' + optionSelectsPerfil + '</select>';

    var urlGuiaUtilizacao = callAtiv('checkOptionEntidade','guia_utilizacao') ? callAtiv('getOptionEntidade','guia_utilizacao') : 'https://bit.ly/Guia-ANTAQPro';
    var btnGuiaUtilizacao = '<a class="newLink iconAtividade_guia" href="' + urlGuiaUtilizacao + '" target="_blank" data-tip="Guia de Utiliza\u00E7\u00E3o" style="margin: 0;font-size: 14pt;float: right;">' +
        '    <i class="fas fa-graduation-cap"></i>' +
        '</a>';

    var iconLabel = localStorage.getItem('iconLabel');
    var iconBoxSlim = localStorage.getItem('seiSlim');

    var htmlPanelAtividades = '<div class="panelHomePro seipro-atividades-root" style="display: inline-block; width: 100%;" id="atividadesPro" class="seipro-atividades-root" data-order="' + idOrder + '">' +
        '   <div class="infraBarraLocalizacao titlePanelHome ' + (iconLabel ? 'iconLabel' : '') + '">' +
        '       <span class="titlePanel panelHome panelHomeAtividade" style="' + (getOptionsPro('panelHomeView') == 'Atividade' || !getOptionsPro('panelHomeView') ? '' : 'display:none;') + '">' +
        '           <i class="fas fa-check-circle verdeColor" style="margin: 0 5px; font-size: 1.1em;"></i>' +
        '           ' + __.Demandas +
        '       </span>' +
        (callAtiv('checkCapacidade','view_afastamento') ?
            '       <span class="titlePanel panelHome panelHomeAfastamento" style="' + (getOptionsPro('panelHomeView') == 'Afastamento' ? '' : 'display:none;') + '">' +
            '           <i class="fas fa-luggage-cart verdeColor" style="margin: 0 5px; font-size: 1.1em;"></i>' +
            '           Afastamentos' +
            '       </span>' : '') +
        (callAtiv('checkCapacidade','view_contato') ?
            '       <span class="titlePanel panelHome panelHomeContato" style="' + (getOptionsPro('panelHomeView') == 'Contato' ? '' : 'display:none;') + '">' +
            '           <i class="fas fa-id-card verdeColor" style="margin: 0 5px; font-size: 1.1em;"></i>' +
            '           Contatos' +
            '       </span>' : '') +
        (callAtiv('checkCapacidade','view_relatorio') ?
            '       <span class="titlePanel panelHome panelHomeRelatorio" style="' + (getOptionsPro('panelHomeView') == 'Relatorio' ? '' : 'display:none;') + '">' +
            '           <i class="fas fa-chart-pie verdeColor" style="margin: 0 5px; font-size: 1.1em;"></i>' +
            '           Relat\u00F3rios' +
            '       </span>' : '') +
        '       <span class="titlePanel panelHome panelHomeConfiguracao" style="' + (getOptionsPro('panelHomeView') == 'Configuracao' ? '' : 'display:none;') + '">' +
        '           <i class="fas fa-cog verdeColor" style="margin: 0 5px; font-size: 1.1em;"></i>' +
        '           Configura\u00E7\u00F5es' +
        '       </span>' +
        '       <a class="newLink" id="atividadesProDiv_showIcon" data-act="atividades-panel-show" data-tip="Mostrar Tabela" style="font-size: 11pt; ' + statusIconShow + '"><i class="fas fa-plus-square cinzaColor"></i></a>' +
        '       <a class="newLink" id="atividadesProDiv_hideIcon" data-act="atividades-panel-hide" data-tip="Recolher Tabela" style="font-size: 11pt; ' + statusIconHide + '"><i class="fas fa-minus-square cinzaColor"></i></a>' +
        '   </div>' +
        '   <div id="atividadesProDiv" class="seipro-atividades-panel" style="width: 98%; ' + statusView + '">' +
        '   	<div id="atividadesProActions" class="seipro-atividades-actions panelHome panelHomeAtividade" style="' + (getOptionsPro('panelHomeView') == 'Atividade' || !getOptionsPro('panelHomeView') ? '' : 'display:none;') + ' position: absolute; z-index: 19999; left: 200px; width: calc(100% - 220px)">' +
        '           <div class="btn-group atividadesBtnPanel seipro-atividades-btn-panel" role="group" style="float: right;margin-right: 10px;">' +
        '              <button type="button" data-act="atividades-panel-view" data-tip="Tabela" data-value="Tabela" class="btn btn-sm btn-light ' + (getOptionsPro('panelAtividadesView') == 'Tabela' || !getOptionsPro('panelAtividadesView') ? 'active' : '') + '"><i class="fas fa-table" style="color: #888;"></i> <span class="text">Tabela</span></button>' +
        '              <button type="button" data-act="atividades-panel-view" data-tip="Quadro" data-value="Quadro" class="btn btn-sm btn-light ' + (getOptionsPro('panelAtividadesView') == 'Quadro' ? 'active' : '') + '"><i class="fas fa-project-diagram" style="color: #888;"></i> <span class="text">Quadro</span></button>' +
        '              <button type="button" data-act="atividades-panel-view" data-tip="Cronograma" data-value="Cronograma" class="btn btn-sm btn-light ' + (getOptionsPro('panelAtividadesView') == 'Cronograma' ? 'active' : '') + '"><i class="fas fa-tasks" style="color: #888;"></i> <span class="text">Cronograma</span></button>' +
        (callAtiv('checkCapacidade','chart_demandas') ?
            '              <button type="button" data-act="atividades-panel-view" data-value="Relatorio" data-tip="Relat\u00F3rio" class="btn btn-sm btn-light ' + (getOptionsPro('panelAtividadesView') == 'Relatorio' ? 'active' : '') + '"><i class="fas fa-chart-line" style="color: #888;"></i> <span class="text">Painel</span></button>'
            : '') +
        '           </div>' +
        '           ' + selectListPerfilLotacao +
        '           <a class="newLink iconAtividade_update" data-act="atividades-update" data-tip="Atualizar Informa\u00E7\u00F5es" style="margin: 0;font-size: 14pt;float: right;">' +
        '               <i class="fas fa-sync-alt"></i>' +
        '           </a>' +
        '           ' + btnGuiaUtilizacao +
        '   	</div>' +
        (callAtiv('checkCapacidade','view_afastamento') ?
            '   	<div id="afastamentosProActions" class="panelHome panelHomeAfastamento" style="' + (getOptionsPro('panelHomeView') == 'Afastamento' ? '' : 'display:none;') + ' position: absolute; z-index: 9999; left: 250px; width: calc(100% - 270px)">' +
            '           <div class="btn-group" role="group" style="float: right;margin-right: 10px;">' +
            '              <button type="button" data-act="atividades-panel-afast" data-value="Tabela" class="btn btn-sm btn-light ' + (getOptionsPro('panelAfastamentosView') == 'Tabela' || !getOptionsPro('panelAfastamentosView') ? 'active' : '') + '">Tabela</button>' +
            '              <button type="button" data-act="atividades-panel-afast" data-value="Cronograma" class="btn btn-sm btn-light ' + (getOptionsPro('panelAfastamentosView') == 'Cronograma' ? 'active' : '') + '">Cronograma</button>' +
            '           </div>' +
            '           ' + selectListPerfilLotacao +
            '           <a class="newLink iconAtividade_update" data-act="atividades-update" data-tip="Atualizar Informa\u00E7\u00F5es" style="margin: 0;font-size: 14pt;float: right;">' +
            '               <i class="fas fa-sync-alt"></i>' +
            '           </a>' +
            '           ' + btnGuiaUtilizacao +
            (callAtiv('checkCapacidade','save_afastamento') ?
                '           <a class="newLink iconAfastamento_add" data-act="atividades-afastamento-save" data-tip="Adicionar Afastamento" style="margin: 0;font-size: 14pt;">' +
                '               <i class="fas fa-user-clock"></i>' +
                '           </a>' +
                '' : '') +
            (callAtiv('checkCapacidade','delete_afastamento') ?
                '           <a class="newLink iconAfastamento_remove" data-act="atividades-afastamento-remove" data-tip="Remover Afastamentos" style="margin: 0;font-size: 14pt; display: none">' +
                '                   <span class="fa-layers fa-fw">' +
                '                       <i class="fas fa-trash-alt"></i>' +
                '                       <span class="fa-layers-counter">1</span>' +
                '                   </span>' +
                '           </a>' +
                '' : '') +
            '           <span class="modulesActions">' +
            '               <a class="newLink newLink_active iconBoxModules iconAtividade_view" data-act="atividades-panel-home" style="font-size: 14pt;" data-value="Atividade">' +
            '                  <i class="fas fa-chevron-left cinzaColor"></i>' +
            '                  <i class="fas fa-check-circle cinzaColor"></i>' +
            '                  <span class="txt_cinza" style="font-size: 80%;vertical-align: text-top;"> ' + __.Demandas + '</span>' +
            '               </a>' +
            '               <a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconConfiguracao_view" data-tip="Configura\u00E7\u00F5es" data-act="' + (callAtiv('checkOptionEntidade','modal_configuracoes') ? 'atividades-config-modal' : 'atividades-panel-home') + '" style="font-size: 14pt;" data-value="Configuracao">' +
            '                  <i class="fas fa-cog cinzaColor"></i>' +
            '                  <span class="newIconTitle">Configura\u00E7\u00F5es</span>' +
            '               </a>' +
            (callAtiv('checkCapacidade','view_relatorio') ?
                '               <a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconRelatorio_view" data-tip="Relat\u00F3rios" data-act="atividades-panel-home" style="font-size: 14pt;" data-value="Relatorio">' +
                '                  <i class="fas fa-chart-pie cinzaColor"></i>' +
                '                  <span class="newIconTitle">Relat\u00F3rios</span>' +
                '               </a>' : '') +
            (callAtiv('checkCapacidade','view_contato') ?
                '               <a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconContato_view" data-tip="Contatos" data-act="atividades-panel-home" style="font-size: 14pt;" data-value="Contato">' +
                '                  <i class="fas fa-id-card cinzaColor"></i>' +
                '                  <span class="newIconTitle">Contatos</span>' +
                '               </a>' : '') +
            '           </span>' +
            '   	</div>' : '') +
        (callAtiv('checkCapacidade','view_contato') ?
            '   	<div id="contatosProActions" class="panelHome panelHomeContato" style="' + (getOptionsPro('panelHomeView') == 'Contato' ? '' : 'display:none;') + ' position: absolute; z-index: 9999; left: 250px; width: calc(100% - 270px)">' +
            '           ' + selectListPerfilLotacao +
            '           <a class="newLink iconAtividade_update" data-act="atividades-update" data-tip="Atualizar Informa\u00E7\u00F5es" style="margin: 0;font-size: 14pt;float: right;">' +
            '               <i class="fas fa-sync-alt"></i>' +
            '           </a>' +
            '           ' + btnGuiaUtilizacao +
            '           <span class="modulesActions">' +
            '               <a class="newLink newLink_active iconBoxModules iconAtividade_view" data-act="atividades-panel-home" style="font-size: 14pt;" data-value="Atividade">' +
            '                  <i class="fas fa-chevron-left cinzaColor"></i>' +
            '                  <i class="fas fa-check-circle cinzaColor"></i>' +
            '                  <span class="txt_cinza" style="font-size: 80%;vertical-align: text-top;"> ' + __.Demandas + '</span>' +
            '               </a>' +
            '               <a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconConfiguracao_view" data-tip="Configura\u00E7\u00F5es" data-act="' + (callAtiv('checkOptionEntidade','modal_configuracoes') ? 'atividades-config-modal' : 'atividades-panel-home') + '" style="font-size: 14pt;" data-value="Configuracao">' +
            '                  <i class="fas fa-cog cinzaColor"></i>' +
            '                  <span class="newIconTitle">Configura\u00E7\u00F5es</span>' +
            '               </a>' +
            (callAtiv('checkCapacidade','view_relatorio') ?
                '               <a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconRelatorio_view" data-tip="Relat\u00F3rios" data-act="atividades-panel-home" style="font-size: 14pt;" data-value="Relatorio">' +
                '                  <i class="fas fa-chart-pie cinzaColor"></i>' +
                '                  <span class="newIconTitle">Relat\u00F3rios</span>' +
                '               </a>' : '') +
            (callAtiv('checkCapacidade','view_afastamento') ?
                '               <a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconAfastamento_view" data-tip="Afastamentos" data-act="atividades-panel-home" style="font-size: 14pt;" data-value="Afastamento">' +
                '                  <i class="fas fa-luggage-cart cinzaColor"></i>' +
                '                  <span class="newIconTitle">Afastamento</span>' +
                '               </a>' : '') +
            '           </span>' +
            '   	</div>' : '') +
        '   	<div id="configuracoesProActions" class="panelHome panelHomeConfiguracao" style="' + (getOptionsPro('panelHomeView') == 'Configuracao' ? '' : 'display:none;') + ' position: absolute; z-index: 9999; left: 240px; width: calc(100% - 260px)">' +
        '           ' + selectListPerfilLotacao +
        '           <a class="newLink iconAtividade_update" data-act="atividades-update" data-tip="Atualizar Informa\u00E7\u00F5es" style="margin: 0;font-size: 14pt;float: right;">' +
        '               <i class="fas fa-sync-alt"></i>' +
        '           </a>' +
        '           ' + btnGuiaUtilizacao +
        (callAtiv('checkCapacidade','config_atividades') ? getHtmlActionsConfig('atividades') : '') +
        (callAtiv('checkCapacidade','config_planos') || callAtiv('checkCapacidade','config_self_planos') ? getHtmlActionsConfig('planos') : '') +
        (callAtiv('checkCapacidade','config_termos') || callAtiv('checkCapacidade','config_self_termos') ? getHtmlActionsConfig('termos') : '') +
        (callAtiv('checkCapacidade','config_programas') ? getHtmlActionsConfig('programas') : '') +
        (callAtiv('checkCapacidade','config_users') ? getHtmlActionsConfig('users') : '') +
        (callAtiv('checkCapacidade','config_unidades') ? getHtmlActionsConfig('unidades') : '') +
        (callAtiv('checkCapacidade','config_mapas') ? getHtmlActionsConfig('mapas') : '') +
        (callAtiv('checkCapacidade','config_acoes') ? getHtmlActionsConfig('acoes') : '') +
        (callAtiv('checkCapacidade','config_entregas') ? getHtmlActionsConfig('entregas') : '') +
        (callAtiv('checkCapacidade','config_objetivos') ? getHtmlActionsConfig('objetivos') : '') +
        (callAtiv('checkCapacidade','config_cadeia_valor') ? getHtmlActionsConfig('cadeia_valor') : '') +
        (callAtiv('checkCapacidade','config_tipos_prescricoes') ? getHtmlActionsConfig('tipos_prescricoes') : '') +
        (callAtiv('checkCapacidade','config_tipos_metadados') ? getHtmlActionsConfig('tipos_metadados') : '') +
        (callAtiv('checkCapacidade','config_tipos_eixos') ? getHtmlActionsConfig('tipos_eixos') : '') +
        (callAtiv('checkCapacidade','config_tipos_entregas') ? getHtmlActionsConfig('tipos_entregas') : '') +
        (callAtiv('checkCapacidade','config_tipos_documentos') ? getHtmlActionsConfig('tipos_documentos') : '') +
        (callAtiv('checkCapacidade','config_tipos_requisicoes') ? getHtmlActionsConfig('tipos_requisicoes') : '') +
        (callAtiv('checkCapacidade','config_tipos_avaliacoes') ? getHtmlActionsConfig('tipos_avaliacoes') : '') +
        (callAtiv('checkCapacidade','config_tipos_justificativas') ? getHtmlActionsConfig('tipos_justificativas') : '') +
        (callAtiv('checkCapacidade','config_tipos_modalidades') ? getHtmlActionsConfig('tipos_modalidades') : '') +
        (callAtiv('checkCapacidade','config_tipos_motivos') ? getHtmlActionsConfig('tipos_motivos') : '') +
        (callAtiv('checkCapacidade','config_tipos_capacidades') ? getHtmlActionsConfig('tipos_capacidades') : '') +
        (callAtiv('checkCapacidade','config_perfis') ? getHtmlActionsConfig('perfis') : '') +
        (callAtiv('checkCapacidade','config_nomenclaturas') ? getHtmlActionsConfig('nomenclaturas') : '') +
        (callAtiv('checkCapacidade','config_entidades') ? getHtmlActionsConfig('entidades') : '') +
        '           <span class="modulesActions">' +
        '               <a class="newLink newLink_active iconBoxModules iconAtividade_view" data-act="atividades-panel-home" style="font-size: 14pt;" data-value="Atividade">' +
        '                  <i class="fas fa-chevron-left cinzaColor"></i>' +
        '                  <i class="fas fa-check-circle cinzaColor"></i>' +
        '                  <span class="txt_cinza" style="font-size: 80%;vertical-align: text-top;"> ' + __.Demandas + '</span>' +
        '               </a>' +
        (callAtiv('checkCapacidade','view_afastamento') ?
            '               <a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconAfastamento_view" data-tip="Afastamentos" data-act="atividades-panel-home" style="font-size: 14pt;" data-value="Afastamento">' +
            '                  <i class="fas fa-luggage-cart cinzaColor"></i>' +
            '                  <span class="newIconTitle">Afastamentos</span>' +
            '               </a>' : '') +
        (callAtiv('checkCapacidade','view_contato') ?
            '               <a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconContato_view" data-tip="Contatos" data-act="atividades-panel-home" style="font-size: 14pt;" data-value="Contato">' +
            '                  <i class="fas fa-id-card cinzaColor"></i>' +
            '                  <span class="newIconTitle">Contatos</span>' +
            '               </a>' : '') +
        (callAtiv('checkCapacidade','view_relatorio') ?
            '               <a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconRelatorio_view" data-tip="Relat\u00F3rios" data-act="atividades-panel-home" style="font-size: 14pt;" data-value="Relatorio">' +
            '                  <i class="fas fa-chart-pie cinzaColor"></i>' +
            '                  <span class="newIconTitle">Relat\u00F3rios</span>' +
            '               </a>' : '') +
        '           </span>' +
        '   	</div>' +
        '   	<div id="relatoriosProActions" class="panelHome panelHomeRelatorio" style="' + (getOptionsPro('panelHomeView') == 'Relatorio' ? '' : 'display:none;') + ' position: absolute; z-index: 9999; left: 240px; width: calc(100% - 260px)">' +
        '           <div class="btn-group" role="group" style="float: right;margin-right: 10px;">' +
        '              <button type="button" data-act="atividades-panel-relatorio" data-value="Tabela" class="btn btn-sm btn-light ' + (getOptionsPro('panelRelatoriosView') == 'Tabela' || !getOptionsPro('panelRelatoriosView') ? 'active' : '') + '">Tabela</button>' +
        '              <button type="button" data-act="atividades-panel-relatorio" data-value="Grafico" class="btn btn-sm btn-light ' + (getOptionsPro('panelRelatoriosView') == 'Grafico' ? 'active' : '') + '">Gr\u00E1fico</button>' +
        '           </div>' +
        '           ' + selectListPerfilLotacao +
        '           <a class="newLink iconAtividade_update" data-act="atividades-update" data-tip="Atualizar Informa\u00E7\u00F5es" style="margin: 0;font-size: 14pt;float: right;">' +
        '               <i class="fas fa-sync-alt"></i>' +
        '           </a>' +
        '           ' + btnGuiaUtilizacao +
        '           <span class="modulesActions">' +
        '               <a class="newLink newLink_active iconBoxModules iconAtividade_view" data-act="atividades-panel-home" style="font-size: 14pt;" data-value="Atividade">' +
        '                  <i class="fas fa-chevron-left cinzaColor"></i>' +
        '                  <i class="fas fa-check-circle cinzaColor"></i>' +
        '                  <span class="txt_cinza" style="font-size: 80%;vertical-align: text-top;"> ' + __.Demandas + '</span>' +
        '               </a>' +
        (callAtiv('checkCapacidade','view_afastamento') ?
            '               <a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconAfastamento_view" data-tip="Afastamentos" data-act="atividades-panel-home" style="font-size: 14pt;" data-value="Afastamento">' +
            '                  <i class="fas fa-luggage-cart cinzaColor"></i>' +
            '                  <span class="newIconTitle">Afastamentos</span>' +
            '               </a>' : '') +
        (callAtiv('checkCapacidade','view_contato') ?
            '               <a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconContato_view" data-tip="Contatos" data-act="atividades-panel-home" style="font-size: 14pt;" data-value="Contato">' +
            '                  <i class="fas fa-id-card cinzaColor"></i>' +
            '                  <span class="newIconTitle">Contatos</span>' +
            '               </a>' : '') +
        '               <a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconConfiguracao_view" data-tip="Configura\u00E7\u00F5es" data-act="' + (callAtiv('checkOptionEntidade','modal_configuracoes') ? 'atividades-config-modal' : 'atividades-panel-home') + '" style="font-size: 14pt;" data-value="Configuracao">' +
        '                  <i class="fas fa-cog cinzaColor"></i>' +
        '                  <span class="newIconTitle">Configura\u00E7\u00F5es</span>' +
        '               </a>' +
        '           </span>' +
        '   	</div>' +
        '   	<div class="panelInfoHome panelInfoHomeAtividade seipro-atividades-info-home" style="' + (getOptionsPro('panelHomeView') == 'Atividade' || !getOptionsPro('panelHomeView') ? '' : 'display:none;') + '">' +
        '   	    <div id="tabelaAtivPanel" class="seipro-atividades-table-panel tabelaPanelScroll" style="margin-top: 40px;">' +
        '               ' + htmlTableAtividades +
        '   	    </div>' +
        '   	    <div id="ganttAtivPanel" class="seipro-atividades-gantt ganttAtividade" style="max-width: 800px; display:none; padding-top: 20px; position: relative;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
        '   	    <div id="kanbanAtivPanel" class="kanbanAtividade" style="display:none; padding-top: 50px; position: relative;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
        '   	    <div id="chartAtivPanel" class="seipro-atividades-chart chartAtividade" style="display:none; padding-top: 20px; position: relative;">' +
        '   	        <div id="chartAtivActions" class="chartAtivPanelDiv" style="width: 100%;position: absolute;right: 0;z-index: 99;">' +
        '   	            ' + selectListUsers + selectListProgramas +
        '   	        </div>' +
        '   	        <div id="tabChartAtivPanel" style="border: none; min-height: 300px; margin: 0;">' +
        '                   <ul>' +
        '                      <li><a href="#tabChartAtivPanel-distribuicao"><i class="fas fa-list-alt cinzaColor" style="margin-right: 5px;"></i> Distribui\u00E7\u00E3o</a></li>' +
        '                      <li><a href="#tabChartAtivPanel-entregas"><i class="fas fa-list-alt cinzaColor" style="margin-right: 5px;"></i> Entregas</a></li>' +
        '                      <li><a href="#tabChartAtivPanel-documentos"><i class="fas fa-list-alt cinzaColor" style="margin-right: 5px;"></i> Documentos Produzidos</a></li>' +
        (callAtiv('checkCapacidade','chart_produtividade') ?
            '                       <li><a href="#tabChartAtivPanel-produtividade"><i class="fas fa-list-alt cinzaColor" style="margin-right: 5px;"></i> Produtividade</a></li>' +
            '' : '') +
        '                   </ul>' +
        '                   <div id="tabChartAtivPanel-distribuicao" class="" style="overflow-x: scroll; padding: 0;">' +
        '                       <div style="position: relative;">' +
        '                           <div class="chartSection tabelaPanelScroll" id="chartSectionDistribuicao" style="height: 500px;">' +
        '                               <div id="chartAtivPanelDemandas" class="chartAtivPanelDiv" style="width: 30%; float: left;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
        '                               <div id="chartAtivPanelPlanos" class="chartAtivPanelDiv" style="width: 70%; float: right;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
        '                          </div>' +
        '                       </div>' +
        '                   </div>' +
        '                   <div id="tabChartAtivPanel-entregas" class="" style="overflow-x: scroll; padding: 0;">' +
        '                       <div id="chartAtivPanelEstoque" class="chartAtivPanelDiv" style="width: 23%; float: left; clear: both;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
        '                       <div id="chartAtivPanelStatusEntregas" class="chartAtivPanelDiv" style="width: 23%; float: left;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
        '                       <div id="chartAtivPanelProcessuais" class="chartAtivPanelDiv" style="width: 23%; float: left;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
        '                       <div id="chartAtivPanelMediaTempo" class="chartAtivPanelDiv" style="width: 31%; float: left;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
        '                   </div>' +
        '                   <div id="tabChartAtivPanel-documentos" class="" style="overflow-x: scroll; padding: 0;">' +
        '                       <div id="chartAtivPanelRequisicoes" class="chartAtivPanelDiv" style="width: 25%; float: left; clear: both;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
        '                       <div id="chartAtivPanelDocumentos" class="chartAtivPanelDiv" style="width: 25%; float: left;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
        '                   </div>' +
        (callAtiv('checkCapacidade','chart_produtividade') ?
            '                   <div id="tabChartAtivPanel-produtividade" class="" style="overflow-x: scroll; padding: 0;">' +
            '                       <div id="chartAtivPanelProdutividade" class="chartAtivPanelDiv" style="width: 45%; float: left; clear: both;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '                       <div id="chartAtivPanelProdutividadeMes" class="chartAtivPanelDiv" style="width: 45%; float: right;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '                   </div>' +
            '' : '') +
        '   	        </div>' +
        '   	    </div>' +
        '   	</div>' +
        (callAtiv('checkCapacidade','view_afastamento') ?
            '   	<div class="panelInfoHome panelInfoHomeAfastamento" style="' + (getOptionsPro('panelHomeView') == 'Afastamento' ? '' : 'display:none;') + '">' +
            '   	    <div id="ganttAfastamentoPanel" class="seipro-atividades-gantt-afastamento afastamentoPanelPro seipro-atividades-afastamento" style="max-width: 800px; display:none; padding-top: 20px; position: relative;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '   	    <div id="tableAfastamentoPanel" class="seipro-atividades-afastamento-table tabelaPanelScroll afastamentoPanelPro seipro-atividades-afastamento" style="margin-top: 10px; display:none !important;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '   	    <div id="reportAfastamentoPanel" class="afastamentoPanelPro seipro-atividades-afastamento" style="margin-top: 10px; display:none !important;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '   	</div>' : '') +
        (callAtiv('checkCapacidade','view_contato') ?
            '   	<div class="panelInfoHome panelInfoHomeContato" style="' + (getOptionsPro('panelHomeView') == 'Contato' ? '' : 'display:none;') + '">' +
            '   	    <div id="tableContatoPanel" class="tabelaPanelScroll contatoPanelPro" style="margin-top: 10px;padding-left: 50px; display:none !important;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '   	</div>' : '') +
        (callAtiv('checkCapacidade','view_relatorio') ?
            '   	<div class="panelInfoHome panelInfoHomeRelatorio" style="' + (getOptionsPro('panelHomeView') == 'Relatorio' ? '' : 'display:none;') + '">' +
            '   	    <div id="tableRelatorioPanel" class="seipro-atividades-relatorio-panel relatorioPanelPro seipro-atividades-relatorio" style="display:none; margin-top: 10px; display:none !important;"><div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '   	    <div id="chartRelatorioPanel" class="relatorioPanelPro seipro-atividades-relatorio" style="display:none; padding-top: 20px; position: relative;">' +
            (callAtiv('checkOptionEntidade','painel_bi') ?
                '               <iframe id="chartRelatorioPanelBI"></iframe>' +
                '' : '               <div class="dataFallback" data-text="Em constru\u00E7\u00E3o"></div>') +
            '           </div>' +
            '   	</div>' : '') +
        '   	<div class="panelInfoHome panelInfoHomeConfiguracao" style="border:none; ' + (getOptionsPro('panelHomeView') == 'Configuracao' ? '' : 'display:none;') + '">' +
        '   	</div>' +
        '   </div>' +
        '</div>';

    if ($('#atividadesPro').length > 0) { $('#atividadesPro').remove(); }
    orderDivPanel(htmlPanelAtividades, idOrder, 'atividadesPro');

    if (getOptionsPro('panelSortPro')) {
        initSortDivPanel();
    }

    if (!getOptionsPro('panelHeight_atividadesPro') && $('#tabelaAtivPanel').height() > 800) { setOptionsPro('panelHeight_atividadesPro', 800) }
    if (!getOptionsPro('panelHomeView') || getOptionsPro('panelHomeView') == 'Atividade') {
        callAtiv('initFunctionsPanelAtiv',);
    }
    if (sessionStorageRestorePro('configDataAtividadesHTML') !== null) {
        $('#tabelaAtivPanel table tbody').html(sessionStorageRestorePro('configDataAtividadesHTML'));
        setAtividadesUser();
        callAtiv('initFunctionsPanelAtiv',);
        setTimeout(function () {
            $('.tableAtividades').trigger('update');
            if (typeof $().chosen !== 'undefined' && $('#selectViewControl_tabelaAtivPanel_chosen').length == 0) {
                $('#selectViewControl_tabelaAtivPanel').chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado',
                    normalize_search_text: function (text) {
                        return removeAcentos(text.toLowerCase());
                    }
                });
                forcePlaceHoldChosen();
                setResizeAreaTelaD();
            }
        }, 1000);
    } else if (typeof storeAtividades !== 'undefined' && storeAtividades !== null && storeAtividades) {
        getRowsPanelAtividades(storeAtividades, $('#tabelaAtivPanel table tbody'));
    }
    initPanelAtividadesView();
}
export function getBtnActionsAtividade(value, more_options = false) {
    var iconAtivEditHtml = callAtiv('actionsAtividade',value.id_demanda, 'icon', 'start');
    var btnActionAtiv = (iconAtivEditHtml && iconAtivEditHtml.hasOwnProperty('icon'))
        ? '<span class="info_dates_extend" style="display:block; padding: 0;opacity: 1;min-width: max-content;">' +
        '   <a class="newLink info_noclick" style="font-size: 9pt;" data-act="atividades-call" data-fn="actionsAtividade" data-scope="parent" data-pass-el="0" data-id="' + value.id_demanda + '" data-arg="action">' +
        '       <i class="' + iconAtivEditHtml.icon + '" style="padding-right: 3px;"></i>' +
        '       ' + iconAtivEditHtml.name +
        '   </a>' +
        (more_options ?
            '   <a class="newLink info_noclick" data-act="atividades-call" data-fn="initToolbarFunc" data-scope="parent" style="font-size: 9pt; margin:0;" data-index="' + value.id_demanda + '">' +
            '       <i class="fas fa-ellipsis-v"></i>' +
            '   </a>' : '') +
        '</span>'
        : '';
    btnActionAtiv = (callAtiv('checkPermissionAtiv',value)) ? btnActionAtiv : '';
    return btnActionAtiv;
}
export function awaitRowsPanelAtividades(id_demanda) {
    $('#tabelaAtivPanel tr[data-index="' + id_demanda + '"] td[data-type="action"] a[data-fn="actionsAtividade"] i').attr('class', 'fas fa-spinner fa-spin fa-pulse');
    $('#kanbanAtivPanel .kanban-item[data-eid="_id_' + id_demanda + '"] .drag_handler_icon').attr('class', 'fas fa-spinner fa-spin fa-pulse').css({ 'font-size': '160%', 'color': '#4385f4', 'margin-top': '5px' });
}
export function getRowsPanelAtividades(storeAtividades, target) {
    function setRowsPanelAtividades(value, index) {
        var tagsAtiv = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? value.etiquetas.join(';') : '';
        var tagsAtivHtml = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? $.map(storeAtividades[index].etiquetas, function (i) { return getHtmlEtiqueta(i, 'ativ') }).join('') : '';
        var tagsAtivClass = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? $.map(storeAtividades[index].etiquetas, function (i) { return 'tagTableName_' + normalizeNameTag(i); }).join(' ') : '';
        var tagsAtivPriority = (tagsAtivClass.indexOf('tagTableName_importante') !== -1) ? 'importanteBoxDisplay' : '';
        tagsAtivPriority = (tagsAtivClass.indexOf('tagTableName_urgente') !== -1) ? 'urgenteBoxDisplay' : tagsAtivPriority;
        var tagPacto = callAtiv('getTagTempoPactuadoAtiv',value);
        var timerAtiv = (value.data_inicio != '0000-00-00 00:00:00' && value.data_entrega == '0000-00-00 00:00:00')
            ? callAtiv('getTagTempoDecorridoAtiv',value, false)
            : (value.data_entrega != '0000-00-00 00:00:00' && value.data_avaliacao == '0000-00-00 00:00:00')
                ? callAtiv('getTagTempoDespendidoAtiv',value, false)
                : '';
        timerAtiv = (!callAtiv('checkOptionEntidade','desativa_produtividade_geral')) ? timerAtiv : '';
        var datesAtivHtml = (typeof value.data_distribuicao !== 'undefined' && value.data_distribuicao !== null) ? getDatesPreview(getConfigDateAtiv(value)) : '';
        var tagDatesAtivClass = (datesAtivHtml != '') ? 'tagTableName_' + $(datesAtivHtml).data('tagname') : '';
        var nameUser = (value.id_user != 0 ? value.apelido : 'N\u00E3o atribu\u00EDdo');
        var tagName_user = normalizeNameTag(nameUser);
        var tagName_unidade = (countUnidades > 1) ? 'tagTableName_' + normalizeNameTag(value.sigla_unidade) : '';
        var ativEditHtml = getBtnActionsAtividade(value, true);
        var checklistHtml = (value.checklist && value.checklist.length > 0) ? callAtiv('getInfoAtividadeChecklist',value, 'icon') : '';

        function getTdRow(type) {
            var html = '';
            if (type == 'proc') {
                html = '           <td align="left" data-type="proc">' +
                    '               ' + getHtmlLinkRequisicao(value) +
                    '           </td>';
            } else if (type == 'date') {
                html = '           <td align="left" data-type="date">' +
                    '               <span class="info_dates_monitorado">' + datesAtivHtml + '</span>' +
                    '           </td>';
            } else if (type == 'action') {
                html = '           <td align="left" data-type="action">' +
                    '               ' + ativEditHtml +
                    '           </td>';
            } else if (type == 'user') {
                html = '           <td align="left" data-type="user">' +
                    '               <span class="info_tags_follow info_tags_user">' + getHtmlEtiquetaUnidade(value) + '</span>' + tagPacto + timerAtiv +
                    '               ' + checklistHtml +
                    '           </td>';
            } else if (type == 'etiqueta') {
                html = '           <td align="left" data-type="etiqueta" class="tdmonitorado_tags ' + ((tagsAtivHtml.trim() == '' && callAtiv('checkCapacidade','edit_etiqueta')) ? 'info_tags_follow_empty' : '') + '" data-etiqueta-mode="ativ">' +
                    '               <span class="info_tags_follow">' + tagsAtivHtml +
                    '               </span>' + (!callAtiv('checkCapacidade','edit_etiqueta') ? '' :
                        '               <span class="info_tags_follow_txt seipro-atividades-tags" style="display:none">' +
                        '                   <input value="' + tagsAtiv + '" class="atividadeTagsPro" name="atividadeTagsPro">' +
                        '               </span>' +
                        '               <a class="newLink followLink followLinkTags followLinkTagsEdit" data-act="atividades-call" data-fn="showFollowEtiqueta" data-arg="show" data-arg2="ativ\" data-tip="Editar etiqueta"><i class="fas fa-edit" style="font-size: 100%;"></i></a>' +
                        '               <a class="newLink followLink followLinkTags followLinkTagsAdd" data-act="atividades-call" data-fn="showFollowEtiqueta" data-arg="show" data-arg2="ativ\" data-tip="Adicionar etiqueta"><i class="fas fa-tags" style="font-size: 100%;"></i></a>') +
                    '           </td>';
            } else if (type == 'desc') {
                html = '           <td class="content_desc" data-type="desc">' +
                    '               <div class="txt_cinza">' + (value.nome_atividade ? value.nome_atividade : '') + '</div>' +
                    '               <div class="content_edit" data-field="assunto" style="position:relative;" data-id="' + value.id_demanda + '">' +
                    '                   <span class="info" style="font-weight: bold;display: block;margin-top: 5px;width: 96%;padding: 0 0 0 5px;">' + value.assunto + '</span>' +
                    '                   ' + (callAtiv('checkCapacidade','edit_field') && callAtiv('checkPermissionAtiv',value) && callAtiv('checkCapacidade','edit_assunto') ? '<a class="newLink newLink_active followLink followLinkDesc content_btnsave" data-act="atividades-call" data-fn="editFieldAtiv" style="right: 0;top: 0;" data-tip="Editar ' + __.assunto + '"><i class="fas fa-edit" style="font-size: 100%;"></i></a>' : '') +
                    '               </div>' +
                    (value && value.observacao_gerencial !== null && value.observacao_gerencial != '' ?
                        '               <div class="inlineAlert content_edit" data-field="observacao_gerencial" style="position:relative" data-id="' + value.id_demanda + '">' +
                        '                   <i class="fas fa-comment-alt" style="color: #7baaf7;position: absolute;"></i>' +
                        '                   <span class="info" style="text-indent: 20px;display: block;">' + replaceTextToProcessoSEI(replaceTextToUrl(value.observacao_gerencial)) + '</span>' +
                        '                   ' + (callAtiv('checkCapacidade','edit_field') && callAtiv('checkPermissionAtiv',value) && callAtiv('checkCapacidade','edit_observacao_gerencial') ? '<a class="newLink newLink_active followLink followLinkDesc content_btnsave" data-act="atividades-call" data-fn="editFieldAtiv" style="right: 0;top: 6px;" data-tip="Editar ' + __.Observacao + ' ' + __.Gerencial + '"><i class="fas fa-edit" style="font-size: 100%;"></i></a>' : '') +
                        '               </div>' +
                        '' : '') +
                    (value && value.observacao_tecnica !== null && value.observacao_tecnica != '' ?
                        '               <div class="inlineAlert content_edit" data-field="observacao_tecnica" style="position:relative" data-id="' + value.id_demanda + '">' +
                        '                   <i class="fas fa-reply-all" style="color: #7baaf7;position: absolute;"></i>' +
                        '                   <span class="info" style="text-indent: 20px;display: block;">' + replaceTextToProcessoSEI(replaceTextToUrl(value.observacao_tecnica)) + '</span>' +
                        '                   ' + (callAtiv('checkCapacidade','edit_field') && callAtiv('checkPermissionAtiv',value) && callAtiv('checkCapacidade','edit_observacao_tecnica') ? '<a class="newLink newLink_active followLink followLinkDesc content_btnsave" data-act="atividades-call" data-fn="editFieldAtiv" style="right: 0;top: 6px;" data-tip="Editar ' + __.Observacao + ' ' + __.Tecnica + '"><i class="fas fa-edit" style="font-size: 100%;"></i></a>' : '') +
                        '               </div>' +
                        '' : '') +
                    '           </td>';
            }
            return html;
        }
        var arrayColumnSort = (getOptionsPro('panelAtividadesViewTableSort'))
            ? getOptionsPro('panelAtividadesViewTableSort')
            : [
                "proc",
                "date",
                "action",
                "user",
                "etiqueta",
                "desc"
            ];
        var htmlColumnsAtividades = $.map(arrayColumnSort, function (v) {
            return getTdRow(v);
        }).join('');

        var htmlTableAtividades = '       <tr data-tagname="SemGrupo" data-index="' + value.id_demanda + '" class="tagTableName_' + tagName_user + ' ' + tagName_unidade + ' ' + tagsAtivClass + ' ' + tagDatesAtivClass + ' ' + tagsAtivPriority + '">' +
            '           <td align="center">' +
            '               <input type="checkbox" data-act="atividades-call" data-fn="followSelecionarItens" id="atividadePro_' + value.id_demanda + '" name="atividadePro" value="' + value.id_procedimento + '">' +
            '           </td>' +
            '           ' + htmlColumnsAtividades +
            '       </tr>';
        if (datesAtivHtml != '') {
            var iconDateAtiv = ($(datesAtivHtml).find('.dateBoxIcon').length > 0) ? $(datesAtivHtml).find('.dateBoxIcon')
                .removeAttr('onclick')
                .attr({
                    'data-act': 'atividades-call',
                    'data-fn': 'actionsAtividade',
                    'data-pass-el': '0',
                    'data-id': String(value.id_demanda)
                })[0].outerHTML : '';
            $('.tabelaControle').find('#P' + value.id_procedimento).each(function (index) {
                if (iconDateAtiv != '') { $(this).find('.atividadeBoxDisplay').append('<span class="dateboxDisplay" data-prazo-entrega="' + value.prazo_entrega + '">' + iconDateAtiv + '</span>') }
            });
        }
        var tr_demanda = target.find('tr[data-index="' + value.id_demanda + '"]');
        if (tr_demanda.length > 0) {
            tr_demanda.before(htmlTableAtividades).remove();
        } else {
            target.append(htmlTableAtividades);
        }
    }
    function initRowsPanelAtividades(index) {
        loadRowsPanelAtiv = true;
        target.trigger('updateAll');
        callAtiv('initFunctionsPanelAtiv',);
        var totaldados = storeAtividades.length - 1;
        var caption = $('#tabelaAtivPanel table').find('caption.infraCaption');
        caption.find('.progress').remove().end().append('<span class="progress" style="color: #777;font-size: 0.8em;padding: 5px;margin: 5px;"><i class="fas fa-sync fa-spin cinzaColor"></i> carregando dados... (' + index + '/' + totaldados + ')</span>');
        if (totaldados <= index) {
            getHtmlTableAtiv();
            caption.find('.progress').remove();
            loadRowsPanelAtiv = false;
        }
        // console.log('endLoop rowsPanelAtividades', index, loadRowsPanelAtiv);
    }
    var countUnidades = (storeAtividades.length > 0) ? uniqPro(jmespath.search(storeAtividades, "[?sigla_unidade].sigla_unidade")).length : 0;
    var t = new Date();
    var limit = 100;
    storeAtividades.forEach(function (value, index) {
        if (index >= limit) {
            setTimeout(function () {
                setRowsPanelAtividades(value, index);
                if (storeAtividades.length - 1 == index || index % 100 == 0) {
                    initRowsPanelAtividades(index);
                }
            }, 50 * index);
        } else {
            setRowsPanelAtividades(value, index);
            loadRowsPanelAtiv = false;
        }
    });
    if (storeAtividades.length <= limit) { initRowsPanelAtividades(100) }
}
export function removeRowsPanelAtividades(id_demanda) {
    var tableAtiv = $('#tabelaAtivPanel table');
    var kanbanAtiv = $('#kanbanAtivPanel');
    var tr = tableAtiv.find('tr[data-index="' + id_demanda + '"]');

    if (tr.length > 0) {
        tr.remove();
    } else if (kanbanAtiv.is(':visible')) {
        var value = getAtividadeData(id_demanda);
        var item = callAtiv('getKanbanItem',value);
        kanbanAtividades.removeElement(item.id);
    }
    var objIndexAtiv = (typeof arrayAtividadesPro === 'undefined' || arrayAtividadesPro == 0 || arrayAtividadesPro.length == 0) ? -1 : arrayAtividadesPro.findIndex((obj => obj.id_demanda == id_demanda));
    if (objIndexAtiv !== -1) {
        arrayAtividadesPro.splice(objIndexAtiv, 1);
        hybridStorageStorePro('configDataAtividadesPro', arrayAtividadesPro);
        getHtmlTableAtiv();
        return true;
    } else {
        return false;
    }
}
export function getHtmlTableAtiv() {
    var html = $('#tabelaAtivPanel table tbody').html();
    if (typeof html !== 'undefined' && html !== null && html != '') {
        sessionStorageStorePro('configDataAtividadesHTML', html);
    }
}
export function getHtmlLinkRequisicao(value, onclick = false) {
    var linkDoc = (value.data_entrega == '0000-00-00 00:00:00')
        ? url_host + '?acao=procedimento_trabalhar&id_procedimento=' + value.id_procedimento + '&id_documento=' + value.id_documento_requisicao
        : url_host + '?acao=procedimento_trabalhar&id_procedimento=' + value.id_procedimento + '&id_documento=' + value.id_documento_entregue;
    var documentoTips = (typeof value.documento_sei !== 'undefined' && value.documento_sei !== null && parseInt(value.documento_sei) != 0) ? (value.nome_documento ? value.nome_documento : '') + ' (' + value.documento_sei + ')' : (value.nome_documento ? value.nome_documento : '');
    var requisicaoTips = (typeof value.requisicao_sei !== 'undefined' && value.requisicao_sei !== null && parseInt(value.requisicao_sei) != 0) ? (value.nome_requisicao ? value.nome_requisicao : '') + ' (' + value.requisicao_sei + ')' : (value.nome_requisicao ? value.nome_requisicao : '');
    requisicaoTips = (value.data_entrega == '0000-00-00 00:00:00') ? (requisicaoTips != '' ? 'Requisi\u00E7\u00E3o: ' + requisicaoTips : '') : (documentoTips != '' ? 'Documento Entregue: ' + documentoTips : '');
    var iconProcesso = (arrayProcessosUnidade && $.inArray(value.processo_sei, arrayProcessosUnidade) == -1) ? 'fas fa-folder' : 'far fa-folder-open';
    var tipsProcesso = (arrayProcessosUnidade && $.inArray(value.processo_sei, arrayProcessosUnidade) == -1) ? 'Processo fechado nesta unidade' : 'Processo aberto nesta unidade';
    tipsProcesso = (!arrayProcessosUnidade) ? '' : tipsProcesso;
    var iconRequisicao = (value.data_entrega == '0000-00-00 00:00:00') ? 'far fa-list-alt' : 'fas fa-list-alt';
    var onclickLink = (onclick) ? 'data-act="atividades-call" data-fn="openLinkNewTab" data-pass-el="0" data-arg="' + String(linkDoc).replace(/"/g, '&quot;') + '"' : '';
    var newTabLink = (onclick) ? '' : '<a class="newLink followLink followLinkNewtab" href="' + linkDoc + '" data-tip="Abrir em nova aba" target="_blank"><i class="fas fa-external-link-alt" style="font-size: 90%; text-decoration: underline;"></i></a>';
    var processoHtml = (value.processo_sei !== null && value.processo_sei != '')
        ? '' +
        '               ' + newTabLink +
        '               <a style="text-decoration: underline;" class="bLink" href="' + linkDoc + '" ' + onclickLink + '>' +
        '                   <i class="' + iconProcesso + ' bLink" style="text-decoration: underline;" data-tip="' + tipsProcesso + '"></i> ' +
        '                   <span class="bLink" data-tip="' + requisicaoTips + '"></i> ' +
        '                       ' + value.processo_sei +
        '                       ' + (onclick ? '<i class="fas fa-external-link-alt bLink" style="font-size: 80%;text-decoration: underline;vertical-align: text-top;"></i>' : '') +
        '                   </span>' +
        '               </a>' +
        ''
        : '               <a style="text-decoration: underline;" class="bLink" ' + onclickLink + '>' +
        '                   <i class="' + iconRequisicao + ' bLink" style="text-decoration: underline;" data-tip="' + requisicaoTips + '"></i> ' +
        '                   <span class="bLink" data-tip="' + requisicaoTips + '"></i> ' +
        '                       ' + value.nome_requisicao + (value.requisicao_sei ? ' ' + value.requisicao_sei : '') +
        '                   </span>' +
        '               </a>';
    processoHtml = (value.id_tipo_requisicao == 0 && value.id_procedimento == 0) ? '' : processoHtml;
    processoHtml = '<div class="type-id">#' + value.id_demanda + '</div>' + processoHtml;
    return processoHtml;
}
export function getHtmlActionsConfig(type) {
    var param = (type == 'atividades') ? { name_new: 'Novo Tipo de ' + __.Atividade, name: 'Tipo de ' + __.Atividade, icon: 'fas fa-clipboard-list', index: 1 } : '';
    param = (type == 'planos') ? { name_new: 'Novo Plano de Trabalho', name: 'Plano de Trabalho', icon: 'fas fa-handshake', index: 2 } : param;
    param = (type == 'termos') ? { name_new: 'Novo Termo de Ci\u00EAncia e Responsabilidade', name: 'Termo de Ci\u00EAncia e Responsabilidade', icon: 'fas fa-file-signature', index: 3 } : param;
    param = (type == 'programas') ? { name_new: getNameGenre('programa', 'Novo', 'Nova') + ' ' + __.Programa, name: __.Programa, icon: 'fas fa-cubes', index: 4 } : param;
    param = (type == 'entregas') ? { name_new: 'Nova Entrega', name: 'Entregas', icon: 'fas fa-hand-holding', index: 5 } : param;
    param = (type == 'users') ? { name_new: 'Novo Usu\u00E1rio', name: 'Usu\u00E1rios', icon: 'fas fa-users', index: 6 } : param;
    param = (type == 'unidades') ? { name_new: 'Nova Unidade', name: 'Unidades', icon: 'fas fa-briefcase', index: 7 } : param;
    param = (type == 'mapas') ? { name_new: 'Novo Mapa', name: 'Mapas Estrat\u00E9gicos', icon: 'fas fa-network-wired', index: 8 } : param;
    param = (type == 'objetivos') ? { name_new: 'Novo Objetivo', name: 'Objetivos Estrat\u00E9gicos', icon: 'fas fa-map-signs', index: 9 } : param;
    param = (type == 'cadeia_valor') ? { name_new: 'Novo Processo', name: 'Cadeia de Valor', icon: 'fas fa-share-alt', index: 10 } : param;
    param = (type == 'acoes') ? { name_new: 'Nova A\u00E7\u00E3o', name: 'A\u00E7\u00F5es Estrat\u00E9gicos', icon: 'fas fa-puzzle-piece', index: 11 } : param;
    param = (type == 'tipos_prescricoes') ? { name_new: 'Novo Tipo de ' + __.Prescricao + '', name: __.Prescricao, icon: 'fas fa-history', index: 12 } : param;
    param = (type == 'tipos_metadados') ? { name_new: 'Novo Tipo de Metadado', name: 'Tipo de Metadado', icon: 'fas fa-dice-d6', index: 13 } : param;
    param = (type == 'tipos_eixos') ? { name_new: 'Novo Tipo de Eixo Tem\u00E1tico', name: 'Tipo de Eixo Tem\u00E1tico', icon: 'fas fa-exchange-alt', index: 14 } : param;
    param = (type == 'tipos_entregas') ? { name_new: 'Novo Tipo de Entrega', name: 'Tipo de Entrega', icon: 'fas fa-hand-holding-medical', index: 15 } : param;
    param = (type == 'tipos_documentos') ? { name_new: 'Novo Tipo de Documento', name: 'Tipo de Documento', icon: 'fas fa-file-alt', index: 16 } : param;
    param = (type == 'tipos_requisicoes') ? { name_new: 'Novo Tipo de Requisi\u00E7\u00E3o', name: 'Tipo de Requisi\u00E7\u00E3o', icon: 'fas fa-inbox', index: 17 } : param;
    param = (type == 'tipos_avaliacoes') ? { name_new: 'Novo Tipo de Avalia\u00E7\u00E3o', name: 'Tipo de Avalia\u00E7\u00E3o', icon: 'fas fa-star', index: 18 } : param;
    param = (type == 'tipos_justificativas') ? { name_new: 'Novo Tipo de Justificativa de Avalia\u00E7\u00E3o', name: 'Tipo de Justificativa', icon: 'fas fa-star', index: 19 } : param;
    param = (type == 'tipos_modalidades') ? { name_new: 'Novo Tipo de Modalidade de Trabalho', name: 'Tipo de Modalidade', icon: 'fas fa-wrench', index: 20 } : param;
    param = (type == 'tipos_motivos') ? { name_new: 'Novo Tipo de Motivo de Afastamento', name: 'Tipo de Motivo', icon: 'fas fa-luggage-cart', index: 21 } : param;
    param = (type == 'tipos_capacidades') ? { name_new: 'Novo Tipo de Capacidade', name: 'Tipo de Capacidade', icon: 'fas fa-users-cog', index: 22 } : param;
    param = (type == 'perfis') ? { name_new: 'Novo Tipo de Perfil', name: 'Tipo de Perfil', icon: 'fas fa-shield-alt', index: 23 } : param;
    param = (type == 'nomenclaturas') ? { name_new: 'Nova Nomenclatura', name: 'Nomenclatura', icon: 'fas fa-ad', index: 24 } : param;
    param = (type == 'entidades') ? { name_new: 'Nova Entidade', name: 'Entidades', icon: 'fas fa-university', index: 25 } : param;

    var html = '           <span class="actionsConfig_' + type + ' actionsConfig_icons" ' + (getOptionsPro('tabsPanelConfigActiveTabs') != param.index ? 'style="display:none"' : '') + '>' +
        (callAtiv('checkCapacidade','config_new_' + type) ?
            '               <a class="newLink iconConfig_add iconConfig_confirm" data-icon="' + param.icon + ' icon-parent" data-act="atividades-call" data-fn="newConfig_" data-type="' + type + '" data-mode="add" data-tip="Adicionar ' + param.name_new + '" style="margin: 0;font-size: 14pt;">' +
            '                   <span class="fa-layers fa-fw">' +
            '                       <i class="' + param.icon + ' icon-parent"></i>' +
            '                       <i class="fas fa-plus-circle fa-layers-counter fa-layers-bottom"></i>' +
            '                   </span>' +
            '               </a>' +
            '' : '') +
        (type == 'planos' && (callAtiv('checkCapacidade','config_update_planos') || callAtiv('checkCapacidade','config_update_self_planos')) ?
            '               <a class="newLink iconConfig_recalc" data-type="' + type + '" data-mode="recalc" data-id="0" data-act="atividades-call" data-fn="updateCalcPlanos" data-tip="Recalcular horas de planos de trabalho" style="margin: 0;font-size: 14pt; display: none">' +
            '                   <span class="fa-layers fa-fw">' +
            '                       <i class="fas fa-calculator"></i>' +
            '                       <span class="fa-layers-counter">1</span>' +
            '                   </span>' +
            '               </a>' +
            '' : '') +
        (type == 'planos' && callAtiv('checkCapacidade','config_update_archive_planos') ?
            '               <a class="newLink iconConfig_archive" data-type="' + type + '" data-mode="archive" data-id="0" data-act="atividades-call" data-fn="archiveConfig" data-tip="Arquivar planos de trabalho" style="margin: 0;font-size: 14pt; display: none">' +
            '                   <span class="fa-layers fa-fw">' +
            '                       <i class="fas fa-inbox"></i>' +
            '                       <span class="fa-layers-counter">1</span>' +
            '                   </span>' +
            '               </a>' +
            '' : '') +
        (type == 'planos' && callAtiv('checkCapacidade','config_update_archive_planos') ?
            '               <a class="newLink iconConfig_unarchive" data-type="' + type + '" data-mode="unarchive" data-id="0" data-act="atividades-call" data-fn="archiveConfig" data-tip="Desarquivar planos de trabalho" style="margin: 0;font-size: 14pt; display: none">' +
            '                   <span class="fa-layers fa-fw">' +
            '                       <i class="fas fa-box-open"></i>' +
            '                       <span class="fa-layers-counter">1</span>' +
            '                   </span>' +
            '               </a>' +
            '' : '') +
        (type == 'planos' && callAtiv('checkCapacidade','config_update_planos') ?
            '               <a class="newLink iconConfig_close" data-type="' + type + '" data-mode="close" data-id="0" data-act="atividades-call" data-fn="closeConfig" data-tip="Encerrar antecipadamente planos de trabalho" style="margin: 0;font-size: 14pt; display: none">' +
            '                   <span class="fa-layers fa-fw">' +
            '                       <i class="fas fa-hourglass-end"></i>' +
            '                       <span class="fa-layers-counter">1</span>' +
            '                   </span>' +
            '               </a>' +
            '' : '') +
        ((callAtiv('checkOptionEntidade','exigir_homologacao_programas') && callAtiv('getUnidadeInstituidora',) && type == 'programas' && callAtiv('checkCapacidade','config_approve_programas')) || (type == 'planos' && callAtiv('checkCapacidade','config_approve_planos') && callAtiv('checkOptionEntidade','exigir_homologacao_previa_planos')) || (type == 'atividades' && callAtiv('checkCapacidade','config_approve_atividades')) ?
            '               <a class="newLink iconConfig_approve" data-type="' + type + '" data-mode="approve" data-id="0" data-act="atividades-call" data-fn="approveConfig" data-tip="Homologar ' + param.name + '" style="margin: 0;font-size: 14pt; display: none">' +
            '                   <span class="fa-layers fa-fw">' +
            '                       <i class="fas fa-thumbs-up azulColor"></i>' +
            '                       <span class="fa-layers-counter">1</span>' +
            '                   </span>' +
            '               </a>' +
            '               <a class="newLink iconConfig_disapprove" data-type="' + type + '" data-mode="disapprove" data-id="0" data-act="atividades-call" data-fn="approveConfig" data-word="ESTOU CIENTE" data-alert="<br><br><b style=\'font-weight: bold;\'>Esta a\u00E7\u00E3o ir\u00E1 cancelar a homologa\u00E7\u00E3o de TODOS os planos de trabalho vinculados</b>" data-tip="Cancelar a Homologa&ccedil;&atilde;o de ' + param.name + '" style="margin: 0;font-size: 14pt; display: none">' +
            '                   <span class="fa-layers fa-fw">' +
            '                       <i class="fas fa-thumbs-down vermelhoColor"></i>' +
            '                       <span class="fa-layers-counter">1</span>' +
            '                   </span>' +
            '               </a>' +
            '' : '') +
        ((type != 'users' && callAtiv('checkCapacidade','config_update_' + type)) || (type == 'users' && callAtiv('checkCapacidade','config_users_all')) ?
            '               <a class="newLink iconConfig_remove" data-type="' + type + '" data-mode="disable" data-id="0" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar ' + param.name + '" style="margin: 0;font-size: 14pt; display: none">' +
            '                   <span class="fa-layers fa-fw">' +
            '                       <i class="fas fa-times-circle"></i>' +
            '                       <span class="fa-layers-counter">1</span>' +
            '                   </span>' +
            '               </a>' +
            '               <a class="newLink iconConfig_reactive" data-type="' + type + '" data-mode="reactive" data-id="0" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar ' + param.name + '" style="margin: 0;font-size: 14pt; display: none">' +
            '                   <span class="fa-layers fa-fw">' +
            '                       <i class="fas fa-undo-alt"></i>' +
            '                       <span class="fa-layers-counter">1</span>' +
            '                   </span>' +
            '               </a>' +
            (callAtiv('checkCapacidade','config_new_' + type) ?
                '               <a class="newLink iconConfig_clone" data-type="' + type + '" data-mode="clone" data-id="0" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar ' + param.name + '" style="margin: 0;font-size: 14pt; display: none">' +
                '                   <span class="fa-layers fa-fw">' +
                '                       <i class="fas fa-copy"></i>' +
                '                       <span class="fa-layers-counter">1</span>' +
                '                   </span>' +
                '               </a>' +
                '' : '') +
            '' : '') +
        '           </span>';
    return html;
}

export function getSelectViewControl(panel) {
    var tabelaAtiv = $('#tabelaAtivPanel table.tableAtividades');

    var listUnidades = jmespath.search(arrayAtividadesPro, "[?sigla_unidade].sigla_unidade");
    listUnidades = (listUnidades !== null) ? uniqPro(listUnidades) : [];

    var listEtiquetas = jmespath.search(arrayAtividadesPro, "[*].etiquetas");
    listEtiquetas = (listEtiquetas !== null) ? uniqPro($.map(jmespath.search(arrayAtividadesPro, "[*].etiquetas"), function (v) { return v })) : [];

    var selectFilterKanban = '<select id="selectViewControl_' + panel + '" style="min-width: 150px;" data-placeholder="Filtrar ' + __.demandas + '" data-panel="' + panel + '" data-act="atividades-call" data-fn="selectViewControl" class="chosen-min">' +
        '<option>&nbsp;</option>' +
        '<optgroup label="por Usu\u00E1rio">';
    selectFilterKanban += $.map(uniqPro(jmespath.search(arrayAtividadesPro, "[*].apelido")), function (v) {
        var tagName = (v == '') ? 'N\u00E3o atribu\u00EDdo' : v;
        var tagText = normalizeNameTag(tagName);
        return '<option data-mode="atividades" data-bar="' + tagText + '" value="tagTableText_' + tagText + '">' + tagName + ' (' + tabelaAtiv.find('tbody tr.tagTableName_' + tagText).length + ')</option>';
    }).join('');
    if (listUnidades.length > 1) {
        selectFilterKanban += '<optgroup label="por Unidades">';
        selectFilterKanban += $.map(uniqPro(listUnidades), function (v) {
            var tagText = normalizeNameTag(v);
            return '<option data-mode="atividades" data-bar="' + tagText + '" value="tagTableText_' + tagText + '">' + v + ' (' + tabelaAtiv.find('tbody tr.tagTableName_' + tagText).length + ')</option>';
        }).join('');
        selectFilterKanban += '</optgroup>';
    }
    if (listEtiquetas.length > 1) {
        selectFilterKanban += '<optgroup label="por Etiquetas">';
        selectFilterKanban += $.map(uniqPro(listEtiquetas), function (v) {
            var tagText = normalizeNameTag(v);
            return '<option data-mode="atividades" data-bar="' + tagText + '" value="tagTableText_' + tagText + '">' + v + ' (' + tabelaAtiv.find('tbody tr.tagTableName_' + tagText).length + ')</option>';
        }).join('');
        selectFilterKanban += '</optgroup>';
    }

    selectFilterKanban += '</optgroup>' +
        '<optgroup label="por Status">' +
        '   <option data-mode="atividades" data-bar="date_noprazo" value="tagTableText_date_noprazo">No prazo (' + tabelaAtiv.find('tbody tr.tagTableName_date_noprazo').length + ')</option>' +
        '   <option data-mode="atividades" data-bar="date_atrasado" value="tagTableText_date_atrasado">Atrasadas (' + tabelaAtiv.find('tbody tr.tagTableName_date_atrasado').length + ')</option>' +
        '   <option data-mode="atividades" data-bar="date_entregue" value="tagTableText_date_entregue">Entregues (' + tabelaAtiv.find('tbody tr.tagTableName_date_entregue').length + ')</option>' +
        '   <option data-mode="atividades" data-bar="date_avaliado" value="tagTableText_date_avaliado">Avaliadas (' + tabelaAtiv.find('tbody tr.tagTableName_date_avaliado').length + ')</option>' +
        '</optgroup>';
    selectFilterKanban += '</select>';
    return selectFilterKanban;
}
export function selectViewControl(this_) {
    var _this = $(this_);
    var value = _this.val().trim();
    var modView = _this.data('panel');
    if (value != '' && modView != 'ganttAtivPanel') {
        $('#' + modView).find('.info_tags_follow, .info_dates_monitorado').find('.' + value).eq(0).click();
    } else if (value != '' && modView == 'ganttAtivPanel') {
        var data_bar = $(this_).find('option:selected').data('bar');
        var data_text = $(this_).find('option:selected').text();

        callAtiv('initGanttAtividades',data_bar);
        setOptionsPro('ganttAtividadesFilter', data_bar);
        $('.filterGanttTag .filterCustom').show().find('.bar-custom').addClass('active').removeClass('inative').attr('data-bar', data_bar).data('bar', data_bar).find('.text').text(data_text);
    }
    _this.val('').chosen("destroy").chosen({
        placeholder_text_single: ' ',
        no_results_text: 'Nenhum resultado encontrado',
        normalize_search_text: function (text) {
            return removeAcentos(text.toLowerCase());
        }
    });
    forcePlaceHoldChosen();
}
export function getAtividadeData(id_demanda) {
    var value = (id_demanda && id_demanda != 0) ? jmespath.search(arrayAtividadesPro, "[?id_demanda==`" + id_demanda + "`] | [0]") : false;
    value = (value === null && typeof arrayAtividadesProcPro !== 'undefined') ? jmespath.search(arrayAtividadesProcPro, "[?id_demanda==`" + id_demanda + "`] | [0]") : value;
    value = (value === null) ? false : value;
    return value;
}
export function getHtmlEtiquetaUnidade(value) {
    var nameUser = (value.id_user != 0 ? value.apelido : 'N\u00E3o atribu\u00EDdo');
    var tagName_user = normalizeNameTag(nameUser);

    var listUnidades = jmespath.search(arrayAtividadesPro, "[?sigla_unidade].sigla_unidade");
    listUnidades = (listUnidades !== null) ? uniqPro(listUnidades) : [];
    var tagName_unidade = (listUnidades.length > 1) ? normalizeNameTag(value.sigla_unidade) : '';

    var htmlTagUnidade = (listUnidades.length > 1)
        ? '<span data-colortag="#bfd5e8" data-type="user" style="background-color: #bfd5e8;" data-tagname="' + tagName_unidade + '" data-textcolor="black" data-icontag="briefcase" class="tag_text tagTableText_' + tagName_unidade + '" data-act="atividades-call" data-fn="filterTagView" data-scope="parent">' +
        '    <i data-colortag="#406987" class="fas fa-briefcase" style="font-size: 90%; margin: 0px 2px; color: #406987;"></i> ' + value.sigla_unidade +
        '</span>'
        : '';

    var htmlTags = '               <span class="info_tags_follow info_tags_user">' + htmlTagUnidade +
        '                   <span data-colortag="#bfd5e8" data-type="user" data-tagname="' + tagName_user + '" data-textcolor="black" data-icontag="user" style="background-color: #bfd5e8;" class="tag_text tagTableText_' + tagName_user + '" data-act="atividades-call" data-fn="filterTagView" data-scope="parent">' +
        '                       <i data-colortag="#406987" class="fas fa-user" style="font-size: 90%; margin: 0px 2px; color: #406987;"></i> ' + nameUser +
        '                   </span>' +
        '               </span>';
    return htmlTags;
}
export function initPanelAtividadesView() {

    var namePanel = (getOptionsPro('panelHomeView')) ? getOptionsPro('panelHomeView') : 'Atividade';

    if (getOptionsPro('panelHomeView') == 'Atividade' || callAtiv('checkCapacidade','view_' + namePanel.toLowerCase())) {
        var viewModePanel = (getOptionsPro('panel' + namePanel + 'sView')) ? getOptionsPro('panel' + namePanel + 'sView') : 'Tabela';
        $('#' + namePanel.toLowerCase() + 'sProActions').find('button[data-value="' + viewModePanel + '"].btn').trigger('click');
    }
    if ($('.panelInfoHomeConfiguracao').is(':visible')) {
        callAtiv('getTabsConfigPanel',);
    } else if ($('.panelInfoHomeContato').is(':visible')) {
        callAtiv('getTableContatoPanel',);
    }
}
export function removeLocalDataAtiv(force = false) {
    callAtiv('removeLocalDataConfigArray',);
    localStorageRemovePro('lastUpdateAtividades');
    hybridStorageRemovePro('configDataAtividadesPro');
    hybridStorageRemovePro('configDataAtividadesProcPro');
    hybridStorageRemovePro('configDataAtividadesPadraoPro');
    sessionStorageRemovePro('configDataAtividadesHTML');
    sessionStorageRemovePro('configDataContatosArray');
    removeOptionsPro('selectReport_planos');
    removeOptionsPro('selectReport_demandas');
    removeOptionsPro('selectReport_afastamentos');
    removeOptionsPro('selectReport_atividades');
    if (force) {
        arrayAtividadesPro = [];
        arrayAtividadesProcPro = [];
        arrayConfigAtividades = [];
    }
    lastUpdateAtividades = false;
}
export function changePerfilAtiv(this_) {
    var _this = $(this_);
    removeLocalDataAtiv(true);
    $('#projetosGantt').remove();
    $('.tabelaControle .atividadeBoxDisplay').html('');
    resetDialogBoxPro('dialogBoxPro');
    removeOptionsPro('selectChartAtiv');
    setOptionsPro('perfilAtividadesSelected', _this.val());
    updateAtividade(_this.closest('.panelHome').find('.iconAtividade_update')[0]);
    perfilAtividadesSelected = _this.val();
}
export function changePanelHome(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.panelHomePro');
    var data = $(this_).data();
    var mode = data.value;
    _parent.find('#atividadesProDiv_hideIcon, .panelHome').hide();
    _parent.find('#atividadesProDiv_hideIcon, .panelHome' + mode).show("slide", { direction: "down" }, 500);
    _parent.find('.panelInfoHome').hide();
    _parent.find('.panelInfoHome' + mode).show();
    if (mode == 'Afastamento') {
        var viewModePanel = (getOptionsPro('panelAfastamentosView')) ? getOptionsPro('panelAfastamentosView') : 'Cronograma';
        $('#afastamentosProActions').find('button[data-value="' + viewModePanel + '"].btn').trigger('click');
    } else if (mode == 'Contato') {
        callAtiv('getTableContatoPanel',);
    } else if (mode == 'Relatorio') {
        // getTabsRelatorio();
        var viewModePanel = (getOptionsPro('panelRelatoriosView')) ? getOptionsPro('panelRelatoriosView') : 'Tabela';
        $('#relatoriosProActions').find('button[data-value="' + viewModePanel + '"].btn').trigger('click');
    } else if (mode == 'Atividade') {
        updateAtividade();
        setTimeout(function () {
            if (perfilLoginAtiv) {
                setPanelAtividades();
            } else {
                callAtiv('getServersPro',);
            }
        }, 300);
        $('#tabelaAtivPanel').find('.dataFallback').addClass('dataLoading');
        $('#atividadesProActions').find('.iconAtividade_update i').addClass('fa-spin');
    } else if (mode == 'Configuracao') {
        callAtiv('getTabsConfigPanel',);
        // initClassicEditor();
    }
    setOptionsPro('panelHomeView', mode);
    $('.tableRelatorioView caption.infraCaption').html('');
}
export function getPanelAtiv(this_) {
    var data = $(this_).data();
    var mode = data.value;
    $(this_).closest('#atividadesProActions').find('.btn.active').removeClass('active');
    $(this_).addClass('active');
    $('#ganttAtivPanel').html('').hide();
    $('#kanbanAtivPanel').html('').hide();
    $('#chartAtivPanel').hide();
    if (mode == 'Tabela') {
        $('#tabelaAtivPanel').show();
    } else {
        $('#tabelaAtivPanel').attr('style', function (i, s) { return (s || '') + 'display: none !important;' });
    }
    if (mode == 'Cronograma') {
        callAtiv('initGanttAtividades',getOptionsPro('ganttAtividadesFilter'));
        if (getOptionsPro('ganttAtividadesFilter').indexOf('bar-') === -1) {
            $('#selectViewControl_ganttAtivPanel option[data-bar="' + getOptionsPro('ganttAtividadesFilter') + '"]').prop('selected', true).trigger('change');
        }
    } else if (mode == 'Quadro') {
        callAtiv('initKanbanAtividades',this_);
    } else if (mode == 'Relatorio') {
        $('#tabChartAtivPanel').tabs();
        callAtiv('getChartAtividades',this_);
    }
    setOptionsPro('panelAtividadesView', mode);
}
export function getPanelAfast(this_) {
    var data = $(this_).data();
    var mode = data.value;
    var _parent = $(this_).closest('#afastamentosProActions');
    _parent.find('.btn.active').removeClass('active');
    $(this_).addClass('active');
    $('.afastamentoPanelPro').attr('style', function (i, s) { return (s || '') + 'display: none !important;' });
    if (mode == 'Cronograma') {
        var defaultView = getOptionsPro('ganttAfastamentosFilter');
        callAtiv('initGanttAfastamento',defaultView ? defaultView : 'bar-ativos');
    } else if (mode == 'Tabela') {
        callAtiv('initTableAfastamentoPanel',this_);
    } else if (mode == 'Relatorio') {
        callAtiv('getChartAfastamentoPanel',this_);
    }
    setOptionsPro('panelAfastamentosView', mode);
}
export function getPanelRelatorio(this_) {
    var data = $(this_).data();
    var mode = data.value;
    var _parent = $(this_).closest('#relatoriosProActions');
    _parent.find('.btn.active').removeClass('active');
    $(this_).addClass('active');
    $('.relatorioPanelPro').attr('style', function (i, s) { return (s || '') + 'display: none !important;' });
    if (mode == 'Tabela') {
        callAtiv('getTabsRelatorio',this_);
    } else if (mode == 'Grafico') {
        getChartRelatorio(this_);
    }
    setOptionsPro('panelRelatoriosView', mode);
}
export function getChartRelatorio(this_) {
    $('#chartRelatorioPanel').show();
    $('#tableRelatorioPanel').hide();
    if (callAtiv('checkOptionEntidade','painel_bi')) {
        $('#chartRelatorioPanelBI').attr('src', callAtiv('getOptionEntidade','painel_bi'));
    }
}
