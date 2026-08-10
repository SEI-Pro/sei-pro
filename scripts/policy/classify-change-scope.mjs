/**
 * Classify changed paths for 002-ts-zero-legacy (FR-017).
 * @typedef {'docs-only' | 'tooling-only' | 'product-runtime'} ChangeScope
 */

const DOC_RE = /^(docs\/|specs\/|.*\.md$|LICENSE|NOTICE)/i;
const TOOLING_RE =
    /^(scripts\/|tests\/|\.github\/|\.cursor\/|\.agents\/|\.specify\/|package\.json|package-lock\.json|eslint\.config\..*|tsconfig.*|\.nvmrc|\.gitignore|\.prettier.*|vitest\.config\..*|Dockerfile|docker-compose\.|compose\.yaml)/;

/**
 * Product-runtime: extension code and manifest that affect loaded behavior.
 * @param {string} relPath
 */
export function isProductRuntimePath(relPath) {
    const p = relPath.replace(/\\/g, '/');
    if (p === 'manifest.base.json' || p.startsWith('assets/')) return true;
    if (!p.startsWith('src/')) return false;
    // Feature/tests under src are rare; treat all src as product runtime
    return true;
}

/**
 * @param {string} relPath
 */
export function isDocsOnlyPath(relPath) {
    const p = relPath.replace(/\\/g, '/');
    if (isProductRuntimePath(p)) return false;
    if (TOOLING_RE.test(p)) return false;
    return DOC_RE.test(p) || p.endsWith('.md');
}

/**
 * @param {string} relPath
 */
export function isToolingOnlyPath(relPath) {
    const p = relPath.replace(/\\/g, '/');
    if (isProductRuntimePath(p)) return false;
    return TOOLING_RE.test(p);
}

/**
 * @param {string[]} paths
 * @returns {{ scope: ChangeScope, productPaths: string[], toolingPaths: string[], docsPaths: string[] }}
 */
export function classifyChangeScope(paths) {
    const productPaths = [];
    const toolingPaths = [];
    const docsPaths = [];
    for (const raw of paths) {
        const p = String(raw).replace(/\\/g, '/');
        if (!p || p.endsWith('/')) continue;
        if (isProductRuntimePath(p)) productPaths.push(p);
        else if (isToolingOnlyPath(p)) toolingPaths.push(p);
        else docsPaths.push(p);
    }
    /** @type {ChangeScope} */
    let scope = 'docs-only';
    if (productPaths.length) scope = 'product-runtime';
    else if (toolingPaths.length) scope = 'tooling-only';
    return { scope, productPaths, toolingPaths, docsPaths };
}
