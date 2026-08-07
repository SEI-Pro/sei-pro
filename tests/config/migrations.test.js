/**
 * ADR-0009 / Phase 2.5–2.6 — versioned storage migrations.
 */
import { describe, expect, it } from 'vitest';
import {
    CONFIG_STORAGE_VERSION,
    LLM_PROFILES_STORE_VERSION,
    MONITORADOS_STORE_VERSION,
    PROJETOS_STORE_VERSION,
    DATAVALUES_SECRET_FIELDS,
    getLlmProfilesStoreVersion,
    mergeEntriesWithSecrets,
    migrateFromOldestSupported,
    migrateLocalFeatureStore,
    parseDataValuesEntries,
    readDataValuesVersion,
    serializeVersionedDataValues
} from '../../src/config/migrations/index.ts';

describe('config migrations: dataValues', () => {
    const oldest = [
        {
            baseName: 'Ativ',
            baseTipo: 'atividades',
            conexaoTipo: 'api',
            URL_API: 'https://api.example.test',
            KEY_USER: 'secret-key',
            API_KEY: 'api-secret',
            CLIENT_ID: 'client-1',
            spreadsheetId: 'sheet-1'
        },
        {
            configGeral: [
                { name: 'darkmode', value: true },
                { name: 'llmProvedoresExternos', value: true }
            ]
        }
    ];

    it('treats a bare array as version 0', () => {
        expect(readDataValuesVersion(oldest)).toBe(0);
        expect(readDataValuesVersion(JSON.stringify(oldest))).toBe(0);
        expect(parseDataValuesEntries(oldest)).toEqual(oldest);
    });

    it('migrates the oldest shape to the current version with secrets stripped', () => {
        const result = migrateFromOldestSupported(oldest, {});
        expect(result.version).toBe(CONFIG_STORAGE_VERSION);
        expect(result.changed).toBe(true);
        expect(result.entries).toHaveLength(2);

        const profile = result.entries[0];
        for (const field of DATAVALUES_SECRET_FIELDS) {
            expect(profile[field]).toBeUndefined();
        }
        expect(profile.URL_API).toBe('https://api.example.test');
        expect(profile.baseName).toBe('Ativ');

        expect(result.secrets).toBeTruthy();
        const secretBags = Object.values(result.secrets);
        expect(secretBags.length).toBeGreaterThan(0);
        expect(secretBags[0].KEY_USER).toBe('secret-key');
        expect(secretBags[0].API_KEY).toBe('api-secret');

        const configGeral = result.entries[1].configGeral;
        expect(configGeral).toEqual([
            { name: 'darkmode', value: true },
            { name: 'llmProvedoresExternos', value: true }
        ]);
    });

    it('round-trips the versioned object and restores secrets for UI', () => {
        const migrated = migrateFromOldestSupported(oldest, {});
        const serialized = serializeVersionedDataValues(migrated.entries);
        expect(readDataValuesVersion(serialized)).toBe(CONFIG_STORAGE_VERSION);
        const entries = parseDataValuesEntries(serialized);
        const merged = mergeEntriesWithSecrets(entries, migrated.secrets);
        expect(merged[0].KEY_USER).toBe('secret-key');
        expect(merged[1].configGeral[0].name).toBe('darkmode');
    });

    it('is idempotent when already at current version without sync secrets', () => {
        const first = migrateFromOldestSupported(oldest, {});
        const second = migrateFromOldestSupported(
            { version: CONFIG_STORAGE_VERSION, entries: first.entries },
            first.secrets
        );
        expect(second.version).toBe(CONFIG_STORAGE_VERSION);
        expect(second.changed).toBe(false);
        expect(second.entries).toEqual(first.entries);
    });
});

describe('config migrations: local feature stores', () => {
    it('stamps version on unversioned monitorados store', () => {
        const { store, changed } = migrateLocalFeatureStore(
            { monitorados: [{ id_procedimento: '1' }], config: { colortags: [] } },
            'monitorados',
            () => ({ monitorados: [], config: { colortags: [] } })
        );
        expect(changed).toBe(true);
        expect(store.version).toBe(MONITORADOS_STORE_VERSION);
        expect(store.monitorados).toHaveLength(1);
    });

    it('leaves already-versioned projetos store untouched', () => {
        const current = {
            version: PROJETOS_STORE_VERSION,
            projetos: [{ id_projeto: 1 }],
            tipos_projetos: []
        };
        const { store, changed } = migrateLocalFeatureStore(
            current,
            'projetos',
            () => ({ version: PROJETOS_STORE_VERSION, projetos: [], tipos_projetos: [] })
        );
        expect(changed).toBe(false);
        expect(store).toBe(current);
    });

    it('exposes AI profiles store version coordinated with existing migration', () => {
        expect(getLlmProfilesStoreVersion()).toBe(LLM_PROFILES_STORE_VERSION);
        expect(LLM_PROFILES_STORE_VERSION).toBe(2);
    });
});
