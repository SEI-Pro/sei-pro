/**
 * Opções que o painel respeita, com as MESMAS chaves do legado (quem personalizou o menu não perde nada):
 *  - localStorage da origem do SEI: `configViewFlashPanelArvorePro` (quais painéis), `optionsPro`
 *    (`panelDadosArvorePro_<tipo>` aberto/recolhido e `optionsFlashMenu_panelinfo` liga/desliga);
 *  - chrome.storage.sync `dataValues`: `infoarvore` (checkConfigValue), `reaberturaprogramada` e `disablequery`
 *    (verifyConfigValue), lidas por `@comum/opcoes/legadas`.
 * Nenhuma depende do "menu rápido" (`selectedItensPanelArvore` do legado).
 */
import type { TipoPainel } from "../modelo/paineis";

type Armazenamento = Pick<Storage, "getItem" | "setItem"> & Partial<Pick<Storage, "removeItem">>;

const CHAVE_SELECAO = "configViewFlashPanelArvorePro";
const CHAVE_OPCOES = "optionsPro";

function json(a: Armazenamento, chave: string): unknown {
  try {
    const bruto = a.getItem(chave);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

/** Nomes escolhidos na personalização (`[["Anotações"],["Marcador"],...]`); null = nunca personalizou. */
export function lerSelecao(a: Armazenamento): string[] | null {
  const v = json(a, CHAVE_SELECAO);
  if (!Array.isArray(v) || !v.length) return null;
  const nomes = v.map((x) => (Array.isArray(x) ? x[0] : x)).filter((x): x is string => typeof x === "string");
  return nomes.length ? nomes : null;
}

export function opcoes(a: Armazenamento): Record<string, unknown> {
  const v = json(a, CHAVE_OPCOES);
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

/**
 * Uma opção do legado (`getOptionsPro`): vive em `optionsPro`; as versões mais antigas gravavam a chave solta no
 * localStorage (`optionsFlashMenu_menudoc` = `"disabled"`), e o legado a movia para dentro do `optionsPro` na primeira
 * leitura (`updateOptionsPro`). Aqui a chave solta vale quando o `optionsPro` ainda não tem a opção.
 */
export function valorDaOpcao(a: Armazenamento, item: string): unknown {
  const o = opcoes(a)[item];
  if (o !== undefined && o !== null) return o;
  const solta = json(a, item);
  if (solta !== null) return solta;
  try {
    const bruto = a.getItem(item);
    return bruto === "enabled" || bruto === "disabled" ? bruto : undefined;
  } catch {
    return undefined;
  }
}

/** Grava uma opção como o legado (`setOptionsPro`): dentro do `optionsPro`, sem mexer nas outras, e some a chave solta antiga. */
export function gravarOpcao(a: Armazenamento, item: string, valor: unknown): void {
  const o = opcoes(a);
  o[item] = valor;
  a.setItem(CHAVE_OPCOES, JSON.stringify(o));
  try {
    a.removeItem?.(item);
  } catch {
    // sem remoção: a chave solta fica, e o optionsPro (que vale primeiro) já tem a opção
  }
}

/** O painel de informações da árvore está ligado? (O legado só desliga com "disabled".) */
export function painelLigado(a: Armazenamento): boolean {
  return valorDaOpcao(a, "optionsFlashMenu_panelinfo") !== "disabled";
}

export function painelAberto(a: Armazenamento, tipo: TipoPainel): boolean {
  return opcoes(a)[`panelDadosArvorePro_${tipo}`] !== "hide";
}

export function gravarAberto(a: Armazenamento, tipo: TipoPainel, aberto: boolean): void {
  try {
    const o = opcoes(a);
    o[`panelDadosArvorePro_${tipo}`] = aberto ? "visible" : "hide";
    a.setItem(CHAVE_OPCOES, JSON.stringify(o));
  } catch {
    // sem localStorage (janela privada, cota): o painel só não lembra o estado
  }
}

/**
 * Lista personalizada do menu (`configViewFlashMenuPro`, `configViewFlashDocMenuPro`, `configViewFlashDocArvorePro`):
 * `[["Copiar número SEI"],["Duplicar documento"],...]`, na ordem escolhida. null = nunca personalizou (vale o padrão).
 */
export function lerListaDoMenu(a: Armazenamento, chave: string): string[] | null {
  const v = json(a, chave);
  if (!Array.isArray(v) || !v.length) return null;
  const nomes = v.map((x) => (Array.isArray(x) ? x[0] : x)).filter((x): x is string => typeof x === "string");
  return nomes.length ? nomes : null;
}

/** O bloco do menu (`menuproc`, `menudoc`, `iconstree`) está ligado? O legado só desliga com "disabled". */
export function blocoDoMenuLigado(a: Armazenamento, bloco: "menuproc" | "menudoc" | "iconstree"): boolean {
  return valorDaOpcao(a, `optionsFlashMenu_${bloco}`) !== "disabled";
}

/**
 * Filtros da pesquisa "processos deste interessado", com as MESMAS chaves do legado (`optionsPro`): a escolha de quem já
 * usava não se perde. O legado gravava um booleano; aceita também o texto.
 */
export interface FiltroDoInteressado {
  tramitadoNaUnidade: boolean;
  mesmaNatureza: boolean;
}

const verdadeiro = (v: unknown): boolean => v === true || v === "true";

export function lerFiltroDoInteressado(a: Armazenamento): FiltroDoInteressado {
  const o = opcoes(a);
  return {
    tramitadoNaUnidade: verdadeiro(o.panelDadosArvoreInteressados_tramiteUnidade),
    mesmaNatureza: verdadeiro(o.panelDadosArvoreInteressados_mesmaNatureza),
  };
}

export function gravarFiltroDoInteressado(a: Armazenamento, f: FiltroDoInteressado): void {
  try {
    const o = opcoes(a);
    o.panelDadosArvoreInteressados_tramiteUnidade = f.tramitadoNaUnidade;
    o.panelDadosArvoreInteressados_mesmaNatureza = f.mesmaNatureza;
    a.setItem(CHAVE_OPCOES, JSON.stringify(o));
  } catch {
    // sem localStorage: o filtro só vale nesta abertura
  }
}
