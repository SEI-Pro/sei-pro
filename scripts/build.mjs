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
import { copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_FILE_PAIRS, ASSET_DIRS } from './asset-manifest.mjs';

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
    .filter((f) => {
        const full = path.join(entriesDir, f);
        return statSync(full).isFile() && (f.endsWith('.ts') || f.endsWith('.js')) && f !== 'editor.js' && f !== 'editor.ts';
    })
    .map((f) => ({
        entry: 'src/entries/' + f,
        out: 'dist/js/' + f.replace(/\.(js|ts)$/, '.bundle.js')
    }));

// TODO(ADR-0004 / plan 3.7): derive this list from feature descriptors + contexts
// instead of maintaining hand entries. entryBundles (src/entries/*) already scan
// the filesystem; the feature bundles below are still explicit because legacy
// output names (sei-pro.js, sei-functions-pro.js, …) must stay stable for
// manifest.base.json until content_scripts are generated.
const bundles = [
    { entry: 'src/content/core-stack.ts', out: 'dist/js/core-stack.bundle.js' },
    // The service worker is legacy, but the LLM handler is bundled so it can
    // reuse the provider adapters and streaming client without duplicating them.
    { entry: 'src/background/llm-handler.ts', out: 'dist/js/llm-handler.js' },
    { entry: 'src/features/arvore-info/index.ts', out: 'dist/js/arvore-info.bundle.js' },
    { entry: 'src/features/arvore/index.ts', out: 'dist/js/sei-pro-arvore.js' },
    { entry: 'src/features/lista-processos/index.ts', out: 'dist/js/sei-pro.js' },
    { entry: 'src/features/sei-functions/index.ts', out: 'dist/js/sei-functions-pro.js' },
    { entry: 'src/features/atividades/index.ts', out: 'dist/js/sei-pro-atividades.js' },
    { entry: 'src/features/quick-highlight/index.ts', out: 'dist/js/quick-highlight.bundle.js' },
    { entry: 'src/features/docs-lote/index.ts', out: 'dist/js/docs-lote.bundle.js' },
    { entry: 'src/features/quick-filter/index-list.ts', out: 'dist/js/quick-filter-list.bundle.js' },
    { entry: 'src/features/quick-filter/index-tree.ts', out: 'dist/js/quick-filter-tree.bundle.js' },
    { entry: 'src/features/anotacao-controle/index.ts', out: 'dist/js/anotacao-controle.bundle.js' },
    { entry: 'src/features/monitorados/index.ts', out: 'dist/js/monitorados.bundle.js' },
    // Controlar Prazos: decomposta em domain/io/view; saída mantém o nome do script
    // legado (js/sei-pro-controle-prazo.js) p/ o manifest não mudar.
    { entry: 'src/features/controlar-prazos/index.ts', out: 'dist/js/sei-pro-controle-prazo.js' },
    // Marcar como "Não Visualizado": decomposta em io/view; saída nova (manifest
    // blocos 3 e 4, após sei-pro.js). Globais preservados via aliasGlobal.
    { entry: 'src/entries/editor.ts', out: 'dist/js/sei-pro-editor.js' },
    { entry: 'src/features/ai/index.ts', out: 'dist/js/sei-pro-ai.js' },
    { entry: 'src/features/legis/index.ts', out: 'dist/js/sei-legis.js' },
    { entry: 'src/features/nao-lido/index.ts', out: 'dist/js/sei-pro-nao-lido.js' },
    { entry: 'src/features/lista-agrupamento/index.ts', out: 'dist/js/lista-agrupamento.bundle.js' },
    // Projetos (Gantt): domain/store/view; saida mantem nome legado js/sei-pro-projetos.js
    { entry: 'src/features/projetos/index.ts', out: 'dist/js/sei-pro-projetos.js' },
    // Options page (extension settings UI) — full vanilla bundle.
    { entry: 'src/options/index.ts', out: 'dist/js/options.bundle.js' },
    // Página de opções — fatia de "Processos Monitorados" (dependência entre os
    // switches gerenciarmonitorados ↔ monitoradosacimacontrole). Carregado por
    // html/options.html ao lado do options.bundle.js.
    { entry: 'src/features/monitorados/options.ts', out: 'dist/js/monitorados-options.bundle.js' },
    ...entryBundles
];

