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
