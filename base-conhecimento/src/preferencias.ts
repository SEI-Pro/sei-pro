/**
 * Preferências por navegador da Base de Conhecimento (chrome.storage.local).
 * A numeração é só apresentação: nunca entra no Texto Padrão da unidade.
 */

import type { Area } from "@comum/armazenamento/area";

export const CHAVE_NUMERAR = "spro_bc_numerar";
export const PADRAO_NUMERAR = "nao";

/** true só quando a chave guarda "sim" (ausente, "nao" ou valor estranho: desligada). */
export async function lerNumeracao(area: Area): Promise<boolean> {
  const v = await area.obter(CHAVE_NUMERAR);
  return v[CHAVE_NUMERAR] === "sim";
}
