/**
 * Tradução entre o que o usuário digita no estúdio e o modelo de fluxo.
 *
 * Fica separado da tela porque é aqui que estão as regras, e regra se testa: a
 * lista de variações de título, os números de processo colados de qualquer
 * lugar, e a de que MEIA AÇÃO não vira ação — um título sem pedido ao agente
 * poria no cartão um botão "Preparar" que não faz nada.
 */

import type { Etapa, Fluxo } from "../fluxos/modelo";
import type { DocumentoModelo } from "../fluxos/inferir";

/** Lista de textos num campo só: uma por linha lê melhor que separada por vírgula. */
export const paraLinhas = (lista: string[] | undefined): string => (lista ?? []).join("\n");

export const deLinhas = (texto: string): string[] =>
  texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/** Números de processo como eles chegam: um por linha, ou colados com vírgula. */
export const numerosDeProcesso = (texto: string): string[] => [
  ...new Set(
    texto
      .split(/[\n,;]/)
      .map((t) => t.trim())
      .filter(Boolean),
  ),
];

/** Como a lista de fluxos descreve, numa linha, a que processos o fluxo se aplica. */
export function resumoDoAlcance(f: Fluxo): string {
  const partes: string[] = [];
  if (f.aplicaSe.tipoProcessoContem?.length) partes.push(f.aplicaSe.tipoProcessoContem.join(", "));
  if (f.aplicaSe.marcador?.length) partes.push(`marcador ${f.aplicaSe.marcador.join(", ")}`);
  if (f.aplicaSe.unidade?.length) partes.push(`em ${f.aplicaSe.unidade.join(", ")}`);
  const etapas = `${f.etapas.length} etapa${f.etapas.length === 1 ? "" : "s"}`;
  return partes.length ? `${etapas} · ${partes.join(" · ")}` : `${etapas} · qualquer processo`;
}

/**
 * A ação depois de mexer num dos dois campos.
 *
 * Sem pedido ao agente não há ação: o cartão mostraria "Preparar" e o clique
 * não teria o que enviar.
 */
export function comAcao(etapa: Etapa, parte: { titulo?: string; pedido?: string }): Etapa["acao"] {
  const titulo = parte.titulo ?? etapa.acao?.titulo ?? "";
  const pedido = parte.pedido ?? etapa.acao?.pedido ?? "";
  if (!pedido.trim()) return undefined;
  return { titulo: titulo.trim() || `Preparar ${etapa.nome}`, pedido };
}

/** O desvio depois de mexer num dos dois campos: sem destino, não existe. */
export function comDesvio(etapa: Etapa, parte: { seDocumentoContem?: string; entaoIrPara?: string }): Etapa["condicao"] {
  const seDocumentoContem = parte.seDocumentoContem ?? etapa.condicao?.seDocumentoContem ?? "";
  const entaoIrPara = parte.entaoIrPara ?? etapa.condicao?.entaoIrPara ?? "";
  if (!seDocumentoContem.trim() || !entaoIrPara) return undefined;
  return { seDocumentoContem, entaoIrPara };
}

/**
 * Documentos da árvore de um processo modelo, como vão para a inferência.
 *
 * Descarta o SIGILOSO (não sai da aba do SEI) e o CANCELADO. O cancelado foi
 * riscado dos autos: se ele entra no prompt, o modelo pode propor como etapa do
 * rito um documento que `avaliar.ts` nunca aceita — e o fluxo passaria a cobrar
 * para sempre uma etapa impossível de cumprir.
 *
 * A ordem é renumerada depois do descarte: o número que o modelo vê tem de ser
 * a posição na lista que ele recebeu.
 */
export function metadadosDaArvore(
  documentos: Array<{ titulo?: string; assinado?: boolean; externo?: boolean; unidade?: string; nivel?: string; cancelado?: boolean }>,
): DocumentoModelo[] {
  return documentos
    .filter((d) => d.nivel !== "sigiloso" && d.cancelado !== true)
    .map((d, i) => ({ ordem: i + 1, titulo: d.titulo ?? "", unidade: d.unidade, assinado: d.assinado === true, externo: d.externo === true }));
}
