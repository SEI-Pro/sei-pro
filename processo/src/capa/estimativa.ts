/**
 * Quantos documentos o processo tem, mesmo com pastas por carregar. Sem DOM.
 *
 * As pastas numeradas (I, II...) são páginas do processo: o SEI as enche na ordem e só a ÚLTIMA (a mais recente) fica
 * parcial. Logo, cada pasta não carregada que não seja a última tem exatamente o tamanho da página. Se a própria última
 * não está carregada, ela tem de 1 a "tamanho" documentos e o total vira uma faixa.
 *
 * Só é exato com todas as pastas carregadas (carregada = o SEI já trouxe os documentos, esteja ela aberta ou fechada
 * na tela). Documentos excluídos saem da paginação (o SEI repagina); cancelados e movidos continuam como nós, então
 * cada pasta cheia mantém o tamanho da página.
 */
import type { PastaTela } from "./pastas";
import type { TamanhoDaPasta } from "../modelo/tamanhoPasta";

export interface Estimativa {
  exato: boolean;
  /** Exato: o total. Estimado: o menor valor possível. */
  minimo: number;
  /** Igual a `minimo`, salvo quando a última pasta está por carregar (faixa). */
  maximo: number;
  /** Documentos das pastas carregadas (e dos que ficam fora de pasta). */
  carregados: number;
  /** Pastas por carregar que não são a última: valem uma página cheia cada. */
  cheias: number;
  /** A última pasta ainda não foi carregada (parcial e desconhecida). */
  ultimaFechada: boolean;
  /** Pastas por carregar, no total. */
  porCarregar: number;
  tamanho: TamanhoDaPasta;
}

export function estimarDocumentos(pastas: readonly PastaTela[], carregados: number, tamanho: TamanhoDaPasta): Estimativa {
  const fechadas = pastas.filter((p) => !p.carregada);
  const ultima = [...pastas].reverse().find((p) => p.topo);
  const ultimaFechada = !!ultima && !ultima.carregada;
  const cheias = fechadas.length - (ultimaFechada ? 1 : 0);
  if (!fechadas.length) {
    return { exato: true, minimo: carregados, maximo: carregados, carregados, cheias: 0, ultimaFechada: false, porCarregar: 0, tamanho };
  }
  const base = carregados + cheias * tamanho.valor;
  return {
    exato: false,
    minimo: base + (ultimaFechada ? 1 : 0),
    maximo: base + (ultimaFechada ? tamanho.valor : 0),
    carregados,
    cheias,
    ultimaFechada,
    porCarregar: fechadas.length,
    tamanho,
  };
}

const plural = (n: number, um: string, varios: string): string => `${n} ${n === 1 ? um : varios}`;

/** O valor do card e a frase curta que explica a conta. */
export function textoDaEstimativa(e: Estimativa): { valor: string; detalhe?: string } {
  if (e.exato) return { valor: String(e.minimo) };
  const partes: string[] = [];
  if (e.cheias > 0) partes.push(`${plural(e.cheias, "pasta", "pastas")} × ${e.tamanho.valor}`);
  if (e.carregados > 0) partes.push(plural(e.carregados, "aberto", "abertos"));
  if (e.ultimaFechada) partes.push(`a última pasta (de 1 a ${e.tamanho.valor})`);
  const padrao = e.tamanho.origem === "padrao" ? ` (${e.tamanho.valor} é o padrão do SEI)` : "";
  return {
    valor: e.maximo > e.minimo ? `≈ ${e.minimo} a ${e.maximo}` : `≈ ${e.minimo}`,
    detalhe: `estimado: ${partes.join(" + ") || "sem documentos à vista"}${padrao}`,
  };
}
