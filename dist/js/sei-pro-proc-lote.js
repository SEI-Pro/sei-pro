/**
 * SEI Pro - Processos em Lote
 *
 * Abre N processos de um mesmo tipo a partir de uma lista de especificacoes
 * colada pelo usuario (uma por linha) ou de uma quantidade informada.
 *
 * POR QUE NAO REUSA docsLote_setNewProc: aquela funcao refaz a cadeia inteira
 * "escolher tipo -> lista completa de tipos -> formulario do tipo" a CADA
 * processo, o que da ~4 requisicoes por processo -- em 600 processos, ~2.400
 * requisicoes, sendo que a lista completa de tipos e uma das paginas mais
 * pesadas do SEI. Aqui o formulario do tipo e buscado UMA vez e reaproveitado
 * nos N POSTs, caindo para 1 requisicao por processo. Verificado no SEI 4.1.5:
 * dois POSTs no mesmo action criaram dois processos, entao o infra_hash do
 * action e assinatura de sessao, nao nonce de uso unico.
 *
 * O numero SEI sai de brinde: a resposta do POST ja e a pagina
 * procedimento_trabalhar, e o protocolo esta no <title> dela.
 *
 * Se um POST falhar, o formulario e refeito UMA vez e a linha e repetida --
 * cobre o caso da sessao ter sido renovada no meio da rodada.
 */

var procLote_form = false;
var procLote_seqTipo = 0;   // guarda contra trocas rapidas de tipo
var procLote_abortado = false;
var procLote_criados = [];
var procLote_pageHelp = typeof URLPAGES_SPRO !== 'undefined' ? `${URLPAGES_SPRO}/pages/PROCESSOSEMLOTE.html` : false;

var PROCLOTE_PAUSA_PADRAO = 500;
var PROCLOTE_PAUSA_MINIMA = 200;
var PROCLOTE_PAUSA_MAXIMA = 10000;
var PROCLOTE_TETO = 2000;
var PROCLOTE_CUSTO_REQUISICAO = 900; // ms, so para estimar o tempo total

/**
 * O SEI recebe o formulario em ISO-8859-1 e o SEI Pro serializa com escape(),
 * que transforma o que nao cabe em latin-1 num %uXXXX que o PHP nao decodifica:
 * o caractere entra no processo como o texto literal "%u2014". Como as
 * especificacoes normalmente sao coladas do Word ou do Excel -- que trocam
 * hifen por travessao e aspas retas por curvas -- isso aconteceria o tempo
 * todo. Comprovado no SEI 4.1.5: "Teste travessao (travessao) aqui" gravou
 * "Teste travessao %u2014 aqui".
 */
var PROCLOTE_TROCAS = {
    '\u2010': '-', '\u2011': '-', '\u2012': '-', '\u2013': '-', '\u2014': '-', '\u2015': '-', '\u2212': '-',
    '\u2018': "'", '\u2019': "'", '\u201A': "'", '\u201B': "'", '\u2032': "'",
    '\u201C': '"', '\u201D': '"', '\u201E': '"', '\u201F': '"', '\u2033': '"',
    '\u2026': '...', '\u2022': '-', '\u00A0': ' ', '\u2007': ' ', '\u2008': ' ',
    '\u2009': ' ', '\u200A': ' ', '\u202F': ' ', '\u200B': '', '\uFEFF': '',
    '\u20AC': 'EUR', '\u2122': '(TM)', '\u2190': '<-', '\u2192': '->', '\u2264': '<=', '\u2265': '>='
};

/** Deixa o texto inteiro representavel em ISO-8859-1, sem perder sentido. */
var procLote_paraLatin1 = (texto) => {
    return String((texto === null || typeof texto === 'undefined') ? '' : texto)
        .normalize('NFC')
        .replace(/[\s\S]/g, (c) => {
            // A tabela vem ANTES do atalho de latin-1 de proposito: o espaco
            // nao separavel (U+00A0) cabe em latin-1, mas colado do Word ele
            // quebra a busca no SEI -- "Contrato 123" nao acha "Contrato\u00A0123".
            if (Object.prototype.hasOwnProperty.call(PROCLOTE_TROCAS, c)) return PROCLOTE_TROCAS[c];
            if (c.charCodeAt(0) < 256) return c;
            // ultimo recurso: tira o acento e fica com a letra base
            const base = c.normalize('NFD').replace(/[\u0300-\u036F]/g, '');
            for (let i = 0; i < base.length; i++) {
                if (base.charCodeAt(i) > 255) return '';
            }
            return base;
        });
};

/** Quantas linhas mudariam ao serem convertidas para ISO-8859-1. */
var procLote_contarConvertidas = (linhas) => {
    return linhas.filter(l => procLote_paraLatin1(l) !== l).length;
};

