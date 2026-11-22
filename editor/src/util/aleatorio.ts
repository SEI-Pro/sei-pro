const ALFABETO = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Texto aleatorio de `n` caracteres [0-9a-zA-Z] (o `randomString` do legado). */
export function textoAleatorio(n: number): string {
  const sorteio = new Uint32Array(Math.max(0, n));
  crypto.getRandomValues(sorteio);
  let r = "";
  for (const v of sorteio) r += ALFABETO[v % ALFABETO.length];
  return r;
}
