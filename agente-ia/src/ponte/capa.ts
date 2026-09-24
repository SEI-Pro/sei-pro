/**
 * O que o Estúdio de Fluxo desenha DENTRO da página do SEI: o cartão na capa do
 * processo e o aviso no ícone do Agente de IA.
 *
 * Roda no content script (mundo isolado), que alcança o DOM da página e os
 * iframes de mesma origem. Nada de `innerHTML` com texto de fora: nome de
 * fluxo e título de documento entram como nó de texto.
 *
 * O estilo vai INLINE, e a animação por uma folha própria injetada uma vez: a
 * página do SEI não conhece o CSS da extensão, e uma classe nova exigiria mexer
 * no CSS de doze empacotamentos.
 *
 * ARMADILHA que governa este arquivo: o legado redesenha a capa e os ícones da
 * barra a cada 1,5 s (o iframe da visualização recarrega e os apaga), levando o
 * que pusermos junto. Quem chama precisa reaplicar — ver `aba.ts`.
 */

import type { CartaoDaCapa } from "../fluxos/cartao";

const MARCA_AVISO = "spro-aviso-fluxo";
const MARCA_CARTAO = "spro-cartao-fluxo";
const MARCA_ESTILO = "spro-estilo-fluxo";
const AVISO_NO_TITULO = " — há uma sugestão de fluxo para este processo";

/**
 * Documentos alcançáveis: a página e os iframes de mesma origem, até três
 * níveis. No SEI 5 o visualizador é um iframe só; no SEI 4.1 o `ifrVisualizacao`
 * fica ANINHADO dentro do `ifrConteudoVisualizacao`, e a capa pode estar num
 * terceiro nível abaixo dele.
 */
function documentos(raiz: Document, nivel = 3): Document[] {
  const achados = [raiz];
  if (nivel <= 0) return achados;
  for (const f of raiz.querySelectorAll("iframe")) {
    let dentro: Document | null = null;
    try {
      dentro = (f as HTMLIFrameElement).contentDocument;
    } catch {
      /* outra origem: não interessa */
    }
    if (dentro?.documentElement) achados.push(...documentos(dentro, nivel - 1));
  }
  return achados;
}

/** A folha com a animação da bolinha, uma vez por documento. */
function garantirEstilo(doc: Document): void {
  if (doc.getElementById(MARCA_ESTILO)) return;
  const st = doc.createElement("style");
  st.id = MARCA_ESTILO;
  st.textContent = `@keyframes sproPulsaFluxo{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.35);opacity:.55}}
.${MARCA_AVISO}{animation:sproPulsaFluxo 1.2s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.${MARCA_AVISO}{animation:none}}`;
  (doc.head ?? doc.documentElement).append(st);
}

/**
 * Bolinha piscante no canto superior direito do ícone do Agente de IA.
 *
 * `pointer-events:none` para não engolir o clique do ícone — e por isso o
 * tooltip que explica a bolinha vai no ÍCONE, não nela: um `title` em elemento
 * sem eventos de ponteiro nunca apareceria. O título original é guardado e
 * devolvido quando o aviso sai.
 */
