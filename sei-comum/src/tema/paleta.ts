/**
 * Paleta do tema: conversões sRGB <-> OKLCH, contraste WCAG e a derivação da barra
 * superior a partir de uma cor escolhida. Funções puras, sem DOM.
 *
 * OKLCH porque L é perceptual: dá para clarear ou escurecer uma cor sem mudar o
 * matiz (o vermelho continua vermelho) e medir contraste de forma previsível.
 */

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

export type Esquema = "claro" | "escuro";

export interface BarraDerivada {
  barra: string;
  texto: string;
  hover: string;
  borda: string;
  /** Fundo do menu lateral: a mesma cor da barra, bem mais escura (texto sempre branco). */
  menu: string;
  destaque: string;
}

export const AZUL_PADRAO = "#1f5fbf";
const AZUL_ESCURO = "#79acff";
const TEXTO_ESCURO = "#14181d";
const FUNDO_DO_ESQUEMA: Record<Esquema, string> = { claro: "#ffffff", escuro: "#1a1d21" };
const CONTRASTE_MIN = 4.5;

export const PALETAS: readonly { id: string; nome: string; cor: string }[] = [
  { id: "sei-pro", nome: "SEI Pro", cor: "#1f5fbf" },
  { id: "oceano", nome: "Oceano", cor: "#0b6e99" },
  { id: "floresta", nome: "Floresta", cor: "#1f7a4d" },
  { id: "esmeralda", nome: "Esmeralda", cor: "#0e7c66" },
  { id: "grafite", nome: "Grafite", cor: "#3a4350" },
  { id: "vinho", nome: "Vinho", cor: "#8a2a43" },
  { id: "roxo", nome: "Roxo", cor: "#5b43b8" },
  { id: "ambar", nome: "Âmbar", cor: "#a85d00" },
  { id: "ardosia", nome: "Ardósia", cor: "#475c7a" },
  { id: "preto", nome: "Preto", cor: "#14181d" },
  { id: "rosa", nome: "Rosa", cor: "#c2417a" },
  { id: "magenta", nome: "Magenta", cor: "#9c2a8c" },
  { id: "indigo", nome: "Índigo", cor: "#3949ab" },
  { id: "turquesa", nome: "Turquesa", cor: "#0a7c86" },
  { id: "terracota", nome: "Terracota", cor: "#a8452a" },
  { id: "oliva", nome: "Oliva", cor: "#5a7424" },
  { id: "cobre", nome: "Cobre", cor: "#8a5a3c" },
  { id: "azul-petroleo", nome: "Azul-petróleo", cor: "#1b4f72" },
];

/**
 * Tons de fundo prontos por esquema (SEI Pro Lab). A cor é a da superfície principal (--spro-fundo); as demais
 * camadas, as bordas e o texto saem dela (tokens.ts), com o contraste do texto garantido. "padrao" é o tom original.
 */
export const FUNDOS: Record<Esquema, readonly { id: string; nome: string; cor: string }[]> = {
  claro: [
    { id: "padrao", nome: "Branco (padrão)", cor: "#ffffff" },
    { id: "gelo", nome: "Gelo", cor: "#f3f6fa" },
    { id: "creme", nome: "Creme", cor: "#fbf6ea" },
    { id: "sepia", nome: "Sépia", cor: "#f1e5cc" },
  ],
  escuro: [
    { id: "padrao", nome: "Grafite (padrão)", cor: "#1a1d21" },
    { id: "azul-noite", nome: "Azul-noite", cor: "#172030" },
    { id: "preto", nome: "Preto", cor: "#0c0c0d" },
    { id: "sepia", nome: "Sépia escuro", cor: "#262017" },
    { id: "musgo", nome: "Musgo", cor: "#1a221d" },
  ],
};

const limitar = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

/** `#rgb` ou `#rrggbb` -> [0..255]; qualquer outra coisa -> null. */
export function lerHex(hex: string): [number, number, number] | null {
  const t = String(hex).trim().toLowerCase();
  const curto = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(t);
  if (curto) return [curto[1]!, curto[2]!, curto[3]!].map((x) => Number.parseInt(x + x, 16)) as [number, number, number];
  const longo = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/.exec(t);
  if (longo) return [longo[1]!, longo[2]!, longo[3]!].map((x) => Number.parseInt(x, 16)) as [number, number, number];
  return null;
}

