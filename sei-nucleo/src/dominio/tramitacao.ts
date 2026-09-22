/**
 * Envio de processo (tramitação) e assinatura de documento.
 *
 * ENVIO — tela "Enviar Processo" (`procedimento_enviar`, form `#frmAtividadeListar`).
 * As unidades de destino são resolvidas pelo mesmo autocompletar da tela
 * (`controlador_ajax.php?acao_ajax=unidade_auto_completar_envio_processo`).
 * Diferente do MCP SEI Pro, que usava o PRIMEIRO resultado quando a sigla não
 * batia exata (e podia tramitar para a unidade errada), aqui unidade ambígua é
 * erro com a lista de candidatas: quem decide é o usuário.
 *
 * ASSINATURA — tela "Assinatura de Documento" (`documento_assinar`, form
 * `#frmAssinaturas`). A `action` traz `hash_documentos`, que amarra o
 * formulário aos documentos daquela tela: por isso é um formulário por
 * documento. A senha só passa por aqui, no momento do POST; nunca é guardada.
 * A prova de sucesso é reler a árvore e ver o documento assinado pelo usuário.
 *
 * Substitui no legado: `getProcessoNaoLido` (o único envio completo por POST),
 * `getInteressadosProcessoAjax` (autocompletar de unidade), e a ação "Assinar"
 * das Ações em Lote (senha escrita no DOM de um iframe oculto).
 */

import { acaoNaArvore } from "./arvore";
import { localizarDocumento } from "./documento";
import type { OpcoesEscrita, ResultadoEscrita } from "./escrita";
import { Formulario, normalizar, type ItemLupa } from "../formulario/formulario";
import { linkDaAcao, parametros } from "../links/links";
import { decodificarEntidades } from "../sessao/dom";
import { ErroSei } from "../sessao/erros";
import type { Sei } from "../sei";

export interface Envio {
  /** Siglas (ou nomes) das unidades de destino. */
  unidades: string[];
  /** Manter o processo aberto na unidade atual. */
  manterAberto?: boolean;
  removerAnotacao?: boolean;
  enviarEmail?: boolean;
  /** Retorno programado: data (dd/mm/aaaa) ou número de dias. */
  retornoEm?: string;
}

/** Resolve uma unidade pelo autocompletar do envio; ambíguo ou ausente é erro. */
async function resolverUnidade(sei: Sei, ajax: string, termo: string, sinal?: AbortSignal): Promise<ItemLupa> {
  const itens = await sei.ajax(ajax, [["palavras_pesquisa", termo], ["id_orgao", ""], ["unidade_atual", "0"]], { sinal });
  const alvo = normalizar(termo);
  const sigla = (t: string) => normalizar(t.split(" - ")[0]);
  const exatos = itens.filter((i) => sigla(i.texto) === alvo || normalizar(i.texto) === alvo);
  const escolhido = exatos.length === 1 ? exatos[0] : itens.length === 1 ? itens[0] : null;
  if (!escolhido) {
    throw new ErroSei(
      "ARGUMENTO_INVALIDO",
      itens.length ? `A unidade "${termo}" \u00E9 amb\u00EDgua. Indique a sigla exata.` : `Nenhuma unidade encontrada para "${termo}".`,
      itens.slice(0, 20).map((i) => i.texto).join(" | "),
    );
  }
  return { id: escolhido.id, texto: escolhido.texto };
}

