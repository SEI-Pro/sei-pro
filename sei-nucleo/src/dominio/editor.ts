/**
 * Conteúdo de documento interno: ler e gravar as seções pelo editor do SEI,
 * sem abrir janela.
 *
 * Dois editores, dois protocolos (fontes do SEI 5, `sei/web/editor/`):
 *
 * - CKEditor 4 (SEI 3/4 e SEI 5 configurado para CK4): `editor_montar` traz
 *   `#frmEditor` com uma `<textarea name="txaEditor_N">` por seção e um
 *   `CKEDITOR.replace('txaEditor_N', {title, readOnly, ...})` para cada uma.
 *   Gravar = submit do formulário (ISO-8859-1) para
 *   `editor_processar.php?acao=editor_salvar`, que responde `OK <versão>`.
 * - CKEditor 5 (SEI 5): `window.INFRA_EDITOR_CONFIG` com `initialData`
 *   (conteúdo por seção), `rootsAttributes` ({somenteLeitura, principal,
 *   label}) e `sei.urlSalvar`. Gravar = POST JSON
 *   `{siglaUnidade, versao, ignorarNovaVersao, secoesConteudo:[{nome, html}]}`
 *   para `controlador_rest.php?acao_rest=editor_salvar_conteudo`.
 *
 * ABRIR O EDITOR DE DOCUMENTO ASSINADO CANCELA A ASSINATURA. Por isso toda
 * função aqui recusa documento assinado: cancelar é uma operação à parte,
 * irreversível, que o usuário precisa aprovar explicitamente.
 *
 * Substitui no legado: `docsLote_editDocContent`, `docsLote_saveDoc`,
 * `docsLote_getEditorCK5Config`, `docsLote_extrairJsonBalanceado` e o fluxo de
 * `setDocAutomatico` (que abria o editor numa janela e simulava o Salvar).
 */

import { localizarDocumento, type DocumentoLocalizado } from "./documento";
import type { OpcoesEscrita, ResultadoEscrita } from "./escrita";
import { Formulario } from "../formulario/formulario";
import { linkDaAcao } from "../links/links";
import { analisarHtml, decodificarEntidades } from "../sessao/dom";
import { paraLatin1Seguro } from "../sessao/codificacao";
import { ErroSei } from "../sessao/erros";
import type { Pagina } from "../sessao/http";
import type { Sei } from "../sei";

/**
 * Um estilo de parágrafo que o editor oferece NESTA seção, NESTE órgão.
 *
 * O conjunto é configurável por órgão e por seção do modelo: lista fixa acerta
 * no órgão de quem a escreveu e erra em silêncio nos outros — o SEI ignora a
 * classe que não existe, e o documento sai sem formatação nenhuma.
 */
export interface EstiloEditor {
  /** Como o SEI o chama na barra de estilos. */
  nome: string;
  /** Classe CSS a usar no `<p class="...">`. */
  classe: string;
}

export interface SecaoEditor {
  /** `txaEditor_N`. */
  nome: string;
  titulo: string;
  somenteLeitura: boolean;
  principal: boolean;
  html: string;
  /** Estilos permitidos nesta seção. Vazio quando o órgão não configurou nenhum. */
  estilos: EstiloEditor[];
  /** Estilo que o SEI aplica sozinho a um parágrafo novo, quando há um. */
  estiloPadrao?: string;
}

export interface EditorDocumento {
  tipo: "ck4" | "ck5";
  secoes: SecaoEditor[];
  pagina: Pagina;
  ck5?: { urlSalvar: string; versao: unknown; siglaUnidade: string };
}

/** Recorta o objeto JSON que começa em `inicio` (respeitando strings). */
export function objetoJson(texto: string, inicio: number): string | null {
  let prof = 0;
  let emString = false;
  let escape = false;
  for (let i = inicio; i < texto.length; i += 1) {
    const c = texto[i];
    if (emString) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === '"') emString = false;
      continue;
    }
    if (c === '"') emString = true;
    else if (c === "{") prof += 1;
    else if (c === "}" && --prof === 0) return texto.slice(inicio, i + 1);
  }
  return null;
}

