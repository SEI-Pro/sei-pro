import { areaMemoria } from "../src/armazenamento/area";
import {
  type AlturaRedimensionavel,
  alturaRedimensionavel,
  comAlturaRedimensionavel,
  normalizarAltura,
  TETO_AUTO_PX,
} from "../src/ui/alturaRedimensionavel";
import { checar, disparar, instalarDom, secao, tique } from "./util";

const CONTEUDO = 1000;

/** Simula o layout: a area mede o menor entre o conteudo e a altura maxima da variavel CSS. */
function simular(rolagem: HTMLElement): void {
  rolagem.getBoundingClientRect = (() => {
    const v = rolagem.style.getPropertyValue("--spro-altura-max") || "480px";
    const max = Number.parseFloat(v);
    return { height: Math.min(CONTEUDO, max) } as DOMRect;
  }) as typeof rolagem.getBoundingClientRect;
}

function ponteiro(el: Element, tipo: string, y: number, extra: Record<string, unknown> = {}): void {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  const ev = new Ev(tipo, { bubbles: true, cancelable: true });
  Object.assign(ev, { clientY: y, pointerId: 1, button: 0 }, extra);
  el.dispatchEvent(ev);
}

function tecla(el: Element, key: string, extra: Record<string, unknown> = {}): { padrao: boolean; subiu: boolean } {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  const ev = new Ev("keydown", { bubbles: true, cancelable: true });
  Object.assign(ev, { key }, extra);
  let subiu = false;
  el.parentElement?.addEventListener(
    "keydown",
    () => {
      subiu = true;
    },
    { once: true },
  );
  el.dispatchEvent(ev);
  return { padrao: ev.defaultPrevented, subiu };
}

const maxPx = (r: HTMLElement) => r.style.getPropertyValue("--spro-altura-max");

function montar(opts: Partial<Parameters<typeof alturaRedimensionavel>[0]> = {}) {
  const doc = document;
  const rolagem = doc.createElement("div");
  doc.body.append(rolagem);
  simular(rolagem);
  const mudancas: string[] = [];
  const c = alturaRedimensionavel({
    rolagem,
    chave: "teste",
    padraoPx: 400,
    area: areaMemoria(),
    aoMudar: (e) => void mudancas.push(e.auto ? "auto" : String(e.px)),
    ...opts,
  });
  rolagem.after(c.alca);
  return { rolagem, c, mudancas };
}

