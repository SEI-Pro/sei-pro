/**
 * Glifos PREENCHIDOS dos itens do menu rápido (a tela "Personalizar menu"): o mesmo estilo de `glifos.ts` (grade de 24,
 * `currentColor`, furos por `fill-rule: evenodd`), no lugar dos `fas fa-*` do legado. Um glifo por conceito; o que o
 * módulo já desenhava (nota, olho, etiquetas, usuários, livro, cadeado...) vem de `glifos.ts`.
 */
import { GLIFOS, type NomeGlifo } from "./glifos";

export const GLIFOS_MENU = {
  direitos: [
    "M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z",
    "M16.59 8.79A5.6 5.6 0 1 0 16.59 15.21L14.78 13.95A3.4 3.4 0 1 1 14.78 10.05z",
  ],
  letraC: ["M19.28 6.11A9.5 9.5 0 1 0 19.28 17.89L16.21 15.54A5.5 5.5 0 1 1 16.21 8.46z"],
  link: [
    "M9.01 21.49L12.69 17.81A4.6 4.6 0 0 0 6.19 11.31L2.51 14.99A4.6 4.6 0 0 0 9.01 21.49z",
    "M7.46 19.94L11.14 16.26A2.4 2.4 0 0 0 7.74 12.86L4.06 16.54A2.4 2.4 0 0 0 7.46 19.94z",
    "M17.81 12.69L21.49 9.01A4.6 4.6 0 0 0 14.99 2.51L11.31 6.19A4.6 4.6 0 0 0 17.81 12.69z",
    "M16.26 11.14L19.94 7.46A2.4 2.4 0 0 0 16.54 4.06L12.86 7.74A2.4 2.4 0 0 0 16.26 11.14z",
    "M10.62 15.15L15.15 10.62A1.25 1.25 0 0 0 13.38 8.85L8.85 13.38A1.25 1.25 0 0 0 10.62 15.15z",
  ],
  subir: ["M12 2.5 5.5 9h4.3v7h4.4V9h4.3z", "M3 15.5h3v3.5h12v-3.5h3V22H3z"],
  baixar: ["M12 17.5 5.5 11h4.3V3h4.4v8h4.3z", "M3 15.5h3v3.5h12v-3.5h3V22H3z"],
  engrenagem: [
    "M19.84 9.6L22.34 10.18L22.34 13.82L19.84 14.4L19.24 15.85L20.6 18.02L18.02 20.6L15.85 19.24L14.4 19.84L13.82 22.34L10.18 22.34L9.6 19.84L8.15 19.24L5.98 20.6L3.4 18.02L4.76 15.85L4.16 14.4L1.66 13.82L1.66 10.18L4.16 9.6L4.76 8.15L3.4 5.98L5.98 3.4L8.15 4.76L9.6 4.16L10.18 1.66L13.82 1.66L14.4 4.16L15.85 4.76L18.02 3.4L20.6 5.98L19.24 8.15z",
    "M8.4 12a3.6 3.6 0 1 0 7.2 0a3.6 3.6 0 1 0 -7.2 0z",
  ],
  documentoTexto: [
    "M6 2h8.5l5.5 5.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z",
    "M14 3.6v4.4h4.4z",
    "M7.6 12h8.8v1.7H7.6z",
    "M7.6 15.6h8.8v1.7H7.6z",
  ],
  documentoAssinado: [
    "M6 2h8.5l5.5 5.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z",
    "M14 3.6v4.4h4.4z",
    "M8.2 16.2l1.3-1.3 1.6 1.6 3.4-3.4 1.3 1.3-4.7 4.7z",
  ],
  sincronizar: [
    "M4.48 9.26A8 8 0 0 1 18.3 7.07L16.1 8.8A5.2 5.2 0 0 0 7.11 10.22zM14.22 9.92L19.44 11.76L20.46 6.32z",
    "M19.52 14.74A8 8 0 0 1 5.7 16.93L7.9 15.2A5.2 5.2 0 0 0 16.89 13.78zM9.78 14.08L4.56 12.24L3.54 17.68z",
  ],
  compartilhar: [
    "M5.5 4H12v2.4H6.4v11.2h11.2V13H20v6a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V5.5A1.5 1.5 0 0 1 5.5 4z",
    "M14.5 2.5H21.5V9.5L18.9 6.9 12.9 12.9 11.1 11.1 17.1 5.1z",
  ],
  copia: [
    "M9 7h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z",
    "M4 2h10a2 2 0 0 1 2 2v1.5h-2.2V4.2H4.2v10H5.5v2.3H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z",
  ],
  relacionar: [
    "M3 12L3 8.5L6.5 5L14 5L14 2L21 6.5L14 11L14 8L7.5 8L6 9.5L6 12z",
    "M21 12L21 15.5L17.5 19L10 19L10 22L3 17.5L10 13L10 16L16.5 16L18 14.5L18 12z",
  ],
  pausa: ["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z", "M8.4 7.5h2.5v9H8.4z", "M13.1 7.5h2.5v9h-2.5z"],
  clipe: [
    "M11.78 20.23L18.98 11.65A5.2 5.2 0 0 0 11.02 4.97L3.82 13.55A5.2 5.2 0 0 0 11.78 20.23z",
    "M10.33 19.01L17.53 10.43A3.3 3.3 0 0 0 12.47 6.19L5.27 14.77A3.3 3.3 0 0 0 10.33 19.01z",
  ],
  pdf: ["M6 2h8.5l5.5 5.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z", "M14 3.6v4.4h4.4z", "M7.2 13h9.6v5H7.2z"],
  zip: [
    "M6 2h8.5l5.5 5.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z",
    "M10.2 3.2h1.8v1.8h-1.8z",
    "M12 5h1.8v1.8H12z",
    "M10.2 6.8h1.8v1.8h-1.8z",
    "M12 8.6h1.8v1.8H12z",
    "M10.2 10.4h1.8v1.8h-1.8z",
    "M10 13.6h4V19h-4z",
  ],
  bandeira: ["M4.5 2.5h2V22h-2z", "M6.5 4C9.5 2.4 12 5.4 15.5 4.4c1.6-.5 2.7-1 4-1.6v10c-1.3.7-2.4 1.2-4 1.7-3.5 1-6-2-9-.5z"],
  pastaAberta: [
    "M2.5 5.5a2 2 0 0 1 2-2h4.6l2 2.4h7.4a2 2 0 0 1 2 2V10H7.2a2 2 0 0 0-1.9 1.4L2.5 19.6z",
    "M5.9 11.9a1 1 0 0 1 .95-.7H22a.8.8 0 0 1 .76 1.05l-2.3 7.2a1.8 1.8 0 0 1-1.7 1.25H3.6z",
  ],
  joia: [
    "M2 10.5h4.4V21H2z",
    "M8 10.5l3.4-7.2c.3-.7 1-1.1 1.7-1.1 1.3 0 2.2 1.2 1.9 2.4L14 9h5.5a2.5 2.5 0 0 1 2.4 3.1l-1.7 6.6a2.5 2.5 0 0 1-2.4 1.8H8z",
  ],
  envelope: ["M3 9.4 12 3l9 6.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M7.4 11.4h9.2v1.7H7.4z", "M7.4 14.9h6v1.7h-6z"],
  camadas: ["M12 2 2 7.5 12 13l10-5.5z", "M3.6 11.2 2 12l10 5.5 10-5.5-1.6-.8L12 15.4z", "M3.6 15.7 2 16.5 12 22l10-5.5-1.6-.8L12 19.9z"],
  ordenar: ["M6.2 3h2.4v13H11.4l-4 4.6-4-4.6h2.8z", "M13 4h4.2v2.3H13z", "M13 9h7v2.3h-7z", "M13 14h9.2v2.3H13z", "M13 19h4v2.3h-4z"],
  encaminhar: ["M14 4 22 11l-8 7v-4C8.8 14 5 16 2.6 20 3.2 13.4 6.9 9.2 14 8.4z"],
  imprimir: [
    "M7 2h10v5H7z",
    "M5 8.5h14a3 3 0 0 1 3 3V17h-4v-3H6v3H2v-5.5a3 3 0 0 1 3-3z",
    "M7.5 15.5h9V22h-9z",
    "M9.4 17.6h5.2V19H9.4z",
    "M9.4 19.9h5.2v1.3H9.4z",
  ],
  janelas: [
    "M8 3h11.5A1.5 1.5 0 0 1 21 4.5V15a1.5 1.5 0 0 1-1.5 1.5H18V14.4h.8V7.2H9.2v1.2H7V4.5A1.5 1.5 0 0 1 8.5 3z",
    "M3.5 8.5H15A1.5 1.5 0 0 1 16.5 10v9.5A1.5 1.5 0 0 1 15 21H3.5A1.5 1.5 0 0 1 2 19.5V10a1.5 1.5 0 0 1 1.5-1.5z",
    "M4.2 12h9.6v6.6H4.2z",
  ],
  proibido: [
    "M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z",
    "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z",
    "M5.56 7.12 7.12 5.56 18.44 16.88 16.88 18.44z",
  ],
  ramificacao: [
    "M6 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z",
    "M6 16.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z",
    "M18 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z",
    "M5 7.6h2v8.8H5z",
    "M17 7.6h2V9a4.2 4.2 0 0 1-4.2 4.2H11a2.6 2.6 0 0 0-2.6 2.6v.6H6.4v-.6A4.6 4.6 0 0 1 11 11.2h3.8A2.2 2.2 0 0 0 17 9z",
  ],
  circulo: ["M17.1 3.17A10.2 10.2 0 1 1 8.51 2.42L9.4 4.86A7.6 7.6 0 1 0 15.8 5.42z"],
  caneta: ["M15.6 2.4 21.6 8.4 10.8 19.2 3.6 20.4l1.2-7.2z", "M14.6 8.6a1.7 1.7 0 1 0 2.4 2.4 1.7 1.7 0 0 0-2.4-2.4z"],
  estrela: ["M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8l-6.3 3.7 1.7-7.3L2 9.5l7.1-.6z"],
  arroba: [
    "M20.6 18.02A10.5 10.5 0 1 1 22.5 12L20.2 12A8.2 8.2 0 1 0 18.72 16.7z",
    "M7.6 12a4.4 4.4 0 1 0 8.8 0a4.4 4.4 0 1 0 -8.8 0z",
    "M9.8 12a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0z",
    "M15.6 8.4h2.4v8.4h-2.4z",
  ],
  pastaSeta: [
    "M2.5 5.5a2 2 0 0 1 2-2h4.6l2 2.4h8.4a2 2 0 0 1 2 2v10.2a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2z",
    "M7 11.2h5.6V9.2l4.2 3.3-4.2 3.3v-2H7z",
  ],
  megafone: [
    "M3 9.2h4.2L16.4 4v16l-9.2-5.2H3z",
    "M5 15.6h3l1.2 5H6.4z",
    "M18.4 8.6l2.8-1.6.9 1.5-2.8 1.6z",
    "M18.6 11.2h3.4v1.8h-3.4z",
    "M18.4 15.2l2.8 1.6-.9 1.5-2.8-1.6z",
  ],
  linkExterno: [
    "M5.5 4H11v2.4H6.4v11.2h11.2V13H20v6a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V5.5A1.5 1.5 0 0 1 5.5 4z",
    "M14 2.5h7.5V10L18.7 7.2 11.9 14 10.1 12.2 16.9 5.4z",
  ],
  cursor: ["M5 2l14 10.5-6.2 1 3.7 7-2.8 1.5-3.7-7L5 20z"],
  circuloSeta: [
    "M22.5 12A10.5 10.5 0 1 1 22.5 11.98L20.3 11.99A8.3 8.3 0 1 0 20.3 12z",
    "M7.11 10.22A5.2 5.2 0 0 1 17.2 12L15 12A3 3 0 0 0 9.18 10.97z",
  ],
  arvore: ["M9 2h6v5H9z", "M2 16h6v5H2z", "M16 16h6v5h-6z", "M11 7h2v3.5h6V16h-2v-3.5H7V16H5v-5.5h6z"],
  informacao: ["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z", "M10.7 10.5h2.6V18h-2.6z", "M10.6 6h2.8v2.6h-2.8z"],
} satisfies Record<string, string[]>;

