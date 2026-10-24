/**
 * Processo: consulta de metadados e alteração.
 *
 * Os metadados vêm da tela "Consultar/Alterar Processo" (`procedimento_alterar`,
 * ou `procedimento_consultar` quando o processo não está aberto na unidade):
 * é a única tela que traz tipo, especificação, assuntos, interessados,
 * observações e nível numa só requisição, e é também a tela que grava.
 *
 * Substitui no legado: `ajaxDadosProcessoPro` (leitura de `propProcesso`),
 * `updateDadosArvore('Consultar/Alterar Processo', ...)`, `editFieldProc`,
 * `getChangeTypeProc`, `addUrgenteProcessoPro`.
 */

import { acaoNaArvore, type Arvore, type NivelAcesso } from "./arvore";
import { hipotesesDoFormulario, mudanca, NIVEIS, NOME_NIVEL, type OpcoesEscrita, type ResultadoEscrita } from "./escrita";
import { escolherItem, Formulario, type ItemLupa } from "../formulario/formulario";
import { lerNegados } from "./lupas";
import { linkDaAcao, parametros } from "../links/links";
import { textoDe } from "../sessao/dom";
import { ErroSei } from "../sessao/erros";
import type { Http, OpcoesHttp } from "../sessao/http";
import type { Sei } from "../sei";

export interface Processo {
  idProcedimento: string;
  protocolo: string;
  tipo: string;
  especificacao: string;
  assuntos: string[];
  interessados: string[];
  observacoes: string;
  nivel: NivelAcesso;
  hipotese?: string;
  marcadores: string[];
  /** Pode alterar (processo aberto na unidade). */
  editavel: boolean;
  documentos: number;
}

function textoOpcaoSelecionada(f: Formulario, nome: string): string {
  const v = f.valor(nome);
  return f.opcoes(nome).find((o) => o.valor === v && v !== "null")?.texto ?? "";
}

async function formularioProcesso(http: Http, arv: Arvore, op?: OpcoesHttp): Promise<{ form: Formulario; editavel: boolean }> {
  const alterar = acaoNaArvore(arv, "procedimento_alterar");
  const link = alterar ?? acaoNaArvore(arv, "procedimento_consultar");
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI n\u00E3o oferece a consulta do processo ${arv.protocolo} para voc\u00EA.`);
  return { form: await Formulario.abrir(http, link, "#frmProcedimentoCadastro", op), editavel: Boolean(alterar) };
}

function nomes(itens: ItemLupa[]): string[] {
  return itens.map((i) => i.texto).filter(Boolean);
}

export interface MetadadosProcesso {
  tipo: string;
  /** Id do tipo de processo (`hdnIdTipoProcedimento`), quando a tela o traz. */
  idTipo?: string;
  especificacao: string;
  assuntos: string[];
  interessados: string[];
  /** Os mesmos assuntos e interessados com o id que o formulário guarda (a lupa), na mesma ordem. */
  assuntosItens?: ItemLupa[];
  interessadosItens?: ItemLupa[];
  observacoes: string;
  /** Observações das OUTRAS unidades (tabela `#divObservacoesOutras`), quando a tela as mostra. */
  observacoesOutras: Array<{ unidade: string; observacao: string }>;
  editavel: boolean;
  /** Nível de acesso lido do formulário (cai no da árvore quando o formulário não o marca, ex.: campo desabilitado). */
  nivel: NivelAcesso;
  /** Hipótese legal (só restrito/sigiloso); cai na da árvore quando o formulário não traz a opção marcada. */
  hipotese?: string;
  /** Data de autuação ("dd/mm/aaaa"), do campo `hdnDtaGeracao` do formulário. Falta quando a tela não o traz. */
  autuacao?: string;
}

const NIVEL_POR_VALOR: Record<string, NivelAcesso> = { "0": "publico", "1": "restrito", "2": "sigiloso" };

/**
 * Metadados pelo link que a árvore já aberta oferece, sem buscar a árvore de novo
 * (buscar a árvore de processo aberto na unidade pode marcar "recebido"). Um GET.
 * Não checa sigilo: quem chama decide.
 */
