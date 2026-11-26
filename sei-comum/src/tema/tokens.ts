import type { ConfigTema } from "./config";
import { contraste, deOklch, derivarBarra, type Esquema, FUNDOS, paraOklch } from "./paleta";

/** Superfícies em camadas (pagina < fundo < fundo-2 < fundo-3); as do escuro são as de ui/base.css. */
const SUPERFICIES: Record<Esquema, Record<string, string>> = {
  claro: {
    "--spro-fundo": "#ffffff",
    "--spro-fundo-2": "#f6f7f9",
    "--spro-fundo-3": "#eceef2",
    "--spro-pagina": "#f3f4f7",
    "--spro-texto": "#1b1f24",
    "--spro-suave": "#5d6772",
    "--spro-fraco": "#8b939c",
    "--spro-borda": "#e3e6eb",
    "--spro-borda-forte": "#cfd4db",
    "--spro-perigo": "#d1352b",
    "--spro-aviso": "#b45c0a",
    "--spro-ok": "#12805c",
    "--spro-tom-azul": "#2563eb",
    "--spro-tom-verde": "#12805c",
    "--spro-tom-ambar": "#b45c0a",
    "--spro-tom-laranja": "#c2410c",
    "--spro-tom-roxo": "#6d4fd8",
    "--spro-tom-rosa": "#be2f78",
    "--spro-tom-ciano": "#0e7490",
    "--spro-sombra-1": "0 1px 2px rgb(16 24 40 / 6%)",
    "--spro-sombra-2": "0 2px 4px -2px rgb(16 24 40 / 8%), 0 6px 14px -4px rgb(16 24 40 / 12%)",
    "--spro-sombra-3": "0 10px 24px -6px rgb(16 24 40 / 18%), 0 24px 56px -12px rgb(16 24 40 / 24%)",
    "--spro-veu": "rgb(17 21 28 / 46%)",
  },
  escuro: {
    "--spro-fundo": "#1a1d21",
    "--spro-fundo-2": "#22262b",
    "--spro-fundo-3": "#2b3036",
    "--spro-pagina": "#141619",
    "--spro-texto": "#e7e9ec",
    "--spro-suave": "#a4abb3",
    "--spro-fraco": "#767e87",
    "--spro-borda": "#2f343a",
    "--spro-borda-forte": "#3d434a",
    "--spro-perigo": "#ff7d73",
    "--spro-aviso": "#e8b04a",
    "--spro-ok": "#4fcf96",
    "--spro-tom-azul": "#7aa8ff",
    "--spro-tom-verde": "#4fcf96",
    "--spro-tom-ambar": "#e8b04a",
    "--spro-tom-laranja": "#fb923c",
    "--spro-tom-roxo": "#ab98ff",
    "--spro-tom-rosa": "#f58bbd",
    "--spro-tom-ciano": "#5fd3e6",
    "--spro-sombra-1": "0 1px 2px rgb(0 0 0 / 30%)",
    "--spro-sombra-2": "0 2px 4px -2px rgb(0 0 0 / 40%), 0 6px 14px -4px rgb(0 0 0 / 45%)",
    "--spro-sombra-3": "0 10px 24px -6px rgb(0 0 0 / 50%), 0 24px 56px -12px rgb(0 0 0 / 60%)",
    "--spro-veu": "rgb(0 0 0 / 58%)",
  },
};

/** Camadas que acompanham o tom do fundo (as demais, como os tons semânticos e as sombras, ficam como estão). */
const CAMADAS = ["--spro-pagina", "--spro-fundo-2", "--spro-fundo-3", "--spro-borda", "--spro-borda-forte"] as const;
/** Contraste mínimo de cada texto com a camada mais próxima dele (fundo-3): o que o tema original já tem nos dois esquemas. */
const TEXTOS = [
  ["--spro-texto", 10.5],
  ["--spro-suave", 4.8],
  ["--spro-fraco", 2.7],
] as const;

/**
 * SEI Pro Lab: superfícies e textos a partir de um tom de fundo. As camadas mantêm a mesma distância de
 * luminosidade (OKLCH) que têm no tema original, com o matiz do tom escolhido; o texto ganha um pouco do
 * matiz e anda na luminosidade até ter contraste. O tom padrão devolve a tabela original, sem cálculo.
 */
