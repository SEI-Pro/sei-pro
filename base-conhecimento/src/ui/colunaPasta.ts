/**
 * Coluna "Pasta" e filtro na tabela nativa da Base de Conhecimento.
 *
 * Só mexe no DOM da própria tela: insere a coluna, marca cada linha com o
 * agrupador, pinta o caminho e esconde as linhas fora da pasta selecionada
 * (filtro de verdade; nada de esmaecer texto). O tablesorter reordena as linhas
 * sem recriá-las, então o filtro é reaplicado no `sortEnd`.
 *
 * Toda linha com `td` recebe a célula nova (inclusive a linha de filtros do
 * tablesorter), para as colunas não desalinharem; só as linhas com agrupador são
 * marcadas. `data-label` mantém a tabela responsiva legível.
 */

export const ATRIBUTO_AGRUPADOR = "data-spro-agrupador";
export const ATRIBUTO_CELULA = "data-spro-cel-pasta";
export const ATRIBUTO_TH = "data-spro-th-pasta";

const tabelaDe = (doc: Document): HTMLTableElement | null => doc.querySelector("table.infraTable");

export function prepararTabela(doc: Document, agrupadorDaLinha: (tr: HTMLTableRowElement) => string | null): void {
  const tabela = tabelaDe(doc);
  if (!tabela) return;

  const cabecalho = tabela.querySelector("thead tr");
  const primeiroTh = cabecalho?.querySelector("th");
  if (cabecalho && primeiroTh && !tabela.querySelector(`[${ATRIBUTO_TH}]`)) {
    const th = doc.createElement("th");
    th.className = "infraTh";
    th.setAttribute(ATRIBUTO_TH, "");
    th.textContent = "Pasta";
    primeiroTh.after(th);
  }

  for (const tr of tabela.querySelectorAll("tr")) {
    const primeiroTd = tr.querySelector("td");
    if (!primeiroTd) continue;
    if (tr.querySelector(`td[${ATRIBUTO_CELULA}]`)) continue;
    const daLinha = tr.getAttribute(ATRIBUTO_AGRUPADOR) ?? agrupadorDaLinha(tr as HTMLTableRowElement);
    if (daLinha) tr.setAttribute(ATRIBUTO_AGRUPADOR, daLinha);
    const td = doc.createElement("td");
    td.className = "spro-cel-pasta";
    td.setAttribute(ATRIBUTO_CELULA, "");
    td.setAttribute("data-label", "Pasta");
    primeiroTd.after(td);
  }
}

/** Remove a coluna e as marcas: devolve a tabela nativa ao estado original. */
export function removerTabela(doc: Document): void {
  const tabela = tabelaDe(doc);
  if (!tabela) return;
  for (const th of tabela.querySelectorAll(`[${ATRIBUTO_TH}]`)) th.remove();
  for (const td of tabela.querySelectorAll(`[${ATRIBUTO_CELULA}]`)) td.remove();
  for (const tr of tabela.querySelectorAll(`[${ATRIBUTO_AGRUPADOR}]`)) tr.removeAttribute(ATRIBUTO_AGRUPADOR);
}

export function pintarPastas(doc: Document, rotuloDe: (agrupador: string) => string): void {
  for (const tr of doc.querySelectorAll(`tr[${ATRIBUTO_AGRUPADOR}]`)) {
    const agrupador = tr.getAttribute(ATRIBUTO_AGRUPADOR);
    if (!agrupador) continue;
    const celula = tr.querySelector(`td[${ATRIBUTO_CELULA}]`);
    if (celula) celula.textContent = rotuloDe(agrupador);
  }
}

/** null limpa o filtro; senão esconde (display:none) as linhas fora do conjunto. */
export function filtrarPorPasta(doc: Document, agrupadores: ReadonlySet<string> | null): void {
  for (const tr of doc.querySelectorAll(`tr[${ATRIBUTO_AGRUPADOR}]`)) {
    const linha = tr as HTMLElement;
    const agrupador = linha.getAttribute(ATRIBUTO_AGRUPADOR) ?? "";
    const mostrar = agrupadores === null || agrupadores.has(agrupador);
    linha.style.display = mostrar ? "" : "none";
  }
}

/** Linhas de item visíveis no DOM (a tabela nativa pode estar paginada). */
export function contarLinhasVisiveis(doc: Document): number {
  let n = 0;
  for (const tr of doc.querySelectorAll(`tr[${ATRIBUTO_AGRUPADOR}]`)) {
    if ((tr as HTMLElement).style.display !== "none") n++;
  }
  return n;
}

export function atualizarCaption(doc: Document, total: number): void {
  const caption = doc.querySelector("caption.infraCaption");
  if (!caption) return;
  caption.textContent = `Lista de Procedimentos (${total} ${total === 1 ? "registro" : "registros"}):`;
}

/** Reaplica o filtro depois de o tablesorter reordenar. Devolve a função que desliga. */
export function ligarAoSortDaTabela(doc: Document, reaplicar: () => void): () => void {
  const tabela = tabelaDe(doc);
  if (!tabela) return () => undefined;
  const ouvinte = (): void => reaplicar();
  tabela.addEventListener("sortEnd", ouvinte);
  return () => tabela.removeEventListener("sortEnd", ouvinte);
}
