/**
 * Janela do editor do SEI — MUNDO DA PÁGINA (`js/sei-pro-agente-editor.js`).
 *
 * É o único pedaço do agente que roda no mundo da página, e só existe porque
 * o CKEditor aberto (instância JavaScript) não é visível do mundo isolado.
 * Faz duas coisas: ler e escrever na seção principal do documento aberto,
 * sem salvar — quem salva é o usuário, e Ctrl+Z desfaz o que o agente escreveu.
 *
 * Fala com o content script por `postMessage`, com um token gerado por ele e
 * passado no `data-token` da tag que carrega este arquivo. Sem o token certo,
 * a mensagem é ignorada.
 *
 * CK4 (SEI 3/4): `CKEDITOR.instances['txaEditor_N']`; a seção principal é a
 * editável com título "Corpo do Texto" (senão a última editável).
 * CK5 (SEI 5): uma instância multi-root em `.ck-editor__editable_inline`; a
 * raiz principal vem de `INFRA_EDITOR_CONFIG.rootsAttributes[raiz].principal`.
 * Mesmo desenho do `SeiProEditorAdapter` legado, reduzido ao que o agente usa.
 */

interface Ck4 {
  name: string;
  readOnly: boolean;
  config: { title?: string };
  getData(): string;
  setData(html: string, o?: { callback?: () => void }): void;
  insertHtml(html: string): void;
  fire(evento: string): void;
  getSelection(): { getSelectedText(): string } | null;
}

interface Ck5Raiz {
  rootName: string;
  isAttached(): boolean;
}

interface Ck5 {
  state: string;
  model: {
    document: { roots: Iterable<Ck5Raiz>; selection: { getFirstPosition(): { root: Ck5Raiz } | null } };
    change<T>(fn: (w: { createPositionAt(r: Ck5Raiz, onde: "end"): unknown }) => T): T;
    insertContent(conteudo: unknown, onde?: unknown): void;
    getSelectedContent(sel: unknown): unknown;
  };
  data: {
    get(o: { rootName: string }): string;
    set(v: Record<string, string>): void;
    stringify(frag: unknown): string;
    toModel(view: unknown): unknown;
    processor: { toView(html: string): unknown };
  };
}

declare global {
  interface Window {
    CKEDITOR?: { instances: Record<string, Ck4> };
    INFRA_EDITOR_CONFIG?: { rootsAttributes?: Record<string, { principal?: boolean; somenteLeitura?: boolean; label?: string }> };
  }
}

const MARCA = "seipro-agente-editor";
const token = (document.currentScript as HTMLScriptElement | null)?.dataset.token ?? "";

function ck5(): Ck5 | null {
  const el = document.querySelector(".ck-editor__editable_inline") as (Element & { ckeditorInstance?: Ck5 }) | null;
  const ed = el?.ckeditorInstance;
  return ed && ed.state === "ready" ? ed : null;
}

function raizCk5(ed: Ck5, secao?: string): Ck5Raiz {
  const attrs = window.INFRA_EDITOR_CONFIG?.rootsAttributes ?? {};
  const raizes = [...ed.model.document.roots].filter((r) => r.isAttached() && r.rootName !== "$graveyard");
  const alvo = secao
    ? raizes.find((r) => (attrs[r.rootName]?.label ?? "").toLowerCase().includes(secao.toLowerCase()))
    : raizes.find((r) => attrs[r.rootName]?.principal) ?? raizes.filter((r) => !attrs[r.rootName]?.somenteLeitura).pop();
  if (!alvo) throw new Error("Se\u00E7\u00E3o n\u00E3o encontrada no editor.");
  if (attrs[alvo.rootName]?.somenteLeitura) throw new Error("Esta se\u00E7\u00E3o \u00E9 somente leitura.");
  return alvo;
}

function instanciaCk4(secao?: string): Ck4 {
  const todas = Object.values(window.CKEDITOR?.instances ?? {});
  const editaveis = todas.filter((i) => !i.readOnly);
  const alvo = secao
    ? todas.find((i) => (i.config.title ?? "").toLowerCase().includes(secao.toLowerCase()))
    : editaveis.find((i) => /corpo|texto do documento|conte\u00FAdo/i.test(i.config.title ?? "")) ?? editaveis[editaveis.length - 1];
  if (!alvo) throw new Error("Nenhuma se\u00E7\u00E3o edit\u00E1vel no editor.");
  if (alvo.readOnly) throw new Error("Esta se\u00E7\u00E3o \u00E9 somente leitura.");
  return alvo;
}

type Modo = "cursor" | "fim" | "substituir";

function ler(secao?: string): { editor: "ck4" | "ck5"; secao: string; html: string; selecao: string } {
  const ed5 = ck5();
  if (ed5) {
    const r = raizCk5(ed5, secao);
    const sel = ed5.data.stringify(ed5.model.getSelectedContent(ed5.model.document.selection));
    return { editor: "ck5", secao: window.INFRA_EDITOR_CONFIG?.rootsAttributes?.[r.rootName]?.label ?? r.rootName, html: ed5.data.get({ rootName: r.rootName }), selecao: sel };
  }
  const i = instanciaCk4(secao);
  return { editor: "ck4", secao: i.config.title ?? i.name, html: i.getData(), selecao: i.getSelection()?.getSelectedText() ?? "" };
}

async function escrever(html: string, modo: Modo, secao?: string): Promise<string> {
  const ed5 = ck5();
  if (ed5) {
    const r = raizCk5(ed5, secao);
    if (modo === "substituir") {
      ed5.data.set({ [r.rootName]: html });
      return "substitu\u00EDdo";
    }
    const pos = ed5.model.document.selection.getFirstPosition();
    const noCursor = modo === "cursor" && pos?.root.rootName === r.rootName;
    ed5.model.change((w) => {
      const conteudo = ed5.data.toModel(ed5.data.processor.toView(html));
      ed5.model.insertContent(conteudo, noCursor ? undefined : w.createPositionAt(r, "end"));
    });
    return noCursor ? "inserido no cursor" : "inserido no fim";
  }
  const i = instanciaCk4(secao);
  i.fire("saveSnapshot");
  // setData é assíncrono: responde só quando o editor terminou de recarregar a seção.
  const definir = (conteudo: string) => new Promise<void>((ok) => i.setData(conteudo, { callback: () => (i.fire("saveSnapshot"), ok()) }));
  if (modo === "substituir") {
    await definir(html);
    return "substitu\u00EDdo";
  }
  if (modo === "fim") {
    // insertHtml no fim cairia DENTRO do último parágrafo; acrescentar ao HTML cria parágrafos novos.
    await definir(i.getData() + html);
    return "inserido no fim";
  }
  i.insertHtml(html);
  i.fire("saveSnapshot");
  return "inserido no cursor";
}

window.addEventListener("message", async (ev: MessageEvent) => {
  if (ev.source !== window) return;
  const m = ev.data as { __marca?: string; token?: string; id?: string; op?: string; args?: { html?: string; modo?: Modo; secao?: string } };
  if (m?.__marca !== MARCA || m.token !== token || !m.id || m.op === undefined) return;
  let resposta: { ok: boolean; dados?: unknown; erro?: string };
  try {
    resposta = { ok: true, dados: m.op === "ler" ? ler(m.args?.secao) : { resultado: await escrever(m.args?.html ?? "", m.args?.modo ?? "cursor", m.args?.secao) } };
  } catch (e) {
    resposta = { ok: false, erro: e instanceof Error ? e.message : String(e) };
  }
  window.postMessage({ __marca: MARCA, token, id: m.id, resposta }, "*");
});

export {};
