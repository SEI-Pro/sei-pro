import { h, icone } from "./dom";

/** Copia o texto para a area de transferencia: API assincrona e, sem ela, textarea temporaria + execCommand. */
export async function copiarTexto(doc: Document, texto: string): Promise<boolean> {
  const nav = doc.defaultView?.navigator?.clipboard ? doc.defaultView.navigator : globalThis.navigator;
  try {
    if (nav?.clipboard?.writeText) {
      await nav.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // cai no caminho antigo
  }
  try {
    const t = h("textarea", { readonly: true, "aria-hidden": "true", style: "position:fixed;top:0;left:-9999px;opacity:0" });
    t.value = texto;
    doc.body.append(t);
    t.select();
    const ok = doc.execCommand("copy");
    t.remove();
    return ok;
  } catch {
    return false;
  }
}

export interface OpcoesAcoesNumero {
  /** Numero que a linha mostra (e que sera copiado). */
  protocolo: string;
  doc: Document;
  /**
   * Abrir em nova aba sem link proprio: o modulo abre pelo mecanismo que ja usa (ponte abrirProcesso).
   * Se `href` existir, o botao vira um link `target=_blank` e este callback nao e usado.
   */
  aoAbrirNovaAba?: () => void;
  /** Link ja assinado da linha (grade do Controle). Nunca montado a mao. */
  href?: string | null;
  /** Como copiar; padrao: clipboard do documento com fallback. */
  copiar?: (texto: string) => Promise<boolean>;
  /** 20 px em vez de 22 px (listas mais densas). */
  compacto?: boolean;
}

const MS_FEEDBACK = 1500;

/**
 * Os dois botoes ao lado do numero do processo: "Abrir em nova aba" e "Copiar numero do processo".
 * Aparecem no hover/foco da linha (CSS em acoesNumeroProcesso.css) e reservam o espaco desde o inicio.
 * Nenhum clique (nem Enter/Espaco) sobe para a linha. Devolve um fragmento: o chamador decide onde ancorar.
 */
export function acoesDoNumero(o: OpcoesAcoesNumero): DocumentFragment {
  const tam = 14;
  const classe = (base: string) => `${base}${o.compacto ? " spro-acao-num-compacta" : ""}`;
  const rotuloAbrir = `Abrir ${o.protocolo} em nova aba`;

  let abrir: HTMLElement;
  if (o.href) {
    abrir = h(
      "a",
      { class: classe("spro-nova-guia"), href: o.href, target: "_blank", rel: "noopener", "aria-label": rotuloAbrir },
      icone("novaAba", tam),
    );
    abrir.addEventListener("click", (ev) => ev.stopPropagation());
  } else {
    abrir = h("button", { type: "button", class: classe("spro-nova-guia"), "aria-label": rotuloAbrir }, icone("novaAba", tam));
    abrir.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      o.aoAbrirNovaAba?.();
    });
  }
  abrir.addEventListener("keydown", (ev) => ev.stopPropagation());

  const copiar = o.copiar ?? ((t: string) => copiarTexto(o.doc, t));
  const aviso = h("span", { class: "spro-sr", role: "status", "aria-live": "polite" });
  const botao = h(
    "button",
    { type: "button", class: classe("spro-copiar-num"), "aria-label": "Copiar número do processo" },
    icone("copiar", tam),
    aviso,
  );
  let timer: ReturnType<typeof setTimeout> | undefined;
  const desenhar = (copiado: boolean) => {
    botao.classList.toggle("spro-copiado", copiado);
    botao.querySelector("svg")?.replaceWith(icone(copiado ? "check" : "copiar", tam));
  };
  botao.addEventListener("keydown", (ev) => ev.stopPropagation());
  botao.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    void copiar(o.protocolo).then((ok) => {
      aviso.textContent = ok ? "Número copiado" : "Não foi possível copiar";
      if (!ok) return;
      desenhar(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        desenhar(false);
        aviso.textContent = "";
      }, MS_FEEDBACK);
    });
  });

  const frag = o.doc.createDocumentFragment();
  frag.append(abrir, botao);
  return frag;
}
