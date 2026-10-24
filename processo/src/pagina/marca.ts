/**
 * Sinal para o legado: com este atributo no <html>, o `sei-pro-arvore.js` não desenha mais os painéis abaixo da
 * árvore (Atribuição, Marcador, Anotações, Acompanhamento, Descrição, Tipo, Nível, Interessados, Assuntos,
 * Observações, Bloco Interno). O content script roda no document_start, então o atributo existe antes de o
 * legado olhar. Só nos quadros da árvore (acao=procedimento_visualizar), nunca na janela de topo.
 */
import { ATRIBUTO_GANTT, ATRIBUTO_MENU, ATRIBUTO_PAINEIS } from "./../modelo/constantes";

export function ehQuadroDaArvore(janela: Pick<Window, "location" | "top">): boolean {
  return janela !== janela.top && /[?&]acao=procedimento_visualizar(&|$)/.test(janela.location.search);
}

export function marcarAtivo(doc: Document): void {
  doc.documentElement?.setAttribute(ATRIBUTO_PAINEIS, "1");
}

/**
 * Sinal para o legado: com este atributo, o `sei-pro-arvore.js` não monta mais o menu rápido da árvore (o menu do
 * processo e dos documentos, feito com jquery.toolbar) nem os ícones fixos ao lado dos documentos. Quem os desenha é
 * `menuDoc/`. Também síncrono, no document_start, só nos quadros da árvore.
 */
export function marcarMenu(doc: Document): void {
  doc.documentElement?.setAttribute(ATRIBUTO_MENU, "1");
}

/**
 * Sinal para o legado: com este atributo, `initGanttHistoryProc` (o link “Histórico de tramitação do processo” da capa
 * legada) não monta mais o frappe-gantt: dispara o evento `spro-processo-gantt-abrir` no documento do quadro da árvore,
 * onde o `gantt/ligar.ts` abre o modal. Síncrono, só no quadro da árvore.
 */
export function marcarGantt(doc: Document): void {
  doc.documentElement?.setAttribute(ATRIBUTO_GANTT, "1");
}

/**
 * O legado cria um iframe oculto (`#frmCheckerProcessoPro`) que recarrega o processo inteiro; a árvore dentro dele
 * é uma cópia que ninguém vê. Montar painéis (e buscar dados) lá só duplicaria as requisições.
 */
export function dentroDoVerificadorOculto(janela: Window): boolean {
  try {
    for (let w: Window = janela; w !== w.top; w = w.parent) if (w.frameElement?.id === "frmCheckerProcessoPro") return true;
  } catch {
    // quadro de outra origem: não é o verificador
  }
  return false;
}
