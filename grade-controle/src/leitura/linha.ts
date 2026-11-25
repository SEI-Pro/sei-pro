/**
 * Uma linha da tabela nativa do Controle de Processos vira um `Processo`. Zero requisição: tudo vem do que o
 * SEI já pôs na linha (aria-label, tooltip e nome do SVG). A tabela nativa não é alterada.
 */
import { lerAnotacaoDaLinha } from '../../../anotacoes-controle/src/leitura';
import { fundir } from '../../../prazos/src/modelo/fusao';
import { lerPrazoNativo } from '../../../prazos/src/nativo/leitura';
import { marcadoresDaLinha } from '../../../prazos/src/pagina/linha';
import { lerMarcador } from '../../../prazos/src/modelo/marcador';
import { lerLinhaCaixa } from '../../../sei-nucleo/src/dominio/caixa';
import { decodificarEntidades } from '../../../sei-nucleo/src/sessao/entidades';
import { chamadas, texto } from '../../../sei-nucleo/src/sessao/literais';
import type { Grupo, MarcadorLinha, Processo, RetornoLinha } from '../modelo/tipos';

export interface ContextoLinha {
  grupo: Grupo;
  pagina: number;
  naPaginaAtual: boolean;
}

const COR = /marcador_([a-z0-9_]+)\.svg/i;

const DATA_HORA_RE = /\b(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?\b/;

function extrairDataHora(textoBruto: string): number | undefined {
  const m = DATA_HORA_RE.exec(textoBruto);
  if (!m) return undefined;
  const dt = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4] ?? 0), Number(m[5] ?? 0), Number(m[6] ?? 0)).getTime();
  return Number.isFinite(dt) ? dt : undefined;
}

function lerMarcadores(tr: Element): MarcadorLinha[] {
  const saida: MarcadorLinha[] = [];
  for (const a of tr.querySelectorAll('a[href*="acao=andamento_marcador_gerenciar"]')) {
    const args = chamadas(a.getAttribute('onmouseover') ?? '', 'infraTooltipMostrar')[0];
    const aria = decodificarEntidades(a.getAttribute('aria-label') ?? '').trim();
    const rotulo = /^Marcador\s*\/\s*(.*)$/s.exec(aria);
    const nome = (typeof args?.[1] === 'string' && args[1] ? texto(args[1]) : (rotulo?.[1] ?? '')).trim();
    if (!nome) continue;
    const textoMarcador = typeof args?.[0] === 'string' ? texto(args[0]).trim() : '';
    const dataHora = extrairDataHora(aria) ?? extrairDataHora(textoMarcador);
    saida.push({
      nome,
      cor: COR.exec(a.querySelector('img')?.getAttribute('src') ?? '')?.[1] ?? '',
      texto: textoMarcador,
      ...(dataHora !== undefined ? { dataHora } : {}),
    });
  }
  return saida;
}

function lerRetornos(tr: Element): RetornoLinha[] {
  const saida: RetornoLinha[] = [];
  for (const a of tr.querySelectorAll('a')) {
    const src = a.querySelector('img')?.getAttribute('src') ?? '';
    const m = /retorno_(programado|aguardando)(\d)?\.svg/.exec(src);
    if (!m) continue;
    const descricao = decodificarEntidades(a.getAttribute('aria-label') ?? '').trim();
    saida.push({ tipo: m[1] as RetornoLinha['tipo'], descricao, atrasado: m[2] === '3' || /atrasad/i.test(descricao) });
  }
  return saida;
}

function lerAtribuicao(tr: Element): Processo['atribuicao'] {
  const a = tr.querySelector('a[href*="acao=procedimento_atribuicao_listar"], a.ancoraSigla');
  const sigla = a?.textContent?.trim();
  if (!a || !sigla) return undefined;
  const nome = decodificarEntidades(a.getAttribute('title') ?? '').replace(/^Atribu[i\u00ED]do para\s+/i, '').trim();
  return { sigla, nome: nome || sigla };
}

