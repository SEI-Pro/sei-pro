/**
 * Glifos PREENCHIDOS dos painéis do processo: o mesmo estilo e o mesmo peso visual dos ícones `fas fa-*` do legado
 * (a lupa de "Consultar Andamento", `azulColor iconDadosProcesso`), mas em SVG próprio: sem fonte de ícones, sem jQuery e
 * sem depender de a página carregar o Font Awesome. A forma é desenhada à mão numa grade de 24 (arte quase de ponta a ponta,
 * como os glifos da fonte, que ocupam o quadrado todo); a cor vem de `currentColor`.
 *
 * Equivalência com o legado: nota = sticky-note, usuarioGravata = user-tie, etiquetas = tags, olho = eye, livro = book,
 * favorito = bookmark, usuarios = users, balaoPontos = comment-dots, balao = comment-alt, caixa = inbox,
 * globo/cadeado/semUsuario = globe-americas/lock/user-slash (o nível de acesso troca o ícone do cabeçalho).
 */

/** Cada forma é um `path` (com `fill-rule: evenodd`, para os furos). */
export const GLIFOS = {
  // sticky-note: quadrado com a dobra no canto de baixo à direita (um furo contorna a aba, que fica dentro dele).
  nota: [
    "M3.5 2h17A1.5 1.5 0 0 1 22 3.5V14l-8 8H3.5A1.5 1.5 0 0 1 2 20.5v-17A1.5 1.5 0 0 1 3.5 2z",
    "M22 13.4H13.4V22H14l8-8z",
    "M21 15h-6v6z",
  ],
  // user-tie: cabeça, ombros com a gola em V e a gravata.
  usuarioGravata: [
    "M12 1.6a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2z",
    "M7.4 12.2C4.7 13.1 3 15.4 3 18.4v2.1c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-2.1c0-3-1.7-5.3-4.4-6.2L12 17.6z",
    "M11 13.3h2l.7 1.7-1.3 6.2-.4.4-.4-.4-1.3-6.2z",
  ],
  // tags: a etiqueta grande (com o furo) e a borda da segunda, atrás.
  etiquetas: [
    "M2 3.7C2 2.8 2.8 2 3.7 2h6.1c.5 0 .9.2 1.3.5l9.4 9.4c.7.7.7 1.8 0 2.5l-5.6 5.6c-.7.7-1.8.7-2.5 0L2.5 10.6C2.2 10.2 2 9.8 2 9.3z",
    "M7.1 5.2a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8z",
    "M13.6 2h2.2c.5 0 .9.2 1.3.5l5.1 5.1c.7.7.7 1.8 0 2.5l-5.3 5.3-1.6-1.6 4.7-4.7c.3-.3.3-.8 0-1.1z",
  ],
  // tag (uma etiqueta só, com o furo do cordão): a do marcador, que ganha a cor dele (ui/tagMarcador.ts).
  tag: [
    "M3 4.5A1.5 1.5 0 0 1 4.5 3h6.6c.4 0 .8.2 1.1.4l8.4 8.4c.6.6.6 1.5 0 2.1l-6.6 6.6c-.6.6-1.5.6-2.1 0L3.4 12.1c-.3-.3-.4-.7-.4-1.1z",
    "M7.8 6.1a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4z",
  ],
  // eye: amêndoa cheia com a íris vazada e a pupila cheia.
  olho: [
    "M12 4.2C6.6 4.2 2.4 8 .9 12c1.5 4 5.7 7.8 11.1 7.8s9.6-3.8 11.1-7.8C21.6 8 17.4 4.2 12 4.2z",
    "M12 6.9a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2z",
    "M12 9.6a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z",
  ],
  // book: capa com lombada, a placa do título vazada e a borda das páginas embaixo.
  livro: [
    "M6 2h13.5c.8 0 1.5.7 1.5 1.5V17c0 .6-.3 1.1-.8 1.3v2.4c.5.2.8.7.8 1.3 0 .8-.7 1.5-1.5 1.5H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z",
    "M8 5.8h9v2.6H8z",
    "M6 18.3h12.7V20.6H6A1.15 1.15 0 0 1 6 18.3z",
  ],
  // bookmark.
  favorito: ["M5.5 2h13c.8 0 1.5.7 1.5 1.5V22.3l-8-5.6-8 5.6V3.5C4 2.7 4.7 2 5.5 2z"],
  // users: duas pessoas.
  usuarios: [
    "M9 3.4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z",
    "M2 20.4c0-3.8 2.8-6.4 7-6.4s7 2.6 7 6.4v.2c0 .8-.6 1.4-1.4 1.4H3.4C2.6 22 2 21.4 2 20.6z",
    "M17.2 4.6a3.3 3.3 0 1 1 0 6.6c-.4 0-.8-.1-1.2-.2a5.6 5.6 0 0 0 0-5.6c.4-.5.7-.8 1.2-.8z",
    "M17.6 13.2c2.4.5 4.4 2.4 4.4 5.4v2c0 .8-.6 1.4-1.4 1.4h-2.7c.3-.4.5-.9.5-1.4v-.2c0-2.4-.8-4.4-2.1-5.8.4-.5.8-1 1.3-1.4z",
  ],
  // comment-dots: balão com três pontos vazados.
  balaoPontos: [
    "M12 2.4c-5.8 0-10.5 3.8-10.5 8.6 0 2.2 1 4.2 2.8 5.7-.2 1.5-.8 2.8-1.7 3.9-.3.3 0 .8.4.8 2.2 0 4.1-.9 5.4-1.8.9.2 1.7.3 2.6.3 5.8 0 10.5-3.9 10.5-8.9S17.8 2.4 12 2.4z",
    "M7.4 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z",
    "M12 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z",
    "M16.6 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z",
  ],
  // comment-alt: balão com o rabinho embaixo, à esquerda.
  balao: ["M4 2.5h16A2.5 2.5 0 0 1 22.5 5v10.5a2.5 2.5 0 0 1-2.5 2.5h-6.2l-5.1 4v-4H4a2.5 2.5 0 0 1-2.5-2.5V5A2.5 2.5 0 0 1 4 2.5z"],
  // inbox: a bandeja, com o miolo vazado e o encaixe no meio.
  caixa: [
    "M5.4 3h13.2c.6 0 1.2.4 1.4 1l2 7.2V19c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-7.8l2-7.2c.2-.6.8-1 1.4-1z",
    "M5.4 6.2 4.2 11.2H8.8l1 2.6h4.4l1-2.6h4.6L18.6 6.2z",
  ],
  // globe-americas: a esfera com os dois continentes vazados.
  globo: [
    "M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z",
    "M7.6 4.8 11 4.2l1.3 2.4-1.8 1.9.5 2.4-3 1-2.4-1.4-.1-2.9z",
    "M12.8 13.6l2.8-.7 2.6 2.2-1 4-2.6 2.8-1.4-1.4.7-3.7z",
  ],
  // lock.
  cadeado: [
    "M5 10h14a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 22H5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 5 10z",
    "M7.5 10V7a4.5 4.5 0 0 1 9 0v3h-2.4V7a2.1 2.1 0 0 0-4.2 0v3z",
    "M12 13.7a1.7 1.7 0 0 1 .8 3.2l.4 2.6h-2.4l.4-2.6a1.7 1.7 0 0 1 .8-3.2z",
  ],
  // user-slash.
  semUsuario: [
    "M12 1.6a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2z",
    "M7.4 12.2C4.7 13.1 3 15.4 3 18.4v2.1c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-2.1c0-3-1.7-5.3-4.4-6.2-1.2 1.2-2.8 1.8-4.6 1.8s-3.4-.6-4.6-1.8z",
    "M2.6 4.4 4 3l17.5 17.5-1.4 1.4z",
  ],
  // ----- ações e ferramentas (discretas, cinza, preenchidas) -----
  lapis: ["M3 17.3V21h3.7L18.6 9.1l-3.7-3.7z", "M21.5 6.2a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7z"],
  lixeira: ["M6 21c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8H6z", "M19 4h-3.5l-1-1h-5l-1 1H5v2h14z"],
  mais: ["M10.5 3h3v7.5H21v3h-7.5V21h-3v-7.5H3v-3h7.5z"],
  alerta: ["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z", "M10.6 6.5h2.8v7.3h-2.8z", "M10.6 15.6h2.8v2.8h-2.8z"],
  chevron: ["M3.5 8.2 5.4 6.3 12 12.9l6.6-6.6 1.9 1.9L12 16.7z"],
  disquete: ["M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7z", "M12 12.6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z", "M5.5 5h8v4h-8z"],
  checkQuadro: [
    "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
    "M10.4 16.9 6.2 12.7l1.4-1.4 2.8 2.8 6-6 1.4 1.4z",
  ],
  calendarioMais: [
    "M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2z",
    "M11 10.5h2v2.5h2.5v2H13v2.5h-2V15H8.5v-2H11z",
  ],
  fechar: [
    "M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z",
    "M8.2 9.6 9.6 8.2 12 10.6l2.4-2.4 1.4 1.4-2.4 2.4 2.4 2.4-1.4 1.4-2.4-2.4-2.4 2.4-1.4-1.4 2.4-2.4z",
  ],
  // search: aro com cabo.
  lupa: ["M10.5 2a8.5 8.5 0 0 1 6.7 13.7l5.4 5.4-2.1 2.1-5.4-5.4A8.5 8.5 0 1 1 10.5 2z", "M10.5 5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"],
  cima: ["M12 3.5 4.5 11h5v9.5h5V11h5z"],
  baixo: ["M12 20.5 4.5 13h5V3.5h5V13h5z"],
} satisfies Record<string, string[]>;

export type NomeGlifo = keyof typeof GLIFOS;

/** SVG preenchido (`currentColor`), 24x24 na grade, `tamanho` px na tela. `doc` serve a quem desenha em outro documento. */
export function glifo(nome: NomeGlifo, tamanho = 16, doc: Document = document): SVGSVGElement {
  const NS = "http://www.w3.org/2000/svg";
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
  p.setAttribute("d", GLIFOS[nome].join(""));
  p.setAttribute("fill-rule", "evenodd");
  svg.append(p);
  return svg;
}