interface ConfigCk5 {
  initialData?: Record<string, string>;
  rootsAttributes?: Record<string, { somenteLeitura?: boolean; principal?: boolean; label?: string }>;
  sei?: { urlSalvar?: string; versao?: unknown; siglaUnidade?: string };
  /**
   * `setConfiguracao('estilo.itens', ...)` do SEI vira objeto ANINHADO (chave
   * pontuada, ver `InfraEditorCK5.php`), então a lista chega aqui.
   */
  estilo?: {
    itens?: Array<{ nome?: string; classeCss?: string; permitidoEm?: string[] }>;
    estiloPadrao?: Record<string, string>;
  };
}

/**
 * Classes válidas de uma seção do CK4.
 *
 * O `EditorCk4RN.php` escreve, em cada `CKEDITOR.replace`,
 * `stylesheetParser_validSelectors: /^(p)\.(A|B|C)$/i` com as classes daquela
 * seção. É a única lista que o editor daquele órgão de fato aceita.
 */
function estilosCk4(cfg: string): EstiloEditor[] {
  const m = /stylesheetParser_validSelectors"?\s*:\s*\/\^\(p\)\\\.\(([^)]*)\)\$\/i/.exec(cfg);
  if (!m) return [];
  return m[1]
    .split("|")
    .map((c) => c.trim())
    .filter(Boolean)
    .map((classe) => ({ nome: classe, classe }));
}

/** Analisa a página `editor_montar` (CK4 ou CK5). Não faz requisição. */
export function lerEditor(pagina: Pagina): EditorDocumento {
  const html = pagina.html;
  const i = html.indexOf("INFRA_EDITOR_CONFIG");
  if (i >= 0) {
    const json = objetoJson(html, html.indexOf("{", i));
    const cfg = json ? (JSON.parse(json) as ConfigCk5) : null;
    if (!cfg?.initialData || !cfg.sei?.urlSalvar) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "Configura\u00E7\u00E3o do editor CK5 n\u00E3o reconhecida.");
    const attrs = cfg.rootsAttributes ?? {};
    const itens = cfg.estilo?.itens ?? [];
    const padrao = cfg.estilo?.estiloPadrao ?? {};
    return {
      tipo: "ck5",
      pagina,
      ck5: { urlSalvar: cfg.sei.urlSalvar, versao: cfg.sei.versao, siglaUnidade: cfg.sei.siglaUnidade ?? "" },
      secoes: Object.entries(cfg.initialData).map(([nome, conteudo]) => ({
        nome,
        titulo: attrs[nome]?.label ?? nome,
        somenteLeitura: Boolean(attrs[nome]?.somenteLeitura),
        principal: Boolean(attrs[nome]?.principal),
        html: conteudo,
        // Sem `permitidoEm` o estilo vale em qualquer seção (ver EditorCk5RN).
        estilos: itens
          .filter((i) => (i.classeCss ?? i.nome) && (!i.permitidoEm?.length || i.permitidoEm.includes(nome)))
          .map((i) => ({ nome: i.nome ?? i.classeCss ?? "", classe: i.classeCss ?? i.nome ?? "" })),
        ...(padrao[nome] ? { estiloPadrao: padrao[nome] } : {}),
      })),
    };
  }
  const areas = [...pagina.doc.querySelectorAll("textarea[name^='txaEditor_']")];
  if (!areas.length) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "A tela do editor n\u00E3o tem as se\u00E7\u00F5es esperadas.");
  const secoes = areas.map((t) => {
    const nome = t.getAttribute("name") ?? "";
    const ini = html.indexOf(`CKEDITOR.replace('${nome}'`);
    const fim = ini >= 0 ? html.indexOf("CKEDITOR.replace(", ini + 20) : -1;
    const cfg = ini >= 0 ? html.slice(ini, fim > 0 ? fim : ini + 6000) : "";
    return {
      nome,
      titulo: decodificarEntidades(/title:"([^"]*)"/.exec(cfg)?.[1] ?? nome),
      somenteLeitura: /"readOnly":true/.test(cfg),
      principal: false,
      html: t.textContent ?? "",
      estilos: estilosCk4(cfg),
    };
  });
  // CK4 não marca a seção principal: é o corpo ("Corpo do Texto"), senão a última editável.
  const editaveis = secoes.filter((s) => !s.somenteLeitura);
  const corpo = editaveis.find((s) => /corpo|texto do documento|conte\u00FAdo/i.test(s.titulo)) ?? editaveis[editaveis.length - 1];
  if (corpo) corpo.principal = true;
  return { tipo: "ck4", pagina, secoes };
}

