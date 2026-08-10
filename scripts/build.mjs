/**
 * Build — assembles dist/ entirely from versioned sources (src/, vendor/, assets/).
 *
 * Official (non-watch) build wipes the output tree first so it contains only
 * files produced by that run (spec 001-build-generated-dist / FR-004a).
 * Watch mode updates incrementally and is not gate-quality output.
 *
 * Override output root for isolated tests: SEI_PRO_DIST_DIR=/tmp/some-dist
 *
 * Declared outputs: scripts/dist-pipeline.mjs + scripts/asset-manifest.mjs.
 */
import { build } from 'esbuild';
import {
    copyFileSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    rmSync,
    statSync,
    writeFileSync
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_FILE_PAIRS, ASSET_DIRS } from './asset-manifest.mjs';
import {
    EXTRA_FILES,
    FEATURE_CSS,
    HTML_FILES,
    LEGACY_FILES,
    listBundles
} from './dist-pipeline.mjs';
import { GENERATED_CONTEXTS, generateContextRegistry, registryPath } from './generate-context-registry.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const watch = process.argv.includes('--watch');
const distDir = process.env.SEI_PRO_DIST_DIR
    ? path.resolve(process.env.SEI_PRO_DIST_DIR)
    : path.join(root, 'dist');
const bundles = listBundles(root);

/** Map declared `dist/...` path to the actual output root (default dist/). */
function outPath(declaredOut) {
    const rel = declaredOut.replace(/^dist\/?/, '');
    return path.join(distDir, rel);
}

function verifyGeneratedRegistries() {
    for (const context of GENERATED_CONTEXTS) {
        const generated = generateContextRegistry(context, root);
        const current = readFileSync(registryPath(context, root), 'utf8');
        if (current !== generated.text) {
            throw new Error(`${context} registry is stale; run: npm run registry:write`);
        }
    }
}

function wipeDist() {
    rmSync(distDir, { recursive: true, force: true });
}

function optionsFor({ entry, out }) {
    const outfile = outPath(out);
    const plugins =
        entry === 'src/entries/editor.ts'
            ? [
                {
                    name: 'trim-editor-bundle-line-endings',
                    setup(buildApi) {
                        buildApi.onEnd((result) => {
                            if (result.errors.length) return;
                            const source = readFileSync(outfile, 'utf8');
                            writeFileSync(outfile, source.replace(/[ \t]+$/gm, ''), 'utf8');
                        });
                    }
                }
            ]
            : [];

    mkdirSync(path.dirname(outfile), { recursive: true });

    return {
        entryPoints: [path.join(root, entry)],
        bundle: true,
        format: 'iife',
        minify: false,
        absWorkingDir: root,
        outfile,
        plugins,
        logLevel: watch ? 'info' : 'warning'
    };
}

function copyLegacy() {
    mkdirSync(path.join(distDir, 'js'), { recursive: true });
    for (const rel of LEGACY_FILES) {
        copyFileSync(path.join(root, rel), path.join(distDir, 'js', path.basename(rel)));
    }
}

function copyFeatureCss() {
    mkdirSync(path.join(distDir, 'css'), { recursive: true });
    for (const { src, out } of FEATURE_CSS) {
        copyFileSync(path.join(root, src), outPath(out));
    }
}

function copyHtml() {
    mkdirSync(path.join(distDir, 'html'), { recursive: true });
    for (const { src, out } of HTML_FILES) {
        copyFileSync(path.join(root, src), outPath(out));
    }
}

function syncManifest() {
    copyFileSync(path.join(root, 'manifest.base.json'), outPath('dist/manifest.json'));
}

function copyTree(srcDir, outDir) {
    mkdirSync(outDir, { recursive: true });
    for (const name of readdirSync(srcDir)) {
        const from = path.join(srcDir, name);
        const to = path.join(outDir, name);
        if (statSync(from).isDirectory()) copyTree(from, to);
        else copyFileSync(from, to);
    }
}

function copyAssets() {
    for (const { src, out } of [...ALL_FILE_PAIRS, ...EXTRA_FILES]) {
        const dest = outPath(out);
        mkdirSync(path.dirname(dest), { recursive: true });
        copyFileSync(path.join(root, src), dest);
    }
    for (const { src, out } of ASSET_DIRS) {
        copyTree(path.join(root, src), outPath(out));
    }
}

function copyStaticParts() {
    copyLegacy();
    copyFeatureCss();
    copyHtml();
    copyAssets();
    syncManifest();
}

const outNames = bundles.map((b) => path.basename(b.out)).join(' + ');
verifyGeneratedRegistries();

if (watch) {
    const esbuild = await import('esbuild');
    for (const b of bundles) {
        const ctx = await esbuild.context(optionsFor(b));
        await ctx.watch();
    }
    copyStaticParts();
    console.log(
        'build: watching src/ (not gate-quality; official build wipes output) — '
            + outNames
            + ' (+ '
            + LEGACY_FILES.length
            + ' legacy copies)'
    );
} else {
    wipeDist();
    await Promise.all(bundles.map((b) => build(optionsFor(b))));
    copyStaticParts();
    console.log(
        'build: '
            + outNames
            + ' + '
            + LEGACY_FILES.length
            + ' legacy + vendor + manifest -> '
            + path.relative(root, distDir)
            + ' (clean tree)'
    );
}
