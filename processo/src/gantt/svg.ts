/**
 * O Gantt em SVG, sem biblioteca e sem `innerHTML`: uma raia por unidade, uma barra por passagem, um losango por
 * documento gerado, barra listrada para a passagem em curso. As cores são os tokens `--spro-*` (o tema escuro vem do
 * `data-tema` do diálogo); a forma (listra, pontilhado, tracejado) também distingue os estados, não só a cor.
 */
import type { DocumentoDaPassagem, Passagem } from "@nucleo/dominio/passagens";
import {
  agruparRaias,
  criarGeometria,
  type Dica,
  dicaDaPassagem,
  dicaDoDocumento,
  type Escala,
  eixoDoTempo,
  fimDaPassagem,
  formatarDataHora,
  formatarDuracao,
  type Geometria,
  rotuloAcessivelDaPassagem,
  situacaoDa,
  tituloDoDocumento,
} from "./modelo";

const NS = "http://www.w3.org/2000/svg";

export const LARGURA_ROTULOS = 150;
export const ALTURA_CABECALHO = 46;
export const ALTURA_RAIA = 50;
const BARRA_Y = 8;
const BARRA_H = 20;
const LOSANGO_Y = 38;
const LOSANGO_R = 6;
const MARGEM_DIREITA = 16;

export interface OpcoesGantt {
  /** O relógio de hoje, como as passagens (`relogioDe(new Date())`): desenha a linha “Agora” se houver passagem em curso. */
  agora?: Date;
  /** Mostra/oculta a dica própria (HTML, fora do SVG). Sem isto o gráfico só tem o `aria-label`. */
  dica?: { mostrar(d: Dica, alvo: Element): void; ocultar(): void };
  /** Clique (ou Enter/Espaço) num losango. */
  aoAbrirDocumento?: (d: DocumentoDaPassagem, p: Passagem) => void;
  /** Cabe tudo na largura (px) em vez de usar a escala: visão para impressão. Sem foco nem eventos. */
  larguraAlvo?: number;
}

let sequencia = 0;

function s<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
  ...filhos: Array<Node | string>
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  for (const f of filhos) el.append(f);
  return el;
}

const arredondar = (n: number): number => Math.round(n * 10) / 10;

/** O texto cabe em `max` caracteres; senão termina em reticências. */
export const abreviar = (texto: string, max: number): string => (texto.length > max ? `${texto.slice(0, Math.max(1, max - 1))}…` : texto);

