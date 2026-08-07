import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
    GENERATED_CONTEXTS,
    generateContextRegistry,
    registryPath
} from '../../scripts/generate-context-registry.mjs';

const root = process.cwd();

describe('generated context registry', () => {
    it('keeps every committed registry derived from exclusive feature descriptors', () => {
        expect(GENERATED_CONTEXTS).toEqual(['login', 'db', 'lista']);
        const expected = {
            login: ['login'],
            db: ['external-config'],
            lista: ['nao-lido']
        };
        for (const context of GENERATED_CONTEXTS) {
            const { descriptors, text } = generateContextRegistry(context);
            expect(descriptors.map((entry) => entry.id)).toEqual(expected[context]);
            expect(text).toBe(readFileSync(registryPath(context), 'utf8'));
        }
    });
});
