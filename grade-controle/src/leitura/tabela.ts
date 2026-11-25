/**
 * Lê as tabelas do Controle de Processos de um documento (a tela viva ou uma página buscada).
 *
 * Visão resumida: `#tblProcessosRecebidos` e `#tblProcessosGerados`. Visão detalhada: `#tblProcessosDetalhado`,
 * cujas colunas extras são localizadas pelo TEXTO do cabeçalho, nunca pela posição (varia entre versões).
 */
import { normalizarTexto } from '../../../sei-comum/src/texto';
import type { Grupo, LeituraTabela, Processo } from '../modelo/tipos';
import { lerProcessoDaLinha } from './linha';

export const SELETOR_TABELAS = '#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado';

const ID_TABELA: Record<Grupo, string> = { recebidos: 'tblProcessosRecebidos', gerados: 'tblProcessosGerados' };

type CampoCelula = 'tipo' | 'especificacao' | 'atribuicao' | 'marcador' | 'prioridade' | 'interessados' | 'observacao' | 'ultimaMov';
const ROTULOS: Array<[RegExp, CampoCelula]> = [
  [/^tipo( do processo)?$/, 'tipo'],
  [/^especificacao$/, 'especificacao'],
  [/^(atribuicao|atribuido( para)?|responsavel)$/, 'atribuicao'],
  [/^marcador(es)?$/, 'marcador'],
  [/^prioridade$/, 'prioridade'],
  [/^interessados?$/, 'interessados'],
  [/^observacao$/, 'observacao'],
  [/^ultima mov/, 'ultimaMov'],
];

function mapearCabecalho(tabela: Element): Map<number, CampoCelula> {
  const mapa = new Map<number, CampoCelula>();
  const cabecalho = tabela.querySelector('thead tr') ?? [...tabela.querySelectorAll('tr')].find((tr) => tr.querySelector('th'));
  [...(cabecalho?.children ?? [])].forEach((th, i) => {
    const rotulo = normalizarTexto(th.textContent ?? '');
    const achado = ROTULOS.find(([re]) => re.test(rotulo));
    if (achado) mapa.set(i, achado[1]);
  });
  return mapa;
}

function totalDoCaption(tabela: Element | null): { total: number; porPagina: number } {
  const t = (tabela?.querySelector('caption')?.textContent ?? '').replace(/\s+/g, ' ');
  const total = Number(/(\d+)\s+registro/.exec(t)?.[1] ?? 0);
  const faixa = /(\d+)\s+a\s+(\d+)\s*\)?/.exec(t);
  return { total, porPagina: faixa ? Number(faixa[2]) - Number(faixa[1]) + 1 : 0 };
}

function completarDaDetalhada(p: Processo, tr: Element, mapa: Map<number, CampoCelula>): void {
  if (!mapa.size) return;
  const celulas = [...tr.children];
  for (const [i, campo] of mapa) {
    const texto = (celulas[i]?.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (!texto) continue;
    if (campo === 'tipo' && !p.tipo) p.tipo = texto;
    else if (campo === 'especificacao' && !p.especificacao && !p.sigiloso) p.especificacao = texto;
    else if (campo === 'atribuicao' && !p.atribuicao) {
      const sigla = texto.replace(/^\(|\)$/g, '');
      p.atribuicao = { sigla, nome: sigla };
    } else if (campo === 'marcador' && !p.marcadores.length && !p.sigiloso) p.marcadores = [{ nome: texto, cor: '', texto: '' }];
    else if (p.sigiloso && (campo === 'interessados' || campo === 'observacao')) continue;
    else if (campo === 'prioridade') p.prioridade = texto;
    else if (campo === 'interessados') p.interessados = texto;
    else if (campo === 'observacao') p.observacao = texto;
    else if (campo === 'ultimaMov') {
      const d = /(\d{2})\/(\d{2})\/(\d{4})/.exec(texto);
      if (d) p.ultimaMov = `${d[3]}-${d[2]}-${d[1]}`;
    }
  }
}

function grupoDaLinha(tr: Element): Grupo {
  const nome = tr.querySelector('input[type=checkbox]')?.getAttribute('name') ?? '';
  return /^chkGerados/i.test(nome) ? 'gerados' : 'recebidos';
}

export interface OpcoesLeitura {
  pagina?: number;
  /** A tela viva do usuário (tem checkbox para espelhar); falso para páginas buscadas em segundo plano. */
  naPaginaAtual?: boolean;
}

export function lerTabelas(doc: Document, o: OpcoesLeitura = {}): LeituraTabela {
  const pagina = o.pagina ?? 0;
  const naPaginaAtual = o.naPaginaAtual ?? true;
  const processos: Processo[] = [];
  const totais: Record<Grupo, number> = { recebidos: 0, gerados: 0 };
  const porPagina: Record<Grupo, number> = { recebidos: 0, gerados: 0 };
  const detalhada = doc.getElementById('tblProcessosDetalhado');
  const vistos = new Set<string>();
  const juntar = (p: Processo | null) => {
    if (p && !vistos.has(p.id)) {
      vistos.add(p.id);
      processos.push(p);
    }
  };

  for (const grupo of ['recebidos', 'gerados'] as const) {
    const tabela = doc.getElementById(ID_TABELA[grupo]);
    const { total, porPagina: pp } = totalDoCaption(tabela);
    totais[grupo] = total;
    porPagina[grupo] = pp;
    for (const tr of tabela?.querySelectorAll('tr[id^="P"]') ?? []) {
      const g = tr.classList.contains('typeGerados') ? 'gerados' : grupo;
      juntar(lerProcessoDaLinha(tr, { grupo: g, pagina, naPaginaAtual }));
    }
  }
  if (detalhada) {
    const mapa = mapearCabecalho(detalhada);
    const { total, porPagina: pp } = totalDoCaption(detalhada);
    for (const tr of detalhada.querySelectorAll('tr')) {
      if (!tr.querySelector('a[href*="procedimento_trabalhar"]')) continue;
      const grupo = grupoDaLinha(tr);
      const p = lerProcessoDaLinha(tr, { grupo, pagina, naPaginaAtual });
      if (p && !vistos.has(p.id)) {
        completarDaDetalhada(p, tr, mapa);
        juntar(p);
        totais[grupo] = Math.max(totais[grupo], total);
        porPagina[grupo] = Math.max(porPagina[grupo], pp);
      }
    }
  }
  const campo = (nome: string) => (doc.getElementById(nome) as HTMLInputElement | null)?.getAttribute('value') ?? '';
  const selecoes = {
    recebidos: { itens: campo('hdnRecebidosItens'), hash: campo('hdnRecebidosItensHash') },
    gerados: { itens: campo('hdnGeradosItens'), hash: campo('hdnGeradosItensHash') },
    // Visao detalhada: uma tabela so, com campos proprios (hdnDetalhado...).
    detalhado: { itens: campo('hdnDetalhadoItens'), hash: campo('hdnDetalhadoItensHash') },
  };
  return { processos, totais, porPagina, visao: detalhada ? 'detalhada' : 'resumida', selecoes };
}
