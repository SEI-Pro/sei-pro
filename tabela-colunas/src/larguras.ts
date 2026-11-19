/**
 * Conta das larguras: tudo em % e sem SEI, para ser testado sozinho.
 *
 * Duas medidas:
 * - largura da TABELA em % da largura do texto (o espaço entre as margens da página);
 * - largura de cada COLUNA em % da tabela, somando sempre exatamente 100.
 *
 * É o formato que o próprio CKEditor 5 grava ao redimensionar (`<table style="width:80%">` e
 * `<colgroup><col style="width:25%">`); a folha do SEI põe `table-layout: fixed` nessas tabelas
 * (`.ck-table-resized`), então o navegador e o gerador de PDF obedecem às porcentagens em vez de
 * alargar a coluna pelo conteúdo. Conferido no Gerar PDF (wkhtmltopdf 0.12.6) e no Imprimir do
 * Chrome do SEI 5.0.5: diferença menor que 1 pt.
 */

/** Largura útil do texto na página A4 do SEI, medida no PDF gerado (35,7 pt a 561,4 pt). */
export const LARGURA_UTIL_PT = 525;

/**
 * Menor coluna que não vaza na impressão. A folha do SEI dá a toda célula `min-width: 2em` e
 * `padding: .2em` (12 pt de fonte: 24 + 4,8 pt), mais a borda. Coluna mais estreita que isso
 * empurra a tabela além da margem, mesmo com `table-layout: fixed`.
 */
export const MIN_COLUNA_PT = 30;

const CASAS = 2;
const FATOR = 10 ** CASAS;

export function arredondar(v: number): number {
  return Math.round(v * FATOR) / FATOR;
}

/**
 * Arredonda cada coluna a 2 casas e põe a sobra do arredondamento na maior coluna, para a soma dar
 * exatamente 100. Sem isso, 3 colunas de 33,33% somam 99,99% e o CKEditor redistribui sozinho.
 */
export function fechar(valores: number[], absorve?: number): number[] {
  if (!valores.length) return [];
  const r = valores.map(arredondar);
  const soma = r.reduce((a, b) => a + b, 0);
  const sobra = arredondar(100 - soma);
  if (sobra !== 0) {
    let alvo = absorve !== undefined && absorve >= 0 && absorve < r.length ? absorve : 0;
    if (absorve === undefined) for (let i = 1; i < r.length; i++) if (r[i] > r[alvo]) alvo = i;
    r[alvo] = arredondar(r[alvo] + sobra);
  }
  return r;
}

export function uniformes(n: number): number[] {
  if (n < 1) return [];
  return fechar(Array.from({ length: n }, () => 100 / n));
}

/**
 * Leva qualquer lista de larguras para % que somam 100. Valor ausente, zero ou inválido (coluna
 * "auto") recebe a média das conhecidas; sem nenhuma conhecida, fica tudo igual.
 */
export function normalizar(valores: Array<number | undefined>): number[] {
  const n = valores.length;
  if (!n) return [];
  const validos = valores.filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0);
  if (!validos.length) return uniformes(n);
  const media = validos.reduce((a, b) => a + b, 0) / validos.length;
  const cheios = valores.map((v) => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : media));
  const soma = cheios.reduce((a, b) => a + b, 0);
  return fechar(cheios.map((v) => (v / soma) * 100));
}

/** `"33.5%"` → 33.5. Medida que não é % (px, pt, auto) → `undefined`. */
export function lerPorcentagem(valor: string | null | undefined): number | undefined {
  if (!valor) return undefined;
  const m = /^\s*(-?[\d.]+)\s*%\s*$/.exec(valor);
  if (!m) return undefined;
  const n = Number.parseFloat(m[1]);
  return Number.isFinite(n) ? n : undefined;
}

