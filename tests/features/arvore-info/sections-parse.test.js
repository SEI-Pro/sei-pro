// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { parseMarcadorItems } from '@src/features/arvore-info/sections/marcador.js';
import { parseAcompItems } from '@src/features/arvore-info/sections/acompanhamento.js';
import { getAcessoText, getInteressadosTexts } from '@src/features/arvore-info/sections/consulta.js';
import { parseAtribuicaoItemsFromDoc } from '@src/features/arvore-info/sections/atribuicao.js';

/**
 * Testes da camada de DOM das seções (jsdom) — fecham a lacuna "parse-from-doc não
 * testado". Cada parser recebe um `document` (como o vindo de fetchPage) e extrai a
 * estrutura. Usa HTML realista do SEI como fixture.
 */
function doc(html) {
  return new DOMParser().parseFromString(html, 'text/html');
}

describe('marcador.parseMarcadorItems', () => {
  it('layout tabela (SEI 4.1+): extrai id/icon/tag/nota/user', () => {
    const d = doc(`<table class="infraTable">
      <tr><th>a</th><th>b</th><th>c</th><th>d</th></tr>
      <tr>
        <td>1</td>
        <td><img src="ic.png"><a title="Urgente">Urgente</a><a onclick="acaoRemover('99','Urgente')">x</a></td>
        <td>Observação aqui</td>
        <td>fulano</td>
      </tr>
    </table>`);
    expect(parseMarcadorItems(d)).toEqual([
      { id: '99', iconSrc: 'ic.png', tag: 'Urgente', note: 'Observação aqui', user: 'fulano' },
    ]);
  });

  it('fallback form single-marcador (sem tabela)', () => {
    const d = doc(`<select id="selMarcador"><option selected data-imagesrc="i.png">Tag1</option></select>
                   <textarea id="txaTexto">nota</textarea>`);
    const items = parseMarcadorItems(d);
    expect(items.length).toBe(1);
    expect(items[0]).toMatchObject({ id: null, iconSrc: 'i.png', tag: 'Tag1', note: 'nota', user: '' });
  });

  it('sem marcador → []', () => {
    expect(parseMarcadorItems(doc('<div>nada</div>'))).toEqual([]);
  });
});

describe('acompanhamento.parseAcompItems', () => {
  it('extrai id (acaoExcluir)/grupo/obs/user/date', () => {
    const d = doc(`<table class="infraTable">
      <tr><th>h</th></tr>
      <tr>
        <td><a onclick="acaoExcluir(12, 'grp')">x</a></td>
        <td>GrupoA</td><td>Obs acomp</td><td>beltrano</td><td>01/02/2026</td>
      </tr>
    </table>`);
    expect(parseAcompItems(d)).toEqual([
      { id: '12', grupo: 'GrupoA', obs: 'Obs acomp', user: 'beltrano', date: '01/02/2026' },
    ]);
  });

  it('id via checkbox quando não há acaoExcluir', () => {
    const d = doc(`<table class="infraTable"><tr><th>h</th></tr>
      <tr><td><input type="checkbox" name="chkItem" value="77"></td><td>G</td><td>O</td></tr></table>`);
    expect(parseAcompItems(d)[0].id).toBe('77');
  });
});

describe('consulta.getAcessoText', () => {
  it('Restrito anexa a hipótese legal', () => {
    const d = doc(`<input type="radio" name="rdoNivelAcesso" value="1" checked>
                   <select id="selHipoteseLegal"><option selected>Informação Pessoal</option></select>`);
    expect(getAcessoText(d).text).toBe('Restrito: Informação Pessoal');
  });
  it('Público (0) sem hipótese', () => {
    const d = doc(`<input type="radio" name="rdoNivelAcesso" value="0" checked>`);
    expect(getAcessoText(d).text).toBe('Público');
  });
});

describe('consulta.getInteressadosTexts', () => {
  it('separa nome/(unidade) e lista todos', () => {
    const d = doc(`<select id="selInteressados">
      <option>Fulano (NUAP-DF)</option>
      <option>Beltrano</option>
    </select>`);
    expect(getInteressadosTexts(d)).toEqual(['Fulano', 'NUAP-DF', 'Beltrano']);
  });
});

describe('atribuicao.parseAtribuicaoItemsFromDoc', () => {
  it('parseia Nos[0].html, separa por <br /> e marca não-atribuído via ancoraSigla', () => {
    const d = doc(`<script>var x=1; Nos[0].html = '<a class="ancoraSigla">NUAP</a> Aberto<br />atribuído para Fulano';</script>`);
    expect(parseAtribuicaoItemsFromDoc(d)).toEqual([
      { text: 'NUAP Aberto', unassigned: true },
      { text: 'atribuído para Fulano', unassigned: false },
    ]);
  });
});
