/**
 * Feature maturity index for policy gates (002-ts-zero-legacy).
 */
import path from 'node:path';
import { scanFeatureDescriptors, REPO_ROOT } from '../lib/scan-feature-descriptors.mjs';

/**
 * @param {string} [root]
 * @returns {Map<string, { id: string, maturity: string, contexts: string[], rootDir: string, sourceGlobs: string[], descriptorFile: string }>}
 */
export function buildFeatureMaturityIndex(root = REPO_ROOT) {
    /** @type {Map<string, { id: string, maturity: string, rootDir: string, sourceGlobs: string[], descriptorFile: string }>} */
    const map = new Map();
    for (const d of scanFeatureDescriptors(root)) {
        if (d.missing || !d.id || !d.maturity) continue;
        const rootDir = path.posix.join('src/features', d.dir);
        map.set(d.id, {
            id: d.id,
            maturity: d.maturity,
            contexts: d.contexts,
            rootDir,
            sourceGlobs: [`${rootDir}/**`],
            descriptorFile: d.file
        });
    }
    return map;
}

/**
 * @param {string} relPath
 * @param {Map<string, { id: string, maturity: string, rootDir: string }>} index
 * @returns {string|null} feature id
 */
export function featureIdForPath(relPath, index) {
    const p = relPath.replace(/\\/g, '/');
    if (!p.startsWith('src/features/')) return null;
    const rest = p.slice('src/features/'.length);
    const dir = rest.split('/')[0];
    if (!dir) return null;
    const entry = index.get(dir);
    return entry ? entry.id : dir;
}
