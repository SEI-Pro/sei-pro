/**
 * Estilos de texto de tabela do órgão (`Tabela_*`) organizados por tamanho e alinhamento.
 *
 * Cada órgão cadastra os seus no SEI (Tabela_Texto_8, Tabela_Texto_Alinhado_Esquerda_10pt,
 * Tabela_Centralizado_12…), e cada tipo de documento libera uma parte deles. Em vez de uma lista de
 * nomes, o diálogo mostra "modelos": tamanho (menor, padrão, maior) × alinhamento (esquerda, centro,
 * direita), só com as combinações que existem na seção. O tamanho e o alinhamento vêm do CSS do próprio
 * SEI (`infra.estilo.css`: `.Tabela_Texto_8{font-size:8pt;text-align:left;...}`); sem CSS, do nome.
 */

export type Alinhamento = 'esquerda' | 'centro' | 'direita' | 'justificado';

export interface EstiloTabela {
  nome: string;
  tamanhoPt: number;
  alinhamento: Alinhamento;
}

export const TAMANHO_PADRAO_PT = 11;

const ALINHAMENTOS: Record<string, Alinhamento> = {
  left: 'esquerda',
  start: 'esquerda',
  center: 'centro',
  right: 'direita',
  end: 'direita',
  justify: 'justificado',
};

interface Medidas {
  tamanhoPt?: number;
  alinhamento?: Alinhamento;
}

function emPontos(valor: string): number | undefined {
  const m = /^\s*([\d.]+)\s*(pt|px)?\s*$/i.exec(valor);
  if (!m) return undefined;
  const n = Number.parseFloat(m[1]);
  if (!Number.isFinite(n)) return undefined;
  return (m[2] ?? 'pt').toLowerCase() === 'px' ? Math.round(n * 0.75 * 10) / 10 : n;
}

/**
 * CSS dos estilos do SEI → tamanho e alinhamento por classe. Aceita a lista do 5.0.5
 * (`[".Classe{...}", ...]`) ou um texto só, com ou sem `p.` antes da classe.
 */
export function lerCssEstilos(css: unknown): Map<string, Medidas> {
  const texto = Array.isArray(css) ? css.filter((c) => typeof c === 'string').join('\n') : typeof css === 'string' ? css : '';
  const mapa = new Map<string, Medidas>();
  for (const m of texto.matchAll(/(?:^|[\s,}])(?:p)?\.([A-Za-z][\w-]*)\s*\{([^}]*)\}/g)) {
    const atual = mapa.get(m[1]) ?? {};
    const tam = /font-size\s*:\s*([^;]+)/i.exec(m[2]);
    const ali = /text-align\s*:\s*([a-z-]+)/i.exec(m[2]);
    const tamanhoPt = tam ? emPontos(tam[1]) : undefined;
    const alinhamento = ali ? ALINHAMENTOS[ali[1].toLowerCase()] : undefined;
    mapa.set(m[1], { tamanhoPt: tamanhoPt ?? atual.tamanhoPt, alinhamento: alinhamento ?? atual.alinhamento });
  }
  return mapa;
}

/** Sem CSS: `Tabela_Texto_Centralizado_10` → 10 pt, centro; sem número, 11 pt; sem direção, esquerda. */
export function pelonome(nome: string): Required<Medidas> {
  const num = /_(\d{1,2})(?:pt)?(?:_|$)/i.exec(nome);
  const tamanhoPt = num ? Number.parseInt(num[1], 10) : TAMANHO_PADRAO_PT;
  const alinhamento: Alinhamento = /Centraliz/i.test(nome)
    ? 'centro'
    : /Direita/i.test(nome)
      ? 'direita'
      : /Justific/i.test(nome)
        ? 'justificado'
        : 'esquerda';
  return { tamanhoPt, alinhamento };
}

