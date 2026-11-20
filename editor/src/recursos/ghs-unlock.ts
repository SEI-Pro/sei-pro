/**
 * ghs-unlock (porte de `dist/js/modules/editor/ghs-unlock.js`).
 *
 * No CK5 o General HTML Support (GHS) filtra o que o SEI nao conhece: classes, estilos e atributos que
 * as ferramentas da extensao precisam preservar (ancora .imgBgAncora, marca d'agua, tabelas com estilo
 * proprio, <style> de @page...). Este recurso libera essas regras no DataFilter, registra um downcast
 * corretivo (roda DEPOIS do conversor do Estilo) e expoe `window.SeiProGhs`, pelo qual os demais
 * recursos aplicam classe/estilo/atributo pelo MODEL: mutar o DOM nao serve, o DOM do CK5 e so a view.
 * Em CK4 e no-op: o allowedContent de la ja e permissivo.
 */
import type { Contexto, Recurso } from "./tipos";

// biome-ignore lint/suspicious/noExplicitAny: o CKEditor 5 do SEI nao tem tipos; so os membros usados abaixo importam
type Qualquer = any;

/** Lista fechada de proposito: script/iframe/object/form ficam de fora para nao ampliar a superficie do que entra no documento. */
export const REGRA_TAGS =
  /^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/;

/**
 * O `allowAttributes` do DataFilter usa o padrao como um Matcher UNICO e, no Matcher do CK5, `classes: true`
 * exige que o elemento TENHA classe (idem attributes e styles). Com a regra combinada so o elemento que
 * tivesse os tres ao mesmo tempo era liberado (a marca de sigilo `<span class="sigiloSEI">` virava `<span>`).
 * Por isso as tres regras entram separadas.
 */
const REGRAS_ATRIBUTOS = [
  { name: REGRA_TAGS, attributes: true },
  { name: REGRA_TAGS, classes: true },
  { name: REGRA_TAGS, styles: true },
];

/**
 * Nunca liberados, apesar do "attributes: true": atributos de evento (on*) e URL com esquema executavel.
 * O `data.get` (o que o SEI grava) devolvia `<span onmouseover=...>` e `<img onerror=...>` colados de outra
 * pagina. O DataFilter consome os proibidos antes dos liberados, entao o descarte vale sobre as regras acima.
 */
const REGRAS_ATRIBUTOS_PROIBIDOS = [
  { name: /[\s\S]+/, attributes: [{ key: /^on/i, value: true }] },
  {
    name: /[\s\S]+/,
    attributes: [
      {
        key: /^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,
        // biome-ignore lint/suspicious/noControlCharactersInRegex: o navegador ignora estes caracteres antes do esquema da URL (javascript:), por isso entram na regra
        value: /^[\s\x00-\x20]*(javascript|vbscript|livescript|data\s*:\s*text\/html)/i,
      },
    ],
  },
];

function log(msg: string, extra?: unknown): void {
  console.log("%c[SEIPro/GHS]", "color:#3f51b5;font-weight:bold;", msg, extra === undefined ? "" : extra);
}

function plugin(editor: Qualquer, nome: string): Qualquer {
  try {
    return editor?.plugins?.has(nome) ? editor.plugins.get(nome) : null;
  } catch {
    return null;
  }
}

const ehCk5 = (editor: Qualquer): boolean => !!(editor?.model && editor.editing && editor.conversion);

/** Mapa de estilos do SEI (Texto_Justificado, Tabela_Texto_...). */
const estilosDoSei = (editor: Qualquer): Record<string, unknown> => plugin(editor, "EstiloEditing")?.estilos ?? {};
const ehEstilo = (estilos: Record<string, unknown>, classe: string) => Object.hasOwn(estilos, classe);

/** Nome do atributo do GHS para uma tag ('p' -> 'htmlPAttributes'). */
function attrGhs(editor: Qualquer, tag: string): string {
  const ghs = plugin(editor, "GeneralHtmlSupport");
  if (typeof ghs?.getGhsAttributeNameForElement === "function") {
    try {
      return ghs.getGhsAttributeNameForElement(tag);
    } catch {
      // cai no nome por convencao
    }
  }
  return `html${tag.charAt(0).toUpperCase()}${tag.slice(1)}Attributes`;
}

function classesDoModel(item: Qualquer, attrName: string): string[] {
  const classes = item?.getAttribute?.(attrName)?.classes;
  if (!classes) return [];
  return Array.isArray(classes) ? [...classes] : Object.keys(classes);
}

