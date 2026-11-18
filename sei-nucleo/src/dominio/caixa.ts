/**
 * Caixa da unidade — Controle de Processos (`procedimento_controlar`).
 *
 * Lê as tabelas de Recebidos e Gerados, percorrendo a paginação da própria
 * tela (`hdnRecebidosPaginaAtual`, `hdnGeradosPaginaAtual`). Cada linha traz,
 * sem requisição extra: protocolo, tipo, especificação (no `aria-label`),
 * sigilo, atribuição e os sinais da segunda coluna (anotação, marcadores,
 * prazos...), no texto que o próprio SEI dá aos leitores de tela.
 *
 * Substitui no legado: `getProcessoUnidadePro`, `getProcessosPaginacao`,
 * `getMapaControleProcesso`, `getListTypes` (agrupamento vira código do agente).
 */

import { Formulario } from "../formulario/formulario";
import { parametros } from "../links/links";
import { textoDe } from "../sessao/dom";
import { chamadas, texto } from "../sessao/literais";
import type { Pagina } from "../sessao/http";
import type { Sei } from "../sei";

export interface ProcessoNaCaixa {
  idProcedimento: string;
  protocolo: string;
  grupo: "recebidos" | "gerados";
  tipo: string;
  especificacao: string;
  sigiloso: boolean;
  /** Não visualizado desde que chegou à unidade. */
  novo: boolean;
  atribuido: string;
  /** Anotação, marcadores, prazos, retorno programado... como o SEI descreve. */
  sinais: string[];
  /** Ícone de exclamação: documento incluído ou assinado desde a última visita da unidade. */
  documentoNovo: boolean;
}

/**
 * Tipo e especificação do processo. O SEI 4.1 e o 5 trazem os dois no `aria-label`
 * do checkbox; o SEI 4.0 não tem esse rótulo e só os mostra no tooltip da âncora
 * do processo, `infraTooltipMostrar('Especificação', 'Tipo')`, lido como literal
 * (com aspas escapadas), sem executar nada. Tooltip de um argumento só é
 * ambíguo (pode ser só a especificação), então não vira tipo. Correção do SEI 4.0
 * proposta por @laestacheski (PR #189).
 */
function lerTipoEEspecificacao(rotulo: string, link: Element): { tipo: string; especificacao: string } {
  const tipo = /Tipo (.*?)(?: \/ Especifica|$)/.exec(rotulo)?.[1]?.trim() ?? "";
  const especificacao = /Especifica\S* (.*)$/.exec(rotulo)?.[1]?.trim() ?? "";
  if (tipo) return { tipo, especificacao };
  const args = chamadas(link.getAttribute("onmouseover") ?? "", "infraTooltipMostrar")[0];
  if (args && args.length >= 2) return { tipo: texto(args[1]).trim(), especificacao: texto(args[0]).trim() };
  return { tipo, especificacao };
}

/**
 * Uma linha da caixa (`tr#P<id>`). É exportada porque o content script do
 * favoritos lê a MESMA tela que o usuário vê, sem requisição nenhuma, e põe
 * a estrela na linha.
 */
export function lerLinhaCaixa(tr: Element, grupo: "recebidos" | "gerados"): ProcessoNaCaixa | null {
  const chk = tr.querySelector("input[type=checkbox]");
  const link = tr.querySelector("a[href*='procedimento_trabalhar']");
  if (!chk || !link) return null;
  const rotulo = chk.getAttribute("aria-label") ?? "";
  const sigiloso = /^Sigiloso\b/.test(rotulo) || /Sigiloso/.test(link.getAttribute("class") ?? "");
  const tipoEEspecificacao = lerTipoEEspecificacao(rotulo, link);
  const tds = [...tr.querySelectorAll("td")];
  const sinais = sigiloso ? [] : [...(tds[1]?.querySelectorAll("a[aria-label]") ?? [])].map((a) => a.getAttribute("aria-label") ?? "");
  return {
    idProcedimento: chk.getAttribute("value") ?? parametros(link.getAttribute("href") ?? "").get("id_procedimento") ?? "",
    protocolo: chk.getAttribute("title") ?? textoDe(link),
    grupo,
    tipo: tipoEEspecificacao.tipo,
    // Especificação de processo sigiloso não sai daqui (regra do agente).
    especificacao: sigiloso ? "" : tipoEEspecificacao.especificacao,
    sigiloso,
    novo: /NaoVisualizado/.test(link.getAttribute("class") ?? ""),
    atribuido: textoDe(tds[tds.length - 1]).replace(/^\(|\)$/g, ""),
    sinais,
    documentoNovo: !!tds[1]?.querySelector("img[src*='exclamacao']") || sinais.some((s) => /documento foi inclu/i.test(s)),
  };
}

function lerTabela(p: Pagina, grupo: "recebidos" | "gerados"): { itens: ProcessoNaCaixa[]; total: number } {
  const id = grupo === "recebidos" ? "#tblProcessosRecebidos" : "#tblProcessosGerados";
  const tabela = p.doc.querySelector(id);
  const total = Number(/\((\d+)\s+registro/.exec(textoDe(tabela?.querySelector("caption")))?.[1] ?? 0);
  const itens: ProcessoNaCaixa[] = [];
  for (const tr of tabela?.querySelectorAll("tr[id^='P']") ?? []) {
    const item = lerLinhaCaixa(tr, grupo);
    if (item) itens.push(item);
  }
  return { itens, total };
}

/** Processos da caixa na tela JÁ CARREGADA (só a página visível de cada grupo), sem requisição. */
export function lerCaixaDaPagina(p: Pagina): ProcessoNaCaixa[] {
  return [...lerTabela(p, "recebidos").itens, ...lerTabela(p, "gerados").itens];
}

/** Todos os processos da caixa (até `limite`), dos dois grupos. */
export async function listarCaixa(
  sei: Sei,
  o: { limite?: number; sinal?: AbortSignal } = {},
): Promise<{ total: number; processos: ProcessoNaCaixa[] }> {
  const limite = o.limite ?? 2000;
  let pagina = await sei.http.obter(sei.linkMenu("procedimento_controlar"), { sinal: o.sinal, aceitarValidacao: true });
  const saida: ProcessoNaCaixa[] = [];
  let total = 0;
  for (const grupo of ["recebidos", "gerados"] as const) {
    const campo = grupo === "recebidos" ? "hdnRecebidosPaginaAtual" : "hdnGeradosPaginaAtual";
    let { itens, total: t } = lerTabela(pagina, grupo);
    total += t;
    saida.push(...itens);
    let lidos = itens.length;
    let paginou = false;
    for (let n = 1; lidos < t && itens.length > 0 && saida.length < limite; n += 1) {
      pagina = await Formulario.de(pagina, "#frmProcedimentoControlar", sei.http)
        .definir({ hdnRecebidosPaginaAtual: "0", hdnGeradosPaginaAtual: "0", [campo]: String(n) })
        .enviar({ sinal: o.sinal, aceitarValidacao: true });
      ({ itens } = lerTabela(pagina, grupo));
      lidos += itens.length;
      saida.push(...itens);
      paginou = true;
    }
    if (paginou) {
      // Volta a tela do usuário para a primeira página (o SEI guarda a página na sessão).
      pagina = await Formulario.de(pagina, "#frmProcedimentoControlar", sei.http)
        .definir({ hdnRecebidosPaginaAtual: "0", hdnGeradosPaginaAtual: "0" })
        .enviar({ sinal: o.sinal, aceitarValidacao: true });
    }
  }
  return { total, processos: saida.slice(0, limite) };
}
