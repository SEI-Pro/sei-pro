import { describe, it, expect } from 'vitest';
import {
    sticknoteChecklistClass,
    buildChecklistTooltipHtml,
    buildSticknoteHomeRecord,
    parseSticknoteHomeAttributes,
    buildSticknoteCardHtml
} from '../../../src/features/anotacao-controle/domain.js';

describe('anotacao-controle domain — buildSticknoteHomeRecord', () => {
    it('retorna false sem protocolo, evitando registros órfãos', () => {
        expect(buildSticknoteHomeRecord('', 'texto', 'usuário')).toBe(false);
    });

    it('preserva o payload legado e normaliza quebras/NBSP do texto', () => {
        expect(buildSticknoteHomeRecord('123', '  linha 1\\r\\n\\r\\nlinha 2  ', null))
            .toEqual({
                id_protocolo: '123',
                usertip: '',
                texttip: ['linha 1', 'linha 2'].join(String.fromCharCode(10, 10))
            });
    });

    it('preserva usuário válido e aceita protocolo numérico', () => {
        expect(buildSticknoteHomeRecord(456, 'anotação', 'Maria'))
            .toEqual({ id_protocolo: 456, usertip: 'Maria', texttip: 'anotação' });
    });
});

describe('anotacao-controle domain — sticknoteChecklistClass', () => {
    it('vazio quando não é item de checklist', () => {
        expect(sticknoteChecklistClass({ isItem: false, checked: false, text: 'oi' })).toBe('');
    });
    it('classe simples para item pendente', () => {
        expect(sticknoteChecklistClass({ isItem: true, checked: false, text: 'a' }))
            .toBe(' class="stickNoteCheck"');
    });
    it('classe com checked para item concluído', () => {
        expect(sticknoteChecklistClass({ isItem: true, checked: true, text: 'a' }))
            .toBe(' class="stickNoteCheck stickNoteChecked"');
    });
});

describe('anotacao-controle domain — buildChecklistTooltipHtml', () => {
    it('mantém linhas comuns inalteradas', () => {
        expect(buildChecklistTooltipHtml('linha simples')).toBe('linha simples');
    });
    it('concatena linhas com join vazio (newlines não viram separador no tooltip)', () => {
        // Comportamento verbatim do legado: $.map(...).join('') — linhas em branco
        // viram '' e somem; linhas comuns são concatenadas sem separador.
        expect(buildChecklistTooltipHtml('a\n\nb')).toBe('ab');
    });
    it('renderiza item pendente com ícone de quadrado vazio (aspas escapadas)', () => {
        expect(buildChecklistTooltipHtml('[ ] tarefa'))
            .toBe('<div><i class=\\"far fa-square\\"></i> tarefa</div>');
    });
    it('renderiza item concluído com risco e check', () => {
        expect(buildChecklistTooltipHtml('[X] feito'))
            .toBe('<div style=\\"text-decoration: line-through;\\"><i class=\\"fas fa-check-square\\"></i> feito</div>');
    });
});

describe('anotacao-controle domain — helpers de render/view', () => {
    it('prioriza aria-label e normaliza texto e usuário', () => {
        expect(parseSticknoteHomeAttributes(
            'Anotação / ação / usuário em 01/02/2026 03:04',
            "infraTooltipMostrar('ignorado','ignorado')"
        )).toEqual({ text: 'ação', user: 'usuário' });
    });

    it('usa o tooltip legado quando não há aria-label válido', () => {
        expect(parseSticknoteHomeAttributes(
            '',
            "infraTooltipMostrar('linha 1\\nlinha 2','Maria')"
        )).toEqual({ text: ['linha 1', 'linha 2'].join(String.fromCharCode(92, 110)), user: 'Maria' });
    });

    it('retorna false quando não existem atributos utilizáveis', () => {
        expect(parseSticknoteHomeAttributes('', null)).toBe(false);
    });

    it('monta card puro e injeta apenas a transformação recebida', () => {
        expect(buildSticknoteCardHtml('[ ] tarefa\n\nfeito', (text) => '[' + text + ']'))
            .toBe('<div class="stickNoteCheck">[tarefa]</div><div><br></div><div>[feito]</div>');
    });
});
