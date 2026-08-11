/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import {
    createSectionEnabledChecker,
    readEnabledSectionIds,
    PREFERENCE_STORAGE_KEY
} from '../../../src/features/arvore-info/preference.ts';
import { PANEL_SECTION_IDS } from '../../../src/features/arvore-info/domain.ts';

describe('arvore-info section preference contract', () => {
    it('uses the canonical storage key', () => {
        expect(PREFERENCE_STORAGE_KEY).toBe('configViewFlashPanelArvorePro');
    });

    it('defaults to all sections when storage is missing', () => {
        const ids = readEnabledSectionIds({});
        expect(ids.size).toBe(PANEL_SECTION_IDS.length);
    });

    it('filters to recognized Personalizar labels only', () => {
        const checker = createSectionEnabledChecker({
            localStorageRestorePro: () => [['Atribuição'], ['Interessados'], ['Ghost']]
        });
        expect(checker('responsaveis')).toBe(true);
        expect(checker('interessados')).toBe(true);
        expect(checker('marcador')).toBe(false);
        expect(checker('anotacoes')).toBe(false);
    });

    it('treats empty array as all enabled', () => {
        const checker = createSectionEnabledChecker({
            localStorageRestorePro: () => []
        });
        expect(checker('anotacoes')).toBe(true);
        expect(checker('observacoes')).toBe(true);
    });
});
