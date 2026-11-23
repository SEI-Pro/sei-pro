/**
 * Parsers de domínio sobre telas reais do SEI 4.1.5 (SEI SP Treinamento).
 * As escritas foram validadas ao vivo; aqui fica o que dá para garantir
 * offline: que cada tela é lida do jeito certo.
 */

import { corpoSalvarCk5, lerEditor, textoDoHtml } from "../src/dominio/editor";
import { lerContexto, lerIdUnidade, lerVersao } from "../src/sei";
import { lerCaixaDaPagina } from "../src/dominio/caixa";
import { Formulario } from "../src/formulario/formulario";
import { lerResultados } from "../src/dominio/pesquisa";
import { checar, fixture, paginaSintetica, secao } from "./util";

export async function verificarDominio(): Promise<void> {
  secao("contexto");
  const caixa = fixture("sei41/caixa.html");
  const ctx = lerContexto(caixa);
  checar("versao 4.1.5", ctx.versao === "4.1.5" && ctx.maior === 4, ctx.versao);
  checar("unidade e usuario", ctx.unidade.sigla === "TESTE" && ctx.usuario.login === "pedro.soares", ctx);
  checar("id da unidade pelo link de troca", ctx.unidade.id === "110000001", ctx.unidade);
  const sei3 = paginaSintetica(
    '<a id="lnkUsuarioSistema" title="Fulano (fulano/ORG)"></a><select id="selInfraUnidades"><option value="7">OUTRA</option><option value="123" selected>GPF</option></select>',
    "https://sei.exemplo.gov.br/sei/controlador.php?acao=procedimento_controlar",
  );
  checar("SEI 3: id e sigla pelo seletor", lerIdUnidade(sei3) === "123" && lerContexto(sei3).unidade.sigla === "GPF", lerContexto(sei3).unidade);
  checar(
    "id pela URL quando nao ha cabecalho",
    lerIdUnidade(paginaSintetica("<p></p>", "https://x/sei/controlador.php?acao=x&infra_unidade_atual=555&infra_hash=0")) === "555",
  );
  checar("sem nada, id vazio (sem quebrar)", lerIdUnidade(paginaSintetica("<p></p>")) === "");

  secao("caixa lida da tela (sem requisicao)");
  const linhas = lerCaixaDaPagina(caixa);
  const sigilosa = linhas.find((l) => l.idProcedimento === "157584");
  checar("le as linhas da tela", linhas.length > 0 && !!sigilosa, linhas.length);
  checar("sigiloso sem especificacao", sigilosa?.sigiloso === true && sigilosa.especificacao === "", sigilosa);
  checar("sem exclamacao nao ha documento novo", sigilosa?.documentoNovo === false);
  const comNovo = paginaSintetica(
    '<table id="tblProcessosRecebidos"><caption>(1 registro)</caption><tr id="P9"><td><input type="checkbox" value="9" title="1.1/2026" aria-label="Tipo Teste / Especificação X"></td><td><a href="javascript:void(0);" aria-label="Um documento foi incluído ou assinado neste processo"><img src="svg/exclamacao.svg?5" class="imagemStatus"></a></td><td><a class="processoVisualizado" href="controlador.php?acao=procedimento_trabalhar&id_procedimento=9">1.1/2026</a></td><td>(fulano)</td></tr></table>',
  );
  const novo = lerCaixaDaPagina(comNovo)[0];
  checar("documento novo pela exclamacao", novo?.documentoNovo === true && novo.especificacao === "X", novo);
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

  secao("editor ck5 real (SEI 5.0.5, estilos em infra.estilo)");
  const ed505 = lerEditor(fixture("sei5/editor_pmm505.html"));
  const porNome505 = (rotulo: string) => ed505.secoes.find((s) => s.titulo === rotulo);
  checar("5.0.5: cinco secoes", ed505.tipo === "ck5" && ed505.secoes.length === 5, ed505.secoes.map((s) => s.titulo));
  checar("5.0.5: corpo do texto e o principal", ed505.secoes.find((s) => s.principal)?.titulo === "Corpo do Texto");
  checar("5.0.5: cabecalho, titulo e rodape somente leitura", ed505.secoes.filter((s) => s.somenteLeitura).length === 3);
  const corpo505 = porNome505("Corpo do Texto");
  const anexos505 = porNome505("Anexos");
  checar("5.0.5: estilos do corpo lidos de infra.estilo", corpo505?.estilos.length === 15, corpo505?.estilos.length);
  checar("5.0.5: anexos aceitam os estilos de dispositivo", anexos505?.estilos.length === 28 && anexos505.estilos.some((e) => e.classe === "Item_Inciso_Romano"), anexos505?.estilos.length);
  checar("5.0.5: corpo nao aceita Item_Inciso_Romano", !corpo505?.estilos.some((e) => e.classe === "Item_Inciso_Romano"));
  checar("5.0.5: estilo padrao por secao", corpo505?.estiloPadrao === "Texto_Justificado_Recuo_Primeira_Linha" && anexos505?.estiloPadrao === "Texto_Justificado", [corpo505?.estiloPadrao, anexos505?.estiloPadrao]);

  secao("editor ck5: gravacao fora do Latin-1 (N1 do SEI MJ 5.0.4)");
  // O SEI decodifica o JSON e grava em ISO-8859-1: o que passa de U+00FF chegava como "?".
  const novoCk5 = "<p>Coordena\u00E7\u00E3o \u2014 \u201CAspas\u201D 10\u20AC &amp; \u00C1gua</p>";
  const json5 = corpoSalvarCk5(ed5, { txaEditor_2: novoCk5 }, "U", false);
  const enviado = (JSON.parse(json5) as { secoesConteudo: Array<{ nome: string; html: string }> }).secoesConteudo;
  const corpo5 = enviado.find((x) => x.nome === "txaEditor_2")?.html ?? "";
  checar("ck5: travessao, aspas curvas e euro viram referencia numerica", corpo5.includes("&#8212;") && corpo5.includes("&#8220;Aspas&#8221;") && corpo5.includes("10&#8364;"), corpo5);
  checar("ck5: nada fora do Latin-1 no corpo enviado", [...json5].every((c) => c.codePointAt(0)! <= 0xff), json5);
  checar("ck5: acentos Latin-1 e entidades ficam como estavam", corpo5 === "<p>Coordena\u00E7\u00E3o &#8212; &#8220;Aspas&#8221; 10&#8364; &amp; \u00C1gua</p>", corpo5);
  checar("ck5: secao sem troca vai igual", enviado.find((x) => x.nome === "txaEditor_1")?.html === "<p>cab</p>");
  checar("ck5: texto so Latin-1 vai identico", (JSON.parse(corpoSalvarCk5(ed5, { txaEditor_2: "<p>A\u00E7\u00E3o</p>" }, "U")) as { secoesConteudo: Array<{ html: string }> }).secoesConteudo[1].html === "<p>A\u00E7\u00E3o</p>");

  secao("texto de html");
  checar("paragrafos viram linhas", textoDoHtml("<p>a&nbsp;b</p><p>c</p>") === "a b\nc", textoDoHtml("<p>a&nbsp;b</p><p>c</p>"));

  secao("pesquisa");
  const pesq = lerResultados(fixture("sei41/pesquisa_resultado.html"));
  checar("total da barra com milhar", pesq.total === 5394, pesq.total);
  checar("dez resultados na pagina", pesq.itens.length === 10, pesq.itens.length);
  const r0 = pesq.itens[0];
  checar("resultado de documento", r0.protocolo === "99906.713-630.000032/2025-82" && r0.documento?.numero === "0104019" && r0.documento.tipo === "Despacho", r0);
  checar("trecho e metadados", r0.trecho.includes("Teste") && r0.unidade === "TESTE" && /\d{2}\/\d{2}\/\d{4}/.test(r0.data), r0);

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
