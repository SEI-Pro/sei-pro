import { IDS_RECURSOS } from "../src/recursos/ids";
import { verificarGhsUnlock } from "./recursos/ghs-unlock";
import { igual, resumo, secao } from "./util";
import { verificarAdaptadorCk4 } from "./verificar-adaptador-ck4";
import { verificarAdaptadorCk5 } from "./verificar-adaptador-ck5";
import { verificarVersao } from "./verificar-adaptador-versao";
import { verificarCedencia } from "./verificar-cedencia";
import { verificarContrato } from "./verificar-contrato";
import { verificarInstalar } from "./verificar-instalar";
import { verificarOpcoes } from "./verificar-opcoes";
import { verificarUi } from "./verificar-ui";

secao("ids dos recursos");
igual("ids dos recursos sao unicos", new Set(IDS_RECURSOS).size, IDS_RECURSOS.length);
verificarOpcoes();
verificarVersao();
await verificarAdaptadorCk4();
await verificarAdaptadorCk5();
verificarUi();
verificarInstalar();
verificarCedencia();
verificarContrato();
await verificarGhsUnlock();

resumo();
