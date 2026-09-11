/**
 * Devolver o arquivo pronto ao processo, como documento externo.
 *
 * POR QUE NÃO REUSAR O `sendUploadArvore` DO SEI PRO. Ele existe e funciona,
 * mas é o motor do Dropzone da árvore: relata erro escrevendo dentro de
 * `.dz-error-message`, depende de elementos `.dz-preview` que só existem
 * naquela tela, alcança `parent.parent` — e termina com
 * `window.location.reload()`. Esse reload sozinho já o desqualifica aqui: ele
 * recarregaria a aba do SEI, matando junto a ponte que está conversando com a
 * página. O usuário veria o envio "sumir" no meio.
 *
 * O QUE É REUSADO: as três funções de codificação (`encodeUrlUploadArvore`,
 * `escapeComponent`, `encodeURI_toHex`). É nelas que mora a parte sutil, porque
 * o SEI fala ISO-8859-1 e o formulário tem campos com regras próprias. Duplicar
 * essa lógica seria pedir para as duas cópias divergirem.
 *
 * O PROTOCOLO, em quatro passos:
 *
 *   1. Abrir a escolha de tipo (`documento_escolher_tipo`) e chegar à tela de
 *      documento externo. Até o SEI 4 há um link direto; no SEI 5 as âncoras
 *      vêm todas com `href="#"` e é preciso POSTar o formulário com
 *      `hdnIdSerie=-1`.
 *   2. Ler o formulário `frmDocumentoCadastro`: a URL de upload, os campos
 *      ocultos, e o usuário/unidade que o SEI usa para carimbar o anexo.
 *   3. POSTar o arquivo em multipart para a URL de upload. A resposta é uma
 *      linha separada por `#` que identifica o anexo no diretório temporário.
 *   4. POSTar o formulário com esse anexo em `hdnAnexos`. O SEI redireciona
 *      para a árvore, e é pela URL final que se sabe que deu certo.
 */

/** O que a tela de documento externo oferece. */
export interface FormularioExterno {
  /** Para onde o formulário é postado no passo 4. */
  acaoForm: string;
  /** Para onde o arquivo é postado no passo 3. */
  urlUpload: string;
  /** Campos do formulário, já lidos com os valores que o SEI trouxe. */
  campos: Record<string, string>;
  /** Como o SEI carimba o anexo. Sem isso, `hdnAnexos` fica inválido. */
  usuario: string;
  unidade: string;
  /** Extensões que esta instalação aceita. */
  extensoes: string[];
  /** Tipos de documento disponíveis (o `selSerie`). */
  series: { nome: string; valor: string }[];
}

/**
 * Lê a tela de documento externo.
 *
 * As três informações que NÃO estão no DOM saem do JavaScript embutido na
 * página, por varredura de linha -- é assim que o SEI as publica, e é o que o
 * upload da árvore já fazia:
 *
 *   - `objUpload = new infraUpload('divUpload','<URL>',...)` dá a URL de upload;
 *   - `arrExt[n] = "pdf"` lista as extensões aceitas;
 *   - `objTabelaAnexos.adicionar([...],'<usuario>','<unidade>')` dá o carimbo.
 */
