/**
 * Secrets migration coordination (Phase S.4 / 2.5).
 *
 * Credential fields must leave chrome.storage.sync. The canonical field list and
 * profile helpers live in options/domain; this module re-exports them for the
 * versioned migration pipeline so config migrations and options IO stay aligned.
 */
export {
    DATAVALUES_SECRET_FIELDS,
    extractProfileSecrets,
    mergeProfileSecrets,
    profilesContainSecrets,
    separateDataValuesSecrets,
    stripProfileSecrets,
    profileSecretKey
} from '../../options/domain.js';
