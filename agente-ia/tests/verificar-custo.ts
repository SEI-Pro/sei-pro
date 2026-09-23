/**
 * Cache de prompt, teto de gasto e memória da unidade — as três peças que
 * mexem em dinheiro e em contexto que atravessa conversas.
 */

import { comCache } from "../src/motor/provedor";
import { cabeMaisUma, SEM_LIMITE } from "../src/painel/gasto";
import { anotar, blocoDeMemoria, MAX_TEXTO, type Lembranca } from "../src/painel/memoria";
import type { Mensagem } from "../src/motor/tipos";
import { checar, secao } from "./util";

const longo = (n = 900) => "x".repeat(n);
const marcado = (m: Mensagem) => Array.isArray(m.content) && (m.content as Array<{ cache_control?: unknown }>)[0]?.cache_control !== undefined;

export function verificarCusto(): void {
  secao("cache de prompt");
  const conversa: Mensagem[] = [
    { role: "system", content: longo() },
    { role: "user", content: "primeiro pedido" },
    { role: "assistant", content: longo() },
    { role: "user", content: "pedido novo" },
  ];
  const claude = comCache(conversa, "anthropic/claude-sonnet-5", "openrouter");
  checar("marca o fim das instrucoes", marcado(claude[0]));
  checar("marca o fim do historico anterior ao pedido novo", marcado(claude[2]));
  checar("nao marca o pedido novo", !marcado(claude[3]));
  checar("gpt nao recebe marcacao (o cache dele e automatico)", comCache(conversa, "openai/gpt-5", "openrouter").every((m) => !marcado(m)));
  checar("gemini tambem nao", comCache(conversa, "gemini-2.5-flash", "gemini").every((m) => !marcado(m)));
  checar("servico anthropic direto recebe", marcado(comCache(conversa, "claude-sonnet-5", "anthropic")[0]));
  const curto: Mensagem[] = [{ role: "system", content: "curto" }, { role: "user", content: "oi" }];
  checar("texto curto nao vale cache", comCache(curto, "claude-sonnet-5", "anthropic").every((m) => !marcado(m)));

  secao("teto de gasto");
  checar("sem limite, passa sempre", cabeMaisUma(SEM_LIMITE, 999, 999).permite);
  const limites = { conversa: 10, dia: 20 };
  checar("dentro do limite, passa sem aviso", cabeMaisUma(limites, 1, 1).permite && !(cabeMaisUma(limites, 1, 1) as { aviso?: string }).aviso);
  const perto = cabeMaisUma(limites, 8.5, 1);
  checar("perto do limite da conversa, avisa", perto.permite && Boolean((perto as { aviso?: string }).aviso));
  const estourou = cabeMaisUma(limites, 10, 1);
  checar("no limite da conversa, barra", !estourou.permite);
  checar("e explica o caminho", !estourou.permite && /conversa nova|aumente o limite/i.test(estourou.motivo));
  const dia = cabeMaisUma(limites, 0, 25);
  checar("limite do dia barra mesmo com conversa nova", !dia.permite && /amanhã/.test(dia.motivo));

  secao("memoria da unidade");
  const vazia: Lembranca[] = [];
  const ok = anotar(vazia, "Os despachos desta unidade vão assinados pelo coordenador.", "agente");
  checar("habito da unidade entra", ok.ok);
  checar("curto demais nao entra", !anotar(vazia, "sim", "agente").ok);
  checar("longo demais nao entra", !anotar(vazia, "a".repeat(MAX_TEXTO + 1), "agente").ok);
  const comPessoa = anotar(vazia, "O interessado [PESSOA_1] prefere ser avisado por e-mail.", "agente");
  checar("dado pessoal nao entra", !comPessoa.ok && /pessoas/i.test((comPessoa as { motivo: string }).motivo));
  const comNumero = anotar(vazia, "O processo 12345.678901/2026-11 está aguardando parecer.", "agente");
  checar("caso especifico nao entra", !comNumero.ok && /caso/i.test((comNumero as { motivo: string }).motivo));
  checar("o usuario pode escrever o que quiser", anotar(vazia, "Ver processo 12345.678901/2026-11 toda segunda.", "usuario").ok);
  const uma = [(anotar(vazia, "A unidade usa o marcador Prioritário para urgente.", "agente") as { lembranca: Lembranca }).lembranca];
  checar("nao repete o que ja sabe", !anotar(uma, "a unidade usa o marcador prioritário para urgente", "agente").ok);
  checar("bloco do prompt lista as lembrancas", blocoDeMemoria(uma).includes("marcador Prioritário"));
  checar("e diz que o SEI vale mais", /vale o SEI/i.test(blocoDeMemoria(uma)));
  checar("sem memoria, nada vai ao prompt", blocoDeMemoria([]) === "");
}
