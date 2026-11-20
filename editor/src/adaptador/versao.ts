import type { Versao } from "./tipos";

/**
 * Versao do editor presente na pagina, ou 0 enquanto indeterminado.
 *
 * No SEI 5 o CKEditor 5 TAMBEM se chama `window.CKEDITOR` (existe e responde `CKEDITOR.version`),
 * entao a global nao distingue as versoes: perguntar antes de o CK5 montar dava 4 e congelava a
 * resposta errada. O discriminante seguro e `CKEDITOR.instances`, que so o CK4 tem; sem ele e sem o
 * DOM do CK5, a resposta e "ainda nao sei".
 */
export function detectarVersao(win: Window): Versao | 0 {
  if (win.document.querySelector(".ck-editor__editable")) return 5;
  const ck = (win as Window & { CKEDITOR?: { instances?: unknown } }).CKEDITOR;
  if (ck?.instances) return 4;
  return 0;
}