export async function consultarDaArvore(http: Http, arv: Arvore, op?: OpcoesHttp): Promise<MetadadosProcesso> {
  const { form, editavel } = await formularioProcesso(http, arv, op);
  const nivel = NIVEL_POR_VALOR[form.valor("rdoNivelAcesso") ?? ""] ?? arv.nivel;
  const hipotese = nivel === "publico" ? undefined : textoOpcaoSelecionada(form, "selHipoteseLegal").trim() || arv.hipotese;
  const idTipo = (form.valor("hdnIdTipoProcedimento") ?? "").trim();
  const autuacao = (form.valor("hdnDtaGeracao") ?? form.valor("txtDtaGeracaoExibir") ?? "").trim();
  return {
    nivel,
    ...(hipotese ? { hipotese } : {}),
    tipo: textoOpcaoSelecionada(form, "selTipoProcedimento") || arv.tipo,
    ...(idTipo ? { idTipo } : {}),
    especificacao: form.valor("txtDescricao") ?? "",
    assuntos: nomes(form.itensLupa("selAssuntos")),
    interessados: nomes(form.itensLupa("selInteressadosProcedimento")),
    assuntosItens: form.itensLupa("selAssuntos"),
    interessadosItens: form.itensLupa("selInteressadosProcedimento"),
    observacoes: form.valor("txaObservacoes") ?? "",
    observacoesOutras: observacoesDasOutrasUnidades(form),
    editavel,
    ...(autuacao ? { autuacao } : {}),
  };
}

function observacoesDasOutrasUnidades(form: Formulario): Array<{ unidade: string; observacao: string }> {
  const saida: Array<{ unidade: string; observacao: string }> = [];
  for (const tr of form.pagina.doc.querySelectorAll("#divObservacoesOutras tbody tr")) {
    const td = [...tr.querySelectorAll("td")];
    const unidade = textoDe(td[0]);
    if (unidade) saida.push({ unidade, observacao: textoDe(td[1]) });
  }
  return saida;
}

