// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Marcar como "Não Visualizado" (config `marcar_naolido`) — DOMÍNIO (puro).
 *
 * Sem DOM, sem jQuery, sem chrome.*, sem globais. Só transformação de dados:
 * o texto do tooltip da linha já marcada e a mensagem de erro agregada da ação.
 * Testável com vitest (tests/features/nao-lido/domain.test.js).
 */

const PREFIXO = '(Não Visualizado) ';
const ANCHOR = "return infraTooltipMostrar('";

// Prefixa "(Não Visualizado) " no tooltip (atributo onmouseover) de uma linha já
// marcada. Retorna a nova string, ou `null` quando nada deve mudar (entrada não é
// string, ou já contém o prefixo). A view só reescreve o atributo se vier não-nulo.
export function prefixNaoVisualizadoTooltip(onmouseover) {
    if (typeof onmouseover !== 'string') return null;
    if (onmouseover.indexOf(PREFIXO) !== -1) return null;
    if (onmouseover.indexOf(ANCHOR) === -1) return null;
    return onmouseover.replace(ANCHOR, ANCHOR + PREFIXO);
}

// Mensagem de erro agregada após tentar marcar N processos. `erros` é a lista de
// mensagens das falhas; `total` é quantos processos foram tentados. Retorna `null`
// quando não houve erro (a view não exibe alerta nesse caso).
export function buildErrosNaoLidoMessage(erros, total) {
    if (!erros || erros.length === 0) return null;
    if (erros.length === total) return erros[0];
    return erros.length + ' de ' + total + ' processo(s) não puderam ser marcados: ' + erros[0];
}

// Monta a URL da página de trabalho sem depender do DOM ou do runtime do SEI.
// A view continua responsável por buscar a árvore e executar as requisições.
export function buildProcessoTrabalharUrl(urlHost, idProcedimento) {
    return urlHost.replace('controlador.php', '')
        + 'controlador.php?acao=procedimento_trabalhar&id_procedimento='
        + String(idProcedimento);
}

// Payloads puros das duas ações que efetivam a marcação. Mantê-los no domínio
// evita que a view misture regras de negócio com a fronteira jQuery/XHR.
export function buildMarcarAndamentoOverrides() {
    return {
        txaDescricao: 'Processo marcado como não visualizado',
        sbmSalvar: 'Salvar'
    };
}

export function buildEnviarProcessoOverrides(idUnidade, siglaUnidadeAtual) {
    return {
        selUnidades: idUnidade,
        hdnUnidades: idUnidade + '±' + siglaUnidadeAtual,
        sbmEnviar: 'Enviar'
    };
}

// Resolve a seleção da lista sem conhecer DOM/jQuery. A lista de checkboxes tem
// prioridade; os candidatos da linha marcada mantêm a ordem de fallback legada.
export function resolveSelectedProcessoId(listIds, row = {}) {
    if (Array.isArray(listIds) && listIds.length > 0) return listIds[0];
    if (row.checkboxValue !== undefined && row.checkboxValue !== null && row.checkboxValue !== '') {
        return row.checkboxValue;
    }
    if (row.linkProcessoId !== undefined && row.linkProcessoId !== null) {
        return row.linkProcessoId;
    }
    if (row.rowId) return String(row.rowId).replace(/^P/, '');
    return false;
}

// A view só precisa escolher qual contrato visual legado aplicar.
export function getNaoLidoLoadingMode(isSlim) {
    return isSlim ? 'icon-toggle' : 'sei-button';
}
