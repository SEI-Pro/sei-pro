import { describe, expect, it } from 'vitest';
import { loadSeiUrls } from '../helpers/load-seipro.js';

describe('SEI URL helpers', () => {
    it('builds query strings', () => {
        const SeiPro = loadSeiUrls();
        expect(SeiPro.sei.urls.buildQuery({ acao: 'procedimento_controlar', id: 10 })).toBe(
            'acao=procedimento_controlar&id=10'
        );
    });

    it('appends query parameters to base URLs', () => {
        const SeiPro = loadSeiUrls();
        const url = SeiPro.sei.urls.appendQuery('https://sei/controlador.php', { acao: 'arvore_visualizar' });
        expect(url).toBe('https://sei/controlador.php?acao=arvore_visualizar');
    });
});
