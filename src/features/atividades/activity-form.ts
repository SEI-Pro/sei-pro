// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { callAtiv } from './call.js';
/**
 * Atividades — campos, tempos e opções dos formulários.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import { atividadesDialogDocAttrs } from './templates.js';
import {
    checkHomologacaoPreviaPlanos as domainCheckHomologacaoPreviaPlanos,
    checkHomologacaoPreviaProgramas as domainCheckHomologacaoPreviaProgramas,
    findConfigItemById
} from './domain.js';
import { getServerAtividades } from './server.js';
import { getAtividadesContext } from './context.js';
import { selectEntityConfig, selectEntityOption, hasEntityOption, selectUnitConfig } from './config-queries.js';
import { getNameGenre } from '../../shared/nomenclatura.js';

export function getHtmlLinkQuicView(value) {
    var html = (value.id_procedimento !== null && value.id_procedimento != 0 && value.id_documento !== null && value.id_documento != 0)
        ? '<a class="bLink" style="text-decoration: underline; font-size: 10pt; cursor: pointer;" ' + atividadesDialogDocAttrs({
            title: value.docTitle || value.title,
            id_procedimento: value.id_procedimento,
            id_documento: value.id_documento
        }) + ' data-tip="Visualiza\u00E7\u00E3o r\u00E1pida">' +
        '    ' + value.title +
        '    <i class="fas fa-eye bLink" style="font-size: 80%;vertical-align: top;margin-left: 5px;"></i>' +
        '</a>'
        : '<span>' +
        '    ' + value.title +
        '</span>';
    return html;
}
export function checkAllInputEmail(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    _parent.find('input[type="email"]').each(function () {
        checkInputEmail(this);
    });
}
export function checkInputEmail(this_) {
    var _this = $(this_);
    var value = _this.val();
    if (checkValue(_this) && validateEmail(value)) {
        _this.removeClass('requiredNull');
        if (_this.data('server')) checkInputUserServer(this_);
        if (_this.attr('id') == 'user_email') {
            var username = (value.indexOf('@') !== -1) ? value.split('@')[0] : false;
            if (username) _this.closest('table').find('#user_login').val(username);
        }
    } else {
        _this.addClass('requiredNull');
    }
}
export function checkInputUserServer(this_) {
    var _this = $(this_);
    var value = _this.val();
    if (_this.data('server') && value.trim() != '') {
        var type = _this.attr('id');
        var action = 'config_new_users';
        var param = {
            action: action,
            mode: 'check',
            value: value,
            type: type,
        };
        getServerAtividades(param, action);
    }
}
export function moveUserCapacity(id_user) {
    var action = 'config_new_users';
    var param = {
        action: action,
        mode: 'move',
        id_user: id_user
    };
    getServerAtividades(param, action);
}
export function checkSigleInputDateAtiv(this_) {
    clearTimeout(dly);
    dly = setTimeout(function () {
        checkSigleInputDateAtiv_(this_);
    }, 1000);
}
export function checkSigleInputDateAtiv_(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var input = _parent.find('input[data-type="inicio"]');
    var element = input[0];
    var config_unidade = getConfigDadosUnidade();
    var dataInicio = input.val();
    var dataMin = input.attr('min');
    var dataMinFormat = moment(dataMin, config_unidade.hora_format).format('DD/MM/YYYY HH:mm');
    var labelInicio = input.data('name');
    var labelMin = input.data('name-min');
    if (moment(dataMin, config_unidade.hora_format) > moment(dataInicio, config_unidade.hora_format)) {
        element.setCustomValidity('*');
    } else {
        element.setCustomValidity('');
    }
    var userValidation = element.checkValidity();

    if (userValidation) {
        _this.removeClass('requiredNull');
        updateButtonConfirm(this_, true);
        return true;
    } else {
        _this.addClass('requiredNull');
        element.setCustomValidity('A ' + labelInicio + ' deve ser maior ou igual que a ' + labelMin + ' (' + dataMinFormat + ')');
        var isValid = element.reportValidity();
        updateButtonConfirm(this_, false);
        return false;
    }
}
export function actionsAtividade(id_demanda = 0, mode = 'action') {
    infraTooltipOcultar();
    if (id_demanda != 0) {
        var tr = $('#tabelaAtivPanel table tr[data-index="' + id_demanda + '"]');
        if (tr.is(':visible')) {
            var tableDemanda = $('#tabelaAtivPanel table');
            var countSelected = tableDemanda.find('tr.infraTrMarcada').length;
            if (countSelected > 0) {
                tableDemanda.find('.lnkInfraCheck').data('index', 1).trigger('click');
            }
            tr.find('td').eq(0).find('input[type="checkbox"]').trigger('click');
        }
        var value = callAtiv('getAtividadeData',id_demanda);
        if (value) {
            if (callAtiv('checkCapacidade','edit_atividade') && callAtiv('checkCapacidade','select_user_atividade')) {
                if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && id_demanda != 0 && callAtiv('checkCapacidade','rate_atividade') && value.data_avaliacao == '0000-00-00 00:00:00' && value.data_entrega != '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00') {
                    if (mode == 'action') {
                        callAtiv('rateAtividade',id_demanda);
                    } else if (mode == 'icon') {
                        return { icon: 'fas fa-star-half-alt', name: 'Avaliar ' + __.demanda, action: 'rate' }
                    }
                } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && id_demanda != 0 && callAtiv('checkCapacidade','complete_atividade') && value.data_inicio != '0000-00-00 00:00:00' && value.data_entrega == '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00') {
                    if (mode == 'action') {
                        callAtiv('completeAtividade',id_demanda);
                    } else if (mode == 'icon') {
                        return { icon: 'fas fa-check-circle', name: 'Concluir ' + __.demanda, action: 'complete' }
                    }
                } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && callAtiv('checkCapacidade','send_atividade') && value.data_avaliacao != '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00') {
                    if (mode == 'action') {
                        callAtiv('archiveAtividade',id_demanda);
                    } else if (mode == 'icon') {
                        return { icon: 'fas fa-archive', name: __.Arquivar + ' ' + __.demanda, action: 'send' }
                    }
                } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && value.data_envio == '0000-00-00 00:00:00') {
                    if (mode == 'action') {
                        callAtiv('startAtividade',id_demanda);
                    } else if (mode == 'icon') {
                        return { icon: 'fas fa-play-circle', name: 'Iniciar ' + __.demanda, action: 'start' }
                    }
                } else {
                    if (mode == 'action') {
                        callAtiv('infoAtividade',id_demanda);
                    } else if (mode == 'icon') {
                        return { icon: 'fas fa-info-circle', name: 'Informa\u00E7\u00F5es ' + __.da_demanda, action: 'info' }
                    }
                }
            } else {
                if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && value.id_user == 0) {
                    if (mode == 'action') {
                        callAtiv('startAtividade',id_demanda);
                    } else if (mode == 'icon') {
                        return { icon: 'fas fa-play-circle', name: 'Iniciar ' + __.demanda, action: 'start' }
                    }
                } else if (typeof arrayConfigAtividades.perfil !== 'undefined' && value.id_user != 0 && value.id_user != parseInt(arrayConfigAtividades.perfil.id_user)) {
                    if (mode == 'action') {
                        callAtiv('infoAtividade',id_demanda);
                    } else if (mode == 'icon') {
                        return { icon: 'fas fa-info-circle', name: 'Informa\u00E7\u00F5es ' + __.da_demanda, action: 'info' }
                    }
                } else {
                    if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && callAtiv('checkCapacidade','start_atividade') && value.data_inicio == '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00') {
                        if (mode == 'action') {
                            callAtiv('startAtividade',id_demanda);
                        } else if (mode == 'icon') {
                            return { icon: 'fas fa-play-circle', name: 'Iniciar ' + __.demanda, action: 'start' }
                        }
                    } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && callAtiv('checkCapacidade','complete_atividade') && value.data_inicio != '0000-00-00 00:00:00' && value.data_entrega == '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00') {
                        if (mode == 'action') {
                            callAtiv('completeAtividade',id_demanda);
                        } else if (mode == 'icon') {
                            return { icon: 'fas fa-check-circle', name: 'Concluir ' + __.demanda, action: 'complete' }
                        }
                    } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && callAtiv('checkCapacidade','rate_atividade') && value.data_avaliacao == '0000-00-00 00:00:00' && value.data_entrega != '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00') {
                        if (mode == 'action') {
                            callAtiv('rateAtividade',id_demanda);
                        } else if (mode == 'icon') {
                            return { icon: 'fas fa-star-half-alt', name: 'Avaliar ' + __.demanda, action: 'rate' }
                        }
                    } else {
                        if (mode == 'action') {
                            callAtiv('infoAtividade',id_demanda);
                        } else if (mode == 'icon') {
                            return { icon: 'fas fa-info-circle', name: 'Informa\u00E7\u00F5es ' + __.da_demanda, action: 'info' }
                        }
                    }
                }
            }
        }
    }
}
export function notifyAtividade(id_demanda = 0, event = false, loop = 10) {
    var value = callAtiv('getAtividadeData',id_demanda);
    var dados_usuario = jmespath.search(arrayConfigAtividades.usuarios, "[?id_user==`" + value.id_user + "`] | [0]");
    // console.log(value, id_demanda, event);
    if (value) {
        if (value.id_user == 0) {
            alertaBoxPro('Sucess', 'check-circle', 'Envio de notifica\u00E7\u00E3o dispon\u00EDvel apenas para demandas atribu\u00EDdas.');
        } else if (dados_usuario === null) {
            alertaBoxPro('Sucess', 'check-circle', 'Usu\u00E1rio n\u00E3o lotado na unidade.');
        } else if (dados_usuario !== null) {
            var notificacao_unidade = arrayConfigAtivUnidade.config.distribuicao.notificacao;
            var requisicao = (typeof value.requisicao_sei !== 'undefined' && value.requisicao_sei !== null && parseInt(value.requisicao_sei) != 0)
                ?
                !!value.nome_requisicao && value.requisicao_sei ? value.nome_requisicao + ' (' + value.requisicao_sei + ')' : ''
                :
                !!value.nome_requisicao ? value.nome_requisicao : '';
            var documento = (typeof value.documento_sei !== 'undefined' && value.documento_sei !== null && parseInt(value.documento_sei) != 0)
                ?
                !!value.nome_documento && !!value.numero_documento && !!value.documento_sei ? value.nome_documento + ' ' + value.numero_documento + ' (' + value.documento_sei + ')' : ''
                :
                !!value.nome_documento && !!value.numero_documento ? value.nome_documento + ' ' + value.numero_documento : '';
            var data_entrega = moment(value.data_entrega, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm');
            var email_remetente = (value.data_entrega == '0000-00-00 00:00:00') ? notificacao_unidade.email : dados_usuario.email;
            var email_destinatario = (value.data_entrega == '0000-00-00 00:00:00') ? dados_usuario.email : notificacao_unidade.email;
            var list_destinatario = (value.data_entrega != '0000-00-00 00:00:00') ? jmespath.search(arrayConfigAtividades.usuarios, "[?recebe_notificacoes==`true`]") : null;
            list_destinatario = (list_destinatario !== null)
                ? $.map(list_destinatario, function (v) {
                    return '<option value="' + v.id_user + '">' + v.nome_completo + ' &lt;' + v.email + '&gt;</option>';
                }).join('') : '';

            var bodyMail = (value.data_entrega != '0000-00-00 00:00:00') ? notificacao_unidade.texto_conclusao : notificacao_unidade.texto_criacao;
            bodyMail = bodyMail.replace('{usuario}', !!value.apelido ? value.apelido : '');
            bodyMail = bodyMail.replace('{requisicao}', !!requisicao ? requisicao : '');
            bodyMail = bodyMail.replace('{atividade}', !!value.nome_atividade ? value.nome_atividade : '');
            bodyMail = bodyMail.replace('{processo}', !!value.processo_sei ? value.processo_sei : '');
            bodyMail = bodyMail.replace('{assunto}', !!value.assunto ? value.assunto : '');
            bodyMail = bodyMail.replace('{prazo}', !!value.dias_planejado ? value.dias_planejado : '');
            bodyMail = bodyMail.replace('{tempo_pactuado}', !!value.tempo_pactuado ? value.tempo_pactuado : '');
            bodyMail = bodyMail.replace('{tempo_planejado}', !!value.tempo_planejado ? value.tempo_planejado : '');
            bodyMail = bodyMail.replace('{data_entrega}', !!data_entrega ? data_entrega : '');
            bodyMail = bodyMail.replace('{observacoes_gerenciais}', !!value.observacao_gerencial ? value.observacao_gerencial : '');
            bodyMail = bodyMail.replace('{observacoes}', !!value.observacao_tecnica ? value.observacao_tecnica : '');
            bodyMail = bodyMail.replace('{documento_produto}', !!documento ? documento : '');
            // bodyMail = encodeURIComponent(bodyMail);
            bodyMail = unicodeToChar(bodyMail.replace(/\\n/g, "\n"));
            bodyMail += (value.data_entrega != '0000-00-00 00:00:00') ? "\n\n" + dados_usuario.nome_completo : "\n\n" + arrayConfigAtivUnidade.nome_unidade + " - " + arrayConfigAtivUnidade.sigla_unidade;

            var email_assunto = '[DEMANDA] ' + (requisicao !== null ? requisicao + ' - ' : '') + value.assunto;
            // var hrefMailto = 'mailto:'+userMail+'?subject='+subjectMail+'&body='+bodyMail;
            // window.location.href = hrefMailto;

            var htmlBox = '<div id="boxAtividade" class="seipro-atividades-box atividadeWork seipro-atividades-work">' +
                '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
                '      <tr>' +
                '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                '               <label><i class="iconPopup iconSwitch fas fa-envelope cinzaColor"></i>De:</label>' +
                '           <td style="text-align: left;">' + email_remetente + '</td>' +
                '      </tr>' +
                '      <tr>' +
                '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                '               <label for="ativ_data_destinatario"><i class="iconPopup iconSwitch fas fa-at cinzaColor"></i>Para:</label>' +
                '           <td style="text-align: left;">' +
                '               <select id="ativ_data_destinatario"><option value="0">' + email_destinatario + '</option>' + list_destinatario + '</select>' +
                '           </td>' +
                '      </tr>' +
                '      <tr>' +
                '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                '               <label><i class="iconPopup iconSwitch fas fa-inbox cinzaColor"></i>Assunto:</label>' +
                '           <td style="text-align: left;">' + email_assunto + '</td>' +
                '      </tr>' +
                '      <tr>' +
                '          <td style="text-align: left;" class="label">' +
                '               <label for="ativ_data_mensagem"><i class="iconPopup iconSwitch fas fa-comment cinzaColor"></i>Mensagem:</label>' +
                '           <td style="text-align: left;"><textarea id="ativ_data_mensagem" class="setClassEditor" style="min-height: 250px;">' + bodyMail + '</textarea></td>' +
                '      </tr>' +
                '   </table>' +
                '</div>';

            resetDialogBoxPro('dialogBoxPro');
            dialogBoxPro = $('#dialogBoxPro')
                .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
                .dialog({
                    title: 'Gerar Notifica\u00E7\u00E3o',
                    width: 780,
                    open: function () {
                        updateButtonConfirm(this, true);
                        initChosenReplace('box_init', this, true);
                    },
                    close: function () {
                        $('#boxAtividade').remove();
                        resetDialogBoxPro('dialogBoxPro');
                    },
                    buttons: [{
                        text: 'Enviar',
                        class: 'confirm',
                        click: function (event) {

                            var action = 'notify_send';
                            var param = {
                                action: action,
                                id_user: $('#ativ_data_destinatario').val(),
                                id_demanda: id_demanda,
                                assunto: email_assunto,
                                mensagem: $('#ativ_data_mensagem').val().replace(/(?:\r\n|\r|\n)/g, '<br>')
                            };
                            callAtiv('getConfigServer',action, param);
                        }
                    }]
                });
        }
    } else if (loop > 0) {
        setTimeout(function () {
            notifyAtividade(id_demanda, event, loop - 1);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload notifyAtividade');
        }, 1000);
    }
}
export function deleteAtividade(id_demanda = 0) {
    var action = (callAtiv('checkCapacidade','delete_atividade_all')) ? 'delete_atividade_all' : 'delete_atividade';
    var id_unidade = (id_demanda == 0) ? $('#ativ_id_unidade').val() : arrayConfigAtivUnidade.id_unidade;
    id_unidade = (typeof id_unidade !== 'undefined') ? id_unidade : false;

    id_demanda = (id_demanda == 0) ? $('#ativ_id_demanda').val() : id_demanda;
    id_demanda = (typeof id_demanda !== 'undefined' && id_demanda != 0) ? id_demanda : false;
    var param = {
        id_demanda: id_demanda,
        id_unidade: id_unidade,
        action: action
    };
    if (id_demanda && id_unidade) { getServerAtividades(param, action) }
}
export function extractDataAtiv(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var arrayAtiv = {};
    _parent.find('input,textarea,select').each(function () {
        if (typeof $(this).data('key') !== 'undefined') {
            var value = $(this).val();
            var date_format = (value && value.indexOf('T') !== -1) ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
            var dataValue = ($(this).attr('type') == 'number' || (value != '' && $(this).data('key').indexOf('id_') !== -1)) ? parseInt(value) : value;
            dataValue = ($(this).attr('type') == 'number' && parseFloat($('#ativ_tempo_despendido').attr('step')) >= 1) ? parseFloat(value) : value;
            dataValue = ($(this).attr('type') == 'date') ? (value == '' ? '' : (moment(value, date_format).format('YYYY-MM-DD') + ' 00:00:00')) : dataValue;
            dataValue = ($(this).attr('type') == 'datetime-local') ? (value == '' ? '' : moment(value, date_format).format('YYYY-MM-DD HH:mm:ss')) : dataValue;
            dataValue = ($(this).attr('type') == 'checkbox') ? ($(this).is(':checked') ? 'on' : 'off') : dataValue;
            dataValue = ($(this).is('textarea') || ($(this).is('input') && $(this).attr('type') == 'text')) ? dataValue.replace(/["']/g, "").replace(/([\u200B]+|[\u200C]+|[\u200D]+|[\u200E]+|[\u200F]+|[\uFEFF]+)/g, "") : dataValue;
            dataValue = ($(this).is('input') && $(this).attr('type') == 'hidden' && $(this).data('type') == 'json') ? JSON.parse(value) : dataValue;
            dataValue = ($(this).is('input') && $(this).attr('type') == 'hidden' && $(this).data('type') == 'num') ? parseFloat(value) : dataValue;
            dataValue = ($(this).is('input') && $(this).attr('type') == 'hidden') ? value : dataValue;
            arrayAtiv[$(this).data('key')] = dataValue;
        }
    });
    arrayAtiv.etiquetas = (typeof arrayAtiv.etiquetas !== 'undefined' && arrayAtiv.etiquetas != '' && arrayAtiv.etiquetas.indexOf(';') !== -1)
        ? arrayAtiv.etiquetas.split(';')
        : (typeof arrayAtiv.etiquetas !== 'undefined' && arrayAtiv.etiquetas != '') ? [arrayAtiv.etiquetas] : null;
    arrayAtiv.tempo_pactuado = (arrayAtiv.tempo_pactuado != '') ? _parent.find('#ativ_tempo_pactuado').data('tempo-pactuado') : arrayAtiv.tempo_pactuado;
    arrayAtiv.tempo_planejado = (Number.isNaN(arrayAtiv.tempo_planejado)) ? '' : arrayAtiv.tempo_planejado;
    arrayAtiv.fator_complexidade = (arrayAtiv.fator_complexidade != '') ? parseFloat(_parent.find('#ativ_fator_complexidade').val()) : arrayAtiv.fator_complexidade;
    arrayAtiv.fator_complexidade = (Number.isNaN(arrayAtiv.fator_complexidade)) ? null : arrayAtiv.fator_complexidade;
    arrayAtiv.lista_prioridades = extractInputPriority(this_);
    arrayAtiv.lista_marcador = $('#ativ_marcador').is(':visible')
        ? {
            id_marcador: $('#ativ_lista_marcador').val(),
            icon: $('#ativ_lista_marcador').find('option:selected').data('img-src'),
            tag: $('#ativ_lista_marcador').find('option:selected').text()
        }
        : false;
    arrayAtiv.lista_recorrencia = (arrayAtiv.hasOwnProperty('lista_recorrencia') && arrayAtiv.lista_recorrencia != '') ? JSON.parse(arrayAtiv.lista_recorrencia) : arrayAtiv.lista_recorrencia;
    arrayAtiv.id_user = (arrayAtiv.hasOwnProperty('id_user') && arrayAtiv.id_user !== null && arrayAtiv.id_user.trim() != '') ? arrayAtiv.id_user : 0;
    arrayAtiv.id_plano = (arrayAtiv.hasOwnProperty('id_plano') && arrayAtiv.id_plano !== null && arrayAtiv.id_plano.trim() != '') ? arrayAtiv.id_plano : 0;
    arrayAtiv.id_entrega = (arrayAtiv.hasOwnProperty('id_entrega') && arrayAtiv.id_entrega !== null && arrayAtiv.id_entrega.trim() != '') ? parseInt(arrayAtiv.id_entrega) : false;
    arrayAtiv.id_unidade = (arrayAtiv.id_unidade == '') ? arrayConfigAtivUnidade.id_unidade : arrayAtiv.id_unidade;
    return arrayAtiv;
}
export function extractInputPriority(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var id_demanda = _parent.data('demanda');
    var priority = [];
    var index = 0;
    $('#ativ_lista_prioridades:visible').find('option').each(function () {
        var selected = $(this).is(':selected');
        var data = $(this).data();
        if (selected) {
            index++;
            priority.push({ id_demanda: id_demanda, prioridade: index });
        }
        index++;
        priority.push({ id_demanda: data.demanda, prioridade: index });
    });
    return priority;
}
export function changeProtocoloBoxAtiv(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    if (checkValue(_this)) {
        var protocoloSEI = _this.val().trim();
        getIDProtocoloSEI(protocoloSEI,
            function (html) {
                let $html = $(html);
                var params = getParamsUrlPro($html.find('#ifrArvore').attr('src'));
                var hidden = _this.closest('td').find('input[type="hidden"]');
                var param = hidden.data('param');
                hidden.val(params[param]);
                _this.removeClass('requiredNull');
            },
            function () {
                alertaBoxPro('Error', 'exclamation-triangle', 'Protocolo n\u00E3o encontrado!');
                _this.addClass('requiredNull');
            });
    } else {
        _this.removeClass('requiredNull');
        _this.closest('td').find('input[type="hidden"]').val('');
    }
}
export function checkThisAtivRequiredFields(this_) {
    var _this = $(this_);
    if (_this.prop('required') && checkValue(_this)) { _this.removeClass('requiredNull') }
    if (checkAtivRequiredFields(this_, 'check')) { updateButtonConfirm(this_, true) } else { updateButtonConfirm(this_, false) }
}
export function checkAtivRequiredDocuments(this_) {
    var _this = $(this_);
    var _return = true;
    var _parent = ($('.ui-dialog').is(':visible')) ? _this.closest('.ui-dialog') : _this.closest('.seiProForm');
    var table_docs = _parent.find('[data-key="documentos"]');
    table_docs = typeof table_docs !== 'undefined' && table_docs.is(':visible') ? true : false;
    var doc = callAtiv('extractOptionConfigItem',_parent);
    doc = doc && typeof doc.documentos !== 'undefined' ? jmespath.search(doc.documentos, "[?documento!='undefined'] | [?id_procedimento!='0']") : null;
    if (table_docs) {
        if (typeof doc !== 'undefined' && doc !== null && doc.length) {
            _return = true;
        } else {
            _return = false;
            alertaBoxPro('Error', 'exclamation-triangle', 'Necess\u00E1ria a vincula\u00E7\u00E3o de um documento!');
        }
    }
    return _return;
}
export function checkAtivRequiredFields(this_, mode) {
    var _this = $(this_);
    var _parent = ($('.ui-dialog').is(':visible')) ? _this.closest('.ui-dialog') : _this.closest('.seiProForm');
    var _return = true;

    function checkFilds(__this) {
        if (!checkValue(__this)) {
            if (mode == 'mark') {
                __this.addClass('requiredNull');
                $('#' + __this.attr('id') + '_chosen').addClass('requiredNull');
            }
            _return = false;
        } else {
            if (mode == 'mark') {
                __this.removeClass('requiredNull');
                $('#' + __this.attr('id') + '_chosen').removeClass('requiredNull');
            }
        }
    }
    _parent.find('input,textarea,select').filter('[required]:visible').not(':disabled').each(function () {
        checkFilds($(this));
    });
    _parent.find('.requiredSelect').each(function () {
        checkFilds($(this));
    });

    return _return;
}
export function changeAtivMultiSwitch(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    if (_this.is(':checked')) {
        _parent.find('#div_ativ_fator_multiplicacao').show();
    } else {
        _parent.find('#div_ativ_fator_multiplicacao').hide();
    }
    _parent.find('#ativ_fator_multiplicacao').val(1);
    updateAtivTempoPactuado(this_);
}
export function resizeDialogBoxSwitch(this_, padding) {
    var _this = $(this_);
    var height = $('.ui-dialog:visible').height();
    var boxHeight = (_this.is(':checked')) ? height + padding : 'auto';
    dialogBoxPro.dialog('option', 'height', boxHeight);
}
export function changeAtivVinculacaoSwitch(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    if (_this.is(':checked')) {
        _parent.find('#div_ativ_lista_vinculacao').show();
    } else {
        _parent.find('#div_ativ_lista_vinculacao').hide();
    }
    _parent.find('#div_ativ_lista_vinculacao').val(0);
    // resizeDialogBoxSwitch(this_, 130);
}
export function changeAtivMarcadorSwitch(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    if (_this.is(':checked')) {
        _parent.find('#div_ativ_lista_marcador').show();

        var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
        var listaMarcadores = getOptionsPro('listaMarcadores');
        var listaMarcadores_unidade = getOptionsPro('listaMarcadores_unidade');
        var dataMarcador = (id_procedimento && listaMarcadores) ? jmespath.search(listaMarcadores, "[?id_procedimento=='" + id_procedimento + "'] | [0]") : null;
        dataMarcador = (dataMarcador !== null) ? dataMarcador : false;
        var textTag = dataMarcador.name;
        var tagName = dataMarcador.tag;

        if (listaMarcadores && listaMarcadores_unidade == idUnidade) {
            var htmlOptions = $.map(listaMarcadores, function (v) {
                var selected = (tagName && tagName == v.name) ? 'selected' : '';
                return '<option data-img-src="' + v.img + '" value="' + v.value + '" ' + selected + '>' + v.name + '</option>';
            }).join('');
            _parent.find('#ativ_lista_marcador').html(htmlOptions).trigger('chosen:updated').chosenImage();
        } else {
            var href = parent.getTreeLinkUrlByName('Gerenciar Marcador');
            if (href !== null) {
                $.ajax({
                    url: href
                }).done(function (html) {
                    var $html = $(html);
                    listaMarcadores = getListaMarcadores($html).array;
                    var htmlOptions = $.map(listaMarcadores, function (v) {
                        var selected = (tagName && tagName == v.name) ? 'selected' : '';
                        return '<option data-img-src="' + v.img + '" value="' + v.value + '" ' + selected + '>' + v.name + '</option>';
                    }).join('');
                    _parent.find('#ativ_lista_marcador').html(htmlOptions).trigger('chosen:updated').chosenImage();
                });
            }
        }
    } else {
        _parent.find('#div_ativ_lista_marcador').hide();
        _parent.find('#ativ_lista_marcador').html('');
    }
    _parent.find('#div_ativ_lista_marcador').val(0);
    // resizeDialogBoxSwitch(this_, 130);
}
export function changeAtivPrioritySwitch(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    if (_this.is(':checked')) {
        _parent.find('#div_ativ_lista_prioridades').show();
    } else {
        _parent.find('#div_ativ_lista_prioridades').hide();
    }
    _parent.find('#ativ_lista_prioridades').val(0);
    updateAtivTempoPactuado(this_);
    // resizeDialogBoxSwitch(this_, 130);
}
export function changeAtivRecalcPrazoSwitch(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    if (_this.is(':checked')) {
        _parent.find('.infoAtivRecalcPrazo').show();
    } else {
        _parent.find('.infoAtivRecalcPrazo').hide();
    }
}
export function initSimpleTableCellEditor(id, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof SimpleTableCellEditor !== 'undefined') {
        getSimpleTableCellEditor(id);
    } else {
        setTimeout(function () {
            initSimpleTableCellEditor(id, TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initSimpleTableCellEditor');
        }, 500);
    }
}
export function getSimpleTableCellEditor(id) {
    ativBox = new SimpleTableCellEditor(id);
    ativBox.SetEditableClass("editCell");
}
export function changeAtivChecklistSwitch(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    var idTable = 'ativBox_checklist';
    var table = $('#' + idTable);
    var table_body = table.find('tbody');
    var checklist = $('#ativ_checklist').val();
    checklist = (checklist != '') ? JSON.parse(checklist) : [];
    if (_this.is(':checked')) {
        _parent.find('#div_ativ_lista_checklist').show();

        if (!table.hasClass('tableEditCell')) {
            if (typeof SimpleTableCellEditor === 'undefined') {
                $.getScript((URL_SPRO + "js/lib/jquery-table-edit.min.js"));
                initSimpleTableCellEditor(idTable);
            } else {
                getSimpleTableCellEditor(idTable);
            }
            table.addClass('tableEditCell');
        }

        $('#' + idTable + '.tableSortable tbody').sortable({
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
                });
                changeAtivChecklistInput(this);
            }
        });

        if (checklist.length == 0) {
            var html = '                                        <tr data-index="0" data-key="checklist" style="text-align: left;">' +
                '                                            <td data-act="atividades-composite" data-chain="changeConfigItemCell|changeAtivChecklistInput" class="editCell" data-type="text" style="padding: 0 10px;"></td>' +
                '                                            <td style="width: 50px; text-align: center;">' +
                '                                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                '                                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                '                                            </td>' +
                '                                        </tr>';
            table_body.append(html);

            setTimeout(function () {
                table_body.find('tr:last-child').find('td:first-child').trigger('click');
            }, 100);
        } else if (checklist.length > 0) {
            var html = '';
            $.each(checklist, function (i, v) {
                html += '                                        <tr data-index="' + i + '" data-key="checklist" style="text-align: left;">' +
                    '                                            <td data-act="atividades-composite" data-chain="changeConfigItemCell|changeAtivChecklistInput" class="editCell" data-type="text" style="padding: 0 10px;">' + v + '</td>' +
                    '                                            <td style="width: 50px; text-align: center;">' +
                    '                                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                    '                                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                    '                                            </td>' +
                    '                                        </tr>';

            });
            table_body.append(html);
        }
        changeAtivChecklistInput(table_body[0]);
    } else {
        _parent.find('#div_ativ_lista_checklist').hide();
        table_body.html('');
        $('#ativ_checklist').val('[]');
        table.data('mode-insert', 'auto');
    }
}
export function changeAtivChecklistInput(this_) {
    var table = $(this_).closest('table');
    setTimeout(function () {
        var arrayChecklist = table.find('tbody .editCell').map(function () { var text = $(this).text().trim(); if (text != '') { return $(this).text().trim() } }).get();
        $('#ativ_checklist').val(JSON.stringify(arrayChecklist));
        table.data('mode-insert', 'manual');
    }, 100);
}
export function changeAtivEtiqueta() {
    $('.atividadeWork .tagsinput').find('.tag').each(function () {
        var name = $(this).text().trim();
        var html = $(getHtmlEtiqueta(name, 'ativ'));
        var icon = html.find('i')[0].outerHTML;
        var style = html.attr('style');
        style = (typeof style !== 'undefined') ? style : '';
        $(this).attr('style', style);
        $(this).find('.tag-text').attr('style', style);
        if ($(this).find('i').length == 0) {
            $(this).prepend(icon);
        }
    });
}
export function getConfigDadosEntidade() {
    var config = getAtividadesContext().store.get().arrayConfigAtividades || {};
    return selectEntityConfig(config, config.perfil && config.perfil.id_entidade);
}
export function getOptionEntidade(option) {
    var config = getAtividadesContext().store.get().arrayConfigAtividades || {};
    return selectEntityOption(config, config.perfil && config.perfil.id_entidade, option);
}
export function checkOptionEntidade(option) {
    var config = getAtividadesContext().store.get().arrayConfigAtividades || {};
    return hasEntityOption(config, config.perfil && config.perfil.id_entidade, option);
}
export function getOptionUnidade(option, option2 = false) {
    return selectUnitConfig(getAtividadesContext().store.get().arrayConfigAtivUnidade, option, option2);
}
export function checkOptionUnidade(option, option2 = false) {
    return !!selectUnitConfig(getAtividadesContext().store.get().arrayConfigAtivUnidade, option, option2);
}
export function getConfigDadosUnidade(sigla_unidade) {
    var state = getAtividadesContext().store.get();
    var config = state.arrayConfigAtividades || {};
    var config_entidade = getConfigDadosEntidade();
    var unidade = (typeof sigla_unidade === 'undefined' || sigla_unidade === null) ? state.arrayConfigAtivUnidade.sigla_unidade : sigla_unidade;
    var _return = jmespath.search(config.unidades || [], "[?sigla_unidade=='" + unidade + "'] | [0].{sigla_unidade: sigla_unidade, nome_unidade: nome_unidade, unidade_instituidora: config.programas.unidade_instituidora, count_dias_uteis: config.distribuicao.count_dias_uteis, count_horas: config.distribuicao.count_horas, h_util_inicio: config.distribuicao.horario_util.inicio, h_util_fim: config.distribuicao.horario_util.fim, feriados: config.feriados, modalidades: config.modalidades}");
    if (_return != null) {
        _return['hora_format'] = (_return.count_horas) ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
        if (typeof config_entidade.feriados !== 'undefined' && config_entidade.feriados.length > 0) {
            var feriados = (_return['feriados'] !== null) ? _return['feriados'] : [];
            $.each(config_entidade.feriados, function (i, v) {
                if (jmespath.search(feriados, "[?feriado_data=='" + v.feriado_data + "']").length == 0) {
                    feriados.push(v);
                }
            });
            _return['feriados'] = feriados;
        }
        return _return;
    } else {
        return false;
    }
}
export function getBoxConfigDadosUnidade(_parent) {
    var unidade = (_parent.find('#ativ_id_atividade').length > 0 && checkValue(_parent.find('#ativ_id_atividade')))
        ? (_parent.find('#ativ_id_atividade').is('select') && typeof _parent.find('#ativ_id_atividade').data('config') !== 'undefined')
            ? _parent.find('#ativ_id_atividade').find('option:selected').data('config').sigla_unidade
            : (typeof _parent.find('#ativ_id_atividade').data('config') !== 'undefined')
                ? _parent.find('#ativ_id_atividade').data('config').sigla_unidade
                : (_parent.find('#ativ_id_user').is('select') && typeof _parent.find('#ativ_id_user').data('config') !== 'undefined')
                    ? _parent.find('#ativ_id_user').find('option:selected').data('config').sigla_unidade
                    : arrayConfigAtivUnidade.sigla_unidade
        : arrayConfigAtivUnidade.sigla_unidade;
    return getConfigDadosUnidade(unidade);
}
export function changeDadosTrabalho(this_, autotime = false) {
    clearTimeout(dly);
    dly = setTimeout(function () {
        changeDadosTrabalho_(this_, autotime, 'despendido');
        if ($('#ativ_tempo_executado').length) changeDadosTrabalho_(this_, autotime, 'executado');
    }, 1000);
}
export function changeDadosTrabalho_(this_, autotime = false, mode = 'despendido') {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var data = _this.data();
    var config_unidade = getBoxConfigDadosUnidade(_parent);
    var dataInicio = (mode == 'despendido') ? _parent.find('input[data-type="inicio"]') : _parent.find('input[data-type="distribuicao"]');
    var dtStart = dataInicio.val();
    var dataFim = _parent.find('input[data-type="fim"]');
    var diasWork = (mode == 'despendido') ? _parent.find('input[data-type="dias"]') : _parent.find('input[data-type="dias_executado"]');
    var config_feriados = (typeof config_unidade.feriados !== 'undefined' && config_unidade.feriados !== null) ? config_unidade.feriados : false;
    var arrayFeriados = (config_unidade.count_dias_uteis && dtStart != '' && checkValue(dataFim))
        ? jmespath.search(getHolidayBetweenDates(moment(dtStart, config_unidade.hora_format).format('Y') + '-01-01', moment(dataFim.val(), config_unidade.hora_format).add(1, 'Y').format('Y') + '-01-01', config_feriados), "[*].d_")
        : [];
    var dtEnd_Contagem = (diasWork.val() == '' || dtStart == '')
        ? ''
        : (config_unidade.count_dias_uteis)
            ? moment(dtStart).isoAddWeekdaysFromSet({
                'workdays': parseInt(diasWork.val()),
                'weekdays': [1, 2, 3, 4, 5],
                'exclusions': arrayFeriados
            }).format(config_unidade.hora_format)
            : moment(dtStart, config_unidade.hora_format).add(parseInt(diasWork.val()), 'days').format(config_unidade.hora_format);
    var dtEnd = (data.type == 'fim') ? dataFim.val()
        : dtEnd_Contagem;
    var nrDias_Contagem = (dtStart == '' || dtEnd == '')
        ? 0
        : (config_unidade.count_dias_uteis)
            ? moment().isoWeekdayCalc({
                rangeStart: dtStart,
                rangeEnd: dtEnd,
                weekdays: [1, 2, 3, 4, 5],
                exclusions: arrayFeriados
            }) - 1
            : moment(dtEnd, config_unidade.hora_format).diff(moment(dtStart, config_unidade.hora_format), 'days');
    var nrDias = (data.type == 'fim') ? nrDias_Contagem
        : diasWork.val();
    nrDias = (nrDias < 0) ? 0 : nrDias;

    if (data.type == 'fim') { diasWork.val(nrDias) }

    var dtEnd_hour = moment((moment(dtEnd, config_unidade.hora_format).format('YYYY-MM-DD') + 'T' + moment(dataFim.val(), config_unidade.hora_format).format('HH:mm')), config_unidade.hora_format).format(config_unidade.hora_format);
    var dtStart_hour = moment((moment(dtStart, config_unidade.hora_format).format('YYYY-MM-DD') + 'T' + moment(dataInicio.val(), config_unidade.hora_format).format('HH:mm')), config_unidade.hora_format).format(config_unidade.hora_format);
    dataFim.val(dtEnd_hour);

    if (typeof dataFim.data('date-min') === 'undefined' || dataFim.data('date-min') != 'fixed') {
        dataFim.attr('min', dtStart_hour);
    }
    if (typeof dataInicio.data('date-max') === 'undefined' || dataInicio.data('date-max') != 'fixed') {
        dataInicio.attr('max', dtEnd_hour);
    }

    updateTempoTrabalhoAtiv(this_, mode);
    checkThisAtivRequiredFields(this_);

    if (data.type == 'dias') { checkDatasTrabalho(dataFim) } else { checkDatasTrabalho(_this) }
    // console.log(data.type, dataFim, _this);

    checkTempoProdutividade(_this);
    if (config_unidade.count_dias_uteis && config_unidade.count_horas && (data.key == 'data_distribuicao' || data.key == 'prazo_entrega')) {
        checkTempoUtilTrabalho(dataFim);
        checkTempoUtilTrabalho(dataInicio);
    }
    if (autotime) {
        diasWork.data('autotime', 'auto')
    } else {
        diasWork.data('autotime', false);
    }
    if ($('.modoDistribuicao_recorrente:visible').length > 0) {
        var updateAtiv = _parent.find('#ativ_id_atividade');
        if (typeof updateAtiv.data('update_recorrencia') === 'undefined' || updateAtiv.data('update_recorrencia') == false) {
            callAtiv('calculoRecorrenciaAtiv',this_);
        }
    }
    callAtiv('prepareFieldsReplace',this_);
    callAtiv('getLabelTempoDespendido',);
    if (data.type == 'inicio') dataFim.trigger('change');

    // console.log({config_unidade: config_unidade, dtEnd_hour: dtEnd_hour, dtEnd: dtEnd, hora_format: config_unidade.hora_format, dataFim: dataFim.val(), mode: mode, autotime: autotime});
    checkTempoPlanoEntrega(this_, 'get');
}
export function checkTempoPlanoEntrega(this_, mode = 'get', data = false) {
    if (mode == 'get') {
        var _this = $(this_);
        var _parent = _this.closest('.atividadeWork');
        var id_demanda = _parent.attr('data-demanda');
        var demanda = jmespath.search(arrayAtividadesPro, "[?id_demanda==`" + id_demanda + "`] | [0]");
        demanda = demanda !== null ? demanda : false;
        var data_fim = _parent.find('#ativ_data_entrega').length ? _parent.find('#ativ_data_entrega').val() : _parent.find('#ativ_prazo_entrega').val();
        data_fim = data_fim == '' ? false : data_fim;
        var id_user = _parent.find('#ativ_id_user').val();
        id_user = typeof id_user !== 'undefined' && id_user !== null ? id_user.trim() : id_user;
        id_user = id_user == '' ? false : id_user;
        id_user = typeof id_user === 'undefined' && demanda ? demanda.id_user : id_user;
        var id_unidade = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + id_user + "`] | [0].id_unidade");
        id_unidade = (id_unidade === null) ? false : id_unidade;
        id_unidade = !id_unidade && demanda ? demanda.id_unidade : id_unidade;
        var action = 'check_entregas_atividades';
        var param = {
            action: action,
            id_unidade: id_unidade,
            data_fim: data_fim,
            id_user: id_user
        }
        // console.log(id_user, id_unidade, data_fim, demanda);
        if (id_user && id_unidade && data_fim) getServerAtividades(param, action);
    } else if (mode == 'set') {

        var select_entrega = $('#ativ_id_entrega');

        if (typeof data.return_row !== 'undefined' && data.return_row.length) {
            /*
            var uniqPlanos = arrayConfigAtividades.planos.concat(data.return_row);
                uniqPlanos = uniqPlanos.filter((value, index, self) => {
                    return self.findIndex(v => v.id_plano === value.id_plano) === index;
                });
                updateSelectEntregas(select_entrega[0], uniqPlanos);
            */
            updateSelectEntregas(select_entrega[0], data.return_row);
            if (typeof data.return_row[0].data_fim_vigencia !== 'undefined') updateDtMaxEntrega(data.return_row[0].data_fim_vigencia);
        }

        if (data.exige_entregas_programa) {
            select_entrega.prop('required', true).addClass('requiredSelect').closest('td').addClass('required');
        } else {
            select_entrega.prop('required', false).removeClass('requiredSelect').closest('td').removeClass('required');
        }
        if (data.id_plano) {
            $('#ativ_id_plano').val(data.id_plano);
        }
    }
}
export function updateDtMaxEntrega(data_fim_vigencia) {
    var prazoDemandasRetroativas = checkOptionEntidade('limitar_demandas_retroativas') && checkOptionEntidade('prazo_demandas_retroativas') ? getOptionEntidade('prazo_demandas_retroativas') : false;
    var _dataFimPlano = prazoDemandasRetroativas ? moment(data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') : false;
    var maxDataConclusao = _dataFimPlano && prazoDemandasRetroativas ? _dataFimPlano.clone().add(prazoDemandasRetroativas, 'days') : false;
    var vigenciaPlano = _dataFimPlano < moment() ? false : true;
    var checkPrazoRetroativo = !vigenciaPlano && moment() > maxDataConclusao ? false : true;
    var _ativ_data_entrega = $('#ativ_data_entrega');
    if (!checkPrazoRetroativo && maxDataConclusao) {
        _ativ_data_entrega.val('');
        loadingButtonConfirm(false);
        alertaBoxPro('Error', 'exclamation-triangle', 'Registro retroativo de conclus\u00E3o da ' + __.demanda + ' fora do prazo m\u00E1ximo permitido: ' + prazoDemandasRetroativas + ' dias (' + maxDataConclusao.format('DD/MM/YYYY') + ') ap\u00F3s a conclus\u00E3o do plano de trabalho (' + _dataFimPlano.format('DD/MM/YYYY') + ').');
    }
}
export function checkTempoProdutividade(_this) {
    if (!checkOptionEntidade('desativa_produtividade_geral')) {
        var _parent = _this.closest('.atividadeWork');
        var value = callAtiv('getAtividadeData',_parent.attr('data-demanda'));
        if (value && value !== null) {
            var html = callAtiv('getInfoAtividadeProdutividade',value, true, 'despendido');
            _parent.find('#ativ_produtividade').html(html);

            var htmlExec = callAtiv('getInfoAtividadeProdutividade',value, true, 'executado');
            _parent.find('#ativ_produtividade_executada').html(htmlExec);
        }
    }
}
export function checkDatasTrabalho(_this) {
    var _parent = _this.closest('.atividadeWork');
    var config_unidade = getBoxConfigDadosUnidade(_parent);
    var dataInicio = _parent.find('input[data-type="inicio"]');
    var labelInicio = dataInicio.data('name');
    var dataFim = _parent.find('input[data-type="fim"]');
    var dataWork = _parent.find('input[data-type="dias"]');
    var labelFim = dataFim.data('name');
    var element = _this[0];

    if (moment(dataFim.val(), config_unidade.hora_format) < moment(dataInicio.val(), config_unidade.hora_format)) {
        element.setCustomValidity('*');
        if (dataWork.length > 0) { dataWork.data('autotime', false); }
    } else {
        element.setCustomValidity('');
    }
    var userValidation = element.checkValidity();

    if (userValidation) {
        _this.removeClass('requiredNull').closest('tr').removeClass('requiredNull');
    } else {
        _this.addClass('requiredNull');
        element.setCustomValidity('A ' + labelFim + ' deve ser maior ou igual que a ' + labelInicio);
        var isValid = element.reportValidity();
    }
}
export function checkTempoUtilTrabalho(_this) {
    var _parent = _this.closest('.atividadeWork');
    var config_unidade = getBoxConfigDadosUnidade(_parent);
    var element = _this[0];
    var _this_moment = moment(_this.val(), config_unidade.hora_format);
    var h_utilInicio = moment(_this_moment.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_inicio, config_unidade.hora_format);
    var h_utilFim = moment(_this_moment.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_fim, config_unidade.hora_format);
    if (typeof element !== 'undefined') {
        if (_this_moment < h_utilInicio || _this_moment > h_utilFim) {
            element.setCustomValidity('*');
        } else {
            element.setCustomValidity('');
        }
        var userValidation = element.checkValidity();

        if (userValidation) {
            _this.removeClass('requiredNull');
        } else {
            _this.addClass('requiredNull');
            element.setCustomValidity('Selecione um hor\u00E1rio dentro do hor\u00E1rio \u00FAtil de trabalho (' + config_unidade.h_util_inicio + ' \u00E0s ' + config_unidade.h_util_fim + ')');
            var isValid = element.reportValidity();
        }
    }
}
export function getTagTempoDecorridoAtiv(value, float_right = true, force_calc = false) {
    var tempoDecorrido = getTempoDecorridoAtiv(value, force_calc);
    var htmlTagTempo = '';
    var textTooltip_pause = (typeof value.pausa_lista !== 'undefined' && value.pausa_lista !== null && value.pausa_lista.length > 0)
        ? $.map(value.pausa_lista, function (v, i) {
            var data_inicio = moment(v.data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
            var data_fim = (v.data_fim == '0000-00-00 00:00:00') ? 'agora' : moment(v.data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
            return '(' + (i + 1) + ') ' + data_inicio + ' \u00E0 ' + data_fim
        }).join('<br>')
        : false;
    textTooltip_pause = (textTooltip_pause) ? '<br> -- Paralisa\u00E7\u00F5es<br>' + textTooltip_pause : '';

    var textTooltip = 'Iniciada em: ' + moment(value.data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm');
    htmlTagTempo = '<span style="' + (float_right ? 'float: right;' : '') + 'margin: 0;" class="dateboxDisplay ' + (value.tempo_pactuado != 0 && tempoDecorrido > value.tempo_pactuado ? 'urgenteBoxDisplay' : '') + '">' +
        '   <span class="dateBoxIcon" data-tip="' + textTooltip + textTooltip_pause + '">' +
        '       <i class="fas fa-stopwatch ' + (value.tempo_pactuado != 0 && tempoDecorrido > value.tempo_pactuado ? 'vermelhoColor' : 'azulColor') + '" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
        '   </span>' +
        '   ' + decimalHourToMinute(tempoDecorrido) + ' ' + (tempoDecorrido > 1 ? 'horas decorridas' : 'hora decorrida') +
        '</span>';
    var checkConfigAtiv = jmespath.search(arrayConfigAtividades.atividades, "[?id_atividade==`" + value.id_atividade + "`] | [0].config.desativa_produtividade");
    return (checkConfigAtiv) ? '' : htmlTagTempo;
}
export function getTagTempoPactuadoAtiv(value) {
    var tagText = normalizeNameTag(value.apelido);
    var tempoPactuado = (value.tempo_pactuado == 0) ? 'N\u00E3o pactuado' : decimalHourToMinute(value.tempo_pactuado) + ' ' + (value.tempo_pactuado > 1 ? 'horas' : 'hora');
    var htmlTagTempo = '<span class="info_tags_follow info_tags_pacto">' +
        '   <span data-colortag="#bfd5e8" style="background-color: #eef4f9;font-size: 10pt;color: #666;" class="tag_text tagTableText_' + tagText + '" title="' + value.tempo_pactuado + ' ' + (value.tempo_pactuado > 1 ? 'horas' : 'hora') + '">' +
        '       <i data-colortag="#7d99af" class="fas fa-handshake" style="font-size: 90%; margin: 0px 2px; color: #7d99af;"></i>' +
        '       ' + tempoPactuado +
        '   </span>' +
        '</span>';
    return htmlTagTempo;
}
export function getTagTempoDespendidoAtiv(value, float_right = true) {

    var textTooltip_pause = (typeof value.pausa_lista !== 'undefined' && value.pausa_lista !== null && value.pausa_lista.length > 0)
        ? $.map(value.pausa_lista, function (v, i) { return '(' + (i + 1) + ') ' + moment(v.data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') + ' \u00E0 ' + moment(v.data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') }).join('<br>')
        : false;
    textTooltip_pause = (textTooltip_pause) ? '<br> -- Paralisa\u00E7\u00F5es<br>' + textTooltip_pause : '';

    var textTooltip = 'Iniciada em: ' + moment(value.data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm') + '<br>' +
        'Conclu\u00EDda em: ' + moment(value.data_entrega, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm');
    htmlTagTempo = '<span style="' + (float_right ? 'float: right;' : '') + 'margin: 0;" class="dateboxDisplay">' +
        '   <span class="dateBoxIcon" data-tip="' + textTooltip + textTooltip_pause + '">' +
        '       <i class="fas fa-stopwatch verdeColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
        '   </span>' +
        '   ' + decimalHourToMinute(value.tempo_despendido) + ' ' + (value.tempo_despendido > 1 ? 'horas despendidas' : 'hora despendida') +
        '</span>';
    var checkConfigAtiv = jmespath.search(arrayConfigAtividades.atividades, "[?id_atividade==`" + value.id_atividade + "`] | [0].config.desativa_produtividade");
    return (checkConfigAtiv) ? '' : htmlTagTempo;
}
export function getTempoDecorridoAtiv(value, force_calc = false) {
    // var arrayConfigAtividades = (typeof arrayConfigAtividades !== 'undefined') ? arrayConfigAtividades : parent.arrayConfigAtividades;
    var data_inicio = (force_calc) ? value.data_distribuicao : value.data_inicio;
    var config_unidade = getConfigDadosUnidade(value.sigla_unidade);

    var h_util_inicio = (config_user && config_user.hasOwnProperty('distribuicao') && config_user.distribuicao.hasOwnProperty('horario_util')) ? config_user.distribuicao.horario_util.inicio : config_unidade.h_util_inicio;
    var h_util_fim = (config_user && config_user.hasOwnProperty('distribuicao') && config_user.distribuicao.hasOwnProperty('horario_util')) ? config_user.distribuicao.horario_util.fim : config_unidade.h_util_fim;
    var carga_horaria = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + value.id_user + "`] | [0].carga_horaria");
    carga_horaria = (carga_horaria == null) ? 8 : carga_horaria;

    var config_entidade = typeof arrayConfigAtividades.perfil.id_entidade !== 'undefined' ? jmespath.search(arrayConfigAtividades.entidades, "[?id_entidade==`" + arrayConfigAtividades.perfil.id_entidade + "`] |[0].config") : null;
    config_entidade = (config_entidade !== null) ? config_entidade : false;
    var carga_horaria_padrao = (config_entidade && typeof config_entidade.carga_horaria_padrao !== 'undefined' && config_entidade.carga_horaria_padrao !== null) ? config_entidade.carga_horaria_padrao : 8;

    var config_user = (typeof arrayConfigAtividades !== 'undefined' && arrayConfigAtividades !== null && typeof arrayConfigAtividades.perfil !== 'undefined' && arrayConfigAtividades.perfil.hasOwnProperty('config') && arrayConfigAtividades.perfil.config !== null) ? arrayConfigAtividades.perfil.config : false;
    config_user = (typeof config_user !== 'undefined') ? config_user : { carga_horaria: carga_horaria_padrao };

    var config_feriados = (typeof config_unidade.feriados !== 'undefined' && config_unidade.feriados !== null) ? config_unidade.feriados : false;
    var arrayFeriados = (config_unidade.count_dias_uteis && data_inicio != '' && value.data_fim != '')
        ? jmespath.search(getHolidayBetweenDates(moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('Y') + '-01-01', moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss').add(1, 'Y').format('Y') + '-01-01', config_feriados), "[*].d_")
        : [];
    var currentDate = (typeof value.data_pausa !== null && value.data_pausa != '0000-00-00 00:00:00' && (typeof value.data_retomada === null || value.data_retomada == '0000-00-00 00:00:00')) ? moment(value.data_pausa, 'YYYY-MM-DD HH:mm:ss') : moment();
    var valueDias = (config_unidade.count_dias_uteis)
        ? currentDate.isoWeekdayCalc({
            rangeStart: data_inicio,
            rangeEnd: currentDate.format('YYYY-MM-DD'),
            weekdays: [1, 2, 3, 4, 5],
            exclusions: arrayFeriados
        }) - 1
        : moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss').diff(moment(data_inicio, 'YYYY-MM-DD HH:mm:ss'), 'days');
    valueDias = (valueDias < 0) ? 0 : valueDias;
    var h_dataInicio = moment(data_inicio, 'YYYY-MM-DD HH:mm:ss');
    var h_dataFim = currentDate;
    var h_utilInicio = moment(h_dataFim.format('YYYY-MM-DD') + 'T' + h_util_inicio, 'YYYY-MM-DDTHH:mm');
    var h_utilFim = moment(h_dataInicio.format('YYYY-MM-DD') + 'T' + h_util_fim, 'YYYY-MM-DDTHH:mm');
    var currentDt = currentDate.format('YYYY-MM-DD HH:mm:ss');
    var totalDespendido = 0;

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
            carga_horaria: carga_horaria,
            valueDias: valueDias
        };
        var tempoTrabalho = getTempoTrabalhoAtiv(param);
        return tempoTrabalho;
    }

    if (typeof value.pausa_lista !== 'undefined' && value.pausa_lista !== null && value.pausa_lista.length > 0) {
        var initData = data_inicio;
        var endData = value.pausa_lista[0].data_inicio;
        var initTempoTrabalho = getCalcPausasDt(initData, endData, value);
        totalDespendido = totalDespendido + initTempoTrabalho;

        $.each(value.pausa_lista, function (i, v) {
            if (typeof value.pausa_lista[i + 1] !== 'undefined') {
                var pausaDataFim = (v.data_fim == '0000-00-00 00:00:00') ? currentDt : v.data_fim;
                var pausaTempoTrabalho = getCalcPausasDt(v.data_fim, value.pausa_lista[i + 1].data_inicio, value);
                totalDespendido = totalDespendido + pausaTempoTrabalho;
            }
        });

        var endTempoTrabalhoInicio = value.pausa_lista[value.pausa_lista.length - 1].data_fim;
        if (endTempoTrabalhoInicio != '0000-00-00 00:00:00') {
            var endTempoTrabalhoFim = currentDt;
            var endTempoTrabalho = getCalcPausasDt(endTempoTrabalhoInicio, endTempoTrabalhoFim, value);
            totalDespendido = totalDespendido + endTempoTrabalho;
        }
    } else {
        totalDespendido = getCalcPausasDt(data_inicio, currentDt, value);
    }
    return totalDespendido;
}
export function updateTempoTrabalhoAtiv(this_, mode = 'despendido') {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var user = _parent.find('#ativ_id_user');
    var dias = (mode == 'despendido') ? _parent.find('input[data-type="dias"]') : _parent.find('input[data-type="dias_executado"]');
    var tempo = (mode == 'despendido') ? _parent.find('input[data-type="tempo"]') : _parent.find('input[data-type="tempo_executado"]');
    var inicio = (mode == 'despendido') ? _parent.find('input[data-type="inicio"]') : _parent.find('input[data-type="distribuicao"]');
    var fim = _parent.find('input[data-type="fim"]');
    var atividade = _parent.find('#ativ_id_atividade');
    var config_atividade = (typeof atividade.data('config') !== 'undefined') ? atividade.data('config') : false;
    var carga_horaria_padrao = jmespath.search(arrayConfigAtividades.entidades, "[?id_entidade==`" + arrayConfigAtividades.perfil.id_entidade + "`] |[0].config.carga_horaria_padrao");
    carga_horaria_padrao = (carga_horaria_padrao == null) ? 8 : carga_horaria_padrao;

    if (config_atividade && typeof config_atividade.desativa_produtividade !== 'undefined' && config_atividade.hasOwnProperty('desativa_produtividade') && config_atividade.desativa_produtividade) {
        var ativ_tempo_pactuado = config_atividade.tempo_pactuado;
        tempo.val(ativ_tempo_pactuado).data('tempo-decimal', ativ_tempo_pactuado).data('tempo-geral', ativ_tempo_pactuado);
    } else {
        var config_user = (user.is('select')) ? user.find('option:selected').data('config') : user.data('config');
        config_user = (typeof config_user !== 'undefined') ? config_user : { carga_horaria: carga_horaria_padrao };
        var config_unidade = getBoxConfigDadosUnidade(_parent);

        var config_user_perfil = (arrayConfigAtividades.perfil.hasOwnProperty('config') && arrayConfigAtividades.perfil.config !== null) ? arrayConfigAtividades.perfil.config : false;
        var h_util_inicio = (config_user_perfil && config_user_perfil.hasOwnProperty('distribuicao') && config_user_perfil.distribuicao.hasOwnProperty('horario_util')) ? config_user_perfil.distribuicao.horario_util.inicio : config_unidade.h_util_inicio;
        var h_util_fim = (config_user_perfil && config_user_perfil.hasOwnProperty('distribuicao') && config_user_perfil.distribuicao.hasOwnProperty('horario_util')) ? config_user_perfil.distribuicao.horario_util.fim : config_unidade.h_util_fim;


        var tempo_total_pausas = callAtiv('getPausasAtividadeCalc',false, mode);
        // var tempo_pausado = _parent.find('#ativ_tempo_pausado');
        // tempo_pausado = (tempo_pausado.is(':visible') && tempo_pausado.val() > 0) ? tempo_pausado.val() : 0;
        var valueDias = dias.val();
        var h_dataInicio = moment(inicio.val(), config_unidade.hora_format);
        var h_dataFim = moment(fim.val(), config_unidade.hora_format);
        var h_utilInicio = moment(h_dataFim.format('YYYY-MM-DD') + 'T' + h_util_inicio, config_unidade.hora_format);
        var h_utilFim = moment(h_dataInicio.format('YYYY-MM-DD') + 'T' + h_util_fim, config_unidade.hora_format);
        if (checkValue(dias) && checkValue(inicio) && checkValue(fim)) {
            var param = {
                count_dias_uteis: config_unidade.count_dias_uteis,
                count_horas: config_unidade.count_horas,
                h_dataInicio: h_dataInicio,
                h_dataFim: h_dataFim,
                h_utilInicio: h_utilInicio,
                h_utilFim: h_utilFim,
                carga_horaria: config_user.carga_horaria,
                valueDias: valueDias
            };
            var tempo_geral = getTempoTrabalhoAtiv(param);
            var tempo_total = tempo_total_pausas ? tempo_total_pausas : tempo_geral;
            // var tempo_total = (tempo_geral-tempo_pausado);
            tempo.data('tempo-decimal', tempo_total);
            tempo_total = (tempo_total < 1) ? tempo_total.toFixed(3) : tempo_total.toFixed(1);
            tempo.val(parseFloat(tempo_total));
            if (typeof tempo.data('tempo-geral') === 'undefined') { tempo.data('tempo-geral', tempo_geral) }
            callAtiv('checkDatesAfast',fim.get(0), false);
            // console.log('getTempoTrabalhoAtiv***', param, tempo_geral, mode);
        } else {
            tempo.val(0.01).data('tempo-decimal', '0').data('tempo-geral', '0');
            // console.log('NULL getTempoTrabalhoAtiv***', config_atividade, checkValue(user), checkValue(dias), checkValue(inicio), checkValue(fim));
        }
    }
    if (_parent.find('#dividir_tempo_despendido').is(':checked') && _parent.find('#complete_others').is(':checked')) {
        var total_vinculadas = _parent.find('#lista_complete_others').val();
        total_vinculadas = typeof total_vinculadas !== 'undefined' && total_vinculadas !== null && total_vinculadas != '' && isJson(total_vinculadas) ? JSON.parse(total_vinculadas).length + 1 : 0;
        var tempo_despendido = _parent.find('input[data-type="tempo"]').val();
        var despendido_parcial = (tempo_despendido / total_vinculadas).toFixed(2);
        tempo.val(despendido_parcial).data('tempo-decimal', despendido_parcial);
        callAtiv('getLabelTempoDespendido',);
    }
}
export function checkTemposDemanda(value, mode = 'tempo_planejado', return_tempo = true) {
    var carga_horaria_padrao = jmespath.search(arrayConfigAtividades.entidades, "[?id_entidade==`" + arrayConfigAtividades.perfil.id_entidade + "`] |[0].config.carga_horaria_padrao");
    carga_horaria_padrao = (carga_horaria_padrao == null) ? 8 : carga_horaria_padrao;
    var desativa_produtividade = jmespath.search(arrayConfigAtividades.atividades, "[?id_atividade==`" + value.id_atividade + "`] | [0].config.desativa_produtividade");

    var carga_horario_user = jmespath.search(arrayConfigAtividades.planos, "[?id_plano==`" + value.id_plano + "`] | [0].carga_horaria");
    carga_horario_user = carga_horario_user !== null ? carga_horario_user : carga_horaria_padrao;

    var config_unidade = getConfigDadosUnidade(value.sigla_unidade);

    var valueInit = value.data_distribuicao;
    var currentDate = moment(valueInit, 'YYYY-MM-DD HH:mm:ss');
    var valueEnd = (mode == 'tempo_planejado') ? value.prazo_entrega : value.data_entrega;

    var config_user_perfil = (arrayConfigAtividades.perfil.hasOwnProperty('config') && arrayConfigAtividades.perfil.config !== null) ? arrayConfigAtividades.perfil.config : false;
    var h_util_inicio = (config_user_perfil && config_user_perfil.hasOwnProperty('distribuicao') && config_user_perfil.distribuicao.hasOwnProperty('horario_util')) ? config_user_perfil.distribuicao.horario_util.inicio : config_unidade.h_util_inicio;
    var h_util_fim = (config_user_perfil && config_user_perfil.hasOwnProperty('distribuicao') && config_user_perfil.distribuicao.hasOwnProperty('horario_util')) ? config_user_perfil.distribuicao.horario_util.fim : config_unidade.h_util_fim;

    var h_dataInicio = moment(valueInit, config_unidade.hora_format);
    var h_dataFim = moment(valueEnd, config_unidade.hora_format);
    var h_utilInicio = moment(h_dataFim.format('YYYY-MM-DD') + 'T' + h_util_inicio, config_unidade.hora_format);
    var h_utilFim = moment(h_dataInicio.format('YYYY-MM-DD') + 'T' + h_util_fim, config_unidade.hora_format);

    var config_feriados = (typeof config_unidade.feriados !== 'undefined' && config_unidade.feriados !== null) ? config_unidade.feriados : false;
    var arrayFeriados = (config_unidade.count_dias_uteis && valueInit != '' && valueEnd != '')
        ? jmespath.search(getHolidayBetweenDates(moment(valueInit, 'YYYY-MM-DD HH:mm:ss').format('Y') + '-01-01', moment(valueEnd, 'YYYY-MM-DD HH:mm:ss').add(1, 'Y').format('Y') + '-01-01', config_feriados), "[*].d_")
        : [];

    var valueDias = (mode == 'tempo_planejado')
        ? value.dias_planejado
        : (config_unidade.count_dias_uteis)
            ? currentDate.isoWeekdayCalc({
                rangeStart: valueInit,
                rangeEnd: valueEnd,
                weekdays: [1, 2, 3, 4, 5],
                exclusions: arrayFeriados
            }) - 1
            : moment(valueEnd, 'YYYY-MM-DD HH:mm:ss').diff(moment(valueInit, 'YYYY-MM-DD HH:mm:ss'), 'days');

    var param = {
        count_dias_uteis: config_unidade.count_dias_uteis,
        count_horas: config_unidade.count_horas,
        h_dataInicio: h_dataInicio,
        h_dataFim: h_dataFim,
        h_utilInicio: h_utilInicio,
        h_utilFim: h_utilFim,
        carga_horaria: carga_horario_user,
        valueDias: valueDias
    };
    var tempo_geral = getTempoTrabalhoAtiv(param);
    // console.log(mode, tempo_geral, param);

    return return_tempo ? tempo_geral : valueDias;
}
export function updateServerTemposDemanda(type = 'set', mode = 'tempo_planejado', value = false, ativData = false, param = false) {
    if (type == 'reset') {
        var objIndexAtiv = (typeof arrayAtividadesPro === 'undefined' || arrayAtividadesPro == 0 || arrayAtividadesPro.length == 0) ? -1 : arrayAtividadesPro.findIndex((obj => obj.id_demanda == param.id_demanda));
        if (objIndexAtiv !== -1) {
            arrayAtividadesPro[objIndexAtiv][mode] = param.tempo;
        }
        if ($('#ativ_tempo_planejado_complete').length > 0 && type == 'tempo_planejado') {
            $('#ativ_tempo_planejado_complete').val(param.tempo);
            $('#ativ_data_entrega').trigger('change');
        } else if ($('#ratingAtividade[data-tempo-decorrido="0"]').length > 0) {
            callAtiv('rateAtividade',param.id_demanda);
        }
    } else {
        var tempo_geral = checkTemposDemanda(value, mode);
        tempo_geral = parseFloat(tempo_geral.toFixed(1));
        var tempo_init = (mode == 'tempo_planejado') ? value.tempo_planejado : value.tempo_executado;
        tempo_init = (typeof tempo_init !== 'undefined' && tempo_init !== null && tempo_init != 0) ? parseFloat(tempo_init.toFixed(1)) : 0;
        if (typeof tempo_init !== 'undefined' && tempo_init !== null && tempo_geral != tempo_init &&
            (
                mode == 'tempo_planejado' ||
                (mode == 'tempo_executado' && value.data_entrega != '0000-00-00 00:00:00')
            )
        ) {
            $('.update_tempos_demanda').addClass('fa-spin');
            var action = 'edit_tempos';
            var param = {
                action: action,
                id_demanda: value.id_demanda,
                mode: mode,
                tempo: tempo_geral
            };
            getServerAtividades(param, action);
            setTimeout(function () {
                loadingButtonConfirm(false);
            }, 1000);
        } else {
            $('.update_tempos_demanda').addClass('fa-spin');
            checkTempoProdutividade($('.update_tempos_demanda'));
            setTimeout(() => {
                $('.update_tempos_demanda').removeClass('fa-spin');
            }, 2000);
        }
    }
}
export function getTempoTrabalhoAtiv(param) {
    var tempo = '';
    if (param.count_dias_uteis && param.count_horas) {
        var h_planejada = moment.duration(param.h_dataFim.diff(param.h_dataInicio)).asHours();
        var countHoraInicio = (moment.duration(param.h_utilFim.diff(param.h_dataInicio)).asHours());
        countHoraInicio = (countHoraInicio < 0) ? 0 : countHoraInicio;
        countHoraInicio = (countHoraInicio > param.carga_horaria) ? param.carga_horaria : countHoraInicio;
        var countHoraFim = (moment.duration(param.h_dataFim.diff(param.h_utilInicio)).asHours());
        countHoraFim = (countHoraFim < 0) ? 0 : countHoraFim;
        countHoraFim = (countHoraFim > param.carga_horaria) ? param.carga_horaria : countHoraFim;
        var tempo_total = (countHoraInicio + countHoraFim);
        tempo_total = (param.valueDias > 0) ? tempo_total + (param.carga_horaria * (param.valueDias - 1)) : tempo_total;
        tempo_total = (param.valueDias == 0)
            ? (countHoraInicio > param.carga_horaria && h_planejada > param.carga_horaria)
                ? param.carga_horaria
                : (h_planejada < countHoraInicio) ? h_planejada : countHoraInicio
            : tempo_total;
        tempo_total = (tempo_total < 0) ? 0 : tempo_total;
        // tempo_total = (tempo_total < 1) ? tempo_total.toFixed(3) : tempo_total.toFixed(1);
        /*
        tempo_total = (tempo_total !== null) 
                    ? (tempo_total < 1) ? tempo_total.toFixed(3) : tempo_total.toFixed(1)
                    : tempo_total;
        */
        tempo = (parseFloat(tempo_total));
        // console.log(tempo_total, tempo_total.toFixed(1), parseFloat(tempo_total.toFixed(1)));
        // console.log({param: param, h_planejada: h_planejada, tempo: tempo, tempo_total: tempo_total, countHoraInicio: countHoraInicio, countHoraFim: countHoraFim});

    } else if (!param.count_dias_uteis && param.count_horas) {
        var tempo_total = (moment.duration(param.h_dataFim.diff(param.h_dataInicio)).asHours());
        tempo_total = (tempo_total < 0) ? 0 : tempo_total;
        // tempo_total = (tempo_total < 1) ? tempo_total.toFixed(3) : tempo_total.toFixed(1);
        tempo = parseFloat(tempo_total);
        //  console.log(tempo_total, tempo_total.toFixed(1), parseFloat(tempo_total.toFixed(1)));
    } else {
        tempo = (param.carga_horaria * param.valueDias);
    }
    return tempo;
}
export function getOptionSelectPerfil(arraySelectPerfil, selected = false, sigla_display = true) {
    var htmlOption = '';
    function getSubordinacao(arrayU, loop = 8, selected = false, tab = true) {
        var mapU = false;
        if (typeof arrayU !== 'undefined' && arrayU !== null && arrayU.length > 0) {
            mapU = $.map(arrayU, function (v) {
                var repeat = 8 - loop;
                var subordinacao = false;

                var arraySubordinacao = jmespath.search(arraySelectPerfil, "[?dependencia==`" + v.id_unidade + "`].{id_unidade: id_unidade, nome_unidade: nome_unidade, sigla_unidade: sigla_unidade, dependencia: dependencia}");
                arraySubordinacao = (arraySubordinacao !== null) ? arraySubordinacao : false;
                // var symbolTab = ' \uFEFF \uFEFF \uFEFF \uFEFF ';
                var symbolTab = ' \uFEFF ';
                symbolTab = symbolTab.repeat(repeat);
                var tabSub = (v.dependencia != 0) ? symbolTab + '\u21AA ' : '';
                var target = (sigla_display) ? v.sigla_unidade.trim() : v.id_unidade.toString();
                var selected_ = (selected && selected == target) ? 'selected' : '';

                if (loop > 0 && arraySubordinacao) {
                    if (arraySubordinacao.length > 0) htmlOption += symbolTab + '<optgroup label="' + v.nome_unidade + ' (' + v.sigla_unidade + ')">';

                    htmlOption += (sigla_display)
                        ? "<option data-id_unidade='" + v.id_unidade + "' data-label='" + v.sigla_unidade + "' title='" + v.sigla_unidade + " - " + v.nome_unidade + "' value='" + v.sigla_unidade + "' " + selected_ + ">" + (tab ? symbolTab : '') + tabSub + v.sigla_unidade + " - " + v.nome_unidade + "</option>"
                        : "<option data-id_unidade='" + v.id_unidade + "' data-label='" + v.sigla_unidade + "' value='" + v.id_unidade + "' " + selected_ + ">" + (tab ? symbolTab : '') + tabSub + v.sigla_unidade + " - " + v.nome_unidade + "</option>";

                    subordinacao = getSubordinacao(arraySubordinacao, loop - 1, selected);

                    if (arraySubordinacao.length > 0) htmlOption += symbolTab + '</optgroup>--' + v.nome_unidade + ' ' + v.sigla_unidade;

                } else {
                    htmlOption += (sigla_display)
                        ? "<option data-id_unidade='" + v.id_unidade + "' data-label='" + v.sigla_unidade + "' title='" + v.sigla_unidade + " - " + v.nome_unidade + "' value='" + v.sigla_unidade + "' " + selected_ + ">" + (tab ? symbolTab : '') + tabSub + v.sigla_unidade + " - " + v.nome_unidade + "</option>"
                        : "<option data-id_unidade='" + v.id_unidade + "' data-label='" + v.sigla_unidade + "' value='" + v.id_unidade + "' " + selected_ + ">" + (tab ? symbolTab : '') + tabSub + v.sigla_unidade + " - " + v.nome_unidade + "</option>";
                }
                return { id: v.id_unidade, nome_unidade: v.nome_unidade, sigla_unidade: v.sigla_unidade, subordinacao: subordinacao };
            });
        }
        return mapU;
    }
    var unidades_super = jmespath.search(arraySelectPerfil, "[?dependencia==`0`]");
    if (unidades_super !== null && unidades_super.length > 0) {
        getSubordinacao(unidades_super, 8, selected);
    } else {
        getSubordinacao(arraySelectPerfil, 8, selected);
    }
    return htmlOption;
}
/* function getOptionSelectPerfil2(arraySelectPerfil, selected = false, sigla_display = true) {
    var unidades_super = jmespath.search(arraySelectPerfil,"[?dependencia==`0`]");
    var optionSelectPerfil = '';
    var arrayListEntidades = [];
    if (unidades_super !== null && unidades_super.length > 1) {
        $.each(unidades_super, function(index, v){
            var arrayPerfil = jmespath.search(arraySelectPerfil, "[?dependencia==`"+v.id_unidade+"`]");
                arrayPerfil.unshift(v);
                
            if ($.inArray(v.id_entidade, arrayListEntidades) == -1 ) {
                arrayListEntidades.push(v.id_entidade);
                optionSelectPerfil +=   '<option label="'+v.nome_entidade+' ('+v.sigla_entidade+')" disabled="true"></option>';
            }
            optionSelectPerfil +=   '<optgroup label="'+v.nome_unidade+' ('+v.sigla_unidade+')">'+
                                    '   '+getOptionsSelectPerfilGroup(arraySelectPerfil, arrayPerfil, selected, sigla_display)+
                                    '</optgroup>';
        });
    } else {
        optionSelectPerfil += getOptionsSelectPerfilGroup(arraySelectPerfil, arraySelectPerfil, selected, sigla_display);
    }       
    
    var excludedDependencia = $.map(arraySelectPerfil, function(v){
            var listSelectPerfil = $('<select>'+optionSelectPerfil+'</select>').find('option').map(function(){ return $(this).val() }).get();
            var target = (sigla_display) ? v.sigla_unidade.trim() : v.id_unidade.toString();
            if (listSelectPerfil.length > 0 && $.inArray(target, listSelectPerfil) == -1 ) {
                var selected_ = (selected && selected == target ) ? 'selected' : '';
                return (sigla_display) 
                        ? "<option data-label='"+v.sigla_unidade+"' title='"+v.sigla_unidade+" - "+v.nome_unidade+"' value='"+v.sigla_unidade+"' "+selected_+">"+v.sigla_unidade+"</option>"
                        : "<option data-label='"+v.sigla_unidade+"' value='"+v.id_unidade+"' "+selected_+">"+v.sigla_unidade+" - "+v.nome_unidade+"</option>";
            }
        });
        optionSelectPerfil += (excludedDependencia != '') ? excludedDependencia : '';
        
    return optionSelectPerfil;
} */
export function getOptionsSelectPerfilGroup(arraySelectPerfil, arrayPerfil, selected = false, sigla_display = true, tab = false, loopOut = 1) {
    if (loopOut > 5) { return false; }
    var optionSelectPerfil = (typeof arrayPerfil !== 'undefined' && arrayPerfil !== null && arrayPerfil.length > 0) ? $.map(arrayPerfil, function (v, k) {
        var target = (sigla_display)
            ? v.sigla_unidade.trim()
            : (parseInt(selected) > 0) ? v.id_unidade : v.sigla_unidade + ' - ' + v.nome_unidade;
        var selected_ = (selected && selected == target) ? 'selected' : '';
        var arrayPerfilSub = jmespath.search(arraySelectPerfil, "[?dependencia==`" + v.id_unidade + "`]");
        var symbolTab = ' \uFEFF \uFEFF \uFEFF \uFEFF ';
        symbolTab = symbolTab.repeat(loopOut);
        var tabSub = (v.dependencia != 0) ? '\u21AA ' : '';
        var _result = (sigla_display)
            ? "<option data-id_unidade='" + v.id_unidade + "' data-label='" + v.sigla_unidade + "' title='" + v.sigla_unidade + " - " + v.nome_unidade + "' value='" + v.sigla_unidade + "' " + selected_ + ">" + (tab ? symbolTab : '') + tabSub + v.sigla_unidade + " - " + v.nome_unidade + "</option>"
            : "<option data-id_unidade='" + v.id_unidade + "' data-label='" + v.sigla_unidade + "' value='" + v.id_unidade + "' " + selected_ + ">" + (tab ? symbolTab : '') + tabSub + v.sigla_unidade + " - " + v.nome_unidade + "</option>";
        if (arrayPerfilSub !== null && arrayPerfilSub.length > 0 && v.dependencia != 0) {
            _result += getOptionsSelectPerfilGroup(arraySelectPerfil, arrayPerfilSub, selected, sigla_display, true, loopOut + 1);
        }
        return _result;
    }).join('') : '';
    return optionSelectPerfil;
}
export function getOptionSelectDependencia(arraySelectDependencia, disableable = true, parent_id = false, selected = false, keys = { id: 'id_cadeia_valor', name: 'nome_processo' }) {
    // console.log(arraySelectDependencia, disableable, parent_id, selected, keys);
    var processo_super = jmespath.search(arraySelectDependencia, "[?dependencia==`0`]");
    var optionSelectDependencia = '';
    if (processo_super.length > 1) {
        $.each(processo_super, function (index, v) {
            var id = v[keys.id];
            var name = v[keys.name];
            var arrayPerfil = jmespath.search(arraySelectDependencia, "[?dependencia==`" + id + "`]");
            arrayPerfil.unshift(v);

            optionSelectDependencia += '<optgroup label="' + name + '">' +
                '   ' + getOptionsSelectDependenciaGroup(arraySelectDependencia, disableable, parent_id, keys, arrayPerfil, selected) +
                '</optgroup>';
        });
    } else {
        optionSelectDependencia += getOptionsSelectDependenciaGroup(arraySelectDependencia, disableable, parent_id, keys, arraySelectDependencia, selected);
    }
    return optionSelectDependencia;
}
export function getOptionsSelectDependenciaGroup(arraySelectDependencia, disableable, parent_id, keys, arrayPerfil, selected = false, tab = false, loopOut = 1) {
    if (loopOut > 5) { return false; }
    var optionSelectDependencia = (arrayPerfil.length > 0) ? $.map(arrayPerfil, function (v, k) {
        var id = v[keys.id];
        var name = v[keys.name];
        var target = (parseInt(selected) > 0) ? id : name;
        var selected_ = (selected && selected == target) ? 'selected' : '';
        var arrayDependenciaSub = jmespath.search(arraySelectDependencia, "[?dependencia==`" + id + "`]");
        var symbolTab = ' \uFEFF \uFEFF \uFEFF \uFEFF ';
        symbolTab = symbolTab.repeat(loopOut);
        var tabSub = (v.dependencia != 0) ? '\u21AA ' : '';
        var disabled_ = id == parent_id || (disableable && typeof v.selecionavel !== 'undefined' && v.selecionavel == 0) ? 'disabled' : '';
        var _result = "<option data-" + id + "='" + id + "' data-label='" + name + "' value='" + id + "' " + selected_ + " " + disabled_ + ">" + (tab ? symbolTab : '') + tabSub + name + "</option>";
        if (arrayDependenciaSub !== null && arrayDependenciaSub.length > 0 && v.dependencia != 0) {
            _result += getOptionsSelectDependenciaGroup(arraySelectDependencia, disableable, parent_id, keys, arrayDependenciaSub, selected, true, loopOut + 1);
        }
        return _result;
    }).join('') : '';
    return optionSelectDependencia;
}
export function getOptionsSelectAtivGroup(arrayAtiv, value, tab = false) {
    var html = '';
    if (arrayAtiv && arrayAtiv != 0 && arrayAtiv.length > 0) {
        var uniqList = uniqPro(jmespath.search(arrayAtiv, "[*].macroatividade"));
        $.each(uniqList, function (i, v) {
            var ativList = jmespath.search(arrayAtiv, "sort_by([?macroatividade=='" + v + "'],&nome_atividade)");
            html += '<option disabled>' + (tab ? '\u2500 ' : '') + (v == '' || v === null ? 'Macroatividade indefinida' : v) + '</option>' +
                '   ' + getOptionsSelectAtiv(ativList, value, tab);
        });
    }
    return html;
}
export function getOptionsSelectAtiv(arrayAtiv, value, tab) {
    var dadosIfrArvore = getIfrArvoreDadosProcesso();
    var tipo_processo = (dadosIfrArvore) ? dadosIfrArvore.tipo : false;
    var optionSelectAtividades = (arrayAtiv.length > 0)
        ? $.map(arrayAtiv, function (v, k) {
            //console.log('desativa_produtividade', typeof v.config.desativa_produtividade, v.config.desativa_produtividade);
            var complexidade = (v.config != null && typeof v.config !== 'undefined' && v.config.hasOwnProperty('complexidade')) ? v.config.complexidade : [];
            var recalcula_prazo = (v.config != null && typeof v.config !== 'undefined' && v.config.hasOwnProperty('recalcula_prazo') && v.config.recalcula_prazo) ? true : false;
            var desativa_produtividade = (v.config != null && typeof v.config !== 'undefined' && v.config.hasOwnProperty('desativa_produtividade') && v.config.desativa_produtividade) ? true : false;
            var modalidades_atividade = (v.config != null && typeof v.config !== 'undefined' && v.config.hasOwnProperty('ganho_unidade') && v.config.hasOwnProperty('modalidades') && v.config.ganho_unidade === false && v.config.modalidades.length > 0) ? v.config.modalidades : false;
            var tempo_pactuado_display = (complexidade.length > 0) ? jmespath.search(complexidade, "[?default==`true`].fator | [0]") : null;
            tempo_pactuado_display = (tempo_pactuado_display !== null) ? tempo_pactuado_display * v.tempo_pactuado : v.tempo_pactuado;
            var tempo_pactuado_display_ = parseFloat(tempo_pactuado_display.toFixed(2));
            var selected = (value && v.id_atividade == value.id_atividade) ? 'selected' : '';
            var config = {
                sigla_unidade: v.sigla_unidade,
                id_unidade: v.id_unidade,
                dias_planejado: v.dias_planejado,
                tempo_pactuado: v.tempo_pactuado,
                complexidade: complexidade,
                recalcula_prazo: recalcula_prazo,
                desativa_produtividade: desativa_produtividade,
                modalidades_atividade: modalidades_atividade,
                homologado: v.homologado,
                etiqueta: (v.config != null && typeof v.config.etiquetas !== 'undefined' ? $.map(v.config.etiquetas, function (v) { return v[0] }) : []),
                checklist: (v.config != null && typeof v.config.checklist !== 'undefined' ? $.map(v.config.checklist, function (v) { return v[0] }) : []),
                tipo_processo: (v.config != null && typeof v.config.tipo_processo !== 'undefined' ? $.map(v.config.tipo_processo, function (v) { return v[0] }) : [])
            };
            var icon = (tipo_processo && typeof config.tipo_processo !== 'undefined' && config.tipo_processo !== null && config.tipo_processo.length > 0 && $.inArray(tipo_processo, config.tipo_processo) !== -1)
                ? '\u25AA\uFE0F ' : '\u25AB\uFE0F ';
            icon = (dadosIfrArvore) ? icon : '';
            return "<option value='" + v.id_atividade + "' " + selected + " data-config='" + JSON.stringify(config) + "'>" + (tab ? '&#160;&#160;&#160;&#160;' : '') + icon + v.nome_atividade + " [" + (tempo_pactuado_display_) + " " + (tempo_pactuado_display > 1 ? 'horas' : 'hora') + "]</option>";
        }).join('') : '';
    return optionSelectAtividades;
}
export function getOptionsSelectResp(arrayResp, value) {
    var optionSelectResponsavel = (typeof arrayResp !== 'undefined' && arrayResp !== null && arrayResp.length > 0) ? $.map(arrayResp, function (v, k) {
        var exigir_homologacao_previa_planos = checkHomologacaoPreviaPlanos(v);
        var selected = (value && v.id_user == value.id_user) ? 'selected' : '';
        var disabled = (!callAtiv('checkCapacidade','only_self_atividades') || arrayConfigAtividades.perfil.id_user == v.id_user) ? '' : 'disabled';
        var config = {
            id_plano: v.id_plano,
            sigla_unidade: v.sigla_unidade,
            id_unidade: v.id_unidade,
            nome_modalidade: v.nome_modalidade,
            id_tipo_modalidade: v.id_tipo_modalidade,
            carga_horaria: v.carga_horaria,
            lista_integral: (v.config !== null && v.config.hasOwnProperty('atividades_lista_integral') && v.config.atividades_lista_integral !== null && v.config.atividades_lista_integral == false ? false : true)
        };
        return exigir_homologacao_previa_planos && !v.homologado ? "" : "<option value='" + v.id_user + "' " + selected + " data-config='" + JSON.stringify(config) + "' " + disabled + ">" + v.apelido + "</option>";
    }).join('') : '';
    return optionSelectResponsavel;
}
function getHomologacaoRuntimeDeps(deps = {}) {
    const context = getAtividadesContext();
    return {
        checkOptionEntidade: deps.checkOptionEntidade
            || (typeof context.page.checkOptionEntidade === 'function' ? context.page.checkOptionEntidade : checkOptionEntidade),
        getOptionEntidade: deps.getOptionEntidade
            || (typeof context.page.getOptionEntidade === 'function' ? context.page.getOptionEntidade : getOptionEntidade),
        moment: deps.moment || context.page.moment
    };
}

export function checkHomologacaoPreviaPlanos(value, deps = {}) {
    return domainCheckHomologacaoPreviaPlanos(value, {
        ...getHomologacaoRuntimeDeps(deps)
    });
}
export function checkHomologacaoPreviaProgramas(value, deps = {}) {
    return domainCheckHomologacaoPreviaProgramas(value, {
        ...getHomologacaoRuntimeDeps(deps)
    });
}
export function recordParamDemanda(this_) {
    if (!delayCrash) {
        var _this = $(this_);
        var _parent = _this.closest('.atividadeWork');
        var _id_atividade = _parent.find('[data-key="id_atividade"]');
        var id_atividade = (_id_atividade.length && _id_atividade.val().trim() != '') ? _id_atividade.val().trim() : false;
        var _fator_complexidade = _parent.find('[data-key="fator_complexidade"]');
        var fator_complexidade = (_fator_complexidade.length && _fator_complexidade.val() !== null && _fator_complexidade.val().trim() != '') ? _fator_complexidade.val().trim() : false;
        var _id_user = _parent.find('[data-key="id_user"]');
        var id_user = (typeof _id_user !== 'undefined' && _id_user.length && typeof _id_user.val() !== 'undefined' && _id_user.val() !== null && _id_user.val().trim() != '') ? _id_user.val().trim() : false;
        var param = { id_atividade: id_atividade, fator_complexidade: fator_complexidade, id_user: id_user };
        setOptionsPro('recordParamDemanda', param);
    }
}
export function changeAtivSelect(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var config = _this.find('option:selected').data('config');
    var inputRecalcPrazo = _parent.find('#ativ_recalcula_prazo');
    var selectUser = _parent.find('#ativ_id_user');
    var inputUnidade = _parent.find('#ativ_id_unidade');
    var optionSelectComplexidade = (config && config.complexidade.length > 0)
        ? $.map(config.complexidade, function (v, k) {
            var selected = (v.default === true) ? 'selected' : '';
            // console.log(v.default, selected, v.fator, v.default === 'true');
            var tempo_pactuado_fator = (typeof config.tempo_pactuado !== 'undefined' && typeof v.fator !== 'undefined' && config.tempo_pactuado > 0 && v.fator > 0) ? (config.tempo_pactuado * v.fator) : false;
            var tempo_pactuado_fator_display = (tempo_pactuado_fator)
                ? (tempo_pactuado_fator < 1) ? parseFloat(tempo_pactuado_fator.toFixed(3)) : parseFloat(tempo_pactuado_fator.toFixed(1))
                : false;
            tempo_pactuado_fator_display = (tempo_pactuado_fator_display) ? " [" + tempo_pactuado_fator_display + " " + (tempo_pactuado_fator > 1 ? 'horas' : 'hora') + "]" : '';
            return "<option value='" + v.fator + "' " + selected + ">" + unicodeToChar(v.complexidade) + tempo_pactuado_fator_display + "</option>";
        }).join('') : '<option>&nbsp;</option>';
    _parent.find('#ativ_fator_complexidade').html(optionSelectComplexidade);
    if (selectUser.val() == '') {
        inputUnidade.val(config ? config.id_unidade : '');
    } else {
        var config_user = selectUser.find('option:selected').data('config');
        inputUnidade.val(config_user ? config_user.id_unidade : '');
    }

    updateAtivTempoPactuado(this_);
    if (_parent.find('#ativ_id_user').find('optgroup').length > 0 && checkOptionEntidade('limitar_vinculacao_atividades')) {
        disableOptGroupUser(this_);
    }

    var ativ_observacao_gerencial = _parent.find('#ativ_observacao_gerencial');
    if (typeof config !== 'undefined' && typeof config.observacao_gerencial !== 'undefined' && config.observacao_gerencial !== null && (typeof ativ_observacao_gerencial.data('user-typed') !== 'undefined' || !ativ_observacao_gerencial.data('user-typed'))) {
        ativ_observacao_gerencial.val(config.observacao_gerencial);
    } else if (typeof ativ_observacao_gerencial.data('user-typed') !== 'undefined' && ativ_observacao_gerencial.data('user-typed') === false) {
        ativ_observacao_gerencial.val('');
    }

    if (
        (typeof config !== 'undefined' && typeof config.recalcula_prazo !== 'undefined' && config.recalcula_prazo && !inputRecalcPrazo.is(':checked') && inputRecalcPrazo.data('mode-insert') == 'auto') ||
        (typeof config !== 'undefined' && typeof config.recalcula_prazo !== 'undefined' && config.recalcula_prazo == false && inputRecalcPrazo.is(':checked') && inputRecalcPrazo.data('mode-insert') == 'auto')
    ) {
        _parent.find('#ativ_recalcula_prazo').trigger('click');
    }

    // updateTempoPlanejado(this_, config);
    updateDateTimeDistribuicao(this_);
    updateAtivSelectEtiquetas(this_);
    updateAtivSelectChecklist(this_);
    checkThisAtivRequiredFields(this_);
    checkThisAtivRequiredFields(_parent.find('#ativ_fator_complexidade')[0]);
    checkUserListInAtividade(this_);
    initChosenReplace('box_refresh', this_, true);
    recordParamDemanda(this_);
}
export function updateTempoPlanejado(this_, config) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var diasPlanejado = _parent.find('#ativ_dias_planejado');
    var complexidade = _parent.find('#ativ_fator_complexidade');
    if (typeof config !== 'undefined' && (parseFloat(diasPlanejado.val()) == 0 || diasPlanejado.val() == '' || diasPlanejado.data('autotime') == 'auto')) {
        var horasPlanejadas = parseFloat(complexidade.val()) + (config.dias_planejado * 8);
        horasPlanejadas = parseInt(horasPlanejadas / 8);

        diasPlanejado.val(horasPlanejadas).data('autotime', 'auto');
        changeDadosTrabalho(diasPlanejado[0], true);
    }
}
export function checkMoreInfoBoxAtiv(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var _moreInfo = _parent.find('.moreInfoBox');
    var _moreInfoLink = _parent.find('.moreInfoBoxAtiv');
    if (!_moreInfo.is(':visible')) {
        _moreInfoLink.trigger('click');
    }
}
export function updateAtivSelectChecklist(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var config = _parent.find('#ativ_id_atividade').find('option:selected').data('config');
    var ativ_checklist = _parent.find('#ativ_checklist');
    var ativ_insert_checklist = _parent.find('#ativ_insert_checklist');
    var table = $('#ativBox_checklist');
    var checklist = (config && config.checklist !== null && config.checklist.length > 0) ? config.checklist : [];
    if (ativ_insert_checklist.is(':checked') && table.data('mode-insert') == 'auto') {
        ativ_insert_checklist.trigger('click');
        // checkMoreInfoBoxAtiv(this_);
    }
    if (checklist.length > 0 && table.data('mode-insert') == 'auto') {
        ativ_checklist.val(JSON.stringify(checklist));
        ativ_insert_checklist.trigger('click');
        // checkMoreInfoBoxAtiv(this_);
        setTimeout(function () {
            table.data('mode-insert', 'auto');
        }, 1000);
    }
}
export function updateAtivSelectEtiquetas(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var config = _parent.find('#ativ_id_atividade').find('option:selected').data('config');
    var id_demanda = parseInt(_parent.find('#ativ_id_demanda').val());
    var etiqueta = (config && config.etiqueta !== null && config.etiqueta.length > 0) ? config.etiqueta.join(';') : '';
    if (id_demanda == 0 && etiqueta !== '') {
        _parent.find('input[data-key="etiquetas"]').importTags(etiqueta);
        // checkMoreInfoBoxAtiv(this_);
    }
}
export function updateDateTimeDistribuicao(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var unidade = (checkValue(_this)) ? _this.find('option:selected').data('config').sigla_unidade : arrayConfigAtivUnidade.sigla_unidade;
    var config_unidade = getBoxConfigDadosUnidade(_parent);
    var dtDistribuicao = _parent.find('#ativ_data_distribuicao');
    if (dtDistribuicao.length > 0) {
        var dtDistribuicao_format = (dtDistribuicao.val().indexOf('T') !== -1) ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
        var dtDistribuicao_val = (dtDistribuicao.val() == '') ? '' : moment(dtDistribuicao.val(), dtDistribuicao_format).format(config_unidade.hora_format);
        var dtVencimento = _parent.find('#ativ_prazo_entrega');
        var dtVencimento_format = (dtVencimento.val().indexOf('T') !== -1) ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
        var dtVencimento_val = (dtVencimento.val() == '') ? '' : moment(dtVencimento.val(), dtVencimento_format).format(config_unidade.hora_format);
        if (config_unidade.count_horas) {
            dtDistribuicao.attr('type', 'datetime-local').val(dtDistribuicao_val);
            dtVencimento.attr('type', 'datetime-local').val(dtVencimento_val);
        } else {
            dtDistribuicao.attr('type', 'date').val(dtDistribuicao_val);
            dtVencimento.attr('type', 'date').val(dtVencimento_val);
        }
        var labelDiasPlan = 'Dias ' + (config_unidade.count_dias_uteis ? '\u00FAteis' : '') + ' de Planejamento';
        _parent.find('#ativ_dias_planejado_label').text(labelDiasPlan);
    }
}
export function updateAtivSelectUser(this_) {
    updateAtivTempoPactuado(this_);
    if (checkOptionEntidade('limitar_vinculacao_atividades')) disableOptGroupAtiv(this_);
    updateTempoTrabalhoAtiv(this_);
    updateTempoTrabalhoAtiv(this_, 'executado');
    checkUserListInAtividade(this_);
    initChosenReplace('box_reload', this_, true);
    recordParamDemanda(this_);
    setIdPlanoAtiv(this_);
    if (checkOptionEntidade('exigir_homologacao_programas')) updateSelectEntregas(this_);
}
export function setIdPlanoAtiv(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var id_user = _parent.find('#ativ_id_user').val();
    id_user = typeof id_user !== 'undefined' && id_user !== null ? id_user.trim() : id_user;
    id_user = id_user == '' ? false : id_user;
    var id_plano = id_user ? jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + id_user + "`] | [0].id_plano") : null;
    id_plano = (id_plano === null) ? 0 : id_plano;
    _parent.find('#ativ_id_plano').val(id_plano);
}
export function changeSelectEntregas(this_) {
    var _this = $(this_);
    var _tr = _this.closest('tr');
    var _parent = _this.closest('.atividadeWork');
    var value = _this.val().trim();
    var nomeEntrega = _this.find('option:selected').data('nome_entrega');
    var input_etiquetas = _parent.find('input[data-key="etiquetas"]');
    var listEntregas = $.map(jmespath.search(arrayConfigAtividades.planos, "[?entregas_programa].entregas_programa"), function (v) { return v }).filter((value, index, self) => {
        return self.findIndex(v => v['id_entrega'] === value['id_entrega']) === index;
    });
    if (typeof listEntregas !== 'undefined' && listEntregas.length) {
        $.each(listEntregas, function (i, v) {
            input_etiquetas.removeTag(v.nome_entrega);
        });
    }
    if (typeof nomeEntrega !== 'undefined') {
        input_etiquetas.addTag(nomeEntrega);
    }
    if (value != '') {
        _tr.attr('data-id_entrega', value).find('.linkDialogEntrega').show();
    } else {
        _tr.find('.linkDialogEntrega').hide();
    }
}
export function updateSelectEntregas(this_, arrayPlanos = arrayConfigAtividades.planos) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var select_user = _parent.find('#ativ_id_user');
    var select_entrega = _parent.find('#ativ_id_entrega');
    var id_user = select_user.val();
    var planos = jmespath.search(arrayPlanos, "[?id_user==`" + id_user + "`]");
    planos = planos && planos !== null ? planos : false;
    var plano = planos ? planos[0] : false;
    var modalidade = plano ? jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?id_tipo_modalidade==`" + plano.id_tipo_modalidade + "`] | [0]") : null;
    var modalidade_config = modalidade !== null && modalidade.hasOwnProperty('config') && typeof modalidade.config !== 'undefined' && modalidade.config !== null ? modalidade.config : false;
    var exige_entregas_programa = (modalidade_config && modalidade_config.hasOwnProperty('exige_entregas_programa')) ? modalidade_config.exige_entregas_programa : true;
    var old_id_entrega = select_entrega.data('old_id_entrega');
    old_id_entrega = typeof old_id_entrega !== 'undefined' ? old_id_entrega : false;
    var plano_entregas = jmespath.search(planos, "[?entregas].entregas[]");
    plano_entregas = typeof plano_entregas !== 'undefined' && plano_entregas !== null && plano_entregas.length ? plano_entregas.filter((v, i, a) => a.findIndex(t => (t.id_entrega === v.id_entrega)) === i) : false;

    var optionSelectEntregas = '<option>&nbsp;</option>';
    if (planos && plano_entregas) {
        $.each(plano_entregas, function (index, v) {
            let selected = old_id_entrega == v.id_entrega ? 'selected' : '';
            optionSelectEntregas += '<option value="' + v.id_entrega + '" ' + selected + ' data-nome_entrega="' + v.nome_entrega + '">' + v.nome_entrega_sigla + '</option>';
        });
    } else {
        optionSelectEntregas += '<option disabled>Nenhuma entrega dispon\u00EDvel para o respons\u00E1vel selecionado</option>';
    }
    select_entrega.html(optionSelectEntregas).trigger('chosen:updated');
    if (exige_entregas_programa) {
        select_entrega.prop('required', true).addClass('requiredSelect').closest('td').addClass('required');
    } else {
        select_entrega.prop('required', false).removeClass('requiredSelect').closest('td').removeClass('required');
    }
    _parent.find('.linkDialogEntrega').hide();
}
export function disableOptGroupAtiv(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var config = _this.find('option:selected').data('config');
    var unidade_super = jmespath.search(arrayConfigAtividades.atividades, "[?id_unidade==`" + arrayConfigAtivUnidade.dependencia + "`].sigla_unidade | [0]");
    unidade_super = (unidade_super && unidade_super !== null) ? unidade_super : arrayConfigAtivUnidade.sigla_unidade;
    _parent.find('#ativ_id_atividade').find('optgroup').each(function () {
        if (config && $(this).attr('label') != config.sigla_unidade && $(this).attr('label') != unidade_super) {
            $(this).prop('disabled', true);
        } else {
            $(this).prop('disabled', false);
        }
    });
    if (_parent.find('#ativ_id_atividade').val() != _parent.find('#ativ_id_atividade option:selected').val()) {
        _parent.find('#ativ_id_atividade').val('').trigger('chosen:updated').trigger('change');
    }
}
export function disableOptGroupUser(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var config = _this.find('option:selected').data('config');
    var id_unidade = (typeof config !== 'undefined' && typeof config.id_unidade !== 'undefined') ? config.id_unidade : false;
    var dependencia = (id_unidade) ? jmespath.search(arrayConfigAtividades.unidades, "[?id_unidade==`" + config.id_unidade + "`] | [0].dependencia") : false;
    var checkDependencia = (id_unidade) ? jmespath.search(arrayConfigAtividades.unidades, "[?id_unidade==`" + dependencia + "`]") : null;
    var checkSubordinacao = (id_unidade) ? jmespath.search(arrayConfigAtividades.unidades, "[?dependencia==`" + id_unidade + "`]") : null;

    _parent.find('#ativ_id_user').find('optgroup').each(function () {
        if (config && $(this).attr('label') != config.sigla_unidade && (checkSubordinacao !== null && ($.inArray($(this).attr('label'), jmespath.search(checkSubordinacao, "[*].sigla_unidade")) == -1)) && (checkDependencia === null || checkDependencia.length != 0)) {
            $(this).prop('disabled', true);
        } else {
            if (!callAtiv('checkCapacidade','only_self_atividades')) $(this).prop('disabled', false);
        }
    });
}
export function checkUserListInAtividade(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var select_user = _parent.find('#ativ_id_user');
    var select_ativ = _parent.find('#ativ_id_atividade');
    var data_ativ = select_ativ.find('option:selected').data('config');
    var is_disabled = false;
    var is_lista_atividade = false;
    var is_homologado = false;
    var nome_modalidade = '';

    if (!callAtiv('checkCapacidade','only_self_atividades')) select_user.find('option').prop('disabled', false);
    select_user.find('option').each(function () {
        var config = $(this).data('config');
        var id_user = select_user.val();
        var id_atividade = select_ativ.val();
        var plano = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + id_user + "`] | [0]");
        var modalidade = (plano && plano !== null) ? jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?id_tipo_modalidade==`" + plano.id_tipo_modalidade + "`] | [0]") : null;
        var modalidade_config = modalidade !== null && modalidade.hasOwnProperty('config') && typeof modalidade.config !== 'undefined' && modalidade.config !== null ? modalidade.config : false;
        var atividades_homologadas = (modalidade && modalidade !== null && modalidade.hasOwnProperty('config') && modalidade_config !== null && modalidade_config.hasOwnProperty('atividades_homologadas') && modalidade_config.atividades_homologadas !== null && modalidade_config.atividades_homologadas == true) ? true : false;

        if ((config && config.lista_integral === false) || atividades_homologadas) {
            var check_lista_atividades = (plano && plano !== null && plano.config !== null &&
                plano.config.hasOwnProperty('lista_atividades') && plano.config.lista_atividades !== null && plano.config.lista_atividades.length > 0 &&
                select_ativ.length > 0 && $.inArray(id_atividade.toString(), plano.config.lista_atividades) === -1
            ) ? true : false;
            if ((check_lista_atividades && id_atividade != '') || (atividades_homologadas && typeof data_ativ !== 'undefined' && data_ativ.hasOwnProperty('homologado') && !data_ativ.homologado)) {
                $(this).prop('disabled', true);
                is_disabled = true;
                is_lista_atividade = (check_lista_atividades) ? true : false;
                is_homologado = (atividades_homologadas && typeof data_ativ !== 'undefined' && data_ativ.hasOwnProperty('homologado') && !data_ativ.homologado) ? true : false;
                nome_modalidade = plano.nome_modalidade;
            } else {
                $(this).prop('disabled', false);
            }

            // console.log({id_user: id_user, id_atividade: id_atividade, check_lista_atividades: check_lista_atividades, plano: plano, modalidade: modalidade, atividades_homologadas: atividades_homologadas, homologado: data_ativ.homologado});
        }
    });
    setTimeout(function () {
        if (select_user.find('option:selected').is(':disabled') && !checkValue(select_user)) {
            var text_is_lista_atividade = (is_lista_atividade) ? '<br><br>- Somente ' + __.atividades + ' ' + getNameGenre('atividade', 'espec\u00EDficos', 'espec\u00EDficas') + ' do plano de trabalho do usu\u00E1rio s\u00E3o ' + getNameGenre('atividade', 'permitidos', 'permitidas') + ' para distribui\u00E7\u00E3o' : '';
            var text_is_homologado = (is_homologado) ? '<br><br>- Somente ' + __.atividades + ' ' + getNameGenre('atividade', 'homologados', 'homologadas') + ' s\u00E3o ' + getNameGenre('atividade', 'permitidos', 'permitidas') + ' para o tipo de modalidade de plano de trabalho do usu\u00E1rio (' + nome_modalidade + ')' : '';
            var htmlAlert = '<span class="alertChartUser" style="background: #f9efad;font-size: 9pt;padding: 5px;border-radius: 5px;display: flex;color: #666;">' +
                '<i class="fas fa-exclamation-triangle vermelhoColor" style="margin: 0 5px;"></i>' +
                '   ' + __.Atividade + ' n\u00E3o dispon\u00EDvel para o usu\u00E1rio selecionado (' + select_user.find('option:selected').text().trim() + ')' +
                '   ' + text_is_lista_atividade + text_is_homologado +
                '</span>';

            select_user.val('').trigger('change');
            _parent.find('#chartUser').html(htmlAlert);
            _parent.find('#ativ_tempo_pactuado').val('');
        }
    }, 100);
}
export function updateAtivTempoPactuado(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var ativ = _parent.find('#ativ_id_atividade');
    var inputUnidade = _parent.find('#ativ_id_unidade');
    var ativ_config = ativ.find('option:selected').data('config');
    var user = _parent.find('#ativ_id_user');
    var user_config = user.find('option:selected').data('config');
    var complex = _parent.find('#ativ_fator_complexidade');
    var multiplica = _parent.find('#ativ_fator_multiplicacao');
    var recorrencia = (_parent.find('#ativ_recorrencia').length > 0 && $('.modoDistribuicao_recorrente:visible').length > 0 && JSON.parse(_parent.find('#ativ_recorrencia').val()).length > 0) ? JSON.parse(_parent.find('#ativ_recorrencia').val()).length : 1;
    var multiprocesso = (_parent.find('#ativ_id_procedimentos').length > 0 && $('.listMultProcessos:visible').length > 0 && JSON.parse(_parent.find('#ativ_id_procedimentos').val()).length > 0) ? JSON.parse(_parent.find('#ativ_id_procedimentos').val()).length : 1;
    var id_demanda = parseInt(_parent.find('#ativ_id_demanda').val());
    var tempo_pactuado = _parent.find('#ativ_tempo_pactuado');
    var config_unidade = getBoxConfigDadosUnidade(_parent);
    var htmlInfoChart = '';

    if (typeof ativ_config === 'undefined') return false;

    if (!checkValue(user)) {
        inputUnidade.val(ativ_config ? ativ_config.id_unidade : '');
    } else {
        inputUnidade.val(user_config ? user_config.id_unidade : '');
    }

    if (!checkValue(multiplica)) { multiplica.val(1) }
    if (checkValue(user) && checkValue(complex)) {
        // var tempo = (user_config.tempo_atividade == 'presencial') ? ativ_config.dias_planejado : ativ_config.tempo_pactuado;
        var tempo = ativ_config.tempo_pactuado;
        var fator = parseFloat(complex.val());
        var arrayModalidades = (ativ_config.hasOwnProperty('modalidades_atividade') && ativ_config.modalidades_atividade && ativ_config.modalidades_atividade.length > 0) ? ativ_config.modalidades_atividade : config_unidade.modalidades;
        var modalidade = (typeof user_config !== 'undefined' && user_config.hasOwnProperty('id_tipo_modalidade')) ? jmespath.search(arrayModalidades, "[?id_tipo_modalidade=='" + user_config.id_tipo_modalidade + "'] | [0]") : null;
        var ganho = (modalidade && modalidade !== null && modalidade.hasOwnProperty('fator')) ? parseFloat(modalidade.fator) : 1;
        var ganho_label = (ganho != 1) ? ' (Ganho: ' + ganho + ')' : '';
        var tipo_modalidade = (modalidade && modalidade !== null && modalidade.hasOwnProperty('tipo_modalidade')) ? modalidade.tipo_modalidade : false;
        // console.log(user_config, user_config.id_tipo_modalidade, config_unidade, ganho);
        var fator_multiplica = (typeof multiplica !== 'undefined' && multiplica.length > 0 && checkValue(multiplica)) ? parseInt(multiplica.val()) : 1;
        // console.log(tempo, fator, ganho, fator_multiplica, multiplica, recorrencia, multiprocesso);
        var tempo_user = parseFloat((tempo * fator * ganho * fator_multiplica * recorrencia * multiprocesso).toFixed(1));
        htmlInfoChart = (tipo_modalidade)
            ? '<span style="color: #777;float: right;font-size: 9pt;margin-top: 10px;"><i class="fas fa-info-circle laranjaColor" style="float: initial;font-size: 10pt;"></i> Modalidade: ' + tipo_modalidade + ganho_label + '</span>'
            : '';
        // console.log((tempo*fator*fator_multiplica).toFixed(), (tempo*fator*fator_multiplica), (tempo*fator*fator_multiplica).toFixed(1));
        tempo_pactuado.data('tempo-pactuado', tempo * fator * ganho).val(tempo_user);
    }
    if (!checkValue(user) && !checkValue(complex)) {
        tempo_pactuado.data('tempo-pactuado', 0).val('');
        if (_parent.find('#chartTempoPlano').length > 0) { Chart.getChart(_parent.find('#chartTempoPlano')[0])?.destroy() }
        _parent.find('#chartUser').html('');
    }
    if (checkValue(user) && checkValue(complex)) {
        var plano = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + user.val() + "`].{tempo_despendido: tempo_despendido, tempo_homologado: tempo_homologado, tempo_pactuado: tempo_pactuado, tempo_total: tempo_total, tempo_proporcional: tempo_proporcional, tempo_entregue: tempo_entregue, data_inicio_vigencia: data_inicio_vigencia, data_fim_vigencia: data_fim_vigencia} | [0]");
        if (plano !== null) {
            plano.tempo_pactuado = (id_demanda == 0) ? plano.tempo_pactuado : plano.tempo_pactuado - parseFloat(tempo_pactuado.data('tempo-pactuado'));
            if (typeof tempo_user !== 'undefined') { plano.tempo_projetado = plano.tempo_pactuado + parseFloat(tempo_user) }
            if (_parent.find('#chartUser').length) {
                _parent.find('#chartUser').html('<canvas id="chartTempoPlano" width="380" height="120"></canvas>' + htmlInfoChart);
                callAtiv('getSingleChartTempoPlano',_parent.find('#chartTempoPlano'), plano);
            }
        }
    }
    checkThisAtivRequiredFields(this_);
    getListAtivPrioridades(this_, user.val(), id_demanda);
    updateTempoPlanejado(this_, ativ_config);
    recordParamDemanda(this_);

    if ($('.modoDistribuicao_recorrente:visible').length > 0) {
        var updateAtiv = _parent.find('#ativ_id_atividade');
        if (typeof updateAtiv.data('update_recorrencia') === 'undefined' || updateAtiv.data('update_recorrencia') == false) {
            callAtiv('calculoRecorrenciaAtiv',this_);
        }
    }
}
export function getListAtivVinculacao() {
    var value = (arrayAtividadesPro) ? jmespath.search(arrayAtividadesPro, "sort_by([?data_inicio=='0000-00-00 00:00:00'], &prioridade)") : false;
    htmlSelect = (value && value !== null)
        ? $.map(value, function (v, i) { return '<option value="' + v.id_demanda + '" title="' + callAtiv('getTitleDialogBox',v, true) + '">' + callAtiv('getTitleDialogBox',v) + '</option>' }).join('')
        : '<option value="0">' + getNameGenre('demanda', 'Nenhum', 'Nenhuma') + ' ' + __.demanda + ' n\u00E3o ' + getNameGenre('demanda', 'iniciado', 'iniciada') + ' dispon\u00EDvel...</option>';
    return htmlSelect;
}
export function getListAtivPrioridades(this_, id_user, id_demanda) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var htmlSelect = '<option value="0">&nbsp;</option>';
    _parent.find('#trAtivPrioridade').hide();
    if (id_user != '' && id_user != 0) {
        var value = arrayAtividadesPro ? jmespath.search(arrayAtividadesPro, "sort_by([?data_inicio=='0000-00-00 00:00:00'] | [?id_demanda!=`" + id_demanda + "`] | [?id_user==`" + id_user + "`], &prioridade)") : null;
        htmlSelect = (value && value !== null)
            ? $.map(value, function (v, i) { return '<option value="' + v.prioridade + '" data-index="' + i + '" data-demanda="' + v.id_demanda + '" title="' + callAtiv('getTitleDialogBox',v, true) + '">Antes de: ' + callAtiv('getTitleDialogBox',v) + '</option>' }).join('')
            : '<option value="0">' + getNameGenre('demanda', 'Nenhum', 'Nenhuma') + ' ' + __.demanda + ' n\u00E3o ' + getNameGenre('demanda', 'iniciado', 'iniciada') + ' dispon\u00EDvel...</option>';
        _parent.find('#trAtivPrioridade').show();
        if (value.length == 0 && _parent.find('#ativ_prioridades').is(':checked')) {
            _parent.find('#ativ_prioridades').trigger('click');
        }
    }
    _parent.find('#ativ_lista_prioridades').html(htmlSelect);
}
export function getPlanoData(id_plano) {
    var tablePlanos = (typeof tableConfigList !== 'undefined' && tableConfigList && tableConfigList.planos)
        ? tableConfigList.planos
        : undefined;
    var configPlanos = (typeof arrayConfigAtividades !== 'undefined' && arrayConfigAtividades && arrayConfigAtividades.planos)
        ? arrayConfigAtividades.planos
        : undefined;
    return findConfigItemById([tablePlanos, configPlanos], 'id_plano', id_plano);
}
export function getProgramaData(id_programa) {
    var tableProgramas = (typeof tableConfigList !== 'undefined' && tableConfigList && tableConfigList.programas)
        ? tableConfigList.programas
        : undefined;
    var configProgramas = (typeof arrayConfigAtividades !== 'undefined' && arrayConfigAtividades && arrayConfigAtividades.programas)
        ? arrayConfigAtividades.programas
        : undefined;
    return findConfigItemById([tableProgramas, configProgramas], 'id_programa', id_programa);
}
// BOX DE AVALIACAO