/** Downcast corretivo: roda em 'lowest', depois do conversor do Estilo, e devolve ao <p> as classes que ele apagou. */
function sincronizarClasses(editor: Qualquer, item: Qualquer, api: Qualquer): void {
  if (!item?.is?.("element")) return;
  const viewEl = api.mapper.toViewElement(item);
  if (!viewEl) return;
  const estilos = estilosDoSei(editor);
  const estiloAtual = item.getAttribute("estilo");
  const extras = classesDoModel(item, attrGhs(editor, "p"));
  const w = api.writer;
  let atuais: string[] = [];
  try {
    atuais = Array.from(viewEl.getClassNames());
  } catch {
    // sem classes legiveis
  }
  for (const classe of atuais) if (classe !== estiloAtual && ehEstilo(estilos, classe)) w.removeClass(classe, viewEl); // sobrou de uma troca de estilo
  for (const classe of extras) if (!ehEstilo(estilos, classe)) w.addClass(classe, viewEl); // da extensao, que o Estilo apagou
  if (estiloAtual) w.addClass(estiloAtual, viewEl);
}

function registrarConversor(editor: Qualquer): void {
  if (editor.__seiProGhsConversor) return;
  editor.__seiProGhsConversor = true;
  // Os dois eventos: a ordem em que o CK5 converte os atributos de um mesmo item nao e garantida.
  const eventos = ["attribute:estilo:paragraph", `attribute:${attrGhs(editor, "p")}:paragraph`];
  editor.conversion.for("downcast").add((dispatcher: Qualquer) => {
    for (const evento of eventos) {
      dispatcher.on(
        evento,
        (_evt: unknown, data: Qualquer, api: Qualquer) => {
          try {
            sincronizarClasses(editor, data.item, api);
          } catch {
            // um item estranho nao pode derrubar a conversao
          }
        },
        { priority: "lowest" },
      );
    }
  });
}

/** Documento com comentarios: o `data.set` completo reancora os comentarios, entao nao reprocessa sozinho. */
function temComentarios(editor: Qualquer): boolean {
  try {
    return Array.from<{ name: string }>(editor.model.markers).some((m) => /coment/i.test(m.name));
  } catch {
    return false;
  }
}

/** Executa `fn` e devolve o documento ao estado "alterado" de antes: sem isso o Salvar do SEI comeca piscando sozinho. */
function semSujar(fn: () => void, editor: Qualquer): void {
  const salvar = plugin(editor, "Salvar");
  const sujoAntes = salvar ? !!salvar.isDirty : false;
  try {
    fn();
  } finally {
    if (salvar && !sujoAntes) {
      try {
        salvar.resetDirty();
      } catch {
        // sem o botao Salvar
      }
    }
  }
}

/**
 * O upcast da abertura roda ANTES destas regras: o que o GHS do SEI nao conhecia ja saiu do model.
 * Enquanto ninguem editou (nenhuma operacao desfazivel no historico), o conteudo e o mesmo do
 * `INFRA_EDITOR_CONFIG.initialData`, que entao e reprocessado com as regras ja ativas.
 */
function houveEdicao(editor: Qualquer): boolean {
  try {
    return editor.model.document.history.getOperations().some((op: Qualquer) => op.batch?.isUndoable);
  } catch {
    return true;
  }
}

function conteudoParaReprocessar(editor: Qualquer, win: Window): Record<string, string> {
  const atual: Record<string, string> = editor.getFullData({ seiProInterno: true });
  const inicial = (win as Qualquer).INFRA_EDITOR_CONFIG?.initialData;
  if (!inicial || typeof inicial !== "object" || houveEdicao(editor)) return atual;
  return Object.fromEntries(Object.keys(atual).map((raiz) => [raiz, typeof inicial[raiz] === "string" ? inicial[raiz] : atual[raiz]]));
}

function resolverModel(c: Contexto, editor: Qualquer, alvo: Qualquer): Qualquer {
  try {
    const a = alvo ?? c.adaptador.getSelectionParagraph(editor);
    if (!a) return null;
    if (typeof a.is === "function" && a.is("element")) return a;
    const el = a.jquery ? a.get(0) : a;
    if (el?.nodeType !== 1) return null;
    const view = editor.editing.view.domConverter.mapDomToView(el);
    return view ? editor.editing.mapper.toModelElement(view) : null;
  } catch {
    return null;
  }
}

