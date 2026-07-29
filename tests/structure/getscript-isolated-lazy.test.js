import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('getscript-isolated — lazy WAR libs', () => {
    const src = read('src/bootstrap/getscript-isolated.js');

    it('carrega de verdade só libs lazy (Chart/Gantt/…); no-op no restante eager', () => {
        expect(src).toMatch(/LAZY_RE/);
        expect(src).toMatch(/frappe-gantt|chart\.min/);
        expect(src).toMatch(/original\.apply\(\$, arguments\)/);
        expect(src).toMatch(/resolve\(\)\.promise\(\)/);
        expect(src).toMatch(/frmEditor|eager|já presente/i);
    });
});
