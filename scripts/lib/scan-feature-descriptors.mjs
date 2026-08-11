/**
 * Node-side discovery of src/features/<id>/feature.ts (ADR-0004).
 * Used by generate-manifest, measure-ratchets, and structure tests.
 * Does not execute descriptors — parses source text only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FEATURE_CONTEXT_IDS } from '../../src/types/architecture-contexts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, '../..');

/** Context ids accepted in descriptors (src/sei/pages.ts + composition roots). */
export const KNOWN_CONTEXT_IDS = FEATURE_CONTEXT_IDS;

export function listFeatureDirs(root = REPO_ROOT) {
    const featuresRoot = path.join(root, 'src/features');
    return fs
        .readdirSync(featuresRoot, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort();
}

/**
 * @param {string} source
 * @returns {{ id: string|null, maturity: string|null, contexts: string[], configKey: string|null|undefined, undocumented: boolean, hasInstall: boolean, hasApi: boolean }}
 */
export function parseFeatureDescriptorSource(source) {
    const idMatch = source.match(/\bid\s*:\s*['"]([a-z0-9-]+)['"]/);
    const maturityMatch = source.match(/\bmaturity\s*:\s*['"](declared|wired|exclusive)['"]/);
    const contextsBlock = source.match(/\bcontexts\s*:\s*\[([\s\S]*?)\]/);
    const contexts = contextsBlock
        ? [...contextsBlock[1].matchAll(/['"]([a-z0-9-]+)['"]/g)].map((m) => m[1])
        : [];
    let configKey;
    const configKeyMatch = source.match(/\bconfigKey\s*:\s*(null|['"][^'"]*['"])/);
    if (!configKeyMatch) {
        configKey = undefined;
    } else if (configKeyMatch[1] === 'null') {
        configKey = null;
    } else {
        configKey = configKeyMatch[1].slice(1, -1);
    }
    const undocumentedMatch = source.match(/\bundocumented\s*:\s*(true|false)/);
    const undocumented = undocumentedMatch ? undocumentedMatch[1] === 'true' : false;
    return {
        id: idMatch ? idMatch[1] : null,
        maturity: maturityMatch ? maturityMatch[1] : null,
        contexts,
        configKey,
        undocumented,
        hasInstall: /\binstall\s*:/.test(source) || /\binstall\s*\(/.test(source),
        hasApi: /\bapi\s*:/.test(source)
    };
}

/**
 * @param {string} [root]
 * @returns {Array<{ dir: string, file: string, id: string|null, contexts: string[], configKey: string|null|undefined, undocumented: boolean, hasInstall: boolean, hasApi: boolean, missing: boolean }>}
 */
export function scanFeatureDescriptors(root = REPO_ROOT) {
    return listFeatureDirs(root).map((dir) => {
        const file = path.join(root, 'src/features', dir, 'feature.ts');
        if (!fs.existsSync(file)) {
            return {
                dir,
                file: path.relative(root, file).split(path.sep).join('/'),
                id: null,
                maturity: null,
                contexts: [],
                configKey: undefined,
                undocumented: false,
                hasInstall: false,
                hasApi: false,
                missing: true
            };
        }
        const source = fs.readFileSync(file, 'utf8');
        const parsed = parseFeatureDescriptorSource(source);
        return {
            dir,
            file: path.relative(root, file).split(path.sep).join('/'),
            ...parsed,
            missing: false
        };
    });
}

export function descriptorContractOk(entry) {
    return (
        !entry.missing &&
        entry.id === entry.dir &&
        ['declared', 'wired', 'exclusive'].includes(entry.maturity) &&
        entry.hasInstall &&
        entry.hasApi &&
        Array.isArray(entry.contexts) &&
        entry.contexts.length > 0 &&
        entry.contexts.every((c) => KNOWN_CONTEXT_IDS.includes(c)) &&
        (entry.configKey === null || entry.configKey === undefined || typeof entry.configKey === 'string')
    );
}
