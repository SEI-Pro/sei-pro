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
import { ErroSei } from "../sessao/erros";
import type { Pagina } from "../sessao/http";
import type { Sei } from "../sei";

export interface SecaoEditor {
  /** `txaEditor_N`. */
  nome: string;
  titulo: string;
  somenteLeitura: boolean;
  principal: boolean;
  html: string;
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

async function salvar(sei: Sei, ed: EditorDocumento, novas: Record<string, string>, sinal?: AbortSignal): Promise<void> {
  if (ed.tipo === "ck5") {
    const url = sei.http.absoluta(ed.ck5!.urlSalvar);
    const corpo = {
      siglaUnidade: ed.ck5!.siglaUnidade || sei.contexto().unidade.sigla,
      versao: ed.ck5!.versao,
      ignorarNovaVersao: "N",
      secoesConteudo: ed.secoes.map((s) => ({ nome: s.nome, html: novas[s.nome] ?? s.html })),
    };
    const r = await fetch(url, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo), signal: sinal });
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
export function textoDoHtml(html: string): string {
  const doc = analisarHtml(`<!doctype html><html><head></head><body>${html}</body></html>`);
  for (const b of doc.querySelectorAll("p, br, li, tr, h1, h2, h3, h4, div")) b.append("\n");
  return (doc.body?.textContent ?? "").replace(/[ \t\u00A0]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
}

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
  return { ...base, aplicado: true, resumo: `Conte\u00FAdo do documento ${d.documento.numero} gravado.` };
}
