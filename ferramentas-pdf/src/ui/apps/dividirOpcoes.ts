/**
 * Os modos do Dividir PDF e as opções que a tela manda ao motor.
 *
 * Separado da tela para que a verificação em Node exercite o MESMO objeto que
 * a interface monta, contra o despacho de verdade. Foi a falta disso que deixou
 * dois dos três modos quebrados sem nenhum teste acusar: a tela mandava
 * `intervalos`/`porPaginas`, o motor esperava `porIntervalos`/`porQuantidade`,
 * e os dois caíam no ramo de tamanho com teto zero -- "Não foi possível concluir
 * a operação" em todo PDF. O teste da biblioteca passava, porque usava os nomes
 * certos; o que estava errado era a costura.
 */

import type { ModoDivisao, OpcoesDivisao } from "@/lib/ferramentas/dividir";

/** Os modos oferecidos na tela, na ordem do seletor. */
export const MODOS_DIVISAO = [
  { valor: "porIntervalos", rotulo: "Por intervalos de páginas" },
  { valor: "porQuantidade", rotulo: "A cada N páginas" },
  { valor: "porTamanho", rotulo: "Em partes que caibam num tamanho" },
] as const satisfies readonly { valor: ModoDivisao; rotulo: string }[];

export type ModoDaTela = (typeof MODOS_DIVISAO)[number]["valor"];

/** O que o usuário preencheu, como os campos o entregam (texto). */
export interface CamposDivisao {
  intervalos: string;
  paginasPorParte: string;
  tamanhoMb: string;
}

/**
 * Opções no formato do motor. O tipo de retorno é o do próprio `dividirPdf`:
 * um nome de modo ou de campo que não exista lá deixa de compilar.
 */
export function opcoesDaDivisao(
  modo: ModoDaTela,
  campos: CamposDivisao,
): Omit<OpcoesDivisao, "aoProgredir" | "cancelado"> {
  if (modo === "porIntervalos") return { modo, intervalos: campos.intervalos };
  if (modo === "porQuantidade") {
    return { modo, paginasPorParte: Number(campos.paginasPorParte) || 1 };
  }
  return { modo, tamanhoMaximoBytes: (Number(campos.tamanhoMb) || 1) * 1024 * 1024 };
}
