import { callAtiv } from './call.js';
/**
 * Atividades — gráficos e visualizações.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import './runtime.js';
import { getServerAtividades } from './server.js';

export function checkLimitAvaliacaoSubordinada(value) {
    var config_unidade = jmespath.search(arrayConfigAtividades.unidades, "[?id_unidade==`" + value.id_unidade + "`] | [0].config");
    var limitar_avaliacao_subordinadas = (config_unidade && config_unidade !== null && typeof config_unidade.administrativo !== 'undefined' && typeof config_unidade.administrativo.limitar_avaliacao_subordinadas !== 'undefined' && config_unidade.administrativo.limitar_avaliacao_subordinadas) ? config_unidade.administrativo.limitar_avaliacao_subordinadas : false;
    return (limitar_avaliacao_subordinadas && value.id_unidade != arrayConfigAtividades.perfil.id_unidade) ? true : false;
}
export function checkCapacidade(nome_capacidade) {
    var checkPerfil = (arrayConfigAtividades && typeof arrayConfigAtividades['perfil'] !== 'undefined' && typeof arrayConfigAtividades['perfil'].capacidades !== 'undefined')
        ? jmespath.search(arrayConfigAtividades['perfil'].capacidades, "[?nome_capacidade=='" + nome_capacidade + "'] | length(@)")
        : 0;
    return (checkPerfil == 0) ? false : true;
}
export function getChartDemandas(param) {
    var action = 'chart_demandas';
    param.action = action;
    param.id_user = (param.id_user) ? param.id_user : 0;
    getServerAtividades(param, action);
    $('.panelHomePro .iconAtividade_update i').addClass('fa-spin');
}
export function changeChartAtiv(this_) {
    var _this = $(this_);
    var _parent = _this.closest('#chartAtivActions');
    var elem_user = _parent.find('#selectChartUserAtiv');
    var elem_programa = _parent.find('#selectChartProgramasAtiv');

    if (_this.attr('id') == 'selectChartProgramasAtiv') {
        elem_user.val('').chosen("destroy").chosen({
            placeholder_text_single: ' ',
            no_results_text: 'Nenhum resultado encontrado',
            normalize_search_text: function (text) {
                return removeAcentos(text.toLowerCase());
            }
        });
        forcePlaceHoldChosen();
    }

    var id_user = elem_user.val();
    id_user = (id_user !== null) ? parseInt(id_user) : 0;

    var id_programa = elem_programa.val();
    id_programa = (typeof elem_programa !== 'undefined' && typeof id_programa !== 'undefined' && id_programa !== null) ? parseInt(id_programa) : 0;

    var id_unidade = elem_programa.find('option:selected').data('id_unidade');
    id_unidade = (typeof elem_programa !== 'undefined' && typeof id_unidade !== 'undefined' && id_unidade !== null) ? parseInt(id_unidade) : 0;

    var sigla_unidade = (typeof elem_programa !== 'undefined') ? elem_programa.find('option:selected').data('label') : arrayConfigAtivUnidade.sigla_unidade;

    var _param = { id_user: id_user, id_unidade: id_unidade, id_programa: id_programa, sigla_unidade: sigla_unidade };
    _parent.find('.loadChartUserAtiv').remove();
    _parent.append('<i class="fas fa-spinner fa-spin loadChartUserAtiv" style="float: right; font-size: 12pt; margin-top: 8px;"></i>');

    getChartDemandas(_param);
    setOptionsPro('selectChartAtiv', _param);
}
export function setChartAtividades(data, mode) {
    $('.loadChartUserAtiv').remove();
    $('.panelHomePro .iconAtividade_update i').removeClass('fa-spin');
    if (mode == 'chart_demandas') {
        if (typeof data.demandasmes !== 'undefined' && data.demandasmes) { setChartDemandasAtiv(data.demandasmes); }
        if (typeof data.estoque !== 'undefined' && data.estoque) { setChartDemandasEstoqueAtiv(data.estoque); }
        if (typeof data.processuais !== 'undefined' && data.processuais) { setChartDemandasProcessuaisAtiv(data.processuais); }
        if (typeof data.mediatempo !== 'undefined' && data.mediatempo) { setChartDemandasMediaTempoAtiv(data.mediatempo); }
        if (typeof data.statusentregas !== 'undefined' && data.statusentregas) { setChartDemandasStatusEntregasAtiv(data.statusentregas); }
        if (typeof data.requisicoes !== 'undefined' && data.requisicoes) { setChartDemandasRequisicoesAtiv(data.requisicoes); }
        if (typeof data.documentos !== 'undefined' && data.documentos) { setChartDemandasDocumentosAtiv(data.documentos); }
        if (typeof data.produtividade !== 'undefined' && data.produtividade) { setChartDemandasProdutividadeAtiv(data.produtividade); }
        if (typeof data.produtividademes !== 'undefined' && data.produtividademes && !callAtiv('checkOptionEntidade','desativa_produtividade_geral')) { setChartDemandasProdutividadeMesAtiv(data.produtividademes); }

        if (typeof data.programas !== 'undefined' && data.programas) {
            var id_programa_selected = (typeof data.programa !== 'undefined' && data.programa !== null && data.programa.hasOwnProperty('id_programa') && data.programa.id_programa != 0) ? data.programa.id_programa : false;
            setSelectProgramas(data.programas, 'selectChartProgramasAtiv', 'selectChartAtiv', id_programa_selected);
            // console.log('id_programa_selected', id_programa_selected);
        }
        if (typeof data.planos !== 'undefined' && data.planos) { setChartUsuariosAtiv(data.planos); }
        getChartPlanosTrabalho(data.planos);
        initPanelResize('#chartSectionDistribuicao', 'chartDistribuicao');
        forcePlaceHoldChosen();
        window.chart_data_planos = data.planos;
    }
}
export function setSelectProgramas(data, idElem = 'selectChartProgramasAtiv', optionStore = 'selectChartAtiv', id_selected = false) {
    var listUnidadesPrograma = jmespath.search(data, "[*].id_unidade");
    listUnidadesPrograma = (listUnidadesPrograma !== null) ? uniqPro(listUnidadesPrograma) : 0;

    var optionSelectPrograma = '<option value="0" data-label="">&nbsp;</option>';
    if (listUnidadesPrograma.length > 1) {
        $.each(listUnidadesPrograma, function (index, value) {
            var arrayProgramas = jmespath.search(data, "[?id_unidade==`" + value + "`]");
            optionSelectPrograma += '<optgroup label="' + arrayProgramas[0].sigla_unidade + ' - ' + arrayProgramas[0].nome_unidade + '">';
            optionSelectPrograma += $.map(arrayProgramas, function (v) {
                // console.log(v.id_programa,id_selected);
                var selected = ((id_selected && v.id_programa == id_selected) || (getOptionsPro(optionStore) && getOptionsPro(optionStore).id_programa == v.id_programa)) ? 'selected' : '';
                return '<option value="' + v.id_programa + '" data-label="' + v.sigla_unidade + '" data-id_unidade="' + v.id_unidade + '" ' + selected + '>' + moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(v.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</option>';
            }).join('');
            optionSelectPrograma += '</optgroup>';
        });
    } else {
        optionSelectPrograma += $.map(jmespath.search(data, "[]"), function (v) {
            var selected = ((id_selected && v.id_programa == id_selected) || (getOptionsPro(optionStore) && getOptionsPro(optionStore).id_programa == v.id_programa)) ? 'selected' : '';
            return '<option value="' + v.id_programa + '"  data-label="' + v.sigla_unidade + '" ' + selected + '>' + moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(v.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</option>';
        }).join('');
    }
    optionSelectPrograma += '<option value="-1" data-label="" ' + (id_selected == '-1' || (getOptionsPro(optionStore) && getOptionsPro(optionStore).id_programa == '-1') ? 'selected' : '') + '>Todos os programas</option>';
    $('#' + idElem).html(optionSelectPrograma).chosen("destroy").chosen({
        placeholder_text_single: ' ',
        no_results_text: 'Nenhum resultado encontrado',
        normalize_search_text: function (text) {
            return removeAcentos(text.toLowerCase());
        }
    });
    $('#' + idElem + '_chosen').addClass('chosen-min');
    forcePlaceHoldChosen();
}
export function setChartUsuariosAtiv(data = false) {
    var arrayPlanos = (data) ? data : arrayConfigAtividades.planos;
    var unidadesPlanos = (typeof data !== 'undefined' && data != 0 && data.length > 0)
        ? uniqPro(jmespath.search(data, "[?sigla_unidade].sigla_unidade"))
        : [];
    var optionSelectUser = '<option value="0" data-label="">&nbsp;</option>';
    if (unidadesPlanos.length > 1) {
        $.each(unidadesPlanos, function (index, sigla_unidade) {
            var arrayResp = jmespath.search(arrayPlanos, "[?sigla_unidade=='" + sigla_unidade + "']");
            var uniqUser = [];
            optionSelectUser += '<optgroup label="' + sigla_unidade + '">';
            optionSelectUser += $.map(arrayResp, function (v) {
                var selected = (getOptionsPro('selectChartAtiv') && getOptionsPro('selectChartAtiv').id_user == v.id_user) ? 'selected' : '';
                if (!uniqUser.includes(v.id_user)) {
                    uniqUser.push(v.id_user);
                    return '<option value="' + v.id_user + '"  data-label="' + sigla_unidade + '" ' + selected + '>' + v.apelido + '</option>';
                }
            }).join('');
            optionSelectUser += '</optgroup>';
        });
    } else {
        var uniqUser = [];
        optionSelectUser += $.map(jmespath.search(arrayPlanos, "[]"), function (v) {
            var selected = (getOptionsPro('selectChartAtiv') && getOptionsPro('selectChartAtiv').id_user == v.id_user) ? 'selected' : '';
            if (!uniqUser.includes(v.id_user)) {
                uniqUser.push(v.id_user);
                return '<option value="' + v.id_user + '"  data-label="' + unidadesPlanos + '" ' + selected + '>' + v.apelido + '</option>';
            }
        }).join('');
    }
    $('#selectChartUserAtiv').html(optionSelectUser).chosen("destroy").chosen({
        placeholder_text_single: ' ',
        no_results_text: 'Nenhum resultado encontrado',
        normalize_search_text: function (text) {
            return removeAcentos(text.toLowerCase());
        }
    });
    $('#selectChartUserAtiv_chosen').addClass('chosen-min');
}
export function setChartDemandasAtiv(data) {
    var idElem = 'chartAtivPanelDemandas';
    var title = __.Demandas + ' por m\u00EAs';
    var xTitle = 'M\u00EAs';
    var yTitle = __.Demandas + '';
    var chartData = {
        labels: jmespath.search(data, "[*].label"),
        datasets: [{
            label: 'Distribu\u00EDdas',
            lineTension: 0,
            backgroundColor: chartColors.red,
            borderColor: chartColors.red,
            data: jmespath.search(data, "[*].demandas"),
            fill: false,
        }, {
            label: 'Entregues',
            lineTension: 0,
            backgroundColor: chartColors.blue,
            borderColor: chartColors.blue,
            borderDash: [5, 5],
            data: jmespath.search(data, "[*].entregas"),
            fill: false
        }]
    };
    setChartLines(idElem, chartData, title, xTitle, yTitle);
}
export function setChartDemandasProdutividadeMesAtiv(data) {
    var idElem = 'chartAtivPanelProdutividadeMes';
    var title = 'Produtividade por m\u00EAs';
    var xTitle = 'M\u00EAs';
    var yTitle = 'Produtividade';
    var datasets = [];
    var iColor = 0;
    $.each(data[0].produtividade, function (i, v) {
        var colorSet = chartColors[Object.keys(chartColors)[iColor]];
        datasets.push({
            label: v.apelido,
            // lineTension: 0,
            backgroundColor: colorSet,
            borderColor: colorSet,
            data: $.map(jmespath.search(data, "[*].produtividade | [*][?apelido=='" + v.apelido + "'].produtividade"), function (v) { return parseFloat(v) }),
            fill: false,
        });
        if (Object.keys(chartColors).length - 1 == i) {
            iColor = 0;
        } else {
            iColor++;
        }
    });
    var chartData = {
        labels: jmespath.search(data, "[*].label"),
        datasets: datasets
    };
    setChartLines(idElem, chartData, title, xTitle, yTitle);
}
export function setChartDemandasEstoqueAtiv(data) {
    var idElem = 'chartAtivPanelEstoque';
    var datasets = data.estoque;
    var labels = data.label;
    var title = 'Estoque de  ' + __.Demandas;
    var backgroundColor = [
        chartColors.green,
        chartColors.blue,
        chartColors.red
    ];
    setChartDonut(idElem, datasets, labels, title, backgroundColor);
}
export function setChartDemandasProcessuaisAtiv(data) {
    var idElem = 'chartAtivPanelProcessuais';
    var datasets = data.processuais;
    var labels = data.label;
    var title = __.Demandas + ' Processuais x N\u00E3o Processuais';
    var backgroundColor = [
        chartColors.blue,
        chartColors.green
    ];
    setChartPie(idElem, datasets, labels, title, backgroundColor);
}
export function setChartDemandasMediaTempoAtiv(data) {
    var idElem = 'chartAtivPanelMediaTempo';
    var datasets = [{
        label: __.Demandas + ' \u00DAnicas',
        backgroundColor: chartColors.orange,
        data: data.mediatempo.demandas_unicas
    }, {
        label: 'Tempo Despendido',
        backgroundColor: chartColors.green,
        data: data.mediatempo.tempo_despendido
    }, {
        label: 'Dias Despendido',
        backgroundColor: chartColors.blue,
        data: data.mediatempo.dias_despendido
    }];
    var labels = data.label;
    var title = __.Demandas + ' Processuais x N\u00E3o Processuais';
    setChartHbar(idElem, datasets, labels, title);
}
export function setChartDemandasStatusEntregasAtiv(data) {
    var idElem = 'chartAtivPanelStatusEntregas';
    var datasets = data.statusentregas;
    var labels = data.label;
    var title = 'Status das Entregas';
    var backgroundColor = [
        chartColors.green,
        chartColors.orange
    ];
    setChartDonut(idElem, datasets, labels, title, backgroundColor);
}
export function setChartDemandasRequisicoesAtiv(data) {
    var idElem = 'chartAtivPanelRequisicoes';
    var datasets = jmespath.search(data, "[*].total_requisicoes");
    var labels = jmespath.search(data, "[*].nome_requisicao");
    var title = 'Tipos de Requisi\u00E7\u00E3o';
    setChartPie(idElem, datasets, labels, title);
}
export function setChartDemandasDocumentosAtiv(data) {
    var idElem = 'chartAtivPanelDocumentos';
    var datasets = jmespath.search(data, "[*].total_documentos");
    var labels = jmespath.search(data, "[*].nome_documento");
    var title = 'Tipos de Documentos';
    setChartPie(idElem, datasets, labels, title);
}
export function setChartDemandasProdutividadeAtiv(data) {
    var idElem = 'chartAtivPanelProdutividade';
    var title = 'Ganho de Produtividade';
    var chartData = {
        labels: jmespath.search(data, "[*].apelido"),
        datasets: [{
            type: 'line',
            yAxesGroup: "1",
            label: 'Produtividade',
            borderColor: window.chartColors.red,
            borderWidth: 2,
            fill: false,
            data: jmespath.search(data, "[*].produtividade")
        }, {
            type: 'bar',
            yAxesGroup: "2",
            label: 'Tempo Pactuado',
            backgroundColor: window.chartColors.blue,
            data: jmespath.search(data, "[*].tempo_pactuado")
        }, {
            type: 'bar',
            yAxesGroup: "2",
            label: 'Tempo Despendido',
            backgroundColor: window.chartColors.green,
            data: jmespath.search(data, "[*].tempo_despendido")
        }]
    };
    setChartLineBar(idElem, chartData, title);
}
export function setChartLines(idElem, chartData, title, xTitle, yTitle) {
    $('#' + idElem).html('<canvas id="' + idElem + '_canvas" width="380" height="200"></canvas>');
    var element = $('#' + idElem + '_canvas');
    Chart.getChart(element[0])?.destroy();

    var chartLines = new Chart(element, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    align: 'end',
                    labels: {
                        boxWidth: 10,
                        font: { size: 10 }
                    },
                    onClick: setChartLabelItemStore
                },
                title: {
                    display: true,
                    text: title
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: xTitle
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: yTitle
                    }
                }
            }
        }
    });
    getChartLabelItemStore(idElem, chartLines);
}
export function setChartLines2Y(idElem, chartData, title, xTitle, y1Title, y2Title) {
    $('#' + idElem).html('<canvas id="' + idElem + '_canvas" width="380" height="200"></canvas>');
    var element = $('#' + idElem + '_canvas');
    Chart.getChart(element[0])?.destroy();

    var chartLines = new Chart(element, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    align: 'end',
                    labels: {
                        boxWidth: 10,
                        font: { size: 10 }
                    },
                    onClick: setChartLabelItemStore
                },
                title: {
                    display: true,
                    text: title
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label;
                            let value = context.parsed.y;
                            return (label.indexOf('Produtividade') === -1) ? label + ': ' + value : label + ': ' + (value * 100).toLocaleString('pt-BR') + '%';
                        }
                    },
                }
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: xTitle
                    }
                },
                y: {
                    display: true,
                    type: 'linear',
                    position: 'left',
                    min: 0,
                    ticks: {
                        callback: function (value) {
                            return (value * 100).toLocaleString('pt-BR') + '%';
                        },
                    },
                    title: {
                        display: true,
                        text: y1Title
                    }
                },
                y1: {
                    display: true,
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: y2Title
                    }
                }
            }
        }
    });
    getChartLabelItemStore(idElem, chartLines);
}
export function setChartLineBar(idElem, chartData, title) {
    $('#' + idElem).html('<canvas id="' + idElem + '_canvas" width="380" height="200"></canvas>');
    var element = $('#' + idElem + '_canvas');
    Chart.getChart(element[0])?.destroy();

    var chartLineBar = new Chart(element, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                y: {
                    type: 'linear',
                    position: 'left'
                },
                y1: {
                    type: 'linear',
                    position: 'right'
                }
            },
            plugins: {
                legend: {
                    display: true,
                    align: 'end',
                    labels: {
                        boxWidth: 10,
                        font: { size: 10 }
                    },
                    onClick: setChartLabelItemStore
                },
                title: {
                    display: true,
                    text: title
                },
                tooltip: {
                    mode: 'index',
                    intersect: true
                }
            },
            responsive: true
        }
    });
    getChartLabelItemStore(idElem, chartLineBar);
}
export function setChartPie(idElem, datasets, labels, title, backgroundColor = false) {
    $('#' + idElem).html('<canvas id="' + idElem + '_canvas" width="380" height="300"></canvas>');
    var element = $('#' + idElem + '_canvas');
    Chart.getChart(element[0])?.destroy();

    backgroundColor = (backgroundColor)
        ? backgroundColor
        : $.map(chartColors, function (v) { return v });
    var chartPie = new Chart(element, {
        type: 'pie',
        data: {
            datasets: [{
                data: datasets,
                backgroundColor: backgroundColor,
                label: 'Dados'
            }],
            labels: labels
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    align: 'end',
                    labels: {
                        boxWidth: 10,
                        font: { size: 10 }
                    },
                    onClick: setChartLabelItemStore
                },
                title: {
                    display: true,
                    text: title
                }
            },
            responsive: true
        }
    });
    getChartLabelItemStore(idElem, chartPie);
}
export function setChartDonut(idElem, datasets, labels, title, backgroundColor = false) {
    $('#' + idElem).html('<canvas id="' + idElem + '_canvas" width="380" height="300"></canvas>');
    var element = $('#' + idElem + '_canvas');
    Chart.getChart(element[0])?.destroy();

    backgroundColor = (backgroundColor)
        ? backgroundColor
        : $.map(chartColors, function (v) { return v });
    var chartDonut = new Chart(element, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: datasets,
                backgroundColor: backgroundColor,
                label: 'Dados'
            }],
            labels: labels
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    align: 'end',
                    labels: {
                        boxWidth: 10,
                        font: { size: 10 }
                    },
                    onClick: setChartLabelItemStore
                },
                title: {
                    display: true,
                    text: title
                }
            },
            responsive: true
        }
    });
    getChartLabelItemStore(idElem, chartDonut);
}
export function setChartHbar(idElem, datasets, labels, title) {
    $('#' + idElem).html('<canvas id="' + idElem + '_canvas" width="380" height="250"></canvas>');
    var element = $('#' + idElem + '_canvas');
    Chart.getChart(element[0])?.destroy();

    var chartHBar = new Chart(element, {
        type: 'bar',
        data: {
            datasets: datasets,
            labels: labels
        },
        options: {
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: true,
                    align: 'end',
                    labels: {
                        boxWidth: 10,
                        font: { size: 10 }
                    },
                    onClick: setChartLabelItemStore
                },
                title: {
                    display: true,
                    text: title
                }
            },
            responsive: true
        }
    });
    getChartLabelItemStore(idElem, chartHBar);
}
export function getChartPlanosTrabalho(data = false, checkProgramado = true) {
    var idElem = 'chartAtivPanelPlanos';

    var selectChart = getOptionsPro('selectChartAtiv');
    var selectPrograma = $('#selectChartProgramasAtiv');
    var selectUnidadeID = selectPrograma.find('option:selected').data('id_unidade');
    selectUnidadeID = (typeof selectUnidadeID !== 'undefined' && selectUnidadeID !== null) ? selectUnidadeID : 0;
    var id_unidade = (typeof selectChart !== 'undefined' && selectChart && selectChart.id_unidade !== null) ? selectChart.id_unidade : selectUnidadeID;

    var qunidade = (id_unidade != 0) ? "?id_unidade==`" + id_unidade + "`" : "*";
    var id_user = $('#selectChartUserAtiv').val();
    var quser = (id_user != 0) ? "?id_user==`" + id_user + "`" : "*";
    var planosSelected = (data) ? jmespath.search(data, "[" + qunidade + "] | [" + quser + "] | [?data_fim=='0000-00-00 00:00:00']") : null;
    planosSelected = (planosSelected !== null && planosSelected.length > 0) ? planosSelected : false;
    var elemChart = $('#' + idElem);

    if (planosSelected && elemChart.length > 0) {
        var height = (planosSelected.length > 1)
            ? 23 * (planosSelected.length + 1)
            : 80;
        var infoPlanos = '<div style="position: absolute;right: 20px;" class="infoPlanosChart"><a class="newLink" data-act="atividades-call" data-fn="dialogNomenclaturasPlanos" data-pass-el="0"><i class="fas fa-info-circle"></i>Entenda as nomenclaturas</a></div>';
        elemChart.find('.infoPlanosChart').remove();
        elemChart.html(infoPlanos + '<canvas id="' + idElem + '_canvas" width="380" height="' + height + '"></canvas>');
        var element = $('#' + idElem + '_canvas');
        if (element.length > 0) {
            Chart.getChart(element[0])?.destroy();
            var dataset = [{
                label: 'Homologado',
                backgroundColor: chartColors.green,
                data: jmespath.search(planosSelected, "[].tempo_homologado")
            }, {
                label: 'Entregue',
                backgroundColor: chartColors.dark_blue,
                data: jmespath.search(planosSelected, "[].tempo_entregue")
            }, {
                label: 'Despendido',
                backgroundColor: chartColors.yellow,
                data: jmespath.search(planosSelected, "[].tempo_despendido"),
                hidden: callAtiv('checkOptionEntidade','desativa_produtividade_geral')
            }, {
                label: 'Pactuado',
                backgroundColor: chartColors.blue,
                data: jmespath.search(planosSelected, "[].tempo_pactuado")
            }, {
                label: 'Programado',
                backgroundColor: chartColors.silver,
                data: jmespath.search(planosSelected, "[].tempo_programado")
                /* data: $.map(planosSelected, function(v){
                            var tempoProgramado = moment(v.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').diff(moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss'),'days');
                                tempoProgramado = (tempoProgramado) ? v.tempo_proporcional/tempoProgramado : tempoProgramado;
                                tempoProgramado = (tempoProgramado) ? parseInt((moment().diff(moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss'),'days'))*tempoProgramado) : tempoProgramado;
                                tempoProgramado = (tempoProgramado > v.tempo_proporcional) ? v.tempo_proporcional : tempoProgramado;
                            if (tempoProgramado || tempoProgramado == 0) { return tempoProgramado };
                        }) */
            }, {
                label: 'Plano',
                backgroundColor: chartColors.light_grey,
                data: jmespath.search(planosSelected, "[].tempo_proporcional")
            }];
            var id_unidade_perfil = (id_unidade && id_unidade > 0) ? id_unidade : arrayConfigAtivUnidade.id_unidade;
            var mostrar_notas = jmespath.search(arrayConfigAtividades.unidades, "[?id_unidade==`" + id_unidade_perfil + "`] | [0].config.planos.mostrar_notas");
            var apelido_display = (mostrar_notas !== null && mostrar_notas) ? 'apelido_avaliacao_duracao' : 'apelido';
            var planos = jmespath.search(planosSelected, "{tempo_projetado: max([*].tempo_pactuado), tempo_total: max([*].tempo_proporcional)}");

            // console.log('apelido_display',apelido_display, id_unidade, mostrar_notas, id_unidade_perfil);

            var chartTempoPlano = new Chart(element, {
                type: 'bar',
                data: {
                    labels: jmespath.search(planosSelected, "[]." + apelido_display),
                    datasets: dataset,
                    dataplanos: jmespath.search(planosSelected, "[].id_plano")
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        x: {
                            grid: { display: false },
                            min: 0,
                            max: (planos.tempo_projetado > planos.tempo_proporcional) ? planos.tempo_projetado : planos.tempo_proporcional,
                            ticks: {
                                font: { size: 10 },
                                padding: -10
                            }
                        },
                        y: {
                            stacked: true,
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            align: 'end',
                            labels: {
                                boxWidth: 10,
                                color: (localStorage.getItem('darkModePro') ? chartColors.light_grey : chartColors.dark_grey),
                                font: { size: 10 }
                            },
                            onClick: setChartLabelItemStore
                        },
                        title: {
                            display: true,
                            text: 'Planos de Trabalho (' + planosSelected.length + ')'
                        },
                        tooltip: {
                            caretPadding: -10,
                            caretSize: 0,
                            callbacks: {
                                title: function () { return ''; },
                                label: function (context) {
                                    let label = context.dataset.label;
                                    let value = context.parsed.x;
                                    var planoIndex = context.chart.data.datasets.findIndex(function (id_key) {
                                        return id_key.label == "Plano"
                                    });
                                    let valuePlano = context.chart.data.datasets[planoIndex].data[context.dataIndex];
                                    var valuePercent = (context.datasetIndex != planoIndex) ? ' (' + ((value / valuePlano) * 100).toFixed(2) + '%)' : '';
                                    return ' ' + label + ': ' + value + ' horas' + valuePercent;
                                }
                            }
                        }
                    }
                }
            });

            element.on('click', function (evt) {
                var activePoints = chartTempoPlano.getElementsAtEventForMode(evt[0] || evt, 'point', chartTempoPlano.options, true);
                var firstPoint = activePoints[0];
                if (typeof firstPoint !== 'undefined') {
                    var label = chartTempoPlano.data.labels[firstPoint.index];
                    var id_plano = chartTempoPlano.data.dataplanos[firstPoint.index];
                    var value = chartTempoPlano.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
                    callAtiv('getChartProdutividadeMes',id_plano);
                }
            });
            setTimeout(() => {
                if (checkProgramado) {
                    getTempoProgamadoPlanos();
                    $('.infoPlanosChart').prepend('<a class="newLink calcTempoProgramado"><i class="fas fa-sync fa-spin"></i> Calculando tempo programado <span></span></a>');
                }
            }, 1000);
            getChartLabelItemStore(idElem, chartTempoPlano);
        }
    } else {
        elemChart.html('<div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div>');
    }
}
export function getTempoProgamadoPlanos() {
    var dataPlanos = window.chart_data_planos;
    var listPlanos = typeof dataPlanos !== 'undefined' ? jmespath.search(dataPlanos, "[?!tempo_programado]") : null;
    var id_plano = typeof listPlanos !== 'undefined' && listPlanos !== null && listPlanos.length ? listPlanos[0].id_plano : null;
    if (id_plano !== null) {
        var statusProgress = dataPlanos.length - listPlanos.length + '/' + dataPlanos.length;
        callAtiv('getChartProdutividadeMes',id_plano, 'get', false, false);
        $('.calcTempoProgramado span').text('(' + statusProgress + ')');
    } else if (typeof dataPlanos !== 'undefined' && dataPlanos.length) {
        getChartPlanosTrabalho(dataPlanos, false);
        $('.calcTempoProgramado').remove();
    }
}
export function dialogNomenclaturasPlanos() {

    var htmlBox = '<div id="boxInfoPlanos" class="atividadeWork seipro-atividades-work">' +
        '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableInfo tableZebra tableFollow">' +
        '      <tr>' +
        '          <td style="text-align: left;width: 200px;" class="label">' +
        '               <label style="background-color: ' + chartColors.light_grey + ';padding: 5px 8px;border-radius: 5px;"><i class="iconPopup iconSwitch fas fa-clock cinzaColor"></i>Tempo do Plano:</label>' +
        '           </td>' +
        '           <td style="text-align: left;">' +
        '               <label>Tempo l\u00EDquido estabelecido para o cumprimento do plano de trabalho (meta), j\u00E1 reduzido pelos afastamentos e dias n\u00E3o-\u00FAteis (tempo proporcional).</label>' +
        '           </td>' +
        '      </tr>' +
        '      <tr>' +
        '          <td style="text-align: left;" class="label">' +
        '               <label style="background-color: ' + chartColors.blue + ';color:#fff;padding: 5px 8px;border-radius: 5px;"><i class="iconPopup iconSwitch fas fa-handshake cinzaColor"></i>Tempo Pactuado:</label>' +
        '           </td>' +
        '           <td style="text-align: left;">' +
        '               <label>Somat\u00F3rio dos tempos acordados de todas as demandas <u>cadastradas</u> dentro do plano de trabalho. Em outras palavras, significa o total de tempos a serem entregues pela usu\u00E1rio nas demandas criadas no plano.</label>' +
        '           </td>' +
        '      </tr>' +
        '      <tr>' +
        '          <td style="text-align: left;" class="label">' +
        '               <label style="background-color: ' + chartColors.dark_blue + ';color:#fff;padding: 5px 8px;border-radius: 5px;"><i class="iconPopup iconSwitch fas fa-handshake cinzaColor"></i>Tempo Entregue:</label>' +
        '           </td>' +
        '           <td style="text-align: left;">' +
        '               <label>Somat\u00F3rio dos tempos acordados de todas as demandas <u>entregues</u> dentro do plano de trabalho. Em outras palavras, significa o total de tempos j\u00E1 conclu\u00EDdos pela usu\u00E1rio nas demandas criadas no plano.</label>' +
        '           </td>' +
        '      </tr>' +
        '      <tr>' +
        '          <td style="text-align: left;" class="label">' +
        '               <label style="background-color: ' + chartColors.yellow + ';padding: 5px 8px;border-radius: 5px;"><i class="iconPopup iconSwitch fas fa-hourglass-half cinzaColor"></i>Tempo Despendido:</label>' +
        '           </td>' +
        '           <td style="text-align: left;">' +
        '               <label>Somat\u00F3rio dos tempo de execu\u00E7\u00E3o de todas as demandas <u>entregues</u> dentro do plano de trabalho. Em outros termos, representa o total de tempos de dura\u00E7\u00E3o das demandas realizadas no plano.</label>' +
        '           </td>' +
        '      </tr>' +
        '      <tr>' +
        '          <td style="text-align: left;" class="label">' +
        '               <label style="background-color: ' + chartColors.green + ';color:#fff;padding: 5px 8px;border-radius: 5px;"><i class="iconPopup iconSwitch fas fa-star cinzaColor"></i>Tempo Homologado:</label>' +
        '           </td>' +
        '           <td style="text-align: left;">' +
        '               <label>Somat\u00F3rio dos tempo validados pelo gestor em todas as demandas <u>avaliadas</u> dentro do plano de trabalho. Quer dizer, total de tempos aceitos das demandas chanceladas no plano. ' +
        '                   <br>Caso a demanda seja aceita (nota final da avalia\u00E7\u00E3o maior ou igual a 5 (cinco)), o <u>tempo homologado ser\u00E1 igual ao tempo pactuado</u> da demanda. <br>Caso n\u00E3o aceita, o tempo homologado ser\u00E1 igual a 0 (zero).</label>' +
        '           </td>' +
        '      </tr>' +
        '      <tr>' +
        '          <td style="text-align: left;" class="label">' +
        '               <label style="background-color: ' + chartColors.silver + ';padding: 5px 8px;border-radius: 5px;"><i class="iconPopup iconSwitch fas fa-history cinzaColor"></i>Tempo Programado:</label>' +
        '           </td>' +
        '           <td style="text-align: left;">' +
        '               <label>Tempo estimado da meta do plano de trabalho caso ele encerrasse na data de hoje. Ou seja, \u00E9 o valor m\u00EDnimo ideal do Tempo Homologado para que o plano de trabalho seja considerado "em dia".</label>' +
        '           </td>' +
        '      </tr>' +
        '   </table>' +
        '</div>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
        .dialog({
            title: 'Nomenclaturas do Programa de Gest\u00E3o por Desempenho',
            width: 780,
            open: function () {
                updateButtonConfirm(this, true);
            },
            close: function () {
                $('#boxInfoPlanos').remove();
                resetDialogBoxPro('dialogBoxPro');
            },
        });
}
export function getSingleChartTempoPlano(element, plano, labels = false) {
    var dataset = [{
        label: 'Homologado',
        barPercentage: 0.7,
        backgroundColor: chartColors.green,
        data: [roundToTwo(plano.tempo_homologado)]
    }, {
        label: 'Entregue',
        barPercentage: 0.7,
        backgroundColor: chartColors.dark_blue,
        data: [roundToTwo(plano.tempo_entregue)]
    }, {
        label: 'Despendido',
        barPercentage: 0.7,
        backgroundColor: chartColors.yellow,
        data: [roundToTwo(plano.tempo_despendido)],
        hidden: callAtiv('checkOptionEntidade','desativa_produtividade_geral')
    }, {
        label: 'Pactuado',
        barPercentage: 0.7,
        backgroundColor: chartColors.blue,
        data: [roundToTwo(plano.tempo_pactuado)]
    }, {
        label: 'Programado',
        barPercentage: 0.7,
        backgroundColor: chartColors.silver,
        data: typeof plano.tempo_programado !== 'undefined' ? [roundToTwo(plano.tempo_programado)] : [],
        /* data: $.map([plano], function(v){
                    var tempoProgramado = moment(v.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').diff(moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss'),'days');
                        tempoProgramado = (tempoProgramado) ? v.tempo_proporcional/tempoProgramado : tempoProgramado;
                        tempoProgramado = (tempoProgramado) ? parseInt((moment().diff(moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss'),'days'))*tempoProgramado) : tempoProgramado;
                        tempoProgramado = (tempoProgramado > v.tempo_proporcional) ? v.tempo_proporcional : tempoProgramado;
                    if (tempoProgramado || tempoProgramado == 0) { return tempoProgramado };
                }) */
    }, {
        label: 'Plano',
        barPercentage: 0.7,
        backgroundColor: chartColors.light_grey,
        data: [roundToTwo(plano.tempo_proporcional)]
    }];
    // console.log(dataset);

    if (typeof plano.tempo_projetado !== 'undefined') {
        dataset.splice(3, 0, {
            label: 'Projetado',
            barPercentage: 0.7,
            backgroundColor: chartColors.purple,
            data: [roundToTwo(plano.tempo_projetado)]
        });
    }
    var chartTempoPlano = new Chart(element, {
        type: 'bar',
        data: {
            labels: [(labels ? labels : 'Tempo (h)')],
            datasets: dataset
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    grid: { display: false },
                    min: 0,
                    max: Math.max.apply(null, [
                        roundToTwo(plano.tempo_despendido),
                        roundToTwo(plano.tempo_homologado),
                        roundToTwo(plano.tempo_pactuado),
                        roundToTwo(plano.tempo_proporcional),
                        (typeof plano.tempo_projetado !== 'undefined' ? roundToTwo(plano.tempo_projetado) : 0)
                    ]),
                    ticks: {
                        font: { size: 10 },
                        padding: -10
                    }
                },
                y: {
                    stacked: true,
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    align: 'end',
                    labels: {
                        boxWidth: 10,
                        font: { size: 10 }
                    }
                },
                tooltip: {
                    caretPadding: (labels ? -60 : -70),
                    caretSize: 0,
                    callbacks: {
                        title: function () { return ''; },
                        label: function (context) {
                            var label = context.dataset.label;
                            var value = context.parsed.x;
                            var planoIndex = context.chart.data.datasets.findIndex(function (id_key) {
                                return id_key.label == "Plano"
                            });
                            var valuePlano = context.chart.data.datasets[planoIndex].data[context.dataIndex];
                            var valuePercent = (context.datasetIndex != planoIndex) ? ' (' + ((value / valuePlano) * 100).toFixed(2) + '%)' : '';
                            return ' ' + label + ': ' + value + ' horas' + valuePercent;
                        }
                    }
                }
            }
        }
    });
    return chartTempoPlano;
}
