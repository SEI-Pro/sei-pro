/**
 * DOM sem framework e SEM innerHTML: texto que vem do SEI ou do usuário entra
 * sempre como nó de texto. É o contrato do DOM seguro (spec do Firefox): um
 * nome de pasta `<img onerror=...>` não tem como virar código.
 *
 * Mesmo `h()` do agente (agente-ia/src/painel/dom.ts), com a mesma correção:
 * `<textarea>` NÃO tem atributo `value` (o valor inicial é o conteúdo), e com
 * setAttribute a caixa abria vazia, como se a nota tivesse sumido.
 */

export type Filho = Node | string | null | undefined | false;
type Atributo = string | boolean | ((ev: Event) => void) | undefined;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, Atributo> = {},
  ...filhos: Filho[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    if (typeof v === "function") el.addEventListener(k.replace(/^on/, ""), v);
    else if (v === true) el.setAttribute(k, "");
    else if (k === "class") el.className = v;
    else if (k === "value" && tag === "textarea") (el as HTMLTextAreaElement).value = v;
    else el.setAttribute(k, v);
  }
  for (const f of filhos) if (f !== null && f !== undefined && f !== false) el.append(f);
  return el;
}

/**
 * Ícones em SVG desenhados no DOM: sem fonte de ícones (o SEI Pro dependia do
 * FontAwesome da página) e sem emoji, que muda de forma a cada sistema. O traço
 * usa `currentColor`, então acompanha a cor do botão e o modo escuro.
 */
export type Forma = [string, Record<string, string>];
const preenchido = { fill: "currentColor", stroke: "none" };
const CONTORNO_ESTRELA = "M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z";

