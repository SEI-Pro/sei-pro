import type { Contexto } from "../recursos/tipos";

// biome-ignore lint/suspicious/noExplicitAny: o CKEditor 5 do SEI nao tem tipos; so os membros usados abaixo importam
type Qualquer = any;

/** A instancia que POSSUI o link: no CK4 a secao cujo documento (iframe) contem o `<a>`; no CK5 a unica instancia. */
export function instanciaDoElemento(c: Contexto, el: Element): object | null {
  const a = c.adaptador;
  if (a.versao === 5) return a.getInstance();
  return a.getAllInstances().find((i) => a.getBodyContainer(i)?.ownerDocument === el.ownerDocument) ?? a.getInstance();
}

/** Intervalo do model que o `<a>` ocupa (CK5: o link e um atributo de texto, nao um elemento do model). */
function intervaloCk5(ed: Qualquer, a: Element): Qualquer {
  const visao = ed.editing.view.domConverter.mapDomToView(a);
  return visao ? ed.editing.mapper.toModelRange(ed.editing.view.createRangeOn(visao)) : null;
}

/** O link esta numa secao somente leitura? Recusa (e avisa) em vez de escrever. */
function recusado(c: Contexto, ed: object, a: Element, intervalo: Qualquer): boolean {
  const somenteLeitura =
    c.adaptador.versao === 5
      ? !!(c.win as Qualquer).INFRA_EDITOR_CONFIG?.rootsAttributes?.[intervalo?.root?.rootName]?.somenteLeitura
      : c.adaptador.somenteLeitura(ed);
  if (somenteLeitura) c.adaptador.recusarEscrita();
  void a;
  return somenteLeitura;
}

/** Troca `<a>texto</a>` pelo texto. Um passo de desfazer. */
export function removerLink(c: Contexto, a: Element): boolean {
  const ed = instanciaDoElemento(c, a);
  if (!ed) return false;
  if (c.adaptador.versao === 5) {
    const e = ed as Qualquer;
    const intervalo = intervaloCk5(e, a);
    if (!intervalo || recusado(c, ed, a, intervalo)) return false;
    e.model.change((w: Qualquer) => w.setSelection(intervalo));
    e.execute("unlink");
    return true;
  }
  if (recusado(c, ed, a, null)) return false;
  c.adaptador.withEdit(ed, () => a.replaceWith(...Array.from(a.childNodes)));
  return true;
}

/** Atualiza texto e URL do link. Um passo de desfazer. */
export function editarLink(c: Contexto, a: Element, texto: string, url: string): boolean {
  const ed = instanciaDoElemento(c, a);
  if (!ed) return false;
  if (c.adaptador.versao === 5) {
    const e = ed as Qualquer;
    const intervalo = intervaloCk5(e, a);
    if (!intervalo || recusado(c, ed, a, intervalo)) return false;
    e.model.change((w: Qualquer) => {
      w.setSelection(intervalo);
      e.model.insertContent(w.createText(texto, { linkHref: url }));
    });
    return true;
  }
  if (recusado(c, ed, a, null)) return false;
  c.adaptador.withEdit(ed, () => {
    a.setAttribute("href", url);
    a.setAttribute("data-cke-saved-href", url);
    a.textContent = texto;
  });
  return true;
}
