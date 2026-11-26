/**
 * Leitura dos itens (procedimentos) da Base de Conhecimento da unidade.
 *
 * A lista é `base_conhecimento_listar` e pagina pelo formulário
 * `#frmBaseConhecimentoLista` (mesmo idioma do `textoPadrao.ts` do núcleo:
 * `hdnInfraPaginaAtual` é 0-based e o "+" aparece quando há próxima página).
 * As colunas são lidas pelo CABEÇALHO, nunca pela posição.
 */

import { Formulario } from "@nucleo/formulario/formulario";
import type { Sei } from "@nucleo/sei";
import { ErroSei } from "@nucleo/sessao/erros";
import type { OpcoesHttp, Pagina } from "@nucleo/sessao/http";
import type { ItemBase } from "./tipos";

export type { ItemBase } from "./tipos";

/** Teto de páginas: nenhuma unidade tem tantos itens, e um laço sem fim travaria a aba. */
export const MAX_PAGINAS_ITENS = 40;

const FORM_LISTA = "#frmBaseConhecimentoLista";

/** O que a leitura usa do `Sei`: o HTTP da sessão e o link do menu. */
export type SeiDosItens = Pick<Sei, "http" | "linkMenu">;

const desfazerAmp = (s: string | null | undefined) => (s ?? "").replace(/&amp;/g, "&");
const texto = (el: Element | null | undefined) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

function indiceDaColuna(doc: Document, rotulo: string): number {
  const ths = [...doc.querySelectorAll("table.infraTable thead th")];
  return ths.findIndex((th) => texto(th) === rotulo);
}

/** O agrupador (estável entre versões) do vínculo de uma linha; sem link de versões, o id da versão. */
export function agrupadorDoTr(tr: Element): string | null {
  const versoes = tr.querySelector('a[href*="base_conhecimento_versoes"]')?.getAttribute("href") ?? "";
  const doAgrupador = /[?&]id_base_conhecimento_agrupador=(\d+)/.exec(versoes)?.[1];
  if (doAgrupador) return doAgrupador;
  const visualizar = desfazerAmp(tr.querySelector('a[href*="base_conhecimento_visualizar"]')?.getAttribute("href"));
  return /[?&]id_base_conhecimento=(\d+)/.exec(visualizar)?.[1] ?? null;
}

/** Todos os itens de UMA página da lista. */
export function itensDaPagina(p: Pagina): ItemBase[] {
  const doc = p.doc;
  const tabela = doc.querySelector("table.infraTable");
  if (!tabela) throw new ErroSei("SEI_RESPOSTA_INESPERADA", "A lista da Base de Conhecimento nao foi encontrada na resposta.");
  const iGerador = indiceDaColuna(doc, "Usu\u00E1rio Gerador");
  const iDataGeracao = indiceDaColuna(doc, "Data Gera\u00E7\u00E3o");
  const iLibUsuario = indiceDaColuna(doc, "Usu\u00E1rio Libera\u00E7\u00E3o");
  const iLibData = indiceDaColuna(doc, "Data Libera\u00E7\u00E3o");

  const itens: ItemBase[] = [];
  for (const tr of tabela.querySelectorAll("tr")) {
    const link = tr.querySelector('a[href*="base_conhecimento_visualizar"]');
    if (!link) continue;
    const href = desfazerAmp(link.getAttribute("href"));
    const id = /[?&]id_base_conhecimento=(\d+)/.exec(href)?.[1];
    if (!id) continue;
    const tds = [...tr.querySelectorAll("td")];
    const cel = (i: number) => (i >= 0 ? texto(tds[i]) : "");
    const liberado = cel(iLibUsuario) !== "" || cel(iLibData) !== "";
    itens.push({
      agrupador: agrupadorDoTr(tr) ?? id,
      id,
      titulo: texto(link),
      gerador: cel(iGerador),
      dataGeracao: cel(iDataGeracao),
      liberado,
      visualizar: href,
    });
  }
  return itens;
}

/** Lê todos os itens da unidade, percorrendo a paginação (sem duplicatas por agrupador). */
export async function lerItensDaUnidade(sei: SeiDosItens, op?: OpcoesHttp): Promise<ItemBase[]> {
  let pagina = await sei.http.obter(sei.linkMenu("base_conhecimento_listar"), op);
  const porAgrupador = new Map<string, ItemBase>();
  for (let n = 0; n < MAX_PAGINAS_ITENS; n++) {
    for (const item of itensDaPagina(pagina)) porAgrupador.set(item.agrupador, item);
    if (!/infraAcaoPaginar\(\s*['"]\+['"]/.test(pagina.html)) break;
    pagina = await Formulario.de(pagina, FORM_LISTA, sei.http)
      .definir({ hdnInfraPaginaAtual: String(n + 1) })
      .enviar(op);
  }
  return [...porAgrupador.values()];
}
