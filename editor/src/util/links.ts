import type { Contexto } from "../recursos/tipos";
import { avisarEditor } from "../ui/avisar";

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

/** O `<a>` ainda esta no documento? (o editor reescreve o DOM; um balao ou dialogo antigo pode guardar um `<a>` solto). Avisa se nao. */
function linkVivo(c: Contexto, a: Element): boolean {
  if (a.isConnected) return true;
  avisarEditor(c.doc, "O link não está mais no documento.");
  return false;
}

/** Troca `<a>texto</a>` pelo texto. Um passo de desfazer. */
export function removerLink(c: Contexto, a: Element): boolean {
  if (!linkVivo(c, a)) return false;
  const ed = instanciaDoElemento(c, a);
  if (!ed) return false;
  if (c.adaptador.versao === 5) {
    const e = ed as Qualquer;
    const intervalo = intervaloCk5(e, a);
    if (!intervalo) {
      avisarEditor(c.doc, "Não foi possível localizar o link no editor.");
      return false;
    }
    if (recusado(c, ed, a, intervalo)) return false;
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
  if (!linkVivo(c, a)) return false;
  const ed = instanciaDoElemento(c, a);
  if (!ed) return false;
  if (c.adaptador.versao === 5) {
    const e = ed as Qualquer;
    const intervalo = intervaloCk5(e, a);
    if (!intervalo) {
      avisarEditor(c.doc, "Não foi possível localizar o link no editor.");
      return false;
    }
    if (recusado(c, ed, a, intervalo)) return false;
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

/** Troca o texto de um `<a>` mantendo a formatacao de dentro (`<a><strong>[1]</strong></a>`): o 1o trecho de texto recebe o novo, os demais saem. */
function trocarTexto(a: Element, texto: string): void {
  const trechos: Node[] = [];
  const percorrer = (no: Node) => {
    for (const f of Array.from(no.childNodes)) {
      if (f.nodeType === 3) trechos.push(f);
      else percorrer(f);
    }
  };
  percorrer(a);
  const [primeiro, ...resto] = trechos;
  if (!primeiro) {
    a.textContent = texto;
    return;
  }
  primeiro.textContent = texto;
  for (const t of resto) t.parentNode?.removeChild(t);
}

/**
 * Troca o TEXTO de varios links (o href fica), SEM abrir o proprio passo de desfazer: chame dentro de `withEdit`.
 * CK4: `textContent` no DOM do iframe. CK5: remove o intervalo de cada link e reinsere o texto com `linkHref` (de tras
 * para a frente, para os intervalos anteriores nao se deslocarem), sem mexer na selecao do usuario.
 * Links em secao somente leitura sao pulados (e a recusa avisada). Devolve quantos foram trocados.
 */
export function rotularLinks(c: Contexto, itens: Array<{ a: Element; texto: string }>): number {
  let feitos = 0;
  const ck5: Array<{ a: Element; texto: string; intervalo: Qualquer; ed: Qualquer }> = [];
  for (const { a, texto } of itens) {
    const ed = instanciaDoElemento(c, a);
    if (!ed) continue;
    if (c.adaptador.versao === 5) {
      const intervalo = intervaloCk5(ed, a);
      if (!intervalo || recusado(c, ed, a, intervalo)) continue;
      ck5.push({ a, texto, intervalo, ed });
    } else {
      if (recusado(c, ed, a, null)) continue;
      trocarTexto(a, texto);
      feitos += 1;
    }
  }
  const e = ck5[0]?.ed;
  if (e) {
    e.model.change((w: Qualquer) => {
      for (const { a, texto, intervalo } of [...ck5].reverse()) {
        // o rotulo novo herda a formatacao do antigo (negrito, italico, cor...): le os atributos do 1o trecho de texto antes de remove-lo
        const atributos: Record<string, unknown> = {};
        const primeiro = [...(intervalo.getItems?.() ?? [])].find((i: Qualquer) => typeof i.getAttributes === "function");
        if (primeiro) for (const [k, v] of primeiro.getAttributes()) atributos[k] = v;
        atributos.linkHref = a.getAttribute("href") ?? "";
        w.remove(intervalo);
        w.insertText(texto, atributos, intervalo.start);
        feitos += 1;
      }
    });
  }
  return feitos;
}