export function superficiesDoFundo(esquema: Esquema, fundo: string | undefined): Record<string, string> {
  const original = SUPERFICIES[esquema];
  if (!fundo || fundo.toLowerCase() === FUNDOS[esquema][0]!.cor) return original;
  const ref = paraOklch(original["--spro-fundo"]!);
  const base = paraOklch(fundo);
  // O tom não pode ir para o lado errado do esquema (fundo claro no modo escuro e vice-versa).
  const l = esquema === "escuro" ? Math.min(base.l, 0.27) : Math.max(base.l, 0.88);
  // Fundo escuro muito saturado (vermelho puro, verde-limão) cansa a vista e não deixa o texto chegar ao contraste.
  if (esquema === "escuro") base.c = Math.min(base.c, 0.05);
  const lim = (x: number) => Math.min(1, Math.max(0, x));
  const saida: Record<string, string> = { ...original, "--spro-fundo": deOklch({ l, c: base.c, h: base.h }) };
  for (const k of CAMADAS) {
    const o = paraOklch(original[k]!);
    saida[k] = deOklch({ l: lim(l + (o.l - ref.l)), c: base.c, h: base.h });
  }
  const camada = saida["--spro-fundo-3"]!;
  const passo = esquema === "escuro" ? 0.01 : -0.01;
  for (const [k, minimo] of TEXTOS) {
    const o = paraOklch(original[k]!);
    const c = Math.min(base.c * 0.6, 0.035);
    let lt = o.l;
    let cor = deOklch({ l: lt, c, h: base.h });
    for (let i = 0; i < 100 && contraste(cor, camada) < minimo; i++) {
      lt = lim(lt + passo);
      cor = deOklch({ l: lt, c, h: base.h });
    }
    saida[k] = cor;
  }
  return saida;
}

/** Texto de um destaque: branco, ou quase-preto no escuro (onde o destaque é claro). */
const TEXTO_DO_DESTAQUE: Record<Esquema, string> = { claro: "#ffffff", escuro: "#0a1526" };

/** Tokens do tema como pares nome/valor (sem seletor). */
export function gerarTokens(cfg: ConfigTema, esquema: Esquema): Record<string, string> {
  const sup = superficiesDoFundo(esquema, esquema === "escuro" ? cfg.fundoEscuro : cfg.fundoClaro);
  const b = derivarBarra(cfg.corBarra, esquema, sup["--spro-fundo"]);
  return {
    ...sup,
    "--spro-barra": b.barra,
    "--spro-barra-texto": b.texto,
    "--spro-barra-hover": b.hover,
    "--spro-barra-borda": b.borda,
    "--spro-menu": b.menu,
    "--spro-menu-texto": "#f2f4f7",
    "--spro-destaque": b.destaque,
    "--spro-destaque-texto": TEXTO_DO_DESTAQUE[esquema],
    "--spro-destaque-suave": "color-mix(in srgb, var(--spro-destaque) 12%, transparent)",
    "--spro-destaque-medio": "color-mix(in srgb, var(--spro-destaque) 22%, transparent)",
    "--spro-anel": "0 0 0 3px color-mix(in srgb, var(--spro-destaque) 30%, transparent)",
    "--spro-raio-p": "6px",
    "--spro-raio": "8px",
    "--spro-raio-g": "12px",
    "--spro-raio-xg": "16px",
    "--spro-fonte": 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    "--spro-dur": "150ms",
    /** Curva das transições da casca (estava em uso em ~34 regras sem estar definida, então nenhuma transição rodava). */
    "--spro-curva": "cubic-bezier(0.22, 0.61, 0.36, 1)",
  };
}

/**
 * Texto CSS completo do tema: o bloco de tokens no seletor `:root[data-spro-tema-ativo]`
 * e, depois, a folha base (quem a escreve usa só `var(--spro-*)`).
 */
export function gerarFolha(cfg: ConfigTema, esquema: Esquema, baseCss = ""): string {
  const tokens = gerarTokens(cfg, esquema);
  const linhas = Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`);
  return `:root[data-spro-tema-ativo] {\n${linhas.join("\n")}\n  color-scheme: ${esquema === "escuro" ? "dark" : "light"};\n}\n${cssDosHospedeiros(cfg, esquema, tokens)}${baseCss}`;
}

/**
 * SEI Pro Lab: componentes do SEI Pro que vivem em Shadow DOM (o Controle de Processos novo, as janelas de prazos,
 * blocos de assinatura e ordem dos painéis, o balão de projetos) definem as próprias cores no `:host` e não herdam
 * as da página. Uma regra de fora, no elemento hospedeiro, vence a do `:host`: é por ela que o tom de fundo chega
 * lá dentro. Só as superfícies, os textos e o destaque; e só com um tom escolhido (no padrão, nada muda).
 */
export const HOSPEDEIROS = "#spro-grade, #spro-dica-host, .spro-pnl-host, .spro-blk-host, .spro-prz-host, .spro-prj-balao";
const DO_TOM = [
  "--spro-fundo",
  "--spro-fundo-2",
  "--spro-fundo-3",
  "--spro-pagina",
  "--spro-borda",
  "--spro-borda-forte",
  "--spro-texto",
  "--spro-suave",
  "--spro-fraco",
  "--spro-destaque",
];
function cssDosHospedeiros(cfg: ConfigTema, esquema: Esquema, tokens: Record<string, string>): string {
  const fundo = esquema === "escuro" ? cfg.fundoEscuro : cfg.fundoClaro;
  if (!fundo || fundo.toLowerCase() === FUNDOS[esquema][0]!.cor) return "";
  const linhas = DO_TOM.filter((k) => tokens[k]).map((k) => `  ${k}: ${tokens[k]};`);
  return `:root[data-spro-tema-ativo] :is(${HOSPEDEIROS}) {\n${linhas.join("\n")}\n}\n`;
}
