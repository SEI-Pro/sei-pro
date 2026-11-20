import { IDS_RECURSOS } from "../src/recursos/ids";
import { igual, resumo, secao } from "./util";
import { verificarVersao } from "./verificar-adaptador-versao";
import { verificarOpcoes } from "./verificar-opcoes";

secao("esqueleto");
igual("ids vazios no esqueleto", IDS_RECURSOS, []);
verificarOpcoes();
verificarVersao();

resumo();
