/**
 * Árvore do processo (`procedimento_visualizar`).
 *
 * A árvore é a fonte mais rica e mais barata sobre um processo: numa só
 * requisição (com `abrir_pastas=1`) ela traz todos os documentos, os links
 * assinados de cada ação disponível ao usuário, o nível de acesso, as
 * assinaturas e os marcadores. Tudo vem como chamadas JavaScript geradas pelo
 * servidor (ver `sei/web/int/ProtocoloINT.php` e `ProcedimentoINT.php`):
 *
 *   Nos[n] = new infraArvoreNo(tipo, id, idPai, href, target, label, title,
 *                              icone, iconeAberto, iconeFechado, aberto,
 *                              habilitado, classe, classeSel, classeVis, protocolo)
 *   Nos[n].acoes = '<a href=...>...';   // barra de ações daquele nó
 *   Nos[n].src   = '...';                // conteúdo (documento_visualizar / download)
 *   NosAcoes[k]  = new infraArvoreAcao(tipo, id, idPai, href, target, title, icone, visivel[, sigla])
 *
 * Substitui no legado: `setDataDocs`, `getDocsArvore`, `getLinksArvore`,
 * `getListDocumentosArvore` (que lia o DOM já renderizado dentro do iframe) e
 * `getLinksArvorePasta`.
 */

import { ErroSei } from "../sessao/erros";
import type { Http, OpcoesHttp, Pagina } from "../sessao/http";
import { lerArgumentos, lerString, texto, type Literal } from "../sessao/literais";
import { linkDaAcao, linksAssinados } from "../links/links";

export type NivelAcesso = "publico" | "restrito" | "sigiloso";

export interface AcaoArvore {
  tipo: string;
  idPai: string;
  titulo: string;
  href: string;
  icone: string;
  /** Só no SEI 5, em UNIDADE_GERADORA. */
  extra?: string;
}

export interface DocumentoArvore {
  /** id_documento interno. */
  id: string;
  /** Número SEI (protocolo do documento), ex.: "0103947". */
  numero: string;
  /** Como aparece na árvore, sem o número entre parênteses. */
  titulo: string;
  pasta: string | null;
  /** Anexo (PDF, imagem, vídeo...) em vez de documento editado no SEI. */
  externo: boolean;
  /** pdf, interno, imagem, video, planilha... (do nome do ícone). */
  formato: string;
  nivel: NivelAcesso;
  hipotese?: string;
  assinado: boolean;
  /** Linhas do quadro "Assinado por:" (nome, cargo, unidade). */
  assinaturas: string[];
  cancelado: boolean;
  unidadeGeradora?: string;
  /** Link assinado para abrir o documento na árvore (`arvore_visualizar`). */
  link: string;
  /** Link do conteúdo (`documento_visualizar` ou `documento_download_anexo`). */
  src: string;
  /** Links assinados das ações do documento. */
  acoes: string[];
}

export interface Arvore {
  idProcedimento: string;
  protocolo: string;
  /** Tipo do processo (tooltip do nó raiz). */
  tipo: string;
  nivel: NivelAcesso;
  hipotese?: string;
  marcadores: string[];
  documentos: DocumentoArvore[];
  /** Links assinados das ações do processo (barra do nó raiz). */
  acoesProcesso: string[];
  /** Link assinado da tela do processo (`arvore_visualizar` do nó raiz). */
  linkProcesso: string;
  /** Ações sinalizadas no processo (NosAcoes com idPai = processo). */
  sinais: AcaoArvore[];
  /** Todos os links assinados da página, para ações não mapeadas. */
  links: string[];
  pagina: Pagina;
}

interface No {
  indice: number;
  args: Literal[];
  props: Record<string, string>;
}

function lerNos(html: string): No[] {
  const porIndice = new Map<number, No>();
  for (const m of html.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)) {
    const [args] = lerArgumentos(html, m.index! + m[0].length);
    porIndice.set(Number(m[1]), { indice: Number(m[1]), args, props: {} });
  }
  for (const m of html.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)) {
    const no = porIndice.get(Number(m[1]));
    if (!no) continue;
    const [valor] = lerString(html, m.index! + m[0].length - 1);
    no.props[m[2]] = valor;
  }
  return [...porIndice.values()].sort((a, b) => a.indice - b.indice);
}

