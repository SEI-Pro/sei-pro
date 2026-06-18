import { describe, expect, it } from 'vitest';
import { loadCoreScripts } from '../helpers/load-core.js';

const sandbox = loadCoreScripts();
const { serial } = sandbox.SeiPro.core;

describe('core/serial — instalação e aliases', () => {
  it('expõe SeiPro.core.serial e globais legados', () => {
    expect(typeof serial.isJson).toBe('function');
    expect(typeof sandbox.tryParseJsonObject).toBe('function');
    expect(typeof sandbox.isBase64).toBe('function');
  });
});

describe('isJson', () => {
  it('valida JSON', () => {
    expect(serial.isJson('{"a":1}')).toBe(true);
    expect(serial.isJson('nope')).toBe(false);
  });
});

describe('tryParseJsonObject', () => {
  it('retorna objeto só para JSON de objeto puro', () => {
    expect(serial.tryParseJsonObject('{"a":1}')).toEqual({ a: 1 });
    expect(serial.tryParseJsonObject('[1,2]')).toBe(false);
    expect(serial.tryParseJsonObject('lixo')).toBe(false);
  });
});

describe('convertJsonBools', () => {
  it('converte "true"/"false" string em boolean', () => {
    expect(serial.convertJsonBools({ a: 'true', b: 'false', c: 'x', n: 1 }))
      .toEqual({ a: true, b: false, c: 'x', n: 1 });
  });
});

describe('isBase64', () => {
  it('reconhece base64 válido e rejeita inválido', () => {
    expect(serial.isBase64('aGVsbG8=')).toBe(true); // "hello"
    expect(serial.isBase64('not base64!!')).toBe(false);
  });
});
