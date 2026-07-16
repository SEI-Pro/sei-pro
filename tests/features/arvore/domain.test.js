import { describe, expect, it } from 'vitest';
import {
    resolveMenuCatalogs,
    resolveMenuSelection,
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles
} from '@src/features/arvore/domain.js';

const fallback = [['Copiar número'], ['Ações em lote']];

describe('arvore/domain — resolveMenuSelection', () => {
    it('preserva a forma legada e descarta entradas inválidas', () => {
        expect(resolveMenuSelection([['Copiar número', 'extra'], null, [' Ações em lote ']], fallback))
            .toEqual([['Copiar número'], [' Ações em lote ']]);
    });

    it('usa o catálogo padrão para seleção ausente ou vazia', () => {
        expect(resolveMenuSelection(undefined, fallback)).toBe(fallback);
        expect(resolveMenuSelection([], fallback)).toBe(fallback);
        expect(resolveMenuSelection([null, ['']], fallback)).toBe(fallback);
    });
});

describe('arvore/domain — resolveMenuCatalogs', () => {
    it('resolve cada catálogo independentemente', () => {
        const defaults = { process: fallback, document: [['Copiar nome']] };
        expect(resolveMenuCatalogs({ process: [['Copiar número']], document: [] }, defaults))
            .toEqual({ process: [['Copiar número']], document: [['Copiar nome']] });
    });
});

describe('arvore/domain — upload', () => {
    it('detecta arquivos em payloads de drag-and-drop', () => {
        expect(hasUploadFiles({ files: [{}] })).toBe(true);
        expect(hasUploadFiles({ types: ['text/plain', 'Files'] })).toBe(true);
        expect(hasUploadFiles({ types: ['text/plain'] })).toBe(false);
    });

    it('serializa o anexo com o contrato legado', () => {
        expect(serializeUploadAttachment(['42', 'nome arquivo.pdf', 'ignored', '12', '10:00'], {
            userUnidade: { user: 'u', unidade: 'x' }
        }, (size) => `${size} B`)).toBe('42%B1nome+arquivo.pdf%B110%3A00%B112%B112+B%B1u%B1x');
    });

    it('extrai extensões e ordena sem mutar a fila', () => {
        const files = [{ position: 2 }, { position: 1 }];
        expect(extractUploadExtensions(['arrExt = "pdf";', 'arrExt = "docx";']))
            .toEqual(['.pdf', '.docx']);
        expect(sortUploadFiles(files, (file) => file.position))
            .toEqual([{ position: 1 }, { position: 2 }]);
        expect(files).toEqual([{ position: 2 }, { position: 1 }]);
    });
});
