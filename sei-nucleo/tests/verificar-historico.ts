/** Consulta de metadados pela arvore ja aberta: um GET, sem buscar a arvore de novo. */

import { lerArvore, acaoNaArvore } from "../src/dominio/arvore";
import { consultarDaArvore, consultarProcesso } from "../src/dominio/processo";
import type { Sei } from "../src/sei";
import type { Http, Pagina } from "../src/sessao/http";
import { checar, fixture, lanca, secao } from "./util";

function httpFalso(chamadas: string[]): Http {
  const alterar = fixture("sei41/p_procedimento_alterar.html");
  const base = new URL("https://treinamento.sei.sp.gov.br/sei/");
  return {
    base,
    async obter(url: string): Promise<Pagina> {
      chamadas.push(url);
      if (url.includes("acao=procedimento_alterar")) return alterar;
      throw new Error(`requisicao inesperada: ${url}`);
    },
    async enviar() {
      throw new Error("enviar nao esperado");
    },
    absoluta: (u: string) => new URL(u, base).href,
    async baixar() {
      throw new Error("baixar nao esperado");
    },
  };
}

export async function verificarHistorico(): Promise<void> {
  secao("consultarDaArvore (arvore ja aberta)");
  const arv = lerArvore(fixture("sei41/arvore.html"));
  const chamadas: string[] = [];
  const meta = await consultarDaArvore(httpFalso(chamadas), arv);
  checar("um unico GET", chamadas.length === 1, chamadas);
  checar("GET no link procedimento_alterar da arvore", chamadas[0] === acaoNaArvore(arv, "procedimento_alterar"), chamadas[0]);
  checar("nao pesquisa nem abre o processo", !chamadas.some((c) => c.includes("pesquisa_rapida") || c.includes("procedimento_trabalhar")));
  checar("tipo lido do formulario", meta.tipo === "Processo de contrata\u00E7\u00E3o de servi\u00E7os de inform\u00E1tica e automa\u00E7\u00E3o", meta.tipo);
  checar("especificacao lida", meta.especificacao === "CAU contrato", meta.especificacao);
  checar("assuntos lidos", meta.assuntos.length === 1 && meta.assuntos[0].startsWith("004.01.05.002 - "), meta.assuntos);
  checar("interessados lidos", JSON.stringify(meta.interessados) === JSON.stringify(["CGE-CAUD", "Cliente 1"]), meta.interessados);
  checar("editavel com link de alterar", meta.editavel === true);
  checar("autuacao lida do campo hdnDtaGeracao (a capa a mostra)", meta.autuacao === "10/07/2025", meta.autuacao);

  const sei = { arvore: async () => arv, http: httpFalso([]) } as unknown as Sei;
  const completo = await consultarProcesso(sei, arv.protocolo);
  checar(
    "mesmos campos que consultarProcesso",
    completo.tipo === meta.tipo &&
      completo.especificacao === meta.especificacao &&
      JSON.stringify(completo.assuntos) === JSON.stringify(meta.assuntos) &&
      JSON.stringify(completo.interessados) === JSON.stringify(meta.interessados) &&
      completo.observacoes === meta.observacoes &&
      completo.editavel === meta.editavel,
  );

  const soConsulta = { ...arv, acoesProcesso: arv.acoesProcesso.map((l) => l.replace("acao=procedimento_alterar", "acao=procedimento_consultar")), links: [] };
  const link = acaoNaArvore(soConsulta, "procedimento_consultar");
  if (link) {
    const cham: string[] = [];
    const http = httpFalso(cham);
    const orig = http.obter.bind(http);
    http.obter = async (u, o) => {
      cham.push(u);
      return orig(u.replace("procedimento_consultar", "procedimento_alterar"), o);
    };
    const m2 = await consultarDaArvore(http, soConsulta);
    checar("so consultar: GET no link de consulta e nao editavel", cham[0] === link && m2.editavel === false, cham);
  } else {
    console.log("  (fixture sem link de consulta: caso opcional omitido)");
  }

  const vazia = { ...arv, acoesProcesso: [], links: [] };
  const erro = await lanca(() => consultarDaArvore(httpFalso([]), vazia));
  checar("sem link de alterar nem consultar: SEI_ACAO_INDISPONIVEL", erro?.codigo === "SEI_ACAO_INDISPONIVEL", erro?.codigo);
}
