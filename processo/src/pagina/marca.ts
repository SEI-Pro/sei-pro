/**
 * Sinal para o legado: com este atributo no <html>, o `sei-pro-arvore.js` não desenha mais os painéis abaixo da
 * árvore (Atribuição, Marcador, Anotações, Acompanhamento, Descrição, Tipo, Nível, Interessados, Assuntos,
 * Observações, Bloco Interno). O content script roda no document_start, então o atributo existe antes de o
 * legado olhar. Só nos quadros da árvore (acao=procedimento_visualizar), nunca na janela de topo.
 */
import { ATRIBUTO_PAINEIS } from "./../modelo/constantes";

export function ehQuadroDaArvore(janela: Pick<Window, "location" | "top">): boolean {
  return janela !== janela.top && /[?&]acao=procedimento_visualizar(&|$)/.test(janela.location.search);
}

export function marcarAtivo(doc: Document): void {
  doc.documentElement?.setAttribute(ATRIBUTO_PAINEIS, "1");
}
