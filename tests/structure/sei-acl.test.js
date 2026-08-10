/**
 * ADR-0003 — Anti-Corruption Layer gate.
 *
 * SEI selector literals, controlador.php knowledge, and version branching should
 * live in src/sei/. Current offenders stay on an explicit allowlist that only
 * shrinks. Migrated files must stay clean (hard rule).
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

/** Same pattern as scripts/measure-ratchets.mjs */
const SEI_SELECTOR_RE =
    /#(divInfra|tblProcessos|frmEditor|ifrVisualizacao|divArvore|divRecebidos|divComandos|infraMenu)|ancoraArvore|infraTable|barraBotoesSEI|infra-editor/;

/**
 * Files outside src/sei/ that still contain SEI selector patterns.
 * Shrink-only: removing an entry when the file is cleaned is required;
 * adding a new offender fails the build.
 */
const SELECTOR_ALLOWLIST = [
    'src/bootstrap/editor-loader.js',
    'src/bootstrap/init.js',
    'src/bootstrap/init_all.js',
    'src/bootstrap/init_db.js',
    'src/bootstrap/init_visualizacao.js',
    'src/entries/lista/io.ts',
    'src/entries/lista/legacy-api.ts',
    'src/features/ai/io/context.ts',
    'src/features/anotacao-controle/view.ts',
    'src/features/arvore/doc-actions.ts',
    'src/features/arvore/menu-panel.ts',
    'src/features/arvore/tree-chrome.ts',
    'src/features/arvore/upload.ts',
    'src/features/arvore-info/index.ts',
    'src/features/arvore-info/sections/acompanhamento.ts',
    'src/features/arvore-info/sections/marcador.ts',
    'src/features/atividades/boot.ts',
    'src/features/controlar-prazos/view.ts',
    'src/features/editor/adapter.ts',
    'src/features/editor/io/process-documents.ts',
    'src/features/editor/page-runtime.ts',
    'src/features/editor/state.ts',
    'src/features/editor/view/toolbar.ts',
    'src/features/external-config/index.ts',
    'src/features/lista-processos/boot.ts',
    'src/features/lista-processos/grouping-select.ts',
    'src/features/lista-processos/home-filters.ts',
    'src/features/lista-processos/kanban-home.ts',
    'src/features/lista-processos/marcadores-distrib.ts',
    'src/features/lista-processos/pagination-tabs.ts',
    'src/features/lista-processos/panel-kanban-chrome.ts',
    'src/features/lista-processos/table-sorter-home.ts',
    'src/features/lista-processos/upload-home.ts',
    'src/features/monitorados/boot.ts',
    'src/features/monitorados/commands.ts',
    'src/features/monitorados/panel.ts',
    'src/features/monitorados/visualizacao.ts',
    'src/features/nao-lido/view.ts',
    'src/features/projetos/templates.ts',
    'src/features/projetos/view/panel.ts',
    'src/features/quick-filter/index-tree.ts',
    'src/features/quick-filter/list.ts',
    'src/features/quick-highlight/index.ts',
    'src/features/acoes-capa/batch-capa.ts',
    'src/features/atividades-registro/panel.ts',
    'src/features/chrome-ui/slim-ui-chrome.ts',
    'src/features/chrome-ui/visualizacao-toolbar.ts',
    'src/features/cores-marcadores/marcadores-arvore.ts',
    'src/features/dialogs-host/layout-dialogs.ts',
    'src/features/historico-processos/wait-load-home.ts',
    'src/features/menus-rapidos/tags-menus.ts',
    'src/features/menus-rapidos/wizards-menu.ts',
    'src/features/midia-documentos/media-viewers.ts',
    'src/features/notificacoes-processo/notifications-process.ts',
    'src/shared/sei-runtime/boot.ts',
    // Property name ancoraArvoreDownload still trips the ratchet regex; literals removed.
    'src/shared/sei-runtime/state.ts',
    'src/features/todas-paginas/sei-pro-all.js',
    'src/shared/legacy/sei-pro-icons.js'
];

/**
 * Phase 1 migrated consumers — must not reintroduce SEI selector literals.
 * (Hard rule for completed ACL slices.)
 */
const MIGRATED_CLEAN = [
    'src/features/arvore/interessados-arvore.ts',
    'src/features/lista-processos/state.ts',
    'src/features/lista-processos/panels-csv.ts'
];

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(full, out);
        else if (/\.(js|ts)$/.test(ent.name)) out.push(full);
    }
    return out;
}

function toRel(abs) {
    return path.relative(root, abs).split(path.sep).join('/');
}

function filesWithSeiSelectorsOutside() {
    const offenders = [];
    for (const file of walk(path.join(root, 'src'))) {
        const rel = toRel(file);
        if (rel.startsWith('src/sei/')) continue;
        const text = fs.readFileSync(file, 'utf8');
        if (SEI_SELECTOR_RE.test(text)) offenders.push(rel);
    }
    return offenders.sort();
}

describe('sei ACL (ADR-0003)', () => {
    it('adapter.ts has no raw SEI selector string literals', () => {
        const adapter = fs.readFileSync(path.join(root, 'src/sei/adapter.ts'), 'utf8');
        const withoutComments = adapter
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/(^|[^:])\/\/.*$/gm, '$1');
        expect(withoutComments).not.toMatch(/#[a-zA-Z][\w-]*/);
        expect(withoutComments).not.toMatch(/ancoraArvore|barraBotoesSEI|infra-editor/);
    });

    it('no new SEI selectors outside src/sei/ (allowlist shrink-only)', () => {
        const offenders = filesWithSeiSelectorsOutside();
        const allow = new Set(SELECTOR_ALLOWLIST);
        const unexpected = offenders.filter((f) => !allow.has(f));
        const stale = SELECTOR_ALLOWLIST.filter((f) => !offenders.includes(f));

        expect(
            unexpected,
            `New SEI selectors outside src/sei/ — move to ACL or justify:\n${unexpected.join('\n')}`
        ).toEqual([]);
        expect(
            stale,
            `Stale SELECTOR_ALLOWLIST — remove cleaned files:\n${stale.join('\n')}`
        ).toEqual([]);
    });

    it('migrated consumers stay free of SEI selector patterns', () => {
        const dirty = [];
        for (const rel of MIGRATED_CLEAN) {
            const text = fs.readFileSync(path.join(root, rel), 'utf8');
            if (SEI_SELECTOR_RE.test(text)) dirty.push(rel);
        }
        expect(
            dirty,
            `Migrated ACL consumers reintroduced SEI selectors:\n${dirty.join('\n')}`
        ).toEqual([]);
    });

    it('src/sei exposes selectors, pages, parse, supports', () => {
        const required = [
            'src/sei/selectors.ts',
            'src/sei/pages.ts',
            'src/sei/supports.ts',
            'src/sei/parse/lista.ts',
            'src/sei/parse/arvore.ts',
            'src/sei/parse/documento.ts'
        ];
        for (const rel of required) {
            expect(fs.existsSync(path.join(root, rel)), `missing ${rel}`).toBe(true);
        }
        const stack = fs.readFileSync(path.join(root, 'src/core/stack.ts'), 'utf8');
        expect(stack).toMatch(/installSelectors/);
        expect(stack).toMatch(/installPages/);
        expect(stack).toMatch(/installParse/);
        expect(stack).toMatch(/installSupports/);
    });
});
