import { verificarMotor } from "./verificar-motor";
import { verificarProvedor } from "./verificar-provedor";
import { verificarCambio, verificarSugestoes } from "./verificar-sugestoes";
import { resumo } from "./util";

await verificarMotor();
await verificarProvedor();
verificarSugestoes();
verificarCambio();
resumo();
