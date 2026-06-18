import { describe, expect, it, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

// getRecalculaPrazo depende de moment (+ weekday-calc), jmespath e
// getHolidayBetweenDates (que usa $.merge/$.map). Carregamos as libs reais e um
// $ mínimo no mesmo contexto do bundle.
function loadWithLibs() {
  const SeiPro = { core: {}, sei: {}, features: {}, state: {} };
  const sandbox = {
    window: {}, SeiPro,
    chrome: { runtime: { getURL: (u) => `chrome-extension://test-id/${u}`, getManifest: () => ({ version: '1.0', short_name: 'x', icons: {} }) } },
    browser: undefined,
    sessionStorage: { _d:{}, getItem(k){return this._d[k]??null;}, setItem(k,v){this._d[k]=String(v);}, removeItem(k){delete this._d[k];} },
    localStorage: { _d:{}, getItem(k){return this._d[k]??null;}, setItem(k,v){this._d[k]=String(v);}, removeItem(k){delete this._d[k];} },
    console, URL,
    $: {
      merge(first, second) { Array.prototype.push.apply(first, second || []); return first; },
      map(arr, cb) { const o = []; (arr || []).forEach((v, i) => { const r = cb(v, i); if (r !== null && r !== undefined) o.push(r); }); return o; }
    },
    jQuery: undefined
  };
  sandbox.window = sandbox;
  const ctx = vm.createContext(sandbox);
  const run = (rel) => vm.runInContext(readFileSync(join(rootDir, rel), 'utf8'), ctx, { filename: rel });
  run('dist/js/lib/moment.min.js');
  run('dist/js/lib/moment-weekday-calc.js');
  run('dist/js/lib/jmespath.min.js');
  run('dist/js/core-stack.bundle.js');
  return sandbox;
}

let sandbox, prazos;
beforeAll(() => { sandbox = loadWithLibs(); prazos = sandbox.SeiPro.core.prazos; });

describe('core/prazos — instalação', () => {
  it('expõe SeiPro.core.prazos e o alias global', () => {
    expect(typeof prazos.getRecalculaPrazo).toBe('function');
    expect(typeof sandbox.getRecalculaPrazo).toBe('function');
  });
});

describe('getRecalculaPrazo', () => {
  const fmt = 'DD/MM/YYYY';

  it('dias corridos: soma simples (não conta dias úteis)', () => {
    const r = prazos.getRecalculaPrazo('01/01/2024', fmt, 10, { count_dias_uteis: false });
    expect(r).toBe('11/01/2024');
  });

  it('dias úteis: pula fins de semana', () => {
    // 01/01/2024 é segunda (e feriado Ano Novo). +5 dias úteis.
    const r = prazos.getRecalculaPrazo('01/01/2024', fmt, 5, { count_dias_uteis: true });
    // resultado deve ser uma data válida no formato e posterior ao início
    expect(r).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(sandbox.moment(r, fmt).isAfter(sandbox.moment('01/01/2024', fmt))).toBe(true);
    // 5 dias úteis a partir de 01/01 não cai em fim de semana
    expect([6, 0]).not.toContain(sandbox.moment(r, fmt).day());
  });

  it('dias úteis respeita feriado customizado recorrente', () => {
    const semFeriado = prazos.getRecalculaPrazo('01/03/2024', fmt, 5, { count_dias_uteis: true });
    const comFeriado = prazos.getRecalculaPrazo('01/03/2024', fmt, 5, {
      count_dias_uteis: true,
      feriados: [{ recorrente: true, feriado_data: '05/03', nome_feriado: 'Feriado Teste' }]
    });
    // com um feriado a mais no intervalo, a entrega é empurrada para frente (ou igual)
    expect(sandbox.moment(comFeriado, fmt).isSameOrAfter(sandbox.moment(semFeriado, fmt))).toBe(true);
  });
});

describe('parsePrazoTag', () => {
  it('extrai data, hora e dateTo de um marcador "até"', () => {
    const r = prazos.parsePrazoTag("return infraTooltipMostrar('Prazo até 15/03/2024 18:00');");
    expect(r.content).toBe('Prazo até 15/03/2024 18:00');
    expect(r.dateTo).toBe(true);
    expect(r.dateTag).toBe('15/03/2024 18:00');
  });

  it('usa 23:59 quando não há hora', () => {
    const r = prazos.parsePrazoTag("return infraTooltipMostrar('Entregar 20/12/2024');");
    expect(r.dateTo).toBe(false);
    expect(r.dateTag).toBe('20/12/2024 23:59');
  });

  it('sem data → dateTag false', () => {
    const r = prazos.parsePrazoTag("return infraTooltipMostrar('Sem prazo definido');");
    expect(r.dateTag).toBe(false);
  });

  it('tag undefined → tudo falsy', () => {
    const r = prazos.parsePrazoTag(undefined);
    expect(r.content).toBe(false);
    expect(r.dateTo).toBe(false);
    expect(r.dateTag).toBe(false);
  });
});

describe('parsePrazoTooltip', () => {
  it('formato "ate DD/MM/YYYY" → datePrazoDue, datePrazo false', () => {
    const r = prazos.parsePrazoTooltip('Vencimento até 15/03/2024');
    expect(r.datePrazoDue).toBe('2024-03-15 00:00:00');
    expect(r.datePrazo).toBe(false);
  });

  it('data solta (sem "ate") → datePrazo, datePrazoDue false', () => {
    const r = prazos.parsePrazoTooltip('Recebido em 20/12/2024');
    expect(r.datePrazo).toBe('2024-12-20 00:00:00');
    expect(r.datePrazoDue).toBe(false);
  });

  it('sem data → ambos false', () => {
    const r = prazos.parsePrazoTooltip('Nenhuma data aqui');
    expect(r.datePrazo).toBe(false);
    expect(r.datePrazoDue).toBe(false);
  });

  it('undefined → ambos false (não lança)', () => {
    const r = prazos.parsePrazoTooltip(undefined);
    expect(r.datePrazo).toBe(false);
    expect(r.datePrazoDue).toBe(false);
  });
});

describe('getDateBoxState', () => {
  const fmt = 'YYYY-MM-DD HH:mm:ss';

  it('data futura → "Seguinte"', () => {
    const futuro = sandbox.moment().add(10, 'days').format(fmt);
    const r = prazos.getDateBoxState({ date: futuro }, {});
    expect(r.value).toBe('date_seguinte');
  });

  it('data passada → "Vencida"', () => {
    const passado = sandbox.moment().subtract(10, 'days').format(fmt);
    const r = prazos.getDateBoxState({ date: passado }, {});
    expect(r.value).toBe('date_vencido');
  });

  it('atrasada (duedate + alertdate) tem prioridade sobre seguinte', () => {
    const futuro = sandbox.moment().add(10, 'days').format(fmt);
    const r = prazos.getDateBoxState({ date: futuro, duedate: true }, { alertdate: true });
    expect(r.value).toBe('date_atrasado');
  });

  it('nametag custom sobrescreve toda a cascata', () => {
    const futuro = sandbox.moment().add(10, 'days').format(fmt);
    const custom = { name: 'X', value: 'date_x', color: '#000' };
    const r = prazos.getDateBoxState({ date: futuro, nametag: custom }, {});
    expect(r).toBe(custom);
  });
});

describe('getProgressPercent', () => {
  const fmt = 'YYYY-MM-DD';

  it('sem duedate/duesetdate → não exibe', () => {
    const r = prazos.getProgressPercent({ date: '2024-01-01', dateDue: '2024-01-11' });
    expect(r.show).toBe(false);
  });

  it('progresso em andamento → percentual entre 0 e 100', () => {
    const inicio = sandbox.moment().subtract(5, 'days').format(fmt);
    const fim = sandbox.moment().add(5, 'days').format(fmt);
    const r = prazos.getProgressPercent({ date: inicio, dateDue: fim, duesetdate: true });
    expect(r.show).toBe(true);
    expect(r.percent).toBeGreaterThanOrEqual(0);
    expect(r.percent).toBeLessThanOrEqual(100);
  });

  it('progresso fora do intervalo (já vencido) → não exibe', () => {
    const inicio = sandbox.moment().subtract(20, 'days').format(fmt);
    const fim = sandbox.moment().subtract(10, 'days').format(fmt);
    const r = prazos.getProgressPercent({ date: inicio, dateDue: fim, duesetdate: true });
    expect(r.show).toBe(false);
  });
});
