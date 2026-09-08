/**
 * SEI Pro - Editor Feature: legis
 *
 * Links de legislacao (normas) no documento do editor (CK4/CK5).
 * Entrada: getLegisSEI (botao "Adicionar link de legislacao" da toolbar).
 * Abre um dialogo jQuery UI on-demand (via SeiProEditorAdapter.openDialog)
 * com abas:
 *   - Legislacao Federal: tipo + numero (+ pesquisa por palavra-chave/periodo)
 *   - Norma Infralegal: orgao + tipo + numero
 *   - Lista de Normas: codigos/estatutos pre-cadastrados
 * O botao "Inserir" resolve a norma via backend (sendLegisSEI -> seipro.io)
 * e injeta a ancora .legisSeiPro no texto. A aba Federal tambem oferece busca
 * (getSearchLegis) com resultados clicaveis e botao "Adicionar" por resultado
 * (insertLegisSEI), alem do toggle de ementa (getSearchLegisMore).
 *
 * Portado do monolito sei-pro-editor.js (CK4 cru) para o contrato do adapter:
 *   - oEditor/idEditor/iframeEditor/setParamEditor       -> getInstance/withEdit/findInBody/transformBodyHtml
 *   - oEditor.openDialog('LegisSEI') + CKEDITOR.dialog.* -> SeiProEditorAdapter.openDialog + leitura por id no $box
 *   - oEditor.getSelection().getSelectedText()           -> SeiProEditorAdapter.getSelectedText
 *   - CKEDITOR.dialog.getCurrent().hide()                -> $box.dialog('close')
 *
 * NOTA: initLegis (botao "getLegisButtom"/enumeracao automatica de normas no
 * corpo) NAO pertence a este modulo -- vive em js/sei-legis.js e e' carregado
 * separadamente; por isso nao e' redefinido aqui.
 *
 * Helpers compartilhados (definidos em sei-functions-pro.js / monolito, chamados
 * apenas em tempo de clique): alertaBoxPro, removeAcentos, hasNumber, onlyNumber,
 * verifyConfigValue, setChosenInCke.
 */
