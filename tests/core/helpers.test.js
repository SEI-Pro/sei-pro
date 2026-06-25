import { describe, it, expect } from 'vitest';
import {
    checkObjHasProperty, fixedEncodeURIComponent, infraFormatarTamanhoBytes,
    prepCSVRow, removeDuplicatesArray, trycatch, zeroWidthTrim, checkBrowser
} from '@src/core/helpers.js';

describe('core/helpers', () => {
    it('checkObjHasProperty: true só se todos os itens têm a chave', () => {
        expect(checkObjHasProperty([{ a: 1 }, { a: 2 }], 'a')).toBe(true);
        expect(checkObjHasProperty([{ a: 1 }, { b: 2 }], 'a')).toBe(false);
    });

    it('fixedEncodeURIComponent escapa !\'()*', () => {
        expect(fixedEncodeURIComponent("a!'()*b")).toBe('a%21%27%28%29%2ab');
    });

    it('infraFormatarTamanhoBytes formata por faixa', () => {
        expect(infraFormatarTamanhoBytes(2048)).toBe('2 Kb');
        expect(infraFormatarTamanhoBytes(1048576 * 3)).toBe('3 Mb');
    });

    it('prepCSVRow monta linhas com ; e \\r\\n', () => {
        const csv = prepCSVRow(['a', 'b', 'c', 'd'], 2, '');
        expect(csv).toBe('a;b\r\nc;d\r\n');
    });

    it('removeDuplicatesArray remove por chave ref (sem jQuery)', () => {
        const out = removeDuplicatesArray([{ id: 1 }, { id: 1 }, { id: 2 }], 'id');
        expect(out).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('trycatch retorna fallback em exceção', () => {
        expect(trycatch(() => 42, 'x')).toBe(42);
        expect(trycatch(() => { throw new Error('z'); }, 'x')).toBe('x');
    });

    it('zeroWidthTrim remove caracteres zero-width', () => {
        const input = 'a' + String.fromCharCode(0x200b) + 'b' + String.fromCharCode(0xfeff) + 'c';
        expect(zeroWidthTrim(input)).toBe('abc');
        expect(zeroWidthTrim('normal')).toBe('normal');
    });
});

describe('core/helpers — checkBrowser', () => {
  it('detecta a partir do userAgent', () => {
    expect(['Chrome','Firefox','MSIE 8.0','MSIE 9.0','']).toContain(checkBrowser());
  });
});
