/**
 * ADR-0015 / Phase S.3: no eval( or new Function( in src/ (except comments).
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const srcRoot = join(root, 'src');

function walk(dir, files = []) {
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        const st = statSync(full);
        if (st.isDirectory()) walk(full, files);
        else if (/\.(js|ts|mjs|cjs)$/.test(name)) files.push(full);
    }
    return files;
}

/** Strip // and /* *\/ comments so documented removals do not fail the test. */
function stripComments(source) {
    return source
        .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ' '))
        .replace(/^\s*\/\/.*$/gm, '');
}

const FORBIDDEN = [
    { name: 'eval(', re: /\beval\s*\(/ },
    { name: 'new Function(', re: /\bnew\s+Function\s*\(/ }
];

describe('no eval / new Function in src (ADR-0015)', () => {
    it('contains no eval( or new Function( outside comments', () => {
        const violations = [];
        for (const file of walk(srcRoot)) {
            const text = stripComments(readFileSync(file, 'utf8'));
            for (const { name, re } of FORBIDDEN) {
                if (re.test(text)) {
                    violations.push(`${relative(root, file)}: ${name}`);
                }
            }
        }
        expect(violations, violations.join('\n')).toEqual([]);
    });
});
