import { verificarBase } from "./verificar-base";
import { verificarDominio } from "./verificar-dominio";
import { verificarPrivacidade } from "./verificar-privacidade";
import { resumo } from "./util";

await verificarBase();
await verificarDominio();
await verificarPrivacidade();
resumo();