function optionsFor({ entry, out }) {
    const outfile = path.join(root, out);
    const plugins = entry === 'src/entries/editor.ts'
        ? [{
            name: 'trim-editor-bundle-line-endings',
            setup(buildApi) {
                buildApi.onEnd((result) => {
                    if (result.errors.length) return;
                    const source = readFileSync(outfile, 'utf8');
                    writeFileSync(outfile, source.replace(/[ \t]+$/gm, ''), 'utf8');
                });
            }
        }]
        : [];

    return {
        entryPoints: [path.join(root, entry)],
        bundle: true,
        format: 'iife',
        minify: false,
        outfile,
        plugins,
        logLevel: 'info'
    };
}

// Legacy global scripts copied verbatim to dist/js/<basename>. Source of truth
// lives under src/; dist/js holds only generated output. Adding a file here is a
// pure relocation — behavior is unchanged until the feature is decomposed later.
const legacyFiles = [
    // lista-processos migrada para bundle ESM (sei-pro.js) — não copiar mais o legado.
    // sei-functions-pro migrada para bundle ESM — não copiar mais o legado.
    // atividades migrada para bundle ESM (sei-pro-atividades.js) — não copiar mais o legado.
    'src/features/todas-paginas/sei-pro-all.js',
    // projetos migrado para bundle ESM (sei-pro-projetos.js) — nao copiar mais o legado.
    'src/features/prescricoes/sei-pro-prescricoes.js',
    'src/features/visualizacao/sei-pro-visualizacao.js',
    'src/features/visualizacao/sei-pro-visualizacao-chosen.js',
    // legis migrated to an ESM bundle while retaining dist/js/sei-legis.js.
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
    'src/bootstrap/editor-loader.js',
    'src/platform/inline-stubs-main.js',
    'src/shared/qr-code-main.js',
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
    { src: 'src/shared/ui/stream-panel.css', out: 'dist/css/stream-panel.css' },
    { src: 'src/features/ai/style.css', out: 'dist/css/ai.css' },
    { src: 'src/features/controlar-prazos/style.css', out: 'dist/css/controlar-prazos.css' },
    { src: 'src/features/quick-filter/style.css', out: 'dist/css/quick-filter.css' },
    { src: 'src/features/arvore/style.css', out: 'dist/css/arvore.css' },
    { src: 'src/features/lista-processos/style.css', out: 'dist/css/lista-processos.css' },
    { src: 'src/features/sei-functions/style.css', out: 'dist/css/sei-functions.css' },
    { src: 'src/features/atividades/style.css', out: 'dist/css/atividades.css' },
    { src: 'src/features/editor/style.css', out: 'dist/css/editor.css' },
    { src: 'src/features/projetos/projetos.css', out: 'dist/css/projetos.css' }
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

// Assets estáticos (libs de terceiros, CSS nosso, ícones, dados). O mapeamento
// fonte → dist é declarado UMA vez em scripts/asset-manifest.mjs e compartilhado
// com o resgate e com os testes de estrutura (ADR-0011). Não editar dist/ à mão.
const extraFiles = [
    // CKEditor bridge: fonte em src/ porque é código nosso, não vendor.
    { src: 'src/features/editor/ckeditor-main.js', out: 'dist/js/editor-ckeditor-main.js' }
];

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
    for (const { src, out } of [...ALL_FILE_PAIRS, ...extraFiles]) {
        const dest = path.join(root, out);
        mkdirSync(path.dirname(dest), { recursive: true });
        copyFileSync(path.join(root, src), dest);
    }
    for (const { src, out } of ASSET_DIRS) {
        copyTree(path.join(root, src), path.join(root, out));
    }
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
    copyAssets();
    syncManifest();
    console.log('build: watching src/ — ' + outNames + ' (+ ' + legacyFiles.length + ' legacy copies)');
} else {
    await Promise.all(bundles.map((b) => build(optionsFor(b))));
    copyLegacy();
    copyFeatureCss();
    copyHtml();
    copyAssets();
    syncManifest();
    console.log('build: ' + outNames + ' + ' + legacyFiles.length + ' legacy + vendor + manifest -> dist/');
}
