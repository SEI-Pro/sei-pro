/**
 * Processos de um interessado pela pesquisa do SEI. Fixtures reais do SEI SP Treinamento (4.1.5), de um contato com 13
 * processos (duas páginas) e de outro com um só (o SEI pula direto para o processo). Hashes zerados.
 */
import { pesquisarProcessosDoInteressado, lerResultados } from "../src/dominio/pesquisa";
import type { Http, Pagina } from "../src/sessao/http";
import { checar, fixture, lanca, paginaSintetica, secao } from "./util";

interface Envio {
  action: string;
  pares: Array<[string, string]>;
}

function seiFalso(formulario: Pagina, respostas: Pagina[], envios: Envio[], pedidos: string[]) {
  const base = new URL("https://treinamento.sei.sp.gov.br/sei/");
  const http = {
    base,
    async obter(url: string) {
      pedidos.push(url);
      if (url.includes("acao=protocolo_pesquisar")) return formulario;
      throw new Error(`requisicao inesperada: ${url}`);
    },
    async enviar(url: string, pares: Array<[string, string]>) {
      envios.push({ action: url, pares });
      const r = respostas.shift();
      if (!r) throw new Error("sem resposta");
      return r;
    },
    absoluta: (u: string) => new URL(u, base).href,
  } as unknown as Http;
  return { http, linkMenu: (acao: string) => `controlador.php?acao=${acao}&infra_hash=0` };
}

const valor = (e: Envio | undefined, nome: string) => e?.pares.find(([n]) => n === nome)?.[1];

