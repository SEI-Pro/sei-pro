// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sei Functions Pro — session, history, tables UI.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    atividadesState
} from '../../shared/sei-runtime/atividades-bridge.js';

import {
    alertaBoxPro,
    buildTreeModel,
    confirmaBoxPro,
    copyToClipboardHTML,
    downloadTableCSV,
    normalizeTreeDocuments,
    resetDialogBoxPro
} from '../../shared/sei-runtime/deps.js';

export function cleanHistoryPro(this_) {
    confirmaBoxPro('Tem certeza que deseja apagar o hist\u00F3rico de processos?', function(){
        localStorageRemovePro('dadosHistoricoProcessoPro');
        resetDialogBoxPro('dialogBoxPro');
        alertaBoxPro('Sucess', 'check-circle', 'Hist\u00F3rico apagado com sucesso!');
    }, 'Apagar');
}
export function downloadTablePro(this_) {
    var _this = $(this_);
    var table = _this.closest('table');
    var data_table = table.data();
    var data = _this.data();
    var nameTable = (typeof data_table.nameTable !== 'undefined') 
                    ? data_table.nameTable 
                    : ($(".infraBarraLocalizacao").length > 0) ? removeAcentos($(".infraBarraLocalizacao").eq(0).text().trim()).toLowerCase().replace(/ /g,"_") : 'tabela';
    downloadTableCSV(table, nameTable+'_SEIPro');
    _this.find('.text').text('Baixado...');
    _this.find('i').attr('class','fas fa-thumbs-up');
    setTimeout(function(){ 
        _this.find('.text').text(data.value);
        _this.find('i').attr('class',data.icon);
    }, 1500);
}
export function copyTablePro(this_) {
    var _this = $(this_);
    var table = _this.closest('table');
    var data = _this.data();
    var htmlTable = table.clone(true).find('.notCopy').remove().end()[0].outerHTML;
    copyToClipboardHTML(htmlTable);
    _this.find('.text').text('Copiado...');
    _this.find('i').attr('class','fas fa-thumbs-up');
    setTimeout(function(){ 
        _this.find('.text').text(data.value);
        _this.find('i').attr('class',data.icon);
    }, 1500);
}
export function changeInputDateTime(this_) {
    var _this = $(this_);
    var _parent = (_this.closest('.ui-dialog').length > 0) ? _this.closest('.ui-dialog') : _this.closest('.seiProForm');
        _parent.find('.cloneDateTime').remove();
        _parent.find('input[type="datetime-local"]').each(function(){
            var id = (typeof $(this).attr('id') !== 'undefined') ? $(this).attr('id') : randomString(4);
            var partValue = $(this).val().split('T');
            var dateValue = partValue[0];
            var timeValue = partValue[1];
            var dateInput = $(this).clone()
                                .prop('id', id+'_clone_date')
                                .removeAttr('onchange')
                                .removeAttr('data-key')
                                .removeAttr('data-type')
                                .removeAttr('data-name')
                                .removeData()
                                .attr('max', (typeof $(this).attr('max') !== 'undefined' && $(this).attr('max') != '') ? $(this).attr('max').split('T')[0] : '' )
                                .attr('min', (typeof $(this).attr('min') !== 'undefined' && $(this).attr('min') != '') ? $(this).attr('min').split('T')[0] : '' )
                                .attr('data-refid', id)
                                .attr('value',dateValue)
                                .prop('type', 'date')
                                .attr('style','width: 50% !important;float: left;')
                                .attr('onchange', 'updateInputDateTime(this)')
                                .val(dateValue)
                                .addClass('cloneDateTime');
            var timeInput = $(this).clone()
                                .prop('id', id+'_clone_time')
                                .removeAttr('onchange')
                                .removeAttr('data-key')
                                .removeAttr('data-type')
                                .removeAttr('data-name')
                                .removeData()
                                .removeAttr('max')
                                .removeAttr('min')
                                .attr('data-refid', id)
                                .attr('value',timeValue)
                                .prop('type', 'time')
                                .attr('style','width: 30% !important;float: right;')
                                .attr('onchange', 'updateInputDateTime(this)')
                                .val(timeValue)
                                .addClass('cloneDateTime');
            $(this).after(timeInput).after(dateInput).hide();
            $(this).closest('td').addClass('dateonly');
        });
}
export function updateInputDateTime(this_) {
    var _this = $(this_);
    var _parent = _this.closest('td');
    var data = _this.data();
    var _date = _parent.find("#"+data.refid+'_clone_date');
    var _time = _parent.find("#"+data.refid+'_clone_time');
        _parent.find("#"+data.refid).val(_date.val()+'T'+_time.val()).trigger('change');
        console.log(_date.val(), _time.val());

    changeInputDateTime(this_);
}
// [migrado para core/helpers.js] checkBrowser
export function updateDatesRange(this_) {
    var _this = $(this_);
    var _parent = _this.closest('tr');
    var _inicio = _parent.find('input[data-range="inicio"]');
    var _fim = _parent.find('input[data-range="fim"]');
    setTimeout(() => {
        _fim.attr('min',_inicio.val());
        _inicio.attr('max',_fim.val());
    }, 1500);
}
export function setSortLocaleCompare() {
    $.tablesorter.characterEquivalents = {
        'a' : '\u00e1\u00e0\u00e2\u00e3\u00e4\u0105\u00e5', // áàâãäąå
        'A' : '\u00c1\u00c0\u00c2\u00c3\u00c4\u0104\u00c5', // ÁÀÂÃÄĄÅ
        'c' : '\u00e7\u0107\u010d', // çćč
        'C' : '\u00c7\u0106\u010c', // ÇĆČ
        'e' : '\u00e9\u00e8\u00ea\u00eb\u011b\u0119', // éèêëěę
        'E' : '\u00c9\u00c8\u00ca\u00cb\u011a\u0118', // ÉÈÊËĚĘ
        'i' : '\u00ed\u00ec\u0130\u00ee\u00ef\u0131', // íìİîïı
        'I' : '\u00cd\u00cc\u0130\u00ce\u00cf', // ÍÌİÎÏ
        'o' : '\u00f3\u00f2\u00f4\u00f5\u00f6\u014d', // óòôõöō
        'O' : '\u00d3\u00d2\u00d4\u00d5\u00d6\u014c', // ÓÒÔÕÖŌ
        'ss': '\u00df', // ß (s sharp)
        'SS': '\u1e9e', // ẞ (Capital sharp s)
        'u' : '\u00fa\u00f9\u00fb\u00fc\u016f', // úùûüů
        'U' : '\u00da\u00d9\u00db\u00dc\u016e' // ÚÙÛÜŮ
    };
}
export function filterTablePro(this_) {
    var _this = $(this_);
    var _parent = _this.closest('thead');
    var table = _this.closest('table');
    var filter = _parent.find('.tablesorter-filter-row');
    if (_this.hasClass('active')) {
        filter.addClass('hideme');
        _this.removeClass('active');
        table.trigger('filterReset').trigger('updateAll');
    } else {
        filter.removeClass('hideme');
        _this.addClass('active');
        setTimeout(function(){ 
            filter.find('input:visible').map(function(){
                if ($(this).visible(false, true)) { return this }
            }).eq(0).focus();
        },500);
    }
}
export function setHistoryProcessosPro(dadosProcessoPro) {
    var prop = dadosProcessoPro.propProcesso;
    var dadosProcessoPro_push = {
            datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
            data_geracao: prop.hdnDtaGeracao,
            id_procedimento: prop.hdnIdProcedimento,
            tipo_processo: prop.hdnNomeTipoProcedimento,
            protocolo: ((typeof prop.txtProtocoloExibir === 'undefined') ? prop.hdnProtocoloFormatado : prop.txtProtocoloExibir),
            nivel_acesso: prop.rdoNivelAcesso,
            assuntos: prop.selAssuntos_select,
            observacoes: prop.txaObservacoes,
            descricao: prop.txtDescricao
        };
    var dadosHistoricoProcessoPro = localStorageRestorePro('dadosHistoricoProcessoPro');

    if (dadosHistoricoProcessoPro !== null) {
        dadosHistoricoProcessoPro = reverseArray(dadosHistoricoProcessoPro);
        dadosHistoricoProcessoPro = dadosHistoricoProcessoPro.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.id_procedimento === thing.id_procedimento
          ))
        );
        dadosHistoricoProcessoPro = reverseArray(dadosHistoricoProcessoPro);
    }
    if (dadosHistoricoProcessoPro !== null) {
        for (let i = 0; i < dadosHistoricoProcessoPro.length; i++) {
            if( i > 500 || dadosHistoricoProcessoPro[i].id_procedimento == dadosProcessoPro_push.id_procedimento) {
                dadosHistoricoProcessoPro.splice(i,1);
                i--;
            }
        }
    }

    if (dadosHistoricoProcessoPro) {
        dadosHistoricoProcessoPro.push(dadosProcessoPro_push);
    } else {
        dadosHistoricoProcessoPro = [dadosProcessoPro_push];
    }

    localStorageStorePro('dadosHistoricoProcessoPro', dadosHistoricoProcessoPro);
}
export function resolveProcessoSessionId(id_procedimento = false) {
    if (typeof id_procedimento !== 'undefined' && id_procedimento !== null && id_procedimento !== '') {
        return String(id_procedimento);
    }
    var idAtual = getParamsUrlPro(window.location.href).id_procedimento;
    if (typeof idAtual !== 'undefined' && idAtual !== null && idAtual !== '') {
        return String(idAtual);
    }
    if ($('#ifrArvore').length > 0) {
        var srcArvore = $('#ifrArvore').attr('src');
        if (typeof srcArvore !== 'undefined' && srcArvore !== null && srcArvore !== '') {
            var paramsArvore = getParamsUrlPro(srcArvore);
            if (typeof paramsArvore.id_procedimento !== 'undefined' && paramsArvore.id_procedimento !== null && paramsArvore.id_procedimento !== '') {
                return String(paramsArvore.id_procedimento);
            }
        }
    }
    return false;
}
export function pullDadosProcessoSession(id_procedimento = false) {
    return getDadosProcessoSession(id_procedimento) ? getDadosProcessoSession(id_procedimento) : dadosProcessoPro;
}
export function getDadosProcessoSession(id_procedimento = false) {
    id_procedimento = resolveProcessoSessionId(id_procedimento);
    if (!id_procedimento) return false;
    if (typeof jmespath === 'undefined') return false;
    var dadosSessionProcessoPro = sessionStorageRestorePro('dadosSessionProcessoPro');
    var dadosProcesso = (dadosSessionProcessoPro) ? jmespath.search(dadosSessionProcessoPro, "[?propProcesso.hdnIdProcedimento=='"+id_procedimento+"' || listAndamento.id_procedimento=='"+id_procedimento+"'] | [0]") : null;
    return (dadosProcesso && dadosProcesso !== null) ? dadosProcesso : false;
}
export function setSessionProcessosPro(dadosProcessoPro) {
    var dadosProcessoPro_push = dadosProcessoPro;
    if (dadosProcessoPro_push && typeof dadosProcessoPro_push.treeModel !== 'undefined' && dadosProcessoPro_push.treeModel !== null) {
        dadosProcessoPro_push.treeModel = buildTreeModel(dadosProcessoPro_push.treeModel);
    }
    if (dadosProcessoPro_push && typeof dadosProcessoPro_push.listDocumentos !== 'undefined' && $.isArray(dadosProcessoPro_push.listDocumentos)) {
        dadosProcessoPro_push.listDocumentos = normalizeTreeDocuments(dadosProcessoPro_push.listDocumentos);
    }
    if (dadosProcessoPro_push && typeof dadosProcessoPro_push.treeModel !== 'undefined' && dadosProcessoPro_push.treeModel !== null) {
        dadosProcessoPro_push.listDocumentos = dadosProcessoPro_push.treeModel.documents;
        dadosProcessoPro_push.listDocumentosAssinados = dadosProcessoPro_push.treeModel.documentsSigned;
        dadosProcessoPro_push.listLinks = dadosProcessoPro_push.treeModel.links;
        dadosProcessoPro_push.listLinksAll = dadosProcessoPro_push.treeModel.linksAll;
        dadosProcessoPro_push.treeIconsView = dadosProcessoPro_push.treeModel.iconsView;
        dadosProcessoPro_push.treePageLinks = dadosProcessoPro_push.treeModel.pageLinks;
        dadosProcessoPro_push.treeSignature = dadosProcessoPro_push.treeModel.signature;
    }
    var dadosSessionProcessoPro = sessionStorageRestorePro('dadosSessionProcessoPro');

    var id_procedimento = (typeof dadosProcessoPro_push.propProcesso !== 'undefined' && typeof dadosProcessoPro_push.propProcesso.hdnIdProcedimento !== 'undefined') ? dadosProcessoPro_push.propProcesso.hdnIdProcedimento : (getParamsUrlPro(window.location.href).id_procedimento ? getParamsUrlPro(window.location.href).id_procedimento : undefined);
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
    /*
    if (dadosSessionProcessoPro !== null) {
        dadosSessionProcessoPro = reverseArray(dadosSessionProcessoPro);
        dadosSessionProcessoPro = dadosSessionProcessoPro.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.propProcesso.hdnIdProcedimento === thing.propProcesso.hdnIdProcedimento
          ))
        );
        dadosSessionProcessoPro = reverseArray(dadosSessionProcessoPro);
    }
    */
    if (dadosSessionProcessoPro !== null) {
        for (let i = 0; i < dadosSessionProcessoPro.length; i++) {
            if( i > 500 || 
                    (
                        (typeof dadosSessionProcessoPro[i].propProcesso !== 'undefined' && typeof dadosSessionProcessoPro[i].propProcesso.hdnIdProcedimento !== 'undefined' && dadosSessionProcessoPro[i].propProcesso.hdnIdProcedimento == id_procedimento)
                        || 
                        (typeof dadosSessionProcessoPro[i].listAndamento !== 'undefined' && dadosSessionProcessoPro[i].listAndamento.id_procedimento == id_procedimento)
                    )
            ) {
                dadosSessionProcessoPro.splice(i,1);
                i--;
            }
        }
    }

    if (dadosSessionProcessoPro) {
        dadosSessionProcessoPro.push(dadosProcessoPro_push);
    } else {
        dadosSessionProcessoPro = [dadosProcessoPro_push];
    }
    // Cache que cresce (uma entrada por processo visitado). Grava com limite PROATIVO
    // (quantidade + tamanho) para não estourar a cota do sessionStorage — o que antes
    // gerava poda reativa e ruído no console/coletor de erros do Chrome.
    if (typeof sessionStorageStoreBoundedPro === 'function') {
        sessionStorageStoreBoundedPro('dadosSessionProcessoPro', dadosSessionProcessoPro, { maxEntries: 25 });
    } else {
        sessionStorageStorePro('dadosSessionProcessoPro', dadosSessionProcessoPro);
    }

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('sei-pro-process-session-updated', {
            detail: {
                id_procedimento: id_procedimento,
                hasPropProcesso: typeof dadosProcessoPro_push.propProcesso !== 'undefined' && dadosProcessoPro_push.propProcesso !== null,
                hasListAndamento: typeof dadosProcessoPro_push.listAndamento !== 'undefined' && dadosProcessoPro_push.listAndamento !== null,
                hasListDocumentosAssinados: typeof dadosProcessoPro_push.listDocumentosAssinados !== 'undefined' && dadosProcessoPro_push.listDocumentosAssinados !== null
            }
        }));
    }
}
export function updateTitlePage(mode, dadosProcesso = false) {
    var processo = (dadosProcesso) ? dadosProcesso.propProcesso : dadosProcessoPro.propProcesso;
    if (!processo || typeof processo !== 'object') {
        return;
    }
    if ( typeof processo.txtDescricao !== 'undefined'  ) {
        var protocolo = (typeof processo !== 'undefined' && typeof processo.txtProtocoloExibir === 'undefined') ? processo.hdnProtocoloFormatado : processo.txtProtocoloExibir;
        if (mode == 'processo') {
            $('head title').text(processo.txtDescricao+' | SEI - Processo '+protocolo);
            if (parent.verifyConfigValue('urlamigavel')) {
                updateUrlPage(true, dadosProcesso);
            }
        } else if (mode == 'editor') {
            var title = $('head title').text();
                title = (title.indexOf('-') !== -1) ? title.split('-')[2]+' '+title.split('-')[1] : title; 
            $('head title').text('Editor: '+title+' - '+processo.txtDescricao+' | SEI - Processo '+protocolo);
        }
    }
}
export function updateUrlPage(update = true, dadosProcesso = false) {
    // Skip history manipulation if the user hasn't interacted with the page yet.
    // Calling pushState/replaceState without a user gesture triggers Chrome's
    // "History manipulation intervention" warning.
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
        return;
    }
    var processo = (dadosProcesso) ? dadosProcesso.propProcesso : dadosProcessoPro.propProcesso;
    var protocolo = (typeof processo !== 'undefined' && typeof processo.txtProtocoloExibir === 'undefined')
            ? processo.hdnProtocoloFormatado
            : (typeof processo !== 'undefined') ? processo.txtProtocoloExibir : null;
    if (typeof protocolo !== 'undefined' && protocolo !== null && $('#ifrArvore').length > 0) {
        var ifrArvore = $('#ifrArvore').contents();
        var nrSEI = ifrArvore.find('.infraArvoreNoSelecionado').eq(0);
            nrSEI = (typeof nrSEI !== 'undefined' && nrSEI !== null) ? getNrSei(nrSEI.text().trim()) : '';
            nrSEI = (nrSEI != '') ? '@'+nrSEI : '';
            
        if (update) {
            window.history.replaceState({sei: nrSEI}, document.title, "/sei/#"+protocolo+nrSEI);
        } else {
            window.history.pushState({sei: nrSEI}, document.title, "/sei/#"+protocolo+nrSEI);
            iHistoryArray.push({id: iHistory, sei: nrSEI});
        }
        iHistory++;
    }
}
// [migrado para core/texto.js] getNrSei
export function getIfrArvoreDadosProcesso() {
    var ativState = atividadesState();
    if ($('#ifrArvore').length > 0) {
        var ifrArvore = $('#ifrArvore').contents();
        var ifrVisualizacao = $($ifrVisualizacao).contents();
        var ifrArvoreHtml = ifrVisualizacao.find($ifrArvoreHtml).contents();

        var assunto = (ifrVisualizacao.find($ifrArvoreHtml).length > 0) 
                        ? ifrArvoreHtml.find('p').map(function() {
                                                    var reg = new RegExp('assunto:', "igm");
                                                    if (reg.test($(this).text())) { return $(this).text().replace(reg, '').trim().replace(/[\u200B]/g, '') }
                                                }).get(0) 
                        : '';

        var usuarios = ativState.arrayConfigAtividades && typeof ativState.arrayConfigAtividades.planos !== 'undefined' ? uniqPro(jmespath.search(ativState.arrayConfigAtividades.planos, "[*].apelido")) : [];
            usuarios = usuarios.sort((a,b) => b.length - a.length);

        var usuario = (ifrVisualizacao.find($ifrArvoreHtml).length > 0) 
                        ? ifrArvoreHtml.find('p').map(function() {
                                    var txt = removeAcentos($(this).text());
                                    var reg = new RegExp('\\b'+removeAcentos(usuarios.join('|'))+'\\b', 'im');
                                    if (reg.test(txt)) {
                                        var u = false; 
                                        var textMatch = txt.replace(reg, function(match) {
                                            u = match;
                                            return false;
                                        });
                                        return u;
                                    };
                                }).get(0)
                        : false;

        var prazo = (ifrVisualizacao.find($ifrArvoreHtml).length > 0) 
                        ? ifrArvoreHtml.find('p').map(function() {
                                                    var txt = $(this).text();
                                                    var reg = new RegExp('prazo', "i");
                                                    var p = false;
                                                    if (reg.test(txt)) { 
                                                        p = txt.substr(txt.indexOf('prazo')+5).trim();
                                                        p = p.match(/^\d+|\d+\b|\d+(?=\w)/g);
                                                        return (p !== null) ? parseInt(p[0]) : false; 
                                                    }
                                                }).get(0) 
                        : false;

        var assinatura = (ifrVisualizacao.find($ifrArvoreHtml).length > 0) 
                        ? ifrArvoreHtml.find('p').map(function() {
                                                    var txt = $(this).text();
                                                    var reg = new RegExp('documento assinado eletronicamente', "i");
                                                    var p = false;
                                                    if (reg.test(txt)) { 
                                                        var date = txt.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img);
                                                        var time = txt.match(/(\d{1,2}:\d{2})/img);
                                                        return (date !== null && time !== null) ? date[0]+' '+time[0] : false; 
                                                    }
                                                }).get(0) 
                        : false;

        var versao = false;
        if (ifrVisualizacao.find($ifrArvoreHtml).length > 0) {
            var txt = ifrArvoreHtml.find('body').text().trim();
                txt = txt.substr(txt.lastIndexOf("\n")+1);
            var date = txt.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img);
            var time = txt.match(/(\d{1,2}:\d{2})/img);
                versao = (date !== null && time !== null) ? date[0]+' '+time[0] : false; 
        }
        var data_documento = (assinatura) ? assinatura : versao;
        
        var processoLnk = ifrArvore.find(`a[target="${ifrVisualizacao_}"]`).eq(0);
        var processo_sei = processoLnk.text().trim();
        var tipo = processoLnk.find('span').attr('title');
        var tipo = typeof tipo !== 'undefined' ? tipo.trim() : tipo;
        var id_procedimento = processoLnk.attr('href');
            id_procedimento = (typeof id_procedimento !== 'undefined' && id_procedimento.length > 0) ? getParamsUrlPro(id_procedimento).id_procedimento : false;
        var requisicaoLnk = ifrArvore.find('#container .infraArvoreNoSelecionado');
        var id_documento = requisicaoLnk.closest('a').attr('href');
            id_documento = (typeof id_documento !== 'undefined' && id_documento.length > 0) ? getParamsUrlPro(id_documento).id_documento : false;
        var nome_documento = requisicaoLnk.text().replace(/[0-9]/g, '').replace(/\(\)/g, '').trim();
        var nr_sei = requisicaoLnk.text().trim().split(' ');
            nr_sei = (requisicaoLnk.text().indexOf(' ') !== -1) ? nr_sei[nr_sei.length-1] : '';
            nr_sei = (nr_sei.indexOf('(') !== -1) ? nr_sei.replace(')','').replace('(','').trim() : nr_sei;
            nr_sei = (typeof requisicaoLnk.attr('id') !== 'undefined' && requisicaoLnk.attr('id').length > 0 && requisicaoLnk.attr('id').indexOf('PASTA') === -1) ? nr_sei : '';
        var numero_documento = (ifrVisualizacao.find($ifrArvoreHtml).length > 0) 
                                ? ifrArvoreHtml.find('p').map(function() {
                                                            var reg = new RegExp(removeAcentos(nome_documento), "igm");
                                                            if (reg.test(removeAcentos($(this).text()))) { return removeAcentos($(this).text()).replace(reg, '').replace(/[\u200B]/g, '').replace(/n[\u00BA]/g, '').trim() }
                                                        }).get(0) 
                                : '';


        var processos = ifrArvoreHtml.find('a.ancoraSei')
                            .map(function(){
                                var processo_sei = $(this).text().trim();
                                var param = getParamsUrlPro($(this).attr('href'));
                                var id_proced = (param && typeof param.id_protocolo !== 'undefined') 
                                                        ? param.id_protocolo 
                                                        : (param && typeof param.id_procedimento !== 'undefined') 
                                                            ? param.id_procedimento
                                                            : false;
                                if (id_proced && id_proced != id_procedimento && processo_sei !== '' && processo_sei.match( /(-|\/|\.)/ )) { 
                                    return {processo_sei: processo_sei, id_procedimento: id_proced} 
                                }
                            }).get();
        return {
                    processo_sei: (typeof processo_sei !== 'undefined') ? processo_sei : false,
                    id_procedimento: (typeof id_procedimento !== 'undefined') ? id_procedimento : false,
                    tipo: (typeof tipo !== 'undefined') ? tipo : false,
                    nome_documento: (typeof nome_documento !== 'undefined') ? nome_documento : false,
                    id_documento: (typeof id_documento !== 'undefined') ? id_documento : false,
                    nr_sei: (typeof nr_sei !== 'undefined') ? nr_sei : false,
                    numero_documento: (typeof numero_documento !== 'undefined') ? numero_documento : false,
                    assunto: (typeof assunto !== 'undefined') ? assunto : false,
                    usuario: (typeof usuario !== 'undefined') ? usuario : false,
                    prazo: (typeof prazo !== 'undefined') ? (parseInt(prazo) > 100 ? 100 : parseInt(prazo)) : false,
                    assinatura: (typeof assinatura !== 'undefined') ? assinatura : false,
                    versao: (typeof versao !== 'undefined') ? versao : false,
                    processos: (typeof processos !== 'undefined' && processos.length > 0) ? processos : false,
                    data_documento: (typeof data_documento !== 'undefined') ? data_documento : false
                };
    } else { return false; }
}
// resize img
export function loadCSSResize(iframe) {	
	var cssScript = 'img::selection{color:transparent}img.ckimgrsz{outline:1px dashed #000}#ckimgrsz{position:absolute;margin:-8px -8px;width:0;height:0;cursor:default;z-index:10001}#ckimgrsz span{display:none;position:absolute;top:0;left:0;width:0;height:0;background-size:100% 100%;opacity:.65;outline:1px dashed #000}#ckimgrsz i{position:absolute;display:block;width:5px;height:5px;background:#fff;border:1px solid #000}#ckimgrsz i.active,#ckimgrsz i:hover{background:#000}#ckimgrsz i.br,#ckimgrsz i.tl{cursor:nwse-resize}#ckimgrsz i.bm,#ckimgrsz i.tm{cursor:ns-resize}#ckimgrsz i.bl,#ckimgrsz i.tr{cursor:nesw-resize}#ckimgrsz i.lm,#ckimgrsz i.rm{cursor:ew-resize}body.dragging-br,body.dragging-br *,body.dragging-tl,body.dragging-tl *{cursor:nwse-resize!important}body.dragging-bm,body.dragging-bm *,body.dragging-tm,body.dragging-tm *{cursor:ns-resize!important}body.dragging-bl,body.dragging-bl *,body.dragging-tr,body.dragging-tr *{cursor:nesw-resize!important}body.dragging-lm,body.dragging-lm *,body.dragging-rm,body.dragging-rm *{cursor:ew-resize!important}';
	
	if ( iframe.find('head').find('style[data-style="seipro-resizeimg"]').length == 0 ) {
		iframe.find('head').append("<style type='text/css' data-style='seipro-resizeimg'> "
								   +cssScript
								   +"</style>");
	
	}
}
