import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchSticknotePriority } from '../../../src/features/anotacao-controle/io.js';

afterEach(() => {
    vi.restoreAllMocks();
});

function stubDomParser() {
    vi.stubGlobal('DOMParser', class FakeDOMParser {
        parseFromString(html) {
            return {
                querySelector(selector) {
                    if (selector !== '#chkSinPrioridade' || !html.includes('chkSinPrioridade')) {
                        return null;
                    }
                    return { checked: html.includes('checked') };
                }
            };
        }
    });
}

describe('anotacao-controle/io — fetchSticknotePriority', () => {
    it('busca a página same-origin e lê checkbox marcado', async () => {
        stubDomParser();
        const text = vi.fn().mockResolvedValue(
            '<form><input id="chkSinPrioridade" type="checkbox" checked></form>'
        );
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ text }));

        await expect(fetchSticknotePriority('/controlador.php?acao=anotacao_registrar&id=123'))
            .resolves.toBe(true);
        expect(fetch).toHaveBeenCalledWith(
            '/controlador.php?acao=anotacao_registrar&id=123',
            { credentials: 'same-origin' }
        );
        expect(text).toHaveBeenCalledOnce();
    });

    it('retorna false quando a página não contém checkbox de prioridade', async () => {
        stubDomParser();
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            text: vi.fn().mockResolvedValue('<html><body>sem checkbox</body></html>')
        }));

        await expect(fetchSticknotePriority('/anotacao')).resolves.toBe(false);
    });

    it('propaga falha de transporte sem transformar em prioridade', async () => {
        const error = new Error('network');
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error));

        await expect(fetchSticknotePriority('/anotacao')).rejects.toBe(error);
    });
});
