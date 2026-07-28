/**
 * Options page — pure domain.
 *
 * Parse/serialize chrome.storage.sync `dataValues`, pick configGeral / profiles,
 * defaults, and search normalization. No DOM, no chrome.*, no jQuery.
 */
import { isDefaultEnabledConfigOption } from '../shared/config-defaults.js';

export { isDefaultEnabledConfigOption };

/** Parse the JSON string stored in sync.dataValues. Always returns an array. */
export function parseDataValues(raw) {
    if (raw === null || typeof raw === 'undefined' || raw === '') return [];
    try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

/** Profiles are objects that carry a baseName (database connection entries). */
export function pickProfiles(dataValues) {
    if (!Array.isArray(dataValues)) return [];
    return dataValues.filter((entry) => entry && typeof entry.baseName !== 'undefined');
}

/** First configGeral array found in the dataValues payload. */
export function pickConfigGeral(dataValues) {
    if (!Array.isArray(dataValues)) return null;
    for (let i = 0; i < dataValues.length; i++) {
        const el = dataValues[i];
        if (el && Array.isArray(el.configGeral)) return el.configGeral;
    }
    return null;
}

/** Lookup a single configGeral entry by name. Returns undefined when absent. */
export function getConfigGeralEntry(configGeral, name) {
    if (!Array.isArray(configGeral)) return undefined;
    for (let i = 0; i < configGeral.length; i++) {
        if (configGeral[i] && configGeral[i].name === name) return configGeral[i];
    }
    return undefined;
}

/**
 * Resolve the UI checked state for a boolean option.
 * Absent + default-enabled → true; explicit false → false; explicit true → true.
 */
export function resolveSwitchChecked(configGeral, name) {
    const entry = getConfigGeralEntry(configGeral, name);
    if (!entry) return isDefaultEnabledConfigOption(name);
    return entry.value === true;
}

/** Resolve a non-boolean stored value (text/number/select). null when absent. */
export function resolveConfigFieldValue(configGeral, name) {
    const entry = getConfigGeralEntry(configGeral, name);
    if (!entry || entry.value === null || typeof entry.value === 'undefined') return null;
    return entry.value;
}

/**
 * Infer conexaoTipo for a restored profile when the select was not persisted.
 * Preserves the legacy heuristic from options.js.
 */
export function inferConexaoTipo(profile) {
    if (!profile || typeof profile !== 'object') return 'api';
    if (profile.spreadsheetId) return 'sheets';
    if (!profile.KEY_USER) return 'googleapi';
    return 'api';
}

/** Parse the legacy newdocsigilo pipe format: "id|…|label". */
export function parseNewDocSigilo(value) {
    if (typeof value !== 'string' || value === '' || value.indexOf('|') === -1) return null;
    const parts = value.split('|');
    if (parts.length < 3) return null;
    return { id: parts[0], label: parts[2] };
}

/** Build the sync payload: profiles + { configGeral }. */
export function buildDataValuesPayload(profiles, configGeral) {
    const list = Array.isArray(profiles) ? profiles.slice() : [];
    list.push({ configGeral: Array.isArray(configGeral) ? configGeral : [] });
    return list;
}

export function serializeDataValues(dataValues) {
    return JSON.stringify(Array.isArray(dataValues) ? dataValues : []);
}

/** Accent-insensitive lowercase trim for the options search box. */
export function normalizeOptionsSearchText(text) {
    return (text || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

export function rowMatchesSearch(rowText, query) {
    const q = normalizeOptionsSearchText(query);
    if (!q) return true;
    return normalizeOptionsSearchText(rowText).indexOf(q) !== -1;
}

/**
 * Classify a database profile draft collected from the options form.
 *
 * Database profiles are OPTIONAL for the extension as a whole — they only unlock
 * features that talk to an external base (Atividades, AI platforms, etc.).
 * General switches must still save when the default empty profile row is blank.
 *
 * Select defaults (baseTipo / conexaoTipo) do NOT count as "user started filling".
 * A row is blank when baseName and credential fields are empty.
 *
 * - blank: empty placeholder row → skip silently, never block save
 * - incomplete: user filled credentials/name partially → highlight, skip row, do not block general save
 * - complete: include in dataValues
 */
export function classifyProfileDraft(fields, options = {}) {
    const values = fields && typeof fields === 'object' ? fields : {};
    const requiredNames = options.requiredNames || ['baseName', 'baseTipo', 'conexaoTipo'];
    const credentialNames = options.credentialNames || [
        'URL_API', 'KEY_USER', 'CLIENT_ID', 'API_KEY', 'spreadsheetId'
    ];

    const missingRequired = requiredNames.filter((name) => {
        const v = values[name];
        return v === null || typeof v === 'undefined' || String(v).trim() === '';
    });

    const baseName = values.baseName == null ? '' : String(values.baseName).trim();
    const hasCredentials = credentialNames.some((name) => {
        const v = values[name];
        return v !== null && typeof v !== 'undefined' && String(v).trim() !== '';
    });

    // Select defaults alone do not mean the user configured a database.
    if (!baseName && !hasCredentials) {
        return { status: 'blank', missingRequired };
    }
    if (missingRequired.length > 0) {
        return { status: 'incomplete', missingRequired };
    }
    return { status: 'complete', missingRequired: [] };
}

/**
 * Decide dependent-row visibility from the current switch map.
 * Keys mirror the legacy changeConfigGeral / restore_options rules.
 */
export function computeDependentVisibility(switches) {
    const on = (name) => switches[name] === true;
    return {
        newdocDefault_table: on('newdocdefault'),
        uploadDoc_sortBefore: on('uploaddocsexternos'),
        getDocCertidao_docName: on('certidaosigilo'),
        // When newdocnivel is on, the sigilo select is hidden (legacy inverted rule).
        newDoc_sigilo: !on('newdocnivel'),
        clearNewDocSigilo: on('newdocnivel'),
        uncheckSortBeforeUpload: !on('uploaddocsexternos')
    };
}
