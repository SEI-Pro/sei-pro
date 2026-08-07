/**
 * ADR-0015 / Phase S.4: credential fields must not be written to storage.sync.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
    DATAVALUES_SECRET_FIELDS,
    extractProfileSecrets,
    mergeProfileSecrets,
    stripProfileSecrets,
    profilesContainSecrets
} from '../../src/options/domain.ts';

const root = process.cwd();
const read = (rel) => readFileSync(join(root, rel), 'utf8');

describe('secrets storage (ADR-0015)', () => {
    it('lists the credential fields that must leave storage.sync', () => {
        expect(DATAVALUES_SECRET_FIELDS).toEqual(
            expect.arrayContaining(['API_KEY', 'KEY_USER', 'CLIENT_ID', 'spreadsheetId'])
        );
    });

    it('strips and merges profile secrets without leaving them in sync payload', () => {
        const profiles = [{
            baseName: 'Ativ',
            baseTipo: 'atividades',
            conexaoTipo: 'api',
            URL_API: 'https://api.example.test',
            KEY_USER: 'secret-key',
            CLIENT_ID: 'client-1',
            API_KEY: 'api-secret',
            spreadsheetId: 'sheet-1'
        }];
        expect(profilesContainSecrets(profiles)).toBe(true);
        const secrets = extractProfileSecrets(profiles);
        const stripped = stripProfileSecrets(profiles);
        expect(profilesContainSecrets(stripped)).toBe(false);
        for (const field of DATAVALUES_SECRET_FIELDS) {
            expect(stripped[0][field]).toBeUndefined();
        }
        expect(stripped[0].URL_API).toBe('https://api.example.test');
        const merged = mergeProfileSecrets(stripped, secrets);
        expect(merged[0].KEY_USER).toBe('secret-key');
        expect(merged[0].API_KEY).toBe('api-secret');
        expect(merged[0].CLIENT_ID).toBe('client-1');
        expect(merged[0].spreadsheetId).toBe('sheet-1');
    });

    it('options io persists secrets via storage.local and strips sync writes', () => {
        const io = read('src/options/io.ts');
        expect(io).toMatch(/dataValuesSecrets/);
        expect(io).toMatch(/storage\.local/);
        expect(io).toMatch(/stripProfileSecrets|saveDataValuesSeparatingSecrets|migrateDataValuesSecrets/);
        // sync.set for dataValues must go through the separating/migration helpers
        expect(io).toMatch(/function saveDataValuesSeparatingSecrets|export async function saveDataValuesSeparatingSecrets|export function saveDataValuesSeparatingSecrets/);
    });

    it('options view migrates secrets on load and saves via separating helper', () => {
        const view = read('src/options/view.ts');
        expect(view).toMatch(/migrateDataValuesSecrets|loadDataValuesWithSecrets/);
        expect(view).toMatch(/saveDataValuesSeparatingSecrets/);
    });
});
