/**
 * Visualização rápida de um documento citado no Gantt (clique no losango). O endereço NUNCA é montado aqui: vem da
 * árvore que o quadro já tem (o `src` do nó, o mesmo que a árvore carrega no visualizador), inclusive dos documentos
 * das pastas que o usuário abriu (`DocumentosDaTela`). Documento que não está na tela (excluído, pasta fechada) avisa.
 */
import { h } from "@comum/ui/dom";
import type { DocumentoArvore } from "@nucleo/dominio/arvore";
import type { DocumentoDaPassagem } from "@nucleo/dominio/passagens";
import { avisarNoTopo } from "../pagina/comum";
import type { ContextoProcesso } from "../pagina/contexto";
import { abrirDialogo } from "../pagina/modais/comum";

export function acharDocumento(ctx: Pick<ContextoProcesso, "arv" | "doc" | "documentos">, d: DocumentoDaPassagem): DocumentoArvore | null {
  const procurar = (docs: readonly DocumentoArvore[]) =>
    docs.find((x) => (d.idDocumento && x.id === d.idDocumento) || (d.nrSei && x.numero === d.nrSei)) ?? null;
  const daArvore = procurar(ctx.arv.documentos);
  if (daArvore) return daArvore;
  // Documento de pasta aberta depois: o SEI o traz no #ifrPasta (o que já foi aberto está acumulado no contexto).
  ctx.documentos.lerDoIframe(ctx.doc);
  return procurar(ctx.documentos.todos());
}

/** Abre o documento num diálogo com o conteúdo. Devolve `false` (e avisa) se não há como mostrá-lo. */
export function abrirVisualizacaoRapida(ctx: ContextoProcesso, d: DocumentoDaPassagem): boolean {
  const nome = d.nrSei ?? d.titulo;
  const doc = acharDocumento(ctx, d);
  if (!doc) {
    avisarNoTopo(
      ctx,
      `O documento ${nome} não está na árvore (foi excluído ou está numa pasta fechada). Abra a pasta e tente de novo.`,
      6000,
    );
    return false;
  }
  if (!doc.src) {
    avisarNoTopo(ctx, `O documento ${nome} não tem conteúdo para visualizar${doc.cancelado ? " (está cancelado)" : ""}.`, 5000);
    return false;
  }
  const quadro = h("iframe", { class: "spro-g-documento", src: doc.src, "aria-label": `Conteúdo do documento ${doc.numero}` });
  const dlg = abrirDialogo(ctx, {
    titulo: `${doc.titulo} (${doc.numero})`,
    icone: "documento",
    largura: 960,
    conteudo: [quadro],
  });
  dlg.el.classList.add("spro-g-dialogo-doc");
  return true;
}
