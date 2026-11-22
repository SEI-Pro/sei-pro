import cssBase from "@comum/ui/base.css";
import { definirCssBase } from "./abrir";

export { abrirDialogo, definirCssBase } from "./abrir";
export { avisarEditor } from "./avisar";
export type { OpcoesDialogo } from "./dialogo";

// O bundle importa este modulo: o CSS base entra uma vez, aqui.
definirCssBase(cssBase);
