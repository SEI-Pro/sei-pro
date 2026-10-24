import { resumo } from "./util";
import { verificarLoja } from "./verificar-loja";
import { verificarMenu } from "./verificar-menu";
import { verificarPaineis } from "./verificar-paineis";
import { verificarTexto } from "./verificar-texto";

await verificarLoja();
verificarTexto();
await verificarPaineis();
await verificarMenu();
resumo();
