/**
 * A etiqueta do marcador, preenchida e na COR dele. O SEI identifica a cor pelo nome do arquivo do ícone
 * (`svg/marcador_azul_marinho.svg?18`); aqui cada nome vira um hex (o mesmo preenchimento dos SVG do SEI 5.0) e o
 * desenho é nosso (`glifo("tag")`). Duas versões da cor: a do tema claro e uma mais clara para o escuro, onde
 * "azul marinho", "vinho" e "verde escuro" sumiriam no fundo. A escolha do tema é do CSS (`--spro-tag` e
 * `--spro-tag-escuro`), e um contorno fino (a cor do texto, bem suave) segura o amarelo no fundo branco e o preto no escuro.
 */
import { glifo, type NomeGlifo } from "./glifos";

/** Cor de cada marcador do SEI (os 32 nomes do SEI 4.1 e 5.0). */
export const CORES_DE_MARCADOR: Readonly<Record<string, string>> = {
  amarelo: "#fff200",
  amarelo_claro: "#dde134",
  amarelo_ouro: "#f7b431",
  azul: "#4285f4",
  azul_ceu: "#009df2",
  azul_marinho: "#002d9e",
  azul_riviera: "#205d8c",
  bege: "#f8d396",
  branco: "#ffffff",
  bronze: "#a56738",
  champagne: "#e0a076",
  ciano: "#00ffff",
  cinza: "#c0c0c0",
  cinza_escuro: "#527b79",
  laranja: "#ff5f00",
  lilas: "#c892d8",
  marrom: "#61280a",
  ouro: "#a7790b",
  prata: "#81979d",
  preto: "#000000",
  rosa: "#ff1cae",
  rosa_claro: "#ffa7dc",
  roxo: "#68339b",
  tijolo: "#c35107",
  verde: "#00ff00",
  verde_abacate: "#00a884",
  verde_agua: "#00c4ba",
  verde_amazonas: "#007725",
  verde_escuro: "#004225",
  verde_turquesa: "#00858a",
  vermelho: "#ff4545",
  vinho: "#633039",
};

/** Sem cor conhecida (marcador sem ícone, ou um ícone que o SEI não tinha): cinza neutro. */
export const COR_SEM_MARCADOR = "#9aa3ac";

/** O nome da cor no caminho do ícone do SEI (`svg/marcador_azul.svg?18` -> `azul`); `null` se não há. */
export function nomeDaCorDoMarcador(icone: string | undefined): string | null {
  const m = /marcador_([a-z_]+)\.(?:svg|png)/i.exec(icone ?? "");
  return m?.[1] ? m[1].toLowerCase() : null;
}

const canais = (hex: string): [number, number, number] => {
  const h6 = hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex;
  return [1, 3, 5].map((i) => Number.parseInt(h6.slice(i, i + 2), 16)) as [number, number, number];
};

/** Luminância relativa (WCAG), de 0 a 1. */
export function luminancia(hex: string): number {
  const [r, g, b] = canais(hex).map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const paraHex = (c: [number, number, number]): string => `#${c.map((x) => Math.round(x).toString(16).padStart(2, "0")).join("")}`;

/** Clareia a cor em direção ao branco. */
function clarear(hex: string, parte: number): string {
  return paraHex(canais(hex).map((c) => c + (255 - c) * parte) as [number, number, number]);
}

export interface CorDoMarcador {
  nome: string | null;
  claro: string;
  escuro: string;
}

/** As duas versões da cor do marcador, pelo caminho do ícone. Desconhecida = cinza nos dois temas. */
export function corDoMarcador(icone: string | undefined): CorDoMarcador {
  const nome = nomeDaCorDoMarcador(icone);
  const base = nome ? CORES_DE_MARCADOR[nome] : undefined;
  if (!base) return { nome, claro: COR_SEM_MARCADOR, escuro: COR_SEM_MARCADOR };
  if (nome === "preto") return { nome, claro: base, escuro: "#d5d9de" };
  // No fundo escuro (#1a1d21), o que tem pouca luz some: sobe a luminância até o contraste de 3:1 do fundo.
  let escuro = base;
  for (let parte = 0.2; luminancia(escuro) < 0.17 && parte <= 0.8; parte += 0.1) escuro = clarear(base, parte);
  return { nome, claro: base, escuro };
}

/** A etiqueta preenchida na cor do marcador; `icone` é o caminho que o SEI serve (pode faltar). */
export function tagMarcador(icone: string | undefined, tamanho = 16, doc: Document = document): SVGSVGElement {
  const cor = corDoMarcador(icone);
  const svg = glifo("tag" satisfies NomeGlifo, tamanho, doc);
  svg.setAttribute("class", "spro-glifo spro-icone spro-tag");
  svg.setAttribute("style", `--spro-tag:${cor.claro};--spro-tag-escuro:${cor.escuro}`);
  if (cor.nome) svg.setAttribute("data-cor", cor.nome);
  return svg;
}
