/**
 * Fachada do núcleo: uma instância por aba do SEI.
 *
 * Guarda o que é caro de descobrir e barato de reaproveitar — links do menu,
 * contexto do usuário, árvores recentes — e oferece as duas operações que
 * quase tudo usa: `localizar` (protocolo ou nº SEI → processo) e `arvore`.
 *
 * Não guarda nada entre abas nem entre recargas: o `infra_hash` é da sessão e
 * da unidade, e reaproveitá-lo depois de uma troca de unidade desloga.
 */

import { abrirArvore, type Arvore } from "./dominio/arvore";
import { Formulario } from "./formulario/formulario";
import { linksAssinados, parametros } from "./links/links";
import { analisarHtml, decodificarEntidades, textoDe } from "./sessao/dom";
import { ErroSei } from "./sessao/erros";
import { criarHttp, type DependenciasHttp, type Http, type OpcoesHttp, type Pagina } from "./sessao/http";

export interface ContextoSei {
  host: string;
  /** "4.1.5", "5.0.4"... ou "" quando a tela não informa. */
  versao: string;
  maior: number;
  unidade: { sigla: string; nome: string };
  usuario: { nome: string; login: string };
}

/** Lê a versão do SEI do título do logo ou da query string dos assets. */
export function lerVersao(html: string): string {
  const titulo = /Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(html);
  if (titulo) return titulo[1];
  return /\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(html)?.[1] ?? "";
}

/** Lê unidade e usuário do cabeçalho de qualquer tela completa do SEI. */
export function lerContexto(pagina: Pagina): ContextoSei {
  const d = pagina.doc;
  const unidade = d.querySelector("#lnkInfraUnidade");
  const usuario = d.querySelector("#lnkUsuarioSistema")?.getAttribute("title") ?? "";
  const [, nome = "", login = ""] = /^(.*?)\s*\(([^/)]+)/.exec(usuario) ?? [];
  const versao = lerVersao(pagina.html);
  return {
    host: new URL(pagina.url).host,
    versao,
    maior: Number(versao.split(".")[0]) || 0,
    unidade: { sigla: textoDe(unidade), nome: unidade?.getAttribute("title") ?? "" },
    usuario: { nome: nome.trim(), login: login.trim() },
  };
}

export interface Localizado {
  /** id_procedimento do processo. */
  idProcedimento: string;
  /** Quando a referência era um nº SEI de documento. */
  idDocumento?: string;
  /** Link assinado da árvore do processo. */
  linkArvore: string;
}

const TTL_ARVORE = 30_000;

export class Sei {
  readonly http: Http;
  private paginaBase: Pagina | null = null;
  private readonly arvores = new Map<string, { quando: number; arvore: Arvore }>();
  private readonly localizados = new Map<string, Localizado>();

  /**
   * @param base URL de qualquer tela do SEI (define a raiz).
   * @param paginaViva quem roda na aba passa a tela atual (tem menu e pesquisa rápida).
   */
  constructor(base: string, private readonly paginaViva: (() => Pagina | null) | null = null, deps?: DependenciasHttp) {
    this.http = criarHttp(base, deps);
  }

  /** Tela com menu, cabeçalho e pesquisa rápida: a viva, ou a última obtida. */
  private base(): Pagina {
    const viva = this.paginaViva?.();
    if (viva && viva.html.includes("frmProtocoloPesquisaRapida")) return viva;
    if (this.paginaBase) return this.paginaBase;
    if (viva) return viva;
    throw new ErroSei("SEI_NAO_ENCONTRADO", "Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.");
  }

  contexto(): ContextoSei {
    return lerContexto(this.base());
  }

