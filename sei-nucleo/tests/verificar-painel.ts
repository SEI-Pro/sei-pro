/**
 * Leituras dos paineis do processo: anotacao, acompanhamento, nivel/hipotese, relacionados e atribuicao.
 * Todas sem efeito colateral: so GET dos links que a arvore ja aberta oferece, ou nenhuma requisicao.
 * Fixtures reais do SEI SP Treinamento (4.1.5); as variantes do SEI 5 sao sinteticas, montadas a partir do
 * fonte do SEI 5.0.0 (arvore_montar.php, ProcedimentoINT.php, acompanhamento_gerenciar.php).
 */

import { acaoNaArvore, lerArvore } from "../src/dominio/arvore";
import {
  acoesDoPainel,
  blocoInternoDoHistorico,
  lerFormularioDoProcesso,
  lerMarcadoresDoProcesso,
  lerOpcoesAcompanhamento,
  lerOpcoesAtribuicao,
  lerOpcoesMarcador,
  lerAcompanhamento,
  lerAnotacao,
  lerAtribuicaoDaPagina,
  lerRelacionados,
} from "../src/dominio/painelProcesso";
import { consultarDaArvore } from "../src/dominio/processo";
import type { Http, Pagina } from "../src/sessao/http";
import { checar, fixture, lanca, paginaSintetica, secao } from "./util";

/** Http falso: devolve a pagina do primeiro trecho que casar e registra as chamadas; qualquer outra requisicao falha. */
function httpCom(respostas: Array<[string, Pagina]>, chamadas: string[]): Http {
  const base = new URL("https://treinamento.sei.sp.gov.br/sei/");
  return {
    base,
    async obter(url: string): Promise<Pagina> {
      chamadas.push(url);
      const r = respostas.find(([trecho]) => url.includes(trecho));
      if (!r) throw new Error(`requisicao inesperada: ${url}`);
      return r[1];
    },
    async enviar() {
      throw new Error("enviar nao esperado: leitura nao pode gravar");
    },
    absoluta: (u: string) => new URL(u, base).href,
    async baixar() {
      throw new Error("baixar nao esperado");
    },
  };
}

const proibidas = (c: string[]) => c.some((u) => /procedimento_visualizar|arvore_montar|procedimento_atribuicao_cadastrar|procedimento_trabalhar/.test(u));