function lerAcoes(html: string): AcaoArvore[] {
  const saida: AcaoArvore[] = [];
  for (const m of html.matchAll(/new\s+infraArvoreAcao\(/g)) {
    const [a] = lerArgumentos(html, m.index! + m[0].length);
    saida.push({
      tipo: texto(a[0]),
      idPai: texto(a[2]),
      href: texto(a[3]),
      titulo: texto(a[5]),
      icone: texto(a[6]),
      extra: a[8] == null ? undefined : texto(a[8]),
    });
  }
  return saida;
}

function nivelDe(sinais: AcaoArvore[], id: string): { nivel: NivelAcesso; hipotese?: string } {
  const na = sinais.find((s) => s.tipo === "NIVEL_ACESSO" && s.idPai === id);
  if (!na) return { nivel: "publico" };
  const [primeira, ...resto] = na.titulo.split("\n");
  const nivel: NivelAcesso = /sigilos/i.test(primeira) || /sigiloso/.test(na.icone) ? "sigiloso" : "restrito";
  return { nivel, hipotese: resto.join(" ").trim() || undefined };
}

const SEM_NUMERO = /\s*\(\d{5,}\)\s*$/;

/** Analisa o HTML da árvore. Não faz requisição. */
export function lerArvore(pagina: Pagina): Arvore {
  const html = pagina.html;
  const nos = lerNos(html);
  const sinais = lerAcoes(html);
  const raiz = nos.find((n) => n.args[0] === "PROCESSO");
  if (!raiz) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "A \u00E1rvore do processo n\u00E3o tem o n\u00F3 do processo.");
  const idProcedimento = texto(raiz.args[1]);
  const nivelProc = nivelDe(sinais, idProcedimento);

  const documentos: DocumentoArvore[] = nos
    .filter((n) => n.args[0] === "DOCUMENTO")
    .map((n) => {
      const id = texto(n.args[1]);
      const rotulo = texto(n.args[5]);
      const icone = texto(n.args[7]);
      const src = (n.props.src ?? "").replace(/&amp;/g, "&");
      const assin = sinais.find((s) => s.tipo === "ASSINATURA" && s.idPai === id);
      const { nivel, hipotese } = nivelDe(sinais, id);
      const formato = (/documento_([a-z0-9]+)\.svg/.exec(icone)?.[1] ?? "interno").replace("cancelado", "interno");
      return {
        id,
        numero: texto(n.args[15]) || (/\((\d{5,})\)\s*$/.exec(rotulo)?.[1] ?? ""),
        titulo: rotulo.replace(SEM_NUMERO, ""),
        pasta: n.args[2] && String(n.args[2]).startsWith("PASTA") ? String(n.args[2]) : null,
        externo: /documento_download_anexo/.test(src) || !/documento_interno|documento_cancelado|formulario|email/.test(icone),
        formato,
        nivel,
        hipotese,
        assinado: Boolean(assin),
        assinaturas: assin ? assin.titulo.split("\n").slice(1).filter(Boolean) : [],
        cancelado: /documento_cancelado/.test(icone),
        unidadeGeradora: sinais.find((s) => s.tipo === "UNIDADE_GERADORA" && s.idPai === id)?.extra,
        link: texto(n.args[3]).replace(/&amp;/g, "&"),
        src,
        acoes: linksAssinados(n.props.acoes ?? ""),
      };
    });

  return {
    idProcedimento,
    protocolo: texto(raiz.args[5]) || texto(raiz.args[15]),
    tipo: texto(raiz.args[6]),
    nivel: nivelProc.nivel,
    hipotese: nivelProc.hipotese,
    marcadores: sinais
      .filter((s) => s.tipo === "MARCADOR" && s.idPai === idProcedimento)
      .map((s) => s.titulo.replace(/^Marcador\n/, "").replace(/\n/g, " \u2014 ")),
    documentos,
    acoesProcesso: linksAssinados(raiz.props.acoes ?? ""),
    linkProcesso: texto(raiz.args[3]).replace(/&amp;/g, "&"),
    sinais: sinais.filter((s) => s.idPai === idProcedimento),
    links: linksAssinados(html),
    pagina,
  };
}

/**
 * Abre a árvore completa de um processo (todas as pastas).
 *
 * `entrada` é um link assinado de `procedimento_trabalhar` ou de
 * `procedimento_visualizar` do processo. A árvore inicial vem com as pastas
 * fechadas (carregadas sob demanda); o link `abrir_pastas=1`, também assinado,
 * traz tudo numa segunda requisição.
 */
export async function abrirArvore(http: Http, entrada: string, op?: OpcoesHttp): Promise<Arvore> {
  let pagina = await http.obter(entrada, op);
  if (!/acao=procedimento_visualizar/.test(pagina.url)) {
    const src = pagina.doc.querySelector("#ifrArvore")?.getAttribute("src");
    if (!src) throw new ErroSei("SEI_NAO_ENCONTRADO", "N\u00E3o foi poss\u00EDvel abrir a \u00E1rvore do processo.");
    pagina = await http.obter(src, op);
  }
  if (/infraArvoreNo\("PASTA"/.test(pagina.html)) {
    const todas = linkDaAcao(pagina.html, "procedimento_visualizar") && linksAssinados(pagina.html).find((l) => /abrir_pastas=1/.test(l));
    if (todas) pagina = await http.obter(todas, op);
  }
  return lerArvore(pagina);
}

/** Link assinado de uma ação na barra do processo ou do documento. */
export function acaoNaArvore(arvore: Arvore, acao: string, idDocumento?: string): string | null {
  if (idDocumento) {
    const doc = arvore.documentos.find((d) => d.id === idDocumento);
    return doc ? linkDaAcao(doc.acoes, acao) : null;
  }
  return linkDaAcao(arvore.acoesProcesso, acao) ?? linkDaAcao(arvore.links, acao, { id_procedimento: arvore.idProcedimento });
}
