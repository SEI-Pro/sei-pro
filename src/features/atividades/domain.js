/**
 * Atividades — pure / mostly-pure domain helpers.
 *
 * Nomenclature lives in src/shared/nomenclatura.js (also used by sei-functions).
 * Prazo math: prefer SeiPro.core.prazos when available.
 */

export function getAppsScriptUrlAtiv({
    getSEIProAppsScriptUrl = globalThis.getSEIProAppsScriptUrl,
    fallbackUrl = globalThis.SEI_PRO_APPS_SCRIPT_URL
} = {}) {
    if (typeof getSEIProAppsScriptUrl === 'function') return getSEIProAppsScriptUrl();
    if (typeof fallbackUrl !== 'undefined' && fallbackUrl) return fallbackUrl;
    return 'https://script.google.com/macros/s/AKfycby8ZZuKIHICpWYxEualArOnC1CIotYWXQvLNhe6eeoR-pQd1EOPNXjxt9UQ1XqJERxH/exec';
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
 * @param {{ moment?: Function }} deps
 */
export function getNumMonthsBetween2Dates(value, deps = {}) {
    const moment = deps.moment || globalThis.moment;
    var firstDate = moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').startOf('month');
    var secondDate = moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').endOf('month').add(1, 'day');
    var months = secondDate.diff(firstDate, 'month');
    return months > 0 ? months : 1;
}
