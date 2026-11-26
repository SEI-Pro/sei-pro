import { type Forma, ICONES } from "@comum/ui/dom";
import { ICONES_EXTRAS } from "./extras";
import { type ContextoIcone, type EntradaIcone, MAPA_ICONES, MAPA_MENU_PRO } from "./mapa";
import { gerarCssPastilhas } from "./pastilhas";
import { ICONES_PROPRIOS } from "./proprios";

const TODOS: Record<string, Forma[]> = { ...(ICONES as Record<string, Forma[]>), ...ICONES_EXTRAS };

/** Respiro do ícone dentro da imagem, por contexto: a barra de ações tem imagens de 40 px. */
const RESPIRO: Record<ContextoIcone, string> = { menu: "0", topo: "0", barra: "7px", tabela: "2px" };
/** A imagem original perde o tamanho natural quando o conteúdo vira um GIF de 1 px: o topo não traz width/height. */
const TAMANHO: Partial<Record<ContextoIcone, string>> = {
  topo: "width: 24px;\n  height: 24px;\n  ",
  tabela: "width: 24px;\n  height: 24px;\n  ",
};
/** O SEI Pro zera o fundo das imagens da barra de ações com !important: só !important devolve a máscara. */
const FUNDO: Record<ContextoIcone, string> = {
  menu: "currentColor",
  topo: "currentColor",
  barra: "currentColor !important",
  tabela: "currentColor",
};
/** Onde cada contexto vive: um ícone com o mesmo nome em outro lugar (a árvore, por exemplo) não é trocado. */
const ESCOPO: Record<ContextoIcone, string> = {
  menu: "#infraMenu",
  topo: "#divInfraBarraSistemaPadrao",
  barra: ":is(div.barraBotoesSEI, #divArvoreAcoes)",
  tabela: "table",
};
/** Cor própria do contexto (a das linhas de tabela é a esmaecida; o resto herda do elemento). */
const COR_BASE: Partial<Record<ContextoIcone, string>> = { tabela: "\n  color: var(--spro-suave);" };

export function nomesDeIcones(): string[] {
  return Object.keys(TODOS);
}

/**
 * O desenho como SVG (só silhueta: a cor vem do `background-color` da imagem, pela máscara). Com `preenchido`
 * (0 a 1), os corpos fechados (círculos, retângulos e caminhos que fecham com `z`) ganham preenchimento com
 * essa opacidade e o contorno continua cheio por cima: o resultado é um ícone preenchido na cor do tom,
 * com os detalhes (linhas, pontos) ainda legíveis. Sem `preenchido`, é só traço.
 */