/** Abre o editor de um documento interno NÃO assinado. */
export async function abrirEditor(sei: Sei, d: DocumentoLocalizado, sinal?: AbortSignal): Promise<EditorDocumento> {
  const doc = d.documento;
  if (doc.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Documento sigiloso: o agente n\u00E3o atua nele.");
  if (doc.externo) throw new ErroSei("ARGUMENTO_INVALIDO", `O documento ${doc.numero} \u00E9 externo (arquivo): n\u00E3o tem conte\u00FAdo edit\u00E1vel.`);
  if (doc.assinado) {
    throw new ErroSei(
      "SEI_ACAO_INDISPONIVEL",
      `O documento ${doc.numero} est\u00E1 assinado. Editar cancelaria a assinatura; cancele a assinatura antes, explicitamente.`,
    );
  }
  // O link do editor não está na barra da árvore (lá é `editarConteudo()`): vem da tela do documento.
  let link = linkDaAcao(doc.acoes, "editor_montar");
  if (!link) link = linkDaAcao((await sei.http.obter(doc.link, { sinal })).html, "editor_montar");
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `Voc\u00EA n\u00E3o pode editar o documento ${doc.numero} (outra unidade ou processo fechado).`);
  return lerEditor(await sei.http.obter(link, { sinal }));
}

/**
 * Corpo JSON da gravação no CK5 (`editor_salvar_conteudo`).
 *
 * O JSON vai em UTF-8, mas o SEI grava em ISO-8859-1: o que passa de U+00FF
 * (travessão, aspas curvas, euro) chegava ao documento como "?" (provado no
 * SEI 5.0.4 do MJ). Como no CK4 (`modos: "html"`), cada seção passa antes por
 * `paraLatin1Seguro(…, "html")`, que troca esses caracteres por referência
 * numérica (`&#8212;`) e não mexe no que já é Latin-1.
 */
export function corpoSalvarCk5(ed: EditorDocumento, novas: Record<string, string>, siglaUnidade: string, documentoNovo = false): string {
  const versao = ed.ck5!.versao;
  const semVersao = documentoNovo && (versao === null || versao === undefined || versao === "");
  return JSON.stringify({
    siglaUnidade,
    versao: semVersao ? null : versao,
    ignorarNovaVersao: semVersao ? "S" : "N",
    secoesConteudo: ed.secoes.map((s) => ({ nome: s.nome, html: paraLatin1Seguro(novas[s.nome] ?? s.html, "html") })),
  });
}

async function salvar(sei: Sei, ed: EditorDocumento, novas: Record<string, string>, sinal?: AbortSignal, documentoNovo = false): Promise<void> {
  if (ed.tipo === "ck5") {
    const url = sei.http.absoluta(ed.ck5!.urlSalvar);
    // Documento que acabou de ser criado por quem grava, sem versão na configuração: o SEI compararia null e
    // recusaria sempre ("Existe uma nova versão"); como o legado do Documentos em Lote, vai "S" com versão null.
    const corpo = corpoSalvarCk5(ed, novas, ed.ck5!.siglaUnidade || sei.contexto().unidade.sigla, documentoNovo);
    const r = await fetch(url, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: corpo, signal: sinal });
    const texto = await r.text();
    if (!r.ok || !/"versao"/.test(texto)) throw new ErroSei("SEI_VALIDACAO", `O SEI recusou o conte\u00FAdo: ${texto.slice(0, 300)}`);
    return;
  }
  const form = Formulario.de(ed.pagina, "#frmEditor", sei.http);
  form.definir(novas);
  const modos = Object.fromEntries(ed.secoes.map((s) => [s.nome, "html" as const]));
  const resp = await form.enviar({ sinal, modos, aceitarValidacao: true });
  const texto = (resp.doc.body?.textContent ?? resp.html).trim();
  if (!texto.startsWith("OK")) throw new ErroSei("SEI_VALIDACAO", `O SEI recusou o conte\u00FAdo: ${texto.slice(0, 300)}`);
}

/** Texto visível de um trecho HTML (para prévias). */
/**
 * Estilos que escondem o texto da tela sem tirá-lo do documento.
 *
 * É por aqui que entra a instrução dirigida a IA: um parágrafo em fonte
 * branca de 1px no cabeçalho da peça não aparece para quem lê, mas aparece
 * para quem extrai o texto — foi o caso que o STF julgou em outubro de 2026.
 */
