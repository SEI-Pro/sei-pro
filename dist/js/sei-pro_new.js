// EVENTO DELEGADO PARA ELEMENTOS QUE USAVAM ondblclick
$(document).on('dblclick', '[data-action="removeCacheGroupTable"]', function () {
    removeCacheGroupTable(this);
});

// VARIÁVEL DE AÇÃO TESTE COM DATASET EM VEZ DE ONDblCLICK INLINE
const actionTest = 'data-action="removeCacheGroupTable"';
let totalSecondsTest = 0;
let totalSecondsTestText = '';
let timerTest;
const tableHomePro = [];
let kanbanProcessos = false;
let kanbanProcessosMoving = false;
const containerUpload = 'body';
let arvoreDropzone = false;
let contentW = false;
const objProcessosUnidadePro = typeof getProcessoUnidadePro !== 'undefined' ? getProcessoUnidadePro(false, true) : false;
const arrayProcessosUnidadePro = typeof getProcessoUnidadePro !== 'undefined' ? getProcessoUnidadePro() : false;

const pathArvore = (typeof isNewSEI !== 'undefined' && isNewSEI) 
    ? '/infra_js/arvore/24/' 
    : '/infra_js/arvore/';

const elemCheckbox = (typeof isNewSEI !== 'undefined' && isNewSEI) 
    ? '.infraCheckboxInput' 
    : '.infraCheckbox';