export function montarGantt(passagens: readonly Passagem[], escala: Escala, o: OpcoesGantt = {}): SVGSVGElement {
  const id = `spro-g${++sequencia}`;
  const estatico = o.larguraAlvo !== undefined;
  const raias = agruparRaias(passagens);
  const base = criarGeometria(passagens, escala, { ...(o.agora ? { agora: o.agora } : {}) });
  const g: Geometria = estatico
    ? criarGeometria(passagens, escala, {
        pxPorDia: (o.larguraAlvo! - LARGURA_ROTULOS - MARGEM_DIREITA) / Math.max(1, (base.fim - base.origem) / 86_400_000),
        ...(o.agora ? { agora: o.agora } : {}),
      })
    : base;
  const largura = LARGURA_ROTULOS + g.largura + MARGEM_DIREITA;
  const altura = ALTURA_CABECALHO + Math.max(1, raias.length) * ALTURA_RAIA + 8;

  const svg = s("svg", {
    class: `spro-g-svg${estatico ? " estatico" : ""}`,
    viewBox: `0 0 ${arredondar(largura)} ${altura}`,
    width: estatico ? "100%" : arredondar(largura),
    ...(estatico ? {} : { height: altura }),
    role: "group",
    "aria-label": `Linha do tempo do processo: ${raias.length} unidade(s) e ${passagens.length} passagem(ns)`,
    "data-escala": escala,
  });

  svg.append(
    s(
      "defs",
      {},
      // Listra diagonal: passagem em curso. Pontos: aguardando recebimento.
      s(
        "pattern",
        { id: `${id}-listra`, width: 8, height: 8, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" },
        s("rect", { width: 8, height: 8, class: "listra-fundo" }),
        s("rect", { width: 4, height: 8, class: "listra-traco" }),
      ),
      s(
        "pattern",
        { id: `${id}-pontos`, width: 6, height: 6, patternUnits: "userSpaceOnUse" },
        s("rect", { width: 6, height: 6, class: "pontos-fundo" }),
        s("circle", { cx: 3, cy: 3, r: 1.2, class: "pontos-ponto" }),
      ),
    ),
  );

  const x0 = LARGURA_ROTULOS;
  const eixo = eixoDoTempo(g);

  // Fundo das raias e linhas de grade.
  const corpo = s("g", { class: "spro-g-corpo" });
  raias.forEach((_, i) => {
    corpo.append(
      s("rect", {
        x: 0,
        y: ALTURA_CABECALHO + i * ALTURA_RAIA,
        width: largura,
        height: ALTURA_RAIA,
        class: i % 2 ? "raia-par" : "raia-impar",
      }),
    );
  });
  const grade = s("g", { class: "spro-g-grade", "aria-hidden": "true" });
  for (const m of eixo.baixo)
    grade.append(s("line", { x1: arredondar(x0 + m.x), x2: arredondar(x0 + m.x), y1: ALTURA_CABECALHO, y2: altura, class: "grade" }));
  corpo.append(grade);

  // Barras e losangos.
  raias.forEach((raia, i) => {
    const y = ALTURA_CABECALHO + i * ALTURA_RAIA;
    const gr = s("g", { class: "spro-g-raia", "data-raia": raia.chave });
    for (const p of raia.passagens) {
      const sit = situacaoDa(p);
      const xi = x0 + g.x(p.recebido.getTime());
      const w = Math.max(4, g.x(fimDaPassagem(p)) - g.x(p.recebido.getTime()));
      const barra = s("g", {
        class: `spro-g-barra ${sit}`,
        "data-situacao": sit,
        ...(estatico ? {} : { tabindex: 0, role: "img" }),
        "aria-label": rotuloAcessivelDaPassagem(p),
      });
      barra.append(s("rect", { x: arredondar(xi), y: y + BARRA_Y, width: arredondar(w), height: BARRA_H, rx: 4, class: "fundo" }));
      if (sit === "em-curso")
        barra.append(
          s("rect", {
            x: arredondar(xi),
            y: y + BARRA_Y,
            width: arredondar(w),
            height: BARRA_H,
            rx: 4,
            fill: `url(#${id}-listra)`,
            class: "padrao",
          }),
        );
      else if (sit === "pendente")
        barra.append(
          s("rect", {
            x: arredondar(xi),
            y: y + BARRA_Y,
            width: arredondar(w),
            height: BARRA_H,
            rx: 4,
            fill: `url(#${id}-pontos)`,
            class: "padrao",
          }),
        );
      else if (sit === "mantido-aberto" && p.enviouEm) {
        // Da remessa até hoje a unidade segue com o processo aberto: só esse trecho é listrado.
        const xr = x0 + g.x(p.enviouEm.getTime());
        barra.append(
          s("rect", {
            x: arredondar(xr),
            y: y + BARRA_Y,
            width: arredondar(Math.max(2, xi + w - xr)),
            height: BARRA_H,
            rx: 4,
            fill: `url(#${id}-listra)`,
            class: "padrao",
          }),
        );
        barra.append(
          s("line", { x1: arredondar(xr), x2: arredondar(xr), y1: y + BARRA_Y - 3, y2: y + BARRA_Y + BARRA_H + 3, class: "marca-remessa" }),
        );
      }
      if (w >= 44)
        barra.append(s("text", { x: arredondar(xi + 6), y: y + BARRA_Y + 14, class: "texto-barra" }, formatarDuracao(p.duracaoMs)));
      if (!estatico && o.dica) {
        const dica = o.dica;
        const d = dicaDaPassagem(p);
        barra.addEventListener("pointerenter", () => dica.mostrar(d, barra));
        barra.addEventListener("pointerleave", () => dica.ocultar());
        barra.addEventListener("focus", () => dica.mostrar(d, barra));
        barra.addEventListener("blur", () => dica.ocultar());
      }
      gr.append(barra);

      for (const doc of p.documentos) {
        const cx = x0 + g.x(doc.em.getTime());
        const losango = s("path", {
          d: `M${arredondar(cx)} ${y + LOSANGO_Y - LOSANGO_R}l${LOSANGO_R} ${LOSANGO_R}l-${LOSANGO_R} ${LOSANGO_R}l-${LOSANGO_R} -${LOSANGO_R}z`,
          class: "spro-g-losango",
          ...(estatico ? {} : { tabindex: 0, role: "button" }),
          "aria-label": `Documento ${tituloDoDocumento(doc)}, ${formatarDataHora(doc.em)}. Abrir visualização rápida`,
        });
        if (!estatico) {
          const dica = o.dica;
          const info = dicaDoDocumento(doc, p);
          if (dica) {
            losango.addEventListener("pointerenter", () => dica.mostrar(info, losango));
            losango.addEventListener("pointerleave", () => dica.ocultar());
            losango.addEventListener("focus", () => dica.mostrar(info, losango));
            losango.addEventListener("blur", () => dica.ocultar());
          }
          const abrir = () => o.aoAbrirDocumento?.(doc, p);
          losango.addEventListener("click", abrir);
          losango.addEventListener("keydown", (ev) => {
            const k = (ev as KeyboardEvent).key;
            if (k === "Enter" || k === " ") {
              ev.preventDefault();
              abrir();
            }
          });
        }
        gr.append(losango);
      }
    }
    corpo.append(gr);
  });
  svg.append(corpo);

  // Linha “Agora”.
  if (o.agora && passagens.some((p) => p.emCurso) && o.agora.getTime() >= g.origem && o.agora.getTime() <= g.fim) {
    const xa = arredondar(x0 + g.x(o.agora.getTime()));
    svg.append(
      s(
        "g",
        { class: "spro-g-agora", "aria-hidden": "true" },
        s("line", { x1: xa, x2: xa, y1: ALTURA_CABECALHO, y2: altura }),
        s("text", { x: Math.min(xa + 4, largura - 40), y: ALTURA_CABECALHO + 11 }, "Agora"),
      ),
    );
  }

  // Cabeçalho (fica no topo quando há rolagem vertical).
  const cab = s("g", { class: "spro-g-cabecalho", "aria-hidden": "true" });
  cab.append(s("rect", { x: 0, y: 0, width: largura, height: ALTURA_CABECALHO, class: "cabecalho-fundo" }));
  for (const m of eixo.cima) {
    cab.append(s("line", { x1: arredondar(x0 + m.x), x2: arredondar(x0 + m.x), y1: 0, y2: ALTURA_CABECALHO, class: "grade-forte" }));
    if (m.largura > 36) cab.append(s("text", { x: arredondar(x0 + m.x + 6), y: 15, class: "eixo-cima" }, m.rotulo));
  }
  for (const m of eixo.baixo) {
    if (m.largura >= 14)
      cab.append(s("text", { x: arredondar(x0 + m.x + m.largura / 2), y: 36, class: "eixo-baixo", "text-anchor": "middle" }, m.rotulo));
  }
  cab.append(s("line", { x1: 0, x2: largura, y1: ALTURA_CABECALHO, y2: ALTURA_CABECALHO, class: "grade-forte" }));
  svg.append(cab);

  // Rótulos das raias (ficam à esquerda quando há rolagem horizontal).
  const rot = s("g", { class: "spro-g-rotulos" });
  rot.append(s("rect", { x: 0, y: ALTURA_CABECALHO, width: LARGURA_ROTULOS, height: altura - ALTURA_CABECALHO, class: "rotulos-fundo" }));
  raias.forEach((r, i) => {
    const y = ALTURA_CABECALHO + i * ALTURA_RAIA;
    const t = s("text", { x: 10, y: y + 22, class: "rotulo-raia" }, abreviar(r.rotulo, 20));
    const nome = r.nome && r.nome !== r.sigla ? r.nome : "";
    const grupo = s("g", { "aria-label": `${r.sigla}${nome ? `, ${nome}` : ""}: ${r.passagens.length} passagem(ns)`, role: "img" }, t);
    if (nome) grupo.append(s("text", { x: 10, y: y + 37, class: "rotulo-nome" }, abreviar(nome, 24)));
    rot.append(grupo);
  });
  rot.append(s("line", { x1: LARGURA_ROTULOS, x2: LARGURA_ROTULOS, y1: ALTURA_CABECALHO, y2: altura, class: "grade-forte" }));
  svg.append(rot);

  // Canto (acima do cabeçalho e dos rótulos).
  const canto = s(
    "g",
    { class: "spro-g-canto", "aria-hidden": "true" },
    s("rect", { x: 0, y: 0, width: LARGURA_ROTULOS, height: ALTURA_CABECALHO, class: "cabecalho-fundo" }),
    s("text", { x: 10, y: 28, class: "eixo-cima" }, "Unidade"),
    s("line", { x1: LARGURA_ROTULOS, x2: LARGURA_ROTULOS, y1: 0, y2: ALTURA_CABECALHO, class: "grade-forte" }),
    s("line", { x1: 0, x2: LARGURA_ROTULOS, y1: ALTURA_CABECALHO, y2: ALTURA_CABECALHO, class: "grade-forte" }),
  );
  svg.append(canto);

  if (raias.length === 0) svg.append(s("text", { x: x0 + 12, y: ALTURA_CABECALHO + 28, class: "rotulo-nome" }, "Sem passagens."));
  return svg;
}

/** Cabeçalho, rótulos e canto acompanham a rolagem do contêiner: o desenho é um SVG só. Devolve o desligador. */
export function fixarEixos(svg: SVGElement, rolagem: HTMLElement): () => void {
  const cab = svg.querySelector(".spro-g-cabecalho");
  const rot = svg.querySelector(".spro-g-rotulos");
  const canto = svg.querySelector(".spro-g-canto");
  const mover = () => {
    const x = rolagem.scrollLeft;
    const y = rolagem.scrollTop;
    cab?.setAttribute("transform", `translate(0 ${y})`);
    rot?.setAttribute("transform", `translate(${x} 0)`);
    canto?.setAttribute("transform", `translate(${x} ${y})`);
  };
  rolagem.addEventListener("scroll", mover);
  mover();
  return () => rolagem.removeEventListener("scroll", mover);
}
