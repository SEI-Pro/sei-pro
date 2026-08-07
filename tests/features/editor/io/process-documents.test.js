import { describe, expect, it } from 'vitest';
import {
    buildProcessDocumentReference,
    listProcessDocuments,
    listComparableDocuments,
    processDocumentId
} from '../../../../src/features/editor/io/process-documents.ts';

describe('editor process documents', () => {
    it('uses the tree model when the legacy list is absent', () => {
        const source = {
            dadosProcessoPro: {
                treeModel: {
                    documents: [{ id_protocolo: '10', documento: 'Despacho', nr_sei: '123' }]
                }
            }
        };

        expect(listProcessDocuments(source)).toEqual(source.dadosProcessoPro.treeModel.documents);
    });

    it('merges legacy and tree-model documents without duplicates', () => {
        const source = {
            dadosProcessoPro: {
                listDocumentos: [{ id_protocolo: '10', documento: 'Despacho antigo' }],
                treeModel: {
                    documents: [
                        { id_protocolo: '10', nr_sei: '123' },
                        { id_protocolo: '11', documento: 'Informação' }
                    ]
                }
            }
        };

        expect(listProcessDocuments(source)).toEqual([
            { id_protocolo: '10', documento: 'Despacho antigo', nr_sei: '123' },
            { id_protocolo: '11', documento: 'Informação' }
        ]);
    });

    it('keeps comparable-document discovery on the canonical source', () => {
        const source = {
            location: { href: 'https://sei.example/sei/controlador.php?acao=editor_montar' },
            dadosProcessoPro: {
                treeModel: {
                    documents: [{ id_protocolo: '10', documento: 'Despacho' }],
                    linksAll: ['controlador.php?acao=arvore_visualizar&id_documento=10']
                }
            }
        };

        expect(listComparableDocuments(source)).toEqual([{
            id: '10',
            label: 'Despacho',
            src: 'https://sei.example/sei/controlador.php?acao=arvore_visualizar&id_documento=10'
        }]);
    });

    it('reproduces SEI linksei markup for document references', () => {
        const document = {
            id_documento: '85022190',
            nr_sei: '74875259',
            documento: 'Despacho 599'
        };

        expect(processDocumentId(document)).toBe('85022190');
        expect(buildProcessDocumentReference(document)).toBe(
            '<span contenteditable="false" data-cke-linksei="1" style="text-indent:0px;">'
            + '<a id="lnkSei85022190" class="ancora_sei" style="text-indent:0px;">74875259</a></span>'
        );
    });

    it('escapes document labels when building the native link markup', () => {
        expect(buildProcessDocumentReference({
            id_protocolo: '10',
            documento: 'Despacho & Informação <teste>'
        })).toContain('Despacho &amp; Informação &lt;teste&gt;');
    });
});
