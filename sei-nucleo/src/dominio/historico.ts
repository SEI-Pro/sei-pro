/**
 * Histórico (andamentos) do processo — `procedimento_consultar_historico`.
 *
 * Três visões, como na tela: `R` resumido (padrão do SEI), `P` completo e
 * `T` total. A tabela é paginada pelo `hdnInfraPaginaAtual`; aqui as páginas
 * são percorridas até o fim ou até `limite`.
 *
 * O SEI guarda na SESSÃO o tipo e a página do último POST do formulário (medido no SEI SP 4.1.5: o "Consultar
 * Andamento" aberto depois, em qualquer aba, sai no tipo completo e na última página). Por isso todo percurso que
 * precisa de POST roda em exclusão e devolve a sessão ao estado de antes (`historicoSessao.ts`).
 *
 * Duas portas:
 * - `andamentos`/`andamentosDaArvore`/`andamentosDoLink`: leitura simples de um tipo, com `limite`;
 * - `coletarHistorico`: o histórico completo, com cache incremental, progresso, cancelamento e uma coleta por vez
 *   por processo (quem chega durante a coleta recebe o mesmo resultado).
 *
 * Substitui no legado: `getDadosHistoricoPro`, `getDadosHistoricoUrlPro`, `getDadosHistoricoPaginacao`,
 * `getArrayHistorico`, `atualizarCacheHistoricoPro` e a restauração de estado `restaurarPaginacaoHistoricoPro`
 * (com as coletas interrompidas: a pendência de restauro).
 */

import { acaoNaArvore, type Arvore } from "./arvore";
import {
  emExclusaoDoHistorico,
  gravarPendenciaHistorico,
  lerPendenciaHistorico,
  limparPendenciaHistorico,
  type EstadoHistorico,
} from "./historicoSessao";
import { dataISODe, ROTULOS } from "./passagens";
import { Formulario } from "../formulario/formulario";
import { linkDaAcao, parametros } from "../links/links";
import { textoDe } from "../sessao/dom";
import { comoErroSei, ErroSei } from "../sessao/erros";
import type { Pagina } from "../sessao/http";
import type { Sei } from "../sei";

export interface Andamento {
  /** "dd/mm/aaaa hh:mm" como o SEI exibe. */
  data: string;
  /** "aaaa-mm-ddThh:mm:00": o mesmo relógio do SEI, sem fuso nem conversão. Vazio se a data não for reconhecida. */
  dataISO?: string;
  unidade: string;
  /** Nome (descrição) da unidade, do `title` do link da sigla. A sigla do histórico pode diferir da do cabeçalho; o nome não. */
  unidadeNome?: string;
  usuario: string;
  /** Nome do usuário (o `title` do link do login). */
  usuarioNome?: string;
  descricao: string;
  /**
   * A linha vem marcada pelo SEI como `andamentoAberto` (amarela na tela): é a última da unidade e o processo segue aberto
   * nela (`sin_ultima_unidade_historico` no fonte do SEI). Falta quando a tela não traz a classe.
   */
  aberto?: boolean;
  /** Número SEI do documento citado na descrição (o texto do link), quando é um número. */
  nrSei?: string;
  /** `id_documento` do link; falta nos documentos excluídos. */
  idDocumento?: string;
  /** Em "Processo remetido pela unidade X": a sigla e o nome (`title`) de X, a unidade que enviou. */
  unidadeCitada?: string;
  unidadeCitadaNome?: string;
}

export type TipoHistorico = "resumido" | "completo" | "total";
const CODIGO: Record<TipoHistorico, string> = { resumido: "R", completo: "P", total: "T" };

const LIMITE_PADRAO = 500;
/** Teto de segurança de páginas por percurso: uma resposta que nunca acaba não prende o navegador. */
const MAX_PAGINAS = 2000;

function minusculas(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036F]/g, "")
    .toLowerCase();
}

