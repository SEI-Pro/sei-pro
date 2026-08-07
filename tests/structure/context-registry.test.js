import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateListaRegistry } from '../../scripts/generate-context-registry.mjs';

const root = process.cwd();

describe('generated context registry', () => {
    it('keeps the lista registry derived from exclusive feature descriptors', () => {
        const { descriptors, text } = generateListaRegistry();
        expect(descriptors.map((entry) => entry.id)).toEqual(['nao-lido']);
        expect(text).toBe(
            readFileSync(join(root, 'src/generated/lista-feature-registry.ts'), 'utf8')
        );
    });
});
