import { mostrarAviso } from "@comum/ui/aviso";
import cssBase from "@comum/ui/base.css";
import { criarAbridorDeDialogo } from "./dialogo";

export type { OpcoesDialogo } from "./dialogo";

/** Dialogo modal do editor (X e Esc fecham; sem "Cancelar"). */
export const abrirDialogo = criarAbridorDeDialogo(cssBase);

/** Aviso curto no rodape da tela do editor; o texto entra como texto, nunca como HTML. */
export function avisarEditor(doc: Document, texto: string): void {
  mostrarAviso(doc, texto, undefined, 7000);
}
