import { callAtiv, hasAtiv } from './call.js';
/**
 * Atividades — entrada, perfil, sincronização e prescrição.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import { atividadesActionAttrs } from './templates.js';
import { getServerAtividades } from './server.js';

export function initPanelAtividades(ativData, TimeOut = 9000) {
    if (TimeOut <= 0 || !ativData) { return; }
    if (typeof $().tabs !== 'undefined' && typeof localStorageRestorePro !== 'undefined' && hasAtiv('setPanelAtividades') && typeof orderDivPanel !== 'undefined' && typeof moment().isoWeekdayCalc !== 'undefined' && !loadRowsPanelAtiv) {
        if ($('#ifrArvore').length > 0 && ativData['demandas_processo'].length > 0) {
            var ifrArvoreElem = (typeof getIframeArvoreElement === 'function') ? getIframeArvoreElement() : $('#ifrArvore')[0];
            if (ifrArvoreElem && ifrArvoreElem.contentWindow) ifrArvoreElem.contentWindow.initAtividadesProcesso(ativData['demandas_processo']);
        } else {
            callAtiv('setPanelAtividades',ativData['demandas']);
            callAtiv('setAtividadesUser',);
        }
        loadingButtonConfirm(false);
    } else {
        setTimeout(function () {
            initPanelAtividades(ativData, TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initPanelAtividades');
        }, 500);
    }
}
export function getAtividadesProcesso(id_procedimento) {
    var dadosProcesso = getIfrArvoreDadosProcesso();
    var stateAtivData = getOptionsPro('panelAtividadesViewSend') ? 'ativas' : 'nao_enviadas';
    var selfAtivData = getOptionsPro('panelAtividadesViewSelf') ? 'only_mine' : '';
    var param = {
        action: 'demandas_processo',
        id_procedimento: id_procedimento,
        processo_sei: dadosProcesso.processo_sei,
        status: stateAtivData,
        self: selfAtivData
    };
    getServerAtividades(param, 'panel');
}
export function getPanelAtividades(callback) {
    var stateAtivData = getOptionsPro('panelAtividadesViewSend') ? 'ativas' : 'nao_enviadas';
    var selfAtivData = getOptionsPro('panelAtividadesViewSelf') ? 'only_mine' : '';
    var stateAtivDataSub = getOptionsPro('panelAtividadesViewSubordinada') ? '' : 'self';
    // var stateAtivDataSub = ( getOptionsPro('panelAtividadesViewSubordinada') || !verifyOptionsPro('panelAtividadesViewSubordinada')) ? '' : 'self';
    var param = {
        action: 'demandas',
        status: stateAtivData,
        lista: stateAtivDataSub,
        callback: callback,
        self: selfAtivData
    };
    getServerAtividades(param, 'panel');
}
export function getPanelAtividades_() {
    if (typeof arrayConfigAtividades == 'undefined' || arrayConfigAtividades.length == 0) {
        getPanelAtividades();
    }
}
export function getAtividades(callback) {
    var ifrArvore = $('#ifrArvore');
    if (ifrArvore.length > 0) {
        var id_procedimento = getParamsUrlPro(ifrArvore.attr('src')).id_procedimento;
        id_procedimento = (typeof id_procedimento !== 'undefined') ? parseInt(id_procedimento) : 0;
        getAtividadesProcesso(id_procedimento, callback);
    } else {
        if ($('#atividadesProDiv').is(':visible') || $('#projetosGanttDiv').is(':visible')) {
            getPanelAtividades(callback);
        }
    }
}
export function getTitleDialogBox(v, full = false) {
    var nome_atividade = (v.nome_atividade && v.nome_atividade.length > 50)
        ? v.nome_atividade.replace(/^(.{50}[^\s]*).*/, "$1") + '...'
        : (v.nome_atividade ? v.nome_atividade : '');
    var assunto = (v.assunto && v.assunto.length > 50)
        ? v.assunto.replace(/^(.{50}[^\s]*).*/, "$1") + '...'
        : (v.assunto ? v.assunto : '');
    var nameAtiv = (full)
        ? (v.assunto ? v.assunto + ' / ' : '') + v.nome_atividade
        : (assunto ? assunto : '') + (nome_atividade != '' ? ' / ' + nome_atividade : '');
    var displayTitle = (v.nome_requisicao ? v.nome_requisicao + ' - ' : '') + (v.requisicao_sei ? '(' + v.requisicao_sei + ') - ' : '') + (v.apelido ? v.apelido + ' ' : '');
    displayTitle = (displayTitle != '') ? displayTitle + '/ ' + nameAtiv : nameAtiv;
    return displayTitle;
}
export function selectAtividadeBox(mode) {
    var iconDelete = $('#atividadesProActions .iconAtividade_delete');
    var iconSend = $('#atividadesProActions .iconAtividade_send');
    var iconRate = $('#atividadesProActions .iconAtividade_rate');

    if (mode == 'send' && iconSend.length > 0 && iconSend.data('list').length > 0) {
        callAtiv('archiveAtividade',iconSend.data('list'));
    } else if (mode == 'rate' && iconRate.length > 0 && iconRate.data('list').length > 0) {
        callAtiv('rateAtividadeLote',iconRate.data('list'));
    } else if (mode == 'delete' && iconDelete.length > 0 && iconDelete.data('list').length > 0) {
        var id_demandas = iconDelete.data('list');
        confirmaFraseBoxPro('Tem certeza que deseja excluir ' + (id_demandas.length > 1 ? __.as_demandas_selecionadas : __.a_demanda_selecionada) + '?', 'EXCLUIR', function () {
            var action = (callAtiv('checkCapacidade','delete_atividade_all')) ? 'delete_atividade_all' : 'delete_atividade';
            var param = {
                id_demandas: id_demandas,
                id_demanda: -1,
                id_unidade: arrayConfigAtivUnidade.id_unidade,
                action: action
            };
            getServerAtividades(param, action);
        });
    } else {
        var arrayAtividadesList = ($($ifrVisualizacao).length > 0) ? arrayAtividadesProcPro : arrayAtividadesPro;
        var listaAtividades = (mode == 'start')
            ? (!callAtiv('checkCapacidade','only_self_atividades'))
                ? jmespath.search(arrayAtividadesList, "[?data_inicio=='0000-00-00 00:00:00']")
                : jmespath.search(arrayAtividadesList, "[?data_inicio=='0000-00-00 00:00:00'] | [?id_user==`" + arrayConfigAtividades.perfil.id_user + "`]")
            : 0;
        listaAtividades = (mode == 'complete')
            ? (!callAtiv('checkCapacidade','only_self_atividades'))
                ? jmespath.search(arrayAtividadesList, "[?data_entrega=='0000-00-00 00:00:00'] | [?data_inicio!='0000-00-00 00:00:00']")
                : jmespath.search(arrayAtividadesList, "[?data_entrega=='0000-00-00 00:00:00'] | [?data_inicio!='0000-00-00 00:00:00'] | [?id_user==`" + arrayConfigAtividades.perfil.id_user + "`]")
            : listaAtividades;
        listaAtividades = (mode == 'edit' && callAtiv('checkCapacidade','edit_atividade'))
            ? jmespath.search(arrayAtividadesList, "[?data_entrega=='0000-00-00 00:00:00']")
            : listaAtividades;
        listaAtividades = (mode == 'rate' && callAtiv('checkCapacidade','rate_atividade'))
            ? jmespath.search(arrayAtividadesList, "[?data_entrega!='0000-00-00 00:00:00'] | [?data_avaliacao=='0000-00-00 00:00:00']")
            : listaAtividades;
        listaAtividades = (mode == 'rate_edit' && callAtiv('checkCapacidade','rate_edit_atividade'))
            ? jmespath.search(arrayAtividadesList, "[?data_entrega!='0000-00-00 00:00:00'] | [?data_avaliacao!='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00']")
            : listaAtividades;
        listaAtividades = (mode == 'rate_cancel' && callAtiv('checkCapacidade','rate_cancel_atividade'))
            ? jmespath.search(arrayAtividadesList, "[?data_avaliacao!='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00']")
            : listaAtividades;
        listaAtividades = (mode == 'send' && callAtiv('checkCapacidade','send_atividade'))
            ? jmespath.search(arrayAtividadesList, "[?data_entrega!='0000-00-00 00:00:00'] | [?data_avaliacao!='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00']")
            : listaAtividades;
        listaAtividades = (mode == 'delete' && callAtiv('checkCapacidade','delete_atividade') && !callAtiv('checkPerfilNivelAdm',))
            ? jmespath.search(arrayAtividadesList, "[?data_entrega=='0000-00-00 00:00:00']")
            : listaAtividades;
        listaAtividades = (mode == 'delete' && callAtiv('checkCapacidade','delete_atividade_all'))
            ? jmespath.search(arrayAtividadesList, "[*]")
            : listaAtividades;

        if (listaAtividades.length == 1) {
            if (mode == 'start') {
                callAtiv('startAtividade',listaAtividades[0].id_demanda);
            } else if (mode == 'complete') {
                callAtiv('completeAtividade',listaAtividades[0].id_demanda);
            } else if (mode == 'edit') {
                callAtiv('saveAtividade',listaAtividades[0].id_demanda);
            } else if (mode == 'rate' || mode == 'rate_edit') {
                callAtiv('rateAtividade',listaAtividades[0].id_demanda);
            } else if (mode == 'rate_cancel') {
                callAtiv('rateCancelAtividade',listaAtividades[0].id_demanda);
            } else if (mode == 'send') {
                callAtiv('archiveAtividade',listaAtividades[0].id_demanda);
            } else if (mode == 'delete') {
                confirmaBoxPro('Tem certeza que deseja excluir ' + __.esta_demanda + '?', function () { callAtiv('deleteAtividade',listaAtividades[0].id_demanda) }, 'Excluir');

            }

        } else if (listaAtividades.length > 1) {
            var nameMode = (mode == 'start') ? 'Iniciar' : '';
            nameMode = (mode == 'complete') ? 'Concluir' : nameMode;
            nameMode = (mode == 'edit') ? 'Editar' : nameMode;
            nameMode = (mode == 'rate') ? 'Avaliar' : nameMode;
            nameMode = (mode == 'rate_edit') ? 'Editar Avaliar' : nameMode;
            nameMode = (mode == 'rate_cancel') ? 'Cancelar Avalia\u00E7\u00E3o' : nameMode;
            nameMode = (mode == 'send') ? __.Arquivar : nameMode;
            nameMode = (mode == 'delete') ? 'Deletar' : nameMode;
            var optionSelectAtividade = $.map(listaAtividades, function (v, k) {
                return '<option value="' + v.id_demanda + '" title="' + getTitleDialogBox(v, true) + '">' + getTitleDialogBox(v) + '</option>'
            }).join('');
            var htmlBox = '<div id="boxAtividade" class="seipro-atividades-box atividadeWork ' + mode + 'AtividadeBox seipro-atividades-work">' +
                '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
                '      <tr>' +
                '          <td style="vertical-align: bottom; text-align: left; width: 160px;" class="label">' +
                '               <label for="ativ_data_inicio"><i class="iconPopup iconSwitch fas fa-check cinzaColor" style="min-height: 45px;"></i>Selecione ' + __.a_Demanda + ' para ' + nameMode + ':</label>' +
                '           </td>' +
                '           <td>' +
                '               <select id="ativ_id_demanda" data-act="atividades-call" data-fn="getSelectedItemBox" data-key="id_demanda">' + optionSelectAtividade + '</select>' +
                '           </td>' +
                '      </tr>' +
                '      <tr id="previewItemAtividade" style="display:none;">' +
                '           <td colspan="2">' +
                '               <div class="preview_atividade seipro-atividades-preview" style="padding: 20px;background-color: #f4f5f5;border-radius: 5px;margin-top: 10px;"></div>' +
                '           </td>' +
                '      </tr>' +
                '   </table>' +
                '</div>';


            var btnDialogBoxPro = [{
                text: 'Selecionar',
                class: 'confirm',
                click: function (event) {
                    var selectIdDemanda = $('.' + mode + 'AtividadeBox').find('#ativ_id_demanda').val();
                    // console.log(selectIdDemanda);
                    if (mode == 'start') {
                        callAtiv('startAtividade',selectIdDemanda);
                    } else if (mode == 'complete') {
                        callAtiv('completeAtividade',selectIdDemanda);
                    } else if (mode == 'edit') {
                        callAtiv('saveAtividade',selectIdDemanda);
                    } else if (mode == 'rate' || mode == 'rate_edit') {
                        callAtiv('rateAtividade',selectIdDemanda);
                    } else if (mode == 'rate_cancel') {
                        callAtiv('rateCancelAtividade',selectIdDemanda);
                    } else if (mode == 'send') {
                        callAtiv('archiveAtividade',selectIdDemanda);
                    } else if (mode == 'delete') {
                        callAtiv('deleteAtividade',selectIdDemanda);
                    }
                }
            }];

            if (callAtiv('checkCapacidade','start_cancel_atividades') && mode == 'complete') {
                btnDialogBoxPro.unshift({
                    text: 'Cancelar In\u00EDcio',
                    icon: 'ui-icon-close',
                    click: function (event) {
                        $('#boxAtividade').remove();
                        resetDialogBoxPro('dialogBoxPro');
                        var list = $('#atividadesProActions .iconAtividade_complete').data('list');
                        callAtiv('startCancelAtividadeLote',list);
                    }
                });
            }

            resetDialogBoxPro('dialogBoxPro');
            dialogBoxPro = $('#dialogBoxPro')
                .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
                .dialog({
                    title: nameMode + ' ' + __.Demanda + ': Selecionar',
                    width: 770,
                    open: function () {
                        updateButtonConfirm(this, true);
                        initChosenReplace('box_init', this, true);
                    },
                    close: function () {
                        $('#boxAtividade').remove();
                        resetDialogBoxPro('dialogBoxPro');
                    },
                    buttons: btnDialogBoxPro
                });
        }
    }
}
export function getSelectedItemBox(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    var id_demanda = _this.prop('multiple') && _this.val().length ? _this.val()[_this.val().length - 1] : false;
    id_demanda = (!_this.prop('multiple') && checkValue(_this)) ? _this.val() : id_demanda;
    var value = (id_demanda) ? callAtiv('getAtividadeData',id_demanda) : null;
    value = (id_demanda && value !== null) ? value : false;
    var htmlItem = (value)
        ? '<div class="kanban-container">' +
        '   <div class="kanban-item" data-eid="_id_' + id_demanda + '">' +
        callAtiv('getKanbanItem',value).title +
        '   </div>' +
        '</div>'
        : '';

    if (value) {
        _parent.find('#previewItemAtividade').show().find('.seipro-atividades-preview').html(htmlItem);
    } else {
        _parent.find('#previewItemAtividade').hide().find('.seipro-atividades-preview').html('');
    }
    dialogBoxPro.dialog('option', 'height', 'auto');
}
export function insertIconAtividade() {
    waitLoadPro($($ifrVisualizacao).contents(), '#divInfraAreaTelaD', "#divArvoreAcoes", getInsertIconAtividade);
}
export function getInsertIconAtividade(loop = true) {
    var arrayAtividadesList = [];
    if ($($ifrVisualizacao).length > 0) {
        $($ifrVisualizacao).contents().find('.iconBoxAtividade').remove();
        arrayAtividadesList = arrayAtividadesProcPro;
    } else {
        $('#atividadesProActions').find('.iconBoxAtividade').remove();
        arrayAtividadesList = arrayAtividadesPro;
    }
    if (callAtiv('checkCapacidade','save_atividade')) {
        appendIconAtividade('save');
    }
    if (arrayAtividadesList.length > 0) {
        if (callAtiv('checkCapacidade','start_atividade') &&
            (
                (!callAtiv('checkCapacidade','only_self_atividades'))
                    ? (jmespath.search(arrayAtividadesList, "[?data_inicio=='0000-00-00 00:00:00'] | length(@)") > 0)
                    : (jmespath.search(arrayAtividadesList, "[?data_inicio=='0000-00-00 00:00:00'] | [?id_user==`" + arrayConfigAtividades.perfil.id_user + "`] | length(@)") > 0)
            )
        ) {
            appendIconAtividade('start');
        }
        if ((callAtiv('checkCapacidade','complete_atividade') || callAtiv('checkCapacidade','start_cancel_atividade')) &&
            (
                (!callAtiv('checkCapacidade','only_self_atividades'))
                    ? (jmespath.search(arrayAtividadesList, "[?data_entrega=='0000-00-00 00:00:00'] | [?data_inicio!='0000-00-00 00:00:00'] | length(@)") > 0)
                    : (jmespath.search(arrayAtividadesList, "[?data_entrega=='0000-00-00 00:00:00'] | [?data_inicio!='0000-00-00 00:00:00'] | [?id_user==`" + arrayConfigAtividades.perfil.id_user + "`] | length(@)") > 0)
            )
        ) {
            appendIconAtividade('complete');
        }
        if (callAtiv('checkCapacidade','rate_atividade') && jmespath.search(arrayAtividadesList, "[?data_entrega!='0000-00-00 00:00:00'] | [?data_avaliacao=='0000-00-00 00:00:00'] | length(@)") > 0) {
            appendIconAtividade('rate');
        }
        if (callAtiv('checkCapacidade','send_atividade') && jmespath.search(arrayAtividadesList, "[?data_avaliacao!='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00'] | length(@)") > 0) {
            appendIconAtividade('send');
        }
        if (callAtiv('checkCapacidade','delete_atividade') && jmespath.search(arrayAtividadesList, "[?data_inicio=='0000-00-00 00:00:00'] | length(@)") > 0) {
            appendIconAtividade('delete');
        }
        if (callAtiv('checkCapacidade','delete_atividade_all') && jmespath.search(arrayAtividadesList, "[*] | length(@)") > 0) {
            appendIconAtividade('delete');
        }
    }
    appendModulesIcons();
    callAtiv('setAtividadesProcessoHome',);
    if (loop) {
        setTimeout(function () {
            getInsertIconAtividade(false);
        }, 1500);
    }
}
export function appendModulesIcons() {
    var elementActions = $('#atividadesProActions');
    if ($($ifrVisualizacao).length == 0) {
        var i = 0;
        var iconLabel = localStorage.getItem('iconLabel');
        var iconBoxSlim = localStorage.getItem('seiSlim');
        var htmlModules = '<span class="modulesActions">';
        if (elementActions.length > 0) {
            if (callAtiv('checkCapacidade','view_afastamento')) {
                htmlModules += '<a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconAfastamento_view" data-tip="Afastamentos" data-act="atividades-call" data-fn="changePanelHome" style="font-size: 14pt;" data-value="Afastamento">' +
                    '   <i class="fas fa-luggage-cart cinzaColor"></i>' +
                    '   <span class="newIconTitle">Afastamentos</span>' +
                    '</a>';
                i = i + 1;
            }
            if (callAtiv('checkCapacidade','view_contato')) {
                htmlModules += '<a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconContato_view" data-tip="Contatos" data-act="atividades-call" data-fn="changePanelHome" style="font-size: 14pt;" data-value="Contato">' +
                    '   <i class="fas fa-id-card cinzaColor"></i>' +
                    '   <span class="newIconTitle">Contatos</span>' +
                    '</a>';
                i = i + 1;
            }
            if (callAtiv('checkCapacidade','view_relatorio')) {
                htmlModules += '<a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconRelatorio_view" data-tip="Relat\u00F3rios" data-act="atividades-call" data-fn="changePanelHome" style="font-size: 14pt;" data-value="Relatorio">' +
                    '   <i class="fas fa-chart-pie cinzaColor"></i>' +
                    '   <span class="newIconTitle">Relat\u00F3rios</span>' +
                    '</a>';
                i = i + 1;
            }
        }

        htmlModules += '<a class="newLink iconBoxModules ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconConfiguracao_view" data-tip="Configura\u00E7\u00F5es" data-act="' + (callAtiv('checkOptionEntidade','modal_configuracoes') ? 'atividades-config-modal' : 'atividades-panel-home') + '" style="font-size: 14pt;" data-value="Configuracao">' +
            '   <i class="fas fa-cog cinzaColor"></i>' +
            '   <span class="newIconTitle">Configura\u00E7\u00F5es</span>' +
            '</a>' +
            '</span>';

        elementActions.find('.modulesActions').remove();
        elementActions.append(htmlModules);
    }
}
export function appendIconAtividade(name = false) {
    var elementActions = ($($ifrVisualizacao).length > 0) ? $($ifrVisualizacao).contents() : $('#atividadesProActions');

    if (name && typeof __ !== 'undefined') {
        var htmlIconAtividade = '';
        if (name == 'save') {
            elementActions.find('.iconAtividade_' + name).remove();
            htmlIconAtividade = getHtmlIconAtividade({ name: name, title: __.Nova_Demanda, icon: 'fas fa-user-check', action: 'saveAtividade()' });
        } else if (name == 'start') {
            elementActions.find('.iconAtividade_' + name).remove();
            htmlIconAtividade = getHtmlIconAtividade({ name: name, title: 'Iniciar ' + __.Demanda + '', icon: 'fas fa-play-circle', action: 'selectAtividadeBox(\'start\')' });
        } else if (name == 'complete') {
            elementActions.find('.iconAtividade_' + name).remove();
            htmlIconAtividade = getHtmlIconAtividade({ name: name, title: 'Concluir ' + __.Demanda + '', icon: 'fas fa-check-circle', action: 'selectAtividadeBox(\'complete\')' });
        } else if (name == 'rate') {
            elementActions.find('.iconAtividade_' + name).remove();
            htmlIconAtividade = getHtmlIconAtividade({ name: name, title: 'Avaliar ' + __.Demanda + '', icon: 'fas fa-star', action: 'selectAtividadeBox(\'rate\')' });
        } else if (name == 'send') {
            elementActions.find('.iconAtividade_' + name).remove();
            htmlIconAtividade = getHtmlIconAtividade({ name: name, title: __.Arquivar + ' ' + __.Demandas + ' do Processo', icon: 'fas fa-archive', action: 'selectAtividadeBox(\'send\')' });
        } else if (name == 'delete') {
            elementActions.find('.iconAtividade_' + name).remove();
            htmlIconAtividade = getHtmlIconAtividade({ name: name, title: 'Excluir ' + __.Demanda + '', icon: 'fas fa-trash-alt', action: 'selectAtividadeBox(\'delete\')' });
        }
        if (htmlIconAtividade != '') {
            if ($($ifrVisualizacao).length > 0) {
                elementActions.find('#divArvoreAcoes').append(htmlIconAtividade);
            } else {
                elementActions.append(htmlIconAtividade);
            }
        }
    }
}
export function getHtmlIconAtividade(value) {
    var htmlBtn = '';
    var iconLabel = localStorage.getItem('iconLabel');
    var iconBoxSlim = localStorage.getItem('seiSlim');
    var inIframe = $($ifrVisualizacao).length > 0;
    var actAttrs = atividadesActionAttrs(value.action, { scope: inIframe ? 'parent' : '' });
    if (inIframe) {
        htmlBtn = '<a tabindex="451" class="botaoSEI iconBoxAtividade ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconAtividade_' + value.name + ' seipro-atividades-icon-box" ' + (iconLabel ? '' : 'data-tip="' + value.title + '"') + ' ' + actAttrs + ' style="position: relative;display: inline-block;">' +
            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="' + value.title + '">' +
            '    <span class="botaoSEI_iconBox">' +
            '       <i class="' + value.icon + ' fa-' + (!SeiPro.sei.adapter.isNewSEI() ? 'brancoColor' : 'azulColor') + '" style="font-size: 17pt;"></i>' +
            '    </span>' +
            (iconLabel ?
                '    <span class="newIconTitle">' + value.title + '</span>' +
                '' : '') +
            '</a>';
    } else {
        htmlBtn = '<a class="newLink iconBoxAtividade ' + (iconLabel ? 'iconLabel' : '') + ' ' + (iconBoxSlim ? 'iconBoxSlim' : '') + ' iconAtividade_' + value.name + ' seipro-atividades-icon-box" ' + actAttrs + ' title="' + value.title + '" ' + (iconLabel ? '' : 'data-tip="' + value.title + '"') + ' style="margin: 0; font-size: 14pt;">' +
            '       <span class="fa-layers fa-fw">' +
            '           <i class="' + value.icon + '"></i>' +
            '           <span class="fa-layers-counter" style="display: none;"></span>' +
            '       </span>' +
            (iconLabel ?
                '    <span class="newIconTitle">' + value.title + '</span>' +
                '' : '') +
            '</a>';
    }
    return htmlBtn;
}
export function initEmptyAtividades(reloadProfile = false) {
    // arrayAtividadesPro = [];
    initNameConst('get');
    callAtiv('setPanelAtividades',);
    if (reloadProfile) {
        initPerfilLoginAtiv();
    } else {
        $('#tabelaAtivPanel, #ganttAtivPanel').find('.dataFallback').addClass('dataLoading');
        $('.iconAtividade_update i').addClass('fa-spin');
    }
}
export function initAtividades(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof localStorageRestorePro !== 'undefined' && typeof checkLoadingButtonConfirm !== 'undefined' && typeof $().tabs !== 'undefined' && typeof moment().isoWeekdayCalc !== 'undefined') {
        urlServerAtiv = perfilLoginAtiv.URL_API;
        userHashAtiv = perfilLoginAtiv.KEY_USER;
        // Chart is scoped to the enabled Atividades feature; it is not loaded
        // by the global bootstrap on unrelated SEI pages.
        loadChartAtividades();
        if (typeof initPanelMonitorados !== 'undefined') initPanelMonitorados();
        initEmptyAtividades();
        getAtividades();
        if (typeof $.mask === 'undefined') $.getScript(URL_SPRO + "js/lib/jquery.maskedinput.min.js");
        if (typeof $().chosen === 'undefined') $.getScript(URL_SPRO + "js/lib/chosen.jquery.min.js");
        if (typeof moment !== 'undefined' && typeof moment().isoAddWeekdaysFromSet === 'undefined') $.getScript(URL_SPRO + "js/lib/moment-weekday-calc.js");
    } else {
        if (TimeOut == 9000 && typeof moment().isoWeekdayCalc === 'undefined') $.getScript(URL_SPRO + "js/lib/moment-weekday-calc.js");
        setTimeout(function () {
            initAtividades(TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initAtividades');
        }, 500);
    }
}
export function initPerfilLoginAtiv(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined' && typeof localStorageRestorePro !== 'undefined') {
        if (checkConfigValue('gerenciaratividades')) {
            setTimeout(function () {
                perfilLoginAtiv = localStorageRestorePro('configBasePro_atividades');
                perfilLoginAtiv = (typeof perfilLoginAtiv !== 'undefined' && perfilLoginAtiv !== null) ? perfilLoginAtiv : false;
                if (perfilLoginAtiv) {
                    initAtividades();
                }
            }, 500);
        }
    } else {
        setTimeout(function () {
            initPerfilLoginAtiv(TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initPerfilLogin', typeof localStorageRestorePro, typeof localStorageRestorePro('configBasePro_atividades'));
        }, 500);
    }
}

