import { aliasGlobal, getSeiPro, globalRef } from './global.js';
import { getHolidayBetweenDates } from './feriados.js';
import { removeAcentos } from './util.js';

/**
 * Cálculo de prazos (feature "Controlar Prazos" / gerenciarprazos) — núcleo PURO
 * extraído de sei-pro-atividades.js (Fase 6). A camada de DOM da feature
 * (addControlePrazo, setControlePrazo, initControlePrazo, updateTablePrazoProcesso,
 * setPrazoMarcador…) permanece nos arquivos legados e chama este core.
 *
 * Dependências (globais lazy): `moment` + plugin moment-weekday-calc
 * (`isoAddWeekdaysFromSet`), `jmespath`, e `getHolidayBetweenDates` (core/feriados,
 * import modular). Sem DOM, jQuery ou estado próprio.
 */

// Calcula a data de entrega a partir de uma data de referência e um prazo.
// config_unidade.count_dias_uteis → conta só dias úteis (pula fins de semana e
// feriados, incl. os customizados em config_unidade.feriados); senão soma dias corridos.
export function getRecalculaPrazo(data_ref, hora_format, prazo, config_unidade) {
    const moment = globalRef.moment;
    const jmespath = globalRef.jmespath;
    var workday = config_unidade.count_dias_uteis;
    var config_feriados = (typeof config_unidade.feriados !== 'undefined' && config_unidade.feriados !== null) ? config_unidade.feriados : false;
    var arrayFeriados = (workday)
        ? jmespath.search(getHolidayBetweenDates(moment(data_ref, hora_format).format('Y') + '-01-01', moment(data_ref, hora_format).add(1, 'Y').format('Y') + '-01-01', config_feriados), "[*].d_")
        : [];

    var prazoEntrega = (workday)
        ? moment(data_ref, hora_format).isoAddWeekdaysFromSet({
            'workdays': prazo,
            'weekdays': [1, 2, 3, 4, 5],
            'exclusions': arrayFeriados
        }).format(hora_format)
        : moment(data_ref, hora_format).add(prazo, 'd').format(hora_format);
    return prazoEntrega;
}

// Parsing PURO da string `onmouseover` do marcador de prazo do SEI. Extrai:
//  - content: o primeiro texto entre aspas do atributo;
//  - dateTo:  true se o texto contém "até" (prazo final, não contagem);
//  - dateTag: "DD/MM/YYYY HH:mm" (hora 23:59 se ausente) ou false.
// O parse para objeto moment fica na camada de DOM (depende de moment).
export function parsePrazoTag(tag) {
    var content = (typeof tag !== 'undefined') ? tag.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, 'g')) : false;
    content = (content && content !== null && content.length > 0 && content[0] != '') ? content[0] : false;
    var dateTo = (content && removeAcentos(content).toLowerCase().indexOf('ate') !== -1) ? true : false;
    var dateContent = (content) ? content.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img) : null;
    var timeContent = (content) ? content.match(/(\d{1,2}:\d{2})/img) : null;
    var dateTag = (dateContent !== null) ? dateContent[0] + ' ' + (timeContent !== null ? timeContent[0] : '23:59') : false;
    return { content: content, dateTo: dateTo, dateTag: dateTag };
}

