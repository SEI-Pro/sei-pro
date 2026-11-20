import { recurso as ghsUnlock } from "./ghs-unlock";
import type { Recurso } from "./tipos";

/** Recursos portados, na ordem de `ids.ts`. Cada tarefa de recurso acrescenta o seu aqui e la. */
export const RECURSOS: readonly Recurso[] = [ghsUnlock];
