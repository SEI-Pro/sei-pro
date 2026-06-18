import { describe, expect, it } from 'vitest';
import { loadCoreScripts } from '../helpers/load-core.js';

const sandbox = loadCoreScripts();
const { cor } = sandbox.SeiPro.core;

describe('core/cor — instalação e aliases', () => {
  it('expõe o módulo em SeiPro.core.cor e nos globais legados', () => {
    expect(typeof cor.rgbToHex).toBe('function');
    expect(typeof sandbox.rgbToHex).toBe('function');
    expect(typeof sandbox.hexToRgb).toBe('function');
  });
});

describe('componentToHex / rgbToHex', () => {
  it('converte componentes RGB para hex com padding', () => {
    expect(cor.componentToHex(0)).toBe('00');
    expect(cor.componentToHex(255)).toBe('ff');
    expect(cor.rgbToHex(255, 0, 16)).toBe('#ff0010');
  });
});

describe('rgbToHexString', () => {
  it('converte "rgb(r, g, b)" para "#rrggbb"', () => {
    expect(cor.rgbToHexString('rgb(255, 0, 16)')).toBe('#ff0010');
  });

  it('devolve string vazia para entrada nula', () => {
    expect(cor.rgbToHexString(null)).toBe('');
  });
});

describe('addAlpha', () => {
  it('acrescenta canal alpha em hex maiúsculo', () => {
    expect(cor.addAlpha('#ffffff', 1)).toBe('#ffffffFF');
    expect(cor.addAlpha('#000000', 0.5)).toBe('#00000080');
    // quirk verbatim: opacity 0 é falsy → `opacity || 1` usa 1 → FF
    expect(cor.addAlpha('#000000', 0)).toBe('#000000FF');
  });
});

describe('getBrightnessColor', () => {
  it('calcula brilho YIQ (branco alto, preto zero)', () => {
    expect(cor.getBrightnessColor('#ffffff')).toBe(255);
    expect(cor.getBrightnessColor('#000000')).toBe(0);
  });
});

describe('hexToRgb', () => {
  it('converte "#rrggbb" em objeto {r,g,b}', () => {
    expect(cor.hexToRgb('#ff0010')).toEqual({ r: 255, g: 0, b: 16 });
  });

  it('retorna null para hex inválido', () => {
    expect(cor.hexToRgb('xyz')).toBeNull();
  });
});
