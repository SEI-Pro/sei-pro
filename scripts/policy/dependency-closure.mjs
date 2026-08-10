/**
 * Build dependency fecho (feature set + import edges) from touched product paths.
 */
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from '../lib/scan-feature-descriptors.mjs';
import { featureIdForPath } from './feature-maturity-index.mjs';
import {
    isLegacyLoaderPath,
    isSharedModernInfra,
    isCompositionRootPath
} from './shared-modern-infra.mjs';

const IMPORT_RE =
    /(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

/**
 * @param {string} fromFile abs
 * @param {string} spec
 * @param {string} root
 */
function resolveSpec(fromFile, spec, root) {
    let target;
    if (spec.startsWith('@src/')) {
        target = path.join(root, 'src', spec.slice('@src/'.length));
    } else if (spec.startsWith('.')) {
        target = path.resolve(path.dirname(fromFile), spec);
    } else {
        return null;
    }
    const rel = path.relative(root, target).split(path.sep).join('/');
    const candidates = [
        rel,
        rel.replace(/\.js$/, '.ts'),
        `${rel}.ts`,
        `${rel}.js`,
        `${rel}/index.ts`,
        `${rel}/index.js`
    ];
    for (const c of candidates) {
        const abs = path.join(root, c);
        if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
            return c.replace(/\\/g, '/');
        }
    }
    // Prefer .ts form for graph even if unresolved extension
    return rel.replace(/\.js$/, '.ts').replace(/\\/g, '/');
}

/**
 * @param {string} abs
 * @returns {string[]}
 */
function collectImports(abs, root) {
    if (!fs.existsSync(abs)) return [];
    const text = fs.readFileSync(abs, 'utf8');
    const out = [];
    for (const m of text.matchAll(IMPORT_RE)) {
        const spec = m[1] || m[2];
        if (!spec) continue;
        if (spec.startsWith('node:')) continue;
        if (!spec.startsWith('.') && !spec.startsWith('@src/')) continue;
        const resolved = resolveSpec(abs, spec, root);
        if (resolved) out.push(resolved);
    }
    return out;
}

function collectSourceFiles(dir, root, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) collectSourceFiles(abs, root, out);
        else if (/\.(ts|js)$/.test(entry.name)) {
            out.push(path.relative(root, abs).split(path.sep).join('/'));
        }
    }
    return out;
}

function sourceGraph(root) {
    /** @type {Map<string, string[]>} */
    const outgoing = new Map();
    /** @type {Map<string, string[]>} */
    const incoming = new Map();
    const files = collectSourceFiles(path.join(root, 'src'), root);

    for (const rel of files) {
        const imports = collectImports(path.join(root, rel), root);
        outgoing.set(rel, imports);
        for (const target of imports) {
            const parents = incoming.get(target) || [];
            parents.push(rel);
            incoming.set(target, parents);
        }
    }
    return { outgoing, incoming };
}

/**
 * @param {string[]} productPaths
 * @param {Map<string, { id: string, maturity: string, rootDir: string }>} index
 * @param {string} [root]
 */
export function buildDependencyClosure(productPaths, index, root = REPO_ROOT) {
    /** @type {Set<string>} */
    const featureIds = new Set();
    /** @type {Array<{ from: string, to: string, kind: string }>} */
    const edges = [];
    /** @type {Set<string>} */
    const visited = new Set();
    /** @type {string[]} */
    const normalizedProductPaths = productPaths.map((p) => p.replace(/\\/g, '/'));
    const queue = [...normalizedProductPaths];
    const graph = sourceGraph(root);
    const reverseSeeds = normalizedProductPaths.filter((p) => isSharedModernInfra(p));

    for (const p of normalizedProductPaths) {
        const fid = featureIdForPath(p, index);
        if (fid) featureIds.add(fid);
    }

    // A shared-infrastructure change affects the exclusive feature consumers
    // that depend on it. Walk reverse edges, but stop at composition roots so
    // touching a feature does not explode into every sibling loaded by an entry.
    const reverseQueue = [...reverseSeeds];
    const reverseVisited = new Set();
    while (reverseQueue.length) {
        const target = reverseQueue.pop();
        if (!target || reverseVisited.has(target)) continue;
        reverseVisited.add(target);
        for (const parent of graph.incoming.get(target) || []) {
            if (isCompositionRootPath(parent)) continue;
            if (!visited.has(parent)) queue.push(parent);
            if (isSharedModernInfra(parent)) reverseQueue.push(parent);
        }
    }

    while (queue.length) {
        const rel = queue.pop();
        if (!rel || visited.has(rel)) continue;
        visited.add(rel);

        const fid = featureIdForPath(rel, index);
        if (fid) featureIds.add(fid);

        const abs = path.join(root, rel);
        if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) continue;
        if (!/\.(ts|js|mjs)$/.test(rel)) continue;

        for (const to of graph.outgoing.get(rel) || collectImports(abs, root)) {
            let kind = 'other';
            if (featureIdForPath(to, index)) kind = 'feature';
            else if (isSharedModernInfra(to)) kind = 'infra';
            else if (isLegacyLoaderPath(to)) kind = 'legacy-loader';
            edges.push({ from: rel, to, kind });

            const toFid = featureIdForPath(to, index);
            if (toFid) featureIds.add(toFid);

            // Product closures follow feature/infra edges. Tooling closures also
            // follow local scripts/tests so T2 sees transitive legacy imports.
            const toolingEdge =
                (rel.startsWith('scripts/') || rel.startsWith('tests/')) &&
                (to.startsWith('scripts/') || to.startsWith('tests/') || to.startsWith('src/'));
            if ((kind === 'feature' || kind === 'infra' || toolingEdge) && !visited.has(to)) {
                queue.push(to);
            }
        }
    }

    return {
        touchedPaths: normalizedProductPaths,
        featureIds: [...featureIds].sort(),
        filesVisited: [...visited].sort(),
        edges
    };
}
