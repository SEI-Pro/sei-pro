import { verificarMotor } from "./verificar-motor";
import { verificarProvedor } from "./verificar-provedor";
import { verificarSkills } from "./verificar-skills";
import { verificarCambio, verificarSugestoes } from "./verificar-sugestoes";
import { resumo } from "./util";

await verificarMotor();
await verificarProvedor();
await verificarSkills();
verificarSugestoes();
verificarCambio();
resumo();
