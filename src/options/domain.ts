// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Options page — pure domain.
 *
 * Parse/serialize chrome.storage.sync `dataValues`, pick configGeral / profiles,
 * defaults, and search normalization. No DOM, no chrome.*, no jQuery.
 */
import { isDefaultEnabledConfigOption } from '../shared/config-defaults.js';

export { isDefaultEnabledConfigOption };

export const AI_PROVIDER_OPTIONS = Object.freeze([
    { id: 'openai', label: 'OpenAI', baseUrl: 'https://api.openai.com', model: 'gpt-4.1-mini' },
    { id: 'anthropic', label: 'Anthropic (Claude)', baseUrl: 'https://api.anthropic.com', model: 'claude-sonnet-4-20250514' },
    { id: 'gemini', label: 'Google Gemini', baseUrl: 'https://generativelanguage.googleapis.com', model: 'gemini-2.5-flash' },
    { id: 'moonshot', label: 'Moonshot (Kimi)', baseUrl: 'https://api.moonshot.ai', model: 'kimi-k3' },
    { id: 'ollama', label: 'Ollama', baseUrl: 'http://localhost:11434', model: 'llama3.2' },
    { id: 'openai_compatible', label: 'OpenAI-compatible', baseUrl: '', model: '' }
]);

export function getAiProviderDefaults(providerId) {
    const provider = AI_PROVIDER_OPTIONS.find((item) => item.id === providerId);
    return provider
        ? { baseUrl: provider.baseUrl, model: provider.model }
        : { baseUrl: '', model: '' };
}

export function isAiProviderId(providerId) {
    return AI_PROVIDER_OPTIONS.some((item) => item.id === providerId);
}

export function normalizeAiProfileDraft(fields, idFactory) {
    const input = fields && typeof fields === 'object' ? fields : {};
    const provider = AI_PROVIDER_OPTIONS.find((item) => item.id === input.providerId);
    if (!provider) throw new Error('Selecione um provedor de IA válido.');

    const defaults = getAiProviderDefaults(provider.id);
    const baseUrl = String(input.baseUrl == null ? defaults.baseUrl : input.baseUrl)
        .trim()
        .replace(/\/+$/, '');
    const model = String(input.model == null ? defaults.model : input.model).trim();
    if (!model) throw new Error('Informe o modelo de IA.');
    if (provider.id === 'openai_compatible' && !baseUrl) {
        throw new Error('Informe a URL base do provedor compatível com OpenAI.');
    }
    if (baseUrl) {
        let parsed;
        try {
            parsed = new URL(baseUrl);
        } catch (_) {
            throw new Error('Informe uma URL base válida.');
        }
        const local = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
        if (parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:')) {
            throw new Error('Use HTTPS, exceto para Ollama em localhost.');
        }
    }

    const makeId = typeof idFactory === 'function'
        ? idFactory
        : () => `llm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return {
        id: String(input.id || makeId()),
        providerId: provider.id,
        baseUrl,
        key: String(input.key || ''),
        model,
        trusted: input.trusted === true,
        label: String(input.label || '').trim() || provider.label
    };
}

/** Parse the JSON string stored in sync.dataValues. Always returns an array. */
export function parseDataValues(raw) {
    if (raw === null || typeof raw === 'undefined' || raw === '') return [];
    try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (Array.isArray(parsed)) return parsed;
        // ADR-0009 versioned blob: { version, entries }
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.entries)) {
            return parsed.entries;
        }
        return [];
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
/** Credential fields that must never persist in chrome.storage.sync (ADR-0015). */
export const DATAVALUES_SECRET_FIELDS = Object.freeze([
    'API_KEY',
    'KEY_USER',
    'CLIENT_ID',
    'spreadsheetId'
]);

/** Stable key for a database profile's local secret bag. */
export function profileSecretKey(profile) {
    if (!profile || typeof profile !== 'object') return '';
    return [
        String(profile.baseTipo || ''),
        String(profile.baseName || ''),
        String(profile.conexaoTipo || '')
    ].join('|');
}

export function profilesContainSecrets(profiles) {
    if (!Array.isArray(profiles)) return false;
    return profiles.some((profile) => {
        if (!profile || typeof profile !== 'object') return false;
        return DATAVALUES_SECRET_FIELDS.some((field) => {
            const value = profile[field];
            return value !== null && typeof value !== 'undefined' && String(value).trim() !== '';
        });
    });
}

/** Extract secret fields keyed by profileSecretKey. */
export function extractProfileSecrets(profiles) {
    const secrets = {};
    if (!Array.isArray(profiles)) return secrets;
    profiles.forEach((profile) => {
        if (!profile || typeof profile !== 'object') return;
        const key = profileSecretKey(profile);
        if (!key || key === '||') return;
        const bag = {};
        let hasSecret = false;
        DATAVALUES_SECRET_FIELDS.forEach((field) => {
            const value = profile[field];
            if (value !== null && typeof value !== 'undefined' && String(value).trim() !== '') {
                bag[field] = value;
                hasSecret = true;
            }
        });
        if (hasSecret) secrets[key] = bag;
    });
    return secrets;
}

/** Return profiles without credential fields (safe for storage.sync). */
export function stripProfileSecrets(profiles) {
    if (!Array.isArray(profiles)) return [];
    return profiles.map((profile) => {
        if (!profile || typeof profile !== 'object') return profile;
        const safe = { ...profile };
        DATAVALUES_SECRET_FIELDS.forEach((field) => {
            delete safe[field];
        });
        return safe;
    });
}

/** Merge local secret bags back onto profiles for UI / runtime. */
export function mergeProfileSecrets(profiles, secretsMap) {
    const secrets = secretsMap && typeof secretsMap === 'object' ? secretsMap : {};
    if (!Array.isArray(profiles)) return [];
    return profiles.map((profile) => {
        if (!profile || typeof profile !== 'object') return profile;
        const bag = secrets[profileSecretKey(profile)];
        if (!bag || typeof bag !== 'object') return profile;
        return { ...profile, ...bag };
    });
}

/**
 * Split a dataValues array into sync-safe payload + local secrets map.
 * Config entries (configGeral) are left in sync unchanged.
 */
export function separateDataValuesSecrets(dataValues) {
    const list = Array.isArray(dataValues) ? dataValues : [];
    const profiles = [];
    const rest = [];
    list.forEach((entry) => {
        if (entry && typeof entry.baseName !== 'undefined') profiles.push(entry);
        else rest.push(entry);
    });
    const secrets = extractProfileSecrets(profiles);
    const strippedProfiles = stripProfileSecrets(profiles);
    return {
        dataValues: strippedProfiles.concat(rest),
        secrets
    };
}

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
