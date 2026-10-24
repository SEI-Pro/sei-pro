import { resumo } from "./util";
import { verificarLoja } from "./verificar-loja";
import { verificarPaineis } from "./verificar-paineis";
import { verificarTexto } from "./verificar-texto";

await verificarLoja();
verificarTexto();
await verificarPaineis();
resumo();
