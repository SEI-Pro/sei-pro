// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { callAtiv } from './call.js';
/**
 * Atividades — afastamentos, contatos e produtividade.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import { atividadesDialogDocAttrs, withSeiproBarClasses } from './templates.js';
import { getServerAtividades } from './server.js';

export function getChartAfastamentoPanel(this_) {
    var _this = $(this_);
    $('#reportAfastamentoPanel').show();
}
export function initTableAfastamentoPanel(this_, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().tablesorter !== 'undefined') {
        getTableAfastamentoPanel(this_);
    } else {
        setTimeout(function () {
            if (typeof $().tablesorter === 'undefined' && TimeOut == 9000) { $.getScript((URL_SPRO + "js/lib/jquery.tablesorter.combined.min.js")) }
            initTableAfastamentoPanel(this_, TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initTableAfastamentoPanel');
        }, 500);
    }
}
export function getTableAfastamentoPanel(this_) {
    var _this = $(this_);
    var afastID = '#tableAfastamentoPanel';
    var tabelaAfast = $(afastID);
    tabelaAfast.show();
    var listAfastamentos = arrayConfigAtividades.afastamentos.lista;
    var countAfastamentos = (listAfastamentos.length == 1) ? listAfastamentos.length + ' registro:' : listAfastamentos.length + ' registros:';
    if (typeof listAfastamentos !== 'undefined' && listAfastamentos.length > 0 && listAfastamentos != 0) {
        htmlTableAfastamentos = '<table id="tableAfastamento" class="tableInfo tableZebra tableFollow tableAtividades tableAfastamentos seipro-atividades-table" data-tabletype="afastamentos">' +
            '   <caption class="infraCaption" style="text-align: left; margin-top: 10px;">' + countAfastamentos + '</caption>' +
            '   <thead>' +
            '       <tr class="tableHeader">' +
            '           <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_afastamentos" accesskey=";"></label><a id="lnkInfraCheck_afastamentos" class="lnkInfraCheck" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck"></a></th>' +
            '           <th class="tituloControle tituloFilter" data-filter-type="user">Usu\u00E1rio</th>' +
            '           <th class="tituloControle tituloFilter" data-filter-type="date" style="width: 25%;">Motivo do Afastamento</th>' +
            '           <th class="tituloControle tituloFilter sorter-date-range-dmy" data-filter-type="inicio" style="width: 160px;">In\u00EDcio do Afastamento</th>' +
            '           <th class="tituloControle tituloFilter sorter-date-range-dmy" data-filter-type="fim" style="width: 160px;">Fim do Afastamento</th>' +
            '           <th class="tituloControle" data-filter-type="desc">' + __.Observacoes + '</th>' +
            '           <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
            '       </tr>' +
            '   </thead>' +
            '   <tbody>';
        $.each(listAfastamentos, function (index, value) {
            var dateConfig = {
                date: moment(value.fim_afastamento).format('YYYY-MM-DD HH:mm:ss'),
                nametag: (moment(value.fim_afastamento) < moment()
                    ? { name: 'Conclu\u00EDdo', value: 'date_concluido', color: '#eef4f9' }
                    : { name: 'Programado', value: 'date_programado', color: '#eef4f9' }
                )
            };
            var tagName_thisUser = normalizeNameTag(value.apelido);
            var tagName_thisMotivo = normalizeNameTag(value.nome_motivo);
            var tagName_thisDate = normalizeNameTag(dateConfig.nametag.name);
            var tagColor = jmespath.search(arrayConfigAtividades.afastamentos.tipos_motivos, "[?id_tipo_motivo==`" + value.id_tipo_motivo + "`] | [0].config.colortags");
            tagColor = (tagColor !== null) ? tagColor : { "icontag": "luggage-cart", "colortag": "#bfd5e11", "textcolor": "black" };
            var horas_afastamento = jmespath.search(arrayConfigAtividades.afastamentos.tipos_motivos, "[?id_tipo_motivo==`" + value.id_tipo_motivo + "`] | [0].config.horas_afastamento");
            horas_afastamento = (horas_afastamento) ? true : false;
            var integracao_interna = jmespath.search(arrayConfigAtividades.afastamentos.tipos_motivos, "[?id_tipo_motivo==`" + value.id_tipo_motivo + "`] | [0].config.integracao_interna");
            integracao_interna = (integracao_interna) ? true : false;
            var editar_integracao_interna = jmespath.search(arrayConfigAtividades.afastamentos.tipos_motivos, "[?id_tipo_motivo==`" + value.id_tipo_motivo + "`] | [0].config.editar_integracao_interna");
            editar_integracao_interna = (editar_integracao_interna) ? true : false;
            var dia_inteiro = (moment(value.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') == '00:00:00' && (moment(value.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') == '23:59:59' || moment(value.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') == '00:00:00')) ? true : false;
            var format_sys = (horas_afastamento) ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
            var format_display = (!dia_inteiro) ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';
            var type_input = (horas_afastamento) ? 'datetime-local' : 'date';
            var icon_integracao = (typeof value.key_afastamento !== 'undefined' && value.key_afastamento !== null) ? '<span data-act="atividades-call" data-fn="filterTagView" data-tip="Afastamento inserido automaticamente pelo sistema" data-colortag="#e7edf2" data-tagname="integracao" data-textcolor="black" data-icontag="cog" data-type="date" style="background-color: #e7edf2; color: #666" class="tag_text tagTableText_integracao"><i class="tagicon fas fa-cog" style="font-size: 90%;margin: 0 2px; color: #666"></i></span>' : '';
            var tagName_integracao = (typeof value.key_afastamento !== 'undefined' && value.key_afastamento !== null) ? 'tagTableName_integracao' : '';

            var tagDate = getDatesPreview(dateConfig);
            htmlTableAfastamentos += '       <tr data-tagname="SemGrupo" data-index="' + value.id_afastamento + '" class="tagTableName_' + tagName_thisUser + ' tagTableName_' + tagName_thisMotivo + ' tagTableName_date_' + tagName_thisDate + ' ' + tagName_integracao + '">' +
                '           <td align="center">' +
                '               <input type="checkbox" ' + (callAtiv('checkPermissionAfast',value, 'delete_afastamento') ? '' : 'disabled') + ' class="checkboxSelectAfastamento" data-act="atividades-call" data-fn="followSelecionarItens" id="afastamentoPro_' + value.id_afastamento + '" name="afastamentoPro" value="' + value.id_afastamento + '">' +
                '           </td>' +
                '           <td align="left">' +
                '               <span class="info_tags_follow info_tags_user">' +
                '                   <span data-colortag="#bfd5e8" data-type="user" data-tagname="' + tagName_thisUser + '" data-textcolor="black" data-icontag="user" style="background-color: #bfd5e8;" class="tag_text tagTableText_' + tagName_thisUser + '" data-act="atividades-call" data-fn="filterTagView">' +
                '                       <i data-colortag="#406987" class="fas fa-user" style="font-size: 90%; margin: 0px 2px; color: #406987;"></i> ' + value.apelido +
                '                   </span>' +
                '               </span>' +
                '           ' + value.nome_completo +
                '           </td>' +
                '           <td align="left">' +
                '               <span class="info_tags_follow">' +
                '                   <span data-colortag="' + tagColor.colortag + '" data-tagname="' + tagName_thisMotivo + '" data-textcolor="' + tagColor.textcolor + '" data-icontag="' + tagColor.icontag + '" data-type="date" style="background-color: ' + tagColor.colortag + '; color: ' + tagColor.textcolor + '"class="tag_text tagTableText_' + tagName_thisMotivo + '" data-act="atividades-call" data-fn="filterTagView">' +
                '                       <i class="tagicon fas fa-' + tagColor.icontag + '" style="font-size: 90%;margin: 0 2px; color: ' + tagColor.textcolor + '"></i>' +
                '                       ' + value.nome_motivo +
                '                   </span>' + icon_integracao +
                '                   <span class="info_dates_monitorado">' + tagDate + '</span>' +
                '               </span>' +
                '           </td>' +
                '           <td align="center" data-time-sorter="' + moment(value.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + '">' +
                '               <span class="info_dates_monitorado">' +
                '                   ' + moment(value.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss').format(format_display) +
                '               </span>' +
                '           </td>' +
                '           <td align="center" data-time-sorter="' + moment(value.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + '">' +
                '               <span class="info_dates_monitorado">' +
                '                   ' + moment(value.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format(format_display) +
                '               </span>' +
                '           </td>' +
                '           <td class="content_desc">' +
                '               <div>' +
                '                   <span class="info" style="font-weight: bold; display: inline-block; padding-top: 5px;">' + value.observacoes + '</span>' +
                '               </div>' +
                '           </td>' +
                '           <td align="right">' +
                (callAtiv('checkPermissionAfast',value, 'edit_afastamento') && (!integracao_interna || (integracao_interna && callAtiv('checkCapacidade','edit_afastamento_integrado') && editar_integracao_interna)) ?
                    '               <a class="newLink followLinkTr" data-act="atividades-call" data-fn="saveAfastamento" data-id="' + value.id_afastamento + '" data-tip="Editar afastamento"><i class="fas fa-pencil-alt" style="font-size: 100%;"></i></a>' +
                    '' : '') +
                (callAtiv('checkPermissionAfast',value, 'delete_afastamento') && (!integracao_interna || callAtiv('checkPerfilNivelAdm',)) ?
                    '               <a class="newLink followLinkTr" data-act="atividades-call" data-fn="removeAfastamento" data-id="' + value.id_afastamento + '" data-tip="Excluir afastamento"><i class="fas fa-trash" style="font-size: 100%;"></i></a>' +
                    '' : '') +
                '           </td>' +
                '       </tr>';
        });
        htmlTableAfastamentos += '   </tbody>' +
            '</table>';

        tabelaAfast.html(htmlTableAfastamentos);
        initPanelResize(afastID + '.tabelaPanelScroll', 'afastamentoTabelaPro');

        var afastTabela = $('#tableAfastamento');
        afastTabela.tablesorter({
            sortLocaleCompare: true,
            textExtraction: {
                3: function (elem, table, cellIndex) {
                    var text_date = $(elem).data('time-sorter');
                    return text_date;
                },
                4: function (elem, table, cellIndex) {
                    var text_date = $(elem).data('time-sorter');
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
            sortReset: true,
            headers: {
                0: { sorter: false, filter: false },
                1: { filter: true },
                2: { filter: true },
                3: { filter: true },
                4: { filter: true },
                5: { filter: true }
            }
        }).on("sortEnd", function (event, data) {
            checkboxRangerSelectShift();
        }).on("filterEnd", function (event, data) {
            checkboxRangerSelectShift();
            var caption = $(this).find("caption").eq(0);
            var tx = caption.text();
            caption.text(tx.replace(/\d+/g, data.filteredRows));
            $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
            $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
        });

        var filterAfast = afastTabela.find('.tablesorter-filter-row').get(0);
        if (typeof filterAfast !== 'undefined') {
            var observerFilterAfast = new MutationObserver(function (mutations) {
                var _this = $(mutations[0].target);
                var _parent = _this.closest('table');
                var iconFilter = _parent.find('.filterTablePro button');
                var checkIconFilter = iconFilter.hasClass('active');
                var hideme = _this.hasClass('hideme');
                if (hideme && checkIconFilter) {
                    iconFilter.removeClass('active');
                }
            });
            setTimeout(function () {
                var htmlFilterAfast = '<div class="btn-group filterTablePro" role="group" style="right: 55px;top: 52px;z-index: 99;position: absolute;">' +
                    '   <button type="button" data-act="atividades-call" data-fn="downloadTablePro" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">' +
                    '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
                    '       <span class="text">Baixar</span>' +
                    '   </button>' +
                    '   <button type="button" data-act="atividades-call" data-fn="copyTablePro" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">' +
                    '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
                    '       <span class="text">Copiar</span>' +
                    '   </button>' +
                    '   <button type="button" data-act="atividades-call" data-fn="filterTablePro" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light ' + (afastTabela.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active') + '">' +
                    '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
                    '       Pesquisar' +
                    '   </button>' +
                    '</div>';
                afastTabela.find('thead .filterTablePro').remove();
                afastTabela.find('thead').prepend(htmlFilterAfast);
                observerFilterAfast.observe(filterAfast, {
                    attributes: true
                });
            }, 500);
            $.getScript(URL_SPRO + "js/lib/jquery-visible.min.js");
        }

        var observerTableAfast = new MutationObserver(function (mutations) {
            var _this = $(mutations[0].target);
            var _parent = _this.closest('table');
            var count = _parent.find('tr.infraTrMarcada').length;
            if (count > 0) {
                $('#afastamentosProActions').find('.iconAfastamento_remove').show().find('.fa-layers-counter').text(count);
            } else {
                $('#afastamentosProActions').find('.iconAfastamento_remove').hide();
            }
        });
        setTimeout(function () {
            afastTabela.find('tbody tr').each(function () {
                observerTableAfast.observe(this, {
                    attributes: true
                });
            });
            checkboxRangerSelectShift();
        }, 500);

        var tagName = getOptionsPro('filterTag_afastamentos');
        if (typeof tagName !== 'undefined' && tagName != '') {
            setTimeout(function () {
                $('.tableAfastamentos .tagTableText_' + tagName).eq(0).trigger('click');
            }, 500);
        }
    }
}
export function getTableContatoPanel() {
    var dataContato = sessionStorageRestorePro('configDataContatosArray');
    if (dataContato !== null) {
        setTableContatoPanel(dataContato);
    } else {
        var action = 'view_contato';
        var param = {
            action: action
        };
        getServerAtividades(param, action);
        $('#tableContatoPanel').show().find('.dataFallback').addClass('dataLoading');
    }
}
export function toggleContatos(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.contatoPanelPro')
    var id_unidade = _this.data('unidade');
    if (_this.find('i').hasClass('fa-angle-down')) {
        _parent.find('.unidade.dependencia_' + id_unidade).slideUp('slow');
        _parent.find('.contatos.dependencia_' + id_unidade).slideUp('slow');
        _parent.find('.contatos.subordinada_' + id_unidade).slideUp('slow');
        _parent.find('.unidade.subordinada_' + id_unidade).slideUp('slow').find('a.toggle i').attr('class', 'fas fa-angle-right cinzaColor');
        _this.find('i').attr('class', 'fas fa-angle-right cinzaColor');
    } else {
        _parent.find('.unidade.dependencia_' + id_unidade).slideDown('slow');
        _parent.find('.contatos.dependencia_' + id_unidade).slideDown('slow').find('a.toggle i').attr('class', 'fas fa-angle-right cinzaColor');
        _this.find('i').attr('class', 'fas fa-angle-down cinzaColor');
    }
}
export function setTableContatoPanel(data) {
    var contatoID = '#tableContatoPanel';
    var tabelaContato = $(contatoID);
    tabelaContato.show();
    var listContatos = data.contatos;
    var listUnidades = data.unidades;
    var listUsuarios = data.usuarios_sem_plano;
    var htmlList = '';

    function getSubordinacao(arrayU, loop = 8, class_dependencia = '') {
        var mapU = false;
        if (typeof arrayU !== 'undefined' && arrayU !== null && arrayU.length > 0) {
            mapU = $.map(arrayU, function (v) {
                var contatos = jmespath.search(listContatos, "[?id_unidade==`" + v.id_unidade + "`]");
                contatos = (contatos !== null) ? contatos : false;
                var usuarios_sp = jmespath.search(listUsuarios, "[?id_unidade==`" + v.id_unidade + "`]");
                usuarios_sp = (usuarios_sp !== null) ? usuarios_sp : false;
                contatos = (usuarios_sp) ? contatos.concat(usuarios_sp) : contatos;
                contatos = (contatos) ? contatos.sort((a, b) => a.nivel - b.nivel) : contatos;

                var separator = '<span class="separator"></span>';
                var repeat = 8 - loop;
                var subordinacao = false;
                var htmlContatos = (contatos)
                    ? $.map(contatos, function (c) {
                        var horario_util = c.horario_util ? ' (' + c.horario_util.inicio + ' \u00E0s ' + c.horario_util.fim + ')' : '';
                        var aniversario = c.aniversario ? '<a class="newLink"><i class="fas fa-birthday-cake cianoColor"></i>' + c.aniversario + '</a>' : '';
                        var tel_celular = c.tel_celular ? '<a href="https://api.whatsapp.com/send?phone=' + c.tel_celular.replace(/\D+/ig, '') + '" target="_blank" class="newLink" data-tip="Clique para abrir chat no Whatsapp"><i class="fab fa-whatsapp verdeColor"></i>  ' + c.tel_celular + '</a> ' : c.tel_residencial;
                        var email = c.email ? '<a href="https://teams.microsoft.com/l/chat/0/0?users=' + c.email + '" target="_blank" class="newLink" data-tip="Clique para abrir chat no Microsoft Teams"><i class="fas fa-user-friends roxoColor"></i>  ' + c.email + '</a> ' : '';
                        var modalidade = (c.nome_modalidade) ? '<a class="newLink"><i class="fas fa-handshake cinzaColor"></i>' + c.nome_modalidade + horario_util + '</a>' : '';
                        return '<span class="contato">' +
                            '   <span class="nome">' + c.nome_completo + '</span>' +
                            '   <span class="modalidade">' + modalidade + '</span>' +
                            '   <span class="motivo_afastamento">' + (c.motivo_afastamento ? '<a class="newLink"><i class="fas fa-luggage-cart vermelhoColor"></i>' + c.motivo_afastamento + '</a>' : '') + '</span>' +
                            '   <span class="email">' + (email ? email : '') + '</span>' +
                            '   <span class="aniversario">' + (aniversario ? aniversario : '') + '</span>' +
                            '   <span class="celular">' + (tel_celular ? tel_celular : '') + '</span>' +
                            '</span>'
                    }).join('')
                    : '';

                var arraySubordinacao = jmespath.search(listUnidades, "[?dependencia==`" + v.id_unidade + "`].{id_unidade: id_unidade, nome_unidade: nome_unidade, sigla_unidade: sigla_unidade, dependencia: dependencia}");
                arraySubordinacao = (arraySubordinacao !== null) ? arraySubordinacao : false;

                htmlList += '<div class="unidade dependencia_' + v.dependencia + ' ' + class_dependencia + '" data-unidade="' + v.id_unidade + '" data-count="' + (contatos && contatos.length > 0 ? contatos.length : 0) + '" style="' + (v.dependencia != 0 ? 'display:none;' : '') + '">' +
                    (separator.repeat(repeat)) + v.nome_unidade + ' (' + v.sigla_unidade + ') ' + ((arraySubordinacao && arraySubordinacao.length > 0) || (contatos && contatos.length > 0)
                        ? (contatos && contatos.length > 0 ? '<span class="count">' + contatos.length + '</span>' : '<span class="count" style="display:none;"></span>') +
                        '<a data-act="atividades-call" data-fn="toggleContatos" class="newLink toggle" data-unidade="' + v.id_unidade + '"><i class="fas fa-angle-right cinzaColor"></i></a>'
                        : '');
                htmlList += (contatos && contatos.length > 0) ? '<div class="contatos dependencia_' + v.id_unidade + ' ' + class_dependencia + ' separator_' + repeat + '">' + htmlContatos + '</div>' : '';
                htmlList += '</div>';


                if (loop > 0 && arraySubordinacao) {
                    subordinacao = getSubordinacao(arraySubordinacao, loop - 1, class_dependencia + ' subordinada_' + v.id_unidade);
                }

                return { id: v.id_unidade, contatos: contatos, nome_unidade: v.nome_unidade, sigla_unidade: v.sigla_unidade, arraySubordinacao: arraySubordinacao, subordinacao: subordinacao };
            });
        }
        return mapU;
    }

    var htmlSearch = '<div style="text-align: right; margin: 9px; padding: 10px;">' +
        '   <input class="iconSearch" data-act="atividades-call" data-fn="searchContatos" data-on="keyup" style="padding: 10px; width: 20%; min-width: 200px;" placeholder="Pesquisar um contato" name="searchContato">' +
        '</div>';

    var unidades_super = jmespath.search(listUnidades, "[?dependencia==`0`]");
    var arrayHierarquia = getSubordinacao(unidades_super);
    $('#tableContatoPanel').html(htmlSearch + htmlList);
    updateCountContatos();
}
export function searchContatos(this_) {
    var _this = $(this_);
    var value = _this.val();
    value = typeof value !== 'undefined' ? removeAcentos(value).toLowerCase() : '';
    if (value == '') {
        $('#tableContatoPanel').find('.contatos, .unidade').hide();
        $('#tableContatoPanel').find('.dependencia_0, .contato').show().find('a.newLink.toggle i').attr('class', 'fas fa-angle-right cinzaColor');
    } else {
        $('#tableContatoPanel').find('.contatos, .unidade').hide();
        $('#tableContatoPanel').find('.contato').hide().each(function () {
            var text = $(this).text();
            if (removeAcentos(text).toLowerCase().indexOf(value) !== -1) {
                var subordinada = $(this).closest('.unidade').attr('class');
                subordinada = typeof subordinada !== 'undefined' ? subordinada.split(' ').filter(function (v) { return v.indexOf('subordinada') !== -1 }) : false;
                $(this).show().closest('.contatos').show().closest('.unidade').show();
                if (subordinada && subordinada.length) {
                    $.each(subordinada, function (i, v) {
                        var unidade = v.replace('subordinada_', '');
                        $('.unidade[data-unidade="' + unidade + '"]').show();
                    });
                }
            }
        });
    }
}
export function updateCountContatos() {
    $('.contatoPanelPro .unidade').each(function () {
        var id_unidade = $(this).data('unidade')
        var count_u = $('.unidade.subordinada_' + id_unidade).map(function () {
            return $(this).data('count')
        }).get().reduce(function (a, b) { return a + b; }, 0);

        var count_d = $('.contatos.dependencia_' + id_unidade).map(function () {
            return $(this).find('.contato').length
        }).get().reduce(function (a, b) { return a + b; }, 0);

        var count = count_u + count_d;

        $(this).attr('data-count', count).find('.count').text(count).show();
    });
}
export function initGanttAfastamento(bar_class = false, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof Gantt !== 'undefined') {
        getGanttAfastamento(bar_class);
    } else {
        if (typeof Gantt === 'undefined' && typeof URL_SPRO !== 'undefined' && TimeOut == 9000) {
            if (typeof loadStylePro === 'function') loadStylePro(URL_SPRO + 'css/frappe-gantt.css');
            $.getScript(URL_SPRO + "js/lib/frappe-gantt.js");
        }
        setTimeout(function () {
            initGanttAfastamento(bar_class, TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initGanttAfastamento');
        }, 500);
    }
}
export function getGanttAfastamento(bar_class = false) {
    var task = [];
    var dataFall = '';
    $('#ganttAfastamentoPanel').show();
    var listAfastamentos = arrayConfigAtividades.afastamentos.lista;
    if (typeof listAfastamentos !== 'undefined' && listAfastamentos.length > 0 && listAfastamentos != 0) {
        listAfastamentos = jmespath.search(listAfastamentos, "reverse(@)");
        var viewModeGantt = (getOptionsPro('ganttAfastamentoView')) ? getOptionsPro('ganttAfastamentoView') : 'Month';
        $.each(listAfastamentos, function (index, value) {
            var inicio_afastamento = moment(value.inicio_afastamento, "YYYY-MM-DD HH:mm:ss");
            var fim_afastamento = moment(value.fim_afastamento, "YYYY-MM-DD HH:mm:ss");
            var customClass = (moment() > fim_afastamento) ? 'bar-concluido-noprazo' : 'bar-em-execucao';
            customClass = (moment() <= fim_afastamento && moment() >= inicio_afastamento) ? 'bar-iniciado' : customClass;
            // customClass = ( fim_afastamento < moment() ) ? 'bar-nao-iniciado' : customClass;
            var addClass = (customClass == 'bar-iniciado' || customClass == 'bar-em-execucao') ? ' bar-ativos' : '';
            var taskClass = customClass + addClass;
            var assunto = value.apelido + ': ' + value.nome_motivo;
            var taskAfastamentos = {
                id: value.id_afastamento.toString(),
                name: assunto,
                start: inicio_afastamento.format("YYYY-MM-DD"),
                end: fim_afastamento.format("YYYY-MM-DD"),
                progress: (customClass == 'bar-concluido-noprazo') ? 100
                    : (customClass == 'bar-iniciado')
                        ? ganttAutoProgressPercent(inicio_afastamento, fim_afastamento) : 0,
                dependencies: '',
                custom_class: withSeiproBarClasses(taskClass)
            };
            if (!bar_class || (bar_class && taskClass.indexOf(bar_class) !== -1)) {
                task.push(taskAfastamentos);
            }
        });
        $('#ganttAfastamentoPanel').html('');
        if (task.length > 0) {
            var gantt = new Gantt("#ganttAfastamentoPanel", task, {
                header_height: 50,
                column_width: 10,
                step: 24,
                                language: 'ptBr',
                view_modes: ['Day', 'Week', 'Month'],
                bar_height: 15,
                bar_corner_radius: 3,
                arrow_curve: 5,
                padding: 18,
                edit_task: false,
                view_mode: viewModeGantt,
                date_format: 'YYYY-MM-DD',
                custom_popup_html: function (task) {
                    var value = jmespath.search(arrayConfigAtividades.afastamentos.lista, "[?id_afastamento==`" + task.id + "`] | [0]");
                    var optionSelectMotivo = $.map(arrayConfigAtividades.afastamentos.tipos_motivos, function (v) {
                        var selected = (value && v.id_tipo_motivo == value.id_tipo_motivo) ? 'selected' : '';
                        return "<option value='" + v.id_tipo_motivo + "' " + selected + " data-config='" + JSON.stringify(v.config) + "'>" + v.nome_motivo + "</option>";
                    }).join('');
                    var optionSelectUser = $.map(arrayConfigAtividades.usuarios, function (v) { if (v.id_user == value.id_user) { return '<option value="' + v.id_user + '" selected>' + v.apelido + '</option>' } else { return '<option value="' + v.id_user + '">' + v.apelido + '</option>' } }).join('');
                    var horas_afastamento = jmespath.search(arrayConfigAtividades.afastamentos.tipos_motivos, "[?id_tipo_motivo==`" + value.id_tipo_motivo + "`] | [0].config.horas_afastamento");
                    horas_afastamento = (horas_afastamento) ? true : false;
                    var integracao_interna = jmespath.search(arrayConfigAtividades.afastamentos.tipos_motivos, "[?id_tipo_motivo==`" + value.id_tipo_motivo + "`] | [0].config.integracao_interna");
                    integracao_interna = (integracao_interna) ? true : false;
                    var format_sys = (horas_afastamento) ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
                    var dia_inteiro = (moment(value.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') == '00:00:00' && (moment(value.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') == '23:59:59' || moment(value.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') == '00:00:00')) ? true : false;
                    var format_display = (!dia_inteiro) ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';
                    var type_input = (horas_afastamento) ? 'datetime-local' : 'date';
                    var editar_integracao_interna = jmespath.search(arrayConfigAtividades.afastamentos.tipos_motivos, "[?id_tipo_motivo==`" + value.id_tipo_motivo + "`] | [0].config.editar_integracao_interna");
                    editar_integracao_interna = (editar_integracao_interna) ? true : false;

                    var html = '<div class="details-container seiProForm">' +
                        '   <table class="tableInfo tableLine">' +
                        '      <tr>' +
                        '           <td colspan="2" class="td_view">' +
                        '               <h5><i class="iconPopup fas fa-luggage-cart cinzaColor"></i> ' +
                        '                   <span class="boxInfo" style="font-size: 11pt;font-weight: bold;width: 85%;display: inline-block;">' + value.nome_completo + ': ' + value.nome_motivo + '</span>' +
                        '                   <input type="hidden" data-type="id" value="' + value.id_afastamento + '" name="id_afastamento">' +
                        '                   <a style="float: right; margin: -4px -4px 0 0; padding: 5px;" data-act="atividades-gantt-hide-popup" data-gantt="ganttAfastamentos"><i class="far fa-times-circle cinzaColor"></i></a>' +
                        '               </h5>' +
                        '           </td>' +
                        '          <td class="td_edit" style="display:none; vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-user-circle cinzaColor"></i>Usu\u00E1rio:</td>' +
                        '          <td class="td_edit required" style="display:none">' +
                        '               <select data-act="atividades-call" data-fn="changeDatesAfast" data-type="user" class="data_extract" style="font-size: 1em; width: 86%;" data-key="id_user" name="id_user" required>' + optionSelectUser + '</select>' +
                        '               <a style="float: right; margin: -4px -4px 0 0; padding: 5px;" data-act="atividades-gantt-hide-popup" data-gantt="ganttAfastamentos"><i class="far fa-times-circle cinzaColor"></i></a>' +
                        '          </td>' +
                        '      </tr>' +
                        '      <tr style="height: 40px;">' +
                        '          <td style="vertical-align: bottom; width: 180px;"><i class="iconPopup iconSwitch fas fa-stopwatch cinzaColor"></i>In\u00EDcio do Afastamento:</td>' +
                        '          <td class="td_view">' + moment(value.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss').format(format_display) + '</td>' +
                        '          <td class="td_edit required date" style="display:none">' +
                        '               <input data-act="atividades-call" data-fn="changeDatesAfast" id="afast_inicio_afastamento" data-name="data de in\u00EDcio do afastamento" class="data_extract" style="font-size: 1em; width: 80%;" type="' + type_input + '" data-type="inicio" data-key="inicio_afastamento" value="' + moment(value.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss').format(format_sys) + '" required>' +
                        '          </td>' +
                        '      </tr>' +
                        '      <tr style="height: 40px;">' +
                        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-history cinzaColor"></i>Fim do Afastamento:</td>' +
                        '          <td class="td_view">' + moment(value.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format(format_display) + '</td>' +
                        '          <td class="td_edit required date" style="display:none">' +
                        '               <input data-act="atividades-call" data-fn="changeDatesAfast" id="afast_fim_afastamento" data-name="data final do afastamento" class="data_extract" style="font-size: 1em; width: 80%;" data-type="fim" type="' + type_input + '" data-key="fim_afastamento" value="' + moment(value.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format(format_sys) + '" required>' +
                        '          </td>' +
                        '      </tr>' +
                        '      <tr style="height: 40px;">' +
                        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-business-time cinzaColor"></i>Motivo do Afastamento:</td>' +
                        '          <td class="td_view">' + value.nome_motivo + '</td>' +
                        '          <td class="td_edit required" style="display:none">' +
                        '               <select class="data_extract" data-act="atividades-call" data-fn="changeInputAfast" style="font-size: 1em; width: 86%;" data-key="id_tipo_motivo" name="id_tipo_motivo" required>' + optionSelectMotivo + '</select>' +
                        '          </td>' +
                        '      </tr>' +
                        '      <tr style="height: 40px;">' +
                        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-comment-alt cinzaColor"></i>' + __.Observacoes + ':</td>' +
                        '          <td class="td_view">' + value.observacoes + '</td>' +
                        '          <td class="td_edit" style="display:none">' +
                        '               <textarea class="data_extract" style="font-size: 1em; width: 80%;" data-key="observacoes" name="observacoes">' + value.observacoes + '</textarea>' +
                        '          </td>' +
                        '      </tr>' +
                        '      <tr class="trCinza">' +
                        '           <td class="td_view" style="vertical-align: middle; padding: 0 10px;" colspan="2">' +
                        '               <p>' +
                        '                   <span class="boxInfo">' +
                        (callAtiv('checkPermissionAfast',value, 'delete_afastamento') && (!integracao_interna || callAtiv('checkPerfilNivelAdm',)) ?
                            '                       <a class="ui-button ui-corner-all ui-widget" style="color: #2b2b2b; text-decoration: none; float: left;" data-act="atividades-call" data-fn="removeAfastamento" data-id="' + value.id_afastamento + '">' +
                            '                           <i style="margin-right: 3px; color: #e46e64;" class="fas fa-trash"></i>' +
                            '                           Excluir' +
                            '                       </a>' +
                            '' : '') +
                        (callAtiv('checkPermissionAfast',value, 'edit_afastamento') && (!integracao_interna || (integracao_interna && callAtiv('checkCapacidade','edit_afastamento_integrado') && editar_integracao_interna)) ?
                            '                       <a class="ui-button ui-corner-all ui-widget" style="color: #2b2b2b; text-decoration: none; float: right;" data-act="atividades-call" data-fn="editAfastamento">' +
                            '                           <i style="margin-right: 3px; color: #8a8a8a;" class="fas fa-pencil-alt"></i>' +
                            '                           Editar' +
                            '                       </a>' +
                            '' : '') +
                        '                   </span>' +
                        '               </p>' +
                        '           </td>' +
                        '           <td class="td_edit" style="vertical-align: middle; padding: 0 10px; display:none" colspan="2">' +
                        '               <p>' +
                        '                   <span class="boxInfo">' +
                        '                       <a class="ui-button ui-corner-all ui-widget" style="color: #2b2b2b; text-decoration: none; float: left;" data-act="atividades-call" data-fn="editAfastamento" data-id="-1">' +
                        '                           <i style="margin-right: 3px; color: #8a8a8a;" class="fas fa-times"></i>' +
                        '                           Cancelar' +
                        '                       </a>' +
                        (callAtiv('checkCapacidade','edit_afastamento') && (!integracao_interna || (integracao_interna && callAtiv('checkCapacidade','edit_afastamento_integrado') && editar_integracao_interna)) ?
                            '                       <a class="ui-button ui-corner-all ui-widget confirm" style="color: #2b2b2b; text-decoration: none; float: right;" data-act="atividades-call" data-fn="editAfastamento" data-id="' + value.id_afastamento + '">' +
                            '                           <i style="margin-right: 3px; color: #8a8a8a;" class="fas fa-save"></i>' +
                            '                           Salvar' +
                            '' : '') +
                        '                       </a>' +
                        '                   </span>' +
                        '               </p>' +
                        '           </td>' +
                        '      </tr>' +
                        '   </table>' +
                        '</div>';
                    return html;
                },
                on_click: function (task) {
                }
            });
            ganttAfastamentos = gantt;
            if (!getOptionsPro('panelHeight_afastamentosGanttPro') && $('#ganttAfastamentoPanel').height() > 800) { setOptionsPro('panelHeight_afastamentosGanttPro', 800) }
            $('.gantt-container').addClass('tabelaPanelScroll');
            initPanelResize('.gantt-container', 'ganttAfastamentoPanelPro');
        } else {
            dataFall = '<div class="gantt-container dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div>';
        }

        var btnGroupView = '<div style="position: absolute; right: 0; z-index: 99;">' +
            '   <div class="btn-group" role="group" style="float: right;">' +
            '       <button type="button" data-value="Day" class="btn btn-sm btn-light ' + (getOptionsPro('ganttAfastamentoView') == 'Day' ? 'active' : '') + '">Dia</button>' +
            '       <button type="button" data-value="Week" class="btn btn-sm btn-light ' + (getOptionsPro('ganttAfastamentoView') == 'Week' ? 'active' : '') + '">Semana</button>' +
            '       <button type="button" data-value="Month" class="btn btn-sm btn-light ' + (getOptionsPro('ganttAfastamentoView') == 'Month' || !getOptionsPro('ganttAfastamentoView') ? 'active' : '') + '">M\u00EAs</button>' +
            '   </div>' +
            '</div>';


        var legendFilter = '<div class="filterGanttTag">' +
            '   ' + callAtiv('getFilterGanttTag',ganttAfastamentos, 'bar-ativos', 'Ativo', bar_class, 'afastamento') +
            '   ' + callAtiv('getFilterGanttTag',ganttAfastamentos, 'bar-em-execucao', 'Planejado', bar_class, 'afastamento') +
            '   ' + callAtiv('getFilterGanttTag',ganttAfastamentos, 'bar-iniciado', 'Em curso', bar_class, 'afastamento') +
            '   ' + callAtiv('getFilterGanttTag',ganttAfastamentos, 'bar-concluido-noprazo', 'Conclu\u00EDdo', bar_class, 'afastamento') +
            '</div>';
        $('#ganttAfastamentoPanel').css('max-width', ($('#atividadesProDiv').width() - 20)).prepend(legendFilter + btnGroupView + dataFall);

        if (ganttAfastamentos && ganttAfastamentos.bars.length > 0) {
            var scrollLeft = ganttAfastamentos.bars[0].x - 20;
            var windowDiv = $('#ganttAfastamentoPanel').find('.gantt-container');
            windowDiv.animate({ scrollLeft: scrollLeft }, 500);

            var popupAfast = $('#ganttAfastamentoPanel').find('.popup-wrapper');
            if (popupAfast.length > 0) {
                var observerPopupAfast = new MutationObserver(function (mutations) {
                    var _this = $(mutations[0].target);
                    var _parent = _this.closest('.gantt-container');
                    if (_this.is(':visible')) {
                        _parent.attr('style', function (i, s) { return (s || '') + 'position: relative !important;' });
                        _parent.find('.ui-resizable-handle').hide();
                    } else {
                        _parent.attr('style', function (i, s) { return (s || '') + 'position: initial !important;' });
                        _parent.find('.ui-resizable-handle').show();
                    }
                });
                observerPopupAfast.observe(popupAfast.get(0), {
                    attributes: true
                });
            }
        }
        $("#ganttAfastamentoPanel .btn-group").on("click", "button", function () {
            $btn = $(this);
            var mode = $btn.data('value');
            $btn.parent().find('button').removeClass('active');
            $btn.addClass('active');
            ganttAfastamentos.change_view_mode(mode);
            setOptionsPro('ganttAfastamentoView', mode);
        });
    }
}
export function getOptionSelectMotivo(this_, id_afastamento) {
    var value = (id_afastamento != 0) ? jmespath.search(arrayConfigAtividades.afastamentos.lista, "[?id_afastamento==`" + id_afastamento + "`] | [0]") : false;
    var _this = $(this_);
    var _parent = _this.closest('.dialogBoxDiv');
    var _select = (!!_parent && _parent.find('select[data-key="id_tipo_motivo"]').length) ? _parent.find('select[data-key="id_tipo_motivo"]') : false;
    var _select_user = (!!_parent && _parent.find('select[data-key="id_tipo_motivo"]').length) ? _parent.find('select[data-key="id_user"]') : false;
    var integracao_interna_manual = (!!_select_user && _select_user.length) ? jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + _select_user.val() + "`] | [0].id_tipo_modalidade") : null;
    integracao_interna_manual = (integracao_interna_manual !== null) ? jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?id_tipo_modalidade==`" + integracao_interna_manual + "`] | [0].config.integracao_interna_manual") : null;
    integracao_interna_manual = (integracao_interna_manual !== null) ? integracao_interna_manual : false;

    var optionSelectMotivo = $.map(arrayConfigAtividades.afastamentos.tipos_motivos, function (v) {
        var selected = (value && v.id_tipo_motivo == value.id_tipo_motivo) ? 'selected' : '';
        selected = (!!_select && _select.val() == v.id_tipo_motivo) ? 'selected' : selected;
        var integracao_interna = (typeof v.config !== 'undefined' && v.config !== null && v.config.hasOwnProperty('integracao_interna') && v.config.integracao_interna) ? true : false;
        integracao_interna = (!!_select_user && integracao_interna_manual) ? false : integracao_interna;
        var editar_integracao_interna = (typeof v.config !== 'undefined' && v.config !== null && v.config.hasOwnProperty('editar_integracao_interna') && v.config.editar_integracao_interna) ? true : false;
        return (integracao_interna && !callAtiv('checkCapacidade','edit_afastamento_integrado') && !editar_integracao_interna)
            ? ""
            : (!integracao_interna || (id_afastamento != 0 && callAtiv('checkCapacidade','edit_afastamento_integrado') && editar_integracao_interna))
                ? "<option value='" + v.id_tipo_motivo + "' " + selected + " data-config='" + JSON.stringify(v.config) + "'>" + v.nome_motivo + "</option>"
                : "";
    }).join('');
    return optionSelectMotivo;
}
export function updateOptionSelectMotivo(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.dialogBoxDiv');
    var id_afastamento = _parent.find('input[data-key="id_afastamento"]').val();
    var optionSelectMotivo = getOptionSelectMotivo(this_, id_afastamento);
    _parent.find('select[data-key="id_tipo_motivo"]').html(optionSelectMotivo).chosen("destroy").chosen({
        placeholder_text_single: ' ',
        no_results_text: 'Nenhum resultado encontrado',
        normalize_search_text: function (text) {
            return removeAcentos(text.toLowerCase());
        }
    });
}
export function saveAfastamento(this_, id_afastamento = 0) {
    var _this = $(this_);
    var value = (id_afastamento != 0) ? jmespath.search(arrayConfigAtividades.afastamentos.lista, "[?id_afastamento==`" + id_afastamento + "`] | [0]") : false;
    var optionSelectUser = (callAtiv('checkCapacidade','only_self_afastamentos'))
        ? '<option value="' + arrayConfigAtividades.perfil.id_user + '" selected>' + arrayConfigAtividades.perfil.apelido + '</option>'
        : $.map(arrayConfigAtividades.usuarios, function (v) { if (value && v.id_user == value.id_user) { return '<option value="' + v.id_user + '" selected>' + v.apelido + '</option>' } else { return '<option value="' + v.id_user + '">' + v.apelido + '</option>' } }).join('');
    var optionSelectMotivo = getOptionSelectMotivo(this_, id_afastamento);
    var tipo_motivo = (value) ? jmespath.search(arrayConfigAtividades.afastamentos.tipos_motivos, "[?id_tipo_motivo==`" + value.id_tipo_motivo + "`] | [0]") : null;
    tipo_motivo = (tipo_motivo !== null) ? tipo_motivo : false;
    var horas_afastamento = (value && tipo_motivo && typeof tipo_motivo.config !== 'undefined' && tipo_motivo.config && tipo_motivo.config.hasOwnProperty('horas_afastamento') && tipo_motivo.config.horas_afastamento !== null && tipo_motivo.config.horas_afastamento) ? true : false;
    var exige_documentacao = (value && tipo_motivo && typeof tipo_motivo.config !== 'undefined' && tipo_motivo.config && tipo_motivo.config.hasOwnProperty('exige_documentacao') && tipo_motivo.config.exige_documentacao !== null && tipo_motivo.config.exige_documentacao) ? true : false;
    var exige_documentacao = (value && tipo_motivo && typeof tipo_motivo.config !== 'undefined' && tipo_motivo.config && tipo_motivo.config.hasOwnProperty('exige_documentacao') && tipo_motivo.config.exige_documentacao !== null && tipo_motivo.config.exige_documentacao) ? true : false;
    var format_sys = (horas_afastamento) ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
    var format_display = (horas_afastamento) ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';
    var type_input = (horas_afastamento) ? 'datetime-local' : 'date';
    var htmlDocs = '';

    var documentos = (typeof value.config !== 'undefined' && value.config !== null && typeof value.config.documentos !== 'undefined' && value.config !== null) ? value.config.documentos : false;
    var documentos_len = (documentos) ? documentos.length : 0;
    if (documentos && exige_documentacao) {
        $.each(value.config.documentos, function (i, v) {
            var previewDoc = '<a class="newLink" style="cursor: pointer;" ' + atividadesDialogDocAttrs({
                title: unicodeToChar(v.documento) + ' (' + v.nr_sei + ')',
                id_procedimento: v.id_procedimento,
                id_documento: v.id_documento
            }) + ' data-tip="Visualiza\u00E7\u00E3o r\u00E1pida">' +
                '   <i class="fas fa-eye" style="font-size: 80%;"></i>' +
                '</a>';
            htmlDocs += '                        <tr data-index="' + i + '" data-key="documentos" data-value="' + i + '" data-id="' + i + '">' +
                '                            <td class="editCellSelect" data-key="documento" data-type="value" style="width: 350px; padding: 0 10px; text-align: left;">' + unicodeToChar(v.documento) + '</td>' +
                '                            <td class="editCellSEI" data-key="nr_sei" data-type="num" style="width: 175px;text-align: center;">' + v.nr_sei + '</td>' +
                '                            <td data-key="id_procedimento" data-type="num" style="text-align: left; display:none">' + v.id_procedimento + '</td>' +
                '                            <td data-key="id_documento" data-type="num" style="text-align: left; display:none">' + v.id_documento + '</td>' +
                '                            <td data-ref="previa" style="text-align: center; width: 50px;">' + previewDoc + '</td>' +
                '                            <td style="width: 80px; text-align: center;">' +
                '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
                '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
                '                           </td>' +
                '                        </tr>';
        });
    }

    var htmlBox = '<div id="boxAfastamento" class="atividadeWork seipro-atividades-work" data-demanda="' + (value && value.id_afastamento ? value.id_afastamento : 0) + '">' +
        '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
        '      <tr>' +
        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
        '               <label for="afast_id_user"><i class="iconPopup iconSwitch fas fa-user-circle cinzaColor"></i>Usu\u00E1rio:</label>' +
        '           </td>' +
        '           <td class="required date" style="width: 230px;">' +
        '               <select data-act="atividades-composite" data-chain="changeDatesAfast|updateOptionSelectMotivo" class="data_extract" style="font-size: 1em;" data-key="id_user" id="afast_id_user" data-type="user">' + optionSelectUser + '</select>' +
        '               <input type="hidden" class="data_extract" data-key="id_afastamento" data-type="id" value="' + (value && value.id_afastamento ? value.id_afastamento : 0) + '" name="id_afastamento">' +
        '           </td>' +
        '           <td style="vertical-align: bottom;" class="label">' +
        '               <label class="last" for="afast_id_tipo_motivo"><i class="iconPopup iconSwitch fas fa-luggage-cart cinzaColor" style="float: initial;"></i>Motivo do Afastamento:</label>' +
        '           </td>' +
        '           <td class="required">' +
        '               <select class="data_extract" data-act="atividades-call" data-fn="checkInputAfast" style="font-size: 1em;" data-key="id_tipo_motivo" id="afast_id_tipo_motivo" name="id_tipo_motivo">' + optionSelectMotivo + '</select>' +
        '           </td>' +
        '      </tr>' +
        '      <tr style="height: 20px;">' +
        '          <td colspan="3"></td>' +
        '          <td>' +
        '               <div class="onoffswitch" style="float: left;transform: scale(0.8);">' +
        '                   <input type="checkbox" data-key="afast_all_day" data-act="atividades-call" data-fn="changeInputAfast" name="onoffswitch" class="onoffswitch-checkbox" id="afast_all_day" tabindex="0" checked>' +
        '                   <label class="onoff-switch-label" for="afast_all_day"></label>' +
        '               </div>' +
        '               <label for="afast_all_day" style="float: left;display: inline-block;margin: 5px;">O dia inteiro</label>' +
        '          </td>' +
        '      </tr>' +
        '      <tr>' +
        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
        '               <label for="afast_inicio_afastamento"><i class="iconPopup iconSwitch fas fa-user-check cinzaColor"></i>In\u00EDcio do Afastamento:</label>' +
        '           </td>' +
        '           <td class="required date">' +
        '               <input type="' + type_input + '" data-act="atividades-call" data-fn="changeDatesAfast" data-key="inicio_afastamento" id="afast_inicio_afastamento" data-type="inicio" class="data_extract" data-name="data de in\u00EDcio do afastamento" value="' + (value && value.inicio_afastamento ? moment(value.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss').format(format_sys) : moment().format(format_sys)) + '" required>' +
        '           </td>' +
        '           <td style="vertical-align: bottom;" class="label">' +
        '               <label class="last" for="afast_fim_afastamento"><i class="iconPopup iconSwitch fas fa-user-clock cinzaColor" style="float: initial;"></i>Fim do Afastamento:</label>' +
        '           </td>' +
        '           <td class="required date">' +
        '               <input type="' + type_input + '" data-act="atividades-call" data-fn="changeDatesAfast" data-key="fim_afastamento" id="afast_fim_afastamento" data-type="fim" class="data_extract" data-name="data final do afastamento" value="' + (value && value.fim_afastamento ? moment(value.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format(format_sys) : moment().add(1, 'days').format(format_sys)) + '" required>' +
        '           </td>' +
        '      </tr>' +
        '      <tr style="height: 40px;' + (!exige_documentacao ? '' : 'display:none;') + '" class="afastBox_observacao">' +
        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-comment-alt cinzaColor"></i>' + __.Observacoes + ':</td>' +
        '          <td colspan="3" class="required"><textarea class="data_extract" style="font-size: 1em; width: 97%;" data-key="observacoes" name="observacoes" required>' + (value && value.observacoes ? value.observacoes : '') + '</textarea></td>' +
        '      </tr>' +
        '      <tr style="' + (exige_documentacao ? '' : 'display:none;') + '" class="afastBox_documentacao">' +
        '          <td style="vertical-align: middle; text-align: left;" class="label">' +
        '               <label><i class="iconPopup iconSwitch fas fa-file-signature cinzaColor"></i>Documentos Vinculados:</label>' +
        '           </td>' +
        '           <td colspan="3">' +
        '               <div class="tabelaPanelScroll">' +
        '               <table id="configBox_documentos" data-format="obj" data-key="documentos" style="font-size: 8pt !important;width: 100%;" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table">' +
        '                    <thead>' +
        '                       <tr>' +
        '                           <th colspan="6" style="text-align: right;">' +
        '                               <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
        '                                   <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
        '                                   Adicionar novo item' +
        '                               </a>' +
        '                           </th>' +
        '                       </tr>' +
        '                        <tr class="tableHeader">' +
        '                            <th class="tituloControle" style="width: 350px;">Tipo de Documento</th>' +
        '                            <th class="tituloControle" style="width: 175px;">N\u00FAmero SEI</th>' +
        '                            <th class="tituloControle" style="display:none">id_procedimento</th>' +
        '                            <th class="tituloControle" style="display:none">id_documento</th>' +
        '                            <th class="tituloControle" style="width: 50px;">Pr\u00E9via</th>' +
        '                            <th class="tituloControle" style="width: 80px;">Ordem</th>' +
        '                        </tr>' +
        '                    </thead>' +
        '                    <tbody>' +
        htmlDocs +
        '                        <tr data-index="' + documentos_len + '" data-key="documentos" data-value="' + documentos_len + '" data-id="' + documentos_len + '">' +
        '                            <td class="editCellSelect" data-key="documento" data-type="value" style="width: 350px; padding: 0 10px; text-align: left;"></td>' +
        '                            <td class="editCellSEI" data-key="nr_sei" data-type="num" style="width: 175px;text-align: center;"></td>' +
        '                            <td data-key="id_procedimento" data-type="num" style="text-align: left; display:none">0</td>' +
        '                            <td data-key="id_documento" data-type="num" style="text-align: left; display:none">0</td>' +
        '                            <td data-ref="previa" style="text-align: center; width: 50px;"></td>' +
        '                            <td style="width: 80px; text-align: center;">' +
        '                               <i class="fas fa-bars cinzaColor sorterTrConfig" style="cursor: grab;"></i>' +
        '                               <i class="fas fa-trash-alt cinzaColor removeTrConfig" style="cursor: pointer;float: right;margin-right: 10px;" data-act="atividades-call" data-fn="removeConfigRow"></i>' +
        '                           </td>' +
        '                        </tr>' +
        '                    </tbody>' +
        '                </table>' +
        '                </div>' +
        '           </td>' +
        '      </tr>' +
        '      <tr style="height: auto;">' +
        '          <td style="vertical-align: bottom; text-align: left;" class="label" colspan="4" id="infoBox_dateAfast">' +
        '               ' +
        '           </td>' +
        '      </tr>' +
        '   </table>' +
        '</div>';
    if (value && id_afastamento != 0) {
        if ($('#tableAfastamento tr.infraTrMarcada').length > 0) {
            $('#tableAfastamento').find('.lnkInfraCheck').data('index', 1).trigger('click');
        }
        _this.closest('tr').find('td').eq(0).find('input[type="checkbox"]').trigger('click');
    }

    if (callAtiv('checkCapacidade','save_afastamento')) {
        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: (value && id_afastamento != 0 ? 'Editar Afatamento: ' + value.apelido + ': ' + value.nome_motivo : 'Adicionar Afastamento'),
                width: 780,
                open: function () {
                    updateButtonConfirm(this, true);
                    callAtiv('prepareFieldsReplace',this);
                    if ($.isEmptyObject(arrayListTypesSEI)) getListTypesSEI();

                    configBox = new SimpleTableCellEditor('configBox_documentos');
                    configBox.SetEditableClass("editCellSEI", {
                        validation: $.isNumeric,
                        internals: {
                            renderEditor: (elem, oldVal) => {
                                $(elem).html('<input type="number" data-act="atividades-call" data-fn="checkOptionConfigSEI" style="max-width: 80%;" value="' + oldVal + '">').find('input').focus();
                            }
                        }
                    });
                    configBox.SetEditableClass("editCellSelect", {
                        internals: {
                            renderEditor: (elem, oldVal) => {
                                var _this = $(elem);
                                var data_elem = _this.data();
                                var data_tr = _this.closest('tr').data();
                                var arrayList = (data_tr.key == 'documentos') ? arrayListTypesSEI.selSeriePesquisa : [];
                                if (arrayList && arrayList.length > 0) {
                                    var selectArray = (data_tr.key == 'perfil')
                                        ? jmespath.search(arrayList, "[*].{label: name, value: value, nivel: nivel}")
                                        : jmespath.search(arrayList, "[*].{label: name, value: value}");
                                    selectArray = selectArray.filter((v, i, a) => a.findIndex(t => (t.value === v.value)) === i);
                                    var htmlOptions = $.map(selectArray, function (v) {
                                        var selected = (v.label == _this.text().trim()) ? 'selected' : '';
                                        var disable = (data_tr.key == 'perfil' && arrayConfigAtividades.perfil.nivel > v.nivel) ? 'disabled' : '';
                                        return '<option value="' + v.value + '" ' + selected + ' ' + disable + '>' + v.label + '</option>';
                                    }).join('');
                                }
                                _this.html(`<select data-type="documentos" data-act="atividades-call" data-fn="changeSelectConfigItem" data-on="blur"><option value=" "></option>` + htmlOptions + '</select>')
                                    .find('select')
                                    .chosen({
                                        placeholder_text_single: ' ',
                                        no_results_text: 'Nenhum resultado encontrado',
                                        normalize_search_text: function (text) {
                                            return removeAcentos(text.toLowerCase());
                                        }
                                    })
                                    .on('chosen:showing_dropdown', function (evt, params) {
                                        let elementScroll = $(this).closest('.tabelaPanelScroll');
                                        setTimeout(() => {
                                            scrollToElement(elementScroll, elementScroll.find('div.chosen-container'), elementScroll.find('.tableHeader').height());
                                        }, 500);
                                    });
                            },
                            renderValue: (elem, formattedNewVal) => {
                                $(elem).text(formattedNewVal);
                            },
                            extractEditorValue: (elem) => {
                                return $(elem).find('select').find('option:selected').text().trim();
                            },
                        }
                    });

                    $(".tableOptionConfig.tableSortable tbody").sortable({
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
                            })
                        }
                    });
                },
                close: function () {
                    if (_this.closest('tr').hasClass('infraTrMarcada')) {
                        $('#tableAfastamento').find('.lnkInfraCheck').data('index', 1).trigger('click');
                    }
                    $('#boxAfastamento').remove();
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: [{
                    text: (value && id_afastamento != 0 ? 'Editar' : 'Adicionar'),
                    class: 'confirm',
                    click: function (event) {
                        var _parent = $(this).closest('.ui-dialog');
                        var target = _parent.find('input[data-type="inicio"]').get(0);
                        if (checkDatesAfast(target) && callAtiv('checkAtivRequiredFields',target, 'mark') && callAtiv('checkAtivRequiredDocuments',target)) {
                            var param = extractDataAfast(_parent);
                            var action = (value && id_afastamento != 0 ? 'edit_afastamento' : 'save_afastamento');
                            param.action = action;
                            getServerAtividades(param, action);
                        }
                    }
                }]
            });
    }
}
export function checkDatesPlanoAfast(value, arrayAfastamentos = arrayConfigAtividades.afastamentos) {
    var config_unidade = callAtiv('getConfigDadosUnidade',value.sigla_unidade);
    var config_feriados = (typeof config_unidade.feriados !== 'undefined' && config_unidade.feriados !== null) ? jmespath.search(config_unidade.feriados, "[?!meio_periodo]") : false;
    var arrayFeriados = (config_unidade.count_dias_uteis && value.data_inicio_vigencia != '' && value.data_fim_vigencia != '')
        ? jmespath.search(getHolidayBetweenDates(moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('Y') + '-01-01', moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').add(1, 'Y').format('Y') + '-01-01', config_feriados), "[*].d_")
        : [];

    var config_feriados_meio_periodo = jmespath.search(callAtiv('getConfigDadosUnidade',).feriados, "[?meio_periodo]");
    var arrayFeriados_meioPeriodo = jmespath.search(getHolidayBetweenDates('2024-01-01', '2025-01-01', config_feriados_meio_periodo), "[?meio_periodo] | [*].d_");
    window.arrayFeriados_meioPeriodo = arrayFeriados_meioPeriodo;

    var carga_horaria_feriado = callAtiv('checkOptionEntidade','horas_meio_periodo') ? callAtiv('getOptionEntidade','horas_meio_periodo') : value.carga_horaria;
    carga_horaria_feriado = value.carga_horaria < carga_horaria_feriado ? value.carga_horaria : carga_horaria_feriado;
    window.carga_horaria_feriado = carga_horaria_feriado;

    var inicio = moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss');
    var fim = moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss');
    var valueDias = (config_unidade.count_dias_uteis)
        ? moment().isoWeekdayCalc({
            rangeStart: value.data_inicio_vigencia,
            rangeEnd: value.data_fim_vigencia,
            weekdays: [1, 2, 3, 4, 5],
            exclusions: arrayFeriados
        })
        : moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').diff(moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss'), 'days');
    valueDias = (valueDias < 0) ? 0 : valueDias;

    function getLoopDatesPlano(checkLoopDatesPlanoAfastLoop, carga_horaria, data_afast) {
        var result_ = 0;
        checkLoopDatesPlanoAfastLoop.forEach(function (id, index) {
            var afastResult = jmespath.search(arrayAfastamentos.lista, "[?id_afastamento==`" + id + "`] | [0]");
            var checkHorasAfastamento = (afastResult && afastResult !== null)
                ? jmespath.search(arrayAfastamentos.tipos_motivos, "[?id_tipo_motivo==`" + afastResult.id_tipo_motivo + "`] | [0].config.horas_afastamento") : false;
            var fatorMultiplicacao = (afastResult && afastResult !== null)
                ? jmespath.search(arrayAfastamentos.tipos_motivos, "[?id_tipo_motivo==`" + afastResult.id_tipo_motivo + "`] | [0].config.fator_multiplicacao") : 1;
            var horasAfastamento = (checkHorasAfastamento)
                ? moment(afastResult.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').diff(moment(afastResult.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss'), 'hours', true)
                : value.carga_horaria;
            horasAfastamento = (horasAfastamento > value.carga_horaria) ? value.carga_horaria : horasAfastamento;
            horasAfastamento = (isNumeric(fatorMultiplicacao) && fatorMultiplicacao > 0) ? horasAfastamento * fatorMultiplicacao : horasAfastamento;
            horasAfastamento = (isNumeric(fatorMultiplicacao) && fatorMultiplicacao == 0) ? 0 : horasAfastamento;
            horasAfastamento = window.arrayFeriados_meioPeriodo.indexOf(data_afast.format('YYYY-MM-DD')) !== -1 ? value.carga_horaria - carga_horaria_feriado : horasAfastamento;
            horasAfastamento = (result_ >= carga_horaria)
                ? 0
                : (result_ < carga_horaria && result_ + horasAfastamento >= carga_horaria) ? carga_horaria - result_ : horasAfastamento;
            result_ = result_ + horasAfastamento;

            // console.log({afastResult: afastResult, fatorMultiplicacao: fatorMultiplicacao, horasAfastamento: horasAfastamento});

            calcRelatorioMetaProporcional('afastamentos', { afastamento: afastResult, check_horas_afastamento: checkHorasAfastamento, horas_afastamento: horasAfastamento, data_afastamento: data_afast.format('DD/MM/YYYY') });
        });
        return result_;
    }

    var valueExclusion = 0;
    var horaExclusion = 0;

    var init_datesPlanoAfastLoop = checkDatesPlanoAfastLoop(inicio, value.id_user, arrayFeriados);
    if (init_datesPlanoAfastLoop && init_datesPlanoAfastLoop.length > 0) {
        var horaExclusion_init = getLoopDatesPlano(init_datesPlanoAfastLoop, value.carga_horaria, inicio);
        horaExclusion_init = (horaExclusion_init > value.carga_horaria) ? value.carga_horaria : horaExclusion_init;
        horaExclusion_init = arrayFeriados_meioPeriodo.indexOf(inicio.format('YYYY-MM-DD')) !== -1 ? value.carga_horaria - carga_horaria_feriado : horaExclusion_init;
        horaExclusion = (horaExclusion_init) ? horaExclusion + horaExclusion_init : horaExclusion;
        valueExclusion++
    }

    while (inicio.add(1, 'days').diff(fim) < 0) {
        var dt_inicio = inicio.clone();
        var loop_datesPlanoAfastLoop = checkDatesPlanoAfastLoop(dt_inicio, value.id_user, arrayFeriados);

        /* console.log({config_feriados_meio_periodo: config_feriados_meio_periodo, arrayFeriados_meioPeriodo: arrayFeriados_meioPeriodo,dt_inicio:dt_inicio.format('YYYY-MM-DD'), id_user:value.id_user, arrayFeriados:arrayFeriados, loop_datesPlanoAfastLoop:loop_datesPlanoAfastLoop}); */

        if (loop_datesPlanoAfastLoop && loop_datesPlanoAfastLoop.length > 0) {
            var horaExclusion_loop = getLoopDatesPlano(loop_datesPlanoAfastLoop, value.carga_horaria, dt_inicio);
            horaExclusion_loop = (horaExclusion_loop > value.carga_horaria) ? value.carga_horaria : horaExclusion_loop;
            horaExclusion_loop = arrayFeriados_meioPeriodo.indexOf(dt_inicio.format('YYYY-MM-DD')) !== -1 ? value.carga_horaria - carga_horaria_feriado : horaExclusion_loop;
            horaExclusion = (horaExclusion_loop) ? horaExclusion + horaExclusion_loop : horaExclusion;
            valueExclusion++;
            // console.log({check: arrayFeriados_meioPeriodo.indexOf(dt_inicio.format('YYYY-MM-DD')),dt_inicio: dt_inicio.format('YYYY-MM-DD'), arrayFeriados_meioPeriodo: arrayFeriados_meioPeriodo,carga_horaria: value.carga_horaria,carga_horaria_feriado: carga_horaria_feriado,horaExclusion_loop: horaExclusion_loop,horaExclusion: horaExclusion});
        }
    }

    value.tempo_total = typeof value.tempo_total === 'undefined' ? callAtiv('getWorkDaysBetweenDates',value.data_inicio_vigencia, value.data_fim_vigencia, value.sigla_unidade).dias * value.carga_horaria : value.tempo_total;

    /*
    var last_datesPlanoAfastLoop = checkDatesPlanoAfastLoop(fim, value.id_user, arrayFeriados);
    if (last_datesPlanoAfastLoop && last_datesPlanoAfastLoop.length > 0) { 
        var horaExclusion_last = getLoopDatesPlano(last_datesPlanoAfastLoop);
            horaExclusion_last = (horaExclusion_last > value.carga_horaria) ? value.carga_horaria : horaExclusion_last;
            horaExclusion = (horaExclusion_last) ? horaExclusion+horaExclusion_last : horaExclusion;
            valueExclusion++ 
    }
    console.log('horaExclusion_last', fim.format('DD/MM/YYYY'));
    */
    /* console.log({
        valueExclusion:valueExclusion,
        horaExclusion:horaExclusion,
        inicio:inicio.format('YYYY-MM-DD'),
        fim:fim.format('YYYY-MM-DD'),
        valueDias:valueDias,
        carga_horaria:value.carga_horaria,
        tempo_total:value.tempo_total,
        tempo_proporcional: value.tempo_total-horaExclusion,
        dias: getWorkDaysBetweenDates(value.data_inicio_vigencia, value.data_fim_vigencia, value.sigla_unidade)
    }); */

    // console.log({value: value, horaExclusion: horaExclusion, id_plano: value.id_plano, id_user: value.id_user, valueDias: valueDias, check: isNaN(parseFloat(valueDias)), valueExclusion: valueExclusion, carga_horaria: value.carga_horaria});

    var tempo_proporcional = value.tempo_total - horaExclusion;

    return {
        id_user: value.id_user,
        id_plano: value.id_plano,
        dias_afastamento: valueExclusion,
        dias_plano: valueDias,
        tempo_afastamento: horaExclusion,
        // tempo_afastamento: valueExclusion*value.carga_horaria,
        tempo_plano: valueDias * value.carga_horaria,
        dias_proporcional: (valueDias - valueExclusion),
        tempo_proporcional: tempo_proporcional
        // tempo_proporcional: (valueDias-valueExclusion)*value.carga_horaria
    };
}
export function checkDatesPlanoAfastLoop(dt_inicio, id_user, arrayFeriados) {
    var dt_inicio_format = dt_inicio.format('YYYY-MM-DD');
    // var check = checkDatesBetweenAfast(dt_inicio_format, id_user, 0, true);
    var array = jmespath.search(arrayConfigAtividades.afastamentos.lista, "[?id_user==`" + id_user + "`]");
    var check = callAtiv('checkDatesBetweenArray',array, dt_inicio_format, 0, 0, { inicio: 'inicio_afastamento', fim: 'fim_afastamento', id: 'id_user', idreftype: 'id_afastamento' }, true, true);

    // console.log({check: check, afastamentos: arrayConfigAtividades.afastamentos.lista, dt_inicio_format: dt_inicio_format, id_user: id_user, ref: 0, param: {inicio: 'inicio_afastamento', fim: 'fim_afastamento', id: 'id_user'}, exclude: true});

    if (check.length > 0 && dt_inicio.weekday() != 6 && dt_inicio.weekday() != 0 && arrayFeriados.indexOf(dt_inicio_format) === -1) {
        return check;
    } else {
        return false;
    }
}
export function getTitleChartPlano(id_plano) {
    var arrayPlano = jmespath.search(tableConfigList.planos, "[?id_plano==`" + id_plano + "`] | [0]");
    arrayPlano = arrayPlano === null ? jmespath.search(arrayConfigAtividades.planos, "[?id_plano==`" + id_plano + "`] | [0]") : arrayPlano;
    var titleDialog = arrayPlano === null ? '' : arrayPlano.apelido + ' - ' + arrayPlano.apelido_avaliacao_duracao[1];
    return arrayPlano === null ? false : { array: arrayPlano, title: titleDialog };
}
export function getDialogEntregasPlanos(this_) {
    var _this = $(this_);
    var _data = _this.data();
    var id_plano = _data.id;
    var planoList = getTitleChartPlano(id_plano);
    var titleDialog = planoList ? planoList.title : '';
    var value = callAtiv('getPlanoData',id_plano);
    var entregas = (typeof value.entregas !== 'undefined' && value.entregas !== null) ? value.entregas : false;
    if (value) {
        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html(`<div class="dialogBoxDiv">
                        <div id="entregasWork">
                        </div>
                    </div>`)
            .dialog({
                title: 'Entregas do Plano: ' + titleDialog,
                width: 1200,
                open: function () {
                    updateButtonConfirm(this, true);
                    var idConfigBox = 'boxConfiguracoes_planos';
                    var idConfigBoxTabMes = idConfigBox + '_tabs_mes';
                    var htmlTabEntregas = '<div id="' + idConfigBoxTabMes + '" style="border: none; min-height: 300px; margin: 0;">' +
                        '   <ul id="getTabEntregasPlanos" style="font-size: 10px;background: transparent;border: none;">' +
                        callAtiv('getTabEntregasPlanos',idConfigBox, value, entregas, true) +
                        '   </ul>' +
                        '</div>';
                    $('#entregasWork').append(htmlTabEntregas);
                    $('#' + idConfigBoxTabMes).tabs();
                    callAtiv('setFunctionsEditConfigOptions',idConfigBoxTabMes, { type: 'planos' });
                    setTimeout(function () {
                        centralizeDialogBox(dialogBoxPro);
                    }, 100);
                },
                close: function () {
                    $('#dialogBoxDiv').remove();
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: [{
                    text: 'Salvar',
                    class: 'confirm',
                    click: function (event) {
                        saveSelfEntregasPlanos(id_plano);
                    }
                }]
            });
    }
}
export function saveSelfEntregasPlanos(id_plano) {
    var action = 'config_update_self_planos_entregas';
    var entregas = $('.configBox_entregas_programa tbody tr').map(function (v) {
        let value = $(this).attr('data-value');
        let id_plano = $(this).attr('data-id_plano');
        let indice_mes_entrega = $(this).find('td').eq(1).text().trim();
        let carga_horaria = $(this).find('td').eq(3).text().trim();
        let id = $(this).attr('data-id');
        id = isNumeric(id) ? parseInt(id) : id;
        if (value == 'remove' || carga_horaria != '') {
            return { id: id, value: value, id_plano: parseInt(id_plano), indice_mes_entrega: parseInt(indice_mes_entrega), carga_horaria: parseInt(carga_horaria) }
        }
    }).get();
    var param = {
        action: action,
        id_plano: id_plano,
        id: id_plano,
        type: 'planos',
        entregas: entregas
    }
    getServerAtividades(param, action);
}
export function getChartProdutividadeMes(id_plano, mode = 'get', data, openDialog = true) {
    var planoList = getTitleChartPlano(id_plano);
    var titleDialog = planoList ? planoList.title : '';
    var arrayPlano = planoList ? planoList.array : [];

    var idElem = 'dataChartPlanos';
    if (callAtiv('checkCapacidade','chart_produtividade_mensal')) {
        if (mode == 'get') {
            var action = 'chart_produtividade_mensal';
            var param = {
                action: action,
                type: 'planos',
                id: id_plano,
                id_plano: id_plano
            };
            getServerAtividades(param, action);
            if (openDialog) {
                var htmlBox = '<div id="view_doc" class="reportWork">' +
                    '   <div id="' + idElem + '" class="dataFallback dataLoading" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div>' +
                    '</div>';

                resetDialogBoxPro('dialogBoxPro');
                dialogBoxPro = $('#dialogBoxPro')
                    .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
                    .dialog({
                        title: 'Relat\u00F3rio Geral do Plano: ' + titleDialog,
                        width: 1200,
                        open: function () {
                            var value = callAtiv('getPlanoData',id_plano);
                            var entregas = (value && typeof value.entregas !== 'undefined' && value.entregas !== null) ? value.entregas : false;
                            if (callAtiv('checkHomologacaoPreviaPlanos',value) && entregas) {
                                var idConfigBox = 'boxConfiguracoes_planos';
                                var htmlTabEntregas = '<div id="' + idConfigBox + '_tabs_mes" style="border: none; min-height: 300px; margin: 0;">' +
                                    '   <ul id="getTabEntregasPlanos" style="font-size: 10px;background: transparent;border: none;">' +
                                    callAtiv('getTabEntregasPlanos',idConfigBox, value, entregas, false) +
                                    '   </ul>' +
                                    '</div>';
                                $('#view_doc').append(htmlTabEntregas);
                                $('#' + idConfigBox + '_tabs_mes').tabs();
                            }
                        },
                        close: function () {
                            $('#dialogBoxDiv').remove();
                            resetDialogBoxPro('dialogBoxPro');
                        },
                        buttons: [{
                            text: 'Ok',
                            class: 'confirm',
                            click: function (event) {
                                $('#dialogBoxDiv').remove();
                                resetDialogBoxPro('dialogBoxPro');
                            }
                        }]
                    });
            }
        } else {
            var plano = data.result;
            var dias_af = [];

            if (data.status == 1 && plano.length > 0) {
                var height = 23 * (plano.length + 1);
                var elemChart = $('#' + idElem);
                elemChart.removeClass('dataLoading').removeClass('dataFallback');
                elemChart.html('<canvas id="' + idElem + '_canvas" width="380" height="' + height + '"></canvas><canvas id="' + idElem + '_produtividade_canvas" width="380" height="' + height + '"></canvas>');
                var element = $('#' + idElem + '_canvas');
                var arrayProgramado = $.map(plano, function (v) {
                    var vPlano = callAtiv('getPlanoData',v.id_plano);
                    var dataFim = moment(v.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment() && moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') <= moment() ? moment().format('YYYY-MM-DD HH:mm:ss') : v.data_fim_vigencia;
                    var dataInicio = vPlano && moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') < moment(vPlano.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') ? vPlano.data_inicio_vigencia : v.data_inicio_vigencia;
                    var dias_uteis = callAtiv('getWorkDaysBetweenDates',dataInicio, dataFim, v.sigla_unidade).dias;
                    var horas_plano = dias_uteis * v.carga_horaria;
                    var horas_afastamento = checkDatesPlanoAfast(v, arrayAfastamentos = v.afastamentos);
                    var tempo_planejado = horas_plano - horas_afastamento.tempo_afastamento;
                    return moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment() ? 0 : tempo_planejado;
                });

                var dataPlanos = window.chart_data_planos;
                var totalArrayProgramado = arrayProgramado.reduce(function (a, b) { return a + b; }, 0);
                var planoIndex = typeof dataPlanos !== 'undefined' ? dataPlanos.findIndex((obj => obj.id_plano == id_plano)) : -1;

                if (planoIndex !== -1) dataPlanos[planoIndex].tempo_programado = totalArrayProgramado
                if (planoIndex !== -1 && dataPlanos[planoIndex].tempo_programado > dataPlanos[planoIndex].tempo_proporcional) {
                    dataPlanos[planoIndex].tempo_programado = dataPlanos[planoIndex].tempo_proporcional;
                    totalArrayProgramado = dataPlanos[planoIndex].tempo_proporcional;
                }

                var planoIndexAtiv = typeof arrayConfigAtividades.planos !== 'undefined' ? arrayConfigAtividades.planos.findIndex((obj => obj.id_plano == id_plano)) : -1;
                if (planoIndexAtiv !== -1) arrayConfigAtividades.planos[planoIndexAtiv].tempo_programado = totalArrayProgramado;

                var planoIndexConfig = typeof tableConfigList !== 'undefined' && typeof tableConfigList.planos !== 'undefined' ? tableConfigList.planos.findIndex((obj => obj.id_plano == id_plano)) : -1;
                if (planoIndexConfig !== -1) tableConfigList.planos[planoIndexConfig].tempo_programado = totalArrayProgramado;

                if (!$('#dialogBoxDiv').length) callAtiv('getTempoProgamadoPlanos',);

                if (element.length > 0) {
                    Chart.getChart(element[0])?.destroy();
                    var dataset = [{
                        label: 'Homologado',
                        backgroundColor: chartColors.green,
                        // data: [arrayPlano.tempo_homologado].concat(jmespath.search(plano, "[].tempo_homologado"))
                        data: jmespath.search(plano, "[].tempo_homologado")
                    }, {
                        label: 'Entregue',
                        backgroundColor: chartColors.dark_blue,
                        // data: [arrayPlano.tempo_entregue].concat(jmespath.search(plano, "[].tempo_entregue"))
                        data: jmespath.search(plano, "[].tempo_entregue")
                    }, {
                        label: 'Despendido',
                        backgroundColor: chartColors.yellow,
                        // data: [arrayPlano.tempo_despendido].concat(jmespath.search(plano, "[].tempo_despendido")),
                        data: jmespath.search(plano, "[].tempo_despendido"),
                        hidden: callAtiv('checkOptionEntidade','desativa_produtividade_geral')
                    }, {
                        label: 'Pactuado',
                        backgroundColor: chartColors.blue,
                        // data: [arrayPlano.tempo_pactuado].concat(jmespath.search(plano, "[].tempo_pactuado"))
                        data: jmespath.search(plano, "[].tempo_pactuado")
                    }, {
                        label: 'Programado',
                        backgroundColor: chartColors.silver,
                        // data: [totalArrayProgramado].concat(arrayProgramado)
                        data: arrayProgramado
                    }, {
                        label: 'Plano',
                        backgroundColor: chartColors.light_grey,
                        data: [arrayPlano.tempo_proporcional].concat($.map(plano, function (v) {
                            var vPlano = callAtiv('getPlanoData',v.id_plano);
                            // var dataFim = moment(v.data_fim_vigencia,'YYYY-MM-DD HH:mm:ss') > moment() && moment(v.data_inicio_vigencia,'YYYY-MM-DD HH:mm:ss') <= moment() ? moment().format('YYYY-MM-DD HH:mm:ss') : v.data_fim_vigencia;
                            // var dataFim = v.data_fim_vigencia;
                            var dataFim = vPlano && moment(v.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment(vPlano.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') ? vPlano.data_fim_vigencia : v.data_fim_vigencia;
                            var dataInicio = vPlano && moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') < moment(vPlano.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') ? vPlano.data_inicio_vigencia : v.data_inicio_vigencia;
                            var dias_uteis = callAtiv('getWorkDaysBetweenDates',dataInicio, dataFim, v.sigla_unidade).dias;
                            // var dias_uteis = getWorkDaysBetweenDates(v.data_inicio_vigencia, v.data_fim_vigencia, v.sigla_unidade).dias;
                            var horas_plano = dias_uteis * v.carga_horaria;
                            v.tempo_total = horas_plano;
                            var horas_afastamento = checkDatesPlanoAfast(v, arrayAfastamentos = v.afastamentos);
                            var tempo_proporcional = horas_afastamento.tempo_proporcional;
                            var dias_afastamento = parseFloat((horas_afastamento.tempo_afastamento / v.carga_horaria).toFixed(2));
                            dias_af.push(dias_afastamento);
                            // console.log('***',{v: v, afastamentos: v.afastamentos, dias_af: dias_af, data_inicio_vigencia:v.data_inicio_vigencia, data_fim_vigencia: v.data_fim_vigencia, horas_afastamento: horas_afastamento, dias_uteis:dias_uteis, dias_afastamento:v.dias_afastamento, carga_horaria:v.carga_horaria, horas_plano:horas_plano});
                            return parseFloat(tempo_proporcional.toFixed(2));
                        }))
                    }];

                    // console.log(dataset);

                    var chartTempoPlano = new Chart(element, {
                        type: 'bar',
                        data: {
                            // labels: [arrayPlano.apelido_avaliacao_duracao].concat(jmespath.search(plano, "[].mes_ano")),
                            labels: jmespath.search(plano, "[].mes_ano"),
                            datasets: dataset
                        },
                        options: {
                            indexAxis: 'y',
                            scales: {
                                x: {
                                    grid: { display: false },
                                    min: 0,
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
                                    text: 'Distribui\u00E7\u00E3o Mensal do Plano de Trabalho'
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
                                            let valuePlano = (planoIndex === -1) ? false : context.chart.data.datasets[planoIndex].data[context.dataIndex];
                                            var valuePercent = !valuePlano
                                                ? ''
                                                : (context.datasetIndex != planoIndex) ? ' (' + ((value / valuePlano) * 100).toFixed(2) + '%)' : '';
                                            return ' ' + label + ': ' + value + ' horas' + valuePercent;
                                        }
                                    }
                                }
                            }
                        }
                    });
                    getChartLabelItemStore(idElem, chartTempoPlano);
                }
                if (!callAtiv('checkOptionEntidade','desativa_produtividade_geral')) {
                    var elementP = $('#' + idElem + '_produtividade_canvas');
                    if (elementP.length > 0) {
                        var title = 'Produtividade Mensal do Plano de Trabalho';
                        var xTitle = 'M\u00EAs';
                        var y1Title = 'Produtividade';
                        var y2Title = 'Nota Demandas e Afastamentos';
                        var dataset = [{
                            label: 'Produtividade por agilidade',
                            backgroundColor: chartColors.orange,
                            borderColor: chartColors.orange,
                            fill: false,
                            yAxisID: 'y',
                            data: jmespath.search(plano, "[].produtividade")
                        }, {
                            label: 'Produtividade por antecipa\u00E7\u00E3o',
                            backgroundColor: chartColors.magenta,
                            borderColor: chartColors.magenta,
                            fill: false,
                            yAxisID: 'y',
                            data: jmespath.search(plano, "[].produtividade_executada")
                        }, {
                            label: 'Nota atribu\u00EDda',
                            backgroundColor: chartColors.blue,
                            borderColor: chartColors.blue,
                            fill: false,
                            yAxisID: 'y1',
                            data: jmespath.search(plano, "[].nota_atribuida")
                        }, {
                            label: 'Dias de afastamento',
                            backgroundColor: chartColors.gray,
                            borderColor: chartColors.gray,
                            fill: false,
                            yAxisID: 'y1',
                            data: dias_af
                            // data: jmespath.search(plano, "[].dias_afastamento")
                        }, {
                            label: 'Quantidade de demandas',
                            backgroundColor: chartColors.green,
                            borderColor: chartColors.green,
                            fill: false,
                            yAxisID: 'y1',
                            data: jmespath.search(plano, "[].quantidade_demandas")
                        }];
                        var chartData = {
                            labels: jmespath.search(plano, "[].mes_ano"),
                            datasets: dataset
                        };
                        callAtiv('setChartLines2Y',idElem + '_produtividade', chartData, title, xTitle, y1Title, y2Title);
                    }
                }
                centralizeDialogBox(dialogBoxPro, false);
            } else {
                $('.reportWork .dataFallback').removeClass('dataLoading');
            }
        }
    }
}
export function getRelatorioMetaProporcional(id_plano, force = false) {

    var htmlBox = '<div id="view_doc" class="atividadeWork seipro-atividades-work">' +
        '      <table style="font-size: 10pt;width: 100%;" class="seiProForm calculoPlanoProp tableLine tableInfo tableDialog">' +
        '              <tr>' +
        '                  <td style="text-align: left;">Participante</td>' +
        '                  <td class="tituloPlanoParticipante" style="text-align: left;" colspan="3"></td>' +
        '              </tr>' +
        '              <tr>' +
        '                  <td style="text-align: left;">Modalidade</td>' +
        '                  <td class="tituloPlanoModalidade" style="text-align: left;" colspan="3"></td>' +
        '              </tr>' +
        '              <tr>' +
        '                  <td style="text-align: left;">Dura\u00E7\u00E3o</td>' +
        '                  <td class="tituloPlanoDuracao" style="text-align: left;" colspan="3"></td>' +
        '              </tr>' +
        '              <tr>' +
        '                  <td style="text-align: left;">Carga Hor&aacute;ria</td>' +
        '                  <td class="totalCargaDias" style="text-align: left;">di\u00E1rio</td>' +
        '                  <td class="totalCargaHoras" colspan="2" style="text-align: left;"></td>' +
        '              </tr>' +
        '              <tr>' +
        '                  <td style="text-align: left;">Total do plano</td>' +
        '                  <td class="totalPlanoDias" style="text-align: left;"></td>' +
        '                  <td class="totalPlanoHoras" colspan="2" style="text-align: left;"></td>' +
        '              </tr>' +
        '              <tr>' +
        '                  <td style="text-align: left;">Finais de semana</td>' +
        '                  <td class="totalWeekendDias" style="text-align: left;"></td>' +
        '                  <td class="totalWeekendHoras" colspan="2" style="text-align: left;"></td>' +
        '              </tr>' +
        '              <tr>' +
        '                  <td style="text-align: left;">Feriados</td>' +
        '                  <td class="totalHolidayDias" style="text-align: left;"></td>' +
        '                  <td class="totalHolidayHoras" style="text-align: left;"></td>' +
        '                  <td class="detalheHoliday" style="text-align: left; width: 90px;">' +
        '                     <a class="newLink" data-act="atividades-call" data-fn="toogleByID" data-ref="detalheCalcFeriado" style="text-decoration: underline;font-size: 10pt;cursor: pointer;color: blue;">' +
        '                       Detalhar ' +
        '                       <i class="fas fa-angle-double-right" style="font-size: 10pt;text-decoration: underline;margin: 0;color: blue;"></i>' +
        '                     </a>' +
        '                   </td>' +
        '              </tr>' +
        '              <tr style="display:none;" id="detalheCalcFeriado">' +
        '                  <td colspan="4">' +
        '                     <div class="tabelaPanelScroll" style="margin-top: 10px;">' +
        '                        <table style="font-size: 10pt;width: 100%;" class="seiProForm calculoFeriado tableLine tableInfo tableZebra tableDialog">' +
        '                           <thead>' +
        '                                <tr class="tableHeader">' +
        '                                    <th class="tituloControle">Feriados</td>' +
        '                                    <th class="tituloControle">Data</td>' +
        '                                    <th class="tituloControle">Horas</td>' +
        '                                </tr>' +
        '                           </thead>' +
        '                           <tbody>' +
        '                           </tbody>' +
        '                           <tfoot>' +
        '                                <tr class="tableHeader">' +
        '                                    <th class="tituloControle" colspan="2">Total</td>' +
        '                                    <th class="tituloControle totalHoras"></td>' +
        '                                </tr>' +
        '                           </tfoot>' +
        '                        </table>' +
        '                     </div>' +
        '                  </td>' +
        '              </tr>' +
        '              <tr>' +
        '                  <td style="text-align: left;"><strong>Meta Total do Plano (horas)</strong></td>' +
        '                  <td class="totalMetaPlanoDias" style="text-align: left;"></td>' +
        '                  <td class="totalMetaPlanoHoras" colspan="2" style="text-align: left;"></td>' +
        '              </tr>' +
        '              <tr>' +
        '                  <td style="text-align: left;">Afastamentos</td>' +
        '                  <td class="totalAfastCount" style="text-align: left;"></td>' +
        '                  <td class="totalAfastHoras" style="text-align: left;"></td>' +
        '                  <td class="detalheAfast" style="text-align: left;">' +
        '                     <a class="newLink" data-act="atividades-call" data-fn="toogleByID" data-ref="detalheCalcAfast" style="text-decoration: underline;font-size: 10pt;cursor: pointer;color: blue;">' +
        '                       Detalhar ' +
        '                       <i class="fas fa-angle-double-right" style="font-size: 10pt;text-decoration: underline;margin: 0;color: blue;"></i>' +
        '                     </a>' +
        '                   </td>' +
        '              </tr>' +
        '              <tr style="display:none;" id="detalheCalcAfast">' +
        '                  <td colspan="4">' +
        '                      <div class="tabelaPanelScroll" style="margin-top: 10px;">' +
        '                         <table style="font-size: 10pt;width: 100%;" class="seiProForm calculoAfastamento tableLine tableInfo tableZebra tableDialog ">' +
        '                            <thead>' +
        '                                 <tr class="tableHeader">' +
        '                                     <th class="tituloControle">Motivo do Afastamento</td>' +
        '                                     <th class="tituloControle" style="width: 260px;">Observa\u00E7\u00F5es</td>' +
        '                                     <th class="tituloControle">Data</td>' +
        '                                     <th class="tituloControle">Per\u00EDodo</td>' +
        '                                     <th class="tituloControle">Horas</td>' +
        '                                 </tr>' +
        '                            </thead>' +
        '                            <tbody>' +
        '                            </tbody>' +
        '                            <tfoot>' +
        '                                 <tr class="tableHeader">' +
        '                                     <th class="tituloControle" colspan="4">Total</td>' +
        '                                     <th class="tituloControle totalHoras"></td>' +
        '                                 </tr>' +
        '                            </tfoot>' +
        '                         </table>' +
        '                      </div>' +
        '                  </td>' +
        '              </tr>' +
        '              <tr>' +
        '                  <td colspan="2" style="text-align: left;"><strong>Acr\u00E9scimos normativos</strong></td>' +
        '                  <td class="acrescimoMeta" style="text-align: left;"></td>' +
        '                  <td class="detalheAcrescimo" style="text-align: left;">' +
        '                     <a class="newLink" data-act="atividades-call" data-fn="toogleByID" data-ref="detalheAcrescimo" style="text-decoration: underline;font-size: 10pt;cursor: pointer;color: blue;">' +
        '                       Detalhar ' +
        '                       <i class="fas fa-angle-double-right" style="font-size: 10pt;text-decoration: underline;margin: 0;color: blue;"></i>' +
        '                     </a>' +
        '                   </td>' +
        '              </tr>' +
        '              <tr style="display:none;" id="detalheAcrescimo">' +
        '                  <td colspan="4">' +
        '                      <div class="tabelaPanelScroll" style="margin-top: 10px;">' +
        '                         <table style="font-size: 10pt;width: 100%;" class="seiProForm calculoAcrescimo tableLine tableInfo tableZebra tableDialog ">' +
        '                            <thead>' +
        '                                 <tr class="tableHeader">' +
        '                                     <th class="tituloControle" style="width: 260px;">Motivo do Acr\u00E9scimo</td>' +
        '                                     <th class="tituloControle">N\u00FAmero SEI</td>' +
        '                                     <th class="tituloControle">Tempo Acrescido</td>' +
        '                                 </tr>' +
        '                            </thead>' +
        '                            <tbody>' +
        '                            </tbody>' +
        '                            <tfoot>' +
        '                                 <tr class="tableHeader">' +
        '                                     <th class="tituloControle" colspan="2">Total</td>' +
        '                                     <th class="tituloControle totalHoras"></td>' +
        '                                 </tr>' +
        '                            </tfoot>' +
        '                         </table>' +
        '                      </div>' +
        '                  </td>' +
        '              </tr>' +
        '              <tr>' +
        '                  <td colspan="2" style="text-align: left;"><strong>Meta proporcional do Plano</strong></td>' +
        '                  <td class="totalMetaProporcional" colspan="2" style="text-align: left;"></td>' +
        '              </tr>' +
        '      </table>' +
        '</div>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
        .dialog({
            title: 'Mem\u00F3ria de C\u00E1lculo de Meta Proporcional',
            width: 990,
            open: function () {
                window.calculoMetaPropAfast = false;
                window.calculoMetaPropAfastCount = false;
                window.calculoMetaPropPlano = false;
                window.calculoMetaPropFeriado = false;
                window.calculoMetaPropFeriadoCount = false;
                window.calculoMetaAcrescimo = false;
                var value = jmespath.search(tableConfigList.planos, "[?id_plano==`" + id_plano + "`] | [0]");
                value = (typeof value !== 'undefined' && value !== null) ? value : false;
                if (value) {
                    var checkAvaliacao = callAtiv('checkHomologacaoPreviaPlanos',value) && callAtiv('checkCapacidade','config_approve_planos') && value.avaliacao_plano ? true : false;
                    window.calculoMetaPropPlano = value;
                    if (typeof value.planos_acrescimo !== 'undefined') {
                        window.calculoMetaAcrescimo = value.planos_acrescimo.tempo_acrescimo;
                        let signalAcrescimo = value.planos_acrescimo.tempo_acrescimo > 0 ? '+' : '-';
                        $('.calculoPlanoProp .acrescimoMeta').html('(' + signalAcrescimo + ') ' + decimalHourToMinute(value.planos_acrescimo.tempo_acrescimo));
                        $('#detalheAcrescimo .calculoAcrescimo tfoot .totalHoras').text(decimalHourToMinute(value.planos_acrescimo.tempo_acrescimo));
                        let htmlAcrescimoTable = $.map(value.planos_acrescimo.lista, function (v) {
                            return `<tr>
                                            <td style="text-align: left;">${v.config.observacoes}</td>
                                            <td>${v.config.nr_sei}</td>
                                            <td>${decimalHourToMinute(v.tempo_acrescimo)}</td>
                                        </tr>
                                        `;
                        }).join('');
                        $('#detalheAcrescimo .calculoAcrescimo tbody').html(htmlAcrescimoTable);
                    }
                    if (!force && (checkAvaliacao || (typeof value.data_arquivamento !== 'undefined' && value.data_arquivamento != '0000-00-00 00:00:00'))) {
                        var type = 'afastamentos';
                        var action = 'report_' + type;
                        var param = {
                            action: action,
                            disabled: 'hide',
                            all_data: false,
                            id_programa: false,
                            id_plano: value.id_plano,
                            offset: 0,
                            return_empty: false,
                            filter: false,
                            column_filter: false
                        };
                        getServerAtividades(param, action, type);
                    } else {
                        callAtiv('updateConfigTempoPactuadoById',value.id_plano, force);
                        if (force) {
                            $('.atividadeWork .calculoPlanoProp').after(`<div style="text-align:center">
                                    <span class="alertaBoxDisplay">
                                        <i class="fas fa-info-circle azulColor" style="margin: 0 5px;"></i>
                                        Recalculo de meta proporcional n\u00E3o dispon\u00EDvel para planos j\u00E1 arquivados ou avaliados!
                                    </span>
                                </div>`);
                        }
                    }
                }
            },
            close: function () {
                $('#dialogBoxDiv').remove();
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
                    $('#dialogBoxDiv').remove();
                    resetDialogBoxPro('dialogBoxPro');
                }
            }]
        });
}
export function calcRelatorioMetaProporcional(mode, data) {
    if (mode == 'afastamentos' && data.afastamento !== null) {
        var htmlTableRelatorio = '<tr>' +
            '    <td style="text-align: left;">' + (data.afastamento.nome_motivo || '') + '</td>' +
            '    <td style="text-align: left;">' + (data.afastamento.observacoes || '') + '</td>' +
            '    <td style="text-align: left;">' + (data.data_afastamento || '') + '</td>' +
            '    <td style="text-align: left;">' + moment(data.afastamento.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') + ' \u00E0 ' + moment(data.afastamento.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') + '</td>' +
            '    <td>' + decimalHourToMinute(data.horas_afastamento) + '</td>' +
            '</tr>';
        $('.calculoAfastamento tbody').append(htmlTableRelatorio);
        var fatorMultiplicacao = (data.afastamento && data.afastamento !== null)
            ? jmespath.search(arrayConfigAtividades.afastamentos.tipos_motivos, "[?id_tipo_motivo==`" + data.afastamento.id_tipo_motivo + "`] | [0].config.fator_multiplicacao") : 1;
        var calculoMetaPropAfast = window.calculoMetaPropAfast;
        calculoMetaPropAfast = (typeof calculoMetaPropAfast !== 'undefined' && calculoMetaPropAfast) ? calculoMetaPropAfast + data.horas_afastamento : data.horas_afastamento;
        calculoMetaPropAfast = (isNumeric(fatorMultiplicacao) && fatorMultiplicacao > 0) ? calculoMetaPropAfast * fatorMultiplicacao : calculoMetaPropAfast;
        window.calculoMetaPropAfast = calculoMetaPropAfast;

        var calculoMetaPropAfastCount = window.calculoMetaPropAfastCount;
        calculoMetaPropAfastCount = (typeof calculoMetaPropAfastCount !== 'undefined' && calculoMetaPropAfastCount) ? calculoMetaPropAfastCount + 1 : 1;
        window.calculoMetaPropAfastCount = calculoMetaPropAfastCount;

        $('.calculoAfastamento tfoot .totalHoras').text(decimalHourToMinute(calculoMetaPropAfast));
        $('.calculoPlanoProp .totalAfastHoras').text('(-) ' + decimalHourToMinute(calculoMetaPropAfast));
        $('.calculoPlanoProp .totalAfastCount').text(calculoMetaPropAfastCount + ' registros');
        // console.log({array: data, nome: data.afastamento.nome_motivo, obs: data.afastamento.observacoes, data: data.data_afastamento, hora: decimalHourToMinute(data.horas_afastamento), count: calculoMetaPropAfastCount, total: decimalHourToMinute(calculoMetaPropAfast) });

    } else if (mode == 'feriados') {
        window.calculoMetaPropFeriadoCount = 0;
        if (window.calculoMetaPropPlano && typeof window.calculoMetaPropPlano !== 'undefined') {
            var start = moment(window.calculoMetaPropPlano.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss');
            var finish = moment(window.calculoMetaPropPlano.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss');

            data.feriados = data.feriados.sort((a, b) => a.d_.localeCompare(b.d_));

            var feriados = $.map(data.feriados, function (f) {
                var check = moment(f.m).isBetween(start, finish, 'days', '[]');
                if (check && f.m.weekday() != 0 && f.m.weekday() != 6) {
                    var carga_horaria_feriado = f.meio_periodo ? callAtiv('getOptionEntidade','horas_meio_periodo') : window.calculoMetaPropPlano.carga_horaria;
                    carga_horaria_feriado = window.calculoMetaPropPlano.carga_horaria < carga_horaria_feriado ? window.calculoMetaPropPlano.carga_horaria : carga_horaria_feriado;
                    var razao_dias_feriado = window.calculoMetaPropPlano.carga_horaria == carga_horaria_feriado ? 1 : carga_horaria_feriado / window.calculoMetaPropPlano.carga_horaria;

                    var htmlTableRelatorio = '<tr>' +
                        '    <td style="text-align: left;">' + unicodeToChar(f.dia) + '</td>' +
                        '    <td style="text-align: left;">' + f.d + '</td>' +
                        '    <td>' + decimalHourToMinute(carga_horaria_feriado) + '</td>' +
                        '</tr>';
                    $('.calculoFeriado tbody').append(htmlTableRelatorio);

                    var calculoMetaPropFeriado = window.calculoMetaPropFeriado;
                    calculoMetaPropFeriado = (typeof calculoMetaPropFeriado !== 'undefined' && calculoMetaPropFeriado) ? calculoMetaPropFeriado + carga_horaria_feriado : carga_horaria_feriado;
                    window.calculoMetaPropFeriado = calculoMetaPropFeriado;

                    var calculoMetaPropFeriadoCount = window.calculoMetaPropFeriadoCount;
                    calculoMetaPropFeriadoCount = calculoMetaPropFeriadoCount + razao_dias_feriado;
                    window.calculoMetaPropFeriadoCount = calculoMetaPropFeriadoCount;

                    console.log({
                        razao_dias_feriado: razao_dias_feriado,
                        carga_horaria: window.calculoMetaPropPlano.carga_horaria,
                        carga_horaria_feriado: carga_horaria_feriado,
                        calculoMetaPropFeriadoCount: calculoMetaPropFeriadoCount
                    });

                    $('.calculoFeriado tfoot .totalHoras').text(decimalHourToMinute(calculoMetaPropFeriado));
                    $('.calculoPlanoProp .totalHolidayHoras').text('(-) ' + decimalHourToMinute(calculoMetaPropFeriado));
                    $('.calculoPlanoProp .totalHolidayDias').text(parseFloat(calculoMetaPropFeriadoCount.toFixed(2)) + ' dias');

                    return f;
                }
            });
            var totalPlanoDias = Math.abs(finish.diff(start, 'days')) + 1;
            var totalPlanoHoras = totalPlanoDias * window.calculoMetaPropPlano.carga_horaria;
            $('.calculoPlanoProp .totalPlanoDias').text(totalPlanoDias + ' dias');
            $('.calculoPlanoProp .totalPlanoHoras').text(decimalHourToMinute(totalPlanoHoras));

            $('.calculoPlanoProp .totalCargaHoras').text(decimalHourToMinute(window.calculoMetaPropPlano.carga_horaria));

            var totalDiasUteis = moment().isoWeekdayCalc({
                rangeStart: start.format('YYYY-MM-DD'),
                rangeEnd: finish.format('YYYY-MM-DD'),
                weekdays: [1, 2, 3, 4, 5],
                exclusions: []
            });
            var totalWeekendDias = totalPlanoDias - totalDiasUteis;
            var totalWeekendHoras = totalWeekendDias * window.calculoMetaPropPlano.carga_horaria;
            $('.calculoPlanoProp .totalWeekendDias').text(totalWeekendDias + ' dias');
            $('.calculoPlanoProp .totalWeekendHoras').text('(-) ' + decimalHourToMinute(totalWeekendHoras));

            var totalMetaPlanoDias = totalPlanoDias - totalWeekendDias - calculoMetaPropFeriadoCount;
            var totalMetaPlanoHoras = totalMetaPlanoDias * window.calculoMetaPropPlano.carga_horaria;
            $('.calculoPlanoProp .totalMetaPlanoDias').text(totalMetaPlanoDias + ' dias');
            $('.calculoPlanoProp .totalMetaPlanoHoras').text('(=) ' + decimalHourToMinute(totalMetaPlanoHoras));

            setTimeout(function () {
                var totalMetaProporcional = totalMetaPlanoHoras - window.calculoMetaPropAfast;
                totalMetaProporcional = window.calculoMetaAcrescimo ? totalMetaProporcional + window.calculoMetaAcrescimo : totalMetaProporcional;
                totalMetaProporcional = totalMetaProporcional < 0 ? 0 : totalMetaProporcional;
                $('.calculoPlanoProp .totalMetaProporcional').text('(=) ' + decimalHourToMinute(totalMetaProporcional));
                loadingButtonConfirm(false);
            }, 500);

            $('.calculoPlanoProp .tituloPlanoParticipante').html(window.calculoMetaPropPlano.apelido_avaliacao);
            $('.calculoPlanoProp .tituloPlanoModalidade').html(window.calculoMetaPropPlano.nome_modalidade);
            $('.calculoPlanoProp .tituloPlanoDuracao').html(moment(window.calculoMetaPropPlano.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(window.calculoMetaPropPlano.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'));

            return totalMetaPlanoDias;
        }
    }
}
export function updateTempoProporcionalPlanos() {
    var updatePlanos = []
    $.each(arrayConfigAtividades.planos, function (index, value) {
        var arrayTempoProporcional = checkDatesPlanoAfast(value);
        if (arrayTempoProporcional.tempo_proporcional != value.tempo_proporcional) {
            updatePlanos.push({
                id_plano: arrayTempoProporcional.id_plano,
                tempo_proporcional: arrayTempoProporcional.tempo_proporcional,
            });
        }
    });
    if (updatePlanos.length > 0) {
        var action = callAtiv('checkCapacidade','update_self_planos') ? 'update_self_planos' : 'update_planos';
        var param = {
            action: action,
            planos: updatePlanos
        };
        getServerAtividades(param, action);
    }
}
export function updateArrayPlanos(planos) {
    $.each(planos, function (index, value) {
        $.each(arrayConfigAtividades.planos, function (i, v) {
            if (value.id_plano == v.id_plano) {
                arrayConfigAtividades.planos[i].tempo_proporcional = parseInt(value.tempo_proporcional);
            }
        });
    });
}
/*
export function checkDatesLoopAfast(inicio, fim, id_user, id_afastamento) {
    var inicio_afastamento = moment(inicio, 'YYYY-MM-DD');
    var fim_afastamento = moment(fim, 'YYYY-MM-DD');
    var checkBetween = false;
    var checkInicio = checkDatesBetweenAfast(inicio_afastamento.format('YYYY-MM-DD'), id_user, id_afastamento);
    var checkFim = checkDatesBetweenAfast(fim_afastamento.format('YYYY-MM-DD'), id_user, id_afastamento);
        while(inicio_afastamento.add(1, 'days').diff(fim_afastamento) < 0) {
            var check = checkDatesBetweenAfast(inicio_afastamento.clone().format('YYYY-MM-DD'), id_user, id_afastamento);
            if (check) {
                checkBetween = true;
            }
        }
        // console.log(checkInicio, checkBetween, checkFim);
    return (checkInicio || checkBetween || checkFim) ? true : false;
}
export function checkDatesBetweenAfast(date_target, id_user, id_afastamento, includes = false) {
    var userDates = jmespath.search(arrayConfigAtividades.afastamentos.lista,"[?id_user==`"+id_user+"`]");
    var checkDates = false;
    var target = moment(date_target,'YYYY-MM-DD');
        includes = (includes) ? '[]' : '()';
    // console.log('date_target->',date_target, 'id_user->',id_user, 'id_afastamento->',id_afastamento);
    $.each(userDates,function(index, value){
        var start = moment(value.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss');
        var finish = moment(value.fim_afastamento, 'YYYY-MM-DD HH:mm:ss');
        var check = target.isBetween(start, finish, 'days', includes);
        if (check && id_afastamento != value.id_afastamento) {
            // console.log('*',check, start.format('DD/MM/YYYY'), finish.format('DD/MM/YYYY'), value.id_afastamento);
            checkDates = true;
            return false;
        }
    });
    return checkDates;
}
*/
export function checkDatesAfast(element, formAfast = true) {
    var _this = $(element);
    var data = _this.data();
    var _parent = _this.closest('table');
    var inicio = _parent.find('input[data-type="inicio"]');
    var inicio_val = (inicio.val().indexOf('T') !== -1) ? inicio.val() : inicio.val() + 'T00:00';
    var fim = _parent.find('input[data-type="fim"]');
    var fim_val = (fim.val().indexOf('T') !== -1) ? fim.val() : fim.val() + 'T23:59';
    var id_user = (_parent.find('input[data-type="user"]').length > 0) ? _parent.find('input[data-type="user"]') : false;
    id_user = (_parent.find('select[data-type="user"]').length > 0) ? _parent.find('select[data-type="user"]') : id_user;
    id_user = ($('#ativ_id_user').length > 0) ? $('#ativ_id_user') : id_user;
    var id_user_val = (typeof id_user !== 'undefined' && id_user) ? parseInt(id_user.val()) : false;
    var id_afastamento = _parent.find('input[data-type="id"]');
    id_afastamento = (id_afastamento.length == 0) ? 0 : id_afastamento.val();
    var alert = '';
    var format = (inicio.val().indexOf('T') !== -1) ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
    var format_display = (inicio.val().indexOf('T') !== -1) ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';
    var type_datetime = (inicio.val().indexOf('T') !== -1) ? true : false;

    if (moment(inicio_val, format) > moment(fim_val, format)) {
        element.setCustomValidity('*');
        alert = 'A ' + inicio.data('name') + ' deve ser maior ou igual que a ' + fim.data('name');
    } else if (id_user_val) {
        var userAfastList = jmespath.search(arrayConfigAtividades.afastamentos.lista, "[?id_user==`" + id_user_val + "`]");
        var check = (userAfastList !== null)
            ? callAtiv('checkDatesLoopArray',userAfastList, inicio_val, fim_val, id_user_val, id_afastamento, { inicio: 'inicio_afastamento', fim: 'fim_afastamento', id: 'id_user', idreftype: 'id_afastamento' }, true, true)
            : false;
        /* 
        console.log({
            id_user_len: id_user.length, 
            afastamentos_lista: userAfastList, 
            inicio_val: inicio_val, 
            id_user_val: id_user_val, 
            id_afastamento: id_afastamento, 
            param: {inicio: 'inicio_afastamento', fim: 'fim_afastamento', id: 'id_afastamento', idreftype: 'id_afastamento'}, 
            check: check
        });
         */

        if (check && check.length > 0) {
            var v = jmespath.search(arrayConfigAtividades.afastamentos.lista, "[?id_afastamento==`" + check[0] + "`] | [0]");
            var horas_afastamento = (v !== null) ? jmespath.search(arrayConfigAtividades.afastamentos.tipos_motivos, "[?id_tipo_motivo==`" + v.id_tipo_motivo + "`] | [0].config.horas_afastamento") : null;
            horas_afastamento = (horas_afastamento !== null) ? horas_afastamento : false;
            var permite_sobreposicao = (v !== null) ? jmespath.search(arrayConfigAtividades.afastamentos.tipos_motivos, "[?id_tipo_motivo==`" + v.id_tipo_motivo + "`] | [0].config.permite_sobreposicao") : null;
            permite_sobreposicao = (permite_sobreposicao !== null) ? permite_sobreposicao : false;

            if (!permite_sobreposicao && (formAfast || (!formAfast && horas_afastamento == false))) {

                var format_display_afast = (moment(v.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') == '00:00:00' && (moment(v.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') == '23:59:59' || moment(v.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') == '00:00:00')) ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm';
                var text_conflict = v.apelido + ' (' + v.nome_motivo + ') ' + moment(v.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss').format(format_display_afast) + ' \u00E0 ' + moment(v.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format(format_display_afast);
                element.setCustomValidity('*');
                alert = (formAfast)
                    ? 'O afastamento n\u00E3o pode estar inclu\u00EDda em outra data j\u00E1 cadastrada \n\n' + text_conflict
                    : 'O afastamento est\u00E1 inclu\u00EDda em uma data de afastamento \n\n' + text_conflict;

                var inicioAfastMinute = moment(v.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss') > moment(inicio_val, format) ? moment(v.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss').startOf('day') : moment(inicio_val, format);
                var fimAfastMinute = moment(v.fim_afastamento, 'YYYY-MM-DD HH:mm:ss') < moment(fim_val, format) ? (moment(inicio_val, format) > moment(v.fim_afastamento, 'YYYY-MM-DD HH:mm:ss') ? moment(inicio_val, format) : moment(v.fim_afastamento, 'YYYY-MM-DD HH:mm:ss')) : (type_datetime ? moment(fim_val, format) : moment(fim_val, format).endOf('day'));

                var checkDatesMinutes = callAtiv('checkDatesLoopArray',[v], inicioAfastMinute.format('YYYY-MM-DDTHH:mm'), fimAfastMinute.format('YYYY-MM-DDTHH:mm'), id_user_val, id_afastamento, { inicio: 'inicio_afastamento', fim: 'fim_afastamento', id: 'id_user', idreftype: 'id_afastamento' }, true, true, 'minutes');
                // console.log('checkDatesMinutes', checkDatesMinutes, [v], inicioAfastMinute.format('YYYY-MM-DDTHH:mm'), fimAfastMinute.format('YYYY-MM-DDTHH:mm'), id_user_val, id_afastamento, {inicio: 'inicio_afastamento', fim: 'fim_afastamento', id: 'id_user', idreftype: 'id_afastamento'}, true, true, 'minutes');

                if (!checkDatesMinutes || checkDatesMinutes.length == 0 || permite_sobreposicao) {
                    element.setCustomValidity('');
                    alert = '';
                }
            }
        } else {
            element.setCustomValidity('');
        }
    } else {
        element.setCustomValidity('');
    }
    var userValidation = element.checkValidity();

    function checkDatesAfastValidation() {
        if (userValidation) {
            _this.removeClass('requiredNull');
            _parent.find('#infoBox_dateAfast').hide().html('');
            return true;
        } else {
            _this.addClass('requiredNull');
            element.setCustomValidity(alert);

            var ativAfastHtml = '<span style="margin: 10px 0;display: block;" class="alertaBoxDisplay">' +
                '   <i class="fas fa-info-circle azulColor" style="margin: 0 5px;"></i>' +
                '   ' + alert +
                '</div>';
            _parent.find('#infoBox_dateAfast').show().html(ativAfastHtml);

            var isValid = element.reportValidity();
            return false;
        }
    }
    checkDatesAfastValidation();
    if (!userValidation) { setTimeout(function () { checkDatesAfastValidation() }, 500) }
    return userValidation;
}
export function changeInputAfast(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    var _inicio = _parent.find('input[data-type="inicio"]');
    var inicio = _inicio.val();
    var _fim = _parent.find('input[data-type="fim"]');
    var fim = _fim.val();
    var format = (inicio.indexOf('T') !== -1) ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
    var check_allday = _parent.find('#afast_all_day');
    if (!check_allday.is(':checked')) {
        if (inicio.indexOf('T') !== -1) {
            var inicio_format = inicio + 'T' + moment().format('HH:mm');
            var fim_format = fim + 'T' + moment().add(1, 'hours').format('HH:mm');
        } else {
            var inicio_format = (inicio != '') ? moment(inicio, format).format('YYYY-MM-DDTHH:mm') : moment().format('YYYY-MM-DDTHH:mm');
            var fim_format = (fim != '') ? moment(fim, format).format('YYYY-MM-DDTHH:mm') : moment().format('YYYY-MM-DDTHH:mm');
        }
        // console.log(inicio_format, fim_format);
        _inicio.attr('type', 'datetime-local').val(inicio_format).show();
        _fim.attr('type', 'datetime-local').val(fim_format).show();
    } else {
        var inicio_format = (inicio != '') ? moment(inicio, format).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        var fim_format = (fim != '') ? moment(fim, format).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        _inicio.attr('type', 'date').val(inicio_format).show();
        _fim.attr('type', 'date').val(fim_format).show();
    }
    callAtiv('prepareFieldsReplace',this_);
    changeDatesAfast(this_);
}
export function checkInputAfast(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    var data = _this.find('option:selected').data();
    var config = (typeof data !== 'undefined') ? data.config : false;
    var check_allday = _parent.find('#afast_all_day');
    if (config && typeof data !== 'undefined') {
        if (typeof config.exige_documentacao !== 'undefined' && config.exige_documentacao) {
            _parent.find('.afastBox_documentacao').show();
            _parent.find('.afastBox_observacao').hide();
        } else {
            _parent.find('.afastBox_documentacao').hide();
            _parent.find('.afastBox_observacao').show();
        }
        if (config.horas_afastamento) {
            if (check_allday.is(':checked')) {
                check_allday.trigger('click');
            }
        } else {
            if (!check_allday.is(':checked')) {
                check_allday.trigger('click');
            }
        }
        // changeInputAfast(this_);
    }
}
export function changeDatesAfast(this_) {
    clearTimeout(dly);
    dly = setTimeout(function () {
        changeDatesAfast_(this_);
    }, 1000);
}
export function changeDatesAfast_(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    var data = _this.data();
    var inicio = _parent.find('input[data-type="inicio"]');
    var fim = _parent.find('input[data-type="fim"]');
    /*
    if (data.type == 'fim') {
        inicio.attr('max', _this.val());
    } else if (data.type == 'inicio') {
        fim.attr('min', _this.val());
    }
    */
    _parent.find('input.requiredNull').removeClass('requiredNull');
    checkDatesAfast(_this.data('type') == 'user' ? inicio.get(0) : this_);
    checkAtividadesInAfastamentos(this_);
}
export function checkAtividadesInAfastamentos(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    var data = _this.data();
    var inicio = _parent.find('input[data-type="inicio"]').val();
    var fim = _parent.find('input[data-type="fim"]').val();
    var user = _parent.find('select[data-type="user"]');
    var id_user = user.val();
    var listAtivInAfast = [];
    var ativUser = jmespath.search(arrayAtividadesPro, "[?data_entrega=='0000-00-00 00:00:00'] | [?id_user==`" + id_user + "`]");
    var _inicio = moment(inicio, 'YYYY-MM-DD');
    var _fim = moment(fim, 'YYYY-MM-DD');
    var labels = { inicio: 'data_distribuicao', fim: 'prazo_entrega', id: 'id_user' };
    var format = (inicio.indexOf('T') !== -1) ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
    var format_display = (inicio.indexOf('T') !== -1) ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';

    checkDatesBetweenArrayAtiv(ativUser, _inicio.format(format), labels, true);
    checkDatesBetweenArrayAtiv(ativUser, _fim.format(format), labels, true);

    while (_inicio.add(1, 'days').diff(_fim) < 0) {
        checkDatesBetweenArrayAtiv(ativUser, _inicio.clone().format(format), labels, true);
    }

    function checkDatesBetweenArrayAtiv(array, date_target, labels, includes = false) {
        var target = moment(date_target, format);
        includes = (includes) ? '[]' : '()';
        $.each(array, function (index, value) {
            var start = moment(value[labels.inicio], 'YYYY-MM-DD HH:mm:ss');
            var finish = moment(value[labels.fim], 'YYYY-MM-DD HH:mm:ss');
            var check = target.isBetween(start, finish, 'days', '[]');
            if (check && jmespath.search(listAtivInAfast, "[?id_demanda==`" + value.id_demanda + "`]").length == 0) {
                listAtivInAfast.push(value);
            }
        });
    }

    if (listAtivInAfast.length > 0) {
        var htmlTableAtividades = $.map(listAtivInAfast, function (v, k) {
            var datesAtivHtml = getDatesPreview(callAtiv('getConfigDateAtiv',v));
            datesAtivHtml = (datesAtivHtml != '') ? $(datesAtivHtml).find('.dateBoxIcon')[0].outerHTML : '';
            datesAtivHtml = (datesAtivHtml != '') ? '<span class="dateboxDisplay" data-act="atividades-call" data-fn="actionsAtividade" data-pass-el="0" data-id="' + v.id_demanda + '">' + datesAtivHtml + '</span>' : '';
            return '<div style="margin: 5px 0; display: inline-block; width: 100%;" data-value="' + v.id_demanda + '" title="' + callAtiv('getTitleDialogBox',v, true) + '">' + datesAtivHtml + callAtiv('statusIconsAtividade',v) + callAtiv('getTitleDialogBox',v) + '</div>'
        }).join('');
        var ativAfastHtml = '<span style="margin: 10px 0;display: block;" class="alertaBoxDisplay">' +
            '   <i class="fas fa-info-circle azulColor" style="margin: 0 5px;"></i>' +
            '   ' + (listAtivInAfast.length > 1 ? 'Existem ' + listAtivInAfast.length + ' ' + __.demandas : 'Existe 1 ' + __.demanda + '') + ' em aberto dentro do per\u00EDodo de afastamento selecionado para o usu\u00E1rio <strong>' + user.find('option:selected').text() + '</strong>' +
            '   <a class="newLink" data-act="atividades-call" data-fn="ativInAfastDetalhe" style="text-decoration: underline;font-size: 10pt;cursor: pointer;color: blue;">' +
            '       Detalhar ' +
            '       <i class="fas fa-angle-double-right" style="font-size: 10pt;text-decoration: underline;margin: 0;color: blue;"></i>' +
            '   </a>' +
            '</span>' +
            '<div id="infoBox_dateAfastDetalhe" style="display:none; font-size: 9pt;">' +
            '   ' + htmlTableAtividades +
            '</div>';
        _parent.find('#infoBox_dateAfast').show().html(ativAfastHtml);
    } else {
        _parent.find('#infoBox_dateAfast').hide().html('');
    }
}
export function ativInAfastDetalhe(this_) {
    var _this = $(this_);
    var _parent = _this.closest('tr');
    _parent.find('#infoBox_dateAfastDetalhe').toggle();
}
export function editAfastamento(this_, id_afastamento = 0) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    var inicio = _parent.find('input[data-type="inicio"]');
    if (id_afastamento == 0) {
        _parent.find('.td_edit').show();
        _parent.find('.td_view').hide();
    } else if (id_afastamento == -1) {
        _parent.find('.td_edit').hide();
        _parent.find('.td_view').show();
    } else if (checkDatesAfast(inicio.get(0)) && callAtiv('checkAtivRequiredFields',inicio.get(0), 'mark')) {
        var param = extractDataAfast(_parent);
        var action = 'edit_afastamento';
        param.action = action;
        param.id_afastamento = id_afastamento;
        getServerAtividades(param, action);
        _parent.find('.confirm i').attr('class', 'fas fa-sync-alt fa-spin');
    }
    // console.log(id_afastamento, param);
    callAtiv('prepareFieldsReplace',this_);
}
export function extractDataAfast(_parent) {
    var param = {};
    _parent.find('.data_extract').each(function () {
        var _this = $(this);
        if (typeof _this.data('key') !== 'undefined') {
            var value = (_this.attr('type') == 'date') ? (_this.data('key') == 'fim_afastamento' ? _this.val() + ' 23:59:59' : _this.val() + ' 00:00:00') : _this.val();
            value = (_this.attr('type') == 'datetime-local') ? (_this.val() == '' ? '' : moment(_this.val(), 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss')) : value;
            value = (_this.is('textarea') || (_this.is('input') && _this.attr('type') == 'text')) ? value.replace(/["']/g, "") : value;
            param[_this.data('key')] = value;
        }
    });
    if ($('#configBox_documentos').is(':visible')) {
        var doc = callAtiv('extractOptionConfigItem',_parent);
        doc = doc && typeof doc.documentos !== 'undefined' ? jmespath.search(doc.documentos, "[?documento!='undefined'] | [?id_procedimento!='0']") : null;
        if (typeof doc !== 'undefined' && doc !== null && doc.length) {
            param.config = { documentos: doc };
        }
    }
    return param;
}
export function removeAfastamento(this_, id_afastamento = 0) {
    var _this = $(this_);
    var id_afastamentos = [];
    var countSelected = $('#tableAfastamento tr.infraTrMarcada').length;
    if (id_afastamento != 0) {
        if ($('#tableAfastamento').is(':visible') && countSelected > 0) {
            $('#tableAfastamento').find('.lnkInfraCheck').data('index', 1).trigger('click');
        }
        _this.closest('tr').find('td').eq(0).find('input[type="checkbox"]').trigger('click');
    } else {
        id_afastamentos = $('#tableAfastamento').find('.checkboxSelectAfastamento:checked').map(function () { return $(this).val() }).get();
    }

    confirmaFraseBoxPro('Tem certeza que deseja excluir ' + (countSelected > 1 ? 'os afastamentos' : 'o afastamento') + (id_afastamento == 0 ? (countSelected > 1 ? ' selecionados' : ' selecionado') : '') + '?', 'EXCLUIR',
        function () {
            var action = 'delete_afastamento';
            var param = {
                action: action,
                id_afastamento: id_afastamento,
                id_afastamentos: id_afastamentos
            };
            getServerAtividades(param, action);
        }, function () {
            if (id_afastamento != 0) {
                if ($('#tableAfastamento').is(':visible') && _this.closest('tr').hasClass('infraTrMarcada')) {
                    $('#tableAfastamento').find('.lnkInfraCheck').data('index', 1).trigger('click');
                }
            }
        }
    );
}
