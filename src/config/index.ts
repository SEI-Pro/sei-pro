/**
 * Config package public surface (ADR-0009).
 */
export {
    CONFIG_SCHEMA,
    getDefaultEnabledConfigKeys,
    getSchemaEntry,
    isConfigKey,
    listSchemaEntriesForOptionsSection,
    type ConfigKey,
    type ConfigSchemaEntry,
    type ConfigValueType
} from './schema.js';

export {
    assertConfigKey,
    getConfig,
    getConfigFlag,
    type GetConfigOptions
} from './read.js';

export {
    CONFIG_STORAGE_VERSION,
    LLM_PROFILES_STORE_VERSION,
    MONITORADOS_STORE_VERSION,
    PROJETOS_STORE_VERSION,
    DATAVALUES_SECRET_FIELDS,
    getLlmProfilesStoreVersion,
    mergeEntriesWithSecrets,
    migrateDataValuesToCurrent,
    migrateFromOldestSupported,
    migrateLocalFeatureStore,
    parseDataValuesEntries,
    readDataValuesVersion,
    serializeVersionedDataValues,
    separateDataValuesSecrets,
    type MigrateDataValuesResult,
    type SecretsMap,
    type VersionedDataValues
} from './migrations/index.js';