export function lerFormularioExterno(html: string): FormularioExterno | null {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const form = doc.querySelector<HTMLFormElement>("#frmDocumentoCadastro");
  if (!form) return null;

  const acaoForm = form.getAttribute("action") ?? "";

  let urlUpload = "";
  const extensoes: string[] = [];
  let usuario = "";
  let unidade = "";

  for (const linha of html.split("\n")) {
    if (urlUpload === "" && linha.includes("objUpload = new infraUpload")) {
      urlUpload = linha.split("'")[3] ?? "";
    }
    if (linha.includes("arrExt")) {
      const ext = linha.split('"')[1];
      if (ext) extensoes.push(`.${ext}`);
    }
    if (linha.includes("objTabelaAnexos.adicionar(")) {
      // Usuário e unidade são os DOIS ÚLTIMOS elementos DE DENTRO do array --
      // não argumentos depois dele, como a leitura de fora sugere:
      //
      //   objTabelaAnexos.adicionar([arr['nome'],...,'FULANO' ,'COORD']);
      //
      // O casamento ancora no `'])` final justamente por isso, e tolera o
      // espaço antes da vírgula, que varia entre as versões.
      const achado = /'([^']*)'\s*,\s*'([^']*)'\s*\]\s*\)/.exec(linha);
      if (achado) {
        usuario = achado[1];
        unidade = achado[2];
      }
    }
  }

  if (!urlUpload) return null;

  // Os mesmos quatro grupos que o upload da árvore envia. O prefixo importa:
  // o SEI nomeia por convenção (hdn/txt/sel/rdo) e mandar campo fora dela faz
  // a tela voltar sem dizer o que recusou.
  const campos: Record<string, string> = {};
  for (const i of form.querySelectorAll<HTMLInputElement>('input[type="hidden"]')) {
    if (i.name && i.id?.includes("hdn")) campos[i.name] = i.value;
  }
  for (const i of form.querySelectorAll<HTMLInputElement>('input[type="text"]')) {
    if (i.id?.includes("txt")) campos[i.id] = i.value;
  }
  for (const s of form.querySelectorAll<HTMLSelectElement>("select")) {
    if (s.id?.includes("sel")) campos[s.id] = s.value;
  }
  for (const r of form.querySelectorAll<HTMLInputElement>('input[type="radio"]')) {
    // `checked` E `[checked]`: a propriedade so existe depois de o parser
    // refletir o atributo, e o que chega aqui e HTML recem-analisado. Ler os
    // dois faz o campo sobreviver ao parser, seja qual for.
    const marcado = r.checked || r.hasAttribute("checked");
    if (r.name?.includes("rdo") && marcado) campos[r.name] = r.value;
  }

  const series = [...form.querySelectorAll<HTMLOptionElement>("#selSerie option")]
    .filter((o) => (o.textContent ?? "").trim() !== "")
    .map((o) => ({ nome: (o.textContent ?? "").trim(), valor: o.value }));

  return { acaoForm, urlUpload, campos, usuario, unidade, extensoes, series };
}

