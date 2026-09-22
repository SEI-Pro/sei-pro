/**
 * Ações de formulário simples sobre um processo: anotação, andamento,
 * atribuição, acompanhamento especial e marcadores.
 *
 * Todas seguem o mesmo roteiro (ícone da barra do processo → formulário →
 * Salvar) e por isso compartilham `executarNaBarra`. Cada ação só declara o
 * formulário, o botão e o que muda.
 *
 * Substitui no legado: `sticknoteUpdate`/`sticknoteRemove` (anotação pelo
 * iframe oculto), `automaticActions` (andamento, remover atribuição/anotação),
 * `getSelectAtribuicaoProcesso` + `updateDadosArvore('Atribuir Processo')`,
 * `updateDadosFormAdicionarPro` (acompanhamento), `setMarcadorProcessoPro`,
 * `postFormCadastroMarcadorPro` e `postRemoverMarcadoresListagemPro`.
 */

import { acaoNaArvore, type Arvore } from "./arvore";
import { mudanca, type OpcoesEscrita, type ResultadoEscrita } from "./escrita";
import { Formulario, normalizar } from "../formulario/formulario";
import { linkDaAcao, parametros } from "../links/links";
import { textoDe } from "../sessao/dom";
import { ErroSei } from "../sessao/erros";
import type { Pagina } from "../sessao/http";
import type { Sei } from "../sei";

interface Roteiro {
  acao: string;
  nomeAcao: string;
  form: string;
  botao?: string;
  /** Aplica as mudanças no formulário e devolve o que muda. */
  preparar: (f: Formulario) => ResultadoEscrita["mudancas"];
  resumo: (protocolo: string) => string;
}

async function arvoreOperavel(sei: Sei, referencia: string, sinal?: AbortSignal): Promise<Arvore> {
  const arv = await sei.arvore(referencia, { sinal });
  if (arv.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Processo sigiloso: o agente n\u00E3o atua nele.");
  return arv;
}

function linkObrigatorio(arv: Arvore, acao: string, nome: string): string {
  const l = acaoNaArvore(arv, acao);
  if (!l) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `"${nome}" n\u00E3o est\u00E1 dispon\u00EDvel no processo ${arv.protocolo} (processo fechado na unidade ou sem permiss\u00E3o).`);
  return l;
}

/** Sucesso = saiu da tela do formulário sem mensagem de validação. */
const saiuDa = (acao: string) => (p: Pagina) => parametros(p.url).get("acao") !== acao;

async function executarNaBarra(sei: Sei, referencia: string, r: Roteiro, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  const arv = await arvoreOperavel(sei, referencia, op.sinal);
  const form = await Formulario.abrir(sei.http, linkObrigatorio(arv, r.acao, r.nomeAcao), r.form, { sinal: op.sinal });
  const mudancas = r.preparar(form);
  const base: ResultadoEscrita = { alvo: arv.protocolo, mudancas, aplicado: false, resumo: "" };
  if (!mudancas.length) return { ...base, resumo: "Nada a alterar: j\u00E1 est\u00E1 assim." };
  if (!op.aplicar) return { ...base, resumo: r.resumo(arv.protocolo) };
  await form.enviar({ sinal: op.sinal, botao: r.botao, operacao: `${r.nomeAcao} em ${arv.protocolo}`, sucesso: saiuDa(r.acao) });
  sei.invalidar(arv.idProcedimento);
  return { ...base, aplicado: true, resumo: r.resumo(arv.protocolo).replace(/^Vai /, "") };
}

/** Define (ou remove, com texto vazio) a anotação da unidade no processo. */
export function definirAnotacao(sei: Sei, referencia: string, a: { texto: string; prioridade?: boolean }, op: OpcoesEscrita) {
  return executarNaBarra(sei, referencia, {
    acao: "anotacao_registrar",
    nomeAcao: "Anota\u00E7\u00F5es",
    form: "#frmAnotacaoCadastro",
    botao: "sbmRegistrarAnotacao",
    preparar: (f) => {
      const texto = a.texto.slice(0, 500);
      const m = mudanca("Anota\u00E7\u00E3o", f.valor("txaDescricao"), texto);
      const prioAntes = f.valor("chkSinPrioridade") ? "sim" : "n\u00E3o";
      const prio = a.prioridade === undefined ? prioAntes : a.prioridade && texto ? "sim" : "n\u00E3o";
      f.definir({ txaDescricao: texto, chkSinPrioridade: prio === "sim" ? "on" : null });
      return [...m, ...mudanca("Prioridade", prioAntes, prio)];
    },
    resumo: (p) => (a.texto ? `Anota\u00E7\u00E3o definida em ${p}.` : `Anota\u00E7\u00E3o removida de ${p}.`),
  }, op);
}

