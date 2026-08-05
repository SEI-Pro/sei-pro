/**
 * Options page — IO boundary.
 *
 * chrome.storage.sync for dataValues, FileReader/Blob import-export, and
 * runtime messaging. No DOM. Callers pass already-serialized payloads.
 */
function getRuntimeApi() {
    if (typeof browser !== 'undefined' && browser.runtime) return browser;
    if (typeof chrome !== 'undefined' && chrome.runtime) return chrome;
    return null;
}

function usesPromiseApi(api) {
    return typeof browser !== 'undefined' && api === browser;
}

function getStorageArea() {
    const api = getRuntimeApi();
    if (!api || !api.storage || !api.storage.sync) return null;
    return api.storage.sync;
}

function getLocalStorageArea() {
    const api = getRuntimeApi();
    if (!api || !api.storage || !api.storage.local) return null;
    return api.storage.local;
}

function sendRuntimeMessage(message) {
    return new Promise((resolve, reject) => {
        const api = getRuntimeApi();
        if (!api || !api.runtime || typeof api.runtime.sendMessage !== 'function') {
            reject(new Error('chrome.runtime unavailable'));
            return;
        }
        let settled = false;
        const finish = (response) => {
            if (settled) return;
            settled = true;
            const error = readLastError();
            if (error) reject(new Error(error.message || String(error)));
            else resolve(response);
        };
        const fail = (error) => {
            if (settled) return;
            settled = true;
            reject(error);
        };
        try {
            if (usesPromiseApi(api)) {
                Promise.resolve(api.runtime.sendMessage(message)).then(finish, fail);
                return;
            }
            const result = api.runtime.sendMessage(message, finish);
            if (result && typeof result.then === 'function') result.then(finish, fail);
        } catch (error) {
            fail(error);
        }
    });
}

function readLastError() {
    try {
        if (typeof chrome !== 'undefined' && chrome.runtime) return chrome.runtime.lastError || null;
    } catch (e) { /* ignore */ }
    return null;
}

export async function loadLlmProfiles() {
    const response = await sendRuntimeMessage({ action: 'llmProfilesList' });
    if (!response || response.ok !== true) {
        throw new Error((response && response.error) || 'Não foi possível carregar os perfis de IA.');
    }
    return Array.isArray(response.profiles) ? response.profiles : [];
}

export async function saveLlmProfile(profile, options = {}) {
    if (options.requestPermission !== false) {
        await requestProfileHostPermission(profile && profile.baseUrl);
    }
    const response = await sendRuntimeMessage({ action: 'llmSaveProfile', profile });
    if (!response || response.ok !== true) {
        throw new Error((response && response.error) || 'Não foi possível salvar o perfil de IA.');
    }
    return response.profile;
}

export async function deleteLlmProfile(profileId) {
    const response = await sendRuntimeMessage({
        action: 'llmDeleteProfile',
        profileId: String(profileId || '')
    });
    if (!response || response.ok !== true) {
        throw new Error((response && response.error) || 'Não foi possível remover o perfil de IA.');
    }
}

export function loadLlmAccessAudit() {
    return new Promise((resolve) => {
        const storage = getLocalStorageArea();
        if (!storage) {
            resolve([]);
            return;
        }
        try {
            storage.get({ llmAccessAudit: [] }, (items) => {
                const error = readLastError();
                if (error) {
                    console.warn('options io: could not read AI access audit', error);
                    resolve([]);
                    return;
                }
                resolve(Array.isArray(items?.llmAccessAudit) ? items.llmAccessAudit : []);
            });
        } catch (error) {
            console.warn('options io: AI access audit read failed', error);
            resolve([]);
        }
    });
}

