import { describe, expect, it } from 'vitest';
import { loadCoreScripts } from '../helpers/load-core.js';

const sandbox = loadCoreScripts();
const { numeros } = sandbox.SeiPro.core;

describe('core/numeros — instalação e aliases', () => {
  it('expõe SeiPro.core.numeros e globais legados', () => {
    expect(typeof numeros.arrayMax).toBe('function');
    expect(typeof sandbox.toNumBr).toBe('function');
    expect(typeof sandbox.onlyNumber).toBe('function');
  });
});

describe('arrayMax / arrayMin', () => {
  it('retorna maior e menor de um array', () => {
    expect(numeros.arrayMax([3, 7, 2, 9, 1])).toBe(9);
    expect(numeros.arrayMin([3, 7, 2, 9, 1])).toBe(1);
  });
});

describe('toNumBr', () => {
  it('troca ponto por vírgula', () => {
    expect(numeros.toNumBr('1.5')).toBe('1,5');
    expect(numeros.toNumBr(1234.56)).toBe('1234,56');
  });
});

describe('isNumeric', () => {
  it('reconhece numéricos e rejeita não-numéricos', () => {
    expect(numeros.isNumeric('42')).toBe(true);
    expect(numeros.isNumeric('3.14')).toBe(true);
    expect(numeros.isNumeric('abc')).toBe(false);
    expect(numeros.isNumeric('')).toBe(false);
  });
});

describe('roundToTwo', () => {
  it('arredonda para 2 casas', () => {
    expect(numeros.roundToTwo(1.005)).toBe(1.01);
    expect(numeros.roundToTwo(2.7649)).toBe(2.76);
  });
});

describe('randomNumber', () => {
  it('gera inteiro dentro do range [min, max]', () => {
    for (let i = 0; i < 100; i++) {
      const n = numeros.randomNumber(5, 10);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(5);
      expect(n).toBeLessThanOrEqual(10);
    }
  });
});

describe('avgArray', () => {
  it('calcula a média', () => {
    expect(numeros.avgArray([2, 4, 6])).toBe(4);
    expect(numeros.avgArray(['10', '20'])).toBe(15);
  });
});

describe('reverseArray', () => {
  it('inverte o array', () => {
    expect(numeros.reverseArray([1, 2, 3])).toEqual([3, 2, 1]);
  });
});

describe('toArray', () => {
  it('converte array-like em Array', () => {
    const arrayLike = { 0: 'a', 1: 'b', length: 2 };
    const out = numeros.toArray(arrayLike);
    expect(Array.isArray(out)).toBe(true);
    expect(out).toEqual(['a', 'b']);
  });
});

describe('decimalHourToMinute', () => {
  it('formata minutos decimais como MM:SS', () => {
    expect(numeros.decimalHourToMinute(5.5)).toBe('05:30');
    expect(numeros.decimalHourToMinute(-1)).toBe('-01:00');
  });
});

describe('hasNumber / onlyNumber', () => {
  it('hasNumber detecta dígito', () => {
    expect(numeros.hasNumber('abc1')).toBe(true);
    expect(numeros.hasNumber('abc')).toBe(false);
  });
  it('onlyNumber extrai dígitos (ou devolve original sem dígitos)', () => {
    expect(numeros.onlyNumber('08675.002846/2025-10')).toBe('08675002846202510');
    expect(numeros.onlyNumber('sem digito')).toBe('sem digito');
  });
});
