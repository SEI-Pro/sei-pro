/**
 * Gasto da conversa com agente auxiliar (relato da 2.9: "o valor final é o da
 * conversa principal"). Cada motor informa o ACUMULADO dele; o contador da
 * conversa precisa somar a diferença de cada um, sem apagar nem duplicar.
 */

import { validarItem } from "../src/arquivo/validar";
import { ContadorDeUso, modelosCurtos, modelosDaConversa } from "../src/painel/uso";
import type { Uso } from "../src/motor/tipos";
import { checar, secao } from "./util";

const u = (custo: number, entrada = custo * 1000, saida = 0): Uso => ({ entrada, saida, custo });
const perto = (a: number, b: number) => Math.abs(a - b) < 1e-9;

export function verificarUsoDaConversa(): void {
  secao("gasto: principal, auxiliar e principal de novo");
  {
    const c = new ContadorDeUso();
    const principal = c.fonte();
    principal(u(0.01)); // 1ª chamada do principal
    const auxiliar = c.fonte(); // o principal delegou
    auxiliar(u(0.02));
    auxiliar(u(0.04));
    auxiliar(u(0.06)); // 3 passos de 2 centavos, informados como acumulado
    checar("o auxiliar entra pela diferenca, nao pelo acumulado somado", perto(c.total.custo, 0.07), c.total);
    principal(u(0.02)); // o principal fecha a rodada
    checar("o principal nao apaga o gasto do auxiliar", perto(c.total.custo, 0.08), c.total);
    checar("tokens somam do mesmo jeito", perto(c.total.entrada, 80), c.total);
  }

  secao("gasto: motor principal recriado no meio da conversa");
  {
    const c = new ContadorDeUso();
    c.fonte()(u(0.05));
    // Trocou a configuração: motor novo, que recomeça o acumulado do zero.
    const novo = c.fonte();
    novo(u(0.01));
    checar("o gasto do motor anterior continua contando", perto(c.total.custo, 0.06), c.total);
  }

  secao("gasto: conversa nova e conversa restaurada");
  {
    const c = new ContadorDeUso();
    c.fonte()(u(0.05));
    c.recomecar();
    checar("conversa nova zera", c.total.custo === 0 && c.total.entrada === 0, c.total);
    c.recomecar(u(0.3), ["modelo-a"]);
    const motor = c.fonte();
    motor(u(0.01));
    checar("sessao restaurada continua do gasto que tinha", perto(c.total.custo, 0.31), c.total);
    checar("e dos modelos que tinha", modelosDaConversa(c.modelos).join() === "modelo-a");
  }

  secao("gasto: cache de prompt");
  {
    const c = new ContadorDeUso();
    const f = c.fonte();
    f({ entrada: 10, saida: 1, custo: 0.01, cache: 4 });
    f({ entrada: 20, saida: 2, custo: 0.02, cache: 9 });
    checar("tokens do cache entram pela diferenca", c.total.cache === 9, c.total);
  }

  secao("modelos da conversa");
  {
    const c = new ContadorDeUso();
    c.anotarModelo("anthropic/claude-sonnet-5");
    c.anotarModelo("anthropic/claude-sonnet-5");
    c.anotarModelo("google/gemini-3-flash");
    c.anotarModelo("");
    checar("sem repetir e sem vazio, na ordem de uso", c.modelos.join() === "anthropic/claude-sonnet-5,google/gemini-3-flash", c.modelos);
    checar("a lista devolvida e copia", (c.modelos.push("x"), c.modelos.length === 2));
    checar("lista invalida vinda do arquivo vira vazia", modelosDaConversa("gpt-5").length === 0 && modelosDaConversa([1, "gpt-5"]).join() === "gpt-5");
    checar("na lista, sem o prefixo do provedor", modelosCurtos(["anthropic/claude-sonnet-5", "gemini-3-flash"]) === "claude-sonnet-5, gemini-3-flash");
    checar("conversa antiga, sem modelos, nao quebra", modelosCurtos(undefined) === "");
  }

  secao("conversa guardada vinda do arquivo sincronizado");
  {
    const base = { id: "c1", titulo: "t", quando: 1, itens: [], mensagens: 2, uso: { entrada: 1, saida: 1, custo: 0.1 } };
    const boa = validarItem("conversas", { ...base, modelos: ["gpt-5"], cotacao: 5.4 }) as { modelos?: string[]; cotacao?: number } | null;
    checar("modelos e cotacao passam", boa?.modelos?.join() === "gpt-5" && boa?.cotacao === 5.4, boa);
    const torta = validarItem("conversas", { ...base, modelos: "gpt-5", cotacao: "5,4" }) as Record<string, unknown> | null;
    checar("modelos e cotacao tortos ficam de fora", torta !== null && !("modelos" in torta) && !("cotacao" in torta), torta);
    const antiga = validarItem("conversas", base) as Record<string, unknown> | null;
    checar("conversa antiga continua valendo", antiga !== null && !("modelos" in antiga));
  }
}
