import { describe, expect, it } from 'vitest';
import { loadConfigWithData, loadConfigWithEmptyStorage } from '../helpers/load-seipro.js';

const sampleConfig = [{
    configGeral: [
        { name: 'darkmode', value: true },
        { name: 'kanban', value: 'enabled' },
        { name: 'emptyvalue', value: null }
    ]
}];

describe('config queries', () => {
    const config = loadConfigWithData(sampleConfig);

    it('reads configBasePro from localStorage', () => {
        expect(config.readConfigBasePro()).toEqual(sampleConfig);
    });

    it('returns configured boolean values', () => {
        expect(config.queryConfigValue('darkmode')).toBe(true);
        expect(config.verifyConfigValue('darkmode')).toBe(true);
    });

    it('returns string values via getConfigValue', () => {
        expect(config.getConfigValue('kanban')).toBe('enabled');
    });

    it('returns false for unknown keys', () => {
        expect(config.queryConfigValue('missing')).toBe(false);
        expect(config.verifyConfigValue('missing')).toBe(false);
    });

    it('treats null values as false', () => {
        expect(config.queryConfigValue('emptyvalue')).toBe(false);
    });

    it('returns empty array when localStorage is empty', () => {
        const empty = loadConfigWithEmptyStorage();
        expect(empty.readConfigBasePro()).toEqual([]);
    });
});

// checkConfigValue tem semântica "default-enabled" (Fase 6): recurso ligado a
// menos que explicitamente desligado. Precisa de um jmespath que resolva a query
// de valor "[?name=='X'].value | [0]" (o mock simples retorna null).
function makeJmespath() {
    return {
        search(data, expression) {
            if (expression === '[*].configGeral | [0]') {
                return data && data[0] && data[0].configGeral ? data[0].configGeral : null;
            }
            const m = expression.match(/^\[\?name=='(.+)'\]\.value \| \[0\]$/);
            if (m) {
                const arr = Array.isArray(data) ? data : [];
                const found = arr.filter((x) => x && x.name === m[1]);
                return found.length ? (found[0].value === undefined ? null : found[0].value) : null;
            }
            return null;
        }
    };
}

describe('checkConfigValue (default-enabled)', () => {
    const cfg = [{
        configGeral: [
            { name: 'kanban', value: true },
            { name: 'darkmode', value: false },
            { name: 'filtrarpaginapelapesquisarapida', value: false }
        ]
    }];
    const config = loadConfigWithData(cfg, makeJmespath());

    it('valor explícito true → true', () => {
        expect(config.checkConfigValue('kanban')).toBe(true);
    });

    it('valor explícito false → false', () => {
        expect(config.checkConfigValue('darkmode')).toBe(false);
    });

    it('config ausente → true (ligado por padrão)', () => {
        expect(config.checkConfigValue('inexistente')).toBe(true);
    });

    it('nome default-enabled força true mesmo desligado explicitamente', () => {
        expect(config.checkConfigValue('filtrarpaginapelapesquisarapida')).toBe(true);
    });

    it('isDefaultEnabledConfigValue reconhece o nome especial', () => {
        expect(config.isDefaultEnabledConfigValue('filtrarpaginapelapesquisarapida')).toBe(true);
        expect(config.isDefaultEnabledConfigValue('kanban')).toBe(false);
    });
});
