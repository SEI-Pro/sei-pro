/**
 * Escrita no controle de prazo nativo, pelo mesmo caminho do usuário (verificado no SEI 4.1.5):
 *
 * 1. POST ao link da barra do Controle de Processos (`acaoControleProcessos('…controle_prazo_definir…')`)
 *    com os campos da tela e UM processo no `hdn<Grupo>ItensSelecionados`, só na cópia: a seleção
 *    visível do usuário não muda. A resposta traz `#frmControlePrazoCadastro`.
 * 2. O `action` desse formulário é assinado e serve a QUALQUER conjunto de processos e a toda
 *    operação (definir, alterar, concluir): grava-se em lotes com um só.
 * 3. Excluir tem link próprio, no JS da tela de edição que o ícone do prazo abre.
 */
import { Formulario } from '../../../sei-nucleo/src/formulario/formulario';
import { paginaDe } from '../../../sei-nucleo/src/sessao/pagina';
import type { Http } from '../../../sei-nucleo/src/sessao/http';
import { formatarData } from '../../../sei-comum/src/datas/dias';
import type { DataISO } from '../modelo/tipos';
import { interpretarResposta, type ResultadoEnvio } from './resposta';

export type PrazoNovo = { tipo: 'data'; data: DataISO } | { tipo: 'dias'; dias: number; uteis: boolean };

/** `onclick="return acaoControleProcessos('controlador.php?acao=…', true, true);"` → o link. */
export function hrefDaBarra(doc: Document, acao: string): string | null {
  for (const a of doc.querySelectorAll(`a[onclick*="acao=${acao}"]`)) {
    const m = /acaoControleProcessos\('([^']+)'/.exec(a.getAttribute('onclick') ?? '');
    if (m) return m[1]!.replace(/&amp;/g, '&');
  }
  return null;
}

/** "Recebidos", "Gerados" ou "Detalhado": a tabela da linha dá o nome do grupo dos `hdn*`. */
export function grupoDaLinha(doc: Document, idProcedimento: string): string | null {
  const tr = doc.querySelector(`tr#P${idProcedimento}:not(.typeGerados)`) ?? doc.querySelector(`tr#P${idProcedimento}`);
  if (!tr) return null;
  if (tr.classList.contains('typeGerados')) return 'Gerados';
  const id = tr.closest('table')?.id ?? '';
  const m = /^tblProcessos(Recebidos|Gerados|Detalhado)$/.exec(id);
  return m ? m[1]! : null;
}

const acoesEmCache = new WeakMap<Document, string>();

/** O `action` assinado do formulário de definição, obtido uma vez por tela. */
export async function obterAcaoDefinir(http: Http, doc: Document, url: string, idProcedimento: string): Promise<string> {
  const guardado = acoesEmCache.get(doc);
  if (guardado) return guardado;
  const href = hrefDaBarra(doc, 'controle_prazo_definir');
  if (!href) throw new Error('Esta tela não tem o controle de prazo nativo do SEI.');
  const grupo = grupoDaLinha(doc, idProcedimento);
  if (!grupo) throw new Error('O processo não está numa tabela do Controle de Processos.');
  const tela = Formulario.de(paginaDe(doc, url), '#frmProcedimentoControlar');
  tela.definir({ [`hdn${grupo}ItensSelecionados`]: idProcedimento });
  const pagina = await http.enviar(href, tela.pares(), { aceitarValidacao: true });
  const action = Formulario.de(pagina, '#frmControlePrazoCadastro').action;
  acoesEmCache.set(doc, action);
  return action;
}

export function esquecerAcao(doc: Document): void {
  acoesEmCache.delete(doc);
}

function pares(ids: string[], rdo: '1' | '2' | '3', extra: Array<[string, string]> = []): Array<[string, string]> {
  return [
    ['rdoPrazo', rdo],
    ...extra,
    ['hdnIdControlePrazo', ''],
    ['hdnIdProcedimentos', ids.join(',')],
    ['sbmDefinirControlePrazo', 'Salvar'],
  ];
}

/** Define ou altera o prazo de vários processos de uma vez. */
export async function definirPrazo(http: Http, action: string, ids: string[], prazo: PrazoNovo): Promise<ResultadoEnvio> {
  const campos =
    prazo.tipo === 'data'
      ? pares(ids, '1', [['txtPrazo', formatarData(prazo.data)], ['txtDias', '']])
      : pares(ids, '2', [['txtPrazo', ''], ['txtDias', String(prazo.dias)], ...(prazo.uteis ? ([['chkSinDiasUteis', 'on']] as Array<[string, string]>) : [])]);
  return interpretarResposta(await http.enviar(action, campos, { aceitarValidacao: true }));
}

/** Conclui o prazo (o SEI mantém a data e registra a conclusão). */
export async function concluirPrazo(http: Http, action: string, ids: string[]): Promise<ResultadoEnvio> {
  return interpretarResposta(await http.enviar(action, pares(ids, '3'), { aceitarValidacao: true }));
}

/** Exclui o prazo: abre a tela de edição pelo link do ícone e usa o `action` de exclusão que ela traz. */
export async function excluirPrazo(http: Http, hrefDoIcone: string): Promise<ResultadoEnvio> {
  const tela = await http.obter(hrefDoIcone, { aceitarValidacao: true });
  const excluir = /\.action\s*=\s*'([^']*acao=controle_prazo_excluir[^']*)'/.exec(tela.html)?.[1]?.replace(/&amp;/g, '&');
  if (!excluir) return { ok: false, erro: 'Você não tem permissão para excluir o controle de prazo.', pagina: tela };
  const form = Formulario.de(tela, '#frmControlePrazoCadastro');
  return interpretarResposta(await http.enviar(excluir, form.pares(), { aceitarValidacao: true }));
}
