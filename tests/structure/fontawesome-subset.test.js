import { describe, expect, it } from 'vitest';
import {
    existsSync,
    readFileSync,
    readdirSync,
    statSync
} from 'node:fs';
import { join, relative } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

const EXPECTED_FONT_FILES = [
    'pro/fa-brands-400.woff2',
    'pro/fa-duotone-900.woff2',
    'pro/fa-regular-400.woff2',
    'pro/fa-solid-900.woff2'
];

function listFiles(dir) {
    if (!existsSync(dir)) return [];
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return listFiles(path);
        return [relative(join(rootDir, 'dist', 'webfonts'), path)];
    });
}

describe('Font Awesome subset', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const war = (manifest.web_accessible_resources || []).flatMap((entry) => entry.resources || []);
    const css = read('dist/css/fontawesome.pro.min.css');

    it('ships only the Pro WOFF2 subset and no duplicate Free stylesheet', () => {
        const eagerCss = (manifest.content_scripts || []).flatMap((entry) => entry.css || []);
        const warFonts = war.filter((entry) => entry.startsWith('webfonts/'));

        expect(eagerCss).toContain('css/fontawesome.pro.min.css');
        expect(eagerCss).not.toContain('css/fontawesome.min.css');
        expect(war).toContain('css/fontawesome.pro.min.css');
        expect(war).not.toContain('css/fontawesome.min.css');
        expect(warFonts.sort()).toEqual(EXPECTED_FONT_FILES.map((file) => `webfonts/${file}`).sort());
    });

    it('keeps the on-disk font directory aligned with the manifest', () => {
        const actual = listFiles(join(rootDir, 'dist', 'webfonts')).sort();
        expect(actual).toEqual([...EXPECTED_FONT_FILES].sort());

        for (const relPath of EXPECTED_FONT_FILES) {
            const path = join(rootDir, 'dist', 'webfonts', relPath);
            expect(existsSync(path), relPath).toBe(true);
            expect(statSync(path).size, relPath).toBeGreaterThan(100);
            expect(readFileSync(path).subarray(0, 4).toString(), relPath).toBe('wOF2');
        }
    });

    it('references WOFF2 only in the shipped stylesheet', () => {
        const sources = [...css.matchAll(/src:\s*url\("([^"]+)"\)\s*format\("([^"]+)"\)/g)];
        expect(sources.length).toBe(8); // Chrome + Firefox URL for each of four families.
        expect(sources.every(([, , format]) => format === 'woff2')).toBe(true);
        expect(sources.every(([, url]) => /webfonts\/pro\/fa-(?:brands|duotone|regular|solid)-\d+\.woff2$/.test(url))).toBe(true);
        expect(css).not.toMatch(/fontawesome\.min\.css|fa-light-300|format\("(?:eot|truetype|woff)"\)/);
    });

    it('retains the Pro icon paths used by the extension', () => {
        const monitorados = read('src/features/monitorados/visualizacao.js');
        const ui = read('src/core/ui.js');
        const editor = read('src/features/editor/page-runtime.js');
        const seiFunctions = read('src/features/sei-functions/body.js');

        expect(monitorados).toContain('css/fontawesome.pro.min.css');
        expect(monitorados).not.toContain('css/fontawesome.min.css');
        for (const source of [ui, editor, seiFunctions]) {
            expect(source).not.toContain('fa-light-300');
            expect(source).not.toMatch(/fa-(?:brands|duotone|regular|solid)-\d+\.(?:eot|svg|ttf|woff)(?:[)'"\s]|$)/);
        }
    });
});
