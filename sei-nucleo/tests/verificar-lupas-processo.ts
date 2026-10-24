/**
 * Assuntos e interessados do processo: leitura da lupa, pesquisa pelo autocompletar da tela, gravação pela lupa e a regra
 * dos itens "negados" (acrescentados por outra unidade). Fixture real do SEI SP Treinamento (4.1.5, `procedimento_alterar`);
 * a variante do SEI 5 é sintética, montada do fonte do 5.0.0 (`procedimento_cadastro.php`, mesmos ids e mesma codificação).
 */
import { lerArvore } from "../src/dominio/arvore";
import { lerNegados } from "../src/dominio/lupas";
import { lerFormularioDoProcesso } from "../src/dominio/painelProcesso";
import { alterarProcesso, consultarDaArvore } from "../src/dominio/processo";
import { Formulario, lerLupa } from "../src/formulario/formulario";
import { Sei } from "../src/sei";
import type { Http, Pagina } from "../src/sessao/http";
import { checar, fixture, lanca, secao } from "./util";

const arv = lerArvore(fixture("sei41/arvore.html"));

function comHtml(p: Pagina, troca: (html: string) => string): Pagina {
  const html = troca(p.html);
  let doc: Document | null = null;
  return {
    url: p.url,
    status: 200,
    html,
    get doc() {
      return (doc ??= new (p.doc.defaultView as unknown as { DOMParser: new () => DOMParser }).DOMParser().parseFromString(html, "text/html") as unknown as Document);
    },
  };
}

interface Gravacao {
  action: string;
  pares: Array<[string, string]>;
}

function httpFalso(alterar: Pagina, gravacoes: Gravacao[], respostaEnviar: Pagina): Http {
  const base = new URL("https://treinamento.sei.sp.gov.br/sei/");
  return {
    base,
    async obter(url: string) {
      if (url.includes("acao=procedimento_alterar")) return alterar;
      throw new Error(`requisicao inesperada: ${url}`);
    },
    async enviar(url: string, pares: Array<[string, string]>) {
      gravacoes.push({ action: url, pares });
      return respostaEnviar;
    },
    absoluta: (u: string) => new URL(u, base).href,
    async baixar() {
      throw new Error("baixar nao esperado");
    },
  } as unknown as Http;
}