/** `"120px"` → 120 (só px; o resto, `undefined`). */
export function lerPixels(valor: string | null | undefined): number | undefined {
  if (!valor) return undefined;
  const m = /^\s*([\d.]+)\s*(px)?\s*$/i.exec(valor);
  if (!m) return undefined;
  const n = Number.parseFloat(m[1]);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Larguras como o CKEditor guarda (`["25%", "120px", "auto"]`) → % da tabela. Lista toda em px
 * (tabela antiga, redimensionada pelo SEI com conteúdo que não quebra) é convertida pela proporção.
 */
export function deMedidasDoEditor(medidas: string[]): number[] {
  const pct = medidas.map(lerPorcentagem);
  if (pct.some((v) => v !== undefined)) return normalizar(pct);
  return normalizar(medidas.map(lerPixels));
}

export function paraEditor(valores: number[]): string[] {
  return fechar(valores).map((v) => `${v}%`);
}

/** Menor coluna, em % da tabela, para a tabela de `larguraTabela`% caber na impressão. */
export function minimoColuna(larguraTabela: number): number {
  const util = (LARGURA_UTIL_PT * Math.min(100, Math.max(1, larguraTabela))) / 100;
  return arredondar(Math.min(100, (MIN_COLUNA_PT / util) * 100));
}

/** Quantas colunas cabem na impressão numa tabela de `larguraTabela`%. */
export function maxColunas(larguraTabela: number): number {
  const util = (LARGURA_UTIL_PT * Math.min(100, Math.max(1, larguraTabela))) / 100;
  return Math.max(1, Math.floor(util / MIN_COLUNA_PT + 1e-9));
}

/**
 * Mínimo que dá para respeitar com `n` colunas: se nem todas cabem no mínimo de impressão, vale a
 * divisão igual (a tabela já vai vazar; o diálogo avisa).
 */
export function minimoPossivel(n: number, larguraTabela: number): number {
  if (n < 1) return 0;
  return Math.min(minimoColuna(larguraTabela), arredondar(100 / n));
}

/** Sobe toda coluna abaixo do mínimo, tirando a diferença das maiores. */
export function garantirMinimo(valores: number[], minimo: number): number[] {
  const n = valores.length;
  if (!n) return [];
  if (minimo * n >= 100) return uniformes(n);
  const v = normalizar(valores);
  let falta = 0;
  for (let i = 0; i < n; i++) {
    if (v[i] < minimo) {
      falta += minimo - v[i];
      v[i] = minimo;
    }
  }
  while (falta > 1e-9) {
    const folgados = v.map((x, i) => [x - minimo, i] as const).filter(([folga]) => folga > 1e-9);
    if (!folgados.length) break;
    const folgaTotal = folgados.reduce((a, [f]) => a + f, 0);
    const tirar = Math.min(falta, folgaTotal);
    for (const [folga, i] of folgados) v[i] -= (tirar * folga) / folgaTotal;
    falta -= tirar;
  }
  return fechar(v);
}

/**
 * O usuário digitou `novo` na coluna `i`. A diferença sai (ou entra) nas colunas seguintes, na
 * ordem, e depois nas anteriores; nenhuma fica abaixo do mínimo. A soma continua 100.
 */
export function definirColuna(valores: number[], i: number, novo: number, minimo: number): number[] {
  const n = valores.length;
  if (i < 0 || i >= n) return valores.slice();
  if (n === 1) return [100];
  const v = valores.slice();
  const teto = 100 - minimo * (n - 1);
  const alvo = Math.min(teto, Math.max(minimo, Number.isFinite(novo) ? novo : v[i]));
  let diferenca = alvo - v[i]; // > 0: os outros perdem; < 0: os outros ganham
  v[i] = alvo;
  const ordem = [...Array.from({ length: n - i - 1 }, (_, k) => i + 1 + k), ...Array.from({ length: i }, (_, k) => i - 1 - k)];
  if (diferenca > 0) {
    for (const j of ordem) {
      if (diferenca <= 1e-9) break;
      const tirar = Math.min(diferenca, Math.max(0, v[j] - minimo));
      v[j] -= tirar;
      diferenca -= tirar;
    }
  } else if (diferenca < 0) {
    v[ordem[0]] -= diferenca; // o vizinho da direita (ou da esquerda, na última) fica com a sobra
  }
  return fechar(v, ordem[0]);
}

/** Arrasto da divisória entre a coluna `i` e a `i + 1`: só essas duas mudam. */
export function moverDivisoria(valores: number[], i: number, delta: number, minimo: number): number[] {
  if (i < 0 || i >= valores.length - 1) return valores.slice();
  const v = valores.slice();
  const par = v[i] + v[i + 1];
  const esquerda = Math.min(par - minimo, Math.max(minimo, v[i] + delta));
  if (par - minimo < minimo) return v; // par já está no mínimo: nada a mover
  v[i] = arredondar(esquerda);
  v[i + 1] = par - v[i];
  return fechar(v, i + 1);
}

/** Largura da tabela digitada → entre 10% e 100%. */
export function larguraTabelaValida(valor: number): number {
  if (!Number.isFinite(valor)) return 100;
  return arredondar(Math.min(100, Math.max(10, valor)));
}

/** Larguras medidas na tela (px de cada coluna) → % da tabela. */
export function deMedidasDaTela(px: number[]): number[] {
  return normalizar(px);
}
