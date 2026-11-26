import type { PastaExibida } from "../src/arvore/mesclar";
import { criarDialogos, elementoAtivoProfundo, pastaDoSelect, proximoFoco } from "../src/ui/dialogos";
import { checar, docDe, teste } from "./util";

const CSS = ".overlay{position:fixed}";

const pasta = (id: string, nome: string, pai: string | null = null, filhas: PastaExibida[] = []): PastaExibida => ({
  id,
  nome,
  pai,
  ordem: "a0",
  filhas,
  contagem: 0,
});

function montar() {
  const doc = docDe('<html><body><button id="origem">origem</button></body></html>');
  const d = criarDialogos({ doc, css: CSS });
  return { doc, d, sombra: (d as unknown as { host: HTMLElement }).host?.shadowRoot as unknown as DocumentFragment | undefined };
}

// criarDialogos não expõe o host; os testes acham pelo seletor no documento.
function sombraDe(doc: Document): DocumentFragment {
  const host = doc.querySelector(".spro-bc-dialogos") as HTMLElement | null;
  return host?.shadowRoot as unknown as DocumentFragment;
}

function tecla(el: Element, key: string, extra: Record<string, unknown> = {}): void {
  const view = el.ownerDocument.defaultView as unknown as { Event: typeof Event };
  const ev = new view.Event("keydown", { bubbles: true });
  Object.assign(ev, { key, ...extra });
  el.dispatchEvent(ev);
}

await teste("pedirTexto abre dialogo acessivel, preenche e devolve o valor", async () => {
  const { doc, d } = montar();
  const promessa = d.pedirTexto("Nome da pasta", "Inicial");
  const s = sombraDe(doc);
  const dialogo = s.querySelector('[role="dialog"][aria-modal="true"]');
  checar("dialogo aberto", dialogo !== null);
  const rotuloId = dialogo?.getAttribute("aria-labelledby") ?? "";
  checar("aria-labelledby aponta para o titulo", rotuloId !== "" && s.querySelector(`#${rotuloId}`)?.textContent === "Nome da pasta");
  const input = s.querySelector("input") as HTMLInputElement;
  const label = s.querySelector(`label[for="${input.id}"]`);
  checar("input rotulado", label !== null);
  checar("valor inicial", input.value === "Inicial");
  input.value = "Nova";
  const ok = [...s.querySelectorAll("button")].find((b) => b.textContent === "OK") as HTMLElement;
  ok.click();
  checar("resolve com o valor", (await promessa) === "Nova");
  checar("overlay escondido", (s.querySelector(".overlay") as HTMLElement).hidden === true);
});

await teste("pedirTexto cancela com Escape e com o X", async () => {
  const { doc, d } = montar();
  const p1 = d.pedirTexto("Nome", "");
  const s = sombraDe(doc);
  tecla(s.querySelector('[role="dialog"]') as Element, "Escape");
  checar("escape devolve null", (await p1) === null);
  const p2 = d.pedirTexto("Nome", "");
  const fechar = s.querySelector('[aria-label="Fechar"]') as HTMLElement;
  checar("botao fechar existe", fechar !== null);
  fechar.click();
  checar("x devolve null", (await p2) === null);
});

await teste("confirmar devolve true/false", async () => {
  const { doc, d } = montar();
  const p = d.confirmar("Excluir?");
  const s = sombraDe(doc);
  checar("mensagem", s.querySelector(".mensagem")?.textContent === "Excluir?");
  const ok = [...s.querySelectorAll("button")].find((b) => b.textContent === "Confirmar") as HTMLElement;
  ok.click();
  checar("confirmou", (await p) === true);
  const p2 = d.confirmar("Excluir?");
  const cancelar = [...s.querySelectorAll("button")].find((b) => b.textContent === "Cancelar") as HTMLElement;
  cancelar.click();
  checar("cancelou", (await p2) === false);
});

