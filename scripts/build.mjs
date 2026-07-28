/**
 * Build — assembles dist/ entirely from src/ (dist/js holds only generated output).
 *
 * src/ now has TWO kinds of source:
 *
 *  1. BUNDLED ESM entries (src/content, src/entries, some src/features index.js)
 *     → esbuild produces a readable IIFE bundle in dist/js/. No minification.
 *
 *  2. LEGACY global scripts (the big pre-refactor modules) live under
 *     src/features/<feature>/, src/shared/legacy/, src/bootstrap/ and
 *     src/background/. They are NOT bundled — they share ~1300 globals and depend
 *     on manifest load order, so esbuild would break them. The build copies each
 *     VERBATIM to its original dist/js/<name>.js path. Output is byte-identical to
 *     the previous tree, so the manifest needs no change. Per-feature decomposition
 *     happens later, one feature at a time — relocating a file here does not change
 *     its behavior.
 *
 * Design constraint (learned from the reverted Vite attempt): the bundler never
 * touches the legacy/readable sources in place. Legacy files are only ever copied.
 */
import { build } from 'esbuild';
import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const watch = process.argv.includes('--watch');

// One bundle per content-script entry (IIFE, readable, isolated-world).
//
// Refundação isolated-first: cada contexto de página tem UMA entry em
// src/entries/ que compõe core + plataforma + as features daquele contexto.
// Toda entry em src/entries/*.js vira dist/js/<nome>.bundle.js automaticamente.
//
// Transitórios (removidos quando todos os contextos migrarem para entries):
//  - core-stack: stack core+sei carregada pelos blocos ainda não migrados.
//  - arvore-info: feature da árvore (será dobrada na entry `tree`).
import { readdirSync } from 'node:fs';

const entriesDir = path.join(root, 'src/entries');
const entryBundles = readdirSync(entriesDir)
    .filter((f) => f.endsWith('.js'))
    .map((f) => ({
        entry: 'src/entries/' + f,
        out: 'dist/js/' + f.replace(/\.js$/, '.bundle.js')
    }));

const bundles = [
    { entry: 'src/content/core-stack.js', out: 'dist/js/core-stack.bundle.js' },
    { entry: 'src/features/arvore-info/index.js', out: 'dist/js/arvore-info.bundle.js' },
    { entry: 'src/features/arvore/index.js', out: 'dist/js/sei-pro-arvore.js' },
    { entry: 'src/features/lista-processos/index.js', out: 'dist/js/sei-pro.js' },
    { entry: 'src/features/sei-functions/index.js', out: 'dist/js/sei-functions-pro.js' },
    { entry: 'src/features/quick-highlight/index.js', out: 'dist/js/quick-highlight.bundle.js' },
    { entry: 'src/features/docs-lote/index.js', out: 'dist/js/docs-lote.bundle.js' },
    { entry: 'src/features/quick-filter/index-list.js', out: 'dist/js/quick-filter-list.bundle.js' },
    { entry: 'src/features/quick-filter/index-tree.js', out: 'dist/js/quick-filter-tree.bundle.js' },
    { entry: 'src/features/anotacao-controle/index.js', out: 'dist/js/anotacao-controle.bundle.js' },
    { entry: 'src/features/monitorados/index.js', out: 'dist/js/monitorados.bundle.js' },
    // Controlar Prazos: decomposta em domain/io/view; saída mantém o nome do script
    // legado (js/sei-pro-controle-prazo.js) p/ o manifest não mudar.
    { entry: 'src/features/controlar-prazos/index.js', out: 'dist/js/sei-pro-controle-prazo.js' },
    // Marcar como "Não Visualizado": decomposta em io/view; saída nova (manifest
    // blocos 3 e 4, após sei-pro.js). Globais preservados via aliasGlobal.
    { entry: 'src/features/editor/index.js', out: 'dist/js/editor-domain.bundle.js' },
    { entry: 'src/features/nao-lido/index.js', out: 'dist/js/sei-pro-nao-lido.js' },
    { entry: 'src/features/lista-agrupamento/index.js', out: 'dist/js/lista-agrupamento.bundle.js' },
    // Options page (extension settings UI) — full vanilla bundle.
    { entry: 'src/options/index.js', out: 'dist/js/options.bundle.js' },
    // Página de opções — fatia de "Processos Monitorados" (dependência entre os
    // switches gerenciarmonitorados ↔ monitoradosacimacontrole). Carregado por
    // html/options.html ao lado do options.bundle.js.
    { entry: 'src/features/monitorados/options.js', out: 'dist/js/monitorados-options.bundle.js' },
    ...entryBundles
];

function optionsFor({ entry, out }) {
    return {
        entryPoints: [path.join(root, entry)],
        bundle: true,
        format: 'iife',
        minify: false,
        outfile: path.join(root, out),
        logLevel: 'info'
    };
}

