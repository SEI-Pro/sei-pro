/**
 * ADR-0009 / Phase 2.3 — typed getConfig.
 */
import { describe, expect, it } from 'vitest';
import { getConfig, getConfigFlag } from '../../src/config/read.ts';

describe('getConfig', () => {
    it('returns schema default when the key is absent from storage', () => {
        expect(getConfig('autopreenchersenha', { configGeral: [], isDev: false })).toBe(true);
        expect(getConfig('debugpage', { configGeral: [], isDev: false })).toBe(false);
        expect(getConfig('salvamentoautomatico', { configGeral: null, isDev: false })).toBe(5);
    });

    it('returns stored values when present', () => {
        const configGeral = [
            { name: 'debugpage', value: true },
            { name: 'qualidadeimagens', value: 80 },
            { name: 'newdocname', value: 'Ofício' }
        ];
        expect(getConfig('debugpage', { configGeral, isDev: false })).toBe(true);
        expect(getConfig('qualidadeimagens', { configGeral, isDev: false })).toBe(80);
        expect(getConfig('newdocname', { configGeral, isDev: false })).toBe('Ofício');
    });

    it('throws on unknown keys in DEV and returns false in production', () => {
        expect(() => getConfig('notARealKey', { isDev: true })).toThrow(/unknown config key/i);
        expect(getConfig('notARealKey', { isDev: false })).toBe(false);
    });

    it('reads via readConfigBasePro when configGeral is not injected', () => {
        const value = getConfig('menurapido', {
            isDev: false,
            readConfigBasePro: () => [{ configGeral: [{ name: 'menurapido', value: true }] }]
        });
        expect(value).toBe(true);
        expect(getConfigFlag('menurapido', {
            isDev: false,
            readConfigBasePro: () => [{ configGeral: [{ name: 'menurapido', value: true }] }]
        })).toBe(true);
    });

    it('keeps llmProvedoresExternos default open', () => {
        expect(getConfig('llmProvedoresExternos', { configGeral: [], isDev: false })).toBe(true);
        expect(getConfig('llmProvedoresExternos', {
            configGeral: [{ name: 'llmProvedoresExternos', value: false }],
            isDev: false
        })).toBe(false);
    });
});