/** Tira acento e pontuação que o endpoint de upload recusa no nome do arquivo. */
export function nomeParaUpload(nome: string): string {
  return semAcento(nome).replace(/[&/\\#+()$~%'":*?<>{}]/g, "_");
}

function semAcento(s: string): string {
  // Escape explicito: a faixa de combinantes escrita literalmente e invisivel
  // no editor e some numa normalizacao acidental do proprio arquivo.
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizar(s: string): string {
  return semAcento(s.trim().toLowerCase().replace(/[_:]/g, " "));
}

/**
 * Escolhe o tipo de documento.
 *
 * A ordem é a mesma do upload da árvore, e o motivo de existir é prático: o
 * usuário que nomeia o arquivo de "Oficio 32.pdf" espera que o documento entre
 * como Ofício, e não como Anexo.
 *
 *   1. O tipo pedido explicitamente, quando houver;
 *   2. o tipo cujo nome começa o nome do arquivo;
 *   3. o tipo configurado em `newdocname` no SEI Pro;
 *   4. "anexo";
 *   5. o primeiro da lista, para nunca devolver nada.
 */
export function escolherSerie(
  series: { nome: string; valor: string }[],
  nomeArquivo: string,
  preferidoId?: string,
  preferidoNome?: string,
): { nome: string; valor: string } | null {
  if (series.length === 0) return null;

  if (preferidoId) {
    const porId = series.find((s) => s.valor === preferidoId);
    if (porId) return porId;
  }

  const alvo = normalizar(nomeArquivo);
  const pelaNomenclatura = series.find((s) => {
    const n = normalizar(s.nome);
    return n.length > 0 && alvo.startsWith(n);
  });
  if (pelaNomenclatura) return pelaNomenclatura;

  if (preferidoNome) {
    const porNome = series.find((s) => normalizar(s.nome) === normalizar(preferidoNome));
    if (porNome) return porNome;
  }

  return (
    series.find((s) => normalizar(s.nome) === "anexo") ??
    series.find((s) => normalizar(s.nome).includes("anexo")) ??
    series[0]
  );
}

/**
 * Nome que vai para a árvore.
 *
 * O SEI corta em 50 caracteres. Cortar aqui, na fronteira de palavra, evita que
 * o documento entre com o nome partido no meio -- o que o usuário só descobre
 * depois de protocolado.
 */
export function montarNomeDoDocumento(nomeArquivo: string, nomeSerie: string): string {
  let nome = nomeArquivo.normalize("NFC");

  // "Anexo Relatorio.pdf" com a série "Anexo" vira "Relatorio": repetir o tipo
  // no nome produz "Anexo Anexo Relatorio" na árvore.
  //
  // A comparação ignora acento porque a ESCOLHA do tipo já ignora: um arquivo
  // chamado "Oficio 32.pdf" entra como Ofício, e comparar com acento aqui
  // deixaria o nome "Oficio 32" debaixo do tipo "Ofício" -- repetido, que é
  // justamente o que este trecho existe para evitar.
  const prefixo = acharPrefixoDoTipo(nome, nomeSerie);
  if (prefixo > 0) nome = nome.slice(prefixo).trim();

  const ponto = nome.lastIndexOf(".");
  if (ponto > 0) nome = nome.substring(0, ponto);

  if (nome.length > 50) nome = nome.replace(/^(.{50}[^\s]*).*/, "$1");
  if (nome.length > 50) nome = nome.substring(0, 49);

  return nome.trim();
}

/**
 * Quantos caracteres do início de `nome` correspondem ao tipo, sem acento.
 *
 * Procura por comprimento em vez de casar regex porque tirar o acento pode
 * mudar o tamanho da string, e aí o corte pela posição erraria. Devolve 0
 * quando o nome não começa pelo tipo -- inclusive quando só o PARECE, como
 * "Anexos diversos" diante do tipo "Anexo": a fronteira de palavra é exigida.
 */
function acharPrefixoDoTipo(nome: string, nomeSerie: string): number {
  const alvo = normalizar(nomeSerie);
  if (alvo.length === 0) return 0;
  const limite = Math.min(nome.length, nomeSerie.length + 8);
  for (let i = 1; i <= limite; i += 1) {
    if (normalizar(nome.slice(0, i)) !== alvo) continue;
    // Fronteira de palavra: o que vem depois tem de ser separador ou nada.
    const seguinte = nome.charAt(i);
    if (seguinte === "" || /[\s._-]/.test(seguinte)) return i;
  }
  return 0;
}

/** Data de hoje no formato que o SEI espera. */
export function dataDeHoje(quando = new Date()): string {
  const dd = String(quando.getDate()).padStart(2, "0");
  const mm = String(quando.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${quando.getFullYear()}`;
}

/** As funções de codificação do SEI Pro, com equivalente próprio para teste. */
export interface Codificadores {
  /** `escape()`, com `+` protegido. */
  escapar: (s: string) => string;
  /** Acento vira `%XX` do byte ISO-8859-1; espaço vira `+`. */
  hexar: (s: string) => string;
}

/**
 * Monta o corpo do POST final.
 *
 * NÃO é `URLSearchParams`: ele codifica em UTF-8, e o SEI lê o corpo como
 * ISO-8859-1. Um "Ofício" postado em UTF-8 entra no processo como "OfÃ­cio" --
 * e fica assim, no nome do documento, para sempre.
 *
 * `hdnAnexos` vai cru porque já foi codificado no formato próprio do SEI, e
 * `txtNumero` vai pelo caminho hexadecimal porque é o campo que carrega o nome
 * escrito pelo usuário.
 */
export function montarCorpoDoPost(
  campos: Record<string, string>,
  cod: Codificadores,
): string {
  const partes: string[] = [];
  for (const [chave, valor] of Object.entries(campos)) {
    const bruto = valor ?? "";
    let codificado: string;
    if (chave === "hdnAnexos") codificado = bruto;
    else if (chave === "txtNumero") codificado = cod.hexar(bruto.normalize("NFC"));
    else codificado = cod.escapar(bruto);
    partes.push(`${chave}=${codificado}`);
  }
  return partes.join("&");
}

/**
 * Monta o `hdnAnexos` a partir da resposta do upload.
 *
 * A resposta do SEI vem separada por `#`, e as posições NÃO são óbvias: o
 * tamanho está em [3] e a data em [4], invertidos em relação à ordem que entra
 * no `hdnAnexos`. O separador do campo é `±` (U+00B1), e as trocas de
 * `%C2`/`%2B` depois de codificar são o que faz o SEI aceitar: ele espera o
 * byte ISO-8859-1 do `±`, não os dois bytes do UTF-8.
 */
export function montarHdnAnexos(
  resposta: string[],
  usuario: string,
  unidade: string,
  formatarTamanho: (bytes: number) => string,
): string {
  const [id, nome, , tamanho, dthora] = resposta;
  const mais = "±";
  let hdn = [
    id,
    nome,
    dthora,
    tamanho,
    formatarTamanho(parseInt(tamanho, 10)),
    usuario,
    unidade,
  ].join(mais);
  hdn = hdn.replace(/ /g, "+");
  hdn = encodeURIComponent(hdn);
  hdn = hdn.replace(/%C2/g, "").replace(/%2B/g, "+");
  return hdn;
}

/** O envio deu certo? O SEI diz isso pela URL para onde redirecionou. */
export function envioConcluido(urlFinal: string): boolean {
  return urlFinal.includes("acao=arvore_visualizar&acao_origem=documento_receber");
}

/** Id do documento recém-criado, lido da URL final. */
export function idDoDocumento(urlFinal: string): string | null {
  const achado = /[?&]id_documento=(\d+)/.exec(urlFinal);
  return achado ? achado[1] : null;
}

/* ------------------------------------------------------------------ *
 * A orquestração dos quatro passos
 * ------------------------------------------------------------------ */

/** Erro com código que a página sabe traduzir em mensagem. */
export class ErroEnvio extends Error {
  constructor(
    readonly codigo:
      | "SEI_SEM_PROCESSO"
      | "SEI_SEM_PERMISSAO"
      | "SEI_SESSAO_EXPIRADA"
      | "SEI_ENVIO_RECUSADO",
    readonly detalhe?: string,
  ) {
    super(detalhe ? `${codigo}: ${detalhe}` : codigo);
    this.name = "ErroEnvio";
  }
}

/**
 * Tudo que o envio precisa do mundo de fora.
 *
 * Injetado, e não importado, por um motivo prático: com isto a sequência dos
 * quatro passos pode ser exercitada inteira sem SEI nenhum -- e é na SEQUÊNCIA
 * que mora o defeito que nenhum teste de unidade pega. Esquecer de limpar o
 * cache da árvore, mandar o cabeçalho errado, ou tomar a tela de login por
 * sucesso são erros que só aparecem com os quatro passos encadeados.
 */
export interface AmbienteDeEnvio {
  buscar: (url: string, init?: RequestInit) => Promise<Response>;
  /** POST multipart do arquivo. Devolve a linha de resposta do SEI. */
  postarArquivo: (
    url: string,
    arquivo: File,
    aoProgredir: (feito: number, total: number) => void,
  ) => Promise<string>;
  /** Lê o corpo com o charset do SEI (ISO-8859-1). */
  lerTexto: (r: Response) => Promise<string>;
  /**
   * HTML da árvore do processo, de onde sai o link ASSINADO de incluir
   * documento. Ver `acharLinkDeIncluirDocumento`.
   */
  htmlDaArvore: () => Promise<string>;
  formatarTamanho: (bytes: number) => string;
  codificadores: Codificadores;
  /** Configuração do SEI Pro, quando disponível. */
  config?: {
    getConfigValue?: (chave: string) => unknown;
    checkConfigValue?: (chave: string) => boolean;
  };
}

export interface PedidoDeEnvio {
  idProcedimento: string;
  nome: string;
  arquivo: File;
  tipoDocumentoId?: string;
}

/** Executa os quatro passos e devolve o id do documento criado. */
export async function enviarDocumentoExterno(
  pedido: PedidoDeEnvio,
  amb: AmbienteDeEnvio,
  aoProgredir: (feito: number, total: number) => void = () => {},
): Promise<{ id: string }> {
  if (!pedido.idProcedimento) throw new ErroEnvio("SEI_SEM_PROCESSO");

  const html = await abrirTelaDeDocumentoExterno(amb);
  const form = lerFormularioExterno(html);
  if (!form) {
    // Sem o formulário não dá para distinguir falta de permissão de sessão
    // caída pela ausência sozinha -- mas a tela de login é reconhecível.
    if (/frmLogin|sei_login/i.test(html)) throw new ErroEnvio("SEI_SESSAO_EXPIRADA");
    throw new ErroEnvio("SEI_SEM_PERMISSAO", "formulário de documento externo");
  }

  const serie = escolherSerie(
    form.series,
    pedido.nome,
    pedido.tipoDocumentoId,
    comoTexto(amb.config?.getConfigValue?.("newdocname")),
  );
  if (!serie) throw new ErroEnvio("SEI_SEM_PERMISSAO", "nenhum tipo de documento disponível");

  const resposta = (await amb.postarArquivo(form.urlUpload, pedido.arquivo, aoProgredir)).split("#");
  if (resposta.length < 5) {
    throw new ErroEnvio("SEI_ENVIO_RECUSADO", resposta[0]?.slice(0, 120));
  }

  const campos = { ...form.campos };
  preencherCampos(campos, amb.config, {
    serie,
    nomeDocumento: montarNomeDoDocumento(pedido.nome, serie.nome),
    hdnAnexos: montarHdnAnexos(resposta, form.usuario, form.unidade, amb.formatarTamanho),
  });

  const final = await amb.buscar(form.acaoForm, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=ISO-8859-1" },
    body: montarCorpoDoPost(campos, amb.codificadores),
  });

  if (!envioConcluido(final.url)) {
    // A sessão expirada devolve a TELA DE LOGIN com status 200, e o formulário
    // recusado devolve a própria tela de cadastro. Nos dois casos o SEI não
    // redireciona para a árvore; separar um do outro evita mandar o usuário
    // conferir a unidade quando o que houve foi a sessão cair.
    const corpo = await amb.lerTexto(final);
    if (/frmLogin|sei_login/i.test(corpo) && !corpo.includes("frmDocumentoCadastro")) {
      throw new ErroEnvio("SEI_SESSAO_EXPIRADA");
    }
    throw new ErroEnvio("SEI_ENVIO_RECUSADO", motivoDaRecusa(corpo));
  }

  return { id: idDoDocumento(final.url) ?? "" };
}

/**
 * Link ASSINADO de "Incluir Documento", tirado da barra de ações da árvore.
 *
 * ESTA FUNÇÃO EXISTE PARA IMPEDIR UM DEFEITO QUE DERRUBA A SESSÃO DO USUÁRIO.
 *
 * O SEI assina cada link de ação com um `infra_hash`, e recusa link de ação sem
 * assinatura. Só que ele não recusa devolvendo erro: em
 * `InfraSessao::validarLink` a saída é `$this->sair(...)` -- ou seja, ele
 * DESLOGA quem pediu. Montar `controlador.php?acao=documento_escolher_tipo&...`
 * à mão, que é o que parece natural, tira o usuário do SEI no meio do trabalho,
 * e a mensagem que sobra ("Link sem assinatura") nada diz sobre a causa.
 *
 * A lista de exceções do SEI 5 tem exatamente três entradas, todas
 * `procedimento_trabalhar` (ver `SessaoSEI::tratarLinkSemAssinatura`). É por
 * isso que ler a árvore funciona e qualquer outra ação montada à mão não.
 *
 * A busca é pelo `acao=documento_escolher_tipo` no href, e não pelo título do
 * ícone: o rótulo muda entre versões e traduções, a ação não. A ausência do
 * link é informação de verdade -- significa que este usuário não pode incluir
 * documento neste processo.
 */
export function acharLinkDeIncluirDocumento(htmlArvore: string): string | null {
  const achado =
    /href="([^"]*acao=documento_escolher_tipo[^"]*)"/i.exec(htmlArvore) ??
    /href=\\?'([^']*acao=documento_escolher_tipo[^']*)\\?'/i.exec(htmlArvore);
  return achado ? semEntidades(achado[1]) : null;
}

/**
 * Chega à tela de documento externo a partir da escolha de tipo.
 *
 * Dois caminhos, e o segundo é do SEI 5: lá TODAS as âncoras vêm com
 * `href="#"` e a escolha virou um POST. A presença da opção de valor `-1` é o
 * que diz se o usuário tem a permissão `documento_receber`; sem ela o POST
 * volta a própria tela de escolha e o envio travaria sem dizer por quê.
 */
async function abrirTelaDeDocumentoExterno(amb: AmbienteDeEnvio): Promise<string> {
  const arvore = await amb.htmlDaArvore();
  const entrada = acharLinkDeIncluirDocumento(arvore);
  if (!entrada) {
    if (/frmLogin|sei_login/i.test(arvore)) throw new ErroEnvio("SEI_SESSAO_EXPIRADA");
    throw new ErroEnvio("SEI_SEM_PERMISSAO", "botão Incluir Documento ausente na árvore");
  }

  const escolha = await amb.buscar(entrada, { credentials: "same-origin" });
  if (!escolha.ok) throw new ErroEnvio("SEI_SEM_PERMISSAO", String(escolha.status));

  const html = await amb.lerTexto(escolha);
  const doc = new DOMParser().parseFromString(html, "text/html");
  const tabela = doc.querySelector("#tblSeries");

  const direto = tabela?.querySelector<HTMLAnchorElement>(
    'a[href*="acao=documento_receber"]',
  );
  if (direto) {
    return amb.lerTexto(
      await amb.buscar(semEntidades(direto.getAttribute("href") ?? ""), {
        credentials: "same-origin",
      }),
    );
  }

  const temExterno = Boolean(tabela?.querySelector('input[value="-1"]'));
  const formEscolha = doc.querySelector<HTMLFormElement>("#frmDocumentoEscolherTipo");
  if (!temExterno || !formEscolha) {
    if (/frmLogin|sei_login/i.test(html)) throw new ErroEnvio("SEI_SESSAO_EXPIRADA");
    throw new ErroEnvio("SEI_SEM_PERMISSAO", "opção Externo ausente");
  }

  const corpo = new URLSearchParams();
  for (const i of formEscolha.querySelectorAll<HTMLInputElement>('input[type="hidden"]')) {
    if (i.name && i.id?.includes("hdn")) corpo.set(i.name, i.value);
  }
  corpo.set("hdnIdSerie", "-1");

  return amb.lerTexto(
    await amb.buscar(semEntidades(formEscolha.getAttribute("action") ?? ""), {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: corpo.toString(),
    }),
  );
}

/**
 * Completa o formulário com o que o SEI exige e o SEI Pro configura.
 *
 * As escolhas seguem, campo a campo, as do upload da árvore: quem já usa a
 * extensão espera que devolver um arquivo pelas Ferramentas de PDF produza o
 * mesmo documento que arrastá-lo para a árvore produziria.
 */
function preencherCampos(
  campos: Record<string, string>,
  config: AmbienteDeEnvio["config"],
  dados: { serie: { nome: string; valor: string }; nomeDocumento: string; hdnAnexos: string },
): void {
  const formato = comoTexto(config?.getConfigValue?.("newdocformat"));
  const digitalizado = Boolean(config?.checkConfigValue?.("newdocformat") && formato.includes("digitalizado"));

  const sigiloBruto = comoTexto(config?.getConfigValue?.("newdocsigilo"));
  const sigilo = sigiloBruto.includes("|") ? sigiloBruto.split("|") : null;

  campos.selSerie = dados.serie.valor;
  campos.hdnIdSerie = dados.serie.valor;

  // O nível de acesso vem do formulário quando o SEI já o trouxe marcado;
  // senão, do que o usuário configurou; senão, público.
  campos.rdoNivelAcesso =
    campos.rdoNivelAcesso || (config?.checkConfigValue?.("newdocnivel") ? "0" : sigilo?.[1] ?? "0");
  campos.hdnStaNivelAcessoLocal = campos.rdoNivelAcesso;

  campos.rdoFormato = digitalizado ? "D" : "N";
  campos.hdnFlagDocumentoCadastro = "2";

  campos.hdnIdHipoteseLegal = sigilo ? sigilo[0] : campos.selHipoteseLegal ?? "";
  campos.selHipoteseLegal = campos.hdnIdHipoteseLegal;

  campos.selTipoConferencia = digitalizado && formato.includes("_") ? formato.split("_")[1] : "";
  campos.hdnIdTipoConferencia = campos.selTipoConferencia;

  campos.txaObservacoes = "";
  campos.txtDataElaboracao = dataDeHoje();
  campos.txtNumero = dados.nomeDocumento;
  campos.hdnAnexos = dados.hdnAnexos;
}

/** Mensagem de recusa do SEI, quando ele diz qual foi. */
function motivoDaRecusa(html: string): string | undefined {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const aviso = doc.querySelector("#divInfraAreaTela .infraMsg, .infraExcecao, #divInfraExcecao");
  const t = aviso?.textContent?.trim().replace(/\s+/g, " ");
  return t ? t.slice(0, 200) : undefined;
}

function comoTexto(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/** Desfaz o escape de entidade que vem no HTML. */
function semEntidades(url: string): string {
  return url.replace(/&amp;/g, "&");
}
