import type { Contexto } from "../recursos/tipos";

// biome-ignore lint/suspicious/noExplicitAny: o CKEditor 5 do SEI nao tem tipos; so os membros usados abaixo importam
type Qualquer = any;

/** Elemento do model que corresponde a um elemento do DOM (null se o DOM nao tem correspondente no model). */
export function modeloDe(ed: Qualquer, dom: Element): Qualquer {
  const visao = ed.editing.view.domConverter.mapDomToView(dom);
  return visao ? ed.editing.mapper.toModelElement(visao) : null;
}

/** O elemento do model esta numa raiz somente leitura (`INFRA_EDITOR_CONFIG.rootsAttributes`)? */
export function somenteLeituraDoModelo(c: Contexto, modelo: Qualquer): boolean {
  const nome = modelo?.root?.rootName;
  return !!(c.win as Qualquer).INFRA_EDITOR_CONFIG?.rootsAttributes?.[nome]?.somenteLeitura;
}
