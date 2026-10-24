/** Pequenos serviços dos painéis e dos modais: copiar, avisar na tela de cima, nome do ícone do nível. */
import { mostrarAviso } from "@comum/ui/aviso";
import type { NomeIcone } from "@comum/ui/dom";
import type { NivelAcesso } from "@nucleo/dominio/arvore";
import type { ContextoProcesso } from "./contexto";

export async function copiarTexto(doc: Document, texto: string): Promise<boolean> {
  try {
    await doc.defaultView?.navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // Sem a API (ou sem foco): o caminho antigo do navegador.
    const campo = doc.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.opacity = "0";
    doc.body.append(campo);
    campo.select();
    let ok = false;
    try {
      ok = doc.execCommand("copy");
    } catch {
      ok = false;
    }
    campo.remove();
    return ok;
  }
}

/** Aviso curto (toast) na janela de topo, onde cabe: o quadro da árvore é estreito. */
export function avisarNoTopo(ctx: Pick<ContextoProcesso, "topo">, texto: string, ms = 4000): void {
  try {
    mostrarAviso(ctx.topo, texto, undefined, ms);
  } catch {
    // aviso é cortesia: sem ele a ação já aconteceu
  }
}

export async function copiarEAvisar(ctx: ContextoProcesso, texto: string): Promise<void> {
  const ok = await copiarTexto(ctx.doc, texto);
  avisarNoTopo(ctx, ok ? "Copiado." : "Não foi possível copiar.", 1800);
}

export const ICONE_DO_NIVEL: Record<NivelAcesso, NomeIcone> = { publico: "olho", restrito: "cadeado", sigiloso: "cadeado" };
export const ROTULO_DO_NIVEL: Record<NivelAcesso, string> = { publico: "Público", restrito: "Restrito", sigiloso: "Sigiloso" };

/** Mensagem do erro para o usuário: a do SEI quando houver (`detalhe` traz a validação), sem jargão. */
export function mensagemDeErro(e: unknown): string {
  if (e && typeof e === "object") {
    const x = e as { message?: unknown; detalhe?: unknown; codigo?: unknown };
    const base = typeof x.message === "string" && x.message ? x.message : "Não foi possível concluir.";
    const det = typeof x.detalhe === "string" && x.detalhe && x.codigo === "SEI_VALIDACAO" ? ` ${x.detalhe}` : "";
    return `${base}${det}`.trim();
  }
  return typeof e === "string" && e ? e : "Não foi possível concluir.";
}

/**
 * O que o painel diz quando uma leitura falha: sem códigos nem seletores de formulário. O motivo mais comum de a
 * resposta não ser a tela esperada é a sessão ter expirado (o SEI devolve o login ou uma página de erro).
 */
export function mensagemDeLeitura(e: unknown): string {
  const codigo = e && typeof e === "object" ? (e as { codigo?: unknown }).codigo : undefined;
  if (codigo === "SEI_SESSAO_EXPIRADA") return "Sua sessão do SEI expirou. Entre de novo e atualize a página.";
  if (codigo === "SEI_VERSAO_NAO_SUPORTADA" || codigo === "SEI_RESPOSTA_INESPERADA")
    return "O SEI respondeu uma tela inesperada (a sessão pode ter expirado).";
  if (codigo === "SEI_REDE") return "Sem conexão com o SEI.";
  return mensagemDeErro(e);
}

/** Espera a condição valer (conferida a cada 100 ms) até o prazo. Devolve se valeu. */
export async function aguardar(condicao: () => boolean, ms: number, passo = 100): Promise<boolean> {
  const lim = Date.now() + ms;
  while (Date.now() < lim) {
    if (condicao()) return true;
    await new Promise((r) => setTimeout(r, passo));
  }
  return condicao();
}