export async function verificarAltura(): Promise<void> {
  instalarDom();

  secao("alturaRedimensionavel: estrutura e acessibilidade");
  {
    const { rolagem, c } = montar();
    const a = c.alca;
    checar("a area ganha a classe e o padrao em px", rolagem.classList.contains("spro-altura-rolagem") && maxPx(rolagem) === "400px");
    checar("data-altura limitada", rolagem.getAttribute("data-altura") === "limitada" && a.getAttribute("data-altura") === "limitada");
    checar("role=separator horizontal", a.getAttribute("role") === "separator" && a.getAttribute("aria-orientation") === "horizontal");
    checar("focavel por teclado", a.getAttribute("tabindex") === "0");
    checar(
      "aria-valuemin/max/now",
      a.getAttribute("aria-valuemin") === "120" &&
        a.getAttribute("aria-valuemax") === String(TETO_AUTO_PX) &&
        a.getAttribute("aria-valuenow") === "400",
    );
    checar("aria-controls aponta a area", a.getAttribute("aria-controls") === rolagem.id && rolagem.id !== "");
    checar("a alca fica logo depois da area", rolagem.nextElementSibling === a);
    checar("rotulo acessivel", (a.getAttribute("aria-label") ?? "").length > 5);
  }
  {
    const { rolagem, c } = montar({ padraoVh: 68, padraoPx: undefined });
    checar("padrao em vh", maxPx(rolagem) === "68vh");
    c.destruir();
  }

  secao("alturaRedimensionavel: arrastar com pointer events");
  {
    const { rolagem, c, mudancas } = montar();
    const a = c.alca;
    ponteiro(a, "pointerdown", 500);
    checar("arrastando: classe na alca", a.classList.contains("spro-altura-arrastando"));
    ponteiro(a, "pointermove", 560);
    checar("descer 60 px: 460 px", maxPx(rolagem) === "460px", maxPx(rolagem));
    ponteiro(a, "pointermove", 450);
    checar("subir: 350 px", maxPx(rolagem) === "350px", maxPx(rolagem));
    ponteiro(a, "pointermove", -2000);
    checar("limite minimo", maxPx(rolagem) === "120px", maxPx(rolagem));
    ponteiro(a, "pointermove", 99999);
    checar("limite maximo (teto)", maxPx(rolagem) === `${TETO_AUTO_PX}px`, maxPx(rolagem));
    ponteiro(a, "pointermove", 600);
    ponteiro(a, "pointerup", 600);
    checar(
      "soltou: sem classe e valor final",
      !a.classList.contains("spro-altura-arrastando") && maxPx(rolagem) === "500px",
      maxPx(rolagem),
    );
    checar("aoMudar acompanhou o arrasto", mudancas.length >= 5 && mudancas[mudancas.length - 1] === "500", mudancas.join());
    ponteiro(a, "pointermove", 900);
    checar("movimento sem arrastar e ignorado", maxPx(rolagem) === "500px");
    ponteiro(a, "pointerdown", 0, { button: 2 });
    checar("botao secundario nao arrasta", !a.classList.contains("spro-altura-arrastando"));
    ponteiro(a, "pointerdown", 100);
    ponteiro(a, "pointercancel", 100);
    checar("pointercancel encerra", !a.classList.contains("spro-altura-arrastando"));
  }
  {
    // Conteudo menor que o maximo: o arrasto parte da altura REAL (a alca acompanha o ponteiro).
    const { rolagem, c } = montar({ padraoPx: 3000 });
    ponteiro(c.alca, "pointerdown", 0);
    ponteiro(c.alca, "pointermove", -100);
    checar("parte da altura renderizada (conteudo de 1000)", maxPx(rolagem) === "900px", maxPx(rolagem));
  }

  secao("alturaRedimensionavel: teclado");
  {
    const { rolagem, c } = montar();
    const a = c.alca;
    let r = tecla(a, "ArrowDown");
    checar("Baixo: +24 px", maxPx(rolagem) === "424px" && r.padrao, maxPx(rolagem));
    checar("a tecla nao sobe para os atalhos do painel", !r.subiu);
    tecla(a, "ArrowUp");
    tecla(a, "ArrowUp");
    checar("Cima x2: -48 px", maxPx(rolagem) === "376px", maxPx(rolagem));
    tecla(a, "ArrowDown", { shiftKey: true });
    checar("Shift+Baixo: +96 px", maxPx(rolagem) === "472px", maxPx(rolagem));
    tecla(a, "Home");
    checar("Home: minimo", maxPx(rolagem) === "120px");
    for (let i = 0; i < 3; i++) tecla(a, "ArrowUp", { shiftKey: true });
    checar("nunca abaixo do minimo", maxPx(rolagem) === "120px");
    r = tecla(a, "End");
    checar("End: ajusta ao conteudo", c.estado().auto && maxPx(rolagem) === `${TETO_AUTO_PX}px` && r.padrao);
    tecla(a, "Enter");
    checar("Enter volta ao limitado na ultima altura", !c.estado().auto && maxPx(rolagem) === "120px", maxPx(rolagem));
    tecla(a, " ");
    checar("Espaco alterna para auto", c.estado().auto);
    tecla(a, "ArrowUp");
    checar("seta sai do auto, a partir da altura renderizada", !c.estado().auto && maxPx(rolagem) === "976px", maxPx(rolagem));
    r = tecla(a, "a");
    checar("outras teclas passam", !r.padrao);
  }

  secao("alturaRedimensionavel: duplo clique e modo auto");
  {
    const { rolagem, c, mudancas } = montar();
    const a = c.alca;
    ponteiro(a, "pointerdown", 0);
    ponteiro(a, "pointermove", 100);
    ponteiro(a, "pointerup", 100);
    checar("antes: limitada em 500", maxPx(rolagem) === "500px");
    disparar(a, "dblclick");
    checar(
      "duplo clique: auto (ate o teto)",
      c.estado().auto && maxPx(rolagem) === `${TETO_AUTO_PX}px` && rolagem.getAttribute("data-altura") === "auto",
    );
    checar("aria-valuetext fala do conteudo", (a.getAttribute("aria-valuetext") ?? "").includes("conte"));
    checar("auto guarda a ultima altura escolhida", c.estado().px === 500);
    checar("aoMudar avisou o auto", mudancas[mudancas.length - 1] === "auto");
    disparar(a, "dblclick");
    checar("novo duplo clique: volta aos 500 px", !c.estado().auto && maxPx(rolagem) === "500px");
    disparar(a, "dblclick");
    ponteiro(a, "pointerdown", 0);
    ponteiro(a, "pointermove", -40);
    checar("arrastar sai do auto", !c.estado().auto && maxPx(rolagem) === "960px", maxPx(rolagem));
    ponteiro(a, "pointerup", -40);
    c.ajustarAoConteudo();
    checar("ajustarAoConteudo() equivale ao duplo clique", c.estado().auto);
    c.limitar(250);
    checar("limitar(px) volta ao modo limitado", !c.estado().auto && maxPx(rolagem) === "250px");
    c.limitar(10);
    checar("limitar respeita o minimo", maxPx(rolagem) === "120px");
  }

  secao("alturaRedimensionavel: persistencia");
  {
    const area = areaMemoria();
    const a1 = montar({ area, chave: "painel-x" });
    ponteiro(a1.c.alca, "pointerdown", 0);
    ponteiro(a1.c.alca, "pointermove", 120);
    ponteiro(a1.c.alca, "pointerup", 120);
    await tique();
    const gravado = (await area.obter("spro_altura:painel-x"))["spro_altura:painel-x"];
    checar("grava em spro_altura:<chave>", JSON.stringify(gravado) === JSON.stringify({ auto: false, px: 520 }), gravado);

    // O mesmo contexto (o painel redesenhou o corpo): a memoria entrega a altura na hora, sem piscar.
    const b = montar({ area, chave: "painel-x" });
    checar("redesenho: usa a memoria na hora", maxPx(b.rolagem) === "520px");

    // Recarregar a pagina: outra instancia de Area sobre os mesmos dados (a memoria do modulo e por Area).
    const recarregada = { ...area };
    const c2 = montar({ area: recarregada, chave: "painel-x" });
    checar("antes da leitura: padrao", maxPx(c2.rolagem) === "400px");
    await tique();
    checar("depois da leitura: a altura gravada", maxPx(c2.rolagem) === "520px", maxPx(c2.rolagem));
    checar("a leitura avisou o aoMudar", c2.mudancas[c2.mudancas.length - 1] === "520");

    // O modo auto tambem persiste.
    disparar(c2.c.alca, "dblclick");
    await tique();
    const c3 = montar({ area: { ...area }, chave: "painel-x" });
    await tique();
    checar("modo auto persiste", c3.c.estado().auto && maxPx(c3.rolagem) === `${TETO_AUTO_PX}px`);

    // A escolha do usuario antes da leitura terminar vale mais que o gravado.
    const lenta = {
      ...area,
      obter: async (k: unknown) => {
        await tique(15);
        return area.obter(k as string);
      },
    } as typeof area;
    const c4 = montar({ area: lenta, chave: "painel-x" });
    c4.c.limitar(300);
    await tique(40);
    checar("o gesto vence a leitura atrasada", maxPx(c4.rolagem) === "300px" && !c4.c.estado().auto);

    // Paineis diferentes nao se misturam.
    const outro = montar({ area: { ...area }, chave: "painel-y" });
    await tique();
    checar("outra chave nao herda", maxPx(outro.rolagem) === "400px");
  }
  {
    // Falha de armazenamento: silenciosa.
    const quebrada = {
      obter: async () => {
        throw new Error("sem acesso");
      },
      gravar: async () => {
        throw new Error("cota");
      },
      remover: async () => undefined,
      aoMudar: () => () => undefined,
    } as unknown as ReturnType<typeof areaMemoria>;
    const q = montar({ area: quebrada, chave: "q" });
    q.c.limitar(333);
    await tique();
    checar("armazenamento que falha nao quebra", maxPx(q.rolagem) === "333px");
    const sincrona = {
      ...quebrada,
      obter: () => {
        throw new Error("morreu");
      },
      gravar: () => {
        throw new Error("morreu");
      },
    } as unknown as ReturnType<typeof areaMemoria>;
    const s = montar({ area: sincrona, chave: "s" });
    s.c.ajustarAoConteudo();
    checar("excecao sincrona tambem", s.c.estado().auto);
    const sem = montar({ area: null, chave: "sem-area" });
    sem.c.limitar(200);
    checar("sem area: vale na pagina", maxPx(sem.rolagem) === "200px");
  }

  secao("alturaRedimensionavel: valores gravados estranhos");
  {
    checar("lixo vira o padrao", JSON.stringify(normalizarAltura("x")) === JSON.stringify({ auto: false, px: null }));
    checar("px fora da faixa e contido", normalizarAltura({ px: 5 }).px === 120 && normalizarAltura({ px: 1e9 }).px === TETO_AUTO_PX);
    checar("px nao numerico", normalizarAltura({ px: "400", auto: "sim" }).px === null && normalizarAltura({ auto: "sim" }).auto === false);
    const area = areaMemoria({ "spro_altura:suja": { px: Number.NaN, auto: 1 } });
    const m = montar({ area, chave: "suja" });
    await tique();
    checar("dado sujo no armazenamento nao quebra", !m.c.estado().auto && maxPx(m.rolagem) === "400px");
  }

  secao("alturaRedimensionavel: comAlturaRedimensionavel");
  {
    const rolagem = document.createElement("div");
    const { el, controle } = comAlturaRedimensionavel({ rolagem, chave: "env", area: null });
    checar(
      "envoltorio: area, depois a alca",
      el.classList.contains("spro-altura") && el.firstElementChild === rolagem && el.lastElementChild === controle.alca,
    );
    controle.destruir();
  }

  const _tipo: AlturaRedimensionavel | null = null;
  void _tipo;
}
