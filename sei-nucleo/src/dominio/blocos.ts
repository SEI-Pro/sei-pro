/**
 * Blocos de assinatura e blocos internos (`bloco_assinatura_listar`,
 * `bloco_interno_listar`, `rel_bloco_protocolo_listar`).
 *
 * O bloco é como a unidade junta documentos para assinar de uma vez ou para
 * outra unidade trabalhar neles. A listagem traz número, estado (Gerado,
 * Disponibilizado, Retornado, Concluído), unidade geradora, as unidades a quem
 * foi disponibilizado, grupo e descrição; o número abre a relação de
 * documentos, que é outra tela (`rel_bloco_protocolo_listar&id_bloco=N`).
 *
 * Só leitura, por enquanto: incluir documento, assinar o bloco e disponibilizar
 * mexem em telas com confirmação própria e ficaram para depois.
 *
 * Substitui no legado: nada — o SEI Pro não tinha nada de blocos.
 */

import { normalizar } from "../formulario/formulario";
import { parametros } from "../links/links";
import { textoDe } from "../sessao/dom";
import { ErroSei } from "../sessao/erros";
import type { OpcoesHttp, Pagina } from "../sessao/http";
import type { Sei } from "../sei";

export type TipoBloco = "assinatura" | "interno";

export interface Bloco {
  numero: string;
  tipo: TipoBloco;
  /** Gerado, Disponibilizado, Retornado, Concluído. */
  estado: string;
  descricao: string;
  /** Unidade que gerou o bloco. */
  geradora: string;
  /** Unidades a quem o bloco foi disponibilizado. */
  disponibilizado: string[];
  grupo: string;
  atribuido: string;
  /** Link da relação de documentos (`rel_bloco_protocolo_listar`). */
  link: string;
}

/**
 * Linha do conteúdo de um bloco. No bloco de ASSINATURA cada linha é um
 * DOCUMENTO (com processo, nº SEI e quem já assinou); no bloco INTERNO é um
 * PROCESSO (sem documento e sem assinaturas) — a tela tem colunas diferentes.
 */
export interface ItemDoBloco {
  sequencia: string;
  processo: string;
  documento?: string;
  /** Tipo do documento (assinatura) ou do processo (interno). */
  tipo: string;
  assinaturas?: string[];
  anotacao?: string;
}

const ACAO: Record<TipoBloco, string> = {
  assinatura: "bloco_assinatura_listar",
  interno: "bloco_interno_listar",
};

/** Texto de uma célula, com as várias unidades separadas por barra virando lista. */
const lista = (texto: string): string[] =>
  texto
    .split(/[\n;/]|\s{2,}/)
    .map((x) => x.trim())
    .filter(Boolean);

/**
 * Colunas pelo CABEÇALHO, não pela posição: o bloco interno não tem a coluna
 * "Disponibilização" que o de assinatura tem, e contar índices trocaria grupo
 * por descrição — em silêncio.
 */
function colunas(tabela: Element | null): Record<string, number> {
  const mapa: Record<string, number> = {};
  const cabecalho = [...(tabela?.querySelectorAll("tr") ?? [])].find((tr) => tr.querySelector("th")) ?? tabela?.querySelector("tr");
  [...(cabecalho?.querySelectorAll("th, td") ?? [])].forEach((c, i) => {
    // "Seq." e "Nº" viram "seq" e "n": pontuação fora, só letras e números.
    const nome = normalizar(textoDe(c)).replace(/[^a-z0-9 ]/g, "").trim();
    if (nome) mapa[nome] = i;
  });
  return mapa;
}