// Verifica dominios permitidos
export function getServersPro() {
    // Remote server check removed — this fork does not use seipro.app infrastructure.
    // Activities feature requires local configuration (configBasePro_atividades in localStorage).
}
/* 
export function getTokenGoogle(response = false) {
    var credential = (typeof window.googleUser !== 'undefined') 
                    ? (googleOneTap) 
                        ? window.googleUser.response.credential 
                        : window.googleUser
                    : false;
        credential = (sessionStorageRestorePro('googleUser') !== null) ? sessionStorageRestorePro('googleUser').response.credential : credential;
        credential = (response) ? response.credential : credential;
        credential = (typeof gapi !== 'undefined' && typeof gapi.auth2 !== 'undefined') ? gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token : false;
        credential = (typeof credential !== 'undefined') ? credential : false;
    return credential;
}
export function onLoad(TimeOut = 9000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (googleOneTap) {
        if (typeof google !== 'undefined' && typeof perfilLoginAtiv.CLIENT_ID !== 'undefined' && perfilLoginAtiv.CLIENT_ID !== '') {
            google.accounts.id.initialize({
                client_id: perfilLoginAtiv.CLIENT_ID,
                callback: onSignIn
            });
            google.accounts.id.prompt();
        } else {
            setTimeout(function(){ 
                onLoad(TimeOut - 100); 
                if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload onLoad => '+TimeOut); 
            }, 500);
        }
    } else {
        if (typeof gapi !== 'undefined') {
            gapi.load('auth2', function() {
                gapi.auth2.init();
                setTimeout(function () {
                    onSignIn();
                },500);
            });
        } else {
            setTimeout(function(){ 
                onLoad(TimeOut - 100); 
                if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload onLoad => '+TimeOut); 
            }, 500);
        }
    }
} */
export function getResumeAtiv() {
    var planoTrabalho = (typeof arrayConfigAtividades.planos !== 'undefined' && arrayConfigAtividades.planos !== null && arrayConfigAtividades.planos != 0 && arrayConfigAtividades.planos.length > 0) ? arrayConfigAtividades.planos : false;
    if (planoTrabalho) {
        var planoTrabalho = (callAtiv('checkCapacidade','only_self_atividades'))
            ? jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + arrayConfigAtividades.perfil.id_user + "`] | [0]")
            : jmespath.search(arrayConfigAtividades.planos, "{tempo_homologado: sum([*].tempo_homologado), tempo_proporcional: sum([*].tempo_proporcional)}");
        planoTrabalho = (planoTrabalho !== null) ? planoTrabalho : false;
        var execucaoPlano = (planoTrabalho)
            ? (planoTrabalho.tempo_homologado == 0)
                ? '0%'
                : ((planoTrabalho.tempo_homologado / planoTrabalho.tempo_proporcional) * 100).toFixed(2) + '%'
            : '-';
    } else {
        var execucaoPlano = '-';
    }
    var demandaResumo = (callAtiv('checkCapacidade','only_self_atividades'))
        ? jmespath.search(arrayAtividadesPro, "[?data_entrega=='0000-00-00 00:00:00'] | [?id_user==`" + arrayConfigAtividades.perfil.id_user + "`]")
        : arrayAtividadesPro;
    var demandasTotais = (typeof arrayAtividadesPro !== 'undefined' && arrayAtividadesPro !== null && arrayAtividadesPro.length > 0) ? demandaResumo.length : 0;
    var demandasIniciadas = (callAtiv('checkCapacidade','only_self_atividades'))
        ? jmespath.search(arrayAtividadesPro, "[?data_entrega=='0000-00-00 00:00:00'] | [?id_user==`" + arrayConfigAtividades.perfil.id_user + "`] | [?data_inicio!='0000-00-00 00:00:00'] | length(@)")
        : jmespath.search(arrayAtividadesPro, "[?data_entrega=='0000-00-00 00:00:00'] | [?data_inicio!='0000-00-00 00:00:00'] | length(@)");
    var demandasAtrasadas = 0;
    var demandasProdutividade = 0;
    if (demandasTotais > 0) {
        $.each(demandaResumo, function (i, v) {
            if (v.data_entrega == '0000-00-00 00:00:00' && moment(v.prazo_entrega, 'YYYY-MM-DD HH:mm:ss') < moment() && (typeof v.data_pausa === 'undefined' || v.data_pausa === null || v.data_pausa == '0000-00-00 00:00:00')) {
                demandasAtrasadas = demandasAtrasadas + 1;
            }
        });
        var demandasProdutividade = $.map(arrayAtividadesPro, function (v, i) {
            if (v.produtividade !== null) {
                return v.produtividade;
            }
        });
        demandasProdutividade = (demandasProdutividade.length > 0) ? avgArray(demandasProdutividade).toFixed(2) : 0;
    }
    return {
        totais: demandasTotais,
        iniciadas: demandasIniciadas,
        atrasadas: demandasAtrasadas,
        executado: execucaoPlano,
        produtividade: demandasProdutividade
    };
}
/* function getProfileAtiv(response = false) {
    var profile = (typeof window.googleUser !== 'undefined') 
                ? (googleOneTap) 
                    ? window.googleUser.decode 
                    : window.googleUser.getBasicProfile()
                : (googleOneTap) 
                    ? false
                    : (response) ? googleUser.getBasicProfile() : false;
        profile = (googleOneTap && sessionStorageRestorePro('googleUser') !== null) ? sessionStorageRestorePro('googleUser').decode : profile;
        profile = (response) 
                ? (googleOneTap) 
                    ? response.decode 
                    : googleUser.getBasicProfile()
                : profile;

    if (getTokenGoogle() && profile) {
            profile = (googleOneTap) ? profile : {name: profile.getName(), picture: profile.getImageUrl(), email: profile.getEmail()};
        var backgroundSEI = $('.infraCorBarraSistema').css('background-color');
            backgroundSEI = (typeof backgroundSEI !== 'undefined') ? rgbToHexString(backgroundSEI) : '#01a5da';
        var resumeAtiv = (typeof arrayAtividadesPro !== 'undefined' && arrayAtividadesPro !== null && arrayAtividadesPro.length > 0) ? getResumeAtiv() : false;
        var greetings = generateGreetings();
        var htmlProfile =   '<div id="profileProDiv">'+
                            '   <div id="profileProDiv_full" style="margin-top:20px;'+(getOptionsPro('profileProDiv') == 'hide' ? 'display:none;' : '')+'">'+
                            '      <div class="perfilWidgets" style="float: left;width: 30%;">'+
                            '          <img style="border-radius: 0% 50% 50% 50%;width: 96px;float: left;border: 6px solid '+backgroundSEI+';" src="'+profile.picture+'">'+
                            '          <div class="cardProfile" style="margin: 10px;display: inline-block;width: calc(100% - 130px);position:relative;">'+
                            '              <h2 style="margin: 10px 0;font-size: 2em;font-weight: bold;color: #363636;">'+
                            '                  '+greetings+', '+profile.name+
                            '                  <a class="newLink" id="profileProDiv_hideIcon" data-act="atividades-toggle-painel" data-target="profileProDiv" data-mode="hide" data-tip="Recolher Painel" style="font-size: 11pt;"><i class="fas fa-minus-square cinzaColor"></i></a>'+
                            '              </h2>'+
                            '              <h2 style="margin: 10px 0;font-size: 1.5em;color: #363636;">'+moment().format('LL')+'</h2>'+
                            '              <a class="newLink" data-act="atividades-call" data-fn="signOutProfile" data-pass-el="0" id="ssoLoginConfig" style="position: absolute;right: 0;font-size: 12pt;'+(getTokenGoogle() ? '' : 'display:none;')+'" data-tip="Desconectar">'+
                            '                  <i class="iconPopup fas fa-sign-out-alt cinzaColor" style="height: auto;"></i>'+
                            '              </a>'+
                            '          </div>'+
                            (resumeAtiv ? 
                            '          <div class="boardDemandas" style="clear: both;width: 100%;font-size: 9pt;color: #878787;">'+
                            '              <div style="width: 40%;float: left;padding: 10px;margin: 10px 5px;text-align: center;">'+
                            '                  <span class="count" style="font-size: 20pt;display: block;"><i class="fas fa-clipboard-list cinzaColor" style="color: #878787;margin-right: 10px;"></i>'+resumeAtiv.iniciadas+'/'+resumeAtiv.totais+'</span> demandas em andamento '+(!checkCapacidade('only_self_atividades') ? '<br>na unidade' : '')+
                            '              </div>'+
                            '              <div style="width: 40%;float: left;padding: 10px;margin: 10px 5px;text-align: center;">'+
                            '                  <span class="count" style="font-size: 20pt;display: block;"><i class="fas fa-exclamation-triangle '+(resumeAtiv.atrasadas == 0 ? 'cinzaColor' : 'vermelhoColor')+'" style="color: #878787;margin-right: 10px;"></i>'+resumeAtiv.atrasadas+'</span> demandas em atraso '+(!checkCapacidade('only_self_atividades') ? '<br>na unidade' : '')+
                            '              </div>'+
                            '              <div style="width: 40%;float: left;padding: 10px;margin: 10px 5px;text-align: center;">'+
                            '                  <span class="count" style="font-size: 20pt;display: block;"><i class="fas fa-handshake cinzaColor" style="color: #878787;margin-right: 10px;"></i>'+resumeAtiv.executado+'</span> de execu\u00E7\u00E3o '+(!checkCapacidade('only_self_atividades') ? 'dos planos <br>da unidade' : 'do plano')+
                            '              </div>'+
                            '              <div style="width: 40%;float: left;padding: 10px;margin: 10px 5px;text-align: center;">'+
                            '                  <span class="count" style="font-size: 20pt;display: block;"><i class="fas fa-chart-line cinzaColor" style="color: #878787;margin-right: 10px;"></i>'+resumeAtiv.produtividade+'%</span> de produtividade m\u00E9dia '+(!checkCapacidade('only_self_atividades') ? '<br>na unidade' : '')+
                            '              </div>'+
                            '          </div>'+
                            '' : '')+
                            '      </div>'+
                            '      <div class="calendarWidgets" style="float: right;width: 70%;margin-bottom: 20px;">'+
                            '          <iframe id="googleCalendar" src="https://calendar.google.com/calendar/embed?src='+decodeURIComponent(profile.email)+'&ctz=America%2FSao_Paulo&showTitle=0" style="border: 0" width="98%" height="300" frameborder="0" scrolling="no"></iframe>'+
                            '      </div>'+
                            '   </div>'+
                            '   <div id="profileProDiv_min" style="'+(getOptionsPro('profileProDiv') == 'hide' ? '' : 'display:none;')+'">'+
                            '      <h2 style="margin: 10px 0;font-size: 2em;font-weight: bold;color: #363636;">'+
                            '          <i class="profileProcPro fas fa-user-circle cinzaColor" style="margin: 0 10px 0 0; font-size: 1.1em;"></i>'+
                            '          '+greetings+', '+profile.name+
                            '          <a class="newLink" id="profileProDiv_showIcon" data-act="atividades-toggle-painel" data-target="profileProDiv" data-mode="show" data-tip="Mostrar Painel" style="font-size: 11pt;"><i class="fas fa-plus-square cinzaColor"></i></a>'+
                            '      </h2>'+
                            '   </div>'+
                            '</div>';

        $('#profileProDiv').remove();
        $('#divInfraAreaTelaD').prepend(htmlProfile);
    }
}
export function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
export function onSignIn(response) {
    if (googleOneTap) {
        const responsePayload = parseJwt(response.credential);
        var googleUser = {response: response, decode: responsePayload};
            window.googleUser = googleUser;
            sessionStorageStorePro('googleUser', googleUser);
    } else {
        window.googleUser = response;
    }
    if (getTokenGoogle(response)) {
        getAtividades();
        // initProfileAtiv(googleUser);
        $('#tabelaAtivPanel').html('<div class="dataFallback dataLoading" data-text="Nenhum dado dispon\u00EDvel"></div>');
    }
    // $('#ssoLoginConfig').show();
}
export function initProfileAtiv(googleUser, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof arrayConfigAtividades.perfil !== 'undefined' && typeof arrayConfigAtividades.perfil.id_user !== 'undefined' ) { 
        getProfileAtiv(googleUser);
    } else {
        setTimeout(function(){ 
            initProfileAtiv(googleUser, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload getProfileAtiv'); 
        }, 500);
    }
} */
export function cleanAtivParams(initAtiv = true, reloadProfile = false) {
    localStorageRemovePro('configDataAtividadesPro');
    localStorageRemovePro('configDataAtividadesProcPro');
    localStorageRemovePro('configDataAtividadesPadraoPro');
    // sessionStorageRemovePro('googleUser');
    removeOptionsPro('panelHomeView');
    removeOptionsPro('panelAtividadesView');
    removeOptionsPro('selectReport_planos');
    removeOptionsPro('selectReport_demandas');
    perfilLoginAtiv = false;
    urlServerAtiv = false;
    userHashAtiv = '';
    arrayAtividadesPro = [];
    arrayAtividadesProcPro = [];
    arrayConfigAtividades = [];
    // window.googleUser = undefined;
    infraTooltipOcultar();
    $('#atividadesPro').remove();
    $('#profileProDiv').remove();
    if (initAtiv) {
        initEmptyAtividades(reloadProfile);
    }
}
/* function signOutProfile() {
    if (googleOneTap) {
        if (typeof google !== 'undefined') {
            google.accounts.id.revoke(window.googleUser.decode.sub, done => {
                console.log('User signed out.');
                cleanAtivParams(true, true);
            });
        } else {
            cleanAtivParams(true, true);
        }
    } else {
        var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
                cleanAtivParams(true, true);
            });
    }
    resetDialogBoxPro('configBoxPro');
} */
export function getUpdateAPI(indexAPIUpdate = 0, offset = 0, total_offset = 0) {
    if (listAPIUpdate[indexAPIUpdate] && !stopUpdateApi) {
        var action = 'sync_' + listAPIUpdate[indexAPIUpdate];
        var param = {
            action: action,
            host: url_host.replace('controlador.php', ''),
            hash: userHashAtiv,
            offset: offset,
            total_offset: total_offset
        };
        $.ajax({
            type: "POST",
            url: urlServerAtiv,
            dataType: "json",
            data: param,
            success: function (result) {
                if (result) {
                    if (result.next_offset) getUpdateAPI(indexAPIUpdate, result.next_offset, result.total_offset);
                    if (result.total_offset) {
                        $('#progressLoopReports').progressbar({ value: offset, max: result.total_offset });
                        $('#countLoopReports').text(nameAPIUpdate[indexAPIUpdate] + ' (' + offset + '/' + result.total_offset + ')');
                    }
                    if (result.log_error && result.log_error.length) {
                        var logError = $("<div/>").html(JSON.stringify(result.log_error, null, "\t")).text();
                        logError = (logError) ? logError.trim() : '';
                        logError = logError + '\n\n';
                        $('.errorReport').show().prepend(logError);
                    }
                    if (result.end) {
                        indexAPIUpdate++;
                        if (indexAPIUpdate <= listAPIUpdate.length - 1) {
                            getUpdateAPI(indexAPIUpdate);
                        } else {
                            loadingButtonConfirm(false);
                            resetDialogBoxPro('alertBoxPro');
                            indexAPIUpdate = 0;
                            sessionStorage.setItem('checkedUpdateDataAPI', true);
                            $(window).unbind('beforeunload');
                        }
                    }
                }
            }
        }).fail(function (data, textStatus) {
            callAtiv('failureScreen',data, textStatus, param);
        });
    }
}
export function initUpdateAPI() {
    if (callAtiv('checkOptionEntidade','sincronizar_dados_api')) {
        $('#progressLoopReports').progressbar({
            value: 0,
            max: 1000
        });

        alertaBoxPro('Sucess', 'check-circle', 'Aguarde... Sincronizando API de <span id="countLoopReports"></span> <div class="info_checklist" style="height:20px"><div id="progressLoopReports" class="checklist_progress" style="float:none; width:95%"></div></div><pre class="errorReport" style="display:none"></pre>');
        loadingButtonConfirm(true);
        setTimeout(() => {
            if (delayServerAtiv == 0) {
                delayServerAtiv = 1; setTimeout(function () { delayServerAtiv = 0; }, 3000);
                getUpdateAPI();
                alertBoxPro.dialog('option', 'buttons', [{
                    text: "Cancelar",
                    click: function () {
                        $(this).dialog('close');
                        stopUpdateApi = true;
                        setTimeout(() => { stopUpdateApi = false; }, 10000);
                    }
                }, {
                    text: "OK",
                    class: "confirm",
                    click: function () {
                        $(this).dialog('close');
                        if (typeof func_ok === 'function') func_ok();
                    }
                }]);
                loadingButtonConfirm(true);
            }
        }, 1000);

    }
}
export function checkSyncAPI() {
    if (!sessionStorage.getItem('checkedUpdateDataAPI') || sessionStorage.getItem('checkedUpdateDataAPI') != 'true') {
        var recorrencia_time_dados_api = callAtiv('getOptionEntidade','recorrencia_time_dados_api');
        var recorrencia_value_dados_api = callAtiv('getOptionEntidade','recorrencia_value_dados_api');
        var action = 'sync_last_update_dados_api';
        var param = {
            action: action,
            host: url_host.replace('controlador.php', ''),
            hash: userHashAtiv
        };
        $.ajax({
            type: "POST",
            url: urlServerAtiv,
            dataType: "json",
            data: param,
            success: function (data) {
                if (data.status == 1) {
                    if (moment(data.last_update_dados_api, 'YYYY-MM-DD HH:mm:ss').add(recorrencia_value_dados_api, recorrencia_time_dados_api) < moment()) {
                        initUpdateAPI();
                        sessionStorage.setItem('checkedUpdateDataAPI', true);
                        $(window).bind("beforeunload", function () {
                            return confirm("Tem certeza que deseja fechar a janela?");
                        });
                    }
                } else if (data.status == 0) {
                    indexReportUpdate = 0;
                    sessionStorage.setItem('checkedUpdateDataAPI', true);
                }
            }
        }).fail(function (data, textStatus) {
            callAtiv('failureScreen',data, textStatus, param);
        });
    }
}

