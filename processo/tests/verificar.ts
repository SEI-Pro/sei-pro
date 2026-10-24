import { resumo } from "./util";
import { verificarCapa } from "./verificar-capa";
import { verificarGantt } from "./verificar-gantt";
import { verificarLoja } from "./verificar-loja";
import { verificarMenu } from "./verificar-menu";
import { verificarPaineis } from "./verificar-paineis";
import { verificarTexto } from "./verificar-texto";

await verificarLoja();
verificarTexto();
await verificarPaineis();
await verificarMenu();
await verificarGantt();
await verificarCapa();
resumo();