export const ICONES = {
  estrela: [["path", { d: CONTORNO_ESTRELA }]],
  estrelaCheia: [["path", { d: CONTORNO_ESTRELA, fill: "currentColor" }]],
  // Processos Monitorados: o inativo é só o alvo; o ativo muda a silhueta (centro cheio e marcas de mira), não só a cor.
  alvo: [
    ["circle", { cx: "12", cy: "12", r: "7.5" }],
    ["circle", { cx: "12", cy: "12", r: "3.2" }],
  ],
  alvoAtivo: [
    ["circle", { cx: "12", cy: "12", r: "6.6" }],
    ["circle", { cx: "12", cy: "12", r: "2.4", fill: "currentColor" }],
    ["path", { d: "M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4" }],
  ],
  pasta: [["path", { d: "M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" }]],
  etiqueta: [
    ["path", { d: "M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z" }],
    ["circle", { cx: "8", cy: "8", r: "1.4", ...preenchido }],
  ],
  relogio: [
    ["circle", { cx: "12", cy: "12", r: "9" }],
    ["path", { d: "M12 7.2V12l3.2 1.9" }],
  ],
  nota: [
    ["path", { d: "M6 3.5h9l3.5 3.5v13.5H6z" }],
    ["path", { d: "M9 11h6" }],
    ["path", { d: "M9 15h6" }],
  ],
  lixeira: [
    ["path", { d: "M4.5 6.5h15" }],
    ["path", { d: "M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7" }],
    ["path", { d: "M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5" }],
  ],
  lapis: [
    ["path", { d: "M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z" }],
    ["path", { d: "M15 6l3 3" }],
  ],
  fechar: [
    ["path", { d: "M18 6 6 18" }],
    ["path", { d: "M6 6l12 12" }],
  ],
  mais: [
    ["path", { d: "M12 5v14" }],
    ["path", { d: "M5 12h14" }],
  ],
  busca: [
    ["circle", { cx: "11", cy: "11", r: "6.5" }],
    ["path", { d: "M20.5 20.5l-4.8-4.8" }],
  ],
  baixar: [
    ["path", { d: "M12 3.5v11" }],
    ["path", { d: "M7.5 10.2 12 14.7l4.5-4.5" }],
    ["path", { d: "M4.5 19.5h15" }],
  ],
  subir: [
    ["path", { d: "M12 14.5v-11" }],
    ["path", { d: "M7.5 7.8 12 3.3l4.5 4.5" }],
    ["path", { d: "M4.5 19.5h15" }],
  ],
  copiar: [
    ["rect", { x: "8.5", y: "8.5", width: "12", height: "12", rx: "2" }],
    ["path", { d: "M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" }],
  ],
  restaurar: [
    ["path", { d: "M9 14 4 9l5-5" }],
    ["path", { d: "M4 9h9a7 7 0 0 1 7 7v4" }],
  ],
  check: [["path", { d: "M20 6.5 9.2 17.3 4 12.1" }]],
  alerta: [
    ["path", { d: "M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z" }],
    ["path", { d: "M12 9.5v4" }],
    ["circle", { cx: "12", cy: "16.8", r: "1", ...preenchido }],
  ],
  menu: [
    ["circle", { cx: "5", cy: "12", r: "1.4", ...preenchido }],
    ["circle", { cx: "12", cy: "12", r: "1.4", ...preenchido }],
    ["circle", { cx: "19", cy: "12", r: "1.4", ...preenchido }],
  ],
  alca: [
    ["circle", { cx: "9", cy: "6", r: "1.3", ...preenchido }],
    ["circle", { cx: "15", cy: "6", r: "1.3", ...preenchido }],
    ["circle", { cx: "9", cy: "12", r: "1.3", ...preenchido }],
    ["circle", { cx: "15", cy: "12", r: "1.3", ...preenchido }],
    ["circle", { cx: "9", cy: "18", r: "1.3", ...preenchido }],
    ["circle", { cx: "15", cy: "18", r: "1.3", ...preenchido }],
  ],
  ajustes: [
    ["path", { d: "M4 7h5" }],
    ["path", { d: "M13 7h7" }],
    ["circle", { cx: "11", cy: "7", r: "2.1" }],
    ["path", { d: "M4 17h9" }],
    ["path", { d: "M17 17h3" }],
    ["circle", { cx: "15", cy: "17", r: "2.1" }],
  ],
  setaCima: [
    ["path", { d: "M12 19V6" }],
    ["path", { d: "M6 12l6-6 6 6" }],
  ],
  setaBaixo: [
    ["path", { d: "M12 5v13" }],
    ["path", { d: "M18 12l-6 6-6-6" }],
  ],
  recolher: [["path", { d: "M6 15l6-6 6 6" }]],
  expandir: [["path", { d: "M6 9l6 6 6-6" }]],
  local: [
    ["path", { d: "M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z" }],
    ["circle", { cx: "12", cy: "10", r: "2.3" }],
  ],
  sino: [
    ["path", { d: "M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z" }],
    ["path", { d: "M10 20.5a2 2 0 0 0 4 0" }],
  ],
  documento: [
    ["path", { d: "M7 3.5h7l4 4v13H7z" }],
    ["path", { d: "M14 3.5v4h4" }],
  ],
  painel: [
    ["rect", { x: "3.5", y: "4.5", width: "17", height: "15", rx: "2" }],
    ["path", { d: "M14.5 4.5v15" }],
  ],
  atualizar: [
    ["path", { d: "M19.5 12a7.5 7.5 0 1 1-2.2-5.3" }],
    ["path", { d: "M19.5 4.5v4h-4" }],
  ],
  nuvem: [["path", { d: "M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z" }]],
  chevron: [["path", { d: "M7 9.5l5 5 5-5" }]],
  pino: [
    ["path", { d: "M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z" }],
    ["path", { d: "M12 13.5v7" }],
  ],
  pinoCheio: [
    ["path", { d: "M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z", fill: "currentColor" }],
    ["path", { d: "M12 13.5v7" }],
  ],
  filtro: [["path", { d: "M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z" }]],
  ordenar: [
    ["path", { d: "M7.5 4.5v15" }],
    ["path", { d: "M4 16l3.5 3.5L11 16" }],
    ["path", { d: "M16.5 19.5v-15" }],
    ["path", { d: "M13 8l3.5-3.5L20 8" }],
  ],
  mapa: [
    ["path", { d: "M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z" }],
    ["path", { d: "M9 4.5v13" }],
    ["path", { d: "M15 6.6v13" }],
  ],
  olho: [
    ["path", { d: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" }],
    ["circle", { cx: "12", cy: "12", r: "2.8" }],
  ],
  camadas: [
    ["path", { d: "M12 3.5 20.5 8 12 12.5 3.5 8z" }],
    ["path", { d: "M3.5 12 12 16.5 20.5 12" }],
    ["path", { d: "M3.5 16 12 20.5 20.5 16" }],
  ],
  historico: [
    ["path", { d: "M3.8 12.5A8.3 8.3 0 1 0 6.2 6" }],
    ["path", { d: "M3.8 4.2v4.3h4.3" }],
    ["path", { d: "M12 8v4.2l2.8 1.7" }],
  ],
  pessoa: [
    ["circle", { cx: "12", cy: "8", r: "3.6" }],
    ["path", { d: "M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6" }],
  ],
  predio: [
    ["path", { d: "M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15" }],
    ["path", { d: "M14.5 9.5H18a1 1 0 0 1 1 1v10" }],
    ["path", { d: "M3 20.5h18" }],
    ["path", { d: "M8.5 8.5h3" }],
    ["path", { d: "M8.5 12h3" }],
    ["path", { d: "M8.5 15.5h3" }],
  ],
  brilho: [
    ["path", { d: "M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z" }],
    ["path", { d: "M18.5 16.5v4" }],
    ["path", { d: "M16.5 18.5h4" }],
  ],
  calendario: [
    ["rect", { x: "4", y: "5.5", width: "16", height: "15", rx: "2" }],
    ["path", { d: "M4 10h16" }],
    ["path", { d: "M8.5 3.5v4" }],
    ["path", { d: "M15.5 3.5v4" }],
  ],
  cadeado: [
    ["rect", { x: "5.5", y: "10.5", width: "13", height: "10", rx: "2" }],
    ["path", { d: "M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" }],
  ],
  saida: [
    ["path", { d: "M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14" }],
    ["path", { d: "M10 16l4-4-4-4" }],
    ["path", { d: "M14 12H4.5" }],
  ],
  planilha: [
    ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }],
    ["path", { d: "M4 9.5h16" }],
    ["path", { d: "M4 15h16" }],
    ["path", { d: "M10 9.5V20" }],
  ],
  mover: [
    ["path", { d: "M4.5 12h14" }],
    ["path", { d: "M13.5 6.5 19 12l-5.5 5.5" }],
  ],
  sol: [
    ["circle", { cx: "12", cy: "12", r: "3.8" }],
    ["path", { d: "M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4" }],
  ],
  teclado: [
    ["rect", { x: "3", y: "6.5", width: "18", height: "11", rx: "2" }],
    ["path", { d: "M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8" }],
  ],
  gantt: [
    ["path", { d: "M4 5h9M7 12h11M4 19h7" }],
    ["path", { d: "M3 3v18" }],
  ],
  demandas: [
    ["circle", { cx: "10", cy: "7.8", r: "3.2" }],
    ["path", { d: "M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6" }],
    ["circle", { cx: "17.6", cy: "17.6", r: "4.2" }],
    ["path", { d: "m15.6 17.7 1.5 1.5 2.5-3" }],
  ],
  // Menu do documento na árvore (módulo Processo).
  link: [
    ["path", { d: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" }],
    ["path", { d: "M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" }],
  ],
  novaAba: [
    ["path", { d: "M13.5 4.5H19.5V10.5" }],
    ["path", { d: "M19.5 4.5 11 13" }],
    ["path", { d: "M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4" }],
  ],
  imprimir: [
    ["path", { d: "M7 9V4.5h10V9" }],
    ["rect", { x: "4", y: "9", width: "16", height: "8", rx: "2" }],
    ["path", { d: "M7 14h10v5.5H7z" }],
  ],
  caneta: [
    ["path", { d: "M14.5 5.5 18.5 9.5" }],
    ["path", { d: "M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z" }],
    ["path", { d: "M13 20h7" }],
  ],
  cancelar: [
    ["circle", { cx: "12", cy: "12", r: "8.5" }],
    ["path", { d: "M6 6l12 12" }],
  ],
  duplicar: [
    ["rect", { x: "8.5", y: "8.5", width: "11", height: "11", rx: "2" }],
    ["path", { d: "M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" }],
  ],
  email: [
    ["rect", { x: "3.5", y: "5.5", width: "17", height: "13", rx: "2" }],
    ["path", { d: "M4 7.5l8 6 8-6" }],
  ],
} satisfies Record<string, Forma[]>;

export type NomeIcone = keyof typeof ICONES;
export const NOMES_ICONES = Object.keys(ICONES) as NomeIcone[];

/** `doc` serve a quem desenha em outro documento (o content script na página do SEI, os testes). */
export function icone(nome: NomeIcone, tamanho = 18, doc: Document = document): SVGSVGElement {
  const NS = "http://www.w3.org/2000/svg";
  const svg = doc.createElementNS(NS, "svg");
  const base: Record<string, string> = {
    viewBox: "0 0 24 24",
    width: String(tamanho),
    height: String(tamanho),
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.8",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true",
    focusable: "false",
    class: "spro-icone",
  };
  for (const [k, v] of Object.entries(base)) svg.setAttribute(k, v);
  for (const [tag, attrs] of ICONES[nome] as Forma[]) {
    const el = doc.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    svg.append(el);
  }
  return svg;
}
