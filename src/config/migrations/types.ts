/**
 * Versioned persisted structures (ADR-0009 / Phase 2.5–2.6).
 */

export const CONFIG_STORAGE_VERSION = 1;
export const MONITORADOS_STORE_VERSION = 1;
export const PROJETOS_STORE_VERSION = 1;
/** Aligns with llmProfilesLegacyMigrationVersion used by features/ai. */
export const LLM_PROFILES_STORE_VERSION = 2;

export type DataValuesList = unknown[];

/** Sync-safe config blob after Phase 2 versioning. */
export type VersionedDataValues = {
    version: number;
    entries: DataValuesList;
};

export type VersionedLocalStore<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    version: number;
};

export type SecretsMap = Record<string, Record<string, unknown>>;

export type MigrateDataValuesResult = {
    version: number;
    entries: DataValuesList;
    secrets: SecretsMap;
    /** True when sync payload and/or local secrets were rewritten. */
    changed: boolean;
};
