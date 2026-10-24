/**
 * Exportar o histórico: CSV da tabela de passagens (BOM, ponto e vírgula, aspas: `gerarCsv` do `@comum`) e a visão para
 * impressão. As datas são o relógio do SEI (sem fuso).
 */
import { gerarCsv } from "@comum/csv";
import { h } from "@comum/ui/dom";
import type { Passagem } from "@nucleo/dominio/passagens";
import { resumoDoTempo, rotuloDoComparativo, tempoPorUnidade } from "./comparativo";
import {
  DIA_MS,
  diasDe,
  type Escala,
  formatarData,
  formatarDataHora,
  formatarDuracao,
  numeroBR,
  pessoa,
  ROTULO_SITUACAO,
  situacaoDa,
  tituloDoDocumento,
} from "./modelo";
import { montarGantt } from "./svg";

export const CABECALHO_CSV = [
  "Unidade",
  "Nome da unidade",
  "Situação",
  "Recebido em",
  "Enviado em",
  "Duração (dias)",
  "Duração",
  "Recebido por",
  "Enviado por",
  "Veio de",
  "Enviado para",
  "Documentos gerados",
  "Documentos",
] as const;

/** Uma linha por passagem, da mais antiga para a mais recente. Em curso: “Enviado em” vazio e duração até agora. */
export function gerarCsvPassagens(passagens: readonly Passagem[]): string {
  const ordenadas = [...passagens].sort((a, b) => a.recebido.getTime() - b.recebido.getTime());
  const linhas: string[][] = [[...CABECALHO_CSV]];
  for (const p of ordenadas) {
    const enviado = p.remetido ?? p.enviouEm ?? null;
    linhas.push([
      p.unidade,
      p.unidadeNome ?? "",
      ROTULO_SITUACAO[situacaoDa(p)],
      formatarDataHora(p.recebido),
      enviado ? formatarDataHora(enviado) : "",
      numeroBR(Math.round((p.duracaoMs / DIA_MS) * 100) / 100),
      formatarDuracao(p.duracaoMs),
      p.pendenteRecebimento ? "" : pessoa(p.usuarioRecebeu, p.usuarioRecebeuNome),
      pessoa(p.usuarioEnviou, p.usuarioEnviouNome),
      p.origem ?? "",
      p.destinos.join(", "),
      String(p.documentos.length),
      p.documentos.map((d) => `${tituloDoDocumento(d)} (${formatarData(d.em)})`).join(" | "),
    ]);
  }
  return gerarCsv(linhas);
}

/** Nome do arquivo: “historico-<protocolo>.csv”, só com caracteres seguros. */
export function nomeDoCsv(protocolo: string): string {
  const seguro = protocolo.replace(/[^0-9A-Za-z.-]+/g, "_").replace(/^_+|_+$/g, "");
  return `historico-${seguro || "processo"}.csv`;
}

/** Baixa o texto como arquivo, no documento dado. Devolve o endereço temporário (os testes o inspecionam). */
export function baixarArquivo(doc: Document, nome: string, texto: string, tipo = "text/csv;charset=utf-8"): string {
  const win = doc.defaultView ?? window;
  const url = win.URL.createObjectURL(new win.Blob([texto], { type: tipo }));
  const a = doc.createElement("a");
  a.href = url;
  a.download = nome;
  a.style.display = "none";
  doc.body.append(a);
  a.click();
  a.remove();
  win.setTimeout(() => win.URL.revokeObjectURL(url), 30_000);
  return url;
}

// --- Visão para impressão ------------------------------------------------------------------------------------

export const CLASSE_IMPRESSAO = "spro-g-impressao";

export interface DadosImpressao {
  protocolo: string;
  passagens: readonly Passagem[];
  /** Relógio de hoje (como as passagens). */
  agora: Date;
  coletadoEm?: Date;
}

