/**
 * Coleção de fluxos da equipe: uma pasta do GitHub com um `.md` por fluxo.
 *
 * Mesma ideia das coleções de skills do agente — a unidade escreve o rito uma
 * vez, versiona no repositório e todo mundo recebe. O `.md` é legível: quem
 * abre o arquivo no GitHub entende e edita (ver `markdown.ts`).
 *
 * Duas regras que a mesclagem guarda:
 *
 * 1. O que a equipe publica MANDA nos fluxos daquela coleção: arquivo apagado
 *    lá some aqui, arquivo mudado chega mudado. Senão a pasta vira sugestão, e
 *    a equipe nunca sabe o que cada um está usando.
 * 2. Mas não encosta no que a pessoa escreveu à mão, e não desfaz o que ela
 *    decidiu AQUI: fluxo da equipe que ela ligou continua ligado. Perder o
 *    fluxo próprio de alguém porque a equipe mexeu na pasta seria imperdoável.
 */

import { deMarkdown } from "./markdown";
import type { Fluxo } from "./modelo";

export interface ColecaoFluxos {
  id: string;
  nome: string;
  /** Endereço da pasta no GitHub (…/tree/branch/pasta) ou do repositório. */
  url: string;
  sincronizar?: boolean;
  verificadaEm?: number;
  erroSync?: string;
  /** Quantos fluxos vieram na última busca. */
  quantos?: number;
}

export const CHAVE_COLECOES = "agenteIA_fluxosColecoes";

export async function listarColecoesDeFluxos(): Promise<ColecaoFluxos[]> {
  try {
    const v = await chrome.storage.local.get(CHAVE_COLECOES);
    const lista = v?.[CHAVE_COLECOES] as ColecaoFluxos[] | undefined;
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export async function guardarColecoesDeFluxos(lista: ColecaoFluxos[]): Promise<void> {
  await chrome.storage.local.set({ [CHAVE_COLECOES]: lista });
}

export interface Mesclagem {
  lista: Fluxo[];
  novos: number;
  atualizados: number;
  removidos: number;
  /** Arquivos que não deram um fluxo utilizável. */
  avisos: string[];
}

export function mesclarColecaoDeFluxos(
  lista: Fluxo[],
  colecao: ColecaoFluxos,
  baixados: Array<{ arquivo: string; nome: string; texto: string }>,
  agora = Date.now(),
): Mesclagem {
  const daColecao = lista.filter((f) => f.colecao === colecao.id);
  const outros = lista.filter((f) => f.colecao !== colecao.id);
  const avisos: string[] = [];
  const resultado: Fluxo[] = [];
  let novos = 0;
  let atualizados = 0;

  for (const b of baixados) {
    const id = `${colecao.id}:${b.arquivo}`;
    const antigo = daColecao.find((f) => f.id === id);
    let lido: Fluxo;
    try {
      lido = deMarkdown(b.texto);
    } catch (e) {
      // Um arquivo torto não pode derrubar a sincronia inteira da equipe.
      avisos.push(`${b.arquivo}: ${(e as Error).message}`);
      if (antigo) resultado.push(antigo);
      continue;
    }
    const mudou = antigo?.textoOrigem !== b.texto;
    if (!antigo) novos += 1;
    else if (mudou) atualizados += 1;
    resultado.push({
      ...lido,
      id,
      colecao: colecao.id,
      // O que a pessoa decidiu AQUI: ligar o fluxo da equipe é decisão dela.
      ativo: antigo?.ativo ?? false,
      origem: "colecao",
      textoOrigem: b.texto,
      url: `${colecao.url.replace(/\/+$/, "")}/${b.arquivo}`,
      atualizadoEm: mudou ? agora : (antigo?.atualizadoEm ?? agora),
    });
  }

  const sobreviventes = new Set(resultado.map((f) => f.id));
  const removidos = daColecao.filter((f) => !sobreviventes.has(f.id)).length;
  return { lista: [...outros, ...resultado], novos, atualizados, removidos, avisos };
}
