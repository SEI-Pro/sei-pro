/**
 * Thin wrapper over the config schema (ADR-0009 / Phase 2.4).
 *
 * Defaults live in `src/config/schema.ts`. This module keeps the historical
 * import path used by `core/config` and the options page.
 */
import { getDefaultEnabledConfigKeys, isConfigKey, CONFIG_SCHEMA } from '../config/schema.js';

export const DEFAULT_ENABLED_CONFIG_OPTIONS = getDefaultEnabledConfigKeys();

export function isDefaultEnabledConfigOption(name: unknown): boolean {
    const key = String(name || '');
    if (!isConfigKey(key)) return false;
    const entry = CONFIG_SCHEMA[key];
    return entry.type === 'boolean' && entry.default === true;
}
