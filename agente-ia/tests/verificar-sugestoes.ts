/**
 * Sugestões do painel: o que aparece precisa combinar com a tela do SEI ao
 * lado — e nada pode prometer o que as ferramentas não fazem.
 */

import { SUGESTOES, sugestoesPara } from "../src/painel/sugestoes";
import { TOOLS_SEI } from "../src/tools/sei";
import { TOOLS_MOTOR } from "../src/tools/motor";
import { checar, secao } from "./util";

export function verificarSugestoes(): void {
  secao("sugestoes: combinam com a tela");

  const caixa = sugestoesPara({ acao: "procedimento_controlar", unidade: "TESTE" });
  checar("na caixa nao sugere explicar documento", !caixa.some((s) => /documento na tela|linguagem simples/i.test(s.rotulo + s.descricao)), caixa.map((s) => s.rotulo));
  checar("na caixa fala da unidade", caixa.some((s) => /caixa|unidade|comigo|dono/i.test(s.rotulo)), caixa.map((s) => s.rotulo));

  const processo = sugestoesPara({ acao: "procedimento_trabalhar", processo: { protocolo: "1234.5678/2026-90" } });
  checar("no processo sugere resumir", processo.some((s) => /resumir este processo/i.test(s.rotulo)));
  checar("no processo cita o protocolo no pedido", processo.some((s) => s.prompt.includes("1234.5678/2026-90")));
  checar("no processo nao sugere coisa da caixa", !processo.some((s) => /panorama da caixa/i.test(s.rotulo)), processo.map((s) => s.rotulo));

  const documento = sugestoesPara({ acao: "procedimento_trabalhar", processo: { protocolo: "1" }, documento: { numero: "0104018" } });
  checar("com documento aberto sugere linguagem simples", documento.some((s) => /linguagem simples/i.test(s.rotulo)));
  checar("com documento aberto cita o numero", documento.some((s) => s.prompt.includes("0104018")));

  const editor = sugestoesPara({ editores: ["0104018"] });
  checar("editor aberto vem primeiro", /revisar/i.test(editor[0]?.rotulo ?? ""), editor.map((s) => s.rotulo));

  const marcados = sugestoesPara({ acao: "procedimento_controlar", selecionados: ["1", "2"] });
  checar("processos marcados aparecem", marcados.some((s) => /marcados|selecionados/i.test(s.rotulo)), marcados.map((s) => s.rotulo));
  checar("pedido lista os marcados", marcados.some((s) => s.prompt.includes("1, 2")));

  const semAba = sugestoesPara(null);
  checar("sem aba ainda sugere algo", semAba.length >= 3, semAba.map((s) => s.rotulo));
  checar("sem aba nao fala de processo aberto", !semAba.some((s) => /este processo|na tela/i.test(s.rotulo + s.descricao)), semAba.map((s) => s.rotulo));

  secao("sugestoes: promessas que as tools cumprem");
  const nomes = [...TOOLS_SEI, ...TOOLS_MOTOR].map((t) => t.nome).join(" ");
  // Cada tema citado nas sugestões precisa ter ferramenta correspondente.
  const temas: Array<[string, string]> = [
    ["acompanhamento", "acompanhamento"],
    ["marcador", "marcador"],
    ["anota", "anotacao"],
    ["pesquis", "pesquisar"],
    ["despacho", "documento_criar"],
  ];
  for (const [palavra, tool] of temas) {
    const usa = SUGESTOES.some((s) => new RegExp(palavra, "i").test(s.rotulo + s.descricao));
    checar(`tema "${palavra}" tem ferramenta (${tool})`, !usa || nomes.includes(tool));
  }
  checar("nenhuma sugestao fala de bloco de assinatura", !SUGESTOES.some((s) => /bloco/i.test(s.rotulo + s.descricao + s.prompt({}))));
  checar("todas tem rotulo curto", SUGESTOES.every((s) => s.rotulo.length <= 34), SUGESTOES.filter((s) => s.rotulo.length > 34).map((s) => s.rotulo));
}
