import { aliasGlobal, getSeiPro, globalRef } from './global.js';

/**
 * Feriados nacionais brasileiros e cálculo de Páscoa — cluster extraído de
 * sei-functions-pro.js (Fase 6). Destrava o cluster de datas que dependia destes.
 *
 * Dependências (libs vendor, lidas como global lazy): `moment` sempre; `jQuery`
 * apenas em getHolidayBetweenDates (`$.merge`/`$.map` — a semântica de `$.map`
 * descartando retornos null/undefined é intencional e foi preservada). Sem DOM,
 * config ou estado global próprio.
 */

export function easterDay(y) {
    const moment = globalRef.moment;
    const c = Math.floor(y / 100);
    const n = y - 19 * Math.floor(y / 19);
    const k = Math.floor((c - 17) / 25);
    let i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
    i = i - 30 * Math.floor((i / 30));
    i = i - Math.floor(i / 28) * (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
    let j = y + Math.floor(y / 4) + i + 2 - c + Math.floor(c / 4);
    j = j - 7 * Math.floor(j / 7);
    const l = i - j;
    const m = 3 + Math.floor((l + 40) / 44);
    const d = l + 28 - 31 * Math.floor(m / 4);
    return moment([y, (m - 1), d]);
}

export function getHolidaysBr(y) {
    const moment = globalRef.moment;
    const anoNovo = moment('01/01/' + y, 'DD/MM/YYYY');
    const carnaval1 = easterDay(y).add(-48, 'd');
    const carnaval2 = easterDay(y).add(-47, 'd');
    const paixaoCristo = easterDay(y).add(-2, 'd');
    const pascoa = easterDay(y);
    const tiradentes = moment('21/04/' + y, 'DD/MM/YYYY');
    const corpusChristi = easterDay(y).add(60, 'd');
    const diaTrabalho = moment('01/05/' + y, 'DD/MM/YYYY');
    const diaIndependencia = moment('07/09/' + y, 'DD/MM/YYYY');
    const nossaSenhora = moment('12/10/' + y, 'DD/MM/YYYY');
    const finados = moment('02/11/' + y, 'DD/MM/YYYY');
    const conscienciaNegra = moment('20/11/' + y, 'DD/MM/YYYY');
    const proclamaRepublica = moment('15/11/' + y, 'DD/MM/YYYY');
    const natal = moment('25/12/' + y, 'DD/MM/YYYY');
    return [
        { m: anoNovo, dia: 'Ano Novo', d: anoNovo.format('DD/MM/YYYY'), d_: anoNovo.format('YYYY-MM-DD') },
        { m: carnaval1, dia: 'Carnaval', d: carnaval1.format('DD/MM/YYYY'), d_: carnaval1.format('YYYY-MM-DD') },
        { m: carnaval2, dia: 'Carnaval', d: carnaval2.format('DD/MM/YYYY'), d_: carnaval2.format('YYYY-MM-DD') },
        { m: paixaoCristo, dia: 'Paixão de Cristo', d: paixaoCristo.format('DD/MM/YYYY'), d_: paixaoCristo.format('YYYY-MM-DD') },
        { m: pascoa, dia: 'Páscoa', d: pascoa.format('DD/MM/YYYY'), d_: pascoa.format('YYYY-MM-DD') },
        { m: tiradentes, dia: 'Tiradentes', d: tiradentes.format('DD/MM/YYYY'), d_: tiradentes.format('YYYY-MM-DD') },
        { m: corpusChristi, dia: 'Corpus Christi', d: corpusChristi.format('DD/MM/YYYY'), d_: corpusChristi.format('YYYY-MM-DD') },
        { m: diaTrabalho, dia: 'Dia do Trabalho', d: diaTrabalho.format('DD/MM/YYYY'), d_: diaTrabalho.format('YYYY-MM-DD') },
        { m: diaIndependencia, dia: 'Dia da Independência do Brasil', d: diaIndependencia.format('DD/MM/YYYY'), d_: diaIndependencia.format('YYYY-MM-DD') },
        { m: nossaSenhora, dia: 'Nossa Senhora Aparecida', d: nossaSenhora.format('DD/MM/YYYY'), d_: nossaSenhora.format('YYYY-MM-DD') },
        { m: finados, dia: 'Finados', d: finados.format('DD/MM/YYYY'), d_: finados.format('YYYY-MM-DD') },
        { m: conscienciaNegra, dia: 'Dia Nacional de Zumbi e da Consciência Negra', d: conscienciaNegra.format('DD/MM/YYYY'), d_: conscienciaNegra.format('YYYY-MM-DD') },
        { m: proclamaRepublica, dia: 'Proclamação da República', d: proclamaRepublica.format('DD/MM/YYYY'), d_: proclamaRepublica.format('YYYY-MM-DD') },
        { m: natal, dia: 'Natal', d: natal.format('DD/MM/YYYY'), d_: natal.format('YYYY-MM-DD') }
    ];
}

export function getHolidayBetweenDates(date, dateTo, addHolidays = false) {
    const moment = globalRef.moment;
    const $ = globalRef.jQuery || globalRef.$;
    const dateStart = moment(date, 'YYYY-MM-DD');
    const dateEnd = moment(dateTo, 'YYYY-MM-DD');
    const datesHoliday = [];

    while (dateEnd > dateStart || dateStart.format('Y') === dateEnd.format('Y')) {
        $.merge(datesHoliday, getHolidaysBr(parseInt(dateStart.format('YYYY'))));
        if (addHolidays) {
            const addHoliday = $.map(addHolidays, function (v) {
                if (v.recorrente) {
                    const feriado_data = moment(v.feriado_data + '/' + dateStart.format('YYYY'), 'DD/MM/YYYY');
                    return { m: feriado_data, dia: v.nome_feriado, d: feriado_data.format('DD/MM/YYYY'), d_: feriado_data.format('YYYY-MM-DD'), meio_periodo: v.meio_periodo };
                } else if (!v.recorrente && dateStart.format('Y') == moment(v.feriado_data, 'DD/MM/YYYY').format('Y')) {
                    const feriado_data = moment(v.feriado_data, 'DD/MM/YYYY');
                    return { m: feriado_data, dia: v.nome_feriado, d: feriado_data.format('DD/MM/YYYY'), d_: feriado_data.format('YYYY-MM-DD'), meio_periodo: v.meio_periodo };
                }
            });
            $.merge(datesHoliday, addHoliday);
        }
        dateStart.add(1, 'year');
    }
    return datesHoliday;
}

export function installFeriados() {
    const feriados = { easterDay, getHolidaysBr, getHolidayBetweenDates };

    getSeiPro().core.feriados = feriados;

    aliasGlobal('easterDay', easterDay);
    aliasGlobal('getHolidaysBr', getHolidaysBr);
    aliasGlobal('getHolidayBetweenDates', getHolidayBetweenDates);

    return feriados;
}
