/**
 * Higiene do HTML de um documento do SEI antes de ele ir para o iframe do resultado (que ainda é `sandbox` sem
 * scripts: esta é a primeira trava, não a única). Remove elementos que carregam conteúdo ativo, atributos de evento
 * e qualquer URL fora da lista de protocolos permitidos. Quem entra por URL só passa por lista de permissão.
 */

/** Elementos que nunca entram (com o conteúdo). `form` fica: só perde `action`/`formaction`. */
export const TAGS_DESCARTADAS = "script,style,link,meta,noscript,title,iframe,frame,frameset,object,embed,applet,base";

const ATRIBUTOS_URL = ["href", "src", "action", "formaction", "xlink:href", "poster", "background", "data", "cite"];
const ATRIBUTOS_DESCARTADOS = ["srcdoc", "action", "formaction"];
const PROTOCOLOS = ["http:", "https:", "mailto:", "tel:"];

/**
 * A URL pode ser aceita neste atributo? Normaliza como o navegador (tira controles e espaços, ignora maiúsculas)
 * e só deixa passar relativa, âncora, protocolo da lista e, em `src`, imagem em `data:` (menos SVG, que pode ter script).
 */
export function urlSegura(atributo: string, valor: string): boolean {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: o navegador ignora estes caracteres no esquema.
  const v = valor.replace(/[\u0000- \u007f-\u009f]/g, "").toLowerCase();
  const esquema = /^([a-z][a-z0-9+.-]*):/.exec(v);
  if (!esquema) return true;
  if (PROTOCOLOS.includes(`${esquema[1]}:`)) return true;
  if (esquema[1] === "data") return atributo.toLowerCase() === "src" && /^data:image\/(png|jpe?g|gif|webp|bmp);/.test(v);
  return false;
}

/** Aplica a higiene ao corpo todo, em uma passada. */
export function higienizar(corpo: Element): void {
  for (const el of Array.from(corpo.querySelectorAll(TAGS_DESCARTADAS))) el.remove();
  for (const el of Array.from(corpo.querySelectorAll("*"))) {
    for (const nome of el.getAttributeNames()) {
      const n = nome.toLowerCase();
      if (n.startsWith("on") || ATRIBUTOS_DESCARTADOS.includes(n)) el.removeAttribute(nome);
      else if (ATRIBUTOS_URL.includes(n) && !urlSegura(n, el.getAttribute(nome) ?? "")) el.removeAttribute(nome);
    }
  }
}
