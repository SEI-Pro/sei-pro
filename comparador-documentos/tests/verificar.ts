import { resumo } from "./util";
import { verificarBlocos } from "./verificar-blocos";
import { verificarConstantes } from "./verificar-constantes";
import { verificarDiff } from "./verificar-diff";
import { verificarSanitizar } from "./verificar-sanitizar";

verificarConstantes();
verificarBlocos();
verificarDiff();
verificarSanitizar();
resumo();
