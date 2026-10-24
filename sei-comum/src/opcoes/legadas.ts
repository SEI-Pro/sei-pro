/**
 * Opções da página de opções antiga (`chrome.storage.sync.dataValues`): uma
 * STRING JSON com a lista de perfis, e um deles traz
 * `configGeral: [{name, value}]`. O módulo novo tem de respeitar o liga/desliga
 * do usuário exatamente como o legado (sei-functions-pro.js), que tem duas
 * regras: `checkConfigValue` (opção ausente conta como LIGADA, só
 * `value == false` desliga) e `verifyConfigValue` (opção ausente conta como
 * DESLIGADA, só `value == true` liga).
 */

/** Valor gravado da opção; `undefined` quando não há configuração legível. */
export function valorOpcaoLegada(dataValues: unknown, nome: string): unknown {
  let perfis: unknown = dataValues;
  if (typeof dataValues === "string") {
    if (!dataValues.trim()) return undefined;
    try {
      perfis = JSON.parse(dataValues);
    } catch {
      return undefined;
    }
  }
  if (!Array.isArray(perfis) || perfis.length === 0) return undefined;
  const geral = perfis.map((p) => (p as { configGeral?: unknown } | null)?.configGeral).find(Array.isArray) as
    | Array<{ name?: unknown; value?: unknown }>
    | undefined;
  return geral?.find((o) => o?.name === nome)?.value;
}

/** Regra de `checkConfigValue`: ligada por padrão. */
export function opcaoLegadaLigada(dataValues: unknown, nome: string): boolean {
  const valor = valorOpcaoLegada(dataValues, nome);
  return !(valor === false || valor === 0 || valor === "");
}

/** Regra de `verifyConfigValue`: desligada por padrão. */
export function opcaoLegadaMarcada(dataValues: unknown, nome: string): boolean {
  const valor = valorOpcaoLegada(dataValues, nome);
  return valor === true || valor === 1 || valor === "1";
}

export async function lerOpcaoLegada(nome: string, sync: Pick<chrome.storage.StorageArea, "get"> = chrome.storage.sync): Promise<boolean> {
  const itens = (await sync.get("dataValues")) as { dataValues?: unknown };
  return opcaoLegadaLigada(itens.dataValues, nome);
}

/**
 * `dataValues` com a opção gravada como `valor`, ou null quando não há nada a mudar (a opção já tem esse valor
 * ou não existe configuração legível: sem perfil gravado o legado usa os padrões e criar um do zero seria
 * inventar a estrutura que ele espera). Preserva todo o resto do perfil e a forma do dado (string JSON ou lista).
 */
export function comOpcaoLegada(dataValues: unknown, nome: string, valor: boolean): string | null {
  let perfis: unknown = dataValues;
  if (typeof dataValues === "string") {
    if (!dataValues.trim()) return null;
    try {
      perfis = JSON.parse(dataValues);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(perfis) || perfis.length === 0) return null;
  const perfil = perfis.find((p) => Array.isArray((p as { configGeral?: unknown } | null)?.configGeral)) as
    | { configGeral: Array<{ name?: unknown; value?: unknown }> }
    | undefined;
  if (!perfil) return null;
  const item = perfil.configGeral.find((o) => o?.name === nome);
  if (item) {
    if (item.value === valor) return null;
    item.value = valor;
  } else {
    perfil.configGeral.push({ name: nome, value: valor });
  }
  return JSON.stringify(perfis);
}

/** Grava a opção do legado (`dataValues`) sem tocar no resto; não faz nada se já estiver assim ou sem perfil. */
export async function definirOpcaoLegada(
  nome: string,
  valor: boolean,
  sync: Pick<chrome.storage.StorageArea, "get" | "set"> = chrome.storage.sync,
): Promise<boolean> {
  const itens = (await sync.get("dataValues")) as { dataValues?: unknown };
  const novo = comOpcaoLegada(itens.dataValues, nome, valor);
  if (novo === null) return false;
  await sync.set({ dataValues: novo });
  return true;
}
