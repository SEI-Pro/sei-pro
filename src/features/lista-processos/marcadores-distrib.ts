// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Lista de processos — marcadores, acompanhamento, distribuição.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    getArrayProcessoRecebido
} from './modules.js';

export function addAcompanhamentoEspIcon() {
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
export function getListaMarcadores(html) {
    var indexSelected = 0;
    var selectTags = html.find('#selMarcador').find('option').map(function(i, v){ 
                        if ($(this).is(':selected')) indexSelected = i-1;
                        if ($(this).text().trim() != '') { 
                            return {name: $(this).text().trim(), value: $(this).val(), img: $(this).attr('data-imagesrc') } 
                        } 
                    }).get();
        if (selectTags.length > 0) {
            setOptionsPro('listaMarcadores',selectTags);
            setOptionsPro('listaMarcadores_unidade',$('#selInfraUnidades').val());
        }
    return {array: selectTags, indexSelected: indexSelected};
}
export function configDatesSwitchChangeHome(this_) {
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
export function getMapaControleProcesso() {
    return $('#tblProcessosRecebidos').find('tbody tr').not('.tableHeader').not('.infraCaption').map(function(){
        let _this = $(this);
        let _td = _this.find('td');
        let id_procedimento = _this.attr('id');
            id_procedimento = typeof id_procedimento !== 'undefined' ? parseInt(id_procedimento.replace('P','')) : false;
        let protocolo = _td.eq(2).text();
        let link_atribuicao = _td.eq(3).find('a[href*="controlador.php?acao=procedimento_atribuicao_listar"]');
        let nome_atribuicao = (typeof getAtribuicaoDisplayLabel === 'function')
            ? getAtribuicaoDisplayLabel(link_atribuicao.attr('title'), link_atribuicao.text(), true)
            : link_atribuicao.attr('title');
            nome_atribuicao = typeof nome_atribuicao !== 'undefined' ? nome_atribuicao : false;
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
export function updateCountIconDist() {
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

export const txtPadrao_getList = async () => {
    var htmlTxtPadrao = await $.get(urlTxtPadrao);
    var listTxtPadrao = $(htmlTxtPadrao).find('#divInfraAreaTabela table.infraTable tr').map(function(){
        var td = $(this).find('td');
        var link = td.eq(4).find('a');
        var id = td.eq(1).text();
        var name = td.eq(2).text();
        var description = td.eq(3).text();
        if (name) {
            return {
                id: id,
                name: name,
                description: description,
                view: link.eq(0).attr('href'),
                edit: link.eq(1).attr('href')
            }
        }
    }).get();
    return listTxtPadrao;
}
export const txtPadrao_newLink = async () => {
    var htmlTxtPadrao = await $.get(urlTxtPadrao);
    var urlNew = $(htmlTxtPadrao).find('#btnNovo').attr('onclick');
        urlNew = typeof urlNew !== 'undefined' && urlNew.indexOf("'") !== -1 ? urlNew.split("'")[1] : false;
    return urlNew;
}
export const txtPadrao_getConfig = async (idTxt) => {
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
export const txtPadrao_setConfig = async (data) => {
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
export const txtPadrao_createConfig = async (form, urlForm, data) => {
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
export const getTableDistribAutomatica = async () => {
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
	                        '                   <span class="lblInfraCheck" aria-hidden="true"></span>'+
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
export function setAtribuicaoAutomatica() {

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
// Reconcilia a soma de colspans do cabeçalho com o nº de tds do corpo (a coluna "Prazos"
// desalinha porque o cabeçalho do SEI usa colspan e outras features [anotação] adicionam th
// sem casar com o corpo). Ajusta o th principal (maior colspan) de cada tabela.
export function getAllMarcadoresHome() {
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
export function initAllMarcadoresHome(TimeOut = 9000) {
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
// initNaoVisualizadoPro migrada para src/features/nao-lido/view.js (feature
// marcar_naolido). Global preservado via aliasGlobal no bundle js/sei-pro-nao-lido.js.
export function initUrgentePro() {
    $('a div.urgentePro').remove();
    $('a[href*="controlador.php?acao=procedimento_trabalhar"][onmouseover*="(URGENTE)"]')
        .prepend('<div class="urgentePro"></div>')
        .addClass('urgentePro')
        .closest('tr')
        .addClass('urgentePro');
}
