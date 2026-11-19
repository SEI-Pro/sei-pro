/**
 * Bordas desenhadas como no Word: superior, inferior, esquerda, direita, horizontais e verticais internas
 * de uma região (a tabela inteira ou as células selecionadas).
 *
 * Por que gravar em cada célula: a folha do SEI desenha a grade das células com um seletor `:is(...)`. O
 * "Gerar PDF" do SEI (wkhtmltopdf 0.12.6, WebKit de 2012) não conhece `:is` e descarta a regra: no PDF só
 * sobra a borda externa cinza da tabela. Borda gravada no `<td>` (`border-top: 1pt solid #000`…) sai na
 * tela, na impressão e no PDF.
 *
 * Como as bordas são "coladas" (`border-collapse`), a aresta entre duas células é das duas: ao desenhar
 * (ou apagar) a borda de fora da região, a célula vizinha recebe o mesmo lado, senão a borda dela vence.
 *
 * Aqui só contas; a gravação no model está em editor.ts.
 */

import { type Celula, colunasDasCelulas } from './zebra';

export type Borda = 'superior' | 'inferior' | 'esquerda' | 'direita' | 'horizontal' | 'vertical';
export const BORDAS: readonly Borda[] = ['superior', 'inferior', 'esquerda', 'direita', 'horizontal', 'vertical'];
export type Ligadas = Record<Borda, boolean>;

export type EstiloLinha = 'solid' | 'dashed' | 'dotted' | 'double';
export interface Traco {
  estilo: EstiloLinha;
  /** Em pt, como no Word. */
  larguraPt: number;
  /** `#rrggbb`. */
  cor: string;
}

export interface Desenho {
  /** `selecao` só vale quando há mais de uma célula selecionada. */
  onde: 'tabela' | 'selecao';
  ligadas: Ligadas;
  traco: Traco;
}

const tudo = (v: boolean): Ligadas => ({ superior: v, inferior: v, esquerda: v, direita: v, horizontal: v, vertical: v });
export const PREDEFINIDAS = {
  todas: tudo(true),
  externas: { ...tudo(true), horizontal: false, vertical: false },
  internas: { ...tudo(false), horizontal: true, vertical: true },
  nenhuma: tudo(false),
} as const satisfies Record<string, Ligadas>;

export const ESPESSURAS_PT = [0.5, 0.75, 1, 1.5, 2.25, 3] as const;
/** Dupla precisa de espaço para as duas linhas e o vão. */
export const MIN_DUPLA_PT = 2.25;

export function tracoValido(t: Traco): Traco {
  const cor = /^#[0-9a-f]{6}$/i.test(t.cor) ? t.cor.toLowerCase() : '#000000';
  const larguraPt = Math.min(6, Math.max(0.25, Number.isFinite(t.larguraPt) ? t.larguraPt : 1));
  return { estilo: t.estilo, cor, larguraPt: t.estilo === 'double' ? Math.max(MIN_DUPLA_PT, larguraPt) : larguraPt };
}

export function desenhoPadrao(): Desenho {
  return { onde: 'tabela', ligadas: { ...PREDEFINIDAS.todas }, traco: { estilo: 'solid', larguraPt: 1, cor: '#000000' } };
}

/** Faixa de linhas e colunas da grade (inclusiva). */
export interface Caixa {
  r0: number;
  c0: number;
  r1: number;
  c1: number;
}

export function caixasDasCelulas(linhas: Celula[][]): Caixa[][] {
  const colunas = colunasDasCelulas(linhas);
  return linhas.map((linha, r) =>
    linha.map((cel, i) => ({
      r0: r,
      c0: colunas[r][i],
      r1: Math.min(linhas.length - 1, r + Math.max(1, cel.rowspan || 1) - 1),
      c1: colunas[r][i] + Math.max(1, cel.colspan || 1) - 1,
    })),
  );
}

/** Caixa que envolve as células escolhidas (`[linha, índice]`); sem escolha, a tabela inteira. */
export function regiaoDe(caixas: Caixa[][], escolhidas?: Array<[number, number]>): Caixa | null {
  const lista = escolhidas?.length ? escolhidas.map(([r, i]) => caixas[r]?.[i]).filter(Boolean) : caixas.flat();
  if (!lista.length) return null;
  return {
    r0: Math.min(...lista.map((c) => c.r0)),
    c0: Math.min(...lista.map((c) => c.c0)),
    r1: Math.max(...lista.map((c) => c.r1)),
    c1: Math.max(...lista.map((c) => c.c1)),
  };
}