/** `null` quando não é uma linha de processo (cabeçalho, linha de total, grupo do legado). */
export function lerProcessoDaLinha(tr: Element, ctx: ContextoLinha): Processo | null {
  const base = lerLinhaCaixa(tr, ctx.grupo);
  if (!base?.idProcedimento) return null;
  const marcadores = lerMarcadores(tr);
  let marcadorComPrazo = null;
  for (const m of marcadoresDaLinha(tr)) {
    const p = lerMarcador(m.texto);
    if (p) {
      marcadorComPrazo = p;
      break;
    }
  }
  const processo: Processo = {
    id: base.idProcedimento,
    protocolo: base.protocolo,
    grupo: ctx.grupo,
    tipo: base.tipo,
    especificacao: base.especificacao,
    sigiloso: base.sigiloso,
    naoVisualizado: base.novo,
    marcadores: base.sigiloso ? [] : marcadores,
    retornos: base.sigiloso ? [] : lerRetornos(tr),
    acompanhamentoEspecial: !base.sigiloso && !!tr.querySelector('a[href*="acao=acompanhamento"] , img[src*="acompanhamento_especial"], .acompanhamentoesp_icon'),
    documentoNovo: base.documentoNovo,
    pagina: ctx.pagina,
    naPaginaAtual: ctx.naPaginaAtual,
  };
  const marca = tr.querySelector('a[href*="acao=procedimento_trabalhar"]')?.getAttribute('onmouseover') ?? '';
  if (/\(URGENTE\)/.test(marca)) processo.urgente = true;
  if (/\(TRANCADO\)/.test(marca)) processo.trancado = true;
  const acomp = tr.querySelector('.acompanhamentoesp_icon');
  if (acomp) {
    const args = chamadas(acomp.getAttribute('onmouseover') ?? '', 'infraTooltipMostrar')[0];
    if (typeof args?.[1] === 'string' && args[1]) processo.acompanhamentoGrupo = texto(args[1]);
  }
  const href = tr.querySelector('a[href*="acao=procedimento_trabalhar"]')?.getAttribute('href');
  if (href) processo.link = decodificarEntidades(href);
  const hrefMarc = tr.querySelector('a[href*="acao=andamento_marcador_gerenciar"]')?.getAttribute('href');
  if (hrefMarc && !base.sigiloso) processo.linkMarcadores = decodificarEntidades(hrefMarc);
  const exclImg = tr.querySelector('img[src*="exclamacao"]');
  const excl = exclImg?.closest('a') ?? exclImg;
  if (excl) {
    const argsExcl = chamadas(excl.getAttribute('onmouseover') ?? '', 'infraTooltipMostrar')[0];
    const dicaExcl = (
      (typeof argsExcl?.[0] === 'string' && argsExcl[0] ? texto(argsExcl[0]) : '') ||
      decodificarEntidades(excl.getAttribute('aria-label') ?? '') ||
      decodificarEntidades(excl.getAttribute('title') ?? '') ||
      decodificarEntidades(exclImg?.getAttribute('title') ?? '') ||
      decodificarEntidades(exclImg?.getAttribute('alt') ?? '')
    ).trim();
    if (dicaExcl) processo.documentoNovoDica = dicaExcl;
  }
  const pc = tr.querySelector('a[href*="andamento_situacao_gerenciar"]');
  if (pc && !base.sigiloso) {
    const argsPc = chamadas(pc.getAttribute('onmouseover') ?? '', 'infraTooltipMostrar')[0];
    const txtPc = (
      (typeof argsPc?.[0] === 'string' && argsPc[0] ? texto(argsPc[0]) : '') ||
      decodificarEntidades(pc.getAttribute('aria-label') ?? '')
    ).trim();
    if (txtPc) processo.pontoControle = txtPc;
  }
  const atribuicao = lerAtribuicao(tr);
  if (atribuicao) processo.atribuicao = atribuicao;
  if (!base.sigiloso) {
    const anotacao = lerAnotacaoDaLinha(tr);
    if (anotacao) processo.anotacao = anotacao;
    const prazo = fundir(processo.id, lerPrazoNativo(tr), marcadorComPrazo);
    if (prazo) processo.prazo = prazo;
  }
  return processo;
}
