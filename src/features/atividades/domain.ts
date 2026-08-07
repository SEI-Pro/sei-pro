// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Atividades — pure / mostly-pure domain helpers.
 *
 * Nomenclature lives in src/shared/nomenclatura.js (also used by sei-functions).
 * Prazo math: prefer SeiPro.core.prazos when available.
 * No DOM, jQuery, chrome.*, or localStorage in this module.
 */

const DEFAULT_APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycby8ZZuKIHICpWYxEualArOnC1CIotYWXQvLNhe6eeoR-pQd1EOPNXjxt9UQ1XqJERxH/exec';

export function getAppsScriptUrlAtiv({
    getSEIProAppsScriptUrl,
    fallbackUrl
} = {}) {
    if (typeof getSEIProAppsScriptUrl === 'function') return getSEIProAppsScriptUrl();
    if (fallbackUrl) return fallbackUrl;
    return DEFAULT_APPS_SCRIPT_URL;
}

/** Map config table type → primary-key field name. */
export function getLabIdTables(type) {
    var label_id = (type == 'tipos_modalidades') ? 'id_tipo_modalidade' : 'id_' + type.slice(0, -1);
    label_id = (type == 'tipos_metadados') ? 'id_tipo_metadado' : label_id;
    label_id = (type == 'tipos_prescricoes') ? 'id_tipo_prescricao' : label_id;
    label_id = (type == 'tipos_avaliacoes') ? 'id_tipo_avaliacao' : label_id;
    label_id = (type == 'cadeia_valor') ? 'id_cadeia_valor' : label_id;
    label_id = (type == 'acoes') ? 'id_acao' : label_id;
    label_id = (type == 'email') ? 'id_email' : label_id;
    label_id = (type == 'log') ? 'id_log' : label_id;
    return label_id;
}

/**
 * Inclusive month span between plano vigência dates.
 * @param {{ data_inicio_vigencia: string, data_fim_vigencia: string }} value
 * @param {{ moment: Function }} deps — moment is required (no global lookup)
 */
export function getNumMonthsBetween2Dates(value, deps = {}) {
    const moment = deps.moment;
    if (typeof moment !== 'function') {
        throw new Error('getNumMonthsBetween2Dates requires deps.moment');
    }
    var firstDate = moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').startOf('month');
    var secondDate = moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').endOf('month').add(1, 'day');
    var months = secondDate.diff(firstDate, 'month');
    return months > 0 ? months : 1;
}

/**
 * Gate for outbound Atividades server calls (pure; callers inject capacidade/loading).
 */
export function isAtividadesServerModeAllowed(mode, {
    checkCapacidade = () => false,
    delayServerAtiv = 0,
    checkLoadingButtonConfirm = () => false
} = {}) {
    if (mode == 'panel' || mode == 'config_resend_keys') return true;
    if (mode == 'chart_demandas' && checkCapacidade(mode)) return true;
    if (mode == 'chart_produtividade_mensal' && checkCapacidade(mode)) return true;
    if (typeof mode === 'string' && mode.indexOf('config_') !== -1 && checkCapacidade(mode)) return true;
    if (typeof mode === 'string' && mode.indexOf('_monitorados') !== -1 && checkCapacidade(mode)) return true;
    if (mode == 'update_checklist' && checkCapacidade(mode)) return true;
    if (mode == 'update_projeto_etapa' && checkCapacidade(mode)) return true;
    if (typeof mode === 'string' && mode.indexOf('report_') !== -1 && checkCapacidade(mode)) return true;
    if (delayServerAtiv == 0 && !checkLoadingButtonConfirm() && checkCapacidade(mode)) return true;
    return false;
}

/**
 * Build the payload fields shared by every Atividades POST (pure; no network).
 */
