import type { NomeFatia } from "./tipos";

/** Tipos de painel; o valor é o `data-type` do legado, que também dá a chave `panelDadosArvorePro_<tipo>` do aberto/fechado. */
export type TipoPainel =
  | "anotacoes"
  | "responsaveis"
  | "bloco_interno"
  | "marcador"
  | "acompanhamento_especial"
  | "descricao"
  | "tipo_procedimento"
  | "nivel_acesso"
  | "interessados"
  | "assuntos"
  | "observacoes";

/** Ordem final do legado: Anotações logo após "Consultar Andamento"; os demais no fim da árvore. */
export const ORDEM_FINAL: readonly TipoPainel[] = [
  "responsaveis",
  "bloco_interno",
  "marcador",
  "acompanhamento_especial",
  "descricao",
  "tipo_procedimento",
  "nivel_acesso",
  "interessados",
  "assuntos",
  "observacoes",
];

/** Nome do item na personalização do menu (`configViewFlashPanelArvorePro`). A especificação não é personalizável: sempre aparece. */
export const NOME_NA_PERSONALIZACAO: Partial<Record<TipoPainel, string>> = {
  anotacoes: "Anotações",
  responsaveis: "Atribuição",
  bloco_interno: "Bloco Interno",
  marcador: "Marcador",
  acompanhamento_especial: "Acompanhamento Especial",
  tipo_procedimento: "Tipo de Procedimento",
  nivel_acesso: "Nível de Acesso",
  interessados: "Interessados",
  assuntos: "Assuntos",
  observacoes: "Observações",
};

/** A lista de fábrica do legado (sem "Bloco Interno", que é opt-in). */
export const SELECAO_PADRAO: readonly string[] = [
  "Anotações",
  "Marcador",
  "Acompanhamento Especial",
  "Tipo de Procedimento",
  "Assuntos",
  "Interessados",
  "Atribuição",
  "Nível de Acesso",
  "Observações",
];

/** Quais painéis ligar, dada a lista salva pelo usuário (`null` = nunca personalizou). */
export function paineisHabilitados(selecao: readonly string[] | null): Set<TipoPainel> {
  const nomes = new Set(selecao && selecao.length ? selecao : SELECAO_PADRAO);
  const saida = new Set<TipoPainel>(["descricao"]);
  for (const [tipo, nome] of Object.entries(NOME_NA_PERSONALIZACAO) as Array<[TipoPainel, string]>) if (nomes.has(nome)) saida.add(tipo);
  return saida;
}

/** Painéis que não aparecem em processo sigiloso (spec 8.1): nada de especificação, interessados, assuntos ou observações. */
export const OCULTOS_NO_SIGILOSO: ReadonlySet<TipoPainel> = new Set<TipoPainel>([
  "descricao",
  "interessados",
  "assuntos",
  "observacoes",
  "bloco_interno",
]);

/** Fatias de cada painel (as que fazem o painel redesenhar). */
export const FATIAS_DO_PAINEL: Record<TipoPainel, readonly NomeFatia[]> = {
  anotacoes: ["anotacao"],
  responsaveis: ["atribuicao"],
  bloco_interno: ["blocoInterno"],
  marcador: ["marcador"],
  acompanhamento_especial: ["acompanhamento"],
  descricao: ["dadosProcesso"],
  tipo_procedimento: ["dadosProcesso"],
  nivel_acesso: ["dadosProcesso"],
  interessados: ["dadosProcesso"],
  assuntos: ["dadosProcesso"],
  observacoes: ["dadosProcesso"],
};
