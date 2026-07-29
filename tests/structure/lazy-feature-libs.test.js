import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

/** Heavy feature libs must stay WAR + on-demand getScript, not eager content_scripts. */
const LAZY_JS = [
    'js/lib/frappe-gantt.js',
    'js/lib/chart.min.js',
    'js/lib/dropzone.min.js',
    'js/lib/jschardet.min.js',
    'js/lib/mammoth.browser.min.js',
    'js/lib/tesseract.min.js'
];

const LAZY_CSS = [
    'css/frappe-gantt.css',
    'css/chart.min.css',
    'css/dropzone.min.css'
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
        }
    });

    it('exposes the same libs via web_accessible_resources for getScript/loadStylePro', () => {
        for (const lib of [...LAZY_JS, ...LAZY_CSS]) {
            expect(war, `WAR ${lib}`).toContain(lib);
        }
    });

    it('bootstraps Chart/Gantt/Dropzone from init paths with CSS', () => {
        const init = read('src/bootstrap/init.js');
        const initArvore = read('src/bootstrap/init_arvore.js');
        expect(init).toContain("js/lib/frappe-gantt.js");
        expect(init).toContain('css/frappe-gantt.css');
        expect(init).toContain("js/lib/chart.min.js");
        expect(init).toContain('css/chart.min.css');
        expect(initArvore).toContain("js/lib/dropzone.min.js");
        expect(initArvore).toContain('css/dropzone.min.css');
    });
});