export function buildAtividadesRequestParams(param, mode, {
    userHashAtiv = '',
    version = '',
    getOptionsPro = () => undefined,
    lastUpdateAtividades = false,
    verifyConfigValue = () => false,
    checkConfigValue = () => false
} = {}) {
    // Mutates `param` in place — callers pass a shared object the success router reads.
    const next = param || {};
    next.hash = userHashAtiv;
    next.version = version;
    next.perfil = getOptionsPro('perfilAtividadesSelected') || '';
    next.last_update = (!getOptionsPro('panelLocalStorePro') && lastUpdateAtividades && mode == 'panel')
        ? lastUpdateAtividades
        : false;
    if (typeof next.offset !== 'undefined') next.last_update = false;
    next.id_programa = (typeof next.id_programa !== 'undefined')
        ? next.id_programa
        : getOptionsPro('programaAtividadesSelected');
    next.id_programa = (typeof next.id_programa !== 'undefined' && next.id_programa !== null)
        ? next.id_programa
        : false;
    next.projetos = verifyConfigValue('gerenciarprojetos')
        ? JSON.stringify({ vigentes: !getOptionsPro('stateArquivadosGantt') })
        : false;
    next.prescricoes = checkConfigValue('gerenciarprescricoes')
        ? JSON.stringify({ vigentes: true })
        : false;
    return next;
}

/**
 * True when perfil.nivel == 1 (admin). Pure; callers pass perfil.
 */
export function isPerfilNivelAdm(perfil) {
    return typeof perfil !== 'undefined' &&
        perfil !== null &&
        typeof perfil.nivel !== 'undefined' &&
        perfil.nivel == 1;
}

/**
 * First match of idKey==id across ordered lists; false when missing.
 */
export function findConfigItemById(lists, idKey, id) {
    if (!Array.isArray(lists) || !idKey) return false;
    for (var i = 0; i < lists.length; i++) {
        var list = lists[i];
        if (!Array.isArray(list) || list.length === 0) continue;
        var found = list.find(function (obj) { return obj[idKey] == id; });
        if (typeof found !== 'undefined') return found;
    }
    return false;
}

/**
 * Gate for plano homologação prévia (pure; inject entidade options + moment).
 */
export function checkHomologacaoPreviaPlanos(value, {
    checkOptionEntidade = () => false,
    getOptionEntidade = () => false,
    moment
} = {}) {
    if (typeof moment !== 'function') {
        throw new Error('checkHomologacaoPreviaPlanos requires deps.moment');
    }
    var exigir_homologacao_previa_planos = checkOptionEntidade('exigir_homologacao_previa_planos');
    var data_homologacao_previa_planos = checkOptionEntidade('data_homologacao_previa_planos')
        ? getOptionEntidade('data_homologacao_previa_planos')
        : false;
    var _return = false;
    _return = (data_homologacao_previa_planos &&
        moment(data_homologacao_previa_planos, 'YYYY-MM-DD') <= moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss'))
        ? true : _return;
    _return = !data_homologacao_previa_planos && exigir_homologacao_previa_planos ? true : _return;
    _return = !exigir_homologacao_previa_planos ? false : _return;
    return _return;
}

/**
 * Gate for programa homologação prévia (pure; inject entidade options + moment).
 */
export function checkHomologacaoPreviaProgramas(value, {
    checkOptionEntidade = () => false,
    getOptionEntidade = () => false,
    moment
} = {}) {
    if (typeof moment !== 'function') {
        throw new Error('checkHomologacaoPreviaProgramas requires deps.moment');
    }
    var exigir_homologacao_programas = checkOptionEntidade('exigir_homologacao_programas');
    var data_homologacao_previa_planos = checkOptionEntidade('data_homologacao_previa_planos')
        ? getOptionEntidade('data_homologacao_previa_planos')
        : false;
    var _return = false;
    _return = (data_homologacao_previa_planos &&
        moment(data_homologacao_previa_planos, 'YYYY-MM-DD') < moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss'))
        ? true : _return;
    _return = !data_homologacao_previa_planos && exigir_homologacao_programas ? true : _return;
    _return = !exigir_homologacao_programas ? false : _return;
    return _return;
}