function lerLinha(tr: Element): Andamento {
  const td = [...tr.querySelectorAll("td")];
  const data = textoDe(td[0]);
  const nome = td[1]?.querySelector("a")?.getAttribute("title") ?? "";
  const nomeUsuario = td[2]?.querySelector("a")?.getAttribute("title") ?? "";
  const descricao = textoDe(td[3]);
  const a: Andamento = { data, unidade: textoDe(td[1]), ...(nome ? { unidadeNome: nome } : {}), usuario: textoDe(td[2]), descricao };
  const iso = dataISODe(data);
  if (iso) a.dataISO = iso;
  if (nomeUsuario) a.usuarioNome = nomeUsuario;
  if (tr.classList.contains("andamentoAberto")) a.aberto = true;
  const doc = td[3]?.querySelector("a.ancoraHistoricoProcesso");
  if (doc) {
    const nr = textoDe(doc);
    if (/^\d+$/.test(nr)) a.nrSei = nr;
    const id = parametros(doc.getAttribute("href") ?? "").get("id_documento");
    if (id) a.idDocumento = id;
  }
  if (minusculas(descricao).startsWith(minusculas(ROTULOS.remetidoPrefixo))) {
    const citada = td[3]?.querySelector("a.ancoraSigla");
    const sigla = textoDe(citada);
    if (sigla) a.unidadeCitada = sigla;
    const nomeCitada = citada?.getAttribute("title") ?? "";
    if (nomeCitada) a.unidadeCitadaNome = nomeCitada;
  }
  return a;
}