// FUNÇÃO PARA ATUALIZAR O TEMPO EM FORMATO HH:MM:SS
const setTimeTest = () => {
    totalSecondsTest++;
    const hours = Math.floor((totalSecondsTest % (60 * 60 * 24)) / 3600);
    const minutes = Math.floor((totalSecondsTest % (60 * 60)) / 60);
    const seconds = Math.floor(totalSecondsTest % 60);
    totalSecondsTestText = `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
};

// FUNÇÃO PARA CARREGAR A BIBLIOTECA DE AUTENTICA\u00C7\u00C3O DO GOOGLE
const handleClientLoadPro = (TimeOut = 3000) => {
    if (TimeOut <= 0) return;

    const hasSpreadsheetId = typeof spreadsheetIdProjetos_Pro !== 'undefined' || 
                             typeof spreadsheetIdFormularios_Pro !== 'undefined' || 
                             typeof spreadsheetIdSyncProcessos_Pro !== 'undefined';

    const isSpreadsheetDisabled = (typeof spreadsheetIdProjetos_Pro !== 'undefined' && spreadsheetIdProjetos_Pro === false) || 
                                  (typeof spreadsheetIdFormularios_Pro !== 'undefined' && spreadsheetIdFormularios_Pro === false) || 
                                  (typeof spreadsheetIdSyncProcessos_Pro !== 'undefined' && spreadsheetIdSyncProcessos_Pro === false);

    if (hasSpreadsheetId && typeof gapi !== 'undefined' && typeof initClientPro !== 'undefined') {
        gapi.load('client:auth2', initClientPro);
    } else if (isSpreadsheetDisabled) {
        console.log('notConfig handleClientLoadPro');
        return;
    } else {
        setTimeout(() => {
            handleClientLoadPro(TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) {
                console.log('Reload handleClientLoadPro');
            }
        }, 500);
    }
};

// FUNÇÃO PRINCIPAL PARA AGRUPAMENTO DE LISTA DE PROCESSOS
const getListTypes = acaoType => {
    const orderbyTableGroup = getOptionsPro('orderbyTableGroup') || 'asc';
    const arrayTag = [''];
    let acaoType_ = '';
  
    // DEFININDO A AÇÃO BASEADO NO TIPO
    switch (acaoType) {
      case 'tags':
      case 'deadline':
        acaoType_ = 'acao=andamento_marcador_gerenciar';
        break;
      case 'types':
        acaoType_ = 'acao=procedimento_trabalhar';
        break;
      case 'users':
        acaoType_ = 'acao=procedimento_atribuicao_listar';
        break;
      case 'checkpoints':
        acaoType_ = 'acao=andamento_situacao_gerenciar';
        break;
      case 'arrivaldate':
      case 'acessdate':
      case 'senddate':
      case 'senddepart':
      case 'createdate':
      case 'acompanhamentoesp':
        acaoType_ = 'acao=procedimento_trabalhar';
        break;
    }
  
    // DEFININDO TAG INICIAL COMO "SemGrupo"
    $('#divRecebidos').find('table tr').attr('data-tagname', 'SemGrupo');
  
    // PERCORRENDO OS LINKS NA TABELA
    $('#divRecebidos').find('table a').each(function(index){
        const href = $(this).attr('href');
        if (typeof href === 'undefined' || !href.includes(acaoType_)) return;
    
        // DETERMINANDO A TAG BASEADO NO TIPO DE AÇÃO
        let tag = '';
        if (acaoType === 'tags' || acaoType === 'types') {
          const attr = $(this).attr('onmouseover');
          tag = attr ? attr.split("','")[1]?.replace("');", '') : '';
        } else if (acaoType === 'users') {
          tag = $(this).text();
        } else if (acaoType === 'checkpoints') {
          const attr = $(this).attr('onmouseover');
          tag = attr ? attr.split("'")[1] : '';
        } else if (acaoType === 'senddepart') {
          const data = getArrayProcessoRecebido(href);
          tag = data?.unidadesendfull || '';
        } else if (acaoType === 'acompanhamentoesp') {
          const data = getArrayProcessoRecebido(href);
          tag = data?.acompanhamentoesp || '';
        } else if (acaoType === 'deadline') {
          const time = $(this).closest('tr').find('td.prazoBoxDisplay .dateboxDisplay').data('time-sorter');
          tag = time ? moment(time, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') : '';
        }
    

        if (
            acaoType === 'arrivaldate' || acaoType === 'acessdate' ||
            acaoType === 'senddate' || acaoType === 'createdate' ||
            acaoType === 'deadline'
          ) {
            
            // DEFINIÇÃO DAS DATAS DE REFERÊNCIA USANDO MOMENT.JS
            const now = moment();
            const startDateNow = now;
            const startDateYesterday = moment().subtract(1, 'days');
            const startDate1Yesterday = moment().subtract(2, 'days');

            const startDateWeek = moment().startOf('isoWeek');
            const endDateWeek = moment().endOf('isoWeek');

            const startDateLastWeek = moment().subtract(1, 'weeks').startOf('isoWeek');
            const endDateLastWeek = moment().subtract(1, 'weeks').endOf('isoWeek');
            const startDate2LastWeek = moment().subtract(2, 'weeks').startOf('isoWeek');
            const endDate2LastWeek = moment().subtract(2, 'weeks').endOf('isoWeek');
            const startDate3LastWeek = moment().subtract(3, 'weeks').startOf('isoWeek');
            const endDate3LastWeek = moment().subtract(3, 'weeks').endOf('isoWeek');
            const startDate4LastWeek = moment().subtract(4, 'weeks').startOf('isoWeek');
            const endDate4LastWeek = moment().subtract(4, 'weeks').endOf('isoWeek');
            const startDate5LastWeek = moment().subtract(5, 'weeks').startOf('isoWeek');
            const endDate5LastWeek = moment().subtract(5, 'weeks').endOf('isoWeek');

            const startDateLastMonth = moment().subtract(1, 'months').startOf('month');
            const endDateLastMonth = moment().subtract(1, 'months').endOf('month');
            const startDate2LastMonth = moment().subtract(2, 'months').startOf('month');
            const endDate2LastMonth = moment().subtract(2, 'months').endOf('month');
            const startDate3LastMonth = moment().subtract(3, 'months').startOf('month');
            const endDate3LastMonth = moment().subtract(3, 'months').endOf('month');

            const startDateLastQuarter = moment().subtract(10, 'months').startOf('month');
            const endDateLastQuarter = moment().subtract(4, 'months').endOf('month');

            const startDateLastYear = moment().subtract(1, 'years');
            const endDateLastYear = moment().subtract(11, 'months').endOf('month');

            const startDateTomorrow = moment().add(1, 'day');
            const startDate1Tomorrow = moment().add(2, 'day');

            const startDateNextWeek = moment().add(1, 'week').startOf('isoWeek');
            const endDateNextWeek = moment().add(1, 'week').endOf('isoWeek');
            const startDate2NextWeek = moment().add(2, 'week').startOf('isoWeek');
            const endDate2NextWeek = moment().add(2, 'week').endOf('isoWeek');
            const startDate3NextWeek = moment().add(3, 'week').startOf('isoWeek');
            const endDate3NextWeek = moment().add(3, 'week').endOf('isoWeek');
            const startDate4NextWeek = moment().add(4, 'week').startOf('isoWeek');
            const endDate4NextWeek = moment().add(4, 'week').endOf('isoWeek');
            const startDate5NextWeek = moment().add(5, 'week').startOf('isoWeek');
            const endDate5NextWeek = moment().add(5, 'week').endOf('isoWeek');

            const startDateNextMonth = moment().add(1, 'month').startOf('month');
            const endDateNextMonth = moment().add(1, 'month').endOf('month');
            const startDate2NextMonth = moment().add(2, 'month').startOf('month');
            const endDate2NextMonth = moment().add(2, 'month').endOf('month');
            const startDate3NextMonth = moment().add(3, 'month').startOf('month');
            const endDate3NextMonth = moment().add(3, 'month').endOf('month');

            const startDateNextQuarter = moment().add(4, 'month').startOf('month');
            const endDateNextQuarter = moment().add(6, 'month').endOf('month');

            const startDateNextYear = moment().add(1, 'year');
            const endDateNextYear = moment().add(11, 'month').endOf('month');

            // OBTÊM A DATA DO PROCESSO COM BASE NO TIPO DE AÇÃO
            const getDataRecebido = (acaoType, href) => {
                const processo = getArrayProcessoRecebido(href);
                switch (acaoType) {
                    case 'arrivaldate': return processo.datahora;
                    case 'acessdate': return processo.datetime;
                    case 'senddate': return processo.datesend;
                    case 'createdate': return processo.datageracao;
                    case 'deadline': return $(this).closest('tr').find('td.prazoBoxDisplay .dateboxDisplay').data('time-sorter');
                    default: return '';
                }
            };

            dataRecebido = getDataRecebido(acaoType, href);
            dataRecebido = (typeof dataRecebido !== 'undefined' && dataRecebido !== '') 
                ? moment(dataRecebido, 'YYYY-MM-DD HH:mm:ss') 
                : '';

            // FUNÇÃO AUXILIAR PARA VERIFICAR INTERVALO E ATRIBUIR TAG
            const verificaIntervalo = (cond, ascChar, descChar, label) => {
                if (cond) {
                    tag = `${orderbyTableGroup === 'asc' ? ascChar : descChar}.${label}`;
                }
            };
            
            // INTERVALOS DE TEMPO PASSADO
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDateWeek, endDateWeek), 'l', 'k', 'Essa semana');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDateLastWeek, endDateLastWeek), 'k', 'r', 'Semana passada');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDate2LastWeek, endDate2LastWeek), 'j', 's', 'Duas semana atr\u00E1s');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDate3LastWeek, endDate3LastWeek), 'i', 't', 'Tr\u00EAs semana atr\u00E1s');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDate4LastWeek, endDate4LastWeek), 'h', 'u', 'Quatro semana atr\u00E1s');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDate5LastWeek, endDate5LastWeek), 'g', 'v', 'Cinco semana atr\u00E1s');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDateLastMonth, endDateLastMonth), 'f', 'w', 'Um m\u00EAs atr\u00E1s');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDate2LastMonth, endDate2LastMonth), 'e', 'x', 'Dois meses atr\u00E1s');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDate3LastMonth, endDate3LastMonth), 'd', 'y', 'Tr\u00EAs meses atr\u00E1s');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDateLastQuarter, endDateLastQuarter), 'c', 'za', 'Seis meses atr\u00E1s');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDateLastYear, endDateLastYear), 'b', 'zb', 'Um ano atr\u00E1s');
            verificaIntervalo(dataRecebido !== '' && dataRecebido < endDateLastYear, 'a', 'zc', 'Maior que um ano atr\u00E1s');

            // INTERVALOS DE TEMPO FUTURO
            verificaIntervalo(dataRecebido !== '' && dataRecebido > endDateNextYear, 'zc', 'a', 'Maior que um ano');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDateNextYear, endDateNextYear), 'zb', 'b', 'Em um ano');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDateNextQuarter, endDateNextQuarter), 'za', 'c', 'Em seis meses');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDate3NextMonth, endDate3NextMonth), 'y', 'd', 'Em tr\u00EAs meses');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDate2NextMonth, endDate2NextMonth), 'x', 'e', 'Em dois meses');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDateNextMonth, endDateNextMonth), 'w', 'f', 'Em um m\u00EAs');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDate5NextWeek, endDate5NextWeek), 'v', 'g', 'Em cinco semana');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDate4NextWeek, endDate4NextWeek), 'u', 'h', 'Em quatro semana');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDate3NextWeek, endDate3NextWeek), 't', 'i', 'Em tr\u00EAs semana');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDate2NextWeek, endDate2NextWeek), 's', 'j', 'Em duas semana');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.isBetween(startDateNextWeek, endDateNextWeek), 'r', 'k', 'Semana quem vem');

            // DIAS ESPEC\u00CDFICOS
            verificaIntervalo(dataRecebido !== '' && dataRecebido.format('YYYY-MM-DD') === startDate1Tomorrow.format('YYYY-MM-DD'), 'q', 'l', 'Depois de amanh\u00E3');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.format('YYYY-MM-DD') === startDateTomorrow.format('YYYY-MM-DD'), 'p', 'm', 'Amanh\u00E3');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.format('YYYY-MM-DD') === startDateNow.format('YYYY-MM-DD'), 'o', 'n', 'Hoje');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.format('YYYY-MM-DD') === startDateYesterday.format('YYYY-MM-DD'), 'n', 'o', 'Ontem');
            verificaIntervalo(dataRecebido !== '' && dataRecebido.format('YYYY-MM-DD') === startDate1Yesterday.format('YYYY-MM-DD'), 'm', 'p', 'Anteontem');

                }
                
            var tag_ = (typeof tag !== 'undefined' && tag != '' ) ? removeAcentos(tag).replace(/\ /g, '') : 'SemGrupo';
            var tr_tag = $(this).closest('tr')
                tr_tag.attr('data-tagname', tag_);
                if (getOptionsPro('panelGroup_'+tag_))  tr_tag.hide();

            arrayTag.push(tag);
    });
    return uniqPro(arrayTag).sort();
}

// FUNÇÃO PARA ADICIONAR LINHAS GERADAS À TABELA DE RECEBIDOS
const appendGerados = (type) => {
    const orderbyDesc = getOptionsPro('orderbyTableGroup') === 'desc';

    $('#divGerados table tr').not('.tablesorter-filter-row').each((index, el) => {
        if (!$(el).find('th').length) {
            // const sanitizedHTML = sanitizeHTML($('<div>').append($(el).clone().addClass('typeGerados')).html());
            const sanitizedHTML = ($('<div>').append($(el).clone().addClass('typeGerados')).html());
            $('#divRecebidos').find('table tbody').append(sanitizedHTML);
        }
    });

    $('#divGerados').addClass('displayNone');
    $('#divRecebidos').addClass('tagintable');
    $('#divRecebidosAreaTabela').addClass('tabelaPanelScroll');

    const tbody = $('#divRecebidos tbody');

    tbody.find('tr').each(function() {
        let dataRecebido = '';
        const link = $(this).find('td').eq(2).find('a');

        if (link.length) {
            const data = getArrayProcessoRecebido(link.attr('href'));
            if (data) {
                if (type === 'arrivaldate') dataRecebido = moment(data.datahora, 'YYYY-MM-DD HH:mm:ss').unix();
                else if (type === 'acessdate') dataRecebido = moment(data.datetime, 'YYYY-MM-DD HH:mm:ss').unix();
                else if (type === 'createdate') dataRecebido = moment(data.datageracao, 'YYYY-MM-DD HH:mm:ss').unix();
                else if (type === 'senddate') dataRecebido = moment(data.datesend, 'YYYY-MM-DD HH:mm:ss').unix();
            }
        }

        if (dataRecebido !== '' && !isNaN(dataRecebido)) {
            $(this).attr('data-order', dataRecebido);
        }
    }).sort((a, b) => {
        const tda = $(a).data('order');
        const tdb = $(b).data('order');

        return ['arrivaldate', 'senddate', 'senddepart', 'createdate', 'acompanhamentoesp'].includes(type)
            ? (tda > tdb ? (orderbyDesc ? 1 : -1) : (tda < tdb ? (orderbyDesc ? -1 : 1) : 0))
            : (tda > tdb ? (orderbyDesc ? -1 : 1) : (tda < tdb ? (orderbyDesc ? 1 : -1) : 0));
    }).appendTo(tbody);

    initPanelResize('#divRecebidosAreaTabela.tabelaPanelScroll', 'recebidosPro');

    if ($('#divRecebidosAreaPaginacaoInferior a').length === 0) {
        $('#divRecebidosAreaPaginacaoInferior').hide();
    }
};

// REMOVE VALORES DUPLICADOS DE UM INPUT SELECIONADO
const removeDuplicateValue = (element) => {
    if ($(element).length) {
        const unique = uniqPro($(element).val().split(',')).join(',');
        $(element).val(unique);
    }
};

// SELECIONA/DESMARCA TODOS OS CHECKBOXES DE UMA TABELA
const setSelectAllTr = (this_, tagname = false) => {
    const limit = 100;
    let index = $(this_).data('index') || 0;
    const tagname_select = tagname ? `tr[data-tagname="${tagname}"]:visible` : 'tr:visible';
    let listCheckbox = [];

    let checkbox = $(this_).closest('table').find(tagname_select).find('input[type=checkbox]:not(.onoffswitch-checkbox)');
    const t = (checkbox.length > limit) ? Math.round(checkbox.length / limit) : true;

    if (index < 1) {
        if (t) {
            for (let i = 0; i <= t; i++) {
                const init = i * limit;
                const end = (i + 1) * limit;
                listCheckbox.push(checkbox.slice(init, end));
            }
        } else {
            checkbox.trigger('click');
        }
        $(this_).data('index', index + 1);
    } else {
        checkbox = $(this_).closest('table').find(tagname_select).find('input[type=checkbox]:not(.onoffswitch-checkbox):checked');
        const t = (checkbox.length > limit) ? Math.round(checkbox.length / limit) : false;

        if (t) {
            for (let i = 0; i <= t; i++) {
                const init = i * limit;
                const end = (i + 1) * limit;
                listCheckbox.push(checkbox.slice(init, end));
            }
        } else {
            checkbox.trigger('click');
        }
        $(this_).data('index', 0);
    }

    updateTipSelectAll(this_);

    if (t) {
        listCheckbox.forEach((value, i) => {
            setTimeout(() => value.trigger('click'));
        });
    }
};

// DEFINE A SELEÇÃO CONFORME A PRESENÇA DE "SemGrupo"
const getSelectAllTr = (this_, tagname) => {
    if ($(this_).closest('table').find('tr[data-tagname="SemGrupo"]:visible input[type=checkbox]:checked').length > 0) {
        setSelectAllTr(this_, 'SemGrupo');
    } else {
        setSelectAllTr(this_, tagname);
    }
    removeDuplicateValue('#hdnRecebidosItensSelecionados');
    removeDuplicateValue('#hdnGeradosItensSelecionados');
};

// ATUALIZA A DICA DE SELECIONAR TUDO NO MOUSEOVER
const updateTipSelectAll = (this_) => {
    const _this = $(this_);
    const data = _this.data();
    const table = _this.closest('table');
    let text = (table.find('input[type="checkbox"]:checked').length > 0) ? 'Inverter Sele\u00E7\u00E3o' : 'Selecionar Todos';
    text = (typeof data.index !== 'undefined' && data.index === 1) ? 'Remover Sele\u00E7\u00E3o' : text;

    _this.attr('onmouseenter', `return infraTooltipMostrar('${text}')`);
    if (_this.is(':hover')) {
        infraTooltipMostrar(text);
    } else {
        infraTooltipOcultar();
    }
};

// SUBSTITUI O BOTÃO PADR\u00C3O DE SELEÇÃO POR OUTRO COM EVENTOS DELEGADOS
const replaceSelectAll = () => {
    const tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    if (tableProc.length > 0) {
        const html = sanitizeHTML(
            `<a data-action="select-all">
                <img src="/infra_css/${typeof isNewSEI !== 'undefined' && isNewSEI ? 'svg/check.svg' : 'imagens/check.gif'}" class="infraImg">
            </a>`
        );
        tableProc.find('#lnkInfraCheck').after(html).remove();
    }
};

const cleanConfigDataRecebimento = () => {
    const storeRecebimento = (typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' &&
        !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')))
        ? localStorageRestorePro('configDataRecebimentoPro')
        : [];

    const array_procedimentos = [];

    // OBTÉM TODOS OS IDS DE PROCEDIMENTOS VISUALIZADOS NA TELA
    $('#frmProcedimentoControlar').find('a.processoVisualizado').each((i, el) => {
        array_procedimentos.push(String(getParamsUrlPro($(el).attr('href')).id_procedimento));
    });

    uniqPro(array_procedimentos);

    // REMOVE PROCEDIMENTOS NÃO VISUALIZADOS HÁ MAIS DE 30 DIAS
    for (let i = 0; i < storeRecebimento.length; i++) {
        if ($.inArray(String(storeRecebimento[i]['id_procedimento']), array_procedimentos) === -1 &&
            moment().diff(moment(storeRecebimento[i]['datetime'], 'YYYY-MM-DD HH:mm:ss'), 'days') > 30) {
            storeRecebimento.splice(i, 1);
            i--;
        }
    }

    localStorageStorePro('configDataRecebimentoPro', storeRecebimento);
};

const removeAllTags = (forceFilter = false, n) => {
    // REMOVE TAGS E RESET DE TABELAS
    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('.especifProc').remove();
    $('#divRecebidos table tbody').find('.tagintable').remove();

    $('#divRecebidos table tbody tr').each((index, el) => {
        $(el).hasClass('typeGerados') ? $(el).remove() : $(el).show();
    });

    $('#divRecebidosAreaTabela').removeClass('tabelaPanelScroll');
    if ($('#divRecebidosAreaTabela').find('.ui-resizable-handle.ui-resizable-s').length > 0 &&
        typeof $('#divRecebidosAreaTabela').resizable !== 'undefined') {
        $('#divRecebidosAreaTabela').resizable().resizable('destroy');
    }

    $('#divRecebidos').removeClass('tagintable').find('caption').show();
    $('#divRecebidos .newRowControle').remove();
    $('#divGerados').removeClass('displayNone');
    $('#divRecebidos thead').show();
    $('table tr.tablesorter-headerRow').show();
    $('#orderbyTableGroup').remove();
    if (isNewSEI) $('#divTabelaProcesso').removeClass('displayInitial');

    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado')
        .trigger('filterReset')
        .trigger('update')
        .find('.filterTableProcessos').removeClass('newLink_active');

    initControlePrazo();
    viewEspecifacaoProcesso();
    addAcompanhamentoEspIcon();
    tableHomeDestroy(true);

    // APLICA FILTROS SALVOS APÓS RESET SE NECESSÁRIO
    if (forceFilter && sessionStorageRestorePro('setFiltersTableHome')) {
        setTimeout(() => {
            $.each(tableHomePro, (i) => {
                $.tablesorter.setFilters(tableHomePro[i][0], sessionStorageRestorePro('setFiltersTableHome'), true);
                tableHomePro[i].trigger('update');
            });
        }, 1000);
    }
};

const getTagName = (tagName, type) => {
    // TRATA O NOME DA TAG CONFORME O TIPO
    let tagName_ = (typeof tagName !== 'undefined' && tagName !== '')
        ? removeAcentos(tagName).replace(/\ /g, '')
        : 'SemGrupo';

    tagName = (typeof tagName === 'undefined' && tagName === '') ? ' ' : tagName;

    if (['arrivaldate', 'acessdate', 'senddate', 'createdate', 'deadline'].includes(type) && tagName.includes('.')) {
        tagName = tagName.split('.')[1];
    }

    if (type === 'tags' && tagName.includes('#')) {
        tagName = tagName.replace(extractHexColor(tagName), '');
    }

    return tagName_;
};

const getUniqueTableTag = (i, tagName, type) => {
    const tagName_ = getTagName(tagName, type);
    const txtTagName = (['arrivaldate', 'acessdate', 'senddate', 'createdate', 'deadline'].includes(type) && tagName.includes('.'))
        ? tagName.split('.')[1]
        : tagName;

    const tbRecebidos = $('#divRecebidos table');
    const countTd = tbRecebidos.find('tr:not(.tablesorter-headerRow)').eq(1).find('td').length;

    // BOTÃO DE SELEÇÃO COM EVENTOS EMBUTIDOS (QUE SERÃO DELEGADOS)
    const iconSelect = `
        <label class="lblInfraCheck" for="lnkInfraCheck" accesskey=";"></label>
        <a id="lnkInfraCheck" data-tagname="${tagName_}">
            <img src="/infra_css/${isNewSEI ? 'svg/check.svg' : 'imagens/check.gif'}" id="imgRecebidosCheck" class="infraImg">
        </a>
    `;

    const tagCount = $('#divRecebidos table tbody').find(`tr[data-tagname="${tagName_}"]:visible`).length;

    const collapseBtn = `
        <span class="tagintable">
            <a class="controleTableTag newLink" data-htagname="${tagName_}" data-action="show" style="font-size: 11pt;${getOptionsPro('panelGroup_' + tagName_) ? '' : 'display:none;'}">
                <i class="fas fa-plus-square cinzaColor"></i>
            </a>
            <a class="controleTableTag newLink" data-htagname="${tagName_}" data-action="hide" style="font-size: 11pt;${getOptionsPro('panelGroup_' + tagName_) ? 'display:none;' : ''}">
                <i class="fas fa-minus-square cinzaColor"></i>
            </a>
        </span>
    `;

    const htmlBody = `
        <tr class="infraCaption tagintable">
            <td colspan="${countTd + 3}"><span>${tagCount} registros:</span></td>
        </tr>
        <tr data-htagname="${tagName_}" class="tagintable tableHeader">
            <th class="tituloControle ${isNewSEI ? 'infraTh' : ''}" width="5%" align="center">${iconSelect}</th>
            <th class="tituloControle ${isNewSEI ? 'infraTh' : ''}" colspan="${countTd + 2}">${txtTagName}${collapseBtn}</th>
        </tr>
    `;

    // $(sanitizeHTML(htmlBody)).appendTo('#divRecebidos table tbody');
    $((htmlBody)).appendTo('#divRecebidos table tbody');

    if (i === 0) {
        tbRecebidos.find('caption').hide();
    }
};

// FUNÇÃO PARA ESCONDER OU MOSTRAR UM GRUPO DE LINHAS NA TABELA
const toggleGroupTablePro = (this_) => {
    const _this = $(this_);
    const data = _this.data();

    const table = _this.closest('table');
    const span = _this.closest('span');
    const selector = `tr[data-tagname="${data.htagname}"]`;

    if (data.action === 'hide') {
        table.find(selector).hide();
        span.find('a[data-action="show"]').show();
        span.find('a[data-action="hide"]').hide();
        setOptionsPro(`panelGroup_${data.htagname}`, true);
    } else {
        table.find(selector).show();
        span.find('a[data-action="show"]').hide();
        span.find('a[data-action="hide"]').show();
        removeOptionsPro(`panelGroup_${data.htagname}`);
    }
};

// FUNÇÃO PARA AGRUPAR E ORGANIZAR DADOS DA TABELA POR TAGS
const getTableOnTag = (type) => {
    $('#divRecebidos table tbody tr').each(function () {
        let dataTag = $(this).attr('data-tagname') || 'SemGrupo';

        if (typeof dataTag !== 'undefined' && $(this).find('td').eq(2).find('a').length > 0) {
            const aElement = $(this).find('td').eq(2).find('a');
            const desc = aElement.attr('onmouseover').split("','");

            const txt_desc = (desc[0]) ? desc[0].replace("return infraTooltipMostrar('", "") : '';
            const txt_tipo_proc = (desc[1]) ? desc[1].replace("');", "") : '';

            const editDesc = `
                <a class="newLink newLink_active followLink followLinkDesc content_btnsave"
                   style="right: 0;top: 0;"
                   onmouseover="return infraTooltipMostrar('Editar descri\u00E7\u00E3o');"
                   onmouseout="return infraTooltipOcultar();">
                   <i class="fas fa-edit" style="font-size: 100%;"></i>
                </a>`;

            const htmlDesc = (type === 'all')
                ? `<td class="tagintable" data-old="${txt_desc}"><span class="info">${txt_desc}</span>${editDesc}</td>`
                : `<td class="tagintable" data-old="${txt_desc}"><span class="info">${txt_desc}</span>${editDesc}</td><td class="tagintable">${txt_tipo_proc}</td>`;

            const dataRecebido = getArrayProcessoRecebido(aElement.attr('href'));

            let textBoxDesc = '';
            if (type === 'arrivaldate' || type === 'acessdate') {
                textBoxDesc = `${dataRecebido.descricao} em: ${moment(dataRecebido.datahora, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')}<br>`;
            } else if (type === 'createdate') {
                textBoxDesc = `${dataRecebido.descricaodatageracao} em: ${moment(dataRecebido.datageracao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')}<br>`;
            } else if (dataRecebido.datesend !== '') {
                textBoxDesc = `${dataRecebido.descricaosend} em: ${moment(dataRecebido.datesend, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')}<br>`;
            }

            const textBox = `${textBoxDesc}\u00DAltimo acesso em: ${moment(dataRecebido.datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')}`;

            let textDataRecebido = '';
            if (dataRecebido && type === 'acessdate') {
                textDataRecebido = moment(dataRecebido.datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
            } else if (dataRecebido && type === 'arrivaldate') {
                textDataRecebido = moment(dataRecebido.datahora, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
            } else if (dataRecebido && type === 'createdate') {
                textDataRecebido = moment(dataRecebido.datageracao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
            } else if (dataRecebido && ['senddate', 'senddepart', 'acompanhamentoesp'].includes(type) && dataRecebido.datesend !== '') {
                textDataRecebido = moment(dataRecebido.datesend, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
            }

            let htmlDataRecebido = dataRecebido
                ? `<td class="tagintable"><span onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('${sanitizeHTML(textBox)}')">${textDataRecebido}</span></td>`
                : '<td class="tagintable"></td>';

            if (type === 'all') htmlDataRecebido = '';

            $(this).find('td').eq(3).after(htmlDesc + htmlDataRecebido);

            const cloneTr = $(this).clone();
            $('#divRecebidos table tbody').find(`tr[data-htagname="${dataTag}"]`).after(cloneTr);
            $(this).remove();
        }
    });

    const tbody = $('#divRecebidos table tbody');
    const nrSemGrupo = tbody.find('tr[data-tagname="SemGrupo"]:visible').length;

    if (nrSemGrupo === 0) {
        tbody.find('tr.infraCaption.tagintable').eq(0).remove();
        tbody.find('tr[data-htagname="SemGrupo"]').remove();
    } else {
        const textRegistros = nrSemGrupo === 1 ? `${nrSemGrupo} registro:` : `${nrSemGrupo} registros:`;
        tbody.find('tr.infraCaption.tagintable').eq(0).find('td').html(`<span ${actionTest}>${textRegistros}</span>`);
        tbody.find('tr[data-tagname="SemGrupo"]:not(.infraTrClara)').eq(0).hide();
    }

    if (type === 'all') {
        const newColumns = `
            <th class="tituloControle newRowControle ${(isNewSEI ? 'infraTh' : '')}" style="text-align: center;">Especifica\u00E7\u00E3o</th>
            ${checkConfigValue('gerenciarprazos') ? `<th class="tituloControle newRowControle ${(isNewSEI ? 'infraTh' : '')}" style="text-align: center;">Prazos</th>` : ''}`;

        const caption = $('#tblProcessosRecebidos').find('tbody').find('.tableHeader, .infraCaption').text();
        const titleCaption = caption !== '' ? ` <span class="newRowControle">(Agrupados: ${caption})</span>` : '';

        $('#tblProcessosRecebidos').find('caption.infraCaption').show().append(titleCaption);
        $('#tblProcessosRecebidos').find('thead').show().find('.tablesorter-headerRow').append(newColumns);
        $('#tblProcessosRecebidos').find('tbody').find('.tableHeader, .infraCaption').remove();
        $('#tblProcessosRecebidos').find('thead').find('.prazoBoxDisplay').remove();

        tableHomeDestroy(true);
    }

    if (type && type !== 'all') {
        const order = getOptionsPro('orderbyTableGroup') || 'asc';
        $('#processoToCSV').after(`
            <a class="newLink" data-order="${order}" onclick="orderbyTableGroup(this)" id="orderbyTableGroup"
               onmouseover="return infraTooltipMostrar('Classificar dados pela ordem ${(order === 'asc' ? 'decrescente' : 'crescente')}');"
               onmouseout="return infraTooltipOcultar();"
               style="margin: 0;font-size: 10pt;float: right;">
               <i class="fas fa-sort-numeric-${order === 'asc' ? 'up' : 'down'} cinzaColor"></i>
            </a>`);
    }

    if (isNewSEI && type !== '') {
        $('#divTabelaProcesso').addClass('displayInitial');
    } else if (isNewSEI) {
        $('#divTabelaProcesso').removeClass('displayInitial');
    }
};

// DELEGAÇÃO DE EVENTOS PARA ELEMENTOS ADICIONADOS DINAMICAMENTE
$(document).on('click', 'a[data-action="select-all"]', function() {
    setSelectAllTr(this);
});

$(document).on('mouseover mouseenter', 'a[data-action="select-all"]', function() {
    updateTipSelectAll(this);
});

$(document).on('mouseout', 'a[data-action="select-all"]', function() {
    infraTooltipOcultar();
});

$(document).on('click', '#lnkInfraCheck', function () {
    const tagName = $(this).data('tagname');
    getSelectAllTr(this, tagName);
});

$(document).on('mouseover', '#lnkInfraCheck', function () {
    updateTipSelectAll(this);
});

$(document).on('mouseenter', '#lnkInfraCheck', function () {
    return infraTooltipMostrar('\u0053elecionar Tudo');
});

$(document).on('mouseout', '#lnkInfraCheck', function () {
    return infraTooltipOcultar();
});

$(document).on('click', 'a.controleTableTag', function () {
    toggleGroupTablePro(this);
});

$(document).on('mouseover', 'a.controleTableTag', function () {
    return infraTooltipMostrar(this.dataset.action === 'show' ? '\u004Dostrar Agrupamento' : '\u0052ecolher Agrupamento');
});

$(document).on('mouseout', 'a.controleTableTag', function () {
    return infraTooltipOcultar();
});

$(document).on('click', '.followLinkDesc', function () {
    editFieldProc(this);
});

$(document).on('click', '.orderby-table-group', function (e) {
    e.preventDefault();
    orderbyTableGroup(this);
});

// ALTERA A ORDEM DA TABELA GRUPO E ATUALIZA A EXIBIÇÃO
const orderbyTableGroup = (this_) => {
    const _this = $(this_);
    const data = _this.data();
    const setOrder = data.order === 'asc' ? 'desc' : 'asc';

    setOptionsPro('orderbyTableGroup', setOrder);
    _this.attr('data-order', setOrder);

    const iconClass = `fas fa-sort-numeric-${data.order === 'asc' ? 'down' : 'up'}`;
    _this.find('i').attr('class', iconClass);

    infraTooltipOcultar();
    updateGroupTable($('#selectGroupTablePro'));
};

// OBTÉM ARRAY DE DADOS DE PROCESSO RECEBIDO COM BASE NO ID DO PROCEDIMENTO
const getArrayProcessoRecebido = (href) => {
    const storeRecebimento = (typeof localStorageRestorePro !== 'undefined' &&
        typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' &&
        !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')))
        ? localStorageRestorePro('configDataRecebimentoPro')
        : [];

    const id_procedimento = (typeof getParamsUrlPro !== 'undefined')
        ? String(getParamsUrlPro(href).id_procedimento)
        : false;

    const dadosRecebido = (typeof jmespath !== 'undefined' &&
        jmespath.search(storeRecebimento, `[?id_procedimento=='${id_procedimento}'] | length(@)`) > 0)
        ? jmespath.search(storeRecebimento, `[?id_procedimento=='${id_procedimento}'] | [0]`)
        : '';

    return dadosRecebido;
};

// ATUALIZA A SELEÇÃO DO GRUPO PARA A UNIDADE ATUAL
const updateGroupTablePro = (valueSelect, mode) => {
    const selectGroup = localStorageRestorePro('selectGroupTablePro');

    if ($.isArray(selectGroup) && selectGroup.length > 0) {
        if (jmespath.search(selectGroup, `[?unidade=='${siglaUnidadeAtual}'].unidade | length(@)`) > 0) {
            for (let i = 0; i < selectGroup.length; i++) {
                if (selectGroup[i]['unidade'] === siglaUnidadeAtual) {
                    if (mode === 'remove') {
                        selectGroup.splice(i, 1);
                        i--;
                    } else {
                        selectGroup[i]['selected'] = valueSelect;
                    }
                }
            }
        } else if (valueSelect !== '') {
            selectGroup.push({ unidade: siglaUnidadeAtual, selected: valueSelect });
        }
        localStorageStorePro('selectGroupTablePro', selectGroup);
    } else {
        if (mode === 'remove') {
            localStorageRemovePro('selectGroupTablePro');
            console.log('localStorageRemovePro');
        } else {
            localStorageStorePro('selectGroupTablePro', [{ unidade: siglaUnidadeAtual, selected: valueSelect }]);
        }
    }
};

// RECUPERA O VALOR SELECIONADO DO GRUPO PARA A UNIDADE ATUAL
const storeGroupTablePro = () => {
    if (typeof localStorageRestorePro !== 'undefined' && localStorageRestorePro('selectGroupTablePro') != null) {
        const selectGroup = localStorageRestorePro('selectGroupTablePro');

        if ($.isArray(selectGroup) &&
            typeof jmespath !== 'undefined' &&
            jmespath.search(selectGroup, `[?unidade=='${siglaUnidadeAtual}'].unidade | [0]`) === siglaUnidadeAtual) {
            return jmespath.search(selectGroup, `[?unidade=='${siglaUnidadeAtual}'].selected | [0]`);
        } else if (!$.isArray(selectGroup)) {
            localStorageStorePro('selectGroupTablePro', [{ unidade: siglaUnidadeAtual, selected: selectGroup }]);
            return selectGroup;
        }
    } else {
        return false;
    }
};

function insertGroupTable(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined' && (checkConfigValue('agruparlista') || verifyConfigValue('removepaginacao')) ) {
        if (checkConfigValue('agruparlista')) { 
            var statusTableTags =           ( storeGroupTablePro() == 'tags' ) ? 'selected' : '';
            var statusTableTypes =          ( storeGroupTablePro() == 'types' ) ? 'selected' : '';
            var statusTableUsers =          ( storeGroupTablePro() == 'users' ) ? 'selected' : '';
            var statusTableCheckpoints =    ( storeGroupTablePro() == 'checkpoints' ) ? 'selected' : '';
            var statusTableArrivaldate =    ( storeGroupTablePro() == 'arrivaldate' ) ? 'selected' : '';
            var statusTableSenddate =       ( storeGroupTablePro() == 'senddate' ) ? 'selected' : '';
            var statusTableDeadline =       ( storeGroupTablePro() == 'deadline' ) ? 'selected' : '';
            var statusTableAcessdate =      ( storeGroupTablePro() == 'acessdate' ) ? 'selected' : '';
            var statusTableDepartSend =     ( storeGroupTablePro() == 'senddepart' ) ? 'selected' : '';
            var statusTableCreatedate =     ( storeGroupTablePro() == 'createdate' ) ? 'selected' : '';
            var statusTableAcompEsp =       ( storeGroupTablePro() == 'acompanhamentoesp' ) ? 'selected' : '';
            var statusTableAll =            ( storeGroupTablePro() == 'all' ) ? 'selected' : '';
            var filterTableHome = selectFilterTableHome();
            var panelKanbanHome = selectPanelKanbanHome();
            var htmlControl =    '<div id="newFiltro">'+
                                 '  '+filterTableHome+
                                 '  '+panelKanbanHome+
                                 '   <select id="selectGroupTablePro" class="groupTable selectPro" onchange="updateGroupTable(this)" data-placeholder="Agrupar processos...">'+
                                 '     <option value="">&nbsp;</option>'+
                                 '     <option value="">Sem agrupamento</option>'+
                                 '     <option value="all" '+statusTableAll+'>Agrupar processos recebidos/gerados</option>'+
                                 '     <option value="deadline" '+statusTableDeadline+'>Agrupar processos por prazo</option>'+
                                 '     <option value="createdate" '+statusTableCreatedate+'>Agrupar processos por data de autua\u00E7\u00E3o</option>'+
                                 '     <option value="arrivaldate" '+statusTableArrivaldate+'>Agrupar processos por data de recebimento</option>'+
                                 '     <option value="senddate" '+statusTableSenddate+'>Agrupar processos por data de envio</option>'+
                                 '     <option value="acessdate" '+statusTableAcessdate+'>Agrupar processos por data do \u00FAltimo acesso</option>'+
                                 '     <option value="tags" '+statusTableTags+'>Agrupar processos por marcadores</option>'+
                                 '     <option value="types" '+statusTableTypes+'>Agrupar processos por tipo</option>'+
                                 '     <option value="users" '+statusTableUsers+'>Agrupar processos por respons\u00E1vel</option>'+
                                 '     <option value="checkpoints" '+statusTableCheckpoints+'>Agrupar processos por ponto de controle</option>'+
                                 '     <option value="senddepart" '+statusTableDepartSend+'>Agrupar processos por unidade de envio</option>'+
                                 '     <option value="acompanhamentoesp" '+statusTableAcompEsp+'>Agrupar processos por acompanhamento especial</option>'+
                                 '  </select>'+
                                 '  <a class="newLink" onclick="getTableProcessosCSV()" id="processoToCSV" onmouseover="return infraTooltipMostrar(\'Exportar informa\u00E7\u00F5es de processos em planilha CSV\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 10pt;float: right;"><i class="fas fa-file-download cinzaColor"></i></a>'+
                                 '</div>';

            if ( $('#selectGroupTablePro').length == 0 && $('#tblProcessosDetalhado').length == 0) { 
                $('#divFiltro').after(htmlControl).css('width','50%');
                setTimeout(function(){ 
                    updateGroupTable($('#selectGroupTablePro'));
                    if ($('#selectGroupTablePro_chosen').length == 0 && verifyConfigValue('substituiselecao')) {
                        initChosenFilterHome();
                    }
                }, 500);
            }
            if ( $('#idSelectTipoBloco').length != 0 ) { 
                $("#idSelectTipoBloco").appendTo("#newFiltro");
                $("#idSelectBloco").appendTo("#newFiltro");
            }
        } else {
            initProcessoPaginacao($('#selectGroupTablePro'));
        }
    } else {
        setTimeout(function(){ 
            insertGroupTable(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload insertGroupTable'); 
        }, 500);
    }
}
function initChosenFilterHome(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().chosen !== 'undefined') { 
        setTimeout(() => {
            $('#newFiltro .selectPro').chosen({
                placeholder_text_single: ' ',
                no_results_text: 'Nenhum resultado encontrado'
            });
            forcePlaceHoldChosen();
        }, 2000);
    } else {
        if (typeof $().chosen === 'undefined' && typeof URL_SPRO !== 'undefined' && TimeOut == 9000) { 
            $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
        }
        setTimeout(function(){ 
            initChosenFilterHome(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initChosenFilterHome'); 
        }, 500);
    }
}
function removeCacheGroupTable(this_) {
    localStorageRemovePro('configDataRecebimentoPro');
    console.log('localStorageRemovePro');
    $(this_).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    console.log('Remove configDataRecebimentoPro');
    //$('#selectGroupTablePro').val('');
    //updateGroupTable($('#selectGroupTablePro'));
}
function updateGroupTable(this_) {
    if (typeof checkConfigValue !== 'undefined' && verifyConfigValue('removepaginacao')) {
        initProcessoPaginacao(this_);
    } else {
        initUpdateGroupTable(this_);
    }
}
function initUpdateGroupTable(this_) {
    if (typeof checkConfigValue !== 'undefined' && checkConfigValue('agruparlista')) {
        var valueSelect = $(this_).val();
        initTableTag(valueSelect);

        if (!valueSelect || valueSelect == 'all' || valueSelect == '') {
            setOptionsPro('panelProcessosView', 'Tabela');
            setTimeout(function(){ 
                $('#processosProActions').find('.btn[data-value="Tabela"]').trigger('click');
            }, 500);
        } 

        if (getOptionsPro('panelProcessosView') == 'Quadro') {
            initAddKanbanProc(valueSelect);
            updateGroupTablePro(valueSelect, 'insert');
        } else {
            if ( typeof valueSelect !== 'undefined' && valueSelect != '' ) { 
                $('#filterTableHome').val('').trigger('chosen:updated');
                updateGroupTablePro(valueSelect, 'insert');
                if (valueSelect == 'arrivaldate' || valueSelect == 'acessdate' || valueSelect == 'senddate' || valueSelect == 'senddepart' || valueSelect == 'createdate' || valueSelect == 'acompanhamentoesp') { 
                    statusPesquisaDadosProcedimentos = true;
                    getDadosProcedimentosControlar();
                } else if (statusPesquisaDadosProcedimentos) {
                    breakDadosProcedimentosControlar();
                }
            } else if ( typeof valueSelect !== 'undefined' ) { 
                if ( typeof localStorageRemovePro !== "undefined" ) { 
                    updateGroupTablePro(valueSelect, 'remove'); 
                    if (statusPesquisaDadosProcedimentos) {
                        breakDadosProcedimentosControlar();
                    }
                }
            }
        }
    }
}
function getTableTag(type) {
    var listTags = getListTypes(type);
    $.each(listTags, function (i, val) {
        getUniqueTableTag(i, val, type);
    });
}
function initTableTag(type = '') {
    cleanConfigDataRecebimento();
	removeAllTags(false, 1);
	if ( type != '' ) {
        $('#divRecebidos thead').hide();
		appendGerados(type);
		getTableTag(type);
		getTableOnTag(type);
	}
    setTimeout(function(){
        initNewTabProcesso();
        forcePlaceHoldChosen();
        urgenteProMoveOnTop();
        checkboxRangerSelectShift();
        if (type != '' && type != 'all' && $('#tblProcessosRecebidos tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').length > 0) {
            $('#tblProcessosRecebidos tr.tagintable[data-htagname="(URGENTE)"').remove();
            $('#tblProcessosRecebidos tr.urgentePro').show().attr('data-tagname','(URGENTE)');
            var colspan = $('#tblProcessosRecebidos tr:not(.tableHeader)').eq(1).find('td').length;
                colspan = (typeof colspan !== 'undefined' && colspan > 0) ? colspan+2 : 7;
            var htmlHeadUrgente =   '<tr data-htagname="(URGENTE)" class="tagintable tableHeader">'+
                                    '   <th class="tituloControle '+(isNewSEI ? 'infraTh' : '')+'" width="5%" align="center">'+
                                    '       <label class="lblInfraCheck" for="lnkInfraCheck" accesskey=";"></label>'+
                                    '       <a id="lnkInfraCheck" onclick="getSelectAllTr(this, \'(URGENTE)\');" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar(\'Selecionar Tudo\')" onmouseout="return infraTooltipOcultar();">'+
                                    '           <img src="/infra_css/'+(isNewSEI ? 'svg/check.svg': 'imagens/check.gif')+'" id="imgRecebidosCheck" class="infraImg">'+
                                    '       </a>'+
                                    '   </th>'+
                                    '   <th class="tituloControle '+(isNewSEI ? 'infraTh' : '')+'" colspan="'+colspan+'">(URGENTE)</th>'+
                                    '</tr>';
            $("#tblProcessosRecebidos tbody").prepend(htmlHeadUrgente);
        }
    }, 1000);
}
function urgenteProMoveOnTop() {
    $("#tblProcessosRecebidos tbody").prepend($('#tblProcessosRecebidos tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').closest('tr'));
    $("#tblProcessosGerados tbody").prepend($('#tblProcessosGerados tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').closest('tr'));
    $("#tblProcessosDetalhado tbody").prepend($('#tblProcessosDetalhado tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').closest('tr'));
}
function checkLoadedTableSorter() {
    return typeof tableHomePro !== 'undefined' && typeof tableHomePro[0] !== 'undefined' && typeof tableHomePro[0].data('tablesorter') !== 'undefined' && typeof tableHomePro[0].data('tablesorter').$filters !== 'undefined';
}
function getFilterTableHome(this_) {
    if (tableHomePro.length && $('.filterTableProcessos').length) {
        if (!checkLoadedTableSorter()) removeAllTags(false, 2);
        if ($('#selectGroupTablePro').val() != '') {
            $('#selectGroupTablePro').val('').trigger('change').trigger('chosen:updated');
        }
        var _this = $(this_);
        var value = _this.val();
        var data = _this.find('option:selected').data();
        var filters = [];
        if (data.type == 'user') {
            filters[3] = (value == '' ? '""' : '('+value+')');
        } else if (data.type == 'proc') {
            value = (value != '') ? extractOnlyAlphaNum(removeAcentos(value)) : value;
            filters[2] = (value == '' ? '""' : value);
        } else if (data.type == 'tag') {
            value = (value != '') ? extractOnlyAlphaNum(removeAcentos(value)) : value;
            filters[1] = (value == '' ? '' : 'Marcador? '+value);
            filters[1] = value == 'null' ? '!Marcador?' : filters[1];
        } else if (data.type == 'clean') {
            $.each(tableHomePro, function(i){
                tableHomePro[i].trigger('filterReset');
            });
            _this.val('');
            if (verifyConfigValue('substituiselecao')) {
                forcePlaceHoldChosen();
                _this.chosen("destroy").chosen();
            }
        }
        if (filters.length > 0) {
            setTimeout(function(){ 
                $.each(tableHomePro, function(i){
                    $.tablesorter.setFilters( tableHomePro[i][0], filters, true );
                });
                sessionStorageStorePro('setFiltersTableHome', filters);
            }, 100);
        } else {
            sessionStorageRemovePro('setFiltersTableHome');
        }
        // console.log('getFilterTableHome', data, filters);
    } else {
        tableHomeDestroy(true);
    }
}
function selectFilterTableHome() {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
        tableProc.find('a[href*="acao=procedimento_atribuicao_listar"]').map(function(){ return $(this).text() }).get();

    var users = tableProc.find('a[href*="acao=procedimento_atribuicao_listar"]').map(function(){ return $(this).text() }).get();
        users = (typeof users !== 'undefined' && users !== null) ? uniqPro(users) : [];

    var tipos = tableProc.find('a[href*="acao=procedimento_trabalhar"]').map(function(){ 
            var tipoNomeProc = extractTooltipToArray($(this).attr('onmouseover'));
                tipoNomeProc = (tipoNomeProc) ? tipoNomeProc[1] : false;
            if (tipoNomeProc) {
                return tipoNomeProc;
            }
        }).get();
        tipos = (typeof tipos !== 'undefined' && tipos !== null) ? uniqPro(tipos) : [];

    var marcadores = tableProc.find('a[href*="acao=andamento_marcador_gerenciar"]').map(function(){ 
            var tipoNomeTag = extractTooltipToArray($(this).attr('onmouseover'));
                tipoNomeTag = (tipoNomeTag) ? tipoNomeTag[1] : false;
            if (tipoNomeTag) {
                return tipoNomeTag;
            }
        }).get();
        marcadores = (typeof marcadores !== 'undefined' && marcadores !== null) ? uniqPro(marcadores) : [];

    var html =  '<select id="filterTableHome" class="selectPro" style="width:250px;margin-right:20px !important;" onchange="getFilterTableHome(this)" data-placeholder="Filtrar processos...">'+
                '   <option value="" data-type="clean">&nbsp;</option>'+
                '   <option value="all" data-type="clean">Todos os processos</option>'+
                '   <option value="(N\u00E3o visualizado)" data-type="proc">Processos n\u00E3o visualizados</option>';

        if (users.length > 0) {
            html += '   <optgroup label="Por atribui\u00E7\u00E3o">'+
                    '       <option value="" data-type="user">Processos sem atribui\u00E7\u00E3o</option>';
            $.each(users, function(i, v){
                html += '       <option value="'+v+'" data-type="user">Atribu\u00EDdos \u00E0 '+v+'</option>';
            });
            html += '   </optgroup>';
        }

        if (tipos.length > 0) {
            html += '   <optgroup label="Por tipo de processo">';
            $.each(tipos, function(i, v){
                html += '       <option value="'+v+'" data-type="proc">'+v+'</option>';
            });
            html += '   </optgroup>';
        }

        if (marcadores.length > 0) {
            html += '   <optgroup label="Por marcadores">';
            html += '       <option value="null" data-type="tag">Sem marcador</option>';
            $.each(marcadores, function(i, v){
                html += '       <option value="'+v+'" data-type="tag">'+v+'</option>';
            });
            html += '   </optgroup>';
        }

        html += '</select>';
    return html;
}
function initDadosProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof getParamsUrlPro !== 'undefined' && typeof getDadosIframeProcessoPro !== 'undefined'  && typeof $("#ifrArvore").contents().find('#topmenu').find('a[target="ifrVisualizacao"]').eq(0).attr('href') !== 'undefined' ) { 
        var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
            id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
            id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
            // idProcedimento = (typeof idProcedimento !== 'undefined') ? idProcedimento : getParamsUrlPro($("#ifrArvore").contents().find('#topmenu').find('a[target="ifrVisualizacao"]').eq(0).attr('href')).id_procedimento;
            // console.log(id_procedimento, 'processo');
            getDadosIframeProcessoPro(id_procedimento, 'processo');
    } else {
        setTimeout(function(){ 
            initDadosProcesso(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initDadosProcesso'); 
        }, 500);
    }
}

// ### REMOVE A PAGINAÇÃO DA PÁGINA INICIAL DA VISUALIZAÇÃO REDUZIDA ###
// Aprimorado em 2025-04-10
    const getProcessosPaginacao = (this_, index, tipo) => {
        const form = $('#frmProcedimentoControlar');
        const href = form.attr('action');
        let param = {};

        form.find("input[type=hidden]").each(function () { 
            const name = $(this).attr('name');
            if (name && $(this).attr('id').includes('hdn')) { 
                param[name] = $(this).val();
            }
        });

        param[`hdn${tipo}PaginaAtual`] = index;

        $.ajax({ 
            method: 'POST',
            data: param,
            url: href
        }).done(function (html) {
            const $html = $(html);
            const tr = $html.find(`#tblProcessos${tipo} tbody`).find('tr.infraTrClara');

            if (tr.length === 0) {
                param[`hdn${tipo}PaginaAtual`] = 0;
                initUpdateGroupTable(this_);
                return;
            }

            tr.each(function () {
                const checkbox = $(this).find('input.infraCheckbox');
                checkbox.attr('disabled', true)
                    .closest('td')
                    .attr('onmouseover', `return infraTooltipMostrar('Desative a op\u00E7\u00E3o "Remover pagina\u00E7\u00E3o de processos" nas configura\u00E7\u00F5es do ${NAMESPACE_SPRO} para utilizar esta sele\u00E7\u00E3o')`)
                    .attr('onmouseout', 'return infraTooltipOcultar()');

                if (isNewSEI) checkbox.css({'opacity': '1', 'transform': 'scale(1.5)'});

                $('#tblProcessos' + tipo).append($(this)[0].outerHTML);
            });

            const NroItens = parseInt($html.find(`#hdn${tipo}NroItens`).val(), 10) || 0;
            const NroItens_ = $('#hdn' + tipo + 'NroItens');
            const totalItens = (parseInt(NroItens_.val(), 10) || 0) + NroItens;
            NroItens_.val(totalItens);

            const sanitizedCaption = sanitizeHTML(`<span ${actionTest}>${totalItens} registros:</span>`);
            $('#tblProcessos' + tipo).find('caption.infraCaption').html(sanitizedCaption);

            // **Evita chamadas recursivas desnecessárias**
            if (NroItens > 0) {
                setTimeout(() => getProcessosPaginacao(this_, index + 1, tipo), 100);
            }

            if (checkConfigValue('gerenciarfavoritos')) appendStarOnProcess();
            initControlePrazo(true);
            viewEspecifacaoProcesso();
            addAcompanhamentoEspIcon();
        });
    }
    const checkProcessoPaginacao = (this_, tipo) => {
        var pgnAtual = $('#hdn'+tipo+'PaginaAtual');
        if ( parseInt(pgnAtual.val()) > 0) {
            pgnAtual.val(0);
            $('#frmProcedimentoControlar').submit();
        } else {
            getProcessosPaginacao(this_, 1, tipo);
            $('#div'+tipo+' .infraAreaPaginacao').find('a, select').hide();
        }
    }
    const initProcessoPaginacao = (this_) => {
        if ($('.infraAreaPaginacao a').is(':visible')) {
            if ($('#divRecebidosAreaPaginacaoSuperior a').is(':visible')) {
                checkProcessoPaginacao(this_, 'Recebidos');
            }
            if ($('#divGeradosAreaPaginacaoSuperior a').is(':visible')) {
                checkProcessoPaginacao(this_, 'Gerados');
            } 
        } else {
            initUpdateGroupTable(this_);
        }
    }
/*
function observeHistoryBrowserPro() {
    (function(history){
        var pushState = history.pushState;
        history.pushState = function(state) {
            if (typeof history.onpushstate == "function") {
                history.onpushstate({state: state});
            }
            return pushState.apply(history, arguments);
        }
    })(window.history);
    
    window.onpopstate = history.onpushstate = function(e) {
        //iHistory++;
        var iframeArvore = $('#ifrArvore').contents();
        if (typeof e.state.id_procedimento !== 'undefined' && typeof e.state.id_documento !== 'undefined') {
            var id_procedimento = e.state.id_procedimento;
            var id_documento = e.state.id_documento;
            var linkDoc = '&id_procedimento='+id_procedimento+'&id_documento='+id_documento;
            var href = iframeArvore.find('a[href*="'+linkDoc+'"]');
            var hCurrent = jmespath.search(iHistoryArray, "[?link=='"+window.location.href+"'].id | [0]");
            if (!href.find('span').hasClass('infraArvoreNoSelecionado')) {
                href.trigger('click');
                $($ifrVisualizacao).attr('src', href.attr('href'));
                console.log(hCurrent, iHistoryCurrent, iHistoryArray, linkDoc, href.find('span').hasClass('infraArvoreNoSelecionado'), e.state);
                //history.forward();
                history.back(); 
                iHistoryCurrent = hCurrent;
            } else {
                console.log(hCurrent, iHistoryArray, linkDoc, href.find('span').hasClass('infraArvoreNoSelecionado'), e.state);
            }
        }
    };
}
*/

// ### NOVOS BOTÕES DE FUNCIONALIDADES PARA O CONTROLE DE PROCESSOS ###
// Aprimorado em 2025-04-10

    // === INICIALIZAÇÃO COM TIMEOUT GRADUAL PARA VERIFICAR DEPENDÊNCIAS
    const initNewTabProcesso = (timeout = 9000) => {
        initWithRetry({
            fnName: 'getNewTabProcesso',
            condition: () => typeof verifyConfigValue !== 'undefined',
            timeout,
            debugLabel: 'initNewTabProcesso'
        });
    };

    // === FUNÇÃO PRINCIPAL DE REABERTURA PROGRAMADA DE PROCESSO ==
    function initNewBtnHome() {
        const base64IconReaberturaPro = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAADINJREFUeJy9mQl0FPUdx78zszN7ZHPsJiEhJCSYGA4NICKgQsAqikUt+jxqW/Wp9VXp06ctWqx39Xk8j2rVCr4qVq3iUVGf2op4RYqCypNAguQgJ9lNskd2s9fsXP39Zw9ycfQ96/+9X2ZmZ+Y/n//vnokFRz+4tBhp+VGGZeTBjnWoN3RMJYxSXhBLLFZ7iSDmlQhSXoloc5UGPHv2XH1/6LqmDuyny7UfFZDgZrsq5n+SN+V0QXSUwWIvg+gopW0RLFIe6c6GweZnStb+4o5Hr3zQ+K2q4QDdpk80ac0UcE9cD1uuHXk8jwKSyfRzTnc/dv/8T+Z9R704E/CDh8BbROsjVUufEywi3avRHPownfme9pNAnIQTUDzzMixb2XPO7QfW73vvSzzxwDVQJBEFooBqgjiOpEawOCoEKb/MYi0otObV5NkKap3W/Bqe50WgYW074DuPJm4hUY8asDgfK4trz11usbqAyGspxXBc6orMls2X2Iyy+Xdyl4a6b7j4gvivHHlT7aJjslPMKReknKmkcdK21QpBNGjFBnlKhO4Lk8dGoSatcLpqKn9zrm/1+UvQpGn4euWt2EUXKIcF/PJpmjPHtbbsxHuAWAOxqaPBsoA0jCB4YzNqz3xZgh4thTFE14fo9wC0eAeSsa1IhEK0DUGJhyBHArSNQ1NFCFIRcotnWu68c/lqXirU+3b9JbJo1v5VXzVjG82cPCSgpqPMVfXTE3lLDmmvczzYyK1Bwav3k1L+Zv40PNCOvqZPwIuFkHJrIDmrSaZDcpfDmVMO0VlB2sxFKuh1WnsScdnQrVYr39/6tsMX2n8GnWgiGTwk4HAMim5YklCDVugTmHYiTdJ+yLsP/gN9qF6xGRZbCUy/NzQczEBcOilFU/sMUYsjmeR1URS4cLBP8wYwYtJDACYUyLoSkwEh19QQk4y20jAG5R5NlaEp9IB4GLGQB7GIjqrTXgEPP3kRuRInIuXSYnp/zJY7mNEMNcJ5B4LxSBzkI4c2rwkYCCOhJqMJc3KmQdJA2NeJSKCbYEIwODudckGwFpOmiiHmHA972QoUT14MXm+my0MpCCMNlwWzjACUzH1NjiIWc+hWLo7WziC7MUAiHxbwna2QFy8eTrA0wgCHvN8jFHOgYNpquJ1FBOYkB7eCFxh7IrVggwLP+Iquj6S1loGzjIYdpUGRAsZn+Hw5iVxuWOr0qAwwiCPkRMu726A/oEQpF6QAw4E+lNdvhKC+Q6d7AEpuZsbSuNF+SMY17zHSgMYEoNxoUCXeB7/flSi3e/J7B024IwOyP6o8HDInI0BdF4gpRrfFJg6QzOCYOzBhaYwbDZsRQzwITJBqoh+JhFVNhDoMAiTnNX3wsHU9BZjwZzVoUEnj9CGMi2imySzc6CCCoacVwczPj4bMABKsrgQMjqtAONitku8z/4scDaChysGQGbwMioIZKi2OUn0WKgPEjsdqdSSo+SyWblTSFAfPgAj/kB0JmRauy0hEJE7l1ZyBwZ7kYAg+ujh6OLisBg3DCKnyEPhkHLzkJsBwOqIxMdhYbaYHu+Prrj5sbuxF+6AMe24BCpwuVLqmoa5kLiorTuFCoVCBV79GX3PzwrPa29v/89prG/0p1U+syRQgECIzw4gFIdqrCDB0EPBwiXsE3GftbfjzFw3Y6x+AaDENAyWo0jTsuTySiox5pQvxy5lXoXJyFX/22WXzenp63qmoqFj/wgsb7vb5fH5M0B2lsqeBkBL3U1wEYXGfRIDDKcCM9g61JVHIFdb+6z18uL8dFkGAnTULci6WVP4aq+avQO3kKjgRx/CwF12KgcYDTQj2hOFIDMBVkC8sWHDSakmSFrz66qtXdnTs34sxUZ3VoCIHKFhCkGwFBNiLCTuaMVuNFnH7Rx/i0+4u2CTqHwi8WJyL2895DKfMqILAs2vo8pfOh5MApSt2otw1E7JmoMfjReuubXByMmpqquevWrXqmQ0bnr96aGiofSRk2gfJxDJ1IMkYcqz5BNhKs47RVgZsxPGm5j34uLsTkiiZx4Jhx5OX/BW1paXpBVASokepi++CQp1NgvJpnLJSjCQnrxSLzzgHWz58D3Z6bm3tjFPr65f9/t13376bbvVmfDILqCXDBBin7pl1NcpoqPRFI4MlIst49rudpDlb1hynV68YBZfUmBiQJy1E3J2CiyYNePoH8eT9t+CK627Geeeei3++vhGTHFbu1FNPu7y5uWl7W1vrRpoilgWkyUKaEoaqKeTgtoMBchjz7un3IEoBkAqIlLnnlc8fpTmF4JKsz2WisMbcgI8S4H1rrkTb94244Ko/QKZesW7JGWht2IwpU46x1dXNvZAAt9I0rUinfgJjGhyiaiaZfjMuxYzd0tg9MGBqj0sDy8koji2enoVj2pPTJjXNyuCCEVx38RJEwiE8/PIXcJdMRbvPwCk1k9HSOIlcxYFZs+Yt3LTpjbk0ZSdJ0gSMyxjSyAcFG5knGZw4gseY2xePZbXHBguQfHvhCDgjCxelRN22vwO3rb7IvO6+5zabcKqe0q7E8Zg0dSqSXR6Ul1e7XC73icFgYAtNGzCf0D2A8LEUxRZbES0/NK7MUSLHvqAfSqZXpAkZoGC2OAdHMDZEYLwZpUmVg10sQUdnF55/6kE07txuau6e9e+jqGwa5UUNOnVQDDIe9qOkQEJnm4Lc3GKutLR0OgHmsylNwOufQHznie0xd9E8Bwh0XJkj2dS2Dx/6h2Cl1osNek2DVbRm4dx5BVjz/pXUNnCmP7qlaqw98x94+/WXcMnPlmPO9Ao88NDDuOOaFexu2J35+OO6LbBSpbG+tJxeC3PQ4boNDkc+bDZ61wXYuwKXCRIko54Bi6OkCnJwXJAwP7tlznxYmxuxJRSBQ7Jj7LBYHWlT68jhK3DtyU9RxALT5y7GvfetgWTPxeq71tF5nnxepx7TBtGWaz7KvvRG7PUlIQxItHALVFVl2jFzV8aJDF3XBkU7AcZ2TliHBdreNPN4xL9twNe6OEp7mcFcwaAqck3943RLvulfx81fintf3AaNwHQwOJhmNYX2Cx00d93l6Pi2Bc5IhJqMGKhesxSjjQRkLP0iRRH15akfyMzUHSI83EtlyoPIcD/2tPrC4X2qby+fx806a/a0nLTWMkOV7bhh6XPgOZcJl4IhaDKUro8AGyFzp3DojVOeo8pSnV+F1tadel/fAQ/SrdhBQHr106K9CARaCWrA6OsfTO7r8g/v7dL8e7vg3b4XXYNDrMUG1cFwv+5qufSEk2dd6LDaWc1BJMLj2kWPmHAsvaQAjKymxsHRb9VFHCpcHLYGkjD8w7AeY0dT0zdDqqr00ZShkYCGnETzaxvW7P7sOyPZSK+73f3opVcpBtSVggJbFeuAWQ+ndLw4uEO0tHJ1C6ZfKEcVLCq6B4XOSkQS6fKWgZtI6Hw5lfwl1TxaYhp2ff4paiYdizi9MTY0fNBN87OmITzKxMtuxDri3EO7zG5sBYNpIOYPStonsj2bFjY8xmfOW4WSvPmrZqysSgQOYHdXP06qKUU0wcMbnhiOp6RwQjlHpuXRKRNceycKEnbklxbizTefjra0UCQCTJKjANOa+STjTjjyd0D9++/2ddQvWPagNDVnnTNPRO/uLdgunIU5lYVYUCXCG6IiTxp17XwUtoQXsdMfwYxJHBRyiu8iKto6OhDc0YQT6urR3r5bf+XVdY2yLLMy14Z0bzgS0MARXqInGNqzz65/maJ3+qJFC2/KEzkEv3oLX3TPQNmcRSh1WuB2CyiyeGDh+qA4NXwbNhCMJ9Dy+ScoFYow9/h6eL2deOyxm1v6vZ6Pac5PSYYzD7Ac+tlHPWLPP//c/Yqi5NXVzb7M7S6W1JAXBz56Ax431df8AogFl5EaaTVf7oAyFIYY03F8+RxKyk60tOzUH3/81pZdu775N821CSmfz1ruhwA0NE3zU9t+W3390rb6+p/8btq0GcVlxZMgCDZ6jdBgROldh5eoQrhhL66EhWp4mMrbBx/8PbJx4/o9Xq+HudbbSH1IGvU57ocANCFJBhoaPn+msXHX17Nnz72otva4ZdOOmVlZWDjZZrPmEmCSErCfzNkjNzV/E9yx/dOuzq6OXaqisM9vDUhlinHfCn8owAxkmFr2rQ0Nn7Vu3drwlruw8IRcZ24N1dZi0rIYjUaSVCUCtO0lv2VfWZnGOpDyuQk/J/+QgBlIVoq6dV0/4Bsc3EbipGMmYhoikQZilULB0XxZ+D8NLQ3BZOS3k//pXxj/BQ18QshF3DfVAAAAAElFTkSuQmCC';
        const lastCheckRaw = getOptionsPro('lastcheck_AcompEsp');
        const lastCheckFormatted = lastCheckRaw ? ` <br>(\u00DAltima verifica\u00E7\u00E3o em: ${moment(lastCheckRaw, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')})` : '';
        const titleRaw = `Reabertura Programada de Processos${lastCheckFormatted}`;
        const titleSafe = sanitizeHTML(titleRaw).replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';');

        const iconBoxSlim = localStorage.getItem('seiSlim');
        const iconLabel = localStorage.getItem('iconLabel');

        const iconClasses = ['botaoSEI', 'iconReaberturaPro', 'iconPro_reopen'];
        if (iconLabel) iconClasses.push('iconLabel');
        if (iconBoxSlim) iconClasses.push('iconBoxSlim');

        const iconBtn = createIconBtn({
            class: iconClasses.join(' '),
            icon: 'fad fa-folder-download',
            img: isNewSEI ? undefined : base64IconReaberturaPro,
            title: titleSafe,
            onclick: 'checkDadosAcompEspecial(true);',
            label: iconBoxSlim ? titleSafe : ''
        });

        $(divComandos).find('.iconReaberturaPro').remove();
        return iconBtn;
    }

    // === FUNÇÃO PRINCIPAL DE CRIAÇÃO DOS BOTÕES E OBSERVADORES ===
    function getNewTabProcesso() {
        // if (verifyConfigValue('reaberturaprogramada')) initNewBtnHome();

        const iconLabel = localStorage.getItem('iconLabel');
        const iconBoxSlim = localStorage.getItem('seiSlim');

        // OBSERVA MUDANÇAS NAS TABELAS DE PROCESSOS
        const observerTableControle = new MutationObserver((mutations) => {
            const _this = $(mutations[0].target);
            const _parent = _this.closest('table');
            const comandos = $(divComandos).find('.iconPro_Observe');

            if (_parent.find('tr.infraTrMarcada').length > 0) {
                comandos.removeClass('botaoSEI_hide');
                removeDuplicateValue('#hdnRecebidosItensSelecionados');
                removeDuplicateValue('#hdnGeradosItensSelecionados');
            } else {
                comandos.addClass('botaoSEI_hide');
            }
        });

        setTimeout(() => {
            // APLICA OBSERVADORES NAS LINHAS DAS TABELAS
            $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado')
                .find('tbody tr').each(function () {
                    observerTableControle.observe(this, { attributes: true });
                });

            // MONTA LISTA DE BOTÕES CONFORME PERMISSÕES
            const btns = [];

            if (checkConfigValue('gerenciaratividades') &&
                localStorage.getItem('configBasePro_atividades') !== null &&
                typeof checkCapacidade !== 'undefined' && parent.checkCapacidade('save_atividade') &&
                typeof __ !== 'undefined') {

                btns.push(createIconBtn({
                    class: 'iconAtividade_save botaoSEI_hide iconPro_Observe',
                    icon: 'fad fa-user-check',
                    title: __.Nova_Demanda,
                    onclick: 'parent.saveAtividade()'
                }));
            }

            if (checkConfigValue('gerenciarprazos')) {
                btns.push(createIconBtn({
                    class: 'iconPrazo_new botaoSEI_hide iconPro_Observe',
                    icon: 'fad fa-clock',
                    title: 'Adicionar prazo',
                    onclick: 'addControlePrazo()'
                }));
                btns.push(createIconBtn({
                    class: 'iconPrazo_new botaoSEI_hide iconPro_Observe',
                    icon: 'fad fa-info-circle',
                    title: 'Alterar informa\u00E7\u00F5es do processo',
                    onclick: 'dialogChangeTypeProc()'
                }));
            }

            if (checkConfigValue('uploaddocsexternos')) {
                btns.push(createIconBtn({
                    class: 'iconUpload_new botaoSEI_hide iconPro_Observe',
                    icon: 'fad fa-file-upload',
                    title: 'Enviar documentos em processos',
                    onclick: 'initUploadFilesInProcess()'
                }));
            }

            if (checkConfigValue('marcar_naolido')) {
                btns.push(createIconBtn({
                    class: 'iconNaoLido botaoSEI_hide iconPro_Observe',
                    icon: 'fad fa-eye-slash',
                    title: 'Marcar como n\u00E3o visualizado',
                    onclick: 'getProcessoNaoLido()'
                }));
            }

            // BOTÃO PARA ABRIR EM NOVA ABA
            btns.unshift(createIconBtn({
                class: 'iconPro_newtab botaoSEI_hide iconPro_Observe',
                icon: 'fad fa-external-link-alt',
                title: 'Abrir Processos em Nova Aba',
                onclick: 'openListNewTab(this)'
            }));

            // BOTÃO PARA FUNÇÃO DE REABERTURA PROGRAMADA
            if (verifyConfigValue('reaberturaprogramada')) btns.unshift(initNewBtnHome());

            // ATUALIZA A INTERFACE
            $(divComandos).find('.iconPro_Observe').remove();
            $(divComandos).append(btns.join(''));
        }, 500);
    }

    // === CRIA UM BOTÃO COM BASE NAS CONFIGURAÇÕES ===
    function createIconBtn({ class: extraClass, icon, title, onclick, id, img = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==' }) {
        const iconLabel = localStorage.getItem('iconLabel');
        const iconBoxSlim = localStorage.getItem('seiSlim');
        const tooltip = iconLabel ? '' :
            `onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('${sanitizeHTML(title)}')"`; 

        return `
            <a 
                class="botaoSEI ${iconLabel ? 'iconLabel' : ''} ${iconBoxSlim ? 'iconBoxSlim' : ''} ${extraClass}"
                ${tooltip} 
                onclick="${onclick}" style="position: relative; margin-left: -3px;"
            >
                <img class="infraCorBarraSistema" src="${img}" title="${sanitizeHTML(title)}">
                <span class="botaoSEI_iconBox"><i class="${icon}" style="font-size: 17pt; color: #fff;"></i></span>
                ${iconLabel ? `<span class="newIconTitle">${sanitizeHTML(title)}</span>` : ''}
            </a>`;
    }

    // === ABRE PROCESSOS SELECIONADOS EM NOVAS ABAS ===
    function openListNewTab(this_) {
        const listNewTag = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado')
            .find(elemCheckbox + ':checked')
            .map(function () { return $(this).val(); })
            .get();

        if (listNewTag.length > 0) {
            $.each(listNewTag, function (index, value) {
                const url = `${url_host}?acao=procedimento_trabalhar&id_procedimento=${value}`;
                const win = window.open(url, '_blank');
                if (win) {
                    win.focus();
                } else {
                    console.log('Por favor, permita popups para essa p\u00E1gina');
                }
            });
        }
    }

// ### ALTERAÇÃO DO TIPO PROCESSUAL DA SELEÇÃO DE PROCESSOS DA TELA INICIAL ###
// Aprimorado em 2025-04-10

    // CAIXA DE DIÁLOGO PARA ALTERAÇÃO DO TIPO PROCESSUAL
    function dialogChangeTypeProc(this_) {
        initListTypesSEI(function () {
            const htmlOption = arrayListTypesSEI.selectTipoProc.map(v => 
                `<option value="${v.value}">${sanitizeHTML(v.name)}</option>`
            ).join('');

            $('#dialogBoxTipoProc').html(htmlOption);
            initChosenReplace('box_reload', $('#dialogBoxTipoProc')[0], true);
        });

        const htmlBox = sanitizeHTML(`
            <div class="dialogBoxDiv seiProForm">
                <table style="font-size: 10pt; width: 100%;">
                    <tr style="height: 40px;">
                        <td class="label" style="vertical-align: bottom;">
                            <i class="iconPopup fas fa-inbox azulColor"></i>
                            <span>Tipo de procedimento</span>
                        </td>
                        <td>
                            <select id="dialogBoxTipoProc" style="font-size: 10pt; width: 100%;">
                                <option value="0">Carregando lista...</option>
                            </select>
                        </td>
                    </tr>
                </table>
            </div>
        `);

        resetDialogBoxPro('dialogBoxPro');

        $('#dialogBoxPro').html(htmlBox).dialog({
            title: "Alterar informa\u00E7\u00F5es do processo",
            width: 600,
            buttons: [{
                text: "Alterar",
                class: 'confirm',
                click: function () {
                    changeTypeProc();
                }
            }]
        });
    }
    // PREPARA VARIÁVEIS PARA AÇÃO DE ALTERAÇÃO
    function changeTypeProc(this_) {
        const idTypeProc = $('#dialogBoxTipoProc').val();
        const txtTypeProc = $('#dialogBoxTipoProc').find('option:selected').text();
        getChangeTypeProc(idTypeProc, txtTypeProc);
        loadingButtonConfirm(true);
    }
    // AÇÃO DE ALTERAÇÃO DO TIPO PROCESSUAL DA SELEÇÃO DE PROCESSOS DA TELA INICIAL
    function getChangeTypeProc(idTypeProc, txtTypeProc) {
        const tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
        const listProcs = tableProc.find(elemCheckbox + ':checked').map(function () {
            return $(this).val();
        }).get();

        if (listProcs.length > 0) {
            const id_protocolo = listProcs[0];
            const tr = tableProc.find('tr#P' + id_protocolo);
            const td = tr.find('td.tagintable').eq(1);

            td.find('.sucessEdit').remove();

            // SANITIZE HTML INSERIDO
            const sanitizedIcon = sanitizeHTML('<i class="fas fa-check azulColor sucessEdit" style="margin-left:10px;"></i>');
            const sanitizedText = sanitizeHTML(txtTypeProc);
            td.html(sanitizedText + sanitizedIcon);

            updateDadosArvore(
                'Consultar/Alterar Processo',
                'selTipoProcedimento',
                idTypeProc,
                id_protocolo,
                function () {
                    td.find('.sucessEdit').remove();
                    const doubleCheck = sanitizeHTML('<i class="fas fa-check-double azulColor sucessEdit" style="margin-left:10px;"></i>');
                    td.append(doubleCheck);

                    setTimeout(function () {
                        td.find('.sucessEdit').remove();
                    }, 2000);

                    setTimeout(function () {
                        tr.find(elemCheckbox + ':checked').trigger('click');
                        const alink = tr.find('a[href*="controlador.php?acao=procedimento_trabalhar"]');
                        const txttooltip = alink.attr('onmouseover') || '';
                        const tooltip = extractTooltipToArray(txttooltip);
                        const updatedTooltip = txttooltip.replace(tooltip[1], sanitizedText);
                        alink.attr('onmouseover', updatedTooltip);

                        getChangeTypeProc(idTypeProc, txtTypeProc);
                    }, 500);
                }
            );
        } else {
            resetDialogBoxPro('dialogBoxPro');
            alertaBoxPro(
                'Sucess',
                'check-circle',
                'Informa\u00E7\u00F5es editadas com sucesso!'
            );
            loadingButtonConfirm(false);
        }
    }

/* function checkLoadConfigSheets(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined') { 
        if (
            (checkConfigValue('gerenciarprojetos') && typeof spreadsheetIdProjetos_Pro !== 'undefined' && spreadsheetIdProjetos_Pro !== false && spreadsheetIdProjetos_Pro !== 'undefined') ||
            (checkConfigValue('gerenciarformularios') && typeof spreadsheetIdFormularios_Pro !== 'undefined' && spreadsheetIdFormularios_Pro !== false && spreadsheetIdFormularios_Pro !== 'undefined') ||
            (checkConfigValue('sincronizarprocessos') && typeof spreadsheetIdSyncProcessos_Pro !== 'undefined' && spreadsheetIdSyncProcessos_Pro !== false && spreadsheetIdSyncProcessos_Pro !== 'undefined')
        ){
            handleClientLoadPro();
            // console.log('handleClientLoadPro');
        }
    } else {
        setTimeout(function(){ 
            checkLoadConfigSheets(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload checkLoadConfigSheets'); 
        }, 500);
    }
} */

// ### FUNÇÕES PARA ADICIONAR NOVOS PAINEIS NA TELA DE CONTROLE DE PROCESSOS ###
// Aprimorado em 2025-04-12
    // INICIALIZA OS FAVORITOS DO PAINEL COM RECURSIVIDADE E TIMEOUT
    const initPanelFavorites = (TimeOut = 9000) => {
        if (TimeOut <= 0) return;

        if (
            typeof localStorageRestorePro !== 'undefined' &&
            typeof setPanelFavorites !== 'undefined' &&
            typeof orderDivPanel !== 'undefined'
        ) {
            if (
                checkConfigValue('gerenciarfavoritos') &&
                typeof getStoreFavoritePro() !== 'undefined' &&
                getStoreFavoritePro().hasOwnProperty('favorites')
            ) {
                setTimeout(() => {
                    setPanelFavorites('insert');
                    if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))
                        console.log('setPanelFavorites');
                }, 500);
            }
        } else {
            setTimeout(() => {
                initPanelFavorites(TimeOut - 100);
                if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))
                    console.log('Reload initPanelFavorites');
            }, 500);
        }
    };
    // ORDENA E INSERE UM BLOCO DE HTML NA POSIÇÃO CORRETA DO PAINEL
    const orderDivPanel = (html, idOrder, name) => {
        if (typeof getParamsUrlPro(window.location.href).acao_pro === 'undefined') {
            const $panelHome = $('.panelHomePro');

            if ($panelHome.length > 0) {
                $panelHome.each(function () {
                    const id = parseInt($(this).data('order'));
                    if (id > idOrder) {
                        $(html).insertBefore($(this));
                        return false;
                    }
                });

                if ($(`#${name}`).length === 0) {
                    $('#panelHomePro').append(html);
                }
            } else {
                $('#panelHomePro').append(html);
            }
        }
    };
    // INSERE O CONTAINER PRINCIPAL DO PAINEL SE AINDA NÃO EXISTIR NA TELA
    const insertDivPanel = () => {
        if ($('#panelHomePro').length === 0 && $('#tblMarcadores').length === 0) {
            const htmlPanel = sanitizeHTML(`
                <div id="panelHomePro" style="display: inline-block; width: 100%;"></div>
            `);
            $('#frmProcedimentoControlar').after($(htmlPanel));
            initSortDivPanel();
        }
    };
    // INICIALIZA O SISTEMA DE ORDENAÇÃO DOS PAINÉIS COM TENTATIVAS GRADUAIS
    const initSortDivPanel = (TimeOut = 9000) => {
        if (TimeOut <= 0) return;

        if (
            typeof $('#panelHomePro').sortable !== 'undefined' &&
            typeof getOptionsPro !== 'undefined' &&
            typeof setSortDivPanel !== 'undefined' &&
            typeof $().moveTo !== 'undefined'
        ) {
            if ($('#tblMarcadores').length === 0) {
                insertDivPanelControleProc();
                setSortDivPanel();

                if (!checkLoadedTableSorter() && (typeof storeGroupTablePro() === 'undefined' || storeGroupTablePro() === '')) {
                    removeAllTags(true, 4);
                }
            }
        } else {
            setTimeout(() => {
                initSortDivPanel(TimeOut - 100);
                if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))
                    console.log(`Reload initSortDivPanel => ${TimeOut}`);
                if (TimeOut === 9000 && typeof fnJqueryPro !== 'undefined') fnJqueryPro();
            }, 500);
        }
    };
    // INSERE O PAINEL DE CONTROLE DOS PROCESSOS NO SEI, SE AINDA NÃO EXISTIR
    const insertDivPanelControleProc = () => {
        const elementControleProc = isNewSEI ? 'collapseTabelaProcesso' : 'frmProcedimentoControlar';
        const statusHidden = getOptionsPro(elementControleProc) === 'hide';
        const statusView = statusHidden ? 'none' : 'initial';
        const statusIconShow = statusHidden ? '' : 'display:none;';
        const statusIconHide = statusHidden ? 'display:none;' : '';
        const idControleProc = isNewSEI ? `.${elementControleProc}` : `#${elementControleProc}`;

        const idOrder = (
            getOptionsPro('orderPanelHome') &&
            typeof jmespath !== 'undefined' &&
            jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='processosSEIPro'].index | length(@)") > 0
        )
            ? jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='processosSEIPro'].index | [0]")
            : '';

        const htmlIconTable = sanitizeHTML(`
            <i class="controleProcPro ${localStorage.getItem('seiSlim') ? 'fad fa-folders' : 'fas fa-folder-open'} cinzaColor"
            style="margin: 0 10px 0 0; font-size: 1.1em;"></i>
        `);

        const htmlToggleTable = sanitizeHTML(`
            <a class="controleProcPro newLink" id="${elementControleProc}_showIcon"
            style="font-size: 11pt; ${statusIconShow}">
            <i class="fas fa-plus-square cinzaColor"></i>
            </a>
            <a class="controleProcPro newLink" id="${elementControleProc}_hideIcon"
            style="font-size: 11pt; ${statusIconHide}">
            <i class="fas fa-minus-square cinzaColor"></i>
            </a>
        `);

        const htmlDivPanel = sanitizeHTML(`
            <div class="controleProcPro panelHomePro"
                style="display: inline-block; width: 100%;"
                id="processosSEIPro"
                data-order="${idOrder}">
            </div>
        `);

        if (isNewSEI) {
            $('#divFiltro, #collapseControle, #newFiltro, #divTabelaProcesso').addClass('collapseTabelaProcesso');
        }

        if ($('.controleProcPro').length === 0) {
            $('#divInfraBarraLocalizacao')
                .css('width', '100%')
                .addClass('titlePanelHome')
                .append($(htmlToggleTable))
                .prepend($(htmlIconTable));

            $(idControleProc).css({ width: '100%', display: statusView });
            $('#panelHomePro').prepend($(htmlDivPanel));
            $('#frmProcedimentoControlar').moveTo('#processosSEIPro');
            $('#divInfraBarraLocalizacao').moveTo('#processosSEIPro');

            if (isNewSEI && statusHidden) $(idControleProc).addClass('displayNone');

            if (!checkLoadedTableSorter() && (typeof storeGroupTablePro() === 'undefined' || storeGroupTablePro() === '')) {
                removeAllTags(false, 3);
            }
        }

        // DELEGAÇÃO DE EVENTOS DE BOTÕES SHOW/HIDE COM SEGURANÇA
        $(document).on('click', `#${elementControleProc}_showIcon`, () => {
            toggleTablePro(idControleProc, 'show');
        });

        $(document).on('click', `#${elementControleProc}_hideIcon`, () => {
            toggleTablePro(idControleProc, 'hide');
        });

        $(document).on('mouseover', `#${elementControleProc}_showIcon`, () => {
            infraTooltipMostrar('Mostrar Tabela');
        });

        $(document).on('mouseout', `#${elementControleProc}_showIcon`, () => {
            infraTooltipOcultar();
        });

        $(document).on('mouseover', `#${elementControleProc}_hideIcon`, () => {
            infraTooltipMostrar('Recolher Tabela');
        });

        $(document).on('mouseout', `#${elementControleProc}_hideIcon`, () => {
            infraTooltipOcultar();
        });
    };

