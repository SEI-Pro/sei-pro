/**
 * Phase 5 build — bundle the ESM core+sei stack (src/) into a single readable
 * IIFE content script and sync the manifest into dist/.
 *
 * Design constraints (learned from the reverted first attempt):
 *  - Output is ONLY the generated bundle (dist/js/core-stack.bundle.js) and a
 *    verbatim copy of manifest.base.json. Legacy scripts, vendor libs, CSS and
 *    the service worker are NEVER touched by the bundler — they stay verbatim
 *    in dist/, so the readable source is never overwritten in place.
 *  - No minification: the bundle must stay readable.
 *
 * manifest.base.json is the single source of truth for the manifest and already
 * references the bundle (js/core-stack.bundle.js); dist/manifest.json is a copy.
 */
import { build } from 'esbuild';
import { copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const watch = process.argv.includes('--watch');

const options = {
    entryPoints: [path.join(root, 'src/content/core-stack.js')],
    bundle: true,
    format: 'iife',
    minify: false,
    outfile: path.join(root, 'dist/js/core-stack.bundle.js'),
    logLevel: 'info'
};

function syncManifest() {
    copyFileSync(
        path.join(root, 'manifest.base.json'),
        path.join(root, 'dist/manifest.json')
    );
}

if (watch) {
    const ctx = await (await import('esbuild')).context(options);
    await ctx.watch();
    syncManifest();
    console.log('build: watching src/ — dist/js/core-stack.bundle.js');
} else {
    await build(options);
    syncManifest();
    console.log('build: dist/js/core-stack.bundle.js + dist/manifest.json generated');
}
