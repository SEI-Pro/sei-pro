/**
 * Vista Tabela (spec 5.2): uma linha por demanda, colunas ordenáveis, menu de ações na linha (clique ou Enter), edição
 * inline do título e das etiquetas (duplo clique: Enter grava, Esc desfaz) e seleção em lote.
 */

import type { Area } from "@comum/armazenamento/area";
import type { DataISO } from "@comum/datas/dias";
import { alturaRedimensionavel } from "@comum/ui/alturaRedimensionavel";
import { avatar } from "@comum/ui/avatar";
import { h, icone } from "@comum/ui/dom";
import { criarMenu, type EntradaMenu } from "@comum/ui/menu";
import { vinculoSemNumero } from "@projetos/modelo/sigilo";
import type { Prioridade } from "../../modelo/tipos";
import type { DemandaNaTela } from "../dados";
import { dataLonga, tempoHumano } from "../formato";
import { barraDoChecklist, marcaDePrioridade, pilulaDaSituacao, pilulaDoPrazo, seloDoEscopo } from "./pilulas";

export type ColunaTabela = "prioridade" | "titulo" | "responsavel" | "prazo" | "situacao" | "tempo";

export interface OpcoesTabela {
  itens: readonly DemandaNaTela[];
  hoje: DataISO;
  ordenar: { coluna: ColunaTabela; sentido: 1 | -1 };
  aoOrdenar(coluna: ColunaTabela): void;
  /** As entradas do menu de ações da linha (o clique na linha e o Enter abrem este menu). */
  itensDoMenu(alvo: DemandaNaTela): EntradaMenu[];
  aoEditarInline(alvo: DemandaNaTela, campo: "titulo" | "etiquetas", valor: string): Promise<void>;
  selecionadas: ReadonlySet<string>;
  aoSelecionar(id: string, marcada: boolean): void;
  abrirProcesso?(protocolo: string, idProcedimento?: string): void;
  /**
   * Painel embutido: a tabela tem altura limitada (520 px), com rolagem interna e cabeçalho fixo, e uma alça no fim
   * para mudar a altura (@comum/ui/alturaRedimensionavel). Ausente (lateral e página, que já rolam), a tabela cresce solta.
   */
  altura?: { area?: Area | null };
}

const COLUNAS: ReadonlyArray<[ColunaTabela, string]> = [
  ["prioridade", "Prioridade"],
  ["titulo", "Demanda"],
  ["responsavel", "Responsável"],
  ["prazo", "Prazo"],
  ["situacao", "Situação"],
  ["tempo", "Tempo"],
];

const PESO_PRIORIDADE: Record<Prioridade, number> = { urgente: 0, importante: 1, normal: 2 };
const PESO_SITUACAO = { nao_iniciada: 0, iniciada: 1, pausada: 2, concluida: 3, avaliada: 4, arquivada: 5 } as const;

const comparar = (a: string | number, b: string | number): number => (a < b ? -1 : a > b ? 1 : 0);

/** Estável por construção: o desempate é sempre o id, nunca o sentido. */
export function ordenarDemandas(itens: readonly DemandaNaTela[], c: ColunaTabela, sentido: 1 | -1): DemandaNaTela[] {
  const chave = (x: DemandaNaTela): string | number => {
    const d = x.demanda;
    switch (c) {
      case "prioridade":
        return PESO_PRIORIDADE[d.prioridade];
      case "titulo":
        return d.titulo;
      case "responsavel":
        return d.responsavel?.nome ?? "";
      case "prazo":
        return d.prazo;
      case "situacao":
        return PESO_SITUACAO[x.situacao];
      case "tempo":
        return d.tempoGastoMin ?? -1;
    }
  };
  return [...itens].sort((a, b) => {
    const ka = chave(a);
    const kb = chave(b);
    const r = typeof ka === "string" && typeof kb === "string" ? ka.localeCompare(kb, "pt-BR") : comparar(ka, kb);
    return (r ? r * sentido : 0) || comparar(a.demanda.id, b.demanda.id);
  });
}

function textoDoTempo(d: DemandaNaTela["demanda"]): string {
  if (d.tempoGastoMin === undefined && d.tempoEstimadoMin === undefined) return "—";
  const gasto = d.tempoGastoMin !== undefined ? tempoHumano(d.tempoGastoMin) : "—";
  return d.tempoEstimadoMin !== undefined ? `${gasto} de ${tempoHumano(d.tempoEstimadoMin)}` : gasto;
}

export function montarTabelaDemandas(o: OpcoesTabela): HTMLElement {
  const itens = ordenarDemandas(o.itens, o.ordenar.coluna, o.ordenar.sentido);
  const cabecalho = h(
    "tr",
    {},
    h("th", { class: "dem-col-sel" }, h("span", { class: "dem-oculto" }, "Selecionar")),
    ...COLUNAS.map(([id, rotulo]) => {
      const ativa = o.ordenar.coluna === id;
      return h(
        "th",
        { "data-coluna": id, "aria-sort": ativa ? (o.ordenar.sentido === 1 ? "ascending" : "descending") : "none" },
        h(
          "button",
          { type: "button", class: "dem-ordenar", onclick: () => o.aoOrdenar(id) },
          rotulo,
          ativa ? icone(o.ordenar.sentido === 1 ? "setaCima" : "setaBaixo", 12) : null,
        ),
      );
    }),
    h("th", { class: "dem-col-acoes" }, h("span", { class: "dem-oculto" }, "Ações")),
  );
  const caixa = h(
    "div",
    { class: "dem-tabela-caixa" },
    h("table", { class: "dem-tabela" }, h("thead", {}, cabecalho), h("tbody", {}, ...itens.map((x) => linha(x, o)))),
  );
  if (!o.altura) return caixa;
  const controle = alturaRedimensionavel({
    rolagem: caixa,
    chave: "demandas-tabela",
    padraoPx: 520,
    area: o.altura.area ?? null,
    rotulo: "Redimensionar a altura da tabela de demandas",
  });
  return h("div", { class: "dem-tabela-lugar" }, caixa, controle.alca);
}

