/**
 * Lado do SEI, MUNDO DA PÁGINA.
 *
 * Aqui estão a sessão, o DOM da árvore e as funções do SEI Pro — e é por isso
 * que o trabalho de verdade acontece neste arquivo, e não no content script.
 * Ele não fala com a página da ferramenta diretamente: quem tem a porta é o
 * mundo isolado (`js/init_ferramentaspdf.js`), e os dois trocam mensagens pelo
 * documento que compartilham.
 *
 * O BOTÃO DA BARRA É UM LINK COMUM, não um `window.open`. Além de não depender
 * de o navegador permitir a janela, isso elimina uma classe inteira de defeito:
 * a versão anterior tentava reaproveitar a janela anterior consultando-a pelo
 * nome, e `window.open("", nome)` CRIA uma aba em branco quando o nome não
 * existe — o usuário clicava e recebia um about:blank que nunca carregava.
 */

import {
  acharLinkDeIncluirDocumento,
  enviarDocumentoExterno,
  nomeParaUpload,
  type Codificadores,
} from "@/ponte/enviarDocumento";
import { extrairParametros } from "@/ponte/parametrosUpload";
import {
  CANAL,
  deBase64,
  ehDoCanal,
  paraBase64,
  type Apresentacao,
  type Operacao,
  type Pedido,
  type Resposta,
} from "@/ponte/protocolo";

/** Um documento da árvore, como o `setDataDocs` do SEI Pro o descreve. */
interface DocumentoDaArvore {
  id_documento: string;
  nome: string;
  numero?: string;
  /** Falso para documento nato do SEI (HTML); verdadeiro para anexo. */
  externo: boolean;
  cancelado?: boolean;
  /** Link direto do arquivo. É o que permite baixá-lo. */
  src?: string;
}

declare const window: Window & {
  URL_SPRO?: string;
  loadFerramentasPdfPro?: boolean;
  /** Do SEI Pro: extrai os documentos e os links diretos do HTML da árvore. */
  setDataDocs?: (htmlArvore: string, idProcedimento: string) => DocumentoDaArvore[];
  getSeiVersionPro?: () => string;
  getListDocumentosArvore?: (ifr: unknown) => void;
  pullDadosProcessoSession?: () => { listDocumentos?: DocumentoArvore[] } | false;
  /** Do SEI Pro e do próprio SEI: usados no envio de documento externo. */
  getConfigValue?: (chave: string) => unknown;
  checkConfigValue?: (chave: string) => boolean;
  escapeComponent?: (s: string) => string;
  encodeURI_toHex?: (s: string) => string;
  infraFormatarTamanhoBytes?: (bytes: number) => string;
};

interface DocumentoArvore {
  id_protocolo: string;
  nr_sei?: string;
  documento: string;
  nativo: boolean;
}

const MARCA_INTERNA = "seipro-fpdf-interno";

/** Identifica esta aba do SEI, para a página distinguir quando há várias. */
const ORIGEM = `${location.host}#${Math.random().toString(36).slice(2, 8)}`;

// ---- conversa com o mundo isolado ----

window.addEventListener("message", (ev: MessageEvent) => {
  if (ev.source !== window) return;
  const m = ev.data as { __marca?: string; direcao?: string; dados?: unknown };
  if (m?.__marca !== MARCA_INTERNA) return;

  if (m.direcao === "apresentar") {
    enviarAoIsolado("ola", montarApresentacao());
    return;
  }

  if (m.direcao === "pedido" && ehDoCanal(m.dados)) {
    void atender(m.dados as Pedido);
  }
});

function enviarAoIsolado(direcao: "resposta" | "ola", dados: unknown): void {
  window.postMessage({ __marca: MARCA_INTERNA, direcao, dados }, "*");
}

function montarApresentacao(): Apresentacao {
  const ctx = lerContexto();
  return {
    canal: CANAL,
    tipo: "ola",
    origem: ORIGEM,
    host: ctx.host,
    protocolo: ctx.protocolo,
    idProcedimento: ctx.idProcedimento,
    unidade: ctx.unidade,
    versaoSei: ctx.versaoSei,
  };
}

async function atender(pedido: Pedido): Promise<void> {
  const responder = (carga: unknown, erro: Resposta["erro"] = null) =>
    enviarAoIsolado("resposta", { canal: CANAL, id: pedido.id, carga, erro } satisfies Resposta);

  try {
    const carga = await executar(pedido.op, pedido.carga, (feito, total) =>
      enviarAoIsolado("resposta", {
        canal: CANAL,
        id: pedido.id,
        progresso: { feito, total },
      } satisfies Resposta),
    );
    responder(carga);
  } catch (e) {
    responder(null, {
      codigo: (e as { codigo?: string }).codigo ?? "SEI_INDISPONIVEL",
      detalhe: (e as Error).message,
    });
  }
}

