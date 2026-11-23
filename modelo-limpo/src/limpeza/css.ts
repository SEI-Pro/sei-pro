/**
 * Leitor mínimo de CSS para o que vem embutido no conteúdo de um modelo (Google Docs, Word, CK4).
 *
 * Não há CSSOM confiável aqui: o documento da limpeza vem de `DOMParser` (inerte) ou do linkedom nos
 * testes, e nenhum dos dois aplica folha de estilo. Então as regras são lidas como texto, e só os
 * seletores simples interessam: `.c2`, `h3`, `p.Classe`, listas `.lst-kix_x-0>li:before` (para o tipo
 * de numeração). Seletor composto (descendente, pseudo-classe, atributo) é ignorado: nada que o
 * Google Docs usa para formatar parágrafo depende deles.
 */

export type Propriedades = Record<string, string>;

export interface FolhaModelo {
  /** Propriedades por classe, na ordem em que aparecem (a última vence). */
  classes: Map<string, Propriedades>;
  /** Propriedades por elemento (`h1`, `p`, `li`…). */
  elementos: Map<string, Propriedades>;
  /** Numeração de cada classe de lista do Google Docs: `lst-kix_abc-0` → `{ tipo, sufixo }`. */
  listas: Map<string, Numeracao>;
}

export type TipoNumeracao = 'decimal' | 'lower-latin' | 'upper-latin' | 'lower-roman' | 'upper-roman' | 'disc';

export interface Numeracao {
  tipo: TipoNumeracao;
  /** O que vem depois do número no marcador, como `") "` ou `". "`. */
  sufixo: string;
}

const PROPRIEDADES_UTEIS = new Set([
  'text-align',
  'text-indent',
  'margin-left',
  'padding-left',
  'font-weight',
  'font-style',
  'text-decoration',
  'text-decoration-line',
  'text-transform',
  'border',
  'border-top-width',
  'border-bottom-width',
  'border-left-width',
  'border-right-width',
  'border-width',
  'border-style',
  'border-top-style',
  'list-style-type',
  'padding-top',
  'padding-bottom',
  'margin-top',
  'margin-bottom',
  'line-height',
]);

/** `margin: 10pt 0 6pt 2cm` → as quatro propriedades. O Word grava assim. */
function expandirMargem(valor: string): Propriedades {
  const v = valor.trim().split(/\s+/);
  const [topo, direita = topo, baixo = topo, esquerda = direita] = v;
  return { 'margin-top': topo, 'margin-right': direita, 'margin-bottom': baixo, 'margin-left': esquerda };
}

/** Declarações `a:b; c:d` → objeto, só com as propriedades que a limpeza usa. */
export function lerDeclaracoes(texto: string): Propriedades {
  const saida: Propriedades = {};
  for (const parte of texto.split(';')) {
    const i = parte.indexOf(':');
    if (i < 0) continue;
    const nome = parte.slice(0, i).trim().toLowerCase();
    const valor = parte
      .slice(i + 1)
      .replace(/!important/i, '')
      .trim();
    if (!nome || !valor) continue;
    if (nome === 'margin') {
      const m = expandirMargem(valor);
      for (const k of ['margin-top', 'margin-bottom', 'margin-left']) saida[k] = m[k];
    } else if (PROPRIEDADES_UTEIS.has(nome)) saida[nome] = valor;
  }
  return saida;
}

/** Tira comentários e blocos `@...{...}` (com chaves aninhadas), devolvendo só as regras de topo. */
function regrasDeTopo(css: string): Array<{ seletor: string; corpo: string }> {
  const limpo = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const regras: Array<{ seletor: string; corpo: string }> = [];
  let i = 0;
  while (i < limpo.length) {
    const abre = limpo.indexOf('{', i);
    if (abre < 0) break;
    const seletor = limpo.slice(i, abre).trim();
    let prof = 1;
    let j = abre + 1;
    while (j < limpo.length && prof > 0) {
      if (limpo[j] === '{') prof++;
      else if (limpo[j] === '}') prof--;
      j++;
    }
    const corpo = limpo.slice(abre + 1, j - 1);
    // `@import url(...);` antes de uma regra fica grudado no seletor: corta até o último `;`.
    const semImport = seletor.includes(';') ? seletor.slice(seletor.lastIndexOf(';') + 1).trim() : seletor;
    if (!semImport.startsWith('@')) regras.push({ seletor: semImport, corpo });
    i = j;
  }
  return regras;
}

