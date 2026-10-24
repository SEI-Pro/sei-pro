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
 * O botao "Inserir" resolve a norma e injeta a ancora .legisSeiPro no texto.
 * A aba Federal tambem oferece busca (getSearchLegis) com resultados clicaveis
 * e botao "Adicionar" por resultado (insertLegisSEI), alem do toggle de ementa
 * (getSearchLegisMore).
 *
 * Backend: API de Legislacao Federal do SEI Pro (URL_LEGIS_API; documentacao
 * em /docs da mesma base). GET /v1/normas busca com filtros e POST
 * /v1/normas/resolver traduz siglas ("Lei12527", "LC101", "Cf",
 * "Lei14133/2021") em normas. O servico antigo (seipro.io/legis) foi
 * aposentado: a busca dele parou e as normas infralegais da aba propria
 * passam a ser resolvidas pela API (orgao + tipo + numero, ex.: "Antaqres5")
 * a medida que forem incluidas nela.
 *
 * "Inserir" na aba Federal usa a busca, nao o resolver: numero repetido (ha
 * sete Decretos n. 1) lista as opcoes no dialogo em vez de escolher uma no
 * escuro. Com o ano preenchido, a busca ja volta com uma so.
 *
 * resolverNormasLegisPro fica em window porque js/sei-legis.js (enumeracao de
 * normas, refs "@lei8666") tambem resolve siglas por aqui.
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
 * apenas em tempo de clique): alertaBoxPro, hasNumber, onlyNumber,
 * verifyConfigValue, setChosenInCke, htmlPro.
 */
