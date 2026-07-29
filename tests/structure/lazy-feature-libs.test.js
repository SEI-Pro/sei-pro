import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

/** Heavy feature libs must stay WAR + on-demand, not eager content_scripts.
 * Dropzone was removed — upload uses src/shared/ui/file-queue.js. */
const LAZY_JS = [
    'js/lib/frappe-gantt.js',
    'js/lib/chart.min.js',
    'js/lib/jschardet.min.js',
    'js/lib/mammoth.browser.min.js',
    'js/lib/tesseract.min.js'
];

const LAZY_CSS = [
    'css/frappe-gantt.css',
    'css/chart.min.css'
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

    it('bootstraps Chart/Gantt from init; Dropzone replaced by file-queue', () => {
        const init = read('src/bootstrap/init.js');
        const initArvore = read('src/bootstrap/init_arvore.js');
        const upload = read('src/features/arvore/upload.js');
        expect(init).toContain("js/lib/frappe-gantt.js");
        expect(init).toContain('css/frappe-gantt.css');
        expect(init).toContain("js/lib/chart.min.js");
        expect(init).toContain('css/chart.min.css');
        expect(initArvore).not.toContain('dropzone.min.js');
        expect(upload).toContain("from '../../shared/ui/file-queue.js'");
        expect(upload).toContain('createFileQueue');
    });
});