export function getUpdateReports(url) {
    if (typeof url !== 'undefined') {
        $.get(url, function (data) {
            if (data.status == 1) {
                getUpdateReports(data.redirect);
                $('#progressLoopReports').progressbar({ value: data.pg, max: data.total_pg });
                $('#countLoopReports').text(nameReportsUpdate[indexReportUpdate] + ' (' + data.pg + '/' + data.total_pg + ')');
            } else if (data.status == 2) {
                indexReportUpdate++;
                if (indexReportUpdate <= listReportsUpdate.length - 1) {
                    $('#progressLoopReports').progressbar({ value: 0, max: 1000 });
                    $('#countLoopReports').text(nameReportsUpdate[indexReportUpdate]);
                    getUpdateReports(urlServerAtiv + 'report.php?action=' + listReportsUpdate[indexReportUpdate] + '&output=save');
                } else {
                    if (callAtiv('checkOptionEntidade','sincronizar_dados_externos') && callAtiv('checkPerfilNivelAdm',)) {
                        setSyncDadoExterno();
                    } else {
                        loadingButtonConfirm(false);
                        resetDialogBoxPro('alertBoxPro');
                        indexReportUpdate = 0;
                        sessionStorage.setItem('checkedUpdateData', true);
                        $(window).unbind('beforeunload');
                    }
                }
            }
        });
    }
}
export function checkUpdateReports() {
    if (!sessionStorage.getItem('checkedUpdateData') || sessionStorage.getItem('checkedUpdateData') != 'true') {
        var url = urlServerAtiv + 'report.php?action=' + listReportsUpdate[indexReportUpdate] + '&output=check';
        $.get(url, function (data) {
            if ((data.status == 1 || data.status == 2) && $('#countLoopReports').length == 0) {
                initUpdateReports();
                sessionStorage.setItem('checkedUpdateData', true);
                $(window).bind("beforeunload", function () {
                    return confirm("Tem certeza que deseja fechar a janela?");
                });
            } else if (data.status == 0) {
                indexReportUpdate++;
                if (indexReportUpdate <= listReportsUpdate.length - 1) {
                    checkUpdateReports();
                } else {
                    indexReportUpdate = 0;
                    sessionStorage.setItem('checkedUpdateData', true);
                }
            }
        });
    }
}
export function checkSyncDadoExterno() {
    if (!sessionStorage.getItem('checkedUpdateData') || sessionStorage.getItem('checkedUpdateData') != 'true') {
        var url = urlServerAtiv + 'report.php?action=sync_data&output=sync_data';
        $.get(url, function (data) {
            if (data.status == 1) {
                if (moment(data.last_datetime, 'YYYY-MM-DD HH:mm:ss').add(1, 'day') < moment()) {
                    setSyncDadoExterno();
                    sessionStorage.setItem('checkedUpdateData', true);
                    $(window).bind("beforeunload", function () {
                        return confirm("Tem certeza que deseja fechar a janela?");
                    });
                }
            } else if (data.status == 0) {
                indexReportUpdate = 0;
                sessionStorage.setItem('checkedUpdateData', true);
            }
        });
    }
}
export function setSyncDadoExterno(this_ = false) {
    if (callAtiv('getOptionEntidade','sincronizar_dados_externos')) {

        if (this_) {
            $(this_).find('i').addClass('fa-spinner').toggleClass('fa-cogs fa-spin');
        } else {
            $('#progressLoopReports').progressbar({ value: 0, max: 1000 });
            alertaBoxPro('Sucess', 'check-circle', 'Aguarde... Sincronizando dados externos de <span id="countLoopReports"></span> <div class="info_checklist" style="height:20px"><div id="progressLoopReports" class="checklist_progress" style="float:none; width:95%"></div></div>');
            loadingButtonConfirm(true);
        }

        var actions = callAtiv('getOptionEntidade','acoes_dados_externos').split(',');

        function getAjaxRotinas(index) {
            var act = typeof actions[index] !== 'undefined' ? actions[index].trim() : false;
            if (this_) $(this_).find('.info').text(' (' + act + ')');

            if (index <= actions.length - 1) {
                if (!this_) {
                    var i_value = (index + 1);
                    $('#progressLoopReports').progressbar({ value: i_value, max: actions.length });
                    $('#countLoopReports').text('(' + i_value + '/' + actions.length + '): ' + act);
                }
                $.ajax({
                    type: "POST",
                    url: urlServerAtiv + 'sync/',
                    dataType: "json",
                    data: { action: act },
                    success: function (data) {
                        getAjaxRotinas(index + 1);
                    }
                });
            } else {
                indexReportUpdate = 0;
                sessionStorage.setItem('checkedUpdateData', true);
                if (this_) {
                    $(this_).find('i').removeClass('fa-spinner').toggleClass('fa-cogs fa-spin');
                    $(this_).find('.info').text('');
                } else {
                    loadingButtonConfirm(false);
                    resetDialogBoxPro('alertBoxPro');
                    $(window).unbind('beforeunload');
                }
            }
        }
        getAjaxRotinas(0);
    }
}
export function initUpdateReports() {
    $('#progressLoopReports').progressbar({
        value: 0,
        max: 1000
    });

    alertaBoxPro('Sucess', 'check-circle', 'Aguarde... Atualizando relat\u00F3rios de <span id="countLoopReports"></span> <div class="info_checklist" style="height:20px"><div id="progressLoopReports" class="checklist_progress" style="float:none; width:95%"></div></div>');
    loadingButtonConfirm(true);
    getUpdateReports(urlServerAtiv + 'report.php?action=' + listReportsUpdate[indexReportUpdate] + '&output=save');
}
export function setTipoPrescricaoProcesso() {
    var listPresc = checkTipoPrescricaoProcesso();
    if (listPresc) {
        appendIconCtrPrescricao();
    }
}