/** Ponto de entrada, chamado pelo link do menu esquerdo. */
function initProcLoteModal() {
    procLote_form = false;
    procLote_criados = [];
    procLote_abortado = false;
    procLoteModalConfig();
}

/* ------------------------------------------------------------------ */
/* Tela 1/3 - Configuracao                                             */
/* ------------------------------------------------------------------ */

var procLoteModalConfig = (valores = {}) => {
    var htmlAviso = `
        <div class="procLoteAviso" style="border-left: 4px solid #e0a800; background: #fff8e1; color: #6b5300; padding: 10px 12px; margin-bottom: 14px; font-size: 9pt; line-height: 1.45;">
            <strong style="display: block; margin-bottom: 4px;"><i class="fas fa-exclamation-triangle" style="color: #e0a800;"></i> Use com cautela.</strong>
            A abertura de processos em lote gera uma sequ\u00EAncia longa de requisi\u00E7\u00F5es ao servidor. Em alguns \u00F3rg\u00E3os isso deixa o SEI lento <strong>para todos os usu\u00E1rios</strong>, n\u00E3o s\u00F3 para voc\u00EA.
            <br><br>
            Prefira executar <strong>fora do hor\u00E1rio comercial</strong>, em blocos menores, e aumente a pausa entre processos se notar lentid\u00E3o. Na d\u00FAvida, alinhe antes com a \u00E1rea de TI do seu \u00F3rg\u00E3o.
        </div>`;

    var htmlBox = `${htmlAviso}
        <table style="font-size: 10pt;width: 100%;" class="seiProForm">
            <tr>
                <td style="vertical-align: top;text-align: left;height: 34px;" class="label">
                    <label for="procLoteTipoSelect"><i class="iconPopup iconSwitch fas fa-folder-plus cinzaColor"></i> Tipo de processo a ser aberto:</label>
                </td>
            </tr>
            <tr>
                <td class="required">
                    <select id="procLoteTipoSelect"><option value="">carregando dados...</option></select>
                </td>
            </tr>
            <tr>
                <td style="vertical-align: bottom;text-align: left;height: 34px;" class="label">
                    <label><i class="iconPopup iconSwitch fas fa-unlock-alt cinzaColor"></i> N\u00EDvel de acesso dos processos:</label>
                </td>
            </tr>
            <tr>
                <td>
                    <label style="display: inline-block; margin-right: 18px; font-size: 10pt !important;">
                        <input type="radio" name="procLoteNivel" value="0" checked> P\u00FAblico
                    </label>
                    <label style="display: inline-block; font-size: 10pt !important;">
                        <input type="radio" name="procLoteNivel" value="1"> Restrito
                    </label>
                </td>
            </tr>
            <tr id="procLoteLinhaHipotese" style="display: none;">
                <td class="required">
                    <select id="procLoteHipotese"><option value="">selecione a hip\u00F3tese legal</option></select>
                </td>
            </tr>
            <tr>
                <td style="vertical-align: bottom;text-align: left;height: 34px;" class="label">
                    <label for="procLoteEspecs"><i class="iconPopup iconSwitch fas fa-align-left cinzaColor"></i> Especifica\u00E7\u00F5es, uma por linha (cole direto de uma coluna da planilha):</label>
                </td>
            </tr>
            <tr>
                <td>
                    <textarea id="procLoteEspecs" rows="7" placeholder="Deixe em branco para abrir processos sem especifica\u00E7\u00E3o e informar apenas a quantidade abaixo."></textarea>
                    <small id="procLoteContador" style="display: block; color: #888; font-size: 8pt;">Nenhuma linha preenchida.</small>
                </td>
            </tr>
            <tr>
                <td style="vertical-align: bottom;text-align: left;height: 34px;" class="label">
                    <label for="procLoteQtd"><i class="iconPopup iconSwitch fas fa-hashtag cinzaColor"></i> Quantidade <em>(usada apenas quando a caixa acima estiver vazia)</em>:</label>
                </td>
            </tr>
            <tr>
                <td>
                    <input type="number" id="procLoteQtd" min="1" max="${PROCLOTE_TETO}" value="">
                </td>
            </tr>
            <tr>
                <td style="vertical-align: bottom;text-align: left;height: 34px;" class="label">
                    <label for="procLotePausa"><i class="iconPopup iconSwitch fas fa-stopwatch cinzaColor"></i> Pausa entre um processo e outro, em milissegundos:</label>
                </td>
            </tr>
            <tr>
                <td>
                    <input type="number" id="procLotePausa" min="${PROCLOTE_PAUSA_MINIMA}" max="${PROCLOTE_PAUSA_MAXIMA}" step="100" value="${PROCLOTE_PAUSA_PADRAO}">
                    <small style="display: block; color: #888; font-size: 8pt;">Quanto maior a pausa, menor o impacto no servidor. M\u00EDnimo de ${PROCLOTE_PAUSA_MINIMA} ms.</small>
                </td>
            </tr>
        </table>
        <div id="procLoteErro"></div>`;

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html(`<div id="dialogBoxProcLote" class="dialogBoxDiv">${htmlBox}</div>`)
        .dialog({
            title: 'Processos em lote - Configura\u00E7\u00E3o (1/3)',
            width: 620,
            maxHeight: (window.innerHeight * 0.9),
            open: () => {
                procLote_montarConfig(valores);
            },
            buttons: [{
                text: "Ajuda",
                icon: 'ui-icon-help',
                click: function () {
                    if (procLote_pageHelp) window.open(procLote_pageHelp);
                }
            }, {
                id: 'btnProcLoteAvancar',
                text: "Avan\u00E7ar",
                icon: 'ui-icon-arrowthick-1-e',
                class: 'confirm ui-state-active',
                click: function () {
                    procLote_validarEAvancar();
                }
            }]
        });
};

