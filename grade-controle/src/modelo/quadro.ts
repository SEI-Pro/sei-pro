/**
 * Quadro (Kanban): colunas, cartões e o PLANO de um movimento. Nada aqui grava: `planejarMovimento` diz o que o SEI
 * precisaria fazer, e `acoes/mover.ts` executa. Assim o plano é testável sem rede.
 */
import type { Ctx } from './contexto';
import { FAIXAS_PRAZO, faixaDoPrazo } from './grupos';
import type { ConfigQuadro, Processo } from './tipos';

export interface ColunaQuadro {
  chave: string;
  titulo: string;
  itens: Processo[];
  tom?: 'perigo' | 'aviso' | 'neutro';
  /** Soltar um cartão aqui muda algo no SEI. */
  aceitaSoltar: boolean;
  motivoSomenteLeitura?: string;
  /** Passou do limite configurado. */
  excedeu: boolean;
}

export interface ExtrasQuadro {
  /** Todos os marcadores da unidade (colunas vazias também aparecem). */
  marcadores?: string[];
  /** Usuários da unidade. */
  responsaveis?: Array<{ sigla: string; nome: string }>;
}

const colador = new Intl.Collator('pt-BR', { sensitivity: 'base', numeric: true });
const SEM = 'sem';

export function montarQuadro(processos: Processo[], cfg: ConfigQuadro, ctx: Ctx, extras: ExtrasQuadro = {}): ColunaQuadro[] {
  const colunas = new Map<string, ColunaQuadro>();
  const coluna = (chave: string, titulo: string, aceita: boolean, motivo?: string, tom?: ColunaQuadro['tom']) => {
    let c = colunas.get(chave);
    if (!c) {
      c = { chave, titulo, itens: [], aceitaSoltar: aceita, excedeu: false, ...(motivo ? { motivoSomenteLeitura: motivo } : {}), ...(tom ? { tom } : {}) };
      colunas.set(chave, c);
    }
    return c;
  };

  if (cfg.colunas === 'marcador') {
    for (const p of processos) {
      if (!p.marcadores.length) coluna(SEM, 'Sem marcador', true).itens.push(p);
      for (const m of p.marcadores) coluna(`m:${m.nome}`, m.nome, true).itens.push(p);
    }
  } else if (cfg.colunas === 'responsavel') {
    coluna(SEM, 'Sem responsável', true);
    for (const u of extras.responsaveis ?? []) coluna(`u:${u.sigla}`, `${u.nome} (${u.sigla})`, true);
    for (const p of processos) {
      if (!p.atribuicao) coluna(SEM, 'Sem responsável', true).itens.push(p);
      else coluna(`u:${p.atribuicao.sigla}`, `${p.atribuicao.nome} (${p.atribuicao.sigla})`, true).itens.push(p);
    }
  } else if (cfg.colunas === 'prazo') {
    for (const [chave, titulo, tom] of FAIXAS_PRAZO) if (chave !== 'desde') coluna(chave, titulo, false, 'O prazo é definido pelo botão de prazo, não arrastando.', tom);
    for (const p of processos) {
      const f = faixaDoPrazo(p, ctx);
      coluna(f === 'desde' ? 'sem' : f, '', false).itens.push(p);
    }
  } else {
    for (const p of processos) coluna(`t:${p.tipo}`, p.tipo || 'Sem tipo', false, 'O tipo do processo não muda arrastando.').itens.push(p);
  }

  let lista = [...colunas.values()];
  if (cfg.colunas === 'prazo') lista = lista.filter((c) => c.itens.length || c.titulo);
  if (cfg.colunas === 'marcador') {
    lista = lista.filter((c) => c.itens.length > 0);
    lista.sort((a, b) => {
      const diff = b.itens.length - a.itens.length;
      if (diff !== 0) return diff;
      if (a.chave === SEM) return 1;
      if (b.chave === SEM) return -1;
      return colador.compare(a.titulo, b.titulo);
    });
  } else if (cfg.colunas === 'responsavel') {
    lista.sort((a, b) => (a.chave === SEM ? -1 : b.chave === SEM ? 1 : colador.compare(a.titulo, b.titulo)));
  } else if (cfg.colunas === 'tipo') {
    lista.sort((a, b) => colador.compare(a.titulo, b.titulo));
  }
  if (cfg.ordemColunas?.length) {
    const pos = new Map(cfg.ordemColunas.map((k, i) => [k, i]));
    lista.sort((a, b) => {
      const pa = pos.get(a.chave);
      const pb = pos.get(b.chave);
      if (pa !== undefined && pb !== undefined) return pa - pb;
      if (pa !== undefined) return -1;
      if (pb !== undefined) return 1;
      return 0;
    });
  }
  if (cfg.limite > 0) for (const c of lista) c.excedeu = c.itens.length > cfg.limite;
  return lista;
}