await teste("escolherPasta lista caminhos e devolve a pasta escolhida", async () => {
  const { doc, d } = montar();
  const pastas = [pasta("p1", "Fiscalizacao", null, [pasta("p2", "Notas", "p1")])];
  const p = d.escolherPasta(pastas, "p2");
  const s = sombraDe(doc);
  const select = s.querySelector("select") as HTMLSelectElement;
  checar("select existe", select !== null);
  const textos = [...select.options].map((o) => (o.textContent ?? "").trim());
  checar("Sem pasta", textos[0] === "Sem pasta");
  checar("caminho da raiz", textos[1] === "Fiscalizacao");
  checar("caminho da subpasta", textos[2] === "Fiscalizacao › Notas");
  checar("atual marcada", (select.querySelector("option[selected]") as HTMLOptionElement)?.value === "p2");
  for (const o of select.querySelectorAll("option")) {
    if (o.getAttribute("value") === "p1") o.setAttribute("selected", "");
    else o.removeAttribute("selected");
  }
  const mover = [...s.querySelectorAll("button")].find((b) => b.textContent === "Mover") as HTMLElement;
  mover.click();
  checar("escolheu p1", JSON.stringify(await p) === JSON.stringify({ pasta: "p1" }));
});

await teste("escolherPasta com numerar mostra os caminhos numerados", async () => {
  const { doc, d } = montar();
  const pastas = [pasta("p1", "Fiscalizacao", null, [pasta("p2", "Notas", "p1")])];
  const p = d.escolherPasta(pastas, "p2", true);
  const s = sombraDe(doc);
  const select = s.querySelector("select") as HTMLSelectElement;
  const textos = [...select.options].map((o) => (o.textContent ?? "").trim());
  checar("raiz numerada", textos[1] === "1. Fiscalizacao");
  checar("subpasta numerada", textos[2] === "1. Fiscalizacao › 1.1. Notas");
  const cancelar = [...s.querySelectorAll("button")].find((b) => b.textContent === "Cancelar") as HTMLElement;
  cancelar.click();
  checar("cancelou", (await p) === null);
});

await teste("perguntar usa os rotulos pedidos", async () => {
  const { doc, d } = montar();
  const p = d.perguntar("Aceita?", "Entendi", "Agora não");
  const s = sombraDe(doc);
  const ok = [...s.querySelectorAll("button")].find((b) => b.textContent === "Entendi") as HTMLElement;
  const nao = [...s.querySelectorAll("button")].find((b) => b.textContent === "Agora não") as HTMLElement;
  checar("rotulos pedidos", ok !== undefined && nao !== undefined);
  ok.click();
  checar("confirmou", (await p) === true);
});

await teste("destruir remove o host", () => {
  const { doc, d } = montar();
  d.destruir();
  checar("host removido", doc.querySelector(".spro-bc-dialogos") === null);
});

await teste("pastaDoSelect le o valor vivo, nao o atributo", () => {
  checar("pasta", JSON.stringify(pastaDoSelect({ value: "p1" } as HTMLSelectElement)) === JSON.stringify({ pasta: "p1" }));
  checar("sem pasta", JSON.stringify(pastaDoSelect({ value: "" } as HTMLSelectElement)) === JSON.stringify({ pasta: null }));
});

await teste("elementoAtivoProfundo desce pelos shadow roots", () => {
  const botao = { id: "botao" } as unknown as HTMLElement;
  const hostInterno = { shadowRoot: { activeElement: botao } } as unknown as HTMLElement;
  const hostExterno = { shadowRoot: { activeElement: hostInterno } } as unknown as HTMLElement;
  checar("um nivel", elementoAtivoProfundo({ activeElement: hostInterno } as unknown as Document) === botao);
  checar("dois niveis", elementoAtivoProfundo({ activeElement: hostExterno } as unknown as Document) === botao);
  checar("sem shadow", elementoAtivoProfundo({ activeElement: botao } as unknown as Document) === botao);
});

await teste("proximoFoco cicla o Tab no modal", () => {
  const a = { id: "a" } as HTMLElement;
  const b = { id: "b" } as HTMLElement;
  const c = { id: "c" } as HTMLElement;
  checar("ultimo -> primeiro", proximoFoco([a, b, c], c, false) === a);
  checar("primeiro -> ultimo (shift)", proximoFoco([a, b, c], a, true) === c);
  checar("meio deixa seguir", proximoFoco([a, b, c], b, false) === null);
  checar("sem atual vai ao primeiro", proximoFoco([a, b, c], null, false) === a);
  checar("sem atual shift vai ao ultimo", proximoFoco([a, b, c], null, true) === c);
  checar("vazio", proximoFoco([], null, false) === null);
});
