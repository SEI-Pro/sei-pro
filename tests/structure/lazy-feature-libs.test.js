import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readSeiFunctionsSource } from '../helpers/read-sei-functions.js';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

/** Heavy feature libs must stay WAR + on-demand, not eager content_scripts.
 * Dropzone was removed — upload uses src/shared/ui/file-queue.js. */
const LAZY_JS = [
    'js/lib/frappe-gantt.js',
    'js/lib/chart.min.js',
    'js/lib/jkanban.min.js',
    'js/lib/jschardet.min.js',
    'js/lib/mammoth.browser.min.js',
    'js/lib/qrcode.min.js'
];

const REMOVED_JS = [
    'js/lib/pdfjs.js',
    'js/lib/pdf.worker.min.js',
    'js/lib/tesseract.min.js',
    'js/lib/filerobot-image-editor.min.js'
];

const LAZY_CSS = [
    'css/frappe-gantt.css',
    'css/chart.min.css',
    'css/jkanban.min.css'
];

describe('lazy feature libs (not eager content_scripts)', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const war = (manifest.web_accessible_resources || []).flatMap((r) => r.resources || []);

    it('keeps heavy libs out of every content_scripts js/css list', () => {
        for (const cs of manifest.content_scripts || []) {
            for (const lib of LAZY_JS) {
                expect(cs.js || [], `eager js ${lib}`).not.toContain(lib);
            }
            for (const lib of LAZY_CSS) {
                expect(cs.css || [], `eager css ${lib}`).not.toContain(lib);
            }
            expect(cs.js || []).not.toContain('js/lib/dropzone.min.js');
            expect(cs.css || []).not.toContain('css/dropzone.min.css');
        }
    });

    it('exposes remaining lazy libs via web_accessible_resources', () => {
        for (const lib of [...LAZY_JS, ...LAZY_CSS]) {
            expect(war, `WAR ${lib}`).toContain(lib);
        }
    });

    it('loads heavy libraries from feature paths; Dropzone replaced by file-queue', () => {
        const init = read('src/bootstrap/init.js');
        const initArvore = read('src/bootstrap/init_arvore.js');
        const upload = read('src/features/arvore/upload.js');
        const atividades = read('src/features/atividades/runtime.js');
        const lista = read('src/features/lista-processos/panel-kanban-chrome.js');
        const projetos = read('src/features/projetos/view/helpers.js');
        const editorImport = read('src/features/editor/view/dialogs/import.js');
        const docsLote = read('src/features/docs-lote/view.js');
        const qr = read('src/shared/qr-code.js');
        expect(init).not.toMatch(/(?:chart\.min|frappe-gantt|jkanban\.min)\.js/);
        expect(init).not.toMatch(/(?:chart\.min|frappe-gantt|jkanban\.min)\.css/);
        expect(atividades).toContain('loadChartAtividades');
        expect(atividades).toContain('loadKanbanStyleAtividades');
        expect(lista).toContain('loadKanbanStylePro');
        expect(projetos).toContain('loadGanttLib');
        expect(editorImport).toContain('mammoth.browser.min.js');
        expect(docsLote).toContain('jschardet.min.js');
        expect(qr).toContain('js/lib/qrcode.min.js');
        expect(qr).toContain('loadScriptOnce');
        expect(read('src/shared/qr-code-main.js')).toContain('seipro-qr-render');
        expect(initArvore).not.toContain('dropzone.min.js');
        expect(upload).toContain("from '../../shared/ui/file-queue.js'");
        expect(upload).toContain('createFileQueue');
    });

    it('does not keep Dropzone orphan bootstrap or packaged assets', () => {
        expect(existsSync(join(rootDir, 'src/features/bootstrap'))).toBe(false);
        expect(existsSync(join(rootDir, 'dist/js/lib/dropzone.min.js'))).toBe(false);
        expect(existsSync(join(rootDir, 'dist/css/dropzone.min.css'))).toBe(false);
        expect(war).not.toContain('js/lib/dropzone.min.js');
        expect(war).not.toContain('css/dropzone.min.css');
    });

    it('does not package removed PDF/OCR/editor libraries', () => {
        for (const lib of REMOVED_JS) {
            for (const cs of manifest.content_scripts || []) {
                expect(cs.js || [], `eager js ${lib}`).not.toContain(lib);
            }
            expect(war, `WAR ${lib}`).not.toContain(lib);
            expect(existsSync(join(rootDir, 'dist', lib))).toBe(false);
        }
    });

    it('removes the duplicate jQuery QR implementation', () => {
        const allManifestEntries = [
            ...(manifest.content_scripts || []).flatMap((cs) => [...(cs.js || []), ...(cs.css || [])]),
            ...war
        ];
        expect(allManifestEntries).not.toContain('js/lib/jquery-qrcode-0.18.0.min.js');
        expect(read('src/features/todas-paginas/sei-pro-all.js')).not.toContain('jquery-qrcode');
        expect(readSeiFunctionsSource()).not.toContain('jquery-qrcode');
        expect(existsSync(join(rootDir, 'dist/js/lib/jquery-qrcode-0.18.0.min.js'))).toBe(false);
    });
});
