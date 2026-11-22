import { recurso as align } from "./align";
import { recurso as capLetter } from "./cap-letter";
import { recurso as checkbox } from "./checkbox";
import { recurso as copyStyle } from "./copy-style";
import { recurso as folhaPapel } from "./folha-papel";
import { recurso as fontSize } from "./font-size";
import { recurso as ghsUnlock } from "./ghs-unlock";
import { recurso as latex } from "./latex";
import { recurso as linkPro } from "./link-pro";
import { recurso as notaRodape } from "./nota-rodape";
import { recurso as pageBreak } from "./page-break";
import { recurso as quickTable } from "./quick-table";
import { recurso as refInterna } from "./ref-interna";
import { recurso as sessionBreak } from "./session-break";
import { recurso as styleEditor } from "./style-editor";
import { recurso as sumario } from "./sumario";
import { recurso as tableStyles } from "./table-styles";
import { recurso as tinyUrl } from "./tiny-url";
import type { Recurso } from "./tipos";

/** Recursos portados, na ordem de `ids.ts`. Cada tarefa de recurso acrescenta o seu aqui e la. */
export const RECURSOS: readonly Recurso[] = [
  ghsUnlock,
  pageBreak,
  sessionBreak,
  checkbox,
  capLetter,
  align,
  fontSize,
  styleEditor,
  quickTable,
  folhaPapel,
  tinyUrl,
  latex,
  copyStyle,
  linkPro,
  tableStyles,
  sumario,
  refInterna,
  notaRodape,
];
