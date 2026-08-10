// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { callAtiv } from './call.js';
/**
 * Atividades — ações, início, conclusão, pausa e histórico.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import { getServerAtividades } from './server.js';
import { getNameGenre } from '../../shared/nomenclatura.js';
import { getRecalculaPrazo } from '../../core/prazos.js';

export function completeAtividade(id_demanda, confirmeBox = false) {
    var dadosIfrArvore = getIfrArvoreDadosProcesso();
    var value = callAtiv('getAtividadeData',id_demanda);
    var id_plano_check = checkRegularizaPlano(value);
    if (id_plano_check) {
        callAtiv('regularizaPlano',false, { id_plano: id_plano_check, refplano: 'anterior' });
    } else {
        if (!checkSignDocsPlano(value)) {
            alertSignDocsPlano(value);
        } else {
            if (!confirmeBox && dadosIfrArvore && value.requisicao_sei == dadosIfrArvore.nr_sei) {
                confirmaBoxPro('O documento de entrega selecionado \u00E9 igual ao documento de requisi\u00E7\u00E3o. Deseja continuar?', function () { completeAtividade(id_demanda, true) }, 'Continuar...');
            } else {
                var check_ispaused = (typeof value.data_retomada !== 'undefined' && value.data_retomada !== null && value.data_retomada == '0000-00-00 00:00:00') ? true : false;
                if (check_ispaused) {
                    confirmaBoxPro(__.A_demanda + ' est\u00E1 ' + getNameGenre('demanda', 'paralisado', 'paralisada') + '. Deseja retom\u00E1-la agora?', function () { pauseAtividade(id_demanda) }, __.Retomar + '...', cancelMoveKanbanItens);
                } else {
                    var check_isresumed = (typeof value.data_retomada !== 'undefined' && value.data_retomada !== null && value.data_retomada != '0000-00-00 00:00:00') ? true : false;
                    var config_unidade = callAtiv('getConfigDadosUnidade',value.sigla_unidade);
                    var optionSelectDocumentos = (arrayConfigAtividades.tipos_documentos.length > 0) ? $.map(arrayConfigAtividades.tipos_documentos, function (v, k) { return ((value && v.id_tipo_documento == value.id_tipo_documento) || (dadosIfrArvore && dadosIfrArvore.nome_documento.indexOf(v.nome_documento) !== -1)) ? '<option value="' + v.id_tipo_documento + '" selected>' + v.nome_documento + '</option>' : '<option value="' + v.id_tipo_documento + '">' + v.nome_documento + '</option>' }).join('') : '';
                    var selectDocumentos = '<select id="ativ_id_tipo_documento" class="requiredSelect" data-act="atividades-call" data-fn="checkThisAtivRequiredFields" data-key="id_tipo_documento" required><option>&nbsp;</option>' + optionSelectDocumentos + '</select>';
                    selectDocumentos = (callAtiv('checkOptionEntidade','dispensa_tipos_requisicao')) ? '<input type="hidden" id="ativ_id_tipo_documento" data-key="id_tipo_documento" data-param="id_tipo_documento" value="0">' : selectDocumentos;

                    var dataInicio = moment(value.data_inicio, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format);
                    var dataEntrega = (value.data_entrega != '0000-00-00 00:00:00')
                        ? moment(value.data_entrega, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format)
                        : (dadosIfrArvore && typeof dadosIfrArvore.data_documento !== 'undefined' && dadosIfrArvore.data_documento)
                            ? moment(dadosIfrArvore.data_documento, 'DD/MM/YYYY HH:mm').format(config_unidade.hora_format)
                            : moment().format(config_unidade.hora_format);
                    // console.log(value.data_entrega, dadosIfrArvore, dadosIfrArvore.data_document);
                    var dataDistribuicao = moment(value.data_distribuicao, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format);
                    var inputAtiv = jmespath.search(arrayConfigAtividades.atividades, "[?id_atividade==`" + value.id_atividade + "`].{sigla_unidade: sigla_unidade, id_unidade: id_unidade, dias_planejado: dias_planejado, tempo_pactuado: tempo_pactuado, complexidade: config.complexidade, etiqueta: config.etiqueta.lista, tipo_processo: config.tipo_processo, desativa_produtividade: config.desativa_produtividade, observacao_gerencial: config.observacao_gerencial} | [0]");
                    inputAtiv = (inputAtiv !== null) ? "<input type='hidden' id='ativ_id_atividade' data-key='id_atividade' data-param='id_atividade' data-config='" + JSON.stringify(inputAtiv) + "' value='" + value.id_atividade + "'>" : '';
                    var inputUser = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + value.id_user + "`].{id_plano: id_plano, sigla_unidade: sigla_unidade, nome_modalidade: nome_modalidade, carga_horaria: carga_horaria} | [0]");
                    inputUser = (inputUser !== null) ? "<input type='hidden' id='ativ_id_user' data-key='id_user' data-param='id_user' data-config='" + JSON.stringify(inputUser) + "' value='" + value.id_user + "'>" : '';

                    var listAtividadesVinculadas = getAtividadesVinculadas(value, 'concluidas');

                    var htmlBox = '<div id="boxAtividade" class="seipro-atividades-box atividadeWork seipro-atividades-work" data-demanda="' + (value && value.id_demanda ? value.id_demanda : 0) + '">' +
                        '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
                        '      <tr>' +
                        '          <td style="vertical-align: bottom; text-align: left; ' + (callAtiv('checkOptionEntidade','dispensa_tipos_requisicao') ? 'display:none;' : '') + '" class="label">' +
                        '               <label for="ativ_id_tipo_documento"><i class="iconPopup iconSwitch fas fa-file-signature cinzaColor"></i>Documento:</label>' +
                        '               ' + inputAtiv +
                        '               ' + inputUser +
                        '           </td>' +
                        '           <td class="required" style="width: 230px; ' + (callAtiv('checkOptionEntidade','dispensa_tipos_requisicao') ? 'display:none;' : '') + '">' +
                        '               ' + selectDocumentos +
                        '           </td>' +
                        '           <td style="vertical-align: bottom;" class="label">' +
                        '               <label class="' + (callAtiv('checkOptionEntidade','dispensa_tipos_requisicao') ? '' : 'last') + '" for="ativ_documento_sei"><i class="iconPopup iconSwitch fas fa-file cinzaColor"></i>SEI n\u00BA:</label>' +
                        '           </td>' +
                        '           <td colspan="2">' +
                        '               <input type="text" data-input-filter="digits" id="ativ_documento_sei" data-act="atividades-call" data-fn="changeProtocoloBoxAtiv" maxlength="11" data-key="documento_sei" value="' + (value && value.documento_sei !== null && parseInt(value.documento_sei) != 0 ? value.documento_sei : (dadosIfrArvore && dadosIfrArvore.nr_sei ? dadosIfrArvore.nr_sei : '')) + '">' +
                        '               <input type="hidden" id="ativ_id_documento_entregue" data-key="id_documento_entregue" data-param="id_documento_entregue" value="' + (value && value.id_documento_entregue !== null && value.id_documento_entregue != '0' ? value.id_documento_entregue : (dadosIfrArvore && dadosIfrArvore.id_documento ? dadosIfrArvore.id_documento : '')) + '">' +
                        '               <input type="hidden" id="ativ_id_plano" data-key="id_plano" data-param="id_plano" value="' + (value && value.id_plano ? value.id_plano : '0') + '">' +
                        '           </td>' +
                        '      </tr>' +
                        '      <tr>' +
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                        '               <label for="ativ_numero_documento"><i class="iconPopup iconSwitch fas fa-file cinzaColor"></i>Descri\u00E7\u00E3o do Documento:</label>' +
                        '           </td>' +
                        '           <td colspan="4">' +
                        '               <input type="text" id="ativ_numero_documento" data-act="atividades-call" data-fn="checkThisAtivRequiredFields" maxlength="255" data-key="numero_documento" value="' + (value && value.numero_documento !== null ? value.numero_documento : (dadosIfrArvore && dadosIfrArvore.numero_documento ? dadosIfrArvore.numero_documento : '')) + '">' +
                        '           </td>' +
                        '      </tr>' +
                        '      <tr>' +
                        '          <td style="vertical-align: middle; text-align: left;" class="label">' +
                        '               <label for="ativ_observacao_tecnica"><i class="iconPopup iconSwitch fas fa-comment-alt cinzaColor"></i>' + __.Observacao + ' ' + __.Tecnica + ':</label>' +
                        '           </td>' +
                        '           <td colspan="4">' +
                        '               <textarea style="width: 97%;float: left;" type="text" id="ativ_observacao_tecnica" ' + ((value.data_entrega == '0000-00-00 00:00:00') ? 'data-act="atividades-call" data-fn="checkboxAnotacoesProcessoAtiv" data-on="input"' : '') + ' data-key="observacao_tecnica">' + ((value && value.observacao_tecnica !== null && value.observacao_tecnica != '') ? value.observacao_tecnica : '') + '</textarea>' +
                        '' + ($('#ifrArvore').length > 0 ?
                            '               <table style="width: 100%;font-size: 10pt; display:none" id="tableAnotacoesProcessoAtiv">' +
                            '                   <tbody>' +
                            '                       <tr style="height: 40px;">' +
                            '                           <td style="text-align: left;vertical-align: bottom;">' +
                            '                               <label for="ativ_anotacoes_processo">' +
                            '                                   <i class="iconPopup iconSwitch fas fa-sticky-note cinzaColor"></i>Adicionar ' + __.observacao + ' ' + __.tecnica + ' nas anota\u00E7\u00F5es do processo?</label>' +
                            '                           </td>' +
                            '                           <td>' +
                            '                               <div class="onoffswitch" style="float: right;">' +
                            '                                   <input type="checkbox" data-key="anotacoes_processo" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_anotacoes_processo" tabindex="0">' +
                            '                                   <label class="onoff-switch-label" for="ativ_anotacoes_processo"></label>' +
                            '                               </div>' +
                            '                           </td>' +
                            '                       </tr>' +
                            '                   </tbody>' +
                            '               </table>' +
                            '' : '') +
                        '           </td>' +
                        '      </tr>' +
                        '      <tr class="hrForm"><td colspan="5"></td></tr>' +
                        '      <tr>' +
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                        '               <label for="ativ_data_inicio"><i class="iconPopup iconSwitch fas fa-play-circle cinzaColor"></i>Data de In\u00EDcio:</label>' +
                        '           </td>' +
                        '           <td class="required date">' +
                        '               <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="changeDadosTrabalho" id="ativ_data_inicio" data-key="data_inicio" data-type="inicio" data-name="data de in\u00EDcio" value="' + dataInicio + '" min="' + dataDistribuicao + '" required>' +
                        '               <input type="hidden" id="ativ_data_distribuicao" data-key="data_distribuicao" data-type="distribuicao" value="' + dataDistribuicao + '">' +
                        '           </td>' +
                        '           <td style="vertical-align: bottom;" class="label">' +
                        '               <label class="last" for="ativ_data_entrega"><i class="iconPopup iconSwitch fas fa-user-clock cinzaColor" style="float: initial;"></i>Data de Entrega:</label>' +
                        '           </td>' +
                        '           <td class="required date">' +
                        (checkBrowser() == 'Firefox' ?
                            '               <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="changeDadosTrabalho" id="ativ_data_entrega" data-key="data_entrega" data-type="fim" data-name="data de entrega" value="' + dataEntrega + '" min="' + dataDistribuicao + '" required>' +
                            '' :
                            '               <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="changeDadosTrabalho" id="ativ_data_entrega" data-key="data_entrega" data-type="fim" data-name="data de entrega" value="" min="' + dataDistribuicao + '" required>' +
                            '') +
                        '           </td>' +
                        '           <td>' +
                        '               <i class="fas fa-chevron-circle-right azulColor" style="margin: 0px 2px;float: right;cursor:pointer" data-act="atividades-call" data-fn="toggleTemposLiquidos" data-tip="Clique para visualizar os tempos despendido, executado e planejado"></i> ' +
                        '           </td>' +
                        '      </tr>' +
                        '      <tr ' + (check_isresumed ? '' : 'style="display:none"') + '>' +
                        // '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        // '               <label for="ativ_tempo_pausado"><i class="iconPopup iconSwitch fas fa-clock cinzaColor"></i>Tempo '+__.Paralisado+':</label>'+
                        // '           </td>'+
                        // '           <td>'+
                        // '               <input type="number" min="0.1" step=".1" id="ativ_tempo_pausado" data-key="tempo_pausado" value="0" disabled>'+
                        // '           </td>'+
                        '           <td style="vertical-align: middle;text-align: right;padding-left: 25px;" class="label" colspan="4">' +
                        '               <button type="button" id="manPauseAtividade" ' + (callAtiv('checkCapacidade','pause_atividade') ? '' : 'style="display:none"') + ' class="confirm ui-button ui-corner-all ui-widget"><span class="ui-button-icon ui-icon ui-icon-calendar"></span><span class="ui-button-icon-space"> </span>Gerenciar Paralisa\u00E7\u00F5es</button>' +
                        '           </td>' +
                        '      </tr>' +
                        '      <tr class="tempos_liquidos" style="display:none">' +
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                        '               <label for="ativ_tempo_despendido">' +
                        '                   <i class="iconPopup iconSwitch fas fa-hourglass-half cinzaColor"></i>' +
                        '                   <i class="fas fa-info-circle azulColor" style="margin: 0px 2px;float: right;" data-tip="Tempo l\u00EDquido entre a <u>data de in\u00EDcio</u> ' + getNameGenre('demanda', 'do', 'da') + ' ' + __.demanda + ' e sua data de entrega"></i>' +
                        '                   Tempo Despendido:' +
                        '               </label>' +
                        '           </td>' +
                        '           <td class="td_tempo_despendido" data-tempo="' + decimalHourToMinute(value && value.tempo_despendido ? value.tempo_despendido : '0') + '">' +
                        '               <input type="number" min="0.1" step=".1" id="ativ_tempo_despendido" data-act="atividades-call" data-fn="changeDadosTrabalho" data-key="tempo_despendido" data-type="tempo" value="' + (value && value.tempo_despendido ? value.tempo_despendido : '0') + '" disabled>' +
                        '           </td>' +
                        '           <td style="vertical-align: bottom;" class="label">' +
                        '               <label class="last" for="ativ_dias_despendido"><i class="iconPopup iconSwitch fas fa-calendar-alt cinzaColor" style="float: initial;"></i><span id="ativ_dias_despendido_label">Dias ' + (config_unidade.count_dias_uteis ? '\u00FAteis' : '') + ' Despendido</span>:</label>' +
                        '           </td>' +
                        '           <td class="required number" colspan="2">' +
                        '               <input type="number" min="0" id="ativ_dias_despendido" data-act="atividades-call" data-fn="changeDadosTrabalho" data-key="dias_despendido" data-type="dias" value="' + (value && value.dias_despendido ? value.dias_despendido : '0') + '" required>' +
                        '           </td>' +
                        '      </tr>' +
                        '      <tr class="tempos_liquidos" style="display:none">' +
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                        '               <label for="ativ_tempo_executado">' +
                        '                   <i class="iconPopup iconSwitch fas fa-hourglass-half cinzaColor"></i>' +
                        '                   <i class="fas fa-info-circle azulColor" style="margin: 0px 2px;float: right;" data-tip="Tempo l\u00EDquido entre a <u>data de distribui\u00E7\u00E3o</u> ' + getNameGenre('demanda', 'do', 'da') + ' ' + __.demanda + ' e sua data de entrega"></i>' +
                        '                   Tempo Executado:' +
                        '               </label>' +
                        '           </td>' +
                        '           <td class="td_tempo_executado" data-tempo="' + decimalHourToMinute(value && value.tempo_executado ? value.tempo_executado : '0') + '">' +
                        '               <input type="number" min="0.1" step=".1" id="ativ_tempo_executado" data-key="tempo_executado" data-type="tempo_executado" value="' + (value && value.tempo_executado ? value.tempo_executado : '0') + '" disabled>' +
                        '           </td>' +
                        '           <td style="vertical-align: bottom;" class="label">' +
                        '               <label class="last" for="ativ_dias_executado"><i class="iconPopup iconSwitch fas fa-calendar-alt cinzaColor" style="float: initial;"></i><span id="ativ_dias_executado_label">Dias ' + (config_unidade.count_dias_uteis ? '\u00FAteis' : '') + ' Executado</span>:</label>' +
                        '           </td>' +
                        '           <td class="required number" colspan="2">' +
                        '               <input type="number" min="0" id="ativ_dias_executado" data-act="atividades-call" data-fn="changeDadosTrabalho" data-key="dias_executado" data-type="dias_executado" value="' + (value && value.dias_executado ? value.dias_executado : '0') + '" required>' +
                        '           </td>' +
                        '      </tr>' +
                        '      <tr class="hrForm tempos_liquidos" style="display:none"><td colspan="5"></td></tr>' +
                        '      <tr class="tempos_liquidos" style="display:none">' +
                        '            <td style="vertical-align: bottom; text-align: left;" class="label">' +
                        '                <label for="ativ_data_distribuicao"><i class="iconPopup iconSwitch fas fa-briefcase cinzaColor"></i>Data de Distribui\u00E7\u00E3o:</label>' +
                        '            </td>' +
                        '            <td class="required date" style="width: 210px;">' +
                        '                <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" value="' + value.data_distribuicao + '" required disabled>' +
                        '            </td>' +
                        '            <td style="vertical-align: bottom;" class="label">' +
                        '                <label class="last" for="ativ_prazo_entrega"><i class="iconPopup iconSwitch fas fa-business-time cinzaColor" style="float: initial;"></i>Prazo de Entrega:</label>' +
                        '            </td>' +
                        '            <td class="required date" colspan="2">' +
                        '                <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" value="' + value.prazo_entrega + '" required disabled>' +
                        '            </td>' +
                        '      </tr>' +
                        '      <tr class="tempos_liquidos" style="display:none">' +
                        '            <td style="vertical-align: bottom; text-align: left;" class="label">' +
                        '                <label for="ativ_tempo_planejado"><i class="iconPopup iconSwitch fas fa-hourglass-half cinzaColor"></i>' +
                        '                   <i class="fas fa-info-circle azulColor" style="margin: 0px 2px;float: right;" data-tip="Tempo l\u00EDquido entre a data de distribui\u00E7\u00E3o ' + getNameGenre('demanda', 'do', 'da') + ' ' + __.demanda + ' e seu <u>prazo de entrega</u>"></i>' +
                        '                   Tempo Planejado:</label>' +
                        '            </td>' +
                        '            <td style="width: 210px;">' +
                        '                <input type="number" id="ativ_tempo_planejado_complete" value="' + (value && value.tempo_planejado ? value.tempo_planejado : '') + '" disabled>' +
                        '            </td>' +
                        '            <td style="vertical-align: bottom;" class="label">' +
                        '                <label class="last" for="ativ_dias_planejado"><i class="iconPopup iconSwitch fas fa-calendar-alt cinzaColor" style="float: initial;"></i><span id="ativ_dias_planejado_label">Dias ' + (config_unidade.count_dias_uteis ? '\u00FAteis' : '') + ' de Planejamento</span>:</label>' +
                        '            </td>' +
                        '            <td class="required number" colspan="2">' +
                        '                <input type="number" value="' + (value && value.dias_planejado ? value.dias_planejado : '0') + '" required disabled>' +
                        '            </td>' +
                        '      </tr>' +
                        '      <tr class="hrForm tempos_liquidos" style="display:none"><td colspan="5"></td></tr>' +
                        '      <tr>' +
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                        '               <label for="ativ_tempo_pactuado"><i class="iconPopup iconSwitch fas fa-handshake cinzaColor"></i>Tempo Pactuado:</label>' +
                        '           </td>' +
                        '           <td colspan="3" style="text-align: left;" colspan="2">' +
                        '               <span id="ativ_tempo_pactuado">' + callAtiv('getTagTempoPactuadoAtiv',value) + '</span>' +
                        '           </td>' +
                        '      </tr>' +
                        (callAtiv('checkOptionEntidade','exigir_homologacao_programas') ?
                            '      <tr>' +
                            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                            '               <label for="ativ_id_entrega"><i class="iconPopup iconSwitch fas fa-hand-holding cinzaColor"></i>Entrega:</label>' +
                            '           </td>' +
                            '           <td colspan="4" style="text-align: left;">' +
                            '               <select id="ativ_id_entrega" data-act="atividades-call" data-fn="changeSelectEntregas" data-key="id_entrega" data-old_id_entrega="' + (value && value.id_entrega ? value.id_entrega : 'false') + '" data-type="number"><option>&nbsp;</option><option disabled>Selecione um respons\u00E1vel antes de vincular uma entrega</option></select>' +
                            '               <a class="newLink linkDialogEntrega" style="cursor: pointer;display:none;" data-act="atividades-call" data-fn="openDialogEntrega" data-tip="Visualiza\u00E7\u00E3o detalhes da entrega">' +
                            '                   <i class="fas fa-eye" style="font-size: 80%;"></i>' +
                            '               </a>' +
                            '           </td>' +
                            '      </tr>' +
                            '' : '') +
                        (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
                            '      <tr>' +
                            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                            '               <label for="ativ_produtividade"><i class="iconPopup iconSwitch fas fa-toolbox cinzaColor"></i>Produtividade:</label>' +
                            '           </td>' +
                            '           <td colspan="3" style="text-align: left;">' +
                            '               <div id="ativ_produtividade" style="margin: 5px 0;">' + getInfoAtividadeProdutividade(value, true, 'despendido') + '</div>' +
                            '               <div id="ativ_produtividade_executada" style="margin: 5px 0;">' + getInfoAtividadeProdutividade(value, true, 'executado') + '</div>' +
                            '           </td>' +
                            '           <td>' +
                            '               <i class="fas fa-redo cinzaColor update_tempos_demanda" style="margin: 0px 2px;float: left;cursor:pointer" data-demanda="' + value.id_demanda + '" data-type="set" data-tempo="tempo_planejado" data-act="atividades-call" data-fn="updateDialogTemposDemanda" data-tip="Clique para atualizar os c\u00E1lculos de produtividade"></i>' +
                            '           </td>' +
                            '      </tr>' +
                            '' : '') +
                        (value.checklist && value.checklist.length > 0 ?
                            '      <tr>' +
                            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                            '               <label for="ativ_checklist"><i class="iconPopup iconSwitch fas fa-check-double cinzaColor"></i>Checklist:</label>' +
                            '           </td>' +
                            '           <td colspan="4" style="text-align: left;">' +
                            '               ' + getInfoAtividadeChecklist(value, 'actions') +
                            '           </td>' +
                            '      </tr>' +
                            '' : '') +
                        (listAtividadesVinculadas.length_check > 0 ?
                            '      <tr>' +
                            '           <td colspan="5">' +
                            '               ' + listAtividadesVinculadas.input +
                            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
                            '                  <tr style="height: 40px;">' +
                            '                      <td style="vertical-align: bottom; text-align: left;" class="label">' +
                            '                           <label for="complete_others"><i class="iconPopup iconSwitch fas fa-check-circle cinzaColor"></i> ' + (listAtividadesVinculadas.length_check > 1 ? 'Concluir ' + getNameGenre('demanda', 'os outros', 'as outras') + ' ' + listAtividadesVinculadas.length_check + ' ' + __.demandas + ' ' + getNameGenre('demanda', 'vinculados', 'vinculadas') : 'Concluir ' + __.a_outra_demanda_vinculada) + '?</label>' +
                            '                      </td>' +
                            '                      <td style="width: 50px;">' +
                            '                          <div class="onoffswitch" style="float: right;">' +
                            '                              <input type="checkbox" name="onoffswitch" data-target="#listCompleteOtherAtiv" data-act="atividades-call" data-fn="changeOthersAtiv" class="onoffswitch-checkbox singleOptionConfig" id="complete_others" data-key="complete_others" tabindex="0" checked>' +
                            '                              <label class="onoff-switch-label" for="complete_others"></label>' +
                            '                          </div>' +
                            '                      </td>' +
                            '                  </tr>' +
                            '                  <tr style="height: 40px;">' +
                            '                      <td style="vertical-align: bottom; text-align: left;" class="label">' +
                            '                           <label for="dividir_tempo_despendido"><i class="iconPopup iconSwitch fas fa-hourglass-half cinzaColor"></i> Dividir o tempo despendido entre todas as demandas?</label>' +
                            '                      </td>' +
                            '                      <td style="width: 50px;">' +
                            '                          <div class="onoffswitch" style="float: right;">' +
                            '                              <input type="checkbox" name="onoffswitch" data-target="#listCompleteOtherAtiv" data-act="atividades-call" data-fn="changeDadosTrabalho" class="onoffswitch-checkbox singleOptionConfig" id="dividir_tempo_despendido" data-key="dividir_tempo_despendido" tabindex="0" checked>' +
                            '                              <label class="onoff-switch-label" for="dividir_tempo_despendido"></label>' +
                            '                          </div>' +
                            '                      </td>' +
                            '                  </tr>' +
                            '                  <tr style="height: auto;">' +
                            '                      <td colspan="2">' +
                            '                           ' + listAtividadesVinculadas.html +
                            '                      </td>' +
                            '                  </tr>' +
                            '               </table>' +
                            '           </td>' +
                            '      </tr>' +
                            '' : '') +
                        '   </table>' +
                        '</div>';

                    var btnDialogBoxPro = [{
                        text: (value.data_entrega != '0000-00-00 00:00:00') ? 'Editar Conclus\u00E3o' : 'Concluir',
                        class: 'confirm',
                        click: function (event) {
                            if (callAtiv('checkSigleInputDateAtiv_',this)) {
                                if (callAtiv('checkAtivRequiredFields',this, 'mark')) {
                                    if (callAtiv('checkAtivProdutividade',this, value)) {
                                        if (callAtiv('checkAtivChecklist',this, value)) {
                                            sendCompleteAtividade(this, value);
                                        }
                                    }
                                }
                            }
                        }
                    }];
                    if (value.data_entrega != '0000-00-00 00:00:00') {
                        btnDialogBoxPro.unshift({
                            text: 'Gerar Notifica\u00E7\u00E3o',
                            icon: "ui-icon-mail-closed",
                            click: function (event) {
                                callAtiv('notifyAtividade',id_demanda, event);
                            }
                        });
                        if (callAtiv('checkCapacidade','complete_cancel_atividade')) {
                            btnDialogBoxPro.unshift({
                                text: 'Cancelar Conclus\u00E3o',
                                icon: "ui-icon-close",
                                click: function (event) {
                                    completeCancelAtividade(id_demanda);
                                }
                            });
                        }
                    } else {
                        var checkConfigAtiv = jmespath.search(arrayConfigAtividades.atividades, "[?id_atividade==`" + value.id_atividade + "`] | [0].config.desativa_produtividade");
                        if (!checkConfigAtiv && callAtiv('checkCapacidade','pause_atividade')) {
                            var check_ispaused = (typeof value.data_retomada !== 'undefined' && value.data_retomada == '0000-00-00 00:00:00') ? true : false;
                            btnDialogBoxPro.unshift({
                                text: (check_ispaused ? __.Retomar + ' ' + __.Demanda : 'Inserir ' + __.Paralisacao),
                                icon: 'ui-icon-' + (check_ispaused ? 'play' : 'pause'),
                                click: function (event) {
                                    pauseAtividade(id_demanda);
                                }
                            });
                        }
                        if (callAtiv('checkCapacidade','extend_atividade')) {
                            btnDialogBoxPro.unshift({
                                text: __.Prorrogar + ' Prazo',
                                icon: "ui-icon-refresh",
                                click: function (event) {
                                    extendAtividade(id_demanda);
                                }
                            });
                        }
                        if (callAtiv('checkCapacidade','variation_atividade') || callAtiv('checkCapacidade','type_atividade')) {
                            btnDialogBoxPro.unshift({
                                text: (value.tempo_pactuado == 0 ? 'Atribuir ' + __.Atividade : 'Alterar ' + __.Complexidade),
                                icon: (value.tempo_pactuado == 0 ? 'ui-icon-arrowreturnthick-1-n' : 'ui-icon-transferthick-e-w'),
                                click: function (event) {
                                    variationAtividade(id_demanda);
                                }
                            });
                        }
                        btnDialogBoxPro.unshift({
                            text: 'Cancelar In\u00EDcio',
                            icon: "ui-icon-close",
                            click: function (event) {
                                startCancelAtividade(id_demanda);
                            }
                        });
                    }
                    if (callAtiv('checkCapacidade','complete_atividade')) {
                        resetDialogBoxPro('dialogBoxPro');
                        dialogBoxPro = $('#dialogBoxPro')
                            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
                            .dialog({
                                title: 'Concluir ' + __.Demanda + ': ' + callAtiv('getTitleDialogBox',value),
                                width: 780,
                                open: function () {
                                    updateButtonConfirm(this, true);
                                    $('#ativ_data_entrega').trigger('change');
                                    callAtiv('updateServerTemposDemanda','set', 'tempo_planejado', value);
                                    if (callAtiv('checkOptionEntidade','exigir_homologacao_programas')) callAtiv('updateSelectEntregas',$('#ativ_id_entrega')[0]);
                                },
                                close: function () {
                                    $('#boxAtividade').remove();
                                    callAtiv('cancelMoveKanbanItens',);
                                    callAtiv('cancelSelectedItensAtiv',id_demanda);
                                    resetDialogBoxPro('dialogBoxPro');
                                },
                                buttons: btnDialogBoxPro
                            });
                        if (check_isresumed) { getPausasAtividade(id_demanda) }
                    }
                }
            }
        }
    }
}
export function updateDialogTemposDemanda(this_) {
    var data = $(this_).data();
    var value = callAtiv('getAtividadeData',data.demanda);
    callAtiv('updateServerTemposDemanda',data.set, data.tempo, value);
}
export function toggleTemposLiquidos(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    if (_parent.find('.tempos_liquidos').is(':visible')) {
        _parent.find('.tempos_liquidos').hide();
        _this.attr('class', 'fas fa-chevron-circle-right azulColor');
    } else {
        _parent.find('.tempos_liquidos').show();
        _this.attr('class', 'fas fa-chevron-circle-down azulColor');
    }
    centralizeDialogBox(dialogBoxPro);
}
export function sendCompleteAtividade(this_, value, tempo_parcial = false) {
    var listAtividadesVinculadas = getAtividadesVinculadas(value, 'concluidas');
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var action = (value.data_entrega != '0000-00-00 00:00:00') ? 'complete_edit_atividade' : 'complete_atividade';
    var id_demandas_complete = (listAtividadesVinculadas.length_check > 0 && _parent.find('#complete_others').is(':checked'))
        ? JSON.parse(_parent.find('#lista_complete_others').val())
        : [];
    var param = callAtiv('extractDataAtiv',this_);
    param.action = action;
    param.id_demandas_complete = id_demandas_complete;
    param.id_demanda = value.id_demanda;
    param.id_unidade = value.id_unidade;
    param.return_tempo_parcial = (tempo_parcial) ? { id_demanda: value.id_demanda, tempo_pactuado_original: value.tempo_pactuado, tempo_pactuado: tempo_parcial } : [];
    var id_plano = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + param.id_user + "`] | [0].id_plano");
    id_plano = (id_plano === null) ? 0 : id_plano;
    if (!callAtiv('checkCapacidade','check_entregas_atividades') || typeof param.id_plano === 'undefined') param.id_plano = id_plano;
    getServerAtividades(param, action);
}
export function updateAnotacaoProcesso(anotacao) {
    if ($('#ifrArvore').length > 0) {
        var ifrArvore = $('#ifrArvore').contents();
        var ref = ifrArvore.find('.saveStickNote')[0];
        var ifrArvoreElem = (typeof getIframeArvoreElement === 'function') ? getIframeArvoreElement() : ($('#ifrArvore').length > 0 ? $('#ifrArvore')[0] : null);
        if (ifrArvoreElem && ifrArvoreElem.contentWindow) {
            ifrArvoreElem.contentWindow.sticknoteEdit(ref);
            ifrArvoreElem.contentWindow.sticknoteUpdate(ref, anotacao, 'save', false, 'increment');
        }
    }
}
export function checkboxAnotacoesProcessoAtiv(this_) {
    var _this = $(this_);
    var _parent = _this.closest('tr');
    if (checkValue(_this)) {
        _parent.find('#tableAnotacoesProcessoAtiv').show();
    } else {
        _parent.find('#tableAnotacoesProcessoAtiv').hide();
    }
}
export function getPausasAtividadeCalc(pausa_lista = false, mode = 'despendido') {
    var _parent = $('#boxAtividade.atividadeWork');
    var value = (typeof _parent !== 'undefined') ? callAtiv('getAtividadeData',_parent.data('demanda')) : false;
    if (value) {
        pausa_lista = !pausa_lista ? value.pausa_lista : pausa_lista;
        var user = _parent.find('#ativ_id_user');
        var data_inicio = (mode == 'despendido') ? _parent.find('input[data-type="inicio"]') : _parent.find('input[data-type="distribuicao"]');
        var data_fim = _parent.find('#ativ_data_entrega');
        var tempo = (mode == 'despendido') ? _parent.find('input[data-type="tempo"]') : _parent.find('input[data-type="tempo_executado"]');

        var config_entidade = jmespath.search(arrayConfigAtividades.entidades, "[?id_entidade==`" + arrayConfigAtividades.perfil.id_entidade + "`] |[0].config");
        config_entidade = (config_entidade !== null) ? config_entidade : false;
        var carga_horaria_padrao = (config_entidade && typeof config_entidade.carga_horaria_padrao !== 'undefined' && config_entidade.carga_horaria_padrao !== null) ? config_entidade.carga_horaria_padrao : 8;

        var config_user = (user.is('select')) ? user.find('option:selected').data('config') : user.data('config');
        config_user = (typeof config_user !== 'undefined') ? config_user : { carga_horaria: carga_horaria_padrao };
        var config_unidade = callAtiv('getBoxConfigDadosUnidade',_parent);

        var config_user_perfil = (arrayConfigAtividades.perfil.hasOwnProperty('config') && arrayConfigAtividades.perfil.config !== null) ? arrayConfigAtividades.perfil.config : false;
        var h_util_inicio = (config_user_perfil && config_user_perfil.hasOwnProperty('distribuicao') && config_user_perfil.distribuicao.hasOwnProperty('horario_util')) ? config_user_perfil.distribuicao.horario_util.inicio : config_unidade.h_util_inicio;
        var h_util_fim = (config_user_perfil && config_user_perfil.hasOwnProperty('distribuicao') && config_user_perfil.distribuicao.hasOwnProperty('horario_util')) ? config_user_perfil.distribuicao.horario_util.fim : config_unidade.h_util_fim;

        var config_feriados = (typeof config_unidade.feriados !== 'undefined' && config_unidade.feriados !== null) ? config_unidade.feriados : false;
        var arrayFeriados = (config_unidade.count_dias_uteis && data_inicio.val() != '' && data_fim.val() != '')
            ? jmespath.search(getHolidayBetweenDates(moment(data_inicio.val(), 'YYYY-MM-DD HH:mm:ss').format('Y') + '-01-01', moment(data_fim.val(), 'YYYY-MM-DD HH:mm:ss').add(1, 'Y').format('Y') + '-01-01', config_feriados), "[*].d_")
            : [];

        function getCalcPausasDt(initData, endData, value) {
            var valueDias = (config_unidade.count_dias_uteis)
                ? moment().isoWeekdayCalc({
                    rangeStart: initData,
                    rangeEnd: endData,
                    weekdays: [1, 2, 3, 4, 5],
                    exclusions: arrayFeriados
                }) - 1
                : moment(endData, 'YYYY-MM-DD HH:mm:ss').diff(moment(initData, 'YYYY-MM-DD HH:mm:ss'), 'days');
            valueDias = (valueDias < 0) ? 0 : valueDias;
            var h_dataInicio = moment(initData, 'YYYY-MM-DD HH:mm:ss');
            var h_dataFim = moment(endData, 'YYYY-MM-DD HH:mm:ss');
            var h_utilInicio = moment(h_dataFim.format('YYYY-MM-DD') + 'T' + h_util_inicio, 'YYYY-MM-DDTHH:mm');
            var h_utilFim = moment(h_dataInicio.format('YYYY-MM-DD') + 'T' + h_util_fim, 'YYYY-MM-DDTHH:mm');

            var param = {
                id_pausa: value.id_pausa,
                id_demanda: value.id_demanda,
                count_dias_uteis: config_unidade.count_dias_uteis,
                count_horas: config_unidade.count_horas,
                h_dataInicio: h_dataInicio,
                h_dataFim: h_dataFim,
                h_utilInicio: h_utilInicio,
                h_utilFim: h_utilFim,
                carga_horaria: config_user.carga_horaria,
                valueDias: valueDias
            };
            var tempoTrabalho = callAtiv('getTempoTrabalhoAtiv',param);
            return tempoTrabalho;
        }

        if (typeof pausa_lista !== 'undefined' && pausa_lista !== null && pausa_lista.length > 0) {
            var arrayPausas = [];
            var totalDespendido = 0;

            var initData = moment(data_inicio.val(), 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            var endData = pausa_lista[0].data_inicio;
            var initTempoTrabalho = getCalcPausasDt(initData, endData, value);
            if (mode == 'despendido') arrayPausas.push({ type: 'init', tempo_trabalho: initTempoTrabalho });
            totalDespendido = totalDespendido + initTempoTrabalho;

            $.each(pausa_lista, function (i, v) {
                if (typeof pausa_lista[i + 1] !== 'undefined') {
                    var pausaTempoTrabalho = getCalcPausasDt(v.data_fim, pausa_lista[i + 1].data_inicio, value);
                    if (mode == 'despendido') arrayPausas.push({ type: 'loop', tempo_trabalho: pausaTempoTrabalho });
                    totalDespendido = totalDespendido + pausaTempoTrabalho;
                }
            });

            var endTempoTrabalhoInicio = pausa_lista[pausa_lista.length - 1].data_fim;
            var endTempoTrabalhoFim = moment(data_fim.val(), 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            var endTempoTrabalho = getCalcPausasDt(endTempoTrabalhoInicio, endTempoTrabalhoFim, value);
            if (mode == 'despendido') arrayPausas.push({ type: 'end', tempo_trabalho: endTempoTrabalho });
            totalDespendido = totalDespendido + endTempoTrabalho;

            if (totalDespendido > 0) {
                // tempo_despendido.val(parseFloat(totalDespendido.toFixed(1)));
                callAtiv('checkTempoProdutividade',tempo);
                var data_inicio_min = jmespath.search(pausa_lista, "[].data_inicio").reduce(function (a, b) { return a < b ? a : b; });
                var data_fim_max = jmespath.search(pausa_lista, "[].data_fim").reduce(function (a, b) { return a > b ? a : b; });
                data_inicio.attr('max', data_inicio_min.replace(' ', 'T').slice(0, -3)).data('date-max', 'fixed').data('name', 'data de ' + __.retomada);
                data_fim.attr('min', data_fim_max.replace(' ', 'T').slice(0, -3)).data('date-min', 'fixed');
            } else {
                data_inicio.attr('max', data_fim.val()).data('date-max', '').data('name', 'data de in\u00EDcio');
                data_fim.attr('min', data_inicio.val()).data('date-min', '');
            }

            // _parent.find('#ativ_dias_despendido').trigger('change');
            if (mode == 'despendido') {
                _parent.find('#manPauseAtividade').unbind().on('click', function () {
                    getPausasAtividadePanel(value, arrayPausas, totalDespendido);
                });
            }
            // console.log(totalDespendido, arrayPausas, pausa_lista);

            return totalDespendido;
        } else {
            if (typeof tempo.data('tempo-geral') !== 'undefined') { tempo.val(tempo.data('tempo-geral')) }
            return false;
        }
    } else {
        return false;
    }
}
export function getPausasAtividadeCalc_(pause_lista) {
    var _parent = $('#boxAtividade.atividadeWork');
    var user = _parent.find('#ativ_id_user');
    var data_inicio = _parent.find('#ativ_data_inicio');
    var data_fim = _parent.find('#ativ_data_entrega');
    var tempo_despendido = _parent.find('#ativ_tempo_despendido');
    var tempo_pausado = _parent.find('#ativ_tempo_pausado');
    var config_user = (user.is('select')) ? user.find('option:selected').data('config') : user.data('config');
    config_user = (typeof config_user !== 'undefined') ? config_user : { carga_horaria: carga_horaria_padrao };
    var config_unidade = callAtiv('getBoxConfigDadosUnidade',_parent);

    var config_user_perfil = (arrayConfigAtividades.perfil.hasOwnProperty('config') && arrayConfigAtividades.perfil.config !== null) ? arrayConfigAtividades.perfil.config : false;
    var h_util_inicio = (config_user_perfil && config_user_perfil.hasOwnProperty('distribuicao') && config_user_perfil.distribuicao.hasOwnProperty('horario_util')) ? config_user_perfil.distribuicao.horario_util.inicio : config_unidade.h_util_inicio;
    var h_util_fim = (config_user_perfil && config_user_perfil.hasOwnProperty('distribuicao') && config_user_perfil.distribuicao.hasOwnProperty('horario_util')) ? config_user_perfil.distribuicao.horario_util.fim : config_unidade.h_util_fim;
    // console.log('config_user_perfil', config_user_perfil);

    if (typeof pause_lista !== 'undefined' && pause_lista.length > 0) {
        var arrayPausas = [];
        var totalPausas = 0;

        $.each(pause_lista, function (index, value) {
            var config_feriados = (typeof config_unidade.feriados !== 'undefined' && config_unidade.feriados !== null) ? config_unidade.feriados : false;
            var arrayFeriados = (config_unidade.count_dias_uteis && value.data_inicio != '' && value.data_fim != '')
                ? jmespath.search(getHolidayBetweenDates(moment(value.data_inicio, 'YYYY-MM-DD HH:mm:ss').format('Y') + '-01-01', moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss').add(1, 'Y').format('Y') + '-01-01', config_feriados), "[*].d_")
                : [];
            var valueDias = (config_unidade.count_dias_uteis)
                ? moment().isoWeekdayCalc({
                    rangeStart: value.data_inicio,
                    rangeEnd: value.data_fim,
                    weekdays: [1, 2, 3, 4, 5],
                    exclusions: arrayFeriados
                }) - 1
                : moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss').diff(moment(value.data_inicio, 'YYYY-MM-DD HH:mm:ss'), 'days');
            valueDias = (valueDias < 0) ? 0 : valueDias;
            var h_dataInicio = moment(value.data_inicio, 'YYYY-MM-DD HH:mm:ss');
            var h_dataFim = moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss');
            var h_utilInicio = moment(h_dataFim.format('YYYY-MM-DD') + 'T' + h_util_inicio, 'YYYY-MM-DDTHH:mm');
            var h_utilFim = moment(h_dataInicio.format('YYYY-MM-DD') + 'T' + h_util_fim, 'YYYY-MM-DDTHH:mm');

            var check_lastPrevDay = (index != 0 && h_dataInicio.diff(moment(pause_lista[index - 1].data_fim, 'YYYY-MM-DD HH:mm:ss'), 'days') == 0)
                ? moment.duration(
                    moment(pause_lista[index - 1].data_fim, 'YYYY-MM-DD HH:mm:ss')
                        .diff(moment(moment(pause_lista[index - 1].data_fim, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + 'T' + h_util_inicio, 'YYYY-MM-DDTHH:mm'))
                ).asHours()
                : false;
            check_lastPrevDay = (check_lastPrevDay > config_user.carga_horaria) ? config_user.carga_horaria : check_lastPrevDay;
            var check_firstCurrentDay = moment.duration(h_utilFim.diff(h_dataInicio)).asHours();
            check_firstCurrentDay = (check_firstCurrentDay > config_user.carga_horaria) ? config_user.carga_horaria : check_firstCurrentDay;
            var check_prevDay_currentDay = (check_lastPrevDay) ? ((check_lastPrevDay + check_firstCurrentDay) - (config_user.carga_horaria)) : false;

            var param = {
                id_pausa: value.id_pausa,
                id_demanda: value.id_demanda,
                count_dias_uteis: config_unidade.count_dias_uteis,
                count_horas: config_unidade.count_horas,
                h_dataInicio: h_dataInicio,
                h_dataFim: h_dataFim,
                h_utilInicio: h_utilInicio,
                h_utilFim: h_utilFim,
                carga_horaria: config_user.carga_horaria,
                valueDias: valueDias,
                last_day: check_lastPrevDay,
                first_day: check_firstCurrentDay,
                diff_day: check_prevDay_currentDay
            };
            var tempoTrabalho = callAtiv('getTempoTrabalhoAtiv',param);
            arrayPausas.push({ param: param, tempo_trabalho: tempoTrabalho });
            totalPausas = totalPausas + tempoTrabalho;
        });
        if (totalPausas > 0) {
            var tempo_despendido_final = tempo_despendido.data('tempo-geral') - totalPausas;
            tempo_despendido_final = parseFloat(tempo_despendido_final.toFixed(1));
            tempo_pausado.val(parseFloat(totalPausas.toFixed(1)));
            tempo_despendido.val(tempo_despendido_final);
            callAtiv('checkTempoProdutividade',tempo_despendido);
            var data_inicio_min = jmespath.search(pause_lista, "[].data_inicio").reduce(function (a, b) { return a < b ? a : b; });
            var data_fim_max = jmespath.search(pause_lista, "[].data_fim").reduce(function (a, b) { return a > b ? a : b; });
            data_inicio.attr('max', data_inicio_min.replace(' ', 'T').slice(0, -3)).data('date-max', 'fixed').data('name', 'data de ' + __.retomada);
            data_fim.attr('min', data_fim_max.replace(' ', 'T').slice(0, -3)).data('date-min', 'fixed');
        } else {
            data_inicio.attr('max', data_fim.val()).data('date-max', '').data('name', 'data de in\u00EDcio');
            data_fim.attr('min', data_inicio.val()).data('date-min', '');
        }

        _parent.find('#ativ_dias_despendido').trigger('change');
        _parent.find('#manPauseAtividade').unbind().on('click', function () {
            getPausasAtividadePanel(arrayPausas);
        });
    } else {
        tempo_pausado.val(0);
        if (typeof tempo_despendido.data('tempo-geral') !== 'undefined') { tempo_despendido.val(tempo_despendido.data('tempo-geral')) }
        tempo_pausado.closest('tr').hide();
    }
    return totalPausas;
}
export function getLabelTempoDespendido() {
    var _parent = $('#boxAtividade.atividadeWork');
    var tempo_despendido = _parent.find('#ativ_tempo_despendido');
    if (tempo_despendido.length > 0) {
        var tempo_decimal = (typeof tempo_despendido.data('tempo-decimal') !== 'undefined') ? tempo_despendido.data('tempo-decimal') : tempo_despendido.val();
        _parent.find('.td_tempo_despendido').attr('data-tempo', decimalHourToMinute(tempo_decimal));
    }
}
export function getPausasAtividade(id_demanda) {
    var action = 'pause_atividade_lista';
    var param = {
        action: action,
        id_demanda: id_demanda
    };
    getServerAtividades(param, action);
}
export function removePausasAtividade(this_) {
    var _this = $(this_);
    var _parent = _this.closest('tr');
    _parent.slideUp();
    var data = _parent.data();
    var action = 'pause_atividade_remove';
    var param = {
        action: action,
        id_demanda: data.demanda,
        id_pausa: data.pausa
    };
    getServerAtividades(param, action);
}
export function getPausasAtividadePanel(value, arrayPausas, totalDespendido) {
    var pausa_lista = value.pausa_lista;
    var textBox = '<table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
        '      <tbody>' +
        '           <tr>' +
        '               <td class="date" style="width: 205px;">' +
        '                   <i class="iconSwitch fas fa-play-circle cinzaColor" style="height: 20px;float: initial;"></i> Data de In\u00EDcio<br>' +
        '                   <input type="datetime-local" style="width: 180px;" value="' + $('#ativ_data_inicio').val() + '" disabled required>' +
        '               </td>' +
        '               <td style="width: 60px;"></td>' +
        '               <td></td>' +
        '               <td></td>' +
        '           </tr>';
    $.each(pausa_lista, function (i, v) {
        textBox +=
            '           <tr>' +
            '               <td></td>' +
            '               <td>' +
            '                   <div style="text-align:center;position: absolute;width: 70px; margin: 0 0 0 -20px;z-index: 9;">' +
            '                       <span style="color: #666;background: #f3f3f3;padding: 5px;border-radius: 5px;">' + decimalHourToMinute(arrayPausas[i].tempo_trabalho) + '</span>' +
            '                   </div>' +
            '                   <div class="hrTempoDir"></div>' +
            '               </td>' +
            '               <td></td>' +
            '               <td></td>' +
            '           </tr>' +
            '           <tr>' +
            '               <td></td>' +
            '               <td></td>' +
            '               <td class="date" style="text-align: right;">' +
            '                   <i class="iconSwitch fas fa-pause-circle cinzaColor" style="height: 20px;"></i> Paralisa\u00E7\u00E3o<br>' +
            '                   <input type="datetime-local" style="width: 180px;" id="ativ_data_pausa" data-key="data_pause" data-type="inicio" data-name="data de ' + __.paralisacao + '" value="' + moment(v.data_inicio).format('YYYY-MM-DDTHH:mm') + '" disabled required>' +
            '               </td>' +
            '               <td></td>' +
            '           </tr>' +
            '           <tr data-pausa="' + v.id_pausa + '" data-demanda="' + value.id_demanda + '">' +
            '               <td></td>' +
            '               <td>' +
            '                   <div style="text-align:center;position: absolute;width: 70px; margin: 0 0 0 -20px;z-index: 9;">' +
            '                       <span style="color: #666;background: #f3f3f3;padding: 5px;border-radius: 5px;">00:00</span>' +
            '                   </div>' +
            '                   <div class="hrTempoEsq"></div>' +
            '               </td>' +
            '               <td></td>' +
            '               <td style="width: 70px;">' +
            '                   <div style="right: 10px;position: absolute;">' +
            '                       <button type="button" data-act="atividades-call" data-fn="removePausasAtividade" class="ui-button ui-corner-all ui-widget"><i class="fas fa-trash cinzaColor" style="font-size: 10pt;"></i></button>' +
            '                   </div>' +
            '               </td>' +
            '           </tr>' +
            '           <tr>' +
            '               <td class="date">' +
            '                   <i class="iconSwitch fas fa-play-circle cinzaColor" style="height: 20px;float: initial;"></i> Retomada<br>' +
            '                   <input type="datetime-local" style="width: 180px;" id="ativ_data_retomada" data-key="data_entrega" data-type="fim" data-name="data de ' + __.retomada + '" value="' + moment(v.data_fim).format('YYYY-MM-DDTHH:mm') + '" disabled required>' +
            '               </td>' +
            '               <td></td>' +
            '               <td></td>' +
            '               <td></td>' +
            '           </tr>';
    });
    textBox +=
        '           <tr>' +
        '               <td></td>' +
        '               <td>' +
        '                   <div style="text-align:center;position: absolute;width: 70px; margin: 0 0 0 -20px;z-index: 9;">' +
        '                       <span style="color: #666;background: #f3f3f3;padding: 5px;border-radius: 5px;">' + decimalHourToMinute(arrayPausas[arrayPausas.length - 1].tempo_trabalho) + '</span>' +
        '                   </div>' +
        '                   <div class="hrTempoDir"></div>' +
        '               </td>' +
        '               <td></td>' +
        '               <td></td>' +
        '           </tr>' +
        '           <tr>' +
        '               <td></td>' +
        '               <td></td>' +
        '               <td class="date" style="text-align: right;">' +
        '                   <i class="iconSwitch fas fa-user-clock cinzaColor" style="height: 20px;"></i> Data de Entrega<br>' +
        '                   <input type="datetime-local" style="width: 180px;" value="' + $('#ativ_data_entrega').val() + '" disabled required>' +
        '               </td>' +
        '               <td></td>' +
        '           </tr>' +
        '           <tr style="height: 40px;">' +
        '               <td colsan="4">' +
        '                   <div style="text-align:center;position: absolute;width: 98%; margin: 0 0 0 -20px;z-index: 9;">' +
        '                       <span style="display: block;height: 25px;">Tempo despendido</span>' +
        '                       <span style="color: #666;background: #f3f3f3;padding: 5px;border-radius: 5px;">' + decimalHourToMinute(totalDespendido) + '</span>' +
        '                   </div>' +
        '               </td>' +
        '           </tr>' +
        '      </tbody>' +
        '</table>';

    resetDialogBoxPro('alertBoxPro');
    alertBoxPro = $('#alertaBoxPro')
        .html('<div class="dialogBoxDiv" style="max-height: 500px;"> ' + textBox + '</span>')
        .dialog({
            width: 570,
            title: 'Gerenciar Paralisa\u00E7\u00F5es',
            close: function () {
                getPausasAtividade(value.id_demanda);
                resetDialogBoxPro('alertBoxPro');
            },
            open: function () {
                updateButtonConfirm(this, true);
                callAtiv('prepareFieldsReplace',this);
                $('#ativ_data_entrega').trigger('change');
            },
            buttons: [{
                text: "Ok",
                class: 'confirm',
                click: function () {
                    getPausasAtividade(value.id_demanda);
                    resetDialogBoxPro('alertBoxPro');
                }
            }]
        });
}
export function completeCancelAtividade(id_demanda) {
    var value = callAtiv('getAtividadeData',id_demanda);
    if (callAtiv('checkCapacidade','complete_cancel_atividade')) {
        confirmaFraseBoxPro(__.A_demanda + ' j\u00E1 foi entregue. Tem certeza que deseja cancelar?', 'CANCELAR', function () {
            var action = 'complete_cancel_atividade';
            var param = {
                action: action,
                id_demanda: id_demanda,
                id_unidade: value.id_unidade
            };
            getServerAtividades(param, action);
        }, function () {
            callAtiv('cancelMoveKanbanItens',);
            callAtiv('cancelSelectedItensAtiv',id_demanda);
        });
    }
}
export function getSignCancelDocumento(this_) {
    var _this = $(this_);
    var data = _this.data();
    var paramData = {
        id_documento: data.id_documento,
        mode: data.mode,
        id_reference: data.id_reference
    };
    signCancelDocumento(paramData);
}
export function signCancelDocumento(paramData) {
    confirmaFraseBoxPro('Tem certeza que deseja cancelar a assinatura do documento?', 'CANCELAR', function () {
        var action = 'sign_cancel_documento';
        var param = {
            action: action,
            id_documento: paramData.id_documento,
            mode: paramData.mode,
            id_reference: paramData.id_reference,
            type: paramData.type
        };
        callAtiv('getConfigServer',action, param);
    });
}
export function checkPageAtividadesVisualizacao() {
    if (perfilLoginAtiv) {
        waitLoadPro($($ifrVisualizacao).contents(), '#frmDocumentoCadastro', infraBarraComandos, startAtividadeNewDoc);
        waitLoadPro($($ifrVisualizacao).contents(), '#frmAtividadeListar[action*="acao=procedimento_enviar"]', infraBarraComandos, sendAtividadesEnviarProcesso);
    }
}
export function startAtividadeNewDoc() {
    var startAtivuser = jmespath.search(arrayAtividadesProcPro, "[?data_inicio=='0000-00-00 00:00:00'] | [?id_user==`" + arrayConfigAtividades.perfil.id_user + "`]");
    if (startAtivuser.length > 0) {
        var htmlTableAtividades = $.map(startAtivuser, function (v, k) {
            var datesAtivHtml = getDatesPreview(callAtiv('getConfigDateAtiv',v));
            datesAtivHtml = (datesAtivHtml != '') ? $(datesAtivHtml).find('.dateBoxIcon')[0].outerHTML : '';
            datesAtivHtml = (datesAtivHtml != '') ? '<span class="dateboxDisplay" data-act="atividades-call" data-fn="actionsAtividade" data-pass-el="0" data-id="' + v.id_demanda + '">' + datesAtivHtml + '</span>' : '';
            return '<div style="margin: 5px 0; display: inline-block; width: 100%;" data-value="' + v.id_demanda + '" title="' + callAtiv('getTitleDialogBox',v, true) + '">' + datesAtivHtml + callAtiv('getTitleDialogBox',v) + '</div>'
        }).join('');
        htmlTableAtividades = '<div style="max-height: 300px;overflow-y: scroll;display: block;font-size: 10pt;position: initial;margin-top: 20px;">' +
            '   ' + htmlTableAtividades +
            '</div>';

        confirmaBoxPro((startAtivuser.length == 1 ? 'Existe ' + __.demanda + ' pendente' : 'Existem ' + __.demandas + ' pendentes') + ' de in\u00EDcio. Deseja iniciar agora?' + htmlTableAtividades, function () { callAtiv('selectAtividadeBox','start') }, 'Iniciar...');
    }
}
export function sendAtividadesEnviarProcesso() {
    var sendAtivList = jmespath.search(arrayAtividadesProcPro, "[?data_envio=='0000-00-00 00:00:00'] | [?data_avaliacao!='0000-00-00 00:00:00'] | [?id_unidade==`" + arrayConfigAtivUnidade.id_unidade + "`]");
    // var sendAtivList = jmespath.search(arrayAtividadesProcPro, "[?data_envio=='0000-00-00 00:00:00']");

    if (sendAtivList.length > 0) {
        var htmlTableAtividades = $.map(sendAtivList, function (v, k) {
            var datesAtivHtml = getDatesPreview(callAtiv('getConfigDateAtiv',v));
            datesAtivHtml = (datesAtivHtml != '') ? $(datesAtivHtml).find('.dateBoxIcon')[0].outerHTML : '';
            datesAtivHtml = (datesAtivHtml != '') ? '<span class="dateboxDisplay" data-act="atividades-call" data-fn="actionsAtividade" data-pass-el="0" data-id="' + v.id_demanda + '">' + datesAtivHtml + '</span>' : '';
            return '<div style="margin: 5px 0; display: inline-block; width: 100%;" data-value="' + v.id_demanda + '" title="' + callAtiv('getTitleDialogBox',v, true) + '">' + datesAtivHtml + callAtiv('getTitleDialogBox',v) + '</div>'
        }).join('');
        htmlTableAtividades = '<div style="max-height: 300px;overflow-y: scroll;display: block;font-size: 10pt;position: initial;margin-top: 20px;">' +
            '   ' + htmlTableAtividades +
            '</div>';
        confirmaBoxPro((sendAtivList.length == 1 ? 'Existe ' + __.demanda + ' pendente' : 'Existem ' + __.demandas + ' pendentes') + ' de ' + __.arquivamento + '. Deseja ' + __.arquivar + ' agora?' + htmlTableAtividades, archiveAtividade, __.Arquivar + '...');
    }
}
export function startAtividade(id_demanda = 0) {
    var dadosIfrArvore = getIfrArvoreDadosProcesso();
    var value = callAtiv('getAtividadeData',id_demanda);
    var id_plano_check = checkRegularizaPlano(value);
    if (id_plano_check) {
        callAtiv('regularizaPlano',false, { id_plano: id_plano_check, refplano: 'anterior' });
    } else {
        if (!checkSignDocsPlano(value)) {
            alertSignDocsPlano(value);
        } else {
            var config_unidade = callAtiv('getConfigDadosUnidade',value.sigla_unidade);
            var dataInicio = (dadosIfrArvore)
                ? (dadosIfrArvore.versao)
                    ? moment(dadosIfrArvore.versao, 'DD/MM/YYYY HH:mm').format(config_unidade.hora_format)
                    : moment().format(config_unidade.hora_format)
                : moment().format(config_unidade.hora_format);
            dataInicio = (moment(dataInicio, config_unidade.hora_format) < moment(dataDistribuicao, config_unidade.hora_format))
                ? (moment(dataDistribuicao, config_unidade.hora_format) < moment()) ? moment().format(config_unidade.hora_format) : dataDistribuicao
                : dataInicio;
            var prazoEntrega = (value.recalcula_prazo == 1)
                ? getRecalculaPrazo(dataInicio, config_unidade.hora_format, value.dias_planejado, config_unidade)
                : '';

            var listAtividadesVinculadas = getAtividadesVinculadas(value, 'iniciadas');

            var listAtividadesIniciadas = (value.id_user != 0) ? jmespath.search(arrayAtividadesPro, "[?data_inicio!='0000-00-00 00:00:00'] | [?data_entrega=='0000-00-00 00:00:00'] | [?data_retomada==null || data_retomada!='0000-00-00 00:00:00'] | [?id_user==`" + value.id_user + "`]") : null;
            listAtividadesIniciadas = (listAtividadesIniciadas !== null) ? listAtividadesIniciadas : false;
            if (listAtividadesIniciadas && listAtividadesIniciadas.length > 0) {
                var htmlTableAtividades = $.map(listAtividadesIniciadas, function (v, k) {
                    var datesAtivHtml = getDatesPreview(callAtiv('getConfigDateAtiv',v));
                    datesAtivHtml = (datesAtivHtml != '') ? $(datesAtivHtml).find('.dateBoxIcon')[0].outerHTML : '';
                    datesAtivHtml = (datesAtivHtml != '') ? '<span class="dateboxDisplay" data-act="atividades-call" data-fn="actionsAtividade" data-pass-el="0" data-id="' + v.id_demanda + '">' + datesAtivHtml + '</span>' : '';
                    return '<div style="margin: 5px 0; display: inline-block; width: 100%;" data-value="' + v.id_demanda + '" title="' + callAtiv('getTitleDialogBox',v, true) + '">' + datesAtivHtml + callAtiv('getTitleDialogBox',v) + '</div>'
                }).join('');
                htmlTableAtividades = '<div id="listPauseOtherAtiv" style="max-height: 300px;overflow-y: scroll;display: none;font-size: 10pt;position: initial;">' +
                    '   ' + htmlTableAtividades +
                    '</div>';
                var inputPauseOthers = jmespath.search(listAtividadesIniciadas, "[*].{id: id_demanda, id_unidade: id_unidade}");
                inputPauseOthers = (inputPauseOthers !== null) ? "<input type='hidden' id='lista_pause_others' data-key='lista_pause_others' data-param='lista_pause_others' value='" + JSON.stringify(inputPauseOthers) + "'>" : '';
            } else {
                var inputPauseOthers = '';
                var htmlTableAtividades = '';
            }

            var dataDistribuicao_vinculadas = (listAtividadesVinculadas.length_check > 0) ? jmespath.search(arrayAtividadesPro, "reverse(sort_by([?id_vinculacao=='" + value.id_vinculacao + "'] | [?data_inicio=='0000-00-00 00:00:00'], &data_distribuicao)) | [*].data_distribuicao | [0]") : null;
            var dataDistribuicao = (dataDistribuicao_vinculadas !== null) ? moment(dataDistribuicao_vinculadas, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format) : moment(value.data_distribuicao, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format);

            var optionSelectResponsavel = '';
            if (callAtiv('checkCapacidade','select_user_atividade') && value.id_user == 0) {
                var arrayResp = jmespath.search(arrayConfigAtividades.planos, "[?sigla_unidade=='" + value.sigla_unidade + "']");
                optionSelectResponsavel += callAtiv('getOptionsSelectResp',arrayResp, value);
            }
            // console.log(checkCapacidade('select_user_atividade'), value.id_user, optionSelectResponsavel);
            var htmlSelectResponsavel = (optionSelectResponsavel != '')
                ? '      <tr>' +
                '          <td style="vertical-align: bottom; text-align: left; width: 140px;" class="label">' +
                '               <label for="ativ_id_user"><i class="iconPopup iconSwitch fas fa-user-tie cinzaColor"></i>Respons\u00E1vel:</label>' +
                '           </td>' +
                '           <td class="required date">' +
                '               <select id="ativ_id_user" class="requiredSelect" data-key="id_user" required><option>&nbsp;</option>' + optionSelectResponsavel + '</select>' +
                '           </td>' +
                '      </tr>'
                : '';

            var htmlBox = '<div id="boxAtividade" class="seipro-atividades-box atividadeWork seipro-atividades-work" data-demanda="' + (value && value.id_demanda ? value.id_demanda : 0) + '">' +
                '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
                '      ' + htmlSelectResponsavel +
                '      <tr>' +
                '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                '               <label for="ativ_data_inicio"><i class="iconPopup iconSwitch fas fa-play-circle cinzaColor"></i>Data de In\u00EDcio ' + __.da_Demanda + ':</label>' +
                '           </td>' +
                '           <td class="required date">' +
                '               <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-composite" data-chain="checkSigleInputDateAtiv|updateRecalculaPrazo" id="ativ_data_inicio" data-key="data_inicio" data-type="inicio" data-name="data de in\u00EDcio" data-name-min="data de distribui\u00E7\u00E3o" value="' + dataInicio + '" min="' + dataDistribuicao + '" required>' +
                '           </td>' +
                '      </tr>' +
                (listAtividadesIniciadas && listAtividadesIniciadas.length > 0 ?
                    '      <tr>' +
                    '           <td colspan="2">' +
                    '               ' + inputPauseOthers +
                    '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
                    '                  <tr style="height: 40px;">' +
                    '                      <td style="text-align: left;">' +
                    '                           <label><i class="iconPopup fas fa-pause-circle cinzaColor"></i> ' + (listAtividadesIniciadas.length > 1 ? __.Paralisar + ' ' + getNameGenre('demanda', 'os', 'as') + ' ' + listAtividadesIniciadas.length + ' ' + __.demandas + ' j\u00E1 ' + getNameGenre('demanda', 'iniciados', 'iniciadas') : __.Paralisar + ' ' + __.a_demanda + ' j\u00E1 ' + getNameGenre('demanda', 'iniciado', 'iniciada')) + ' ' + (arrayConfigAtividades.perfil.id_user != value.id_user ? 'por ' + value.apelido : 'por mim') + '?</label>' +
                    '                      </td>' +
                    '                      <td>' +
                    '                          <div class="onoffswitch" style="float: right;">' +
                    '                              <input type="checkbox" name="onoffswitch" data-target="#listPauseOtherAtiv" data-act="atividades-call" data-fn="changeOthersAtiv" class="onoffswitch-checkbox singleOptionConfig" id="pause_others" data-key="pause_others" tabindex="0">' +
                    '                              <label class="onoff-switch-label" for="pause_others"></label>' +
                    '                          </div>' +
                    '                      </td>' +
                    '                  </tr>' +
                    '                  <tr style="height: auto;">' +
                    '                      <td colspan="2">' +
                    '                           ' + htmlTableAtividades +
                    '                      </td>' +
                    '                  </tr>' +
                    '               </table>' +
                    '           </td>' +
                    '      </tr>' +
                    '' : '') +
                (value.recalcula_prazo == 1 ?
                    '      <tr>' +
                    '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                    '               <label for="ativ_prazo_entrega"><i class="iconPopup iconSwitch fas fa-business-time cinzaColor"></i>Prazo de Entrega (Recalculado):</label>' +
                    '           </td>' +
                    '           <td class="required date">' +
                    '               <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" id="ativ_prazo_entrega" data-dias-planejado="' + value.dias_planejado + '" data-dias-uteis="' + config_unidade.count_dias_uteis + '" data-format-date="' + config_unidade.hora_format + '" data-key="prazo_entrega" value="' + prazoEntrega + '" required disabled>' +
                    '           </td>' +
                    '      </tr>' +
                    '' : '') +
                (listAtividadesVinculadas.length_check > 0 ?
                    '      <tr>' +
                    '           <td colspan="2">' +
                    '               ' + listAtividadesVinculadas.input +
                    '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
                    '                  <tr style="height: 40px;">' +
                    '                      <td style="vertical-align: bottom; text-align: left;" class="label">' +
                    '                           <label for="init_others"><i class="iconPopup fas fa-play-circle cinzaColor"></i> ' + (listAtividadesVinculadas.length_check > 1 ? 'Iniciar ' + getNameGenre('demanda', 'os outros', 'as outras') + ' ' + listAtividadesVinculadas.length_check + ' ' + __.demandas + ' ' + getNameGenre('demanda', 'vinculados', 'vinculadas') : 'Iniciar ' + __.a_outra_demanda_vinculada) + '?</label>' +
                    '                      </td>' +
                    '                      <td style="width: 50px;">' +
                    '                          <div class="onoffswitch" style="float: right;">' +
                    '                              <input type="checkbox" name="onoffswitch" data-target="#listInitOtherAtiv" data-id_demanda="' + value.id_demanda + '" data-act="atividades-call" data-fn="changeOthersAtiv" class="onoffswitch-checkbox singleOptionConfig" id="init_others" data-key="init_others" tabindex="0" checked>' +
                    '                              <label class="onoff-switch-label" for="init_others"></label>' +
                    '                          </div>' +
                    '                      </td>' +
                    '                  </tr>' +
                    '                  <tr style="height: auto;">' +
                    '                      <td colspan="2">' +
                    '                           ' + listAtividadesVinculadas.html +
                    '                      </td>' +
                    '                  </tr>' +
                    '               </table>' +
                    '           </td>' +
                    '      </tr>' +
                    '' : '') +
                '   </table>' +
                '</div>';

            var btnDialogBoxPro = [{
                text: 'Iniciar',
                class: 'confirm',
                click: function (event) {
                    if (callAtiv('checkSigleInputDateAtiv_',this)) {
                        if (callAtiv('checkAtivRequiredFields',this, 'mark')) {
                            var _parent = $(this).closest('.ui-dialog');
                            var data_inicio = moment(_parent.find('#ativ_data_inicio').val(), config_unidade.hora_format).format('YYYY-MM-DD HH:mm:ss');
                            var prazo_entrega = (_parent.find('#ativ_prazo_entrega').length > 0)
                                ? moment(_parent.find('#ativ_prazo_entrega').val(), config_unidade.hora_format).format('YYYY-MM-DD HH:mm:ss')
                                : false;
                            var id_user = (callAtiv('checkCapacidade','select_user_atividade') && value.id_user == 0)
                                ? _parent.find('#ativ_id_user').val()
                                : (value.id_user == 0)
                                    ? parseInt(arrayConfigAtividades.perfil.id_user)
                                    : value.id_user;
                            id_user = (id_user == 0 || typeof id_user === 'undefined') ? parseInt(arrayConfigAtividades.perfil.id_user) : id_user;

                            var id_demandas_pause = (listAtividadesIniciadas && listAtividadesIniciadas.length > 0 && _parent.find('#pause_others').is(':checked'))
                                ? JSON.parse(_parent.find('#lista_pause_others').val())
                                : [];
                            var id_demandas_init = (listAtividadesVinculadas && listAtividadesVinculadas.length_check > 0 && _parent.find('#init_others').is(':checked'))
                                ? JSON.parse(_parent.find('#lista_init_others').val())
                                : [];
                            var action = 'start_atividade';
                            var id_plano = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + id_user + "`] | [0].id_plano");
                            id_plano = (id_plano === null) ? 0 : id_plano;
                            id_plano = !callAtiv('checkCapacidade','check_entregas_atividades') || value.id_plano == 0 ? id_plano : value.id_plano;

                            var param = {
                                id_demanda: value.id_demanda,
                                id_demandas_pause: id_demandas_pause,
                                id_demandas_init: id_demandas_init,
                                id_user: id_user,
                                id_plano: id_plano,
                                id_unidade: value.id_unidade,
                                data_inicio: data_inicio,
                                prazo_entrega: prazo_entrega,
                                action: action
                            };
                            getServerAtividades(param, action);
                        }
                    }
                }
            }];

            if (callAtiv('checkCapacidade','edit_atividade')) {
                btnDialogBoxPro.unshift({
                    text: 'Editar ' + __.Demanda,
                    icon: 'ui-icon-pencil',
                    click: function (event) {
                        callAtiv('saveAtividade',id_demanda);
                    }
                });
            }

            if (callAtiv('checkCapacidade','start_atividade')) {
                resetDialogBoxPro('dialogBoxPro');
                dialogBoxPro = $('#dialogBoxPro')
                    .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
                    .dialog({
                        title: 'Iniciar ' + __.Demanda + ': ' + callAtiv('getTitleDialogBox',value),
                        width: 550,
                        open: function () {
                            updateButtonConfirm(this, true);
                            callAtiv('checkSigleInputDateAtiv_',this);
                            callAtiv('prepareFieldsReplace',this);
                        },
                        close: function () {
                            $('#boxAtividade').remove();
                            callAtiv('cancelMoveKanbanItens',);
                            callAtiv('cancelSelectedItensAtiv',id_demanda);
                            resetDialogBoxPro('dialogBoxPro');
                        },
                        buttons: btnDialogBoxPro
                    });
            }
        }
    }
}
export function alertSignDocsPlano(value) {
    confirmaBoxPro('Plano de Trabalho pendente de assinatura! Deseja assinar agora?', function () {
        initClassicEditor();
        var type_documento = !callAtiv('getOptionEntidade','tipo_vinculacao_termo') || callAtiv('getOptionEntidade','tipo_vinculacao_termo') == 1 ? 'planos' : 'termos';
        var plano = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + value.id_user + "`] | [0]");
        var _this = '<a data-type="' + type_documento + '" data-sign="true" data-user="' + value.id_user + '" data-id_reference="' + plano.id_reference + '" data-icon="pencil-alt" data-action="view" data-mode="modelo_termo_adesao" data-title="Termo de Ades\u00E3o" data-act="atividades-call" data-fn="editModelConfigItem">';
        _this = $(_this).get(0);
        callAtiv('editModelConfigItem',_this);
    }, 'Visualizar Termo');
}
export function checkRegularizaPlano(value) {
    var plano = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + value.id_user + "`] | [0]");
    var assinatura = (value.id_user != 0 && typeof plano !== 'undefined' && plano !== null && typeof plano.config !== 'undefined' && plano.config !== null && typeof plano.config.assinatura !== 'undefined' && plano.config.hasOwnProperty('assinatura')) ? plano.config.assinatura : false;
    if (value.id_user != 0 && !assinatura && typeof plano !== 'undefined' && plano !== null && plano.vigencia && plano.pendencias_plano && plano.pendencias_plano.anterior && !plano.pendencias_plano.anterior.homologavel) {
        return plano.id_plano;
    } else {
        return false;
    }
}
export function checkSignDocsPlano(value) {
    var plano = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + value.id_user + "`] | [0]");
    var modalidade = (plano !== null && plano.hasOwnProperty('id_tipo_modalidade')) ? jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?id_tipo_modalidade==`" + plano.id_tipo_modalidade + "`] | [0]") : null;
    var modalidade_config = modalidade !== null && modalidade.hasOwnProperty('config') && typeof modalidade.config !== 'undefined' && modalidade.config !== null ? modalidade.config : false;
    var require_sign = (modalidade_config && modalidade_config.hasOwnProperty('exige_assinatura')) ? modalidade_config.exige_assinatura : false;
    var assinatura = (plano !== null && plano.hasOwnProperty('config') && typeof plano.config !== 'undefined' && plano.config !== null && typeof plano.config.assinatura !== 'undefined' && plano.config.hasOwnProperty('assinatura')) ? plano.config.assinatura : false;
    return (!require_sign || (require_sign && assinatura)) ? true : false;
}
export function getAtividadesVinculadas(value, mode) {
    var queryDemandas = (mode == 'iniciadas') ? "| [?data_inicio=='0000-00-00 00:00:00']" : "";
    queryDemandas = (mode == 'concluidas' || mode == 'pausadas') ? "| [?data_inicio!='0000-00-00 00:00:00'] | [?data_entrega=='0000-00-00 00:00:00'] | [?data_retomada!='0000-00-00 00:00:00']" : queryDemandas;
    queryDemandas = (mode == 'avaliadas') ? "| [?data_entrega!='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00']" : queryDemandas;
    queryDemandas = (mode == 'retomadas') ? "| [?data_inicio!='0000-00-00 00:00:00'] | [?data_entrega=='0000-00-00 00:00:00'] | [?data_retomada=='0000-00-00 00:00:00']" : queryDemandas;

    var label = (mode == 'iniciadas') ? { input: 'lista_init_others', list_id: 'listInitOtherAtiv' } : '';
    label = (mode == 'concluidas') ? { input: 'lista_complete_others', list_id: 'listCompleteOtherAtiv' } : label;
    label = (mode == 'avaliadas') ? { input: 'lista_rate_others', list_id: 'listRateOtherAtiv' } : label;
    label = (mode == 'pausadas' || mode == 'retomadas') ? { input: 'lista_pause_others', list_id: 'listPauseOtherAtiv' } : label;


    var arrayAtividades = ($('#ifrArvore').length > 0) ? arrayAtividadesProcPro : arrayAtividadesPro;

    var listAtividadesVinculadas = (typeof value.id_user !== 'undefined' && value.id_user !== null && value.id_user != 0 && typeof value.id_vinculacao !== 'undefined' && value.id_vinculacao !== null) ? jmespath.search(arrayAtividades, "[?id_vinculacao=='" + value.id_vinculacao + "'] " + queryDemandas + " | [?id_demanda!=`" + value.id_demanda + "`]") : null;
    var checkAtividadesVinculadas = (listAtividadesVinculadas !== null && listAtividadesVinculadas.length > 0) ? true : false;
    if (checkAtividadesVinculadas) {
        var htmlTableAtiv = $.map(listAtividadesVinculadas, function (v, k) {
            var datesAtivHtml = getDatesPreview(callAtiv('getConfigDateAtiv',v));
            datesAtivHtml = (datesAtivHtml != '') ? $(datesAtivHtml).find('.dateBoxIcon')[0].outerHTML : '';
            datesAtivHtml = (datesAtivHtml != '') ? '<span class="dateboxDisplay" data-act="atividades-call" data-fn="actionsAtividade" data-pass-el="0" data-id="' + v.id_demanda + '">' + datesAtivHtml + '</span>' : '';
            return '<div style="margin: 5px 0; display: inline-block; width: 100%;" data-value="' + v.id_demanda + '" title="' + callAtiv('getTitleDialogBox',v, true) + '">' + datesAtivHtml + callAtiv('getTitleDialogBox',v) + '</div>'
        }).join('');
        htmlTableAtiv = '<div id="' + label.list_id + '" style="max-height: 300px;overflow-y: scroll;font-size: 9pt;position: initial;">' +
            '   ' + htmlTableAtiv +
            '</div>';
        var inputOthers = jmespath.search(listAtividadesVinculadas, "[*].{id: id_demanda, id_unidade: id_unidade}");
        inputOthers = (inputOthers !== null) ? "<input type='hidden' id='" + label.input + "' data-key='" + label.input + "' data-param='" + label.input + "' value='" + JSON.stringify(inputOthers) + "'>" : '';
        var lengtOthers = listAtividadesVinculadas.length;
    } else {
        var inputOthers = '';
        var htmlTableAtiv = '';
        var lengtOthers = 0;
    }
    return { input: inputOthers, html: htmlTableAtiv, length_check: lengtOthers };
}
export function changeOthersAtiv(this_, target) {
    var _this = $(this_);
    var target = _this.data('target');
    var _parent = _this.closest('.ui-dialog');
    if (_this.is(':checked')) {
        _parent.find(target).show();
    } else {
        _parent.find(target).hide();
    }
    if (_this.attr('id') == 'init_others') {
        var id_demanda = _this.data('id_demanda');
        var value = callAtiv('getAtividadeData',id_demanda);
        var config_unidade = callAtiv('getConfigDadosUnidade',value.sigla_unidade);
        var dataDistribuicao_vinculadas = (value.id_vinculacao !== null) ? jmespath.search(arrayAtividadesPro, "reverse(sort_by([?id_vinculacao=='" + value.id_vinculacao + "'] | [?data_inicio=='0000-00-00 00:00:00'], &data_distribuicao)) | [*].data_distribuicao | [0]") : null;
        var dataDistribuicao = (dataDistribuicao_vinculadas !== null && _this.is(':checked')) ? moment(dataDistribuicao_vinculadas, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format) : moment(value.data_distribuicao, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format);
        _parent.find('#ativ_data_inicio').attr('min', dataDistribuicao);
    }
}
export function pauseOthersAtiv(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    if (_this.is(':checked')) {
        _parent.find('#listPauseOtherAtiv').show();
    } else {
        _parent.find('#listPauseOtherAtiv').hide();
    }
}
export function updateRecalculaPrazo(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var inputPrazoEntrega = _parent.find('#ativ_prazo_entrega');
    var sigla_unidade = (typeof _parent.find('#ativ_id_user').data('config') !== 'undefined') ? _parent.find('#ativ_id_user').data('config').sigla_unidade : null;
    var config_unidade = callAtiv('getConfigDadosUnidade',sigla_unidade);
    if (inputPrazoEntrega.length > 0) {
        // var hora_format = inputPrazoEntrega.data('format-date');
        // var count_dias_uteis = inputPrazoEntrega.data('dias-uteis');
        // var dias_planejado = parseFloat(inputPrazoEntrega.data('dias-planejado'));
        // var arrayFeriados = (count_dias_uteis) 
        // ? jmespath.search(getHolidayBetweenDates(moment(_this.val(), hora_format).format('Y')+'-01-01', moment(_this.val(), hora_format).add(1, 'Y').format('Y')+'-01-01'), "[*].d_")
        // : [];
        // console.log(dias_planejado, count_dias_uteis, arrayFeriados);
        var prazoEntrega = getRecalculaPrazo(_this.val(), inputPrazoEntrega.data('format-date'), parseFloat(inputPrazoEntrega.data('dias-planejado')), config_unidade);
        inputPrazoEntrega.val(prazoEntrega);
    }
}
// getRecalculaPrazo migrada para SeiPro.core.prazos (src/core/prazos.js) — Fase 6
export function pauseAtividade(id_demanda) {
    var value = callAtiv('getAtividadeData',id_demanda);
    var check_ispaused = (typeof value.data_retomada !== 'undefined' && value.data_retomada !== null && value.data_retomada == '0000-00-00 00:00:00') ? true : false;
    var check_isresumed = (typeof value.data_retomada !== 'undefined' && value.data_retomada !== null && value.data_retomada != '0000-00-00 00:00:00') ? true : false;
    // console.log('check_ispaused->',check_ispaused, 'check_isresumed->',check_isresumed);

    var config_unidade = callAtiv('getConfigDadosUnidade',value.sigla_unidade);
    var dataInicio = (check_ispaused)
        ? moment(value.data_pausa, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format)
        : (check_isresumed)
            ? moment(value.data_retomada, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format)
            : moment(value.data_inicio, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format);
    var dataPausa = moment().format(config_unidade.hora_format);
    var txtTitle = (check_ispaused) ? __.Retomar : __.Paralisar;

    var listAtividadesVinculadas = getAtividadesVinculadas(value, (check_ispaused ? 'retomadas' : 'pausadas'));

    var htmlBox = '<div id="boxAtividade" class="seipro-atividades-box atividadeWork seipro-atividades-work" data-demanda="' + value.id_demanda + '">' +
        '   <div style="font-size: 10pt; margin: 10px 0;" class="alertaBoxDisplay">' +
        '       <i class="fas fa-info-circle azulColor" style="margin: 0 5px;"></i>Dica: N\u00E3o \u00E9 necess\u00E1rio ' + __.paralisar + ' ' + __.a_demanda + ' entre as jornadas de trabalho!' +
        '   </div>' +
        '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
        '      <tr>' +
        '          <td style="vertical-align: bottom; text-align: left; width: 150px;" class="label">' +
        '               <label for="ativ_data_pausa"><i class="iconPopup iconSwitch fas fa-' + (check_ispaused ? 'play' : 'pause') + '-circle cinzaColor"></i>Data de ' + (check_ispaused ? 'Retomada' : __.Paralisacao) + ' ' + __.da_Demanda + ':</label>' +
        '           </td>' +
        '           <td class="required date">' +
        '               <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="checkSigleInputDateAtiv" id="ativ_data_pausa" data-key="data_pausa" data-type="inicio" data-name="data de ' + (check_ispaused ? __.retomada : __.paralisacao) + '" data-name-min="data de ' + (check_ispaused ? __.paralisacao : (check_isresumed ? __.retomada : 'in\u00EDcio')) + '" value="' + dataPausa + '" min="' + dataInicio + '" required>' +
        '           </td>' +
        '      </tr>' +
        (listAtividadesVinculadas.length_check > 0 ?
            '      <tr>' +
            '           <td colspan="2">' +
            '               ' + listAtividadesVinculadas.input +
            '               <table style="font-size: 10pt;width: 100%; margin: 10px 0;" class="seiProForm">' +
            '                  <tr style="height: 40px;">' +
            '                      <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '                           <label for="pause_others"><i class="iconPopup fas fa-' + (check_ispaused ? 'play' : 'pause') + '-circle cinzaColor"></i> ' + (listAtividadesVinculadas.length_check > 1 ? txtTitle + ' ' + getNameGenre('demanda', 'os outros', 'as outras') + ' ' + listAtividadesVinculadas.length_check + ' ' + __.demandas + ' ' + getNameGenre('demanda', 'vinculados', 'vinculadas') : txtTitle + ' ' + __.a_outra_demanda_vinculada) + '?</label>' +
            '                      </td>' +
            '                      <td style="width: 50px;">' +
            '                          <div class="onoffswitch" style="float: right;">' +
            '                              <input type="checkbox" name="onoffswitch" data-target="#listPauseOtherAtiv" data-act="atividades-call" data-fn="changeOthersAtiv" class="onoffswitch-checkbox singleOptionConfig" id="pause_others" data-key="pause_others" tabindex="0" checked>' +
            '                              <label class="onoff-switch-label" for="pause_others"></label>' +
            '                          </div>' +
            '                      </td>' +
            '                  </tr>' +
            '                  <tr style="height: auto;">' +
            '                      <td colspan="2">' +
            '                           ' + listAtividadesVinculadas.html +
            '                      </td>' +
            '                  </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '' : '') +
        '   </table>' +
        '</div>';

    if (callAtiv('checkCapacidade','pause_atividade') && value !== null) {
        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: txtTitle + ' ' + __.Demanda + ': ' + callAtiv('getTitleDialogBox',value),
                width: 550,
                open: function () {
                    updateButtonConfirm(this, true);
                    callAtiv('checkSigleInputDateAtiv_',this);
                    callAtiv('prepareFieldsReplace',this);
                },
                close: function () {
                    $('#boxAtividade').remove();
                    callAtiv('cancelMoveKanbanItens',);
                    callAtiv('cancelSelectedItensAtiv',id_demanda);
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: [{
                    text: txtTitle,
                    class: 'confirm',
                    click: function (event) {
                        if (callAtiv('checkSigleInputDateAtiv_',this)) {
                            var _this = $(this);
                            var _parent = _this.closest('.ui-dialog');
                            var data_pausa = moment(_this.closest('.ui-dialog').find('#ativ_data_pausa').val(), config_unidade.hora_format).format('YYYY-MM-DD HH:mm:ss');
                            var id_demandas_pause = (listAtividadesVinculadas.length_check > 0 && _parent.find('#pause_others').is(':checked'))
                                ? JSON.parse(_parent.find('#lista_pause_others').val())
                                : [];
                            var action = 'pause_atividade';
                            var param = {
                                id_demanda: value.id_demanda,
                                id_demandas_pause: id_demandas_pause,
                                data_pausa: data_pausa,
                                action: action
                            };
                            getServerAtividades(param, action);
                        }
                    }
                }]
            });
    }
}
export function variationAtividade(id_demanda, alertAtividade = false) {
    var value = callAtiv('getAtividadeData',id_demanda);
    if (callAtiv('checkCapacidade','variation_atividade') || callAtiv('checkCapacidade','type_atividade')) {
        var config_unidade = callAtiv('getConfigDadosUnidade',value.sigla_unidade);

        var arrayOptionAtiv = jmespath.search(arrayConfigAtividades.atividades, "[?id_atividade==`" + value.id_atividade + "`].{sigla_unidade: sigla_unidade, id_unidade: id_unidade, dias_planejado: dias_planejado, tempo_pactuado: tempo_pactuado, complexidade: config.complexidade, etiqueta: config.etiqueta.lista, tipo_processo: config.tipo_processo} | [0]");
        var checkEmptyAtiv = (arrayOptionAtiv == null || arrayOptionAtiv.length == 0 || value.id_atividade == 0 || value.tempo_pactuado == 0) ? true : false;
        if (checkEmptyAtiv || callAtiv('checkCapacidade','type_atividade')) {
            // alertaBoxPro('Error', 'exclamation-triangle', 'Atividade inativa ou inexistente. Reative-a para prosseguir.');
            var optionAtiv = '';
            var optionSelectComplexidade = '';
            var arrayTabelaAtividades = arrayConfigAtividades.atividades;
            var unidades = (typeof arrayConfigAtividades.atividades !== 'undefined' && arrayConfigAtividades.atividades != 0 && arrayConfigAtividades.atividades.length > 0)
                ? uniqPro(jmespath.search(arrayConfigAtividades.atividades, "[?sigla_unidade].sigla_unidade"))
                : [];
            var countUnidades = (arrayConfigAtividades.atividades.length > 0) ? unidades.length : 0;
            if (countUnidades > 1) {
                $.each(unidades, function (index, v) {
                    var arrayAtiv = jmespath.search(arrayTabelaAtividades, "[?sigla_unidade=='" + v + "']");
                    optionAtiv += '<optgroup label="' + v + '">' +
                        '   ' + callAtiv('getOptionsSelectAtivGroup',arrayAtiv, value, true) +
                        '</optgroup>';
                });
            } else {
                optionAtiv += callAtiv('getOptionsSelectAtivGroup',arrayTabelaAtividades, value, true);
            }
            var selectAtiv = '               <select id="ativ_id_atividade" data-act="atividades-composite" data-chain="changeAtivSelect|checkTempoProdutividade" data-key="id_atividade" style="width: 100%;" required>' +
                '                   <option>&nbsp;</option>' +
                '                   ' + optionAtiv +
                '               </select>';
        } else {
            var tempo_pactuado_display = (arrayOptionAtiv.complexidade.length > 0) ? jmespath.search(arrayOptionAtiv.complexidade, "[?default==`true`].fator | [0]") : null;
            tempo_pactuado_display = (tempo_pactuado_display !== null) ? tempo_pactuado_display * value.tempo_pactuado : value.tempo_pactuado;
            var tempo_pactuado_display_ = parseFloat(tempo_pactuado_display.toFixed(2)); value.hasOwnProperty

            // console.log(id_demanda, arrayOptionAtiv, arrayOptionAtiv.complexidade.length, jmespath.search(arrayOptionAtiv.complexidade, "[?default==`true`].fator | [0]"), value.tempo_pactuado, tempo_pactuado_display, tempo_pactuado_display_);

            var optionAtiv = (optionAtiv !== null) ? "<option value='" + value.id_atividade + "' data-config='" + JSON.stringify(arrayOptionAtiv) + "'>" + value.nome_atividade + " [" + (tempo_pactuado_display_) + " " + (tempo_pactuado_display > 1 ? 'horas' : 'hora') + "]</option>" : '';
            var arrayOptionUser = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + value.id_user + "`].{id_plano: id_plano, sigla_unidade: sigla_unidade, nome_modalidade: nome_modalidade, carga_horaria: carga_horaria} | [0]");

            var optionSelectComplexidade = (arrayOptionAtiv && arrayOptionAtiv.complexidade.length > 0)
                ? $.map(arrayOptionAtiv.complexidade, function (v, k) {
                    var selected = (parseFloat(value.fator_complexidade) == parseFloat(v.fator)) ? 'selected' : '';
                    // console.log(selected, parseFloat(value.fator_complexidade), parseFloat(v.fator), v.complexidade);

                    var tempo_pactuado_fator = (typeof arrayOptionAtiv.tempo_pactuado !== 'undefined' && typeof v.fator !== 'undefined' && arrayOptionAtiv.tempo_pactuado > 0 && v.fator > 0) ? (arrayOptionAtiv.tempo_pactuado * v.fator) : false;
                    var tempo_pactuado_fator_display = (tempo_pactuado_fator)
                        ? (tempo_pactuado_fator < 1) ? parseFloat(tempo_pactuado_fator.toFixed(3)) : parseFloat(tempo_pactuado_fator.toFixed(1))
                        : false;
                    tempo_pactuado_fator_display = (tempo_pactuado_fator_display) ? " [" + tempo_pactuado_fator_display + " " + (tempo_pactuado_fator > 1 ? 'horas' : 'hora') + "]" : '';
                    return "<option value='" + v.fator + "' " + selected + ">" + unicodeToChar(v.complexidade) + tempo_pactuado_fator_display + "</option>";
                }).join('') : '<option>&nbsp;</option>';

            var selectAtiv = '               <select id="ativ_id_atividade" data-key="id_atividade" style="width: 100%;" required disabled>' +
                '                   ' + optionAtiv +
                '               </select>';
        }
        var optionUser = (optionUser !== null) ? "<option value='" + value.id_user + "' data-config='" + JSON.stringify(arrayOptionUser) + "'>" + value.apelido + "</option>" : '';
        var htmlAlertAtividade = (alertAtividade)
            ? '<span class="inlineAlert setAtivBeforeRate">' +
            '   <i class="fas fa-info-circle azulColor" style="color: #7baaf7;"></i>' +
            '   Atribua um tipo de atividade ' + getNameGenre('demanda', 'ao', '\u00E0') + ' ' + __.demanda + ' antes de prosseguir com a avalia\u00E7\u00E3o' +
            '</span>'
            : '';

        var htmlBox = '<div id="boxAtividade" class="seipro-atividades-box atividadeWork seipro-atividades-work" data-demanda="' + value.id_demanda + '" data-unidade="' + value.sigla_unidade + '">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '      <tr style="height: auto;">' +
            '           <td colspan="4">' + htmlAlertAtividade + '</td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_id_atividade"><i class="iconPopup iconSwitch fas fa-clipboard-list cinzaColor"></i>' + __.Atividade + ':</label>' +
            '           </td>' +
            '           <td class="required" colspan="3">' +
            '               ' + selectAtiv +
            '               <input type="hidden" id="ativ_id_unidade" data-key="id_unidade" data-param="id_unidade" value="' + value.id_unidade + '">' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '           <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_fator_complexidade"><i class="iconPopup iconSwitch fas fa-graduation-cap cinzaColor"></i>Grau de ' + __.Complexidade + ':</label>' +
            '           </td>' +
            '           <td class="required">' +
            '               <select id="ativ_fator_complexidade" data-key="fator_complexidade" style="width: 100%;" data-act="atividades-composite" data-chain="updateAtivTempoPactuado|checkTempoProdutividade" required>' +
            '                   ' + optionSelectComplexidade +
            '               </select>' +
            '           </td>' +
            '           <td colspan="2" rowspan="3">' +
            '               <div id="chartUser" style="width: 380px; height: 85px;"></div>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_id_user"><i class="iconPopup iconSwitch fas fa-user-tie cinzaColor"></i>Respons\u00E1vel:</label>' +
            '           </td>' +
            '           <td>' +
            '               <select id="ativ_id_user" data-key="id_user" data-type="user" style="width: 100%;" required disabled>' +
            '                   ' + optionUser +
            '               </select>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_tempo_pactuado"><i class="iconPopup iconSwitch fas fa-user-clock cinzaColor"></i>Tempo pactuado:</label>' +
            '           </td>' +
            '           <td>' +
            '               <input type="text" id="ativ_tempo_pactuado" data-key="tempo_pactuado" value="' + (value && value.tempo_pactuado ? value.tempo_pactuado : '') + '" data-tempo-pactuado="' + (value && value.tempo_pactuado ? value.tempo_pactuado : '') + '" disabled>' +
            '           </td>' +
            '      </tr>' +
            (value.data_entrega != '0000-00-00 00:00:00' && !callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
                '      <tr>' +
                '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                '               <label for="ativ_produtividade"><i class="iconPopup iconSwitch fas fa-toolbox cinzaColor"></i>Produtividade:</label>' +
                '           </td>' +
                '           <td colspan="3" style="text-align: left;">' +
                '               <span id="ativ_produtividade">' + getInfoAtividadeProdutividade(value, true) + '</span>' +
                '           </td>' +
                '      </tr>' +
                '' : '') +
            '   </table>' +
            '</div>';

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: (value.tempo_pactuado == 0 ? 'Atribuir ' + __.Atividade : 'Alterar ' + __.Complexidade) + ': ' + callAtiv('getTitleDialogBox',value),
                width: 780,
                open: function () {
                    updateButtonConfirm(this, true);
                    if ($('#ativ_fator_complexidade').val() == null) {
                        $('#ativ_id_atividade').trigger('change');
                    } else {
                        $('#ativ_fator_complexidade').trigger('change');
                    }
                    initChosenReplace('box_init', this, true);
                },
                close: function () {
                    $('#boxAtividade').remove();
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: [{
                    text: (checkEmptyAtiv ? 'Atribuir' : 'Alterar'),
                    class: 'confirm',
                    click: function (event) {
                        if (callAtiv('checkAtivRequiredFields',this, 'mark')) {
                            var action = (checkEmptyAtiv ? 'type_atividade' : 'variation_atividade');
                            var inpuData = callAtiv('extractDataAtiv',this);
                            var param = {
                                action: action,
                                id_demanda: id_demanda,
                                before_rate: ($('.setAtivBeforeRate').length > 0 ? true : false),
                                id_atividade: parseInt(inpuData.id_atividade),
                                changed_atividade: (action == 'variation_atividade' && parseInt(inpuData.id_atividade) != value.id_atividade ? true : false),
                                fator_complexidade: parseFloat(inpuData.fator_complexidade),
                                tempo_pactuado: parseFloat(inpuData.tempo_pactuado)
                            };
                            getServerAtividades(param, action);
                            // console.log(param, action);
                        }
                    }
                }]
            });
    }
}
export function extendAtividade(id_demanda) {
    var value = callAtiv('getAtividadeData',id_demanda);
    // console.log(value);
    if (callAtiv('checkCapacidade','extend_atividade')) {
        var config_unidade = callAtiv('getConfigDadosUnidade',value.sigla_unidade);
        var dataDistribuicao = moment(value.data_distribuicao, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format);
        var prazoEntrega = moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format);
        var inputAtiv = jmespath.search(arrayConfigAtividades.atividades, "[?id_atividade==`" + value.id_atividade + "`].{sigla_unidade: sigla_unidade, id_unidade: id_unidade, dias_planejado: dias_planejado, tempo_pactuado: tempo_pactuado, complexidade: config.complexidade, etiqueta: config.etiqueta.lista, tipo_processo: config.tipo_processo} | [0]");
        inputAtiv = (inputAtiv !== null) ? "<input type='hidden' id='ativ_id_atividade' data-key='id_atividade' data-param='id_atividade' data-config='" + JSON.stringify(inputAtiv) + "' value='" + value.id_atividade + "'>" : '';
        var inputUser = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + value.id_user + "`].{id_plano: id_plano, sigla_unidade: sigla_unidade, nome_modalidade: nome_modalidade, carga_horaria: carga_horaria} | [0]");
        inputUser = (inputUser !== null) ? "<input type='hidden' id='ativ_id_user' data-key='id_user' data-param='id_user' data-config='" + JSON.stringify(inputUser) + "' value='" + value.id_user + "'>" : '';
        // var prazoDemandasRetroativas = checkOptionEntidade('limitar_demandas_retroativas') && checkOptionEntidade('prazo_demandas_retroativas') ? getOptionEntidade('prazo_demandas_retroativas') : false;
        // var minDataDistribuicao = prazoDemandasRetroativas ? 'min="'+moment().add(-prazoDemandasRetroativas, 'days').format('YYYY-MM-DDTHH:mm')+'"' : '';
        var minDataDistribuicao = '';

        var htmlBox = '<div id="boxAtividade" class="seipro-atividades-box atividadeWork seipro-atividades-work" data-demanda="' + value.id_demanda + '" data-unidade="' + value.sigla_unidade + '">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_data_distribuicao"><i class="iconPopup iconSwitch fas fa-briefcase cinzaColor"></i>Data de Distribui\u00E7\u00E3o:</label>' +
            '           </td>' +
            '           <td class="required date">' +
            '               <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" id="ativ_data_distribuicao" ' + minDataDistribuicao + ' data-key="data_distribuicao" data-type="inicio" data-name="data de distribui\u00E7\u00E3o" value="' + dataDistribuicao + '" required disabled>' +
            '               ' + inputAtiv +
            '               ' + inputUser +
            '           </td>' +
            '           <td style="vertical-align: bottom;" class="label">' +
            '               <label class="last" for="ativ_prazo_entrega"><i class="iconPopup iconSwitch fas fa-business-time cinzaColor" style="float: initial;"></i>Prazo de Entrega:</label>' +
            '           </td>' +
            '           <td class="required date">' +
            '               <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="changeDadosTrabalho" id="ativ_prazo_entrega" data-key="prazo_entrega" data-type="fim" data-name="prazo de entrega" value="' + prazoEntrega + '" required>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_tempo_planejado"><i class="iconPopup iconSwitch fas fa-hourglass-half cinzaColor"></i>Tempo Planejado:</label>' +
            '           </td>' +
            '           <td>' +
            '               <input type="number" min="1" id="ativ_tempo_planejado" data-key="tempo_planejado" data-type="tempo" value="' + value.tempo_planejado + '" disabled>' +
            '           </td>' +
            '           <td style="vertical-align: bottom;" class="label">' +
            '               <label class="last" for="ativ_dias_planejado"><i class="iconPopup iconSwitch fas fa-calendar-alt cinzaColor" style="float: initial;"></i><span id="ativ_dias_planejado_label">Dias ' + (config_unidade.count_dias_uteis ? '\u00FAteis' : '') + ' de Planejamento</span>:</label>' +
            '           </td>' +
            '           <td class="required number">' +
            '               <input type="number" min="0" id="ativ_dias_planejado" data-act="atividades-call" data-fn="changeDadosTrabalho" data-key="dias_planejado" data-type="dias" value="' + value.dias_planejado + '" required>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '</div>';

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: __.Prorrogar + ' ' + __.Demanda + ': ' + callAtiv('getTitleDialogBox',value),
                width: 780,
                open: function () {
                    updateButtonConfirm(this, true);
                    callAtiv('prepareFieldsReplace',this);
                },
                close: function () {
                    $('#boxAtividade').remove();
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: [{
                    text: __.Prorrogar,
                    class: 'confirm',
                    click: function (event) {
                        if (callAtiv('checkAtivRequiredFields',this, 'mark')) {
                            var action = 'extend_atividade';
                            var inpuData = callAtiv('extractDataAtiv',this);
                            var param = {
                                action: 'extend_atividade',
                                id_demanda: id_demanda,
                                prazo_entrega: inpuData.prazo_entrega,
                                tempo_planejado: parseInt(inpuData.tempo_planejado),
                                dias_planejado: parseInt(inpuData.dias_planejado)
                            };
                            getServerAtividades(param, action);
                            // console.log(param, action);
                        }
                    }
                }]
            });
    }
}
export function extendAvaliacao(id_plano, indice, id_avaliacao_recurso, id_avaliacao) {
    var value = callAtiv('getPlanoData',id_plano);
    if (callAtiv('checkCapacidade','appeal_extend_avaliacoes')) {
        let recurso = id_plano && indice && value && value.recurso_avaliacao ? jmespath.search(value.recurso_avaliacao, "[?aceito==`false`] | [?data_justificativa=='0000-00-00 00:00:00'] | [?indice_mes_entrega==`" + indice + "`] | [0]") : false;

        var htmlBox = '<div id="boxAtividade" class="seipro-atividades-box atividadeWork seipro-atividades-work" data-demanda="' + id_plano + '">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '      <tr>' +
            '           <td style="vertical-align: bottom;" class="label">' +
            '               <label class="last" for="ativ_prazo_entrega"><i class="iconPopup iconSwitch fas fa-business-time cinzaColor" style="float: initial;"></i>Novo prazo:</label>' +
            '           </td>' +
            '           <td class="required date">' +
            '               <input type="datetime-local" id="data_fim_vigencia" data-key="data_fim_vigencia" min="' + recurso.data_fim_vigencia + '" value="' + recurso.data_fim_vigencia + '" required>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '</div>';

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: __.Prorrogar + ' prazo para apresenta\u00E7\u00E3o de recurso',
                width: 780,
                open: function () {
                    updateButtonConfirm(this, true);
                    callAtiv('prepareFieldsReplace',this);
                },
                close: function () {
                    $('#boxAtividade').remove();
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: [{
                    text: __.Prorrogar,
                    class: 'confirm',
                    click: function (event) {
                        if (callAtiv('checkAtivRequiredFields',this, 'mark')) {
                            var action = 'appeal_extend_avaliacoes';
                            var param = {
                                action: action,
                                type: 'planos',
                                data_fim_vigencia: $('#data_fim_vigencia').val(),
                                id: id_plano,
                                id_plano: id_plano,
                                indice: indice,
                                id_avaliacao: id_avaliacao,
                                id_avaliacao_recurso: id_avaliacao_recurso
                            };
                            getServerAtividades(param, action);
                        }
                    }
                }]
            });
    }
}
export function startCancelAtividadeLote(list) {
    if (callAtiv('checkCapacidade','start_cancel_atividades')) {
        setTimeout(() => {
            confirmaFraseBoxPro(__.As_demandas + ' j\u00E1 foram ' + getNameGenre('demanda', 'iniciados', 'iniciadas') + '. Tem certeza que deseja cancelar?', 'CANCELAR', function () {
                var action = 'start_cancel_atividades';
                if (typeof list !== 'undefined' && list !== null && list.length > 0) {
                    var ids = list.map(function (v) { return { id_demanda: v.id, id_unidade: v.id_unidade } });
                    var param = { action: action, ids: ids };
                    getServerAtividades(param, action);
                }
            }, function () {
                $.each(list, function (i, value) {
                    callAtiv('cancelSelectedItensAtiv',value.id_demanda);
                });
            });
        }, 500);
    }
}
export function startCancelAtividade(id_demanda) {
    var value = callAtiv('getAtividadeData',id_demanda);
    if (callAtiv('checkCapacidade','start_cancel_atividade')) {
        confirmaFraseBoxPro(__.A_demanda + ' j\u00E1 foi ' + getNameGenre('demanda', 'iniciado', 'iniciada') + '. Tem certeza que deseja cancelar?', 'CANCELAR', function () {
            var action = 'start_cancel_atividade';
            var param = {
                action: action,
                id_demanda: id_demanda,
                id_unidade: value.id_unidade
            };
            getServerAtividades(param, action);
        }, function () {
            callAtiv('cancelMoveKanbanItens',);
            callAtiv('cancelSelectedItensAtiv',id_demanda);
        });
    }
}
export function statusIconsAtividade(value) {
    var config_unidade = callAtiv('getConfigDadosUnidade',value.sigla_unidade);
    var format_hora = (config_unidade && config_unidade.count_horas) ? 'DD/MM/YYYY [\u00E0s] HH:mm' : 'DD/MM/YYYY';
    return '<span style="float: right;">' +
        '   <i ' + (value.data_distribuicao != '0000-00-00 00:00:00' ? 'data-tip="Cadastrado em: ' + moment(value.data_distribuicao, 'YYYY-MM-DD HH:mm:ss').format(format_hora) + '"' : '') + ' class="far fa-clock ' + (value.data_distribuicao != '0000-00-00 00:00:00' ? 'azulColor' : 'cinzaColor') + '" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
        '   <i ' + (value.data_inicio != '0000-00-00 00:00:00' ? 'data-tip="Iniciado em: ' + moment(value.data_inicio, 'YYYY-MM-DD HH:mm:ss').format(format_hora) + '"' : '') + ' class="fas fa-play-circle ' + (value.data_inicio != '0000-00-00 00:00:00' ? 'azulColor' : 'cinzaColor') + '" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
        '   <i ' + (value.data_entrega != '0000-00-00 00:00:00' ? 'data-tip="Conclu\u00EDdo em: ' + moment(value.data_entrega, 'YYYY-MM-DD HH:mm:ss').format(format_hora) + '"' : '') + ' class="fas fa-check-circle ' + (value.data_entrega != '0000-00-00 00:00:00' ? 'verdeColor' : 'cinzaColor') + '" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
        '   <i ' + (value.data_avaliacao != '0000-00-00 00:00:00' ? 'data-tip="Avaliado em: ' + moment(value.data_avaliacao, 'YYYY-MM-DD HH:mm:ss').format(format_hora) + '"' : '') + ' class="fas fa-star ' + (value.data_avaliacao != '0000-00-00 00:00:00' ? 'starGold' : 'cinzaColor') + '" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
        '</span>';
}
export function sendCancelAtividade(id_demanda) {
    var value = callAtiv('getAtividadeData',id_demanda);
    if (value.data_entrega != '0000-00-00 00:00:00') {
        confirmaFraseBoxPro(__.A_demanda + ' j\u00E1 foi ' + getNameGenre('demanda', 'arquivado', 'arquivada') + '. Tem certeza que deseja cancelar?', 'CANCELAR', function () {
            var action = 'send_cancel_atividade';
            var param = {
                action: action,
                id_demanda: id_demanda
            };
            getServerAtividades(param, action);
        }, function () {
            callAtiv('cancelMoveKanbanItens',);
            callAtiv('cancelSelectedItensAtiv',id_demanda);
        });
    }
}
export function archiveAtividade(id_demanda = 0) {
    if ($.isArray(id_demanda) && id_demanda.length > 0) {
        var id_demandas = jmespath.search(id_demanda, "[*].id");
    } else if (id_demanda != 0) {
        var value = (id_demanda != 0) ? jmespath.search(arrayAtividadesPro, "[?id_demanda==`" + id_demanda + "`]") : null;
        value = (value !== null) ? jmespath.search(value, "[?data_avaliacao!='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00'] | [0]") : null;
        value = (value !== null) ? value : false;
        var id_demandas = (value) ? [value.id_demanda] : false;
    }
    if (id_demandas) {

        if (callAtiv('checkCapacidade','rate_cancel_atividades')) {
            var func_rateCancelAtiv = function () {
                var list = $('#atividadesProActions .iconAtividade_send').data('list');
                callAtiv('rateCancelAtividadeLote',list);
            };
            var txt_rateCancelAtiv = 'Cancelar Avalia\u00E7\u00E3o';
        } else {
            var func_rateCancelAtiv = false;
            var txt_rateCancelAtiv = 'Cancelar';
        }
        confirmaBoxPro('Tem certeza que deseja ' + __.arquivar + ' ' + (id_demandas.length > 1 ? __.as_demandas_selecionadas : __.a_demanda_selecionada) + '?', function () {
            var action = 'send_atividade';
            var param = {
                id_demandas: id_demandas,
                data_envio: moment().format('YYYY-MM-DD HH:mm:ss'),
                action: action
            };
            getServerAtividades(param, action);
        }, __.Arquivar, func_rateCancelAtiv, txt_rateCancelAtiv);
    }
}
export function sendAtividade(id_demanda = 0) {
    var dadosIfrArvore = getIfrArvoreDadosProcesso();
    var value = callAtiv('getAtividadeData',id_demanda);
    var checkAtivProcesso = (value && value.id_procedimento !== null && parseInt(value.id_procedimento) != 0) ? true : false;
    var listaAtividades = (dadosIfrArvore && id_demanda == 0)
        ? jmespath.search(arrayAtividadesProcPro, "[?data_avaliacao=='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00']")
        : (checkAtivProcesso)
            ? jmespath.search(arrayAtividadesPro, "[?id_procedimento=='" + value.id_procedimento + "'] | [?data_avaliacao=='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00']")
            : jmespath.search(arrayAtividadesPro, "[?id_demanda==`" + id_demanda + "`] | [?data_avaliacao=='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00']");
    var sendListaAtividades = (dadosIfrArvore && id_demanda == 0)
        ? jmespath.search(arrayAtividadesProcPro, "[?data_avaliacao!='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00']")
        : (checkAtivProcesso)
            ? jmespath.search(arrayAtividadesPro, "[?id_procedimento=='" + value.id_procedimento + "'] | [?data_avaliacao!='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00']")
            : jmespath.search(arrayAtividadesPro, "[?id_demanda==`" + id_demanda + "`] | [?data_avaliacao!='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00']");
    var idListaAtividades = (dadosIfrArvore && id_demanda == 0)
        ? jmespath.search(arrayAtividadesProcPro, "[?data_avaliacao!='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00'].id_demanda")
        : (checkAtivProcesso)
            ? jmespath.search(arrayAtividadesPro, "[?id_procedimento=='" + value.id_procedimento + "'] | [?data_avaliacao!='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00'].id_demanda")
            : [id_demanda];
    var config_unidade = callAtiv('getConfigDadosUnidade',);
    var btnDialogBoxPro = [];

    // console.log({checkAtivProcesso: checkAtivProcesso, id_demanda: id_demanda, value: value, listaAtividades: listaAtividades, sendListaAtividades: sendListaAtividades, idListaAtividades: idListaAtividades});

    if (listaAtividades.length > 0) {
        btnDialogBoxPro = [{
            text: 'Ok',
            click: function (event) {
                resetDialogBoxPro('dialogBoxPro');
            }
        }];
    } else {
        btnDialogBoxPro = [{
            text: __.Arquivar,
            class: 'confirm',
            click: function (event) {
                if (callAtiv('checkSigleInputDateAtiv_',this)) {
                    var data_envio = moment($(this).closest('.ui-dialog').find('#ativ_data_envio').val(), config_unidade.hora_format).format('YYYY-MM-DD HH:mm:ss');
                    var action = 'send_atividade';
                    var param = {
                        id_demandas: idListaAtividades,
                        data_envio: data_envio,
                        action: action
                    };
                    getServerAtividades(param, action);
                }
            }
        }];
    }
    if (callAtiv('checkCapacidade','rate_edit_atividade')) {
        btnDialogBoxPro.unshift({
            text: 'Editar Avalia\u00E7\u00E3o',
            icon: "ui-icon-star",
            click: function (event) {
                if (id_demanda == 0) { callAtiv('selectAtividadeBox','rate_edit') } else { callAtiv('rateAtividade',id_demanda) }
            }
        });
    }

    if (sendListaAtividades.length == 0) {
        callAtiv('selectAtividadeBox','send');
    } else if (listaAtividades.length > 0 && checkAtivProcesso) {
        // console.log(listaAtividades);
        var htmlTableAtividades = $.map(listaAtividades, function (v, k) {
            var datesAtivHtml = getDatesPreview(callAtiv('getConfigDateAtiv',v));
            datesAtivHtml = (datesAtivHtml != '') ? $(datesAtivHtml).find('.dateBoxIcon')[0].outerHTML : '';
            datesAtivHtml = (datesAtivHtml != '') ? '<span class="dateboxDisplay" data-act="atividades-call" data-fn="actionsAtividade" data-pass-el="0" data-id="' + v.id_demanda + '">' + datesAtivHtml + '</span>' : '';
            return '<div style="margin: 5px 0; display: inline-block; width: 100%;" data-value="' + v.id_demanda + '" title="' + callAtiv('getTitleDialogBox',v, true) + '">' + datesAtivHtml + statusIconsAtividade(v) + callAtiv('getTitleDialogBox',v) + '</div>'
        }).join('');
        var htmlBox = '<div id="boxAtividade" class="seipro-atividades-box atividadeWork seipro-atividades-work">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <div style="display: inline-block;"><i class="iconPopup iconSwitch fas fa-exclamation-triangle laranjaColor"></i>' + (listaAtividades.length == 1 ? 'Existe ' + __.demanda + ' pendente' + (checkAtivProcesso ? ' neste processo' : '') + '. Finalize-a antes de ' + __.arquivar + ':' : 'Existem ' + __.demandas + ' pendentes' + (checkAtivProcesso ? ' neste processo' : '') + '. Finalize-as antes de ' + __.arquivar + ':') + '</div>' +
            '               ' + htmlTableAtividades +
            '          </td>' +
            '      </tr>' +
            '   </table>' +
            '</div>';

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: __.Arquivar + ' ' + __.Demandas + ' do Processo',
                width: 850,
                close: function () {
                    $('#boxAtividade').remove();
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: btnDialogBoxPro
            });
    } else {
        var dataEntrega = jmespath.search(sendListaAtividades, "reverse(sort_by([?data_avaliacao!='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00'], &data_entrega)) | [*].data_entrega | [0]");
        dataEntrega = (dataEntrega != null) ? moment(dataEntrega, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format) : '';
        var dataEnvio = (dadosIfrArvore.data_documento)
            ? (dadosIfrArvore.data_documento)
                ? moment(dadosIfrArvore.data_documento, 'DD/MM/YYYY HH:mm').format(config_unidade.hora_format)
                : moment().format(config_unidade.hora_format)
            : moment().format(config_unidade.hora_format);
        var htmlTableAtividades = $.map(sendListaAtividades, function (v, k) {
            var datesAtivHtml = getDatesPreview(callAtiv('getConfigDateAtiv',v));
            datesAtivHtml = (datesAtivHtml != '') ? $(datesAtivHtml).find('.dateBoxIcon')[0].outerHTML : '';
            datesAtivHtml = (datesAtivHtml != '') ? '<span class="dateboxDisplay" data-act="atividades-call" data-fn="actionsAtividade" data-pass-el="0" data-id="' + v.id_demanda + '">' + datesAtivHtml + '</span>' : '';
            return '<div style="margin: 5px 0; display: inline-block; width: 100%;" data-value="' + v.id_demanda + '" title="' + callAtiv('getTitleDialogBox',v, true) + '">' + datesAtivHtml + callAtiv('getTitleDialogBox',v) + '</div>'
        }).join('');

        var htmlBox = '<div id="boxAtividade" class="seipro-atividades-box atividadeWork seipro-atividades-work">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label" colspan="2">' +
            '               <div style="display: inline-block;"><i class="iconPopup iconSwitch fas fa-archive azulColor"></i>' + (sendListaAtividades.length == 1 ? getNameGenre('demanda', 'O seguinte', 'A seguinte') + ' ' + __.demanda + ' ser\u00E1 ' + getNameGenre('demanda', 'arquivado', 'arquivada') + (checkAtivProcesso ? ' com o processo' : '') + ':' : getNameGenre('demanda', 'Os seguintes', 'As seguintes') + ' ' + __.demandas + ' ser\u00E3o ' + __.arquivadas + (checkAtivProcesso ? ' com o processo' : '') + ':') + '</div>' +
            '               <div style="max-height: 300px;overflow-y: scroll;display: block;position: initial;">' + htmlTableAtividades + '</div>' +
            '          </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left; width: 200px;" class="label">' +
            '               <label for="ativ_data_envio"><i class="iconPopup iconSwitch fas fa-play-circle cinzaColor"></i>Data de ' + __.Arquivamento + ':</label>' +
            '           </td>' +
            '           <td class="required date">' +
            '               <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="checkSigleInputDateAtiv" id="ativ_data_envio" data-key="data_envio" data-type="inicio" data-name="data de ' + __.arquivamento + '" data-name-min="data de conclus\u00E3o" value="' + dataEnvio + '" min="' + dataEntrega + '" required>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '</div>';

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: __.Arquivar + ' ' + __.Demandas + '' + (checkAtivProcesso ? ' do Processo' : ''),
                width: 700,
                open: function () {
                    updateButtonConfirm(this, true);
                    callAtiv('checkSigleInputDateAtiv_',this);
                    callAtiv('prepareFieldsReplace',this);
                },
                close: function () {
                    $('#boxAtividade').remove();
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: btnDialogBoxPro
            });
    }
}
export function infoAtividade(id_demanda) {
    var value = callAtiv('getAtividadeData',id_demanda);
    var htmlInfo = getInfoAtividade(value);
    var htmlBox = '<div id="boxAtividade" class="seipro-atividades-box atividadeInfo seipro-atividades-info" style="height: 80vh;overflow-y: auto;">' +
        '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine tableInfo">' +
        '           ' + htmlInfo +
        '   </table>' +
        '</div>';
    var btnDialogBoxPro = [{
        text: 'Ok',
        click: function (event) {
            resetDialogBoxPro('dialogBoxPro');
        }
    }];
    if (callAtiv('checkCapacidade','complete_cancel_atividade') && value.data_entrega != '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00' && value.data_avaliacao == '0000-00-00 00:00:00' && callAtiv('checkPermissionAtiv',value)) {
        btnDialogBoxPro.unshift({
            text: 'Cancelar Conclus\u00E3o',
            icon: "ui-icon-close",
            click: function (event) {
                completeCancelAtividade(value.id_demanda);
            }
        });
    }
    if (callAtiv('checkCapacidade','complete_edit_atividade') && value.data_entrega != '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00' && value.data_avaliacao == '0000-00-00 00:00:00' && callAtiv('checkPermissionAtiv',value)) {
        btnDialogBoxPro.unshift({
            text: 'Editar Conclus\u00E3o',
            icon: "ui-icon-check",
            click: function (event) {
                completeAtividade(value.id_demanda);
            }
        });
    }
    if (callAtiv('checkCapacidade','send_cancel_atividade') && value.data_envio != '0000-00-00 00:00:00') {
        btnDialogBoxPro.unshift({
            text: 'Cancelar ' + __.Arquivamento,
            icon: "ui-icon-close",
            click: function (event) {
                sendCancelAtividade(value.id_demanda);
            }
        });
    }
    if (callAtiv('actionsAtividade',value.id_demanda, 'icon').action != 'info') {
        btnDialogBoxPro.unshift({
            text: callAtiv('actionsAtividade',value.id_demanda, 'icon').name,
            click: function (event) {
                callAtiv('actionsAtividade',value.id_demanda);
            }
        });
    }
    if (callAtiv('checkCapacidade','edit_atividade') && value.data_inicio == '0000-00-00 00:00:00') {
        btnDialogBoxPro.unshift({
            text: 'Editar ' + __.Demanda,
            icon: 'ui-icon-pencil',
            click: function (event) {
                callAtiv('saveAtividade',value.id_demanda);
            }
        });
    }
    if (callAtiv('checkCapacidade','rate_cancel_atividade') && value.data_avaliacao != '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00') {
        btnDialogBoxPro.unshift({
            text: 'Cancelar Avalia\u00E7\u00E3o',
            icon: 'ui-icon-close',
            click: function (event) {
                callAtiv('rateCancelAtividade',id_demanda);
            }
        });
    }
    if (callAtiv('checkCapacidade','history_atividade')) {
        btnDialogBoxPro.unshift({
            text: 'Hist\u00F3rico',
            icon: 'ui-icon-script',
            click: function (event) {
                historyAtividade(id_demanda);
            }
        });
    }

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
        .dialog({
            title: 'Informa\u00E7\u00F5es ' + __.da_Demanda + '',
            width: 700,
            open: function () {
                updateButtonConfirm(this, true);
                callAtiv('getAtividadeTagsPro',);
            },
            close: function () {
                $('#boxAtividade').remove();
                resetDialogBoxPro('dialogBoxPro');
            },
            buttons: btnDialogBoxPro
        });
}
export function historyAtividade(id_ref = false, mode = 'get', data = false) {
    if (mode == 'set') {
        var htmlBody = '';
        $.each(data, function (i, v) {
            htmlBody += '<tr>' +
                '   <td align="left">' + v.nome_completo + '</td>' +
                '   <td align="left">' + v.descricao + '</td>' +
                '   <td align="left">' + moment(v.datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm') + '</td>' +
                '</tr>';
        });
        $('#historyAtivPro tbody').html(htmlBody).trigger('click');
        loadingButtonConfirm(false);
        centralizeDialogBox(dialogBoxPro);
    } else if (mode == 'get') {
        var value = callAtiv('getAtividadeData',id_ref);
        if (value) {
            var htmlBox = '<div id="view_doc" class="atividadeWork seipro-atividades-work" style="max-height: 400px;overflow: auto;">' +
                '   <table id="historyAtivPro" style="font-size: 8pt !important;width: 100%;" class="seiProForm tableAtividades tableDialog tableInfo tableZebra seipro-atividades-table">' +
                '        <thead>' +
                '            <tr class="tableHeader">' +
                '                <th class="tituloControle" style="text-align: center;">Usu\u00E1rio</th>' +
                '                <th class="tituloControle" style="text-align: center;">A\u00E7\u00E3o</th>' +
                '                <th class="tituloControle" style="text-align: center;">Data / Hora</th>' +
                '            </tr>' +
                '        </thead>' +
                '        <tbody>' +
                '           <tr>' +
                '               <td colspan="3">' +
                '                   <div class="dataFallback dataLoading" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div>' +
                '               </td>' +
                '           </tr>' +
                '        </tbody>' +
                '   </table>' +
                '</div>';

            resetDialogBoxPro('dialogBoxPro');
            dialogBoxPro = $('#dialogBoxPro')
                .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
                .dialog({
                    title: 'Hist\u00F3rico da Demanda',
                    width: 780,
                    open: function () {
                        updateButtonConfirm(this, true);
                        var action = 'history_atividade';
                        var param = {
                            action: action,
                            id_ref: id_ref
                        };
                        getServerAtividades(param, action);
                    },
                    close: function () {
                        $('#view_doc').remove();
                        resetDialogBoxPro('dialogBoxPro');
                    },
                    buttons: [{
                        text: 'Imprimir',
                        icon: 'ui-icon-print',
                        click: function (event) {
                            printDocumento();
                        }
                    }, {
                        text: 'Ok',
                        class: 'confirm',
                        click: function (event) {
                            $('#view_doc').remove();
                            resetDialogBoxPro('dialogBoxPro');
                        }
                    }]
                });
        }
    }
}
export function getInfoAtividadeChecklist(value, mode) {
    var checklist = value.checklist;
    var checklist_length = typeof checklist !== 'undefined' ? checklist.length : 1;
    var verifyChecklist = (checklist && checklist.length > 0) ? true : false;
    var valueNow = (verifyChecklist) ? jmespath.search(checklist, "[?data_fim!='0000-00-00 00:00:00']") : null;
    valueNow = (valueNow !== null) ? valueNow.length : 0;
    var valuePercent = (verifyChecklist) ? ((valueNow / checklist_length) * 100).toFixed(2) : 0;


    if (mode == 'actions') {
        var verifyCheck = ((callAtiv('checkCapacidade','update_checklist') && value.id_user == arrayConfigAtividades.perfil.id_user) || callAtiv('checkCapacidade','update_checklist_all')) ? true : false;
        var updateCheck = (value.data_entrega == '0000-00-00 00:00:00' && verifyCheck) ? true : false;

        var html_list = '<span class="info_checklist info_noclick" data-id-demanda="' + value.id_demanda + '" style="' + (verifyChecklist ? 'display:block;' : 'display:none;') + '">' +
            '   <span class="info_checklist_head">' +
            '       <span class="head_label">' +
            '           <i class="fas fa-check-double" style="color: #4285f4; padding-right: 3px; font-size: 12pt;"></i> ' +
            '           Checklist' +
            '       </span>' +
            (updateCheck ?
                '       <a class="newLink checklist_edit" data-act="atividades-call" data-fn="checklistEdit" data-scope="parent" style="position: absolute;right: 15px;">' +
                '           <i style="margin-right: 3px;font-size: 11pt;" class="fas fa-edit azulColor"></i>' +
                '       </a>' +
                '' : '') +
            (value.data_entrega != '0000-00-00 00:00:00' ?
                '       <a class="newLink checklist_toggle" data-act="atividades-call" data-fn="checklistToggle" data-scope="parent" style="position: absolute;right: 15px;">' +
                '           <i style="margin-right: 3px;font-size: 11pt;" class="fas fa-' + (value.data_avaliacao == '0000-00-00 00:00:00' ? 'chevron-down' : 'chevron-right') + ' azulColor"></i>' +
                '       </a>' +
                '' : '') +
            '       <div class="checklist_progress ui-progressbar ui-corner-all ui-widget ui-widget-content" data-valuenow="' + valueNow + '" data-max="' + (verifyChecklist ? checklist.length : 0) + '">' +
            '           <div class="ui-progressbar-value ui-corner-left ui-widget-header" style="width: ' + valuePercent + '%;"></div>' +
            '       </div>' +
            '   </span>' +
            '   <span class="info_checklist_itens" style="' + (value.data_avaliacao != '0000-00-00 00:00:00' ? 'display:none;' : '') + '" data-id-demanda="' + value.id_demanda + '">';
        if (verifyChecklist) {
            $.each(checklist, function (i, v) {
                var checked = (v.data_fim != '0000-00-00 00:00:00') ? true : false;
                var data_fim = (v.data_fim != '0000-00-00 00:00:00') ? getDateSemantic({ date: v.data_fim }).dateref : '';
                html_list += '   <span class="info_checklist_item ' + (checked ? 'checklist_checked' : '') + '" data-id-checklist="' + v.id_checklist + '" data-id-demanda="' + value.id_demanda + '" data-ordem="' + v.ordem + '" data-old-value="' + v.nome_checklist + '">' +
                    '       <span class="label_item" ' + (verifyCheck ? 'data-act="atividades-call" data-fn="checklistUpdate" data-scope="parent" data-enter-fn="checklistUpdate" data-enter-arg="rename"' : '') + ' ' + (updateCheck ? 'data-act="atividades-call" data-fn="checklistUpdate" data-scope="parent" data-arg="send" style="cursor:pointer"' : '') + ' >' +
                    '           <i class="' + (checked ? 'fas fa-check-square' : 'far fa-square') + '" style="color: #406987; margin-right: 3px; ' + (updateCheck ? 'cursor: pointer;' : '') + ' font-size: 12pt;"></i> ' +
                    '           <span class="label_name" ' + (verifyCheck ? 'data-act="atividades-call" data-fn="checklistUpdate" data-scope="parent" data-arg="rename" data-on="blur"' : '') + '>' + replaceTextToProcessoSEI(replaceTextToUrl(v.nome_checklist)) + '</span>' +
                    '       </span>' +
                    '       <span class="label_options">' +
                    (verifyCheck ?
                        '           <span class="checklist_remove" data-act="atividades-call" data-fn="checklistUpdate" data-scope="parent" data-arg="remove" style="cursor:pointer"><i class="far fa-trash-alt cinzaColor" style="font-size: 10pt;"></i></span>' +
                        '           <span class="checklist_order" ><i class="fas fa-bars cinzaColor" style="font-size: 12pt;"></i></span>' +
                        '' : '') +
                    '           <span class="checklist_date" data-date-fim="' + v.data_fim + '" ' + (data_fim != '' ? 'data-tip="Conclu\u00EDdo em: ' + moment(v.data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm') + '"' : '') + '>' + data_fim + '</span>' +
                    '       </span>' +
                    '   </span>';
            });
        }
        html_list += '</span>' +
            (verifyCheck ?
                '   <span class="info_checklist_new" style="text-align: right;">' +
                '       <a class="newLink checklist_new" data-act="atividades-call" data-fn="checklistUpdate" data-scope="parent" data-arg="new">' +
                '           <i style="margin-right: 3px;" class="fas fa-plus-circle azulColor"></i>' +
                '           Adicionar item' +
                '       </a>' +
                '   </span>' +
                '' : '') +
            '</span>';
        if (updateCheck) {
            html_list += '<span class="info_checklist_btn info_noclick" style="' + (!verifyChecklist ? 'display:block;' : 'display:none;') + ' padding: 0;opacity: 1;">' +
                '   <a class="newLink" data-act="atividades-call" data-fn="checklistOpen" data-scope="parent" style="font-size: 100%;">' +
                '       <i style="margin-right: 3px;" class="fas fa-check-double azulColor"></i>' +
                '       Inserir checklist' +
                '   </a>' +
                '</span>';
        }
        return html_list;
    } else if (mode == 'html') {
        var html_list = '<span class="info_checklist">' +
            '   <span class="info_checklist_head">' +
            '       <div class="checklist_progress ui-progressbar ui-corner-all ui-widget ui-widget-content" data-valuenow="' + valueNow + '" data-max="' + checklist.length + '">' +
            '           <div class="ui-progressbar-value ui-corner-left ui-widget-header" style="width: ' + valuePercent + '%;"></div>' +
            '       </div>' +
            '   </span>' +
            '   <span class="info_checklist_itens">';
        $.each(checklist, function (i, v) {
            var checked = (v.data_fim != '0000-00-00 00:00:00') ? true : false;
            var data_fim = (v.data_fim != '0000-00-00 00:00:00') ? getDateSemantic({ date: v.data_fim }).dateref : '';
            html_list += '   <span class="info_checklist_item ' + (checked ? 'checklist_checked' : '') + '">' +
                '       <span class="label_item">' +
                '           <i class="' + (checked ? 'fas fa-check-square' : 'far fa-square') + '" style="color: #406987; margin-right: 3px; font-size: 12pt;"></i> ' +
                '           <span class="label_name">' + replaceTextToProcessoSEI(replaceTextToUrl(v.nome_checklist)) + '</span>' +
                '       </span>' +
                '       <span class="label_options">' +
                '           <span class="checklist_date" data-date-fim="' + v.data_fim + '" ' + (data_fim != '' ? 'data-tip="Conclu\u00EDdo em: ' + moment(v.data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm') + '"' : '') + '>' + data_fim + '</span>' +
                '       </span>' +
                '   </span>';
        });
        html_list += '</span>' +
            '</span>';
        return html_list;
    } else if (mode == 'text') {
        var valueNow = jmespath.search(checklist, "[?data_fim!='0000-00-00 00:00:00']");
        valueNow = valueNow !== null ? valueNow.length : 0;
        var valuePercent = ((valueNow / checklist_length) * 100).toFixed(2);
        var text_list = '-- Checklist (' + valuePercent + '%)<br>';
        $.each(checklist, function (i, v) {
            var checked = (v.data_fim != '0000-00-00 00:00:00') ? true : false;
            text_list += '   ' + (checked ? '<i class=\'fas fa-check-square\'></i> <span style=\'text-decoration: line-through;\'>' + v.nome_checklist + '</span>' : '<i class=\'far fa-square\'></i> ' + v.nome_checklist) + '<br>';
        });
        return text_list;
    } else if (mode == 'icon') {
        var valueNow = jmespath.search(checklist, "[?data_fim!='0000-00-00 00:00:00']");
        valueNow = valueNow !== null ? valueNow.length : 0;
        var percentCheck = parseFloat(((valueNow / checklist_length) * 100).toFixed(2));
        var tooltip = getInfoAtividadeChecklist(value, 'text').replace(/'/g, "\\'");
        tooltip = 'data-tip="' + tooltip + '"';
        var html_icon = '<span class="info_checklist_icon" data-act="atividades-call" data-fn="infoAtividade" data-scope="parent" data-pass-el="0" data-id="' + value.id_demanda + '">' +
            '   <span class="dateboxDisplay" ' + tooltip + '>' +
            '       <svg viewBox="0 0 36 36" class="circular-chart"><path class="circle" stroke-dasharray="' + percentCheck + ', 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path></svg>' +
            '       <i class="fas fa-circle azulColor" style="padding-right: 3px;cursor: pointer;font-size: 12pt;"></i>' +
            '       <i class="fas fa-check-double" style="margin: 3px 0px 0px -16px;cursor: pointer;font-size: 8pt;position: absolute;color: #fff;"></i>' +
            '   </span>' +
            '</span>';
        return html_icon;
    } else if (mode == 'percent') {
        var valueNow = jmespath.search(checklist, "[?data_fim!='0000-00-00 00:00:00']");
        valueNow = valueNow !== null ? valueNow.length : 0;
        var percentCheck = parseFloat(((valueNow / checklist_length) * 100).toFixed(2));
        return percentCheck;
    }
}
export function getInfoAtividadeProdutividade_calc(value, result_ = 'text', mode = 'despendido') {
    var val_tempo_pactuado = ($('#ativ_tempo_pactuado').length > 0 && $('#ativ_tempo_pactuado').is('input')) ? parseFloat($('#ativ_tempo_pactuado').val()) : value.tempo_pactuado;
    var val_tempo_planejado = ($('#ativ_tempo_planejado').length > 0 && $('#ativ_tempo_planejado').is('input')) ? parseFloat($('#ativ_tempo_planejado').val()) : value.tempo_planejado;
    var val_tempo_despendido = ($('#ativ_tempo_despendido').length > 0 && $('#ativ_tempo_despendido').is('input')) ? parseFloat($('#ativ_tempo_despendido').val()) : value.tempo_despendido;
    var val_tempo_executado = ($('#ativ_tempo_executado').length > 0 && $('#ativ_tempo_executado').is('input')) ? parseFloat($('#ativ_tempo_executado').val()) : value.tempo_executado;

    var tempo_init = (mode == 'despendido') ? val_tempo_pactuado : val_tempo_planejado;
    var tempo_end = (mode == 'despendido') ? val_tempo_despendido : val_tempo_executado;
    var tempo_end = (tempo_end <= 0) ? 0.01 : tempo_end;
    var produtividade = (tempo_init / tempo_end).toFixed(5);
    var produtividadePercent = (produtividade * 100).toFixed(2);
    var produtividadePercentBR = toNumBr(produtividadePercent) + '%';
    return (result_ == 'text') ? toNumBr(produtividadePercent) + '%' : produtividade;
}
export function getInfoAtividadeProdutividade(value, show = false, mode = 'despendido', forcer = false) {
    var val_id_atividade = ($('#ativ_id_atividade').length > 0 && $('#ativ_id_atividade').is('select')) ? parseFloat($('#ativ_id_atividade').val()) : value.id_atividade;

    var val_tempo_despendido = ($('#ativ_tempo_despendido').length > 0 && $('#ativ_tempo_despendido').is('input')) ? parseFloat($('#ativ_tempo_despendido').val()) : value.tempo_despendido;
    var val_tempo_executado = ($('#ativ_tempo_executado').length > 0 && $('#ativ_tempo_executado').is('input')) ? parseFloat($('#ativ_tempo_executado').val()) : value.tempo_executado;
    var val_tempo_end = (mode == 'despendido') ? val_tempo_despendido : val_tempo_executado;
    var txt_tempo_end = (mode == 'despendido') ? 'Tempo despendido' : 'Tempo executado';

    var val_tempo_pactuado = ($('#ativ_tempo_pactuado').length > 0 && $('#ativ_tempo_pactuado').is('input')) ? parseFloat($('#ativ_tempo_pactuado').val()) : value.tempo_pactuado;
    var val_tempo_planejado = ($('#ativ_tempo_planejado').length > 0 && $('#ativ_tempo_planejado').is('input')) ? parseFloat($('#ativ_tempo_planejado').val()) : value.tempo_planejado;
    var val_tempo_init = (mode == 'despendido') ? val_tempo_pactuado : val_tempo_planejado;
    var txt_tempo_init = (mode == 'despendido') ? 'Tempo pactuado' : 'Tempo planejado';

    var txt_tempo_label = (mode == 'despendido') ? 'Por agilidade' : 'Por antecipa\u00E7\u00E3o';
    var tooltip_tempo = (mode == 'despendido')
        ? '<i class="fas fa-info-circle azulColor" style="margin: 0px 6px 0 2px;" data-tip="Raz\u00E3o entre o tempo pactuado (' + val_tempo_pactuado + ') e o tempo despendido (' + val_tempo_despendido + ')"></i>'
        : '<i class="fas fa-info-circle azulColor" style="margin: 0px 6px 0 2px;" data-tip="Raz\u00E3o entre o tempo planejado (' + val_tempo_planejado + ') e o tempo executado (' + val_tempo_executado + ')"></i>';

    var val_tempo_end = (val_tempo_end <= 0) ? 0.01 : val_tempo_end;
    var tempo_init = (val_tempo_init <= 1) ? decimalHourToMinute(val_tempo_init) + ' hora' : decimalHourToMinute(val_tempo_init) + ' horas';
    var tempo_end = (val_tempo_end <= 1) ? decimalHourToMinute(val_tempo_end) + ' hora' : decimalHourToMinute(val_tempo_end) + ' horas';
    var produtividade = (val_tempo_init / val_tempo_end).toFixed(5);
    var produtividadePercent = (produtividade * 100).toFixed(2);
    var produtividadeParam = (produtividade > 1)
        ? { color: 'stroke: #72a50a70;', class: 'verdeColor', icon: 'fas fa-arrow-alt-circle-up' }
        : { color: 'stroke: #ff010199;', class: 'vermelhoColor', icon: 'fas fa-arrow-alt-circle-down' };
    produtividadeParam = (produtividade == 1)
        ? { color: '', class: 'azulColor', icon: 'fas fa-check-circle' }
        : produtividadeParam;
    produtividadeParam = (produtividade >= 0.5 && produtividade < 1)
        ? { color: 'stroke: #ffa20199;', class: 'laranjaColor', icon: 'fas fa-minus-circle' }
        : produtividadeParam;
    var produtividadeHtml = tooltip_tempo + txt_tempo_label + ':' +
        '<div class="demandaProdutividade dateboxDisplay" data-tip="' + txt_tempo_init + ': ' + tempo_init + '<br>' + txt_tempo_end + ': ' + tempo_end + '" data-tip-title="Produtividade: ' + toNumBr(produtividadePercent) + '%">' +
        '   <svg viewBox="0 0 36 36" class="circular-chart"><path style="' + produtividadeParam.color + '" class="circle" stroke-dasharray="' + produtividadePercent + ', 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path></svg>' +
        '   <i class="' + produtividadeParam.icon + ' ' + produtividadeParam.class + '" style="padding-right: 3px;cursor: pointer;font-size: 12pt;margin-right: 3px;"></i> ' + toNumBr(produtividadePercent) + '%' +
        '</div>';

    var checkConfigAtiv = jmespath.search(arrayConfigAtividades.atividades, "[?id_atividade==`" + val_id_atividade + "`] | [0].config.desativa_produtividade");
    var infoProdutividade = (checkConfigAtiv)
        ? '- <span data-tip="C\u00E1lculo de produtividade desativado para este tipo de atividade"><i class="fas fa-info-circle azulColor"></i></span>'
        : (val_tempo_init == 0)
            ? '- <span data-tip="Vincule um tipo de atividade para o c\u00E1lculo de produtividade."><i class="fas fa-info-circle azulColor"></i></span>'
            : '-';

    var value_avaliacao = value.data_avaliacao != '0000-00-00 00:00:00' && value.avaliacao && value.avaliacao != 0 && value.avaliacao.length ? jmespath.search(value.avaliacao, "reverse(sort_by([*],&data_avaliacao)) | [0]") : false;
    var ativNaoEntregue = value_avaliacao
        ? jmespath.search(arrayConfigAtividades.avaliacao, "[?nota_atribuida==`" + value_avaliacao.nota_atribuida + "`].aceita_entrega | [0]")
        : false;
    ativNaoEntregue = (ativNaoEntregue == 0) ? true : false;

    var configAtviTempoMin = jmespath.search(arrayConfigAtividades.atividades, "[?id_atividade==`" + val_id_atividade + "`] | [0].config.tempo_minimo");
    configAtviTempoMin = (configAtviTempoMin === null)
        ? 0.2
        : (configAtviTempoMin == 0) ? false : parseFloat(configAtviTempoMin) / 100;

    var checkConfigAtivTempoMin = (configAtviTempoMin && val_tempo_end < val_tempo_init * configAtviTempoMin) ? true : false;
    var produtividadeHtml = (checkConfigAtivTempoMin)
        ? produtividadeHtml +
        '<div class="info_tags_follow info_alerta_produtividade" style="margin-top: 5px;">' +
        '   <span style="background-color: #f9efad;font-size: 10pt;color: #666;" class="tag_text">' +
        '       <i class="fas fa-info-circle azulColor" style="margin: 0px 2px;"></i>' +
        '       ' + txt_tempo_end + ' abaixo do m\u00EDnimo esperado (' + decimalHourToMinute(val_tempo_init * configAtviTempoMin) + ' ' + (val_tempo_init * configAtviTempoMin > 1 ? 'horas' : 'hora') + ')' +
        '   </span>' +
        '</div>'
        : produtividadeHtml;

    // console.log(value, val_tempo_despendido, val_tempo_executado, val_tempo_end, val_tempo_pactuado, val_tempo_planejado, val_tempo_init, produtividade, checkConfigAtivTempoMin);
    // console.log(!checkConfigAtiv, val_tempo_end > 0, val_tempo_init > 0, value.data_avaliacao == '0000-00-00 00:00:00', !ativNaoEntregue,show,checkCapacidade('chart_produtividade'),(typeof arrayConfigAtividades.perfil !== 'undefined' && value.id_user == arrayConfigAtividades.perfil.id_user), produtividadeHtml, infoProdutividade);

    return (forcer || !checkConfigAtiv && val_tempo_end > 0 && val_tempo_init > 0 && (value.data_avaliacao == '0000-00-00 00:00:00' || !ativNaoEntregue) && (show || callAtiv('checkCapacidade','chart_produtividade') || (typeof arrayConfigAtividades.perfil !== 'undefined' && value.id_user == arrayConfigAtividades.perfil.id_user))) ? produtividadeHtml : infoProdutividade;
}
export function getInfoAtividade(value) {
    var requisicao = (typeof value.requisicao_sei !== 'undefined' && value.requisicao_sei !== null && parseInt(value.requisicao_sei) != 0) ? value.nome_requisicao + ' (' + value.requisicao_sei + ')' : value.nome_requisicao;
    requisicao = (requisicao === null) ? '-' : requisicao;
    var linkProc = (value.id_procedimento !== null && value.processo_sei !== null && value.processo_sei != '') ? url_host + '?acao=procedimento_trabalhar&id_procedimento=' + value.id_procedimento : 'javascript:return false';
    var processoHtml = (value.processo_sei !== null && value.processo_sei != '')
        ? '               <a ' + (linkProc == '' ? 'style="cursor: auto;"' : 'style="font-size: 10pt;text-decoration: underline;" class="bLink" href="' + linkProc + '" target="_blank"') + '>' +
        '                   <i class="far fa-folder-open ' + (linkProc == '' ? '' : 'bLink') + '" ' + (linkProc == '' ? 'style="font-size: 10pt;color: #a2a2a2;"' : 'style="text-decoration: underline;"') + '></i> ' +
        '                   <span ' + (linkProc == '' ? '' : 'class="bLink"') + '></i> ' +
        '                       ' + value.processo_sei +
        '                   </span>' +
        '                   <i class="fas fa-external-link-alt bLink" style="font-size: 80%;vertical-align: top;margin-left: 5px;"></i>' +
        '               </a>'
        : '-';
    var entrega = (typeof value.documento_sei !== 'undefined' && value.documento_sei !== null && parseInt(value.documento_sei) != 0) ? value.nome_documento + ' (' + value.documento_sei + ')' : value.nome_documento;
    entrega = (value.processo_sei !== null && value.processo_sei != '') ? value.processo_sei + ' / ' + entrega : entrega;
    entrega = (entrega === null) ? '-' : entrega;
    var tempo_planejado = (value.tempo_planejado == 1) ? decimalHourToMinute(value.tempo_planejado) + ' hora' : decimalHourToMinute(value.tempo_planejado) + ' horas';
    var dias_planejado = (value.dias_planejado == 1) ? value.dias_planejado + ' dia' : value.dias_planejado + ' dias';
    var tempo_despendido = (value.tempo_despendido == 1) ? decimalHourToMinute(value.tempo_despendido) + ' hora' : decimalHourToMinute(value.tempo_despendido) + ' horas';
    var tempo_executado = (value.tempo_executado == 1) ? decimalHourToMinute(value.tempo_executado) + ' hora' : decimalHourToMinute(value.tempo_executado) + ' horas';
    var dias_despendido = (value.dias_despendido == 1) ? value.dias_despendido + ' dia' : value.dias_despendido + ' dias';
    var linkRequisicao = (value.id_documento_requisicao !== null && value.id_documento_requisicao != '') ? url_host + '?acao=procedimento_trabalhar&id_procedimento=' + value.id_procedimento + '&id_documento=' + value.id_documento_requisicao : 'javascript:return false';
    var projetado = getDatesFormatBR(value.data_distribuicao) + ' \u00E0 ' + getDatesFormatBR(value.prazo_entrega) + ' (' + tempo_planejado + ' / ' + dias_planejado + ')';
    var despendido = (value.data_entrega == '0000-00-00 00:00:00') ? '-' : getDatesFormatBR(value.data_inicio) + ' \u00E0 ' + getDatesFormatBR(value.data_entrega) + ' (' + tempo_despendido + ' / ' + dias_despendido + ')';
    var executado = (value.data_entrega == '0000-00-00 00:00:00') ? '-' : getDatesFormatBR(value.data_distribuicao) + ' \u00E0 ' + getDatesFormatBR(value.data_entrega) + ' (' + tempo_executado + ')';
    var statusAtividade = (moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss') < moment()) ? '<i class="fas fa-exclamation-triangle vermelhoColor"></i> Atrasado' : '<i class="far fa-clock azulColor"></i> No prazo';
    statusAtividade = (value.data_entrega != '0000-00-00 00:00:00' && moment(value.data_entrega, 'YYYY-MM-DD HH:mm:ss') <= moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss')) ? '<i class="fas fa-check-circle verdeColor"></i> Entregue no prazo' : statusAtividade;
    statusAtividade = (value.data_entrega != '0000-00-00 00:00:00' && moment(value.data_entrega, 'YYYY-MM-DD HH:mm:ss') > moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss')) ? '<i class="fas fa-check-circle laranjaColor"></i> Entregue fora do prazo' : statusAtividade;
    var modalDocRequisicao = "openDialogDoc({title: '" + requisicao + "', id_procedimento: '" + value.id_procedimento + "', id_documento: '" + value.id_documento_requisicao + "'})";
    var modalDocEntrega = "openDialogDoc({title: '" + entrega + "', id_procedimento: '" + value.id_procedimento + "', id_documento: '" + value.id_documento_entregue + "'})";
    var textPause = (typeof value.pausa_lista !== 'undefined' && value.pausa_lista !== null && value.pausa_lista.length > 0)
        ? $.map(value.pausa_lista, function (v, i) { return '(' + (i + 1) + ') ' + moment(v.data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') + ' \u00E0 ' + moment(v.data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') }).join('<br>')
        : false;
    textPause = (textPause) ? '<br><br> -- Paralisa\u00E7\u00F5es<br>' + textPause : '';

    var tagsAtivName = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? $.map(value.etiquetas, function (i) { return normalizeNameTag(i); }).join(' ') : '';
    var tagsAtivPriority = (tagsAtivName.indexOf('importante') !== -1) ? 'importanteBoxDisplay' : '';
    tagsAtivPriority = (tagsAtivName.indexOf('urgente') !== -1) ? 'urgenteBoxDisplay' : tagsAtivPriority;
    var planoAtiv = (value.plano) ? '#' + value.id_plano + ': ' + moment(value.plano.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(value.plano.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : 'Nenhum plano de trabalho vinculado \u00E0 demanda';
    // console.log(textPause, value.pausa_lista);
    var atividadeHtml = '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom; width: 170px;"><i class="iconPopup iconSwitch fas fa-hashtag cinzaColor"></i>ID ' + __.da_Demanda + ':</td>' +
        '          <td>' +
        '               ' + value.id_demanda +
        '          </td>' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom; width: 170px;"><i class="iconPopup iconSwitch fas fa-folder-open cinzaColor"></i>Processo SEI:</td>' +
        '          <td>' +
        '               ' + processoHtml +
        '          </td>' +
        '      </tr>' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom; width: 170px;"><i class="iconPopup iconSwitch fas fa-inbox cinzaColor"></i>Requisi\u00E7\u00E3o:</td>' +
        '          <td>' +
        '           ' + callAtiv('getHtmlLinkQuicView',{ id_procedimento: value.id_procedimento, id_documento: value.id_documento_requisicao, action: modalDocRequisicao, title: requisicao }) +
        '          </td>' +
        '      </tr>' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-briefcase cinzaColor"></i>Unidade:</td>' +
        '          <td>' + value.nome_unidade + ' (' + value.sigla_unidade + ')</td>' +
        '      </tr>' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-user-tie cinzaColor"></i>Respons\u00E1vel:</td>' +
        '          <td>' + (value.nome_completo ? value.nome_completo : '-') + '</td>' +
        '      </tr>' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-clipboard-list cinzaColor"></i>' + __.Atividade + ':</td>' +
        '          <td>' + (value.nome_atividade ? value.nome_atividade : '-') + '</td>' +
        '      </tr>' +
        '      <tr style="height: 40px;" data-index="' + value.id_demanda + '">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-comment-dots cinzaColor"></i>' + __.Assunto + ':</td>' +
        '          <td class="content_desc">' +
        '               <div class="content_edit" data-field="assunto" style="position:relative" data-id="' + value.id_demanda + '">' +
        '                   <span class="info">' + value.assunto + '</span>' +
        '                   ' + (callAtiv('checkCapacidade','edit_field') && callAtiv('checkPermissionAtiv',value) && callAtiv('checkCapacidade','edit_assunto') ? '<a class="newLink content_btnsave" data-act="atividades-call" data-fn="editFieldAtiv" data-tip="Editar ' + __.assunto + '"><i class="fas fa-edit" style="font-size: 100%;"></i></a>' : '') +
        '               </div>' +
        '          </td>' +
        '      </tr>' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-quote-left cinzaColor"></i>' + __.Observacao + ' ' + __.Gerencial + ':</td>' +
        '          <td class="content_desc">' +
        '               <div class="content_edit" data-field="observacao_gerencial" style="position:relative" data-id="' + value.id_demanda + '">' +
        '                   <span class="info">' + (value.observacao_gerencial ? value.observacao_gerencial : '-') + '</span>' +
        '                   ' + (callAtiv('checkCapacidade','edit_field') && callAtiv('checkPermissionAtiv',value) && callAtiv('checkCapacidade','edit_observacao_gerencial') ? '<a class="newLink content_btnsave" style="position: absolute;top: 0;right: 0;" data-act="atividades-call" data-fn="editFieldAtiv" data-tip="Editar ' + __.Observacao + ' ' + __.Gerencial + '"><i class="fas fa-edit" style="font-size: 100%;"></i></a>' : '') +
        '               </div>' +
        '          </td>' +
        '      </tr>' +
        '      <tr style="height: 40px;" class="' + tagsAtivPriority + '" data-index="' + value.id_demanda + '">' +
        '          <td style="vertical-align: middle;padding: 10px 0 0 0;"><i class="iconPopup iconSwitch fas fa-tags cinzaColor"></i>Etiquetas:</td>' +
        '          <td data-etiqueta-mode="ativ">' +
        '               <span class="info_tags_follow">' + $.map(value.etiquetas, function (i) { return $(getHtmlEtiqueta(i, 'ativ')).css('cursor', 'initial')[0].outerHTML }).join('') + '</span>' +
        (!callAtiv('checkCapacidade','edit_etiqueta') ? '' :
            '               <span class="info_tags_follow_txt seipro-atividades-tags" style="display:none">' +
            '                   <input id="infoAtivTagsPro" value="' + ((typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? value.etiquetas.join(';') : '') + '" class="atividadeTagsPro">' +
            '               </span>' +
            '') +
        '               <a class="newLink content_btnsave followLinkTags ' + (value.etiquetas !== null && value.etiquetas.length > 0 ? 'followLinkTagsEdit' : 'followLinkTagsAdd') + '" data-act="atividades-call" data-fn="showFollowEtiqueta" data-arg="show" data-arg2="ativ\" data-tip="' + (value.etiquetas !== null && value.etiquetas.length > 0 ? 'Editar etiqueta' : 'Adicionar etiqueta') + '"><i class="' + (value.etiquetas !== null && value.etiquetas.length > 0 ? 'fas fa-edit' : 'fas fa-tags') + '" style="font-size: 100%;"></i></a>' +
        '          </td>' +
        '      </tr>' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-handshake cinzaColor"></i>Tempo Pactuado:</td>' +
        '          <td><span title="' + value.tempo_pactuado + ' ' + (value.tempo_pactuado > 1 ? 'horas' : 'hora') + '">' + decimalHourToMinute(value.tempo_pactuado) + ' ' + (value.tempo_pactuado > 1 ? 'horas' : 'hora') + '</span> (Fator de ' + __.complexidade + ': ' + value.fator_complexidade + ')</td>' +
        '      </tr>' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-business-time cinzaColor"></i>Tempo Planejado:</td>' +
        '          <td>' + projetado + '</td>' +
        '      </tr>' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-hourglass-half cinzaColor"></i>Tempo Despendido:</td>' +
        '          <td>' + despendido + textPause + '</td>' +
        '      </tr>' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-hourglass-half cinzaColor"></i>Tempo Executado:</td>' +
        '          <td>' + executado + '</td>' +
        '      </tr>' +
        (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
            '      <tr style="height: 40px;">' +
            '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-toolbox cinzaColor"></i>Produtividade:</td>' +
            '          <td>' +
            '               <div>' + getInfoAtividadeProdutividade(value, true, 'despendido') + '</div>' +
            '               <div>' + getInfoAtividadeProdutividade(value, true, 'executado') + '</div>' +
            '          </td>' +
            '      </tr>' +
            '' : '') +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-handshake cinzaColor"></i>Plano de Trabalho:</td>' +
        '          <td>' + planoAtiv + '</td>' +
        '      </tr>' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-inbox cinzaColor"></i>Documento Entregue:</td>' +
        '          <td>' +
        '           ' + (value.data_entrega == '0000-00-00 00:00:00' ? '-' : callAtiv('getHtmlLinkQuicView',{ id_procedimento: value.id_procedimento, id_documento: value.id_documento_entregue, action: modalDocEntrega, title: entrega })) +
        '          </td>' +
        '      </tr>' +
        (callAtiv('checkOptionEntidade','exigir_homologacao_programas') && value.id_entrega ?
            '      <tr style="height: 40px;" data-id_entrega="' + value.id_entrega + '">' +
            '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-hand-holding cinzaColor"></i>Entrega:</td>' +
            '          <td style="text-align: left;">' +
            '               ' + (value.nome_entrega_sigla || '') +
            '               <a class="newLink linkDialogEntrega" style="cursor: pointer;" data-act="atividades-call" data-fn="openDialogEntrega" data-tip="Visualiza\u00E7\u00E3o detalhes da entrega">' +
            '                   <i class="fas fa-eye" style="font-size: 80%;"></i>' +
            '               </a>' +
            '          </td>' +
            '      </tr>' +
            '' : '') +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-info cinzaColor"></i>Status:</td>' +
        '          <td style="padding-left: 5px;">' + statusAtividade + '</td>' +
        '      </tr>' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-quote-left cinzaColor"></i>' + __.Observacao + ' ' + __.Tecnica + ':</td>' +
        '          <td class="content_desc">' +
        '               <div class="content_edit" data-field="observacao_tecnica" style="position:relative" data-id="' + value.id_demanda + '">' +
        '                   <span class="info">' + (value.observacao_tecnica ? value.observacao_tecnica : '-') + '</span>' +
        '                   ' + (callAtiv('checkCapacidade','edit_field') && callAtiv('checkPermissionAtiv',value) && callAtiv('checkCapacidade','edit_observacao_tecnica') ? '<a class="newLink content_btnsave" data-act="atividades-call" data-fn="editFieldAtiv" style="position: absolute;top: 0;right: 0;" data-tip="Editar ' + __.Observacao + ' ' + __.Tecnica + '"><i class="fas fa-edit" style="font-size: 100%;"></i></a>' : '') +
        '               </div>' +
        '          </td>' +
        '      </tr>' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-check-double cinzaColor"></i>Checklist:</td>' +
        '          <td><span class="info_checklist_text" style="position: relative;">' + (value.checklist ? getInfoAtividadeChecklist(value, 'actions') : '-') + '</span></td>' +
        '      </tr>';
    var value_avaliacao = value.data_avaliacao != '0000-00-00 00:00:00' && value.avaliacao && value.avaliacao != 0 && value.avaliacao.length ? jmespath.search(value.avaliacao, "reverse(sort_by([*],&data_avaliacao)) | [0]") : false;
    atividadeHtml += value_avaliacao
        ?
        (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
            '      <tr style="height: 40px;">' +
            '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-toolbox cinzaColor"></i>Produtividade:</td>' +
            '          <td><div style="margin-left: -10px;">' + getInfoAtividadeProdutividade(value) + '</div></td>' +
            '      </tr>' +
            '' : '') +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-tasks cinzaColor"></i>Avalia\u00E7\u00E3o:</td>' +
        '          <td style="vertical-align: baseline;">' +
        '               <div class="ratingWhy" style="text-align: left; margin: 0;">' +
        '                   <i data-nota="' + (value_avaliacao.nota_atribuida === false ? '-' : value_avaliacao.nota_atribuida) + '" class="fas fa-star cinzaColor starGold starSelected"></i>' +
        '                   ' + (value_avaliacao.comentarios != '' ? '<span class="answer" style="cursor: initial;"><i class="far fa-comment-alt cinzaColor"></i> ' + value_avaliacao.comentarios + '</span>' : '') +
        '                   ' + (value_avaliacao.nota_atribuida && value_avaliacao.justificativas.length > 0 ? $.map(value_avaliacao.justificativas, function (i) { return '<span class="answer" style="cursor: initial;">' + i.nome_justificativa + '</span>' }).join('') : (value_avaliacao.nota_atribuida === false ? 'Avalia\u00E7\u00E3o Dispensada' : '')) +
        '               </div>' +
        '          </td>' +
        '      </tr>'
        : '';
    return atividadeHtml;
}