// Legacy global scripts copied verbatim to dist/js/<basename>. Source of truth
// lives under src/; dist/js holds only generated output. Adding a file here is a
// pure relocation — behavior is unchanged until the feature is decomposed later.
const legacyFiles = [
    // lista-processos migrada para bundle ESM (sei-pro.js) — não copiar mais o legado.
    // sei-functions-pro migrada para bundle ESM — não copiar mais o legado.
    'src/features/atividades/sei-pro-atividades.js',
    'src/features/editor/sei-pro-editor.js',
    'src/features/ai/sei-pro-ai.js',
    'src/features/todas-paginas/sei-pro-all.js',
    'src/features/projetos/sei-pro-projetos.js',
    'src/features/prescricoes/sei-pro-prescricoes.js',
    'src/features/visualizacao/sei-pro-visualizacao.js',
    'src/features/visualizacao/sei-pro-visualizacao-chosen.js',
    'src/features/legis/sei-legis.js',
    // docs-lote migrada para bundle ESM (docs-lote.bundle.js) — não copiar mais o legado.
    // sei-functions-pro migrada para bundle ESM (sei-functions-pro.js) — não copiar mais o legado.
    'src/shared/legacy/sei-pro-icons.js',
    'src/shared/legacy/sei-pro-db-transition.js',
    'src/bootstrap/init.js',
    'src/bootstrap/init_all.js',
    'src/bootstrap/init_arvore.js',
    'src/bootstrap/init_db.js',
    'src/bootstrap/init_visualizacao.js',
    'src/bootstrap/init_visualizacao_html.js',
    'src/bootstrap/init-flags.js',
    'src/bootstrap/getscript-isolated.js',
    'src/platform/inline-stubs-main.js',
    'src/background/storage-handler.js',
    'src/background/fetch-handler.js',
    'src/background/bug-report-handler.js',
    'src/background/process-notification-handler.js',
    'src/background/install-handler.js',
    'src/background/router.js',
    'src/background/background.js' // service worker (manifest: js/background.js)
];

function copyLegacy() {
    mkdirSync(path.join(root, 'dist/js'), { recursive: true });
    for (const rel of legacyFiles) {
        copyFileSync(path.join(root, rel), path.join(root, 'dist/js', path.basename(rel)));
    }
}

// Feature-owned CSS: a feature ships its own stylesheet next to its code in
// src/features/<feature>/, copied to dist/css/<name>.css. The manifest loads it
// only in the blocks where the feature runs (best practice: CSS follows JS).
const featureCss = [
    { src: 'src/features/anotacao-controle/style.css', out: 'dist/css/anotacao-controle.css' },
    { src: 'src/features/monitorados/monitorados.css', out: 'dist/css/monitorados.css' },
    { src: 'src/shared/ui/prazo-preview.css', out: 'dist/css/prazo-preview.css' },
    { src: 'src/features/controlar-prazos/style.css', out: 'dist/css/controlar-prazos.css' },
    { src: 'src/features/quick-filter/style.css', out: 'dist/css/quick-filter.css' },
    { src: 'src/features/arvore/style.css', out: 'dist/css/arvore.css' },
    { src: 'src/features/lista-processos/style.css', out: 'dist/css/lista-processos.css' },
    { src: 'src/features/sei-functions/style.css', out: 'dist/css/sei-functions.css' }
];

function copyFeatureCss() {
    mkdirSync(path.join(root, 'dist/css'), { recursive: true });
    for (const { src, out } of featureCss) {
        copyFileSync(path.join(root, src), path.join(root, out));
    }
}

// Options page shell + CSS. Logic ships as dist/js/options.bundle.js (ESM→IIFE).
// monitorados-options.bundle.js remains a feature plug loaded after the main bundle.
const htmlFiles = [
    { src: 'src/options/options.html', out: 'dist/html/options.html' },
    { src: 'src/options/page.css', out: 'dist/html/page.css' }
];

function copyHtml() {
    mkdirSync(path.join(root, 'dist/html'), { recursive: true });
    for (const { src, out } of htmlFiles) {
        copyFileSync(path.join(root, src), path.join(root, out));
    }
}

function syncManifest() {
    copyFileSync(
        path.join(root, 'manifest.base.json'),
        path.join(root, 'dist/manifest.json')
    );
}

const outNames = bundles.map((b) => path.basename(b.out)).join(' + ');

if (watch) {
    const esbuild = await import('esbuild');
    for (const b of bundles) {
        const ctx = await esbuild.context(optionsFor(b));
        await ctx.watch();
    }
    copyLegacy();
    copyFeatureCss();
    copyHtml();
    syncManifest();
    console.log('build: watching src/ — ' + outNames + ' (+ ' + legacyFiles.length + ' legacy copies)');
} else {
    await Promise.all(bundles.map((b) => build(optionsFor(b))));
    copyLegacy();
    copyFeatureCss();
    copyHtml();
    syncManifest();
    console.log('build: ' + outNames + ' + ' + legacyFiles.length + ' legacy + manifest -> dist/');
}