// Parsing PURO do tooltip (texto já extraído via extractTooltip) do marcador na
// listagem de processos. Diferente de parsePrazoTag: aqui a fonte é o texto do
// tooltip, com dois formatos de data:
//  - "ate DD/MM/YYYY" → datePrazoDue (prazo final / vencimento);
//  - "DD/MM/YYYY" solto (sem "ate") → datePrazo (data de referência).
// Retorna ambos já em 'YYYY-MM-DD HH:mm:ss' (ou false). Sem DOM.
export function parsePrazoTooltip(textTag) {
    const moment = globalRef.moment;
    textTag = (typeof textTag !== 'undefined' && textTag !== null) ? textTag : '';
    var regexDue = /(ate )(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
    var checkDateDue = regexDue.exec(removeAcentos(textTag.trim()).toLowerCase().replaceAll('  ', ' '));
    var datePrazoDue = (checkDateDue !== null) ? moment(checkDateDue[0], 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss') : false;

    var regex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
    var checkDate = regex.exec(removeAcentos(textTag.trim()));
    var datePrazo = (checkDateDue === null && checkDate !== null) ? moment(checkDate[0], 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss') : false;

    return { datePrazo: datePrazo, datePrazoDue: datePrazoDue };
}

// Decisão PURA do estado/tag visual de uma caixa de prazo (cascata de prioridade).
// Núcleo extraído de getDatesPreview: dado o config e o resultDate semântico,
// resolve qual etiqueta exibir ({ name, value, color }). A montagem do HTML
// (ícones, tooltips) continua na camada de view. Depende só de `moment` (now).
export function getDateBoxState(config, resultDate) {
    const moment = globalRef.moment;
    var formatDate = 'YYYY-MM-DD HH:mm:ss';
    var tagName = (moment(config.date, formatDate).diff(moment(), 'days') > 0) ? { name: 'Seguinte', value: 'date_seguinte', color: '#eef4f9' } : { name: 'Vencida', value: 'date_vencido', color: '#f9e2e0' };
    tagName = (config.displaydue) ? { name: 'No prazo', value: 'date_noprazo', color: '#eef4f9' } : tagName;
    tagName = ((config.duedate || config.duesetdate) && (resultDate.alertdate)) ? { name: 'Atrasada', value: 'date_atrasado', color: '#f9e2e0' } : tagName;
    tagName = (moment().format(formatDate) == config.dateDue) ? { name: 'Hoje', value: 'date_hoje', color: '#f9e2e0' } : tagName;
    tagName = (config.deliverydoc) ? { name: 'Entregue', value: 'date_entregue', color: '#ddf1dd' } : tagName;
    tagName = (typeof config.ratingdoc !== 'undefined' && config.ratingdoc) ? { name: 'Avaliada', value: 'date_avaliado', color: '#f1ecdd' } : tagName;
    tagName = (typeof config.paused !== 'undefined' && config.paused) ? { name: 'Pausada', value: 'date_pausado', color: '#f1ecdd' } : tagName;
    tagName = (typeof config.senddoc !== 'undefined' && config.senddoc) ? { name: 'Arquivada', value: 'date_enviado', color: '#ececec' } : tagName;
    tagName = (typeof config.nametag !== 'undefined' && config.nametag) ? config.nametag : tagName;
    return tagName;
}

// Cálculo PURO do progresso de um prazo (matemática de datas). Núcleo extraído
// de getProgressPreview: decide se há progresso a exibir (show) e o percentual.
// A montagem do SVG fica na view. Depende só de `moment` (now).
export function getProgressPercent(config) {
    const moment = globalRef.moment;
    var max = moment(config.dateDue, 'YYYY-MM-DD').diff(moment(config.date, 'YYYY-MM-DD'), 'days');
    var progress = moment().diff(moment(config.date, 'YYYY-MM-DD'), 'days');
    if ((config.duesetdate || config.duedate) && progress <= max && progress >= 0) {
        return { show: true, percent: Math.round((progress / max) * 100), max: max, progress: progress };
    }
    return { show: false, percent: 0, max: max, progress: progress };
}

export function installPrazos() {
    const prazos = { getRecalculaPrazo, parsePrazoTag, parsePrazoTooltip, getDateBoxState, getProgressPercent };

    getSeiPro().core.prazos = prazos;

    aliasGlobal('getRecalculaPrazo', getRecalculaPrazo);
    aliasGlobal('parsePrazoTag', parsePrazoTag);
    aliasGlobal('parsePrazoTooltip', parsePrazoTooltip);
    aliasGlobal('getDateBoxState', getDateBoxState);
    aliasGlobal('getProgressPercent', getProgressPercent);

    return prazos;
}
