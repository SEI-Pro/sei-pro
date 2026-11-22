/**
 * Opcoes do usuario lidas NA PAGINA (o bundle do editor roda no mundo da pagina, sem `chrome.*`).
 * O legado grava o perfil em `localStorage.configBasePro` (JSON de perfis com `configGeral:[{name,value}]`).
 * Duas regras, as mesmas do `sei-functions-pro.js`:
 *  - `checkOpcao`  (checkConfigValue):  opcao ausente conta como LIGADA; so `false`/0/"" desliga;
 *  - `verifyOpcao` (verifyConfigValue): opcao ausente conta como DESLIGADA; so `true`/1/"1" liga.
 */

import { opcaoLegadaLigada, opcaoLegadaMarcada } from "@comum/opcoes/legadas";

type Armazem = Pick<Storage, "getItem">;

/** Conteudo bruto de `configBasePro` (string JSON) ou null quando nao ha nada legivel. */
export function lerConfigBase(armazem: Armazem = localStorage): unknown {
  try {
    return armazem.getItem("configBasePro");
  } catch {
    return null;
  }
}

export function checkOpcao(nome: string, armazem: Armazem = localStorage): boolean {
  return opcaoLegadaLigada(lerConfigBase(armazem), nome);
}

export function verifyOpcao(nome: string, armazem: Armazem = localStorage): boolean {
  return opcaoLegadaMarcada(lerConfigBase(armazem), nome);
}
