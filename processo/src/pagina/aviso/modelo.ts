/**
 * Aviso de documentos não assinados ao enviar o processo: o modelo, sem DOM e sem rede.
 *
 * O legado (`initCheckNaoAssinados`) coletava o histórico completo do processo (`mergeAllAndamentosProcesso`) só para
 * saber a unidade de cada documento e a data. Aqui a unidade vem da própria árvore (SEI 4+: a sigla da unidade geradora
 * de cada documento) e o histórico só entra, se já estiver no cache de 30 min, para mostrar a data de geração.
 * Os critérios são os do chip "Não assinados" do filtro da árvore (`naoAssinado`).
 */
import type { DocumentoArvore } from "@nucleo/dominio/arvore";
import type { Andamento } from "@nucleo/dominio/historico";
import { ROTULOS } from "@nucleo/dominio/passagens";
import { naoAssinado } from "../filtro/filtro";

export interface Pendente {
  id: string;
  numero: string;
  titulo: string;
  /** "dd/mm/aaaa", do andamento "Gerado documento" (só quando o histórico completo está no cache). */
  data?: string;
}

/** Documentos do editor da unidade ainda sem assinatura, na ordem da árvore. */
export function pendentesDaUnidade(docs: readonly DocumentoArvore[], unidade: string): Pendente[] {
  return docs.filter((d) => naoAssinado(d, { unidade })).map((d) => ({ id: d.id, numero: d.numero, titulo: d.titulo }));
}

/** Número SEI → data de geração ("dd/mm/aaaa") a partir do histórico. */
export function datasDeGeracao(andamentos: readonly Andamento[]): Map<string, string> {
  const mapa = new Map<string, string>();
  // O histórico vem do mais recente para o mais antigo: o último andamento "Gerado documento" de cada número é o mais antigo.
  for (const a of andamentos) {
    if (!a.nrSei || !a.descricao.startsWith(ROTULOS.documentoGerado)) continue;
    mapa.set(a.nrSei, a.data.slice(0, 10));
  }
  return mapa;
}

export function comDatas(pendentes: readonly Pendente[], datas: ReadonlyMap<string, string> | null): Pendente[] {
  if (!datas) return [...pendentes];
  return pendentes.map((p) => {
    const data = datas.get(p.numero);
    return data ? { ...p, data } : p;
  });
}

export const plural = (n: number, um: string, varios: string): string => `${n} ${n === 1 ? um : varios}`;
