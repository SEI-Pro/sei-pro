/**
 * Zebra pela primeira coluna.
 *
 * Os temas zebrados do SEI pintam linha sim, linha não com `tr:nth-child(...) > td:before`: a regra não
 * sabe de células mescladas. Com a 1ª célula de uma linha mesclada com a de baixo (rowspan), as duas
 * linhas são um só grupo e devem ter a mesma cor; o grupo seguinte troca de cor.
 *
 * Como a folha do SEI força `background-color: transparent !important` nas células com tema, a cor vai
 * com `!important` no próprio `<td>` (atributo `tableCellBackgroundColor` do CK5), por cima da pintura do
 * tema. Só nas tabelas com mesclagem na 1ª coluna: sem mesclagem, o tema do SEI já pinta certo e a
 * tabela fica limpa. As marcas são reconhecidas pelo valor e tiradas quando deixam de ser necessárias.
 */

export const CINZA = '#e5e5e5 !important';
export const BRANCO = '#ffffff !important';
export const MARCAS: ReadonlySet<string> = new Set([CINZA, BRANCO]);

interface Zebra {
  /** O 1º grupo do corpo é cinza quando a tabela tem linha de cabeçalho (`thead`)? */
  cinzaComCabecalho: boolean;
  /** …e quando não tem. */
  cinzaSemCabecalho: boolean;
  /** O tema também pinta as `th` do corpo (coluna de cabeçalho). */
  pintaTh: boolean;
}

/** Paridade de cada tema do SEI 5.0.5, tirada da folha `infra-doc-tabela__*`. */
export const ZEBRAS: Readonly<Record<string, Zebra>> = {
  'infra-doc-tabela__zcb': { cinzaComCabecalho: false, cinzaSemCabecalho: false, pintaTh: true },
  'infra-doc-tabela__elegante': { cinzaComCabecalho: true, cinzaSemCabecalho: false, pintaTh: false },
  'infra-doc-tabela__zcbplepcsf': { cinzaComCabecalho: true, cinzaSemCabecalho: false, pintaTh: false },
  'infra-doc-tabela__zcbeplcfp': { cinzaComCabecalho: false, cinzaSemCabecalho: true, pintaTh: false },
  'infra-doc-tabela__zcfcbplpccfp': { cinzaComCabecalho: false, cinzaSemCabecalho: true, pintaTh: false },
  'infra-doc-tabela__zcbeplcfc': { cinzaComCabecalho: false, cinzaSemCabecalho: true, pintaTh: false },
  'infra-doc-tabela__zcfcbplepccfc': { cinzaComCabecalho: false, cinzaSemCabecalho: true, pintaTh: false },
};

export interface Celula {
  rowspan: number;
  colspan: number;
}

/** Coluna de cada célula (a grade real, contando as que descem de linhas de cima). */
export function colunasDasCelulas(linhas: Celula[][]): number[][] {
  const ocupado: boolean[][] = linhas.map(() => []);
  return linhas.map((linha, r) => {
    let c = 0;
    return linha.map((cel) => {
      while (ocupado[r][c]) c++;
      const inicio = c;
      const rs = Math.max(1, cel.rowspan || 1);
      const cs = Math.max(1, cel.colspan || 1);
      for (let i = r; i < Math.min(linhas.length, r + rs); i++) for (let j = c; j < c + cs; j++) ocupado[i][j] = true;
      c += cs;
      return inicio;
    });
  });
}

/**
 * Grupo de cada linha do corpo pela 1ª coluna (-1 nas linhas de cabeçalho). Linha cuja 1ª coluna vem
 * de uma célula mesclada de cima fica no grupo dessa célula.
 */
export function gruposPelaPrimeiraColuna(linhas: Celula[][], cabecalho: number): number[] {
  const colunas = colunasDasCelulas(linhas);
  let grupo = -1;
  return linhas.map((_, r) => {
    if (r < cabecalho) return -1;
    const comeca = colunas[r].includes(0);
    if (comeca || r === cabecalho) grupo++;
    return grupo;
  });
}

/**
 * Cor de cada célula (`CINZA`/`BRANCO`, ou `null` = sem marca nossa), ou `null` se a tabela não precisa:
 * tema que não é zebrado ou sem mesclagem na 1ª coluna do corpo.
 */
export function pinturaZebra(
  linhas: Celula[][],
  tema: string,
  cabecalho: number,
  colunasCabecalho: number,
): Array<Array<string | null>> | null {
  const z = ZEBRAS[tema];
  if (!z) return null;
  const grupos = gruposPelaPrimeiraColuna(linhas, cabecalho);
  const corpo = grupos.filter((g) => g >= 0);
  if (new Set(corpo).size === corpo.length) return null;
  const colunas = colunasDasCelulas(linhas);
  const primeiroCinza = cabecalho > 0 ? z.cinzaComCabecalho : z.cinzaSemCabecalho;
  return linhas.map((linha, r) =>
    linha.map((_, i) => {
      const g = grupos[r];
      if (g < 0) return null;
      if (!z.pintaTh && colunas[r][i] < colunasCabecalho) return null;
      return (g % 2 === 0) === primeiroCinza ? CINZA : BRANCO;
    }),
  );
}
