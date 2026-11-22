import type { Contexto } from "../recursos/tipos";
import { modeloDe, somenteLeituraDoModelo } from "./ck5";

/**
 * "Ancora" de uma referencia interna (sumario, referencia interna, nota de rodape).
 *  - CK4: o `<a name="..." class="...">` no INICIO do elemento (o formato do legado; o CK4 grava o DOM).
 *  - CK5: a `<a name>` nao sobrevive ao CK5 (medido: descartada no `insertContent` e no `data.set`); a ancora e o
 *    `id` do proprio elemento, posto pelo model (`SeiProGhs.setAtributos`). Os links sao `<a href="#nome">` nos dois.
 *
 * Chame DENTRO de `adaptador.withEdit` quando fizer varias ancoras (um unico passo de desfazer). Devolve false (e
 * avisa a recusa) se o elemento esta numa secao somente leitura ou se o GHS nao esta disponivel.
 */
export function ancorarNoInicio(c: Contexto, ed: object, el: Element, nome: string, classe?: string): boolean {
  const a = c.adaptador;
  if (a.versao === 5) {
    // um unico `id` por elemento: se o titulo ja e ancora de outro recurso (sumario x referencia interna), o `id` fica e vale como destino
    const m = modeloDe(ed, el);
    if (m && somenteLeituraDoModelo(c, m)) {
      a.recusarEscrita();
      return false;
    }
    if (el.id) return true;
    return !!(
      c.win as unknown as { SeiProGhs?: { setAtributos(el: Element, v: Record<string, string>, ed?: object): boolean } }
    ).SeiProGhs?.setAtributos(el, { id: nome }, ed);
  }
  if (a.somenteLeitura(ed)) {
    a.recusarEscrita();
    return false;
  }
  if (classe) for (const antiga of el.querySelectorAll(`a.${classe}`)) antiga.remove();
  const ancora = el.ownerDocument.createElement("a");
  ancora.setAttribute("name", nome);
  if (classe) ancora.className = classe;
  el.prepend(ancora);
  return true;
}

/** O nome (do `<a name>` do CK4 ou do `id` do CK5) que comeca com `prefixo`, ou null. `qualquerId` (CK5): aceita o `id` do elemento seja qual for o prefixo. */
export function nomeDaAncora(el: Element, prefixo: string, qualquerId = false): string | null {
  if (qualquerId && el.id) return el.id;
  const ancora = el.querySelector(`a[name^="${prefixo}"]`);
  if (ancora) return ancora.getAttribute("name");
  return el.id?.startsWith(prefixo) ? el.id : null;
}
