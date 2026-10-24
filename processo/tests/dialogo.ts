/** `<dialog>` do navegador: o linkedom não tem showModal/close/open (o protótipo é o de todo elemento). */
type Proto = Record<string, unknown>;

export function fingirDialogos(doc: Document): () => void {
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
  return () => {
    for (const k of ["showModal", "close", "open"]) Reflect.deleteProperty(proto, k);
  };
}
