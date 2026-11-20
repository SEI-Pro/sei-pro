/** Lista dos documentos que podem ser o B e leitura do HTML de cada um (a árvore já traz o endereço de cada documento). */
import type { Arvore } from "@nucleo/dominio/arvore";
import type { Sei } from "@nucleo/sei";
import { comoErroSei, ErroSei } from "@nucleo/sessao/erros";

export interface Candidato {
  id: string;
  numero: string;
  titulo: string;
  /** Endereço assinado do conteúdo (`documento_visualizar`): fica na aba, nunca vai para o app. */
  src: string;
}

/** Só documento gerado no SEI, ativo, não sigiloso e com acesso ao conteúdo; o A fica de fora. */
export function listarCandidatos(arvore: Arvore, excluirId: string | null): Candidato[] {
  return arvore.documentos
    .filter((d) => !d.externo && !d.cancelado && d.nivel !== "sigiloso" && !!d.src && d.id !== excluirId)
    .map((d) => ({ id: d.id, numero: d.numero, titulo: d.titulo, src: d.src }));
}

export async function lerHtml(sei: Sei, c: Candidato): Promise<string> {
  try {
    return (await sei.http.obter(c.src)).html;
  } catch (e) {
    const erro = comoErroSei(e);
    if (erro.codigo !== "SEI_REDE") throw erro;
    throw new ErroSei(
      "SEI_REDE",
      `Não foi possível ler o documento ${c.titulo || c.numero}: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
}