// INICIA PAINEL DE PRESCRICAO
export function initPanelPrescricaoProc(TimeOut = 9000) {
    if (TimeOut <= 0 || !arrayPrescricoesProcPro) { return; }
    if (typeof localStorageRestorePro !== 'undefined') {
        if ($('#ifrArvore').length > 0 && arrayPrescricoesProcPro.length > 0) {
            var ifrArvoreElem = (typeof getIframeArvoreElement === 'function') ? getIframeArvoreElement() : $('#ifrArvore')[0];
            if (ifrArvoreElem && ifrArvoreElem.contentWindow) ifrArvoreElem.contentWindow.initPanelPrescricaoProcesso();
        }
    } else {
        setTimeout(function () {
            initPanelPrescricaoProc(TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initPanelPrescricaoProc');
        }, 500);
    }
}
export function checkUnidadeFuncBeta() {
    var checkUnidades = (callAtiv('getOptionEntidade','unidades')) ? jmespath.search(callAtiv('getOptionEntidade','unidades'), "[?id_unidade==`" + arrayConfigAtivUnidade.id_unidade + "`]") : null;
    checkUnidades = (checkUnidades !== null && checkUnidades.length) ? true : false;
    return checkUnidades;
}
export function checkHostPermission(TimeOut = 9000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof getConfigHost === 'function') {
        if (sessionStorage.getItem('configHost_Pro') !== null) {
            setConfigHost(JSON.parse(sessionStorage.getItem('configHost_Pro')), initPerfilLoginAtiv, false);
        } else {
            getConfigHost(initPerfilLoginAtiv, false);
        }
    } else {
        setTimeout(function () {
            checkHostPermission(TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload checkHostPermission => ' + TimeOut);
        }, 500);
    }
}
