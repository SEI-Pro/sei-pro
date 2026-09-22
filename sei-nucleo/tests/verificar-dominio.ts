/**
 * Parsers de domínio sobre telas reais do SEI 4.1.5 (SEI SP Treinamento).
 * As escritas foram validadas ao vivo; aqui fica o que dá para garantir
 * offline: que cada tela é lida do jeito certo.
 */

import { lerEditor, textoDoHtml } from "../src/dominio/editor";
import { lerContexto, lerVersao } from "../src/sei";
import { Formulario } from "../src/formulario/formulario";
import { checar, fixture, secao } from "./util";

export async function verificarDominio(): Promise<void> {
  secao("contexto");
  const caixa = fixture("sei41/caixa.html");
  const ctx = lerContexto(caixa);
  checar("versao 4.1.5", ctx.versao === "4.1.5" && ctx.maior === 4, ctx.versao);
  checar("unidade e usuario", ctx.unidade.sigla === "TESTE" && ctx.usuario.login === "pedro.soares", ctx);
  checar("versao pelo asset quando nao ha logo", lerVersao('<script src="/x.js?5.0.4-2.30.0"></script>') === "5.0.4");

  secao("editor ck4");
  const ed = lerEditor(fixture("sei41/editor.html"));
  checar("quatro secoes", ed.tipo === "ck4" && ed.secoes.length === 4, ed.secoes.map((s) => s.nome));
  checar("cabecalho e titulo somente leitura", ed.secoes[0].somenteLeitura && ed.secoes[1].somenteLeitura);
  const principal = ed.secoes.find((s) => s.principal);
  checar("corpo do texto e o principal", principal?.titulo === "Corpo do Texto", principal?.titulo);
  checar("frmEditor posta no editor_processar", Formulario.de(ed.pagina, "#frmEditor").action.includes("editor_processar.php?acao=editor_salvar"));

  secao("editor ck5 (sintetico, formato do SEI 5)");
  const cfg = {
    initialData: { txaEditor_1: "<p>cab</p>", txaEditor_2: "<p>corpo</p>" },
    rootsAttributes: { txaEditor_1: { somenteLeitura: true, label: "Cabeçalho" }, txaEditor_2: { principal: true, label: "Corpo do Texto" } },
    sei: { urlSalvar: "controlador_rest.php?acao_rest=editor_salvar_conteudo&x=\"}{\"", versao: 3, siglaUnidade: "U" },
  };
  const ed5 = lerEditor({ url: "https://h/sei/x", status: 200, html: `<script>window.INFRA_EDITOR_CONFIG = ${JSON.stringify(cfg)};</script>`, get doc() { return null as unknown as Document; } });
  checar("ck5 com chaves dentro de string", ed5.tipo === "ck5" && ed5.secoes.length === 2 && ed5.ck5?.versao === 3);
  checar("ck5 principal pelo rootsAttributes", ed5.secoes[1].principal && ed5.secoes[0].somenteLeitura);

  secao("texto de html");
  checar("paragrafos viram linhas", textoDoHtml("<p>a&nbsp;b</p><p>c</p>") === "a b\nc", textoDoHtml("<p>a&nbsp;b</p><p>c</p>"));

  secao("formularios de acao");
  const anot = Formulario.de(fixture("sei41/p_anotacao_registrar.html"), "#frmAnotacaoCadastro");
  checar("anotacao atual lida", anot.valor("txaDescricao") === "teste");
  const atr = Formulario.de(fixture("sei41/p_procedimento_atribuicao_cadastrar.html"), "#frmAtividadeAtribuir");
  checar("usuarios da unidade", atr.opcoes("selAtribuicao").length > 5);
  const marc = Formulario.de(fixture("sei41/marcador_cadastrar.html"), "#frmAndamentoMarcadorCadastro");
  checar("marcadores da unidade", marc.opcoes("selMarcador").some((o) => o.texto === "Enviado para auditoria"));
  const hist = fixture("sei41/historico.html");
  checar("historico tem o formulario de tipo", Formulario.de(hist, "#frmProcedimentoHistorico").valor("hdnTipoHistorico") === "R");
}