/** Reordena a lista de chaves movendo `de` para a posição de `para`. */
export function reordenarColunas(chaves: string[], de: string, para: string): string[] {
  if (de === para) return [...chaves];
  const iDe = chaves.indexOf(de);
  const iPara = chaves.indexOf(para);
  if (iDe < 0 || iPara < 0) return [...chaves];
  const nova = [...chaves];
  nova.splice(iDe, 1);
  nova.splice(iPara, 0, de);
  return nova;
}

export type Movimento =
  | { tipo: 'marcador'; id: string; protocolo: string; remover?: string; adicionar?: string; texto?: string }
  | { tipo: 'atribuicao'; id: string; protocolo: string; para: string | null; de: string | null };

export type PlanoMovimento = { ok: true; movimento: Movimento } | { ok: false; motivo: string };

const nomeDe = (chave: string) => chave.slice(chave.indexOf(':') + 1);

export function planejarMovimento(modo: ConfigQuadro['colunas'], p: Processo, de: string, para: string): PlanoMovimento {
  if (de === para) return { ok: false, motivo: 'Mesma coluna.' };
  if (modo === 'marcador') {
    const origem = de === SEM ? undefined : nomeDe(de);
    const destino = para === SEM ? undefined : nomeDe(para);
    if (origem && !p.marcadores.some((m) => m.nome === origem)) return { ok: false, motivo: 'O processo já não tem esse marcador.' };
    const jaTemDestino = destino ? p.marcadores.some((m) => m.nome === destino) : false;
    const texto = origem ? p.marcadores.find((m) => m.nome === origem)?.texto : undefined;
    const mov: Movimento = { tipo: 'marcador', id: p.id, protocolo: p.protocolo };
    if (origem) mov.remover = origem;
    if (destino && !jaTemDestino) {
      mov.adicionar = destino;
      if (texto) mov.texto = texto;
    }
    if (!mov.remover && !mov.adicionar) return { ok: false, motivo: 'Nada a mudar.' };
    return { ok: true, movimento: mov };
  }
  if (modo === 'responsavel') {
    return {
      ok: true,
      movimento: { tipo: 'atribuicao', id: p.id, protocolo: p.protocolo, para: para === SEM ? null : nomeDe(para), de: de === SEM ? null : nomeDe(de) },
    };
  }
  return { ok: false, motivo: 'Esta divisão do quadro é só de leitura.' };
}

/** O processo como ficaria depois do movimento (atualização otimista). */
export function aplicarMovimento(p: Processo, mov: Movimento, nomes: Record<string, string> = {}): Processo {
  if (mov.tipo === 'atribuicao') {
    if (mov.para === null) {
      const { atribuicao: _, ...resto } = p;
      return resto;
    }
    return { ...p, atribuicao: { sigla: mov.para, nome: nomes[mov.para] ?? mov.para } };
  }
  let marcadores = p.marcadores;
  if (mov.remover) marcadores = marcadores.filter((m) => m.nome !== mov.remover);
  if (mov.adicionar) marcadores = [...marcadores, { nome: mov.adicionar, cor: '', texto: mov.texto ?? '' }];
  return { ...p, marcadores };
}
