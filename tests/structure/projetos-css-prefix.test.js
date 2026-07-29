import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');

describe('structure/projetos-css-prefix', () => {
    it('feature CSS uses .seipro-projetos- prefix', () => {
        const css = readFileSync(path.join(root, 'src/features/projetos/projetos.css'), 'utf8');
        expect(css).toMatch(/\.seipro-projetos/);
        expect(css).toMatch(/\.seipro-projetos-bar--/);
    });

    it('built bundle avoids legacy vendor APIs', () => {
        const bundle = readFileSync(path.join(root, 'dist/js/sei-pro-projetos.js'), 'utf8');
        // No jQuery usage in the feature bundle
        expect(bundle).not.toMatch(/\$\(/);
        expect(bundle).not.toMatch(/\bjmespath\b/);
        expect(bundle).not.toMatch(/\bmoment\s*\(/);
        expect(bundle).not.toMatch(/tagsInput/);
        expect(bundle).not.toMatch(/SimpleTableCellEditor/);
        expect(bundle).not.toMatch(/\.chosen\(/);
        // Still may reference Gantt as global after lazy load
        expect(bundle).toMatch(/frappe-gantt/);
        expect(bundle).toMatch(/seipro-projetos/);
    });
});