/*
 * As regras leem o `style` DECLARAÇÃO POR DECLARAÇÃO, com o nome exato da
 * propriedade. Procurar "color:#fff" no atributo inteiro casava
 * `background-color:#ffffff` (fundo branco, o normal de texto colado da web)
 * e "width:0" casava `-webkit-text-stroke-width:0px` — documentos comuns
 * apareciam com "texto escondido" em cada célula (relato da 2.9).
 */
type Declaracoes = Map<string, string>;

function declaracoes(style: string): Declaracoes {
  const m: Declaracoes = new Map();
  for (const d of style.split(";")) {
    const i = d.indexOf(":");
    if (i < 0) continue;
    m.set(d.slice(0, i).trim().toLowerCase(), d.slice(i + 1).replace(/!\s*important/i, "").trim().toLowerCase());
  }
  return m;
}

/** Medida CSS simples (`0`, `1px`, `-9999px`, `0.8em`); `null` para o resto. */
function medida(v: string | undefined): { n: number; unidade: string } | null {
  const m = v ? /^(-?\d*\.?\d+)\s*([a-z%]*)$/.exec(v) : null;
  return m ? { n: Number(m[1]), unidade: m[2] } : null;
}

const BRANCO = /^(?:#f{3}|#f{6}|white|rgba?\(\s*255\s*,\s*255\s*,\s*255\s*(?:,[^)]*)?\))$/;
const SEM_FUNDO = /^(?:transparent|none|initial|inherit|unset|revert)$/;

/**
 * Algum fundo de cor (não branco) atrás do elemento? Letra branca sobre
 * cabeçalho azul de tabela é legível, e não é esconderijo.
 */
function temFundoDeCor(el: Element): boolean {
  for (let e: Element | null = el; e && e.tagName !== "BODY"; e = e.parentElement) {
    const d = declaracoes(e.getAttribute("style") ?? "");
    const fundo = (d.get("background-color") ?? d.get("background") ?? e.getAttribute("bgcolor") ?? "").toLowerCase().trim();
    if (!fundo || SEM_FUNDO.test(fundo)) continue;
    return !BRANCO.test(fundo.split(/\s+(?![^(]*\))/)[0]);
  }
  return false;
}

const ESCONDIDOS: Array<{ motivo: string; esconde: (d: Declaracoes, el: Element) => boolean }> = [
  { motivo: "display:none (não é exibido)", esconde: (d) => d.get("display") === "none" },
  { motivo: "visibility:hidden (invisível)", esconde: (d) => d.get("visibility") === "hidden" },
  { motivo: "fonte de tamanho zero", esconde: (d) => medida(d.get("font-size"))?.n === 0 },
  {
    motivo: "fonte minúscula, ilegível na tela",
    esconde: (d) => {
      const f = medida(d.get("font-size"));
      return !!f && (f.unidade === "px" || f.unidade === "pt") && f.n < 3;
    },
  },
  { motivo: "opacity:0 (transparente)", esconde: (d) => (medida(d.get("opacity"))?.n ?? 1) <= 0.05 },
  { motivo: "letra branca sobre fundo branco", esconde: (d, el) => BRANCO.test(d.get("color") ?? "") && !temFundoDeCor(el) },
  {
    motivo: "posicionado fora da tela",
    esconde: (d) => ["text-indent", "left", "top", "margin-left", "margin-top"].some((p) => (medida(d.get(p))?.n ?? 0) <= -100),
  },
  {
    // Caixa de tamanho zero só esconde quando corta o que transborda.
    motivo: "caixa de tamanho zero",
    esconde: (d) =>
      ["height", "width", "max-height", "max-width"].some((p) => medida(d.get(p))?.n === 0) &&
      ["overflow", "overflow-x", "overflow-y"].some((p) => /^(?:hidden|clip)$/.test(d.get(p) ?? "")),
  },
];

export interface TextoComOcultos {
  texto: string;
  /** Trechos que existiam no documento mas não apareciam na tela. */
  ocultos: Array<{ texto: string; motivo: string }>;
  /** Com `marcarImagens`: quantas imagens do próprio documento ganharam marca. */
  imagens?: number;
}

/**
 * O mesmo texto de `textoDoHtml`, dizendo o que estava escondido da tela.
 *
 * O trecho oculto CONTINUA no texto: documento é prova, e quem analisa pode
 * precisar citá-lo. O que muda é que ele deixa de passar despercebido — quem
 * chama recebe a lista e decide o que fazer (no Agente de IA, vira marca no
 * conteúdo e linha no relatório de integridade).
 */
export function textoDoHtmlComOcultos(html: string, o: { marcarImagens?: boolean } = {}): TextoComOcultos {
  const doc = analisarHtml(`<!doctype html><html><head></head><body>${html}</body></html>`);
  const ocultos: Array<{ texto: string; motivo: string }> = [];
  for (const el of doc.querySelectorAll("[style], [hidden]")) {
    const texto = (el.textContent ?? "").trim();
    if (!texto) continue;
    const d = declaracoes(el.getAttribute("style") ?? "");
    const achado = ESCONDIDOS.find((x) => x.esconde(d, el));
    const motivo = achado?.motivo ?? (el.hasAttribute("hidden") ? "atributo hidden" : "");
    if (!motivo) continue;
    // Elemento dentro de outro já apontado não vira segunda ocorrência.
    if (ocultos.some((o) => o.texto.includes(texto))) continue;
    ocultos.push({ texto: texto.slice(0, 500), motivo });
  }
  if (!o.marcarImagens) return { texto: textoDoHtml(html), ocultos };
  const marcadas = { n: 0 };
  return { texto: textoDoHtml(html, marcadas), ocultos, imagens: marcadas.n };
}

/** O editor do SEI grava a imagem enviada dentro do HTML (`EditorRN::buscarImagemUpload`). */
const IMAGEM_EMBUTIDA = /^data:(image\/[\w.+-]+);base64,(.*)$/is;
/** Abaixo disto (nos dois lados declarados), é ícone ou marcador, não figura. */
const LADO_MINIMO_PX = 48;

function ladoDeclarado(img: Element, lado: "width" | "height"): number | null {
  const atributo = Number(img.getAttribute(lado));
  if (atributo > 0) return atributo;
  const estilo = new RegExp(`(?:^|;)\\s*${lado}\\s*:\\s*(\\d+(?:\\.\\d+)?)px`, "i").exec(img.getAttribute("style") ?? "");
  return estilo ? Number(estilo[1]) : null;
}

/**
 * Troca cada `<img>` por uma marca de texto. A numeração (`img-N`) conta TODAS
 * as imagens embutidas, inclusive as descartadas por pequenas: é a mesma conta
 * de `imagemDoHtml`, que o `ver_imagem` usa para buscar a figura.
 */
function marcarImagens(doc: Document, marcadas: { n: number }): void {
  let indice = 0;
  for (const img of [...doc.querySelectorAll("img")]) {
    const src = img.getAttribute("src") ?? "";
    let marca = "";
    if (IMAGEM_EMBUTIDA.test(src)) {
      indice += 1;
      const l = ladoDeclarado(img, "width");
      const a = ladoDeclarado(img, "height");
      if (!(l !== null && a !== null && l < LADO_MINIMO_PX && a < LADO_MINIMO_PX)) {
        marcadas.n += 1;
        marca = `[figura img-${indice}: imagem no corpo do documento${l && a ? `, ${Math.round(l)}\u00D7${Math.round(a)} px` : ""}; para ver: ver_imagem]`;
      }
    } else if (src.trim()) marca = "[imagem externa ao documento, n\u00E3o lida]";
    img.replaceWith(doc.createTextNode(marca ? `\n${marca}\n` : ""));
  }
}

/** A n-ésima imagem embutida do documento (a partir de 1), como `ver_imagem` a pede. */
export function imagemDoHtml(html: string, indice: number): { tipo: string; base64: string } | null {
  const doc = analisarHtml(`<!doctype html><html><head></head><body>${html}</body></html>`);
  const embutidas = [...doc.querySelectorAll("img")].map((i) => IMAGEM_EMBUTIDA.exec(i.getAttribute("src") ?? "")).filter((m): m is RegExpExecArray => Boolean(m));
  const m = embutidas[indice - 1];
  return m ? { tipo: m[1].toLowerCase(), base64: m[2].replace(/\s+/g, "") } : null;
}

export function textoDoHtml(html: string, imagens?: { n: number }): string {
  const doc = analisarHtml(`<!doctype html><html><head></head><body>${html}</body></html>`);
  if (imagens) marcarImagens(doc, imagens);
  for (const b of doc.querySelectorAll("p, br, li, tr, h1, h2, h3, h4, div")) b.append("\n");
  // Célula sem <p> dentro grudava na vizinha ("19.00028.500"), e o número fundido virava telefone.
  for (const c of doc.querySelectorAll("td, th")) c.append(" ");
  return (doc.body?.textContent ?? "").replace(/[ \t\u00A0]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
}

/**
 * O conteúdo diz alguma coisa?
 *
 * `<p>&nbsp;</p>`, `<p></p>`, `<br>` e espaço em branco APAGAM a seção: o SEI
 * aceita, responde 200 com versão nova e o documento fica só com cabeçalho e
 * signatário (medido no SEI 5.0.4 da ANTAQ). Imagem, tabela e traço valem como
 * conteúdo mesmo sem texto — um corpo pode ser só uma imagem.
 */
function temConteudo(html: string): boolean {
  return textoDoHtml(html).length > 0 || /<\s*(img|table|figure|hr)\b/i.test(html);
}

/** Texto comparável: é o que sobrevive à normalização do SEI (entidades, `\r\n`). */
const assinaturaDoTexto = (html: string) => textoDoHtml(html).replace(/\s+/g, " ").trim();

export interface EdicaoConteudo {
  /** HTML a gravar (parágrafos com as classes de estilo do SEI). */
  html: string;
  /** `substituir` a seção inteira (padrão) ou `acrescentar` ao fim dela. */
  modo?: "substituir" | "acrescentar";
  /** Título da seção; padrão = seção principal (corpo do texto). */
  secao?: string;
}

/** Escreve no corpo (ou numa seção) de um documento interno não assinado. */
export async function editarConteudo(sei: Sei, numero: string, e: EdicaoConteudo, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  const d = await localizarDocumento(sei, numero, { sinal: op.sinal });
  const ed = await abrirEditor(sei, d, op.sinal);
  const alvo = e.secao
    ? ed.secoes.find((s) => s.titulo.toLowerCase().includes(e.secao!.toLowerCase()))
    : ed.secoes.find((s) => s.principal);
  if (!alvo) throw new ErroSei("ARGUMENTO_INVALIDO", `Se\u00E7\u00E3o n\u00E3o encontrada. Se\u00E7\u00F5es: ${ed.secoes.map((s) => s.titulo).join(", ")}`);
  if (alvo.somenteLeitura) throw new ErroSei("ARGUMENTO_INVALIDO", `A se\u00E7\u00E3o "${alvo.titulo}" \u00E9 somente leitura.`);
  if (!temConteudo(e.html)) {
    throw new ErroSei(
      "ARGUMENTO_INVALIDO",
      `O conte\u00FAdo enviado est\u00E1 em branco: gravar isso APAGARIA a se\u00E7\u00E3o "${alvo.titulo}" do documento ${d.documento.numero}. Escreva o texto do documento (par\u00E1grafos HTML com as classes de estilo do SEI).`,
    );
  }
  const novo = e.modo === "acrescentar" ? `${alvo.html}\n${e.html}` : e.html;
  const resumir = (h: string) => textoDoHtml(h).slice(0, 400);
  const base: ResultadoEscrita = {
    alvo: d.documento.numero,
    mudancas: [{ campo: `Conte\u00FAdo (${alvo.titulo})`, antes: resumir(alvo.html), depois: resumir(novo) }],
    aplicado: false,
    resumo: `Vai ${e.modo === "acrescentar" ? "acrescentar texto ao" : "substituir o"} conte\u00FAdo do documento ${d.documento.numero}.`,
  };
  if (!op.aplicar) return base;
  await salvar(sei, ed, { [alvo.nome]: novo }, op.sinal);
  sei.invalidar(d.arvore.idProcedimento);
  await conferirGravacao(sei, ed, alvo, novo, d.documento.numero, op.sinal);
  return { ...base, aplicado: true, resumo: `Conte\u00FAdo do documento ${d.documento.numero} gravado.` };
}

/**
 * Relê a seção na fonte antes de dizer "gravado".
 *
 * O `salvar` só sabe que o SEI respondeu 200 com um `versao` — e ele responde
 * exatamente isso ao apagar uma seção. Custa uma requisição por escrita
 * aplicada, e é a diferença entre "gravado" ser verdade ou ser mentira: sem
 * isso, o agente anuncia sucesso sobre um documento que ficou vazio.
 */
async function conferirGravacao(
  sei: Sei,
  ed: EditorDocumento,
  alvo: SecaoEditor,
  novo: string,
  numero: string,
  sinal?: AbortSignal,
): Promise<void> {
  conferirSecao(lerEditor(await sei.http.obter(ed.pagina.url, { sinal })), alvo, novo, numero);
}

/** As duas provas de `conferirGravacao` sobre o editor já relido. */
function conferirSecao(depois: EditorDocumento, alvo: SecaoEditor, novo: string, numero: string): void {
  const gravada = depois.secoes.find((s) => s.nome === alvo.nome);
  if (!gravada || !temConteudo(gravada.html)) {
    throw new ErroSei(
      "SEI_VALIDACAO",
      `O SEI aceitou a grava\u00E7\u00E3o, mas a se\u00E7\u00E3o "${alvo.titulo}" do documento ${numero} ficou VAZIA. O conte\u00FAdo anterior foi perdido: reescreva o texto do documento.`,
    );
  }
  if (assinaturaDoTexto(gravada.html) === assinaturaDoTexto(alvo.html) && assinaturaDoTexto(novo) !== assinaturaDoTexto(alvo.html)) {
    throw new ErroSei(
      "SEI_VALIDACAO",
      `O SEI aceitou a grava\u00E7\u00E3o, mas a se\u00E7\u00E3o "${alvo.titulo}" do documento ${numero} continua como estava: o conte\u00FAdo enviado foi descartado.`,
    );
  }
}

/**
 * Reescreve várias seções numa gravação só, abrindo o editor uma vez.
 *
 * `trocar` recebe cada seção editável (as somente leitura nem são oferecidas)
 * e devolve o HTML novo, ou `null` para deixá-la como está. Seção que não muda
 * não entra na gravação; se nenhuma muda, nada é gravado. Uma gravação gera
 * UMA versão do documento (seção a seção com `editarConteudo` seriam várias,
 * e uma falha no meio deixaria o documento meio trocado). A seção é a do
 * editor (`nome`), não a busca por título do `editarConteudo`.
 *
 * Mesmas recusas e provas do `editarConteudo`: documento assinado, sigiloso ou
 * externo (`abrirEditor`), conteúdo em branco, e a releitura depois de gravar.
 */
export async function editarSecoes(
  sei: Sei,
  d: DocumentoLocalizado,
  trocar: (secao: SecaoEditor) => string | null,
  op: OpcoesEscrita,
  extra: {
    /**
     * O documento acabou de ser criado por quem grava (nenhuma outra edição
     * possível): no CK5 sem `versao` na configuração, grava com
     * `ignorarNovaVersao: "S"`. Só o Documentos em Lote usa.
     */
    documentoNovo?: boolean;
  } = {},
): Promise<ResultadoEscrita> {
  const ed = await abrirEditor(sei, d, op.sinal);
  const numero = d.documento.numero;
  const novas: Record<string, string> = {};
  const alvos: SecaoEditor[] = [];
  for (const s of ed.secoes) {
    if (s.somenteLeitura) continue;
    const novo = trocar(s);
    if (novo === null || novo === s.html) continue;
    if (!temConteudo(novo)) {
      throw new ErroSei(
        "ARGUMENTO_INVALIDO",
        `O conte\u00FAdo novo da se\u00E7\u00E3o "${s.titulo}" do documento ${numero} est\u00E1 em branco: gravar isso APAGARIA a se\u00E7\u00E3o.`,
      );
    }
    novas[s.nome] = novo;
    alvos.push(s);
  }
  const resumir = (h: string) => textoDoHtml(h).slice(0, 400);
  const base: ResultadoEscrita = {
    alvo: numero,
    mudancas: alvos.map((s) => ({ campo: `Conte\u00FAdo (${s.titulo})`, antes: resumir(s.html), depois: resumir(novas[s.nome] as string) })),
    aplicado: false,
    resumo: alvos.length ? `Vai regravar ${alvos.length} se\u00E7\u00E3o(\u00F5es) do documento ${numero}.` : `Nada a gravar no documento ${numero}.`,
  };
  if (!op.aplicar || !alvos.length) return base;
  await salvar(sei, ed, novas, op.sinal, extra.documentoNovo === true);
  sei.invalidar(d.arvore.idProcedimento);
  const depois = lerEditor(await sei.http.obter(ed.pagina.url, { sinal: op.sinal }));
  for (const s of alvos) conferirSecao(depois, s, novas[s.nome] as string, numero);
  return { ...base, aplicado: true, resumo: `Conte\u00FAdo do documento ${numero} gravado (${alvos.length} se\u00E7\u00E3o(\u00F5es)).` };
}