// ### GERA LISTA DE PROCESSOS EM CSV na tela de controle de processos ###
// Aprimorado em 2025-04-12
    // FUNÇÃO PRINCIPAL DE GERAÇÃO DE TABELA
    const getTableProcessosCSV = () => {
        let htmlTable = `<table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Protocolo</th>
                    <th>Link_Permanente</th>
                    <th>Atribui\u00E7\u00E3o</th>
                    <th>Etiqueta</th>
                    <th>Etiqueta_Descri\u00E7\u00E3o</th>
                    <th>Anota\u00E7\u00E3o</th>
                    <th>Anota\u00E7\u00E3o_Respons\u00E1vel</th>
                    <th>Ponto_Controle</th>
                    <th>Especifica\u00E7\u00E3o</th>
                    <th>Tipo</th>
                    <th>Data_Autua\u00E7\u00E3o</th>
                    <th>Data_Autua\u00E7\u00E3o_Descri\u00E7\u00E3o</th>
                    <th>Data_Recebimento</th>
                    <th>Data_Recebimento_Descri\u00E7\u00E3o</th>
                    <th>Data_Envio</th>
                    <th>Data_Envio_Descri\u00E7\u00E3o</th>
                    <th>Unidade_Envio</th>
                    <th>Documento_Inclu\u00EDdo</th>
                    <th>Observa\u00E7\u00F5es</th>
                    <th>Acompanhamento_Especial</th>
                </tr>
            </thead>
            <tbody>`;

        // VERIFICA TABELA VISÍVEL (GERADOS OU RECEBIDOS)
        const table = $('#tblProcessosGerados').is(':visible')
            ? $('#tblProcessosRecebidos, #tblProcessosGerados')
            : $('#tblProcessosRecebidos');

        // SELECIONA LINHAS MARCADAS OU TODAS
        const tableSelect = table.find('tbody tr.infraTrMarcada').length > 0
            ? table.find('tbody tr.infraTrMarcada')
            : table.find('tbody tr.infraTrClara');

        tableSelect.each(function () {
            const td = $(this).find('td');
            const id_protocolo = $(this).attr('id').replace('P', '');
            const etiqueta = td.eq(1).find('a[href*="andamento_marcador_gerenciar"]').attr('onmouseover');
            const etiqueta_array = etiqueta ? extractAllTextBetweenQuotes(etiqueta) : false;
            const anotacao = td.eq(1).find('a[href*="anotacao_registrar"]').attr('onmouseover');
            const anotacao_array = anotacao ? extractAllTextBetweenQuotes(anotacao) : false;
            const doc_incluido = td.eq(1).find('img[src*="exclamacao.png"]').length > 0
                ? 'Um novo documento foi inclu\u00EDdo ou assinado'
                : '';
            const pontocontrole = td.eq(1).find('a[href*="andamento_situacao_gerenciar"]').attr('onmouseover');
            const pontocontrole_array = pontocontrole ? extractAllTextBetweenQuotes(pontocontrole) : false;
            const processo = td.eq(2).find('a[href*="procedimento_trabalhar"]');
            const descricao = processo.attr('onmouseover');
            const descricao_array = descricao ? extractAllTextBetweenQuotes(descricao) : false;
            const nr_processo = processo.text().trim();
            const url_processo = processo.attr('href');
            const atribuicao = td.eq(3).find('a[href*="procedimento_atribuicao_listar"]').text().trim();
            const info_array = getArrayProcessoRecebido(url_processo);

            // FORMATANDO DATAS
            const data_geracao = info_array.datageracao
                ? moment(info_array.datageracao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss')
                : '-';
            const desc_geracao = info_array.descricaodatageracao
                ? info_array.descricaodatageracao.replaceAll(';', '')
                : '-';
            const data_recebimento = info_array.datahora
                ? moment(info_array.datahora, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss')
                : '-';
            const desc_recebimento = info_array.descricao
                ? info_array.descricao.replaceAll(';', '')
                : '-';
            const data_envio = info_array.datesend
                ? moment(info_array.datesend, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss')
                : '-';
            const desc_envio = info_array.descricaosend
                ? info_array.descricaosend.replaceAll(';', '')
                : '-';
            const unidade_envio = info_array.unidadesend || '-';
            const observacoes = info_array.observacoes?.length
                ? info_array.observacoes.map(v => v.unidade ? `${v.unidade}: ${v.observacao}` : '').join('<br>')
                : '-';
            const acompanhamento_especial = info_array.acompanhamentoesp || '-';

            // GERA HTML SANITIZADO PARA CADA LINHA DA TABELA
            htmlTable += `
                <tr>
                    <td>${id_protocolo}</td>
                    <td>${sanitizeHTML(nr_processo)}</td>
                    <td>${sanitizeHTML(`${url_host}?acao=procedimento_trabalhar&id_procedimento=${id_protocolo}`)}</td>
                    <td>${sanitizeHTML(atribuicao || '-')}</td>
                    <td>${sanitizeHTML(etiqueta_array?.[1]?.replaceAll(';', '') || '-')}</td>
                    <td>${sanitizeHTML(etiqueta_array?.[0]?.replaceAll(';', '') || '-')}</td>
                    <td>${sanitizeHTML(anotacao_array?.[0]?.replaceAll(';', '') || '-')}</td>
                    <td>${sanitizeHTML(anotacao_array?.[1]?.replaceAll(';', '') || '-')}</td>
                    <td>${sanitizeHTML(pontocontrole_array?.[0]?.replaceAll(';', '') || '-')}</td>
                    <td>${sanitizeHTML(descricao_array?.[0]?.replaceAll(';', '') || '-')}</td>
                    <td>${sanitizeHTML(descricao_array?.[1]?.replaceAll(';', '') || '-')}</td>
                    <td>${data_geracao}</td>
                    <td>${sanitizeHTML(desc_geracao)}</td>
                    <td>${data_recebimento}</td>
                    <td>${sanitizeHTML(desc_recebimento)}</td>
                    <td>${data_envio}</td>
                    <td>${sanitizeHTML(desc_envio)}</td>
                    <td>${sanitizeHTML(unidade_envio)}</td>
                    <td>${sanitizeHTML(doc_incluido)}</td>
                    <td>${sanitizeHTML(observacoes)}</td>
                    <td>${sanitizeHTML(acompanhamento_especial)}</td>
                </tr>`;
        });

        htmlTable += '</tbody></table>';
        downloadTableCSV($(htmlTable), 'ListaProcessos_SEIPro');
    };

    // COPIA RESULTADO DE PESQUISA DE PROTOCOLO
    const copyTableResultProtocoloSEI = () => {
        const htmlTable = $('.tableResultProtocoloSEI')[0].outerHTML;
        copyToClipboardHTML(htmlTable);
    };

    // FAZ DOWNLOAD DA TABELA DE PROTOCOLO
    const downloadTableResultProtocoloSEI = () => {
        downloadTableCSV($('.tableResultProtocoloSEI'), 'PesquisaProtocolo_SEIPro');
    };

// ### FUNCIONALIDADE DE FILTRO NA TABELA DE CONTROLE DE PROCESSOS ###

    // INICIALIZA O FILTRO NA TABELA DE PROCESSOS
    const initFilterTableProcessos = (this_, TimeOut = 9000) => {
        if (TimeOut <= 0) return;

        if (checkLoadedTableSorter()) {
            filterTableProcessos(this_);
        } else {
            if (TimeOut === 9000) removeAllTags(false, 5);

            setTimeout(() => {
                initFilterTableProcessos(this_, TimeOut - 100);

                if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) {
                    console.log('Reload initFilterTableProcessos');
                }
            }, 1500);
        }
    };

    // ATIVA OU DESATIVA O FILTRO NA TABELA DE PROCESSOS
    const filterTableProcessos = (this_) => {
        const _this = $(this_);
        const _parent = _this.closest('thead');
        const table = _this.closest('table');
        const filter = _parent.find('.tablesorter-filter-row');

        if (_this.hasClass('newLink_active')) {
            filter.addClass('hideme');
            _this.removeClass('newLink_active');
            table.trigger('filterReset');
        } else {
            filter.removeClass('hideme').find('input:visible').eq(1).focus();
            _this.addClass('newLink_active');
        }
    };

    // INICIALIZA O TABLESORTER NA TELA INICIAL
    const initTableSorterHome = (TimeOut = 1000) => {
        if (TimeOut <= 0) return;

        if (
            typeof corrigeTableSEI !== 'undefined' &&
            typeof checkConfigValue !== 'undefined' &&
            typeof $().tablesorter !== 'undefined' &&
            $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('tbody tr').length
        ) {
            if (checkConfigValue('ordernartabela') && !$('#frmPesquisaProtocolo').length) {
                setTableSorterHome();
            }
        } else {
            setTimeout(() => {
                if (typeof $().tablesorter === 'undefined' && TimeOut === 1000) {
                    $.getScript(`${parent.URL_SPRO}js/lib/jquery.tablesorter.combined.min.js`);
                }

                initTableSorterHome(TimeOut - 100);

                if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) {
                    console.log('Reload initTableSorterHome');
                }
            }, 500);
        }
    };

// ### INICIALIZA E CONFIGURA O TABLESORTER PARA TABELAS NA PÁGINA INICIAL, ADICIONANDO FUNCIONALIDADES DE FILTRO E ORDENAÇÃO. ###
// Aprimorado em 2025-04-12
    const setTableSorterHome = () => {

        // CONFIGURA O MUTATION OBSERVER PARA TRATAR ALTERAÇÕES NA TABELA
        const observerFilterHome = new MutationObserver((mutations) => {
            const _this = $(mutations[0].target);
            const _parent = _this.closest('table');
            const iconFilter = _parent.find('.filterTableProcessos');
            const checkIconFilter = iconFilter.hasClass('newLink_active');
            const hideme = _this.hasClass('hideme');

            if (hideme && checkIconFilter) {
                iconFilter.removeClass('newLink_active');
            }
        });

        const tableSorterHome = $('#tblProcessosGerados, #tblProcessosRecebidos, #tblProcessosDetalhado');

        if (tableSorterHome.length > 0) {
            window.tableHomePro = [];
            setSortLocaleCompare();

            tableSorterHome.each(function (i) {
                const $this = $(this);

                if (!$this.hasClass('infraTableOrdenacao')) {
                    corrigeTableSEI(this);

                    if (isNewSEI) {
                        tableSorterHome.find('th:nth-child(2)').each(function () {
                            const $_this = $(this);
                            if ($_this.attr('colspan') == 3) {
                                $_this.removeAttr('colspan');
                                const beforeTh = $_this.clone().text('');
                                const aftereTh = $_this.clone().text('');
                                $_this.before(beforeTh);
                                $_this.after(aftereTh);
                            }
                        });

                        $('#ancLiberarMeusProcessos').click(() => verMeusProcessos('T'));
                        $('#ancLiberarMarcador').click(() => filtrarMarcador(null));
                        $('#ancLiberarTipoProcedimento').click(() => filtrarTipoProcedimento(null));
                        $('#ancLiberarTipoPrioridade').click(() => filtrarTipoPrioridade(null));
                    }

                    const elemID = $this.attr('id');
                    const sortListArray = (typeof sortListSaved !== 'undefined' && sortListSaved && typeof sortListSaved[elemID] !== 'undefined') ? sortListSaved[elemID].sortList : [];
                    const configSorter = {
                        sortLocaleCompare: true,
                        textExtraction: {
                            1: (elem) => {
                                let text_return = '';
                                if ($(elem).find('img').length > 0) {
                                    $(elem).find('img').each(function () {
                                        let type_img = $(this).attr('src').indexOf('anotacao') != -1 ? 'Nota:' : '';
                                        type_img = $(this).attr('src').indexOf('marcador') != -1 ? 'Marcador:' : type_img;
                                        const prioridade = $(this).attr('src').indexOf('prioridade') != -1 ? '1' : '2';
                                        let texttip = $(this).closest('a').attr('onmouseover');
                                        texttip = (typeof texttip !== 'undefined') ? texttip : $(this).attr('onmouseover');
                                        texttip = (typeof texttip !== 'undefined') ? extractTooltip(texttip) : '';
                                        text_return += prioridade + ' ' + type_img + ' ' + texttip;
                                    });
                                }
                                text_return = (text_return == '') ? '3' : text_return.replace(/  /g, ' ');
                                return text_return;
                            },
                            2: (elem) => {
                                const processo = $(elem).find('a').eq(0);
                                const nrProc = processo.text().trim();
                                let texttip = processo.attr('onmouseover');
                                texttip = (typeof texttip !== 'undefined') ? extractTooltip(texttip) : '';
                                const urgente = (texttip != '' && texttip.toLowerCase().indexOf('(urgente)') !== -1) ? '0 ' : '';
                                let prescricao = $(elem).find('.progressPrescricao').attr('aria-percent');
                                prescricao = typeof prescricao !== 'undefined' ? ' ' + prescricao + ' ' : ' 0 ';
                                return urgente + prescricao + nrProc + ' ' + texttip;
                            },
                            4: (elem) => {
                                const target = $(elem).find('.dateboxDisplay').eq(0);
                                const text_date = (typeof target !== 'undefined' && target.length > 0) ? target.data('time-sorter') : $(elem).text().trim();
                                return text_date;
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
                        sortList: sortListArray,
                        sortReset: true,
                        ignoreCase: true,
                        sortLocaleCompare: true,
                        headers: {
                            0: {
                                sorter: false,
                                filter: false
                            },
                            1: {
                                sorter: true,
                                filter: true
                            },
                            2: {
                                sorter: true,
                                filter: true
                            },
                            3: {
                                sorter: true,
                                filter: true
                            },
                            4: {
                                sorter: true,
                                filter: true
                            }
                        }
                    };

                    $this.find("thead th:eq(0)").data("sorter", false);
                    const tableHomeThis = $this.tablesorter(configSorter).on("sortEnd", () => {
                        checkboxRangerSelectShift();
                    }).on("filterEnd", function (event, data) {
                        checkboxRangerSelectShift();
                        const caption = $(this).find("caption").eq(0);
                        const tx = caption.text();
                        caption.text(tx.replace(/\d+/g, data.filteredRows));
                        $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                        $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
                    });

                    tableHomePro.push(tableHomeThis);

                    const filter = $this.find('.tablesorter-filter-row').get(0);
                    if (typeof filter !== 'undefined') {
                        setTimeout(() => {
                            let htmlFilter = `<a class="newLink filterTableProcessos ${$this.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'newLink_active'}"
                                            style="left: 0; top: -20px; position: absolute;">
                                                <i class="fas fa-search cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>
                                            </a>`;

                            $this.find('thead .filterTableProcessos').remove();
                            $this.find('thead').prepend(htmlFilter);
                        
                            observerFilterHome.observe(filter, {
                                attributes: true
                            });
                            tableSorterHome.find('.tablesorter-filter-row input.tablesorter-filter[aria-label*="Prazos"]').attr('type', 'date');
                        });
                    }
                }
            });

            if (tableSorterHome.find('tbody tr td:nth-child(2)').find('img').length > 0) {
                tableSorterHome.find('thead tr:first th:nth-child(2)').css('width', '150px');
            }

            setTimeout(() => {
                if ($('.filterTableProcessos').length == 0) {
                    setTimeout(() => {
                        if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload tableHomeDestroy *****');
                        tableHomeDestroy(true);
                    }, 1000);
                }

                const filterStore = (typeof tableHomePro[0] !== 'undefined' && typeof tableHomePro[0][0] !== 'undefined') ? $.tablesorter.storage(tableHomePro[0][0], 'tablesorter-filters') : [];
                if (typeof filterStore !== 'undefined' && filterStore !== null && filterStore.length > 0) {
                    let filterUser = filterStore[3];
                    filterUser = (typeof filterUser !== 'undefined' && filterUser !== null) ? filterUser.replace('(', '').replace(')', '') : false;
                    if (filterUser) {
                        $('#filterTableHome').val(filterUser).trigger('chosen:updated');
                    }
                }
                // ADICIONA DELEGAÇÃO DE EVENTOS PARA O ELEMENTO CRIADO DINAMICAMENTE
                $(document).on('click', '.filterTableProcessos', function() {
                    initFilterTableProcessos(this);
                });
                $(document).on('mouseover', '.filterTableProcessos', function() {
                    infraTooltipMostrar('Pesquisar na tabela')
                });
                $(document).on('mouseout', '.filterTableProcessos', function() {
                    infraTooltipOcultar();
                });
            }, 1000);
        }
    };
    // FUNÇÃO PARA DESTRUIR TABELAS HOME COM RELOAD OPCIONAL
    const tableHomeDestroy = (reload = false, tableHomeTimeout = 3000) => {
        if (tableHomePro.length > 0) {
            tableHomePro.forEach((table, i) => {
                table.trigger('destroy');
            });

            // REMOVE FILTROS EXISTENTES DA TABELA
            $('.filterTableProcessos').remove();
            window.tableHomePro = [];

            if (reload && tableHomeTimeout > 0) {
                initTableSorterHome();

                // DEBUG OPCIONAL CASO CONFIG HABILITADA
                if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) {
                    console.log(`Reload initTableSorterHome => ${tableHomeTimeout}`);
                }

                setTimeout(() => {
                    forceTableHomeDestroy(tableHomeTimeout - 500);
                }, 1000);
            }
        } else {
            initTableSorterHome();
        }
    };

    // FUNÇÃO PARA FORÇAR A DESTRUIÇÃO DAS TABELAS APÓS VERIFICAÇÃO DE FILTROS
    const forceTableHomeDestroy = (Timeout = 3000) => {
        if (Timeout <= 0) return;

        let force = false;

        tableHomePro.forEach((table, i) => {
            const filter = $.tablesorter.storage(table[0], 'tablesorter-filters');
            const rowFilter = $(table[0]).find('tr.tablesorter-filter-row').hasClass('hideme');

            // DEFINE SE A DESTRUIÇÃO DEVE SER FORÇADA COM BASE NOS FILTROS
            force = (typeof filter !== 'undefined' && filter !== null && filter.length > 0 && rowFilter) ? true : force;
        });

        if (force && Timeout > 0 && $('#tblProcessosGerados').is(':visible')) {
            tableHomeDestroy(true, Timeout - 1000);

            // DEBUG OPCIONAL CASO CONFIG HABILITADA
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) {
                console.log(`Reload forceTableHomeDestroy => ${Timeout}`);
            }
        }
    };

// ### FORÇA A EXECUÇÃO DO EVENTO ONLOAD DO BODY, MESMO APÓS MODIFICAÇÕES DINÂMICAS ###
// Aprimorado em 2025-04-14
    const forceOnLoadBody = () => {
        const onload = new Function($('body').attr('onload'));
        if (isNewSEI && typeof $.modalLink === 'undefined' && !$('.sparkling-modal-frame').length) {
            $.get($('script[src*="jquery.modalLink"]').attr('src'), () => {
                onload();
            });
        } else {
            onload();
        }
    };

// ### OBSERVA ALTERAÇÕES NA ÁREA TELA, RECARREGANDO ATÉ UM TEMPO MÁXIMO ###
// Aprimorado em 2025-04-14
    const observeAreaTela = (timeout = 9000) => {
        initWithRetry({
            fnName: 'observeResizeAreaTela',
            condition: () => typeof setResizeAreaTelaD !== 'undefined' && typeof ResizeObserver !== 'undefined' && typeof divInfraAreaTelaD !== 'undefined',
            timeout,
            debugLabel: 'observeAreaTela',
            param: () => {
                // OBSERVADOR DE REDIMENSIONAMENTO INSTANCIADO
                new ResizeObserver(setResizeAreaTelaD).observe(divInfraAreaTelaD);
            }
        });
    };

// ### SUBSTITUI E SANITIZA OS TOOLTIPs DAS ANOTAÇÕES NOS PROCESSOS EXIBIDOS ###
// Aprimorado em 2025-04-14
    const replaceSticknoteHome = () => {
        const arraySticknoteHome = [];

        $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado')
            .find('a[href*="acao=anotacao_registrar"]')
            .each(function () {
                const tooltip = $(this).attr('onmouseover')?.split("'") || false;

                if (tooltip) {
                    const idHref = $(this).attr('href');
                    const id_protocolo = idHref ? getParamsUrlPro(idHref).id_protocolo : false;
                    const texttip = tooltip[1];
                    const usertip = tooltip[3];

                    const tooltipHTML = $.map(texttip.split('\\n'), (v) => {
                        if (v !== '') {
                            const check = v.indexOf('[ ]') !== -1;
                            const checked = v.indexOf('[X]') !== -1;
                            const style = checked ? ' style=\\"text-decoration: line-through;\\"' : '';
                            let text = check ? '<i class=\\"far fa-square\\"></i> ' + v.replace('[ ]', '').trim() : v;
                            text = checked ? '<i class=\\"fas fa-check-square\\"></i> ' + v.replace('[X]', '').trim() : text;
                            return (check || checked) ? `<div${style}>${text}</div>` : v;
                        }
                        return v;
                    }).join('');

                    const safeTooltipHTML = sanitizeHTML(tooltipHTML);
                    $(this).attr('onmouseover', `return infraTooltipMostrar('${safeTooltipHTML}','${usertip}');`);

                    if (id_protocolo) {
                        arraySticknoteHome.push({ id_protocolo, usertip, texttip });
                    }
                }
            });

        setOptionsPro('arraySticknoteHome', arraySticknoteHome);
    };

    // INICIALIZA A SUBSTITUIÇÃO DOS STICKNOTES APÓS VERIFICAR A CONFIGURAÇÃO
    const initReplaceSticknoteHome = (timeout = 9000) => {
        initWithRetry({
            fnName: 'replaceSticknoteHome',
            condition: () => typeof checkConfigValue !== 'undefined' && checkConfigValue('infoarvore'),
            timeout,
            debugLabel: 'initReplaceSticknoteHome'
        });
    };

// ### INICIALIZA A ATRIBUIÇÃO DE NOMES COMPLETOS ###
// Aprimorado em 2025-04-14
const initFullnameAtribuicao = (timeout = 3000) => {
    initWithRetry({
        fnName: 'fullnameAtribuicao',
        condition: () => typeof verifyConfigValue !== 'undefined' && verifyConfigValue('nomesusuarios'),
        timeout,
        debugLabel: 'initFullnameAtribuicao'
    });
};

// ### INICIALIZA A VISUALIZAÇÃO DE ESPECIFICAÇÃO DO PROCESSO ###
// Aprimorado em 2025-04-14
const initViewEspecifacaoProcesso = (timeout = 1000) => {
    initWithRetry({
        fnName: 'viewEspecifacaoProcesso',
        condition: () => typeof verifyConfigValue !== 'undefined' && verifyConfigValue('especificaprocesso'),
        timeout,
        debugLabel: 'initViewEspecifacaoProcesso'
    });
};

// ### INICIALIZA A EXIBIÇÃO DO NÚMERO DO PROCESSO NO FAVICON ###
// Aprimorado em 2025-04-14
const initFaviconNrProcesso = (timeout = 9000) => {
    initWithRetry({
        fnName: 'getFaviconNrProcesso',
        condition: () => typeof Favico !== 'undefined' && typeof checkConfigValue !== 'undefined' && checkConfigValue('contadoricone'),
        timeout,
        debugLabel: 'initFaviconNrProcesso'
    });
};

// ### INICIALIZA O RECARREGAMENTO DO LINK DO MODAL ###
// Aprimorado em 2025-04-14
const initReloadModalLink = (timeout = 9000) => {
    initWithRetry({
        fnName: 'reloadModalLink',
        condition: () => typeof reloadModalLink !== 'undefined',
        timeout,
        debugLabel: 'initReloadModalLink'
    });
};

// ### INICIALIZA A TROCA DOS ÍCONES DA INTERFACE ###
// Aprimorado em 2025-04-14
const initReplaceNewIcons = (timeout = 9000) => {
    // VERIFICA SE O SEI SLIM ESTÁ ATIVO OU SE A JANELA NÃO É A PRINCIPAL
    if (localStorage.getItem('seiSlim') === null || timeout <= 0 || parent?.window?.name !== '') return;

    // ADICIONA CLASSE AOS BOTÕES DO SEI SE NOVA INTERFACE ESTIVER ATIVA
    if (typeof isNewSEI !== 'undefined' && isNewSEI) {
        $('#divComandos a').addClass('botaoSEI');
    }

    // EXECUTA FUNÇÃO RECURSIVA PARA TROCA DOS ÍCONES
    initWithRetry({
        fnName: 'replaceNewIcons',
        condition: () => typeof replaceNewIcons === 'function',
        param: typeof isNewSEI !== 'undefined' && isNewSEI
            ? $('.barraBotoesSEI a.botaoSEI')
            : $('.infraBarraComandos a.botaoSEI'),
        timeout,
        debugLabel: 'initReplaceNewIcons'
    });
};

// ### INICIALIZA O OBSERVADOR DE MUDANÇA NA URL ###
// Aprimorado em 2025-04-14
    const initObserveUrlChange = (timeout = 9000) => {
        // ENCERRA SE ESTIVER EM UM FRAME EXTERNO OU SE O TEMPO ACABAR
        if (timeout <= 0 || parent.window.name !== '') return;

        // EXECUTA A LÓGICA USANDO initWithRetry
        initWithRetry({
            timeout,
            debugLabel: 'initObserveUrlChange',
            condition: () => typeof parent.verifyConfigValue === 'function',
            param: () => {
                // CHAMA A FUNÇÃO RESPONSÁVEL PELA OBSERVAÇÃO DE MUDANÇA NA URL
                setObserveUrlChange();
            }
        });
    };
    // OBSERVA A ALTERAÇÃO NA URL (#HASH) E REAGE DE ACORDO COM A MUDANÇA
    const setObserveUrlChange = () => {
        if (parent.verifyConfigValue('urlamigavel')) {
            $(window).on('hashchange', () => {
                const ifrArvore = $('#ifrArvore').contents();
                const sourceLink = ifrArvore.find('.infraArvoreNoSelecionado').eq(0).closest('a[target="ifrVisualizacao"]');
    
                let nrSEI = sourceLink ? getNrSei(sourceLink.text().trim()) : false;
                nrSEI = (nrSEI === '') ? false : nrSEI;
    
                let nrSEI_URL = (window.location.hash.includes('@')) ? window.location.hash.replace('#', '').split('@')[1] : false;
                nrSEI_URL = (nrSEI_URL === '') ? false : nrSEI_URL;
    
                let idSource = (iHistoryArray.length > 0) 
                    ? jmespath.search(iHistoryArray, `[?sei=='@${nrSEI}'] | [0].id`) 
                    : null;
                idSource = (idSource === null) ? false : idSource;
    
                let idTarget = (iHistoryArray.length > 0) 
                    ? jmespath.search(iHistoryArray, `[?sei=='@${nrSEI_URL}'] | [0].id`) 
                    : null;
                idTarget = (idTarget === null) ? false : idTarget;
    
                // VERIFICA MUDANçA NA URL E EXECUTA AÇÕES PARA ATUALIZAR A ÁRVORE
                if (nrSEI_URL && nrSEI && nrSEI !== nrSEI_URL && !delayCrash) {
                    delayCrash = true;
    
                    setTimeout(() => {
                        delayCrash = false;
                    }, 300);
    
                    sourceLink.closest('.infraArvore')
                              .find('.infraArvoreNoSelecionado')
                              .removeClass('infraArvoreNoSelecionado');
    
                    const targetLink = ifrArvore.find(`a[target="ifrVisualizacao"]:contains("${nrSEI_URL}")`);
                    const pastaArvore = targetLink.closest('.infraArvore');
    
                    targetLink.off('click').trigger('click');
    
                    if (idSource && idTarget) {
                        (idSource > idTarget) ? window.history.back(-1) : window.history.go(1);
                    }
    
                    setClickUrlAmigavel();
    
                    if (!pastaArvore.is(':visible')) {
                        const pastaID = pastaArvore.attr('id').replace('div', '');
                        ifrArvore.find(`#ancjoin${pastaID}`).trigger('click');
                    }
                }
            });
        }
    };
    
// ### REMOVE OS DADOS DE MARCADORES E LISTA DE USUÁRIOS DO PAINEL DO PROCESSO E CARREGA NOVAMENTE ###
// Aprimorado em 2025-04-14
    const removeDataPanelProc = (_this) => {
        removeOptionsPro('listaMarcadores');
        removeOptionsPro('arrayListUsersSEI');
        getPanelProc(_this);
    };
    
// INICIALIZA O KANBAN DE PROCESSOS, CARREGANDO A BIBLIOTECA jKanban SE NECESSÁRIO
const initAddKanbanProc = (type = storeGroupTablePro(), loop = 3, timeout = 9000) => {
    // CARREGA O SCRIPT jKanban SE AINDA NÃO ESTIVER DISPONÍVEL
    if (typeof jKanban === 'undefined') {
        $.getScript(`${URL_SPRO}js/lib/jkanban.min.js`);
    }

    // EXECUTA A LÓGICA USANDO initWithRetry
    initWithRetry({
        timeout,
        debugLabel: 'initAddKanbanProc',
        condition: () => typeof jKanban !== 'undefined',
        param: () => {
            // CHAMA A FUNÇÃO QUE MONTA O KANBAN
            addKanbanProc(type, loop);
        }
    });
};
function selectPanelKanbanHome() {
    var type = storeGroupTablePro();
        type = (!type || type == 'all' || type == '') ? false : true;
        type = true;
    var html =  '<div id="processosProActions" class="panelHome panelHomeProcessos" style="'+(type ? '' : 'display:none;')+' position: absolute;z-index: 999;right: 0;width: auto;margin: 15px 0 0 0;">'+
                '    <div class="btn-group processosBtnPanel" role="group" style="float: right;margin-right: 10px;">'+
                '       <button type="button" onclick="getPanelProc(this)" data-value="Tabela" class="btn btn-sm btn-light '+(getOptionsPro('panelProcessosView') == 'Tabela' || !getOptionsPro('panelProcessosView') ? 'active' : '')+'"><i class="fas fa-table" style="color: #888;"></i> <span class="text">Tabela</span></button>'+
                '       <button type="button" onclick="getPanelProc(this)" title="D\u00EA um duplo clique para atualizar o quadro" ondblclick="removeDataPanelProc(this)" data-value="Quadro" class="btn btn-sm btn-light '+(getOptionsPro('panelProcessosView') == 'Quadro' ? 'active' : '')+'"><i class="fas fa-project-diagram" style="color: #888;"></i> <span class="text">Quadro</span></button>'+
                '    </div>'+
                '</div>';
    return html;
}
function getPanelProc(this_) {
    var data = $(this_).data();
    var mode = data.value;
    $(this_).closest('#processosProActions').find('.btn.active').removeClass('active');
    $(this_).addClass('active');
    if (mode == 'Quadro') {
        var type = storeGroupTablePro();
        if (!type || type == 'all' || type == '') {
            var selectGroupTablePro = $('#selectGroupTablePro');
                selectGroupTablePro.val('tags').trigger('change');
                if (verifyConfigValue('substituiselecao')) {
                    selectGroupTablePro.chosen('destroy').chosen({
                        placeholder_text_single: ' ',
                        no_results_text: 'Nenhum resultado encontrado'
                    }).trigger('chosen:updated');
                }
                setTimeout(function(){ 
                    initAddKanbanProc();
                }, 500);
        } else {
            initAddKanbanProc();
        }
    } else {
        $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').show();
        $('#processosKanban').remove();
        initTableTag(storeGroupTablePro());
    }
    setOptionsPro('panelProcessosView', mode);
}
function addKanbanProc(type = storeGroupTablePro(), loop = 3) {
    if (typeof jKanban === 'undefined') $.getScript(URL_SPRO+"js/lib/jkanban.min.js");
    if (!type || type == 'all' || type == '') {
        setOptionsPro('panelProcessosView', 'Tabela');
        $('#processosProActions').find('.btn[data-value="Tabela"]').trigger('click');
    } else {
        var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
        if (type == 'users') {
            if (getOptionsPro('arrayListUsersSEI') && getOptionsPro('arrayListUsersSEI').length > 0) {
                $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-project-diagram');
                var itensKanban = $.map(getOptionsPro('arrayListUsersSEI'),function(v){
                    var nameuser = (checkConfigValue('nomesusuarios') && v.name.indexOf('-') !== -1) 
                        ? v.name.split('-')[1].trim().split(/(\s).+\s/).join("") 
                        : (v.name.indexOf('-') !== -1) 
                            ? v.name.split('-')[0].trim() 
                            : v.name
                    return nameuser;
                });
                itensKanban.unshift('');
            } else if (loop > 0) {
                getAjaxListaAtribuicao();
                setTimeout(function(){ initAddKanbanProc(type, loop-1); }, 2000);
                $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-spinner fa-spin');
            }
        } else if (type == 'tags') {
            if (getOptionsPro('listaMarcadores') && getOptionsPro('listaMarcadores').length > 0) {
                $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-project-diagram');
                var itensKanban = $.map(getOptionsPro('listaMarcadores'),function(v){
                    return v.name;
                });
                itensKanban.unshift('');
            } else if (loop > 0) {
                getAjaxListaMarcador();
                setTimeout(function(){ initAddKanbanProc(type, loop-1); }, 2000);
                $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-spinner fa-spin');
            }
        } else {
            var itensKanban = getListTypes(type);
            $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-project-diagram');
        }
        if (!!itensKanban && type != '') {
            itensKanban = $.map(itensKanban, function(v, i){ return {order: i, name: v, id: getTagName(v, type)} });
            var tr = tableProc.find('tr[data-tagname]:not(.tagintable)');
            var itens = tr.map(function(){ 
                    var tagName = $(this).data('tagname');
                    var idTag = 'id_'+tagName;
                    var nameLabel = jmespath.search(itensKanban, "[?id=='"+tagName+"'] | [0].name");
                        nameLabel = nameLabel !== null && nameLabel != ''  ? nameLabel : 'Sem Grupo';
                    var linkProc = $(this).find('a[href*="acao=procedimento_trabalhar"]');
                    var tip = extractTooltipToArray(linkProc.attr('onmouseover'));
                        tip = (typeof tip !== 'undefined') ? tip : false;
                    var id_protocolo = getParamsUrlPro(linkProc.attr('href')).id_procedimento;
                    if (typeof id_protocolo !== 'undefined') {
                        return {
                            id: idTag,
                            title: nameLabel,
                            id_protocolo: String(id_protocolo),
                            processo: linkProc.text(),
                            especificacao: tip ? tip[0] : false,
                            tipo: tip ? tip[1] : false,
                            html_icons: $(this).find('td').eq(1).html(),
                            html_proc: $(this).find('td').eq(2).html(),
                            html_atribuicao: $(this).find('td').eq(3).html(),
                            html_prazo: $(this).find('td.prazoBoxDisplay').html(),
                            color: $(this).data('color') ? $(this).css('color') : false
                        }
                    }
            }).get();

            $('#processosKanban').remove();
            $('#newFiltro').after('<div id="processosKanban" style="display: inline-block;margin-top: 60px;width: 100%;"></div>');

            var bords_list = $.map(itensKanban, function(v, i){
                var item = jmespath.search(itens, "[?id=='id_"+v.id+"']");
                var title = v.name == '' ? 'Sem Grupo' : v.name;
                    title = ((type == 'arrivaldate' || type == 'acessdate' || type == 'senddate' || type == 'createdate' || type == 'deadline') && title.indexOf('.') !== -1 ) ? title.split('.')[1] : title;
                var order_board = getOptionsPro('panelProcessosOrder_'+type) ? jmespath.search(getOptionsPro('panelProcessosOrder_'+type), "[?id=='"+v.id+"'] | [0].order") : i;
                    order_board = order_board === null ? 9999 : order_board;
                var collapse_board = getOptionsPro('panelProcessosOrder_'+type) ? jmespath.search(getOptionsPro('panelProcessosOrder_'+type), "[?id=='"+v.id+"'] | [0].collapse") : null;
                    collapse_board = collapse_board === null ? false : collapse_board;

                var itens_board = $.map(item,function(value, index){

                    var iten_urgente = value.especificacao && value.especificacao.toLowerCase().indexOf('(urgente)') !== -1 ? true : false;
                    var item_pinboard = false;
                    var order_item = getOptionsPro('panelProcessosOrder_'+type) ? jmespath.search(getOptionsPro('panelProcessosOrder_'+type), "[?id=='"+v.id+"'].itens | [0] | [?id=='"+value.id_protocolo+"'] | [0]") : index;
                        item_pinboard = order_item === null ? item_pinboard : order_item.pinboard;
                        order_item = order_item === null ? 9999 : order_item.order;
                        order_item = iten_urgente ? -1 : order_item;
                    var pinBoard = '<span style="float: right;margin: -5px -10px 0 0;" class="kanban-pinboard info_noclick"><a class="newLink info_noclick '+(item_pinboard ? 'newLink_active' : '')+'" onclick="pinKanbanItensProc(this, '+value.id_protocolo+')" onmouseover="return infraTooltipMostrar(\''+(item_pinboard ? 'Remover do topo' : 'Fixar no topo')+'\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-thumbtack cinzaColor"></i></a></span>';
                    
                    return {
                        id: value.id_protocolo,
                        order: order_item,
                        title:  pinBoard+
                                '<div class="kanban-content">'+
                                '   <div class="kanban-title-card content_edit" data-field="assunto" data-id="'+value.id_protocolo+'">'+
                                '       <span class="info" data-type="proc" style="width: 75%;">'+
                                '           '+value.html_proc+
                                '           <a class="newLink info_noclick followLinkNewtab" href="controlador.php?acao=procedimento_trabalhar&id_procedimento='+value.id_protocolo+'" onmouseover="return infraTooltipMostrar(\'Abrir em nova aba\');" onmouseout="return infraTooltipOcultar();" target="_blank"><i class="fas fa-external-link-alt" style="font-size: 90%; text-decoration: underline;"></i></a>'+
                                '       </span>'+
                                '   </div>'+
                                '   <div class="kanban-description">'+
                                '       <span class="sub info_noclick" data-type="especificacao">'+value.especificacao+'</span>'+
                                '       <span class="sub info_noclick" data-type="tipo">'+value.tipo+'</span>'+
                                '       <span class="sub info_noclick" data-type="atribuicao">'+value.html_atribuicao+'</span>'+
                                '       <span class="sub info_noclick" data-type="icons">'+value.html_icons+'</span>'+
                                '       <span class="sub info_noclick" data-type="prazo">'+value.html_prazo+'</span>'+
                                '   </div>'+
                                '</div>',
                        click: function(el) {
                            var id_protocolo = el.dataset.eid;
                            var checkOver = ($(el).find('.info_noclick:hover').length > 0) ? $(el).find('.info_noclick:hover') : false;
                            var newTab = ($(el).find('.followLinkNewtab:hover').length > 0) ? $(el).find('.followLinkNewtab:hover') : false;
                            if (!dialogBoxPro && !checkOver && id_protocolo) window.location.href = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+id_protocolo;
                            if (!dialogBoxPro && id_protocolo && newTab) openLinkNewTab('controlador.php?acao=procedimento_trabalhar&id_procedimento='+id_protocolo);
                        },
                        class: iten_urgente ? 'urgente' : ''
                    }
                });
                itens_board.sort(function(a,b){ return a.order - b.order;});

                return {
                    id: v.id,
                    title: title,
                    order: order_board,
                    class: 'proc_'+type,
                    color: (typeof item[0] !== 'undefined') ? item[0].color : false,
                    collapse: collapse_board,
                    item: itens_board
                }
            });

            bords_list.sort(function(a,b){ return a.order - b.order;});

            var kanban = new jKanban({
                element: '#processosKanban',
                gutter: '10px',
                widthBoard: "calc(25% - 20px)",
                // responsivePercentage: true,
                itemHandleOptions:{
                    enabled: true,
                },
                dragEl: function(el, source){
                    var sourceEl = source.parentElement.getAttribute('data-id');
                    var id_protocolo = el.dataset.eid;
                    var elemItem = $('#processosKanban .kanban-item[data-eid="'+id_protocolo+'"]');
                        kanbanProcessosMoving = {source: sourceEl, id: el.dataset.eid, order: elemItem.index()};
                        // drag_auto_scroll(el);
                },
                dropEl: function(el, target, source, sibling){
                    updateOrderKanbanBoardProc();

                    var targetEl = target.parentElement.getAttribute('data-id');
                    var sourceEl = source.parentElement.getAttribute('data-id');
                    var id_protocolo = el.dataset.eid;
                    var elemItem = $('#processosKanban .kanban-item[data-eid="'+id_protocolo+'"]');
                    var titleSource = elemItem.closest('.kanban-board').find('.kanban-title-board').text();
                    var elemContent = elemItem.find('.kanban-content');
                    var elemProc = elemContent.find('span[data-type="proc"]');
                    var elemUser = elemContent.find('span[data-type="atribuicao"]');
                    var elemIcons = elemContent.find('span[data-type="icons"]');
                    var elemTypes = elemContent.find('span[data-type="tipo"]');

                    if (type == 'users' && sourceEl != targetEl) {
                        var arrayListUsersSEI = getOptionsPro('arrayListUsersSEI');
                        if (arrayListUsersSEI) {
                            var idUser = jmespath.search(arrayListUsersSEI, "[?contains(name,'"+targetEl+"')] | [0].value");
                                idUser = idUser !== null ? idUser : false;
                                idUser = idUser == 'SemGrupo' ? 'null' : idUser;
                            var linkAtribuicao = tableProc.find('a[href*="&id_usuario_atribuicao='+idUser+'"]').attr('href');
                                elemProc.prepend('<i class="fas fa-sync fa-spin cinzaColor" style="margin-right: 5px;"></i>');

                                updateDadosArvore('Atribuir Processo', 'selAtribuicao', idUser, id_protocolo, function(){ 
                                    if (targetEl != 'SemGrupo') {
                                        var targetAtribuicao = '(<a href="'+linkAtribuicao+'" title="Atribu\u00EDdo para '+targetEl+'" class="ancoraSigla">'+targetEl+'</a>)';
                                        elemUser.html(targetAtribuicao);
                                        tableProc.find('tr[id="P'+id_protocolo+'"]').find('td').eq(3).html(targetAtribuicao);
                                    } else {
                                        elemUser.html('');
                                        tableProc.find('tr[id="P'+id_protocolo+'"]').find('td').eq(3).html('');
                                    }
                                    elemProc.find('i.fa-sync').remove();
                                    elemProc.prepend('<i class="fas fa-check-double verdeColor" style="margin-right: 5px;"></i>');
                                    setTimeout(function(){ elemProc.find('i.fa-check-double').remove(); }, 2000);
                                });
                        }
                    } else if (type == 'tags' && sourceEl != targetEl) {
                        var listMarcadores = getOptionsPro('listaMarcadores');
                            listMarcadores = listMarcadores ? $.map(listMarcadores, function(v){
                                                return {name: getTagName(v.name, type), value: v.value, img: v.img}
                                            }) : false;
                            listMarcadores = listMarcadores !== null ? listMarcadores : false;    

                        var arrayMarcador = listMarcadores ? jmespath.search(listMarcadores, "[?name=='"+targetEl+"'] | [0]") : false;  
                        var valueMarcador = arrayMarcador !== null && arrayMarcador ? arrayMarcador.value : false;  
                        var elemIconTag = elemIcons.find('a[href*="acao=andamento_marcador_gerenciar"]');
                        var elemIconTagTable = tableProc.find('tr[id="P'+id_protocolo+'"]').find('td').eq(1).find('a[href*="acao=andamento_marcador_gerenciar"]');
                        var valueText = elemIconTag.attr('onmouseover');
                            valueText = (typeof valueText !== 'undefined') ? extractTooltipToArray(valueText) : false;
                            valueText = valueText ? valueText[0] : false;
                            valueText = typeof valueText !== 'undefined' && valueText ? valueText : '';

                            if (valueMarcador || targetEl == 'SemGrupo') {
                                var valuesIframe = [
                                    {element: 'txaTexto', value: valueText},
                                    {element: 'hdnIdMarcador', value: (targetEl == 'SemGrupo') ? '' : valueMarcador}
                                ];

                                updateDadosArvoreMult('Gerenciar Marcador', valuesIframe, id_protocolo, function(){ 
                                    var arrayListMarcadores = sessionStorageRestorePro('dadosMarcadoresProcessoPro');
                                    var styleMarcador = arrayListMarcadores && valueMarcador ? jmespath.search(arrayListMarcadores, "[?icon=='"+arrayMarcador.img+"'] | [0].style") : null;
                                        styleMarcador = styleMarcador !== null ? styleMarcador : '';
                                    if (targetEl != 'SemGrupo' && sourceEl != 'SemGrupo') {
                                        elemIconTag.attr('style', styleMarcador).attr('onmouseover', 'return infraTooltipMostrar(\''+valueText+'\',\''+titleSource+'\');').find('img').attr('src', arrayMarcador.img);
                                        elemIconTagTable.attr('style', styleMarcador).attr('onmouseover', 'return infraTooltipMostrar(\''+valueText+'\',\''+titleSource+'\');').find('img').attr('src', arrayMarcador.img);
                                    } else if (targetEl != 'SemGrupo' && sourceEl == 'SemGrupo') {
                                        var targetMarcador = '<a href="#controlador.php?acao=andamento_marcador_gerenciar&acao_origem=procedimento_controlar&acao_retorno=procedimento_controlar&id_procedimento='+id_protocolo+'" onmouseover="return infraTooltipMostrar(\''+valueText+'\',\''+titleSource+'\');" onmouseout="return infraTooltipOcultar();" data-color="true" style="'+styleMarcador+'"><img src="'+arrayMarcador.img+'" class="imagemStatus"></a>';
                                            elemIcons.append(targetMarcador);
                                            tableProc.find('tr[id="P'+id_protocolo+'"]').find('td').eq(1).append(targetMarcador);
                                    } else if (targetEl == 'SemGrupo') {
                                        elemIconTag.remove();
                                        elemIconTagTable.remove();
                                    }
                                    elemProc.find('i.fa-sync').remove();
                                    elemProc.prepend('<i class="fas fa-check-double verdeColor" style="margin-right: 5px;"></i>');
                                    setTimeout(function(){ elemProc.find('i.fa-check-double').remove(); }, 2000);
                                    getAllMarcadoresHome();
                                });
                            }

                    } else if (type == 'types' && sourceEl != targetEl && targetEl != 'SemGrupo') {
                        elemProc.prepend('<i class="fas fa-sync fa-spin cinzaColor" style="margin-right: 5px;"></i>');
                        initListTypesSEI(function (){
                            var idTypeProc = (typeof arrayListTypesSEI.selectTipoProc !== 'undefined') ? jmespath.search(arrayListTypesSEI.selectTipoProc,"[?name=='"+titleSource+"'] | [0].value") : null;
                                idTypeProc = idTypeProc !== null ? idTypeProc : false;
                                if (idTypeProc) {
                                    updateDadosArvore('Consultar/Alterar Processo', 'selTipoProcedimento', idTypeProc, id_protocolo, function(){ 
                                        elemTypes.text(titleSource);
                                        elemProc.find('i.fa-sync').remove();
                                        elemProc.prepend('<i class="fas fa-check-double verdeColor" style="margin-right: 5px;"></i>');
                                        setTimeout(function(){ elemProc.find('i.fa-check-double').remove(); }, 2000);
                                    });
                                } else {
                                    elemProc.find('i.fa-sync').remove();
                                    elemProc.prepend('<i class="fas fa-times vemelhoColor" style="margin-right: 5px;"></i>');
                                    setTimeout(function(){ elemProc.find('i.fa-times').remove(); }, 2000);
                                }
                        });
                    } else if (sourceEl != targetEl) {
                        cancelMoveKanbanItensProc();
                    }
                    kanbanProcessosMoving = false;
                },
                dragendBoard: function(el){
                    updateOrderKanbanBoardProc();
                },
                boards: bords_list
            });
            /*
            autoScroll([
                    document.querySelector('.kanban-container')
                ],{
                    margin: 20,
                    maxSpeed: 5,
                    scrollWhenOutside: true,
                    autoScroll: function(){
                        //Only scroll when the pointer is down, and there is a child being dragged.
                        console.log('***', this.down, kanban.drake.dragging);
                        return this.down && kanban.drake.dragging;
                    }
                }
            );
            */

            kanbanProcessos = kanban;
            tableProc.hide();
            updateCountKanbanBoardProc();
        }
    }
}
function cancelMoveKanbanItensProc() {
    var itemMove = kanbanProcessosMoving;
    if (itemMove && $('#processosKanban').is(':visible')) {
        var item = jmespath.search(kanbanProcessos.options.boards,"[?id=='"+itemMove.source+"'] | [0].item | [?id=='"+itemMove.id+"'] | [0]");
            item = item == null ? false : item;
            kanbanProcessos.removeElement(item.id);
            kanbanProcessos.addElement(itemMove.source, item, itemMove.order);
    }
}
function pinKanbanItensProc(this_, id_protocolo) {
    var _this = $(this_);
    var _parent = _this.closest('.kanban-board');
    var _hasActive = _this.hasClass('newLink_active');
    var source = _parent.data('id');
    var order = (_hasActive) ? -1 : 0;
    var item = jmespath.search(kanbanProcessos.options.boards,"[?id=='"+source+"'] | [0].item | [?id=='"+id_protocolo+"'] | [0]");
        item = item == null ? false : item;
    if (item) {
        kanbanProcessos.removeElement(item.id);
        kanbanProcessos.addElement(source, item, order);
        
        if (!_hasActive) {
            $('#processosKanban .kanban-container').animate({scrollTop: 0}, 500, function() {
                $('#processosKanban .kanban-item[data-eid="'+id_protocolo+'"] .kanban-pinboard a').addClass('newLink_active').attr('onmouseover', 'return infraTooltipMostrar(\'Remover do topo\')');
                updateOrderKanbanBoardProc();
            });
        } else {
            $('#processosKanban .kanban-item[data-eid="'+id_protocolo+'"] .kanban-pinboard a').removeClass('newLink_active').attr('onmouseover', 'return infraTooltipMostrar(\'Fixar no topo\')');
            updateOrderKanbanBoardProc();
        }
        infraTooltipOcultar();
    }
}
function updateOrderKanbanBoardProc() {
    var type = storeGroupTablePro();
    var arrayOrder = $('#processosKanban .kanban-board').map(function(){
                        var _this = $(this);
                        var itens = _this.find('.kanban-item').map(function(i){ return {id: String($(this).data('eid')), order: i, pinboard: $(this).find('.kanban-pinboard a').hasClass('newLink_active') }  }).get();
                        var boards = {id: _this.data('id'), order: _this.data('order'), collapse: _this.data('collapse'), itens: itens};
                        return boards;
                    }).get();
    setOptionsPro('panelProcessosOrder_'+type, arrayOrder);
    // console.log('panelProcessosOrder_'+type, arrayOrder);
}
function collapseKanbanBoardProc(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.kanban-board');
    var _data = _parent.data();
        _parent.attr('data-collapse', _data.collapse ? false : true).data('collapse', _data.collapse ? false : true);
        _parent.find('.kanban-collapse i').attr('class', _data.collapse ? 'fas fa-plus-square azulColor' : 'fas fa-minus-square cinzaColor');
        updateOrderKanbanBoardProc();
}
function updateCountKanbanBoardProc() {
    $.each(kanbanProcessos.options.boards, function(i, v){
        var elemBoard = $('#processosKanban .kanban-board[data-id="'+v.id+'"]');
        var countBoard = elemBoard.find('.kanban-item:visible').length;
        var iconCollapse = elemBoard.find('.kanban-collapse').length ? false : '<div class="kanban-collapse" onclick="collapseKanbanBoardProc(this)"><i class="fas fa-'+(v.collapse ? 'plus': 'minus')+'-square '+(v.collapse ? 'azulColor': 'cinzaColor')+'"></i></div>';
            elemBoard.attr('data-collapse',v.collapse).find('.kanban-title-board').attr('data-count',countBoard).after(iconCollapse);
    });
}
function addAcompanhamentoEspIcon() {
    var storeRecebimento = (typeof localStorageRestorePro !== 'undefined' &&  typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
    var array_procedimentos = [];
    $('.acompanhamentoesp_icon').remove();
    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('a.processoVisualizado').each(function(i) {
      var acompanhamentoesp = getArrayProcessoRecebido($(this).attr('href')).acompanhamentoesp;
            acompanhamentoesp = (typeof acompanhamentoesp !== 'undefined' && acompanhamentoesp !== null && acompanhamentoesp != '') ? acompanhamentoesp : false;
        if (acompanhamentoesp) {
            $(this).closest('tr').find('td').eq(1).append('<a class="acompanhamentoesp_icon" onmouseover="return infraTooltipMostrar(\'Acompanhamento Especial\',\''+acompanhamentoesp+'\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-eye azulColor"><i></a>');
        }
    });
}
function addControlePrazo(this_ = false) {
    var dateRef = moment().format('YYYY-MM-DD');
    var timeRef = '23:59';
    var dueSetDate = true;
    var tagName = false;
    var textTag = '';
    var textControle = 'Adicionar';
    var form = $('#frmProcedimentoControlar');
    var href = isNewSEI
            ? $(divComandos+' a[onclick*="andamento_marcador_cadastrar"]').attr('onclick') 
            : $(divComandos+' a[onclick*="andamento_marcador_gerenciar"]').attr('onclick');
        href = (typeof href !== 'undefined') ? href.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, 'g')) : false;
        href = (href && href !== null && href.length > 0 && href[0] != '') ? href[0] : false;
    if (this_) {
        var _this = $(this_);
        if (_this.closest('.kanban-item').length) {
            var id = _this.closest('.kanban-item').attr('data-eid');
            $('#P'+id+' td.prazoBoxDisplay [onclick="addControlePrazo(this)"]').trigger('click');
            // console.log(id);
            return false;
        }
        var _data = _this.data();
        var _parent = _this.closest('tr');
            _parent = (typeof _parent === 'undefined') ? _this.closest('.kanban-item') : _parent;
        var _processo = _parent.find('a[href*="procedimento_trabalhar"]');
        var _tag = _parent.find('a[href*="andamento_marcador_gerenciar"]').attr('onmouseover');
        var tag = (typeof _tag !== 'undefined') ? _tag.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, 'g')) : false;
            tagName = (tag && tag !== null && tag.length > 0 && tag[2] != '') ? tag[2] : false;
            textTag = (tag && tag !== null && tag.length > 0 && tag[0] != '') ? tag[0] : false;

        var processo = _processo.text().trim();
        var linkParams = getParamsUrlPro(_processo.attr('href'));
        var id_procedimento = (linkParams && typeof linkParams.id_procedimento !== 'undefined') ? linkParams.id_procedimento : false;
            dateRef = (typeof _data.timeSorter !== 'undefined') ? moment(_data.timeSorter, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD') : dateRef;
            timeRef = (typeof _data.timeSorter !== 'undefined') ? moment(_data.timeSorter, 'YYYY-MM-DD HH:mm').format('HH:mm') : timeRef;
            textControle = (typeof _data.timeSorter !== 'undefined') ? 'Alterar' : textControle;
            dueSetDate = (typeof _data.duesetdate !== 'undefined') ? _data.duesetdate : dueSetDate;

            _this.closest('table').find('thead th a[onclick*="setSelectAllTr"]').data('index',1).trigger('click');
            _parent.find('input[type="checkbox"]').trigger('click');
            textTag = (typeof _data.timeSorter !== 'undefined') ? textTag.replace(moment(_data.timeSorter, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm'), '').replace('Ate ', '').trim() : textTag;
            textTag = (typeof textTag !== 'undefined' && textTag !== null && textTag != '') ? textTag.replace(/\\n/g, "") : '';
    }
    var tblProcessos = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    
    var htmlBox =   '<div class="dialogBoxDiv">'+
                    '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                    '      <tr style="height: 40px;">'+
                    '          <td style="vertical-align: bottom;">'+
                    '               <i class="iconPopup iconSwitch fas fa-calendar-alt '+(dueSetDate ? 'azulColor' : 'cinzaColor')+'"></i> '+
                    '               Controlar vencimento?'+
                    '          </td>'+
                    '          <td>'+
                    '              <div class="onoffswitch" style="float: right;">'+
                    '                  <input type="checkbox" onchange="configDatesSwitchChangeHome(this)" name="onoffswitch" class="onoffswitch-checkbox" id="configDatesBox_duesetdate" data-type="duesetdate" tabindex="0" '+(dueSetDate ? 'checked' : '')+'>'+
                    '                  <label class="onoff-switch-label" for="configDatesBox_duesetdate"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px;" class="configDates_duesetdate">'+
                    '          <td class="label" style="vertical-align: bottom;">'+
                    '               <i class="iconPopup '+(dueSetDate ? 'fas fa-clock' : 'far fa-clock')+' azulColor"></i> <span>'+(dueSetDate ? 'Data de vencimento' : 'Data inicial')+'</span>'+
                    '          </td>'+
                    '          <td class="input" style="position:relative">'+
                    '               <span class="newLink_active" style="margin: 0px;padding: 5px 8px;border-radius: 5px;position: absolute;top: 10px;'+(dueSetDate ? 'display:block;' : 'display:none;')+'">At\u00E9</span>'+
                    '               <input type="date" onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" id="configDatesBox_date" value="'+dateRef+'" style="width:130px; margin-left: 50px !important;">'+
                    '               <input type="time" onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" id="configDatesBox_time" value="'+timeRef+'" style="width:80px; float: right;">'+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td class="label" style="vertical-align: bottom;">'+
                    '               <i class="iconPopup fas fa-tags azulColor"></i> <span>Marcador</span>'+
                    '          </td>'+
                    '          <td>'+
                    '               <select id="configDatesBox_tag" style="width:310px; float: right;">'+
                    '               </select>'+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td class="label" style="vertical-align: bottom;">'+
                    '               <i class="iconPopup fas fa-comment-alt azulColor"></i> <span>Texto</span>'+
                    '          </td>'+
                    '          <td>'+
                    '               <input type="text" id="configDatesBox_text" style="width:290px; float: right;" value="'+textTag+'">'+
                    '           </td>'+
                    '      </tr>'+
                    '   </table>'+
                    '</div>';

    var btnDialogBoxPro =   [{
            text: (this_) ? 'Remover Prazo' : 'Remover Prazos',
            icon: 'ui-icon-closethick',
            click: function(event) { 
                setPrazoMarcador('remove', this_, form, href);
            }
        },{
            text: textControle+' Prazo',
            class: 'confirm',
            icon: 'ui-icon-tag',
            click: function() { 
                setPrazoMarcador('add', this_, form, href);
            }
        }];

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+htmlBox+'</div>')
        .dialog({
            title: (this_) ? textControle+' controle de prazo ('+processo+')' : 'Controle de prazo em processos ('+tblProcessos.find('input[type="checkbox"]:checked').length+')',
            width: 550,
            open: function() {
                var listaMarcadores = getOptionsPro('listaMarcadores');
                var listaMarcadores_unidade = getOptionsPro('listaMarcadores_unidade');
                if (listaMarcadores && listaMarcadores_unidade == idUnidade) {
                    var htmlOptions = $.map(listaMarcadores, function(v){
                                        var selected = (tagName && tagName == v.name) ? 'selected' : '';
                                        return '<option data-img-src="'+v.img+'" value="'+v.value+'" '+selected+'>'+v.name+'</option>';
                                    }).join('');
                    $('#configDatesBox_tag').html(htmlOptions).chosenImage();
                } else {
                    var param = {};
                        form.find("input[type=hidden]").map(function () {
                            if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                                param[$(this).attr('name')] = $(this).val(); 
                            }
                        });
                    $.ajax({ 
                        method: 'POST',
                        data: param,
                        url: href
                    }).done(function (html) {
                        var $html = $(html);
                            listaMarcadores = getListaMarcadores($html).array;
                        var htmlOptions = $.map(listaMarcadores, function(v){
                                            var selected = (tagName && tagName == v.name) ? 'selected' : '';
                                            return '<option data-img-src="'+v.img+'" value="'+v.value+'" '+selected+'>'+v.name+'</option>';
                                        }).join('');
                        $('#configDatesBox_tag').html(htmlOptions).chosenImage();
                    });
                }
            },
            close: function() {
                if (this_) _this.closest('table').find('thead th a[onclick*="setSelectAllTr"]').data('index',1).trigger('click');
            },
            buttons: btnDialogBoxPro
    });
}
function setPrazoMarcador(mode, this_, form, href, param = false, callback = false) {

    var _this = (this_) ? $(this_) : false;
    var tblProcessos = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    var _dateRef = (!param) ? $('#configDatesBox_date').val() : param.date;
    var _timeRef = (!param) ? $('#configDatesBox_time').val() : param.time;
    var _tagSelected = (!param) ? $('#configDatesBox_tag').val() : param.tag;
    var _textTag = (!param) ? $('#configDatesBox_text').val() : param.text;
        _textTag = (_textTag != '') ? '\n'+_textTag : '';
    if (mode == 'add' && _dateRef == '') {
        alertaBoxPro('Error', 'exclamation-triangle', 'Selecione uma data!');
    } else {
        var param = {};
            form.find("input[type=hidden]").map(function () {
                if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                    param[$(this).attr('name')] = $(this).val(); 
                }
            });
            _dateRef = _dateRef+' '+(_timeRef != '' ? _timeRef : '23:59');
        var _dateTo = ($('#configDatesBox_duesetdate').is(':checked')) ? _dateRef : false;
        
        if (href && href != '') {
            tblProcessos.find('tr.infraTrMarcada td.prazoBoxDisplay').html('<i class="fas fa-sync fa-spin '+(isNewSEI ? 'brancoColor' : 'azulColor')+'"></i>');
            $.ajax({ 
                method: 'POST',
                data: param,
                url: href
            }).done(function (html) {
                var $html = $(html);
                var xhr = new XMLHttpRequest();
                var formTag = isNewSEI ? $html.find('#frmAndamentoMarcadorCadastro') : $html.find('#frmGerenciarMarcador');
                var hrefTag = formTag.attr('action');
                var dateSubmit = (_dateTo) ? 'Ate '+moment(_dateTo, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm') : moment(_dateRef, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm');
                    dateSubmit = dateSubmit+_textTag;
                var optionsMarcadores = getListaMarcadores($html);
                var selectTags = optionsMarcadores.array;
                var indexSelected = optionsMarcadores.indexSelected;
                // var tagSelected = (typeof selectTags[indexSelected] !== 'undefined') ? selectTags[indexSelected].value : selectTags[0].value;

                var paramTag = {};
                    formTag.find("input[type=hidden], textarea, button").map(function () {
                        if ( $(this).attr('name')) {
                            paramTag[$(this).attr('name')] = $(this).val(); 
                        }
                    });
                    paramTag['txaTexto'] = (mode == 'remove') ? '' : dateSubmit;
                    paramTag['hdnIdMarcador'] = _tagSelected;

                    var postDataTag = '';
                    for (var k in paramTag) {
                        if (postDataTag !== '') postDataTag = postDataTag + '&';
                        var valor = (k!='txaTexto') ? paramTag[k] : escapeComponent(paramTag[k]);
                            postDataTag = postDataTag + k + '=' + valor;
                    }
                    // console.log(postDataTag);

                if (hrefTag && hrefTag != '') {
                    $.ajax({ 
                        method: 'POST',
                        // data: paramTag,
                        data: postDataTag,
                        contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1',
                        xhr: function() {
                            return xhr;
                        },
                        url: hrefTag
                    }).done(function (htmlResult) {
                        if (xhr.responseURL != hrefTag) {
                            var $htmlResult = $(htmlResult);
                            var ids = paramTag['hdnIdProtocolo'];
                                ids = (ids.indexOf(',') !== -1) ? ids.split(',') : [ids];
                            var tagResult = $htmlResult.find('a[href*="andamento_marcador_gerenciar"]').map(function(){ 
                                var tagResultLink = getParamsUrlPro($(this).attr('href'));
                                if (tagResultLink && typeof tagResultLink.id_procedimento !== 'undefined' && $.inArray(tagResultLink.id_procedimento, ids) !== -1) {
                                    return {id_procedimento: tagResultLink.id_procedimento, html: this.outerHTML};
                                }
                            }).get();
                            
                            if (tagResult.length > 0) {
                                $.each(tagResult, function(i, v){
                                    var _dateConfig = moment(_dateRef, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
                                    var tr = $('tr#P'+v.id_procedimento);
                                    var td = tr.find('td').eq(1);
                                    td.find('a[href*="andamento_marcador_gerenciar"]').remove();
                                    td.append(v.html);
                                    if (mode == 'add') {
                                        var config = {
                                                            date: _dateConfig, 
                                                            dateDue: (_dateTo) ? _dateConfig : undefined, 
                                                            countdays: true, 
                                                            workday: false, 
                                                            duesetdate: _dateTo,
                                                            displayformat: 'DD/MM/YYYY HH:mm',
                                                            action: 'addControlePrazo(this)'
                                                        };
                                        var htmlDatePreview = getDatesPreview(config);
                                            tr.find('td.prazoBoxDisplay').html(htmlDatePreview);
                                            if ($(htmlDatePreview).hasClass('tagTableText_date_atrasado')) {
                                                // tr.css('background-color','#fff1f0');
                                                tr.addClass('infraTrAtrasada');
                                            } else if (moment(_dateRef, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
                                                // tr.css('background-color','#fdf9df');
                                                tr.addClass('infraTrAlerta');
                                            } else {
                                                // tr.css('background-color','transparent');
                                                tr.removeClass('infraTrAlerta').removeClass('infraTrAtrasada');
                                            }
                                        if (param) tr.find(isNewSEI ? '.infraCheckboxInput:checked' : '.infraCheckbox:checked').trigger('click');
                                        if (typeof callback === 'function') {
                                            callback();
                                            // console.log('**** CALBACK');
                                        }
                                    } else {
                                        // tr.css('background-color','transparent');
                                        tr.removeClass('infraTrAlerta').removeClass('infraTrAtrasada');
                                        tr.find('td.prazoBoxDisplay').html('');
                                        setControlePrazo();
                                    }
                                });
                                if (this_) tblProcessos.find('thead th a[onclick*="setSelectAllTr"]').data('index',1).trigger('click');
                                setTimeout(function(){ 
                                    if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload tableHomeDestroy');
                                    tableHomeDestroy(true);
                                }, 500);
                            }
                        }
                    });
                }
            });
        }
        resetDialogBoxPro('dialogBoxPro');
    }
}
function getListaMarcadores(html) {
    var indexSelected = 0;
    var selectTags = html.find('#selMarcador').find('option').map(function(i, v){ 
                        if ($(this).is(':selected')) indexSelected = i-1;
                        if ($(this).text().trim() != '') { 
                            return {name: $(this).text().trim(), value: $(this).val(), img: $(this).attr('data-imagesrc') } 
                        } 
                    }).get();
        if (selectTags.length > 0) {
            setOptionsPro('listaMarcadores',selectTags);
            setOptionsPro('listaMarcadores_unidade',idUnidade);
        }
    return {array: selectTags, indexSelected: indexSelected};
}
function configDatesSwitchChangePrazo(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    if (_this.is(':checked')) {
        _parent.find('.configDates_setdate').show();
        _parent.find('.configDates_duesetdate').show();
        _this.closest('tr').find('.iconSwitch').addClass('azulColor');
    } else {
        _parent.find('.configDates_setdate').hide();
        _parent.find('.configDates_duesetdate').hide();
        _this.closest('tr').find('.iconSwitch').removeClass('azulColor');
    }
}
function configDatesSwitchChangeHome(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    if (_this.is(':checked')) {
        _parent.find('.configDates_duesetdate .label i').attr('class','iconPopup fas fa-clock azulColor');
        _parent.find('.configDates_duesetdate .label span').text('Data de vencimento');
        _parent.find('.configDates_duesetdate .input span').show();
        _this.closest('tr').find('.iconSwitch').addClass('azulColor');
    } else {
        _parent.find('.configDates_duesetdate .label i').attr('class','iconPopup far fa-clock azulColor');
        _parent.find('.configDates_duesetdate .label span').text('Data inicial');
        _parent.find('.configDates_duesetdate .input span').hide();
        _this.closest('tr').find('.iconSwitch').removeClass('azulColor');
    }
}
function getMapaControleProcesso() {
    return $('#tblProcessosRecebidos').find('tbody tr').not('.tableHeader').not('.infraCaption').map(function(){
        let _this = $(this);
        let _td = _this.find('td');
        let id_procedimento = _this.attr('id');
            id_procedimento = typeof id_procedimento !== 'undefined' ? parseInt(id_procedimento.replace('P','')) : false;
        let protocolo = _td.eq(2).text();
        let link_atribuicao = _td.eq(3).find('a[href*="controlador.php?acao=procedimento_atribuicao_listar"]');
        let nome_atribuicao = link_atribuicao.attr('title');
            nome_atribuicao = typeof nome_atribuicao !== 'undefined' ? nome_atribuicao.replace('Atribuído para ','') : false;
        let usuario_atribuicao = link_atribuicao.text().trim();
        let descricao = _td.eq(4).text();
        let tipo_processo = _td.eq(5).text();
        
        let _return = {
            id_procedimento: id_procedimento,
            protocolo: protocolo,
            atribuicao : nome_atribuicao ? {nome: nome_atribuicao, usuario: usuario_atribuicao} : false,
            descricao : descricao,
            tipo_processo: tipo_processo
           }
        return _return;
    }).get();
}
function updateCountIconDist() {
    var counter = $('#distribAutTablePro').find('input[type="checkbox"]:checked').length;
    if (counter > 0) {
        $('.iconConfig_distrib').find('.fa-layers-counter').text(counter).show();
    } else {
        $('.iconConfig_distrib').find('.fa-layers-counter').hide();
    }
}

/* txtPadrao_setConfig({
    nome: 'DISTRIBUICAO_AUTOMATICA_SEIPRO',
    descricao: `Configura\u00E7\u00F5es interna para distribui\u00E7\u00E3o autom\u00E1tica de processos (criado pelo SEI Pro)`,
    conteudo: `<p>[{"tipo_processo": "Material: Baixa de Material de Consumo", "atribuicao": "Pedro.Soares"},{"tipo_processo": "Gest\u00E3o e Controle: Execu\u00E7\u00E3o de Auditoria Interna", "atribuicao": "Pedro.Soares"}]</p>`
}); */

// var conteudoDist = await txtPadrao_getConfig('DISTRIBUICAO_AUTOMATICA_SEIPRO');
// console.log(conteudoDist);

var txtPadrao_newLink = async () => {
    var htmlTxtPadrao = await $.get(urlTxtPadrao);
    var urlNew = $(htmlTxtPadrao).find('#btnNovo').attr('onclick');
        urlNew = typeof urlNew !== 'undefined' && urlNew.indexOf("'") !== -1 ? urlNew.split("'")[1] : false;
    return urlNew;
}
var txtPadrao_getConfig = async (idTxt) => {
    var htmlTxtPadrao = await $.get(urlTxtPadrao);
    var urlView = $(htmlTxtPadrao).find('.infraAreaTabela tr').map(function(){ if ($(this).find('td').eq(2).text() == '[_'+idTxt+']') return $(this).find('a[href*="acao=texto_padrao_interno_consultar"]').attr('href') }).get();
        urlView = typeof urlView !== 'undefined' && urlView !== null && urlView.length ? urlView[0] : false;

    if (urlView) {
        var htmlTxtPadrao = await $.get(urlView);
        var conteudoTxtPadrao = $(htmlTxtPadrao).find('#txaConteudo').val();
            conteudoTxtPadrao = typeof conteudoTxtPadrao !== 'undefined' && conteudoTxtPadrao !== null && conteudoTxtPadrao.trim() != '' ? $(conteudoTxtPadrao).text() : false;
            conteudoTxtPadrao = conteudoTxtPadrao && isJson(conteudoTxtPadrao) ? JSON.parse(conteudoTxtPadrao) : false;
            conteudoTxtPadrao = conteudoTxtPadrao && $.isArray(conteudoTxtPadrao) ? conteudoTxtPadrao : false;
        return conteudoTxtPadrao;
    } else {
        return false;
    };
}
var txtPadrao_setConfig = async (data) => {
    var htmlTxtPadrao = await $.get(urlTxtPadrao);
    var urlEdit = $(htmlTxtPadrao).find('.infraAreaTabela tr').map(function(){ if ($(this).find('td').eq(2).text() == '[_'+data.nome+']') return $(this).find('a[href*="acao=texto_padrao_interno_alterar"]').attr('href') }).get();
        urlEdit = typeof urlEdit !== 'undefined' && urlEdit !== null && urlEdit.length ? urlEdit[0] : false;
    var urlPage = urlEdit ? urlEdit : await txtPadrao_newLink();
    var htmlLink = await $.get(urlPage);
    var form = $(htmlLink).find('#frmTextoPadraoInternoCadastro');
    var urlForm = form.attr('action');
    var createConfig = await txtPadrao_createConfig(form, urlForm, data);
    return createConfig;
}
var txtPadrao_createConfig = async (form, urlForm, data) => {
    let params = {};
        form.find("input[type=hidden]").each(function () {
            if ($(this).attr('name') && $(this).attr('id').includes('hdn')) {
                params[$(this).attr('name')] = $(this).val();
            }
        });
        form.find('input[type=text]').each(function () {
            if ($(this).attr('id') && $(this).attr('id').includes('txt')) {
                params[$(this).attr('id')] = $(this).val();
            }
        });
        params.txtNome = '[_'+data.nome+']';
        params.txtDescricao = data.descricao;
        params.txaConteudo = '<p>'+JSON.stringify(data.conteudo)+'</p>';
        params.sbmCadastrarTextoPadraoInterno = 'Salvar';
        params.sbmAlterarTextoPadraoInterno = 'Salvar';
    
    var postData = '';
    for (var k in params) {
        if (postData !== '') postData = postData + '&';
        var valor = (k=='txtDescricao' || k=='txaConteudo') ? escapeComponent(params[k]) : params[k];
            postData = postData + k + '=' + valor;
    }
    
    var htmlTxtPadraoCreated = await $.ajax({
        method: 'POST',
        url: urlForm,
        data: postData,
        contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1'
    });
    return htmlTxtPadraoCreated;
}
var getTableDistribAutomatica = async () => {
    var dadosDistribuicao = await txtPadrao_getConfig('DISTRIBUICAO_AUTOMATICA_SEIPRO');
        window.dadosDistribuicaoAut = dadosDistribuicao;
    var htmlBox =       '<div id="boxDistribAut" class="tabelaPanelScroll" style="margin-top: 10px;height: 400px;">'+
                        '               <a class="newLink iconConfig_distrib" onclick="getAtribuicaoAutomatica(this)" onmouseover="return infraTooltipMostrar(\'Atribuir processos\');" onmouseout="return infraTooltipOcultar();" style="margin: 0px; font-size: 14pt;">'+
                        '                   <span class="fa-layers fa-fw">'+
                        '                       <i class="fas fa-user-friends"></i>'+
                        '                       <span class="fa-layers-counter" style="display:none"></span>'+
                        '                   </span>'+
                        '                   <span style="font-size: 80%;">Atribuir Processos</span>'+
                        '               </a>'+
                        '               <a class="newLink iconConfig_distrib" onclick="setAtribuicaoAutomatica(this)" onmouseover="return infraTooltipMostrar(\'Configura\u00E7\u00F5es de atribui\u00E7\u00E3o\');" onmouseout="return infraTooltipOcultar();" style="margin: 0px;font-size: 14pt;right: 280px;position: absolute;">'+
                        '                   <i class="fas fa-cog"></i>'+
                        '               </a>'+
                        '   <table id="distribAutTablePro" style="margin-top: 5px; font-size: 9pt !important;width: 100%;" class="seiProForm tableAtividades tableDialog tableInfo tableZebra">'+
                        '        <thead>'+
                        '            <tr class="tableHeader">'+
                        '                <th class="tituloControle " width="5%" align="center">'+
                        '                   <label class="lblInfraCheck" for="lnkInfraCheck" accesskey=";"></label>'+
                        '                   <a id="lnkInfraCheck" onclick="getSelectAllTr(this, \'SemGrupo\');" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar(\'Selecionar Todos\')" onmouseout="return infraTooltipOcultar();">'+
                        '                       <img src="/infra_css/imagens/check.gif" id="imgRecebidosCheck" class="infraImg">'+
                        '                   </a>'+
                        '                </th>'+
                        '                <th class="tituloControle" style="text-align: center; width: 180px;">Processo</th>'+
                        '                <th class="tituloControle" style="text-align: center;font-weight: bold;">Descri\u00E7\u00E3o</th>'+
                        '                <th class="tituloControle" style="text-align: center;font-weight: bold;">Tipo</th>'+
                        '                <th class="tituloControle" style="text-align: center;font-weight: bold;">Atualmente atribu\u00EDdo</th>'+
                        '                <th class="tituloControle" style="text-align: center;font-weight: bold;">Nova atribui\u00E7\u00E3o</th>'+
                        '            </tr>'+
                        '        </thead>'+
                        '        <tbody>';
        $.each(getMapaControleProcesso(),function(i, v){
            let distribuicao = dadosDistribuicaoAut ? dadosDistribuicaoAut.filter(function(p){ return p.tipo_processo == v.tipo_processo }) : [];
            let nova_atribuicao = distribuicao.length ? distribuicao[0] : false;
            let atribuicao = v.atribuicao ? v.atribuicao.usuario : '';
            htmlBox +=  '   <tr style="text-align: left;" data-tagname="SemGrupo">'+
                        '       <td class="tituloControle" style="text-align:center;">'+
                        '           <input type="checkbox" onclick="updateCountIconDist()" id="chkDistrib_'+v.id_procedimento+'" '+(nova_atribuicao && nova_atribuicao.atribuicao != atribuicao ? 'checked' : '')+' '+(!nova_atribuicao ? 'disabled' : '')+' name="chkDistrib_'+v.id_procedimento+'" value="'+v.id_procedimento+'">'+
                        '       </td>'+
                        '       <td>'+
                        '           <a style="margin-left: 5px;" href="'+url_host+'?acao=procedimento_trabalhar&id_procedimento='+v.id_procedimento+'" target="_blank">'+
                        '               <span class="bLink">'+
                        '                   '+v.protocolo+
                        '                   <i class="fas fa-external-link-alt bLink" style="font-size: 90%; text-decoration: underline;"></i>'+
                        '               </span>'+
                        '           </a>'+
                        '       </td>'+
                        '       <td>'+v.tipo_processo+'</div>'+
                        '       <td>'+v.descricao+'</div>'+
                        '       <td>'+atribuicao+'</td>'+
                        '       <td>'+(nova_atribuicao ? nova_atribuicao.atribuicao : '')+'</td>'+
                        '   </tr>';
        });
        htmlBox +=      '   </table>'+
                        '</div>';
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'Distribui\u00E7\u00E3o Autom\u00E1tica de Processos',
            width: $('body').width()-300,
            height: 450,
            open: function() { 
                setTimeout(function(){ 
                    var distribTable = $('#distribAutTablePro');
                        distribTable.tablesorter({
                            sortLocaleCompare : true,
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
                                4: { filter: true },
                                5: { filter: true }
                            }
                        }).on("filterEnd", function (event, data) {
                            checkboxRangerSelectShift();
                            var caption = $(this).find("caption").eq(0);
                            var tx = caption.text();
                                caption.text(tx.replace(/\d+/g, data.filteredRows));
                                $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                                $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
                        });
                        initPanelResize('#boxDistribAut', 'distribPro');

                    var filterDistrib = distribTable.find('.tablesorter-filter-row').get(0);
                    if (typeof filterDistrib !== 'undefined') {
                        var observerFilterDistrib = new MutationObserver(function(mutations) {
                            var _this = $(mutations[0].target);
                            var _parent = _this.closest('table');
                            var iconFilter = _parent.find('.filterTableDistrib button');
                            var checkIconFilter = iconFilter.hasClass('active');
                            var hideme = _this.hasClass('hideme');
                            if (hideme && checkIconFilter) {
                                iconFilter.removeClass('active');
                            }
                            updateCountIconDist();
                        });
                        setTimeout(function(){ 
                            var htmlfilterDistrib =    '<div class="btn-group filterTableDistrib" role="group" style="right: 45px;top: 18px;z-index: 999;position: absolute;">'+
                                                        '   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">'+
                                                        '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                                        '       <span class="text">Baixar</span>'+
                                                        '   </button>'+
                                                        '   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                                                        '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                                        '       <span class="text">Copiar</span>'+
                                                        '   </button>'+
                                                        '   <button type="button" onclick="filterTablePro(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light '+(distribTable.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active')+'">'+
                                                        '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>'+
                                                        '       Pesquisar'+
                                                        '   </button>'+
                                                        '</div>';
                                distribTable.find('thead .filterTableDistrib').remove();
                                distribTable.find('thead').prepend(htmlfilterDistrib);
                                observerFilterDistrib.observe(filterDistrib, {
                                    attributes: true
                                });
                                distribTable.find('.tablesorter-filter-row input.tablesorter-filter').eq(2).attr('type','date');
                                updateCountIconDist(filterDistrib);
                        }, 500);
                    }
                }, 500);
                if (typeof $().visible == 'undefined') $.getScript(URL_SPRO+"js/lib/jquery-visible.min.js");
            },
            close: function() { 
                $('#boxDistribAut').remove();
                resetDialogBoxPro('dialogBoxPro');
            }
    });

}
function setAtribuicaoAutomatica() {

    var htmlBox =       '<div id="boxDistribAut" class="tabelaPanelScroll" style="margin-top: 10px;height: 400px;">'+
                        '</div>';
                        
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'Distribui\u00E7\u00E3o Autom\u00E1tica de Processos',
            width: $('body').width()-300,
            height: 450,
            open: function() { 
            },
            close: function() { 
                $('#boxDistribAut').remove();
                resetDialogBoxPro('dialogBoxPro');
            }
    });
}
function setControlePrazo(force = false) {
    var tblProcessos = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    if (
        tblProcessos.find('tbody tr').not('.tableHeader').find('td.prazoBoxDisplay').length == 0 ||
        tblProcessos.find('thead tr').find('th.prazoBoxDisplay').length < 2 ||
        force == true
        ) {
            tblProcessos.find('.prazoBoxDisplay').remove();
            tblProcessos.find('tbody tr').not('.tableHeader').append('<td class="prazoBoxDisplay" style="text-align: center;"></td>');

        if ( tblProcessos.find('thead').length > 0 ) {
            tblProcessos.find('thead tr').append('<th class="tituloControle tablesorter-header prazoBoxDisplay '+(isNewSEI ? 'infraTh' : '')+'" style="width: 140px;min-width: 140px;"> Prazos</th>');
        } else {
            $('#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first').find('.prazoBoxDisplay').remove();
            $('#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first').not('.tableHeader').append('<th class="tituloControle tablesorter-header prazoBoxDisplay '+(isNewSEI ? 'infraTh' : '')+'" style="width: 140px;min-width: 140px;"> Prazos</th>');
        }
    }
    tblProcessos.find('tbody tr').each(function(){
        var _tag = $(this).find('a[href*="andamento_marcador_gerenciar"]').attr('onmouseover');
        var _checkbox = $(this).find('input[type="checkbox"]');
        var _processo = $(this).find('a[href*="procedimento_trabalhar"]');
        var content = (typeof _tag !== 'undefined') ? _tag.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, 'g')) : false;
            content = (content && content !== null && content.length > 0 && content[0] != '') ? content[0] : false;
        var dateTo = (content && removeAcentos(content).toLowerCase().indexOf('ate') !== -1) ? true : false;

        var dateContent = (content) ? content.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img) : null;
        var timeContent = (content) ? content.match(/(\d{1,2}:\d{2})/img) : null;
        var dateTag = (dateContent !== null) ? dateContent[0]+' '+(timeContent !== null ? timeContent[0] : '23:59') : false;
            dateTag = (dateTag) ? moment(dateTag,'DD/MM/YYYY HH:mm') : false;

        // var dateTag = (content && content.indexOf(' ') !== -1) ? content.split(' ')[1] : (content) ? content : false;
            // dateTag = (dateTag && dateTag != '') ? moment(dateTag,'DD/MM/YYYY') : false;
        var linkParams = getParamsUrlPro(_processo.attr('href'));
        var id_procedimento = (linkParams && typeof linkParams.id_procedimento !== 'undefined') ? linkParams.id_procedimento : false;
        var processo = _processo.text();
        if (dateTag && dateTag.isValid()) {
            var config = {
                                date: dateTag.format('YYYY-MM-DD HH:mm:ss'), 
                                dateDue: (dateTo) ? dateTag.format('YYYY-MM-DD HH:mm:ss') : undefined, 
                                dateMaxProgress: 30,
                                countdays: true, 
                                workday: false, 
                                duesetdate: dateTo,
                                displayformat: 'DD/MM/YYYY HH:mm',
                                action: 'addControlePrazo(this)'
                            };
            var htmlDatePreview = getDatesPreview(config);
            $(this).find('td.prazoBoxDisplay').html(htmlDatePreview);
            if ($(htmlDatePreview).hasClass('tagTableText_date_atrasado')) {
                // $(this).css('background-color','#fff1f0');
                $(this).addClass('infraTrAtrasada');
            } else if (dateTag.format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
                // $(this).css('background-color','#fdf9df');
                $(this).addClass('infraTrAlerta');
            }
        } else if (!_checkbox.is(':disabled')) {
            var htmlDateAdd =   '<a class="addControlePrazo" onclick="addControlePrazo(this)">'+
                                '   <i class="fas fa-clock azulColor"></i>'+
                                '   <span style="font-size: 9pt;color: #666;font-style: italic;">Adicionar prazo</span>'+
                                '</a>';
            $(this).find('td.prazoBoxDisplay').html(htmlDateAdd);
        }
    });
}
function initControlePrazo(force = false, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined' && typeof moment == 'function') { 
        if (checkConfigValue('gerenciarprazos')) {
            setControlePrazo(force);
        }
    } else {
        setTimeout(function(){ 
            initControlePrazo(force, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initControlePrazo'); 
        }, 500);
    }
}
function getAllMarcadoresHome() {
    var arrayMarcadores = [];
    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('tr').each(function(){
        var _processo = $(this).find('a[href*="acao=procedimento_trabalhar"]');
        var _marcador = $(this).find('a[href*="acao=andamento_marcador_gerenciar"]');

        if (_processo.length > 0 && _marcador.length > 0) {

            var _tags = (typeof _marcador.attr('onmouseover') !== 'undefined') ? _marcador.attr('onmouseover').match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, 'g')) : false;
            var tagName = (_tags && _tags !== null && _tags.length > 0 && _tags[2] != '') ? _tags[2] : false;
            var textName = (_tags && _tags !== null && _tags.length > 0 && _tags[0] != '') ? _tags[0] : false;

            arrayMarcadores.push({
                id_procedimento: getParamsUrlPro(_processo.attr('href')).id_procedimento,
                icon: _marcador.find('img').attr('src'),
                style: _marcador.attr('style'),
                tag: tagName,
                name: textName
            });
        }
    });
    sessionStorageStorePro('dadosMarcadoresProcessoPro', arrayMarcadores);
}
function initAllMarcadoresHome(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof getParamsUrlPro !== 'undefined') { 
        getAllMarcadoresHome();
    } else {
        setTimeout(function(){ 
            initAllMarcadoresHome(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initAllMarcadoresHome'); 
        }, 500);
    }
}
function initNaoVisualizadoPro() {
    $('.processoNaoVisualizado').each(function(){
        var tooltip = $(this).attr('onmouseover');
            tooltip = typeof tooltip !== 'undefined' ? tooltip.replace("return infraTooltipMostrar('","return infraTooltipMostrar('(N\u00E3o Visualizado) ") : false;
        if (tooltip) $(this).attr('onmouseover',tooltip);
    });
}
function initUrgentePro() {
    $('a div.urgentePro').remove();
    $('a[href*="controlador.php?acao=procedimento_trabalhar"][onmouseover*="(URGENTE)"]')
        .prepend('<div class="urgentePro"></div>')
        .addClass('urgentePro')
        .closest('tr')
        .addClass('urgentePro');
}

