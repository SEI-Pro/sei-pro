/**
 * Assert exclusive-closure policy (P0–P6) — 002-ts-zero-legacy.
 */
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from '../lib/scan-feature-descriptors.mjs';
import { classifyChangeScope } from './classify-change-scope.mjs';
import { buildDependencyClosure } from './dependency-closure.mjs';
import { buildFeatureMaturityIndex, featureIdForPath } from './feature-maturity-index.mjs';
import {
    isLegacyLoaderPath,
    isSharedModernInfra,
    isNonExclusiveSourcePath
} from './shared-modern-infra.mjs';
import {
    GENERATED_CONTEXTS,
    generateContextRegistry,
    registryPath
} from '../generate-context-registry.mjs';

const BANNED_GLOBAL_RE = /\bgetSeiPro\s*\(|\baliasGlobal\s*\(/;
const TYPING_DEBT_RE = new RegExp(`(?:\\:\\s*${'any'}\\b|\\bas\\s+${'any'}\\b)`);

/**
 * @param {string} rel
 * @param {string} root
 */
function readFile(rel, root) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) return null;
    return fs.readFileSync(abs, 'utf8');
}

function stripComments(text) {
    return text
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|\s)\/\/.*$/gm, '$1');
}

function stripCommentsAndStrings(text) {
    return stripComments(text).replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, '');
}

function hasDirective(text, name) {
    return new RegExp(`(?:^|\\n)\\s*(?:\\/\\/|\\/\\*+)\\s*${name}\\b`).test(text);
}

function toolingFailures(toolingPaths, root) {
    const failures = [];
    if (!toolingPaths.length) return failures;
    const index = buildFeatureMaturityIndex(root);
    const toolingClosure = buildDependencyClosure(toolingPaths, index, root);
    for (const p of toolingPaths) {
        const text = readFile(p, root);
        if (text == null) continue;
        const code = stripCommentsAndStrings(text);
        if (hasDirective(text, '@ts-nocheck')) {
            failures.push({ code: 'T1', message: `tooling file has @ts-nocheck: ${p}` });
        }
        if (hasDirective(text, '@ts-ignore') || TYPING_DEBT_RE.test(code)) {
            failures.push({ code: 'T1', message: `tooling file introduces an untyped escape: ${p}` });
        }
    }
    for (const edge of toolingClosure.edges) {
        if (isLegacyLoaderPath(edge.to) || isNonExclusiveSourcePath(edge.to, index)) {
            failures.push({
                code: 'T2',
                message: `tooling imports non-exclusive product surface: ${edge.from} → ${edge.to}`
            });
        }
    }
    return failures;
}

/**
 * @param {object} opts
 * @param {string[]} opts.paths
 * @param {string} [opts.root]
 * @param {boolean} [opts.skipRegistry] skip P6 when registries not relevant in unit fixtures
 */
