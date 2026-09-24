/**
 * Tradução entre o que o usuário digita no estúdio e o modelo de fluxo.
 *
 * Fica separado da tela porque é aqui que estão as regras, e regra se testa: a
 * lista de variações de título, os números de processo colados de qualquer
 * lugar, e a de que MEIA AÇÃO não vira ação — um título sem pedido ao agente
 * poria no cartão um botão "Preparar" que não faz nada.
 */

import type { Etapa, Fluxo } from "../fluxos/modelo";
import type { AndamentoModelo, DocumentoModelo } from "../fluxos/inferir";
import type { MotivoSemSugestao } from "../fluxos/avaliar";

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

/**
 * Andamentos, como a operação `processo.historico` da ponte os devolve.
 *
 * ARMADILHA: ela NÃO devolve um array. Devolve
 * `{ protocolo, total, andamentos }`. Tratar a resposta como array estoura
 * "a.map is not a function" no meio da leitura do processo modelo — e só
 * contra um SEI de verdade, porque o formato certo está no `sei-nucleo`, não
 * aqui. O array puro também é aceito, para a função não depender dessa escolha.
 */
export function andamentosDoHistorico(resposta: unknown): AndamentoModelo[] {
  const lista = Array.isArray(resposta) ? resposta : (resposta as { andamentos?: unknown } | null)?.andamentos;
  if (!Array.isArray(lista)) return [];
  return lista
    .filter((a): a is { data?: unknown; unidade?: unknown; descricao?: unknown } => Boolean(a) && typeof a === "object")
    .map((a) => ({ data: String(a.data ?? ""), unidade: typeof a.unidade === "string" ? a.unidade : undefined, descricao: String(a.descricao ?? "") }));
}

const ONDE = "O cartão aparece no painel do Agente de IA, no topo da conversa.";

/**
 * O que o Estúdio diz sobre o processo aberto na aba do SEI.
 *
 * É a resposta para "criei o fluxo, abri o processo e não apareceu nada". Cada
 * silêncio da avaliação vira uma frase que diz O QUE FAZER: errou o tipo, o
 * rito ainda não começou, já acabou, você mesmo silenciou — ou está certo, e o
 * cartão está no painel. Uma tela muda deixa o usuário sem saber se errou ou se
 * a ferramenta quebrou.
 */
export function textoDoDiagnostico(o: {
  /** `undefined` com `temSugestao` = há cartão. */
  motivo?: MotivoSemSugestao | "sem-aba" | "fluxo-desligado";
  temSugestao?: boolean;
  protocolo?: string;
  tipo?: string;
  /** Nome da etapa que o motivo cita (a que falta, a atual, a primeira, a ignorada). */
  etapa?: string;
  cumpridas?: number;
  total?: number;
}): string {
  const onde = o.protocolo ? `Em ${o.protocolo}` : "No processo aberto";
  const etapa = o.etapa ? `"${o.etapa}"` : "a próxima etapa";
  if (o.temSugestao) {
    const quantas = o.cumpridas !== undefined && o.total !== undefined ? ` (${o.cumpridas} de ${o.total} etapas cumpridas)` : "";
    return `${onde}, este fluxo aponta ${etapa} como próxima providência${quantas}. ${ONDE}`;
  }
  switch (o.motivo) {
    case "sem-aba":
      return `Nenhuma aba do SEI conectada. Abra o SEI nesta janela para ver o que este fluxo diria do processo na tela.`;
    case "fluxo-desligado":
      return `Este fluxo está desligado, e fluxo desligado não sugere. Ligue-o aqui embaixo para testá-lo no processo aberto.`;
    case "sem-processo":
      return `A aba do SEI não tem processo aberto. Abra um processo para ver o que este fluxo diria dele. ${ONDE}`;
    case "sigiloso":
      return `O processo aberto é sigiloso, e o SEI Pro não atua em processo sigiloso.`;
    case "nao-se-aplica":
      return `Este fluxo NÃO se aplica ao processo aberto${o.protocolo ? ` (${o.protocolo})` : ""}${o.tipo ? `, do tipo "${o.tipo}"` : ""}. Confira "Quando este fluxo se aplica".`;
    case "rito-nao-comecou":
      return `${onde}, nada deste rito foi cumprido ainda: a primeira etapa é ${etapa}. A sugestão só vem depois que ela aparecer nos autos — o cartão mostra o documento anterior, e aqui não há nenhum.`;
    case "rito-cumprido": {
      const quantas = o.cumpridas !== undefined ? `${o.cumpridas}${o.total !== undefined ? ` de ${o.total}` : ""} etapa(s) cumprida(s)` : "o rito cumprido";
      return `${onde}, este fluxo não tem lacuna: ${quantas}${o.etapa ? `, a última ${etapa}` : ""}. Nada a sugerir — é o que se espera de um processo que percorreu o rito.`;
    }
    case "ignorada":
      return `${onde}, falta ${etapa}, mas você mandou ignorar essa etapa neste processo. Para vê-la de novo, apague o "ignorar" ou teste em outro processo.`;
    default:
      return `Não foi possível conferir o processo aberto agora. Recarregue esta página, ou recarregue a aba do SEI.`;
  }
}
