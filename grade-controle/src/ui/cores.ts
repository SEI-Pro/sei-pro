/** Cor do marcador a partir do nome do SVG do SEI (`azul_marinho`). Desconhecida: cinza neutro. */
const CORES: Array<[RegExp, string]> = [
  [/azul_marinho|marinho/, '#1d3557'],
  [/azul_claro|ciano|celeste/, '#2a9fd6'],
  [/azul/, '#2563c9'],
  [/verde_escuro/, '#166534'],
  [/verde|lima/, '#2e9e4f'],
  [/amarelo/, '#e0b000'],
  [/laranja/, '#ee7d11'],
  [/vermelho/, '#d1352b'],
  [/rosa|magenta/, '#d6409f'],
  [/roxo|violeta|lilas/, '#7048c6'],
  [/marrom/, '#8a5a3c'],
  [/preto/, '#222831'],
  [/branco/, '#ffffff'],
  [/cinza/, '#7b838c'],
];

export function corDoMarcador(cor: string): string {
  const c = cor.toLowerCase();
  return CORES.find(([re]) => re.test(c))?.[1] ?? '#8b939c';
}
