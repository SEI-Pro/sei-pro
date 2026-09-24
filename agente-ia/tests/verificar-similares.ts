/**
 * Documentos parecidos, para o agente aprender a estrutura e a linguagem antes
 * de escrever.
 *
 * A ordem é a regra de negócio: mesmo TIPO DE PROCESSO primeiro (é o que faz o
 * documento se parecer de verdade), depois os do próprio usuário (assinados ou
 * gerados por ele), depois os mais recentes. Errar a ordem faz o agente copiar
 * a estrutura do documento errado — e o usuário só descobre lendo a minuta.
 */

import { ordenarSimilares, type Similar } from "../src/ponte/operacoes";
import { checar, secao } from "./util";

const r = (p: Partial<Similar>): Similar => ({
  protocolo: "1", tipoProcesso: "Outro", documento: { numero: "0", tipo: "Despacho" },
  unidade: "GPF", usuario: "outra.pessoa", data: "01/01/2025", trecho: "", ...p,
});

const EU = { login: "pedro.soares", nome: "Pedro Soares" };

export function verificarSimilares(): void {
  secao("similares: a ordem");
  const lista = [
    r({ protocolo: "A", tipoProcesso: "Outro", usuario: "fulano", data: "10/09/2026" }),
    r({ protocolo: "B", tipoProcesso: "Fiscalização", usuario: "fulano", data: "01/02/2026" }),
    r({ protocolo: "C", tipoProcesso: "Outro", usuario: "pedro.soares", data: "01/03/2026" }),
    r({ protocolo: "D", tipoProcesso: "Fiscalização", usuario: "pedro.soares", data: "05/01/2026" }),
  ];
  const ordem = ordenarSimilares(lista, { ...EU, tipoProcesso: "Fiscalização" }).map((x) => x.protocolo);
  checar("mesmo tipo de processo E meu vem primeiro", ordem[0] === "D", ordem);
  checar("depois o do mesmo tipo de processo", ordem[1] === "B", ordem);
  checar("depois o meu, de outro tipo", ordem[2] === "C", ordem);
  checar("por ultimo o de outra pessoa e outro tipo", ordem[3] === "A", ordem);

  secao("similares: quem sou eu");
  const marcados = ordenarSimilares(lista, { ...EU, tipoProcesso: "Fiscalização" });
  checar("marca os que sao meus", marcados.filter((x) => x.meu).map((x) => x.protocolo).sort().join() === "C,D", marcados.map((x) => [x.protocolo, x.meu]));
  checar("marca os do mesmo tipo de processo", marcados.filter((x) => x.mesmoTipoProcesso).map((x) => x.protocolo).sort().join() === "B,D");
  const porNome = ordenarSimilares([r({ protocolo: "N", usuario: "Pedro Soares (pedro.soares)" })], { ...EU, tipoProcesso: "" });
  checar("reconhece o usuario pelo nome tambem", porNome[0].meu === true, porNome[0]);
  checar("nao confunde com nome parecido", ordenarSimilares([r({ usuario: "pedro.soares.junior" })], { ...EU, tipoProcesso: "" })[0].meu === false);

  secao("similares: desempate por data");
  const mesmaFaixa = [
    r({ protocolo: "velho", tipoProcesso: "Fiscalização", usuario: "pedro.soares", data: "01/01/2024" }),
    r({ protocolo: "novo", tipoProcesso: "Fiscalização", usuario: "pedro.soares", data: "20/08/2026" }),
  ];
  checar("o mais recente primeiro", ordenarSimilares(mesmaFaixa, { ...EU, tipoProcesso: "Fiscalização" })[0].protocolo === "novo");
  checar("data vazia nao quebra a ordem, e vai para o fim", ordenarSimilares([r({ protocolo: "sem-data", data: "" }), r({ protocolo: "com-data", data: "01/01/2026" })], { ...EU, tipoProcesso: "" }).map((x) => x.protocolo).join() === "com-data,sem-data");

  secao("similares: sem repetir e sem o proprio processo");
  const repetido = [r({ protocolo: "X", documento: { numero: "999", tipo: "Despacho" } }), r({ protocolo: "X", documento: { numero: "999", tipo: "Despacho" } })];
  checar("o mesmo documento entra uma vez so", ordenarSimilares(repetido, { ...EU, tipoProcesso: "" }).length === 1);
  const comOAtual = [r({ protocolo: "12345.000001/2026-11" }), r({ protocolo: "outro", documento: { numero: "77", tipo: "Despacho" } })];
  checar("o processo que estou escrevendo fica de fora", ordenarSimilares(comOAtual, { ...EU, tipoProcesso: "", excluirProcesso: "12345.000001/2026-11" }).map((x) => x.protocolo).join() === "outro");
}