export async function enviarProcesso(sei: Sei, referencia: string, e: Envio, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  if (!e.unidades?.length) throw new ErroSei("ARGUMENTO_INVALIDO", "Informe ao menos uma unidade de destino.");
  const arv = await sei.arvore(referencia, { sinal: op.sinal, forcar: true });
  if (arv.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Processo sigiloso: o agente n\u00E3o atua nele.");
  const link = acaoNaArvore(arv, "procedimento_enviar");
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O processo ${arv.protocolo} n\u00E3o pode ser enviado pela sua unidade (fechado ou sem permiss\u00E3o).`);
  const form = await Formulario.abrir(sei.http, link, "#frmAtividadeListar", { sinal: op.sinal });
  const ajax = /controlador_ajax\.php\?acao_ajax=unidade_auto_completar_envio_processo[^'"]*/.exec(form.pagina.html)?.[0];
  if (!ajax) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "A tela de envio n\u00E3o tem a busca de unidades esperada.");
  const destinos: ItemLupa[] = [];
  for (const u of e.unidades) destinos.push(await resolverUnidade(sei, decodificarEntidades(ajax), u, op.sinal));

  const mudancas: ResultadoEscrita["mudancas"] = [{ campo: "Enviar para", antes: "", depois: destinos.map((d) => d.texto).join("; ") }];
  if (e.manterAberto) mudancas.push({ campo: "Manter aberto na unidade", antes: "", depois: "sim" });
  if (e.removerAnotacao) mudancas.push({ campo: "Remover anota\u00E7\u00E3o", antes: "", depois: "sim" });
  if (e.enviarEmail) mudancas.push({ campo: "E-mail de notifica\u00E7\u00E3o", antes: "", depois: "sim" });
  if (e.retornoEm) mudancas.push({ campo: "Retorno programado", antes: "", depois: e.retornoEm });
  const base: ResultadoEscrita = { alvo: arv.protocolo, mudancas, aplicado: false, resumo: `Vai enviar ${arv.protocolo}.` };
  if (!op.aplicar) return base;

  form.definirLupa("selUnidades", destinos);
  form.definir({
    selOrgao: form.valor("selOrgao") ?? "",
    chkSinManterAberto: e.manterAberto ? "on" : null,
    chkSinRemoverAnotacoes: e.removerAnotacao ? "on" : null,
    chkSinEnviarEmailNotificacao: e.enviarEmail ? "on" : null,
  });
  if (e.retornoEm) {
    const data = /^\d{2}\/\d{2}\/\d{4}$/.test(e.retornoEm);
    form.definir(
      data
        ? { rdoPrazoRetornoProgramado: "1", txtPrazoRetornoProgramado: e.retornoEm }
        : { rdoPrazoRetornoProgramado: "2", txtDiasRetornoProgramado: e.retornoEm.replace(/\D/g, "") },
    );
  }
  await form.enviar({
    sinal: op.sinal,
    botao: "sbmEnviar",
    operacao: `o envio de ${arv.protocolo}`,
    sucesso: (p) => parametros(p.url).get("acao") !== "procedimento_enviar",
  });
  sei.invalidar(arv.idProcedimento);
  return { ...base, aplicado: true, resumo: `Processo ${arv.protocolo} enviado para ${destinos.map((d) => d.texto.split(" - ")[0]).join(", ")}.` };
}

export interface Assinatura {
  /** Cargo/função exatamente como na lista do SEI (ou parte única dele). */
  cargo?: string;
  /** Senha do SEI. Só é usada no POST e não é guardada. */
  senha?: string;
}

async function telaAssinatura(sei: Sei, numero: string, sinal?: AbortSignal) {
  const d = await localizarDocumento(sei, numero, { sinal, forcar: true });
  if (d.documento.nivel === "sigiloso" || d.arvore.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Documento sigiloso: o agente n\u00E3o atua nele.");
  const tela = await sei.http.obter(d.documento.link, { sinal });
  const link = linkDaAcao(tela.html, "documento_assinar");
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `Voc\u00EA n\u00E3o pode assinar o documento ${d.documento.numero}.`);
  const form = await Formulario.abrir(sei.http, link, "#frmAssinaturas", { sinal });
  return { d, form };
}

/**
 * Assina um documento. Sem `senha`, é a prévia: devolve os cargos disponíveis
 * em `dados.cargos` (separados por "|") e quem já assinou.
 */
export async function assinarDocumento(sei: Sei, numero: string, a: Assinatura, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  const { d, form } = await telaAssinatura(sei, numero, op.sinal);
  const cargos = form.opcoes("selCargoFuncao").filter((o) => o.valor && o.valor !== "null").map((o) => o.texto);
  const usuario = sei.contexto().usuario.nome;
  const jaAssinou = d.documento.assinaturas.some((l) => normalizar(l) === normalizar(usuario));
  const base: ResultadoEscrita = {
    alvo: d.documento.numero,
    mudancas: jaAssinou ? [] : [{ campo: "Assinatura", antes: d.documento.assinado ? "assinado por outros" : "sem assinatura", depois: `assinado por ${usuario}${a.cargo ? ` (${a.cargo})` : ""}` }],
    aplicado: false,
    resumo: jaAssinou ? `Voc\u00EA j\u00E1 assinou o documento ${d.documento.numero}.` : `Vai assinar ${d.documento.titulo} (${d.documento.numero}).`,
    dados: { cargos: cargos.join("|") },
  };
  if (!op.aplicar || jaAssinou) return base;
  if (!a.senha || !a.cargo) throw new ErroSei("ARGUMENTO_INVALIDO", "Para assinar \u00E9 preciso cargo e senha, informados pelo usu\u00E1rio.");

  const orgaoUsuario = normalizar(sei.contexto().usuario.orgao ?? "");
  const orgao = form.opcoes("selOrgao").find((o) => o.valor !== "null" && normalizar(o.texto) === orgaoUsuario);
  if (orgao) form.definir({ selOrgao: orgao.valor });
  form.escolher("selCargoFuncao", a.cargo);
  form.definir({ pwdSenha: a.senha, hdnFormaAutenticacao: "S" });
  await form.enviar({ sinal: op.sinal, operacao: `a assinatura de ${d.documento.numero}` });

  sei.invalidar(d.arvore.idProcedimento);
  const depois = await localizarDocumento(sei, numero, { sinal: op.sinal });
  if (!depois.documento.assinaturas.some((l) => normalizar(l) === normalizar(usuario))) {
    throw new ErroSei("SEI_RESPOSTA_INESPERADA", `O SEI n\u00E3o registrou a assinatura do documento ${d.documento.numero} (senha ou cargo incorretos?).`);
  }
  return { ...base, aplicado: true, resumo: `Documento ${d.documento.numero} assinado.`, dados: {} };
}
