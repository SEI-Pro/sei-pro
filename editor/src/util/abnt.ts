import { capitalizar } from "./capitalizar";
import { dataPorExtenso } from "./data-por-extenso";
import { escaparHtml } from "./html";
import { urlHttpValida } from "./url";

export interface CamposAbnt {
  nome: string;
  sobrenome: string;
  titulo: string;
  edicao: string;
  ano: string;
  local: string;
  editora: string;
  volume: string;
  paginas: string;
  link: string;
  /** `AAAA-MM-DD`. */
  data: string;
}

/**
 * Referencia ABNT em HTML (porte de `updateNrABNT`): `SOBRENOME, Nome. <strong>Titulo</strong>. 2. ed. Local: Editora,
 * ano, v. 3. p.10-20. Disponivel em: <link>. Acesso em: 5 de jan de 2024.` Cada campo vazio some com o seu separador.
 * Diferente do legado, TUDO o que o usuario digita e escapado (o legado punha o texto cru no HTML). `""` se tudo vazio.
 */
export function montarAbnt(campos: CamposAbnt): string {
  const e = (s: string) => escaparHtml(s);
  const preenchido = (s: string) => s !== "";
  const nome = preenchido(campos.nome) ? `, ${e(capitalizar(campos.nome.trim()))}` : "";
  const sobrenome = e(campos.sobrenome.toUpperCase());
  const titulo = preenchido(campos.titulo) ? `. <strong>${e(capitalizar(campos.titulo.trim()))}</strong>` : "";
  const edicao = preenchido(campos.edicao) ? `. ${e(campos.edicao)}. ed.` : "";
  const local = preenchido(campos.local) ? `, ${e(capitalizar(campos.local.trim()))}` : "";
  const editora = preenchido(campos.editora) ? `: ${e(capitalizar(campos.editora.trim()))}` : "";
  const ano = preenchido(campos.ano) ? `, ${e(campos.ano)}` : "";
  const volume = preenchido(campos.volume) ? `, v. ${e(campos.volume)}` : "";
  const paginas = preenchido(campos.paginas) ? `. p.${e(campos.paginas)}` : "";
  const link =
    preenchido(campos.link) && urlHttpValida(campos.link)
      ? `. Disponível em: <a href="${e(campos.link)}" target="_blank">&lt;${e(campos.link)}&gt;</a>`
      : "";
  const dataTexto = dataPorExtenso(campos.data);
  const data = dataTexto ? `. Acesso em: ${dataTexto}` : "";
  const resultado = sobrenome + nome + titulo + edicao + local + editora + ano + volume + paginas + link + data;
  return resultado === "" ? "" : `${resultado}.`;
}
