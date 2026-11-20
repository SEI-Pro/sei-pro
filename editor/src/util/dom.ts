/** `jQuery.show()`: tira o `display:none` inline; se o CSS ainda esconder o elemento, usa `block`. */
export function mostrar(el: HTMLElement): void {
  el.style.display = "";
  if (el.ownerDocument.defaultView?.getComputedStyle?.(el)?.display === "none") el.style.display = "block";
}

/** `jQuery.hide()`. */
export function esconder(el: HTMLElement): void {
  el.style.display = "none";
}
