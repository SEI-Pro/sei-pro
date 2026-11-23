/**
 * Tema personalizado: o tema do SEI como ponto de partida, com cores e bordas à escolha.
 *
 * Por que a tabela personalizada sai SEM a classe do tema: a folha `infra-doc-tabela__*` força tudo com
 * `!important` (`border:none!important` e as bordas do tema, `background-color:transparent!important`). O
 * CK5 grava a borda em atalho (`border-top:1pt solid #000`) e, ao reabrir, descarta um `!important` ali
 * dentro: a borda escolhida não sobreviveria ao tema. Então o visual do tema é gravado célula a célula
 * (bordas, fundo do cabeçalho, listras, cor do texto do cabeçalho), editável e sem `!important`. Bônus: o
 * "Gerar PDF" do SEI (wkhtmltopdf) não desenha as listras dos temas (`:before` + `inset` + `:has`), e a
 * cor gravada na célula ele desenha.
 *
 * As listras são gravadas como `rgb(r,g,b)` sem espaços: é a marca de que a cor é desta ferramenta (o
 * navegador e o Word gravam `rgb(r, g, b)` com espaço ou `#rrggbb`). Com ela o post-fixer refaz a zebra
 * pela 1ª coluna depois de mesclar ou inserir linhas, sem guardar nada além das próprias cores.
 */

import { type Desenho, desenhoPadrao, PREDEFINIDAS } from './bordas';
import { type Celula, colunasDasCelulas, gruposPelaPrimeiraColuna, ZEBRAS } from './zebra';

export interface Personalizacao {
  /** Fundo das linhas (e da coluna) de cabeçalho; vazio = sem fundo. */
  cabecalhoCor: string;
  /** Cor das listras; vazio = sem listras. */
  listrasCor: string;
  /** O 1º grupo do corpo é listrado? */
  primeiroListrado: boolean;
  /** 1ª coluna também é cabeçalho (temas `zcf…`). */
  colunaCabecalho: boolean;
}

export const BRANCO_HEX = '#ffffff';

/** Visual de cada tema do SEI 5.0.5 (folha `infra-doc-tabela__*`), para começar a personalização. */
interface Base {
  cabecalhoCor: string;
  listras: boolean;
  /** Bordas do tema no modelo do Word (uma espessura só; o tema "elegante" tem 2px por fora e 1px dentro). */
  bordas: Pick<Desenho, 'ligadas' | 'traco'>;
}
const fina = (cor: string) => ({ estilo: 'solid' as const, larguraPt: 0.75, cor });
const BASES: Record<string, Base> = {
  'infra-doc-tabela__zcb': { cabecalhoCor: '#e5e5e5', listras: true, bordas: { ligadas: { ...PREDEFINIDAS.todas }, traco: fina('#000000') } },
  'infra-doc-tabela__elegante': {
    cabecalhoCor: '',
    listras: true,
    bordas: { ligadas: { ...PREDEFINIDAS.nenhuma, superior: true, inferior: true, horizontal: true }, traco: fina('#000000') },
  },
  'infra-doc-tabela__zcbplepcsf': { cabecalhoCor: '', listras: true, bordas: { ligadas: { ...PREDEFINIDAS.todas }, traco: fina('#000000') } },
  'infra-doc-tabela__zcbeplcfp': { cabecalhoCor: '#000000', listras: true, bordas: { ligadas: { ...PREDEFINIDAS.todas }, traco: fina('#999999') } },
  'infra-doc-tabela__zcfcbplpccfp': { cabecalhoCor: '#000000', listras: true, bordas: { ligadas: { ...PREDEFINIDAS.todas }, traco: fina('#999999') } },
  'infra-doc-tabela__zcbeplcfc': { cabecalhoCor: '#999999', listras: true, bordas: { ligadas: { ...PREDEFINIDAS.todas }, traco: fina('#000000') } },
  'infra-doc-tabela__zcfcbplepccfc': { cabecalhoCor: '#999999', listras: true, bordas: { ligadas: { ...PREDEFINIDAS.todas }, traco: fina('#000000') } },
  'infra-doc-tabela__academico': {
    cabecalhoCor: '',
    listras: false,
    bordas: { ligadas: { ...PREDEFINIDAS.nenhuma, superior: true, inferior: true }, traco: { estilo: 'solid', larguraPt: 1.5, cor: '#000000' } },
  },
};

export const LISTRA_PADRAO = '#e5e5e5';

