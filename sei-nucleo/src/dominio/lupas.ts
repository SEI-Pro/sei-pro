/**
 * Listas de lupa (interessados, assuntos) e o autocompletar das telas.
 *
 * `aplicarModo` decide a lista final a partir da atual; quem grava é
 * `Formulario.definirLupa`. O autocompletar usa o link que a própria tela
 * declara em `new infraAjaxAutoCompletar('hdnIdX','txtX','<link>')`: o link é
 * colhido, nunca montado.
 */

import type { ItemLupa } from "../formulario/formulario";
import { paraLatin1Seguro } from "../sessao/codificacao";
import { decodificarEntidades } from "../sessao/dom";
import type { Sei } from "../sei";

export type ModoLista = "acrescentar" | "remover" | "substituir";

export interface AlteracaoLista {
  modo: ModoLista;
  itens: ItemLupa[];
}

function semRepetir(itens: ItemLupa[]): ItemLupa[] {
  const vistos = new Set<string>();
  return itens.filter((i) => !vistos.has(i.id) && vistos.add(i.id));
}

/** Lista final da lupa. Ids comparados por igualdade exata. */
export function aplicarModo(atuais: ItemLupa[], modo: ModoLista, itens: ItemLupa[]): ItemLupa[] {
  if (modo === "substituir") return semRepetir(itens);
  const ids = new Set(itens.map((i) => i.id));
  if (modo === "remover") return atuais.filter((a) => !ids.has(a.id));
  return semRepetir([...atuais, ...itens]);
}

function escaparRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Link do `infraAjaxAutoCompletar` cujo campo oculto é `hdnId` (ex.: `hdnIdInteressado`), ou null. */
export function linkAutoCompletar(html: string, hdnId: string): string | null {
  const re = new RegExp(`new\\s+infraAjaxAutoCompletar\\(\\s*['"]${escaparRegex(hdnId)}['"]\\s*,\\s*['"][\\w-]+['"]\\s*,\\s*['"]([^'"]+)['"]`);
  const m = re.exec(html);
  return m ? decodificarEntidades(m[1]) : null;
}

/**
 * O `prepararExecucao` do autocompletar de `hdnId` já passa o valor por `encodeURIComponent` (o do interessado
 * passa; o do assunto, não). Nesse caso o PHP faz `fromUTF8(urldecode(...))` e o valor tem de ir codificado duas
 * vezes, como a tela manda.
 */
export function valorCodificadoNoAutoCompletar(html: string, hdnId: string): boolean {
  const re = new RegExp(`(\\w+)\\s*=\\s*new\\s+infraAjaxAutoCompletar\\(\\s*['"]${escaparRegex(hdnId)}['"]`);
  const nome = re.exec(html)?.[1];
  if (!nome) return false;
  const corpo = new RegExp(`\\b${escaparRegex(nome)}\\.prepararExecucao\\s*=\\s*function\\s*\\([^)]*\\)\\s*\\{([^}]*)\\}`).exec(html)?.[1];
  return !!corpo && /encodeURIComponent\s*\(/.test(corpo);
}

/**
 * Pesquisa pelo autocompletar: o `prepararExecucao` da tela envia só `palavras_pesquisa`. O corpo vai em UTF-8,
 * como o `infraAjaxPost` (o `controlador_ajax.php` decodifica todo o POST de UTF-8; em Latin-1, "administração"
 * chegava como "administra??o" e nada casava). `valorCodificado`: a tela já codifica o valor
 * (`valorCodificadoNoAutoCompletar`), e ele vai codificado mais uma vez.
 */
export async function pesquisarNoAutoCompletar(
  sei: Sei,
  link: string,
  termo: string,
  sinal?: AbortSignal,
  valorCodificado = false,
): Promise<ItemLupa[]> {
  const valor = valorCodificado ? encodeURIComponent(paraLatin1Seguro(termo)) : termo;
  const itens = await sei.ajax(link, [["palavras_pesquisa", valor]], { sinal, utf8: true });
  // O SEI manda `descricao` ja escapado dentro do XML (dupla codificacao): o parser tira uma camada e sobra `&quot;`.
  return semRepetir(itens.map((i) => ({ ...i, texto: decodificarEntidades(i.texto) })));
}

/**
 * Itens que a unidade NÃO pode retirar do processo: o SEI declara, no script da tela "Consultar/Alterar Processo",
 * `arrAssuntosNegados[n] = {id_assunto:'..',sigla_unidade:'..'}` e `arrInteressadosNegados[n] = {id_contato:'..', sigla_unidade:'..'}`
 * (foram acrescentados por outra unidade). Devolve id -> sigla da unidade que acrescentou.
 */
export function lerNegados(html: string, tipo: "assunto" | "interessado"): Map<string, string> {
  const nome = tipo === "assunto" ? "arrAssuntosNegados" : "arrInteressadosNegados";
  const chave = tipo === "assunto" ? "id_assunto" : "id_contato";
  const re = new RegExp(`${nome}\\[\\d+\\]\\s*=\\s*\\{\\s*${chave}\\s*:\\s*['"]([^'"]*)['"]\\s*,\\s*sigla_unidade\\s*:\\s*['"]([^'"]*)['"]`, "g");
  const saida = new Map<string, string>();
  for (const m of html.matchAll(re)) saida.set(m[1] as string, m[2] as string);
  return saida;
}
