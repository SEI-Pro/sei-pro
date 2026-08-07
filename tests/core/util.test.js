import { describe, expect, it, vi } from 'vitest';
import {
    compareVersionNumbers,
    getParamsUrlPro,
    capitalizeFirstLetter,
    romanToInt,
    uniqPro
} from '../../src/core/util.ts';

describe('compareVersionNumbers', () => {
    it('orders semantic versions', () => {
        expect(compareVersionNumbers('4.1.0', '4.0.9')).toBe(1);
        expect(compareVersionNumbers('5.0.0', '4.9.9')).toBe(1);
        expect(compareVersionNumbers('4.0.0', '4.0.0')).toBe(0);
        expect(compareVersionNumbers('3.9', '4.0')).toBe(-1);
    });

    it('returns NaN for invalid parts', () => {
        expect(Number.isNaN(compareVersionNumbers('4.x', '4.0'))).toBe(true);
    });
});

describe('getParamsUrlPro', () => {
    it('parses query string parameters', () => {
        expect(getParamsUrlPro('https://sei.example/sei/controlador.php?acao=procedimento_trabalhar&id=42')).toEqual({
            acao: 'procedimento_trabalhar',
            id: '42'
        });
    });

    it('decodes plus and percent encoding', () => {
        expect(getParamsUrlPro('https://x/?a=hello+world&b=100%25')).toEqual({
            a: 'hello world',
            b: '100%'
        });
    });

    it('keeps legacy malformed percent escapes without throwing or logging', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        expect(getParamsUrlPro('https://x/?msg=Hash+inv%E1lido&acao=erro')).toEqual({
            msg: 'Hash inv%E1lido',
            acao: 'erro'
        });
        expect(warn).not.toHaveBeenCalled();
        warn.mockRestore();
    });

    it('returns false when no query', () => {
        expect(getParamsUrlPro('https://x/path')).toBe(false);
    });
});

describe('capitalizeFirstLetter', () => {
    it('title-cases while keeping particles lowercase', () => {
        expect(capitalizeFirstLetter('processo de importação')).toBe('Processo de Importação');
    });
});

describe('romanToInt', () => {
    it('converts roman numerals', () => {
        expect(romanToInt('IV')).toBe(4);
        expect(romanToInt('IX')).toBe(9);
    });
});

describe('uniqPro', () => {
    it('deduplicates sorted values', () => {
        expect(uniqPro(['b', 'a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });
});
