import { mostrarAviso } from "@comum/ui/aviso";

/** Aviso curto no rodape da tela do editor; o texto entra como texto, nunca como HTML. */
export function avisarEditor(doc: Document, texto: string): void {
  mostrarAviso(doc, texto, undefined, 7000);
}
