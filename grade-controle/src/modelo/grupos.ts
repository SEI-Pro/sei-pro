/** Agrupamento. Cada grupo traz chave estável (para lembrar o que o usuário recolheu) e rótulo. */
import type { Ctx } from './contexto';
import { diasNaCaixa, diasParaVencer, resumoDoPrazo } from './derivados';
import { FAIXAS_DATA, faixaDaData } from './andamentos';
import type { AgruparPor, Processo } from './tipos';

export interface GrupoLista {
  chave: string;
  rotulo: string;
  itens: Processo[];
  /** Realce: grupos que pedem atenção (atrasados, novos). */
  tom?: 'perigo' | 'aviso' | 'neutro';
}

const colador = new Intl.Collator('pt-BR', { sensitivity: 'base', numeric: true });

function porRotulo(mapa: Map<string, GrupoLista>, ultimo: string[] = []): GrupoLista[] {
  return [...mapa.values()].sort((a, b) => {
    const ua = ultimo.indexOf(a.chave);
    const ub = ultimo.indexOf(b.chave);
    if (ua >= 0 || ub >= 0) return (ua < 0 ? -1 : ua) - (ub < 0 ? -1 : ub);
    return colador.compare(a.rotulo, b.rotulo);
  });
}

function pegar(mapa: Map<string, GrupoLista>, chave: string, rotulo: string, tom?: GrupoLista['tom']): GrupoLista {
  let g = mapa.get(chave);
  if (!g) {
    g = { chave, rotulo, itens: [], ...(tom ? { tom } : {}) };
    mapa.set(chave, g);
  }
  return g;
}

export const FAIXAS_PRAZO = [
  ['atrasado', 'Atrasados', 'perigo'],
  ['hoje', 'Vencem hoje', 'aviso'],
  ['semana', 'Próximos 7 dias', 'aviso'],
  ['mes', 'Próximos 30 dias', 'neutro'],
  ['depois', 'Depois de 30 dias', 'neutro'],
  ['desde', 'Contando desde uma data', 'neutro'],
  ['concluido', 'Prazo concluído', 'neutro'],
  ['sem', 'Sem prazo', 'neutro'],
] as const;
export type FaixaPrazo = (typeof FAIXAS_PRAZO)[number][0];

export function faixaDoPrazo(p: Processo, ctx: Ctx): FaixaPrazo {
  const r = resumoDoPrazo(p, ctx);
  if (!r) return 'sem';
  if (r.situacao === 'concluido') return 'concluido';
  if (r.situacao === 'desde') return 'desde';
  if (r.situacao === 'atrasado') return 'atrasado';
  if (r.situacao === 'hoje') return 'hoje';
  const d = diasParaVencer(p, ctx) ?? 0;
  return d <= 7 ? 'semana' : d <= 30 ? 'mes' : 'depois';
}

export const FAIXAS_CAIXA = [
  ['recente', 'Chegaram hoje'],
  ['semana', 'Nos últimos 7 dias'],
  ['mes', 'Nos últimos 30 dias'],
  ['antigo', 'Há mais de 30 dias'],
  ['desconhecido', 'Sem registro'],
] as const;

export function faixaDaCaixa(p: Processo, ctx: Ctx): (typeof FAIXAS_CAIXA)[number][0] {
  const d = diasNaCaixa(p, ctx);
  if (d === null) return 'desconhecido';
  return d < 1 ? 'recente' : d <= 7 ? 'semana' : d <= 30 ? 'mes' : 'antigo';
}

function fixos(mapa: Map<string, GrupoLista>, tabela: ReadonlyArray<readonly [string, string, ...string[]]>): GrupoLista[] {
  return tabela.map((t) => mapa.get(t[0])).filter((g): g is GrupoLista => !!g);
}

/**
 * Último marcador atribuído ao processo: usa a maior `dataHora` quando informada; caso contrário, o último
 * da lista (como fallback enquanto as datas reais ainda não foram consultadas no SEI).
 */
export function ultimoMarcador(p: Processo) {
  if (!p.marcadores.length) return undefined;
  if (p.marcadores.length === 1) return p.marcadores[0];
  let melhor = p.marcadores[p.marcadores.length - 1]!;
  let temData = melhor.dataHora !== undefined;
  for (let i = 0; i < p.marcadores.length; i++) {
    const atual = p.marcadores[i]!;
    if (atual.dataHora !== undefined && (!temData || atual.dataHora > melhor.dataHora!)) {
      melhor = atual;
      temData = true;
    }
  }
  return melhor;
}