class ErroSei extends Error {
  constructor(readonly codigo: string, mensagem?: string) {
    super(mensagem ?? codigo);
  }
}

async function executar(
  op: Operacao,
  carga: unknown,
  aoProgredir: (feito: number, total: number) => void,
): Promise<unknown> {
  switch (op) {
    case "contexto":
      return lerContexto();

    case "parametrosUpload":
      return lerParametrosUpload();

    case "listarDocumentos":
      return listarDocumentos();

    case "obterPdf": {
      const { id } = carga as { id: string };
      return baixarDocumento(id, aoProgredir);
    }

    case "enviarAoProcesso": {
      const dados = carga as { nome: string; base64: string; tipoDocumentoId?: string };
      return enviarAoProcesso(dados, aoProgredir);
    }

    case "focarSei":
      window.focus();
      return { ok: true };

    default:
      throw new ErroSei("SEI_INDISPONIVEL", `operação desconhecida: ${String(op)}`);
  }
}

function lerContexto() {
  const numero = document
    .querySelector("#divArvoreInformacao, .infraArvoreNoSelecionado")
    ?.textContent?.trim();
  const idProcedimento =
    new URLSearchParams(window.location.search).get("id_procedimento") ?? undefined;
  return {
    protocolo: numero || undefined,
    idProcedimento,
    unidade: document.querySelector("#selInfraUnidade option:checked")?.textContent?.trim(),
    host: window.location.host,
    versaoSei: window.getSeiVersionPro?.(),
  };
}

/**
 * Le o tamanho maximo e as extensoes aceitas DESTA instalacao.
 *
 * Nao existe um "limite do SEI": cada instalacao configura o seu, e a diferenca
 * entre uma e outra vai de poucos megabytes a varios gigabytes. O unico jeito
 * honesto de saber e perguntar ao proprio sistema -- que e o que esta funcao
 * faz, lendo a tela de inclusao de documento externo.
 *
 * O CAMINHO ATE ESSA TELA PASSA PELO LINK ASSINADO DA ARVORE, e nao por uma URL
 * montada aqui. Ver `acharLinkDeIncluirDocumento`: link de acao sem assinatura
 * faz o SEI DESLOGAR o usuario. Como esta leitura acontece sozinha, assim que a
 * pagina conecta, a versao anterior derrubava a sessao de quem apenas abriu as
 * Ferramentas de PDF de dentro de um processo -- sem clicar em nada.
 */
async function lerParametrosUpload(): Promise<{
  bytesPorArquivo?: number;
  extensoes?: string[];
} | null> {
  try {
    const idProcedimento = new URLSearchParams(window.location.search).get("id_procedimento");
    if (!idProcedimento) return null;

    const entrada = acharLinkDeIncluirDocumento(await lerHtmlDaArvore(idProcedimento));
    if (!entrada) return null;

    const resposta = await fetch(entrada, { credentials: "same-origin" });
    if (!resposta.ok) return null;
    const html = await lerTexto(resposta);

    const doc = new DOMParser().parseFromString(html, "text/html");
    const link = doc.querySelector<HTMLAnchorElement>(
      'a[href*="acao=documento_receber"]',
    );
    if (!link) return null;

    const tela = await fetch(limparHtml(link.getAttribute("href")!), {
      credentials: "same-origin",
    });
    if (!tela.ok) return null;
    return extrairParametros(await lerTexto(tela));
  } catch {
    // Falhar aqui NAO e erro: significa apenas que seguimos com os limites
    // tipicos, e a interface diz de onde eles vieram. Um numero inventado com
    // selo de "apurado" seria muito pior -- gera documento recusado.
    return null;
  }
}

/** Documentos externos da arvore, que sao os que da para trazer. */
/**
 * Documentos da árvore, com o link direto de cada um.
 *
 * Usa o `setDataDocs` do próprio SEI Pro, e não uma leitura própria da árvore.
 * Ele já resolve três coisas que custaram caro para descobrir:
 *
 * 1. Distingue documento externo de nato do SEI pelo ícone, o que vale nas
 *    várias versões.
 * 2. Traz o `src` -- o link direto do arquivo. Ele NÃO pode ser montado à mão:
 *    no SEI novo a ação é `exibir_arquivo` e carrega parâmetros que não são
 *    deriváveis do id do documento.
 * 3. Expande as pastas antes de ler, então processo com volumes fechados não
 *    devolve uma lista pela metade.
 */