var procLote_montarConfig = async (valores) => {
    procLote_travarAvancar(true);

    $('#procLoteEspecs').on('input', procLote_atualizarContador);
    $('#procLoteQtd').on('input', procLote_atualizarContador);
    $('input[name="procLoteNivel"]').on('change', function () {
        const restrito = $(this).val() === '1';
        $('#procLoteLinhaHipotese').toggle(restrito);
        if (restrito) procLote_pintarHipoteses($('#procLoteHipotese').val());
    });

    if (typeof valores.especificacoes === 'string') $('#procLoteEspecs').val(valores.especificacoes);
    if (valores.quantidade) $('#procLoteQtd').val(valores.quantidade);
    if (valores.pausa) $('#procLotePausa').val(valores.pausa);
    procLote_atualizarContador();

    try {
        const tipos = await getTypeSEI('processos');
        if (!tipos || !tipos.length) throw new Error('n\u00E3o foi poss\u00EDvel carregar os tipos de processo');

        $('#procLoteTipoSelect')
            .html('<option value="">&nbsp;</option>' + $.map(tipos, function (v) {
                return `<option value="${v.id}">${v.name}</option>`;
            }).join(''))
            .val(valores.idTipo || '')
            .on('change', function () {
                procLote_selecionarTipo($(this).val(), valores.hipoteseLegal);
            })
            .chosen({
                placeholder_text_single: ' ',
                no_results_text: 'Nenhum resultado encontrado',
                normalize_search_text: function (text) {
                    return removeAcentos(text.toLowerCase());
                }
            });

        if (valores.nivelAcesso === '1') {
            $('input[name="procLoteNivel"][value="1"]').prop('checked', true);
            $('#procLoteLinhaHipotese').show();
        }
        if (valores.idTipo) {
            $('#procLoteTipoSelect').trigger('chosen:updated');
            procLote_selecionarTipo(valores.idTipo, valores.hipoteseLegal);
        }
    } catch (e) {
        procLote_mostrarErro(procLote_mensagemErro(e));
    }
};

/** Busca o formulario do tipo UMA vez e guarda o que sera reusado nos N POSTs. */
var procLote_selecionarTipo = async (idTipo, hipoteseSelecionada) => {
    const seq = ++procLote_seqTipo;
    procLote_form = false;
    procLote_limparErro();

    if (!idTipo) {
        procLote_travarAvancar(true);
        $('#procLoteHipotese').html('<option value="">selecione a hip\u00F3tese legal</option>');
        return;
    }

    procLote_travarAvancar(true);
    $('#procLoteHipotese').html('<option value="">carregando hip\u00F3teses legais...</option>');

    try {
        const dados = await procLote_carregarFormTipo(idTipo);
        if (seq !== procLote_seqTipo) return;   // outra troca de tipo assumiu o lugar desta
        procLote_form = dados;

        procLote_pintarHipoteses(hipoteseSelecionada);
        procLote_travarAvancar(false);
    } catch (e) {
        if (seq !== procLote_seqTipo) return;
        $('#procLoteHipotese').html('<option value="">nenhuma hip\u00F3tese legal dispon\u00EDvel</option>');
        procLote_mostrarErro(procLote_mensagemErro(e));
    }
};

