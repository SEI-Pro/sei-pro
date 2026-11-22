import { escaparHtml } from "./html";
import { urlHttpValida } from "./url";

/**
 * API de Legislacao do SEI Pro (`https://legis.seipro.app/v1`; CORS liberado para as paginas do SEI, medido no SP e na
 * ANTAQ): GET `/normas` busca com filtros e POST `/normas/resolver` traduz siglas ("Lei12527", "LC101", "Cf",
 * "Lei14133/2021") em normas. A rede e injetada (`Contexto.fetch`).
 */
export const URL_LEGIS_API = "https://legis.seipro.app/v1";
export const LIMITE_BUSCA = 50;

export type Rede = (url: string, init?: RequestInit) => Promise<Response>;

/** A norma como o dialogo e a ancora a usam. */
export interface Norma {
  sigla: string;
  titulo: string;
  curto: string;
  apelido: string;
  /** So http(s): qualquer outro esquema (`javascript:`...) vira "" e a norma entra sem link. */
  url: string;
  ementa: string;
  revogada: boolean;
}

interface NormaApi {
  tipo?: string;
  numero?: string | number;
  titulo?: string;
  titulo_curto?: string;
  apelido?: string;
  url?: string;
  urn?: string;
  ementa?: string;
  situacao?: string;
}

/** tipo da API (`tipo_urn`) -> prefixo da sigla gravada em `data-norma` (o formato dos documentos ja escritos). */
const PREFIXO_TIPO: Record<string, string> = {
  lei: "Lei",
  "lei.complementar": "LC",
  decreto: "Dec",
  "decreto.lei": "DecLei",
  "medida.provisoria": "Mp",
  "emenda.constitucional": "Ec",
  "decreto.legislativo": "DecLeg",
  resolucao: "Res",
};

/** "Lei nº 556, de 25 de junho de 1850" -> "Lei nº 556, de 1850" (citacao repetida). */
export function tituloCurto(titulo: string | undefined): string {
  const t = String(titulo ?? "");
  const partes = t.split(",");
  const ano = /(\d{4})\s*$/.exec(t);
  return partes.length > 1 && ano ? `${(partes[0] ?? "").trim()}, de ${ano[1]}` : t;
}

/** Tira os sufixos do apelido do Senado ("Código Civil (2002) (CC)") e descarta caixa alta (no documento pareceria grito). */
export function apelidoLimpo(apelido: string | undefined): string {
  let texto = String(apelido ?? "")
    .replace(/\s+/g, " ")
    .trim();
  while (/\s*\([^()]*\)$/.test(texto)) texto = texto.replace(/\s*\([^()]*\)$/, "").trim();
  return !texto || texto === texto.toUpperCase() ? "" : texto;
}

const urlSegura = (u: string): string => (urlHttpValida(u) ? u : "");

export function normaDaApi(n: NormaApi): Norma {
  const sigla =
    n.tipo === "constituicao"
      ? "Cf"
      : (PREFIXO_TIPO[n.tipo ?? ""] ?? String(n.tipo ?? "").replace(/[^A-Za-z]/g, "")) + String(n.numero ?? "").replace(/[^0-9-]/g, "");
  return {
    sigla,
    titulo: n.titulo || n.titulo_curto || "",
    curto: n.titulo_curto || tituloCurto(n.titulo),
    apelido: apelidoLimpo(n.apelido),
    url: urlSegura(n.url || (n.urn ? `https://normas.leg.br/?urn=${n.urn}` : "")),
    ementa: n.ementa || "",
    revogada: n.situacao === "revogada",
  };
}

/** A ancora da norma no documento. Primeira citacao: titulo completo + apelido; repetida: titulo curto. Tudo escapado; sem URL http(s), sem `href`. */
export function htmlDaAncora(norma: Norma, repetida: boolean): string {
  const e = escaparHtml;
  const texto = repetida ? e(norma.curto || norma.titulo) : e(norma.titulo) + (norma.apelido ? `&nbsp;(${e(norma.apelido)})` : "");
  const link = norma.url ? ` href="${e(norma.url)}" target="_blank"` : "";
  return `<a class="ancoraSei legisSeiPro" data-norma="${e(norma.sigla)}" data-normafull="${e(norma.titulo)}" data-index="0"${link}>${texto}</a>`;
}