export type Lado = 'top' | 'right' | 'bottom' | 'left';
export const LADOS: readonly Lado[] = ['top', 'right', 'bottom', 'left'];
export type LadosLigados = Partial<Record<Lado, boolean>>;

const cruza = (a0: number, a1: number, b0: number, b1: number) => a0 <= b1 && b0 <= a1;

/**
 * Para cada célula, os lados que mudam (true = com borda, false = sem). Lado ausente fica como está.
 */
export function ladosDasCelulas(caixas: Caixa[][], regiao: Caixa, ligadas: Ligadas): LadosLigados[][] {
  return caixas.map((linha) =>
    linha.map((c) => {
      const dentro = c.r0 >= regiao.r0 && c.r1 <= regiao.r1 && c.c0 >= regiao.c0 && c.c1 <= regiao.c1;
      if (dentro) {
        return {
          top: c.r0 === regiao.r0 ? ligadas.superior : ligadas.horizontal,
          bottom: c.r1 === regiao.r1 ? ligadas.inferior : ligadas.horizontal,
          left: c.c0 === regiao.c0 ? ligadas.esquerda : ligadas.vertical,
          right: c.c1 === regiao.c1 ? ligadas.direita : ligadas.vertical,
        };
      }
      // Vizinha de fora: só o lado encostado na região.
      const lados: LadosLigados = {};
      const colunas = cruza(c.c0, c.c1, regiao.c0, regiao.c1);
      const linhas = cruza(c.r0, c.r1, regiao.r0, regiao.r1);
      if (colunas && c.r1 === regiao.r0 - 1) lados.bottom = ligadas.superior;
      if (colunas && c.r0 === regiao.r1 + 1) lados.top = ligadas.inferior;
      if (linhas && c.c1 === regiao.c0 - 1) lados.right = ligadas.esquerda;
      if (linhas && c.c0 === regiao.c1 + 1) lados.left = ligadas.direita;
      return lados;
    }),
  );
}

export type ValorLados = string | Partial<Record<Lado, string>>;

/**
 * Junta lados novos ao valor do CK5 (texto = os 4 lados iguais; objeto = por lado). Quatro lados iguais
 * voltam a ser texto, como o próprio CK5 grava.
 */
export function mesclarLados(atual: unknown, novos: Partial<Record<Lado, string>>): ValorLados | undefined {
  const base: Partial<Record<Lado, string>> =
    typeof atual === 'string'
      ? { top: atual, right: atual, bottom: atual, left: atual }
      : atual && typeof atual === 'object'
        ? { ...(atual as Partial<Record<Lado, string>>) }
        : {};
  const junto: Partial<Record<Lado, string>> = { ...base, ...novos };
  const valores = LADOS.map((l) => junto[l]);
  if (valores.every((v) => v === undefined)) return undefined;
  if (valores.every((v) => v !== undefined && v === valores[0])) return valores[0];
  return junto;
}

/** Valores de estilo, cor e largura de cada lado que muda. */
export function valoresDosLados(lados: LadosLigados, traco: Traco): { estilo: Partial<Record<Lado, string>>; cor: Partial<Record<Lado, string>>; largura: Partial<Record<Lado, string>> } {
  const t = tracoValido(traco);
  const estilo: Partial<Record<Lado, string>> = {};
  const cor: Partial<Record<Lado, string>> = {};
  const largura: Partial<Record<Lado, string>> = {};
  for (const l of LADOS) {
    const v = lados[l];
    if (v === undefined) continue;
    estilo[l] = v ? t.estilo : 'none';
    cor[l] = t.cor;
    largura[l] = `${t.larguraPt}pt`;
  }
  return { estilo, cor, largura };
}

/** Texto CSS de um traço, para as prévias do diálogo. */
export function cssDoTraco(t: Traco): string {
  const v = tracoValido(t);
  return `${v.larguraPt}pt ${v.estilo} ${v.cor}`;
}
