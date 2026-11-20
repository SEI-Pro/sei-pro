import { parseHTML } from "linkedom";
import { criarAdaptador } from "../../src/adaptador";
import { recurso as folha } from "../../src/recursos/folha-papel";
import type { Contexto } from "../../src/recursos/tipos";
import { criarCk4, paginaFalsa } from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => void;
const ctxDe = (f: { win: Window; doc: Document }): Contexto => ({
  adaptador: criarAdaptador(f.win),
  doc: f.doc,
  win: f.win,
  base: "",
  checkOpcao: () => true,
  verifyOpcao: () => false,
});

/** localStorage em memoria na janela falsa. */
function armazem(win: Window): Map<string, string> {
  const m = new Map<string, string>();
  (win as unknown as Record<string, unknown>).localStorage = {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => m.set(k, String(v)),
    removeItem: (k: string) => m.delete(k),
  };
  return m;
}

/** O CSSStyleDeclaration do linkedom nao tem prioridade (`!important`): um `style` completo, refletido no atributo. */
function estiloCompleto(el: HTMLElement): void {
  const valores = new Map<string, [string, string]>();
  const refletir = () => el.setAttribute("style", [...valores].map(([n, [v, p]]) => `${n}: ${v}${p ? " !important" : ""}`).join("; "));
  Object.defineProperty(el, "style", {
    value: {
      getPropertyValue: (n: string) => valores.get(n)?.[0] ?? "",
      getPropertyPriority: (n: string) => valores.get(n)?.[1] ?? "",
      setProperty: (n: string, v: string, p = "") => {
        valores.set(n, [v, p]);
        refletir();
      },
      removeProperty: (n: string) => {
        valores.delete(n);
        refletir();
      },
    },
  });
}

const BARRA =
  '<a class="getPaperViewButtom cke_button_off"></a><div class="cke_contents"></div><div class="cke_contents"></div><div class="cke_contents"></div>';

export function verificarFolhaPapel(): void {
  secao("recurso folha-papel");
  const { doc, win } = paginaFalsa(BARRA);
  const guardado = armazem(win);
  const g = folha.globais(ctxDe({ doc, win })) as Record<string, Fn>;
  igual("folha-papel: globais do contrato", Object.keys(g).sort(), ["aplicarFolhaEditorPro", "getPaperViewButtom", "initFolhaEditorPro"]);

  // iframes das secoes do CK4: documentos proprios
  const iframes = [0, 1, 2].map(() => {
    const el = doc.createElement("iframe");
    el.className = "cke_wysiwyg_frame";
    const { document } = parseHTML("<!doctype html><html><head></head><body></body></html>");
    estiloCompleto(document.body as unknown as HTMLElement);
    estiloCompleto(document.documentElement as unknown as HTMLElement);
    (document.body as unknown as HTMLElement).style.setProperty("background-color", "rgb(1, 2, 3)");
    Object.defineProperty(el, "contentDocument", { value: document });
    doc.body.append(el);
    return { el, doc: document as unknown as Document };
  });
  const botao = doc.querySelector(".getPaperViewButtom") as HTMLElement;
  const secoes = () => [...doc.querySelectorAll(".cke_contents")];

  g.getPaperViewButtom(botao);
  igual(
    "liga: grava a chave e o atributo no <html>",
    [guardado.get("spro_editor_folha"), doc.documentElement.hasAttribute("data-spro-folha-editor")],
    ["1", true],
  );
  igual(
    "liga: um unico <style data-style=seipro-folha-editor> com a mesa clara",
    [
      doc.querySelectorAll('style[data-style="seipro-folha-editor"]').length,
      doc.querySelector('style[data-style="seipro-folha-editor"]')?.textContent?.includes("#f3f4f7"),
    ],
    [1, true],
  );
  igual(
    "liga: as 3 secoes viram primeira, meio e ultima",
    secoes().map((s) => s.getAttribute("data-spro-folha")),
    ["primeira", "meio", "ultima"],
  );
  igual(
    "liga: botao on e aria-pressed",
    [botao.className, botao.getAttribute("aria-pressed")],
    ["getPaperViewButtom cke_button_on", "true"],
  );
  checar(
    "liga: cada iframe recebe o CSS do fundo branco e o fundo inline",
    iframes.every(
      (i) =>
        i.doc.querySelector('style[data-style="seipro-folha-editor"]')?.textContent?.includes("#ffffff") &&
        (i.doc.body as unknown as HTMLElement).getAttribute("style")?.includes("#ffffff"),
    ),
  );

  g.aplicarFolhaEditorPro(true);
  igual("aplicar de novo nao duplica o <style>", doc.querySelectorAll('style[data-style="seipro-folha-editor"]').length, 1);

  g.getPaperViewButtom(botao);
  igual(
    "desliga: apaga a chave e o atributo, tira o <style> e as marcas das secoes",
    [
      guardado.has("spro_editor_folha"),
      doc.documentElement.hasAttribute("data-spro-folha-editor"),
      doc.querySelectorAll('style[data-style="seipro-folha-editor"]').length,
      secoes()
        .map((s) => s.hasAttribute("data-spro-folha"))
        .join(),
    ],
    [false, false, 0, "false,false,false"],
  );
  igual("desliga: botao off", [botao.className, botao.getAttribute("aria-pressed")], ["getPaperViewButtom cke_button_off", "false"]);
  checar(
    "desliga: o fundo original do iframe volta e o <style> do iframe some",
    iframes.every(
      (i) =>
        !i.doc.querySelector('style[data-style="seipro-folha-editor"]') &&
        (i.doc.body as unknown as HTMLElement).getAttribute("style")?.includes("rgb(1, 2, 3)"),
    ),
  );

  // modo escuro
  guardado.set("darkModePro", "1");
  g.aplicarFolhaEditorPro(true);
  checar(
    "modo escuro usa a mesa escura",
    doc.querySelector('style[data-style="seipro-folha-editor"]')?.textContent?.includes("#141619") === true,
  );
  g.aplicarFolhaEditorPro(false);

  // boot: reaplica o estado salvo e liga o reaplicador do CK4 uma unica vez
  const ck4 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html: "<p>x</p>" }] });
  armazem(ck4.win).set("spro_editor_folha", "1");
  const aoReady: unknown[] = [];
  (ck4.win as unknown as { CKEDITOR: Record<string, unknown> }).CKEDITOR.on = (ev: string, fn: unknown) => {
    if (ev === "instanceReady") aoReady.push(fn);
  };
  const gc = folha.globais(ctxDe(ck4)) as Record<string, Fn>;
  gc.initFolhaEditorPro();
  gc.initFolhaEditorPro();
  igual(
    "initFolhaEditorPro: estado salvo reaplicado e o instanceReady ligado uma unica vez",
    [ck4.doc.documentElement.hasAttribute("data-spro-folha-editor"), aoReady.length],
    [true, 1],
  );
}
