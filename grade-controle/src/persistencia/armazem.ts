/**
 * Onde a grade guarda o que é do usuário.
 *  - `chrome.storage.sync`: as visões salvas (poucas e pequenas, uma chave por visão por causa do teto de 8 KB
 *    por item, e uma chave de índice com a ordem). Valem em todos os computadores.
 *  - `chrome.storage.local`: o estado da unidade (visão corrente, idade dos processos, grupos recolhidos), que é
 *    grande demais para o sync e não faz sentido em outro computador.
 */
import type { Area } from '../../../sei-comum/src/armazenamento/area';
import { type EstadoIdade, estadoVazio, normalizarEstado } from '../modelo/idade';
import { normalizarVisao, visaoPadrao } from '../modelo/visoes';
import { type DadosAndamento, estaValido } from '../modelo/andamentos';
import type { Visao } from '../modelo/tipos';

export const CHAVE_INDICE = 'spro_grade_v_ids';
export const chaveVisao = (id: string) => `spro_grade_v:${id}`;
export const chaveUnidade = (unidade: string) => `spro_grade:${unidade || 'x'}`;
/** O cache do andamento é por unidade E por usuário: o recebimento e o envio mudam de quem olha. */
export const chaveAndamentos = (unidade: string, usuario: string) => `spro_grade_and:${unidade || 'x'}:${usuario || 'x'}`;
export const MAX_ANDAMENTOS = 5000;

export interface EstadoUnidade {
  visao: Visao;
  idade: EstadoIdade;
  recolhidos: string[];
}

export function estadoUnidadeVazio(): EstadoUnidade {
  return { visao: visaoPadrao(), idade: estadoVazio(), recolhidos: [] };
}

function normalizarUnidade(bruto: unknown): EstadoUnidade {
  if (!bruto || typeof bruto !== 'object') return estadoUnidadeVazio();
  const b = bruto as Record<string, unknown>;
  return {
    visao: normalizarVisao(b.visao),
    idade: normalizarEstado(b.idade),
    recolhidos: Array.isArray(b.recolhidos) ? b.recolhidos.filter((x): x is string => typeof x === 'string').slice(0, 200) : [],
  };
}

const DATA = /^\d{4}-\d{2}-\d{2}$/;
function normalizarAndamento(v: unknown): DadosAndamento | null {
  if (!v || typeof v !== 'object') return null;
  const b = v as Record<string, unknown>;
  if (typeof b.consultadoEm !== 'number' || !Number.isFinite(b.consultadoEm)) return null;
  const d: DadosAndamento = { consultadoEm: b.consultadoEm };
  for (const c of ['autuacao', 'recebimento', 'envio'] as const) if (typeof b[c] === 'string' && DATA.test(b[c] as string)) d[c] = b[c] as string;
  if (typeof b.unidadeEnvio === 'string' && b.unidadeEnvio) d.unidadeEnvio = b.unidadeEnvio.slice(0, 120);
  return d;
}

export function criarArmazem(areas: { local: Area; sync: Area }, unidade: string, usuario = '') {
  const { local, sync } = areas;
  const chave = chaveUnidade(unidade);
  const chaveAnd = chaveAndamentos(unidade, usuario);

  async function lerEstado(): Promise<EstadoUnidade> {
    return normalizarUnidade((await local.obter(chave))[chave]);
  }
  /** Lê, troca só o pedaço e grava: duas abas gravando pedaços diferentes não se atropelam por inteiro. */
  async function atualizar(pedaco: Partial<EstadoUnidade>): Promise<void> {
    const atual = await lerEstado();
    await local.gravar({ [chave]: { ...atual, ...pedaco } });
  }

  async function lerVisoes(): Promise<Visao[]> {
    const indice = (await sync.obter(CHAVE_INDICE))[CHAVE_INDICE];
    const ids = Array.isArray(indice) ? indice.filter((x): x is string => typeof x === 'string') : [];
    if (!ids.length) return [];
    const itens = await sync.obter(ids.map(chaveVisao));
    return ids.flatMap((id) => {
      const bruto = itens[chaveVisao(id)];
      return bruto ? [{ ...normalizarVisao(bruto), id }] : [];
    });
  }

  /** Grava a lista inteira e remove as visões que saíram dela. */
  async function gravarVisoes(lista: Visao[], anteriores: Visao[] = []): Promise<void> {
    const novos = new Set(lista.map((v) => v.id));
    const itens: Record<string, unknown> = { [CHAVE_INDICE]: lista.map((v) => v.id) };
    for (const v of lista) itens[chaveVisao(v.id)] = v;
    await sync.gravar(itens);
    const orfas = anteriores.filter((v) => !novos.has(v.id)).map((v) => chaveVisao(v.id));
    if (orfas.length) await sync.remover(orfas);
  }

  /** Só o que ainda vale (24 h); o resto é descartado na leitura. */
  async function lerAndamentos(agora: number): Promise<Record<string, DadosAndamento>> {
    const bruto = (await local.obter(chaveAnd))[chaveAnd];
    const itens = bruto && typeof bruto === 'object' ? ((bruto as { itens?: unknown }).itens as Record<string, unknown> | undefined) : undefined;
    const r: Record<string, DadosAndamento> = {};
    if (!itens || typeof itens !== 'object') return r;
    for (const [id, v] of Object.entries(itens)) {
      const d = normalizarAndamento(v);
      if (d && estaValido(d, agora)) r[id] = d;
    }
    return r;
  }
  async function gravarAndamentos(itens: Record<string, DadosAndamento>): Promise<void> {
    const ids = Object.keys(itens);
    const aparado = ids.length > MAX_ANDAMENTOS ? Object.fromEntries(ids.sort((a, b) => itens[b]!.consultadoEm - itens[a]!.consultadoEm).slice(0, MAX_ANDAMENTOS).map((id) => [id, itens[id]!])) : itens;
    await local.gravar({ [chaveAnd]: { itens: aparado } });
  }

  return {
    /** A area local: o que e do navegador e nao da unidade (ex.: a altura da grade, spro_altura:grade-controle). */
    areaLocal: local,
    lerAndamentos,
    gravarAndamentos,
    lerEstado,
    gravarVisao: (visao: Visao) => atualizar({ visao }),
    gravarIdade: (idade: EstadoIdade) => atualizar({ idade }),
    gravarRecolhidos: (recolhidos: string[]) => atualizar({ recolhidos }),
    lerVisoes,
    gravarVisoes,
    /** Avisa quando as visões mudam em outra aba ou computador. */
    aoMudarVisoes: (cb: () => void) => sync.aoMudar((m) => (CHAVE_INDICE in m || Object.keys(m).some((k) => k.startsWith('spro_grade_v:')) ? cb() : undefined)),
  };
}

export type Armazem = ReturnType<typeof criarArmazem>;
