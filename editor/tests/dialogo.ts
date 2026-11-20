/** Ferramentas dos testes de recursos com dialogo: o `<dialog>` modal e o `document` global que o `h()` usa. */

type Proto = Record<string, unknown>;

/** O linkedom nao tem showModal/close/open no `<dialog>`; instala o equivalente e devolve o `document` como global. */
export function usarDocumento(doc: Document): void {
  (globalThis as { document?: Document }).document = doc;
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

export const dialogoAberto = (doc: Document): HTMLElement | null => doc.querySelector("dialog.spro-dialogo[open]");

/** Clica o botao pelo texto (ou aria-label) dentro de `raiz`. */
export function clicar(raiz: ParentNode, texto: string): void {
  const b = [...raiz.querySelectorAll("button")].find(
    (x) => (x.textContent ?? "").trim() === texto || x.getAttribute("aria-label") === texto,
  );
  if (!b) throw new Error(`botao "${texto}" nao encontrado`);
  const Ev = (b.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  b.dispatchEvent(new Ev("click", { bubbles: true }));
}

/** Digita `valor` no campo e dispara `input`. */
export function digitar(campo: HTMLInputElement | HTMLTextAreaElement, valor: string): void {
  campo.value = valor;
  const Ev = (campo.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  campo.dispatchEvent(new Ev("input", { bubbles: true }));
}

export const tique = (ms = 5): Promise<void> => new Promise((r) => setTimeout(r, ms));
