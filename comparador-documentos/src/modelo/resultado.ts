/**
 * Monta o documento do resultado: aplica a `Edicao` sobre o DOM do documento "depois" (a estrutura dele, tabelas e
 * numeração, é a que fica), insere os blocos removidos no lugar e tira imagens repetidas (como o legado).
 *
 * Sem innerHTML: o conteúdo de cada bloco volta a ser DOM por um `DOMParser` (documento inerte) e é importado nó a nó.
 * O HTML que entra já passou por `higienizar` (blocos.ts) e o que se soma aqui é só <ins>/<del> do próprio módulo.
 */
import type { DocumentoBlocos } from "./blocos";
import { COR_ACRESCENTADO, COR_REMOVIDO } from "./constantes";
import type { Edicao } from "./diff";

const MARCAS = [`style="${COR_ACRESCENTADO}"`, `style="${COR_REMOVIDO}"`];

/** Não há nada a mostrar: nenhum bloco removido e nenhum <ins>/<del> do comparador (o <del> do documento não conta). */
export function semDiferencas(ed: Edicao): boolean {
  return ed.removidos.length === 0 && ed.depois.every((h) => !MARCAS.some((m) => h.includes(m)));
}

function nosDe(html: string, destino: Document, parser: DOMParser): Node[] {
  const p = parser.parseFromString(`<html><body>${html}</body></html>`, "text/html");
  return Array.from(p.body.childNodes).map((n) => destino.importNode(n, true));
}

function trocarConteudo(el: Element, nos: Node[]): void {
  while (el.firstChild) el.removeChild(el.firstChild);
  for (const n of nos) el.appendChild(n);
}

/** Antes de qual elemento inserir um bloco removido: em tabela, antes da tabela (um <p> solto entre <td> não é válido). */
function ancora(folha: Element): Element {
  return folha.closest("td,th,tr") ? (folha.closest("table") ?? folha) : folha;
}

export function montarResultado(depois: DocumentoBlocos, ed: Edicao, parser: DOMParser = new DOMParser()): string {
  const { corpo, folhas } = depois;
  const d = corpo.ownerDocument;

  // Blocos removidos primeiro, em ordem (cada um entra logo antes da âncora, então os consecutivos mantêm a ordem do antes).
  for (const r of ed.removidos) {
    const alvo = folhas[r.antesDe];
    const nos = nosDe(r.html, d, parser);
    if (!alvo) for (const n of nos) corpo.appendChild(n);
    else {
      const ref = ancora(alvo);
      for (const n of nos) ref.parentNode?.insertBefore(n, ref);
    }
  }
  folhas.forEach((folha, i) => {
    if (ed.depois[i] !== depois.blocos[i]?.html) trocarConteudo(folha, nosDe(ed.depois[i]!, d, parser));
  });

  const vistos = new Set<string>();
  for (const img of Array.from(corpo.querySelectorAll("img"))) {
    const src = img.getAttribute("src");
    if (!src) continue;
    if (vistos.has(src)) img.remove();
    else vistos.add(src);
  }

  // Só o texto dos <style> do cabeçalho (sem @import): scripts e folhas externas do documento não vêm.
  const estilos = Array.from(d.querySelectorAll("head style"))
    .map((s) => (s.textContent ?? "").replace(/@import[^;]*;?/gi, ""))
    .filter((t) => t.trim())
    .map((t) => `<style>${t}</style>`);
  return `<html><head><meta charset="utf-8">${estilos.join("")}</head>${corpo.outerHTML}</html>`;
}