function lerAndamentos(p: Pagina): { itens: Andamento[]; total: number } {
  const tabela = p.doc.querySelector("#tblHistorico");
  const total = Number(/\((\d+)\s+registro/.exec(textoDe(tabela?.querySelector("caption")))?.[1] ?? 0);
  const itens = [...(tabela?.querySelectorAll("tr") ?? [])].filter((tr) => tr.querySelector("td")).map(lerLinha);
  return { itens, total };
}

/** Andamentos da tela de histórico JÁ obtida (do mais recente para o mais antigo), sem requisição. */
export function lerHistorico(p: Pagina): Andamento[] {
  return lerAndamentos(p).itens;
}

/** Andamentos do processo, do mais recente para o mais antigo. */
export async function andamentos(
  sei: Sei,
  referencia: string,
  o: { tipo?: TipoHistorico; limite?: number; sinal?: AbortSignal } = {},
): Promise<{ protocolo: string; total: number; andamentos: Andamento[] }> {
  const arv = await sei.arvore(referencia, { sinal: o.sinal });
  return andamentosDaArvore(sei, arv, o);
}

function linkDoHistorico(arv: Arvore): string {
  if (arv.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Processo sigiloso: o agente n\u00E3o atua nele.");
  const link = acaoNaArvore(arv, "procedimento_consultar_historico") ?? linkDaAcao(arv.pagina.html, "procedimento_consultar_historico");
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", "O hist\u00F3rico deste processo n\u00E3o est\u00E1 dispon\u00EDvel.");
  return link;
}

/** Como `andamentos`, para quem já tem a árvore (ex.: abriu pelo link assinado da linha do Controle de Processos). */
export async function andamentosDaArvore(
  sei: Sei,
  arv: Arvore,
  o: { tipo?: TipoHistorico; limite?: number; sinal?: AbortSignal } = {},
): Promise<{ protocolo: string; total: number; andamentos: Andamento[] }> {
  const r = await andamentosDoLink(sei, linkDoHistorico(arv), o);
  return { protocolo: arv.protocolo, ...r };
}

/** Percorre o histórico a partir do link assinado de `procedimento_consultar_historico` (sem abrir a árvore). */
export async function andamentosDoLink(
  sei: Sei,
  link: string,
  o: { tipo?: TipoHistorico; limite?: number; sinal?: AbortSignal } = {},
): Promise<{ total: number; andamentos: Andamento[] }> {
  const r = await percorrer(sei, link, { tipo: CODIGO[o.tipo ?? "resumido"], limite: o.limite ?? LIMITE_PADRAO, sinal: o.sinal });
  return { total: r.total, andamentos: r.andamentos.slice(0, o.limite ?? LIMITE_PADRAO) };
}

// --- Percurso das páginas ---------------------------------------------------------------------------------------

function valorHdn(p: Pagina, nome: string): string {
  return p.doc.querySelector<HTMLInputElement>(`#frmProcedimentoHistorico input[name="${nome}"]`)?.getAttribute("value") ?? "";
}

/** Há página depois desta? Pela legenda ("3391 registros - 701 a 800"), senão pelo link de próxima ou pelo select de páginas. */
function temProxima(p: Pagina): boolean {
  const faixa = /\((\d+)\s+registros?\s*-\s*\d+\s+a\s+(\d+)\)/.exec(textoDe(p.doc.querySelector("#tblHistorico caption")));
  if (faixa) return Number(faixa[2]) < Number(faixa[1]);
  const prox = [...p.doc.querySelectorAll("#lnkInfraProximaPaginaSuperior, #lnkInfraProximaPaginaInferior")].some(
    (e) => !e.classList.contains("disabled") && e.getAttribute("aria-disabled") !== "true",
  );
  if (prox) return true;
  const opcoes = [...p.doc.querySelectorAll("#selInfraPaginacaoSuperior option")];
  return opcoes.length > 0 && !opcoes[opcoes.length - 1].hasAttribute("selected");
}

function chaveDoAndamento(a: Andamento): string {
  return [a.dataISO || a.data, a.unidade, a.usuario, a.descricao].join("|");
}

/** Cópia do histórico completo já coletado de um processo, que a coleta seguinte só acrescenta (quem guarda é quem chama). */
export interface CacheHistorico {
  /** `hdnInfraHashCriterios` da consulta completa: o SEI o calcula com o processo, o tipo de histórico e a unidade atual. */
  hash: string;
  /** Total de registros do histórico guardado. */
  total: number;
  andamentos: Andamento[];
}

/**
 * Se a primeira página nova só acrescentou andamentos ao que o cache já tem, devolve o histórico atualizado sem
 * percorrer o resto. Confere os 10 mais recentes do cache (por data, unidade, usuário e descrição) em sequência logo
 * depois dos novos: se um deles mudou, o cache não vale. Comportamento do legado (`atualizarCacheHistoricoPro`).
 */
export function acrescentarAoCache(cache: CacheHistorico | null | undefined, hash: string, total: number, primeira: Andamento[]): Andamento[] | null {
  if (!cache || !hash || !total || cache.hash !== hash) return null;
  // O total gravado tem de ser o do histórico gravado (uma cópia de outra consulta não serve).
  if (!cache.andamentos.length || cache.andamentos.length !== cache.total || !primeira.length) return null;
  const novos = total - cache.total;
  if (novos < 0) return null;
  const conferir = Math.min(10, cache.andamentos.length);
  for (let inicio = 0; inicio <= novos && inicio + conferir <= primeira.length; inicio += 1) {
    let igual = true;
    for (let k = 0; k < conferir; k += 1) {
      if (chaveDoAndamento(primeira[inicio + k]) !== chaveDoAndamento(cache.andamentos[k])) {
        igual = false;
        break;
      }
    }
    if (igual) return [...primeira.slice(0, inicio), ...cache.andamentos];
  }
  return null;
}

interface OpcoesPercurso {
  tipo: string;
  limite: number;
  sinal?: AbortSignal;
  aoProgresso?: (feito: number, total: number) => void;
  cache?: CacheHistorico | null;
}

interface Percorrido {
  andamentos: Andamento[];
  total: number;
  hash: string;
  completo: boolean;
  aproveitouCache: boolean;
}

/**
 * Lê o histórico no tipo pedido, página a página, sozinho em toda a origem e devolvendo a sessão do SEI ao estado em
 * que a encontrou. Sem POST nem exclusão quando o tipo e a página pedidos já são os da sessão e a primeira tela basta
 * (o caso comum do histórico resumido).
 */
async function percorrer(sei: Sei, link: string, o: OpcoesPercurso): Promise<Percorrido> {
  try {
    o.sinal?.throwIfAborted();
    const primeira = await sei.http.obter(link, { sinal: o.sinal });
    const rapido = lerSemMexer(sei, primeira, o);
    if (rapido) return rapido;
    return await emExclusaoDoHistorico(() => percorrerSozinho(sei, link, o), o.sinal);
  } catch (e) {
    throw comoErroSei(e);
  }
}

function lerSemMexer(sei: Sei, p: Pagina, o: OpcoesPercurso): Percorrido | null {
  if (!p.doc.querySelector("#frmProcedimentoHistorico") || !p.doc.querySelector("#tblHistorico")) return null;
  if ((valorHdn(p, "hdnTipoHistorico") || "R") !== o.tipo || (valorHdn(p, "hdnInfraPaginaAtual") || "0") !== "0") return null;
  if (lerPendenciaHistorico(sei.http.base.host)) return null; // uma coleta anterior morreu no meio: quem restaura passa pela exclusao
  const { itens, total } = lerAndamentos(p);
  if (temProxima(p) && itens.length < o.limite) return null;
  o.aoProgresso?.(1, 1);
  return { andamentos: itens, total: total || itens.length, hash: valorHdn(p, "hdnInfraHashCriterios"), completo: total ? itens.length >= total : true, aproveitouCache: false };
}

async function restaurar(sei: Sei, base: Pagina, estado: EstadoHistorico): Promise<void> {
  await Formulario.de(base, "#frmProcedimentoHistorico", sei.http)
    .definir({ hdnTipoHistorico: estado.tipo, hdnInfraPaginaAtual: estado.pagina })
    .enviar(); // sem o sinal de cancelamento: devolver a sessão não pode ser cancelado
}

async function percorrerSozinho(sei: Sei, link: string, o: OpcoesPercurso): Promise<Percorrido> {
  const host = sei.http.base.host;
  let original = await sei.http.obter(link, { sinal: o.sinal });
  if (!original.doc.querySelector("#frmProcedimentoHistorico")) {
    throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "A tela do SEI n\u00E3o \u00E9 a do hist\u00F3rico do processo.", textoDe(original.doc.querySelector("title")));
  }
  // Uma coleta anterior que morreu no meio deixou a sessão num estado que não é o do usuário: devolve antes de ler o "original".
  const pendente = lerPendenciaHistorico(host);
  if (pendente) {
    try {
      await restaurar(sei, original, pendente);
      limparPendenciaHistorico();
    } catch {
      // Se nem isso der, segue: o restauro desta coleta guarda o que estiver na sessão agora.
    }
    original = await sei.http.obter(link, { sinal: o.sinal });
  }

  const estadoOriginal: EstadoHistorico = { tipo: valorHdn(original, "hdnTipoHistorico") || "R", pagina: valorHdn(original, "hdnInfraPaginaAtual") || "0" };
  let ultimo: EstadoHistorico = estadoOriginal;
  let gravouPendencia = false;

  const postar = async (de: Pagina, pagina: number): Promise<Pagina> => {
    if (!gravouPendencia) {
      gravarPendenciaHistorico(host, estadoOriginal);
      gravouPendencia = true;
    }
    const alvo: EstadoHistorico = { tipo: o.tipo, pagina: String(pagina) };
    const resposta = await Formulario.de(de, "#frmProcedimentoHistorico", sei.http)
      .definir({ hdnTipoHistorico: alvo.tipo, hdnInfraPaginaAtual: alvo.pagina })
      .enviar({ sinal: o.sinal });
    ultimo = alvo;
    return resposta;
  };

  try {
    let pagina = estadoOriginal.tipo === o.tipo && estadoOriginal.pagina === "0" ? original : await postar(original, 0);
    if (!pagina.doc.querySelector("#tblHistorico")) {
      throw new ErroSei("SEI_RESPOSTA_INESPERADA", "O SEI n\u00E3o devolveu a tabela de andamentos.", textoDe(pagina.doc.querySelector("title")));
    }
    const primeira = lerAndamentos(pagina);
    const hash = valorHdn(pagina, "hdnInfraHashCriterios");
    const total = primeira.total;
    const alvo = total ? Math.min(total, o.limite) : o.limite;

    const doCache = acrescentarAoCache(o.cache, hash, total, primeira.itens);
    if (doCache) {
      o.aoProgresso?.(1, 1);
      return { andamentos: doCache, total, hash, completo: true, aproveitouCache: true };
    }

    const todos = [...primeira.itens];
    const porPagina = primeira.itens.length;
    const opcoes = pagina.doc.querySelectorAll("#selInfraPaginacaoSuperior option").length;
    const paginas = opcoes > 0 ? opcoes : total > porPagina && porPagina > 0 ? Math.ceil(total / porPagina) : 1;
    o.aoProgresso?.(1, paginas);
    for (let n = 1; todos.length < alvo && temProxima(pagina) && n < MAX_PAGINAS; n += 1) {
      pagina = await postar(pagina, n);
      const lida = lerAndamentos(pagina);
      if (!lida.itens.length) break;
      todos.push(...lida.itens);
      o.aoProgresso?.(n + 1, Math.max(paginas, n + 1));
    }
    const completo = total ? todos.length >= total : !temProxima(pagina);
    return { andamentos: todos, total: total || todos.length, hash, completo, aproveitouCache: false };
  } finally {
    if (gravouPendencia) {
      if (ultimo.tipo !== estadoOriginal.tipo || ultimo.pagina !== estadoOriginal.pagina) {
        try {
          await restaurar(sei, original, estadoOriginal);
          limparPendenciaHistorico();
        } catch {
          // Fica a pendência: a próxima coleta tenta de novo, antes de ler o "original".
        }
      } else {
        limparPendenciaHistorico();
      }
    }
  }
}

// --- Coleta do histórico completo ------------------------------------------------------------------------------

export interface OpcoesColeta {
  sinal?: AbortSignal;
  /** Páginas já lidas e total de páginas ("página 7 de 34"). */
  aoProgresso?: (feito: number, total: number) => void;
  /** O histórico completo já coletado deste processo, se quem chama o guardou. */
  cache?: CacheHistorico | null;
  /** Para de percorrer ao chegar a este número de andamentos (`completo` volta falso). Padrão: todos. */
  limite?: number;
}

export interface HistoricoColetado {
  /** Do mais recente para o mais antigo. */
  andamentos: Andamento[];
  total: number;
  /** `hdnInfraHashCriterios` do histórico completo: com `total` e `andamentos`, é o que `CacheHistorico` pede. */
  hash: string;
  /** Todos os registros foram lidos. */
  completo: boolean;
  /** Só a primeira página foi buscada: o resto veio do cache. */
  aproveitouCache: boolean;
}

interface ColetaEmCurso {
  promessa: Promise<HistoricoColetado>;
  controle: AbortController;
  /** Quantos chamadores ainda querem o resultado: a coleta só é cancelada quando todos desistem. */
  interessados: number;
  progresso: Set<(feito: number, total: number) => void>;
  ultimo: [number, number] | null;
}

const coletas = new Map<string, ColetaEmCurso>();

function chaveDaColeta(sei: Sei, link: string): string {
  return `${sei.http.base.host}|${parametros(link).get("id_procedimento") ?? link}`;
}

/**
 * O histórico COMPLETO do processo (tipo `P`), com cache incremental, progresso e cancelamento.
 *
 * Uma coleta por vez por processo: quem chega durante uma coleta espera a mesma e recebe o mesmo resultado (e o
 * progresso já andado). Cancelar o `sinal` de um chamador o solta na hora; a coleta só para quando todos desistem.
 * A sessão do SEI volta ao estado de antes (ver `historicoSessao.ts`) mesmo se a coleta falhar ou for cancelada.
 * Quem chama decide por quanto tempo o resultado vale; o núcleo não guarda nada além da coleta em andamento.
 */
export function coletarHistorico(sei: Sei, link: string, o: OpcoesColeta = {}): Promise<HistoricoColetado> {
  if (o.sinal?.aborted) return Promise.reject(new ErroSei("CANCELADO", "Opera\u00E7\u00E3o cancelada."));
  const chave = chaveDaColeta(sei, link);
  let coleta = coletas.get(chave);
  if (!coleta) {
    const controle = new AbortController();
    const progresso = new Set<(feito: number, total: number) => void>();
    const nova: ColetaEmCurso = { promessa: undefined as unknown as Promise<HistoricoColetado>, controle, interessados: 0, progresso, ultimo: null };
    nova.promessa = percorrer(sei, link, {
      tipo: CODIGO.completo,
      limite: o.limite ?? Number.POSITIVE_INFINITY,
      sinal: controle.signal,
      cache: o.cache,
      aoProgresso: (feito, total) => {
        nova.ultimo = [feito, total];
        for (const f of progresso) f(feito, total);
      },
    }).finally(() => {
      if (coletas.get(chave) === nova) coletas.delete(chave);
    });
    // Uma coleta cancelada por todos não tem mais ninguém para ouvir o erro.
    nova.promessa.catch(() => undefined);
    coletas.set(chave, nova);
    coleta = nova;
  }
  const atual = coleta;
  atual.interessados += 1;
  if (o.aoProgresso) {
    atual.progresso.add(o.aoProgresso);
    if (atual.ultimo) o.aoProgresso(atual.ultimo[0], atual.ultimo[1]);
  }

  return new Promise<HistoricoColetado>((resolver, rejeitar) => {
    let encerrado = false;
    const sair = () => {
      encerrado = true;
      if (o.aoProgresso) atual.progresso.delete(o.aoProgresso);
      o.sinal?.removeEventListener("abort", aoCancelar);
    };
    const aoCancelar = () => {
      if (encerrado) return;
      sair();
      atual.interessados -= 1;
      const erro = new ErroSei("CANCELADO", "Opera\u00E7\u00E3o cancelada.");
      if (atual.interessados > 0) {
        rejeitar(erro);
        return;
      }
      // Ninguém mais quer: a coleta para, uma nova chamada já começa outra (atrás desta, na exclusão) e quem cancelou
      // só é solto depois que a sessão do SEI voltou ao estado de antes, para o "Consultar Andamento" não sair trocado.
      if (coletas.get(chave) === atual) coletas.delete(chave);
      atual.controle.abort();
      atual.promessa.then(
        () => rejeitar(erro),
        () => rejeitar(erro),
      );
    };
    o.sinal?.addEventListener("abort", aoCancelar, { once: true });
    atual.promessa.then(
      (r) => {
        if (encerrado) return;
        sair();
        resolver(r);
      },
      (e: unknown) => {
        if (encerrado) return;
        sair();
        rejeitar(comoErroSei(e));
      },
    );
  });
}

/** Como `coletarHistorico`, para quem tem a árvore: acha o link e recusa processo sigiloso. */
export function coletarHistoricoDaArvore(sei: Sei, arv: Arvore, o: OpcoesColeta = {}): Promise<HistoricoColetado> {
  return coletarHistorico(sei, linkDoHistorico(arv), o);
}
