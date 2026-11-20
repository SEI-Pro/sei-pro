import type { Contexto, Recurso } from "./tipos";

export interface Falha {
  id: string;
  erro: unknown;
}

type JanelaComAdaptadorLegado = Record<string, unknown> & {
  SeiProEditorAdapter?: { registerFeature?(def: { id: string }): unknown };
};

/**
 * Poe os globais dos recursos em `window`. NUNCA sobrescreve: um nome ja definido (por um modulo
 * legado que nao cedeu, ou por outro recurso) vira falha, para nunca haver dois donos do mesmo nome.
 * Registra o recurso no adapter legado (`registerFeature`) quando ele existe.
 */
export function instalarRecursos(win: Window, recursos: readonly Recurso[], c: Contexto): { instalados: string[]; falhas: Falha[] } {
  const w = win as unknown as JanelaComAdaptadorLegado;
  const instalados: string[] = [];
  const falhas: Falha[] = [];
  for (const r of recursos) {
    let ok = true;
    try {
      for (const [nome, valor] of Object.entries(r.globais(c))) {
        if (w[nome] !== undefined) {
          ok = false;
          falhas.push({ id: r.id, erro: new Error(`global ja definido: ${nome}`) });
          continue;
        }
        w[nome] = valor;
      }
    } catch (erro) {
      ok = false;
      falhas.push({ id: r.id, erro });
    }
    if (ok) instalados.push(r.id);
    try {
      w.SeiProEditorAdapter?.registerFeature?.({ id: r.id });
    } catch {
      // o registro e so diagnostico
    }
  }
  return { instalados, falhas };
}

/** Roda o `iniciar` de cada recurso, isolado: a falha de um nao impede os demais. */
export function iniciarRecursos(recursos: readonly Recurso[], c: Contexto): Falha[] {
  const falhas: Falha[] = [];
  for (const r of recursos) {
    try {
      r.iniciar?.(c);
    } catch (erro) {
      falhas.push({ id: r.id, erro });
    }
  }
  return falhas;
}