export function classificar(nomes: string[], css?: Map<string, Medidas>): EstiloTabela[] {
  return nomes.map((nome) => {
    const doNome = pelonome(nome);
    const doCss = css?.get(nome) ?? {};
    return { nome, tamanhoPt: doCss.tamanhoPt ?? doNome.tamanhoPt, alinhamento: doCss.alinhamento ?? doNome.alinhamento };
  });
}

/**
 * Estilo de um tamanho e alinhamento. Havendo dois (Tabela_Centralizado_12 e um
 * Tabela_Texto_Centralizado_12), fica o da família `Tabela_Texto_*`, depois o de nome mais curto.
 */
export function achar(estilos: EstiloTabela[], tamanhoPt: number, alinhamento: Alinhamento): string | undefined {
  const candidatos = estilos.filter((e) => e.tamanhoPt === tamanhoPt && e.alinhamento === alinhamento).map((e) => e.nome);
  candidatos.sort((a, b) => Number(!/^Tabela_Texto_/i.test(a)) - Number(!/^Tabela_Texto_/i.test(b)) || a.length - b.length || a.localeCompare(b));
  return candidatos[0];
}

export function tamanhos(estilos: EstiloTabela[]): number[] {
  return [...new Set(estilos.map((e) => e.tamanhoPt))].sort((a, b) => a - b);
}

export function alinhamentosDe(estilos: EstiloTabela[], tamanhoPt: number): Alinhamento[] {
  const ordem: Alinhamento[] = ['esquerda', 'centro', 'direita', 'justificado'];
  const tem = new Set(estilos.filter((e) => e.tamanhoPt === tamanhoPt).map((e) => e.alinhamento));
  return ordem.filter((a) => tem.has(a));
}

/** Tamanho "padrão": o do estilo alinhado à esquerda sem número (11 pt no SEI), senão o mais comum. */
export function tamanhoPadrao(estilos: EstiloTabela[]): number | undefined {
  if (!estilos.length) return undefined;
  const lista = tamanhos(estilos);
  if (lista.includes(TAMANHO_PADRAO_PT)) return TAMANHO_PADRAO_PT;
  const conta = new Map<number, number>();
  for (const e of estilos) conta.set(e.tamanhoPt, (conta.get(e.tamanhoPt) ?? 0) + 1);
  return [...conta.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0];
}

export function rotuloTamanho(pt: number, padrao: number | undefined): string {
  const n = `${pt.toLocaleString('pt-BR')} pt`;
  if (padrao === undefined || pt === padrao) return padrao === undefined ? n : `${n} (padrão)`;
  return pt < padrao ? `${n} (menor)` : `${n} (maior)`;
}

export const ROTULO_ALINHAMENTO: Record<Alinhamento, string> = {
  esquerda: 'Esquerda',
  centro: 'Centralizado',
  direita: 'Direita',
  justificado: 'Justificado',
};

/** O tamanho e o alinhamento de um estilo já aplicado (para abrir o diálogo na tabela existente). */
export function medidasDe(estilos: EstiloTabela[], nome: string): EstiloTabela | undefined {
  return estilos.find((e) => e.nome === nome);
}

/**
 * Estilo do cabeçalho: o centralizado do mesmo tamanho (é o que se espera num título de coluna). Se esse
 * tamanho não tem centralizado, o centralizado de tamanho mais próximo; senão, o mesmo do corpo.
 */
export function estiloCabecalho(estilos: EstiloTabela[], tamanhoPt: number, corpo: string): string {
  const mesmo = achar(estilos, tamanhoPt, 'centro');
  if (mesmo) return mesmo;
  const centrados = tamanhos(estilos.filter((e) => e.alinhamento === 'centro'));
  if (!centrados.length) return corpo;
  const perto = centrados.reduce((a, b) => (Math.abs(b - tamanhoPt) < Math.abs(a - tamanhoPt) ? b : a));
  return achar(estilos, perto, 'centro') ?? corpo;
}
