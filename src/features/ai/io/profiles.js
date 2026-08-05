import { getSeiPro, globalRef } from '../../../core/global.js';
import { PROVIDER_IDS } from '../../../core/llm/protocol.js';

const DEFAULTS = Object.freeze({
    openai: { baseUrl: 'https://api.openai.com', model: 'gpt-4.1-mini' },
    anthropic: { baseUrl: 'https://api.anthropic.com', model: 'claude-sonnet-4-20250514' },
    gemini: { baseUrl: 'https://generativelanguage.googleapis.com', model: 'gemini-2.5-flash' },
    moonshot: { baseUrl: 'https://api.moonshot.ai', model: 'kimi-k3' },
    ollama: { baseUrl: 'http://localhost:11434', model: 'llama3.2' },
    openai_compatible: { baseUrl: '', model: '' }
});
const LEGACY_MIGRATION_KEY = 'llmProfilesLegacyMigrationVersion';
const LEGACY_MIGRATION_VERSION = 1;

export function providerDefaults(providerId) {
    return { ...(DEFAULTS[providerId] || DEFAULTS.openai) };
}

export async function listProfiles() {
    await migrateLegacyProfilesOnce();
    const response = await sendMessage({ action: 'llmProfilesList' });
    if (!response || response.ok !== true) {
        throw new Error((response && response.error) || 'Não foi possível carregar os perfis de IA');
    }
    return Array.isArray(response.profiles) ? response.profiles : [];
}

export function legacyProfileToLlmProfile(profile = {}, index = 0) {
    const providerId = String(profile.baseTipo || profile.providerId || '').toLowerCase();
    if (!PROVIDER_IDS.includes(providerId)) return null;
    const defaults = providerDefaults(providerId);
    return normalizeProfile({
        id: `llm-legacy-${providerId}-${index}`,
        providerId,
        label: profile.baseName || profile.label || `Legacy ${providerId} profile`,
        baseUrl: profile.URL_API || profile.baseUrl || defaults.baseUrl,
        model: profile.model || profile.MODEL || profile.MODEL_ID || defaults.model,
        key: profile.KEY_USER || profile.API_KEY || profile.key || '',
        trusted: profile.trusted === true || providerId === 'ollama'
    });
}

export async function saveProfile(profile = {}) {
    const normalized = normalizeProfile(profile);
    await requestProfileHostPermission(normalized.baseUrl);
    const response = await sendMessage({ action: 'llmSaveProfile', profile: normalized });
    if (!response || response.ok !== true) {
        throw new Error((response && response.error) || 'Não foi possível salvar o perfil de IA');
    }
    return response.profile;
}

export async function deleteProfile(profileId) {
    const response = await sendMessage({ action: 'llmDeleteProfile', profileId: String(profileId || '') });
    if (!response || response.ok !== true) {
        throw new Error((response && response.error) || 'Não foi possível remover o perfil de IA');
    }
    return true;
}

export async function getActiveProfile() {
    const [profiles, settings] = await Promise.all([listProfiles(), getAiSettings()]);
    return profiles.find(function (profile) {
        return profile.id === settings.activeProfileId;
    }) || profiles[0] || null;
}

export async function getAiSettings() {
    const storage = getSeiPro().core.storage;
    const result = await storage.getLocal('llmAiSettings');
    return {
        activeProfileId: '',
        maxIterations: 8,
        maxDocs: 15,
        maxContextTokens: 24000,
        keyword: '+gpt',
        inlineEnabled: false,
        systemInstruction: '',
        ...(result && result.llmAiSettings)
    };
}

export async function saveAiSettings(patch = {}) {
    const storage = getSeiPro().core.storage;
    const current = await getAiSettings();
    const next = { ...current, ...patch };
    await storage.setLocal({ llmAiSettings: next });
    return next;
}

