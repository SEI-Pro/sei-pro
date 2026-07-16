import { describe, expect, it, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

// datas.js depende de `moment` (+ plugin duration-format). Carregamos a lib vendor
// REAL no mesmo contexto do bundle — mais fiel que um stub de moment.
function loadWithMoment() {
  const SeiPro = { core: {}, sei: {}, features: {}, state: {} };
  const sandbox = {
    window: {}, SeiPro,
    chrome: { runtime: { getURL: (u) => `chrome-extension://test-id/${u}`, getManifest: () => ({ version: '1.0', short_name: 'x', icons: {} }) } },
    browser: undefined,
    sessionStorage: { _d: {}, getItem(k){ return this._d[k] ?? null; }, setItem(k,v){ this._d[k]=String(v); }, removeItem(k){ delete this._d[k]; } },
    localStorage: { _d: {}, getItem(k){ return this._d[k] ?? null; }, setItem(k,v){ this._d[k]=String(v); }, removeItem(k){ delete this._d[k]; } },
    console, URL,
    // $.merge/$.map mínimos — getDateSemantic(workday) chama getHolidayBetweenDates,
    // que usa esses utilitários ($.map descarta retornos null/undefined).
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
  run('dist/js/lib/moment-duration-format.min.js');
  // alguns builds do plugin exigem setup manual sobre o moment global
  if (typeof sandbox.moment.duration(0).format !== 'function' && typeof sandbox.momentDurationFormatSetup === 'function') {
    sandbox.momentDurationFormatSetup(sandbox.moment);
  }
  run('dist/js/lib/moment-weekday-calc.js'); // isoWeekdayCalc / isoAddWeekdaysFromSet
  run('dist/js/lib/jmespath.min.js');
  run('dist/js/core-stack.bundle.js');
  return sandbox;
}

let sandbox, datas;
beforeAll(() => { sandbox = loadWithMoment(); datas = sandbox.SeiPro.core.datas; });

describe('core/datas — instalação e dependência moment', () => {
  it('moment + plugin de duração carregaram no sandbox', () => {
    expect(typeof sandbox.moment).toBe('function');
    expect(typeof sandbox.moment.duration(1000).format).toBe('function');
  });
  it('expõe SeiPro.core.datas e os globais legados', () => {
    expect(typeof datas.getDatesFormatBR).toBe('function');
    expect(typeof sandbox.calculeDatesDuration).toBe('function');
  });
});

describe('getDatesFormatBR', () => {
  it('só data quando hora é 00:00:00', () => {
    expect(datas.getDatesFormatBR('2024-03-15 00:00:00')).toBe('15/03/2024');
  });
  it('data + hora quando há horário', () => {
    expect(datas.getDatesFormatBR('2024-03-15 14:30:00')).toBe('15/03/2024 14:30');
  });
});

describe('randomDate', () => {
  it('retorna data formatada YYYY-MM-DD HH:mm:ss dentro do range', () => {
    const start = new Date('2024-01-01').getTime();
    const end = new Date('2024-12-31').getTime();
    const out = datas.randomDate(start, end, 8, 18);
    expect(out).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(out.startsWith('2024-')).toBe(true);
  });
});

describe('getRecentDateRow', () => {
  it('retorna boolean para data de hoje', () => {
    const hoje = sandbox.moment().format('YYYY-MM-DD HH:mm:ss');
    expect(typeof datas.getRecentDateRow(hoje, 60)).toBe('boolean');
  });
  it('retorna undefined para data que não é hoje', () => {
    expect(datas.getRecentDateRow('2000-01-01 10:00:00', 60)).toBeUndefined();
  });
});

describe('buildDataRecebimentoRecord', () => {
  const base = {
    id_procedimento: '42', processo: '123.456', andamento: [
      { unidade: 'ABC', datahora: '2024-01-03 10:00:00', descricao: 'Processo público gerado', descricao_alt: '' },
      { unidade: 'ABC', datahora: '2024-01-04 11:00:00', descricao: 'Processo remetido pela unidade XYZ', descricao_alt: 'Unidade remetente' },
      { unidade: 'ABC', datahora: '2024-01-05 12:00:00', descricao: 'Processo recebido na unidade', descricao_alt: '' }
    ]
  };

  it('normaliza geração, remessa e recebimento no primeiro registro aplicável', () => {
    expect(datas.buildDataRecebimentoRecord(base, 'ABC', {
      datetime: '2024-01-06 00:00:00', observacoes: 'obs', acompanhamentoesp: 'sim'
    })).toEqual({
      id_procedimento: '42', processo: '123.456', datahora: '2024-01-03 10:00:00', unidade: 'ABC',
      descricao: 'Processo público gerado', datetime: '2024-01-06 00:00:00',
      datesend: '2024-01-04 11:00:00', descricaosend: 'Processo remetido pela unidade XYZ',
      unidadesend: 'XYZ', unidadesendfull: 'Unidade remetente - XYZ', datageracao: '2024-01-03 10:00:00',
      descricaodatageracao: 'Processo público gerado', observacoes: 'obs', acompanhamentoesp: 'sim'
    });
  });

  it('retorna null quando não há recebimento/geração na unidade', () => {
    expect(datas.buildDataRecebimentoRecord(base, 'DEF')).toBeNull();
  });
});

describe('calculeDatesDuration', () => {
  it('datas iguais → "hoje"', () => {
    expect(datas.calculeDatesDuration('2024-01-01', '2024-01-01', false)).toBe('hoje');
  });
  it('formata duração usando o template (exercita o plugin)', () => {
    const out = datas.calculeDatesDuration('2024-01-01', '2024-01-10', false);
    expect(out).toContain('dias');
  });
  it('countdays com diferença positiva → "N dias atrás"', () => {
    expect(datas.calculeDatesDuration('2024-01-10', '2024-01-01', true)).toBe('9 dias atrás');
  });
});

describe('getDateSemantic', () => {
  it('carregou plugins moment-weekday-calc e jmespath', () => {
    expect(typeof sandbox.moment().isoWeekdayCalc).toBe('function');
    expect(typeof sandbox.jmespath.search).toBe('function');
  });

  it('modo corrido (não-workday) calcula dateref, duedate, alerta', () => {
    const r = datas.getDateSemantic({
      date: '2024-01-01', dateTo: '2024-01-10', countdays: true, workday: false,
      duenumber: 30, displayformat: 'DD/MM/YYYY'
    });
    expect(r.date).toBe('2024-01-01');
    expect(r.dateref).toBe('9 dias atrás');
    expect(r.duedate).toBe('31/01/2024');
    expect(r.alertdate).toBe(false);
    expect(r.calcalert).toBe('21');
    expect(r.duecalcref).toBe('em 21 dias');
  });

  it('modo dias úteis (workday) usa os plugins e retorna texto de dias úteis', () => {
    const r = datas.getDateSemantic({
      date: '2024-01-01', dateTo: '2024-01-31', countdays: true, workday: true,
      duecounter: 'util', duenumber: 5, displayformat: 'DD/MM/YYYY'
    });
    expect(typeof r.duedate).toBe('string');
    expect(typeof r.alertdate).toBe('boolean');
    expect(r.dateref).toContain('úteis');
  });
});
