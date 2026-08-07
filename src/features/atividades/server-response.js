/**
 * Legacy Atividades response adapter.
 *
 * Network authorization and transport stay in server.js. This module owns
 * only the compatibility side effects required by the old SEI UI.
 */
import { callAtiv } from './call.js';
import { classifyAtividadesResponse } from './response.js';
import { selectProjetosFeatureTab, syncProjetosFeatureFromAtividades } from './compat.js';
import { getNameGenre } from '../../shared/nomenclatura.js';

export function routeAtividadesResponse(requestPromise, param, mode, env = {}) {
    const context = env.context;
    const page = env.page || {};
    const ports = env.ports || {};
    const deps = env.deps || {};
    const request = env.request || (() => undefined);
    const state = context.store.get();
    const jmespath = deps.jmespath || page.jmespath || globalThis.jmespath || { search: () => [] };
    const __ = deps.nomenclature || page.__ || {};
    const dialogBoxPro = deps.dialogBoxPro || page.dialogBoxPro;
    const alertBoxPro = deps.alertBoxPro || page.alertBoxPro;
    const resetDialogBoxPro = deps.resetDialogBoxPro || page.resetDialogBoxPro || (() => undefined);
    const decimalHourToMinute = deps.decimalHourToMinute || page.decimalHourToMinute || ((value) => value);
    const checkFileRemoteMonitorado = deps.checkFileRemoteMonitorado || page.checkFileRemoteMonitorado || (() => undefined);
    const restoreMonitoradoServer = deps.restoreMonitoradoServer || page.restoreMonitoradoServer || (() => undefined);
    const {
        loadingButtonConfirm: loadingButtonConfirmPort,
        alertaBoxPro: alertaBoxProPort,
        confirmaBoxPro: confirmaBoxProPort,
        setOptionsPro: setOptionsProPort,
        localStorageStorePro: localStorageStoreProPort,
        hybridStorageStorePro: hybridStorageStoreProPort,
        signOutProfile: signOutProfilePort,
        url_host: urlHostPort,
        userSEI: userSeiPort
    } = ports;
    const loadingButtonConfirm = typeof loadingButtonConfirmPort === 'function' ? loadingButtonConfirmPort : () => undefined;
    const alertaBoxPro = typeof alertaBoxProPort === 'function' ? alertaBoxProPort : () => undefined;
    const confirmaBoxPro = typeof confirmaBoxProPort === 'function' ? confirmaBoxProPort : () => undefined;
    const setOptionsPro = typeof setOptionsProPort === 'function' ? setOptionsProPort : () => undefined;
    const localStorageStorePro = typeof localStorageStoreProPort === 'function' ? localStorageStoreProPort : () => undefined;
    const hybridStorageStorePro = typeof hybridStorageStoreProPort === 'function' ? hybridStorageStoreProPort : () => undefined;
    const signOutProfile = typeof signOutProfilePort === 'function' ? signOutProfilePort : () => undefined;
    const url_host = urlHostPort || '';
    const userSEI = userSeiPort || '';
    const $ = page.$;
    const moment = page.moment;
    const getOptionsPro = context.options.get;
    const sessionStorageStorePro = typeof page.sessionStorageStorePro === 'function'
        ? page.sessionStorageStorePro
        : () => undefined;
    const sessionStorageRestorePro = typeof page.sessionStorageRestorePro === 'function'
        ? page.sessionStorageRestorePro
        : () => null;
    const documentRef = context.dom && context.dom.document;
    const windowRef = page;
    let perfilLoginAtiv = state.perfilLoginAtiv;
    let arrayAtividadesPro = state.arrayAtividadesPro;
    let arrayAtividadesProcPro = state.arrayAtividadesProcPro;
    let arrayConfigAtividades = state.arrayConfigAtividades;
    let arrayConfigAtivUnidade = state.arrayConfigAtivUnidade;
    let backendServerAtiv = page.backendServerAtiv;
    let indexReportUpdate = page.indexReportUpdate || 0;
    let indexAPIUpdate = page.indexAPIUpdate || 0;

    return requestPromise.then(function (ativData) {
                // Publish a normalized event before the compatibility router
                // applies page-specific effects. New views can subscribe to
                // this contract without importing this legacy-sized module.
                context.events.emit('seipro:atividades-response', classifyAtividadesResponse(ativData, param, mode));
                if (typeof deps.onResponse === 'function') {
                    return deps.onResponse(ativData, param, mode, context);
                }
                if (ativData.status == 0 || ativData.length == 0) {
                    loadingButtonConfirm(false);
                    callAtiv('loadingTagConfig',param.type, 'set');

                    if (typeof ativData.replace_server !== 'undefined' && ativData.replace_server != '') {
                        var urlReplace = url_host.replace('controlador.php', '') + '?#&acao_pro=change_database&base=atividades&url=' + ativData.replace_server;
                        if (windowRef.location) windowRef.location.href = urlReplace;
                    }
                    if (mode.indexOf('config_update_') !== -1 || mode.indexOf('config_new_') !== -1) {
                        callAtiv('updateServerTabConfig',ativData, param);
                    } else if (mode != 'panel') {
                        alertaBoxPro('Error', 'exclamation-triangle', (typeof ativData.status_txt != 'undefined' ? ativData.status_txt : 'Erro ao enviar sua informa\u00E7\u00F5es.'));
                        if (mode == 'update_prioridades') {
                            callAtiv('updatePriorityKanbanItens',ativData['board'], 'error');
                        }
                    } else if (typeof ativData.status_acess !== 'undefined' && ativData.status_acess == 0) {
                        alertaBoxPro('Error', 'exclamation-triangle', (typeof ativData.status_txt != 'undefined' ? ativData.status_txt : 'Erro ao acessar o sistema. Acesso Negado.'));
                        if (typeof perfilLoginAtiv.CLIENT_ID !== 'undefined' && perfilLoginAtiv.CLIENT_ID != '') {
                            signOutProfile();
                        } else {
                            callAtiv('cleanAtivParams',);
                        }
                    } else {
                        callAtiv('initPanelAtividades',arrayAtividadesPro);
                    }

                } else {

                    if (typeof ativData.padrao !== 'undefined' && typeof ativData.padrao.perfil !== 'undefined' && ativData.padrao.perfil.login.toLowerCase() != userSEI.toLowerCase()) {
                        confirmaBoxPro('A chave de acesso ao sistema de ' + __.atividades + ' (' + ativData.padrao.perfil.login + ') \u00E9 diferente do login do SEI (' + userSEI + '). <br><br>Deseja solicitar o envio de nova chave de acesso?', function () { callAtiv('configResendKey',userSEI) }, 'Solicitar chave de acesso...');
                        if (typeof perfilLoginAtiv.CLIENT_ID !== 'undefined' && perfilLoginAtiv.CLIENT_ID != '') {
                            signOutProfile();
                        } else {
                            callAtiv('cleanAtivParams',);
                        }
                    } else {
                        if (mode == 'panel' && param.action == 'demandas' && param.perfil == '' && ativData.demandas.length == 0 && ativData.padrao.perfil.unidade != '') {
                            setOptionsPro('perfilAtividadesSelected', ativData.padrao.perfil.unidade);
                            request(param, mode);
                        } else if (mode.indexOf('chart_') !== -1) {
                            if (mode == 'chart_produtividade_mensal') {
                                callAtiv('getChartProdutividadeMes',param.id_plano, 'set', ativData);
                                callAtiv('updateServerTabConfig',ativData, param);
                                if (dialogBoxPro) dialogBoxPro.dialog({ title: callAtiv('getTitleChartPlano',param.id_plano).title });
                            } else {
                                callAtiv('setChartAtividades',ativData['chart'], mode);
                            }
                        } else if (mode == 'check_monitorados') {
                            checkFileRemoteMonitorado('set', ativData);
                        } else if (mode == 'check_entregas_atividades') {
                            callAtiv('checkTempoPlanoEntrega',false, 'set', ativData);
                            loadingButtonConfirm(false);
                        } else if (mode == 'get_monitorados') {
                            restoreMonitoradoServer(ativData['config']);
                        } else if (mode == 'set_monitorados') {
                            loadingButtonConfirm(false);
                        } else if (mode == 'view_documento') {
                            loadingButtonConfirm(false);
                            if (param.reference == 'modelo') {
                                callAtiv('openModelConfigItem',ativData, param);
                            }
                        } else if (mode == 'edit_tempos') {
                            callAtiv('updateServerTemposDemanda','reset', param.mode, false, ativData, param);
                            $('.update_tempos_demanda').removeClass('fa-spin');
                        } else if (mode == 'edit_documento') {
                            loadingButtonConfirm(false);
                            if (param.reference == 'modelo') {
                                resetDialogBoxPro('editorBoxPro');
                                alertaBoxPro('Sucess', 'check-circle', param.title + ' salvo com sucesso!');
                            }
                        } else if (mode == 'restory_atividade') {
                            $('#tableRelatorio_demandas_excluidas').find('tr[data-id="' + param.id_demanda + '"]').remove();
                            callAtiv('updateAtividade_',false);
                        } else if (mode == 'report_errors') {
                            loadingButtonConfirm(false);
                            $('.panelHome').find('.iconAtividade_update i').removeClass('fa-spin');
                            $('.alertaErrorPro .sendReport').find('i').attr('class', 'fas fa-thumbs-up azulColor').end().find('.labelLink').text('Notifica\u00E7\u00E3o enviada!');
                            alertaBoxPro('Sucess', 'check-circle', 'Notifica\u00E7\u00E3o enviada com sucesso!');
                        } else if (mode.indexOf('report_') !== -1) {
                            callAtiv('updateServerTabReport',ativData, param);
                            if (mode == 'report_demandas' && param.id_plano != 0) callAtiv('updateServerTabConfig',ativData, param);
                            if (mode == 'report_afastamentos' && param.id_plano != 0) {
                                if (typeof ativData.result !== 'undefined' && ativData.result !== null && ativData.result.length > 0) {
                                    $.each(ativData.result, function (i, v) {
                                        var objIndexAtiv = (typeof arrayConfigAtividades.afastamentos === 'undefined' || arrayConfigAtividades.afastamentos == 0 || arrayConfigAtividades.afastamentos.length == 0 || typeof arrayConfigAtividades.afastamentos.lista === 'undefined' || arrayConfigAtividades.afastamentos.lista == 0 || arrayConfigAtividades.afastamentos.lista.length == 0) ? -1 : arrayConfigAtividades.afastamentos.lista.findIndex((obj => obj.id_afastamento == v.id_afastamento));
                                        if (objIndexAtiv !== -1) {
                                            arrayConfigAtividades.afastamentos.lista[objIndexAtiv] = v;
                                        } else {
                                            arrayConfigAtividades.afastamentos.lista.push(v);
                                        }
                                    });
                                }
                                callAtiv('getRelatorioMetaProporcional',param.id_plano, true);
                            }
                        } else if (mode == 'config_update_user_personal') {
                            $('#tabs-configpessoal').find('tr td:first-child').removeClass('editCellLoading');
                        } else if (mode.indexOf('config_update_') !== -1 || mode == 'rate_plano' || mode == 'rate_cancel_plano' || mode == 'rate_programa' || mode == 'rate_cancel_programa' || mode == 'appeal_avaliacoes' || mode == 'appeal_extend_avaliacoes' || (mode.indexOf('config_new_') !== -1 && mode != 'config_new_users')) {
                            callAtiv('updateServerTabConfig',ativData, param);
                            if (mode == 'config_update_planos' && param.mode == 'homologacao') {
                                loadingButtonConfirm(false);
                                resetDialogBoxPro('dialogBoxPro');
                                callAtiv('updateAtividade',);
                                alertaBoxPro('Sucess', 'check-circle', 'Justificativa cadastrada com sucesso!');
                            } else if (mode == 'rate_plano' || mode == 'rate_cancel_plano') {
                                loadingButtonConfirm(false);
                                resetDialogBoxPro('dialogBoxPro');
                                alertaBoxPro('Sucess', 'check-circle', 'Avalia\u00E7\u00E3o de plano ' + (mode == 'rate_plano' ? 'cadastrada' : 'cancelada') + ' com sucesso!');
                            } else if (mode == 'config_update_planos' && param.mode == 'postpone') {
                                loadingButtonConfirm(false);
                                resetDialogBoxPro('dialogBoxPro');
                                alertaBoxPro('Sucess', 'check-circle', 'Data de in\u00EDcio de vig\u00EAncia postergada com sucesso!');
                                if (typeof ativData.refresh_page !== 'undefined' && ativData.refresh_page && $('#tableConfiguracoesPanel_planos').is(':visible')) {
                                    callAtiv('getTabConfig','planos', 'get');
                                }
                            } else if (mode == 'config_update_self_planos_entregas') {
                                loadingButtonConfirm(false);
                                resetDialogBoxPro('dialogBoxPro');
                                alertaBoxPro('Sucess', 'check-circle', 'Entregas do plano cadastradas com sucesso!');
                            } else if (mode == 'rate_programa' || mode == 'rate_cancel_programa') {
                                loadingButtonConfirm(false);
                                resetDialogBoxPro('dialogBoxPro');
                                alertaBoxPro('Sucess', 'check-circle', 'Avalia\u00E7\u00E3o de ' + __.programa + ' ' + (mode == 'rate_programa' ? 'cadastrada' : 'cancelada') + ' com sucesso!');
                            } else if (mode == 'appeal_avaliacoes') {
                                loadingButtonConfirm(false);
                                resetDialogBoxPro('dialogBoxPro');
                                alertaBoxPro('Sucess', 'check-circle', 'Recurso de plano cadastrado com sucesso!');
                            } else if (mode == 'appeal_extend_avaliacoes') {
                                loadingButtonConfirm(false);
                                resetDialogBoxPro('dialogBoxPro');
                                alertaBoxPro('Sucess', 'check-circle', 'Prazo para apresenta\u00E7\u00E3o de recurso alterado com sucesso!');
                            } else if (mode == 'config_new_planos' && param.mode == 'new') {
                                resetDialogBoxPro('dialogBoxPro');
                                alertaBoxPro('Sucess', 'check-circle', 'Plano de trabalho cadastrado com sucesso!');
                            } else if (mode == 'config_update_tipos_capacidades' && param.mode == 'update') {
                                callAtiv('updateConfigPerfilCapacidade',param, ativData);
                            }

                            if (typeof ativData['padrao'] !== 'undefined' && ativData['padrao'] !== null) {
                                if (typeof ativData['padrao']['termos'] !== 'undefined' && ativData['padrao']['termos'].length) arrayConfigAtividades['termos'] = ativData['padrao']['termos'];
                            }
                        } else if (mode == 'view_contato') {
                            callAtiv('setTableContatoPanel',ativData['result']);
                            sessionStorageStorePro('configDataContatosArray', ativData['result']);
                        } else if (mode == 'history_atividade') {
                            callAtiv('historyAtividade',false, 'set', ativData['result']);
                        } else if (mode == 'update_checklist') {
                            callAtiv('checklistUpdate',false, 'update', ativData, param);
                        } else if (mode.indexOf('_prescricao') !== -1) {
                            if (mode == 'update_prescricao' || mode == 'delete_prescricao') {
                                var txtAlert = (mode == 'update_prescricao' && param.id_prescricao > 0) ? 'editada' : 'inserida';
                                txtAlert = (mode == 'delete_prescricao') ? 'deletada' : txtAlert;
                                loadingButtonConfirm(false);
                                resetDialogBoxPro('dialogBoxPro');
                                alertaBoxPro('Sucess', 'check-circle', __.Prescricao + ' ' + txtAlert + ' com sucesso!');
                                if (typeof ativData.return_row !== 'undefined' && ativData.return_row.length) {
                                    arrayPrescricoesProcPro = ativData['return_row'];
                                    callAtiv('initPanelPrescricaoProc',);
                                }
                            }
                        } else if (mode.indexOf('_projeto') !== -1) {
                            if (mode == 'delete_projeto' && typeof ativData.return_row !== 'undefined' && ativData.return_row.length) {
                                arrayConfigAtividades.projetos = ativData.return_row;
                                var txtAlert = (mode == 'delete_projeto') ? 'Projeto deletado' : txtAlert;
                            } else if ((mode == 'save_projeto' || mode == 'clone_projeto') && typeof ativData.return_row !== 'undefined' && ativData.return_row.length) {
                                arrayConfigAtividades.projetos.push(ativData.return_row[0]);
                                var txtAlert = (mode == 'save_projeto') ? 'Projeto adicionado' : '';
                                txtAlert = (mode == 'clone_projeto') ? 'Projeto duplicado' : txtAlert;
                                txtAlert = (mode == 'delete_projeto') ? 'Projeto deletado' : txtAlert;
                            } else if ((mode == 'edit_projeto' || mode == 'save_projeto_etapa' || mode == 'edit_projeto_etapa' || mode == 'delete_projeto_etapa' || mode == 'update_projeto_etapa' || mode == 'archive_projeto' || mode == 'share_projeto') && typeof ativData.return_row !== 'undefined' && ativData.return_row.length) {
                                objIndexAtiv = (typeof arrayConfigAtividades.projetos === 'undefined' || arrayConfigAtividades.projetos == 0 || arrayConfigAtividades.projetos.length == 0) ? -1 : arrayConfigAtividades.projetos.findIndex((obj => obj.id_projeto == ativData.id_projeto));
                                if (objIndexAtiv !== -1) {
                                    arrayConfigAtividades.projetos[objIndexAtiv] = ativData.return_row[0];
                                }
                                if (mode == 'share_projeto' && (param.mode == 'insert_usuario' || param.mode == 'insert_unidade' || param.mode == 'change_edicao' || param.mode == 'remove_share')) {
                                    var table = $('#shareBox_' + param.key);
                                    var tr = table.find('tr[data-value="' + (param.key == 'usuario' ? param.id_user : param.id_unidade) + '"]');
                                    tr.attr('data-id', ativData.id_projeto_compartilhado).data('id', ativData.id_projeto_compartilhado);
                                    tr.find('td').eq(0).removeClass('editCellLoading');
                                    if (param.mode == 'remove_share') {
                                        if (table.find('tbody tr:visible').length == 1) {
                                            table.find('.addConfigItem').trigger('click');
                                            table.find('tbody tr:last-child').data('id', 'new').attr('data-id', 'new').find('td:first-child').addClass('editCellSelect').removeClass('editCellLoading');
                                        }
                                        tr.hide('fast', function () { setTimeout(() => { $(this).remove() }, 1000) });
                                    }
                                }
                                var txtAlert = (mode == 'edit_projeto') ? 'Projeto editado' : '';
                                txtAlert = (mode == 'edit_projeto_etapa' || mode == 'update_projeto_etapa') ? 'Etapa editada' : txtAlert;
                                txtAlert = (mode == 'update_projeto_etapa' && param.mode == 'complete_execucao') ? 'Etapa conclu\u00EDda' : txtAlert;
                                txtAlert = (mode == 'delete_projeto_etapa') ? 'Etapa deletada' : txtAlert;
                                txtAlert = (mode == 'archive_projeto' && param.mode == 'Arquivar') ? 'Projeto arquivado' : txtAlert;
                                txtAlert = (mode == 'archive_projeto' && param.mode == 'Reativar') ? 'Projeto reativado' : txtAlert;
                                txtAlert = (mode == 'save_projeto_etapa') ? 'Etapa adicionada' : txtAlert;
                            } else if (mode == 'share_projeto' && param.mode == 'list_select' && typeof ativData['padrao'] !== 'undefined' && ativData['padrao'] !== null) {
                                if (typeof ativData['padrao']['unidades_all'] !== 'undefined') arrayConfigAtividades['unidades_all'] = ativData['padrao']['unidades_all'];
                                if (typeof ativData['padrao']['usuarios_all'] !== 'undefined') arrayConfigAtividades['usuarios_all'] = ativData['padrao']['usuarios_all'];
                            }
                            if ((mode == 'save_projeto' || mode == 'edit_projeto') && typeof ativData['padrao'] !== 'undefined' && ativData['padrao'] !== null) arrayConfigAtividades['tipos_projetos'] = ativData['padrao']['tipos_projetos'];

                            callAtiv('storeLocalDataConfigArray',arrayConfigAtividades);
                            if (ativData.refresh_page) {
                                var mode_update = (
                                    mode == 'save_projeto_etapa' ||
                                    mode == 'delete_projeto_etapa' ||
                                    mode == 'update_projeto_etapa' ||
                                    mode == 'edit_projeto_etapa'
                                )
                                    ? 'update'
                                    : 'insert';
                                // Projetos feature owns the panel; sync store + refresh via its public API.
                                syncProjetosFeatureFromAtividades(arrayConfigAtividades.projetos, {
                                    mode: mode_update,
                                    id_projeto: ativData.id_projeto,
                                    tipos: arrayConfigAtividades.tipos_projetos
                                });
                                loadingButtonConfirm(false);
                                resetDialogBoxPro('dialogBoxPro');
                                alertaBoxPro('Sucess', 'check-circle', txtAlert + ' com sucesso!');
                            }
                            if ((mode == 'save_projeto' || mode == 'clone_projeto') && ativData.id_projeto) {
                                setTimeout(function () {
                                    selectProjetosFeatureTab(ativData.id_projeto);
                                }, 400);
                            }

                        } else if (mode.indexOf('config_') !== -1) {
                            loadingButtonConfirm(false);

                            if (typeof ativData['padrao'] !== 'undefined' && ativData['padrao'] !== null && (mode == 'config_users' || mode == 'config_unidades' || mode == 'config_tipos_modalidades' || mode == 'config_tipos_capacidades' || mode == 'config_perfis' || mode == 'config_tipos_prescricoes' || mode == 'config_entidades')) {
                                if (typeof ativData['padrao']['unidades_all'] !== 'undefined' && ativData['padrao']['unidades_all'].length) arrayConfigAtividades['unidades_all'] = ativData['padrao']['unidades_all'];
                                if (typeof ativData['padrao']['usuarios_entidade'] !== 'undefined' && ativData['padrao']['usuarios_entidade'].length) arrayConfigAtividades['usuarios_entidade'] = ativData['padrao']['usuarios_entidade'];
                                if (typeof ativData['padrao']['perfis'] !== 'undefined' && ativData['padrao']['perfis'].length) arrayConfigAtividades['perfis'] = ativData['padrao']['perfis'];
                                if (typeof ativData['padrao']['tipos_capacidades'] !== 'undefined' && ativData['padrao']['tipos_capacidades'].length) arrayConfigAtividades['tipos_capacidades'] = ativData['padrao']['tipos_capacidades'];
                                if (typeof ativData['padrao']['tipos_metadados'] !== 'undefined' && ativData['padrao']['tipos_metadados'].length) arrayConfigAtividades['tipos_metadados'] = ativData['padrao']['tipos_metadados'];
                            }

                            if (typeof ativData['padrao'] !== 'undefined' && ativData['padrao'] !== null && (mode == 'config_planos' || mode == 'config_self_planos' || mode == 'config_update_planos')) {
                                if (typeof ativData['padrao']['tipos_modalidades'] !== 'undefined' && ativData['padrao']['tipos_modalidades'].length) arrayConfigAtividades['tipos_modalidades'] = ativData['padrao']['tipos_modalidades'];
                                if (typeof ativData['padrao']['termos'] !== 'undefined' && ativData['padrao']['termos'].length) arrayConfigAtividades['termos'] = ativData['padrao']['termos'];
                                if (typeof ativData['padrao']['atividades'] !== 'undefined' && ativData['padrao']['atividades'].length) arrayConfigAtividades['atividades'] = ativData['padrao']['atividades'];
                                if (typeof ativData['padrao']['avaliacao'] !== 'undefined' && ativData['padrao']['avaliacao'].length) arrayConfigAtividades['avaliacao'] = ativData['padrao']['avaliacao'];


                                var updatePlano = jmespath.search(ativData.config, "[?last_update=='0000-00-00 00:00:00'] | [?id_user==`" + arrayConfigAtividades.perfil.id_user + "`]");
                                var checkUpdatePlano = updatePlano !== null && updatePlano.length > 0 ? true : false;
                                if (checkUpdatePlano) {
                                    setTimeout(function () {
                                        callAtiv('updateConfigTempoPactuadoById',updatePlano[0].id_plano);
                                    }, 2000);
                                }

                            }
                            if (typeof ativData['config'] !== 'undefined' && ativData['config'] !== null && (mode == 'config_tipos_prescricoes')) {
                                arrayConfigAtividades['tipos_prescricoes'] = ativData['config'];
                            }
                            if (typeof ativData['config'] !== 'undefined' && ativData['config'] !== null && (mode == 'config_cadeia_valor')) {
                                arrayConfigAtividades['cadeia_valor'] = ativData['config'];
                            }
                            if (typeof ativData['padrao'] !== 'undefined' && ativData['padrao'] !== null && (mode == 'config_atividades')) {
                                arrayConfigAtividades['cadeia_valor'] = ativData['padrao']['cadeia_valor'];
                            }
                            if (typeof ativData['padrao'] !== 'undefined' && ativData['padrao'] !== null && (mode == 'config_objetivos')) {
                                arrayConfigAtividades['tipos_eixos'] = ativData['padrao']['tipos_eixos'];
                                arrayConfigAtividades['mapas'] = ativData['padrao']['mapas'];
                            }
                            if (typeof ativData['padrao'] !== 'undefined' && ativData['padrao'] !== null && (mode == 'config_acoes')) {
                                arrayConfigAtividades['objetivos'] = ativData['padrao']['objetivos'];
                                arrayConfigAtividades['cadeia_valor'] = ativData['padrao']['cadeia_valor'];
                                arrayConfigAtividades['unidades_all'] = ativData['padrao']['unidades_all'];
                            }
                            if (typeof ativData['padrao'] !== 'undefined' && ativData['padrao'] !== null && (mode == 'config_entregas')) {
                                arrayConfigAtividades['objetivos'] = ativData['padrao']['objetivos'];
                                arrayConfigAtividades['tipos_entregas'] = ativData['padrao']['tipos_entregas'];
                                arrayConfigAtividades['acoes'] = ativData['padrao']['acoes'];
                                arrayConfigAtividades['unidades_all'] = ativData['padrao']['unidades_all'];
                            }
                            if (typeof ativData['padrao'] !== 'undefined' && ativData['padrao'] !== null && (mode == 'config_programas')) {
                                arrayConfigAtividades['entregas'] = ativData['padrao']['entregas'];
                            }
                            if (typeof ativData['padrao'] !== 'undefined' && ativData['padrao'] !== null && (mode == 'config_tipos_avaliacoes')) {
                                arrayConfigAtividades['tipos_justificativas'] = ativData['padrao']['tipos_justificativas'];
                            }

                            if (mode == 'config_new_users') {
                                loadingButtonConfirm(false);
                                if (param.mode == 'check' && ativData.check_lotacao && ativData.id_user != 0 && ativData.id_unidade != 0) {
                                    alertaBoxPro('Error', 'exclamation-triangle', 'Usu\u00E1rio j\u00E1 cadastrado no sistema. <br><br>Lota\u00E7\u00E3o atual: ' + ativData.nome_unidade + ' (' + ativData.sigla_unidade + ')<br><br>Solicite a desvincula\u00E7\u00E3o ao gestor da unidade ou a altera\u00E7\u00E3o de lota\u00E7\u00E3o ao administrador do sistema');
                                } else if (param.mode == 'check' && ativData.check_lotacao == false && ativData.id_user != 0) {
                                    confirmaFraseBoxPro('Usu\u00E1rio j\u00E1 cadastrado no sistema, mas sem lota\u00E7\u00E3o definida. Deseja lotar em sua unidade?', 'SIM',
                                        function () {
                                            callAtiv('moveUserCapacity',ativData.id_user);
                                        }
                                    );
                                } else if (param.mode == 'move') {
                                    resetDialogBoxPro('dialogBoxPro');
                                    callAtiv('updateAtividade',);
                                }
                            }

                            if (typeof param.mode === 'undefined' || param.mode != 'check') {
                                var mode_config = mode.replace('config_', '').replace('self_', '');
                                callAtiv('getTabConfig',mode_config, 'set', ativData, false, 0, param);
                            }
                        } else if (mode == 'panel') {

                            $('#tabs-configpessoal').find('tr > td:nth-child(2)').removeClass('editCellLoading');
                            var isInitOffset = (typeof ativData.offset === 'undefined' || ativData.offset == 0) ? true : false;

                            if (
                                typeof ativData.padrao === 'object' && ativData.padrao !== null &&
                                typeof ativData.padrao.perfil !== 'undefined' && ativData.padrao.perfil !== null &&
                                typeof ativData.padrao.perfil.nivel !== 'undefined' && ativData.padrao.perfil.nivel !== null &&
                                typeof arrayConfigAtividades === 'object' && arrayConfigAtividades !== null &&
                                typeof arrayConfigAtividades.perfil !== 'undefined' && arrayConfigAtividades.perfil !== null &&
                                typeof arrayConfigAtividades.perfil.nivel !== 'undefined' && arrayConfigAtividades.perfil.nivel !== null &&
                                ativData.padrao.perfil.nivel !== arrayConfigAtividades.perfil.nivel
                            ) {
                                if (isInitOffset) callAtiv('removeLocalDataAtiv',true);
                                callAtiv('getAtividades',);
                                return false;
                            }

                            if (typeof ativData['padrao'] === 'object' && ativData['padrao'] !== null) {
                                if (param.last_update) {
                                    callAtiv('appendDataConfigOnLocalArray',ativData['padrao']);
                                } else if (isInitOffset) {
                                    callAtiv('removeLocalDataAtiv',true);
                                    arrayConfigAtividades = ativData['padrao'];
                                }

                                if (
                                    typeof arrayConfigAtividades !== 'undefined' && arrayConfigAtividades !== null &&
                                    typeof arrayConfigAtividades.etiquetas !== 'undefined' && arrayConfigAtividades.etiquetas !== null &&
                                    typeof arrayConfigAtividades.etiquetas.list !== 'undefined' && arrayConfigAtividades.etiquetas.list !== null
                                ) {
                                    arrayConfigAtividades['etiquetas']['list'] = $.map(arrayConfigAtividades['etiquetas']['list'], function (i) { return i })
                                }
                            }

                            var arrayConfigUnidadeSeleted = (typeof ativData['padrao'] === 'object' && ativData['padrao'] !== null && ativData['padrao']['unidades'].length > 0)
                                ? jmespath.search(ativData['padrao']['unidades'], "[?selected==`true`] | [0]")
                                : jmespath.search(arrayConfigAtividades['unidades'], "[?selected==`true`] | [0]");
                            arrayConfigAtivUnidade = (arrayConfigUnidadeSeleted !== null) ? arrayConfigUnidadeSeleted : arrayConfigAtivUnidade;

                            arrayNomenclaturas = arrayConfigAtividades['nomenclaturas'];
                            initNameConst('set');

                            var arrayUsuarios = [];
                            if (typeof arrayConfigAtividades.unidades !== 'undefined') {
                                $.each(jmespath.search(arrayConfigAtividades.unidades, "[*].usuarios"), function (index, value) {
                                    $.each(value, function (i, v) {
                                        if (jmespath.search(arrayUsuarios, "[?id_user==`" + v.id_user + "`]").length == 0) {
                                            arrayUsuarios.push(v);
                                        }
                                    });
                                });
                                arrayConfigAtividades.usuarios = arrayUsuarios;
                            }

                            if (typeof ativData['demandas'] !== 'undefined' && ativData['demandas'] !== null) {
                                if (arrayAtividadesPro.length && (param.last_update || !isInitOffset)) {
                                    callAtiv('appendDataDemandaOnLocalArray',ativData['demandas'], 'demandas');
                                } else {
                                    arrayAtividadesPro = ativData['demandas'];
                                    localStorageStorePro('lastRestoreAtividades', moment().format('YYYY-MM-DD HH:mm:ss'));
                                }
                            }
                            if (typeof ativData['demandas_processo'] !== 'undefined' && ativData['demandas_processo'] !== null && isInitOffset) {
                                arrayAtividadesProcPro = ativData['demandas_processo'];
                            }
                            if (typeof ativData['prescricoes_processo'] !== 'undefined' && ativData['prescricoes_processo'] !== null && isInitOffset) {
                                arrayPrescricoesProcPro = ativData['prescricoes_processo'];
                                callAtiv('initPanelPrescricaoProc',);
                            }
                            if (typeof ativData['demandas_excluidas'] !== 'undefined' && ativData['demandas_excluidas'] !== null && ativData['demandas_excluidas'].length > 0 && isInitOffset) {
                                $.each(ativData['demandas_excluidas'], function (i, v) {
                                    callAtiv('removeRowsPanelAtividades',v.id_demanda);
                                });
                            }

                            checkLoadAtividadesProcPro = true;
                            var arrayAtividades = ($('#ifrArvore').length > 0) ? arrayAtividadesProcPro : arrayAtividadesPro;

                            hybridStorageStorePro('configDataAtividadesPro', arrayAtividadesPro);
                            hybridStorageStorePro('configDataAtividadesProcPro', arrayAtividadesProcPro);
                            hybridStorageStorePro('configDataAtivUnidadePro', arrayConfigAtivUnidade);
                            callAtiv('storeLocalDataConfigArray',arrayConfigAtividades);

                            const nextLastUpdate = (!getOptionsPro('panelLocalStorePro') && typeof ativData['last_update'] !== 'undefined' && ativData['last_update'])
                                ? ativData['last_update']
                                : context.store.get().lastUpdateAtividades;
                            context.store.patch({
                                arrayAtividadesPro,
                                arrayAtividadesProcPro,
                                arrayPrescricoesProcPro,
                                arrayConfigAtivUnidade,
                                arrayConfigAtividades,
                                arrayAtividades,
                                checkLoadAtividadesProcPro: true,
                                lastUpdateAtividades: nextLastUpdate
                            });
                            if (typeof localStorageStorePro === 'function') localStorageStorePro('lastUpdateAtividades', nextLastUpdate);

                            var ativDataPanel = false;
                            var _caption = $('#tabelaAtivPanel table caption.infraCaption');
                            var _lastCount = (_caption.length > 0) ? _caption.find('span.count') : false;
                            if (typeof ativData === 'object' && ativData !== null) {
                                if (param.last_update) {
                                    $('.panelHome').find('.iconAtividade_update i').removeClass('fa-spin');
                                    if (!$('#tabelaAtivPanel table tbody').length || (typeof ativData['demandas_processo'] !== 'undefined' && ativData['demandas_processo'] !== null && ativData['demandas_processo'].length > 0)) {
                                        ativDataPanel = {
                                            demandas: arrayAtividadesPro,
                                            demandas_processo: arrayAtividadesProcPro,
                                            padrao: arrayConfigAtividades,
                                            last_update: nextLastUpdate,
                                            status: 1
                                        };
                                        callAtiv('initPanelAtividades',ativDataPanel);
                                    }
                                    if (typeof ativData['demandas'] !== 'undefined' && ativData['demandas'] !== null && ativData['demandas'].length > 0) {
                                        callAtiv('getRowsPanelAtividades',ativData['demandas'], $('#tabelaAtivPanel table tbody'));
                                    }
                                    callAtiv('setAtividadesUser',);
                                } else {
                                    if (isInitOffset) {
                                        arrayConfigAtividades = ativData['padrao'];
                                        context.store.patch({ arrayConfigAtividades });
                                        ativDataPanel = ativData;
                                        callAtiv('initPanelAtividades',ativDataPanel);
                                    } else {
                                        callAtiv('getRowsPanelAtividades',ativData['demandas'], $('#tabelaAtivPanel table tbody'));
                                        callAtiv('getHtmlTableAtiv',);
                                    }
                                    var countDemandas = (typeof ativData['demandas'] !== 'undefined' && ativData['demandas'] !== null && ativData['demandas'].length > 0) ? ativData['demandas'].length : 0;
                                    if (countDemandas > 0 && typeof ativData.offset !== 'undefined' && callAtiv('getOptionEntidade','limit_paginacao') != 0) {
                                        var new_param = param;
                                        new_param.offset = ativData.next_offset;
                                        request(new_param, 'panel');
                                        if (_caption.find('span.progress').length == 0) _caption.append('<span class="progress" style="color: #777;font-size: 0.9em !important;padding: 5px;margin: 5px;"><i class="fas fa-sync fa-spin cinzaColor"></i> carregando dados...</span>');
                                    } else {
                                        _caption.find('span.progress').remove();
                                    }
                                }
                                if (_lastCount) _lastCount.text(arrayAtividadesPro.length);
                            }

                            callAtiv('getInsertIconAtividade',);
                            // getProfileAtiv();
                            resetDialogBoxPro('configBoxPro');
                            callAtiv('repairPerfilSelectUnidade',);
                            setResizeAreaTelaD();
                            setProgressBarOnProcesso();
                            if (getOptionsPro('panelAtividadesView') == 'Quadro') callAtiv('initKanbanAtividades',);

                            // console.log('initPanelAtividades', ativDataPanel);

                            if (typeof param.callback !== 'undefined' && param.callback) {
                                if (param.callback.action == 'rate_atividade') {
                                    setTimeout(function () {
                                        callAtiv('rateAtividade',param.callback.id, false);
                                    }, 1500);
                                }
                            }
                            if (verifyConfigValue('gerenciarprojetos') && callAtiv('checkCapacidade','view_projetos') && isInitOffset) {
                                var projetosPanel = (arrayConfigAtividades && arrayConfigAtividades.projetos) ? arrayConfigAtividades.projetos : [];
                                syncProjetosFeatureFromAtividades(projetosPanel, {
                                    mode: (documentRef && documentRef.getElementById('projetosGantt') ? 'refresh' : 'insert'),
                                    tipos: arrayConfigAtividades && arrayConfigAtividades.tipos_projetos
                                });
                            }

                        } else if (mode == 'pause_atividade_lista') {
                            loadingButtonConfirm(false);
                            callAtiv('getPausasAtividadeCalc',ativData['pause_lista']);
                            var objIndexAtiv = (typeof arrayAtividadesPro === 'undefined' || arrayAtividadesPro == 0 || arrayAtividadesPro.length == 0) ? -1 : arrayAtividadesPro.findIndex((obj => obj.id_demanda == ativData.id_demanda));
                            if (objIndexAtiv !== -1) {
                                arrayAtividadesPro[objIndexAtiv].pausa_lista = ativData['pause_lista'];
                                $('#ativ_data_entrega').trigger('change');
                            }
                        } else if (mode == 'update_planos') {
                            loadingButtonConfirm(false);
                            callAtiv('updateArrayPlanos',ativData['update_planos']);
                        } else if (mode == 'update_prioridades') {
                            callAtiv('updatePriorityKanbanItens',ativData['board'], 'update');
                            var resultAtivData = ativData['demandas'];
                            arrayAtividadesPro = resultAtivData;
                            hybridStorageStorePro('configDataAtividadesPro', resultAtivData);
                        } else if (
                            mode == 'sign_documento' ||
                            mode == 'sign_cancel_documento' ||
                            mode == 'save_atividade' ||
                            mode == 'save_atividade_rapida' ||
                            mode == 'edit_atividade' ||
                            mode == 'delete_atividade' ||
                            mode == 'delete_atividade_all' ||
                            mode == 'start_atividade' ||
                            mode == 'extend_atividade' ||
                            mode == 'variation_atividade' ||
                            mode == 'type_atividade' ||
                            mode == 'pause_atividade' ||
                            mode == 'pause_atividade_remove' ||
                            mode == 'start_cancel_atividade' ||
                            mode == 'start_cancel_atividades' ||
                            mode == 'complete_atividade' ||
                            mode == 'complete_atividade_parcial' ||
                            mode == 'complete_edit_atividade' ||
                            mode == 'complete_cancel_atividade' ||
                            mode == 'complete_cancel_atividades' ||
                            mode == 'rate_atividade' ||
                            mode == 'rate_atividades' ||
                            mode == 'rate_edit_atividade' ||
                            mode == 'rate_cancel_atividade' ||
                            mode == 'rate_cancel_atividades' ||
                            mode == 'send_atividade' ||
                            mode == 'send_cancel_atividade' ||
                            mode == 'notify_send' ||
                            mode == 'save_afastamento' ||
                            mode == 'edit_afastamento' ||
                            mode == 'delete_afastamento'
                        ) {
                            var value = (typeof param.id_demanda !== 'undefined') ? jmespath.search(arrayAtividadesPro, "[?id_demanda==`" + param.id_demanda + "`] | [0]") : false;
                            var demandaID = (value) ? '[{"ID":' + value.id_demanda + '}]' : value;
                            demandaID = (!value && typeof param.id_demandas != 'undefined' && param.id_demandas.length > 0)
                                ? JSON.stringify($.map(param.id_demandas, function (sub, i) { return { ID: sub } }))
                                : demandaID;
                            var requisicao = (value)
                                ? (typeof value.requisicao_sei !== 'undefined' && value.requisicao_sei !== null && parseInt(value.requisicao_sei) != 0)
                                    ? value.nome_requisicao + ' (' + value.requisicao_sei + ') '
                                    : value.nome_requisicao
                                : '';
                            var txtAlert = (mode == 'save_atividade') ? __.Demanda + ' ' + getNameGenre('demanda', 'cadastrado', 'cadastrada') : '';
                            txtAlert = (mode == 'save_atividade_rapida') ? __.Demanda + ' r\u00E1pida ' + getNameGenre('demanda', 'cadastrado', 'cadastrada') : txtAlert;
                            txtAlert = (mode == 'sign_documento') ? 'Documento assinado' : txtAlert;
                            txtAlert = (mode == 'sign_cancel_documento') ? 'Assinatura do documento cancelada' : txtAlert;
                            txtAlert = (mode == 'edit_atividade') ? __.Demanda + ' ' + getNameGenre('demanda', 'editado', 'editada') : txtAlert;
                            txtAlert = (mode == 'delete_atividade' || mode == 'delete_atividade_all') ? (typeof ativData['delete_demandas'] !== 'undefined' && ativData['delete_demandas'].length > 1 ? __.Demandas + ' ' + getNameGenre('demanda', 'deletados', 'deletadas') : __.Demanda + ' ' + getNameGenre('demanda', 'deletado', 'deletada')) : txtAlert;
                            txtAlert = (mode == 'start_atividade') ? __.Demanda + ' ' + getNameGenre('demanda', 'iniciado', 'iniciada') : txtAlert;
                            txtAlert = (mode == 'extend_atividade') ? __.Demanda + ' ' + getNameGenre('demanda', 'prorrogado', 'prorrogada') : txtAlert;
                            txtAlert = (mode == 'variation_atividade') ? __.Complexidade + ' ' + getNameGenre('complexidade', 'alterado', 'alterada') : txtAlert;
                            txtAlert = (mode == 'type_atividade') ? __.Atividade + ' ' + getNameGenre('atividade', 'atribu\u00EDdo', 'atribu\u00EDda') : txtAlert;
                            txtAlert = (mode == 'pause_atividade') ? __.Demanda + ' ' + (ativData['check_ispaused'] == false ? __.paralisada : __.retomada) : txtAlert;
                            txtAlert = (mode == 'pause_atividade_remove') ? __.Paralisacao + ' ' + getNameGenre('paralisacao', 'removido', 'removida') : txtAlert;
                            txtAlert = (mode == 'complete_atividade') ? __.Demanda + ' ' + getNameGenre('demanda', 'conclu\u00EDdo', 'conclu\u00EDda') : txtAlert;
                            txtAlert = (mode == 'complete_atividade_parcial') ? __.Demanda + ' residual ' + getNameGenre('demanda', 'cadastrado', 'cadastrada') : txtAlert;
                            txtAlert = (mode == 'complete_edit_atividade') ? __.Demanda + ' ' + getNameGenre('demanda', 'editado', 'editada') : txtAlert;
                            txtAlert = (mode == 'start_cancel_atividade') ? 'In\u00EDcio de ' + __.demanda + ' cancelado' : txtAlert;
                            txtAlert = (mode == 'start_cancel_atividades') ? 'In\u00EDcio de ' + __.demandas + ' cancelado' : txtAlert;
                            txtAlert = (mode == 'complete_cancel_atividade') ? 'Conclus\u00E3o de ' + __.demanda + ' cancelada' : txtAlert;
                            txtAlert = (mode == 'complete_cancel_atividades') ? 'Conclus\u00E3o de ' + __.demandas + ' cancelada' : txtAlert;
                            txtAlert = (mode == 'rate_atividade') ? 'Avalia\u00E7\u00E3o cadastrada' : txtAlert;
                            txtAlert = (mode == 'rate_atividades') ? 'Avalia\u00E7\u00F5es cadastradas' : txtAlert;
                            txtAlert = (mode == 'rate_edit_atividade') ? 'Avalia\u00E7\u00E3o editada' : txtAlert;
                            txtAlert = (mode == 'rate_cancel_atividade') ? 'Avalia\u00E7\u00E3o cancelada' : txtAlert;
                            txtAlert = (mode == 'rate_cancel_atividades') ? 'Avalia\u00E7\u00F5es canceladas' : txtAlert;
                            txtAlert = (mode == 'send_atividade') ? (ativData['update_demandas'].length == 1 ? __.Demanda + ' ' + __.arquivada : __.Demandas + ' ' + __.arquivadas) : txtAlert;
                            txtAlert = (mode == 'send_cancel_atividade') ? __.Arquivamento + ' de ' + __.demanda + ' ' + getNameGenre('arquivamento', 'cancelado', 'cancelado') : txtAlert;
                            txtAlert = (mode == 'save_afastamento') ? 'Afastamento salvo' : txtAlert;
                            txtAlert = (mode == 'edit_afastamento') ? 'Afastamento editado' : txtAlert;
                            txtAlert = (mode == 'delete_afastamento') ? (typeof ativData['id_afastamentos'] !== 'undefined' && ativData['id_afastamentos'].length > 1 ? 'Afastamentos deletados' : 'Afastamento deletado') : txtAlert;
                            txtAlert = (mode == 'notify_send') ? 'Notifica\u00E7\u00E3o enviada ' : txtAlert;

                            loadingButtonConfirm(false);

                            if (param.action == 'sign_documento' || param.action == 'sign_cancel_documento') {
                                resetDialogBoxPro('editorBoxPro');
                                callAtiv('updateAtividade_',false);
                                if (typeof ativData.refresh_page !== 'undefined' && ativData.refresh_page && $('#tableConfiguracoesPanel_' + param.type).is(':visible')) {
                                    callAtiv('getTabConfig',param.type, 'get');
                                }
                            }
                            if (mode != 'pause_atividade_remove') {
                                resetDialogBoxPro('dialogBoxPro');
                            } else {
                                setTimeout(function () {
                                    callAtiv('getPausasAtividade',ativData['id_demanda']);
                                }, 1500);
                            }

                            var callback = (mode == 'type_atividade' && param.before_rate) ? { action: 'rate_atividade', id: param.id_demanda } : false;
                            callAtiv('getAtividades',callback);

                            alertaBoxPro('Sucess', 'check-circle', txtAlert + ' com sucesso!');

                            if (value && value.id_procedimento !== null && jmespath.search(arrayConfigAtividades.entidades, "[?id_entidade==`" + arrayConfigAtividades.perfil.id_entidade + "`] |[0].config.gravar_historico_processo")) {
                                updateDadosArvore('Atualizar Andamento', 'txaDescricao', '_' + txtAlert + ': ' + requisicao + (demandaID ? demandaID : ''), value.id_procedimento);
                            }
                            if ((mode == 'save_atividade' || mode == 'complete_atividade') && ativData['anotacoes_processo']) {
                                callAtiv('updateAnotacaoProcesso',ativData['anotacoes_processo']);
                            }
                            if ((mode == 'save_atividade' || mode == 'edit_atividade') && param.lista_marcador && param.marcador == 'on') {
                                var dateSubmit = 'Ate ' + moment(param.prazo_entrega, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm');
                                var valuesIframe = [
                                    { element: 'txaTexto', value: dateSubmit },
                                    { element: 'hdnIdMarcador', value: param.lista_marcador.id_marcador }
                                ];
                                updateDadosArvoreMult('Gerenciar Marcador', valuesIframe, param.id_procedimento, function () {
                                    var listMarcadores = sessionStorageRestorePro('dadosMarcadoresProcessoPro');
                                    var objIndexDoc = (!listMarcadores) ? -1 : listMarcadores.findIndex((obj => obj.id_procedimento == String(param.id_procedimento)));
                                    if (objIndexDoc !== -1) {
                                        listMarcadores[objIndexDoc] = {
                                            id_procedimento: listMarcadores[objIndexDoc].id_procedimento,
                                            icon: param.lista_marcador.icon,
                                            tag: param.lista_marcador.tag,
                                            name: dateSubmit
                                        }
                                        sessionStorageStorePro('dadosMarcadoresProcessoPro', listMarcadores);
                                    }
                                });
                            }
                            if (mode == 'save_afastamento' || mode == 'edit_afastamento' || mode == 'delete_afastamento') {
                                setTimeout(function () {
                                    let return_id_afastamento = mode == 'save_afastamento' ? parseInt(ativData.id_afastamento) : parseInt(param.id_afastamento);
                                    objIndexAtiv = (typeof arrayConfigAtividades.afastamentos === 'undefined' || arrayConfigAtividades.afastamentos == 0 || arrayConfigAtividades.afastamentos.length == 0 || typeof arrayConfigAtividades.afastamentos.lista === 'undefined' || arrayConfigAtividades.afastamentos.lista == 0 || arrayConfigAtividades.afastamentos.lista.length == 0) ? -1 : arrayConfigAtividades.afastamentos.lista.findIndex((obj => obj.id_afastamento == return_id_afastamento));
                                    if (mode == 'edit_afastamento' || mode == 'delete_afastamento') {
                                        if (objIndexAtiv !== -1) {
                                            if (mode == 'edit_afastamento') {
                                                arrayConfigAtividades.afastamentos.lista[objIndexAtiv] = ativData['result'][0];
                                            } else if (mode == 'delete_afastamento') {
                                                arrayConfigAtividades.afastamentos.lista.splice(objIndexAtiv, 1);
                                            }
                                        }
                                    } else if (mode == 'save_afastamento' && typeof ativData['result'] !== 'undefined' && ativData['result'] !== null && ativData['result'].length > 0) {
                                        if (objIndexAtiv !== -1) {
                                            arrayConfigAtividades.afastamentos.lista[objIndexAtiv] = ativData['result'][0];
                                        } else {
                                            arrayConfigAtividades.afastamentos.lista.push(ativData['result'][0]);
                                        }
                                    }
                                    setTimeout(function () {
                                        callAtiv('updateTempoProporcionalPlanos',);
                                    }, 1000);
                                    callAtiv('initPanelAtividadesView',);
                                }, 1500);
                            }
                            if (mode == 'save_atividade' || mode == 'save_atividade_rapida' || mode == 'edit_atividade' || mode == 'extend_atividade' || mode == 'variation_atividade' || mode == 'type_atividade' || mode == 'complete_atividade' || mode == 'complete_edit_atividade' || mode == 'complete_atividade_parcial') {
                                if (mode == 'complete_atividade' && ativData['checklist_tempo_proporcional']) {
                                    alertBoxPro.dialog('option', 'buttons', [{
                                        text: 'Gerar Notifica\u00E7\u00E3o',
                                        icon: "ui-icon-mail-closed",
                                        click: function (event) {
                                            $(this).dialog('close');
                                            callAtiv('notifyAtividade',param.id_demanda == '0' ? ativData['id_demanda'] : param.id_demanda, event);
                                        }
                                    }, {
                                        text: 'Gerar Demanda Residual',
                                        icon: "ui-icon-mail-scissors",
                                        class: 'ui-state-active',
                                        click: function (event) {
                                            $(this).dialog('close');
                                            var return_tempo_parcial = ativData['return_tempo_parcial'];
                                            var action = 'complete_atividade_parcial';
                                            var param = {
                                                action: action,
                                                id_demanda: return_tempo_parcial.id_demanda,
                                                tempo_pactuado: return_tempo_parcial.tempo_pactuado,
                                                tempo_pactuado_original: return_tempo_parcial.tempo_pactuado_original
                                            };
                                            request(param, action);
                                        }
                                    }]);
                                    $('#alertaBoxPro').html('<strong class="alertaSucessPro dialogBoxDiv"><i class="fas fa-check-circle" style="margin-right: 5px;"></i> ' + __.Demanda + ' conclu\u00EDda com sucesso!<br><br>Deseja criar demanda residual a partir do tempo pactuado restante (' + decimalHourToMinute(ativData['return_tempo_parcial'].tempo_pactuado) + ' horas)?</strong>');
                                } else {
                                    alertBoxPro.dialog('option', 'buttons', [{
                                        text: "OK",
                                        click: function () {
                                            $(this).dialog('close');
                                        }
                                    }, {
                                        text: 'Gerar Notifica\u00E7\u00E3o',
                                        icon: "ui-icon-mail-closed",
                                        class: 'ui-state-active',
                                        click: function (event) {
                                            $(this).dialog('close');
                                            callAtiv('notifyAtividade',param.id_demanda == '0' ? ativData['id_demanda'] : param.id_demanda, event);
                                        }
                                    }]);
                                }
                            }
                            if (mode == 'delete_atividade' || mode == 'delete_atividade_all') {
                                callAtiv('removeRowsPanelAtividades',param.id_demanda);
                            }
                            if (
                                mode == 'complete_atividade' || mode == 'complete_edit_atividade' || mode == 'complete_atividade_parcial' || mode == 'complete_cancel_atividade' || mode == 'complete_cancel_atividades' ||
                                mode == 'save_atividade' || mode == 'save_atividade_rapida' || mode == 'edit_atividade' || mode == 'pause_atividade' ||
                                mode == 'rate_atividade' || mode == 'rate_atividades' || mode == 'rate_cancel_atividade' || mode == 'rate_cancel_atividades' || mode == 'rate_default_atividade' || mode == 'rate_edit_atividade' ||
                                mode == 'send_atividade' || mode == 'send_cancel_atividade' ||
                                mode == 'start_atividade' || mode == 'start_cancel_atividade' || mode == 'start_cancel_atividades' ||
                                mode == 'type_atividade' || mode == 'extend_atividade' || mode == 'variation_atividade' ||
                                mode == 'delete_atividade'
                            ) {
                                callAtiv('awaitRowsPanelAtividades',param.id_demanda);
                            }
                        } else {
                            loadingButtonConfirm(false);
                        }
                        if (callAtiv('checkPerfilNivelAdm',) && callAtiv('checkOptionEntidade','gerar_relatorios_gerenciais')) {
                            indexReportUpdate = 0;
                            callAtiv('checkUpdateReports',);
                        }
                        if (callAtiv('checkPerfilNivelAdm',) && callAtiv('checkOptionEntidade','sincronizar_dados_externos')) {
                            indexReportUpdate = 0;
                            callAtiv('checkSyncDadoExterno',);
                        }
                        if (callAtiv('checkPerfilNivelAdm',) && callAtiv('checkOptionEntidade','sincronizar_dados_api')) {
                            indexAPIUpdate = 0;
                            callAtiv('checkSyncAPI',);
                        }
                        if (typeof ativData !== 'undefined' && typeof ativData['version_backend'] !== 'undefined') backendServerAtiv = ativData['version_backend'];
                    }
                }
        }).catch(function (failure) {
            var data = (failure && failure.xhr) || failure || {};
            var textStatus = (failure && failure.status) || '';
            if (typeof param.type !== 'undefined') { callAtiv('resetButtonTabConfig','.actionsConfig_' + param.type) }
            if (typeof data.refresh_page !== 'undefined' && data.refresh_page) callAtiv('cleanAtivParams',);
            callAtiv('failureScreen',data, textStatus, param);
            callAtiv('loadingTagConfig',param.type, 'set');
        }).finally(function () {
            context.store.patch({
                perfilLoginAtiv,
                arrayAtividadesPro,
                arrayAtividadesProcPro,
                arrayConfigAtividades,
                arrayConfigAtivUnidade,
                backendServerAtiv: page.backendServerAtiv,
                indexReportUpdate: page.indexReportUpdate,
                indexAPIUpdate: page.indexAPIUpdate
            });
        });
}