/** Personalização e bordas iniciais a partir de um tema (ou do zero, sem tema). */
export function partirDoTema(classe: string, cabecalhos: { coluna?: boolean } = {}, comCabecalho = true): { p: Personalizacao; bordas: Desenho } {
  const base = BASES[classe];
  const z = ZEBRAS[classe];
  const p: Personalizacao = {
    cabecalhoCor: base ? base.cabecalhoCor : '#e5e5e5',
    listrasCor: !base || base.listras ? LISTRA_PADRAO : '',
    primeiroListrado: z ? (comCabecalho ? z.cinzaComCabecalho : z.cinzaSemCabecalho) : false,
    colunaCabecalho: !!cabecalhos.coluna,
  };
  const bordas: Desenho = { ...desenhoPadrao(), ...(base ? { ligadas: { ...base.bordas.ligadas }, traco: { ...base.bordas.traco } } : {}) };
  return { p, bordas };
}

// ---------------------------------------------------------------- cores

export function hexValido(cor: string): string {
  return /^#[0-9a-f]{6}$/i.test(cor) ? cor.toLowerCase() : '';
}

/** `#e5e5e5` → `rgb(229,229,229)` (a marca das listras). */
export function paraMarca(hex: string): string {
  const v = hexValido(hex);
  if (!v) return '';
  const n = (i: number) => Number.parseInt(v.slice(i, i + 2), 16);
  return `rgb(${n(1)},${n(3)},${n(5)})`;
}

const MARCA = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/;
export function ehMarca(v: unknown): v is string {
  return typeof v === 'string' && MARCA.test(v);
}

export function deMarca(v: string): string {
  const m = MARCA.exec(v);
  if (!m) return '';
  return `#${[m[1], m[2], m[3]].map((x) => Math.min(255, Number(x)).toString(16).padStart(2, '0')).join('')}`;
}

/** Fundo escuro pede texto branco (luminância relativa, como no WCAG). */
export function escuro(hex: string): boolean {
  const v = hexValido(hex);
  if (!v) return false;
  const canal = (i: number) => {
    const c = Number.parseInt(v.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const l = 0.2126 * canal(1) + 0.7152 * canal(3) + 0.0722 * canal(5);
  return l < 0.4;
}

// ---------------------------------------------------------------- pintura

export interface Pintura {
  /** Fundo da célula; `null` = sem fundo desta ferramenta. */
  fundo: string | null;
  /** Célula de cabeçalho (linha ou coluna). */
  cabecalho: boolean;
}

/**
 * Fundo de cada célula: cabeçalho (linhas `cabecalho` e colunas `colunasCabecalho`) com a cor dele; corpo
 * em listras pela 1ª coluna, as duas cores com a marca `rgb(…)`.
 */
export function pinturaPersonalizada(
  linhas: Celula[][],
  cabecalho: number,
  colunasCabecalho: number,
  p: Pick<Personalizacao, 'cabecalhoCor' | 'listrasCor' | 'primeiroListrado'>,
): Pintura[][] {
  const grupos = gruposPelaPrimeiraColuna(linhas, cabecalho);
  const colunas = colunasDasCelulas(linhas);
  const cab = hexValido(p.cabecalhoCor) || null;
  const listra = paraMarca(p.listrasCor);
  const base = paraMarca(BRANCO_HEX);
  return linhas.map((linha, r) =>
    linha.map((_, i) => {
      if (grupos[r] < 0 || colunas[r][i] < colunasCabecalho) return { fundo: cab, cabecalho: true };
      if (!listra) return { fundo: null, cabecalho: false };
      return { fundo: (grupos[r] % 2 === 0) === p.primeiroListrado ? listra : base, cabecalho: false };
    }),
  );
}

/**
 * Lê de volta as listras de uma tabela personalizada: as duas cores marcadas do corpo e a fase (qual
 * cai no 1º grupo). Linha nova, sem cor, não atrapalha: a fase vem do 1º grupo que tem cor.
 */
export function lerListras(
  linhas: Celula[][],
  fundos: unknown[][],
  cabecalho: number,
  colunasCabecalho: number,
): Pick<Personalizacao, 'listrasCor' | 'primeiroListrado'> | null {
  const grupos = gruposPelaPrimeiraColuna(linhas, cabecalho);
  const colunas = colunasDasCelulas(linhas);
  const branca = paraMarca(BRANCO_HEX);
  let listra = '';
  let faseListra: number | undefined;
  let faseBranca: number | undefined;
  linhas.forEach((linha, r) =>
    linha.forEach((_, i) => {
      const f = fundos[r]?.[i];
      if (grupos[r] < 0 || colunas[r][i] < colunasCabecalho || !ehMarca(f)) return;
      if (f === branca) faseBranca ??= grupos[r] % 2;
      else {
        listra ||= f;
        faseListra ??= grupos[r] % 2;
      }
    }),
  );
  if (!listra) return null;
  const fase = faseListra ?? (faseBranca === undefined ? 0 : 1 - faseBranca);
  return { listrasCor: deMarca(listra), primeiroListrado: fase === 0 };
}