export function marcarAvisoDeFluxo(raiz: Document, tem: boolean): void {
  for (const doc of documentos(raiz)) {
    let alvos: Element[] = [];
    try {
      alvos = [...doc.querySelectorAll(".iconPro_agenteia, #iconAIActions")];
    } catch {
      continue;
    }
    if (tem && alvos.length) garantirEstilo(doc);
    for (const alvo of alvos) {
      const el = alvo as HTMLElement;
      const antigo = el.querySelector(`.${MARCA_AVISO}`);
      if (!tem) {
        antigo?.remove();
        if (el.dataset?.sproTituloAntes !== undefined) {
          el.title = el.dataset.sproTituloAntes;
          delete el.dataset.sproTituloAntes;
        }
        if (el.dataset?.sproPosicaoPosta !== undefined) {
          el.style.position = "";
          delete el.dataset.sproPosicaoPosta;
        }
        continue;
      }
      if (antigo) continue;
      const ponto = doc.createElement("span");
      ponto.className = MARCA_AVISO;
      ponto.setAttribute("aria-hidden", "true");
      ponto.setAttribute(
        "style",
        "position:absolute;top:1px;right:1px;width:9px;height:9px;border-radius:50%;background:#e8710a;box-shadow:0 0 0 2px rgba(255,255,255,.95),0 0 5px rgba(232,113,10,.8);pointer-events:none;z-index:5;",
      );
      if (el.dataset && el.dataset.sproTituloAntes === undefined) {
        el.dataset.sproTituloAntes = el.title ?? "";
        el.title = `${el.title ?? ""}${AVISO_NO_TITULO}`;
      }
      // O ícone precisa ser a referência do posicionamento, ou a bolinha vai
      // parar no canto da barra inteira.
      if (el.style && doc.defaultView?.getComputedStyle(el).position === "static") {
        el.style.position = "relative";
        if (el.dataset) el.dataset.sproPosicaoPosta = "1";
      }
      el.append(ponto);
    }
  }
}

/** O que os botões do cartão da capa pedem ao content script. */
export interface AcoesDaCapa {
  abrirAgente: () => void;
  ignorar: () => void;
}

/**
 * Cartão de sugestão no alto da capa do processo (`#capaProcessoPro`, desenhada
 * pelo legado). `null` remove.
 */
export function mostrarCartaoNaCapa(raiz: Document, cartao: CartaoDaCapa | null, acoes?: AcoesDaCapa): void {
  for (const doc of documentos(raiz)) {
    let capa: HTMLElement | null = null;
    try {
      capa = doc.querySelector<HTMLElement>("#capaProcessoPro");
    } catch {
      continue;
    }
    if (!capa) continue;
    doc.getElementById(MARCA_CARTAO)?.remove();
    if (!cartao) continue;

    const el = doc.createElement("div");
    el.id = MARCA_CARTAO;
    el.setAttribute("role", "status");
    el.setAttribute(
      "style",
      "clear:both;margin:0 0 14px;padding:12px 14px;border:1px solid #e8710a;border-left-width:4px;border-radius:10px;background:#fff8ef;color:#1a1e27;font-size:12.5px;line-height:1.45;",
    );
    const titulo = doc.createElement("div");
    titulo.setAttribute("style", "font-weight:700;margin-bottom:5px;color:#96600a;");
    titulo.append(doc.createTextNode(cartao.titulo));
    const texto = doc.createElement("div");
    texto.append(doc.createTextNode(cartao.texto));
    const lista = doc.createElement("ul");
    lista.setAttribute("style", "margin:8px 0 0;padding-left:20px;color:#596072;");
    for (const linha of cartao.etapas) {
      const li = doc.createElement("li");
      li.append(doc.createTextNode(linha));
      lista.append(li);
    }
    const acoesEl = doc.createElement("div");
    acoesEl.setAttribute("style", "display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;");
    const botao = (rotulo: string, primario: boolean, aoClicar?: () => void) => {
      const b = doc.createElement("button");
      b.type = "button";
      b.append(doc.createTextNode(rotulo));
      b.setAttribute(
        "style",
        `font:inherit;cursor:pointer;padding:6px 12px;border-radius:8px;border:1px solid ${primario ? "transparent" : "#ccd2dd"};background:${primario ? "#3367d6" : "#fff"};color:${primario ? "#fff" : "#596072"};`,
      );
      if (aoClicar) b.addEventListener("click", aoClicar);
      acoesEl.append(b);
    };
    botao(cartao.acaoPrincipal, true, acoes?.abrirAgente);
    botao(cartao.acaoIgnorar, false, acoes?.ignorar);

    el.append(titulo, texto, lista, acoesEl);
    capa.prepend(el);
  }
}