/** Registra um andamento ("Atualizar Andamento") no histórico do processo. */
export function registrarAndamento(sei: Sei, referencia: string, texto: string, op: OpcoesEscrita) {
  return executarNaBarra(sei, referencia, {
    acao: "procedimento_atualizar_andamento",
    nomeAcao: "Atualizar Andamento",
    form: "#frmAtividadeListar",
    botao: "sbmSalvar",
    preparar: (f) => {
      if (!texto.trim()) throw new ErroSei("ARGUMENTO_INVALIDO", "Informe o texto do andamento.");
      f.definir({ txaDescricao: texto.slice(0, 4000) });
      return [{ campo: "Andamento", antes: "", depois: texto }];
    },
    resumo: (p) => `Andamento registrado em ${p}.`,
  }, op);
}

/** Atribui o processo a um usuário da unidade (sigla, nome ou id); `null` remove. */
export function atribuirProcesso(sei: Sei, referencia: string, usuario: string | null, op: OpcoesEscrita) {
  return executarNaBarra(sei, referencia, {
    acao: "procedimento_atribuicao_cadastrar",
    nomeAcao: "Atribuir Processo",
    form: "#frmAtividadeAtribuir",
    botao: "sbmSalvar",
    preparar: (f) => {
      const atual = f.opcoes("selAtribuicao").find((o) => o.valor === f.valor("selAtribuicao") && o.valor !== "null")?.texto ?? "";
      if (usuario === null) {
        // O formulário não pré-seleciona o atribuído atual (SEI 4.1): remover sempre envia.
        f.definir({ selAtribuicao: "null" });
        return [{ campo: "Atribui\u00E7\u00E3o", antes: atual || "(atribui\u00E7\u00E3o atual)", depois: "(nenhuma)" }];
      }
      const alvo = normalizar(usuario);
      const ops = f.opcoes("selAtribuicao").filter((o) => o.valor !== "null");
      const achado =
        ops.find((o) => o.valor === usuario) ??
        ops.find((o) => normalizar(o.texto.split(" - ")[0]) === alvo) ??
        ops.find((o) => normalizar(o.texto.split(" - ").slice(1).join(" - ")) === alvo) ??
        (ops.filter((o) => normalizar(o.texto).includes(alvo)).length === 1 ? ops.find((o) => normalizar(o.texto).includes(alvo)) : undefined);
      if (!achado) {
        throw new ErroSei("ARGUMENTO_INVALIDO", `Usu\u00E1rio "${usuario}" n\u00E3o encontrado (ou amb\u00EDguo) na unidade.`, ops.map((o) => o.texto).join(" | "));
      }
      f.definir({ selAtribuicao: achado.valor });
      return mudanca("Atribui\u00E7\u00E3o", atual, achado.texto);
    },
    resumo: (p) => (usuario ? `Processo ${p} atribu\u00EDdo.` : `Atribui\u00E7\u00E3o removida de ${p}.`),
  }, op);
}

/** Inclui ou altera o acompanhamento especial do processo. */
export function definirAcompanhamento(sei: Sei, referencia: string, a: { grupo?: string; observacao?: string }, op: OpcoesEscrita) {
  return executarNaBarra(sei, referencia, {
    acao: "acompanhamento_gerenciar",
    nomeAcao: "Acompanhamento Especial",
    form: "#frmAcompanhamentoCadastro",
    botao: "sbmCadastrarAcompanhamento",
    preparar: (f) => {
      const m: ResultadoEscrita["mudancas"] = [];
      const novo = !f.valor("hdnIdAcompanhamento");
      if (a.grupo !== undefined) {
        const antes = f.opcoes("selGrupoAcompanhamento").find((o) => o.valor === f.valor("selGrupoAcompanhamento") && o.valor !== "null")?.texto ?? "";
        const g = a.grupo ? f.escolher("selGrupoAcompanhamento", a.grupo) : (f.definir({ selGrupoAcompanhamento: "null" }), { texto: "" });
        m.push(...mudanca("Grupo", antes, g.texto));
      }
      if (a.observacao !== undefined) {
        m.push(...mudanca("Observa\u00E7\u00E3o", f.valor("txaObservacao"), a.observacao));
        f.definir({ txaObservacao: a.observacao.slice(0, 500) });
      }
      if (novo) m.unshift({ campo: "Acompanhamento especial", antes: "", depois: "incluir" });
      return m;
    },
    resumo: (p) => `Acompanhamento especial registrado em ${p}.`,
  }, op);
}

export interface MarcadorProcesso {
  /** id do vínculo (andamento_marcador), usado para remover. */
  id: string;
  marcador: string;
  texto: string;
  usuario: string;
  data: string;
}

async function telaMarcadores(sei: Sei, arv: Arvore, sinal?: AbortSignal): Promise<Pagina> {
  const link = linkObrigatorio(arv, "andamento_marcador_gerenciar", "Gerenciar Marcador");
  return sei.http.obter(link, { sinal, aceitarValidacao: true });
}

