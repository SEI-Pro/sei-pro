/** Codificação, transporte, formulário e árvore. */

import { codificarLatin1, decodificarLatin1, paraLatin1Seguro } from "../src/sessao/codificacao";
import { criarHttp } from "../src/sessao/http";
import { Formulario, lerLupa, paresDeLupa } from "../src/formulario/formulario";
import { lerArvore } from "../src/dominio/arvore";
import { linkDaAcao, linksAssinados, semAssinaturas } from "../src/links/links";
import { lerArgumentos } from "../src/sessao/literais";
import { checar, fixture, lanca, secao } from "./util";

export async function verificarBase(): Promise<void> {
  secao("codificacao");
  checar("acento vira byte latin1", codificarLatin1([["t", "ação"]]) === "t=a%E7%E3o");
  checar("mais e espaco", codificarLatin1([["t", "a+b c"]]) === "t=a%2Bb+c");
  checar("travessao e aspas curvas viram ASCII", paraLatin1Seguro("a — “b”") === 'a - "b"');
  checar("emoji some em texto", paraLatin1Seguro("ok \u{1F600}") === "ok ");
  checar("emoji vira entidade em html", paraLatin1Seguro("ok \u{1F600}", "html") === "ok &#128512;");
  checar("travessao vira entidade em html", paraLatin1Seguro("a\u2014b\u200Bc", "html") === "a&#8212;bc");
  checar("quebra de linha preservada", codificarLatin1([["t", "a\r\nb"]]) === "t=a%0D%0Ab");
  checar("decodifica 0x97 como travessao", decodificarLatin1(new Uint8Array([0x61, 0x97, 0xe7])) === "a—ç");

  secao("literais");
  const [args] = lerArgumentos(`"a,b", 'c\\'d', null, true, 12, "x \\&quot;y\\&quot;")`, 0);
  checar("le strings, null, bool, numero", JSON.stringify(args) === JSON.stringify(["a,b", "c'd", null, true, 12, 'x &quot;y&quot;']), args);

  secao("transporte");
  const respostas: Record<string, { url: string; html: string }> = {
    login: { url: "https://h/sip/login.php?sigla=X", html: "<html></html>" },
    validacao: { url: "https://h/sei/controlador.php?acao=x", html: '<textarea id="txaInfraValidacao">Informe os Assuntos.</textarea>' },
    excecao: { url: "https://h/sei/controlador.php?acao=x", html: '<div id="divInfraExcecao"><span>Processo não encontrado.</span></div>' },
    ok: { url: "https://h/sei/controlador.php?acao=y", html: "<p>ok</p>" },
    falso: { url: "https://h/sei/controlador.php?acao=z", html: "<script>var x = document.getElementById('divInfraExcecao');</script><p>ok</p>" },
  };
  let corpoEnviado = "";
  const http = criarHttp("https://h/sei/", {
    fetch: (async (u: string, init?: RequestInit) => {
      corpoEnviado = String(init?.body ?? "");
      const r = respostas[/caso=(\w+)/.exec(u)![1]];
      const bytes = new Uint8Array([...r.html].map((c) => c.charCodeAt(0) & 0xff));
      return { url: r.url, status: 200, arrayBuffer: async () => bytes.buffer } as unknown as Response;
    }) as unknown as typeof fetch,
  });
  checar("login vira SEI_SESSAO_EXPIRADA", (await lanca(() => http.obter("controlador.php?caso=login")))?.codigo === "SEI_SESSAO_EXPIRADA");
  const ev = await lanca(() => http.obter("controlador.php?caso=validacao"));
  checar("txaInfraValidacao vira SEI_VALIDACAO com a mensagem", ev?.codigo === "SEI_VALIDACAO" && ev.message === "Informe os Assuntos.", ev);
  checar("divInfraExcecao vira SEI_EXCECAO", (await lanca(() => http.obter("controlador.php?caso=excecao")))?.codigo === "SEI_EXCECAO");
  checar("nome divInfraExcecao em script nao e erro", (await http.obter("controlador.php?caso=falso")).url.endsWith("acao=z"));
  const ok = await http.enviar("controlador.php?caso=ok", [["txt", "São Paulo"]]);
  checar("POST em latin1", corpoEnviado === "txt=S%E3o+Paulo" && ok.url.endsWith("acao=y"), corpoEnviado);
  checar("url relativa resolvida na raiz", http.absoluta("controlador.php?a=1&amp;b=2") === "https://h/sei/controlador.php?a=1&b=2");

  secao("links");
  const arvHtml = fixture("sei41/arvore_completa.html").html;
  const links = linksAssinados(arvHtml);
  checar("colhe links assinados da arvore", links.length > 50, links.length);
  checar("acao exata nao casa prefixo", linkDaAcao(links, "documento_alterar")?.includes("acao=documento_alterar&") ?? false);
  checar("sem assinaturas remove hash", !semAssinaturas("x controlador.php?acao=a&infra_hash=" + "a".repeat(64)).includes("aaaa"));

  secao("formulario");
  const alterar = Formulario.de(fixture("sei41/p_procedimento_alterar.html"), "#frmProcedimentoCadastro");
  checar("pares de lupa lidos do script", JSON.stringify(paresDeLupa(alterar.pagina.html)) === JSON.stringify([["selAssuntos", "hdnAssuntos"], ["selInteressadosProcedimento", "hdnInteressadosProcedimento"]]));
  checar("hdnAssuntos refeito a partir do select", lerLupa(alterar.valor("hdnAssuntos") ?? "")[0]?.id === "1287", alterar.valor("hdnAssuntos"));
  checar("interessados preservados", lerLupa(alterar.valor("hdnInteressadosProcedimento") ?? "").length === 2);
  checar("radio marcado entra", alterar.valor("rdoNivelAcesso") === "1");
  checar("radio desabilitado nao entra", alterar.pares().filter(([n]) => n === "rdoNivelAcesso").length === 1);
  checar("select de lupa nao vai no POST", !alterar.pares().some(([n]) => n === "selAssuntos"));
  checar("select com selected", alterar.valor("selHipoteseLegal") === "45");
  checar("botao nao entra", !alterar.pares().some(([n]) => n === "btnSalvar"));
  const escolhida = alterar.escolher("selHipoteseLegal", "apuracao preliminar");
  checar("escolher por texto sem acento", escolhida.valor === "25", escolhida);
  const errado = await lanca(() => alterar.escolher("selHipoteseLegal", "nao existe"));
  checar("escolher invalido lista opcoes", errado?.codigo === "ARGUMENTO_INVALIDO");
  alterar.definirLupa("selAssuntos", [{ id: "1", texto: "A" }, { id: "2", texto: "B" }]);
  checar("definirLupa serializa", alterar.valor("hdnAssuntos") === "1±A¥2±B");

  secao("arvore");
  const arv = lerArvore(fixture("sei41/arvore_completa.html"));
  checar("id e protocolo do processo", arv.idProcedimento === "148265" && arv.protocolo === "99906.713-630.000032/2025-82", [arv.idProcedimento, arv.protocolo]);
  checar("processo restrito com hipotese", arv.nivel === "restrito" && /Sigilo comercial/.test(arv.hipotese ?? ""), arv.hipotese);
  checar("marcador do processo", arv.marcadores[0]?.includes("Para Bruna assinar") ?? false, arv.marcadores);
  checar("todos os documentos", arv.documentos.length === 43, arv.documentos.length);
  const desp = arv.documentos.find((d) => d.numero === "0103947")!;
  checar("despacho interno", desp && !desp.externo && desp.titulo === "Despacho 0103947" && desp.formato === "interno", desp);
  const pdf = arv.documentos.find((d) => d.numero === "0103950")!;
  checar("pdf externo com titulo sem numero", pdf.externo && pdf.formato === "pdf" && pdf.titulo === "Laudo teste B1.3", pdf);
  const assinado = arv.documentos.find((d) => d.assinado)!;
  checar("assinatura lida", assinado.assinaturas[0] === "usuario 01", assinado?.assinaturas);
  checar("titulo com aspas escapadas", arv.documentos.some((d) => d.titulo === 'Relatório D2 depois - "aspas curvas"'), arv.documentos.map((d) => d.titulo).filter((t) => t.includes("aspas")));
  checar("acoes do documento", desp.acoes.some((l) => l.includes("acao=documento_alterar")));
  checar("acao do processo", arv.acoesProcesso.some((l) => l.includes("acao=procedimento_alterar")));
}
