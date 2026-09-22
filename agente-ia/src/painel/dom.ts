/**
 * DOM do painel sem framework e SEM innerHTML com texto externo: tudo que vem
 * do modelo ou do SEI entra como nó de texto. Markdown é interpretado para
 * nós, não para HTML — um documento lido com `<img onerror>` no texto não tem
 * como virar código no painel da extensão.
 */

type Filho = Node | string | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | boolean | ((ev: Event) => void) | undefined> = {},
  ...filhos: Filho[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    if (typeof v === "function") el.addEventListener(k.replace(/^on/, ""), v);
    else if (v === true) el.setAttribute(k, "");
    else if (k === "class") el.className = v;
    else el.setAttribute(k, v);
  }
  for (const f of filhos) if (f !== null && f !== undefined && f !== false) el.append(f);
  return el;
}

/** Negrito, itálico e código em linha. */
function emLinha(texto: string): Node[] {
  const nos: Node[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;
  let ultimo = 0;
  for (const m of texto.matchAll(re)) {
    if (m.index! > ultimo) nos.push(document.createTextNode(texto.slice(ultimo, m.index)));
    const t = m[0];
    if (t.startsWith("**")) nos.push(h("strong", {}, t.slice(2, -2)));
    else if (t.startsWith("`")) nos.push(h("code", {}, t.slice(1, -1)));
    else nos.push(h("em", {}, t.slice(1, -1)));
    ultimo = m.index! + t.length;
  }
  if (ultimo < texto.length) nos.push(document.createTextNode(texto.slice(ultimo)));
  return nos;
}

/** Markdown enxuto (parágrafos, títulos, listas, tabelas) para nós do DOM. */
export function markdown(texto: string): DocumentFragment {
  const frag = document.createDocumentFragment();
  const linhas = texto.replace(/\r/g, "").split("\n");
  let i = 0;
  while (i < linhas.length) {
    const l = linhas[i];
    if (!l.trim()) {
      i += 1;
      continue;
    }
    const titulo = /^#{1,6}\s+(.*)$/.exec(l);
    if (titulo) {
      frag.append(h("h3", {}, ...emLinha(titulo[1])));
      i += 1;
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(l) && /^\s*\|[\s:|-]+\|\s*$/.test(linhas[i + 1] ?? "")) {
      const cel = (x: string) => x.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const tabela = h("table", {}, h("tr", {}, ...cel(l).map((c) => h("th", {}, ...emLinha(c)))));
      i += 2;
      while (i < linhas.length && /^\s*\|.*\|\s*$/.test(linhas[i])) {
        tabela.append(h("tr", {}, ...cel(linhas[i]).map((c) => h("td", {}, ...emLinha(c)))));
        i += 1;
      }
      frag.append(tabela);
      continue;
    }
    const item = /^\s*(?:[-*\u2022]|(\d+)[.)])\s+(.*)$/.exec(l);
    if (item) {
      const lista = h(item[1] ? "ol" : "ul", {});
      while (i < linhas.length) {
        const it = /^\s*(?:[-*\u2022]|(\d+)[.)])\s+(.*)$/.exec(linhas[i]);
        if (!it) break;
        lista.append(h("li", {}, ...emLinha(it[2])));
        i += 1;
      }
      frag.append(lista);
      continue;
    }
    const par: string[] = [];
    while (i < linhas.length && linhas[i].trim() && !/^#{1,6}\s|^\s*(?:[-*\u2022]|\d+[.)])\s|^\s*\|/.test(linhas[i])) {
      par.push(linhas[i]);
      i += 1;
    }
    const p = h("p", {});
    par.forEach((x, k) => {
      if (k) p.append(h("br", {}));
      p.append(...emLinha(x));
    });
    frag.append(p);
  }
  return frag;
}

/**
 * O que mostrar no medidor do cabeçalho: dólares quando o serviço informa o
 * custo (OpenRouter), tokens quando não informa (serviços compatíveis).
 */
export function formatarUso(u: { entrada: number; saida: number; custo: number }): string {
  if (u.custo) return moeda(u.custo);
  const tokens = u.entrada + u.saida;
  if (!tokens) return "";
  return tokens >= 1000 ? `${(tokens / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}k tokens` : `${tokens} tokens`;
}

/** Duração curta para humanos: "8,4 s", "1 min 12 s". */
export function duracao(ms: number): string {
  const s = ms / 1000;
  if (s < 60) return `${s.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} s`;
  const min = Math.floor(s / 60);
  return `${min} min ${Math.round(s - min * 60)} s`;
}

export function moeda(dolares: number): string {
  return `US$ ${dolares.toLocaleString("pt-BR", { minimumFractionDigits: dolares < 0.1 ? 4 : 2, maximumFractionDigits: dolares < 0.1 ? 4 : 2 })}`;
}

