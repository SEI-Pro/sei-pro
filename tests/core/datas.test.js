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
    console, URL
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
