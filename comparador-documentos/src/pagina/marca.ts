/**
 * Sinal para o legado: com este atributo no <html>, o `initDialogCompareDocs` (sei-functions-pro.js) só dispara o
 * evento de abrir e retorna, sem montar a janela antiga. O content script roda no document_start, então o atributo
 * existe antes de qualquer clique no botão.
 */
import { ATRIBUTO_ATIVO } from "@cd/modelo/constantes";

export function marcarAtivo(doc: Document): void {
  doc.documentElement?.setAttribute(ATRIBUTO_ATIVO, "1");
}