export async function verificarLupasProcesso(): Promise<void> {
  secao("lerNegados: itens que a unidade nao pode retirar");
  {
    const html = `<script>var arrAssuntosNegados = Array();
arrAssuntosNegados[0] = {id_assunto:'1287',sigla_unidade:'GAB'};
arrAssuntosNegados[1] = {id_assunto:'55',sigla_unidade:'SEC'};
var arrInteressadosNegados = Array();
arrInteressadosNegados[0] = {id_contato: '100013362', sigla_unidade: 'CGE'};</script>`;
    const a = lerNegados(html, "assunto");
    const i = lerNegados(html, "interessado");
    checar("assuntos negados: id e sigla", a.size === 2 && a.get("1287") === "GAB" && a.get("55") === "SEC", [...a]);
    checar("interessados negados (com espaco depois dos dois pontos)", i.size === 1 && i.get("100013362") === "CGE", [...i]);
    checar("a tela real do SP nao tem nenhum negado", lerNegados(fixture("sei41/p_procedimento_alterar.html").html, "assunto").size === 0);
    checar("sem o script: vazio", lerNegados("<html></html>", "assunto").size === 0);
  }

  secao("lerFormularioDoProcesso: lupas, negados e pesquisa");
  {
    const alterar = fixture("sei41/p_procedimento_alterar.html");
    const chamadas: Array<{ link: string; campos: Array<[string, string]>; op: unknown }> = [];
    const sei = {
      http: httpFalso(alterar, [], alterar),
      ajax: async (link: string, campos: Array<[string, string]>, op: unknown) => {
        chamadas.push({ link, campos, op });
        return [
          { id: "9001", texto: "Joao &quot;Zeca&quot; Souza" },
          { id: "9001", texto: "repetido" },
        ];
      },
    } as never;
    const fp = await lerFormularioDoProcesso(sei, arv);
    checar("assuntos do processo com id", fp.assuntos.length === 1 && fp.assuntos[0]?.id === "1287" && /contrata/.test(fp.assuntos[0]?.texto ?? ""), fp.assuntos);
    checar("interessados com id", fp.interessados.length >= 2 && fp.interessados[0]?.id === "100013362", fp.interessados.slice(0, 2));
    checar("negados vindos da tela (vazios no SP)", fp.assuntosNegados.size === 0 && fp.interessadosNegados.size === 0);
    const ass = await fp.pesquisarAssuntos("tecnologia", undefined);
    const c1 = chamadas[0];
    checar("assuntos: link do autocompletar da PROPRIA tela (colhido, nao montado)", /controlador_ajax\.php\?acao_ajax=assunto_auto_completar_RI1223/.test(c1?.link ?? ""), c1?.link);
    checar("assuntos: palavras_pesquisa sem codificar a mais (a tela nao codifica)", c1?.campos.length === 1 && c1.campos[0]?.[0] === "palavras_pesquisa" && c1.campos[0]?.[1] === "tecnologia", c1?.campos);
    checar("assuntos: corpo em UTF-8 como a tela", (c1?.op as { utf8?: boolean })?.utf8 === true);
    checar("sem repetidos e com as entidades decodificadas", ass.length === 1 && ass[0]?.texto === 'Joao "Zeca" Souza', ass);
    await fp.pesquisarContatos("João Silva");
    const c2 = chamadas[1];
    checar("contatos: link contato_auto_completar_contexto_RI1225", /acao_ajax=contato_auto_completar_contexto_RI1225/.test(c2?.link ?? ""), c2?.link);
    checar("contatos: a tela ja codifica o valor, vai codificado de novo", c2?.campos[0]?.[1] === encodeURIComponent("João Silva") || c2?.campos[0]?.[1] === encodeURIComponent("Jo%E3o Silva".replace("%E3", "ã")), c2?.campos);
    const semLink = comHtml(alterar, (h) => h.replace(/new infraAjaxAutoCompletar\('hdnIdAssunto'/g, "new Outro('hdnIdAssunto'"));
    const fp2 = await lerFormularioDoProcesso({ http: httpFalso(semLink, [], semLink), ajax: async () => [] } as never, arv);
    const erro = await lanca(() => fp2.pesquisarAssuntos("x"));
    checar("tela sem a pesquisa de assuntos: erro de versao, nao silencio", erro?.codigo === "SEI_VERSAO_NAO_SUPORTADA", erro?.codigo);
  }

  secao("pesquisa com a resposta REAL do autocompletar (XML do SEI SP, acentos)");
  {
    const alterar = fixture("sei41/p_procedimento_alterar.html");
    const enviados: Array<[string, string][]> = [];
    const comXml = (arquivo: string) => ({
      http: {
        ...httpFalso(alterar, [], alterar),
        async enviar(_u: string, pares: Array<[string, string]>) {
          enviados.push(pares);
          return fixture(arquivo);
        },
      },
      ajax: (l: string, c: Array<[string, string]>, o?: unknown) => Sei.prototype.ajax.call({ http: { enviar: async (_u: string, pares: Array<[string, string]>) => (enviados.push(pares), fixture(arquivo)) } }, l, c, o as never),
    });
    const fa = await lerFormularioDoProcesso(comXml("sei41/ajax_assunto_autocompletar.xml") as never, arv);
    const ass = await fa.pesquisarAssuntos("contrata\u00E7\u00E3o");
    checar("assuntos: itens do XML com id e descricao acentuada", ass.length >= 5 && ass[0]?.id === "1294" && ass[0]?.texto === "004.01.05.005 - Processo de contrata\u00E7\u00E3o de servi\u00E7os comuns", ass.slice(0, 2));
    const fc = await lerFormularioDoProcesso(comXml("sei41/ajax_contato_autocompletar.xml") as never, arv);
    const con = await fc.pesquisarContatos("seguran\u00E7a");
    checar("contatos: itens do XML com id e nome", con.length >= 5 && con.some((c) => c.id === "100002604" && c.texto === "Coordenadoria de Seguran\u00E7a Alimentar"), con.slice(0, 2));
    checar("o termo foi no campo palavras_pesquisa", enviados.every((p) => p.length === 1 && p[0]?.[0] === "palavras_pesquisa"));
  }

  secao("consultarDaArvore traz os itens da lupa com id");
  {
    const alterar = fixture("sei41/p_procedimento_alterar.html");
    const m = await consultarDaArvore(httpFalso(alterar, [], alterar), arv);
    checar("assuntosItens e interessadosItens na mesma ordem dos nomes", m.assuntosItens?.map((i) => i.texto).join("|") === m.assuntos.join("|") && m.interessadosItens?.map((i) => i.texto).join("|") === m.interessados.join("|") && (m.interessadosItens?.length ?? 0) >= 2);
  }

  secao("alterarProcesso: assuntos e interessados pela lupa");
  {
    const alterar = fixture("sei41/p_procedimento_alterar.html");
    const sucesso: Pagina = comHtml(alterar, (h) => h);
    (sucesso as { url: string }).url = "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=arvore_visualizar&id_procedimento=148265";
    const grav: Gravacao[] = [];
    const sei = { http: httpFalso(alterar, grav, sucesso), arvore: async () => arv, invalidar: () => undefined } as never;
    const novos = [
      { id: "1287", texto: "004.01.05.002 - Processo de contratação de serviço de informática e automação" },
      { id: "777", texto: "123.4 - Novo assunto" },
    ];
    const r = await alterarProcesso(sei, arv.protocolo, { assuntos: novos }, { aplicar: true });
    const pares = grav[0]?.pares ?? [];
    const hdn = pares.find(([n]) => n === "hdnAssuntos")?.[1] ?? "";
    checar("grava: aplicado e com a mudanca de Assuntos", r.aplicado && r.mudancas.some((m) => m.campo === "Assuntos"), r.mudancas);
    checar("hdnAssuntos serializado como a lupa (id, separador, texto, separador de item)", lerLupa(hdn).length === 2 && lerLupa(hdn)[1]?.id === "777" && lerLupa(hdn)[1]?.texto === "123.4 - Novo assunto", hdn);
    checar("o select da lupa nao vai no POST; flag de gravar (2)", !pares.some(([n]) => n === "selAssuntos") && pares.find(([n]) => n === "hdnFlagProcedimentoCadastro")?.[1] === "2");
    checar("os interessados continuam como estavam (nada apagado)", lerLupa(pares.find(([n]) => n === "hdnInteressadosProcedimento")?.[1] ?? "").length >= 2);

    const grav2: Gravacao[] = [];
    const sei2 = { http: httpFalso(alterar, grav2, sucesso), arvore: async () => arv, invalidar: () => undefined } as never;
    const atuais = (await lerFormularioDoProcesso(sei2, arv)).interessados;
    const semUm = atuais.filter((i) => i.id !== atuais[0]?.id);
    const novo = { id: "424242", texto: "Contato Novo" };
    await alterarProcesso(sei2, arv.protocolo, { interessados: [...semUm, novo] }, { aplicar: true });
    const lupa = lerLupa(grav2[0]?.pares.find(([n]) => n === "hdnInteressadosProcedimento")?.[1] ?? "");
    checar("interessados: sai um, entra um", lupa.length === atuais.length && !lupa.some((i) => i.id === atuais[0]?.id) && lupa.some((i) => i.id === "424242"), lupa.length);

    const sem = await lanca(() => alterarProcesso(sei, arv.protocolo, { assuntos: [] }, { aplicar: true }));
    checar("sem nenhum assunto: o SEI exige ao menos um, o erro vem antes de gravar", sem?.codigo === "ARGUMENTO_INVALIDO" && grav.length === 1, sem?.codigo);

    const trancado = comHtml(alterar, (h) =>
      h.replace("var arrAssuntosNegados = Array();", "var arrAssuntosNegados = Array();\narrAssuntosNegados[0] = {id_assunto:'1287',sigla_unidade:'GAB'};"),
    );
    const grav3: Gravacao[] = [];
    const sei3 = { http: httpFalso(trancado, grav3, sucesso), arvore: async () => arv, invalidar: () => undefined } as never;
    const negado = await lanca(() => alterarProcesso(sei3, arv.protocolo, { assuntos: [{ id: "777", texto: "x" }] }, { aplicar: true }));
    checar("retirar assunto acrescentado por outra unidade: erro com a mensagem da tela, nada gravado", negado?.codigo === "ARGUMENTO_INVALIDO" && /não pode ser removido porque foi adicionado pela unidade GAB/.test(negado.message ?? "") && grav3.length === 0, negado?.message);
    const mantem = await alterarProcesso(sei3, arv.protocolo, { assuntos: [novos[0] as { id: string; texto: string }, novos[1] as { id: string; texto: string }] }, { aplicar: true });
    checar("mantendo o negado e acrescentando outro, grava", mantem.aplicado && grav3.length === 1);

    const gravSimulada: Gravacao[] = [];
    const sei4 = { http: httpFalso(alterar, gravSimulada, sucesso), arvore: async () => arv, invalidar: () => undefined } as never;
    const sim = await alterarProcesso(sei4, arv.protocolo, { assuntos: novos }, { aplicar: false });
    checar("sem aplicar: so descreve, nao grava", !sim.aplicado && gravSimulada.length === 0 && sim.mudancas.length === 1);

    const naoConfirmou = await lanca(() =>
      alterarProcesso({ http: httpFalso(alterar, [], alterar), arvore: async () => arv, invalidar: () => undefined } as never, arv.protocolo, { assuntos: novos }, { aplicar: true }),
    );
    checar("resposta que e o proprio formulario: sem prova de sucesso, erro", naoConfirmou?.codigo === "SEI_RESPOSTA_INESPERADA", naoConfirmou?.codigo);
  }

  secao("SEI 5 (sintetico, do fonte 5.0.0): mesmos ids dos campos e do autocompletar");
  {
    const alterar = fixture("sei41/p_procedimento_alterar.html");
    const em5 = comHtml(alterar, (h) => h.replace(/infra_sistema=\d+/g, "infra_sistema=100000100"));
    const f = Formulario.de(em5, "#frmProcedimentoCadastro");
    checar("a lupa e o autocompletar usam hdnAssuntos/hdnIdAssunto e hdnInteressadosProcedimento/hdnIdInteressadoProcedimento", f.itensLupa("selAssuntos").length === 1 && /hdnIdInteressadoProcedimento/.test(em5.html) && /hdnIdAssunto/.test(em5.html));
  }
}
