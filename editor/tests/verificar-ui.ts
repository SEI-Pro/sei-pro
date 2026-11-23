import { mostrarAviso } from "@comum/ui/aviso";
import { h } from "@comum/ui/dom";
import { definirCssBase } from "../src/ui/abrir";
import { avisarEditor } from "../src/ui/avisar";
import { criarAbridorDeDialogo } from "../src/ui/dialogo";
import { textoAleatorio } from "../src/util/aleatorio";
import { checar, igual, instalarDom, secao } from "./util";

type Proto = Record<string, unknown>;

/** `<dialog>` do navegador: o linkedom nao tem showModal/close/open. */
function fingirDialogos(doc: Document): void {
  const proto = Object.getPrototypeOf(doc.createElement("dialog")) as Proto;
  const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
  proto.showModal = function (this: HTMLElement) {
    this.setAttribute("open", "");
  };
  proto.close = function (this: HTMLElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Ev("close"));
  };
  Object.defineProperty(proto, "open", {
    configurable: true,
    get(this: HTMLElement) {
      return this.hasAttribute("open");
    },
  });
}

export function verificarUi(): void {
  secao("ui: dialogo, aviso e aleatorio");
  const doc = instalarDom();
  fingirDialogos(doc);
  const abrir = criarAbridorDeDialogo(".spro-dialogo{color:red}");

  let fechou = 0;
  const hostil = '<img src=x onerror="alert(1)">';
  const m = abrir(doc, { titulo: "Titulo", conteudo: h("div", {}, hostil), aoFechar: () => fechou++ });
  const dlg = doc.querySelector("dialog.spro-dialogo") as HTMLElement;
  checar("abre um <dialog> com o titulo", dlg?.querySelector("h2")?.textContent === "Titulo");
  checar("conteudo hostil entra como texto, sem virar elemento", !dlg.querySelector("img") && dlg.textContent?.includes(hostil));
  igual("injeta um unico <style data-seipro-editor=base>", doc.querySelectorAll('style[data-seipro-editor="base"]').length, 1);

  const m2 = abrir(doc, { titulo: "Outro", conteudo: h("div", {}, "x") });
  igual("segundo dialogo nao injeta o estilo de novo", doc.querySelectorAll('style[data-seipro-editor="base"]').length, 1);
  m2.fechar();

  // Tema: sem `data-tema` o CSS base segue o modo escuro do SISTEMA; o dialogo tem de seguir o Estilo Avancado.
  igual("tema claro por padrao: html data-tema=claro", doc.documentElement.getAttribute("data-tema"), "claro");
  doc.documentElement.setAttribute("data-spro-tema", "escuro");
  abrir(doc, { titulo: "Escuro", conteudo: h("div", {}, "x") }).fechar();
  igual("Estilo Avancado escuro: html data-tema=escuro", doc.documentElement.getAttribute("data-tema"), "escuro");
  doc.documentElement.setAttribute("data-spro-tema", "claro");
  abrir(doc, { titulo: "Claro", conteudo: h("div", {}, "x") }).fechar();
  igual("volta ao claro quando o tema muda", doc.documentElement.getAttribute("data-tema"), "claro");
  doc.documentElement.removeAttribute("data-spro-tema");

  const rotulos = [...dlg.querySelectorAll("button")].map((b) => (b.textContent ?? "").trim() || b.getAttribute("aria-label"));
  checar("nao ha botao Cancelar", !rotulos.some((r) => /cancelar/i.test(String(r))));
  checar("ha o X (Fechar)", rotulos.includes("Fechar"));
  (dlg.querySelector('button[aria-label="Fechar"]') as HTMLElement).dispatchEvent(
    new (doc.defaultView as unknown as { Event: typeof Event }).Event("click", { bubbles: true }),
  );
  igual(
    "o X fecha e chama aoFechar uma vez",
    [fechou, doc.querySelector("dialog.spro-dialogo")?.textContent?.includes("Titulo") ?? false],
    [1, false],
  );
  m.fechar();
  igual("fechar de novo nao chama aoFechar outra vez", fechou, 1);

  const av = mostrarAviso(doc, "<b>oi</b>", undefined, 50);
  checar("aviso mostra o texto como texto", av.textContent?.includes("<b>oi</b>") === true && !av.querySelector("b"));

  // aviso sem nenhum dialogo aberto: tambem leva o CSS base (uma vez, sem duplicar com o dialogo)
  definirCssBase(".spro-aviso{color:blue}");
  const limpa = instalarDom();
  fingirDialogos(limpa);
  avisarEditor(limpa, "oi");
  igual(
    "avisarEditor sem dialogo injeta um <style data-seipro-editor=base> com o CSS",
    [
      limpa.querySelectorAll('style[data-seipro-editor="base"]').length,
      limpa.querySelector('style[data-seipro-editor="base"]')?.textContent,
    ],
    [1, ".spro-aviso{color:blue}"],
  );
  avisarEditor(limpa, "de novo");
  igual("avisar de novo nao duplica o estilo", limpa.querySelectorAll('style[data-seipro-editor="base"]').length, 1);
  definirCssBase("");

  const a = textoAleatorio(16);
  checar("textoAleatorio(16): 16 caracteres do alfabeto", /^[0-9a-zA-Z]{16}$/.test(a));
  checar("duas chamadas diferem", a !== textoAleatorio(16));
  igual("textoAleatorio(0) e vazio", textoAleatorio(0), "");
}
