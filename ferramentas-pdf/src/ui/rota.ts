/**
 * Leitura do fragmento da URL.
 *
 * O fragmento carrega duas coisas com ciclos de vida diferentes: a ferramenta
 * aberta, que muda a cada navegacao, e os parametros de conexao com o SEI, que
 * valem para a sessao inteira. Misturar as duas leituras foi um defeito real:
 * o roteador via `?n=...` como nome de ferramenta, nao reconhecia, limpava o
 * fragmento -- e levava junto o nonce, derrubando a ponte em silencio.
 */

export interface Rota {
  /** Ferramenta pedida, sem barras. Vazio quando e o hub. */
  slug: string;
  /** Parametros do fragmento (nonce e origem, quando vem do SEI). */
  parametros: URLSearchParams;
}

export function lerRota(hash: string = window.location.hash): Rota {
  const bruto = hash.replace(/^#\/?/, "");
  const corte = bruto.indexOf("?");
  const slug = (corte === -1 ? bruto : bruto.slice(0, corte)).trim();
  const parametros = new URLSearchParams(corte === -1 ? "" : bruto.slice(corte + 1));
  return { slug, parametros };
}

/**
 * Monta o fragmento preservando os parametros de conexao.
 *
 * Trocar de ferramenta NAO pode derrubar a ponte com o SEI.
 */
export function montarHash(slug: string, parametros: URLSearchParams): string {
  const query = parametros.toString();
  return `#/${slug}${query ? `?${query}` : ""}`;
}
