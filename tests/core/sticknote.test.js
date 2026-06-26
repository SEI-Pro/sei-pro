import { describe, expect, it } from 'vitest';
import { loadCoreScripts } from '../helpers/load-core.js';

const sandbox = loadCoreScripts();
const { sticknote } = sandbox.SeiPro.core;

describe('core/sticknote — instalação e aliases', () => {
  it('expõe o módulo e os globais legados da página', () => {
    expect(typeof sticknote.parseSticknoteHomeLabel).toBe('function');
    expect(typeof sticknote.normalizeSticknoteHomeText).toBe('function');
    expect(typeof sticknote.parseSticknoteChecklistLine).toBe('function');
    expect(typeof sandbox.parseSticknoteHomeLabel).toBe('function');
    expect(typeof sandbox.normalizeSticknoteHomeText).toBe('function');
    expect(typeof sandbox.parseSticknoteChecklistLine).toBe('function');
  });
});

describe('parseSticknoteChecklistLine', () => {
  it('detecta item pendente [ ] e remove o marcador', () => {
    expect(sticknote.parseSticknoteChecklistLine('[ ] Verificar prazo'))
      .toEqual({ isItem: true, checked: false, text: 'Verificar prazo' });
  });

  it('detecta item concluído [X] e remove o marcador', () => {
    expect(sticknote.parseSticknoteChecklistLine('[X] Enviar ofício'))
      .toEqual({ isItem: true, checked: true, text: 'Enviar ofício' });
  });

  it('checked tem precedência quando ambos os marcadores aparecem', () => {
    expect(sticknote.parseSticknoteChecklistLine('[X] feito [ ] resto'))
      .toEqual({ isItem: true, checked: true, text: 'feito [ ] resto' });
  });

  it('linha comum (sem marcador) preserva o texto original', () => {
    expect(sticknote.parseSticknoteChecklistLine('texto livre'))
      .toEqual({ isItem: false, checked: false, text: 'texto livre' });
  });

  it('entrada não-string → item vazio', () => {
    expect(sticknote.parseSticknoteChecklistLine(undefined))
      .toEqual({ isItem: false, checked: false, text: '' });
  });
});

describe('parseSticknoteHomeLabel', () => {
  it('extrai texto e usuário do rótulo completo', () => {
    const r = sticknote.parseSticknoteHomeLabel('Anotação / Verificar prazo / Fulano da Silva em 01/02/2026 14:30');
    expect(r).toEqual({ text: 'Verificar prazo', user: 'Fulano da Silva' });
  });

  it('aceita variação sem acentos (Anotacao/.../...)', () => {
    const r = sticknote.parseSticknoteHomeLabel('Anotacao / Texto / Beltrano em 31/12/2025 09:05');
    expect(r).toEqual({ text: 'Texto', user: 'Beltrano' });
  });

  it('não trunca anotação que é uma data (barra interna não é separador)', () => {
    const r = sticknote.parseSticknoteHomeLabel('Anotação / 25/06/2026 / guimaraes em 26/06/2026 14:36');
    expect(r).toEqual({ text: '25/06/2026', user: 'guimaraes' });
  });

  it('preserva quebras de linha no texto (multilinha)', () => {
    const r = sticknote.parseSticknoteHomeLabel('Anotação / linha1\nlinha2 / User em 01/01/2026 00:00');
    expect(r.text).toBe('linha1\nlinha2');
    expect(r.user).toBe('User');
  });

  it('retorna false para rótulo vazio ou fora do formato', () => {
    expect(sticknote.parseSticknoteHomeLabel('')).toBe(false);
    expect(sticknote.parseSticknoteHomeLabel(undefined)).toBe(false);
    expect(sticknote.parseSticknoteHomeLabel('Qualquer coisa solta')).toBe(false);
  });
});

describe('normalizeSticknoteHomeText', () => {
  it('unifica diferentes quebras de linha em \\n', () => {
    expect(sticknote.normalizeSticknoteHomeText('a\r\nb\rc')).toBe('a\nb\nc');
    expect(sticknote.normalizeSticknoteHomeText('a\\r\\nb\\nc\\rd')).toBe('a\nb\nc\nd');
  });

  it('troca NBSP por espaço normal e apara bordas', () => {
    expect(sticknote.normalizeSticknoteHomeText('  a b  ')).toBe('a b');
  });

  it('colapsa 3+ linhas em branco para no máximo uma e remove espaço antes da quebra', () => {
    expect(sticknote.normalizeSticknoteHomeText('a   \n\n\n\nb')).toBe('a\n\nb');
  });

  it('entrada não-string → vazio', () => {
    expect(sticknote.normalizeSticknoteHomeText(undefined)).toBe('');
    expect(sticknote.normalizeSticknoteHomeText(null)).toBe('');
  });
});
