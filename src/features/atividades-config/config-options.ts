// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { callAtiv } from './call.js';
/**
 * Atividades — opções, perfis e preferências administrativas.
 *
 * This slice contains the configuration view adapter. Rules and selectors live
 * in config-domain.js/config-queries.js; host dependencies enter through the
 * Atividades context.
 */
import { atividadesDialogDocAttrs } from './templates.js';
import { getServerAtividades } from './server.js';
import { checkDatesLoopArray as domainCheckDatesLoopArray, checkDatesBetweenArray as domainCheckDatesBetweenArray } from './config-domain.js';
import { getAtividadesContext } from './context.js';
import { getNameGenre } from '../../shared/nomenclatura.js';

export function getTabEntregasPlanos(idConfigBox, value, entregas, checkEditEntregas, loopReturn = true) {
    let startDatePlano = moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss');
    let endDatePlano = moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss');
    let dateEntregasLoop = startDatePlano.clone().startOf('month');
    let indiceEntregasLoop = 1;
    let tabListUl = '';
    let tabListBox = '';
    window.updateTempoPactuado = false;

    while (dateEntregasLoop < endDatePlano.clone().endOf('month')) {
        var avaliacao_plano = jmespath.search(value.avaliacao_plano, "[?indice_mes_entrega==`" + indiceEntregasLoop + "`] | [0]");
        avaliacao_plano = avaliacao_plano === null ? false : avaliacao_plano;
        let listMesEntrega = jmespath.search(entregas, "[?indice_mes_entrega==`" + indiceEntregasLoop + "`]");
        tabListUl += '       <li><a href="#tabs_' + idConfigBox + '_entregas_mes_' + indiceEntregasLoop + '">' + dateEntregasLoop.format('MM/YYYY') + '</a></li>';
        tabListBox += '       <div id="tabs_' + idConfigBox + '_entregas_mes_' + indiceEntregasLoop + '">' +
            '           ' + configOptionsTabEntregasPlanos(value, listMesEntrega, checkEditEntregas, indiceEntregasLoop) +
            '       </div>';
        indiceEntregasLoop++;
        dateEntregasLoop.add(1, 'month');
        if (!avaliacao_plano && loopReturn && !window.updateTempoPactuado) {
            window.updateTempoPactuado = true;
            callAtiv('updateConfigTempoPactuadoById',
                value.id_plano,
                false,
                true,
                (function () {
                    window.updateTempoPactuado = false;
                    setTimeout(() => {
                        var htmlTabEntregasPlanos = getTabEntregasPlanos(idConfigBox, value, entregas, checkEditEntregas, false);
                        // $('#getTabEntregasPlanos').html(htmlTabEntregasPlanos);
                    }, 500);
                })()
            );
        }
    }
    return tabListUl + tabListBox;
}
export function tempoProporcionalTabEntregasPlanos(value, indice) {
    let avaliacao = (typeof value.avaliacao_plano !== 'undefined' && value.avaliacao_plano !== null && value.avaliacao_plano) ? jmespath.search(value.avaliacao_plano, "[?indice_mes_entrega==`" + indice + "`]") : false;
    let data_inicio_vigencia = moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss');
    let data_fim_vigencia = moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss');
    let initDate = data_inicio_vigencia.clone().add(indice - 1, 'month').startOf('month');
    initDate = initDate < data_inicio_vigencia ? data_inicio_vigencia : initDate;
    let entrega_inicio_vigencia = initDate.format('YYYY-MM-DD HH:mm:ss');
    let endDate = initDate.clone().endOf('month');
    endDate = endDate > data_fim_vigencia ? data_fim_vigencia : endDate;
    let entrega_fim_vigencia = endDate.format('YYYY-MM-DD HH:mm:ss');
    let plano_entrega = {
        data_inicio_vigencia: entrega_inicio_vigencia,
        data_fim_vigencia: entrega_fim_vigencia,
        id_user: value.id_user,
        id_plano: value.id_plano,
        sigla_unidade: value.sigla_unidade,
        carga_horaria: value.carga_horaria
    };
    let horas_afastamento = callAtiv('checkDatesPlanoAfast',plano_entrega);
    // let tempo_proporcional = horas_afastamento.tempo_plano - horas_afastamento.tempo_afastamento;
    // let checkAvaliacao = endDate < moment() ? true : false;
    var tempo_proporcional = horas_afastamento.tempo_proporcional;
    tempo_proporcional = indice == 1 && typeof value.planos_acrescimo !== 'undefined' && typeof value.planos_acrescimo.tempo_acrescimo !== 'undefined' ? tempo_proporcional + value.planos_acrescimo.tempo_acrescimo : tempo_proporcional;
    let checkAvaliacao = avaliacao !== null && avaliacao && avaliacao.length ? true : false;

    return {
        avaliacao: checkAvaliacao,
        tempo_proporcional: tempo_proporcional,
        entrega_inicio_vigencia: initDate,
        entrega_fim_vigencia: endDate
    };
}
export function configOptionsTabEntregasPlanos(value, entregas, checkEditEntregas, indice) {
    var verifyRecurso = callAtiv('checkStatusRecurso',value, indice);
    var checkRecurso = verifyRecurso.check && verifyRecurso.list ? true : false;
    let calcTempo = tempoProporcionalTabEntregasPlanos(value, indice);
    let tempo_proporcional = calcTempo.tempo_proporcional;
    let checkAvaliacao = calcTempo.avaliacao;
    checkEditEntregas = checkAvaliacao ? false : checkEditEntregas;
    let total_execucao = entregas ? jmespath.search(entregas, "[*].execucao.horas_entrega").reduce(function (a, b) { return a + b; }, 0) : 0;
    let media_execucao = total_execucao > 0 ? (total_execucao / tempo_proporcional) * 100 : 0;
    media_execucao = tempo_proporcional == 0 ? 100 : media_execucao;
    var dataAvaliacao = checkAvaliacao ? jmespath.search(value.avaliacao_plano, "[?indice_mes_entrega==`" + indice + "`] | sort_by([*],&data_avaliacao) | reverse([*]) | [0].data_avaliacao") : null;
    var txtDataAvaliacao = dataAvaliacao !== null && checkAvaliacao ? moment(dataAvaliacao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm') : '';
    let textUserAvaliacao = value.id_user == arrayConfigAtividades.perfil.id_user ? 'Recursar' : 'Avaliado em ' + txtDataAvaliacao;
    let textAvaliacao = callAtiv('checkCapacidade','rate_plano') ? 'Avaliar Entregas' : false;
    textAvaliacao = checkAvaliacao ? 'Visualizar avalia\u00E7\u00E3o (' + txtDataAvaliacao + ')' : textAvaliacao;
    textAvaliacao = checkRecurso ? textUserAvaliacao + ' (' + verifyRecurso.status.text + ')' : textAvaliacao;
    let iconAvaliacao = checkRecurso ? 'fa-gavel ' + verifyRecurso.status.color : 'fa-star';
    let checkAvaliaEntrega = !checkEditEntregas && checkAvaliacao ? true : false;
    var modalidade = jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?id_tipo_modalidade==`" + value.id_tipo_modalidade + "`] | [0]");
    var modalidade_config = modalidade !== null && modalidade.hasOwnProperty('config') && typeof modalidade.config !== 'undefined' && modalidade.config !== null ? modalidade.config : false;
    var assinatura = (typeof value.config !== 'undefined' && value.config !== null && typeof value.config.assinatura !== 'undefined' && value.config.hasOwnProperty('assinatura')) ? value.config.assinatura : false;
    var view_modelos = modalidade_config && modalidade_config.hasOwnProperty('modelos') ? modalidade_config.modelos : false;
    var checkAssinatura = assinatura && view_modelos && value.vigencia ? true : false;

    let htmlBox = '               <div>' +
        (
            (
                (!checkEditEntregas && checkAvaliacao)
                || !checkEditEntregas
            )
                && textAvaliacao
                && checkAssinatura
                && (callAtiv('checkOptionEntidade','permitir_avaliacao_planos_vincendos') || calcTempo.entrega_fim_vigencia < moment())
                ? '                   <div style="display: inline-block;width: 100%;margin-top: 20px;text-align: right;">' +
                '                       <a class="newLink ' + (checkAvaliacao ? 'newLink_active' : 'newLink_confirm') + '" data-type="entregas" data-id="' + value.id_plano + '" data-indice="' + indice + '" data-mode="rate" style="font-size: 10pt;" data-act="atividades-call" data-fn="ratePlano">' +
                '                           <i class="fas ' + iconAvaliacao + '" style="font-size: 100%;"></i> ' + textAvaliacao +
                '                       </a>' +
                '                   </div>' +
                '' : '') +
        htmlOptionsTabEntregasPlanos({
            entrega_inicio_vigencia: calcTempo.entrega_inicio_vigencia.format('YYYY-MM-DD HH:mm:ss'),
            entrega_fim_vigencia: calcTempo.entrega_fim_vigencia.format('YYYY-MM-DD HH:mm:ss'),
            tempo_proporcional: tempo_proporcional,
            media_execucao: media_execucao,
            entregas: entregas,
            indice: indice,
            edit: checkEditEntregas,
            avalia_entrega: checkAvaliaEntrega,
            value: value
        }) +
        '                    </div>' +
        (checkEditEntregas ?
            '                    <div style="text-align: center;margin-top: 20px;">' +
            '                       <span style="font-size: 10pt; white-space: nowrap;text-align: center;padding: 10px;display: inline-block;background: #f9efad;border-radius: 5px;color: #666;margin: 10px;" class="alertaBoxDisplay">' +
            '                           <i class="fas fa-info-circle azulColor" style="margin: 0 5px; font-size: 10pt;"></i>' +
            '                           <span class="infoText">Distribuia a porcentagem de carga hor\u00E1ria para cada entrega listada (m\u00E1ximo 100%)</span>' +
            '                       </span>' +
            '                    </div>' +
            '' : '');
    return callAtiv('checkCapacidade','config_update_self_planos_entregas') || callAtiv('checkCapacidade','config_entregas') ? htmlBox : '';
}
export function htmlOptionsTabEntregasProgramas(param) {
    var entregas = param.entregas;
    var value = param.value;
    var homologado = callAtiv('checkHomologadoEntregasPrograma',value);
    var htmlBox = '                   <table id="configBox_entregas" data-format="obj_mult" data-key="entregas" style="font-size: 8pt !important;width: 100%;' + (entregas && !entregas.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
        '                        <thead>' +
        (!homologado ?
            '                           <tr>' +
            '                               <th colspan="5" style="text-align: right;">' +
            '                                   <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
            '                                       <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                       Adicionar novo item' +
            '                                   </a>' +
            '                               </th>' +
            '                           </tr>' +
            '' : '') +
        '                            <tr class="tableHeader">' +
        '                                <th class="tituloControle" style="width: 30%;">Nome da Entrega</th>' +
        '                                <th class="tituloControle" style="width: 5%;">Detalhes</th>' +
        '                                <th class="tituloControle" style="width: 30%;">Descri\u00E7\u00E3o dos Trabalhos</th>' +
        '                                <th class="tituloControle" style="width: 30%;">Crit\u00E9rios de Avalia\u00E7\u00E3o</th>' +
        (homologado ?
            '                                <th class="tituloControle" style="width: 10%;">Total de Planos</th>' +
            '                                <th class="tituloControle" style="width: 10%;">Meta <br>proporcional <br>(horas)</th>' +
            '                                <th class="tituloControle" style="width: 5%;">Qtd. <br>Horas <br>Entregues</th>' +
            '                                <th class="tituloControle" style="width: 5%;">Qtd. <br>Horas <br>Homologadas</th>' +
            '                                <th class="tituloControle" style="width: 5%;">Qtd. <br>Demandas <br>Vinculadas</th>' +
            '                                <th class="tituloControle" style="width: 5%;">Execu\u00E7\u00E3o da Entrega (%)</th>' +
            '                                <th class="tituloControle" style="width: 5%;">Meta <br>homologada <br>(horas)</th>' +
            '                                <th class="tituloControle" style="width: 5%;">Meta <br>n\u00E3o cumprida <br>(horas)</th>' +
            '' : '') +
        '                                <th class="tituloControle" style="width: 5%;"></th>' +
        '                            </tr>' +
        '                        </thead>' +
        '                        <tbody>';
    if (entregas) {
        $.each(entregas, function (i, v) {
            htmlBox += '                        <tr data-index="' + i + '" data-id="' + v.id_programa_entrega + '" data-value="' + v.id_programa_entrega + '" data-id_programa_entrega="' + v.id_programa_entrega + '" data-id_entrega="' + v.id_entrega + '" data-id_programa="' + value.id_programa + '" data-key="entregas" data-unique="true" style="text-align: left;">' +
                '                            <td class="" data-type="num_switch" data-key="entregas" style="padding: 0 10px;">' + unicodeToChar(v.nome_entrega_sigla) + '</td>' +
                '                            <td style="width: 50px; text-align: center;">' +
                '                               <a class="newLink" style="cursor: pointer;" data-act="atividades-call" data-fn="openDialogEntrega" data-tip="Visualiza\u00E7\u00E3o detalhes da entrega">' +
                '                                   <i class="fas fa-eye" style="font-size: 80%;"></i>' +
                '                               </a>' +
                '                            </td>' +
                '                           <td class="' + (homologado ? '' : 'editCell') + '" data-type="text" data-ref="value" data-key="descricao_entrega">' + (v.descricao_entrega || '') + '</td>' +
                '                           <td class="' + (homologado ? '' : 'editCell') + '" data-type="text" data-ref="value" data-key="criterios_avaliacao">' + (v.criterios_avaliacao || '') + '</td>' +
                (homologado ?
                    '                           <td style="text-align:center" class="totalPlanos">' + (v.total_planos || 0) + '</td>' +
                    '                           <td style="text-align:center" class="tempoProporcionalEntrega">' + (v.tempo_proporcional_entrega || 0) + '</td>' +
                    '                           <td style="text-align:center" class="horasEntrega">' + (v.horas_entrega || 0) + '</td>' +
                    '                           <td style="text-align:center" class="horasHomologadas">' + (v.horas_homologadas || 0) + '</td>' +
                    '                           <td style="text-align:center" class="demandasEntrega">' + (v.demandas_entrega || 0) + '</td>' +
                    '                           <td style="text-align:center" class="execucacaoEntrega">' + (v.execucao_entrega || 0) + '</td>' +
                    '                           <td style="text-align:center" class="metaHomologada">' + (v.meta_homologada || 0) + '</td>' +
                    '                           <td style="text-align:center" class="metaDescumprida">' + (v.meta_descumprida || 0) + '</td>' +
                    '' : '') +
                '                           <td style="width: 50px; text-align: center;">' +
                (!homologado ?
                    '                                 <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
                    '' : '') +
                '                            </td>' +
                '                        </tr>';
        });
    }
    htmlBox += (!homologado ?
        '                            <tr data-index="' + (entregas ? entregas.length : 0) + '" data-id="new" data-value="" data-id_programa_entrega="" data-id_entrega="" data-id_programa="' + value.id_programa + '" data-key="entregas" data-unique="true" style="text-align: left;">' +
        '                                <td class="' + (homologado ? '' : 'editCellSelect') + '" data-type="num" data-key="entregas" style="padding: 0 10px;"></td>' +
        '                                <td style="width: 50px; text-align: center;">' +
        '                                   <a class="newLink linkDialogEntrega" style="cursor: pointer;display:none;" data-act="atividades-call" data-fn="openDialogEntrega" data-tip="Visualiza\u00E7\u00E3o detalhes da entrega">' +
        '                                       <i class="fas fa-eye" style="font-size: 80%;"></i>' +
        '                                   </a>' +
        '                                </td>' +
        '                               <td class="' + (homologado ? '' : 'editCell') + '" data-type="text" data-ref="value" data-key="descricao_entrega"></td>' +
        '                               <td class="' + (homologado ? '' : 'editCell') + '" data-type="text" data-ref="value" data-key="criterios_avaliacao"></td>' +
        '                                <td style="width: 50px; text-align: center;">' +
        '                                     <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
        '                                </td>' +
        '                            </tr>' +
        '' : '') +
        '                        </tbody>' +
        '                    </table>';
    return htmlBox;
}
export function htmlOptionsTabEntregasPlanos(param) {
    let entregas = param.entregas;
    let indice = param.indice;
    let checkEditEntregas = param.edit;
    let editAvaliaEntrega = param.avalia_entrega;
    let value = param.value;
    let tempo_proporcional = param.tempo_proporcional;
    let media_execucao = param.media_execucao;
    let entrega_inicio_vigencia = param.entrega_inicio_vigencia;
    let entrega_fim_vigencia = param.entrega_fim_vigencia;

    let total_execucao_entrega = 0;
    let total_horas_entrega = 0;
    let total_horas_homologadas = 0;
    let total_demandas_entrega = 0;
    let total_tempo_proporcional = 0;
    let total_meta_homologada = 0;
    let total_carga_horaria = 0;
    let total_meta_descumprida = 0;
    let htmlBox = '                   <table id="configBox_entregas_programa_' + indice + '" data-format="obj_mult" data-key="entregas" style="display: inline-block;font-size: 8pt !important;width: 100%;' + (entregas && !entregas.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades configBox_entregas_programa seipro-atividades-table">' +
        '                        <thead>' +
        (checkEditEntregas ?
            '                           <tr>' +
            '                               <th colspan="' + (checkEditEntregas ? 5 : 8) + '" style="text-align: right;">' +
            '                                   <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
            '                                       <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                       Adicionar novo item' +
            '                                   </a>' +
            '                               </th>' +
            '                           </tr>' +
            '' : '') +
        '                            <tr class="tableHeader">' +
        '                                <th class="tituloControle" style="width: 30%;">Nome da Entrega</th>' +
        (!editAvaliaEntrega ?
            '                                <th class="tituloControle" style="display:none"></th>' +
            '                                <th class="tituloControle" style="width: 5%;">Detalhes</th>' +
            '' : '') +
        '                                <th class="tituloControle" style="width: 10%;">% Carga Hor\u00E1ria</th>' +
        '                                <th class="tituloControle" style="width: 10%;">Meta <br>proporcional <br>(horas)</th>' +
        (!checkEditEntregas ?
            '                                <th class="tituloControle" style="width: 5%;">Qtd. <br>Horas <br>Entregues</th>' +
            '                                <th class="tituloControle" style="width: 5%;">Qtd. <br>Horas <br>Homologadas</th>' +
            '                                <th class="tituloControle" style="width: 5%; ' + (editAvaliaEntrega ? 'display:none;' : '') + '">Qtd. <br>Demandas <br>Vinculadas</th>' +
            '                                <th class="tituloControle" style="width: 5%;">Execu\u00E7\u00E3o da Entrega (%)</th>' +
            (editAvaliaEntrega ?
                '                                <th class="tituloControle" style="width: 20%;">Resultado <br>da Avalia\u00E7\u00E3o</th>' +
                '                                <th class="tituloControle" style="width: 5%;">Meta <br>homologada <br>(horas)</th>' +
                '                                <th class="tituloControle" style="width: 5%;">Meta <br>n\u00E3o cumprida <br>(horas)</th>' +
                '' : '') +
            '' : '') +
        '                                <th class="tituloControle" style="width: 5%;"></th>' +
        '                            </tr>' +
        '                        </thead>' +
        '                        <tbody>';
    if (typeof entregas !== 'undefined' && entregas !== null && entregas.length && entregas) {
        $.each(entregas, function (i, v) {
            let tempo_proporcional_entrega = (tempo_proporcional * (v.carga_horaria_entrega / 100)).toFixed(2);
            tempo_proporcional_entrega = v.execucao && v.execucao.tempo_proporcional_entrega ? v.execucao.tempo_proporcional_entrega : tempo_proporcional_entrega;
            total_carga_horaria = total_carga_horaria + v.carga_horaria_entrega;
            total_tempo_proporcional = total_tempo_proporcional + parseFloat(tempo_proporcional_entrega);
            let horas_entrega = v.execucao ? v.execucao.horas_entrega : 0;
            horas_entrega = v.execucao && v.execucao.horas_entrega ? v.execucao.horas_entrega : horas_entrega;
            total_horas_entrega = total_horas_entrega + horas_entrega;
            let horas_homologadas = v.execucao ? v.execucao.horas_homologadas : 0;
            horas_homologadas = v.execucao && v.execucao.horas_homologadas ? v.execucao.horas_homologadas : horas_homologadas;
            total_horas_homologadas = total_horas_homologadas + horas_homologadas;
            let execucao_entrega = v.execucao ? (horas_entrega / tempo_proporcional_entrega) * 100 : 0;
            execucao_entrega = v.execucao && v.execucao.execucao_entrega ? v.execucao.execucao_entrega : execucao_entrega;
            execucao_entrega = tempo_proporcional_entrega == 0 ? 100 : execucao_entrega;
            total_execucao_entrega = total_execucao_entrega + execucao_entrega;
            let demandas_entrega = v.execucao ? v.execucao.demandas_entrega : 0;
            demandas_entrega = v.execucao && v.execucao.demandas_entrega ? v.execucao.demandas_entrega : demandas_entrega;
            total_demandas_entrega = total_demandas_entrega + demandas_entrega;
            let nome_tipo_execucao = v.execucao && v.execucao.nome_tipo_execucao ? v.execucao.nome_tipo_execucao : '';
            let tipo_execucao = v.execucao && v.execucao.tipo_execucao ? v.execucao.tipo_execucao : '';
            let meta_homologada = v.execucao && v.execucao.meta_homologada ? v.execucao.meta_homologada : 0;
            total_meta_homologada = total_meta_homologada + meta_homologada;
            let meta_descumprida = v.execucao && v.execucao.meta_descumprida ? v.execucao.meta_descumprida : 0;
            total_meta_descumprida = total_meta_descumprida + meta_descumprida;

            htmlBox += '                        <tr data-index="' + i + '" data-id="' + v.id_plano_entrega + '" data-id_plano="' + value.id_plano + '" data-entrega_inicio_vigencia="' + entrega_inicio_vigencia + '" data-entrega_fim_vigencia="' + entrega_fim_vigencia + '" data-value="' + v.id_plano_entrega + '"  data-tipo_execucao="' + tipo_execucao + '" data-id_entrega="' + v.id_entrega + '" data-key="entregas_programa" data-unique="true" data-unique-closest="table" style="text-align: left;">' +
                '                            <td class="" data-type="num_switch" data-key="entregas" style="padding: 0 10px;">' + unicodeToChar(v.nome_entrega_sigla) + '</td>' +
                (!editAvaliaEntrega ?
                    '                            <td style="display:none">' + v.indice_mes_entrega + '</td>' +
                    '                            <td style="width: 50px; text-align: center;">' +
                    '                               <a class="newLink" style="cursor: pointer;" data-act="atividades-call" data-fn="openDialogEntrega" data-tip="Visualiza\u00E7\u00E3o detalhes da entrega">' +
                    '                                   <i class="fas fa-eye" style="font-size: 80%;"></i>' +
                    '                               </a>' +
                    '                            </td>' +
                    '' : '') +
                '                           <td style="text-align:center" class="' + (checkEditEntregas ? 'editCellNum' : '') + '" data-min="0" data-max="100" data-type="num" data-ref="value" data-key="carga_horaria_entrega">' + (v.carga_horaria_entrega || '') + '</td>' +
                '                           <td style="text-align:center" class="tempoProporcionalEntrega">' + tempo_proporcional_entrega + '</td>' +
                (!checkEditEntregas ?
                    '                           <td style="text-align:center" class="horasEntrega">' + horas_entrega + '</td>' +
                    '                           <td style="text-align:center" class="horasHomologadas">' + horas_homologadas + '</td>' +
                    '                           <td style="text-align:center; ' + (editAvaliaEntrega ? 'display:none;' : '') + '" class="demandasEntrega">' + demandas_entrega + '</td>' +
                    '                           <td style="text-align:center" class="execucacaoEntrega">' + execucao_entrega.toFixed(2) + '</td>' +
                    (editAvaliaEntrega ?
                        '                           <td style="text-align:center" class="resultadoAvaliacao" data-array="tipos_avaliacoes" data-key="tipo_execucao" data-value="tipo_execucao" data-text="" data-new-item="false" data-blank-item="false">' + nome_tipo_execucao + '</td>' +
                        '                           <td style="text-align:center" class="metaHomologada">' + meta_homologada + '</td>' +
                        '                           <td style="text-align:center" class="metaDescumprida">' + meta_descumprida + '</td>' +
                        '' : '') +
                    '' : '') +
                '                            <td style="width: 50px; text-align: center;">' +
                (checkEditEntregas ?
                    '                                 <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
                    '' :
                    '                               <a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-indice_mes_entrega="' + indice + '" data-id_entrega="' + v.id_entrega + '" data-id_plano="' + value.id_plano + '" data-act="atividades-call" data-fn="getTableRelatorioPlano" data-tip="Clique para visualizar a lista de ' + __.demandas + ' do plano"><i class="fas fa-check-circle azulColor" style="font-size: 100%;"></i></a>'
                ) +
                '                            </td>' +
                '                        </tr>';
        });
    }
    htmlBox += (checkEditEntregas ?
        '                            <tr data-index="' + (entregas ? entregas.length : 0) + '" data-id_plano="' + value.id_plano + '" data-id="new" data-value="" data-key="entregas_programa" data-unique="true" data-unique-closest="table" style="text-align: left;">' +
        '                                <td class="editCellSelect" data-type="num" data-key="entregas" style="padding: 0 10px;"></td>' +
        (!editAvaliaEntrega ?
            '                                <td style="display:none">' + indice + '</td>' +
            '                                <td style="width: 50px; text-align: center;">' +
            '                                   <a class="newLink" style="cursor: pointer;display:none;" data-act="atividades-call" data-fn="openDialogEntrega" data-tip="Visualiza\u00E7\u00E3o detalhes da entrega">' +
            '                                       <i class="fas fa-eye" style="font-size: 80%;"></i>' +
            '                                   </a>' +
            '                                </td>' +
            '' : '') +
        '                               <td style="text-align:center" class="editCellNum" data-min="0" data-max="100" data-type="num" data-ref="value" data-key="carga_horaria_entrega"></td>' +
        '                               <td style="text-align:center" class="tempoProporcionalEntrega"></td>' +
        (!checkEditEntregas ?
            '                                <th></th>' +
            '                                <th></th>' +
            '                                <th style="' + (editAvaliaEntrega ? 'display:none;' : '') + '"></th>' +
            '                                <th></th>' +
            (editAvaliaEntrega ?
                '                                <th></th>' +
                '                                <th></th>' +
                '                                <th></th>' +
                '' : '') +
            '' : '') +
        '                                <td style="width: 50px; text-align: center;">' +
        '                                     <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
        '                                </td>' +
        '                            </tr>' +
        '' : '') +
        '                        </tbody>' +
        '                        <tfoot>' +
        '                            <tr class="tableHeader">' +
        '                                <th class="tituloControle">Total</th>' +
        (!editAvaliaEntrega ?
            '                                <th class="tituloControle" style="display:none"></th>' +
            '                                <th class="tituloControle"></th>' +
            '' : '') +
        '                                <th class="tituloControle totalPercentCargaHoraria">' + total_carga_horaria + '</th>' +
        '                                <th style="text-align:center" class="tituloControle totalTempoProporcionalEntrega">' + (param.value.avaliacao_plano ? total_tempo_proporcional : tempo_proporcional) + '</th>' +
        (!checkEditEntregas ?
            '                                <th class="tituloControle">' + total_horas_entrega.toFixed(2) + '</th>' +
            '                                <th class="tituloControle totalHorasHomologadas">' + total_horas_homologadas.toFixed(2) + '</th>' +
            '                                <th class="tituloControle" style="' + (editAvaliaEntrega ? 'display:none;' : '') + '">' + total_demandas_entrega + '</th>' +
            '                                <th class="tituloControle totalMediaExecucao">' + media_execucao.toFixed(2) + '</th>' +
            (editAvaliaEntrega ?
                '                                <th class="tituloControle"></th>' +
                '                                <th class="tituloControle totalMetaHomologada">' + total_meta_homologada.toFixed(2) + '</th>' +
                '                                <th class="tituloControle totalMetaDescumprida">' + total_meta_descumprida.toFixed(2) + '</th>' +
                '' : '') +
            '' : '') +
        '                                <th class="tituloControle"></th>' +
        '                            </tr>' +
        '                        </tfoot>' +
        '                    </table>';
    return htmlBox;
}
export function editConfigOptions(this_, id = false) {
    var _this = $(this_);
    var tr = _this.closest('tr');
    var table = _this.closest('table');
    var data = tr.data();
    id = !id ? data.id : id;
    var htmlBox = '';
    var countSelected = table.find('tr.infraTrMarcada').length;
    if (countSelected > 0) {
        table.find('.lnkInfraCheck').data('index', 1).trigger('click');
    }
    _this.closest('tr').find('td').eq(0).find('input[type="checkbox"]:not(.onoffswitch-checkbox)').trigger('click');

    if (data.type == 'atividades') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_atividade==`" + id + "`] | [0]");
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = __.Atividades;
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_atividade;
        var complexidade = (value.config !== null && typeof value.config.complexidade !== 'undefined' && value.config.complexidade !== null) ? value.config.complexidade : false;
        var tempo_minimo = (value.config !== null && typeof value.config.tempo_minimo !== 'undefined' && value.config.tempo_minimo !== null) ? value.config.tempo_minimo : 20;
        var complexidade_len = (complexidade) ? complexidade.length : 0;

        htmlBox = '<div id="' + idConfigBox + '" class="atividadeWork seipro-atividades-work" data-atividade="' + (value && value.id_atividade ? value.id_atividade : 0) + '">' +
            '<div id="' + idConfigBox + '_tabs" style="border: none; min-height: 300px; margin: 0;">' +
            '   <ul style="font-size: 10px;">' +
            '       <li><a href="#tabs_' + idConfigBox + '_variacao_produtividade">' + __.Complexidade + ' e Produtividade</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_predefinidas">Configura\u00E7\u00F5es Pr\u00E9-definidas</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_param_entregas">Par\u00E2metros e Entregas</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_outrasopcoes">Outras Op\u00E7\u00F5es</a></li>' +
            '   </ul>' +
            '   <div id="tabs_' + idConfigBox + '_variacao_produtividade">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-graduation-cap cinzaColor"></i>Grau de ' + __.Complexidade + ':</label>' +
            '           </td>' +
            '           <td style="position:relative">' +
            '   	        <div id="tabelaConfigPanel_' + data.type + '_complexidade" class="tabelaPanelScroll tabelaConfigPanel_' + data.type + '_scroll">' +
            '               <table id="configBox_complexidade" data-format="obj" data-key="complexidade" data-tempo-pactuado="' + value.tempo_pactuado + '" style="font-size: 8pt !important;width: 100%;" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="5" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px 5px 15px 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle">Grau</th>' +
            '                            <th class="tituloControle" style="width: 80px;">Fator</th>' +
            '                            <th class="tituloControle" style="width: 180px;">Tempo Pactuado</th>' +
            '                            <th class="tituloControle" style="width: 50px;">Padr\u00E3o</th>' +
            '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        if (complexidade) {
            $.each(value.config.complexidade, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-key="complexidade">' +
                    '                            <td class="editCell" data-key="complexidade" data-type="text" style="padding: 0 10px; text-align: left;">' + unicodeToChar(v.complexidade) + '</td>' +
                    '                            <td class="editCellNumComplex" data-key="fator" data-type="num" style="width: 80px; text-align: center;">' + v.fator + '</td>' +
                    '                            <td class="editCellNumComplex" data-key="tempo_pactuado" data-type="num" style="width: 180px; text-align: center;">' + roundToTwo(v.fator * value.tempo_pactuado) + '</td>' +
                    '                            <td data-key="default" data-type="switch" data-required="true" style="width: 50px; text-align: center;">' +
                    '                               <div class="onoffswitch" style="transform: scale(0.8);">' +
                    '                                   <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox switch_complexidadeDefault switch_complexidadeDefault_' + i + '" data-act="atividades-call" data-fn="changeSwitchConfigItem" id="changeItemConfig_' + data.type + '_' + i + '" tabindex="0" ' + (v.default ? 'checked' : '') + '>' +
                    '                                   <label class="onoff-switch-label" for="changeItemConfig_' + data.type + '_' + i + '"></label>' +
                    '                               </div>' +
                    '                            </td>' +
                    '                            <td style="width: 80px; text-align: center;">' +
                    '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                           </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += (complexidade_len == 0 ?
            '                        <tr data-index="' + complexidade_len + '" data-key="complexidade">' +
            '                            <td class="editCell" data-key="complexidade" data-type="text" style="padding: 0 10px; text-align: left;"></td>' +
            '                            <td class="editCellNumComplex" data-key="fator" data-type="num" style="width: 80px; text-align: center;"></td>' +
            '                            <td class="editCellNumComplex" data-key="tempo_pactuado" data-type="num" style="width: 180px; text-align: center;"></td>' +
            '                            <td data-key="default" data-type="switch" data-required="true" style="width: 50px; text-align: center;">' +
            '                               <div class="onoffswitch" style="transform: scale(0.8);">' +
            '                                   <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox switch_complexidadeDefault switch_complexidadeDefault_' + complexidade_len + '" data-act="atividades-call" data-fn="changeSwitchConfigItem" id="changeItemConfig_' + data.type + '_' + complexidade_len + '" tabindex="0">' +
            '                                   <label class="onoff-switch-label" for="changeItemConfig_' + data.type + '_' + complexidade_len + '"></label>' +
            '                               </div>' +
            '                            </td>' +
            '                            <td style="width: 80px; text-align: center;">' +
            '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
            '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                           </td>' +
            '                        </tr>' +
            '' : '') +
            '                    </tbody>' +
            '                </table>' +
            '                </div>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-chart-line cinzaColor"></i>Produtividade:</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;vertical-align: bottom;height: 40px;"><i class="iconPopup fas fa-hourglass-half cinzaColor"></i> Tempo despendido m\u00EDnimo aceit\u00E1vel para ' + __.a_atividade + ' (% do tempo pactuado)</td>' +
            '                      <td>' +
            '                            <input type="number" style="width: 50px !important;" id="tempo_minimo" data-key="tempo_minimo" min="0" max="100" step=".1" class="singleOptionConfig" tabindex="0" value="' + tempo_minimo + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;vertical-align: bottom;height: 40px;"><i class="iconPopup fas fa-chart-line cinzaColor"></i> Utilizar as configura\u00E7\u00F5es de Ganho de Produtividade da unidade</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-act="atividades-call" data-fn="changeConfigGanhoUnidade" class="onoffswitch-checkbox singleOptionConfig" id="ganho_unidade" data-key="ganho_unidade" tabindex="0" ' + (value.config && typeof value.config.ganho_unidade !== 'undefined' && value.config.ganho_unidade === false ? '' : 'checked') + '>' +
            '                              <label class="onoff-switch-label" for="ganho_unidade"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '               <div style="position:relative">' +
            '   	        <div id="tabelaConfigPanel_' + data.type + '_modalidades" class="tabelaPanelScroll tabelaConfigPanel_' + data.type + '_scroll">' +
            '               <table id="configBox_modalidades_atividade" data-format="obj" data-key="modalidades" style="font-size: 8pt !important;width: 100%; ' + (value.config && typeof value.config.ganho_unidade !== 'undefined' && value.config.ganho_unidade === false ? '' : 'display:none') + '" class="tableOptionConfig seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="3" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px 5px 15px 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle" style="width: 350px;">Tipo de Modalidade</th>' +
            '                            <th class="tituloControle" style="width: 175px;">Fator</th>' +
            '                            <th class="tituloControle" style="display:none">ID</th>' +
            '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        var modalidades = (typeof value.config !== 'undefined' && value.config !== null && typeof value.config.modalidades !== 'undefined' && value.config.modalidades !== null) ? value.config.modalidades : false;
        var modalidades_len = (modalidades) ? modalidades.length : 0;
        if (modalidades) {
            $.each(value.config.modalidades, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-key="modalidades">' +
                    '                            <td class="editCellSelect" data-key="tipo_modalidade" data-type="text" style="width: 350px; padding: 0 10px; text-align: left;">' + unicodeToChar(v.tipo_modalidade) + '</td>' +
                    '                            <td class="editCellNum" data-key="fator" data-type="text" style="width: 175px; text-align: left;">' + v.fator + '</td>' +
                    '                            <td data-key="id_tipo_modalidade" data-type="text" style="display:none;">' + v.id_tipo_modalidade + '</td>' +
                    '                            <td style="width: 80px; text-align: center;">' +
                    '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                           </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += '                        <tr data-index="' + modalidades_len + '" data-key="modalidades">' +
            '                            <td class="editCellSelect" data-key="tipo_modalidade" data-type="text" style="width: 350px; padding: 0 10px; text-align: left;"></td>' +
            '                            <td class="editCellNum" data-key="fator" data-type="text" style="width: 175px; text-align: left;"></td>' +
            '                            <td data-key="id_tipo_modalidade" data-type="text" style="display:none;"></td>' +
            '                            <td style="width: 80px; text-align: center;">' +
            '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
            '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                           </td>' +
            '                        </tr>' +
            '                    </tbody>' +
            '                </table>' +
            '                </div>' +
            '                </div>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_predefinidas">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left; width: 170px;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-folder-open cinzaColor"></i>Tipos de Processos:</label>' +
            '           </td>' +
            '           <td style="position:relative">' +
            '   	        <div id="tabelaConfigPanel_' + data.type + '_tipo_processo" class="tabelaConfigPanel_' + data.type + '_scroll tabelaPanelScroll">' +
            '               <table id="configBox_tipo_processo" data-format="array" data-key="tipo_processo" style="font-size: 8pt !important;width: 100%;" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="2" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; 5px 5px 15px 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle">Tipo</th>' +
            '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        var tipo_processo = (value.config !== null && typeof value.config.tipo_processo !== 'undefined' && value.config.tipo_processo !== null) ? value.config.tipo_processo : false;
        var tipo_processo_len = (tipo_processo) ? tipo_processo.length : 0;
        if (tipo_processo) {
            $.each(value.config.tipo_processo, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-key="tipo_processo" style="text-align: left;">' +
                    '                            <td class="editCellSelect" data-type="text" style="padding: 0 10px;">' + unicodeToChar(v[0]) + '</td>' +
                    '                            <td style="width: 80px; text-align: center;">' +
                    '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                           </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += (tipo_processo_len == 0 ?
            '                        <tr data-index="' + tipo_processo_len + '" data-key="tipo_processo" style="text-align: left;">' +
            '                            <td class="editCellSelect" data-type="text" style="padding: 0 10px;"></td>' +
            '                            <td style="width: 80px; text-align: center;">' +
            '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
            '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                           </td>' +
            '                        </tr>' +
            '' : '') +
            '                    </tbody>' +
            '                </table>' +
            '                </div>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-tags cinzaColor"></i>Etiquetas Pr\u00E9-definidas:</label>' +
            '           </td>' +
            '           <td style="position:relative">' +
            '   	        <div id="tabelaConfigPanel_' + data.type + '_etiquetas" class="tabelaConfigPanel_' + data.type + '_scroll tabelaPanelScroll">' +
            '               <table id="configBox_etiquetas" data-format="array" data-key="etiquetas" style="font-size: 8pt !important;width: 100%;" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="3" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px 5px 15px 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle">Nome da etiqueta</th>' +
            '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        var etiquetas = (value.config !== null && typeof value.config.etiquetas !== 'undefined' && value.config.etiquetas !== null) ? value.config.etiquetas : false;
        var etiquetas_len = (etiquetas) ? etiquetas.length : 0;
        if (etiquetas) {
            $.each(value.config.etiquetas, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-key="etiquetas" style="text-align: left;">' +
                    '                            <td data-act="atividades-call" data-fn="changeConfigItemCell" class="editCell" data-type="text" style="padding: 0 10px;">' + unicodeToChar(v[0]) + '</td>' +
                    '                            <td style="width: 80px; text-align: center;">' +
                    '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                           </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += (etiquetas_len == 0 ?
            '                        <tr data-index="' + etiquetas_len + '" data-key="etiquetas" style="text-align: left;">' +
            '                            <td data-act="atividades-call" data-fn="changeConfigItemCell" class="editCell" data-type="text" style="padding: 0 10px;"></td>' +
            '                            <td style="width: 80px; text-align: center;">' +
            '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
            '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                           </td>' +
            '                        </tr>' +
            '' : '') +
            '                    </tbody>' +
            '                </table>' +
            '                </div>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-check-double cinzaColor"></i>Checklist Pr\u00E9-definido:</label>' +
            '           </td>' +
            '           <td style="position:relative">' +
            '   	        <div id="tabelaConfigPanel_' + data.type + '_checklist" class="tabelaConfigPanel_' + data.type + '_scroll tabelaPanelScroll">' +
            '               <table id="configBox_checklist" data-format="array" data-key="checklist" style="font-size: 8pt !important;width: 100%;" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="3" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px 5px 15px 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle">Nome do item</th>' +
            '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        var checklist = (value.config !== null && typeof value.config.checklist !== 'undefined' && value.config.checklist !== null) ? value.config.checklist : false;
        var checklist_len = (checklist) ? checklist.length : 0;
        if (checklist) {
            $.each(value.config.checklist, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-key="checklist" style="text-align: left;">' +
                    '                            <td data-act="atividades-call" data-fn="changeConfigItemCell" class="editCell" data-type="text" style="padding: 0 10px;">' + unicodeToChar(v[0]) + '</td>' +
                    '                            <td style="width: 80px; text-align: center;">' +
                    '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                           </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += (checklist_len == 0 ?
            '                        <tr data-index="' + checklist_len + '" data-key="checklist" style="text-align: left;">' +
            '                            <td data-act="atividades-call" data-fn="changeConfigItemCell" class="editCell" data-type="text" style="padding: 0 10px;"></td>' +
            '                            <td style="width: 80px; text-align: center;">' +
            '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
            '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                           </td>' +
            '                        </tr>' +
            '' : '') +
            '                    </tbody>' +
            '                </table>' +
            '                </div>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-comment-alt cinzaColor"></i>' + __.Observacao + ' ' + __.Gerencial + ' Pr\u00E9-' + (getNameGenre('observacao', 'definido', 'definida')) + ':</label>' +
            '           </td>' +
            '           <td style="position:relative">' +
            '                <textarea id="observacao_gerencial" data-key="observacao_gerencial" class="singleOptionInput">' + (value.config !== null && typeof value.config.observacao_gerencial !== 'undefined' && value.config.observacao_gerencial !== null && value.config.observacao_gerencial != '' ? value.config.observacao_gerencial : '') + '</textarea>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_param_entregas">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-puzzle-piece cinzaColor"></i>Par\u00E2metros adotados:</label>' +
            '           </td>' +
            '           <td style="position:relative">' +
            '   	        <div id="tabelaConfigPanel_' + data.type + '_parametros" class="tabelaConfigPanel_' + data.type + '_scroll tabelaPanelScroll">' +
            '               <table id="configBox_parametros" data-format="array" data-key="parametros" style="font-size: 8pt !important;width: 100%;" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="3" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px 5px 15px 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle">Nome do par\u00E2metro</th>' +
            '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        var parametros = (value.config !== null && typeof value.config.parametros !== 'undefined' && value.config.parametros !== null) ? value.config.parametros : false;
        var parametros_len = (parametros) ? parametros.length : 0;
        if (parametros) {
            $.each(value.config.parametros, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-key="parametros" style="text-align: left;">' +
                    '                            <td data-act="atividades-call" data-fn="changeConfigItemCell" class="editCell" data-type="text" style="padding: 0 10px;">' + unicodeToChar(v[0]) + '</td>' +
                    '                            <td style="width: 80px; text-align: center;">' +
                    '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                           </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += (parametros_len == 0 ?
            '                        <tr data-index="' + parametros_len + '" data-key="parametros" style="text-align: left;">' +
            '                            <td data-act="atividades-call" data-fn="changeConfigItemCell" class="editCell" data-type="text" style="padding: 0 10px;"></td>' +
            '                            <td style="width: 80px; text-align: center;">' +
            '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
            '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                           </td>' +
            '                        </tr>' +
            '' : '') +
            '                    </tbody>' +
            '                </table>' +
            '                </div>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-file-export cinzaColor"></i>Entregas esperadas:</label>' +
            '           </td>' +
            '           <td style="position:relative">' +
            '   	        <div id="tabelaConfigPanel_' + data.type + '_entregas" class="tabelaConfigPanel_' + data.type + '_scroll tabelaPanelScroll">' +
            '               <table id="configBox_entregas" data-format="array" data-key="entregas" style="font-size: 8pt !important;width: 100%;" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="3" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px 5px 15px 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle">Tipo de entrega</th>' +
            '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        var entregas = (value.config !== null && typeof value.config.entregas !== 'undefined' && value.config.entregas !== null) ? value.config.entregas : false;
        var entregas_len = (entregas) ? entregas.length : 0;
        if (entregas) {
            $.each(value.config.entregas, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-key="entregas" style="text-align: left;">' +
                    '                            <td data-act="atividades-call" data-fn="changeConfigItemCell" class="editCell" data-type="text" style="padding: 0 10px;">' + unicodeToChar(v[0]) + '</td>' +
                    '                            <td style="width: 80px; text-align: center;">' +
                    '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                           </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += (entregas_len == 0 ?
            '                        <tr data-index="' + entregas_len + '" data-key="entregas" style="text-align: left;">' +
            '                            <td data-act="atividades-call" data-fn="changeConfigItemCell" class="editCell" data-type="text" style="padding: 0 10px;"></td>' +
            '                            <td style="width: 80px; text-align: center;">' +
            '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
            '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                           </td>' +
            '                        </tr>' +
            '' : '') +
            '                    </tbody>' +
            '                </table>' +
            '                </div>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_outrasopcoes">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-wrench cinzaColor"></i>Outras Op\u00E7\u00F5es</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-calendar-check cinzaColor"></i> Recalcular o prazo de entrega depois de ' + __.iniciada_a_demanda + '</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" id="recalcula_prazo" data-key="recalcula_prazo" tabindex="0" ' + (value.config && typeof value.config.recalcula_prazo !== 'undefined' && value.config.recalcula_prazo ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="recalcula_prazo"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-stopwatch cinzaColor"></i> Desativar o c\u00E1lculo de produtividade e controle de tempo de execu\u00E7\u00E3o <br>(para ' + __.atividades + ' do tipo <em>monitoramento</em>)</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" id="desativa_produtividade" data-key="desativa_produtividade" tabindex="0" ' + (value.config && typeof value.config.desativa_produtividade !== 'undefined' && value.config.desativa_produtividade ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="desativa_produtividade"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   </div>' +
            '</div>';
    } else if (data.type == 'planos') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_plano==`" + id + "`] | [0]");
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = 'Planos de Trabalho';
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_completo;
        var modalidade = jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?id_tipo_modalidade==`" + value.id_tipo_modalidade + "`] | [0]");
        var modalidade_config = modalidade !== null && modalidade.hasOwnProperty('config') && typeof modalidade.config !== 'undefined' && modalidade.config !== null ? modalidade.config : false;
        var view_modelos = (modalidade_config && modalidade_config.hasOwnProperty('modelos')) ? modalidade_config.modelos : false;
        var exige_autorizacao = (modalidade_config && modalidade_config.hasOwnProperty('exige_autorizacao')) ? modalidade_config.exige_autorizacao : false;
        var assinatura = (typeof value.config !== 'undefined' && value.config !== null && typeof value.config.assinatura !== 'undefined' && value.config.hasOwnProperty('assinatura')) ? value.config.assinatura : false;
        var inputAssinatura = (assinatura) ? "<input type='hidden' class='hiddenOptionConfig' data-type='json' data-key='assinatura' value='" + JSON.stringify(assinatura) + "'>" : '';
        var carga_horaria_padrao = (modalidade_config && modalidade_config.hasOwnProperty('carga_horaria_padrao')) ? modalidade_config.carga_horaria_padrao : false;

        var documento_autorizacao = (typeof value.config !== 'undefined' && value.config !== null && typeof value.config.documentos !== 'undefined' && value.config.hasOwnProperty('documentos') && value.config.documentos.length) ? value.config.documentos : false;
        documento_autorizacao = (documento_autorizacao) ? jmespath.search(documento_autorizacao, "[?nr_sei!=''] | [?id_procedimento!=`0`]") : false;
        documento_autorizacao = (documento_autorizacao && documento_autorizacao !== null && documento_autorizacao.length > 0) ? true : false;
        // documento_autorizacao = false;
        var reducao_carga_horaria = (carga_horaria_padrao && value.carga_horaria < carga_horaria_padrao && !documento_autorizacao && !assinatura) ? true : false;
        var type_documento = !callAtiv('getOptionEntidade','tipo_vinculacao_termo') || callAtiv('getOptionEntidade','tipo_vinculacao_termo') == 1 ? 'planos' : 'termos';
        var entregas = (value.entregas !== null && typeof value.entregas !== 'undefined') ? value.entregas : false;
        var acrescimo = (value.planos_acrescimo !== null && typeof value.planos_acrescimo !== 'undefined') ? value.planos_acrescimo.lista : false;
        var documentos = (typeof value.config !== 'undefined' && value.config !== null && typeof value.config.documentos !== 'undefined' && value.config !== null) ? value.config.documentos : false;
        var checkEditEntregas = !value.homologado && callAtiv('checkCapacidade','config_entregas') ? true : false;
        var checkEditAcrescimos = (
            (!value.homologado && callAtiv('checkHomologacaoPreviaPlanos',value))
            || (!value.homologado && !callAtiv('checkHomologacaoPreviaPlanos',value))
        ) && callAtiv('checkCapacidade','config_planos_acrescimo') ? true : false;
        var ref_assinatura = typeof value.ref_assinatura !== 'undefined' ? value.ref_assinatura : 'planos';
        var id_reference = typeof value.id_reference !== 'undefined' ? value.id_reference : value.id_plano;
        var deducao_plano = typeof value.deducao_plano !== 'undefined' && value.deducao_plano ? value.deducao_plano : false;

        // console.log({modalidade_config:modalidade_config, exige_autorizacao:exige_autorizacao, view_modelos:view_modelos, reducao_carga_horaria:reducao_carga_horaria, carga_horaria_padrao:carga_horaria_padrao, value_carga_horaria:value.carga_horaria, documento_autorizacao:documento_autorizacao, assinatura:assinatura});

        htmlBox = '<div id="' + idConfigBox + '" class="atividadeWork seipro-atividades-work" data-plano="' + (value && value.id_plano ? value.id_plano : 0) + '">' +
            '<div id="' + idConfigBox + '_tabs" style="border: none; min-height: 300px; margin: 0;">' +
            '   <ul style="font-size: 10px;">' +
            (callAtiv('checkCapacidade','config_entregas') && callAtiv('checkHomologacaoPreviaPlanos',value) ?
                '       <li><a href="#tabs_' + idConfigBox + '_entregas">Entregas</a></li>' +
                '' : '') +
            '       <li><a href="#tabs_' + idConfigBox + '_documentos">Documentos</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_atividades">' + __.Atividades + '</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_acrescimos">Acr\u00E9scimos Normativos</a></li>' +
            (deducao_plano ?
                '       <li><a href="#tabs_' + idConfigBox + '_deducoes">' + __.Deducoes + '</a></li>' +
                '' : '') +
            '   </ul>' +
            (callAtiv('checkCapacidade','config_entregas') && callAtiv('checkHomologacaoPreviaPlanos',value) ?
                '   <div id="tabs_' + idConfigBox + '_entregas">' +
                '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
                '          <tr>' +
                '               <td>' +
                '                   <div id="' + idConfigBox + '_tabs_mes" style="border: none; min-height: 300px; margin: 0;">' +
                '                       <ul id="getTabEntregasPlanos" style="font-size: 10px;background: transparent;border: none;">' +
                '' : '');
        htmlBox += callAtiv('checkCapacidade','config_entregas') && callAtiv('checkHomologacaoPreviaPlanos',value) ? getTabEntregasPlanos(idConfigBox, value, entregas, checkEditEntregas) : '';
        htmlBox += (callAtiv('checkCapacidade','config_entregas') && callAtiv('checkHomologacaoPreviaPlanos',value) ?
            '                       </ul>' +
            '                   </div>' +
            '               </td>' +
            '          </tr>' +
            '   </table>' +
            '   </div>' +
            '' : '') +
            '   <div id="tabs_' + idConfigBox + '_documentos">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '' + (view_modelos ?
                '      <tr>' +
                '          <td style="vertical-align: middle; text-align: left;" class="label">' +
                '               <label><i class="iconPopup iconSwitch fas fa-file-signature cinzaColor"></i>Documentos Dispon\u00EDveis</label>' +
                '           </td>' +
                '           <td>' +
                '               <table style="font-size: 8pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
                '                  <tr style="height: 40px;">' +
                '                      <td style="text-align: left;">' +
                '                           <a class="newLink viewModelDoc" data-type="' + ref_assinatura + '" data-sign="true" data-user="' + value.id_user + '" data-id_reference="' + id_reference + '" data-icon="pencil-alt" data-action="view" data-mode="modelo_termo_adesao" data-title="Termo de Ades\u00E3o" data-act="atividades-call" data-fn="editModelConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
                '                               <i class="fas fa-signature ' + (assinatura ? 'azulColor' : 'cinzaColor') + '" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
                '                               <i class="fas fa-' + (assinatura ? 'user-edit azulColor' : 'pencil-alt cinzaColor') + '" style="padding-right: 3px; cursor: pointer; font-size: 12pt; margin-left: -10px;"></i>' +
                '                               Termo de Ades\u00E3o' +
                '                           </a>' +
                (assinatura ?
                    '                           <div class="signed" style="font-size: 9pt;">' +
                    '                               <span>' +
                    '                                   <i class="fas fa-key laranjaColor" style="margin-right: 10px;"></i>' +
                    '                                   Termo de Ades\u00E3o assinado eletronicamente por <strong style="font-weight: bold;">' + assinatura[0].nome_completo + '</strong>, em ' + moment(assinatura[0].datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm') + ', conforme hor\u00E1rio oficial de Bras\u00EDlia' +
                    '                               </span>' +
                    '                           </div>' +
                    '                           ' + inputAssinatura +
                    '' : '') +
                '                      </td>' +
                '                  </tr>' +
                '               </table>' +
                '           </td>' +
                '      </tr>' +
                '' : '') +
            (exige_autorizacao || view_modelos || reducao_carga_horaria ?
                '      <tr>' +
                '          <td style="vertical-align: middle; text-align: left;" class="label">' +
                '               <label><i class="iconPopup iconSwitch fas fa-file-signature cinzaColor"></i>Documentos Vinculados:</label>' +
                '           </td>' +
                '           <td>' +
                '               <div class="tabelaPanelScroll">' +
                '               <table id="configBox_documentos" data-format="obj" data-key="documentos" style="font-size: 8pt !important;width: 100%;' + (documentos && !documentos.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
                '                    <thead>' +
                '                       <tr>' +
                '                           <th colspan="6" style="text-align: right;">' +
                '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
                '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
                '                                   Adicionar novo item' +
                '                               </a>' +
                '                           </th>' +
                '                       </tr>' +
                '                        <tr class="tableHeader">' +
                '                            <th class="tituloControle" style="width: 350px;">Tipo de Documento</th>' +
                '                            <th class="tituloControle" style="width: 175px;">N\u00FAmero SEI</th>' +
                '                            <th class="tituloControle" style="display:none">id_procedimento</th>' +
                '                            <th class="tituloControle" style="display:none">id_documento</th>' +
                '                            <th class="tituloControle" style="width: 50px;">Pr\u00E9via</th>' +
                '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
                '                        </tr>' +
                '                    </thead>' +
                '                    <tbody>' : '');
        var documentos_len = (documentos) ? documentos.length : 0;
        if (documentos && (exige_autorizacao || view_modelos || reducao_carga_horaria)) {
            $.each(value.config.documentos, function (i, v) {
                var previewDoc = '<a class="newLink" style="cursor: pointer;" ' + atividadesDialogDocAttrs({
                    title: unicodeToChar(v.documento) + ' (' + v.nr_sei + ')',
                    id_procedimento: v.id_procedimento,
                    id_documento: v.id_documento
                }) + ' data-tip="Visualiza\u00E7\u00E3o r\u00E1pida">' +
                    '   <i class="fas fa-eye" style="font-size: 80%;"></i>' +
                    '</a>';
                htmlBox += '                        <tr data-index="' + i + '" data-key="documentos" data-value="' + i + '" data-id="' + i + '">' +
                    '                            <td class="editCellSelect" data-key="documento" data-type="value" style="width: 350px; padding: 0 10px; text-align: left;">' + unicodeToChar(v.documento) + '</td>' +
                    '                            <td class="editCellSEI" data-key="nr_sei" data-type="num" style="width: 175px;text-align: center;">' + v.nr_sei + '</td>' +
                    '                            <td data-key="id_procedimento" data-type="num" style="text-align: left; display:none">' + v.id_procedimento + '</td>' +
                    '                            <td data-key="id_documento" data-type="num" style="text-align: left; display:none">' + v.id_documento + '</td>' +
                    '                            <td data-ref="previa" style="text-align: center; width: 50px;">' + previewDoc + '</td>' +
                    '                            <td style="width: 80px; text-align: center;">' +
                    '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                           </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += (exige_autorizacao || view_modelos || reducao_carga_horaria ?
            '                        <tr data-index="' + documentos_len + '" data-key="documentos" data-value="' + documentos_len + '" data-id="' + documentos_len + '">' +
            '                            <td class="editCellSelect" data-key="documento" data-type="value" style="width: 350px; padding: 0 10px; text-align: left;"></td>' +
            '                            <td class="editCellSEI" data-key="nr_sei" data-type="num" style="width: 175px;text-align: center;"></td>' +
            '                            <td data-key="id_procedimento" data-type="num" style="text-align: left; display:none"></td>' +
            '                            <td data-key="id_documento" data-type="num" style="text-align: left; display:none"></td>' +
            '                            <td data-ref="previa" style="text-align: center; width: 50px;"></td>' +
            '                            <td style="width: 80px; text-align: center;">' +
            '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
            '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                           </td>' +
            '                        </tr>' +
            '                    </tbody>' +
            '                </table>' +
            '                </div>' +
            '           </td>' +
            '      </tr>' +
            '' : '') +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_atividades">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-clipboard-list cinzaColor"></i>' + __.Atividades + '</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            (callAtiv('checkOptionEntidade','duplicar_automaticamente') ?
                '                  <tr style="height: 40px;">' +
                '                      <td style="text-align: left;"><i class="iconPopup fas fa-clone cinzaColor"></i> N\u00E3o duplicar planos de trabalho automaticamente ap\u00F3s a homologa\u00E7\u00E3o</td>' +
                '                      <td style="text-align: right;">' +
                '                          <div class="onoffswitch" style="float: right;">' +
                '                              <input type="checkbox" name="onoffswitch" data-key="nao_duplicar_automaticamente" class="onoffswitch-checkbox singleOptionConfig" id="nao_duplicar_automaticamente" tabindex="0" ' + (value.config && typeof value.config.nao_duplicar_automaticamente !== 'undefined' && value.config.nao_duplicar_automaticamente ? 'checked' : '') + '>' +
                '                              <label class="onoff-switch-label" for="nao_duplicar_automaticamente"></label>' +
                '                          </div>' +
                '                      </td>' +
                '                  </tr>' +
                '' : '') +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-retweet cinzaColor"></i> Vincular toda a lista de ' + __.atividades + '</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" id="atividades_lista_integral" data-act="atividades-call" data-fn="changeConfigAtivIntegral" data-key="atividades_lista_integral" tabindex="0" ' + (value.config && typeof value.config.atividades_lista_integral !== 'undefined' && value.config.atividades_lista_integral === false ? '' : 'checked') + '>' +
            '                              <label class="onoff-switch-label" for="atividades_lista_integral"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px; ' + (value.config !== null && typeof value.config.lista_atividades !== 'undefined' && value.config.lista_atividades !== null && value.config.lista_atividades.length > 0 ? '' : 'display:none;') + '" id="configBox_lista_atividades_tr">' +
            '                      <td style="text-align: left;" colspan="2">' +
            '                           <div><i class="iconPopup fas fa-mouse-pointer cinzaColor"></i> Selecionar ' + __.atividades + ' ' + getNameGenre('atividade', 'espec\u00EDficos', 'espec\u00EDficas') + '</div>' +
            '                           <div class="tabelaPanelScroll">' +
            '                               <table id="configBox_lista_atividades" data-format="obj_mult" data-key="lista_atividades" style="font-size: 8pt !important;width: 100%;" class="tableCheckboxConfig seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                                    <thead>' +
            '                                        <tr class="tableHeader">' +
            '                                            <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_atividades" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_atividades" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck"></a></th>' +
            '                                            <th class="tituloControle">Nome d' + __.a_Atividade + '</th>' +
            '                                            <th class="tituloControle">Tempo Pactuado</th>' +
            '                                        </tr>' +
            '                                    </thead>' +
            '                                    <tbody>' +
            '                                    </tbody>' +
            '                                </table>' +
            '                           </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_acrescimos">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;" colspan="2">' +
            '                           <div class="tabelaPanelScroll">' +
            '                               <table id="configBox_planos_acrescimo" data-format="obj_mult" data-key="planos_acrescimo" style="font-size: 8pt !important;width: 100%;' + (acrescimo && !acrescimo.length ? 'margin-bottom:80px;' : '') + '" class="tableCheckboxConfig seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                                    <thead>' +
            (checkEditAcrescimos ?
                '                                      <tr>' +
                '                                          <th colspan="6" style="text-align: right;">' +
                '                                              <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
                '                                                  <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
                '                                                  Adicionar novo item' +
                '                                              </a>' +
                '                                          </th>' +
                '                                      </tr>' +
                '' : '') +
            '                                        <tr class="tableHeader">' +
            '                                            <th class="tituloControle" style="width: 200px;">Motivo do Acr\u00E9scimo</th>' +
            '                                            <th class="tituloControle">Tempo Acrescido</th>' +
            '                                           <th class="tituloControle">N\u00FAmero SEI</th>' +
            '                                            <th class="tituloControle" style="display:none">id_procedimento</th>' +
            '                                            <th class="tituloControle" style="display:none">id_documento</th>' +
            '                                            <th class="tituloControle" style="width: 70px;">A\u00E7\u00E3o</th>' +
            '                                        </tr>' +
            '                                    </thead>' +
            '                                    <tbody>';
        if (acrescimo) {
            $.each(acrescimo, function (i, v) {
                var config_acrescimo = typeof v.config !== 'undefined' && v.config !== null ? v.config : false;
                var motivo_acrescimo = v.id_plano_deducao ? 'Compensa\u00E7\u00E3o de plano anterior (#' + v.id_plano_deducao + ')' : config_acrescimo.observacoes;
                var previewDoc = config_acrescimo
                    ? '<a class="newLink" style="cursor: pointer;margin: 0;float:right;" ' + atividadesDialogDocAttrs({
                        title: '(' + config_acrescimo.nr_sei + ')',
                        id_procedimento: config_acrescimo.id_procedimento,
                        id_documento: config_acrescimo.id_documento
                    }) + ' data-tip="Visualiza\u00E7\u00E3o r\u00E1pida">' +
                    '   <i class="fas fa-eye" style="font-size: 80%;"></i>' +
                    '</a>'
                    : '';
                htmlBox += '                                       <tr data-index="' + i + '" data-key="planos_acrescimo" data-value="" data-id_plano="' + value.id_plano + '" data-id="' + v.id_plano_acrescimo + '" style="text-align: left;">' +
                    '                                           <td class="' + (checkEditAcrescimos && !v.id_plano_deducao ? 'editCell' : '') + '" data-type="text" data-ref="value" data-key="observacoes" style="width: 80px; text-align: left;">' + (motivo_acrescimo || '') + '</td>' +
                    '                                           <td class="' + (checkEditAcrescimos ? 'editCellNumInt' : '') + '" data-type="num" data-ref="value" data-key="tempo_acrescimo" style="width: 80px; text-align: center;">' + v.tempo_acrescimo + '</td>' +
                    '                                           <td class="' + (checkEditAcrescimos ? 'editCellSEI' : '') + '" data-key="nr_sei" data-type="num" style="width: 175px;text-align: center;">' + (!config_acrescimo ? '' : config_acrescimo.nr_sei) + '</td>' +
                    '                                           <td data-key="id_procedimento" data-type="num" style="text-align: left; display:none">' + (!config_acrescimo ? '' : config_acrescimo.id_procedimento) + '</td>' +
                    '                                           <td data-key="id_documento" data-type="num" style="text-align: left; display:none">' + (!config_acrescimo ? '' : config_acrescimo.id_documento) + '</td>' +
                    '                                           <td data-ref="previa" style="text-align: center; width: 70px;">' +
                    (checkEditAcrescimos ?
                        '                                              <a class="newLink" style="cursor: pointer;margin: 0;float: right;" data-act="atividades-call" data-fn="removeConfigRowByID"><i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;"></i></a>' +
                        '' : '') +
                    '                                               ' + previewDoc +
                    '                                           </td>' +
                    '                                       </tr>';
            });
        }
        htmlBox += '                                      <tr data-index="' + (acrescimo ? acrescimo.length : 0) + '" data-id="new" data-value="" data-id_plano="' + value.id_plano + '" data-key="planos_acrescimo" style="text-align: left;">' +
            '                                          <td class="' + (checkEditAcrescimos ? 'editCell' : '') + '" data-type="text" data-ref="value" data-key="observacao" style="width: 80px; text-align: left;"></td>' +
            '                                          <td class="' + (checkEditAcrescimos ? 'editCellNumInt' : '') + '" data-type="num" data-ref="value" data-key="tempo_acrescimo" style="width: 80px; text-align: center;"></td>' +
            '                                          <td class="' + (checkEditAcrescimos ? 'editCellSEI' : '') + '" data-key="nr_sei" data-type="num" style="width: 175px;text-align: center;"></td>' +
            '                                          <td data-key="id_procedimento" data-type="num" style="text-align: left; display:none"></td>' +
            '                                          <td data-key="id_documento" data-type="num" style="text-align: left; display:none"></td>' +
            '                                          <td data-ref="previa" style="text-align: center; width: 70px;">' +
            (checkEditAcrescimos ?
                '                                              <a class="newLink" style="cursor: pointer;margin: 0;float: right;" data-act="atividades-call" data-fn="removeConfigRowByID"><i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;"></i></a>' +
                '' : '') +
            '                                           </td>' +
            '                                       </tr>' +
            '                                   </tbody>' +
            '                                </table>' +
            '                           </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            (deducao_plano ?
                '   <div id="tabs_' + idConfigBox + '_deducoes">' +
                '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
                '      <tr>' +
                '           <td>' +
                '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
                '                  <tr style="height: 40px;">' +
                '                      <td style="text-align: left;" colspan="2">' +
                '                           <div class="tabelaPanelScroll">' +
                '                               <table id="configBox_planos_acrescimo" data-format="obj_mult" data-key="planos_acrescimo" style="font-size: 8pt !important;width: 100%;' + (deducao_plano ? 'margin-bottom:80px;' : '') + '" class="tableCheckboxConfig seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
                '                                    <thead>' +
                '                                        <tr class="tableHeader">' +
                '                                            <th class="tituloControle">Refer\u00EAncia</th>' +
                '                                            <th class="tituloControle">Data de in\u00EDcio de vig\u00EAncia</th>' +
                '                                            <th class="tituloControle">Tempo de compensa\u00E7\u00E3o (horas)</th>' +
                '                                            <th class="tituloControle">Tempo de desconto (horas)</th>' +
                '                                            <th class="tituloControle"># Plano compensat\u00F3rio</th>' +
                '                                           <th class="tituloControle">N\u00FAmero SEI</th>' +
                '                                            <th class="tituloControle" style="display:none">id_procedimento</th>' +
                '                                            <th class="tituloControle" style="display:none">id_documento</th>' +
                '                                            <th class="tituloControle" style="width: 70px;">A\u00E7\u00E3o</th>' +
                '                                        </tr>' +
                '                                    </thead>' +
                '                                    <tbody>' +
                '' : '');
        if (deducao_plano) {
            $.each(deducao_plano, function (i, v) {
                let calcTempo = tempoProporcionalTabEntregasPlanos(v, v.indice_mes_entrega);
                let entrega_inicio_vigencia = calcTempo.entrega_inicio_vigencia.format('DD/MM/YYYY');
                let entrega_fim_vigencia = calcTempo.entrega_fim_vigencia.format('DD/MM/YYYY');
                var config_deducao = typeof v.config !== 'undefined' && v.config !== null && v.config.length ? v.config : false;
                var previewDoc = !config_deducao
                    ? ''
                    : '<a class="newLink" style="cursor: pointer;margin: 0;float:right;" ' + atividadesDialogDocAttrs({
                        title: '(' + config_deducao.nr_sei + ')',
                        id_procedimento: config_deducao.id_procedimento,
                        id_documento: config_deducao.id_documento
                    }) + ' data-tip="Visualiza\u00E7\u00E3o r\u00E1pida">' +
                    '   <i class="fas fa-eye" style="font-size: 80%;"></i>' +
                    '</a>';
                var postergaInicio = !callAtiv('checkPerfilNivelAdm',)
                    ? ''
                    : '<a class="newLink" style="cursor: pointer;margin: 0;float:right;" data-type="planos_deducao" data-id_plano_deducao="' + v.id_plano_deducao + '" data-act="atividades-call" data-fn="postponeConfig" data-data_inicio_vigencia="' + v.data_inicio_vigencia + '" data-tip="Postergar in\u00EDcio de vig\u00EAncia">' +
                    '   <i class="fas fa-stopwatch" style="font-size: 80%;"></i>' +
                    '</a>';
                htmlBox += '                                       <tr data-index="' + i + '" data-key="planos_deducao" data-value="" data-id_plano="' + v.id_plano + '" data-id_plano="' + v.id_avaliacao + '" data-id="' + v.id_plano_deducao + '" style="text-align: left;">' +
                    '                                           <td style="text-align: center;">' + entrega_inicio_vigencia + ' \u00E0 ' + entrega_fim_vigencia + '</td>' +
                    '                                           <td style="text-align: center;">' + moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                    '                                           <td style="text-align: center;">' + (v.tempo_compensacao || '') + '</td>' +
                    '                                           <td style="text-align: center;">' + (v.tempo_desconto || '') + '</td>' +
                    '                                           <td style="text-align: center;">' + (v.id_plano_compensatorio || '-') + '</td>' +
                    '                                           <td class="editCellSEI" data-key="nr_sei" data-type="num" style="width: 175px;text-align: center;">' + (!config_deducao ? '' : config_deducao.nr_sei) + '</td>' +
                    '                                           <td data-key="id_procedimento" data-type="num" style="text-align: left; display:none">' + (!config_deducao ? '' : config_deducao.id_procedimento) + '</td>' +
                    '                                           <td data-key="id_documento" data-type="num" style="text-align: left; display:none">' + (!config_deducao ? '' : config_deducao.id_documento) + '</td>' +
                    '                                           <td data-ref="previa" style="text-align: center; width: 70px;">' +
                    '                                               ' + previewDoc + postergaInicio +
                    '                                           </td>' +
                    '                                       </tr>';
            });
        }
        htmlBox += (deducao_plano ?
            '                                   </tbody>' +
            '                                </table>' +
            '                           </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '' : '') +
            '</div>' +
            '</div>';
    } else if (data.type == 'programas') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_programa==`" + id + "`] | [0]");
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = __.Programas;
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_sigla;
        var entregas = value.entregas ? value.entregas : false;
        var checkAvaliacao = callAtiv('checkHomologadoEntregasPrograma',value) && jmespath.search(entregas, "[?id_avaliacao] | length(@)") > 0 ? true : false;
        let textAvaliacao = checkAvaliacao ? 'Visualizar avalia\u00E7\u00E3o' : 'Avaliar Entregas';
        var checkBtnAvaliacao = callAtiv('checkHomologadoEntregasPrograma',value) && moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') < moment().add(20, 'month') ? true : false;

        htmlBox = '<div id="' + idConfigBox + '" class="atividadeWork seipro-atividades-work" data-programa="' + (value && value.id_programa ? value.id_programa : 0) + '">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '          <tr>' +
            '               <td>' +
            (checkBtnAvaliacao ?
                '                   <div style="display: inline-block;width: 100%;margin-top: 20px;text-align: right;">' +
                '                       <a class="newLink ' + (checkAvaliacao ? 'newLink_active' : 'newLink_confirm') + '" data-type="entregas" data-id="' + value.id_programa + '" data-mode="rate" style="font-size: 10pt;" data-act="atividades-call" data-fn="ratePrograma">' +
                '                           <i class="fas fa-star" style="font-size: 100%;"></i> ' + textAvaliacao +
                '                       </a>' +
                '                   </div>' +
                '' : '') +
            '               <div ' + (checkBtnAvaliacao ? 'class="tabelaPanelScroll"' : '') + '>' +
            htmlOptionsTabEntregasProgramas({
                value: value,
                entregas: entregas
            }) +
            '               </div>';
    } else if (data.type == 'objetivos') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_objetivo==`" + id + "`] | [0]");
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = 'Objetivos Estrat\u00E9gicos';
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_sigla;
        var eixos = (typeof value.config !== 'undefined' && value.config !== null && typeof value.config.eixos !== 'undefined' && value.config.eixos !== null) ? value.config.eixos : false;

        htmlBox = '<div id="' + idConfigBox + '" class="atividadeWork seipro-atividades-work" data-objetivo="' + (value && value.id_objetivo ? value.id_objetivo : 0) + '">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-exchange-alt cinzaColor"></i>Eixos Tem\u00E1ticos:</label>' +
            '           </td>' +
            '           <td>' +
            '               <div class="tabelaPanelScroll">' +
            '               <table id="configBox_eixos" data-format="obj" data-key="eixos" style="font-size: 8pt !important;width: 100%;' + (eixos && !eixos.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="6" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle" style="width: 350px;">Tipo de Eixo Tem\u00E1tico</th>' +
            '                            <th class="tituloControle" style="display:none">ID</th>' +
            '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        if (eixos) {
            $.each(value.config.eixos, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-id="' + v.id_tipo_eixo + '" data-value="' + v.id_tipo_eixo + '" data-key="tipos_eixos" data-unique="true" style="text-align: left;">' +
                    '                            <td class="editCellSelect" data-type="value" data-key="nome_eixo" data-type="text" style="width: 350px; padding: 0 10px; text-align: left;">' + unicodeToChar(v.nome_eixo) + '</td>' +
                    '                            <td class="" data-type="num" data-key="id_tipo_eixo" style="padding: 0 10px;display:none;">' + v.id_tipo_eixo + '</td>' +
                    '                            <td style="width: 80px; text-align: center;">' +
                    '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                           </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += '                        <tr data-index="' + (eixos ? eixos.length : 0) + '" data-id="new" data-value="" data-key="tipos_eixos" data-unique="true" style="text-align: left;">' +
            '                            <td class="editCellSelect" data-type="value" data-key="nome_eixo" data-type="text" style="width: 350px; padding: 0 10px; text-align: left;"></td>' +
            '                            <td class="" data-type="num" data-key="id_tipo_eixo" style="padding: 0 10px;display:none;"></td>' +
            '                            <td style="width: 80px; text-align: center;">' +
            '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
            '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                           </td>' +
            '                        </tr>' +
            '                    </tbody>' +
            '                </table>' +
            '                </div>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '</div>';
    } else if (data.type == 'mapas') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_mapa==`" + id + "`] | [0]");
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = 'Mapas Estrat\u00E9gicos';
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_sigla;
        var valores = (value.config !== null && typeof value.config.valores !== 'undefined' && value.config.valores !== null) ? value.config.valores : false;

        htmlBox = '<div id="' + idConfigBox + '" class="atividadeWork seipro-atividades-work" data-mapa="' + (value && value.id_mapa ? value.id_mapa : 0) + '">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-compass cinzaColor"></i>Valores:</label>' +
            '           </td>' +
            '           <td style="position:relative">' +
            '   	        <div id="tabelaConfigPanel_' + data.type + '_valores" class="tabelaConfigPanel_' + data.type + '_scroll tabelaPanelScroll">' +
            '               <table id="configBox_valores" data-format="array" data-key="valores" style="font-size: 8pt !important;width: 100%;' + (valores && !valores.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="3" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px 5px 15px 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle">Nome do Valor</th>' +
            '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        if (valores) {
            $.each(value.config.valores, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-key="valores" style="text-align: left;">' +
                    '                            <td data-act="atividades-call" data-fn="changeConfigItemCell" class="editCell" data-type="text" style="padding: 0 10px;">' + unicodeToChar(v[0]) + '</td>' +
                    '                            <td style="width: 80px; text-align: center;">' +
                    '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                           </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += (valores_len == 0 ?
            '                        <tr data-index="' + (valores ? valores.length : 0) + '" data-key="valores" style="text-align: left;">' +
            '                            <td data-act="atividades-call" data-fn="changeConfigItemCell" class="editCell" data-type="text" style="padding: 0 10px;"></td>' +
            '                            <td style="width: 80px; text-align: center;">' +
            '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
            '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                           </td>' +
            '                        </tr>' +
            '' : '') +
            '                    </tbody>' +
            '                </table>' +
            '                </div>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '</div>';
    } else if (data.type == 'users') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_user==`" + id + "`] | [0]");
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = 'Usu\u00E1rios';
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_completo;
        var lotacao = (value.lotacao !== null && typeof value.lotacao !== 'undefined') ? value.lotacao : false;
        var metadados = (value.metadados !== null && typeof value.metadados !== 'undefined') ? value.metadados : false;

        htmlBox = '<div id="' + idConfigBox + '" class="atividadeWork seipro-atividades-work" data-atividade="' + (value && value.id_user ? value.id_user : 0) + '">' +
            '<div id="' + idConfigBox + '_tabs" style="border: none; min-height: 300px; margin: 0;">' +
            '   <ul style="font-size: 10px;">' +
            '       <li><a href="#tabs_' + idConfigBox + '_seguranca">Seguran\u00E7a</a></li>' +
            (callAtiv('checkCapacidade','config_update_lotacao') ?
                '       <li><a href="#tabs_' + idConfigBox + '_lotacao">Lota\u00E7\u00E3o</a></li>' +
                '' : '') +
            (callAtiv('checkCapacidade','config_view_metadados') ?
                '       <li><a href="#tabs_' + idConfigBox + '_metadados">Metadados</a></li>' +
                '' : '') +
            '   </ul>' +
            '   <div id="tabs_' + idConfigBox + '_seguranca">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            (callAtiv('checkCapacidade','config_update_user_perfil') ?
                '      <tr>' +
                '          <td style="vertical-align: middle; text-align: left;" class="label">' +
                '               <label><i class="iconPopup iconSwitch fas fa-user-lock cinzaColor"></i>Perfil:</label>' +
                '           </td>' +
                '           <td>' +
                '               <div>' +
                '               <table id="configBox_perfil" data-format="obj_mult" data-key="perfil" style="font-size: 8pt !important;width: 100%;" class="tableOptionConfig seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
                '                    <thead>' +
                '                        <tr class="tableHeader">' +
                '                            <th class="tituloControle" style="width: 40%;">Tipo de Perfil</th>' +
                '                        </tr>' +
                '                    </thead>' +
                '                    <tbody>'
                : '');

        var id_perfil = (value.id_perfil !== null && typeof value.id_perfil !== 'undefined') ? value.id_perfil : '0';
        var value_perfil = jmespath.search(arrayConfigAtividades.perfis, "[?id_perfil==`" + id_perfil + "`] | [0]");
        var nome_perfil = (value_perfil !== null) ? unicodeToChar(value_perfil.nome_perfil) : '';
        var perfil_vencimento = (value !== null && value.data_perfil != '0000-00-00 00:00:00') ? moment(value.data_perfil, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : '';
        htmlBox += (callAtiv('checkCapacidade','config_update_user_perfil') ?
            '                        <tr data-index="0" data-id="' + id_perfil + '" data-value="' + id_perfil + '" data-key="perfil" style="text-align: left;">' +
            '                            <td class="editCellSelect" data-type="num" data-key="perfil" style="padding: 0 10px;">' + nome_perfil + '</td>' +
            '                        </tr>' +
            '                    </tbody>' +
            '                </table>' +
            '               <table id="configBox_perfil_vencimento" data-format="array" data-key="perfil_vencimento" style="font-size: 8pt !important;width: 100%;" class="tableOptionConfig seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle" style="width: 40%;">Vencimento</th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>' +
            '                        <tr data-index="0" data-id="' + id_perfil + '" data-value="' + id_perfil + '" data-key="perfil_vencimento" style="text-align: left;">' +
            '                            <td class="editCellDate" data-type="date" data-key="perfil_vencimento" style="padding: 0 10px;">' + perfil_vencimento + '</td>' +
            '                        </tr>' +
            '                    </tbody>' +
            '                </table>' +
            '           </td>' +
            '      </tr>'
            : '');

        if (callAtiv('checkCapacidade','config_update_keys')) {
            htmlBox += '      <tr>' +
                '          <td style="vertical-align: middle; text-align: left;" class="label">' +
                '               <label><i class="iconPopup iconSwitch fas fa-key cinzaColor"></i>Chaves de Acesso:</label>' +
                '           </td>' +
                '           <td>' +
                '               <div class="tabelaPanelScroll" id="configBox_keys_container">' +
                tableConfigKeyUsers(value) +
                '                </div>' +
                '           </td>' +
                '      </tr>';
        }
        htmlBox += '       </table>' +
            '   </div>' +
            (callAtiv('checkCapacidade','config_update_lotacao') ?
                '   <div id="tabs_' + idConfigBox + '_lotacao">' +
                '       <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
                '          <tr>' +
                '              <td style="vertical-align: middle; text-align: left;" class="label">' +
                '                   <label><i class="iconPopup iconSwitch fas fa-briefcase cinzaColor"></i>Lota\u00E7\u00E3o:</label>' +
                '               </td>' +
                '               <td>' +
                '               <div class="tabelaPanelScroll">' +
                '                   <table id="configBox_lotacao" data-format="obj_mult" data-key="lotacao" style="font-size: 8pt !important;width: 100%;' + (lotacao && !lotacao.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
                '                        <thead>' +
                '                           <tr>' +
                '                               <th colspan="3" style="text-align: right;">' +
                '                                   <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
                '                                       <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
                '                                       Adicionar novo item' +
                '                                   </a>' +
                '                               </th>' +
                '                           </tr>' +
                '                            <tr class="tableHeader">' +
                '                                <th class="tituloControle">Unidade</th>' +
                '                                <th class="tituloControle" style="width: 50px;">Principal</th>' +
                '                                <th class="tituloControle" style="width: 50px;"></th>' +
                '                            </tr>' +
                '                        </thead>' +
                '                        <tbody>'
                : '');
        var lotacao_len = (lotacao) ? lotacao.length : 0;
        if (callAtiv('checkCapacidade','config_update_lotacao') && lotacao) {
            $.each(lotacao, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-id="' + v.id_lotacao + '" data-value="' + v.id_unidade + '" data-key="lotacao" data-unique="true" style="text-align: left;">' +
                    '                            <td class="" data-type="num_switch" data-key="unidade" style="padding: 0 10px;">' + unicodeToChar(v.sigla_unidade + ' - ' + v.nome_unidade) + '</td>' +
                    '                            <td data-key="default" data-type="switch" data-required="true" style="width: 50px; text-align: center;">' +
                    '                               <div class="onoffswitch" style="transform: scale(0.8);">' +
                    '                                   <input data-key="principal" type="checkbox" name="onoffswitch" class="onoffswitch-checkbox switch_lotacaoDefault switch_lotacaoDefault_' + i + '" data-act="atividades-call" data-fn="changeSwitchConfigItem" id="changeItemConfig_' + data.type + '_' + i + '" tabindex="0" ' + (typeof v.config_lotacao !== 'undefined' && v.config_lotacao !== null && v.config_lotacao.principal ? 'checked' : '') + '>' +
                    '                                   <label class="onoff-switch-label" for="changeItemConfig_' + data.type + '_' + i + '"></label>' +
                    '                               </div>' +
                    '                            </td>' +
                    '                            <td style="width: 50px; text-align: center;">' +
                    '                                 <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
                    '                            </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += (callAtiv('checkCapacidade','config_update_lotacao') ?
            '                            <tr data-index="' + lotacao_len + '" data-id="new" data-value="" data-key="lotacao" data-unique="true" style="text-align: left;">' +
            '                                <td class="editCellSelect" data-type="num" data-key="unidade" style="padding: 0 10px;"></td>' +
            '                                <td data-key="default" data-type="switch" data-required="true" style="width: 50px; text-align: center;">' +
            '                                   <div class="onoffswitch" style="transform: scale(0.8);">' +
            '                                       <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox switch_lotacaoDefault switch_lotacaoDefault_' + lotacao_len + '" data-act="atividades-call" data-fn="changeSwitchConfigItem" id="changeItemConfig_' + data.type + '_' + lotacao_len + '" tabindex="0">' +
            '                                       <label class="onoff-switch-label" for="changeItemConfig_' + data.type + '_' + lotacao_len + '"></label>' +
            '                                   </div>' +
            '                                </td>' +
            '                                <td style="width: 50px; text-align: center;">' +
            '                                     <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
            '                                </td>' +
            '                            </tr>' +
            '                        </tbody>' +
            '                    </table>' +
            '                    </div>' +
            '               </td>' +
            '          </tr>' +
            '       </table>' +
            '   </div>' +
            '' : '') +
            (callAtiv('checkCapacidade','config_view_metadados') ?
                '   <div id="tabs_' + idConfigBox + '_metadados">' +
                '       <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
                '           <tr>' +
                '               <td>' +
                '               <div class="tabelaPanelScroll">' +
                '                   <table id="configBox_metadados" data-format="obj_mult" data-key="metadados" style="font-size: 8pt !important;width: 100%;' + (metadados && !metadados.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
                '                        <thead>' +
                '                           <tr>' +
                '                               <th colspan="3" style="text-align: right;">' +
                '                                   <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
                '                                       <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
                '                                       Adicionar novo item' +
                '                                   </a>' +
                '                               </th>' +
                '                           </tr>' +
                '                            <tr class="tableHeader">' +
                '                                <th class="tituloControle" style="width: 100px;">Metadado</th>' +
                '                                <th class="tituloControle">Valor</th>' +
                '                                <th class="tituloControle" style="width: 50px;"></th>' +
                '                            </tr>' +
                '                        </thead>' +
                '                        <tbody>' +
                '' : '');
        if (callAtiv('checkCapacidade','config_view_metadados')) {
            if (metadados) {
                $.each(metadados, function (i, v) {
                    var valor_metadado = v.tipo_metadado == 'boolean'
                        ? v.valor_metadado == '1' ? 'Sim' : 'N\u00E3o'
                        : v.valor_metadado;
                    valor_metadado = v.tipo_metadado == 'text' ? unicodeToChar(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'url' ? unicodeToChar(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'number' ? parseFloat(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'cpf' ? maskCPF(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'cnpj' ? maskCNPJ(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'processo' ? maskPEN(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'usuario' ? jmespath.search(arrayConfigAtividades.usuarios_entidade, "[?id_user==`" + valor_metadado + "`] | [0].nome_completo") : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'unidade' ? jmespath.search(arrayConfigAtividades.unidades_all, "[?id_unidade==`" + valor_metadado + "`] | [0].nome_unidade") : valor_metadado;

                    var htmlBoxTr = '                        <tr data-index="' + i + '" data-id="' + v.id_usuario_metadado + '" data-value="' + v.id_usuario_metadado + '" data-key="metadados" style="text-align: left;">' +
                        '                            <td class="" data-type="select_meta" data-key="id_usuario_metadado" style="padding: 0 10px;">' + unicodeToChar(v.nome_metadado) + '</td>' +
                        '                            <td class="" data-ref="value" data-key="valor_metadado" data-input="' + v.tipo_metadado + '" style="width: 80px; text-align: left;">' + valor_metadado + '</td>' +
                        '                            <td style="width: 50px; text-align: center;">' +
                        (callAtiv('checkCapacidade','config_remove_metadado') ?
                            '                                 <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
                            '' : '')
                    '                            </td>' +
                        '                        </tr>';
                    htmlBox += (v.lgpd == 0 || (v.lgpd == 1 && callAtiv('checkCapacidade','view_lgpd'))) ? htmlBoxTr : '';
                });
            }
            htmlBox += (callAtiv('checkCapacidade','config_new_metadado') ?
                '                            <tr data-index="' + (metadados ? metadados.length : 0) + '" data-id="new" data-value="" data-key="metadados" style="text-align: left;">' +
                '                                <td class="editCellSelect" data-type="select_meta" data-key="id_unidade_metadado" style="padding: 0 10px;"></td>' +
                '                                <td class="editCell" data-ref="value" data-key="valor_metadado" style="width: 80px; text-align: left;"></td>' +
                '                                <td style="width: 50px; text-align: center;">' +
                '                                     <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
                '                                </td>' +
                '                            </tr>' +
                '                        </tbody>' +
                '' : '</tbody>') +
                '                    </table>' +
                '                    </div>' +
                '               </td>' +
                '           </tr>' +
                '       </table>' +
                '   </div>' +
                '</div>';
        } else {
            htmlBox += '</div>';
        }
    } else if (data.type == 'tipos_prescricoes') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_tipo_prescricao==`" + id + "`] | [0]");
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = __.Prescricao;
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_prescricao;
        var tipo_processo = (value.config !== null && typeof value.config.tipo_processo !== 'undefined' && value.config.tipo_processo !== null) ? value.config.tipo_processo : false;
        var tipo_documento = (value.config !== null && typeof value.config.tipo_documento !== 'undefined' && value.config.tipo_documento !== null) ? value.config.tipo_documento : false;
        var unidades = (value.config !== null && typeof value.config !== 'undefined' && value.config.unidades !== null && typeof value.config.unidades !== 'undefined') ? value.config.unidades : false;

        htmlBox = '<div id="' + idConfigBox + '" class="atividadeWork seipro-atividades-work" data-programa="' + (value && value.id_tipo_prescricao ? value.id_tipo_prescricao : 0) + '">' +
            '<div id="' + idConfigBox + '_tabs" style="border: none; min-height: 300px; margin: 0;">' +
            '   <ul style="font-size: 10px;">' +
            '       <li><a href="#tabs_' + idConfigBox + '_processos">Processos</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_documentos">Documentos</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_unidades">Unidades</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_avancado">Avan\u00E7ado</a></li>' +
            '   </ul>' +
            '   <div id="tabs_' + idConfigBox + '_processos">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left; width: 170px;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-folder-open cinzaColor"></i>Tipos de Processos Vinculados:</label>' +
            '           </td>' +
            '           <td style="position:relative">' +
            '   	        <div id="tabelaConfigPanel_' + data.type + '_tipo_processo" class="tabelaConfigPanel_' + data.type + '_scroll tabelaPanelScroll">' +
            '               <table id="configBox_tipo_processo" data-format="obj_mult" data-key="tipo_processo" style="font-size: 8pt !important;width: 100%;' + (tipo_processo && !tipo_processo.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="2" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; 5px 5px 15px 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle">Tipo</th>' +
            '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        if (tipo_processo) {
            $.each(value.config.tipo_processo, function (i, v) {
                var nomeTipoProc = jmespath.search(arrayListTypesSEI.selectTipoProc, "[?value=='" + v.value + "'].name | [0]");
                nomeTipoProc = (nomeTipoProc !== null) ? nomeTipoProc : false;
                if (nomeTipoProc) {
                    htmlBox += '                        <tr data-id="' + i + '" data-key="tipo_processo" data-index="' + v.id + '" data-value="' + v.value + '" style="text-align: left;">' +
                        '                            <td class="editCellSelect" data-key="tipo_processo" data-type="value" style="padding: 0 10px;">' + nomeTipoProc + '</td>' +
                        '                            <td style="width: 80px; text-align: center;">' +
                        '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                        '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                        '                           </td>' +
                        '                        </tr>';
                }
            });
        }
        htmlBox += (!tipo_processo.length ?
            '                        <tr data-id="' + (tipo_processo ? tipo_processo.length : 0) + '" data-key="tipo_processo" style="text-align: left;">' +
            '                            <td class="editCellSelect" data-key="tipo_processo" data-value="" data-type="value" style="padding: 0 10px;"></td>' +
            '                            <td style="width: 80px; text-align: center;">' +
            '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
            '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                           </td>' +
            '                        </tr>' +
            '' : '') +
            '                    </tbody>' +
            '                </table>' +
            '                </div>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_documentos">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left; width: 170px;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-file cinzaColor"></i>Tipos de Documentos Prescricionais:</label>' +
            '           </td>' +
            '           <td style="position:relative">' +
            '   	        <div id="tabelaConfigPanel_' + data.type + '_tipo_documento" class="tabelaConfigPanel_' + data.type + '_scroll tabelaPanelScroll">' +
            '               <table id="configBox_tipo_documento" data-format="obj_mult" data-key="tipo_documento" style="font-size: 8pt !important;width: 100%;' + (tipo_documento && !tipo_documento.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="2" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; 5px 5px 15px 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle">Tipo</th>' +
            '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        if (tipo_documento) {
            $.each(value.config.tipo_documento, function (i, v) {
                var nomeTipoDoc = jmespath.search(arrayListTypesSEI.selSeriePesquisa, "[?value=='" + v.value + "'].name | [0]");
                nomeTipoDoc = (nomeTipoDoc !== null) ? nomeTipoDoc : false;
                if (nomeTipoDoc) {
                    htmlBox += '                        <tr data-id="' + i + '" data-key="tipo_documento" data-index="' + v.id + '" data-value="' + v.value + '" style="text-align: left;">' +
                        '                            <td class="editCellSelect" data-key="tipo_documento" data-type="value" style="padding: 0 10px;">' + nomeTipoDoc + '</td>' +
                        '                            <td style="width: 80px; text-align: center;">' +
                        '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                        '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                        '                           </td>' +
                        '                        </tr>';
                }
            });
        }
        htmlBox += (!tipo_documento.length ?
            '                        <tr data-id="' + (tipo_documento ? tipo_documento.length : 0) + '" data-key="tipo_documento" data-value="" style="text-align: left;">' +
            '                            <td class="editCellSelect" data-key="tipo_documento" data-type="value" style="padding: 0 10px;"></td>' +
            '                            <td style="width: 80px; text-align: center;">' +
            '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
            '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                           </td>' +
            '                        </tr>' +
            '' : '') +
            '                    </tbody>' +
            '                </table>' +
            '                </div>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_unidades">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-briefcase cinzaColor"></i>Unidades permitidas:</label>' +
            '           </td>' +
            '           <td>' +
            '               <div class="tabelaPanelScroll">' +
            '               <table id="configBox_unidades" data-format="obj" data-key="unidades" style="font-size: 8pt !important;width: 100%;' + (unidades && !unidades.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="2" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle">Unidade</th>' +
            '                            <th class="tituloControle" style="display:none">ID</th>' +
            '                            <th class="tituloControle" style="width: 50px;"></th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        if (unidades) {
            $.each(unidades, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-id="' + v.id_unidade + '" data-value="' + v.id_unidade + '" data-key="unidades" data-unique="true" style="text-align: left;">' +
                    '                            <td class="editCellSelect" data-type="value" data-key="nome_unidade" style="padding: 0 10px;">' + unicodeToChar(v.nome_unidade) + '</td>' +
                    '                            <td class="" data-type="num" data-key="id_unidade" style="padding: 0 10px;display:none;">' + v.id_unidade + '</td>' +
                    '                            <td style="width: 50px; text-align: center;">' +
                    '                                 <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
                    '                            </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += '                        <tr data-index="' + (unidades ? unidades.length : 0) + '" data-id="new" data-value="" data-key="unidades" data-unique="true" style="text-align: left;">' +
            '                            <td class="editCellSelect" data-type="value" data-key="nome_unidade" style="padding: 0 10px;"></td>' +
            '                            <td class="" data-type="num" data-key="id_unidade" style="padding: 0 10px;display:none;"></td>' +
            '                            <td style="width: 50px; text-align: center;">' +
            '                                 <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
            '                            </td>' +
            '                        </tr>' +
            '                    </tbody>' +
            '                </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_avancado">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-cog cinzaColor"></i>Configura\u00E7\u00F5es Gerais:</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-stop-circle cinzaColor"></i> Permite a suspens\u00E3o da ' + __.prescricao + '</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" id="suspensao_prazo" data-key="suspensao_prazo" tabindex="0" ' + (typeof value.config !== 'undefined' && typeof value.config.suspensao_prazo !== 'undefined' && typeof value.config.suspensao_prazo ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="suspensao_prazo"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-exclamation-circle cinzaColor"></i> Adicionar Urg\u00EAncia no processo ao atingir o n\u00EDvel cr\u00EDtico</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" id="urgencia_nivel_critico" data-key="urgencia_nivel_critico" tabindex="0" ' + (typeof value.config !== 'undefined' && typeof value.config.urgencia_nivel_critico !== 'undefined' && value.config.urgencia_nivel_critico ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="urgencia_nivel_critico"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-percentage cinzaColor"></i> N\u00EDvel cr\u00EDtico para a ' + __.prescricao + ' processual (1 a 100)</td>' +
            '                      <td>' +
            '                            <input type="number" class="singleOptionInput" style="width: 50px !important;float: right;" id="nivel_critico" data-key="nivel_critico" min="1" max="100" tabindex="0" value="' + (typeof value.config !== 'undefined' && typeof value.config.nivel_critico !== 'undefined' && value.config.nivel_critico ? value.config.nivel_critico : '90') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '</div>';
    } else if (data.type == 'unidades') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_unidade==`" + id + "`] | [0]");
        var config = (typeof value.config !== 'undefined' && value.config !== null) ? value.config : false;
        var config_modalidades = (config && typeof config.modalidades !== 'undefined' && config.modalidades !== null) ? config.modalidades : false;
        var config_atividades = (config && typeof config.atividades !== 'undefined' && config.atividades !== null) ? config.atividades : false;
        var config_planos = (config && typeof config.planos !== 'undefined' && config.planos !== null) ? config.planos : false;
        var config_programas = (config && typeof config.programas !== 'undefined' && config.programas !== null) ? config.programas : false;
        var config_distribuicao = (config && typeof config.distribuicao !== 'undefined' && config.distribuicao !== null) ? config.distribuicao : false;
        var config_administrativo = (config && typeof config.administrativo !== 'undefined' && config.administrativo !== null) ? config.administrativo : false;
        var config_feriados = (config && typeof config.feriados !== 'undefined' && config.feriados !== null) ? config.feriados : false;
        var config_metadados = (typeof value.metadados !== 'undefined' && value.metadados !== null) ? value.metadados : false;

        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = 'Unidades';
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_unidade;

        htmlBox = '<div id="' + idConfigBox + '" class="atividadeWork seipro-atividades-work" data-unidade="' + (value && value.id_unidade ? value.id_unidade : 0) + '">' +
            '<div id="' + idConfigBox + '_tabs" style="border: none; min-height: 300px; margin: 0;">' +
            '   <ul style="font-size: 10px;">' +
            '       <li><a href="#tabs_' + idConfigBox + '_planos">Planos</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_produtividade">Produtividade</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_atividades">' + __.Atividades + '</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_distribuicao">Distribui\u00E7\u00E3o</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_notificacao">Notifica\u00E7\u00E3o</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_administrativo">Administrativo</a></li>' +
            (callAtiv('checkCapacidade','config_view_metadados') ?
                '       <li><a href="#tabs_' + idConfigBox + '_metadados">Metadados</a></li>' +
                '' : '') +
            '   </ul>' +
            '   <div id="tabs_' + idConfigBox + '_planos">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-handshake cinzaColor"></i>Planos de Trabalho:</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-star-half-alt cinzaColor"></i> Mostrar notas atribu\u00EDdas nos planos de trabalho (m\u00E9dia geral)</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="planos_mostrar_notas" tabindex="0" ' + (config_planos && typeof config_planos.mostrar_notas !== 'undefined' && config_planos.mostrar_notas ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="planos_mostrar_notas"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-star cinzaColor"></i> Permitir a auto avalia\u00E7\u00E3o de ' + __.demandas + ' e planos de trabalho</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="planos_permite_autoavaliacao" tabindex="0" ' + (config_planos && typeof config_planos.permite_autoavaliacao !== 'undefined' && config_planos.permite_autoavaliacao ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="planos_permite_autoavaliacao"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-stopwatch cinzaColor"></i> Prazo de dura\u00E7\u00E3o padr\u00E3o para novos planos (meses)</td>' +
            '                      <td>' +
            '                            <input type="number" style="width: 50px !important;float: right;" id="planos_duracao_padrao" min="1" tabindex="0" value="' + (config_planos && typeof config_planos.duracao_padrao !== 'undefined' && config_planos.duracao_padrao ? config_planos.duracao_padrao : '1') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-stopwatch cinzaColor"></i> Prazo de anteced\u00EAncia m\u00EDnima para convoca\u00E7\u00F5es \u00E0 unidade <br>(apenas para PGD Semipresencial ou Teletrabalho)</td>' +
            '                      <td style="text-align: right;">' +
            '                            <input type="number" style="width: 50px !important;" id="planos_prazo_comparecimento" min="1" tabindex="0" value="' + (config_planos && typeof config_planos.prazo_comparecimento !== 'undefined' && config_planos.prazo_comparecimento ? config_planos.prazo_comparecimento : '1') + '">' +
            '                            <select style="min-height: 35px !important; width: 70px;" id="planos_data_comparecimento" tabindex="0">' +
            '                                <option ' + (config_planos && typeof config_planos.data_comparecimento !== 'undefined' && config_planos.data_comparecimento == 'dia' ? 'selected' : '') + '>Dia</option>' +
            '                                <option ' + (config_planos && typeof config_planos.data_comparecimento !== 'undefined' && config_planos.data_comparecimento == 'hora' ? 'selected' : '') + '>Hora</option>' +
            '                            </select>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-cubes cinzaColor"></i>' + __.Programas + ':</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            (callAtiv('checkCapacidade','config_entregas') ?
                '                  <tr style="height: 40px;">' +
                '                      <td style="text-align: left;"><i class="iconPopup fas fa-thumbs-up cinzaColor"></i> Permitir a aprova\u00E7\u00E3o de suas pr\u00F3prias entregas (unidade instituidora / organizacional)</td>' +
                '                      <td>' +
                '                          <div class="onoffswitch" style="float: right;">' +
                '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="programas_unidade_instituidora" tabindex="0" ' + (config_programas !== 'undefined' && typeof config_programas.unidade_instituidora !== 'undefined' && config_programas.unidade_instituidora ? 'checked' : '') + '>' +
                '                              <label class="onoff-switch-label" for="programas_unidade_instituidora"></label>' +
                '                          </div>' +
                '                      </td>' +
                '                  </tr>' +
                '' : '') +
            (callAtiv('checkPerfilNivelAdm',) ?
                '                  <tr style="height: 40px;">' +
                '                      <td style="text-align: left;"><i class="iconPopup fas fa-sort-amount-up cinzaColor"></i> Relacionar lista de entregas e a\u00E7\u00F5es da unidade superior (caso exista)</td>' +
                '                      <td>' +
                '                          <div class="onoffswitch" style="float: right;">' +
                '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="programas_lista_superior" tabindex="0" ' + (config_programas !== 'undefined' && typeof config_programas.lista_superior !== 'undefined' && !config_programas.lista_superior ? '' : 'checked') + '>' +
                '                              <label class="onoff-switch-label" for="programas_lista_superior"></label>' +
                '                          </div>' +
                '                      </td>' +
                '                  </tr>' +
                '                  <tr style="height: 40px;">' +
                '                      <td style="text-align: left;"><i class="iconPopup fas fa-sort-amount-up cinzaColor"></i> Relacionar lista de entregas e a\u00E7\u00F5es de unidade espec\u00EDfica</td>' +
                '                      <td>' +
                '                          <div class="onoffswitch" style="float: right;">' +
                '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="programas_lista_unidade" data-act="atividades-call" data-fn="changeConfigListaUnidade" tabindex="0" ' + (config_programas && typeof config_programas.lista_unidade !== 'undefined' && config_programas.lista_unidade ? 'checked' : '') + '>' +
                '                              <label class="onoff-switch-label" for="programas_lista_unidade"></label>' +
                '                          </div>' +
                '                      </td>' +
                '                  <tr id="tr_lista_unidade" style="height: 40px; ' + (config_programas !== 'undefined' && typeof config_programas.lista_unidade !== 'undefined' && config_programas.lista_unidade ? '' : 'display: none;') + '">' +
                '                      <td colspan="2">' +
                '                          <div style="margin-top: 10px;">' +
                '                               <select id="select_programa_lista_unidade"><option value=""></option>' + callAtiv('getOptionSelectPerfil',arrayConfigAtividades.unidades_all, (config_programas ? config_programas.lista_unidade : ''), false) + '</select>' +
                '                          </div>' +
                '                      </td>' +
                '                  </tr>' +
                '' : '') +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_produtividade">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-chart-line cinzaColor"></i>Ganho de Produtividade:</label>' +
            '           </td>' +
            '           <td>' +
            '               <div class="tabelaPanelScroll">' +
            '               <table id="configBox_modalidades" data-format="obj" data-key="modalidades" style="font-size: 8pt !important;width: 100%;' + (config_modalidades && !config_modalidades.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="3" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle" style="width: 350px;">Tipo de Modalidade</th>' +
            '                            <th class="tituloControle" style="width: 175px;">Fator</th>' +
            '                            <th class="tituloControle" style="display:none">ID</th>' +
            '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        if (config_modalidades) {
            $.each(config_modalidades, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-key="modalidades">' +
                    '                            <td class="editCellSelect" data-key="tipo_modalidade" data-type="text" style="width: 350px; padding: 0 10px; text-align: left;">' + unicodeToChar(v.tipo_modalidade) + '</td>' +
                    '                            <td class="editCellNum" data-key="fator" data-type="text" style="width: 175px; text-align: left;">' + v.fator + '</td>' +
                    '                            <td data-key="id_tipo_modalidade" data-type="text" style="display:none;">' + v.id_tipo_modalidade + '</td>' +
                    '                            <td style="width: 80px; text-align: center;">' +
                    '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                           </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += '                        <tr data-index="' + (config_modalidades ? config_modalidades.length : 0) + '" data-key="modalidades">' +
            '                            <td class="editCellSelect" data-key="tipo_modalidade" data-type="text" style="width: 350px; padding: 0 10px; text-align: left;"></td>' +
            '                            <td class="editCellNum" data-key="fator" data-type="text" style="width: 175px; text-align: left;"></td>' +
            '                            <td data-key="id_tipo_modalidade" data-type="text" style="display:none;"></td>' +
            '                            <td style="width: 80px; text-align: center;">' +
            '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
            '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                           </td>' +
            '                        </tr>' +
            '                    </tbody>' +
            '                </table>' +
            '                </div>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_atividades">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-clipboard-list cinzaColor"></i>' + __.Atividades + '</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-sort-amount-up cinzaColor"></i> Relacionar lista de ' + __.atividades + ' da unidade superior (caso exista)</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="atividades_lista_superior" tabindex="0" ' + (config_atividades !== 'undefined' && typeof config_atividades.lista_superior !== 'undefined' && config_atividades.lista_superior ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="atividades_lista_superior"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-sort-amount-up cinzaColor"></i> Relacionar lista de ' + __.atividades + ' de unidade ' + getNameGenre('atividade', 'espec\u00EDfico', 'espec\u00EDfica') + '</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="atividades_lista_unidade" data-act="atividades-call" data-fn="changeConfigListaUnidade" tabindex="0" ' + (config_atividades && typeof config_atividades.lista_unidade !== 'undefined' && config_atividades.lista_unidade ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="atividades_lista_unidade"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  <tr id="tr_lista_unidade" style="height: 40px; ' + (config_atividades && typeof config_atividades.lista_unidade !== 'undefined' && config_atividades.lista_unidade ? '' : 'display: none;') + '">' +
            '                      <td colspan="2">' +
            '                          <div style="margin-top: 10px;">' +
            '                               <select id="select_lista_unidade"><option value=""></option>' + callAtiv('getOptionSelectPerfil',arrayConfigAtividades.unidades_all, config_atividades.lista_unidade, false) + '</select>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;display:none">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-archive cinzaColor"></i> ' + __.Arquivar + ' ' + __.demandas + ' automaticamente ap\u00F3s a avalia\u00E7\u00E3o</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="atividades_envio_automatico" tabindex="0" ' + (config_atividades && typeof config_atividades.envio_automatico !== 'undefined' && !config_atividades.envio_automatico ? '' : 'checked') + '>' +
            '                              <label class="onoff-switch-label" for="atividades_envio_automatico"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-archive cinzaColor"></i>N\u00E3o ' + __.Arquivar + ' ' + __.demandas + ' automaticamente ap\u00F3s a avalia\u00E7\u00E3o</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="atividades_nao_arquivar" tabindex="0" ' + (config_atividades && typeof config_atividades.nao_arquivar !== 'undefined' && !config_atividades.nao_arquivar ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="atividades_nao_arquivar"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_distribuicao">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-random cinzaColor"></i>Distribui\u00E7\u00E3o</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left; border: none;"><i class="iconPopup far fa-calendar-alt cinzaColor"></i> Contagem de prazos em dias \u00FAteis</td>' +
            '                      <td style="border: none;">' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="distribuicao_count_dias_uteis" tabindex="0" ' + (config_distribuicao && typeof config_distribuicao.count_dias_uteis !== 'undefined' && config_distribuicao.count_dias_uteis ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="distribuicao_count_dias_uteis"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left; border: none;"><i class="iconPopup fas fa-stopwatch cinzaColor"></i> Contagem de prazos em horas \u00FAteis</td>' +
            '                      <td style="border: none;">' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="distribuicao_count_horas" tabindex="0" ' + (config_distribuicao && typeof config_distribuicao.count_horas !== 'undefined' && config_distribuicao.count_horas ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="distribuicao_count_horas"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left; border: none;"><i class="iconPopup fas fa-business-time cinzaColor"></i> Hor\u00E1rio \u00FAtil de trabalho</td>' +
            '                      <td style="border: none;">' +
            '                           <input type="time" id="distribuicao_horario_util_inicio" style="width: 100px !important; float: left;" tabindex="0" value="' + (config_distribuicao && typeof config_distribuicao.horario_util !== 'undefined' && typeof config_distribuicao.horario_util.inicio !== 'undefined' ? config_distribuicao.horario_util.inicio : '00:00') + '">' +
            '                           <span style="line-height: 40px; display: inline-block;">\u00E0</span>' +
            '                           <input type="time" id="distribuicao_horario_util_fim" style="width: 100px !important; float: right;" tabindex="0" value="' + (config_distribuicao && typeof config_distribuicao.horario_util !== 'undefined' && typeof config_distribuicao.horario_util.fim !== 'undefined' ? config_distribuicao.horario_util.fim : '23:59') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td colspan="2">' +
            '                           <table style="width: 100%;">' +
            '                               <tr>' +
            '                                 <td style="text-align: left; border: none;font-size: 10pt;"><i class="iconPopup fas fa-umbrella-beach cinzaColor"></i> Feriados <br>da Unidade</td>' +
            '                                 <td style="border: none;">' +
            '                                     <span style="font-size: 8pt; white-space: nowrap;" class="alertaBoxDisplay">' +
            '                                       <i class="fas fa-info-circle azulColor" style="margin: 0 5px; font-size: 10pt;"></i>' +
            '                                       Feriados nacionais e pontos facultativos da entidade j\u00E1 est\u00E3o inclu\u00EDdos na lista de feriados do sistema' +
            '                                     </span>' +
            '                                   <div class="tabelaPanelScroll">' +
            '                                     <table id="configBox_feriados" data-format="obj" data-key="feriados" style="font-size: 8pt !important;width: 100%;' + (config_feriados && !config_feriados.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig seiProForm tableDialog tableInfo tableSortable tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                                          <thead>' +
            '                                             <tr>' +
            '                                                 <th colspan="5" style="text-align: right;">' +
            '                                                     <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
            '                                                         <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                                         Adicionar novo item' +
            '                                                     </a>' +
            '                                                 </th>' +
            '                                             </tr>' +
            '                                              <tr class="tableHeader">' +
            '                                                  <th class="tituloControle" style="width: 250px;">Nome do Feriado</th>' +
            '                                                  <th class="tituloControle" style="width: 100px;">Recorrente?</th>' +
            '                                                  <th class="tituloControle" style="width: 100px;">Meio per\u00EDodo?</th>' +
            '                                                  <th class="tituloControle" style="width: 100px;">Horas de desconto</th>' +
            '                                                  <th class="tituloControle" style="width: 150px;">Data</th>' +
            '                                                  <th class="tituloControle" style="width: 50px;"></th>' +
            '                                              </tr>' +
            '                                          </thead>' +
            '                                          <tbody>';
        if (config_feriados) {
            $.each(config_feriados, function (i, v) {
                htmlBox += '                                              <tr data-index="' + i + '" data-key="feriados">' +
                    '                                                  <td class="editCell" data-key="nome_feriado" data-type="text" style="width: 250px; padding: 0 10px; text-align: left;">' + unicodeToChar(v.nome_feriado) + '</td>' +
                    '                                                  <td data-key="recorrente" data-type="switch" style="width: 100px; text-align: center;">' +
                    '                                                     <div class="onoffswitch" style="transform: scale(0.8);">' +
                    '                                                         <input type="checkbox" name="onoffswitch" data-act="atividades-call" data-fn="changeConfigFeriadoRecorrente" class="onoffswitch-checkbox switch_feriadoRecorrente switch_feriadoRecorrente_' + i + '" id="changeItemConfig_' + data.type + '_' + i + '" tabindex="0" ' + (v.recorrente ? 'checked' : '') + '>' +
                    '                                                         <label class="onoff-switch-label" for="changeItemConfig_' + data.type + '_' + i + '"></label>' +
                    '                                                     </div>' +
                    '                                                  </td>' +
                    '                                                  <td data-key="meio_periodo" data-type="switch" style="width: 100px; text-align: center;">' +
                    '                                                     <div class="onoffswitch" style="transform: scale(0.8);">' +
                    '                                                         <input type="checkbox" name="onoffswitch" data-act="atividades-call" data-fn="changeHorasDesconto" class="onoffswitch-checkbox switch_feriadoMeioPeriodo switch_feriadoMeioPeriodo_' + i + '" id="changeItemConfigMP_' + data.type + '_' + i + '" tabindex="0" ' + (v.meio_periodo ? 'checked' : '') + '>' +
                    '                                                         <label class="onoff-switch-label" for="changeItemConfigMP_' + data.type + '_' + i + '"></label>' +
                    '                                                     </div>' +
                    '                                                  </td>' +
                    '                                                  <td class="' + (v.meio_periodo ? 'editCellNum' : '') + '" data-key="horas_desconto" data-type="number" style="width: 150px; text-align: center;">' + (v.meio_periodo ? (v.horas_desconto ? v.horas_desconto : 4) : (v.horas_desconto ? v.horas_desconto : '')) + '</td>' +
                    '                                                  <td class="editCellMonth" data-key="feriado_data" data-type="text" style="width: 150px; text-align: left;">' + v.feriado_data + '</td>' +
                    '                                                  <td style="width: 50px; text-align: center;">' +
                    '                                                       <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                                                       <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                                                  </td>' +
                    '                                              </tr>';
            });
        }
        htmlBox += '                                              <tr data-index="' + (config_feriados ? config_feriados.length : 0) + '" data-key="feriados">' +
            '                                                  <td class="editCell" data-key="nome_feriado" data-type="text" style="width: 250px; padding: 0 10px; text-align: left;"></td>' +
            '                                                  <td data-key="recorrente" data-type="switch" style="width: 100px; text-align: center;">' +
            '                                                     <div class="onoffswitch" style="transform: scale(0.8);">' +
            '                                                         <input type="checkbox" data-act="atividades-call" data-fn="changeConfigFeriadoRecorrente" name="onoffswitch" class="onoffswitch-checkbox switch_feriadoRecorrente switch_feriadoRecorrente_' + (config_feriados ? config_feriados.length : 0) + '" id="changeItemConfig_' + data.type + '_' + feriados_len + '" tabindex="0" checked>' +
            '                                                         <label class="onoff-switch-label" for="changeItemConfig_' + data.type + '_' + (config_feriados ? config_feriados.length : 0) + '"></label>' +
            '                                                     </div>' +
            '                                                  </td>' +
            '                                                  <td data-key="meio_periodo" data-type="switch" style="width: 100px; text-align: center;">' +
            '                                                     <div class="onoffswitch" style="transform: scale(0.8);">' +
            '                                                         <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox switch_feriadoMeioPeriodo switch_feriadoMeioPeriodo_' + (config_feriados ? config_feriados.length : 0) + '" id="changeItemConfigMP_' + data.type + '_' + feriados_len + '" tabindex="0">' +
            '                                                         <label class="onoff-switch-label" for="changeItemConfigMP_' + data.type + '_' + (config_feriados ? config_feriados.length : 0) + '"></label>' +
            '                                                     </div>' +
            '                                                  </td>' +
            '                                                  <td class="editCellNum" data-key="horas_desconto" data-type="number" style="width: 150px; text-align: left;"></td>' +
            '                                                  <td class="editCellMonth" data-key="feriado_data" data-type="text" style="width: 150px; text-align: left;"></td>' +
            '                                                  <td style="width: 50px; text-align: center;">' +
            '                                                       <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                                                  </td>' +
            '                                              </tr>' +
            '                                          </tbody>' +
            '                                      </table>' +
            '                                      </div>' +
            '                                   </td>' +
            '                               </tr>' +
            '                           </table>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_notificacao">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-bullhorn cinzaColor"></i>Notifica\u00E7\u00E3o</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left; width: 35%;">' +
            '                           <div><i class="iconPopup fas fa-user-check cinzaColor"></i> Texto padr\u00E3o para  ' + __.nova_demanda + '</div>' +
            '                           <div style="margin: 10px 0">' +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_criacao', '{usuario}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_criacao', '{requisicao}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_criacao', '{atividade}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_criacao', '{processo}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_criacao', '{assunto}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_criacao', '{prazo}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_criacao', '{tempo_pactuado}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_criacao', '{tempo_planejado}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_criacao', '{data_entrega}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_criacao', '{observacoes_gerenciais}') +
            '                           </div>' +
            '                      </td>' +
            '                      <td>' +
            '                          <textarea id="notificacao_texto_criacao" style="width: 97%; height: 200px;">' + (config_distribuicao && typeof config_distribuicao.notificacao !== 'undefined' && typeof config_distribuicao.notificacao.texto_criacao !== 'undefined' ? unicodeToChar(config_distribuicao.notificacao.texto_criacao).replace(/\\n/g, '\n') : '') + '</textarea>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;">' +
            '                           <div><i class="iconPopup fas fa-check-circle cinzaColor"></i> Texto padr\u00E3o para conclus\u00E3o de ' + __.demanda + '' +
            '                           <div style="margin: 10px 0">' +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_conclusao', '{usuario}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_conclusao', '{requisicao}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_conclusao', '{atividade}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_conclusao', '{processo}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_conclusao', '{assunto}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_conclusao', '{prazo}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_conclusao', '{tempo_pactuado}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_conclusao', '{tempo_planejado}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_conclusao', '{data_entrega}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_conclusao', '{observacoes}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_conclusao', '{documento_produto}') +
            '                           </div>' +
            '                      </td>' +
            '                      <td>' +
            '                          <textarea id="notificacao_texto_conclusao" style="width: 97%; height: 200px;">' + (config_distribuicao && typeof config_distribuicao.notificacao !== 'undefined' && typeof config_distribuicao.notificacao.texto_conclusao !== 'undefined' ? unicodeToChar(config_distribuicao.notificacao.texto_conclusao).replace(/\\n/g, '\n') : '') + '</textarea>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-envelope-open-text cinzaColor"></i> E-mail da unidade</td>' +
            '                      <td>' +
            '                          <input type="email" data-act="atividades-call" data-fn="checkInputEmail" data-on="blur" id="notificacao_email" value="' + (config_distribuicao && typeof config_distribuicao.notificacao !== 'undefined' && typeof config_distribuicao.notificacao.email !== 'undefined' ? config_distribuicao.notificacao.email : '') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_administrativo">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-wrench cinzaColor"></i>Administrativo</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-user-lock cinzaColor"></i> Permitir a autoedi\u00E7\u00E3o de informa\u00E7\u00F5es gerais pelas unidades subordinadas (nome, sigla e depend\u00EAncia)</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="atividades_autoedicao_subordinadas" tabindex="0" ' + (config_administrativo && typeof config_administrativo.autoedicao_subordinadas !== 'undefined' && config_administrativo.autoedicao_subordinadas ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="atividades_autoedicao_subordinadas"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-edit cinzaColor"></i> Impedir a altera\u00E7\u00E3o de ' + __.demandas + ' por unidades superiores ou subordinadas</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="atividades_limitar_avaliacao_subordinadas" tabindex="0" ' + (config_administrativo && typeof config_administrativo.limitar_avaliacao_subordinadas !== 'undefined' && config_administrativo.limitar_avaliacao_subordinadas ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="atividades_limitar_avaliacao_subordinadas"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            (callAtiv('checkCapacidade','config_view_metadados') ?
                '   <div id="tabs_' + idConfigBox + '_metadados">' +
                '       <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
                '           <tr>' +
                '               <td>' +
                '               <div class="tabelaPanelScroll">' +
                '                   <table id="configBox_metadados" data-format="obj_mult" data-key="metadados" style="font-size: 8pt !important;width: 100%;' + (config_metadados && !config_metadados.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
                '                        <thead>' +
                (callAtiv('checkCapacidade','config_new_metadado') ?
                    '                           <tr>' +
                    '                               <th colspan="3" style="text-align: right;">' +
                    '                                   <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
                    '                                       <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
                    '                                       Adicionar novo item' +
                    '                                   </a>' +
                    '                               </th>' +
                    '                           </tr>' +
                    '' : '') +
                '                            <tr class="tableHeader">' +
                '                                <th class="tituloControle" style="width: 100px;">Metadado</th>' +
                '                                <th class="tituloControle">Valor</th>' +
                '                                <th class="tituloControle" style="width: 50px;"></th>' +
                '                            </tr>' +
                '                        </thead>' +
                '                        <tbody>' +
                '' : '');
        if (callAtiv('checkCapacidade','config_view_metadados')) {
            if (config_metadados) {
                $.each(config_metadados, function (i, v) {
                    var valor_metadado = v.tipo_metadado == 'boolean'
                        ? v.valor_metadado == '1' ? 'Sim' : 'N\u00E3o'
                        : v.valor_metadado;
                    valor_metadado = v.tipo_metadado == 'text' ? unicodeToChar(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'usuario' ? unicodeToChar(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'unidade' ? unicodeToChar(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'url' ? unicodeToChar(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'number' ? parseFloat(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'cpf' ? maskCPF(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'cnpj' ? maskCNPJ(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'processo' ? maskPEN(valor_metadado) : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'usuario' ? jmespath.search(arrayConfigAtividades.usuarios_entidade, "[?id_user==`" + valor_metadado + "`] | [0].nome_completo") : valor_metadado;
                    valor_metadado = v.tipo_metadado == 'unidade' ? jmespath.search(arrayConfigAtividades.unidades_all, "[?id_unidade==`" + valor_metadado + "`] | [0].nome_unidade") : valor_metadado;

                    var htmlBoxTr = '                        <tr data-index="' + i + '" data-id="' + v.id_unidade_metadado + '" data-value="' + v.id_unidade_metadado + '" data-key="metadados" style="text-align: left;">' +
                        '                            <td class="" data-type="select_meta" data-key="id_unidade_metadado" style="padding: 0 10px;">' + unicodeToChar(v.nome_metadado) + '</td>' +
                        '                            <td class="" data-ref="value" data-key="valor_metadado" data-input="' + v.tipo_metadado + '" style="width: 80px; text-align: left;">' + valor_metadado + '</td>' +
                        '                            <td style="width: 50px; text-align: center;">' +
                        (callAtiv('checkCapacidade','config_remove_metadado') ?
                            '                                 <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
                            '' : '')
                    '                            </td>' +
                        '                        </tr>';
                    htmlBox += (v.lgpd == 0 || (v.lgpd == 1 && callAtiv('checkCapacidade','view_lgpd'))) ? htmlBoxTr : '';
                });
            }
            htmlBox += (callAtiv('checkCapacidade','config_new_metadado') ?
                '                            <tr data-index="' + (config_metadados ? config_metadados.length : 0) + '" data-id="new" data-value="" data-key="metadados" style="text-align: left;">' +
                '                                <td class="editCellSelect" data-type="select_meta" data-key="id_unidade_metadado" style="padding: 0 10px;"></td>' +
                '                                <td class="editCell" data-ref="value" data-key="valor_metadado" style="width: 80px; text-align: left;"></td>' +
                '                                <td style="width: 50px; text-align: center;">' +
                '                                     <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
                '                                </td>' +
                '                            </tr>' +
                '                        </tbody>' +
                '' : '</tbody>') +
                '                    </table>' +
                '                    </div>' +
                '               </td>' +
                '           </tr>' +
                '       </table>' +
                '   </div>' +
                '</div>';
        } else {
            htmlBox += '   </div>' +
                '</div>';
        }
    } else if (data.type == 'tipos_modalidades') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_tipo_modalidade==`" + id + "`] | [0]");
        var config = (typeof value.config !== 'undefined' && value.config !== null) ? value.config : false;
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = 'Tipos de Modalidades de Trabalho';
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_modalidade;
        var exclui_unidades = (value.config !== null && typeof value.config !== 'undefined' && value.config.exclui_unidades !== null && typeof value.config.exclui_unidades !== 'undefined') ? value.config.exclui_unidades : false;

        htmlBox = '<div id="' + idConfigBox + '" class="atividadeWork seipro-atividades-work" data-unidade="' + (value && value.id_tipo_modalidade ? value.id_tipo_modalidade : 0) + '">' +
            '<div id="' + idConfigBox + '_tabs" style="border: none; min-height: 300px; margin: 0;">' +
            '   <ul style="font-size: 10px;">' +
            '       <li><a href="#tabs_' + idConfigBox + '_planos_trabalho">Planos de Trabalho</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_avancado">Avan\u00E7ado</a></li>' +
            '   </ul>' +
            '   <div id="tabs_' + idConfigBox + '_planos_trabalho">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-handshake cinzaColor"></i>Planos de Trabalho</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-clock cinzaColor"></i> Carga hor\u00E1ria padr\u00E3o da modalidade</td>' +
            '                      <td>' +
            '                            <input type="number" class="singleOptionConfig" style="width: 50px !important;float: right;" id="carga_horaria_padrao" data-key="carga_horaria_padrao" min="0" step="1" tabindex="0" value="' + (config && typeof config.carga_horaria_padrao !== 'undefined' && config.carga_horaria_padrao ? config.carga_horaria_padrao : '8') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-copy cinzaColor"></i> Utilizar os modelos de documentos da entidade</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="modelos" id="modelos" tabindex="0" ' + (config && config.hasOwnProperty('modelos') && config.modelos !== null && config.modelos ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="modelos"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-file-signature cinzaColor"></i> Exigir assinatura de modelos de documentos da entidade</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="exige_assinatura" id="exige_assinatura" tabindex="0" ' + (config && config.hasOwnProperty('exige_assinatura') && config.exige_assinatura !== null && config.exige_assinatura ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="exige_assinatura"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-hand-holding cinzaColor"></i> Exigir a vincula\u00E7\u00E3o de entregas do ' + __.programa + '</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="exige_entregas_programa" id="exige_entregas_programa" tabindex="0" ' + (config && config.hasOwnProperty('exige_entregas_programa') && config.exige_entregas_programa !== null && config.exige_entregas_programa ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="exige_entregas_programa"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-gavel cinzaColor"></i> Exigir a ades\u00E3o a vincula\u00E7\u00E3o de ato administrativo autorizativo</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="exige_autorizacao" id="exige_autorizacao" tabindex="0" ' + (config && config.hasOwnProperty('exige_autorizacao') && config.exige_autorizacao !== null && config.exige_autorizacao ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="exige_autorizacao"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-users-slash cinzaColor"></i> Excluir modalidade do c\u00E1lculo de quantitativo de vagas</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-act="atividades-call" data-fn="configModalidadesLimitePlanos" class="onoffswitch-checkbox singleOptionConfig" data-key="exclui_calculo_vagas" id="exclui_calculo_vagas" tabindex="0" ' + (config && config.hasOwnProperty('exclui_calculo_vagas') && config.exclui_calculo_vagas !== null && config.exclui_calculo_vagas ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="exclui_calculo_vagas"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;' + (config && config.hasOwnProperty('exclui_calculo_vagas') && config.exclui_calculo_vagas !== null && config.exclui_calculo_vagas ? 'display:none;' : '') + '" id="configModalidades_limite_planos">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-user-times cinzaColor"></i> Limitar o n\u00FAmero de planos ao quantitativo geral (%)</td>' +
            '                      <td>' +
            '                            <input type="number" class="singleOptionConfig" style="width: 50px !important;float: right;" id="limite_planos" data-key="limite_planos" min="1" max="100" step="1" tabindex="0" value="' + (config && typeof config.limite_planos !== 'undefined' && config.limite_planos ? config.limite_planos : '100') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-user-minus cinzaColor"></i> Limitar a ades\u00E3o \u00E0 modalidade ao n\u00FAmero m\u00EDnimo de participantes totais</td>' +
            '                      <td>' +
            '                            <input type="number" class="singleOptionConfig" style="width: 50px !important;float: right;" id="minimo_participantes" data-key="minimo_participantes" min="0" step="1" tabindex="0" value="' + (config && typeof config.minimo_participantes !== 'undefined' && config.minimo_participantes ? config.minimo_participantes : '0') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-user-friends cinzaColor"></i> Modalidade de execu\u00E7\u00E3o</td>' +
            '                      <td>' +
            '                          <select class="singleOptionConfig" data-key="modalidade_execucao" id="modalidade_execucao">' +
            '                              <option value="1" ' + (config && (typeof config.modalidade_execucao === 'undefined' || config.modalidade_execucao == 1) ? 'selected' : '') + '>Presencial</option>' +
            '                              <option value="2" ' + (config && typeof config.modalidade_execucao !== 'undefined' && config.modalidade_execucao == 2 ? 'selected' : '') + '>Semipresencial</option>' +
            '                              <option value="3" ' + (config && typeof config.modalidade_execucao !== 'undefined' && config.modalidade_execucao == 3 ? 'selected' : '') + '>Teletrabalho</option>' +
            '                          </select>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_avancado">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-clipboard-list cinzaColor"></i>' + __.Atividades + '</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;border-bottom: none;"><i class="iconPopup fas fa-thumbs-up cinzaColor"></i> Permitir apenas ' + __.atividades + ' ' + getNameGenre('atividade', 'homologados', 'homologadas') + '</td>' +
            '                      <td style="border-bottom: none;">' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="atividades_homologadas" id="atividades_homologadas" tabindex="0" ' + (config && config.hasOwnProperty('atividades_homologadas') && config.atividades_homologadas !== null && config.atividades_homologadas ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="atividades_homologadas"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-star cinzaColor"></i> Dispensar a avalia\u00E7\u00E3o de ' + __.demandas + '</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="dispensa_avaliacao" id="dispensa_avaliacao" tabindex="0" ' + (config && config.hasOwnProperty('dispensa_avaliacao') && config.dispensa_avaliacao !== null && config.dispensa_avaliacao ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="dispensa_avaliacao"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-luggage-cart cinzaColor"></i>Afastamentos</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;border-bottom: none;"><i class="iconPopup fas fa-cogs cinzaColor"></i> Permitir cadastro manual de afastamentos j\u00E1 integrados a sistemas internos</td>' +
            '                      <td style="border-bottom: none;">' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="integracao_interna_manual" id="integracao_interna_manual" tabindex="0" ' + (config && config.hasOwnProperty('integracao_interna_manual') && config.integracao_interna_manual !== null && config.integracao_interna_manual ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="integracao_interna_manual"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-plug cinzaColor"></i>Integra\u00E7\u00E3o</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;border-bottom: none;"><i class="iconPopup fas fa-building cinzaColor"></i> Modalidade integrante do Programa de Gest\u00E3o por Desempenho - PGD <br>(envia dados API)</td>' +
            '                      <td style="border-bottom: none;">' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="pgd_api" id="pgd_api" tabindex="0" ' + (config && config.hasOwnProperty('pgd_api') && config.pgd_api !== null && config.pgd_api ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="pgd_api"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-handshake-alt-slash cinzaColor"></i>Limitar Ades\u00E3o por Unidade:</label>' +
            '           </td>' +
            '           <td>' +
            '               <div class="tabelaPanelScroll">' +
            '               <table id="configBox_exclui_unidades" data-format="obj" data-key="exclui_unidades" style="font-size: 8pt !important;width: 100%;' + (exclui_unidades && !exclui_unidades.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="2" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle">Unidade</th>' +
            '                            <th class="tituloControle" style="display:none">ID</th>' +
            '                            <th class="tituloControle" style="width: 50px;"></th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        if (exclui_unidades) {
            $.each(exclui_unidades, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-id="' + v.id_unidade + '" data-value="' + v.id_unidade + '" data-key="exclui_unidades" data-unique="true" style="text-align: left;">' +
                    '                            <td class="editCellSelect" data-type="value" data-key="nome_unidade" style="padding: 0 10px;">' + unicodeToChar(v.nome_unidade) + '</td>' +
                    '                            <td class="" data-type="num" data-key="id_unidade" style="padding: 0 10px;display:none;">' + v.id_unidade + '</td>' +
                    '                            <td style="width: 50px; text-align: center;">' +
                    '                                 <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
                    '                            </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += '                        <tr data-index="' + (exclui_unidades ? exclui_unidades.length : 0) + '" data-id="new" data-value="" data-key="exclui_unidades" data-unique="true" style="text-align: left;">' +
            '                            <td class="editCellSelect" data-type="value" data-key="nome_unidade" style="padding: 0 10px;"></td>' +
            '                            <td class="" data-type="num" data-key="id_unidade" style="padding: 0 10px;display:none;"></td>' +
            '                            <td style="width: 50px; text-align: center;">' +
            '                                 <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
            '                            </td>' +
            '                        </tr>' +
            '                    </tbody>' +
            '                </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '</div>';
    } else if (data.type == 'tipos_motivos') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_tipo_motivo==`" + id + "`] | [0]");
        var config = (typeof value.config !== 'undefined' && value.config !== null) ? value.config : false;
        var colors = (config && typeof config.colortags !== 'undefined' && config.colortags !== null) ? config.colortags : false;
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = 'Tipos de Motivos de Afastamento';
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_motivo;

        htmlBox = '<div id="' + idConfigBox + '" class="atividadeWork seipro-atividades-work" data-id="' + (value && value.id_tipo_motivo ? value.id_tipo_motivo : 0) + '">' +
            '   <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '      <tr style="height: 40px;">' +
            '          <td style="text-align: left;border-bottom: none;" colspan="2">' +
            '              <span class="info_tags_follow_txt seipro-atividades-tags">' +
            '                   <div class="tagsinput" style="width: 100%;min-height: auto;height: auto;">' +
            '                       <span class="tag tagTableText_afastamento singleOptionColor" data-icontag="' + (colors ? colors.icontag : 'tag') + '" data-colortag="' + (colors ? colors.colortag : 'rgb(191, 213, 232)') + '" data-textcolor="' + (colors ? colors.textcolor : 'black') + '" style="background-color: ' + (colors ? colors.colortag : 'rgb(191, 213, 232)') + ';color: ' + (colors ? colors.textcolor : 'black') + ';width: 100%;height: 30px;">' +
            '                           <span class="tag-text" style="color: ' + (colors ? colors.textcolor : 'black') + ';padding-top: 6px;">' + value.nome_motivo + '</span>' +
        '                           <input type="color" class="tagMonitoradoAddColorInput" value="' + (colors ? colors.colortag : '#bfd5e8') + '" data-act="atividades-call" data-fn="changeColorEtiqueta" data-scope="parent" data-arg="options" style="width: 30px !important;padding: 0 !important;margin: 0 !important;" name="tagMonitoradoAddColorInput">' +
            '                           <i class="tagMonitoradoEditIcon fas fa-' + (colors ? colors.icontag : 'tag') + '" data-icontag="' + (colors ? colors.icontag : 'tag') + '" data-act="atividades-open-box-icons" data-scope="parent" data-arg="selectIconEtiqueta\" data-arg2="afastamento\" data-arg3="options\" data-tip="Alterar \u00EDcone" style="right: 30px;height: 30px;width: 30px;"></i>' +
            '                           <i class="tagMonitoradoAddColor fas fa-fill-drip" data-act="atividades-call" data-fn="openColorEtiqueta" data-scope="parent" data-tip="Alterar cor" style="right: 0;border-radius: 0 5px 5px 0;height: 30px;width: 30px;"></i>' +
            '                       </span>' +
            '                   </div>' +
            '              </span>' +
            '          </td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td style="text-align: left;border-bottom: none;"><i class="iconPopup fas fa-clock cinzaColor"></i> Permite cadastro de horas e minutos</td>' +
            '          <td style="border-bottom: none;">' +
            '              <div class="onoffswitch" style="float: right;">' +
            '                  <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="horas_afastamento" id="horas_afastamento" tabindex="0" ' + (config && config.hasOwnProperty('horas_afastamento') && config.horas_afastamento !== null && config.horas_afastamento ? 'checked' : '') + '>' +
            '                  <label class="onoff-switch-label" for="horas_afastamento"></label>' +
            '              </div>' +
            '          </td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td style="text-align: left;border-bottom: none;"><i class="iconPopup fas fa-cogs cinzaColor"></i> Possui integra\u00E7\u00E3o interna com outros sistemas</td>' +
            '          <td style="border-bottom: none;">' +
            '              <div class="onoffswitch" style="float: right;">' +
            '                  <input type="checkbox" name="onoffswitch" data-act="atividades-call" data-fn="configMotivosAfastamentoIntegracao" class="onoffswitch-checkbox singleOptionConfig" data-key="integracao_interna" id="integracao_interna" tabindex="0" ' + (config && config.hasOwnProperty('integracao_interna') && config.integracao_interna !== null && config.integracao_interna ? 'checked' : '') + '>' +
            '                  <label class="onoff-switch-label" for="integracao_interna"></label>' +
            '              </div>' +
            '          </td>' +
            '      </tr>' +
            '      <tr style="height: 40px;' + (config && config.hasOwnProperty('integracao_interna') && config.integracao_interna !== null && config.integracao_interna ? '' : 'display:none;') + '" class="configTiposAfast_editarintegracao"">' +
            '          <td style="text-align: left;border-bottom: none;"><i class="iconPopup fas fa-pencil cinzaColor"></i> Permite a edi\u00E7\u00E3o do afastamento com integra\u00E7\u00E3o interna com outros sistemas</td>' +
            '          <td style="border-bottom: none;">' +
            '              <div class="onoffswitch" style="float: right;">' +
            '                  <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="editar_integracao_interna" id="editar_integracao_interna" tabindex="0" ' + (config && config.hasOwnProperty('editar_integracao_interna') && config.editar_integracao_interna !== null && config.editar_integracao_interna ? 'checked' : '') + '>' +
            '                  <label class="onoff-switch-label" for="editar_integracao_interna"></label>' +
            '              </div>' +
            '          </td>' +
            '      </tr>' +
            '      <tr style="height: 40px;' + (config && config.hasOwnProperty('integracao_interna') && config.integracao_interna !== null && config.integracao_interna ? '' : 'display:none;') + '" class="configTiposAfast_editarintegracao"">' +
            '          <td style="text-align: left;border-bottom: none;"><i class="iconPopup fas fa-recycle cinzaColor"></i> Permite a sobreposi\u00E7\u00E3o com outros afastamentos que cont\u00EAm o mesmo per\u00EDodo</td>' +
            '          <td style="border-bottom: none;">' +
            '              <div class="onoffswitch" style="float: right;">' +
            '                  <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="permite_sobreposicao" id="permite_sobreposicao" tabindex="0" ' + (config && config.hasOwnProperty('permite_sobreposicao') && config.permite_sobreposicao !== null && config.permite_sobreposicao ? 'checked' : '') + '>' +
            '                  <label class="onoff-switch-label" for="permite_sobreposicao"></label>' +
            '              </div>' +
            '          </td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td style="text-align: left;border-bottom: none;"><i class="iconPopup fas fa-random cinzaColor"></i> Exige vincula\u00E7\u00E3o de documento SEI</td>' +
            '          <td style="border-bottom: none;">' +
            '              <div class="onoffswitch" style="float: right;">' +
            '                  <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="exige_documentacao" id="exige_documentacao" tabindex="0" ' + (config && config.hasOwnProperty('exige_documentacao') && config.exige_documentacao !== null && config.exige_documentacao ? 'checked' : '') + '>' +
            '                  <label class="onoff-switch-label" for="exige_documentacao"></label>' +
            '              </div>' +
            '          </td>' +
            '      </tr>' +
            '      <tr style="text-align: right;">' +
            '          <td style="text-align: left;"><i class="iconPopup fas fa-retweet cinzaColor"></i> Fator de Multiplica\u00E7\u00E3o (0 = inativo)</td>' +
            '          <td style="text-align: right;">' +
            '              <input type="number" style="width: 50px !important;" class="singleOptionConfig" data-key="fator_multiplicacao" id="fator_multiplicacao" value="' + (config && typeof config.fator_multiplicacao !== 'undefined' && isNumeric(config.fator_multiplicacao) ? config.fator_multiplicacao : 1) + '">' +
            '          </td>' +
            '      </tr>' +
            '      <tr style="text-align: right;">' +
            '          <td style="text-align: left;"><i class="iconPopup fas fa-procedures cinzaColor"></i> Possui dados sens\u00EDveis em rela\u00E7\u00E3o \u00E0 sa\u00FAde do usu\u00E1rio (LGPD)</td>' +
            '          <td style="text-align: right;">' +
            '              <div class="onoffswitch" style="float: right;">' +
            '                  <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="dados_sensiveis" id="dados_sensiveis" tabindex="0" ' + (config && config.hasOwnProperty('dados_sensiveis') && config.dados_sensiveis !== null && config.dados_sensiveis ? 'checked' : '') + '>' +
            '                  <label class="onoff-switch-label" for="dados_sensiveis"></label>' +
            '              </div>' +
            '          </td>' +
            '      </tr>' +
            '   </table>' +
            '</div>';
    } else if (data.type == 'tipos_avaliacoes') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_tipo_avaliacao==`" + id + "`] | [0]");
        var config = (typeof value.config !== 'undefined' && value.config !== null) ? value.config : false;
        var colors = (config && typeof config.colortags !== 'undefined' && config.colortags !== null) ? config.colortags : false;
        var icontag = colors && typeof colors.icontag !== 'undefined'
            ? colors.icontag
            : config && typeof config.icon !== 'undefined' ? config.icon.replace('fa-', '') : false;
        var colortag = colors && typeof colors.colortag !== 'undefined'
            ? colors.colortag
            : config && typeof config.color !== 'undefined' ? config.color : false;
        var textcolor = colors && typeof colors.textcolor !== 'undefined'
            ? colors.textcolor
            : config && typeof config.text !== 'undefined' ? config.text : false;
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = 'Tipos de Avalia\u00E7\u00F5es';
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_avaliacao;
        var avaliacoes_justificativas = (value.avaliacoes_justificativas !== null && typeof value.avaliacoes_justificativas !== 'undefined') ? value.avaliacoes_justificativas : false;

        htmlBox = '<div id="' + idConfigBox + '" class="atividadeWork seipro-atividades-work" data-id="' + (value && value.id_tipo_avaliacao ? value.id_tipo_avaliacao : 0) + '">' +
            '   <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '      <tr style="height: 40px;">' +
            '          <td style="text-align: left;border-bottom: none;" colspan="2">' +
            '              <span class="info_tags_follow_txt seipro-atividades-tags">' +
            '                   <div class="tagsinput" style="width: 100%;min-height: auto;height: auto;">' +
            '                       <span class="tag tagTableText_afastamento singleOptionColor" data-icontag="' + (icontag ? icontag : 'tag') + '" data-colortag="' + (colortag ? colortag : 'rgb(191, 213, 232)') + '" data-textcolor="' + (textcolor ? textcolor : 'black') + '" style="background-color: ' + (colortag ? colortag : 'rgb(191, 213, 232)') + ';color: ' + (textcolor ? textcolor : 'black') + ';width: 100%;height: 30px;">' +
            '                           <span class="tag-text" style="color: ' + (textcolor ? textcolor : 'black') + ';padding-top: 6px;">' + value.nome_avaliacao + '</span>' +
            '                           <input type="color" class="tagMonitoradoAddColorInput" value="' + (colortag ? colortag : '#bfd5e8') + '" data-act="atividades-call" data-fn="changeColorEtiqueta" data-scope="parent" data-arg="options" style="width: 30px !important;padding: 0 !important;margin: 0 !important;">' +
            '                           <i class="tagMonitoradoEditIcon fas fa-' + (icontag ? icontag : 'tag') + '" data-icontag="' + (icontag ? icontag : 'tag') + '" data-act="atividades-open-box-icons" data-scope="parent" data-arg="selectIconEtiqueta\" data-arg2="afastamento\" data-arg3="options\" data-tip="Alterar \u00EDcone" style="right: 30px;height: 30px;width: 30px;"></i>' +
            '                           <i class="tagMonitoradoAddColor fas fa-fill-drip" data-act="atividades-call" data-fn="openColorEtiqueta" data-scope="parent" data-tip="Alterar cor" style="right: 0;border-radius: 0 5px 5px 0;height: 30px;width: 30px;"></i>' +
            '                       </span>' +
            '                   </div>' +
            '              </span>' +
            '          </td>' +
            '      </tr>' +
            '      <tr>' +
            '              <td style="vertical-align: middle; text-align: left;" class="label">' +
            '                   <label><i class="iconPopup iconSwitch fas fa-exclamation-triangle cinzaColor"></i>Alertas:</label>' +
            '               </td>' +
            '               <td>' +
            '                   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '                       <tr style="height: 40px;">' +
            '                           <td style="text-align: left;"><i class="iconPopup fas fa-exclamation-circle cinzaColor"></i> Alertar sobre avalia\u00E7\u00E3o com baixa produtividade</td>' +
            '                           <td style="text-align: right;">' +
            '                               <div class="onoffswitch" style="float: right;">' +
            '                                   <input type="checkbox" name="onoffswitch" data-key="alerta_baixa_produtividade" data-act="atividades-call" data-fn="changeConfigOptions" data-ref="configEntidade_alerta_baixa_produtividade" data-ref_type="class" class="onoffswitch-checkbox singleOptionConfig" id="alerta_baixa_produtividade" tabindex="0" ' + (config && typeof config.alerta_baixa_produtividade !== 'undefined' && config.alerta_baixa_produtividade ? 'checked' : '') + '>' +
            '                                   <label class="onoff-switch-label" for="alerta_baixa_produtividade"></label>' +
            '                               </div>' +
            '                           </td>' +
            '                       </tr>' +
            '                       <tr style="height: 40px;' + (config && typeof config.alerta_baixa_produtividade !== 'undefined' && config.alerta_baixa_produtividade ? '' : 'display:none;') + '" class="configEntidade_alerta_baixa_produtividade">' +
            '                           <td style="text-align: left;"><i class="iconPopup fas fa-comment cinzaColor"></i> Texto do alerta</td>' +
            '                           <td style="text-align: right;">' +
            '                               <input type="text" class="singleOptionConfig" data-key="texto_alerta_baixa_produtividade" id="texto_alerta_baixa_produtividade" value="' + (config && typeof config.texto_alerta_baixa_produtividade !== 'undefined' && config.texto_alerta_baixa_produtividade != '' ? config.texto_alerta_baixa_produtividade : '') + '">' +
            '                           </td>' +
            '                       </tr>' +
            '                       <tr style="height: 40px;' + (config && typeof config.alerta_baixa_produtividade !== 'undefined' && config.alerta_baixa_produtividade ? '' : 'display:none;') + '" class="configEntidade_alerta_baixa_produtividade">' +
            '                           <td style="text-align: left;"><i class="iconPopup fas fa-percentage cinzaColor"></i> Porcentagem de produtividade m\u00EDnima</td>' +
            '                           <td style="text-align: right;">' +
            '                               <input type="number" style="width: 70px !important;" min="0" max="100" step="1" class="singleOptionConfig" data-key="porcentagem_alerta_baixa_produtividade" id="porcentagem_alerta_baixa_produtividade" value="' + (config && typeof config.porcentagem_alerta_baixa_produtividade !== 'undefined' && config.porcentagem_alerta_baixa_produtividade != '' ? config.porcentagem_alerta_baixa_produtividade : '50') + '">' +
            '                           </td>' +
            '                       </tr>' +
            '                   </table>' +
            '               </td>' +
            '      </tr>' +
            '      <tr>' +
            '              <td style="vertical-align: middle; text-align: left;" class="label">' +
            '                   <label><i class="iconPopup iconSwitch fas fa-hand-holding cinzaColor"></i>Justificativas:</label>' +
            '               </td>' +
            '               <td>' +
            '               <div class="tabelaPanelScroll">' +
            '                   <table id="configBox_avaliacoes_justificativas" data-format="obj_mult" data-key="avaliacoes_justificativas" style="font-size: 8pt !important;width: 100%;' + (avaliacoes_justificativas && !avaliacoes_justificativas.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                        <thead>' +
            '                           <tr>' +
            '                               <th colspan="2" style="text-align: right;">' +
            '                                   <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
            '                                       <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                       Adicionar novo item' +
            '                                   </a>' +
            '                               </th>' +
            '                           </tr>' +
            '                            <tr class="tableHeader">' +
            '                                <th class="tituloControle">Nome da Justificativa</th>' +
            '                                <th class="tituloControle" style="width: 50px;"></th>' +
            '                            </tr>' +
            '                        </thead>' +
            '                        <tbody>';
        if (avaliacoes_justificativas) {
            $.each(avaliacoes_justificativas, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-id="' + v.id_tipo_avaliacao_justificativa + '" data-value="' + v.id_tipo_avaliacao_justificativa + '" data-id_tipo_justificativa="' + v.id_tipo_justificativa + '" data-key="avaliacoes_justificativas" data-unique="true" style="text-align: left;">' +
                    '                            <td class="" data-type="num_switch" data-key="avaliacoes_justificativas" style="padding: 0 10px;">' + unicodeToChar(v.nome_justificativa) + '</td>' +
                    '                            <td style="width: 50px; text-align: center;">' +
                    '                                 <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
                    '                            </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += '                            <tr data-index="' + (avaliacoes_justificativas ? avaliacoes_justificativas.length : 0) + '" data-id="new" data-value="" data-key="avaliacoes_justificativas" data-unique="true" style="text-align: left;">' +
            '                                <td class="editCellSelect" data-type="num" data-key="avaliacoes_justificativas" style="padding: 0 10px;"></td>' +
            '                                <td style="width: 50px; text-align: center;">' +
            '                                     <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
            '                                </td>' +
            '                            </tr>' +
            '                        </tbody>' +
            '                    </table>' +
            '                    </div>' +
            '               </td>' +
            '          </tr>' +
            '   </table>' +
            '</div>';
    } else if (data.type == 'nomenclaturas') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_nomenclatura==`" + id + "`] | [0]");
        var config = (typeof value.config !== 'undefined' && value.config !== null) ? value.config : false;
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = 'Nomenclaturas';
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_nomenclatura;

        htmlBox = '<div id="' + idConfigBox + '" class="atividadeWork seipro-atividades-work" data-nomenclatura="' + (value && value.id_nomenclatura ? value.id_nomenclatura : 0) + '">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch far fa-comment-alt cinzaColor"></i>Descri\u00E7\u00E3o</label>' +
            '           </td>' +
            '           <td style="text-align: left;">' +
            '               ' + (value && typeof value.descricao !== 'undefined' ? value.descricao : '') +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch far fa-square cinzaColor"></i>Singular</label>' +
            '           </td>' +
            '           <td>' +
            '               <input type="text" id="singular" class="singleOptionInput" data-key="singular" data-convert="lowercase" value="' + (config && typeof config.singular !== 'undefined' ? config.singular : '') + '">' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch far fa-clone cinzaColor"></i>Plural</label>' +
            '           </td>' +
            '           <td>' +
            '               <input type="text" id="plural" class="singleOptionInput" data-key="plural" data-convert="lowercase" value="' + (config && typeof config.plural !== 'undefined' ? config.plural : '') + '">' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-mars cinzaColor"></i>Masculino</label>' +
            '           </td>' +
            '           <td>' +
            '               <div class="onoffswitch" style="float: left;">' +
            '                   <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="masculino" id="masculino" tabindex="0" ' + (config && config.hasOwnProperty('masculino') && config.masculino !== null && config.masculino ? 'checked' : '') + '>' +
            '                   <label class="onoff-switch-label" for="masculino"></label>' +
            '               </div>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-spell-check cinzaColor"></i>Adicionar preposi\u00E7\u00E3o <br>(do, da, dos, das)</label>' +
            '           </td>' +
            '           <td>' +
            '               <div class="onoffswitch" style="float: left;">' +
            '                   <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox singleOptionConfig" data-key="preposicao" id="preposicao" tabindex="0" ' + (config && config.hasOwnProperty('preposicao') && config.preposicao !== null && config.preposicao ? 'checked' : '') + '>' +
            '                   <label class="onoff-switch-label" for="preposicao"></label>' +
            '               </div>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '</div>';
    } else if (data.type == 'tipos_capacidades') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_tipo_capacidade==`" + id + "`] | [0]");
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = 'Tipos de Capacidades';
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_capacidade;

        htmlBox = '<div id="' + idConfigBox + '" data-id="' + id + '" class="atividadeWork seipro-atividades-work" data-entidade="' + (value && value.id_entidade ? value.id_entidade : 0) + '">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine tableConfigCapacidades">';

        if (typeof arrayConfigAtividades.perfis !== 'undefined') {
            $.each(arrayConfigAtividades.perfis, function (i, v) {
                var capacidade = jmespath.search(value.lista_capacidades, "[?id_perfil==`" + v.id_perfil + "`] | [0]");
                var checked = (capacidade !== null) ? true : false;
                var id_capacidade = (capacidade !== null && typeof capacidade.id_capacidade !== 'undefined') ? capacidade.id_capacidade : 0;
                var idInput = 'changeItemConfig_' + data.type + '_' + i + '_' + randomString(4);
                htmlBox += '      <tr data-id_perfil="' + v.id_perfil + '" data-id="' + id + '">' +
                    '           <td style="width: 250px; padding: 0 10px; text-align: left;">' + v.nome_perfil + '</td>' +
                    '           <td data-key="perfil" data-type="switch" style="width: 100px; text-align: center;">' +
                    '              <div class="onoffswitch" style="transform: scale(0.8);">' +
                    '                  <input type="checkbox" name="onoffswitch" data-act="atividades-call" data-fn="changeConfigPerfilCapacidade" data-id="' + id + '" data-id_perfil="' + v.id_perfil + '" data-id_capacidade="' + id_capacidade + '" class="onoffswitch-checkbox" id="' + idInput + '" tabindex="0" ' + (checked ? 'checked' : '') + '>' +
                    '                  <label class="onoff-switch-label" for="' + idInput + '"></label>' +
                    '              </div>' +
                    '           </td>' +
                    '       </tr>';
            });
        }
        htmlBox += '</div>';

    } else if (data.type == 'perfis') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_perfil==`" + id + "`] | [0]");
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = 'Perfis';
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_perfil;

        htmlBox = '<div id="' + idConfigBox + '" style="height: 80vh;overflow-y: auto;" data-id="' + id + '" class="atividadeWork seipro-atividades-work" data-entidade="' + (value && value.id_entidade ? value.id_entidade : 0) + '">' +
            '   <div id="accordion-' + data.type + '">';

        if (typeof arrayConfigAtividades.tipos_capacidades !== 'undefined') {
            function listConfigCapacidadesPerfil(arrayList) {
                var count = 0;
                var _htmlB = '<table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine tableConfigCapacidades">';
                $.each(arrayList, function (i, v) {
                    var capacidade = jmespath.search(v.lista_capacidades, "[?id_perfil==`" + value.id_perfil + "`] | [0]");
                    var checked = (capacidade !== null) ? true : false;
                    var id_capacidade = (capacidade !== null && typeof capacidade.id_capacidade !== 'undefined') ? capacidade.id_capacidade : 0;
                    var idInput = 'changeItemConfig_' + data.type + '_' + i + '_' + randomString(4);
                    _htmlB += '      <tr data-id_perfil="' + value.id_perfil + '" data-id="' + v.id_tipo_capacidade + '">' +
                        '           <td style="width: 250px; padding: 0 10px; text-align: left;">' + v.descricao + ' (' + v.nome_capacidade + ')</td>' +
                        '           <td data-key="perfil" data-type="switch" style="width: 100px; text-align: center;">' +
                        '              <div class="onoffswitch" style="transform: scale(0.8);">' +
                        '                  <input type="checkbox" name="onoffswitch" data-act="atividades-call" data-fn="changeConfigPerfilCapacidade" data-id="' + v.id_tipo_capacidade + '" data-id_perfil="' + id + '" data-id_capacidade="' + id_capacidade + '" class="onoffswitch-checkbox" id="' + idInput + '" tabindex="0" ' + (checked ? 'checked' : '') + '>' +
                        '                  <label class="onoff-switch-label" for="' + idInput + '"></label>' +
                        '              </div>' +
                        '           </td>' +
                        '       </tr>';
                    if (checked) count++;
                });
                _htmlB += '</table>';

                return { count: count, html: _htmlB };
            }
            function accordionConfigCapacidadesPerfil(name, filter_name, filter_desc) {
                var arraList = jmespath.search(arrayConfigAtividades.tipos_capacidades, "[?nome_capacidade && descricao && (contains(nome_capacidade, '" + filter_name + "') || contains(descricao, '" + filter_desc + "'))]");
                var listCapacidades = listConfigCapacidadesPerfil(arraList);
                var _htmlB = '   <h3>' + name + ' <span class="counter">' + listCapacidades.count + '</span></h3>' +
                    '   <div>';
                _htmlB += listCapacidades.html;
                _htmlB += '   </div>';
                return _htmlB;
            }

            htmlBox += accordionConfigCapacidadesPerfil('Demandas', '_atividade', 'demanda');
            htmlBox += accordionConfigCapacidadesPerfil('Afastamentos', '_afastamento', 'afastamento');
            htmlBox += accordionConfigCapacidadesPerfil('Planos', '_plano', 'plano');
            htmlBox += accordionConfigCapacidadesPerfil('Atividades', '_atividades', 'atividades');
            htmlBox += accordionConfigCapacidadesPerfil('Unidades', '_unidade', 'unidade');
            htmlBox += accordionConfigCapacidadesPerfil('Relat\u00F3rios', 'report_', 'Relat\u00F3rio');
            htmlBox += accordionConfigCapacidadesPerfil('Configura\u00E7\u00F5es', 'config_', 'Configurar');
            htmlBox += accordionConfigCapacidadesPerfil('Gr\u00E1ficos', 'chart_', 'gr\u00E1fico');
            htmlBox += accordionConfigCapacidadesPerfil('Documentos', '_documento', 'documento');
            htmlBox += accordionConfigCapacidadesPerfil('Visualizar', 'view_', 'Visualizar');
            htmlBox += accordionConfigCapacidadesPerfil('Salvar', 'save_', 'Salvar');
            htmlBox += accordionConfigCapacidadesPerfil('Editar', 'edit_', 'Editar');
            htmlBox += accordionConfigCapacidadesPerfil('Deletar', 'delete_', 'Deletar');
            htmlBox += accordionConfigCapacidadesPerfil('Cancelar', '_cancel', 'Cancelar');
            htmlBox += accordionConfigCapacidadesPerfil('Atualizar', 'update_', 'Atualizar');
            htmlBox += accordionConfigCapacidadesPerfil('Avaliar', 'rate_', 'Avaliar');
            htmlBox += accordionConfigCapacidadesPerfil('Concluir', 'complete_', 'Concluir');
            htmlBox += accordionConfigCapacidadesPerfil('Iniciar', 'start_', 'Iniciar');
            htmlBox += accordionConfigCapacidadesPerfil('Arquivar', 'send_', 'Arquivar');
            htmlBox += accordionConfigCapacidadesPerfil('Apenas as suas', 'self_', 'sua ');
            htmlBox += accordionConfigCapacidadesPerfil('Cadastrar novo', 'new_', 'Cadastrar');
        }
        htmlBox += '   </div>' +
            '</div>';

    } else if (data.type == 'entidades') {
        var value = jmespath.search(tableConfigList[data.type], "[?id_entidade==`" + id + "`] | [0]");
        var config = (typeof value.config !== 'undefined' && value.config !== null) ? value.config : false;
        var idConfigBox = 'boxConfiguracoes_' + data.type;
        var nameBox = 'Entidades';
        var titleBox = 'Op\u00E7\u00F5es de ' + nameBox + ': ' + value.nome_entidade;
        var tipo_modalidade_padrao = (config && typeof config.tipo_modalidade_padrao !== 'undefined' && config.tipo_modalidade_padrao != '') ? config.tipo_modalidade_padrao : 4;
        var tipo_perfil_padrao = (config && typeof config.tipo_perfil_padrao !== 'undefined' && config.tipo_perfil_padrao != '') ? config.tipo_perfil_padrao : 1;
        var feriados = (typeof value.config !== 'undefined' && value.config !== null && typeof value.config.feriados !== 'undefined' && value.config.feriados !== null) ? value.config.feriados : false;
        var unidades = (value.config !== null && typeof value.config !== 'undefined' && value.config.unidades !== null && typeof value.config.unidades !== 'undefined') ? value.config.unidades : false;
        var selectModalidadesOptions = $.map(arrayConfigAtividades.tipos_modalidades, function (v) {
            var selected = (v.id_tipo_modalidade == tipo_modalidade_padrao) ? 'selected' : '';
            return '<option value="' + v.id_tipo_modalidade + '" ' + selected + '>' + v.nome_modalidade + '</option>';
        }).join('');
        var selectPerfilOptions = $.map(arrayConfigAtividades.perfis, function (v) {
            var selected = (v.id_perfil == tipo_perfil_padrao) ? 'selected' : '';
            return '<option value="' + v.id_perfil + '" ' + selected + '>' + v.nome_perfil + '</option>';
        }).join('');

        htmlBox = '<div id="' + idConfigBox + '" class="atividadeWork seipro-atividades-work" data-entidade="' + (value && value.id_entidade ? value.id_entidade : 0) + '">' +
            '<div id="' + idConfigBox + '_tabs" style="border: none; min-height: 300px; margin: 0;">' +
            '   <ul style="font-size: 10px;">' +
            '       <li><a href="#tabs_' + idConfigBox + '_distribuicao">Distribui\u00E7\u00E3o</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_planos_trabalho">Planos de Trabalho</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_homologacao">Homologa\u00E7\u00E3o</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_atividades">Demandas</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_avaliacoes">Avalia\u00E7\u00F5es</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_visualizacao">Visualiza\u00E7\u00E3o</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_notificacao">Notifica\u00E7\u00E3o</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_sincronizacao">Sincroniza\u00E7\u00E3o</a></li>' +
            '       <li><a href="#tabs_' + idConfigBox + '_seguranca">Seguran\u00E7a</a></li>' +
            '   </ul>' +
            '   <div id="tabs_' + idConfigBox + '_distribuicao">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '                                 <td style="text-align: left; border: none;font-size: 10pt;"><i class="iconPopup fas fa-umbrella-beach cinzaColor"></i> Feriados da Entidade</td>' +
            '                                 <td style="border: none;">' +
            '                                     <span style="font-size: 8pt;" class="alertaBoxDisplay">' +
            '                                       <i class="fas fa-info-circle azulColor" style="margin: 0 5px; font-size: 10pt;"></i>' +
            '                                       Feriados nacionais j\u00E1 est\u00E3o inclu\u00EDdos na lista de feriados do sistema' +
            '                                     </span>' +
            '                                   <div class="tabelaPanelScroll">' +
            '                                     <table id="configBox_feriados" data-format="obj" data-key="feriados" style="font-size: 8pt !important;width: 100%;' + (feriados && !feriados.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig seiProForm tableDialog tableInfo tableSortable tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                                          <thead>' +
            '                                             <tr>' +
            '                                                 <th colspan="6" style="text-align: right;">' +
            '                                                     <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
            '                                                         <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                                         Adicionar novo item' +
            '                                                     </a>' +
            '                                                 </th>' +
            '                                             </tr>' +
            '                                              <tr class="tableHeader">' +
            '                                                  <th class="tituloControle" style="width: 250px;">Nome do Feriado</th>' +
            '                                                  <th class="tituloControle" style="width: 100px;">Recorrente?</th>' +
            '                                                  <th class="tituloControle" style="width: 100px;">Meio per\u00EDodo?</th>' +
            '                                                  <th class="tituloControle" style="width: 100px;">Horas de desconto</th>' +
            '                                                  <th class="tituloControle" style="width: 150px;">Data</th>' +
            '                                                  <th class="tituloControle" style="width: 50px;"></th>' +
            '                                              </tr>' +
            '                                          </thead>' +
            '                                          <tbody>';
        var feriados_len = (feriados) ? feriados.length : 0;
        if (feriados) {
            $.each(value.config.feriados, function (i, v) {
                htmlBox += '                                              <tr data-index="' + i + '" data-key="feriados">' +
                    '                                                  <td class="editCell" data-key="nome_feriado" data-type="text" style="width: 250px; padding: 0 10px; text-align: left;">' + unicodeToChar(v.nome_feriado) + '</td>' +
                    '                                                  <td data-key="recorrente" data-type="switch" style="width: 100px; text-align: center;">' +
                    '                                                     <div class="onoffswitch" style="transform: scale(0.8);">' +
                    '                                                         <input type="checkbox" name="onoffswitch" data-act="atividades-call" data-fn="changeConfigFeriadoRecorrente" class="onoffswitch-checkbox switch_feriadoRecorrente switch_feriadoRecorrente_' + i + '" id="changeItemConfig_' + data.type + '_' + i + '" tabindex="0" ' + (v.recorrente ? 'checked' : '') + '>' +
                    '                                                         <label class="onoff-switch-label" for="changeItemConfig_' + data.type + '_' + i + '"></label>' +
                    '                                                     </div>' +
                    '                                                  </td>' +
                    '                                                  <td data-key="meio_periodo" data-type="switch" style="width: 100px; text-align: center;">' +
                    '                                                     <div class="onoffswitch" style="transform: scale(0.8);">' +
                    '                                                         <input type="checkbox" name="onoffswitch" data-act="atividades-call" data-fn="changeHorasDesconto" class="onoffswitch-checkbox switch_feriadoMeioPeriodo switch_feriadoMeioPeriodo_' + i + '" id="changeItemConfigMP_' + data.type + '_' + i + '" tabindex="0" ' + (v.meio_periodo ? 'checked' : '') + '>' +
                    '                                                         <label class="onoff-switch-label" for="changeItemConfigMP_' + data.type + '_' + i + '"></label>' +
                    '                                                     </div>' +
                    '                                                  </td>' +
                    '                                                  <td class="' + (v.meio_periodo ? 'editCellNum' : '') + '" data-key="horas_desconto" data-type="number" style="width: 150px; text-align: center;">' + (v.meio_periodo ? (v.horas_desconto ? v.horas_desconto : 4) : (v.horas_desconto ? v.horas_desconto : '')) + '</td>' +
                    '                                                  <td class="editCellMonth" data-key="feriado_data" data-type="text" style="width: 150px; text-align: left;">' + v.feriado_data + '</td>' +
                    '                                                  <td style="width: 50px; text-align: center;">' +
                    '                                                       <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                                                       <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                                                  </td>' +
                    '                                              </tr>';
            });
        }
        htmlBox += '                                              <tr data-index="' + feriados_len + '" data-key="feriados">' +
            '                                                  <td class="editCell" data-key="nome_feriado" data-type="text" style="width: 250px; padding: 0 10px; text-align: left;"></td>' +
            '                                                  <td data-key="recorrente" data-type="switch" style="width: 100px; text-align: center;">' +
            '                                                     <div class="onoffswitch" style="transform: scale(0.8);">' +
            '                                                         <input type="checkbox" data-act="atividades-call" data-fn="changeConfigFeriadoRecorrente" name="onoffswitch" class="onoffswitch-checkbox switch_feriadoRecorrente switch_feriadoRecorrente_' + feriados_len + '" id="changeItemConfig_' + data.type + '_' + feriados_len + '" tabindex="0" checked>' +
            '                                                         <label class="onoff-switch-label" for="changeItemConfig_' + data.type + '_' + feriados_len + '"></label>' +
            '                                                     </div>' +
            '                                                  </td>' +
            '                                                  <td data-key="meio_periodo" data-type="switch" style="width: 100px; text-align: center;">' +
            '                                                     <div class="onoffswitch" style="transform: scale(0.8);">' +
            '                                                         <input type="checkbox" name="onoffswitch" data-act="atividades-call" data-fn="changeHorasDesconto" class="onoffswitch-checkbox switch_feriadoMeioPeriodo switch_feriadoMeioPeriodo_' + feriados_len + '" id="changeItemConfigMP_' + data.type + '_' + feriados_len + '" tabindex="0">' +
            '                                                         <label class="onoff-switch-label" for="changeItemConfigMP_' + data.type + '_' + feriados_len + '"></label>' +
            '                                                     </div>' +
            '                                                  </td>' +
            '                                                  <td class="editCellNum" data-key="horas_desconto" data-type="number" style="width: 150px; text-align: left;"></td>' +
            '                                                  <td class="editCellMonth" data-key="feriado_data" data-type="text" style="width: 150px; text-align: left;"></td>' +
            '                                                  <td style="width: 50px; text-align: center;">' +
            '                                                       <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
            '                                                  </td>' +
            '                                              </tr>' +
            '                                          </tbody>' +
            '                                      </table>' +
            '                                      </div>' +
            '                                   </td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '           <td style="text-align: left;" colspan="2">' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-business-time cinzaColor"></i>D\u00E9bito de horas referentes ao feriado de meio per\u00EDodo</td>' +
            '                      <td style="text-align: right;max-width: 50px;">' +
            '                          <input type="number" class="singleOptionConfig" data-key="horas_meio_periodo" id="horas_meio_periodo" value="' + (config && typeof config.horas_meio_periodo !== 'undefined' && config.horas_meio_periodo != '' ? config.horas_meio_periodo : 6) + '">' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '     </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_planos_trabalho">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-handshake cinzaColor"></i>Planos de Trabalho</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-user-clock cinzaColor"></i> Carga hor\u00E1ria padr\u00E3o</td>' +
            '                      <td style="text-align: right;">' +
            '                          <input type="number" class="singleOptionConfig" data-key="carga_horaria_padrao" id="carga_horaria_padrao" value="' + (config && typeof config.carga_horaria_padrao !== 'undefined' && config.carga_horaria_padrao != '' ? config.carga_horaria_padrao : 8) + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-wrench cinzaColor"></i> Tipo de modalidade padr\u00E3o</td>' +
            '                      <td style="text-align: right;">' +
            '                          <select class="singleOptionConfig" data-key="tipo_modalidade_padrao" data-type="number" id="tipo_modalidade_padrao">' +
            '                          ' + selectModalidadesOptions +
            '                          </select>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-calendar cinzaColor"></i> Limitar os planos de trabalho e ' + __.programas + ' ao ano civil</td>' +
            '                      <td style="text-align: right;">' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="limitar_ano_civil" data-act="atividades-call" data-fn="changeConfigOptions" data-ref="configEntidade_limite_meses_planos" data-ref_type="class" class="onoffswitch-checkbox singleOptionConfig" id="limitar_ano_civil" tabindex="0" ' + (config && typeof config.limitar_ano_civil !== 'undefined' && config.limitar_ano_civil ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="limitar_ano_civil"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;' + (config && typeof config.limitar_ano_civil !== 'undefined' && config.limitar_ano_civil ? '' : 'display:none;') + '" class="configEntidade_limite_meses_planos">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-calendar-alt cinzaColor"></i> Limite de meses para os planos de trabalho</td>' +
            '                      <td style="text-align: right;">' +
            '                          <input type="number" style="width: 70px !important;" min="1" max="12" step="1" class="singleOptionConfig" data-key="limite_meses_planos" id="limite_meses_planos" value="' + (config && typeof config.limite_meses_planos !== 'undefined' && config.limite_meses_planos != '' ? config.limite_meses_planos : '6') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;' + (config && typeof config.limitar_ano_civil !== 'undefined' && config.limitar_ano_civil ? '' : 'display:none;') + '" class="configEntidade_limite_meses_planos">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-calendar cinzaColor"></i> Limite de meses para os ' + __.programas + '</td>' +
            '                      <td style="text-align: right;">' +
            '                          <input type="number" style="width: 70px !important;" min="1" max="24" step="1" class="singleOptionConfig" data-key="limite_meses_programas" id="limite_meses_programas" value="' + (config && typeof config.limite_meses_programas !== 'undefined' && config.limite_meses_programas != '' ? config.limite_meses_programas : '12') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-exclamation-triangle cinzaColor"></i> Alerta sobre plano com baixa pactua\u00E7\u00E3o: Porcentagem do tempo programado acima do tempo pactuado para  (0 = desativado)</td>' +
            '                      <td style="text-align: right;">' +
            '                          <input type="number" style="width: 70px !important;" min="0" max="100" step="1" class="singleOptionConfig" data-key="alerta_tempo_programado" id="alerta_tempo_programado" value="' + (config && typeof config.alerta_tempo_programado !== 'undefined' && config.alerta_tempo_programado != '' ? config.alerta_tempo_programado : '50') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-file-signature cinzaColor"></i>Modelos</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 8pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;font-size: 10pt;"><i class="iconPopup fas fa-file-signature cinzaColor"></i> Tipo de vincula\u00E7\u00E3o de termos de ades\u00E3o</td>' +
            '                      <td style="text-align: right;">' +
            '                          <select class="singleOptionConfig" data-key="tipo_vinculacao_termo" data-type="number" id="tipo_vinculacao_termo">' +
            '                               <option value="1" ' + (config && typeof config.tipo_vinculacao_termo !== 'undefined' && config.tipo_vinculacao_termo == 1 ? 'selected' : '') + '>ao Plano de Trabalho</option>' +
            '                               <option value="2" ' + (config && typeof config.tipo_vinculacao_termo !== 'undefined' && config.tipo_vinculacao_termo == 2 ? 'selected' : '') + '>ao Usu\u00E1rio</option>' +
            '                          </select>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td>' +
            '                           <a class="newLink editModelDoc" data-type="' + data.type + '" data-id_reference="' + value.id_entidade + '" data-action="edit" data-mode="modelo_termo_adesao" data-icon="pencil-alt" data-title="Editar Modelo: Termo de Ades\u00E3o" data-act="atividades-call" data-fn="editModelConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
            '                               <i class="fas fa-pencil-alt cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                               Termo de Ades\u00E3o' +
            '                           </a>' +
            '                           <a class="newLink viewModelDoc" data-type="' + data.type + '" data-sign="false" data-user="false" data-id_reference="' + value.id_entidade + '" data-action="view" data-mode="modelo_termo_adesao" data-icon="eye" data-title="Visualizar Modelo: Termo de Ades\u00E3o" data-act="atividades-call" data-fn="editModelConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
            '                               <i class="fas fa-eye cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                           </a>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_homologacao">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-handshake cinzaColor"></i>Planos de trabalho</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-thumbs-up cinzaColor"></i> Exigir a homologa\u00E7\u00E3o de planos de trabalho antes da sua execu\u00E7\u00E3o</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="exigir_homologacao_previa_planos" data-act="atividades-call" data-fn="changeConfigOptions" data-ref_type="class" data-ref="configEntidade_verificacoes_planos_trabalho" class="onoffswitch-checkbox singleOptionConfig" id="exigir_homologacao_previa_planos" tabindex="0" ' + (config && typeof config.exigir_homologacao_previa_planos !== 'undefined' && config.exigir_homologacao_previa_planos ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="exigir_homologacao_previa_planos"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr class="configEntidade_verificacoes_planos_trabalho" data-ref_invert="false" style="height: 40px;' + (config && typeof config.exigir_homologacao_previa_planos !== 'undefined' && config.exigir_homologacao_previa_planos ? '' : 'display:none;') + '">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-calendar cinzaColor"></i> Data de in\u00EDcio para aplica\u00E7\u00E3o da exig\u00EAncia de homologa\u00E7\u00E3o pr\u00E9via de planos</td>' +
            '                      <td style="text-align: right;">' +
            '                          <input type="date" style="width: 120px !important;" class="singleOptionConfig" data-key="data_homologacao_previa_planos" id="data_homologacao_previa_planos" value="' + (config && typeof config.data_homologacao_previa_planos !== 'undefined' && config.data_homologacao_previa_planos != '' ? config.data_homologacao_previa_planos : '') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr class="configEntidade_verificacoes_planos_trabalho" style="height: 40px;" style="' + (config && typeof config.exigir_homologacao_previa_planos !== 'undefined' && config.exigir_homologacao_previa_planos ? '' : 'display:none;') + '">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-star cinzaColor"></i> Exigir a avalia\u00E7\u00E3o de planos de trabalho anteriores para a homologa\u00E7\u00E3o de novos planos</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="exigir_avaliacao_previa_planos" data-act="atividades-call" data-fn="changeConfigOptions" data-ref_type="class" data-ref="configEntidade_exigir_avaliacao_previa_planos"  class="onoffswitch-checkbox singleOptionConfig" id="exigir_avaliacao_previa_planos" tabindex="0" ' + (config && typeof config.exigir_avaliacao_previa_planos !== 'undefined' && config.exigir_avaliacao_previa_planos ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="exigir_avaliacao_previa_planos"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr class="configEntidade_exigir_avaliacao_previa_planos configEntidade_verificacoes_planos_trabalho" style="height: 40px;" style="' + (config && typeof config.exigir_avaliacao_previa_planos !== 'undefined' && config.exigir_avaliacao_previa_planos ? '' : 'display:none;') + '">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-door-closed cinzaColor"></i> Permitir a avalia\u00E7\u00E3o de planos antes do seu encerramento</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="permitir_avaliacao_planos_vincendos" data-act="atividades-call" data-fn="changeConfigOptions" class="onoffswitch-checkbox singleOptionConfig" id="permitir_avaliacao_planos_vincendos" tabindex="0" ' + (config && typeof config.permitir_avaliacao_planos_vincendos !== 'undefined' && config.permitir_avaliacao_planos_vincendos ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="permitir_avaliacao_planos_vincendos"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr class="configEntidade_exigir_avaliacao_previa_planos configEntidade_verificacoes_planos_trabalho" style="height: 40px;" style="' + (config && typeof config.exigir_avaliacao_previa_planos !== 'undefined' && config.exigir_avaliacao_previa_planos ? '' : 'display:none;') + '">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-user-cog cinzaColor"></i> Permitir a autohomologa\u00E7\u00E3o de planos de trabalho</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="permitir_autohomologacao_planos" data-act="atividades-call" data-fn="changeConfigOptions" class="onoffswitch-checkbox singleOptionConfig" id="permitir_autohomologacao_planos" tabindex="0" ' + (config && typeof config.permitir_autohomologacao_planos !== 'undefined' && config.permitir_autohomologacao_planos ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="permitir_autohomologacao_planos"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr class="configEntidade_verificacoes_planos_trabalho" data-ref_invert="true" style="height: 40px;' + (config && typeof config.exigir_homologacao_previa_planos !== 'undefined' && config.exigir_homologacao_previa_planos ? 'display:none;' : '') + '">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-percentage cinzaColor"></i> Porcentagem  m\u00EDnima de cumprimento do plano para homologa\u00E7\u00E3o autom\u00E1tica<br>(\u00CDndice de tempo produtivo - ITP)</td>' +
            '                      <td style="text-align: right;">' +
            '                          <input type="number" style="width: 70px !important;" min="0" max="100" step="1" class="singleOptionConfig" data-key="indice_produtivo" id="indice_produtivo" value="' + (config && typeof config.indice_produtivo !== 'undefined' && config.indice_produtivo != '' ? config.indice_produtivo : '100') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr class="configEntidade_verificacoes_planos_trabalho" data-ref_invert="true" style="height: 40px;' + (config && typeof config.exigir_homologacao_previa_planos !== 'undefined' && config.exigir_homologacao_previa_planos ? 'display:none;' : '') + '">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-clone cinzaColor"></i> Duplicar planos de trabalho automaticamente ap\u00F3s a homologa\u00E7\u00E3o</td>' +
            '                      <td style="text-align: right;">' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="duplicar_automaticamente" class="onoffswitch-checkbox singleOptionConfig" id="duplicar_automaticamente" tabindex="0" ' + (config && typeof config.duplicar_automaticamente !== 'undefined' && config.duplicar_automaticamente ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="duplicar_automaticamente"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr class="configEntidade_verificacoes_planos_trabalho" data-ref_invert="true" style="height: 40px;' + (config && typeof config.exigir_homologacao_previa_planos !== 'undefined' && config.exigir_homologacao_previa_planos ? 'display:none;' : '') + '">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-history cinzaColor"></i> Arquivar planos de trabalho homologados</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="arquivar_planos_trabalho" data-act="atividades-call" data-fn="changeConfigOptions" data-ref="configEntidade_prazo_arquivar_planos_trabalho" class="onoffswitch-checkbox singleOptionConfig" id="arquivar_planos_trabalho" tabindex="0" ' + (config && typeof config.arquivar_planos_trabalho !== 'undefined' && config.arquivar_planos_trabalho ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="arquivar_planos_trabalho"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;' + (config && typeof config.arquivar_planos_trabalho !== 'undefined' && config.arquivar_planos_trabalho ? '' : 'display:none;') + '" id="configEntidade_prazo_arquivar_planos_trabalho">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-inbox cinzaColor"></i> Prazo para o arquivamento de planos de trabalho (meses ap\u00F3s o encerramento)</td>' +
            '                      <td>' +
            '                          <input type="number" style="width: 70px !important;" min="0" step="1" class="singleOptionConfig" data-key="prazo_arquivar_planos_trabalho" id="prazo_arquivar_planos_trabalho" value="' + (config && typeof config.prazo_arquivar_planos_trabalho !== 'undefined' && config.prazo_arquivar_planos_trabalho != '' ? config.prazo_arquivar_planos_trabalho : '3') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr class="configEntidade_verificacoes_planos_trabalho" data-ref_invert="true" style="' + (config && typeof config.exigir_homologacao_previa_planos !== 'undefined' && config.exigir_homologacao_previa_planos ? 'display:none;' : '') + '">' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-tasks cinzaColor"></i>Verifica\u00E7\u00F5es ao homologar planos de trabalho</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-star cinzaColor"></i> Avalia\u00E7\u00F5es pendentes</td>' +
            '                      <td style="text-align: right;">' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="pendencias_plano_avaliacao_pendente" class="onoffswitch-checkbox singleOptionConfig" id="pendencias_plano_avaliacao_pendente" tabindex="0" ' + (config && typeof config.pendencias_plano_avaliacao_pendente !== 'undefined' && config.pendencias_plano_avaliacao_pendente ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="pendencias_plano_avaliacao_pendente"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-inbox cinzaColor"></i> Entregas insuficientes</td>' +
            '                      <td style="text-align: right;">' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="pendencias_plano_entrega_insuficiente" class="onoffswitch-checkbox singleOptionConfig" id="pendencias_plano_entrega_insuficiente" tabindex="0" ' + (config && typeof config.pendencias_plano_entrega_insuficiente !== 'undefined' && config.pendencias_plano_entrega_insuficiente ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="pendencias_plano_entrega_insuficiente"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-handshake cinzaColor"></i> Pactua\u00E7\u00E3o Insuficiente</td>' +
            '                      <td style="text-align: right;">' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="pendencias_plano_pactuacao_insuficiente" class="onoffswitch-checkbox singleOptionConfig" id="pendencias_plano_pactuacao_insuficiente" tabindex="0" ' + (config && typeof config.pendencias_plano_pactuacao_insuficiente !== 'undefined' && config.pendencias_plano_pactuacao_insuficiente ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="pendencias_plano_pactuacao_insuficiente"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-chart-line cinzaColor"></i> Produtividade Insuficiente</td>' +
            '                      <td style="text-align: right;">' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="pendencias_plano_produtividade_insuficiente" class="onoffswitch-checkbox singleOptionConfig" id="pendencias_plano_produtividade_insuficiente" tabindex="0" ' + (config && typeof config.pendencias_plano_produtividade_insuficiente !== 'undefined' && config.pendencias_plano_produtividade_insuficiente ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="pendencias_plano_produtividade_insuficiente"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-cubes cinzaColor"></i>' + __.Programas + '</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-thumbs-up cinzaColor"></i> Exigir a homologa&ccedil;&atilde;o de ' + __.programas + ' antes da sua execu\u00E7\u00E3o</td>' +
            '                      <td style="text-align: right;">' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="exigir_homologacao_programas" data-act="atividades-call" data-fn="changeConfigOptions" data-ref_type="class" data-ref="configEntidade_verificacoes_programa" class="onoffswitch-checkbox singleOptionConfig" id="exigir_homologacao_programas" tabindex="0" ' + (config && typeof config.exigir_homologacao_programas !== 'undefined' && config.exigir_homologacao_programas ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="exigir_homologacao_programas"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr class="configEntidade_verificacoes_programa" style="height: 40px;" style="' + (config && typeof config.exigir_homologacao_programas !== 'undefined' && config.exigir_homologacao_programas ? '' : 'display:none;') + '">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-star cinzaColor"></i> Exigir a avalia\u00E7\u00E3o de ' + __.programas + ' anteriores para a homologa\u00E7\u00E3o de novos ' + __.programas + '</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="exigir_avaliacao_previa_programas" data-act="atividades-call" data-fn="changeConfigOptions" class="onoffswitch-checkbox singleOptionConfig" id="exigir_avaliacao_previa_programas" tabindex="0" ' + (config && typeof config.exigir_avaliacao_previa_programas !== 'undefined' && config.exigir_avaliacao_previa_programas ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="exigir_avaliacao_previa_programas"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_atividades">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-clipboard-list cinzaColor"></i>' + __.Demandas + '</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-history cinzaColor"></i> Gravar o hist\u00F3rico ' + __.demandas_programadas + ' no hist\u00F3rico do processo (somente ' + __.demandas + ' processuais)</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="gravar_historico_processo" class="onoffswitch-checkbox singleOptionConfig" id="gravar_historico_processo" tabindex="0" ' + (config && typeof config.gravar_historico_processo !== 'undefined' && config.gravar_historico_processo ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="gravar_historico_processo"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-random cinzaColor"></i> Limitar a vincula\u00E7\u00E3o de ' + __.demandas + ' da unidade apenas ao seus usu\u00E1rios lotados</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="limitar_vinculacao_atividades" class="onoffswitch-checkbox singleOptionConfig" id="limitar_vinculacao_atividades" tabindex="0" ' + (config && typeof config.limitar_vinculacao_atividades !== 'undefined' && config.limitar_vinculacao_atividades ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="limitar_vinculacao_atividades"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-user-tie cinzaColor"></i> Exigir a atribui\u00E7\u00E3o de ' + __.demandas + ' (campo respons\u00E1vel obrigat\u00F3rio)</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="exigir_atribuicao_demandas" data-act="atividades-call" data-fn="changeConfigOptions" data-ref="configEntidade_exigir_atribuicao_demandas" class="onoffswitch-checkbox singleOptionConfig" id="exigir_atribuicao_demandas" tabindex="0" ' + (config && typeof config.exigir_atribuicao_demandas !== 'undefined' && config.exigir_atribuicao_demandas ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="exigir_atribuicao_demandas"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-history cinzaColor"></i> Limitar o cadastramento de ' + __.demandas + ' ' + getNameGenre('demanda', 'retroativos', 'retroativas') + ' (dias ap\u00F3s a encerramento do plano)</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="limitar_demandas_retroativas" data-act="atividades-call" data-fn="changeConfigOptions" data-ref="configEntidade_prazo_demandas_retroativas" class="onoffswitch-checkbox singleOptionConfig" id="limitar_demandas_retroativas" tabindex="0" ' + (config && typeof config.limitar_demandas_retroativas !== 'undefined' && config.limitar_demandas_retroativas ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="limitar_demandas_retroativas"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;' + (config && typeof config.limitar_demandas_retroativas !== 'undefined' && config.limitar_demandas_retroativas ? '' : 'display:none;') + '" id="configEntidade_prazo_demandas_retroativas">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-clock cinzaColor"></i> Prazo para o cadastro de ' + __.demandas + ' ' + getNameGenre('demanda', 'retroativos', 'retroativas') + '</td>' +
            '                      <td>' +
            '                          <input type="number" style="width: 70px !important;" min="0" step="1" class="singleOptionConfig" data-key="prazo_demandas_retroativas" id="prazo_demandas_retroativas" value="' + (config && typeof config.prazo_demandas_retroativas !== 'undefined' && config.prazo_demandas_retroativas != '' ? config.prazo_demandas_retroativas : '30') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_avaliacoes">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-clipboard-list cinzaColor"></i>' + __.Demandas + '</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-star-half-alt cinzaColor"></i> Exigir a avalia\u00E7\u00E3o antes do cadastramento de ' + getNameGenre('demanda', 'novos', 'novas') + ' ' + __.demandas + '</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="checar_avaliacao" data-act="atividades-call" data-fn="changeConfigOptions" data-ref="configEntidade_prazo_avaliacao" class="onoffswitch-checkbox singleOptionConfig" id="checar_avaliacao" tabindex="0" ' + (config && typeof config.checar_avaliacao !== 'undefined' && config.checar_avaliacao ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="checar_avaliacao"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;' + (config && typeof config.checar_avaliacao !== 'undefined' && config.checar_avaliacao ? '' : 'display:none;') + '" id="configEntidade_prazo_avaliacao">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-star cinzaColor"></i> Prazo para a avalia\u00E7\u00E3o de ' + __.demandas + '</td>' +
            '                      <td>' +
            '                          <input type="number" style="width: 70px !important;" min="0" step="1" class="singleOptionConfig" data-key="prazo_avaliacao" id="prazo_avaliacao" value="' + (config && typeof config.prazo_avaliacao !== 'undefined' && config.prazo_avaliacao != '' ? config.prazo_avaliacao : '40') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup far fa-star cinzaColor"></i> Restringir a avalia\u00E7\u00E3o m\u00E1xima de produtividades menores que 100%</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="limitar_avaliacao_maxima" class="onoffswitch-checkbox singleOptionConfig" id="limitar_avaliacao_maxima" tabindex="0" ' + (config && typeof config.limitar_avaliacao_maxima !== 'undefined' && config.limitar_avaliacao_maxima ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="limitar_avaliacao_maxima"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-handshake cinzaColor"></i>Planos de Trabalho</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-gavel cinzaColor"></i> Utilizar a an\u00E1lise de recursos de avalia\u00E7\u00F5es de planos de trabalho</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="recurso_avaliacao_planos" data-act="atividades-call" data-fn="changeConfigOptions" data-ref="configEntidade_recurso_avaliacao_planos" data-ref_type="class" class="onoffswitch-checkbox singleOptionConfig" id="recurso_avaliacao_planos" tabindex="0" ' + (config && typeof config.recurso_avaliacao_planos !== 'undefined' && config.recurso_avaliacao_planos ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="recurso_avaliacao_planos"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;' + (config && typeof config.recurso_avaliacao_planos !== 'undefined' && config.recurso_avaliacao_planos ? '' : 'display:none;') + '" class="configEntidade_recurso_avaliacao_planos">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-clock cinzaColor"></i> Prazo para a avalia\u00E7\u00E3o ap\u00F3s o encerramento do plano (dias)</td>' +
            '                      <td style="text-align: right;">' +
            '                          <input type="number" style="width: 70px !important;" min="1" step="1" class="singleOptionConfig" data-key="prazo_avaliacao_plano" id="prazo_avaliacao_plano" value="' + (config && typeof config.prazo_avaliacao_plano !== 'undefined' && config.prazo_avaliacao_plano != '' ? config.prazo_avaliacao_plano : '30') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;' + (config && typeof config.recurso_avaliacao_planos !== 'undefined' && config.recurso_avaliacao_planos ? '' : 'display:none;') + '" class="configEntidade_recurso_avaliacao_planos">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-clock cinzaColor"></i> Prazo para a apresenta\u00E7\u00E3o de recurso pelo avaliado (dias)</td>' +
            '                      <td style="text-align: right;">' +
            '                          <input type="number" style="width: 70px !important;" min="1" step="1" class="singleOptionConfig" data-key="prazo_apresentacao_recurso" id="prazo_apresentacao_recurso" value="' + (config && typeof config.prazo_apresentacao_recurso !== 'undefined' && config.prazo_apresentacao_recurso != '' ? config.prazo_apresentacao_recurso : '10') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;' + (config && typeof config.recurso_avaliacao_planos !== 'undefined' && config.recurso_avaliacao_planos ? '' : 'display:none;') + '" class="configEntidade_recurso_avaliacao_planos">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-exclamation-triangle cinzaColor"></i> Prazo para a dedu\u00E7\u00E3o autom\u00E1tica de horas pela aus\u00EAncia de recurso pelo avaliado (dias)</td>' +
            '                      <td style="text-align: right;">' +
            '                          <input type="number" style="width: 70px !important;" min="1" step="1" class="singleOptionConfig" data-key="prazo_deducao_automatica" id="prazo_deducao_automatica" value="' + (config && typeof config.prazo_deducao_automatica !== 'undefined' && config.prazo_deducao_automatica != '' ? config.prazo_deducao_automatica : '30') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;' + (config && typeof config.recurso_avaliacao_planos !== 'undefined' && config.recurso_avaliacao_planos ? '' : 'display:none;') + '" class="configEntidade_recurso_avaliacao_planos">' +
            '                      <td style="text-align: left;"><i class="iconPopup far fa-clock cinzaColor"></i> Prazo para a an\u00E1lise de recurso pelo avaliador (dias)</td>' +
            '                      <td style="text-align: right;">' +
            '                          <input type="number" style="width: 70px !important;" min="1" step="1" class="singleOptionConfig" data-key="prazo_analise_recurso" id="prazo_analise_recurso" value="' + (config && typeof config.prazo_analise_recurso !== 'undefined' && config.prazo_analise_recurso != '' ? config.prazo_analise_recurso : '10') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;' + (config && typeof config.recurso_avaliacao_planos !== 'undefined' && config.recurso_avaliacao_planos ? '' : 'display:none;') + '" class="configEntidade_recurso_avaliacao_planos">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-calendar cinzaColor"></i> M\u00E9todo de contagem de prazo para apresenta\u00E7\u00E3o e an\u00E1lise de recurso</td>' +
            '                      <td style="text-align: right;">' +
            '                           <select style="width: 40%;float: right;" class="singleOptionConfig" data-key="contagem_dias_recurso" id="contagem_dias_recurso">' +
            '                                <option value="uteis" ' + (config && (typeof config.contagem_dias_recurso === 'undefined' || (typeof config.contagem_dias_recurso !== 'undefined' && config.contagem_dias_recurso == 'uteis')) ? 'selected' : '') + '>\u00DAteis</option>' +
            '                                <option value="corridos" ' + (config && typeof config.contagem_dias_recurso !== 'undefined' && config.contagem_dias_recurso == 'corridos' ? 'selected' : '') + '>Corridos</option>' +
            '                           </select>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;' + (config && typeof config.recurso_avaliacao_planos !== 'undefined' && config.recurso_avaliacao_planos ? '' : 'display:none;') + '" class="configEntidade_recurso_avaliacao_planos">' +
            '                      <td colspan="2">' +
            '                           <table style="font-size: 10pt;width: 100%; margin: 0;" class="seiProForm">' +
            '                               <tr>' +
            '                                   <td style="text-align: left;"><i class="iconPopup far fa-balance-scale cinzaColor"></i> Fundamento normativo</td>' +
            '                                   <td style="text-align: right;">' +
            '                                       <input type="text" class="singleOptionConfig" data-key="fundamento_analise_recurso" id="fundamento_analise_recurso" value="' + (config && typeof config.fundamento_analise_recurso !== 'undefined' && config.fundamento_analise_recurso != '' ? config.fundamento_analise_recurso : '\u00A7 4\u00BA, Art. 21 da Instru\u00E7\u00E3o Normativa Conjunta SEGES-SGPRT/MGI n\u00BA 24, de 28 de julho de 2023') + '">' +
            '                                   </td>' +
            '                               </tr>' +
            '                           </table>' +
            '                       </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-exchange-alt cinzaColor"></i>Compensa\u00E7\u00E3o de Horas</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-hourglass-half cinzaColor"></i> Acr\u00E9scimo de jornada extraordin\u00E1ria m\u00E1xima para compensa\u00E7\u00E3o de carga hor\u00E1ria n\u00E3o cumprida (%)</td>' +
            '                      <td style="text-align: right;">' +
            '                          <input type="number" style="width: 70px !important;" min="1" step="1" class="singleOptionConfig" data-key="acrescimo_maximo_jornada" id="acrescimo_maximo_jornada" value="' + (config && typeof config.acrescimo_maximo_jornada !== 'undefined' && config.acrescimo_maximo_jornada != '' ? config.acrescimo_maximo_jornada : '25') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_visualizacao">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-magic cinzaColor"></i>Visualiza\u00E7\u00E3o</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;" colspan="2">' +
            '                           <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                              <tr style="height: 40px;">' +
            '                                  <td style="text-align: left;">' +
            '                                       <i class="iconPopup fas fa-graduation-cap cinzaColor"></i> URL do Guia de Utiliza\u00E7\u00E3o' +
            '                                  </td>' +
            '                                  <td style="width: 250px;">' +
            '                                      <input type="text" class="singleOptionConfig" data-key="guia_utilizacao" id="extensao_firefox" value="' + (config && typeof config.guia_utilizacao !== 'undefined' && config.guia_utilizacao != '' ? config.guia_utilizacao : 'https://bit.ly/Guia-ANTAQPro') + '">' +
            '                                  </td>' +
            '                              </tr>' +
            '                           </table>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-window-restore cinzaColor"></i> Abrir as configura\u00E7\u00F5es do sistema em janela apartada (modal)</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="modal_configuracoes" class="onoffswitch-checkbox singleOptionConfig" id="modal_configuracoes" tabindex="0" ' + (config && typeof config.modal_configuracoes !== 'undefined' && config.modal_configuracoes ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="modal_configuracoes"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;display:none">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-tasks cinzaColor"></i> Utilizar o cadastro simplificado de demandas como padr\u00E3o</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="cadastro_simplificado" class="onoffswitch-checkbox singleOptionConfig" id="cadastro_simplificado" tabindex="0" ' + (config && typeof config.cadastro_simplificado !== 'undefined' && config.cadastro_simplificado ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="cadastro_simplificado"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-tasks cinzaColor"></i> Utilizar o cadastro r\u00E1pido de demandas como padr\u00E3o</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="cadastro_rapido" class="onoffswitch-checkbox singleOptionConfig" id="cadastro_rapido" tabindex="0" ' + (config && typeof config.cadastro_rapido !== 'undefined' && config.cadastro_rapido ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="cadastro_rapido"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-file-alt cinzaColor"></i> Dispensar os campos de Tipo de Requisi\u00E7\u00E3o e Tipos de Documentos<br>nos formul\u00E1rios de ' + __.demanda + '</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="dispensa_tipos_requisicao" class="onoffswitch-checkbox singleOptionConfig" id="dispensa_tipos_requisicao" tabindex="0" ' + (config && typeof config.dispensa_tipos_requisicao !== 'undefined' && config.dispensa_tipos_requisicao ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="dispensa_tipos_requisicao"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-redo-alt cinzaColor"></i> Desativar a cria\u00E7\u00E3o de ' + __.demandas + ' recorrentes</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="desativa_demandas_recorrentes" class="onoffswitch-checkbox singleOptionConfig" id="desativa_demandas_recorrentes" tabindex="0" ' + (config && typeof config.desativa_demandas_recorrentes !== 'undefined' && config.desativa_demandas_recorrentes ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="desativa_demandas_recorrentes"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-phone cinzaColor"></i> Visualizar telefones na lista de contatos</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="visualizar_telefones" class="onoffswitch-checkbox singleOptionConfig" id="visualizar_telefones" tabindex="0" ' + (config && typeof config.visualizar_telefones !== 'undefined' && config.visualizar_telefones ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="visualizar_telefones"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-birthday-cake cinzaColor"></i> Visualizar anivers\u00E1rios na lista de contatos</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="visualizar_aniversarios" class="onoffswitch-checkbox singleOptionConfig" id="visualizar_aniversarios" tabindex="0" ' + (config && typeof config.visualizar_aniversarios !== 'undefined' && config.visualizar_aniversarios ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="visualizar_aniversarios"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;" colspan="2">' +
            '                           <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                              <tr style="height: 40px;">' +
            '                                  <td style="text-align: left;">' +
            '                                       <i class="iconPopup fas fa-fast-forward cinzaColor"></i> Quantidade de resultados na pagina\u00E7\u00E3o de demandas, relat\u00F3rios e configura\u00E7\u00F5es (0 = desativado)' +
            '                                  </td>' +
            '                                  <td style="text-align: right;">' +
            '                                      <input type="number" style="width: 40% !important;" class="singleOptionConfig" data-key="limit_paginacao" id="limit_paginacao" value="' + (config && typeof config.limit_paginacao !== 'undefined' ? config.limit_paginacao : '100') + '">' +
            '                                  </td>' +
            '                              </tr>' +
            '                           </table>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-toolbox cinzaColor"></i> Desativar a visualiza\u00E7\u00E3o de \u00EDndices de produtividade em todo sistema</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="desativa_produtividade_geral" class="onoffswitch-checkbox singleOptionConfig" id="desativa_produtividade_geral" tabindex="0" ' + (config && typeof config.desativa_produtividade_geral !== 'undefined' && config.desativa_produtividade_geral ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="desativa_produtividade_geral"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-trash-restore cinzaColor"></i> Visualizar registros inativos expurgados (> 1 semana)</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="visualizar_registros_expurgados" class="onoffswitch-checkbox singleOptionConfig" id="visualizar_registros_expurgados" tabindex="0" ' + (config && typeof config.visualizar_registros_expurgados !== 'undefined' && config.visualizar_registros_expurgados ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="visualizar_registros_expurgados"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_notificacao">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-envelope cinzaColor"></i> Enviar notifica\u00E7\u00E3o para a caixa de email da unidade e seus respons\u00E1veis (metadados titular_unidade e substituto_unidade)</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="notificacao_email_unidade" data-act="atividades-call" data-fn="changeConfigOptions" data-ref="configEntidade_notificacao_email_unidade" data-ref_type="class" class="onoffswitch-checkbox singleOptionConfig" id="notificacao_email_unidade" tabindex="0" ' + (config && typeof config.notificacao_email_unidade !== 'undefined' && config.notificacao_email_unidade ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="notificacao_email_unidade"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '           <td>' +
            '               <div class="tabelaPanelScroll">' +
            '               <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left; width: 35%;">' +
            '                           <div><i class="iconPopup fas fa-user-check cinzaColor"></i> Texto padr\u00E3o para <br> avalia\u00E7\u00E3o de planos</div>' +
            '                           <div style="margin: 10px 0">' +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano', '{apelido}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano', '{id_plano}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano', '{data_inicio_vigencia}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano', '{data_fim_vigencia}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano', '{nota_atribuida}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano', '{tabela_entregas}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano', '{justificativas}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano', '{comentarios}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano', '{nome_avaliador}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano', '{data_avaliacao}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano', '{texto_recurso}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano', '{contato_unidade}') +
            '                           </div>' +
            '                      </td>' +
            '                      <td>' +
            '                          <textarea id="notificacao_texto_avaliacao_plano" data-key="notificacao_texto_avaliacao_plano" data-type="text" class="singleOptionInput" style="width: 97%; height: 200px;">' + (config && typeof config.notificacao_texto_avaliacao_plano !== 'undefined' ? unicodeToChar(config.notificacao_texto_avaliacao_plano).replace(/\\n/g, '\n') : notificacaoTexto.avaliacao_plano) + '</textarea>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left; width: 35%;">' +
            '                           <div><i class="iconPopup fas fa-user-check cinzaColor"></i> Texto padr\u00E3o para <br> avalia\u00E7\u00E3o de plano n\u00E3o aceito {texto_recurso}</div>' +
            '                           <div style="margin: 10px 0">' +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano_nao_aceito', '{fundamento_analise_recurso}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano_nao_aceito', '{prazo_apresentacao_recurso}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano_nao_aceito', '{contagem_dias_recurso}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_avaliacao_plano_nao_aceito', '{data_fim_recurso}') +
            '                           </div>' +
            '                      </td>' +
            '                      <td>' +
            '                          <textarea id="notificacao_texto_avaliacao_plano_nao_aceito" data-key="notificacao_texto_avaliacao_plano_nao_aceito" data-type="text" class="singleOptionInput" style="width: 97%; height: 200px;">' + (config && typeof config.notificacao_texto_avaliacao_plano_nao_aceito !== 'undefined' ? unicodeToChar(config.notificacao_texto_avaliacao_plano_nao_aceito).replace(/\\n/g, '\n') : notificacaoTexto.avaliacao_plano_nao_aceito) + '</textarea>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left; width: 35%;">' +
            '                           <div><i class="iconPopup fas fa-user-check cinzaColor"></i> Texto padr\u00E3o para <br> apresenta\u00E7\u00E3o de recurso</div>' +
            '                           <div style="margin: 10px 0">' +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{apelido}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{id_plano}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{data_inicio_vigencia}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{data_fim_vigencia}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{nota_atribuida}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{comentarios}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{nome_avaliador}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{data_avaliacao}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{nome_avaliado}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{data_apresentacao_recurso}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{justificativa_avaliado}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{fundamento_analise_recurso}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{prazo_analise_recurso}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_apresentacao', '{contagem_dias_recurso}') +
            '                           </div>' +
            '                      </td>' +
            '                      <td>' +
            '                          <textarea id="notificacao_texto_recurso_apresentacao" data-key="notificacao_texto_recurso_apresentacao" data-type="text" class="singleOptionInput" style="width: 97%; height: 200px;">' + (config && typeof config.notificacao_texto_recurso_apresentacao !== 'undefined' ? unicodeToChar(config.notificacao_texto_recurso_apresentacao).replace(/\\n/g, '\n') : notificacaoTexto.recurso_apresentacao) + '</textarea>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left; width: 35%;">' +
            '                           <div><i class="iconPopup fas fa-user-check cinzaColor"></i> Texto padr\u00E3o para <br> an\u00E1lise de recurso</div>' +
            '                           <div style="margin: 10px 0">' +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{apelido}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{id_plano}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{data_inicio_vigencia}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{data_fim_vigencia}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{nota_atribuida}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{comentarios}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{nome_avaliador}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{nome_avaliado}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{data_apresentacao_recurso}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{justificativa_avaliado}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{nome_avaliador_recurso}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{data_analise_recurso}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{resultado_analise}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_recurso_analise', '{contato_unidade}') +
            '                           </div>' +
            '                      </td>' +
            '                      <td>' +
            '                          <textarea id="notificacao_texto_recurso_analise" data-key="notificacao_texto_recurso_analise" data-type="text" class="singleOptionInput" style="width: 97%; height: 200px;">' + (config && typeof config.notificacao_texto_recurso_analise !== 'undefined' ? unicodeToChar(config.notificacao_texto_recurso_analise).replace(/\\n/g, '\n') : notificacaoTexto.recurso_analise) + '</textarea>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left; width: 35%;">' +
            '                           <div><i class="iconPopup fas fa-user-check cinzaColor"></i> Texto padr\u00E3o para <br> cancelamento de avalia\u00E7\u00E3o de plano</div>' +
            '                           <div style="margin: 10px 0">' +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{apelido}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{id_plano}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{data_inicio_vigencia}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{data_fim_vigencia}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{nome_cancelador}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{data_cancelamento}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{contato_unidade}') +
            '                           </div>' +
            '                      </td>' +
            '                      <td>' +
            '                          <textarea id="notificacao_texto_cancelamento_avaliacao_plano" data-key="notificacao_texto_cancelamento_avaliacao_plano" data-type="text" class="singleOptionInput" style="width: 97%; height: 200px;">' + (config && typeof config.notificacao_texto_cancelamento_avaliacao_plano !== 'undefined' ? unicodeToChar(config.notificacao_texto_cancelamento_avaliacao_plano).replace(/\\n/g, '\n') : notificacaoTexto.cancelamento_avaliacao_plano) + '</textarea>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left; width: 35%;">' +
            '                           <div><i class="iconPopup fas fa-user-check cinzaColor"></i> Texto padr\u00E3o para <br> omiss\u00E3o de demanda</div>' +
            '                           <div style="margin: 10px 0">' +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{apelido}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{id_plano}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{data_inicio_vigencia}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{data_fim_vigencia}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{nome_cancelador}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{data_cancelamento}') +
            '                               ' + htmlOptionsAddTextarea('notificacao_texto_cancelamento_avaliacao_plano', '{contato_unidade}') +
            '                           </div>' +
            '                      </td>' +
            '                      <td>' +
            '                          <textarea id="notificacao_texto_omissao_demanda" data-key="notificacao_texto_omissao_demanda" data-type="text" class="singleOptionInput" style="width: 97%; height: 200px;">' + (config && typeof config.notificacao_texto_omissao_demanda !== 'undefined' ? unicodeToChar(config.notificacao_texto_omissao_demanda).replace(/\\n/g, '\n') : notificacaoTexto.omissao_demanda) + '</textarea>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '               </div>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_sincronizacao">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-sync cinzaColor"></i>Sincroniza\u00E7\u00E3o</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-flag cinzaColor"></i> Gerar relat\u00F3rios gerenciais di\u00E1rios</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="gerar_relatorios_gerenciais" class="onoffswitch-checkbox singleOptionConfig" id="gerar_relatorios_gerenciais" tabindex="0" ' + (config && typeof config.gerar_relatorios_gerenciais !== 'undefined' && config.gerar_relatorios_gerenciais ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="gerar_relatorios_gerenciais"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-exchange-alt cinzaColor"></i> Sincronizar dados com sistemas externos</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="sincronizar_dados_externos" data-act="atividades-call" data-fn="changeConfigOptions" data-ref="configEntidade_acoes_dados_externos" class="onoffswitch-checkbox singleOptionConfig" id="sincronizar_dados_externos" tabindex="0" ' + (config && typeof config.sincronizar_dados_externos !== 'undefined' && config.sincronizar_dados_externos ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="sincronizar_dados_externos"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr id="configEntidade_acoes_dados_externos" style="' + (config && typeof config.sincronizar_dados_externos !== 'undefined' && config.sincronizar_dados_externos ? '' : 'display:none;') + '">' +
            '                      <td style="text-align: left;vertical-align: top;" colspan="2">' +
            '                           <input type="text" style="margin: 0 !important;" class="singleOptionConfig" data-key="acoes_dados_externos" id="acoes_dados_externos" value="' + (config && typeof config.acoes_dados_externos !== 'undefined' && config.acoes_dados_externos != '' ? config.acoes_dados_externos : '') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;" colspan="2">' +
            '                           <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                              <tr style="height: 40px;">' +
            '                                  <td style="text-align: left;">' +
            '                                       <i class="iconPopup fas fa-database cinzaColor"></i> Dura\u00E7\u00E3o do mecanisco de armazenamento em cache das demandas' +
            '                                  </td>' +
            '                                  <td style="width: 250px;">' +
            '                                      <input type="number" style="width: 40% !important;" class="singleOptionConfig" data-key="cache_demandas_value" id="cache_demandas_value" value="' + (config && typeof config.cache_demandas_value !== 'undefined' && config.cache_demandas_value != '' ? config.cache_demandas_value : '1') + '">' +
            '                                      <select style="width: 40%;float: right;" class="singleOptionConfig" data-key="cache_demandas_time" id="cache_demandas_time">' +
            '                                           <option value="day" ' + (config && (typeof config.cache_demandas_time === 'undefined' || (typeof config.cache_demandas_time !== 'undefined' && config.cache_demandas_time == 'day')) ? 'selected' : '') + '>Dia</option>' +
            '                                           <option value="hour" ' + (config && typeof config.cache_demandas_time !== 'undefined' && config.cache_demandas_time == 'hour' ? 'selected' : '') + '>Hora</option>' +
            '                                           <option value="minute" ' + (config && typeof config.cache_demandas_time !== 'undefined' && config.cache_demandas_time == 'minute' ? 'selected' : '') + '>Minuto</option>' +
            '                                      </select>' +
            '                                  </td>' +
            '                              </tr>' +
            '                           </table>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-sync-alt cinzaColor"></i> Sincronizar dados de API</td>' +
            '                      <td>' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-key="sincronizar_dados_api" data-act="atividades-call" data-fn="changeConfigOptions" data-ref="configEntidade_dados_api" data-ref_type="class" class="onoffswitch-checkbox singleOptionConfig" id="sincronizar_dados_api" tabindex="0" ' + (config && typeof config.sincronizar_dados_api !== 'undefined' && config.sincronizar_dados_api ? 'checked' : '') + '>' +
            '                              <label class="onoff-switch-label" for="sincronizar_dados_api"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr class="configEntidade_dados_api" style="height: 40px;' + (config && typeof config.sincronizar_dados_api !== 'undefined' && config.sincronizar_dados_api ? '' : 'display:none;') + '">' +
            '                      <td style="text-align: left;" colspan="2">' +
            '                           <table style="font-size: 10pt;width: 100%; margin: 0;" class="seiProForm">' +
            '                              <tr style="height: 40px;">' +
            '                                  <td style="text-align: left;">' +
            '                                       <i class="iconPopup fas fa-sync-alt cinzaColor"></i> Frequ\u00EAncia de atualiza\u00E7\u00E3o' +
            '                                  </td>' +
            '                                  <td style="width: 250px;text-align: right;">' +
            '                                      <input type="number" style="width: 40% !important;" class="singleOptionConfig" data-key="recorrencia_value_dados_api" id="recorrencia_value_dados_api" value="' + (config && typeof config.recorrencia_value_dados_api !== 'undefined' && config.recorrencia_value_dados_api != '' ? config.recorrencia_value_dados_api : '1') + '">' +
            '                                      <select style="width: 40%;float: right;" class="singleOptionConfig" data-key="recorrencia_time_dados_api" id="recorrencia_time_dados_api">' +
            '                                           <option value="day" ' + (config && (typeof config.recorrencia_time_dados_api === 'undefined' || (typeof config.recorrencia_time_dados_api !== 'undefined' && config.recorrencia_time_dados_api == 'day')) ? 'selected' : '') + '>Dia</option>' +
            '                                           <option value="week" ' + (config && typeof config.recorrencia_time_dados_api !== 'undefined' && config.recorrencia_time_dados_api == 'week' ? 'selected' : '') + '>Semana</option>' +
            '                                           <option value="month" ' + (config && typeof config.recorrencia_time_dados_api !== 'undefined' && config.recorrencia_time_dados_api == 'month' ? 'selected' : '') + '>M\u00EAs</option>' +
            '                                      </select>' +
            '                                  </td>' +
            '                              </tr>' +
            '                           </table>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr class="configEntidade_dados_api" style="height: 40px;' + (config && typeof config.sincronizar_dados_api !== 'undefined' && config.sincronizar_dados_api ? '' : 'display:none;') + '">' +
            '                      <td style="text-align: left;" colspan="2">' +
            '                           <table style="font-size: 10pt;width: 100%; margin: 0;" class="seiProForm">' +
            '                              <tr style="height: 40px;">' +
            '                                  <td style="text-align: left;">' +
            '                                       <i class="iconPopup fas fa-inbox cinzaColor"></i> Enviar dados j\u00E1 arquivados' +
            '                                  </td>' +
            '                                  <td style="width: 250px;text-align: right;">' +
            '                                       <div class="onoffswitch" style="float: right;">' +
            '                                           <input type="checkbox" name="onoffswitch" data-key="arquivados_dados_api" data-act="atividades-call" data-fn="changeConfigOptions" class="onoffswitch-checkbox singleOptionConfig" id="arquivados_dados_api" tabindex="0" ' + (config && typeof config.arquivados_dados_api !== 'undefined' && config.arquivados_dados_api ? 'checked' : '') + '>' +
            '                                           <label class="onoff-switch-label" for="arquivados_dados_api"></label>' +
            '                                       </div>' +
            // '                                      <input type="number" style="width: 40% !important;" class="singleOptionConfig" data-key="abrangencia_dados_api" id="abrangencia_dados_api" value="'+(config && typeof config.abrangencia_dados_api !== 'undefined' && config.abrangencia_dados_api != ''  ? config.abrangencia_dados_api : '0' )+'">'+
            '                                      <input type="hidden" disabled style="width: 40% !important;" class="hiddenOptionConfig" data-key="last_update_dados_api" id="last_update_dados_api" value="' + (config && typeof config.last_update_dados_api !== 'undefined' && config.last_update_dados_api != '' ? config.last_update_dados_api : moment().format('YYYY-MM-DD HH:mm:ss')) + '">' +
            '                                  </td>' +
            '                              </tr>' +
            '                           </table>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr class="configEntidade_dados_api" style="height: 40px;' + (config && typeof config.sincronizar_dados_api !== 'undefined' && config.sincronizar_dados_api ? '' : 'display:none;') + '">' +
            '                      <td style="text-align: left;" colspan="2">' +
            '                           <table style="font-size: 10pt;width: 100%; margin: 0;" class="seiProForm">' +
            '                              <tr style="height: 40px;">' +
            '                                  <td style="text-align: left;">' +
            '                                       <i class="iconPopup fas fa-university cinzaColor"></i> C\u00F3digo SIORG da Entidade' +
            '                                  </td>' +
            '                                  <td style="width: 250px;text-align: right;">' +
            '                                      <input type="text" style="width: 40% !important;" class="singleOptionConfig" data-key="siorg_dados_api" id="siorg_dados_api" value="' + (config && typeof config.siorg_dados_api !== 'undefined' && config.siorg_dados_api != '' ? config.siorg_dados_api : '0') + '">' +
            '                                  </td>' +
            '                              </tr>' +
            '                           </table>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr class="configEntidade_dados_api" style="height: 40px;' + (config && typeof config.sincronizar_dados_api !== 'undefined' && config.sincronizar_dados_api ? '' : 'display:none;') + '">' +
            '                      <td style="text-align: left;" colspan="2">' +
            '                           <table style="font-size: 10pt;width: 100%; margin: 0;" class="seiProForm">' +
            '                              <tr style="height: 40px;">' +
            '                                  <td style="text-align: left;">' +
            '                                       <i class="iconPopup fas fa-link cinzaColor"></i> URL da API' +
            '                                  </td>' +
            '                                  <td style="width: 500px;text-align: right;">' +
            '                                      <input type="text" style="width: 40% !important;" class="singleOptionConfig" data-key="url_dados_api" id="url_dados_api" value="' + (config && typeof config.url_dados_api !== 'undefined' && config.url_dados_api != '' ? config.url_dados_api : 'https://api.pgd.gestao.gov.br') + '">' +
            '                                  </td>' +
            '                              </tr>' +
            '                           </table>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr class="configEntidade_dados_api" style="height: 40px;' + (config && typeof config.sincronizar_dados_api !== 'undefined' && config.sincronizar_dados_api ? '' : 'display:none;') + '">' +
            '                      <td style="text-align: left;" colspan="2">' +
            '                           <table style="font-size: 10pt;width: 100%; margin: 0;" class="seiProForm">' +
            '                              <tr style="height: 40px;">' +
            '                                  <td style="text-align: left;">' +
            '                                       <i class="iconPopup fas fa-key cinzaColor"></i> Token de acesso' +
            '                                  </td>' +
            '                                  <td style="width: 500px;text-align: right;">' +
            '                                      <input type="text" style="width: 40% !important;" class="singleOptionConfig" data-key="token_dados_api" id="token_dados_api" value="' + (config && typeof config.token_dados_api !== 'undefined' && config.token_dados_api != '' ? config.token_dados_api : '') + '">' +
            '                                  </td>' +
            '                              </tr>' +
            '                           </table>' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idConfigBox + '_seguranca">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-shield-alt cinzaColor"></i>Seguran\u00E7a</label>' +
            '           </td>' +
            '           <td>' +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-link cinzaColor"></i> URL do SEI</td>' +
            '                      <td>' +
            '                          <input type="text" class="singleOptionConfig" data-key="sei_entidade" id="sei_entidade" value="' + (config && typeof config.sei_entidade !== 'undefined' && config.sei_entidade != '' ? config.sei_entidade : url_host.replace('controlador.php', '')) + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-shield-alt cinzaColor"></i> Tipo de pefil padr\u00E3o</td>' +
            '                      <td style="text-align: right;">' +
            '                          <select class="singleOptionConfig" data-key="tipo_perfil_padrao" data-type="number" id="tipo_perfil_padrao">' +
            '                          ' + selectPerfilOptions +
            '                          </select>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-key cinzaColor"></i> M\u00E9todo de autentica\u00E7\u00E3o</td>' +
            '                      <td>' +
            '                          <select class="singleOptionConfig" data-key="metodo_autenticacao" id="metodo_autenticacao">' +
            '                              <option value="apikey" ' + (config && (typeof config.metodo_autenticacao === 'undefined' || config.metodo_autenticacao == 'apikey') ? 'selected' : '') + '>Chave de acesso do sistema</option>' +
            // '                              <option value="google" '+(config && typeof config.metodo_autenticacao !== 'undefined' && config.metodo_autenticacao == 'google'  ? 'selected' : '')+'>Login com o Google</option>'+
            '                          </select>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fab fa-chrome cinzaColor"></i> URL da extens\u00E3o (Google Chrome)</td>' +
            '                      <td>' +
            '                          <input type="text" class="singleOptionConfig" data-key="extensao_chrome" id="extensao_chrome" value="' + (config && typeof config.extensao_chrome !== 'undefined' && config.extensao_chrome != '' ? config.extensao_chrome : '') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fab fa-firefox cinzaColor"></i> URL da extens\u00E3o (Mozilla Firefox)</td>' +
            '                      <td>' +
            '                          <input type="text" class="singleOptionConfig" data-key="extensao_firefox" id="extensao_firefox" value="' + (config && typeof config.extensao_firefox !== 'undefined' && config.extensao_firefox != '' ? config.extensao_firefox : '') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-chart-line cinzaColor"></i> URL do Painel BI</td>' +
            '                      <td>' +
            '                          <input type="text" class="singleOptionConfig" data-key="painel_bi" id="painel_bi" value="' + (config && typeof config.painel_bi !== 'undefined' && config.painel_bi != '' ? config.painel_bi : '') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="text-align: left;"><i class="iconPopup fas fa-calendar cinzaColor"></i> URL do calend\u00E1rio (gmail) para afastamentos autom\u00E1ticos de reuni\u00F5es</td>' +
            '                      <td>' +
            '                          <input type="text" class="singleOptionConfig" data-key="sync_calendario" id="sync_calendario" value="' + (config && typeof config.sync_calendario !== 'undefined' && config.sync_calendario != '' ? config.sync_calendario : '') + '">' +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label><i class="iconPopup iconSwitch fas fa-flask cinzaColor"></i>Funcionalidades Beta:</label>' +
            '           </td>' +
            '           <td>' +
            '               <div class="tabelaPanelScroll">' +
            '               <table id="configBox_unidades" data-format="obj" data-key="unidades" style="font-size: 8pt !important;width: 100%;' + (unidades && !unidades.length ? 'margin-bottom:80px;' : '') + '" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
            '                    <thead>' +
            '                       <tr>' +
            '                           <th colspan="2" style="text-align: right;">' +
            '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Adicionar novo item' +
            '                               </a>' +
            '                           </th>' +
            '                       </tr>' +
            '                        <tr class="tableHeader">' +
            '                            <th class="tituloControle">Unidade</th>' +
            '                            <th class="tituloControle" style="display:none">ID</th>' +
            '                            <th class="tituloControle" style="width: 50px;"></th>' +
            '                        </tr>' +
            '                    </thead>' +
            '                    <tbody>';
        if (unidades) {
            $.each(unidades, function (i, v) {
                htmlBox += '                        <tr data-index="' + i + '" data-id="' + v.id_unidade + '" data-value="' + v.id_unidade + '" data-key="unidades" data-unique="true" style="text-align: left;">' +
                    '                            <td class="editCellSelect" data-type="value" data-key="nome_unidade" style="padding: 0 10px;">' + unicodeToChar(v.nome_unidade) + '</td>' +
                    '                            <td class="" data-type="num" data-key="id_unidade" style="padding: 0 10px;display:none;">' + v.id_unidade + '</td>' +
                    '                            <td style="width: 50px; text-align: center;">' +
                    '                                 <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
                    '                            </td>' +
                    '                        </tr>';
            });
        }
        htmlBox += '                        <tr data-index="' + (unidades ? unidades.length : 0) + '" data-id="new" data-value="" data-key="unidades" data-unique="true" style="text-align: left;">' +
            '                            <td class="editCellSelect" data-type="value" data-key="nome_unidade" style="padding: 0 10px;"></td>' +
            '                            <td class="" data-type="num" data-key="id_unidade" style="padding: 0 10px;display:none;"></td>' +
            '                            <td style="width: 50px; text-align: center;">' +
            '                                 <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRowByID"></i>' +
            '                            </td>' +
            '                        </tr>' +
            '                    </tbody>' +
            '                </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '</div>';
    }
    if (htmlBox != '') {
        var homologado = data.type == 'planos' ? jmespath.search(tableConfigList[data.type], "[?id_plano==`" + data.id + "`] | [0].homologado") : false;
        homologado = data.type == 'programas' ? callAtiv('checkHomologadoEntregasPrograma',jmespath.search(tableConfigList[data.type], "[?id_programa==`" + data.id + "`] | [0]")) : homologado;
        let width = 780;
        width = (data.type == 'programas') ? 950 : width;
        width = data.type == 'planos' || data.type == 'entidades' || (data.type == 'programas' && homologado) ? ($(window).width() - 50 > 1250 ? 1250 : $(window).width() - 50) : width;
        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: titleBox,
                width: width,
                open: function () {
                    updateButtonConfirm(this, true);
                    if ($('#' + idConfigBox + '_tabs').length > 0) {
                        $('#' + idConfigBox + '_tabs').tabs();
                    }
                    if ($('#' + idConfigBox + '_tabs_mes').length > 0) {
                        $('#' + idConfigBox + '_tabs_mes').tabs();
                    }
                    setTimeout(function () {
                        checkInternalWidthDialogBox();
                        centralizeDialogBox(dialogBoxPro);
                    }, 100);
                    if (data.type == 'entidades') {
                        $('#acoes_dados_externos').tagsInput({
                            interactive: true,
                            placeholder: 'Adicionar',
                            hide: true,
                            delimiter: [','],
                            unique: true,
                            removeWithBackspace: true,
                        });
                    }
                    if (data.type == 'planos') {
                        loadConfigAtivIntegral('#configBox_lista_atividades', id);
                        $('.alertaBoxDisplay .infoText').each(function () {
                            $(this).html(callAtiv('alertDistCargaHoraria',$(this)).html);
                        });
                        // let homologado = jmespath.search(tableConfigList[data.type],"[?id_plano==`"+data.id+"`] | [0].homologado");
                        if (homologado) $(this).dialog('option', 'buttons', false);
                    } else if (data.type == 'programas') {
                        // let homologado = jmespath.search(tableConfigList[data.type],"[?id_programa==`"+data.id+"`] | [0].homologado");
                        if (homologado) $(this).dialog('option', 'buttons', false);
                    }
                    if ($('.tabelaConfigPanel_' + data.type + '_scroll').length > 0) {
                        $('.tabelaConfigPanel_' + data.type + '_scroll').each(function () {
                            // console.log(data.type, $(this).find('table tbody tr').length);
                            var _this = $(this);
                            if (_this.find('table tbody tr').length > 6) {
                                var idElem = _this.attr('id');
                                _this.addClass('tabelaPanelScroll').css('height', '300px;');
                                initPanelResize('#' + idElem, idElem);
                            }
                        })
                    }
                    initClassicEditor();
                    if ($('#accordion-' + data.type).length) $('#accordion-' + data.type).accordion({
                        active: false,
                        collapsible: true,
                        heightStyle: "content"
                    });
                    initChosenReplace('box_init', this, true);
                    setFunctionsEditConfigOptions(idConfigBox, data);
                },
                close: function () {
                    if (_this.closest('tr').hasClass('infraTrMarcada')) {
                        $('#tableConfiguracoesPanel_' + data.type).find('.lnkInfraCheck').data('index', 1).trigger('click');
                    }
                    $('#' + idConfigBox).remove();
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: (data.type == 'tipos_capacidades' || data.type == 'perfis') ? []
                    : [{
                        id: 'btnSalvarOptions_' + data.type,
                        text: 'Salvar',
                        class: 'confirm',
                        click: function (event) {
                            saveOptionConfigItem(this, data.type, id);
                        }
                    }]
            });
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'N\u00E3o dispon\u00EDvel!');
    }
}
export function tableConfigKeyUsers(value) {
    var htmlBox = '               <table id="configBox_keys" data-id="' + value.id_user + '" style="font-size: 8pt !important;width: 100%;" class="tableOptionConfig seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
        '                    <thead>' +
        '                       <tr data-id="-1">' +
        '                           <th colspan="3" style="text-align: right;">' +
        (!callAtiv('checkCapacidade','config_update_keys_new') ? '' :
            '                               <a class="newLink" data-act="atividades-call" data-fn="configUpdateKey" data-arg="new_key" style="cursor: pointer; margin: 5px;display: inline-block;">' +
            '                                   <i class="fas fa-plus-circle cinzaColor" data-icon="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
            '                                   Criar nova chave' +
            '                               </a>' +
            '') +
        '                           </th>' +
        '                       </tr>' +
        '                        <tr class="tableHeader">' +
        '                            <th class="tituloControle" style="width: 80px;">ID</th>' +
        '                            <th class="tituloControle">Status</th>' +
        '                            <th class="tituloControle" style="min-width: 250px;">A\u00E7\u00F5es</th>' +
        '                        </tr>' +
        '                    </thead>' +
        '                    <tbody>';
    var keys = (value.keys !== null && typeof value.keys !== 'undefined') ? value.keys : false;
    if (keys) {
        $.each(keys, function (i, v) {
            var check_status = (v.data_fim == '0000-00-00 00:00:00' || moment(v.data_fim, 'YYYY-MM-DD HH:mm:ss') > moment()) ? true : false;
            var status = '<span class="info_tags_follow">' +
                '   <span style="background-color: #bfe8c4; ' + (!check_status ? 'display:none;' : '') + '" class="tag_text keyVigente"><i class="tagicon fas fa-key" style="font-size: 90%;margin: 0 2px;color: #408743;"></i> Vigente</span>' +
                '   <span style="' + (check_status ? 'display:none;' : '') + '" class="tag_text urgenteBoxDisplay keyRevogada"><i class="tagicon fas fa-key" style="font-size: 90%;margin: 0 2px;color: #c24242;"></i> Revogada</span>' +
                '</span>';
            var btn_revoga = (!callAtiv('checkCapacidade','config_update_keys_disable')) ? '' : '<a class="newLink keyVigente keyRevoke" style="font-size: 10pt; cursor:pointer; ' + (!check_status ? 'display:none;' : '') + '" data-act="atividades-call" data-fn="configUpdateKey" data-arg="disable_key"><i class="fas fa-user-slash" data-icon="fas fa-user-slash" style="font-size: 100%;"></i>Revogar</a>';
            var btn_email = (!callAtiv('checkCapacidade','config_update_keys_resend')) ? '' : '<a class="newLink keyVigente keyResend" style="font-size: 10pt; cursor:pointer; ' + (!check_status ? 'display:none;' : '') + '" data-act="atividades-call" data-fn="configUpdateKey" data-arg="resend_key"><i class="fas fa-envelope-open-text" data-icon="fas fa-envelope-open-text" style="font-size: 100%;"></i>Reenviar</a>';

            htmlBox += '                        <tr data-index="' + i + '" data-id="' + v.id_hash + '" data-value="' + v.data_fim + '" style="text-align: left;">' +
                '                            <td data-type="value" data-key="id_hash" style="padding: 0 10px;">ID:' + v.id_hash + '</td>' +
                '                            <td data-type="value" data-key="status" style="padding: 0 10px;">' + status + '</td>' +
                '                            <td data-type="value" data-key="actions" style="padding: 0 10px; text-align: right;">' + btn_revoga + btn_email + '</td>' +
                '                        </tr>';
        });
    }
    htmlBox += '                    </tbody>' +
        '                </table>';
    return htmlBox;
}
export function setFunctionsEditConfigOptions(idConfigBox, data) {
    setTimeout(function () {
        configBox = new SimpleTableCellEditor(idConfigBox);
        configBox.SetEditableClass("editCell");
        configBox.SetEditableClass("editCellSEI", {
            validation: $.isNumeric,
            internals: {
                renderEditor: (elem, oldVal) => {
                    $(elem).html('<input type="number" data-act="atividades-call" data-fn="checkOptionConfigSEI" style="max-width: 80%;" value="' + oldVal + '">').find('input').focus();
                },
                renderValue: (elem, formattedNewVal) => {
                    let _this = $(elem);
                    let _parent = _this.closest('.ui-tabs-panel');
                    let key = _this.data('key');
                    key = typeof key !== 'undefined' ? key : false;

                    _this.text(formattedNewVal);
                    if (key == 'descricao_entrega') _parent.find('.alertaBoxDisplay .infoText').html(callAtiv('alertDistCargaHoraria',_this).html);
                }
            }
        });
        configBox.SetEditableClass("editCellNum", {
            validation: $.isNumeric,
            internals: {
                renderEditor: (elem, oldVal) => {
                    var min = typeof $(elem).data('min') !== 'undefined' ? ' min="' + $(elem).data('min') + '"' : '';
                    var max = typeof $(elem).data('max') !== 'undefined' ? ' max="' + $(elem).data('max') + '"' : '';
                    var input = min != '' && max != '' ? ' data-input-filter="clamp-minmax"' : '';
                    $(elem).html('<input type="number" style="max-width:none" ' + min + ' ' + max + ' ' + input + ' value="' + oldVal + '">').find('input').focus();
                },
                renderValue: (elem, formattedNewVal) => {
                    let _this = $(elem);
                    let _tr = _this.closest('tr');
                    let _parent = _this.closest('.ui-tabs-panel');
                    let key = _this.data('key');
                    key = typeof key !== 'undefined' ? key : false;

                    _this.text(formattedNewVal);
                    if (key == 'carga_horaria_entrega') {
                        var totalVal = parseInt(_parent.find('.totalTempoProporcionalEntrega').text());
                        var percentVal = (parseFloat(formattedNewVal) / 100);
                        var parcialVal = (totalVal * percentVal).toFixed(2);
                        _parent.find('.alertaBoxDisplay .infoText').html(callAtiv('alertDistCargaHoraria',_this).html);
                        _tr.find('.tempoProporcionalEntrega').text(parcialVal);
                    }
                }
            }
        });
        configBox.SetEditableClass("editCellNumInt", {
            validation: $.isNumeric,
            internals: {
                renderEditor: (elem, oldVal) => {
                    $(elem).html('<input type="number" step="1" style="max-width:none" value="' + oldVal + '">').find('input').focus();
                },
                renderValue: (elem, formattedNewVal) => {
                    let _this = $(elem);
                    let _tr = _this.closest('tr');
                    let _parent = _this.closest('.ui-tabs-panel');
                    let key = _this.data('key');
                    key = typeof key !== 'undefined' ? key : false;

                    _this.text(formattedNewVal);
                    if (key == 'tempo_acrescimo') {
                        var _table = _parent.find('table[data-key="planos_acrescimo"]');
                        var id_plano = _this.closest('.atividadeWork').attr('data-plano');
                        id_plano = typeof id_plano !== 'undefined' ? id_plano : false;
                        var acrescimo_maximo_jornada = callAtiv('checkOptionEntidade','acrescimo_maximo_jornada') ? callAtiv('getOptionEntidade','acrescimo_maximo_jornada') : 25;
                        var totalVal = _parent.find('td[data-key="tempo_acrescimo"]').map(function () { return parseFloat($(this).text()) }).get().reduce(function (a, b) { return a + b; }, 0);
                        var value = id_plano ? callAtiv('getPlanoData',id_plano) : false;
                        var tempo_acrescimo = value && typeof value.planos_acrescimo !== 'undefined' && typeof value.planos_acrescimo.lista !== 'undefined' && value.planos_acrescimo.lista.length ? value.planos_acrescimo.lista.map(function (v) { return v.tempo_acrescimo }).reduce(function (a, b) { return a + b; }, 0) : 0;
                        var tempoProporcional = value ? value.tempo_proporcional - tempo_acrescimo : false;
                        var tempoMaxAcrescimo = tempoProporcional ? tempoProporcional * (parseFloat(acrescimo_maximo_jornada) / 100) : false;
                        var tempoLimite = tempoMaxAcrescimo ? tempoMaxAcrescimo - tempo_acrescimo : false;
                        var infoTempoLimite = `<div style="text-align: center;margin-top: 20px;" id="infoTempoLimite">
                                                   <span style="font-size: 10pt; white-space: nowrap;text-align: center;padding: 10px;display: inline-block;background: #f9efad;border-radius: 5px;color: #666;margin: 10px;" class="alertaBoxDisplay">
                                                       <i class="fas fa-info-circle azulColor" style="margin: 0 5px; font-size: 10pt;"></i>
                                                       <span class="infoText">Tempo acrescido maior que o permitido para acr\u00E9scimo de jornada extraordin\u00E1ria (${acrescimo_maximo_jornada}% = ${tempoMaxAcrescimo} horas)<br>Tempo final ajustado automaticamente (${tempoLimite} horas)</span>
                                                   </span>
                                                </div'`;
                        $('#infoTempoLimite').remove();
                        if (tempoProporcional && totalVal > tempoMaxAcrescimo) {
                            // console.log('OKOK');
                            _table.find('tbody tr:last-child td[data-key="tempo_acrescimo"]').text(tempoLimite);
                            _table.after(infoTempoLimite);
                        }
                        // console.log(value.tempo_proporcional, tempo_acrescimo, tempoProporcional, tempoMaxAcrescimo, totalVal, tempoLimite);
                    }
                }
            }
        });
        configBox.SetEditableClass("editCellDate", {
            internals: {
                renderEditor: (elem, oldVal) => {
                    var oldVal_ = (oldVal == '') ? moment().format('YYYY-MM-DD') : moment(oldVal, 'DD/MM/YYYY').format('YYYY-MM-DD');
                    $(elem).html('<input type="date" style="max-width:none" value="' + oldVal_ + '">').find('input').focus();
                },
                renderValue: (elem, formattedNewVal) => {
                    $(elem).text(formattedNewVal);
                },
                extractEditorValue: (elem) => {
                    var value = $(elem).find('input').val();
                    return value != '' ? moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY') : '';
                },
            }
        });
        configBox.SetEditableClass("editCellCPF", {
            internals: {
                renderEditor: (elem, oldVal) => {
                    $(elem).html('<input type="text" style="max-width: 80%;" value="' + oldVal + '">').find('input').mask("999.999.999-99").focus();
                }
            }
        });
        configBox.SetEditableClass("editCellCNPJ", {
            internals: {
                renderEditor: (elem, oldVal) => {
                    $(elem).html('<input type="text" style="max-width: 80%;" value="' + oldVal + '">').find('input').mask("99.999.999/9999-99").focus();
                }
            }
        });
        configBox.SetEditableClass("editCellPhone", {
            internals: {
                renderEditor: (elem, oldVal) => {
                    $(elem).html('<input type="text" style="max-width: 80%;" value="' + oldVal + '">').find('input').mask("(99) 99999-9999").focus();
                }
            }
        });
        configBox.SetEditableClass("editCellPEN", {
            internals: {
                renderEditor: (elem, oldVal) => {
                    $(elem).html('<input type="text" style="max-width: 80%;" value="' + oldVal + '">').find('input').mask("99999.999999/9999-99").focus();
                }
            }
        });
        configBox.SetEditableClass("editCellDatetime", {
            internals: {
                renderEditor: (elem, oldVal) => {
                    $(elem).html('<input type="datetime-local" style="max-width:none" value="' + moment(oldVal, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + '">').find('input').focus();
                },
                renderValue: (elem, formattedNewVal) => {
                    $(elem).text(formattedNewVal);
                },
                extractEditorValue: (elem) => {
                    return moment($(elem).find('input').val(), 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss');
                },
            }
        });
        configBox.SetEditableClass("editCellMonth", {
            internals: {
                renderEditor: (elem, oldVal) => {
                    var oldVal_ = (oldVal == '') ? moment().format('YYYY-MM-DD') : moment(oldVal, 'DD/MM').format('YYYY-MM-DD');
                    $(elem).html('<input type="date" style="max-width:none" value="' + oldVal_ + '">').find('input').focus();
                },
                renderValue: (elem, formattedNewVal) => {
                    $(elem).text(formattedNewVal);
                },
                extractEditorValue: (elem) => {
                    return moment($(elem).find('input').val(), 'YYYY-MM-DD').format('DD/MM');
                },
            }
        });
        configBox.SetEditableClass("editCellNumComplex", {
            validation: $.isNumeric,
            internals: {
                renderEditor: (elem, oldVal) => {
                $(elem).html('<input type="number" min="0.1" step=".1" data-act="atividades-call" data-fn="checkOptionConfigComplex" data-on="input,blur" style="max-width:none" value="' + oldVal + '" name="editCellNumComplex">').find('input').focus();
                }
            }
        });
        configBox.SetEditableClass("editCellSelect", {
            internals: {
                renderEditor: (elem, oldVal) => {
                    var _this = $(elem);
                    var data_elem = _this.data();
                    var data_tr = _this.closest('tr').data();
                    var old_width = _this.css('width');
                    var arrayList = (data_tr.key == 'documentos' || data_tr.key == 'tipo_documento') ? arrayListTypesSEI.selSeriePesquisa : [];
                    arrayList = (data_tr.key == 'tipo_processo') ? arrayListTypesSEI.selectTipoProc : arrayList;
                    // arrayList = (data_tr.key == 'lotacao') ? jmespath.search(arrayConfigAtividades.unidades_all,"[*].{name: join('',[nome_unidade,' (',sigla_unidade,')']), value: id_unidade}") : arrayList;
                    arrayList = (data_tr.key == 'perfil') ? jmespath.search(arrayConfigAtividades.perfis, "[*].{name: nome_perfil, nivel: nivel, value: id_perfil}") : arrayList;
                    arrayList = (data_tr.key == 'tipos_eixos') ? jmespath.search(arrayConfigAtividades.tipos_eixos, "[*].{name: nome_eixo, value: id_tipo_eixo}") : arrayList;
                    arrayList = (data_tr.key == 'entregas') ? jmespath.search(arrayConfigAtividades.entregas, "[*].{name: nome_entrega_sigla, value: id_entrega}") : arrayList;
                    arrayList = (data_tr.key == 'avaliacoes_justificativas') ? jmespath.search(arrayConfigAtividades.tipos_justificativas, "[*].{name: nome_justificativa, value: id_tipo_justificativa}") : arrayList;
                    arrayList = (data_tr.key == 'entregas_programa') ? jmespath.search(tableConfigList.planos, "[?id_plano==`" + data_tr.id_plano + "`].entregas_programa | [0] | [*].{name: nome_entrega_sigla, value: id_entrega}") : arrayList;
                    arrayList = (data_tr.key == 'tipos_entregas') ? jmespath.search(arrayConfigAtividades.tipos_entregas, "[*].{name: nome_tipo_entrega, value: id_tipo_entrega}") : arrayList;
                    arrayList = (data_tr.key == 'modalidades') ? jmespath.search(arrayConfigAtividades.tipos_modalidades, "[*].{name: nome_modalidade, value: id_tipo_modalidade}") : arrayList;
                    arrayList = (data_tr.key == 'metadados') ? jmespath.search(arrayConfigAtividades.tipos_metadados, "[*].{name: nome_metadado, value: id_tipo_metadado, config: {lgpd: lgpd, ref_metadado: ref_metadado, tipo_metadado: tipo_metadado}}") : arrayList;
                    arrayList = (data_tr.key == 'metadados') ? arrayList.filter(function (v) {
                        let usedName = $('#configBox_metadados tr td[data-type="select_meta"]').map(function () { return $(this).text() }).get();
                        if ($.inArray(v.name, usedName) === -1) return v;
                    }) : arrayList;
                    arrayList = (data_tr.key == 'metadados' && data_elem.tipometa == 'boolean') ? [{ name: 'N\u00E3o', value: 0 }, { name: 'Sim', value: 1 }] : arrayList;
                    arrayList = (data_tr.key == 'metadados' && data_elem.tipometa == 'usuario') ? jmespath.search(arrayConfigAtividades.usuarios_entidade, "[*].{name: nome_completo, value: id_user}") : arrayList;
                    arrayList = (data_tr.key == 'metadados' && data_elem.tipometa == 'unidade') ? jmespath.search(arrayConfigAtividades.unidades_all, "[*].{name: nome_unidade, value: id_unidade}") : arrayList;
                    arrayList = (!!arrayList && data_tr.unique) ? arrayList.filter(function (v) {
                        let usedName = $('#configBox_' + data_tr.key + ' tbody tr td:first-child:not(.inEdit)').map(function () { return $(this).text() }).get();
                        usedName = typeof data_tr.uniqueClosest !== 'undefined' ? _this.closest(data_tr.uniqueClosest).find('tbody tr td:first-child:not(.inEdit)').map(function () { return $(this).text() }).get() : usedName;
                        if ($.inArray(v.name, usedName) === -1) return v;
                    }) : arrayList;

                    if (arrayList !== null && arrayList.length > 0) {
                        var selectArray = (data_tr.key == 'perfil')
                            ? jmespath.search(arrayList, "[*].{label: name, value: value, nivel: nivel}")
                            : jmespath.search(arrayList, "[*].{label: name, value: value}");
                        selectArray = (data_tr.key == 'metadados') ? jmespath.search(arrayList, "[*].{label: name, value: value, config: config}") : selectArray;
                        selectArray = selectArray.filter((v, i, a) => a.findIndex(t => (t.value === v.value)) === i);
                        var htmlOptions = $.map(selectArray, function (v) {
                            var selected = (v.label == _this.text().trim()) ? 'selected' : '';
                            var dataConfig = (typeof v.config !== 'undefined') ? "data-config='" + JSON.stringify(v.config) + "'" : "";
                            var disable = (data_tr.key == 'perfil' && arrayConfigAtividades.perfil.nivel > v.nivel) ? 'disabled' : '';
                            return "<option value='" + v.value + "' " + selected + " " + disable + " " + dataConfig + ">" + v.label + "</option>";
                        }).join('');
                    } else if (data_tr.key == 'lotacao' || data_tr.key == 'exclui_unidades' || data_tr.key == 'unidades') {
                        var htmlOptions = callAtiv('getOptionSelectPerfil',arrayConfigAtividades.unidades_all, _this.text().trim(), false);
                    } else if (data_tr.key == 'cadeia_valor') {
                        var htmlOptions = callAtiv('getOptionSelectDependencia',arrayConfigAtividades.cadeia_valor, true, data_elem.parent_id, _this.text().trim());
                    }
                    _this
                        .html(`<select data-type="` + data.type + `" data-act="atividades-call" data-fn="changeSelectConfigItem" data-on="blur"><option value=" "></option>` + htmlOptions + '</select>')
                        .find('select')
                        .chosen({
                            placeholder_text_single: ' ',
                            no_results_text: 'Nenhum resultado encontrado',
                            normalize_search_text: function (text) {
                                return removeAcentos(text.toLowerCase());
                            }
                        })
                        .on('chosen:showing_dropdown', function (evt, params) {
                            let elementScroll = $(this).closest('.tabelaPanelScroll');
                            setTimeout(() => {
                                scrollToElement(elementScroll, elementScroll.find('div.chosen-container'), elementScroll.find('.tableHeader').height());
                            }, 500);
                        });
                },
                renderValue: (elem, formattedNewVal) => {
                    let _this = $(elem);
                    let _parent = _this.closest('.ui-tabs-panel');
                    let key = _this.data('key');
                    key = typeof key !== 'undefined' ? key : false;

                    _this.text(formattedNewVal);
                    if (key == 'entregas') _parent.find('.alertaBoxDisplay .infoText').html(callAtiv('alertDistCargaHoraria',_this).html);
                },
                extractEditorValue: (elem) => {
                    return $(elem).find('select').find('option:selected').text().trim();
                },
            }
        });

        $(".tableOptionConfig.tableSortable tbody").sortable({
            items: 'tr',
            cursor: 'grabbing',
            handle: '.sorterTrConfig',
            forceHelperSize: true,
            opacity: 0.5,
            axis: 'y',
            dropOnEmpty: false,
            update: function (event, ui) {
                $(this).find('tr').each(function (index, value) {
                    $(this).attr('data-index', index).data('index', index);
                })
            }
        });

        if (typeof complexidade_len !== 'undefined' && complexidade_len == 0) {
            $('#configBox_complexidade').find('tbody tr:last-child').find('td:first-child').trigger('click');
        }
        if (typeof tipo_processo_len !== 'undefined' && tipo_processo_len == 0) {
            $('#configBox_tipo_processo').find('tbody tr:last-child').find('td:first-child').trigger('click');
        }
        if (typeof documentos_len !== 'undefined' && documentos_len == 0) {
            $('#configBox_documentos').find('tbody tr:last-child').find('td:first-child').trigger('click');
        }
    }, 500);
}
export function updateConfigPerfilCapacidade(param, ativData) {
    var key_id = tryParseJSONObject(param.key) ? JSON.parse(param.key) : false;
    var query_return = (typeof ativData['query_return'] !== 'undefined') ? ativData['query_return'][0] : false;
    var capacidade = (query_return) ? jmespath.search(query_return.lista_capacidades, "[?id_perfil==`" + key_id.id_perfil + "`] | [0]") : false;
    var id_capacidade = (capacidade) ? capacidade.id_capacidade : 0;
    loadingButtonConfirm(false);

    if (query_return && key_id) {
        $('#tableConfiguracoesPanel_tipos_capacidades tr[data-id="' + param.id + '"] td[data-key="lista_perfis"]').text(query_return.lista_perfis);

        var tr = $('.tableConfigCapacidades tr[data-id_perfil="' + key_id.id_perfil + '"][data-id="' + param.id + '"]');
        tr.find('td:first-child').removeClass('editCellLoading');
        tr.find('input').attr('data-id_capacidade', id_capacidade).prop('checked', (param.value == 'add' ? true : false));

        if (typeof tableConfigList['tipos_capacidades'] !== 'undefined') {
            objIndex = tableConfigList['tipos_capacidades'].findIndex((obj => obj['id_tipo_capacidade'] == param.id));
            if (objIndex !== -1) {
                tableConfigList['tipos_capacidades'][objIndex] = query_return;
            }
        }
        if (typeof arrayConfigAtividades['tipos_capacidades'] !== 'undefined') {
            objIndex_ = arrayConfigAtividades['tipos_capacidades'].findIndex((obj => obj['id_tipo_capacidade'] == param.id));
            if (objIndex_ !== -1) {
                arrayConfigAtividades['tipos_capacidades'][objIndex_] = query_return;
            }
        }
        $('#accordion-perfis .ui-accordion-content').each(function () {
            var count = $(this).find('.onoffswitch-checkbox:checked').length;
            var ref = $(this).attr('aria-labelledby');
            $('h3#' + ref + ' span').text(count);
        })
    }
}
export function changeConfigPerfilCapacidade(this_) {
    var _this = $(this_);
    var _data = _this.data();
    var mode = 'update';
    var type = 'tipos_capacidades';
    var value = (_this.is(':checked')) ? 'add' : 'remove';
    var key = {
        id_perfil: _data.id_perfil,
        id_capacidade: _data.id_capacidade
    }

    var action = 'config_update_tipos_capacidades';
    var param = {
        action: action,
        mode: mode,
        type: type,
        key: JSON.stringify(convertJsonBools(key)),
        value: value,
        id: _data.id
    };
    callAtiv('getConfigServer',action, param);
    _this.closest('tr').find('td').eq(0).addClass('editCellLoading');
}
export function configModalidadesLimitePlanos(this_) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        $('#configModalidades_limite_planos').hide();
        $('#limite_planos').val(0);
    } else {
        $('#configModalidades_limite_planos').show();
        $('#limite_planos').val(100);
    }
}
export function configMotivosAfastamentoIntegracao(this_) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        $('#configTiposAfast_editarintegracao').show();
    } else {
        $('#configTiposAfast_editarintegracao').hide();
    }
}
export function editModelConfigItem(this_) {
    var _this = $(this_);
    var data = _this.data();
    var _parent = _this.closest('.ui-dialog');
    var listConfig = (typeof tableConfigList[data.type] !== 'undefined' && tableConfigList[data.type].length) ? tableConfigList[data.type] : arrayConfigAtividades[data.type];
    var value = (typeof listConfig !== 'undefined' && listConfig !== null && listConfig.length) ? jmespath.search(listConfig, "[?id_" + data.type.slice(0, -1) + "==`" + data.id_reference + "`] | [0]") : false;
    value = (value !== null) ? value : false;
    var checkPlano = (data.type == 'planos') ? callAtiv('checkPlanoAntesAssinatura',value, data.type) : { check: true };

    if (!value && data.type == 'planos') {
        setTimeout(function () {
            alertaBoxPro('Error', 'exclamation-triangle', 'Nenhum plano de trabalho ativo!');
        }, 1500);
    } else if (value && !checkPlano.check && data.type == 'planos') {
        setTimeout(function () {
            alertaBoxPro('Error', 'exclamation-triangle', checkPlano.alert);
        }, 1500);
    } else if (checkPlano.check) {
        _this.append('<i class="fas fa-spinner fa-spin cinzaColor loadingDocModel"></i>');

        var action = 'view_documento';
        var param = {
            action: action,
            mode: data.mode,
            return_action: data.action,
            return_sign: data.sign,
            return_user: data.user,
            id_reference: data.id_reference,
            reference: 'modelo',
            title: data.title,
            type: data.type,
        };
        callAtiv('getConfigServer',action, param);
    }
}
export function openModelConfigItem(data, paramData) {
    var _this = $('a.' + paramData.return_action + 'ModelDoc[data-mode="' + paramData.mode + '"]');
    _this.find('i.loadingDocModel').remove();

    var param = {
        id_documento: data.id_documento,
        title_page: paramData.title,
        title: paramData.title,
        mode: paramData.mode,
        reference: paramData.reference,
        id_reference: paramData.id_reference,
        type: paramData.type,
        text: data.text
    };
    if (paramData.return_action == 'edit') {
        openEditorDoc(param, paramData);
    } else if (paramData.return_action == 'view') {
        openEditorViewDoc(param, paramData, data);
    }
    // console.log(data, param, paramData);
}
export function setParamEditorAtiv(mode, text, id_user = false, id_reference = false, type = 'planos') {
    if (mode == 'modelo_termo_adesao') {
        var user = (id_user) ? jmespath.search(arrayConfigAtividades.usuarios, "[?id_user==`" + id_user + "`] | [0]") : arrayConfigAtividades.perfil;
        user = (user == null) ? arrayConfigAtividades.perfil : user;

        var listTermos = typeof tableConfigList[type] !== 'undefined' && tableConfigList[type] !== null && tableConfigList[type].length > 0 ? tableConfigList[type] : arrayConfigAtividades[type];
        var termo = id_reference ? jmespath.search(listTermos, "[?" + listTermos[0].primarykey + "==`" + id_reference + "`] | [0]") : jmespath.search(listTermos, "[?id_user==`" + user.id_user + "`] | [0]");
        termo = (termo !== null) ? termo : jmespath.search(tableConfigList[type], "[?id_user==`" + user.id_user + "`] | [0]");
        var unidade = (termo !== null) ? jmespath.search(arrayConfigAtividades.unidades, "[?id_unidade==`" + termo.id_unidade + "`] | [0]") : arrayConfigAtivUnidade;
        var data_inicio_vigencia = termo.data_inicio_vigencia == '0000-00-00 00:00:00' ? '-' : moment(termo.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
        var data_fim_vigencia = termo.data_fim_vigencia == '0000-00-00 00:00:00' ? 'Indefinido' : moment(termo.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
        var vigencia_plano = (termo !== null) ? data_inicio_vigencia + ' \u00E0 ' + data_fim_vigencia : 'Indefinido';
        var entidade = (termo !== null) ? jmespath.search(arrayConfigAtividades.entidades, "[?id_entidade==`" + termo.id_entidade + "`] | [0]") : null;

        var data_comparecimento = (unidade.config.hasOwnProperty('planos')) ? unidade.config.planos.data_comparecimento : 'Dia';
        var prazo_comparecimento = (unidade.config.hasOwnProperty('planos')) ? parseInt(unidade.config.planos.prazo_comparecimento) : 1;
        prazo_comparecimento = (prazo_comparecimento > 1) ? prazo_comparecimento + ' ' + data_comparecimento + 's' : prazo_comparecimento + ' ' + data_comparecimento;
        var rowListaAtividades = '';

        $.each(arrayConfigAtividades.atividades, function (index, value) {
            var config_unidade = callAtiv('getConfigDadosUnidade',value.sigla_unidade);
            var complexidade = ((typeof value.config !== 'undefined' && value.config !== null && value.config.hasOwnProperty('complexidade') && value.config.complexidade.length > 0) ? jmespath.search(value.config.complexidade, "[?default==`true`].complexidade | [0]") : '');
            var parametros = ((typeof value.config !== 'undefined' && value.config !== null && value.config.hasOwnProperty('parametros') && value.config.parametros.length > 0) ? $.map(value.config.parametros, function (v) { return v[0] }).join('; ') : '');
            var entregas = ((typeof value.config !== 'undefined' && value.config !== null && value.config.hasOwnProperty('entregas') && value.config.entregas.length > 0) ? $.map(value.config.entregas, function (v) { return v[0] }).join('; ') : '');
            var arrayModalidades = (typeof value.config !== 'undefined' && value.config !== null && value.config.hasOwnProperty('modalidades') && value.config.modalidades && value.config.modalidades.length > 0) ? value.config.modalidades : config_unidade.modalidades;
            var ganho_tele = jmespath.search(arrayModalidades, "[?tipo_modalidade=='Teletrabalho'] | [0].fator");
            ganho_tele = (ganho_tele !== null) ? ganho_tele : 1;
            var ganho_presencial = jmespath.search(arrayModalidades, "[?tipo_modalidade=='Presencial'] | [0].fator");
            ganho_presencial = (ganho_presencial !== null) ? ganho_presencial : 1;
            var listUnidades = jmespath.search(arrayConfigAtividades.atividades, "[*].sigla_unidade");
            listUnidades = (listUnidades !== null) ? uniqPro(listUnidades) : [];
            var sigla_unidade = (listUnidades.length == 1 && listUnidades[0] == arrayConfigAtivUnidade.sigla_unidade) ? '' : value.sigla_unidade + ': ';

            var check_lista_integral = (termo && termo !== null && typeof termo.config !== 'undefined' && termo.config !== null &&
                termo.config.hasOwnProperty('atividades_lista_integral') && termo.config.atividades_lista_integral !== null && termo.config.atividades_lista_integral
            ) ? termo.config.atividades_lista_integral : true;

            var check_lista_atividades = (termo && termo !== null && typeof termo.config !== 'undefined' && termo.config !== null &&
                check_lista_integral == false &&
                termo.config.hasOwnProperty('lista_atividades') && termo.config.lista_atividades !== null && termo.config.lista_atividades.length > 0 &&
                $.inArray(value.id_atividade.toString(), termo.config.lista_atividades) !== -1
            ) ? true : false;

            if (check_lista_atividades || check_lista_integral) {
                rowListaAtividades += '           <tr>' +
                    '                <td>' + sigla_unidade + value.nome_atividade + '</td>' +
                    '                <td>' + unicodeToChar(complexidade) + '</td>' +
                    '                <td>' + unicodeToChar(parametros) + '</td>' +
                    '                <td>' + (value.tempo_pactuado * ganho_presencial).toFixed(2) + '</td>' +
                    '                <td>' + (value.tempo_pactuado * ganho_tele).toFixed(2) + '</td>' +
                    '                <td>' + ((1 - ganho_tele) * 100).toFixed(2) + '%' + '</td>' +
                    '                <td>' + unicodeToChar(entregas) + '</td>' +
                    '           </tr>';
            }
        });

        var tableListaAtividades = '<figure class="table" style="width:95%;">' +
            '    <table>' +
            '        <thead>' +
            '            <tr>' +
            '                <th class="trCinza">Descri\u00E7\u00E3o d' + __.a_atividade + '</th>' +
            '                <th class="trCinza">Faixa de Complexidade d' + __.a_Atividade + '</th>' +
            '                <th class="trCinza">Par\u00E2metros adotados para defini\u00E7\u00E3o da faixa de complexidade</th>' +
            '                <th class="trCinza">Tempo de execu\u00E7\u00E3o d' + __.a_atividade + ' em regime presencial</th>' +
            '                <th class="trCinza">Tempo de execu\u00E7\u00E3o d' + __.a_atividade + ' em teletrabalho</th>' +
            '                <th class="trCinza">Ganho percentual de produtividade estabelecido, quando aplic\u00E1vel</th>' +
            '                <th class="trCinza">Entregas esperadas</th>' +
            '            </tr>' +
            '        </thead>' +
            '        <tbody>' +
            '               ' + rowListaAtividades +
            '        </tbody>' +
            '    </table>' +
            '</figure>';
        // console.log({id_user: id_user, user: user, termo: termo, unidade: unidade, vigencia: vigencia_plano});

        var style_field = 'font-weight: bold;padding: 5px 8px;margin: 5px 0px;display: inline-block;background: #f5f5f5;border-radius: 5px;';
        var textResult = text;
        textResult = !!termo.nome_completo ? textResult.replace(/{nome_completo}/gi, '<span style="' + style_field + '">' + termo.nome_completo + '</span>') : textResult;
        textResult = textResult.replace(/{matricula}/gi, '<span style="' + style_field + '">' + user.matricula + '</span>');
        textResult = textResult.replace(/{vigencia_plano}/gi, '<span style="' + style_field + '">' + vigencia_plano + '</span>');
        textResult = textResult.replace(/{nome_unidade}/gi, '<span style="' + style_field + '">' + unidade.nome_unidade + '</span>');
        textResult = !!termo.nome_modalidade ? textResult.replace(/{modalidade_plano}/gi, '<span style="' + style_field + '">' + termo.nome_modalidade + '</span>') : textResult;
        textResult = textResult.replace(/{carga_horaria}/gi, '<span style="' + style_field + '">' + (termo.carga_horaria || 'Indefinido') + '</span>');
        textResult = textResult.replace(/{tempo_pactuado_total}/gi, '<span style="' + style_field + '">' + (termo.tempo_total || 'Indefinido') + '</span>');
        textResult = textResult.replace(/{nome_entidade}/gi, '<span style="' + style_field + '">' + entidade.nome_entidade + '</span>');
        textResult = textResult.replace(/{sigla_entidade}/gi, '<span style="' + style_field + '">' + entidade.sigla_entidade + '</span>');
        textResult = textResult.replace(/{prazo_comparecimento}/gi, '<span style="' + style_field + '">' + prazo_comparecimento + '</span>');
        textResult = textResult.replace(/{lista_atividades}/gi, tableListaAtividades);
        if (textResult.indexOf('{only_semipresencial}') !== -1) {
            var textFind = $('<div>' + textResult + '</div>');
            textFind.find('tr').each(function () {
                var checkFind = ($(this).text().trim().indexOf('{only_semipresencial}') !== -1) ? true : false;
                if (checkFind && termo.nome_modalidade != 'Semipresencial' && termo.nome_modalidade.indexOf('Parcial') === -1) {
                    $(this).remove();
                }
            });
            textResult = textFind[0].outerHTML;
        }
        textResult = textResult.replace(/{only_semipresencial}/gi, '');
        if (rowListaAtividades == '') alertaBoxPro('Error', 'exclamation-triangle', 'Nenhuma lista de ' + __.atividades + ' encontrada.');
        return textResult;
    }
}
export function extractDataDocument(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var arrayAtiv = {};
    _parent.find('input,textarea,select').each(function () {
        if (typeof $(this).data('key') !== 'undefined') {
            var value = $(this).val();
            var date_format = (value && value.indexOf('T') !== -1) ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
            var dataValue = ($(this).attr('type') == 'number' || (value != '' && $(this).data('key').indexOf('id_') !== -1)) ? parseInt(value) : value;
            var dataValue = ($(this).attr('type') == 'number' && parseFloat($('#ativ_tempo_despendido').attr('step')) >= 1) ? parseFloat(value) : value;
            dataValue = ($(this).attr('type') == 'date') ? (value == '' ? '' : (moment(value, date_format).format('YYYY-MM-DD') + ' 00:00:00')) : dataValue;
            dataValue = ($(this).attr('type') == 'datetime-local') ? (value == '' ? '' : moment(value, date_format).format('YYYY-MM-DD HH:mm:ss')) : dataValue;
            dataValue = ($(this).attr('type') == 'checkbox') ? ($(this).is(':checked') ? 'on' : 'off') : dataValue;
            dataValue = ($(this).is('textarea') || ($(this).is('input') && $(this).attr('type') == 'text')) ? (dataValue.replace(/["']/g, "")) : dataValue;
            arrayAtiv[$(this).data('key')] = dataValue;
        }
    });
    _parent.find('.todo-list').each(function (index, value) {
        arrayAtiv['list-' + index] = [];
        $(this).find('.todo-list__label input[type="checkbox"]').each(function (i, v) {
            if ($(this).attr('checked') == 'checked') {
                arrayAtiv['list-' + index].push($(this).closest('label').text().trim());
            }
        });
    });
    return arrayAtiv;
}
export function changeConfigOptions(this_) {
    var _this = $(this_);
    var _data = _this.data();
    var _parent = _this.closest('.ui-dialog');
    var type = typeof _data.ref_type !== 'undefined' && _data.ref_type == 'class' ? '.' : '#';
    _parent.find(type + _data.ref).each(function () {
        var _t = $(this);
        var _t_data = _t.data('ref_invert')
        var invert = typeof _t_data !== 'undefined' && _t_data ? true : false;
        if (_this.is(':checked')) {
            if (invert) _t.hide();
            else _t.show();
        } else {
            if (invert) _t.show();
            else _t.hide();
        }
    });
}
export function changeConfigAtivIntegral(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var idTableAtividades = '#configBox_lista_atividades';
    var trAtividades = _parent.find(idTableAtividades + '_tr');
    var tableAtividades = _parent.find(idTableAtividades);
    if (_this.is(':checked')) {
        trAtividades.hide();
        tableAtividades.find('tbody').html('');
    } else {
        trAtividades.show();
        loadConfigAtivIntegral(idTableAtividades);
    }
}
export function loadConfigAtivIntegral(idTableAtividades, id_plano = false) {
    var trAtividades = $(idTableAtividades + '_tr');
    // console.log(trAtividades.is(':visible'));
    if (trAtividades.is(':visible')) {
        var tableAtividades = $(idTableAtividades);
        var listUnidades = jmespath.search(arrayConfigAtividades.atividades, "[*].sigla_unidade");
        listUnidades = (listUnidades !== null) ? uniqPro(listUnidades) : [];

        var plano = (id_plano) ? jmespath.search(arrayConfigAtividades.planos, "[?id_plano==`" + id_plano + "`] | [0]") : false;
        var modalidade = (plano && plano !== null) ? jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?id_tipo_modalidade==`" + plano.id_tipo_modalidade + "`] | [0]") : null;
        var modalidade_config = modalidade !== null && modalidade.hasOwnProperty('config') && typeof modalidade.config !== 'undefined' && modalidade.config !== null ? modalidade.config : false;
        var atividades_homologadas = (modalidade && modalidade !== null && modalidade.hasOwnProperty('config') && modalidade_config !== null && modalidade_config.hasOwnProperty('atividades_homologadas') && modalidade_config.atividades_homologadas !== null && modalidade_config.atividades_homologadas == true) ? true : false;
        var atividades = (atividades_homologadas) ? jmespath.search(arrayConfigAtividades.atividades, "[?homologado==`true`]") : arrayConfigAtividades.atividades;
        if (atividades !== null) {
            var htmlAtividades = $.map(atividades, function (value, index) {
                var sigla_unidade = (listUnidades.length == 1 && listUnidades[0] == arrayConfigAtivUnidade.sigla_unidade) ? '' : value.sigla_unidade + ': ';
                var input_checked = (plano && typeof plano.config !== 'undefined' && plano.config !== null &&
                    typeof plano.config.atividades_lista_integral !== 'undefined' && plano.config.atividades_lista_integral == false &&
                    typeof plano.config.lista_atividades !== 'undefined' && plano.config.lista_atividades !== null && plano.config.lista_atividades.length > 0 &&
                    $.inArray(value.id_atividade.toString(), plano.config.lista_atividades) !== -1
                ) ? 'checked' : false;
                var tr_checked = (input_checked) ? 'infraTrMarcada' : '';
                return '<tr class="' + tr_checked + '">' +
                    '   <td data-key="id_atividade" data-type="switch">' +
                    '       <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_atividade + '" name="configuracoesPro" value="' + value.id_atividade + '" ' + input_checked + '>' +
                    '   </td>' +
                    '   </td>' +
                    '   <td style="text-align: left;">' + sigla_unidade + value.nome_atividade + '</td>' +
                    '   <td>' + value.tempo_pactuado + '</td>' +
                    '</tr>';
            }).join('');

            tableAtividades.find('tbody').html(htmlAtividades);
            tableAtividades.tablesorter({
                sortLocaleCompare: true,
                headers: {
                    0: { sorter: false, filter: false },
                    1: { filter: true },
                    2: { filter: true }
                }
            }).on("sortEnd", function (event, data) {
                checkboxRangerSelectShift(idTableAtividades);
            });
            checkboxRangerSelectShift(idTableAtividades);
        }
    }
}
export function changeConfigGanhoUnidade(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var tableModalidades = _parent.find('#configBox_modalidades_atividade');
    if (_this.is(':checked')) {
        tableModalidades.find('.addConfigItem').trigger('click');
        tableModalidades.find('tbody tr:not(:last-child)').remove();
        tableModalidades.hide();
    } else {
        tableModalidades.show();
    }
}
export function changeConfigListaUnidade(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    if (_this.is(':checked')) {
        _parent.find('#tr_lista_unidade').show();
    } else {
        _parent.find('#select_lista_unidade').val('');
        _parent.find('#tr_lista_unidade').hide();
    }
}
export function htmlOptionsAddTextarea(target, text) {
    return '<a class="newLink newLink_active" data-target="' + target + '" data-value="' + text + '" data-tip="Clique para adicionar" data-act="atividades-call" data-fn="optionAddTextToTextarea" style="font-size: 8pt;cursor: pointer;margin: 3px;">' + text + '</a>';
}
export function optionAddTextToTextarea(this_) {
    var _this = $(this_);
    var target = $('#' + _this.data('target'));
    var text = _this.data('value');
    addTextToTextarea(_this, target, text);
}
export function removeConfigRowByID(this_) {
    var _this = $(this_);
    var _parent = _this.closest('tr');
    var _table = _this.closest('table');
    confirmaBoxPro('Tem certeza que deseja excluir este item?', function () {
        if (_table.find('tbody tr').length == 1) {
            _table.find('.addConfigItem').trigger('click');
        }
        _parent.find('td:visible').effect('highlight').delay(2).effect('highlight').delay(2).effect('highlight');
        _parent.delay(8).hide('fast', function () {
            $(this).attr('data-value', 'remove').data('value', 'remove').hide().find('td').eq(0).text('');
            if (_parent.data('key') == 'entregas_programa') _parent.closest('.ui-tabs-panel').find('.alertaBoxDisplay .infoText').html(callAtiv('alertDistCargaHoraria',_this).html);
        });
    }, 'Excluir');
}
export function removeConfigRow(this_) {
    var _this = $(this_);
    var _parent = _this.closest('tr');
    var _table = _this.closest('table');
    confirmaBoxPro('Tem certeza que deseja excluir este item?', function () {
        if (_table.find('tbody tr').length == 1) {
            _table.find('.addConfigItem').trigger('click');
        }
        _parent.find('td:visible').effect('highlight').delay(2).effect('highlight').delay(2).effect('highlight');
        _parent.delay(8).hide('fast', function () {
            $(this).remove();
            if ($('#ativ_checklist').length > 0) {
                callAtiv('changeAtivChecklistInput',$('#trAtivChecklist .addConfigItem')[0]);
            }
        });
    }, 'Excluir');
}
export function changeHorasDesconto(this_) {
    var _this = $(this_);
    var _parent = _this.closest('tr');
    var feriado_data = _parent.find('td[data-key="horas_desconto"]');
    if (_this.is(':checked')) {
        feriado_data.addClass('editCellNum').text(4);
        feriado_data.trigger('click');
    } else {
        feriado_data.removeClass('editCellNum').text('');
    }
}
export function changeConfigFeriadoRecorrente(this_) {
    var _this = $(this_);
    var _parent = _this.closest('tr');
    var feriado_data = _parent.find('td[data-key="feriado_data"]');
    if (_this.is(':checked')) {
        feriado_data.attr('class', 'editCellMonth');
    } else {
        feriado_data.attr('class', 'editCellDate');
    }
    if (!feriado_data.hasClass('inEdit')) {
        var text_format = (_this.is(':checked'))
            ? moment(feriado_data.text(), 'DD/MM/YYYY').format('DD/MM')
            : moment(feriado_data.text(), 'DD/MM').format('DD/MM/YYYY');
        text_format = (feriado_data.text().trim() != '') ? text_format : '';
        feriado_data.text(text_format);
    }
}
export function configUpdateKey(this_, mode) {
    if (mode == 'disable_key') {
        confirmaFraseBoxPro('Tem certeza que deseja revogar a chave de acesso?', 'REVOGAR',
            function () {
                configServerKey(this_, mode);
            }
        );
    } else if (mode == 'new_key') {
        if ($(this_).closest('table').find('.keyVigente').is(':visible')) {
            confirmaFraseBoxPro('Criar uma nova chave ir\u00E1 revogar as anteriores. Tem certeza que deseja prosseguir?', 'CRIAR',
                function () {
                    configServerKey(this_, mode);
                }
            );
        } else {
            configServerKey(this_, mode);
        }
    } else if (mode == 'resend_key') {
        configServerKey(this_, mode);
    }
}
export function changeConfigItemCell(this_) {
    var _this = $(this_);
    var tr = _this.closest('tr');
    var table = _this.closest('table');
    setTimeout(function () {
        /*table.find('tr').each(function(){
            var td = $(this).find('td').eq(0);
            if (td.text().trim() == '') {
                td.addClass('editCellBlank');
            } else {
                td.removeClass('editCellBlank');
            }
        });*/
        if (tr.find('td').length == 2 && tr.data('index') == table.find('tbody tr').length - 1 && _this.text().trim() != '') {
            callAtiv('addConfigItem',this_);
        }
    }, 100);
}
export function checkOptionConfigComplex(this_) {
    var _this = $(this_);
    var value = _this.val();
    value = (value == '' || parseFloat(result) < 0.1) ? 0.1 : value;
    var tempo_pactuado = _this.closest('table').data('tempo-pactuado');
    var td = _this.closest('td');
    var data = td.data();
    var tr = _this.closest('tr');
    var target = (data.key == 'fator') ? tr.find('td[data-key="tempo_pactuado"]') : tr.find('td[data-key="fator"]');
    var result = (data.key == 'fator') ? (parseFloat(value) * parseFloat(tempo_pactuado)) : (parseFloat(value) / parseFloat(tempo_pactuado));
    result = (parseFloat(result) < 0.1) ? 0.1 : result;
    target.text(roundToTwo(result));
}

export function getResendKey(this_) {
    var _this = $(this_);
    _this.find('i').attr('class', 'fas fa-sync fa-spin cinzaColor');
    var action = 'config_resend_keys';
    var param = {
        action: action,
        user_sei: userSEI,
        host: url_host.replace('controlador.php', ''),
    };
    $.ajax({
        type: "POST",
        url: urlServerAtiv,
        dataType: "json",
        data: param,
        success: function (ativData) {
            loadingButtonConfirm(false);
            if (ativData.status == 0 || ativData.length == 0) {
                alertaBoxPro('Error', 'exclamation-triangle', 'Nenhum usu\u00E1rio cadastrado com seu login (' + userSEI + '). Solicite seu cadastramento ao administrador.');
                _this.find('i').attr('class', 'fas fa-exclamation-triangle vermelhoColor');
            } else {
                alertaBoxPro('Sucess', 'check-circle', 'Link de acesso reenviado com sucesso para o email do usu\u00E1rio!');
                _this.find('i').attr('class', 'fas fa-key laranjaColor');
            }
        }
    }).fail(function (data, textStatus) {
        callAtiv('failureScreen',data, textStatus, param);
    });
}
export function configResendKey(userSEI) {
    loadingButtonConfirm(true);

    var configBasePro = localStorageRestorePro('configBasePro');
    var configBaseSelected = (getOptionsPro('configBaseSelectedPro_atividades')) ? getOptionsPro('configBaseSelectedPro_atividades') : 0;
    // var dataAPI = jmespath.search(configBasePro, "[?baseTipo=='atividades'] | [?conexaoTipo=='api'||conexaoTipo=='googleapi']");
    var dataAPI = jmespath.search(configBasePro, "[?baseTipo=='atividades'] | [?conexaoTipo=='api']");
    var perfilLoginAtiv = (dataAPI && dataAPI !== null && dataAPI.length > 0 && typeof dataAPI[configBaseSelected].KEY_USER !== 'undefined')
        ? dataAPI[configBaseSelected]
        : false;

    if (perfilLoginAtiv) {
        urlServerAtiv = perfilLoginAtiv.URL_API;
        var action = 'config_resend_keys';
        var param = {
            action: action,
            user_sei: userSEI,
            host: url_host.replace('controlador.php', ''),
        };
        $.ajax({
            type: "POST",
            url: urlServerAtiv,
            dataType: "json",
            data: param,
            success: function (ativData) {
                loadingButtonConfirm(false);
                if (ativData.status == 0 || ativData.length == 0) {
                    alertaBoxPro('Error', 'exclamation-triangle', 'Nenhum usu\u00E1rio cadastrado com seu login (' + userSEI + '). Solicite seu cadastramento ao administrador.');
                } else {
                    alertaBoxPro('Sucess', 'check-circle', 'Link de acesso reenviado com sucesso para o email do usu\u00E1rio!');
                }
            }
        }).fail(function (data, textStatus) {
            callAtiv('failureScreen',data, textStatus, param);
        });
    }
}
export function configServerKey(this_, mode) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    var data = _this.closest('tr').data();
    var data_table = _parent.data();
    _this.addClass('loading').find('i').attr('class', 'fas fa-spinner fa-spin');

    var action = 'config_update_keys';
    var param = {
        action: action,
        type: 'users',
        id_user: data_table.id,
        id: data.id,
        host: url_host.replace('controlador.php', ''),
        mode: mode
    };
    // console.log(param);
    callAtiv('getConfigServer',action, param);
}
export function checkDatesLoopArray(array, inicio, fim, id_user, id_target, labels, includes = false, search_target = false, add_loop = 'days', deps = {}) {
    const runtime = getAtividadesContext();
    return domainCheckDatesLoopArray(array, inicio, fim, id_user, id_target, labels, {
        includes, searchTarget: search_target, addLoop: add_loop, moment: deps.moment || runtime.page.moment,
        search: deps.search || (runtime.page.jmespath && runtime.page.jmespath.search)
    });
}
export function checkDatesBetweenArray(array, date_target, id_user, id_target, labels, includes = false, search_target = false, add_loop = 'days', deps = {}) {
    const runtime = getAtividadesContext();
    return domainCheckDatesBetweenArray(array, date_target, id_user, id_target, labels, {
        includes, searchTarget: search_target, addLoop: add_loop, moment: deps.moment || runtime.page.moment,
        search: deps.search || (runtime.page.jmespath && runtime.page.jmespath.search)
    });
}
export function checkOptionConfigSEI(this_) {
    var _this = $(this_);
    var protocoloSEI = _this.val();
    if (protocoloSEI != '') {
        var td = _this.closest('td');
        var tr = _this.closest('tr');
        var table = _this.closest('table');
        td.addClass('editCellLoading');
        getIDProtocoloSEI(protocoloSEI,
            function (html) {
                let $html = $(html);
                var params = getParamsUrlPro($html.find('#ifrArvore').attr('src'));
                var documento_text = tr.find('td[data-key="documento"]').text();
                var nr_sei_text = protocoloSEI;
                var previewDoc = '<a class="newLink" style="cursor: pointer;" ' + atividadesDialogDocAttrs({
                    title: unicodeToChar(documento_text) + ' (' + nr_sei_text + ')',
                    id_procedimento: params.id_procedimento,
                    id_documento: params.id_documento
                }) + ' data-tip="Visualiza\u00E7\u00E3o r\u00E1pida">' +
                    '   <i class="fas fa-eye" style="font-size: 80%;"></i>' +
                    '</a>';
                td.addClass('editCellConfirm').removeClass('editCellLoading').removeClass('editCellLoadingError');
                if (typeof params.id_procedimento !== 'undefined' && params.id_procedimento !== null) tr.find('td[data-key="id_procedimento"]').text(params.id_procedimento);
                if (typeof params.id_documento !== 'undefined' && params.id_documento !== null) tr.find('td[data-key="id_documento"]').text(params.id_documento);
                tr.find('td[data-ref="previa"]').html(previewDoc);
                tr.data('value', 'new').attr('data-value', 'new');

                if (tr.data('index') == table.find('tbody tr').length - 1) {
                    callAtiv('addConfigItem',this_);
                }
            },
            function () {
                setTimeout(function () {
                    td.addClass('editCellLoadingError').removeClass('editCellLoading').removeClass('editCellConfirm');
                    alertaBoxPro('Error', 'exclamation-triangle', 'N\u00FAmero SEI n\u00E3o encontrado!');
                }, 500);
            });
    }
}
export function extractOptionConfigItem(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var param = {};
    _parent.find('.singleOptionInput').each(function (ind) {
        var _this_s = $(this);
        if (_this_s.attr('type') == 'text' && typeof _this_s.data('key') !== 'undefined') {
            var value = _this_s.val().trim();
            value = (_this_s.data('convert') == 'lowercase') ? value.toLowerCase() : value;
            value = (_this_s.data('convert') == 'uppercase') ? value.toUpperCase() : value;
            param[_this_s.data('key')] = _this_s.val().trim();
        } else if (_this_s.attr('type') == 'number' && typeof _this_s.data('key') !== 'undefined') {
            var value = _this_s.val().trim();
            param[_this_s.data('key')] = parseFloat(value);
        } else if (_this_s.is('textarea') && typeof _this_s.data('key') !== 'undefined') {
            param[_this_s.data('key')] = _this_s.val().trim();
        }
    });
    _parent.find('.singleOptionConfig').each(function (ind) {
        var _this_s = $(this);
        if (_this_s.attr('type') == 'checkbox' && typeof _this_s.data('key') !== 'undefined') {
            param[_this_s.data('key')] = _this_s.is(':checked');
        } else if (
            (_this_s.attr('type') == 'text' && typeof _this_s.data('key') !== 'undefined') ||
            (_this_s.attr('type') == 'date' && typeof _this_s.data('key') !== 'undefined') ||
            (_this_s.is('select') && typeof _this_s.data('key') !== 'undefined')
        ) {
            param[_this_s.data('key')] = (_this_s.data('type') == 'number' ? parseFloat(_this_s.val()) : _this_s.val());
        } else if (!_this_s.is('select') && _this_s.attr('type') == 'number' && typeof _this_s.data('key') !== 'undefined') {
            param[_this_s.data('key')] = parseFloat(_this_s.val());
        }
    });
    _parent.find('.hiddenOptionConfig').each(function (ind) {
        var _this_s = $(this);
        if (_this_s.attr('type') == 'hidden' && typeof _this_s.data('key') !== 'undefined') {
            var value = (_this_s.data('type') == 'json') ? JSON.parse(_this_s.val()) : _this_s.val().toString();
            param[_this_s.data('key')] = value;
        }
    });

    var optionColor = _parent.find('.singleOptionColor');
    if (optionColor.length > 0) {
        var icontag = optionColor.data('icontag');
        var textcolor = optionColor.data('textcolor');
        var colortag = optionColor.data('colortag');
        var colortags = {
            icontag: icontag,
            colortag: colortag,
            textcolor: textcolor
        };
        param['colortags'] = colortags
    }

    var _table_checkboxConfig = _parent.find('.tableCheckboxConfig');
    if (_table_checkboxConfig.length > 0) {
        var arrayCheckboxConfig = _table_checkboxConfig.find('tbody tr').map(function (v, i) {
            var checkbox = $(this).find('td').eq(0).find('input[type="checkbox"]');
            if (checkbox.is(':checked')) {
                return checkbox.val();
            }
        }).get();
        param[_table_checkboxConfig.data('key')] = arrayCheckboxConfig;
    }

    _parent.find('.tableOptionConfig').each(function (ind) {
        var data_table = $(this).data();
        var arra_table = [];
        var checkboxRequired = $(this).find('tbody tr td[data-required="true"] input[type="checkbox"]');
        if (checkboxRequired.length > 0 && !checkboxRequired.is(':checked')) {
            checkboxRequired.eq(0).prop('checked', true);
        }
        $(this).find('tbody tr').each(function (index) {
            var data_tr = $(this).data();
            var this_td = $(this).find('td');
            var obj_tr = {};
            var array_tr = [];
            if (this_td.eq(0).text() != '' || data_table.format == 'obj_mult') {
                this_td.each(function (i) {
                    var data_td = $(this).data();
                    var value = (data_td.type == 'switch')
                        ? $(this).find('input[type="checkbox"]').is(':checked') ? true : false
                        : encodeJSON_toHex($(this).text().trim());
                    value = (data_td.type == 'num' && data_table.format == 'obj_mult')
                        ? { id: data_tr.id, value: data_tr.value }
                        : value;
                    value = (data_td.type == 'num_switch' && data_table.format == 'obj_mult')
                        ? { id: data_tr.id, value: data_tr.value, config: { [this_td.find('input[type="checkbox"]').data('key')]: this_td.find('input[type="checkbox"]').is(':checked') } }
                        : value;
                    value = (data_td.type == 'select_meta' && data_table.format == 'obj_mult')
                        ?
                        {
                            id: data_tr.id,
                            id_tipo: isNumeric(data_tr.value) ? parseInt(data_tr.value) : data_tr.value,
                            value:
                                this_td.closest('tr').find('td[data-ref="value"][data-tipometa="boolean"]').length ||
                                    this_td.closest('tr').find('td[data-ref="value"][data-tipometa="usuario"]').length ||
                                    this_td.closest('tr').find('td[data-ref="value"][data-tipometa="unidade"]').length
                                    ? parseInt(this_td.closest('tr').find('td[data-ref="value"]').data('value'))
                                    : this_td.closest('tr').find('td[data-ref="value"]').text()
                        }
                        : value;
                    value = (data_td.type == 'value' && data_table.format == 'obj_mult' && typeof data_tr.id !== 'undefined' && typeof data_tr.value !== 'undefined')
                        ? { id: data_tr.id.toString(), value: data_tr.value.toString() }
                        : value;
                    value = (data_td.type == 'num' && data_table.format != 'obj_mult')
                        ? parseFloat($(this).text())
                        : value;
                    value = (data_td.type == 'value' && data_table.format != 'obj_mult')
                        ? $(this).text().trim()
                        : value;

                    if (data_table.format == 'obj' && typeof data_td.key !== 'undefined' && (value != '' || data_td.type == 'switch')) {
                        value = (data_td.type == 'text') ? value.replace(/["']/g, "") : value;
                        value = (data_td.type == 'num') ? parseFloat(value) : value;
                        obj_tr[data_td.key] = value;
                    } else if (data_table.format == 'obj_mult' && typeof data_td.key !== 'undefined' && data_tr.value != '' && (data_td.type == 'value' || data_td.type == 'num' || data_td.type == 'num_switch' || data_td.type == 'select_meta') && (data_tr.id != 'new' || (data_tr.id == 'new' && data_tr.value != '' && data_tr.value != 'remove'))) {
                        value = data_td.type == 'select_meta' ? jmespath.search([value], "[?id=='new'||id_tipo=='remove'] | [0]") : value;
                        obj_tr = value;
                    } else if (data_table.format == 'array' && value != '') {
                        value = (data_td.type == 'date') ? moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD') : value;
                        value = (data_td.type == 'date' && value == 'Invalid date') ? false : value;
                        if (value) array_tr.push(value);
                    }
                });
                if (obj_tr !== null && Object.keys(obj_tr).length > 0) { arra_table.push(obj_tr); }
                if (array_tr.length > 0) { arra_table.push(array_tr); }
            }
        });
        if (arra_table.length > 0) { param[data_table.key] = arra_table; }
    });
    return param;
}
export function extractOptionConfigProgramas(this_) {
    let return_ = extractOptionConfigItem(this_);
    if (callAtiv('checkCapacidade','config_entregas')) {
        let entregas = $('#configBox_entregas tbody tr').map(function (v) {
            let value = $(this).attr('data-value');
            let id_programa_entrega = $(this).attr('data-id_programa_entrega');
            let id_entrega = $(this).attr('data-id_entrega');
            let id_programa = $(this).attr('data-id_programa');
            let descricao = $(this).find('td[data-key="descricao_entrega"]').text().trim();
            let criterios = $(this).find('td[data-key="criterios_avaliacao"]').text().trim();
            let id = $(this).attr('data-id');
            id = isNumeric(id) ? parseInt(id) : id;
            if (value == 'remove' || id_entrega != '') {
                return { id: id, value: value, id_programa_entrega: id_programa_entrega, id_entrega: id_entrega, id_programa: id_programa, descricao: descricao, criterios: criterios }
            }
        }).get();
        return_.entregas = entregas;
    }
    return return_;
}
export function extractOptionConfigPlano(this_) {
    let return_ = extractOptionConfigItem(this_);
    if (callAtiv('checkCapacidade','config_planos_acrescimo')) {
        let planos_acrescimo = $('#configBox_planos_acrescimo tbody tr').map(function (v) {
            let value = $(this).attr('data-value');
            let id_plano = $(this).attr('data-id_plano');
            let tempo_acrescimo = $(this).find('td').eq(1).text();
            let observacoes = $(this).find('td').eq(0).text();
            let nr_sei = $(this).find('td').eq(2).text();
            let id_procedimento = $(this).find('td').eq(3).text();
            let id_documento = $(this).find('td').eq(4).text();
            let config = { observacoes: observacoes, nr_sei: nr_sei, id_procedimento: id_procedimento, id_documento: id_documento };
            let id = $(this).attr('data-id');
            id = isNumeric(id) ? parseInt(id) : id;
            if (value == 'remove' || (observacoes != '' && tempo_acrescimo != '')) {
                return { id: id, value: value, id_plano: id_plano, tempo_acrescimo: parseInt(tempo_acrescimo), config: config }
            }
        }).get();
        return_.planos_acrescimo = planos_acrescimo;
    }
    if (callAtiv('checkCapacidade','config_entregas')) {
        let entregas = $('.configBox_entregas_programa tbody tr').map(function (v) {
            let value = $(this).attr('data-value');
            let id_plano = $(this).attr('data-id_plano');
            let indice_mes_entrega = $(this).find('td').eq(1).text().trim();
            let carga_horaria = $(this).find('td').eq(3).text().trim();
            let id = $(this).attr('data-id');
            id = isNumeric(id) ? parseInt(id) : id;
            if (value == 'remove' || carga_horaria != '') {
                return { id: id, value: value, id_plano: parseInt(id_plano), indice_mes_entrega: parseInt(indice_mes_entrega), carga_horaria: parseInt(carga_horaria) }
            }
        }).get();
        return_.entregas = entregas;
    }
    return return_;
}
export function extractOptionConfigUnidade(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var _return = {
        modalidades: _parent.find('#configBox_modalidades tbody tr').map(function () {
            var data = $(this).data();
            var td = $(this).find('td');
            var tipo_modalidade = encodeJSON_toHex(td.eq(0).text().trim());
            if (tipo_modalidade !== '') {
                return { tipo_modalidade: tipo_modalidade, id_tipo_modalidade: parseInt(td.eq(2).text().trim()), fator: td.eq(1).text().trim() };
            }
        }).get(),
        atividades: {
            lista_superior: _parent.find('#atividades_lista_superior').is(':checked').toString(),
            lista_unidade: (_parent.find('#atividades_lista_unidade').is(':checked') && checkValue(_parent.find('#select_lista_unidade'))) ? _parent.find('#select_lista_unidade').val() : "false",
            envio_automatico: _parent.find('#atividades_envio_automatico').is(':checked').toString(),
            nao_arquivar: _parent.find('#atividades_nao_arquivar').is(':checked').toString()
        },
        planos: {
            permite_autoavaliacao: _parent.find('#planos_permite_autoavaliacao').is(':checked'),
            duracao_padrao: parseInt(_parent.find('#planos_duracao_padrao').val()),
            prazo_comparecimento: parseInt(_parent.find('#planos_prazo_comparecimento').val()),
            data_comparecimento: _parent.find('#planos_data_comparecimento').val(),
            mostrar_notas: _parent.find('#planos_mostrar_notas').is(':checked')
        },
        programas: {
            unidade_instituidora: _parent.find('#programas_unidade_instituidora').is(':checked'),
            lista_superior: _parent.find('#programas_lista_superior').is(':checked').toString(),
            lista_unidade: (_parent.find('#programas_lista_unidade').is(':checked') && checkValue(_parent.find('#select_programa_lista_unidade'))) ? _parent.find('#select_programa_lista_unidade').val() : "false",
        },
        distribuicao: {
            horario_util: {
                inicio: _parent.find('#distribuicao_horario_util_inicio').val(),
                fim: _parent.find('#distribuicao_horario_util_fim').val()
            },
            count_dias_uteis: _parent.find('#distribuicao_count_dias_uteis').is(':checked'),
            count_horas: _parent.find('#distribuicao_count_horas').is(':checked').toString(),
            notificacao: {
                texto_criacao: encodeJSON_toHex(JSON.stringify(_parent.find('#notificacao_texto_criacao').val())).replaceAll('"', ''),
                texto_conclusao: encodeJSON_toHex(JSON.stringify(_parent.find('#notificacao_texto_conclusao').val())).replaceAll('"', ''),
                email: _parent.find('#notificacao_email').val()
            }
        },
        administrativo: {
            autoedicao_subordinadas: _parent.find('#atividades_autoedicao_subordinadas').is(':checked'),
            limitar_avaliacao_subordinadas: _parent.find('#atividades_limitar_avaliacao_subordinadas').is(':checked')
        },
        feriados: _parent.find('#configBox_feriados tbody tr').map(function () {
            var td = $(this).find('td');
            var checkboxRecorrente = td.eq(1).find('input[type="checkbox"]').is(':checked');
            var nome_feriado = encodeJSON_toHex(td.eq(0).text().trim());
            var feriado_data = td.eq(2).text().trim();
            if (feriado_data != '') {
                return { nome_feriado: nome_feriado, recorrente: checkboxRecorrente, feriado_data: feriado_data };
            }
        }).get(),
        metadados: callAtiv('checkCapacidade','config_view_metadados') ? extractOptionConfigItem($('#configBox_metadados')[0]).metadados : undefined
    };

    return _return;
}
export function saveOptionConfigItem(this_, type, id) {
    var action = 'config_update_' + type;
    var key = (type == 'unidades') ? extractOptionConfigUnidade(this_) : extractOptionConfigItem(this_);
    key = (type == 'planos') ? extractOptionConfigPlano(this_) : key;
    key = (type == 'programas') ? extractOptionConfigProgramas(this_) : key;
    var param = {
        action: action,
        id: id,
        ids: [],
        type: type,
        // key: key,
        key: JSON.stringify(convertJsonBools(key)),
        mode: 'option'
    };
    callAtiv('getConfigServer',action, param);
}
// CRIA PAINEL DE CONFIGURACOES
export function configPessoal() {
    var stateAtivData = getOptionsPro('panelAtividadesViewSend') ? 'checked' : '';
    var selfAtivData = getOptionsPro('panelAtividadesViewSelf') ? 'checked' : '';
    var stateAtivDataSub = (getOptionsPro('panelAtividadesViewSubordinada')) ? 'checked' : '';
    // var stateAtivDataSub = ( !verifyOptionsPro('panelAtividadesViewSubordinada') || getOptionsPro('panelAtividadesViewSubordinada') ) ? 'checked' : '';
    // var stateAtivDataSyncUnidade = ( getOptionsPro('panelAtividadesViewSyncUnidade') ) ? 'checked' : '';
    var statePanelSortPro = (getOptionsPro('panelSortPro')) ? 'checked' : '';
    var statePanelLabPro = (getOptionsPro('panelLabPro')) ? 'checked' : '';
    var statePanelLocalStorePro = (getOptionsPro('panelLocalStorePro')) ? 'checked' : '';
    var statePanelSortColumnsPro = (getOptionsPro('panelSortColumnsPro')) ? 'checked' : '';
    var configBaseSelected = (getOptionsPro('configBaseSelectedPro_atividades')) ? getOptionsPro('configBaseSelectedPro_atividades') : 0;
    var configBaseProAtiv = (localStorageRestorePro('configBasePro') != null) ? localStorageRestorePro('configBasePro') : false;
    // configBaseProAtiv = (configBaseProAtiv) ? jmespath.search(configBaseProAtiv, "[?baseTipo=='atividades'] | [?conexaoTipo=='api'||conexaoTipo=='googleapi']") : configBaseProAtiv;
    configBaseProAtiv = (configBaseProAtiv) ? jmespath.search(configBaseProAtiv, "[?baseTipo=='atividades'] | [?conexaoTipo=='api']") : configBaseProAtiv;
    configBaseProAtiv = (configBaseProAtiv !== null && configBaseProAtiv.length > 0) ? configBaseProAtiv : false;
    var optionSelectConfigBasePro = (configBaseProAtiv && configBaseProAtiv.length > 0) ? $.map(configBaseProAtiv, function (v, k) { return (configBaseSelected == k) ? '<option value="' + k + '" selected>' + v.baseName + '</option>' : '<option value="' + k + '">' + v.baseName + '</option>' }).join('') : '';
    var configUser = (typeof arrayConfigAtividades.perfil !== 'undefined' && arrayConfigAtividades.perfil.hasOwnProperty('config') && typeof arrayConfigAtividades.perfil.config !== 'undefined' && arrayConfigAtividades.perfil.config !== null) ? arrayConfigAtividades.perfil.config : false;
    var telCelularPlano = (typeof arrayConfigAtividades.perfil !== 'undefined' && arrayConfigAtividades.perfil.hasOwnProperty('tel_celular_plano') && arrayConfigAtividades.perfil.tel_celular_plano) ? arrayConfigAtividades.perfil.tel_celular_plano : false;
    var metadadoDataNascimento = (typeof arrayConfigAtividades.perfil !== 'undefined' && arrayConfigAtividades.perfil.hasOwnProperty('metadado_data_nascimento') && arrayConfigAtividades.perfil.metadado_data_nascimento) ? arrayConfigAtividades.perfil.metadado_data_nascimento : false;
    // console.log('configUser',configUser);

    var htmlSelectConfigBase = '<select style="width: 100%; margin: 0 !important; padding: 0 5px !important;width: 300px;" class="required infraText txtsheetsSelect" id="selectBaseDadosAtiv" data-act="atividades-call" data-fn="changeBaseDadosAtiv">' + optionSelectConfigBasePro + '</select>';

    var optionSelectConfigProgramas = $.map(arrayConfigAtividades.programas, function (v) {
        var id_programa_selected = parseInt(getOptionsPro('programaAtividadesSelected'));
        var selected = (id_programa_selected == v.id_programa) ? 'selected' : '';
        return '<option value="' + v.id_programa + '" data-label="' + v.sigla_unidade + '" data-id_unidade="' + v.id_unidade + '" ' + selected + '>' + moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(v.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</option>';
    }).join('');
    var htmlSelectConfigProgramas = '<select style="width: 100%; margin: 0 !important; padding: 0 5px !important;width: 240px;" class="required infraText txtsheetsSelect" data-placeholder="Filtrar por' + __.programa + '" id="selectProgramaAtiv" data-act="atividades-call" data-fn="changeProgramaAtiv">' + optionSelectConfigProgramas + '</select>';



    var textBox = '';

    textBox += '<table style="font-size: 10pt; float: left; margin-top: 30px;" class="seiProForm">' +
        '   <tr style="height: 40px;">' +
        '       <td style="width: 460px;vertical-align: bottom;"><i class="iconPopup far fa-hand-rock cinzaColor"></i> Ordenar pain\u00E9is de gest\u00E3o arrastando e soltando</td>' +
        '       <td colspan="2" style="vertical-align: top;">' +
        '           <div class="onoffswitch" style="float: left;">' +
        '               <input type="checkbox" data-act="atividades-composite" data-chain="changePanelSortPro|saveConfigPersonalUser" name="onoffswitch" class="onoffswitch-checkbox" id="panelSortPro" tabindex="0" ' + statePanelSortPro + '>' +
        '               <label class="onoff-switch-label" for="panelSortPro"></label>' +
        '           </div>' +
        '       </td>' +
        '   </tr>' +
        '   <tr style="height: 40px;">' +
        '       <td style="vertical-align: bottom;"><i class="iconPopup fas fa-arrows-alt-h cinzaColor"></i> Ordenar colunas do painel de ' + __.demandas + ' arrastando e soltando</td>' +
        '       <td colspan="2" style="vertical-align: top;">' +
        '           <div class="onoffswitch" style="float: left;">' +
        '               <input type="checkbox" data-act="atividades-composite" data-chain="changePanelSortColumnsPro|saveConfigPersonalUser" name="onoffswitch" class="onoffswitch-checkbox" id="panelSortColumnsPro" tabindex="0" ' + statePanelSortColumnsPro + '>' +
        '               <label class="onoff-switch-label" for="panelSortColumnsPro"></label>' +
        '           </div>' +
        '       </td>' +
        '   </tr>' +
        '   <tr style="height: 40px;">' +
        '       <td style="vertical-align: bottom;"><i class="iconPopup fas fa-street-view cinzaColor"></i> Visualizar apenas ' + __.minhas_demandas + '</td>' +
        '       <td colspan="2" style="vertical-align: top;">' +
        '           <div class="onoffswitch" style="float: left;">' +
        '               <input type="checkbox" data-type="view_ativ_self" data-act="atividades-composite" data-chain="changeViewStatesAtiv|saveConfigPersonalUser" name="onoffswitch" class="onoffswitch-checkbox" id="panelAtividadesViewSelf" tabindex="0" ' + selfAtivData + '>' +
        '               <label class="onoff-switch-label" for="panelAtividadesViewSelf"></label>' +
        '           </div>' +
        '       </td>' +
        '   </tr>' +
        '   <tr style="height: 40px;">' +
        '       <td style="vertical-align: bottom;"><i class="iconPopup fas fa-archive cinzaColor"></i> Visualizar ' + __.demandas + ' j\u00E1 ' + __.arquivadas + '</td>' +
        '       <td style="width: 50px;">' +
        '           <div class="onoffswitch" style="float: left;">' +
        '               <input type="checkbox" data-type="view_ativ_send" data-act="atividades-composite" data-chain="changeViewStatesAtiv|saveConfigPersonalUser" name="onoffswitch" class="onoffswitch-checkbox" id="panelAtividadesViewSend" tabindex="0" ' + stateAtivData + '>' +
        '               <label class="onoff-switch-label" for="panelAtividadesViewSend"></label>' +
        '           </div>' +
        '       </td>' +
        '       <td style="' + (getOptionsPro('panelAtividadesViewSend') ? '' : 'display:none;') + '" class="selectProgramaAtiv">' +
        htmlSelectConfigProgramas +
        '       </td>' +
        '   </tr>' +
        '   <tr style="height: 40px;">' +
        '       <td style="vertical-align: bottom;"><i class="iconPopup fas fa-exchange-alt cinzaColor"></i> Visualizar ' + __.demandas + ' e afastamentos das unidades subordinadas</td>' +
        '       <td colspan="2" style="vertical-align: top;">' +
        '           <div class="onoffswitch" style="float: left;">' +
        '               <input type="checkbox" data-type="view_ativ_sub" data-act="atividades-composite" data-chain="changeViewStatesAtiv|saveConfigPersonalUser" name="onoffswitch" class="onoffswitch-checkbox" id="panelAtividadesViewSub" tabindex="0" ' + stateAtivDataSub + '>' +
        '               <label class="onoff-switch-label" for="panelAtividadesViewSub"></label>' +
        '           </div>' +
        '       </td>' +
        '   </tr>' +
        '   <tr style="height: 40px;">' +
        '       <td style="vertical-align: bottom;"><i class="iconPopup fas fa-tractor cinzaColor"></i> Desativar sincroniza\u00E7\u00E3o de dados locais (reduz desempenho)</td>' +
        '       <td style="width: 300px;" colspan="2">' +
        '           <div class="onoffswitch" style="float: left;">' +
        '               <input type="checkbox" data-type="view_disable_local" data-act="atividades-composite" data-chain="changeViewStatesAtiv|saveConfigPersonalUser" name="onoffswitch" class="onoffswitch-checkbox" id="panelLocalStorePro" tabindex="0" ' + statePanelLocalStorePro + '>' +
        '               <label class="onoff-switch-label" for="panelLocalStorePro"></label>' +
        '           </div>' +
        '       </td>' +
        '   </tr>' +
        /*
        '   <tr style="height: 40px;">'+
        '       <td><i class="iconPopup fas fa-sign-out-alt cinzaColor"></i> Sincronizar a troca de unidade do sistema \u00E0 troca de unidade do SEI </td>'+
        '       <td>'+
        '           <div class="onoffswitch" style="float: right;">'+
        '               <input type="checkbox" data-type="sync_unidades" data-act="atividades-call" data-fn="changeViewStatesAtiv" name="onoffswitch" class="onoffswitch-checkbox" id="changeViewStatesSyncUnidade" tabindex="0" '+stateAtivDataSyncUnidade+'>'+
        '               <label class="onoff-switch-label" for="changeViewStatesSyncUnidade"></label>'+
        '           </div>'+
        '       </td>'+
        '   </tr>'+
        */
        '   <tr style="height: 40px;">' +
        '       <td style="vertical-align: bottom;position:relative;">' +
        // '           <a class="newLink" data-act="atividades-call" data-fn="signOutProfile" data-pass-el="0" id="ssoLoginConfig" style="position: absolute;right: 0;top: 5px;'+(getTokenGoogle() ? '' : 'display:none;')+'" data-tip="Desconectar">'+
        // '               <i class="iconPopup fas fa-sign-out-alt cinzaColor" style="height: auto;"></i>'+
        '           </a>' +
        '           Alternar base de dados' +
        '           <i class="iconPopup fas fa-sync-alt cinzaColor"></i>' +
        '       </td>' +
        '       <td colspan="2">' +
        htmlSelectConfigBase +
        '       </td>' +
        '   </tr>' + ((callAtiv('checkOptionEntidade','gerar_relatorios_gerenciais') || callAtiv('checkOptionEntidade','sincronizar_dados_externos') || callAtiv('checkOptionEntidade','sincronizar_dados_api')) && callAtiv('checkPerfilNivelAdm',) ?
            '   <tr style="height: 40px;">' +
            '       <td colspan="2">' +
            (callAtiv('checkOptionEntidade','gerar_relatorios_gerenciais') ?
                '           <a class="newLink newLink_active" data-act="atividades-call" data-fn="initUpdateReports" data-pass-el="0" style="font-size: 10pt;cursor: pointer;">' +
                '               <i class="fas fa-file-alt" style="font-size: 100%;"></i> ' +
                '               Atualizar relat\u00F3rios gerenciais' +
                '           </a>' +
                '' : '') +
            (callAtiv('checkOptionEntidade','sincronizar_dados_externos') ?
                '           <a class="newLink newLink_active" data-act="atividades-call" data-fn="setSyncDadoExterno" style="font-size: 10pt;cursor: pointer;">' +
                '               <i class="fas fa-cogs" style="font-size: 100%;"></i> ' +
                '               Atualizar rotinas internas' +
                '               <span class="info"></span>' +
                '           </a>' +
                '' : '') +
            (callAtiv('checkOptionEntidade','sincronizar_dados_api') ?
                '           <a class="newLink newLink_active" data-act="atividades-call" data-fn="initUpdateAPI" style="font-size: 10pt;cursor: pointer;">' +
                '               <i class="fas fa-sync-alt" style="font-size: 100%;"></i> ' +
                '               Atualizar dados de API' +
                '               <span class="info"></span>' +
                '           </a>' +
                '' : '') +
            (debugScreen ?
                '           <a class="newLink newLink_active debugScreen" data-act="atividades-call" data-fn="dialogDebugScreen" style="font-size: 10pt;cursor: pointer;">' +
                '               <i class="fas fa-bug" style="font-size: 100%;"></i> ' +
                '               Notificar bug' +
                '               <span class="info"></span>' +
                '           </a>' +
                '' : '') +
            '       </td>' +
            '   </tr>' : '') +
        '   <tr style="height: 40px;">' +
        '       <td colspan="2">' +
        '           <span style="color:#ccc;font-size: 8pt;font-family: monospace;">' +
        '               Vers\u00E3o ' + VERSION_SPRO +
        '               Server: ' + urlServerAtiv +
        (backendServerAtiv ? ' Back-end: ' + backendServerAtiv : '') +
        '           </span>' +
        '       </td>' +
        '   </tr>' +
        '</table>';

    textBox += '<table style="font-size: 10pt;float: left; margin-top: 30px;" class="seiProForm">' +
        '   <tr style="height: 40px;">' +
        '       <td><i class="iconPopup fas fa-business-time cinzaColor"></i> Hor\u00E1rio \u00FAtil de trabalho (para c\u00E1lculo de tempo despendido)</td>' +
        '       <td style="text-align: center;" colspan="2">' +
        '            <input type="time" id="distribuicao_horario_util_inicio" data-act="atividades-call" data-fn="saveConfigPersonalUser" style="width: 100px !important; float: left;" tabindex="0" value="' + (configUser && typeof configUser.distribuicao !== 'undefined' && typeof configUser.distribuicao.horario_util !== 'undefined' && typeof configUser.distribuicao.horario_util.inicio !== 'undefined' ? configUser.distribuicao.horario_util.inicio : '00:00') + '">' +
        '            <span style="line-height: 40px;display: inline-block;margin: 0 10px;">\u00E0</span>' +
        '            <input type="time" id="distribuicao_horario_util_fim" data-act="atividades-call" data-fn="saveConfigPersonalUser" style="width: 100px !important; float: right;" tabindex="0" value="' + (configUser && typeof configUser.distribuicao !== 'undefined' && typeof configUser.distribuicao.horario_util !== 'undefined' && typeof configUser.distribuicao.horario_util.fim !== 'undefined' ? configUser.distribuicao.horario_util.fim : '23:59') + '">' +
        '       </td>' +
        '   </tr>' +
        '   <tr style="height: 40px;">' +
        '       <td style="width: 300px;"><i class="iconPopup far fa-phone cinzaColor"></i> Telefone vis\u00EDvel na lista de contatos</td>' +
        '       <td colspan="2">' +
        (telCelularPlano ?
            '           <input type="text" id="tel_celular_plano" style="width:calc(100% - 35px) !important" tabindex="0" value="' + telCelularPlano + '" disabled> <i data-tip="Conforme informado no termo de ades\u00E3o vigente" class="fas fa-info-circle azulColor" style="cursor:pointer;"></i>' :
            '            <input type="text" id="tel_celular" data-act="atividades-call" data-fn="saveConfigPersonalUser" style="width:calc(100% - 15px) !important" tabindex="0" value="' + (configUser && typeof configUser.tel_celular !== 'undefined' ? configUser.tel_celular : '') + '">' +
            '') +
        '       </td>' +
        '   </tr>' +
        (metadadoDataNascimento ?
            '   <tr style="height: 40px;">' +
            '       <td style="vertical-align: bottom;"><i class="iconPopup fas fa-birthday-cake cinzaColor"></i>Ocultar meu anivers\u00E1rio e foto do perfil da lista de contatos</td>' +
            '       <td colspan="2" style="vertical-align: top;">' +
            '           <div class="onoffswitch" style="float: left;">' +
            '               <input type="checkbox" data-act="atividades-call" data-fn="saveConfigPersonalUser" name="onoffswitch" class="onoffswitch-checkbox" id="configUserViewNiver" tabindex="0" ' + (configUser && typeof configUser.oculta_aniversario !== 'undefined' && !!configUser.oculta_aniversario && configUser.oculta_aniversario == 'true' ? 'checked' : '') + '>' +
            '               <label class="onoff-switch-label" for="configUserViewNiver"></label>' +
            '           </div>' +
            '       </td>' +
            '   </tr>' +
            '' : '') +
        '</table>';
    return textBox;
}
export function saveConfigPersonalUser(this_) {
    callAtiv('removeLocalDataAtiv',);
    var _this = $(this_);
    var _parent = _this.closest('.ui-tabs-panel');
    var desabilita_localdata = _parent.find('#panelLocalStorePro').is(':checked');
    var funcoes_experimentais = _parent.find('#panelLabPro').is(':checked');
    var ordenar_paineis = _parent.find('#panelSortPro').is(':checked');
    var ordenar_colunas = _parent.find('#panelSortColumnsPro').is(':checked');
    var visualiza_enviadas = _parent.find('#panelAtividadesViewSend').is(':checked');
    var visualiza_somente_suas = _parent.find('#panelAtividadesViewSelf').is(':checked');
    var visualiza_subordinadas = _parent.find('#panelAtividadesViewSub').is(':checked');
    var horario_inicio = _parent.find('#distribuicao_horario_util_inicio').val();
    var horario_fim = _parent.find('#distribuicao_horario_util_fim').val();
    var tel_celular = _parent.find('#tel_celular').val();
    var oculta_aniversario = _parent.find('#configUserViewNiver').length ? _parent.find('#configUserViewNiver').is(':checked') : false;
    var config = {
        desabilita_localdata: desabilita_localdata,
        funcoes_experimentais: funcoes_experimentais,
        ordenar_paineis: ordenar_paineis,
        ordenar_colunas: ordenar_colunas,
        visualiza_enviadas: visualiza_enviadas,
        visualiza_somente_suas: visualiza_somente_suas,
        visualiza_subordinadas: visualiza_subordinadas,
        tel_celular: tel_celular,
        oculta_aniversario: oculta_aniversario,
        distribuicao: {
            horario_util: {
                inicio: horario_inicio,
                fim: horario_fim
            }
        }
    };
    var action = 'config_update_user_personal';
    var param = {
        action: action,
        config: config
    };
    getServerAtividades(param, action);
    _this.closest('tr').find('td').eq(0).addClass('editCellLoading');
}