  /** Link assinado de um item do menu principal (ex.: `procedimento_controlar`). */
  linkMenu(acao: string): string {
    // Procura primeiro no menu: a mesma ação aparece em outros lugares da tela
    // com parâmetros extras (ex.: `procedimento_controlar&tipo_filtro=M` é a
    // caixa filtrada por marcador, e usá-la mudaria a visão do usuário).
    const base = this.base();
    const menu = [...base.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")]
      .map((a) => a.getAttribute("href") ?? "")
      .join("\n");
    const candidatos = linksAssinados(menu).filter((l) => parametros(l).get("acao") === acao);
    const todos = candidatos.length ? candidatos : linksAssinados(base.html).filter((l) => parametros(l).get("acao") === acao);
    const l = todos.sort((a, b) => [...parametros(a).keys()].length - [...parametros(b).keys()].length)[0];
    if (!l) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O menu do SEI n\u00E3o oferece "${acao}" para este usu\u00E1rio.`);
    return l;
  }

  /** Recarrega a tela base (depois de trocar de unidade, por exemplo). */
  async renovarBase(op?: OpcoesHttp): Promise<Pagina> {
    this.paginaBase = await this.http.obter(this.linkMenu("procedimento_controlar"), op);
    this.arvores.clear();
    this.localizados.clear();
    return this.paginaBase;
  }

  /**
   * Resolve protocolo de processo, nº SEI de documento ou só os dígitos, pela
   * pesquisa rápida do cabeçalho — o mesmo caminho do usuário, que respeita as
   * permissões dele e devolve links assinados.
   */
  async localizar(referencia: string, op?: OpcoesHttp): Promise<Localizado> {
    const ref = referencia.trim();
    if (!ref) throw new ErroSei("ARGUMENTO_INVALIDO", "Informe o n\u00FAmero do processo ou o n\u00BA SEI do documento.");
    const emCache = this.localizados.get(ref);
    if (emCache) return emCache;

    const form = Formulario.de(this.base(), "#frmProtocoloPesquisaRapida", this.http);
    form.definir({ txtPesquisaRapida: ref });
    const pagina = await form.enviar(op);
    const p = parametros(pagina.url);
    if (p.get("acao") !== "procedimento_trabalhar") {
      throw new ErroSei("SEI_NAO_ENCONTRADO", `Nada encontrado no SEI para "${ref}", ou voc\u00EA n\u00E3o tem acesso a ele.`);
    }
    const linkArvore = pagina.doc.querySelector("#ifrArvore")?.getAttribute("src");
    if (!linkArvore) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "A tela do processo n\u00E3o trouxe a \u00E1rvore.");
    const pArv = parametros(decodificarEntidades(linkArvore));
    const idProcedimento = pArv.get("id_procedimento") ?? "";
    const idProtocolo = p.get("id_protocolo") ?? "";
    const achado: Localizado = {
      idProcedimento,
      idDocumento: idProtocolo && idProtocolo !== idProcedimento ? idProtocolo : undefined,
      linkArvore: decodificarEntidades(linkArvore),
    };
    this.localizados.set(ref, achado);
    return achado;
  }

  /** Árvore completa do processo (cache curto; `forcar` ignora o cache). */
  async arvore(referencia: string, op: OpcoesHttp & { forcar?: boolean } = {}): Promise<Arvore> {
    const loc = await this.localizar(referencia, op);
    const c = this.arvores.get(loc.idProcedimento);
    if (c && !op.forcar && Date.now() - c.quando < TTL_ARVORE) return c.arvore;
    const arvore = await abrirArvore(this.http, loc.linkArvore, op);
    this.arvores.set(loc.idProcedimento, { quando: Date.now(), arvore });
    return arvore;
  }

  /** Esquece a árvore em cache (chamar depois de qualquer escrita no processo). */
  invalidar(idProcedimento?: string): void {
    if (idProcedimento) this.arvores.delete(idProcedimento);
    else this.arvores.clear();
  }

  /**
   * Chamada `controlador_ajax.php` (montar select, autocompletar). A resposta é
   * XML com `<option value="">texto</option>` ou `<item id="" descricao="">`.
   */
  async ajax(link: string, campos: Array<[string, string]>, op?: OpcoesHttp): Promise<Array<{ id: string; texto: string }>> {
    const p = await this.http.enviar(link, campos, { ...op, aceitarValidacao: true });
    const itens: Array<{ id: string; texto: string }> = [];
    for (const m of p.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g)) {
      itens.push({ id: decodificarEntidades(m[1]), texto: decodificarEntidades(m[2]).trim() });
    }
    for (const m of p.html.matchAll(/<item\s+([^>]*)>/g)) {
      const a = analisarHtml(`<i ${m[1]}></i>`).querySelector("i");
      itens.push({ id: a?.getAttribute("id") ?? "", texto: a?.getAttribute("descricao") ?? a?.getAttribute("complemento") ?? "" });
    }
    return itens.filter((i) => i.id && i.id !== "null");
  }
}

export { linksAssinados };