/** Troca o texto por um campo; Enter grava, Esc desfaz. */
function editarInline(alvoEl: HTMLElement, valor: string, aoGravar: (v: string) => Promise<void>, rotulo: string): void {
  if (alvoEl.querySelector("input")) return;
  const original = [...alvoEl.childNodes];
  const campo = h("input", { type: "text", class: "spro-campo dem-inline", value: valor, "aria-label": rotulo });
  const sair = () => alvoEl.replaceChildren(...original);
  let feito = false;
  campo.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      ev.preventDefault();
      ev.stopPropagation();
      feito = true;
      sair();
    } else if (ev.key === "Enter") {
      ev.preventDefault();
      ev.stopPropagation();
      if (feito) return;
      feito = true;
      void aoGravar(campo.value).finally(() => {
        // A vista redesenha pelo repositório; se não redesenhou (erro), volta ao que estava.
        if (alvoEl.isConnected && alvoEl.contains(campo)) sair();
      });
    }
  });
  alvoEl.replaceChildren(campo);
  campo.focus?.({ preventScroll: true });
}

function linha(x: DemandaNaTela, o: OpcoesTabela): HTMLElement {
  const d = x.demanda;
  const menu = criarMenu({
    rotulo: "Ações da demanda",
    icone: "menu",
    classe: "spro-botao-icone pequeno dem-linha-menu",
    itens: () => o.itensDoMenu(x),
  });
  const marca = h("input", {
    type: "checkbox",
    class: "dem-sel",
    "aria-label": `Selecionar ${d.titulo}`,
    checked: o.selecionadas.has(d.id),
    onchange: (ev: Event) => o.aoSelecionar(d.id, (ev.target as HTMLInputElement).checked),
  });
  const tituloEl = h("span", { class: "dem-titulo-texto", title: "Duplo clique para editar" }, d.titulo);
  const etiquetasEl = h(
    "span",
    { class: "dem-etiquetas", title: "Duplo clique para editar" },
    ...(d.etiquetas.length
      ? d.etiquetas.map((e) => h("span", { class: "dem-etiqueta" }, e))
      : [h("span", { class: "dem-etiqueta-vazia" }, "+ etiqueta")]),
  );
  tituloEl.addEventListener("dblclick", (ev) => {
    ev.stopPropagation();
    editarInline(tituloEl, d.titulo, (v) => o.aoEditarInline(x, "titulo", v), "Título da demanda");
  });
  etiquetasEl.addEventListener("dblclick", (ev) => {
    ev.stopPropagation();
    editarInline(etiquetasEl, d.etiquetas.join(", "), (v) => o.aoEditarInline(x, "etiquetas", v), "Etiquetas (separadas por vírgula)");
  });
  const processos = d.processos.map((p) =>
    vinculoSemNumero(p)
      ? h(
          "span",
          { class: "dem-processo-sigiloso", title: "O número deste processo não está neste computador." },
          icone("cadeado", 12),
          "Processo sigiloso",
        )
      : h(
          "a",
          {
            href: "#",
            class: "dem-processo",
            title: "Abrir o processo",
            onclick: (ev: Event) => {
              ev.preventDefault();
              ev.stopPropagation();
              o.abrirProcesso?.(p.protocolo, p.idProcedimento);
            },
          },
          p.protocolo,
        ),
  );
  const tr = h(
    "tr",
    { class: `dem-tab-linha${x.situacao === "arquivada" ? " dem-arquivada" : ""}`, "data-id": d.id, "data-vis": x.vis, tabindex: "0" },
    h("td", { class: "dem-col-sel" }, marca),
    h("td", { class: "dem-col-prio" }, marcaDePrioridade(d.prioridade) ?? h("span", { class: "dem-prio-nenhuma" })),
    h(
      "td",
      { class: "dem-col-titulo" },
      h("div", { class: "dem-titulo-linha" }, seloDoEscopo(x.vis), tituloEl, barraDoChecklist(d)),
      h(
        "div",
        { class: "dem-titulo-sub" },
        d.etapa
          ? h("span", { class: "dem-etapa", title: `Etapa do projeto: ${d.etapa.rotulo}` }, icone("gantt", 12), d.etapa.rotulo)
          : null,
        ...processos,
        etiquetasEl,
      ),
    ),
    h(
      "td",
      { class: "dem-col-resp" },
      d.responsavel ? h("span", { class: "dem-resp" }, avatar(d.responsavel.nome, { tamanho: 20 }), d.responsavel.nome) : "—",
    ),
    h("td", { class: "dem-col-prazo" }, h("span", { class: "dem-prazo-data" }, dataLonga(d.prazo)), pilulaDoPrazo(x, o.hoje)),
    h("td", { class: "dem-col-situacao" }, pilulaDaSituacao(x)),
    h("td", { class: "dem-col-tempo" }, textoDoTempo(d)),
    h("td", { class: "dem-col-acoes" }, menu),
  );
  const interativo = (el: EventTarget | null) => !!(el as Element | null)?.closest?.("a, button, input, textarea, [role='combobox']");
  tr.addEventListener("click", (ev) => {
    if (!interativo(ev.target)) menu.click();
  });
  tr.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && ev.target === tr) {
      ev.preventDefault();
      menu.click();
    }
  });
  return tr;
}
