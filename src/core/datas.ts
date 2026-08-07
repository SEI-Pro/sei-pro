// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { aliasGlobal, getSeiPro, globalRef } from './global.js';
import { getHolidayBetweenDates } from './feriados.js';

/**
 * Formatação e duração de datas — cluster extraído de sei-functions-pro.js (Fase 6).
 *
 * Dependência ÚNICA: `moment` (lib vendor) + plugin moment-duration-format, lidos
 * como global lazy via `globalRef.moment` no momento da chamada — como o resto do
 * core lê `$`/jmespath. NÃO depende de DOM, jQuery, config nem de funções legadas.
 *
 * Funções que precisariam de `getHolidayBetweenDates`/`jmespath`/DOM (getDateSemantic,
 * getDatesPreview, configDatesPreview) ficaram de fora de propósito — entram quando
 * houver um cluster de "feriados" para apoiá-las sem acoplar core ↔ legado.
 */

export function getDatesFormatBR(value) {
    const moment = globalRef.moment;
    return (moment(value, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') == '00:00:00')
        ? moment(value, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
        : moment(value, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
}

export function randomDate(start, end, startHour, endHour) {
    const moment = globalRef.moment;
    const date = new Date(+start + Math.random() * (end - start));
    const hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

export function getRecentDateRow(inicio, seconds) {
    const moment = globalRef.moment;
    if (moment().format('YYYY-MM-DD') == moment(inicio, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')) {
        const diff = moment().add(seconds, 'seconds').diff(moment(inicio, 'YYYY-MM-DD HH:mm:ss'));
        return (diff < 0) ? true : false;
    }
}

// Template de moment-duration-format: invocado com `this` = contexto da duração.
export function calculeDatesDurationTemplate() {
    const duration = this.duration;
    let return_ = [];
    if (duration.years() == 1) { return_.push('Y [ano]'); } else if (duration.years() > 1) { return_.push('Y [anos]'); }
    if (duration.months() == 1) { return_.push('M [mes]'); } else if (duration.months() > 1) { return_.push('M [meses]'); } else if (duration.years() == 0 && duration.months() == 0 && duration.days() > 7) { if (duration.weeks() == 1) { return_.push('w [semana]'); } else { return_.push('w [semanas]'); } }
    if (duration.days() == 1) { return_.push('d [dia]'); } else if (duration.days() > 1) { if (duration.months() == 0 && duration.days() % 7 === 0) { /* noop */ } else { return_.push('d [dias]'); } } else if (duration.years() == 0 && duration.months() == 0 && duration.weeks() == 0 && duration.days() == 0) { return_.push('[hoje]'); }
    return_ = return_.join(', ');
    return_ = (return_ == '') ? 'd [dias]' : return_;
    return return_;
}

export function calculeDatesDuration(date, dateTo, countdays) {
    const moment = globalRef.moment;
    const diff = moment(date).diff(moment(dateTo), 'milliseconds');
    const diff_d = moment(date).diff(moment(dateTo), 'days');
    const day_formated = (diff_d).toLocaleString('pt-BR');
    const diff_ = (diff < 0) ? diff * -1 : moment(date).diff(moment(dateTo).add(-1, 'd'), 'milliseconds');
    let duration = moment.duration(diff_, 'milliseconds');
    duration = (typeof duration !== 'undefined' && duration !== null && typeof duration.format !== 'undefined') ? duration.format(calculeDatesDurationTemplate) : '';
    const day_txt = (diff_d >= -1 && diff_d <= 1) ? 'dia' : 'dias';
    let duration_ = (diff == 0) ? 'hoje' : (diff < 0) ? (duration.trim() == 'hoje') ? moment(date).fromNow() : duration.trim() + ' atrás' : 'em ' + duration;
    duration_ = (countdays && diff_d >= 1) ? day_formated + ' ' + day_txt + ' atrás' : duration_;
    duration_ = (countdays && diff_d <= -1) ? 'em ' + Math.abs(day_formated) + ' ' + day_txt : duration_;
    duration_ = (countdays && diff_d == 0) ? day_formated + ' ' + day_txt : duration_;
    return duration_;
}

/**
 * Seleciona e normaliza o primeiro recebimento/geração relevante do histórico.
 * A função não acessa DOM, storage ou globais legados: a borda fornece a unidade
 * atual, a data da visita e as observações persistidas.
 */
export function buildDataRecebimentoRecord(listAndamento, unidadeAtual, options = {}) {
    const andamento = (listAndamento && Array.isArray(listAndamento.andamento))
        ? listAndamento.andamento
        : [];
    const { datetime = '', observacoes = '', acompanhamentoesp = '' } = options;
    let datesend = '', descricaosend = '', unidadesend = '', unidadesendfull = '';
    let datageracao = '', descricaodatageracao = '';
    const geracao = andamento.find((item) => item.descricao && (
        item.descricao.indexOf('Processo público gerado') !== -1
        || item.descricao.indexOf('Processo restrito gerado') !== -1));
    if (geracao) {
        datageracao = geracao.datahora;
        descricaodatageracao = geracao.descricao;
    }
    const remessa = andamento.find((item) => item.unidade === unidadeAtual && item.descricao
        && item.descricao.indexOf('Processo remetido pela unidade') !== -1);
    if (remessa) {
        datesend = remessa.datahora;
        descricaosend = remessa.descricao;
        unidadesend = remessa.descricao.replace('Processo remetido pela unidade', '').trim();
        unidadesendfull = remessa.descricao_alt !== '' ? remessa.descricao_alt + ' - ' + unidadesend : '';
    }
    const recebimento = andamento.find((item) => {
        if (item.unidade !== unidadeAtual || !item.descricao) return false;
        return item.descricao === 'Processo recebido na unidade'
            || item.descricao === 'Reabertura do processo na unidade'
            || item.descricao === 'Processo público gerado'
            || item.descricao.indexOf('Processo restrito gerado') !== -1;
    });
    if (!recebimento) return null;
    return {
        id_procedimento: listAndamento.id_procedimento, processo: listAndamento.processo,
        datahora: recebimento.datahora, unidade: recebimento.unidade, descricao: recebimento.descricao,
        datetime, datesend, descricaosend, unidadesend, unidadesendfull,
        datageracao, descricaodatageracao, observacoes, acompanhamentoesp
    };
}

/**
 * Persiste um registro de recebimento substituindo a entrada do mesmo processo.
 * A borda injeta leitura/escrita para manter este adapter livre de storage e jQuery.
 */
export function persistDataRecebimentoRecord(record, dependencies = {}) {
    const { restore, store, isEmptyObject = (value) => value && typeof value === 'object' && Object.keys(value).length === 0 } = dependencies;
    if (!record || typeof restore !== 'function' || typeof store !== 'function') return [];
    const saved = restore('configDataRecebimentoPro');
    const records = (typeof saved !== 'undefined' && saved !== null && !isEmptyObject(saved)) ? saved : [];
    const next = Array.isArray(records) ? records.slice() : [];
    const index = next.findIndex((item) => item && item.id_procedimento == record.id_procedimento);
    if (index === -1) next.push(record);
    else next[index] = record;
    store('configDataRecebimentoPro', next);
    return next;
}

// Semântica de prazo: dado um config { date, dateTo, countdays, workday, due... },
// devolve { date, dateref, duedate, alertdate, calcalert, duecalcref }.
// Usa getHolidayBetweenDates (feriados) + calculeDatesDuration (local) e, no modo
// workday, jmespath + os plugins moment-weekday-calc (isoWeekdayCalc/isoAddWeekdaysFromSet).
export function getDateSemantic(config) {
    const moment = globalRef.moment;
    const jmespath = globalRef.jmespath;
    var formatDate = 'YYYY-MM-DD HH:mm:ss';
    var displayFormat = (config.displayformat) ? config.displayformat : 'DD/MM/YYYY';
    var duration = (config.countdays) ? moment(config.dateTo, formatDate).diff(moment(config.date, formatDate), 'days') : moment(config.date, formatDate).diff(moment(config.dateTo, formatDate), 'days');
    var listaFeriados = (config.workday && config.countdays) ? getHolidayBetweenDates(moment(config.date, formatDate).format('Y') + '-01-01', moment(config.dateTo, formatDate).format('Y') + '-01-01') : [];
    var arrayFeriados = (config.workday && config.countdays) ? jmespath.search(listaFeriados, "[*].d_") : [];
    var calcWorkday = (config.workday) ? moment().isoWeekdayCalc({
        rangeStart: moment(config.date, formatDate),
        rangeEnd: moment(config.dateTo, formatDate),
        weekdays: [1, 2, 3, 4, 5],
        exclusions: arrayFeriados
    }) : '';
    var calcWorkday_ = (calcWorkday - 1);
    var day_txt = (calcWorkday_ >= -1 && calcWorkday_ <= 1) ? 'dia útil' : 'dias úteis';
    var txtCalcWorkday = (config.workday && config.countdays && duration >= 1) ? calcWorkday_.toLocaleString('pt-BR') + ' ' + day_txt + ' atrás' : '';
    txtCalcWorkday = (config.workday && config.countdays && duration <= -1) ? 'em ' + calcWorkday_.toLocaleString('pt-BR') + ' ' + day_txt : txtCalcWorkday;
    txtCalcWorkday = (config.workday && config.countdays && duration == 0) ? calcWorkday_.toLocaleString('pt-BR') + ' ' + day_txt : txtCalcWorkday;
    var frowNow = (config.workday && config.countdays)
        ? txtCalcWorkday
        : (config.countdays) ? calculeDatesDuration(config.dateTo, config.date, config.countdays) : calculeDatesDuration(config.date, config.dateTo, config.countdays);
    var duedate = (config.duesetdate)
        ? moment(config.dateDue, formatDate)
        : (config.duecounter == 'util')
            ? moment(config.date, formatDate).isoAddWeekdaysFromSet({
                'workdays': config.duenumber,
                'weekdays': [1, 2, 3, 4, 5],
                'exclusions': arrayFeriados
            })
            : moment(config.date, formatDate).add(config.duenumber, 'd');

    var alertdate = (moment(config.dateTo, formatDate) > moment(duedate)) ? true : false;
    var calcalert = (alertdate) ? moment(config.dateTo, formatDate).diff(moment(duedate), 'days') : moment(duedate).diff(moment(config.dateTo, formatDate), 'days');
    calcalert = (calcalert).toLocaleString('pt-BR');
    var duecalcref = (alertdate)
        ? (calcalert == 1) ? calcalert + ' dia de atraso' : (calcalert > 1) ? calcalert + ' dias de atraso' : (calcalert == 0) ? moment(duedate, formatDate).fromNow() : ''
        : (calcalert == 1) ? 'em ' + calcalert + ' dia' : (calcalert > 1) ? 'em ' + calcalert + ' dias' : (calcalert == 0) ? moment(duedate, formatDate).fromNow() : '';

    return { date: config.date, dateref: frowNow, duedate: duedate.format(displayFormat), alertdate: alertdate, calcalert: calcalert, duecalcref: duecalcref };
}

export function installDatas() {
    const datas = {
        getDatesFormatBR,
        randomDate,
        getRecentDateRow,
        calculeDatesDurationTemplate,
        calculeDatesDuration,
        buildDataRecebimentoRecord,
        persistDataRecebimentoRecord,
        getDateSemantic
    };

    getSeiPro().core.datas = datas;

    aliasGlobal('getDatesFormatBR', getDatesFormatBR);
    aliasGlobal('randomDate', randomDate);
    aliasGlobal('getRecentDateRow', getRecentDateRow);
    aliasGlobal('calculeDatesDurationTemplate', calculeDatesDurationTemplate);
    aliasGlobal('calculeDatesDuration', calculeDatesDuration);
    aliasGlobal('getDateSemantic', getDateSemantic);

    return datas;
}
