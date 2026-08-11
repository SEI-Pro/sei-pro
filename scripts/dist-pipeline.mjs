/**
 * Shared dist pipeline — single source of declared outputs for build, audit, and tests.
 *
 * Spec 001-build-generated-dist / ADR-0011: every path under dist/ after an official
 * (non-watch) build MUST appear here. Never create files only in dist/.
 *
 * Static fonte→dist pairs live in asset-manifest.mjs; generation rules live here.
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { ALL_FILE_PAIRS, ASSET_DIRS } from './asset-manifest.mjs';

/** Entry files under src/entries that keep stable legacy output names (not *.bundle.js). */
export const ENTRY_BUNDLE_EXCLUSIONS = new Set([
    'background.js',
    'atividades.ts',
    'editor.js',
    'editor.ts',
    'arvore.ts'
]);

/**
 * Manifest / runtime paths that may be absent by design.
 * Each entry requires a reason — not an escape hatch for dead required refs.
 */
export const OPTIONAL_RESOURCES = new Map([
    [
        'js/sei-pro-config-local.js',
        'Override opcional por instalação; src/bootstrap/init.js carrega e avisa sem falhar quando ausente.'
    ]
]);

/** Explicit esbuild bundles (stable legacy output names + feature entries). */
export const EXPLICIT_BUNDLES = [
    { entry: 'src/content/core-stack.ts', out: 'dist/js/core-stack.bundle.js' },
    { entry: 'src/entries/background.js', out: 'dist/js/background.js' },
    { entry: 'src/background/llm-handler.ts', out: 'dist/js/llm-handler.js' },
    { entry: 'src/entries/arvore.ts', out: 'dist/js/sei-pro-arvore.js' },
    { entry: 'src/features/lista-processos/index.ts', out: 'dist/js/sei-pro.js' },
    { entry: 'src/entries/atividades.ts', out: 'dist/js/sei-pro-atividades.js' },
    { entry: 'src/features/docs-lote/index.ts', out: 'dist/js/docs-lote.bundle.js' },
    { entry: 'src/features/quick-filter/index-list.ts', out: 'dist/js/quick-filter-list.bundle.js' },
    { entry: 'src/features/quick-filter/index-tree.ts', out: 'dist/js/quick-filter-tree.bundle.js' },
    { entry: 'src/features/anotacao-controle/index.ts', out: 'dist/js/anotacao-controle.bundle.js' },
    { entry: 'src/features/monitorados/index.ts', out: 'dist/js/monitorados.bundle.js' },
    { entry: 'src/features/controlar-prazos/index.ts', out: 'dist/js/sei-pro-controle-prazo.js' },
    { entry: 'src/entries/editor.ts', out: 'dist/js/sei-pro-editor.js' },
    { entry: 'src/features/ai/index.ts', out: 'dist/js/sei-pro-ai.js' },
    { entry: 'src/features/legis/index.ts', out: 'dist/js/sei-legis.js' },
    { entry: 'src/features/lista-agrupamento/index.ts', out: 'dist/js/lista-agrupamento.bundle.js' },
    { entry: 'src/features/projetos/index.ts', out: 'dist/js/sei-pro-projetos.js' },
    { entry: 'src/features/monitorados/options.ts', out: 'dist/js/monitorados-options.bundle.js' }
];

/** Legacy global scripts copied verbatim to dist/js/<basename>. */
export const LEGACY_FILES = [
    'src/features/todas-paginas/sei-pro-all.js',
    'src/features/prescricoes/sei-pro-prescricoes.js',
    'src/features/visualizacao/sei-pro-visualizacao.js',
    'src/features/visualizacao/sei-pro-visualizacao-chosen.js',
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
    'src/background/router.js'
];

export const FEATURE_CSS = [
    { src: 'src/features/anotacao-controle/style.css', out: 'dist/css/anotacao-controle.css' },
    { src: 'src/features/monitorados/monitorados.css', out: 'dist/css/monitorados.css' },
    { src: 'src/shared/ui/prazo-preview.css', out: 'dist/css/prazo-preview.css' },
    { src: 'src/shared/ui/stream-panel.css', out: 'dist/css/stream-panel.css' },
    { src: 'src/features/ai/style.css', out: 'dist/css/ai.css' },
    { src: 'src/features/controlar-prazos/style.css', out: 'dist/css/controlar-prazos.css' },
    { src: 'src/features/quick-filter/style.css', out: 'dist/css/quick-filter.css' },
    { src: 'src/features/arvore/style.css', out: 'dist/css/arvore.css' },
    { src: 'src/features/arvore-info/arvore-info.css', out: 'dist/css/arvore-info.css' },
    { src: 'src/features/lista-processos/style.css', out: 'dist/css/lista-processos.css' },
    { src: 'src/shared/sei-runtime/style.css', out: 'dist/css/legacy-sei.css' },
    { src: 'src/features/atividades/style.css', out: 'dist/css/atividades.css' },
    { src: 'src/features/editor/style.css', out: 'dist/css/editor.css' },
    { src: 'src/features/projetos/projetos.css', out: 'dist/css/projetos.css' }
];

export const HTML_FILES = [
    { src: 'src/options/options.html', out: 'dist/html/options.html' },
    { src: 'src/options/page.css', out: 'dist/html/page.css' }
];

export const EXTRA_FILES = [
    { src: 'src/features/editor/ckeditor-main.js', out: 'dist/js/editor-ckeditor-main.js' }
];

function walkFiles(absDir, root, acc = []) {
    if (!existsSync(absDir)) return acc;
    for (const name of readdirSync(absDir)) {
        const full = path.join(absDir, name);
        if (statSync(full).isDirectory()) walkFiles(full, root, acc);
        else acc.push(path.relative(root, full));
    }
    return acc;
}

/** Auto-discovered entry bundles: src/entries/* → dist/js/<name>.bundle.js */
export function listEntryBundles(root) {
    const entriesDir = path.join(root, 'src/entries');
    if (!existsSync(entriesDir)) return [];
    return readdirSync(entriesDir)
        .filter((f) => {
            const full = path.join(entriesDir, f);
            return (
                statSync(full).isFile()
                && (f.endsWith('.ts') || f.endsWith('.js'))
                && !ENTRY_BUNDLE_EXCLUSIONS.has(f)
            );
        })
        .map((f) => ({
            entry: 'src/entries/' + f,
            out: 'dist/js/' + f.replace(/\.(js|ts)$/, '.bundle.js')
        }));
}

/** Full esbuild bundle list for an official or watch build. */
export function listBundles(root) {
    return [...EXPLICIT_BUNDLES, ...listEntryBundles(root)];
}

/**
 * Complete legal set of paths under dist/ after an official build.
 * @param {string} root repo root
 * @returns {Set<string>} paths like `dist/js/foo.js`
 */
export function listDeclaredDistOutputs(root) {
    const out = new Set();

    for (const { out: o } of ALL_FILE_PAIRS) out.add(o);
    for (const { src, out: o } of ASSET_DIRS) {
        const absSrc = path.join(root, src);
        if (!existsSync(absSrc)) continue;
        for (const file of walkFiles(absSrc, root)) {
            out.add(path.join(o, path.relative(src, file)));
        }
    }

    for (const { out: o } of listBundles(root)) out.add(o);
    for (const rel of LEGACY_FILES) out.add('dist/js/' + path.basename(rel));
    for (const { out: o } of FEATURE_CSS) out.add(o);
    for (const { out: o } of HTML_FILES) out.add(o);
    for (const { out: o } of EXTRA_FILES) out.add(o);
    out.add('dist/manifest.json');

    return out;
}
