/**
 * Tools do próprio motor: não tocam no SEI.
 *
 * `plano_propor` é tratado pelo motor (vira o cartão de aprovação); a
 * definição aqui existe para o modelo conhecer o formato e para o validador.
 */

import { s } from "../motor/esquema";
import { definirTool, type DefTool } from "../motor/tools";
import type { Tarefa } from "../motor/tipos";
import { SKILLS } from "../skills";

/** Skill escrita pelo usuário nas configurações (ver painel/skills.ts). */
export interface SkillExtra {
  slug: string;
  nome: string;
  descricao: string;
  texto: string;
}

export function toolsMotor(extras: SkillExtra[] = []): DefTool[] {
  const disponiveis: Array<[string, string, string]> = [
    ...Object.entries(SKILLS).map(([k, v]) => [k, v.descricao, v.texto] as [string, string, string]),
    ...extras.map((e) => [e.slug, `${e.nome}: ${e.descricao}`.trim(), e.texto] as [string, string, string]),
  ];
  const textos = new Map(disponiveis.map(([k, , t]) => [k, t]));
  return [
  definirTool({
    nome: "plano_propor",
    descricao:
      "Prop\u00F5e ao usu\u00E1rio um plano com V\u00C1RIAS escritas no SEI, que ele aprova de uma vez. Use quando uma escrita depende de outra (refer\u00EAncias \"$1.caminho\" ao resultado do passo 1, ou \"{$1.caminho}\" dentro de texto) ou para agrupar opera\u00E7\u00F5es diferentes. Para uma escrita s\u00F3, chame a ferramenta de escrita diretamente: ela j\u00E1 pede aprova\u00E7\u00E3o. Os passos executam em ordem, sem voltar a voc\u00EA; um passo que falha interrompe os seguintes.",
    parametros: s.objeto({
      objetivo: s.texto({ descricao: "Uma frase: o que o plano faz." }),
      passos: s.lista(s.objeto({ tool: s.texto({ descricao: "Nome de uma ferramenta de escrita." }), args: s.livre({ descricao: "Argumentos da ferramenta." }) }), { min: 1, max: 30 }),
    }),
    efeito: "interna",
    rotulo: (a) => String(a.objetivo),
    executar: async () => ({ erro: "plano_propor \u00E9 tratado pelo motor." }),
  }),

  definirTool({
    nome: "tarefas",
    descricao:
      "Mostra ao usu\u00E1rio a lista de tarefas do pedido e o andamento. Use em pedidos com 3 ou mais etapas; atualize marcando 'fazendo' e 'feita'. Envie sempre a lista inteira.",
    parametros: s.objeto({
      itens: s.lista(s.objeto({ titulo: s.texto(), estado: s.texto({ enum: ["pendente", "fazendo", "feita"] }) }), { min: 1, max: 20 }),
    }),
    efeito: "interna",
    rotulo: () => "Atualizar tarefas",
    executar: async (a, ctx) => {
      ctx.ui.tarefas(a.itens as Tarefa[]);
      return { ok: true };
    },
  }),

  definirTool({
    nome: "perguntar",
    descricao:
      "Pergunta algo ao usu\u00E1rio quando o pedido \u00E9 amb\u00EDguo e a resposta muda o que fazer (qual processo, qual tipo, qual hip\u00F3tese). Ofere\u00E7a op\u00E7\u00F5es quando houver. N\u00E3o use para pedir aprova\u00E7\u00E3o de escrita: as ferramentas de escrita j\u00E1 pedem.",
    parametros: s.objeto({ pergunta: s.texto(), "opcoes?": s.lista(s.texto(), { max: 6 }) }),
    efeito: "interna",
    rotulo: () => "Perguntar ao usu\u00E1rio",
    executar: async (a, ctx) => ({ resposta: await ctx.ui.perguntar(String(a.pergunta), (a.opcoes as string[]) ?? []) }),
  }),

  definirTool({
    nome: "skill_ler",
    descricao: `Carrega instru\u00E7\u00F5es detalhadas sobre um assunto. Dispon\u00EDveis: ${disponiveis
      .map(([k, d]) => `"${k}" (${d})`)
      .join("; ")}. Leia "redacao-oficial" antes de escrever conte\u00FAdo de documento.`,
    parametros: s.objeto({ nome: s.texto({ enum: disponiveis.map(([k]) => k) }) }),
    efeito: "interna",
    rotulo: (a) => `Ler instru\u00E7\u00F5es: ${a.nome}`,
    executar: async (a) => textos.get(String(a.nome)) ?? "Skill n\u00E3o encontrada.",
  }),
  ];
}

/** As tools do motor sem skills do usuário (testes e usos que não têm configuração). */
export const TOOLS_MOTOR: DefTool[] = toolsMotor();