export async function consultarProcesso(sei: Sei, referencia: string, op?: OpcoesHttp): Promise<Processo> {
  const arv = await sei.arvore(referencia, op);
  if (arv.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Processo sigiloso: o agente n\u00E3o atua nele.");
  const { nivel: _nivel, hipotese: _hipotese, observacoesOutras: _outras, ...meta } = await consultarDaArvore(sei.http, arv, op);
  return {
    idProcedimento: arv.idProcedimento,
    protocolo: arv.protocolo,
    ...meta,
    nivel: arv.nivel,
    hipotese: arv.hipotese,
    marcadores: arv.marcadores,
    documentos: arv.documentos.length,
  };
}

export interface AlteracaoProcesso {
  especificacao?: string;
  /** Nome (ou id) do tipo de processo. */
  tipo?: string;
  nivel?: "publico" | "restrito";
  /** Nome (ou id) da hipótese legal, obrigatória para restrito. */
  hipotese?: string;
  observacoes?: string;
  /** Substitui a lista de interessados (nomes exatamente como cadastrados, com id). */
  interessados?: ItemLupa[];
  /** Substitui a lista de assuntos (com id). O SEI exige ao menos um. */
  assuntos?: ItemLupa[];
}

/**
 * Itens que o SEI não deixa esta unidade retirar (acrescentados por outra): a tela nativa avisa e não tira; aqui a mesma
 * regra vale antes de enviar, com a mesma mensagem.
 */
function conferirNegados(atuais: ItemLupa[], novos: ItemLupa[], negados: Map<string, string>, rotulo: "Assunto" | "Interessado"): void {
  const ficam = new Set(novos.map((i) => i.id));
  for (const a of atuais) {
    const sigla = negados.get(a.id);
    if (sigla !== undefined && !ficam.has(a.id)) {
      throw new ErroSei("ARGUMENTO_INVALIDO", `${rotulo} "${a.texto}" n\u00E3o pode ser removido porque foi adicionado pela unidade ${sigla}.`);
    }
  }
}

/** Altera os metadados de um processo. Ver `escrita.ts` para `aplicar`. */
export async function alterarProcesso(
  sei: Sei,
  referencia: string,
  alt: AlteracaoProcesso,
  op: OpcoesEscrita,
): Promise<ResultadoEscrita> {
  const arv = await sei.arvore(referencia, { sinal: op.sinal });
  if (arv.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Processo sigiloso: o agente n\u00E3o atua nele.");
  const { form, editavel } = await formularioProcesso(sei.http, arv, { sinal: op.sinal });
  if (!editavel) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O processo ${arv.protocolo} n\u00E3o est\u00E1 aberto na sua unidade.`);

  const mudancas: ResultadoEscrita["mudancas"] = [];
  if (alt.especificacao !== undefined) {
    mudancas.push(...mudanca("Especifica\u00E7\u00E3o", form.valor("txtDescricao"), alt.especificacao));
    form.definir({ txtDescricao: alt.especificacao.slice(0, 100) });
  }
  if (alt.tipo !== undefined) {
    const antes = textoOpcaoSelecionada(form, "selTipoProcedimento");
    const tipo = form.escolher("selTipoProcedimento", alt.tipo);
    form.definir({ hdnIdTipoProcedimento: tipo.valor });
    mudancas.push(...mudanca("Tipo", antes, tipo.texto));
  }
  if (alt.nivel !== undefined) {
    const antes = NOME_NIVEL[form.valor("rdoNivelAcesso") ?? ""] ?? "";
    form.definir({ rdoNivelAcesso: NIVEIS[alt.nivel] });
    mudancas.push(...mudanca("N\u00EDvel de acesso", antes, NOME_NIVEL[NIVEIS[alt.nivel]]));
    if (alt.nivel === "publico") form.definir({ selHipoteseLegal: "null" });
  }
  if (alt.hipotese !== undefined) {
    const antes = textoOpcaoSelecionada(form, "selHipoteseLegal");
    const nivel = form.valor("rdoNivelAcesso") || NIVEIS.restrito;
    const h = escolherItem(await hipotesesDoFormulario(sei, form, nivel, op.sinal), alt.hipotese, "Hip\u00F3tese legal");
    form.definir({ selHipoteseLegal: h.id });
    mudancas.push(...mudanca("Hip\u00F3tese legal", antes, h.texto));
  }
  if ((form.valor("rdoNivelAcesso") === "1") && (form.valor("selHipoteseLegal") ?? "null") === "null") {
    throw new ErroSei("ARGUMENTO_INVALIDO", "Processo restrito exige hip\u00F3tese legal. Informe a hip\u00F3tese.");
  }
  if (alt.observacoes !== undefined) {
    mudancas.push(...mudanca("Observa\u00E7\u00F5es da unidade", form.valor("txaObservacoes"), alt.observacoes));
    form.definir({ txaObservacoes: alt.observacoes });
  }
  if (alt.interessados !== undefined) {
    const atuais = form.itensLupa("selInteressadosProcedimento");
    conferirNegados(atuais, alt.interessados, lerNegados(form.pagina.html, "interessado"), "Interessado");
    mudancas.push(...mudanca("Interessados", nomes(atuais).join("; "), nomes(alt.interessados).join("; ")));
    form.definirLupa("selInteressadosProcedimento", alt.interessados);
  }
  if (alt.assuntos !== undefined) {
    if (!alt.assuntos.length) throw new ErroSei("ARGUMENTO_INVALIDO", "Informe os assuntos: o processo precisa ter ao menos um.");
    const atuais = form.itensLupa("selAssuntos");
    conferirNegados(atuais, alt.assuntos, lerNegados(form.pagina.html, "assunto"), "Assunto");
    mudancas.push(...mudanca("Assuntos", nomes(atuais).join("; "), nomes(alt.assuntos).join("; ")));
    form.definirLupa("selAssuntos", alt.assuntos);
  }

  const base: ResultadoEscrita = { alvo: arv.protocolo, mudancas, aplicado: false, resumo: "" };
  if (!mudancas.length) return { ...base, resumo: "Nada a alterar: os valores j\u00E1 s\u00E3o esses." };
  if (!op.aplicar) return { ...base, resumo: `${mudancas.length} campo(s) a alterar.` };

  form.definir({ hdnFlagProcedimentoCadastro: "2" });
  await form.enviar({
    sinal: op.sinal,
    operacao: `a altera\u00E7\u00E3o do processo ${arv.protocolo}`,
    sucesso: (p) => parametros(p.url).get("acao") !== "procedimento_alterar",
  });
  sei.invalidar(arv.idProcedimento);
  return { ...base, aplicado: true, resumo: `Processo ${arv.protocolo} alterado.` };
}

/**
 * Conclui o processo na unidade (tela "Concluir Processo", form
 * `#frmDesentranharDocumento` — o id é esse mesmo no SEI 4.1 e 5).
 * `reabrirEm`: data (dd/mm/aaaa) ou número de dias para reabertura programada.
 *
 * Substitui no legado: `execConcluirReabrirProcessoPro` (que chamava a função
 * nativa da tela visível).
 */
export async function concluirProcesso(sei: Sei, referencia: string, c: { reabrirEm?: string }, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  const arv = await sei.arvore(referencia, { sinal: op.sinal, forcar: true });
  if (arv.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Processo sigiloso: o agente n\u00E3o atua nele.");
  const base: ResultadoEscrita = { alvo: arv.protocolo, mudancas: [], aplicado: false, resumo: "" };
  const link = acaoNaArvore(arv, "procedimento_concluir");
  if (!link) return { ...base, resumo: `O processo ${arv.protocolo} j\u00E1 est\u00E1 conclu\u00EDdo (ou n\u00E3o est\u00E1 aberto) na unidade.` };
  base.mudancas = [{ campo: "Situa\u00E7\u00E3o na unidade", antes: "aberto", depois: c.reabrirEm ? `conclu\u00EDdo, reabre em ${c.reabrirEm}` : "conclu\u00EDdo" }];
  if (!op.aplicar) return { ...base, resumo: `Vai concluir ${arv.protocolo}.` };
  const form = await Formulario.abrir(sei.http, link, "#frmDesentranharDocumento, form[action*='procedimento_concluir']", { sinal: op.sinal });
  if (c.reabrirEm) {
    const data = /^\d{2}\/\d{2}\/\d{4}$/.test(c.reabrirEm);
    form.definir({ rdoConcluir: "V", txtPrazoReaberturaProgramada: data ? c.reabrirEm : "", txtDiasReaberturaProgramada: data ? "" : c.reabrirEm.replace(/\D/g, "") });
  }
  await form.enviar({ sinal: op.sinal, botao: "sbmSalvar", operacao: `a conclus\u00E3o de ${arv.protocolo}`, sucesso: (p) => parametros(p.url).get("acao") !== "procedimento_concluir" });
  sei.invalidar(arv.idProcedimento);
  const depois = await sei.arvore(referencia, { sinal: op.sinal, forcar: true });
  if (acaoNaArvore(depois, "procedimento_concluir")) throw new ErroSei("SEI_RESPOSTA_INESPERADA", `O SEI n\u00E3o concluiu ${arv.protocolo}.`);
  return { ...base, aplicado: true, resumo: `Processo ${arv.protocolo} conclu\u00EDdo na unidade.` };
}

/** Reabre na unidade um processo concluído (link `procedimento_reabrir` da tela do processo). Substitui `reopenProcessAjax`. */
export async function reabrirProcesso(sei: Sei, referencia: string, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  const arv = await sei.arvore(referencia, { sinal: op.sinal, forcar: true });
  if (arv.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Processo sigiloso: o agente n\u00E3o atua nele.");
  const base: ResultadoEscrita = { alvo: arv.protocolo, mudancas: [], aplicado: false, resumo: "" };
  if (acaoNaArvore(arv, "procedimento_concluir")) return { ...base, resumo: `O processo ${arv.protocolo} j\u00E1 est\u00E1 aberto na unidade.` };
  const tela = await sei.http.obter(arv.linkProcesso, { sinal: op.sinal });
  const link = linkDaAcao(tela.html, "procedimento_reabrir");
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI n\u00E3o oferece reabrir ${arv.protocolo} para a sua unidade.`);
  base.mudancas = [{ campo: "Situa\u00E7\u00E3o na unidade", antes: "conclu\u00EDdo", depois: "aberto" }];
  if (!op.aplicar) return { ...base, resumo: `Vai reabrir ${arv.protocolo}.` };
  await sei.http.obter(link, { sinal: op.sinal });
  sei.invalidar(arv.idProcedimento);
  const depois = await sei.arvore(referencia, { sinal: op.sinal, forcar: true });
  if (!acaoNaArvore(depois, "procedimento_concluir")) throw new ErroSei("SEI_RESPOSTA_INESPERADA", `O SEI n\u00E3o reabriu ${arv.protocolo}.`);
  return { ...base, aplicado: true, resumo: `Processo ${arv.protocolo} reaberto na unidade.` };
}
