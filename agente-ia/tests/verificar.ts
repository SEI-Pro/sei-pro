import { verificarMotor } from "./verificar-motor";
import { verificarCambio, verificarSugestoes } from "./verificar-sugestoes";
import { resumo } from "./util";

await verificarMotor();
verificarSugestoes();
verificarCambio();
resumo();
