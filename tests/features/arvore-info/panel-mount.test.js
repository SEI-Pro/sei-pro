// @vitest-environment jsdom
/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import { buildPanelSection } from '../../../src/features/arvore-info/panel.ts';

describe('arvore-info panel mount helpers', () => {
    it('buildPanelSection creates a single section without innerHTML', () => {
        const el = buildPanelSection(document, {
            type: 'interessados',
            icon: 'fa-users',
            title: 'Interessados:',
            bodyClass: 'seipro-interessados-body'
        });
        expect(el.classList.contains('panelDadosArvore')).toBe(true);
        expect(el.dataset.type).toBe('interessados');
        expect(el.querySelector('.seipro-interessados-body')?.textContent).toContain('carregando');
        expect(el.querySelectorAll('.panelDadosArvore').length).toBe(0);
        expect(el.querySelector('.seipro-infoarvore-head')).toBeTruthy();
    });

    it('buildPanelSection can omit loading placeholder', () => {
        const el = buildPanelSection(document, {
            type: 'responsaveis',
            icon: 'fa-user-tie',
            title: 'Atribuição:',
            loading: false
        });
        expect(el.querySelector('.infoDadosArvore')?.textContent).toBe('');
    });

    it('does not duplicate when caller checks existing panels', () => {
        const host = document.createElement('div');
        host.id = 'frmArvore';
        document.body.appendChild(host);
        const first = buildPanelSection(document, {
            type: 'marcador',
            icon: 'fa-bookmark',
            title: 'Marcador:'
        });
        host.appendChild(first);
        expect(host.querySelectorAll('.panelDadosArvore').length).toBe(1);
        if (!host.querySelector('.panelDadosArvore')) {
            host.appendChild(buildPanelSection(document, {
                type: 'marcador',
                icon: 'fa-bookmark',
                title: 'Marcador:'
            }));
        }
        expect(host.querySelectorAll('.panelDadosArvore').length).toBe(1);
        host.remove();
    });
});
