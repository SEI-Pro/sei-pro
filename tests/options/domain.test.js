import { describe, expect, it } from 'vitest';
import {
    buildDataValuesPayload,
    classifyProfileDraft,
    computeDependentVisibility,
    getConfigGeralEntry,
    inferConexaoTipo,
    isDefaultEnabledConfigOption,
    normalizeOptionsSearchText,
    parseDataValues,
    parseNewDocSigilo,
    pickConfigGeral,
    pickProfiles,
    resolveConfigFieldValue,
    resolveSwitchChecked,
    rowMatchesSearch,
    serializeDataValues
} from '../../src/options/domain.js';

describe('options domain: dataValues parse/serialize', () => {
    it('parses empty and invalid payloads as []', () => {
        expect(parseDataValues('')).toEqual([]);
        expect(parseDataValues(null)).toEqual([]);
        expect(parseDataValues('{')).toEqual([]);
        expect(parseDataValues('{"a":1}')).toEqual([]);
    });

    it('round-trips profiles + configGeral', () => {
        const profiles = [{ baseName: 'A', baseTipo: 'atividades', URL_API: 'https://x' }];
        const configGeral = [{ name: 'darkmode', value: true }];
        const payload = buildDataValuesPayload(profiles, configGeral);
        expect(pickProfiles(payload)).toEqual(profiles);
        expect(pickConfigGeral(payload)).toEqual(configGeral);
        expect(parseDataValues(serializeDataValues(payload))).toEqual(payload);
    });

    it('picks configGeral from any index', () => {
        const data = [
            { baseName: 'A' },
            { configGeral: [{ name: 'kanban', value: true }] }
        ];
        expect(pickConfigGeral(data)).toEqual([{ name: 'kanban', value: true }]);
        expect(getConfigGeralEntry(pickConfigGeral(data), 'kanban')).toEqual({ name: 'kanban', value: true });
    });
});

describe('options domain: defaults and switches', () => {
    it('keeps default-enabled keys aligned with the options UI', () => {
        expect(isDefaultEnabledConfigOption('gerenciarmonitorados')).toBe(true);
        expect(isDefaultEnabledConfigOption('autopreenchersenha')).toBe(true);
        expect(isDefaultEnabledConfigOption('darkmode')).toBe(false);
    });

    it('resolves switch checked state with defaults', () => {
        expect(resolveSwitchChecked(null, 'gerenciarmonitorados')).toBe(true);
        expect(resolveSwitchChecked([{ name: 'gerenciarmonitorados', value: false }], 'gerenciarmonitorados')).toBe(false);
        expect(resolveSwitchChecked([{ name: 'darkmode', value: true }], 'darkmode')).toBe(true);
        expect(resolveSwitchChecked([], 'darkmode')).toBe(false);
    });

    it('resolves non-boolean field values', () => {
        expect(resolveConfigFieldValue([{ name: 'newdocname', value: 'Oficio' }], 'newdocname')).toBe('Oficio');
        expect(resolveConfigFieldValue([], 'newdocname')).toBe(null);
    });
});

describe('options domain: helpers', () => {
    it('infers conexaoTipo like the legacy options page', () => {
        expect(inferConexaoTipo({ spreadsheetId: 'abc' })).toBe('sheets');
        expect(inferConexaoTipo({ KEY_USER: '' })).toBe('googleapi');
        expect(inferConexaoTipo({ KEY_USER: 'k' })).toBe('api');
    });

    it('parses newdocsigilo pipe values', () => {
        expect(parseNewDocSigilo('12|x|Reserva')).toEqual({ id: '12', label: 'Reserva' });
        expect(parseNewDocSigilo('')).toBe(null);
    });

    it('normalizes search text without accents', () => {
        expect(normalizeOptionsSearchText('  Árvore ')).toBe('arvore');
        expect(rowMatchesSearch('Controle de Processos', 'process')).toBe(true);
        expect(rowMatchesSearch('Editor', 'arvore')).toBe(false);
    });

    it('computes dependent visibility', () => {
        const vis = computeDependentVisibility({
            newdocdefault: true,
            uploaddocsexternos: false,
            certidaosigilo: true,
            newdocnivel: true
        });
        expect(vis.newdocDefault_table).toBe(true);
        expect(vis.uploadDoc_sortBefore).toBe(false);
        expect(vis.uncheckSortBeforeUpload).toBe(true);
        expect(vis.getDocCertidao_docName).toBe(true);
        expect(vis.newDoc_sigilo).toBe(false);
        expect(vis.clearNewDocSigilo).toBe(true);
    });

    it('treats blank database profiles as optional', () => {
        // Default form state: selects have values, name/credentials empty.
        expect(classifyProfileDraft({
            baseName: '',
            baseTipo: 'atividades',
            conexaoTipo: 'api',
            URL_API: '',
            KEY_USER: ''
        }).status).toBe('blank');

        expect(classifyProfileDraft({
            baseName: '',
            baseTipo: 'atividades',
            conexaoTipo: 'api',
            URL_API: 'https://example'
        }).status).toBe('incomplete');

        expect(classifyProfileDraft({
            baseName: 'Minha Base',
            baseTipo: 'atividades',
            conexaoTipo: 'api',
            URL_API: 'https://example'
        }).status).toBe('complete');
    });
});