async function listarDocumentos(): Promise<
  { id: string; nome: string; numero?: string; nativo: boolean; baixavel: boolean }[]
> {
  const docs = await lerDocumentosDaArvore();
  return docs
    .filter((d) => !d.cancelado)
    .map((d) => ({
      id: d.id_documento,
      nome: d.nome,
      numero: d.numero,
      nativo: !d.externo,
      // Só o que é externo E tem link é trazível. Documento nato do SEI é HTML.
      baixavel: d.externo && Boolean(d.src),
    }));
}

/** Cache por processo: a árvore não muda no meio de uma escolha de documentos. */
let cacheDocumentos: { idProcedimento: string; docs: DocumentoDaArvore[] } | null = null;

async function lerDocumentosDaArvore(): Promise<DocumentoDaArvore[]> {
  const idProcedimento = new URLSearchParams(window.location.search).get("id_procedimento");
  if (!idProcedimento) throw new ErroSei("SEI_SEM_PROCESSO");

  if (cacheDocumentos?.idProcedimento === idProcedimento) return cacheDocumentos.docs;

  const extrair = window.setDataDocs;
  if (typeof extrair !== "function") throw new ErroSei("SEI_INDISPONIVEL", "setDataDocs ausente");

  const html = await lerHtmlDaArvore(idProcedimento);
  const docs = extrair(html, idProcedimento);
  cacheDocumentos = { idProcedimento, docs };
  return docs;
}

/**
 * HTML da árvore do processo, com TODAS as pastas expandidas.
 *
 * POR QUE A EXPANSÃO É OBRIGATÓRIA: ao abrir um processo, o SEI mostra apenas
 * o último volume -- ou o volume do documento apontado na URL. Ler a árvore
 * como ela vem devolve só os documentos visíveis, e o usuário não tem como
 * saber que faltou: a lista simplesmente aparece menor do que o processo é. Em
 * processo com vários volumes a diferença é de dezenas de documentos.
 *
 * O link de expansão fica no menu da própria árvore (`#topmenu`), e é o mesmo
 * que o Ações em Lote usa. Buscamos o HTML dele por requisição, sem navegar
 * nenhum quadro -- o que, de quebra, dispensa neutralizar o
 * `atualizarVisualizacao()` do SEI, que numa navegação de verdade recarregaria
 * a árvore por baixo.
 */
async function lerHtmlDaArvore(idProcedimento: string): Promise<string> {
  const base = `${location.origin}${location.pathname}`;
  const htmlProcesso = await lerTexto(
    await fetch(`${base}?acao=procedimento_trabalhar&id_procedimento=${idProcedimento}`, {
      credentials: "same-origin",
    }),
  );

  const srcArvore =
    htmlProcesso.match(/id="ifrArvore"[^>]*src="([^"]+)"/i)?.[1] ??
    htmlProcesso.match(/src="([^"]*acao=arvore_visualizar[^"]*)"/i)?.[1];
  if (!srcArvore) throw new ErroSei("SEI_SESSAO_EXPIRADA", "árvore não encontrada");

  const html = await lerTexto(
    await fetch(limparHtml(srcArvore), { credentials: "same-origin" }),
  );

  const linkExpandir = acharLinkDeExpansao(html);
  if (!linkExpandir) return html;

  const expandido = await lerTexto(
    await fetch(limparHtml(linkExpandir), { credentials: "same-origin" }),
  );

  // Se a expansão falhar, seguimos com a árvore parcial em vez de quebrar: uma
  // lista incompleta ainda é melhor do que nenhuma.
  return expandido.includes("infraArvoreNo") ? expandido : html;
}

/**
 * Acha o link que abre todas as pastas.
 *
 * Primeiro no menu da árvore, que é onde ele fica e é o que o Ações em Lote
 * usa; depois em qualquer lugar do HTML, porque a marcação do menu muda entre
 * as versões do SEI e o parâmetro é estável.
 */
