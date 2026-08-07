import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const editorDir = path.join(root, 'src/features/editor');

function walk(dir, out = []) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(p, out);
        else if (ent.name.match(/\.(js|ts)$/)) out.push(p);
    }
    return out;
}

describe('editor architecture migration guards', () => {
    it('does not import the jQuery library under features/editor', () => {
        const files = walk(editorDir);
        for (const file of files) {
            const src = fs.readFileSync(file, 'utf8');
            const rel = path.relative(root, file);
            expect(src, rel).not.toMatch(/from\s+['"]jquery['"]/);
            expect(src, rel).not.toContain('jquery-3.');
            expect(src, rel).not.toContain('FilerobotImageEditor');
            expect(src, rel).not.toContain('checkLoadFileRobot');
        }
    });

    it('uses native domq instead of global $', () => {
        const domq = fs.readFileSync(path.join(editorDir, 'lib/domq.ts'), 'utf8');
        expect(domq).toContain('export function qLoadScript');
        expect(domq).toContain('NOT jQuery');
        expect(fs.existsSync(path.join(editorDir, 'adapter.ts'))).toBe(true);
        expect(fs.existsSync(path.join(editorDir, 'templates.ts'))).toBe(true);
        expect(fs.existsSync(path.join(editorDir, 'commands/formatting.ts'))).toBe(true);
        expect(fs.existsSync(path.join(root, 'src/entries/editor.ts'))).toBe(true);
    });

    it('does not keep a body.js monolith', () => {
        expect(fs.existsSync(path.join(editorDir, 'body.js'))).toBe(false);
        expect(fs.existsSync(path.join(editorDir, 'adapter.ts'))).toBe(true);
        expect(fs.existsSync(path.join(editorDir, 'view/toolbar.ts'))).toBe(true);
    });

    it('uses delegated actions instead of inline handlers', () => {
        const featureFiles = [
            ...walk(editorDir),
            ...walk(path.join(root, 'src/features/legis'))
        ];
        for (const file of featureFiles) {
            const source = fs.readFileSync(file, 'utf8');
            expect(source, path.relative(root, file)).not.toMatch(
                /\bon(?:click|change|mouseover|mouseout)\s*=/i
            );
        }
        expect(fs.readFileSync(
            path.join(editorDir, 'view/delegated-actions.ts'),
            'utf8'
        )).toContain("root.addEventListener('click'");
    });

    it('keeps view modules independent from IO modules', () => {
        const viewFiles = [
            ...walk(path.join(editorDir, 'view')),
            path.join(root, 'src/features/legis/view.ts'),
            ...walk(path.join(root, 'src/features/ai/view'))
        ];
        for (const file of viewFiles) {
            const source = fs.readFileSync(file, 'utf8');
            expect(source, path.relative(root, file)).not.toMatch(
                /from\s+['"][^'"]*(?:\/io\/|\/io\.js|^\.\.\/io)/
            );
        }
        expect(fs.existsSync(path.join(editorDir, 'io/images.js'))).toBe(false);
        expect(fs.existsSync(path.join(root, 'src/features/legis/body.js'))).toBe(false);
    });
});