const TIPOS: Record<string, TipoNumeracao> = {
  decimal: 'decimal',
  'lower-latin': 'lower-latin',
  'lower-alpha': 'lower-latin',
  'upper-latin': 'upper-latin',
  'upper-alpha': 'upper-latin',
  'lower-roman': 'lower-roman',
  'upper-roman': 'upper-roman',
  disc: 'disc',
  circle: 'disc',
  square: 'disc',
};

export function tipoNumeracao(valor: string | null | undefined): TipoNumeracao | undefined {
  if (!valor) return undefined;
  // Atributo `type` do <ol>: diferencia caixa ("a" e "A", "i" e "I").
  const bruto = valor.trim();
  const porAtributo: Record<string, TipoNumeracao> = { a: 'lower-latin', A: 'upper-latin', i: 'lower-roman', I: 'upper-roman', '1': 'decimal' };
  if (porAtributo[bruto]) return porAtributo[bruto];
  return TIPOS[bruto.toLowerCase()];
}

/** Lê todas as folhas `<style>` do fragmento numa só, na ordem do documento. */
export function lerFolha(textos: string[]): FolhaModelo {
  const folha: FolhaModelo = { classes: new Map(), elementos: new Map(), listas: new Map() };
  for (const texto of textos) {
    for (const { seletor, corpo } of regrasDeTopo(texto)) {
      for (const sel of seletor.split(',').map((s) => s.trim())) {
        // Marcador de lista do Google Docs: `.lst-kix_abc-0>li:before{content:"" counter(x,lower-roman) ") "}`.
        const lista = /^\.(lst-kix_[\w-]+-\d+)\s*>\s*li:+before$/.exec(sel);
        if (lista) {
          const m = /counter\([^,)]+,\s*([a-z-]+)\)\s*"([^"]*)"/.exec(corpo);
          const tipo = m ? tipoNumeracao(m[1]) : /content:\s*"\\?[^"]*(\u25cf|\u25cb|\u25a0|\\25cf|\\25cb|\\25a0|\u2022)/.test(corpo) ? 'disc' : undefined;
          if (tipo) folha.listas.set(lista[1], { tipo, sufixo: m ? m[2] : ' ' });
          continue;
        }
        const props = lerDeclaracoes(corpo);
        if (!Object.keys(props).length) continue;
        const classe = /^(?:[a-z][a-z0-9]*)?\.([\w-]+)$/i.exec(sel);
        if (classe) {
          folha.classes.set(classe[1], { ...folha.classes.get(classe[1]), ...props });
          continue;
        }
        if (/^[a-z][a-z0-9]*$/i.test(sel)) {
          const tag = sel.toLowerCase();
          folha.elementos.set(tag, { ...folha.elementos.get(tag), ...props });
        }
      }
    }
  }
  return folha;
}

/** Converte um comprimento CSS em pontos. `NaN` quando não dá para saber. */
export function emPontos(valor: string | undefined): number {
  if (!valor) return Number.NaN;
  const m = /^(-?[\d.]+)\s*(pt|px|cm|mm|in|em|rem|pc)?$/i.exec(valor.trim().split(/\s+/)[0]);
  if (!m) return Number.NaN;
  const n = Number.parseFloat(m[1]);
  switch ((m[2] ?? 'px').toLowerCase()) {
    case 'pt':
      return n;
    case 'px':
      return n * 0.75;
    case 'cm':
      return (n * 72) / 2.54;
    case 'mm':
      return (n * 72) / 25.4;
    case 'in':
      return n * 72;
    case 'pc':
      return n * 12;
    default:
      return n * 12; // em/rem sobre 12pt, o corpo de texto do SEI
  }
}

export function negrito(p: Propriedades): boolean | undefined {
  const v = p['font-weight']?.toLowerCase();
  if (!v) return undefined;
  if (v === 'bold' || v === 'bolder') return true;
  if (v === 'normal' || v === 'lighter') return false;
  const n = Number.parseInt(v, 10);
  return Number.isNaN(n) ? undefined : n >= 600;
}

export function italico(p: Propriedades): boolean | undefined {
  const v = p['font-style']?.toLowerCase();
  if (!v) return undefined;
  return v === 'italic' || v === 'oblique';
}

export function sublinhado(p: Propriedades): boolean | undefined {
  const v = (p['text-decoration-line'] ?? p['text-decoration'])?.toLowerCase();
  if (!v) return undefined;
  return v.includes('underline');
}
