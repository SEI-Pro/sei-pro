import { resumo } from "./util";
import { verificarBlocos } from "./verificar-blocos";
import { verificarConstantes } from "./verificar-constantes";
import { verificarDiff } from "./verificar-diff";
import { verificarPagina } from "./verificar-pagina";
import { verificarResultado } from "./verificar-resultado";
import { verificarSanitizar } from "./verificar-sanitizar";
import { verificarSei } from "./verificar-sei";
import { verificarTrabalhador } from "./verificar-trabalhador";

verificarConstantes();
verificarBlocos();
verificarDiff();
verificarSanitizar();
verificarResultado();
await verificarPagina();
await verificarTrabalhador();
await verificarSei();
resumo();