var procLote_carregarFormTipo = async (idTipo) => {
    const htmlInit = await getInitialProcHtml(await getInitialProcUrl());
    const htmlLista = await procLote_obterListaTipos(htmlInit);
    const bruto = await procLote_obterFormTipo(htmlLista, idTipo);
    const htmlForm = $(bruto);

    const form = htmlForm.find('#frmProcedimentoCadastro');
    if (!form.length || !form.attr('action')) {
        throw new Error('o SEI n\u00E3o devolveu o formul\u00E1rio deste tipo de processo');
    }

    return {
        idTipo: String(idTipo),
        href: form.attr('action'),
        params: extractFormParams(form),
        opcoesHipotese: await procLote_carregarHipoteses(bruto),
        // O SEI exige Assuntos em varias instalacoes, e o formulario deixa o
        // hdnAssuntos vazio: quem o preenche a partir do #selAssuntos e o JS da
        // propria pagina, no submit. Sem isto o POST volta para o formulario.
        assuntos: (htmlForm.find('#selAssuntos option').length === 0)
            ? []
            : htmlForm.find('#selAssuntos option').map(function () {
                return $(this).val() + '\u00B1' + $(this).text();
            }).get().join('\u00A5').replaceAll(' ', '+'),
        interessados: htmlForm.find('#selInteressados option').map(function () {
            return $(this).val() + '\u00B1' + $(this).text();
        }).get().join('\u00A5').replaceAll(' ', '+')
    };
};

/**
 * Lista completa de tipos de processo.
 *
 * NAO usa o getFullProcList compartilhado porque ele escolhe o formulario pela
 * VERSAO do SEI (isSEI_5 ? '#frmProcedimentoEscolherTipo' : '#frmIniciar...'),
 * e isso nao se sustenta: o SEI 4.1.5 do Governo de SP serve
 * #frmProcedimentoEscolherTipo. Aqui a escolha e por qual formulario a pagina
 * REALMENTE tem, que e a pergunta certa.
 */
var procLote_obterListaTipos = async (htmlInit) => {
    let form = htmlInit.find('#frmProcedimentoEscolherTipo');
    if (!form.length) form = htmlInit.find('#frmIniciarProcessoEscolhaTipo');
    if (!form.length || !form.attr('action')) {
        throw new Error('n\u00E3o foi poss\u00EDvel abrir a lista de tipos de processo');
    }

    const param = {};
    form.find('input[type=hidden]').each(function () {
        if ($(this).attr('name') && ($(this).attr('id') || '').indexOf('hdn') !== -1) {
            param[$(this).attr('name')] = $(this).val();
        }
    });
    param.hdnFiltroTipoProcedimento = 'T';

    return $(await $.ajax({ method: 'POST', data: param, url: form.attr('action') }));
};

/**
 * Mesma resolucao de URL do getProcForm, mas devolvendo o HTML CRU.
 * getProcForm entrega um objeto jQuery, e o jQuery descarta <head> e <script>
 * ao parsear um documento inteiro -- exatamente onde mora a URL do
 * autocompletar das hipoteses legais.
 */
var procLote_obterFormTipo = async (htmlLista, idTipo) => {
    let urlProc = htmlLista.find(`a[href*="procedimento_escolher_tipo&id_tipo_procedimento=${idTipo}"]`).attr('href');

    // Quando os links da lista sao "#", a escolha do tipo vai por POST.
    let porPost = htmlLista.find('#tblTipoProcedimento').find('a.ancoraOpcao').attr('href');
        porPost = (typeof porPost !== 'undefined' && porPost === '#');

    if (porPost) urlProc = await getSerieForm(htmlLista, idTipo);
    if (!urlProc) {
        throw new Error('Erro ao selecionar o tipo de processo. Verifique se o tipo est\u00E1 dispon\u00EDvel no sistema e tente novamente');
    }

    return await $.ajax({ url: urlProc });
};

/**
 * As hipoteses legais NAO vem no HTML do formulario: o SEI as carrega por AJAX
 * conforme o nivel de acesso escolhido. Sem esta chamada o select fica vazio.
 * A resposta ja vem como uma lista de <option>, pronta para o .html().
 */
var procLote_carregarHipoteses = async (htmlBruto) => {
    const url = (typeof getUrlHipoteseLegal === 'function') ? getUrlHipoteseLegal(htmlBruto) : false;
    if (!url) return '';

    return await new Promise((resolve) => {
        let respondeu = false;
        // getHipoteseLegal so chama de volta quando ha resultado; o timeout
        // impede que um orgao sem hipoteses cadastradas trave a tela.
        setTimeout(() => { if (!respondeu) resolve(''); }, 15000);
        try {
            getHipoteseLegal(url, 1, (html) => { respondeu = true; resolve(html || ''); });
        } catch (e) {
            respondeu = true;
            resolve('');
        }
    });
};

