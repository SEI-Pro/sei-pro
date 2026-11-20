import { type JanelaFalsa, paginaFalsa } from "./pagina";

export interface SecaoCk5 {
  raiz: string;
  label: string;
  html: string;
  somenteLeitura?: boolean;
  principal?: boolean;
}

export interface FalsoCk5 {
  versao: 5;
  doc: Document;
  win: JanelaFalsa;
}

/** Pagina com `.ck-editor__editable_inline` + `INFRA_EDITOR_CONFIG`. Ampliado nas tarefas dos backends. */
export function criarCk5(opcoes: { secoes: SecaoCk5[] }): FalsoCk5 {
  const { doc, win } = paginaFalsa();
  const rootsAttributes: Record<string, unknown> = {};
  for (const s of opcoes.secoes) {
    const el = doc.createElement("div");
    el.className = "ck-editor__editable ck-editor__editable_inline";
    el.setAttribute("aria-label", s.label);
    doc.body.append(el);
    rootsAttributes[s.raiz] = { label: s.label, somenteLeitura: !!s.somenteLeitura, principal: !!s.principal };
  }
  win.INFRA_EDITOR_CONFIG = { rootsAttributes };
  return { versao: 5, doc, win };
}