export async function verificarPainel(): Promise<void> {
  const arv = lerArvore(fixture("sei41/arvore.html"));

  secao("lerAnotacao");
  {
    const cham: string[] = [];
    const a = await lerAnotacao(httpCom([["acao=anotacao_registrar", fixture("sei41/p_anotacao_registrar.html")]], cham), arv);
    checar("anotacao simples (4.1)", a?.texto === "teste" && a.prioridade === false, a);
    checar("um unico GET no link anotacao_registrar da arvore", cham.length === 1 && cham[0] === acaoNaArvore(arv, "anotacao_registrar"), cham);

    const arvA = lerArvore(fixture("sei41/arvore_atribuido.html"));
    const p = await lerAnotacao(httpCom([["acao=anotacao_registrar", fixture("sei41/p_anotacao_prioridade.html")]], []), arvA);
    checar(
      "anotacao com checklist e prioridade (4.1)",
      p?.prioridade === true && p.texto.startsWith("Aguardando parecer") && p.texto.includes("[X] Minuta pronta") && p.texto.split("\n").length === 4,
      p,
    );

    const vazia = fixture("sei41/p_anotacao_registrar.html").html.replace(">teste</textarea>", "></textarea>");
    const v = await lerAnotacao(httpCom([["anotacao_registrar", paginaSintetica(vazia.replace(/^[\s\S]*?(<form)/, "$1").replace(/<\/form>[\s\S]*$/, "</form>"))]], []), arv);
    checar("sem anotacao devolve null (estado vazio, nao erro)", v === null, v);

    const sem = await lanca(() => lerAnotacao(httpCom([], []), { ...arv, acoesProcesso: [], links: [] }));
    checar("sem o link na arvore: SEI_ACAO_INDISPONIVEL", sem?.codigo === "SEI_ACAO_INDISPONIVEL", sem?.codigo);

    const outra = await lanca(() => lerAnotacao(httpCom([["anotacao_registrar", paginaSintetica("<p>Erro</p>")]], []), arv));
    checar("tela que nao e o formulario: erro explicito", outra?.codigo === "SEI_VERSAO_NAO_SUPORTADA", outra?.codigo);

    const expirada: Pagina = { ...paginaSintetica("<form></form>", "https://treinamento.sei.sp.gov.br/sip/login.php?x=1"), status: 200 };
    checar("tela de login sem o formulario: erro, nunca vazio", (await lanca(() => lerAnotacao(httpCom([["anotacao_registrar", expirada]], []), arv))) !== null);
  }

  secao("lerAcompanhamento");
  {
    const arvR = lerArvore(fixture("sei41/arvore_relacionados.html"));
    const cham: string[] = [];
    const lista = fixture("sei41/p_acompanhamento_lista.html");
    const a = await lerAcompanhamento(httpCom([["acao=acompanhamento_gerenciar", lista]], cham), arvR);
    checar("lista do processo (4.1): grupo e observacao", a?.grupo === "compras" && a.observacao === "teste acompanhamento especial 2607" && a.id === "6507", a);
    checar("um GET, no link da barra do processo", cham.length === 1 && cham[0] === acaoNaArvore(arvR, "acompanhamento_gerenciar") && !proibidas(cham), cham);

    const alterar = fixture("sei41/p_acompanhamento_alterar.html");
    const f = await lerAcompanhamento(httpCom([["acompanhamento_gerenciar", alterar]], []), arvR);
    checar("formulario de alteracao (redirecionado): mesmos dados", f?.grupo === "compras" && f.observacao === "teste acompanhamento especial 2607" && f.id === "6507", f);

    const novo = await lerAcompanhamento(httpCom([["acompanhamento_gerenciar", fixture("sei41/p_acompanhamento_gerenciar.html")]], []), arv);
    checar("formulario de cadastro vazio = sem acompanhamento (null)", novo === null, novo);

    const semGrupo = alterar.html.replace(/<option value="37" selected="selected">/, '<option value="37">');
    const sg = await lerAcompanhamento(httpCom([["acompanhamento_gerenciar", paginaSintetica(semGrupo.replace(/^[\s\S]*?(<form)/, "$1").replace(/<\/form>[\s\S]*$/, "</form>"))]], []), arvR);
    checar("acompanhamento sem grupo: grupo ausente", sg !== null && sg.grupo === undefined && sg.id === "6507", sg);

    const comReab = lista.html.replace("teste acompanhamento especial 2607</td>", 'teste acompanhamento especial 2607 ["Reabertura": "05/11/2026 08:30"]</td>');
    const r = await lerAcompanhamento(httpCom([["acompanhamento_gerenciar", { ...lista, html: comReab, get doc() { return paginaSintetica(comReab).doc; } }]], []), arvR);
    checar(
      "reabertura programada sai do texto e vira campo",
      r?.observacao === "teste acompanhamento especial 2607" && r.reabertura === "05/11/2026 08:30" && !!r.observacaoBruta?.includes("Reabertura"),
      r,
    );

    // SEI 5.0.0: mesma lista, sem a coluna extra; o cabecalho manda, nao a posicao.
    const lista5 = paginaSintetica(
      '<form id="frmGerenciarAcompanhamento"><table class="infraTable"><caption>Lista de Acompanhamentos (2 registros):</caption><tr><th></th><th>Grupo</th><th>Observação</th><th>Usuário</th><th>Data</th><th>Ações</th></tr>' +
        '<tr><td><input type="checkbox" value="9"></td><td>Metas</td><td>Primeiro</td><td>fulano</td><td>01/01/2026</td><td><a href="controlador.php?acao=acompanhamento_alterar&amp;id_acompanhamento=9">x</a></td></tr>' +
        "<tr><td><input type=\"checkbox\" value=\"10\"></td><td></td><td>Segundo</td><td>fulano</td><td>02/01/2026</td><td></td></tr></table></form>",
    );
    const l5 = await lerAcompanhamento(httpCom([["acompanhamento_gerenciar", lista5]], []), arvR);
    checar("SEI 5 (sintetico): primeira linha da lista", l5?.grupo === "Metas" && l5.observacao === "Primeiro" && l5.id === "9", l5);

    const vazia5 = paginaSintetica('<form id="frmGerenciarAcompanhamento"><table class="infraTable"><caption>Lista de Acompanhamentos</caption><tr><th>Grupo</th><th>Observação</th></tr></table></form>');
    checar("lista sem linhas: null", (await lerAcompanhamento(httpCom([["acompanhamento_gerenciar", vazia5]], []), arvR)) === null);

    const estranha = await lanca(() => lerAcompanhamento(httpCom([["acompanhamento_gerenciar", paginaSintetica("<h1>Erro</h1>")]], []), arvR));
    checar("resposta que nao e lista nem formulario: erro explicito", estranha?.codigo === "SEI_VERSAO_NAO_SUPORTADA", estranha?.codigo);
    const sem = await lanca(() => lerAcompanhamento(httpCom([], []), { ...arvR, acoesProcesso: [], links: [] }));
    checar("sem o link na arvore: SEI_ACAO_INDISPONIVEL", sem?.codigo === "SEI_ACAO_INDISPONIVEL", sem?.codigo);
  }

  secao("consultarDaArvore: nivel e hipotese");
  {
    const cham: string[] = [];
    const m = await consultarDaArvore(httpCom([["acao=procedimento_alterar", fixture("sei41/p_procedimento_alterar.html")]], cham), arv);
    checar("restrito com hipotese legal (4.1)", m.nivel === "restrito" && m.hipotese === "Sigilo comercial (Artigo 155, § 2º, da Lei nº 6.404/1976)", { n: m.nivel, h: m.hipotese });
    checar("continua um GET so", cham.length === 1);

    const html = fixture("sei41/p_procedimento_alterar.html").html;
    const publico = html.replace('value="1" checked="checked"', 'value="1"').replace(/(id="optPublico"[^>]*value="0")/, '$1 checked="checked"');
    const pub = await consultarDaArvore(httpCom([["procedimento_alterar", paginaSintetica(publico.replace(/^[\s\S]*?(<form id="frmProcedimentoCadastro")/, "$1"))]], []), arv);
    checar("publico: sem hipotese", pub.nivel === "publico" && pub.hipotese === undefined, { n: pub.nivel, h: pub.hipotese });

    // Select desabilitado (consulta) ou sem opcoes (SEI 5 monta por ajax): vale o que a arvore ja diz.
    const mudo = html.replace(/ selected="selected"/g, "");
    const fb = await consultarDaArvore(httpCom([["procedimento_alterar", paginaSintetica(mudo.replace(/^[\s\S]*?(<form id="frmProcedimentoCadastro")/, "$1"))]], []), arv);
    checar("sem opcao marcada: hipotese da arvore", fb.nivel === "restrito" && fb.hipotese === arv.hipotese && !!fb.hipotese, { n: fb.nivel, h: fb.hipotese });
  }

  secao("lerRelacionados (pagina, sem rede)");
  {
    const arvR = lerArvore(fixture("sei41/arvore_relacionados.html"));
    const r = lerRelacionados(arvR);
    checar(
      "dois processos relacionados, com o tipo do grupo (4.1)",
      r.length === 2 &&
        r[0].protocolo === "99906.713-630.000012/2024-21" &&
        r[0].tipo === "Processo administrativo disciplinar" &&
        r[1].protocolo === "99906.713-630.000013/2024-75" &&
        r[1].tipo === "Processo de aquisição de imóvel",
      r,
    );
    checar("descricao, link assinado e situacao", r[0].descricao === "teste processo relacionado" && r[0].aberto === true && /acao=procedimento_trabalhar&acao_origem=procedimento_visualizar&id_procedimento=142166/.test(r[0].link), r[0]);
    const daArvore = lerRelacionados(arv);
    checar("outra arvore real: dois grupos de um processo cada", daArvore.length === 2 && daArvore[0].tipo === "Atestado de realiza\u00E7\u00E3o de servi\u00E7os", daArvore.map((x) => x.tipo));
    checar("processo sem relacionados: lista vazia", lerRelacionados({ ...arv, pagina: paginaSintetica('<div id="divRelacionados"></div>') }).length === 0);

    // SEI 5.0.0: a cor vem em style (verde = aberto, vermelho = concluido) e dois cards no mesmo grupo.
    const p5 = paginaSintetica(
      '<div id="divRelacionados"><label>Processos Relacionados:</label> <br /></div><div id="divRelacionadosParciais">' +
        '<a href="javascript:void(0);" onclick="visualizacaoRelacionados(0)" class="ancoraRelacionadosParcial">Contrato (2)</a><br />' +
        '<div id="divRelacionadosParcial0" class="divRelacionadosParcial"><div class="card-deck cardDeckRelacionado">' +
        '<div class="card cardRelacionado"><div class="card-body"><p class="card-title cardTitleRelacionado"><a target="_blank" href="controlador.php?acao=procedimento_trabalhar&amp;id_procedimento=1" class="card-block" style="color:#05a381;">00001.000001/2026-01</a></p></div></div>' +
        '<div class="card cardRelacionado"><div class="card-body"><p class="card-title cardTitleRelacionado"><a target="_blank" href="controlador.php?acao=procedimento_trabalhar&amp;id_procedimento=2" class="card-block" style="color:#ff4545;">00001.000002/2026-02</a></p><p class="card-text">com descrição</p></div></div>' +
        "</div></div></div>",
    );
    const raiz5 = { ...arv, pagina: p5 };
    const r5 = lerRelacionados(raiz5);
    checar(
      "SEI 5 (sintetico): dois cards, cor por style",
      r5.length === 2 && r5[0].tipo === "Contrato" && r5[0].aberto === true && r5[1].aberto === false && r5[1].descricao === "com descrição" && r5[0].descricao === undefined,
      r5,
    );
  }

  secao("lerAtribuicaoDaPagina (Nos[0].html, sem rede)");
  {
    const sozinho = lerAtribuicaoDaPagina(arv, "TESTE");
    checar(
      "aberto so na unidade, sem atribuido (4.1)",
      sozinho.usuario === null && sozinho.unidadeAberta === true && sozinho.texto.startsWith("Processo aberto somente na unidade TESTE"),
      sozinho,
    );
    const arvA = lerArvore(fixture("sei41/arvore_atribuido.html"));
    const a = lerAtribuicaoDaPagina(arvA, "TESTE");
    checar("varias unidades: a atribuicao e a da minha unidade", a.usuario === "pedro.soares" && a.unidadeAberta === true && a.nomeUsuario === "Pedro Soares", a);
    checar("o texto traz as linhas do SEI", a.texto.includes("TESTE (atribuído para pedro.soares)") && a.texto.includes("TESTE_1_1"), a.texto);
    const outra = lerAtribuicaoDaPagina(arvA, "TESTE_1_1");
    checar("outra unidade da lista: nao atribuido", outra.usuario === null, outra);
    const ambigua = lerAtribuicaoDaPagina(arvA);
    checar("sem saber a unidade e com varias: nao chuta", ambigua.usuario === null, ambigua);
    const fechadaNaUnidade = lerAtribuicaoDaPagina({ ...arvA, acoesProcesso: arvA.acoesProcesso.filter((l) => !l.includes("acao=procedimento_alterar")), links: [] }, "TESTE");
    checar("sem o link de alterar o processo, a unidade nao o tem aberto", fechadaNaUnidade.unidadeAberta === false);

    const html = (corpo: string) => paginaSintetica(`<script>Nos[0] = new infraArvoreNo("PROCESSO","1",null,"x","t","1.2/2026","T");\nNos[0].html = '${corpo}';</script>`);
    const base = { ...arv, pagina: html("Processo não possui andamentos abertos.") };
    const conc = lerAtribuicaoDaPagina(base, "TESTE");
    checar("sem andamentos abertos: ninguem", conc.usuario === null && conc.texto === "Processo não possui andamentos abertos.", conc);
    const sobr = lerAtribuicaoDaPagina({ ...arv, pagina: html('Processo sobrestado na unidade <a title="Unidade" class="ancoraSigla">TESTE</a> (atribuído para <a title="Ana" class="ancoraSigla">ana</a>).') }, "teste");
    checar("sobrestado, unidade em caixa diferente", sobr.usuario === "ana" && sobr.nomeUsuario === "Ana", sobr);
    const sig = lerAtribuicaoDaPagina({ ...arv, pagina: html('Processo aberto somente com o usuário <a title="Ana" class="ancoraSigla">ana</a>&nbsp;/&nbsp;<a title="Unidade" class="ancoraSigla">TESTE</a>.') }, "TESTE");
    checar("sigiloso (usuario / unidade) nao e atribuicao", sig.usuario === null, sig);
    const nenhum = lerAtribuicaoDaPagina({ ...arv, pagina: paginaSintetica("<p>sem script</p>") }, "TESTE");
    checar("pagina sem Nos[0].html: texto vazio, sem quebrar", nenhum.texto === "" && nenhum.usuario === null);
  }

  secao("listas e leituras dos modais (so GET)");
  {
    const a = acoesDoPainel(arv);
    checar("acoesDoPainel: processo aberto na unidade oferece as 6 acoes", a.anotar && a.acompanhar && a.marcar && a.atribuir && a.alterar && a.consultar, a);
    const fechada = acoesDoPainel({ ...arv, acoesProcesso: [], links: [] });
    checar("acoesDoPainel: sem barra nenhuma acao", !fechada.anotar && !fechada.alterar && !fechada.consultar, fechada);

    const cham: string[] = [];
    const at = await lerOpcoesAtribuicao(httpCom([["acao=procedimento_atribuicao_cadastrar", fixture("sei41/p_procedimento_atribuicao_cadastrar.html")]], cham), arv);
    checar("opcoes de atribuicao: sem a vazia, com login - nome", at.opcoes.length === 15 && at.opcoes[0].texto === "pedro.soares - Pedro Soares" && at.opcoes[0].valor === "100001861", at.opcoes[0]);
    checar("opcoes de atribuicao: um GET so", cham.length === 1);

    const gr = await lerOpcoesAcompanhamento(httpCom([["acao=acompanhamento_gerenciar", fixture("sei41/p_acompanhamento_alterar.html")]], []), arv);
    checar("opcoes de acompanhamento: grupos e o atual", gr.grupos.length === 6 && gr.atual === "37" && gr.grupos.some((g) => g.texto === "compras"), gr);

    const mk = await lerOpcoesMarcador(httpCom([["acao=andamento_marcador_gerenciar", fixture("sei41/marcador_cadastrar.html")]], []), arv);
    checar("opcoes de marcador: id, nome e icone", mk.length === 14 && mk[0].texto.startsWith("Capacita") && mk[0].icone === "svg/marcador_rosa.svg?18", mk[0]);

    const lista = await lerMarcadoresDoProcesso(httpCom([["acao=andamento_marcador_gerenciar", fixture("sei41/p_andamento_marcador_gerenciar.html")]], []), arv);
    checar("marcadores do processo: icone, nome, usuario e data", lista.length === 2 && lista[0].nome === "Para Bruna assinar" && lista[0].icone === "svg/marcador_azul_marinho.svg?18" && lista[0].usuario === "pedro.soares" && lista[0].id === "883", lista[0]);
    const vazio = await lerMarcadoresDoProcesso(httpCom([["acao=andamento_marcador_gerenciar", fixture("sei41/marcador_cadastrar.html")]], []), arv);
    checar("sem marcador (abre o formulario): lista vazia, nao erro", vazio.length === 0);
    const estranha = await lanca(() => lerMarcadoresDoProcesso(httpCom([["andamento_marcador_gerenciar", paginaSintetica("<h1>Erro</h1>")]], []), arv));
    checar("resposta que nao e lista nem formulario: erro explicito", estranha?.codigo === "SEI_VERSAO_NAO_SUPORTADA", estranha?.codigo);

    const sei = { http: httpCom([["acao=procedimento_alterar", fixture("sei41/p_procedimento_alterar.html")]], []) } as never;
    const fp = await lerFormularioDoProcesso(sei, arv);
    checar("formulario do processo: tipos, nivel e hipotese marcada", fp.tipos.length > 3 && fp.nivel === "1" && !!fp.hipoteseAtual, { n: fp.tipos.length, nivel: fp.nivel, h: fp.hipoteseAtual });
    const comObs = await consultarDaArvore(httpCom([["acao=procedimento_alterar", fixture("sei41/p_procedimento_alterar.html")]], []), arv);
    checar("consultarDaArvore traz observacoesOutras (lista, possivelmente vazia)", Array.isArray(comObs.observacoesOutras));
  }

  secao("blocoInternoDoHistorico (puro, sobre andamentos ja coletados)");
  {
    const and = (data: string, unidade: string, descricao: string) => ({ data, unidade, usuario: "x", descricao });
    const lista = [
      and("10/10/2026 09:00", "TESTE", "Processo retirado do bloco interno 5"),
      and("05/10/2026 09:00", "TESTE", "Processo inserido no bloco interno 5 (Bloco A)"),
      and("01/10/2026 09:00", "OUTRA", "Processo inserido no bloco interno 9 (Outro)"),
    ];
    checar("inserido e depois retirado: sem bloco", blocoInternoDoHistorico(lista, "TESTE") === null);
    checar("so conta a unidade pedida", blocoInternoDoHistorico(lista, "OUTRA")?.includes("bloco interno 9") === true);
    const reinserido = [and("12/10/2026 09:00", "TESTE", "Processo inserido no bloco interno 7 (Bloco B)"), ...lista];
    checar("reinserido depois da retirada: bloco mais recente", blocoInternoDoHistorico(reinserido, "TESTE")?.includes("bloco interno 7") === true);
    checar("fora de ordem tambem funciona", blocoInternoDoHistorico([...reinserido].reverse(), "TESTE")?.includes("bloco interno 7") === true);
    checar("sem andamentos de bloco: null", blocoInternoDoHistorico([and("01/01/2026 10:00", "TESTE", "Processo recebido")], "TESTE") === null);
  }
}
