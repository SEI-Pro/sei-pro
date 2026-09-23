import { verificarMotor } from "./verificar-motor";
import { verificarProvedor } from "./verificar-provedor";
import { verificarSkills } from "./verificar-skills";
import { verificarDesfazer } from "./verificar-desfazer";
import { verificarRegras } from "./verificar-regras";
import { verificarCusto } from "./verificar-custo";
import { verificarCambio, verificarSugestoes } from "./verificar-sugestoes";
import { resumo } from "./util";

await verificarMotor();
await verificarProvedor();
await verificarSkills();
verificarDesfazer();
verificarRegras();
verificarCusto();
verificarSugestoes();
verificarCambio();
resumo();
