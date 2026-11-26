import { AZUL_PADRAO, type Esquema, FUNDOS, lerHex, PALETAS } from "./paleta";

/** Chave no chrome.storage.sync e no espelho síncrono (localStorage) da primeira pintura. */
export const CHAVE_TEMA = "spro_tema";
export const CHAVE_TEMA_CACHE = "spro_tema_cache";

export type ModoTema = "claro" | "escuro" | "auto";

/** Conjunto de ícones da casca (SEI Pro Lab): o moderno do Estilo Avançado, duotom (vetorial), pastilhas coloridas ou os originais do SEI. */
export type ConjuntoIcones = "moderno" | "duotom" | "pastilhas" | "originais";
const CONJUNTOS: readonly ConjuntoIcones[] = ["moderno", "duotom", "pastilhas", "originais"];

export interface ConfigTema {
  versao: 1;
  /** "Estilo Avançado" ligado (padrão: não; o usuário liga pelo interruptor da barra do SEI ou pelas opções). */
  ativo: boolean;
  modo: ModoTema;
  /** Id de uma paleta pronta, ou "livre". */
  paleta: string;
  /** #rrggbb, sempre válida. */
  corBarra: string;
  escurecerDocumentos: boolean;
  /** SEI Pro Lab: tom do fundo no modo claro (id de FUNDOS.claro ou "livre") e a cor correspondente. */
  tomClaro: string;
  fundoClaro: string;
  /** SEI Pro Lab: tom do fundo no modo escuro (id de FUNDOS.escuro ou "livre") e a cor correspondente. */
  tomEscuro: string;
  fundoEscuro: string;
  /** SEI Pro Lab: quais ícones a casca usa. */
  icones: ConjuntoIcones;
}

export const CONFIG_PADRAO: ConfigTema = {
  versao: 1,
  ativo: false,
  modo: "auto",
  paleta: "sei-pro",
  corBarra: AZUL_PADRAO,
  escurecerDocumentos: true,
  tomClaro: "padrao",
  fundoClaro: FUNDOS.claro[0]!.cor,
  tomEscuro: "padrao",
  fundoEscuro: FUNDOS.escuro[0]!.cor,
  icones: "moderno",
};

/** Tom pronto pelo id, ou a cor livre válida; qualquer outra coisa volta ao padrão do esquema. */
function normalizarFundo(esquema: Esquema, id: unknown, cor: unknown): { tom: string; cor: string } {
  const pronto = FUNDOS[esquema].find((f) => f.id === id);
  if (pronto) return { tom: pronto.id, cor: pronto.cor };
  const hex = typeof cor === "string" ? cor.trim().toLowerCase() : "";
  if (id === "livre" && /^#[0-9a-f]{6}$/.test(hex)) return { tom: "livre", cor: hex };
  return { tom: "padrao", cor: FUNDOS[esquema][0]!.cor };
}

/** Aceita qualquer coisa que venha do storage; nunca lança. */
export function normalizarConfig(valor: unknown): ConfigTema {
  if (typeof valor === "string") {
    try {
      return normalizarConfig(JSON.parse(valor));
    } catch {
      return { ...CONFIG_PADRAO };
    }
  }
  if (!valor || typeof valor !== "object" || (valor as { versao?: unknown }).versao !== 1) return { ...CONFIG_PADRAO };
  const v = valor as Record<string, unknown>;
  const modo: ModoTema = v.modo === "claro" || v.modo === "escuro" || v.modo === "auto" ? v.modo : CONFIG_PADRAO.modo;
  const pronta = PALETAS.find((p) => p.id === v.paleta);
  const hex = typeof v.corBarra === "string" ? v.corBarra.trim().toLowerCase() : "";
  const corLivre = lerHex(hex) && /^#[0-9a-f]{6}$/.test(hex) ? hex : null;
  const paleta = pronta ? pronta.id : "livre";
  const corBarra = pronta ? pronta.cor : (corLivre ?? CONFIG_PADRAO.corBarra);
  return {
    versao: 1,
    ativo: v.ativo === true,
    modo,
    paleta: pronta || corLivre ? paleta : CONFIG_PADRAO.paleta,
    corBarra,
    escurecerDocumentos: v.escurecerDocumentos !== false,
    ...(() => {
      const c = normalizarFundo("claro", v.tomClaro, v.fundoClaro);
      const e = normalizarFundo("escuro", v.tomEscuro, v.fundoEscuro);
      return { tomClaro: c.tom, fundoClaro: c.cor, tomEscuro: e.tom, fundoEscuro: e.cor };
    })(),
    icones: CONJUNTOS.includes(v.icones as ConjuntoIcones) ? (v.icones as ConjuntoIcones) : "moderno",
  };
}

export function esquemaResolvido(cfg: ConfigTema, sistemaEscuro: boolean): Esquema {
  if (cfg.modo === "claro") return "claro";
  if (cfg.modo === "escuro") return "escuro";
  return sistemaEscuro ? "escuro" : "claro";
}
