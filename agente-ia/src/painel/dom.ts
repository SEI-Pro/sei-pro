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

export function moeda(dolares: number): string {
  return `US$ ${dolares.toLocaleString("pt-BR", { minimumFractionDigits: dolares < 0.1 ? 4 : 2, maximumFractionDigits: dolares < 0.1 ? 4 : 2 })}`;
}
