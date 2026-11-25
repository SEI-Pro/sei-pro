/** Visões: configuração nomeada da grade. Funções puras sobre listas imutáveis. */
import { COLUNAS, type Coluna, type ConfigQuadro, type CriterioOrdem, type Visao } from './tipos';

export const MAX_VISOES = 30;
export const MAX_NOME = 40;

export const quadroPadrao = (): ConfigQuadro => ({ colunas: 'marcador', limite: 0, raiasPorResponsavel: false });

export const COLUNAS_PADRAO: Coluna[] = ['processo', 'especificacao', 'tipo', 'responsavel', 'marcadores', 'prazo', 'anotacao'];
export const VERSAO_COLUNAS = 2;

export function visaoPadrao(): Visao {
  return {
    id: '',
    nome: 'Padrão',
    busca: '',
    ordem: [],
    agrupar: 'nenhum',
    modo: 'tabela',
    colv: VERSAO_COLUNAS,
    colunas: [...COLUNAS_PADRAO],
    densidade: 'confortavel',
    quadro: quadroPadrao(),
  };
}

const AGRUPAR: Visao['agrupar'][] = ['nenhum', 'responsavel', 'tipo', 'marcador', 'prazo', 'situacao', 'grupo', 'anotacao', 'acompanhamento', 'retorno', 'caixa', 'autuacao', 'recebimento', 'envio', 'unidadeEnvio'];
const CAMPOS: CriterioOrdem['campo'][] = ['protocolo', 'tipo', 'responsavel', 'marcador', 'prazo', 'caixa', 'parado', 'novo'];
const COLUNAS_QUADRO: ConfigQuadro['colunas'][] = ['marcador', 'responsavel', 'prazo', 'tipo'];

/** Aceita qualquer coisa vinda do storage (ou de outra versão) e devolve uma visão válida. */
export function normalizarVisao(bruto: unknown): Visao {
  const base = visaoPadrao();
  if (!bruto || typeof bruto !== 'object') return base;
  const b = bruto as Record<string, unknown>;
  const ordem: CriterioOrdem[] = Array.isArray(b.ordem)
    ? b.ordem
        .filter((c): c is { campo: CriterioOrdem['campo']; decrescente?: unknown } => !!c && typeof c === 'object' && CAMPOS.includes((c as { campo: never }).campo))
        .slice(0, 4)
        .map((c) => ({ campo: c.campo, decrescente: c.decrescente === true }))
    : [];
  let colunas = Array.isArray(b.colunas) ? [...new Set(b.colunas.filter((c): c is Coluna => COLUNAS.includes(c as Coluna)))] : [];
  // Visao salva antes da coluna Especificacao existir: ela entra logo depois do Processo (o usuario pode desligar de novo).
  if (colunas.includes('processo') && b.colv !== VERSAO_COLUNAS && !colunas.includes('especificacao')) {
    const i = colunas.indexOf('processo');
    colunas = [...colunas.slice(0, i + 1), 'especificacao', ...colunas.slice(i + 1)];
  }
  const q = (b.quadro && typeof b.quadro === 'object' ? b.quadro : {}) as Record<string, unknown>;
  const ordemColunas = Array.isArray(q.ordemColunas)
    ? [...new Set(q.ordemColunas.filter((x): x is string => typeof x === 'string' && x.length > 0))].slice(0, 200)
    : undefined;
  const colunasRecolhidas = Array.isArray(q.colunasRecolhidas)
    ? [...new Set(q.colunasRecolhidas.filter((x): x is string => typeof x === 'string' && x.length > 0))].slice(0, 200)
    : undefined;
  const larguraColuna = typeof q.larguraColuna === 'number' && Number.isFinite(q.larguraColuna)
    ? Math.max(200, Math.min(500, Math.round(q.larguraColuna)))
    : undefined;
  return {
    id: typeof b.id === 'string' ? b.id : '',
    colv: VERSAO_COLUNAS,
    nome: typeof b.nome === 'string' && b.nome.trim() ? b.nome.trim().slice(0, MAX_NOME) : base.nome,
    busca: typeof b.busca === 'string' ? b.busca.slice(0, 500) : '',
    ordem,
    agrupar: AGRUPAR.includes(b.agrupar as never) ? (b.agrupar as Visao['agrupar']) : 'nenhum',
    modo: b.modo === 'quadro' ? 'quadro' : 'tabela',
    colunas: colunas.length ? colunas : base.colunas,
    densidade: b.densidade === 'compacta' ? 'compacta' : 'confortavel',
    quadro: {
      colunas: COLUNAS_QUADRO.includes(q.colunas as never) ? (q.colunas as ConfigQuadro['colunas']) : 'marcador',
      limite: typeof q.limite === 'number' && q.limite > 0 ? Math.min(99, Math.floor(q.limite)) : 0,
      raiasPorResponsavel: q.raiasPorResponsavel === true,
      ...(ordemColunas?.length ? { ordemColunas } : {}),
      ...(colunasRecolhidas?.length ? { colunasRecolhidas } : {}),
      ...(larguraColuna !== undefined ? { larguraColuna } : {}),
      ...(q.colunasVazias === true ? { colunasVazias: true } : {}),
    },
  };
}

export function normalizarLista(bruto: unknown): Visao[] {
  if (!Array.isArray(bruto)) return [];
  const vistos = new Set<string>();
  const saida: Visao[] = [];
  for (const b of bruto) {
    const v = normalizarVisao(b);
    if (!v.id || vistos.has(v.id)) continue;
    vistos.add(v.id);
    saida.push(v);
    if (saida.length >= MAX_VISOES) break;
  }
  return saida;
}

/** Salva: com `id` existente substitui; sem, acrescenta com o id dado. Respeita o teto. */
export function salvarVisao(lista: Visao[], visao: Visao, novoId: () => string): { lista: Visao[]; visao: Visao } | null {
  const v = normalizarVisao(visao);
  const i = v.id ? lista.findIndex((x) => x.id === v.id) : -1;
  if (i >= 0) {
    const copia = [...lista];
    copia[i] = v;
    return { lista: copia, visao: v };
  }
  if (lista.length >= MAX_VISOES) return null;
  const nova = { ...v, id: novoId() };
  return { lista: [...lista, nova], visao: nova };
}

export const excluirVisao = (lista: Visao[], id: string): Visao[] => lista.filter((v) => v.id !== id);

export function renomearVisao(lista: Visao[], id: string, nome: string): Visao[] {
  const n = nome.trim().slice(0, MAX_NOME);
  return n ? lista.map((v) => (v.id === id ? { ...v, nome: n } : v)) : lista;
}

/** A visão corrente difere da salva? (para mostrar "alterada" e o botão Atualizar). */
export function mudouDe(a: Visao, b: Visao): boolean {
  const chave = (v: Visao) => JSON.stringify({ ...v, id: '', nome: '' });
  return chave(a) !== chave(b);
}