export type NomeGlifoMenu = keyof typeof GLIFOS_MENU | NomeGlifo;

const NS = "http://www.w3.org/2000/svg";

/** As formas de um glifo (do menu, ou do módulo quando o nome é de `glifos.ts`). */
export function formasDoGlifo(nome: NomeGlifoMenu): readonly string[] {
  return nome in GLIFOS_MENU ? GLIFOS_MENU[nome as keyof typeof GLIFOS_MENU] : GLIFOS[nome as NomeGlifo];
}

/** SVG preenchido, `tamanho` px na tela. `doc` serve a quem desenha em outro documento (o modal abre na janela de topo). */
export function glifoMenu(nome: NomeGlifoMenu, tamanho = 16, doc: Document = document): SVGSVGElement {
  const svg = doc.createElementNS(NS, "svg");
  const atributos: Record<string, string> = {
    viewBox: "0 0 24 24",
    width: String(tamanho),
    height: String(tamanho),
    fill: "currentColor",
    stroke: "none",
    "aria-hidden": "true",
    focusable: "false",
    class: "spro-glifo spro-icone",
  };
  for (const [k, v] of Object.entries(atributos)) svg.setAttribute(k, v);
  const p = doc.createElementNS(NS, "path");
  p.setAttribute("d", formasDoGlifo(nome).join(""));
  p.setAttribute("fill-rule", "evenodd");
  svg.append(p);
  return svg;
}