(function () {
    'use strict';

    var URL_LEGIS_API = 'https://legis.seipro.app/v1';
    var LIMITE_BUSCA_LEGIS = 50;

    // Referencia ao $box do dialogo atual (substitui CKEDITOR.dialog.getCurrent()).
    // Os handlers gerados na lista de resultados (insertLegisSEI) precisam
    // saber qual dialogo fechar.
    var _legisBox = null;

    // Normas da ultima lista exibida no dialogo. O "Adicionar" de cada linha
    // aponta para o indice aqui (data-legis-idx) e a ancora e' montada do dado,
    // nao clonada do resultado (que leva o icone de link externo junto).
    var _legisResultados = [];

    // tipo da API (tipo_urn) -> prefixo da sigla gravada em data-norma. E' o
    // formato que o servico antigo gravava ("Lei12527", "LC101", "DecLei200"), o
    // mesmo dos documentos ja escritos.
    var PREFIXO_TIPO_LEGIS = {
        'lei': 'Lei',
        'lei.complementar': 'LC',
        'decreto': 'Dec',
        'decreto.lei': 'DecLei',
        'medida.provisoria': 'Mp',
        'emenda.constitucional': 'Ec',
        'decreto.legislativo': 'DecLeg',
        'resolucao': 'Res'
    };

    function escLegis(valor) {
        return String((valor === null || valor === undefined) ? '' : valor).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function htmlNoAlvoLegis($alvo, html) {
        if (typeof htmlPro === 'function') return htmlPro($alvo, html);
        // Sem o portao (sei-functions-pro.js ainda nao carregou), so o texto: nunca marcacao crua.
        return $alvo.text(String(html === null || html === undefined ? '' : html).replace(/<[^>]*>/g, ''));
    }

    // "Lei n\u00BA 556, de 25 de junho de 1850" -> "Lei n\u00BA 556, de 1850" (citacao repetida).
    function tituloCurtoLegis(titulo) {
        var partes = String(titulo || '').split(',');
        var ano = String(titulo || '').match(/(\d{4})\s*$/);
        return (partes.length > 1 && ano) ? partes[0].trim() + ', de ' + ano[1] : String(titulo || '');
    }

    // O apelido vindo do Senado traz sufixos ("C\u00F3digo Civil (2002) (CC)") e, nos
    // registros antigos, caixa alta ("CODIGO DE AGUAS", "PEC DA REFORMA..."). Tira
    // os sufixos e descarta a caixa alta, que no documento pareceria grito.
    function apelidoLegis(apelido) {
        var texto = String(apelido || '').replace(/\s+/g, ' ').trim();
        while (/\s*\([^()]*\)$/.test(texto)) texto = texto.replace(/\s*\([^()]*\)$/, '').trim();
        if (!texto || texto === texto.toUpperCase()) return '';
        return texto;
    }

    // Norma da API -> forma usada pelo dialogo e pela ancora.
    function normaDaApiLegis(n) {
        var sigla = (n.tipo === 'constituicao')
            ? 'Cf'
            : (PREFIXO_TIPO_LEGIS[n.tipo] || String(n.tipo || '').replace(/[^A-Za-z]/g, '')) + String(n.numero || '').replace(/[^0-9\-]/g, '');
        return {
            sigla: sigla,
            titulo: n.titulo || n.titulo_curto || '',
            curto: n.titulo_curto || tituloCurtoLegis(n.titulo),
            apelido: apelidoLegis(n.apelido),
            url: n.url || (n.urn ? 'https://normas.leg.br/?urn=' + n.urn : ''),
            ementa: n.ementa || '',
            revogada: n.situacao === 'revogada'
        };
    }

    // ----------------------------------------------------------------
    // RESOLVE SIGLAS EM NORMAS
    // O callback recebe um mapa sigla pedida -> norma; sigla sem norma (ou
    // API fora do ar) fica de fora do mapa.
    // ----------------------------------------------------------------
    window.resolverNormasLegisPro = function (refs, callback) {
        var pedidas = [];
        $.each(refs || [], function (i, ref) {
            ref = String(ref || '').trim().slice(0, 60);
            if (ref && pedidas.indexOf(ref) === -1) pedidas.push(ref);
        });
        var achadas = {};
        if (!pedidas.length) { callback(achadas); return; }
        $.ajax({
            type: 'POST',
            url: URL_LEGIS_API + '/normas/resolver',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({ refs: pedidas.slice(0, 200) })
        }).done(function (resp) {
            $.each((resp && resp.resultados) || {}, function (ref, n) {
                if (n) achadas[ref] = normaDaApiLegis(n);
            });
        }).always(function () {
            callback(achadas);
        });
    };

    // Busca com filtros (GET /v1/normas). Filtro vazio nao vai na URL.
    function buscarNormasLegis(filtros, callback) {
        var params = { per_page: LIMITE_BUSCA_LEGIS };
        $.each(filtros, function (nome, valor) {
            if (valor !== '' && valor !== null && valor !== undefined) params[nome] = valor;
        });
        $.ajax({
            type: 'GET',
            url: URL_LEGIS_API + '/normas',
            dataType: 'json',
            data: params
        }).done(function (resp) {
            callback(null, resp || {});
        }).fail(function (xhr) {
            callback(xhr || true, null);
        });
    }

    // Periodo do dialogo -> parametro da API.
    function periodoApiLegis(periodo) {
        return { 'ano': 'exato', 'ate': 'ate', 'apos': 'apos' }[periodo] || 'exato';
    }

    // Numero digitado ("12.527", "2200-2", "8666/93") -> inteiro da API.
    function numeroApiLegis(numero) {
        var n = String(numero || '').split(/[\/\-]/)[0].replace(/[^0-9]+/g, '');
        return n ? parseInt(n, 10) : '';
    }

    // ----------------------------------------------------------------
    // INSERE LINK DE NORMAS
    // ----------------------------------------------------------------
    // Primeira citacao: titulo completo + apelido. Norma que ja esta no documento
    // entra pelo titulo curto ("Lei n\u00BA 12.527, de 2011").
    function htmlAncoraLegis(norma, repetida) {
        var texto = repetida
            ? escLegis(norma.curto || norma.titulo)
            : escLegis(norma.titulo) + (norma.apelido ? '&nbsp;(' + escLegis(norma.apelido) + ')' : '');
        return '<a class="ancoraSei legisSeiPro" data-norma="' + escLegis(norma.sigla) + '" data-normafull="' + escLegis(norma.titulo) + '" data-index="0" href="' + escLegis(norma.url) + '" target="_blank">' + texto + '</a>';
    }

    // A deduplicacao antiga (uniqLinkLegisSEI) reescrevia o corpo inteiro depois de
    // inserir: no CK4 isso perdia a selecao e a insercao seguinte caia DENTRO do link
    // anterior, que o editor partia em dois; no CK5 o data.set trocava o documento todo.
    // Decidir o texto antes de inserir dispensa mexer no que ja esta escrito.
    function inserirNormaLegis(norma) {
        var editor = SeiProEditorAdapter.getInstance();
        if (!editor || !norma) return;
        // Pelo href tambem, nao so pelo data-norma: no CK5 a classe e os data-* do
        // link so sobrevivem com o GHS registrado para <a>, e o ghs-unlock adia esse
        // registro em documento com comentarios -- ai o link entra so com o href.
        // O data-norma continua valendo para os links antigos (href do Planalto).
        var repetida = SeiProEditorAdapter.findInBody(editor, 'a').filter(function () {
            return (norma.url && this.getAttribute('href') === norma.url) || this.getAttribute('data-norma') === norma.sigla;
        }).length > 0;
        var htmlLegis = htmlAncoraLegis(norma, repetida);
        // insertElement, nao insertHtml: no CK4 o insertHtml deixava o cursor DENTRO
        // do link, e a norma seguinte partia o link anterior (ou se fundia a ele, se
        // fosse a mesma). O insertElement do CK4 poe o cursor depois do elemento; no
        // CK5 o adapter faz o mesmo que o insertHtml.
        // A selecao e guardada ANTES do foco e devolvida depois dele. O dialogo, ao
        // fechar, devolve o foco do DOM ao editor; o navegador poe o cursor no inicio
        // da area editavel e, no editor.focus() do withEdit, o CK5 adota essa posicao
        // (medido no SEI 5.0.4: a selecao ia de [19,97] para [0,0] dentro do focus, e
        // a norma entrava no primeiro paragrafo do corpo).
        var selecao = SeiProEditorAdapter.saveSelection(editor);
        SeiProEditorAdapter.withEdit(editor, function () {
            if (selecao) SeiProEditorAdapter.restoreSelection(editor, selecao);
            SeiProEditorAdapter.insertElement(editor, htmlLegis);
        });
    }

    // Fecha antes de inserir: o dialogo e modal e o jQuery UI prende o foco nele,
    // brigando com o editor.focus() da insercao. A posicao do cursor quem garante
    // e o saveSelection/restoreSelection de inserirNormaLegis.
    function fecharDialogoLegis($box) {
        var alvo = $box || _legisBox;
        if (alvo) { try { alvo.dialog('close'); } catch (e) {} }
    }

    // Resolve uma sigla (abas Infralegal e Lista) e insere a norma.
    window.sendLegisSEI = function (nomeLegis) {
        if (!SeiProEditorAdapter.getInstance()) return;
        resolverNormasLegisPro([nomeLegis], function (achadas) {
            var norma = achadas[String(nomeLegis || '').trim()];
            if (!norma) {
                alertaBoxPro('Error', 'exclamation-triangle', 'Nenhuma legisla\u00E7\u00E3o encontrada');
                return;
            }
            inserirNormaLegis(norma);
        });
    };

    // Fecha o dialogo e insere a norma de uma linha da lista de resultados.
    window.insertLegisSEI = function (this_) {
        var norma = _legisResultados[parseInt($(this_).attr('data-legis-idx'), 10)];
        if (!norma) return;
        fecharDialogoLegis();
        inserirNormaLegis(norma);
    };

    // ----------------------------------------------------------------
    // Entrada da toolbar: abre o dialogo de insercao de link de legislacao.
    // ----------------------------------------------------------------
    window.getLegisSEI = function (this_) {
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
    // Lista de resultados na aba Federal (busca ou numero repetido no Inserir).
    // ----------------------------------------------------------------
    function linhaAvisoLegis(texto) {
        return '     <tr>' +
               '         <td>' +
               '             <p style="margin: 10px;text-align: center;background: #fdfbe4;padding: 5px;border-radius: 5px;"><i class="fas fa-info-circle azulColor"></i> ' + texto + '</p>' +
               '         </td>' +
               '     </tr>';
    }

    function linhaResultadoLegis(norma, i) {
        var ementa = String(norma.ementa || '').replace(/(\r\n|\n|\r)/gm, ' ').trim();
            ementa = (/[A-Z]/.test(ementa) && ementa === ementa.toUpperCase()) ? ementa.charAt(0) + ementa.toLocaleLowerCase().slice(1) : ementa;
        var ementa_limited = (ementa.length > 170) ? ementa.replace(/^(.{170}[^\s]*).*/, '$1') + '...' : ementa;
        var ementa_limited_link = (ementa.length > 170) ? '<a class="linkDialog" data-spro-click="getSearchLegisMore">mais</a>' : '';
        var style_normaRevogada = (norma.revogada) ? 'text-decoration: line-through; color: #adadad;' : 'color: #444;';
        var text_normaRevogada = (norma.revogada) ? '<span style="background: #e0e0e0; padding: 1px 5px; color: #444; border-radius: 5px; margin-left: 10px;">Revogada</span>' : '';
        var text_apelido = (norma.apelido) ? ' <span style="color: #777;">(' + escLegis(norma.apelido) + ')</span>' : '';
        var btnInsertLegis = '<span data-spro-click="insertLegisSEI" data-legis-idx="' + i + '" style="float: right; background: #e7effd; padding: 3px 5px; color: #4285f4; border-radius: 5px; margin-left: 10px; cursor: pointer;"><i class="fas fa-pen azulColor" style="font-size: 90%; cursor: pointer;"></i> Adicionar</span>';
        return '     <tr style="border-bottom: 2px solid #efefef;">' +
               '         <td>' +
               '             <p style="padding: 10px 0 2px 0;">' +
               '                 <a class="linkDialog" style="font-size: 13px;" href="' + escLegis(norma.url) + '" target="_blank" rel="noopener noreferrer">' + escLegis(norma.titulo) + ' <i class="fas fa-external-link-alt linkDialog" style="font-size: 80%;"></i></a>' + text_apelido + ' ' + text_normaRevogada + btnInsertLegis +
               '             </p>' +
               (ementa ?
               '             <p class="searchLegis_ementa" style="padding: 6px 0 10px 0; font-style: italic; word-break: break-word; white-space: break-spaces; width: 500px; ' + style_normaRevogada + '">' + escLegis(ementa_limited) + ' ' + ementa_limited_link + '</p>' +
               '             <p class="searchLegis_ementafull" style="display:none; padding: 6px 0 10px 0; font-style: italic; word-break: break-word; white-space: break-spaces; width: 500px; ' + style_normaRevogada + '">' + escLegis(ementa) + ' <a class="linkDialog" data-spro-click="getSearchLegisMore">menos</a></p>'
               : '') +
               '         </td>' +
               '     </tr>';
    }

    function exibirResultadosLegis($box, normas, total, aviso) {
        _legisResultados = normas;
        var htmlResult = '<table>' +
                         ' <tbody>';
        if (aviso) htmlResult += linhaAvisoLegis(aviso);
        $.each(normas, function (i, norma) { htmlResult += linhaResultadoLegis(norma, i); });
        if (total > normas.length) {
            htmlResult += linhaAvisoLegis('Mostrando ' + normas.length + ' de ' + total + ' resultados. Restrinja sua pesquisa.');
        } else if (!normas.length) {
            htmlResult += linhaAvisoLegis('Nenhum resultado encontrado :(');
        }
        htmlResult += ' </tbody>' +
                      '</table>';
        $box.find('#searchLegis_load').hide();
        try { $box.find('#legisTabs').tabs('option', 'active', 0); } catch (e) {}
        htmlNoAlvoLegis($box.find('#searchLegis_result'), htmlResult).show();
    }

    function avisarFalhaApiLegis($box) {
        $box.find('#searchLegis_load').hide();
        alertaBoxPro('Error', 'exclamation-triangle', 'Servi\u00E7o de legisla\u00E7\u00E3o indispon\u00EDvel no momento. Tente novamente mais tarde.');
    }

    // ----------------------------------------------------------------
    // Busca de normas (aba Federal). Le os campos por id dentro do $box do
    // dialogo (substitui CKEDITOR.dialog.getCurrent().getContentElement).
    // ----------------------------------------------------------------
    window.getSearchLegis = function (this_) {
        var $box = _legisBox || $(this_).closest('.dialogBoxDiv');
        if (!$box || !$box.length) return;

        var tipo = $box.find('#legis_tipoNorma').val() || '';
        var termo = String($box.find('#legis_termoNorma').val() || '').trim();
        var numero = numeroApiLegis($box.find('#legis_numeroNorma').val());
        var ano = String($box.find('#legis_anoNorma').val() || '').trim();
        var periodo = $box.find('#legis_periodoNorma').val() || '';

        // Tudo em branco tambem vale: a API devolve as normas mais recentes (a
        // pagina de ajuda, pages/LINKLEGIS.md, ensina esse atalho).
        $box.find('#searchLegis_load').show();
        $box.find('#searchLegis_result').hide();

        buscarNormasLegis({
            q: termo,
            tipo: tipo,
            numero: numero,
            ano: ano,
            periodo: ano ? periodoApiLegis(periodo) : ''
        }, function (erro, resp) {
            if (erro) { avisarFalhaApiLegis($box); return; }
            exibirResultadosLegis($box, $.map(resp.itens || [], normaDaApiLegis), resp.total || 0);
        });
    };

    // "Inserir" na aba Federal: uma norma so entra direto; numero repetido
    // vira lista para o usuario escolher.
    function inserirFederalLegis($box, tipo, numero, ano, periodo) {
        $box.find('#searchLegis_load').show();
        buscarNormasLegis({
            tipo: tipo,
            numero: numero,
            ano: ano,
            periodo: ano ? periodoApiLegis(periodo) : ''
        }, function (erro, resp) {
            if (erro) { avisarFalhaApiLegis($box); return; }
            var normas = $.map(resp.itens || [], normaDaApiLegis);
            $box.find('#searchLegis_load').hide();
            if (normas.length === 1 && (resp.total || 0) <= 1) {
                fecharDialogoLegis($box);
                inserirNormaLegis(normas[0]);
            } else if (!normas.length) {
                alertaBoxPro('Error', 'exclamation-triangle', 'Nenhuma legisla\u00E7\u00E3o encontrada');
            } else {
                exibirResultadosLegis($box, normas, resp.total || normas.length, 'H\u00E1 ' + (resp.total || normas.length) + ' normas com esse n\u00FAmero. Escolha abaixo ou informe o ano.');
            }
        });
    }

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

    // Tipo pela selecao do editor ("Lei Complementar n\u00BA 101" -> lei.complementar).
    // Ordem importa: "decreto-lei" e "decreto legislativo" antes de "decreto".
    function tipoDaSelecaoLegis(texto) {
        var t = String(texto || '').toLowerCase();
        if (/emenda constitucional|\bec\b/.test(t)) return 'emenda.constitucional';
        if (/decreto legislativo/.test(t)) return 'decreto.legislativo';
        if (/lei complementar|\blc\b/.test(t)) return 'lei.complementar';
        if (/decreto-lei|decreto lei|\bdl\b/.test(t)) return 'decreto.lei';
        if (/medida provis[o\u00F3]ria|\bmp\b/.test(t)) return 'medida.provisoria';
        if (/decreto|\bdec\b/.test(t)) return 'decreto';
        if (/\blei\b/.test(t)) return 'lei';
        return '';
    }

    function openDialogLegisSEI(editor) {
        // Valores = tipo da API (tipo_urn).
        var itemsTipoFederal = [
            [''], ['Lei', 'lei'], ['Lei Complementar', 'lei.complementar'], ['Decreto', 'decreto'],
            ['Decreto-Lei', 'decreto.lei'], ['Medida Provis\u00F3ria', 'medida.provisoria'],
            ['Emenda Constitucional', 'emenda.constitucional'], ['Decreto Legislativo', 'decreto.legislativo']
        ];
        var itemsPeriodo = [
            [''], ['No ano', 'ano'], ['At\u00E9 o ano de...', 'ate'], ['Ap\u00F3s o ano de...', 'apos']
        ];
        // Sigla orgao + tipo + numero ("Antaqres5"), resolvida pela API conforme as
        // normas infralegais forem incluidas nela.
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
        // Sigla com ano: o numero sozinho e' ambiguo (Lei 556 e Decreto 24.643
        // existem em mais de um ano).
        var itemsListaNormas = [
            [''], ['C\u00F3digo Brasileiro de Aeron\u00E1utica', 'Lei7565/1986'], ['C\u00F3digo Brasileiro de Telecomunica\u00E7\u00F5es', 'Lei4117/1962'],
            ['C\u00F3digo Civil', 'Lei10406/2002'], ['C\u00F3digo Comercial', 'Lei556/1850'], ['C\u00F3digo de Defesa do Consumidor', 'Lei8078/1990'],
            ['Constitui\u00E7\u00E3o Federal', 'Cf'], ['C\u00F3digo Florestal', 'Lei12651/2012'],
            ['Consolida\u00E7\u00E3o das Leis do Trabalho', 'DecLei5452/1943'], ['C\u00F3digo de \u00C1guas', 'Dec24643/1934'],
            ['C\u00F3digo Eleitoral', 'Lei4737/1965'], ['C\u00F3digo de Minas', 'DecLei227/1967'],
            ['C\u00F3digo Penal', 'DecLei2848/1940'], ['C\u00F3digo de Processo Civil', 'Lei13105/2015'], ['C\u00F3digo Penal Militar', 'DecLei1001/1969'],
            ['C\u00F3digo de Processo Penal', 'DecLei3689/1941'], ['C\u00F3digo de Processo Penal Militar', 'DecLei1002/1969'],
            ['C\u00F3digo de Tr\u00E2nsito Brasileiro', 'Lei9503/1997'], ['C\u00F3digo Tribut\u00E1rio Nacional', 'Lei5172/1966'],
            ['Estatuto da Crian\u00E7a e do Adolescente', 'Lei8069/1990'], ['Estatuto da Cidade', 'Lei10257/2001'],
            ['Estatuto do Desarmamento', 'Lei10826/2003'], ['Estatuto do Idoso', 'Lei10741/2003'],
            ['Estatuto da Igualdade Racial', 'Lei12288/2010'], ['Estatuto do \u00CDndio', 'Lei6001/1973'],
            ['Estatuto da Juventude', 'Lei12852/2013'],
            ['Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte', 'LC123/2006'],
            ['Estatuto dos Militares', 'Lei6880/1980'], ['Estatuto dos Museus', 'Lei11904/2009'],
            ['Estatuto da Advocacia e da Ordem dos Advogados do Brasil (OAB)', 'Lei8906/1994'],
            ['Estatuto da Pessoa com Defici\u00EAncia', 'Lei13146/2015'], ['Estatuto dos Refugiados', 'Lei9474/1997'],
            ['Estatuto da Terra', 'Lei4504/1964'], ['Estatuto de Defesa do Torcedor', 'Lei10671/2003']
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
                            '<a id="searchLegis_uiElement" class="legisSearchBtn" data-spro-click="getSearchLegis" title="Pesquisar">Pesquisar</a>' +
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

        _legisResultados = [];
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

                // Pre-seleciona tipo/numero/ano a partir do texto selecionado no editor.
                var textSelected = SeiProEditorAdapter.getSelectedText(editor) || '';
                var tipoSelecao = tipoDaSelecaoLegis(textSelected);
                if (tipoSelecao) $box.find('#legis_tipoNorma').val(tipoSelecao).trigger('change');

                if (typeof hasNumber === 'function' && hasNumber(textSelected)) {
                    var lower = textSelected.toLowerCase();
                    var numInput = (lower.indexOf('/') !== -1) ? textSelected.split('/')[0] : textSelected;
                        numInput = (lower.indexOf(',') !== -1) ? textSelected.split(',')[0] : numInput;
                        numInput = (hasNumber(numInput)) ? onlyNumber(numInput) : '';
                    $box.find('#legis_numeroNorma').val(numInput);
                    // "..., de 21 de junho de 1993" / "8.666/1993": o ano desfaz a ambiguidade do numero.
                    var anoSelecao = textSelected.match(/(?:\/|\bde\s+)(\d{4})\b/);
                    if (anoSelecao) $box.find('#legis_anoNorma').val(anoSelecao[1]);
                }

                try { if (verifyConfigValue('substituiselecao') && typeof setChosenInCke === 'function') setChosenInCke(); } catch (e) {}
            },
            onClose: function () { _legisBox = null; _legisResultados = []; },
            buttons: [{
                text: 'Inserir',
                primary: true,
                click: function ($box) {
                    var tipoNorma = $box.find('#legis_tipoNorma').val() || '';
                    var numeroNorma = numeroApiLegis($box.find('#legis_numeroNorma').val());
                    var anoNorma = String($box.find('#legis_anoNorma').val() || '').trim();
                    var periodoNorma = $box.find('#legis_periodoNorma').val() || '';
                    var orgaoInfraNorma = $box.find('#legis_orgaoInfraNorma').val() || '';
                    var tipoInfraNorma = $box.find('#legis_tipoInfraNorma').val() || '';
                    var numeroInfraNorma = $box.find('#legis_numeroInfraNorma').val() || '';
                    var nomeNorma = $box.find('#legis_nomeNorma').val() || '';

                    if (tipoNorma != '' && numeroNorma !== '') {
                        // Fecha sozinho quando acha uma norma so; senao lista as opcoes.
                        inserirFederalLegis($box, tipoNorma, numeroNorma, anoNorma, periodoNorma);
                        return;
                    } else if (tipoInfraNorma != '' && numeroInfraNorma != '') {
                        var nrInfra = (numeroInfraNorma.indexOf('/') !== -1) ? numeroInfraNorma.split('/')[0] : numeroInfraNorma;
                            nrInfra = nrInfra.replace(/[^0-9\-]+/g, '');
                        sendLegisSEI(orgaoInfraNorma + tipoInfraNorma + nrInfra);
                    } else if (nomeNorma != '') {
                        sendLegisSEI(nomeNorma);
                    } else {
                        alertaBoxPro('Error', 'exclamation-triangle', 'Informe o tipo e o n\u00FAmero da norma, ou escolha uma norma da lista.');
                        return;
                    }
                    fecharDialogoLegis($box);
                }
            }]
        });
    }

    // Registra a feature (leve: id). Idempotente.
    SeiProEditorAdapter.registerFeature({ id: 'legis' });
})();
