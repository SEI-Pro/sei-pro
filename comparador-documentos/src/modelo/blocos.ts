/**
 * Leitura de um documento do SEI em blocos folha, na página (`DOMParser` é nativo e linear; o Worker não tem DOM).
 *
 * Folha = elemento de bloco sem outro bloco dentro (p, li, h1-h6, td, th, div sem filhos de bloco...). Texto solto
 * entre blocos vira uma folha sintética (`<span data-spro-solto>`). Quem compara só vê `Bloco`; quem monta o
 * resultado usa `folhas[i]`, o elemento de `blocos[i]`, para pôr o diff no lugar certo do documento "depois".
 */

/** O que o Worker recebe de cada bloco. */
export interface Bloco {
  /** Conteúdo (innerHTML) da folha, já sem `on*` nem `javascript:`. */
  html: string;
  /** Texto normalizado (espaços colapsados, entidades decodificadas); imagem conta por `[img:<src>]`. */
  texto: string;
  /** Tag da folha (minúscula; "span" para texto solto): o resultado usa para montar blocos removidos. */
  tag: string;
}

export interface DocumentoBlocos {
  corpo: Element;
  /** `folhas[i]` é o elemento de `blocos[i]`. */
  folhas: Element[];
  blocos: Bloco[];
}

const SELETOR_BLOCO = "p,div,li,h1,h2,h3,h4,h5,h6,td,th,blockquote,pre,caption";
const DESCARTAR = "script,style,link,meta,noscript,title";
const ATRIBUTOS_URL = ["href", "src", "action", "formaction", "xlink:href"];

const ELEMENTO = 1;
const TEXTO = 3;
const COMENTARIO = 8;

const ehBloco = (el: Element): boolean => el.matches(SELETOR_BLOCO);
const temBlocoDentro = (el: Element): boolean => el.querySelector(SELETOR_BLOCO) !== null;
const colapsar = (s: string): string => s.replace(/\s+/g, " ").trim();

function tirarComentarios(no: Node): void {
  for (const filho of Array.from(no.childNodes)) {
    if (filho.nodeType === COMENTARIO) no.removeChild(filho);
    else if (filho.nodeType === ELEMENTO) tirarComentarios(filho);
  }
}

/** Remove `on*` e URLs `javascript:` de todo o corpo (uma passada). */
function higienizar(corpo: Element): void {
  for (const el of Array.from(corpo.querySelectorAll("*"))) {
    for (const nome of el.getAttributeNames()) {
      if (/^on/i.test(nome)) el.removeAttribute(nome);
      else if (ATRIBUTOS_URL.includes(nome.toLowerCase()) && /^\s*javascript:/i.test(el.getAttribute(nome) ?? "")) el.removeAttribute(nome);
    }
  }
}

function textoDaFolha(el: Element): string {
  const texto = colapsar(el.textContent ?? "");
  if (texto) return texto;
  const imagens = Array.from(el.querySelectorAll("img")).map((i) => `[img:${i.getAttribute("src") ?? ""}]`);
  return imagens.join(" ");
}

/** Junta em uma folha sintética a corrida de nós soltos (texto e inline sem bloco dentro), se houver algo a comparar. */
function fecharCorrida(corrida: Node[], pai: Element, antes: Node | null, folhas: Element[]): void {
  if (!corrida.length) return;
  const doc = pai.ownerDocument;
  const solto = doc.createElement("span");
  solto.setAttribute("data-spro-solto", "1");
  pai.insertBefore(solto, antes);
  for (const no of corrida) solto.appendChild(no);
  if (textoDaFolha(solto)) folhas.push(solto);
  else {
    // Nada a comparar (só espaços): devolve os nós ao lugar e descarta o invólucro.
    for (const no of Array.from(solto.childNodes)) pai.insertBefore(no, solto);
    pai.removeChild(solto);
  }
}

function coletar(contenedor: Element, folhas: Element[]): void {
  let corrida: Node[] = [];
  for (const filho of Array.from(contenedor.childNodes)) {
    if (filho.nodeType === TEXTO) {
      corrida.push(filho);
      continue;
    }
    if (filho.nodeType !== ELEMENTO) continue;
    const el = filho as Element;
    const contemBloco = ehBloco(el) || temBlocoDentro(el);
    if (!contemBloco) {
      corrida.push(el);
      continue;
    }
    fecharCorrida(corrida, contenedor, el, folhas);
    corrida = [];
    if (ehBloco(el) && !temBlocoDentro(el)) {
      if (textoDaFolha(el)) folhas.push(el);
    } else coletar(el, folhas);
  }
  fecharCorrida(corrida, contenedor, null, folhas);
}

export function lerBlocos(html: string, parser: DOMParser = new DOMParser()): DocumentoBlocos {
  const doc = parser.parseFromString(html, "text/html");
  const corpo = doc.body ?? doc.documentElement;
  for (const el of Array.from(corpo.querySelectorAll(DESCARTAR))) el.remove();
  tirarComentarios(corpo);
  higienizar(corpo);
  const folhas: Element[] = [];
  coletar(corpo, folhas);
  const blocos = folhas.map((el): Bloco => ({ html: el.innerHTML, texto: textoDaFolha(el), tag: el.tagName.toLowerCase() }));
  return { corpo, folhas, blocos };
}