export const paraHex = (rgb: readonly number[]): string =>
  `#${rgb
    .map((x) =>
      Math.round(limitar(x, 0, 255))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;

const linear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const gama = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

function rgbParaOklab(rgb: readonly number[]): [number, number, number] {
  const [r, g, b] = rgb.map((x) => linear(x / 255)) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabParaLinear(L: number, a: number, b: number): [number, number, number] {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

export function paraOklch(hex: string): Oklch {
  const rgb = lerHex(hex) ?? lerHex(AZUL_PADRAO)!;
  const [L, a, b] = rgbParaOklab(rgb);
  const c = Math.hypot(a, b);
  return { l: L, c, h: c < 1e-4 ? 0 : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 };
}

const dentro = (v: readonly number[]) => v.every((x) => x >= -0.0005 && x <= 1.0005);

/** OKLCH -> `#rrggbb`. Fora do gamut sRGB, reduz o croma (mantém L e matiz). */
export function deOklch({ l, c, h }: Oklch): string {
  const L = limitar(l);
  const rad = (h * Math.PI) / 180;
  const converte = (cc: number) => oklabParaLinear(L, cc * Math.cos(rad), cc * Math.sin(rad));
  let lin = converte(c);
  if (!dentro(lin)) {
    let lo = 0;
    let hi = c;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (dentro(converte(mid))) lo = mid;
      else hi = mid;
    }
    lin = converte(lo);
  }
  return paraHex(lin.map((v) => gama(limitar(v)) * 255));
}

function luminancia(hex: string): number {
  const rgb = lerHex(hex) ?? [0, 0, 0];
  const [r, g, b] = rgb.map((x) => linear(x / 255)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contraste WCAG entre duas cores `#rrggbb`: de 1 a 21. */
export function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/**
 * Derivação da barra superior. O texto é branco ou quase-preto (o de maior contraste);
 * se nem esse chega a 4,5:1, o tom da barra anda (matiz e croma preservados) até chegar.
 * No escuro a barra perde luminosidade e croma para não ofuscar.
 */
export function derivarBarra(corBase: string, esquema: Esquema, fundoDoTema?: string): BarraDerivada {
  const base = lerHex(corBase) ? corBase : AZUL_PADRAO;
  let { l, c, h } = paraOklch(base);
  const semCroma = c < 0.03;
  if (esquema === "escuro") {
    l = Math.min(l, 0.42);
    c *= 0.85;
  }

  let barra = deOklch({ l, c, h });
  const texto = contraste("#ffffff", barra) >= contraste(TEXTO_ESCURO, barra) ? "#ffffff" : TEXTO_ESCURO;
  for (let i = 0; i < 100 && contraste(texto, barra) < CONTRASTE_MIN; i++) {
    l += texto === "#ffffff" ? -0.01 : 0.01;
    barra = deOklch({ l, c, h });
  }

  const passo = esquema === "escuro" ? 0.05 : -0.05;
  const hover = deOklch({ l: l + passo, c, h });
  const borda = deOklch({ l: l - 0.08, c, h });
  const menu = deOklch({ l: Math.min(l, 0.26), c: c * 0.55, h });

  // O destaque (links, botões) precisa de contraste com o fundo em uso, que pode ser um tom escolhido (SEI Pro Lab).
  const fundo = fundoDoTema && lerHex(fundoDoTema) ? fundoDoTema : FUNDO_DO_ESQUEMA[esquema];
  const origem = paraOklch(semCroma ? (esquema === "escuro" ? AZUL_ESCURO : AZUL_PADRAO) : base);
  let dl = esquema === "escuro" ? Math.max(origem.l, 0.7) : Math.min(origem.l, 0.55);
  let destaque = deOklch({ l: dl, c: origem.c, h: origem.h });
  for (let i = 0; i < 100 && contraste(destaque, fundo) < CONTRASTE_MIN; i++) {
    dl += esquema === "escuro" ? 0.01 : -0.01;
    destaque = deOklch({ l: dl, c: origem.c, h: origem.h });
  }

  return { barra, texto, hover, borda, menu, destaque };
}
