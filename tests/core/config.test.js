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
