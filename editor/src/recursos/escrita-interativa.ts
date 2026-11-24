import { htmlParaNos } from "../adaptador/html";
import type { Editor } from "../adaptador/tipos";
import type { Contexto, Recurso } from "./tipos";

/**
 * Escrita interativa (porte de `escrita-interativa.js`): ao digitar "#" o usuario escolhe um dado do processo ou um
 * documento da arvore (citacao com link); ao digitar "@" escolhe uma unidade, que entra como ancora
 * `span.interessadoSeiPro[data-id]` (a mesma que o Enviar Processo usa para pre-preencher os destinatarios).
 *
 * - Nucleo (independe do editor): `detectarGatilho` so aceita o marcador que abre palavra (inicio do paragrafo, espaco ou
 *   abre-parenteses/aspas antes) e cuja consulta nao comeca com espaco nem quebra linha; o texto analisado e SO o que
 *   esta antes do cursor. Provedores: '#' (dados do processo + documentos, filtro local) e '@' (unidades, AJAX do
 *   autocompletar do Enviar Processo, com cache e ordenacao por relevancia da sigla).
 * - CK5 (SEI 5): sem lista propria. Soma as unidades ao feed '@' nativo do plugin Mention (as variaveis do SEI vem antes),
 *   registra o marcador '#' e um TextWatcher com os dois, e trata a escolha dos itens do SEI Pro com prioridade
 *   'highest' (antes do `_buscaInsereConteudoTag` do SEI, que tentaria buscar o item como variavel).
 * - CK4 (SEI 3.1/4): lista propria no documento da pagina (position: fixed, fora do iframe), para nunca entrar no
 *   conteudo salvo. O monolito (`onKeyEditorPro`) repassa as teclas para `ck4Tecla`/`ck4AoDigitar`.
 *
 * Opcao: "escrivainterativa" (`verifyOpcao`, desligada se ausente), lida a cada consulta.
 * Diferencas em relacao ao legado: a insercao no CK4 roda em `withEdit` (um passo de desfazer; secao somente leitura nao
 * abre a lista); o estado e do contexto (nao de modulo); `nr_sei` ausente conta como vazio.
 */

const MAX_CONSULTA = 40;
const MIN_CONSULTA_UNIDADE = 2;
const LIMITE_CAMPOS = 60;
const LIMITE_UNIDADES = 30;
const TEMPO_LIMITE_UNIDADES = 10000;

export type Marcador = "#" | "@";

export interface Gatilho {
  marcador: Marcador | string;
  consulta: string;
  inicio: number;
}

/** Item oferecido ao usuario (campo do processo/documento ou unidade). */
export interface ItemEscrita {
  id: string;
  text: string;
  seiPro: "campo" | "unidade";
  tipo?: "dado" | "documento";
  rotulo: string;
  html: string;
  rank?: number;
  idUnidade?: string;
  sigla?: string;
  nome?: string;
}

interface Provedor {
  marcador: Marcador;
  buscar(consulta: string): Promise<ItemEscrita[]> | ItemEscrita[];
}

interface UnidadeAjax {
  id?: string | number;
  descricao?: string;
}

interface DocumentoDoProcesso {
  id_protocolo?: string | number;
  documento?: string;
  nr_sei?: string;
}

/** O que o monolito deixa em `window` e este recurso usa (todos opcionais: a ausencia nunca derruba a escrita). */
interface Monolito {
  arrayDadosEditor?(): Array<[string?, string?] | null | undefined>;
  dadosProcessoPro?: { listDocumentos?: DocumentoDoProcesso[] };
  getCitacaoDoc?(): string;
  getConfigValue?(chave: string): string | undefined;
  textoParaHtmlPro?(texto: string): string;
  htmlLinksProtocoloEditorPro?(html: string, ed: object): string;
  getInteressadosProcesso?(consulta: string, aoTerminar: (lista: UnidadeAjax[]) => void): void;
  linkPesquisaInteressado?: unknown;
}