function lerMarcadores(p: Pagina): MarcadorProcesso[] {
  const linhas = [...p.doc.querySelectorAll("#tblMarcadores tr")].filter((tr) => tr.querySelector("input[type=checkbox]"));
  return linhas.map((tr) => {
    const td = [...tr.querySelectorAll("td")];
    return {
      id: tr.querySelector("input[type=checkbox]")?.getAttribute("value") ?? "",
      marcador: textoDe(td[1]),
      texto: textoDe(td[2]),
      usuario: textoDe(td[3]),
      data: textoDe(td[4]),
    };
  });
}

/** Marcadores atuais do processo (SEI 4.1+: vários por processo). */
export async function marcadoresDoProcesso(sei: Sei, referencia: string, sinal?: AbortSignal): Promise<MarcadorProcesso[]> {
  const arv = await arvoreOperavel(sei, referencia, sinal);
  return lerMarcadores(await telaMarcadores(sei, arv, sinal));
}

/**
 * Adiciona um marcador (ou atualiza o texto, se o processo já o tem) ou o remove.
 * `marcador` é o nome (ou id) de um marcador existente na unidade.
 */
export async function definirMarcador(
  sei: Sei,
  referencia: string,
  m: { marcador: string; texto?: string; remover?: boolean },
  op: OpcoesEscrita,
): Promise<ResultadoEscrita> {
  const arv = await arvoreOperavel(sei, referencia, op.sinal);
  const tela = await telaMarcadores(sei, arv, op.sinal);
  const atuais = lerMarcadores(tela);
  const alvo = normalizar(m.marcador);
  const existente = atuais.find((a) => normalizar(a.marcador) === alvo);
  const base: ResultadoEscrita = { alvo: arv.protocolo, mudancas: [], aplicado: false, resumo: "" };

  if (m.remover) {
    if (!existente) return { ...base, resumo: `O processo ${arv.protocolo} n\u00E3o tem o marcador "${m.marcador}".` };
    base.mudancas = [{ campo: "Marcador", antes: `${existente.marcador}${existente.texto ? `: ${existente.texto}` : ""}`, depois: "" }];
    if (!op.aplicar) return { ...base, resumo: `Vai remover o marcador "${existente.marcador}" de ${arv.protocolo}.` };
    const remover = linkDaAcao(tela.html, "andamento_marcador_remover");
    if (!remover) throw new ErroSei("SEI_ACAO_INDISPONIVEL", "A tela de marcadores n\u00E3o oferece remo\u00E7\u00E3o.");
    const f = Formulario.de(tela, "#frmGerenciarMarcador", sei.http);
    f.definir({ hdnInfraItemId: existente.id, hdnInfraItensSelecionados: existente.id });
    const resp = await sei.http.enviar(remover, f.pares(), { sinal: op.sinal, aceitarValidacao: true });
    if (lerMarcadores(resp).some((a) => a.id === existente.id)) {
      throw new ErroSei("SEI_RESPOSTA_INESPERADA", `O SEI n\u00E3o removeu o marcador "${existente.marcador}".`);
    }
    sei.invalidar(arv.idProcedimento);
    return { ...base, aplicado: true, resumo: `Marcador "${existente.marcador}" removido de ${arv.protocolo}.` };
  }

  const cadastrar = linkDaAcao(tela.html, "andamento_marcador_cadastrar");
  if (!cadastrar) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "Esta vers\u00E3o do SEI n\u00E3o tem a tela de marcadores esperada (4.1 ou superior).");
  const f = await Formulario.abrir(sei.http, cadastrar, "#frmAndamentoMarcadorCadastro", { sinal: op.sinal });
  const escolhido = f.escolher("selMarcador", m.marcador);
  f.definir({ hdnIdMarcador: escolhido.valor, txaTexto: (m.texto ?? existente?.texto ?? "").slice(0, 250) });
  base.mudancas = existente
    ? mudanca(`Texto do marcador ${escolhido.texto}`, existente.texto, m.texto)
    : [{ campo: "Marcador", antes: "", depois: `${escolhido.texto}${m.texto ? `: ${m.texto}` : ""}` }];
  if (!base.mudancas.length) return { ...base, resumo: "Nada a alterar: o marcador j\u00E1 est\u00E1 assim." };
  if (!op.aplicar) return { ...base, resumo: `Vai marcar ${arv.protocolo} com "${escolhido.texto}".` };
  await f.enviar({ sinal: op.sinal, botao: "sbmSalvar", operacao: `o marcador em ${arv.protocolo}`, sucesso: saiuDa("andamento_marcador_cadastrar") });
  sei.invalidar(arv.idProcedimento);
  return { ...base, aplicado: true, resumo: `Marcador "${escolhido.texto}" aplicado em ${arv.protocolo}.` };
}
