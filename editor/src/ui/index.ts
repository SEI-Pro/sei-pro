import cssBase from "@comum/ui/base.css";
import { criarAbridorDeDialogo } from "./dialogo";

export { avisarEditor } from "./avisar";
export type { OpcoesDialogo } from "./dialogo";

/** Dialogo modal do editor (X e Esc fecham; sem "Cancelar"). Importa o CSS: so o bundle usa; os testes usam `dialogo.ts`. */
export const abrirDialogo = criarAbridorDeDialogo(cssBase);
