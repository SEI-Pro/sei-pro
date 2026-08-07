// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Árvore — interessados panel.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */



export function getDadosInteressadosArvore(this_) {
    var _this = $(this_);
    var data = _this.data();
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    var seiParent = parent.SeiPro && parent.SeiPro.sei;
    var mainMenuSel = (seiParent && seiParent.selectors && typeof seiParent.selectors.current === 'function')
        ? seiParent.selectors.current().mainMenu
        : (seiParent && seiParent.adapter && typeof seiParent.adapter.mainMenu === 'function')
            ? seiParent.adapter.mainMenu()
            : null;
    if (!mainMenuSel) return;
    var hrefConsulta = $(mainMenuSel+' a[href*="protocolo_pesquisar"]', parent.document.body).attr('href');
    if (hrefConsulta) {
        _this.find('i.iconInteressadosProcesso').toggleClass('fa-folder-open fa-spinner').addClass('fa-spin');
        $('#frmCheckerProcessoPro').attr('src', hrefConsulta).unbind().on('load', function(){
            var iframe = $(this).contents();
                iframe.find('#hdnIdContato').val(data.interessado);
                iframe.find('#optProcessos').prop('checked',true);
                if (data.mesmaNatureza) {
                    iframe.find('#selTipoProcedimentoPesquisa').val(data.tipoProcedimento);
                }
                iframe.find('#chkSinTramitacao').prop('checked', data.tramiteUnidade);
                // console.log({interessado: data.interessado, natureza: data.mesmaNatureza, tipo: data.tipoProcedimento, tramite: data.tramiteUnidade});
                $(this).unbind().on('load', function(){
                    $(this).unbind();
                    _this.find('i.iconInteressadosProcesso').toggleClass('fa-folder-open fa-spinner').removeClass('fa-spin');
                    var iframeResult = $(this).contents();
                    var conteudo = iframeResult.find('#conteudo');
                    var count = conteudo.find('.barra').text().trim();
                    var result = [];
                        conteudo.find(isNewSEI ? 'table.pesquisaResultado tr' : 'table.resultado').each(function(i){
                            var tr = isNewSEI ? $(this) : $(this).find('tr');
                            var urlArvore = isNewSEI ? tr.find('a.protocoloNormal').attr('href') : tr.eq(0).find('a.arvore').attr('href');
                            var paramsUrl = (typeof urlArvore !== 'undefined') ? getParamsUrlPro(url_host.replace('controlador.php','')+urlArvore) : false;
                            var urlTable = (paramsUrl) ? url_host+'?acao=procedimento_trabalhar&id_procedimento='+paramsUrl.id_procedimento+(typeof paramsUrl.id_documento !== 'undefined' ? '&id_documento='+paramsUrl.id_documento : '') : false;
                            if (isNewSEI && i % 3 == 0) {
                                var nomeProcesso = (urlTable) ? '<a href="'+urlTable+'" target="_blank">'+tr.find('td.pesquisaTituloEsquerda span').text().replace('N\u00BA', '').trim()+'</a>' : tr.find('td.pesquisaTituloEsquerda span').text().replace('N\u00BA', '').trim();
                                var unidadeElem = tr.next().next().find('td.pesquisaMetatag').eq(0).find('a');
                                var usuarioElem = tr.next().next().find('td.pesquisaMetatag').eq(1).find('a');
                                var param = {
                                    title: nomeProcesso,
                                    url_proc: urlTable,
                                    unidade: {sigla: unidadeElem.text(), nome: unidadeElem.attr('title')},
                                    usuario: {login: usuarioElem.text(), nome: usuarioElem.attr('title')},
                                    data: tr.next().next().find('td.pesquisaMetatag').eq(2).text().replace('Inclus\u00E3o:', '').trim()
                                };
                                result.push(param);
                            } else if (!isNewSEI) {
                                var _this = $(this);
                                var unidadeElem = _this.find('.metatag table td').eq(0).find('a');
                                var usuarioElem = _this.find('.metatag table td').eq(1).find('a');
                                var param = {
                                    title: _this.find('.resTituloEsquerda').text(),
                                    url_proc: _this.find('.resTituloEsquerda a').eq(0).attr('href'),
                                    unidade: {sigla: unidadeElem.text(), nome: unidadeElem.attr('title')},
                                    usuario: {login: usuarioElem.text(), nome: usuarioElem.attr('title')},
                                    data: _this.find('.metatag table td').eq(2).text()
                                };
                                result.push(param);
                            }
                        });
                        var htmlResult =    '<div class="options_interessado">'+
                                            '   <a class="newLink" data-type="tramiteUnidade" onclick="optionSearchInteressado(this)">'+
                                            '       <i class="'+(data.tramiteUnidade ? 'fas fa-check-square' : 'far fa-square')+' cinzaColor"></i>'+
                                            '       Tramitado na Unidade'+
                                            '   </a>'+
                                            '   <a class="newLink" data-type="mesmaNatureza" onclick="optionSearchInteressado(this)">'+
                                            '       <i class="far '+(data.mesmaNatureza ? 'fas fa-check-square' : 'far fa-square')+' cinzaColor"></i>'+
                                            '       De mesma natureza'+
                                            '       </a>'+
                                            '</div>'+
                                            (count == '' ? '<div class="notfound_interessado"><i class="fas fa-exclamation-circle vermelhoColor"></i> Nenhum resultado encontrado</div>' : '<div class="count_interessado">'+count+'</div>');
                        $.each(result, function(index, value){
                            htmlResult +=   '<div class="proc_interessado">'+
                                            '   <a class="newLink" href="'+value.url_proc+'" target="_blank">'+
                                            '       <i class="fas fa-folder-open cinzaColor"></i>'+
                                            '       '+value.title+
                                            '   <i class="fas fa-external-link-alt" style="font-size: 90%; text-decoration: underline;"></i>'+
                                            '   </a>'+
                                            '   <div style="margin-bottom: 8px;">'+
                                            '       <span style="color:#666666;">'+
                                            '           <i class="fas fa-briefcase cinzaColor"></i>'+
                                            '           '+value.unidade.nome+' ('+value.unidade.sigla+')'+
                                            '       </span>'+
                                            '   </div>'+
                                            '   <div>'+
                                            '       <span style="color:#666666;">'+
                                            '           <i class="fas fa-user cinzaColor"></i>'+
                                            '           '+value.usuario.nome+' ('+value.usuario.login+')'+
                                            '       </span>'+
                                            '       <span style="color:#666666; float: right;">'+
                                            '           <i class="fas fa-calendar cinzaColor"></i>'+
                                            '           '+value.data+
                                            '       </span>'+
                                            '   </div>'+
                                            '</div>';
                        })
                        _this.closest('.dadosInteressados').find('.dadosInteressados_result').html(htmlResult).show();
                        // console.log(count, result);
                });
                iframe.find('#sbmPesquisar').trigger('click');
        });
    }
}
export function optionSearchInteressado(this_) {
    var _this = $(this_);
    var data = _this.data();
    var _parent = _this.closest('.dadosInteressados');
    var checkbox = _this.find('i').hasClass('fa-check-square') ? false : true;
    // console.log('checkbox',checkbox);
    if (data.type == 'tramiteUnidade') {
        _parent.find('a.interessadosProcesso').data('tramite-unidade',checkbox).trigger('click');
        setOptionsPro('panelDadosArvoreInteressados_tramiteUnidade', checkbox);
    } else if (data.type == 'mesmaNatureza') {
        _parent.find('a.interessadosProcesso').data('mesma-natureza',checkbox).trigger('click');
        setOptionsPro('panelDadosArvoreInteressados_mesmaNatureza', checkbox);
    }
    _this.find('i').toggleClass('fa-check-square fa-square');
}