// ---------- API crua do CK4 (o adaptador nao a expoe) ----------
interface Ck4NoDom {
  nodeType: number;
  data: string;
  parentNode: Node | null;
}
interface Ck4Intervalo {
  collapsed: boolean;
  clone(): Ck4Intervalo;
  startPath(): { block?: unknown; blockLimit?: unknown };
  setStartAt(el: unknown, posicao: number): void;
  cloneContents(): { $: { textContent: string | null } };
  setStart(no: unknown, deslocamento: number): void;
  setEnd(no: unknown, deslocamento: number): void;
  select(): void;
}
interface Ck4Cru {
  getSelection(): { getRanges(): Ck4Intervalo[] } | null;
  createRange(): Ck4Intervalo;
  window: { $: Window };
  readOnly?: boolean;
  on(evento: string, fn: () => void): void;
  _seiProEscrita?: boolean;
}
interface Ck4Global {
  POSITION_AFTER_START: number;
  dom: { node: new (no: Node) => unknown };
}

// ---------- API crua do CK5 (sem tipos publicos) ----------
// biome-ignore lint/suspicious/noExplicitAny: o CKEditor 5 do SEI nao tem tipos; so os membros usados abaixo importam
type Qualquer = any;

// ================================================================
// 1) NUCLEO (puro)
// ================================================================

export function normalizar(s: unknown): string {
  let t = String(s ?? "");
  try {
    t = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } catch {
    // sem normalize: segue com o texto como veio
  }
  return t.toLowerCase();
}