export function normalizeProfile(profile = {}) {
    const providerId = String(profile.providerId || '');
    if (!PROVIDER_IDS.includes(providerId)) throw new Error('Provedor de IA não compatível');
    const defaults = providerDefaults(providerId);
    const id = String(profile.id || `llm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    const baseUrl = String(profile.baseUrl ?? defaults.baseUrl).trim().replace(/\/+$/, '');
    const model = String(profile.model ?? defaults.model).trim();
    if (!model) throw new Error('Informe um modelo de IA');
    if (providerId === 'openai_compatible' && !baseUrl) {
        throw new Error('Informe a URL base do perfil compatível com OpenAI');
    }
    return {
        id,
        providerId,
        baseUrl,
        key: String(profile.key || ''),
        model,
        trusted: profile.trusted === true,
        label: String(profile.label || '').trim() || providerId
    };
}

function isPageInjectedRuntime() {
    try {
        const runtime = globalRef.chrome && globalRef.chrome.runtime;
        return !!runtime && runtime.id === 'seipro-page-inject';
    } catch (_) {
        return false;
    }
}

async function migrateLegacyProfilesOnce() {
    // In the page-injected editor the MAIN→isolated bridge never proxies the
    // legacy sync blob (dataValues may hold legacy keys), so migration is
    // deferred to isolated contexts — the options page and sei-functions on
    // process pages both run it on their first listProfiles call.
    if (isPageInjectedRuntime()) return;
    const storage = getSeiPro().core.storage;
    const migration = await storage.getLocal({ [LEGACY_MIGRATION_KEY]: 0 });
    if (Number(migration && migration[LEGACY_MIGRATION_KEY]) >= LEGACY_MIGRATION_VERSION) return;

    const [currentResponse, syncItems] = await Promise.all([
        sendMessage({ action: 'llmProfilesList' }),
        storage.getSync({ dataValues: '' })
    ]);
    if (!currentResponse || currentResponse.ok !== true) {
        throw new Error((currentResponse && currentResponse.error) || 'Could not inspect AI profiles');
    }

    const legacyProfiles = parseLegacyDataValues(syncItems && syncItems.dataValues);
    const cachedOpenAi = readLegacyLocalProfile('configBasePro_openai');
    if (cachedOpenAi) {
        legacyProfiles.push({
            baseTipo: 'openai',
            baseName: cachedOpenAi.baseName || 'Legacy OpenAI profile',
            ...cachedOpenAi
        });
    }

    const existing = Array.isArray(currentResponse.profiles) ? currentResponse.profiles : [];
    const knownEndpoints = new Set(existing.map(profileEndpointKey));
    for (let index = 0; index < legacyProfiles.length; index++) {
        let migrated;
        try {
            migrated = legacyProfileToLlmProfile(legacyProfiles[index], index);
        } catch (_) {
            continue;
        }
        if (!migrated) continue;
        const endpointKey = profileEndpointKey(migrated);
        if (knownEndpoints.has(endpointKey)) continue;
        const response = await sendMessage({ action: 'llmSaveProfile', profile: migrated });
        if (!response || response.ok !== true) {
            throw new Error((response && response.error) || 'Could not migrate an AI profile');
        }
        knownEndpoints.add(endpointKey);
    }

    await storage.setLocal({ [LEGACY_MIGRATION_KEY]: LEGACY_MIGRATION_VERSION });
}

function parseLegacyDataValues(raw) {
    if (!raw) return [];
    try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(function (entry) {
            return entry && PROVIDER_IDS.includes(String(entry.baseTipo || '').toLowerCase());
        });
    } catch (_) {
        return [];
    }
}

function readLegacyLocalProfile(key) {
    try {
        const raw = globalRef.localStorage && globalRef.localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (_) {
        return null;
    }
}

function profileEndpointKey(profile) {
    return [
        String(profile && profile.providerId || ''),
        String(profile && profile.baseUrl || '').replace(/\/+$/, '')
    ].join('|');
}

async function requestProfileHostPermission(baseUrl) {
    if (!baseUrl) return true;
    let origin;
    try {
        const parsed = new URL(baseUrl);
        origin = `${parsed.protocol}//${parsed.host}/*`;
    } catch (_) {
        throw new Error('A URL base do provedor de IA é inválida');
    }
    const permissions = globalRef.chrome && globalRef.chrome.permissions;
    if (!permissions || typeof permissions.request !== 'function') return true;
    return new Promise(function (resolve, reject) {
        try {
            const result = permissions.request({ origins: [origin] }, function (granted) {
                const runtimeError = globalRef.chrome.runtime && globalRef.chrome.runtime.lastError;
                if (runtimeError) reject(new Error(runtimeError.message));
                else if (!granted) reject(new Error('A permissão de acesso ao provedor não foi concedida'));
                else resolve(true);
            });
            if (result && typeof result.then === 'function') {
                result.then(function (granted) {
                    if (!granted) throw new Error('A permissão de acesso ao provedor não foi concedida');
                    resolve(true);
                }, reject);
            }
        } catch (error) {
            reject(error);
        }
    });
}

function sendMessage(message) {
    return getSeiPro().core.messaging.sendMessage(message);
}
