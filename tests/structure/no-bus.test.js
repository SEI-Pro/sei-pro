/**
 * ADR-0013: event bus removed until there are ≥2 real consumers.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(full, out);
        else if (/\.(js|ts|mjs)$/.test(ent.name)) out.push(full);
    }
    return out;
}

function toRel(abs) {
    return path.relative(root, abs).split(path.sep).join('/');
}

describe('no event bus (ADR-0013)', () => {
    it('src/platform/bus.ts (and .js) do not exist', () => {
        expect(fs.existsSync(path.join(root, 'src/platform/bus.ts'))).toBe(false);
        expect(fs.existsSync(path.join(root, 'src/platform/bus.js'))).toBe(false);
    });

    it('no source file imports platform/bus', () => {
        const violators = [];
        for (const file of walk(path.join(root, 'src'))) {
            const text = fs.readFileSync(file, 'utf8');
            if (/platform\/bus(?:\.js|\.ts)?['"]/.test(text) || /from ['"].*\/bus(?:\.js|\.ts)?['"]/.test(text)) {
                if (/platform\/bus/.test(text)) violators.push(toRel(file));
            }
        }
        expect(violators, `Unexpected bus imports:\n${violators.join('\n')}`).toEqual([]);
    });

    it('core/stack does not install a bus', () => {
        const stack = fs.readFileSync(path.join(root, 'src/core/stack.ts'), 'utf8');
        expect(stack).not.toMatch(/installBus|platform\/bus/);
    });
});
