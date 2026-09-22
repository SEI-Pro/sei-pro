/**
 * Listas de apoio (tipos, hipóteses legais, usuários, marcadores, grupos) —
 * as opções que o usuário vê nos formulários do SEI.
 *
 * Todas são lidas dos formulários de um processo aberto na unidade, que é o
 * que o usuário comum tem (as telas de cadastro dessas listas são de
 * administrador). O resultado é o mesmo que o usuário escolheria na tela.
 *
 * Substitui no legado: `getTypeSEI`, `getListTypesSEI`, `getHipoteseLegal`,
 * `getListaAtribuicaoProcesso`, `getAjaxListaMarcador`,
 * `getListaGruposAcompEsp`, `txtPadrao_getList` (parcialmente).
 */

import { acaoNaArvore } from "./arvore";
import { hipotesesDoFormulario } from "./escrita";
import { tiposDocumento } from "./documento";
import { Formulario, normalizar } from "../formulario/formulario";
import { linkDaAcao } from "../links/links";
import { ErroSei } from "../sessao/erros";
import type { Sei } from "../sei";

export type ListaOpcoes =
  | "tipos_processo"
  | "tipos_documento"
  | "hipoteses_legais"
  | "usuarios"
  | "marcadores"
  | "grupos_acompanhamento";

export interface OpcaoSei {
  id: string;
  nome: string;
}

const TELAS: Record<Exclude<ListaOpcoes, "tipos_documento">, { acao: string; form: string; campo: string }> = {
  tipos_processo: { acao: "procedimento_alterar", form: "#frmProcedimentoCadastro", campo: "selTipoProcedimento" },
  hipoteses_legais: { acao: "procedimento_alterar", form: "#frmProcedimentoCadastro", campo: "selHipoteseLegal" },
  usuarios: { acao: "procedimento_atribuicao_cadastrar", form: "#frmAtividadeAtribuir", campo: "selAtribuicao" },
  marcadores: { acao: "andamento_marcador_gerenciar", form: "#frmAndamentoMarcadorCadastro", campo: "selMarcador" },
  grupos_acompanhamento: { acao: "acompanhamento_gerenciar", form: "#frmAcompanhamentoCadastro", campo: "selGrupoAcompanhamento" },
};

/** Opções de uma lista, lidas a partir de um processo aberto na unidade. `filtro` = contém (sem acento/caixa). */
export async function listarOpcoes(
  sei: Sei,
  lista: ListaOpcoes,
  refProcesso: string,
  o: { filtro?: string; sinal?: AbortSignal } = {},
): Promise<OpcaoSei[]> {
  let itens: OpcaoSei[];
  if (lista === "tipos_documento") {
    itens = (await tiposDocumento(sei, refProcesso, o.sinal)).map((t) => ({ id: t.id, nome: t.nome }));
  } else {
    const tela = TELAS[lista];
    if (!tela) throw new ErroSei("ARGUMENTO_INVALIDO", `Lista desconhecida: ${lista}.`, Object.keys(TELAS).concat("tipos_documento").join(" | "));
    const arv = await sei.arvore(refProcesso, { sinal: o.sinal });
    let link = acaoNaArvore(arv, tela.acao);
    if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `Para listar ${lista} use um processo aberto na sua unidade.`);
    if (lista === "marcadores") {
      // A lista de marcadores está no formulário "Adicionar", atrás da tela de gerenciamento.
      link = linkDaAcao((await sei.http.obter(link, { sinal: o.sinal, aceitarValidacao: true })).html, "andamento_marcador_cadastrar");
      if (!link) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "Tela de marcadores n\u00E3o reconhecida.");
    }
    const form = await Formulario.abrir(sei.http, link, tela.form, { sinal: o.sinal, aceitarValidacao: true });
    itens =
      lista === "hipoteses_legais"
        ? (await hipotesesDoFormulario(sei, form, "1", o.sinal)).map((h) => ({ id: h.id, nome: h.texto }))
        : form
            .opcoes(tela.campo)
            .filter((op) => op.valor && op.valor !== "null" && op.texto)
            .map((op) => ({ id: op.valor, nome: op.texto }));
  }
  const f = o.filtro ? normalizar(o.filtro) : "";
  return f ? itens.filter((i) => normalizar(i.nome).includes(f)) : itens;
}
