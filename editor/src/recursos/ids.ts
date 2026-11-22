/**
 * Ids dos recursos do editor ja portados para TS. E a unica lista que o content script
 * (`init_editor.js`) importa: so ids, nenhum codigo de recurso. O mesmo id e o nome do modulo
 * legado em `dist/js/modules/editor/<id>.js` que passa a ceder.
 */
export const IDS_RECURSOS: readonly string[] = [
  "ghs-unlock",
  "page-break",
  "session-break",
  "checkbox",
  "cap-letter",
  "align",
  "font-size",
  "style-editor",
  "quick-table",
  "folha-papel",
  "tiny-url",
  "latex",
  "copy-style",
  "link-pro",
  "table-styles",
];
