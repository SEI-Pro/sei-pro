/**
 * Estúdio de Fluxo: validação do modelo de dados.
 *
 * O que importa aqui é o que o usuário consegue quebrar sem perceber ao montar
 * um fluxo à mão: etapa sem documento (nunca casa), dois ids iguais (a avaliação
 * anda em círculo) e desvio apontando para etapa que não existe (o fluxo trava).
 */

import { etapaNova, fluxoNovo, validarFluxo, type Etapa, type Fluxo } from "../src/fluxos/modelo";
import { checar, secao } from "./util";

const etapa = (e: Partial<Etapa> = {}): Etapa => ({ ...etapaNova("Nota Técnica"), ...e });

const fluxo = (f: Partial<Fluxo> = {}): Fluxo => ({
  ...fluxoNovo("Contrato de transição"),
  etapas: [etapa({ id: "e1" }), etapa({ id: "e2", nome: "Despacho de aprovação", documento: { tituloContem: ["Despacho"] } })],
  ...f,
});

export function verificarFluxosModelo(): void {
  secao("fluxos: validação do modelo");
  checar("fluxo bem montado não acusa nada", validarFluxo(fluxo()).length === 0, validarFluxo(fluxo()));
  checar("fluxo sem nome acusa", validarFluxo(fluxo({ nome: "  " })).some((p) => /nome/i.test(p)));
  checar("fluxo sem etapa acusa", validarFluxo(fluxo({ etapas: [] })).some((p) => /etapa/i.test(p)));

  const semDocumento = fluxo({ etapas: [etapa({ id: "e1", documento: { tituloContem: [] } })] });
  checar("etapa sem documento acusa", validarFluxo(semDocumento).some((p) => /documento/i.test(p)));
  const soEspaco = fluxo({ etapas: [etapa({ id: "e1", documento: { tituloContem: ["   "] } })] });
  checar("etapa com título em branco acusa", validarFluxo(soEspaco).some((p) => /documento/i.test(p)));

  const idRepetido = fluxo({ etapas: [etapa({ id: "igual" }), etapa({ id: "igual", nome: "Despacho" })] });
  checar("id repetido acusa", validarFluxo(idRepetido).some((p) => /id/i.test(p)));

  const desvioPerdido = fluxo({ etapas: [etapa({ id: "e1" }), etapa({ id: "e2", condicao: { seDocumentoContem: "pend", entaoIrPara: "naoexiste" } })] });
  checar("desvio para etapa inexistente acusa", validarFluxo(desvioPerdido).some((p) => /desvio|etapa/i.test(p)));
  const desvioBom = fluxo({ etapas: [etapa({ id: "e1" }), etapa({ id: "e2", condicao: { seDocumentoContem: "pend", entaoIrPara: "e1" } })] });
  checar("desvio para etapa existente passa", validarFluxo(desvioBom).length === 0, validarFluxo(desvioBom));

  const etapaSemNome = fluxo({ etapas: [etapa({ id: "e1", nome: " " })] });
  checar("etapa sem nome acusa", validarFluxo(etapaSemNome).some((p) => /nome/i.test(p)));

  secao("fluxos: novos em branco");
  checar("fluxo novo já nasce válido com uma etapa", validarFluxo({ ...fluxoNovo("Rito"), etapas: [etapaNova("Ofício")] }).length === 0);
  checar("fluxo novo nasce desligado", fluxoNovo("Rito").ativo === false);
  checar("dois fluxos novos têm ids diferentes", fluxoNovo("a").id !== fluxoNovo("b").id);
  checar("etapa nova usa o nome como título procurado", etapaNova("Ofício").documento.tituloContem[0] === "Ofício");
  checar("etapa nova é obrigatória", etapaNova("Ofício").obrigatoria === true);
}

/**
 * Casos vindos da revisão: coisas que passavam na validação e quebravam o fluxo
 * em silêncio depois.
 */
export function verificarFluxosRevisao(): void {
  secao("fluxos: validacao, casos da revisao");
  const proprio: Fluxo = {
    ...fluxoNovo("Rito"),
    etapas: [
      { ...etapaNova("A"), id: "a" },
      { ...etapaNova("B"), id: "b", condicao: { seDocumentoContem: "x", entaoIrPara: "b" } },
      { ...etapaNova("C"), id: "c" },
    ],
  };
  // Um desvio para a própria etapa bate na guarda de laço da avaliação e
  // ENCERRA o percurso ali: as etapas seguintes nunca são avaliadas.
  checar("desvio para a propria etapa acusa", validarFluxo(proprio).some((p) => /desvio/i.test(p)), validarFluxo(proprio));
}
