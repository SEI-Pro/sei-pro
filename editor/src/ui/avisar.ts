import { mostrarAviso } from "@comum/ui/aviso";
import { garantirEstiloBase } from "./abrir";

/** Aviso curto no rodape da tela do editor (com o CSS base, mesmo sem dialogo aberto); o texto entra como texto, nunca como HTML. */
export function avisarEditor(doc: Document, texto: string): void {
  garantirEstiloBase(doc);
  mostrarAviso(doc, texto, undefined, 7000);
}