export function agrupar(processos: Processo[], por: AgruparPor, ctx: Ctx): GrupoLista[] {
  if (por === 'nenhum') return [{ chave: 'todos', rotulo: 'Todos', itens: processos }];
  const m = new Map<string, GrupoLista>();
  for (const p of processos) {
    switch (por) {
      case 'responsavel':
        if (p.atribuicao) pegar(m, `u:${p.atribuicao.sigla}`, p.atribuicao.nome === p.atribuicao.sigla ? p.atribuicao.sigla : `${p.atribuicao.nome} (${p.atribuicao.sigla})`).itens.push(p);
        else pegar(m, 'sem', 'Sem responsável').itens.push(p);
        break;
      case 'tipo':
        pegar(m, `t:${p.tipo || '-'}`, p.tipo || 'Sem tipo').itens.push(p);
        break;
      case 'marcador': {
        const mk = ultimoMarcador(p);
        if (mk) pegar(m, `m:${mk.nome}`, mk.nome).itens.push(p);
        else pegar(m, 'sem', 'Sem marcador').itens.push(p);
        break;
      }
      case 'prazo': {
        const f = faixaDoPrazo(p, ctx);
        const def = FAIXAS_PRAZO.find((x) => x[0] === f)!;
        pegar(m, f, def[1], def[2]).itens.push(p);
        break;
      }
      case 'situacao':
        if (p.naoVisualizado) pegar(m, 'novo', 'Não visualizados', 'aviso').itens.push(p);
        else pegar(m, 'lido', 'Visualizados').itens.push(p);
        break;
      case 'grupo':
        pegar(m, p.grupo, p.grupo === 'recebidos' ? 'Recebidos' : 'Gerados').itens.push(p);
        break;
      case 'anotacao':
        if (p.anotacao?.prioridade) pegar(m, 'prio', 'Anotação com prioridade', 'aviso').itens.push(p);
        else if (p.anotacao) pegar(m, 'com', 'Com anotação').itens.push(p);
        else pegar(m, 'sem', 'Sem anotação').itens.push(p);
        break;
      case 'acompanhamento':
        if (p.acompanhamentoEspecial) pegar(m, 'com', 'Em acompanhamento especial').itens.push(p);
        else pegar(m, 'sem', 'Fora do acompanhamento especial').itens.push(p);
        break;
      case 'retorno':
        if (p.retornos.some((r) => r.atrasado)) pegar(m, 'atrasado', 'Retorno atrasado', 'perigo').itens.push(p);
        else if (p.retornos.some((r) => r.tipo === 'aguardando')) pegar(m, 'aguardando', 'Aguardando retorno').itens.push(p);
        else if (p.retornos.length) pegar(m, 'programado', 'Retorno programado').itens.push(p);
        else pegar(m, 'sem', 'Sem retorno').itens.push(p);
        break;
      case 'caixa': {
        const f = faixaDaCaixa(p, ctx);
        pegar(m, f, FAIXAS_CAIXA.find((x) => x[0] === f)![1]).itens.push(p);
        break;
      }
      case 'autuacao':
      case 'recebimento':
      case 'envio': {
        const f = faixaDaData(ctx.andamentos?.[p.id]?.[por], ctx.hoje);
        pegar(m, f, FAIXAS_DATA.find((x) => x[0] === f)![1]).itens.push(p);
        break;
      }
      case 'unidadeEnvio': {
        const u = ctx.andamentos?.[p.id]?.unidadeEnvio;
        if (u) pegar(m, `u:${u}`, u).itens.push(p);
        else pegar(m, 'sem', 'Sem informação').itens.push(p);
        break;
      }
    }
  }
  if (por === 'prazo') return fixos(m, FAIXAS_PRAZO);
  if (por === 'caixa') return fixos(m, FAIXAS_CAIXA);
  if (por === 'autuacao' || por === 'recebimento' || por === 'envio') return fixos(m, FAIXAS_DATA);
  if (por === 'situacao') return fixos(m, [['novo', ''], ['lido', '']]);
  if (por === 'grupo') return fixos(m, [['recebidos', ''], ['gerados', '']]);
  if (por === 'anotacao') return fixos(m, [['prio', ''], ['com', ''], ['sem', '']]);
  if (por === 'acompanhamento') return fixos(m, [['com', ''], ['sem', '']]);
  if (por === 'retorno') return fixos(m, [['atrasado', ''], ['aguardando', ''], ['programado', ''], ['sem', '']]);
  return porRotulo(m, ['sem']);
}

export const ROTULO_AGRUPAR: Record<AgruparPor, string> = {
  nenhum: 'Sem agrupamento',
  responsavel: 'Responsável',
  tipo: 'Tipo de processo',
  marcador: 'Marcador',
  prazo: 'Prazo',
  situacao: 'Visualização',
  grupo: 'Recebidos e gerados',
  anotacao: 'Anotação',
  acompanhamento: 'Acompanhamento especial',
  retorno: 'Retorno programado',
  caixa: 'Tempo na caixa',
  autuacao: 'Data de autuação',
  recebimento: 'Data de recebimento',
  envio: 'Data de envio',
  unidadeEnvio: 'Unidade de envio',
};