/**
 * Ícones em SVG, desenhados no DOM (sem innerHTML, sem fonte de ícones, sem
 * emoji: emoji muda de forma e de tamanho a cada sistema). Traço em
 * `currentColor`, então o ícone acompanha a cor do botão e o modo escuro.
 */
type Forma = [string, Record<string, string>];
const ICONES: Record<string, Forma[]> = {
  faisca: [
    ["path", { d: "M12 2.6l1.7 5 5 1.7-5 1.7-1.7 5-1.7-5-5-1.7 5-1.7z", fill: "currentColor", stroke: "none" }],
    ["path", { d: "M18.6 14.4l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z", fill: "currentColor", stroke: "none" }],
  ],
  estrela: [["path", { d: "M12 2.2c.7 5 2.6 6.9 7.6 7.6-5 .7-6.9 2.6-7.6 7.6-.7-5-2.6-6.9-7.6-7.6 5-.7 6.9-2.6 7.6-7.6z", fill: "currentColor", stroke: "none" }]],
  mais: [["path", { d: "M12 5v14" }], ["path", { d: "M5 12h14" }]],
  ajustes: [
    ["path", { d: "M4 7h5" }], ["path", { d: "M13 7h7" }], ["circle", { cx: "11", cy: "7", r: "2.1" }],
    ["path", { d: "M4 17h9" }], ["path", { d: "M17 17h3" }], ["circle", { cx: "15", cy: "17", r: "2.1" }],
  ],
  fechar: [["path", { d: "M18 6 6 18" }], ["path", { d: "M6 6l12 12" }]],
  clipe: [["path", { d: "M20.5 11.5l-8.4 8.4a5.3 5.3 0 0 1-7.5-7.5l7.8-7.8a3.5 3.5 0 0 1 5 5l-7.8 7.8a1.8 1.8 0 0 1-2.5-2.5l7.4-7.4" }]],
  setaCima: [["path", { d: "M12 19V6" }], ["path", { d: "M6 12l6-6 6 6" }]],
  parar: [["rect", { x: "7", y: "7", width: "10", height: "10", rx: "2", fill: "currentColor", stroke: "none" }]],
  escudo: [["path", { d: "M12 21.5c4.7-2 7.5-5.4 7.5-9.6V5.5L12 2.5 4.5 5.5v6.4c0 4.2 2.8 7.6 7.5 9.6z" }], ["path", { d: "M9.2 12.2l2 2 3.6-3.9" }]],
  lampada: [["path", { d: "M9.5 18h5" }], ["path", { d: "M10.5 21h3" }], ["path", { d: "M12 3a6 6 0 0 0-3.6 10.8c.6.5.9 1.2.9 2V16h5.4v-.2c0-.8.3-1.5.9-2A6 6 0 0 0 12 3z" }]],
  alerta: [["path", { d: "M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z" }], ["path", { d: "M12 9.5v4" }], ["circle", { cx: "12", cy: "16.8", r: "1", fill: "currentColor", stroke: "none" }]],
  lapis: [["path", { d: "M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z" }], ["path", { d: "M15 6l3 3" }]],
  olho: [["path", { d: "M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" }], ["circle", { cx: "12", cy: "12", r: "2.8" }]],
  olhoCorte: [["path", { d: "M4 4l16 16" }], ["path", { d: "M9.6 6.3A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.8 3.5" }], ["path", { d: "M6.4 8.1A16.6 16.6 0 0 0 2.5 12S6 18 12 18c1 0 1.9-.2 2.7-.4" }], ["path", { d: "M9.6 10.3a3 3 0 0 0 4.2 4.2" }]],
  check: [["path", { d: "M20 6.5 9.2 17.3 4 12.1" }]],
  relogio: [["circle", { cx: "12", cy: "12", r: "9" }], ["path", { d: "M12 7.2V12l3.2 1.9" }]],
  baixar: [["path", { d: "M12 3.5v11" }], ["path", { d: "M7.5 10.2 12 14.7l4.5-4.5" }], ["path", { d: "M4.5 19.5h15" }]],
  lixeira: [["path", { d: "M4.5 6.5h15" }], ["path", { d: "M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7" }], ["path", { d: "M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5" }]],
  balao: [["path", { d: "M20.5 11.8c0 4-3.8 7.2-8.5 7.2-1 0-1.9-.1-2.8-.4L4 20.5l1.4-4.1A6.8 6.8 0 0 1 3.5 11.8C3.5 7.9 7.3 4.7 12 4.7s8.5 3.2 8.5 7.1z" }]],
};

export function icone(nome: keyof typeof ICONES, tamanho = 18): SVGSVGElement {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  for (const [k, v] of Object.entries({ viewBox: "0 0 24 24", width: String(tamanho), height: String(tamanho), fill: "none", stroke: "currentColor", "stroke-width": "1.8", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", class: "svg" })) svg.setAttribute(k, v);
  for (const [tag, attrs] of ICONES[nome]) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    svg.append(el);
  }
  return svg;
}
