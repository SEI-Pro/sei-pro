import type { Contexto } from "../recursos/tipos";

/**
 * Clique numa referencia interna ou numa chamada/rodape de nota -> rola ate o paragrafo de destino (o
 * `clickScroolToRef` do legado, que animava o `#divEditores`). Um unico ouvinte delegado por documento de editor
 * (CK4: o iframe de cada secao; CK5: a propria pagina). No CK5 a classe `anchorRefInternaPro` do link cai, entao o
 * link e reconhecido pelo `href`. O destino e o `name`/`id` da ancora; para as notas, o span da chamada/do rodape
 * (`data-ntrodape-ref`), que existe nos dois editores.
 */
export const SELETOR_LINKS_ROLAGEM = 'a[href^="#RefPro_"], a[href^="#footer_"], a[href^="#item_"]';

const ligados = new WeakSet<Document>();
const vigiadas = new WeakSet<object>();

/** Valor entre aspas de um seletor de atributo: so `"` e `\` precisam de escape (dispensa `CSS.escape`, que o proprio nome ja nao traz). */
const aspas = (v: string) => v.replace(/["\\]/g, "\\$&");

function destino(doc: Document, nome: string): Element | null {
  const direto = doc.querySelector(`[name="${aspas(nome)}"], [id="${aspas(nome)}"]`);
  if (direto) return direto;
  const nota = /^(item|footer)_(.+)$/.exec(nome);
  if (!nota) return null;
  return doc.querySelector(`.ntRodape_${nota[1]}[data-ntrodape-ref="${aspas(nota[2] ?? "")}"]`);
}

export function ligarRolagem(c: Contexto): void {
  // CK4: ao reescrever o iframe (modo codigo-fonte, setData) o documento e outro e o ouvinte se perde; religa sozinho
  if (c.adaptador.versao !== 5) {
    for (const ed of c.adaptador.getAllInstances()) {
      if (vigiadas.has(ed)) continue;
      vigiadas.add(ed);
      c.adaptador.on(ed, "contentDom", () => ligarRolagem(c));
    }
  }
  const docs =
    c.adaptador.versao === 5 ? [c.doc] : c.adaptador.getAllInstances().map((i) => c.adaptador.getBodyContainer(i)?.ownerDocument);
  for (const doc of docs) {
    if (!doc || ligados.has(doc)) continue;
    ligados.add(doc);
    doc.addEventListener("click", (ev) => {
      const link = (ev.target as Element | null)?.closest?.(SELETOR_LINKS_ROLAGEM);
      if (!link) return;
      const alvo = destino(doc, (link.getAttribute("href") ?? "").slice(1));
      (alvo?.closest("p") ?? alvo)?.scrollIntoView?.({ behavior: "smooth", block: "center" });
    });
  }
}