export function clearLlmAccessAudit() {
    return new Promise((resolve, reject) => {
        const storage = getLocalStorageArea();
        if (!storage) {
            resolve();
            return;
        }
        try {
            storage.remove('llmAccessAudit', () => {
                const error = readLastError();
                if (error) reject(new Error(error.message || String(error)));
                else resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function loadLlmAiSettings() {
    return new Promise((resolve) => {
        const storage = getLocalStorageArea();
        const defaults = {
            activeProfileId: '',
            maxIterations: 8,
            maxDocs: 15,
            maxContextTokens: 24000,
            keyword: '+gpt',
            inlineEnabled: false,
            systemInstruction: ''
        };
        if (!storage) {
            resolve(defaults);
            return;
        }
        storage.get({ llmAiSettings: defaults }, (items) => {
            resolve({ ...defaults, ...(items?.llmAiSettings || {}) });
        });
    });
}

export function saveLlmAiSettings(settings) {
    return new Promise((resolve, reject) => {
        const storage = getLocalStorageArea();
        if (!storage) {
            reject(new Error('chrome.storage.local indisponível'));
            return;
        }
        storage.set({ llmAiSettings: settings }, () => {
            const error = readLastError();
            if (error) reject(new Error(error.message || String(error)));
            else resolve(settings);
        });
    });
}

export function requestProfileHostPermission(baseUrl) {
    return requestProfileHostPermissions(baseUrl ? [baseUrl] : []);
}

export function requestProfileHostPermissions(baseUrls) {
    const origins = [];
    try {
        (Array.isArray(baseUrls) ? baseUrls : []).forEach((baseUrl) => {
            if (!baseUrl) return;
            const parsed = new URL(baseUrl);
            const origin = `${parsed.protocol}//${parsed.host}/*`;
            if (!origins.includes(origin)) origins.push(origin);
        });
    } catch (_) {
        return Promise.reject(new Error('A URL base do provedor de IA é inválida.'));
    }
    if (origins.length === 0) return Promise.resolve(true);

    const api = getRuntimeApi();
    const permissions = api && api.permissions;
    if (!permissions || typeof permissions.request !== 'function') return Promise.resolve(true);

    return new Promise((resolve, reject) => {
        let settled = false;
        const finish = (granted) => {
            if (settled) return;
            settled = true;
            const error = readLastError();
            if (error) reject(new Error(error.message || String(error)));
            else if (!granted) reject(new Error('A permissão para acessar o provedor não foi concedida.'));
            else resolve(true);
        };
        const fail = (error) => {
            if (settled) return;
            settled = true;
            reject(error);
        };
        try {
            if (usesPromiseApi(api)) {
                Promise.resolve(permissions.request({ origins })).then(finish, fail);
                return;
            }
            const result = permissions.request({ origins }, finish);
            if (result && typeof result.then === 'function') result.then(finish, fail);
        } catch (error) {
            fail(error);
        }
    });
}

/** Read dataValues string from sync storage. Resolves to '' on missing/error. */
export function loadDataValues() {
    return new Promise((resolve) => {
        const storage = getStorageArea();
        if (!storage) {
            resolve('');
            return;
        }
        try {
            storage.get({ dataValues: '' }, (items) => {
                const err = readLastError();
                if (err) {
                    console.warn('options io: storage.get failed', err);
                    resolve('');
                    return;
                }
                resolve(items && typeof items.dataValues === 'string' ? items.dataValues : '');
            });
        } catch (e) {
            console.warn('options io: storage.get threw', e);
            resolve('');
        }
    });
}

/** Persist dataValues string. Rejects when chrome.runtime.lastError is set. */
export function saveDataValues(serialized) {
    return new Promise((resolve, reject) => {
        const storage = getStorageArea();
        if (!storage) {
            reject(new Error('chrome.storage.sync unavailable'));
            return;
        }
        try {
            storage.set({ dataValues: String(serialized || '') }, () => {
                const err = readLastError();
                if (err) {
                    reject(new Error(err.message || String(err)));
                    return;
                }
                resolve();
            });
        } catch (e) {
            reject(e);
        }
    });
}

export function clearDataValues() {
    return saveDataValues('');
}

/** Notify the background to sync process-notification config. */
export function syncProcessNotificationOption(enabled) {
    const runtimeApi = getRuntimeApi();
    if (!runtimeApi || !runtimeApi.runtime || typeof runtimeApi.runtime.sendMessage !== 'function') {
        return;
    }
    try {
        runtimeApi.runtime.sendMessage({
            action: 'syncNotificacaoProcessosConfig',
            enabled: enabled === true
        });
    } catch (error) {
        console.warn('options io: could not sync process notifications', error);
    }
}

export function getExtensionManifest() {
    const runtimeApi = getRuntimeApi();
    if (!runtimeApi || !runtimeApi.runtime || typeof runtimeApi.runtime.getManifest !== 'function') {
        return null;
    }
    try {
        return runtimeApi.runtime.getManifest();
    } catch (e) {
        return null;
    }
}

/** Read a local JSON file as text (import config). */
export function readTextFile(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('no file'));
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target && e.target.result ? String(e.target.result) : '');
        reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
        reader.readAsText(file);
    });
}

/** Trigger a browser download of a JSON string. */
export function downloadJsonFile(filename, jsonText) {
    const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8,%EF%BB%BF' });
    if (typeof navigator !== 'undefined' && navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
        return;
    }
    const link = document.createElement('a');
    if (typeof link.download === 'undefined') return;
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
