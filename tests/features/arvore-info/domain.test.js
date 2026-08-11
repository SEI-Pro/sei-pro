import { describe, expect, it } from 'vitest';
import {
    PANEL_SECTION_IDS,
    PANEL_SECTION_LABELS,
    isPanelSectionId,
    isSectionEnabled,
    resolveEnabledSectionIds
} from '../../../src/features/arvore-info/domain.ts';

describe('arvore-info domain', () => {
    it('exposes the nine canonical section ids', () => {
        expect([...PANEL_SECTION_IDS]).toEqual([
            'anotacoes',
            'responsaveis',
            'marcador',
            'acompanhamento_especial',
            'tipo_procedimento',
            'interessados',
            'nivel_acesso',
            'assuntos',
            'observacoes'
        ]);
    });

    it('maps every id to a Personalizar Menu label', () => {
        for (const id of PANEL_SECTION_IDS) {
            expect(PANEL_SECTION_LABELS[id]).toBeTruthy();
        }
    });

    it('treats missing/empty preference as all sections enabled', () => {
        expect(resolveEnabledSectionIds(null).size).toBe(PANEL_SECTION_IDS.length);
        expect(resolveEnabledSectionIds(undefined).size).toBe(PANEL_SECTION_IDS.length);
        expect(resolveEnabledSectionIds([]).size).toBe(PANEL_SECTION_IDS.length);
    });

    it('enables only recognized labels and ignores unknown ids', () => {
        const enabled = resolveEnabledSectionIds([
            ['Atribuição'],
            ['Marcador'],
            ['Não Existe'],
            'Interessados'
        ]);
        expect([...enabled].sort()).toEqual(['interessados', 'marcador', 'responsaveis']);
        expect(isSectionEnabled('responsaveis', enabled)).toBe(true);
        expect(isSectionEnabled('anotacoes', enabled)).toBe(false);
        expect(isSectionEnabled('unknown', enabled)).toBe(true);
    });

    it('isPanelSectionId guards canonical ids', () => {
        expect(isPanelSectionId('marcador')).toBe(true);
        expect(isPanelSectionId('nope')).toBe(false);
    });
});
