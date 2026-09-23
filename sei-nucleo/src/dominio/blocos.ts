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

import type { OpcoesEscrita, ResultadoEscrita } from "./escrita";
import { Formulario, normalizar } from "../formulario/formulario";
import { linksAssinados, parametros } from "../links/links";
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

/** A tela do bloco com o valor do checkbox de cada linha (`idDocumento-idBloco`), que a assinatura em lote exige. */
async function abrirBloco(
  sei: Sei,
  numero: string,
  o: { tipo?: TipoBloco; sinal?: AbortSignal },
): Promise<{ bloco: Bloco; pagina: Pagina; linhas: Array<{ campo: string; item: string; dados: ItemDoBloco }> }> {
  const bloco = await acharBloco(sei, numero, o.tipo, { sinal: o.sinal });
  if (!bloco.link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI n\u00E3o oferece abrir o bloco ${numero}.`);
  const pagina = await sei.http.obter(bloco.link, { sinal: o.sinal, aceitarValidacao: true });
  if (parametros(pagina.url).get("acao") !== "rel_bloco_protocolo_listar") {
    throw new ErroSei("SEI_RESPOSTA_INESPERADA", `A tela do bloco ${numero} n\u00E3o veio como esperado.`);
  }
  const tabela = pagina.doc.querySelector("#tblProtocolosBlocos");
  const col = colunas(tabela);
  const linhas: Array<{ campo: string; item: string; dados: ItemDoBloco }> = [];
  for (const tr of tabela?.querySelectorAll("tr") ?? []) {
    const chk = tr.querySelector("input[type=checkbox]");
    if (!chk) continue;
    const tds = [...tr.querySelectorAll("td")];
    const celula = (nome: string) => (col[nome] === undefined ? "" : textoDe(tds[col[nome]]).replace(/\s+/g, " ").trim());
    const documento = celula("documento");
    const assinaturas = col.assinaturas === undefined ? [] : lista(textoDe(tds[col.assinaturas]));
    const anotacao = celula("anotacoes");
    linhas.push({
      campo: chk.getAttribute("name") ?? "",
      item: chk.getAttribute("value") ?? "",
      dados: {
        sequencia: celula("seq"),
        processo: celula("processo"),
        tipo: celula("tipo"),
        ...(documento ? { documento } : {}),
        ...(assinaturas.length ? { assinaturas } : {}),
        ...(anotacao ? { anotacao } : {}),
      },
    });
  }
  return { bloco, pagina, linhas };
}

/** Conteúdo de um bloco, na ordem da tela: documentos (assinatura) ou processos (interno). */
export async function conteudoDoBloco(
  sei: Sei,
  numero: string,
  o: { tipo?: TipoBloco; sinal?: AbortSignal } = {},
): Promise<{ bloco: Bloco; itens: ItemDoBloco[] }> {
  const { bloco, linhas } = await abrirBloco(sei, numero, o);
  return { bloco, itens: linhas.map((l) => l.dados) };
}

/**
 * Assina, de uma vez, os documentos de um bloco de assinatura — o que a tela
 * faz com o botão "Assinar" depois de marcar as caixas.
 *
 * O caminho é o do próprio SEI: a lista do bloco (`#frmRelBlocoProtocoloLista`)
 * é postada para `documento_assinar` com os itens marcados em
 * `hdnInfraItensSelecionados` (`idDocumento-idBloco`, separados por vírgula);
 * o SEI responde com a tela de assinatura, a mesma de um documento só.
 *
 * Sem `senha`, é a prévia: diz o que seria assinado e devolve os cargos em
 * `dados.cargos`. Quem já assinou fica de fora — assinar de novo não faz nada
 * e só confundiria a prévia.
 */
export async function assinarBloco(
  sei: Sei,
  numero: string,
  a: { documentos?: string[]; cargo?: string; senha?: string },
  op: OpcoesEscrita,
): Promise<ResultadoEscrita> {
  const { bloco, pagina, linhas } = await abrirBloco(sei, numero, { tipo: "assinatura", sinal: op.sinal });
  if (bloco.tipo !== "assinatura") throw new ErroSei("ARGUMENTO_INVALIDO", `O bloco ${numero} \u00E9 interno: bloco interno n\u00E3o se assina.`);
  const usuario = sei.contexto().usuario.nome;
  const pedidos = (a.documentos ?? []).map((d) => String(d).trim()).filter(Boolean);
  const escolhidas = pedidos.length ? linhas.filter((l) => pedidos.includes(l.dados.documento ?? "")) : linhas;
  if (pedidos.length) {
    const faltando = pedidos.filter((d) => !linhas.some((l) => l.dados.documento === d));
    if (faltando.length) throw new ErroSei("ARGUMENTO_INVALIDO", `O bloco ${numero} n\u00E3o tem ${faltando.join(", ")}.`);
  }
  // A coluna de assinaturas junta nome e cargo sem separador confiável
  // ("Coordenador(a)Fulano de Tal"), então a checagem é por CONTER o nome.
  const assinou = (l: { dados: ItemDoBloco }) => normalizar((l.dados.assinaturas ?? []).join(" ")).includes(normalizar(usuario));
  const pendentes = escolhidas.filter((l) => !assinou(l));
  const base: ResultadoEscrita = {
    alvo: `bloco ${bloco.numero}`,
    mudancas: pendentes.map((l) => ({
      campo: `Documento ${l.dados.documento}`,
      antes: (l.dados.assinaturas ?? []).length ? `assinado por ${(l.dados.assinaturas ?? [])[0]}` : "sem assinatura",
      depois: `assinado por ${usuario}${a.cargo ? ` (${a.cargo})` : ""}`,
    })),
    aplicado: false,
    resumo: "",
  };
  if (!pendentes.length) {
    return { ...base, resumo: `Voc\u00EA j\u00E1 assinou ${escolhidas.length === 1 ? "esse documento" : "todos esses documentos"} do bloco ${bloco.numero}.` };
  }

  // O POST abaixo só ABRE a tela de assinatura (é o que o botão da tela faz);
  // quem assina é o segundo envio, com a senha.
  // O link da assinatura em lote é o que NÃO traz `id_documento`: os primeiros
  // `documento_assinar` do HTML são os de cada linha, e usá-los assinaria o
  // documento daquela linha — não a seleção.
  const link = linksAssinados(pagina.html).find((l) => {
    const q = parametros(l);
    return q.get("acao") === "documento_assinar" && !q.get("id_documento") && q.get("id_bloco");
  });
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI n\u00E3o oferece assinar o bloco ${bloco.numero} (ele pode estar conclu\u00EDdo ou ser de outra unidade).`);
  // A seleção vai como a tela manda: os checkboxes marcados E a lista escondida.
  const selecao = Formulario.de(pagina, "#frmRelBlocoProtocoloLista", sei.http).definir({
    hdnInfraItensSelecionados: pendentes.map((l) => l.item).join(","),
    hdnInfraItemId: "",
    ...Object.fromEntries(pendentes.map((l) => [l.campo, l.item])),
  });
  const tela = await sei.http.enviar(link, selecao.pares(), { sinal: op.sinal, aceitarValidacao: true });
  const form = Formulario.de(tela, "#frmAssinaturas", sei.http);
  // Trava: a tela de assinatura diz quais documentos vai assinar. Se não forem
  // exatamente os escolhidos, nada é enviado — assinar documento errado não se desfaz.
  const idsNaTela = (form.valor("hdnIdDocumentos") ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  const idsEscolhidos = pendentes.map((l) => l.item.split("-")[0]);
  const iguais = idsNaTela.length === idsEscolhidos.length && idsEscolhidos.every((x) => idsNaTela.includes(x));
  if (idsNaTela.length && !iguais) {
    throw new ErroSei(
      "SEI_RESPOSTA_INESPERADA",
      `A tela de assinatura do bloco ${bloco.numero} veio com outros documentos (${idsNaTela.join(", ")}) e nada foi assinado.`,
    );
  }
  const cargos = form.opcoes("selCargoFuncao").filter((o) => o.valor && o.valor !== "null").map((o) => o.texto);
  const previa: ResultadoEscrita = {
    ...base,
    resumo: `Vai assinar ${pendentes.length} documento(s) do bloco ${bloco.numero}.`,
    dados: { cargos: cargos.join("|") },
  };
  if (!op.aplicar) return previa;
  if (!a.senha || !a.cargo) throw new ErroSei("ARGUMENTO_INVALIDO", "Para assinar \u00E9 preciso cargo e senha, informados pelo usu\u00E1rio.");

  const orgaoUsuario = normalizar(sei.contexto().usuario.orgao ?? "");
  const orgao = form.opcoes("selOrgao").find((o) => o.valor !== "null" && normalizar(o.texto) === orgaoUsuario);
  if (orgao) form.definir({ selOrgao: orgao.valor });
  form.escolher("selCargoFuncao", a.cargo);
  form.definir({ pwdSenha: a.senha, hdnFormaAutenticacao: "S" });
  await form.enviar({ sinal: op.sinal, operacao: `a assinatura do bloco ${bloco.numero}` });

  // Prova: a própria tela do bloco tem que passar a mostrar o usuário assinando.
  const depois = await abrirBloco(sei, numero, { tipo: "assinatura", sinal: op.sinal });
  const alvo = new Set(pendentes.map((l) => l.item));
  const faltou = depois.linhas.filter((l) => alvo.has(l.item) && !assinou(l));
  if (faltou.length) {
    throw new ErroSei(
      "SEI_RESPOSTA_INESPERADA",
      `O SEI n\u00E3o registrou a sua assinatura em ${faltou.map((l) => l.dados.documento).join(", ")} (senha ou cargo incorretos?).`,
    );
  }
  return { ...previa, aplicado: true, resumo: `${pendentes.length} documento(s) do bloco ${bloco.numero} assinados.`, dados: {} };
}
