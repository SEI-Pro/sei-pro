/**
 * Typed config read (ADR-0009 / Phase 2.3).
 *
 * Unknown keys throw in development and return a safe default in production.
 * Does not replace legacy `verifyConfigValue` / `checkConfigValue` /
 * `getConfigValue` — new code should prefer `getConfig`.
 */
import {
    CONFIG_SCHEMA,
    type ConfigKey,
    type ConfigSchemaEntry,
    getSchemaEntry,
    isConfigKey
} from './schema.js';

export type GetConfigOptions = {
    /** Override stored configGeral entries (tests / injected deps). */
    configGeral?: Array<{ name?: string; value?: unknown }> | null;
    /** Override localStorage reader. */
    readConfigBasePro?: () => unknown;
    /** Force DEV/prod behavior (tests). */
    isDev?: boolean;
};

function detectDev(): boolean {
    try {
        // Vitest / Node unit tests
        const proc = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process;
        if (proc?.env?.NODE_ENV === 'test') {
            return true;
        }
    } catch {
        /* intentional: process may be unavailable in extension pages */
    }
    try {
        const chromeApi = (globalThis as { chrome?: { runtime?: { getManifest?: () => object } } }).chrome;
        const manifest = chromeApi?.runtime?.getManifest?.();
        // Unpacked extensions lack update_url.
        if (manifest && !Object.prototype.hasOwnProperty.call(manifest, 'update_url')) {
            return true;
        }
    } catch {
        /* intentional: chrome.runtime may be unavailable outside extension */
    }
    return false;
}

function pickConfigGeral(configBasePro: unknown): Array<{ name?: string; value?: unknown }> | null {
    if (!Array.isArray(configBasePro)) return null;
    for (let i = 0; i < configBasePro.length; i++) {
        const el = configBasePro[i] as { configGeral?: unknown } | null;
        if (el && Array.isArray(el.configGeral)) {
            return el.configGeral as Array<{ name?: string; value?: unknown }>;
        }
    }
    return null;
}

function defaultReadConfigBasePro(): unknown {
    try {
        const ls = (globalThis as { localStorage?: Storage }).localStorage;
        if (!ls || typeof ls.getItem !== 'function') return [];
        const raw = ls.getItem('configBasePro');
        if (raw === null || raw === undefined || raw === '') return [];
        return JSON.parse(raw);
    } catch {
        // intentional: corrupt configBasePro → empty config
        return [];
    }
}

function safeDefaultForUnknown(): false {
    return false;
}

function coerceToSchemaDefault(entry: ConfigSchemaEntry, raw: unknown): boolean | string | number {
    if (raw === null || typeof raw === 'undefined') {
        return entry.default;
    }
    if (entry.type === 'boolean') {
        return raw === true;
    }
    if (entry.type === 'number') {
        const n = typeof raw === 'number' ? raw : Number(raw);
        return Number.isFinite(n) ? n : (entry.default as number);
    }
    return typeof raw === 'string' ? raw : String(raw);
}

/**
 * Read a config key declared in `CONFIG_SCHEMA`.
 *
 * - Missing schema key → throw when `isDev`, else `false`.
 * - Missing stored value → schema `default`.
 * - Keys with `storage: 'local'` are not read from configGeral; callers should
 *   pass the local value via `configGeral`-style override or use dedicated IO.
 *   When no override is provided, the schema default is returned.
 */
export function getConfig(key: string, options: GetConfigOptions = {}): boolean | string | number {
    const isDev = typeof options.isDev === 'boolean' ? options.isDev : detectDev();

    if (!isConfigKey(key)) {
        if (isDev) {
            throw new Error(`getConfig: unknown config key "${key}" (not in CONFIG_SCHEMA)`);
        }
        return safeDefaultForUnknown();
    }

    const entry = CONFIG_SCHEMA[key as ConfigKey] as ConfigSchemaEntry;
    if (entry.storage === 'local') {
        // Local-only keys (e.g. bugReportOptIn) are owned by storage.local IO.
        // Without an injected snapshot, return the schema default.
        if (Array.isArray(options.configGeral)) {
            for (let i = 0; i < options.configGeral.length; i++) {
                const item = options.configGeral[i];
                if (item && item.name === key) {
                    return coerceToSchemaDefault(entry, item.value);
                }
            }
        }
        return entry.default;
    }

    const configGeral =
        options.configGeral !== undefined
            ? options.configGeral
            : pickConfigGeral((options.readConfigBasePro || defaultReadConfigBasePro)());

    if (Array.isArray(configGeral)) {
        for (let i = 0; i < configGeral.length; i++) {
            const item = configGeral[i];
            if (item && item.name === key) {
                if (item.value === null || typeof item.value === 'undefined') {
                    return entry.default;
                }
                return coerceToSchemaDefault(entry, item.value);
            }
        }
    }

    return entry.default;
}

/** Convenience: boolean view of getConfig (false for non-boolean schema types). */
export function getConfigFlag(key: string, options?: GetConfigOptions): boolean {
    const value = getConfig(key, options);
    return value === true;
}

export function assertConfigKey(key: string): ConfigKey {
    if (!isConfigKey(key)) {
        throw new Error(`Unknown config key: ${key}`);
    }
    return key;
}

export { getSchemaEntry, isConfigKey, CONFIG_SCHEMA };
