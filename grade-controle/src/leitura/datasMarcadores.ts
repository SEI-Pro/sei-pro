/**
 * Consulta a data/hora de atribuição de cada marcador de um processo na tela `andamento_marcador_gerenciar`.
 * Só é usada quando o processo possui mais de um marcador, para agrupar exclusivamente pelo último adicionado.
 */
import { normalizarTexto } from '../../../sei-comum/src/texto';
import { ErroSei } from '../../../sei-nucleo/src/sessao/erros';
import type { Sei } from '../../../sei-nucleo/src/sei';
import type { Processo } from '../modelo/tipos';

const DATA_HORA_RE = /\b(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?\b/;

function parseDataHora(bruto: string): number | undefined {
  const m = DATA_HORA_RE.exec(bruto);
  if (!m) return undefined;
  const t = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4]), Number(m[5]), Number(m[6] ?? 0)).getTime();
  return Number.isFinite(t) ? t : undefined;
}

/** Extrai `{ [nomeNormalizado]: epochMs }` da tabela de `andamento_marcador_gerenciar`. */
export function lerDatasMarcadores(doc: Document): Record<string, number> {
  const mapa: Record<string, number> = {};
  for (const tr of doc.querySelectorAll('tr.infraTrClara, tr.infraTrEscura, table.infraTable tr')) {
    const tds = [...tr.children].filter((el) => el.tagName === 'TD');
    if (tds.length < 3) continue;
    let nome = '';
    let dataHora: number | undefined;
    for (const td of tds) {
      const texto = (td.textContent ?? '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
      if (!nome && td.querySelector('img[src*="marcador_"]')) {
        nome = texto || (td.querySelector('img')?.getAttribute('title') ?? '').trim();
      }
      if (dataHora === undefined) {
        const dt = parseDataHora(texto);
        if (dt !== undefined) dataHora = dt;
      }
    }
    if (!nome || dataHora === undefined) continue;
    const chave = normalizarTexto(nome);
    if (mapa[chave] === undefined || dataHora > mapa[chave]!) mapa[chave] = dataHora;
  }
  return mapa;
}

export async function consultarDatasMarcadores(
  sei: Sei,
  p: Pick<Processo, 'linkMarcadores'>,
  sinal: AbortSignal,
): Promise<Record<string, number> | null> {
  if (!p.linkMarcadores) return null;
  try {
    const pagina = await sei.http.obter(p.linkMarcadores, { sinal });
    const datas = lerDatasMarcadores(pagina.doc);
    return Object.keys(datas).length ? datas : null;
  } catch (e) {
    if (e instanceof ErroSei && (e.codigo === 'SEI_SIGILOSO' || e.codigo === 'SEI_ACAO_INDISPONIVEL' || e.codigo === 'SEI_NAO_ENCONTRADO' || e.codigo === 'CANCELADO')) return null;
    return null;
  }
}
