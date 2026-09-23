/**
 * Desfazer: o mapa de inversas. O que mais importa aqui é o que NÃO tem
 * inversa — oferecer um desfazer que não desfaz seria pior que não ter.
 */

import { inversaDe, motivoSemDesfazer, type ResultadoDeEscrita } from "../src/painel/desfazer";
import { checar, secao } from "./util";

const feito = (mudancas: Array<{ campo: string; antes: string; depois: string }> = [], dados?: Record<string, unknown>): ResultadoDeEscrita => ({
  alvo: "X",
  mudancas,
  aplicado: true,
  ...(dados ? { dados } : {}),
});

export function verificarDesfazer(): void {
  secao("desfazer: o que volta ao estado anterior");
  const concluir = inversaDe("processo_concluir", { processos: ["1", "2"] }, feito());
  checar("concluir vira reabrir, um passo por processo", concluir?.passos.length === 2 && concluir.passos[0].op === "processo.reabrir");
  checar("os passos ja vao aplicados", concluir?.passos[0].args.aplicar === true);

  const semMarcadorAntes = inversaDe("processo_marcador", { processos: ["1"], marcador: "Urgente" }, feito([{ campo: "Marcador", antes: "", depois: "Urgente" }]));
  checar("marcador novo: remove", semMarcadorAntes?.passos[0].args.remover === true, semMarcadorAntes);
  const comMarcadorAntes = inversaDe("processo_marcador", { processos: ["1"], marcador: "Urgente" }, feito([{ campo: "Marcador", antes: "Aguardando", depois: "Urgente" }]));
  checar("marcador trocado: devolve o anterior", comMarcadorAntes?.passos[0].args.marcador === "Aguardando" && !comMarcadorAntes.passos[0].args.remover);

  const anotacao = inversaDe("processo_anotacao", { processos: ["1"], texto: "novo" }, feito([{ campo: "Anotação", antes: "antigo", depois: "novo" }]));
  checar("anotacao volta ao texto anterior", anotacao?.passos[0].args.texto === "antigo");
  const anotacaoNova = inversaDe("processo_anotacao", { processos: ["1"], texto: "novo" }, feito([{ campo: "Anotação", antes: "", depois: "novo" }]));
  checar("anotacao que nao existia e apagada", anotacaoNova?.passos[0].args.texto === "");

  const atribuir = inversaDe("processo_atribuir", { processos: ["1"], usuario: "fulano" }, feito([{ campo: "Atribuição", antes: "beltrano", depois: "fulano" }]));
  checar("atribuicao volta a quem estava", atribuir?.passos[0].args.usuario === "beltrano");

  checar("incluir no bloco vira retirar", inversaDe("bloco_incluir", { bloco: "10", documentos: ["1", "2"] }, feito())?.passos[0].op === "bloco.retirar");
  checar("retirar do bloco vira incluir", inversaDe("bloco_retirar", { bloco: "10", itens: ["1"] }, feito())?.passos[0].op === "bloco.incluir");
  checar("disponibilizar vira cancelar", inversaDe("bloco_disponibilizar", { bloco: "10" }, feito())?.passos[0].args.acao === "cancelar");
  checar("bloco criado pode ser excluido", inversaDe("bloco_criar", { descricao: "x" }, feito([], { bloco: "77" }))?.passos[0].args.bloco === "77");
  checar("documento criado pode ser excluido", inversaDe("documento_criar", { processo: "1" }, feito([], { numero: "0200001" }))?.passos[0].args.numero === "0200001");

  secao("desfazer: o que NAO se desfaz");
  checar("enviar processo nao tem inversa", inversaDe("processo_enviar", { processos: ["1"], unidades: ["X"] }, feito()) === null);
  checar("assinar nao tem inversa", inversaDe("documento_assinar", { numeros: ["1"] }, feito()) === null);
  checar("excluir nao tem inversa", inversaDe("documento_excluir", { numero: "1" }, feito()) === null);
  checar("andamento nao tem inversa", inversaDe("processo_andamento", { processos: ["1"], texto: "x" }, feito()) === null);
  checar("acompanhamento ainda nao tem remocao", inversaDe("processo_acompanhamento", { processos: ["1"] }, feito()) === null);
  checar("documento assinado nao vira exclusao", inversaDe("documento_criar", { processo: "1" }, feito([], { numero: "1", assinado: true })) === null);
  checar("bloco criado sem numero nao vira exclusao", inversaDe("bloco_criar", { descricao: "x" }, feito()) === null);

  checar("e o motivo e explicado", /outra unidade/.test(motivoSemDesfazer("processo_enviar")) && /justificativa/.test(motivoSemDesfazer("documento_assinar")));
  checar("ferramenta desconhecida nao inventa motivo", motivoSemDesfazer("tool_que_nao_existe") === "");
}
