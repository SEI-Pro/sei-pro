/**
 * Aprender um fluxo a partir de processos que já percorreram o rito inteiro.
 *
 * A LLM NÃO decide rito. Ela recebe METADADOS — títulos na ordem da árvore,
 * unidade geradora, se está assinado, se é anexo, e o histórico com datas — e
 * propõe uma sequência de etapas. Conteúdo de documento não entra aqui: o que
 * sai do navegador nesta chamada é a lista de títulos, não os autos.
 *
 * O resultado é PROPOSTA: entra como `origem: "inferido"`, desligado, com os
 * processos citados, para o usuário editar e salvar. Precedente não é norma —
 * o fluxo inferido é uma leitura do que foi feito, não do que deveria ser.
 *
 * O parse é deliberadamente tolerante. Modelo devolve JSON com texto em volta,
 * com cerca de código, com campo que ninguém pediu e com etapa pela metade;
 * estourar a tela por causa disso seria transformar um detalhe do provedor em
 * erro do usuário. O que não dá para consertar vira AVISO visível, nunca
 * descarte silencioso.
 */

import { etapaNova, fluxoNovo, type Etapa, type Fluxo } from "./modelo";
import type { Provedor, Uso } from "../motor/tipos";

export interface DocumentoModelo {
  /** Posição na árvore (a ordem é cronológica). */
  ordem: number;
  titulo: string;
  unidade?: string;
  assinado: boolean;
  /** Anexo (PDF, imagem): candidato natural a documento acessório. */
  externo?: boolean;
}

export interface AndamentoModelo {
  data: string;
  unidade?: string;
  descricao: string;
}

export interface ProcessoModelo {
  protocolo: string;
  tipo?: string;
  documentos: DocumentoModelo[];
  historico?: AndamentoModelo[];
}

export interface Proposta {
  nome: string;
  etapas: Etapa[];
  /** O que divergiu entre os modelos ("em 2 de 3 veio Despacho antes do Ofício"). */
  divergencias: string[];
  /** O que o parse teve de descartar, para a tela mostrar em vez de esconder. */
  avisos: string[];
}

const INSTRUCOES = `Você recebe os METADADOS de processos administrativos do SEI que já percorreram o rito inteiro. Sua tarefa é descrever o RITO que eles têm em comum, como uma sequência de etapas.

Separe ETAPA DO RITO de DOCUMENTO ACESSÓRIO:
- etapa do rito: o documento que marca uma fase (Nota Técnica, Despacho de aprovação, Ofício, Parecer, Termo);
- acessório: anexo, comprovante, e-mail, planilha, documento externo juntado como prova e despacho de mero encaminhamento. Acessório NÃO vira etapa.

Regras:
- use o título como ele aparece na árvore, e liste as variações plausíveis do mesmo documento em "tituloContem" ("Nota Técnica", "NT");
- marque "assinado": true só quando a etapa só faz sentido com o documento assinado;
- marque "obrigatoria": false quando o documento aparece em alguns processos e falta em outros;
- não invente etapa que não apareça em nenhum dos processos.

Responda SÓ com um objeto JSON, sem texto em volta, neste formato:
{"nome":"nome curto do rito","etapas":[{"nome":"Despacho de aprovação","documento":{"tituloContem":["Despacho"],"assinado":true},"obrigatoria":true,"acao":{"titulo":"Preparar despacho de aprovação","pedido":"texto do pedido ao agente"}}],"divergencias":["o que variou entre os processos"]}`;

