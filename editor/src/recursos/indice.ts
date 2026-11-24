import { recurso as align } from "./align";
import { recurso as autoCleanup } from "./auto-cleanup";
import { recurso as capLetter } from "./cap-letter";
import { recurso as checkbox } from "./checkbox";
import { recurso as citacao } from "./citacao";
import { recurso as contextMenu } from "./context-menu";
import { recurso as copyStyle } from "./copy-style";
import { recurso as dadosProcesso } from "./dados-processo";
import { recurso as ditado } from "./ditado";
import { recurso as escritaInterativa } from "./escrita-interativa";
import { recurso as folhaPapel } from "./folha-papel";
import { recurso as fontSize } from "./font-size";
import { recurso as ghsUnlock } from "./ghs-unlock";
import { recurso as imageBackground } from "./image-background";
import { recurso as imageBase64 } from "./image-base64";
import { recurso as imageEditor } from "./image-editor";
import { recurso as imageQuality } from "./image-quality";
import { recurso as importarDoc } from "./importar-doc";
import { recurso as latex } from "./latex";
import { recurso as legis } from "./legis";
import { recurso as linkPro } from "./link-pro";
import { recurso as linkSeiLote } from "./link-sei-lote";
import { recurso as minutaWatermark } from "./minuta-watermark";
import { recurso as notaRodape } from "./nota-rodape";
import { recurso as pageBreak } from "./page-break";
import { recurso as processoPublico } from "./processo-publico";
import { recurso as qrCode } from "./qr-code";
import { recurso as quickTable } from "./quick-table";
import { recurso as refInterna } from "./ref-interna";
import { recurso as review } from "./review";
import { recurso as sessionBreak } from "./session-break";
import { recurso as sigilo } from "./sigilo";
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
  dadosProcesso,
  importarDoc,
  citacao,
  imageQuality,
  processoPublico,
  refInterna,
  notaRodape,
  qrCode,
  legis,
  ditado,
  imageEditor,
  sigilo,
  linkSeiLote,
  review,
  imageBase64,
  imageBackground,
  minutaWatermark,
  contextMenu,
  autoCleanup,
  escritaInterativa,
];