export async function verificarPesquisaInteressado(): Promise<void> {
  const p0 = fixture("sei41/p_pesquisa_interessado_p0.html");
  const p1 = fixture("sei41/p_pesquisa_interessado_p1.html");
  const unico = fixture("sei41/p_pesquisa_interessado_unico.html");

  secao("lerResultados: processos (4.1.5)");
  {
    const r = lerResultados(p0);
    checar("10 de 13", r.itens.length === 10 && r.total === 13, [r.itens.length, r.total]);
    const a = r.itens[0];
    checar("numero, tipo e id do processo", a?.protocolo === "033.00000024/2026-10" && a.tipoProcesso === "Expediente de atendimento" && a.idProcedimento === "155035", a);
    checar("unidade com sigla e nome", a?.unidade === "PMSP-CG" && a.unidadeNome === "Chefia de Gabinete", a);
    checar("usuario com login e nome, e a data", a?.usuario === "usuario01" && a.usuarioNome === "Usuário 01" && a.data === "22/04/2026", a);
    checar("nenhum e documento (a pesquisa e de processos)", r.itens.every((i) => !i.documento));
    const u = lerResultados(p1);
    checar("ultima pagina: 3 itens e o total vem de '13 resultados'", u.itens.length === 3 && u.total === 13, [u.itens.length, u.total]);
    checar("os ids de processo sao distintos entre as paginas", new Set([...r.itens, ...u.itens].map((i) => i.idProcedimento)).size === 13);
  }

  secao("pesquisarProcessosDoInteressado");
  {
    const envios: Envio[] = [];
    const pedidos: string[] = [];
    const sei = seiFalso(p0, [p0], envios, pedidos);
    const pg = await pesquisarProcessosDoInteressado(sei, { interessadoId: "100000913" });
    checar("primeira pagina: 10 processos, total 13, inicio 0", pg.processos.length === 10 && pg.total === 13 && pg.inicio === 0);
    const e = envios[0];
    checar("o formulario da pesquisa: processos, contato, inicio e botao", valor(e, "rdoPesquisarEm") === "P" && valor(e, "hdnIdContato") === "100000913" && valor(e, "hdnInicio") === "0" && valor(e, "sbmPesquisar") !== undefined, e?.pares.filter(([n]) => /rdo|Contato|Inicio|sbm|chkSinTram/.test(n)));
    checar("sem 'tramitado na unidade': o campo nem vai", valor(e, "chkSinTramitacao") === undefined);
    checar("so a pesquisa foi pedida (nenhuma arvore, nenhum processo)", pedidos.length === 1 && /acao=protocolo_pesquisar/.test(pedidos[0] ?? "") && !pedidos.some((u) => /procedimento_visualizar|arvore_montar|procedimento_trabalhar/.test(u)));
    checar("a action vem do proprio formulario da pesquisa", /acao=protocolo_pesquisar/.test(e?.action ?? ""), e?.action);
  }
  {
    const envios: Envio[] = [];
    const sei = seiFalso(p0, [p1], envios, []);
    const pg = await pesquisarProcessosDoInteressado(sei, { interessadoId: "100000913", inicio: 10, tramitadoNaUnidade: true });
    checar("segunda pagina: 3 processos, total 13, inicio 10", pg.processos.length === 3 && pg.total === 13 && pg.inicio === 10);
    checar("hdnInicio=10 e tramitado na unidade (chkSinTramitacao=S)", valor(envios[0], "hdnInicio") === "10" && valor(envios[0], "chkSinTramitacao") === "S");
  }
  {
    const envios: Envio[] = [];
    const sei = seiFalso(p0, [p0], envios, []);
    await pesquisarProcessosDoInteressado(sei, { interessadoId: "1", tipoProcesso: "Expediente de atendimento" });
    const op = (p0.doc.querySelector("#selTipoProcedimentoPesquisa option[value]:not([value='null'])") as Element | null)?.getAttribute("value");
    checar("mesma natureza: o tipo escolhido na lista da tela", valor(envios[0], "selTipoProcedimentoPesquisa") !== "null" && valor(envios[0], "selTipoProcedimentoPesquisa") !== undefined && op !== undefined, valor(envios[0], "selTipoProcedimentoPesquisa"));
    const erro = await lanca(() => pesquisarProcessosDoInteressado(seiFalso(p0, [p0], [], []), { interessadoId: "1", tipoProcesso: "Tipo que nao existe" }));
    checar("tipo desconhecido: erro explicito, sem pesquisar", erro?.codigo === "ARGUMENTO_INVALIDO", erro?.codigo);
  }
  {
    const envios: Envio[] = [];
    const pedidos: string[] = [];
    const sei = seiFalso(p0, [unico], envios, pedidos);
    const pg = await pesquisarProcessosDoInteressado(sei, { interessadoId: "100013459" });
    checar("um unico resultado: o SEI pula para o processo, e lemos so o numero e o id", pg.total === 1 && pg.processos[0]?.protocolo === "001.00000003/2026-62" && pg.processos[0]?.idProcedimento === "154676", pg);
    checar("sem buscar a arvore do processo (nenhuma requisicao alem da pesquisa)", pedidos.length === 1);
  }
  {
    const vazia = paginaSintetica(`<form id="x"></form><div id="conteudo"><div class="pesquisaBarra"><div class="pesquisaBarraD">0 resultados</div></div>Nenhum resultado encontrado.</div>`, "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=protocolo_pesquisar&acao_origem=protocolo_pesquisar");
    const pg = await pesquisarProcessosDoInteressado(seiFalso(p0, [vazia], [], []), { interessadoId: "9" });
    checar("sem resultado: total 0 e lista vazia, nao erro", pg.total === 0 && pg.processos.length === 0, pg);
    const estranha = paginaSintetica("<h1>Erro</h1>", "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=outra");
    const e = await lanca(() => pesquisarProcessosDoInteressado(seiFalso(p0, [estranha], [], []), { interessadoId: "9" }));
    checar("resposta que nao e a pesquisa: erro explicito", e?.codigo === "SEI_RESPOSTA_INESPERADA", e?.codigo);
    const sem = await lanca(() => pesquisarProcessosDoInteressado(seiFalso(p0, [], [], []), { interessadoId: "" }));
    checar("sem interessado: erro, sem rede", sem?.codigo === "ARGUMENTO_INVALIDO");
    const semForm = await lanca(() => pesquisarProcessosDoInteressado(seiFalso(paginaSintetica("<p>sessao</p>"), [], [], []), { interessadoId: "9" }));
    checar("tela sem o formulario da pesquisa: erro de versao", semForm?.codigo === "SEI_VERSAO_NAO_SUPORTADA", semForm?.codigo);
  }
}
