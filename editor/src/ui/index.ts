import cssBase from "@comum/ui/base.css";
import cssFormulario from "@comum/ui/formulario.css";
import { definirCssBase } from "./abrir";

export { abrirDialogo, definirCssBase } from "./abrir";
export { avisarEditor } from "./avisar";
export type { OpcoesDialogo } from "./dialogo";

// O bundle importa este modulo: o CSS base e o do kit de formulario entram uma vez, aqui.
definirCssBase(`${cssBase}\n${cssFormulario}`);
