import { describe, expect, it } from 'vitest';
import { loadCoreScripts } from '../helpers/load-core.js';

const sandbox = loadCoreScripts();
const { texto } = sandbox.SeiPro.core;

describe('core/texto — instalação e aliases', () => {
  it('expõe o módulo em SeiPro.core.texto e nos globais legados', () => {
    expect(typeof texto.escapeRegExp).toBe('function');
    expect(typeof sandbox.escapeRegExp).toBe('function');
    expect(typeof sandbox.pad).toBe('function');
    expect(typeof sandbox.replaceTextToUrl).toBe('function');
  });
});

describe('escapeRegExp', () => {
  it('escapa metacaracteres de regex', () => {
    expect(texto.escapeRegExp('a.b*c(d)')).toBe('a\\.b\\*c\\(d\\)');
  });
});

describe('escapeComponent', () => {
  it('codifica como escape() mas preserva "+" como %2B', () => {
    expect(texto.escapeComponent('a+b c')).toBe('a%2Bb%20c');
  });
});

describe('pad', () => {
  it('preenche à esquerda com zeros', () => {
    expect(texto.pad(7, 3)).toBe('007');
    expect(texto.pad(123, 2)).toBe('123');
  });
});

describe('extractHexColor', () => {
  it('extrai cores hex de um texto', () => {
    expect(texto.extractHexColor('cor #FFF e #1a2b3c aqui'))
      .toEqual(['#FFF', '#1a2b3c']);
  });
});

describe('replaceTextToUrl', () => {
  it('transforma URL em link <a>', () => {
    const out = texto.replaceTextToUrl('veja https://sei.prf.gov.br aqui');
    expect(out).toContain("<a href='https://sei.prf.gov.br'");
    expect(out).toContain("target='_blank'");
  });
});

describe('extractEmails', () => {
  it('extrai e-mails de um texto', () => {
    expect(texto.extractEmails('contatos: a@x.com e b.c@y.gov.br fim'))
      .toEqual(['a@x.com', 'b.c@y.gov.br']);
  });
});

describe('extractAllTextBetweenQuotes', () => {
  it('extrai trechos entre aspas simples', () => {
    expect(texto.extractAllTextBetweenQuotes("foo 'um' bar 'dois'")).toEqual(['um', 'dois']);
  });
  it('devolve [str] quando não há aspas', () => {
    expect(texto.extractAllTextBetweenQuotes('sem aspas')).toEqual(['sem aspas']);
  });
});

describe('extractOnlyAlphaNum', () => {
  it('mantém só alfanuméricos e espaços', () => {
    expect(texto.extractOnlyAlphaNum('Proc. 08675/2025-10!')).toBe('Proc 08675202510');
  });
});

describe('joinAnd', () => {
  it('junta com vírgulas e "e" final', () => {
    expect(texto.joinAnd(['a'])).toBe('a');
    expect(texto.joinAnd(['a', 'b'])).toBe('a e b');
    expect(texto.joinAnd(['a', 'b', 'c'])).toBe('a, b e c');
  });
});

describe('is_html', () => {
  it('detecta marcação HTML', () => {
    expect(texto.is_html('<p>oi</p>')).toBe(true);
    expect(texto.is_html('texto puro')).toBe(false);
  });
});

describe('normalizeHTML', () => {
  it('colapsa espaços e apara', () => {
    expect(texto.normalizeHTML('  a   b\n c  ')).toBe('a b c');
  });
});

describe('getHashTagsPro', () => {
  it('extrai hashtags', () => {
    expect(texto.getHashTagsPro('processo #urgente e #lote2')).toEqual(['urgente', 'lote2']);
  });
});

describe('normalizeNameTag', () => {
  it('remove acentos, espaços e símbolos, minúsculo', () => {
    expect(texto.normalizeNameTag('Ação Urgente!')).toBe('acaourgente');
  });
});

describe('normalizeMojibakeUtf8', () => {
  it('corrige UTF-8 lido como Latin-1', () => {
    // "ção" mal-decodificado vira "Ã§Ã£o"; deve voltar a "ção".
    const mojibake = 'Ã§Ã£o';
    expect(texto.normalizeMojibakeUtf8(mojibake)).toBe('ção');
  });

  it('devolve texto limpo intacto', () => {
    expect(texto.normalizeMojibakeUtf8('processo normal')).toBe('processo normal');
    expect(texto.normalizeMojibakeUtf8('')).toBe('');
  });

  // Contrato definitivo do conserto de codificação (acentos/cedilha/crase) usado
  // pela anotação na tela de controle. mojibake() reproduz "UTF-8 lido como Latin-1".
  const mojibake = (s) => Array.from(new TextEncoder().encode(s)).map((b) => String.fromCharCode(b)).join('');

  it('corrige acentos, cedilha e crase isolados', () => {
    for (const ch of ['à', 'á', 'ã', 'â', 'ç', 'é', 'ê', 'í', 'ó', 'õ', 'ú']) {
      expect(texto.normalizeMojibakeUtf8(mojibake(ch))).toBe(ch);
    }
  });

  it('corrige frases inteiras (datas e pontuação preservadas)', () => {
    expect(texto.normalizeMojibakeUtf8(mojibake('Informação: revisão até 25/06/2026')))
      .toBe('Informação: revisão até 25/06/2026');
    expect(texto.normalizeMojibakeUtf8(mojibake('crase à mão, ações e prazos')))
      .toBe('crase à mão, ações e prazos');
  });

  it('é idempotente (aplicar 2x = aplicar 1x)', () => {
    const once = texto.normalizeMojibakeUtf8(mojibake('coração à toa'));
    expect(texto.normalizeMojibakeUtf8(once)).toBe(once);
    expect(once).toBe('coração à toa');
  });

  it('NÃO corrompe texto já correto em UTF-8', () => {
    for (const ok of ['São Paulo', 'ção', 'Coração já certo', 'à vista', 'Revisar 25/06/2026']) {
      expect(texto.normalizeMojibakeUtf8(ok)).toBe(ok);
    }
  });
});

describe('core/texto — encoding hex/unicode', () => {
  it('encodeURI_toHex: espaço vira + e acentos viram %XX; resto intacto', () => {
    expect(texto.encodeURI_toHex('a b')).toBe('a+b');
    expect(texto.encodeURI_toHex('abc')).toBe('abc');
    expect(texto.encodeURI_toHex('ç')).toBe('%E7'); // ç = 0xE7
  });

  it('encodeJSON_toHex: acentos viram \\uXXXX', () => {
    expect(texto.encodeJSON_toHex('ç')).toBe('\\u00E7');
    expect(texto.encodeJSON_toHex('ab')).toBe('ab');
  });

  it('unicodeToChar reverte \\uXXXX e tolera vazio/null', () => {
    expect(texto.unicodeToChar('\\u00E7')).toBe('ç');
    expect(texto.unicodeToChar('')).toBe('');
    expect(texto.unicodeToChar(null)).toBe(null);
  });
});

describe('core/texto — normalize/getNrSei', () => {
  it('normalizeSignatureSelectionTextPro: sem acento, espaços colapsados, minúsculo', () => {
    expect(texto.normalizeSignatureSelectionTextPro('  Inspeção   Técnica ')).toBe('inspecao tecnica');
    expect(texto.normalizeSignatureSelectionTextPro(null)).toBe('');
  });
  it('getNrSei extrai número entre parênteses do nome do doc', () => {
    expect(texto.getNrSei('Despacho (123456)')).toBe('123456');
    expect(texto.getNrSei('SemEspaco')).toBe('');
  });
});