(function () {
    'use strict';

    // Referencia ao $box do dialogo atual (substitui CKEDITOR.dialog.getCurrent()).
    // Os handlers onclick gerados na lista de resultados (insertLegisSEI) precisam
    // saber qual dialogo fechar.
    var _legisBox = null;

    // ----------------------------------------------------------------
    // INSERE LINK DE NORMAS
    // Resolve a sigla da norma no backend e injeta a ancora .legisSeiPro.
    // ----------------------------------------------------------------
    window.sendLegisSEI = function (nomeLegis) {
        var editor = SeiProEditorAdapter.getInstance();
        if (!editor) return;
        var url = 'https://seipro.io/legis/';
        $.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            data: { norma: [nomeLegis] },
            success: function (legisData) {
                if (legisData[0].status == 0) {
                    alertaBoxPro('Error', 'exclamation-triangle', 'Nenhuma legisla\u00E7\u00E3o encontrada');
                } else {
                    var nomeNorma = (legisData.length && legisData[0].NomeNorma) ? '&nbsp;(' + legisData[0].NomeNorma + ')' : '';
                    var htmlLegis = (legisData.length) ? '<a class="ancoraSei legisSeiPro" data-norma="' + legisData[0].SiglaNorma + '" data-normafull="' + legisData[0].DescNormaFull + '" data-index="0" href="' + legisData[0].Link + '" target="_blank">' + legisData[0].DescNormaFull + nomeNorma.trim() + '</a>' : '';
                    SeiProEditorAdapter.withEdit(editor, function () {
                        SeiProEditorAdapter.insertHtml(editor, htmlLegis);
                        uniqLinkLegisSEI();
                    });
                }
            }
        });
    };

    // ----------------------------------------------------------------
    // Insere a norma de um resultado de busca (clona a ancora .legisSeiPro do
    // <p> do resultado clicado) e fecha o dialogo.
    // ----------------------------------------------------------------
    window.insertLegisSEI = function (this_) {
        var editor = SeiProEditorAdapter.getInstance();
        if (!editor) return;
        var htmlLegis = $('<div>').append($(this_).closest('p').find('.legisSeiPro').clone().removeAttr('style').removeClass('linkDialog')).html();
        SeiProEditorAdapter.withEdit(editor, function () {
            SeiProEditorAdapter.insertHtml(editor, htmlLegis);
            uniqLinkLegisSEI();
        });
        if (_legisBox) { try { _legisBox.dialog('close'); } catch (e) {} }
    };

    // ----------------------------------------------------------------
    // Deduplica o texto de links repetidos da mesma norma no corpo do documento.
    // CK4: manipulava o iframe direto; aqui usamos transformBodyHtml (uniforme).
    // ----------------------------------------------------------------
    window.uniqLinkLegisSEI = function () {
        var editor = SeiProEditorAdapter.getInstance();
        if (!editor) return;
        SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
            var doc = new DOMParser().parseFromString('<!doctype html><html><body>' + html + '</body></html>', 'text/html');
            var body = doc.body;
            var arrayRef = [];
            var nodes = Array.prototype.slice.call(body.querySelectorAll('.legisSeiPro'));
            nodes.forEach(function (node) {
                var refNorma = node.getAttribute('data-norma');
                if (body.querySelectorAll('a[data-norma="' + refNorma + '"]').length > 1) {
                    var text = node.getAttribute('data-normafull') || '';
                    var newTextArr = text.split(',');
                    var textDate = (newTextArr[1]) ? newTextArr[1].trim().split(' ')[5] : undefined;
                    var newText = (typeof textDate !== 'undefined' && arrayRef.indexOf(refNorma) !== -1) ? newTextArr[0].trim() + ', de ' + textDate : text;
                    node.textContent = newText;
                }
                arrayRef.push(refNorma);
            });
            return body.innerHTML;
        });
    };

    // ----------------------------------------------------------------
    // Entrada da toolbar: abre o dialogo de insercao de link de legislacao.
    // No SEI 5 a busca ainda esta em migracao -> aviso e retorno.
    // ----------------------------------------------------------------
    window.getLegisSEI = function (this_) {
        if (SeiProEditorAdapter && SeiProEditorAdapter.version === 5) {
            alertaBoxPro('Info', 'info-circle', 'Busca de legisla\u00E7\u00E3o em migra\u00E7\u00E3o para o SEI 5.');
            return;
        }
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        openDialogLegisSEI(editor);
    };

    // ----------------------------------------------------------------
    // Toggle ementa resumida/completa em uma linha de resultado.
    // ----------------------------------------------------------------
    window.getSearchLegisMore = function (this_) {
        var parent = $(this_).closest('tr');
        if (!parent.find('.searchLegis_ementa').is(':hidden')) {
            parent.find('.searchLegis_ementa').hide();
            parent.find('.searchLegis_ementafull').show();
        } else {
            parent.find('.searchLegis_ementa').show();
            parent.find('.searchLegis_ementafull').hide();
        }
    };

    // ----------------------------------------------------------------
    // Busca de normas (aba Federal). Le os campos por id dentro do $box do
    // dialogo (substitui CKEDITOR.dialog.getCurrent().getContentElement).
    // ----------------------------------------------------------------
    window.getSearchLegis = function (this_) {
        var $box = _legisBox || $(this_).closest('.dialogBoxDiv');
        if (!$box || !$box.length) return;

        var inputTipo = $box.find('#legis_tipoNorma option:selected').text();
        var inputTermo = $box.find('#legis_termoNorma').val() || '';
        var inputNumero = $box.find('#legis_numeroNorma').val() || '';
        var inputAno = $box.find('#legis_anoNorma').val() || '';
        var periodo = $box.find('#legis_periodoNorma').val() || '';

        var url = 'https://seipro.io/legis/search.php';
        var tipo = encodeURI(removeAcentos(inputTipo.toUpperCase().trim()));
        var termo = encodeURI(inputTermo.trim());
        var numero = (inputNumero.indexOf('/') !== -1) ? inputNumero.split('/')[0] : inputNumero;
            numero = numero.replace(/[^0-9\-]+/g, '');
            numero = encodeURI(numero.trim());
        var ano = encodeURI(inputAno.trim());

        $box.find('#searchLegis_load').show();
        $box.find('#searchLegis_result').html('').hide();

        $.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            data: {
                tipo: tipo,
                numero: numero,
                ano: ano,
                periodo: periodo,
                termo: termo
            },
            success: function (legisData) {
                if (legisData.status == 0) {
                    $box.find('#searchLegis_load').hide();
                    alertaBoxPro('Error', 'exclamation-triangle', 'Erro interno do servidor :( Tente novamente mais tarde');
                } else {
                    var htmlResult = '<table>' +
                                     ' <tbody>';

                    $.each(legisData.docs, function (i, val) {
                        var ementa = val.dsc_ementa.replace(/(\r\n|\n|\r)/gm, '');
                            ementa = (ementa.indexOf(' ') !== -1 && ementa.split(' ')[0] === ementa.split(' ')[0].toUpperCase()) ? ementa.charAt(0).toUpperCase() + ementa.toLocaleLowerCase().slice(1) : ementa;
                        var ementa_limited = (ementa.length > 170) ? ementa.replace(/^(.{170}[^\s]*).*/, '$1') + '...' : ementa;
                        var datanorma = (val.dsc_tipo_epigrafe == 'Decreto') ? 'Dec' : val.dsc_tipo_epigrafe;
                            datanorma = (val.dsc_tipo_epigrafe == 'Medida Provis\u00F3ria') ? 'Mp' : datanorma;
                            datanorma = (val.dsc_tipo_epigrafe == 'Lei Complementar') ? 'LC' : datanorma;
                            datanorma = (val.dsc_tipo_epigrafe == 'Decreto-Lei') ? 'DecLei' : datanorma;
                            datanorma = (datanorma.indexOf(' ') !== -1) ? datanorma.split(' ').join('') : datanorma;
                            datanorma = datanorma + val.num_ato;
                        var nomenorma = (val.dsc_identificacao.indexOf(' de ') !== -1) ? val.dsc_identificacao.replace(' de ', ', de ') : val.dsc_identificacao;

                        var ementa_limited_link = (ementa.length > 170) ? '<a class="linkDialog" onclick="getSearchLegisMore(this)">mais</a>' : '';
                        var style_normaRevogada = (val.dsc_situacao_macro == 'Revogado') ? 'text-decoration: line-through; color: #adadad;' : 'color: #444;';
                        var text_normaRevogada = (val.dsc_situacao_macro == 'Revogado') ? '<span style="background: #e0e0e0; padding: 1px 5px; color: #444; border-radius: 5px; margin-left: 10px;">Revogada</span>' : '';
                        var btnInsertLegis = '<span onclick="insertLegisSEI(this)" style="float: right; background: #e7effd; padding: 3px 5px; color: #4285f4; border-radius: 5px; margin-left: 10px; cursor: pointer;"><i class="fas fa-pen azulColor" style="font-size: 90%; cursor: pointer;"></i> Adicionar</span>';
                        htmlResult += '     <tr style="border-bottom: 2px solid #efefef;">' +
                                      '         <td>' +
                                      '             <p style="padding: 10px 0 2px 0;">' +
                                      '                 <a class="linkDialog ancoraSei legisSeiPro" style="font-size: 13px;" data-norma="' + datanorma + '" data-normafull="' + nomenorma + '" data-index="0" href="' + val.url + '" target="_blank">' + nomenorma + ' <i class="fas fa-external-link-alt linkDialog" style="font-size: 80%;"></i></a> ' + text_normaRevogada + btnInsertLegis +
                                      '             </p>' +
                                      '             <p class="searchLegis_ementa" style="padding: 6px 0 10px 0; font-style: italic; word-break: break-word; white-space: break-spaces; width: 500px; ' + style_normaRevogada + '">' + ementa_limited + ' ' + ementa_limited_link + '</p>' +
                                      '             <p class="searchLegis_ementafull" style="display:none; padding: 6px 0 10px 0; font-style: italic; word-break: break-word; white-space: break-spaces; width: 500px; ' + style_normaRevogada + '">' + ementa + ' <a class="linkDialog" onclick="getSearchLegisMore(this)">menos</a></p>' +
                                      '         </td>' +
                                      '     </tr>';
                    });
                    if (legisData.numFound > 50) {
                        htmlResult += '     <tr>' +
                                      '         <td>' +
                                      '             <p style="margin: 10px;text-align: center;background: #fdfbe4;padding: 5px;border-radius: 5px;"><i class="fas fa-info-circle azulColor"></i> Atingido o limite de 50 resultados. Restrinja sua pesquisa.</p>' +
                                      '         </td>' +
                                      '     </tr>';
                    } else if (legisData.numFound == 0) {
                        htmlResult += '     <tr>' +
                                      '         <td>' +
                                      '             <p style="margin: 10px;text-align: center;background: #fdfbe4;padding: 5px;border-radius: 5px;"><i class="fas fa-info-circle azulColor"></i> Nenhum resultado encontrado :(</p>' +
                                      '         </td>' +
                                      '     </tr>';
                    }
                    htmlResult += ' </tbody>' +
                                  '</table>';
                    $box.find('#searchLegis_load').hide();
                    $box.find('#searchLegis_result').html(htmlResult).show();
                }
            }
        });
    };

    // ----------------------------------------------------------------
    // Compat com initFunctions()/boot do monolito (tryRun(getDialogLegisSEI)).
    // O dialogo CK4 (CKEDITOR.dialog.add) virou jQuery UI on-demand; o registro
    // antecipado deixa de ser necessario -> no-op.
    // ----------------------------------------------------------------
    window.getDialogLegisSEI = function () { /* no-op: dialogo on-demand em openDialogLegisSEI() */ };

    // ----------------------------------------------------------------
    // Abre o dialogo jQuery UI (substitui CKEDITOR.dialog 'LegisSEI').
    // Tres abas + secao de busca. Le os campos por id no $box.
    // ----------------------------------------------------------------
    function optionsHtml(items) {
        // items: array de [label, value] (ou [label] vazio). Gera <option>s.
        var out = '';
        for (var i = 0; i < items.length; i++) {
            var label = items[i][0] || '';
            var value = (items[i].length > 1) ? items[i][1] : '';
            out += '<option value="' + value + '">' + label + '</option>';
        }
        return out;
    }

    function openDialogLegisSEI(editor) {
        var itemsTipoFederal = [
            [''], ['Lei', 'Lei'], ['Lei Complementar', 'LC'], ['Decreto', 'Dec'],
            ['Decreto-Lei', 'DecLei'], ['Medida Provis\u00F3ria', 'Mp']
        ];
        var itemsPeriodo = [
            [''], ['No ano', 'ano'], ['At\u00E9 o ano de...', 'ate'], ['Ap\u00F3s o ano de...', 'apos']
        ];
        var itemsOrgaoInfra = [
            [''], ['ANTAQ', 'Antaq'], ['Cade', 'Cade'], ['PRF', 'PRF'], ['TSE', 'Tse'],
            ['TRE RR', 'Trerr'], ['TJ RR', 'TJRR'], ['CNJ', 'CNJ']
        ];
        var itemsTipoInfra = [
            [''], ['Acordo/Plano/Ato/Nota', 'acord'], ['Ata e Certid\u00F5es de Julgamento', 'atas'],
            ['Constitui\u00E7\u00E3o Estadual', 'ce'], ['Decreto Estadual', 'decest'], ['Edital', 'Edit'],
            ['Enunciado Administrativo', 'enumadm'], ['Emenda Constitucional', 'ec'],
            ['Emenda Regimental', 'er'], ['Emendas', 'Emenda'], ['Instru\u00E7\u00E3o Normativa', 'in'],
            ['Instru\u00E7\u00E3o Normativa Conjunta', 'resconj'], ['Lei Complementar Estadual', 'lce'],
            ['Lei Estadual', 'leiest'], ['Lei Municipal', 'leimun'], ['Nota T\u00E9cnica', 'nt'],
            ['Orienta\u00E7\u00E3o Normativa', 'on'], ['Portaria', 'port'], ['Portaria Conjunta', 'portconj'],
            ['Portaria Interministerial', 'portinter'], ['Portaria Interinstitucional', 'portinst'],
            ['Provimento', 'prov'], ['Recomenda\u00E7\u00E3o', 'Rec'], ['Regimento Interno', 'regim'],
            ['Resolu\u00E7\u00E3o Normativa', 'rn'], ['Resolu\u00E7\u00E3o', 'res'], ['Resolu\u00E7\u00E3o Conjunta', 'resconj'],
            ['S\u00FAmula Administrativa', 'sum']
        ];
        var itemsListaNormas = [
            [''], ['C\u00F3digo Brasileiro de Aeron\u00E1utica', 'Cba'], ['C\u00F3digo Brasileiro de Telecomunica\u00E7\u00F5es', 'Cbt'],
            ['C\u00F3digo Civil', 'Cc'], ['C\u00F3digo Comercial', 'Ccm'], ['C\u00F3digo de Defesa do Consumidor', 'Cdc'],
            ['Constitui\u00E7\u00E3o Federal', 'Cf'], ['C\u00F3digo Florestal', 'Cflorestal'],
            ['Consolida\u00E7\u00E3o das Leis do Trabalho', 'Clt'], ['C\u00F3digo de \u00C1guas', 'Codigoaguas'],
            ['C\u00F3digo Eleitoral', 'Codigoeleitoral'], ['C\u00F3digo de Minas', 'Codigominas'],
            ['C\u00F3digo Penal', 'Cp'], ['C\u00F3digo de Processo Civil', 'Cpc'], ['C\u00F3digo Penal Militar', 'Cpm'],
            ['C\u00F3digo de Processo Penal', 'Cpp'], ['C\u00F3digo de Processo Penal Militar', 'Cppm'],
            ['C\u00F3digo de Tr\u00E2nsito Brasileiro', 'Ctb'], ['C\u00F3digo Tribut\u00E1rio Nacional', 'Ctn'],
            ['Estatuto da Crian\u00E7a e do Adolescente', 'Eca'], ['Estatuto da Cidade', 'Estatutocidade'],
            ['Estatuto do Desarmamento', 'Estatutodesarmamento'], ['Estatuto do Idoso', 'Estatutoidoso'],
            ['Estatuto da Igualdade Racial', 'Estatutoigualdaderacial'], ['Estatuto do \u00CDndio', 'Estatutoindio'],
            ['Estatuto da Juventude', 'Estatutojuventude'],
            ['Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte', 'Estatutomicroempresas'],
            ['Estatuto dos Militares', 'Estatutomilitares'], ['Estatuto dos Museus', 'Estatutomuseus'],
            ['Estatuto da Advocacia e da Ordem dos Advogados do Brasil (OAB)', 'Estatutooab'],
            ['Estatuto da Pessoa com Defici\u00EAncia', 'Estatutopcd'], ['Estatuto dos Refugiados', 'Estatutorefugiados'],
            ['Estatuto da Terra', 'Estatutoterra'], ['Estatuto de Defesa do Torcedor', 'Estatutotorcedor']
        ];

        var htmlBox =
            '<div class="dialogBoxDiv seipro-dialog-compact" style="font-size:13px;line-height:1.4;color:#333;font-family:Arial,sans-serif;">' +
                '<style>' +
                    '.seipro-dialog-compact, .seipro-dialog-compact * { box-sizing:border-box; font-size:13px; }' +
                    '.seipro-dialog-compact label { display:block; font-size:12px; color:#555; margin-bottom:2px; }' +
                    '.seipro-dialog-compact input, .seipro-dialog-compact select { width:100%; font-size:13px; padding:4px 6px; border:1px solid #ccc; border-radius:3px; line-height:1.3; }' +
                    '.seipro-dialog-compact .legisField { margin-bottom:8px; }' +
                    '.seipro-dialog-compact .ui-tabs-nav { font-size:12px; padding:0; }' +
                    '.seipro-dialog-compact .ui-tabs-nav .ui-tabs-anchor { padding:6px 12px; font-size:12px; }' +
                    '.seipro-dialog-compact .ui-tabs .ui-tabs-panel { padding:10px 12px; font-size:13px; }' +
                    '.seipro-dialog-compact .linkDialog { color:#4285f4; cursor:pointer; }' +
                    '.seipro-dialog-compact .legisSearchBtn { user-select:none; display:inline-block; padding:5px 14px; background:#f1f1f1; border:1px solid #ccc; border-radius:4px; cursor:pointer; }' +
                '</style>' +
                '<div id="legisTabs" class="seiProTabs">' +
                    '<ul>' +
                        '<li><a href="#legisTabFederal">Legisla\u00E7\u00E3o Federal</a></li>' +
                        '<li><a href="#legisTabInfra">Norma Infralegal</a></li>' +
                        '<li><a href="#legisTabLista">Lista de Normas</a></li>' +
                    '</ul>' +
                    '<div id="legisTabFederal">' +
                        '<div class="legisField"><label for="legis_tipoNorma">Tipo de Legisla\u00E7\u00E3o</label><select id="legis_tipoNorma">' + optionsHtml(itemsTipoFederal) + '</select></div>' +
                        '<div class="legisField"><label for="legis_numeroNorma">N\u00FAmero da Legisla\u00E7\u00E3o</label><input type="number" id="legis_numeroNorma"></div>' +
                        '<div class="legisField"><label for="legis_periodoNorma">Per\u00EDodo da Publica\u00E7\u00E3o</label><select id="legis_periodoNorma">' + optionsHtml(itemsPeriodo) + '</select></div>' +
                        '<div class="legisField"><label for="legis_anoNorma">Ano da Publica\u00E7\u00E3o</label><input type="number" id="legis_anoNorma"></div>' +
                        '<div class="legisField"><label for="legis_termoNorma">Conte\u00FAdo da Legisla\u00E7\u00E3o (palavras-chave)</label><input type="text" id="legis_termoNorma"></div>' +
                        '<div style="text-align:right;margin-top:6px;">' +
                            '<a id="searchLegis_uiElement" class="legisSearchBtn" onclick="getSearchLegis(this)" title="Pesquisar">Pesquisar</a>' +
                            '<i id="searchLegis_load" class="fas fa-sync-alt fa-spin" style="margin-left: 10px; display:none"></i>' +
                        '</div>' +
                        '<div id="searchLegis_result" style="display:none; height: 250px; overflow-y: scroll; margin-top: 15px;"></div>' +
                    '</div>' +
                    '<div id="legisTabInfra">' +
                        '<div class="legisField"><label for="legis_orgaoInfraNorma">Autoridade Signat\u00E1ria</label><select id="legis_orgaoInfraNorma">' + optionsHtml(itemsOrgaoInfra) + '</select></div>' +
                        '<div class="legisField"><label for="legis_tipoInfraNorma">Tipo de Legisla\u00E7\u00E3o</label><select id="legis_tipoInfraNorma">' + optionsHtml(itemsTipoInfra) + '</select></div>' +
                        '<div class="legisField"><label for="legis_numeroInfraNorma">N\u00FAmero da Norma</label><input type="number" id="legis_numeroInfraNorma"></div>' +
                    '</div>' +
                    '<div id="legisTabLista">' +
                        '<div class="legisField"><label for="legis_nomeNorma">Nome da Legisla\u00E7\u00E3o</label><select id="legis_nomeNorma">' + optionsHtml(itemsListaNormas) + '</select></div>' +
                    '</div>' +
                '</div>' +
            '</div>';

        _legisBox = SeiProEditorAdapter.openDialog({
            id: 'dialogLegisPro',
            title: 'Adicionar Link de Legisla\u00E7\u00E3o',
            html: htmlBox,
            width: 560,
            height: 'auto',
            onOpen: function ($box) {
                _legisBox = $box;
                var $tabs = $box.find('#legisTabs');
                if ($tabs.tabs) $tabs.tabs();

                // Pre-seleciona tipo/numero a partir do texto selecionado no editor.
                var textSelected = SeiProEditorAdapter.getSelectedText(editor) || '';
                var selectNorma = $box.find('#legis_tipoNorma');
                var numNorma = $box.find('#legis_numeroNorma');
                var lower = textSelected.toLowerCase();
                if (lower.indexOf('lei complementar') !== -1 || lower.indexOf('lc') !== -1) {
                    selectNorma.val('LC').trigger('change');
                } else if (lower.indexOf('decreto-lei') !== -1 || lower.indexOf('dc') !== -1) {
                    selectNorma.val('DecLei').trigger('change');
                } else if (lower.indexOf('medida provis\u00F3ria') !== -1 || lower.indexOf('mp') !== -1) {
                    selectNorma.val('Mp').trigger('change');
                } else if (lower.indexOf('decreto') !== -1 || lower.indexOf('dec') !== -1) {
                    selectNorma.val('Dec').trigger('change');
                } else if (lower.indexOf('lei') !== -1) {
                    selectNorma.val('Lei').trigger('change');
                }

                if (typeof hasNumber === 'function' && hasNumber(textSelected)) {
                    var numInput = (lower.indexOf('/') !== -1) ? textSelected.split('/')[0] : textSelected;
                        numInput = (lower.indexOf(',') !== -1) ? textSelected.split(',')[0] : numInput;
                        numInput = (hasNumber(numInput)) ? onlyNumber(numInput) : '';
                    numNorma.val(numInput);
                }

                try { if (verifyConfigValue('substituiselecao') && typeof setChosenInCke === 'function') setChosenInCke(); } catch (e) {}
            },
            onClose: function () { _legisBox = null; },
            buttons: [{
                text: 'Inserir',
                primary: true,
                click: function ($box) {
                    var tipoNorma = $box.find('#legis_tipoNorma').val() || '';
                    var numeroNorma = $box.find('#legis_numeroNorma').val() || '';
                    var orgaoInfraNorma = $box.find('#legis_orgaoInfraNorma').val() || '';
                    var tipoInfraNorma = $box.find('#legis_tipoInfraNorma').val() || '';
                    var numeroInfraNorma = $box.find('#legis_numeroInfraNorma').val() || '';
                    var nomeNorma = $box.find('#legis_nomeNorma').val() || '';

                    if (tipoNorma != '' && numeroNorma != '') {
                        var nrNorma = (numeroNorma.indexOf('/') !== -1) ? numeroNorma.split('/')[0] : numeroNorma;
                            nrNorma = nrNorma.replace(/[^0-9\-]+/g, '');
                        sendLegisSEI(tipoNorma + nrNorma);
                    } else if (tipoInfraNorma != '' && numeroInfraNorma != '') {
                        var nrInfra = (numeroInfraNorma.indexOf('/') !== -1) ? numeroInfraNorma.split('/')[0] : numeroInfraNorma;
                            nrInfra = nrInfra.replace(/[^0-9\-]+/g, '');
                        sendLegisSEI(orgaoInfraNorma + tipoInfraNorma + nrInfra);
                    } else if (nomeNorma != '') {
                        sendLegisSEI(nomeNorma);
                    }
                    try { $box.dialog('close'); } catch (e) {}
                }
            }]
        });
    }

    // Registra a feature (leve: id). Idempotente.
    SeiProEditorAdapter.registerFeature({ id: 'legis' });
})();
