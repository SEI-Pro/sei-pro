/**
 * Shared modern infrastructure allowlist for 002-ts-zero-legacy (FR-003 exception).
 * @see specs/002-ts-zero-legacy/contracts/shared-modern-infra.md
 */

/** @type {readonly string[]} */
export const SHARED_MODERN_INFRA_ROOTS = Object.freeze([
    'src/core',
    'src/sei',
    'src/platform',
    'src/shared',
    'src/config',
    'src/app',
    'src/types'
]);

/**
 * Composition / product roots that are runtime but not feature bodies.
 * Fecho code must not treat these as legacy; entries may load non-exclusive siblings.
 * @type {readonly string[]}
 */
export const COMPOSITION_ROOTS = Object.freeze([
    'src/entries',
    'src/background',
    'src/options'
]);

/** Path prefixes treated as legacy loaders (non-exclusive surface). */
export const LEGACY_LOADER_PREFIXES = Object.freeze([
    'src/bootstrap',
    'src/content/core-stack'
]);

/**
 * @param {string} relPath repo-relative posix path
 * @returns {boolean}
 */
export function isSharedModernInfra(relPath) {
    const p = relPath.replace(/\\/g, '/');
    return SHARED_MODERN_INFRA_ROOTS.some((r) => p === r || p.startsWith(`${r}/`));
}

/**
 * @param {string} relPath
 * @returns {boolean}
 */
export function isLegacyLoaderPath(relPath) {
    const p = relPath.replace(/\\/g, '/');
    return LEGACY_LOADER_PREFIXES.some((r) => p === r || p.startsWith(`${r}/`));
}

/**
 * Any repository source under src/ must be either an exclusive feature or an
 * explicitly allowlisted modern root to be consumable by a touched closure.
 * Composition roots are intentionally excluded: they may load untouched
 * legacy siblings, but they must never be imported by feature/infra code.
 * @param {string} relPath
 * @param {Map<string, { maturity: string }>} index
 */
export function isNonExclusiveSourcePath(relPath, index) {
    const p = relPath.replace(/\\/g, '/');
    if (!p.startsWith('src/')) return false;
    if (isSharedModernInfra(p)) return false;
    if (isCompositionRootPath(p)) return true;
    if (p.startsWith('src/features/')) {
        const dir = p.slice('src/features/'.length).split('/')[0];
        const maturity = index.get(dir)?.maturity;
        return maturity !== 'exclusive';
    }
    return true;
}

/**
 * @param {string} relPath
 * @returns {boolean}
 */
export function isCompositionRootPath(relPath) {
    const p = relPath.replace(/\\/g, '/');
    return COMPOSITION_ROOTS.some((r) => p === r || p.startsWith(`${r}/`));
}