/** Preenche o select de hipoteses e liga o chosen quando a linha esta visivel. */
var procLote_pintarHipoteses = (selecionada) => {
    const sel = $('#procLoteHipotese');
    const opcoes = (procLote_form && procLote_form.opcoesHipotese)
        ? procLote_form.opcoesHipotese
        : '<option value="">nenhuma hip\u00F3tese legal dispon\u00EDvel</option>';

    sel.html(opcoes);

    // A resposta do SEI traz um <option value="null"> (o "primeiro item" que o
    // SEI Pro pede como null e o PHP devolve como a string "null"). Se ficasse,
    // o usuario poderia escolhe-lo e o processo iria com hipotese "null".
    sel.find('option').filter(function () {
        const v = $(this).val();
        return (typeof v === 'undefined' || v === 'null');
    }).remove();
    if (!sel.find('option[value=""]').length) sel.prepend('<option value="">&nbsp;</option>');

    if (selecionada) sel.val(selecionada);

    // O chosen so mede a largura com a linha visivel; enquanto Publico estiver
    // marcado, o select fica cru mesmo -- e ninguem o ve.
    if ($('#procLoteLinhaHipotese').is(':visible')) {
        if (sel.data('chosen')) {
            sel.trigger('chosen:updated');
        } else {
            sel.chosen({
                placeholder_text_single: ' ',
                no_results_text: 'Nenhum resultado encontrado',
                normalize_search_text: function (text) {
                    return removeAcentos(text.toLowerCase());
                }
            });
        }
    }
};

var procLote_atualizarContador = () => {
    const linhas = procLote_lerLinhas();
    const qtd = parseInt($('#procLoteQtd').val(), 10);
    const contador = $('#procLoteContador');

    $('#procLoteQtd').prop('disabled', linhas.length > 0);

    if (linhas.length) {
        contador.text(`${linhas.length} ${linhas.length === 1 ? 'linha preenchida' : 'linhas preenchidas'} \u2014 ser\u00E3o abertos ${linhas.length} processos.`);
    } else if (qtd > 0) {
        contador.text(`Caixa vazia \u2014 ser\u00E3o abertos ${qtd} processos sem especifica\u00E7\u00E3o.`);
    } else {
        contador.text('Nenhuma linha preenchida.');
    }
};