function tagDoModel(editor: Qualquer, item: Qualquer): string | null {
  try {
    return editor.editing.mapper.toViewElement(item)?.name ?? null;
  } catch {
    return null;
  }
}

/** A API do `window.SeiProGhs`. Sem estado proprio: o estado ("liberado") fica na instancia do editor. */
function criarGhs(c: Contexto) {
  const instancia = (editor?: Qualquer) => editor ?? c.adaptador.getInstance();

  function liberar(editor?: Qualquer): boolean {
    const ed = instancia(editor);
    if (!ehCk5(ed)) return false;
    if (ed.__seiProGhsLiberado) return true;
    const df = plugin(ed, "DataFilter");
    if (!df) {
      log("DataFilter (GHS) ausente neste editor; nada a liberar");
      return false;
    }
    try {
      df.allowElement({ name: REGRA_TAGS, attributes: true, classes: true, styles: true });
      for (const regra of REGRAS_ATRIBUTOS) df.allowAttributes(regra);
      if (typeof df.disallowAttributes === "function") for (const regra of REGRAS_ATRIBUTOS_PROIBIDOS) df.disallowAttributes(regra);
    } catch (e) {
      log("falha ao liberar o GHS", e);
      return false;
    }
    ed.__seiProGhsLiberado = true;
    registrarConversor(ed);
    return true;
  }

  function aplicarRegras(editor?: Qualquer): boolean {
    const ed = instancia(editor);
    if (!liberar(ed) || typeof ed.getFullData !== "function") return false;
    let ok = true;
    semSujar(() => {
      try {
        ed.data.set(conteudoParaReprocessar(ed, c.win));
      } catch (e) {
        log("falha ao reprocessar o conteudo", e);
        ok = false;
      }
    }, ed);
    return ok;
  }

  /** Aplica `fn` ao item do model correspondente a `alvo`, pelo GHS. false se nao houver editor CK5, plugin ou mapeamento. */
  function comGhs(editor: Qualquer, alvo: Qualquer, fn: (ghs: Qualquer, tag: string, item: Qualquer) => void): boolean {
    const ed = instancia(editor);
    if (!liberar(ed)) return false;
    const ghs = plugin(ed, "GeneralHtmlSupport");
    const item = resolverModel(c, ed, alvo);
    const tag = item ? tagDoModel(ed, item) : null;
    if (!ghs || !item || !tag) return false;
    try {
      fn(ghs, tag, item);
      return true;
    } catch (e) {
      log("falha ao aplicar no model", e);
      return false;
    }
  }

  return {
    liberar,
    aplicarRegras,
    semSujar: (fn: () => void, editor?: Qualquer) => semSujar(fn, instancia(editor)),
    estaLiberado: (editor?: Qualquer) => !!instancia(editor)?.__seiProGhsLiberado,
    addClasse: (alvo: Qualquer, classes: string | string[], editor?: Qualquer) =>
      comGhs(editor, alvo, (ghs, tag, item) => ghs.addModelHtmlClass(tag, classes, item)),
    removeClasse: (alvo: Qualquer, classes: string | string[], editor?: Qualquer) =>
      comGhs(editor, alvo, (ghs, tag, item) => ghs.removeModelHtmlClass(tag, classes, item)),
    setEstilos: (alvo: Qualquer, estilos: Record<string, string>, editor?: Qualquer) =>
      comGhs(editor, alvo, (ghs, tag, item) => ghs.setModelHtmlStyles(tag, estilos, item)),
    setAtributos: (alvo: Qualquer, atributos: Record<string, string>, editor?: Qualquer) =>
      comGhs(editor, alvo, (ghs, tag, item) => ghs.setModelHtmlAttributes(tag, atributos, item)),
  };
}

export const recurso: Recurso = {
  id: "ghs-unlock",

  globais: (c: Contexto) => ({ SeiProGhs: criarGhs(c) }),

  iniciar(c: Contexto) {
    if (c.adaptador.versao !== 5) return; // CK4 ja e permissivo
    const ghs = criarGhs(c);
    const editor = c.adaptador.getInstance();
    if (!editor || !ghs.liberar(editor)) return;
    if ((c.win as Qualquer).SEIPRO_GHS_AUTO === false || temComentarios(editor)) {
      log("regras liberadas (ativacao no próximo data.set)");
      return;
    }
    if (ghs.aplicarRegras(editor)) log("classes, estilos e atributos liberados no editor");
  },
};