function initUploadFilesInProcess() {
    if (typeof Dropzone === 'function') {
        setUploadFilesInProcess();
    } else {
        $.getScript(URL_SPRO+"js/lib/dropzone.min.js",function(){ setUploadFilesInProcess() });
    }
}
function getListIdProtocoloSelected() {
    var listId = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find(elemCheckbox+':checked').map(function(){ return $(this).val() }).get();
    return (listId.length > 0) ? listId : false;
}
function setUploadFilesInProcess(load_upload = true) {
    var listId = getListIdProtocoloSelected();
    if (listId.length > 0) {
        $('#frmCheckerProcessoPro').remove();
        loadIframeProcessUpload(listId[0], load_upload);
    }
}
function loadIframeProcessUpload(idProcedimento, load_upload = true) {
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    
    var url = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+idProcedimento;
    $(divComandos+' .iconUpload_new').addClass('iconLoading');
    
    $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
        var ifrArvore = $('#frmCheckerProcessoPro').contents().find('#ifrArvore');
            contentW = ifrArvore[0].contentWindow;
            $(divComandos+' .iconUpload_new').removeClass('iconLoading');
            if (load_upload) {
                getUploadFilesInProcess();
            } else {
                contentW.sendUploadArvore('upload', false, arvoreDropzone, $(containerUpload));
            }
    });
}
function completeIdProtocoloSelected() {
    var listId = getListIdProtocoloSelected();
        $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('tr#P'+listId[0]).find(elemCheckbox+':checked').trigger('click');
}
function nextUploadFilesInProcess() {
    completeIdProtocoloSelected();

    if (getListIdProtocoloSelected()) {
        cleanUploadFilesInProcess();
        setUploadFilesInProcess(false);
    } else {
        removeUploadFilesInProcess();
        alertaBoxPro('Sucess', 'check-circle', 'Arquivos enviados com sucesso!');
    }
}
function removeUploadFilesInProcess() {
    $('#uploadListPro').remove();
    $('.dz-infoupload-home').remove();
    $(containerUpload).data('index',0);
    if (typeof arvoreDropzone !== 'undefined' && typeof arvoreDropzone.destroy === 'function') arvoreDropzone.destroy();
    $(containerUpload).unbind('click');
}
function onClickRemoveDragHoverHome() {
    $(containerUpload).on('click', function(){
        if ($(this).hasClass('dz-drag-hover')) {
            $(this).removeClass('dz-drag-hover');
            $(containerUpload).unbind('click');
        }
    })
}
function cleanUploadFilesInProcess() {
    $('#uploadListPro').html('');
    $(containerUpload).data('index',0);
    if (typeof arvoreDropzone.files !== 'undefined' && arvoreDropzone.files.length) {
        $.each(arvoreDropzone.files, function(i, v){
            arvoreDropzone.addFile(v);
        });
    }
}
function getUploadFilesInProcess() {
    var _containerUpload = $(containerUpload);
    var html =  '<div id="uploadListPro"></div>'+
                '<div id="dz-infoupload" class="dz-infoupload dz-infoupload-home">'+
                '   <span class="text">Arraste e solte aquivos aqui<br>ou clique para selecionar</span>'+
                '   <span class="cancel" onclick="dropzoneCancelInfo(event); removeUploadFilesInProcess(); return false;">'+
                '       <i class="far fa-times-circle icon"></i>'+
                '       <span class="label">CANCELAR</span>'+
                '   </span>'+
                '</div>';

    if (_containerUpload.find('.dz-infoupload').length == 0) {
        _containerUpload.find(divComandos).after(html).data('index', 0);
    }

    arvoreDropzone = new Dropzone(containerUpload, {
        url: url_host,
        createImageThumbnails: false,
        autoProcessQueue: false,
        parallelUploads: 1,
        clickable: '#dz-infoupload',
        previewsContainer: '#uploadListPro',
        timeout: 900000,
        paramName: 'filArquivo',
        renameFile: function (file) {
            return parent.removeAcentos(file.name).replace(/[&\/\\#+()$~%'":*?<>{}]/g,'_');
        },
        previewTemplate:    '<div class="dz-preview dz-file-preview">'+
                            '   <div class="dz-details">'+
                            '       <span class="dz-error-mark"><i data-dz-remove class="fas fa-trash vermelhoColor" style="margin: 5px 8px;cursor: pointer; font-size: 10pt;"></i></span>'+
                            '       <span class="dz-error-message"><span data-dz-errormessage></span></span>'+
                            '       <span class="dz-progress">'+
                            '           <span class="dz-upload" data-dz-uploadprogress></span>'+
                            '       </span>'+
                            '       <a id="anchorImgID" data-img="'+(parent.isNewSEI ? 'svg/documento_pdf.svg' : 'imagens/pdf.gif')+'" style="margin-left: -4px;" class="clipboard" title="Clique para copiar o n\u00FAmero do protocolo para a \u00E1rea de transfer\u00EAncia">'+
                            '           <img class="dz-link-icon" src="/infra_css/'+(parent.isNewSEI ? 'svg/documento_pdf.svg' : 'imagens/pdf.gif')+'" align="absbottom" id="iconID">'+
                            '       </a>'+
                            '       <span class="dz-progress-mark"><i class="fas fa-cog fa-spin" style="color: #017FFF; font-size: 10pt;"></i></span>'+
                            '       <a id="anchorID" target="'+ifrVisualizacao_+'" class="dz-filename">'+
                            '           <span data-dz-name title="" id="spanID"></span>'+
                            '       </a>'+
                            '       <span class="dz-size" data-dz-size></span>'+
                            '       <span class="dz-remove" data-dz-remove><i class="fas fa-trash-alt vermelhoColor" style="cursor:pointer"></i></span>'+
                            '   </div>'+
                            '</div>',
        dictDefaultMessage: "Solte aqui os arquivos para enviar",
        dictFallbackMessage: "Seu navegador n\u00E3o suporta uploads de arrastar e soltar.",
        dictFallbackText: "Por favor, use o formul\u00E1rio abaixo para enviar seus arquivos como antigamente.",
        dictFileTooBig: "O arquivo \u00E9 muito grande ({{filesize}}MB). Tamanho m\u00E1ximo permitido: {{maxFilesize}}MB.",
        dictInvalidFileType: "Voc\u00EA n\u00E3o pode fazer upload de arquivos desse tipo.",
        dictResponseError: "O servidor respondeu com o c\u00F3digo {{statusCode}}.",
        dictCancelUpload: "Cancelar envio",
        dictCancelUploadConfirmation: "Tem certeza de que deseja cancelar este envio?",
        dictRemoveFile: "Remover arquivo",
        dictMaxFilesExceeded: "Voc\u00EA s\u00F3 pode fazer upload de {{maxFiles}} arquivos."          
    });

    arvoreDropzone.on("addedfiles", function(files) {
        dropzoneCancelInfo();
        // console.log(arvoreDropzone.files);
        if (verifyConfigValue('sortbeforeupload') && arvoreDropzone.getQueuedFiles().length > 1) {
            sortUploadArvore();
        } else {
            contentW.sendUploadArvore('upload', false, arvoreDropzone, _containerUpload);
        }
    }).on("addedfile", function(file) {
        // console.log('Files', file);
        //dropzoneNormalizeImg(file);
    }).on("removedfile", function(file) {
        //dropzoneNormalizeImg(file);
    }).on('success', function(result) {
        var params = arvoreDropzone.options.params;
        var response = result.xhr.response.split('#');
            params.paramsForm.hdnAnexos = encodeUrlUploadArvore(response, params);

        var postData = '';
        for (var k in params.paramsForm) {
            if (postData !== '') postData = postData + '&';
            var valor = (k=='hdnAnexos') ? params.paramsForm[k] : escapeComponent(params.paramsForm[k]);
                valor = (k=='txtNumero') ? parent.encodeURI_toHex(params.paramsForm[k].normalize('NFC')) : valor;                
                postData = postData + k + '=' + valor;
        }
        params.paramsForm = postData;
        contentW.sendUploadArvore('save', params, arvoreDropzone, _containerUpload);
    }).on('error', function(e) {
        contentW.sendUploadArvore('upload', false, arvoreDropzone, _containerUpload);
    }).on('dragleave', function(e) {
        _containerUpload.addClass('dz-drag-hover');
        onClickRemoveDragHoverHome();
    });

    var extUpload = localStorageRestorePro('arvoreDropzone_acceptedFiles');
    if (extUpload !== null) {
        arvoreDropzone.options.acceptedFiles = extUpload;
    }
}
function sendUploadArvoreHomeStart() {
    contentW.sendUploadArvore('upload', false, arvoreDropzone, $(containerUpload));
}
function sortUploadArvore() {
    var htmlUpload =    '<div id="divUploadDoc" class="panelDadosArvore" style="margin: 15px 0; padding: 1.2em 0 0 0 !important;">'+
                        '   <a style="cursor:pointer;" onclick="sendUploadArvoreHomeStart();" class="newLink newLink_confirm">'+
                        '       <i class="fas fa-upload azulColor"></i>'+
                        '       <span style="font-size:1.2em;color: #fff;"> Enviar documentos</span>'+
                        '   </a>'+
                        '</div>';

    $('#divUploadDoc').remove();
    $('#uploadListPro').sortable({
        items: '.dz-file-preview',
        cursor: 'grabbing',
        handle: '.dz-filename',
        forceHelperSize: true,
        opacity: 0.5,
        update: function(event, ui) {
            var files = arvoreDropzone.getQueuedFiles();
            files.sort(function(a, b){
                return ($(a.previewElement).index() > $(b.previewElement).index()) ? 1 : -1;
            })
            arvoreDropzone.removeAllFiles();
            arvoreDropzone.handleFiles(files);
        }
    }).after(htmlUpload);
}
function storeLinkUsuarioSistema() {
    if (typeof setOptionsPro !== 'undefined') setOptionsPro('usuarioSistema',$('#lnkUsuarioSistema').attr('title'));
}
function storeVersionSEI() {
    if (typeof getSeiVersionPro !== 'undefined' && getSeiVersionPro()) 
        getSeiVersionPro();
    else if (typeof setSeiVersionPro !== 'undefined') setSeiVersionPro();
}
function initSeiPro() {
	if ( $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').length > 0 ) {
        if (typeof URL_SPRO !== 'undefined' && typeof SimpleTableCellEdition === 'undefined') $.getScript((URL_SPRO+"js/lib/jquery-table-edit.min.js"));
        if (typeof URL_SPRO !== 'undefined' && typeof moment.duration === 'undefined') $.getScript((URL_SPRO+"js/lib/moment-duration-format.min.js"));
        initTableSorterHome();
        insertGroupTable();
        replaceSelectAll();
        initPanelFavorites();
        // checkLoadConfigSheets();
        insertDivPanel();
        setTimeout(() => { initNewTabProcesso() }, 2000);
        forceOnLoadBody();
        observeAreaTela();
        initReplaceSticknoteHome();
        initReplaceNewIcons();
        initControlePrazo();
        initViewEspecifacaoProcesso(); 
        initFullnameAtribuicao();
        initFaviconNrProcesso();
        addAcompanhamentoEspIcon();
        initAllMarcadoresHome();
        initUrgentePro();
        initNaoVisualizadoPro();
        storeLinkUsuarioSistema();
        storeVersionSEI();
        if (typeof checkDadosAcompEspecial !== 'undefined') checkDadosAcompEspecial();
        if (sessionStorage.getItem('configHost_Pro') === null && typeof getConfigHost !== 'undefined') getConfigHost();
	} else if ( $("#ifrArvore").length > 0 ) {
        if (!checkHostLimit()) initDadosProcesso();
        initObserveUrlChange();
        // checkLoadConfigSheets();
        //observeHistoryBrowserPro();
	}
    initReloadModalLink();
    if (typeof isNewSEI !== 'undefined' && isNewSEI) {
        // localStorageRemovePro('seiSlim');
        
        //  Força o reestabelecimento de funcionalidades nativas do SEI 4.0
        $('#ancLiberarMeusProcessos').click(function() {
            verMeusProcessos('T')
        });
        $('#ancLiberarMarcador').click(function() {
            filtrarMarcador(null);
        });
        $('#ancLiberarTipoProcedimento').click(function() {
            filtrarTipoProcedimento(null);
        });
    }
}
$(document).ready(function () { initSeiPro() });