import { recurso as align } from "./align";
import { recurso as capLetter } from "./cap-letter";
import { recurso as checkbox } from "./checkbox";
import { recurso as ghsUnlock } from "./ghs-unlock";
import { recurso as pageBreak } from "./page-break";
import { recurso as sessionBreak } from "./session-break";
import type { Recurso } from "./tipos";

/** Recursos portados, na ordem de `ids.ts`. Cada tarefa de recurso acrescenta o seu aqui e la. */
export const RECURSOS: readonly Recurso[] = [ghsUnlock, pageBreak, sessionBreak, checkbox, capLetter, align];