function lerBlocos(p: Pagina, tipo: TipoBloco): Bloco[] {
  const tabela = p.doc.querySelector("#tblBlocos");
  const col = colunas(tabela);
  const blocos: Bloco[] = [];
  for (const tr of tabela?.querySelectorAll("tr") ?? []) {
    const chk = tr.querySelector("input[type=checkbox]");
    const numero = chk?.getAttribute("value") ?? "";
    if (!numero) continue;
    const tds = [...tr.querySelectorAll("td")];
    const celula = (nome: string) => (col[nome] === undefined ? "" : textoDe(tds[col[nome]]).replace(/\s+/g, " ").trim());
    const link = [...tr.querySelectorAll("a")]
      .map((a) => a.getAttribute("href") ?? "")
      .find((h) => h.includes("rel_bloco_protocolo_listar"));
    blocos.push({
      numero,
      tipo,
      estado: celula("estado"),
      descricao: celula("descricao"),
      geradora: celula("geradora"),
      disponibilizado: lista(celula("disponibilizacao")),
      grupo: celula("grupo"),
      atribuido: celula("atribuicao"),
      link: (link ?? "").replace(/&amp;/g, "&"),
    });
  }
  return blocos;
}

/** Blocos da unidade. `filtro` casa com número, descrição, estado ou grupo. */
export async function listarBlocos(
  sei: Sei,
  tipo: TipoBloco = "assinatura",
  o: { filtro?: string; sinal?: AbortSignal } = {},
): Promise<Bloco[]> {
  const p = await sei.http.obter(sei.linkMenu(ACAO[tipo]), { sinal: o.sinal, aceitarValidacao: true });
  const todos = lerBlocos(p, tipo);
  if (!o.filtro) return todos;
  const f = o.filtro.toLowerCase();
  return todos.filter((b) => [b.numero, b.descricao, b.estado, b.grupo].join(" ").toLowerCase().includes(f));
}

/** Um bloco pelo número, procurando nos dois tipos quando não se sabe qual é. */
export async function acharBloco(sei: Sei, numero: string, tipo?: TipoBloco, op?: OpcoesHttp): Promise<Bloco> {
  for (const t of tipo ? [tipo] : (["assinatura", "interno"] as TipoBloco[])) {
    const achado = (await listarBlocos(sei, t, { sinal: op?.sinal })).find((b) => b.numero === String(numero).trim());
    if (achado) return achado;
  }
  throw new ErroSei("SEI_NAO_ENCONTRADO", `A unidade não tem o bloco ${numero} na lista de blocos${tipo ? ` de ${tipo}` : ""}.`);
}

/** Conteúdo de um bloco, na ordem da tela: documentos (assinatura) ou processos (interno). */
export async function conteudoDoBloco(
  sei: Sei,
  numero: string,
  o: { tipo?: TipoBloco; sinal?: AbortSignal } = {},
): Promise<{ bloco: Bloco; itens: ItemDoBloco[] }> {
  const bloco = await acharBloco(sei, numero, o.tipo, { sinal: o.sinal });
  if (!bloco.link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI não oferece abrir o bloco ${numero}.`);
  const p = await sei.http.obter(bloco.link, { sinal: o.sinal, aceitarValidacao: true });
  if (parametros(p.url).get("acao") !== "rel_bloco_protocolo_listar") {
    throw new ErroSei("SEI_RESPOSTA_INESPERADA", `A tela do bloco ${numero} não veio como esperado.`);
  }
  const tabela = p.doc.querySelector("#tblProtocolosBlocos");
  const col = colunas(tabela);
  const itens: ItemDoBloco[] = [];
  for (const tr of tabela?.querySelectorAll("tr") ?? []) {
    if (!tr.querySelector("input[type=checkbox]")) continue;
    const tds = [...tr.querySelectorAll("td")];
    const celula = (nome: string) => (col[nome] === undefined ? "" : textoDe(tds[col[nome]]).replace(/\s+/g, " ").trim());
    const documento = celula("documento");
    const assinaturas = col.assinaturas === undefined ? [] : lista(textoDe(tds[col.assinaturas]));
    const anotacao = celula("anotacoes");
    itens.push({
      sequencia: celula("seq"),
      processo: celula("processo"),
      tipo: celula("tipo"),
      ...(documento ? { documento } : {}),
      ...(assinaturas.length ? { assinaturas } : {}),
      ...(anotacao ? { anotacao } : {}),
    });
  }
  return { bloco, itens };
}
