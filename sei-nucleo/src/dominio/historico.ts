/**
 * Histórico (andamentos) do processo — `procedimento_consultar_historico`.
 *
 * Três visões, como na tela: `R` resumido (padrão do SEI), `P` completo e
 * `T` total. A tabela é paginada pelo `hdnInfraPaginaAtual`; aqui as páginas
 * são percorridas até o fim ou até `limite`.
 *
 * Substitui no legado: `getDadosHistoricoPro`, `getDadosHistoricoUrlPro`,
 * `getDadosHistoricoPaginacao`, `getArrayHistorico` e a restauração de estado
 * `restaurarPaginacaoHistoricoPro` (desnecessária aqui: o POST paginado não
 * mexe na tela que o usuário tem aberta).
 */

import { acaoNaArvore } from "./arvore";
import { Formulario } from "../formulario/formulario";
import { linkDaAcao } from "../links/links";
import { textoDe } from "../sessao/dom";
import { ErroSei } from "../sessao/erros";
import type { Pagina } from "../sessao/http";
import type { Sei } from "../sei";

export interface Andamento {
  /** "dd/mm/aaaa hh:mm" como o SEI exibe. */
  data: string;
  unidade: string;
  usuario: string;
  descricao: string;
}

export type TipoHistorico = "resumido" | "completo" | "total";
const CODIGO: Record<TipoHistorico, string> = { resumido: "R", completo: "P", total: "T" };

function lerAndamentos(p: Pagina): { itens: Andamento[]; total: number } {
  const tabela = p.doc.querySelector("#tblHistorico");
  const total = Number(/\((\d+)\s+registro/.exec(textoDe(tabela?.querySelector("caption")))?.[1] ?? 0);
  const itens = [...(tabela?.querySelectorAll("tr") ?? [])]
    .filter((tr) => tr.querySelector("td"))
    .map((tr) => {
      const td = [...tr.querySelectorAll("td")];
      return { data: textoDe(td[0]), unidade: textoDe(td[1]), usuario: textoDe(td[2]), descricao: textoDe(td[3]) };
    });
  return { itens, total };
}

/** Andamentos do processo, do mais recente para o mais antigo. */
export async function andamentos(
  sei: Sei,
  referencia: string,
  o: { tipo?: TipoHistorico; limite?: number; sinal?: AbortSignal } = {},
): Promise<{ protocolo: string; total: number; andamentos: Andamento[] }> {
  const arv = await sei.arvore(referencia, { sinal: o.sinal });
  if (arv.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Processo sigiloso: o agente n\u00E3o atua nele.");
  const link = acaoNaArvore(arv, "procedimento_consultar_historico") ?? linkDaAcao(arv.pagina.html, "procedimento_consultar_historico");
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", "O hist\u00F3rico deste processo n\u00E3o est\u00E1 dispon\u00EDvel.");

  const limite = o.limite ?? 500;
  let pagina = await sei.http.obter(link, { sinal: o.sinal });
  const tipo = CODIGO[o.tipo ?? "resumido"];
  if (tipo !== "R") {
    pagina = await Formulario.de(pagina, "#frmProcedimentoHistorico", sei.http)
      .definir({ hdnTipoHistorico: tipo, hdnInfraPaginaAtual: "0" })
      .enviar({ sinal: o.sinal });
  }
  let { itens, total } = lerAndamentos(pagina);
  const todos = [...itens];
  for (let n = 1; todos.length < Math.min(total, limite) && itens.length > 0; n += 1) {
    pagina = await Formulario.de(pagina, "#frmProcedimentoHistorico", sei.http)
      .definir({ hdnTipoHistorico: tipo, hdnInfraPaginaAtual: String(n) })
      .enviar({ sinal: o.sinal });
    ({ itens } = lerAndamentos(pagina));
    todos.push(...itens);
  }
  return { protocolo: arv.protocolo, total: total || todos.length, andamentos: todos.slice(0, limite) };
}
