/**
 * Versioned storage migrations (ADR-0009 / Phase 2.5–2.6).
 *
 * - dataValues: legacy JSON array → `{ version, entries }`
 * - secrets: coordinated strip to dataValuesSecrets (Phase S.4)
 * - monitorados / projetos local stores: stamp `version`
 * - AI profiles: version constant aligned with existing llm migration
 */
import {
    mergeProfileSecrets,
    profilesContainSecrets,
    separateDataValuesSecrets
} from './secrets.js';
import {
    CONFIG_STORAGE_VERSION,
    LLM_PROFILES_STORE_VERSION,
    MONITORADOS_STORE_VERSION,
    PROJETOS_STORE_VERSION,
    type DataValuesList,
    type MigrateDataValuesResult,
    type SecretsMap,
    type VersionedDataValues,
    type VersionedLocalStore
} from './types.js';

function pickProfiles(entries: DataValuesList): unknown[] {
    return (Array.isArray(entries) ? entries : []).filter(
        (entry) => entry && typeof entry === 'object' && typeof (entry as { baseName?: unknown }).baseName !== 'undefined'
    );
}

export {
    CONFIG_STORAGE_VERSION,
    LLM_PROFILES_STORE_VERSION,
    MONITORADOS_STORE_VERSION,
    PROJETOS_STORE_VERSION
} from './types.js';
export type {
    DataValuesList,
    MigrateDataValuesResult,
    SecretsMap,
    VersionedDataValues,
    VersionedLocalStore
} from './types.js';
export {
    DATAVALUES_SECRET_FIELDS,
    extractProfileSecrets,
    mergeProfileSecrets,
    profilesContainSecrets,
    separateDataValuesSecrets,
    stripProfileSecrets,
    profileSecretKey
} from './secrets.js';

function asObject(value: unknown): Record<string, unknown> | null {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : null;
}

/** Parse sync dataValues raw string/array/versioned object into a list. */
export function parseDataValuesEntries(raw: unknown): DataValuesList {
    if (raw === null || typeof raw === 'undefined' || raw === '') return [];
    let parsed: unknown = raw;
    if (typeof raw === 'string') {
        try {
            parsed = JSON.parse(raw);
        } catch {
            // intentional: corrupt payload → empty entries
            return [];
        }
    }
    if (Array.isArray(parsed)) return parsed;
    const obj = asObject(parsed);
    if (obj && Array.isArray(obj.entries)) return obj.entries as DataValuesList;
    return [];
}

export function readDataValuesVersion(raw: unknown): number {
    if (raw === null || typeof raw === 'undefined' || raw === '') return 0;
    let parsed: unknown = raw;
    if (typeof raw === 'string') {
        try {
            parsed = JSON.parse(raw);
        } catch {
            // intentional: corrupt payload → unversioned
            return 0;
        }
    }
    if (Array.isArray(parsed)) return 0;
    const obj = asObject(parsed);
    if (obj && typeof obj.version === 'number') return obj.version;
    return 0;
}

/**
 * Normalize any historical dataValues shape to the current versioned object and
 * extract leftover sync secrets into the local secrets map.
 */
export function migrateDataValuesToCurrent(
    raw: unknown,
    existingSecrets: SecretsMap | null | undefined = {}
): MigrateDataValuesResult {
    const version = readDataValuesVersion(raw);
    let entries = parseDataValuesEntries(raw);
    let secrets: SecretsMap =
        existingSecrets && typeof existingSecrets === 'object' ? { ...existingSecrets } : {};
    let changed = version < CONFIG_STORAGE_VERSION;

    if (profilesContainSecrets(pickProfiles(entries))) {
        const separated = separateDataValuesSecrets(entries);
        secrets = { ...secrets, ...separated.secrets };
        entries = separated.dataValues;
        changed = true;
    }

    return {
        version: CONFIG_STORAGE_VERSION,
        entries,
        secrets,
        changed
    };
}

/** Serialize the current versioned sync payload (secrets must already be stripped). */
export function serializeVersionedDataValues(entries: DataValuesList): string {
    const payload: VersionedDataValues = {
        version: CONFIG_STORAGE_VERSION,
        entries: Array.isArray(entries) ? entries : []
    };
    return JSON.stringify(payload);
}

/**
 * Restore profiles with local secrets for UI/runtime, keeping configGeral intact.
 */
export function mergeEntriesWithSecrets(entries: DataValuesList, secrets: SecretsMap): DataValuesList {
    const list = Array.isArray(entries) ? entries : [];
    const profiles: unknown[] = [];
    const rest: unknown[] = [];
    list.forEach((entry) => {
        if (entry && typeof entry === 'object' && typeof (entry as { baseName?: unknown }).baseName !== 'undefined') {
            profiles.push(entry);
        } else {
            rest.push(entry);
        }
    });
    return mergeProfileSecrets(profiles, secrets).concat(rest);
}

type LocalStoreKind = 'monitorados' | 'projetos';

const LOCAL_STORE_TARGET: Record<LocalStoreKind, number> = {
    monitorados: MONITORADOS_STORE_VERSION,
    projetos: PROJETOS_STORE_VERSION
};

/**
 * Stamp / bump a local feature store to the current schema version.
 * Oldest supported shape: unversioned object (version 0).
 */
export function migrateLocalFeatureStore<T extends Record<string, unknown>>(
    raw: unknown,
    kind: LocalStoreKind,
    createDefault: () => T
): { store: VersionedLocalStore<T>; changed: boolean } {
    const target = LOCAL_STORE_TARGET[kind];
    const obj = asObject(raw);
    if (!obj || Object.keys(obj).length === 0) {
        const fresh = createDefault();
        return {
            store: { ...fresh, version: target },
            changed: true
        };
    }
    const current = typeof obj.version === 'number' ? obj.version : 0;
    if (current >= target) {
        return { store: obj as VersionedLocalStore<T>, changed: false };
    }
    // v0 → v1: add version field only (payload shape unchanged).
    return {
        store: { ...(obj as T), version: target },
        changed: true
    };
}

/** AI profiles already migrate via features/ai; expose the target version here. */
export function getLlmProfilesStoreVersion(): number {
    return LLM_PROFILES_STORE_VERSION;
}

/**
 * Apply the full pipeline: oldest unversioned array + sync secrets → current
 * versioned object + merged local secrets map.
 */
export function migrateFromOldestSupported(
    oldestRaw: unknown,
    existingSecrets: SecretsMap | null | undefined = {}
): MigrateDataValuesResult {
    return migrateDataValuesToCurrent(oldestRaw, existingSecrets);
}