var procLote_lerLinhas = () => {
    return String($('#procLoteEspecs').val() || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
};

var procLote_lerParametros = () => {
    const linhas = procLote_lerLinhas();
    const qtdBruta = parseInt($('#procLoteQtd').val(), 10);
    // Trava o tamanho do array ANTES de aloca-lo: um numero absurdo digitado a
    // mao travaria a aba antes de a validacao do teto rodar.
    const qtd = (qtdBruta > 0) ? Math.min(qtdBruta, PROCLOTE_TETO + 1) : 0;
    const nivelAcesso = $('input[name="procLoteNivel"]:checked').val() || '0';

    return {
        idTipo: $('#procLoteTipoSelect').val(),
        nomeTipo: $('#procLoteTipoSelect').find('option:selected').text().trim(),
        nivelAcesso: nivelAcesso,
        hipoteseLegal: nivelAcesso === '1' ? ($('#procLoteHipotese').val() || '') : '',
        nomeHipotese: nivelAcesso === '1' ? $('#procLoteHipotese').find('option:selected').text().trim() : '',
        especificacoes: linhas.length ? linhas : (qtd > 0 ? new Array(qtd).fill('') : []),
        textoEspecificacoes: String($('#procLoteEspecs').val() || ''),
        quantidade: qtdBruta > 0 ? qtdBruta : '',
        pausa: procLote_lerPausa()
    };
};

var procLote_lerPausa = () => {
    var pausa = parseInt($('#procLotePausa').val(), 10);
    if (!pausa || pausa < PROCLOTE_PAUSA_MINIMA) pausa = PROCLOTE_PAUSA_MINIMA;
    if (pausa > PROCLOTE_PAUSA_MAXIMA) pausa = PROCLOTE_PAUSA_MAXIMA;
    return pausa;
};

var procLote_validarEAvancar = () => {
    procLote_limparErro();
    const param = procLote_lerParametros();

    if (!param.idTipo || !procLote_form || procLote_form.idTipo !== String(param.idTipo)) {
        return procLote_mostrarErro('Selecione um tipo de processo e aguarde o carregamento do formul\u00E1rio.');
    }
    if (!param.especificacoes.length) {
        return procLote_mostrarErro('Informe as especifica\u00E7\u00F5es (uma por linha) ou uma quantidade.');
    }
    if (param.especificacoes.length > PROCLOTE_TETO) {
        return procLote_mostrarErro(`O limite por rodada \u00E9 de ${PROCLOTE_TETO} processos. Divida a demanda em blocos menores.`);
    }
    if (param.nivelAcesso === '1' && (!param.hipoteseLegal || param.hipoteseLegal === 'null')) {
        return procLote_mostrarErro('Processos restritos exigem a escolha de uma hip\u00F3tese legal.');
    }

    $('#procLotePausa').val(param.pausa);
    procLoteModalConfirmacao(param);
};

var procLote_travarAvancar = (travar) => {
    $('#btnProcLoteAvancar')
        .prop('disabled', travar)
        .toggleClass('ui-button-disabled ui-state-disabled', travar);
};

var procLote_mostrarErro = (texto) => {
    $('#procLoteErro').html(`<p class="noFieldsError" style="color: #E46E64; font-size: 9pt; margin-top: 8px;"><i class="fas fa-exclamation-triangle vermelhoColor"></i> ${texto}</p>`);
};

var procLote_limparErro = () => {
    $('#procLoteErro').empty();
};

/* ------------------------------------------------------------------ */
/* Tela 2/3 - Confirmacao                                              */
/* ------------------------------------------------------------------ */

var procLoteModalConfirmacao = (param) => {
    const total = param.especificacoes.length;
    const estimativa = procLote_estimarDuracao(total, param.pausa);
    const convertidas = procLote_contarConvertidas(param.especificacoes);

    var avisoConversao = convertidas ? `
        <div style="border-left: 4px solid #6c8ebf; background: #eef4fb; color: #24476e; padding: 9px 12px; margin-top: 12px; font-size: 9pt; line-height: 1.45;">
            <i class="fas fa-info-circle" style="color: #6c8ebf;"></i>
            ${convertidas === 1 ? 'Uma especifica\u00E7\u00E3o cont\u00E9m' : convertidas + ' especifica\u00E7\u00F5es cont\u00EAm'} caracteres que o SEI n\u00E3o aceita, como travess\u00E3o e aspas curvas (t\u00EDpicos de texto colado do Word). Eles ser\u00E3o convertidos automaticamente para o equivalente simples.
        </div>` : '';

    var htmlBox = `
        <p style="font-size: 10pt; margin-bottom: 12px;">Confira antes de iniciar. Depois de come\u00E7ar, os processos j\u00E1 criados <strong>n\u00E3o s\u00E3o desfeitos</strong> pelo cancelamento.</p>
        <table style="font-size: 10pt;width: 100%;" class="seiProForm tableInfo tableZebra">
            <tr><td style="width: 42%; text-align: left;" class="label">Processos a abrir</td><td><strong>${total}</strong></td></tr>
            <tr><td style="text-align: left;" class="label">Tipo</td><td>${escapeHtml(param.nomeTipo)}</td></tr>
            <tr><td style="text-align: left;" class="label">N\u00EDvel de acesso</td><td>${param.nivelAcesso === '1' ? 'Restrito \u2014 ' + escapeHtml(param.nomeHipotese) : 'P\u00FAblico'}</td></tr>
            <tr><td style="text-align: left;" class="label">Pausa entre processos</td><td>${param.pausa} ms</td></tr>
            <tr><td style="text-align: left;" class="label">Tempo estimado</td><td>${estimativa}</td></tr>
        </table>
        ${avisoConversao}
        <div style="border-left: 4px solid #e0a800; background: #fff8e1; color: #6b5300; padding: 10px 12px; margin-top: 12px; font-size: 9pt; line-height: 1.45;">
            <i class="fas fa-exclamation-triangle" style="color: #e0a800;"></i> Durante a execu\u00E7\u00E3o, <strong>n\u00E3o feche esta janela nem navegue nesta aba</strong>. Se o SEI ficar lento para os colegas, cancele e retome fora do hor\u00E1rio comercial com uma pausa maior.
        </div>`;

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html(`<div id="dialogBoxProcLote" class="dialogBoxDiv">${htmlBox}</div>`)
        .dialog({
            title: 'Processos em lote - Confirma\u00E7\u00E3o (2/3)',
            width: 620,
            maxHeight: (window.innerHeight * 0.9),
            buttons: [{
                text: "Voltar",
                icon: 'ui-icon-arrowthick-1-w',
                click: function () {
                    procLoteModalConfig({
                        idTipo: param.idTipo,
                        nivelAcesso: param.nivelAcesso,
                        hipoteseLegal: param.hipoteseLegal,
                        especificacoes: param.textoEspecificacoes,
                        quantidade: param.quantidade,
                        pausa: param.pausa
                    });
                }
            }, {
                id: 'btnProcLoteIniciar',
                text: "Iniciar",
                icon: 'ui-icon-play',
                class: 'confirm ui-state-active',
                click: function () {
                    procLoteModalExecucao(param);
                }
            }]
        });
};

var procLote_estimarDuracao = (total, pausa) => {
    const ms = total * (pausa + PROCLOTE_CUSTO_REQUISICAO);
    const minutos = Math.round(ms / 60000);
    if (minutos < 1) return 'menos de um minuto';
    if (minutos < 60) return `cerca de ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return `cerca de ${horas} h${resto ? ' ' + resto + ' min' : ''}`;
};

/* ------------------------------------------------------------------ */
/* Tela 3/3 - Execucao                                                 */
/* ------------------------------------------------------------------ */

var procLoteModalExecucao = (param) => {
    var htmlBox = `
        <div id="procLoteProgresso" style="margin: 20px 0; text-align: center;">
            <div style="height: 40px;"><i class="fas fa-spinner fa-spin azulColor" style="scale:3;"></i></div>
            <p id="procLoteProgressoTexto" style="margin-top: 18px; font-size: 10pt;">Preparando ambiente</p>
            <div style="background: #eee; border-radius: 6px; height: 10px; overflow: hidden; margin: 12px 40px 0 40px;">
                <div id="procLoteBarra" style="background: #2a7ab0; height: 100%; width: 0%; transition: width .2s;"></div>
            </div>
            <p id="procLoteProgressoFalhas" style="margin-top: 10px; font-size: 8pt; color: #888;"></p>
        </div>`;

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html(`<div id="dialogBoxProcLote" class="dialogBoxDiv">${htmlBox}</div>`)
        .dialog({
            title: 'Processos em lote - Criando (3/3)',
            width: 460,
            maxHeight: (window.innerHeight * 0.9),
            open: () => {
                procLote_executar(param);
            },
            close: () => {
                procLote_abortar();
            },
            buttons: [{
                id: 'btnProcLoteCancelar',
                text: "Cancelar",
                icon: 'ui-icon-cancel',
                click: function () {
                    procLote_abortar();
                }
            }]
        });
};

var procLote_abortar = () => {
    if (procLote_abortado) return;
    procLote_abortado = true;
    $('#btnProcLoteCancelar').hide();
    $('#procLoteProgressoTexto').text('Cancelando \u2014 aguardando o processo em andamento terminar...');
};

var procLote_executar = async (param) => {
    procLote_abortado = false;
    procLote_criados = [];

    const total = param.especificacoes.length;

    for (let i = 0; i < total; i++) {
        if (procLote_abortado) break;

        const espec = param.especificacoes[i];
        procLote_anunciarProgresso(i + 1, total);

        try {
            const criado = await procLote_criarComRetentativa(espec, param);
            procLote_criados.push({
                n: i + 1,
                numero: criado.numero,
                especificacao: criado.especificacao,
                url: criado.url,
                erro: ''
            });
        } catch (e) {
            procLote_criados.push({
                n: i + 1,
                numero: '',
                especificacao: espec,
                url: '',
                erro: procLote_mensagemErro(e)
            });
        }

        procLote_atualizarBarra(i + 1, total);

        if (i < total - 1 && !procLote_abortado) await procLote_esperar(param.pausa);
    }

    procLoteModalResultado(param);
};

var procLote_criarComRetentativa = async (espec, param) => {
    try {
        return await procLote_criarUm(espec, param);
    } catch (e) {
        if (procLote_abortado) throw e;
        // A sessao pode ter sido renovada no meio da rodada e invalidado o
        // formulario em cache. Refaz uma vez antes de dar a linha como perdida.
        procLote_form = await procLote_carregarFormTipo(param.idTipo);
        return await procLote_criarUm(espec, param);
    }
};

var procLote_criarUm = async (espec, param) => {
    if (!procLote_form) throw new Error('formul\u00E1rio do tipo de processo indispon\u00EDvel');

    const enviada = procLote_paraLatin1(espec).substring(0, 100).trim();

    const { htmlResult, xhr } = await createProc(procLote_form.href, procLote_montarPostData(espec, param));
    const ok = String(xhr.responseURL || '').indexOf('controlador.php?acao=procedimento_trabalhar&acao_origem=procedimento_gerar') !== -1;
    if (!ok) throw new Error('o SEI n\u00E3o confirmou a cria\u00E7\u00E3o do processo');

    const id = extractProcId(htmlResult);
    if (!id) throw new Error('processo criado, mas o SEI n\u00E3o devolveu o identificador');

    return {
        id: id,
        especificacao: enviada,
        numero: procLote_extrairNumero(htmlResult),
        url: url_host.replace('controlador.php', '') + 'controlador.php?acao=procedimento_trabalhar&id_procedimento=' + String(id)
    };
};

/**
 * O protocolo formatado vem no <title> da propria resposta do POST, entao nao
 * ha requisicao extra para descobrir o numero do processo. jQuery descarta
 * <head> ao parsear um documento inteiro -- por isso o regex na string crua.
 */
var procLote_extrairNumero = (htmlResult) => {
    const titulo = (String(htmlResult).match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '';
    const numero = titulo.split(' - ').pop().trim();
    return (numero && numero.toLowerCase() !== 'processo') ? numero : '';
};

var procLote_montarPostData = (espec, param) => {
    const p = Object.assign({}, procLote_form.params);

    p.rdoNivelAcesso = param.nivelAcesso;
    p.selHipoteseLegal = param.nivelAcesso === '1' ? param.hipoteseLegal : '';
    p.hdnFlagProcedimentoCadastro = '2';
    p.rdoProtocolo = 'M';
    p.txaObservacoes = '';
    p.txtDescricao = espec ? procLote_paraLatin1(espec).substring(0, 100).trim() : '';
    p.hdnAssuntos = procLote_form.assuntos;
    p.hdnInteressados = procLote_form.interessados;

    let postData = '';
    for (const [chave, valor] of Object.entries(p)) {
        if (postData !== '') postData += '&';
        const tratar = (chave === 'hdnNomeTipoProcedimento' || chave === 'hdnAssuntos' || chave === 'txtDescricao');
        postData += `${chave}=${tratar ? escapeComponent(valor) : valor}`;
    }
    return postData;
};

var procLote_esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

var procLote_anunciarProgresso = (atual, total) => {
    if (procLote_abortado) return;
    $('#procLoteProgressoTexto').text(`Criando ${atual} de ${total}...`);
};

var procLote_atualizarBarra = (feitos, total) => {
    const percentual = total ? Math.round((feitos / total) * 100) : 0;
    const falhas = procLote_criados.filter(c => c.erro).length;
    $('#procLoteBarra').css('width', percentual + '%');
    $('#procLoteProgressoFalhas').text(falhas ? `${falhas} ${falhas === 1 ? 'falha' : 'falhas'} at\u00E9 agora.` : '');
};

var procLote_mensagemErro = (e) => {
    const texto = (e && e.message) ? e.message : String(e);
    return texto.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

/* ------------------------------------------------------------------ */
/* Resultado                                                           */
/* ------------------------------------------------------------------ */

var procLoteModalResultado = (param) => {
    const total = param.especificacoes.length;
    const criados = procLote_criados.filter(c => !c.erro).length;
    const falhas = procLote_criados.length - criados;
    const interrompido = procLote_criados.length < total;

    var htmlBotoes = `<div class="btn-group filterTablePro notCopy" role="group" style="margin: 10px 0;">
                        <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">
                            <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>
                            <span class="text">Baixar</span>
                        </button>
                        <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">
                            <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>
                            <span class="text">Copiar</span>
                        </button>
                    </div>`;

    var linhas = $.map(procLote_criados, function (c) {
        return `<tr>
                    <td style="text-align: center;">${c.n}</td>
                    <td style="white-space: nowrap;">${c.numero || ''}</td>
                    <td style="text-align: left;">${escapeHtml(c.especificacao || '')}</td>
                    <td style="white-space: nowrap;">${c.url ? `<a href="${c.url}" target="_blank" class="bLink" style="font-size: 9pt;">abrir</a>` : ''}</td>
                    <td style="color: #E46E64;">${c.erro || ''}</td>
                </tr>`;
    }).join('');

    var htmlTabela = `
        <div style="max-height: 340px; max-width: 830px; overflow: auto;">
            <table id="tableProcLoteResult" data-name-table="processos_em_lote" style="font-size: 9pt !important;width: 100%;" class="seiProForm tableInfo tableZebra tableFollow">
                <thead>
                    <tr>
                        <th class="tituloControle" style="width: 40px;">#</th>
                        <th class="tituloControle" style="white-space: nowrap;">numero_processo</th>
                        <th class="tituloControle" style="text-align: left;">especificacao</th>
                        <th class="tituloControle" style="width: 60px;">link</th>
                        <th class="tituloControle">erro</th>
                    </tr>
                </thead>
                <tbody>${linhas}</tbody>
            </table>
        </div>`;

    var resumo = interrompido
        ? `<h4 style="text-align:center;margin: 10px 0; font-size: 1.3rem;"><i class="fas fa-hand-paper laranjaColor" style="font-size: 1em;"></i> Execu\u00E7\u00E3o interrompida</h4>`
        : `<h4 style="text-align:center;margin: 10px 0; font-size: 1.3rem;"><i class="fas fa-check-circle verdeColor" style="font-size: 1em;"></i> Progresso finalizado! \uD83D\uDC4F</h4>`;

    var contagem = `<p style="text-align:center; font-size: 9pt; color: #666; margin-bottom: 6px;">
                        ${criados} de ${total} ${total === 1 ? 'processo aberto' : 'processos abertos'}${falhas ? ` \u2014 ${falhas} ${falhas === 1 ? 'falha' : 'falhas'}` : ''}.
                    </p>`;

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html(`<div id="dialogBoxProcLote" class="dialogBoxDiv">${resumo}${contagem}${htmlTabela}</div>`)
        .dialog({
            title: 'Processos em lote - Resultado',
            width: 850,
            height: 520,
            maxHeight: (window.innerHeight * 0.9),
            open: () => {
                $('#tableProcLoteResult').find('thead').prepend(htmlBotoes);
            },
            buttons: [{
                text: "Fechar",
                class: 'ui-state-active',
                click: function () {
                    resetDialogBoxPro('dialogBoxPro');
                }
            }]
        });
};