function acharLinkDeExpansao(html: string): string | null {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const doMenu = [...doc.querySelectorAll<HTMLAnchorElement>("#topmenu a, .infraArvoreTopMenu a")]
    .map((a) => a.getAttribute("href") ?? "")
    .find((href) => href.includes("abrir_pastas=1"));
  if (doMenu) return doMenu;

  const solto = html.match(
    /https?:\/\/[^"']*abrir_pastas=1[^"']*|controlador\.php\?[^"']*abrir_pastas=1[^"']*/,
  );
  return solto ? solto[0] : null;
}

/**
 * Lê o corpo de uma resposta do SEI com o charset CERTO.
 *
 * O SEI serve as páginas em ISO-8859-1, e `Response.text()` decodifica como
 * UTF-8 quando o cabeçalho não diz o contrário. O resultado é mojibake em todo
 * acento: "Declaração de Matrícula" chega como "Declara??o de Matr?cula" na
 * lista de documentos. O nome errado não é só feio -- é o nome que o usuário
 * usa para reconhecer a peça que quer trazer.
 */
async function lerTexto(resposta: Response): Promise<string> {
  const tipo = resposta.headers.get("content-type") ?? "";
  const declarado = tipo.match(/charset=([\w-]+)/i)?.[1]?.toLowerCase();
  // Sem declaração explícita vale o padrão do SEI, não o do navegador.
  const codificacao = declarado && declarado !== "utf-8" ? declarado : declarado ? "utf-8" : "iso-8859-1";
  const bytes = await resposta.arrayBuffer();
  try {
    return new TextDecoder(codificacao).decode(bytes);
  } catch {
    // Codificação desconhecida: latin1 nunca falha e preserva os bytes.
    return new TextDecoder("iso-8859-1").decode(bytes);
  }
}

/** Desfaz o escape de entidade que vem no HTML. */
function limparHtml(url: string): string {
  return url.replace(/&amp;/g, "&");
}

/**
 * Traz o arquivo de um documento externo.
 *
 * O link vem do `src` que o SEI publica na própria árvore, e NÃO é montado
 * aqui. Montar `documento_download_anexo&id_documento=X` à mão parece
 * funcionar e não funciona: no SEI novo a ação chama-se `exibir_arquivo` e
 * carrega parâmetros que não derivam do id. O sintoma era o SEI devolver a
 * página HTML em vez do arquivo.
 */
async function baixarDocumento(
  id: string,
  aoProgredir: (feito: number, total: number) => void,
): Promise<{ nome: string; base64: string }> {
  const docs = await lerDocumentosDaArvore();
  const doc = docs.find((d) => String(d.id_documento) === String(id));

  if (!doc) throw new ErroSei("SEI_DOCUMENTO_AUSENTE", id);
  if (!doc.externo) throw new ErroSei("SEI_DOCUMENTO_NATO", doc.nome);
  if (!doc.src) throw new ErroSei("SEI_SEM_LINK", doc.nome);

  const resposta = await fetch(doc.src.replace(/&amp;/g, "&"), { credentials: "same-origin" });
  if (!resposta.ok) throw new ErroSei("SEI_SESSAO_EXPIRADA", String(resposta.status));

  // O SEI responde a sessão expirada com a TELA DE LOGIN e status 200. Sem esta
  // conferência, o "PDF" baixado seria uma página HTML: o usuário só descobriria
  // ao abrir o documento corrompido, possivelmente depois de anexá-lo.
  const tipo = resposta.headers.get("content-type") ?? "";
  if (tipo.includes("text/html")) throw new ErroSei("SEI_SESSAO_EXPIRADA");

  const total = Number(resposta.headers.get("content-length") ?? 0);
  const bytes = await lerComProgresso(resposta, total, aoProgredir);

  const disposicao = resposta.headers.get("content-disposition") ?? "";
  const achado = disposicao.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  const nome = achado ? decodeURIComponent(achado[1]) : nomeDeArquivo(doc);

  return { nome, base64: paraBase64(bytes) };
}

/** Nome de arquivo a partir do documento, quando o SEI não informa um. */
function nomeDeArquivo(doc: DocumentoDaArvore): string {
  const base = [doc.nome, doc.numero].filter(Boolean).join(" ").trim() || "documento";
  const limpo = base.replace(/[\\/:*?"<>|]+/g, "-").slice(0, 80);
  return /\.[a-z0-9]{2,5}$/i.test(limpo) ? limpo : `${limpo}.pdf`;
}

/** Lê o corpo em fluxo, para poder informar progresso de documento grande. */
async function lerComProgresso(
  resposta: Response,
  total: number,
  aoProgredir: (feito: number, total: number) => void,
): Promise<Uint8Array> {
  if (!resposta.body) return new Uint8Array(await resposta.arrayBuffer());
  const leitor = resposta.body.getReader();
  const pedacos: Uint8Array[] = [];
  let lido = 0;
  for (;;) {
    const { done, value } = await leitor.read();
    if (done) break;
    if (!value) continue;
    pedacos.push(value);
    lido += value.byteLength;
    if (total > 0) aoProgredir(lido, total);
  }
  const junto = new Uint8Array(lido);
  let off = 0;
  for (const pedaco of pedacos) {
    junto.set(pedaco, off);
    off += pedaco.byteLength;
  }
  return junto;
}

/**
 * Devolve o arquivo pronto ao processo, como documento externo.
 *
 * Os quatro passos vivem em `enviarDocumento.ts`, contra um ambiente injetado,
 * para que a sequência inteira possa ser exercitada sem SEI. Aqui fica só o que
 * é genuinamente do navegador: a rede, o charset e as funções do SEI Pro.
 */
async function enviarAoProcesso(
  dados: { nome: string; base64: string; tipoDocumentoId?: string },
  aoProgredir: (feito: number, total: number) => void,
): Promise<{ id: string }> {
  const idProcedimento = new URLSearchParams(window.location.search).get("id_procedimento");
  if (!idProcedimento) throw new ErroSei("SEI_SEM_PROCESSO");

  const bytes = deBase64(dados.base64);
  // `bytes.buffer` é tipado como ArrayBufferLike, que admite SharedArrayBuffer;
  // o Blob só aceita ArrayBuffer. O recorte deixa o tipo exato sem copiar.
  const arquivo = new File(
    [bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer],
    nomeParaUpload(dados.nome),
    { type: "application/pdf" },
  );

  const resultado = await enviarDocumentoExterno(
    { idProcedimento, nome: dados.nome, arquivo, tipoDocumentoId: dados.tipoDocumentoId },
    {
      buscar: (url, init) => fetch(url, init),
      postarArquivo,
      lerTexto,
      htmlDaArvore: () => lerHtmlDaArvore(idProcedimento),
      formatarTamanho: (b) => window.infraFormatarTamanhoBytes?.(b) ?? String(b),
      codificadores: codificadoresDoSeiPro(),
      config: {
        getConfigValue: window.getConfigValue,
        checkConfigValue: window.checkConfigValue,
      },
    },
    aoProgredir,
  );

  // A árvore mudou: o cache seria devolvido sem o documento recém-incluído.
  cacheDocumentos = null;

  return resultado;
}

/**
 * As funções de codificação do SEI Pro, com equivalente próprio de reserva.
 *
 * A reserva não é zelo: este arquivo carrega no mundo da página junto com o
 * resto da extensão, mas a ordem não é garantida em toda versão do SEI, e um
 * `escapeComponent` ausente produziria a palavra "undefined" dentro do nome do
 * documento protocolado.
 */
function codificadoresDoSeiPro(): Codificadores {
  return {
    escapar: (s) => window.escapeComponent?.(s) ?? escape(s).replace(/\+/g, "%2B"),
    hexar: (s) => window.encodeURI_toHex?.(s) ?? escape(s).replace(/\+/g, "%2B"),
  };
}

/** POST multipart do arquivo, por XHR: `fetch` não informa progresso de envio. */
function postarArquivo(
  url: string,
  arquivo: File,
  aoProgredir: (feito: number, total: number) => void,
): Promise<string> {
  return new Promise((resolver, rejeitar) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.withCredentials = true;
    // O mesmo teto do upload da árvore. Documento digitalizado de centenas de
    // páginas, em rede de órgão, leva minutos.
    xhr.timeout = 900_000;
    xhr.upload.addEventListener("progress", (ev) => {
      if (ev.lengthComputable) aoProgredir(ev.loaded, ev.total);
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) resolver(xhr.responseText);
      else rejeitar(new ErroSei("SEI_ENVIO_RECUSADO", String(xhr.status)));
    });
    xhr.addEventListener("error", () => rejeitar(new ErroSei("SEI_INDISPONIVEL")));
    xhr.addEventListener("timeout", () => rejeitar(new ErroSei("SEI_TEMPO_ESGOTADO")));

    const dados = new FormData();
    dados.append("filArquivo", arquivo, arquivo.name);
    xhr.send(dados);
  });
}

// Sentinela, no padrão dos outros arquivos do projeto (`loadFavoritosPro`,
// `loadAtividadesPro`...): evita carregar duas vezes na mesma página.
window.loadFerramentasPdfPro = true;

// Apresentação inicial. Se o mundo isolado ainda não conectou, esta mensagem se
// perde sem prejuízo: ele pede a apresentação assim que abrir a porta.
enviarAoIsolado("ola", montarApresentacao());