export interface Filtros {
  q?: string;
  tipo?: string;
  numero?: number | string;
  ano?: string;
  periodo?: string;
}

export interface RespostaBusca {
  total: number;
  normas: Norma[];
}

/** GET /normas. Filtro vazio nao vai na URL. Rejeita em falha de rede ou HTTP != 2xx. */
export async function buscarNormas(rede: Rede, base: string, filtros: Filtros): Promise<RespostaBusca> {
  const params = new URLSearchParams({ per_page: String(LIMITE_BUSCA) });
  for (const [nome, valor] of Object.entries(filtros))
    if (valor !== "" && valor !== null && valor !== undefined) params.set(nome, String(valor));
  const resposta = await rede(`${base}/normas?${params}`);
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  const corpo = (await resposta.json()) as { itens?: NormaApi[]; total?: number } | null;
  const normas = (corpo?.itens ?? []).map(normaDaApi);
  return { total: corpo?.total ?? normas.length, normas };
}

/**
 * POST /normas/resolver: sigla pedida -> norma. Sigla sem norma fica de fora do mapa. API fora do ar tambem, A NAO SER
 * que `estrito` (quem precisa dizer "o servico caiu" em vez de "nao achei": rejeita em rede ou HTTP != 2xx).
 */
export async function resolverSiglas(rede: Rede, base: string, siglas: string[], estrito = false): Promise<Record<string, Norma>> {
  const pedidas: string[] = [];
  for (const s of siglas) {
    const ref = String(s ?? "")
      .trim()
      .slice(0, 60);
    if (ref && !pedidas.includes(ref)) pedidas.push(ref);
  }
  const achadas: Record<string, Norma> = {};
  if (!pedidas.length) return achadas;
  try {
    const resposta = await rede(`${base}/normas/resolver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refs: pedidas.slice(0, 200) }),
    });
    if (!resposta.ok) {
      if (estrito) throw new Error(`HTTP ${resposta.status}`);
      return achadas;
    }
    const corpo = (await resposta.json()) as { resultados?: Record<string, NormaApi | null> } | null;
    for (const [ref, n] of Object.entries(corpo?.resultados ?? {})) if (n) achadas[ref] = normaDaApi(n);
  } catch (e) {
    if (estrito) throw e;
    /* API fora do ar: ninguem achado */
  }
  return achadas;
}

/** Periodo do dialogo -> parametro da API. */
export const periodoDaApi = (periodo: string): string => ({ ano: "exato", ate: "ate", apos: "apos" })[periodo as "ano"] ?? "exato";

/** Numero digitado ("12.527", "2200-2", "8666/93") -> inteiro da API (`""` se nao ha digito). */
export function numeroDaApi(numero: string): number | "" {
  const n = String(numero ?? "")
    .split(/[/-]/)[0]
    ?.replace(/[^0-9]+/g, "");
  return n ? Number.parseInt(n, 10) : "";
}

/** Tipo pela selecao do editor ("Lei Complementar nº 101" -> lei.complementar). A ordem importa ("decreto-lei" antes de "decreto"). */
export function tipoDaSelecao(texto: string): string {
  const t = String(texto ?? "").toLowerCase();
  if (/emenda constitucional|\bec\b/.test(t)) return "emenda.constitucional";
  if (/decreto legislativo/.test(t)) return "decreto.legislativo";
  if (/lei complementar|\blc\b/.test(t)) return "lei.complementar";
  if (/decreto-lei|decreto lei|\bdl\b/.test(t)) return "decreto.lei";
  if (/medida provis[o\u00f3]ria|\bmp\b/.test(t)) return "medida.provisoria";
  if (/decreto|\bdec\b/.test(t)) return "decreto";
  if (/\blei\b/.test(t)) return "lei";
  return "";
}
