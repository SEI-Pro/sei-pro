import type { Versao } from "../../src/adaptador/tipos";
import { checar } from "../util";
import { criarCk4, type FalsoCk4, type SecaoCk4 } from "./ck4";
import { criarCk5, type FalsoCk5, type SecaoCk5 } from "./ck5";

export { paginaFalsa } from "./pagina";
export type { FalsoCk4, FalsoCk5 };
export { criarCk4, criarCk5 };

export interface CasoEditor {
  versao: Versao;
  doc: Document;
  win: FalsoCk4["win"];
  ed: FalsoCk4 | FalsoCk5;
}

const SECOES4: SecaoCk4[] = [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html: "<p>texto</p>" }];
const SECOES5: SecaoCk5[] = [{ raiz: "main", label: "Corpo do Texto", html: "<p>texto</p>", principal: true }];

/** Roda `fn` uma vez com o falso CK4 e outra com o falso CK5. */
export async function nosDoisEditores(nome: string, fn: (c: CasoEditor) => void | Promise<void>): Promise<void> {
  for (const ed of [criarCk4({ secoes: SECOES4 }), criarCk5({ secoes: SECOES5 })]) {
    try {
      await fn({ versao: ed.versao, doc: ed.doc, win: ed.win, ed });
    } catch (e) {
      checar(`${nome} [CK${ed.versao}]`, false, e instanceof Error ? e.message : String(e));
    }
  }
}

/** Primeiro <p> do corpo do caso (CK4: do corpo da secao; CK5: da editavel da raiz principal). */
export function primeiroP(c: CasoEditor, raiz = "main"): Element {
  const corpo = c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento(raiz);
  return corpo.querySelector("p") as Element;
}

/** Poe o cursor no elemento `el` (e, no CK5, na raiz `raiz`). */
export function cursorEm(c: CasoEditor, el: Element | null, raiz = "main"): void {
  if (c.versao === 4) (c.ed as FalsoCk4).selecionar("txaEditor_1", { elemento: el });
  else (c.ed as FalsoCk5).selecionar({ raiz, elemento: el });
}

/**
 * O HTML inserido IMEDIATAMENTE antes de `p` pela ultima operacao, ou null se nada foi inserido ali.
 * CK4: o no irmao anterior no DOM do iframe; CK5: a insercao registrada com a posicao "antes de p".
 */
export function inseridoAntes(c: CasoEditor, p: Element): string | null {
  if (c.versao === 4) return p.previousElementSibling?.outerHTML ?? null;
  const ins = (c.ed as FalsoCk5).instancia().insercoes.at(-1);
  const pos = ins?.posicao as { antes?: { elemento?: Element } } | undefined;
  return ins && pos?.antes?.elemento === p ? ins.html : null;
}

/** Poe o cursor em `el` com `texto`/`html` selecionados. */
export function selecionarTexto(c: CasoEditor, el: Element, texto: string, html = texto, raiz = "main"): void {
  if (c.versao === 4) (c.ed as FalsoCk4).selecionar("txaEditor_1", { elemento: el, texto, html });
  else (c.ed as FalsoCk5).selecionar({ raiz, elemento: el, texto, html });
}

/** O ultimo HTML inserido no editor (CK4: `insertHtml`; CK5: `model.insertContent`), ou null. */
export function ultimoInserido(c: CasoEditor): string | null {
  if (c.versao === 4) return (c.ed as FalsoCk4).instancia("txaEditor_1").inseridos.at(-1) ?? null;
  return (c.ed as FalsoCk5).instancia().insercoes.at(-1)?.html ?? null;
}

/** Quantas insercoes o editor recebeu. */
export function totalInseridos(c: CasoEditor): number {
  return c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").inseridos.length : (c.ed as FalsoCk5).instancia().insercoes.length;
}
