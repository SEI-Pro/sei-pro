import { describe, it, expect } from 'vitest';
import { sticknoteChecklistClass, buildChecklistTooltipHtml } from '../../../src/features/anotacao-controle/domain.js';

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