/** Bloco de um processo modelo: só o que a árvore e o histórico mostram. */
function blocoDoProcesso(m: ProcessoModelo, i: number, total: number): string {
  const cabeca = total > 1 ? `## Processo modelo ${i + 1}: ${m.protocolo}` : `## Processo modelo: ${m.protocolo}`;
  const linhas = m.documentos.map((d) => {
    const selos = [d.assinado ? "assinado" : "sem assinatura", d.externo ? "anexo (documento externo)" : null, d.unidade ? `unidade ${d.unidade}` : null].filter(Boolean);
    return `${d.ordem}. ${d.titulo} — ${selos.join(", ")}`;
  });
  const hist = (m.historico ?? []).map((a) => `- ${a.data}${a.unidade ? ` (${a.unidade})` : ""}: ${a.descricao}`);
  return [
    cabeca,
    m.tipo ? `Tipo do processo: ${m.tipo}` : null,
    "",
    "Documentos, na ordem da árvore (a ordem é cronológica):",
    ...linhas,
    hist.length ? "\nAndamentos:" : null,
    ...hist,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export function promptDeInferencia(modelos: ProcessoModelo[]): string {
  const alerta =
    modelos.length > 1
      ? "São vários processos modelo: descreva o rito COMUM e liste em \"divergencias\" o que variou entre eles, dizendo em quantos apareceu (\"em 2 de 3 veio Despacho antes do Ofício\")."
      : "É um só processo modelo: um único caso generaliza mal. Seja conservador, e use \"divergencias\" para dizer o que ficou em dúvida por faltar outro exemplo.";
  return `${INSTRUCOES}\n\n${alerta}\n\n${modelos.map((m, i) => blocoDoProcesso(m, i, modelos.length)).join("\n\n")}`;
}

/** O JSON de dentro da resposta: o modelo gosta de escrever antes e depois, e de cercar com ```. */
function extrairJson(bruto: string): unknown {
  const semCerca = bruto.replace(/```(?:json)?\s*([\s\S]*?)```/i, "$1");
  const i = semCerca.indexOf("{");
  const f = semCerca.lastIndexOf("}");
  if (i < 0 || f <= i) throw new Error("O modelo não devolveu um fluxo em JSON. Tente de novo, ou monte o fluxo à mão.");
  try {
    return JSON.parse(semCerca.slice(i, f + 1));
  } catch {
    throw new Error("A resposta do modelo veio com JSON quebrado. Tente de novo, ou monte o fluxo à mão.");
  }
}

const textos = (v: unknown): string[] => {
  if (typeof v === "string") return v.trim() ? [v.trim()] : [];
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string" && Boolean(x.trim())).map((x) => x.trim());
  return [];
};

/** Lê a proposta do modelo, descartando o que não dá para usar e dizendo o que descartou. */
export function lerProposta(bruto: string): Proposta {
  const cru = extrairJson(bruto) as Record<string, unknown>;
  const avisos: string[] = [];
  const etapas: Etapa[] = [];

  for (const item of Array.isArray(cru.etapas) ? (cru.etapas as Record<string, unknown>[]) : []) {
    if (!item || typeof item !== "object") continue;
    const doc = item.documento as Record<string, unknown> | string | undefined;
    // "documento": "Nota Técnica" e "tituloContem": "Nota" são erros comuns do
    // modelo e não custam nada de aceitar.
    const titulos = typeof doc === "string" ? textos(doc) : textos(doc?.tituloContem);
    const nome = typeof item.nome === "string" && item.nome.trim() ? item.nome.trim() : titulos[0];
    if (!titulos.length) {
      avisos.push(`A etapa "${typeof item.nome === "string" && item.nome.trim() ? item.nome.trim() : "sem nome"}" veio sem dizer que documento a caracteriza e foi descartada.`);
      continue;
    }
    const etapa = etapaNova(nome!);
    etapa.documento = { tituloContem: titulos };
    if (typeof doc === "object" && typeof doc?.assinado === "boolean") etapa.documento.assinado = doc.assinado;
    if (typeof doc === "object" && typeof doc?.daMinhaUnidade === "boolean") etapa.documento.daMinhaUnidade = doc.daMinhaUnidade;
    etapa.obrigatoria = item.obrigatoria !== false;
    const acao = item.acao as Record<string, unknown> | undefined;
    if (acao && typeof acao.pedido === "string" && acao.pedido.trim()) {
      etapa.acao = { titulo: typeof acao.titulo === "string" && acao.titulo.trim() ? acao.titulo.trim() : `Preparar ${nome}`, pedido: acao.pedido.trim() };
    } else if (acao) {
      avisos.push(`A ação proposta para "${nome}" veio sem o pedido ao agente e foi descartada.`);
    }
    const cond = item.condicao as Record<string, unknown> | undefined;
    if (cond && typeof cond.seDocumentoContem === "string" && typeof cond.entaoIrPara === "string") {
      etapa.condicao = { seDocumentoContem: cond.seDocumentoContem, entaoIrPara: cond.entaoIrPara };
    }
    etapas.push(etapa);
  }

  if (!etapas.length) throw new Error("O modelo não achou etapa nenhuma nesses processos. Tente com outro processo modelo, ou monte o fluxo à mão.");

  // O modelo inventa o id do destino do desvio; aqui os ids são nossos. Um
  // desvio para etapa que não existe reprovaria o fluxo inteiro na validação,
  // então ele sai — e o usuário fica sabendo.
  const porNome = new Map(etapas.map((e) => [e.nome.toLowerCase(), e.id]));
  const ids = new Set(etapas.map((e) => e.id));
  for (const e of etapas) {
    if (!e.condicao) continue;
    const destino = ids.has(e.condicao.entaoIrPara) ? e.condicao.entaoIrPara : porNome.get(e.condicao.entaoIrPara.toLowerCase());
    if (destino) e.condicao = { ...e.condicao, entaoIrPara: destino };
    else {
      avisos.push(`O desvio proposto na etapa "${e.nome}" apontava para uma etapa inexistente e foi descartado.`);
      delete e.condicao;
    }
  }

  return {
    nome: typeof cru.nome === "string" && cru.nome.trim() ? cru.nome.trim() : etapas[0].nome,
    etapas,
    divergencias: textos(cru.divergencias),
    avisos,
  };
}

export interface Inferencia {
  fluxo: Fluxo;
  divergencias: string[];
  avisos: string[];
  uso?: Uso;
}

/**
 * Uma chamada por rodada, com metadados. O fluxo volta desligado, já mirando o
 * tipo dos processos modelo, para o usuário conferir e salvar.
 */
export async function inferirFluxo(provedor: Provedor, modelos: ProcessoModelo[], sinal: AbortSignal): Promise<Inferencia> {
  if (!modelos.length) throw new Error("Informe ao menos um processo que já tenha percorrido o fluxo inteiro.");
  const r = await provedor.conversar(
    { mensagens: [{ role: "user", content: promptDeInferencia(modelos) }], tools: [] },
    sinal,
    () => undefined,
  );
  const proposta = lerProposta(r.texto);
  const tipos = [...new Set(modelos.map((m) => m.tipo).filter((t): t is string => Boolean(t?.trim())))];
  const fluxo: Fluxo = {
    ...fluxoNovo(proposta.nome),
    aplicaSe: tipos.length ? { tipoProcessoContem: tipos } : {},
    etapas: proposta.etapas,
    modelos: modelos.map((m) => ({ protocolo: m.protocolo, quando: Date.now() })),
    origem: "inferido",
  };
  return { fluxo, divergencias: proposta.divergencias, avisos: proposta.avisos, uso: r.uso };
}
