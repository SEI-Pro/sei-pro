/**
 * Manifest helper for ADR-0004 (fase 3).
 *
 * Phase 3 scope (pragmatic):
 * - Discover feature descriptors under src/features/<id>/feature.ts
 * - Validate coherence against the committed manifest.base.json
 * - Do NOT fully regenerate the 11 content_scripts blocks from descriptors yet
 *   (high risk of silent match breakage). Full derivation is a follow-up after
 *   snapshots in tests/structure/manifest-contexts.test.js stay green and
 *   blocks are enxugados one context at a time (plan 3.6-3.7).
 *
 * Today "generate" is an identity emit of manifest.base.json after validation
 * (plus optional JSON pretty-print with --write when you want to normalize).
 *
 * Usage:
 *   node scripts/generate-manifest.mjs           # validate + print to stdout
 *   node scripts/generate-manifest.mjs --check   # exit 1 if invalid or != committed
 *   node scripts/generate-manifest.mjs --write   # rewrite manifest.base.json (identity/normalize)
 *
 * npm: npm run manifest:check
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    REPO_ROOT,
    scanFeatureDescriptors,
    descriptorContractOk,
    KNOWN_CONTEXT_IDS
} from './lib/scan-feature-descriptors.mjs';

const root = REPO_ROOT;
const manifestPath = path.join(root, 'manifest.base.json');
const check = process.argv.includes('--check');
const write = process.argv.includes('--write');

/** Slim single-script blocks already migrated — must stay exactly one js entry. */
const SLIM_BLOCKS = [
    { script: 'js/login.bundle.js', featureId: 'login' },
    { script: 'js/db.bundle.js', featureId: 'external-config' },
    { script: 'js/arvore-info.bundle.js', featureId: 'arvore-info' },
    { script: 'js/quick-highlight.bundle.js', featureId: 'quick-highlight' }
];

function readCommitted() {
    return fs.readFileSync(manifestPath, 'utf8');
}

function validate(manifest, descriptors) {
    const errors = [];

    for (const d of descriptors) {
        if (d.missing) {
            errors.push(`missing descriptor: src/features/${d.dir}/feature.ts`);
            continue;
        }
        if (!descriptorContractOk(d)) {
            errors.push(
                `invalid descriptor ${d.file}: id=${d.id} (dir=${d.dir}) contexts=${JSON.stringify(d.contexts)} install=${d.hasInstall} api=${d.hasApi}`
            );
        }
        for (const ctx of d.contexts) {
            if (!KNOWN_CONTEXT_IDS.includes(ctx)) {
                errors.push(`${d.file}: unknown context "${ctx}"`);
            }
        }
    }

    const byId = new Map(descriptors.filter((d) => d.id).map((d) => [d.id, d]));
    const blocks = manifest.content_scripts || [];

    for (const slim of SLIM_BLOCKS) {
        if (!byId.has(slim.featureId)) {
            errors.push(`slim block feature missing descriptor: ${slim.featureId}`);
        }
        const matching = blocks.filter((b) => (b.js || []).includes(slim.script));
        if (matching.length === 0) {
            errors.push(`slim script not in manifest: ${slim.script}`);
            continue;
        }
        for (const block of matching) {
            if (!Array.isArray(block.js) || block.js.length !== 1 || block.js[0] !== slim.script) {
                errors.push(
                    `slim block for ${slim.script} must be exactly ["${slim.script}"], got ${JSON.stringify(block.js)}`
                );
            }
        }
    }

    return errors;
}

/**
 * Generate manifest artifact. Currently identity of committed file after
 * descriptor validation — see file header.
 */
export function generateManifest({ rootDir = root } = {}) {
    const committedText = fs.readFileSync(path.join(rootDir, 'manifest.base.json'), 'utf8');
    const manifest = JSON.parse(committedText);
    const descriptors = scanFeatureDescriptors(rootDir);
    const errors = validate(manifest, descriptors);
    if (errors.length) {
        const err = new Error('manifest/descriptor validation failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
        err.errors = errors;
        throw err;
    }
    // Identity: full content_scripts regeneration is intentionally deferred.
    return { manifest, text: committedText, descriptors };
}

function main() {
    let result;
    try {
        result = generateManifest();
    } catch (e) {
        console.error(e.message || e);
        process.exit(1);
    }

    if (check) {
        const committed = readCommitted();
        if (result.text !== committed) {
            console.error(
                'manifest.base.json differs from generator output. ' +
                    'With the current identity generator this should not happen; ' +
                    're-run without --check or investigate file races.'
            );
            process.exit(1);
        }
        console.log(
            `manifest:check ok — ${result.descriptors.length} descriptors, ` +
                `${(result.manifest.content_scripts || []).length} content_script blocks (passthrough).`
        );
        return;
    }

    if (write) {
        // Normalize only if caller asks; default remains stdout dry-run.
        const normalized = JSON.stringify(result.manifest, null, 2) + '\n';
        fs.writeFileSync(manifestPath, normalized);
        console.error(`Wrote ${path.relative(root, manifestPath)} (JSON normalized; content_scripts unchanged).`);
        return;
    }

    process.stdout.write(result.text);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
    main();
}
