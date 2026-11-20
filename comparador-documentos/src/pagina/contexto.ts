import { parametros } from "@nucleo/links/links";
import { lerContexto } from "@nucleo/sei";
import { decodificarEntidades } from "@nucleo/sessao/dom";
import { paginaDe } from "@nucleo/sessao/pagina";

export interface ContextoComparador {
  host: string;
  login: string;
  nomeUsuario: string;
  unidadeSigla: string;
  temaEscuro: boolean;
  corTema?: string;
  /** Endereço da tela do SEI. Fica na aba: pode trazer o infra_hash e nunca vai para o app. */
  base: string;
  /** Endereço da árvore do processo, lido do `#ifrArvore` da tela (colhido da página, nunca montado). */
  linkArvore: string;
  idProcedimento: string;
}

/** Sem login lido ou sem árvore (tela que não é `procedimento_trabalhar`) não há o que fazer: devolve null. */
export function contextoComparador(doc: Document, o: { temaEscuro: boolean; corTema?: string }, url?: string): ContextoComparador | null {
  const pagina = paginaDe(doc, url);
  const c = lerContexto(pagina);
  if (!c.usuario.login) return null;
  const src = pagina.doc.querySelector("#ifrArvore")?.getAttribute("src");
  if (!src) return null;
  const linkArvore = decodificarEntidades(src);
  const idProcedimento = parametros(linkArvore).get("id_procedimento") ?? "";
  if (!idProcedimento) return null;
  const ctx: ContextoComparador = {
    host: c.host,
    login: c.usuario.login.toLowerCase(),
    nomeUsuario: c.usuario.nome ?? "",
    unidadeSigla: c.unidade.sigla ?? "",
    temaEscuro: o.temaEscuro,
    base: pagina.url,
    linkArvore,
    idProcedimento,
  };
  if (o.corTema) ctx.corTema = o.corTema;
  return ctx;
}

/**
 * Documento marcado na árvore agora (o legado lia `#content .infraArvoreNoSelecionado`, com id `span<id>`).
 * Lido a cada abertura do comparador: o usuário muda a seleção sem recarregar a tela.
 */
export function selecionadoNaArvore(arvore: Document | null): { id: string; titulo: string } | null {
  const el = arvore?.querySelector("#content .infraArvoreNoSelecionado") ?? arvore?.querySelector(".infraArvoreNoSelecionado");
  const id = /^span(\d+)$/.exec(el?.getAttribute("id") ?? "")?.[1];
  if (!el || !id) return null;
  return { id, titulo: (el.textContent ?? "").replace(/\s+/g, " ").trim() };
}
