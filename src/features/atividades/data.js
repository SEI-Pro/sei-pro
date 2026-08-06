import { callAtiv } from './call.js';
/**
 * Atividades — cache local, permissões e diagnóstico.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import './runtime.js';
import { isPerfilNivelAdm } from './domain.js';

export function checkPerfilNivelAdm() {
    var perfil = (typeof arrayConfigAtividades !== 'undefined' &&
        typeof arrayConfigAtividades.perfil !== 'undefined')
        ? arrayConfigAtividades.perfil
        : undefined;
    return isPerfilNivelAdm(perfil);
}
/* getLabIdTables → domain.js */
export function appendDataDemandaOnLocalArray(arrayServer, demandaType) {
    var arrayLocal = (demandaType == 'demandas_processo') ? arrayAtividadesProcPro : arrayAtividadesPro;
    if (arrayServer !== null && arrayServer.length > 0) {
        $.each(arrayServer, function (i, v) {
            var objIndexAtiv = (typeof arrayLocal === 'undefined' || arrayLocal == 0 || arrayLocal.length == 0) ? -1 : arrayLocal.findIndex((obj => obj.id_demanda == v.id_demanda));
            if (objIndexAtiv !== -1) {
                arrayLocal[objIndexAtiv] = v;
                // console.log(demandaType, 'UPDATE', v);
            } else if (typeof arrayLocal !== 'undefined' && arrayLocal != 0) {
                arrayLocal.push(v);
                // console.log(demandaType, 'PUSH', v);
            }
            // console.log(demandaType, arrayLocal, v);
        });
    }
    if (demandaType == 'demandas_processo') {
        arrayAtividadesProcPro = arrayLocal;
    } else {
        arrayAtividadesPro = arrayLocal;
    }
}
export function storeLocalDataConfigArray(arrayConfig) {
    if (typeof arrayConfig === 'object' && arrayConfig !== null) {
        var list = [];
        for (var propertyName in arrayConfig) {
            hybridStorageStorePro('configDataAtividadesPadraoPro_' + propertyName, arrayConfig[propertyName]);
            list.push(propertyName);
        }
        hybridStorageStorePro('configDataAtividadesPadraoPro', list);
    }
}
export function restoreLocalDataConfigArray() {
    var arrayConfig = hybridStorageRestorePro('configDataAtividadesPadraoPro');
    if (arrayConfig !== null) {
        var arrayStore = [];
        $.each(arrayConfig, function (i, v) {
            var dataValue = hybridStorageRestorePro('configDataAtividadesPadraoPro_' + v);
            if (dataValue !== null) {
                arrayStore[v] = dataValue;
            }
        });
        return arrayStore;
    } else {
        return false;
    }
}
export function removeLocalDataConfigArray() {
    var arrayConfig = hybridStorageRestorePro('configDataAtividadesPadraoPro');
    if (arrayConfig !== null) {
        var arrayStore = [];
        $.each(arrayConfig, function (i, v) {
            var dataValue = hybridStorageRemovePro('configDataAtividadesPadraoPro_' + v);
            if (dataValue !== null) {
                arrayStore[v] = dataValue;
            }
        });
        return arrayStore;
    } else {
        return false;
    }
}
export function appendDataConfigOnLocalArray(arrayServer) {
    if (typeof arrayServer === 'object' && arrayServer !== null) {
        for (var propertyName in arrayServer) {
            if (arrayServer.hasOwnProperty(propertyName) && (arrayServer[propertyName].length > 0 || (arrayServer[propertyName].hasOwnProperty('lista') && arrayServer[propertyName]['lista'].length > 0))) {
                var arrayLocal = arrayServer[propertyName]['lista'];
                if (propertyName == 'afastamentos') {
                    $.each(arrayLocal, function (i, v) {
                        var primarykey = v.primarykey;
                        var objIndexAtiv = (typeof arrayConfigAtividades[propertyName]['lista'] === 'undefined' || arrayConfigAtividades[propertyName]['lista'] == 0 || arrayConfigAtividades[propertyName]['lista'].length == 0) ? -1 : arrayConfigAtividades[propertyName]['lista'].findIndex((obj => obj[primarykey] == v[primarykey]));
                        if (objIndexAtiv !== -1) {
                            arrayConfigAtividades[propertyName]['lista'][objIndexAtiv] = v;
                        } else if (typeof arrayConfigAtividades[propertyName]['lista'] !== 'undefined' && arrayConfigAtividades[propertyName]['lista'] != 0) {
                            arrayConfigAtividades[propertyName]['lista'].push(v);
                        }
                    });
                } else {
                    if (arrayServer[propertyName].length > 0) {
                        $.each(arrayServer[propertyName], function (i, v) {
                            var primarykey = v.primarykey;
                            var objIndexAtiv = (typeof arrayConfigAtividades[propertyName] === 'undefined' || arrayConfigAtividades[propertyName] == 0 || arrayConfigAtividades[propertyName].length == 0) ? -1 : arrayConfigAtividades[propertyName].findIndex((obj => obj[primarykey] == v[primarykey]));
                            if (objIndexAtiv !== -1) {
                                arrayConfigAtividades[propertyName][objIndexAtiv] = v;
                            } else if (typeof arrayConfigAtividades[propertyName] !== 'undefined' && arrayConfigAtividades[propertyName] != 0) {
                                arrayConfigAtividades[propertyName].push(v);
                            }
                        });
                    }
                }
            }
        }
    }
}
export function loopRepairKanbanPinMoveCard() {
    $('.kanban-board').each(function () {
        repairKanbanPinMoveCard($(this).data('id'));
    })
}
export function repairKanbanPinMoveCard(board) {
    var pinboard = $('.kanban-board[data-id="' + board + '"] .kanban-item .kanban-pinboard .newLink_active');
    if (pinboard.length > 0) {
        $(pinboard.get().reverse()).each(function () {
            var _this = $(this);
            var _parent = _this.closest('.kanban-item');
            var data = _parent.data();
            var id = (typeof data.eid !== 'undefined') ? data.eid.replace('_id_', '') : false;
            pinboard.removeClass('newLink_active');
            callAtiv('pinKanbanItens',this, id);
        });
    }
}
export function repairPerfilSelectUnidade() {
    var sigla_unidade = arrayConfigAtivUnidade.sigla_unidade;
    var display_unidade = $('select[data-type="perfil"]').eq(0).val();
    if (sigla_unidade != display_unidade) {
        $('select[data-type="perfil"]').val(sigla_unidade);
        setOptionsPro('perfilAtividadesSelected', sigla_unidade);
    }
    $('select[data-type="perfil"]').chosen("destroy").chosen({
        placeholder_text_single: ' ',
        no_results_text: 'Nenhum resultado encontrado',
        normalize_search_text: function (text) {
            return removeAcentos(text.toLowerCase());
        }
    });
}
export function failureScreen(data, textStatus, param = false) {
    loadingButtonConfirm(false);
    $('.panelHome').find('.iconAtividade_update i').removeClass('fa-spin');
    $('#tabsPanelConfig').find('.ui-tabs-anchor i').removeClass('fa-spin').removeClass('fa-spinner');
    $('.dataFallback').removeClass('dataLoading');

    if (param) delete param.hash;

    var dataResponse = $("<div/>").html(data.responseText).text();
    dataResponse = (dataResponse) ? dataResponse.trim() : '';
    dataResponse = (param) ? dataResponse + '\n\nParam:\n\n' + JSON.stringify(param, null, "\t") : dataResponse;

    var htmlReportError = '<p style="margin: 10px 0;">' +
        '   <span>' +
        (textStatus != 'debug' ?
            '       <a class="newLink" data-act="atividades-call" data-fn="openErrorReport" style="font-size: 9pt;cursor: pointer;">' +
            '           <i class="fas fa-laptop-code" style="font-size: 100%;"></i> ' +
            '           Relat\u00F3rio de erros' +
            '           <i class="fas fa-angle-double-right" style="font-size: 100%;"></i>' +
            '       </a>' +
            '' : '') +
        (textStatus == 'debug' || (isSEIProPRFHost() && callAtiv('checkCapacidade','report_errors') && dataResponse != '') ?
            '       <a class="newLink sendReport" data-act="atividades-call" data-fn="sendErrorReport" data-send="false" style="font-size: 9pt;cursor: pointer;float: right;background:#1a6bc4;color:#fff;padding:6px 14px;border-radius:4px;text-decoration:none;">' +
            '           <i class="fas fa-paper-plane" style="font-size: 100%;margin-right:5px;"></i> ' +
            '           <span class="labelLink">' + (textStatus == 'debug' ? 'Enviar Relat\u00F3rio' : 'Notificar o Administrador') + '</span>' +
            '       </a>' +
            '' : '') +
        '   </span>' +
        '   <pre class="errorReport">' +
        '       ' + dataResponse +
        '   </pre>' +
        '</p>';
    var textError = (textStatus === 'timeout' || dataResponse == '') ? 'Erro ao receber sua informa\u00E7\u00F5es do servidor de dados. Tente novamente mais tarde. (' + textStatus + ')' : 'Erro ao enviar sua informa\u00E7\u00F5es. Tente novamente mais tarde ou notifique o administrador.<br><br>' + htmlReportError;
    textError = (textStatus == 'debug') ? 'Descreva o problema ou sugest\u00E3o e clique em <u>Enviar Relat\u00F3rio</u>.<br><br>'
        + '<select id="prf_bug_tipo" style="margin-bottom:8px;padding:4px 8px;border-radius:4px;border:1px solid #ccc;width:100%">'
        + '<option value="bug">Reportar um bug</option>'
        + '<option value="sugestao">Enviar uma sugest\u00E3o</option>'
        + '</select>'
        + '<textarea id="prf_bug_descricao" placeholder="Descreva o que aconteceu ou o que gostaria de melhorar..." style="width:100%;height:80px;padding:8px;border-radius:4px;border:1px solid #ccc;font-size:90%;resize:vertical;box-sizing:border-box;margin-bottom:8px"></textarea>'
        + htmlReportError : textError;
    alertaBoxPro('Error', 'exclamation-triangle', textError);
    callAtiv('getInsertIconAtividade',);
    if (textStatus == 'debug') $(".ui-dialog-buttonpane button:contains('OK')").button('disable');
}
export function dialogDebugScreen() {
    if (!isSEIProPRFHost()) return;
    failureScreen({ responseText: 'debug' }, 'debug');
}
export function sendErrorReport(this_) {
    if (!isSEIProPRFHost()) return;
    var _this = $(this_);
    var data = _this.data();
    var boxError = $('.alertaErrorPro .errorReport');
    var textError = boxError.text().trim();
    if (data.send == false) {
        _this.data('send', true);
        _this.find('i').attr('class', 'fas fa-spinner fa-spin');
        sendErrorReportServer(textError);
    }
}
export function sendErrorReportServer(textError) {
    if (!isSEIProPRFHost()) return;
    var descricao = $('#prf_bug_descricao').val() || '';
    var tipo = $('#prf_bug_tipo').val() || 'bug';
    var sendReportButton = $('.alertaErrorPro .sendReport');
    var markSuccess = function () {
        sendReportButton.find('i').attr('class', 'fas fa-thumbs-up azulColor');
        sendReportButton.find('.labelLink').text('Relat\u00F3rio enviado!');
        if (textError == 'debug') $('.iconDebugScreen').remove();
    };
    var markError = function (message) {
        sendReportButton.find('i').attr('class', 'fas fa-exclamation-triangle amareloColor');
        sendReportButton.find('.labelLink').text(message || 'Erro ao enviar. Tente novamente.');
    };

    if (!getAppsScriptUrlAtiv() || typeof sendSEIProBugPayload !== 'function' || typeof buildSEIProBugPayload !== 'function') {
        markError('URL do servidor não configurada');
        return;
    }

    sendSEIProBugPayload(buildSEIProBugPayload({
        tipo: tipo,
        descricao: descricao,
        erro_tecnico: (textError !== 'debug') ? textError : '',
        modo: 'manual',
        origem: 'botao_bug'
    }), {
        onSuccess: function () {
            markSuccess();
        },
        onError: function () {
            markError();
        }
    });
}
export function openErrorReport(this_) {
    $('.alertaErrorPro .errorReport').toggle();
}
