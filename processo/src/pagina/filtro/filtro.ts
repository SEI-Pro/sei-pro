/**
 * Filtro da árvore: o modelo, sem DOM e sem rede. Recebe os documentos que o quadro já conhece (a árvore e as pastas
 * que o usuário abriu) e devolve quais ficam à vista. Nunca altera nada: quem esconde os nós é `dom.ts`.
 *
 * Regras:
 *  - Os três chips (Não assinados, Externos, Cancelados) SOMAM: com mais de um ligado, o documento aparece se casar
 *    com qualquer um (são recortes que quase não se cruzam; "e" daria sempre vazio). Nenhum ligado = sem recorte.
 *  - A busca RESTRINGE: o documento precisa casar com todas as palavras (sem acento, sem caixa), no nome da árvore ou
 *    no número SEI. Combina com os chips em "e".
 *  - Uma pasta fica à vista se algum documento dela ficar. O nó do processo nunca é escondido.
 */
import { normalizarTexto } from "@comum/texto";
import type { Arvore, DocumentoArvore } from "@nucleo/dominio/arvore";

export interface FiltroArvore {
  texto: string;
  naoAssinados: boolean;
  externos: boolean;
  cancelados: boolean;
}

export const FILTRO_VAZIO: Readonly<FiltroArvore> = Object.freeze({
  texto: "",
  naoAssinados: false,
  externos: false,
  cancelados: false,
});

export interface OpcoesFiltro {
  /**
   * Sigla da unidade do usuário. O chip "Não assinados" mostra o que a unidade ainda precisa assinar: documento
   * gerado por outra unidade (a sigla vem da árvore, só no SEI 4+) não entra. Sem a sigla, ou sem a unidade geradora
   * no documento, vale o documento.
   */
  unidade?: string;
}

export function filtroAtivo(f: FiltroArvore): boolean {
  return normalizarTexto(f.texto) !== "" || f.naoAssinados || f.externos || f.cancelados;
}

/** Documento do editor do SEI (interno ou circular): é o único que se assina por aqui. */
function eDoEditor(d: DocumentoArvore): boolean {
  return !d.cancelado && (d.formato === "interno" || d.formato === "circular");
}

/** O núcleo marca o circular como "externo" (o ícone dele não está na lista de internos); ele é do editor. */
export function eExterno(d: DocumentoArvore): boolean {
  return d.externo && d.formato !== "circular";
}

export function naoAssinado(d: DocumentoArvore, o?: OpcoesFiltro): boolean {
  if (!eDoEditor(d) || d.assinado) return false;
  const minha = (o?.unidade ?? "").trim().toUpperCase();
  const geradora = (d.unidadeGeradora ?? "").trim().toUpperCase();
  return !(minha && geradora && minha !== geradora);
}

/** As palavras da busca, normalizadas. */
export function palavrasDaBusca(texto: string): string[] {
  const n = normalizarTexto(texto);
  return n ? n.split(" ") : [];
}

/** O texto em que a busca procura: nome na árvore e número SEI. */
export function textoDoDocumento(d: DocumentoArvore): string {
  return normalizarTexto(`${d.titulo} ${d.numero}`);
}

export function documentoCasa(d: DocumentoArvore, f: FiltroArvore, o?: OpcoesFiltro): boolean {
  const recortes = f.naoAssinados || f.externos || f.cancelados;
  if (recortes) {
    const casaRecorte = (f.naoAssinados && naoAssinado(d, o)) || (f.externos && eExterno(d)) || (f.cancelados && d.cancelado);
    if (!casaRecorte) return false;
  }
  const palavras = palavrasDaBusca(f.texto);
  if (palavras.length) {
    const alvo = textoDoDocumento(d);
    if (!palavras.every((p) => alvo.includes(p))) return false;
  }
  return true;
}

/**
 * Os ids que ficam à vista: os documentos que casam e as pastas (`PASTA1`...) com ao menos um deles. O processo não
 * entra (nunca é escondido). Com o filtro vazio devolve todos os documentos e todas as pastas conhecidas.
 */
export function aplicarFiltro(arv: Pick<Arvore, "documentos">, f: FiltroArvore, o?: OpcoesFiltro): Set<string> {
  const visiveis = new Set<string>();
  for (const d of arv.documentos) {
    if (!documentoCasa(d, f, o)) continue;
    visiveis.add(d.id);
    if (d.pasta) visiveis.add(d.pasta);
  }
  return visiveis;
}

/** Quantos documentos há e quantos ficam à vista (não conta pastas). */
export function contar(arv: Pick<Arvore, "documentos">, visiveis: ReadonlySet<string>): { visiveis: number; total: number } {
  let n = 0;
  for (const d of arv.documentos) if (visiveis.has(d.id)) n += 1;
  return { visiveis: n, total: arv.documentos.length };
}