/** A página que sai no papel: título, tabela de passagens, tempo por unidade e o desenho completo numa só largura. */
export function montarVisaoDeImpressao(d: DadosImpressao, escala: Escala = "mes"): HTMLElement {
  const resumo = resumoDoTempo(d.passagens);
  const tempos = tempoPorUnidade(d.passagens);
  const ordenadas = [...d.passagens].sort((a, b) => a.recebido.getTime() - b.recebido.getTime());
  const tabelaPassagens = h(
    "table",
    { class: "spro-g-tabela" },
    h(
      "thead",
      {},
      h("tr", {}, ...["Unidade", "Situação", "Recebido em", "Enviado em", "Duração", "Documentos"].map((t) => h("th", {}, t))),
    ),
    h(
      "tbody",
      {},
      ...ordenadas.map((p) =>
        h(
          "tr",
          {},
          h("td", {}, p.unidade),
          h("td", {}, ROTULO_SITUACAO[situacaoDa(p)]),
          h("td", {}, formatarDataHora(p.recebido)),
          h("td", {}, (p.remetido ?? p.enviouEm) ? formatarDataHora((p.remetido ?? p.enviouEm) as Date) : ""),
          h("td", {}, formatarDuracao(p.duracaoMs)),
          h("td", {}, String(p.documentos.length)),
        ),
      ),
    ),
  );
  const tabelaTempo = h(
    "table",
    { class: "spro-g-tabela" },
    h("thead", {}, h("tr", {}, ...["Unidade", "Dias", "% do total", "Passagens"].map((t) => h("th", {}, t)))),
    h(
      "tbody",
      {},
      ...tempos.map((t) =>
        h(
          "tr",
          {},
          h("td", {}, rotuloDoComparativo(t)),
          h("td", {}, numeroBR(t.dias)),
          h("td", {}, `${numeroBR(t.percentual)}%`),
          h("td", {}, String(t.passagens)),
        ),
      ),
    ),
  );
  const desenho = montarGantt(d.passagens, escala, { agora: d.agora, larguraAlvo: 1000 });
  return h(
    "div",
    { class: CLASSE_IMPRESSAO, "aria-hidden": "true" },
    h("h1", {}, `Histórico de tramitação - processo ${d.protocolo}`),
    h(
      "p",
      { class: "spro-g-impressao-sub" },
      `${resumo.passagens} passagem(ns) por ${resumo.unidades} unidade(s); tempo corrido: ${formatarDuracao(resumo.corridoMs)} (${numeroBR(diasDe(resumo.corridoMs))} dias).${d.coletadoEm ? ` Histórico coletado em ${formatarDataHora(d.coletadoEm)}.` : ""}`,
    ),
    h("div", { class: "spro-g-impressao-grafico" }, desenho),
    h("h2", {}, "Passagens"),
    tabelaPassagens,
    h("h2", {}, "Tempo por unidade"),
    tabelaTempo,
  );
}

/**
 * Imprime a visão acima: ela fica oculta na tela e é a única coisa visível ao imprimir (regra `@media print` do CSS do
 * módulo). `win.print()` abre a prévia do navegador; ao fechar, a visão sai da página.
 */
export function imprimirHistorico(doc: Document, d: DadosImpressao, escala: Escala = "mes"): void {
  const win = doc.defaultView ?? window;
  const visao = montarVisaoDeImpressao(d, escala);
  doc.body.append(visao);
  doc.documentElement.setAttribute("data-spro-imprimindo", "1");
  const limpar = () => {
    visao.remove();
    doc.documentElement.removeAttribute("data-spro-imprimindo");
    win.removeEventListener("afterprint", limpar);
  };
  win.addEventListener("afterprint", limpar);
  // Sem `afterprint` (alguns navegadores): a visão sai sozinha depois de um bom tempo; ela é invisível na tela.
  try {
    win.print();
  } finally {
    win.setTimeout(limpar, 30_000);
  }
}
