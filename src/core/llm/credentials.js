import { PROVIDER_IDS } from './protocol.js';

export function createProfile({
    id,
    providerId,
    baseUrl,
    model,
    label,
    trusted = false
} = {}) {
    const profile = {
        id: typeof id === 'string' ? id.trim() : id,
        providerId,
        baseUrl: baseUrl ? String(baseUrl).replace(/\/+$/, '') : undefined,
        model: typeof model === 'string' ? model.trim() : model,
        label: label == null ? '' : String(label).trim(),
        trusted: Boolean(trusted)
    };
    const errors = getProfileValidationErrors(profile);
    if (errors.length) throw new TypeError(errors.join('; '));
    if (!profile.label) profile.label = profile.model;
    return profile;
}

export function maskKey(key) {
    if (!key) return '';
    const value = String(key);
    const suffix = value.slice(-4);
    const separator = value.indexOf('-');
    const prefix = separator > 0 ? `${value.slice(0, separator)}-` : '';
    return `${prefix}...${suffix}`;
}

export function validateProfile(profile) {
    return getProfileValidationErrors(profile).length === 0;
}

export function getProfileValidationErrors(profile) {
    const errors = [];
    if (!profile || typeof profile !== 'object') return ['Profile must be an object'];
    if (typeof profile.id !== 'string' || !profile.id.trim()) errors.push('Profile id is required');
    if (!PROVIDER_IDS.includes(profile.providerId)) errors.push('Profile provider is invalid');
    if (typeof profile.model !== 'string' || !profile.model.trim()) errors.push('Profile model is required');
    if (profile.baseUrl != null && !isHttpUrl(profile.baseUrl)) errors.push('Profile base URL is invalid');
    if (profile.trusted != null && typeof profile.trusted !== 'boolean') errors.push('Profile trusted must be boolean');
    return errors;
}

function isHttpUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}
