import { IDS_RECURSOS } from "../src/recursos/ids";
import { igual, resumo, secao } from "./util";
import { verificarAdaptadorCk4 } from "./verificar-adaptador-ck4";
import { verificarAdaptadorCk5 } from "./verificar-adaptador-ck5";
import { verificarVersao } from "./verificar-adaptador-versao";
import { verificarOpcoes } from "./verificar-opcoes";

secao("esqueleto");
igual("ids vazios no esqueleto", IDS_RECURSOS, []);
verificarOpcoes();
verificarVersao();
await verificarAdaptadorCk4();
await verificarAdaptadorCk5();

resumo();
