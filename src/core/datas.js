import { aliasGlobal, getSeiPro, globalRef } from './global.js';

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

export function installDatas() {
    const datas = {
        getDatesFormatBR,
        randomDate,
        getRecentDateRow,
        calculeDatesDurationTemplate,
        calculeDatesDuration
    };

    getSeiPro().core.datas = datas;

    aliasGlobal('getDatesFormatBR', getDatesFormatBR);
    aliasGlobal('randomDate', randomDate);
    aliasGlobal('getRecentDateRow', getRecentDateRow);
    aliasGlobal('calculeDatesDurationTemplate', calculeDatesDurationTemplate);
    aliasGlobal('calculeDatesDuration', calculeDatesDuration);

    return datas;
}