export function escaparHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Antes do marcador: inicio, espaco (inclui nbsp) ou abertura de parenteses/colchetes/aspas.
const ANTES_VALIDO = /[\s\u00a0([{"'\u201c\u2018\u00ab]/;

/**
 * Devolve `{marcador, consulta, inicio}` para o gatilho que termina no cursor, ou null.
 * `texto` = conteudo do paragrafo do inicio ate o cursor.
 */
export function detectarGatilho(texto: string, marcadores: readonly string[] = ["#", "@"]): Gatilho | null {
  const t = String(texto ?? "");
  let melhor: Gatilho | null = null;
  for (const m of marcadores) {
    const i = t.lastIndexOf(m);
    if (i < 0) continue;
    if (i > 0 && !ANTES_VALIDO.test(t.charAt(i - 1))) continue;
    const consulta = t.slice(i + 1);
    if (/[\r\n]/.test(consulta) || /^[\s\u00a0]/.test(consulta) || consulta.length > MAX_CONSULTA) continue;
    if (!melhor || i > melhor.inicio) melhor = { marcador: m, consulta: consulta.replace(/\u00a0/g, " "), inicio: i };
  }
  return melhor;
}

/** Consulta que nao deve ir para o provedor (CK5: o watcher nativo aceita espaco logo depois do marcador). */
export function consultaValida(consulta: unknown): consulta is string {
  return typeof consulta === "string" && !/^[\s\u00a0]/.test(consulta) && !/[\r\n]/.test(consulta) && consulta.length <= MAX_CONSULTA;
}

// ================================================================

interface OpcoesCriar {
  /** Tempo maximo da consulta de unidades (padrao 10 s); injetavel nos testes. */
  tempoLimiteUnidadesMs?: number;
}

interface EstadoCk4 {
  lista: HTMLUListElement | null;
  itens: ItemEscrita[];
  indice: number;
  gatilho: Gatilho | null;
  editor: Ck4Cru | null;
  seq: number;
  scrollJanelaLigado: boolean;
}

export interface EscritaInterativa {
  detectarGatilho: typeof detectarGatilho;
  buscar(marcador: string, consulta: unknown): Promise<ItemEscrita[]>;
  provedores: Record<string, Provedor>;
  instalarCK5(editor: unknown): boolean;
  ck4Tecla(editor: unknown, keyCode: number): boolean;
  ck4AoDigitar(editor: unknown): void;
  ck4Fechar(): void;
}

interface Instancia {
  api: EscritaInterativa;
  iniciar(): void;
}

const instancias = new WeakMap<Contexto, Instancia>();

export function criarEscritaInterativa(c: Contexto, opcoes: OpcoesCriar = {}): Instancia {
  const existente = instancias.get(c);
  if (existente) return existente;
  const nova = montar(c, opcoes);
  instancias.set(c, nova);
  return nova;
}

function montar(c: Contexto, opcoes: OpcoesCriar): Instancia {
  const A = c.adaptador;
  const doc = c.doc;
  const w = c.win as unknown as Monolito;
  const tempoLimite = opcoes.tempoLimiteUnidadesMs ?? TEMPO_LIMITE_UNIDADES;

  const ativo = (): boolean => {
    try {
      return !!c.verifyOpcao("escrivainterativa");
    } catch {
      return false;
    }
  };

  /** Texto de um trecho de HTML (parseado de forma inerte), com os espacos normalizados. */
  const htmlParaTexto = (html: unknown): string =>
    htmlParaNos(doc, String(html ?? ""))
      .map((n) => n.textContent ?? "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();

  // ---- Provedor '#': dados do processo e documentos da arvore ----
  interface Campo {
    rotulo: string;
    html: string;
    tipo: "dado" | "documento";
    chave: string;
  }

  function listarCampos(): Campo[] {
    const itens: Campo[] = [];
    const add = (rotuloHtml: unknown, valorHtml: unknown, tipo: "dado" | "documento"): void => {
      if (!rotuloHtml || !valorHtml) return;
      const rotulo = htmlParaTexto(rotuloHtml);
      if (!rotulo) return;
      itens.push({ rotulo, html: String(valorHtml), tipo, chave: normalizar(rotulo) });
    };
    try {
      if (typeof w.arrayDadosEditor === "function") {
        for (const v of w.arrayDadosEditor() ?? []) if (v) add(v[0], v[1], "dado");
      }
    } catch (e) {
      console.warn("[SEIPro] escrita interativa: dados do processo", (e as Error)?.message);
    }
    try {
      const docs = w.dadosProcessoPro?.listDocumentos ?? [];
      const citacaoDoc = typeof w.getCitacaoDoc === "function" ? w.getCitacaoDoc() : "";
      const cita4 = typeof w.getConfigValue === "function" && w.getConfigValue("citacaodoc") === "citacaodoc_4";
      const esc = (t: unknown): string => (typeof w.textoParaHtmlPro === "function" ? w.textoParaHtmlPro(String(t ?? "")) : escaparHtml(t));
      for (const v of docs) {
        if (!v?.documento) continue;
        const temNr = (v.nr_sei ?? "") !== "";
        const nrSei = temNr ? (v.nr_sei as string) : v.documento;
        const rotulo = temNr ? `${v.documento} (${v.nr_sei})` : v.documento;
        const link = `<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei${esc(v.id_protocolo)}" style="text-indent:0;">${esc(nrSei)}</a></span>`;
        const valor = temNr || cita4 ? `${esc(String(v.documento).trim())}&nbsp;(${citacaoDoc}${link})` : link;
        add(esc(rotulo), valor, "documento");
      }
    } catch (e) {
      console.warn("[SEIPro] escrita interativa: documentos", (e as Error)?.message);
    }
    return itens;
  }

  const provedorCampos: Provedor = {
    marcador: "#",
    buscar(consulta) {
      const q = normalizar(consulta);
      const todos = listarCampos();
      const filtrados = q ? todos.filter((it) => it.chave.indexOf(q) !== -1) : todos;
      if (q) filtrados.sort((a, b) => (a.chave.indexOf(q) === 0 ? 0 : 1) - (b.chave.indexOf(q) === 0 ? 0 : 1));
      return filtrados.slice(0, LIMITE_CAMPOS).map((it, i) => ({
        id: `#seipro${i}`,
        text: it.rotulo,
        seiPro: "campo" as const,
        tipo: it.tipo,
        rotulo: it.rotulo,
        html: it.html,
      }));
    },
  };

  // ---- Provedor '@': unidades (autocompletar do Enviar Processo) ----
  const cacheUnidades: Record<string, UnidadeAjax[]> = {};
  let aquecido = false;

  function pesquisarUnidades(consulta: string): Promise<UnidadeAjax[]> {
    const chave = normalizar(consulta);
    const emCache = cacheUnidades[chave];
    if (emCache) return Promise.resolve(emCache);
    return new Promise<UnidadeAjax[]>((resolve) => {
      if (typeof w.getInteressadosProcesso !== "function") return resolve([]);
      let feito = false;
      const fim = (r?: unknown): void => {
        if (feito) return;
        feito = true;
        resolve(Array.isArray(r) ? (r as UnidadeAjax[]) : []);
      };
      setTimeout(() => fim([]), tempoLimite);
      try {
        w.getInteressadosProcesso(consulta, fim);
      } catch {
        fim([]);
      }
    }).then((lista) => {
      if (lista.length) cacheUnidades[chave] = lista;
      return lista;
    });
  }

  const provedorUnidades: Provedor = {
    marcador: "@",
    buscar(consulta) {
      // Na 1a vez `getInteressadosProcesso` ainda descobre o link do autocompletar (arvore -> Enviar Processo), o que leva
      // segundos: comeca ja no "@", antes de haver consulta.
      if (consulta === "" && w.linkPesquisaInteressado === undefined && !aquecido && typeof w.getInteressadosProcesso === "function") {
        aquecido = true;
        try {
          w.getInteressadosProcesso("", () => {});
        } catch {
          // o aquecimento e so uma antecipacao
        }
      }
      if (!consultaValida(consulta) || consulta.length < MIN_CONSULTA_UNIDADE || consulta.indexOf("@") !== -1) return Promise.resolve([]);
      const q = normalizar(consulta);
      return pesquisarUnidades(consulta).then((lista) => {
        const itens: ItemEscrita[] = lista
          .filter((u) => u?.id && u.descricao)
          .map((u) => {
            const desc = String(u.descricao);
            const p = desc.indexOf(" - ");
            const sigla = p > 0 ? desc.slice(0, p) : desc;
            const nome = p > 0 ? desc.slice(p + 3) : "";
            const s = normalizar(sigla);
            const rank = s === q ? 0 : s.indexOf(q) === 0 ? 1 : s.indexOf(q) !== -1 ? 2 : 3;
            return {
              id: `@seipro${u.id}`,
              text: desc,
              seiPro: "unidade" as const,
              rank,
              idUnidade: String(u.id),
              sigla,
              nome,
              rotulo: desc,
              html: `<span class="ancoraSei interessadoSeiPro" data-id="${escaparHtml(u.id)}" style="text-indent:0px;">${escaparHtml(desc)}</span>`,
            };
          });
        itens.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0) || (a.sigla?.length ?? 0) - (b.sigla?.length ?? 0));
        return itens.slice(0, LIMITE_UNIDADES);
      });
    },
  };

  const PROVEDORES: Record<string, Provedor> = { "#": provedorCampos, "@": provedorUnidades };

  function buscar(marcador: string, consulta: unknown): Promise<ItemEscrita[]> {
    const p = PROVEDORES[marcador];
    if (!p || !ativo() || !consultaValida(consulta)) return Promise.resolve([]);
    try {
      return Promise.resolve(p.buscar(consulta));
    } catch {
      return Promise.resolve([]);
    }
  }

  // ---- Apresentacao do item (comum a CK4 e CK5) ----
  function elementoItem(item: ItemEscrita): HTMLElement {
    const el = doc.createElement("span");
    el.className = `seipro-escrita-item seipro-escrita-${item.seiPro}`;
    const ic = doc.createElement("i");
    ic.className = `fas ${item.seiPro === "unidade" ? "fa-building" : item.tipo === "documento" ? "fa-file-alt" : "fa-hashtag"}`;
    el.appendChild(ic);
    const tx = doc.createElement("span");
    tx.className = "seipro-escrita-texto";
    if (item.seiPro === "unidade") {
      const b = doc.createElement("b");
      b.textContent = item.sigla ?? "";
      tx.appendChild(b);
      if (item.nome) tx.appendChild(doc.createTextNode(` \u2014 ${item.nome}`));
    } else {
      tx.textContent = item.rotulo;
    }
    tx.title = item.rotulo;
    el.appendChild(tx);
    return el;
  }

  function injetarCss(): void {
    if (doc.getElementById("seipro-escrita-css")) return;
    const st = doc.createElement("style");
    st.id = "seipro-escrita-css";
    st.textContent = [
      ".seipro-escrita-item { display: flex !important; align-items: baseline; gap: 7px; max-width: 520px; width: 100%; text-align: left; cursor: pointer; }",
      ".seipro-escrita-item i { width: 14px; flex: none; text-align: center; opacity: .6; font-size: 11px; }",
      // O reset do CK5 (.ck-reset_all *) troca a fonte de tudo que esta no balao, inclusive o icone.
      '.seipro-escrita-item i.fas { font-family: "Font Awesome 5 Pro" !important; font-weight: 900 !important; font-style: normal !important; }',
      ".seipro-escrita-texto { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }",
      ".ck.ck-mentions .seipro-escrita-item { padding: 6px 10px; box-sizing: border-box; }",
      ".seipro-escrita-lista { position: fixed; z-index: 99999; min-width: 260px; max-width: 540px; max-height: 300px; overflow-y: auto; margin: 0; padding: 4px 0; list-style: none;" +
        " background: #fff; border: 1px solid #c4c4c4; border-radius: 3px; box-shadow: 0 2px 8px rgba(0,0,0,.18); font: 13px/1.4 Arial, sans-serif; color: #333; }",
      ".seipro-escrita-lista li { padding: 5px 10px; }",
      ".seipro-escrita-lista li.ativo { background: #3875d7; color: #fff; }",
      ".seipro-escrita-lista li.vazio { color: #888; font-style: italic; cursor: default; }",
      "html.dark-mode .seipro-escrita-lista { background: #3d3d3d; border-color: #555; color: #fbfbfe; }",
    ].join("\n");
    (doc.head || doc.documentElement).appendChild(st);
  }

  // ================================================================
  // 2) CK5 -- integra ao plugin Mention nativo do SEI 5
  // ================================================================
  function instalarCK5(editorBruto: unknown): boolean {
    const editor = editorBruto as Qualquer;
    if (!editor?.plugins?.has?.("MentionUI")) return false;
    const mui = editor.plugins.get("MentionUI");
    if (mui._seiProEscrita) return true;
    if (!mui._mentionsConfigurations || typeof mui._setupTextWatcher !== "function" || !mui._mentionsView) {
      console.warn("[SEIPro] escrita interativa: MentionUI sem a API esperada");
      return false;
    }
    injetarCss();

    const renderizador =
      (anterior: unknown) =>
      (item: Qualquer): unknown => {
        if (item?.seiPro) return elementoItem(item);
        if (typeof anterior === "function") return anterior(item);
        return item.id;
      };

    // '@': variaveis do SEI (feed nativo) + unidades.
    const cfgArroba = mui._mentionsConfigurations.get("@");
    if (cfgArroba) {
      const feedNativo = cfgArroba.feedCallback;
      cfgArroba.feedCallback = (consulta: string) => {
        let nativos: unknown;
        try {
          nativos = feedNativo ? feedNativo(consulta) : [];
        } catch {
          nativos = [];
        }
        return Promise.resolve(nativos).then((nat) => {
          const lista = Array.isArray(nat) ? nat : [];
          return buscar("@", consulta).then((uns) => lista.concat(uns));
        });
      };
      cfgArroba.itemRenderer = renderizador(cfgArroba.itemRenderer);
      cfgArroba.dropdownLimit = Math.max(
        cfgArroba.dropdownLimit || editor.config?.get?.("mention.dropdownLimit") || 10,
        LIMITE_UNIDADES + 10,
      );
    } else {
      mui._mentionsConfigurations.set("@", {
        marker: "@",
        feedCallback: (q: string) => buscar("@", q),
        itemRenderer: renderizador(null),
        dropdownLimit: LIMITE_UNIDADES,
      });
    }

    // '#': campos do processo.
    mui._mentionsConfigurations.set("#", {
      marker: "#",
      feedCallback: (q: string) => buscar("#", q),
      itemRenderer: renderizador(null),
      dropdownLimit: LIMITE_CAMPOS,
    });
    mui._setupTextWatcher([
      { marker: "@", minimumCharacters: 0 },
      { marker: "#", minimumCharacters: 0 },
    ]);

    // Escolha de um item do SEI Pro: troca "#consulta"/"@consulta" pelo HTML do item.
    mui._mentionsView.on(
      "execute",
      (evt: Qualquer, data: Qualquer) => {
        const item = data?.item;
        if (!item?.seiPro) return;
        evt.stop();
        const model = editor.model;
        const marcador = model.markers.get("mention");
        if (!marcador) return;
        const faixa = model.createRange(
          model.createPositionAt(marcador.getStart()),
          model.createPositionAt(model.document.selection.focus),
        );
        mui._hideUIAndRemoveMarker();
        const html = typeof w.htmlLinksProtocoloEditorPro === "function" ? w.htmlLinksProtocoloEditorPro(item.html, editor) : item.html;
        try {
          model.change((writer: Qualquer) => {
            const frag = editor.data.toModel(editor.data.processor.toView(html), "$block");
            const inserido = model.insertContent(frag, faixa);
            const espaco = model.insertContent(writer.createText(" "), inserido.end);
            writer.setSelection(espaco.end);
          });
        } catch (e) {
          console.warn("[SEIPro] escrita interativa: falha ao inserir", (e as Error)?.message);
        }
        editor.editing.view.focus();
      },
      { priority: "highest" },
    );

    mui._seiProEscrita = true;
    return true;
  }

  // ================================================================
  // 3) CK4 -- lista propria fora do iframe
  // ================================================================
  const ck4: EstadoCk4 = { lista: null, itens: [], indice: 0, gatilho: null, editor: null, seq: 0, scrollJanelaLigado: false };
  const ckGlobal = (): Ck4Global => (c.win as unknown as { CKEDITOR: Ck4Global }).CKEDITOR;

  function ck4TextoAntesDoCursor(editor: Ck4Cru): string | null {
    const sel = editor.getSelection();
    let r = sel?.getRanges()[0];
    if (!r?.collapsed) return null;
    r = r.clone();
    const path = r.startPath();
    const bloco = path.block || path.blockLimit;
    if (!bloco) return null;
    r.setStartAt(bloco, ckGlobal().POSITION_AFTER_START);
    return r.cloneContents().$.textContent;
  }

  function ck4Fechar(): void {
    if (ck4.lista) {
      ck4.lista.remove();
      ck4.lista = null;
    }
    ck4.itens = [];
    ck4.indice = 0;
    ck4.gatilho = null;
    ck4.seq++;
  }

  function ck4Retangulo(editor: Ck4Cru): { left: number; top: number; bottom: number } | null {
    try {
      const win = editor.window.$;
      const s = win.getSelection();
      if (!s?.rangeCount) return null;
      const r = s.getRangeAt(0).cloneRange();
      let rects = r.getClientRects();
      let rc: DOMRect | null = rects.length ? (rects[rects.length - 1] as DOMRect) : null;
      if ((!rc || (!rc.width && !rc.height)) && r.startContainer.nodeType === 3 && r.startOffset > 0) {
        r.setStart(r.startContainer, r.startOffset - 1);
        rects = r.getClientRects();
        rc = rects.length ? (rects[rects.length - 1] as DOMRect) : null;
      }
      if (!rc)
        rc =
          r.startContainer.nodeType === 1
            ? (r.startContainer as Element).getBoundingClientRect()
            : (r.startContainer.parentNode as Element).getBoundingClientRect();
      const fr = win.frameElement ? win.frameElement.getBoundingClientRect() : { left: 0, top: 0 };
      return { left: fr.left + rc.right, top: fr.top + rc.top, bottom: fr.top + rc.bottom };
    } catch {
      return null;
    }
  }

  function ck4Destacar(i: number): void {
    if (!ck4.lista || !ck4.itens.length) return;
    const n = ck4.itens.length;
    ck4.indice = (i + n) % n;
    const lis = ck4.lista.querySelectorAll<HTMLElement>("li[data-i]");
    Array.prototype.forEach.call(lis, (li: HTMLElement) => li.classList.toggle("ativo", Number(li.getAttribute("data-i")) === ck4.indice));
    const at = lis[ck4.indice];
    if (at?.scrollIntoView) at.scrollIntoView({ block: "nearest" });
  }

  const itemDaLista = (e: Event): HTMLElement | null => {
    const alvo = e.target as Element | null;
    return (alvo?.closest?.("li[data-i]") as HTMLElement | null) ?? null;
  };

  function ck4Renderizar(editor: Ck4Cru, itens: ItemEscrita[]): void {
    injetarCss();
    if (!ck4.lista) {
      const ul = doc.createElement("ul");
      ul.className = "seipro-escrita-lista";
      // mousedown com preventDefault: o editor nao perde o foco nem a selecao ao clicar na lista.
      ul.addEventListener("mousedown", (e) => {
        e.preventDefault();
        const li = itemDaLista(e);
        if (li) ck4Escolher(Number(li.getAttribute("data-i")));
      });
      ul.addEventListener("mouseover", (e) => {
        const li = itemDaLista(e);
        if (li) ck4Destacar(Number(li.getAttribute("data-i")));
      });
      doc.body.appendChild(ul);
      ck4.lista = ul;
    }
    const lista = ck4.lista;
    while (lista.firstChild) lista.removeChild(lista.firstChild);
    ck4.itens = itens;
    ck4.indice = 0;
    if (!itens.length) {
      const vazio = doc.createElement("li");
      vazio.className = "vazio";
      vazio.textContent = "Nenhum resultado encontrado";
      lista.appendChild(vazio);
    }
    itens.forEach((it, i) => {
      const li = doc.createElement("li");
      li.setAttribute("data-i", String(i));
      li.appendChild(elementoItem(it));
      lista.appendChild(li);
    });
    ck4Destacar(0);
    const pos = ck4Retangulo(editor);
    if (!pos) {
      ck4Fechar();
      return;
    }
    const alt = lista.offsetHeight || 0;
    const larg = lista.offsetWidth || 0;
    const altJanela = c.win.innerHeight || Number.POSITIVE_INFINITY;
    const largJanela = c.win.innerWidth || Number.POSITIVE_INFINITY;
    const top = pos.bottom + 4 + alt > altJanela && pos.top - 4 - alt > 0 ? pos.top - 4 - alt : pos.bottom + 4;
    const left = Math.max(4, Math.min(pos.left, largJanela - larg - 8));
    lista.style.top = `${top}px`;
    lista.style.left = `${left}px`;
  }

  // Seleciona (no DOM nativo) os n caracteres antes do cursor, atravessando nos de texto do bloco.
  function ck4SelecionarAntes(editor: Ck4Cru, n: number): boolean {
    const win = editor.window.$;
    const s = win.getSelection();
    if (!s?.rangeCount) return false;
    const fim = s.getRangeAt(0);
    let no = fim.startContainer as unknown as Ck4NoDom;
    let off = fim.startOffset;
    if (no.nodeType !== 3) {
      const pai = no as unknown as Node;
      let ant: Node | null = off > 0 ? (pai.childNodes[off - 1] ?? null) : null;
      while (ant && ant.nodeType !== 3 && ant.lastChild) ant = ant.lastChild;
      if (ant?.nodeType !== 3) return false;
      no = ant as unknown as Ck4NoDom;
      off = no.data.length;
    }
    let bloco: Node | null = no.parentNode;
    while (bloco && bloco.nodeType === 1 && !/^(P|DIV|LI|TD|TH|H[1-6]|BODY|BLOCKQUOTE)$/.test(bloco.nodeName)) bloco = bloco.parentNode;
    const walker = win.document.createTreeWalker(bloco || win.document.body, 4, null);
    walker.currentNode = no as unknown as Node;
    let resta = n;
    while (resta > off) {
      resta -= off;
      const prev = walker.previousNode() as unknown as Ck4NoDom | null;
      if (!prev) return false;
      no = prev;
      off = prev.data.length;
    }
    const r = win.document.createRange();
    r.setStart(no as unknown as Node, off - resta);
    r.setEnd(fim.endContainer, fim.endOffset);
    const cr = editor.createRange();
    const NoCk = ckGlobal().dom.node;
    cr.setStart(new NoCk(r.startContainer), r.startOffset);
    cr.setEnd(new NoCk(r.endContainer), r.endOffset);
    cr.select();
    return true;
  }

  function ck4Escolher(i: number): void {
    const item = ck4.itens[i];
    const g = ck4.gatilho;
    const editor = ck4.editor;
    ck4Fechar();
    if (!item || !g || !editor) return;
    // um passo de desfazer: foco, snapshot, selecao do "#consulta", insercao e snapshot
    A.withEdit(editor as Editor, () => {
      if (ck4SelecionarAntes(editor, 1 + g.consulta.length)) A.insertHtml(editor as Editor, `${item.html}&nbsp;`);
    });
  }

  function ck4Ligar(editor: Ck4Cru): void {
    if (!editor || editor._seiProEscrita) return;
    editor._seiProEscrita = true;
    editor.on("blur", () => ck4Fechar());
    editor.on("destroy", () => ck4Fechar());
    try {
      editor.window.$.addEventListener("scroll", ck4Fechar, true);
    } catch {
      // iframe ainda sem janela: a rolagem da pagina abaixo cobre o caso comum
    }
    if (!ck4.scrollJanelaLigado) {
      ck4.scrollJanelaLigado = true;
      c.win.addEventListener(
        "scroll",
        () => {
          if (ck4.lista) ck4Fechar();
        },
        true,
      );
    }
  }

  /** Tecla (keydown) no CK4. Retorna true quando a lista consumiu a tecla. */
  function ck4Tecla(editorBruto: unknown, keyCode: number): boolean {
    const editor = editorBruto as Ck4Cru;
    if (!ck4.lista || ck4.editor !== editor) return false;
    if (keyCode === 40) {
      ck4Destacar(ck4.indice + 1);
      return true;
    }
    if (keyCode === 38) {
      ck4Destacar(ck4.indice - 1);
      return true;
    }
    if (keyCode === 27) {
      ck4Fechar();
      return true;
    }
    if (keyCode === 13 || keyCode === 9) {
      if (!ck4.itens.length) {
        ck4Fechar();
        return false;
      }
      ck4Escolher(ck4.indice);
      return true;
    }
    return false;
  }

  const somenteLeitura = (editor: Ck4Cru): boolean => {
    try {
      return !!editor.readOnly;
    } catch {
      return false;
    }
  };

  /** Depois de cada tecla no CK4: abre, atualiza ou fecha a lista conforme o texto antes do cursor. */
  function ck4AoDigitar(editorBruto: unknown): void {
    const editor = editorBruto as Ck4Cru | null;
    if (!editor || !ativo() || somenteLeitura(editor)) {
      ck4Fechar();
      return;
    }
    ck4Ligar(editor);
    let texto: string | null;
    try {
      texto = ck4TextoAntesDoCursor(editor);
    } catch {
      texto = null;
    }
    const g = texto ? detectarGatilho(texto) : null;
    if (!g) {
      ck4Fechar();
      return;
    }
    if (
      ck4.gatilho &&
      ck4.editor === editor &&
      ck4.gatilho.marcador === g.marcador &&
      ck4.gatilho.consulta === g.consulta &&
      ck4.gatilho.inicio === g.inicio
    )
      return;
    const seq = ++ck4.seq;
    buscar(g.marcador, g.consulta).then((itens) => {
      if (seq !== ck4.seq) return;
      // '@' curto ou sem unidade: nao abre lista vazia (o usuario pode estar so escrevendo).
      if (!itens.length && (g.marcador === "@" || !g.consulta)) {
        ck4Fechar();
        return;
      }
      ck4.gatilho = g;
      ck4.editor = editor;
      ck4Renderizar(editor, itens);
      ck4.seq = seq;
    });
  }

  const api: EscritaInterativa = {
    detectarGatilho,
    buscar,
    provedores: PROVEDORES,
    instalarCK5,
    ck4Tecla,
    ck4AoDigitar,
    ck4Fechar,
  };

  let iniciado = false;
  const iniciar = (): void => {
    if (iniciado) return;
    iniciado = true;
    A.waitReady(30000)
      .then(() => {
        if (A.versao !== 5) return;
        const ed = A.getInstance();
        if (!instalarCK5(ed)) console.warn("[SEIPro] escrita interativa: CK5 sem plugin Mention");
      })
      .catch(() => {});
  };

  return { api, iniciar };
}

export const recurso: Recurso = {
  id: "escrita-interativa",
  globais: (c: Contexto) => ({ SeiProEscritaInterativa: criarEscritaInterativa(c).api }),
  iniciar: (c: Contexto) => criarEscritaInterativa(c).iniciar(),
};
