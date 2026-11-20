import { type JanelaFalsa, paginaFalsa } from "./pagina";

export interface SecaoCk4 {
  nome: string;
  titulo: string;
  html: string;
  somenteLeitura?: boolean;
}

export interface FalsoCk4 {
  versao: 4;
  doc: Document;
  win: JanelaFalsa;
}

/** Pagina com `CKEDITOR.instances` (uma instancia por secao). Ampliado nas tarefas dos backends. */
export function criarCk4(opcoes: { secoes: SecaoCk4[] }): FalsoCk4 {
  const { doc, win } = paginaFalsa();
  const instances: Record<string, unknown> = {};
  for (const s of opcoes.secoes) {
    const cke = doc.createElement("div");
    cke.id = `cke_${s.nome}`;
    cke.className = "cke";
    doc.body.append(cke);
    instances[s.nome] = { name: s.nome, readOnly: !!s.somenteLeitura, config: { title: s.titulo } };
  }
  win.CKEDITOR = { instances };
  return { versao: 4, doc, win };
}
