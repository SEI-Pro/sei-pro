/**
 * Payload do arrastar-e-soltar da árvore: um documento (agrupador) ou uma pasta
 * (id). O MIME é próprio do módulo; lixo ou outro formato é ignorado.
 */

export const MIME_ARRASTO = "application/x-seipro-base-conhecimento";

export type PayloadArrasto = { tipo: "item"; agrupador: string } | { tipo: "pasta"; id: string };

export function serializarArrasto(p: PayloadArrasto): string {
  return JSON.stringify(p);
}

export function lerArrasto(dt: DataTransfer | null): PayloadArrasto | null {
  if (!dt) return null;
  let bruto: string | null = null;
  try {
    bruto = dt.getData(MIME_ARRASTO);
  } catch {
    return null;
  }
  if (!bruto) return null;
  try {
    const p = JSON.parse(bruto) as { tipo?: unknown; agrupador?: unknown; id?: unknown };
    if (p?.tipo === "item" && typeof p.agrupador === "string") return { tipo: "item", agrupador: p.agrupador };
    if (p?.tipo === "pasta" && typeof p.id === "string") return { tipo: "pasta", id: p.id };
  } catch {
    return null;
  }
  return null;
}
