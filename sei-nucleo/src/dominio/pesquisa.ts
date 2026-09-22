/**
 * Pesquisa do SEI (menu "Pesquisa", `protocolo_pesquisar`, form `#frmPesquisaProtocolo`).
 *
 * É a mesma pesquisa da tela, com as permissões do usuário: palavras-chave
 * (índice de texto do SEI), especificação, tipo de processo, tipo de
 * documento, número, período. Paginação de 10 em 10 pelo `hdnInicio`.
 *
 * Cada resultado na tela é um trio de linhas em `table.pesquisaResultado`:
 * título (`tr.pesquisaTituloRegistro`: tipo, protocolo e, se documento, o
 * tipo e o nº SEI), trecho (`td.pesquisaSnippet`) e metadados
 * (`td.pesquisaMetatag`: unidade, usuário, data).
 *
 * Substitui no legado: `getTableInfiniteSearch` (só paginava uma pesquisa já
 * feita pelo usuário na tela) e `getTablePesquisaDownload`.
 */

import { Formulario } from "../formulario/formulario";
import { parametros } from "../links/links";
import { textoDe } from "../sessao/dom";
import { ErroSei } from "../sessao/erros";
import type { Pagina } from "../sessao/http";
import type { Sei } from "../sei";

export interface CriteriosPesquisa {
  /** Palavras-chave no conteúdo (índice do SEI). Aceita a sintaxe da tela: "e", "ou", "não", aspas. */
  texto?: string;
  /** `processos` (padrão) ou `documentos`. */
  em?: "processos" | "documentos";
  especificacao?: string;
  /** Nome (ou id) do tipo de processo. */
  tipoProcesso?: string;
  /** Nome (ou id) do tipo de documento. */
  tipoDocumento?: string;
  numeroDocumento?: string;
  /** dd/mm/aaaa */
  dataInicio?: string;
  dataFim?: string;
  /** Até quantos resultados buscar (padrão 50; a tela devolve 10 por página). */
  limite?: number;
}

export interface ResultadoPesquisa {
  protocolo: string;
  tipoProcesso: string;
  /** Presentes quando o resultado é um documento. */
  documento?: { numero: string; tipo: string };
  trecho: string;
  unidade: string;
  usuario: string;
  data: string;
}

export function lerResultados(p: Pagina): { itens: ResultadoPesquisa[]; total: number } {
  const total = Number((/de\s+([\d.]+)\s*$/.exec(textoDe(p.doc.querySelector(".pesquisaBarra"))) ?? [])[1]?.replace(/\./g, "") ?? 0);
  const itens: ResultadoPesquisa[] = [];
  for (const titulo of p.doc.querySelectorAll("table.pesquisaResultado tr.pesquisaTituloRegistro")) {
    const esquerda = titulo.querySelector("td.pesquisaTituloEsquerda");
    const protocoloEl = [...(esquerda?.querySelectorAll("a.protocoloNormal") ?? [])].find((a) => (a.getAttribute("href") ?? "").includes("procedimento_trabalhar"));
    const docEl = titulo.querySelector("td.pesquisaTituloDireita a");
    const snippet = titulo.nextElementSibling;
    const meta = snippet?.nextElementSibling;
    const metatag = (rotulo: string) =>
      textoDe([...(meta?.querySelectorAll("td.pesquisaMetatag") ?? [])].find((td) => textoDe(td).startsWith(rotulo))).replace(/^[^:]+:\s*/, "");
    const tipoDoc = docEl?.getAttribute("title") ?? "";
    itens.push({
      protocolo: textoDe(protocoloEl),
      tipoProcesso: protocoloEl?.getAttribute("title") ?? textoDe(esquerda?.querySelector("span")).replace(/\s*N\u00BA\s*$/, ""),
      ...(docEl ? { documento: { numero: textoDe(docEl), tipo: tipoDoc } } : {}),
      trecho: textoDe(snippet?.querySelector("td.pesquisaSnippet")).replace(/\s*\.\.\.\s*$/, ""),
      unidade: metatag("Unidade"),
      usuario: metatag("Usu"),
      data: metatag("Inclus") || metatag("Data"),
    });
  }
  return { itens, total: total || itens.length };
}

export async function pesquisar(sei: Sei, c: CriteriosPesquisa, sinal?: AbortSignal): Promise<{ total: number; resultados: ResultadoPesquisa[] }> {
  if (!c.texto && !c.especificacao && !c.tipoProcesso && !c.tipoDocumento && !c.numeroDocumento && !c.dataInicio) {
    throw new ErroSei("ARGUMENTO_INVALIDO", "Informe ao menos um crit\u00E9rio de pesquisa.");
  }
  const limite = Math.min(c.limite ?? 50, 500);
  let form = await Formulario.abrir(sei.http, sei.linkMenu("protocolo_pesquisar"), "#frmPesquisaProtocolo", { sinal });
  form.definir({
    q: c.texto ?? "",
    rdoPesquisarEm: c.em === "documentos" ? "D" : "P",
    txtDescricaoPesquisa: c.especificacao ?? "",
    txtNumeroDocumentoPesquisa: c.numeroDocumento ?? "",
    txtDataInicio: c.dataInicio ?? "",
    txtDataFim: c.dataFim ?? "",
    hdnInicio: "0",
  });
  if (c.em === "documentos") form.definir({ chkSinDocumentosGerados: "S", chkSinDocumentosRecebidos: "S" });
  if (c.tipoProcesso) form.escolher("selTipoProcedimentoPesquisa", c.tipoProcesso);
  if (c.tipoDocumento) form.escolher("selSeriePesquisa", c.tipoDocumento);

  let pagina = await form.enviar({ sinal, botao: "sbmPesquisar", aceitarValidacao: true });
  // Com um único resultado o SEI pula direto para o processo.
  if (parametros(pagina.url).get("acao") === "procedimento_trabalhar") {
    const protocolo = textoDe(pagina.doc.querySelector("title")).replace(/^SEI\s*-\s*/, "");
    const idDoc = parametros(pagina.url).get("id_documento");
    const arv = await sei.arvore(protocolo, { sinal });
    const doc = idDoc ? arv.documentos.find((d) => d.id === idDoc) : undefined;
    return {
      total: 1,
      resultados: [{ protocolo, tipoProcesso: arv.tipo, ...(doc ? { documento: { numero: doc.numero, tipo: doc.titulo } } : {}), trecho: "", unidade: "", usuario: "", data: "" }],
    };
  }
  if (parametros(pagina.url).get("acao") !== "protocolo_pesquisar") throw new ErroSei("SEI_RESPOSTA_INESPERADA", "A pesquisa do SEI n\u00E3o respondeu como esperado.");
  let { itens, total } = lerResultados(pagina);
  const todos = [...itens];
  while (todos.length < Math.min(total, limite) && itens.length) {
    form = Formulario.de(pagina, "#frmPesquisaProtocolo", sei.http);
    pagina = await form.definir({ hdnInicio: String(todos.length) }).enviar({ sinal, aceitarValidacao: true });
    ({ itens } = lerResultados(pagina));
    todos.push(...itens);
  }
  return { total, resultados: todos.slice(0, limite) };
}
