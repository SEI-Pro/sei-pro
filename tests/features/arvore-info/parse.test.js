import { describe, expect, it } from 'vitest';
import { extractNosAcoesHtml, extractNosHtml } from '@src/features/arvore-info/parse/inline-payload.js';
import { isAtribuicaoUnassigned } from '@src/features/arvore-info/parse/atribuicao.js';
import { parseAcaoRemoverId } from '@src/features/arvore-info/parse/marcador.js';
import { acessoLabel, splitInteressado } from '@src/features/arvore-info/parse/consulta.js';
import { stripChecklistMarker, parseAnotLinePrefix } from '@src/features/arvore-info/parse/anotacao.js';

describe('inline-payload', () => {
  it('extractNosAcoesHtml: extrai e desescapa aspas/barra', () => {
    const script = "var x=1; Nos[0].acoes = '<a href=\\'/x\\'><img title=\\\"Marcador\\\"\\/></a>'; var y=2;";
    expect(extractNosAcoesHtml(script)).toBe('<a href=\'/x\'><img title="Marcador"/></a>');
  });

  it('extractNosAcoesHtml: sem casar → null', () => {
    expect(extractNosAcoesHtml('nada aqui')).toBe(null);
    expect(extractNosAcoesHtml(undefined)).toBe(null);
  });

  it('extractNosHtml: exige o marcador "Nos[0].html = " e captura até a 1ª aspa', () => {
    expect(extractNosHtml("Nos[0].html = 'João<br />Maria';")).toBe('João<br />Maria');
    expect(extractNosHtml("Nos[0].acoes = 'x';")).toBe(null); // só acoes → null
    expect(extractNosHtml(undefined)).toBe(null);
  });
});

describe('atribuicao.isAtribuicaoUnassigned', () => {
  it('não atribuído quando falta "atribuído para" E há sigla', () => {
    expect(isAtribuicaoUnassigned('NUAP-DF', true)).toBe(true);
  });
  it('atribuído (texto contém "atribuído para") → false', () => {
    expect(isAtribuicaoUnassigned('atribuído para Fulano', true)).toBe(false);
  });
  it('sem sigla → false', () => {
    expect(isAtribuicaoUnassigned('NUAP-DF', false)).toBe(false);
    expect(isAtribuicaoUnassigned('NUAP-DF', null)).toBe(false);
  });
});

describe('marcador.parseAcaoRemoverId', () => {
  it('extrai o id do onclick', () => {
    expect(parseAcaoRemoverId("acaoRemover('12345', 'Urgente')")).toBe('12345');
  });
  it('sem casar → null', () => {
    expect(parseAcaoRemoverId('outraCoisa()')).toBe(null);
    expect(parseAcaoRemoverId(null)).toBe(null);
  });
});

describe('consulta.acessoLabel', () => {
  it('mapeia 0/1/2', () => {
    expect(acessoLabel('0', '')).toBe('Público');
    expect(acessoLabel('1', '')).toBe('Restrito');
    expect(acessoLabel('2', '')).toBe('Sigiloso');
  });
  it('anexa hipótese só quando Restrito (1)', () => {
    expect(acessoLabel('1', 'Investigação')).toBe('Restrito: Investigação');
    expect(acessoLabel('2', 'Investigação')).toBe('Sigiloso'); // hipótese ignorada
  });
  it('null/vazio → ""; valor desconhecido devolve o próprio valor', () => {
    expect(acessoLabel(null, '')).toBe('');
    expect(acessoLabel('', '')).toBe('');
    expect(acessoLabel('9', '')).toBe('9');
  });
});

describe('consulta.splitInteressado', () => {
  it('separa nome e unidade', () => {
    expect(splitInteressado('Fulano (NUAP-DF)')).toEqual(['Fulano', 'NUAP-DF']);
  });
  it('sem parêntese → só o nome', () => {
    expect(splitInteressado('Fulano')).toEqual(['Fulano']);
  });
  it('descarta partes vazias', () => {
    expect(splitInteressado('()')).toEqual([]);
  });
});

describe('anotacao', () => {
  it('stripChecklistMarker remove só o prefixo [ ]/[X]', () => {
    expect(stripChecklistMarker('[X] feito')).toBe('feito');
    expect(stripChecklistMarker('[ ] pendente')).toBe('pendente');
    expect(stripChecklistMarker('comum [X] meio')).toBe('comum [X] meio');
  });
  it('parseAnotLinePrefix reconhece prefixo em posição 0', () => {
    expect(parseAnotLinePrefix('[X] a')).toEqual({ check: true, checked: true, rest: 'a' });
    expect(parseAnotLinePrefix('[ ] b')).toEqual({ check: true, checked: false, rest: 'b' });
    expect(parseAnotLinePrefix('texto')).toEqual({ check: false, checked: false, rest: 'texto' });
  });
});