export function assertExclusiveClosure(opts) {
    const root = opts.root || REPO_ROOT;
    const paths = opts.paths || [];
    /** @type {{ code: string, message: string }[]} */
    const failures = [];

    const { scope, productPaths, toolingPaths } = classifyChangeScope(paths);

    // P0
    if (scope === 'docs-only') {
        return { ok: true, scope, failures: [], skipped: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'], productPaths: [] };
    }

    if (scope === 'tooling-only') {
        // FR-017: tooling does not force feature maturity, but it still cannot
        // introduce fresh typing debt or import a non-exclusive product path.
        failures.push(...toolingFailures(toolingPaths, root));
        return {
            ok: failures.length === 0,
            scope,
            failures,
            skipped: ['P3', 'P6'],
            productPaths: [],
            note: 'tooling-only: exclusive maturity not required'
        };
    }

    // FR-017 still applies to tests/tooling when they accompany a product
    // change; runtime scope must not hide a tooling regression.
    failures.push(...toolingFailures(toolingPaths, root));

    const index = buildFeatureMaturityIndex(root);
    const fecho = buildDependencyClosure(productPaths, index, root);

    // P1 — every touched product source is TypeScript. Historical JS may remain
    // untouched, but a material touch is a migration boundary under FR-001/013.
    for (const p of productPaths) {
        if (p.startsWith('src/') && p.endsWith('.js') && !p.endsWith('.d.ts')) {
            failures.push({
                code: 'P1',
                message: `product-runtime touched file is .js (must be TypeScript): ${p}`
            });
        }
    }

    // P2 — @ts-nocheck / any / @ts-ignore on touched product .ts
    for (const p of productPaths) {
        if (!p.endsWith('.ts')) continue;
        const text = readFile(p, root);
        if (text == null) continue;
        const code = stripCommentsAndStrings(text);
        if (hasDirective(text, '@ts-nocheck')) {
            failures.push({ code: 'P2', message: `touched file has @ts-nocheck: ${p}` });
        }
        if (hasDirective(text, '@ts-ignore')) {
            failures.push({ code: 'P2', message: `touched file has @ts-ignore: ${p}` });
        }
        // Keep the marker scan conservative to avoid comment-only false positives.
        if (TYPING_DEBT_RE.test(code)) {
            failures.push({ code: 'P2', message: `touched file introduces an untyped escape: ${p}` });
        }
    }

    // P3 — all features in fecho exclusive
    for (const fid of fecho.featureIds) {
        const meta = index.get(fid);
        const maturity = meta?.maturity || 'missing';
        if (maturity !== 'exclusive') {
            failures.push({
                code: 'P3',
                message: `fecho feature "${fid}" maturity is "${maturity}" (required exclusive)`
            });
        }
    }

    // P4 — no edges to non-exclusive features / legacy loaders; banned globals in fecho files
    for (const e of fecho.edges) {
        if (e.kind === 'legacy-loader' || isLegacyLoaderPath(e.to)) {
            failures.push({
                code: 'P4',
                message: `fecho imports legacy loader: ${e.from} → ${e.to}`
            });
        }
        const toFid = featureIdForPath(e.to, index);
        const fromFid = featureIdForPath(e.from, index);
        if (toFid && toFid !== fromFid) {
            const m = index.get(toFid)?.maturity;
            if (m && m !== 'exclusive') {
                failures.push({
                    code: 'P4',
                    message: `fecho imports non-exclusive feature "${toFid}" (${m}): ${e.from} → ${e.to}`
                });
            }
        }
        if (!toFid && isNonExclusiveSourcePath(e.to, index) && !isLegacyLoaderPath(e.to)) {
            failures.push({
                code: 'P4',
                message: `fecho imports non-exclusive product surface: ${e.from} → ${e.to}`
            });
        }
    }

    for (const rel of fecho.filesVisited) {
        if (!rel.startsWith('src/features/') && !productPaths.includes(rel)) continue;
        const text = readFile(rel, root);
        if (!text) continue;
        if (BANNED_GLOBAL_RE.test(stripCommentsAndStrings(text))) {
            // composition roots may still reference during transition — only fail inside feature fecho files
            if (rel.startsWith('src/features/')) {
                const fid = featureIdForPath(rel, index);
                if (fid && fecho.featureIds.includes(fid)) {
                    failures.push({
                        code: 'P4',
                        message: `fecho file uses banned legacy global API: ${rel}`
                    });
                }
            }
        }
    }

    // P5 — infra used by fecho must not import non-exclusive features
    for (const e of fecho.edges) {
        if (!isSharedModernInfra(e.from)) continue;
        const toFid = featureIdForPath(e.to, index);
        if (toFid) {
            const m = index.get(toFid)?.maturity;
            if (m && m !== 'exclusive') {
                failures.push({
                    code: 'P5',
                    message: `shared infra imports non-exclusive feature "${toFid}": ${e.from} → ${e.to}`
                });
            }
        }
        if (isLegacyLoaderPath(e.to)) {
            failures.push({
                code: 'P5',
                message: `shared infra imports legacy loader: ${e.from} → ${e.to}`
            });
        }
    }

    // P6 — exclusive features in the closure must be represented by fresh,
    // generated context registries. This is intentionally diff-scoped.
    if (!opts.skipRegistry) {
        for (const fid of fecho.featureIds) {
            const meta = index.get(fid);
            if (!meta) {
                failures.push({ code: 'P6', message: `fecho feature "${fid}" missing descriptor in index` });
                continue;
            }
            for (const context of meta.contexts || []) {
                if (!GENERATED_CONTEXTS.includes(context)) continue;
                const generated = generateContextRegistry(context, root).text;
                const currentPath = registryPath(context, root);
                const current = fs.existsSync(currentPath) ? fs.readFileSync(currentPath, 'utf8') : null;
                if (current !== generated) {
                    failures.push({
                        code: 'P6',
                        message: `exclusive registry is stale or missing for ${fid} (${context})`
                    });
                }
            }
        }
    }

    return {
        ok: failures.length === 0,
        scope,
        failures,
        fecho,
        productPaths
    };
}
