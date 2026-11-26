import { contraste, deOklch, lerHex, paraHex, paraOklch } from "./paleta";

/**
 * Remapeamento de cores de documento para o tema escuro: preserva matiz e croma e
 * refaz só a luminosidade. O vermelho continua vermelho, o realce continua realce.
 * Só exibição: quem chama nunca grava o resultado no documento.
 */

let FUNDO_ESCURO = "#1a1d21";
let TEXTO_CLARO = "#e7e9ec";
let PAGINA_L = paraOklch(FUNDO_ESCURO).l;

/** SEI Pro Lab: o tom de fundo escuro escolhido (e o texto dele) passa a ser a referência do remapeamento. */
export function definirFundoEscuro(fundo: string, texto: string): void {
  if (!lerHex(fundo) || !lerHex(texto)) return;
  FUNDO_ESCURO = fundo;
  TEXTO_CLARO = texto;
  PAGINA_L = paraOklch(fundo).l;
}

const NOMES: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  blue: "#0000ff",
  green: "#008000",
  lime: "#00ff00",
  yellow: "#ffff00",
  orange: "#ffa500",
  purple: "#800080",
  gray: "#808080",
  grey: "#808080",
  silver: "#c0c0c0",
  navy: "#000080",
  maroon: "#800000",
  teal: "#008080",
  aqua: "#00ffff",
  cyan: "#00ffff",
  fuchsia: "#ff00ff",
  magenta: "#ff00ff",
  olive: "#808000",
  brown: "#a52a2a",
  pink: "#ffc0cb",
};

/** Cor CSS -> `#rrggbb`, ou null quando não há o que adaptar (transparente, herdada, ilegível). */
export function lerCorCss(css: string): string | null {
  const t = css.trim().toLowerCase();
  if (!t || t === "transparent" || t === "inherit" || t === "initial" || t === "unset" || t === "currentcolor") return null;
  if (NOMES[t]) return NOMES[t]!;
  if (t.startsWith("#")) return lerHex(t) ? paraHex(lerHex(t)!) : null;
  const fn = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/.exec(t);
  if (!fn) return null;
  const alfa = fn[4] === undefined ? 1 : fn[4].endsWith("%") ? Number.parseFloat(fn[4]) / 100 : Number.parseFloat(fn[4]);
  if (!(alfa > 0)) return null;
  const rgb = [fn[1], fn[2], fn[3]].map((x) => Number(x));
  if (rgb.some((x) => !Number.isFinite(x) || x < 0 || x > 255)) return null;
  return paraHex(rgb);
}

export function adaptarCor(css: string, papel: "texto" | "fundo"): string | null {
  const hex = lerCorCss(css);
  if (!hex) return null;
  const { l, c, h } = paraOklch(hex);
  const neutra = c < 0.02;

  if (papel === "texto") {
    if (neutra && (l < 0.3 || l > 0.9)) return TEXTO_CLARO;
    // Texto claro (branco sobre célula colorida) segue claro; o escuro vira claro.
    let alvo = l >= 0.75 ? Math.max(0.85, l) : 0.62 + (1 - l) * 0.33;
    let saida = deOklch({ l: alvo, c, h });
    for (let i = 0; i < 40 && contraste(saida, FUNDO_ESCURO) < 4.5; i++) {
      alvo += 0.01;
      saida = deOklch({ l: alvo, c, h });
    }
    return saida;
  }

  if (neutra && l > 0.97) return FUNDO_ESCURO;
  // Camadas: o claro vira o fundo da página e o cinza vira uma camada acima dele.
  // Fundo bem colorido (realce) ganha luminosidade para continuar sendo realce.
  const alvo = Math.min(0.36, PAGINA_L + (1 - l) * 0.16 + Math.min(c, 0.2) * 0.8);
  return deOklch({ l: alvo, c, h });
}
