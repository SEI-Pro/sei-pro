import { type AbrirDialogo, criarAbridorDeDialogo, injetarEstiloBase } from "./dialogo";

let css = "";

/**
 * Entrega o CSS base ao `abrirDialogo`. So o bundle (`pagina/main.ts`) chama isto, com o `base.css` do
 * `sei-comum`; os testes nao carregam `.css`, e o dialogo sai sem estilo.
 */
export function definirCssBase(c: string): void {
  css = c;
}

/** Dialogo modal que os recursos usam (X e Esc fecham; sem "Cancelar"). */
export const abrirDialogo: AbrirDialogo = (doc, o) => criarAbridorDeDialogo(css)(doc, o);

/** Garante o CSS base no documento (o aviso aparece mesmo sem nenhum dialogo aberto). */
export function garantirEstiloBase(doc: Document): void {
  injetarEstiloBase(doc, css);
}
