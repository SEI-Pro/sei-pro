/**
 * Estúdio de Fluxo: o texto do cartão de sugestão.
 *
 * O que este teste guarda é uma promessa feita ao usuário: o cartão fala de
 * ESTRUTURA (que documento existe, qual não existe, em que ordem) e sempre no
 * condicional. Ele não pode afirmar nada sobre o CONTEÚDO dos documentos — a
 * avaliação nem leu o conteúdo — nem dizer ao servidor público o que ele tem
 * de fazer.
 */

import { detalhesDaSugestao, textoDaSugestao } from "../src/fluxos/cartao";
import { checar, secao } from "./util";

const SUG = {
  fluxo: "Contrato de transição",
  etapa: "Despacho de aprovação",
  etapaAnterior: "Nota Técnica",
  anterior: { numero: "0123456", titulo: "Nota Técnica 55", assinado: true },
  cumpridas: [
    { etapa: "Nota Técnica", numero: "0123456", titulo: "Nota Técnica 55" },
  ],
};

export function verificarCartaoDeFluxo(): void {
  secao("cartao: o texto da sugestao");
  const t = textoDaSugestao(SUG);
  checar("cita o documento encontrado, com número", t.includes("Nota Técnica 55") && t.includes("0123456"));
  checar("cita o nome do fluxo", t.includes("Contrato de transição"));
  checar("cita o documento que falta", t.includes("Despacho de aprovação"));
  checar("diz que o anterior está assinado", /assinado/.test(t));
  checar("está no condicional", /talvez|pode ser/i.test(t));
  // "providência" é o mais perto de imperativo que o cartão chega; "você deve",
  // "é preciso" e afins transformariam sugestão em ordem.
  checar("não manda ninguém fazer nada", !/você deve|é preciso|precisa (criar|assinar|enviar)|faça /i.test(t));
  checar("não afirma nada sobre o conteúdo", !/concl(ui|uiu)|aponta|determina|decide/i.test(t));

  const semAssinar = textoDaSugestao({ ...SUG, anterior: { ...SUG.anterior, assinado: false } });
  checar("documento sem assinatura é dito como tal", /sem assinatura/.test(semAssinar));

  secao("cartao: os detalhes");
  const d = detalhesDaSugestao(SUG);
  checar("lista o que já foi cumprido", d.some((l) => l.includes("Nota Técnica 55")));
  checar("marca a etapa que falta", d.some((l) => /falta/i.test(l) && l.includes("Despacho de aprovação")));
  checar("uma linha por etapa cumprida mais a que falta", d.length === 2);
  const tres = detalhesDaSugestao({
    ...SUG,
    cumpridas: [
      { etapa: "Nota Técnica", numero: "0123456", titulo: "Nota Técnica 55" },
      { etapa: "Parecer", numero: "0123457", titulo: "Parecer 9" },
    ],
  });
  checar("preserva a ordem das cumpridas", tres[0].includes("Nota Técnica 55") && tres[1].includes("Parecer 9"));
  checar("numera as etapas", /^1\./.test(tres[0]) && /^2\./.test(tres[1]));
}
