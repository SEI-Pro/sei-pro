/**
 * Marcar como "Não Visualizado" (config `marcar_naolido`) — VIEW / orquestração.
 * Mundo isolado, lista de processos. Loading do botão, seleção da linha, ação de
 * marcar (lança andamento + reenvia o processo p/ a própria unidade) e o realce da
 * linha já marcada. Importa o IO (rede/serialização); a detecção de redirect do SEI
 * vive em SeiPro.sei.urls (isAjaxRedirectAction, global). Demais helpers do legado
 * (getListIdProtocoloSelected, alertaBoxPro, getLinksArvoreAjax, getTreeLinkUrlByName,
 * getParamsUrlPro, initFaviconNrProcesso, url_host, idUnidade, siglaUnidadeAtual,
 * divComandos, elemCheckbox, setIconLoadinBtnSEI) resolvem do escopo global isolado.
 * Relocado verbatim (split io/view) — comportamento idêntico.
 */
import { serializeSeiForm, getSeiHtml, postSeiForm } from './io.js';

export function setProcessoNaoLidoLoading(display = true) {
    if ($('body').hasClass('seiSlim')) {
        $(divComandos+' .iconNaoLido').toggleClass('iconLoading', display);
    } else {
        setIconLoadinBtnSEI($('.iconNaoLido'), display);
    }
}

export function getSelectedProcessoNaoLido() {
    var listId = getListIdProtocoloSelected();
    if (listId && listId.length > 0) {
        return listId[0];
    }
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    var markedRow = tableProc.find('tr.infraTrMarcada').first();
    if (markedRow.length > 0) {
        var checkboxValue = markedRow.find(elemCheckbox).val();
        if (typeof checkboxValue !== 'undefined' && checkboxValue !== null && checkboxValue !== '') {
            return checkboxValue;
        }
        var linkProcesso = markedRow.find('a[href*="controlador.php?acao=procedimento_trabalhar"]').first();
        if (linkProcesso.length > 0) {
            var paramsProcesso = getParamsUrlPro(linkProcesso.attr('href'));
            if (paramsProcesso && typeof paramsProcesso.id_procedimento !== 'undefined') {
                return paramsProcesso.id_procedimento;
            }
        }
        if (markedRow.attr('id')) {
            return markedRow.attr('id').replace(/^P/, '');
        }
    }
    return false;
}

export function failProcessoNaoLido(message) {
    setProcessoNaoLidoLoading(false);
    alertaBoxPro('Error', 'exclamation-triangle', message);
}

// Marca UM processo como não visualizado: lança um andamento e reenvia o
// processo para a própria unidade (o SEI passa a tratá-lo como não visto).
export async function marcarUmProcessoNaoLido(id_procedimento) {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    var tr = tableProc.find('tr#P' + id_procedimento);
    var href = url_host.replace('controlador.php', '') + 'controlador.php?acao=procedimento_trabalhar&id_procedimento=' + String(id_procedimento);

    var htmlTrabalhar = await getSeiHtml(href);
    var urlArvore = $(htmlTrabalhar).find('#ifrArvore').attr('src');
    if (!urlArvore) throw 'Não foi possível localizar a árvore do processo selecionado.';

    var arrayLinksArvore = getLinksArvoreAjax(await getSeiHtml(urlArvore));
    var ctxArvore = { treeModel: { links: arrayLinksArvore } };
    var urlAndamento = getTreeLinkUrlByName('Atualizar Andamento', ctxArvore);
    var urlEnviar = getTreeLinkUrlByName('Enviar Processo', ctxArvore);
    if (!urlAndamento || !urlEnviar) throw 'Não foi possível localizar as ações necessárias no processo selecionado.';

    // 1) Atualizar Andamento
    var formAndamento = $(await getSeiHtml(urlAndamento)).find('#frmAtividadeListar');
    if (formAndamento.length === 0) throw 'Não foi possível carregar o formulário de andamento do processo.';
    var resAndamento = await postSeiForm(formAndamento.attr('action'), serializeSeiForm(formAndamento, {
        txaDescricao: 'Processo marcado como não visualizado',
        sbmSalvar: 'Salvar'
    }));
    if (!isAjaxRedirectAction(resAndamento.xhr, 'procedimento_consultar_historico', 'procedimento_atualizar_andamento')) {
        throw 'Falha ao salvar o andamento do processo.';
    }

    // 2) Enviar Processo de volta para a própria unidade
    var formEnviar = $(await getSeiHtml(urlEnviar)).find('#frmAtividadeListar');
    if (formEnviar.length === 0) throw 'Não foi possível carregar o formulário de envio do processo.';
    var resEnviar = await postSeiForm(formEnviar.attr('action'), serializeSeiForm(formEnviar, {
        selUnidades: idUnidade,
        hdnUnidades: idUnidade + '±' + siglaUnidadeAtual,
        sbmEnviar: 'Enviar'
    }));
    if (!isAjaxRedirectAction(resEnviar.xhr, 'arvore_visualizar', 'procedimento_enviar')) {
        throw 'Não foi possível confirmar a marcação como não visualizado.';
    }

    // sucesso: reflete na linha da lista
    tr.find('a[href*="controlador.php?acao=procedimento_trabalhar"]').attr('class', 'processoNaoVisualizado');
    tr.find(elemCheckbox + ':checked').trigger('click');
}

// Ação do botão: marca todos os processos selecionados como não
// visualizados (sequencialmente, para não sobrecarregar o SEI).
export async function marcarProcessoNaoLido() {
    var listId = getListIdProtocoloSelected();
    if (!listId || listId.length === 0) {
        var single = getSelectedProcessoNaoLido();
        listId = single ? [single] : [];
    }
    if (listId.length === 0) {
        failProcessoNaoLido('Selecione um processo para marcar como não visualizado.');
        return;
    }
    setProcessoNaoLidoLoading(true);
    var erros = [];
    for (var i = 0; i < listId.length; i++) {
        try {
            await marcarUmProcessoNaoLido(listId[i]);
        } catch (e) {
            erros.push(typeof e === 'string' ? e : 'Falha ao marcar o processo.');
        }
    }
    initNaoVisualizadoPro();
    initFaviconNrProcesso();
    setProcessoNaoLidoLoading(false);
    if (erros.length > 0) {
        failProcessoNaoLido(erros.length === listId.length
            ? erros[0]
            : (erros.length + ' de ' + listId.length + ' processo(s) não puderam ser marcados: ' + erros[0]));
    }
}

// Prefixa "(Não Visualizado) " no tooltip das linhas já marcadas (idempotente por data-nvis).
export function initNaoVisualizadoPro() {
    $('.processoNaoVisualizado').each(function(){
        var el = $(this);
        if (el.attr('data-nvis') === '1') return;            // já processado nesta página
        var tooltip = el.attr('onmouseover');
        if (typeof tooltip !== 'undefined' && tooltip.indexOf("(Não Visualizado) ") === -1) {
            el.attr('onmouseover', tooltip.replace("return infraTooltipMostrar('","return infraTooltipMostrar('(Não Visualizado) "));
        }
        el.attr('data-nvis','1');
    });
}