export function svgDoIcone(nome: string, preenchido = 0, traco = 1.8): string {
  const formas = TODOS[nome] ?? DESENHOS_DUOTOM[nome];
  if (!formas) throw new Error(`Ícone desconhecido: ${nome}`);
  const corpo = formas
    .map(([tag, attrs]) => {
      const fecha = tag === "circle" || tag === "rect" || (tag === "path" && /z/i.test(String(attrs.d ?? "")));
      const extra = preenchido > 0 && fecha && !attrs.fill ? ` fill="#000" fill-opacity="${preenchido}"` : "";
      const a = Object.entries(attrs)
        .map(([k, v]) =>
          k === "fill" && v === "currentColor" ? `fill="#000"` : k === "stroke" && v === "none" ? `stroke="none"` : `${k}="${v}"`,
        )
        .join(" ");
      return `<${tag} ${a}${extra}/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="${traco}" stroke-linecap="round" stroke-linejoin="round">${corpo}</svg>`;
}

/** Opacidade do preenchimento por contexto: as barras de ações são preenchidas, o resto é só traço. */
const PREENCHIMENTO: Partial<Record<ContextoIcone, number>> = { barra: 0.62 };

const uri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22")}")`;
/** GIF transparente de 1 px: `content` na <img> troca o desenho original por ele, e a máscara pinta o novo. */
const GIF_TRANSPARENTE = `url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")`;

const seletor = (e: EntradaIcone) =>
  e.seletor
    ? `:root[data-spro-tema-ativo] ${ESCOPO[e.contexto]} ${e.seletor}`
    : `:root[data-spro-tema-ativo] ${ESCOPO[e.contexto]} img${e.daExtensao ? '[src^="chrome-extension"]' : ""}[src*="${e.src}"]`;

/** CSS gerado: uma regra base por contexto (mesma mecânica para todos) e uma regra por ícone (só a máscara). */
/** SEI Pro Lab: variação de desenho do conjunto (o "Duotom" usa traço mais fino e um preenchimento suave em tudo). */
export interface EstiloIcones {
  preenchido?: number;
  traco?: number;
  /** Desenho que entra no lugar de outro só neste conjunto (nome do mapa -> nome em TODOS). */
  trocar?: Record<string, string>;
}

/** SEI Pro Lab: desenhos que só o conjunto Duotom usa (mais próximos do que o item faz). */
const DESENHOS_DUOTOM: Record<string, Forma[]> = {
  megafoneDuo: [
    ["path", { d: "M3.5 10.5v3a1 1 0 0 0 1 1H7l7.5 4.5V5L7 9.5H4.5a1 1 0 0 0-1 1z" }],
    ["path", { d: "M7.5 14.5l1.2 4.6a1 1 0 0 0 1 .7h1.2" }],
    ["path", { d: "M18 9.3c1.3.6 2.2 1.6 2.2 2.7s-.9 2.1-2.2 2.7" }],
  ],
  painelDuo: [
    ["rect", { x: "3.5", y: "3.5", width: "7", height: "8", rx: "1.6" }],
    ["rect", { x: "13.5", y: "3.5", width: "7", height: "5", rx: "1.6" }],
    ["rect", { x: "13.5", y: "11.5", width: "7", height: "9", rx: "1.6" }],
    ["rect", { x: "3.5", y: "14.5", width: "7", height: "6", rx: "1.6" }],
  ],
  graficoDuo: [
    ["path", { d: "M4 20.5h16" }],
    ["rect", { x: "5.5", y: "11", width: "3.2", height: "6.5", rx: "1" }],
    ["rect", { x: "10.4", y: "5.5", width: "3.2", height: "12", rx: "1" }],
    ["rect", { x: "15.3", y: "13.5", width: "3.2", height: "4", rx: "1" }],
  ],
};

export function gerarCssIcones(mapa: EntradaIcone[] = MAPA_ICONES, estilo: EstiloIcones = {}): string {
  const partes: string[] = [];
  const proprios = mapa.filter((e) => e.proprio);
  if (proprios.length > 0) {
    partes.push(`${proprios.map(seletor).join(",\n")} {\n  box-sizing: border-box;\n  padding: 0;\n  background: none !important;\n}`);
    for (const e of proprios) {
      const desenho = ICONES_PROPRIOS[e.icone];
      if (!desenho) throw new Error(`Ícone próprio desconhecido: ${e.icone}`);
      partes.push(`${seletor(e)} {\n  content: ${uri(desenho)};\n}`);
    }
  }
  for (const ctx of ["menu", "topo", "barra", "tabela"] as ContextoIcone[]) {
    const doCtx = mapa.filter((e) => e.contexto === ctx && !e.proprio);
    if (doCtx.length === 0) continue;
    partes.push(
      `${doCtx.map(seletor).join(",\n")} {\n  content: ${GIF_TRANSPARENTE};\n  box-sizing: border-box;\n  ${TAMANHO[ctx] ?? ""}padding: ${RESPIRO[ctx]};\n  background-color: ${FUNDO[ctx]};\n  background-clip: content-box;${COR_BASE[ctx] ?? ""}\n  -webkit-mask-repeat: no-repeat;\n  -webkit-mask-position: center;\n  -webkit-mask-size: contain;\n  -webkit-mask-origin: content-box;\n  -webkit-mask-clip: content-box;\n}`,
    );
  }
  for (const e of mapa.filter((x) => !x.proprio)) {
    partes.push(
      `${seletor(e)} {\n  -webkit-mask-image: ${uri(svgDoIcone(estilo.trocar?.[e.icone] ?? e.icone, estilo.preenchido ?? PREENCHIMENTO[e.contexto] ?? 0, estilo.traco))};${e.tom ? `\n  color: var(--${e.tom === "perigo" ? "spro-perigo" : `spro-tom-${e.tom}`});` : ""}\n}`,
    );
  }
  return partes.join("\n");
}

/** Itens do SEI Pro no menu: esconde o glifo inline e pinta o desenho novo por máscara no próprio <svg>. */
export function gerarCssMenuPro(mapa = MAPA_MENU_PRO, estilo: EstiloIcones = {}): string {
  const base = `:root[data-spro-tema-ativo] #infraMenu a.newLinksMenuPro > svg.iconMenuPro`;
  const partes = [
    `${base} {\n  box-sizing: border-box;\n  flex: none;\n  margin: 0 5px 0 6px !important;\n  background-color: currentColor;\n  -webkit-mask-repeat: no-repeat;\n  -webkit-mask-position: center;\n  -webkit-mask-size: contain;\n}`,
    `${base} > * {\n  display: none;\n}`,
  ];
  for (const e of mapa) {
    partes.push(
      `:root[data-spro-tema-ativo] #infraMenu a#${e.id} > svg.iconMenuPro {\n  -webkit-mask-image: ${uri(svgDoIcone(estilo.trocar?.[e.icone] ?? e.icone, estilo.preenchido ?? 0, estilo.traco))};\n}`,
    );
  }
  return partes.join("\n");
}

/**
 * SEI Pro Lab: conjunto "Duotom". Os mesmos desenhos vetoriais, em traço mais fino (1,5) e com um preenchimento
 * suave (30%) da própria cor em cada forma fechada: o contorno continua nítido e o ícone ganha corpo, no estilo
 * da lupa da barra. Segue a cor do tema, como o moderno.
 */
export const DUOTOM: EstiloIcones = {
  preenchido: 0.3,
  traco: 1.5,
  trocar: { megafone: "megafoneDuo", painel: "painelDuo", planilha: "graficoDuo", retorno: "calendario" },
};

/** SEI Pro Lab: o CSS de ícones conforme o conjunto escolhido ("originais" não troca nada). */
export function cssDosIcones(conjunto: "moderno" | "duotom" | "pastilhas" | "originais"): string {
  if (conjunto === "originais") return "";
  if (conjunto === "pastilhas") return gerarCssPastilhas();
  if (conjunto === "duotom") return `${gerarCssIcones(MAPA_ICONES, DUOTOM)}\n${gerarCssMenuPro(MAPA_MENU_PRO, DUOTOM)}`;
  return `${gerarCssIcones()}\n${gerarCssMenuPro()}`;
}
