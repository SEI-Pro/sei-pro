import { IDS_RECURSOS } from "../src/recursos/ids";
import { igual, resumo, secao } from "./util";
import { verificarOpcoes } from "./verificar-opcoes";

secao("esqueleto");
igual("ids vazios no esqueleto", IDS_RECURSOS, []);
verificarOpcoes();

resumo();
