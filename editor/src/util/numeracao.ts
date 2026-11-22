/**
 * Numeracao dos paragrafos do SEI (porte de `getNiveisParagrafos`): `Paragrafo_Numerado_Nivel1..4` e `Item_Nivel1..4`
 * contam em separado; um nivel reinicia os mais fundos; `sessionBreakPro` zera todos. O nivel e a classe EXATA do
 * paragrafo (como no legado). Pular de nivel mantem o literal do legado: Nivel1 seguido de Nivel3 e "1.0.1".
 */
const NIVEIS = [1, 2, 3, 4] as const;
const PREFIXOS = ["Paragrafo_Numerado_Nivel", "Item_Nivel"] as const;

/** Um item por paragrafo recebido: o numero ("1", "1.1", "2.0.1"...) ou "" se o paragrafo nao e numerado. */
export function numerar(paragrafos: Array<{ classe: string }>): Array<{ item: string }> {
  const contadores = PREFIXOS.map(() => [0, 0, 0, 0]);
  return paragrafos.map(({ classe }) => {
    if (classe === "sessionBreakPro") {
      for (const c of contadores) c.fill(0);
      return { item: "" };
    }
    for (let g = 0; g < PREFIXOS.length; g += 1) {
      for (const n of NIVEIS) {
        if (classe !== `${PREFIXOS[g]}${n}`) continue;
        const c = contadores[g] as number[];
        c[n - 1] = (c[n - 1] ?? 0) + 1;
        for (let i = n; i < 4; i += 1) c[i] = 0;
        return { item: c.slice(0, n).join(".") };
      }
    }
    return { item: "" };
  });
}
