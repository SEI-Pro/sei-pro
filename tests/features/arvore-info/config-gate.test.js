// @vitest-environment jsdom
/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');

describe('arvore-info config gate characterization', () => {
    it('panel feature enables only when checkConfigValue(infoarvore) is true', async () => {
        const { createInfoArvorePanelFeature } = await import('../../../src/features/arvore-info/panel.ts');
        const feature = createInfoArvorePanelFeature({
            doc: document,
            win: window,
            fetchPage: vi.fn(),
            invalidatePage: vi.fn(),
            submitForm: vi.fn(),
            findToolbarLink: () => null,
            getToolbarLinks: () => [],
            log: () => {},
            warn: () => {},
            err: () => {},
            report: () => {}
        });
        expect(feature.id).toBe('infoarvore');
        expect(feature.enabled({ checkConfigValue: (k) => k === 'infoarvore' && true })).toBe(true);
        expect(feature.enabled({ checkConfigValue: () => false })).toBe(false);
        expect(feature.enabled({})).toBe(false);
    });

    it('install path still references infoarvore config key in panel source', () => {
        const src = readFileSync(join(root, 'src/features/arvore-info/panel.ts'), 'utf8');
        expect(src).toMatch(/checkConfigValue\(['"]infoarvore['"]\)/);
        expect(src).toMatch(/id:\s*['"]infoarvore['"]/);
    });
});
